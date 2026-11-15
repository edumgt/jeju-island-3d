// Gangneung Gyeongpodae, East Sea Coast & Distant Seoraksan 3D Asset Data & Generator
// Real geographical contour spanning Gangneung Gyeongpo Lake/Beach, Anmok, Jumunjin,
// Yangyang Coast, Odaesan/Daegwallyeong, and distant Seoraksan Daecheongbong (1,708m) & Ulsanbawi.
(() => {
  'use strict';

  const BOUNDS = {
    west: 128.360,
    south: 37.620,
    east: 129.060,
    north: 38.225
  };

  // Gangneung-Yangyang-Seorak coastline and Taebaek Baekdudaegan inland perimeter (lng, lat)
  const GANGNEUNG_OUTLINE = [
    // South-East Gangneung coast (Jeongdongjin / Anin -> Anmok -> Gyeongpo -> Sokcho)
    [128.9950, 37.6300],
    [128.9900, 37.6720],
    [128.9720, 37.7150],
    [128.9600, 37.7480],
    [128.9505, 37.7720], // Anmok Harbor & Coffee Street
    [128.9325, 37.7865], // Songjeong Beach
    [128.9185, 37.7965], // Gangmun Port
    [128.9095, 37.8085], // Gyeongpo Beach sandbar arc
    [128.8935, 37.8265], // Sageunjin Beach
    [128.8725, 37.8485], // Sacheon Harbor
    [128.8545, 37.8715], // Yeongjin Beach
    [128.8325, 37.8950], // Jumunjin Harbor & Breakwater
    [128.8180, 37.9245], // Namae Harbor
    [128.7820, 37.9620], // Jukdo / Ingu
    [128.7365, 38.0185], // Hajodae Cape
    [128.6980, 38.0550], // Naksan South Beach
    [128.6560, 38.0950], // Oesanpo / Dongho
    [128.6345, 38.1245], // Naksansa Uisangdae Cliff
    [128.6180, 38.1520], // Mulchi Port
    [128.6020, 38.1880], // Sokcho Oeongchi / Seorak Beach
    [128.5940, 38.2150], // Sokcho Cheongchoho North Coast
    // Northern border across Seoraksan massif (North of Ulsanbawi)
    [128.5100, 38.2150],
    [128.4300, 38.2150],
    [128.3700, 38.2150],
    // Western Taebaek Range / Baekdudaegan margin
    [128.3700, 38.1100],
    [128.3700, 37.9800],
    [128.3700, 37.8400],
    [128.3700, 37.7200],
    [128.3700, 37.6300],
    // Southern edge through Daegwallyeong back to Gangneung coast
    [128.5400, 37.6300],
    [128.7530, 37.6300],
    [128.8900, 37.6300],
    [128.9950, 37.6300]
  ];

  const GANGNEUNG_ROADS = [
    // National Route 7 (Donghae-daero coastal scenic highway)
    {
      name: '동해대로 (7번 국도)',
      type: 'motorway',
      points: [
        [37.6550, 128.9680],
        [37.7050, 128.9380],
        [37.7520, 128.9120],
        [37.7820, 128.8980],
        [37.8050, 128.8820],
        [37.8480, 128.8620],
        [37.8920, 128.8260],
        [37.9550, 128.7740],
        [38.0150, 128.7250],
        [38.0820, 128.6680],
        [38.1240, 128.6220],
        [38.1850, 128.5920]
      ]
    },
    // Gyeongpo Lake & Beach scenic loop
    {
      name: '경포호수 순환로',
      type: 'primary',
      points: [
        [37.7942, 128.8915],
        [37.7905, 128.9025],
        [37.7955, 128.9135],
        [37.8075, 128.9055],
        [37.8095, 128.8935],
        [37.8015, 128.8885],
        [37.7942, 128.8915]
      ]
    },
    // Changhae-ro (Gyeongpo Beach -> Anmok Coffee Street)
    {
      name: '창해로 해안도로',
      type: 'primary',
      points: [
        [37.8125, 128.9045],
        [37.8025, 128.9115],
        [37.7945, 128.9185],
        [37.7845, 128.9310],
        [37.7722, 128.9475]
      ]
    },
    // Yeongdong Expressway (Daegwallyeong -> Gangneung)
    {
      name: '영동고속도로 (대관령~강릉)',
      type: 'trunk',
      points: [
        [37.6520, 128.7150],
        [37.6880, 128.7530],
        [37.7180, 128.7950],
        [37.7480, 128.8420],
        [37.7720, 128.8750],
        [37.7810, 128.8920]
      ]
    },
    // Hangyeryeong / Seorak mountain approach road
    {
      name: '설악로 (한계령~낙산)',
      type: 'primary',
      points: [
        [38.0920, 128.4350],
        [38.1010, 128.4950],
        [38.1120, 128.5550],
        [38.1220, 128.6150]
      ]
    },
    // Seorak-dong entrance road (Biseondae / Ulsanbawi approach)
    {
      name: '설악산로',
      type: 'secondary',
      points: [
        [38.1760, 128.5940],
        [38.1660, 128.5450],
        [38.1620, 128.4980]
      ]
    }
  ];

  // Top 3 presets spatially separated so 3D labels never overlap in foreground view
  const GANGNEUNG_PRESETS = [
    { id: 'gyeongpodae', name: '경포대 (관동팔경)', category: '역사·전망', icon: '🏯', lat: 37.7935, lng: 128.8885 },
    { id: 'gyeongpo_beach', name: '경포 해수욕장·동해', category: '해변', icon: '🌊', lat: 37.8135, lng: 128.9055 },
    { id: 'seoraksan', name: '설악산 대청봉 (1,708m)', category: '국립공원', icon: '⛰', lat: 38.1194, lng: 128.4655 },
    { id: 'gyeongpo_lake', name: '경포호 석호', category: '호수·생태', icon: '◈', lat: 37.8005, lng: 128.8995 },
    { id: 'ulsanbawi', name: '설악산 울산바위', category: '암봉·명승', icon: '🪨', lat: 38.1620, lng: 128.4720 },
    { id: 'anmok_coffee', name: '안목해변 커피거리', category: '해변·카페', icon: '☕', lat: 37.7722, lng: 128.9475 },
    { id: 'ojukheon', name: '오죽헌', category: '문화유산', icon: '🏛', lat: 37.7791, lng: 128.8760 },
    { id: 'jumunjin', name: '주문진항·방파제', category: '항구·바다', icon: '⚓', lat: 37.8935, lng: 128.8295 },
    { id: 'hajodae', name: '양양 하조대·등대', category: '해안절벽', icon: '🗼', lat: 38.0185, lng: 128.7330 },
    { id: 'naksansa', name: '낙산사 의상대', category: '사찰·바다', icon: '☸', lat: 38.1245, lng: 128.6275 },
    { id: 'odaesan', name: '오대산 비로봉 (1,563m)', category: '산악 지형', icon: '🏔', lat: 37.7900, lng: 128.5450 },
    { id: 'daegwallyeong', name: '대관령 전망대 (832m)', category: '고원·능선', icon: '🌬', lat: 37.6880, lng: 128.7530 }
  ];

  function inGangneungLand(lng, lat) {
    let inside = false;
    for (let i = 0, j = GANGNEUNG_OUTLINE.length - 1; i < GANGNEUNG_OUTLINE.length; j = i++) {
      const [xi, yi] = GANGNEUNG_OUTLINE[i];
      const [xj, yj] = GANGNEUNG_OUTLINE[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  // Generate 512x512 DEM + 2048x2048 satellite, elevation relief, normal, and roughness maps
  function createGangneungAssets() {
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
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);
      const a = pseudoNoise(ix, iy), b = pseudoNoise(ix + 1, iy);
      const c = pseudoNoise(ix, iy + 1), d = pseudoNoise(ix + 1, iy + 1);
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

    function ridgedFbm(x, y, octaves) {
      let sum = 0, amp = 0.5, freq = 1, weight = 1;
      for (let i = 0; i < (octaves || 4); i++) {
        let n = 1.0 - Math.abs(smoothNoise(x * freq, y * freq) * 2.0 - 1.0);
        n = n * n * weight;
        weight = Math.min(1.0, Math.max(0.25, n * 1.65));
        sum += n * amp;
        amp *= 0.5;
        freq *= 2.12;
      }
      return sum;
    }

    function distKm(lat1, lng1, lat2, lng2) {
      return Math.hypot((lat1 - lat2) * 111.1, (lng1 - lng2) * 87.6);
    }

    function distToSegmentKm(lat, lng, lat1, lng1, lat2, lng2) {
      const x = (lng - BOUNDS.west) * 87.6;
      const y = (lat - BOUNDS.south) * 111.1;
      const x1 = (lng1 - BOUNDS.west) * 87.6;
      const y1 = (lat1 - BOUNDS.south) * 111.1;
      const x2 = (lng2 - BOUNDS.west) * 87.6;
      const y2 = (lat2 - BOUNDS.south) * 111.1;
      const dx = x2 - x1, dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return Math.hypot(x - x1, y - y1);
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lenSq));
      return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
    }

    // Gyeongpo Lake lagoon test (generous natural coastal lagoon behind Gyeongpo sandbar)
    function gyeongpoLakeFactor(lat, lng) {
      const dx = (lng - 128.8995) * 87.6;
      const dy = (lat - 37.8005) * 111.1;
      const u = dx * 0.80 - dy * 0.60;
      const v = dx * 0.60 + dy * 0.80;
      return Math.hypot(u / 1.05, v / 0.72);
    }

    // Cheongchoho Lagoon near Sokcho coast (38.198, 128.584)
    function cheongchoLakeFactor(lat, lng) {
      const dx = (lng - 128.582) * 87.6;
      const dy = (lat - 38.198) * 111.1;
      return Math.hypot(dx / 0.72, dy / 0.45);
    }

    // Full-res 2048x2048 land mask
    const fullMaskCanvas = document.createElement('canvas');
    fullMaskCanvas.width = W;
    fullMaskCanvas.height = H;
    const fmCtx = fullMaskCanvas.getContext('2d', { willReadFrequently: true });
    fmCtx.beginPath();
    GANGNEUNG_OUTLINE.forEach(([lng, lat], i) => {
      const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
      const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;
      if (i === 0) fmCtx.moveTo(x, y);
      else fmCtx.lineTo(x, y);
    });
    fmCtx.closePath();
    fmCtx.fillStyle = '#ffffff';
    fmCtx.fill();
    const fullMaskPixels = fmCtx.getImageData(0, 0, W, H).data;

    // 512x512 DEM heightmap mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = HW;
    maskCanvas.height = HH;
    const mCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    mCtx.beginPath();
    GANGNEUNG_OUTLINE.forEach(([lng, lat], i) => {
      const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * HW;
      const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * HH;
      if (i === 0) mCtx.moveTo(x, y);
      else mCtx.lineTo(x, y);
    });
    mCtx.closePath();
    mCtx.fillStyle = '#ffffff';
    mCtx.fill();
    const maskPixels = mCtx.getImageData(0, 0, HW, HH).data;

    // Geological Elevation Model (meters, max ~1708m at Seoraksan Daecheongbong)
    function calculateElevation(lat, lng) {
      const nX = (lng - BOUNDS.west) * 26;
      const nY = (lat - BOUNDS.south) * 26;
      const ridgeDetail = ridgedFbm(nX * 0.55 + 3.1, nY * 0.55 + 1.7, 4); // ~0..1
      const valleyFbm = fbm(nX * 0.9, nY * 0.9, 3);
      const fineRock = ridgedFbm(nX * 1.45, nY * 1.45, 3);

      // Gentle coastal plain base rising naturally inland from the East Sea coastline
      const coastLngApprox = 128.975 - Math.max(0, lat - 37.65) * 0.67;
      const inlandKm = Math.max(0, (coastLngApprox - lng) * 87.6);
      let h = 3.5 + valleyFbm * 5.0;

      if (inlandKm > 2.8) {
        const foothill = Math.min(1, (inlandKm - 2.8) / 28.0);
        h += 540 * Math.pow(foothill, 1.35) * (0.58 + ridgeDetail * 0.58);
      }

      // Smooth max-blend alpine peaks & continuous Baekdudaegan Mountain Spine
      let mountainPeak = 0;

      // Continuous Baekdudaegan Spine connecting Daegwallyeong -> Odaesan -> Jeombongsan -> Seoraksan
      const dSpine1 = distToSegmentKm(lat, lng, 37.6880, 128.7530, 37.7900, 128.5450); // Daegwallyeong -> Odaesan
      if (dSpine1 < 11.0) {
        const f = Math.max(0, 1 - dSpine1 / 11.0);
        mountainPeak = Math.max(mountainPeak, 1180 * Math.pow(f, 1.55) * (0.68 + ridgeDetail * 0.45));
      }
      const dSpine2 = distToSegmentKm(lat, lng, 37.7900, 128.5450, 38.0420, 128.4420); // Odaesan -> Jeombongsan
      if (dSpine2 < 12.0) {
        const f = Math.max(0, 1 - dSpine2 / 12.0);
        mountainPeak = Math.max(mountainPeak, 1260 * Math.pow(f, 1.55) * (0.68 + ridgeDetail * 0.45));
      }
      const dSpine3 = distToSegmentKm(lat, lng, 38.0420, 128.4420, 38.1194, 128.4655); // Jeombongsan -> Seorak Daecheongbong
      if (dSpine3 < 10.5) {
        const f = Math.max(0, 1 - dSpine3 / 10.5);
        mountainPeak = Math.max(mountainPeak, 1440 * Math.pow(f, 1.50) * (0.72 + ridgeDetail * 0.42));
      }

      // 1. Seoraksan Massif (Distant North-West Giant, up to 1,708m!)
      // Daecheongbong (1,708m)
      const dDaecheong = distKm(lat, lng, 38.1194, 128.4655);
      if (dDaecheong < 11.5) {
        const f = Math.max(0, 1 - dDaecheong / 11.5);
        mountainPeak = Math.max(mountainPeak, 1708 * Math.pow(f, 1.48) * (0.74 + ridgeDetail * 0.36));
      }

      // Jungcheongbong & Hangyeryeong west ridge
      const dSeorakW = distToSegmentKm(lat, lng, 38.1194, 128.4655, 38.0900, 128.4150);
      if (dSeorakW < 6.5) {
        const f = Math.max(0, 1 - dSeorakW / 6.5);
        mountainPeak = Math.max(mountainPeak, 1480 * Math.pow(f, 1.65) * (0.76 + fineRock * 0.32));
      }

      // Dinosaur Ridge (공룡능선) jagged craggy spine toward Madeungryeong
      const dDino = distToSegmentKm(lat, lng, 38.1194, 128.4655, 38.1550, 128.4860);
      if (dDino < 5.8) {
        const f = Math.max(0, 1 - dDino / 5.8);
        const sawtooth = 0.80 + fineRock * 0.28;
        mountainPeak = Math.max(mountainPeak, 1420 * Math.pow(f, 1.55) * sawtooth);
      }

      // Ulsanbawi granite wall (dramatic multi-spire monolith in Outer Seorak)
      const dUlsan = distToSegmentKm(lat, lng, 38.1610, 128.4620, 38.1635, 128.4820);
      if (dUlsan < 3.6) {
        const f = Math.max(0, 1 - dUlsan / 3.6);
        mountainPeak = Math.max(mountainPeak, 1020 * Math.pow(f, 1.35) * (0.78 + fineRock * 0.30));
      }

      // Hwachaebong / Gwimyeonam east shoulder looking down toward Naksan/East Sea
      const dHwache = distToSegmentKm(lat, lng, 38.1194, 128.4655, 38.1280, 128.5400);
      if (dHwache < 5.5) {
        const f = Math.max(0, 1 - dHwache / 5.5);
        mountainPeak = Math.max(mountainPeak, 1260 * Math.pow(f, 1.65) * (0.74 + ridgeDetail * 0.36));
      }

      // 2. Jeombongsan (1,424m)
      const dJeombong = distKm(lat, lng, 38.0420, 128.4420);
      if (dJeombong < 8.5) {
        const f = Math.max(0, 1 - dJeombong / 8.5);
        mountainPeak = Math.max(mountainPeak, 1410 * Math.pow(f, 1.55) * (0.75 + ridgeDetail * 0.35));
      }

      // 3. Odaesan Massif (Birobong 1,563m & eastern foothills)
      const dOdae = distKm(lat, lng, 37.7900, 128.5450);
      if (dOdae < 9.5) {
        const f = Math.max(0, 1 - dOdae / 9.5);
        mountainPeak = Math.max(mountainPeak, 1550 * Math.pow(f, 1.55) * (0.75 + ridgeDetail * 0.34));
      }
      const dOdaeRidge = distToSegmentKm(lat, lng, 37.7900, 128.5450, 37.8020, 128.6750);
      if (dOdaeRidge < 6.0) {
        const f = Math.max(0, 1 - dOdaeRidge / 6.0);
        mountainPeak = Math.max(mountainPeak, 1220 * Math.pow(f, 1.70) * (0.74 + ridgeDetail * 0.35));
      }

      // 4. Daegwallyeong & Seonjaryeong Highland Spine (1,157m) behind Gangneung
      const dDaegwal = distToSegmentKm(lat, lng, 37.6880, 128.7530, 37.7420, 128.7220);
      if (dDaegwal < 6.8) {
        const f = Math.max(0, 1 - dDaegwal / 6.8);
        mountainPeak = Math.max(mountainPeak, 1140 * Math.pow(f, 1.65) * (0.76 + ridgeDetail * 0.32));
      }

      h = Math.max(h, mountainPeak);

      // Deep dendritic alpine valleys (Cheonbuldong Valley & Osaek Valley)
      const dCheonbul = distToSegmentKm(lat, lng, 38.1320, 128.4720, 38.1650, 128.5400);
      if (dCheonbul < 1.8 && h > 140) {
        h -= (1 - dCheonbul / 1.8) * Math.min(380, h * 0.44);
      }

      // Gentle knoll for Gyeongpodae Pavilion overlooking Gyeongpo Lake (44m rise)
      const dGyeongpoHill = distKm(lat, lng, 37.7935, 128.8885);
      if (dGyeongpoHill < 0.78) {
        const f = Math.max(0, 1 - dGyeongpoHill / 0.78);
        h = Math.max(h, 6.0 + 42 * Math.pow(f, 1.65));
      }

      // Coastal headland bluffs (Hajodae & Naksansa Uisangdae)
      const dHajo = distKm(lat, lng, 38.0185, 128.7330);
      if (dHajo < 1.2) {
        h = Math.max(h, 76 * Math.pow(1 - dHajo / 1.2, 1.55));
      }
      const dNaksan = distKm(lat, lng, 38.1245, 128.6275);
      if (dNaksan < 1.2) {
        h = Math.max(h, 82 * Math.pow(1 - dNaksan / 1.2, 1.55));
      }

      // Gyeongpo Lake & Cheongchoho Lagoon depressions (flat jade-blue water basin at ~1m)
      const lakeR = gyeongpoLakeFactor(lat, lng);
      if (lakeR < 1.10) {
        const blend = lakeR < 0.85 ? 0 : (lakeR - 0.85) / 0.25;
        h = 1.0 + (h - 1.0) * blend;
      }
      const cheongR = cheongchoLakeFactor(lat, lng);
      if (cheongR < 1.05) {
        const blend = cheongR < 0.82 ? 0 : (cheongR - 0.82) / 0.23;
        h = 1.0 + (h - 1.0) * blend;
      }

      // Keep Gyeongpo Beach sandbar and Anmok estuary flat & natural
      const dBeach = distKm(lat, lng, 37.8135, 128.9055);
      if (dBeach < 0.9) h = Math.min(h, 5.0);
      const dAnmok = distKm(lat, lng, 37.7722, 128.9475);
      if (dAnmok < 1.0) h = Math.min(h, 7.0);

      // CRITICAL: Smooth natural border taper along INLAND West, North, and South borders (4.6 km)
      // Eliminates vertical cliff slice walls while keeping the East Sea shoreline completely crisp!
      const dWestKm = (lng - 128.370) * 87.6;
      const dNorthKm = (38.215 - lat) * 111.1;
      const dSouthKm = (lat - 37.630) * 111.1;
      const inlandEdgeKm = Math.min(dWestKm, dNorthKm, dSouthKm);
      if (inlandEdgeKm < 4.6) {
        const t = Math.max(0, Math.min(1, inlandEdgeKm / 4.6));
        const edgeFade = 0.5 - 0.5 * Math.cos(Math.PI * t);
        h *= edgeFade;
      }

      return Math.max(0, Math.min(1760, h));
    }

    // 1. Build 512x512 DEM heightCanvas (maxMeters = 1800)
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

        const val = Math.min(255, Math.floor((e / 1800) * 255));
        hData[idx] = val;
        hData[idx + 1] = val;
        hData[idx + 2] = val;
        hData[idx + 3] = inLand ? 255 : 0;
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // 2. Compute 2048x2048 two-pass Chamfer coastline distance transform
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

    const hScaleX = (HW - 1) / (W - 1);
    const hScaleY = (HH - 1) / (H - 1);
    function sampleElevation(px, py) {
      const sx = px < 0 ? 0 : (px >= W - 1 ? HW - 1.001 : px * hScaleX);
      const sy = py < 0 ? 0 : (py >= H - 1 ? HH - 1.001 : py * hScaleY);
      const x0 = sx | 0, y0 = sy | 0;
      const dx = sx - x0, dy = sy - y0;
      const r0 = y0 * HW, r1 = r0 + HW;
      return (
        (elevGrid[r0 + x0] * (1 - dx) + elevGrid[r0 + x0 + 1] * dx) * (1 - dy) +
        (elevGrid[r1 + x0] * (1 - dx) + elevGrid[r1 + x0 + 1] * dx) * dy
      );
    }

    // 3. Build 2048x2048 natural, elevation, normal & roughness canvases
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
          rgData[idx] = 52;
          rgData[idx + 1] = 52;
          rgData[idx + 2] = 52;
          rgData[idx + 3] = 255;
          continue;
        }

        const elev = sampleElevation(px, py);
        const cDist = coastDist[pIdx];
        // Only treat eastern shore facing the East Sea as actual ocean beach (not inland borders!)
        const isEastSeaShore = lng > 128.560 && lat > 37.638 && lat < 38.208;

        const xPrev = sampleElevation(px - 3, py);
        const xNext = sampleElevation(px + 3, py);
        const yPrev = sampleElevation(px, py - 3);
        const yNext = sampleElevation(px, py + 3);

        const microBumpX = (pseudoNoise(px + 1, py) - pseudoNoise(px - 1, py)) * 0.04;
        const microBumpY = (pseudoNoise(px, py + 1) - pseudoNoise(px, py - 1)) * 0.04;

        const dzdx = (xNext - xPrev) * 0.036 + microBumpX;
        const dzdy = (yNext - yPrev) * 0.036 + microBumpY;

        const nx = -dzdx, ny = -dzdy, nz = 1.0;
        const nLen = Math.hypot(nx, ny, nz);
        const nnx = nx / nLen, nny = ny / nLen, nnz = nz / nLen;

        nmData[idx] = Math.round((nnx * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.round((nny * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.round((nnz * 0.5 + 0.5) * 255);
        nmData[idx + 3] = 255;

        const dot = nnx * lx + nny * ly + nnz * lz;
        const slope = Math.hypot((xNext - xPrev) * 0.036, (yNext - yPrev) * 0.036);
        const shade = Math.min(1.36, Math.max(0.42, 0.56 + 0.58 * dot));

        const microNoise = fbm(px * 0.065, py * 0.065, 3);
        const medNoise = fbm(px * 0.018, py * 0.018, 2);
        const macroNoise = fbm(px * 0.006, py * 0.006, 2);
        const grain = pseudoNoise(px, py);

        const lakeR = gyeongpoLakeFactor(lat, lng);
        const cheongR = cheongchoLakeFactor(lat, lng);
        const dGangneungCity = distKm(lat, lng, 37.762, 128.882);
        const dOjukheon = distKm(lat, lng, 37.7791, 128.8760);
        const dNamdaecheon = distToSegmentKm(lat, lng, 37.732, 128.828, 37.772, 128.949);
        const dUlsanbawi = distToSegmentKm(lat, lng, 38.1610, 128.4620, 38.1635, 128.4820);
        const dDaecheong = distKm(lat, lng, 38.1194, 128.4655);

        let r = 56, g = 104, b = 52;
        let roughVal = 222;

        // 1. Gyeongpo Lake Lagoon & Cherry Blossom Promenade + Cheongchoho Lagoon
        if (lakeR < 0.88) {
          const wave = Math.sin(px * 0.08 + py * 0.14) * 3.5 + microNoise * 7;
          const rim = lakeR > 0.74 ? (lakeR - 0.74) / 0.14 : 0;
          r = Math.floor(24 + rim * 22 + wave);
          g = Math.floor(114 + rim * 28 + wave);
          b = Math.floor(156 + rim * 16 + wave);
          roughVal = 36;
        } else if (lakeR < 0.96) {
          // Gyeongpo Lakeside cherry blossom & sandy promenade rim
          const blossom = microNoise > 0.45 ? 1 : 0;
          r = Math.floor(198 + blossom * 24 + grain * 6);
          g = Math.floor(182 + blossom * 8 + grain * 6);
          b = Math.floor(170 + blossom * 16);
          roughVal = 192;
        } else if (cheongR < 0.85) {
          r = Math.floor(26 + microNoise * 10);
          g = Math.floor(108 + microNoise * 14);
          b = Math.floor(148 + microNoise * 14);
          roughVal = 38;
        }
        // 2. Gangneung Namdaecheon River
        else if (dNamdaecheon < 0.14 && elev < 28) {
          r = Math.floor(30 + microNoise * 10);
          g = Math.floor(96 + microNoise * 14);
          b = Math.floor(136 + microNoise * 14);
          roughVal = 48;
        }
        // 3. East Sea Golden Sandy Beaches, Turquoise Shallows & Coastal Pine Shelterbelt
        else if (isEastSeaShore && cDist <= 34 && elev < 30) {
          if (cDist <= 4) {
            // Breaking East Sea white surf foam & turquoise swash
            const foamNoise = fbm(px * 0.16, py * 0.16, 2);
            const foamMix = 0.48 + foamNoise * 0.45;
            r = Math.floor(192 + foamMix * 56);
            g = Math.floor(228 + foamMix * 24);
            b = Math.floor(236 + foamMix * 18);
            roughVal = 72;
          } else if (cDist <= 12) {
            // Wet tidal sand
            r = Math.floor(210 + microNoise * 12 + grain * 6);
            g = Math.floor(194 + microNoise * 12 + grain * 6);
            b = Math.floor(156 + microNoise * 10);
            roughVal = 112;
          } else if (cDist <= 22) {
            // Bright fine East Sea sand (Gyeongpo, Anmok, Sacheon, Naksan)
            r = Math.floor(242 + microNoise * 10 + grain * 5);
            g = Math.floor(226 + microNoise * 10 + grain * 5);
            b = Math.floor(188 + microNoise * 10);
            roughVal = 196;
          } else {
            // Dense coastal black-pine shelterbelt (해송 방풍림)
            r = Math.floor(30 + microNoise * 16 + grain * 5);
            g = Math.floor(76 + microNoise * 22 + grain * 6);
            b = Math.floor(40 + microNoise * 12);
            roughVal = 230;
          }
        }
        // 4. Rocky Headlands (Hajodae, Naksan Uisangdae cliffs)
        else if (isEastSeaShore && cDist <= 12 && elev >= 30) {
          r = Math.floor(114 + microNoise * 24 + grain * 8);
          g = Math.floor(112 + microNoise * 22 + grain * 8);
          b = Math.floor(104 + microNoise * 18);
          roughVal = 204;
        }
        // 5. Continuous Alpine, Granite Crags & Forest Biome Shading (no abrupt altitude cut line!)
        else {
          const elevNorm = Math.min(1, elev / 1650);
          // Forest base interpolates smoothly from bright coastal pine-grass to deep Taebaek mountain evergreen
          const canopy = medNoise * 0.55 + microNoise * 0.45;
          let fr = 64 + canopy * 34 - elevNorm * 24 + grain * 6;
          let fg = 114 + canopy * 32 - elevNorm * 34 + grain * 6;
          let fb = 54 + canopy * 18 - elevNorm * 12 + grain * 4;
          roughVal = 224;

          // Autumn broadleaf foliage blend on mid-high Baekdudaegan slopes (500m - 1350m)
          if (elev > 480) {
            const elevBand = Math.max(0, Math.min(1, (elev - 480) / 340)) * Math.max(0, 1 - Math.max(0, elev - 1320) / 350);
            const autumnStrength = elevBand * Math.max(0, Math.min(1, (medNoise - 0.34) * 2.5));
            if (autumnStrength > 0.02) {
              fr = fr * (1 - autumnStrength) + (154 + microNoise * 36) * autumnStrength;
              fg = fg * (1 - autumnStrength) + (86 + microNoise * 24) * autumnStrength;
              fb = fb * (1 - autumnStrength) + (42 + microNoise * 14) * autumnStrength;
            }
          }

          // Exposed granite crags & cliffs focused on steep rocky faces, Ulsanbawi & high Seoraksan peaks
          const graniteTrigger =
            slope * 0.56 +
            Math.max(0, elev - 1150) / 680 +
            (dUlsanbawi < 2.0 ? (1 - dUlsanbawi / 2.0) * 0.85 : 0) +
            (dDaecheong < 2.6 ? (1 - dDaecheong / 2.6) * 0.42 : 0) +
            (microNoise - 0.5) * 0.28;

          const graniteMix = Math.max(0, Math.min(1, (graniteTrigger - 0.68) * 2.6));
          if (graniteMix > 0.01) {
            const tone = 166 + elevNorm * 56 + microNoise * 22 + grain * 7;
            fr = fr * (1 - graniteMix) + Math.min(238, tone) * graniteMix;
            fg = fg * (1 - graniteMix) + Math.min(236, tone - 2) * graniteMix;
            fb = fb * (1 - graniteMix) + Math.min(242, tone + 2) * graniteMix;
            roughVal = Math.round(roughVal * (1 - graniteMix) + 198 * graniteMix);
          }

          // Ojukheon grove & soft urban Gangneung village blend (fine-grained, no chunky checkerboard!)
          if (dOjukheon < 0.65) {
            fr = 54 + microNoise * 16; fg = 96 + microNoise * 20; fb = 52 + microNoise * 12;
          } else if (elev < 42) {
            const urbanDist = dGangneungCity + (macroNoise - 0.5) * 1.6;
            if (urbanDist < 3.6) {
              const urbanFade = Math.max(0, Math.min(1, (3.6 - urbanDist) / 2.0));
              const gx = px * 0.24;
              const gy = py * 0.24;
              const cellHash = pseudoNoise(Math.floor(gx), Math.floor(gy));
              const subX = gx - Math.floor(gx);
              const subY = gy - Math.floor(gy);
              let ur, ug, ub;
              if (subX < 0.16 || subY < 0.16) {
                ur = 108; ug = 112; ub = 116; // soft asphalt street
              } else if (cellHash < 0.32) {
                ur = 76; ug = 118; ub = 72; // urban park tree canopy
              } else {
                ur = 168 + cellHash * 28; ug = 166 + cellHash * 22; ub = 162 + cellHash * 18;
              }
              fr = fr * (1 - urbanFade * 0.72) + ur * (urbanFade * 0.72);
              fg = fg * (1 - urbanFade * 0.72) + ug * (urbanFade * 0.72);
              fb = fb * (1 - urbanFade * 0.72) + ub * (urbanFade * 0.72);
              roughVal = Math.round(roughVal * (1 - urbanFade * 0.4) + 180 * (urbanFade * 0.4));
            }
          }

          // Subtle atmospheric blue-violet aerial haze on distant NW high mountains (Seoraksan depth!)
          const nwDistFactor = Math.max(0, Math.min(1, ((128.75 - lng) / 0.38 + (lat - 37.82) / 0.38) * 0.5));
          const hazeMix = Math.min(0.28, nwDistFactor * 0.16 + Math.max(0, elev - 900) / 5500);
          fr = fr * (1 - hazeMix) + 142 * hazeMix;
          fg = fg * (1 - hazeMix) + 168 * hazeMix;
          fb = fb * (1 - hazeMix) + 206 * hazeMix;

          r = fr;
          g = fg;
          b = fb;
        }

        nData[idx] = Math.min(255, Math.floor(r * shade));
        nData[idx + 1] = Math.min(255, Math.floor(g * shade));
        nData[idx + 2] = Math.min(255, Math.floor(b * shade));
        nData[idx + 3] = 255;

        rgData[idx] = roughVal;
        rgData[idx + 1] = roughVal;
        rgData[idx + 2] = roughVal;
        rgData[idx + 3] = 255;

        // 4. Elevation Relief Map (0m - 1760m hypsometric tint + contour bands)
        const ratio = Math.min(1, elev / 1720);
        let er, eg, eb;
        if (lakeR < 0.88 || cheongR < 0.85) {
          er = 42; eg = 112; eb = 154;
        } else if (ratio < 0.10) {
          const s = ratio / 0.10;
          er = Math.floor(78 + s * 64);
          eg = Math.floor(184 - s * 16);
          eb = Math.floor(118 - s * 48);
        } else if (ratio < 0.35) {
          const s = (ratio - 0.10) / 0.25;
          er = Math.floor(142 + s * 86);
          eg = Math.floor(168 - s * 22);
          eb = Math.floor(70 - s * 26);
        } else if (ratio < 0.65) {
          const s = (ratio - 0.35) / 0.30;
          er = Math.floor(228 - s * 18);
          eg = Math.floor(146 - s * 58);
          eb = Math.floor(44 + s * 42);
        } else if (ratio < 0.88) {
          const s = (ratio - 0.65) / 0.23;
          er = Math.floor(210 - s * 58);
          eg = Math.floor(88 + s * 24);
          eb = Math.floor(86 + s * 78);
        } else {
          const s = (ratio - 0.88) / 0.12;
          er = Math.floor(152 + s * 88);
          eg = Math.floor(112 + s * 116);
          eb = Math.floor(164 + s * 82);
        }

        const contourMajor = Math.abs(Math.sin(elev * 0.031416));
        const contourMinor = elev < 260 ? Math.abs(Math.sin(elev * 0.15708)) : 1.0;
        const contourFactor = contourMajor < 0.08 ? 0.84 : (contourMinor < 0.06 ? 0.94 : 1.0);

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

  window.GANGNEUNG_BOUNDS = BOUNDS;
  window.GANGNEUNG_OUTLINE = GANGNEUNG_OUTLINE;
  window.GANGNEUNG_ROADS = GANGNEUNG_ROADS;
  window.GANGNEUNG_PRESETS = GANGNEUNG_PRESETS;
  window.inGangneungLand = inGangneungLand;
  window.createGangneungAssets = createGangneungAssets;
})();
