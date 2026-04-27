export function screenToLatLon(x:number, y:number, width:number, height:number): { lat:number; lon:number } {
  const lon = (x / width) * 360 - 180;
  const lat = 90 - (y / height) * 180;
  return { lat: Math.max(-90, Math.min(90, lat)), lon: ((lon + 540) % 360) - 180 };
}
