export type ElevationSample = {
  lat: number;
  lon: number;
  elevationMeters: number | null;
  source: string;
  confidence: 'high' | 'medium' | 'low' | 'unavailable';
};

const cache = new Map<string, ElevationSample>();

export const getPointElevation = async (lat: number, lon: number): Promise<ElevationSample> => {
  const key = `${lat.toFixed(3)}:${lon.toFixed(3)}`;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
    const json = await res.json() as { elevation?: number[] };
    const elevationMeters = json.elevation?.[0] ?? null;
    const sample: ElevationSample = { lat, lon, elevationMeters, source: 'Open-Meteo Elevation API', confidence: elevationMeters === null ? 'unavailable' : 'medium' };
    cache.set(key, sample);
    return sample;
  } catch {
    return { lat, lon, elevationMeters: null, source: 'Unavailable', confidence: 'unavailable' };
  }
};
