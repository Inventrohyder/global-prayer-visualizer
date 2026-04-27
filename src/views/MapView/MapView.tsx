import { useEffect, useRef } from 'react';
import { getSubsolarPoint, isDaylight } from '../../domain/solar/solar-position';
import { screenToLatLon } from './map-math';

type Props = { at: Date; onPick: (lat:number, lon:number)=>void; selected: {lat:number; lon:number} | null };

export function MapView({ at, onPick, selected }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;
    const subsolar = getSubsolarPoint(at);
    ctx.fillStyle = '#0b1426';
    ctx.fillRect(0,0,width,height);
    const step = 4;
    for (let y=0; y<height; y+=step) {
      for (let x=0; x<width; x+=step) {
        const { lat, lon } = screenToLatLon(x, y, width, height);
        const day = isDaylight(lat, lon, subsolar);
        ctx.fillStyle = day ? 'rgba(130,180,255,0.5)' : 'rgba(20,30,55,0.9)';
        ctx.fillRect(x,y,step,step);
      }
    }
    ctx.fillStyle = '#ffd35a';
    const sx = ((subsolar.lon + 180) / 360) * width;
    const sy = ((90 - subsolar.lat) / 180) * height;
    ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI*2); ctx.fill();
    if (selected) {
      ctx.strokeStyle = '#ff6ad5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(((selected.lon + 180) / 360) * width, ((90 - selected.lat) / 180) * height, 6, 0, Math.PI*2);
      ctx.stroke();
    }
  }, [at, selected]);

  return <canvas className="map-canvas" ref={ref} width={1200} height={700} onClick={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = screenToLatLon((e.clientX-rect.left) * (e.currentTarget.width/rect.width), (e.clientY-rect.top) * (e.currentTarget.height/rect.height), e.currentTarget.width, e.currentTarget.height);
    onPick(p.lat, p.lon);
  }} />;
}
