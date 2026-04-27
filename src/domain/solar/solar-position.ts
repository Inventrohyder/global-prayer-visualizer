export type SolarPoint = { lat: number; lon: number };

export const subsolarPoint = (date: Date): SolarPoint => {
  const rad = Math.PI / 180;
  const dayMs = 86400000;
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const n = (date.getTime() - j2000) / dayMs;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = L + 1.915 * Math.sin(g * rad) + 0.02 * Math.sin(2 * g * rad);
  const epsilon = 23.439 - 0.0000004 * n;
  const decl = Math.asin(Math.sin(epsilon * rad) * Math.sin(lambda * rad)) / rad;

  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lon = (180 - utcHours * 15 + ((L - lambda) * 4) / 60 * 15 + 540) % 360 - 180;

  return { lat: decl, lon };
};
