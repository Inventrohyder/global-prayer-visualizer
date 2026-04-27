import { useEffect, useState } from 'react';
import { compareMethods } from '../domain/prayer/comparisons';
import { lookupTimezone } from '../domain/geo/timezone-lookup';
import { calculatePointPrayerTimes } from '../domain/prayer/prayer-times';

export function LocationDetails({ lat, lon, instant, modeMethodId }: { lat: number; lon: number; instant: Date; modeMethodId?: string }) {
  const [result, setResult] = useState<Awaited<ReturnType<typeof calculatePointPrayerTimes>> | null>(null);
  const [comparison, setComparison] = useState<Awaited<ReturnType<typeof compareMethods>> | null>(null);
  useEffect(() => {
    calculatePointPrayerTimes(lat, lon, instant, modeMethodId as never).then(setResult);
    compareMethods(lat, lon, instant).then(setComparison);
  }, [lat, lon, instant, modeMethodId]);

  if (!result) return <div>Loading location details…</div>;
  const tz = lookupTimezone(lat, lon);
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: tz.timezone });
  const similar = comparison?.diffSummary.every((r) => Object.values(r.deltasMinutes).every((v) => Math.abs(v ?? 0) <= 2));

  return (
    <div>
      <h3>Selected point</h3>
      <div className="tiny">{lat.toFixed(4)}, {lon.toFixed(4)}</div>
      <div className="tiny">Jurisdiction: {result.jurisdiction} · Method: {result.methodId}</div>
      <div className="tiny">Timezone: {tz.timezone}{tz.approximate ? ' (approx fallback)' : ''}</div>
      <div className="tiny">Elevation: {result.elevationMeters ?? 'N/A'} m</div>
      {result.highLatitudeNotice && <div className="warning">{result.highLatitudeNotice}</div>}
      <table><tbody>
        {Object.entries(result.events).map(([k, v]) => <tr key={k}><td>{k}</td><td>{fmt(v)}</td><td>{result.eventsElevationAdjusted ? fmt(result.eventsElevationAdjusted[k as keyof typeof result.eventsElevationAdjusted]) : 'N/A'}</td></tr>)}
      </tbody></table>
      <div className="tiny">Right column is elevation-adjusted when available.</div>
      {similar ? <div className="tiny">Most methods are effectively aligned (≤2 min deltas).</div> : (
        <details>
          <summary>Method comparison</summary>
          {comparison?.diffSummary.slice(0, 8).map((d) => <div key={d.methodId} className="tiny">{d.methodId}: Fajr {d.deltasMinutes.fajr}m, Isha {d.deltasMinutes.isha}m</div>)}
        </details>
      )}
    </div>
  );
}
