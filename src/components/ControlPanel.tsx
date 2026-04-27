import { MethodSelector } from './MethodSelector';
import { TimelineControls } from './TimelineControls';
import { ViewToggle } from './ViewToggle';
import { LocationDetails } from './LocationDetails';
import type { CalcMode, ViewMode } from '../app/state';
import type { PrayerMethodId } from '../domain/prayer/prayer-methods';

export function ControlPanel(props: {
  view: ViewMode; setView:(v:ViewMode)=>void; calcMode:CalcMode; setCalcMode:(v:CalcMode)=>void;
  globalMethod: PrayerMethodId; setGlobalMethod:(v:PrayerMethodId)=>void; selectedAt:Date; live:boolean; onManual:(d:Date)=>void; onLive:()=>void; selectedLocation:{lat:number; lon:number}|null;
}) {
  return <aside className="panel">
    <div className="section">
      <h2>Global Prayer Visualizer</h2>
      <ViewToggle value={props.view} onChange={props.setView} />
      <div className="row">
        <button onClick={() => props.setCalcMode('auto-jurisdiction')} disabled={props.calcMode==='auto-jurisdiction'}>Auto by jurisdiction</button>
        <button onClick={() => props.setCalcMode('global-method')} disabled={props.calcMode==='global-method'}>Global method</button>
        <button onClick={() => props.setCalcMode('compare')} disabled={props.calcMode==='compare'}>Compare</button>
      </div>
      <label>Global override method</label>
      <MethodSelector value={props.globalMethod} onChange={props.setGlobalMethod} />
      <div className="small">UTC {props.selectedAt.toISOString()} | Local {props.selectedAt.toLocaleString()}</div>
    </div>
    <TimelineControls date={props.selectedAt} live={props.live} onLive={props.onLive} onDate={props.onManual} />
    <LocationDetails location={props.selectedLocation} at={props.selectedAt} methodOverride={props.calcMode === 'global-method' ? props.globalMethod : undefined} />
  </aside>;
}
