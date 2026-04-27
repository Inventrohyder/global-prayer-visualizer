# Methodology

## Prayer calculation methods
The app uses `adhan` parameter sets wrapped in `src/domain/prayer/prayer-methods.ts`. Supported methods include MWL, ISNA, Egyptian, Umm Al-Qura, Karachi, Tehran, Jafari, Gulf, Kuwait, Qatar, Singapore, France, Turkey, Russia, Dubai, Malaysia, Tunisia, Algeria, Indonesia, Morocco, Portugal, and Jordan.

## Jurisdiction mapping
`src/data/jurisdiction-methods.json` stores jurisdiction-to-method policy separately from geometry.
`src/domain/geo/country-lookup.ts` currently uses simplified country bounding boxes as fast fallback geometry.

## Confidence levels
Policies expose `official`, `documented`, `inferred`, and `fallback` confidence in mapping data.

## Timezone lookup
`tz-lookup` is used per point and cached in memory. Longitude-based fallback is used only when lookup fails and is labeled approximate.

## High-latitude/polar handling
High-latitude notices begin at |48°| and polar-circle notices at |66.5°|. Method parameters default to `TwilightAngle` plus `AqrabYaum`, with policy overrides designed for extension.

## Elevation adjustment
Point elevation is fetched from Open-Meteo API and cached. Elevation-adjusted times apply a horizon-dip minute correction to horizon-sensitive events.

## Rendering approximation
Current global overlays in map view are sampled-grid approximations to keep interaction smooth during scrubbing.

## Known limitations
Current country geometry is simplified; official subnational policy boundaries and full DEM tile rendering are future work.

## Updating country/method data
Update `src/data/jurisdiction-methods.json` and (if needed) polygon lookup in `src/domain/geo/country-lookup.ts` without touching renderer code.
