(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);

  // Region Definitions: Jeju Island & Busan Haeundae
  const PRESETS_JEJU = [
    { id: 'hallasan', name: '한라산', category: '화산 지형', icon: '⛰', lat: 33.3617, lng: 126.5292 },
    { id: 'seongsan', name: '성산일출봉', category: '자연 명소', icon: '☀', lat: 33.4581, lng: 126.9426 },
    { id: 'hyeopjae', name: '협재해수욕장', category: '해변', icon: '〰', lat: 33.3938, lng: 126.2396 },
    { id: 'jeongbang', name: '정방폭포', category: '자연 명소', icon: '◈', lat: 33.2447, lng: 126.5714 },
    { id: 'airport', name: '제주국제공항', category: '교통', icon: '✈', lat: 33.5104, lng: 126.4914 }
  ];

  const REGIONS = {
    jeju: {
      id: 'jeju',
      name: '제주도',
      subTitle: '한라산·성산일출봉',
      brandTitle: 'JEJU STUDIO',
      brandSub: '나만의 제주도 3D 지도',
      brandMark: 'J',
      brandColor: '#1769c1',
      storageKey: 'jeju-studio-plan-v1',
      sidebarEyebrow: 'YOUR ISLAND, YOUR MAP',
      sidebarTitle: '제주를<br>새롭게 살펴보세요.',
      sidebarDesc: '실제 해안선과 고도를 바탕으로 장소를 고르고, 원하는 시점에서 지도를 완성해 보세요.',
      viewerTitle: 'Jeju Island',
      viewerSub: '대한민국 · 북위 33.38°',
      summaryTitle: '나만의 제주 지도',
      bounds: { west: 126.12, south: 33.15, east: 127.00, north: 33.60 },
      mapWidth: 103,
      mapDepth: 57,
      heightFactor: 0.008,
      droneAltitudeMeters: 100,
      oceanBox: [118, 1.1, 69],
      oceanRimBox: [120, 0.65, 71],
      lightPos: [-35, 85, 45],
      defaultCamDistance: 180,
      customDefaults: { latMin: 33.15, latMax: 33.60, latPlaceholder: '33.3617', lngMin: 126.12, lngMax: 127.00, lngPlaceholder: '126.5292' },
      presets: PRESETS_JEJU
    },
    haeundae: {
      id: 'haeundae',
      name: '부산 해운대',
      subTitle: '해수욕장·동백섬',
      brandTitle: 'HAEUNDAE STUDIO',
      brandSub: '부산 해운대 3D 입체 지도',
      brandMark: 'B',
      brandColor: '#0077b6',
      storageKey: 'haeundae-studio-plan-v1',
      sidebarEyebrow: 'YOUR COAST, YOUR MAP',
      sidebarTitle: '부산 해운대를<br>3D로 입체 탐험하세요.',
      sidebarDesc: '동백섬부터 해운대 백사장, 달맞이길과 장산까지 해운대의 대표 명소를 3D로 플래닝해 보세요.',
      viewerTitle: 'Busan Haeundae',
      viewerSub: '대한민국 부산광역시 · 북위 35.16°',
      summaryTitle: '나만의 해운대 지도',
      bounds: { west: 129.130, south: 35.145, east: 129.200, north: 35.195 },
      mapWidth: 100,
      mapDepth: 65,
      heightFactor: 0.016,
      droneAltitudeMeters: 80,
      oceanBox: [115, 1.1, 75],
      oceanRimBox: [117, 0.65, 77],
      lightPos: [-30, 85, 40],
      defaultCamDistance: 165,
      customDefaults: { latMin: 35.145, latMax: 35.195, latPlaceholder: '35.1587', lngMin: 129.130, lngMax: 129.200, lngPlaceholder: '129.1604' },
      presets: window.HAEUNDAE_PRESETS || []
    }
  };

  let currentRegionId = 'jeju';
  function getRegion() {
    return REGIONS[currentRegionId];
  }

  const defaultState = (region) => ({
    markers: region.presets.slice(0, 3).map(({ id, name, category, lat, lng }) => ({ id, name, category, lat, lng, custom: false })),
    selectedId: null,
    mapStyle: 'natural',
    heightScale: 100,
    showLabels: true,
    showOcean: true,
    showRoads: true,
    weather: 'clear',
    weatherIntensity: 2,
    windEffect: true,
    soundEnabled: false
  });

  function cleanState(raw, region) {
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.markers)) throw new Error('지도 데이터 형식이 올바르지 않습니다.');
    const bounds = region.bounds;
    const ids = new Set();
    const markers = raw.markers.slice(0, 50).filter((marker) => {
      if (!marker || typeof marker.id !== 'string' || typeof marker.name !== 'string') return false;
      if (ids.has(marker.id) || !Number.isFinite(Number(marker.lat)) || !Number.isFinite(Number(marker.lng))) return false;
      const lat = Number(marker.lat);
      const lng = Number(marker.lng);
      if (lat < bounds.south || lat > bounds.north || lng < bounds.west || lng > bounds.east) return false;
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
      showOcean: raw.showOcean !== false,
      showRoads: raw.showRoads !== false,
      weather: ['rain', 'snow', 'mist'].includes(raw.weather) ? raw.weather : 'clear',
      weatherIntensity: Math.min(3, Math.max(1, Number(raw.weatherIntensity) || 2)),
      windEffect: raw.windEffect !== false,
      soundEnabled: Boolean(raw.soundEnabled)
    };
  }

  function loadState(region) {
    try {
      const saved = localStorage.getItem(region.storageKey);
      return saved ? cleanState(JSON.parse(saved), region) : defaultState(region);
    } catch (_) {
      return defaultState(region);
    }
  }

  let state = loadState(getRegion());
  const undoStack = [];
  const redoStack = [];

  // Three.js and Scene Variables
  let scene, camera, renderer, controls, terrain, ocean, oceanRim, shoreline, baseMesh, roadGroup;
  let ambientLight, sunLight;
  let weatherGroup, rainPoints, splashPoints, snowPoints, mistPoints;
  let rainGeo, splashGeo, snowGeo, mistGeo;
  let rainPositions, splashPositions, splashAges, snowPositions, mistPositions;
  let maxRainCount = 4500;
  let maxSplashCount = 300;
  let maxSnowCount = 3500;
  let maxMistCount = 45;
  let weatherAudioCtx = null;
  let rainGain = null;
  let windGain = null;
  let ambientNoiseNode = null;
  let regionCaches = {}; // Caches for heightData, textures, outline, roads per region
  let renderedHeightScale, renderedMapStyle, renderedWeather;
  let markerObjects = [];
  let markerHits = [];
  let viewMode = 'perspective';
  let pickingLocation = false;
  let toastTimer;
  let droneMode = false;
  let droneYaw = 0;
  let dronePitch = -0.16;
  let droneTargetSpeed = 0;
  let droneBank = 0;
  let lastFrameTime = 0;
  const droneKeys = new Set();
  const droneVelocity = new THREE.Vector3();

  const viewer = $('#viewer');
  const canvasContainer = $('#canvas-container');
  const markerLayer = $('#marker-layer');

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function persist() {
    try {
      localStorage.setItem(getRegion().storageKey, JSON.stringify(state));
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
    state = cleanState(JSON.parse(undoStack.pop()), getRegion());
    renderState();
    persist();
  }

  function redo() {
    if (!redoStack.length) return;
    undoStack.push(JSON.stringify(state));
    state = cleanState(JSON.parse(redoStack.pop()), getRegion());
    renderState();
    persist();
  }

  function getOutline() {
    return currentRegionId === 'jeju' ? window.JEJU_OUTLINE : window.HAEUNDAE_OUTLINE;
  }

  function getRoadWays() {
    if (currentRegionId === 'jeju') {
      return Array.isArray(window.JEJU_ROADS) ? window.JEJU_ROADS.map((road) => ({
        tags: { highway: road.type, name: road.name },
        geometry: road.points.map(([lat, lon]) => ({ lat, lon }))
      })) : [];
    } else {
      return Array.isArray(window.HAEUNDAE_ROADS) ? window.HAEUNDAE_ROADS.map((road) => ({
        tags: { highway: road.type, name: road.name },
        geometry: road.points.map(([lat, lon]) => ({ lat, lon }))
      })) : [];
    }
  }

  function pointInLand(lat, lng) {
    const outline = getOutline();
    if (!outline || !outline.length) return true;
    let inside = false;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
      const [xi, yi] = outline[i];
      const [xj, yj] = outline[j];
      if ((yi > lat) !== (yj > lat) && lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  function worldPosition(lat, lng) {
    const r = getRegion();
    return {
      x: ((lng - r.bounds.west) / (r.bounds.east - r.bounds.west) - 0.5) * r.mapWidth,
      z: (0.5 - (lat - r.bounds.south) / (r.bounds.north - r.bounds.south)) * r.mapDepth
    };
  }

  function heightAt(lat, lng) {
    const cache = regionCaches[currentRegionId];
    if (!cache || !cache.heightData) return 0;
    const r = getRegion();
    const hd = cache.heightData;
    const x = Math.max(0, Math.min(hd.width - 1.001,
      (lng - r.bounds.west) / (r.bounds.east - r.bounds.west) * hd.width - 0.5));
    const y = Math.max(0, Math.min(hd.height - 1.001,
      (r.bounds.north - lat) / (r.bounds.north - r.bounds.south) * hd.height - 0.5));
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const dx = x - x0, dy = y - y0;
    const index = (row, col) => (row * hd.width + col) * 4;
    const pixels = hd.pixels;
    const h00 = pixels[index(y0, x0)];
    const h10 = pixels[index(y0, x0 + 1)];
    const h01 = pixels[index(y0 + 1, x0)];
    const h11 = pixels[index(y0 + 1, x0 + 1)];
    const maxMeters = currentRegionId === 'jeju' ? 2000 : 650;
    return ((h00 * (1 - dx) + h10 * dx) * (1 - dy) +
      (h01 * (1 - dx) + h11 * dx) * dy) / 255 * maxMeters;
  }

  function surfaceHeight(lat, lng) {
    const r = getRegion();
    return heightAt(lat, lng) * r.heightFactor * state.heightScale / 100;
  }

  function surfaceHeightAtWorld(x, z) {
    const r = getRegion();
    const lat = r.bounds.north - (z / r.mapDepth + 0.5) * (r.bounds.north - r.bounds.south);
    const lng = r.bounds.west + (x / r.mapWidth + 0.5) * (r.bounds.east - r.bounds.west);
    return surfaceHeight(lat, lng);
  }

  function markerById(id) {
    return state.markers.find((marker) => marker.id === id);
  }

  function renderPresets() {
    const list = $('#preset-list');
    const query = $('#place-search').value.trim().toLowerCase();
    const region = getRegion();
    const matching = region.presets.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(query));
    list.replaceChildren();
    $('#preset-count').textContent = `${region.presets.length}곳`;
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
    $('#road-toggle').classList.toggle('is-active', state.showRoads);
    $('#road-toggle').setAttribute('aria-pressed', String(state.showRoads));
    $('#road-toggle').setAttribute('aria-label', `주요 도로 안내 ${state.showRoads ? '끄기' : '켜기'}`);
    markerLayer.style.display = state.showLabels && !pickingLocation ? '' : 'none';

    const weatherRadio = $(`input[name="weather-mode"][value="${state.weather}"]`);
    if (weatherRadio) weatherRadio.checked = true;
    const weatherIntensityInp = $('#weather-intensity');
    if (weatherIntensityInp) weatherIntensityInp.value = state.weatherIntensity;
    const toggleWindInp = $('#toggle-wind');
    if (toggleWindInp) toggleWindInp.checked = state.windEffect;
    const toggleSoundInp = $('#toggle-sound');
    if (toggleSoundInp) toggleSoundInp.checked = state.soundEnabled;

    applyWeatherAtmosphere();
    updateWeatherAudio();

    const cache = regionCaches[currentRegionId];
    if (terrain && cache && cache.textures) {
      if (renderedMapStyle !== state.mapStyle) {
        terrain.material.map = cache.textures[state.mapStyle];
        if (cache.textures.normal && !terrain.material.normalMap) {
          terrain.material.normalMap = cache.textures.normal;
          terrain.material.normalScale.set(1.15, 1.15);
        }
        terrain.material.needsUpdate = true;
        renderedMapStyle = state.mapStyle;
      }
      if (ocean) ocean.visible = state.showOcean;
      if (roadGroup) roadGroup.visible = state.showRoads;
      const roadWays = getRoadWays();
      $('#road-legend').hidden = !state.showRoads || !roadWays.length;
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
    const r = getRegion();
    const file = new Blob([JSON.stringify({ region: r.id, version: 1, ...state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${r.id}-map.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('지도를 파일로 저장했어요.');
  }

  function setView(mode) {
    if (!camera || !controls) return;
    if (droneMode) setDroneMode(false);
    viewMode = mode;
    const r = getRegion();
    const aspect = Math.max(0.4, viewer.clientWidth / Math.max(1, viewer.clientHeight));
    const distance = Math.max(r.defaultCamDistance, (r.mapWidth * 0.62) / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect));
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

  function updateDroneCamera() {
    const horizontal = Math.cos(dronePitch);
    const direction = new THREE.Vector3(
      Math.sin(droneYaw) * horizontal,
      Math.sin(dronePitch),
      Math.cos(droneYaw) * horizontal
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(camera.position.clone().add(direction));
  }

  function droneAltitudeAt(position) {
    const r = getRegion();
    const lat = r.bounds.north - (position.z / r.mapDepth + 0.5) * (r.bounds.north - r.bounds.south);
    const lng = r.bounds.west + (position.x / r.mapWidth + 0.5) * (r.bounds.east - r.bounds.west);
    const altitude = r.droneAltitudeMeters * r.heightFactor * state.heightScale / 100;
    return surfaceHeight(lat, lng) + altitude;
  }

  function setDroneMode(enabled) {
    if (!camera || !controls || !terrain) {
      showToast('지도가 준비된 뒤 드론 보기를 사용할 수 있어요.');
      return;
    }
    droneMode = enabled;
    droneKeys.clear();
    viewer.classList.toggle('is-drone', enabled);
    $('#drone-hud').hidden = !enabled;
    $('#drone-toggle').classList.toggle('is-active', enabled);
    $('#drone-toggle').setAttribute('aria-pressed', String(enabled));
    $('#drone-toggle').setAttribute('aria-label', `드론 비행 보기 ${enabled ? '끄기' : '켜기'}`);
    const r = getRegion();
    if (enabled) {
      controls.enabled = false;
      viewMode = 'drone';
      camera.position.set(-18, 20, 24);
      const towardCenter = new THREE.Vector3(0, 0, 0).sub(camera.position);
      droneYaw = Math.atan2(towardCenter.x, towardCenter.z);
      dronePitch = -0.16;
      droneTargetSpeed = 0;
      droneBank = 0;
      camera.position.y = droneAltitudeAt(camera.position);
      droneVelocity.set(0, 0, 0);
      updateDroneCamera();
      showToast(`방향키로 천천히 ${r.name}를 둘러보세요. 고도는 지형 위 ${r.droneAltitudeMeters}m로 유지됩니다.`);
    } else {
      droneTargetSpeed = 0;
      droneVelocity.set(0, 0, 0);
      controls.enabled = true;
      setView('perspective');
      showToast('드론 비행을 종료했어요.');
    }
  }

  function updateDroneFlight(delta) {
    if (!droneMode) return;
    const r = getRegion();
    const turn = (droneKeys.has('ArrowRight') ? 1 : 0) - (droneKeys.has('ArrowLeft') ? 1 : 0);
    droneYaw -= turn * delta * 0.7;
    const throttle = (droneKeys.has('ArrowUp') ? 1 : 0) - (droneKeys.has('ArrowDown') ? 1 : 0);
    droneTargetSpeed = throttle * 1.15;
    const desiredVelocity = new THREE.Vector3(Math.sin(droneYaw) * droneTargetSpeed, 0, Math.cos(droneYaw) * droneTargetSpeed);
    droneVelocity.lerp(desiredVelocity, 1 - Math.exp(-delta * 2.7));
    camera.position.addScaledVector(droneVelocity, delta);
    const boundedX = THREE.MathUtils.clamp(camera.position.x, -r.mapWidth * 0.68, r.mapWidth * 0.68);
    const boundedZ = THREE.MathUtils.clamp(camera.position.z, -r.mapDepth * 0.68, r.mapDepth * 0.68);
    if (boundedX !== camera.position.x || boundedZ !== camera.position.z) droneTargetSpeed = 0;
    camera.position.x = boundedX;
    camera.position.z = boundedZ;
    camera.position.y = droneAltitudeAt(camera.position);
    updateDroneCamera();
    droneBank += (-turn * 0.14 - droneBank) * (1 - Math.exp(-delta * 5));
    camera.rotation.z = droneBank;
    $('#drone-speed').textContent = `${r.droneAltitudeMeters}m`;
  }

  function applyRegionUI() {
    const r = getRegion();
    // Brand update
    $('#brand-mark').textContent = r.brandMark;
    $('#brand-mark').style.background = r.brandColor;
    $('#brand-title').textContent = r.brandTitle;
    $('#brand-sub').textContent = r.brandSub;

    // GNB Tab state
    document.querySelectorAll('.dest-tab').forEach((tab) => {
      const active = tab.dataset.region === r.id;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    // Sidebar text
    $('#sidebar-eyebrow').textContent = r.sidebarEyebrow;
    $('#sidebar-title').innerHTML = r.sidebarTitle;
    $('#sidebar-desc').textContent = r.sidebarDesc;
    const kicker = $('#sidebar-kicker');
    if (kicker) kicker.textContent = r.id === 'jeju' ? 'EXPLORE JEJU' : 'EXPLORE HAEUNDAE';
    const styleLead = $('#panel-lead-style');
    if (styleLead) styleLead.textContent = r.id === 'jeju' ? '한라산의 높낮이와 해안선을 원하는 방식으로 살펴보세요.' : '장산과 동백섬, 해안선의 높낮이를 원하는 방식으로 살펴보세요.';
    const customName = $('#custom-name');
    if (customName) customName.placeholder = r.id === 'jeju' ? '예: 나만의 제주 장소' : '예: 나만의 해운대 장소';

    // Viewer badges
    $('#viewer-region-name').textContent = r.viewerTitle;
    $('#viewer-region-coord').textContent = r.viewerSub;
    $('#bottom-summary-title').textContent = r.summaryTitle;

    // Form inputs
    const latInp = $('#custom-lat');
    const lngInp = $('#custom-lng');
    latInp.min = r.customDefaults.latMin;
    latInp.max = r.customDefaults.latMax;
    latInp.placeholder = r.customDefaults.latPlaceholder;
    lngInp.min = r.customDefaults.lngMin;
    lngInp.max = r.customDefaults.lngMax;
    lngInp.placeholder = r.customDefaults.lngPlaceholder;

    // Search reset
    $('#place-search').value = '';
  }

  async function switchRegion(newRegionId) {
    if (newRegionId === currentRegionId) return;
    persist(); // Save current region state first

    currentRegionId = newRegionId;
    const r = getRegion();
    applyRegionUI();

    // Load state for the new region
    state = loadState(r);
    undoStack.length = 0;
    redoStack.length = 0;

    // Show loading indicator
    const loading = $('#loading');
    loading.hidden = false;
    $('#loading-title').textContent = `${r.name} 3D 지도를 불러오는 중`;
    $('#loading-sub').textContent = '해안선과 고도 지형을 준비하고 있어요.';

    try {
      await prepareRegionAssets(r.id);
      rebuildRegionScene();
      setView('perspective');
      renderState();
      loading.hidden = true;
      showToast(`${r.name} 3D 플래너로 전환했어요.`);
    } catch (err) {
      console.error(err);
      loading.hidden = true;
      showToast(`${r.name} 지도를 불러오는데 실패했습니다.`);
    }
  }

  function initUI() {
    // Destination Tabs in GNB
    document.querySelectorAll('.dest-tab').forEach((button) => {
      button.addEventListener('click', () => {
        const dest = button.dataset.region;
        if (dest) switchRegion(dest);
      });
    });

    document.querySelectorAll('.panel-tab').forEach((button) => {
      button.addEventListener('click', () => setTab(button.dataset.tab));
    });
    $('#place-search').addEventListener('input', renderPresets);
    $('#preset-list').addEventListener('click', (event) => {
      const button = event.target.closest('[data-preset]');
      if (!button) return;
      const r = getRegion();
      const preset = r.presets.find((item) => item.id === button.dataset.preset);
      if (markerById(preset.id)) {
        selectMarker(preset.id);
        return;
      }
      commit(() => {
        state.markers.push({ ...preset, custom: false });
        state.selectedId = preset.id;
      });
      showToast(`${preset.name}을(를) 지도에 추가했어요.`);
    });
    $('#marker-list').addEventListener('click', (event) => {
      const selectButton = event.target.closest('[data-select]');
      if (selectButton) {
        selectMarker(selectButton.dataset.select);
        return;
      }
      const removeButton = event.target.closest('[data-remove]');
      if (removeButton) removeMarker(removeButton.dataset.remove);
    });
    $('#pick-location').addEventListener('click', () => {
      setPickingLocation(true);
      showToast('지도 위를 클릭해 원하는 위치를 지정하세요.');
    });
    const cancelPick = $('#cancel-pick');
    if (cancelPick) cancelPick.addEventListener('click', () => setPickingLocation(false));

    const customForm = $('#custom-marker-form') || $('#custom-place-form');
    if (customForm) {
      customForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = $('#custom-name').value.trim();
        const lat = Number($('#custom-lat').value);
        const lng = Number($('#custom-lng').value);
        const r = getRegion();
        if (!name) return;
        if (!pointInLand(lat, lng)) {
          showToast(`${r.name} 영역 안의 위치를 입력해 주세요.`);
          return;
        }
        const id = `custom-${Date.now()}`;
        commit(() => {
          state.markers.push({ id, name, category: '내 장소', lat, lng, custom: true });
          state.selectedId = id;
        });
        $('#custom-name').value = '';
        $('#custom-lat').value = '';
        $('#custom-lng').value = '';
        $('#add-details').open = false;
        showToast(`${name}을(를) 지도에 추가했어요.`);
      });
    }
    document.querySelectorAll('input[name="map-style"]').forEach((radio) => {
      radio.addEventListener('change', (event) => {
        commit(() => { state.mapStyle = event.target.value; });
      });
    });
    $('#height-scale').addEventListener('input', (event) => {
      $('#height-value').textContent = `${event.target.value}%`;
    });
    $('#height-scale').addEventListener('change', (event) => {
      const value = Number(event.target.value);
      commit(() => { state.heightScale = value; });
    });
    $('#toggle-labels').addEventListener('change', (event) => commit(() => { state.showLabels = event.target.checked; }));
    $('#toggle-ocean').addEventListener('change', (event) => commit(() => { state.showOcean = event.target.checked; }));

    document.querySelectorAll('input[name="weather-mode"]').forEach((radio) => {
      radio.addEventListener('change', (event) => {
        commit(() => { state.weather = event.target.value; });
        const names = { clear: '맑음', rain: '비', snow: '눈', mist: '안개' };
        showToast(`날씨: ${names[event.target.value] || event.target.value}`);
      });
    });
    const weatherIntensityInput = $('#weather-intensity');
    if (weatherIntensityInput) {
      weatherIntensityInput.addEventListener('input', (event) => {
        const intLabels = { 1: '약하게', 2: '보통', 3: '강하게' };
        const label = $('#weather-intensity-val');
        if (label) label.textContent = intLabels[event.target.value] || '보통';
      });
      weatherIntensityInput.addEventListener('change', (event) => {
        commit(() => { state.weatherIntensity = Number(event.target.value); });
      });
    }
    const toggleWind = $('#toggle-wind');
    if (toggleWind) {
      toggleWind.addEventListener('change', (event) => {
        commit(() => { state.windEffect = event.target.checked; });
      });
    }
    const toggleSound = $('#toggle-sound');
    if (toggleSound) {
      toggleSound.addEventListener('change', (event) => {
        commit(() => { state.soundEnabled = event.target.checked; });
        if (event.target.checked) showToast('환경 효과음을 켰어요.');
      });
    }
    const quickWeatherBtn = $('#weather-quick-toggle');
    if (quickWeatherBtn) {
      quickWeatherBtn.addEventListener('click', () => {
        const order = ['clear', 'rain', 'snow', 'mist'];
        const next = order[(order.indexOf(state.weather) + 1) % order.length];
        commit(() => { state.weather = next; });
        const names = { clear: '맑음', rain: '비', snow: '눈', mist: '안개' };
        showToast(`날씨 효과: ${names[next]}`);
      });
    }

    $('#road-toggle').addEventListener('click', () => commit(() => { state.showRoads = !state.showRoads; }));
    $('#drone-toggle').addEventListener('click', () => setDroneMode(!droneMode));
    window.addEventListener('keydown', (event) => {
      if (!droneMode) return;
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) return;
      event.preventDefault();
      droneKeys.add(event.code);
    });
    window.addEventListener('keyup', (event) => droneKeys.delete(event.code));
    window.addEventListener('blur', () => droneKeys.clear());
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
        const parsed = JSON.parse(await file.text());
        const imported = cleanState(parsed, getRegion());
        commit(() => { state = imported; });
        setPickingLocation(false);
        showToast('저장한 지도를 열었어요.');
      } catch (_) {
        showToast('지도 파일을 읽을 수 없어요.');
      }
      event.target.value = '';
    });
    $('#reset-plan').addEventListener('click', () => {
      commit(() => { state = defaultState(getRegion()); });
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
    applyRegionUI();
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

  async function prepareRegionAssets(regionId) {
    if (regionCaches[regionId]) return regionCaches[regionId];

    if (regionId === 'jeju') {
      const image = await loadImage(window.JEJU_ASSETS.height);
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = image.width;
      sourceCanvas.height = image.height;
      const context = sourceCanvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const heightData = { width: image.width, height: image.height, pixels: context.getImageData(0, 0, image.width, image.height).data };

      let natural, elevation, normal;
      if (typeof window.createRealisticJejuAssets === 'function') {
        const { naturalCanvas, elevationCanvas, normalCanvas } = window.createRealisticJejuAssets(sourceCanvas, window.JEJU_OUTLINE);
        natural = new THREE.CanvasTexture(naturalCanvas);
        natural.encoding = THREE.sRGBEncoding;
        natural.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

        elevation = new THREE.CanvasTexture(elevationCanvas);
        elevation.encoding = THREE.sRGBEncoding;
        elevation.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

        normal = new THREE.CanvasTexture(normalCanvas);
        normal.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      } else {
        const [oldNat, oldElev] = await Promise.all([
          loadTexture(window.JEJU_ASSETS.natural),
          loadTexture(window.JEJU_ASSETS.elevation)
        ]);
        natural = oldNat;
        elevation = oldElev;
      }

      regionCaches.jeju = {
        heightData,
        textures: { natural, elevation, normal }
      };
    } else if (regionId === 'haeundae') {
      if (typeof window.createHaeundaeAssets !== 'function') {
        throw new Error('해운대 3D 에셋 생성기를 찾을 수 없습니다.');
      }
      const { heightCanvas, naturalCanvas, elevationCanvas, normalCanvas } = window.createHaeundaeAssets();
      const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });
      const heightData = {
        width: heightCanvas.width,
        height: heightCanvas.height,
        pixels: hCtx.getImageData(0, 0, heightCanvas.width, heightCanvas.height).data
      };

      const natural = new THREE.CanvasTexture(naturalCanvas);
      natural.encoding = THREE.sRGBEncoding;
      natural.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      const elevation = new THREE.CanvasTexture(elevationCanvas);
      elevation.encoding = THREE.sRGBEncoding;
      elevation.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      let normal;
      if (normalCanvas) {
        normal = new THREE.CanvasTexture(normalCanvas);
        normal.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      }

      regionCaches.haeundae = {
        heightData,
        textures: { natural, elevation, normal }
      };
    }

    return regionCaches[regionId];
  }

  function disposeObject(object) {
    if (!object) return;
    object.traverse((item) => {
      if (item.geometry) item.geometry.dispose();
      if (item.material) {
        if (Array.isArray(item.material)) item.material.forEach((m) => m.dispose());
        else item.material.dispose();
      }
    });
    if (object.parent) object.parent.remove(object);
  }

  function buildIslandBase() {
    if (baseMesh) disposeObject(baseMesh);
    if (shoreline) disposeObject(shoreline);

    const outline = getOutline();
    if (!outline || !outline.length) return;

    const shape = new THREE.Shape();
    outline.forEach(([lng, lat], index) => {
      const { x, z } = worldPosition(lat, lng);
      if (index === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    });
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1.45, bevelEnabled: false, steps: 1 });
    geometry.rotateX(Math.PI / 2);
    baseMesh = new THREE.Mesh(geometry, [
      new THREE.MeshStandardMaterial({ color: 0x363a38, roughness: 0.9, metalness: 0.05 }), // basalt rock cliff
      new THREE.MeshStandardMaterial({ color: 0x48504c, roughness: 0.85, metalness: 0.05 })
    ]);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    scene.add(baseMesh);

    const points = outline.map(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      return new THREE.Vector3(x, 0.12, z);
    });
    shoreline = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xf5fbfb, transparent: true, opacity: 0.85 })
    );
    scene.add(shoreline);
  }

  function buildTerrain() {
    if (terrain) disposeObject(terrain);

    const r = getRegion();
    const cache = regionCaches[currentRegionId];
    if (!cache || !cache.textures) return;

    const columns = 320;
    const rows = 180;
    const positions = new Float32Array((columns + 1) * (rows + 1) * 3);
    const uvs = new Float32Array((columns + 1) * (rows + 1) * 2);
    const indices = [];

    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const index = row * (columns + 1) + column;
        positions[index * 3] = (column / columns - 0.5) * r.mapWidth;
        positions[index * 3 + 2] = (row / rows - 0.5) * r.mapDepth;
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

    const matOptions = {
      map: cache.textures[state.mapStyle],
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
      roughness: 0.82,
      metalness: 0.04,
      polygonOffset: true,
      polygonOffsetFactor: -1
    };
    if (cache.textures.normal) {
      matOptions.normalMap = cache.textures.normal;
      matOptions.normalScale = new THREE.Vector2(1.15, 1.15);
    }
    terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial(matOptions));
    terrain.receiveShadow = true;
    scene.add(terrain);
    renderedMapStyle = state.mapStyle;
    updateTerrainHeight();
  }

  function updateTerrainHeight() {
    if (!terrain) return;
    const r = getRegion();
    const position = terrain.geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const lng = r.bounds.west + (position.getX(i) / r.mapWidth + 0.5) * (r.bounds.east - r.bounds.west);
      const lat = r.bounds.north - (position.getZ(i) / r.mapDepth + 0.5) * (r.bounds.north - r.bounds.south);
      position.setY(i, surfaceHeight(lat, lng) + 0.035);
    }
    position.needsUpdate = true;
    terrain.geometry.computeVertexNormals();
    terrain.geometry.computeBoundingSphere();
    renderedHeightScale = state.heightScale;
    buildRoads();
  }

  function roadColor(type) {
    if (type === 'motorway' || type === 'trunk') return 0xf05a35;
    if (type === 'primary') return 0xffc928;
    return 0xfff1b8;
  }

  function createRoadRibbon(points, width, color, offset) {
    const vertices = [];
    const indices = [];
    for (let index = 0; index < points.length - 1; index++) {
      const start = points[index];
      const end = points[index + 1];
      const length = Math.hypot(end.x - start.x, end.z - start.z);
      if (length < 0.0001) continue;
      const offsetX = -(end.z - start.z) / length * width;
      const offsetZ = (end.x - start.x) / length * width;
      const vertex = vertices.length / 3;
      vertices.push(
        start.x + offsetX, start.y + offset, start.z + offsetZ,
        start.x - offsetX, start.y + offset, start.z - offsetZ,
        end.x + offsetX, end.y + offset, end.z + offsetZ,
        end.x - offsetX, end.y + offset, end.z - offsetZ
      );
      indices.push(vertex, vertex + 1, vertex + 2, vertex + 1, vertex + 3, vertex + 2);
    }
    if (!vertices.length) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2
    }));
  }

  function buildRoads() {
    if (roadGroup) disposeObject(roadGroup);
    roadGroup = new THREE.Group();
    const roadWays = getRoadWays();
    if (!roadWays.length) return;

    for (const road of roadWays) {
      const rawPoints = road.geometry.map((pt) => {
        const { x, z } = worldPosition(pt.lat, pt.lon);
        const y = surfaceHeight(pt.lat, pt.lon);
        return new THREE.Vector3(x, y + 0.08, z);
      });
      const points = [];
      for (let i = 0; i < rawPoints.length; i++) {
        if (i === 0 || rawPoints[i].distanceTo(rawPoints[i - 1]) > 0.08) points.push(rawPoints[i]);
      }
      if (points.length < 2) continue;
      const type = road.tags.highway;
      const width = type === 'motorway' || type === 'trunk' ? 0.32 : type === 'primary' ? 0.24 : 0.16;
      const color = roadColor(type);
      const mesh = createRoadRibbon(points, width, color, 0.05);
      if (mesh) roadGroup.add(mesh);
    }
    roadGroup.visible = state.showRoads;
    scene.add(roadGroup);
    $('#road-legend').hidden = !state.showRoads || !roadWays.length;
  }

  function syncMarkers() {
    for (const item of markerObjects) {
      disposeObject(item.group);
      item.label.remove();
    }
    markerObjects = [];
    markerHits = [];
    markerLayer.replaceChildren();

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

  function createRainTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.3, 'rgba(215, 238, 255, 0.45)');
    grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.rect(6, 0, 4, 64);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  function createSplashTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(230, 245, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 20, 0, Math.PI * 2);
    ctx.stroke();
    const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  function createSnowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(240, 248, 255, 0.85)');
    grad.addColorStop(0.7, 'rgba(230, 242, 255, 0.35)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  function createMistTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const centers = [[64, 64, 48], [44, 52, 36], [82, 54, 38], [56, 78, 40], [74, 76, 38]];
    for (const [cx, cy, r] of centers) {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(245, 250, 255, 0.45)');
      grad.addColorStop(0.5, 'rgba(235, 245, 255, 0.22)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  function buildWeatherSystems() {
    if (weatherGroup) disposeObject(weatherGroup);
    weatherGroup = new THREE.Group();
    scene.add(weatherGroup);

    const r = getRegion();

    // 1. Rain System
    rainGeo = new THREE.BufferGeometry();
    rainPositions = new Float32Array(maxRainCount * 3);
    for (let i = 0; i < maxRainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
      rainPositions[i * 3 + 1] = Math.random() * 55;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      size: 2.1,
      map: createRainTexture(),
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    rainPoints = new THREE.Points(rainGeo, rainMat);
    weatherGroup.add(rainPoints);

    // 2. Ground Splash System
    splashGeo = new THREE.BufferGeometry();
    splashPositions = new Float32Array(maxSplashCount * 3);
    splashAges = new Float32Array(maxSplashCount);
    for (let i = 0; i < maxSplashCount; i++) {
      splashPositions[i * 3] = 0;
      splashPositions[i * 3 + 1] = -100;
      splashPositions[i * 3 + 2] = 0;
      splashAges[i] = 1.0;
    }
    splashGeo.setAttribute('position', new THREE.BufferAttribute(splashPositions, 3));
    const splashMat = new THREE.PointsMaterial({
      size: 2.6,
      map: createSplashTexture(),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    splashPoints = new THREE.Points(splashGeo, splashMat);
    weatherGroup.add(splashPoints);

    // 3. Snow System
    snowGeo = new THREE.BufferGeometry();
    snowPositions = new Float32Array(maxSnowCount * 3);
    for (let i = 0; i < maxSnowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
      snowPositions[i * 3 + 1] = Math.random() * 55;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      size: 2.3,
      map: createSnowTexture(),
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    });
    snowPoints = new THREE.Points(snowGeo, snowMat);
    weatherGroup.add(snowPoints);

    // 4. Mist System
    mistGeo = new THREE.BufferGeometry();
    mistPositions = new Float32Array(maxMistCount * 3);
    for (let i = 0; i < maxMistCount; i++) {
      mistPositions[i * 3] = (Math.random() - 0.5) * r.mapWidth * 1.1;
      mistPositions[i * 3 + 1] = 6 + Math.random() * 18;
      mistPositions[i * 3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.1;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
    const mistMat = new THREE.PointsMaterial({
      size: 32.0,
      map: createMistTexture(),
      transparent: true,
      opacity: 0.28,
      depthWrite: false
    });
    mistPoints = new THREE.Points(mistGeo, mistMat);
    weatherGroup.add(mistPoints);

    applyWeatherAtmosphere();
  }

  function resetWeatherBounds() {
    const r = getRegion();
    if (!rainPositions || !snowPositions || !mistPositions) return;
    for (let i = 0; i < maxRainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
      rainPositions[i * 3 + 1] = Math.random() * 55;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
    }
    if (rainGeo) rainGeo.attributes.position.needsUpdate = true;
    for (let i = 0; i < maxSnowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
      snowPositions[i * 3 + 1] = Math.random() * 55;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
    }
    if (snowGeo) snowGeo.attributes.position.needsUpdate = true;
    for (let i = 0; i < maxMistCount; i++) {
      mistPositions[i * 3] = (Math.random() - 0.5) * r.mapWidth * 1.1;
      mistPositions[i * 3 + 1] = 6 + Math.random() * 18;
      mistPositions[i * 3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.1;
    }
    if (mistGeo) mistGeo.attributes.position.needsUpdate = true;
  }

  function applyWeatherAtmosphere() {
    if (!renderer || !scene) return;
    const mode = state.weather || 'clear';
    const intensity = state.weatherIntensity || 2;

    if (rainPoints) rainPoints.visible = (mode === 'rain');
    if (splashPoints) splashPoints.visible = (mode === 'rain');
    if (snowPoints) snowPoints.visible = (mode === 'snow');
    if (mistPoints) mistPoints.visible = (mode === 'mist');

    const quickIcon = $('#quick-weather-icon');
    const quickLabel = $('#quick-weather-label');
    const quickBtn = $('#weather-quick-toggle');
    const weatherInfo = {
      clear: { icon: '☀️', label: '맑음', clearColor: 0xeef5f8, fogNear: 140, fogFar: 460, sunColor: 0xfff8ee, sunInt: 0.95, ambSky: 0xdcf0fb, ambGnd: 0x6e7b75, ambInt: 0.76 },
      rain: { icon: '🌧️', label: '비', clearColor: 0x93a5b0, fogNear: 55, fogFar: 220, sunColor: 0xafc4d2, sunInt: 0.38 + intensity * 0.04, ambSky: 0x889da9, ambGnd: 0x4f5c63, ambInt: 0.65 },
      snow: { icon: '❄️', label: '눈', clearColor: 0xd8e3ea, fogNear: 70, fogFar: 250, sunColor: 0xecf3f7, sunInt: 0.72, ambSky: 0xd1dfe7, ambGnd: 0x83939c, ambInt: 0.85 },
      mist: { icon: '🌫️', label: '안개', clearColor: 0xc4d6df, fogNear: 25, fogFar: 160, sunColor: 0xf6ede0, sunInt: 0.52, ambSky: 0xb5c8d2, ambGnd: 0x687880, ambInt: 0.78 }
    };
    const current = weatherInfo[mode] || weatherInfo.clear;

    if (quickIcon) quickIcon.textContent = current.icon;
    if (quickLabel) quickLabel.textContent = current.label;
    if (quickBtn) quickBtn.classList.toggle('is-active', mode !== 'clear');

    const intLabels = { 1: '약하게', 2: '보통', 3: '강하게' };
    const intValElem = $('#weather-intensity-val');
    if (intValElem) intValElem.textContent = intLabels[intensity] || '보통';

    renderer.setClearColor(current.clearColor, 1);
    if (!scene.fog) {
      scene.fog = new THREE.Fog(current.clearColor, current.fogNear, current.fogFar);
    } else {
      scene.fog.color.setHex(current.clearColor);
      scene.fog.near = current.fogNear;
      scene.fog.far = current.fogFar;
    }

    if (sunLight) {
      sunLight.color.setHex(current.sunColor);
      sunLight.intensity = current.sunInt;
    }
    if (ambientLight) {
      ambientLight.color.setHex(current.ambSky);
      ambientLight.groundColor.setHex(current.ambGnd);
      ambientLight.intensity = current.ambInt;
    }
  }

  let nextSplashIndex = 0;
  function triggerSplash(x, y, z) {
    if (!splashPositions || !splashAges) return;
    const idx = nextSplashIndex % maxSplashCount;
    nextSplashIndex++;
    splashPositions[idx * 3] = x;
    splashPositions[idx * 3 + 1] = y + 0.12;
    splashPositions[idx * 3 + 2] = z;
    splashAges[idx] = 0;
  }

  function updateWeather(delta, time) {
    if (!state.weather || state.weather === 'clear') return;
    const r = getRegion();
    const intensity = state.weatherIntensity || 2;
    const wind = state.windEffect !== false;

    if (state.weather === 'rain') {
      const activeCount = intensity === 1 ? 1600 : intensity === 2 ? 3000 : maxRainCount;
      const speed = (58 + intensity * 6) * delta;
      const windX = wind ? 6.5 * delta : 0;
      const windZ = wind ? -3.5 * delta : 0;
      const halfW = r.mapWidth * 0.68;
      const halfD = r.mapDepth * 0.68;

      for (let i = 0; i < activeCount; i++) {
        const i3 = i * 3;
        rainPositions[i3 + 1] -= speed;
        rainPositions[i3] += windX;
        rainPositions[i3 + 2] += windZ;

        const x = rainPositions[i3];
        const z = rainPositions[i3 + 2];
        const y = rainPositions[i3 + 1];

        if (x < -halfW || x > halfW || z < -halfD || z > halfD) {
          rainPositions[i3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
          rainPositions[i3 + 1] = 46 + Math.random() * 8;
          rainPositions[i3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
          continue;
        }

        const groundY = surfaceHeightAtWorld(x, z);
        if (y <= groundY || y <= 0) {
          if ((i % 14) === 0) {
            triggerSplash(x, Math.max(0, groundY), z);
          }
          rainPositions[i3 + 1] = 45 + Math.random() * 8;
          rainPositions[i3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
          rainPositions[i3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
        }
      }
      rainGeo.attributes.position.needsUpdate = true;

      let splashUpdated = false;
      for (let s = 0; s < maxSplashCount; s++) {
        if (splashAges[s] < 1.0) {
          splashAges[s] += delta * 3.5;
          if (splashAges[s] >= 1.0) {
            splashPositions[s * 3 + 1] = -100;
          }
          splashUpdated = true;
        }
      }
      if (splashUpdated) splashGeo.attributes.position.needsUpdate = true;
    } else if (state.weather === 'snow') {
      const activeCount = intensity === 1 ? 1200 : intensity === 2 ? 2400 : maxSnowCount;
      const speed = (9 + intensity * 2.2) * delta;
      const baseWindX = wind ? 3.5 * delta : 0.6 * delta;
      const halfW = r.mapWidth * 0.68;
      const halfD = r.mapDepth * 0.68;

      for (let i = 0; i < activeCount; i++) {
        const i3 = i * 3;
        const drift = Math.sin(time * 1.6 + i * 0.08) * 1.5 * delta;
        const driftZ = Math.cos(time * 1.2 + i * 0.12) * 1.2 * delta;

        snowPositions[i3 + 1] -= speed;
        snowPositions[i3] += baseWindX + drift;
        snowPositions[i3 + 2] += driftZ;

        const x = snowPositions[i3];
        const z = snowPositions[i3 + 2];
        const y = snowPositions[i3 + 1];

        if (x < -halfW || x > halfW || z < -halfD || z > halfD) {
          snowPositions[i3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
          snowPositions[i3 + 1] = 48 + Math.random() * 8;
          snowPositions[i3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
          continue;
        }

        const groundY = surfaceHeightAtWorld(x, z);
        if (y <= groundY || y <= 0) {
          snowPositions[i3 + 1] = 48 + Math.random() * 8;
          snowPositions[i3] = (Math.random() - 0.5) * r.mapWidth * 1.35;
          snowPositions[i3 + 2] = (Math.random() - 0.5) * r.mapDepth * 1.35;
        }
      }
      snowGeo.attributes.position.needsUpdate = true;
    } else if (state.weather === 'mist') {
      for (let i = 0; i < maxMistCount; i++) {
        const i3 = i * 3;
        mistPositions[i3] += Math.sin(time * 0.2 + i) * 1.4 * delta;
        mistPositions[i3 + 2] += Math.cos(time * 0.15 + i * 0.7) * 0.9 * delta;
      }
      mistGeo.attributes.position.needsUpdate = true;
    }
  }

  function updateWeatherAudio() {
    if (!state.soundEnabled || state.weather === 'clear') {
      if (rainGain && weatherAudioCtx) {
        rainGain.gain.setTargetAtTime(0, weatherAudioCtx.currentTime, 0.25);
      }
      if (windGain && weatherAudioCtx) {
        windGain.gain.setTargetAtTime(0, weatherAudioCtx.currentTime, 0.25);
      }
      return;
    }

    try {
      if (!weatherAudioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        weatherAudioCtx = new AudioContextClass();
      }

      if (weatherAudioCtx.state === 'suspended') {
        weatherAudioCtx.resume();
      }

      if (!ambientNoiseNode) {
        const bufferSize = weatherAudioCtx.sampleRate * 2;
        const noiseBuffer = weatherAudioCtx.createBuffer(1, bufferSize, weatherAudioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
        ambientNoiseNode = weatherAudioCtx.createBufferSource();
        ambientNoiseNode.buffer = noiseBuffer;
        ambientNoiseNode.loop = true;

        const rainFilter = weatherAudioCtx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.frequency.value = 1600;
        rainFilter.Q.value = 0.8;

        rainGain = weatherAudioCtx.createGain();
        rainGain.gain.value = 0;

        const windFilter = weatherAudioCtx.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 450;
        windFilter.Q.value = 3.5;

        windGain = weatherAudioCtx.createGain();
        windGain.gain.value = 0;

        ambientNoiseNode.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(weatherAudioCtx.destination);

        ambientNoiseNode.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(weatherAudioCtx.destination);

        ambientNoiseNode.start();
      }

      const intensity = state.weatherIntensity || 2;
      const targetTime = weatherAudioCtx.currentTime;

      if (state.weather === 'rain') {
        const rainVol = (0.05 + intensity * 0.035);
        const windVol = (state.windEffect ? 0.02 * intensity : 0.005);
        rainGain.gain.setTargetAtTime(rainVol, targetTime, 0.3);
        windGain.gain.setTargetAtTime(windVol, targetTime, 0.3);
      } else if (state.weather === 'snow') {
        const windVol = (0.04 + intensity * 0.03);
        rainGain.gain.setTargetAtTime(0, targetTime, 0.2);
        windGain.gain.setTargetAtTime(windVol, targetTime, 0.3);
      } else if (state.weather === 'mist') {
        rainGain.gain.setTargetAtTime(0, targetTime, 0.2);
        windGain.gain.setTargetAtTime(0.015, targetTime, 0.3);
      } else {
        rainGain.gain.setTargetAtTime(0, targetTime, 0.2);
        windGain.gain.setTargetAtTime(0, targetTime, 0.2);
      }
    } catch (e) {
      console.warn('Weather audio not started:', e);
    }
  }

  function rebuildRegionScene() {
    const r = getRegion();

    // Rebuild ocean with deep coastal water PBR material
    if (ocean) disposeObject(ocean);
    ocean = new THREE.Mesh(
      new THREE.BoxGeometry(r.oceanBox[0], r.oceanBox[1], r.oceanBox[2]),
      new THREE.MeshStandardMaterial({ color: 0x144e78, roughness: 0.28, metalness: 0.12, toneMapped: true })
    );
    ocean.position.y = -2.05;
    ocean.receiveShadow = true;
    scene.add(ocean);

    oceanRim = new THREE.Mesh(
      new THREE.BoxGeometry(r.oceanRimBox[0], r.oceanRimBox[1], r.oceanRimBox[2]),
      new THREE.MeshStandardMaterial({ color: 0x226b9c, roughness: 0.45, metalness: 0.08 })
    );
    oceanRim.position.y = -0.85;
    ocean.add(oceanRim);
    ocean.visible = state.showOcean;

    buildIslandBase();
    buildTerrain();
    buildRoads();
    syncMarkers();
    resetWeatherBounds();
  }

  async function initScene() {
    if (!window.THREE || !THREE.OrbitControls) {
      throw new Error('Three.js 라이브러리를 불러오지 못했습니다.');
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xeef5f8, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.append(renderer.domElement);
    resize();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 24;
    controls.maxDistance = 420;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.enablePan = true;

    // Warm sun key light and cool sky hemisphere fill
    ambientLight = new THREE.HemisphereLight(0xdcf0fb, 0x6e7b75, 0.76);
    scene.add(ambientLight);
    sunLight = new THREE.DirectionalLight(0xfff8ee, 0.95);
    sunLight.position.set(-35, 85, 45);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -85;
    sunLight.shadow.camera.right = 85;
    sunLight.shadow.camera.top = 85;
    sunLight.shadow.camera.bottom = -85;
    sunLight.shadow.bias = -0.00015;
    scene.add(sunLight);

    // Build weather systems
    buildWeatherSystems();

    // Prepare initial region assets (Jeju)
    await prepareRegionAssets('jeju');

    rebuildRegionScene();
    setView('perspective');
    $('#loading').hidden = true;
    renderState();

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
        if (!terrain) return;
        const terrainHit = raycaster.intersectObject(terrain, false)[0];
        if (terrainHit) {
          const r = getRegion();
          const lat = r.bounds.north - (terrainHit.point.z / r.mapDepth + 0.5) * (r.bounds.north - r.bounds.south);
          const lng = r.bounds.west + (terrainHit.point.x / r.mapWidth + 0.5) * (r.bounds.east - r.bounds.west);
          if (pointInLand(lat, lng)) {
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
        showToast(`${getRegion().name} 영역 안을 클릭해 주세요.`);
        return;
      }

      const hit = raycaster.intersectObjects(markerHits, false)[0];
      if (hit) selectMarker(hit.object.userData.markerId);
    });

    window.addEventListener('resize', resize);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(viewer);

    const animate = (time) => {
      requestAnimationFrame(animate);
      const delta = Math.min(0.05, (time - lastFrameTime) / 1000 || 0);
      lastFrameTime = time;
      updateDroneFlight(delta);
      if (!droneMode) controls.update();
      updateLabels();
      updateWeather(delta, time);
      renderer.render(scene, camera);
    };
    animate();
  }

  initUI();
  initScene().catch((error) => {
    const loading = $('#loading');
    if (loading) {
      loading.querySelector('.loading-spinner').hidden = true;
      loading.querySelector('strong').textContent = '3D 지도를 불러오지 못했어요.';
      loading.querySelector('small').textContent = error.message;
    }
    console.error(error);
  });
})();
