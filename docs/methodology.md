# Methodology

## Prayer calculation methods
The app wraps `adhan` and normalizes a method profile registry with configurable high-latitude and polar defaults.

## Jurisdiction mapping
Country-to-method mapping is data-driven in `src/data/jurisdiction-methods.json` and resolved independently from rendering.

## Confidence
Mappings are tagged as documented, inferred, or fallback and surfaced in the location panel.

## Timezone lookup
Primary lookup uses `tz-lookup`; fallback uses longitude-derived GMT offset and is clearly labeled approximate.

## High-latitude and polar
Policy precedence: jurisdiction override -> method defaults -> global fallback. Polar default fallback is AqrabYaum.

## Elevation
Point elevation is fetched from Open-Meteo elevation API and cached. Location details show sea-level and elevation-adjusted outputs.

## Rendering approximation
Current global lines are visualization guides generated in map/globe layers with day/night and sample demarcation curves; per-sample jurisdiction rasterization is architecture-ready but not yet fully terrain-correct globally.

## Limitations
Country lookup currently uses coarse bounding boxes, not full polygon geofencing; global elevation-aware overlay is point-level only.

## Updating mapping
Edit `src/data/jurisdiction-methods.json` for country policy updates without renderer changes.
