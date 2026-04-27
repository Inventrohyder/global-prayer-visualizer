import tzLookup from 'tz-lookup';

const cache = new Map<string, { timezone: string; approximate: boolean }>();

export function lookupTimezone(lat: number, lon: number) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const timezone = tzLookup(lat, lon);
    const result = { timezone, approximate: false };
    cache.set(key, result);
    return result;
  } catch {
    const offsetHours = Math.round(lon / 15);
    const sign = offsetHours >= 0 ? '+' : '-';
    const abs = Math.abs(offsetHours).toString().padStart(2, '0');
    const timezone = `Etc/GMT${sign}${abs}`;
    const result = { timezone, approximate: true };
    cache.set(key, result);
    return result;
  }
}
