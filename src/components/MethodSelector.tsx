import { PRAYER_METHODS, type PrayerMethodId } from '../domain/prayer/prayer-methods';

export function MethodSelector({ value, onChange }: { value: PrayerMethodId; onChange:(v:PrayerMethodId)=>void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as PrayerMethodId)}>
      {Object.values(PRAYER_METHODS).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
    </select>
  );
}
