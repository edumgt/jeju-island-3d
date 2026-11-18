(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.PlaceSearchHelpers = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DEFAULT_REGION_CENTERS = {
    jeju: { lat: 33.38, lng: 126.56 },
    haeundae: { lat: 35.166, lng: 129.165 },
    incheon: { lat: 37.445, lng: 126.55 },
    gangneung: { lat: 37.90, lng: 128.72 },
    yeongam: { lat: 34.745, lng: 126.44 },
    danyang: { lat: 36.965, lng: 128.220 }
  };

  function parseCoordinateQuery(raw) {
    if (typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;

    // Strip optional degree symbols, N/E indicators, bullet separators, extra punctuation
    const normalized = trimmed
      .replace(/[°º]/g, ' ')
      .replace(/[·|/;]/g, ',')
      .replace(/\s+/g, ' ');

    const match = normalized.match(
      /^([+-]?\d{1,3}(?:\.\d+)?)\s*([NSns])?\s*(?:,|\s)\s*([+-]?\d{1,3}(?:\.\d+)?)\s*([EWew])?$/
    );
    if (!match) return null;

    let lat = Number(match[1]);
    let lng = Number(match[3]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    if (match[2] && match[2].toUpperCase() === 'S') lat = -Math.abs(lat);
    if (match[4] && match[4].toUpperCase() === 'W') lng = -Math.abs(lng);

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat, lng };
  }

  function isWithinBounds(lat, lng, bounds) {
    if (!bounds || !Number.isFinite(lat) || !Number.isFinite(lng)) return false;
    return (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    );
  }

  function findMatchingRegionId(lat, lng, regionsMap) {
    if (!regionsMap || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const entries = Object.entries(regionsMap);
    for (let i = 0; i < entries.length; i++) {
      const id = entries[i][0];
      const region = entries[i][1];
      if (region && region.bounds && isWithinBounds(lat, lng, region.bounds)) {
        return id;
      }
    }
    return null;
  }

  function haversineDistanceKm(lat1, lng1, lat2, lng2) {
    if (
      !Number.isFinite(lat1) ||
      !Number.isFinite(lng1) ||
      !Number.isFinite(lat2) ||
      !Number.isFinite(lng2)
    ) {
      return null;
    }
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function buildViewportRectangle(bounds) {
    if (!bounds) return null;
    const south = Number(bounds.south);
    const west = Number(bounds.west);
    const north = Number(bounds.north);
    const east = Number(bounds.east);
    if (
      !Number.isFinite(south) ||
      !Number.isFinite(west) ||
      !Number.isFinite(north) ||
      !Number.isFinite(east) ||
      south > north
    ) {
      return null;
    }
    return {
      low: { latitude: south, longitude: west },
      high: { latitude: north, longitude: east }
    };
  }

  function extractReadablePlaceName(result) {
    if (!result || typeof result !== 'object') return '선택한 위치';
    const comps = Array.isArray(result.addressComponents)
      ? result.addressComponents
      : Array.isArray(result.address_components)
        ? result.address_components
        : [];

    const isBareNumber = (txt) => /^\d+(?:-\d+)?$/.test(txt);

    const landmarkTypes = [
      'point_of_interest',
      'natural_feature',
      'establishment',
      'park',
      'airport',
      'landmark',
      'tourist_attraction'
    ];

    for (let t = 0; t < landmarkTypes.length; t++) {
      const targetType = landmarkTypes[t];
      for (let c = 0; c < comps.length; c++) {
        const comp = comps[c];
        const types = Array.isArray(comp.types) ? comp.types : [];
        if (types.includes(targetType)) {
          const text = comp.longText || comp.long_name || comp.shortText || comp.short_name;
          if (text && typeof text === 'string' && text.trim() && !isBareNumber(text.trim())) {
            return text.trim();
          }
        }
      }
    }

    const formatted = result.formattedAddress || result.formatted_address || '';
    if (typeof formatted === 'string' && formatted.trim()) {
      const stripped = formatted.replace(/^대한민국\s*/, '').trim();
      const parts = stripped.split(/\s+/).filter(Boolean);
      if (parts.length >= 3) {
        return parts.slice(-3).join(' ');
      }
      return stripped || formatted.trim();
    }

    const areaTypes = ['sublocality_level_2', 'sublocality_level_1', 'neighborhood', 'route', 'locality'];
    for (let t = 0; t < areaTypes.length; t++) {
      const targetType = areaTypes[t];
      for (let c = 0; c < comps.length; c++) {
        const comp = comps[c];
        const types = Array.isArray(comp.types) ? comp.types : [];
        if (types.includes(targetType)) {
          const text = comp.longText || comp.long_name || comp.shortText || comp.short_name;
          if (text && typeof text === 'string' && text.trim() && !isBareNumber(text.trim())) {
            return text.trim();
          }
        }
      }
    }
    return '선택한 위치';
  }

  function formatCategoryFromTypes(types) {
    if (!Array.isArray(types) || !types.length) return '지도 검색';
    if (types.includes('airport')) return '공항';
    if (types.includes('natural_feature') || types.includes('park')) return '자연·공원';
    if (types.includes('tourist_attraction') || types.includes('point_of_interest')) return '명소';
    if (types.includes('street_address') || types.includes('premise') || types.includes('route')) return '도로·주소';
    if (types.includes('sublocality') || types.includes('locality') || types.includes('administrative_area_level_1')) {
      return '행정구역';
    }
    return '지도 검색';
  }

  function normalizeReverseGeocodeResults(payload, activeBounds, regionsMap, origin) {
    const rawResults = payload && Array.isArray(payload.results) ? payload.results : [];
    const seen = new Set();
    const out = [];

    for (let i = 0; i < rawResults.length; i++) {
      const r = rawResults[i];
      if (!r) continue;
      const lat =
        r.location && Number.isFinite(r.location.latitude)
          ? Number(r.location.latitude)
          : r.geometry && r.geometry.location && Number.isFinite(r.geometry.location.lat)
            ? Number(r.geometry.location.lat)
            : null;
      const lng =
        r.location && Number.isFinite(r.location.longitude)
          ? Number(r.location.longitude)
          : r.geometry && r.geometry.location && Number.isFinite(r.geometry.location.lng)
            ? Number(r.geometry.location.lng)
            : null;
      if (lat === null || lng === null) continue;

      const address = String(r.formattedAddress || r.formatted_address || '').trim();
      const name = extractReadablePlaceName(r);
      const dedupeKey = `${name}|${lat.toFixed(4)}|${lng.toFixed(4)}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const types = Array.isArray(r.types) ? r.types : [];
      const matchedRegionId = findMatchingRegionId(lat, lng, regionsMap);
      const inBounds = activeBounds ? isWithinBounds(lat, lng, activeBounds) : Boolean(matchedRegionId);
      const distKm = origin ? haversineDistanceKm(origin.lat, origin.lng, lat, lng) : null;

      out.push({
        id: r.placeId || r.place_id || `rev-${lat.toFixed(5)}-${lng.toFixed(5)}-${i}`,
        placeId: r.placeId || r.place_id || '',
        name: name.slice(0, 48),
        address: address || `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`,
        category: formatCategoryFromTypes(types),
        lat,
        lng,
        types,
        source: 'reverse-geocode',
        needsDetails: false,
        inBounds,
        matchedRegionId,
        distanceKm: distKm !== null && distKm >= 0.05 ? Number(distKm.toFixed(1)) : null
      });

      if (out.length >= 6) break;
    }

    const isPlusCodeItem = (item) =>
      item.types.includes('plus_code') ||
      /^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,}$/i.test(item.name);
    const nonPlusCode = out.filter((item) => !isPlusCodeItem(item));
    return nonPlusCode.length > 0 ? nonPlusCode : out;
  }

  function normalizeAutocompleteSuggestions(payload) {
    const list = payload && Array.isArray(payload.suggestions) ? payload.suggestions : [];
    const seen = new Set();
    const out = [];

    for (let i = 0; i < list.length; i++) {
      const pred = list[i] && list[i].placePrediction;
      if (!pred || !pred.placeId) continue;
      if (seen.has(pred.placeId)) continue;
      seen.add(pred.placeId);

      const mainText =
        pred.structuredFormat && pred.structuredFormat.mainText && pred.structuredFormat.mainText.text
          ? pred.structuredFormat.mainText.text
          : pred.text && pred.text.text
            ? pred.text.text
            : '';
      if (!mainText.trim()) continue;

      const secondaryText =
        pred.structuredFormat &&
        pred.structuredFormat.secondaryText &&
        pred.structuredFormat.secondaryText.text
          ? pred.structuredFormat.secondaryText.text
          : pred.text && pred.text.text
            ? pred.text.text
            : '';

      const types = Array.isArray(pred.types) ? pred.types : [];
      const distMeters = Number(pred.distanceMeters);
      const distKm =
        Number.isFinite(distMeters) && distMeters >= 100
          ? Number((distMeters / 1000).toFixed(1))
          : null;

      out.push({
        id: pred.placeId,
        placeId: pred.placeId,
        name: mainText.trim().slice(0, 48),
        address: secondaryText.trim(),
        category: formatCategoryFromTypes(types),
        lat: null,
        lng: null,
        types,
        source: 'places-autocomplete',
        needsDetails: true,
        inBounds: null,
        matchedRegionId: null,
        distanceKm: distKm
      });
    }

    return out;
  }

  function normalizePlaceDetails(payload, activeBounds, regionsMap) {
    if (!payload || typeof payload !== 'object' || !payload.location) return null;
    const lat = Number(payload.location.latitude);
    const lng = Number(payload.location.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const name =
      (payload.displayName && payload.displayName.text) ||
      payload.shortFormattedAddress ||
      payload.formattedAddress ||
      '선택한 장소';
    const address = payload.formattedAddress || payload.shortFormattedAddress || '';
    const types = Array.isArray(payload.types) ? payload.types : [];
    const matchedRegionId = findMatchingRegionId(lat, lng, regionsMap);
    const inBounds = activeBounds ? isWithinBounds(lat, lng, activeBounds) : Boolean(matchedRegionId);

    return {
      id: payload.id || `place-${lat.toFixed(5)}-${lng.toFixed(5)}`,
      placeId: payload.id || '',
      name: String(name).trim().slice(0, 48),
      address: String(address).trim(),
      category: formatCategoryFromTypes(types),
      lat,
      lng,
      types,
      source: 'place-details',
      needsDetails: false,
      inBounds,
      matchedRegionId,
      distanceKm: null
    };
  }

  function isQuotaExceededResponse(status, payload) {
    if (status === 429) return true;
    if (!payload || typeof payload !== 'object') return false;

    const apiStatus = payload.status || (payload.error && payload.error.status) || '';
    const apiCode = (payload.error && payload.error.code) || 0;
    const message = String((payload.error && payload.error.message) || payload.error_message || '');

    // Explicitly avoid false positives on normal empty results or not found
    if (apiStatus === 'ZERO_RESULTS' || apiStatus === 'NOT_FOUND' || status === 404) {
      return false;
    }

    return (
      apiCode === 429 ||
      apiStatus === 'RESOURCE_EXHAUSTED' ||
      apiStatus === 'OVER_QUERY_LIMIT' ||
      /OverQuotaMapError|QuotaExceededError|quota exceeded/i.test(message)
    );
  }

  return {
    DEFAULT_REGION_CENTERS,
    parseCoordinateQuery,
    isWithinBounds,
    findMatchingRegionId,
    haversineDistanceKm,
    buildViewportRectangle,
    extractReadablePlaceName,
    formatCategoryFromTypes,
    normalizeReverseGeocodeResults,
    normalizeAutocompleteSuggestions,
    normalizePlaceDetails,
    isQuotaExceededResponse
  };
});
