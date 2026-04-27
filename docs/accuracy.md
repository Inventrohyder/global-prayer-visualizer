# Accuracy notes

## Exact or near-exact
- Prayer times are computed with Adhan-compatible formulas and method parameters.
- Timezone formatting uses tz-lookup for selected points.

## Approximate
- Country detection is currently centroid/bounding-box based (low confidence).
- Elevation global overlays are not yet terrain-aware; only clicked-point elevation adjustment is applied.
- 2D/3D prayer demarcation lines are presently represented by architecture hooks, not final contour line rendering.

## Fallback labels
- `fallback`: no country mapping; defaults to MWL.
- timezone fallback: longitude-derived GMT offset.
- elevation unavailable: API/network failure or missing result.

## Why local timetables may differ
Official authorities may include local adjustments, local horizon assumptions, and administrative offsets not represented in generic method formulas.
