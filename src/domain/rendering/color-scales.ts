import type { PrayerEvent } from '../prayer/prayer-times';

export const EVENT_COLORS: Record<PrayerEvent, string> = {
  fajr: '#00e5ff',
  sunrise: '#7dd3fc',
  dhuhr: '#facc15',
  asr: '#fb923c',
  maghrib: '#f472b6',
  isha: '#a78bfa',
  midnight: '#8b5cf6',
};

export function phaseColor(phase: PrayerEvent | 'night'): string {
  if (phase === 'night') return 'rgba(71, 85, 105, 0.22)';
  return `${EVENT_COLORS[phase]}33`;
}
