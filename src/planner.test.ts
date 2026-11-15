import test from 'node:test';
import assert from 'node:assert/strict';
import '../assets/terrain-optimizer.js';
import '../assets/climate-data.js';
import '../assets/place-search-helpers.js';
import '../assets/transect-helpers.js';

const TerrainOptimizer = (globalThis as any).TerrainOptimizer;
const ClimateData = (globalThis as any).ClimateData;
const PlaceSearchHelpers = (globalThis as any).PlaceSearchHelpers;
const TransectHelpers = (globalThis as any).TransectHelpers;

const REGIONS = {
  jeju: {
    bounds: { west: 126.12, south: 33.15, east: 127.00, north: 33.60 }
  },
  haeundae: {
    bounds: { west: 129.130, south: 35.145, east: 129.200, north: 35.195 }
  },
  incheon: {
    bounds: { west: 126.350, south: 37.330, east: 126.750, north: 37.560 }
  },
  gangneung: {
    bounds: { west: 128.360, south: 37.620, east: 129.060, north: 38.225 }
  },
  yeongam: {
    bounds: { west: 126.382, south: 34.712, east: 126.498, north: 34.782 }
  }
};

function cleanState(raw: any, bounds = REGIONS.jeju.bounds) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.markers)) {
    throw new Error('지도 데이터 형식이 올바르지 않습니다.');
  }
  const ids = new Set<string>();
  const markers = raw.markers.slice(0, 50).filter((marker: any) => {
    if (!marker || typeof marker.id !== 'string' || typeof marker.name !== 'string') return false;
    if (ids.has(marker.id) || !Number.isFinite(Number(marker.lat)) || !Number.isFinite(Number(marker.lng))) return false;
    const lat = Number(marker.lat);
    const lng = Number(marker.lng);
    if (lat < bounds.south || lat > bounds.north || lng < bounds.west || lng > bounds.east) return false;
    ids.add(marker.id);
    return true;
  }).map((marker: any) => ({
    id: marker.id.slice(0, 60),
    name: marker.name.trim().slice(0, 30) || '이름 없는 장소',
    category: typeof marker.category === 'string' ? marker.category.slice(0, 30) : '내 장소',
    lat: Number(marker.lat),
    lng: Number(marker.lng),
    custom: Boolean(marker.custom)
  }));

  return {
    markers,
    selectedId: markers.some((marker: any) => marker.id === raw.selectedId) ? raw.selectedId : null,
    mapStyle: raw.mapStyle === 'elevation' ? 'elevation' : 'natural',
    heightScale: Math.min(180, Math.max(40, Number(raw.heightScale) || 100)),
    showLabels: raw.showLabels !== false,
    showOcean: raw.showOcean !== false,
    showRoads: raw.showRoads !== false,
    weather: ['rain', 'snow', 'mist'].includes(raw.weather) ? raw.weather : 'clear',
    weatherIntensity: Math.min(3, Math.max(1, Number(raw.weatherIntensity) || 2)),
    windEffect: raw.windEffect !== false,
    solarDate: typeof raw.solarDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.solarDate) ? raw.solarDate : '2026-11-10',
    solarTime: Number.isFinite(Number(raw.solarTime)) ? Math.max(0, Math.min(1439, Math.round(Number(raw.solarTime)))) : 810,
    solarLiveSync: Boolean(raw.solarLiveSync),
    elevationProfileOpen: Boolean(raw.elevationProfileOpen),
    elevationTransectMode: ['west-east', 'north-south', 'places-route', 'custom-path'].includes(raw.elevationTransectMode) ? raw.elevationTransectMode : 'west-east',
    verticalSliceMode: Boolean(raw.verticalSliceMode),
    customTransect: TransectHelpers.cleanCustomTransect(raw.customTransect, bounds),
    climateOverlayOpen: Boolean(raw.climateOverlayOpen) && !Boolean(raw.elevationProfileOpen),
    climateChartMode: ['overview', 'sunshine', 'marine'].includes(raw.climateChartMode) ? raw.climateChartMode : 'overview',
    terrainDetail: ['adaptive', 'high', 'eco'].includes(raw.terrainDetail) ? raw.terrainDetail : 'adaptive'
  };
}

test('cleanState validates valid markers within Jeju bounds', () => {
  const input = {
    markers: [
      { id: 'hallasan', name: '한라산', category: '화산', lat: 33.3617, lng: 126.5292 },
      { id: 'seoul', name: '서울타워', category: '외부', lat: 37.55, lng: 126.98 } // out of bounds
    ],
    selectedId: 'hallasan',
    mapStyle: 'natural',
    heightScale: 120
  };

  const output = cleanState(input, REGIONS.jeju.bounds);
  assert.equal(output.markers.length, 1);
  assert.equal(output.markers[0].id, 'hallasan');
  assert.equal(output.selectedId, 'hallasan');
  assert.equal(output.heightScale, 120);
  assert.equal(output.terrainDetail, 'adaptive');
});

test('cleanState validates markers within Busan Haeundae bounds', () => {
  const input = {
    markers: [
      { id: 'haeundae_beach', name: '해운대 해수욕장', category: '해변', lat: 35.1587, lng: 129.1604 },
      { id: 'dongbaek', name: '동백섬', category: '자연', lat: 35.1531, lng: 129.1523 },
      { id: 'hallasan', name: '한라산', category: '제주', lat: 33.3617, lng: 126.5292 } // Jeju marker out of Haeundae bounds
    ],
    selectedId: 'haeundae_beach',
    mapStyle: 'natural',
    heightScale: 100
  };

  const output = cleanState(input, REGIONS.haeundae.bounds);
  assert.equal(output.markers.length, 2);
  assert.equal(output.markers[0].id, 'haeundae_beach');
  assert.equal(output.markers[1].id, 'dongbaek');
  assert.equal(output.selectedId, 'haeundae_beach');
});

