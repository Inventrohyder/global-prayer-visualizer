import type { ViewMode } from '../app/state';

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="segmented">
      <button className={value === 'globe' ? 'active' : ''} onClick={() => onChange('globe')}>3D Globe</button>
      <button className={value === 'map' ? 'active' : ''} onClick={() => onChange('map')}>2D Map</button>
    </div>
  );
}
