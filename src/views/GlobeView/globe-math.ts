export const uvToLatLon = (u: number, v: number): { lat: number; lon: number } => ({
  lat: 90 - v * 180,
  lon: u * 360 - 180
});
