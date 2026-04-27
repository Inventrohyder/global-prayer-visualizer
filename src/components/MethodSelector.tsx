import { PRAYER_METHODS, type PrayerMethodId } from '../domain/prayer/prayer-methods';

export const MethodSelector = ({ value, onChange }: { value: PrayerMethodId; onChange: (m: PrayerMethodId) => void }) => (
  <select className="w-full rounded bg-slate-800 p-2" value={value} onChange={(e) => onChange(e.target.value as PrayerMethodId)}>
    {Object.values(PRAYER_METHODS).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
  </select>
);
