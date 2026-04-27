export const horizonDipDegrees = (elevationMeters: number): number => {
  const earthRadius = 6371000;
  return (Math.acos(earthRadius / (earthRadius + Math.max(0, elevationMeters))) * 180) / Math.PI;
};