test('cleanState validates markers within Incheon, Incheon Bridge, Incheon Airport bounds', () => {
  const input = {
    markers: [
      { id: 'incheon_airport', name: '인천국제공항', category: '공항', lat: 37.4602, lng: 126.4407 },
      { id: 'incheon_bridge', name: '인천대교 주탑', category: '교량', lat: 37.4140, lng: 126.5680 },
      { id: 'songdo_central', name: '송도 센트럴파크', category: '공원', lat: 37.3925, lng: 126.6380 },
      { id: 'hallasan', name: '한라산', category: '제주', lat: 33.3617, lng: 126.5292 } // Out of bounds
    ],
    selectedId: 'incheon_airport',
    mapStyle: 'natural',
    heightScale: 100
  };

  const output = cleanState(input, REGIONS.incheon.bounds);
  assert.equal(output.markers.length, 3);
  assert.equal(output.markers[0].id, 'incheon_airport');
  assert.equal(output.markers[1].id, 'incheon_bridge');
  assert.equal(output.markers[2].id, 'songdo_central');
  assert.equal(output.selectedId, 'incheon_airport');
});

test('cleanState validates markers within Gangneung Gyeongpodae and Seoraksan bounds', () => {
  const input = {
    markers: [
      { id: 'gyeongpodae', name: '경포대', category: '명소', lat: 37.7935, lng: 128.8885 },
      { id: 'gyeongpo_beach', name: '경포해변', category: '해변', lat: 37.8135, lng: 128.9055 },
      { id: 'seoraksan', name: '설악산 대청봉', category: '명산', lat: 38.1194, lng: 128.4655 },
      { id: 'hallasan', name: '한라산', category: '제주', lat: 33.3617, lng: 126.5292 }
    ],
    selectedId: 'gyeongpodae',
    mapStyle: 'natural',
    heightScale: 100
  };

  const output = cleanState(input, REGIONS.gangneung.bounds);
  assert.equal(output.markers.length, 3);
  assert.equal(output.markers[0].id, 'gyeongpodae');
  assert.equal(output.markers[1].id, 'gyeongpo_beach');
  assert.equal(output.markers[2].id, 'seoraksan');
  assert.equal(output.selectedId, 'gyeongpodae');
});

test('cleanState clamps heightScale between 40 and 180', () => {
  const low = cleanState({ markers: [] }, REGIONS.haeundae.bounds);
  assert.equal(low.heightScale, 100);

  const clampedLow = cleanState({ markers: [], heightScale: 10 }, REGIONS.haeundae.bounds);
  assert.equal(clampedLow.heightScale, 40);

  const high = cleanState({ markers: [], heightScale: 300 }, REGIONS.haeundae.bounds);
  assert.equal(high.heightScale, 180);
});

test('cleanState throws on invalid payload', () => {
  assert.throws(() => cleanState(null), /지도 데이터 형식이 올바르지 않습니다/);
  assert.throws(() => cleanState({ markers: 'not-an-array' }), /지도 데이터 형식이 올바르지 않습니다/);
});

test('cleanState parses weather, solar, elevation profile and terrainDetail settings correctly', () => {
  const rainState = cleanState({
    markers: [],
    weather: 'rain',
    weatherIntensity: 3,
    windEffect: false,
    solarDate: '2026-06-21',
    solarTime: 1140, // 19:00
    solarLiveSync: true,
    elevationProfileOpen: true,
    elevationTransectMode: 'places-route',
    terrainDetail: 'high'
  });
  assert.equal(rainState.weather, 'rain');
  assert.equal(rainState.weatherIntensity, 3);
  assert.equal(rainState.windEffect, false);
  assert.equal(rainState.solarDate, '2026-06-21');
  assert.equal(rainState.solarTime, 1140);
  assert.equal(rainState.solarLiveSync, true);
  assert.equal(rainState.elevationProfileOpen, true);
  assert.equal(rainState.elevationTransectMode, 'places-route');
  assert.equal(rainState.terrainDetail, 'high');

  const fallbackDetail = cleanState({ markers: [], terrainDetail: 'ultra-invalid' });
  assert.equal(fallbackDetail.terrainDetail, 'adaptive');

  // Test clamp solarTime
  const clampedSolarTime = cleanState({ markers: [], solarTime: 2000 });
  assert.equal(clampedSolarTime.solarTime, 1439);
});

