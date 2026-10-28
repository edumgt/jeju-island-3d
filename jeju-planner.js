(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const BOUNDS = { west: 126.12, south: 33.15, east: 127.00, north: 33.60 };
  const MAP_WIDTH = 103;
  const MAP_DEPTH = 57;
  const HEIGHT_FACTOR = 0.008;
  const STORAGE_KEY = 'jeju-studio-plan-v1';
  const PRESETS = [
    { id: 'hallasan', name: '한라산', category: '화산 지형', icon: '⛰', lat: 33.3617, lng: 126.5292 },
    { id: 'seongsan', name: '성산일출봉', category: '자연 명소', icon: '☀', lat: 33.4581, lng: 126.9426 },
    { id: 'hyeopjae', name: '협재해수욕장', category: '해변', icon: '〰', lat: 33.3938, lng: 126.2396 },
    { id: 'jeongbang', name: '정방폭포', category: '자연 명소', icon: '◈', lat: 33.2447, lng: 126.5714 },
    { id: 'airport', name: '제주국제공항', category: '교통', icon: '✈', lat: 33.5104, lng: 126.4914 }
  ];

  const defaultState = () => ({
    markers: PRESETS.slice(0, 3).map(({ id, name, category, lat, lng }) => ({ id, name, category, lat, lng, custom: false })),
    selectedId: null,
    mapStyle: 'natural',
    heightScale: 100,
    showLabels: true,
    showOcean: true
  });

  function cleanState(raw) {
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.markers)) throw new Error('지도 데이터 형식이 올바르지 않습니다.');
    const ids = new Set();
    const markers = raw.markers.slice(0, 50).filter((marker) => {
      if (!marker || typeof marker.id !== 'string' || typeof marker.name !== 'string') return false;
      if (ids.has(marker.id) || !Number.isFinite(Number(marker.lat)) || !Number.isFinite(Number(marker.lng))) return false;
      const lat = Number(marker.lat);
      const lng = Number(marker.lng);
      if (lat < BOUNDS.south || lat > BOUNDS.north || lng < BOUNDS.west || lng > BOUNDS.east) return false;
      ids.add(marker.id);
      return true;
    }).map((marker) => ({
      id: marker.id.slice(0, 60),
      name: marker.name.trim().slice(0, 30) || '이름 없는 장소',
      category: typeof marker.category === 'string' ? marker.category.slice(0, 30) : '내 장소',
      lat: Number(marker.lat),
      lng: Number(marker.lng),
      custom: Boolean(marker.custom)
    }));
    return {
      markers,
      selectedId: markers.some((marker) => marker.id === raw.selectedId) ? raw.selectedId : null,
      mapStyle: raw.mapStyle === 'elevation' ? 'elevation' : 'natural',
      heightScale: Math.min(180, Math.max(40, Number(raw.heightScale) || 100)),
      showLabels: raw.showLabels !== false,
      showOcean: raw.showOcean !== false
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? cleanState(JSON.parse(saved)) : defaultState();
    } catch (_) {
      return defaultState();
    }
  }

  let state = loadState();
  const undoStack = [];
  const redoStack = [];
  const outline = window.JEJU_OUTLINE;
  let scene, camera, renderer, controls, terrain, ocean, shoreline, textures, heightData;
  let renderedHeightScale, renderedMapStyle;
  let markerObjects = [];
  let markerHits = [];
  let viewMode = 'perspective';
  let pickingLocation = false;
  let toastTimer;
  const viewer = $('#viewer');
  const canvasContainer = $('#canvas-container');
  const markerLayer = $('#marker-layer');

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      $('#save-status').textContent = '● 자동 저장';
    } catch (_) {
      $('#save-status').textContent = '저장은 파일로 이용해 주세요';
    }
  }

  function commit(change) {
    const previous = JSON.stringify(state);
    change();
    if (JSON.stringify(state) !== previous) {
      undoStack.push(previous);
      if (undoStack.length > 50) undoStack.shift();
      redoStack.length = 0;
      renderState();
      persist();
    }
  }

  function undo() {
    if (!undoStack.length) return;
    redoStack.push(JSON.stringify(state));
    state = cleanState(JSON.parse(undoStack.pop()));
    renderState();
    persist();
  }

  function redo() {
    if (!redoStack.length) return;
    undoStack.push(JSON.stringify(state));
    state = cleanState(JSON.parse(redoStack.pop()));
    renderState();
    persist();
  }

  function pointInIsland(lat, lng) {
    let inside = false;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
      const [xi, yi] = outline[i];
      const [xj, yj] = outline[j];
      if ((yi > lat) !== (yj > lat) && lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  function worldPosition(lat, lng) {
    return {
      x: ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west) - 0.5) * MAP_WIDTH,
      z: (0.5 - (lat - BOUNDS.south) / (BOUNDS.north - BOUNDS.south)) * MAP_DEPTH
    };
  }

  function heightAt(lat, lng) {
    if (!heightData) return 0;
    const x = Math.max(0, Math.min(heightData.width - 1.001,
      (lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west) * heightData.width - 0.5));
    const y = Math.max(0, Math.min(heightData.height - 1.001,
      (BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south) * heightData.height - 0.5));
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const dx = x - x0, dy = y - y0;
    const index = (row, col) => (row * heightData.width + col) * 4;
    const pixels = heightData.pixels;
    const h00 = pixels[index(y0, x0)];
    const h10 = pixels[index(y0, x0 + 1)];
    const h01 = pixels[index(y0 + 1, x0)];
    const h11 = pixels[index(y0 + 1, x0 + 1)];
    return ((h00 * (1 - dx) + h10 * dx) * (1 - dy) +
      (h01 * (1 - dx) + h11 * dx) * dy) / 255 * 2000;
  }

  function surfaceHeight(lat, lng) {
    return heightAt(lat, lng) * HEIGHT_FACTOR * state.heightScale / 100;
  }

  function markerById(id) {
    return state.markers.find((marker) => marker.id === id);
  }

  function renderPresets() {
    const list = $('#preset-list');
    const query = $('#place-search').value.trim().toLowerCase();
    const matching = PRESETS.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(query));
    list.replaceChildren();
    $('#preset-count').textContent = `${PRESETS.length}곳`;
    if (!matching.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = '검색 결과가 없습니다.';
      list.append(empty);
      return;
    }
    for (const preset of matching) {
      const card = document.createElement('div');
      card.className = 'preset-card';
      const icon = document.createElement('span');
      icon.className = 'preset-icon';
      icon.textContent = preset.icon;
      const copy = document.createElement('span');
      copy.className = 'preset-copy';
      const name = document.createElement('strong');
      name.textContent = preset.name;
      const category = document.createElement('small');
      category.textContent = preset.category;
      copy.append(name, category);
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'preset-add';
      add.dataset.preset = preset.id;
      const added = Boolean(markerById(preset.id));
      add.classList.toggle('is-added', added);
      add.textContent = added ? '✓' : '+';
      add.setAttribute('aria-label', `${preset.name} ${added ? '선택' : '추가'}`);
      card.append(icon, copy, add);
      list.append(card);
    }
  }

  function renderMarkerList() {
    const list = $('#marker-list');
    list.replaceChildren();
    $('#marker-count').textContent = `${state.markers.length}곳`;
    $('#bottom-marker-count').textContent = `${state.markers.length}개의 장소`;
    if (!state.markers.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = '아직 표시한 장소가 없어요.';
      list.append(empty);
      return;
    }
    for (const marker of state.markers) {
      const row = document.createElement('div');
      row.className = `marker-row${marker.id === state.selectedId ? ' is-selected' : ''}${marker.custom ? ' is-custom' : ''}`;
      const dot = document.createElement('span');
      dot.className = 'marker-dot';
      const name = document.createElement('button');
      name.type = 'button';
      name.className = 'marker-name';
      name.dataset.select = marker.id;
      name.textContent = marker.name;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'marker-remove';
      remove.dataset.remove = marker.id;
      remove.textContent = '×';
      remove.setAttribute('aria-label', `${marker.name} 제거`);
      row.append(dot, name, remove);
      list.append(row);
    }
  }

  function renderSelection() {
    const selected = markerById(state.selectedId);
    const card = $('#selection-card');
    card.hidden = !selected;
    if (!selected) return;
    $('#selection-kind').textContent = selected.custom ? 'MY PLACE' : selected.category.toUpperCase();
    $('#selection-name').textContent = selected.name;
    $('#selection-coordinates').textContent = `${selected.lat.toFixed(4)}° N · ${selected.lng.toFixed(4)}° E`;
  }

  function renderState() {
    renderPresets();
    renderMarkerList();
    renderSelection();
    $('#undo').disabled = undoStack.length === 0;
    $('#redo').disabled = redoStack.length === 0;
    $(`input[name="map-style"][value="${state.mapStyle}"]`).checked = true;
    $('#height-scale').value = state.heightScale;
    $('#height-value').textContent = `${state.heightScale}%`;
    $('#toggle-labels').checked = state.showLabels;
    $('#toggle-ocean').checked = state.showOcean;
    markerLayer.style.display = state.showLabels && !pickingLocation ? '' : 'none';
    if (terrain) {
      if (renderedMapStyle !== state.mapStyle) {
        terrain.material.map = textures[state.mapStyle];
        terrain.material.needsUpdate = true;
        renderedMapStyle = state.mapStyle;
      }
      ocean.visible = state.showOcean;
      if (renderedHeightScale !== state.heightScale) updateTerrainHeight();
      syncMarkers();
    }
  }

  function selectMarker(id) {
    state.selectedId = id;
    renderState();
    persist();
  }

  function removeMarker(id) {
    const marker = markerById(id);
    if (!marker) return;
    commit(() => {
      state.markers = state.markers.filter((item) => item.id !== id);
      if (state.selectedId === id) state.selectedId = null;
    });
    showToast(`${marker.name}을(를) 지도에서 제거했어요.`);
  }

  function setTab(tab) {
    document.querySelectorAll('.panel-tab').forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      $(`#panel-${button.dataset.tab}`).hidden = !active;
    });
  }

  function setPickingLocation(enabled) {
    pickingLocation = enabled;
    viewer.classList.toggle('is-picking', enabled);
    $('#pick-instruction').hidden = !enabled;
    markerLayer.style.display = state.showLabels && !enabled ? '' : 'none';
  }

  function savePlan() {
    const file = new Blob([JSON.stringify({ version: 1, ...state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jeju-map.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('지도를 파일로 저장했어요.');
  }

  function setView(mode) {
    if (!camera || !controls) return;
    viewMode = mode;
    const aspect = Math.max(0.4, viewer.clientWidth / Math.max(1, viewer.clientHeight));
    const distance = Math.max(180, 63 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect));
    camera.up.set(0, mode === 'top' ? 0 : 1, mode === 'top' ? -1 : 0);
    controls.target.set(0, -15, 0);
    if (mode === 'top') camera.position.set(0, distance - 17, 0.01);
    else camera.position.set(distance * 0.45, distance * 0.53 - 17, distance * 0.72);
    camera.lookAt(controls.target);
    controls.update();
    document.querySelectorAll('.view-tools [data-action]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.action === mode);
    });
  }

  function zoom(factor) {
    if (!camera || !controls) return;
    const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
    const distance = Math.max(28, Math.min(420, offset.length()));
    offset.setLength(distance);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }

  function initUI() {
    document.querySelectorAll('.panel-tab').forEach((button) => {
      button.addEventListener('click', () => setTab(button.dataset.tab));
    });
    $('#place-search').addEventListener('input', renderPresets);
    $('#preset-list').addEventListener('click', (event) => {
      const button = event.target.closest('[data-preset]');
      if (!button) return;
      const preset = PRESETS.find((item) => item.id === button.dataset.preset);
      if (markerById(preset.id)) {
        selectMarker(preset.id);
        return;
      }
      commit(() => {
        const { id, name, category, lat, lng } = preset;
        state.markers.push({ id, name, category, lat, lng, custom: false });
        state.selectedId = id;
      });
      showToast(`${preset.name}을(를) 지도에 추가했어요.`);
    });
    $('#marker-list').addEventListener('click', (event) => {
      const remove = event.target.closest('[data-remove]');
      const select = event.target.closest('[data-select]');
      if (remove) removeMarker(remove.dataset.remove);
      else if (select) selectMarker(select.dataset.select);
    });
    $('#custom-marker-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('#custom-name').value.trim();
      const lat = Number($('#custom-lat').value);
      const lng = Number($('#custom-lng').value);
      if (!name || !Number.isFinite(lat) || !Number.isFinite(lng) || !pointInIsland(lat, lng)) {
        showToast('제주도 안의 위도·경도를 입력해 주세요.');
        return;
      }
      if (state.markers.length >= 50) {
        showToast('장소는 최대 50곳까지 표시할 수 있어요.');
        return;
      }
      commit(() => {
        const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        state.markers.push({ id, name, category: '내 장소', lat, lng, custom: true });
        state.selectedId = id;
      });
      $('#custom-marker-form').reset();
      $('#add-details').open = false;
      setPickingLocation(false);
      showToast(`${name}을(를) 지도에 추가했어요.`);
    });
    $('#pick-location').addEventListener('click', () => {
      if (!terrain) {
        showToast('지도가 준비된 뒤 위치를 고를 수 있어요.');
        return;
      }
      setPickingLocation(true);
      $('#sidebar').classList.remove('is-open');
      $('#mobile-menu').setAttribute('aria-expanded', 'false');
      showToast('제주도 섬 위를 클릭해 주세요.');
    });
    $('#cancel-pick').addEventListener('click', () => setPickingLocation(false));
    document.querySelectorAll('input[name="map-style"]').forEach((input) => {
      input.addEventListener('change', () => commit(() => { state.mapStyle = input.value; }));
    });
    $('#height-scale').addEventListener('change', (event) => {
      const value = Number(event.target.value);
      commit(() => { state.heightScale = value; });
    });
    $('#toggle-labels').addEventListener('change', (event) => commit(() => { state.showLabels = event.target.checked; }));
    $('#toggle-ocean').addEventListener('change', (event) => commit(() => { state.showOcean = event.target.checked; }));
    $('#undo').addEventListener('click', undo);
    $('#redo').addEventListener('click', redo);
    $('#close-selection').addEventListener('click', () => selectMarker(null));
    $('#remove-selection').addEventListener('click', () => removeMarker(state.selectedId));
    $('#save-plan').addEventListener('click', savePlan);
    $('#bottom-save').addEventListener('click', savePlan);
    $('#open-plan').addEventListener('click', () => $('#plan-file').click());
    $('#guide-open-plan').addEventListener('click', () => $('#plan-file').click());
    $('#plan-file').addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const imported = cleanState(JSON.parse(await file.text()));
        commit(() => { state = imported; });
        setPickingLocation(false);
        showToast('저장한 지도를 열었어요.');
      } catch (_) {
        showToast('지도 파일을 읽을 수 없어요.');
      }
      event.target.value = '';
    });
    $('#reset-plan').addEventListener('click', () => {
      commit(() => { state = defaultState(); });
      setPickingLocation(false);
      setView('perspective');
      showToast('처음 지도 구성으로 돌아왔어요.');
    });
    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'perspective' || action === 'top') setView(action);
        if (action === 'focus') setView(viewMode);
        if (action === 'zoom-in') zoom(0.82);
        if (action === 'zoom-out') zoom(1.22);
      });
    });
    $('#mobile-menu').addEventListener('click', () => {
      const open = $('#sidebar').classList.toggle('is-open');
      $('#mobile-menu').setAttribute('aria-expanded', String(open));
      $('#mobile-menu').setAttribute('aria-label', open ? '편집 메뉴 닫기' : '편집 메뉴 열기');
    });
    renderState();
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`${url}을(를) 불러올 수 없습니다.`));
      image.src = url;
    });
  }

  function loadTexture(url) {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(url, (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        resolve(texture);
      }, undefined, reject);
    });
  }

  function resize() {
    if (!renderer || !camera) return;
    const width = Math.max(1, viewer.clientWidth);
    const height = Math.max(1, viewer.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function buildIslandBase() {
    const shape = new THREE.Shape();
    outline.forEach(([lng, lat], index) => {
      const { x, z } = worldPosition(lat, lng);
      if (index === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    });
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1.45, bevelEnabled: false, steps: 1 });
    geometry.rotateX(Math.PI / 2);
    const base = new THREE.Mesh(geometry, [
      new THREE.MeshStandardMaterial({ color: 0xcdd9c5, roughness: 1 }),
      new THREE.MeshStandardMaterial({ color: 0xe0e8dc, roughness: 1 })
    ]);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);

    const points = outline.map(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      return new THREE.Vector3(x, 0.12, z);
    });
    shoreline = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xf2f4e8, transparent: true, opacity: 0.7 })
    );
    scene.add(shoreline);
  }

  function buildTerrain() {
    const columns = 320;
    const rows = 160;
    const positions = new Float32Array((columns + 1) * (rows + 1) * 3);
    const uvs = new Float32Array((columns + 1) * (rows + 1) * 2);
    const indices = [];
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const index = row * (columns + 1) + column;
        positions[index * 3] = (column / columns - 0.5) * MAP_WIDTH;
        positions[index * 3 + 2] = (row / rows - 0.5) * MAP_DEPTH;
        uvs[index * 2] = column / columns;
        uvs[index * 2 + 1] = 1 - row / rows;
        if (row < rows && column < columns) {
          const next = index + columns + 1;
          indices.push(index, next, index + 1, index + 1, next, next + 1);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      map: textures[state.mapStyle],
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
      roughness: 0.94,
      metalness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -1
    }));
    terrain.receiveShadow = true;
    scene.add(terrain);
    renderedMapStyle = state.mapStyle;
    updateTerrainHeight();
  }

  function updateTerrainHeight() {
    if (!terrain) return;
    const position = terrain.geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const lng = BOUNDS.west + (position.getX(i) / MAP_WIDTH + 0.5) * (BOUNDS.east - BOUNDS.west);
      const lat = BOUNDS.north - (position.getZ(i) / MAP_DEPTH + 0.5) * (BOUNDS.north - BOUNDS.south);
      position.setY(i, surfaceHeight(lat, lng) + 0.035);
    }
    position.needsUpdate = true;
    terrain.geometry.computeVertexNormals();
    terrain.geometry.computeBoundingSphere();
    renderedHeightScale = state.heightScale;
  }

  function syncMarkers() {
    if (!scene) return;
    markerObjects.forEach(({ group, label }) => {
      scene.remove(group);
      group.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
      label.remove();
    });
    markerObjects = [];
    markerHits = [];
    for (const marker of state.markers) {
      const { x, z } = worldPosition(marker.lat, marker.lng);
      const y = surfaceHeight(marker.lat, marker.lng);
      const selected = marker.id === state.selectedId;
      const color = marker.custom ? 0xe78355 : 0x1769c1;
      const group = new THREE.Group();
      group.position.set(x, y, z);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 2.0, 8),
        new THREE.MeshBasicMaterial({ color })
      );
      stem.position.y = 1.1;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(selected ? 0.7 : 0.57, 16, 12),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4, emissive: color, emissiveIntensity: selected ? 0.27 : 0.08 })
      );
      head.position.y = 2.3;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(selected ? 0.77 : 0.47, selected ? 0.91 : 0.58, 32),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: selected ? 0.85 : 0.6 })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.15;
      group.add(stem, head, ring);
      scene.add(group);
      head.userData.markerId = marker.id;
      stem.userData.markerId = marker.id;
      markerHits.push(head, stem);

      const label = document.createElement('button');
      label.type = 'button';
      label.className = `map-label${marker.custom ? ' is-custom' : ''}${selected ? ' is-selected' : ''}`;
      label.textContent = marker.name;
      label.addEventListener('click', () => selectMarker(marker.id));
      markerLayer.append(label);
      markerObjects.push({ marker, group, label });
    }
  }

  function updateLabels() {
    if (!camera || !state.showLabels) return;
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    for (const { group, label } of markerObjects) {
      const point = new THREE.Vector3(group.position.x, group.position.y + 2.9, group.position.z).project(camera);
      const x = (point.x * 0.5 + 0.5) * width;
      const y = (-point.y * 0.5 + 0.5) * height;
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      label.hidden = point.z < -1 || point.z > 1 || x < 5 || x > width - 5 || y < 20 || y > height - 80;
    }
  }

  async function initScene() {
    if (!window.THREE || !THREE.OrbitControls || !Array.isArray(outline) || !window.JEJU_ASSETS) {
      throw new Error('3D 라이브러리를 불러오지 못했습니다.');
    }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xf2f8f8, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.append(renderer.domElement);
    resize();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 28;
    controls.maxDistance = 420;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.enablePan = true;

    const ambient = new THREE.HemisphereLight(0xffffff, 0xb5c5c8, 0.82);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff, 0.78);
    light.position.set(-35, 85, 45);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.camera.left = -85;
    light.shadow.camera.right = 85;
    light.shadow.camera.top = 85;
    light.shadow.camera.bottom = -85;
    light.shadow.bias = -0.00015;
    scene.add(light);

    ocean = new THREE.Mesh(
      new THREE.BoxGeometry(118, 1.1, 69),
      new THREE.MeshBasicMaterial({ color: 0xc5e1ea, toneMapped: false })
    );
    ocean.position.y = -2.05;
    ocean.receiveShadow = true;
    scene.add(ocean);
    const oceanRim = new THREE.Mesh(
      new THREE.BoxGeometry(120, 0.65, 71),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
    );
    oceanRim.position.y = -0.85;
    ocean.add(oceanRim);

    const [image, natural, elevation] = await Promise.all([
      loadImage(window.JEJU_ASSETS.height),
      loadTexture(window.JEJU_ASSETS.natural),
      loadTexture(window.JEJU_ASSETS.elevation)
    ]);
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = image.width;
    sourceCanvas.height = image.height;
    const context = sourceCanvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    heightData = { width: image.width, height: image.height, pixels: context.getImageData(0, 0, image.width, image.height).data };
    textures = { natural, elevation };
    buildIslandBase();
    buildTerrain();
    ocean.visible = state.showOcean;
    syncMarkers();
    setView('perspective');
    $('#loading').hidden = true;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStart;
    renderer.domElement.addEventListener('pointerdown', (event) => {
      pointerStart = { x: event.clientX, y: event.clientY };
    });
    renderer.domElement.addEventListener('pointerup', (event) => {
      if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      if (pickingLocation) {
        const terrainHit = raycaster.intersectObject(terrain, false)[0];
        if (terrainHit) {
          const lat = BOUNDS.north - (terrainHit.point.z / MAP_DEPTH + 0.5) * (BOUNDS.north - BOUNDS.south);
          const lng = BOUNDS.west + (terrainHit.point.x / MAP_WIDTH + 0.5) * (BOUNDS.east - BOUNDS.west);
          if (pointInIsland(lat, lng)) {
            $('#custom-lat').value = lat.toFixed(5);
            $('#custom-lng').value = lng.toFixed(5);
            $('#add-details').open = true;
            setTab('places');
            setPickingLocation(false);
            $('#sidebar').classList.add('is-open');
            $('#mobile-menu').setAttribute('aria-expanded', 'true');
            $('#custom-name').focus();
            showToast('위치를 골랐어요. 장소 이름을 입력해 주세요.');
            return;
          }
        }
        showToast('제주도 섬 위를 클릭해 주세요.');
        return;
      }
      const hit = raycaster.intersectObjects(markerHits, false)[0];
      if (hit) selectMarker(hit.object.userData.markerId);
    });
    window.addEventListener('resize', resize);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(viewer);
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      updateLabels();
      renderer.render(scene, camera);
    };
    animate();
  }

  initUI();
  initScene().catch((error) => {
    const loading = $('#loading');
    loading.querySelector('.loading-spinner').hidden = true;
    loading.querySelector('strong').textContent = '3D 지도를 불러오지 못했어요.';
    loading.querySelector('small').textContent = error.message;
    console.error(error);
  });
})();
