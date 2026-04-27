import { describe, expect, it } from 'vitest';
import { screenToLatLon } from '../views/MapView/map-math';
import { latLonToVector3, vectorToLatLon } from '../views/GlobeView/globe-math';
import { lookupTimezone } from '../domain/geo/timezone-lookup';
import { resolveJurisdictionPolicy } from '../domain/prayer/jurisdiction-policy';

describe('coordinate conversion', () => {
  it('maps center screen to 0,0', () => {
    expect(screenToLatLon(500, 250, 1000, 500)).toEqual({ lat: 0, lon: 0 });
  });

  it('round-trips globe vector conversion', () => {
    const v = latLonToVector3(21.4, 39.8);
    const ll = vectorToLatLon(v);
    expect(ll.lat).toBeCloseTo(21.4, 1);
  });
});

describe('location lookup', () => {
  it('looks up timezone for makkah', () => {
    expect(lookupTimezone(21.4225, 39.8262).timezone).toBe('Asia/Riyadh');
  });

  it('resolves known jurisdiction policy for turkey', () => {
    const p = resolveJurisdictionPolicy(41.0082, 28.9784);
    expect(p.methodId).toBe('turkey');
  });
});
