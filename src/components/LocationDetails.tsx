import { useEffect, useMemo, useState } from 'react';
import { lookupCountryByLatLon } from '../domain/geo/country-lookup';
import { timezoneFromLatLon } from '../domain/geo/timezone-lookup';
import { resolveJurisdictionPolicy } from '../domain/prayer/jurisdiction-policy';
import { computePrayerTimes, currentPrayerPhase } from '../domain/prayer/prayer-times';
import { fetchPointElevation } from '../domain/elevation/elevation-service';
import { PRAYER_METHODS } from '../domain/prayer/prayer-methods';
import { compareMethods, summarizeSimilarity } from '../domain/prayer/comparisons';

export function LocationDetails({ location, at, methodOverride }: { location: {lat:number; lon:number} | null; at: Date; methodOverride?: keyof typeof PRAYER_METHODS }) {
  const [elevation, setElevation] = useState<number | null>(null);

  useEffect(() => {
    if (!location) return;
    void fetchPointElevation(location.lat, location.lon).then((s) => setElevation(s.elevationMeters));
  }, [location]);

  const payload = useMemo(() => {
    if (!location) return null;
    const country = lookupCountryByLatLon(location.lat, location.lon);
    const tz = timezoneFromLatLon(location.lat, location.lon);
    const policy = resolveJurisdictionPolicy(country.isoA3);
    const methodId = methodOverride ?? policy.methodId;
    const standard = computePrayerTimes({ lat:location.lat, lon:location.lon, date:at, methodId, timezone:tz.timezone });
    const elevated = computePrayerTimes({ lat:location.lat, lon:location.lon, date:at, methodId, timezone:tz.timezone, elevationMeters:elevation });
    const all = compareMethods(location.lat, location.lon, at, tz.timezone, Object.keys(PRAYER_METHODS) as Array<keyof typeof PRAYER_METHODS>);
    return { country, tz, policy, standard, elevated, similarity: summarizeSimilarity(all) };
  }, [location, at, elevation, methodOverride]);

  if (!location || !payload) return <div className="section"><div className="small">Click the globe or map to inspect a location.</div></div>;
  const fmt = (d: Date) => new Intl.DateTimeFormat('en-US', { hour:'2-digit', minute:'2-digit', timeZone: payload.tz.timezone, hour12:false }).format(d);

  return <div className="section">
    <h3>Location details</h3>
    <div className="small">Lat {location.lat.toFixed(4)} / Lon {location.lon.toFixed(4)}</div>
    <div className="small">Country: {payload.country.name ?? 'Unknown'} ({payload.country.isoA3 ?? 'N/A'})</div>
    <div className="small">Jurisdiction: {payload.policy.name} • {payload.policy.methodId} ({payload.policy.confidence})</div>
    <div className="small">Timezone: {payload.tz.timezone} {payload.tz.authoritative ? '' : '(approx fallback)'}</div>
    <div className="small">Elevation: {elevation === null ? 'Unavailable' : `${Math.round(elevation)} m`}</div>
    <div className="small">Phase at selected time: {currentPrayerPhase(at, payload.standard)}</div>
    <div className="small">Comparison: {payload.similarity}</div>
    <table><tbody>{Object.entries(payload.standard.times).map(([k, v]) => <tr key={k}><td>{k}</td><td>{fmt(v)}</td><td className="small">elev {fmt(payload.elevated.times[k as keyof typeof payload.elevated.times])}</td></tr>)}</tbody></table>
  </div>;
}
