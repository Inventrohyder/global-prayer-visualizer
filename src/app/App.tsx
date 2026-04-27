import { useEffect, useState } from 'react';
import type { AppState } from './state';
import { GlobeView } from '../views/GlobeView/GlobeView';
import { MapView } from '../views/MapView/MapView';
import { ControlPanel } from '../components/ControlPanel';

const initialState: AppState = {
  viewMode: 'globe',
  calcMode: 'auto-jurisdiction',
  globalMethodId: 'mwl',
  selectedInstant: new Date(),
  liveMode: true,
  selectedLocation: { lat: 21.4225, lon: 39.8262 },
};

export default function App() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!state.liveMode) return;
    const id = setInterval(() => {
      setState((s) => ({ ...s, selectedInstant: new Date() }));
    }, 1000);
    return () => clearInterval(id);
  }, [state.liveMode]);

  return (
    <div className="app">
      <div className="canvasArea">
        {state.viewMode === 'globe' ? (
          <GlobeView instant={state.selectedInstant} selected={state.selectedLocation} onSelect={(lat, lon) => setState((s) => ({ ...s, selectedLocation: { lat, lon } }))} />
        ) : (
          <MapView instant={state.selectedInstant} selected={state.selectedLocation} onSelect={(lat, lon) => setState((s) => ({ ...s, selectedLocation: { lat, lon } }))} />
        )}
      </div>
      <ControlPanel state={state} setState={(updater) => setState((s) => updater(s))} />
    </div>
  );
}
