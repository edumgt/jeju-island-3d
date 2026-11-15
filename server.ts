import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const PlaceSearchHelpers = require('./assets/place-search-helpers.js');

const SOLUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

const REGION_BOUNDS: Record<
  string,
  { west: number; south: number; east: number; north: number; name: string }
> = {
  jeju: { west: 126.12, south: 33.15, east: 127.00, north: 33.60, name: '제주도' },
  haeundae: { west: 129.130, south: 35.145, east: 129.200, north: 35.195, name: '부산 해운대' },
  incheon: { west: 126.350, south: 37.330, east: 126.750, north: 37.560, name: '인천' },
  gangneung: { west: 128.360, south: 37.620, east: 129.060, north: 38.225, name: '강릉·경포' },
  yeongam: { west: 126.382, south: 34.712, east: 126.498, north: 34.782, name: '전남 영암' }
};

function getMapsApiKey(): string {
  return (
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.MAPS_API_KEY ||
    ''
  ).trim();
}

function getBoundsFromQuery(req: Request) {
  const regionId = String(req.query.region || 'jeju');
  const fallback = REGION_BOUNDS[regionId] || REGION_BOUNDS.jeju;
  const south = Number(req.query.south);
  const west = Number(req.query.west);
  const north = Number(req.query.north);
  const east = Number(req.query.east);
  if (
    Number.isFinite(south) &&
    Number.isFinite(west) &&
    Number.isFinite(north) &&
    Number.isFinite(east) &&
    south < north
  ) {
    return { south, west, north, east };
  }
  return { south: fallback.south, west: fallback.west, north: fallback.north, east: fallback.east };
}

function getRegionsBoundsMap() {
  const map: Record<string, { bounds: { west: number; south: number; east: number; north: number } }> = {};
  for (const [id, r] of Object.entries(REGION_BOUNDS)) {
    map[id] = { bounds: { west: r.west, south: r.south, east: r.east, north: r.north } };
  }
  return map;
}

async function callReverseGeocoding(lat: number, lng: number, apiKey: string) {
  const v4Url = new URL('https://geocode.googleapis.com/v4/geocode/location');
  v4Url.searchParams.set('location.latitude', String(lat));
  v4Url.searchParams.set('location.longitude', String(lng));
  v4Url.searchParams.set('languageCode', 'ko');
  v4Url.searchParams.set('regionCode', 'KR');

  const v4Res = await fetch(v4Url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'results.placeId,results.formattedAddress,results.addressComponents,results.location,results.types,results.granularity',
      'X-Goog-Maps-Solution-ID': SOLUTION_ID
    }
  });
  const v4Payload = await v4Res.json().catch(() => ({}));

  if (PlaceSearchHelpers.isQuotaExceededResponse(v4Res.status, v4Payload)) {
    return { status: 429, payload: v4Payload, quotaExceeded: true };
  }
  if (v4Res.ok) {
    return { status: 200, payload: v4Payload, quotaExceeded: false };
  }

  // Fallback to standard Geocoding REST API if v4 endpoint is unavailable for this key
  const v3Url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  v3Url.searchParams.set('latlng', `${lat},${lng}`);
  v3Url.searchParams.set('language', 'ko');
  v3Url.searchParams.set('region', 'kr');
  v3Url.searchParams.set('key', apiKey);

  const v3Res = await fetch(v3Url.toString(), {
    method: 'GET',
    headers: { 'X-Goog-Maps-Solution-ID': SOLUTION_ID }
  });
  const v3Payload = await v3Res.json().catch(() => ({}));
  if (PlaceSearchHelpers.isQuotaExceededResponse(v3Res.status, v3Payload)) {
    return { status: 429, payload: v3Payload, quotaExceeded: true };
  }
  return { status: v3Res.ok ? 200 : v3Res.status, payload: v3Payload, quotaExceeded: false };
}

