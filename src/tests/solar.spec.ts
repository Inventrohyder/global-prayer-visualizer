import { describe, expect, test } from 'vitest';
import { getSubsolarPoint } from '../domain/solar/solar-position';

describe('solar motion', () => {
  test('subsolar changes over time', () => {
    const a = getSubsolarPoint(new Date('2026-01-01T00:00:00Z'));
    const b = getSubsolarPoint(new Date('2026-01-01T06:00:00Z'));
    expect(Math.abs(a.lon - b.lon)).toBeGreaterThan(50);
  });
});
