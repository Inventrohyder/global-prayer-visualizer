import { describe, expect, test } from 'vitest';
import { uvToLatLon } from '../views/GlobeView/globe-math';
import { screenToLatLon } from '../views/MapView/map-math';
import { timezoneFromLatLon } from '../domain/geo/timezone-lookup';
import { resolveJurisdictionPolicy } from '../domain/prayer/jurisdiction-policy';
import { PRAYER_METHODS } from '../domain/prayer/prayer-methods';
import { computePrayerTimes } from '../domain/prayer/prayer-times';
import { horizonDipDegrees } from '../domain/elevation/horizon-dip';
import { useAppState } from '../app/state';
import { renderHook, act } from '@testing-library/react';

describe('coordinates', () => {
  test('globe uv conversion', () => {
    expect(uvToLatLon(0.5, 0.5)).toEqual({ lat: 0, lon: 0 });
  });

  test('map screen conversion', () => {
    const p = screenToLatLon(500, 250, 1000, 500);
    expect(Math.round(p.lat)).toBe(0);
    expect(Math.round(p.lon)).toBe(0);
  });
});

describe('timezone and jurisdiction', () => {
  test('timezone lookup', () => {
    const tz = timezoneFromLatLon(21.4225, 39.8262);
    expect(tz.timezone).toMatch(/Riyadh|Jeddah|Etc\/GMT/);
  });

  test('jurisdiction lookup', () => {
    const p = resolveJurisdictionPolicy('SAU');
    expect(p.methodId).toBe('umm-al-qura');
  });
});

describe('prayer methods', () => {
  test('method profile exists', () => {
    expect(PRAYER_METHODS.turkey.fajrAngle).toBeGreaterThan(0);
  });

  test('representative city calculation', () => {
    const res = computePrayerTimes({ lat: 40.997, lon: 28.978, timezone: 'Europe/Istanbul', methodId: 'turkey', date: new Date('2026-06-10T12:00:00Z') });
    expect(res.times.fajr.getTime()).toBeLessThan(res.times.sunrise.getTime());
  });

  test('high latitude location', () => {
    const res = computePrayerTimes({ lat: 59.9139, lon: 10.7522, timezone: 'Europe/Oslo', methodId: 'mwl', date: new Date('2026-12-10T12:00:00Z') });
    expect(res.times.isha).toBeInstanceOf(Date);
  });

  test('polar-ish handling should not throw', () => {
    const res = computePrayerTimes({ lat: 69.6492, lon: 18.9553, timezone: 'Europe/Oslo', methodId: 'mwl', date: new Date('2026-06-21T12:00:00Z') });
    expect(res.times.fajr).toBeInstanceOf(Date);
  });

  test('elevation adjustment helper', () => {
    expect(horizonDipDegrees(1000)).toBeGreaterThan(0);
  });
});

describe('app state', () => {
  test('live/manual toggle', () => {
    const { result } = renderHook(() => useAppState());
    act(() => result.current.setLive(false));
    expect(result.current.live).toBe(false);
  });
});
