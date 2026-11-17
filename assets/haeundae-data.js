// Busan Haeundae 3D Asset Data & High-Detail Geological Generator
// Real geographical contour: Dongbaekseom, Suyeongman Yacht Cove, Haeundae Beach, Mipo, Dalmaji Hill, Cheongsapo, Suyeong River, and Jangsan Massif (634m)
(() => {
  'use strict';

  // Geographic bounds of Haeundae area
  // West: Centum City/Suyeong River, South: Suyeong Bay/Sea, East: Cheongsapo/Songjeong ridge, North: Jangsan summit
  const BOUNDS = { west: 129.130, south: 35.145, east: 129.200, north: 35.195 };

  // High-detail Haeundae coastline and boundary polygon (lng, lat)
  const HAEUNDAE_OUTLINE = [
    // Suyeong River estuary & Yachting Center cove
    [129.1332, 35.1542],
    [129.1358, 35.1536],
    [129.1386, 35.1544],
    [129.1410, 35.1562], // Suyeongman Yachting Center basin
    [129.1426, 35.1552],
    [129.1444, 35.1532], // Marine City West seawall
    [129.1468, 35.1516],
    [129.1490, 35.1506], // Marine City tip
    // Dongbaekseom Peninsula & Nurimaru rocky headland
    [129.1502, 35.1520],
    [129.1510, 35.1503],
    [129.1524, 35.1491], // Nurimaru APEC House / Dongbaek lighthouse southern cape
    [129.1542, 35.1499],
    [129.1554, 35.1522],
    [129.1552, 35.1548], // Westin Chosun front cove
    [129.1544, 35.1564],
    // Haeundae Beach golden crescent arc
    [129.1564, 35.1576],
    [129.1592, 35.1586],
    [129.1626, 35.1592],
    [129.1662, 35.1593],
    [129.1688, 35.1589], // LCT waterfront
    // Mipo Harbor breakwater & cove
    [129.1704, 35.1581],
    [129.1718, 35.1572],
    [129.1732, 35.1580],
    // Dalmaji coastal cliff & Moon-tan rocky coves
    [129.1764, 35.1579],
    [129.1795, 35.1588],
    [129.1828, 35.1598],
    [129.1865, 35.1609],
    [129.1892, 35.1618],
    // Cheongsapo harbor cove & Daritdol headland
    [129.1912, 35.1628],
    [129.1924, 35.1621],
    [129.1944, 35.1642],
    [129.1966, 35.1664],
    // Songjeong ridge & eastern inland boundary
    [129.1982, 35.1695],
    [129.1986, 35.1745],
    [129.1968, 35.1802],
    [129.1915, 35.1858],
    // North-East Jangsan massif ridge
    [129.1815, 35.1912],
    [129.1670, 35.1936],
    [129.1510, 35.1944],
    [129.1415, 35.1932],
    // West ridge towards Jaesong / Centum / Suyeong River
    [129.1350, 35.1882],
    [129.1320, 35.1812],
    [129.1312, 35.1742],
    [129.1322, 35.1662],
    [129.1328, 35.1592]
  ];

  // Haeundae Major Roads (Points: [lat, lon])
  const HAEUNDAE_ROADS = [
    // Haeundae Beach Road (마린시티 - 동백섬 - 해수욕장 - 미포)
    {
      name: '해운대해변로',
      type: 'trunk',
      points: [
        [35.1538, 129.1380],
        [35.1526, 129.1438],
        [35.1518, 129.1482],
        [35.1544, 129.1522],
        [35.1568, 129.1554],
        [35.1588, 129.1596],
        [35.1595, 129.1642],
        [35.1599, 129.1686],
        [35.1590, 129.1712]
      ]
    },
    // Dalmaji-gil scenic road (미포 - 달맞이언덕 - 청사포)
    {
      name: '달맞이길',
      type: 'primary',
      points: [
        [35.1590, 129.1712],
        [35.1605, 129.1732],
        [35.1614, 129.1766],
        [35.1610, 129.1810],
        [35.1630, 129.1852],
        [35.1650, 129.1884],
        [35.1680, 129.1922]
      ]
    },
    // Gunam-ro culture street (해운대역 - 해운대광장)
    {
      name: '구남로',
      type: 'primary',
      points: [
        [35.1635, 129.1585],
        [35.1615, 129.1595],
        [35.1589, 129.1604]
      ]
    },
    // Dongbaek Island circular walking path
    {
      name: '동백순환로',
      type: 'secondary',
      points: [
        [35.1542, 129.1522],
        [35.1515, 129.1510],
        [35.1498, 129.1526],
        [35.1515, 129.1546],
        [35.1542, 129.1542]
      ]
    },
    // Haeundae-daero / Subway Line 2 axis (센텀 - 벡스코 - 해운대역 - 좌동 신시가지)
    {
      name: '해운대로',
      type: 'motorway',
      points: [
        [35.1650, 129.1332],
        [35.1660, 129.1390],
        [35.1655, 129.1480],
        [35.1645, 129.1550],
        [35.1635, 129.1585],
        [35.1650, 129.1660],
        [35.1672, 129.1752],
        [35.1712, 129.1852]
      ]
    },
    // Centum Suyeonggangbyun-daero
    {
      name: '수영강변대로',
      type: 'trunk',
      points: [
        [35.1548, 129.1356],
        [35.1610, 129.1338],
        [35.1682, 129.1326],
        [35.1748, 129.1322]
      ]
    },
    // Haeundae Blueline Park coastal railway (미포 - 청사포 - 송정)
    {
      name: '블루라인파크 철길',
      type: 'primary',
      points: [
        [35.1594, 129.1676],
        [35.1587, 129.1730],
        [35.1591, 129.1782],
        [35.1610, 129.1842],
        [35.1631, 129.1916]
      ]
    }
  ];

  // Busan Haeundae Presets (preserve existing IDs & order)
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

  // Procedural Asset Generator for Haeundae:
  // 512x512 ridged geological DEM + 2048x2048 PBR satellite, hypsometric relief, tangent normal, and roughness maps
  function createHaeundaeAssets() {
    const W = 2048;
    const H = 2048;
    const HW = 512;
    const HH = 512;

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
        a *= 0.5;
        f *= 2.03;
      }
      return v;
    }

    // Multifractal ridged noise for sharp granite ridge crests & eroded spurs
    function ridgedFbm(x, y, oct) {
      let sum = 0, amp = 0.5, freq = 1, weight = 1;
      for (let i = 0; i < (oct || 4); i++) {
        let n = 1.0 - Math.abs(smoothNoise(x * freq, y * freq) * 2.0 - 1.0);
        n = n * n * weight;
        weight = Math.min(1.0, Math.max(0.24, n * 1.65));
        sum += n * amp;
        amp *= 0.5;
        freq *= 2.12;
      }
      return sum;
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

    // Realistic ridged geological elevation model (meters)
    function calculateElevation(lat, lng) {
      const nX = (lng - BOUNDS.west) * 95;
      const nY = (lat - BOUNDS.south) * 95;
      const warpX = (fbm(nX * 0.35, nY * 0.35, 2) - 0.5) * 1.4;
      const warpY = (fbm(nX * 0.35 + 9.2, nY * 0.35 + 4.8, 2) - 0.5) * 1.4;
      const ridgeDetail = ridgedFbm(nX * 0.42 + warpX, nY * 0.42 + warpY, 4);
      const fineRock = ridgedFbm(nX * 1.15 + 2.1, nY * 1.15 + 5.7, 3);
      const valleyFbm = fbm(nX * 0.65, nY * 0.65, 3);

      let h = 4.2 + valleyFbm * 3.8;

      // 1. Jangsan Massif (634m peak + continuous granite ridge network)
      let jangsanH = 0;

      // Jangsan main summit (634m)
      const dSummit = distKm(lat, lng, 35.1802, 129.1415);
      if (dSummit < 1.85) {
        const f = Math.max(0, 1 - dSummit / 1.85);
        jangsanH = Math.max(jangsanH, 634 * Math.pow(f, 1.55) * (0.76 + ridgeDetail * 0.32));
      }

      // East ridge spine to Jungbong (403m) and northern Jwa-dong hills
      const dRidgeE = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1728, 129.1538);
      if (dRidgeE < 0.92) {
        const across = Math.max(0, 1 - dRidgeE / 0.92);
        const crestMod = 0.72 + ridgeDetail * 0.36;
        jangsanH = Math.max(jangsanH, 412 * Math.pow(across, 1.85) * crestMod);
      }
      const dJungbong = distKm(lat, lng, 35.1725, 129.1530);
      if (dJungbong < 1.45) {
        const f = Math.max(0, 1 - dJungbong / 1.45);
        jangsanH = Math.max(jangsanH, 398 * Math.pow(f, 1.65) * (0.76 + ridgeDetail * 0.30));
      }

      // South spur to Ongnyebong (383m) overlooking BEXCO / Haeundae Station
      const dRidgeS = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1665, 129.1445);
      if (dRidgeS < 0.85) {
        const across = Math.max(0, 1 - dRidgeS / 0.85);
        jangsanH = Math.max(jangsanH, 385 * Math.pow(across, 1.85) * (0.74 + ridgeDetail * 0.34));
      }

      // West spur to Gukgibong (450m) & Banyeo-dong ridge
      const dRidgeW = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1775, 129.1335);
      if (dRidgeW < 0.88) {
        const across = Math.max(0, 1 - dRidgeW / 0.88);
        jangsanH = Math.max(jangsanH, 452 * Math.pow(across, 1.75) * (0.74 + ridgeDetail * 0.34));
      }

      // Northeast mountain backbone towards Guboksan / Songjeong
      const dRidgeNE = distToSegmentKm(lat, lng, 35.1802, 129.1415, 35.1858, 129.1765);
      if (dRidgeNE < 1.05) {
        const across = Math.max(0, 1 - dRidgeNE / 1.05);
        const along = Math.max(0, 1 - distKm(lat, lng, 35.1802, 129.1415) / 4.2);
        jangsanH = Math.max(jangsanH, (195 + along * 240) * Math.pow(across, 1.80) * (0.72 + ridgeDetail * 0.36));
      }

      // East rim spur above Jwa-dong New Town toward Songjeong pass (Wausan / Singoksan flank)
      const dEastRim = distToSegmentKm(lat, lng, 35.1858, 129.1765, 35.1745, 129.1930);
      if (dEastRim < 0.95) {
        const across = Math.max(0, 1 - dEastRim / 0.95);
        jangsanH = Math.max(jangsanH, 235 * Math.pow(across, 1.85) * (0.72 + fineRock * 0.34));
      }

      h = Math.max(h, jangsanH + 4.5);

      // Deeply incised radial stream valleys:
      // 1) Daecheon / Jangsan waterfall gorge descending SSE toward Daecheon Lake
      const dGorge = distToSegmentKm(lat, lng, 35.1790, 129.1445, 35.1705, 129.1635);
      if (dGorge < 0.56 && h > 22) {
        const cut = Math.pow(1 - dGorge / 0.56, 1.35) * Math.min(185, h * 0.52);
        h -= cut;
      }
      // 2) Secondary WSW valley draining toward Centum / Jaesong
      const dWestValley = distToSegmentKm(lat, lng, 35.1765, 129.1395, 35.1690, 129.1345);
      if (dWestValley < 0.44 && h > 18) {
        const cut = Math.pow(1 - dWestValley / 0.44, 1.4) * Math.min(130, h * 0.45);
        h -= cut;
      }

      // High-altitude granite crags & slope micro-relief
      if (h > 35) {
        h += (fineRock - 0.35) * Math.min(46, h * 0.14);
      }

      // 2. Dalmaji Hill / Wausan coastal ridge (165m) curving along Mipo -> Cheongsapo
      const dDalmajiSpine = distToSegmentKm(lat, lng, 35.1620, 129.1715, 35.1645, 129.1885);
      if (dDalmajiSpine < 0.85) {
        const f = Math.max(0, 1 - dDalmajiSpine / 0.85);
        const dalH = 158 * Math.pow(f, 1.85) * (0.76 + ridgeDetail * 0.30);
        h = Math.max(h, dalH);
      }
      const dDalmajiPeak = distKm(lat, lng, 35.1625, 129.1785);
      if (dDalmajiPeak < 0.85) {
        const f = Math.max(0, 1 - dDalmajiPeak / 0.85);
        h = Math.max(h, 166 * Math.pow(f, 1.75) * (0.82 + fineRock * 0.24));
      }

      // 3. Dongbaekseom rocky headland pine hill (46m)
      const dDongbaek = distKm(lat, lng, 35.1528, 129.1525);
      if (dDongbaek < 0.42) {
        const f = Math.max(0, 1 - dDongbaek / 0.42);
        h = Math.max(h, 46 * Math.pow(f, 1.65) * (0.86 + fineRock * 0.20));
      }

      // 4. Smoothly Graded Urban Coastal Terraces & River Estuary Basins (zero sheer step artifacts!)
      function smoothFlatten(curH, dist, innerR, outerR, targetH) {
        if (dist >= outerR || curH <= targetH) return curH;
        if (dist <= innerR) return targetH;
        const t = (dist - innerR) / Math.max(1e-5, outerR - innerR);
        const s = t * t * (3 - 2 * t);
        return targetH + (curH - targetH) * s;
      }

      // Haeundae golden beach & promenade
      const dBeach = distKm(lat, lng, 35.1587, 129.1604);
      h = smoothFlatten(h, dBeach, 0.24, 0.56, 3.2 + Math.min(2.0, dBeach * 3.0));

      // LCT waterfront pad (smooth transition into Mipo / Dalmaji hillside behind)
      const dLctPad = distKm(lat, lng, 35.1600, 129.1688);
      h = smoothFlatten(h, dLctPad, 0.16, 0.46, 5.4);

      // Marine City & Yachting Center reclaimed basin (smooth transition to Ongnyebong foothills)
      const dMarine = distKm(lat, lng, 35.1536, 129.1456);
      h = smoothFlatten(h, dMarine, 0.42, 0.88, 5.0);
      const dYacht = distKm(lat, lng, 35.1566, 129.1415);
      h = smoothFlatten(h, dYacht, 0.20, 0.50, 3.5);

      // Centum City flat river terrace
      const dCentum = distKm(lat, lng, 35.1665, 129.1342);
      h = smoothFlatten(h, dCentum, 0.50, 1.05, 7.2);

      // Suyeong River channel smooth depression on west edge
      if (lat < 35.1755) {
        const dRiv = Math.max(0, (lng - 129.1338) * 91.5);
        h = smoothFlatten(h, dRiv, 0.04, 0.28, 1.8);
      }

      // Smooth inland-only cosine border taper (North, North-West, North-East borders only)
      // Preserves crisp South Sea coastal cliffs, Dongbaekseom, Dalmaji headland & beach shoreline!
      const dNorthKm = (BOUNDS.north - lat) * 111.19;
      const dWestInlandKm = lat > 35.170 ? (lng - BOUNDS.west) * 91.5 : 99;
      const dEastInlandKm = lat > 35.167 ? (BOUNDS.east - lng) * 91.5 : 99;
      const inlandEdgeKm = Math.min(dNorthKm, dWestInlandKm, dEastInlandKm);
      if (inlandEdgeKm < 0.52) {
        const t = Math.max(0, Math.min(1, inlandEdgeKm / 0.52));
        const fade = 0.5 - 0.5 * Math.cos(Math.PI * t);
        h *= fade;
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

    // Compute coastal Chamfer distance inside 2048x2048 land mask
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

    // Bilinear elevation sampler
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

    // Precompute urban street rotation sin/cos for Busan districts
    const ANG_MC = 0.32; // Marine City & Centum oblique axis
    const COS_MC = Math.cos(ANG_MC), SIN_MC = Math.sin(ANG_MC);
    const ANG_JW = -0.22; // Jwa-dong New Town avenue axis
    const COS_JW = Math.cos(ANG_JW), SIN_JW = Math.sin(ANG_JW);

    // 2. Generate 2048x2048 PBR Natural, Elevation, Tangent-Normal & Roughness Maps
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
          rgData[idx] = 56;
          rgData[idx + 1] = 56;
          rgData[idx + 2] = 56;
          rgData[idx + 3] = 255;
          continue;
        }

        const elev = sampleElevation(px, py);
        const cDist = coastDist[pIdx];

        const xPrev = sampleElevation(px - 3, py);
        const xNext = sampleElevation(px + 3, py);
        const yPrev = sampleElevation(px, py - 3);
        const yNext = sampleElevation(px, py + 3);

        // Smooth rock/canopy micro-relief gradient rather than noisy per-pixel grain
        const microR0 = smoothNoise(px * 0.24, py * 0.24);
        const microRx = smoothNoise((px + 1.5) * 0.24, py * 0.24) - microR0;
        const microRy = smoothNoise(px * 0.24, (py + 1.5) * 0.24) - microR0;

        const dzdx = (xNext - xPrev) * 0.068 + microRx * 0.14;
        const dzdy = (yNext - yPrev) * 0.068 + microRy * 0.14;

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
        const slope = Math.hypot((xNext - xPrev) * 0.068, (yNext - yPrev) * 0.068);
        const shade = Math.min(1.38, Math.max(0.36, 0.52 + 0.64 * dot));

        const microNoise = fbm(px * 0.065, py * 0.065, 3);
        const medNoise = fbm(px * 0.019, py * 0.019, 2);
        const macroNoise = fbm(px * 0.006, py * 0.006, 2);
        const grain = pseudoNoise(px, py);

        const dBeach = distKm(lat, lng, 35.1587, 129.1604);
        const dDongbaek = distKm(lat, lng, 35.1531, 129.1523);
        const dDalmaji = distKm(lat, lng, 35.1618, 129.1790);
        const dCheongsapo = distKm(lat, lng, 35.1626, 129.1915);
        const dMarineCity = distKm(lat, lng, 35.1534, 129.1460);
        const dYachtBasin = distKm(lat, lng, 35.1566, 129.1415);
        const dCentum = distKm(lat, lng, 35.1672, 129.1342);
        const dLCT = distKm(lat, lng, 35.1602, 129.1688);
        const dJwaDong = distKm(lat, lng, 35.1702, 129.1705);
        const dHaeundaeCore = distKm(lat, lng, 35.1626, 129.1592);
        const dJangsan = distKm(lat, lng, 35.1802, 129.1415);
        const dDaecheonLake = distKm(lat, lng, 35.1715, 129.1620);
        const dGunamro = distToSegmentKm(lat, lng, 35.1636, 129.1585, 35.1588, 129.1604);

        const isSuyeongRiver = (lng < 129.1356 && lat < 35.1735 && lat > 35.1518 && elev < 8.5);
        const streamLngOff = Math.sin((lat - 35.159) * 320) * 0.0007;
        const isChuncheonStream = distToSegmentKm(lat, lng - streamLngOff, 35.1712, 129.1620, 35.1591, 129.1656) < 0.026 && elev < 28;

        let r, g, b;
        let roughVal = 214;

        // 1. Suyeong River & Yacht Marina Water
        if (isSuyeongRiver && lng < 129.1344) {
          const wave = Math.sin(py * 0.14 + px * 0.06) * 5 + grain * 4;
          r = Math.floor(24 + wave);
          g = Math.floor(66 + wave * 1.1);
          b = Math.floor(98 + wave);
          roughVal = 52;
        }
        // 2. Daecheon Lake & Chuncheon Stream Basin (west of LCT complex)
        else if ((dDaecheonLake < 0.20 && elev < 36) || isChuncheonStream) {
          r = Math.floor(28 + microNoise * 10);
          g = Math.floor(78 + microNoise * 14);
          b = Math.floor(110 + microNoise * 14);
          roughVal = 56;
        }
        // 3. Haeundae Beach Golden Crescent Sand & Surf Swash
        else if (dBeach < 0.45 && elev < 14 && lat < 35.1608) {
          if (cDist <= 5) {
            const foamWave = fbm(px * 0.14, py * 0.14, 2);
            const foamMix = Math.max(0, 1 - cDist / 5.5) * (0.58 + foamWave * 0.42);
            r = Math.floor(214 + foamMix * 36);
            g = Math.floor(228 + foamMix * 24);
            b = Math.floor(222 + foamMix * 28);
            roughVal = 74;
          } else if (cDist <= 15) {
            r = Math.floor(206 + microNoise * 12 + grain * 5);
            g = Math.floor(188 + microNoise * 10 + grain * 5);
            b = Math.floor(150 + microNoise * 8);
            roughVal = 110;
          } else if (dBeach < 0.34) {
            // Warm cream-gold Haeundae silica sand
            r = Math.floor(242 + microNoise * 10 + grain * 6);
            g = Math.floor(224 + microNoise * 10 + grain * 6);
            b = Math.floor(182 + microNoise * 8);
            roughVal = 198;
          } else {
            // Haeundae coastal pine windbreak promenade
            r = Math.floor(34 + microNoise * 16 + grain * 5);
            g = Math.floor(78 + microNoise * 20 + grain * 6);
            b = Math.floor(40 + microNoise * 10);
            roughVal = 228;
          }
        }
        // 4. Dongbaekseom Island Peninsula (Camellia/Pine Headland + Sea Cliffs)
        else if (dDongbaek < 0.48) {
          if (elev < 11 || cDist <= 10) {
            // Weathered coastal granite reefs & promenade edge
            r = Math.floor(78 + microNoise * 22 + grain * 8);
            g = Math.floor(80 + microNoise * 20 + grain * 8);
            b = Math.floor(74 + microNoise * 16);
            roughVal = cDist <= 4 ? 95 : 206;
          } else if (distKm(lat, lng, 35.1525, 129.1518) < 0.08) {
            // Nurimaru APEC plaza terrace
            r = Math.floor(214 + microNoise * 14);
            g = Math.floor(210 + microNoise * 14);
            b = Math.floor(198 + microNoise * 12);
            roughVal = 132;
          } else {
            // Dense evergreen camellia & black pine canopy
            r = Math.floor(28 + microNoise * 14 + grain * 6);
            g = Math.floor(76 + microNoise * 18 + grain * 6);
            b = Math.floor(38 + microNoise * 12);
            roughVal = 230;
          }
        }
        // 5. Cheongsapo & Mipo Harbors + Concrete Breakwaters
        else if ((dCheongsapo < 0.36 && elev < 18) || (distKm(lat, lng, 35.1585, 129.1722) < 0.24 && elev < 15)) {
          r = Math.floor(132 + microNoise * 20 + grain * 6);
          g = Math.floor(136 + microNoise * 20 + grain * 6);
          b = Math.floor(142 + microNoise * 18);
          roughVal = 182;
        }
        // 6. Dalmaji Hill Coastal Ridge, Cliffs & Moontan Woods
        else if (dDalmaji < 0.92 && elev > 16) {
          if (slope > 0.36 || cDist <= 12) {
            r = Math.floor(102 + microNoise * 24 + grain * 8);
            g = Math.floor(102 + microNoise * 22 + grain * 8);
            b = Math.floor(94 + microNoise * 18);
            roughVal = 208;
          } else {
            // Autumn-kissed cherry/pine woodland
            const autumnPatch = medNoise > 0.56 ? 22 : 0;
            r = Math.floor(46 + autumnPatch + microNoise * 18 + grain * 5);
            g = Math.floor(88 + autumnPatch * 0.4 + microNoise * 22 + grain * 5);
            b = Math.floor(48 + microNoise * 12);
            roughVal = 228;
          }
        }
        // 7. Gunam-ro Culture Plaza Promenade
        else if (dGunamro < 0.045 && elev < 20) {
          r = Math.floor(204 + microNoise * 12 + grain * 6);
          g = Math.floor(198 + microNoise * 12 + grain * 6);
          b = Math.floor(190 + microNoise * 10);
          roughVal = 172;
        }
        // 8. Jangsan Mountain Massif (Gradual Granite Ridge Crags, Alpine Silver Grass & Deep Pine/Oak Canopy)
        else if (elev > 95) {
          const ratio = (elev - 95) / 539;
          const autumnMix = Math.max(0, (medNoise - 0.50) * 1.65) * (1 - ratio * 0.45);
          // Rich multi-biome pine + autumn oak forest base
          const fR = 34 + ratio * 14 + autumnMix * 52 + microNoise * 15;
          const fG = 76 + ratio * 10 + autumnMix * 24 + microNoise * 18;
          const fB = 36 + ratio * 10 - autumnMix * 6 + microNoise * 10;

          // Smooth granite exposure factor from slope + elevation (no harsh threshold blotches!)
          const rockWeightRaw = Math.max(0, (slope - 0.24) * 1.35 + Math.max(0, ratio - 0.62) * 0.95) * (0.55 + microNoise * 0.65);
          const rockMix = Math.min(0.88, Math.max(0, rockWeightRaw));
          const meadowMix = (ratio > 0.48 && macroNoise > 0.45)
            ? Math.min(0.82, (ratio - 0.48) * 1.9 * (macroNoise - 0.40) * 2.5) * (1 - rockMix * 0.6)
            : 0;

          const windStripe = Math.sin(px * 0.18 + py * 0.09) * 6;
          const rockR = 132 + microNoise * 22;
          const rockG = 129 + microNoise * 20;
          const rockB = 122 + microNoise * 18;

          const medR = 166 + windStripe + microNoise * 14;
          const medG = 152 + windStripe * 0.8 + microNoise * 14;
          const medB = 110 + microNoise * 10;

          r = Math.floor(fR * (1 - rockMix - meadowMix) + rockR * rockMix + medR * meadowMix + grain * 5);
          g = Math.floor(fG * (1 - rockMix - meadowMix) + rockG * rockMix + medG * meadowMix + grain * 5);
          b = Math.floor(fB * (1 - rockMix - meadowMix) + rockB * rockMix + medB * meadowMix + grain * 4);
          roughVal = Math.round(230 - rockMix * 22);
        }
        // 9. Marine City, Centum City, LCT & Haeundae Downtown (Fine-Grain Rotated Aerial Urban Fabric)
        else if (dMarineCity < 0.66 || dYachtBasin < 0.42 || dCentum < 0.88 || dLCT < 0.36 || (dHaeundaeCore < 0.70 && elev < 32)) {
          const ux = px * COS_MC - py * SIN_MC;
          const uy = px * SIN_MC + py * COS_MC;
          const blockScale = 0.23;
          const bx = Math.floor(ux * blockScale);
          const by = Math.floor(uy * blockScale);
          const blockHash = pseudoNoise(bx, by);
          const subX = (ux * blockScale) - bx;
          const subY = (uy * blockScale) - by;
          const isStreet = (subX < 0.16 || subY < 0.16);

          if (isStreet) {
            r = Math.floor(92 + microNoise * 8 + grain * 4);
            g = Math.floor(96 + microNoise * 8 + grain * 4);
            b = Math.floor(102 + microNoise * 8);
            roughVal = 152;
          } else if (blockHash < 0.14) {
            // Tree-lined urban pocket parks
            r = Math.floor(62 + microNoise * 14 + grain * 4);
            g = Math.floor(106 + microNoise * 16 + grain * 5);
            b = Math.floor(64 + microNoise * 10);
            roughVal = 220;
          } else if (blockHash < 0.56) {
            // Contemporary blue-slate high-rise roof plazas
            r = Math.floor(142 + microNoise * 16 + grain * 4);
            g = Math.floor(156 + microNoise * 16 + grain * 4);
            b = Math.floor(174 + microNoise * 16);
            roughVal = 118;
          } else {
            // Warm architectural concrete & commercial rooftops
            r = Math.floor(164 + microNoise * 14 + grain * 4);
            g = Math.floor(166 + microNoise * 14 + grain * 4);
            b = Math.floor(170 + microNoise * 12);
            roughVal = 172;
          }
        }
        // 10. Jwa-dong Haeundae New Town (Subtle High-Res Residential Complex Blocks + Green Belts)
        else if (dJwaDong + (macroNoise - 0.5) * 0.40 < 1.08 && elev < 62) {
          const ux = px * COS_JW - py * SIN_JW;
          const uy = px * SIN_JW + py * COS_JW;
          const superScale = 0.16;
          const sx = Math.floor(ux * superScale);
          const sy = Math.floor(uy * superScale);
          const sHash = pseudoNoise(sx, sy);
          const lxSub = (ux * superScale) - sx;
          const lySub = (uy * superScale) - sy;
          const isAvenue = (lxSub < 0.14 || lySub < 0.14);
          const bRow = Math.floor(lySub * 3);
          const bCol = Math.floor(lxSub * 2);
          const inTower = (lySub * 3 - bRow < 0.62 && lxSub * 2 - bCol < 0.70);

          if (isAvenue) {
            r = Math.floor(96 + microNoise * 8 + grain * 4);
            g = Math.floor(100 + microNoise * 8 + grain * 4);
            b = Math.floor(106 + microNoise * 8);
            roughVal = 156;
          } else if (sHash < 0.18) {
            r = Math.floor(56 + microNoise * 14 + grain * 4);
            g = Math.floor(98 + microNoise * 16 + grain * 4);
            b = Math.floor(54 + microNoise * 10);
            roughVal = 224;
          } else if (inTower) {
            r = Math.floor(154 + (sHash - 0.5) * 20 + microNoise * 10);
            g = Math.floor(160 + (sHash - 0.5) * 18 + microNoise * 10);
            b = Math.floor(168 + (sHash - 0.5) * 16 + microNoise * 10);
            roughVal = 166;
          } else {
            r = Math.floor(84 + microNoise * 14 + grain * 4);
            g = Math.floor(110 + microNoise * 14 + grain * 4);
            b = Math.floor(78 + microNoise * 10);
            roughVal = 212;
          }
        }
        // 11. Foothills, Pine Woodlands & Valley Green Belts
        else {
          const canopyCluster = medNoise * 0.55 + microNoise * 0.45;
          const autumnAcc = medNoise > 0.62 ? 16 : 0;
          r = Math.floor(38 + autumnAcc + canopyCluster * 32 + grain * 6);
          g = Math.floor(78 + autumnAcc * 0.4 + canopyCluster * 40 + grain * 7);
          b = Math.floor(38 + canopyCluster * 22 + grain * 4);
          roughVal = 230;
        }

        // Crisp seawall boulders / breaking coastal surf along headlands outside sandy beach
        if (cDist <= 5 && !(dBeach < 0.45 && elev < 14 && lat < 35.1608)) {
          const foam = fbm(px * 0.14, py * 0.14, 2);
          if (cDist <= 2 && foam > 0.40) {
            r = Math.floor(r * 0.35 + 236 * 0.65);
            g = Math.floor(g * 0.35 + 246 * 0.65);
            b = Math.floor(b * 0.35 + 250 * 0.65);
            roughVal = 86;
          } else if (cDist <= 4 && elev < 24) {
            r = Math.floor(r * 0.72 + 96 * 0.28);
            g = Math.floor(g * 0.72 + 100 * 0.28);
            b = Math.floor(b * 0.72 + 98 * 0.28);
            roughVal = Math.min(roughVal, 178);
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

        // --- ELEVATION RELIEF COLOR (Cartographic Hypsometric Palette + 50m/10m Contours) ---
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
