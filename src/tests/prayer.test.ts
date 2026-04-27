import { describe, expect, it } from 'vitest';
import { configureMethod } from '../domain/prayer/prayer-methods';
import { calculatePointPrayerTimes } from '../domain/prayer/prayer-times';
import { lookupTimezone } from '../domain/geo/timezone-lookup';

describe('method profile generation', () => {
  it('creates configured method params', () => {
    const params = configureMethod('umm-al-qura');
    expect(params).toBeTruthy();
  });
});

describe('prayer calculations representative cities', () => {
  it('returns prayer times for makkah', async () => {
    const result = await calculatePointPrayerTimes(21.4225, 39.8262, new Date('2026-04-27T00:00:00Z'));
    expect(result.events.fajr).toBeInstanceOf(Date);
    expect(result.jurisdiction).toContain('Saudi');
  });

  it('flags high latitude for oslo', async () => {
    const result = await calculatePointPrayerTimes(59.9139, 10.7522, new Date('2026-06-21T00:00:00Z'));
    expect(result.highLatitudeNotice).toBeTruthy();
  });

  it('flags polar circle for tromso', async () => {
    const result = await calculatePointPrayerTimes(69.6492, 18.9553, new Date('2026-06-21T00:00:00Z'));
    expect(result.highLatitudeNotice).toContain('Polar-circle');
  });

  it('supports date line local date handling', async () => {
    const instant = new Date('2026-04-27T23:30:00Z');
    const east = lookupTimezone(0, 179.9).timezone;
    const west = lookupTimezone(0, -179.9).timezone;
    const eastDate = new Intl.DateTimeFormat('en-CA', { timeZone: east, dateStyle: 'short' }).format(instant);
    const westDate = new Intl.DateTimeFormat('en-CA', { timeZone: west, dateStyle: 'short' }).format(instant);
    expect(eastDate).not.toBe(westDate);
  });
});
