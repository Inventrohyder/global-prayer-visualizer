import { computePrayerTimes, type PrayerResult } from './prayer-times';
import type { PrayerMethodId } from './prayer-methods';

export function compareMethods(lat:number, lon:number, date:Date, timezone:string, methodIds: PrayerMethodId[]): PrayerResult[] {
  return methodIds.map((methodId) => computePrayerTimes({ lat, lon, date, methodId, timezone }));
}

export function summarizeSimilarity(results: PrayerResult[]): string {
  if (results.length < 2) return 'N/A';
  const base = results[0].times;
  const maxDiff = results.slice(1).reduce((acc, r) => {
    const diff = Math.max(...(Object.keys(base) as Array<keyof typeof base>).map((k) => Math.abs((r.times[k].getTime() - base[k].getTime()) / 60000)));
    return Math.max(acc, diff);
  }, 0);
  return maxDiff <= 3 ? `Methods are effectively identical (≤${Math.round(maxDiff)} min).` : `Methods diverge (max ${Math.round(maxDiff)} min).`;
}
