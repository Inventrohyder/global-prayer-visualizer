import type { PrayerMethodId } from './prayer-methods';
import { METHOD_PROFILES } from './prayer-methods';
import { calculatePointPrayerTimes, type PrayerEvent } from './prayer-times';

export async function compareMethods(lat: number, lon: number, date: Date, methodIds?: PrayerMethodId[]) {
  const ids = methodIds ?? (Object.keys(METHOD_PROFILES) as PrayerMethodId[]);
  const results = await Promise.all(ids.map((id) => calculatePointPrayerTimes(lat, lon, date, id)));
  const baseline = results[0].events;
  const diffSummary = results.map((r) => {
    const minutes: Partial<Record<PrayerEvent, number>> = {};
    (Object.keys(r.events) as PrayerEvent[]).forEach((event) => {
      minutes[event] = Math.round((r.events[event].getTime() - baseline[event].getTime()) / 60000);
    });
    return { methodId: r.methodId, deltasMinutes: minutes };
  });
  return { results, diffSummary };
}
