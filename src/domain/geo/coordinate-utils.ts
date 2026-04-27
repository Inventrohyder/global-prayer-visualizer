export const clampLat = (lat: number) => Math.max(-90, Math.min(90, lat));
export const wrapLon = (lon: number) => ((lon + 540) % 360) - 180;
