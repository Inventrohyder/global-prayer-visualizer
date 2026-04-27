import { useEffect, useRef } from 'react';
import { latLonToScreen, screenToLatLon } from './map-math';
import { getSubsolarPoint } from '../../domain/solar/solar-position';
import { EVENT_COLORS } from '../../domain/rendering/color-scales';

type Props = {
  instant: Date;
  onSelect: (lat: number, lon: number) => void;
  selected?: { lat: number; lon: number } | null;
};

export function MapView({ instant, onSelect, selected }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    for (let lat = -90; lat <= 90; lat += 10) {
      for (let lon = -180; lon <= 180; lon += 10) {
        const { x, y } = latLonToScreen(lat, lon, width, height);
        const phase = Math.sin((lon + instant.getUTCHours() * 15) * Math.PI / 180) + Math.cos(lat * Math.PI / 180);
        ctx.fillStyle = phase > 0 ? 'rgba(56,189,248,0.08)' : 'rgba(15,23,42,0.2)';
        ctx.fillRect(x, y, width / 36, height / 18);

        if (Math.abs(Math.sin((lon + instant.getUTCMinutes()) * Math.PI / 180)) < 0.03) {
          ctx.strokeStyle = EVENT_COLORS.fajr;
          ctx.strokeRect(x, y, width / 36, height / 18);
        }
      }
    }

    const sub = getSubsolarPoint(instant);
    const p = latLonToScreen(sub.lat, sub.lon, width, height);
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();

    if (selected) {
      const s = latLonToScreen(selected.lat, selected.lon, width, height);
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, Math.PI * 2); ctx.stroke();
    }
  }, [instant, selected]);

  return <canvas className="view" ref={ref} onClick={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { lat, lon } = screenToLatLon(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
    onSelect(lat, lon);
  }} />;
}
