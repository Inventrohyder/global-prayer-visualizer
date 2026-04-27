import type { ViewMode } from '../app/state';

export const ViewToggle = ({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) => (
  <div className="flex gap-2">
    <button className={`rounded px-3 py-1 ${value === 'globe' ? 'bg-cyan-500 text-black' : 'bg-slate-800'}`} onClick={() => onChange('globe')}>3D Globe</button>
    <button className={`rounded px-3 py-1 ${value === 'map' ? 'bg-cyan-500 text-black' : 'bg-slate-800'}`} onClick={() => onChange('map')}>2D Map</button>
  </div>
);
