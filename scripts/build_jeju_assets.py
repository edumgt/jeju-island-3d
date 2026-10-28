"""Build the static Jeju outline and elevation textures used by test.html.

Sources:
  Natural Earth 1:10m land polygons (public domain), for island identification
  Mapzen Terrain Tiles, terrarium format (SRTM / USGS in this region), for
  elevation and a finer shoreline approximation
See https://www.naturalearthdata.com/about/terms-of-use/ and
https://github.com/tilezen/joerd/blob/master/docs/attribution.md.

Requires requests, numpy, Pillow, and OpenCV. Run from the repository root.
"""

from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import base64
import json
import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
import requests


ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
BOUNDS = (126.12, 33.15, 127.00, 33.60)  # west, south, east, north
WIDTH, HEIGHT = 512, 256
ZOOM = 11
OUTLINE_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
    "master/geojson/ne_10m_land.geojson"
)
TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"


def get_outline():
    data = requests.get(OUTLINE_URL, timeout=30).json()
    candidates = []
    for feature in data["features"]:
        geometry = feature["geometry"]
        polygons = (
            geometry["coordinates"]
            if geometry["type"] == "MultiPolygon"
            else [geometry["coordinates"]]
        )
        for polygon in polygons:
            ring = polygon[0]
            lons = [p[0] for p in ring]
            lats = [p[1] for p in ring]
            if (126.1 < min(lons) < 126.3 and 126.8 < max(lons) < 127.1
                    and 33.1 < min(lats) < 33.3 and 33.5 < max(lats) < 33.7):
                candidates.append(ring)
    if len(candidates) != 1:
        raise RuntimeError(f"Expected one Jeju outline, found {len(candidates)}")
    return [[round(lon, 6), round(lat, 6)] for lon, lat in candidates[0]]


def tile_position(lon, lat):
    scale = 2 ** ZOOM
    return (
        (lon + 180) / 360 * scale,
        (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * scale,
    )


def get_tile(position):
    x, y = position
    response = requests.get(TILE_URL.format(z=ZOOM, x=x, y=y), timeout=30)
    response.raise_for_status()
    rgb = np.asarray(Image.open(BytesIO(response.content)).convert("RGB"), dtype=np.float32)
    return position, rgb[:, :, 0] * 256 + rgb[:, :, 1] + rgb[:, :, 2] / 256 - 32768


def get_elevation():
    west, south, east, north = BOUNDS
    x0, y0 = tile_position(west, north)
    x1, y1 = tile_position(east, south)
    min_x, max_x = math.floor(x0), math.floor(x1)
    min_y, max_y = math.floor(y0), math.floor(y1)
    positions = [(x, y) for y in range(min_y, max_y + 1) for x in range(min_x, max_x + 1)]
    mosaic = np.empty(((max_y - min_y + 1) * 256, (max_x - min_x + 1) * 256), dtype=np.float32)
    with ThreadPoolExecutor(max_workers=8) as pool:
        for (x, y), tile in pool.map(get_tile, positions):
            mosaic[(y - min_y) * 256:(y - min_y + 1) * 256,
                   (x - min_x) * 256:(x - min_x + 1) * 256] = tile

    lon = west + (np.arange(WIDTH) + 0.5) / WIDTH * (east - west)
    lat = north - (np.arange(HEIGHT) + 0.5) / HEIGHT * (north - south)
    tile_x = (lon + 180) / 360 * 2 ** ZOOM
    tile_y = (1 - np.arcsinh(np.tan(np.radians(lat))) / np.pi) / 2 * 2 ** ZOOM
    px = np.clip((tile_x - min_x) * 256 - 0.5, 0, mosaic.shape[1] - 1.001)
    py = np.clip((tile_y - min_y) * 256 - 0.5, 0, mosaic.shape[0] - 1.001)
    xx, yy = np.meshgrid(px, py)
    ix, iy = xx.astype(int), yy.astype(int)
    fx, fy = xx - ix, yy - iy
    elevation = (
        mosaic[iy, ix] * (1 - fx) * (1 - fy)
        + mosaic[iy, ix + 1] * fx * (1 - fy)
        + mosaic[iy + 1, ix] * (1 - fx) * fy
        + mosaic[iy + 1, ix + 1] * fx * fy
    )
    return np.clip(elevation, 0, 2000)


def make_shoreline(elevation, reference_outline):
    # Use the Natural Earth polygon to identify Jeju, then follow the local DEM's
    # land/water boundary at the raster resolution used by this small viewer.
    land = (elevation > 0.5).astype(np.uint8)
    count, labels, stats, centroids = cv2.connectedComponentsWithStats(land, 8)
    if count < 2:
        raise RuntimeError("No land found in Jeju elevation tiles")
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    cx, cy = centroids[largest]
    west, south, east, north = BOUNDS
    lon = west + cx / WIDTH * (east - west)
    lat = north - cy / HEIGHT * (north - south)
    if not (min(p[0] for p in reference_outline) < lon < max(p[0] for p in reference_outline)
            and min(p[1] for p in reference_outline) < lat < max(p[1] for p in reference_outline)):
        raise RuntimeError("Largest land component is not Jeju")

    mask = (labels == largest).astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=1)
    contour = max(cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0],
                  key=cv2.contourArea)
    contour = cv2.approxPolyDP(contour, 1.0, True).reshape(-1, 2)
    outline = [[round(west + (float(x) + 0.5) / WIDTH * (east - west), 6),
                round(north - (float(y) + 0.5) / HEIGHT * (north - south), 6)]
               for x, y in contour]
    return outline, Image.fromarray(cv2.GaussianBlur(mask, (0, 0), 0.65), "L")


