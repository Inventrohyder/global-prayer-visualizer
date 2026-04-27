export function horizonDipDegrees(elevationMeters: number): number {
  if (elevationMeters <= 0) return 0;
  return Math.sqrt(2 * elevationMeters / 6371000) * (180 / Math.PI);
}
