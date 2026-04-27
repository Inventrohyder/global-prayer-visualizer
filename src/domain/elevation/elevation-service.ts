export type ElevationSample = {
  lat: number;
  lon: number;
  elevationMeters: number | null;
  source: string;
  confidence: 'high' | 'medium' | 'low' | 'unavailable';
};

const cache = new Map<string, ElevationSample>();

export async function fetchPointElevation(lat: number, lon: number): Promise<ElevationSample> {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
    const json = await res.json() as { elevation?: number[] };
    const value = json.elevation?.[0] ?? null;
    const sample: ElevationSample = {
      lat,
      lon,
      elevationMeters: value,
      source: 'Open-Meteo elevation API',
      confidence: value === null ? 'unavailable' : 'medium',
    };
    cache.set(key, sample);
    return sample;
  } catch {
    const sample: ElevationSample = { lat, lon, elevationMeters: null, source: 'Unavailable', confidence: 'unavailable' };
    cache.set(key, sample);
    return sample;
  }
}
