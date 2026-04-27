import SunCalc from 'suncalc';

export function getSubsolarPoint(instant: Date) {
  const start = Date.UTC(instant.getUTCFullYear(), 0, 0);
  const day = (instant.getTime() - start) / 86400000;
  const gamma = (2 * Math.PI / 365) * (day - 1 + (instant.getUTCHours() - 12) / 24);
  const declRad = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

  const mins = instant.getUTCHours() * 60 + instant.getUTCMinutes() + instant.getUTCSeconds() / 60;
  const lon = -((mins + eqtime - 720) / 4);
  return { lat: declRad * (180 / Math.PI), lon: ((lon + 540) % 360) - 180 };
}

export function isNightAt(instant: Date, lat: number, lon: number): boolean {
  const alt = SunCalc.getPosition(instant, lat, lon).altitude;
  return alt < 0;
}
