import { useEffect, useMemo, useRef } from 'react';
import { latLonToScreen, screenToLatLon } from './map-math';
import { subsolarPoint } from '../../domain/solar/solar-position';
import { terminatorLatAtLon } from '../../domain/solar/terminator';

export const MapView = ({ instant, selectedLocation, onSelect }: { instant: Date; selectedLocation: { lat: number; lon: number } | null; onSelect: (lat: number, lon: number) => void }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const subsolar = useMemo(() => subsolarPoint(instant), [instant]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#082f49';
    ctx.fillRect(0, 0, width, height);

    for (let lon = -180; lon < 180; lon += 1) {
      const lat = terminatorLatAtLon(lon, subsolar);
      const p = latLonToScreen(lat, lon, width, height);
      ctx.fillStyle = 'rgba(15,23,42,0.55)';
      ctx.fillRect(p.x, p.y, 1.5, height - p.y);
    }

    const events = [
      { offset: 0, color: 'rgba(34,211,238,0.85)' },
      { offset: 15, color: 'rgba(251,191,36,0.85)' },
      { offset: 45, color: 'rgba(244,114,182,0.85)' },
      { offset: 65, color: 'rgba(168,85,247,0.85)' }
    ];

    events.forEach((event) => {
      ctx.beginPath();
      for (let lon = -180; lon <= 180; lon += 3) {
        const lat = 25 * Math.sin(((lon + instant.getUTCHours() * 15 + event.offset) * Math.PI) / 180);
        const p = latLonToScreen(lat, lon, width, height);
        if (lon === -180) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = event.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    const s = latLonToScreen(subsolar.lat, subsolar.lon, width, height);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
    ctx.fill();

    if (selectedLocation) {
      const m = latLonToScreen(selectedLocation.lat, selectedLocation.lon, width, height);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [instant, selectedLocation, subsolar]);

  return <canvas className="h-full w-full" ref={ref} onClick={(e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const { lat, lon } = screenToLatLon(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    onSelect(lat, lon);
  }} />;
};
