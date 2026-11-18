// Chungcheongbuk-do Chungju Dam, Chungjuho (Cheongpungho) Lake & Danyang Eight Scenic Views 3D Terrain Generator
// Covers Chungju Concrete Gravity Dam (141m lake -> 66m Namhangang tailrace), Ageobong Peninsula,
// Cheongpungho & Bibongsan, Gudambong & Oksunbong + Oksun Bridge, Mancheonha Skywalk, Dodamsambong & Seokmun,
// Sainam, Seonam Valley (Haseonam / Jungseonam / Sangseonam), Woraksan (1,097m) & Sobaeksan (1,439m).
(() => {
  'use strict';

  const BOUNDS = {
    west: 127.940,
    south: 36.835,
    east: 128.500,
    north: 37.065
  };

  // Sculpted inland Baekdudaegan & Namhangang basin relief perimeter (lng, lat)
  const DANYANG_OUTLINE = [
    [127.950, 36.846],
    [128.020, 36.843],
    [128.105, 36.841], // South of Woraksan massif
    [128.195, 36.842],
    [128.295, 36.841], // South of Seonam Valley / Doraksan
    [128.385, 36.843],
    [128.478, 36.846],
    [128.491, 36.868],
    [128.493, 36.935], // East Sobaeksan Birobong crest
    [128.492, 37.005],
    [128.485, 37.053],
    [128.415, 37.057],
    [128.325, 37.058], // North of Dodamsambong / Maepo karst hills
    [128.225, 37.057], // North of Geumsusan
    [128.125, 37.057], // North of Cheongpungho
    [128.025, 37.056], // North of Chungju Dam
    [127.954, 37.052],
    [127.947, 37.015], // Downstream Namhangang exit
    [127.947, 36.945],
    [127.948, 36.885],
    [127.950, 36.846]
  ];

  // Main Namhangang & Chungjuho Lake thalweg spine: [lng, lat, halfWidthKm, surfaceElevM]
  const NAMHANGANG_SPINE = [
    [127.9440, 37.0220, 0.30, 65.0],
    [127.9680, 37.0115, 0.33, 65.5],
    [127.9912, 37.0018, 0.38, 66.0],  // Tailrace immediately below Chungju Dam
    [127.9942, 37.0018, 0.92, 141.0], // Reservoir forebay upstream of Chungju Dam
    [128.0180, 36.9990, 1.18, 141.0],
    [128.0460, 36.9895, 1.38, 141.0], // Wide Chungjuho main basin
    [128.0760, 36.9795, 1.42, 141.0], // North of Ageobong (Crocodile Peak) peninsula
    [128.1080, 36.9850, 1.26, 141.0],
    [128.1380, 36.9965, 1.12, 141.0], // West Cheongpung meander
    [128.1660, 37.0005, 0.88, 141.1], // Cheongpung Bridge narrows north of Bibongsan
    [128.1860, 36.9840, 0.74, 141.2],
    [128.2020, 36.9610, 0.56, 141.3], // Southeast bend toward Oksun gorge
    [128.2165, 36.9402, 0.42, 141.4], // Oksun Bridge & Oksunbong (View 4)
    [128.2375, 36.9395, 0.44, 141.6], // Gudambong (View 3) & Janghoe Ferry
    [128.2620, 36.9485, 0.38, 142.0],
    [128.2920, 36.9595, 0.35, 143.0], // Lower Danyang gorge
    [128.3180, 36.9650, 0.34, 143.8], // Danseong confluence
    [128.3525, 36.9692, 0.33, 144.8], // Horseshoe river bend below Mancheonha Skywalk
    [128.3625, 36.9838, 0.35, 145.4], // Gosu Bridge & Danyang town waterfront
    [128.3432, 36.9916, 0.48, 146.0], // Dodamsambong S-bend basin (View 1)
    [128.3392, 37.0008, 0.33, 146.5], // Seokmun cliff bend (View 2)
    [128.3680, 37.0220, 0.28, 148.0],
    [128.4180, 37.0395, 0.25, 150.5],
    [128.4720, 37.0465, 0.22, 153.0]
  ];

  // Sinuous drowned-valley embayments of Chungjuho / Cheongpungho (curved multi-segment fjords)
  const LAKE_BAYS = [
    // Dongnyang Winding North Embayment
    [
      [128.0280, 36.9960, 0.78, 141.0],
      [128.0360, 37.0110, 0.56, 141.0],
      [128.0510, 37.0245, 0.38, 141.0],
      [128.0460, 37.0375, 0.20, 141.2]
    ],
    // Salmi / Worak Winding South Embayment (west side of Ageobong Crocodile Peninsula)
    [
      [128.0460, 36.9895, 0.76, 141.0],
      [128.0520, 36.9690, 0.54, 141.0],
      [128.0410, 36.9495, 0.36, 141.0],
      [128.0480, 36.9330, 0.18, 141.2]
    ],
    // East Ageobong Sinuous Cove (east side of Crocodile Peninsula)
    [
      [128.0960, 36.9825, 0.62, 141.0],
      [128.0880, 36.9660, 0.42, 141.0],
      [128.0950, 36.9505, 0.26, 141.0],
      [128.0890, 36.9385, 0.15, 141.2]
    ],
    // Cheongpung Geumsusan North Cove
    [
      [128.1660, 37.0005, 0.58, 141.1],
      [128.1720, 37.0165, 0.40, 141.1],
      [128.1850, 37.0305, 0.24, 141.2],
      [128.1810, 37.0410, 0.14, 141.3]
    ]
  ];

  // Mountain Scenic Valleys: Seonam Valley (Views 6, 7, 8) & Sainam Namcheon Valley (View 5)
  // Kept cleanly inside the mountain massif so they do not cut through the outer plinth rim
  const SCENIC_STREAMS = [
    // Seonamcheon: Sangseonam -> Jungseonam -> Haseonam -> Namhangang
    [
      [128.2935, 36.8585, 0.09, 322.0], // Sangseonam (View 8)
      [128.2995, 36.8685, 0.12, 265.0], // Jungseonam (View 7)
      [128.3075, 36.8855, 0.13, 214.0], // Haseonam (View 6)
      [128.3135, 36.9240, 0.14, 170.0],
      [128.3180, 36.9650, 0.17, 143.8]
    ],
    // Namcheon: Sobaek West Gorge -> Sainam -> Namhangang
    [
      [128.3690, 36.8760, 0.09, 318.0],
      [128.3580, 36.9155, 0.12, 198.0], // Sainam (View 5)
      [128.3510, 36.9440, 0.14, 164.0],
      [128.3525, 36.9692, 0.16, 144.8]
    ]
  ];

  const DANYANG_ROADS = [
    {
      name: '중앙고속도로 (제천·단양대교·죽령터널)',
      type: 'motorway',
      points: [
        [37.0520, 128.2480],
        [37.0180, 128.2820],
        [36.9820, 128.3120],
        [36.9560, 128.3340],
        [36.9220, 128.3680],
        [36.8850, 128.4060],
        [36.8520, 128.4360]
      ]
    },
    {
      name: '충주호반로 · 36번 국도 (충주댐~청풍~옥순대교~단양)',
      type: 'trunk',
      points: [
        [37.0075, 127.9680],
        [37.0038, 127.9945],
        [36.9820, 128.0550],
        [36.9860, 128.1180],
        [36.9985, 128.1660],
        [36.9650, 128.1990],
        [36.9402, 128.2165],
        [36.9355, 128.2410],
        [36.9540, 128.2850],
        [36.9675, 128.3320],
        [36.9838, 128.3625]
      ]
    },
    {
      name: '삼봉로 · 단양강변로 (고수대교~도담삼봉~석문)',
      type: 'primary',
      points: [
        [36.9705, 128.3535],
        [36.9838, 128.3625],
        [36.9928, 128.3515],
        [36.9985, 128.3420],
        [37.0160, 128.3580],
        [37.0380, 128.4050]
      ]
    },
    {
      name: '선암계곡로 · 사인암로 (단양팔경 계곡 드라이브)',
      type: 'primary',
      points: [
        [36.9620, 128.3185],
        [36.9240, 128.3130],
        [36.8835, 128.3075],
        [36.8665, 128.2995],
        [36.8555, 128.2935],
        [36.8820, 128.3350],
        [36.9155, 128.3580],
        [36.9560, 128.3520]
      ]
    }
  ];

  // Top 3 presets appear by default on map load, framing West (Chungju Dam), Center (Gudambong/Oksunbong), East (Dodamsambong)
  const DANYANG_PRESETS = [
    { id: 'chungju_dam', name: '충주댐 · 물문화관 전망대', category: '다목적댐·충주호', icon: '🌊', lat: 37.0018, lng: 127.9932 },
    { id: 'gudam_oksun', name: '구담봉 · 옥순봉 · 옥순대교', category: '단양팔경 제3·4경', icon: '🌉', lat: 36.9408, lng: 128.2255 },
    { id: 'dodamsambong', name: '도담삼봉 · 석문 (제1·2경)', category: '단양팔경 대표명소', icon: '⛰️', lat: 36.9916, lng: 128.3432 },
    { id: 'mancheonha', name: '만천하 스카이워크', category: '절벽 전망대', icon: '🌀', lat: 36.9685, lng: 128.3490 },
    { id: 'sainam', name: '사인암 기암절벽 (제5경)', category: '단양팔경·계곡', icon: '🪨', lat: 36.9155, lng: 128.3580 },
    { id: 'seonam_valley', name: '하선암·중선암·상선암 (제6·7·8경)', category: '단양팔경·선암계곡', icon: '💧', lat: 36.8665, lng: 128.2995 },
    { id: 'cheongpung_lake', name: '청풍호반 · 비봉산 전망대', category: '청풍호·케이블카', icon: '🚡', lat: 36.9912, lng: 128.1642 },
    { id: 'ageobong', name: '충주호 악어봉 전망대', category: '충주호 비경', icon: '🐊', lat: 36.9565, lng: 128.0680 },
    { id: 'woraksan', name: '월악산 영봉 (1,097m)', category: '국립공원 명산', icon: '🏔️', lat: 36.8865, lng: 128.1060 },
    { id: 'sobaeksan', name: '소백산 비로봉 (1,439m)', category: '백두대간 국립공원', icon: '⛰', lat: 36.9575, lng: 128.4650 }
  ];

  function inDanyangLand(lng, lat) {
    let inside = false;
    for (let i = 0, j = DANYANG_OUTLINE.length - 1; i < DANYANG_OUTLINE.length; j = i++) {
      const [xi, yi] = DANYANG_OUTLINE[i];
      const [xj, yj] = DANYANG_OUTLINE[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  function createDanyangAssets() {
    const W = 2048;
    const H = 2048;
    const HW = 512;
    const HH = 512;

    const KM_PER_DEG_LNG = 88.85;
    const KM_PER_DEG_LAT = 111.0;

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
      for (let i = 0; i < (octaves || 4); i++) {
        val += smoothNoise(x * freq, y * freq) * amp;
        amp *= 0.5;
        freq *= 2.03;
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
        freq *= 2.07;
      }
      return sum;
    }

    function smoothstep(e0, e1, x) {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0 || 1e-6)));
      return t * t * (3 - 2 * t);
    }

    function distToOutlineKm(lng, lat) {
      let minDist = Infinity;
      for (let i = 0; i < DANYANG_OUTLINE.length - 1; i++) {
        const [x1, y1] = DANYANG_OUTLINE[i];
        const [x2, y2] = DANYANG_OUTLINE[i + 1];
        const dx = (x2 - x1) * KM_PER_DEG_LNG;
        const dy = (y2 - y1) * KM_PER_DEG_LAT;
        const px = (lng - x1) * KM_PER_DEG_LNG;
        const py = (lat - y1) * KM_PER_DEG_LAT;
        const lenSq = dx * dx + dy * dy;
        let t = lenSq > 0 ? (px * dx + py * dy) / lenSq : 0;
        t = Math.max(0, Math.min(1, t));
        const d = Math.hypot(px - t * dx, py - t * dy);
        if (d < minDist) minDist = d;
      }
      return minDist;
    }

    function sampleChannel(lng, lat, poly) {
      let bestDistKm = Infinity;
      let bestWidthKm = 0.3;
      let bestElevM = 141.0;
      let bestLon = lng;

      for (let i = 0; i < poly.length - 1; i++) {
        const p1 = poly[i];
        const p2 = poly[i + 1];
        const dx = (p2[0] - p1[0]) * KM_PER_DEG_LNG;
        const dy = (p2[1] - p1[1]) * KM_PER_DEG_LAT;
        const px = (lng - p1[0]) * KM_PER_DEG_LNG;
        const py = (lat - p1[1]) * KM_PER_DEG_LAT;
        const lenSq = dx * dx + dy * dy;
        let t = lenSq > 0 ? (px * dx + py * dy) / lenSq : 0;
        t = Math.max(0, Math.min(1, t));
        const d = Math.hypot(px - t * dx, py - t * dy);
        if (d < bestDistKm) {
          bestDistKm = d;
          bestWidthKm = p1[2] + (p2[2] - p1[2]) * t;
          bestElevM = p1[3] + (p2[3] - p1[3]) * t;
          bestLon = p1[0] + (p2[0] - p1[0]) * t;
        }
      }
      return { distKm: bestDistKm, widthKm: bestWidthKm, elevM: bestElevM, segLon: bestLon };
    }

    // Major Baekdudaegan & Chungjuho mountain massifs [lng, lat, peakAddM, rxKm, ryKm, angleRad]
    const MASSIFS = [
      // Sobaeksan Massif (Birobong 1,439m, Yeonhwabong 1,383m, Gukmangbong 1,421m)
      [128.4650, 36.9575, 1180, 6.2, 7.8, 0.28],
      [128.4420, 36.9120, 1020, 5.4, 5.8, 0.35],
      [128.4780, 37.0080, 980,  4.8, 5.2, 0.18],
      // Woraksan National Park Massif (Yeongbong 1,097m, Jungbong, Habong)
      [128.1060, 36.8865, 895,  5.6, 4.8, -0.22],
      [128.1480, 36.8740, 720,  4.5, 4.0, -0.15],
      // Geumsusan (1,016m) & Malmoksan north of Oksun/Cheongpung
      [128.2560, 37.0060, 790,  4.9, 4.2, 0.15],
      [128.2180, 36.9820, 540,  3.4, 3.0, -0.30],
      // Doraksan (964m) & Hwangjeongsan (959m) framing Seonam Valley & Sainam
      [128.3120, 36.8540, 720,  4.4, 3.8, 0.12],
      [128.3520, 36.8580, 710,  4.0, 3.8, -0.18],
      // Bibongsan (531m) scenic cable-car peak surrounded by Cheongpungho
      [128.1642, 36.9912, 375,  2.1, 1.8, 0.10],
      // Ageobong (559m, Crocodile Peak) overlooking Chungjuho
      [128.0680, 36.9565, 395,  2.4, 2.5, 0.05],
      // Gyemyeongsan (775m) & Namsan flanking Chungju Dam gorge
      [127.9880, 36.9760, 560,  3.3, 2.8, 0.20],
      [128.0040, 37.0280, 490,  3.2, 2.6, -0.20],
      // Gudambong (330m) & Oksunbong (286m) dramatic sheer lake crags
      [128.2365, 36.9350, 235,  1.35, 1.15, 0.08],
      [128.2225, 36.9448, 195,  1.20, 1.05, -0.15],
      // Mancheonha Geumsu-spur cliff (268m) overlooking horseshoe bend
      [128.3475, 36.9682, 165,  1.15, 1.05, 0.30],
      // Seokmun (View 2) limestone karst ridge north of Dodamsambong
      [128.3395, 36.9995, 155,  1.10, 0.85, 0.10]
    ];

    function computeField(lng, lat) {
      if (!inDanyangLand(lng, lat)) {
        return { elev: 0, isLake: false, isStream: false, waterDepth: 0, cliffFactor: 0, edgeFade: 0 };
      }

      const dEdgeKm = distToOutlineKm(lng, lat);
      const edgeFade = smoothstep(0.0, 1.05, dEdgeKm);

      const nx = (lng - BOUNDS.west) * 34.0;
      const ny = (lat - BOUNDS.south) * 42.0;
      const ridge = ridgedFbm(nx * 0.85 + 3.1, ny * 0.85 + 7.4, 4);
      const detail = fbm(nx * 2.3 + 11.2, ny * 2.3 + 5.7, 4);

      // Base inland plateau (~215m rising gently east toward Baekdudaegan)
      let landElev = 195 + (lng - BOUNDS.west) * 140 + ridge * 135 + (detail - 0.5) * 42;

      for (let i = 0; i < MASSIFS.length; i++) {
        const [mlng, mlat, mPeak, rx, ry, ang] = MASSIFS[i];
        const dxKm = (lng - mlng) * KM_PER_DEG_LNG;
        const dyKm = (lat - mlat) * KM_PER_DEG_LAT;
        const ca = Math.cos(ang), sa = Math.sin(ang);
        const ux = (dxKm * ca + dyKm * sa) / rx;
        const uy = (-dxKm * sa + dyKm * ca) / ry;
        const d2 = ux * ux + uy * uy;
        if (d2 < 7.5) {
          const ridgeMod = 0.82 + 0.34 * ridgedFbm(nx * 1.4 + i * 2.1, ny * 1.4 - i * 1.7, 3);
          landElev += mPeak * Math.exp(-d2 * 1.35) * ridgeMod;
        }
      }

      // River & Reservoir carving
      const mainSample = sampleChannel(lng, lat, NAMHANGANG_SPINE);
      let chDistKm = mainSample.distKm;
      let chWidthKm = mainSample.widthKm;

      // Crisp hydraulic step at Chungju Dam axis (lng = 127.9926)
      let waterElev = lng < 127.9926
        ? 65.5 + smoothstep(127.942, 127.992, lng) * 0.7
        : Math.max(141.0, mainSample.elevM);

      // Strong organic shoreline crenulation so reservoir arms look naturally drowned, never geometric
      const shoreWiggle = (fbm(nx * 2.8, ny * 2.8, 4) - 0.5) * 0.34 + (smoothNoise(nx * 7.5, ny * 7.5) - 0.5) * 0.12;
      let normDist = chDistKm / Math.max(0.14, chWidthKm * (1.0 + shoreWiggle));

      for (let b = 0; b < LAKE_BAYS.length; b++) {
        const bay = sampleChannel(lng, lat, LAKE_BAYS[b]);
        const bNorm = bay.distKm / Math.max(0.11, bay.widthKm * (1.0 + shoreWiggle * 0.95));
        if (bNorm < normDist) {
          normDist = bNorm;
          waterElev = bay.elevM;
        }
      }

      // Carve dramatic V/U-shaped Namhangang gorge & lake basin
      let elev = landElev;
      let isLake = false;
      let waterDepth = 0;
      let cliffFactor = 0;

      if (normDist < 3.4) {
        // Gorge wall profile: steep cliff near Oksunbong/Gudambong/Mancheonha/Chungju Dam
        const dOksun = Math.hypot((lng - 128.229) * KM_PER_DEG_LNG, (lat - 36.940) * KM_PER_DEG_LAT);
        const dMancheon = Math.hypot((lng - 128.349) * KM_PER_DEG_LNG, (lat - 36.969) * KM_PER_DEG_LAT);
        const dDam = Math.hypot((lng - 127.993) * KM_PER_DEG_LNG, (lat - 37.002) * KM_PER_DEG_LAT);
        const isSheerGorge = dOksun < 3.2 || dMancheon < 2.2 || dDam < 2.4;

        const bankEnd = isSheerGorge ? 2.15 : 3.25;
        const bankBlend = smoothstep(1.0, bankEnd, normDist);
        elev = waterElev + (landElev - waterElev) * bankBlend;

        if (normDist < 1.0) {
          isLake = true;
          waterDepth = (1.0 - normDist * normDist) * (lng < 127.9926 ? 6.0 : 28.0);
          elev = waterElev;
        } else if (normDist < 1.55 && isSheerGorge) {
          cliffFactor = 1.0 - smoothstep(1.0, 1.55, normDist);
        }
      }

      // Dodamsambong 3 limestone islets emerging subtly in the middle of the river bend
      const dDodam = Math.hypot((lng - 128.3432) * KM_PER_DEG_LNG, (lat - 36.9916) * KM_PER_DEG_LAT);
      if (dDodam < 0.14) {
        isLake = false;
        elev = Math.max(elev, 149.5 + (1.0 - dDodam / 0.14) * 9.5);
        cliffFactor = 0.85;
      }

      // Carve Seonam Valley (Haseonam, Jungseonam, Sangseonam) & Sainam mountain streams
      let isStream = false;
      if (dEdgeKm > 1.35) {
        const interiorStreamMask = smoothstep(1.35, 2.2, dEdgeKm);
        for (let s = 0; s < SCENIC_STREAMS.length; s++) {
          const st = sampleChannel(lng, lat, SCENIC_STREAMS[s]);
          const sNorm = st.distKm / st.widthKm;
          if (sNorm < 4.0 && !isLake) {
            const valleyBlend = smoothstep(0.75, 4.0, sNorm);
            const rawCarved = st.elevM + Math.max(0, elev - st.elevM) * valleyBlend;
            const carved = elev * (1 - interiorStreamMask) + rawCarved * interiorStreamMask;
            if (carved < elev) elev = carved;
            if (sNorm < 0.82 && interiorStreamMask > 0.5) {
              isStream = true;
            }
            // Sainam sheer 70m vertical rock wall on east bank
            if (s === 1 && Math.hypot((lng - 128.3595) * KM_PER_DEG_LNG, (lat - 36.9155) * KM_PER_DEG_LAT) < 0.75) {
              cliffFactor = Math.max(cliffFactor, 0.92);
            }
          }
        }
      }

      // Danyang lakeside town terrace (around Gosu Bridge 36.984, 128.368)
      const dTown = Math.hypot((lng - 128.3685) * KM_PER_DEG_LNG, (lat - 36.9845) * KM_PER_DEG_LAT);
      if (dTown < 1.25 && !isLake && elev > 152) {
        const townFlatten = (1.0 - smoothstep(0.35, 1.25, dTown)) * 0.68;
        elev = elev * (1.0 - townFlatten) + 162.0 * townFlatten;
      }

      elev = Math.min(1445, Math.max(24, elev * edgeFade));
      return { elev, isLake, isStream, waterDepth, cliffFactor, edgeFade, dEdgeKm };
    }

    // 1. Generate 512x512 16-bit RG Heightmap (R = integer byte, G = fractional byte for sub-meter smooth lake)
    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = HW;
    heightCanvas.height = HH;
    const hCtx = heightCanvas.getContext('2d', { willReadFrequently: true });
    const hImg = hCtx.createImageData(HW, HH);
    const hData = hImg.data;
    const elevGrid = new Float32Array(HW * HH);

    for (let y = 0; y < HH; y++) {
      const lat = BOUNDS.north - ((y + 0.5) / HH) * (BOUNDS.north - BOUNDS.south);
      for (let x = 0; x < HW; x++) {
        const lng = BOUNDS.west + ((x + 0.5) / HW) * (BOUNDS.east - BOUNDS.west);
        const f = computeField(lng, lat);
        elevGrid[y * HW + x] = f.elev;

        const hScaled = Math.max(0, Math.min(255, (f.elev / 1500) * 255));
        const rByte = Math.floor(hScaled);
        const gByte = Math.floor((hScaled - rByte) * 255);
        const idx = (y * HW + x) * 4;
        hData[idx] = rByte;
        hData[idx + 1] = gByte;
        hData[idx + 2] = rByte;
        hData[idx + 3] = 255;
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // 2. Generate 2048x2048 PBR Natural, Hypsometric Elevation, Normal, and Roughness Maps
    const naturalCanvas = document.createElement('canvas');
    naturalCanvas.width = W;
    naturalCanvas.height = H;
    const natCtx = naturalCanvas.getContext('2d');
    const natImg = natCtx.createImageData(W, H);
    const natData = natImg.data;

    const elevationCanvas = document.createElement('canvas');
    elevationCanvas.width = W;
    elevationCanvas.height = H;
    const elvCtx = elevationCanvas.getContext('2d');
    const elvImg = elvCtx.createImageData(W, H);
    const elvData = elvImg.data;

    const roughnessCanvas = document.createElement('canvas');
    roughnessCanvas.width = W;
    roughnessCanvas.height = H;
    const rghCtx = roughnessCanvas.getContext('2d');
    const rghImg = rghCtx.createImageData(W, H);
    const rghData = rghImg.data;

    function sampleDemBilinear(u, v) {
      const gx = Math.max(0, Math.min(HW - 1.001, u * (HW - 1)));
      const gy = Math.max(0, Math.min(HH - 1.001, v * (HH - 1)));
      const x0 = Math.floor(gx), y0 = Math.floor(gy);
      const dx = gx - x0, dy = gy - y0;
      const e00 = elevGrid[y0 * HW + x0];
      const e10 = elevGrid[y0 * HW + x0 + 1];
      const e01 = elevGrid[(y0 + 1) * HW + x0];
      const e11 = elevGrid[(y0 + 1) * HW + x0 + 1];
      return (e00 * (1 - dx) + e10 * dx) * (1 - dy) + (e01 * (1 - dx) + e11 * dx) * dy;
    }

    for (let py = 0; py < H; py++) {
      const v = py / (H - 1);
      const lat = BOUNDS.north - v * (BOUNDS.north - BOUNDS.south);
      for (let px = 0; px < W; px++) {
        const u = px / (W - 1);
        const lng = BOUNDS.west + u * (BOUNDS.east - BOUNDS.west);
        const idx = (py * W + px) * 4;

        const f = computeField(lng, lat);
        if (f.elev <= 0.05) {
          natData[idx + 3] = 0;
          elvData[idx + 3] = 0;
          rghData[idx] = rghData[idx + 1] = rghData[idx + 2] = 220;
          rghData[idx + 3] = 255;
          continue;
        }

        const stepU = 1.0 / HW;
        const stepV = 1.0 / HH;
        const eL = sampleDemBilinear(u - stepU, v);
        const eR = sampleDemBilinear(u + stepU, v);
        const eU = sampleDemBilinear(u, v - stepV);
        const eD = sampleDemBilinear(u, v + stepV);
        const slope = Math.hypot((eR - eL) / 180.0, (eD - eU) / 100.0);

        const texN1 = fbm(u * 64.0 + 2.3, v * 64.0 + 8.1, 3);
        const texN2 = smoothNoise(u * 210.0, v * 210.0);

        let nr = 46, ng = 84, nb = 50;
        let roughVal = 212;

        if (f.isLake) {
          // Deep emerald-jade Chungjuho / Cheongpungho lake & crisp blue-jade Namhangang water
          const depthT = Math.min(1, f.waterDepth / 24.0);
          const ripple = (texN2 - 0.5) * 8.0;
          if (lng < 127.9926) {
            // Downstream Namhangang + whitewater spillway tailrace foam near Chungju Dam
            const dTailrace = Math.hypot((lng - 127.9905) * KM_PER_DEG_LNG, (lat - 37.0016) * KM_PER_DEG_LAT);
            const foam = Math.max(0, 1.0 - dTailrace / 0.45) * (0.55 + 0.45 * texN2);
            nr = 24 + (1 - depthT) * 28 + foam * 185 + ripple;
            ng = 86 + (1 - depthT) * 38 + foam * 155 + ripple;
            nb = 112 + (1 - depthT) * 32 + foam * 130 + ripple;
            roughVal = foam > 0.25 ? 130 : 48;
          } else {
            // Chungjuho / Danyang Namhangang emerald-jade reservoir water
            nr = 15 + (1 - depthT) * 34 + ripple * 0.6;
            ng = 78 + (1 - depthT) * 48 + ripple * 0.8;
            nb = 94 + (1 - depthT) * 42 + ripple * 0.8;
            roughVal = 42;
          }
        } else if (f.isStream) {
          // Seonam Valley (Haseonam/Jungseonam/Sangseonam) & Sainam white granite boulders + crystal jade pools
          const boulderMix = smoothstep(0.42, 0.72, texN2);
          nr = 52 * (1 - boulderMix) + 216 * boulderMix;
          ng = 132 * (1 - boulderMix) + 214 * boulderMix;
          nb = 138 * (1 - boulderMix) + 206 * boulderMix;
          roughVal = boulderMix > 0.5 ? 168 : 58;
        } else {
          // Forested Baekdudaegan slopes with Danyang/Chungju autumn foliage accents & exposed limestone/granite cliffs
          const elevM = f.elev;
          // Rich temperate Korean pine + oak forest base
          nr = 44 + texN1 * 24 + (texN2 - 0.5) * 14;
          ng = 78 + texN1 * 30 + (texN2 - 0.5) * 16;
          nb = 44 + texN1 * 16 + (texN2 - 0.5) * 10;

          // Warm autumn maple & ginkgo accents along Danyang gorges, Gudambong, Oksunbong & Seonam Valley (180m - 680m)
          const autumnBand = smoothstep(165, 260, elevM) * (1.0 - smoothstep(560, 760, elevM));
          const autumnPatch = smoothstep(0.56, 0.80, fbm(u * 42.0 + 9.4, v * 42.0 + 3.7, 3)) * autumnBand;
          if (autumnPatch > 0.02) {
            const isCrimson = texN2 > 0.58;
            const ar = isCrimson ? 158 : 182;
            const ag = isCrimson ? 68 : 118;
            const ab = isCrimson ? 42 : 44;
            nr = nr * (1 - autumnPatch * 0.72) + ar * (autumnPatch * 0.72);
            ng = ng * (1 - autumnPatch * 0.72) + ag * (autumnPatch * 0.72);
            nb = nb * (1 - autumnPatch * 0.72) + ab * (autumnPatch * 0.72);
          }

          // Woraksan Yeongbong & Doraksan pale granite crags + Gudambong/Oksunbong/Sainam sheer rock faces
          // Suppress artificial border-taper slope from turning pale grey along the outer plinth rim
          const interiorSlopeMask = smoothstep(1.05, 1.85, f.dEdgeKm);
          const dWorak = Math.hypot((lng - 128.1060) * KM_PER_DEG_LNG, (lat - 36.8865) * KM_PER_DEG_LAT);
          const worakCrag = dWorak < 2.6 && elevM > 760 ? smoothstep(760, 980, elevM) * 0.72 * interiorSlopeMask : 0;
          const rockMix = Math.min(1.0, Math.max(f.cliffFactor * 0.88, smoothstep(0.68, 1.38, slope) * 0.78 * interiorSlopeMask, worakCrag));
          if (rockMix > 0.03) {
            const rockTone = 156 + (texN2 - 0.5) * 34;
            nr = nr * (1 - rockMix) + (rockTone + 6) * rockMix;
            ng = ng * (1 - rockMix) + (rockTone + 2) * rockMix;
            nb = nb * (1 - rockMix) + (rockTone - 6) * rockMix;
            roughVal = 178;
          }

          // Clean museum-plinth dark slate geological cut-edge along the outer 1.05 km taper
          if (f.dEdgeKm < 1.05) {
            const plinthMix = (1.0 - smoothstep(0.18, 1.05, f.dEdgeKm)) * 0.85;
            nr = nr * (1 - plinthMix) + 49 * plinthMix;
            ng = ng * (1 - plinthMix) + 60 * plinthMix;
            nb = nb * (1 - plinthMix) + 64 * plinthMix;
            roughVal = 215;
          }

          // Sobaeksan Birobong high subalpine wind-swept meadow (철쭉·초원 능선 above 1,180m)
          if (elevM > 1150) {
            const alpineT = smoothstep(1150, 1360, elevM) * 0.65;
            nr = nr * (1 - alpineT) + (116 + texN2 * 22) * alpineT;
            ng = ng * (1 - alpineT) + (128 + texN2 * 20) * alpineT;
            nb = nb * (1 - alpineT) + (78 + texN2 * 14) * alpineT;
          }

          // Danyang lakeside town & Cheongpung / Chungju Dam plaza subtle urban grid
          const dDanyangTown = Math.hypot((lng - 128.3685) * KM_PER_DEG_LNG, (lat - 36.9845) * KM_PER_DEG_LAT);
          if (dDanyangTown < 0.95 && elevM < 185 && slope < 0.38) {
            const townT = (1.0 - smoothstep(0.35, 0.95, dDanyangTown)) * 0.65;
            const blockTex = ((Math.floor(u * 520) + Math.floor(v * 520)) % 3 === 0) ? 196 : 162;
            nr = nr * (1 - townT) + blockTex * townT;
            ng = ng * (1 - townT) + (blockTex - 4) * townT;
            nb = nb * (1 - townT) + (blockTex - 8) * townT;
            roughVal = 165;
          }

          // Clean warm limestone/sand bank rim along Chungjuho drawdown zone (141m - 148m)
          if (elevM >= 141.0 && elevM < 147.2 && lng >= 127.9926) {
            const drawdownT = (1.0 - smoothstep(141.2, 147.2, elevM)) * 0.48;
            nr = nr * (1 - drawdownT) + 178 * drawdownT;
            ng = ng * (1 - drawdownT) + 166 * drawdownT;
            nb = nb * (1 - drawdownT) + 144 * drawdownT;
          }
        }

        // Subtle directional relief shading baked lightly to complement Three.js PBR normal map
        const sunShade = 1.0 + Math.max(-0.18, Math.min(0.18, ((eL - eR) * 0.0035 + (eU - eD) * 0.0035)));
        natData[idx] = Math.max(0, Math.min(255, Math.round(nr * sunShade)));
        natData[idx + 1] = Math.max(0, Math.min(255, Math.round(ng * sunShade)));
        natData[idx + 2] = Math.max(0, Math.min(255, Math.round(nb * sunShade)));
        natData[idx + 3] = Math.round(255 * smoothstep(0.0, 0.15, f.edgeFade));

        // Hypsometric Elevation Map + 100m Contour Lines
        let er = 60, eg = 140, eb = 90;
        if (f.isLake || f.isStream) {
          er = 26; eg = 118; eb = 156;
        } else if (f.elev < 250) {
          const t = (f.elev - 65) / 185;
          er = 74 + t * 56; eg = 158 + t * 28; eb = 92 - t * 12;
        } else if (f.elev < 650) {
          const t = (f.elev - 250) / 400;
          er = 130 + t * 82; eg = 186 - t * 22; eb = 80 - t * 14;
        } else if (f.elev < 1050) {
          const t = (f.elev - 650) / 400;
          er = 212 - t * 22; eg = 164 - t * 56; eb = 66 - t * 12;
        } else {
          const t = Math.min(1, (f.elev - 1050) / 400);
          er = 190 + t * 44; eg = 108 + t * 92; eb = 54 + t * 136;
        }

        const contourRem = Math.abs((f.elev % 100) - 50);
        const isContour = !f.isLake && contourRem > 46.8;
        if (isContour) {
          er *= 0.72; eg *= 0.72; eb *= 0.72;
        }
        elvData[idx] = Math.max(0, Math.min(255, Math.round(er * sunShade)));
        elvData[idx + 1] = Math.max(0, Math.min(255, Math.round(eg * sunShade)));
        elvData[idx + 2] = Math.max(0, Math.min(255, Math.round(eb * sunShade)));
        elvData[idx + 3] = natData[idx + 3];

        rghData[idx] = roughVal;
        rghData[idx + 1] = roughVal;
        rghData[idx + 2] = roughVal;
        rghData[idx + 3] = 255;
      }
    }

    natCtx.putImageData(natImg, 0, 0);
    elvCtx.putImageData(elvImg, 0, 0);
    rghCtx.putImageData(rghImg, 0, 0);

    // 3. Generate 1024x1024 Tangent-Space Normal Map from DEM + micro-cliff detail
    const NW = 1024, NH = 1024;
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = NW;
    normalCanvas.height = NH;
    const nrmCtx = normalCanvas.getContext('2d');
    const nrmImg = nrmCtx.createImageData(NW, NH);
    const nrmData = nrmImg.data;

    for (let y = 0; y < NH; y++) {
      const v = y / (NH - 1);
      for (let x = 0; x < NW; x++) {
        const u = x / (NW - 1);
        const du = 1.0 / NW;
        const dv = 1.0 / NH;
        const hL = sampleDemBilinear(u - du, v);
        const hR = sampleDemBilinear(u + du, v);
        const hU = sampleDemBilinear(u, v - dv);
        const hD = sampleDemBilinear(u, v + dv);

        const microX = (smoothNoise(u * 260 + 0.5, v * 260) - smoothNoise(u * 260 - 0.5, v * 260)) * 0.25;
        const microY = (smoothNoise(u * 260, v * 260 + 0.5) - smoothNoise(u * 260, v * 260 - 0.5)) * 0.25;

        let nx = -(hR - hL) * 0.028 - microX;
        let ny = (hD - hU) * 0.045 - microY;
        let nz = 1.0;
        const len = Math.hypot(nx, ny, nz) || 1.0;
        nx /= len; ny /= len; nz /= len;

        const idx = (y * NW + x) * 4;
        nrmData[idx] = Math.round((nx * 0.5 + 0.5) * 255);
        nrmData[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        nrmData[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        nrmData[idx + 3] = 255;
      }
    }
    nrmCtx.putImageData(nrmImg, 0, 0);

    return {
      heightCanvas,
      naturalCanvas,
      elevationCanvas,
      normalCanvas,
      roughnessCanvas
    };
  }

  window.DANYANG_BOUNDS = BOUNDS;
  window.DANYANG_OUTLINE = DANYANG_OUTLINE;
  window.DANYANG_ROADS = DANYANG_ROADS;
  window.DANYANG_PRESETS = DANYANG_PRESETS;
  window.inDanyangLand = inDanyangLand;
  window.createDanyangAssets = createDanyangAssets;
})();
