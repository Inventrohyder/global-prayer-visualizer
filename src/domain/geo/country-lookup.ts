import countries from 'world-countries';

type BBox = [number, number, number, number];
type CountryIndex = { cca3: string; name: string; bbox: BBox };

const indexed: CountryIndex[] = (countries as Array<{ cca3:string; name:{common:string}; latlng:[number,number] }>).map((c) => {
  const [lat, lon] = c.latlng ?? [0, 0];
  return { cca3: c.cca3, name: c.name.common, bbox: [lat - 6, lon - 8, lat + 6, lon + 8] };
});

export function lookupCountryByLatLon(lat: number, lon: number): { isoA3?: string; name?: string; source: string; confidence: 'high' | 'medium' | 'low' } {
  const wrappedLon = ((lon + 540) % 360) - 180;
  const hit = indexed.find((c) => lat >= c.bbox[0] && lat <= c.bbox[2] && wrappedLon >= c.bbox[1] && wrappedLon <= c.bbox[3]);
  if (hit) return { isoA3: hit.cca3, name: hit.name, source: 'world-countries centroid-bbox approximation', confidence: 'low' };
  return { source: 'fallback none', confidence: 'low' };
}
