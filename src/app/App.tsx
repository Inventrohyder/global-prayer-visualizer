import { useEffect, useState } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { LocationDetails } from '../components/LocationDetails';
import { GlobeView } from '../views/GlobeView/GlobeView';
import { MapView } from '../views/MapView/MapView';
import { initialState } from './state';

export const App = () => {
  const [viewMode, setViewMode] = useState(initialState.viewMode);
  const [calcMode, setCalcMode] = useState(initialState.calcMode);
  const [selectedMethod, setSelectedMethod] = useState(initialState.selectedMethod);
  const [instant, setInstantState] = useState(initialState.instant);
  const [liveMode, setLiveMode] = useState(initialState.liveMode);
  const [selectedLocation, setSelectedLocation] = useState(initialState.selectedLocation);

  useEffect(() => {
    if (!liveMode) return;
    const id = setInterval(() => setInstantState(new Date()), 1000);
    return () => clearInterval(id);
  }, [liveMode]);

  const setInstant = (d: Date) => {
    setLiveMode(false);
    setInstantState(d);
  };

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-[340px_1fr]">
      <aside className="z-10 overflow-auto border-r border-slate-800 p-2">
        <ControlPanel
          viewMode={viewMode}
          setViewMode={setViewMode}
          calcMode={calcMode}
          setCalcMode={setCalcMode}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          instant={instant}
          setInstant={setInstant}
          liveMode={liveMode}
          setLive={() => {
            setLiveMode(true);
            setInstantState(new Date());
          }}
        />
        <div className="mt-3 rounded bg-slate-900/90 p-3">
          <h2 className="mb-2 text-sm font-semibold">Location details</h2>
          <LocationDetails location={selectedLocation} instant={instant} selectedMethod={selectedMethod} calcMode={calcMode} />
        </div>
      </aside>
      <main className="relative h-full w-full">
        {viewMode === 'globe' ? (
          <GlobeView instant={instant} selectedLocation={selectedLocation} onSelect={(lat, lon) => setSelectedLocation({ lat, lon })} />
        ) : (
          <MapView instant={instant} selectedLocation={selectedLocation} onSelect={(lat, lon) => setSelectedLocation({ lat, lon })} />
        )}
      </main>
    </div>
  );
};
