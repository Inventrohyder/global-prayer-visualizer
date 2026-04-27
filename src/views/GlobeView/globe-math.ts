import * as THREE from 'three';

export function latLonToVector3(lat: number, lon: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function vectorToLatLon(v: THREE.Vector3) {
  const r = v.length();
  const lat = 90 - (Math.acos(v.y / r) * 180) / Math.PI;
  const lon = ((Math.atan2(v.z, -v.x) * 180) / Math.PI) - 180;
  const normalizedLon = ((lon + 540) % 360) - 180;
  return { lat, lon: normalizedLon };
}
