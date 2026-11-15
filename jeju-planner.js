(() => {
  'use strict';

  // Google Maps Platform Demo Key (Case A) Tier 1 Global Quota Defense
  if (!window.__gmpQuotaListenerInstalled) {
    window.__gmpQuotaListenerInstalled = true;
    const prevAuthFailure = window.gm_authFailure;
    window.gm_authFailure = function () {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      if (typeof prevAuthFailure === 'function') {
        try { prevAuthFailure(); } catch (_) {}
      }
    };
    const origConsoleError = console.error;
    console.error = function (...args) {
      origConsoleError.apply(console, args);
      const msg = args.map((a) => String(a)).join(' ');
      if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
    };
  }

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
    },
    incheon: {
      id: 'incheon',
      name: '인천',
      subTitle: '인천공항·인천대교·송도',
      brandTitle: 'INCHEON STUDIO',
      brandSub: '인천·인천대교·인천공항 3D 지도',
      brandMark: 'I',
      brandColor: '#0070ba',
      storageKey: 'incheon-studio-plan-v1',
      sidebarEyebrow: 'AIRPORT, BRIDGE & SMART CITY',
      sidebarTitle: '인천과 인천대교,<br>인천공항을 3D로 살펴보세요.',
      sidebarDesc: '영종도 인천국제공항부터 국내 최장 사장교 인천대교, 첨단 송도국제도시와 서해 갯벌까지 3D 입체 지형으로 탐색해 보세요.',
      viewerTitle: 'Incheon & Incheon Bridge',
      viewerSub: '대한민국 인천광역시 · 북위 37.45°',
      summaryTitle: '나만의 인천 3D 지도',
      bounds: { west: 126.350, south: 37.330, east: 126.750, north: 37.560 },
      mapWidth: 105,
      mapDepth: 65,
      heightFactor: 0.022,
      droneAltitudeMeters: 90,
      oceanBox: [120, 1.1, 75],
      oceanRimBox: [122, 0.65, 77],
      lightPos: [-32, 85, 42],
      defaultCamDistance: 170,
      customDefaults: { latMin: 37.330, latMax: 37.560, latPlaceholder: '37.4602', lngMin: 126.350, lngMax: 126.750, lngPlaceholder: '126.4407' },
      presets: window.INCHEON_PRESETS || []
    },
    gangneung: {
      id: 'gangneung',
      name: '강릉·경포',
      subTitle: '경포대·바다·설악산',
      brandTitle: 'GANGNEUNG STUDIO',
      brandSub: '강릉 경포대·동해·설악산 3D 지도',
      brandMark: 'G',
      brandColor: '#0f766e',
      storageKey: 'gangneung-studio-plan-v1',
      sidebarEyebrow: 'EAST SEA & BAEKDUDAEGAN',
      sidebarTitle: '경포대와 바다,<br>멀리 설악산을 조망하세요.',
      sidebarDesc: '경포호와 경포대 누각, 푸른 동해 바다를 가까이 두고, 북서쪽 능선 너머 우뚝 솟은 설악산 대청봉까지 한눈에 탐색해 보세요.',
      viewerTitle: 'Gyeongpodae & Seoraksan',
      viewerSub: '대한민국 강원특별자치도 · 북위 37.80°',
      summaryTitle: '나만의 강릉·설악 지도',
      bounds: { west: 128.360, south: 37.620, east: 129.060, north: 38.225 },
      mapWidth: 106,
      mapDepth: 112,
      heightFactor: 0.0098,
      droneAltitudeMeters: 130,
      oceanBox: [124, 1.1, 130],
      oceanRimBox: [126, 0.65, 132],
      lightPos: [-35, 85, 45],
      defaultCamDistance: 170,
      customDefaults: { latMin: 37.620, latMax: 38.225, latPlaceholder: '37.7935', lngMin: 128.360, lngMax: 129.060, lngPlaceholder: '128.8885' },
      presets: window.GANGNEUNG_PRESETS || []
    },
    yeongam: {
      id: 'yeongam',
      name: '전남 영암',
      subTitle: 'KIC 스포츠카 서킷·영암호',
      brandTitle: 'YEONGAM CIRCUIT',
      brandSub: '전남 영암 코리아 인터내셔널 서킷 3D',
      brandMark: 'Y',
      brandColor: '#dc2626',
      storageKey: 'yeongam-studio-plan-v1',
      sidebarEyebrow: 'MOTORSPORT & COASTAL RIDGE',
      sidebarTitle: '영암 F1 스포츠카 서킷을<br>3D로 질주하세요.',
      sidebarDesc: '5.615km 18개 코너의 코리아 인터내셔널 서킷과 영암호 요트 마리나, 은적산·월출산 능선을 배경으로 레이싱 코스를 입체 탐험해 보세요.',
      viewerTitle: 'Yeongam KIC Circuit',
      viewerSub: '전라남도 영암군 · 북위 34.74°',
      summaryTitle: '나만의 영암 서킷 지도',
      bounds: { west: 126.382, south: 34.712, east: 126.498, north: 34.782 },
      mapWidth: 108,
      mapDepth: 80,
      heightFactor: 0.014,
      droneAltitudeMeters: 90,
      oceanBox: [124, 1.1, 94],
      oceanRimBox: [126, 0.65, 96],
      lightPos: [-35, 85, 45],
      defaultCamDistance: 124,
      customDefaults: { latMin: 34.712, latMax: 34.782, latPlaceholder: '34.7376', lngMin: 126.382, lngMax: 126.498, lngPlaceholder: '126.4152' },
      presets: window.YEONGAM_PRESETS || []
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
    soundEnabled: false,
    solarDate: '2026-11-10',
    solarTime: 810, // 13:30 KST (밝고 화창한 오후 한낮)
    solarLiveSync: false,
    elevationProfileOpen: false,
    elevationTransectMode: 'west-east',
    customTransect: [],
    verticalSliceMode: false,
    climateOverlayOpen: false,
    climateChartMode: 'overview',
    terrainDetail: 'adaptive'
  });

  function cleanCustomTransect(rawWaypoints, bounds) {
    if (window.TransectHelpers && typeof window.TransectHelpers.cleanCustomTransect === 'function') {
      return window.TransectHelpers.cleanCustomTransect(rawWaypoints, bounds);
    }
    if (!Array.isArray(rawWaypoints) || !bounds) return [];
    return rawWaypoints.slice(0, 160).filter((pt) => {
      if (!pt || typeof pt !== 'object') return false;
      const lat = Number(pt.lat);
      const lng = Number(pt.lng);
      return Number.isFinite(lat) && Number.isFinite(lng) &&
        lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
    }).map((pt) => ({ lat: Number(Number(pt.lat).toFixed(6)), lng: Number(Number(pt.lng).toFixed(6)) }));
  }

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
      address: typeof marker.address === 'string' ? marker.address.slice(0, 120) : undefined,
      placeId: typeof marker.placeId === 'string' ? marker.placeId.slice(0, 120) : undefined,
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
      soundEnabled: Boolean(raw.soundEnabled),
      solarDate: typeof raw.solarDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.solarDate) ? raw.solarDate : '2026-11-10',
      solarTime: Number.isFinite(Number(raw.solarTime)) ? Math.max(0, Math.min(1439, Math.round(Number(raw.solarTime)))) : 810,
      solarLiveSync: Boolean(raw.solarLiveSync),
      elevationProfileOpen: Boolean(raw.elevationProfileOpen),
      elevationTransectMode: ['west-east', 'north-south', 'places-route', 'custom-path'].includes(raw.elevationTransectMode) ? raw.elevationTransectMode : 'west-east',
      customTransect: cleanCustomTransect(raw.customTransect, bounds),
      verticalSliceMode: Boolean(raw.verticalSliceMode),
      climateOverlayOpen: Boolean(raw.climateOverlayOpen) && !Boolean(raw.elevationProfileOpen),
      climateChartMode: ['overview', 'sunshine', 'marine'].includes(raw.climateChartMode) ? raw.climateChartMode : 'overview',
      terrainDetail: ['adaptive', 'high', 'eco'].includes(raw.terrainDetail) ? raw.terrainDetail : 'adaptive'
    };
  }

  function loadState(region) {
    try {
      const saved = localStorage.getItem(region.storageKey);
      if (!saved) return defaultState(region);
      const parsed = JSON.parse(saved);
      // Migrate previous 17:15 dusk default to bright afternoon 13:30
      if (parsed.solarTime === 1035) {
        parsed.solarTime = 810;
      }
      return cleanState(parsed, region);
    } catch (_) {
      return defaultState(region);
    }
  }

  let pendingSharedCamera = null;

  function applyUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params.toString()) return;

      const urlRegion = params.get('region');
      if (urlRegion && REGIONS[urlRegion]) {
        currentRegionId = urlRegion;
      }

      state = loadState(getRegion());

      if (params.has('style')) {
        const s = params.get('style');
        if (s === 'elevation' || s === 'natural') state.mapStyle = s;
      }

      if (params.has('mesh')) {
        const md = params.get('mesh');
        if (['adaptive', 'high', 'eco'].includes(md)) state.terrainDetail = md;
      }

      if (params.has('height')) {
        const h = Number(params.get('height'));
        if (Number.isFinite(h)) state.heightScale = Math.min(180, Math.max(40, h));
      }

      if (params.has('weather')) {
        const w = params.get('weather');
        if (['clear', 'rain', 'snow', 'mist'].includes(w)) state.weather = w;
      }

      if (params.has('time')) {
        const t = Number(params.get('time'));
        if (Number.isFinite(t)) state.solarTime = Math.max(0, Math.min(1439, t));
      }

      if (params.has('date')) {
        const d = params.get('date');
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) state.solarDate = d;
      }

      if (params.has('elev')) {
        state.elevationProfileOpen = params.get('elev') === '1' || params.get('elev') === 'true';
        if (state.elevationProfileOpen) state.climateOverlayOpen = false;
      }

      if (params.has('transect')) {
        const tr = params.get('transect');
        if (['west-east', 'north-south', 'places-route', 'custom-path'].includes(tr)) state.elevationTransectMode = tr;
      }

      if (params.has('ct')) {
        const pairs = params.get('ct').split(';').map((pair) => {
          const [latStr, lngStr] = pair.split(',');
          return { lat: Number(latStr), lng: Number(lngStr) };
        });
        const cleanedCt = cleanCustomTransect(pairs, getRegion().bounds);
        if (cleanedCt.length >= 2) {
          state.customTransect = cleanedCt;
          state.elevationTransectMode = 'custom-path';
        }
      }

      if (params.has('slice')) {
        state.verticalSliceMode = params.get('slice') === '1' || params.get('slice') === 'true';
      }

      if (params.has('climate')) {
        state.climateOverlayOpen = params.get('climate') === '1' || params.get('climate') === 'true';
        if (state.climateOverlayOpen) state.elevationProfileOpen = false;
      }

      if (params.has('cmode')) {
        const cm = params.get('cmode');
        if (['overview', 'sunshine', 'marine'].includes(cm)) state.climateChartMode = cm;
      }

      if (params.has('places') || params.has('custom')) {
        const restored = [];
        const r = getRegion();
        if (params.has('places')) {
          const ids = params.get('places').split(',');
          ids.forEach((id) => {
            const preset = r.presets.find((p) => p.id === id);
            if (preset && !restored.some((item) => item.id === preset.id)) {
              restored.push({ ...preset, custom: false });
            }
          });
        }
        if (params.has('custom')) {
          const customStrs = params.get('custom').split(';');
          customStrs.forEach((item, idx) => {
            const [rawName, latStr, lngStr] = item.split(':');
            const lat = Number(latStr);
            const lng = Number(lngStr);
            if (rawName && Number.isFinite(lat) && Number.isFinite(lng)) {
              restored.push({
                id: `custom-shared-${idx}-${Date.now()}`,
                name: decodeURIComponent(rawName),
                category: '공유 장소',
                lat,
                lng,
                custom: true
              });
            }
          });
        }
        if (restored.length > 0) {
          state.markers = restored;
        }
      }

      if (params.has('sel')) {
        state.selectedId = params.get('sel');
      }

      if (params.has('cam')) {
        const parts = params.get('cam').split(',').map(Number);
        if (parts.length === 6 && parts.every(Number.isFinite)) {
          pendingSharedCamera = {
            pos: new THREE.Vector3(parts[0], parts[1], parts[2]),
            target: new THREE.Vector3(parts[3], parts[4], parts[5])
          };
        }
      }

      if (params.has('view')) {
        const v = params.get('view');
        if (v === 'top' || v === 'perspective') viewMode = v;
      }
    } catch (e) {
      console.warn('URL 파라미터 파싱 실패:', e);
    }
  }

  let state = loadState(getRegion());
  applyUrlParams();
  const undoStack = [];
  const redoStack = [];

  // Three.js and Scene Variables
  let scene, camera, renderer, controls, terrain, ocean, oceanRim, shoreline, baseMesh, roadGroup;
  let ambientLight, sunLight, moonLight;
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

  // Incheon Bridge, Airport, Gangneung Landmarks, Yeongam Circuit & Night Stars
  let incheonBridgeGroup = null;
  let incheonAirportGroup = null;
  let gangneungLandmarksGroup = null;
  let yeongamCircuitGroup = null;
  let yeongamTrackCurve = null;
  let yeongamAnimCars = [];
  let yeongamEmissiveMaterials = [];
  let airportAnimPlane = null;
  let airportFlightCurve = null;
  let airportFlightPhase = 0;
  let airportEmissiveMaterials = [];
  let starsPoints = null;
  let starsGeo = null;
  let elevationPointerMesh = null;
  let elevationTransectGroup = null;
  let verticalSliceCutGroup = null;
  let activeSlicePlane = null;
  let activeSlicePlaneParams = null;
  const _sliceNormalVec = new THREE.Vector3();
  const _sliceAnchorVec = new THREE.Vector3();
  let sliceRenderer = null;
  let sliceScene = null;
  let sliceCamera = null;
  let sliceBlockGroup = null;
  let sliceCursorMesh = null;
  let slicePanelProjection = null;
  let activeTransectSamples = [];
  let activeTransectHoverRefs = null;
  let drawingTransect = false;
  let isDraggingTransect = false;
  let draftTransectWaypoints = [];
  let lastDragRenderTime = 0;
  let solarPlaying = false;
  let solarSpeed = 10;
  let currentSolarPosition = null;
  let cameraFlyTarget = null;
  const _planePos = new THREE.Vector3();
  const _planeNextPos = new THREE.Vector3();
  const _carPos = new THREE.Vector3();
  const _carNextPos = new THREE.Vector3();

  let regionCaches = {}; // Caches for heightData, textures, outline, roads per region
  let renderedHeightScale, renderedMapStyle, renderedWeather, renderedTerrainDetail;
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

  let quotaBannerDismissed = false;
  function showGmpQuotaBanner() {
    if (quotaBannerDismissed) return;
    const banner = $('#gmp-quota-banner');
    if (banner) banner.hidden = false;
  }
  window.addEventListener('gmp-quota-exceeded', showGmpQuotaBanner);

  function createSessionToken() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  let searchSessionToken = createSessionToken();
  let searchDebounceTimer = null;
  let searchAbortController = null;
  let liveSuggestions = [];
  let liveSearchMeta = { loading: false, mode: '', statusText: '', empty: false };

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
    if (currentRegionId === 'jeju') return window.JEJU_OUTLINE;
    if (currentRegionId === 'haeundae') return window.HAEUNDAE_OUTLINE;
    if (currentRegionId === 'incheon') return window.INCHEON_OUTLINE;
    if (currentRegionId === 'gangneung') return window.GANGNEUNG_OUTLINE;
    if (currentRegionId === 'yeongam') return window.YEONGAM_OUTLINE;
    return [];
  }

  function getRoadWays() {
    if (currentRegionId === 'jeju') {
      return Array.isArray(window.JEJU_ROADS) ? window.JEJU_ROADS.map((road) => ({
        tags: { highway: road.type, name: road.name },
        geometry: road.points.map(([lat, lon]) => ({ lat, lon }))
      })) : [];
    } else if (currentRegionId === 'haeundae') {
      return Array.isArray(window.HAEUNDAE_ROADS) ? window.HAEUNDAE_ROADS.map((road) => ({
        tags: { highway: road.type, name: road.name },
        geometry: road.points.map(([lat, lon]) => ({ lat, lon }))
      })) : [];
    } else if (currentRegionId === 'incheon') {
      return Array.isArray(window.INCHEON_ROADS) ? window.INCHEON_ROADS.map((road) => ({
        tags: { highway: road.type, name: road.name },
        geometry: road.points.map(([lat, lon]) => ({ lat, lon }))
      })) : [];
    } else if (currentRegionId === 'gangneung') {
      return Array.isArray(window.GANGNEUNG_ROADS) ? window.GANGNEUNG_ROADS.map((road) => ({
        tags: { highway: road.type, name: road.name },
        geometry: road.points.map(([lat, lon]) => ({ lat, lon }))
      })) : [];
    } else if (currentRegionId === 'yeongam') {
      return Array.isArray(window.YEONGAM_ROADS) ? window.YEONGAM_ROADS.map((road) => ({
        tags: { highway: road.type, name: road.name },
        geometry: road.points.map(([lat, lon]) => ({ lat, lon }))
      })) : [];
    }
    return [];
  }

  function pointInLand(lat, lng) {
    if (currentRegionId === 'incheon') {
      if (typeof window.inIncheonLand === 'function' && window.inIncheonLand(lng, lat)) return true;
      const yjDist = Math.hypot((lng - 126.475) / 0.125, (lat - 37.465) / 0.065);
      if (yjDist < 1.0) return true; // Yeongjongdo
      if (lng >= 126.600 && lng <= 126.675 && lat >= 37.360 && lat <= 37.415) return true; // Songdo
      if ((lng >= 126.605 && lat >= 37.415) || (lng >= 126.640 && lat >= 37.340)) return true; // Mainland
      return false;
    }
    if (currentRegionId === 'gangneung' && typeof window.inGangneungLand === 'function') {
      return window.inGangneungLand(lng, lat);
    }
    if (currentRegionId === 'yeongam' && typeof window.inYeongamLand === 'function') {
      return window.inYeongamLand(lng, lat);
    }
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
    const maxMeters = currentRegionId === 'jeju'
      ? 2000
      : (currentRegionId === 'haeundae'
        ? 650
        : (currentRegionId === 'gangneung'
          ? 1800
          : (currentRegionId === 'yeongam' ? 850 : 300)));
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
      empty.textContent = liveSuggestions.length
        ? '기본 추천 장소 중 일치 항목이 없어요. 위 지도 검색 추천을 선택해 보세요.'
        : '검색 결과가 없습니다.';
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

  function renderGeocodeSuggestions() {
    const block = $('#search-suggestions-block');
    const list = $('#geocode-suggestion-list');
    const modeLabel = $('#geocode-mode-label');
    const statusLabel = $('#geocode-status');
    if (!block || !list) return;

    const query = $('#place-search') ? $('#place-search').value.trim() : '';
    const hasContent =
      Boolean(query) || liveSearchMeta.loading || liveSuggestions.length > 0 || liveSearchMeta.empty;
    block.hidden = !hasContent;
    if (!hasContent) {
      list.replaceChildren();
      return;
    }

    if (modeLabel) {
      modeLabel.textContent =
        liveSearchMeta.mode === 'reverse-geocode' ? '역지오코딩 위치 추천' : '지도 위치 추천';
    }
    if (statusLabel) {
      statusLabel.textContent = liveSearchMeta.loading
        ? '추천 위치 찾는 중...'
        : liveSearchMeta.statusText || `${liveSuggestions.length}건`;
    }

    list.replaceChildren();
    if (liveSearchMeta.loading && !liveSuggestions.length) {
      return;
    }
    if (!liveSuggestions.length) {
      if (liveSearchMeta.empty) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = liveSearchMeta.statusText || '일치하는 지도 위치가 없습니다.';
        list.append(empty);
      }
      return;
    }

    const activeRegion = getRegion();
    liveSuggestions.forEach((item, idx) => {
      const matchedName =
        item.matchedRegionId && REGIONS[item.matchedRegionId]
          ? REGIONS[item.matchedRegionId].name
          : null;
      const isDifferentRegion = Boolean(
        item.matchedRegionId && item.matchedRegionId !== activeRegion.id
      );
      const isOutsideAll =
        item.lat !== null && item.lng !== null && !item.inBounds && !isDifferentRegion;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `geocode-suggestion-card${isOutsideAll ? ' is-out-of-bounds' : ''}`;
      btn.dataset.suggestionIdx = String(idx);

      const main = document.createElement('span');
      main.className = 'geocode-suggestion-main';

      const title = document.createElement('strong');
      title.className = 'geocode-suggestion-title';
      title.textContent = item.name;
      main.append(title);

      if (item.address) {
        const addr = document.createElement('span');
        addr.className = 'geocode-suggestion-address';
        addr.textContent = item.address;
        main.append(addr);
      }

      const meta = document.createElement('span');
      meta.className = 'geocode-suggestion-meta';

      const tag = document.createElement('span');
      tag.className = 'geocode-region-tag';
      if (item.inBounds) {
        tag.textContent = `${activeRegion.name} 영역 내`;
      } else if (isDifferentRegion && matchedName) {
        tag.textContent = `${matchedName} 지도로 이동`;
      } else if (item.lat !== null && item.lng !== null) {
        tag.textContent = `${item.lat.toFixed(4)}° N · ${item.lng.toFixed(4)}° E`;
      } else {
        tag.textContent = item.category || '지도 검색';
      }
      meta.append(tag);

      if (Number.isFinite(item.distanceKm) && item.distanceKm > 0) {
        const dist = document.createElement('span');
        dist.textContent = `· ${item.distanceKm}km`;
        meta.append(dist);
      }

      main.append(meta);

      const action = document.createElement('span');
      action.className = 'geocode-suggestion-action';
      action.textContent = isDifferentRegion ? '이동·표시' : '+ 표시';

      btn.append(main, action);
      list.append(btn);
    });
  }

  function clearLiveSearch() {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = null;
    }
    if (searchAbortController) {
      searchAbortController.abort();
      searchAbortController = null;
    }
    liveSuggestions = [];
    liveSearchMeta = { loading: false, mode: '', statusText: '', empty: false };
    renderGeocodeSuggestions();
  }

  async function reverseGeocodeCoordinates(lat, lng, options = {}) {
    const r = getRegion();
    const helpers = window.PlaceSearchHelpers;
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      region: r.id,
      south: String(r.bounds.south),
      west: String(r.bounds.west),
      north: String(r.bounds.north),
      east: String(r.bounds.east)
    });

    if (options.updateSuggestions) {
      liveSearchMeta = { loading: true, mode: 'reverse-geocode', statusText: '좌표 확인 중...', empty: false };
      renderGeocodeSuggestions();
    }

    try {
      const res = await fetch(`/api/geocode/reverse?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (helpers && helpers.isQuotaExceededResponse(res.status, data)) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        if (options.updateSuggestions) {
          liveSearchMeta = { loading: false, mode: 'reverse-geocode', statusText: '할당량 초과', empty: false };
          renderGeocodeSuggestions();
        }
        return [];
      }
      const list = Array.isArray(data.suggestions) ? data.suggestions : [];
      if (options.updateSuggestions) {
        liveSuggestions = list;
        liveSearchMeta = {
          loading: false,
          mode: 'reverse-geocode',
          statusText: list.length ? `${lat.toFixed(4)}, ${lng.toFixed(4)} 역지오코딩` : '주변 주소 정보 없음',
          empty: list.length === 0
        };
        renderGeocodeSuggestions();
      }
      if (options.updateCustomForm && list.length > 0) {
        const top = list[0];
        const statusEl = $('#reverse-pick-status');
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = `역지오코딩 결과: ${top.address || top.name}`;
        }
        const nameInp = $('#custom-name');
        if (nameInp && (!nameInp.value.trim() || nameInp.dataset.autofilled === 'true')) {
          nameInp.value = String(top.name || '').slice(0, 30);
          nameInp.dataset.autofilled = 'true';
        }
      }
      return list;
    } catch (_) {
      if (options.updateSuggestions) {
        liveSearchMeta = { loading: false, mode: 'reverse-geocode', statusText: '', empty: false };
        renderGeocodeSuggestions();
      }
      return [];
    }
  }

  function scheduleLivePlaceSearch(rawQuery) {
    const query = String(rawQuery || '').trim();
    const clearBtn = $('#place-search-clear');
    if (clearBtn) clearBtn.hidden = !query;

    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    if (searchAbortController) {
      searchAbortController.abort();
      searchAbortController = null;
    }

    if (!query) {
      liveSuggestions = [];
      liveSearchMeta = { loading: false, mode: '', statusText: '', empty: false };
      renderGeocodeSuggestions();
      renderPresets();
      return;
    }

    const helpers = window.PlaceSearchHelpers;
    const isCoordQuery = Boolean(helpers && helpers.parseCoordinateQuery(query));
    liveSearchMeta = {
      loading: true,
      mode: isCoordQuery ? 'reverse-geocode' : 'autocomplete',
      statusText: '추천 위치 찾는 중...',
      empty: false
    };
    renderGeocodeSuggestions();

    searchDebounceTimer = setTimeout(async () => {
      const r = getRegion();
      const centerLat = (r.bounds.south + r.bounds.north) * 0.5;
      const centerLng = (r.bounds.west + r.bounds.east) * 0.5;
      const params = new URLSearchParams({
        q: query,
        region: r.id,
        lat: String(centerLat),
        lng: String(centerLng),
        south: String(r.bounds.south),
        west: String(r.bounds.west),
        north: String(r.bounds.north),
        east: String(r.bounds.east),
        sessionToken: searchSessionToken
      });

      const controller = new AbortController();
      searchAbortController = controller;

      try {
        const res = await fetch(`/api/places/suggest?${params.toString()}`, {
          signal: controller.signal
        });
        const data = await res.json().catch(() => ({}));
        if (controller.signal.aborted) return;

        if (helpers && helpers.isQuotaExceededResponse(res.status, data)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          liveSuggestions = [];
          liveSearchMeta = { loading: false, mode: isCoordQuery ? 'reverse-geocode' : 'autocomplete', statusText: '할당량 초과', empty: false };
          renderGeocodeSuggestions();
          renderPresets();
          return;
        }

        const results = Array.isArray(data.suggestions) ? data.suggestions : [];
        liveSuggestions = results;
        liveSearchMeta = {
          loading: false,
          mode: data.mode || (isCoordQuery ? 'reverse-geocode' : 'autocomplete'),
          statusText: results.length
            ? `${results.length}곳 추천`
            : res.status === 503
              ? '추천 장소 목록에서 검색 중'
              : '검색된 위치가 없어요',
          empty: results.length === 0 && res.status !== 503
        };
        renderGeocodeSuggestions();
        renderPresets();
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        liveSuggestions = [];
        liveSearchMeta = { loading: false, mode: '', statusText: '', empty: false };
        renderGeocodeSuggestions();
      }
    }, 260);
  }

  async function selectSuggestedPlace(suggestion) {
    if (!suggestion) return;
    const helpers = window.PlaceSearchHelpers;
    const r = getRegion();
    let resolved = suggestion;

    if (suggestion.needsDetails && suggestion.placeId) {
      liveSearchMeta = { ...liveSearchMeta, loading: true, statusText: '좌표 확인 중...' };
      renderGeocodeSuggestions();
      try {
        const params = new URLSearchParams({
          placeId: suggestion.placeId,
          region: r.id,
          south: String(r.bounds.south),
          west: String(r.bounds.west),
          north: String(r.bounds.north),
          east: String(r.bounds.east),
          sessionToken: searchSessionToken
        });
        const res = await fetch(`/api/places/details?${params.toString()}`);
        const data = await res.json().catch(() => ({}));
        searchSessionToken = createSessionToken();

        if (helpers && helpers.isQuotaExceededResponse(res.status, data)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          liveSearchMeta = { ...liveSearchMeta, loading: false, statusText: '할당량 초과' };
          renderGeocodeSuggestions();
          return;
        }
        if (!res.ok || !data.place) {
          liveSearchMeta = { ...liveSearchMeta, loading: false, statusText: '좌표를 가져오지 못했습니다' };
          renderGeocodeSuggestions();
          showToast('선택한 장소의 좌표를 불러오지 못했어요.');
          return;
        }
        resolved = data.place;
        if (!resolved.address && data.reverseContext && data.reverseContext.address) {
          resolved.address = data.reverseContext.address;
        }
      } catch (_) {
        liveSearchMeta = { ...liveSearchMeta, loading: false, statusText: '' };
        renderGeocodeSuggestions();
        showToast('선택한 장소의 좌표를 불러오지 못했어요.');
        return;
      }
    }

    const lat = Number(resolved.lat);
    const lng = Number(resolved.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      showToast('선택한 장소의 좌표 정보가 없습니다.');
      return;
    }

    const targetRegionId = helpers ? helpers.findMatchingRegionId(lat, lng, REGIONS) : null;
    if (!targetRegionId) {
      liveSearchMeta = { ...liveSearchMeta, loading: false, statusText: `${lat.toFixed(4)}, ${lng.toFixed(4)}` };
      renderGeocodeSuggestions();
      showToast(`${resolved.name}(${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)은(는) 5개 3D 지형 영역 밖에 있습니다.`);
      return;
    }

    if (targetRegionId !== currentRegionId) {
      await switchRegion(targetRegionId);
    }

    const existing = state.markers.find(
      (m) =>
        (resolved.placeId && m.placeId === resolved.placeId) ||
        (Math.abs(m.lat - lat) < 0.0002 && Math.abs(m.lng - lng) < 0.0002)
    );
    if (existing) {
      selectMarker(existing.id);
      focusOnMarker(existing.id);
      showToast(`${existing.name} 위치로 이동했어요.`);
    } else {
      const markerId = `place-${Date.now().toString(36)}`;
      const markerName = String(resolved.name || '검색한 장소').trim().slice(0, 30);
      commit(() => {
        state.markers.push({
          id: markerId,
          name: markerName,
          category: resolved.category || '지도 검색',
          lat,
          lng,
          address: resolved.address || '',
          placeId: resolved.placeId || '',
          custom: true
        });
        state.selectedId = markerId;
      });
      focusOnMarker(markerId);
      showToast(`${markerName}을(를) 지도에 표시하고 이동했어요.`);
    }

    if (window.innerWidth <= 900) {
      setLnbOpen(false);
    }
    liveSearchMeta = { ...liveSearchMeta, loading: false, statusText: '지도에 표시됨' };
    renderGeocodeSuggestions();
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
    const meshRadio = $(`input[name="terrain-detail"][value="${state.terrainDetail}"]`);
    if (meshRadio) meshRadio.checked = true;
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

    // Solar UI Sync
    const solarDateInp = $('#solar-date');
    if (solarDateInp) solarDateInp.value = state.solarDate;
    const solarSlider = $('#solar-time-slider');
    if (solarSlider) solarSlider.value = state.solarTime;
    updateSolarLighting(0);

    // Elevation Profile UI Sync
    const isSliceActive = Boolean(state.elevationProfileOpen && state.verticalSliceMode);
    const elevPanel = $('#elevation-profile-panel');
    if (elevPanel) {
      elevPanel.hidden = !state.elevationProfileOpen;
      elevPanel.classList.toggle('is-slice-mode', isSliceActive);
      elevPanel.dataset.transectMode = state.elevationTransectMode || 'west-east';
      elevPanel.dataset.drawing = String(drawingTransect);
      elevPanel.dataset.sliceMode = String(isSliceActive);
    }
    const elevToggleBtn = $('#elevation-toggle');
    if (elevToggleBtn) {
      elevToggleBtn.classList.toggle('is-active', state.elevationProfileOpen);
      elevToggleBtn.setAttribute('aria-pressed', String(state.elevationProfileOpen));
    }
    const elevSliceBtn = $('#elev-slice-btn');
    if (elevSliceBtn) {
      elevSliceBtn.classList.toggle('is-active', isSliceActive);
      elevSliceBtn.setAttribute('aria-pressed', String(isSliceActive));
    }
    const elevSliceCanvas = $('#elev-slice-webgl');
    if (elevSliceCanvas) elevSliceCanvas.hidden = !isSliceActive;
    const elevSliceLegend = $('#elev-slice-legend');
    if (elevSliceLegend) elevSliceLegend.hidden = !isSliceActive;
    document.querySelectorAll('.elev-mode-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.transect === state.elevationTransectMode);
    });
    const elevClearBtn = $('#elev-clear-path-btn');
    if (elevClearBtn) {
      elevClearBtn.hidden = !(Array.isArray(state.customTransect) && state.customTransect.length >= 2);
    }
    if (!state.elevationProfileOpen) {
      if (drawingTransect) setDrawingTransect(false);
      clear3DTransectOverlay();
      syncElevationFocusSample(null, 'close');
    } else if (!isDraggingTransect) {
      updateElevationProfile();
    }

    // Yearly Climate Overlay UI Sync
    const climatePanel = $('#climate-overlay-panel');
    if (climatePanel) climatePanel.hidden = !state.climateOverlayOpen;
    const climateToggleBtn = $('#climate-toggle');
    if (climateToggleBtn) {
      climateToggleBtn.classList.toggle('is-active', state.climateOverlayOpen);
      climateToggleBtn.setAttribute('aria-pressed', String(state.climateOverlayOpen));
    }
    document.querySelectorAll('.climate-mode-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.climateMode === state.climateChartMode);
    });
    if (state.climateOverlayOpen) updateClimateOverlay();

    const cache = regionCaches[currentRegionId];
    if (terrain && cache && cache.textures) {
      if (renderedTerrainDetail !== state.terrainDetail) {
        buildTerrain();
      }
      if (renderedMapStyle !== state.mapStyle) {
        terrain.material.map = cache.textures[state.mapStyle];
        if (cache.textures.normal && !terrain.material.normalMap) {
          terrain.material.normalMap = cache.textures.normal;
          terrain.material.normalScale.set(1.25, 1.25);
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

  function focusOnMarker(id) {
    const marker = markerById(id);
    if (!marker || !camera || !controls) return;
    if (droneMode) setDroneMode(false);
    viewMode = 'perspective';
    camera.up.set(0, 1, 0);
    const { x, z } = worldPosition(marker.lat, marker.lng);
    const y = surfaceHeight(marker.lat, marker.lng);
    const isAirport = id === 'incheon-airport' || id === 'incheon-t2' || id === 'incheon-tower';
    const dx = isAirport ? 6.2 : 14;
    const dy = isAirport ? 5.6 : 13;
    const dz = isAirport ? 8.4 : 17;
    cameraFlyTarget = {
      target: new THREE.Vector3(x, y + (isAirport ? 0.45 : 0.8), z),
      pos: new THREE.Vector3(x + dx, y + dy, z + dz)
    };
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
    const drawerOpen = $('#sidebar')?.classList.contains('is-open');
    document.querySelectorAll('.rail-tab-btn').forEach((button) => {
      button.classList.toggle('is-active', Boolean(drawerOpen) && button.dataset.railTab === tab);
    });
  }

  function setLnbOpen(open, targetTab) {
    const sidebar = $('#sidebar');
    const backdrop = $('#lnb-backdrop');
    const toggleBtn = $('#lnb-toggle');
    if (!sidebar) return;

    const nextOpen = Boolean(open);
    sidebar.classList.toggle('is-open', nextOpen);
    sidebar.setAttribute('aria-hidden', String(!nextOpen));
    if (backdrop) backdrop.hidden = !nextOpen;
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(nextOpen));
      toggleBtn.setAttribute('aria-label', nextOpen ? '좌측 메뉴 닫기' : '좌측 메뉴 열기');
    }
    if (targetTab) {
      setTab(targetTab);
    } else {
      const activeTab = document.querySelector('.panel-tab.is-active')?.dataset.tab || 'places';
      document.querySelectorAll('.rail-tab-btn').forEach((button) => {
        button.classList.toggle('is-active', nextOpen && button.dataset.railTab === activeTab);
      });
    }
  }

  function setPickingLocation(enabled) {
    if (enabled && drawingTransect) setDrawingTransect(false);
    pickingLocation = enabled;
    viewer.classList.toggle('is-picking', enabled);
    $('#pick-instruction').hidden = !enabled;
    markerLayer.style.display = state.showLabels && !enabled ? '' : 'none';
  }

  function setDrawingTransect(enabled) {
    const next = Boolean(enabled);
    if (next) {
      if (pickingLocation) setPickingLocation(false);
      if (droneMode) setDroneMode(false);
      state.elevationProfileOpen = true;
      state.climateOverlayOpen = false;
    }
    drawingTransect = next;
    isDraggingTransect = false;
    if (controls) controls.enabled = !next;
    viewer.classList.toggle('is-drawing-transect', next);
    const instrEl = $('#transect-instruction');
    if (instrEl) instrEl.hidden = !next;
    const drawBtn = $('#elev-draw-btn');
    if (drawBtn) {
      drawBtn.classList.toggle('is-drawing', next);
      drawBtn.setAttribute('aria-pressed', String(next));
      drawBtn.textContent = next ? '✓ 드래그 종료' : '✏️ 3D 경로 드래그';
      if (!next) drawBtn.blur();
    }
    const elevPanel = $('#elevation-profile-panel');
    if (elevPanel) {
      elevPanel.hidden = !state.elevationProfileOpen;
      elevPanel.dataset.drawing = String(next);
    }
    const elevToggleBtn = $('#elevation-toggle');
    if (elevToggleBtn) {
      elevToggleBtn.classList.toggle('is-active', state.elevationProfileOpen);
      elevToggleBtn.setAttribute('aria-pressed', String(state.elevationProfileOpen));
    }
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

  function generateShareUrl() {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('region', currentRegionId);

    if (camera && controls) {
      const p = camera.position;
      const t = controls.target;
      const camStr = `${p.x.toFixed(1)},${p.y.toFixed(1)},${p.z.toFixed(1)},${t.x.toFixed(1)},${t.y.toFixed(1)},${t.z.toFixed(1)}`;
      url.searchParams.set('cam', camStr);
    }

    if (viewMode && viewMode !== 'perspective') {
      url.searchParams.set('view', viewMode);
    }

    if (state.selectedId) {
      url.searchParams.set('sel', state.selectedId);
    }

    if (state.mapStyle && state.mapStyle !== 'natural') {
      url.searchParams.set('style', state.mapStyle);
    }

    if (state.terrainDetail && state.terrainDetail !== 'adaptive') {
      url.searchParams.set('mesh', state.terrainDetail);
    }

    if (state.heightScale && state.heightScale !== 100) {
      url.searchParams.set('height', String(state.heightScale));
    }

    if (state.weather && state.weather !== 'clear') {
      url.searchParams.set('weather', state.weather);
    }

    if (state.solarTime !== undefined && state.solarTime !== 810) {
      url.searchParams.set('time', String(Math.round(state.solarTime)));
    }

    if (state.solarDate && state.solarDate !== '2026-11-10') {
      url.searchParams.set('date', state.solarDate);
    }

    if (state.elevationProfileOpen) {
      url.searchParams.set('elev', '1');
      if (state.elevationTransectMode && state.elevationTransectMode !== 'west-east') {
        url.searchParams.set('transect', state.elevationTransectMode);
      }
      if (state.elevationTransectMode === 'custom-path' && Array.isArray(state.customTransect) && state.customTransect.length >= 2) {
        const ctStr = state.customTransect.slice(0, 40).map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`).join(';');
        url.searchParams.set('ct', ctStr);
      }
      if (state.verticalSliceMode) {
        url.searchParams.set('slice', '1');
      }
    }

    if (state.climateOverlayOpen) {
      url.searchParams.set('climate', '1');
      if (state.climateChartMode && state.climateChartMode !== 'overview') {
        url.searchParams.set('cmode', state.climateChartMode);
      }
    }

    if (state.markers && state.markers.length > 0) {
      const presetIds = [];
      const customItems = [];
      state.markers.forEach((m) => {
        if (m.custom) {
          customItems.push(`${encodeURIComponent(m.name)}:${m.lat.toFixed(4)}:${m.lng.toFixed(4)}`);
        } else {
          presetIds.push(m.id);
        }
      });
      if (presetIds.length > 0) url.searchParams.set('places', presetIds.join(','));
      if (customItems.length > 0) url.searchParams.set('custom', customItems.join(';'));
    }

    return url.toString();
  }

  function openShareDialog(url) {
    const dialog = $('#share-dialog');
    const input = $('#share-url-input');
    if (!dialog || !input) return;
    input.value = url;
    dialog.hidden = false;
    input.focus();
    input.select();
  }

  function closeShareDialog() {
    const dialog = $('#share-dialog');
    if (dialog) dialog.hidden = true;
  }

  async function shareCurrentView() {
    const shareUrl = generateShareUrl();
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      }
    } catch (_) {
      copied = false;
    }

    if (!copied) {
      try {
        const temp = document.createElement('textarea');
        temp.value = shareUrl;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        copied = document.execCommand('copy');
        document.body.removeChild(temp);
      } catch (_) {
        copied = false;
      }
    }

    if (copied) {
      showToast('🔗 현재 3D 지도 뷰 링크를 클립보드에 복사했어요!');
    } else {
      openShareDialog(shareUrl);
      showToast('공유 링크가 생성되었습니다. 링크를 복사해주세요.');
    }
  }

  function setView(mode) {
    if (!camera || !controls) return;
    if (droneMode) setDroneMode(false);
    cameraFlyTarget = null;
    viewMode = mode;
    const r = getRegion();
    const aspect = Math.max(0.4, viewer.clientWidth / Math.max(1, viewer.clientHeight));
    const distance = Math.max(r.defaultCamDistance, (r.mapWidth * 0.62) / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect));
    camera.up.set(0, mode === 'top' ? 0 : 1, mode === 'top' ? -1 : 0);
    if (mode === 'top') {
      controls.target.set(0, -15, 0);
      camera.position.set(0, distance - 17, 0.01);
    } else if (currentRegionId === 'gangneung') {
      // Frame Gyeongpodae, Gyeongpo Lake & East Sea coast in the foreground with distant Seoraksan rising on the NW skyline
      controls.target.set(6, -11, 2);
      camera.position.set(distance * 0.44, distance * 0.34 - 16, distance * 0.62);
    } else if (currentRegionId === 'yeongam') {
      // Frame Yeongam KIC F1 circuit, Grandstand & Marina waterfront in foreground with Eunjeoksan / Wolchulsan ridge behind
      controls.target.set(-14, -7.5, 8);
      camera.position.set(-44, 24, 56);
    } else {
      controls.target.set(0, -15, 0);
      camera.position.set(distance * 0.45, distance * 0.53 - 17, distance * 0.72);
    }
    camera.lookAt(controls.target);
    controls.update();
    document.querySelectorAll('.view-tools [data-action]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.action === mode);
    });
  }

  function zoom(factor) {
    if (!camera || !controls) return;
    cameraFlyTarget = null;
    const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
    const distance = Math.max(10, Math.min(420, offset.length()));
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
    const lnbMark = $('#lnb-brand-mark');
    if (lnbMark) {
      lnbMark.textContent = r.brandMark;
      lnbMark.style.background = r.brandColor;
    }
    const lnbTitle = $('#lnb-brand-title');
    if (lnbTitle) lnbTitle.textContent = r.brandTitle;

    // LNB Destination state (Drawer + Rail)
    document.querySelectorAll('.dest-tab').forEach((tab) => {
      const active = tab.dataset.region === r.id;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.rail-dest-btn').forEach((btn) => {
      const active = btn.dataset.region === r.id;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    // Sidebar text
    $('#sidebar-eyebrow').textContent = r.sidebarEyebrow;
    $('#sidebar-title').innerHTML = r.sidebarTitle;
    $('#sidebar-desc').textContent = r.sidebarDesc;
    const kicker = $('#sidebar-kicker');
    if (kicker) kicker.textContent = r.id === 'jeju' ? 'EXPLORE JEJU' : (r.id === 'haeundae' ? 'EXPLORE HAEUNDAE' : (r.id === 'gangneung' ? 'EXPLORE GANGNEUNG' : (r.id === 'yeongam' ? 'EXPLORE YEONGAM' : 'EXPLORE INCHEON')));
    const styleLead = $('#panel-lead-style');
    if (styleLead) styleLead.textContent = r.id === 'jeju' ? '한라산의 높낮이와 해안선을 원하는 방식으로 살펴보세요.' : (r.id === 'haeundae' ? '장산과 동백섬, 해안선의 높낮이를 원하는 방식으로 살펴보세요.' : (r.id === 'gangneung' ? '경포호와 동해 해안, 멀리 설악산 대청봉 능선의 고도를 살펴보세요.' : (r.id === 'yeongam' ? '코리아 인터내셔널 서킷 평지와 은적산·월출산 산악 배경의 높낮이를 살펴보세요.' : '영종도 백운산과 송도, 인천대교의 높낮이를 살펴보세요.')));
    const customName = $('#custom-name');
    if (customName) customName.placeholder = r.id === 'jeju' ? '예: 나만의 제주 장소' : (r.id === 'haeundae' ? '예: 나만의 해운대 장소' : (r.id === 'gangneung' ? '예: 나만의 강릉·설악 장소' : (r.id === 'yeongam' ? '예: 나만의 영암 서킷 포인트' : '예: 나만의 인천 장소')));

    // Viewer badges & aria-label
    if (viewer) viewer.setAttribute('aria-label', `${r.name} 3D 지도`);
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
    const clearBtn = $('#place-search-clear');
    if (clearBtn) clearBtn.hidden = true;
    const revPickStatus = $('#reverse-pick-status');
    if (revPickStatus) revPickStatus.hidden = true;
    clearLiveSearch();
  }

  async function switchRegion(newRegionId) {
    if (newRegionId === currentRegionId) return;
    if (drawingTransect) setDrawingTransect(false);
    const prevClimateOpen = Boolean(state.climateOverlayOpen);
    const prevClimateMode = state.climateChartMode || 'overview';
    const prevElevOpen = Boolean(state.elevationProfileOpen);
    const prevElevMode = state.elevationTransectMode || 'west-east';
    const prevVerticalSlice = Boolean(state.verticalSliceMode);
    persist(); // Save current region state first

    currentRegionId = newRegionId;
    const r = getRegion();
    applyRegionUI();

    // Load state for the new region, keeping active chart overlays open for direct regional comparison
    state = loadState(r);
    if (prevClimateOpen) {
      state.climateOverlayOpen = true;
      state.climateChartMode = prevClimateMode;
      state.elevationProfileOpen = false;
    } else if (prevElevOpen) {
      state.elevationProfileOpen = true;
      state.elevationTransectMode =
        prevElevMode === 'custom-path' && (!state.customTransect || state.customTransect.length < 2)
          ? 'west-east'
          : prevElevMode;
      state.verticalSliceMode = prevVerticalSlice;
      state.climateOverlayOpen = false;
    }
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
    // Destination Tabs in Offcanvas LNB + Slim Rail
    document.querySelectorAll('.dest-tab, .rail-dest-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const dest = button.dataset.region;
        if (dest) switchRegion(dest);
      });
    });

    document.querySelectorAll('.rail-tab-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.dataset.railTab;
        if (!tab) return;
        const isOpen = $('#sidebar')?.classList.contains('is-open');
        const activeTab = document.querySelector('.panel-tab.is-active')?.dataset.tab;
        if (isOpen && activeTab === tab) {
          setLnbOpen(false);
        } else {
          setLnbOpen(true, tab);
        }
      });
    });

    const railOpenBtn = $('#rail-open-plan');
    if (railOpenBtn) railOpenBtn.addEventListener('click', () => $('#plan-file').click());
    const railResetBtn = $('#rail-reset-plan');
    if (railResetBtn) railResetBtn.addEventListener('click', () => $('#reset-plan')?.click());

    document.querySelectorAll('.panel-tab').forEach((button) => {
      button.addEventListener('click', () => setTab(button.dataset.tab));
    });

    const gmpBannerDismiss = $('#gmp-quota-dismiss');
    if (gmpBannerDismiss) {
      gmpBannerDismiss.addEventListener('click', () => {
        quotaBannerDismissed = true;
        const banner = $('#gmp-quota-banner');
        if (banner) banner.hidden = true;
      });
    }

    const placeSearchInput = $('#place-search');
    placeSearchInput.addEventListener('input', (event) => {
      renderPresets();
      scheduleLivePlaceSearch(event.target.value);
    });
    const placeSearchClear = $('#place-search-clear');
    if (placeSearchClear) {
      placeSearchClear.addEventListener('click', () => {
        placeSearchInput.value = '';
        placeSearchClear.hidden = true;
        searchSessionToken = createSessionToken();
        clearLiveSearch();
        renderPresets();
        placeSearchInput.focus();
      });
    }
    const reverseCenterBtn = $('#reverse-center-btn');
    if (reverseCenterBtn) {
      reverseCenterBtn.addEventListener('click', () => {
        const r = getRegion();
        let targetLat = (r.bounds.south + r.bounds.north) * 0.5;
        let targetLng = (r.bounds.west + r.bounds.east) * 0.5;
        if (controls && controls.target) {
          targetLat = r.bounds.north - (controls.target.z / r.mapDepth + 0.5) * (r.bounds.north - r.bounds.south);
          targetLng = r.bounds.west + (controls.target.x / r.mapWidth + 0.5) * (r.bounds.east - r.bounds.west);
        }
        reverseGeocodeCoordinates(targetLat, targetLng, { updateSuggestions: true });
      });
    }
    const geocodeSuggestionList = $('#geocode-suggestion-list');
    if (geocodeSuggestionList) {
      geocodeSuggestionList.addEventListener('click', (event) => {
        const card = event.target.closest('[data-suggestion-idx]');
        if (!card) return;
        const idx = Number(card.dataset.suggestionIdx);
        if (Number.isFinite(idx) && liveSuggestions[idx]) {
          selectSuggestedPlace(liveSuggestions[idx]);
        }
      });
    }
    const customNameInp = $('#custom-name');
    if (customNameInp) {
      customNameInp.addEventListener('input', () => {
        customNameInp.dataset.autofilled = 'false';
      });
    }

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
      setLnbOpen(false);
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
    document.querySelectorAll('input[name="terrain-detail"]').forEach((radio) => {
      radio.addEventListener('change', (event) => {
        commit(() => { state.terrainDetail = event.target.value; });
        const labels = { eco: '경량', adaptive: '적응형 정밀', high: '고밀도' };
        showToast(`지형 메시: ${labels[event.target.value] || event.target.value}`);
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

    // Solar Controls
    const solarDateInp = $('#solar-date');
    if (solarDateInp) {
      solarDateInp.addEventListener('change', (e) => {
        commit(() => { state.solarDate = e.target.value; });
        showToast(`기준 일자를 ${e.target.value}로 변경했어요.`);
      });
    }

    const solarTimeSlider = $('#solar-time-slider');
    if (solarTimeSlider) {
      solarTimeSlider.addEventListener('input', (e) => {
        state.solarTime = Number(e.target.value);
        updateSolarLighting(0);
      });
      solarTimeSlider.addEventListener('change', (e) => {
        commit(() => { state.solarTime = Number(e.target.value); });
      });
    }

    const solarNowBtn = $('#solar-now-btn');
    if (solarNowBtn) {
      solarNowBtn.addEventListener('click', () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const minutes = now.getHours() * 60 + now.getMinutes();
        commit(() => {
          state.solarDate = `${y}-${m}-${d}`;
          state.solarTime = minutes;
        });
        showToast('현재 로컬 시각으로 동기화했어요.');
      });
    }

    const solarPlayBtn = $('#solar-play-btn');
    if (solarPlayBtn) {
      solarPlayBtn.addEventListener('click', () => {
        solarPlaying = !solarPlaying;
        solarPlayBtn.textContent = solarPlaying ? '⏸ 정지' : '▶ 재생';
        solarPlayBtn.style.background = solarPlaying ? '#dc2626' : '#1769c1';
        showToast(solarPlaying ? '태양 궤적 24시간 재생을 시작했어요.' : '태양 궤적 재생을 일시정지했어요.');
      });
    }

    const solarSpeedSel = $('#solar-speed');
    if (solarSpeedSel) {
      solarSpeedSel.addEventListener('change', (e) => {
        solarSpeed = Number(e.target.value);
      });
    }

    document.querySelectorAll('[data-solar-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.solarPreset;
        const targetMin = p === 'sunrise' ? 420 : p === 'noon' ? 720 : p === 'golden' ? 1020 : p === 'sunset' ? 1050 : 60;
        commit(() => { state.solarTime = targetMin; });
        showToast(`${btn.textContent.trim()} 시각으로 이동했어요.`);
      });
    });

    // Elevation Profile Controls
    const elevToggleBtn = $('#elevation-toggle');
    if (elevToggleBtn) {
      elevToggleBtn.addEventListener('click', () => {
        if (state.elevationProfileOpen && drawingTransect) setDrawingTransect(false);
        commit(() => {
          const nextOpen = !state.elevationProfileOpen;
          state.elevationProfileOpen = nextOpen;
          if (nextOpen) state.climateOverlayOpen = false;
        });
      });
    }

    const elevCloseBtn = $('#elev-close-btn');
    if (elevCloseBtn) {
      elevCloseBtn.addEventListener('click', () => {
        if (drawingTransect) setDrawingTransect(false);
        commit(() => { state.elevationProfileOpen = false; });
      });
    }

    const elevSliceBtn = $('#elev-slice-btn');
    if (elevSliceBtn) {
      elevSliceBtn.addEventListener('click', () => {
        commit(() => {
          state.verticalSliceMode = !state.verticalSliceMode;
          if (state.verticalSliceMode) {
            state.elevationProfileOpen = true;
            state.climateOverlayOpen = false;
          }
        });
        showToast(state.verticalSliceMode
          ? '🪨 Vertical Slice 3D 지형 절단 모드를 켰어요. 지형 내부 지층 단면을 확인하세요.'
          : 'Vertical Slice 모드를 끄고 전체 지형을 복원했어요.');
      });
    }

    const elevDrawBtn = $('#elev-draw-btn');
    if (elevDrawBtn) {
      elevDrawBtn.addEventListener('click', () => {
        const nextDraw = !drawingTransect;
        setDrawingTransect(nextDraw);
        if (nextDraw) {
          showToast('3D 지형 위를 마우스로 드래그해 고도 단면 경로를 그려보세요.');
        }
      });
    }

    const cancelTransectDrawBtn = $('#cancel-transect-draw');
    if (cancelTransectDrawBtn) {
      cancelTransectDrawBtn.addEventListener('click', () => {
        setDrawingTransect(false);
      });
    }

    const elevClearPathBtn = $('#elev-clear-path-btn');
    if (elevClearPathBtn) {
      elevClearPathBtn.addEventListener('click', () => {
        commit(() => {
          state.customTransect = [];
          if (state.elevationTransectMode === 'custom-path') {
            state.elevationTransectMode = 'west-east';
          }
        });
        showToast('직접 그린 단면 경로를 초기화했어요.');
      });
    }

    document.querySelectorAll('.elev-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.transect;
        if (mode !== 'custom-path' && drawingTransect) {
          setDrawingTransect(false);
        }
        commit(() => { state.elevationTransectMode = mode; });
        if (mode === 'custom-path' && (!state.customTransect || state.customTransect.length < 2)) {
          setDrawingTransect(true);
          showToast('3D 지형 위를 드래그해 직접 단면 경로를 그려보세요.');
        }
      });
    });

    // Yearly Climate Overlay Controls
    const climateToggleBtn = $('#climate-toggle');
    if (climateToggleBtn) {
      climateToggleBtn.addEventListener('click', () => {
        commit(() => {
          const nextOpen = !state.climateOverlayOpen;
          state.climateOverlayOpen = nextOpen;
          if (nextOpen) state.elevationProfileOpen = false;
        });
      });
    }

    const climateCloseBtn = $('#climate-close-btn');
    if (climateCloseBtn) {
      climateCloseBtn.addEventListener('click', () => {
        commit(() => { state.climateOverlayOpen = false; });
      });
    }

    document.querySelectorAll('.climate-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.climateMode;
        if (['overview', 'sunshine', 'marine'].includes(mode)) {
          commit(() => { state.climateChartMode = mode; });
        }
      });
    });

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
    const focusSelBtn = $('#focus-selection');
    if (focusSelBtn) focusSelBtn.addEventListener('click', () => {
      if (state.selectedId) focusOnMarker(state.selectedId);
    });
    $('#remove-selection').addEventListener('click', () => removeMarker(state.selectedId));
    $('#save-plan').addEventListener('click', savePlan);
    $('#bottom-save').addEventListener('click', savePlan);
    const shareBtn = $('#share-view');
    if (shareBtn) shareBtn.addEventListener('click', shareCurrentView);
    const shareDialogClose = $('#share-dialog-close');
    if (shareDialogClose) shareDialogClose.addEventListener('click', closeShareDialog);
    const shareCopyBtn = $('#share-copy-btn');
    if (shareCopyBtn) {
      shareCopyBtn.addEventListener('click', async () => {
        const input = $('#share-url-input');
        if (!input) return;
        input.select();
        let copySuccess = false;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(input.value);
            copySuccess = true;
          }
        } catch (_) {}
        if (!copySuccess) {
          try {
            copySuccess = document.execCommand('copy');
          } catch (_) {}
        }
        if (copySuccess) {
          showToast('🔗 현재 3D 지도 뷰 링크를 클립보드에 복사했어요!');
          setTimeout(closeShareDialog, 1000);
        } else {
          showToast('Ctrl+C 또는 길게 눌러 URL을 복사해주세요.');
        }
      });
    }
    const shareDialog = $('#share-dialog');
    if (shareDialog) {
      shareDialog.addEventListener('click', (e) => {
        if (e.target === shareDialog) closeShareDialog();
      });
    }
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
    const lnbToggle = $('#lnb-toggle');
    if (lnbToggle) {
      lnbToggle.addEventListener('click', () => {
        const isOpen = $('#sidebar')?.classList.contains('is-open');
        setLnbOpen(!isOpen);
      });
    }
    const lnbClose = $('#lnb-close');
    if (lnbClose) lnbClose.addEventListener('click', () => setLnbOpen(false));
    const lnbBackdrop = $('#lnb-backdrop');
    if (lnbBackdrop) lnbBackdrop.addEventListener('click', () => setLnbOpen(false));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (drawingTransect) {
          setDrawingTransect(false);
          return;
        }
        if ($('#sidebar')?.classList.contains('is-open')) {
          setLnbOpen(false);
        }
      }
    });
    applyRegionUI();
    renderState();
    setLnbOpen(false);
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
    if (state.elevationProfileOpen) updateElevationProfile();
    if (state.climateOverlayOpen) updateClimateOverlay();
  }

  async function prepareRegionAssets(regionId) {
    if (regionCaches[regionId]) return regionCaches[regionId];

    const maxAniso = Math.min(16, renderer.capabilities.getMaxAnisotropy());

    if (regionId === 'jeju') {
      const image = await loadImage(window.JEJU_ASSETS.height);
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = image.width;
      sourceCanvas.height = image.height;
      const context = sourceCanvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const heightData = { width: image.width, height: image.height, pixels: context.getImageData(0, 0, image.width, image.height).data };

      let natural, elevation, normal, roughness;
      if (typeof window.createRealisticJejuAssets === 'function') {
        const { naturalCanvas, elevationCanvas, normalCanvas, roughnessCanvas } = window.createRealisticJejuAssets(sourceCanvas, window.JEJU_OUTLINE);
        natural = new THREE.CanvasTexture(naturalCanvas);
        natural.encoding = THREE.sRGBEncoding;
        natural.anisotropy = maxAniso;

        elevation = new THREE.CanvasTexture(elevationCanvas);
        elevation.encoding = THREE.sRGBEncoding;
        elevation.anisotropy = maxAniso;

        normal = new THREE.CanvasTexture(normalCanvas);
        normal.anisotropy = maxAniso;

        if (roughnessCanvas) {
          roughness = new THREE.CanvasTexture(roughnessCanvas);
          roughness.anisotropy = maxAniso;
        }
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
        textures: { natural, elevation, normal, roughness }
      };
    } else if (regionId === 'haeundae') {
      if (typeof window.createHaeundaeAssets !== 'function') {
        throw new Error('해운대 3D 에셋 생성기를 찾을 수 없습니다.');
      }
      const { heightCanvas, naturalCanvas, elevationCanvas, normalCanvas, roughnessCanvas } = window.createHaeundaeAssets();
      const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });
      const heightData = {
        width: heightCanvas.width,
        height: heightCanvas.height,
        pixels: hCtx.getImageData(0, 0, heightCanvas.width, heightCanvas.height).data
      };

      const natural = new THREE.CanvasTexture(naturalCanvas);
      natural.encoding = THREE.sRGBEncoding;
      natural.anisotropy = maxAniso;

      const elevation = new THREE.CanvasTexture(elevationCanvas);
      elevation.encoding = THREE.sRGBEncoding;
      elevation.anisotropy = maxAniso;

      let normal, roughness;
      if (normalCanvas) {
        normal = new THREE.CanvasTexture(normalCanvas);
        normal.anisotropy = maxAniso;
      }
      if (roughnessCanvas) {
        roughness = new THREE.CanvasTexture(roughnessCanvas);
        roughness.anisotropy = maxAniso;
      }

      regionCaches.haeundae = {
        heightData,
        textures: { natural, elevation, normal, roughness }
      };
    } else if (regionId === 'incheon') {
      if (typeof window.createIncheonAssets !== 'function') {
        throw new Error('인천 3D 에셋 생성기를 찾을 수 없습니다.');
      }
      const { heightCanvas, naturalCanvas, elevationCanvas, normalCanvas, roughnessCanvas } = window.createIncheonAssets();
      const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });
      const heightData = {
        width: heightCanvas.width,
        height: heightCanvas.height,
        pixels: hCtx.getImageData(0, 0, heightCanvas.width, heightCanvas.height).data
      };

      const natural = new THREE.CanvasTexture(naturalCanvas);
      natural.encoding = THREE.sRGBEncoding;
      natural.anisotropy = maxAniso;

      const elevation = new THREE.CanvasTexture(elevationCanvas);
      elevation.encoding = THREE.sRGBEncoding;
      elevation.anisotropy = maxAniso;

      let normal, roughness;
      if (normalCanvas) {
        normal = new THREE.CanvasTexture(normalCanvas);
        normal.anisotropy = maxAniso;
      }
      if (roughnessCanvas) {
        roughness = new THREE.CanvasTexture(roughnessCanvas);
        roughness.anisotropy = maxAniso;
      }

      regionCaches.incheon = {
        heightData,
        textures: { natural, elevation, normal, roughness }
      };
    } else if (regionId === 'gangneung') {
      if (typeof window.createGangneungAssets !== 'function') {
        throw new Error('강릉·설악산 3D 에셋 생성기를 찾을 수 없습니다.');
      }
      const { heightCanvas, naturalCanvas, elevationCanvas, normalCanvas, roughnessCanvas } = window.createGangneungAssets();
      const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });
      const heightData = {
        width: heightCanvas.width,
        height: heightCanvas.height,
        pixels: hCtx.getImageData(0, 0, heightCanvas.width, heightCanvas.height).data
      };

      const natural = new THREE.CanvasTexture(naturalCanvas);
      natural.encoding = THREE.sRGBEncoding;
      natural.anisotropy = maxAniso;

      const elevation = new THREE.CanvasTexture(elevationCanvas);
      elevation.encoding = THREE.sRGBEncoding;
      elevation.anisotropy = maxAniso;

      let normal, roughness;
      if (normalCanvas) {
        normal = new THREE.CanvasTexture(normalCanvas);
        normal.anisotropy = maxAniso;
      }
      if (roughnessCanvas) {
        roughness = new THREE.CanvasTexture(roughnessCanvas);
        roughness.anisotropy = maxAniso;
      }

      regionCaches.gangneung = {
        heightData,
        textures: { natural, elevation, normal, roughness }
      };
    } else if (regionId === 'yeongam') {
      if (typeof window.createYeongamAssets !== 'function') {
        throw new Error('전남 영암 KIC 서킷 3D 에셋 생성기를 찾을 수 없습니다.');
      }
      const { heightCanvas, naturalCanvas, elevationCanvas, normalCanvas, roughnessCanvas } = window.createYeongamAssets();
      const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });
      const heightData = {
        width: heightCanvas.width,
        height: heightCanvas.height,
        pixels: hCtx.getImageData(0, 0, heightCanvas.width, heightCanvas.height).data
      };

      const natural = new THREE.CanvasTexture(naturalCanvas);
      natural.encoding = THREE.sRGBEncoding;
      natural.anisotropy = maxAniso;

      const elevation = new THREE.CanvasTexture(elevationCanvas);
      elevation.encoding = THREE.sRGBEncoding;
      elevation.anisotropy = maxAniso;

      let normal, roughness;
      if (normalCanvas) {
        normal = new THREE.CanvasTexture(normalCanvas);
        normal.anisotropy = maxAniso;
      }
      if (roughnessCanvas) {
        roughness = new THREE.CanvasTexture(roughnessCanvas);
        roughness.anisotropy = maxAniso;
      }

      regionCaches.yeongam = {
        heightData,
        textures: { natural, elevation, normal, roughness }
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

    const shoreOutline = currentRegionId === 'gangneung' ? outline.slice(0, 21) : outline;
    const points = shoreOutline.map(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      return new THREE.Vector3(x, 0.12, z);
    });
    shoreline = currentRegionId === 'gangneung'
      ? new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: 0xf5fbfb, transparent: true, opacity: 0.88 })
        )
      : new THREE.LineLoop(
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

    const geometry = new THREE.BufferGeometry();

    if (window.TerrainOptimizer && typeof window.TerrainOptimizer.buildOptimizedTerrainGeometry === 'function') {
      const optimized = window.TerrainOptimizer.buildOptimizedTerrainGeometry({
        mapWidth: r.mapWidth,
        mapDepth: r.mapDepth,
        bounds: r.bounds,
        sampleHeightMeters: heightAt,
        regionId: currentRegionId,
        quality: state.terrainDetail || 'adaptive'
      });
      geometry.setAttribute('position', new THREE.BufferAttribute(optimized.positions, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(optimized.uvs, 2));
      geometry.setIndex(new THREE.BufferAttribute(optimized.indices, 1));
      window.__lastTerrainStats = optimized.stats;
    } else {
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
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
    }

    const matOptions = {
      map: cache.textures[state.mapStyle],
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
      roughness: cache.textures.roughness ? 1.0 : 0.82,
      metalness: 0.04,
      polygonOffset: true,
      polygonOffsetFactor: -1
    };
    if (cache.textures.normal) {
      matOptions.normalMap = cache.textures.normal;
      matOptions.normalScale = new THREE.Vector2(1.25, 1.25);
    }
    if (cache.textures.roughness) {
      matOptions.roughnessMap = cache.textures.roughness;
    }
    terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial(matOptions));
    terrain.receiveShadow = true;
    scene.add(terrain);
    renderedMapStyle = state.mapStyle;
    renderedTerrainDetail = state.terrainDetail;
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
    if (currentRegionId === 'incheon') buildIncheonAirport();
    if (currentRegionId === 'gangneung') buildGangneungLandmarks();
    if (currentRegionId === 'yeongam') buildYeongamCircuit();
    if (state.elevationProfileOpen) updateElevationProfile();
    else restoreTerrainFromVerticalSlice();
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
      label.addEventListener('dblclick', () => focusOnMarker(marker.id));
      markerLayer.append(label);
      markerObjects.push({ marker, group, label });
    }
  }

  function updateLabels() {
    if (!camera || !state.showLabels) return;
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    const placed = [];
    for (const { group, label } of markerObjects) {
      const point = new THREE.Vector3(group.position.x, group.position.y + 2.9, group.position.z).project(camera);
      const x = (point.x * 0.5 + 0.5) * width;
      let y = (-point.y * 0.5 + 0.5) * height;
      const isHidden = point.z < -1 || point.z > 1 || x < 5 || x > width - 5 || y < 20 || y > height - 80;
      label.hidden = isHidden;
      if (!isHidden) {
        const w = label.offsetWidth || 126;
        const h = label.offsetHeight || 28;
        for (let iter = 0; iter < 5; iter++) {
          const hit = placed.find((p) => Math.abs(x - p.x) < (w + p.w) * 0.5 + 8 && Math.abs(y - p.y) < (h + p.h) * 0.5 + 6);
          if (!hit) break;
          y = hit.y - (h + 8);
        }
        y = Math.max(26, y);
        placed.push({ x, y, w, h });
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
      }
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
      new THREE.MeshStandardMaterial({ color: 0x196395, roughness: 0.22, metalness: 0.15, toneMapped: true })
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
    buildIncheonBridge();
    buildIncheonAirport();
    buildGangneungLandmarks();
    buildYeongamCircuit();
    syncMarkers();
    resetWeatherBounds();
    if (state.elevationProfileOpen) updateElevationProfile();
    else clear3DTransectOverlay();
  }

  function buildIncheonBridge() {
    if (incheonBridgeGroup) {
      disposeObject(incheonBridgeGroup);
      incheonBridgeGroup = null;
    }
    if (currentRegionId !== 'incheon') return;

    incheonBridgeGroup = new THREE.Group();
    incheonBridgeGroup.name = 'incheon-bridge';

    // Incheon Grand Bridge route coordinates spanning sea between Songdo and Yeongjongdo
    const bridgeWaypoints = [
      [126.6150, 37.3750],
      [126.5950, 37.3900],
      [126.5780, 37.4050],
      [126.5680, 37.4140], // Main cable-stayed navigation span
      [126.5450, 37.4260],
      [126.5200, 37.4200],
      [126.4950, 37.4050]
    ];

    // Bridge deck curved viaduct
    const deckPoints = bridgeWaypoints.map(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      const isMainSpan = Math.abs(lat - 37.4140) < 0.015;
      const y = isMainSpan ? 3.6 : 2.2;
      return new THREE.Vector3(x, y, z);
    });

    const bridgeCurve = new THREE.CatmullRomCurve3(deckPoints);
    const bridgeTubeGeo = new THREE.TubeGeometry(bridgeCurve, 64, 0.45, 6, false);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0xdde6ed,
      roughness: 0.38,
      metalness: 0.25
    });
    const bridgeDeck = new THREE.Mesh(bridgeTubeGeo, bridgeMat);
    bridgeDeck.castShadow = true;
    bridgeDeck.receiveShadow = true;
    incheonBridgeGroup.add(bridgeDeck);

    // Deck asphalt roadway stripe
    const roadPoints = bridgeCurve.getPoints(90);
    const roadLineGeo = new THREE.BufferGeometry().setFromPoints(roadPoints.map(p => new THREE.Vector3(p.x, p.y + 0.28, p.z)));
    const roadLineMat = new THREE.LineBasicMaterial({ color: 0x334155, linewidth: 2 });
    const roadLine = new THREE.Line(roadLineGeo, roadLineMat);
    incheonBridgeGroup.add(roadLine);

    // Iconic Incheon Bridge Twin Inverted-Y Diamond Cable-Stayed Pylons
    const towerCoords = [
      [126.5650, 37.4168],
      [126.5710, 37.4112]
    ];

    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.28,
      metalness: 0.35
    });

    const cableMat = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.75
    });

    towerCoords.forEach(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      const towerGroup = new THREE.Group();
      towerGroup.position.set(x, 0, z);

      // Inverted-Y diamond legs
      const legGeo = new THREE.CylinderGeometry(0.26, 0.52, 14.5, 8);
      const leftLeg = new THREE.Mesh(legGeo, towerMat);
      leftLeg.position.set(-0.85, 7.25, 0);
      leftLeg.rotation.z = -0.07;
      leftLeg.castShadow = true;
      towerGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, towerMat);
      rightLeg.position.set(0.85, 7.25, 0);
      rightLeg.rotation.z = 0.07;
      rightLeg.castShadow = true;
      towerGroup.add(rightLeg);

      // Upper single diamond tower mast
      const topMastGeo = new THREE.CylinderGeometry(0.18, 0.42, 7.5, 8);
      const topMast = new THREE.Mesh(topMastGeo, towerMat);
      topMast.position.set(0, 18.2, 0);
      topMast.castShadow = true;
      towerGroup.add(topMast);

      // Red aircraft warning beacon light atop pylon
      const beaconGeo = new THREE.SphereGeometry(0.24, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, 22.1, 0);
      towerGroup.add(beacon);

      // Stay cables radiating down to deck
      const cablePts = [];
      const cableCount = 8;
      for (let c = 0; c < cableCount; c++) {
        const topY = 14 + (c / cableCount) * 7.5;
        const dist = 3.2 + c * 2.1;
        // Fore stays
        cablePts.push(new THREE.Vector3(x, topY, z));
        cablePts.push(new THREE.Vector3(x - dist * 0.7, 3.6, z - dist * 0.7));
        // Aft stays
        cablePts.push(new THREE.Vector3(x, topY, z));
        cablePts.push(new THREE.Vector3(x + dist * 0.7, 3.6, z + dist * 0.7));
      }
      const cableGeo = new THREE.BufferGeometry().setFromPoints(cablePts);
      const cableLines = new THREE.LineSegments(cableGeo, cableMat);
      incheonBridgeGroup.add(cableLines);

      // Pier foundation in ocean
      const pierGeo = new THREE.BoxGeometry(2.4, 3.2, 2.4);
      const pierMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
      const pier = new THREE.Mesh(pierGeo, pierMat);
      pier.position.set(0, 0.6, 0);
      pier.castShadow = true;
      towerGroup.add(pier);

      incheonBridgeGroup.add(towerGroup);
    });

    // Viaduct support piers along the route
    for (let i = 0; i < deckPoints.length; i += 2) {
      const p = deckPoints[i];
      const pierGeo = new THREE.CylinderGeometry(0.3, 0.4, p.y + 1.2, 8);
      const pierMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
      const pierMesh = new THREE.Mesh(pierGeo, pierMat);
      pierMesh.position.set(p.x, (p.y + 1.2) / 2 - 1.2, p.z);
      pierMesh.castShadow = true;
      incheonBridgeGroup.add(pierMesh);
    }

    scene.add(incheonBridgeGroup);
  }

  function createAircraftMesh(livery = 'korean') {
    const plane = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.35
    });
    const tailColor = livery === 'korean' ? 0x0284c7 : (livery === 'asiana' ? 0x1e293b : 0xd97706);
    const tailMat = new THREE.MeshStandardMaterial({
      color: tailColor,
      roughness: 0.32,
      metalness: 0.25
    });
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.32,
      metalness: 0.45
    });
    const engineMat = new THREE.MeshStandardMaterial({
      color: livery === 'korean' ? 0x38bdf8 : 0x475569,
      roughness: 0.35,
      metalness: 0.55
    });
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.12,
      metalness: 0.65
    });

    // Fuselage (oriented along +Z nose forward)
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.052, 0.44, 10), bodyMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.castShadow = true;
    plane.add(fuselage);

    // Nose cone
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.11, 10), bodyMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 0.275;
    plane.add(nose);

    // Cockpit visor
    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.045), cockpitMat);
    cockpit.position.set(0, 0.032, 0.23);
    plane.add(cockpit);

    // Tail cone
    const tailCone = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.12, 10), bodyMat);
    tailCone.rotation.x = -Math.PI / 2;
    tailCone.position.z = -0.28;
    plane.add(tailCone);

    // Swept Main Wings (left & right)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.08);
    wingShape.lineTo(0.28, -0.09);
    wingShape.lineTo(0.28, -0.14);
    wingShape.lineTo(0, -0.04);
    wingShape.closePath();
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.014, bevelEnabled: false });
    wingGeo.rotateX(Math.PI / 2);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.02, -0.01, 0.04);
    rightWing.castShadow = true;
    plane.add(rightWing);

    const leftWing = rightWing.clone();
    leftWing.scale.x = -1;
    leftWing.position.set(-0.02, -0.01, 0.04);
    plane.add(leftWing);

    // Winglets
    const wingletGeo = new THREE.BoxGeometry(0.01, 0.045, 0.045);
    const rWinglet = new THREE.Mesh(wingletGeo, tailMat);
    rWinglet.position.set(0.295, 0.015, -0.075);
    rWinglet.rotation.z = -0.22;
    plane.add(rWinglet);
    const lWinglet = new THREE.Mesh(wingletGeo, tailMat);
    lWinglet.position.set(-0.295, 0.015, -0.075);
    lWinglet.rotation.z = 0.22;
    plane.add(lWinglet);

    // Twin Underwing Turbofans
    const engGeo = new THREE.CylinderGeometry(0.024, 0.021, 0.095, 8);
    engGeo.rotateX(Math.PI / 2);
    const rEng = new THREE.Mesh(engGeo, engineMat);
    rEng.position.set(0.11, -0.036, 0.05);
    plane.add(rEng);
    const lEng = new THREE.Mesh(engGeo, engineMat);
    lEng.position.set(-0.11, -0.036, 0.05);
    plane.add(lEng);

    // Vertical Tail Stabilizer
    const vTailShape = new THREE.Shape();
    vTailShape.moveTo(0, 0);
    vTailShape.lineTo(-0.08, 0.14);
    vTailShape.lineTo(-0.14, 0.14);
    vTailShape.lineTo(-0.10, 0);
    vTailShape.closePath();
    const vTailGeo = new THREE.ExtrudeGeometry(vTailShape, { depth: 0.014, bevelEnabled: false });
    vTailGeo.rotateY(Math.PI / 2);
    const vTail = new THREE.Mesh(vTailGeo, tailMat);
    vTail.position.set(-0.007, 0.02, -0.18);
    vTail.castShadow = true;
    plane.add(vTail);

    // Horizontal Tailplane
    const hTail = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.012, 0.06), wingMat);
    hTail.position.set(0, 0.02, -0.26);
    plane.add(hTail);

    return plane;
  }

  function buildIncheonAirport() {
    if (incheonAirportGroup) {
      disposeObject(incheonAirportGroup);
      incheonAirportGroup = null;
    }
    airportAnimPlane = null;
    airportFlightCurve = null;
    airportEmissiveMaterials = [];

    if (currentRegionId !== 'incheon') return;
    const layout = window.INCHEON_AIRPORT_LAYOUT;
    if (!layout) return;

    incheonAirportGroup = new THREE.Group();
    incheonAirportGroup.name = 'incheon-airport-complex';

    function airportToWorld(uKm, vKm) {
      const { lat, lng } = layout.toLatLng(uKm, vKm);
      const { x, z } = worldPosition(lat, lng);
      const y = surfaceHeight(lat, lng) + 0.035;
      return { x, y, z };
    }

    const originW = airportToWorld(0, 0);
    const uStep = airportToWorld(1, 0);
    const vStep = airportToWorld(0, 1);
    const uAngleY = Math.atan2(-(uStep.z - originW.z), uStep.x - originW.x);
    const vAngleY = Math.atan2(-(vStep.x - originW.x), -(vStep.z - originW.z));

    function setWorldPos(obj, uKm, vKm, dy = 0) {
      const p = airportToWorld(uKm, vKm);
      obj.position.set(p.x, p.y + dy, p.z);
    }

    // Shared PBR materials
    const roofMetalMat = new THREE.MeshStandardMaterial({
      color: 0xdce4ee,
      roughness: 0.24,
      metalness: 0.68
    });
    const darkRoofTrimMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.42,
      metalness: 0.48
    });
    const glassCurtainMat = new THREE.MeshStandardMaterial({
      color: 0x2c6a9e,
      roughness: 0.14,
      metalness: 0.48,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.12
    });
    airportEmissiveMaterials.push({ mat: glassCurtainMat, dayInt: 0.12, nightInt: 0.65 });

    const warmAtriumGlassMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.16,
      metalness: 0.35,
      emissive: 0xfcd34d,
      emissiveIntensity: 0.16
    });
    airportEmissiveMaterials.push({ mat: warmAtriumGlassMat, dayInt: 0.16, nightInt: 0.85 });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.72,
      metalness: 0.08
    });
    const jetbridgeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.38,
      metalness: 0.55
    });

    // Helper: create curved gull-wing terminal roof extrusion
    function createArchedRoofGeo(width, depth, thickness, archHeight) {
      const shape = new THREE.Shape();
      const hw = width * 0.5;
      shape.moveTo(-hw, 0);
      shape.quadraticCurveTo(0, archHeight, hw, 0);
      shape.lineTo(hw, -thickness);
      shape.quadraticCurveTo(0, archHeight - thickness, -hw, -thickness);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 16 });
      geo.translate(0, 0, -depth * 0.5);
      return geo;
    }

    // ------------------------------------------------------------
    // 1. TERMINAL 1 (제1여객터미널) - Sweeping Gull-Wing + Pier Wings
    // ------------------------------------------------------------
    const t1Group = new THREE.Group();
    setWorldPos(t1Group, 0.16, -1.04, 0);
    t1Group.rotation.y = uAngleY;

    const t1CoreGlass = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.34, 0.68), glassCurtainMat);
    t1CoreGlass.position.y = 0.17;
    t1CoreGlass.castShadow = true;
    t1CoreGlass.receiveShadow = true;
    t1Group.add(t1CoreGlass);

    const t1RoofGeo = createArchedRoofGeo(2.35, 0.82, 0.07, 0.32);
    const t1Roof = new THREE.Mesh(t1RoofGeo, roofMetalMat);
    t1Roof.position.y = 0.34;
    t1Roof.castShadow = true;
    t1Group.add(t1Roof);

    for (let i = -2; i <= 2; i++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.86), darkRoofTrimMat);
      rib.position.set(i * 0.44, 0.48 - Math.abs(i) * 0.045, 0);
      t1Group.add(rib);
    }

    [-1, 1].forEach((side) => {
      const wing = new THREE.Group();
      wing.position.set(side * 1.15, 0, -0.05);
      wing.rotation.y = side * -0.28;

      const wingGlass = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.24, 0.30), glassCurtainMat);
      wingGlass.position.set(side * 0.52, 0.12, 0);
      wingGlass.castShadow = true;
      wing.add(wingGlass);

      const wingRoof = new THREE.Mesh(createArchedRoofGeo(1.28, 0.36, 0.05, 0.14), roofMetalMat);
      wingRoof.position.set(side * 0.52, 0.25, 0);
      wingRoof.castShadow = true;
      wing.add(wingRoof);

      const rotunda = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.22, 0.26, 12), glassCurtainMat);
      rotunda.position.set(side * 1.12, 0.13, 0);
      wing.add(rotunda);
      const rotundaCap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.08, 12), roofMetalMat);
      rotundaCap.position.set(side * 1.12, 0.28, 0);
      wing.add(rotundaCap);

      t1Group.add(wing);
    });

    // T1 Landside Transportation Center (제1교통센터 "Great Hall" Elliptical Glass Dome)
    const t1Transit = new THREE.Group();
    setWorldPos(t1Transit, 0.16, -1.58, 0);
    t1Transit.rotation.y = uAngleY;

    const domePodium = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.74, 0.09, 24), concreteMat);
    domePodium.scale.set(1.25, 1, 0.78);
    domePodium.position.y = 0.045;
    t1Transit.add(domePodium);

    const glassDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.56, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
      warmAtriumGlassMat
    );
    glassDome.scale.set(1.22, 0.62, 0.74);
    glassDome.position.y = 0.08;
    glassDome.castShadow = true;
    t1Transit.add(glassDome);

    for (let rIdx = -1; rIdx <= 1; rIdx++) {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.022, 6, 20, Math.PI), roofMetalMat);
      arch.position.set(rIdx * 0.22, 0.09, 0);
      arch.rotation.y = Math.PI / 2;
      arch.scale.set(1.0, 0.85, 1.0);
      t1Transit.add(arch);
    }

    const skybridge = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.72), glassCurtainMat);
    skybridge.position.set(0, 0.22, -0.58);
    t1Transit.add(skybridge);

    incheonAirportGroup.add(t1Group);
    incheonAirportGroup.add(t1Transit);

    // ------------------------------------------------------------
    // 2. MIDFIELD CONCOURSE (탑승동) - Elongated Satellite Terminal
    // ------------------------------------------------------------
    const concourseGroup = new THREE.Group();
    setWorldPos(concourseGroup, 0.16, -0.15, 0);
    concourseGroup.rotation.y = uAngleY;

    const concourseBody = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.28, 0.34), glassCurtainMat);
    concourseBody.position.y = 0.14;
    concourseBody.castShadow = true;
    concourseBody.receiveShadow = true;
    concourseGroup.add(concourseBody);

    const concourseRoof = new THREE.Mesh(createArchedRoofGeo(2.90, 0.44, 0.055, 0.16), roofMetalMat);
    concourseRoof.position.y = 0.28;
    concourseRoof.castShadow = true;
    concourseGroup.add(concourseRoof);

    const concourseHub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.36, 16), warmAtriumGlassMat);
    concourseHub.position.y = 0.18;
    concourseGroup.add(concourseHub);
    const concourseHubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.34, 0.10, 16), roofMetalMat);
    concourseHubCap.position.y = 0.39;
    concourseGroup.add(concourseHubCap);

    incheonAirportGroup.add(concourseGroup);

    // ------------------------------------------------------------
    // 3. TERMINAL 2 (제2여객터미널) - Phoenix / H-Wing Architecture
    // ------------------------------------------------------------
    const t2Group = new THREE.Group();
    setWorldPos(t2Group, 0.08, 0.98, 0);
    t2Group.rotation.y = uAngleY;

    const t2Body = new THREE.Mesh(new THREE.BoxGeometry(2.10, 0.36, 0.62), glassCurtainMat);
    t2Body.position.y = 0.18;
    t2Body.castShadow = true;
    t2Body.receiveShadow = true;
    t2Group.add(t2Body);

    const t2Roof = new THREE.Mesh(createArchedRoofGeo(2.34, 0.74, 0.065, 0.28), roofMetalMat);
    t2Roof.position.y = 0.36;
    t2Roof.castShadow = true;
    t2Group.add(t2Roof);

    const t2Skylight = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.07, 0.14), warmAtriumGlassMat);
    t2Skylight.position.y = 0.60;
    t2Group.add(t2Skylight);

    [
      { sx: -1, sz: 1, ang: 0.32 },
      { sx: 1, sz: 1, ang: -0.32 },
      { sx: -1, sz: -1, ang: -0.24 },
      { sx: 1, sz: -1, ang: 0.24 }
    ].forEach(({ sx, sz, ang }) => {
      const pier = new THREE.Group();
      pier.position.set(sx * 0.96, 0, sz * 0.18);
      pier.rotation.y = ang;
      const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.24, 0.24), glassCurtainMat);
      pBody.position.set(sx * 0.36, 0.12, 0);
      pBody.castShadow = true;
      pier.add(pBody);
      const pRoof = new THREE.Mesh(createArchedRoofGeo(0.94, 0.30, 0.045, 0.11), roofMetalMat);
      pRoof.position.set(sx * 0.36, 0.24, 0);
      pRoof.castShadow = true;
      pier.add(pRoof);
      t2Group.add(pier);
    });

    const t2Transit = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.20, 0.42), warmAtriumGlassMat);
    t2Transit.position.set(0, 0.10, -0.78);
    t2Transit.castShadow = true;
    t2Group.add(t2Transit);
    const t2TransitRoof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.05, 0.48), roofMetalMat);
    t2TransitRoof.position.set(0, 0.22, -0.78);
    t2Group.add(t2TransitRoof);

    incheonAirportGroup.add(t2Group);

    // ------------------------------------------------------------
    // 4. ICONIC INCHEON CONTROL TOWER (인천공항 관제탑 - 100.4m)
    // ------------------------------------------------------------
    const towerGroup = new THREE.Group();
    setWorldPos(towerGroup, 0.58, -0.56, 0);

    const towerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.24, 8), concreteMat);
    towerBase.position.y = 0.12;
    towerBase.castShadow = true;
    towerGroup.add(towerBase);

    const lowerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 1.30, 12), roofMetalMat);
    lowerShaft.position.y = 0.88;
    lowerShaft.castShadow = true;
    towerGroup.add(lowerShaft);

    const upperFlaredCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.13, 0.95, 12), roofMetalMat);
    upperFlaredCollar.position.y = 2.00;
    upperFlaredCollar.castShadow = true;
    towerGroup.add(upperFlaredCollar);

    const cabGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.33, 0.36, 12), warmAtriumGlassMat);
    cabGlow.position.y = 2.65;
    cabGlow.castShadow = true;
    towerGroup.add(cabGlow);

    const cabFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.06, 12), darkRoofTrimMat);
    cabFrame.position.y = 2.46;
    towerGroup.add(cabFrame);

    const cabRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.52, 0.14, 12), roofMetalMat);
    cabRoof.position.y = 2.90;
    cabRoof.castShadow = true;
    towerGroup.add(cabRoof);

    const radomeMast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.34, 8), darkRoofTrimMat);
    radomeMast.position.y = 3.12;
    towerGroup.add(radomeMast);

    const radome = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0.1 })
    );
    radome.position.y = 3.36;
    radome.castShadow = true;
    towerGroup.add(radome);

    const towerBeacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    towerBeacon.position.y = 3.56;
    towerGroup.add(towerBeacon);

    towerGroup.scale.setScalar(0.58);
    incheonAirportGroup.add(towerGroup);

    // ------------------------------------------------------------
    // 5. PASSENGER BOARDING BRIDGES (탑승교) - Instanced
    // ------------------------------------------------------------
    const bridgeSpecs = [
      ...[-0.36, -0.22, -0.08, 0.08, 0.24, 0.40, 0.56].map(u => ({ u, v: -0.82 })),
      ...[-0.30, -0.15, 0.00, 0.16, 0.32, 0.48, 0.62].map(u => ({ u, v: -0.25 })),
      ...[-0.30, -0.15, 0.00, 0.16, 0.32, 0.48, 0.62].map(u => ({ u, v: -0.04 })),
      ...[-0.32, -0.16, 0.00, 0.16, 0.32, 0.48].map(u => ({ u, v: 0.72 }))
    ];
    const jbGeo = new THREE.BoxGeometry(0.055, 0.08, 0.28);
    const jbInst = new THREE.InstancedMesh(jbGeo, jetbridgeMat, bridgeSpecs.length);
    const dummy = new THREE.Object3D();
    bridgeSpecs.forEach((b, idx) => {
      const p = airportToWorld(b.u, b.v);
      dummy.position.set(p.x, p.y + 0.12, p.z);
      dummy.rotation.set(0, vAngleY, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      jbInst.setMatrixAt(idx, dummy.matrix);
    });
    jbInst.instanceMatrix.needsUpdate = true;
    jbInst.castShadow = true;
    jbInst.frustumCulled = false;
    incheonAirportGroup.add(jbInst);

    // ------------------------------------------------------------
    // 6. CARGO HANGARS & AVIATION FUEL FARM (화물터미널 · 격납고 · 유류저장소)
    // ------------------------------------------------------------
    const hangarSpecs = [
      { u: 0.90, v: -1.62, w: 0.78, d: 0.56, h: 0.26 },
      { u: 0.90, v: -1.88, w: 0.78, d: 0.56, h: 0.26 },
      { u: 0.96, v: 0.38, w: 0.86, d: 0.62, h: 0.30 },
      { u: 0.96, v: 0.68, w: 0.86, d: 0.62, h: 0.30 }
    ];
    hangarSpecs.forEach((hg) => {
      const hGrp = new THREE.Group();
      setWorldPos(hGrp, hg.u, hg.v, 0);
      hGrp.rotation.y = uAngleY;
      const hWall = new THREE.Mesh(new THREE.BoxGeometry(hg.w, hg.h, hg.d), concreteMat);
      hWall.position.y = hg.h * 0.5;
      hWall.castShadow = true;
      hGrp.add(hWall);
      const hRoof = new THREE.Mesh(createArchedRoofGeo(hg.w * 1.06, hg.d * 1.02, 0.04, 0.14), roofMetalMat);
      hRoof.position.y = hg.h;
      hRoof.castShadow = true;
      hGrp.add(hRoof);
      const hDoor = new THREE.Mesh(new THREE.BoxGeometry(0.03, hg.h * 0.72, hg.d * 0.72), darkRoofTrimMat);
      hDoor.position.set(-hg.w * 0.5 - 0.005, hg.h * 0.38, 0);
      hGrp.add(hDoor);
      incheonAirportGroup.add(hGrp);
    });

    const tankGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.14, 14);
    const tankInst = new THREE.InstancedMesh(tankGeo, roofMetalMat, 6);
    for (let t = 0; t < 6; t++) {
      const tu = -0.68 + (t % 3) * 0.12;
      const tv = -1.92 - Math.floor(t / 3) * 0.14;
      const p = airportToWorld(tu, tv);
      dummy.position.set(p.x, p.y + 0.07, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      tankInst.setMatrixAt(t, dummy.matrix);
    }
    tankInst.instanceMatrix.needsUpdate = true;
    tankInst.castShadow = true;
    tankInst.frustumCulled = false;
    incheonAirportGroup.add(tankInst);

    // ------------------------------------------------------------
    // 7. PARKED WIDEBODY AIRCRAFT & ANIMATED DEPARTING JET
    // ------------------------------------------------------------
    const parkedAircraft = [
      { u: -0.36, v: -0.66, heading: Math.PI, livery: 'korean' },
      { u: 0.08, v: -0.66, heading: Math.PI, livery: 'asiana' },
      { u: 0.40, v: -0.66, heading: Math.PI, livery: 'korean' },
      { u: -0.30, v: -0.36, heading: 0, livery: 'korean' },
      { u: 0.16, v: -0.36, heading: 0, livery: 'asiana' },
      { u: -0.15, v: 0.10, heading: Math.PI, livery: 'korean' },
      { u: 0.32, v: 0.10, heading: Math.PI, livery: 'korean' },
      { u: 0.00, v: 0.58, heading: 0, livery: 'korean' },
      { u: 0.32, v: 0.58, heading: 0, livery: 'asiana' },
      { u: 0.72, v: -1.65, heading: -Math.PI / 2, livery: 'cargo' },
      { u: -1.52, v: -2.02, heading: Math.PI, livery: 'korean' }
    ];

    parkedAircraft.forEach((ap) => {
      const jet = createAircraftMesh(ap.livery);
      jet.scale.setScalar(1.15);
      setWorldPos(jet, ap.u, ap.v, 0.065);
      jet.rotation.y = vAngleY + ap.heading;
      incheonAirportGroup.add(jet);
    });

    // Animated Departing/Climbing Airliner over Runway 15R/33L
    const worldTakeoffPts = [
      airportToWorld(-1.52, -1.95),
      airportToWorld(-1.52, -0.30),
      airportToWorld(-1.52, 1.35),
      airportToWorld(-1.60, 2.90),
      airportToWorld(-2.40, 4.40),
      airportToWorld(-3.60, 2.50),
      airportToWorld(-3.40, -1.20),
      airportToWorld(-2.30, -3.50),
      airportToWorld(-1.52, -2.55)
    ];
    const curvePts = worldTakeoffPts.map((pt, idx) => {
      const alt = idx <= 1 ? 0.09 : idx === 2 ? 0.95 : idx === 3 ? 3.2 : idx <= 6 ? 5.6 : idx === 7 ? 2.4 : 0.65;
      return new THREE.Vector3(pt.x, pt.y + alt, pt.z);
    });
    airportFlightCurve = new THREE.CatmullRomCurve3(curvePts, true);
    airportAnimPlane = createAircraftMesh('korean');
    airportAnimPlane.scale.setScalar(1.15);
    incheonAirportGroup.add(airportAnimPlane);

    // ------------------------------------------------------------
    // 8. INSTANCED RUNWAY EDGE, THRESHOLD & APPROACH LIGHTS
    // ------------------------------------------------------------
    const whiteLightPts = [];
    const greenLightPts = [];

    layout.runways.forEach((rw) => {
      const halfW = rw.widthKm * 0.52;
      const steps = 16;
      for (let i = 0; i <= steps; i++) {
        const v = rw.vStart + (i / steps) * (rw.vEnd - rw.vStart);
        whiteLightPts.push(airportToWorld(rw.u - halfW, v));
        whiteLightPts.push(airportToWorld(rw.u + halfW, v));
      }
      // Threshold green lights & Approach Lighting System (ALS) lead-in bars
      for (let s = -2; s <= 2; s++) {
        greenLightPts.push(airportToWorld(rw.u + s * 0.014, rw.vStart));
        greenLightPts.push(airportToWorld(rw.u + s * 0.014, rw.vEnd));
      }
      for (let a = 1; a <= 3; a++) {
        whiteLightPts.push(airportToWorld(rw.u, rw.vStart - a * 0.11));
        whiteLightPts.push(airportToWorld(rw.u, rw.vEnd + a * 0.11));
      }
    });

    const bulbGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const whiteBulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xfde68a,
      emissiveIntensity: 0.25,
      roughness: 0.2
    });
    const greenBulbMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.35,
      roughness: 0.2
    });
    airportEmissiveMaterials.push({ mat: whiteBulbMat, dayInt: 0.25, nightInt: 1.85 });
    airportEmissiveMaterials.push({ mat: greenBulbMat, dayInt: 0.35, nightInt: 1.95 });

    const whiteInst = new THREE.InstancedMesh(bulbGeo, whiteBulbMat, whiteLightPts.length);
    whiteLightPts.forEach((pt, idx) => {
      dummy.position.set(pt.x, pt.y + 0.016, pt.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      whiteInst.setMatrixAt(idx, dummy.matrix);
    });
    whiteInst.instanceMatrix.needsUpdate = true;
    whiteInst.frustumCulled = false;
    incheonAirportGroup.add(whiteInst);

    const greenInst = new THREE.InstancedMesh(bulbGeo, greenBulbMat, greenLightPts.length);
    greenLightPts.forEach((pt, idx) => {
      dummy.position.set(pt.x, pt.y + 0.018, pt.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      greenInst.setMatrixAt(idx, dummy.matrix);
    });
    greenInst.instanceMatrix.needsUpdate = true;
    greenInst.frustumCulled = false;
    incheonAirportGroup.add(greenInst);

    scene.add(incheonAirportGroup);
  }

  function buildGangneungLandmarks() {
    if (gangneungLandmarksGroup) {
      disposeObject(gangneungLandmarksGroup);
      gangneungLandmarksGroup = null;
    }
    if (currentRegionId !== 'gangneung') return;

    gangneungLandmarksGroup = new THREE.Group();
    gangneungLandmarksGroup.name = 'gangneung-landmarks';

    // 1. Gyeongpodae Pavilion (경포대 누각) - composite 3D Korean pavilion perched on hillside overlooking Gyeongpo Lake
    const gpCoord = worldPosition(37.7935, 128.8885);
    const gpY = surfaceHeight(37.7935, 128.8885) + 0.04;
    const pavilion = new THREE.Group();
    pavilion.position.set(gpCoord.x, gpY, gpCoord.z);
    pavilion.rotation.y = 0.45; // Face East-Northeast toward Gyeongpo Lake & East Sea sunrise

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd6d3cd, roughness: 0.88, metalness: 0.04 });
    const woodDeckMat = new THREE.MeshStandardMaterial({ color: 0x825334, roughness: 0.78, metalness: 0.05 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x9b2d2b, roughness: 0.65, metalness: 0.05 });
    const roofTileMat = new THREE.MeshStandardMaterial({ color: 0x2b333f, roughness: 0.62, metalness: 0.14 });
    const ridgeGoldMat = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.35, metalness: 0.25 });

    // Granite foundation plinth (2 stepped tiers)
    const plinthLow = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.34, 1.8), stoneMat);
    plinthLow.position.y = 0.17;
    plinthLow.castShadow = true;
    plinthLow.receiveShadow = true;
    pavilion.add(plinthLow);

    const plinthTop = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.24, 1.48), woodDeckMat);
    plinthTop.position.y = 0.46;
    plinthTop.castShadow = true;
    pavilion.add(plinthTop);

    // Timber veranda railing frame
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.12, 1.42), woodDeckMat);
    rail.position.y = 0.72;
    pavilion.add(rail);

    // 8 traditional pillars around perimeter
    const pillarGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.72, 8);
    const pxOffsets = [-0.84, -0.28, 0.28, 0.84];
    const pzOffsets = [-0.56, 0.56];
    pxOffsets.forEach((px) => {
      pzOffsets.forEach((pz) => {
        const col = new THREE.Mesh(pillarGeo, pillarMat);
        col.position.set(px, 0.92, pz);
        col.castShadow = true;
        pavilion.add(col);
      });
    });

    // Lower flared eaves cornice
    const eaves = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.15, 1.86), roofTileMat);
    eaves.position.y = 1.32;
    eaves.castShadow = true;
    pavilion.add(eaves);

    // Upper hipped/gable Korean giwa roof (Paljak-jibung)
    const upperRoof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.74, 4), roofTileMat);
    upperRoof.position.y = 1.74;
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.scale.set(1.18, 1.0, 0.86);
    upperRoof.castShadow = true;
    pavilion.add(upperRoof);

    // Roof ridge beam (Yongmaru) & ornamental finials
    const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.12, 0.13), ridgeGoldMat);
    ridgeBeam.position.y = 2.08;
    pavilion.add(ridgeBeam);

    gangneungLandmarksGroup.add(pavilion);

    // 2. Wolpagyo Arched Timber Bridge across Gyeongpo Lagoon
    const brStart = worldPosition(37.7968, 128.8942);
    const brEnd = worldPosition(37.8018, 128.9008);
    const brY = surfaceHeight(37.7992, 128.8975) + 0.06;
    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(brStart.x, brY, brStart.z),
      new THREE.Vector3((brStart.x + brEnd.x) * 0.5, brY + 0.42, (brStart.z + brEnd.z) * 0.5),
      new THREE.Vector3(brEnd.x, brY, brEnd.z)
    ]);
    const bridgeDeckGeo = new THREE.TubeGeometry(bridgeCurve, 16, 0.18, 6, false);
    bridgeDeckGeo.scale(1, 0.35, 1);
    const bridgeMesh = new THREE.Mesh(
      bridgeDeckGeo,
      new THREE.MeshStandardMaterial({ color: 0x9c6b49, roughness: 0.72, metalness: 0.06 })
    );
    bridgeMesh.castShadow = true;
    gangneungLandmarksGroup.add(bridgeMesh);

    // 3. East Sea Coastal Lighthouses (Anmok, Jumunjin, Hajodae)
    const lighthouses = [
      { lat: 37.7715, lng: 128.9505, color: 0xffffff }, // Anmok Breakwater
      { lat: 37.8938, lng: 128.8330, color: 0xdc2626 }, // Jumunjin Red Breakwater Lighthouse
      { lat: 38.0185, lng: 128.7335, color: 0xffffff }  // Hajodae Cliff White Lighthouse
    ];
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.65,
      roughness: 0.2
    });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.2 });

    lighthouses.forEach((lh) => {
      const pos = worldPosition(lh.lat, lh.lng);
      const baseY = Math.max(0.05, surfaceHeight(lh.lat, lh.lng));
      const lhGroup = new THREE.Group();
      lhGroup.position.set(pos.x, baseY, pos.z);

      const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 0.25, 10), stoneMat);
      pier.position.y = 0.125;
      lhGroup.add(pier);

      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.28, 1.35, 10),
        new THREE.MeshStandardMaterial({ color: lh.color, roughness: 0.55, metalness: 0.08 })
      );
      tower.position.y = 0.92;
      tower.castShadow = true;
      lhGroup.add(tower);

      const gallery = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.09, 10), capMat);
      gallery.position.y = 1.62;
      lhGroup.add(gallery);

      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.22, 10), beaconMat);
      lantern.position.y = 1.77;
      lhGroup.add(lantern);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.20, 10), capMat);
      cap.position.y = 1.98;
      lhGroup.add(cap);

      gangneungLandmarksGroup.add(lhGroup);
    });

    scene.add(gangneungLandmarksGroup);
  }

  function buildYeongamCircuit() {
    if (yeongamCircuitGroup) {
      disposeObject(yeongamCircuitGroup);
      yeongamCircuitGroup = null;
    }
    yeongamTrackCurve = null;
    yeongamAnimCars = [];
    yeongamEmissiveMaterials = [];

    if (currentRegionId !== 'yeongam') return;

    yeongamCircuitGroup = new THREE.Group();
    yeongamCircuitGroup.name = 'yeongam-kic-circuit';

    const trackRaw = Array.isArray(window.YEONGAM_CIRCUIT_TRACK) ? window.YEONGAM_CIRCUIT_TRACK : [];
    const openRaw = trackRaw.length > 2 ? trackRaw.slice(0, -1) : trackRaw;
    if (openRaw.length < 4) {
      scene.add(yeongamCircuitGroup);
      return;
    }

    // 1. Closed 3D Catmull-Rom racing line
    const curvePts = openRaw.map(([lat, lng]) => {
      const { x, z } = worldPosition(lat, lng);
      return new THREE.Vector3(x, surfaceHeight(lat, lng) + 0.09, z);
    });
    yeongamTrackCurve = new THREE.CatmullRomCurve3(curvePts, true, 'catmullrom', 0.35);

    const sampled = [];
    const sampleCount = 190;
    for (let i = 0; i <= sampleCount; i++) {
      sampled.push(yeongamTrackCurve.getPointAt(i / sampleCount));
    }

    // Main asphalt racing tarmac ribbon + FIA outer curb trim
    const curbBorderMesh = createRoadRibbon(sampled, 0.44, 0xdc2626, 0.01);
    if (curbBorderMesh) yeongamCircuitGroup.add(curbBorderMesh);
    const trackAsphaltMesh = createRoadRibbon(sampled, 0.33, 0x262b33, 0.024);
    if (trackAsphaltMesh) yeongamCircuitGroup.add(trackAsphaltMesh);

    // Pit lane ribbon & Karting circuit ribbon
    if (Array.isArray(window.YEONGAM_PIT_LANE) && window.YEONGAM_PIT_LANE.length > 1) {
      const pitPts = window.YEONGAM_PIT_LANE.map(([lat, lng]) => {
        const { x, z } = worldPosition(lat, lng);
        return new THREE.Vector3(x, surfaceHeight(lat, lng) + 0.09, z);
      });
      const pitMesh = createRoadRibbon(pitPts, 0.20, 0x3b424d, 0.02);
      if (pitMesh) yeongamCircuitGroup.add(pitMesh);
    }
    if (Array.isArray(window.YEONGAM_KART_TRACK) && window.YEONGAM_KART_TRACK.length > 2) {
      const kartPts = window.YEONGAM_KART_TRACK.map(([lat, lng]) => {
        const { x, z } = worldPosition(lat, lng);
        return new THREE.Vector3(x, surfaceHeight(lat, lng) + 0.09, z);
      });
      const kartMesh = createRoadRibbon(kartPts, 0.16, 0x334155, 0.02);
      if (kartMesh) yeongamCircuitGroup.add(kartMesh);
    }

    // Shared architectural materials
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xe6eaef, roughness: 0.78, metalness: 0.08 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.55 });
    const roofCanopyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.22 });
    const redAccentMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.42, metalness: 0.15 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.18,
      roughness: 0.18,
      metalness: 0.45
    });
    yeongamEmissiveMaterials.push({ mat: glassMat, dayInt: 0.18, nightInt: 0.95 });

    // Compute exact Main Straight heading angle from grid -> T1 braking zone
    const stA = worldPosition(34.7366, 126.4122);
    const stB = worldPosition(34.7386, 126.4186);
    const straightAngle = Math.atan2(stB.z - stA.z, stB.x - stA.x);

    // 2. KIC Main Grandstand (tiered stadium seating + sweeping cantilevered canopy)
    const gsPos = worldPosition(34.7386, 126.4146);
    const gsY = surfaceHeight(34.7386, 126.4146) + 0.05;
    const grandstand = new THREE.Group();
    grandstand.position.set(gsPos.x, gsY, gsPos.z);
    grandstand.rotation.y = -straightAngle;

    [0.25, 0.52, 0.80].forEach((tierH, idx) => {
      const tier = new THREE.Mesh(new THREE.BoxGeometry(5.6 - idx * 0.25, tierH, 1.35 - idx * 0.30), concreteMat);
      tier.position.set(0, tierH * 0.5, -0.35 - idx * 0.25);
      tier.castShadow = true;
      tier.receiveShadow = true;
      grandstand.add(tier);
    });
    // Sweeping aerodynamic cantilevered canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.14, 1.72), roofCanopyMat);
    canopy.position.set(0, 1.62, -0.32);
    canopy.rotation.x = 0.18;
    canopy.castShadow = true;
    grandstand.add(canopy);
    const canopyTrim = new THREE.Mesh(new THREE.BoxGeometry(5.82, 0.07, 0.14), redAccentMat);
    canopyTrim.position.set(0, 1.46, 0.52);
    grandstand.add(canopyTrim);

    [-2.3, -0.8, 0.8, 2.3].forEach((px) => {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.55, 0.18), steelMat);
      rib.position.set(px, 0.82, -0.88);
      grandstand.add(rib);
    });
    yeongamCircuitGroup.add(grandstand);

    // 3. Pit Building & Team Garages opposite Grandstand
    const pitPos = worldPosition(34.7357, 126.4162);
    const pitY = surfaceHeight(34.7357, 126.4162) + 0.05;
    const pitBuilding = new THREE.Group();
    pitBuilding.position.set(pitPos.x, pitY, pitPos.z);
    pitBuilding.rotation.y = -straightAngle;

    const pitCore = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.70, 1.05), concreteMat);
    pitCore.position.y = 0.35;
    pitCore.castShadow = true;
    pitBuilding.add(pitCore);

    const pitUpperGlass = new THREE.Mesh(new THREE.BoxGeometry(4.35, 0.30, 1.08), glassMat);
    pitUpperGlass.position.y = 0.60;
    pitBuilding.add(pitUpperGlass);

    const pitOverhang = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.09, 1.30), steelMat);
    pitOverhang.position.y = 0.84;
    pitOverhang.castShadow = true;
    pitBuilding.add(pitOverhang);

    yeongamCircuitGroup.add(pitBuilding);

    // 4. Start/Finish Timing Gantry with F1 glowing lights
    const gantryPos = worldPosition(34.7370, 126.4136);
    const gantryY = surfaceHeight(34.7370, 126.4136) + 0.05;
    const gantry = new THREE.Group();
    gantry.position.set(gantryPos.x, gantryY, gantryPos.z);
    gantry.rotation.y = -straightAngle;

    [-0.95, 0.95].forEach((sideZ) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.28, 0.12), steelMat);
      post.position.set(0, 0.64, sideZ);
      post.castShadow = true;
      gantry.add(post);
    });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 2.08), steelMat);
    beam.position.set(0, 1.24, 0);
    beam.castShadow = true;
    gantry.add(beam);

    const raceLightMat = new THREE.MeshStandardMaterial({
      color: 0xff2b2b,
      emissive: 0xef4444,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });
    yeongamEmissiveMaterials.push({ mat: raceLightMat, dayInt: 0.95, nightInt: 2.2 });
    [-0.45, -0.22, 0, 0.22, 0.45].forEach((lz) => {
      const pod = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), raceLightMat);
      pod.position.set(-0.14, 1.24, lz);
      gantry.add(pod);
    });
    yeongamCircuitGroup.add(gantry);

    // 5. KIC Iconic Race Control Pavilion Tower (Korean Traditional Giwa Roof Motif)
    const tcPos = worldPosition(34.7346, 126.4112);
    const tcY = surfaceHeight(34.7346, 126.4112) + 0.05;
    const tower = new THREE.Group();
    tower.position.set(tcPos.x, tcY, tcPos.z);

    const towerBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 1.1), concreteMat);
    towerBase.position.y = 0.175;
    tower.add(towerBase);
    const towerShaft = new THREE.Mesh(new THREE.BoxGeometry(0.74, 1.55, 0.74), concreteMat);
    towerShaft.position.y = 1.05;
    towerShaft.castShadow = true;
    tower.add(towerShaft);
    const towerObs = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.38, 1.06), glassMat);
    towerObs.position.y = 1.98;
    tower.add(towerObs);
    const giwaMat = new THREE.MeshStandardMaterial({ color: 0x262f3d, roughness: 0.58, metalness: 0.22 });
    const giwaEaves = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.12, 1.52), giwaMat);
    giwaEaves.position.y = 2.22;
    giwaEaves.castShadow = true;
    tower.add(giwaEaves);
    const giwaRoof = new THREE.Mesh(new THREE.ConeGeometry(1.12, 0.52, 4), giwaMat);
    giwaRoof.position.y = 2.52;
    giwaRoof.rotation.y = Math.PI / 4;
    giwaRoof.castShadow = true;
    tower.add(giwaRoof);
    yeongamCircuitGroup.add(tower);

    // 6. Marina Curve Grandstand + Samho Yacht Lagoon Pier & Sailboats
    const marStandPos = worldPosition(34.7294, 126.4232);
    const marStand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.52, 0.78), roofCanopyMat);
    marStand.position.set(marStandPos.x, surfaceHeight(34.7294, 126.4232) + 0.28, marStandPos.z);
    marStand.rotation.y = 0.65;
    marStand.castShadow = true;
    yeongamCircuitGroup.add(marStand);

    const pierPos = worldPosition(34.7270, 126.4158);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x9c6b49, roughness: 0.76, metalness: 0.05 });
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 3.2), woodMat);
    pier.position.set(pierPos.x, -1.35, pierPos.z);
    yeongamCircuitGroup.add(pier);

    const hullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.1 });
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide });
    [
      [34.7252, 126.4145, 0.3],
      [34.7256, 126.4172, -0.4],
      [34.7244, 126.4192, 0.8],
      [34.7250, 126.4126, -0.2]
    ].forEach(([yLat, yLng, rotY]) => {
      const yp = worldPosition(yLat, yLng);
      const boat = new THREE.Group();
      boat.position.set(yp.x, -1.42, yp.z);
      boat.rotation.y = rotY;
      const hull = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.78), hullMat);
      boat.add(hull);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 6), steelMat);
      mast.position.y = 0.52;
      boat.add(mast);
      const sail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.76, 3), sailMat);
      sail.position.set(0, 0.54, 0.05);
      sail.scale.set(0.15, 1, 1);
      boat.add(sail);
      yeongamCircuitGroup.add(boat);
    });

    // 7. 4 Animated GT / Formula Sports Cars racing continuously on KIC circuit
    const carConfigs = [
      { color: 0xdc2626, phase: 0.03, speed: 0.031 }, // Racing Red
      { color: 0x2563eb, phase: 0.18, speed: 0.029 }, // Works Blue
      { color: 0xf59e0b, phase: 0.43, speed: 0.033 }, // GT Amber Gold
      { color: 0x10b981, phase: 0.71, speed: 0.028 }  // Team Emerald
    ];

    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85, metalness: 0.05 });
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.18, metalness: 0.65 });
    const headLightMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, emissive: 0xfef08a, emissiveIntensity: 1.1 });
    const tailLightMat = new THREE.MeshStandardMaterial({ color: 0xff2b2b, emissive: 0xdc2626, emissiveIntensity: 1.1 });

    carConfigs.forEach((cfg) => {
      const car = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.28, metalness: 0.42 });

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.15, 1.08), bodyMat);
      chassis.position.y = 0.11;
      chassis.castShadow = true;
      car.add(chassis);

      const canopyGlass = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.13, 0.46), cabinMat);
      canopyGlass.position.set(0, 0.21, -0.02);
      car.add(canopyGlass);

      const rearWing = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.04, 0.14), tireMat);
      rearWing.position.set(0, 0.27, -0.46);
      car.add(rearWing);

      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.04), headLightMat);
      headlight.position.set(0, 0.12, 0.54);
      car.add(headlight);

      const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.04), tailLightMat);
      taillight.position.set(0, 0.13, -0.54);
      car.add(taillight);

      const wheelGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 8);
      wheelGeo.rotateZ(Math.PI / 2);
      [
        [-0.24, 0.08, 0.34],
        [0.24, 0.08, 0.34],
        [-0.24, 0.08, -0.34],
        [0.24, 0.08, -0.34]
      ].forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, tireMat);
        wheel.position.set(wx, wy, wz);
        car.add(wheel);
      });

      yeongamTrackCurve.getPointAt(cfg.phase, _carPos);
      yeongamTrackCurve.getPointAt((cfg.phase + 0.01) % 1, _carNextPos);
      car.position.copy(_carPos);
      car.position.y += 0.06;
      car.lookAt(_carNextPos.x, _carNextPos.y + 0.06, _carNextPos.z);

      yeongamCircuitGroup.add(car);
      yeongamAnimCars.push({ mesh: car, phase: cfg.phase, speed: cfg.speed });
    });

    scene.add(yeongamCircuitGroup);
  }

  function buildNightSkyStars() {
    if (starsPoints) disposeObject(starsPoints);

    const starCount = 950;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.88 + 0.12);
      const radius = 320 + Math.random() * 60;

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const starType = Math.random();
      if (starType > 0.8) {
        starColors[i * 3] = 0.96; starColors[i * 3 + 1] = 0.92; starColors[i * 3 + 2] = 0.76;
      } else if (starType > 0.4) {
        starColors[i * 3] = 0.84; starColors[i * 3 + 1] = 0.93; starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      }
    }

    starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      fog: false,
      sizeAttenuation: false
    });

    starsPoints = new THREE.Points(starsGeo, starsMat);
    scene.add(starsPoints);
  }

  function buildElevationPointer() {
    if (elevationPointerMesh) disposeObject(elevationPointerMesh);

    elevationPointerMesh = new THREE.Group();
    elevationPointerMesh.name = 'elevation-pointer';

    // Glowing cyan vertical marker cylinder
    const beaconGeo = new THREE.CylinderGeometry(0.32, 0.06, 7.5, 12);
    beaconGeo.translate(0, 3.75, 0);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.85
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    elevationPointerMesh.add(beaconMesh);

    // Glowing target ring on ground
    const ringGeo = new THREE.RingGeometry(0.8, 1.25, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.15;
    elevationPointerMesh.add(ringMesh);

    elevationPointerMesh.visible = false;
    scene.add(elevationPointerMesh);

    if (elevationTransectGroup) disposeObject(elevationTransectGroup);
    elevationTransectGroup = new THREE.Group();
    elevationTransectGroup.name = 'elevation-transect-overlay';
    elevationTransectGroup.renderOrder = 2;
    elevationTransectGroup.visible = false;
    scene.add(elevationTransectGroup);

    if (verticalSliceCutGroup) disposeObject(verticalSliceCutGroup);
    verticalSliceCutGroup = new THREE.Group();
    verticalSliceCutGroup.name = 'vertical-slice-cutaway';
    verticalSliceCutGroup.renderOrder = 3;
    verticalSliceCutGroup.visible = false;
    scene.add(verticalSliceCutGroup);
  }

  function applyMaterialSliceState(mat, clippingPlanes, translucentOpacity) {
    if (!mat) return;
    if (Array.isArray(mat)) {
      for (let i = 0; i < mat.length; i++) {
        applyMaterialSliceState(mat[i], clippingPlanes, translucentOpacity);
      }
      return;
    }
    if (!mat.userData) mat.userData = {};
    if (!mat.userData.__origSlice) {
      mat.userData.__origSlice = {
        transparent: Boolean(mat.transparent),
        opacity: Number.isFinite(mat.opacity) ? mat.opacity : 1,
        depthWrite: mat.depthWrite !== false
      };
    }
    const orig = mat.userData.__origSlice;
    const prevTrans = Boolean(mat.transparent);

    if (Array.isArray(clippingPlanes) && clippingPlanes.length > 0) {
      mat.clippingPlanes = clippingPlanes;
      mat.clipShadows = true;
      mat.transparent = orig.transparent;
      mat.opacity = orig.opacity;
      mat.depthWrite = orig.depthWrite;
    } else if (Number.isFinite(translucentOpacity)) {
      mat.clippingPlanes = [];
      mat.clipShadows = false;
      mat.transparent = true;
      mat.opacity = translucentOpacity;
      mat.depthWrite = false;
    } else {
      mat.clippingPlanes = [];
      mat.clipShadows = false;
      mat.transparent = orig.transparent;
      mat.opacity = orig.opacity;
      mat.depthWrite = orig.depthWrite;
    }

    if (prevTrans !== Boolean(mat.transparent)) {
      mat.needsUpdate = true;
    }
  }

  function updateActiveSlicePlaneForCamera() {
    if (!activeSlicePlane || !activeSlicePlaneParams || !camera) return;
    const { midX, midZ, normalX, normalZ } = activeSlicePlaneParams;
    const camDot = (camera.position.x - midX) * normalX + (camera.position.z - midZ) * normalZ;
    const sign = camDot > 0 ? -1 : 1;
    _sliceNormalVec.set(normalX * sign, 0, normalZ * sign).normalize();
    _sliceAnchorVec.set(midX, 0, midZ);
    activeSlicePlane.setFromNormalAndCoplanarPoint(_sliceNormalVec, _sliceAnchorVec);
  }

  function restoreTerrainFromVerticalSlice() {
    activeSlicePlane = null;
    activeSlicePlaneParams = null;
    if (terrain) applyMaterialSliceState(terrain.material, [], null);
    if (baseMesh) applyMaterialSliceState(baseMesh.material, [], null);
    if (ocean) applyMaterialSliceState(ocean.material, [], null);
    if (oceanRim) applyMaterialSliceState(oceanRim.material, [], null);
    if (shoreline) applyMaterialSliceState(shoreline.material, [], null);
    if (roadGroup) {
      roadGroup.traverse((child) => {
        if (child.isMesh && child.material) applyMaterialSliceState(child.material, [], null);
      });
    }
    if (verticalSliceCutGroup) {
      while (verticalSliceCutGroup.children.length > 0) {
        disposeObject(verticalSliceCutGroup.children[0]);
      }
      verticalSliceCutGroup.visible = false;
    }
  }

  function clear3DTransectOverlay() {
    activeTransectSamples = [];
    activeTransectHoverRefs = null;
    restoreTerrainFromVerticalSlice();
    if (!elevationTransectGroup) return;
    while (elevationTransectGroup.children.length > 0) {
      disposeObject(elevationTransectGroup.children[0]);
    }
    elevationTransectGroup.visible = false;
  }

  function build3DTransectEndpointPin(sample, colorHex, heightUnits) {
    const pin = new THREE.Group();
    const surfY = surfaceHeight(sample.lat, sample.lng);
    pin.position.set(sample.x, surfY, sample.z);

    const ringGeo = new THREE.RingGeometry(0.65, 1.05, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.24;
    pin.add(ring);

    const h = heightUnits || 3.8;
    const stemGeo = new THREE.CylinderGeometry(0.11, 0.16, h, 10);
    stemGeo.translate(0, h * 0.5 + 0.16, 0);
    const stemMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.9
    });
    pin.add(new THREE.Mesh(stemGeo, stemMat));

    const headGeo = new THREE.SphereGeometry(0.42, 14, 12);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = h + 0.22;
    pin.add(head);

    return pin;
  }

  function build3DTransectOverlay(samples, metrics) {
    if (!scene || !elevationTransectGroup) return;
    while (elevationTransectGroup.children.length > 0) {
      disposeObject(elevationTransectGroup.children[0]);
    }
    if (!Array.isArray(samples) || samples.length < 2) {
      elevationTransectGroup.visible = false;
      return;
    }

    const r = getRegion();
    const maxElevM = Math.max(1, metrics ? metrics.maxElevM : 100);
    const ribbonHalfWidth = Math.max(0.28, Math.min(0.62, r.mapWidth * 0.0028));
    const profileLiftHeight = Math.max(3.6, Math.min(7.2, r.mapWidth * 0.032));

    // 1. Elevated 3D Holographic Cross-Section Wall rising above the terrain surface
    //    plus a crisp ground-hugging contour ribbon & glowing skyline crest ribbon
    const curtainPositions = new Float32Array(samples.length * 2 * 3);
    const curtainColors = new Float32Array(samples.length * 2 * 3);
    const curtainIndices = [];

    const groundPositions = [];
    const groundColors = [];
    const groundIndices = [];

    const crestPositions = [];
    const crestColors = [];
    const crestIndices = [];

    const baseYs = samples.map((s) => surfaceHeight(s.lat, s.lng) + 0.18);
    const topYs = samples.map((s, idx) => {
      const ratio = Math.max(0, Math.min(1, s.elevationM / maxElevM));
      return baseYs[idx] + 0.45 + ratio * profileLiftHeight;
    });

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const baseY = baseYs[i];
      const topY = topYs[i];
      const elevRatio = Math.max(0, Math.min(1, s.elevationM / maxElevM));

      // Color gradient: cyan (#38bdf8) -> emerald (#34d399) -> peak gold (#fbbf24)
      const topR = Math.min(1, elevRatio < 0.55 ? 0.12 + elevRatio * 0.25 : 0.26 + (elevRatio - 0.55) * 1.65);
      const topG = Math.min(1, elevRatio < 0.55 ? 0.74 + elevRatio * 0.25 : 0.88 - (elevRatio - 0.55) * 0.22);
      const topB = Math.max(0.05, Math.min(1, elevRatio < 0.55 ? 0.98 - elevRatio * 0.45 : 0.72 - (elevRatio - 0.55) * 1.3));

      const vTop = i * 2;
      const vBot = i * 2 + 1;
      curtainPositions[vTop * 3] = s.x;
      curtainPositions[vTop * 3 + 1] = topY;
      curtainPositions[vTop * 3 + 2] = s.z;
      curtainPositions[vBot * 3] = s.x;
      curtainPositions[vBot * 3 + 1] = baseY;
      curtainPositions[vBot * 3 + 2] = s.z;

      curtainColors[vTop * 3] = topR;
      curtainColors[vTop * 3 + 1] = topG;
      curtainColors[vTop * 3 + 2] = topB;
      curtainColors[vBot * 3] = 0.04;
      curtainColors[vBot * 3 + 1] = 0.52;
      curtainColors[vBot * 3 + 2] = 0.88;

      if (i < samples.length - 1) {
        const nTop = (i + 1) * 2;
        const nBot = (i + 1) * 2 + 1;
        curtainIndices.push(vTop, vBot, nTop, vBot, nBot, nTop);

        const next = samples[i + 1];
        const nextBaseY = baseYs[i + 1];
        const nextTopY = topYs[i + 1];
        const dx = next.x - s.x;
        const dz = next.z - s.z;
        const len = Math.hypot(dx, dz);
        if (len > 1e-5) {
          const ox = (-dz / len) * ribbonHalfWidth;
          const oz = (dx / len) * ribbonHalfWidth;
          const baseV = groundPositions.length / 3;
          groundPositions.push(
            s.x + ox, baseY + 0.04, s.z + oz,
            s.x - ox, baseY + 0.04, s.z - oz,
            next.x + ox, nextBaseY + 0.04, next.z + oz,
            next.x - ox, nextBaseY + 0.04, next.z - oz
          );
          for (let k = 0; k < 4; k++) {
            groundColors.push(0.05, 0.72, 0.96);
          }
          groundIndices.push(baseV, baseV + 1, baseV + 2, baseV + 1, baseV + 3, baseV + 2);

          const crestHalf = ribbonHalfWidth * 0.65;
          const cox = (-dz / len) * crestHalf;
          const coz = (dx / len) * crestHalf;
          const cV = crestPositions.length / 3;
          crestPositions.push(
            s.x + cox, topY, s.z + coz,
            s.x - cox, topY, s.z - coz,
            next.x + cox, nextTopY, next.z + coz,
            next.x - cox, nextTopY, next.z - coz
          );
          for (let k = 0; k < 4; k++) {
            crestColors.push(topR, topG, topB);
          }
          crestIndices.push(cV, cV + 1, cV + 2, cV + 1, cV + 3, cV + 2);
        }
      }
    }

    const curtainGeo = new THREE.BufferGeometry();
    curtainGeo.setAttribute('position', new THREE.BufferAttribute(curtainPositions, 3));
    curtainGeo.setAttribute('color', new THREE.BufferAttribute(curtainColors, 3));
    curtainGeo.setIndex(curtainIndices);
    const curtainMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const curtainMesh = new THREE.Mesh(curtainGeo, curtainMat);
    curtainMesh.renderOrder = 2;
    elevationTransectGroup.add(curtainMesh);

    if (groundPositions.length > 0) {
      const groundGeo = new THREE.BufferGeometry();
      groundGeo.setAttribute('position', new THREE.Float32BufferAttribute(groundPositions, 3));
      groundGeo.setAttribute('color', new THREE.Float32BufferAttribute(groundColors, 3));
      groundGeo.setIndex(groundIndices);
      const groundMat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2
      });
      const groundMesh = new THREE.Mesh(groundGeo, groundMat);
      groundMesh.renderOrder = 3;
      elevationTransectGroup.add(groundMesh);
    }

    if (crestPositions.length > 0) {
      const crestGeo = new THREE.BufferGeometry();
      crestGeo.setAttribute('position', new THREE.Float32BufferAttribute(crestPositions, 3));
      crestGeo.setAttribute('color', new THREE.Float32BufferAttribute(crestColors, 3));
      crestGeo.setIndex(crestIndices);
      const crestMat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide
      });
      const crestMesh = new THREE.Mesh(crestGeo, crestMat);
      crestMesh.renderOrder = 4;
      elevationTransectGroup.add(crestMesh);
    }

    // 3. Start (A), End (B), and Peak (MAX) Beacons reaching crest elevation
    elevationTransectGroup.add(build3DTransectEndpointPin(samples[0], 0x10b981, 3.6));
    elevationTransectGroup.add(build3DTransectEndpointPin(samples[samples.length - 1], 0x0ea5e9, 3.6));
    if (metrics && metrics.peakSample && metrics.peakIndex > 1 && metrics.peakIndex < samples.length - 2 && metrics.maxElevM > 15) {
      elevationTransectGroup.add(build3DTransectEndpointPin(metrics.peakSample, 0xf59e0b, profileLiftHeight + 1.2));
    }

    elevationTransectGroup.visible = true;
  }

  function applyVerticalSlice3DCut(samples, metrics) {
    const helpers = window.TransectHelpers;
    if (!scene || !verticalSliceCutGroup || !helpers || !state.elevationProfileOpen || !state.verticalSliceMode || !Array.isArray(samples) || samples.length < 2) {
      restoreTerrainFromVerticalSlice();
      return;
    }

    while (verticalSliceCutGroup.children.length > 0) {
      disposeObject(verticalSliceCutGroup.children[0]);
    }

    const r = getRegion();
    const isCollinear = helpers.isPathCollinear(samples, 0.055);
    const halfWidth = isCollinear
      ? Math.max(0.45, Math.min(0.85, r.mapWidth * 0.0045))
      : Math.max(0.95, Math.min(1.65, r.mapWidth * 0.0085));
    const bedrockY = -4.2;

    const sliceData = helpers.buildVerticalSliceGeometryData(samples, {
      mode: 'world',
      halfWidth,
      bedrockY,
      maxElevM: Math.max(80, metrics ? metrics.maxElevM : 500),
      getSurfaceY: (s) => surfaceHeight(s.lat, s.lng) + 0.08
    });

    if (sliceData.indices.length > 0) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(sliceData.positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(sliceData.colors, 3));
      geo.setIndex(sliceData.indices);
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.78,
        metalness: 0.06,
        side: THREE.DoubleSide
      });
      const sliceMesh = new THREE.Mesh(geo, mat);
      sliceMesh.castShadow = true;
      sliceMesh.receiveShadow = true;
      verticalSliceCutGroup.add(sliceMesh);

      // Glowing 0m sea-level contour border along front & back of the geological block
      const spineLen = samples.length;
      const seaPtsFront = [];
      const seaPtsBack = [];
      const nVec = { x: 0, z: 1 };
      for (let i = 0; i < spineLen; i++) {
        const s = samples[i];
        const prev = samples[Math.max(0, i - 1)];
        const next = samples[Math.min(spineLen - 1, i + 1)];
        const dx = next.x - prev.x;
        const dz = next.z - prev.z;
        const len = Math.hypot(dx, dz) || 1;
        nVec.x = -dz / len;
        nVec.z = dx / len;
        seaPtsFront.push(new THREE.Vector3(s.x + nVec.x * (halfWidth + 0.04), 0.06, s.z + nVec.z * (halfWidth + 0.04)));
        seaPtsBack.push(new THREE.Vector3(s.x - nVec.x * (halfWidth + 0.04), 0.06, s.z - nVec.z * (halfWidth + 0.04)));
      }
      const seaLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.92 });
      verticalSliceCutGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(seaPtsFront), seaLineMat));
      verticalSliceCutGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(seaPtsBack), seaLineMat));
    }

    if (isCollinear) {
      activeSlicePlaneParams = helpers.computeSliceCutPlaneParams(samples);
      if (activeSlicePlaneParams) {
        if (!activeSlicePlane) activeSlicePlane = new THREE.Plane();
        updateActiveSlicePlaneForCamera();
        const planes = [activeSlicePlane];
        if (terrain) applyMaterialSliceState(terrain.material, planes, null);
        if (baseMesh) applyMaterialSliceState(baseMesh.material, planes, null);
        if (ocean) applyMaterialSliceState(ocean.material, planes, null);
        if (oceanRim) applyMaterialSliceState(oceanRim.material, planes, null);
        if (shoreline) applyMaterialSliceState(shoreline.material, planes, null);
        if (roadGroup) {
          roadGroup.traverse((child) => {
            if (child.isMesh && child.material) applyMaterialSliceState(child.material, planes, null);
          });
        }
      }
    } else {
      activeSlicePlane = null;
      activeSlicePlaneParams = null;
      if (terrain) applyMaterialSliceState(terrain.material, [], 0.28);
      if (baseMesh) applyMaterialSliceState(baseMesh.material, [], 0.22);
      if (ocean) applyMaterialSliceState(ocean.material, [], 0.26);
      if (oceanRim) applyMaterialSliceState(oceanRim.material, [], 0.26);
      if (shoreline) applyMaterialSliceState(shoreline.material, [], 0.45);
      if (roadGroup) {
        roadGroup.traverse((child) => {
          if (child.isMesh && child.material) applyMaterialSliceState(child.material, [], 0.40);
        });
      }
    }

    verticalSliceCutGroup.visible = true;
  }

  function detectSoftwareWebGLContext() {
    if (!renderer) return false;
    try {
      const gl = renderer.getContext();
      if (!gl) return false;
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        const str = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
        return /swiftshader|llvmpipe|softpipe/i.test(str);
      }
    } catch (_) {
      return false;
    }
    return false;
  }

  function ensureSlicePanelRenderer() {
    const canvas = $('#elev-slice-webgl');
    if (!canvas || !window.THREE) return null;
    if (!sliceRenderer) {
      const isSw = detectSoftwareWebGLContext();
      sliceRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isSw });
      sliceRenderer.setPixelRatio(isSw ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      sliceRenderer.setClearColor(0x000000, 0);
      sliceRenderer.outputEncoding = THREE.sRGBEncoding;

      sliceScene = new THREE.Scene();
      sliceCamera = new THREE.PerspectiveCamera(20, 4, 0.5, 600);

      const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 0.95);
      sliceScene.add(hemi);
      const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.15);
      keyLight.position.set(45, 70, 85);
      sliceScene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.38);
      rimLight.position.set(-55, 25, -45);
      sliceScene.add(rimLight);

      sliceBlockGroup = new THREE.Group();
      sliceScene.add(sliceBlockGroup);

      sliceCursorMesh = new THREE.Group();
      sliceCursorMesh.visible = false;
      sliceScene.add(sliceCursorMesh);
    }
    return sliceRenderer;
  }

  function projectSlicePointToSvg(x3d, y3d, z3d, width, height) {
    if (!sliceCamera) return { x: width * 0.5, y: height * 0.5 };
    const v = new THREE.Vector3(x3d, y3d, z3d).project(sliceCamera);
    return {
      x: (v.x * 0.5 + 0.5) * width,
      y: (-v.y * 0.5 + 0.5) * height
    };
  }

  function renderVerticalSlicePanel(samples, metrics, width, height) {
    const helpers = window.TransectHelpers;
    const sr = ensureSlicePanelRenderer();
    if (!sr || !sliceScene || !sliceCamera || !sliceBlockGroup || !helpers || !Array.isArray(samples) || samples.length < 2) {
      slicePanelProjection = null;
      return null;
    }

    const w = Math.max(120, Math.round(width || 740));
    const h = Math.max(90, Math.round(height || 196));
    sr.setSize(w, h, false);

    while (sliceBlockGroup.children.length > 0) {
      disposeObject(sliceBlockGroup.children[0]);
    }
    while (sliceCursorMesh.children.length > 0) {
      disposeObject(sliceCursorMesh.children[0]);
    }
    sliceCursorMesh.visible = false;

    const panelSpanX = 96;
    const halfWidth = 7.2;
    const panelBedrockM = -520;
    const panelTopM = Math.max(220, (metrics ? metrics.maxElevM : 200) * 1.24);
    const totalRangeM = panelTopM - panelBedrockM;
    const worldHeightSpan = 28;
    const worldPerMeter = worldHeightSpan / totalRangeM;
    const bedrockY = panelBedrockM * worldPerMeter;
    const topYMax = panelTopM * worldPerMeter;
    const panelTopScale = topYMax;
    const panelSeaY = 0;

    const geomData = helpers.buildVerticalSliceGeometryData(samples, {
      mode: 'panel',
      panelSpanX,
      halfWidth,
      bedrockY,
      panelSeaY,
      maxElevM: panelTopM,
      panelTopScale
    });

    if (geomData.indices.length > 0) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(geomData.positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(geomData.colors, 3));
      geo.setIndex(geomData.indices);
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.72,
        metalness: 0.08,
        side: THREE.DoubleSide
      });
      sliceBlockGroup.add(new THREE.Mesh(geo, mat));

      // Subtle wireframe geological strata guide lines along front cut face
      const strataFracs = [0.08, 0.28, 0.64];
      const totalDistKm = Math.max(0.05, samples[samples.length - 1].distanceKm || 1);
      strataFracs.forEach((f, idx) => {
        const pts = [];
        for (let i = 0; i < samples.length; i++) {
          const s = samples[i];
          const x = ((s.distanceKm / totalDistKm) - 0.5) * panelSpanX;
          const surfY = Math.max(0, s.elevationM) * worldPerMeter;
          const y = surfY - f * Math.max(0.4, surfY - bedrockY);
          pts.push(new THREE.Vector3(x, y, halfWidth + 0.08));
        }
        const lineMat = new THREE.LineBasicMaterial({
          color: idx === 0 ? 0x4ade80 : (idx === 1 ? 0xf59e0b : 0x94a3b8),
          transparent: true,
          opacity: 0.55
        });
        sliceBlockGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
      });

      // Translucent 0m sea-level water volume datum slab wrapping the cut section
      const waterThick = Math.max(0.28, Math.abs(bedrockY) * 0.08);
      const seaSlabGeo = new THREE.BoxGeometry(panelSpanX + 0.3, waterThick, halfWidth * 2 + 0.25);
      const seaSlabMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.22,
        roughness: 0.25,
        metalness: 0.1,
        depthWrite: false
      });
      const seaSlab = new THREE.Mesh(seaSlabGeo, seaSlabMat);
      seaSlab.position.set(0, -waterThick * 0.5, 0);
      sliceBlockGroup.add(seaSlab);

      // Cursor highlight vertical slice frame (moved on hover)
      const cursorH = topYMax - bedrockY + 2;
      const cursorGeo = new THREE.PlaneGeometry(halfWidth * 2 + 0.5, cursorH);
      cursorGeo.rotateY(Math.PI / 2);
      const cursorMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.26,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const cursorPlane = new THREE.Mesh(cursorGeo, cursorMat);
      cursorPlane.position.y = (topYMax + bedrockY) * 0.5;
      sliceCursorMesh.add(cursorPlane);
    }

    // Calibrate perspective camera so front strata wall aligns cleanly inside SVG chart margins
    const margin = { top: 18, right: 34, bottom: 26, left: 54 };
    const availW = Math.max(80, w - margin.left - margin.right);
    const availH = Math.max(50, h - margin.top - margin.bottom);
    const aspect = w / h;
    const fovRad = THREE.MathUtils.degToRad(20);
    const tanHalf = Math.tan(fovRad * 0.5);

    const dVert = (worldHeightSpan * 1.24) / (2 * tanHalf * (availH / h));
    const dHoriz = (panelSpanX * 1.14) / (2 * tanHalf * aspect * (availW / w));
    const camDist = Math.max(dVert, dHoriz);

    const midWorldY = (bedrockY + topYMax) * 0.5;
    sliceCamera.aspect = aspect;
    sliceCamera.position.set(11.5, midWorldY + camDist * 0.105, camDist);
    sliceCamera.lookAt(1.8, midWorldY + 0.85, 0);
    sliceCamera.updateProjectionMatrix();
    sliceCamera.updateMatrixWorld();

    sr.render(sliceScene, sliceCamera);

    const totalDistKm = Math.max(0.05, samples[samples.length - 1].distanceKm || 1);
    const projectElevDist = (distKm, elevM) => {
      const x3d = ((distKm / totalDistKm) - 0.5) * panelSpanX;
      const y3d = elevM * worldPerMeter;
      return projectSlicePointToSvg(x3d, y3d, halfWidth, w, h);
    };

    slicePanelProjection = {
      width: w,
      height: h,
      panelSpanX,
      halfWidth,
      panelBedrockM,
      panelTopM,
      worldPerMeter,
      totalDistKm,
      bedrockY,
      topYMax,
      projectElevDist
    };
    return slicePanelProjection;
  }

  function updateVerticalSlicePanelCursor(sample) {
    if (!sliceRenderer || !sliceScene || !sliceCamera || !sliceCursorMesh || !slicePanelProjection) return;
    if (!sample || !state.verticalSliceMode || !state.elevationProfileOpen) {
      if (sliceCursorMesh.visible) {
        sliceCursorMesh.visible = false;
        sliceRenderer.render(sliceScene, sliceCamera);
      }
      return;
    }
    const { panelSpanX, totalDistKm } = slicePanelProjection;
    const x3d = ((Math.max(0, Math.min(totalDistKm, sample.distanceKm)) / totalDistKm) - 0.5) * panelSpanX;
    sliceCursorMesh.position.set(x3d, 0, 0);
    sliceCursorMesh.visible = true;
    sliceRenderer.render(sliceScene, sliceCamera);
  }

  function syncElevationFocusSample(sample, source) {
    const liveBadge = $('#transect-live-badge');
    const liveElev = $('#transect-live-elev');
    const liveMeta = $('#transect-live-meta');
    const liveLabel = $('#transect-live-label');

    if (!sample) {
      if (elevationPointerMesh) elevationPointerMesh.visible = false;
      if (liveBadge) liveBadge.hidden = true;
      updateVerticalSlicePanelCursor(null);
      if (source !== 'chart' && activeTransectHoverRefs) {
        activeTransectHoverRefs.hoverLine.style('opacity', 0);
        activeTransectHoverRefs.hoverCircle.style('opacity', 0);
        activeTransectHoverRefs.tooltip.attr('hidden', true).style('display', 'none');
      }
      return;
    }

    if (elevationPointerMesh) {
      const surfY = surfaceHeight(sample.lat, sample.lng);
      elevationPointerMesh.position.set(sample.x, surfY, sample.z);
      elevationPointerMesh.visible = true;
    }

    updateVerticalSlicePanelCursor(sample);

    // Compute local slope near this sample for HUD readout
    let localSlopePct = 0;
    const idx = Math.max(0, Math.min(activeTransectSamples.length - 1, sample.index || 0));
    if (activeTransectSamples.length >= 2) {
      const prev = activeTransectSamples[Math.max(0, idx - 1)];
      const next = activeTransectSamples[Math.min(activeTransectSamples.length - 1, idx + 1)];
      const dKm = Math.max(0, (next.distanceKm || 0) - (prev.distanceKm || 0));
      if (dKm > 0.005) {
        localSlopePct = Math.min(75, (Math.abs((next.elevationM || 0) - (prev.elevationM || 0)) / (dKm * 1000)) * 100);
      }
    }

    const strata = window.TransectHelpers && state.verticalSliceMode
      ? window.TransectHelpers.getStrataInfo(20, sample.elevationM)
      : null;

    if (liveBadge && liveElev && liveMeta) {
      liveBadge.hidden = false;
      if (liveLabel) {
        liveLabel.textContent = isDraggingTransect
          ? 'LIVE DRAG SLICE'
          : (state.verticalSliceMode ? 'VERTICAL SLICE' : 'LIVE PROFILE');
      }
      liveElev.textContent = `${Math.round(sample.elevationM)} m`;
      liveMeta.textContent = `거리 ${sample.distanceKm.toFixed(1)} km · 경사 ${localSlopePct.toFixed(1)}%${strata ? ' · ' + strata.label.split(' ')[0] : (sample.name ? ' · ' + sample.name : '')}`;
    }

    if (source !== 'chart' && activeTransectHoverRefs) {
      const refs = activeTransectHoverRefs;
      const cx = refs.getCx ? refs.getCx(sample) : refs.xScale(sample.distanceKm);
      const cy = refs.getCy ? refs.getCy(sample) : refs.yScale(sample.elevationM);
      const clampedX = Math.max(refs.margin.left + 84, Math.min(refs.width - 88, (refs.absCoords ? 0 : refs.margin.left) + cx));
      const tipTop = cy < 58 ? (refs.absCoords ? 0 : refs.margin.top) + cy + 14 : Math.max(4, (refs.absCoords ? 0 : refs.margin.top) + cy - 64);
      if (refs.hoverLine) {
        const yBot = refs.getYBot ? refs.getYBot(sample) : refs.chartHeight;
        refs.hoverLine.attr('x1', cx).attr('x2', cx).attr('y1', Math.max(6, cy - 16)).attr('y2', yBot).style('opacity', 1);
      }
      if (refs.hoverCircle) refs.hoverCircle.attr('cx', cx).attr('cy', cy).style('opacity', 1);
      refs.tooltip
        .attr('hidden', null)
        .style('display', 'block')
        .style('left', `${clampedX}px`)
        .style('top', `${tipTop}px`)
        .html(`
          <strong>${sample.name ? sample.name + ' · ' : ''}${sample.distanceKm.toFixed(1)} km</strong>
          <div>고도 <span style="color:#38bdf8; font-weight:700;">${Math.round(sample.elevationM)} m</span> · 경사 ${localSlopePct.toFixed(1)}%</div>
          ${strata ? `<div style="color:${strata.hex}; font-size:10px; font-weight:600;">표층 지질: ${strata.label}</div>` : ''}
          <small style="color:#94a3b8;">위도 ${sample.lat.toFixed(4)}, 경도 ${sample.lng.toFixed(4)}</small>
        `);
    }
  }

  function calculateSolarPosition(latDeg, lngDeg, dateStr, minutesFromMidnight) {
    const parts = (dateStr || '2026-11-10').split('-');
    const year = parseInt(parts[0], 10) || 2026;
    const month = parseInt(parts[1], 10) || 11;
    const day = parseInt(parts[2], 10) || 10;

    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const targetDate = new Date(Date.UTC(year, month - 1, day));
    const dayOfYear = Math.floor((targetDate - startOfYear) / 86400000) + 1;

    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (minutesFromMidnight / 60 - 12) / 24);

    const eqtime = 229.18 * (
      0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma)
    );

    const decl = 0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma);

    const timeOffset = eqtime + 4 * (lngDeg - 135);
    const trueSolarTime = (minutesFromMidnight + timeOffset + 1440) % 1440;

    const hourAngleDeg = (trueSolarTime / 4) - 180;
    const hourAngleRad = THREE.MathUtils.degToRad(hourAngleDeg);
    const latRad = THREE.MathUtils.degToRad(latDeg);

    const csz = Math.sin(latRad) * Math.sin(decl) + Math.cos(latRad) * Math.cos(decl) * Math.cos(hourAngleRad);
    const zenithRad = Math.acos(Math.max(-1, Math.min(1, csz)));
    const elevationRad = Math.PI / 2 - zenithRad;
    const elevationDeg = THREE.MathUtils.radToDeg(elevationRad);

    const cosAz = (Math.sin(decl) - Math.sin(latRad) * csz) / (Math.cos(latRad) * Math.sin(zenithRad));
    let azimuthRad = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    if (hourAngleDeg > 0) {
      azimuthRad = 2 * Math.PI - azimuthRad;
    }
    const azimuthDeg = THREE.MathUtils.radToDeg(azimuthRad);

    const cosH0 = (Math.cos(THREE.MathUtils.degToRad(90.833)) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
    let sunriseMinutes = 428;
    let sunsetMinutes = 1044;
    if (cosH0 >= -1 && cosH0 <= 1) {
      const H0Deg = THREE.MathUtils.radToDeg(Math.acos(cosH0));
      sunriseMinutes = Math.round(720 - 4 * (lngDeg - 135) - eqtime - 4 * H0Deg);
      sunsetMinutes = Math.round(720 - 4 * (lngDeg - 135) - eqtime + 4 * H0Deg);
    }

    return {
      elevationDeg,
      azimuthDeg,
      sunriseMinutes,
      sunsetMinutes
    };
  }

  function updateSolarLighting(delta = 0) {
    if (solarPlaying) {
      state.solarTime = (state.solarTime + delta * solarSpeed * 10) % 1440;
      const slider = $('#solar-time-slider');
      if (slider) slider.value = Math.round(state.solarTime);
    }

    const r = getRegion();
    const centerLat = (r.bounds.north + r.bounds.south) / 2;
    const centerLng = (r.bounds.east + r.bounds.west) / 2;

    const solar = calculateSolarPosition(centerLat, centerLng, state.solarDate, state.solarTime);
    currentSolarPosition = solar;

    // UI Updates
    const h = Math.floor(state.solarTime / 60);
    const m = Math.floor(state.solarTime % 60);
    const clockStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const clockEl = $('#solar-clock-display') || $('#solar-time-clock');
    if (clockEl) clockEl.textContent = clockStr;

    const srH = Math.floor(solar.sunriseMinutes / 60);
    const srM = Math.floor(solar.sunriseMinutes % 60);
    const ssH = Math.floor(solar.sunsetMinutes / 60);
    const ssM = Math.floor(solar.sunsetMinutes % 60);
    const srEl = $('#solar-sunrise-time');
    if (srEl) srEl.textContent = `${String(srH).padStart(2, '0')}:${String(srM).padStart(2, '0')}`;
    const ssEl = $('#solar-sunset-time');
    if (ssEl) ssEl.textContent = `${String(ssH).padStart(2, '0')}:${String(ssM).padStart(2, '0')}`;

    const elevEl = $('#solar-elevation-deg');
    if (elevEl) elevEl.textContent = `${solar.elevationDeg.toFixed(1)}°`;

    const badge = $('#solar-phase-badge');
    if (badge) {
      if (solar.elevationDeg > 45) {
        badge.textContent = '한낮 (태양 정점)';
        badge.style.background = '#fef3c7';
        badge.style.color = '#92400e';
      } else if (solar.elevationDeg > 12) {
        badge.textContent = '한낮 (화창한 일조)';
        badge.style.background = '#e0f2fe';
        badge.style.color = '#0369a1';
      } else if (solar.elevationDeg > 0) {
        badge.textContent = '골든 아워 (일출/일몰 황금빛)';
        badge.style.background = '#ffedd5';
        badge.style.color = '#c2410c';
      } else if (solar.elevationDeg > -6) {
        badge.textContent = '시민 박명 (여명/노을)';
        badge.style.background = '#fae8ff';
        badge.style.color = '#86198f';
      } else if (solar.elevationDeg > -12) {
        badge.textContent = '항해 박명 (매직 아워)';
        badge.style.background = '#ede9fe';
        badge.style.color = '#5b21b6';
      } else {
        badge.textContent = '심야 (달빛과 별자리)';
        badge.style.background = '#1e293b';
        badge.style.color = '#93c5fd';
      }
    }

    if (!sunLight || !ambientLight) return;

    const elRad = THREE.MathUtils.degToRad(Math.max(-25, solar.elevationDeg));
    const azRad = THREE.MathUtils.degToRad(solar.azimuthDeg);
    const sunDist = 130;

    const sunX = Math.sin(azRad) * Math.cos(elRad) * sunDist;
    const sunY = Math.sin(elRad) * sunDist;
    const sunZ = -Math.cos(azRad) * Math.cos(elRad) * sunDist;

    sunLight.position.set(sunX, Math.max(1, sunY), sunZ);

    if (moonLight) {
      moonLight.position.set(-sunX, Math.max(12, -sunY), -sunZ);
    }

    const elev = solar.elevationDeg;
    document.body.classList.toggle('is-night-sky', elev <= 0);

    if (elev > 0) {
      const sunRatio = Math.min(1, elev / 38);
      // Clean, bright, realistic sunlight
      const sunR = THREE.MathUtils.lerp(1.0, 1.0, sunRatio);
      const sunG = THREE.MathUtils.lerp(0.70, 0.99, sunRatio);
      const sunB = THREE.MathUtils.lerp(0.40, 0.98, sunRatio);
      sunLight.color.setRGB(sunR, sunG, sunB);
      sunLight.intensity = THREE.MathUtils.lerp(0.65, 1.35, Math.min(1, elev / 14));
      sunLight.castShadow = true;

      // Bright, luminous sky ambient fill
      const ambR = THREE.MathUtils.lerp(0.72, 0.94, sunRatio);
      const ambG = THREE.MathUtils.lerp(0.68, 0.97, sunRatio);
      const ambB = THREE.MathUtils.lerp(0.74, 1.0, sunRatio);
      ambientLight.color.setRGB(ambR, ambG, ambB);
      ambientLight.groundColor.setHex(0x708076);
      ambientLight.intensity = THREE.MathUtils.lerp(0.60, 0.98, sunRatio);

      if (renderer && state.weather === 'clear') {
        const bgR = THREE.MathUtils.lerp(0.65, 0.94, sunRatio);
        const bgG = THREE.MathUtils.lerp(0.62, 0.97, sunRatio);
        const bgB = THREE.MathUtils.lerp(0.72, 0.99, sunRatio);
        renderer.setClearColor(new THREE.Color(bgR, bgG, bgB), 1);
      }

      if (moonLight) moonLight.intensity = 0;
      if (starsPoints && starsPoints.material) starsPoints.material.opacity = 0;
    } else {
      const nightRatio = Math.min(1, -elev / 15);

      sunLight.intensity = Math.max(0, 0.4 * (1 - nightRatio * 2));
      sunLight.castShadow = false;

      if (moonLight) {
        moonLight.color.setHex(0x9abce0);
        moonLight.intensity = THREE.MathUtils.lerp(0.1, 0.45, nightRatio);
      }

      const ambR = THREE.MathUtils.lerp(0.35, 0.12, nightRatio);
      const ambG = THREE.MathUtils.lerp(0.28, 0.15, nightRatio);
      const ambB = THREE.MathUtils.lerp(0.42, 0.24, nightRatio);
      ambientLight.color.setRGB(ambR, ambG, ambB);
      ambientLight.groundColor.setHex(0x0a101b);
      ambientLight.intensity = THREE.MathUtils.lerp(0.48, 0.36, nightRatio);

      if (renderer && state.weather === 'clear') {
        const bgR = THREE.MathUtils.lerp(0.25, 0.04, nightRatio);
        const bgG = THREE.MathUtils.lerp(0.20, 0.06, nightRatio);
        const bgB = THREE.MathUtils.lerp(0.32, 0.10, nightRatio);
        renderer.setClearColor(new THREE.Color(bgR, bgG, bgB), 1);
      }

      if (starsPoints && starsPoints.material) {
        starsPoints.material.opacity = THREE.MathUtils.lerp(0.0, 0.95, Math.min(1, (-elev - 2) / 10));
      }
    }

    if (airportEmissiveMaterials && airportEmissiveMaterials.length > 0) {
      const duskFactor = THREE.MathUtils.clamp((8 - elev) / 16, 0, 1);
      for (let i = 0; i < airportEmissiveMaterials.length; i++) {
        const entry = airportEmissiveMaterials[i];
        entry.mat.emissiveIntensity = THREE.MathUtils.lerp(entry.dayInt, entry.nightInt, duskFactor);
      }
    }
    if (yeongamEmissiveMaterials && yeongamEmissiveMaterials.length > 0) {
      const duskFactor = THREE.MathUtils.clamp((8 - elev) / 16, 0, 1);
      for (let i = 0; i < yeongamEmissiveMaterials.length; i++) {
        const entry = yeongamEmissiveMaterials[i];
        entry.mat.emissiveIntensity = THREE.MathUtils.lerp(entry.dayInt, entry.nightInt, duskFactor);
      }
    }
  }

  function updateElevationProfile(overrideWaypoints) {
    const r = getRegion();
    const helpers = window.TransectHelpers;
    const mode = Array.isArray(overrideWaypoints) ? 'custom-path' : (state.elevationTransectMode || 'west-east');
    const sampleCount = isDraggingTransect ? 72 : 120;

    let waypoints = [];
    if (Array.isArray(overrideWaypoints) && overrideWaypoints.length >= 2) {
      waypoints = overrideWaypoints;
    } else if (mode === 'west-east') {
      const midLat = (r.bounds.north + r.bounds.south) / 2;
      waypoints = [
        { lat: midLat, lng: r.bounds.west, name: '서단' },
        { lat: midLat, lng: r.bounds.east, name: '동단' }
      ];
    } else if (mode === 'north-south') {
      const midLng = (r.bounds.east + r.bounds.west) / 2;
      waypoints = [
        { lat: r.bounds.north, lng: midLng, name: '북단' },
        { lat: r.bounds.south, lng: midLng, name: '남단' }
      ];
    } else if (mode === 'custom-path') {
      waypoints = Array.isArray(state.customTransect) ? state.customTransect : [];
    } else {
      waypoints = state.markers.length >= 2 ? state.markers : r.presets.slice(0, 5);
    }

    const sampleElevM = (lat, lng) => Math.max(0, heightAt(lat, lng));
    let samples = [];
    if (waypoints.length >= 2 && helpers) {
      samples = helpers.sampleTransectPath(waypoints, sampleElevM, {
        sampleCount,
        mapPoint: (lat, lng) => worldPosition(lat, lng)
      });
    } else if (mode !== 'custom-path' && helpers) {
      const midLat = (r.bounds.north + r.bounds.south) / 2;
      samples = helpers.sampleTransectPath(
        [{ lat: midLat, lng: r.bounds.west }, { lat: midLat, lng: r.bounds.east }],
        sampleElevM,
        { sampleCount, mapPoint: (lat, lng) => worldPosition(lat, lng) }
      );
    }

    activeTransectSamples = samples;
    const metrics = helpers
      ? helpers.computeTransectMetrics(samples)
      : { minElevM: 0, maxElevM: 0, avgElevM: 0, peakIndex: 0, peakSample: null, totalDistKm: 0, maxSlopePct: 0, totalGainM: 0, totalLossM: 0 };

    // Keep 3D viewport cross-section curtain & vertical slice cutaway synchronized
    if (state.elevationProfileOpen || isDraggingTransect) {
      build3DTransectOverlay(samples, metrics);
      if (state.elevationProfileOpen && state.verticalSliceMode) {
        applyVerticalSlice3DCut(samples, metrics);
      } else {
        restoreTerrainFromVerticalSlice();
      }
    } else {
      clear3DTransectOverlay();
    }

    const titleEl = $('#elev-chart-title');
    if (titleEl) {
      const modeTitle =
        mode === 'custom-path' ? '사용자 드래그 지형 단면' :
        mode === 'north-south' ? '북 ↔ 남 지형 단면' :
        mode === 'places-route' ? '장소 연결 경로 단면' : '서 ↔ 동 지형 단면';
      const sliceTag = state.verticalSliceMode ? ' · 🪨 Vertical Slice 3D' : '';
      titleEl.textContent = `${r.name} · ${modeTitle}${sliceTag}`;
    }

    const minEl = $('#elev-stat-min') || $('#elev-min-val');
    if (minEl) minEl.textContent = `${Math.round(metrics.minElevM)}m`;
    const maxEl = $('#elev-stat-max') || $('#elev-max-val');
    if (maxEl) maxEl.textContent = `${Math.round(metrics.maxElevM)}m`;
    const maxNameEl = $('#elev-stat-max-name');
    if (maxNameEl) {
      maxNameEl.textContent = metrics.peakSample && metrics.peakSample.name ? `(${metrics.peakSample.name})` : '';
    }
    const distEl = $('#elev-stat-dist') || $('#elev-dist-val');
    if (distEl) distEl.textContent = `${metrics.totalDistKm.toFixed(1)} km`;
    const gainEl = $('#elev-stat-gain');
    if (gainEl) {
      gainEl.textContent = `+${Math.round(metrics.totalGainM).toLocaleString()}m / -${Math.round(metrics.totalLossM).toLocaleString()}m`;
    }
    const gradeEl = $('#elev-stat-slope') || $('#elev-grade-val');
    if (gradeEl) gradeEl.textContent = `${metrics.maxSlopePct.toFixed(1)}%`;

    if (!window.d3) return;

    const svg = d3.select('#elevation-chart-svg');
    svg.selectAll('*').remove();
    activeTransectHoverRefs = null;

    const svgNode = svg.node();
    const width = svgNode ? (svgNode.clientWidth || 740) : 740;
    const isSliceMode = Boolean(state.elevationProfileOpen && state.verticalSliceMode);
    const height = svgNode ? (svgNode.clientHeight || (isSliceMode ? 196 : 155)) : (isSliceMode ? 196 : 155);
    const margin = { top: 18, right: 34, bottom: 28, left: 54 };

    if (samples.length < 2) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', isSliceMode ? '#e2e8f0' : '#64748b')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .text('상단의 "✏️ 3D 경로 드래그"를 누른 뒤 3D 지형 위를 드래그해 단면을 그려보세요.');
      return;
    }

    if (isSliceMode) {
      const proj = renderVerticalSlicePanel(samples, metrics, width, height);
      if (proj) {
        const leftSea = proj.projectElevDist(0, 0);
        const rightSea = proj.projectElevDist(proj.totalDistKm, 0);
        const leftBot = proj.projectElevDist(0, proj.panelBedrockM);
        const rightBot = proj.projectElevDist(proj.totalDistKm, proj.panelBedrockM);

        // Glowing 0m Sea-Level datum line across the 3D cutaway wall
        svg.append('line')
          .attr('x1', leftSea.x).attr('y1', leftSea.y)
          .attr('x2', rightSea.x).attr('y2', rightSea.y)
          .attr('stroke', '#38bdf8')
          .attr('stroke-width', 1.35)
          .attr('stroke-dasharray', '5,3')
          .attr('opacity', 0.9);

        svg.append('text')
          .attr('x', rightSea.x + 5)
          .attr('y', rightSea.y + 3)
          .attr('fill', '#7dd3fc')
          .attr('font-size', '9.5px')
          .attr('font-weight', '700')
          .text('0m 해수면');

        // Crisp glowing skyline crest curve aligned pixel-for-pixel with the 3D WebGL front ridge
        const sliceLineGen = d3.line()
          .x((d) => proj.projectElevDist(d.distanceKm, d.elevationM).x)
          .y((d) => proj.projectElevDist(d.distanceKm, d.elevationM).y)
          .curve(d3.curveMonotoneX);

        svg.append('path')
          .datum(samples)
          .attr('fill', 'none')
          .attr('stroke', '#38bdf8')
          .attr('stroke-width', 2.2)
          .attr('opacity', 0.92)
          .attr('d', sliceLineGen);

        // Left Depth & Elevation Axis aligned against the 3D left wall
        const yTicksM = [proj.panelBedrockM, -220, 0];
        const peakStep = proj.panelTopM > 1200 ? 1000 : (proj.panelTopM > 500 ? 500 : 200);
        for (let m = peakStep; m <= metrics.maxElevM * 1.1; m += peakStep) {
          yTicksM.push(m);
        }
        yTicksM.forEach((tickM) => {
          const pt = proj.projectElevDist(0, tickM);
          svg.append('line')
            .attr('x1', pt.x - 5).attr('y1', pt.y)
            .attr('x2', pt.x).attr('y2', pt.y)
            .attr('stroke', tickM < 0 ? '#94a3b8' : '#334155')
            .attr('stroke-width', 1.2);
          svg.append('text')
            .attr('x', pt.x - 8)
            .attr('y', pt.y + 3)
            .attr('text-anchor', 'end')
            .attr('fill', tickM < 0 ? '#cbd5e1' : '#0f172a')
            .attr('font-size', '10px')
            .attr('font-weight', tickM === 0 ? '700' : '600')
            .text(`${tickM}m`);
        });

        // Bottom Distance Axis along bedrock base
        const xTicksCount = Math.min(6, Math.max(3, Math.floor((rightBot.x - leftBot.x) / 95)));
        for (let i = 0; i <= xTicksCount; i++) {
          const km = (proj.totalDistKm * i) / xTicksCount;
          const pt = proj.projectElevDist(km, proj.panelBedrockM);
          svg.append('line')
            .attr('x1', pt.x).attr('y1', pt.y)
            .attr('x2', pt.x).attr('y2', pt.y + 4)
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1.1);
          svg.append('text')
            .attr('x', pt.x)
            .attr('y', Math.min(height - 5, pt.y + 15))
            .attr('text-anchor', 'middle')
            .attr('fill', '#cbd5e1')
            .attr('font-size', '10px')
            .attr('font-weight', '600')
            .text(`${km.toFixed(proj.totalDistKm < 5 ? 1 : 0)}km`);
        }

        // Peak badge
        if (metrics.peakSample && metrics.maxElevM > 15) {
          const pkPt = proj.projectElevDist(metrics.peakSample.distanceKm, metrics.peakSample.elevationM);
          svg.append('circle')
            .attr('cx', pkPt.x).attr('cy', pkPt.y)
            .attr('r', 4.5)
            .attr('fill', '#f59e0b')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.6);
          svg.append('text')
            .attr('x', Math.min(width - 42, Math.max(46, pkPt.x)))
            .attr('y', Math.max(12, pkPt.y - 9))
            .attr('text-anchor', 'middle')
            .attr('fill', '#92400e')
            .attr('font-size', '10.5px')
            .attr('font-weight', '800')
            .text(`${Math.round(metrics.maxElevM)}m`);
        }

        const hoverLine = svg.append('line')
          .attr('stroke', '#00f5ff')
          .attr('stroke-width', 1.6)
          .attr('stroke-dasharray', '4,3')
          .style('opacity', 0);

        const hoverCircle = svg.append('circle')
          .attr('r', 5.2)
          .attr('fill', '#0ea5e9')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('opacity', 0);

        const xInv = d3.scaleLinear()
          .domain([leftBot.x, Math.max(leftBot.x + 1, rightBot.x)])
          .range([0, proj.totalDistKm])
          .clamp(true);

        const tooltip = d3.select('#elev-chart-tooltip');
        activeTransectHoverRefs = {
          hoverLine,
          hoverCircle,
          tooltip,
          margin,
          width,
          absCoords: true,
          getCx: (s) => proj.projectElevDist(s.distanceKm, s.elevationM).x,
          getCy: (s) => proj.projectElevDist(s.distanceKm, s.elevationM).y,
          getYBot: (s) => proj.projectElevDist(s.distanceKm, proj.panelBedrockM).y,
          samples
        };

        const bisectDistance = d3.bisector(d => d.distanceKm).left;

        svg.append('rect')
          .attr('x', Math.max(0, leftBot.x - 6))
          .attr('y', 0)
          .attr('width', Math.max(40, rightBot.x - leftBot.x + 12))
          .attr('height', height)
          .attr('fill', 'transparent')
          .style('cursor', 'crosshair')
          .on('pointermove', function(event) {
            const [mx] = d3.pointer(event);
            const distVal = xInv(mx);
            const idx = Math.max(0, Math.min(samples.length - 1, bisectDistance(samples, distVal)));
            const d0 = samples[idx - 1];
            const d1 = samples[idx];
            const s = (!d0) ? d1 : (!d1) ? d0 : (distVal - d0.distanceKm > d1.distanceKm - distVal ? d1 : d0);
            if (!s) return;

            const surfPt = proj.projectElevDist(s.distanceKm, s.elevationM);
            const botPt = proj.projectElevDist(s.distanceKm, proj.panelBedrockM);
            const clampedX = Math.max(88, Math.min(width - 94, surfPt.x));
            const tipTop = surfPt.y < 64 ? surfPt.y + 14 : Math.max(4, surfPt.y - 68);
            const strata = helpers ? helpers.getStrataInfo(20, s.elevationM) : null;

            hoverLine.attr('x1', surfPt.x).attr('x2', surfPt.x).attr('y1', Math.max(6, surfPt.y - 16)).attr('y2', botPt.y).style('opacity', 1);
            hoverCircle.attr('cx', surfPt.x).attr('cy', surfPt.y).style('opacity', 1);

            tooltip
              .attr('hidden', null)
              .style('display', 'block')
              .style('left', `${clampedX}px`)
              .style('top', `${tipTop}px`)
              .html(`
                <strong>${s.name ? s.name + ' · ' : ''}${s.distanceKm.toFixed(1)} km</strong>
                <div>지표 고도 <span style="color:#38bdf8; font-weight:700;">${Math.round(s.elevationM)} m</span> · 심부 ${proj.panelBedrockM}m</div>
                ${strata ? `<div style="color:${strata.hex}; font-size:10px; font-weight:600;">지층: ${strata.label}</div>` : ''}
                <small style="color:#94a3b8;">위도 ${s.lat.toFixed(4)}, 경도 ${s.lng.toFixed(4)}</small>
              `);

            syncElevationFocusSample(s, 'chart');
          })
          .on('pointerleave', function() {
            hoverLine.style('opacity', 0);
            hoverCircle.style('opacity', 0);
            tooltip.attr('hidden', true).style('display', 'none');
            syncElevationFocusSample(null, 'chart');
          });
        return;
      }
    }

    const chartWidth = Math.max(100, width - margin.left - margin.right);
    const chartHeight = Math.max(50, height - margin.top - margin.bottom);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, Math.max(0.05, metrics.totalDistKm)])
      .range([0, chartWidth]);

    const yUpper = Math.max(60, metrics.maxElevM * 1.28);
    const yScale = d3.scaleLinear()
      .domain([0, yUpper])
      .range([chartHeight, 0]);

    const defs = svg.append('defs');
    const grad = defs.append('linearGradient')
      .attr('id', 'elev-area-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    grad.append('stop').attr('offset', '0%').attr('stop-color', '#0ea5e9').attr('stop-opacity', 0.75);
    grad.append('stop').attr('offset', '65%').attr('stop-color', '#10b981').attr('stop-opacity', 0.35);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#0f766e').attr('stop-opacity', 0.05);

    const areaGen = d3.area()
      .x(d => xScale(d.distanceKm))
      .y0(chartHeight)
      .y1(d => yScale(d.elevationM))
      .curve(d3.curveMonotoneX);

    const lineGen = d3.line()
      .x(d => xScale(d.distanceKm))
      .y(d => yScale(d.elevationM))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(samples)
      .attr('fill', 'url(#elev-area-gradient)')
      .attr('d', areaGen);

    g.append('path')
      .datum(samples)
      .attr('fill', 'none')
      .attr('stroke', '#0284c7')
      .attr('stroke-width', 2.4)
      .attr('d', lineGen);

    const yAxisGrid = d3.axisLeft(yScale)
      .ticks(4)
      .tickSize(-chartWidth)
      .tickFormat('')
      .tickSizeOuter(0);

    g.append('g')
      .attr('class', 'elev-grid')
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.18)
      .call(yAxisGrid);

    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(7, Math.floor(chartWidth / 75)))
      .tickFormat(d => `${Number(d).toFixed(metrics.totalDistKm < 5 ? 1 : 0)}km`);

    const yAxis = d3.axisLeft(yScale)
      .ticks(4)
      .tickFormat(d => `${d}m`);

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .attr('color', '#64748b')
      .attr('font-size', '11px')
      .call(xAxis);

    g.append('g')
      .attr('color', '#64748b')
      .attr('font-size', '11px')
      .call(yAxis);

    // Peak highlight marker dot on the chart
    if (metrics.peakSample && metrics.maxElevM > 15) {
      const px = xScale(metrics.peakSample.distanceKm);
      const py = yScale(metrics.peakSample.elevationM);
      g.append('circle')
        .attr('cx', px)
        .attr('cy', py)
        .attr('r', 4)
        .attr('fill', '#f59e0b')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5);
      g.append('text')
        .attr('x', Math.min(chartWidth - 28, Math.max(24, px)))
        .attr('y', Math.max(10, py - 8))
        .attr('text-anchor', 'middle')
        .attr('fill', '#b45309')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .text(`${Math.round(metrics.maxElevM)}m`);
    }

    const hoverLine = g.append('line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#0ea5e9')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .style('opacity', 0);

    const hoverCircle = g.append('circle')
      .attr('r', 5)
      .attr('fill', '#0284c7')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    const tooltip = d3.select('#elev-chart-tooltip');
    activeTransectHoverRefs = { hoverLine, hoverCircle, tooltip, xScale, yScale, margin, width, chartHeight, samples };

    const bisectDistance = d3.bisector(d => d.distanceKm).left;

    g.append('rect')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('pointermove', function(event) {
        const [mx] = d3.pointer(event);
        const distVal = xScale.invert(mx);
        const idx = Math.max(0, Math.min(samples.length - 1, bisectDistance(samples, distVal)));
        const d0 = samples[idx - 1];
        const d1 = samples[idx];
        const s = (!d0) ? d1 : (!d1) ? d0 : (distVal - d0.distanceKm > d1.distanceKm - distVal ? d1 : d0);

        if (!s) return;

        const cx = xScale(s.distanceKm);
        const cy = yScale(s.elevationM);
        const clampedX = Math.max(margin.left + 84, Math.min(width - 88, margin.left + cx));
        const tipTop = cy < 58 ? margin.top + cy + 14 : Math.max(4, margin.top + cy - 58);

        hoverLine.attr('x1', cx).attr('x2', cx).style('opacity', 1);
        hoverCircle.attr('cx', cx).attr('cy', cy).style('opacity', 1);

        tooltip
          .attr('hidden', null)
          .style('display', 'block')
          .style('left', `${clampedX}px`)
          .style('top', `${tipTop}px`)
          .html(`
            <strong>${s.name ? s.name + ' · ' : ''}${s.distanceKm.toFixed(1)} km</strong>
            <div>고도 <span style="color:#38bdf8; font-weight:700;">${Math.round(s.elevationM)} m</span></div>
            <small style="color:#94a3b8;">위도 ${s.lat.toFixed(4)}, 경도 ${s.lng.toFixed(4)}</small>
          `);

        syncElevationFocusSample(s, 'chart');
      })
      .on('pointerleave', function() {
        hoverLine.style('opacity', 0);
        hoverCircle.style('opacity', 0);
        tooltip.attr('hidden', true).style('display', 'none');
        syncElevationFocusSample(null, 'chart');
      });
  }

  function updateClimateOverlay() {
    const climateApi = window.ClimateData;
    if (!climateApi) return;

    const r = getRegion();
    const profile = climateApi.getClimateProfile(currentRegionId);
    const summary = climateApi.computeClimateSummary(profile);
    const rows = profile.monthly || [];
    const mode = ['overview', 'sunshine', 'marine'].includes(state.climateChartMode) ? state.climateChartMode : 'overview';

    // Populate Header & Summary KPIs
    const kickerEl = $('#climate-station-kicker');
    if (kickerEl) kickerEl.textContent = `D3.js YEARLY CLIMATE · ${profile.stationName}`;
    const titleEl = $('#climate-chart-title');
    if (titleEl) titleEl.textContent = `${r.name} 연간 기후 데이터`;
    const typeEl = $('#climate-type-label');
    if (typeEl) typeEl.textContent = profile.climateType;
    const noteEl = $('#climate-note');
    if (noteEl) noteEl.textContent = profile.note;

    const tempEl = $('#climate-stat-temp');
    if (tempEl) tempEl.textContent = `${summary.annualMeanTempC.toFixed(1)}°C`;
    const tempRangeEl = $('#climate-stat-temp-range');
    if (tempRangeEl && summary.coldestMonth && summary.hottestMonth) {
      tempRangeEl.textContent = `${summary.coldestMonth.label} ${summary.coldestMonth.avgTempC}° · ${summary.hottestMonth.label} ${summary.hottestMonth.avgTempC}°`;
    }

    const precipEl = $('#climate-stat-precip');
    if (precipEl) precipEl.textContent = `${summary.annualPrecipMm.toLocaleString()} mm`;
    const precipPeakEl = $('#climate-stat-precip-peak');
    if (precipPeakEl && summary.wettestMonth) {
      precipPeakEl.textContent = `최다 ${summary.wettestMonth.label} (${Math.round(summary.wettestMonth.precipMm)}mm)`;
    }

    const sunEl = $('#climate-stat-sun');
    if (sunEl) sunEl.textContent = `${summary.annualSunshineHrs.toLocaleString()} hr`;
    const humEl = $('#climate-stat-humidity');
    if (humEl) humEl.textContent = `평균 습도 ${summary.avgHumidityPct}%`;

    const seasonEl = $('#climate-stat-season');
    if (seasonEl) seasonEl.textContent = profile.bestSeason;

    const legendEl = $('#climate-legend');
    if (legendEl) {
      if (mode === 'overview') {
        legendEl.innerHTML = [
          '<span class="climate-legend-item"><span class="climate-legend-line" style="background:#dc2626;"></span>평균 기온(°C)</span>',
          '<span class="climate-legend-item"><span class="climate-legend-swatch" style="background:rgba(239,68,68,0.22); border:1px solid rgba(239,68,68,0.45);"></span>최저–최고 범위</span>',
          '<span class="climate-legend-item"><span class="climate-legend-swatch" style="background:#38bdf8;"></span>강수량(mm)</span>'
        ].join('');
      } else if (mode === 'sunshine') {
        legendEl.innerHTML = [
          '<span class="climate-legend-item"><span class="climate-legend-swatch" style="background:#f59e0b;"></span>일조시간(hr)</span>',
          '<span class="climate-legend-item"><span class="climate-legend-line" style="background:#0d9488;"></span>상대습도(%)</span>'
        ].join('');
      } else {
        legendEl.innerHTML = [
          '<span class="climate-legend-item"><span class="climate-legend-line" style="background:#0284c7;"></span>연안 수온(°C)</span>',
          '<span class="climate-legend-item"><span class="climate-legend-swatch" style="background:#6366f1;"></span>평균 풍속(m/s)</span>'
        ].join('');
      }
    }

    if (!window.d3 || !rows.length) return;

    const svg = d3.select('#climate-chart-svg');
    svg.selectAll('*').remove();

    const svgNode = svg.node();
    const width = svgNode ? (svgNode.clientWidth || 740) : 740;
    const height = svgNode ? (svgNode.clientHeight || 175) : 175;
    const margin = { top: 16, right: 48, bottom: 26, left: 46 };
    const chartWidth = Math.max(120, width - margin.left - margin.right);
    const chartHeight = Math.max(60, height - margin.top - margin.bottom);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const activeMonth = (() => {
      const m = String(state.solarDate || '').split('-')[1];
      const num = Number(m);
      return Number.isFinite(num) && num >= 1 && num <= 12 ? num : 11;
    })();

    const xScale = d3.scaleBand()
      .domain(rows.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.28);

    const bandwidth = xScale.bandwidth();
    const step = xScale.step();
    const cxFor = (d) => xScale(d.label) + bandwidth * 0.5;

    // Active month highlight strip behind data
    const activeRow = rows.find((d) => d.month === activeMonth);
    if (activeRow) {
      g.append('rect')
        .attr('x', xScale(activeRow.label) - Math.max(3, (step - bandwidth) * 0.35))
        .attr('y', 0)
        .attr('width', bandwidth + Math.max(6, (step - bandwidth) * 0.7))
        .attr('height', chartHeight)
        .attr('rx', 5)
        .attr('fill', 'rgba(23, 105, 193, 0.08)');
    }

    let yLeftScale;
    let yRightScale;
    let leftTickFmt;
    let rightTickFmt;
    let leftColor = '#334155';
    let rightColor = '#0284c7';

    const defs = svg.append('defs');

    if (mode === 'overview') {
      const minT = d3.min(rows, (d) => d.minTempC);
      const maxT = d3.max(rows, (d) => d.maxTempC);
      const padMin = Math.floor((minT - 3) / 5) * 5;
      const padMax = Math.ceil((maxT + 3) / 5) * 5;
      const maxP = Math.max(100, d3.max(rows, (d) => d.precipMm) * 1.18);

      yLeftScale = d3.scaleLinear().domain([padMin, padMax]).range([chartHeight, 0]);
      yRightScale = d3.scaleLinear().domain([0, maxP]).nice(4).range([chartHeight, 0]);
      leftTickFmt = (d) => `${d}°C`;
      rightTickFmt = (d) => `${d}mm`;
      leftColor = '#b91c1c';
      rightColor = '#0284c7';

      // Horizontal dashed grid from left axis
      g.append('g')
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.16)
        .call(d3.axisLeft(yLeftScale).ticks(4).tickSize(-chartWidth).tickFormat('').tickSizeOuter(0));

      // Zero Celsius baseline when winter drops below 0°C
      if (padMin < 0 && padMax > 0) {
        g.append('line')
          .attr('x1', 0)
          .attr('x2', chartWidth)
          .attr('y1', yLeftScale(0))
          .attr('y2', yLeftScale(0))
          .attr('stroke', '#94a3b8')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,3')
          .attr('opacity', 0.7);
      }

      // Precipitation bars
      g.selectAll('.climate-bar')
        .data(rows)
        .enter()
        .append('rect')
        .attr('class', 'climate-bar')
        .attr('x', (d) => xScale(d.label))
        .attr('y', (d) => yRightScale(d.precipMm))
        .attr('width', bandwidth)
        .attr('height', (d) => Math.max(1, chartHeight - yRightScale(d.precipMm)))
        .attr('rx', 3)
        .attr('fill', (d) => d.month === activeMonth ? '#0284c7' : '#7dd3fc')
        .attr('opacity', (d) => d.month === activeMonth ? 0.88 : 0.72);

      // Min-Max temperature thermal range band
      const bandArea = d3.area()
        .x(cxFor)
        .y0((d) => yLeftScale(d.minTempC))
        .y1((d) => yLeftScale(d.maxTempC))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(rows)
        .attr('fill', 'rgba(239, 68, 68, 0.17)')
        .attr('d', bandArea);

      // Average temperature curve
      const avgLine = d3.line()
        .x(cxFor)
        .y((d) => yLeftScale(d.avgTempC))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(rows)
        .attr('fill', 'none')
        .attr('stroke', '#dc2626')
        .attr('stroke-width', 2.4)
        .attr('d', avgLine);

      g.selectAll('.climate-temp-dot')
        .data(rows)
        .enter()
        .append('circle')
        .attr('cx', cxFor)
        .attr('cy', (d) => yLeftScale(d.avgTempC))
        .attr('r', (d) => d.month === activeMonth ? 4.5 : 3)
        .attr('fill', (d) => d.month === activeMonth ? '#991b1b' : '#dc2626')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.4);
    } else if (mode === 'sunshine') {
      const maxSun = Math.max(240, d3.max(rows, (d) => d.sunshineHrs) * 1.15);
      yLeftScale = d3.scaleLinear().domain([0, maxSun]).nice(4).range([chartHeight, 0]);
      yRightScale = d3.scaleLinear().domain([35, 95]).range([chartHeight, 0]);
      leftTickFmt = (d) => `${d}h`;
      rightTickFmt = (d) => `${d}%`;
      leftColor = '#b45309';
      rightColor = '#0f766e';

      g.append('g')
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.16)
        .call(d3.axisLeft(yLeftScale).ticks(4).tickSize(-chartWidth).tickFormat('').tickSizeOuter(0));

      // Sunshine hour bars
      g.selectAll('.climate-sun-bar')
        .data(rows)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.label))
        .attr('y', (d) => yLeftScale(d.sunshineHrs))
        .attr('width', bandwidth)
        .attr('height', (d) => Math.max(1, chartHeight - yLeftScale(d.sunshineHrs)))
        .attr('rx', 3)
        .attr('fill', (d) => d.month === activeMonth ? '#d97706' : '#fbbf24')
        .attr('opacity', (d) => d.month === activeMonth ? 0.88 : 0.72);

      // Humidity line
      const humLine = d3.line()
        .x(cxFor)
        .y((d) => yRightScale(d.humidityPct))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(rows)
        .attr('fill', 'none')
        .attr('stroke', '#0d9488')
        .attr('stroke-width', 2.4)
        .attr('d', humLine);

      g.selectAll('.climate-hum-dot')
        .data(rows)
        .enter()
        .append('circle')
        .attr('cx', cxFor)
        .attr('cy', (d) => yRightScale(d.humidityPct))
        .attr('r', (d) => d.month === activeMonth ? 4.5 : 3)
        .attr('fill', (d) => d.month === activeMonth ? '#115e59' : '#0d9488')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.4);
    } else {
      const maxSea = Math.max(28, d3.max(rows, (d) => d.seaTempC) + 3);
      const maxWind = Math.max(5.5, d3.max(rows, (d) => d.windMs) * 1.25);
      yLeftScale = d3.scaleLinear().domain([0, maxSea]).nice(4).range([chartHeight, 0]);
      yRightScale = d3.scaleLinear().domain([0, maxWind]).nice(4).range([chartHeight, 0]);
      leftTickFmt = (d) => `${d}°C`;
      rightTickFmt = (d) => `${d}m/s`;
      leftColor = '#0369a1';
      rightColor = '#4f46e5';

      const seaGrad = defs.append('linearGradient')
        .attr('id', 'climate-sea-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');
      seaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0ea5e9').attr('stop-opacity', 0.34);
      seaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#0ea5e9').attr('stop-opacity', 0.03);

      g.append('g')
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.16)
        .call(d3.axisLeft(yLeftScale).ticks(4).tickSize(-chartWidth).tickFormat('').tickSizeOuter(0));

      // Wind speed bars
      g.selectAll('.climate-wind-bar')
        .data(rows)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.label))
        .attr('y', (d) => yRightScale(d.windMs))
        .attr('width', bandwidth)
        .attr('height', (d) => Math.max(1, chartHeight - yRightScale(d.windMs)))
        .attr('rx', 3)
        .attr('fill', (d) => d.month === activeMonth ? '#4f46e5' : '#a5b4fc')
        .attr('opacity', (d) => d.month === activeMonth ? 0.85 : 0.65);

      const seaArea = d3.area()
        .x(cxFor)
        .y0(chartHeight)
        .y1((d) => yLeftScale(d.seaTempC))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(rows)
        .attr('fill', 'url(#climate-sea-gradient)')
        .attr('d', seaArea);

      const seaLine = d3.line()
        .x(cxFor)
        .y((d) => yLeftScale(d.seaTempC))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(rows)
        .attr('fill', 'none')
        .attr('stroke', '#0284c7')
        .attr('stroke-width', 2.4)
        .attr('d', seaLine);

      g.selectAll('.climate-sea-dot')
        .data(rows)
        .enter()
        .append('circle')
        .attr('cx', cxFor)
        .attr('cy', (d) => yLeftScale(d.seaTempC))
        .attr('r', (d) => d.month === activeMonth ? 4.5 : 3)
        .attr('fill', (d) => d.month === activeMonth ? '#075985' : '#0284c7')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.4);
    }

    // Axes
    const xAxisG = g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .attr('color', '#64748b')
      .attr('font-size', '11px')
      .call(d3.axisBottom(xScale).tickSizeOuter(0));

    xAxisG.selectAll('.tick text')
      .attr('font-weight', (label) => (activeRow && activeRow.label === label ? '700' : '500'))
      .attr('fill', (label) => (activeRow && activeRow.label === label ? '#1769c1' : '#64748b'));

    g.append('g')
      .attr('color', leftColor)
      .attr('font-size', '10.5px')
      .call(d3.axisLeft(yLeftScale).ticks(4).tickFormat(leftTickFmt).tickSizeOuter(0));

    g.append('g')
      .attr('transform', `translate(${chartWidth},0)`)
      .attr('color', rightColor)
      .attr('font-size', '10.5px')
      .call(d3.axisRight(yRightScale).ticks(4).tickFormat(rightTickFmt).tickSizeOuter(0));

    // Interactive Crosshair, Focus Dot, Tooltip & Month Click-to-Apply
    const hoverLine = g.append('line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#1769c1')
      .attr('stroke-width', 1.3)
      .attr('stroke-dasharray', '4,3')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    const hoverDot = g.append('circle')
      .attr('r', 5.5)
      .attr('fill', mode === 'overview' ? '#dc2626' : (mode === 'sunshine' ? '#0d9488' : '#0284c7'))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .style('pointer-events', 'none');

    const tooltip = d3.select('#climate-chart-tooltip');

    g.selectAll('.climate-hit-col')
      .data(rows)
      .enter()
      .append('rect')
      .attr('class', 'climate-hit-col')
      .attr('x', (d) => xScale(d.label) - (step - bandwidth) * 0.5)
      .attr('y', 0)
      .attr('width', step)
      .attr('height', chartHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('pointerenter pointermove', function(event, d) {
        const cx = cxFor(d);
        const cyVal = mode === 'overview'
          ? yLeftScale(d.avgTempC)
          : (mode === 'sunshine' ? yRightScale(d.humidityPct) : yLeftScale(d.seaTempC));

        hoverLine.attr('x1', cx).attr('x2', cx).style('opacity', 1);
        hoverDot.attr('cx', cx).attr('cy', cyVal).style('opacity', 1);

        const placeRight = cx <= chartWidth * 0.6;
        const leftPx = placeRight ? (margin.left + cx + 12) : (margin.left + cx - 12);
        const topPx = Math.max(46, Math.min(chartHeight + margin.top - 22, margin.top + cyVal));

        tooltip
          .property('hidden', false)
          .style('display', 'block')
          .style('left', `${leftPx}px`)
          .style('top', `${topPx}px`)
          .style('transform', placeRight ? 'translate(0, -50%)' : 'translate(-100%, -50%)')
          .html(`
            <div style="font-weight:700; margin-bottom:2px; color:#93c5fd;">${r.name} · ${d.label}</div>
            <div>평균 기온: <b>${d.avgTempC.toFixed(1)}°C</b> <span style="color:#cbd5e1;">(${d.minTempC.toFixed(1)}° ~ ${d.maxTempC.toFixed(1)}°C)</span></div>
            <div>강수량: <b>${d.precipMm.toFixed(1)} mm</b> · 습도: <b>${d.humidityPct}%</b></div>
            <div>일조: <b>${d.sunshineHrs} hr</b> · 수온: <b>${d.seaTempC.toFixed(1)}°C</b> · 풍속: <b>${d.windMs.toFixed(1)} m/s</b></div>
          `);
      })
      .on('pointerleave', function() {
        hoverLine.style('opacity', 0);
        hoverDot.style('opacity', 0);
        tooltip.property('hidden', true).style('display', 'none');
      })
      .on('click', function(event, d) {
        const parts = String(state.solarDate || '2026-11-10').split('-');
        const year = Number(parts[0]) || 2026;
        const origDay = Number(parts[2]) || 15;
        const maxDay = new Date(year, d.month, 0).getDate();
        const clampedDay = String(Math.min(origDay, maxDay)).padStart(2, '0');
        const mm = String(d.month).padStart(2, '0');
        commit(() => {
          state.solarDate = `${year}-${mm}-${clampedDay}`;
        });
        showToast(`${d.label} 태양·계절 조건으로 업데이트했어요.`);
      });
  }

  async function initScene() {
    if (!window.THREE || !THREE.OrbitControls) {
      throw new Error('Three.js 라이브러리를 불러오지 못했습니다.');
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xf0f6fb, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    canvasContainer.append(renderer.domElement);
    resize();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 8;
    controls.maxDistance = 420;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.enablePan = true;
    controls.addEventListener('start', () => { cameraFlyTarget = null; });

    // Warm sun key light and cool sky hemisphere fill
    ambientLight = new THREE.HemisphereLight(0xdcf0fb, 0x768780, 0.92);
    scene.add(ambientLight);
    sunLight = new THREE.DirectionalLight(0xfff8ee, 1.30);
    sunLight.position.set(-35, 85, 45);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -85;
    sunLight.shadow.camera.right = 85;
    sunLight.shadow.camera.top = 85;
    sunLight.shadow.camera.bottom = -85;
    sunLight.shadow.bias = -0.00015;
    scene.add(sunLight);

    // Moonlight for night lighting
    moonLight = new THREE.DirectionalLight(0x8dafd8, 0.0);
    moonLight.position.set(35, 70, -45);
    scene.add(moonLight);

    // Build night celestial dome starfield
    buildNightSkyStars();

    // Build 3D elevation profile pointer
    buildElevationPointer();

    // Build weather systems
    buildWeatherSystems();

    // Prepare initial region assets
    await prepareRegionAssets(currentRegionId);

    rebuildRegionScene();
    setView(viewMode);
    if (pendingSharedCamera && camera && controls) {
      camera.position.copy(pendingSharedCamera.pos);
      controls.target.copy(pendingSharedCamera.target);
      controls.update();
      pendingSharedCamera = null;
    }
    if (state.selectedId) {
      selectMarker(state.selectedId);
    }
    $('#loading').hidden = true;
    renderState();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStart;

    function raycastTerrainLatLng(clientX, clientY) {
      if (!terrain) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointer.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const terrainHit = raycaster.intersectObject(terrain, false)[0];
      if (!terrainHit) return null;
      const r = getRegion();
      const lat = r.bounds.north - (terrainHit.point.z / r.mapDepth + 0.5) * (r.bounds.north - r.bounds.south);
      const lng = r.bounds.west + (terrainHit.point.x / r.mapWidth + 0.5) * (r.bounds.east - r.bounds.west);
      return {
        lat: THREE.MathUtils.clamp(lat, r.bounds.south, r.bounds.north),
        lng: THREE.MathUtils.clamp(lng, r.bounds.west, r.bounds.east),
        point: terrainHit.point
      };
    }

    function finishTransectDrag() {
      if (!isDraggingTransect) return;
      isDraggingTransect = false;
      const helpers = window.TransectHelpers;
      const r = getRegion();
      const regionSpanKm = helpers
        ? helpers.haversineDistanceKm(r.bounds.south, r.bounds.west, r.bounds.north, r.bounds.east)
        : 50;
      const minStepKm = Math.max(0.06, regionSpanKm * 0.01);
      const simplified = helpers
        ? helpers.simplifyWaypoints(draftTransectWaypoints, minStepKm)
        : draftTransectWaypoints.slice();

      let totalDist = 0;
      if (helpers && simplified.length >= 2) {
        for (let i = 1; i < simplified.length; i++) {
          totalDist += helpers.haversineDistanceKm(simplified[i - 1].lat, simplified[i - 1].lng, simplified[i].lat, simplified[i].lng);
        }
      } else if (simplified.length >= 2) {
        totalDist = 1;
      }

      if (simplified.length >= 2 && totalDist > Math.max(0.05, regionSpanKm * 0.005)) {
        simplified[0].name = '출발점';
        simplified[simplified.length - 1].name = '도착점';
        setDrawingTransect(false);
        syncElevationFocusSample(null, '3d-drag-end');
        commit(() => {
          state.elevationProfileOpen = true;
          state.climateOverlayOpen = false;
          state.elevationTransectMode = 'custom-path';
          state.customTransect = simplified;
        });
        showToast('3D 지형 단면 경로를 생성했어요. 경로 또는 차트에 마우스를 올려 고도를 확인하세요.');
      } else {
        draftTransectWaypoints = [];
        syncElevationFocusSample(null, '3d-drag-end');
        updateElevationProfile();
        showToast('조금 더 길게 드래그하여 단면 경로를 그려주세요.');
      }
    }

    renderer.domElement.addEventListener('pointerdown', (event) => {
      pointerStart = { x: event.clientX, y: event.clientY };

      if (drawingTransect && event.button === 0) {
        const hit = raycastTerrainLatLng(event.clientX, event.clientY);
        if (hit) {
          event.preventDefault();
          isDraggingTransect = true;
          state.elevationTransectMode = 'custom-path';
          document.querySelectorAll('.elev-mode-btn').forEach((btn) => {
            btn.classList.toggle('is-active', btn.dataset.transect === 'custom-path');
          });
          draftTransectWaypoints = [{ lat: hit.lat, lng: hit.lng, name: '출발점' }];
          lastDragRenderTime = 0;
          const elevM = Math.max(0, heightAt(hit.lat, hit.lng));
          const pos = worldPosition(hit.lat, hit.lng);
          syncElevationFocusSample({
            index: 0,
            lat: hit.lat,
            lng: hit.lng,
            x: pos.x,
            z: pos.z,
            distanceKm: 0,
            elevationM: elevM,
            name: '출발점'
          }, '3d-drag');
        }
      }
    });

    renderer.domElement.addEventListener('pointermove', (event) => {
      if (drawingTransect && isDraggingTransect) {
        const hit = raycastTerrainLatLng(event.clientX, event.clientY);
        if (!hit) return;
        const helpers = window.TransectHelpers;
        const r = getRegion();
        const regionSpanKm = helpers
          ? helpers.haversineDistanceKm(r.bounds.south, r.bounds.west, r.bounds.north, r.bounds.east)
          : 50;
        const minStepKm = Math.max(0.06, regionSpanKm * 0.012);

        const prev = draftTransectWaypoints[draftTransectWaypoints.length - 1];
        const stepKm = helpers ? helpers.haversineDistanceKm(prev.lat, prev.lng, hit.lat, hit.lng) : 0.5;
        if (draftTransectWaypoints.length === 1) {
          if (stepKm > 0.01) {
            draftTransectWaypoints.push({ lat: hit.lat, lng: hit.lng, name: '도착점' });
          }
        } else if (stepKm >= minStepKm) {
          delete prev.name;
          draftTransectWaypoints.push({ lat: hit.lat, lng: hit.lng, name: '도착점' });
        } else {
          draftTransectWaypoints[draftTransectWaypoints.length - 1] = { lat: hit.lat, lng: hit.lng, name: '도착점' };
        }

        const now = performance.now();
        if (now - lastDragRenderTime >= 28 && draftTransectWaypoints.length >= 2) {
          lastDragRenderTime = now;
          updateElevationProfile(draftTransectWaypoints);
          if (activeTransectSamples.length > 0) {
            syncElevationFocusSample(activeTransectSamples[activeTransectSamples.length - 1], '3d-drag');
          }
        }
        return;
      }

      if (state.elevationProfileOpen && !drawingTransect && !pickingLocation && !droneMode && activeTransectSamples.length >= 2) {
        const hit = raycastTerrainLatLng(event.clientX, event.clientY);
        if (!hit || !window.TransectHelpers) {
          syncElevationFocusSample(null, '3d-hover');
          return;
        }
        const r = getRegion();
        const regionSpanKm = window.TransectHelpers.haversineDistanceKm(r.bounds.south, r.bounds.west, r.bounds.north, r.bounds.east);
        const snapped = window.TransectHelpers.nearestSampleByCoord(activeTransectSamples, hit.lat, hit.lng, Math.max(0.35, regionSpanKm * 0.055));
        if (snapped && snapped.sample) {
          syncElevationFocusSample(snapped.sample, '3d-hover');
        } else {
          syncElevationFocusSample(null, '3d-hover');
        }
      }
    });

    renderer.domElement.addEventListener('pointerleave', () => {
      if (state.elevationProfileOpen && !isDraggingTransect) {
        syncElevationFocusSample(null, '3d-hover');
      }
    });

    window.addEventListener('pointerup', () => {
      if (isDraggingTransect) {
        finishTransectDrag();
      }
    });

    renderer.domElement.addEventListener('pointerup', (event) => {
      if (drawingTransect) return;
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
            setLnbOpen(true, 'places');
            const nameInp = $('#custom-name');
            if (nameInp) {
              nameInp.dataset.autofilled = nameInp.value.trim() ? 'false' : 'true';
              nameInp.focus();
            }
            const statusEl = $('#reverse-pick-status');
            if (statusEl) {
              statusEl.hidden = false;
              statusEl.textContent = '선택한 좌표의 주소를 역지오코딩으로 확인 중...';
            }
            reverseGeocodeCoordinates(lat, lng, { updateSuggestions: true, updateCustomForm: true });
            showToast('위치를 골랐어요. 주변 주소 추천을 확인해 보세요.');
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
      if (!droneMode && cameraFlyTarget) {
        const alpha = 1 - Math.exp(-delta * 5.2);
        camera.position.lerp(cameraFlyTarget.pos, alpha);
        controls.target.lerp(cameraFlyTarget.target, alpha);
        if (camera.position.distanceTo(cameraFlyTarget.pos) < 0.08 &&
            controls.target.distanceTo(cameraFlyTarget.target) < 0.08) {
          camera.position.copy(cameraFlyTarget.pos);
          controls.target.copy(cameraFlyTarget.target);
          cameraFlyTarget = null;
        }
      }
      if (airportAnimPlane && airportFlightCurve) {
        airportFlightPhase = (airportFlightPhase + delta * 0.042) % 1;
        airportFlightCurve.getPointAt(airportFlightPhase, _planePos);
        airportFlightCurve.getPointAt((airportFlightPhase + 0.006) % 1, _planeNextPos);
        airportAnimPlane.position.copy(_planePos);
        airportAnimPlane.lookAt(_planeNextPos);
      }
      if (yeongamTrackCurve && yeongamAnimCars.length > 0) {
        for (let i = 0; i < yeongamAnimCars.length; i++) {
          const car = yeongamAnimCars[i];
          car.phase = (car.phase + delta * car.speed) % 1;
          yeongamTrackCurve.getPointAt(car.phase, _carPos);
          yeongamTrackCurve.getPointAt((car.phase + 0.008) % 1, _carNextPos);
          car.mesh.position.set(_carPos.x, _carPos.y + 0.06, _carPos.z);
          car.mesh.lookAt(_carNextPos.x, _carNextPos.y + 0.06, _carNextPos.z);
        }
      }
      if (!droneMode) controls.update();
      if (state.elevationProfileOpen && state.verticalSliceMode && activeSlicePlane) {
        updateActiveSlicePlaneForCamera();
      }
      updateLabels();
      updateWeather(delta, time);
      updateSolarLighting(delta);
      renderer.render(scene, camera);
    };
    animate();
  }

  window.generateShareUrl = generateShareUrl;
  window.openShareDialog = openShareDialog;
  window.closeShareDialog = closeShareDialog;
  window.shareCurrentView = shareCurrentView;
  window.focusOnMarker = focusOnMarker;
  window.updateClimateOverlay = updateClimateOverlay;

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
