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
      sidebarEyebrow: 'HERMANN TILKE 5.615KM · FIA GRADE 1',
      sidebarTitle: '영암 코리아 인터내셔널 서킷을<br>리얼 3D로 질주하세요.',
      sidebarDesc: '5.615km 18개 코너의 F1·GT 그랑프리 트랙과 상징적인 한옥 기와육교, 1.2km 백스트레이트, 영암호 요트 마리나, 월출산 화강암 능선까지 정밀하게 구현했습니다.',
      viewerTitle: 'Korea International Circuit · Yeongam',
      viewerSub: '전라남도 영암군 삼호읍 · FIA Grade-1 5.615km',
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
    },
    danyang: {
      id: 'danyang',
      name: '충주·단양',
      subTitle: '충주댐·단양팔경',
      brandTitle: 'DANYANG · CHUNGJU',
      brandSub: '충주댐·충주호·단양팔경 3D 지도',
      brandMark: 'D',
      brandColor: '#0d8a72',
      storageKey: 'danyang-studio-plan-v1',
      sidebarEyebrow: 'CHUNGJUHO LAKE & DANYANG 8 VIEWS',
      sidebarTitle: '충주댐과 충주호,<br>단양팔경을 입체 탐험하세요.',
      sidebarDesc: '국내 최대 콘크리트 중력식 충주댐과 푸른 청풍호반, 도담삼봉·구담봉·옥순봉·사인암·선암계곡까지 남한강 협곡 명소를 3D로 조망해 보세요.',
      viewerTitle: 'Chungjuho & Danyang 8 Views',
      viewerSub: '충청북도 충주·단양 · 북위 36.96°',
      summaryTitle: '나만의 충주·단양 지도',
      bounds: { west: 127.940, south: 36.835, east: 128.500, north: 37.065 },
      mapWidth: 112,
      mapDepth: 62,
      heightFactor: 0.0115,
      droneAltitudeMeters: 110,
      oceanBox: [116, 0.8, 66],
      oceanRimBox: [118, 0.5, 68],
      lightPos: [-34, 86, 46],
      defaultCamDistance: 168,
      customDefaults: { latMin: 36.835, latMax: 37.065, latPlaceholder: '36.9916', lngMin: 127.940, lngMax: 128.500, lngPlaceholder: '128.3432' },
      presets: window.DANYANG_PRESETS || []
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

  // Incheon Bridge, Airport, Landmarks, Busan Haeundae Landmarks, Gangneung Landmarks, Yeongam Circuit & Night Stars
  let incheonBridgeGroup = null;
  let incheonAirportGroup = null;
  let incheonLandmarksGroup = null;
  let haeundaeLandmarksGroup = null;
  let gangneungLandmarksGroup = null;
  let yeongamCircuitGroup = null;
  let yeongamTrackCurve = null;
  let yeongamAnimCars = [];
  let yeongamEmissiveMaterials = [];
  let yeongamCircuitTextures = [];
  let danyangLandmarksGroup = null;
  let danyangWaterAccentsGroup = null;
  let regionalEmissiveMaterials = [];
  let isSoftwareGl = false;
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
    if (currentRegionId === 'danyang') return window.DANYANG_OUTLINE;
    return [];
  }

  function getOceanSurfaceY() {
    if (currentRegionId === 'haeundae') return -0.40;
    if (currentRegionId === 'incheon') return -0.58;
    if (currentRegionId === 'yeongam') return -0.34;
    return -1.50;
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
    } else if (currentRegionId === 'danyang') {
      return Array.isArray(window.DANYANG_ROADS) ? window.DANYANG_ROADS.map((road) => ({
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
    if (currentRegionId === 'danyang' && typeof window.inDanyangLand === 'function') {
      return window.inDanyangLand(lng, lat);
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
    const samplePx = (currentRegionId === 'danyang' || currentRegionId === 'yeongam')
      ? (row, col) => {
          const idx = index(row, col);
          return pixels[idx] + pixels[idx + 1] / 255;
        }
      : (row, col) => pixels[index(row, col)];
    const h00 = samplePx(y0, x0);
    const h10 = samplePx(y0, x0 + 1);
    const h01 = samplePx(y0 + 1, x0);
    const h11 = samplePx(y0 + 1, x0 + 1);
    const maxMeters = currentRegionId === 'jeju'
      ? 2000
      : (currentRegionId === 'haeundae'
        ? 650
        : (currentRegionId === 'gangneung'
          ? 1800
          : (currentRegionId === 'danyang'
            ? 1500
            : (currentRegionId === 'yeongam' ? 850 : 300))));
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
    syncCircuitInfoCard();

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
      if (ocean) ocean.visible = currentRegionId === 'danyang' ? false : state.showOcean;
      if (danyangWaterAccentsGroup) danyangWaterAccentsGroup.visible = state.showOcean;
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
    let dx = isAirport ? 6.2 : 14;
    let dy = isAirport ? 5.6 : 13;
    let dz = isAirport ? 8.4 : 17;

    if (currentRegionId === 'danyang') {
      if (id === 'chungju_dam') {
        // Look up the WNW Namhangang tailrace straight at Chungju Dam's concrete spillway & lake behind it
        dx = -7.2;
        dy = 5.4;
        dz = -3.4;
      } else if (id === 'dodamsambong') {
        // Look across the wide Namhangang S-bend basin directly toward the 3 karst peaks & Seokmun
        dx = 5.4;
        dy = 4.6;
        dz = 3.8;
      } else if (id === 'gudam_oksun') {
        // Look along the Chungjuho narrows framing Oksun Bridge, Oksunbong spires, and Gudambong
        dx = -5.2;
        dy = 5.2;
        dz = 4.6;
      } else if (id === 'mancheonha') {
        dx = 4.8;
        dy = 4.8;
        dz = -5.2;
      } else {
        dx = 8.5;
        dy = 7.8;
        dz = 9.5;
      }
    } else if (currentRegionId === 'yeongam') {
      if (id === 'kic_grandstand') {
        // Trackside stadium view looking NE along the Main Straight framing Control Tower, Start Gantry, Wave Grandstand, Pit Garages & Hanok Overpass
        dx = -6.4;
        dy = 4.1;
        dz = 5.8;
      } else if (id === 'kic_paddock') {
        // Frame 24-bay Pit Building, Paddock Transporters, Race Control Tower & Main Grandstand across the straight
        dx = 5.2;
        dy = 3.8;
        dz = 5.6;
      } else if (id === 'kic_marina') {
        // Position camera SW over Yeongamho Yacht Basin looking NE across superyachts directly into Marina Turns 12-14 & Stadium
        dx = -7.2;
        dy = 4.6;
        dz = 7.6;
      } else if (id === 'samho_marina') {
        dx = -4.6;
        dy = 3.6;
        dz = 6.2;
      } else if (id === 'kic_turn3') {
        // Frame heavy-braking Turn 3 Hairpin, smooth FIA blue/red runoff, gravel trap & 1.2km Back Straight toward Wolchulsan
        dx = -5.4;
        dy = 3.9;
        dz = 4.8;
      } else if (id === 'kic_kart') {
        dx = -4.2;
        dy = 3.4;
        dz = 4.8;
      } else {
        dx = 9.5;
        dy = 8.2;
        dz = 11.0;
      }
    }

    // Ensure camera sightline never hides behind an intervening mountain ridge
    const camX = x + dx;
    const camZ = z + dz;
    const camGroundY = surfaceHeightAtWorld(camX, camZ);
    const midGroundY1 = surfaceHeightAtWorld(x + dx * 0.45, z + dz * 0.45);
    const midGroundY2 = surfaceHeightAtWorld(x + dx * 0.75, z + dz * 0.75);
    const minClearance = currentRegionId === 'yeongam' ? 2.1 : 2.8;
    const safeCamY = Math.max(
      y + dy,
      camGroundY + minClearance + 0.4,
      midGroundY1 + minClearance,
      midGroundY2 + minClearance + 0.2
    );

    cameraFlyTarget = {
      target: new THREE.Vector3(x, y + (isAirport || currentRegionId === 'danyang' || currentRegionId === 'yeongam' ? 0.42 : 0.8), z),
      pos: new THREE.Vector3(camX, safeCamY, camZ)
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
      // Frame Yeongam KIC 5.615km circuit, Hanok bridges, Grandstand & Marina yacht harbor in foreground with Wolchulsan granite peaks behind
      controls.target.set(-16.5, 0.35, 9.2);
      camera.position.set(-45.5, 23.5, 44.5);
    } else if (currentRegionId === 'danyang') {
      // Frame Chungju Dam on the west, Chungjuho / Oksun Bridge in center, Dodamsambong & Sobaeksan rising on the east
      controls.target.set(2, -5.5, -2);
      camera.position.set(-14, 46, 78);
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
    syncCircuitInfoCard();
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
    if (kicker) {
      const kickerMap = {
        jeju: 'EXPLORE JEJU',
        haeundae: 'EXPLORE HAEUNDAE',
        incheon: 'EXPLORE INCHEON',
        gangneung: 'EXPLORE GANGNEUNG',
        yeongam: 'EXPLORE YEONGAM',
        danyang: 'EXPLORE DANYANG & CHUNGJU'
      };
      kicker.textContent = kickerMap[r.id] || 'EXPLORE MAP';
    }
    const styleLead = $('#panel-lead-style');
    if (styleLead) {
      const styleMap = {
        jeju: '한라산의 높낮이와 해안선을 원하는 방식으로 살펴보세요.',
        haeundae: '장산과 동백섬, 해안선의 높낮이를 원하는 방식으로 살펴보세요.',
        incheon: '영종도 백운산과 송도, 인천대교의 높낮이를 살펴보세요.',
        gangneung: '경포호와 동해 해안, 멀리 설악산 대청봉 능선의 고도를 살펴보세요.',
        yeongam: '코리아 인터내셔널 서킷 평지와 은적산·월출산 산악 배경의 높낮이를 살펴보세요.',
        danyang: '충주댐 수위차와 청풍호·단양팔경 협곡, 소백산·월악산 능선 고도를 살펴보세요.'
      };
      styleLead.textContent = styleMap[r.id] || styleMap.jeju;
    }
    const customName = $('#custom-name');
    if (customName) {
      const placeholderMap = {
        jeju: '예: 나만의 제주 장소',
        haeundae: '예: 나만의 해운대 장소',
        incheon: '예: 나만의 인천 장소',
        gangneung: '예: 나만의 강릉·설악 장소',
        yeongam: '예: 나만의 영암 서킷 포인트',
        danyang: '예: 나만의 충주호·단양 전망 포인트'
      };
      customName.placeholder = placeholderMap[r.id] || '예: 나만의 장소';
    }
    const oceanToggleRow = $('#toggle-ocean')?.closest('.toggle-row');
    if (oceanToggleRow) {
      const titleEl = oceanToggleRow.querySelector('strong');
      const subEl = oceanToggleRow.querySelector('small');
      if (titleEl) titleEl.textContent = r.id === 'danyang' ? '충주호·남한강 수면 효과' : '바다 표시';
      if (subEl) subEl.textContent = r.id === 'danyang' ? '여수로 물보라·유람선 물결 표시' : '섬 주변의 푸른 배경';
    }

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
    syncCircuitInfoCard();
  }

  let circuitCardPopulated = false;
  let circuitCardCollapsed = typeof window !== 'undefined' ? window.innerWidth <= 760 : false;
  let circuitCardTab = 'specs';
  let activeCircuitSectorId = null;

  function renderYeongamCircuitMiniSvg(svgEl) {
    if (!svgEl) return;
    const pts = window.YEONGAM_CIRCUIT_TRACK;
    if (!Array.isArray(pts) || pts.length < 4) return;

    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const [lat, lng] of pts) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }
    const padX = 14;
    const padY = 12;
    const w = 180;
    const h = 96;
    const spanLng = Math.max(0.0001, (maxLng - minLng) * Math.cos(34.737 * Math.PI / 180));
    const spanLat = Math.max(0.0001, maxLat - minLat);
    const scale = Math.min((w - padX * 2) / spanLng, (h - padY * 2) / spanLat);
    const drawnW = spanLng * scale;
    const drawnH = spanLat * scale;
    const offX = (w - drawnW) * 0.5;
    const offY = (h - drawnH) * 0.5;

    const project = ([lat, lng]) => [
      offX + (lng - minLng) * Math.cos(34.737 * Math.PI / 180) * scale,
      offY + (maxLat - lat) * scale
    ];

    const gpPath = pts
      .map((p, idx) => {
        const [x, y] = project(p);
        return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z';

    const shortPts = Array.isArray(window.YEONGAM_SHORT_CONNECTOR) ? window.YEONGAM_SHORT_CONNECTOR : [];
    const shortPath = shortPts.length >= 2
      ? shortPts
          .map((p, idx) => {
            const [x, y] = project(p);
            return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' ')
      : '';

    const [sfX, sfY] = project(pts[1]);
    const [t3X, t3Y] = project([34.7427, 126.4042]);
    const [marX, marY] = project([34.7310, 126.4222]);

    svgEl.innerHTML = [
      shortPath
        ? `<path d="${shortPath}" fill="none" stroke="rgba(100,116,139,0.55)" stroke-width="2" stroke-dasharray="3 2.5" stroke-linecap="round"/>`
        : '',
      `<path d="${gpPath}" fill="none" stroke="rgba(15,23,42,0.16)" stroke-width="6.5" stroke-linejoin="round" stroke-linecap="round"/>`,
      `<path d="${gpPath}" fill="none" stroke="#c81e1e" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`,
      `<circle cx="${sfX.toFixed(1)}" cy="${sfY.toFixed(1)}" r="3.6" fill="#0f172a" stroke="#ffffff" stroke-width="1.4"/>`,
      `<circle cx="${t3X.toFixed(1)}" cy="${t3Y.toFixed(1)}" r="2.4" fill="#1769c1"/>`,
      `<circle cx="${marX.toFixed(1)}" cy="${marY.toFixed(1)}" r="2.4" fill="#0d9488"/>`,
      `<text x="${(sfX + 5).toFixed(1)}" y="${(sfY + 10).toFixed(1)}" font-size="7.5" font-weight="800" fill="#475569">S/F</text>`,
      `<text x="${(t3X - 5).toFixed(1)}" y="${(t3Y - 5).toFixed(1)}" font-size="7" font-weight="800" fill="#1769c1">T3</text>`,
      `<text x="${(marX - 20).toFixed(1)}" y="${(marY + 11).toFixed(1)}" font-size="7" font-weight="800" fill="#0d9488">MARINA</text>`
    ].join('');
  }

  function focusCircuitSector(sector) {
    if (!sector || currentRegionId !== 'yeongam' || !camera || !controls) return;
    activeCircuitSectorId = sector.id;
    const noteEl = $('#circuit-sector-note');
    if (noteEl && sector.note) noteEl.textContent = sector.note;
    document.querySelectorAll('.circuit-sector-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.sectorId === sector.id);
    });

    if (sector.markerId && markerById(sector.markerId)) {
      focusOnMarker(sector.markerId);
      return;
    }
    if (droneMode) setDroneMode(false);
    viewMode = 'perspective';
    camera.up.set(0, 1, 0);
    const { x, z } = worldPosition(sector.lat, sector.lng);
    const y = surfaceHeight(sector.lat, sector.lng);
    const offsets = {
      kic_grandstand: [-6.4, 4.1, 5.8],
      kic_turn3: [-5.4, 3.9, 4.8],
      kic_marina: [-7.2, 4.6, 7.6]
    };
    const [dx, dy, dz] = offsets[sector.markerId] || [-5.8, 4.2, 5.6];
    const camX = x + dx;
    const camZ = z + dz;
    const camGroundY = surfaceHeightAtWorld(camX, camZ);
    const safeCamY = Math.max(y + dy, camGroundY + 2.5);
    cameraFlyTarget = {
      target: new THREE.Vector3(x, y + 0.42, z),
      pos: new THREE.Vector3(camX, safeCamY, camZ)
    };
    document.querySelectorAll('[data-action="perspective"], [data-action="top"]').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.action === 'perspective');
    });
  }

  function populateYeongamCircuitInfoCard() {
    if (circuitCardPopulated) return;
    const info = window.YEONGAM_CIRCUIT_INFO;
    if (!info) return;

    const kickerEl = $('#circuit-card-kicker');
    if (kickerEl) kickerEl.textContent = `${info.grade} · ${info.lengthKm.toFixed(3)} km · ${info.turns} Turns`;
    const titleEl = $('#circuit-card-title');
    if (titleEl) titleEl.textContent = info.nameKo;
    const designerEl = $('#circuit-meta-designer');
    if (designerEl) designerEl.textContent = info.designer;
    const dirEl = $('#circuit-meta-direction');
    if (dirEl) dirEl.textContent = info.direction;
    const eraEl = $('#circuit-meta-era');
    if (eraEl) eraEl.textContent = '2010–2013 (4회 개최)';

    renderYeongamCircuitMiniSvg($('#circuit-mini-svg'));

    const statsGrid = $('#circuit-stats-grid');
    if (statsGrid && Array.isArray(info.stats)) {
      statsGrid.innerHTML = '';
      for (const stat of info.stats) {
        const cell = document.createElement('div');
        cell.className = 'circuit-stat-cell';
        const dt = document.createElement('dt');
        dt.textContent = stat.label;
        const dd = document.createElement('dd');
        const val = document.createElement('span');
        val.className = 'circuit-stat-value';
        val.textContent = stat.value;
        const detail = document.createElement('span');
        detail.className = 'circuit-stat-detail';
        detail.textContent = stat.detail;
        dd.append(val, detail);
        cell.append(dt, dd);
        statsGrid.append(cell);
      }
    }

    const sectorsRow = $('#circuit-sectors-row');
    if (sectorsRow && Array.isArray(info.sectors)) {
      sectorsRow.innerHTML = '';
      for (const sector of info.sectors) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'circuit-sector-btn';
        btn.dataset.sectorId = sector.id;
        btn.title = sector.note;
        const code = document.createElement('span');
        code.className = 'circuit-sector-code';
        code.textContent = sector.code;
        const name = document.createElement('span');
        name.className = 'circuit-sector-name';
        name.textContent = sector.label;
        btn.append(code, name);
        btn.addEventListener('click', () => focusCircuitSector(sector));
        sectorsRow.append(btn);
      }
    }

    const historySummary = $('#circuit-history-summary');
    if (historySummary && info.history) historySummary.textContent = info.history.summary;

    const historyList = $('#circuit-history-list');
    if (historyList && info.history && Array.isArray(info.history.highlights)) {
      historyList.innerHTML = '';
      for (const item of info.history.highlights) {
        const li = document.createElement('li');
        li.className = 'circuit-history-item';
        const period = document.createElement('span');
        period.className = 'circuit-history-period';
        period.textContent = item.period;
        const heading = document.createElement('strong');
        heading.textContent = item.title;
        const body = document.createElement('p');
        body.textContent = item.body;
        li.append(period, heading, body);
        historyList.append(li);
      }
    }

    const winnersList = $('#circuit-winners-list');
    if (winnersList && info.history && Array.isArray(info.history.winners)) {
      winnersList.innerHTML = '';
      for (const w of info.history.winners) {
        const row = document.createElement('div');
        row.className = 'circuit-winner-row';
        const yr = document.createElement('span');
        yr.className = 'circuit-winner-year';
        yr.textContent = String(w.year);
        const drv = document.createElement('span');
        drv.className = 'circuit-winner-driver';
        drv.textContent = w.driver;
        const tm = document.createElement('span');
        tm.className = 'circuit-winner-team';
        tm.textContent = w.team;
        row.append(yr, drv, tm);
        winnersList.append(row);
      }
    }

    circuitCardPopulated = true;
  }

  function setCircuitInfoTab(tab) {
    circuitCardTab = tab === 'history' ? 'history' : 'specs';
    const card = $('#circuit-info-card');
    if (card) card.dataset.tab = circuitCardTab;
    document.querySelectorAll('.circuit-tab-btn').forEach((btn) => {
      const active = btn.dataset.circuitTab === circuitCardTab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    const specsPanel = $('#circuit-panel-specs');
    const historyPanel = $('#circuit-panel-history');
    if (specsPanel) specsPanel.hidden = circuitCardTab !== 'specs';
    if (historyPanel) historyPanel.hidden = circuitCardTab !== 'history';
  }

  function syncCircuitInfoCard() {
    const card = $('#circuit-info-card');
    if (!card) return;
    const shouldShow =
      currentRegionId === 'yeongam' &&
      !droneMode &&
      !state.elevationProfileOpen &&
      !state.climateOverlayOpen;
    card.hidden = !shouldShow;
    if (!shouldShow) return;

    populateYeongamCircuitInfoCard();
    card.classList.toggle('is-collapsed', circuitCardCollapsed);
    const body = $('#circuit-card-body');
    if (body) body.hidden = circuitCardCollapsed;
    const toggleBtn = $('#circuit-card-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(!circuitCardCollapsed));
      toggleBtn.textContent = circuitCardCollapsed ? '펼치기' : '접기';
    }
    setCircuitInfoTab(circuitCardTab);
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
    const circuitToggle = $('#circuit-card-toggle');
    if (circuitToggle) {
      circuitToggle.addEventListener('click', () => {
        circuitCardCollapsed = !circuitCardCollapsed;
        syncCircuitInfoCard();
      });
    }
    document.querySelectorAll('.circuit-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (circuitCardCollapsed) circuitCardCollapsed = false;
        setCircuitInfoTab(btn.dataset.circuitTab);
        syncCircuitInfoCard();
      });
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
    } else if (regionId === 'danyang') {
      if (typeof window.createDanyangAssets !== 'function') {
        throw new Error('충주댐·단양팔경 3D 에셋 생성기를 찾을 수 없습니다.');
      }
      const { heightCanvas, naturalCanvas, elevationCanvas, normalCanvas, roughnessCanvas } = window.createDanyangAssets();
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

      regionCaches.danyang = {
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
    if (baseMesh) {
      disposeObject(baseMesh);
      baseMesh = null;
    }
    if (shoreline) {
      disposeObject(shoreline);
      shoreline = null;
    }

    const outline = getOutline();
    if (!outline || !outline.length) return;

    const shape = new THREE.Shape();
    outline.forEach(([lng, lat], index) => {
      const { x, z } = worldPosition(lat, lng);
      if (index === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    });
    shape.closePath();

    const baseDepth = currentRegionId === 'haeundae'
      ? 0.52
      : (currentRegionId === 'yeongam'
        ? 0.50
        : (currentRegionId === 'danyang'
          ? 0.68
          : (currentRegionId === 'incheon' ? 0.72 : 1.45)));
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: baseDepth, bevelEnabled: false, steps: 1 });
    geometry.rotateX(Math.PI / 2);
    const isCoastalUrban = currentRegionId === 'haeundae' || currentRegionId === 'incheon' || currentRegionId === 'yeongam';
    const sideColor = currentRegionId === 'danyang'
      ? 0x252e31
      : (isCoastalUrban ? 0x262d2c : 0x363a38);
    const topColor = currentRegionId === 'danyang'
      ? 0x313c40
      : (isCoastalUrban ? 0x323b39 : 0x48504c);
    baseMesh = new THREE.Mesh(geometry, [
      new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.9, metalness: 0.05 }), // geological plinth cliff
      new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.85, metalness: 0.05 })
    ]);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    scene.add(baseMesh);

    if (currentRegionId === 'danyang') {
      return; // Inland mountain-lake block has no outer sea surf line
    }

    const shoreOutline = currentRegionId === 'gangneung'
      ? outline.slice(0, 21)
      : (currentRegionId === 'haeundae'
          ? outline.slice(0, 32)
          : (currentRegionId === 'incheon'
              ? outline.slice(0, 15)
              : (currentRegionId === 'yeongam'
                  ? outline.slice(13).concat(outline.slice(1, 10))
                  : outline)));
    const isOpenCoast = currentRegionId === 'gangneung' || currentRegionId === 'haeundae' || currentRegionId === 'incheon' || currentRegionId === 'yeongam';
    const points = shoreOutline.map(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      return new THREE.Vector3(x, 0.09, z);
    });
    shoreline = isOpenCoast
      ? new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: 0xf5fbfb, transparent: true, opacity: 0.80 })
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
    if (currentRegionId === 'haeundae') buildHaeundaeLandmarks();
    if (currentRegionId === 'incheon') {
      buildIncheonBridge();
      buildIncheonAirport();
      buildIncheonLandmarks();
    }
    if (currentRegionId === 'gangneung') buildGangneungLandmarks();
    if (currentRegionId === 'yeongam') buildYeongamCircuit();
    if (currentRegionId === 'danyang') buildDanyangLandmarks();
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
    const oceanSurfY = getOceanSurfaceY();
    ocean.position.y = oceanSurfY - (r.oceanBox[1] * 0.5);
    ocean.receiveShadow = true;
    scene.add(ocean);

    oceanRim = new THREE.Mesh(
      new THREE.BoxGeometry(r.oceanRimBox[0], r.oceanRimBox[1], r.oceanRimBox[2]),
      new THREE.MeshStandardMaterial({ color: 0x226b9c, roughness: 0.45, metalness: 0.08 })
    );
    oceanRim.position.y = -0.85;
    ocean.add(oceanRim);
    ocean.visible = currentRegionId === 'danyang' ? false : state.showOcean;

    buildIslandBase();
    buildTerrain();
    buildRoads();
    regionalEmissiveMaterials = [];
    buildHaeundaeLandmarks();
    buildIncheonBridge();
    buildIncheonAirport();
    buildIncheonLandmarks();
    buildGangneungLandmarks();
    buildYeongamCircuit();
    buildDanyangLandmarks();
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

    const oceanY = getOceanSurfaceY();

    // Incheon Grand Bridge route coordinates spanning sea cleanly from Songdo to Yeongjongdo shore
    const bridgeWaypoints = [
      [126.6150, 37.3750],
      [126.5950, 37.3900],
      [126.5780, 37.4050],
      [126.5680, 37.4140], // Main cable-stayed navigation span
      [126.5450, 37.4260],
      [126.5180, 37.4230],
      [126.4920, 37.4280],
      [126.4750, 37.4410]  // Yeongjongdo south seawall landing
    ];

    // Bridge deck curved viaduct
    const deckPoints = bridgeWaypoints.map(([lng, lat], idx) => {
      const { x, z } = worldPosition(lat, lng);
      const isEnd = idx === 0 || idx === bridgeWaypoints.length - 1;
      const isMainSpan = Math.abs(lat - 37.4140) < 0.015;
      const groundY = Math.max(0.18, surfaceHeight(lat, lng) + 0.16);
      const y = isEnd ? Math.max(0.75, groundY) : (isMainSpan ? 2.05 : 1.25);
      return new THREE.Vector3(x, y, z);
    });

    const bridgeCurve = new THREE.CatmullRomCurve3(deckPoints);
    const bridgeTubeGeo = new THREE.TubeGeometry(bridgeCurve, 72, 0.34, 6, false);
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
    const roadPoints = bridgeCurve.getPoints(96);
    const roadLineGeo = new THREE.BufferGeometry().setFromPoints(roadPoints.map(p => new THREE.Vector3(p.x, p.y + 0.22, p.z)));
    const roadLineMat = new THREE.LineBasicMaterial({ color: 0x334155, linewidth: 2 });
    const roadLine = new THREE.Line(roadLineGeo, roadLineMat);
    incheonBridgeGroup.add(roadLine);

    // Iconic Incheon Bridge Twin Inverted-Y Diamond Cable-Stayed Pylons (238m proportional scale)
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
      opacity: 0.78
    });

    towerCoords.forEach(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      const towerGroup = new THREE.Group();
      towerGroup.position.set(x, 0, z);

      // Inverted-Y diamond legs
      const legGeo = new THREE.CylinderGeometry(0.15, 0.28, 5.2, 8);
      const leftLeg = new THREE.Mesh(legGeo, towerMat);
      leftLeg.position.set(-0.46, 2.35, 0);
      leftLeg.rotation.z = -0.085;
      leftLeg.castShadow = true;
      towerGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, towerMat);
      rightLeg.position.set(0.46, 2.35, 0);
      rightLeg.rotation.z = 0.085;
      rightLeg.castShadow = true;
      towerGroup.add(rightLeg);

      // Upper single diamond tower mast
      const topMastGeo = new THREE.CylinderGeometry(0.09, 0.20, 2.7, 8);
      const topMast = new THREE.Mesh(topMastGeo, towerMat);
      topMast.position.set(0, 6.2, 0);
      topMast.castShadow = true;
      towerGroup.add(topMast);

      // Red aircraft warning beacon light atop pylon
      const beaconGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, 7.62, 0);
      towerGroup.add(beacon);

      // Stay cables radiating down to deck
      const cablePts = [];
      const cableCount = 8;
      for (let c = 0; c < cableCount; c++) {
        const topY = 4.65 + (c / cableCount) * 2.75;
        const dist = 1.9 + c * 1.45;
        // Fore stays
        cablePts.push(new THREE.Vector3(x, topY, z));
        cablePts.push(new THREE.Vector3(x - dist * 0.72, 2.05, z - dist * 0.72));
        // Aft stays
        cablePts.push(new THREE.Vector3(x, topY, z));
        cablePts.push(new THREE.Vector3(x + dist * 0.72, 2.05, z + dist * 0.72));
      }
      const cableGeo = new THREE.BufferGeometry().setFromPoints(cablePts);
      const cableLines = new THREE.LineSegments(cableGeo, cableMat);
      incheonBridgeGroup.add(cableLines);

      // Pier foundation in ocean
      const pierGeo = new THREE.BoxGeometry(1.5, 1.8, 1.5);
      const pierMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
      const pier = new THREE.Mesh(pierGeo, pierMat);
      pier.position.set(0, oceanY + 0.45, 0);
      pier.castShadow = true;
      towerGroup.add(pier);

      incheonBridgeGroup.add(towerGroup);
    });

    // Viaduct support piers along the route
    const viaductPierMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    for (let i = 1; i < deckPoints.length - 1; i++) {
      const p = deckPoints[i];
      const pierH = Math.max(0.6, p.y - oceanY + 0.2);
      const pierGeo = new THREE.CylinderGeometry(0.20, 0.28, pierH, 8);
      const pierMesh = new THREE.Mesh(pierGeo, viaductPierMat);
      pierMesh.position.set(p.x, oceanY + pierH * 0.5 - 0.1, p.z);
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
    if (yeongamCircuitTextures.length > 0) {
      yeongamCircuitTextures.forEach((t) => t && t.dispose && t.dispose());
      yeongamCircuitTextures = [];
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

    const maxAniso = renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
    function makeCanvasTex(width, height, drawFn, repeatX = 1, repeatY = 1) {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      const ctx = c.getContext('2d');
      drawFn(ctx, width, height);
      const tex = new THREE.CanvasTexture(c);
      if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = maxAniso;
      if (repeatX !== 1 || repeatY !== 1) {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
      }
      tex.needsUpdate = true;
      yeongamCircuitTextures.push(tex);
      return tex;
    }

    // -------------------------------------------------------------------------
    // 0. Procedural High-Resolution Motorsport Architectural Textures (Zero 404s)
    // -------------------------------------------------------------------------
    const seatingTex = makeCanvasTex(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#cfd8e3';
      ctx.fillRect(0, 0, w, h);
      const rows = 16;
      const rowH = h / rows;
      for (let r = 0; r < rows; r++) {
        const y = r * rowH;
        // Concrete step riser shadow
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, y, w, rowH * 0.28);
        // Individual stadium seats in Taegeuk / KIC mosaic bands
        const bandColor = r < 5 ? '#1d4ed8' : (r < 10 ? '#e2e8f0' : '#dc2626');
        const accentColor = r < 5 ? '#2563eb' : (r < 10 ? '#cbd5e1' : '#b91c1c');
        for (let col = 0; col < 32; col++) {
          // Vertical concrete stair aisles
          if (col === 7 || col === 8 || col === 23 || col === 24) {
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(col * 8, y + rowH * 0.25, 8, rowH * 0.75);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(col * 8, y + rowH * 0.85, 8, 1.5);
            continue;
          }
          ctx.fillStyle = ((col + r * 3) % 5 === 0) ? accentColor : bandColor;
          ctx.fillRect(col * 8 + 1, y + rowH * 0.30, 6, rowH * 0.60);
        }
      }
    }, 3, 1);

    const pitFacadeTex = makeCanvasTex(512, 128, (ctx, w, h) => {
      ctx.fillStyle = '#dde4ec';
      ctx.fillRect(0, 0, w, h);
      // Red/cobalt FIA header band
      ctx.fillStyle = '#c81e1e';
      ctx.fillRect(0, 0, w, 16);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 16, w, 7);
      const bays = 16;
      const bayW = w / bays;
      for (let i = 0; i < bays; i++) {
        const x = i * bayW;
        // Concrete structural pier
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x, 23, 4, h - 23);
        // Recessed dark garage opening with warm interior work light strip
        ctx.fillStyle = '#141c28';
        ctx.fillRect(x + 4, 30, bayW - 6, h - 32);
        // Glowing fluorescent work light strip inside ceiling of garage
        const grad = ctx.createLinearGradient(0, 30, 0, 74);
        grad.addColorStop(0, '#fef3c7');
        grad.addColorStop(0.25, '#334155');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(x + 6, 32, bayW - 10, 40);
        // Garage bay number plaque
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x + bayW * 0.32, 23, bayW * 0.36, 7);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 6px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(i + 1).padStart(2, '0'), x + bayW * 0.5, 29);
      }
    }, 1, 1);

    const giwaTileTex = makeCanvasTex(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#252d38';
      ctx.fillRect(0, 0, w, h);
      // Fluted traditional Korean roof tile ribs (암키와 / 수키와)
      for (let x = 0; x < w; x += 16) {
        const g = ctx.createLinearGradient(x, 0, x + 16, 0);
        g.addColorStop(0, '#161b22');
        g.addColorStop(0.35, '#3b4656');
        g.addColorStop(0.55, '#475569');
        g.addColorStop(1, '#181e27');
        ctx.fillStyle = g;
        ctx.fillRect(x, 0, 16, h);
      }
      // Horizontal overlapping tile rows
      for (let y = 0; y < h; y += 24) {
        ctx.fillStyle = 'rgba(10, 14, 20, 0.45)';
        ctx.fillRect(0, y, w, 3);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.14)';
        ctx.fillRect(0, y + 3, w, 2);
      }
    }, 3, 2);

    const dancheongTex = makeCanvasTex(256, 64, (ctx, w, h) => {
      ctx.fillStyle = '#19543e'; // Traditional Korean celadon green base
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#991b1b'; // Crimson beam band
      ctx.fillRect(0, 0, w, 14);
      ctx.fillRect(0, h - 12, w, 12);
      ctx.fillStyle = '#f59e0b'; // Gold accent line
      ctx.fillRect(0, 14, w, 4);
      ctx.fillRect(0, h - 16, w, 4);
      // Repeating lotus / geometric Dancheong medallions
      for (let x = 16; x < w; x += 32) {
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.arc(x, h * 0.5, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x, h * 0.5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(x, h * 0.5, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }, 3, 1);

    const gantryBannerTex = makeCanvasTex(512, 96, (ctx, w, h) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, w, 14);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(0, h - 12, w, 12);
      // Checkered racing flags on left & right ends
      for (let side of [10, w - 58]) {
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#f8fafc' : '#1e293b';
            ctx.fillRect(side + c * 12, 22 + r * 12, 12, 12);
          }
        }
      }
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KOREA INTERNATIONAL CIRCUIT', w * 0.5, 53);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('YEONGAM  ·  FIA GRADE 1  ·  5.615 KM', w * 0.5, 76);
    });

    const checkeredTex = makeCanvasTex(128, 512, (ctx, w, h) => {
      const sq = 16;
      for (let y = 0; y < h; y += sq) {
        for (let x = 0; x < w; x += sq) {
          ctx.fillStyle = ((x / sq + y / sq) % 2 === 0) ? '#f8fafc' : '#111827';
          ctx.fillRect(x, y, sq, sq);
        }
      }
    });

    const sponsorWallTex = makeCanvasTex(512, 64, (ctx, w, h) => {
      const panels = [
        { bg: '#dc2626', fg: '#ffffff', txt: 'KIC YEONGAM' },
        { bg: '#0f172a', fg: '#facc15', txt: 'FIA GRADE 1' },
        { bg: '#1d4ed8', fg: '#ffffff', txt: 'KOREA GP' },
        { bg: '#f8fafc', fg: '#0f172a', txt: '5.615 KM · 18 TURNS' }
      ];
      const pw = w / panels.length;
      panels.forEach((p, idx) => {
        ctx.fillStyle = p.bg;
        ctx.fillRect(idx * pw, 0, pw, h);
        ctx.fillStyle = p.fg;
        ctx.font = '900 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.txt, idx * pw + pw * 0.5, 38);
      });
    }, 4, 1);

    const jumbotronTex = makeCanvasTex(256, 128, (ctx, w, h) => {
      ctx.fillStyle = '#090e1a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, w, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('KIC LIVE TIMING   LAP 42 / 55', 10, 17);
      const rows = [
        ['1', '#ef4444', 'VET', '1:39.605'],
        ['2', '#f59e0b', 'ALO', '+0.284'],
        ['3', '#38bdf8', 'HAM', '+0.612'],
        ['4', '#10b981', 'KIM', '+1.105']
      ];
      rows.forEach(([pos, col, drv, tm], idx) => {
        const ry = 44 + idx * 21;
        ctx.fillStyle = 'rgba(30,41,59,0.85)';
        ctx.fillRect(8, ry - 14, w - 16, 17);
        ctx.fillStyle = col;
        ctx.fillRect(8, ry - 14, 5, 17);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`${pos}  ${drv}`, 20, ry - 1);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(tm, 148, ry - 1);
      });
    });

    const timingTowerTex = makeCanvasTex(128, 384, (ctx, w, h) => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, w, 34);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KIC F1', w * 0.5, 24);
      const entries = [
        ['1', '#ef4444', 'VET'], ['2', '#dc2626', 'ALO'], ['3', '#38bdf8', 'HAM'],
        ['4', '#f59e0b', 'NOR'], ['5', '#10b981', 'LEC'], ['6', '#3b82f6', 'VER'],
        ['7', '#e2e8f0', 'PIA'], ['8', '#22c55e', 'RUS']
      ];
      ctx.textAlign = 'left';
      entries.forEach(([p, col, name], idx) => {
        const y = 48 + idx * 40;
        ctx.fillStyle = '#151e2e';
        ctx.fillRect(6, y, w - 12, 32);
        ctx.fillStyle = col;
        ctx.fillRect(6, y, 8, 32);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '900 18px monospace';
        ctx.fillText(`${p} ${name}`, 22, y + 22);
      });
    });

    const helipadTex = makeCanvasTex(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 96, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 114, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 120px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', w * 0.5, h * 0.52);
    });

    function makeBrakeBoardMat(distLabel) {
      const tex = makeCanvasTex(128, 96, (ctx, w, h) => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 6;
        ctx.strokeRect(4, 4, w - 8, h - 8);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 50px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(distLabel, w * 0.5, h * 0.54);
      });
      return new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, roughness: 0.48, metalness: 0.12 });
    }
    const brakeMats = {
      150: makeBrakeBoardMat('150'),
      100: makeBrakeBoardMat('100'),
      50: makeBrakeBoardMat('50')
    };

    // -------------------------------------------------------------------------
    // 1. Closed 3D Catmull-Rom Racing Line, Curvature Profile & Tarmac Surfaces
    // -------------------------------------------------------------------------
    const curvePts = openRaw.map(([lat, lng]) => {
      const { x, z } = worldPosition(lat, lng);
      return new THREE.Vector3(x, surfaceHeight(lat, lng) + 0.068, z);
    });
    yeongamTrackCurve = new THREE.CatmullRomCurve3(curvePts, true, 'catmullrom', 0.35);

    const sampleCount = 240;
    const sampled = [];
    const tangents = [];
    for (let i = 0; i <= sampleCount; i++) {
      const u = i / sampleCount;
      sampled.push(yeongamTrackCurve.getPointAt(u));
      tangents.push(yeongamTrackCurve.getTangentAt(u).normalize());
    }

    const curvatures = new Float32Array(sampleCount);
    const speedProfile = new Float32Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) {
      const tPrev = tangents[(i - 3 + sampleCount) % sampleCount];
      const tNext = tangents[(i + 3) % sampleCount];
      curvatures[i] = tPrev.x * tNext.z - tPrev.z * tNext.x;
    }
    for (let i = 0; i < sampleCount; i++) {
      const kCurr = Math.abs(curvatures[i]);
      const kAhead = Math.abs(curvatures[(i + 5) % sampleCount]);
      const cornerLoad = Math.max(kCurr, kAhead * 0.92);
      speedProfile[i] = Math.max(0.54, Math.min(1.30, 1.30 - cornerLoad * 1.48));
    }

    // FIA Grade-1 Basalt Asphalt & Safety Verge
    const vergeMesh = createRoadRibbon(sampled, 0.43, 0x4f5a68, 0.006);
    if (vergeMesh) yeongamCircuitGroup.add(vergeMesh);
    const trackAsphaltMesh = createRoadRibbon(sampled, 0.34, 0x20252d, 0.018);
    if (trackAsphaltMesh) yeongamCircuitGroup.add(trackAsphaltMesh);

    // Crisp White Left & Right Track-Limit Edge Stripes
    const edgeLineMat = new THREE.LineBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.90 });
    [-0.295, 0.295].forEach((latOffset) => {
      const edgePts = [];
      for (let i = 0; i < sampleCount; i++) {
        const p = sampled[i];
        const t = tangents[i];
        edgePts.push(new THREE.Vector3(p.x - t.z * latOffset, p.y + 0.026, p.z + t.x * latOffset));
      }
      yeongamCircuitGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(edgePts), edgeLineMat));
    });

    // Permanent 3.045 km Short-Circuit Connector, Pit Lane & CIK-FIA Karting Loop
    if (Array.isArray(window.YEONGAM_SHORT_CONNECTOR) && window.YEONGAM_SHORT_CONNECTOR.length > 1) {
      const shortPts = window.YEONGAM_SHORT_CONNECTOR.map(([lat, lng]) => {
        const { x, z } = worldPosition(lat, lng);
        return new THREE.Vector3(x, surfaceHeight(lat, lng) + 0.068, z);
      });
      const shortVerge = createRoadRibbon(shortPts, 0.25, 0x64748b, 0.005);
      const shortTarmac = createRoadRibbon(shortPts, 0.19, 0x272d36, 0.015);
      if (shortVerge) yeongamCircuitGroup.add(shortVerge);
      if (shortTarmac) yeongamCircuitGroup.add(shortTarmac);
    }
    if (Array.isArray(window.YEONGAM_PIT_LANE) && window.YEONGAM_PIT_LANE.length > 1) {
      const pitPts = window.YEONGAM_PIT_LANE.map(([lat, lng]) => {
        const { x, z } = worldPosition(lat, lng);
        return new THREE.Vector3(x, surfaceHeight(lat, lng) + 0.068, z);
      });
      const pitFastBlue = createRoadRibbon(pitPts, 0.23, 0x1d4ed8, 0.008);
      const pitMesh = createRoadRibbon(pitPts, 0.17, 0x353d49, 0.016);
      if (pitFastBlue) yeongamCircuitGroup.add(pitFastBlue);
      if (pitMesh) yeongamCircuitGroup.add(pitMesh);
    }
    if (Array.isArray(window.YEONGAM_KART_TRACK) && window.YEONGAM_KART_TRACK.length > 2) {
      const kartRaw = window.YEONGAM_KART_TRACK.slice(0, -1).map(([lat, lng]) => {
        const { x, z } = worldPosition(lat, lng);
        return new THREE.Vector3(x, surfaceHeight(lat, lng) + 0.068, z);
      });
      const kartCurve = new THREE.CatmullRomCurve3(kartRaw, true, 'catmullrom', 0.35);
      const kartSampled = [];
      for (let i = 0; i <= 72; i++) kartSampled.push(kartCurve.getPointAt(i / 72));
      const kartShoulders = createRoadRibbon(kartSampled, 0.17, 0x2563eb, 0.008);
      const kartMesh = createRoadRibbon(kartSampled, 0.12, 0x2d3540, 0.016);
      if (kartShoulders) yeongamCircuitGroup.add(kartShoulders);
      if (kartMesh) yeongamCircuitGroup.add(kartMesh);
    }

    // Shared Calibrated PBR Architectural Materials (roughness varied >= 0.25 across adjacent parts)
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xdce3ec, roughness: 0.78, metalness: 0.06 });
    const darkConcreteMat = new THREE.MeshStandardMaterial({ color: 0x8392a5, roughness: 0.82, metalness: 0.08 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x2b3647, roughness: 0.38, metalness: 0.62 });
    const silverArmcoMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.30, metalness: 0.72 });
    const roofCanopyMat = new THREE.MeshStandardMaterial({ color: 0xe8eff7, roughness: 0.42, metalness: 0.18 });
    const redAccentMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.36, metalness: 0.18 });
    const cobaltMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.38, metalness: 0.20 });
    const dancheongColMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.50, metalness: 0.10 });
    const dancheongBeamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: dancheongTex, roughness: 0.56, metalness: 0.08 });
    const giwaMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: giwaTileTex, roughness: 0.52, metalness: 0.20 });
    const seatingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: seatingTex, roughness: 0.72, metalness: 0.05 });
    const pitFacadeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: pitFacadeTex, roughness: 0.48, metalness: 0.22 });
    const sponsorWallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: sponsorWallTex, roughness: 0.46, metalness: 0.10 });
    const garageDoorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.48, metalness: 0.42 });
    const skywalkGlassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.12,
      metalness: 0.45,
      transparent: true,
      opacity: 0.62
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x5aa0f2,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.22,
      roughness: 0.14,
      metalness: 0.52
    });
    const jumbotronMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: jumbotronTex,
      emissive: 0xffffff,
      emissiveMap: jumbotronTex,
      emissiveIntensity: 0.55,
      roughness: 0.22,
      metalness: 0.15
    });
    const timingTowerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: timingTowerTex,
      emissive: 0xffffff,
      emissiveMap: timingTowerTex,
      emissiveIntensity: 0.62,
      roughness: 0.20,
      metalness: 0.15
    });
    const warmInteriorMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xfde68a,
      emissiveIntensity: 0.48,
      roughness: 0.35
    });
    yeongamEmissiveMaterials.push(
      { mat: glassMat, dayInt: 0.22, nightInt: 1.05 },
      { mat: jumbotronMat, dayInt: 0.55, nightInt: 1.45 },
      { mat: timingTowerMat, dayInt: 0.62, nightInt: 1.60 },
      { mat: warmInteriorMat, dayInt: 0.45, nightInt: 1.75 }
    );

    // -------------------------------------------------------------------------
    // 2. Corner-Localized 3D FIA Kerbs, TecPro/Armco Barriers & Tire Stacks
    // -------------------------------------------------------------------------
    const kerbTransforms = [];
    const barrierTransforms = [];
    const tireStackTransforms = [];
    const _dummy = new THREE.Object3D();

    for (let i = 0; i < sampleCount; i++) {
      const k = curvatures[i];
      const absK = Math.abs(k);
      const prevK = Math.abs(curvatures[(i - 4 + sampleCount) % sampleCount]);
      if (absK < 0.085 && prevK < 0.12) continue;

      const p = sampled[i];
      const t = tangents[i];
      const heading = Math.atan2(t.x, t.z);
      const nx = -t.z;
      const nz = t.x;
      const insideSign = k >= 0 ? -1 : 1;

      kerbTransforms.push({
        x: p.x + nx * insideSign * 0.32,
        y: p.y + 0.022,
        z: p.z + nz * insideSign * 0.32,
        rotY: heading,
        isWhite: (i & 1) === 0
      });
      if (absK > 0.11 || prevK > 0.11) {
        kerbTransforms.push({
          x: p.x - nx * insideSign * 0.34,
          y: p.y + 0.022,
          z: p.z - nz * insideSign * 0.34,
          rotY: heading,
          isWhite: ((i + 1) & 1) === 0
        });
      }
      if (absK > 0.095 && (i % 2 === 0)) {
        const outDist = absK > 0.22 ? 0.70 : 0.58;
        barrierTransforms.push({
          x: p.x - nx * insideSign * outDist,
          y: p.y + 0.055,
          z: p.z - nz * insideSign * outDist,
          rotY: heading,
          isBlue: (i % 6) < 4
        });
        // Heavy hairpin braking zones get stacked black rubber FIA tire barrier bundles
        if (absK > 0.24) {
          tireStackTransforms.push({
            x: p.x - nx * insideSign * (outDist - 0.11),
            y: p.y + 0.055,
            z: p.z - nz * insideSign * (outDist - 0.11),
            rotY: heading
          });
        }
      }
    }

    if (kerbTransforms.length > 0) {
      const kerbGeo = new THREE.BoxGeometry(0.09, 0.026, 0.18);
      const kerbBaseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.06 });
      const kerbInst = new THREE.InstancedMesh(kerbGeo, kerbBaseMat, kerbTransforms.length);
      const cWhite = new THREE.Color(0xf8fafc);
      const cRed = new THREE.Color(0xdc2626);
      kerbTransforms.forEach((kt, idx) => {
        _dummy.position.set(kt.x, kt.y, kt.z);
        _dummy.rotation.set(0, kt.rotY, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        kerbInst.setMatrixAt(idx, _dummy.matrix);
        kerbInst.setColorAt(idx, kt.isWhite ? cWhite : cRed);
      });
      kerbInst.instanceMatrix.needsUpdate = true;
      if (kerbInst.instanceColor) kerbInst.instanceColor.needsUpdate = true;
      kerbInst.frustumCulled = false;
      yeongamCircuitGroup.add(kerbInst);
    }

    if (barrierTransforms.length > 0) {
      const tecproGeo = new THREE.BoxGeometry(0.09, 0.11, 0.36);
      const tecproMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.58, metalness: 0.14 });
      const tecproInst = new THREE.InstancedMesh(tecproGeo, tecproMat, barrierTransforms.length);
      const armcoGeo = new THREE.BoxGeometry(0.04, 0.09, 0.38);
      const armcoInst = new THREE.InstancedMesh(armcoGeo, silverArmcoMat, barrierTransforms.length);
      const cBlue = new THREE.Color(0x1d4ed8);
      const cCrimson = new THREE.Color(0xdc2626);
      barrierTransforms.forEach((bt, idx) => {
        _dummy.position.set(bt.x, bt.y, bt.z);
        _dummy.rotation.set(0, bt.rotY, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        tecproInst.setMatrixAt(idx, _dummy.matrix);
        tecproInst.setColorAt(idx, bt.isBlue ? cBlue : cCrimson);

        _dummy.position.set(bt.x, bt.y + 0.055, bt.z);
        _dummy.updateMatrix();
        armcoInst.setMatrixAt(idx, _dummy.matrix);
      });
      tecproInst.instanceMatrix.needsUpdate = true;
      if (tecproInst.instanceColor) tecproInst.instanceColor.needsUpdate = true;
      armcoInst.instanceMatrix.needsUpdate = true;
      tecproInst.frustumCulled = false;
      armcoInst.frustumCulled = false;
      yeongamCircuitGroup.add(tecproInst, armcoInst);
    }

    if (tireStackTransforms.length > 0) {
      const tireStackGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.10, 8);
      const tireBarrierMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.88, metalness: 0.05 });
      const tireInst = new THREE.InstancedMesh(tireStackGeo, tireBarrierMat, tireStackTransforms.length);
      tireStackTransforms.forEach((ts, idx) => {
        _dummy.position.set(ts.x, ts.y, ts.z);
        _dummy.rotation.set(0, ts.rotY, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        tireInst.setMatrixAt(idx, _dummy.matrix);
      });
      tireInst.instanceMatrix.needsUpdate = true;
      tireInst.frustumCulled = false;
      yeongamCircuitGroup.add(tireInst);
    }

    // Numbered 150m / 100m / 50m FIA Braking Distance Marker Boards before Turn 1 & Turn 3
    [
      [34.7382, 126.4170, -0.36, 150],
      [34.7386, 126.4181, -0.36, 100],
      [34.7390, 126.4192, -0.36, 50],
      [34.7425, 126.4080, 2.95, 150],
      [34.7427, 126.4068, 2.95, 100],
      [34.7429, 126.4056, 2.95, 50]
    ].forEach(([bLat, bLng, rotY, distNum]) => {
      const bp = worldPosition(bLat, bLng);
      const by = surfaceHeight(bLat, bLng) + 0.13;
      const bGrp = new THREE.Group();
      bGrp.position.set(bp.x, by, bp.z);
      bGrp.rotation.y = rotY;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.14, 0.025), steelMat);
      post.position.y = -0.06;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.15, 0.03), brakeMats[distNum]);
      bGrp.add(post, panel);
      yeongamCircuitGroup.add(bGrp);
    });

    // Compute exact Main Straight heading angle from Start Grid -> T1 Braking Zone
    const stA = worldPosition(34.7358, 126.4114);
    const stB = worldPosition(34.7385, 126.4188);
    const straightAngle = Math.atan2(stB.z - stA.z, stB.x - stA.x);

    // -------------------------------------------------------------------------
    // 3. KIC Signature Korean Hanok Giwa Overpass Bridges (한옥 팔작지붕 육교)
    // -------------------------------------------------------------------------
    const hanokRoofShape = new THREE.Shape();
    hanokRoofShape.moveTo(-0.56, 0.02);
    hanokRoofShape.quadraticCurveTo(-0.24, 0.08, 0, 0.36);
    hanokRoofShape.quadraticCurveTo(0.24, 0.08, 0.56, 0.02);
    hanokRoofShape.lineTo(0.56, -0.05);
    hanokRoofShape.quadraticCurveTo(0.22, 0.01, 0, 0.25);
    hanokRoofShape.quadraticCurveTo(-0.22, 0.01, -0.56, -0.05);
    hanokRoofShape.closePath();

    function createHanokOverpassBridge(lat, lng, roadAngleRad, spanZ) {
      const bPos = worldPosition(lat, lng);
      const bY = surfaceHeight(lat, lng) + 0.05;
      const bridge = new THREE.Group();
      bridge.position.set(bPos.x, bY, bPos.z);
      bridge.rotation.y = -roadAngleRad;

      const halfSpan = spanZ * 0.5;
      [-halfSpan, halfSpan].forEach((pz) => {
        // Sculpted concrete abutment pier with dark base plinth & staircase tower
        const pierBase = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.20, 0.44), darkConcreteMat);
        pierBase.position.set(0, 0.10, pz);
        bridge.add(pierBase);

        const pier = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.06, 0.36), concreteMat);
        pier.position.set(0, 0.58, pz);
        pier.castShadow = true;
        pier.receiveShadow = true;
        bridge.add(pier);

        const stairTower = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.98, 0.32), darkConcreteMat);
        stairTower.position.set(-0.30, 0.49, pz + (pz > 0 ? 0.26 : -0.26));
        stairTower.castShadow = true;
        bridge.add(stairTower);

        const stairGlass = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.56, 0.16), skywalkGlassMat);
        stairGlass.position.set(-0.30, 0.58, pz + (pz > 0 ? 0.26 : -0.26));
        bridge.add(stairGlass);
      });

      // Box-girder skywalk deck + KIC sponsor fascia facing oncoming drivers
      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.17, spanZ + 0.42), roofCanopyMat);
      deck.position.set(0, 1.06, 0);
      deck.castShadow = true;
      bridge.add(deck);

      [-0.32, 0.32].forEach((fx) => {
        const fascia = new THREE.Mesh(
          new THREE.BoxGeometry(0.025, 0.14, spanZ + 0.16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, map: gantryBannerTex, roughness: 0.40, metalness: 0.12 })
        );
        fascia.position.set(fx, 1.07, 0);
        bridge.add(fascia);
      });

      // Enclosed glass skywalk corridor + traditional wooden balustrades (난간)
      const pavSpan = spanZ * 0.74;
      const glassCorridor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, pavSpan * 0.94), skywalkGlassMat);
      glassCorridor.position.set(0, 1.35, 0);
      bridge.add(glassCorridor);

      [-0.25, 0.25].forEach((rx) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, spanZ - 0.18), dancheongColMat);
        rail.position.set(rx, 1.24, 0);
        bridge.add(rail);
      });

      // Crimson Dancheong round timber columns
      const colGeo = new THREE.CylinderGeometry(0.036, 0.044, 0.48, 8);
      for (let ci = -3; ci <= 3; ci++) {
        const cz = (ci / 3) * (pavSpan * 0.46);
        [-0.23, 0.23].forEach((cx) => {
          const col = new THREE.Mesh(colGeo, dancheongColMat);
          col.position.set(cx, 1.38, cz);
          bridge.add(col);
        });
      }

      // Ornate Dancheong eaves beam (공포·창방)
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.11, pavSpan * 0.98), dancheongBeamMat);
      lintel.position.set(0, 1.63, 0);
      bridge.add(lintel);

      // Curved Paljak-jibung (팔작지붕) ExtrudeGeometry Giwa Roof with upturned corner wingtips!
      const roofLen = pavSpan * 1.06;
      const roofGeo = new THREE.ExtrudeGeometry(hanokRoofShape, {
        depth: roofLen,
        bevelEnabled: false,
        steps: 1
      });
      roofGeo.translate(0, 0, -roofLen * 0.5);
      const sculptedRoof = new THREE.Mesh(roofGeo, giwaMat);
      sculptedRoof.position.set(0, 1.72, 0);
      sculptedRoof.castShadow = true;
      bridge.add(sculptedRoof);

      // Upturned Korean gable end wings (추녀) & central ridge beam (용마루)
      [-1, 1].forEach((endSign) => {
        const wingTip = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.055, 0.26), giwaMat);
        wingTip.position.set(0, 1.77, endSign * (roofLen * 0.52));
        wingTip.rotation.x = -endSign * 0.24;
        bridge.add(wingTip);

        const gableTri = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.05), dancheongBeamMat);
        gableTri.position.set(0, 1.84, endSign * (roofLen * 0.46));
        bridge.add(gableTri);
      });

      const yongmaru = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.095, roofLen * 0.96), giwaMat);
      yongmaru.position.set(0, 2.09, 0);
      bridge.add(yongmaru);

      // Warm underside pedestrian lighting strip
      const underGlow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, pavSpan * 0.84), warmInteriorMat);
      underGlow.position.set(0, 1.56, 0);
      bridge.add(underGlow);

      return bridge;
    }

    // #1 Main Straight Hanok Bridge (spanning Main Straight & Pit-Out)
    yeongamCircuitGroup.add(createHanokOverpassBridge(34.7379, 126.4176, straightAngle, 2.42));
    // #2 1.2km Back-Straight Hanok Bridge
    const infA = worldPosition(34.7405, 126.4195);
    const infB = worldPosition(34.7422, 126.4094);
    const backStraightAngle = Math.atan2(infB.z - infA.z, infB.x - infA.x);
    yeongamCircuitGroup.add(createHanokOverpassBridge(34.7414, 126.4146, backStraightAngle, 1.92));

    // -------------------------------------------------------------------------
    // 4. Remodeled 16,000-Seat KIC Wave-Canopy Main Grandstand Stadium Bowl
    // -------------------------------------------------------------------------
    const gsPos = worldPosition(34.7383, 126.4145);
    const gsY = surfaceHeight(34.7383, 126.4145) + 0.05;
    const grandstand = new THREE.Group();
    grandstand.position.set(gsPos.x, gsY, gsPos.z);
    grandstand.rotation.y = -straightAngle;

    // Ground-level concrete concourse plinth + dark rear service colonnade
    const gsPlinth = new THREE.Mesh(new THREE.BoxGeometry(6.35, 0.24, 1.66), concreteMat);
    gsPlinth.position.set(0, 0.12, -0.50);
    gsPlinth.castShadow = true;
    gsPlinth.receiveShadow = true;
    grandstand.add(gsPlinth);

    const gsFrontWall = new THREE.Mesh(new THREE.BoxGeometry(6.24, 0.16, 0.08), sponsorWallMat);
    gsFrontWall.position.set(0, 0.14, 0.34);
    grandstand.add(gsFrontWall);

    // 3 Stepped Stadium Seating Tiers with high-res individual-seat & stair-aisle texture!
    [
      { h: 0.26, y: 0.28, z: 0.08, d: 0.44, w: 6.18 },
      { h: 0.34, y: 0.56, z: -0.30, d: 0.46, w: 6.04 },
      { h: 0.42, y: 0.88, z: -0.70, d: 0.48, w: 5.90 }
    ].forEach((tCfg) => {
      const bowl = new THREE.Mesh(new THREE.BoxGeometry(tCfg.w, tCfg.h, tCfg.d), concreteMat);
      bowl.position.set(0, tCfg.y, tCfg.z);
      bowl.castShadow = true;
      bowl.receiveShadow = true;
      grandstand.add(bowl);

      const seatDeck = new THREE.Mesh(new THREE.PlaneGeometry(tCfg.w - 0.10, tCfg.d * 0.96), seatingMat);
      seatDeck.rotation.x = -Math.PI / 2 + 0.14;
      seatDeck.position.set(0, tCfg.y + tCfg.h * 0.5 + 0.042, tCfg.z + 0.02);
      grandstand.add(seatDeck);
    });

    // VIP Hospitality Glass Skyboxes + Glowing Interior Concourse + Steel Balcony Fascia
    const vipBox = new THREE.Mesh(new THREE.BoxGeometry(5.68, 0.32, 0.56), glassMat);
    vipBox.position.set(0, 1.26, -0.82);
    grandstand.add(vipBox);

    const vipBalcony = new THREE.Mesh(new THREE.BoxGeometry(5.78, 0.06, 0.16), roofCanopyMat);
    vipBalcony.position.set(0, 1.12, -0.49);
    grandstand.add(vipBalcony);

    const vipHeader = new THREE.Mesh(new THREE.BoxGeometry(5.76, 0.065, 0.10), redAccentMat);
    vipHeader.position.set(0, 1.44, -0.52);
    grandstand.add(vipHeader);

    // Sculpted Curved Cantilevered Wave Canopy (9 sweeping bays + arched steel ribs + cable stays!)
    const bayCount = 9;
    const totalCanopyW = 6.42;
    const bayW = totalCanopyW / bayCount;
    const canopyRibCurvePts = [
      new THREE.Vector3(0, 1.54, -1.26),
      new THREE.Vector3(0, 1.78, -0.54),
      new THREE.Vector3(0, 1.72, 0.24),
      new THREE.Vector3(0, 1.52, 0.78)
    ];
    const canopyRibCurve = new THREE.CatmullRomCurve3(canopyRibCurvePts);
    const canopyRibGeo = new THREE.TubeGeometry(canopyRibCurve, 14, 0.036, 6, false);

    // Wing-profile canopy section extruded across each bay
    const wingShape = new THREE.Shape();
    wingShape.moveTo(-1.24, -0.04);
    wingShape.quadraticCurveTo(-0.32, 0.22, 0.76, -0.06);
    wingShape.lineTo(0.76, -0.11);
    wingShape.quadraticCurveTo(-0.32, 0.14, -1.24, -0.09);
    wingShape.closePath();
    const bayRoofGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: bayW - 0.03,
      bevelEnabled: false,
      steps: 1
    });
    bayRoofGeo.rotateY(-Math.PI / 2);
    bayRoofGeo.translate((bayW - 0.03) * 0.5, 0, 0);

    for (let b = 0; b < bayCount; b++) {
      const bx = (b - (bayCount - 1) * 0.5) * bayW;
      const u = b / (bayCount - 1);
      // Iconic KIC flowing double-wave roofline
      const waveLift = Math.sin(u * Math.PI) * 0.20 + Math.cos((u - 0.5) * Math.PI * 3.0) * 0.055;

      const bayRoof = new THREE.Mesh(bayRoofGeo, roofCanopyMat);
      bayRoof.position.set(bx, 1.62 + waveLift, 0);
      bayRoof.castShadow = true;
      grandstand.add(bayRoof);

      // Arched structural steel spine rib
      const rib = new THREE.Mesh(canopyRibGeo, steelMat);
      rib.position.set(bx, waveLift, 0);
      grandstand.add(rib);

      // Crimson aerodynamic leading-edge trim
      const frontTrim = new THREE.Mesh(new THREE.BoxGeometry(bayW - 0.01, 0.055, 0.09), redAccentMat);
      frontTrim.position.set(bx, 1.51 + waveLift, 0.76);
      grandstand.add(frontTrim);

      // Warm underside stadium floodlight bar
      const underLight = new THREE.Mesh(new THREE.BoxGeometry(bayW * 0.62, 0.025, 0.06), warmInteriorMat);
      underLight.position.set(bx, 1.54 + waveLift, 0.42);
      grandstand.add(underLight);

      // Tapered rear A-frame steel mast + diagonal tension cable stay
      const mastH = 2.08 + waveLift;
      const mast = new THREE.Mesh(new THREE.BoxGeometry(0.11, mastH, 0.14), steelMat);
      mast.position.set(bx, mastH * 0.5, -1.24);
      mast.castShadow = true;
      grandstand.add(mast);

      const cableStay = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.48, 5), silverArmcoMat);
      cableStay.position.set(bx, 1.88 + waveLift, -0.56);
      cableStay.rotation.x = Math.PI / 2 - 0.28;
      grandstand.add(cableStay);
    }
    yeongamCircuitGroup.add(grandstand);

    // -------------------------------------------------------------------------
    // 5. Remodeled 24-Bay Pit Building, FIA Podium Balcony, Pit Booms & Motorhomes
    // -------------------------------------------------------------------------
    const pitPos = worldPosition(34.7357, 126.4163);
    const pitY = surfaceHeight(34.7357, 126.4163) + 0.05;
    const pitBuilding = new THREE.Group();
    pitBuilding.position.set(pitPos.x, pitY, pitPos.z);
    pitBuilding.rotation.y = -straightAngle;

    // Ground-floor pit garage structure with high-res numbered illuminated garage facade
    const pitCore = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.46, 1.04), concreteMat);
    pitCore.position.y = 0.23;
    pitCore.castShadow = true;
    pitCore.receiveShadow = true;
    pitBuilding.add(pitCore);

    const pitGarageFront = new THREE.Mesh(new THREE.PlaneGeometry(5.16, 0.44), pitFacadeMat);
    pitGarageFront.position.set(0, 0.23, -0.525);
    pitGarageFront.rotation.y = Math.PI;
    pitBuilding.add(pitGarageFront);

    // Overhanging team pit-stop wheel-gun gantries (10 booms extending over Pit Apron!)
    for (let g = 0; g < 10; g++) {
      const gx = (g - 4.5) * 0.50;
      const boomArm = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 0.44), steelMat);
      boomArm.position.set(gx, 0.42, -0.74);
      pitBuilding.add(boomArm);
      const boomLight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.05), warmInteriorMat);
      boomLight.position.set(gx, 0.40, -0.92);
      pitBuilding.add(boomLight);
    }

    // 2nd & 3rd Floor Paddock Club Glass Hospitality Pavilion + Terrace Railings
    const pitUpperGlass = new THREE.Mesh(new THREE.BoxGeometry(5.06, 0.38, 1.08), glassMat);
    pitUpperGlass.position.y = 0.65;
    pitBuilding.add(pitUpperGlass);

    const terraceDeck = new THREE.Mesh(new THREE.BoxGeometry(5.24, 0.055, 0.22), roofCanopyMat);
    terraceDeck.position.set(0, 0.48, -0.60);
    pitBuilding.add(terraceDeck);

    const pitOverhang = new THREE.Mesh(new THREE.BoxGeometry(5.36, 0.085, 1.38), roofCanopyMat);
    pitOverhang.position.y = 0.88;
    pitOverhang.castShadow = true;
    pitBuilding.add(pitOverhang);

    // Rooftop Paddock Club solar/louver mechanical bays & crimson roof trim
    const pitRoofTrim = new THREE.Mesh(new THREE.BoxGeometry(5.38, 0.045, 0.06), redAccentMat);
    pitRoofTrim.position.set(0, 0.89, -0.68);
    pitBuilding.add(pitRoofTrim);
    for (let lv = -2; lv <= 2; lv++) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.06, 0.60), darkConcreteMat);
      louver.position.set(lv * 0.96, 0.95, 0.08);
      pitBuilding.add(louver);
    }

    // Cantilevered FIA Winners' Podium Balcony protruding over the Pit Lane near Start/Finish!
    const podiumDeck = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.48), roofCanopyMat);
    podiumDeck.position.set(-1.35, 0.60, -0.76);
    pitBuilding.add(podiumDeck);
    const podiumBack = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.28, 0.05), sponsorWallMat);
    podiumBack.position.set(-1.35, 0.78, -0.54);
    pitBuilding.add(podiumBack);
    const podiumCanopy = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.05, 0.52), redAccentMat);
    podiumCanopy.position.set(-1.35, 0.94, -0.76);
    pitBuilding.add(podiumCanopy);

    // Pit Wall with Sponsor Graphics, Telemetry Timing Stands & FIA Debris Catch Fence
    const pitWall = new THREE.Mesh(new THREE.BoxGeometry(5.45, 0.17, 0.08), sponsorWallMat);
    pitWall.position.set(-0.08, 0.085, -1.12);
    pitBuilding.add(pitWall);

    // Semi-transparent FIA debris catch fence mesh + vertical metallic posts along pit wall
    const catchFenceMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5.45, 0.32),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false })
    );
    catchFenceMesh.position.set(-0.08, 0.33, -1.12);
    pitBuilding.add(catchFenceMesh);
    for (let fp = -6; fp <= 6; fp++) {
      const fPost = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.36, 0.022), silverArmcoMat);
      fPost.position.set(-0.08 + fp * 0.44, 0.34, -1.12);
      pitBuilding.add(fPost);
    }

    const timingBoxGeo = new THREE.BoxGeometry(0.40, 0.22, 0.14);
    for (let tw = -2; tw <= 3; tw++) {
      const tStand = new THREE.Mesh(timingBoxGeo, tw % 2 === 0 ? cobaltMat : steelMat);
      tStand.position.set(tw * 0.80 - 0.28, 0.25, -1.10);
      pitBuilding.add(tStand);
      const tCanopy = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.20), roofCanopyMat);
      tCanopy.position.set(tw * 0.80 - 0.28, 0.37, -1.10);
      pitBuilding.add(tCanopy);
    }

    // Paddock Compound: 2-Story Team Hospitality Motorhomes + 8 Composite Team Transporter Semis
    const motorhomeColors = [redAccentMat, cobaltMat, steelMat, roofCanopyMat];
    for (let mh = 0; mh < 4; mh++) {
      const mx = (mh - 1.5) * 1.04;
      const mhBody = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.34, 0.52), motorhomeColors[mh]);
      mhBody.position.set(mx, 0.17, 1.84);
      mhBody.castShadow = true;
      pitBuilding.add(mhBody);
      const mhGlass = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.16, 0.54), glassMat);
      mhGlass.position.set(mx, 0.22, 1.84);
      pitBuilding.add(mhGlass);
    }

    const trailerColors = [redAccentMat, cobaltMat, roofCanopyMat, steelMat, redAccentMat, roofCanopyMat, cobaltMat, roofCanopyMat];
    const trailerGeo = new THREE.BoxGeometry(0.22, 0.23, 0.68);
    const cabGeo = new THREE.BoxGeometry(0.20, 0.19, 0.18);
    for (let tr = 0; tr < 8; tr++) {
      const tx = (tr - 3.5) * 0.56;
      const trailer = new THREE.Mesh(trailerGeo, trailerColors[tr]);
      trailer.position.set(tx, 0.14, 0.94);
      trailer.castShadow = true;
      pitBuilding.add(trailer);

      const cab = new THREE.Mesh(cabGeo, steelMat);
      cab.position.set(tx, 0.12, 1.40);
      pitBuilding.add(cab);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.08, 0.03), glassMat);
      windshield.position.set(tx, 0.15, 1.49);
      pitBuilding.add(windshield);
    }

    yeongamCircuitGroup.add(pitBuilding);

    // -------------------------------------------------------------------------
    // 6. Start/Finish FIA Timing Gantry, Checkered Line, 3D Grid Boxes & Vertical Timing Tower
    // -------------------------------------------------------------------------
    const gantryPos = worldPosition(34.7370, 126.4147);
    const gantryY = surfaceHeight(34.7370, 126.4147) + 0.05;
    const gantry = new THREE.Group();
    gantry.position.set(gantryPos.x, gantryY, gantryPos.z);
    gantry.rotation.y = -straightAngle;

    [-0.96, 0.96].forEach((sideZ) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.28, 0.12), steelMat);
      post.position.set(0, 0.64, sideZ);
      post.castShadow = true;
      gantry.add(post);
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.24), darkConcreteMat);
      brace.position.set(0, 0.06, sideZ);
      gantry.add(brace);
    });

    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 2.08), steelMat);
    beam.position.set(0, 1.20, 0);
    beam.castShadow = true;
    gantry.add(beam);

    // Front & back KOREA INTERNATIONAL CIRCUIT FIA Gantry Banners
    const gantrySignMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: gantryBannerTex, roughness: 0.36, metalness: 0.12 });
    [-0.125, 0.125].forEach((sx) => {
      const signPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 0.27), gantrySignMat);
      signPlane.position.set(sx, 1.21, 0);
      signPlane.rotation.y = sx < 0 ? -Math.PI / 2 : Math.PI / 2;
      gantry.add(signPlane);
    });

    // High-res Checkered Start/Finish Line across Main Straight tarmac
    const sfStripe = new THREE.Mesh(
      new THREE.PlaneGeometry(0.20, 0.66),
      new THREE.MeshBasicMaterial({ map: checkeredTex, polygonOffset: true, polygonOffsetFactor: -4 })
    );
    sfStripe.rotation.x = -Math.PI / 2;
    sfStripe.position.set(0, 0.044, 0);
    gantry.add(sfStripe);

    // 5 FIA Red Start Light Pods + Ambient Race Start Glow
    const raceLightMat = new THREE.MeshStandardMaterial({
      color: 0xff2b2b,
      emissive: 0xef4444,
      emissiveIntensity: 1.15,
      roughness: 0.18
    });
    yeongamEmissiveMaterials.push({ mat: raceLightMat, dayInt: 1.15, nightInt: 2.5 });
    [-0.44, -0.22, 0, 0.22, 0.44].forEach((lz) => {
      const podBox = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.09), garageDoorMat);
      podBox.position.set(-0.15, 1.04, lz);
      gantry.add(podBox);
      const pod = new THREE.Mesh(new THREE.SphereGeometry(0.046, 8, 8), raceLightMat);
      pod.position.set(-0.19, 1.04, lz);
      gantry.add(pod);
    });

    // Vertical F1 Live Position Timing Tower standing beside Pit Wall!
    const timingPylon = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.25, 0.32), steelMat);
    timingPylon.position.set(1.55, 1.12, 1.04);
    timingPylon.castShadow = true;
    gantry.add(timingPylon);
    const timingScreenFront = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.48, 0.34), timingTowerMat);
    timingScreenFront.position.set(1.55, 1.44, 1.04);
    gantry.add(timingScreenFront);
    const timingCap = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.38), redAccentMat);
    timingCap.position.set(1.55, 2.24, 1.04);
    gantry.add(timingCap);

    yeongamCircuitGroup.add(gantry);

    // -------------------------------------------------------------------------
    // 7. Remodeled Race Control Tower, Media Center & Medical Helipad + Rescue Helicopter
    // -------------------------------------------------------------------------
    const tcPos = worldPosition(34.7348, 126.4136);
    const tcY = surfaceHeight(34.7348, 126.4136) + 0.05;
    const tower = new THREE.Group();
    tower.position.set(tcPos.x, tcY, tcPos.z);
    tower.rotation.y = -straightAngle;

    const mediaWing = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.48, 0.86), concreteMat);
    mediaWing.position.set(0.84, 0.24, 0.06);
    mediaWing.castShadow = true;
    tower.add(mediaWing);
    const mediaGlass = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.24, 0.90), glassMat);
    mediaGlass.position.set(0.84, 0.31, 0.06);
    tower.add(mediaGlass);
    const mediaRoofTrim = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.05, 0.90), redAccentMat);
    mediaRoofTrim.position.set(0.84, 0.50, 0.06);
    tower.add(mediaRoofTrim);

    const towerBase = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.38, 1.12), concreteMat);
    towerBase.position.y = 0.19;
    tower.add(towerBase);

    const towerShaft = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.64, 0.68), concreteMat);
    towerShaft.position.y = 1.12;
    towerShaft.castShadow = true;
    tower.add(towerShaft);

    const towerShaftRib = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.66, 0.74), redAccentMat);
    towerShaftRib.position.y = 1.12;
    tower.add(towerShaftRib);

    // Multi-tier octagonal race-steward glass observation pods
    const towerObsLower = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.48, 0.26, 8), glassMat);
    towerObsLower.position.y = 1.98;
    towerObsLower.rotation.y = Math.PI / 8;
    tower.add(towerObsLower);

    const towerDeckRing = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.06, 8), roofCanopyMat);
    towerDeckRing.position.y = 2.13;
    towerDeckRing.rotation.y = Math.PI / 8;
    tower.add(towerDeckRing);

    const towerObsUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.58, 0.28, 8), glassMat);
    towerObsUpper.position.y = 2.30;
    towerObsUpper.rotation.y = Math.PI / 8;
    tower.add(towerObsUpper);

    const dancheongCrown = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.08, 1.26), dancheongBeamMat);
    dancheongCrown.position.y = 2.48;
    tower.add(dancheongCrown);

    const giwaEaves = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.10, 1.56), giwaMat);
    giwaEaves.position.y = 2.57;
    giwaEaves.castShadow = true;
    tower.add(giwaEaves);

    const giwaRoof = new THREE.Mesh(new THREE.ConeGeometry(1.12, 0.48, 4), giwaMat);
    giwaRoof.position.y = 2.86;
    giwaRoof.rotation.y = Math.PI / 4;
    giwaRoof.castShadow = true;
    tower.add(giwaRoof);

    // Telemetry radar dome & aviation beacon spire
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.036, 0.68, 6), silverArmcoMat);
    spire.position.y = 3.38;
    tower.add(spire);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), raceLightMat);
    beacon.position.y = 3.74;
    tower.add(beacon);

    yeongamCircuitGroup.add(tower);

    // Dedicated FIA Medical Helipad Apron + Parked Motorsport Rescue Helicopter on East Paddock Terrace
    const heliSitePos = worldPosition(34.7367, 126.4218);
    const heliSiteY = surfaceHeight(34.7367, 126.4218) + 0.05;
    const heliComplex = new THREE.Group();
    heliComplex.position.set(heliSitePos.x, heliSiteY, heliSitePos.z);
    heliComplex.rotation.y = -straightAngle;

    const heliPlinth = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.08, 1.36), darkConcreteMat);
    heliPlinth.position.y = 0.04;
    heliPlinth.receiveShadow = true;
    heliComplex.add(heliPlinth);

    const heliPad = new THREE.Mesh(
      new THREE.PlaneGeometry(1.22, 1.22),
      new THREE.MeshStandardMaterial({ color: 0xffffff, map: helipadTex, roughness: 0.78, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -3 })
    );
    heliPad.rotation.x = -Math.PI / 2;
    heliPad.position.set(0, 0.086, 0);
    heliComplex.add(heliPad);

    [[-0.60, -0.60], [0.60, -0.60], [-0.60, 0.60], [0.60, 0.60]].forEach(([cx, cz]) => {
      const hBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 6), warmInteriorMat);
      hBeacon.position.set(cx, 0.10, cz);
      heliComplex.add(hBeacon);
    });

    const heli = new THREE.Group();
    heli.position.set(0, 0.09, 0);
    heli.rotation.y = 0.55;
    const heliFuselage = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.52), roofCanopyMat);
    heliFuselage.position.y = 0.14;
    heliFuselage.castShadow = true;
    const heliStripe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 0.50), redAccentMat);
    heliStripe.position.y = 0.13;
    const heliCockpit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.22), glassMat);
    heliCockpit.position.set(0, 0.16, 0.22);
    const heliTail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.44), redAccentMat);
    heliTail.position.set(0, 0.16, -0.44);
    const heliFin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.10), redAccentMat);
    heliFin.position.set(0, 0.22, -0.62);
    const heliRotor1 = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.015, 0.045), steelMat);
    heliRotor1.position.set(0, 0.28, 0.02);
    const heliRotor2 = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.015, 0.92), steelMat);
    heliRotor2.position.set(0, 0.28, 0.02);
    [-0.12, 0.12].forEach((sx) => {
      const skid = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.48), steelMat);
      skid.position.set(sx, 0.02, 0.02);
      heli.add(skid);
    });
    heli.add(heliFuselage, heliStripe, heliCockpit, heliTail, heliFin, heliRotor1, heliRotor2);
    heliComplex.add(heli);
    yeongamCircuitGroup.add(heliComplex);

    // -------------------------------------------------------------------------
    // 8. Upgraded 2-Tier Secondary Grandstands, Trackside Giant LED Jumbotrons & Karting Center
    // -------------------------------------------------------------------------
    function createSecondaryStand(lat, lng, widthX, rotY, accentMat) {
      const sp = worldPosition(lat, lng);
      const sy = surfaceHeight(lat, lng) + 0.05;
      const st = new THREE.Group();
      st.position.set(sp.x, sy, sp.z);
      st.rotation.y = rotY;

      const base = new THREE.Mesh(new THREE.BoxGeometry(widthX, 0.36, 0.80), concreteMat);
      base.position.set(0, 0.18, 0);
      base.castShadow = true;
      base.receiveShadow = true;
      st.add(base);

      const frontBanner = new THREE.Mesh(new THREE.BoxGeometry(widthX, 0.12, 0.05), sponsorWallMat);
      frontBanner.position.set(0, 0.12, 0.41);
      st.add(frontBanner);

      const seatDeck = new THREE.Mesh(new THREE.PlaneGeometry(widthX - 0.10, 0.72), seatingMat);
      seatDeck.rotation.x = -Math.PI / 2 + 0.16;
      seatDeck.position.set(0, 0.43, 0.04);
      st.add(seatDeck);

      const shadeRoof = new THREE.Mesh(new THREE.BoxGeometry(widthX + 0.18, 0.065, 0.94), roofCanopyMat);
      shadeRoof.position.set(0, 0.80, 0.04);
      shadeRoof.rotation.x = 0.14;
      shadeRoof.castShadow = true;
      st.add(shadeRoof);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(widthX + 0.18, 0.045, 0.07), accentMat);
      trim.position.set(0, 0.73, 0.50);
      st.add(trim);

      [-widthX * 0.40, -widthX * 0.14, widthX * 0.14, widthX * 0.40].forEach((px) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.08), steelMat);
        post.position.set(px, 0.41, -0.34);
        st.add(post);
      });
      return st;
    }

    yeongamCircuitGroup.add(
      createSecondaryStand(34.7400, 126.4213, 2.35, -2.25, redAccentMat),  // Turn 1 Braking Stand
      createSecondaryStand(34.7436, 126.4048, 2.65, 0.45, cobaltMat),      // Turn 3 Overtaking Hairpin Stand
      createSecondaryStand(34.7416, 126.4096, 2.05, 0.12, cobaltMat),      // Infield Crest Stand
      createSecondaryStand(34.7298, 126.4226, 2.75, 2.65, cobaltMat)       // Marina Waterfront Stand
    );

    // Giant Glowing Trackside LED Jumbotron Screens (Main Straight, Turn 3 Hairpin, Marina)
    [
      { lat: 34.7366, lng: 126.4176, rotY: -straightAngle + Math.PI },
      { lat: 34.7420, lng: 126.4036, rotY: 0.75 },
      { lat: 34.7316, lng: 126.4234, rotY: -2.45 }
    ].forEach((jCfg) => {
      const jp = worldPosition(jCfg.lat, jCfg.lng);
      const jy = surfaceHeight(jCfg.lat, jCfg.lng) + 0.05;
      const jb = new THREE.Group();
      jb.position.set(jp.x, jy, jp.z);
      jb.rotation.y = jCfg.rotY;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.65, 8), steelMat);
      pole.position.y = 0.32;
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.50, 0.08), steelMat);
      frame.position.y = 0.78;
      frame.castShadow = true;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.42), jumbotronMat);
      screen.position.set(0, 0.78, 0.045);
      jb.add(pole, frame, screen);
      yeongamCircuitGroup.add(jb);
    });

    // KIC Karting & Driving Experience Center Building
    const kartBldgPos = worldPosition(34.7347, 126.4052);
    const kartBldg = new THREE.Group();
    kartBldg.position.set(kartBldgPos.x, surfaceHeight(34.7347, 126.4052) + 0.05, kartBldgPos.z);
    kartBldg.rotation.y = 0.18;
    const kbCore = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.32, 0.56), concreteMat);
    kbCore.position.y = 0.16;
    kbCore.castShadow = true;
    kartBldg.add(kbCore);
    const kbGlass = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.16, 0.58), glassMat);
    kbGlass.position.y = 0.19;
    kartBldg.add(kbGlass);
    const kbRoof = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.065, 0.70), cobaltMat);
    kbRoof.position.y = 0.35;
    kartBldg.add(kbRoof);
    yeongamCircuitGroup.add(kartBldg);

    // -------------------------------------------------------------------------
    // 9. High-Mast Stadium Floodlight Towers & Landscaped Circuit Perimeter Trees
    // -------------------------------------------------------------------------
    const lightTowerCoords = [
      [34.7364, 126.4114], [34.7372, 126.4139], [34.7380, 126.4165], [34.7389, 126.4192],
      [34.7399, 126.4198], [34.7429, 126.4060], [34.7423, 126.4040], [34.7382, 126.4148],
      [34.7351, 126.4232], [34.7316, 126.4235], [34.7305, 126.4192], [34.7320, 126.4079]
    ];
    const mastPoleGeo = new THREE.CylinderGeometry(0.026, 0.050, 1.68, 6);
    const mastHeadGeo = new THREE.BoxGeometry(0.30, 0.11, 0.09);
    const floodLightMat = new THREE.MeshStandardMaterial({
      color: 0xfefce8,
      emissive: 0xfef08a,
      emissiveIntensity: 0.34,
      roughness: 0.24
    });
    yeongamEmissiveMaterials.push({ mat: floodLightMat, dayInt: 0.30, nightInt: 2.40 });

    const mastPoles = new THREE.InstancedMesh(mastPoleGeo, silverArmcoMat, lightTowerCoords.length);
    const mastHeads = new THREE.InstancedMesh(mastHeadGeo, floodLightMat, lightTowerCoords.length);
    lightTowerCoords.forEach(([lLat, lLng], idx) => {
      const lp = worldPosition(lLat, lLng);
      const ly = surfaceHeight(lLat, lLng);
      _dummy.position.set(lp.x, ly + 0.84, lp.z);
      _dummy.rotation.set(0, idx * 0.52, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      mastPoles.setMatrixAt(idx, _dummy.matrix);

      _dummy.position.set(lp.x, ly + 1.68, lp.z);
      _dummy.rotation.set(0.32, idx * 0.52, 0);
      _dummy.updateMatrix();
      mastHeads.setMatrixAt(idx, _dummy.matrix);
    });
    mastPoles.instanceMatrix.needsUpdate = true;
    mastHeads.instanceMatrix.needsUpdate = true;
    mastPoles.frustumCulled = false;
    mastHeads.frustumCulled = false;
    yeongamCircuitGroup.add(mastPoles, mastHeads);

    // Landscaped Spectator Berm & F1-ro Boulevard Trees (InstancedMesh with per-instance scale & tint!)
    const treeCoords = [
      // Northern hillside spectator berm above 1.2km Back Straight
      [34.7442, 126.4072], [34.7445, 126.4090], [34.7447, 126.4108], [34.7445, 126.4126],
      [34.7442, 126.4144], [34.7438, 126.4162], [34.7432, 126.4180], [34.7450, 126.4116],
      [34.7452, 126.4096], [34.7448, 126.4136],
      // Grandstand rear plaza & F1-ro entrance greenery
      [34.7396, 126.4130], [34.7399, 126.4144], [34.7402, 126.4158], [34.7390, 126.4118],
      [34.7384, 126.4108], [34.7418, 126.4222], [34.7408, 126.4232], [34.7392, 126.4236],
      [34.7374, 126.4244], [34.7356, 126.4252],
      // Marina promenade & West Karting greenbelt
      [34.7294, 126.4185], [34.7295, 126.4165], [34.7296, 126.4144], [34.7298, 126.4122],
      [34.7355, 126.4026], [34.7340, 126.4022], [34.7322, 126.4025], [34.7414, 126.4024]
    ];
    const trunkGeo = new THREE.CylinderGeometry(0.032, 0.048, 0.32, 6);
    const crownGeo = new THREE.DodecahedronGeometry(0.24, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.90, metalness: 0.02 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86, metalness: 0.02, flatShading: true });
    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCoords.length);
    const crownInst = new THREE.InstancedMesh(crownGeo, foliageMat, treeCoords.length);
    const foliagePalette = [0x2d6a3e, 0x357a47, 0x245834, 0x3f8448];
    const _tCol = new THREE.Color();

    treeCoords.forEach(([tLat, tLng], idx) => {
      const tp = worldPosition(tLat, tLng);
      const ty = surfaceHeight(tLat, tLng);
      const s = 0.95 + ((idx * 37) % 10) * 0.042;
      _dummy.position.set(tp.x, ty + 0.16 * s, tp.z);
      _dummy.rotation.set(0, idx * 1.1, 0);
      _dummy.scale.set(s, s, s);
      _dummy.updateMatrix();
      trunkInst.setMatrixAt(idx, _dummy.matrix);

      _dummy.position.set(tp.x, ty + 0.40 * s, tp.z);
      _dummy.scale.set(s * 1.08, s * 0.94, s * 1.08);
      _dummy.updateMatrix();
      crownInst.setMatrixAt(idx, _dummy.matrix);
      _tCol.setHex(foliagePalette[idx % foliagePalette.length]);
      crownInst.setColorAt(idx, _tCol);
    });
    trunkInst.instanceMatrix.needsUpdate = true;
    crownInst.instanceMatrix.needsUpdate = true;
    if (crownInst.instanceColor) crownInst.instanceColor.needsUpdate = true;
    trunkInst.frustumCulled = false;
    crownInst.frustumCulled = false;
    yeongamCircuitGroup.add(trunkInst, crownInst);

    // -------------------------------------------------------------------------
    // 10. Yeongamho Waterfront Yacht Marina (Floating Pontoons + Composite Superyachts)
    // -------------------------------------------------------------------------
    const oceanY = getOceanSurfaceY();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xa47551, roughness: 0.74, metalness: 0.06 });
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.26, metalness: 0.14 });
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.52, side: THREE.DoubleSide });

    const pierPos = worldPosition(34.7274, 126.4158);
    const marinaGroup = new THREE.Group();
    marinaGroup.position.set(pierPos.x, oceanY + 0.05, pierPos.z);

    const mainSpine = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 3.6), woodMat);
    marinaGroup.add(mainSpine);
    [-1.1, -0.2, 0.7, 1.5].forEach((fz) => {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.07, 0.18), woodMat);
      finger.position.set(0, 0, fz);
      marinaGroup.add(finger);
    });
    yeongamCircuitGroup.add(marinaGroup);

    [
      { lat: 34.7276, lng: 126.4146, rotY: 0.08, type: 'motor' },
      { lat: 34.7276, lng: 126.4170, rotY: -0.06, type: 'motor' },
      { lat: 34.7266, lng: 126.4145, rotY: 0.12, type: 'sail' },
      { lat: 34.7266, lng: 126.4171, rotY: -0.15, type: 'motor' },
      { lat: 34.7254, lng: 126.4196, rotY: 0.65, type: 'sail' },
      { lat: 34.7252, lng: 126.4122, rotY: -0.42, type: 'sail' }
    ].forEach((yCfg) => {
      const yp = worldPosition(yCfg.lat, yCfg.lng);
      const boat = new THREE.Group();
      boat.position.set(yp.x, oceanY + 0.05, yp.z);
      boat.rotation.y = yCfg.rotY;

      const hull = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.13, 0.78), hullMat);
      hull.position.y = 0.04;
      hull.castShadow = true;
      boat.add(hull);

      const bow = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.34, 4), hullMat);
      bow.rotation.x = Math.PI / 2;
      bow.rotation.z = Math.PI / 4;
      bow.scale.set(1, 1, 0.52);
      bow.position.set(0, 0.05, 0.52);
      boat.add(bow);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.74), cobaltMat);
      stripe.position.y = 0.07;
      boat.add(stripe);

      if (yCfg.type === 'motor') {
        const salon = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.11, 0.44), glassMat);
        salon.position.set(0, 0.15, 0.02);
        boat.add(salon);
        const flybridge = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.32), hullMat);
        flybridge.position.set(0, 0.23, -0.04);
        boat.add(flybridge);
      } else {
        const deckHouse = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.32), glassMat);
        deckHouse.position.set(0, 0.12, 0.02);
        boat.add(deckHouse);
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.05, 6), silverArmcoMat);
        mast.position.set(0, 0.58, 0.08);
        boat.add(mast);
        const mainSail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.86, 3), sailMat);
        mainSail.position.set(0, 0.58, -0.04);
        mainSail.scale.set(0.12, 1, 1);
        boat.add(mainSail);
      }
      yeongamCircuitGroup.add(boat);
    });

    // -------------------------------------------------------------------------
    // 11. 8 Composite Open-Wheel F1 & GT3 Championship Race Cars with Dynamic Braking Glow
    // -------------------------------------------------------------------------
    const carConfigs = [
      { kind: 'f1',  color: 0xdc2626, accent: 0xfacc15, phase: 0.015, speed: 0.034 }, // Scuderia Rosso F1
      { kind: 'f1',  color: 0x1e3a8a, accent: 0xf59e0b, phase: 0.085, speed: 0.035 }, // Championship Navy F1
      { kind: 'f1',  color: 0xf97316, accent: 0x0f172a, phase: 0.240, speed: 0.034 }, // Papaya Aero F1
      { kind: 'f1',  color: 0x0f766e, accent: 0x99f6e4, phase: 0.390, speed: 0.033 }, // Silver-Teal Works F1
      { kind: 'gt3', color: 0x38bdf8, accent: 0xef4444, phase: 0.540, speed: 0.030 }, // N-Performance Blue GT3
      { kind: 'gt3', color: 0x10b981, accent: 0xfef08a, phase: 0.675, speed: 0.029 }, // AMR Emerald GT3
      { kind: 'gt3', color: 0xf8fafc, accent: 0xdc2626, phase: 0.805, speed: 0.030 }, // Weissach White Cup GT3
      { kind: 'gt3', color: 0xfacc15, accent: 0x111827, phase: 0.925, speed: 0.031 }  // Solar Yellow Endurance GT3
    ];

    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.86, metalness: 0.08 });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.42, metalness: 0.38 });
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.12, metalness: 0.72 });
    const headLightMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, emissive: 0xfef08a, emissiveIntensity: 1.25 });
    yeongamEmissiveMaterials.push({ mat: headLightMat, dayInt: 1.1, nightInt: 2.6 });

    const contactShadowGeo = new THREE.PlaneGeometry(0.64, 1.32);
    contactShadowGeo.rotateX(-Math.PI / 2);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x090d14,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3
    });

    const wheelGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.095, 10);
    wheelGeo.rotateZ(Math.PI / 2);

    carConfigs.forEach((cfg) => {
      const car = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.20, metalness: 0.50 });
      const stripeMat = new THREE.MeshStandardMaterial({ color: cfg.accent, roughness: 0.30, metalness: 0.25 });
      const brakeTailMat = new THREE.MeshStandardMaterial({
        color: 0xff2b2b,
        emissive: 0xef4444,
        emissiveIntensity: 0.85,
        roughness: 0.20
      });

      const shadowDisc = new THREE.Mesh(contactShadowGeo, contactShadowMat);
      shadowDisc.position.y = 0.012;
      car.add(shadowDisc);

      if (cfg.kind === 'f1') {
        // Composite Open-Wheel Formula 1 Car (10 parts: floor, tapered nosecone, sidepods, Halo, airbox, front & DRS rear wings, 4 exposed slicks)
        const floor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 1.06), carbonMat);
        floor.position.y = 0.045;
        car.add(floor);

        const nose = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.72), bodyMat);
        nose.position.set(0, 0.10, 0.22);
        nose.castShadow = true;
        car.add(nose);

        const frontWing = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.024, 0.14), stripeMat);
        frontWing.position.set(0, 0.055, 0.56);
        car.add(frontWing);

        const sidepods = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.11, 0.54), bodyMat);
        sidepods.position.set(0, 0.11, -0.06);
        sidepods.castShadow = true;
        car.add(sidepods);

        const engineCover = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.44), bodyMat);
        engineCover.position.set(0, 0.19, -0.18);
        car.add(engineCover);

        const halo = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.22), carbonMat);
        halo.position.set(0, 0.18, 0.06);
        car.add(halo);

        const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), stripeMat);
        helmet.position.set(0, 0.18, 0.01);
        car.add(helmet);

        const rearWing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.032, 0.14), carbonMat);
        rearWing.position.set(0, 0.27, -0.50);
        car.add(rearWing);
        [-0.21, 0.21].forEach((epX) => {
          const ep = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.11, 0.16), stripeMat);
          ep.position.set(epX, 0.24, -0.50);
          car.add(ep);
        });

        const rainLight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), brakeTailMat);
        rainLight.position.set(0, 0.12, -0.55);
        car.add(rainLight);

        [
          [-0.26, 0.082, 0.36],
          [0.26, 0.082, 0.36],
          [-0.27, 0.082, -0.34],
          [0.27, 0.082, -0.34]
        ].forEach(([wx, wy, wz]) => {
          const wheel = new THREE.Mesh(wheelGeo, tireMat);
          wheel.position.set(wx, wy, wz);
          car.add(wheel);
        });
      } else {
        // Composite Widebody GT3 Endurance Supercar
        const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.028, 1.12), carbonMat);
        splitter.position.y = 0.048;
        car.add(splitter);

        const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 1.04), bodyMat);
        chassis.position.y = 0.11;
        chassis.castShadow = true;
        car.add(chassis);

        const liveryStripe = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.126, 1.045), stripeMat);
        liveryStripe.position.y = 0.112;
        car.add(liveryStripe);

        const canopyGlass = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.11, 0.44), cabinMat);
        canopyGlass.position.set(0, 0.20, -0.02);
        car.add(canopyGlass);

        const sharkFin = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.09, 0.28), carbonMat);
        sharkFin.position.set(0, 0.22, -0.28);
        car.add(sharkFin);

        const rearWing = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.028, 0.13), carbonMat);
        rearWing.position.set(0, 0.27, -0.47);
        car.add(rearWing);
        [-0.25, 0.25].forEach((epX) => {
          const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.15), stripeMat);
          endplate.position.set(epX, 0.26, -0.47);
          car.add(endplate);
        });

        [-0.15, 0.15].forEach((hlX) => {
          const hl = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.04), headLightMat);
          hl.position.set(hlX, 0.11, 0.52);
          car.add(hl);
        });
        const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.038, 0.04), brakeTailMat);
        taillight.position.set(0, 0.13, -0.52);
        car.add(taillight);

        [
          [-0.23, 0.082, 0.33],
          [0.23, 0.082, 0.33],
          [-0.23, 0.082, -0.33],
          [0.23, 0.082, -0.33]
        ].forEach(([wx, wy, wz]) => {
          const wheel = new THREE.Mesh(wheelGeo, tireMat);
          wheel.position.set(wx, wy, wz);
          car.add(wheel);
        });
      }

      yeongamTrackCurve.getPointAt(cfg.phase, _carPos);
      yeongamTrackCurve.getPointAt((cfg.phase + 0.008) % 1, _carNextPos);
      car.position.set(_carPos.x, _carPos.y + 0.025, _carPos.z);
      car.lookAt(_carNextPos.x, _carNextPos.y + 0.025, _carNextPos.z);

      yeongamCircuitGroup.add(car);
      yeongamAnimCars.push({ mesh: car, phase: cfg.phase, speed: cfg.speed, speedProfile, brakeTailMat });
    });

    scene.add(yeongamCircuitGroup);
  }

  function buildDanyangLandmarks() {
    if (danyangLandmarksGroup) {
      disposeObject(danyangLandmarksGroup);
      danyangLandmarksGroup = null;
      danyangWaterAccentsGroup = null;
    }
    if (currentRegionId !== 'danyang') return;

    danyangLandmarksGroup = new THREE.Group();
    danyangLandmarksGroup.name = 'danyang-landmarks';

    danyangWaterAccentsGroup = new THREE.Group();
    danyangWaterAccentsGroup.name = 'danyang-water-accents';
    danyangWaterAccentsGroup.visible = state.showOcean;
    danyangLandmarksGroup.add(danyangWaterAccentsGroup);

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd9e0e6, roughness: 0.72, metalness: 0.08 });
    const darkConcreteMat = new THREE.MeshStandardMaterial({ color: 0x8b96a2, roughness: 0.80, metalness: 0.10 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, metalness: 0.05 });
    const karstRockMat = new THREE.MeshStandardMaterial({ color: 0xaeb6ae, roughness: 0.88, metalness: 0.03, flatShading: true });
    const paleGraniteMat = new THREE.MeshStandardMaterial({ color: 0xcbc9c0, roughness: 0.84, metalness: 0.04, flatShading: true });
    const pineFoliageMat = new THREE.MeshStandardMaterial({ color: 0x2f5e39, roughness: 0.90, metalness: 0.02, flatShading: true });
    const mapleFoliageMat = new THREE.MeshStandardMaterial({ color: 0xb94e32, roughness: 0.88, metalness: 0.02, flatShading: true });
    const crimsonSteelMat = new THREE.MeshStandardMaterial({ color: 0xc2382b, roughness: 0.42, metalness: 0.45 });
    const blueSteelMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.40, metalness: 0.42 });
    const whiteSteelMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.34, metalness: 0.36 });
    const pavilionWoodMat = new THREE.MeshStandardMaterial({ color: 0x8c2f23, roughness: 0.65, metalness: 0.06 });
    const tileRoofMat = new THREE.MeshStandardMaterial({ color: 0x27303a, roughness: 0.58, metalness: 0.14 });
    const skyGlassMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.15,
      metalness: 0.55,
      transparent: true,
      opacity: 0.82
    });
    const warmBeaconMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.28,
      roughness: 0.3
    });
    regionalEmissiveMaterials.push({ mat: warmBeaconMat, dayInt: 0.22, nightInt: 1.45 });

    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xe6f8fc,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // -------------------------------------------------------------------------
    // 1. Chungju Concrete Gravity Dam (충주댐, 97.5m high, 447m crest) & Observatory
    // -------------------------------------------------------------------------
    {
      const damPos = worldPosition(37.0016, 127.9926);
      const lakeSurfY = surfaceHeight(37.0016, 127.9975);
      const tailSurfY = surfaceHeight(37.0016, 127.9885);
      const crestY = Math.max(lakeSurfY + 0.28, tailSurfY + 1.05);
      const damBaseY = Math.max(0.05, tailSurfY - 0.18);
      const damH = Math.max(0.85, crestY - damBaseY);
      const damSpanZ = 2.65;

      const damGroup = new THREE.Group();
      damGroup.position.set(damPos.x, damBaseY, damPos.z);

      // Sloped concrete gravity dam profile in X-Y plane (upstream +X vertical, downstream -X sloped)
      const damShape = new THREE.Shape();
      damShape.moveTo(0.26, 0);
      damShape.lineTo(0.26, damH);
      damShape.lineTo(-0.14, damH);
      damShape.lineTo(-0.78, damH * 0.16);
      damShape.lineTo(-0.92, 0);
      damShape.closePath();

      const damGeo = new THREE.ExtrudeGeometry(damShape, {
        depth: damSpanZ,
        bevelEnabled: false,
        steps: 1
      });
      damGeo.translate(0, 0, -damSpanZ * 0.5);
      const damWall = new THREE.Mesh(damGeo, concreteMat);
      damWall.castShadow = true;
      damWall.receiveShadow = true;
      damGroup.add(damWall);

      // Crest roadway & guardrails
      const crestRoad = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, damSpanZ + 0.24), asphaltMat);
      crestRoad.position.set(0.06, damH + 0.03, 0);
      damGroup.add(crestRoad);

      // 5 Spillway piers + radial taintor gates along center of dam crest
      const gateMat = new THREE.MeshStandardMaterial({ color: 0x3b6e8c, roughness: 0.45, metalness: 0.45 });
      for (let i = -2; i <= 2; i++) {
        const gz = i * 0.34;
        const pier = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.08), darkConcreteMat);
        pier.position.set(0.02, damH + 0.11, gz - 0.17);
        pier.castShadow = true;
        damGroup.add(pier);

        const gate = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.20, 0.24), gateMat);
        gate.position.set(0.14, damH - 0.06, gz);
        damGroup.add(gate);

        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), warmBeaconMat);
        lamp.position.set(0.02, damH + 0.27, gz - 0.17);
        damGroup.add(lamp);
      }
      const endPier = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.08), darkConcreteMat);
      endPier.position.set(0.02, damH + 0.11, 2 * 0.34 + 0.17);
      damGroup.add(endPier);

      // Downstream Hydroelectric Powerhouse (충주수력발전소) at south toe
      const powerHouse = new THREE.Mesh(new THREE.BoxGeometry(0.62, damH * 0.38, 0.78), whiteSteelMat);
      powerHouse.position.set(-0.76, damH * 0.19, 0.72);
      powerHouse.castShadow = true;
      damGroup.add(powerHouse);

      const powerRoof = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.06, 0.82), blueSteelMat);
      powerRoof.position.set(-0.76, damH * 0.38 + 0.03, 0.72);
      damGroup.add(powerRoof);

      danyangLandmarksGroup.add(damGroup);

      // Foamy spillway tailrace apron & downstream whitewater shimmer
      const tailFoam = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.45), foamMat);
      tailFoam.rotation.x = -Math.PI / 2;
      tailFoam.position.set(damPos.x - 1.25, tailSurfY + 0.06, damPos.z - 0.12);
      danyangWaterAccentsGroup.add(tailFoam);

      // Chungju Dam Water Culture Observatory Tower (물문화관 전망대) on north abutment
      const obsPos = worldPosition(37.0038, 127.9945);
      const obsY = surfaceHeight(37.0038, 127.9945);
      const obsGroup = new THREE.Group();
      obsGroup.position.set(obsPos.x, obsY, obsPos.z);

      const podium = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.26, 12), concreteMat);
      podium.position.y = 0.13;
      podium.castShadow = true;
      obsGroup.add(podium);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 0.78, 10), whiteSteelMat);
      shaft.position.y = 0.56;
      shaft.castShadow = true;
      obsGroup.add(shaft);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.20, 12), skyGlassMat);
      crown.position.y = 0.98;
      obsGroup.add(crown);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.07, 12), whiteSteelMat);
      cap.position.y = 1.11;
      obsGroup.add(cap);

      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), warmBeaconMat);
      beacon.position.y = 1.20;
      obsGroup.add(beacon);

      danyangLandmarksGroup.add(obsGroup);
    }

    // Helper for traditional Korean hexagonal pavilion (정자)
    function createKoreanPavilion(scale) {
      const s = scale || 1.0;
      const g = new THREE.Group();
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.24 * s, 0.28 * s, 0.10 * s, 6), concreteMat);
      plinth.position.y = 0.05 * s;
      g.add(plinth);

      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * s, 0.025 * s, 0.22 * s, 6), pavilionWoodMat);
        col.position.set(Math.cos(ang) * 0.17 * s, 0.20 * s, Math.sin(ang) * 0.17 * s);
        g.add(col);
      }

      const roofLower = new THREE.Mesh(new THREE.ConeGeometry(0.34 * s, 0.16 * s, 6), tileRoofMat);
      roofLower.position.y = 0.37 * s;
      roofLower.castShadow = true;
      g.add(roofLower);

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.08 * s, 0.08 * s, 6), warmBeaconMat);
      finial.position.y = 0.47 * s;
      g.add(finial);
      return g;
    }

    // Helper for sightseeing ferry / excursion boat (유람선)
    function createCruiseBoat(lat, lng, yawRad, scale) {
      const s = scale || 1.0;
      const pos = worldPosition(lat, lng);
      const wy = surfaceHeight(lat, lng) + 0.035;
      const boat = new THREE.Group();
      boat.position.set(pos.x, wy, pos.z);
      boat.rotation.y = yawRad;

      const hull = new THREE.Mesh(new THREE.BoxGeometry(0.28 * s, 0.10 * s, 0.74 * s), whiteSteelMat);
      hull.position.y = 0.05 * s;
      hull.castShadow = true;
      boat.add(hull);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.29 * s, 0.03 * s, 0.75 * s), blueSteelMat);
      stripe.position.y = 0.08 * s;
      boat.add(stripe);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.22 * s, 0.11 * s, 0.48 * s), skyGlassMat);
      cabin.position.set(0, 0.15 * s, -0.02 * s);
      boat.add(cabin);

      const upperDeck = new THREE.Mesh(new THREE.BoxGeometry(0.24 * s, 0.04 * s, 0.52 * s), whiteSteelMat);
      upperDeck.position.set(0, 0.22 * s, -0.02 * s);
      boat.add(upperDeck);

      const cabinGlow = new THREE.Mesh(new THREE.BoxGeometry(0.16 * s, 0.06 * s, 0.34 * s), warmBeaconMat);
      cabinGlow.position.set(0, 0.14 * s, -0.02 * s);
      boat.add(cabinGlow);

      danyangLandmarksGroup.add(boat);

      // Subtle V-wake behind cruise boat
      const wakeGeo = new THREE.RingGeometry(0.14 * s, 0.42 * s, 16, 1, Math.PI * 1.25, Math.PI * 0.5);
      wakeGeo.rotateX(-Math.PI / 2);
      const wake = new THREE.Mesh(wakeGeo, foamMat);
      wake.position.set(pos.x, wy + 0.015, pos.z);
      wake.rotation.y = yawRad;
      danyangWaterAccentsGroup.add(wake);
    }

    // -------------------------------------------------------------------------
    // 2. Dodamsambong (도담삼봉, 제1경) & Seokmun Stone Arch (석문, 제2경)
    // -------------------------------------------------------------------------
    {
      const centerPos = worldPosition(36.9916, 128.3432);
      const riverLevelY = surfaceHeight(36.9916, 128.3472);

      const sambongSpecs = [
        // Cheopbong (첩봉, NW peak)
        { dx: -0.52, dz: -0.26, rBot: 0.30, rTop: 0.11, h: 0.68, tiltZ: 0.14, pavilion: false },
        // Janggunbong (장군봉, tallest central peak with hexagonal Sambong Pavilion)
        { dx: 0.0, dz: 0.0, rBot: 0.42, rTop: 0.18, h: 0.96, tiltZ: -0.05, pavilion: true },
        // Cheobong (처봉, SE peak)
        { dx: 0.54, dz: 0.24, rBot: 0.33, rTop: 0.13, h: 0.74, tiltZ: -0.11, pavilion: false }
      ];

      sambongSpecs.forEach((sp, idx) => {
        const peakGrp = new THREE.Group();
        peakGrp.position.set(centerPos.x + sp.dx, riverLevelY - 0.08, centerPos.z + sp.dz);

        const mainCrag = new THREE.Mesh(
          new THREE.CylinderGeometry(sp.rTop, sp.rBot, sp.h, 7),
          karstRockMat
        );
        mainCrag.position.y = sp.h * 0.5;
        mainCrag.rotation.z = sp.tiltZ;
        mainCrag.rotation.y = idx * 1.1;
        mainCrag.castShadow = true;
        mainCrag.receiveShadow = true;
        peakGrp.add(mainCrag);

        const shoulder = new THREE.Mesh(
          new THREE.DodecahedronGeometry(sp.rBot * 0.62, 0),
          karstRockMat
        );
        shoulder.position.set(sp.rBot * 0.35, sp.h * 0.34, -sp.rBot * 0.2);
        shoulder.castShadow = true;
        peakGrp.add(shoulder);

        const pineTuft = new THREE.Mesh(
          new THREE.ConeGeometry(sp.rTop * 0.85, 0.22, 6),
          idx === 1 ? pineFoliageMat : mapleFoliageMat
        );
        pineTuft.position.set(-sp.rTop * 0.35, sp.h * 0.78, sp.rTop * 0.2);
        peakGrp.add(pineTuft);

        if (sp.pavilion) {
          const pav = createKoreanPavilion(0.82);
          pav.position.set(0.02, sp.h - 0.02, 0);
          peakGrp.add(pav);
        }

        danyangLandmarksGroup.add(peakGrp);

        const waterRing = new THREE.Mesh(
          new THREE.RingGeometry(sp.rBot * 0.92, sp.rBot * 1.32, 18),
          foamMat
        );
        waterRing.rotation.x = -Math.PI / 2;
        waterRing.position.set(centerPos.x + sp.dx, riverLevelY + 0.05, centerPos.z + sp.dz);
        danyangWaterAccentsGroup.add(waterRing);
      });

      // Seokmun (석문, 제2경) Natural Karst Stone Rainbow Arch on north cliff
      const seokPos = worldPosition(36.9985, 128.3398);
      const seokY = surfaceHeight(36.9985, 128.3398);
      const seokGrp = new THREE.Group();
      seokGrp.position.set(seokPos.x, seokY - 0.08, seokPos.z);
      seokGrp.rotation.y = 0.42;

      const archMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.14, 7, 14, Math.PI),
        karstRockMat
      );
      archMesh.position.y = 0.28;
      archMesh.castShadow = true;
      seokGrp.add(archMesh);

      [-0.40, 0.40].forEach((px) => {
        const pierRock = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.42, 6), karstRockMat);
        pierRock.position.set(px, 0.16, 0);
        pierRock.castShadow = true;
        seokGrp.add(pierRock);
      });
      danyangLandmarksGroup.add(seokGrp);

      createCruiseBoat(36.9902, 128.3468, -0.65, 0.9);
    }

    // -------------------------------------------------------------------------
    // 3. Oksun Bridge (옥순대교), Oksunbong (제4경), Gudambong (제3경) & Cruise Boats
    // -------------------------------------------------------------------------
    {
      const pNorth = worldPosition(36.9426, 128.2146);
      const pSouth = worldPosition(36.9378, 128.2184);
      const lakeY = surfaceHeight(36.9402, 128.2165);
      const midX = (pNorth.x + pSouth.x) * 0.5;
      const midZ = (pNorth.z + pSouth.z) * 0.5;
      const spanLen = Math.hypot(pSouth.x - pNorth.x, pSouth.z - pNorth.z);
      const yaw = Math.atan2(pSouth.x - pNorth.x, pSouth.z - pNorth.z);
      const deckY = lakeY + 0.52;

      const oksunBridge = new THREE.Group();
      oksunBridge.position.set(midX, deckY, midZ);
      oksunBridge.rotation.y = yaw;

      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, spanLen + 0.4), asphaltMat);
      deck.castShadow = true;
      oksunBridge.add(deck);

      const deckTrim = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, spanLen + 0.4), crimsonSteelMat);
      deckTrim.position.y = -0.03;
      oksunBridge.add(deckTrim);

      // Twin crimson tied-arch ribs + vertical hangers
      const archRadius = spanLen * 0.38;
      [-0.17, 0.17].forEach((offsetX) => {
        const arch = new THREE.Mesh(
          new THREE.TorusGeometry(archRadius, 0.045, 8, 20, Math.PI),
          crimsonSteelMat
        );
        arch.rotation.y = Math.PI / 2;
        arch.scale.set(1.0, 0.62, 1.0);
        arch.castShadow = true;
        oksunBridge.add(arch);
      });

      for (let h = -3; h <= 3; h++) {
        const hz = (h / 4) * archRadius * 0.88;
        const hangerH = Math.max(0.1, Math.sqrt(Math.max(0, archRadius * archRadius - hz * hz)) * 0.60);
        [-0.17, 0.17].forEach((offsetX) => {
          const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, hangerH, 5), whiteSteelMat);
          strut.position.set(offsetX, hangerH * 0.5, hz);
          oksunBridge.add(strut);
        });
      }

      // Concrete water piers grounded into lake bed
      [-archRadius, archRadius].forEach((pz) => {
        const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.78, 8), concreteMat);
        pier.position.set(0, -0.39, pz);
        oksunBridge.add(pier);
      });

      danyangLandmarksGroup.add(oksunBridge);

      // Oksunbong (옥순봉, 제4경) bamboo-shoot stone spires on north gorge cliff
      const oksunPos = worldPosition(36.9438, 128.2225);
      const oksunBaseY = surfaceHeight(36.9438, 128.2225) - 0.12;
      const oksunSpires = new THREE.Group();
      oksunSpires.position.set(oksunPos.x, oksunBaseY, oksunPos.z);
      [
        [-0.36, 0.08, 0.16, 0.85],
        [-0.12, -0.06, 0.20, 1.08],
        [0.14, 0.04, 0.18, 0.96],
        [0.38, -0.05, 0.15, 0.78],
        [0.02, 0.22, 0.14, 0.72]
      ].forEach(([sx, sz, sr, sh], idx) => {
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(sr * 0.36, sr, sh, 6), paleGraniteMat);
        spire.position.set(sx, sh * 0.5, sz);
        spire.rotation.y = idx * 0.8;
        spire.castShadow = true;
        oksunSpires.add(spire);
      });
      danyangLandmarksGroup.add(oksunSpires);

      // Gudambong (구담봉, 제3경) tortoise-shell cliff crag on south gorge ridge
      const gudamPos = worldPosition(36.9382, 128.2365);
      const gudamBaseY = surfaceHeight(36.9382, 128.2365) - 0.10;
      const gudamGrp = new THREE.Group();
      gudamGrp.position.set(gudamPos.x, gudamBaseY, gudamPos.z);

      const tortoiseShell = new THREE.Mesh(new THREE.DodecahedronGeometry(0.46, 0), paleGraniteMat);
      tortoiseShell.scale.set(1.35, 1.15, 0.95);
      tortoiseShell.position.y = 0.42;
      tortoiseShell.castShadow = true;
      gudamGrp.add(tortoiseShell);

      const tortoiseHead = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.62, 6), paleGraniteMat);
      tortoiseHead.position.set(-0.42, 0.48, -0.18);
      tortoiseHead.rotation.z = 0.28;
      tortoiseHead.castShadow = true;
      gudamGrp.add(tortoiseHead);
      danyangLandmarksGroup.add(gudamGrp);

      // Janghoe Ferry Dock (장회나루) & Chungjuho Sightseeing Boats
      const pierPos = worldPosition(36.9365, 128.2392);
      const pierY = surfaceHeight(36.9395, 128.2375) + 0.05;
      const janghoeDock = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.28), whiteSteelMat);
      janghoeDock.position.set(pierPos.x, pierY, pierPos.z);
      danyangLandmarksGroup.add(janghoeDock);

      createCruiseBoat(36.9405, 128.2295, 1.42, 1.1);
      createCruiseBoat(36.9865, 128.1020, 1.65, 1.15);
    }

    // -------------------------------------------------------------------------
    // 4. Mancheonha Skywalk (만천하 스카이워크), Gosu Bridge, Cheongpung Bridge & Sainam
    // -------------------------------------------------------------------------
    {
      // Mancheonha Spiral Observation Tower & 3-Finger Cantilevered Skywalk
      const mcPos = worldPosition(36.9685, 128.3490);
      const mcY = surfaceHeight(36.9685, 128.3490);
      const mcGroup = new THREE.Group();
      mcGroup.position.set(mcPos.x, mcY - 0.05, mcPos.z);

      const basePad = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.16, 16), concreteMat);
      basePad.position.y = 0.08;
      mcGroup.add(basePad);

      // Central structural columns + 3 inclined spiral ramp rings
      for (let c = 0; c < 4; c++) {
        const ang = (c / 4) * Math.PI * 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.92, 6), whiteSteelMat);
        col.position.set(Math.cos(ang) * 0.24, 0.50, Math.sin(ang) * 0.24);
        col.castShadow = true;
        mcGroup.add(col);
      }
      [0.28, 0.56, 0.84].forEach((ry, idx) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 7, 20), whiteSteelMat);
        ring.rotation.x = Math.PI / 2 + (idx < 2 ? 0.09 : 0);
        ring.position.y = ry;
        ring.castShadow = true;
        mcGroup.add(ring);
      });

      // 3-Finger cantilevered glass skywalk extending out over the Namhangang horseshoe cliff
      [-0.36, 0.0, 0.36].forEach((angOffset) => {
        const finger = new THREE.Group();
        finger.position.set(0, 0.90, 0);
        finger.rotation.y = 1.15 + angOffset;
        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.68), whiteSteelMat);
        beam.position.z = 0.36;
        beam.castShadow = true;
        finger.add(beam);
        const glassDeck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.30), skyGlassMat);
        glassDeck.position.set(0, 0.02, 0.58);
        finger.add(glassDeck);
        mcGroup.add(finger);
      });

      const mcBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), warmBeaconMat);
      mcBeacon.position.y = 0.98;
      mcGroup.add(mcBeacon);
      danyangLandmarksGroup.add(mcGroup);

      // Gosu Bridge (고수대교) arched steel truss bridge at Danyang town waterfront
      const gosuW = worldPosition(36.9844, 128.3596);
      const gosuE = worldPosition(36.9832, 128.3654);
      const gosuY = surfaceHeight(36.9838, 128.3625) + 0.38;
      const gosuLen = Math.hypot(gosuE.x - gosuW.x, gosuE.z - gosuW.z);
      const gosuGrp = new THREE.Group();
      gosuGrp.position.set((gosuW.x + gosuE.x) * 0.5, gosuY, (gosuW.z + gosuE.z) * 0.5);
      gosuGrp.rotation.y = Math.atan2(gosuE.x - gosuW.x, gosuE.z - gosuW.z);

      const gosuDeck = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, gosuLen + 0.3), asphaltMat);
      gosuGrp.add(gosuDeck);
      [-gosuLen * 0.24, gosuLen * 0.24].forEach((az) => {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(gosuLen * 0.22, 0.035, 6, 16, Math.PI), blueSteelMat);
        arch.rotation.y = Math.PI / 2;
        arch.scale.set(1.0, 0.55, 1.0);
        arch.position.z = az;
        gosuGrp.add(arch);
      });
      danyangLandmarksGroup.add(gosuGrp);

      // Cheongpung Cable-Stayed Bridge (청풍대교) & Bibongsan Summit Observatory
      const cpN = worldPosition(37.0038, 128.1652);
      const cpS = worldPosition(36.9972, 128.1668);
      const cpY = surfaceHeight(37.0005, 128.1660) + 0.48;
      const cpLen = Math.hypot(cpS.x - cpN.x, cpS.z - cpN.z);
      const cpBridge = new THREE.Group();
      cpBridge.position.set((cpN.x + cpS.x) * 0.5, cpY, (cpN.z + cpS.z) * 0.5);
      cpBridge.rotation.y = Math.atan2(cpS.x - cpN.x, cpS.z - cpN.z);

      cpBridge.add(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, cpLen + 0.3), whiteSteelMat));
      const cableLineMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.78 });
      [-cpLen * 0.22, cpLen * 0.22].forEach((pz) => {
        const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35, 0.12), whiteSteelMat);
        pylon.position.set(0, 0.36, pz);
        pylon.castShadow = true;
        cpBridge.add(pylon);

        const cPts = [];
        [-0.75, -0.45, 0.45, 0.75].forEach((off) => {
          cPts.push(new THREE.Vector3(0, 0.98, pz), new THREE.Vector3(0, 0.04, pz + off));
        });
        cpBridge.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(cPts), cableLineMat));
      });
      danyangLandmarksGroup.add(cpBridge);

      const bibongPos = worldPosition(36.9912, 128.1642);
      const bibongY = surfaceHeight(36.9912, 128.1642);
      const bibongStn = new THREE.Group();
      bibongStn.position.set(bibongPos.x, bibongY - 0.04, bibongPos.z);
      const stnBox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.36), whiteSteelMat);
      stnBox.position.y = 0.13;
      stnBox.castShadow = true;
      bibongStn.add(stnBox);
      const stnDeck = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.44), skyGlassMat);
      stnDeck.position.y = 0.30;
      bibongStn.add(stnDeck);
      danyangLandmarksGroup.add(bibongStn);

      // Sainam (사인암, 제5경) 70m Vertical Grid-Jointed Sheer Cliff + Cheongnyeonam Pavilion
      const sainamPos = worldPosition(36.9155, 128.3588);
      const sainamY = surfaceHeight(36.9155, 128.3580);
      const sainamGrp = new THREE.Group();
      sainamGrp.position.set(sainamPos.x, sainamY - 0.08, sainamPos.z);

      for (let b = -2; b <= 2; b++) {
        const colH = 0.88 + (2 - Math.abs(b)) * 0.14;
        const monolith = new THREE.Mesh(new THREE.BoxGeometry(0.18, colH, 0.24), paleGraniteMat);
        monolith.position.set(0.18, colH * 0.5, b * 0.20);
        monolith.castShadow = true;
        sainamGrp.add(monolith);
      }
      const sainamPav = createKoreanPavilion(0.76);
      sainamPav.position.set(-0.22, 0.06, 0.05);
      sainamGrp.add(sainamPav);
      danyangLandmarksGroup.add(sainamGrp);
    }

    scene.add(danyangLandmarksGroup);
  }

  function buildHaeundaeLandmarks() {
    if (haeundaeLandmarksGroup) {
      disposeObject(haeundaeLandmarksGroup);
      haeundaeLandmarksGroup = null;
    }
    if (currentRegionId !== 'haeundae') return;

    haeundaeLandmarksGroup = new THREE.Group();
    haeundaeLandmarksGroup.name = 'haeundae-landmarks';

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.72, metalness: 0.08 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.86, metalness: 0.05 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.36, metalness: 0.62 });
    const glassBlueMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.16,
      metalness: 0.56,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.14
    });
    const glassSilverMat = new THREE.MeshStandardMaterial({
      color: 0xcbe3f5,
      roughness: 0.18,
      metalness: 0.52,
      emissive: 0xfef08a,
      emissiveIntensity: 0.10
    });
    const warmAtriumMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.22,
      metalness: 0.25,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.22
    });
    regionalEmissiveMaterials.push(
      { mat: glassBlueMat, dayInt: 0.14, nightInt: 0.72 },
      { mat: glassSilverMat, dayInt: 0.10, nightInt: 0.86 },
      { mat: warmAtriumMat, dayInt: 0.22, nightInt: 1.15 }
    );

    function groundTower(lat, lng, width, depth, height, mat, rotY = 0, taperTop = 1.0) {
      const { x, z } = worldPosition(lat, lng);
      const y = Math.max(0.04, surfaceHeight(lat, lng));
      const grp = new THREE.Group();
      grp.position.set(x, y - 0.12, z);
      grp.rotation.y = rotY;
      const bodyGeo = taperTop < 0.99
        ? new THREE.CylinderGeometry(width * 0.55 * taperTop, width * 0.58, height, 6)
        : new THREE.BoxGeometry(width, height, depth);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.position.y = height * 0.5;
      body.castShadow = true;
      body.receiveShadow = true;
      grp.add(body);
      const crown = new THREE.Mesh(
        taperTop < 0.99
          ? new THREE.CylinderGeometry(width * 0.42 * taperTop, width * 0.52 * taperTop, 0.16, 6)
          : new THREE.BoxGeometry(width * 0.82, 0.14, depth * 0.82),
        steelMat
      );
      crown.position.y = height + 0.06;
      grp.add(crown);
      haeundaeLandmarksGroup.add(grp);
      return grp;
    }

    // 1. LCT The Sharp Landmark Complex (101F Landmark Tower + Twin 85F Residential Towers)
    const lctPos = worldPosition(35.1600, 129.1688);
    const lctY = Math.max(0.05, surfaceHeight(35.1600, 129.1688));
    const lctPodium = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 1.35), concreteMat);
    lctPodium.position.set(lctPos.x, lctY + 0.12, lctPos.z);
    lctPodium.rotation.y = -0.22;
    lctPodium.castShadow = true;
    haeundaeLandmarksGroup.add(lctPodium);

    const lctMain = groundTower(35.1600, 129.1688, 0.82, 0.82, 4.95, glassBlueMat, -0.22, 0.82);
    const lctSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 0.55, 8), steelMat);
    lctSpire.position.y = 5.25;
    lctMain.add(lctSpire);
    const lctBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    lctBeacon.position.y = 5.54;
    lctMain.add(lctBeacon);

    groundTower(35.1597, 129.1674, 0.72, 0.72, 3.85, glassSilverMat, 0.18, 0.90);
    groundTower(35.1605, 129.1701, 0.70, 0.70, 3.65, glassSilverMat, -0.35, 0.90);

    // 2. Marine City Waterfront High-Rise Skyline (Zenith, I'Park, Seawall Crescent)
    groundTower(35.1560, 129.1444, 0.76, 0.64, 3.75, glassBlueMat, 0.25, 0.86);  // Doosan Zenith 101
    groundTower(35.1553, 129.1449, 0.70, 0.58, 3.40, glassSilverMat, 0.25, 0.88);
    groundTower(35.1546, 129.1455, 0.64, 0.54, 3.05, glassBlueMat, 0.25, 0.90);
    groundTower(35.1550, 129.1469, 0.82, 0.56, 3.62, glassSilverMat, -0.45, 0.88); // Haeundae I'Park
    groundTower(35.1542, 129.1476, 0.72, 0.52, 3.18, glassBlueMat, -0.40, 0.90);
    groundTower(35.1530, 129.1463, 0.65, 0.56, 2.75, glassSilverMat, 0.42, 1.0);   // Marine City Seawall
    groundTower(35.1524, 129.1474, 0.62, 0.54, 2.55, glassBlueMat, 0.35, 1.0);
    groundTower(35.1535, 129.1486, 0.58, 0.52, 2.35, glassSilverMat, -0.25, 1.0);

    // 3. Centum City BEXCO Exhibition Hall & Glass Business Hub
    const bexcoPos = worldPosition(35.1686, 129.1362);
    const bexcoY = Math.max(0.05, surfaceHeight(35.1686, 129.1362));
    const bexcoGrp = new THREE.Group();
    bexcoGrp.position.set(bexcoPos.x, bexcoY, bexcoPos.z);
    bexcoGrp.rotation.y = 0.22;
    const bexcoHall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.48, 1.95), concreteMat);
    bexcoHall.position.y = 0.24;
    bexcoHall.castShadow = true;
    bexcoGrp.add(bexcoHall);
    const bexcoRoof = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 3.3, 12, 1, false, 0, Math.PI), glassSilverMat);
    bexcoRoof.rotation.z = Math.PI / 2;
    bexcoRoof.scale.set(0.32, 1, 0.85);
    bexcoRoof.position.y = 0.48;
    bexcoGrp.add(bexcoRoof);
    haeundaeLandmarksGroup.add(bexcoGrp);

    groundTower(35.1704, 129.1345, 0.84, 0.72, 2.35, glassBlueMat, 0.15, 1.0);
    groundTower(35.1668, 129.1342, 0.76, 0.68, 2.15, glassSilverMat, 0.15, 1.0);
    groundTower(35.1694, 129.1384, 0.72, 0.64, 1.95, glassBlueMat, 0.15, 1.0);

    // 4. Dongbaekseom Nurimaru APEC House & Cliffside Lighthouse
    const nuriPos = worldPosition(35.1516, 129.1523);
    const nuriY = Math.max(0.38, surfaceHeight(35.1516, 129.1523));
    const nurimaru = new THREE.Group();
    nurimaru.position.set(nuriPos.x, nuriY, nuriPos.z);
    const nuriDeck = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.02, 0.34, 20), stoneMat);
    nuriDeck.position.y = 0.08;
    nuriDeck.castShadow = true;
    nurimaru.add(nuriDeck);
    const nuriGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.68, 0.36, 20), warmAtriumMat);
    nuriGlass.position.y = 0.42;
    nurimaru.add(nuriGlass);
    const nuriRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 1.05, 0.24, 24), concreteMat);
    nuriRoof.position.y = 0.70;
    nuriRoof.castShadow = true;
    nurimaru.add(nuriRoof);
    const nuriSkylight = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.09, 16), glassBlueMat);
    nuriSkylight.position.y = 0.85;
    nurimaru.add(nuriSkylight);
    haeundaeLandmarksGroup.add(nurimaru);

    // 5. Coastal Breakwaters, Cheongsapo & Dongbaek Lighthouses
    const lhSpecs = [
      { lat: 35.1495, lng: 129.1524, color: 0xffffff, baseMin: 0.45 }, // Dongbaek Lighthouse
      { lat: 35.1573, lng: 129.1718, color: 0xdc2626, baseMin: 0.02 }, // Mipo Breakwater Red
      { lat: 35.1620, lng: 129.1920, color: 0xdc2626, baseMin: 0.02 }, // Cheongsapo Twin Red
      { lat: 35.1628, lng: 129.1931, color: 0xffffff, baseMin: 0.02 }  // Cheongsapo Twin White
    ];
    const beaconGlowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.75,
      roughness: 0.2
    });
    regionalEmissiveMaterials.push({ mat: beaconGlowMat, dayInt: 0.65, nightInt: 2.1 });

    lhSpecs.forEach((lh) => {
      const pos = worldPosition(lh.lat, lh.lng);
      const y = Math.max(lh.baseMin, surfaceHeight(lh.lat, lh.lng));
      const grp = new THREE.Group();
      grp.position.set(pos.x, y, pos.z);
      const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.50, 0.36, 10), stoneMat);
      pier.position.y = 0.05;
      grp.add(pier);
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.25, 1.15, 10),
        new THREE.MeshStandardMaterial({ color: lh.color, roughness: 0.5, metalness: 0.08 })
      );
      shaft.position.y = 0.78;
      shaft.castShadow = true;
      grp.add(shaft);
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.20, 10), beaconGlowMat);
      lantern.position.y = 1.44;
      grp.add(lantern);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.18, 10), steelMat);
      cap.position.y = 1.62;
      grp.add(cap);
      haeundaeLandmarksGroup.add(grp);
    });

    // 6. Suyeongman Yacht Marina & The Bay 101 Floating Piers + Sailboats
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x9c6b49, roughness: 0.78 });
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.1 });
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide });
    const marinaWaterY = getOceanSurfaceY();

    [
      { lat: 35.1558, lng: 129.1510, rotY: -0.5 },
      { lat: 35.1552, lng: 129.1414, rotY: 0.25 }
    ].forEach((m) => {
      const p = worldPosition(m.lat, m.lng);
      const dock = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 2.5), woodMat);
      dock.position.set(p.x, marinaWaterY + 0.12, p.z);
      dock.rotation.y = m.rotY;
      haeundaeLandmarksGroup.add(dock);
    });

    [
      [35.1554, 129.1502, 0.4],
      [35.1544, 129.1506, -0.3],
      [35.1549, 129.1422, 0.6],
      [35.1558, 129.1408, -0.5],
      [35.1538, 129.1415, 0.15]
    ].forEach(([bLat, bLng, rotY]) => {
      const bp = worldPosition(bLat, bLng);
      const boat = new THREE.Group();
      boat.position.set(bp.x, marinaWaterY + 0.06, bp.z);
      boat.rotation.y = rotY;
      boat.add(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.72), hullMat));
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.88, 6), steelMat);
      mast.position.y = 0.46;
      boat.add(mast);
      const sail = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.70, 3), sailMat);
      sail.position.set(0, 0.48, 0.04);
      sail.scale.set(0.15, 1, 1);
      boat.add(sail);
      haeundaeLandmarksGroup.add(boat);
    });

    // 7. Blueline Park Sky Capsule Elevated Coastal Trestle (Mipo -> Dalmaji -> Cheongsapo)
    const skyRailRaw = [
      [35.1592, 129.1695],
      [35.1586, 129.1738],
      [35.1591, 129.1788],
      [35.1610, 129.1846],
      [35.1631, 129.1912]
    ];
    const skyCurvePts = skyRailRaw.map(([rLat, rLng]) => {
      const { x, z } = worldPosition(rLat, rLng);
      return new THREE.Vector3(x, Math.max(0.45, surfaceHeight(rLat, rLng)) + 0.42, z);
    });
    const skyCurve = new THREE.CatmullRomCurve3(skyCurvePts);
    const railBeam = new THREE.Mesh(new THREE.TubeGeometry(skyCurve, 44, 0.10, 6, false), steelMat);
    haeundaeLandmarksGroup.add(railBeam);

    const capsuleColors = [0xef4444, 0xfacc15, 0x3b82f6, 0x10b981];
    [0.18, 0.42, 0.66, 0.86].forEach((t, idx) => {
      const pt = skyCurve.getPointAt(t);
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.24, 0.22),
        new THREE.MeshStandardMaterial({ color: capsuleColors[idx % capsuleColors.length], roughness: 0.35 })
      );
      cap.position.set(pt.x, pt.y + 0.18, pt.z);
      haeundaeLandmarksGroup.add(cap);
    });

    scene.add(haeundaeLandmarksGroup);
  }

  function buildIncheonLandmarks() {
    if (incheonLandmarksGroup) {
      disposeObject(incheonLandmarksGroup);
      incheonLandmarksGroup = null;
    }
    if (currentRegionId !== 'incheon') return;

    incheonLandmarksGroup = new THREE.Group();
    incheonLandmarksGroup.name = 'incheon-landmarks';

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.74, metalness: 0.08 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.38, metalness: 0.58 });
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.30, metalness: 0.32 });
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.42, metalness: 0.38 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.16,
      metalness: 0.54,
      emissive: 0x0284c7,
      emissiveIntensity: 0.14
    });
    const silverTowerMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.20,
      metalness: 0.56,
      emissive: 0xfef08a,
      emissiveIntensity: 0.10
    });
    regionalEmissiveMaterials.push(
      { mat: glassMat, dayInt: 0.14, nightInt: 0.78 },
      { mat: silverTowerMat, dayInt: 0.10, nightInt: 0.84 }
    );

    // 1. Yeongjong Grand Bridge (영종대교 - Double-Deck Self-Anchored Suspension Bridge)
    const oceanY = getOceanSurfaceY();
    const yjWaypoints = [
      [126.5440, 37.5260],
      [126.5600, 37.5355],
      [126.5760, 37.5435],
      [126.5820, 37.5452], // Main suspension span center
      [126.5880, 37.5468],
      [126.6050, 37.5488],
      [126.6200, 37.5504]
    ];
    const yjDeckPts = yjWaypoints.map(([lng, lat], idx) => {
      const { x, z } = worldPosition(lat, lng);
      const mainWeight = (idx >= 2 && idx <= 4) ? 1.0 : 0.0;
      const baseH = Math.max(0.55, surfaceHeight(lat, lng) + 0.25);
      return new THREE.Vector3(x, mainWeight > 0 ? 1.80 : Math.max(1.10, baseH), z);
    });
    const yjCurve = new THREE.CatmullRomCurve3(yjDeckPts);
    const upperDeck = new THREE.Mesh(new THREE.TubeGeometry(yjCurve, 56, 0.28, 6, false), concreteMat);
    upperDeck.castShadow = true;
    incheonLandmarksGroup.add(upperDeck);

    const lowerDeckPts = yjDeckPts.map((p) => new THREE.Vector3(p.x, p.y - 0.36, p.z));
    const lowerDeck = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lowerDeckPts), 56, 0.22, 6, false),
      steelMat
    );
    incheonLandmarksGroup.add(lowerDeck);

    // Self-anchored inward-sloping twin suspension pylons + catenary cables (proportional height)
    const yjTowerCoords = [
      [126.5775, 37.5440],
      [126.5865, 37.5464]
    ];
    const yjCenter = worldPosition(37.5452, 126.5820);
    const cableMat = new THREE.LineBasicMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.85 });

    const pylonTops = [];
    yjTowerCoords.forEach(([lng, lat]) => {
      const { x, z } = worldPosition(lat, lng);
      const tGrp = new THREE.Group();
      tGrp.position.set(x, 0, z);
      const legGeo = new THREE.CylinderGeometry(0.12, 0.22, 5.2, 8);
      const lLeg = new THREE.Mesh(legGeo, pylonMat);
      lLeg.position.set(-0.36, 2.25, 0);
      lLeg.rotation.z = -0.065;
      lLeg.castShadow = true;
      tGrp.add(lLeg);
      const rLeg = new THREE.Mesh(legGeo, pylonMat);
      rLeg.position.set(0.36, 2.25, 0);
      rLeg.rotation.z = 0.065;
      rLeg.castShadow = true;
      tGrp.add(rLeg);
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.20, 0.26), pylonMat);
      crossBeam.position.y = 4.65;
      tGrp.add(crossBeam);
      const pier = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.4, 1.25), steelMat);
      pier.position.y = oceanY + 0.40;
      tGrp.add(pier);
      incheonLandmarksGroup.add(tGrp);
      pylonTops.push(new THREE.Vector3(x, 4.95, z));
    });

    // Main parabolic suspension cable + vertical suspender hangers
    const anchorWest = yjCurve.getPointAt(0.12);
    const anchorEast = yjCurve.getPointAt(0.88);
    const sagMid = new THREE.Vector3(yjCenter.x, 2.38, yjCenter.z);
    const catenaryCurve = new THREE.CatmullRomCurve3([anchorWest, pylonTops[0], sagMid, pylonTops[1], anchorEast]);
    const catPts = catenaryCurve.getPoints(48);
    incheonLandmarksGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(catPts), cableMat));

    const hangerPts = [];
    for (let s = 4; s < catPts.length - 4; s += 3) {
      const topPt = catPts[s];
      hangerPts.push(topPt, new THREE.Vector3(topPt.x, 1.80, topPt.z));
    }
    incheonLandmarksGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(hangerPts), cableMat));

    for (let i = 0; i < yjDeckPts.length; i++) {
      if (i === 2 || i === 3 || i === 4) continue;
      const p = yjDeckPts[i];
      const pierH = Math.max(0.5, p.y - oceanY + 0.15);
      const pierMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, pierH, 8), steelMat);
      pierMesh.position.set(p.x, oceanY + pierH * 0.5 - 0.1, p.z);
      incheonLandmarksGroup.add(pierMesh);
    }

    // 2. Songdo International City Skyline (Posco Tower, Convensia, Tri-Bowl & Central Park Towers)
    function addSongdoTower(lat, lng, w, d, h, mat, rotY = 0.52, prismSides = 0) {
      const { x, z } = worldPosition(lat, lng);
      const y = Math.max(0.05, surfaceHeight(lat, lng));
      const grp = new THREE.Group();
      grp.position.set(x, y - 0.1, z);
      grp.rotation.y = rotY;
      const geo = prismSides >= 3
        ? new THREE.CylinderGeometry(w * 0.34, w * 0.62, h, prismSides)
        : new THREE.BoxGeometry(w, h, d);
      const body = new THREE.Mesh(geo, mat);
      body.position.y = h * 0.5;
      body.castShadow = true;
      grp.add(body);
      incheonLandmarksGroup.add(grp);
      return grp;
    }

    // Posco Tower-Songdo (305m tapered triangular spire)
    const posco = addSongdoTower(37.3895, 126.6435, 1.05, 1.05, 4.65, glassMat, 0.42, 3);
    const poscoBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    poscoBeacon.position.y = 4.78;
    posco.add(poscoBeacon);

    // Songdo Convensia undulating multi-peak convention pavilion
    const convPos = worldPosition(37.3868, 126.6462);
    const convY = Math.max(0.05, surfaceHeight(37.3868, 126.6462));
    const convGrp = new THREE.Group();
    convGrp.position.set(convPos.x, convY, convPos.z);
    convGrp.rotation.y = 0.56;
    [-0.75, 0, 0.75].forEach((ox) => {
      const peak = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.52, 4), pylonMat);
      peak.position.set(ox, 0.26, 0);
      peak.rotation.y = Math.PI / 4;
      peak.scale.set(0.85, 1, 1.45);
      peak.castShadow = true;
      convGrp.add(peak);
    });
    incheonLandmarksGroup.add(convGrp);

    // Songdo Tri-Bowl cultural pavilion over Central Park canal
    const tbPos = worldPosition(37.3926, 126.6334);
    const tbY = Math.max(0.05, surfaceHeight(37.3926, 126.6334));
    const triBowl = new THREE.Group();
    triBowl.position.set(tbPos.x, tbY, tbPos.z);
    [[-0.36, -0.18], [0.36, -0.18], [0, 0.34]].forEach(([bx, bz]) => {
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.12, 0.28, 14), silverTowerMat);
      bowl.position.set(bx, 0.16, bz);
      bowl.castShadow = true;
      triBowl.add(bowl);
    });
    incheonLandmarksGroup.add(triBowl);

    // Songdo Central Park & IBS waterfront skyline cluster
    [
      [37.3945, 126.6365, 0.62, 0.52, 2.55, silverTowerMat],
      [37.3960, 126.6392, 0.58, 0.48, 2.35, glassMat],
      [37.3912, 126.6410, 0.64, 0.56, 2.85, silverTowerMat],
      [37.3880, 126.6400, 0.56, 0.52, 2.25, glassMat],
      [37.3958, 126.6305, 0.60, 0.50, 2.45, glassMat],
      [37.3935, 126.6285, 0.54, 0.48, 2.05, silverTowerMat],
      [37.3845, 126.6395, 0.62, 0.54, 2.15, silverTowerMat],
      [37.3818, 126.6435, 0.58, 0.52, 1.95, glassMat]
    ].forEach(([tLat, tLng, tw, td, th, tMat]) => {
      addSongdoTower(tLat, tLng, tw, td, th, tMat, 0.56, 0);
    });

    // 3. Incheon Inner Harbor & Songdo New Port Container Gantry Cranes + Ships
    const craneCoords = [
      [37.4565, 126.5975, 0.2],
      [37.4480, 126.5978, 0.1],
      [37.4395, 126.6012, -0.2],
      [37.3442, 126.6440, 0.5]
    ];
    craneCoords.forEach(([cLat, cLng, rotY]) => {
      const cp = worldPosition(cLat, cLng);
      const cy = Math.max(0.05, surfaceHeight(cLat, cLng));
      const crane = new THREE.Group();
      crane.position.set(cp.x, cy, cp.z);
      crane.rotation.y = rotY;
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.85, 0.10), craneMat);
      leg1.position.set(0, 0.42, -0.20);
      crane.add(leg1);
      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.85, 0.10), craneMat);
      leg2.position.set(0, 0.42, 0.20);
      crane.add(leg2);
      const boom = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.10, 0.16), craneMat);
      boom.position.set(-0.22, 0.84, 0);
      boom.castShadow = true;
      crane.add(boom);
      incheonLandmarksGroup.add(crane);
    });

    // 4. Wolmido Waterfront Ferris Wheel (월미 테마파크 관람차)
    const wmPos = worldPosition(37.4754, 126.5952);
    const wmY = Math.max(0.15, surfaceHeight(37.4754, 126.5952));
    const wheelGrp = new THREE.Group();
    wheelGrp.position.set(wmPos.x, wmY, wmPos.z);
    wheelGrp.rotation.y = 0.45;
    const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.045, 8, 22), pylonMat);
    wheelRing.position.y = 0.78;
    wheelRing.castShadow = true;
    wheelGrp.add(wheelRing);
    for (let sp = 0; sp < 4; sp++) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.24, 6), steelMat);
      spoke.position.y = 0.78;
      spoke.rotation.z = (sp * Math.PI) / 4;
      wheelGrp.add(spoke);
    }
    const legA = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.90, 6), steelMat);
    legA.position.set(-0.24, 0.42, 0);
    legA.rotation.z = -0.26;
    wheelGrp.add(legA);
    const legB = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.90, 6), steelMat);
    legB.position.set(0.24, 0.42, 0);
    legB.rotation.z = 0.26;
    wheelGrp.add(legB);
    incheonLandmarksGroup.add(wheelGrp);

    scene.add(incheonLandmarksGroup);
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
      sunLight.castShadow = !isSoftwareGl;

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
    if (regionalEmissiveMaterials && regionalEmissiveMaterials.length > 0) {
      const duskFactor = THREE.MathUtils.clamp((8 - elev) / 16, 0, 1);
      for (let i = 0; i < regionalEmissiveMaterials.length; i++) {
        const entry = regionalEmissiveMaterials[i];
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

    // Probe GL renderer string before creating the primary renderer so AA/shadows match HW vs SW capability
    isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      probeCanvas.width = 1;
      probeCanvas.height = 1;
      const probeGl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (probeGl) {
        const dbg = probeGl.getExtension('WEBGL_debug_renderer_info');
        if (dbg) {
          const rStr = String(probeGl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
          isSoftwareGl = /swiftshader|llvmpipe|softpipe|mesa offscreen/i.test(rStr);
        }
        const loseExt = probeGl.getExtension('WEBGL_lose_context');
        if (loseExt) loseExt.loseContext();
      }
    } catch (_) {
      isSoftwareGl = false;
    }

    renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl, alpha: true });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xf0f6fb, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    canvasContainer.append(renderer.domElement);
    resize();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
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
    sunLight.castShadow = !isSoftwareGl;
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

    const afterDraw = () => {
      if (isSoftwareGl) setTimeout(() => requestAnimationFrame(animate), 80);
      else requestAnimationFrame(animate);
    };

    const animate = (time) => {
      const safeTime = Number.isFinite(time) ? time : performance.now();
      const delta = Math.min(0.05, (safeTime - lastFrameTime) / 1000 || 0);
      lastFrameTime = safeTime;
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
          const prof = car.speedProfile;
          const cornerMult = prof ? prof[Math.min(prof.length - 1, (car.phase * prof.length) | 0)] : 1.0;
          car.phase = (car.phase + delta * car.speed * cornerMult) % 1;
          yeongamTrackCurve.getPointAt(car.phase, _carPos);
          yeongamTrackCurve.getPointAt((car.phase + 0.008) % 1, _carNextPos);
          car.mesh.position.set(_carPos.x, _carPos.y + 0.025, _carPos.z);
          car.mesh.lookAt(_carNextPos.x, _carNextPos.y + 0.025, _carNextPos.z);
          if (car.brakeTailMat) {
            car.brakeTailMat.emissiveIntensity = cornerMult < 0.86 ? 2.65 : 0.75;
          }
        }
      }
      if (!droneMode) controls.update();
      if (state.elevationProfileOpen && state.verticalSliceMode && activeSlicePlane) {
        updateActiveSlicePlaneForCamera();
      }
      updateLabels();
      updateWeather(delta, safeTime);
      updateSolarLighting(delta);
      renderer.render(scene, camera);
      afterDraw();
    };
    requestAnimationFrame(animate);
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
