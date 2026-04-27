import { useCallback } from 'react';
import { useAppState } from './state';
import { ControlPanel } from '../components/ControlPanel';
import { GlobeView } from '../views/GlobeView/GlobeView';
import { MapView } from '../views/MapView/MapView';

export function App() {
  const state = useAppState();
  const onManual = useCallback((d:Date) => { state.setLive(false); state.setSelectedAt(d); }, [state]);
  const onLive = useCallback(() => state.setLive(true), [state]);
  return <div className="app-shell">
    <ControlPanel view={state.view} setView={state.setView} calcMode={state.calcMode} setCalcMode={state.setCalcMode} globalMethod={state.globalMethod}
      setGlobalMethod={state.setGlobalMethod} selectedAt={state.selectedAt} live={state.live} onManual={onManual} onLive={onLive} selectedLocation={state.selectedLocation} />
    <main className="canvas-wrap">
      {state.view === 'globe' ? <GlobeView at={state.selectedAt} onPick={(lat, lon) => state.setSelectedLocation({ lat, lon })} selected={state.selectedLocation} />
      : <MapView at={state.selectedAt} onPick={(lat, lon) => state.setSelectedLocation({ lat, lon })} selected={state.selectedLocation} />}
    </main>
  </div>;
}
