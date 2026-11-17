// Incheon, Incheon Bridge, Yeongjongdo, Songdo & Airport 3D Asset Data & High-Detail Generator
(() => {
  'use strict';

  // Geographic bounds of Incheon metropolitan area
  const BOUNDS = {
    west: 126.350,
    south: 37.330,
    east: 126.750,
    north: 37.560
  };

  // Shared Incheon International Airport coordinate frame (NNW-SSE ~335° runway azimuth)
  // Local (uKm, vKm): uKm = across-runway East-Northeast, vKm = along-runway North-Northwest
  const AIRPORT_ORIGIN = {
    lat0: 37.4615,
    lng0: 126.4425,
    angleDeg: 25,
    kmPerDegLat: 111.0,
    kmPerDegLng: 88.36
  };

  const _airRad = (AIRPORT_ORIGIN.angleDeg * Math.PI) / 180;
  const _airCos = Math.cos(_airRad);
  const _airSin = Math.sin(_airRad);

  function airportToLatLng(uKm, vKm) {
    const eastKm = uKm * _airCos - vKm * _airSin;
    const northKm = uKm * _airSin + vKm * _airCos;
    return {
      lat: AIRPORT_ORIGIN.lat0 + northKm / AIRPORT_ORIGIN.kmPerDegLat,
      lng: AIRPORT_ORIGIN.lng0 + eastKm / AIRPORT_ORIGIN.kmPerDegLng
    };
  }

  function latLngToAirport(lat, lng) {
    const eastKm = (lng - AIRPORT_ORIGIN.lng0) * AIRPORT_ORIGIN.kmPerDegLng;
    const northKm = (lat - AIRPORT_ORIGIN.lat0) * AIRPORT_ORIGIN.kmPerDegLat;
    return {
      u: eastKm * _airCos + northKm * _airSin,
      v: -eastKm * _airSin + northKm * _airCos
    };
  }

  const AIRPORT_LAYOUT = {
    origin: AIRPORT_ORIGIN,
    toLatLng: airportToLatLng,
    toLocalKm: latLngToAirport,
    runways: [
      // Runway 4 (16R / 34L) - Northwest side near T2
      { id: '16R/34L', u: -2.02, vStart: -1.15, vEnd: 2.30, widthKm: 0.095, numTop: '16R', numBot: '34L' },
      // Runway 1 (15R / 33L) - West outer
      { id: '15R/33L', u: -1.52, vStart: -2.20, vEnd: 1.55, widthKm: 0.095, numTop: '15R', numBot: '33L' },
      // Runway 2 (15L / 33R) - West inner
      { id: '15L/33R', u: -1.16, vStart: -2.20, vEnd: 1.55, widthKm: 0.095, numTop: '15L', numBot: '33R' },
      // Runway 3 (16L / 34R) - East side near T1/Concourse
      { id: '16L/34R', u: 1.55, vStart: -2.22, vEnd: 1.55, widthKm: 0.095, numTop: '16L', numBot: '34R' }
    ],
    reclaimedBounds: { uMin: -2.38, uMax: 1.98, vMin: -2.55, vMax: 2.60 }
  };

  function inAirportReclamation(lat, lng) {
    const { u, v } = latLngToAirport(lat, lng);
    const b = AIRPORT_LAYOUT.reclaimedBounds;
    if (u < b.uMin || u > b.uMax || v < b.vMin || v > b.vMax) return false;
    // Chamfer corners like real seawall dike
    const du = Math.max(0, Math.abs(u - (b.uMin + b.uMax) * 0.5) - (b.uMax - b.uMin) * 0.5 + 0.35);
    const dv = Math.max(0, Math.abs(v - (b.vMin + b.vMax) * 0.5) - (b.vMax - b.vMin) * 0.5 + 0.35);
    return (du + dv) <= 0.42;
  }

  // Fast deterministic hash + fractal noise (shared by land masks & terrain generator)
  function hash(ix, iy) {
    let n = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263)) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function smoothNoise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy), b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sfyClamp(sy);
  }

  function sfyClamp(v) {
    return v;
  }

  function fbm(x, y, octaves) {
    let val = 0, amp = 0.5, freq = 1;
    for (let i = 0; i < (octaves || 3); i++) {
      val += smoothNoise(x * freq, y * freq) * amp;
      amp *= 0.5;
      freq *= 2.02;
    }
    return val;
  }

  function ridgedFbm(x, y, octaves) {
    let sum = 0, amp = 0.5, freq = 1, weight = 1;
    for (let i = 0; i < (octaves || 4); i++) {
      let n = 1.0 - Math.abs(smoothNoise(x * freq, y * freq) * 2.0 - 1.0);
      n = n * n * weight;
      weight = Math.min(1.0, Math.max(0.24, n * 1.65));
      sum += n * amp;
      amp *= 0.5;
      freq *= 2.12;
    }
    return sum;
  }

  function distToSegKm(lat, lng, lat1, lng1, lat2, lng2) {
    const x = (lng - BOUNDS.west) * 88.36;
    const y = (lat - BOUNDS.south) * 111.0;
    const x1 = (lng1 - BOUNDS.west) * 88.36;
    const y1 = (lat1 - BOUNDS.south) * 111.0;
    const x2 = (lng2 - BOUNDS.west) * 88.36;
    const y2 = (lat2 - BOUNDS.south) * 111.0;
    const dx = x2 - x1, dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(x - x1, y - y1);
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lenSq));
    return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
  }

  // Coastal outline for Mainland Incheon + Songdo + Wolmido (3D base & shoreline)
  const INCHEON_OUTLINE = [
    [126.6480, 37.3390], // Songdo South New Port basin
    [126.6280, 37.3480],
    [126.6120, 37.3620], // Songdo Southwest dike corner (Jack Nicklaus)
    [126.6020, 37.3810], // Songdo Incheon Bridge bridgehead
    [126.6160, 37.3980], // Songdo north seawall channel
    [126.6320, 37.4080], // Aam Lake canal entrance
    [126.6100, 37.4220], // Namhang Pier finger
    [126.5970, 37.4420], // Incheon Coastal Pier / Port
    [126.5940, 37.4560], // Incheon Inner Port Lock Gate
    [126.5920, 37.4720], // Wolmido south headland
    [126.5950, 37.4820], // Wolmido west tip
    [126.6080, 37.4920], // Bukseongpo / Port basin
    [126.6240, 37.5150], // Incheon North Port industrial piers
    [126.6340, 37.5350], // Cheongna west waterfront dike
    [126.6160, 37.5495], // Yeongjong Bridge east bridgehead (Gyeongin Ara Canal entrance)
    [126.6520, 37.5540],
    [126.6900, 37.5565], // Cheongna East / Gyeyang boundary
    [126.7320, 37.5480], // Bupyeong / Gyeyang ridge
    [126.7420, 37.5020], // Bupyeong / Juan
    [126.7440, 37.4520], // Namdong / Munhak
    [126.7280, 37.4080], // Namdong Industrial Complex
    [126.6940, 37.3720], // Songdo East canal seawall
    [126.6700, 37.3450],
    [126.6480, 37.3390]
  ];

  // Presets (keep first 3 unchanged for saved states & tests)
  const INCHEON_PRESETS = [
    {
      id: 'incheon-airport',
      name: '인천국제공항 T1·T2',
      category: '국제공항',
      icon: '✈',
      lat: 37.4602,
      lng: 126.4407
    },
    {
      id: 'incheon-bridge',
      name: '인천대교 주탑',
      category: '해상대교',
      icon: '🌉',
      lat: 37.4140,
      lng: 126.5680
    },
    {
      id: 'songdo-central',
      name: '송도 센트럴파크',
      category: '도심공원',
      icon: '🏙',
      lat: 37.3925,
      lng: 126.6380
    },
    {
      id: 'posco-tower',
      name: '포스코타워 송도',
      category: '랜드마크',
      icon: '🏢',
      lat: 37.3895,
      lng: 126.6435
    },
    {
      id: 'yeongjong-baekun',
      name: '영종도 백운산 (255m)',
      category: '자연·산',
      icon: '⛰',
      lat: 37.4980,
      lng: 126.5180
    },
    {
      id: 'wolmido',
      name: '월미도 문화의거리',
      category: '관광명소',
      icon: '🎡',
      lat: 37.4760,
      lng: 126.5980
    },
    {
      id: 'eurwangni',
      name: '을왕리 해수욕장',
      category: '해변',
      icon: '〰',
      lat: 37.4465,
      lng: 126.3725
    },
    {
      id: 'yeongjong-bridge',
      name: '영종대교',
      category: '해상대교',
      icon: '🌉',
      lat: 37.5450,
      lng: 126.5820
    },
    {
      id: 'munhaksan',
      name: '문학산 (217m)',
      category: '자연·산',
      icon: '⛰',
      lat: 37.4330,
      lng: 126.6780
    },
    {
      id: 'cheongna-lake',
      name: '청라 호수공원',
      category: '수변공원',
      icon: '◈',
      lat: 37.5310,
      lng: 126.6540
    },
    {
      id: 'incheon-t2',
      name: '인천공항 제2여객터미널',
      category: '국제공항',
      icon: '🛫',
      lat: airportToLatLng(0.08, 0.98).lat,
      lng: airportToLatLng(0.08, 0.98).lng
    },
    {
      id: 'incheon-tower',
      name: '인천공항 관제탑·탑승동',
      category: '공항시설',
      icon: '🗼',
      lat: airportToLatLng(0.56, -0.58).lat,
      lng: airportToLatLng(0.56, -0.58).lng
    }
  ];

  // Incheon Major Roads & Bridges
  const t1Exit = airportToLatLng(0.22, -1.78);
  const t2Exit = airportToLatLng(0.24, 1.50);

  const INCHEON_ROADS = [
    // 1. Incheon Grand Bridge (인천대교 고속도로)
    {
      name: '인천대교',
      type: 'motorway',
      points: [
        [t1Exit.lat, t1Exit.lng],
        [37.4430, 126.4720],
        [37.4320, 126.4920],
        [37.4220, 126.5200],
        [37.4140, 126.5680],
        [37.4020, 126.6020],
        [37.3960, 126.6200],
        [37.4080, 126.6600]
      ]
    },
    // 2. Yeongjong Bridge & Incheon Airport Expressway
    {
      name: '영종대교·공항고속도로',
      type: 'motorway',
      points: [
        [t1Exit.lat, t1Exit.lng],
        [t2Exit.lat, t2Exit.lng],
        [37.4850, 126.4850],
        [37.5250, 126.5350],
        [37.5450, 126.5820],
        [37.5500, 126.6200],
        [37.5550, 126.6750]
      ]
    },
    // 3. Yeongjong Coast South Road
    {
      name: '영종해안남로',
      type: 'primary',
      points: [
        [37.4420, 126.3750],
        [37.4250, 126.4150],
        [37.4320, 126.4750],
        [37.4480, 126.5100],
        [37.4850, 126.5600]
      ]
    },
    // 4. Yeongjong Coast North Road
    {
      name: '영종해안북로',
      type: 'primary',
      points: [
        [37.4650, 126.3700],
        [37.4950, 126.4250],
        [37.5180, 126.4950],
        [37.5150, 126.5450]
      ]
    },
    // 5. Songdo International Boulevard
    {
      name: '송도국제대로',
      type: 'primary',
      points: [
        [37.3750, 126.6450],
        [37.3895, 126.6435],
        [37.3950, 126.6420],
        [37.4100, 126.6450]
      ]
    },
    // 6. Gyeongin Expressway / Incheon-daero
    {
      name: '인천대로',
      type: 'trunk',
      points: [
        [37.4620, 126.6350],
        [37.4750, 126.6550],
        [37.4980, 126.6750],
        [37.5250, 126.6900]
      ]
    }
  ];

  // Authentic Domain-Warped Coastal Contours for Yeongjongdo, Yongyudo, Songdo & Incheon Mainland
  function inYeongjong(lng, lat) {
    if (inAirportReclamation(lat, lng)) return true;

    // Multi-octave organic coastal warp so islands look like natural Yellow Sea ria coastlines, not ellipses
    const nx = (lng - 126.35) * 42;
    const ny = (lat - 37.33) * 52;
    const warp = (fbm(nx, ny, 3) - 0.5) * 0.26;

    // Yeongjongdo main body (Baekunsan massif + Gu-eup Batter eastern cape + Jayeondo sky city)
    const dYjCore = Math.hypot((lng - 126.512) / 0.068, (lat - 37.488) / 0.044) + warp * 0.65;
    if (dYjCore < 1.0) return true;

    // East Cape toward Gu-eup Batter waterfront overlooking Wolmido
    const dEastCape = Math.hypot((lng - 126.565) / 0.026, (lat - 37.492) / 0.022) + warp * 0.5;
    if (dEastCape < 1.0) return true;

    // North-west headland toward Yeongjong Bridge approach & Sammok-do
    const dNorthWing = Math.hypot((lng - 126.462) / 0.046, (lat - 37.508) / 0.022) + warp * 0.55;
    if (dNorthWing < 1.0) return true;

    // Yongyudo natural hilly west peninsula (west of Airport) with Wangsan & Eulwangni coves carved out!
    const dYongyu = Math.hypot((lng - 126.395) / 0.036, (lat - 37.456) / 0.032) + warp * 0.65;
    if (dYongyu < 1.0) {
      // Carve authentic crescent cove at Eulwangni beach (37.446, 126.369)
      const dEulBay = Math.hypot((lng - 126.365) / 0.011, (lat - 37.446) / 0.0085);
      if (dEulBay < 1.0) return false;
      // Carve Wangsan beach cove to the north (37.458, 126.368)
      const dWangBay = Math.hypot((lng - 126.364) / 0.010, (lat - 37.459) / 0.0075);
      if (dWangBay < 1.0) return false;
      return true;
    }

    // Engineered Southern Airport Link Road seawall causeway (Yongyudo <-> Yeongjongdo)
    const dSouthDike = distToSegKm(lat, lng, 37.434, 126.404, 37.444, 126.505);
    if (dSouthDike < 0.72 + warp * 0.25) return true;

    return false;
  }

  function inSongdo(lng, lat) {
    if (lng < 126.596 || lng > 126.688 || lat < 37.339 || lat > 37.409) return false;
    // Chamfer southwest seawall & southeast New Port channel corners cleanly
    if ((126.628 - lng) * 1.15 + (37.376 - lat) * 1.45 > 0.036) return false;
    if ((lng - 126.656) * 0.95 + (37.362 - lat) * 1.25 > 0.030) return false;
    // Carve outer port channel indentation between Songdo Districts 6-8 and New Port
    if (lat < 37.356 && lng > 126.634 && lng < 126.648) return false;
    return true;
  }

  function inMainland(lng, lat) {
    const nx = (lng - 126.55) * 48;
    const ny = (lat - 37.33) * 56;
    const warp = (fbm(nx, ny, 3) - 0.5) * 0.009;

    // Mainland urban/hilly mass east of Incheon Harbor & north/east of Aam Lake canal (never overlapping Songdo)
    const inEastCore = (lng >= 126.620 + warp && lat >= 37.412) || (lng >= 126.690 + warp && lat >= 37.360);
    if (inEastCore) return true;

    // Wolmido rocky peninsula & causeway pier
    const dWolmi = Math.hypot((lng - 126.599) / 0.014, (lat - 37.475) / 0.014) + warp * 12;
    if (dWolmi < 1.0) return true;
    // Wolmi causeway + Incheon Inner Harbor lock piers (Pier 1-8 seawalls)
    if (lat >= 37.468 && lat <= 37.479 && lng >= 126.605 && lng <= 126.628) return true;
    // Coastal Pier & Yeonan Pier finger (37.452)
    if (lat >= 37.448 && lat <= 37.461 && lng >= 126.598 && lng <= 126.625) return true;
    // Namhang Pier southern extension (37.434)
    if (lat >= 37.430 && lat <= 37.440 && lng >= 126.606 && lng <= 126.632) return true;
    // North Port / Cheongna waterfront reclamation & Ara Canal south embankment
    if (lat >= 37.515 && lat <= 37.554 && lng >= 126.615 && lng <= 126.640) {
      // Carve Gyeongin Ara Waterway mouth channel (~37.547)
      if (Math.abs(lat - 37.5465) < 0.0022 && lng < 126.642) return false;
      return true;
    }

    return false;
  }

  function inIncheonLand(lng, lat) {
    return inYeongjong(lng, lat) || inSongdo(lng, lat) || inMainland(lng, lat);
  }

  // Procedural Asset Generator for Incheon (2048x2048 PBR satellite + 2x vector airfield + 512x512 ridged DEM)
  function createIncheonAssets() {
    const w = 2048;
    const h = 2048;
    const hw = 512;
    const hh = 512;

    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = hw;
    heightCanvas.height = hh;
    const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });

    const naturalCanvas = document.createElement('canvas');
    naturalCanvas.width = w;
    naturalCanvas.height = h;
    const nCtx = naturalCanvas.getContext('2d');

    const elevationCanvas = document.createElement('canvas');
    elevationCanvas.width = w;
    elevationCanvas.height = h;
    const eCtx = elevationCanvas.getContext('2d');

    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = w;
    normalCanvas.height = h;
    const nmCtx = normalCanvas.getContext('2d');

    const roughnessCanvas = document.createElement('canvas');
    roughnessCanvas.width = w;
    roughnessCanvas.height = h;
    const rgCtx = roughnessCanvas.getContext('2d');

    // 1. Precalculate ridged geological terrain height array (512x512)
    const hImg = hCtx.createImageData(hw, hh);
    const hData = hImg.data;
    const heights = new Float32Array(hw * hh);

    for (let py = 0; py < hh; py++) {
      const lat = BOUNDS.north - (py / (hh - 1)) * (BOUNDS.north - BOUNDS.south);
      const rowOff = py * hw;
      for (let px = 0; px < hw; px++) {
        const lng = BOUNDS.west + (px / (hw - 1)) * (BOUNDS.east - BOUNDS.west);
        const idx = rowOff + px;

        const nX = (lng - BOUNDS.west) * 65;
        const nY = (lat - BOUNDS.south) * 65;
        const ridgeDetail = ridgedFbm(nX * 0.45 + 1.4, nY * 0.45 + 2.8, 4);
        const fineRock = ridgedFbm(nX * 1.15 + 5.1, nY * 1.15 + 3.3, 3);
        const valleyFbm = fbm(nX * 0.55, nY * 0.55, 3);

        let elev = 0;
        const onAirportReclaim = inAirportReclamation(lat, lng);
        const onYeongjong = inYeongjong(lng, lat);

        if (onAirportReclaim) {
          elev = 8.0;
        } else if (onYeongjong) {
          elev = 6.5 + valleyFbm * 2.5;

          // Baekunsan Massif (255m peak) + East-West granite spine to Seokhwasan / Geumisan
          let yjPeak = 0;
          const baekDist = Math.hypot((lng - 126.518) * 88.36, (lat - 37.498) * 111.0);
          if (baekDist < 4.2) {
            const f = Math.max(0, 1 - baekDist / 4.2);
            yjPeak = Math.max(yjPeak, 255 * Math.pow(f, 1.55) * (0.76 + ridgeDetail * 0.34));
          }
          const dYjSpineE = distToSegKm(lat, lng, 37.498, 126.518, 37.494, 126.556);
          if (dYjSpineE < 1.8) {
            const f = Math.max(0, 1 - dYjSpineE / 1.8);
            yjPeak = Math.max(yjPeak, 152 * Math.pow(f, 1.75) * (0.74 + ridgeDetail * 0.34));
          }
          const dYjSpineN = distToSegKm(lat, lng, 37.498, 126.518, 37.515, 126.502);
          if (dYjSpineN < 1.6) {
            const f = Math.max(0, 1 - dYjSpineN / 1.6);
            yjPeak = Math.max(yjPeak, 146 * Math.pow(f, 1.75) * (0.74 + fineRock * 0.32));
          }

          // Yongyudo Oraebong / Wangsan hills (128m peak + ridge behind Eulwangni cove)
          const yongDist = Math.hypot((lng - 126.392) * 88.36, (lat - 37.454) * 111.0);
          if (yongDist < 2.6) {
            const f = Math.max(0, 1 - yongDist / 2.6);
            yjPeak = Math.max(yjPeak, 128 * Math.pow(f, 1.55) * (0.76 + ridgeDetail * 0.32));
          }
          const dMasian = Math.hypot((lng - 126.404) * 88.36, (lat - 37.434) * 111.0);
          if (dMasian < 1.6) {
            const f = Math.max(0, 1 - dMasian / 1.6);
            yjPeak = Math.max(yjPeak, 82 * Math.pow(f, 1.65) * (0.80 + fineRock * 0.25));
          }

          elev = Math.max(elev, yjPeak + 6.0);

          // Smooth collar so Yeongjong hills never encroach onto Airport reclaimed runways
          const { u, v } = latLngToAirport(lat, lng);
          const marginU = Math.max(0, Math.abs(u) - 2.38);
          const marginV = Math.max(0, Math.abs(v) - 2.58);
          const edgeDist = Math.hypot(marginU, marginV);
          if (edgeDist < 0.55) {
            const t = edgeDist / 0.55;
            const blend = t * t * (3 - 2 * t);
            elev = 8.0 + (elev - 8.0) * blend;
          }
        }

        // Songdo International City engineered platform (7m) + Central Park basin
        if (inSongdo(lng, lat)) {
          elev = Math.max(elev, 7.2);
          const inCanal = Math.abs((lng - 126.638) - (lat - 37.392) * 0.32) < 0.0022 && (lat >= 37.384 && lat <= 37.400);
          if (inCanal) elev = 2.0;
        }

        // Mainland Hills (Munhaksan 217m, Cheongnyangsan 158m, Wolmido 105m, NE Gyeyang Foothills)
        if (inMainland(lng, lat) && !inSongdo(lng, lat)) {
          elev = Math.max(elev, 10.5 + valleyFbm * 3.0);

          let mainPeak = 0;

          // Wolmido (Wolmisan 105m wooded island cone)
          const wolDist = Math.hypot((lng - 126.600) * 88.36, (lat - 37.475) * 111.0);
          if (wolDist < 1.25) {
            const f = Math.max(0, 1 - wolDist / 1.25);
            mainPeak = Math.max(mainPeak, 106 * Math.pow(f, 1.50) * (0.82 + fineRock * 0.26));
          }

          // Munhaksan (217m) E-W ridge spine (Gilmasan -> Munhaksan -> Beopjusan)
          const dMunSpine = distToSegKm(lat, lng, 37.434, 126.655, 37.432, 126.705);
          if (dMunSpine < 2.2) {
            const f = Math.max(0, 1 - dMunSpine / 2.2);
            mainPeak = Math.max(mainPeak, 212 * Math.pow(f, 1.60) * (0.76 + ridgeDetail * 0.34));
          }
          const munDist = Math.hypot((lng - 126.678) * 88.36, (lat - 37.433) * 111.0);
          if (munDist < 2.0) {
            const f = Math.max(0, 1 - munDist / 2.0);
            mainPeak = Math.max(mainPeak, 220 * Math.pow(f, 1.55) * (0.80 + fineRock * 0.28));
          }

          // Cheongnyangsan (158m) & Bongjaesan ridge cleanly north of Aam Lake (Yeonsu/Okryeon)
          const dChnSpine = distToSegKm(lat, lng, 37.422, 126.645, 37.419, 126.670);
          if (dChnSpine < 1.35) {
            const f = Math.max(0, 1 - dChnSpine / 1.35);
            mainPeak = Math.max(mainPeak, 158 * Math.pow(f, 1.60) * (0.78 + ridgeDetail * 0.30));
          }

          // Gajeong / Wonjeoksan / Gyeyang urban ridge spine (NE Mainland, up to 215m)
          const dWonjeok = distToSegKm(lat, lng, 37.508, 126.682, 37.548, 126.726);
          if (dWonjeok < 3.0) {
            const f = Math.max(0, 1 - dWonjeok / 3.0);
            mainPeak = Math.max(mainPeak, 205 * Math.pow(f, 1.65) * (0.74 + ridgeDetail * 0.34));
          }

          // Jayupark / Eungbongsan central harbor hill overlooking Inner Port
          const dEung = Math.hypot((lng - 126.621) * 88.36, (lat - 37.475) * 111.0);
          if (dEung < 1.1) {
            const f = Math.max(0, 1 - dEung / 1.1);
            mainPeak = Math.max(mainPeak, 68 * Math.pow(f, 1.65));
          }

          elev = Math.max(elev, mainPeak + 8.5);

          // Keep Cheongna Lake Park basin flat & low
          const dCheongnaLake = Math.hypot((lng - 126.654) * 88.36, (lat - 37.531) * 111.0);
          if (dCheongnaLake < 1.15) {
            elev = Math.min(elev, 6.0);
          }

          // Keep Inner Harbor / Coastal Pier docks flat
          if (lng > 126.585 && lng < 126.628 && lat > 37.432 && lat < 37.520 && wolDist > 1.15) {
            elev = Math.min(elev, 7.5);
          }
        }

        // Smooth INLAND-ONLY cosine taper on North and East map borders (1.1km margin)
        // Eliminates the hard vertical cliff table edge along the inland border while keeping West coastlines sharp!
        if (onYeongjong || inMainland(lng, lat) || inSongdo(lng, lat)) {
          const dEastKm = (BOUNDS.east - lng) * 88.36;
          const dNorthKm = lat > 37.542 && lng > 126.620 ? (BOUNDS.north - lat) * 111.0 : 99;
          const dSouthInlandKm = lng > 126.655 && lat < 37.350 ? (lat - BOUNDS.south) * 111.0 : 99;
          const inlandKm = Math.min(dEastKm, dNorthKm, dSouthInlandKm);
          if (inlandKm < 1.05) {
            const t = Math.max(0, Math.min(1, inlandKm / 1.05));
            const fade = 0.5 - 0.5 * Math.cos(Math.PI * t);
            elev *= fade;
          }
        }

        elev = Math.max(0, Math.min(300, elev));
        heights[idx] = elev;

        const pIdx = idx * 4;
        const normH = Math.min(255, Math.floor((elev / 300) * 255));
        hData[pIdx] = normH;
        hData[pIdx + 1] = normH;
        hData[pIdx + 2] = normH;
        hData[pIdx + 3] = 255;
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // 1B. Land mask & coastal Chamfer distance at full 2048x2048 resolution
    const total = w * h;
    const landType = new Uint8Array(total); // 0: sea/mudflat, 1: airport, 2: songdo, 3: yeongjong/mainland
    const coastDist = new Uint8Array(total);
    const latStep = (BOUNDS.north - BOUNDS.south) / (h - 1);
    const lngStep = (BOUNDS.east - BOUNDS.west) / (w - 1);

    for (let py = 0; py < h; py++) {
      const lat = BOUNDS.north - py * latStep;
      const rowOff = py * w;
      for (let px = 0; px < w; px++) {
        const lng = BOUNDS.west + px * lngStep;
        const pIdx = rowOff + px;
        let kind = 0;
        if (inAirportReclamation(lat, lng)) kind = 1;
        else if (inSongdo(lng, lat)) kind = 2;
        else if (inYeongjong(lng, lat) || inMainland(lng, lat)) kind = 3;
        landType[pIdx] = kind;
        coastDist[pIdx] = kind > 0 ? 255 : 0;
      }
    }

    for (let y = 1; y < h - 1; y++) {
      const rowOff = y * w;
      for (let x = 1; x < w - 1; x++) {
        const i = rowOff + x;
        if (coastDist[i] === 0) continue;
        const d = Math.min(
          coastDist[i],
          coastDist[i - 1] + 2,
          coastDist[i - w] + 2,
          coastDist[i - w - 1] + 3,
          coastDist[i - w + 1] + 3
        );
        coastDist[i] = d > 255 ? 255 : d;
      }
    }
    for (let y = h - 2; y >= 1; y--) {
      const rowOff = y * w;
      for (let x = w - 2; x >= 1; x--) {
        const i = rowOff + x;
        if (coastDist[i] === 0) continue;
        const d = Math.min(
          coastDist[i],
          coastDist[i + 1] + 2,
          coastDist[i + w] + 2,
          coastDist[i + w - 1] + 3,
          coastDist[i + w + 1] + 3
        );
        coastDist[i] = d > 255 ? 255 : d;
      }
    }

    // Bilinear sampler for smooth 2048-scale height gradients (eliminates 512px grid facets!)
    const hScaleX = (hw - 1) / (w - 1);
    const hScaleY = (hh - 1) / (h - 1);
    function sampleElev(px, py) {
      const sx = px < 0 ? 0 : (px >= w - 1 ? hw - 1.001 : px * hScaleX);
      const sy = py < 0 ? 0 : (py >= h - 1 ? hh - 1.001 : py * hScaleY);
      const x0 = sx | 0, y0 = sy | 0;
      const dx = sx - x0, dy = sy - y0;
      const r0 = y0 * hw, r1 = r0 + hw;
      const h00 = heights[r0 + x0];
      const h10 = heights[r0 + x0 + 1];
      const h01 = heights[r1 + x0];
      const h11 = heights[r1 + x0 + 1];
      return (h00 * (1 - dx) + h10 * dx) * (1 - dy) + (h01 * (1 - dx) + h11 * dx) * dy;
    }

    // Rotated street matrix constants for Songdo (~33°) & Cheongna/Guwol (~-12°)
    const COS_SD = Math.cos(0.57), SIN_SD = Math.sin(0.57);
    const COS_ML = Math.cos(-0.20), SIN_ML = Math.sin(-0.20);

    // 2. Render 2048x2048 PBR satellite, elevation, normal & roughness maps
    const nImg = nCtx.createImageData(w, h);
    const nData = nImg.data;
    const eImg = eCtx.createImageData(w, h);
    const eData = eImg.data;
    const nmImg = nmCtx.createImageData(w, h);
    const nmData = nmImg.data;
    const rgImg = rgCtx.createImageData(w, h);
    const rgData = rgImg.data;

    for (let py = 0; py < h; py++) {
      const lat = BOUNDS.north - py * latStep;
      const rowOff = py * w;

      for (let px = 0; px < w; px++) {
        const lng = BOUNDS.west + px * lngStep;
        const pIdx = rowOff + px;
        const idx = pIdx * 4;

        const elev = sampleElev(px, py);
        const hL = sampleElev(px - 3, py);
        const hR = sampleElev(px + 3, py);
        const hU = sampleElev(px, py - 3);
        const hD = sampleElev(px, py + 3);

        const grain = hash(px, py);
        const microR0 = smoothNoise(px * 0.24, py * 0.24);
        const microRx = smoothNoise((px + 1.5) * 0.24, py * 0.24) - microR0;
        const microRy = smoothNoise(px * 0.24, (py + 1.5) * 0.24) - microR0;

        const dx = (hR - hL) * 0.14 + microRx * 0.12;
        const dy = (hD - hU) * 0.14 + microRy * 0.12;
        const nz = 1.0;
        const len = Math.hypot(dx, dy, nz);

        nmData[idx] = Math.floor((-dx / len * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.floor((-dy / len * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.floor((nz / len * 0.5 + 0.5) * 255);
        nmData[idx + 3] = 255;

        const sunX = -0.52, sunY = -0.62, sunZ = 0.58;
        const dot = Math.max(0.15, (-dx * sunX - dy * sunY + nz * sunZ) / len);
        const slope = Math.hypot((hR - hL) * 0.14, (hD - hU) * 0.14);
        const shade = Math.min(1.36, 0.56 + dot * 0.50);

        const nCoarse = fbm(px * 0.013, py * 0.013, 3);
        const nFine = fbm(px * 0.062, py * 0.062, 2);

        const kind = landType[pIdx];
        const cDist = coastDist[pIdx];

        let r = 28, g = 68, b = 104, a = 255;
        let roughVal = 52;

        if (kind === 0) {
          // West Sea mudflats (갯벌) & shallow coastal dendritic tidal channels
          const distAirport = Math.max(
            Math.abs(lat - 37.4615) - 0.032,
            Math.abs(lng - 126.4425) - 0.038
          );
          const distYJ = Math.hypot((lng - 126.495) / 0.105, (lat - 37.475) / 0.058) - 1.0;
          const distSongdo = Math.hypot(Math.max(0, 126.600 - lng), Math.max(0, 37.352 - lat)) * 11.5;
          const mudZone = Math.min(Math.max(0, distAirport * 16), Math.max(0, distYJ * 3.2), distSongdo);

          if (mudZone < 0.34) {
            const warpX = fbm(px * 0.010, py * 0.010, 2) * 18;
            const warpY = fbm(px * 0.010 + 19.3, py * 0.010 + 7.1, 2) * 18;
            const tidalCreek = Math.abs(fbm((px + warpX) * 0.022, (py + warpY) * 0.022, 3) - 0.5) * 2;
            const subCreek = Math.abs(fbm((px - warpY) * 0.054, (py + warpX) * 0.054, 2) - 0.5) * 2;
            const isCreek = tidalCreek < 0.08 || subCreek < 0.048;
            const tShallow = Math.max(0, 1 - mudZone / 0.34);
            if (isCreek) {
              r = Math.floor(38 + tShallow * 18 + nFine * 8);
              g = Math.floor(94 + tShallow * 24 + nFine * 10);
              b = Math.floor(124 + tShallow * 18 + nFine * 10);
              a = Math.round(135 + tShallow * 95);
              roughVal = 52;
            } else {
              // Warm wet tidal mud-silt & coastal sandbars
              r = Math.floor(96 + tShallow * 42 + nFine * 14 + grain * 5);
              g = Math.floor(114 + tShallow * 28 + nFine * 12 + grain * 5);
              b = Math.floor(118 + nFine * 10);
              a = Math.round(tShallow * 230);
              roughVal = Math.round(88 + tShallow * 58);
            }
          } else {
            a = 0;
            roughVal = 48;
          }
        } else if (kind === 1) {
          // Manicured airfield turf grass base (runways & aprons drawn in 2x vector pass below)
          r = Math.floor(66 + nCoarse * 18 + nFine * 10 + grain * 5);
          g = Math.floor(108 + nCoarse * 20 + nFine * 12 + grain * 6);
          b = Math.floor(60 + nCoarse * 10);
          roughVal = 222;
        } else if (kind === 2) {
          // Songdo International City: Rotated Boulevard Grid + Seawater Central Park Canal + Golf Greens
          const inCanal = Math.abs((lng - 126.638) - (lat - 37.392) * 0.32) < 0.0020 && (lat >= 37.384 && lat <= 37.400);
          const inPark = Math.abs((lng - 126.638) - (lat - 37.392) * 0.32) < 0.0055 && (lat >= 37.382 && lat <= 37.402);
          const dGolf = Math.hypot((lng - 126.618) * 88.36, (lat - 37.372) * 111.0);
          if (inCanal) {
            r = 32; g = 118; b = 150;
            roughVal = 45;
          } else if (inPark) {
            r = Math.floor(54 + nFine * 18 + grain * 5);
            g = Math.floor(118 + nFine * 20 + grain * 5);
            b = Math.floor(64 + nFine * 10);
            roughVal = 220;
          } else if (dGolf < 0.85) {
            // Jack Nicklaus Golf Club Korea fairways & sand traps
            const fairway = nCoarse > 0.45 ? 12 : -8;
            r = Math.floor(64 + fairway + nFine * 14);
            g = Math.floor(126 + fairway + nFine * 16);
            b = Math.floor(62 + nFine * 10);
            roughVal = 218;
          } else if (cDist <= 6) {
            // Engineered granite Songdo seawall embankment
            r = Math.floor(126 + nFine * 18 + grain * 8);
            g = Math.floor(132 + nFine * 16 + grain * 8);
            b = Math.floor(138 + nFine * 16);
            roughVal = 188;
          } else {
            const ux = px * COS_SD - py * SIN_SD;
            const uy = px * SIN_SD + py * COS_SD;
            const bScale = 0.165;
            const bx = Math.floor(ux * bScale);
            const by = Math.floor(uy * bScale);
            const gx = ux * bScale - bx;
            const gy = uy * bScale - by;
            const isRoad = gx < 0.16 || gy < 0.16;
            if (isRoad) {
              r = Math.floor(84 + grain * 5); g = Math.floor(88 + grain * 5); b = Math.floor(94 + grain * 5);
              roughVal = 152;
            } else {
              const blockHash = hash(bx, by);
              if (blockHash < 0.24) {
                r = Math.floor(62 + nFine * 16);
                g = Math.floor(114 + nFine * 18);
                b = Math.floor(64 + nFine * 12);
                roughVal = 222;
              } else if (blockHash < 0.64) {
                // Curtain-wall glass tower blocks
                r = Math.floor(140 + nCoarse * 18 + grain * 5);
                g = Math.floor(156 + nCoarse * 16 + grain * 5);
                b = Math.floor(172 + nCoarse * 14);
                roughVal = 128;
              } else {
                r = Math.floor(158 + nFine * 14 + grain * 5);
                g = Math.floor(162 + nFine * 14 + grain * 5);
                b = Math.floor(168 + nFine * 12);
                roughVal = 168;
              }
            }
          }
        } else {
          // Eurwangni & Wangsan twin golden sandy beach coves + surf
          const eurDist = Math.hypot((lng - 126.370) * 88.36, (lat - 37.446) * 111.0);
          const wangDist = Math.hypot((lng - 126.369) * 88.36, (lat - 37.459) * 111.0);
          const dCheongnaLake = Math.hypot((lng - 126.654) * 88.36, (lat - 37.531) * 111.0);
          const isInnerPortPiers = (lng > 126.585 && lng < 126.628 && lat > 37.432 && lat < 37.520 && elev < 14 && Math.hypot((lng - 126.600) * 88.36, (lat - 37.475) * 111.0) > 1.12);

          if ((eurDist < 0.52 || wangDist < 0.45) && elev < 20) {
            if (cDist <= 3) {
              r = 226; g = 238; b = 236;
              roughVal = 82;
            } else if (cDist <= 10) {
              r = Math.floor(196 + nFine * 12);
              g = Math.floor(176 + nFine * 12);
              b = Math.floor(134 + nFine * 10);
              roughVal = 116;
            } else {
              r = Math.floor(216 + nFine * 16 + grain * 6);
              g = Math.floor(196 + nFine * 14 + grain * 6);
              b = Math.floor(152 + nFine * 12);
              roughVal = 198;
            }
          } else if (dCheongnaLake < 0.65 && elev < 14) {
            // Cheongna Central Lake Park water & canal plaza
            const inWater = dCheongnaLake < 0.44 || (Math.abs(lat - 37.531) < 0.0018 && lng > 126.634 && lng < 126.666);
            if (inWater) {
              r = 34; g = 104; b = 136;
              roughVal = 48;
            } else {
              r = Math.floor(58 + nFine * 16);
              g = Math.floor(114 + nFine * 18);
              b = Math.floor(62 + nFine * 10);
              roughVal = 220;
            }
          } else if (isInnerPortPiers) {
            // Incheon Inner Harbor shipping yards & container berths (strictly lng 126.585..126.628)
            const lane = Math.floor(px * 0.16) % 2;
            const yardHash = hash(Math.floor(px * 0.16), Math.floor(py * 0.16));
            if (yardHash < 0.14) {
              r = 160; g = 90; b = 68;
              roughVal = 165;
            } else if (yardHash < 0.25) {
              r = 62; g = 104; b = 144;
              roughVal = 165;
            } else {
              r = Math.floor(124 + lane * 8 + grain * 6);
              g = Math.floor(128 + lane * 8 + grain * 6);
              b = Math.floor(134 + lane * 8);
              roughVal = 178;
            }
          } else if (cDist <= 4) {
            const foam = nFine > 0.56 && cDist <= 2;
            if (foam) {
              r = 216; g = 232; b = 238;
              roughVal = 90;
            } else {
              r = Math.floor(88 + nFine * 18 + grain * 8);
              g = Math.floor(94 + nFine * 16 + grain * 8);
              b = 92;
              roughVal = 185;
            }
          } else {
            // Smooth transition between urban/coastal lowlands and wooded mountain flanks + granite ridge crags
            const urbanCeiling = 22 + nCoarse * 11;
            const inSkyCity = lng > 126.526 && lng < 126.576 && lat > 37.480 && lat < 37.506 && elev < urbanCeiling;
            const inUrbanZone = (lng > 126.622 && elev < urbanCeiling) || inSkyCity;

            // Woodland canopy with subtle autumn oak accents
            const canopy = nCoarse * 0.54 + nFine * 0.46;
            const autumn = nCoarse > 0.58 ? 16 : 0;
            let fR = 36 + autumn + canopy * 34 + grain * 5;
            let fG = 78 + autumn * 0.35 + canopy * 40 + grain * 6;
            let fB = 38 + canopy * 20 + grain * 4;

            // Subtle granite crag blend strictly on steep slopes & high summit ridges (never flat brown caps)
            const rockMix = Math.max(0, Math.min(0.82,
              ((slope - 0.32) * 1.95 + Math.max(0, elev - 185) / 95) * (0.45 + nFine * 0.65)
            ));
            if (rockMix > 0.02) {
              const rkR = 114 + nFine * 18 + grain * 6;
              const rkG = 116 + nFine * 16 + grain * 6;
              const rkB = 110 + nFine * 14;
              fR = fR * (1 - rockMix) + rkR * rockMix;
              fG = fG * (1 - rockMix) + rkG * rockMix;
              fB = fB * (1 - rockMix) + rkB * rockMix;
            }

            if (inUrbanZone) {
              const ux = px * COS_ML - py * SIN_ML;
              const uy = px * SIN_ML + py * COS_ML;
              const bScale = 0.22;
              const bx = Math.floor(ux * bScale);
              const by = Math.floor(uy * bScale);
              const subX = ux * bScale - bx;
              const subY = uy * bScale - by;
              const bHash = hash(bx, by);
              let uR, uG, uB, uRough;
              if (subX < 0.16 || subY < 0.16) {
                uR = 88 + grain * 5; uG = 92 + grain * 5; uB = 98 + grain * 5;
                uRough = 156;
              } else if (bHash < 0.25) {
                uR = 56 + nFine * 16; uG = 104 + nFine * 18; uB = 52 + nFine * 12;
                uRough = 224;
              } else if (bHash < 0.65) {
                uR = 132 + nFine * 14 + grain * 4;
                uG = 136 + nFine * 14 + grain * 4;
                uB = 142 + nFine * 12;
                uRough = 176;
              } else {
                uR = 146 + nFine * 12 + grain * 4;
                uG = 150 + nFine * 12 + grain * 4;
                uB = 156 + nFine * 10;
                uRough = 166;
              }
              const foothillT = Math.max(0, Math.min(1, (elev - (urbanCeiling - 7)) / 7));
              r = Math.floor(uR * (1 - foothillT) + fR * foothillT);
              g = Math.floor(uG * (1 - foothillT) + fG * foothillT);
              b = Math.floor(uB * (1 - foothillT) + fB * foothillT);
              roughVal = Math.round(uRough * (1 - foothillT) + 228 * foothillT);
            } else if (elev < 16) {
              // Yeongjongdo natural coastal agricultural meadows & foothills
              const meadow = nCoarse * 0.5 + nFine * 0.5;
              const mR = 52 + meadow * 30 + grain * 5;
              const mG = 94 + meadow * 34 + grain * 5;
              const mB = 48 + meadow * 20 + grain * 4;
              const tHill = Math.max(0, Math.min(1, (elev - 9) / 7));
              r = Math.floor(mR * (1 - tHill) + fR * tHill);
              g = Math.floor(mG * (1 - tHill) + fG * tHill);
              b = Math.floor(mB * (1 - tHill) + fB * tHill);
              roughVal = 226;
            } else {
              r = Math.floor(fR);
              g = Math.floor(fG);
              b = Math.floor(fB);
              roughVal = Math.round(228 - rockMix * 20);
            }
          }
        }

        nData[idx] = Math.min(255, Math.floor(r * shade));
        nData[idx + 1] = Math.min(255, Math.floor(g * shade));
        nData[idx + 2] = Math.min(255, Math.floor(b * shade));
        nData[idx + 3] = a;

        rgData[idx] = roughVal;
        rgData[idx + 1] = roughVal;
        rgData[idx + 2] = roughVal;
        rgData[idx + 3] = 255;

        // Elevation Relief Color
        const eRatio = Math.min(1.0, elev / 300);
        let er, eg, eb;
        if (kind === 0) {
          er = 32; eg = 78; eb = 118;
        } else if (eRatio < 0.08) {
          er = 74; eg = 178; eb = 132;
        } else if (eRatio < 0.4) {
          er = 125 + eRatio * 145; eg = 185; eb = 84;
        } else if (eRatio < 0.75) {
          er = 216; eg = 160 - eRatio * 78; eb = 62;
        } else {
          er = 228; eg = 196; eb = 176;
        }
        const contourLine = Math.abs(Math.sin(elev * 0.12566));
        const cFac = (elev >= 1 && contourLine < 0.08) ? 0.86 : 1.0;

        eData[idx] = Math.min(255, Math.floor(er * shade * cFac));
        eData[idx + 1] = Math.min(255, Math.floor(eg * shade * cFac));
        eData[idx + 2] = Math.min(255, Math.floor(eb * shade * cFac));
        eData[idx + 3] = kind === 0 ? 0 : 255;
      }
    }

    nCtx.putImageData(nImg, 0, 0);
    eCtx.putImageData(eImg, 0, 0);
    nmCtx.putImageData(nmImg, 0, 0);
    rgCtx.putImageData(rgImg, 0, 0);

    // 3. Vector Airfield Overlay Pass on naturalCanvas (2x 2048x2048 razor-sharp runways, taxiways, aprons & markings)
    const vecScale = w / 1024;
    function toPx(uKm, vKm) {
      const { lat, lng } = airportToLatLng(uKm, vKm);
      return [
        ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * w,
        ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * h
      ];
    }

    function fillQuadUV(ctx, u0, v0, u1, v1, fillStyle) {
      const [x0, y0] = toPx(u0, v0);
      const [x1, y1] = toPx(u1, v0);
      const [x2, y2] = toPx(u1, v1);
      const [x3, y3] = toPx(u0, v1);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }

    function strokeLineUV(ctx, u0, v0, u1, v1, color, lineWidth, dash) {
      const [x0, y0] = toPx(u0, v0);
      const [x1, y1] = toPx(u1, v1);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * vecScale;
      ctx.lineCap = 'butt';
      if (dash) ctx.setLineDash(dash.map(d => d * vecScale));
      ctx.stroke();
      ctx.restore();
    }

    // 3A. Airfield concrete seawall perimeter
    const rb = AIRPORT_LAYOUT.reclaimedBounds;
    nCtx.save();
    nCtx.strokeStyle = '#9aa5b1';
    nCtx.lineWidth = 3.2 * vecScale;
    nCtx.beginPath();
    const dikePts = [
      [rb.uMin + 0.3, rb.vMin], [rb.uMax - 0.3, rb.vMin],
      [rb.uMax, rb.vMin + 0.3], [rb.uMax, rb.vMax - 0.3],
      [rb.uMax - 0.3, rb.vMax], [rb.uMin + 0.3, rb.vMax],
      [rb.uMin, rb.vMax - 0.3], [rb.uMin, rb.vMin + 0.3]
    ];
    dikePts.forEach(([u, v], idx) => {
      const [px, py] = toPx(u, v);
      if (idx === 0) nCtx.moveTo(px, py);
      else nCtx.lineTo(px, py);
    });
    nCtx.closePath();
    nCtx.stroke();
    nCtx.restore();

    // 3B. Main concrete aprons (Passenger T1, Concourse, T2, and Cargo Aprons)
    fillQuadUV(nCtx, -0.78, -1.35, 0.98, 1.32, '#9ba3ad');
    fillQuadUV(nCtx, -0.58, -1.92, 0.88, -1.35, '#7e8894');
    fillQuadUV(nCtx, -0.55, 1.32, 0.72, 1.72, '#7e8894');
    fillQuadUV(nCtx, 0.62, -2.05, 1.15, -1.35, '#8c949e');
    fillQuadUV(nCtx, 0.72, 0.10, 1.15, 0.85, '#8c949e');

    for (let u = -0.68; u <= 0.92; u += 0.16) {
      strokeLineUV(nCtx, u, -1.30, u, 1.28, 'rgba(72, 80, 90, 0.28)', 0.7);
    }
    for (let v = -1.25; v <= 1.25; v += 0.18) {
      strokeLineUV(nCtx, -0.76, v, 0.96, v, 'rgba(72, 80, 90, 0.28)', 0.7);
    }

    const gateStands = [
      ...[-0.36, -0.22, -0.08, 0.08, 0.24, 0.40, 0.56].map(u => [u, -0.82, u, -0.64]),
      ...[-0.30, -0.15, 0.00, 0.16, 0.32, 0.48, 0.62].map(u => [u, -0.24, u, -0.40]),
      ...[-0.30, -0.15, 0.00, 0.16, 0.32, 0.48, 0.62].map(u => [u, -0.04, u, 0.12]),
      ...[-0.32, -0.16, 0.00, 0.16, 0.32, 0.48].map(u => [u, 0.72, u, 0.55])
    ];
    gateStands.forEach(([u0, v0, u1, v1]) => {
      strokeLineUV(nCtx, u0, v0, u1, v1, '#eab308', 1.1);
    });

    // 3C. Parallel Taxiways & Cross-field Connectors
    const taxiways = [
      [-1.83, -1.15, -1.83, 2.30],
      [-1.70, -2.20, -1.70, 1.55],
      [-1.34, -2.20, -1.34, 1.55],
      [-0.95, -2.20, -0.95, 2.25],
      [-0.82, -1.95, -0.82, 1.85],
      [1.33, -2.22, 1.33, 1.55],
      [1.18, -2.22, 1.18, 1.55],
      [-2.02, -2.18, 1.55, -2.18],
      [-1.52, -1.32, -0.78, -1.32],
      [-1.52, -0.52, -0.78, -0.52],
      [-1.52, 0.38, -0.78, 0.38],
      [-2.02, 1.48, 1.55, 1.48],
      [0.95, -1.20, 1.55, -1.20],
      [0.95, -0.45, 1.55, -0.45],
      [0.95, 0.45, 1.55, 0.45]
    ];

    taxiways.forEach(([u0, v0, u1, v1]) => {
      strokeLineUV(nCtx, u0, v0, u1, v1, '#47515c', 4.6);
    });
    const rapidExits = [
      [-1.52, -0.95, -1.34, -0.75],
      [-1.52, 0.10, -1.34, 0.30],
      [-1.16, -0.85, -0.95, -0.65],
      [-1.16, 0.25, -0.95, 0.45],
      [1.55, -0.85, 1.33, -0.65],
      [1.55, 0.25, 1.33, 0.45],
      [-2.02, 0.20, -1.83, 0.40],
      [-2.02, 1.05, -1.83, 1.25]
    ];
    rapidExits.forEach(([u0, v0, u1, v1]) => {
      strokeLineUV(nCtx, u0, v0, u1, v1, '#47515c', 4.2);
    });
    taxiways.forEach(([u0, v0, u1, v1]) => {
      strokeLineUV(nCtx, u0, v0, u1, v1, '#facc15', 0.9);
    });
    rapidExits.forEach(([u0, v0, u1, v1]) => {
      strokeLineUV(nCtx, u0, v0, u1, v1, '#facc15', 0.85);
    });

    // 3D. 4 Main Runways
    AIRPORT_LAYOUT.runways.forEach((rw) => {
      const halfW = rw.widthKm * 0.5;
      fillQuadUV(nCtx, rw.u - halfW - 0.025, rw.vStart - 0.08, rw.u + halfW + 0.025, rw.vEnd + 0.08, '#4f5864');
      fillQuadUV(nCtx, rw.u - halfW, rw.vStart, rw.u + halfW, rw.vEnd, '#2b3038');

      strokeLineUV(nCtx, rw.u - halfW + 0.008, rw.vStart, rw.u - halfW + 0.008, rw.vEnd, '#e2e8f0', 1.1);
      strokeLineUV(nCtx, rw.u + halfW - 0.008, rw.vStart, rw.u + halfW - 0.008, rw.vEnd, '#e2e8f0', 1.1);
      strokeLineUV(nCtx, rw.u, rw.vStart + 0.16, rw.u, rw.vEnd - 0.16, '#f8fafc', 1.4, [6, 5]);

      for (let s = -3; s <= 3; s++) {
        if (s === 0) continue;
        const barU = rw.u + s * 0.011;
        strokeLineUV(nCtx, barU, rw.vStart + 0.03, barU, rw.vStart + 0.11, '#f8fafc', 1.2);
        strokeLineUV(nCtx, barU, rw.vEnd - 0.11, barU, rw.vEnd - 0.03, '#f8fafc', 1.2);
      }

      fillQuadUV(nCtx, rw.u - 0.022, rw.vStart + 0.25, rw.u - 0.010, rw.vStart + 0.34, '#f8fafc');
      fillQuadUV(nCtx, rw.u + 0.010, rw.vStart + 0.25, rw.u + 0.022, rw.vStart + 0.34, '#f8fafc');
      fillQuadUV(nCtx, rw.u - 0.022, rw.vEnd - 0.34, rw.u - 0.010, rw.vEnd - 0.25, '#f8fafc');
      fillQuadUV(nCtx, rw.u + 0.010, rw.vEnd - 0.34, rw.u + 0.022, rw.vEnd - 0.25, '#f8fafc');

      fillQuadUV(nCtx, rw.u - 0.020, rw.vStart + 0.18, rw.u + 0.020, rw.vStart + 0.58, 'rgba(18, 22, 28, 0.55)');
      fillQuadUV(nCtx, rw.u - 0.020, rw.vEnd - 0.58, rw.u + 0.020, rw.vEnd - 0.18, 'rgba(18, 22, 28, 0.55)');
    });

    // 3E. Airport Expressway Access Loops & Central Park Landscaping
    fillQuadUV(nCtx, -0.05, -1.78, 0.38, -1.48, '#3f7d4c');
    fillQuadUV(nCtx, -0.10, 1.38, 0.28, 1.62, '#3f7d4c');
    strokeLineUV(nCtx, -0.35, -1.55, 0.85, -1.55, '#3b424d', 3.4);
    strokeLineUV(nCtx, -0.35, -1.82, 0.85, -1.82, '#3b424d', 3.4);
    strokeLineUV(nCtx, 0.85, -1.82, 0.85, 1.52, '#3b424d', 3.8);
    strokeLineUV(nCtx, -0.30, 1.52, 0.85, 1.52, '#3b424d', 3.4);

    return {
      heightCanvas,
      naturalCanvas,
      elevationCanvas,
      normalCanvas,
      roughnessCanvas
    };
  }

  // Expose to window
  window.INCHEON_BOUNDS = BOUNDS;
  window.INCHEON_OUTLINE = INCHEON_OUTLINE;
  window.INCHEON_ROADS = INCHEON_ROADS;
  window.INCHEON_PRESETS = INCHEON_PRESETS;
  window.INCHEON_AIRPORT_LAYOUT = AIRPORT_LAYOUT;
  window.inIncheonLand = inIncheonLand;
  window.createIncheonAssets = createIncheonAssets;
})();
