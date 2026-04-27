import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getSubsolarPoint } from '../../domain/solar/solar-position';
import { latLonToVector } from './globe-math';

type Props = { at: Date; onPick: (lat:number, lon:number)=>void; selected: {lat:number; lon:number} | null };

export function GlobeView({ at, onPick, selected }: Props) {
  const mount = useRef<HTMLDivElement | null>(null);
  const marker = useRef<THREE.Mesh | null>(null);
  const sunLight = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05080f');
    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 2.6);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshStandardMaterial({ color:'#2d4f7d', roughness:0.8, metalness:0.1 }));
    scene.add(globe);
    const mk = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), new THREE.MeshBasicMaterial({ color:'#ff6ad5' }));
    mk.visible = false;
    marker.current = mk;
    scene.add(mk);
    const sun = new THREE.DirectionalLight('#fff4cd', 1.8);
    sunLight.current = sun;
    scene.add(sun);
    scene.add(new THREE.AmbientLight('#6d85b9', 0.45));

    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    renderer.domElement.onclick = (ev) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObject(globe)[0];
      if (hit?.point) {
        const p = hit.point.clone().normalize();
        const lat = 90 - Math.acos(p.y) * 180 / Math.PI;
        const lon = Math.atan2(p.z, -p.x) * 180 / Math.PI - 180;
        onPick(lat, ((lon + 540) % 360) - 180);
      }
    };

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      globe.geometry.dispose();
      (globe.material as THREE.Material).dispose();
      mk.geometry.dispose();
      (mk.material as THREE.Material).dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [onPick]);

  useEffect(() => {
    const subsolar = getSubsolarPoint(at);
    const sv = latLonToVector(subsolar.lat, subsolar.lon, 3);
    sunLight.current?.position.set(sv[0], sv[1], sv[2]);
  }, [at]);

  useEffect(() => {
    if (!selected || !marker.current) {
      if (marker.current) marker.current.visible = false;
      return;
    }
    const v = latLonToVector(selected.lat, selected.lon, 1.02);
    marker.current.position.set(v[0], v[1], v[2]);
    marker.current.visible = true;
  }, [selected]);

  return <div className="globe-canvas" ref={mount} />;
}