export function buildShareUrl(originPath: string, options: {
  region: string;
  camera?: { pos: [number, number, number]; target: [number, number, number] };
  view?: string;
  selectedId?: string | null;
  mapStyle?: string;
  heightScale?: number;
  weather?: string;
  solarTime?: number;
  solarDate?: string;
  elevationProfileOpen?: boolean;
  climateOverlayOpen?: boolean;
  climateChartMode?: string;
  terrainDetail?: string;
  places?: string[];
}): string {
  const url = new URL(originPath, 'https://example.com');
  url.searchParams.set('region', options.region);
  if (options.camera) {
    const p = options.camera.pos;
    const t = options.camera.target;
    url.searchParams.set('cam', `${p[0].toFixed(1)},${p[1].toFixed(1)},${p[2].toFixed(1)},${t[0].toFixed(1)},${t[1].toFixed(1)},${t[2].toFixed(1)}`);
  }
  if (options.view && options.view !== 'perspective') url.searchParams.set('view', options.view);
  if (options.selectedId) url.searchParams.set('sel', options.selectedId);
  if (options.mapStyle && options.mapStyle !== 'natural') url.searchParams.set('style', options.mapStyle);
  if (options.heightScale && options.heightScale !== 100) url.searchParams.set('height', String(options.heightScale));
  if (options.weather && options.weather !== 'clear') url.searchParams.set('weather', options.weather);
  if (options.solarTime !== undefined && options.solarTime !== 810) url.searchParams.set('time', String(Math.round(options.solarTime)));
  if (options.solarDate && options.solarDate !== '2026-11-10') url.searchParams.set('date', options.solarDate);
  if (options.elevationProfileOpen) url.searchParams.set('elev', '1');
  if (options.climateOverlayOpen) {
    url.searchParams.set('climate', '1');
    if (options.climateChartMode && options.climateChartMode !== 'overview') {
      url.searchParams.set('cmode', options.climateChartMode);
    }
  }
  if (options.terrainDetail && options.terrainDetail !== 'adaptive') url.searchParams.set('mesh', options.terrainDetail);
  if (options.places && options.places.length > 0) url.searchParams.set('places', options.places.join(','));
  return url.toString();
}

export function parseShareParams(queryString: string): any {
  const params = new URLSearchParams(queryString);
  const result: any = {};
  if (params.has('region')) result.region = params.get('region');
  if (params.has('cam')) {
    const parts = params.get('cam')!.split(',').map(Number);
    if (parts.length === 6 && parts.every(Number.isFinite)) {
      result.camera = {
        pos: [parts[0], parts[1], parts[2]],
        target: [parts[3], parts[4], parts[5]]
      };
    }
  }
  if (params.has('view')) result.view = params.get('view');
  if (params.has('sel')) result.selectedId = params.get('sel');
  if (params.has('style')) result.mapStyle = params.get('style');
  if (params.has('height')) result.heightScale = Number(params.get('height'));
  if (params.has('weather')) result.weather = params.get('weather');
  if (params.has('time')) result.solarTime = Number(params.get('time'));
  if (params.has('date')) result.solarDate = params.get('date');
  if (params.has('elev')) result.elevationProfileOpen = params.get('elev') === '1' || params.get('elev') === 'true';
  if (params.has('climate')) result.climateOverlayOpen = params.get('climate') === '1' || params.get('climate') === 'true';
  if (params.has('cmode')) result.climateChartMode = params.get('cmode');
  if (params.has('mesh')) result.terrainDetail = params.get('mesh');
  if (params.has('places')) result.places = params.get('places')!.split(',');
  return result;
}

test('buildShareUrl and parseShareParams correctly encode and decode 3D view state', () => {
  const url = buildShareUrl('/', {
    region: 'incheon',
    camera: { pos: [34.5, 67.8, -90.1], target: [0, -15, 0] },
    selectedId: 'incheon-bridge',
    places: ['incheon-airport', 'incheon-bridge', 'songdo-central'],
    weather: 'rain',
    solarTime: 1080,
    elevationProfileOpen: true,
    terrainDetail: 'high'
  });

  const parsedUrl = new URL(url);
  assert.equal(parsedUrl.searchParams.get('region'), 'incheon');
  assert.equal(parsedUrl.searchParams.get('sel'), 'incheon-bridge');
  assert.equal(parsedUrl.searchParams.get('mesh'), 'high');
  assert.equal(parsedUrl.searchParams.get('cam'), '34.5,67.8,-90.1,0.0,-15.0,0.0');

  const decoded = parseShareParams(parsedUrl.search);
  assert.equal(decoded.region, 'incheon');
  assert.equal(decoded.selectedId, 'incheon-bridge');
  assert.deepEqual(decoded.camera.pos, [34.5, 67.8, -90.1]);
  assert.deepEqual(decoded.camera.target, [0, -15, 0]);
  assert.deepEqual(decoded.places, ['incheon-airport', 'incheon-bridge', 'songdo-central']);
  assert.equal(decoded.weather, 'rain');
  assert.equal(decoded.solarTime, 1080);
  assert.equal(decoded.elevationProfileOpen, true);
  assert.equal(decoded.terrainDetail, 'high');
});

