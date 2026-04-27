export type ViewMode = 'globe' | 'map';
export type CalcMode = 'auto-jurisdiction' | 'global-method' | 'compare';

export type SelectedLocation = {
  lat: number;
  lon: number;
};

export type AppState = {
  viewMode: ViewMode;
  calcMode: CalcMode;
  globalMethodId: string;
  selectedInstant: Date;
  liveMode: boolean;
  selectedLocation: SelectedLocation | null;
};
