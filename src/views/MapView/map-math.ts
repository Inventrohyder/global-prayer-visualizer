export const screenToLatLon = (x: number, y: number, width: number, height: number): { lat: number; lon: number } => {
  const lon = (x / width) * 360 - 180;
  const lat = 90 - (y / height) * 180;
  return { lat, lon };
};

export const latLonToScreen = (lat: number, lon: number, width: number, height: number): { x: number; y: number } => ({
  x: ((lon + 180) / 360) * width,
  y: ((90 - lat) / 180) * height
});
