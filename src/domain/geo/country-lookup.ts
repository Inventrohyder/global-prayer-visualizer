export type CountryHit = { isoA3: string; name: string } | null;

type BBoxCountry = { isoA3: string; name: string; minLat: number; maxLat: number; minLon: number; maxLon: number };

const BBOXES: BBoxCountry[] = [
  { isoA3: 'SAU', name: 'Saudi Arabia', minLat: 16, maxLat: 33, minLon: 34, maxLon: 56 },
  { isoA3: 'ARE', name: 'United Arab Emirates', minLat: 22, maxLat: 27, minLon: 51, maxLon: 57 },
  { isoA3: 'TUR', name: 'Turkey', minLat: 35, maxLat: 43, minLon: 26, maxLon: 45 },
  { isoA3: 'MAR', name: 'Morocco', minLat: 21, maxLat: 36, minLon: -17, maxLon: -1 },
  { isoA3: 'EGY', name: 'Egypt', minLat: 22, maxLat: 32, minLon: 25, maxLon: 36 },
  { isoA3: 'PAK', name: 'Pakistan', minLat: 23, maxLat: 37, minLon: 60, maxLon: 78 },
  { isoA3: 'SGP', name: 'Singapore', minLat: 1, maxLat: 2, minLon: 103, maxLon: 105 },
  { isoA3: 'MYS', name: 'Malaysia', minLat: 0, maxLat: 8, minLon: 99, maxLon: 120 },
  { isoA3: 'IDN', name: 'Indonesia', minLat: -11, maxLat: 6, minLon: 95, maxLon: 141 },
  { isoA3: 'RUS', name: 'Russia', minLat: 41, maxLat: 82, minLon: 20, maxLon: 180 },
  { isoA3: 'USA', name: 'United States', minLat: 24, maxLat: 49, minLon: -125, maxLon: -66 },
  { isoA3: 'GBR', name: 'United Kingdom', minLat: 50, maxLat: 59, minLon: -9, maxLon: 2 },
  { isoA3: 'NOR', name: 'Norway', minLat: 57, maxLat: 72, minLon: 4, maxLon: 32 },
  { isoA3: 'ISL', name: 'Iceland', minLat: 63, maxLat: 67, minLon: -25, maxLon: -13 },
  { isoA3: 'AUS', name: 'Australia', minLat: -44, maxLat: -10, minLon: 113, maxLon: 154 },
  { isoA3: 'KEN', name: 'Kenya', minLat: -5, maxLat: 6, minLon: 34, maxLon: 42 }
];

export const lookupCountry = (lat: number, lon: number): CountryHit => {
  return BBOXES.find((c) => lat >= c.minLat && lat <= c.maxLat && lon >= c.minLon && lon <= c.maxLon) ?? null;
};
