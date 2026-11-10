// Busan Haeundae 3D Asset Data & Generator
// Real geographical contour: Dongbaekseom, Haeundae Beach, Mipo, Dalmaji Hill, Cheongsapo, Suyeong River, and Jangsan Mountain
(() => {
  'use strict';

  // Geographic bounds of Haeundae area
  // West: Centum City/Suyeong River, South: Suyeong Bay/Sea, East: Cheongsapo/Songjeong entrance, North: Jangsan summit
  const BOUNDS = { west: 129.130, south: 35.145, east: 129.200, north: 35.195 };

  // Haeundae coastline and boundary polygon (lng, lat)
  const HAEUNDAE_OUTLINE = [
    // Suyeong River estuary & Marine City coast
    [129.1330, 35.1540],
    [129.1370, 35.1530],
    [129.1415, 35.1525],
    [129.1450, 35.1518],
    [129.1485, 35.1505], // Marine City tip
    // Dongbaekseom Peninsula
    [129.1505, 35.1515],
    [129.1515, 35.1500],
    [129.1525, 35.1492], // Dongbaekseom lighthouse/Nurimaru southern tip
    [129.1545, 35.1505],
    [129.1555, 35.1530],
    [129.1550, 35.1555], // Westin Chosun front
    // Haeundae Beach curve (golden sand arc)
    [129.1570, 35.1575],
    [129.1595, 35.1585],
    [129.1625, 35.1590],
    [129.1660, 35.1593],
    [129.1685, 35.1590], // LCT front
    // Mipo Port
    [129.1705, 35.1582],
    [129.1725, 35.1580],
    // Dalmaji coastal cliff & Blueline Park rail
    [129.1765, 35.1578],
    [129.1820, 35.1595],
    [129.1870, 35.1610],
    // Cheongsapo
    [129.1915, 35.1625],
    [129.1940, 35.1645],
    // Songjeong direction (eastern edge)
    [129.1975, 35.1680],
    [129.1985, 35.1740],
    [129.1965, 35.1800],
    // North-East Jangsan ridge
    [129.1900, 35.1860],
    [129.1800, 35.1910],
    [129.1650, 35.1935],
    // Jangsan Summit (634m) north slope
    [129.1500, 35.1945],
    [129.1415, 35.1930],
    // West ridge towards Jaesong / Centum
    [129.1350, 35.1880],
    [129.1320, 35.1810],
    [129.1310, 35.1740],
    // Centum City / BEXCO / Suyeong riverbank
    [129.1320, 35.1660],
    [129.1325, 35.1590]
  ];

  // Haeundae Major Roads (Points: [lat, lon])
  const HAEUNDAE_ROADS = [
    // Haeundae Beach Road (마린시티 - 동백섬 - 해수욕장 - 미포)
    {
      name: '해운대해변로',
      type: 'trunk',
      points: [
        [35.1530, 129.1380],
        [35.1525, 129.1430],
        [35.1520, 129.1480],
        [35.1540, 129.1520],
        [35.1565, 129.1555],
        [35.1585, 129.1595],
        [35.1595, 129.1640],
        [35.1600, 129.1685],
        [35.1590, 129.1710]
      ]
    },
    // Dalmaji-gil scenic road (미포 - 달맞이언덕 - 청사포)
    {
      name: '달맞이길',
      type: 'primary',
      points: [
        [35.1590, 129.1710],
        [35.1605, 129.1730],
        [35.1615, 129.1765],
        [35.1610, 129.1810],
        [35.1630, 129.1850],
        [35.1650, 129.1880],
        [35.1680, 129.1920]
      ]
    },
    // Gunam-ro culture street (해운대역 - 해운대광장)
    {
      name: '구남로',
      type: 'primary',
      points: [
        [35.1635, 129.1585],
        [35.1615, 129.1595],
        [35.1588, 129.1604]
      ]
    },
    // Dongbaek Island circular walking path
    {
      name: '동백순환로',
      type: 'secondary',
      points: [
        [35.1540, 129.1520],
        [35.1515, 129.1510],
        [35.1500, 129.1530],
        [35.1515, 129.1545],
        [35.1540, 129.1540]
      ]
    },
    // Haeundae-daero / Subway Line 2 axis (센텀 - 벡스코 - 해운대역 - 좌동 신시가지)
    {
      name: '해운대로',
      type: 'motorway',
      points: [
        [35.1650, 129.1330],
        [35.1660, 129.1390],
        [35.1655, 129.1480],
        [35.1645, 129.1550],
        [35.1635, 129.1585],
        [35.1650, 129.1660],
        [35.1670, 129.1750],
        [35.1710, 129.1850]
      ]
    },
    // Haeundae Blueline Park coastal railway (미포 - 청사포 - 송정)
    {
      name: '블루라인파크 철길',
      type: 'primary',
      points: [
        [35.1595, 129.1675],
        [35.1588, 129.1730],
        [35.1590, 129.1780],
        [35.1610, 129.1840],
        [35.1630, 129.1915]
      ]
    }
  ];

  // Busan Haeundae Presets
  const HAEUNDAE_PRESETS = [
    { id: 'haeundae_beach', name: '해운대 해수욕장', category: '해변', icon: '〰', lat: 35.1587, lng: 129.1604 },
    { id: 'dongbaek', name: '동백섬 (누리마루)', category: '자연 명소', icon: '◈', lat: 35.1531, lng: 129.1523 },
    { id: 'lct', name: '엘시티 랜드마크', category: '랜드마크', icon: '🏢', lat: 35.1600, lng: 129.1690 },
    { id: 'dalmaji', name: '달맞이길', category: '산책로·언덕', icon: '🌸', lat: 35.1611, lng: 129.1785 },
    { id: 'blueline', name: '블루라인파크 (미포)', category: '관광 철도', icon: '🚃', lat: 35.1595, lng: 129.1670 },
    { id: 'thebay101', name: '더베이 101', category: '야경 명소', icon: '✨', lat: 35.1565, lng: 129.1521 },
    { id: 'jangsan', name: '장산 정상 (634m)', category: '산악 지형', icon: '⛰', lat: 35.1802, lng: 129.1415 },
    { id: 'market', name: '해운대 전통시장', category: '맛집·쇼핑', icon: '♨', lat: 35.1618, lng: 129.1615 }
  ];

  // Procedural Asset Generator for Haeundae: realistic geological elevation & satellite textures
  function createHaeundaeAssets() {
    const W = 1024;
    const H = 1024;
    const HW = 256;
    const HH = 256;

    // Fast raster polygon mask (O(1) land check)
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = HW;
    maskCanvas.height = HH;
    const mCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    mCtx.beginPath();
    HAEUNDAE_OUTLINE.forEach(([lng, lat], i) => {
      const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * HW;
      const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * HH;
      if (i === 0) mCtx.moveTo(x, y);
      else mCtx.lineTo(x, y);
    });
    mCtx.closePath();
    mCtx.fillStyle = '#ffffff';
    mCtx.fill();
    const maskPixels = mCtx.getImageData(0, 0, HW, HH).data;

    function isLand(px, py) {
      const mx = Math.max(0, Math.min(HW - 1, Math.floor((px / W) * HW)));
      const my = Math.max(0, Math.min(HH - 1, Math.floor((py / H) * HH)));
      return maskPixels[(my * HW + mx) * 4 + 3] > 128;
    }

    // Procedural noise functions
    function pseudoNoise(x, y) {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return s - Math.floor(s);
    }
    function smoothNoise(x, y) {
      const ix = Math.floor(x), iy = Math.floor(y);
      const fx = x - ix, fy = y - iy;
      const sfx = fx * fx * (3 - 2 * fx);
      const sfy = fy * fy * (3 - 2 * fy);
      const n00 = pseudoNoise(ix, iy);
      const n10 = pseudoNoise(ix + 1, iy);
      const n01 = pseudoNoise(ix, iy + 1);
      const n11 = pseudoNoise(ix + 1, iy + 1);
      return (n00 * (1 - sfx) + n10 * sfx) * (1 - sfy) + (n01 * (1 - sfx) + n11 * sfx) * sfy;
    }
    function fbm(x, y, oct) {
      let v = 0, a = 0.5, f = 1;
      for (let i = 0; i < (oct || 3); i++) {
        v += smoothNoise(x * f, y * f) * a;
        a *= 0.5; f *= 2;
      }
      return v;
    }

    function distKm(lat1, lng1, lat2, lng2) {
      return Math.hypot((lat1 - lat2) * 111.19, (lng1 - lng2) * 91.5);
    }

    function distToSegmentKm(lat, lng, lat1, lng1, lat2, lng2) {
      const x = (lng - BOUNDS.west) * 91.5;
      const y = (lat - BOUNDS.south) * 111.19;
      const x1 = (lng1 - BOUNDS.west) * 91.5;
      const y1 = (lat1 - BOUNDS.south) * 111.19;
      const x2 = (lng2 - BOUNDS.west) * 91.5;
      const y2 = (lat2 - BOUNDS.south) * 111.19;
      const dx = x2 - x1, dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return Math.hypot(x - x1, y - y1);
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lenSq));
      return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
    }

    // Realistic geological elevation model:
    // Sculpted based on real Haeundae geography with main peak, radiating ridges, and natural valleys
    function calculateElevation(lat, lng) {
      let h = 3.5; // Coastal plain baseline

      // 1. Jangsan Mountain Massif (634m peak + interconnected ridge spines)
      const dSummit = distKm(lat, lng, 35.1802, 129.1415);
      if (dSummit < 1.45) {
        const f = Math.max(0, 1 - dSummit / 1.45);
        h += 628 * Math.pow(f, 2.0);
      }

      // East ridge to Jungbong (403m at 35.1725, 129.1530)
      const dRidgeE = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1725, 129.1530);
      const dJungbong = distKm(lat, lng, 35.1725, 129.1530);
      if (dRidgeE < 0.75 && dJungbong < 1.8) {
        const along = Math.max(0, 1 - dJungbong / 1.8);
        const across = Math.max(0, 1 - dRidgeE / 0.75);
        h += (220 + along * 180) * Math.pow(across, 2.2);
      }

      // South ridge to Ongnyebong (383m at 35.1675, 129.1440)
      const dRidgeS = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1675, 129.1440);
      const dOngnye = distKm(lat, lng, 35.1675, 129.1440);
      if (dRidgeS < 0.70 && dOngnye < 1.6) {
        const along = Math.max(0, 1 - dOngnye / 1.6);
        const across = Math.max(0, 1 - dRidgeS / 0.70);
        h += (200 + along * 180) * Math.pow(across, 2.2);
      }

      // West ridge to Gukgibong (450m at 35.1770, 129.1330)
      const dRidgeW = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1770, 129.1330);
      const dGukgi = distKm(lat, lng, 35.1770, 129.1330);
      if (dRidgeW < 0.75 && dGukgi < 1.5) {
        const along = Math.max(0, 1 - dGukgi / 1.5);
        const across = Math.max(0, 1 - dRidgeW / 0.75);
        h += (240 + along * 200) * Math.pow(across, 2.2);
      }

      // North-east ridge towards Songjeong (sloping down)
      const dRidgeNE = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1860, 129.1750);
      const dDistNE = distKm(lat, lng, 35.1860, 129.1750);
      if (dRidgeNE < 0.8 && dDistNE < 2.2) {
        const across = Math.max(0, 1 - dRidgeNE / 0.8);
        const along = Math.max(0, 1 - dDistNE / 2.2);
        h += 220 * along * Math.pow(across, 2.2);
      }

      // Deep valley cut: Daecheon stream gorge between Jungbong & Ongnyebong
      const dGorge = distToSegmentKm(lat, lng, 35.178, 129.145, 35.170, 129.162);
      if (dGorge < 0.55 && h > 20) {
        const cut = (1 - dGorge / 0.55) * Math.min(140, h * 0.45);
        h -= cut;
      }

      // Natural mountain fractal crags
      if (h > 40) {
        const nx = (lng - BOUNDS.west) * 160;
        const ny = (lat - BOUNDS.south) * 160;
        h += (fbm(nx, ny, 3) - 0.5) * Math.min(48, h * 0.16);
      }

      // 2. Dalmaji Hill (와우산 165m) - coastal ridge
      const dDalmaji = distKm(lat, lng, 35.1611, 129.1785);
      if (dDalmaji < 1.1) {
        const f = Math.max(0, 1 - dDalmaji / 1.1);
        h += 162 * Math.pow(f, 2.2);
      }

      // 3. Dongbaekseom (46m) coastal headland
      const dDongbaek = distKm(lat, lng, 35.1531, 129.1523);
      if (dDongbaek < 0.42) {
        const f = Math.max(0, 1 - dDongbaek / 0.42);
        h += 44 * Math.pow(f, 2.0);
      }

      // 4. Lowland & Beach flattening
      const dBeach = distKm(lat, lng, 35.1587, 129.1604);
      if (dBeach < 0.35) h = Math.min(h, 3.5);

      const dMarine = distKm(lat, lng, 35.1530, 129.1450);
      if (dMarine < 0.65) h = Math.min(h, 6.0);

      const dCentum = distKm(lat, lng, 35.1680, 129.1320);
      if (dCentum < 0.70) h = Math.min(h, 7.5);

      // Smooth perimeter taper near bounding edges (prevents cliff cuts)
      const edgeTaper = Math.min(
        1,
        Math.min(
          (lat - BOUNDS.south) / 0.0035,
          (BOUNDS.north - lat) / 0.0035,
          (lng - BOUNDS.west) / 0.0035,
          (BOUNDS.east - lng) / 0.0035
        )
      );
      if (edgeTaper < 1) {
        const t = Math.max(0, edgeTaper);
        h *= (t * t * (3 - 2 * t));
      }

      return Math.max(0, Math.min(634, h));
    }

    // 1. Generate Height Canvas (256x256) for smooth 3D DEM mesh
    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = HW;
    heightCanvas.height = HH;
    const hCtx = heightCanvas.getContext('2d');
    const hImg = hCtx.createImageData(HW, HH);
    const hData = hImg.data;

    const elevGrid = new Float32Array(HW * HH);

    for (let py = 0; py < HH; py++) {
      const lat = BOUNDS.north - (py / (HH - 1)) * (BOUNDS.north - BOUNDS.south);
      for (let px = 0; px < HW; px++) {
        const lng = BOUNDS.west + (px / (HW - 1)) * (BOUNDS.east - BOUNDS.west);
        const idx = (py * HW + px) * 4;
        const inLand = maskPixels[idx + 3] > 128;

        const e = inLand ? calculateElevation(lat, lng) : 0;
        elevGrid[py * HW + px] = e;

        const val = Math.min(255, Math.floor((e / 650) * 255));
        hData[idx] = val;
        hData[idx + 1] = val;
        hData[idx + 2] = val;
        hData[idx + 3] = inLand ? 255 : 0;
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // Bilinear sampler for high-res 1024x1024 texture pass
    function sampleElevation(px, py) {
      const sx = Math.max(0, Math.min(HW - 1.001, (px / (W - 1)) * (HW - 1)));
      const sy = Math.max(0, Math.min(HH - 1.001, (py / (H - 1)) * (HH - 1)));
      const x0 = Math.floor(sx), y0 = Math.floor(sy);
      const dx = sx - x0, dy = sy - y0;
      const h00 = elevGrid[y0 * HW + x0];
      const h10 = elevGrid[y0 * HW + x0 + 1];
      const h01 = elevGrid[(y0 + 1) * HW + x0];
      const h11 = elevGrid[(y0 + 1) * HW + x0 + 1];
      return (h00 * (1 - dx) + h10 * dx) * (1 - dy) + (h01 * (1 - dx) + h11 * dx) * dy;
    }

    // 2. Generate Photorealistic Natural, Elevation, and Normal Map Textures (1024x1024)
    const naturalCanvas = document.createElement('canvas');
    naturalCanvas.width = W;
    naturalCanvas.height = H;
    const nCtx = naturalCanvas.getContext('2d');
    const nImg = nCtx.createImageData(W, H);
    const nData = nImg.data;

    const elevationCanvas = document.createElement('canvas');
    elevationCanvas.width = W;
    elevationCanvas.height = H;
    const eCtx = elevationCanvas.getContext('2d');
    const eImg = eCtx.createImageData(W, H);
    const eData = eImg.data;

    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = W;
    normalCanvas.height = H;
    const nmCtx = normalCanvas.getContext('2d');
    const nmImg = nmCtx.createImageData(W, H);
    const nmData = nmImg.data;

    // Analytical sun lighting: Azimuth 315° (NW), Altitude 45°
    const lx = 0.577, ly = -0.577, lz = 0.577;

    for (let py = 0; py < H; py++) {
      const lat = BOUNDS.north - (py / (H - 1)) * (BOUNDS.north - BOUNDS.south);
      for (let px = 0; px < W; px++) {
        const lng = BOUNDS.west + (px / (W - 1)) * (BOUNDS.east - BOUNDS.west);
        const idx = (py * W + px) * 4;

        if (!isLand(px, py)) {
          // Transparent outside boundary for clean Three.js cut
          nData[idx + 3] = 0;
          eData[idx + 3] = 0;
          nmData[idx + 3] = 0;
          continue;
        }

        const elev = sampleElevation(px, py);

        // Finite difference gradients for micro-slope and 3D normal vector
        const xPrev = px > 2 ? sampleElevation(px - 2, py) : elev;
        const xNext = px < W - 3 ? sampleElevation(px + 2, py) : elev;
        const yPrev = py > 2 ? sampleElevation(px, py - 2) : elev;
        const yNext = py < H - 3 ? sampleElevation(px, py + 2) : elev;

        const dzdx = (xNext - xPrev) * 0.052;
        const dzdy = (yNext - yPrev) * 0.052;

        const nx = -dzdx;
        const ny = -dzdy;
        const nz = 1.0;
        const nLen = Math.hypot(nx, ny, nz);
        const nnx = nx / nLen;
        const nny = ny / nLen;
        const nnz = nz / nLen;

        nmData[idx] = Math.round((nnx * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.round((nny * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.round((nnz * 0.5 + 0.5) * 255);
        nmData[idx + 3] = 255;

        const dot = nnx * lx + nny * ly + nnz * lz;
        const slope = Math.hypot(dzdx, dzdy);
        const shade = Math.min(1.36, Math.max(0.40, 0.55 + 0.58 * dot));

        // Procedural multi-scale organic noise
        const microNoise = fbm(px * 0.12, py * 0.12, 3);
        const medNoise = fbm(px * 0.035, py * 0.035, 2);
        const macroNoise = fbm(px * 0.012, py * 0.012, 2);

        // Geolocation distances to real Haeundae landmarks
        const dBeach = distKm(lat, lng, 35.1587, 129.1604);
        const dDongbaek = distKm(lat, lng, 35.1531, 129.1523);
        const dDalmaji = distKm(lat, lng, 35.1611, 129.1785);
        const dCheongsapo = distKm(lat, lng, 35.1625, 129.1915);
        const dMarineCity = distKm(lat, lng, 35.1530, 129.1460);
        const dCentum = distKm(lat, lng, 35.1680, 129.1320);
        const dLCT = distKm(lat, lng, 35.1600, 129.1690);
        const dJwaDong = distKm(lat, lng, 35.1700, 129.1700);
        const dJangsan = distKm(lat, lng, 35.1802, 129.1415);
        const dDaecheonLake = distKm(lat, lng, 35.1715, 129.1620); // Daecheon Lake park
        const dGunamro = distToSegmentKm(lat, lng, 35.1635, 129.1585, 35.1588, 129.1604);

        // Suyeong River waterway corridor (along the west boundary)
        const isSuyeongRiver = (lng < 129.1355 && lat < 35.1720 && lat > 35.1520 && elev < 9);

        // --- NATURAL REALISTIC SATELLITE COLOR ---
        let r, g, b;

        // 1. Suyeong River (수영강 하구 & 강변 수변구역)
        if (isSuyeongRiver && lng < 129.1345) {
          // Deep blue river water with subtle flow ripples
          const wave = Math.sin(py * 0.25 + px * 0.12) * 5;
          r = Math.floor(24 + wave);
          g = Math.floor(58 + wave * 1.2);
          b = Math.floor(88 + wave);
        }
        // 2. Daecheon Lake & Stream (대천공원 호수 & 대천천 수변)
        else if (dDaecheonLake < 0.22 && elev < 36) {
          // Tranquil mountain lake water
          r = Math.floor(28 + microNoise * 8);
          g = Math.floor(66 + microNoise * 12);
          b = Math.floor(92 + microNoise * 14);
        }
        // 3. Haeundae Beach Golden Sand Crescent & Surf Edge (해운대 해수욕장 1.5km 백사장)
        else if (dBeach < 0.40 && elev < 14) {
          const sandDist = dBeach / 0.40;
          if (sandDist < 0.16) {
            // Turquoise coastal surf foam (에메랄드빛 바닷물 & 하얀 파도 포말)
            r = Math.floor(196 + microNoise * 18);
            g = Math.floor(232 + microNoise * 14);
            b = Math.floor(230 + microNoise * 14);
          } else if (sandDist < 0.30) {
            // Wet tide edge sand (밀물에 젖은 모래)
            r = Math.floor(214 + microNoise * 10);
            g = Math.floor(196 + microNoise * 10);
            b = 158;
          } else if (sandDist < 0.72) {
            // Fine golden beach sand (천연 규사 황금빛 모래사장)
            r = Math.floor(244 + microNoise * 10);
            g = Math.floor(226 + microNoise * 10);
            b = Math.floor(184 + microNoise * 8);
          } else {
            // Coastal pine tree promenade buffer behind beach (해송 숲길 산책로)
            r = Math.floor(40 + microNoise * 16);
            g = Math.floor(76 + microNoise * 18);
            b = Math.floor(44 + microNoise * 12);
          }
        }
        // 4. Dongbaekseom Island Peninsula (동백섬 천연기념물 동백림 & 누리마루)
        else if (dDongbaek < 0.48) {
          if (elev < 8) {
            // Coastal rocky basalt cliffs (해안 갯바위)
            r = Math.floor(70 + microNoise * 18);
            g = Math.floor(72 + microNoise * 18);
            b = 68;
          } else if (distKm(lat, lng, 35.1525, 129.1518) < 0.08) {
            // Nurimaru APEC House circular copper dome rooftop
            r = Math.floor(215 + microNoise * 15);
            g = Math.floor(210 + microNoise * 15);
            b = Math.floor(195 + microNoise * 15);
          } else {
            // Dense coastal camellia & black pine canopy (동백나무·해송 숲)
            r = Math.floor(28 + microNoise * 14);
            g = Math.floor(74 + microNoise * 18);
            b = Math.floor(38 + microNoise * 12);
          }
        }
        // 5. Cheongsapo Harbor & Breakwaters (청사포 빨강·하양 등대 포구)
        else if (dCheongsapo < 0.35 && elev < 18) {
          // Granite pier and harbor breakwater
          r = Math.floor(128 + microNoise * 24);
          g = Math.floor(132 + microNoise * 22);
          b = Math.floor(136 + microNoise * 20);
        }
        // 6. Dalmaji Hill (와우산 달맞이길 벚꽃 가로수 & 해안 숲)
        else if (dDalmaji < 0.85 && elev > 18) {
          if (slope > 0.38) {
            // Coastal rocky cliffs
            r = Math.floor(95 + microNoise * 22);
            g = Math.floor(96 + microNoise * 22);
            b = 88;
          } else {
            // Coastal cherry & pine woods with cafes/villas
            const cherryMix = Math.sin(px * 0.15 + py * 0.15) > 0.4 ? 16 : 0;
            r = Math.floor(52 + cherryMix + microNoise * 18);
            g = Math.floor(92 + microNoise * 22);
            b = Math.floor(54 + microNoise * 14);
          }
        }
        // 7. Gunam-ro pedestrian culture street (구남로 화강석 보도블록)
        else if (dGunamro < 0.045 && elev < 20) {
          r = Math.floor(205 + microNoise * 12);
          g = Math.floor(198 + microNoise * 12);
          b = Math.floor(188 + microNoise * 12);
        }
        // 8. Jangsan Mountain Massif (장산 화강암 너덜겅, 억새밭, 울창한 수림)
        else if (elev > 130) {
          const ratio = (elev - 130) / 504;
          // Summit crag (장산 정상 634m 화강암 봉우리)
          if (dJangsan < 0.26) {
            r = Math.floor(142 + microNoise * 26);
            g = Math.floor(138 + microNoise * 24);
            b = Math.floor(130 + microNoise * 20);
          }
          // Talus scree slopes (장산 너덜겅 돌강 - Pleistocene periglacial rock field)
          // Located along the steep ravines and rocky slopes of Jangsan
          else if (slope > 0.30 && (microNoise > 0.42 || ratio > 0.60)) {
            // Exposed light granite rock & scree boulders
            r = Math.floor(148 + microNoise * 22);
            g = Math.floor(144 + microNoise * 20);
            b = Math.floor(138 + microNoise * 18);
          }
          // Silver grass (장산 억새군락지) plateau on the high ridge saddle
          else if (ratio > 0.55 && macroNoise > 0.45) {
            const windStripe = Math.sin(px * 0.35 + py * 0.18) * 8;
            r = Math.floor(182 + windStripe + microNoise * 16);
            g = Math.floor(170 + windStripe * 0.9 + microNoise * 14);
            b = Math.floor(134 + windStripe * 0.7 + microNoise * 12);
          }
          // Deep mountain pine, oak, and mixed temperate forest (참나무·소나무 혼효림)
          else {
            const sub = ratio;
            r = Math.floor(36 + sub * 18 + microNoise * 14);
            g = Math.floor(78 + sub * 16 + microNoise * 18);
            b = Math.floor(40 + sub * 16 + microNoise * 12);
          }
        }
        // 9. Marine City, Centum City & LCT Urban Skylines (마린시티, 센텀시티, 엘시티)
        else if (dMarineCity < 0.65 || dCentum < 0.85 || dLCT < 0.40) {
          // Structured urban grid
          const blockX = Math.floor(px * 0.18);
          const blockY = Math.floor(py * 0.18);
          const blockHash = pseudoNoise(blockX, blockY);

          // Sub-building pattern
          const subX = (px * 0.18) - blockX;
          const subY = (py * 0.18) - blockY;
          const isRoad = (subX < 0.18 || subY < 0.18);

          if (isRoad) {
            // Wide coastal avenues (해안대로 & 광장)
            r = Math.floor(66 + microNoise * 8);
            g = Math.floor(68 + microNoise * 8);
            b = Math.floor(72 + microNoise * 8);
          } else if (blockHash < 0.42) {
            // Reflective glass towers (마천루 커튼월 유리 반사)
            r = Math.floor(152 + microNoise * 16);
            g = Math.floor(182 + microNoise * 18);
            b = Math.floor(218 + microNoise * 20);
          } else {
            // Modern architectural concrete plazas & BEXCO exhibition halls
            r = Math.floor(188 + microNoise * 12);
            g = Math.floor(190 + microNoise * 12);
            b = Math.floor(194 + microNoise * 12);
          }
        }
        // 10. Haeundae New Town / Jwa-dong City Blocks (좌동 신시가지 아파트 단지)
        else if (dJwaDong < 1.35 && elev < 95) {
          // Structured Korean superblock grid (아파트 단지)
          const superX = Math.floor(px * 0.08);
          const superY = Math.floor(py * 0.08);
          const superHash = pseudoNoise(superX, superY);

          const localX = (px * 0.08) - superX;
          const localY = (py * 0.08) - superY;
          const isMainAvenue = (localX < 0.12 || localY < 0.12);

          // Internal building bars (linear apartment buildings)
          const bldgRow = Math.floor(localY * 7);
          const bldgCol = Math.floor(localX * 5);
          const inBldg = (localY * 7 - bldgRow < 0.55 && localX * 5 - bldgCol < 0.85);

          if (isMainAvenue) {
            // Major asphalt boulevards (좌동순환로 & 해운대로)
            r = Math.floor(70 + microNoise * 8);
            g = Math.floor(72 + microNoise * 8);
            b = Math.floor(76 + microNoise * 8);
          } else if (inBldg) {
            // Apartment complex rooftops (단지별 슬레이트 블루, 라이트 그레이, 민트 옥상)
            if (superHash < 0.35) {
              // Soft slate-blue roof
              r = Math.floor(142 + microNoise * 14);
              g = Math.floor(168 + microNoise * 16);
              b = Math.floor(194 + microNoise * 18);
            } else if (superHash < 0.70) {
              // Light concrete roof
              r = Math.floor(186 + microNoise * 12);
              g = Math.floor(188 + microNoise * 12);
              b = Math.floor(192 + microNoise * 12);
            } else {
              // Pale sage-mint roof
              r = Math.floor(156 + microNoise * 12);
              g = Math.floor(178 + microNoise * 14);
              b = Math.floor(164 + microNoise * 12);
            }
          } else {
            // Landscaped garden courtyards & tree-lined walkways between apartments
            r = Math.floor(58 + microNoise * 14);
            g = Math.floor(98 + microNoise * 16);
            b = Math.floor(52 + microNoise * 12);
          }
        }
        // 11. Foothills, Parks & Riverbank Green Belts (수영강변 APEC나루공원, 올림픽공원 등)
        else {
          // Lush coastal green foothills with multi-frequency canopy variation
          r = Math.floor(54 + medNoise * 18 + microNoise * 14);
          g = Math.floor(98 + medNoise * 20 + microNoise * 16);
          b = Math.floor(48 + medNoise * 14 + microNoise * 12);
        }

        // Apply analytical hillshade modulation
        nData[idx] = Math.min(255, Math.floor(r * shade));
        nData[idx + 1] = Math.min(255, Math.floor(g * shade));
        nData[idx + 2] = Math.min(255, Math.floor(b * shade));
        nData[idx + 3] = 255;

        // --- ELEVATION RELIEF COLOR ---
        const ratio = Math.min(1, elev / 634);
        let er, eg, eb;
        if (ratio < 0.15) {
          const sub = ratio / 0.15;
          er = Math.floor(70 + sub * 40);
          eg = Math.floor(185 - sub * 20);
          eb = Math.floor(135 - sub * 40);
        } else if (ratio < 0.45) {
          const sub = (ratio - 0.15) / 0.3;
          er = Math.floor(110 + sub * 105);
          eg = Math.floor(165 + sub * 20);
          eb = Math.floor(95 - sub * 40);
        } else if (ratio < 0.75) {
          const sub = (ratio - 0.45) / 0.3;
          er = Math.floor(215 + sub * 15);
          eg = Math.floor(185 - sub * 70);
          eb = Math.floor(55 + sub * 25);
        } else {
          const sub = (ratio - 0.75) / 0.25;
          er = Math.floor(230 - sub * 70);
          eg = Math.floor(115 - sub * 30);
          eb = Math.floor(80 + sub * 70);
        }

        // Subtle contour lines every 50m
        const contourLine = Math.abs(Math.sin(elev * 0.0628));
        const contourFactor = contourLine < 0.12 ? 0.88 : 1.0;

        eData[idx] = Math.min(255, Math.floor(er * shade * contourFactor));
        eData[idx + 1] = Math.min(255, Math.floor(eg * shade * contourFactor));
        eData[idx + 2] = Math.min(255, Math.floor(eb * shade * contourFactor));
        eData[idx + 3] = 255;
      }
    }

    nCtx.putImageData(nImg, 0, 0);
    eCtx.putImageData(eImg, 0, 0);
    nmCtx.putImageData(nmImg, 0, 0);

    return {
      heightCanvas,
      naturalCanvas,
      elevationCanvas,
      normalCanvas
    };
  }

  // Expose to window
  window.HAEUNDAE_BOUNDS = BOUNDS;
  window.HAEUNDAE_OUTLINE = HAEUNDAE_OUTLINE;
  window.HAEUNDAE_ROADS = HAEUNDAE_ROADS;
  window.HAEUNDAE_PRESETS = HAEUNDAE_PRESETS;
  window.createHaeundaeAssets = createHaeundaeAssets;
})();
