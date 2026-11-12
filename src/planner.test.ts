import test from 'node:test';
import assert from 'node:assert/strict';

const REGIONS = {
  jeju: {
    bounds: { west: 126.12, south: 33.15, east: 127.00, north: 33.60 }
  },
  haeundae: {
    bounds: { west: 129.130, south: 35.145, east: 129.200, north: 35.195 }
  },
  incheon: {
    bounds: { west: 126.350, south: 37.330, east: 126.750, north: 37.560 }
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
    elevationTransectMode: ['west-east', 'north-south', 'places-route'].includes(raw.elevationTransectMode) ? raw.elevationTransectMode : 'west-east'
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

test('cleanState parses weather, solar and elevation profile settings correctly', () => {
  const rainState = cleanState({
    markers: [],
    weather: 'rain',
    weatherIntensity: 3,
    windEffect: false,
    solarDate: '2026-06-21',
    solarTime: 1140, // 19:00
    solarLiveSync: true,
    elevationProfileOpen: true,
    elevationTransectMode: 'places-route'
  });
  assert.equal(rainState.weather, 'rain');
  assert.equal(rainState.weatherIntensity, 3);
  assert.equal(rainState.windEffect, false);
  assert.equal(rainState.solarDate, '2026-06-21');
  assert.equal(rainState.solarTime, 1140);
  assert.equal(rainState.solarLiveSync, true);
  assert.equal(rainState.elevationProfileOpen, true);
  assert.equal(rainState.elevationTransectMode, 'places-route');

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
    elevationProfileOpen: true
  });

  const parsedUrl = new URL(url);
  assert.equal(parsedUrl.searchParams.get('region'), 'incheon');
  assert.equal(parsedUrl.searchParams.get('sel'), 'incheon-bridge');
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
});