test('TerrainOptimizer generates watertight adaptive quadtree mesh concentrating polygons on coastline and peak', () => {
  const bounds = REGIONS.jeju.bounds;
  const centerLat = (bounds.north + bounds.south) * 0.5;
  const centerLng = (bounds.west + bounds.east) * 0.5;

  // Synthetic island: flat ocean outside ellipse, steep volcanic cone at center
  function sampleIslandMeters(lat: number, lng: number) {
    const nx = (lng - centerLng) / ((bounds.east - bounds.west) * 0.34);
    const ny = (lat - centerLat) / ((bounds.north - bounds.south) * 0.34);
    const r = Math.hypot(nx, ny);
    if (r >= 1.0) return 0;
    const coastalShelf = 15 * (1 - r);
    const peak = 1950 * Math.exp(-(r * r) * 9.0);
    return coastalShelf + peak;
  }

  const adaptive = TerrainOptimizer.buildOptimizedTerrainGeometry({
    mapWidth: 280,
    mapDepth: 150,
    bounds,
    sampleHeightMeters: sampleIslandMeters,
    regionId: 'jeju',
    quality: 'adaptive'
  });

  // 1. Verify substantial polygon reduction vs uniform finest grid
  assert.ok(adaptive.stats.triangleCount < adaptive.stats.uniformTriangles, 'adaptive triangles must be fewer than uniform grid');
  assert.ok(adaptive.stats.reductionRatio > 0.45, `expected >45% reduction, got ${(adaptive.stats.reductionRatio * 100).toFixed(1)}%`);
  assert.ok(adaptive.stats.coastLeafCount > 0, 'coastline cells should be identified and refined');

  // 2. Verify vertex bounds, UV bounds, non-degenerate CCW (+Y) winding
  const { positions, uvs, indices, stats } = adaptive;
  assert.equal(positions.length, stats.vertexCount * 3);
  assert.equal(uvs.length, stats.vertexCount * 2);
  assert.equal(indices.length, stats.triangleCount * 3);

  for (let v = 0; v < stats.vertexCount; v++) {
    const u = uvs[v * 2];
    const vv = uvs[v * 2 + 1];
    assert.ok(u >= 0 && u <= 1, `UV u out of range: ${u}`);
    assert.ok(vv >= 0 && vv <= 1, `UV v out of range: ${vv}`);
  }

  // Track directed boundary/interior half-edges for manifold watertightness check
  const edgeCounts = new Map<string, number>();
  let minCrossY = Infinity;

  for (let t = 0; t < indices.length; t += 3) {
    const i0 = indices[t];
    const i1 = indices[t + 1];
    const i2 = indices[t + 2];
    assert.ok(i0 >= 0 && i0 < stats.vertexCount);
    assert.ok(i1 >= 0 && i1 < stats.vertexCount);
    assert.ok(i2 >= 0 && i2 < stats.vertexCount);
    assert.notEqual(i0, i1);
    assert.notEqual(i1, i2);
    assert.notEqual(i2, i0);

    const x0 = positions[i0 * 3], z0 = positions[i0 * 3 + 2];
    const x1 = positions[i1 * 3], z1 = positions[i1 * 3 + 2];
    const x2 = positions[i2 * 3], z2 = positions[i2 * 3 + 2];
    // (v1 - v0) x (v2 - v0) y-component = e1.z * e2.x - e1.x * e2.z
    const crossY = (z1 - z0) * (x2 - x0) - (x1 - x0) * (z2 - z0);
    if (crossY < minCrossY) minCrossY = crossY;
    assert.ok(crossY > 1e-6, `Triangle ${t / 3} has non-CCW or degenerate winding: crossY=${crossY}`);

    const pairs: [number, number][] = [[i0, i1], [i1, i2], [i2, i0]];
    for (const [a, b] of pairs) {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
    }
  }
  assert.ok(minCrossY > 0);

  // Check every undirected edge has count 1 (outer map border) or 2 (interior shared edge, zero T-junction cracks)
  for (const [key, count] of edgeCounts.entries()) {
    assert.ok(count === 1 || count === 2, `Non-manifold edge ${key} has count ${count}`);
    if (count === 1) {
      const [aStr, bStr] = key.split('_');
      const a = Number(aStr);
      const b = Number(bStr);
      const ua = uvs[a * 2], va = uvs[a * 2 + 1];
      const ub = uvs[b * 2], vb = uvs[b * 2 + 1];
      const eps = 1e-6;
      const onOuterBoundary =
        (Math.abs(ua) < eps && Math.abs(ub) < eps) ||
        (Math.abs(ua - 1) < eps && Math.abs(ub - 1) < eps) ||
        (Math.abs(va) < eps && Math.abs(vb) < eps) ||
        (Math.abs(va - 1) < eps && Math.abs(vb - 1) < eps);
      assert.ok(onOuterBoundary, `Interior T-junction crack detected on edge ${key}: uv=(${ua},${va})-(${ub},${vb})`);
    }
  }

  // 3. Verify adaptive spatial concentration: center/coast region has far higher vertex density than deep ocean corner
  let cornerVerts = 0;
  let islandVerts = 0;
  for (let v = 0; v < stats.vertexCount; v++) {
    const x = positions[v * 3];
    const z = positions[v * 3 + 2];
    if (x < -110 && z < -55) cornerVerts++;
    if (Math.abs(x) < 40 && Math.abs(z) < 25) islandVerts++;
  }
  assert.ok(islandVerts > cornerVerts * 5, `expected island vertex density (${islandVerts}) >> corner ocean (${cornerVerts})`);

  // 4. Verify quality tier ordering: eco < adaptive <= high
  const eco = TerrainOptimizer.buildOptimizedTerrainGeometry({
    mapWidth: 280,
    mapDepth: 150,
    bounds,
    sampleHeightMeters: sampleIslandMeters,
    regionId: 'jeju',
    quality: 'eco'
  });
  const high = TerrainOptimizer.buildOptimizedTerrainGeometry({
    mapWidth: 280,
    mapDepth: 150,
    bounds,
    sampleHeightMeters: sampleIslandMeters,
    regionId: 'jeju',
    quality: 'high'
  });
  assert.ok(eco.stats.triangleCount < adaptive.stats.triangleCount, 'eco should have fewer triangles than adaptive');
  assert.ok(adaptive.stats.triangleCount <= high.stats.triangleCount, 'adaptive should have <= triangles than high');
});

test('buildShareUrl and parseShareParams preserve gangneung region and Gyeongpodae selection', () => {
  const url = buildShareUrl('/', {
    region: 'gangneung',
    camera: { pos: [87.5, 56.5, 122.5], target: [-3.0, -14.0, -5.0] },
    selectedId: 'gyeongpodae',
    elevationProfileOpen: true
  });
  const decoded = parseShareParams(new URL(url).search);
  assert.equal(decoded.region, 'gangneung');
  assert.equal(decoded.selectedId, 'gyeongpodae');
  assert.equal(decoded.elevationProfileOpen, true);
  assert.deepEqual(decoded.camera.target, [-3.0, -14.0, -5.0]);
});

