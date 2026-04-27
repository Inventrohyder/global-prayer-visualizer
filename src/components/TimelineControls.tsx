export function TimelineControls({ date, live, onLive, onDate }: { date: Date; live:boolean; onLive:()=>void; onDate:(d:Date)=>void }) {
  const mins = date.getUTCHours() * 60 + date.getUTCMinutes();
  return (
    <div className="section">
      <div className="row"><button onClick={onLive} disabled={live}>Return to live</button><span className="badge">{live ? 'LIVE' : 'MANUAL'}</span></div>
      <label>UTC Minute of day</label>
      <input type="range" min={0} max={1439} value={mins} onChange={(e) => {
        const d = new Date(date);
        d.setUTCHours(Math.floor(Number(e.target.value) / 60), Number(e.target.value) % 60, 0, 0);
        onDate(d);
      }} />
    </div>
  );
}
