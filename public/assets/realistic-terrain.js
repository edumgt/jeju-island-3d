// Realistic Terrain Asset Synthesizer
// Generates high-resolution (2048x1024) photorealistic satellite/aerial textures,
// cartographic elevation relief textures, tangent-space normal maps, and PBR roughness maps.
(() => {
  'use strict';

  // Fast deterministic 32-bit integer noise (8-10x faster than Math.sin in 2M+ pixel loops)
  function pseudoNoise(ix, iy) {
    let n = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263)) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
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
      freq *= 2.03;
    }
    return val;
  }

  // Precalculated distance helper in kilometers
  function geoDistKm(lat1, lng1, lat2, lng2) {
    const dLat = (lat1 - lat2) * 111.19;
    const dLng = (lng1 - lng2) * 92.5;
    return Math.hypot(dLat, dLng);
  }

  // Generate high-resolution realistic Jeju Island textures (2048x1024)
  function createRealisticJejuAssets(sourceCanvas, outline) {
    const sWidth = sourceCanvas.width;
    const sHeight = sourceCanvas.height;
    const sCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
    const sPixels = sCtx.getImageData(0, 0, sWidth, sHeight).data;

    const W = 2048;
    const H = 1024;
    const total = W * H;
    const bounds = { west: 126.12, south: 33.15, east: 127.00, north: 33.60 };

    // Bilinear elevation sampler
    const scaleX = (sWidth - 1) / (W - 1);
    const scaleY = (sHeight - 1) / (H - 1);
    const elev = new Float32Array(total);
    const coastDist = new Uint8Array(total);

    for (let y = 0; y < H; y++) {
      const sy = Math.min(sHeight - 1.001, y * scaleY);
      const y0 = sy | 0;
      const dy = sy - y0;
      const r0Off = y0 * sWidth;
      const r1Off = (y0 + 1) * sWidth;
      const rowOff = y * W;
      for (let x = 0; x < W; x++) {
        const sx = Math.min(sWidth - 1.001, x * scaleX);
        const x0 = sx | 0;
        const dx = sx - x0;
        const h00 = sPixels[(r0Off + x0) * 4];
        const h10 = sPixels[(r0Off + x0 + 1) * 4];
        const h01 = sPixels[(r1Off + x0) * 4];
        const h11 = sPixels[(r1Off + x0 + 1) * 4];
        const val = (h00 * (1 - dx) + h10 * dx) * (1 - dy) + (h01 * (1 - dx) + h11 * dx) * dy;
        const meters = (val / 255) * 2000;
        elev[rowOff + x] = meters;
        coastDist[rowOff + x] = meters > 0.5 ? 255 : 0;
      }
    }

    // Two-pass Chamfer distance transform inside land mask (computes distance to shoreline in pixels)
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

    const roughnessCanvas = document.createElement('canvas');
    roughnessCanvas.width = W;
    roughnessCanvas.height = H;
    const rgCtx = roughnessCanvas.getContext('2d');
    const rgImg = rgCtx.createImageData(W, H);
    const rgData = rgImg.data;

    // Sun vector for hillshade: Azimuth 315° (NW), Altitude 45°
    const lx = 0.577, ly = -0.577, lz = 0.577;

    for (let y = 0; y < H; y++) {
      const lat = bounds.north - (y / (H - 1)) * (bounds.north - bounds.south);
      const rowOff = y * W;
      for (let x = 0; x < W; x++) {
        const lng = bounds.west + (x / (W - 1)) * (bounds.east - bounds.west);
        const pIdx = rowOff + x;
        const idx = pIdx * 4;

        const h = elev[pIdx];
        const isLand = h > 0.5;

        // Central differences scaled cleanly to 2048x1024 resolution (+ micro surface relief)
        const xPrev = x > 0 ? elev[pIdx - 1] : h;
        const xNext = x < W - 1 ? elev[pIdx + 1] : h;
        const yPrev = y > 0 ? elev[pIdx - W] : h;
        const yNext = y < H - 1 ? elev[pIdx + W] : h;

        const microBumpX = (pseudoNoise(x + 1, y) - pseudoNoise(x - 1, y)) * 0.045;
        const microBumpY = (pseudoNoise(x, y + 1) - pseudoNoise(x, y - 1)) * 0.045;

        const dzdx = (xNext - xPrev) * 0.095 + microBumpX;
        const dzdy = (yNext - yPrev) * 0.095 + microBumpY;

        const nx = -dzdx;
        const ny = -dzdy;
        const nz = 1.0;
        const nLen = Math.hypot(nx, ny, nz);
        const nnx = nx / nLen;
        const nny = ny / nLen;
        const nnz = nz / nLen;

        // Store Tangent Normal Map
        nmData[idx] = Math.round((nnx * 0.5 + 0.5) * 255);
        nmData[idx + 1] = Math.round((nny * 0.5 + 0.5) * 255);
        nmData[idx + 2] = Math.round((nnz * 0.5 + 0.5) * 255);
        nmData[idx + 3] = isLand ? 255 : 0;

        // Analytical Hillshade
        const dot = nnx * lx + nny * ly + nnz * lz;
        const slope = Math.hypot((xNext - xPrev) * 0.095, (yNext - yPrev) * 0.095);
        const shade = Math.min(1.38, Math.max(0.34, 0.54 + 0.60 * dot));

        let r = 0, g = 0, b = 0, a = 255;
        let roughVal = 215; // default dielectric terrain ~0.84

        if (!isLand) {
          r = 18;
          g = 68;
          b = 108;
          a = 0; // Transparent outside terrain bounds for alphaTest
          roughVal = 55;
        } else {
          const cDist = coastDist[pIdx]; // distance in 0.5px units (2 = 1px from sea)
          const dHallasan = geoDistKm(lat, lng, 33.3617, 126.5292);
          const dHyeopjae = geoDistKm(lat, lng, 33.3938, 126.2396);
          const dHamdeok = geoDistKm(lat, lng, 33.543, 126.669);
          const dJungmun = geoDistKm(lat, lng, 33.245, 126.412);
          const dSeongsan = geoDistKm(lat, lng, 33.4581, 126.9426);
          const dAirport = geoDistKm(lat, lng, 33.5104, 126.4914);
          const dSeogwipo = geoDistKm(lat, lng, 33.248, 126.562);
          const dTeaFields = geoDistKm(lat, lng, 33.306, 126.289);

          // High-resolution micro and macro noise tuned to 2048x1024
          const microNoise = fbm(x * 0.065, y * 0.065, 3);
          const grainNoise = pseudoNoise(x, y);
          const fieldNoise = fbm(x * 0.018, y * 0.018, 2);

          // A. Hallasan Crater (Baengnokdam 1950m) & High Alpine Slopes
          if (dHallasan < 0.32) {
            r = 46 + Math.floor(microNoise * 16);
            g = 86 + Math.floor(microNoise * 18);
            b = 104 + Math.floor(microNoise * 22);
            roughVal = 72; // Crater lake sheen
          } else if (dHallasan < 1.15) {
            const cr = 86 + Math.floor(microNoise * 38 + grainNoise * 8);
            r = cr + 10;
            g = cr + 6;
            b = cr;
            roughVal = 205;
          } else if (h > 1400) {
            const sub = (h - 1400) / 550;
            const rockMix = Math.min(1, slope * 0.72 + sub * 0.48);
            const vegR = 62 + Math.floor(microNoise * 18);
            const vegG = 92 + Math.floor(microNoise * 22);
            const vegB = 66 + Math.floor(microNoise * 14);
            const rockR = 110 + Math.floor(microNoise * 30 + grainNoise * 8);
            const rockG = 105 + Math.floor(microNoise * 28 + grainNoise * 8);
            const rockB = 98 + Math.floor(microNoise * 25 + grainNoise * 6);
            r = Math.floor(vegR * (1 - rockMix) + rockR * rockMix);
            g = Math.floor(vegG * (1 - rockMix) + rockG * rockMix);
            b = Math.floor(vegB * (1 - rockMix) + rockB * rockMix);
            roughVal = Math.round(225 - rockMix * 25);
          }
          // B. Seongsan Ilchulbong Tuff Cone
          else if (dSeongsan < 0.75) {
            if (slope > 0.38) {
              r = 94 + Math.floor(microNoise * 26 + grainNoise * 8);
              g = 97 + Math.floor(microNoise * 24 + grainNoise * 8);
              b = 84 + Math.floor(grainNoise * 6);
              roughVal = 205;
            } else {
              r = 64 + Math.floor(microNoise * 22);
              g = 126 + Math.floor(microNoise * 30);
              b = 58 + Math.floor(grainNoise * 6);
              roughVal = 228;
            }
          }
          // C. Coastal White Coral Beaches (Hyeopjae, Hamdeok, Jungmun)
          else if (dHyeopjae < 1.6 && h < 22) {
            r = 236 + Math.floor(microNoise * 12 + grainNoise * 6);
            g = 226 + Math.floor(microNoise * 12 + grainNoise * 6);
            b = 198 + Math.floor(microNoise * 10);
            roughVal = cDist < 6 ? 115 : 196;
          } else if (dHamdeok < 1.4 && h < 22) {
            r = 234 + Math.floor(microNoise * 14 + grainNoise * 6);
            g = 224 + Math.floor(microNoise * 14 + grainNoise * 6);
            b = 196 + Math.floor(microNoise * 10);
            roughVal = cDist < 6 ? 115 : 196;
          } else if (dJungmun < 1.1 && h < 25) {
            r = 226 + Math.floor(microNoise * 14 + grainNoise * 6);
            g = 208 + Math.floor(microNoise * 12 + grainNoise * 6);
            b = 166 + Math.floor(microNoise * 10);
            roughVal = cDist < 6 ? 115 : 196;
          }
          // D. Jeju International Airport (Runways & Taxiways)
          else if (dAirport < 1.4 && h < 45) {
            const dLine1 = Math.abs((lat - 33.511) - (lng - 126.492) * 0.22);
            const dLine2 = Math.abs((lat - 33.511) + (lng - 126.492) * 1.35);
            if (dLine1 < 0.0018 || dLine2 < 0.0022) {
              r = 50 + Math.floor(microNoise * 6 + grainNoise * 4);
              g = 53 + Math.floor(microNoise * 6 + grainNoise * 4);
              b = 57 + Math.floor(microNoise * 6);
              roughVal = 145;
            } else {
              r = 144 + Math.floor(microNoise * 18);
              g = 166 + Math.floor(microNoise * 20);
              b = 138;
              roughVal = 205;
            }
          }
          // E. Urban Areas (Jeju City & Seogwipo)
          else if (lat > 33.488 && lat < 33.522 && lng > 126.475 && lng < 126.555 && h < 95) {
            const blockX = Math.floor(x * 0.22);
            const blockY = Math.floor(y * 0.22);
            const blockHash = pseudoNoise(blockX, blockY);
            if (blockHash < 0.3) {
              r = 68 + Math.floor(microNoise * 15);
              g = 95 + Math.floor(microNoise * 20);
              b = 135 + Math.floor(microNoise * 25);
              roughVal = 155;
            } else if (blockHash < 0.6) {
              r = 188 + Math.floor(microNoise * 20);
              g = 192 + Math.floor(microNoise * 20);
              b = 196 + Math.floor(microNoise * 20);
              roughVal = 185;
            } else if (blockHash < 0.8) {
              r = 168 + Math.floor(microNoise * 20);
              g = 108 + Math.floor(microNoise * 16);
              b = 88;
              roughVal = 195;
            } else {
              r = 74 + Math.floor(microNoise * 10);
              g = 77 + Math.floor(microNoise * 10);
              b = 82 + Math.floor(microNoise * 10);
              roughVal = 150;
            }
          } else if (dSeogwipo < 1.8 && h < 110) {
            const blockHash = pseudoNoise(Math.floor(x * 0.2), Math.floor(y * 0.2));
            r = Math.floor(140 + blockHash * 50 + grainNoise * 6);
            g = Math.floor(145 + blockHash * 45 + grainNoise * 6);
            b = Math.floor(155 + blockHash * 35);
            roughVal = 180;
          }
          // F. O'sulloc Green Tea Plantations
          else if (dTeaFields < 1.2 && h < 260) {
            const teaStripe = Math.sin(x * 0.32 + y * 0.32);
            r = Math.floor(45 + teaStripe * 15 + grainNoise * 5);
            g = Math.floor(134 + teaStripe * 24 + grainNoise * 6);
            b = 52;
            roughVal = 225;
          }
          // G. Gotjawal Forest & Mid-Mountain Woodlands (450m - 1400m)
          else if (h > 450) {
            const sub = (h - 450) / 950;
            const canopyGrain = microNoise * 18 + grainNoise * 6;
            const forestR = 36 + Math.floor(canopyGrain * 0.8);
            const forestG = 82 + Math.floor(canopyGrain * 1.15);
            const forestB = 44 + Math.floor(canopyGrain * 0.7);
            const highR = 52 + Math.floor(canopyGrain);
            const highG = 96 + Math.floor(canopyGrain * 1.15);
            const highB = 58 + Math.floor(canopyGrain * 0.8);
            r = Math.floor(forestR * (1 - sub) + highR * sub);
            g = Math.floor(forestG * (1 - sub) + highG * sub);
            b = Math.floor(forestB * (1 - sub) + highB * sub);
            roughVal = 232;
          }
          // H. Jeju Agricultural Stone-Wall Farmland (20m - 450m) - natural warped basalt batdam mosaic
          else if (h > 20) {
            const warpX = (fbm(x * 0.008, y * 0.008, 2) - 0.5) * 4.5;
            const warpY = (fbm(x * 0.008 + 13.7, y * 0.008 + 5.1, 2) - 0.5) * 4.5;
            const cellX = x * 0.078 + warpX;
            const cellY = y * 0.078 + warpY;
            const ix = Math.floor(cellX);
            const iy = Math.floor(cellY);
            const parcelHash = pseudoNoise(ix, iy);
            const edgeDistX = Math.abs(cellX - Math.round(cellX));
            const edgeDistY = Math.abs(cellY - Math.round(cellY));
            const isStoneWall = (edgeDistX < 0.042 || edgeDistY < 0.042) && microNoise > 0.34;

            // Rich Jeju orchard / grass / volcanic soil palette per parcel
            const plotMix = parcelHash * 0.55 + fieldNoise * 0.45;
            if (plotMix < 0.30) {
              // Lush mandarin orchard / winter rye green
              r = 52 + Math.floor(microNoise * 20 + grainNoise * 6);
              g = 110 + Math.floor(microNoise * 26 + grainNoise * 6);
              b = 48 + Math.floor(microNoise * 10);
              roughVal = 224;
            } else if (plotMix < 0.50) {
              // Volcanic reddish-brown plowed soil (화산회토)
              r = 128 + Math.floor(microNoise * 22 + grainNoise * 6);
              g = 94 + Math.floor(microNoise * 18 + grainNoise * 5);
              b = 68 + Math.floor(microNoise * 12);
              roughVal = 228;
            } else if (plotMix < 0.76) {
              // Sunlit pasture / coastal meadow
              r = 86 + Math.floor(microNoise * 22 + grainNoise * 6);
              g = 132 + Math.floor(microNoise * 24 + grainNoise * 6);
              b = 72 + Math.floor(microNoise * 14);
              roughVal = 220;
            } else {
              // Warm dry grass & terraced fields
              r = 118 + Math.floor(microNoise * 22 + grainNoise * 6);
              g = 140 + Math.floor(microNoise * 22 + grainNoise * 6);
              b = 86 + Math.floor(microNoise * 14);
              roughVal = 222;
            }

            if (isStoneWall) {
              // Subtle weathered Jeju basalt stone wall blend (avoid dark grid artifacts)
              r = Math.floor(r * 0.62 + 88 * 0.38 + grainNoise * 6);
              g = Math.floor(g * 0.62 + 92 * 0.38 + grainNoise * 6);
              b = Math.floor(b * 0.62 + 86 * 0.38 + grainNoise * 5);
              roughVal = 212;
            }
          }
          // I. Rocky Shoreline Basalt Shelf (0m - 20m)
          else {
            r = 60 + Math.floor(microNoise * 16 + grainNoise * 7);
            g = 64 + Math.floor(microNoise * 16 + grainNoise * 7);
            b = 58;
            roughVal = 204;
          }

          // Crisp High-Res Coastline Enhancement (delicate surf spray + wet volcanic basalt/sand shelf)
          if (cDist <= 7) {
            const foamNoise = fbm(x * 0.16, y * 0.16, 2);
            if (cDist <= 2 && h < 22 && slope < 0.55 && foamNoise > 0.44) {
              // Delicate breaking seafoam along sandy/low coasts
              const foamMix = 0.38 + foamNoise * 0.32;
              r = Math.floor(r * (1 - foamMix) + 234 * foamMix);
              g = Math.floor(g * (1 - foamMix) + 245 * foamMix);
              b = Math.floor(b * (1 - foamMix) + 248 * foamMix);
              roughVal = 92;
            } else if (cDist <= 4) {
              // Wet tidal basalt / damp sand sheen
              const wetFactor = 0.80 + (cDist / 4) * 0.20;
              r = Math.floor(r * wetFactor);
              g = Math.floor(g * wetFactor);
              b = Math.floor(b * wetFactor);
              roughVal = Math.min(roughVal, 84 + cDist * 14);
            }
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

        // PBR Roughness (Three.js reads green channel)
        rgData[idx] = roughVal;
        rgData[idx + 1] = roughVal;
        rgData[idx + 2] = roughVal;
        rgData[idx + 3] = 255;

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
            const s = ratio / 0.12;
            er = Math.floor(82 + s * 70);
            eg = Math.floor(185 - s * 20);
            eb = Math.floor(110 - s * 50);
          } else if (ratio < 0.35) {
            const s = (ratio - 0.12) / 0.23;
            er = Math.floor(152 + s * 78);
            eg = Math.floor(165 - s * 25);
            eb = Math.floor(60 - s * 20);
          } else if (ratio < 0.65) {
            const s = (ratio - 0.35) / 0.3;
            er = Math.floor(230 - s * 20);
            eg = Math.floor(140 - s * 60);
            eb = Math.floor(40 + s * 40);
          } else if (ratio < 0.88) {
            const s = (ratio - 0.65) / 0.23;
            er = Math.floor(210 - s * 70);
            eg = Math.floor(80 + s * 20);
            eb = Math.floor(80 + s * 80);
          } else {
            const s = (ratio - 0.88) / 0.12;
            er = Math.floor(140 + s * 90);
            eg = Math.floor(100 + s * 120);
            eb = Math.floor(160 + s * 85);
          }

          // Crisp elevation contour bands (every 100m, plus 20m minor contours near coast)
          const contourMajor = Math.abs(Math.sin(h * 0.031416));
          const contourMinor = h < 300 ? Math.abs(Math.sin(h * 0.15708)) : 1.0;
          const contourFactor = contourMajor < 0.08 ? 0.84 : (contourMinor < 0.06 ? 0.94 : 1.0);

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
    rgCtx.putImageData(rgImg, 0, 0);

    return {
      naturalCanvas,
      elevationCanvas,
      normalCanvas,
      roughnessCanvas
    };
  }

  // Expose to window
  window.createRealisticJejuAssets = createRealisticJejuAssets;
})();
