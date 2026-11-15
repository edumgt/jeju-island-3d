(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TransectHelpers = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function haversineDistanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function cleanCustomTransect(rawWaypoints, bounds) {
    if (!Array.isArray(rawWaypoints) || !bounds) return [];
    const cleaned = [];
    for (let i = 0; i < rawWaypoints.length && cleaned.length < 160; i++) {
      const pt = rawWaypoints[i];
      if (!pt || typeof pt !== 'object') continue;
      const lat = Number(pt.lat);
      const lng = Number(pt.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (lat < bounds.south || lat > bounds.north || lng < bounds.west || lng > bounds.east) continue;
      const entry = {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6))
      };
      if (typeof pt.name === 'string' && pt.name.trim()) {
        entry.name = pt.name.trim().slice(0, 30);
      }
      cleaned.push(entry);
    }
    return cleaned.length >= 2 ? cleaned : [];
  }

  function simplifyWaypoints(points, minStepKm) {
    if (!Array.isArray(points) || points.length === 0) return [];
    if (points.length <= 2) return points.slice();
    const threshold = Math.max(0.01, Number(minStepKm) || 0.15);
    const out = [points[0]];
    let last = points[0];
    for (let i = 1; i < points.length - 1; i++) {
      const cur = points[i];
      if (haversineDistanceKm(last.lat, last.lng, cur.lat, cur.lng) >= threshold) {
        out.push(cur);
        last = cur;
      }
    }
    const end = points[points.length - 1];
    if (haversineDistanceKm(last.lat, last.lng, end.lat, end.lng) > 0.005 || out.length === 1) {
      out.push(end);
    }
    return out;
  }

  function sampleTransectPath(waypoints, sampleHeightM, options) {
    const opts = options || {};
    const sampleCount = Math.max(8, Math.min(240, Number(opts.sampleCount) || 120));
    const mapPoint = typeof opts.mapPoint === 'function' ? opts.mapPoint : null;

    if (!Array.isArray(waypoints) || waypoints.length < 2) {
      return [];
    }

    // Build cumulative arc-length table so points are sampled uniformly by real km distance
    const cumKm = [0];
    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1];
      const cur = waypoints[i];
      const seg = haversineDistanceKm(prev.lat, prev.lng, cur.lat, cur.lng);
      cumKm.push(cumKm[i - 1] + seg);
    }

    const totalKm = cumKm[cumKm.length - 1];
    if (totalKm <= 1e-6) {
      const p0 = waypoints[0];
      const elev = Math.max(0, Number(sampleHeightM(p0.lat, p0.lng)) || 0);
      const mapped = mapPoint ? mapPoint(p0.lat, p0.lng) : null;
      return [{
        index: 0,
        lat: p0.lat,
        lng: p0.lng,
        x: mapped ? mapped.x : 0,
        z: mapped ? mapped.z : 0,
        distanceKm: 0,
        elevationM: elev,
        name: p0.name
      }];
    }

    const samples = [];
    let segIdx = 0;

    for (let i = 0; i < sampleCount; i++) {
      const targetKm = (i / (sampleCount - 1)) * totalKm;
      while (segIdx < waypoints.length - 2 && cumKm[segIdx + 1] < targetKm) {
        segIdx++;
      }
      const d0 = cumKm[segIdx];
      const d1 = cumKm[segIdx + 1];
      const span = d1 - d0;
      const t = span > 1e-9 ? Math.max(0, Math.min(1, (targetKm - d0) / span)) : 0;

      const p0 = waypoints[segIdx];
      const p1 = waypoints[segIdx + 1];
      const lat = p0.lat + t * (p1.lat - p0.lat);
      const lng = p0.lng + t * (p1.lng - p0.lng);
      const elev = Math.max(0, Number(sampleHeightM(lat, lng)) || 0);
      const mapped = mapPoint ? mapPoint(lat, lng) : null;

      let labelName;
      if (i === 0 && p0.name) labelName = p0.name;
      else if (i === sampleCount - 1 && p1.name) labelName = p1.name;
      else if (t < 0.08 && p0.name && i > 0) labelName = p0.name;

      samples.push({
        index: i,
        lat,
        lng,
        x: mapped ? mapped.x : 0,
        z: mapped ? mapped.z : 0,
        distanceKm: targetKm,
        elevationM: elev,
        name: labelName
      });
    }

    return samples;
  }

  function computeTransectMetrics(samples) {
    if (!Array.isArray(samples) || samples.length === 0) {
      return {
        minElevM: 0,
        maxElevM: 0,
        avgElevM: 0,
        peakIndex: 0,
        peakSample: null,
        totalDistKm: 0,
        maxSlopePct: 0,
        avgSlopePct: 0,
        totalGainM: 0,
        totalLossM: 0
      };
    }

    let minElevM = Infinity;
    let maxElevM = -Infinity;
    let peakIndex = 0;
    let sumElev = 0;
    let maxSlopePct = 0;
    let weightedSlopeSum = 0;
    let slopeDistSum = 0;
    let totalGainM = 0;
    let totalLossM = 0;

    for (let i = 0; i < samples.length; i++) {
      const e = Number(samples[i].elevationM) || 0;
      if (e < minElevM) minElevM = e;
      if (e > maxElevM) {
        maxElevM = e;
        peakIndex = i;
      }
      sumElev += e;

      if (i > 0) {
        const prevE = Number(samples[i - 1].elevationM) || 0;
        const diffE = e - prevE;
        if (diffE > 0) totalGainM += diffE;
        else totalLossM += -diffE;

        const dDistM = Math.max(0, (samples[i].distanceKm - samples[i - 1].distanceKm) * 1000);
        if (dDistM > 5) {
          const grade = Math.min(75, (Math.abs(diffE) / dDistM) * 100);
          if (grade > maxSlopePct) maxSlopePct = grade;
          weightedSlopeSum += grade * dDistM;
          slopeDistSum += dDistM;
        }
      }
    }

    const totalDistKm = samples[samples.length - 1].distanceKm || 0;
    const avgElevM = sumElev / samples.length;
    const avgSlopePct = slopeDistSum > 0 ? weightedSlopeSum / slopeDistSum : 0;

    return {
      minElevM,
      maxElevM,
      avgElevM,
      peakIndex,
      peakSample: samples[peakIndex] || null,
      totalDistKm,
      maxSlopePct,
      avgSlopePct,
      totalGainM,
      totalLossM
    };
  }

  function nearestSampleByCoord(samples, lat, lng, maxSnapKm) {
    if (!Array.isArray(samples) || samples.length === 0) return null;
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const d = haversineDistanceKm(lat, lng, s.lat, s.lng);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    if (bestIdx < 0) return null;
    if (Number.isFinite(maxSnapKm) && bestDist > maxSnapKm) return null;
    return {
      index: bestIdx,
      sample: samples[bestIdx],
      offsetKm: bestDist
    };
  }

  function getStrataInfo(depthBelowSurfaceM, elevationM) {
    const d = Math.max(0, Number(depthBelowSurfaceM) || 0);
    if (d < 45) {
      return elevationM <= 2
        ? { key: 'coastal-sand', label: '해안·퇴적 사질층', hex: '#38bdf8', rgb: [0.22, 0.74, 0.97] }
        : { key: 'topsoil', label: '표토·식생층 (0~45m)', hex: '#22c55e', rgb: [0.24, 0.62, 0.32] };
    }
    if (d < 220) {
      return { key: 'volcanic-tuff', label: '풍화·화산쇄설층 (45~220m)', hex: '#d97706', rgb: [0.68, 0.43, 0.25] };
    }
    if (d < 520) {
      return { key: 'basalt-crust', label: '현무암·화강암반층 (220~520m)', hex: '#64748b', rgb: [0.34, 0.39, 0.46] };
    }
    return { key: 'bedrock', label: '심부 기반암 (520m+)', hex: '#1e293b', rgb: [0.14, 0.18, 0.26] };
  }

  function isPathCollinear(samples, maxDeviationRatio) {
    if (!Array.isArray(samples) || samples.length < 2) return false;
    if (samples.length === 2) return true;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dx = last.x - first.x;
    const dz = last.z - first.z;
    const chord = Math.hypot(dx, dz);
    if (chord < 1e-5) return false;

    const tol = Math.max(0.01, Number(maxDeviationRatio) || 0.045) * chord;
    for (let i = 1; i < samples.length - 1; i++) {
      const s = samples[i];
      const cross = Math.abs((s.x - first.x) * dz - (s.z - first.z) * dx);
      const dist = cross / chord;
      if (dist > tol) return false;
    }
    return true;
  }

  function computeSliceCutPlaneParams(samples) {
    if (!Array.isArray(samples) || samples.length < 2) return null;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dx = last.x - first.x;
    const dz = last.z - first.z;
    const chordLen = Math.hypot(dx, dz);
    if (chordLen < 1e-5) return null;
    const tx = dx / chordLen;
    const tz = dz / chordLen;
    return {
      midX: (first.x + last.x) * 0.5 || 0,
      midZ: (first.z + last.z) * 0.5 || 0,
      normalX: (-tz) || 0,
      normalZ: tx || 0,
      chordLen
    };
  }

  function strataRgbAtFrac(frac, surfaceElevM, maxElevM) {
    // frac: 0 = top surface, 1 = deep bedrock floor
    const f = Math.max(0, Math.min(1, frac));
    if (f < 0.08) {
      if (surfaceElevM <= 2) return [0.16, 0.62, 0.84];
      const highRatio = Math.min(1, surfaceElevM / Math.max(100, maxElevM || 1500));
      return [
        0.20 + highRatio * 0.14,
        0.58 - highRatio * 0.12,
        0.28 + highRatio * 0.06
      ];
    }
    if (f < 0.28) {
      const t = (f - 0.08) / 0.20;
      return [
        0.64 - t * 0.16,
        0.42 - t * 0.09,
        0.25 + t * 0.06
      ];
    }
    if (f < 0.64) {
      const t = (f - 0.28) / 0.36;
      return [
        0.38 - t * 0.14,
        0.41 - t * 0.12,
        0.48 - t * 0.12
      ];
    }
    const t = (f - 0.64) / 0.36;
    return [
      0.20 - t * 0.09,
      0.24 - t * 0.10,
      0.32 - t * 0.12
    ];
  }

  function buildVerticalSliceGeometryData(samples, options) {
    const opts = options || {};
    if (!Array.isArray(samples) || samples.length < 2) {
      return {
        positions: new Float32Array(0),
        colors: new Float32Array(0),
        indices: [],
        stats: { vertexCount: 0, triangleCount: 0 }
      };
    }

    const mode = opts.mode === 'panel' ? 'panel' : 'world';
    const halfWidth = Math.max(0.2, Number(opts.halfWidth) || (mode === 'panel' ? 6.5 : 1.6));
    const bedrockY = Number.isFinite(Number(opts.bedrockY)) ? Number(opts.bedrockY) : (mode === 'panel' ? -13 : -4.2);
    const maxElevM = Math.max(80, Number(opts.maxElevM) || 1500);
    const totalDistKm = Math.max(0.05, samples[samples.length - 1].distanceKm || 1);
    const panelSpanX = Number(opts.panelSpanX) || 96;
    const panelTopScale = Number(opts.panelTopScale) || 24;
    const panelSeaY = Number.isFinite(Number(opts.panelSeaY)) ? Number(opts.panelSeaY) : -2.5;
    const getSurfaceY = typeof opts.getSurfaceY === 'function'
      ? opts.getSurfaceY
      : (s) => (s.elevationM / maxElevM) * panelTopScale + panelSeaY;

    const n = samples.length;
    const spine = new Array(n);
    for (let i = 0; i < n; i++) {
      const s = samples[i];
      if (mode === 'panel') {
        const u = s.distanceKm / totalDistKm;
        const x = (u - 0.5) * panelSpanX;
        const y = panelSeaY + (Math.max(0, s.elevationM) / maxElevM) * panelTopScale;
        spine[i] = { x, y, z: 0, elevM: Math.max(0, s.elevationM) };
      } else {
        spine[i] = { x: s.x, y: Number(getSurfaceY(s)) || 0, z: s.z, elevM: Math.max(0, s.elevationM) };
      }
    }

    // Compute smooth lateral normal (nx, nz) per sample
    const normals = new Array(n);
    for (let i = 0; i < n; i++) {
      const pPrev = spine[Math.max(0, i - 1)];
      const pNext = spine[Math.min(n - 1, i + 1)];
      const dx = pNext.x - pPrev.x;
      const dz = pNext.z - pPrev.z;
      const len = Math.hypot(dx, dz) || 1;
      // Front faces +Z in panel mode (dx > 0, dz = 0 -> nx = 0, nz = +1)
      normals[i] = { nx: -dz / len, nz: dx / len };
    }

    const strataFracs = [0.0, 0.08, 0.28, 0.64, 1.0];
    const rows = strataFracs.length;
    const positions = [];
    const colors = [];
    const indices = [];

    function pushQuad(v0, c0, v1, c1, v2, c2, v3, c3) {
      const base = positions.length / 3;
      positions.push(v0[0], v0[1], v0[2], v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]);
      colors.push(c0[0], c0[1], c0[2], c1[0], c1[1], c1[2], c2[0], c2[1], c2[2], c3[0], c3[1], c3[2]);
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }

    for (let i = 0; i < n - 1; i++) {
      const a = spine[i];
      const b = spine[i + 1];
      const na = normals[i];
      const nb = normals[i + 1];

      const aFrontX = a.x + na.nx * halfWidth;
      const aFrontZ = a.z + na.nz * halfWidth;
      const aBackX = a.x - na.nx * halfWidth;
      const aBackZ = a.z - na.nz * halfWidth;

      const bFrontX = b.x + nb.nx * halfWidth;
      const bFrontZ = b.z + nb.nz * halfWidth;
      const bBackX = b.x - nb.nx * halfWidth;
      const bBackZ = b.z - nb.nz * halfWidth;

      const aSpanY = Math.max(0.4, a.y - bedrockY);
      const bSpanY = Math.max(0.4, b.y - bedrockY);

      // 1. Stratified Front Wall & Back Wall
      for (let r = 0; r < rows - 1; r++) {
        const f0 = strataFracs[r];
        const f1 = strataFracs[r + 1];

        const aY0 = a.y - f0 * aSpanY;
        const aY1 = a.y - f1 * aSpanY;
        const bY0 = b.y - f0 * bSpanY;
        const bY1 = b.y - f1 * bSpanY;

        const ca0 = strataRgbAtFrac(f0 + 0.01, a.elevM, maxElevM);
        const ca1 = strataRgbAtFrac(f1 - 0.01, a.elevM, maxElevM);
        const cb0 = strataRgbAtFrac(f0 + 0.01, b.elevM, maxElevM);
        const cb1 = strataRgbAtFrac(f1 - 0.01, b.elevM, maxElevM);

        // Front cut face (illuminated clearly)
        pushQuad(
          [aFrontX, aY0, aFrontZ], ca0,
          [aFrontX, aY1, aFrontZ], ca1,
          [bFrontX, bY0, bFrontZ], cb0,
          [bFrontX, bY1, bFrontZ], cb1
        );

        // Back cut face (slightly shaded for depth contrast)
        const shade = 0.78;
        pushQuad(
          [bBackX, bY0, bBackZ], [cb0[0] * shade, cb0[1] * shade, cb0[2] * shade],
          [bBackX, bY1, bBackZ], [cb1[0] * shade, cb1[1] * shade, cb1[2] * shade],
          [aBackX, aY0, aBackZ], [ca0[0] * shade, ca0[1] * shade, ca0[2] * shade],
          [aBackX, aY1, aBackZ], [ca1[0] * shade, ca1[1] * shade, ca1[2] * shade]
        );
      }

      // 2. Top Terrain Surface Strip (receding in Z depth)
      const topA = strataRgbAtFrac(0.0, a.elevM, maxElevM);
      const topB = strataRgbAtFrac(0.0, b.elevM, maxElevM);
      const topBackA = [topA[0] * 0.86, topA[1] * 0.86, topA[2] * 0.86];
      const topBackB = [topB[0] * 0.86, topB[1] * 0.86, topB[2] * 0.86];
      pushQuad(
        [aBackX, a.y, aBackZ], topBackA,
        [aFrontX, a.y, aFrontZ], topA,
        [bBackX, b.y, bBackZ], topBackB,
        [bFrontX, b.y, bFrontZ], topB
      );

      // 3. Bottom Bedrock Floor
      const botC = [0.09, 0.13, 0.20];
      pushQuad(
        [aFrontX, bedrockY, aFrontZ], botC,
        [aBackX, bedrockY, aBackZ], botC,
        [bFrontX, bedrockY, bFrontZ], botC,
        [bBackX, bedrockY, bBackZ], botC
      );
    }

    // 4. Left & Right End Caps for closed 3D geological block
    const endIndices = [0, n - 1];
    for (let e = 0; e < endIndices.length; e++) {
      const idx = endIndices[e];
      const p = spine[idx];
      const nm = normals[idx];
      const fx = p.x + nm.nx * halfWidth;
      const fz = p.z + nm.nz * halfWidth;
      const bx = p.x - nm.nx * halfWidth;
      const bz = p.z - nm.nz * halfWidth;
      const spanY = Math.max(0.4, p.y - bedrockY);

      for (let r = 0; r < rows - 1; r++) {
        const f0 = strataFracs[r];
        const f1 = strataFracs[r + 1];
        const y0 = p.y - f0 * spanY;
        const y1 = p.y - f1 * spanY;
        const c0 = strataRgbAtFrac(f0 + 0.01, p.elevM, maxElevM).map((v) => v * 0.84);
        const c1 = strataRgbAtFrac(f1 - 0.01, p.elevM, maxElevM).map((v) => v * 0.84);
        if (idx === 0) {
          pushQuad([bx, y0, bz], c0, [bx, y1, bz], c1, [fx, y0, fz], c0, [fx, y1, fz], c1);
        } else {
          pushQuad([fx, y0, fz], c0, [fx, y1, fz], c1, [bx, y0, bz], c0, [bx, y1, bz], c1);
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      indices,
      stats: {
        vertexCount: positions.length / 3,
        triangleCount: indices.length / 3
      }
    };
  }

  return {
    haversineDistanceKm,
    cleanCustomTransect,
    simplifyWaypoints,
    sampleTransectPath,
    computeTransectMetrics,
    nearestSampleByCoord,
    getStrataInfo,
    isPathCollinear,
    computeSliceCutPlaneParams,
    buildVerticalSliceGeometryData
  };
}));
