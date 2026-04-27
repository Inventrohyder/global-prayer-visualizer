import tzLookup from 'tz-lookup';

const cache = new Map<string, string>();

const key = (lat:number, lon:number) => `${lat.toFixed(2)},${lon.toFixed(2)}`;

export function timezoneFromLatLon(lat: number, lon: number): { timezone: string; authoritative: boolean } {
  const k = key(lat, lon);
  const cached = cache.get(k);
  if (cached) return { timezone: cached, authoritative: true };
  try {
    const timezone = tzLookup(lat, lon);
    cache.set(k, timezone);
    return { timezone, authoritative: true };
  } catch {
    const offset = Math.round(lon / 15);
    return { timezone: `Etc/GMT${offset <= 0 ? '+' : '-'}${Math.abs(offset)}`, authoritative: false };
  }
}
