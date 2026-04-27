import { Coordinates, PrayerTimes } from 'adhan';
import { addMinutes } from 'date-fns';
import { fetchPointElevation } from '../elevation/elevation-service';
import { horizonDipDegrees } from '../elevation/horizon-dip';
import { lookupTimezone } from '../geo/timezone-lookup';
import { configureMethod, type PrayerMethodId } from './prayer-methods';
import { resolveJurisdictionPolicy } from './jurisdiction-policy';

export type PrayerEvent = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'midnight';

export type PointPrayerResult = {
  methodId: PrayerMethodId;
  jurisdiction: string;
  events: Record<PrayerEvent, Date>;
  highLatitudeNotice?: string;
  elevationMeters: number | null;
  eventsElevationAdjusted?: Record<PrayerEvent, Date>;
};

function localDateForTimezone(instant: Date, timezone: string): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
}

function midpoint(a: Date, b: Date): Date {
  return new Date((a.getTime() + b.getTime()) / 2);
}

function toEvents(today: PrayerTimes, tomorrow: PrayerTimes): Record<PrayerEvent, Date> {
  return {
    fajr: today.fajr,
    sunrise: today.sunrise,
    dhuhr: today.dhuhr,
    asr: today.asr,
    maghrib: today.maghrib,
    isha: today.isha,
    midnight: midpoint(today.maghrib, tomorrow.fajr),
  };
}

export async function calculatePointPrayerTimes(lat: number, lon: number, instant: Date, overrideMethod?: PrayerMethodId): Promise<PointPrayerResult> {
  const policy = resolveJurisdictionPolicy(lat, lon);
  const methodId = overrideMethod ?? policy.methodId;
  const params = configureMethod(methodId, policy.madhab ?? 'shafi');
  const coords = new Coordinates(lat, lon);
  const timezone = lookupTimezone(lat, lon).timezone;
  const date = localDateForTimezone(instant, timezone);
  const today = new PrayerTimes(coords, date, params);
  const tomorrow = new PrayerTimes(coords, addMinutes(date, 1440), params);
  const baseEvents = toEvents(today, tomorrow);

  const elev = await fetchPointElevation(lat, lon);
  let eventsElevationAdjusted: Record<PrayerEvent, Date> | undefined;
  if (elev.elevationMeters !== null && elev.elevationMeters > 0) {
    const dip = horizonDipDegrees(elev.elevationMeters);
    const mins = Math.round(dip * 4);
    eventsElevationAdjusted = {
      ...baseEvents,
      fajr: addMinutes(baseEvents.fajr, -mins),
      sunrise: addMinutes(baseEvents.sunrise, -mins),
      maghrib: addMinutes(baseEvents.maghrib, mins),
      isha: addMinutes(baseEvents.isha, mins),
    };
  }

  const highLatitudeNotice = Math.abs(lat) >= 66.5 ? 'Polar-circle latitude: fallback strategy may apply (AqrabYaum default).' :
    Math.abs(lat) >= 48 ? 'High-latitude location: twilight adjustments may affect Fajr/Isha.' : undefined;

  return {
    methodId,
    jurisdiction: policy.name,
    events: baseEvents,
    highLatitudeNotice,
    elevationMeters: elev.elevationMeters,
    eventsElevationAdjusted,
  };
}
