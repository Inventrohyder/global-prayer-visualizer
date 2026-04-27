import type { ViewMode } from '../app/state';

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange:(v:ViewMode)=>void }) {
  return <div className="row"><button onClick={() => onChange('globe')} disabled={value==='globe'}>3D Globe</button><button onClick={() => onChange('map')} disabled={value==='map'}>2D Map</button></div>;
}
