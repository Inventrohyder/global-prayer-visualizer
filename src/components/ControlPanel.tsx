import type { AppState } from '../app/state';
import type { PrayerMethodId } from '../domain/prayer/prayer-methods';
import { LocationDetails } from './LocationDetails';
import { MethodSelector } from './MethodSelector';
import { TimelineControls } from './TimelineControls';
import { ViewToggle } from './ViewToggle';

export function ControlPanel({ state, setState }: { state: AppState; setState: (updater: (s: AppState) => AppState) => void }) {
  return (
    <aside className="panel">
      <ViewToggle value={state.viewMode} onChange={(viewMode) => setState((s) => ({ ...s, viewMode }))} />
      <TimelineControls
        instant={state.selectedInstant}
        liveMode={state.liveMode}
        onChange={(selectedInstant) => setState((s) => ({ ...s, selectedInstant, liveMode: false }))}
        onResetLive={() => setState((s) => ({ ...s, liveMode: true, selectedInstant: new Date() }))}
      />
      <MethodSelector
        mode={state.calcMode}
        methodId={state.globalMethodId as PrayerMethodId}
        onModeChange={(calcMode) => setState((s) => ({ ...s, calcMode }))}
        onMethodChange={(globalMethodId) => setState((s) => ({ ...s, globalMethodId }))}
      />
      {state.selectedLocation && (
        <LocationDetails lat={state.selectedLocation.lat} lon={state.selectedLocation.lon} instant={state.selectedInstant} modeMethodId={state.calcMode !== 'auto-jurisdiction' ? state.globalMethodId : undefined} />
      )}
    </aside>
  );
}
