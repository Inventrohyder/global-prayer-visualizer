// Simplified bbox-based lookup fallback architecture for jurisdiction routing.

type CountryBox = { iso3: string; minLat: number; maxLat: number; minLon: number; maxLon: number };

const COUNTRY_BOXES: CountryBox[] = [
  { iso3: 'SAU', minLat: 16, maxLat: 33, minLon: 34, maxLon: 56 },
  { iso3: 'TUR', minLat: 35, maxLat: 43, minLon: 25, maxLon: 45 },
  { iso3: 'MAR', minLat: 27, maxLat: 36, minLon: -14, maxLon: -1 },
  { iso3: 'ARE', minLat: 22, maxLat: 27, minLon: 51, maxLon: 57 },
  { iso3: 'USA', minLat: 24, maxLat: 49, minLon: -125, maxLon: -66 },
  { iso3: 'GBR', minLat: 49, maxLat: 60, minLon: -9, maxLon: 2 },
  { iso3: 'MYS', minLat: 0, maxLat: 8, minLon: 99, maxLon: 120 },
  { iso3: 'IDN', minLat: -11, maxLat: 6, minLon: 95, maxLon: 141 },
];

export function lookupCountryIsoA3(lat: number, lon: number): string | undefined {
  return COUNTRY_BOXES.find((c) => lat >= c.minLat && lat <= c.maxLat && lon >= c.minLon && lon <= c.maxLon)?.iso3;
}
