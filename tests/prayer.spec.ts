import { describe, expect, it } from 'vitest';
import { uvToLatLon } from '../src/views/GlobeView/globe-math';
import { screenToLatLon } from '../src/views/MapView/map-math';
import { timezoneForPoint } from '../src/domain/geo/timezone-lookup';
import { lookupCountry } from '../src/domain/geo/country-lookup';
import { PRAYER_METHODS } from '../src/domain/prayer/prayer-methods';
import { calculatePrayerTimes } from '../src/domain/prayer/prayer-times';

describe('geo conversion', () => {
  it('converts globe UV', () => {
    expect(uvToLatLon(0.5, 0.5)).toEqual({ lat: 0, lon: 0 });
  });

  it('converts 2D map pixels', () => {
    expect(screenToLatLon(500, 250, 1000, 500)).toEqual({ lat: 0, lon: 0 });
  });
});

describe('lookup and methods', () => {
  it('resolves timezone', () => {
    expect(timezoneForPoint(21.4225, 39.8262).timezone).toMatch(/Riyadh|Arabia/);
  });

  it('resolves known country', () => {
    expect(lookupCountry(21.4225, 39.8262)?.isoA3).toBe('SAU');
  });

  it('has required methods', () => {
    expect(Object.keys(PRAYER_METHODS).length).toBeGreaterThanOrEqual(22);
  });
});

describe('prayer calculations', () => {
  it('computes makkah prayer time', () => {
    const result = calculatePrayerTimes('UMM_AL_QURA', 21.4225, 39.8262, new Date('2026-04-27T12:00:00Z'));
    expect(result.times.fajr).toBeInstanceOf(Date);
  });

  it('handles high latitude note', () => {
    const result = calculatePrayerTimes('MWL', 69.6492, 18.9553, new Date('2026-06-21T12:00:00Z'));
    expect(result.notice.length).toBeGreaterThan(0);
  });

  it('elevation adjusted returns valid', () => {
    const result = calculatePrayerTimes('MWL', 51.5072, -0.1276, new Date('2026-04-27T12:00:00Z'), { elevationMeters: 500 });
    expect(result.times.isha).toBeInstanceOf(Date);
  });
});
