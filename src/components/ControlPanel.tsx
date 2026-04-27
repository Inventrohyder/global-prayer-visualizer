import type { CalcMode, ViewMode } from '../app/state';
import type { PrayerMethodId } from '../domain/prayer/prayer-methods';
import { MethodSelector } from './MethodSelector';
import { TimelineControls } from './TimelineControls';
import { ViewToggle } from './ViewToggle';

export const ControlPanel = ({
  viewMode,
  setViewMode,
  calcMode,
  setCalcMode,
  selectedMethod,
  setSelectedMethod,
  instant,
  setInstant,
  liveMode,
  setLive
}: {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  calcMode: CalcMode;
  setCalcMode: (m: CalcMode) => void;
  selectedMethod: PrayerMethodId;
  setSelectedMethod: (m: PrayerMethodId) => void;
  instant: Date;
  setInstant: (d: Date) => void;
  liveMode: boolean;
  setLive: () => void;
}) => (
  <div className="space-y-3 rounded bg-slate-900/90 p-3">
    <ViewToggle value={viewMode} onChange={setViewMode} />
    <div className="grid grid-cols-3 gap-1 rounded bg-slate-800 p-1 text-xs">
      {(['auto-jurisdiction', 'global-method', 'compare'] as const).map((mode) => (
        <button key={mode} className={`rounded px-1 py-1 ${calcMode === mode ? 'bg-cyan-500 text-black' : ''}`} onClick={() => setCalcMode(mode)}>{mode.replace('-', ' ')}</button>
      ))}
    </div>
    <MethodSelector value={selectedMethod} onChange={setSelectedMethod} />
    <TimelineControls instant={instant} onChange={setInstant} liveMode={liveMode} onLive={setLive} />
  </div>
);
