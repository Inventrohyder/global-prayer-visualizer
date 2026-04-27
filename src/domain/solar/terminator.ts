import type { SolarPoint } from './solar-position';

export const terminatorLatAtLon = (lon: number, subsolar: SolarPoint): number => {
  const rad = Math.PI / 180;
  const dec = subsolar.lat * rad;
  const ha = (lon - subsolar.lon) * rad;
  return Math.atan(-Math.cos(ha) / Math.tan(dec)) / rad;
};
