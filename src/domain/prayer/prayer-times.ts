import { CalculationMethod, Coordinates, HighLatitudeRule, Madhab, PrayerTimes, PolarCircleResolution, SunnahTimes } from 'adhan';
import { horizonDipDegrees } from '../elevation/horizon-dip';
import { PRAYER_METHODS, type PrayerMethodId } from './prayer-methods';

export type PrayerResult = {
  methodId: PrayerMethodId;
  timezone: string;
  notes: string[];
  times: Record<'fajr'|'sunrise'|'dhuhr'|'asr'|'maghrib'|'isha'|'midnight', Date>;
};

function paramsForMethod(id: PrayerMethodId) {
  switch (id) {
    case 'mwl': return CalculationMethod.MuslimWorldLeague();
    case 'isna': return CalculationMethod.NorthAmerica();
    case 'egypt': return CalculationMethod.Egyptian();
    case 'umm-al-qura': return CalculationMethod.UmmAlQura();
    case 'karachi': return CalculationMethod.Karachi();
    case 'tehran': return CalculationMethod.Tehran();
    case 'jafari': return CalculationMethod.Tehran();
    default: return CalculationMethod.MuslimWorldLeague();
  }
}

export function computePrayerTimes(input: {lat:number; lon:number; date:Date; methodId:PrayerMethodId; timezone:string; elevationMeters?: number | null}): PrayerResult {
  const profile = PRAYER_METHODS[input.methodId];
  const coordinates = new Coordinates(input.lat, input.lon);
  const params = paramsForMethod(input.methodId);
  params.fajrAngle = profile.fajrAngle;
  if (profile.ishaAngle !== undefined) params.ishaAngle = profile.ishaAngle;
  if (profile.ishaOffsetMinutes !== undefined) params.ishaInterval = profile.ishaOffsetMinutes;
  params.madhab = profile.asrFactor === 2 ? Madhab.Hanafi : Madhab.Shafi;
  params.polarCircleResolution = profile.polarResolution === 'aqrab-balad' ? PolarCircleResolution.AqrabBalad : profile.polarResolution === 'unresolved' ? PolarCircleResolution.Unresolved : PolarCircleResolution.AqrabYaum;
  params.highLatitudeRule = profile.highLatitudeRule === 'seventh-of-night' ? HighLatitudeRule.SeventhOfTheNight : profile.highLatitudeRule === 'twilight-angle' ? HighLatitudeRule.TwilightAngle : HighLatitudeRule.MiddleOfTheNight;
  const notes:string[] = [];
  if (input.elevationMeters && input.elevationMeters > 0) {
    params.adjustments.sunrise += -Math.round(horizonDipDegrees(input.elevationMeters) * 3.5);
    params.adjustments.maghrib += Math.round(horizonDipDegrees(input.elevationMeters) * 3.5);
    notes.push('Elevation horizon-dip approximation applied to sunrise/maghrib.');
  }
  const pt = new PrayerTimes(coordinates, input.date, params);
  const st = new SunnahTimes(pt);
  return {
    methodId: input.methodId,
    timezone: input.timezone,
    notes,
    times: {
      fajr: pt.fajr,
      sunrise: pt.sunrise,
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      maghrib: pt.maghrib,
      isha: pt.isha,
      midnight: st.middleOfTheNight
    }
  };
}

export function currentPrayerPhase(at: Date, result: PrayerResult): string {
  const t = result.times;
  if (at < t.fajr) return 'Night';
  if (at < t.sunrise) return 'Fajr window';
  if (at < t.dhuhr) return 'Morning';
  if (at < t.asr) return 'Dhuhr window';
  if (at < t.maghrib) return 'Asr window';
  if (at < t.isha) return 'Maghrib window';
  return 'Isha window';
}