async function callAddressGeocoding(
  addressQuery: string,
  bounds: { west: number; south: number; east: number; north: number },
  apiKey: string
) {
  const v4Url = new URL(
    `https://geocode.googleapis.com/v4/geocode/address/${encodeURIComponent(addressQuery)}`
  );
  v4Url.searchParams.set('languageCode', 'ko');
  v4Url.searchParams.set('regionCode', 'KR');
  v4Url.searchParams.set('locationBias.rectangle.low.latitude', String(bounds.south));
  v4Url.searchParams.set('locationBias.rectangle.low.longitude', String(bounds.west));
  v4Url.searchParams.set('locationBias.rectangle.high.latitude', String(bounds.north));
  v4Url.searchParams.set('locationBias.rectangle.high.longitude', String(bounds.east));

  const v4Res = await fetch(v4Url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'results.placeId,results.formattedAddress,results.addressComponents,results.location,results.types,results.granularity',
      'X-Goog-Maps-Solution-ID': SOLUTION_ID
    }
  });
  const v4Payload = await v4Res.json().catch(() => ({}));
  if (PlaceSearchHelpers.isQuotaExceededResponse(v4Res.status, v4Payload)) {
    return { status: 429, payload: v4Payload, quotaExceeded: true };
  }
  if (v4Res.ok) {
    return { status: 200, payload: v4Payload, quotaExceeded: false };
  }

  const v3Url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  v3Url.searchParams.set('address', addressQuery);
  v3Url.searchParams.set('bounds', `${bounds.south},${bounds.west}|${bounds.north},${bounds.east}`);
  v3Url.searchParams.set('language', 'ko');
  v3Url.searchParams.set('region', 'kr');
  v3Url.searchParams.set('key', apiKey);

  const v3Res = await fetch(v3Url.toString(), {
    method: 'GET',
    headers: { 'X-Goog-Maps-Solution-ID': SOLUTION_ID }
  });
  const v3Payload = await v3Res.json().catch(() => ({}));
  if (PlaceSearchHelpers.isQuotaExceededResponse(v3Res.status, v3Payload)) {
    return { status: 429, payload: v3Payload, quotaExceeded: true };
  }
  return { status: v3Res.ok ? 200 : v3Res.status, payload: v3Payload, quotaExceeded: false };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/places/status', (_req: Request, res: Response) => {
    res.json({
      configured: Boolean(getMapsApiKey()),
      solutionId: SOLUTION_ID
    });
  });

  app.get('/api/geocode/reverse', async (req: Request, res: Response) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      res.status(400).json({ error: { status: 'INVALID_ARGUMENT', message: 'Invalid coordinates' }, suggestions: [] });
      return;
    }

    const apiKey = getMapsApiKey();
    if (!apiKey) {
      res.status(503).json({
        error: { status: 'API_KEY_UNCONFIGURED', message: 'Google Maps API key not configured' },
        suggestions: []
      });
      return;
    }

    try {
      const bounds = getBoundsFromQuery(req);
      const regionsMap = getRegionsBoundsMap();
      const result = await callReverseGeocoding(lat, lng, apiKey);

      if (result.quotaExceeded) {
        res.status(429).json({
          error: { status: 'RESOURCE_EXHAUSTED', message: 'Google Maps Platform quota reached' },
          suggestions: []
        });
        return;
      }

      if (result.status !== 200) {
        res.status(result.status >= 400 ? result.status : 502).json({
          error: { status: 'UPSTREAM_ERROR', message: 'Reverse geocoding request failed' },
          suggestions: []
        });
        return;
      }

      const suggestions = PlaceSearchHelpers.normalizeReverseGeocodeResults(
        result.payload,
        bounds,
        regionsMap,
        { lat, lng }
      );
      res.json({
        mode: 'reverse-geocode',
        apiUsed: 'Geocoding API (Reverse Geocoding)',
        queryCoords: { lat, lng },
        suggestions
      });
    } catch (err) {
      console.error('Reverse geocode proxy error:', err);
      res.status(502).json({ error: { status: 'INTERNAL_ERROR', message: 'Reverse geocode error' }, suggestions: [] });
    }
  });

  app.get('/api/places/suggest', async (req: Request, res: Response) => {
    const query = String(req.query.q || '').trim();
    if (!query) {
      res.json({ mode: 'empty', suggestions: [] });
      return;
    }

    const apiKey = getMapsApiKey();
    if (!apiKey) {
      res.status(503).json({
        error: { status: 'API_KEY_UNCONFIGURED', message: 'Google Maps API key not configured' },
        suggestions: []
      });
      return;
    }

    const bounds = getBoundsFromQuery(req);
    const regionsMap = getRegionsBoundsMap();
    const originLat = Number.isFinite(Number(req.query.lat))
      ? Number(req.query.lat)
      : (bounds.south + bounds.north) * 0.5;
    const originLng = Number.isFinite(Number(req.query.lng))
      ? Number(req.query.lng)
      : (bounds.west + bounds.east) * 0.5;

    try {
      // 1. Coordinate input -> Reverse Geocoding API
      const coords = PlaceSearchHelpers.parseCoordinateQuery(query);
      if (coords) {
        const rev = await callReverseGeocoding(coords.lat, coords.lng, apiKey);
        if (rev.quotaExceeded) {
          res.status(429).json({
            error: { status: 'RESOURCE_EXHAUSTED', message: 'Google Maps Platform quota reached' },
            suggestions: []
          });
          return;
        }
        const suggestions = PlaceSearchHelpers.normalizeReverseGeocodeResults(
          rev.payload,
          bounds,
          regionsMap,
          { lat: originLat, lng: originLng }
        );
        res.json({
          mode: 'reverse-geocode',
          apiUsed: 'Geocoding API (Reverse Geocoding)',
          queryCoords: coords,
          suggestions
        });
        return;
      }

      // 2. Text query -> Places API (New) Autocomplete biased to current 3D map viewport
      const sessionToken = String(req.query.sessionToken || '').trim();
      const bodyPayload: Record<string, unknown> = {
        input: query,
        languageCode: 'ko',
        regionCode: 'kr',
        includedRegionCodes: ['kr'],
        origin: { latitude: originLat, longitude: originLng },
        locationBias: {
          rectangle: PlaceSearchHelpers.buildViewportRectangle(bounds)
        }
      };
      if (sessionToken) bodyPayload.sessionToken = sessionToken;

      const autoRes = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types,suggestions.placePrediction.distanceMeters',
          'X-Goog-Maps-Solution-ID': SOLUTION_ID
        },
        body: JSON.stringify(bodyPayload)
      });
      const autoData = await autoRes.json().catch(() => ({}));

      if (PlaceSearchHelpers.isQuotaExceededResponse(autoRes.status, autoData)) {
        res.status(429).json({
          error: { status: 'RESOURCE_EXHAUSTED', message: 'Google Maps Platform quota reached' },
          suggestions: []
        });
        return;
      }

      let suggestions = autoRes.ok ? PlaceSearchHelpers.normalizeAutocompleteSuggestions(autoData) : [];

      // Fallback or address supplement via Geocoding API when autocomplete yields 0 or fails non-quota
      if (!suggestions.length) {
        const geo = await callAddressGeocoding(query, bounds, apiKey);
        if (geo.quotaExceeded) {
          res.status(429).json({
            error: { status: 'RESOURCE_EXHAUSTED', message: 'Google Maps Platform quota reached' },
            suggestions: []
          });
          return;
        }
        if (geo.status === 200) {
          suggestions = PlaceSearchHelpers.normalizeReverseGeocodeResults(
            geo.payload,
            bounds,
            regionsMap,
            { lat: originLat, lng: originLng }
          ).map((s: Record<string, unknown>) => ({ ...s, source: 'geocoding' }));
        }
      }

      res.json({
        mode: suggestions.some((s: Record<string, unknown>) => s.source === 'geocoding')
          ? 'geocoding'
          : 'autocomplete',
        apiUsed: suggestions.some((s: Record<string, unknown>) => s.source === 'geocoding')
          ? 'Geocoding API'
          : 'Places API (New) Autocomplete',
        suggestions
      });
    } catch (err) {
      console.error('Places suggest proxy error:', err);
      res.status(502).json({ error: { status: 'INTERNAL_ERROR', message: 'Place suggestion error' }, suggestions: [] });
    }
  });

  app.get('/api/places/details', async (req: Request, res: Response) => {
    const placeId = String(req.query.placeId || '').trim();
    if (!placeId) {
      res.status(400).json({ error: { status: 'INVALID_ARGUMENT', message: 'Missing placeId' } });
      return;
    }

    const apiKey = getMapsApiKey();
    if (!apiKey) {
      res.status(503).json({
        error: { status: 'API_KEY_UNCONFIGURED', message: 'Google Maps API key not configured' }
      });
      return;
    }

    const sessionToken = String(req.query.sessionToken || '').trim();
    const bounds = getBoundsFromQuery(req);
    const regionsMap = getRegionsBoundsMap();

    try {
      const detailsUrl = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
      detailsUrl.searchParams.set('languageCode', 'ko');
      detailsUrl.searchParams.set('regionCode', 'kr');
      if (sessionToken) detailsUrl.searchParams.set('sessionToken', sessionToken);

      const detailsRes = await fetch(detailsUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,shortFormattedAddress,location,types',
          'X-Goog-Maps-Solution-ID': SOLUTION_ID
        }
      });
      const detailsData = await detailsRes.json().catch(() => ({}));

      if (PlaceSearchHelpers.isQuotaExceededResponse(detailsRes.status, detailsData)) {
        res.status(429).json({
          error: { status: 'RESOURCE_EXHAUSTED', message: 'Google Maps Platform quota reached' }
        });
        return;
      }

      if (!detailsRes.ok) {
        res.status(detailsRes.status >= 400 ? detailsRes.status : 502).json({
          error: { status: 'UPSTREAM_ERROR', message: 'Place details lookup failed' }
        });
        return;
      }

      const place = PlaceSearchHelpers.normalizePlaceDetails(detailsData, bounds, regionsMap);
      if (!place) {
        res.status(404).json({ error: { status: 'NOT_FOUND', message: 'Place coordinates unavailable' } });
        return;
      }

      // Enrich with reverse geocoding address verification when coordinates resolve cleanly
      let reverseContext = null;
      try {
        const rev = await callReverseGeocoding(place.lat, place.lng, apiKey);
        if (!rev.quotaExceeded && rev.status === 200) {
          const revList = PlaceSearchHelpers.normalizeReverseGeocodeResults(
            rev.payload,
            bounds,
            regionsMap,
            { lat: place.lat, lng: place.lng }
          );
          if (revList.length > 0) reverseContext = revList[0];
        }
      } catch (_) {
        // Non-blocking enrichment
      }

      res.json({ place, reverseContext });
    } catch (err) {
      console.error('Place details proxy error:', err);
      res.status(502).json({ error: { status: 'INTERNAL_ERROR', message: 'Place details error' } });
    }
  });

  const isProd = process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start';
  if (isProd && fs.existsSync(path.resolve('dist/index.html'))) {
    app.use(express.static(path.resolve('dist')));
    app.use(express.static(path.resolve('public')));
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);

    app.get('/', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('index.html'));
    });
    app.use('/assets', express.static(path.resolve('assets')));
    app.use('/vendor', express.static(path.resolve('vendor')));
    app.use(express.static(path.resolve('.')));
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
