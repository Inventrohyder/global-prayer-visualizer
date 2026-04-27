import { useEffect, useMemo, useState } from 'react';
import type { PrayerMethodId } from '../domain/prayer/prayer-methods';

export type ViewMode = 'globe' | 'map';
export type CalcMode = 'auto-jurisdiction' | 'global-method' | 'compare';

export function useAppState() {
  const [view, setView] = useState<ViewMode>('globe');
  const [calcMode, setCalcMode] = useState<CalcMode>('auto-jurisdiction');
  const [globalMethod, setGlobalMethod] = useState<PrayerMethodId>('mwl');
  const [selectedAt, setSelectedAt] = useState<Date>(new Date());
  const [live, setLive] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{lat:number; lon:number} | null>(null);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setSelectedAt(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [live]);

  const utcString = useMemo(() => selectedAt.toISOString().replace('T', ' ').slice(0, 19) + ' UTC', [selectedAt]);

  return { view, setView, calcMode, setCalcMode, globalMethod, setGlobalMethod, selectedAt, setSelectedAt, live, setLive, selectedLocation, setSelectedLocation, utcString };
}
