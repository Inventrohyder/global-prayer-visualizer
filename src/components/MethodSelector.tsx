import type { CalcMode } from '../app/state';
import { METHOD_PROFILES, type PrayerMethodId } from '../domain/prayer/prayer-methods';

export function MethodSelector({
  mode,
  methodId,
  onModeChange,
  onMethodChange,
}: {
  mode: CalcMode;
  methodId: PrayerMethodId;
  onModeChange: (m: CalcMode) => void;
  onMethodChange: (m: PrayerMethodId) => void;
}) {
  return (
    <div>
      <label>Calculation mode</label>
      <select value={mode} onChange={(e) => onModeChange(e.target.value as CalcMode)}>
        <option value="auto-jurisdiction">Auto by jurisdiction</option>
        <option value="global-method">Global method</option>
        <option value="compare">Compare</option>
      </select>
      <label>Global method override</label>
      <select value={methodId} onChange={(e) => onMethodChange(e.target.value as PrayerMethodId)} disabled={mode === 'auto-jurisdiction'}>
        {Object.values(METHOD_PROFILES).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    </div>
  );
}
