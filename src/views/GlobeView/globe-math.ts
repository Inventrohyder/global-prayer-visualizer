export function latLonToVector(lat:number, lon:number, radius=1): [number, number, number] {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return [-(radius * Math.sin(phi) * Math.cos(theta)), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)];
}

export function uvToLatLon(u:number, v:number): { lat:number; lon:number } {
  return { lat: 90 - v * 180, lon: u * 360 - 180 };
}
