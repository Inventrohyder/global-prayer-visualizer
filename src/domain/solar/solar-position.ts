export type SolarPoint = { lat: number; lon: number };

export function getSubsolarPoint(date: Date): SolarPoint {
  const rad = Math.PI / 180;
  const dayMs = 86400000;
  const jd = date.getTime() / dayMs + 2440587.5;
  const n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = L + 1.915 * Math.sin(g * rad) + 0.020 * Math.sin(2 * g * rad);
  const epsilon = 23.439 - 0.0000004 * n;
  const decl = Math.asin(Math.sin(epsilon * rad) * Math.sin(lambda * rad)) / rad;
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lon = ((180 - utcHours * 15 - (L - lambda)) + 540) % 360 - 180;
  return { lat: decl, lon };
}

export function isDaylight(lat:number, lon:number, subsolar: SolarPoint): boolean {
  const toR = (v:number) => v * Math.PI / 180;
  const cosC = Math.sin(toR(lat)) * Math.sin(toR(subsolar.lat)) + Math.cos(toR(lat))*Math.cos(toR(subsolar.lat))*Math.cos(toR(lon - subsolar.lon));
  return cosC > 0;
}