def make_color_textures(elevation, mask):

    stops = [
        (0, (173, 195, 151)),
        (180, (143, 176, 130)),
        (500, (100, 143, 111)),
        (950, (106, 129, 105)),
        (1450, (137, 137, 121)),
        (2000, (203, 199, 183)),
    ]
    rgb = np.empty((HEIGHT, WIDTH, 3), dtype=np.uint8)
    for channel in range(3):
        rgb[:, :, channel] = np.interp(
            elevation, [stop[0] for stop in stops], [stop[1][channel] for stop in stops]
        ).astype(np.uint8)
    natural = Image.fromarray(np.dstack([rgb, np.asarray(mask)]), "RGBA")

    relief_stops = [
        (0, (226, 235, 195)),
        (250, (156, 201, 148)),
        (650, (76, 153, 127)),
        (1100, (54, 112, 140)),
        (1550, (112, 103, 157)),
        (2000, (222, 211, 219)),
    ]
    for channel in range(3):
        rgb[:, :, channel] = np.interp(
            elevation, [stop[0] for stop in relief_stops],
            [stop[1][channel] for stop in relief_stops]
        ).astype(np.uint8)
    relief = Image.fromarray(np.dstack([rgb, np.asarray(mask)]), "RGBA")
    return natural, relief


def as_data_url(image):
    output = BytesIO()
    image.save(output, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii")


def main():
    ASSETS.mkdir(exist_ok=True)
    reference_outline = get_outline()
    elevation = get_elevation()
    outline, mask = make_shoreline(elevation, reference_outline)
    height_image = Image.fromarray(np.rint(elevation / 2000 * 255).astype(np.uint8), "L")
    natural, relief = make_color_textures(elevation, mask)
    bundle = {
        "height": as_data_url(height_image),
        "natural": as_data_url(natural),
        "elevation": as_data_url(relief),
    }
    (ASSETS / "jeju-textures.js").write_text(
        "// Embedded PNG textures allow test.html to open directly as a local file.\n"
        "// Elevation: Mapzen Terrain Tiles (SRTM / USGS in Jeju).\n"
        "window.JEJU_ASSETS = " + json.dumps(bundle, separators=(",", ":")) + ";\n"
    )
    (ASSETS / "jeju-outline.js").write_text(
        "// Jeju main island shoreline approximation from Mapzen Terrain Tiles / SRTM,\n"
        "// identified with Natural Earth 1:10m land polygons.\n"
        "window.JEJU_OUTLINE = " + json.dumps(outline, ensure_ascii=False, separators=(",", ":")) + ";\n"
    )
    print(f"Built Jeju assets: {len(outline)} coastline points, maximum height {elevation.max():.0f} m")


if __name__ == "__main__":
    main()
