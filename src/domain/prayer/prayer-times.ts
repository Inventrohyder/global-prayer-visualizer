import { Coordinates, PrayerTimes, SunnahTimes, HighLatitudeRule, PolarCircleResolution, type CalculationParameters } from 'adhan';
import { formatInTimeZone } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import { buildMethodParameters, type HighLatitudeRuleId, type PolarResolutionId, type PrayerMethodId } from './prayer-methods';
import { horizonDipDegrees } from '../elevation/horizon-dip';

export type PrayerResult = {
  times: Record<'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'midnight', Date>;
  notice: string[];
};

const resolveHighLat = (rule: HighLatitudeRuleId | undefined) => {
  switch (rule) {
    case 'middle-of-night': return HighLatitudeRule.MiddleOfTheNight;
    case 'seventh-of-night': return HighLatitudeRule.SeventhOfTheNight;
    case 'twilight-angle': return HighLatitudeRule.TwilightAngle;
    default: return HighLatitudeRule.MiddleOfTheNight;
  }
};

const resolvePolar = (rule: PolarResolutionId | undefined) => {
  switch (rule) {
    case 'aqrab-balad': return PolarCircleResolution.AqrabBalad;
    case 'unresolved': return PolarCircleResolution.Unresolved;
    default: return PolarCircleResolution.AqrabYaum;
  }
};

const applyOverrides = (params: CalculationParameters, options: { highLat?: HighLatitudeRuleId; polar?: PolarResolutionId }) => {
  params.highLatitudeRule = resolveHighLat(options.highLat);
  params.polarCircleResolution = resolvePolar(options.polar);
};

export const calculatePrayerTimes = (
  methodId: PrayerMethodId,
  lat: number,
  lon: number,
  date: Date,
  options?: { highLat?: HighLatitudeRuleId; polar?: PolarResolutionId; elevationMeters?: number }
): PrayerResult => {
  const params = buildMethodParameters(methodId);
  applyOverrides(params, options ?? {});
  const elev = options?.elevationMeters ?? 0;
  params.fajrAngle += horizonDipDegrees(elev) * 0.4;
  if (typeof params.ishaAngle === 'number') params.ishaAngle += horizonDipDegrees(elev) * 0.4;

  const pt = new PrayerTimes(new Coordinates(lat, lon), date, params);
  const sunnah = new SunnahTimes(pt);

  const notice: string[] = [];
  if (Math.abs(lat) > 48) notice.push('High latitude location; correction rules may apply.');
  if (Math.abs(lat) > 66.5) notice.push('Polar circle location; polar resolution may apply.');

  return {
    times: {
      fajr: pt.fajr,
      sunrise: pt.sunrise,
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      maghrib: pt.maghrib,
      isha: pt.isha,
      midnight: sunnah.middleOfTheNight
    },
    notice
  };
};

export const formatPrayerTimes = (result: PrayerResult, timezone: string) => {
  return Object.fromEntries(Object.entries(result.times).map(([k, v]) => [k, formatInTimeZone(v, timezone, 'HH:mm')])) as Record<keyof PrayerResult['times'], string>;
};

export const currentPhase = (result: PrayerResult, instant: Date): string => {
  const entries = Object.entries(result.times) as Array<[string, Date]>;
  const sorted = [...entries].sort((a, b) => a[1].getTime() - b[1].getTime());
  for (let i = 0; i < sorted.length; i += 1) {
    const cur = sorted[i];
    const next = sorted[(i + 1) % sorted.length];
    const end = i + 1 === sorted.length ? addMinutes(next[1], 24 * 60) : next[1];
    if (instant >= cur[1] && instant < end) return cur[0];
  }
  return 'fajr';
};
