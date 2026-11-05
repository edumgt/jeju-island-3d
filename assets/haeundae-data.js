// Busan Haeundae 3D Asset Data & Generator
// Real geographical contour: Dongbaekseom, Haeundae Beach, Mipo, Dalmaji Hill, Cheongsapo, and Jangsan Mountain
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
        [35.1590, 35.1710],
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

  // Procedural Asset Generator for Haeundae: height data and textures
  function createHaeundaeAssets() {
    const W = 512;
    const H = 512;

    // Helper: test if point is inside Haeundae polygon
    function isInside(lat, lng) {
      let inside = false;
      for (let i = 0, j = HAEUNDAE_OUTLINE.length - 1; i < HAEUNDAE_OUTLINE.length; j = i++) {
        const [xi, yi] = HAEUNDAE_OUTLINE[i];
        const [xj, yj] = HAEUNDAE_OUTLINE[j];
        if ((yi > lat) !== (yj > lat) && lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }

    // Heightmap calculation at (lat, lng)
    // Jangsan (634m) at 35.1802, 129.1415
    // Dalmaji Hill (120m) at 35.1611, 129.1785
    // Dongbaekseom (45m) at 35.1531, 129.1523
    function calculateElevation(lat, lng) {
      if (!isInside(lat, lng)) return 0;

      // Distance to Jangsan peak
      const dJangsan = Math.hypot((lat - 35.1802) * 111, (lng - 129.1415) * 88);
      // Distance to Dalmaji hill
      const dDalmaji = Math.hypot((lat - 35.1611) * 111, (lng - 129.1785) * 88);
      // Distance to Dongbaekseom
      const dDongbaek = Math.hypot((lat - 35.1531) * 111, (lng - 129.1523) * 88);

      let h = 5; // Base coastal plain height (meters)
      // Jangsan mountain profile (634m peak with ridges)
      if (dJangsan < 4.2) {
        const factor = Math.cos(Math.min(Math.PI / 2, (dJangsan / 4.2) * (Math.PI / 2)));
        h += 629 * Math.pow(factor, 1.4);
      }
      // Dalmaji hill (120m)
      if (dDalmaji < 1.6) {
        const factor = Math.cos(Math.min(Math.PI / 2, (dDalmaji / 1.6) * (Math.PI / 2)));
        h += 115 * Math.pow(factor, 1.3);
      }
      // Dongbaekseom hill (45m)
      if (dDongbaek < 0.6) {
        const factor = Math.cos(Math.min(Math.PI / 2, (dDongbaek / 0.6) * (Math.PI / 2)));
        h += 40 * Math.pow(factor, 1.5);
      }

      // Beach proximity attenuation
      const dBeach = Math.hypot((lat - 35.1587) * 111, (lng - 129.1604) * 88);
      if (dBeach < 0.35) {
        h = Math.min(h, 4);
      }

      return Math.max(0, Math.min(650, h));
    }

    // 1. Generate Height Canvas & ImageData (256x256)
    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = 256;
    heightCanvas.height = 256;
    const hCtx = heightCanvas.getContext('2d');
    const hImg = hCtx.createImageData(256, 256);
    const hData = hImg.data;

    for (let py = 0; py < 256; py++) {
      const lat = BOUNDS.north - (py / 255) * (BOUNDS.north - BOUNDS.south);
      for (let px = 0; px < 256; px++) {
        const lng = BOUNDS.west + (px / 255) * (BOUNDS.east - BOUNDS.west);
        const elev = calculateElevation(lat, lng);
        const val = Math.min(255, Math.floor((elev / 650) * 255));
        const idx = (py * 256 + px) * 4;
        hData[idx] = val;
        hData[idx + 1] = val;
        hData[idx + 2] = val;
        hData[idx + 3] = isInside(lat, lng) ? 255 : 0;
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // 2. Generate Natural Texture (1024x1024)
    const naturalCanvas = document.createElement('canvas');
    naturalCanvas.width = W;
    naturalCanvas.height = H;
    const nCtx = naturalCanvas.getContext('2d');

    // Base transparent
    nCtx.clearRect(0, 0, W, H);

    for (let py = 0; py < H; py++) {
      const lat = BOUNDS.north - (py / (H - 1)) * (BOUNDS.north - BOUNDS.south);
      for (let px = 0; px < W; px++) {
        const lng = BOUNDS.west + (px / (W - 1)) * (BOUNDS.east - BOUNDS.west);
        if (!isInside(lat, lng)) continue;

        const elev = calculateElevation(lat, lng);
        const dBeach = Math.hypot((lat - 35.1587) * 111, (lng - 129.1604) * 88);
        const dDongbaek = Math.hypot((lat - 35.1531) * 111, (lng - 129.1523) * 88);
        const dDalmaji = Math.hypot((lat - 35.1611) * 111, (lng - 129.1785) * 88);

        // Color determination
        let r, g, b;
        if (dBeach < 0.28 && elev < 10) {
          // Golden Haeundae Beach Sand
          r = 232 + Math.floor(Math.sin(px * 0.1) * 6);
          g = 212 + Math.floor(Math.cos(py * 0.1) * 6);
          b = 168;
        } else if (dDongbaek < 0.45) {
          // Dongbaekseom evergreen camellia grove
          r = 44 + Math.floor(elev * 0.2);
          g = 108 + Math.floor(elev * 0.3);
          b = 64;
        } else if (elev > 250) {
          // Jangsan High Mountain Rocky Ridge
          const ratio = (elev - 250) / 400;
          r = Math.floor(95 + ratio * 45);
          g = Math.floor(135 - ratio * 15);
          b = Math.floor(85 + ratio * 20);
        } else if (elev > 70) {
          // Foothills & Dalmaji Hill green foliage
          r = 85 + Math.floor(Math.sin(px * 0.05 + py * 0.05) * 10);
          g = 145 + Math.floor(Math.cos(px * 0.04) * 12);
          b = 90;
        } else {
          // Urban Downtown Haeundae & Centum City
          r = 195 + Math.floor(Math.sin(px * 0.2) * 8);
          g = 205 + Math.floor(Math.cos(py * 0.2) * 8);
          b = 200;
        }

        nCtx.fillStyle = `rgb(${r},${g},${b})`;
        nCtx.fillRect(px, py, 1, 1);
      }
    }

    // 3. Generate Elevation Texture (1024x1024)
    const elevationCanvas = document.createElement('canvas');
    elevationCanvas.width = W;
    elevationCanvas.height = H;
    const eCtx = elevationCanvas.getContext('2d');
    eCtx.clearRect(0, 0, W, H);

    for (let py = 0; py < H; py++) {
      const lat = BOUNDS.north - (py / (H - 1)) * (BOUNDS.north - BOUNDS.south);
      for (let px = 0; px < W; px++) {
        const lng = BOUNDS.west + (px / (W - 1)) * (BOUNDS.east - BOUNDS.west);
        if (!isInside(lat, lng)) continue;

        const elev = calculateElevation(lat, lng);
        const ratio = Math.min(1, elev / 634);

        let r, g, b;
        if (ratio < 0.15) {
          // Coastal plain (teal to green)
          const sub = ratio / 0.15;
          r = Math.floor(70 + sub * 40);
          g = Math.floor(180 - sub * 20);
          b = Math.floor(140 - sub * 40);
        } else if (ratio < 0.45) {
          // Mid slopes (yellow-green to amber)
          const sub = (ratio - 0.15) / 0.3;
          r = Math.floor(110 + sub * 100);
          g = Math.floor(160 + sub * 20);
          b = Math.floor(100 - sub * 40);
        } else if (ratio < 0.75) {
          // Upper ridges (amber to terracotta)
          const sub = (ratio - 0.45) / 0.3;
          r = Math.floor(210 + sub * 20);
          g = Math.floor(180 - sub * 70);
          b = Math.floor(60 + sub * 20);
        } else {
          // Summit (slate-purple)
          const sub = (ratio - 0.75) / 0.25;
          r = Math.floor(230 - sub * 70);
          g = Math.floor(110 - sub * 30);
          b = Math.floor(80 + sub * 70);
        }

        eCtx.fillStyle = `rgb(${r},${g},${b})`;
        eCtx.fillRect(px, py, 1, 1);
      }
    }

    return {
      heightCanvas,
      naturalCanvas,
      elevationCanvas
    };
  }

  // Expose to window
  window.HAEUNDAE_BOUNDS = BOUNDS;
  window.HAEUNDAE_OUTLINE = HAEUNDAE_OUTLINE;
  window.HAEUNDAE_ROADS = HAEUNDAE_ROADS;
  window.HAEUNDAE_PRESETS = HAEUNDAE_PRESETS;
  window.createHaeundaeAssets = createHaeundaeAssets;
})();