test('TerrainOptimizer generates watertight adaptive quadtree mesh for gangneung coast and Seoraksan', () => {
  const bounds = REGIONS.gangneung.bounds;
  function sampleGangneungMeters(lat: number, lng: number) {
    // East Sea coast roughly around lng = 128.91 - (lat - 37.75)*0.45
    const coastLng = 128.93 - Math.max(0, lat - 37.72) * 0.62;
    if (lng > coastLng) return 0;
    const distCoast = coastLng - lng;
    const base = Math.min(250, distCoast * 900);
    // Seoraksan peak in NW
    const dSeorak = Math.hypot((lng - 128.4655) / 0.08, (lat - 38.1194) / 0.06);
    const seorak = 1708 * Math.exp(-(dSeorak * dSeorak) * 2.2);
    return Math.max(base, seorak);
  }

  const adaptive = TerrainOptimizer.buildOptimizedTerrainGeometry({
    mapWidth: 104,
    mapDepth: 96,
    bounds,
    sampleHeightMeters: sampleGangneungMeters,
    regionId: 'gangneung',
    quality: 'adaptive'
  });

  assert.equal(adaptive.stats.cols, 384);
  assert.equal(adaptive.stats.rows, 384);
  assert.ok(adaptive.stats.triangleCount < adaptive.stats.uniformTriangles);
  assert.ok(adaptive.stats.reductionRatio > 0.35, `expected >35% reduction, got ${(adaptive.stats.reductionRatio * 100).toFixed(1)}%`);
  assert.ok(adaptive.stats.coastLeafCount > 0);

  // Verify watertightness (every edge count is 1 on outer border or 2 on interior)
  const { uvs, indices } = adaptive;
  const edgeCounts = new Map<string, number>();
  for (let t = 0; t < indices.length; t += 3) {
    const i0 = indices[t], i1 = indices[t + 1], i2 = indices[t + 2];
    for (const [a, b] of [[i0, i1], [i1, i2], [i2, i0]] as [number, number][]) {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
    }
  }
  for (const [key, count] of edgeCounts.entries()) {
    assert.ok(count === 1 || count === 2, `Non-manifold edge ${key} has count ${count}`);
    if (count === 1) {
      const [a, b] = key.split('_').map(Number);
      const ua = uvs[a * 2], va = uvs[a * 2 + 1];
      const ub = uvs[b * 2], vb = uvs[b * 2 + 1];
      const eps = 1e-6;
      const onOuter =
        (Math.abs(ua) < eps && Math.abs(ub) < eps) ||
        (Math.abs(ua - 1) < eps && Math.abs(ub - 1) < eps) ||
        (Math.abs(va) < eps && Math.abs(vb) < eps) ||
        (Math.abs(va - 1) < eps && Math.abs(vb - 1) < eps);
      assert.ok(onOuter, `Interior T-junction crack on gangneung edge ${key}`);
    }
  }
});

test('ClimateData provides valid 12-month climatological normals and summaries for all 5 regions', () => {
  const regionIds = ['jeju', 'haeundae', 'incheon', 'gangneung', 'yeongam'] as const;
  for (const id of regionIds) {
    const profile = ClimateData.getClimateProfile(id);
    assert.equal(profile.regionId, id);
    assert.ok(profile.stationName.length > 0);
    assert.ok(profile.climateType.length > 0);
    assert.ok(profile.bestSeason.length > 0);
    assert.ok(profile.note.length > 0);
    assert.equal(profile.monthly.length, 12);

    profile.monthly.forEach((m: any, idx: number) => {
      assert.equal(m.month, idx + 1);
      assert.equal(m.label, `${idx + 1}월`);
      assert.ok(m.minTempC <= m.avgTempC && m.avgTempC <= m.maxTempC, `${id} month ${m.month} temp ordering invalid`);
      assert.ok(m.precipMm >= 0, `${id} month ${m.month} precip negative`);
      assert.ok(m.sunshineHrs > 0 && m.sunshineHrs <= 350, `${id} month ${m.month} sunshine out of range`);
      assert.ok(m.humidityPct >= 0 && m.humidityPct <= 100, `${id} month ${m.month} humidity out of range`);
      assert.ok(m.seaTempC > 0 && m.seaTempC < 35, `${id} month ${m.month} seaTemp out of range`);
      assert.ok(m.windMs > 0 && m.windMs < 20, `${id} month ${m.month} wind out of range`);
    });

    const summary = ClimateData.computeClimateSummary(profile);
    assert.ok(summary.annualMeanTempC > 10 && summary.annualMeanTempC < 20);
    assert.ok(summary.annualPrecipMm > 800 && summary.annualPrecipMm < 2200);
    assert.ok(summary.annualSunshineHrs > 1500 && summary.annualSunshineHrs < 2600);
    assert.ok(summary.hottestMonth && summary.hottestMonth.month === 8);
    assert.ok(summary.coldestMonth && summary.coldestMonth.month === 1);
  }

  const jejuSummary = ClimateData.computeClimateSummary('jeju');
  const incheonSummary = ClimateData.computeClimateSummary('incheon');
  const gangneungSummary = ClimateData.computeClimateSummary('gangneung');
  assert.ok(jejuSummary.annualMeanTempC > incheonSummary.annualMeanTempC, 'Jeju should have warmer annual mean temp than Incheon');
  assert.equal(gangneungSummary.wettestMonth.month, 8, 'Gangneung peak precipitation should occur in August');
});

