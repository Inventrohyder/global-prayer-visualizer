export type ElevationSample = {
  lat: number;
  lon: number;
  elevationMeters: number | null;
  source: string;
  confidence: 'high' | 'medium' | 'low' | 'unavailable';
};

const cache = new Map<string, ElevationSample>();
const key = (lat:number, lon:number) => `${lat.toFixed(3)},${lon.toFixed(3)}`;

export async function fetchPointElevation(lat:number, lon:number): Promise<ElevationSample> {
  const k = key(lat, lon);
  const cached = cache.get(k);
  if (cached) return cached;
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
    const json = await res.json() as { elevation?: number[] };
    const sample: ElevationSample = { lat, lon, elevationMeters: json.elevation?.[0] ?? null, source:'open-meteo', confidence: json.elevation?.length ? 'medium' : 'unavailable' };
    cache.set(k, sample);
    return sample;
  } catch {
    const sample: ElevationSample = { lat, lon, elevationMeters: null, source:'fallback unavailable', confidence:'unavailable' };
    cache.set(k, sample);
    return sample;
  }
}
