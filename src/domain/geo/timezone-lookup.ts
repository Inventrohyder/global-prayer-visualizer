import tzlookup from 'tz-lookup';

const cache = new Map<string, string>();

export const timezoneForPoint = (lat: number, lon: number): { timezone: string; approximate: boolean } => {
  const key = `${lat.toFixed(2)}:${lon.toFixed(2)}`;
  const cached = cache.get(key);
  if (cached) return { timezone: cached, approximate: false };
  try {
    const tz = tzlookup(lat, lon);
    cache.set(key, tz);
    return { timezone: tz, approximate: false };
  } catch {
    const approxOffset = Math.round(lon / 15);
    const timezone = `Etc/GMT${approxOffset <= 0 ? '+' : '-'}${Math.abs(approxOffset)}`;
    return { timezone, approximate: true };
  }
};