test('cleanState and share URL params persist climateOverlayOpen and climateChartMode mutually exclusively with elevationProfileOpen', () => {
  const cleaned = cleanState({
    markers: [],
    climateOverlayOpen: true,
    climateChartMode: 'sunshine',
    elevationProfileOpen: false
  });
  assert.equal(cleaned.climateOverlayOpen, true);
  assert.equal(cleaned.climateChartMode, 'sunshine');
  assert.equal(cleaned.elevationProfileOpen, false);

  const fallback = cleanState({
    markers: [],
    climateOverlayOpen: true,
    climateChartMode: 'invalid-mode',
    elevationProfileOpen: true
  });
  assert.equal(fallback.climateOverlayOpen, false);
  assert.equal(fallback.climateChartMode, 'overview');
  assert.equal(fallback.elevationProfileOpen, true);

  const shareUrl = buildShareUrl('/', {
    region: 'gangneung',
    climateOverlayOpen: true,
    climateChartMode: 'marine'
  });
  const decoded = parseShareParams(new URL(shareUrl).search);
  assert.equal(decoded.region, 'gangneung');
  assert.equal(decoded.climateOverlayOpen, true);
  assert.equal(decoded.climateChartMode, 'marine');
});

test('cleanState, share URL params, and TerrainOptimizer support Yeongam KIC sports car circuit', () => {
  const input = {
    markers: [
      { id: 'kic_grandstand', name: 'KIC 메인 그랜드스탠드', category: '서킷·관람석', lat: 34.7376, lng: 126.4152 },
      { id: 'kic_marina', name: 'KIC 마리나 워터프론트 코너', category: '레이싱 코스', lat: 34.7310, lng: 126.4222 },
      { id: 'yeongsanho_bay', name: '은적산·영암호 전망능선', category: '자연·전망', lat: 34.7520, lng: 126.4765 },
      { id: 'hallasan', name: '한라산', category: '제주', lat: 33.3617, lng: 126.5292 }
    ],
    selectedId: 'kic_grandstand',
    mapStyle: 'natural',
    heightScale: 100
  };
  const cleaned = cleanState(input, REGIONS.yeongam.bounds);
  assert.equal(cleaned.markers.length, 3);
  assert.equal(cleaned.selectedId, 'kic_grandstand');

  const url = buildShareUrl('/', {
    region: 'yeongam',
    camera: { pos: [-28.5, 42.0, 56.0], target: [-18.0, -11.0, 2.0] },
    selectedId: 'kic_grandstand',
    elevationProfileOpen: true
  });
  const decoded = parseShareParams(new URL(url).search);
  assert.equal(decoded.region, 'yeongam');
  assert.equal(decoded.selectedId, 'kic_grandstand');
  assert.equal(decoded.elevationProfileOpen, true);

  const bounds = REGIONS.yeongam.bounds;
  function sampleYeongamMeters(lat: number, lng: number) {
    if (lng < 126.392 || lng > 126.492 || lat < 34.718 || lat > 34.776) return 0;
    const dCenter = Math.hypot((lat - 34.7365) * 111.1, (lng - 126.4145) * 91.2);
    if (dCenter < 1.2) return 9.2;
    const dWolchul = Math.hypot((lat - 34.7520) * 111.1, (lng - 126.4765) * 91.2);
    return Math.max(9.0, 680 * Math.exp(-(dWolchul * dWolchul) * 0.45));
  }

  const mesh = TerrainOptimizer.buildOptimizedTerrainGeometry({
    mapWidth: 108,
    mapDepth: 80,
    bounds,
    sampleHeightMeters: sampleYeongamMeters,
    regionId: 'yeongam',
    quality: 'adaptive'
  });

  assert.equal(mesh.stats.cols, 384);
  assert.equal(mesh.stats.rows, 288);
  assert.ok(mesh.stats.triangleCount < mesh.stats.uniformTriangles);
  assert.ok(mesh.stats.reductionRatio > 0.30, `expected >30% reduction, got ${(mesh.stats.reductionRatio * 100).toFixed(1)}%`);

  const yeongamSummary = ClimateData.computeClimateSummary('yeongam');
  assert.ok(yeongamSummary.annualSunshineHrs > 2100, 'Yeongam solar sunshine hours should exceed 2100 hrs');
});

test('PlaceSearchHelpers parses coordinates and matches supported 3D terrain regions accurately', () => {
  assert.deepEqual(PlaceSearchHelpers.parseCoordinateQuery('33.4581, 126.9426'), { lat: 33.4581, lng: 126.9426 });
  assert.deepEqual(PlaceSearchHelpers.parseCoordinateQuery('37.4602 126.4407'), { lat: 37.4602, lng: 126.4407 });
  assert.deepEqual(PlaceSearchHelpers.parseCoordinateQuery('33.3617° N · 126.5292° E'), { lat: 33.3617, lng: 126.5292 });
  assert.equal(PlaceSearchHelpers.parseCoordinateQuery('한라산'), null);
  assert.equal(PlaceSearchHelpers.parseCoordinateQuery('95.123, 126.529'), null);

  assert.equal(PlaceSearchHelpers.findMatchingRegionId(33.4581, 126.9426, REGIONS), 'jeju');
  assert.equal(PlaceSearchHelpers.findMatchingRegionId(37.4602, 126.4407, REGIONS), 'incheon');
  assert.equal(PlaceSearchHelpers.findMatchingRegionId(34.7376, 126.4152, REGIONS), 'yeongam');
  assert.equal(PlaceSearchHelpers.findMatchingRegionId(37.5665, 126.9780, REGIONS), null);

  const rect = PlaceSearchHelpers.buildViewportRectangle(REGIONS.jeju.bounds);
  assert.deepEqual(rect, {
    low: { latitude: 33.15, longitude: 126.12 },
    high: { latitude: 33.6, longitude: 127.0 }
  });
});

