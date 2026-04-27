# Methodology

## Prayer calculation
The app wraps `adhan` and normalizes method profiles (angles, offsets, madhab, midnight mode, high-latitude rule, polar defaults).

## Jurisdiction mapping
`src/data/jurisdiction-methods.json` maps ISO A3 country codes to method policies with confidence labels. Unknown countries fall back to MWL with `fallback` confidence.

## Country lookup
Current implementation uses centroid/bounding-box approximation from `world-countries`; this is intentionally labeled low confidence and is designed to be replaced with polygon point-in-polygon datasets.

## Timezone lookup
Primary path uses `tz-lookup` from lat/lon with cache. Fallback uses longitude-derived Etc/GMT and is explicitly flagged as approximate.

## High latitude and polar handling
Method profiles include recommended high-latitude rules and polar resolution (`aqrab-yaum` default). Impossible local calculations are handled per-point via adhan settings and surfaced in UI notes.

## Elevation adjustment
Point elevation uses Open-Meteo API and cache. Current adjustment applies horizon-dip approximation to sunrise/maghrib and presents this as approximation.

## Rendering approximation
Map overlay currently renders day/night + subsolar marker and selected point. Prayer boundary fields are architecture-ready but not yet fully contoured GPU tiles.

## Updating mappings
Edit `src/data/jurisdiction-methods.json` to add/update country policies without touching render code.
