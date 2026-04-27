import { useMemo } from 'react';

export function TimelineControls({ instant, liveMode, onChange, onResetLive }: {
  instant: Date;
  liveMode: boolean;
  onChange: (next: Date) => void;
  onResetLive: () => void;
}) {
  const dayValue = useMemo(() => instant.getUTCHours() * 60 + instant.getUTCMinutes(), [instant]);
  const yyyyMmDd = instant.toISOString().slice(0, 10);
  return (
    <div>
      <div className="row">
        <span>{liveMode ? 'Live' : 'Manual'}</span>
        <button onClick={onResetLive}>Return to live</button>
      </div>
      <input type="range" min={0} max={1439} value={dayValue} onChange={(e) => {
        const next = new Date(instant);
        const total = Number(e.target.value);
        next.setUTCHours(Math.floor(total / 60), total % 60, 0, 0);
        onChange(next);
      }} />
      <input type="date" value={yyyyMmDd} onChange={(e) => {
        const [y, m, d] = e.target.value.split('-').map(Number);
        const next = new Date(instant);
        next.setUTCFullYear(y, m - 1, d);
        onChange(next);
      }} />
      <div className="tiny">UTC: {instant.toISOString().replace('T', ' ').slice(0, 19)} | System: {instant.toLocaleString()}</div>
    </div>
  );
}
