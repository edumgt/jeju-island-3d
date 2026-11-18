// Jeollanam-do Yeongam Korea International Circuit (KIC) Sports Car Track & Coastal Terrain Generator
// High-fidelity depiction of Hermann Tilke's 5.615km 18-Turn FIA Grade-1 Circuit (Counter-Clockwise),
// 3.045km Permanent Loop, Pit/Paddock Complex, CIK-FIA Karting Circuit, Yeongamho Yacht Marina,
// Samho Reclaimed Peninsula, and Eunjeoksan / Wolchulsan Granite Mountain Backdrop.
(() => {
  'use strict';

  const BOUNDS = {
    west: 126.382,
    south: 34.712,
    east: 126.498,
    north: 34.782
  };

  // Samho Peninsula & Yeongsanho / Yeongamho shoreline + eastern foothill horizon (lng, lat)
  // Indices 0..9: Western Samho seawall & Northern Yeongsanho Estuary
  // Indices 10..13: Eastern inland mountain backdrop (Eunjeoksan / Wolchulsan)
  // Indices 14..21: Southern Yeongamho Lake & KIC Marina waterfront coast
  const YEONGAM_OUTLINE = [
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
    [126.4182, 34.7282], // KIC Marina Yacht Basin cove
    [126.4132, 34.7284], // Inner Marina quay right below Harbor sector
    [126.4085, 34.7266],
    [126.4005, 34.7245],
    [126.3920, 34.7250]
  ];

  // Korea International Circuit (KIC) 5.615 km 18-turn Grand Prix loop [lat, lng] (True Jordan Curve, Zero Crossings)
  const KIC_GP_LOOP = [
    [34.7358, 126.4114], // Start/Finish Straight SW entry
    [34.7372, 126.4152], // Main Straight mid (between Main Grandstand NW & Pit Garages SE)
    [34.7385, 126.4188], // Main Straight Hanok Overpass & T1 braking zone
    [34.7394, 126.4204], // Turn 1 tight left-hand corner apex
    [34.7405, 126.4195], // Turn 2 accelerating kink onto 1.2km Back Straight
    [34.7414, 126.4146], // 1.2km Straight east-mid
    [34.7422, 126.4094], // 1.2km Straight west-mid (320 km/h top-speed zone)
    [34.7428, 126.4056], // Turn 3 heavy braking zone (150m-50m boards)
    [34.7427, 126.4042], // Turn 3 Hairpin apex
    [34.7410, 126.4046], // Turn 4 90-deg left-right entry
    [34.7413, 126.4078], // Turn 5 technical crest apex
    [34.7397, 126.4096], // Turn 6 infield corner (Short-Circuit split)
    [34.7381, 126.4078], // Turn 7 high-speed Esses entry (230 km/h)
    [34.7359, 126.4080], // Turn 8 fast switchback west of Main Straight
    [34.7337, 126.4084], // Turn 9 fast sweeper descending toward Harbor
    [34.7318, 126.4102], // Turn 10 Harbor West braking corner
    [34.7322, 126.4136], // Turn 11 Harbor switchback
    [34.7308, 126.4172], // Turn 12 Marina Waterfront seawall approach
    [34.7310, 126.4222], // Turn 13 Marina East Waterfront Corner (kic_marina)
    [34.7329, 126.4240], // Turn 14 East Harbor Hairpin
    [34.7343, 126.4216], // Turn 15 Stadium South approach
    [34.7336, 126.4178], // Turn 16 South Paddock sweeper (well south of Pit Garages)
    [34.7338, 126.4138], // Turn 17 sweeping double-apex right
    [34.7346, 126.4106], // Turn 18 final corner & Pit-In split
    [34.7358, 126.4114]  // Close loop smoothly onto Main Straight
  ];

  // 3.045 km Permanent National Circuit Connector (links Turn 6 infield directly onto Main Straight start)
  const KIC_SHORT_CONNECTOR = [
    [34.7397, 126.4096],
    [34.7378, 126.4104],
    [34.7362, 126.4122]
  ];

  // Pit Lane parallel to Main Straight (Pit-In -> 24 Garages -> Pit-Out inside T1)
  const KIC_PIT_LANE = [
    [34.7351, 126.4118],
    [34.7359, 126.4138],
    [34.7368, 126.4163],
    [34.7378, 126.4190],
    [34.7390, 126.4201]
  ];

  // CIK-FIA International Karting & Driving Experience Multi-Hairpin Track
  const KIC_KART_TRACK = [
    [34.7341, 126.4040],
    [34.7348, 126.4063],
    [34.7341, 126.4069],
    [34.7335, 126.4054],
    [34.7330, 126.4067],
    [34.7322, 126.4062],
    [34.7324, 126.4042],
    [34.7332, 126.4035],
    [34.7341, 126.4040]
  ];

  const YEONGAM_ROADS = [
    // F1-ro Expressway / Circuit Main Boulevard
    {
      name: '에프원로 (영암 국제서킷 진입대로)',
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
    // Daebul Waterfront & Yeongamho Marina Scenic Drive
    {
      name: '영암호·마리나 수변해안도로',
      type: 'primary',
      points: [
        [34.7268, 126.3945],
        [34.7285, 126.4080],
        [34.7290, 126.4205],
        [34.7255, 126.4360],
        [34.7222, 126.4540],
        [34.7210, 126.4760]
      ]
    },
    // Samho Coastal Perimeter Trunk Road
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

  // Top 3 spatially separated presets frame Main Grandstand/Hanok Bridge, Marina Sector, and Wolchulsan ridge
  const YEONGAM_PRESETS = [
    { id: 'kic_grandstand', name: 'KIC 메인 그랜드스탠드 · 한옥육교', category: '서킷·상징건축', icon: '🏁', lat: 34.7374, lng: 126.4152 },
    { id: 'kic_marina', name: 'KIC 마리나 워터프론트 코너 (T11~13)', category: '하버 레이싱구간', icon: '🏎', lat: 34.7310, lng: 126.4222 },
    { id: 'yeongsanho_bay', name: '은적산 · 월출산 전망능선', category: '화강암 명산조망', icon: '⛰', lat: 34.7520, lng: 126.4765 },
    { id: 'kic_paddock', name: '피트 빌딩 · 레이스 컨트롤 타워', category: '패독·팀 개러지', icon: '🗼', lat: 34.7358, lng: 126.4160 },
    { id: 'kic_turn3', name: '1.2km 백스트레이트 · 턴3 헤어핀', category: '최고속 추월구간', icon: '⚡', lat: 34.7427, lng: 126.4046 },
    { id: 'kic_kart', name: 'KIC 국제 카트장 · 드라이빙센터', category: 'CIK-FIA 카트트랙', icon: '🛞', lat: 34.7335, lng: 126.4052 },
    { id: 'samho_marina', name: '영암호 요트 마리나 계류장', category: '수변 요트항', icon: '⛵', lat: 34.7280, lng: 126.4158 },
    { id: 'yeongsan_estuary', name: '영산강 하구둑 · 수변공원', category: '방조제·전망', icon: '🌉', lat: 34.7740, lng: 126.4530 },
    { id: 'samho_cape', name: '삼호 서해 해안 전망곶', category: '해안 풍경', icon: '🌊', lat: 34.7640, lng: 126.4050 }
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

  // Evaluate closed Catmull-Rom spline matching Three.js CatmullRomCurve3(tension=0.35)
  function sampleClosedSpline(rawLoop, samples) {
    const pts = rawLoop.length > 2 ? rawLoop.slice(0, -1) : rawLoop.slice();
    const n = pts.length;
    const out = [];
    const tension = 0.35;
    for (let s = 0; s <= samples; s++) {
      const u = (s / samples) * n;
      const idx = Math.floor(u) % n;
      const t = u - Math.floor(u);
      const p0 = pts[(idx - 1 + n) % n];
      const p1 = pts[idx];
      const p2 = pts[(idx + 1) % n];
      const p3 = pts[(idx + 2) % n];

      const t2 = t * t;
      const t3 = t2 * t;
      const m1Lat = tension * (p2[0] - p0[0]);
      const m1Lng = tension * (p2[1] - p0[1]);
      const m2Lat = tension * (p3[0] - p1[0]);
      const m2Lng = tension * (p3[1] - p1[1]);

      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;

      out.push([
        h00 * p1[0] + h10 * m1Lat + h01 * p2[0] + h11 * m2Lat,
        h00 * p1[1] + h10 * m1Lng + h01 * p2[1] + h11 * m2Lng
      ]);
    }
    return out;
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

    const smoothTrackPts = sampleClosedSpline(KIC_GP_LOOP, 320);
    const smoothKartPts = sampleClosedSpline(KIC_KART_TRACK, 120);

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

    // Offscreen 2048x2048 FIA Grade-1 Motorsport Surface & Paddock Apron Layer
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

    function strokeTrackPath(pts, widthPx, color, closed, dashed, lineCap) {
      tCtx.save();
      tCtx.beginPath();
      pts.forEach(([lat, lng], idx) => {
        const [x, y] = toPx(lat, lng);
        if (idx === 0) tCtx.moveTo(x, y);
        else tCtx.lineTo(x, y);
      });
      if (closed) tCtx.closePath();
      tCtx.lineCap = lineCap || 'round';
      tCtx.lineJoin = 'round';
      tCtx.lineWidth = widthPx;
      tCtx.strokeStyle = color;
      if (dashed) tCtx.setLineDash(dashed);
      tCtx.stroke();
      tCtx.restore();
    }

    // Helper: draw rotated rectangle in lat/lng center with heading
    function fillOrientedRect(lat, lng, lenPx, widPx, angleRad, fillStyle, strokeStyle) {
      const [cx, cy] = toPx(lat, lng);
      tCtx.save();
      tCtx.translate(cx, cy);
      tCtx.rotate(angleRad);
      tCtx.fillStyle = fillStyle;
      tCtx.fillRect(-lenPx * 0.5, -widPx * 0.5, lenPx, widPx);
      if (strokeStyle) {
        tCtx.strokeStyle = strokeStyle;
        tCtx.lineWidth = 1.4;
        tCtx.strokeRect(-lenPx * 0.5, -widPx * 0.5, lenPx, widPx);
      }
      tCtx.restore();
    }

    const [stX1, stY1] = toPx(34.7358, 126.4114);
    const [stX2, stY2] = toPx(34.7385, 126.4188);
    const mainStraightPxAngle = Math.atan2(stY2 - stY1, stX2 - stX1);

    // A. Paddock Team Compound, Spectator Concourse & Parking Aprons
    fillOrientedRect(34.7356, 126.4162, 124, 42, mainStraightPxAngle, 'rgba(190, 198, 207, 0.96)', 'rgba(100, 116, 139, 0.55)');
    for (let b = -5; b <= 5; b++) {
      const frac = b * 0.00040;
      fillOrientedRect(
        34.7353 + frac * 0.34,
        126.4163 + frac * 0.94,
        6.2,
        16,
        mainStraightPxAngle,
        'rgba(148, 163, 184, 0.68)'
      );
    }
    // Main Grandstand Rear Spectator Plaza & Parking Lots (NW of Main Straight)
    fillOrientedRect(34.7388, 126.4138, 130, 32, mainStraightPxAngle, 'rgba(203, 213, 225, 0.92)', 'rgba(148, 163, 184, 0.5)');
    fillOrientedRect(34.7400, 126.4128, 92, 22, mainStraightPxAngle, 'rgba(71, 85, 105, 0.85)', 'rgba(226, 232, 240, 0.55)');
    // Karting Paddock Apron
    fillOrientedRect(34.7345, 126.4050, 36, 17, -0.18, 'rgba(196, 204, 214, 0.92)');

    // B. Corner-Localized Smooth Silica Gravel Traps & FIA Cobalt-Blue / Crimson-Red Runoff Crescents
    const nPts = smoothTrackPts.length - 1;
    const curvatures = new Float32Array(nPts);
    const pxPts = smoothTrackPts.map(([lat, lng]) => toPx(lat, lng));
    for (let i = 0; i < nPts; i++) {
      const prev = pxPts[(i - 4 + nPts) % nPts];
      const curr = pxPts[i];
      const next = pxPts[(i + 4) % nPts];
      const v1x = curr[0] - prev[0], v1y = curr[1] - prev[1];
      const v2x = next[0] - curr[0], v2y = next[1] - curr[1];
      const l1 = Math.hypot(v1x, v1y) || 1;
      const l2 = Math.hypot(v2x, v2y) || 1;
      curvatures[i] = (v1x * v2y - v1y * v2x) / (l1 * l2);
    }

    // Helper: stroke contiguous corner-outside offset arcs (clean smooth crescents, zero spiky dots!)
    function strokeCornerOuterCrescents(minCurv, normalOffsetPx, lineWidthPx, strokeColor, dashPattern) {
      tCtx.save();
      tCtx.lineCap = 'round';
      tCtx.lineJoin = 'round';
      tCtx.lineWidth = lineWidthPx;
      tCtx.strokeStyle = strokeColor;
      if (dashPattern) tCtx.setLineDash(dashPattern);

      let inArc = false;
      let prevSign = 0;
      tCtx.beginPath();
      for (let step = 0; step <= nPts + 4; step++) {
        const i = step % nPts;
        const k = curvatures[i];
        const absK = Math.abs(k);
        const signOut = k >= 0 ? 1 : -1;
        if (absK >= minCurv && (!inArc || signOut === prevSign)) {
          const curr = pxPts[i];
          const next = pxPts[(i + 1) % nPts];
          const dx = next[0] - curr[0], dy = next[1] - curr[1];
          const segLen = Math.hypot(dx, dy) || 1;
          const ox = (dy / segLen) * signOut * normalOffsetPx;
          const oy = (-dx / segLen) * signOut * normalOffsetPx;
          if (!inArc) {
            tCtx.moveTo(curr[0] + ox, curr[1] + oy);
            inArc = true;
            prevSign = signOut;
          } else {
            tCtx.lineTo(curr[0] + ox, curr[1] + oy);
          }
        } else if (inArc) {
          tCtx.stroke();
          tCtx.beginPath();
          inArc = false;
        }
      }
      if (inArc) tCtx.stroke();
      tCtx.restore();
    }

    // 1) Smooth outer silica gravel traps on heavy braking & high-speed sweepers
    strokeCornerOuterCrescents(0.135, 19.5, 13.5, 'rgba(224, 211, 186, 0.96)', null);
    // 2) Smooth FIA Cobalt-Blue asphalt runoff apron inside the gravel traps
    strokeCornerOuterCrescents(0.085, 11.8, 9.5, 'rgba(29, 78, 216, 0.94)', null);
    // 3) Smooth FIA Crimson-Red & White high-grip painted runoff band
    strokeCornerOuterCrescents(0.095, 9.2, 3.8, 'rgba(220, 38, 38, 0.92)', [10, 7]);

    // C. Track Verge Shoulders & Corner-Only Red-White Serrated FIA Kerbs
    strokeTrackPath(smoothTrackPts, 17.5, 'rgba(71, 85, 105, 0.92)', true); // Asphalt safety shoulder
    for (let i = 0; i < nPts; i++) {
      const k = curvatures[i];
      const absK = Math.abs(k);
      // Check nearby exit curvature too so exit kerbs extend slightly onto corner exits
      const prevK = Math.abs(curvatures[(i - 5 + nPts) % nPts]);
      if (absK < 0.075 && prevK < 0.12) continue;
      const pA = pxPts[i];
      const pB = pxPts[(i + 1) % nPts];
      const dx = pB[0] - pA[0], dy = pB[1] - pA[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const isWhite = (i & 1) === 0;
      const kerbColor = isWhite ? '#f8fafc' : '#dc2626';

      // Inside apex kerb + outside exit kerb
      [-6.8, 6.8].forEach((offsetPx) => {
        tCtx.strokeStyle = kerbColor;
        tCtx.lineWidth = 2.8;
        tCtx.beginPath();
        tCtx.moveTo(pA[0] + nx * offsetPx, pA[1] + ny * offsetPx);
        tCtx.lineTo(pB[0] + nx * offsetPx, pB[1] + ny * offsetPx);
        tCtx.stroke();
      });
    }

    // D. Secondary Tracks: Permanent Short-Circuit Connector, CIK-FIA Karting Loop & Pit Lane
    strokeTrackPath(KIC_SHORT_CONNECTOR, 14.5, '#64748b', false, null, 'butt');
    strokeTrackPath(KIC_SHORT_CONNECTOR, 10.5, '#272d36', false, null, 'butt');

    strokeTrackPath(smoothKartPts, 10.5, '#2563eb', true);
    strokeTrackPath(smoothKartPts, 8.2, '#dc2626', true, [4, 4]);
    strokeTrackPath(smoothKartPts, 6.4, '#2d3540', true);

    // Pit lane fast lane (cobalt blue edge) + pit apron
    strokeTrackPath(KIC_PIT_LANE, 12.5, '#1d4ed8', false, null, 'butt');
    strokeTrackPath(KIC_PIT_LANE, 9.2, '#363e4a', false, null, 'butt');

    // E. Main FIA Grade-1 Basalt-Aggregate Asphalt Ribbon
    strokeTrackPath(smoothTrackPts, 12.6, '#262b33', true);

    // F. Darkened Rubbered-In Racing Line & Heavy Braking Rubber Marks (T1, T3, T10, T16)
    tCtx.save();
    for (let i = 0; i < nPts; i++) {
      const pA = pxPts[i];
      const pB = pxPts[(i + 1) % nPts];
      const nextK = Math.abs(curvatures[(i + 6) % nPts]);
      const currK = Math.abs(curvatures[i]);
      const rubberAlpha = Math.min(0.52, 0.16 + nextK * 0.85 + currK * 0.45);
      tCtx.strokeStyle = `rgba(12, 15, 20, ${rubberAlpha.toFixed(3)})`;
      tCtx.lineWidth = 4.2;
      tCtx.beginPath();
      tCtx.moveTo(pA[0], pA[1]);
      tCtx.lineTo(pB[0], pB[1]);
      tCtx.stroke();
    }
    tCtx.restore();

    // G. Dual Crisp White Track-Limit Edge Stripes (Left & Right edges, NOT center line!)
    ['left', 'right'].forEach((side) => {
      const sign = side === 'left' ? -5.6 : 5.6;
      tCtx.save();
      tCtx.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const curr = pxPts[i % nPts];
        const next = pxPts[(i + 1) % nPts];
        const dx = next[0] - curr[0], dy = next[1] - curr[1];
        const len = Math.hypot(dx, dy) || 1;
        const ox = (-dy / len) * sign;
        const oy = (dx / len) * sign;
        if (i === 0) tCtx.moveTo(curr[0] + ox, curr[1] + oy);
        else tCtx.lineTo(curr[0] + ox, curr[1] + oy);
      }
      tCtx.closePath();
      tCtx.strokeStyle = 'rgba(248, 250, 252, 0.86)';
      tCtx.lineWidth = 1.15;
      tCtx.stroke();
      tCtx.restore();
    });

    // H. Start/Finish Line & 16-Car Staggered Starting Grid Boxes on Main Straight
    fillOrientedRect(34.7370, 126.4147, 3.2, 12.2, mainStraightPxAngle, '#f8fafc');
    for (let g = 0; g < 16; g++) {
      const backFrac = (g + 1.5) / 19;
      const gLat = 34.7370 - backFrac * 0.00105;
      const gLng = 126.4147 - backFrac * 0.00288;
      const lateralSign = (g % 2 === 0) ? -1 : 1;
      const perpLat = Math.cos(mainStraightPxAngle) * 0.000075 * lateralSign;
      const perpLng = -Math.sin(mainStraightPxAngle) * 0.000085 * lateralSign;
      fillOrientedRect(gLat + perpLat, gLng + perpLng, 2.4, 2.2, mainStraightPxAngle, 'rgba(255,255,255,0.0)', 'rgba(248,250,252,0.84)');
    }

    const trackPixels = tCtx.getImageData(0, 0, W, H).data;

    // Geological & Motorsport Engineered Elevation Model (meters, max 850m encoded in 16-bit RG)
    function calculateElevation(lat, lng) {
      const nX = (lng - BOUNDS.west) * 32;
      const nY = (lat - BOUNDS.south) * 32;
      const ridgeDetail = ridgedFbm(nX * 0.65 + 2.4, nY * 0.65 + 1.1, 4);
      const valleyFbm = fbm(nX * 1.1, nY * 1.1, 3);

      // Reclaimed Samho tidal plain base (~8.2m)
      let h = 8.2 + valleyFbm * 3.8;

      const dCircuit = distKm(lat, lng, 34.7365, 126.4145);
      const dTrack = distToPolylineKm(lat, lng, smoothTrackPts);
      const dKart = distToPolylineKm(lat, lng, smoothKartPts);

      // NW Samho Coastal Pine Hills
      const dSamhoHill = distKm(lat, lng, 34.7600, 126.4125);
      if (dSamhoHill < 1.85) {
        const f = Math.max(0, 1 - dSamhoHill / 1.85);
        h = Math.max(h, 12 + 128 * Math.pow(f, 1.62) * (0.72 + ridgeDetail * 0.36));
      }

      // Central-North Green Park Ridge north of KIC 1.2km Back Straight
      const dNorthRidge = distKm(lat, lng, 34.7560, 126.4320);
      if (dNorthRidge < 2.25) {
        const f = Math.max(0, 1 - dNorthRidge / 2.25);
        h = Math.max(h, 14 + 182 * Math.pow(f, 1.54) * (0.70 + ridgeDetail * 0.38));
      }

      // Eastern Granite Mountain Backdrop: Eunjeoksan (389m) & Wolchulsan Craggy Peaks (up to 720m)
      let peak = 0;
      const dEunjeok = distKm(lat, lng, 34.7520, 126.4765);
      if (dEunjeok < 3.45) {
        const f = Math.max(0, 1 - dEunjeok / 3.45);
        peak = Math.max(peak, 495 * Math.pow(f, 1.46) * (0.72 + ridgeDetail * 0.36));
      }
      const dWolchulNorth = distKm(lat, lng, 34.7660, 126.4840);
      if (dWolchulNorth < 2.9) {
        const f = Math.max(0, 1 - dWolchulNorth / 2.9);
        peak = Math.max(peak, 710 * Math.pow(f, 1.40) * (0.75 + ridgeDetail * 0.35));
      }
      const dWolchulSouth = distKm(lat, lng, 34.7350, 126.4810);
      if (dWolchulSouth < 3.05) {
        const f = Math.max(0, 1 - dWolchulSouth / 3.05);
        peak = Math.max(peak, 575 * Math.pow(f, 1.44) * (0.73 + ridgeDetail * 0.35));
      }
      h = Math.max(h, peak);

      // Authentic KIC Circuit Grade:
      // Real KIC rises gently toward Turns 3-6 northern permanent crest (~12.4m) and slopes softly toward Marina (~7.2m),
      // while keeping the Main Straight / Paddock strictly planar (~9.2m) so grandstands and garages sit dead-flush!
      if (dCircuit < 1.38 || dTrack < 0.28 || dKart < 0.18) {
        const northSlope = Math.max(-2.0, Math.min(3.2, (lat - 34.7368) * 420));
        const dMainStraight = distKm(lat, lng, 34.7372, 126.4154);
        const padFactor = Math.max(0, Math.min(1, (dMainStraight - 0.34) / 0.28));
        let targetGrade = 9.2 + northSlope * padFactor;

        // Subtle spectator grass viewing berm outside Turn 4-5 northern hillside (away from tarmac!)
        const dBerm = distKm(lat, lng, 34.7444, 126.4115);
        if (dBerm < 0.26 && dTrack > 0.09) {
          const bf = (1 - dBerm / 0.26) * Math.min(1, (dTrack - 0.09) / 0.06);
          targetGrade += 9.5 * bf * bf;
        }

        const padDist = Math.min(dTrack, dKart);
        const flatBlend = (dCircuit < 1.06 || padDist < 0.16)
          ? 0
          : Math.min(1, Math.max(0, (Math.min(dCircuit - 1.06, padDist - 0.16)) / 0.26));
        h = targetGrade + (h - targetGrade) * flatBlend;
      }

      // Marina Waterfront Seawall Quay (~5.2m) right above Yeongamho Yacht Basin
      const dMarina = distKm(lat, lng, 34.7284, 126.4162);
      if (dMarina < 0.34 && dTrack > 0.06) {
        const mf = Math.min(1, (dTrack - 0.06) / 0.12);
        h = h * (1 - mf) + Math.min(h, 5.4) * mf;
      }

      // Smooth eastern inland boundary taper (1.1km) to avoid vertical cliff edge
      const dEastKm = (126.493 - lng) * 91.2;
      if (dEastKm < 1.1) {
        const t = Math.max(0, Math.min(1, dEastKm / 1.1));
        h *= (0.5 - 0.5 * Math.cos(Math.PI * t));
      }

      return Math.max(0, Math.min(840, h));
    }

    // 1. Build 512x512 16-bit RG DEM heightCanvas (maxMeters = 850, zero 8-bit contour terracing!)
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

        const scaled = Math.min(255, Math.max(0, (e / 850) * 255));
        const rByte = Math.min(255, Math.floor(scaled));
        const gByte = Math.min(255, Math.floor((scaled - rByte) * 255));
        hData[idx] = rByte;
        hData[idx + 1] = gByte;
        hData[idx + 2] = rByte;
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
          rgData[idx] = 48; rgData[idx + 1] = 48; rgData[idx + 2] = 48; rgData[idx + 3] = 255;
          continue;
        }

        const elev = sampleElevation(px, py);
        const cDist = coastDist[pIdx];

        const xPrev = sampleElevation(px - 3, py);
        const xNext = sampleElevation(px + 3, py);
        const yPrev = sampleElevation(px, py - 3);
        const yNext = sampleElevation(px, py + 3);
        const tAlpha = trackPixels[idx + 3] / 255;

        // Smoother micro-bump on engineered motorsport asphalt vs coarser natural terrain
        const bumpScale = tAlpha > 0.5 ? 0.008 : 0.032;
        const microBumpX = (pseudoNoise(px + 1, py) - pseudoNoise(px - 1, py)) * bumpScale;
        const microBumpY = (pseudoNoise(px, py + 1) - pseudoNoise(px, py - 1)) * bumpScale;

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

        let r = 82, g = 132, b = 66;
        let roughVal = 215;

        const turfBlend = Math.max(0, Math.min(1, (1.42 + (medNoise - 0.5) * 0.32 - dCircuitCenter) / 0.30));
        const elevNorm = Math.min(1, elev / 760);
        const canopy = medNoise * 0.55 + microNoise * 0.45;
        let fr = 70 + canopy * 34 - elevNorm * 18 + grain * 6;
        let fg = 120 + canopy * 30 - elevNorm * 28 + grain * 6;
        let fb = 58 + canopy * 18 - elevNorm * 10 + grain * 4;

        // Reclaimed Samho agricultural plain & golden-green coastal fields (< 20m outside circuit)
        if (elev < 20 && turfBlend < 0.99) {
          const gx = px * 0.19;
          const gy = py * 0.19;
          const subX = gx - Math.floor(gx);
          const subY = gy - Math.floor(gy);
          const cellHash = pseudoNoise(Math.floor(gx), Math.floor(gy));
          const plainMix = Math.max(0, Math.min(1, (20 - elev) / 8)) * (1 - turfBlend);
          let pr, pg, pb;
          if (subX < 0.07 || subY < 0.07) {
            pr = 132; pg = 138; pb = 118;
          } else if (cellHash > 0.72) {
            pr = 122 + microNoise * 14;
            pg = 144 + microNoise * 14;
            pb = 82 + microNoise * 8;
          } else {
            pr = 88 + cellHash * 18 + microNoise * 12;
            pg = 136 + cellHash * 16 + microNoise * 14;
            pb = 72 + cellHash * 10 + microNoise * 8;
          }
          fr = fr * (1 - plainMix) + pr * plainMix;
          fg = fg * (1 - plainMix) + pg * plainMix;
          fb = fb * (1 - plainMix) + pb * plainMix;
        }

        // Exposed pale Wolchulsan granite crags on steep slopes & upper ridges
        const rockTrigger = slope * 0.74 + Math.max(0, elev - 230) / 300 + (microNoise - 0.5) * 0.26;
        const rockMix = Math.max(0, Math.min(1, (rockTrigger - 0.47) * 2.55));
        if (rockMix > 0.01) {
          const tone = 152 + elevNorm * 64 + microNoise * 24 + grain * 8;
          fr = fr * (1 - rockMix) + Math.min(232, tone) * rockMix;
          fg = fg * (1 - rockMix) + Math.min(229, tone - 3) * rockMix;
          fb = fb * (1 - rockMix) + Math.min(234, tone + 3) * rockMix;
          roughVal = Math.round(roughVal * (1 - rockMix) + 188 * rockMix);
        }

        // Manicured diagonal mowed motorsport infield turf inside KIC grounds
        if (turfBlend > 0.01) {
          const diagStripe = ((Math.floor((px + py) / 16)) & 1) ? 1 : 0;
          const tr = 74 + diagStripe * 8 + microNoise * 12;
          const tg = 142 + diagStripe * 11 + microNoise * 14;
          const tb = 66 + diagStripe * 4 + microNoise * 9;
          fr = fr * (1 - turfBlend) + tr * turfBlend;
          fg = fg * (1 - turfBlend) + tg * turfBlend;
          fb = fb * (1 - turfBlend) + tb * turfBlend;
          roughVal = Math.round(roughVal * (1 - turfBlend) + 198 * turfBlend);
        }

        // Engineered Seawall Concrete Revetment along Samho Bay & Yeongamho Marina
        if (cDist <= 10 && lng < 126.485) {
          if (cDist <= 3) {
            r = Math.floor(172 + microNoise * 28);
            g = Math.floor(208 + microNoise * 22);
            b = Math.floor(220 + microNoise * 18);
            roughVal = 72;
          } else {
            r = Math.floor(178 + grain * 14);
            g = Math.floor(182 + grain * 14);
            b = Math.floor(184 + grain * 12);
            roughVal = 168;
          }
        } else {
          r = fr; g = fg; b = fb;
        }

        // Composite FIA Grade-1 Track / Runoff / Gravel / Paddock Layer with Aggregate Grain
        if (tAlpha > 0.01) {
          const asphaltSpeckle = (grain - 0.5) * 9;
          const tr = Math.max(0, Math.min(255, trackPixels[idx] + asphaltSpeckle));
          const tg = Math.max(0, Math.min(255, trackPixels[idx + 1] + asphaltSpeckle));
          const tb = Math.max(0, Math.min(255, trackPixels[idx + 2] + asphaltSpeckle));
          r = r * (1 - tAlpha) + tr * tAlpha;
          g = g * (1 - tAlpha) + tg * tAlpha;
          b = b * (1 - tAlpha) + tb * tAlpha;
          // Rubbered dark asphalt has lower specular roughness (~108) than gravel traps (~210)
          const isDarkTarmac = (tr < 65 && tg < 70 && tb < 80);
          const targetRough = isDarkTarmac ? 106 : 162;
          roughVal = Math.round(roughVal * (1 - tAlpha) + targetRough * tAlpha);
        }

        nData[idx] = Math.min(255, Math.floor(r * shade));
        nData[idx + 1] = Math.min(255, Math.floor(g * shade));
        nData[idx + 2] = Math.min(255, Math.floor(b * shade));
        nData[idx + 3] = 255;

        rgData[idx] = roughVal;
        rgData[idx + 1] = roughVal;
        rgData[idx + 2] = roughVal;
        rgData[idx + 3] = 255;

        // 4. Elevation Relief Map (0m - 800m hypsometric tint + crisp KIC track silhouette)
        const ratio = Math.min(1, elev / 760);
        let er, eg, eb;
        if (tAlpha > 0.45 && trackPixels[idx] < 90 && trackPixels[idx + 1] < 95) {
          er = 42; eg = 52; eb = 66;
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
  window.YEONGAM_SHORT_CONNECTOR = KIC_SHORT_CONNECTOR;
  window.YEONGAM_PIT_LANE = KIC_PIT_LANE;
  window.YEONGAM_KART_TRACK = KIC_KART_TRACK;
  window.YEONGAM_PRESETS = YEONGAM_PRESETS;
  window.inYeongamLand = inYeongamLand;
  window.createYeongamAssets = createYeongamAssets;
})();
