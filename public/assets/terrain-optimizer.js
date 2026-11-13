// Adaptive Restricted-Quadtree 3D Terrain Polygon Optimizer
// Concentrates high polygon density along coastlines, ridges, and steep slopes
// while merging flat open-water and flat-plateau regions with 2:1 crack-free balancing.
(() => {
  'use strict';

  const PRESET_CONFIGS = {
    jeju: {
      adaptive: { baseCols: 32, baseRows: 16, maxDepth: 4, errorTolM: 2.4, slopeTolM: 6.5, coastDepth: 4, oceanMarginCells: 2 },
      high:     { baseCols: 32, baseRows: 16, maxDepth: 4, errorTolM: 0.9, slopeTolM: 3.0, coastDepth: 4, oceanMarginCells: 3 },
      eco:      { baseCols: 16, baseRows: 8,  maxDepth: 4, errorTolM: 6.0, slopeTolM: 15.0, coastDepth: 3, oceanMarginCells: 1 }
    },
    haeundae: {
      adaptive: { baseCols: 24, baseRows: 16, maxDepth: 4, errorTolM: 1.4, slopeTolM: 4.2, coastDepth: 4, oceanMarginCells: 2 },
      high:     { baseCols: 24, baseRows: 16, maxDepth: 4, errorTolM: 0.55, slopeTolM: 2.0, coastDepth: 4, oceanMarginCells: 3 },
      eco:      { baseCols: 16, baseRows: 12, maxDepth: 4, errorTolM: 3.8, slopeTolM: 11.0, coastDepth: 3, oceanMarginCells: 1 }
    },
    incheon: {
      adaptive: { baseCols: 24, baseRows: 16, maxDepth: 4, errorTolM: 1.2, slopeTolM: 3.8, coastDepth: 4, oceanMarginCells: 2 },
      high:     { baseCols: 24, baseRows: 16, maxDepth: 4, errorTolM: 0.5, slopeTolM: 1.8, coastDepth: 4, oceanMarginCells: 3 },
      eco:      { baseCols: 16, baseRows: 12, maxDepth: 4, errorTolM: 3.4, slopeTolM: 9.5, coastDepth: 3, oceanMarginCells: 1 }
    }
  };

  function getConfig(regionId, quality) {
    const regionSet = PRESET_CONFIGS[regionId] || PRESET_CONFIGS.jeju;
    return regionSet[quality] || regionSet.adaptive;
  }

  /**
   * Builds an indexed, crack-free adaptive quadtree terrain mesh.
   * @param {Object} options
   * @param {number} options.mapWidth - World width (X)
   * @param {number} options.mapDepth - World depth (Z)
   * @param {Object} options.bounds - { west, south, east, north }
   * @param {Function} options.sampleHeightMeters - (lat, lng) => meters (>= 0)
   * @param {string} [options.regionId='jeju']
   * @param {string} [options.quality='adaptive'] - 'adaptive' | 'high' | 'eco'
   * @param {number} [options.coastThresholdM=0.5]
   */
  function buildOptimizedTerrainGeometry(options) {
    const {
      mapWidth,
      mapDepth,
      bounds,
      sampleHeightMeters,
      regionId = 'jeju',
      quality = 'adaptive',
      coastThresholdM = 0.5
    } = options;

    const cfg = getConfig(regionId, quality);
    const maxDepth = cfg.maxDepth;
    const baseCols = cfg.baseCols;
    const baseRows = cfg.baseRows;
    const scale = 1 << maxDepth;
    const cols = baseCols * scale;
    const rows = baseRows * scale;
    const rowStride = cols + 1;

    // 1. Pre-sample finest logical height & land mask grids once (fast linear pass)
    const heightGrid = new Float32Array((cols + 1) * (rows + 1));
    const landGrid = new Uint8Array((cols + 1) * (rows + 1));
    const latSpan = bounds.north - bounds.south;
    const lngSpan = bounds.east - bounds.west;

    for (let gy = 0; gy <= rows; gy++) {
      const lat = bounds.north - (gy / rows) * latSpan;
      const offset = gy * rowStride;
      for (let gx = 0; gx <= cols; gx++) {
        const lng = bounds.west + (gx / cols) * lngSpan;
        const h = Math.max(0, Number(sampleHeightMeters(lat, lng)) || 0);
        heightGrid[offset + gx] = h;
        landGrid[offset + gx] = h > coastThresholdM ? 1 : 0;
      }
    }

    // 2. Quadtree node storage + O(1) cellNodeId lookup
    const cellNodeId = new Int32Array(cols * rows);
    const nodes = [];
    const nodesByDepth = Array.from({ length: maxDepth + 1 }, () => []);

    function paintNode(node) {
      const { id, cx, cy, size } = node;
      for (let y = cy; y < cy + size; y++) {
        const rOff = y * cols;
        for (let x = cx; x < cx + size; x++) {
          cellNodeId[rOff + x] = id;
        }
      }
    }

    function createNode(cx, cy, depth) {
      const size = 1 << (maxDepth - depth);
      const id = nodes.length;
      const node = { id, cx, cy, depth, size, split: false, children: null, isCoast: false };
      nodes.push(node);
      nodesByDepth[depth].push(id);
      paintNode(node);
      return node;
    }

    function splitNode(node) {
      if (node.split || node.depth >= maxDepth) return;
      node.split = true;
      const half = node.size >> 1;
      const nd = node.depth + 1;
      node.children = [
        createNode(node.cx, node.cy, nd).id,
        createNode(node.cx + half, node.cy, nd).id,
        createNode(node.cx, node.cy + half, nd).id,
        createNode(node.cx + half, node.cy + half, nd).id
      ];
    }

    function evaluateCell(cx, cy, size, depth) {
      const x1 = cx + size;
      const y1 = cy + size;

      const hTL = heightGrid[cy * rowStride + cx];
      const hTR = heightGrid[cy * rowStride + x1];
      const hBL = heightGrid[y1 * rowStride + cx];
      const hBR = heightGrid[y1 * rowStride + x1];

      let minH = Math.min(hTL, hTR, hBL, hBR);
      let maxH = Math.max(hTL, hTR, hBL, hBR);
      let hasLand = (landGrid[cy * rowStride + cx] | landGrid[cy * rowStride + x1] |
        landGrid[y1 * rowStride + cx] | landGrid[y1 * rowStride + x1]) !== 0;
      let hasWater = (!landGrid[cy * rowStride + cx] || !landGrid[cy * rowStride + x1] ||
        !landGrid[y1 * rowStride + cx] || !landGrid[y1 * rowStride + x1]);

      // Sample interior points using bilinear error against quad corners
      const step = size > 8 ? 2 : 1;
      let maxLinearError = 0;

      for (let py = cy; py <= y1; py += step) {
        const ty = (py - cy) / size;
        const pOff = py * rowStride;
        for (let px = cx; px <= x1; px += step) {
          const tx = (px - cx) / size;
          const h = heightGrid[pOff + px];
          if (h < minH) minH = h;
          if (h > maxH) maxH = h;
          if (landGrid[pOff + px]) hasLand = true;
          else hasWater = true;

          const hBilin =
            (hTL * (1 - tx) + hTR * tx) * (1 - ty) +
            (hBL * (1 - tx) + hBR * tx) * ty;
          const err = Math.abs(h - hBilin);
          if (err > maxLinearError) maxLinearError = err;
        }
      }

      const isCoast = hasLand && hasWater;
      const heightRange = maxH - minH;

      // Also detect coastline proximity in 1-cell margin so nearshore waters stay smooth
      let nearCoast = false;
      if (!isCoast && hasWater && !hasLand) {
        const margin = Math.min(size, cfg.oceanMarginCells);
        const mx0 = Math.max(0, cx - margin);
        const mx1 = Math.min(cols, x1 + margin);
        const my0 = Math.max(0, cy - margin);
        const my1 = Math.min(rows, y1 + margin);
        outer: for (let py = my0; py <= my1; py += Math.max(1, size >> 2)) {
          const pOff = py * rowStride;
          for (let px = mx0; px <= mx1; px += Math.max(1, size >> 2)) {
            if (landGrid[pOff + px]) {
              nearCoast = true;
              break outer;
            }
          }
        }
      }

      if (isCoast) {
        return { shouldSplit: depth < cfg.coastDepth, isCoast: true, hasLand };
      }

      if (nearCoast) {
        return { shouldSplit: depth < Math.max(1, cfg.coastDepth - 1), isCoast: false, hasLand };
      }

      // Pure flat deep water -> keep coarsest level-0 cells
      if (!hasLand && heightRange < 0.05 && maxLinearError < 0.05) {
        return { shouldSplit: false, isCoast: false, hasLand: false };
      }

      // Flat reclaimed plateaus / low plains -> coarse cells unless geometric error exceeds tolerance
      const depthScale = 1 + depth * 0.25;
      const shouldSplit =
        maxLinearError > cfg.errorTolM / depthScale ||
        heightRange > cfg.slopeTolM * Math.pow(0.68, depth);

      return { shouldSplit, isCoast: false, hasLand };
    }

    // 3. Initial top-down quadtree subdivision
    function subdivideRecursive(node) {
      if (node.depth >= maxDepth) {
        const info = evaluateCell(node.cx, node.cy, node.size, node.depth);
        node.isCoast = info.isCoast;
        return;
      }
      const info = evaluateCell(node.cx, node.cy, node.size, node.depth);
      node.isCoast = info.isCoast;
      if (info.shouldSplit) {
        splitNode(node);
        for (let i = 0; i < 4; i++) {
          subdivideRecursive(nodes[node.children[i]]);
        }
      }
    }

    for (let ry = 0; ry < baseRows; ry++) {
      for (let rx = 0; rx < baseCols; rx++) {
        const root = createNode(rx * scale, ry * scale, 0);
        subdivideRecursive(root);
      }
    }

    // 4. Bottom-up 2:1 neighbor balance pass (guarantees zero T-junction depth jumps > 1)
    function enforceNeighbor(nx, ny, minDepth) {
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return;
      let nb = nodes[cellNodeId[ny * cols + nx]];
      while (nb.depth < minDepth && nb.depth < maxDepth) {
        splitNode(nb);
        nb = nodes[cellNodeId[ny * cols + nx]];
      }
    }

    for (let d = maxDepth; d >= 2; d--) {
      const list = nodesByDepth[d];
      const minNbDepth = d - 1;
      for (let i = 0; i < list.length; i++) {
        const n = nodes[list[i]];
        const x0 = n.cx;
        const y0 = n.cy;
        const s = n.size;
        const midX = x0 + (s >> 1);
        const midY = y0 + (s >> 1);
        enforceNeighbor(x0 - 1, midY, minNbDepth);
        enforceNeighbor(x0 + s, midY, minNbDepth);
        enforceNeighbor(midX, y0 - 1, minNbDepth);
        enforceNeighbor(midX, y0 + s, minNbDepth);
      }
    }

    // 5. Emit deduplicated indexed vertices & crack-free CCW triangles
    const vertIndexMap = new Int32Array((cols + 1) * (rows + 1));
    vertIndexMap.fill(-1);
    const positions = [];
    const uvs = [];
    const indices = [];
    let vertexCount = 0;

    function getVert(gx, gy) {
      const key = gy * rowStride + gx;
      let vi = vertIndexMap[key];
      if (vi === -1) {
        vi = vertexCount++;
        vertIndexMap[key] = vi;
        positions.push(
          (gx / cols - 0.5) * mapWidth,
          0, // Y elevation populated cleanly by updateTerrainHeight()
          (gy / rows - 0.5) * mapDepth
        );
        uvs.push(gx / cols, 1 - gy / rows);
      }
      return vi;
    }

    let leafCount = 0;
    let coastLeafCount = 0;
    let oceanLeafCount = 0;
    let maxLeafDepth = 0;
    let minLeafDepth = maxDepth;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.split) continue;

      leafCount++;
      if (n.depth > maxLeafDepth) maxLeafDepth = n.depth;
      if (n.depth < minLeafDepth) minLeafDepth = n.depth;
      if (n.isCoast) coastLeafCount++;

      const x0 = n.cx;
      const y0 = n.cy;
      const s = n.size;
      const x1 = x0 + s;
      const y1 = y0 + s;

      // Check if pure zero-height water cell for stats
      const centerH = heightGrid[(y0 + (s >> 1)) * rowStride + (x0 + (s >> 1))];
      if (centerH <= coastThresholdM && !n.isCoast) oceanLeafCount++;

      const needLeftMid = x0 > 0 && nodes[cellNodeId[y0 * cols + (x0 - 1)]].depth > n.depth;
      const needRightMid = x1 < cols && nodes[cellNodeId[y0 * cols + x1]].depth > n.depth;
      const needTopMid = y0 > 0 && nodes[cellNodeId[(y0 - 1) * cols + x0]].depth > n.depth;
      const needBottomMid = y1 < rows && nodes[cellNodeId[y1 * cols + x0]].depth > n.depth;

      if (!needLeftMid && !needRightMid && !needTopMid && !needBottomMid) {
        const tl = getVert(x0, y0);
        const tr = getVert(x1, y0);
        const bl = getVert(x0, y1);
        const br = getVert(x1, y1);
        indices.push(tl, bl, tr, tr, bl, br);
      } else {
        const mx = x0 + (s >> 1);
        const my = y0 + (s >> 1);
        const center = getVert(mx, my);
        const ring = [getVert(x0, y0)];
        if (needLeftMid) ring.push(getVert(x0, my));
        ring.push(getVert(x0, y1));
        if (needBottomMid) ring.push(getVert(mx, y1));
        ring.push(getVert(x1, y1));
        if (needRightMid) ring.push(getVert(x1, my));
        ring.push(getVert(x1, y0));
        if (needTopMid) ring.push(getVert(mx, y0));

        for (let k = 0; k < ring.length; k++) {
          indices.push(center, ring[k], ring[(k + 1) % ring.length]);
        }
      }
    }

    const triangleCount = Math.floor(indices.length / 3);
    const uniformTriangles = cols * rows * 2;

    return {
      positions: new Float32Array(positions),
      uvs: new Float32Array(uvs),
      indices: vertexCount > 65535 ? new Uint32Array(indices) : new Uint16Array(indices),
      stats: {
        cols,
        rows,
        vertexCount,
        triangleCount,
        uniformTriangles,
        reductionRatio: uniformTriangles > 0 ? 1 - triangleCount / uniformTriangles : 0,
        leafCount,
        coastLeafCount,
        oceanLeafCount,
        minDepth: minLeafDepth,
        maxDepth: maxLeafDepth,
        quality
      }
    };
  }

  const api = {
    PRESET_CONFIGS,
    getConfig,
    buildOptimizedTerrainGeometry
  };

  if (typeof window !== 'undefined') {
    window.TerrainOptimizer = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.TerrainOptimizer = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
