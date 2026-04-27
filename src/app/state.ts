import type { PrayerMethodId } from '../domain/prayer/prayer-methods';

export type ViewMode = 'globe' | 'map';
export type CalcMode = 'auto-jurisdiction' | 'global-method' | 'compare';

export type SelectedLocation = { lat: number; lon: number } | null;

export type AppState = {
  viewMode: ViewMode;
  calcMode: CalcMode;
  selectedMethod: PrayerMethodId;
  instant: Date;
  liveMode: boolean;
  selectedLocation: SelectedLocation;
};

export const initialState: AppState = {
  viewMode: 'globe',
  calcMode: 'auto-jurisdiction',
  selectedMethod: 'MWL',
  instant: new Date(),
  liveMode: true,
  selectedLocation: { lat: 21.4225, lon: 39.8262 }
};
