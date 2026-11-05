import test from 'node:test';
import assert from 'node:assert/strict';

const REGIONS = {
  jeju: {
    bounds: { west: 126.12, south: 33.15, east: 127.00, north: 33.60 }
  },
  haeundae: {
    bounds: { west: 129.130, south: 35.145, east: 129.200, north: 35.195 }
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
    showRoads: raw.showRoads !== false
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
