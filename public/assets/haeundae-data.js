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

  // Procedural Asset Generator for Haeundae: 2048x2048 realistic geological elevation, satellite textures, normal & roughness maps
  function createHaeundaeAssets() {
    const W = 2048;
    const H = 2048;
    const HW = 512;
    const HH = 512;

    // Fast deterministic 32-bit integer hash noise
    function pseudoNoise(ix, iy) {
      let n = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263)) | 0;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
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
        a *= 0.5; f *= 2.03;
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

    // Full-resolution 2048x2048 raster polygon mask so coastlines have crisp, stair-free curves
    const fullMaskCanvas = document.createElement('canvas');
    fullMaskCanvas.width = W;
    fullMaskCanvas.height = H;
    const fmCtx = fullMaskCanvas.getContext('2d', { willReadFrequently: true });
    fmCtx.beginPath();
    HAEUNDAE_OUTLINE.forEach(([lng, lat], i) => {
      const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
      const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;
      if (i === 0) fmCtx.moveTo(x, y);
      else fmCtx.lineTo(x, y);
    });
    fmCtx.closePath();
    fmCtx.fillStyle = '#ffffff';
    fmCtx.fill();
    const fullMaskPixels = fmCtx.getImageData(0, 0, W, H).data;

    // Heightmap land mask (512x512)
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

    // Realistic geological elevation model:
    function calculateElevation(lat, lng) {
      let h = 3.5;

      // 1. Jangsan Mountain Massif (634m peak + interconnected ridge spines using smooth max-blend)
      let jangsanH = 0;
      const dSummit = distKm(lat, lng, 35.1802, 129.1415);
      if (dSummit < 1.55) {
        const f = Math.max(0, 1 - dSummit / 1.55);
        jangsanH = Math.max(jangsanH, 628 * Math.pow(f, 1.85));
      }

      // East ridge to Jungbong (403m)
      const dRidgeE = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1725, 129.1530);
      const dJungbong = distKm(lat, lng, 35.1725, 129.1530);
      if (dRidgeE < 0.78 && dJungbong < 1.85) {
        const along = Math.max(0, 1 - dJungbong / 1.85);
        const across = Math.max(0, 1 - dRidgeE / 0.78);
        jangsanH = Math.max(jangsanH, (235 + along * 175) * Math.pow(across, 2.0));
      }

      // South ridge to Ongnyebong (383m)
      const dRidgeS = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1675, 129.1440);
      const dOngnye = distKm(lat, lng, 35.1675, 129.1440);
      if (dRidgeS < 0.72 && dOngnye < 1.65) {
        const along = Math.max(0, 1 - dOngnye / 1.65);
        const across = Math.max(0, 1 - dRidgeS / 0.72);
        jangsanH = Math.max(jangsanH, (210 + along * 175) * Math.pow(across, 2.0));
      }

      // West ridge to Gukgibong (450m)
      const dRidgeW = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1770, 129.1330);
      const dGukgi = distKm(lat, lng, 35.1770, 129.1330);
      if (dRidgeW < 0.78 && dGukgi < 1.55) {
        const along = Math.max(0, 1 - dGukgi / 1.55);
        const across = Math.max(0, 1 - dRidgeW / 0.78);
        jangsanH = Math.max(jangsanH, (250 + along * 195) * Math.pow(across, 2.0));
      }

      // North-east ridge towards Songjeong
      const dRidgeNE = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1860, 129.1750);
      const dDistNE = distKm(lat, lng, 35.1860, 129.1750);
      if (dRidgeNE < 0.85 && dDistNE < 2.25) {
        const across = Math.max(0, 1 - dRidgeNE / 0.85);
        const along = Math.max(0, 1 - dDistNE / 2.25);
        jangsanH = Math.max(jangsanH, 235 * along * Math.pow(across, 2.0));
      }
      h += jangsanH;

      // Deep valley cut: Daecheon stream gorge
      const dGorge = distToSegmentKm(lat, lng, 35.178, 129.145, 35.170, 129.162);
      if (dGorge < 0.55 && h > 20) {
        const cut = (1 - dGorge / 0.55) * Math.min(140, h * 0.45);
        h -= cut;
      }

      // Natural mountain fractal crags
      if (h > 40) {
        const nx = (lng - BOUNDS.west) * 165;
        const ny = (lat - BOUNDS.south) * 165;
        h += (fbm(nx, ny, 3) - 0.5) * Math.min(48, h * 0.16);
      }

      // 2. Dalmaji Hill (165m)
      const dDalmaji = distKm(lat, lng, 35.1611, 129.1785);
      if (dDalmaji < 1.1) {
        const f = Math.max(0, 1 - dDalmaji / 1.1);
        h += 162 * Math.pow(f, 2.2);
      }

      // 3. Dongbaekseom (46m)
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

      // Smooth perimeter taper near bounding edges
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

    // 1. Generate Height Canvas (512x512) for smooth high-detail 3D DEM mesh
    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = HW;
    heightCanvas.height = HH;
    const hCtx = heightCanvas.getContext('2d');
    const hImg = hCtx.createImageData(HW, HH);
    const hData = hImg.data;

    const elevGrid = new Float32Array(HW * HH);

    for (let py = 0; py < HH; py++) {
      const lat = BOUNDS.north - (py / (HH - 1)) * (BOUNDS.north - BOUNDS.south);
      const rowOff = py * HW;
      for (let px = 0; px < HW; px++) {
        const lng = BOUNDS.west + (px / (HW - 1)) * (BOUNDS.east - BOUNDS.west);
        const idx = (rowOff + px) * 4;
        const inLand = maskPixels[idx + 3] > 128;

        const e = inLand ? calculateElevation(lat, lng) : 0;
        elevGrid[rowOff + px] = e;

        const val = Math.min(255, Math.floor((e / 650) * 255));
        hData[idx] = val;
        hData[idx + 1] = val;
        hData[idx + 2] = val;
        hData[idx + 3] = inLand ? 255 : 0;
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // Compute fast coastal distance inside full-res 2048x2048 land mask
    const total = W * H;
    const coastDist = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      coastDist[i] = fullMaskPixels[i * 4 + 3] > 64 ? 255 : 0;
    }
    for (let y = 1; y < H - 1; y++) {
      const rowOff = y * W;
      for (let x = 1; x < W - 1; x++) {
        const i = rowOff + x;
        if (coastDist[i] === 0) continue;
        const d = Math.min(
          coastDist[i],
          coastDist[i - 1] + 2,
          coastDist[i - W] + 2,
          coastDist[i - W - 1] + 3,
          coastDist[i - W + 1] + 3
        );
        coastDist[i] = d > 255 ? 255 : d;
      }
    }
    for (let y = H - 2; y >= 1; y--) {
      const rowOff = y * W;
      for (let x = W - 2; x >= 1; x--) {
        const i = rowOff + x;
        if (coastDist[i] === 0) continue;
        const d = Math.min(
          coastDist[i],
          coastDist[i + 1] + 2,
          coastDist[i + W] + 2,
          coastDist[i + W - 1] + 3,
          coastDist[i + W + 1] + 3
        );
        coastDist[i] = d > 255 ? 255 : d;
      }
    }

    // Inline bilinear sampler helper
    const hScaleX = (HW - 1) / (W - 1);
    const hScaleY = (HH - 1) / (H - 1);
    function sampleElevation(px, py) {
      const sx = px < 0 ? 0 : (px >= W - 1 ? HW - 1.001 : px * hScaleX);
      const sy = py < 0 ? 0 : (py >= H - 1 ? HH - 1.001 : py * hScaleY);
      const x0 = sx | 0, y0 = sy | 0;
      const dx = sx - x0, dy = sy - y0;
      const r0 = y0 * HW, r1 = r0 + HW;
      const h00 = elevGrid[r0 + x0];
      const h10 = elevGrid[r0 + x0 + 1];
      const h01 = elevGrid[r1 + x0];
      const h11 = elevGrid[r1 + x0 + 1];
      return (h00 * (1 - dx) + h10 * dx) * (1 - dy) + (h01 * (1 - dx) + h11 * dx) * dy;
    }

    // 2. Generate Photorealistic Natural, Elevation, Normal, and Roughness Textures (2048x2048)
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

    const roughnessCanvas = document.createElement('canvas');
    roughnessCanvas.width = W;
    roughnessCanvas.height = H;
    const rgCtx = roughnessCanvas.getContext('2d');
    const rgImg = rgCtx.createImageData(W, H);
    const rgData = rgImg.data;

    const lx = 0.577, ly = -0.577, lz = 0.577;

    for (let py = 0; py < H; py++) {
      const lat = BOUNDS.north - (py / (H - 1)) * (BOUNDS.north - BOUNDS.south);
      const rowOff = py * W;
      for (let px = 0; px < W; px++) {
        const lng = BOUNDS.west + (px / (W - 1)) * (BOUNDS.east - BOUNDS.west);
        const pIdx = rowOff + px;
        const idx = pIdx * 4;

        const maskAlpha = fullMaskPixels[idx + 3];
        if (maskAlpha <= 64) {
          nData[idx + 3] = 0;
          eData[idx + 3] = 0;
          nmData[idx + 3] = 0;
          rgData[idx] = 60;
          rgData[idx + 1] = 60;
          rgData[idx + 2] = 60;
          rgData[idx + 3] = 255;
          continue;
        }

        const elev = sampleElevation(px, py);
        const cDist = coastDist[pIdx];

        const xPrev = sampleElevation(px - 4, py);
        const xNext = sampleElevation(px + 4, py);
        const yPrev = sampleElevation(px, py - 4);
        const yNext = sampleElevation(px, py + 4);

        const microBumpX = (pseudoNoise(px + 1, py) - pseudoNoise(px - 1, py)) * 0.04;
        const microBumpY = (pseudoNoise(px, py + 1) - pseudoNoise(px, py - 1)) * 0.04;

        const dzdx = (xNext - xPrev) * 0.052 + microBumpX;
        const dzdy = (yNext - yPrev) * 0.052 + microBumpY;

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
        const slope = Math.hypot((xNext - xPrev) * 0.052, (yNext - yPrev) * 0.052);
        const shade = Math.min(1.36, Math.max(0.40, 0.55 + 0.58 * dot));

        const microNoise = fbm(px * 0.06, py * 0.06, 3);
        const medNoise = fbm(px * 0.018, py * 0.018, 2);
        const macroNoise = fbm(px * 0.006, py * 0.006, 2);
        const grain = pseudoNoise(px, py);

        const dBeach = distKm(lat, lng, 35.1587, 129.1604);
        const dDongbaek = distKm(lat, lng, 35.1531, 129.1523);
        const dDalmaji = distKm(lat, lng, 35.1611, 129.1785);
        const dCheongsapo = distKm(lat, lng, 35.1625, 129.1915);
        const dMarineCity = distKm(lat, lng, 35.1530, 129.1460);
        const dCentum = distKm(lat, lng, 35.1680, 129.1320);
        const dLCT = distKm(lat, lng, 35.1600, 129.1690);
        const dJwaDong = distKm(lat, lng, 35.1700, 129.1700);
        const dJangsan = distKm(lat, lng, 35.1802, 129.1415);
        const dDaecheonLake = distKm(lat, lng, 35.1715, 129.1620);
        const dGunamro = distToSegmentKm(lat, lng, 35.1635, 129.1585, 35.1588, 129.1604);

        const isSuyeongRiver = (lng < 129.1355 && lat < 35.1720 && lat > 35.1520 && elev < 9);

        let r, g, b;
        let roughVal = 212;

        // 1. Suyeong River
        if (isSuyeongRiver && lng < 129.1345) {
          const wave = Math.sin(py * 0.13 + px * 0.06) * 5 + grain * 4;
          r = Math.floor(24 + wave);
          g = Math.floor(62 + wave * 1.2);
          b = Math.floor(94 + wave);
          roughVal = 52;
        }
        // 2. Daecheon Lake
        else if (dDaecheonLake < 0.22 && elev < 36) {
          r = Math.floor(28 + microNoise * 8);
          g = Math.floor(68 + microNoise * 12);
          b = Math.floor(96 + microNoise * 14);
          roughVal = 58;
        }
        // 3. Haeundae Beach Golden Sand Crescent & Surf Edge
        else if (dBeach < 0.42 && elev < 14) {
          if (cDist <= 4) {
            // Crisp breaking seafoam & shallow emerald swash
            const foamMix = Math.max(0, 1 - cDist / 5) * (0.65 + microNoise * 0.35);
            r = Math.floor(216 + foamMix * 32);
            g = Math.floor(228 + foamMix * 22);
            b = Math.floor(220 + foamMix * 30);
            roughVal = 78;
          } else if (cDist <= 14) {
            // Wet tidal sand
            r = Math.floor(210 + microNoise * 10 + grain * 5);
            g = Math.floor(192 + microNoise * 10 + grain * 5);
            b = 154;
            roughVal = 112;
          } else if (dBeach < 0.30) {
            // Fine golden dry beach sand
            r = Math.floor(242 + microNoise * 10 + grain * 6);
            g = Math.floor(224 + microNoise * 10 + grain * 6);
            b = Math.floor(182 + microNoise * 8);
            roughVal = 198;
          } else {
            // Coastal pine promenade buffer
            r = Math.floor(38 + microNoise * 16 + grain * 5);
            g = Math.floor(76 + microNoise * 18 + grain * 6);
            b = Math.floor(42 + microNoise * 12);
            roughVal = 228;
          }
        }
        // 4. Dongbaekseom Island Peninsula
        else if (dDongbaek < 0.48) {
          if (elev < 10 || cDist <= 10) {
            r = Math.floor(68 + microNoise * 18 + grain * 8);
            g = Math.floor(72 + microNoise * 18 + grain * 8);
            b = 68;
            roughVal = cDist <= 4 ? 95 : 204;
          } else if (distKm(lat, lng, 35.1525, 129.1518) < 0.08) {
            r = Math.floor(215 + microNoise * 15);
            g = Math.floor(210 + microNoise * 15);
            b = Math.floor(195 + microNoise * 15);
            roughVal = 128;
          } else {
            r = Math.floor(28 + microNoise * 14 + grain * 6);
            g = Math.floor(76 + microNoise * 18 + grain * 6);
            b = Math.floor(38 + microNoise * 12);
            roughVal = 230;
          }
        }
        // 5. Cheongsapo Harbor & Breakwaters
        else if (dCheongsapo < 0.35 && elev < 18) {
          r = Math.floor(128 + microNoise * 24 + grain * 8);
          g = Math.floor(132 + microNoise * 22 + grain * 8);
          b = Math.floor(136 + microNoise * 20);
          roughVal = 185;
        }
        // 6. Dalmaji Hill coastal ridge & cliffs
        else if (dDalmaji < 0.85 && elev > 18) {
          if (slope > 0.38 || cDist <= 12) {
            r = Math.floor(94 + microNoise * 22 + grain * 8);
            g = Math.floor(96 + microNoise * 22 + grain * 8);
            b = 88;
            roughVal = 208;
          } else {
            const cherryMix = Math.sin(px * 0.075 + py * 0.075) > 0.4 ? 16 : 0;
            r = Math.floor(52 + cherryMix + microNoise * 18 + grain * 5);
            g = Math.floor(92 + microNoise * 22 + grain * 5);
            b = Math.floor(54 + microNoise * 14);
            roughVal = 226;
          }
        }
        // 7. Gunam-ro culture street
        else if (dGunamro < 0.045 && elev < 20) {
          r = Math.floor(205 + microNoise * 12 + grain * 6);
          g = Math.floor(198 + microNoise * 12 + grain * 6);
          b = Math.floor(188 + microNoise * 12);
          roughVal = 175;
        }
        // 8. Jangsan Mountain Massif
        else if (elev > 130) {
          const ratio = (elev - 130) / 504;
          if (dJangsan < 0.26) {
            r = Math.floor(142 + microNoise * 26 + grain * 8);
            g = Math.floor(138 + microNoise * 24 + grain * 8);
            b = Math.floor(130 + microNoise * 20);
            roughVal = 212;
          } else if (slope > 0.30 && (microNoise > 0.42 || ratio > 0.60)) {
            r = Math.floor(148 + microNoise * 22 + grain * 8);
            g = Math.floor(144 + microNoise * 20 + grain * 8);
            b = Math.floor(138 + microNoise * 18);
            roughVal = 215;
          } else if (ratio > 0.55 && macroNoise > 0.45) {
            const windStripe = Math.sin(px * 0.175 + py * 0.09) * 8;
            r = Math.floor(182 + windStripe + microNoise * 16 + grain * 5);
            g = Math.floor(170 + windStripe * 0.9 + microNoise * 14 + grain * 5);
            b = Math.floor(134 + windStripe * 0.7 + microNoise * 12);
            roughVal = 224;
          } else {
            const sub = ratio;
            r = Math.floor(36 + sub * 18 + microNoise * 14 + grain * 5);
            g = Math.floor(78 + sub * 16 + microNoise * 18 + grain * 5);
            b = Math.floor(40 + sub * 16 + microNoise * 12);
            roughVal = 232;
          }
        }
        // 9. Marine City, Centum City & LCT Urban Skylines
        else if (dMarineCity < 0.65 || dCentum < 0.85 || dLCT < 0.40) {
          const blockX = Math.floor(px * 0.09);
          const blockY = Math.floor(py * 0.09);
          const blockHash = pseudoNoise(blockX, blockY);
          const subX = (px * 0.09) - blockX;
          const subY = (py * 0.09) - blockY;
          const isRoad = (subX < 0.18 || subY < 0.18);

          if (isRoad) {
            r = Math.floor(66 + microNoise * 8 + grain * 4);
            g = Math.floor(68 + microNoise * 8 + grain * 4);
            b = Math.floor(72 + microNoise * 8);
            roughVal = 148;
          } else if (blockHash < 0.42) {
            r = Math.floor(152 + microNoise * 16 + grain * 4);
            g = Math.floor(182 + microNoise * 18 + grain * 4);
            b = Math.floor(218 + microNoise * 20);
            roughVal = 96; // Reflective architectural curtain-wall towers
          } else {
            r = Math.floor(188 + microNoise * 12 + grain * 5);
            g = Math.floor(190 + microNoise * 12 + grain * 5);
            b = Math.floor(194 + microNoise * 12);
            roughVal = 178;
          }
        }
        // 10. Haeundae New Town / Jwa-dong City Blocks (organic contour-following urban footprint)
        else if (dJwaDong + (macroNoise - 0.5) * 0.55 < 1.18 && elev < 82) {
          const superX = Math.floor(px * 0.042);
          const superY = Math.floor(py * 0.042);
          const superHash = pseudoNoise(superX, superY);
          const localX = (px * 0.042) - superX;
          const localY = (py * 0.042) - superY;
          const isMainAvenue = (localX < 0.11 || localY < 0.11);
          const bldgRow = Math.floor(localY * 6);
          const bldgCol = Math.floor(localX * 5);
          const inBldg = (localY * 6 - bldgRow < 0.56 && localX * 5 - bldgCol < 0.84);

          if (isMainAvenue) {
            r = Math.floor(74 + microNoise * 10 + grain * 4);
            g = Math.floor(78 + microNoise * 10 + grain * 4);
            b = Math.floor(82 + microNoise * 10);
            roughVal = 152;
          } else if (inBldg) {
            if (superHash < 0.32) {
              r = Math.floor(136 + microNoise * 14);
              g = Math.floor(160 + microNoise * 16);
              b = Math.floor(184 + microNoise * 16);
            } else if (superHash < 0.68) {
              r = Math.floor(172 + microNoise * 14);
              g = Math.floor(176 + microNoise * 14);
              b = Math.floor(180 + microNoise * 14);
            } else {
              r = Math.floor(144 + microNoise * 14);
              g = Math.floor(164 + microNoise * 14);
              b = Math.floor(152 + microNoise * 14);
            }
            roughVal = 176;
          } else {
            r = Math.floor(54 + microNoise * 16 + grain * 5);
            g = Math.floor(94 + microNoise * 18 + grain * 5);
            b = Math.floor(50 + microNoise * 12);
            roughVal = 226;
          }
        }
        // 11. Foothills, Pine Woodlands & Riverbank Green Belts (multi-octave forest canopy)
        else {
          const canopyCluster = medNoise * 0.55 + microNoise * 0.45;
          r = Math.floor(40 + canopyCluster * 34 + grain * 6);
          g = Math.floor(78 + canopyCluster * 42 + grain * 7);
          b = Math.floor(40 + canopyCluster * 24 + grain * 4);
          roughVal = 230;
        }

        // Crisp rocky seawall / coastal surf line on rocky headlands outside beach
        if (cDist <= 4 && !(dBeach < 0.42 && elev < 14)) {
          const foam = fbm(px * 0.14, py * 0.14, 2);
          if (cDist <= 2 && foam > 0.42) {
            r = Math.floor(r * 0.35 + 236 * 0.65);
            g = Math.floor(g * 0.35 + 246 * 0.65);
            b = Math.floor(b * 0.35 + 250 * 0.65);
            roughVal = 88;
          }
        }

        nData[idx] = Math.min(255, Math.floor(r * shade));
        nData[idx + 1] = Math.min(255, Math.floor(g * shade));
        nData[idx + 2] = Math.min(255, Math.floor(b * shade));
        nData[idx + 3] = 255;

        rgData[idx] = roughVal;
        rgData[idx + 1] = roughVal;
        rgData[idx + 2] = roughVal;
        rgData[idx + 3] = 255;

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

        const contourLine = Math.abs(Math.sin(elev * 0.06283));
        const contourMinor = elev < 180 ? Math.abs(Math.sin(elev * 0.31416)) : 1.0;
        const contourFactor = contourLine < 0.08 ? 0.84 : (contourMinor < 0.06 ? 0.94 : 1.0);

        eData[idx] = Math.min(255, Math.floor(er * shade * contourFactor));
        eData[idx + 1] = Math.min(255, Math.floor(eg * shade * contourFactor));
        eData[idx + 2] = Math.min(255, Math.floor(eb * shade * contourFactor));
        eData[idx + 3] = 255;
      }
    }

    nCtx.putImageData(nImg, 0, 0);
    eCtx.putImageData(eImg, 0, 0);
    nmCtx.putImageData(nmImg, 0, 0);
    rgCtx.putImageData(rgImg, 0, 0);

    return {
      heightCanvas,
      naturalCanvas,
      elevationCanvas,
      normalCanvas,
      roughnessCanvas
    };
  }

  // Expose to window
  window.HAEUNDAE_BOUNDS = BOUNDS;
  window.HAEUNDAE_OUTLINE = HAEUNDAE_OUTLINE;
  window.HAEUNDAE_ROADS = HAEUNDAE_ROADS;
  window.HAEUNDAE_PRESETS = HAEUNDAE_PRESETS;
  window.createHaeundaeAssets = createHaeundaeAssets;
})();
