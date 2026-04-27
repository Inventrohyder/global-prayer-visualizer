import { useMemo } from 'react';

const minutesOfDay = (d: Date) => d.getHours() * 60 + d.getMinutes();

export const TimelineControls = ({ instant, onChange, liveMode, onLive }: { instant: Date; onChange: (d: Date) => void; liveMode: boolean; onLive: () => void }) => {
  const dayValue = useMemo(() => minutesOfDay(instant), [instant]);

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-300">UTC: {instant.toISOString().replace('T', ' ').slice(0, 19)}Z</div>
      <input
        type="range"
        min={0}
        max={1439}
        value={dayValue}
        onChange={(e) => {
          const next = new Date(instant);
          next.setHours(Math.floor(Number(e.target.value) / 60), Number(e.target.value) % 60, 0, 0);
          onChange(next);
        }}
        className="w-full"
      />
      <input
        type="date"
        value={instant.toISOString().slice(0, 10)}
        onChange={(e) => {
          const next = new Date(`${e.target.value}T${instant.toTimeString().slice(0, 8)}`);
          onChange(next);
        }}
        className="w-full rounded bg-slate-800 p-2"
      />
      <button className="w-full rounded bg-slate-700 py-1" onClick={onLive}>{liveMode ? 'Live mode active' : 'Return to live'}</button>
    </div>
  );
};