test('PlaceSearchHelpers normalizes reverse geocode v4/v3, Places Autocomplete, and Place Details responses', () => {
  const revV4Payload = {
    results: [
      {
        placeId: 'ChIJ-seongsan',
        formattedAddress: '대한민국 제주특별자치도 서귀포시 성산읍 성산리 1',
        location: { latitude: 33.4581, longitude: 126.9426 },
        types: ['natural_feature', 'tourist_attraction'],
        addressComponents: [
          { longText: '성산일출봉', types: ['natural_feature'] },
          { longText: '성산읍', types: ['sublocality_level_2'] }
        ]
      },
      {
        placeId: 'ChIJ-dup',
        formattedAddress: '대한민국 제주특별자치도 서귀포시 성산읍 성산리 1',
        location: { latitude: 33.4581, longitude: 126.9426 },
        types: ['natural_feature'],
        addressComponents: [{ longText: '성산일출봉', types: ['natural_feature'] }]
      }
    ]
  };

  const normalizedV4 = PlaceSearchHelpers.normalizeReverseGeocodeResults(
    revV4Payload,
    REGIONS.jeju.bounds,
    REGIONS,
    { lat: 33.38, lng: 126.56 }
  );
  assert.equal(normalizedV4.length, 1, 'duplicate results at same coords/name should be deduplicated');
  assert.equal(normalizedV4[0].name, '성산일출봉');
  assert.equal(normalizedV4[0].inBounds, true);
  assert.equal(normalizedV4[0].matchedRegionId, 'jeju');
  assert.equal(normalizedV4[0].source, 'reverse-geocode');
  assert.ok(normalizedV4[0].distanceKm > 0);

  const autoPayload = {
    suggestions: [
      {
        placePrediction: {
          placeId: 'ChIJ-airport',
          structuredFormat: {
            mainText: { text: '인천국제공항' },
            secondaryText: { text: '대한민국 인천광역시 중구 공항로 272' }
          },
          types: ['airport', 'point_of_interest'],
          distanceMeters: 12400
        }
      }
    ]
  };
  const autoList = PlaceSearchHelpers.normalizeAutocompleteSuggestions(autoPayload);
  assert.equal(autoList.length, 1);
  assert.equal(autoList[0].name, '인천국제공항');
  assert.equal(autoList[0].needsDetails, true);
  assert.equal(autoList[0].distanceKm, 12.4);

  const details = PlaceSearchHelpers.normalizePlaceDetails(
    {
      id: 'ChIJ-airport',
      displayName: { text: '인천국제공항' },
      formattedAddress: '대한민국 인천광역시 중구 공항로 272',
      location: { latitude: 37.4602, longitude: 126.4407 },
      types: ['airport']
    },
    REGIONS.jeju.bounds,
    REGIONS
  );
  assert.ok(details);
  assert.equal(details.inBounds, false);
  assert.equal(details.matchedRegionId, 'incheon');
});

test('PlaceSearchHelpers enforces Tier 2 quota detection without false positives on empty results', () => {
  assert.equal(PlaceSearchHelpers.isQuotaExceededResponse(429, {}), true);
  assert.equal(PlaceSearchHelpers.isQuotaExceededResponse(403, { error: { status: 'RESOURCE_EXHAUSTED' } }), true);
  assert.equal(PlaceSearchHelpers.isQuotaExceededResponse(200, { status: 'OVER_QUERY_LIMIT' }), true);
  assert.equal(PlaceSearchHelpers.isQuotaExceededResponse(200, { status: 'ZERO_RESULTS', results: [] }), false);
  assert.equal(PlaceSearchHelpers.isQuotaExceededResponse(404, { error: { status: 'NOT_FOUND' } }), false);
  assert.equal(PlaceSearchHelpers.isQuotaExceededResponse(200, { suggestions: [] }), false);
});

