// Realistic Terrain Asset Synthesizer
// Generates high-resolution photorealistic satellite/aerial textures,
// cartographic elevation relief textures, and tangent-space normal maps.
(() => {
  'use strict';

  // Fast procedural noise helpers for organic natural land surfaces
  function pseudoNoise(x, y) {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  }

  function smoothNoise(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const sfx = fx * fx * (3 - 2 * fx);
    const sfy = fy * fy * (3 - 2 * fy);
    const n00 = pseudoNoise(ix, iy);
    const n10 = pseudoNoise(ix + 1, iy);
    const n01 = pseudoNoise(ix, iy + 1);
    const n11 = pseudoNoise(ix + 1, iy + 1);
    return (n00 * (1 - sfx) + n10 * sfx) * (1 - sfy) + (n01 * (1 - sfx) + n11 * sfx) * sfy;
  }

  function fbm(x, y, octaves) {
    let val = 0, amp = 0.5, freq = 1;
    const count = octaves || 3;
    for (let i = 0; i < count; i++) {
      val += smoothNoise(x * freq, y * freq) * amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val;
  }

  // Precalculated distance helper in kilometers
  function geoDistKm(lat1, lng1, lat2, lng2) {
    const dLat = (lat1 - lat2) * 111.19;
    const dLng = (lng1 - lng2) * 92.5;
    return Math.hypot(dLat, dLng);
  }

  // Generate realistic Jeju Island textures (1024x512)
  function createRealisticJejuAssets(sourceCanvas, outline) {
    const sWidth = sourceCanvas.width;
    const sHeight = sourceCanvas.height;
    const sCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
    const sPixels = sCtx.getImageData(0, 0, sWidth, sHeight).data;

    const W = 1024;
    const H = 512;
    const bounds = { west: 126.12, south: 33.15, east: 127.00, north: 33.60 };

    // Bilinear elevation sampler
    function getElevationMeters(px, py) {
      const sx = Math.max(0, Math.min(sWidth - 1.001, (px / (W - 1)) * (sWidth - 1)));
      const sy = Math.max(0, Math.min(sHeight - 1.001, (py / (H - 1)) * (sHeight - 1)));
      const x0 = Math.floor(sx), y0 = Math.floor(sy);
      const dx = sx - x0, dy = sy - y0;
      const idx = (r, c) => (r * sWidth + c) * 4;
      const h00 = sPixels[idx(y0, x0)];
      const h10 = sPixels[idx(y0, x0 + 1)];
      const h01 = sPixels[idx(y0 + 1, x0)];
      const h11 = sPixels[idx(y0 + 1, x0 + 1)];
      const val = (h00 * (1 - dx) + h10 * dx) * (1 - dy) + (h01 * (1 - dx) + h11 * dx) * dy;
      return (val / 255) * 2000;
    }

    // Precalculate elevation matrix & gradients for high-speed shading
    const elev = new Float32Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        elev[y * W + x] = getElevationMeters(x, y);
      }
    }

    // Canvas outputs
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

    // Sun vector for hillshade: Azimuth 315° (NW), Altitude 45°
    // Lx = -cos(45)*sin(315) = 0.5, Ly = -cos(45)*cos(315) = -0.5, Lz = sin(45) = 0.707
    const lx = 0.577, ly = -0.577, lz = 0.577;

    for (let y = 0; y < H; y++) {
      const lat = bounds.north - (y / (H - 1)) * (bounds.north - bounds.south);
      for (let x = 0; x < W; x++) {
        const lng = bounds.west + (x / (W - 1)) * (bounds.east - bounds.west);
        const idx = (y * W + x) * 4;

        const h = elev[y * W + x];

        // Central differences for slope & normal vector
        const xPrev = x > 0 ? elev[y * W + (x - 1)] : h;
        const xNext = x < W - 1 ? elev[y * W + (x + 1)] : h;
        const yPrev = y > 0 ? elev[(y - 1) * W + x] : h;
        const yNext = y < H - 1 ? elev[(y + 1) * W + x] : h;

        const dzdx = (xNext - xPrev) * 0.048;
        const dzdy = (yNext - yPrev) * 0.048;

        // Tangent Normal
        const nx = -dzdx;
        const ny = -dzdy;
        const nz = 1.0;
        const nLen = Math.hypot(nx, ny, nz);
        const nnx = nx / nLen;
        const nny = ny / nLen;
        const nnz = nz / nLen;

        // Store Normal Map
        nmData[idx] = Math.round((nnx * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.round((nny * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.round((nnz * 0.5 + 0.5) * 255);
        nmData[idx + 3] = h > 0.5 ? 255 : 0;

        // Analytical Hillshade
        const dot = nnx * lx + nny * ly + nnz * lz;
        const slope = Math.hypot(dzdx, dzdy);
        const shade = Math.min(1.4, Math.max(0.32, 0.52 + 0.62 * dot));

        // Is land or water?
        const isLand = h > 0.5;

        // ---- 1. NATURAL PHOTOREALISTIC SATELLITE ALBEDO ----
        let r = 0, g = 0, b = 0, a = 255;

        if (!isLand) {
          // Ocean / Coastal water gradient around Jeju
          const noiseOcean = fbm(x * 0.05, y * 0.05, 2);
          const dHallasan = geoDistKm(lat, lng, 33.3617, 126.5292);
          const reefBand = Math.max(0, 1 - (dHallasan - 35) / 10);
          r = Math.floor(18 + reefBand * 20 + noiseOcean * 6);
          g = Math.floor(68 + reefBand * 45 + noiseOcean * 12);
          b = Math.floor(108 + reefBand * 20);
          a = 0; // Transparent outside terrain bounds for alphaTest
        } else {
          // On-island terrain synthesis based on real Jeju geography
          const dHallasan = geoDistKm(lat, lng, 33.3617, 126.5292);
          const dHyeopjae = geoDistKm(lat, lng, 33.3938, 126.2396);
          const dHamdeok = geoDistKm(lat, lng, 33.543, 126.669);
          const dJungmun = geoDistKm(lat, lng, 33.245, 126.412);
          const dSeongsan = geoDistKm(lat, lng, 33.4581, 126.9426);
          const dAirport = geoDistKm(lat, lng, 33.5104, 126.4914);
          const dSeogwipo = geoDistKm(lat, lng, 33.248, 126.562);
          const dTeaFields = geoDistKm(lat, lng, 33.306, 126.289);

          const microNoise = fbm(x * 0.12, y * 0.12, 3);
          const fieldNoise = fbm(x * 0.035, y * 0.035, 2);

          // A. Hallasan Crater (Baengnokdam 1950m) & High Alpine Slopes
          if (dHallasan < 0.32) {
            // Baengnokdam crater floor & lake
            r = 54 + Math.floor(microNoise * 15);
            g = 86 + Math.floor(microNoise * 18);
            b = 98 + Math.floor(microNoise * 22);
          } else if (dHallasan < 1.1) {
            // Rugged basalt crater rim & scree cliff faces
            const cr = 88 + Math.floor(microNoise * 35);
            r = cr + 10;
            g = cr + 6;
            b = cr;
          } else if (h > 1400) {
            // High subalpine basalt ridges & Korean fir alpine meadow
            const sub = (h - 1400) / 550;
            const rockMix = Math.min(1, slope * 0.8 + sub * 0.5);
            const vegR = 64 + Math.floor(microNoise * 18);
            const vegG = 92 + Math.floor(microNoise * 20);
            const vegB = 68 + Math.floor(microNoise * 14);
            const rockR = 108 + Math.floor(microNoise * 30);
            const rockG = 104 + Math.floor(microNoise * 28);
            const rockB = 98 + Math.floor(microNoise * 25);
            r = Math.floor(vegR * (1 - rockMix) + rockR * rockMix);
            g = Math.floor(vegG * (1 - rockMix) + rockG * rockMix);
            b = Math.floor(vegB * (1 - rockMix) + rockB * rockMix);
          }
          // B. Seongsan Ilchulbong Tuff Cone
          else if (dSeongsan < 0.75) {
            if (slope > 0.4) {
              r = 95 + Math.floor(microNoise * 25);
              g = 98 + Math.floor(microNoise * 25);
              b = 85;
            } else {
              r = 65 + Math.floor(microNoise * 20);
              g = 125 + Math.floor(microNoise * 30);
              b = 58;
            }
          }
          // C. Coastal White Coral Beaches (Hyeopjae, Hamdeok, Jungmun)
          else if (dHyeopjae < 1.6 && h < 22) {
            r = 236 + Math.floor(microNoise * 12);
            g = 226 + Math.floor(microNoise * 12);
            b = 198 + Math.floor(microNoise * 10);
          } else if (dHamdeok < 1.4 && h < 22) {
            r = 234 + Math.floor(microNoise * 14);
            g = 224 + Math.floor(microNoise * 14);
            b = 196 + Math.floor(microNoise * 10);
          } else if (dJungmun < 1.1 && h < 25) {
            r = 226 + Math.floor(microNoise * 14);
            g = 208 + Math.floor(microNoise * 12);
            b = 166 + Math.floor(microNoise * 10);
          }
          // D. Jeju International Airport (Runways & Taxiways)
          else if (dAirport < 1.4 && h < 45) {
            // Check if on Runway 07/25 or 13/31
            const dLine1 = Math.abs((lat - 33.511) - (lng - 126.492) * 0.22);
            const dLine2 = Math.abs((lat - 33.511) + (lng - 126.492) * 1.35);
            if (dLine1 < 0.0018 || dLine2 < 0.0022) {
              // Runway asphalt
              r = 52 + Math.floor(microNoise * 6);
              g = 55 + Math.floor(microNoise * 6);
              b = 58 + Math.floor(microNoise * 6);
            } else {
              // Terminal apron & airport lawn
              r = 145 + Math.floor(microNoise * 18);
              g = 168 + Math.floor(microNoise * 20);
              b = 140;
            }
          }
          // E. Urban Areas (Jeju City & Seogwipo)
          else if (lat > 33.488 && lat < 33.522 && lng > 126.475 && lng < 126.555 && h < 95) {
            // Jeju City Downtown urban roof mosaic
            const blockX = Math.floor(x * 0.45);
            const blockY = Math.floor(y * 0.45);
            const blockHash = pseudoNoise(blockX, blockY);
            if (blockHash < 0.3) {
              // Slate-blue Korean roof
              r = 68 + Math.floor(microNoise * 15);
              g = 95 + Math.floor(microNoise * 20);
              b = 135 + Math.floor(microNoise * 25);
            } else if (blockHash < 0.6) {
              // Light concrete rooftop
              r = 188 + Math.floor(microNoise * 20);
              g = 192 + Math.floor(microNoise * 20);
              b = 196 + Math.floor(microNoise * 20);
            } else if (blockHash < 0.8) {
              // Terracotta brick roof
              r = 168 + Math.floor(microNoise * 20);
              g = 108 + Math.floor(microNoise * 16);
              b = 88;
            } else {
              // Street / parking asphalt
              r = 75 + Math.floor(microNoise * 10);
              g = 78 + Math.floor(microNoise * 10);
              b = 82 + Math.floor(microNoise * 10);
            }
          } else if (dSeogwipo < 1.8 && h < 110) {
            // Seogwipo City urban core
            const blockHash = pseudoNoise(Math.floor(x * 0.4), Math.floor(y * 0.4));
            r = Math.floor(140 + blockHash * 50);
            g = Math.floor(145 + blockHash * 45);
            b = Math.floor(155 + blockHash * 35);
          }
          // F. O'sulloc Green Tea Plantations
          else if (dTeaFields < 1.2 && h < 260) {
            const teaStripe = Math.sin(x * 0.6 + y * 0.6);
            r = Math.floor(45 + teaStripe * 15);
            g = Math.floor(132 + teaStripe * 25);
            b = 52;
          }
          // G. Gotjawal Forest & Mid-Mountain Woodlands (250m - 850m)
          else if (h > 450) {
            // Dense temperate rainforest canopy
            const sub = (h - 450) / 400;
            const forestR = 36 + Math.floor(microNoise * 16);
            const forestG = 82 + Math.floor(microNoise * 22);
            const forestB = 44 + Math.floor(microNoise * 14);
            const highR = 52 + Math.floor(microNoise * 20);
            const highG = 96 + Math.floor(microNoise * 22);
            const highB = 58 + Math.floor(microNoise * 16);
            r = Math.floor(forestR * (1 - sub) + highR * sub);
            g = Math.floor(forestG * (1 - sub) + highG * sub);
            b = Math.floor(forestB * (1 - sub) + highB * sub);
          }
          // H. Jeju Agricultural Stone-Wall Farmland (20m - 450m)
          else if (h > 20) {
            // Basalt stone wall grid (돌담/밭담) simulation
            const cellX = (x * 0.18);
            const cellY = (y * 0.18);
            const edgeDistX = Math.abs(cellX - Math.round(cellX));
            const edgeDistY = Math.abs(cellY - Math.round(cellY));
            const isStoneWall = (edgeDistX < 0.08 || edgeDistY < 0.08) && microNoise > 0.3;

            if (isStoneWall) {
              // Black basalt stone wall
              r = 44 + Math.floor(microNoise * 10);
              g = 46 + Math.floor(microNoise * 10);
              b = 42;
            } else {
              // Varied field plots: Citrus groves, volcanic soil, cabbage/crop
              const plotType = fieldNoise;
              if (plotType < 0.32) {
                // Lush citrus orchard with deep cedar windbreak
                r = 48 + Math.floor(microNoise * 18);
                g = 108 + Math.floor(microNoise * 24);
                b = 45;
              } else if (plotType < 0.55) {
                // Reddish-brown volcanic soil (송이흙)
                r = 146 + Math.floor(microNoise * 22);
                g = 96 + Math.floor(microNoise * 18);
                b = 68;
              } else if (plotType < 0.78) {
                // Green vegetable fields (carrot, potato, cabbage)
                r = 92 + Math.floor(microNoise * 20);
                g = 138 + Math.floor(microNoise * 26);
                b = 78;
              } else {
                // Golden-green pasture
                r = 135 + Math.floor(microNoise * 24);
                g = 155 + Math.floor(microNoise * 24);
                b = 102;
              }
            }
          }
          // I. Rocky Shoreline Basalt Shelf (0m - 20m)
          else {
            // Dark volcanic basalt rock platform (먹돌/현무암 빌레)
            r = 58 + Math.floor(microNoise * 16);
            g = 62 + Math.floor(microNoise * 16);
            b = 56;
          }

          // Apply analytical hillshade modulation
          r = Math.min(255, Math.floor(r * shade));
          g = Math.min(255, Math.floor(g * shade));
          b = Math.min(255, Math.floor(b * shade));
        }

        nData[idx] = r;
        nData[idx + 1] = g;
        nData[idx + 2] = b;
        nData[idx + 3] = a;

        // ---- 2. CARTOGRAPHIC ELEVATION RELIEF TEXTURE ----
        if (!isLand) {
          eData[idx] = 18;
          eData[idx + 1] = 68;
          eData[idx + 2] = 108;
          eData[idx + 3] = 0;
        } else {
          const ratio = Math.min(1, h / 1950);
          let er = 0, eg = 0, eb = 0;

          if (ratio < 0.12) {
            // Lowlands (emerald to chartreuse)
            const s = ratio / 0.12;
            er = Math.floor(82 + s * 70);
            eg = Math.floor(185 - s * 20);
            eb = Math.floor(110 - s * 50);
          } else if (ratio < 0.35) {
            // Mid-slopes (chartreuse to amber)
            const s = (ratio - 0.12) / 0.23;
            er = Math.floor(152 + s * 78);
            eg = Math.floor(165 - s * 25);
            eb = Math.floor(60 - s * 20);
          } else if (ratio < 0.65) {
            // Foothills (amber to terracotta)
            const s = (ratio - 0.35) / 0.3;
            er = Math.floor(230 - s * 20);
            eg = Math.floor(140 - s * 60);
            eb = Math.floor(40 + s * 40);
          } else if (ratio < 0.88) {
            // High alpine (terracotta to slate purple)
            const s = (ratio - 0.65) / 0.23;
            er = Math.floor(210 - s * 70);
            eg = Math.floor(80 + s * 20);
            eb = Math.floor(80 + s * 80);
          } else {
            // Summit crest (slate-purple to alpine crest)
            const s = (ratio - 0.88) / 0.12;
            er = Math.floor(140 + s * 90);
            eg = Math.floor(100 + s * 120);
            eb = Math.floor(160 + s * 85);
          }

          // Elevation contour band subtlety (every 100m)
          const contourLine = Math.abs(Math.sin(h * 0.0314));
          const contourFactor = contourLine < 0.12 ? 0.88 : 1.0;

          eData[idx] = Math.min(255, Math.floor(er * shade * contourFactor));
          eData[idx + 1] = Math.min(255, Math.floor(eg * shade * contourFactor));
          eData[idx + 2] = Math.min(255, Math.floor(eb * shade * contourFactor));
          eData[idx + 3] = 255;
        }
      }
    }

    nCtx.putImageData(nImg, 0, 0);
    eCtx.putImageData(eImg, 0, 0);
    nmCtx.putImageData(nmImg, 0, 0);

    return {
      naturalCanvas,
      elevationCanvas,
      normalCanvas
    };
  }

  // Expose to window
  window.createRealisticJejuAssets = createRealisticJejuAssets;
})();
