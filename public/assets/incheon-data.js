// Incheon, Incheon Bridge, and Incheon International Airport 3D Asset Data & Generator
(() => {
  'use strict';

  // Geographic bounds of Incheon metropolitan area
  // West: Yeongjongdo / Yongyudo (Eurwangni Beach), South: Songdo South Port / Sea, East: Munhaksan / Old Incheon, North: Yeongjong Bridge / Cheongna
  const BOUNDS = {
    west: 126.350,
    south: 37.330,
    east: 126.750,
    north: 37.560
  };

  // Coastal outline and land polygons for Incheon area
  // Main land polygon covers Yeongjongdo, Songdo, and Incheon mainland
  const INCHEON_OUTLINE = [
    // 1. Incheon Mainland & Songdo East/South
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
    // North inland
    [126.6800, 37.5550], // Cheongna East / Asiad stadium
    [126.7200, 37.5450], // Bupyeong / Gyeyang boundary
    [126.7350, 37.5000], // Bupyeong / Juan
    [126.7400, 37.4500], // Namdong / Munhak
    [126.7250, 37.4100], // Namdong Industrial Complex
    [126.6900, 37.3700], // Songdo East canal entrance
    [126.6600, 37.3450],
    [126.6500, 37.3400]
  ];

  // Yeongjongdo Island polygon (Incheon Airport, Baekunsan, Eurwangni)
  const YEONGJONG_OUTLINE = [
    [126.4950, 37.4050], // Incheon Bridge west bridgehead
    [126.4650, 37.4150], // Airport south sea dike
    [126.4150, 37.4200], // Terminal 1 south
    [126.3750, 37.4350], // Yongyudo south / Geambap
    [126.3680, 37.4460], // Eurwangni Beach
    [126.3650, 37.4650], // Wangsan Marina
    [126.3800, 37.4900], // Yongyu north cape
    [126.4150, 37.5000], // Terminal 2 northwest
    [126.4650, 37.5150], // North coastal dike
    [126.5350, 37.5250], // Yeongjong Bridge west bridgehead
    [126.5650, 37.5100], // Yeongjong East Pier
    [126.5600, 37.4800], // Yeongjong Sky City waterfront
    [126.5350, 37.4400], // Gusan cape
    [126.4950, 37.4050]
  ];

  // Presets
  const INCHEON_PRESETS = [
    {
      id: 'incheon-airport',
      name: '인천국제공항 T1·T2',
      category: '국제공항',
      lat: 37.4602,
      lng: 126.4407
    },
    {
      id: 'incheon-bridge',
      name: '인천대교 주탑',
      category: '해상대교',
      lat: 37.4140,
      lng: 126.5680
    },
    {
      id: 'songdo-central',
      name: '송도 센트럴파크',
      category: '도심공원',
      lat: 37.3925,
      lng: 126.6380
    },
    {
      id: 'posco-tower',
      name: '포스코타워 송도',
      category: '랜드마크',
      lat: 37.3895,
      lng: 126.6435
    },
    {
      id: 'yeongjong-baekun',
      name: '영종도 백운산 (255m)',
      category: '자연·산',
      lat: 37.4980,
      lng: 126.5180
    },
    {
      id: 'wolmido',
      name: '월미도 문화의거리',
      category: '관광명소',
      lat: 37.4760,
      lng: 126.5980
    },
    {
      id: 'eurwangni',
      name: '을왕리 해수욕장',
      category: '해변',
      lat: 37.4465,
      lng: 126.3725
    },
    {
      id: 'yeongjong-bridge',
      name: '영종대교',
      category: '해상대교',
      lat: 37.5450,
      lng: 126.5820
    },
    {
      id: 'munhaksan',
      name: '문학산 (217m)',
      category: '자연·산',
      lat: 37.4330,
      lng: 126.6780
    },
    {
      id: 'cheongna-lake',
      name: '청라 호수공원',
      category: '수변공원',
      lat: 37.5310,
      lng: 126.6540
    }
  ];

  // Incheon Major Roads & Bridges
  const INCHEON_ROADS = [
    // 1. Incheon Grand Bridge (인천대교 고속도로 - 21.38km across Yellow Sea)
    {
      name: '인천대교',
      type: 'motorway',
      points: [
        [37.4520, 126.4680], // Airport junction
        [37.4380, 126.4850],
        [37.4220, 126.5200], // Sea viaduct start
        [37.4140, 126.5680], // Main Cable-stayed tower navigation span
        [37.4020, 126.6020], // Songdo coast approach
        [37.3960, 126.6200], // Songdo IC
        [37.4080, 126.6600]  // 2nd Gyeongin expressway
      ]
    },
    // 2. Yeongjong Bridge & Incheon Airport Expressway (영종대교 / 공항고속도로)
    {
      name: '영종대교·공항고속도로',
      type: 'motorway',
      points: [
        [37.4560, 126.4520], // Airport T1
        [37.4850, 126.4850], // Airport New Town IC
        [37.5250, 126.5350], // Yeongjong bridgehead
        [37.5450, 126.5820], // Suspension bridge span
        [37.5500, 126.6200], // Buk-Incheon IC
        [37.5550, 126.6750]  // Seoul / Gyeongin direction
      ]
    },
    // 3. Yeongjong Coast South Road (영종해안남로)
    {
      name: '영종해안남로',
      type: 'primary',
      points: [
        [37.4420, 126.3750], // Eurwangni
        [37.4250, 126.4150],
        [37.4320, 126.4750],
        [37.4480, 126.5100],
        [37.4850, 126.5600]
      ]
    },
    // 4. Yeongjong Coast North Road (영종해안북로)
    {
      name: '영종해안북로',
      type: 'primary',
      points: [
        [37.4650, 126.3700], // Wangsan Marina
        [37.4950, 126.4250],
        [37.5180, 126.4950],
        [37.5150, 126.5450]
      ]
    },
    // 5. Songdo International Boulevard (송도국제대로 & 센트럴로)
    {
      name: '송도국제대로',
      type: 'primary',
      points: [
        [37.3750, 126.6450], // Techno Park
        [37.3895, 126.6435], // Posco Tower
        [37.3950, 126.6420], // Central Park
        [37.4100, 126.6450]  // Songdo Convensia
      ]
    },
    // 6. Gyeongin Expressway / Incheon-daero (경인고속도로 / 인천대로)
    {
      name: '인천대로',
      type: 'trunk',
      points: [
        [37.4620, 37.4620 ? 126.6350 : 126.6350],
        [37.4750, 126.6550],
        [37.4980, 126.6750],
        [37.5250, 126.6900]
      ]
    }
  ];

  // Procedural Asset Generator for Incheon
  function createIncheonAssets() {
    const w = 512;
    const h = 512;

    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = 256;
    heightCanvas.height = 256;
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

    // Precalculate height array
    const hw = 256;
    const hh = 256;
    const hImg = hCtx.createImageData(hw, hh);
    const hData = hImg.data;
    const heights = new Float32Array(hw * hh);

    // Helpers to check land
    function inYeongjong(lng, lat) {
      // Approximate Yeongjongdo ellipse / polygon
      const dx = (lng - 126.475) / 0.125;
      const dy = (lat - 37.465) / 0.065;
      return (dx * dx + dy * dy) < 1.0;
    }

    function inSongdo(lng, lat) {
      return (lng >= 126.600 && lng <= 126.675 && lat >= 37.360 && lat <= 37.415);
    }

    function inMainland(lng, lat) {
      return (lng >= 126.605 && lat >= 37.415) || (lng >= 126.640 && lat >= 37.340);
    }

    // Generate terrain heights (max elevation ~320m)
    for (let py = 0; py < hh; py++) {
      const lat = BOUNDS.north - (py / (hh - 1)) * (BOUNDS.north - BOUNDS.south);
      for (let px = 0; px < hw; px++) {
        const lng = BOUNDS.west + (px / (hw - 1)) * (BOUNDS.east - BOUNDS.west);
        const idx = py * hw + px;

        let elev = 0;

        // 1. Yeongjongdo
        const yjDist = Math.hypot((lng - 126.475) / 0.125, (lat - 37.465) / 0.065);
        if (yjDist < 1.0) {
          // Base island shelf
          elev = 6 + (1 - yjDist) * 12;

          // Baekunsan (255m peak at lat: 37.498, lng: 126.518)
          const baekDist = Math.hypot((lng - 126.518) * 110, (lat - 37.498) * 110);
          if (baekDist < 4.2) {
            const hShape = Math.cos((baekDist / 4.2) * Math.PI * 0.5);
            elev += Math.pow(hShape, 1.8) * 235;
          }

          // Yongyudo hills (Oseongsan ~120m at lat: 37.445, lng: 126.395)
          const yongDist = Math.hypot((lng - 126.395) * 110, (lat - 37.445) * 110);
          if (yongDist < 3.0) {
            elev += Math.cos((yongDist / 3.0) * Math.PI * 0.5) * 115;
          }

          // Airport runways level plane (8m flat)
          const isAirport = (lng >= 126.415 && lng <= 126.475 && lat >= 37.435 && lat <= 37.485);
          if (isAirport) {
            elev = Math.min(elev, 8);
          }
        }

        // 2. Songdo International City (flat reclaimed land 6m)
        if (inSongdo(lng, lat)) {
          elev = 7;
        }

        // 3. Incheon Mainland Hills (Munhaksan 217m, Cheongnyangsan 172m, Subongsan)
        if (inMainland(lng, lat)) {
          elev = Math.max(elev, 12);
          // Munhaksan (lat: 37.433, lng: 126.678)
          const munDist = Math.hypot((lng - 126.678) * 110, (lat - 37.433) * 110);
          if (munDist < 4.0) {
            elev += Math.cos((munDist / 4.0) * Math.PI * 0.5) * 205;
          }
          // Cheongnyangsan (lat: 37.408, lng: 126.655)
          const chnDist = Math.hypot((lng - 126.655) * 110, (lat - 37.408) * 110);
          if (chnDist < 2.5) {
            elev += Math.cos((chnDist / 2.5) * Math.PI * 0.5) * 160;
          }
        }

        // Clamp
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

    // Generate Natural & Elevation texture maps at 512x512
    const nImg = nCtx.createImageData(w, h);
    const nData = nImg.data;
    const eImg = eCtx.createImageData(w, h);
    const eData = eImg.data;
    const nmImg = nmCtx.createImageData(w, h);
    const nmData = nmImg.data;

    // Pseudo-random noise helper
    function hash(x, y) {
      let n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
      return n - Math.floor(n);
    }

    for (let py = 0; py < h; py++) {
      const lat = BOUNDS.north - (py / (h - 1)) * (BOUNDS.north - BOUNDS.south);
      const hy = Math.min(hh - 1, Math.floor((py / h) * hh));

      for (let px = 0; px < w; px++) {
        const lng = BOUNDS.west + (px / (w - 1)) * (BOUNDS.east - BOUNDS.west);
        const hx = Math.min(hw - 1, Math.floor((px / w) * hw));
        const idx = (py * w + px) * 4;
        const elev = heights[hy * hw + hx];

        // Slopes for normal map & hillshade
        const hL = heights[hy * hw + Math.max(0, hx - 1)];
        const hR = heights[hy * hw + Math.min(hw - 1, hx + 1)];
        const hU = heights[Math.max(0, hy - 1) * hw + hx];
        const hD = heights[Math.min(hh - 1, hy + 1) * hw + hx];

        const dx = (hR - hL) * 0.12;
        const dy = (hD - hU) * 0.12;
        const nz = 1.0;
        const len = Math.hypot(dx, dy, nz);

        nmData[idx] = Math.floor((-dx / len * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.floor((-dy / len * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.floor((nz / len * 0.5 + 0.5) * 255);
        nmData[idx + 3] = 255;

        // Hillshade
        const sunX = -0.55;
        const sunY = -0.65;
        const sunZ = 0.52;
        const dot = Math.max(0.1, (-dx * sunX - dy * sunY + nz * sunZ) / len);
        const shade = 0.55 + dot * 0.52;

        let r = 35, g = 65, b = 95; // Default deep ocean blue

        const isYeongjong = inYeongjong(lng, lat);
        const isSongdoCity = inSongdo(lng, lat);
        const isMain = inMainland(lng, lat);
        const isLand = isYeongjong || isSongdoCity || isMain;

        // Incheon Airport Runway Coordinates
        const inRunwayZone = (lng >= 126.425 && lng <= 126.465 && lat >= 37.442 && lat <= 37.478);
        const inTerminal1 = Math.hypot((lng - 126.452) * 100, (lat - 37.450) * 100) < 0.35;
        const inTerminal2 = Math.hypot((lng - 126.435) * 100, (lat - 37.470) * 100) < 0.35;

        // Incheon Bridge corridor (connecting Yeongjong 126.495, 37.405 to Songdo 126.605, 37.380)
        const tBridge = (lng - 126.495) / (126.605 - 126.495);
        let onBridge = false;
        if (tBridge >= 0 && tBridge <= 1.0) {
          const bridgeLat = 37.405 + tBridge * (37.380 - 37.405) - Math.sin(tBridge * Math.PI) * 0.008;
          if (Math.abs(lat - bridgeLat) < 0.0016) onBridge = true;
        }

        const microNoise = hash(px * 0.8, py * 0.8) - 0.5;

        if (onBridge) {
          // Incheon Bridge concrete deck & tower pylons
          r = Math.floor(190 + microNoise * 15);
          g = Math.floor(195 + microNoise * 15);
          b = Math.floor(205 + microNoise * 15);
          if (Math.abs(lng - 126.568) < 0.002) {
            // Main cable-stayed diamond towers
            r = 240; g = 245; b = 255;
          }
        } else if (!isLand) {
          // Yellow Sea Tidal Flats & Coastal Mudflats (갯벌)
          const distToLand = Math.min(
            Math.hypot((lng - 126.475) / 0.125, (lat - 37.465) / 0.065) - 1.0,
            Math.hypot(lng - 126.600, lat - 37.380)
          );
          if (distToLand < 0.08 && distToLand > 0) {
            // Silty wet mudflats with coastal sheen
            r = Math.floor(65 + microNoise * 10);
            g = Math.floor(82 + microNoise * 12);
            b = Math.floor(92 + microNoise * 14);
          } else {
            // Deep sea water
            r = Math.floor(24 + microNoise * 6);
            g = Math.floor(58 + microNoise * 8);
            b = Math.floor(92 + microNoise * 10);
          }
        } else if (inTerminal1 || inTerminal2) {
          // Aerodynamic curved terminal roofs (Titanium bluish silver)
          r = Math.floor(145 + microNoise * 12);
          g = Math.floor(175 + microNoise * 14);
          b = Math.floor(205 + microNoise * 16);
        } else if (inRunwayZone) {
          // Asphalt runway strips & tarmac
          const runwayStripe = (Math.floor(px * 0.5) % 8 === 0 || Math.floor(py * 0.5) % 12 === 0);
          if (runwayStripe) {
            // White runway paint
            r = 230; g = 235; b = 240;
          } else {
            // Dark aviation asphalt
            r = Math.floor(52 + microNoise * 6);
            g = Math.floor(54 + microNoise * 6);
            b = Math.floor(58 + microNoise * 6);
          }
        } else if (isSongdoCity) {
          // Songdo International Business District (glass skyscrapers, Central Park canal, green boulevards)
          const inCanal = Math.abs((lng - 126.638) - (lat - 37.392) * 0.3) < 0.0018 && (lat >= 37.385 && lat <= 37.399);
          if (inCanal) {
            // Central Park canal turquoise water
            r = 30; g = 110; b = 135;
          } else {
            // Modern grid towers
            const blockX = Math.floor(px * 0.12);
            const blockY = Math.floor(py * 0.12);
            const isRoad = (px * 0.12 - blockX < 0.18 || py * 0.12 - blockY < 0.18);
            if (isRoad) {
              r = 75; g = 78; b = 82; // Asphalt avenues
            } else {
              // High-rise glass & concrete buildings
              r = Math.floor(140 + microNoise * 20);
              g = Math.floor(165 + microNoise * 20);
              b = Math.floor(185 + microNoise * 25);
            }
          }
        } else if (elev > 45) {
          // Baekunsan & Munhaksan Mountain slopes & ridges
          if (elev > 180) {
            // Peak rocky crags
            r = Math.floor(118 + microNoise * 16);
            g = Math.floor(122 + microNoise * 16);
            b = Math.floor(115 + microNoise * 14);
          } else {
            // Lush pine / oak forest
            r = Math.floor(45 + microNoise * 12);
            g = Math.floor(88 + microNoise * 15);
            b = Math.floor(42 + microNoise * 10);
          }
        } else {
          // Lowland coastal towns & parks
          r = Math.floor(68 + microNoise * 14);
          g = Math.floor(105 + microNoise * 16);
          b = Math.floor(62 + microNoise * 12);
        }

        // Apply analytical lighting
        nData[idx] = Math.min(255, Math.floor(r * shade));
        nData[idx + 1] = Math.min(255, Math.floor(g * shade));
        nData[idx + 2] = Math.min(255, Math.floor(b * shade));
        nData[idx + 3] = 255;

        // Elevation Relief Color (0 to 300m)
        const eRatio = Math.min(1.0, elev / 300);
        let er, eg, eb;
        if (eRatio < 0.08) {
          er = 70; eg = 175; eb = 130;
        } else if (eRatio < 0.4) {
          er = 120 + eRatio * 150; eg = 180; eb = 80;
        } else if (eRatio < 0.75) {
          er = 215; eg = 160 - eRatio * 80; eb = 60;
        } else {
          er = 220; eg = 190; eb = 170;
        }
        eData[idx] = Math.min(255, Math.floor(er * shade));
        eData[idx + 1] = Math.min(255, Math.floor(eg * shade));
        eData[idx + 2] = Math.min(255, Math.floor(eb * shade));
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
  window.INCHEON_BOUNDS = BOUNDS;
  window.INCHEON_OUTLINE = INCHEON_OUTLINE;
  window.INCHEON_ROADS = INCHEON_ROADS;
  window.INCHEON_PRESETS = INCHEON_PRESETS;
  window.createIncheonAssets = createIncheonAssets;
})();