test('TransectHelpers samples multi-point cross-sections uniformly and computes gain/loss/slope metrics', () => {
  const waypoints = [
    { lat: 33.36, lng: 126.30, name: '서쪽 기점' },
    { lat: 33.36, lng: 126.53, name: '백록담 능선' },
    { lat: 33.36, lng: 126.76, name: '동쪽 종점' }
  ];

  // Synthetic mountain ridge centered around lng = 126.53 (peak 1950m)
  const sampleHeight = (_lat: number, lng: number) => {
    const d = Math.abs(lng - 126.53) / 0.23;
    return Math.max(0, 1950 * (1 - d));
  };

  const samples = TransectHelpers.sampleTransectPath(waypoints, sampleHeight, {
    sampleCount: 61,
    mapPoint: (lat: number, lng: number) => ({ x: (lng - 126.53) * 100, z: (33.36 - lat) * 100 })
  });

  assert.equal(samples.length, 61);
  assert.equal(samples[0].distanceKm, 0);
  assert.equal(samples[0].name, '서쪽 기점');
  assert.equal(samples[samples.length - 1].name, '동쪽 종점');

  // Uniform distance spacing check
  const step0 = samples[1].distanceKm - samples[0].distanceKm;
  const stepLast = samples[60].distanceKm - samples[59].distanceKm;
  assert.ok(Math.abs(step0 - stepLast) < 0.05, 'samples should have near-uniform km spacing');

  const metrics = TransectHelpers.computeTransectMetrics(samples);
  assert.ok(metrics.maxElevM > 1900 && metrics.maxElevM <= 1950);
  assert.ok(metrics.minElevM >= 0 && metrics.minElevM < 20);
  assert.ok(metrics.totalDistKm > 40 && metrics.totalDistKm < 46);
  assert.ok(metrics.totalGainM > 1900, 'ascent gain should capture full ridge climb');
  assert.ok(metrics.totalLossM > 1900, 'descent loss should capture ridge descent');
  assert.ok(metrics.maxSlopePct > 5 && metrics.avgSlopePct > 4);
  assert.equal(metrics.peakIndex, 30);

  // Snapping from 3D terrain coordinate back to nearest sample
  const snapped = TransectHelpers.nearestSampleByCoord(samples, 33.36, 126.53, 5);
  assert.ok(snapped);
  assert.equal(snapped.index, 30);
  assert.equal(TransectHelpers.nearestSampleByCoord(samples, 37.5, 127.0, 5), null);
});

test('TransectHelpers simplifies freehand drag waypoints and cleanState validates custom-path within region bounds', () => {
  const denseDrag = [
    { lat: 33.3500, lng: 126.4000 },
    { lat: 33.3501, lng: 126.4002 }, // < 30m away, should be pruned
    { lat: 33.3550, lng: 126.4500 },
    { lat: 33.3617, lng: 126.5292 }
  ];
  const simplified = TransectHelpers.simplifyWaypoints(denseDrag, 0.25);
  assert.equal(simplified.length, 3);

  const cleaned = cleanState({
    markers: [],
    elevationProfileOpen: true,
    elevationTransectMode: 'custom-path',
    customTransect: [
      { lat: 33.35, lng: 126.40 },
      { lat: 38.00, lng: 128.00 }, // outside Jeju bounds -> dropped
      { lat: 33.37, lng: 126.55 }
    ]
  }, REGIONS.jeju.bounds);

  assert.equal(cleaned.elevationTransectMode, 'custom-path');
  assert.equal(cleaned.customTransect.length, 2);
});

test('TransectHelpers builds closed 3D Vertical Slice cut-block geometry and detects straight vs curved paths', () => {
  const straightSamples = [
    { index: 0, lat: 33.36, lng: 126.2, x: -50, z: 0, distanceKm: 0, elevationM: 10 },
    { index: 1, lat: 33.36, lng: 126.5, x: 0, z: 0, distanceKm: 25, elevationM: 1620 },
    { index: 2, lat: 33.36, lng: 126.8, x: 50, z: 0, distanceKm: 50, elevationM: 25 }
  ];
  assert.equal(TransectHelpers.isPathCollinear(straightSamples, 0.05), true);

  const curvedSamples = [
    { index: 0, lat: 33.36, lng: 126.2, x: -50, z: 0, distanceKm: 0, elevationM: 10 },
    { index: 1, lat: 33.42, lng: 126.5, x: 0, z: -22, distanceKm: 28, elevationM: 1200 },
    { index: 2, lat: 33.36, lng: 126.8, x: 50, z: 0, distanceKm: 56, elevationM: 25 }
  ];
  assert.equal(TransectHelpers.isPathCollinear(curvedSamples, 0.05), false);

  const cutPlane = TransectHelpers.computeSliceCutPlaneParams(straightSamples);
  assert.ok(cutPlane);
  assert.equal(cutPlane.midX, 0);
  assert.equal(cutPlane.midZ, 0);
  assert.equal(cutPlane.normalX, 0);
  assert.equal(cutPlane.normalZ, 1);

  const panelSlice = TransectHelpers.buildVerticalSliceGeometryData(straightSamples, {
    mode: 'panel',
    halfWidth: 6.0,
    bedrockY: -12,
    maxElevM: 1620
  });
  assert.ok(panelSlice.stats.vertexCount > 60);
  assert.ok(panelSlice.stats.triangleCount > 30);
  assert.equal(panelSlice.positions.length, panelSlice.stats.vertexCount * 3);
  assert.equal(panelSlice.colors.length, panelSlice.stats.vertexCount * 3);
  assert.equal(panelSlice.indices.length, panelSlice.stats.triangleCount * 3);
  for (let i = 0; i < panelSlice.positions.length; i++) {
    assert.ok(Number.isFinite(panelSlice.positions[i]), `Position[${i}] must be finite`);
  }

  const worldSlice = TransectHelpers.buildVerticalSliceGeometryData(curvedSamples, {
    mode: 'world',
    halfWidth: 1.5,
    bedrockY: -4.0,
    maxElevM: 1620,
    getSurfaceY: (s: any) => s.elevationM * 0.006
  });
  assert.ok(worldSlice.stats.triangleCount > 30);

  assert.equal(TransectHelpers.getStrataInfo(20, 800).key, 'topsoil');
  assert.equal(TransectHelpers.getStrataInfo(140, 800).key, 'volcanic-tuff');
  assert.equal(TransectHelpers.getStrataInfo(350, 800).key, 'basalt-crust');
  assert.equal(TransectHelpers.getStrataInfo(700, 800).key, 'bedrock');

  const sliceState = cleanState({ markers: [], verticalSliceMode: true, elevationProfileOpen: true });
  assert.equal(sliceState.verticalSliceMode, true);
});






