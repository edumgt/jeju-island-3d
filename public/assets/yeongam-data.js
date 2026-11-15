// Jeollanam-do Yeongam Korea International Circuit (KIC) Sports Car Track & Coastal Terrain Generator
// Covers the 5.615km F1/GT Grand Prix Circuit, Permanent Loop, Karting Track, Pit/Grandstands,
// Yeongsanho Waterfront Marina, Samho Peninsula, and Eunjeoksan / Wolchulsan Mountain Backdrop.
(() => {
  'use strict';

  const BOUNDS = {
    west: 126.382,
    south: 34.712,
    east: 126.498,
    north: 34.782
  };

  // Samho Peninsula & Yeongsanho / Yeongamho shoreline + eastern foothill horizon (lng, lat)
  const YEONGAM_OUTLINE = [
    // Western seawall & Yeongam Bay coast (south -> north)
    [126.3920, 34.7250],
    [126.3905, 34.7350],
    [126.3925, 34.7460],
    [126.3975, 34.7565],
    [126.4055, 34.7655],
    [126.4170, 34.7725], // Samho North Cape
    [126.4320, 34.7755],
    [126.4490, 34.7765], // Yeongsanho Estuary Seawall
    [126.4690, 34.7770],
    [126.4900, 34.7765],
    // Eastern inland mountain backdrop (Eunjeoksan / Wolchulsan foothills)
    [126.4925, 34.7620],
    [126.4930, 34.7450],
    [126.4920, 34.7280],
    [126.4895, 34.7175],
    // Southern Yeongamho Lake & Marina waterfront coast
    [126.4720, 34.7170],
    [126.4530, 34.7185],
    [126.4360, 34.7215],
    [126.4255, 34.7252], // East Marina headland
    [126.4180, 34.7276], // KIC Marina Lagoon cove
    [126.4105, 34.7268],
    [126.4005, 34.7245],
    [126.3920, 34.7250]
  ];

  // Korea International Circuit (KIC) 5.615 km 18-turn Grand Prix loop [lat, lng]
  const KIC_GP_LOOP = [
    [34.7366, 126.4122], // Start/Finish Grid
    [34.7376, 126.4152], // Main Straight mid
    [34.7386, 126.4186], // Main Straight braking zone
    [34.7393, 126.4202], // Turn 1 Hairpin apex
    [34.7401, 126.4192], // Turn 2 exit onto 1.2km Back Straight
    [34.7412, 126.4136], // 1.2km Straight mid
    [34.7426, 126.4062], // Turn 3 braking zone
    [34.7427, 126.4046], // Turn 3 Hairpin apex
    [34.7412, 126.4049], // Turn 4 entry
    [34.7400, 126.4070], // Turn 4-5 S-curve
    [34.7407, 126.4098], // Turn 5 apex
    [34.7395, 126.4124], // Turn 6 sweeper
    [34.7386, 126.4152], // Turn 7 high-speed kink
    [34.7372, 126.4176], // Turn 8 entry
    [34.7358, 126.4204], // Turn 9 stadium approach
    [34.7346, 126.4232], // Turn 10 tight bend
    [34.7327, 126.4242], // Turn 11 Marina East hairpin
    [34.7310, 126.4222], // Turn 12 Marina Waterfront straight
    [34.7308, 126.4184], // Turn 13 Harbor sweep
    [34.7324, 126.4154], // Turn 14 Paddock chicane
    [34.7312, 126.4116], // Turn 15 Marina West bend
    [34.7322, 126.4084], // Turn 16 South hairpin
    [34.7344, 126.4088], // Turn 17 sweeping double-apex
    [34.7357, 126.4102], // Turn 18 final corner exit
    [34.7366, 126.4122]  // Close loop back to Start/Finish
  ];

  // Permanent Short Circuit Connector (Infield shortcut)
  const KIC_SHORT_CONNECTOR = [
    [34.7404, 126.4158],
    [34.7385, 126.4140],
    [34.7369, 126.4130]
  ];

  // Pit Lane parallel to Main Straight
  const KIC_PIT_LANE = [
    [34.7358, 126.4120],
    [34.7367, 126.4152],
    [34.7378, 126.4186],
    [34.7387, 126.4196]
  ];

  // KIC Karting & Driving Experience Track
  const KIC_KART_TRACK = [
    [34.7340, 126.4046],
    [34.7346, 126.4066],
    [34.7332, 126.4070],
    [34.7324, 126.4052],
    [34.7330, 126.4040],
    [34.7340, 126.4046]
  ];

  const YEONGAM_ROADS = [
    // F1-ro Expressway / Circuit Perimeter Access Road
    {
      name: '에프원로 (영암 서킷 진입로)',
      type: 'motorway',
      points: [
        [34.7695, 126.4580],
        [34.7610, 126.4420],
        [34.7505, 126.4295],
        [34.7418, 126.4235],
        [34.7345, 126.4265],
        [34.7275, 126.4325]
      ]
    },
    // Daebul Waterfront Boulevard (Coastal Scenic Drive along Samho Marina)
    {
      name: '대불산단·영암호 해안도로',
      type: 'primary',
      points: [
        [34.7268, 126.3945],
        [34.7285, 126.4080],
        [34.7286, 126.4210],
        [34.7255, 126.4360],
        [34.7222, 126.4540],
        [34.7210, 126.4760]
      ]
    },
    // Samho Coastal Perimeter Avenue
    {
      name: '삼호 중앙대로',
      type: 'trunk',
      points: [
        [34.7660, 126.4125],
        [34.7560, 126.4210],
        [34.7490, 126.4340],
        [34.7440, 126.4530],
        [34.7420, 126.4760]
      ]
    }
  ];

  // Top 3 spatially separated presets so initial labels frame the track cleanly
  const YEONGAM_PRESETS = [
    { id: 'kic_grandstand', name: 'KIC 메인 그랜드스탠드', category: '서킷·관람석', icon: '🏁', lat: 34.7376, lng: 126.4152 },
    { id: 'kic_marina', name: 'KIC 마리나 워터프론트 코너', category: '레이싱 코스', icon: '🏎', lat: 34.7310, lng: 126.4222 },
    { id: 'yeongsanho_bay', name: '은적산·영암호 전망능선', category: '자연·전망', icon: '⛰', lat: 34.7520, lng: 126.4765 },
    { id: 'kic_paddock', name: '피트 빌딩 · 레이스 컨트롤', category: '패독·타워', icon: '🗼', lat: 34.7364, lng: 126.4162 },
    { id: 'kic_turn3', name: '1.2km 직선 · 턴3 헤어핀', category: '추월 구간', icon: '⚡', lat: 34.7426, lng: 126.4052 },
    { id: 'kic_kart', name: 'KIC 카트 경기장 · 드라이빙센터', category: '체험·카트', icon: '🛞', lat: 34.7334, lng: 126.4055 },
    { id: 'samho_marina', name: '영암호 요트 마리나항', category: '항구·바다', icon: '⛵', lat: 34.7276, lng: 126.4155 },
    { id: 'yeongsan_estuary', name: '영산강 하구둑 · 수변공원', category: '방조제·도로', icon: '🌉', lat: 34.7740, lng: 126.4530 },
    { id: 'samho_cape', name: '삼호 서해 전망 곶', category: '해안 풍경', icon: '🌊', lat: 34.7640, lng: 126.4050 }
  ];

  function inYeongamLand(lng, lat) {
    let inside = false;
    for (let i = 0, j = YEONGAM_OUTLINE.length - 1; i < YEONGAM_OUTLINE.length; j = i++) {
      const [xi, yi] = YEONGAM_OUTLINE[i];
      const [xj, yj] = YEONGAM_OUTLINE[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  function createYeongamAssets() {
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
        freq *= 2.04;
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
        freq *= 2.1;
      }
      return sum;
    }

    function distKm(lat1, lng1, lat2, lng2) {
      return Math.hypot((lat1 - lat2) * 111.1, (lng1 - lng2) * 91.2);
    }

    function distToPolylineKm(lat, lng, pts) {
      const x = (lng - BOUNDS.west) * 91.2;
      const y = (lat - BOUNDS.south) * 111.1;
      let minDist = Infinity;
      for (let i = 0; i < pts.length - 1; i++) {
        const x1 = (pts[i][1] - BOUNDS.west) * 91.2;
        const y1 = (pts[i][0] - BOUNDS.south) * 111.1;
        const x2 = (pts[i + 1][1] - BOUNDS.west) * 91.2;
        const y2 = (pts[i + 1][0] - BOUNDS.south) * 111.1;
        const dx = x2 - x1, dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lenSq));
        const d = Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
        if (d < minDist) minDist = d;
      }
      return minDist;
    }

    // Build 2048x2048 high-res land mask
    const fullMaskCanvas = document.createElement('canvas');
    fullMaskCanvas.width = W;
    fullMaskCanvas.height = H;
    const fmCtx = fullMaskCanvas.getContext('2d', { willReadFrequently: true });
    fmCtx.beginPath();
    YEONGAM_OUTLINE.forEach(([lng, lat], i) => {
      const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
      const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;
      if (i === 0) fmCtx.moveTo(x, y);
      else fmCtx.lineTo(x, y);
    });
    fmCtx.closePath();
    fmCtx.fillStyle = '#ffffff';
    fmCtx.fill();
    const fullMaskPixels = fmCtx.getImageData(0, 0, W, H).data;

    // 512x512 DEM mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = HW;
    maskCanvas.height = HH;
    const mCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    mCtx.beginPath();
    YEONGAM_OUTLINE.forEach(([lng, lat], i) => {
      const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * HW;
      const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * HH;
      if (i === 0) mCtx.moveTo(x, y);
      else mCtx.lineTo(x, y);
    });
    mCtx.closePath();
    mCtx.fillStyle = '#ffffff';
    mCtx.fill();
    const maskPixels = mCtx.getImageData(0, 0, HW, HH).data;

    // Paint Track Surface & Runoff Feature Layer on an offscreen 2048x2048 canvas for crisp anti-aliased motorsport asphalt
    const trackOverlayCanvas = document.createElement('canvas');
    trackOverlayCanvas.width = W;
    trackOverlayCanvas.height = H;
    const tCtx = trackOverlayCanvas.getContext('2d', { willReadFrequently: true });

    function toPx(lat, lng) {
      return [
        ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W,
        ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H
      ];
    }

    function strokeTrackPath(pts, widthPx, color, closed, dashed) {
      tCtx.save();
      tCtx.beginPath();
      pts.forEach(([lat, lng], idx) => {
        const [x, y] = toPx(lat, lng);
        if (idx === 0) tCtx.moveTo(x, y);
        else tCtx.lineTo(x, y);
      });
      if (closed) tCtx.closePath();
      tCtx.lineCap = 'round';
      tCtx.lineJoin = 'round';
      tCtx.lineWidth = widthPx;
      tCtx.strokeStyle = color;
      if (dashed) tCtx.setLineDash(dashed);
      tCtx.stroke();
      tCtx.restore();
    }

    // 1. FIA painted turquoise-blue & red runoff aprons around key corners
    strokeTrackPath(KIC_GP_LOOP, 28, 'rgba(37, 99, 235, 0.90)', true);
    strokeTrackPath(KIC_GP_LOOP, 22, 'rgba(218, 206, 188, 0.96)', true); // Gravel safety trap border
    // 2. Red-white FIA apex kerbs base
    strokeTrackPath(KIC_GP_LOOP, 15, '#dc2626', true);
    strokeTrackPath(KIC_GP_LOOP, 15, '#f8fafc', true, [7, 7]);
    // 3. Main F1 asphalt surface + Short Connector + Kart Track + Pit Apron
    strokeTrackPath(KIC_SHORT_CONNECTOR, 14, '#cbd5e1', false);
    strokeTrackPath(KIC_SHORT_CONNECTOR, 10, '#2a3038', false);
    strokeTrackPath(KIC_KART_TRACK, 10, '#e2e8f0', true);
    strokeTrackPath(KIC_KART_TRACK, 7, '#334155', true);
    strokeTrackPath(KIC_GP_LOOP, 11.5, '#252a32', true);
    strokeTrackPath(KIC_PIT_LANE, 13, '#3b424d', false);
    // 4. Crisp white track racing edge lines & start/finish grid marker
    strokeTrackPath(KIC_GP_LOOP, 1.5, 'rgba(255,255,255,0.65)', true);
    const trackPixels = tCtx.getImageData(0, 0, W, H).data;

    // Geological Elevation Model (meters, max ~820m at eastern Wolchulsan/Eunjeoksan backdrop)
    function calculateElevation(lat, lng) {
      const nX = (lng - BOUNDS.west) * 32;
      const nY = (lat - BOUNDS.south) * 32;
      const ridgeDetail = ridgedFbm(nX * 0.65 + 2.4, nY * 0.65 + 1.1, 4);
      const valleyFbm = fbm(nX * 1.1, nY * 1.1, 3);

      // Reclaimed Samho plain base (~8.5m)
      let h = 8.5 + valleyFbm * 4.5;

      // Circuit Complex flat engineered terrace (9.2m) around KIC center [34.7365, 126.4145]
      const dCircuit = distKm(lat, lng, 34.7365, 126.4145);
      const dTrack = distToPolylineKm(lat, lng, KIC_GP_LOOP);
      const dKart = distToPolylineKm(lat, lng, KIC_KART_TRACK);

      // Gentle Samho rolling pine hills in NW Samho Cape
      const dSamhoHill = distKm(lat, lng, 34.7600, 126.4125);
      if (dSamhoHill < 1.8) {
        const f = Math.max(0, 1 - dSamhoHill / 1.8);
        h = Math.max(h, 12 + 125 * Math.pow(f, 1.65) * (0.72 + ridgeDetail * 0.36));
      }

      // Central-North Green Park Ridge behind KIC Back Straight (viewing grandstand hill)
      const dNorthRidge = distKm(lat, lng, 34.7560, 126.4320);
      if (dNorthRidge < 2.2) {
        const f = Math.max(0, 1 - dNorthRidge / 2.2);
        h = Math.max(h, 14 + 175 * Math.pow(f, 1.55) * (0.70 + ridgeDetail * 0.38));
      }

      // Dramatic Eastern Mountain Backdrop: Eunjeoksan (389m) & Wolchulsan rocky silhouette ridge (up to 760m!)
      let peak = 0;
      const dEunjeok = distKm(lat, lng, 34.7520, 126.4765);
      if (dEunjeok < 3.4) {
        const f = Math.max(0, 1 - dEunjeok / 3.4);
        peak = Math.max(peak, 490 * Math.pow(f, 1.48) * (0.74 + ridgeDetail * 0.34));
      }
      const dWolchulNorth = distKm(lat, lng, 34.7660, 126.4840);
      if (dWolchulNorth < 2.8) {
        const f = Math.max(0, 1 - dWolchulNorth / 2.8);
        peak = Math.max(peak, 680 * Math.pow(f, 1.42) * (0.76 + ridgeDetail * 0.34));
      }
      const dWolchulSouth = distKm(lat, lng, 34.7350, 126.4810);
      if (dWolchulSouth < 3.0) {
        const f = Math.max(0, 1 - dWolchulSouth / 3.0);
        peak = Math.max(peak, 560 * Math.pow(f, 1.45) * (0.74 + ridgeDetail * 0.34));
      }
      h = Math.max(h, peak);

      // Strictly level the entire Motorsport Circuit Platform (9.2m) so track & buildings sit level
      if (dCircuit < 1.35 || dTrack < 0.28 || dKart < 0.18) {
        const padDist = Math.min(dTrack, dKart);
        const flatBlend = dCircuit < 1.05 || padDist < 0.16
          ? 0
          : Math.min(1, Math.max(0, (Math.min(dCircuit - 1.05, padDist - 0.16)) / 0.25));
        h = 9.2 + (h - 9.2) * flatBlend;
      }

      // Keep Marina Waterfront seawall level (~4.5m)
      const dMarina = distKm(lat, lng, 34.7276, 126.4160);
      if (dMarina < 0.35) h = Math.min(h, 5.2);

      // Smooth eastern inland boundary taper (1.1km) to avoid vertical cliff edge
      const dEastKm = (126.493 - lng) * 91.2;
      if (dEastKm < 1.1) {
        const t = Math.max(0, Math.min(1, dEastKm / 1.1));
        h *= (0.5 - 0.5 * Math.cos(Math.PI * t));
      }

      return Math.max(0, Math.min(820, h));
    }

    // 1. Build 512x512 DEM heightCanvas (maxMeters = 850)
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

        const val = Math.min(255, Math.floor((e / 850) * 255));
        hData[idx] = val;
        hData[idx + 1] = val;
        hData[idx + 2] = val;
        hData[idx + 3] = inLand ? 255 : 0;
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // 2. Two-pass Chamfer coastline distance transform
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

    // 3. Build 2048x2048 PBR maps
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

        if (fullMaskPixels[idx + 3] <= 64) {
          nData[idx + 3] = 0;
          eData[idx + 3] = 0;
          nmData[idx + 3] = 0;
          rgData[idx] = 52; rgData[idx + 1] = 52; rgData[idx + 2] = 52; rgData[idx + 3] = 255;
          continue;
        }

        const elev = sampleElevation(px, py);
        const cDist = coastDist[pIdx];

        const xPrev = sampleElevation(px - 3, py);
        const xNext = sampleElevation(px + 3, py);
        const yPrev = sampleElevation(px, py - 3);
        const yNext = sampleElevation(px, py + 3);
        const microBumpX = (pseudoNoise(px + 1, py) - pseudoNoise(px - 1, py)) * 0.03;
        const microBumpY = (pseudoNoise(px, py + 1) - pseudoNoise(px, py - 1)) * 0.03;

        const dzdx = (xNext - xPrev) * 0.042 + microBumpX;
        const dzdy = (yNext - yPrev) * 0.042 + microBumpY;
        const nx = -dzdx, ny = -dzdy, nz = 1.0;
        const nLen = Math.hypot(nx, ny, nz);
        const nnx = nx / nLen, nny = ny / nLen, nnz = nz / nLen;

        nmData[idx] = Math.round((nnx * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.round((nny * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.round((nnz * 0.5 + 0.5) * 255);
        nmData[idx + 3] = 255;

        const dot = nnx * lx + nny * ly + nnz * lz;
        const slope = Math.hypot((xNext - xPrev) * 0.042, (yNext - yPrev) * 0.042);
        const shade = Math.min(1.32, Math.max(0.45, 0.58 + 0.55 * dot));

        const microNoise = fbm(px * 0.065, py * 0.065, 3);
        const medNoise = fbm(px * 0.018, py * 0.018, 2);
        const grain = pseudoNoise(px, py);

        const dCircuitCenter = distKm(lat, lng, 34.7365, 126.4145);
        const tAlpha = trackPixels[idx + 3] / 255;

        let r = 82, g = 132, b = 66;
        let roughVal = 215;

        // 2. Circuit grounds & manicured infield turf (smoothly blended along irregular park perimeter)
        const turfBlend = Math.max(0, Math.min(1, (1.38 + (medNoise - 0.5) * 0.35 - dCircuitCenter) / 0.32));
        // 3. Base Jeollanam-do coastal plains, Samho pine hills & Wolchulsan granite ridges
        const elevNorm = Math.min(1, elev / 760);
        const canopy = medNoise * 0.55 + microNoise * 0.45;
        let fr = 72 + canopy * 34 - elevNorm * 18 + grain * 6;
        let fg = 122 + canopy * 30 - elevNorm * 28 + grain * 6;
        let fb = 60 + canopy * 18 - elevNorm * 10 + grain * 4;

        // Fine reclaimed agricultural paddy/field texture on low flat Samho plains (< 20m)
        if (elev < 20 && turfBlend < 0.99) {
          const gx = px * 0.22;
          const gy = py * 0.22;
          const subX = gx - Math.floor(gx);
          const subY = gy - Math.floor(gy);
          const cellHash = pseudoNoise(Math.floor(gx), Math.floor(gy));
          const plainMix = Math.max(0, Math.min(1, (20 - elev) / 8)) * (1 - turfBlend);
          let pr, pg, pb;
          if (subX < 0.08 || subY < 0.08) {
            pr = 126; pg = 136; pb = 112;
          } else {
            pr = 92 + cellHash * 16 + microNoise * 12;
            pg = 138 + cellHash * 14 + microNoise * 14;
            pb = 74 + cellHash * 10 + microNoise * 8;
          }
          fr = fr * (1 - plainMix) + pr * plainMix;
          fg = fg * (1 - plainMix) + pg * plainMix;
          fb = fb * (1 - plainMix) + pb * plainMix;
        }

        // Exposed rocky Wolchulsan granite peaks on steep slopes & high elevations
        const rockTrigger = slope * 0.72 + Math.max(0, elev - 240) / 310 + (microNoise - 0.5) * 0.26;
        const rockMix = Math.max(0, Math.min(1, (rockTrigger - 0.48) * 2.5));
        if (rockMix > 0.01) {
          const tone = 148 + elevNorm * 64 + microNoise * 24 + grain * 8;
          fr = fr * (1 - rockMix) + Math.min(228, tone) * rockMix;
          fg = fg * (1 - rockMix) + Math.min(226, tone - 3) * rockMix;
          fb = fb * (1 - rockMix) + Math.min(230, tone + 2) * rockMix;
          roughVal = Math.round(roughVal * (1 - rockMix) + 192 * rockMix);
        }

        // Blend circuit manicured turf over base landscape
        if (turfBlend > 0.01) {
          const stripe = ((Math.floor(px / 20) + Math.floor(py / 20)) & 1) ? 1 : 0;
          let tr = 76 + stripe * 5 + microNoise * 14;
          let tg = 140 + stripe * 8 + microNoise * 16;
          let tb = 68 + microNoise * 10;

          // Paddock concrete plaza & spectator concourse behind main straight
          const dPaddock = distKm(lat, lng, 34.7358, 126.4160);
          if (dPaddock < 0.23) {
            const pBlend = Math.min(1, (0.23 - dPaddock) / 0.05);
            tr = tr * (1 - pBlend) + (182 + grain * 10) * pBlend;
            tg = tg * (1 - pBlend) + (188 + grain * 10) * pBlend;
            tb = tb * (1 - pBlend) + (194 + grain * 10) * pBlend;
            roughVal = Math.round(roughVal * (1 - pBlend) + 152 * pBlend);
          }

          fr = fr * (1 - turfBlend) + tr * turfBlend;
          fg = fg * (1 - turfBlend) + tg * turfBlend;
          fb = fb * (1 - turfBlend) + tb * turfBlend;
        }

        // 1. Seawall concrete embankment & turquoise surf along Yeongsanho / Samho coast
        if (cDist <= 10 && lng < 126.485) {
          if (cDist <= 3) {
            r = Math.floor(176 + microNoise * 32);
            g = Math.floor(216 + microNoise * 24);
            b = Math.floor(228 + microNoise * 20);
            roughVal = 78;
          } else {
            r = Math.floor(174 + grain * 14);
            g = Math.floor(178 + grain * 14);
            b = Math.floor(176 + grain * 12);
            roughVal = 175;
          }
        } else {
          r = fr; g = fg; b = fb;
        }

        // Blend crisp F1 track / runoff / kerbs / kart track texture right onto the ground
        if (tAlpha > 0.01) {
          const tr = trackPixels[idx];
          const tg = trackPixels[idx + 1];
          const tb = trackPixels[idx + 2];
          r = r * (1 - tAlpha) + tr * tAlpha;
          g = g * (1 - tAlpha) + tg * tAlpha;
          b = b * (1 - tAlpha) + tb * tAlpha;
          roughVal = Math.round(roughVal * (1 - tAlpha) + 128 * tAlpha);
        }

        nData[idx] = Math.min(255, Math.floor(r * shade));
        nData[idx + 1] = Math.min(255, Math.floor(g * shade));
        nData[idx + 2] = Math.min(255, Math.floor(b * shade));
        nData[idx + 3] = 255;

        rgData[idx] = roughVal;
        rgData[idx + 1] = roughVal;
        rgData[idx + 2] = roughVal;
        rgData[idx + 3] = 255;

        // 4. Elevation Relief Map (0m - 800m hypsometric tint + track footprint highlight)
        const ratio = Math.min(1, elev / 760);
        let er, eg, eb;
        if (tAlpha > 0.45) {
          er = 48; eg = 58; eb = 72; // Track silhouette visible in elevation mode too!
        } else if (ratio < 0.12) {
          const s = ratio / 0.12;
          er = Math.floor(78 + s * 64);
          eg = Math.floor(184 - s * 16);
          eb = Math.floor(118 - s * 48);
        } else if (ratio < 0.40) {
          const s = (ratio - 0.12) / 0.28;
          er = Math.floor(142 + s * 86);
          eg = Math.floor(168 - s * 22);
          eb = Math.floor(70 - s * 26);
        } else if (ratio < 0.72) {
          const s = (ratio - 0.40) / 0.32;
          er = Math.floor(228 - s * 18);
          eg = Math.floor(146 - s * 58);
          eb = Math.floor(44 + s * 42);
        } else {
          const s = (ratio - 0.72) / 0.28;
          er = Math.floor(210 - s * 58 + s * 78);
          eg = Math.floor(88 + s * 120);
          eb = Math.floor(86 + s * 140);
        }

        const contourMajor = Math.abs(Math.sin(elev * 0.06283));
        const contourFactor = contourMajor < 0.08 ? 0.85 : 1.0;

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

  window.YEONGAM_BOUNDS = BOUNDS;
  window.YEONGAM_OUTLINE = YEONGAM_OUTLINE;
  window.YEONGAM_ROADS = YEONGAM_ROADS;
  window.YEONGAM_CIRCUIT_TRACK = KIC_GP_LOOP;
  window.YEONGAM_PIT_LANE = KIC_PIT_LANE;
  window.YEONGAM_KART_TRACK = KIC_KART_TRACK;
  window.YEONGAM_PRESETS = YEONGAM_PRESETS;
  window.inYeongamLand = inYeongamLand;
  window.createYeongamAssets = createYeongamAssets;
})();
