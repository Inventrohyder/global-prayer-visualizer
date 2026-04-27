import { useEffect, useState } from 'react';
import { lookupCountry } from '../domain/geo/country-lookup';
import { timezoneForPoint } from '../domain/geo/timezone-lookup';
import { getPointElevation, type ElevationSample } from '../domain/elevation/elevation-service';
import { policyForCountry } from '../domain/prayer/jurisdiction-policy';
import { PRAYER_METHODS, type PrayerMethodId } from '../domain/prayer/prayer-methods';
import { calculatePrayerTimes, currentPhase, formatPrayerTimes } from '../domain/prayer/prayer-times';

export const LocationDetails = ({ location, instant, selectedMethod, calcMode }: { location: { lat: number; lon: number } | null; instant: Date; selectedMethod: PrayerMethodId; calcMode: 'auto-jurisdiction' | 'global-method' | 'compare' }) => {
  const [elevation, setElevation] = useState<ElevationSample | null>(null);

  useEffect(() => {
    if (!location) return;
    getPointElevation(location.lat, location.lon).then(setElevation);
  }, [location]);

  if (!location) return <div className="text-sm text-slate-400">Select a point.</div>;

  const country = lookupCountry(location.lat, location.lon);
  const policy = policyForCountry(country?.isoA3);
  const timezoneMeta = timezoneForPoint(location.lat, location.lon);
  const method = calcMode === 'global-method' ? selectedMethod : policy.methodId;

  const sea = calculatePrayerTimes(method, location.lat, location.lon, instant);
  const elev = calculatePrayerTimes(method, location.lat, location.lon, instant, { elevationMeters: elevation?.elevationMeters ?? 0 });
  const seaFmt = formatPrayerTimes(sea, timezoneMeta.timezone);
  const elevFmt = formatPrayerTimes(elev, timezoneMeta.timezone);

  return (
    <div className="space-y-2 text-xs">
      <div><b>Lat/Lon:</b> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</div>
      <div><b>Country:</b> {country?.name ?? 'Unknown'}</div>
      <div><b>Jurisdiction method:</b> {PRAYER_METHODS[policy.methodId].name} ({policy.confidence ?? 'fallback'})</div>
      <div><b>Timezone:</b> {timezoneMeta.timezone} {timezoneMeta.approximate ? '(approx)' : ''}</div>
      <div><b>Elevation:</b> {elevation?.elevationMeters?.toFixed(0) ?? 'N/A'} m</div>
      <div><b>Current phase:</b> {currentPhase(sea, instant)}</div>
      <div className="grid grid-cols-3 gap-1">
        <div className="font-semibold">Prayer</div><div className="font-semibold">Sea</div><div className="font-semibold">Elev.</div>
        {Object.keys(seaFmt).flatMap((key) => [
          <div key={`${key}-name`}>{key}</div>,
          <div key={`${key}-sea`}>{seaFmt[key as keyof typeof seaFmt]}</div>,
          <div key={`${key}-elev`}>{elevFmt[key as keyof typeof elevFmt]}</div>
        ])}
      </div>
      {[...new Set([...sea.notice, ...elev.notice])].map((n) => <div className="rounded bg-amber-900/40 p-1" key={n}>{n}</div>)}
      {calcMode === 'compare' && (
        <div className="rounded bg-slate-800 p-2">
          <div className="font-semibold">Method comparison (Fajr/Isha)</div>
          {Object.values(PRAYER_METHODS).slice(0, 6).map((m) => {
            const r = calculatePrayerTimes(m.id, location.lat, location.lon, instant);
            const f = formatPrayerTimes(r, timezoneMeta.timezone);
            return <div className="flex justify-between" key={m.id}><span>{m.name}</span><span>{f.fajr} / {f.isha}</span></div>;
          })}
        </div>
      )}
    </div>
  );
};
