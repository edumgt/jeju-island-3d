// Incheon, Incheon Bridge, and Incheon International Airport 3D Asset Data & Generator
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

  // Coastal outline and land polygons for Incheon mainland & Songdo
  const INCHEON_OUTLINE = [
    [126.6500, 37.3400], // Songdo South New Port
    [126.6200, 37.3550], // Songdo Southwest coastal dike
    [126.6050, 37.3800], // Songdo Incheon Bridge bridgehead
    [126.5950, 37.4200], // Incheon Coastal Pier / Port
    [126.5900, 37.4550], // Incheon Inner Port / Lock gate
    [126.5950, 37.4760], // Wolmido west tip
    [126.6080, 37.4900], // Bukseongpo / North Port
    [126.6250, 37.5150], // Incheon North Port industrial
    [126.6350, 37.5350], // Cheongna west waterfront
    [126.6200, 37.5500], // Yeongjong Bridge east bridgehead
    [126.6800, 37.5550], // Cheongna East / Asiad stadium
    [126.7200, 37.5450], // Bupyeong / Gyeyang boundary
    [126.7350, 37.5000], // Bupyeong / Juan
    [126.7400, 37.4500], // Namdong / Munhak
    [126.7250, 37.4100], // Namdong Industrial Complex
    [126.6900, 37.3700], // Songdo East canal entrance
    [126.6600, 37.3450],
    [126.6500, 37.3400]
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

  // Land check helpers
  function inYeongjong(lng, lat) {
    if (inAirportReclamation(lat, lng)) return true;
    // Main Yeongjongdo & Yongyudo natural island shape
    const yjMain = Math.hypot((lng - 126.505) / 0.082, (lat - 37.482) / 0.048);
    if (yjMain < 1.0) return true;
    const yongyu = Math.hypot((lng - 126.395) / 0.036, (lat - 37.456) / 0.032);
    if (yongyu < 1.0) return true;
    // Connecting southern road dike between Yongyu and Yeongjong
    const bridgeDike = Math.hypot((lng - 126.455) / 0.068, (lat - 37.432) / 0.018);
    return bridgeDike < 1.0;
  }

  function inSongdo(lng, lat) {
    if (lng < 126.598 || lng > 126.682 || lat < 37.352 || lat > 37.416) return false;
    // Chamfer southwest seawall & southeast canal corner to match Songdo International City dikes
    if ((126.625 - lng) * 1.1 + (37.375 - lat) * 1.4 > 0.034) return false;
    if ((lng - 126.660) * 0.9 + (37.365 - lat) * 1.2 > 0.026) return false;
    return true;
  }

  function inMainland(lng, lat) {
    return (lng >= 126.602 && lat >= 37.415) || (lng >= 126.640 && lat >= 37.340) ||
      Math.hypot((lng - 126.598) / 0.014, (lat - 37.474) / 0.014) < 1.0; // Wolmido
  }

  function inIncheonLand(lng, lat) {
    return inYeongjong(lng, lat) || inSongdo(lng, lat) || inMainland(lng, lat);
  }

  // Procedural Asset Generator for Incheon (2048x2048 crisp satellite + 2x vector airfield + 512x512 DEM)
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

    // Fast deterministic 32-bit integer hash noise
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
      return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
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

    // 1. Precalculate terrain height array (512x512)
    const hImg = hCtx.createImageData(hw, hh);
    const hData = hImg.data;
    const heights = new Float32Array(hw * hh);

    for (let py = 0; py < hh; py++) {
      const lat = BOUNDS.north - (py / (hh - 1)) * (BOUNDS.north - BOUNDS.south);
      const rowOff = py * hw;
      for (let px = 0; px < hw; px++) {
        const lng = BOUNDS.west + (px / (hw - 1)) * (BOUNDS.east - BOUNDS.west);
        const idx = rowOff + px;

        let elev = 0;
        const onAirportReclaim = inAirportReclamation(lat, lng);
        const onYeongjong = inYeongjong(lng, lat);

        if (onAirportReclaim) {
          elev = 8;
        } else if (onYeongjong) {
          elev = 7;

          // Baekunsan (255m peak)
          const baekDist = Math.hypot((lng - 126.518) * 90, (lat - 37.498) * 111);
          if (baekDist < 3.6) {
            const hShape = Math.cos((baekDist / 3.6) * Math.PI * 0.5);
            const ridgeNoise = 0.85 + fbm(px * 0.07, py * 0.07, 3) * 0.3;
            elev += Math.pow(hShape, 1.7) * 245 * ridgeNoise;
          }

          // Yongyudo hills (west of airport)
          const yongDist = Math.hypot((lng - 126.392) * 90, (lat - 37.454) * 111);
          if (yongDist < 2.2) {
            const hShape = Math.cos((yongDist / 2.2) * Math.PI * 0.5);
            elev += Math.pow(hShape, 1.5) * 115 * (0.85 + fbm(px * 0.08, py * 0.08, 3) * 0.3);
          }

          // Smooth transition so hills don't encroach onto airport platform
          const { u, v } = latLngToAirport(lat, lng);
          const marginU = Math.max(0, Math.abs(u) - 2.38);
          const marginV = Math.max(0, Math.abs(v) - 2.58);
          const edgeDist = Math.hypot(marginU, marginV);
          if (edgeDist < 0.45) {
            const blend = edgeDist / 0.45;
            elev = 8 + (elev - 8) * blend;
          }
        }

        // Songdo International City
        if (inSongdo(lng, lat)) {
          elev = Math.max(elev, 7);
        }

        // Mainland Hills + Wolmido (105m)
        if (inMainland(lng, lat)) {
          elev = Math.max(elev, 11);

          const wolDist = Math.hypot((lng - 126.601) * 90, (lat - 37.475) * 111);
          if (wolDist < 1.1) {
            elev += Math.pow(Math.cos((wolDist / 1.1) * Math.PI * 0.5), 1.4) * 95;
          }

          const munDist = Math.hypot((lng - 126.678) * 90, (lat - 37.433) * 111);
          if (munDist < 3.6) {
            elev += Math.pow(Math.cos((munDist / 3.6) * Math.PI * 0.5), 1.6) * 208 * (0.88 + fbm(px * 0.06, py * 0.06, 3) * 0.24);
          }

          const chnDist = Math.hypot((lng - 126.655) * 90, (lat - 37.408) * 111);
          if (chnDist < 2.2) {
            elev += Math.pow(Math.cos((chnDist / 2.2) * Math.PI * 0.5), 1.5) * 158;
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
    const landType = new Uint8Array(total); // 0: sea, 1: airport, 2: songdo, 3: yeongjong/mainland
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

    // 2. Render base 2048x2048 satellite terrain, elevation, normal & roughness maps
    const nImg = nCtx.createImageData(w, h);
    const nData = nImg.data;
    const eImg = eCtx.createImageData(w, h);
    const eData = eImg.data;
    const nmImg = nmCtx.createImageData(w, h);
    const nmData = nmImg.data;
    const rgImg = rgCtx.createImageData(w, h);
    const rgData = rgImg.data;

    const hScaleX = (hw - 1) / (w - 1);
    const hScaleY = (hh - 1) / (h - 1);

    for (let py = 0; py < h; py++) {
      const lat = BOUNDS.north - py * latStep;
      const hyF = py * hScaleY;
      const hy0 = hyF | 0;
      const hy1 = Math.min(hh - 1, hy0 + 1);
      const dyH = hyF - hy0;
      const rowOff = py * w;

      for (let px = 0; px < w; px++) {
        const lng = BOUNDS.west + px * lngStep;
        const hxF = px * hScaleX;
        const hx0 = hxF | 0;
        const hx1 = Math.min(hw - 1, hx0 + 1);
        const dxH = hxF - hx0;

        const pIdx = rowOff + px;
        const idx = pIdx * 4;

        // Bilinear height interpolation
        const elev =
          (heights[hy0 * hw + hx0] * (1 - dxH) + heights[hy0 * hw + hx1] * dxH) * (1 - dyH) +
          (heights[hy1 * hw + hx0] * (1 - dxH) + heights[hy1 * hw + hx1] * dxH) * dyH;

        const hL = heights[hy0 * hw + Math.max(0, hx0 - 1)];
        const hR = heights[hy0 * hw + Math.min(hw - 1, hx0 + 1)];
        const hU = heights[Math.max(0, hy0 - 1) * hw + hx0];
        const hD = heights[Math.min(hh - 1, hy0 + 1) * hw + hx0];

        const grain = hash(px, py);
        const microBumpX = (hash(px + 1, py) - hash(px - 1, py)) * 0.032;
        const microBumpY = (hash(px, py + 1) - hash(px, py - 1)) * 0.032;

        const dx = (hR - hL) * 0.13 + microBumpX;
        const dy = (hD - hU) * 0.13 + microBumpY;
        const nz = 1.0;
        const len = Math.hypot(dx, dy, nz);

        nmData[idx] = Math.floor((-dx / len * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.floor((-dy / len * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.floor((nz / len * 0.5 + 0.5) * 255);
        nmData[idx + 3] = 255;

        const sunX = -0.52, sunY = -0.62, sunZ = 0.58;
        const dot = Math.max(0.15, (-dx * sunX - dy * sunY + nz * sunZ) / len);
        const shade = 0.60 + dot * 0.45;

        const nCoarse = fbm(px * 0.013, py * 0.013, 3);
        const nFine = fbm(px * 0.06, py * 0.06, 2);

        const kind = landType[pIdx];
        const cDist = coastDist[pIdx];

        let r = 28, g = 68, b = 104, a = 255;
        let roughVal = 52; // Glossy water default

        if (kind === 0) {
          // West Sea mudflats (갯벌) & shallow coastal dendritic tidal channels
          const distAirport = Math.max(
            Math.abs(lat - 37.4615) - 0.032,
            Math.abs(lng - 126.4425) - 0.038
          );
          const distYJ = Math.hypot((lng - 126.495) / 0.095, (lat - 37.475) / 0.055) - 1.0;
          const distSongdo = Math.hypot(Math.max(0, 126.600 - lng), Math.max(0, 37.358 - lat)) * 12;
          const mudZone = Math.min(Math.max(0, distAirport * 18), Math.max(0, distYJ * 3.5), distSongdo);

          if (mudZone < 0.30) {
            const warpX = fbm(px * 0.011, py * 0.011, 2) * 15;
            const warpY = fbm(px * 0.011 + 19.3, py * 0.011 + 7.1, 2) * 15;
            const tidalCreek = Math.abs(fbm((px + warpX) * 0.024, (py + warpY) * 0.024, 3) - 0.5) * 2;
            const subCreek = Math.abs(fbm((px - warpY) * 0.058, (py + warpX) * 0.058, 2) - 0.5) * 2;
            const isCreek = tidalCreek < 0.075 || subCreek < 0.045;
            const tShallow = Math.max(0, 1 - mudZone / 0.30);
            if (isCreek) {
              r = Math.floor(42 + tShallow * 18 + nFine * 8);
              g = Math.floor(96 + tShallow * 24 + nFine * 10);
              b = Math.floor(126 + tShallow * 18 + nFine * 10);
              a = Math.round(135 + tShallow * 95);
              roughVal = 54;
            } else {
              // Warm wet tidal silt-sand flats near island coastlines
              r = Math.floor(96 + tShallow * 38 + nFine * 12 + grain * 5);
              g = Math.floor(116 + tShallow * 26 + nFine * 10 + grain * 5);
              b = Math.floor(122 + nFine * 10);
              a = Math.round(tShallow * 225);
              roughVal = Math.round(92 + tShallow * 55);
            }
          } else {
            // Transparent open sea so the 3D ocean plane renders without a rectangular seam
            a = 0;
            roughVal = 48;
          }
        } else if (kind === 1) {
          // Manicured airfield turf grass base (runways & aprons drawn in 2x vector pass below)
          r = Math.floor(68 + nCoarse * 18 + nFine * 10 + grain * 5);
          g = Math.floor(110 + nCoarse * 20 + nFine * 12 + grain * 6);
          b = Math.floor(62 + nCoarse * 10);
          roughVal = 222;
        } else if (kind === 2) {
          const inCanal = Math.abs((lng - 126.638) - (lat - 37.392) * 0.32) < 0.0020 && (lat >= 37.384 && lat <= 37.400);
          const inPark = Math.abs((lng - 126.638) - (lat - 37.392) * 0.32) < 0.0052 && (lat >= 37.382 && lat <= 37.402);
          if (inCanal) {
            r = 34; g = 122; b = 152;
            roughVal = 45;
          } else if (inPark) {
            r = Math.floor(60 + nFine * 16 + grain * 5);
            g = Math.floor(120 + nFine * 18 + grain * 5);
            b = Math.floor(68 + nFine * 10);
            roughVal = 220;
          } else if (cDist <= 5) {
            // Coastal engineered granite seawall dike edge
            r = Math.floor(124 + nFine * 18 + grain * 8);
            g = Math.floor(130 + nFine * 16 + grain * 8);
            b = Math.floor(136 + nFine * 16);
            roughVal = 188;
          } else {
            const gx = (px * 0.055) % 1;
            const gy = (py * 0.055) % 1;
            const isRoad = gx < 0.14 || gy < 0.14;
            if (isRoad) {
              r = Math.floor(74 + grain * 6); g = Math.floor(78 + grain * 6); b = Math.floor(84 + grain * 6);
              roughVal = 148;
            } else {
              const blockHash = hash(Math.floor(px * 0.055), Math.floor(py * 0.055));
              if (blockHash < 0.24) {
                // Pocket neighborhood parks & green boulevards
                r = Math.floor(66 + nFine * 16);
                g = Math.floor(118 + nFine * 18);
                b = Math.floor(72 + nFine * 12);
                roughVal = 222;
              } else {
                r = Math.floor(144 + nCoarse * 24 + grain * 5);
                g = Math.floor(160 + nCoarse * 22 + grain * 5);
                b = Math.floor(176 + nCoarse * 20);
                roughVal = 138;
              }
            }
          }
        } else {
          // Eurwangni golden sandy beach arc with surf & wet tide band
          const eurDist = Math.hypot((lng - 126.371) * 90, (lat - 37.446) * 111);
          if (eurDist < 0.44 && elev < 18) {
            if (cDist <= 3) {
              r = 226; g = 238; b = 236;
              roughVal = 82;
            } else if (cDist <= 9) {
              r = Math.floor(194 + nFine * 12);
              g = Math.floor(174 + nFine * 12);
              b = Math.floor(132 + nFine * 10);
              roughVal = 118;
            } else {
              r = Math.floor(212 + nFine * 16 + grain * 6);
              g = Math.floor(192 + nFine * 14 + grain * 6);
              b = Math.floor(148 + nFine * 12);
              roughVal = 198;
            }
          } else if (cDist <= 4) {
            // Coastal riprap / basalt headland rim & seafoam edge
            const foam = nFine > 0.58 && cDist <= 2;
            if (foam) {
              r = 212; g = 228; b = 235;
              roughVal = 92;
            } else {
              r = Math.floor(88 + nFine * 18 + grain * 8);
              g = Math.floor(94 + nFine * 16 + grain * 8);
              b = 92;
              roughVal = 185;
            }
          } else if (elev > 145) {
            // Rocky granite ridges
            r = Math.floor(108 + nCoarse * 22 + nFine * 14 + grain * 7);
            g = Math.floor(114 + nCoarse * 20 + nFine * 12 + grain * 7);
            b = Math.floor(104 + nCoarse * 18);
            roughVal = 212;
          } else if (elev > 34) {
            // Mountain forest canopy with rich organic variation
            const canopy = nCoarse * 0.55 + nFine * 0.45;
            r = Math.floor(38 + canopy * 34 + grain * 6);
            g = Math.floor(80 + canopy * 44 + grain * 7);
            b = Math.floor(40 + canopy * 22 + grain * 4);
            roughVal = 232;
          } else if (lng > 126.625 && elev < 26 + nCoarse * 8) {
            // Incheon mainland urban districts (Cheongna / Port / Guwol)
            const bx = Math.floor(px * 0.09);
            const by = Math.floor(py * 0.09);
            const subX = px * 0.09 - bx;
            const subY = py * 0.09 - by;
            const bHash = hash(bx, by);
            if (subX < 0.14 || subY < 0.14) {
              r = Math.floor(76 + grain * 6); g = Math.floor(80 + grain * 6); b = Math.floor(85 + grain * 6);
              roughVal = 152;
            } else if (bHash < 0.22) {
              r = Math.floor(62 + nFine * 16); g = Math.floor(104 + nFine * 20); b = Math.floor(58 + nFine * 12);
              roughVal = 224;
            } else if (bHash < 0.65) {
              r = Math.floor(116 + nFine * 18 + grain * 5);
              g = Math.floor(122 + nFine * 16 + grain * 5);
              b = Math.floor(128 + nFine * 16);
              roughVal = 176;
            } else {
              r = Math.floor(128 + nFine * 16 + grain * 5);
              g = Math.floor(134 + nFine * 16 + grain * 5);
              b = Math.floor(142 + nFine * 14);
              roughVal = 166;
            }
          } else {
            // Coastal lowlands, meadows & rural Yeongjong plains
            const meadow = nCoarse * 0.5 + nFine * 0.5;
            r = Math.floor(58 + meadow * 34 + grain * 6);
            g = Math.floor(98 + meadow * 38 + grain * 6);
            b = Math.floor(52 + meadow * 22 + grain * 4);
            roughVal = 224;
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
        const contourLine = Math.abs(Math.sin(elev * 0.12566)); // every 25m
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

    // Apron concrete expansion slab grid & aircraft parking bay markings
    for (let u = -0.68; u <= 0.92; u += 0.16) {
      strokeLineUV(nCtx, u, -1.30, u, 1.28, 'rgba(72, 80, 90, 0.28)', 0.7);
    }
    for (let v = -1.25; v <= 1.25; v += 0.18) {
      strokeLineUV(nCtx, -0.76, v, 0.96, v, 'rgba(72, 80, 90, 0.28)', 0.7);
    }

    // Yellow aircraft parking lead-in lines along T1, Concourse & T2 gates
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

    // 3D. 4 Main Runways with realistic shoulders, asphalt, touchdown rubber & white threshold piano keys
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
