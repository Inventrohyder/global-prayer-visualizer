# Accuracy and Limitations

## Exact calculations
Selected-point prayer times are calculated by `adhan` with method-specific parameters and timezone-formatted output.

## Approximations
Global map prayer overlays are sampled approximations (not full geodesic contour solving). Country lookup currently uses coarse bounding boxes.

## Terrain handling
Selected-point elevation adjustments are implemented. Global terrain-aware overlay rendering currently falls back to sea-level approximations.

## Official timetable differences
Official local timetables may include authority-specific offsets not represented in base method profiles.

## Fallback labels
- `fallback`: no mapped jurisdiction, MWL fallback used.
- `approximate timezone`: geographic timezone lookup failed, longitude-derived fallback used.
- `unavailable elevation`: API/network unavailable or no elevation data returned.
