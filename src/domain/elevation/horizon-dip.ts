export function horizonDipDegrees(elevationMeters: number): number {
  const earthRadiusMeters = 6371000;
  return (180 / Math.PI) * Math.sqrt((2 * elevationMeters) / earthRadiusMeters);
}
