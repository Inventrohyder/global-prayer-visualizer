import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { latLonToVector3, vectorToLatLon } from './globe-math';
import { getSubsolarPoint } from '../../domain/solar/solar-position';

type Props = { instant: Date; onSelect: (lat: number, lon: number) => void; selected?: { lat: number; lon: number } | null };

export function GlobeView({ instant, onSelect, selected }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020617');
    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 3);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1.8;
    controls.maxDistance = 4;

    const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshStandardMaterial({ color: '#0ea5e9', roughness: 1, metalness: 0 }));
    scene.add(globe);
    const light = new THREE.DirectionalLight('#fff8cc', 1.8);
    scene.add(light);
    const amb = new THREE.AmbientLight('#93c5fd', 0.2);
    scene.add(amb);

    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
    scene.add(marker);
    const sunMarker = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), new THREE.MeshBasicMaterial({ color: '#fcd34d' }));
    scene.add(sunMarker);

    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObject(globe)[0];
      if (hit?.point) {
        const ll = vectorToLatLon(hit.point.clone().normalize());
        onSelect(ll.lat, ll.lon);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    let raf = 0;
    const render = () => {
      const sub = getSubsolarPoint(instant);
      const sunVec = latLonToVector3(sub.lat, sub.lon, 2.4);
      light.position.copy(sunVec);
      sunMarker.position.copy(sunVec);
      if (selectedRef.current) {
        marker.position.copy(latLonToVector3(selectedRef.current.lat, selectedRef.current.lon, 1.02));
      }
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      globe.geometry.dispose();
      (globe.material as THREE.Material).dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [instant, onSelect]);

  return <div className="view" ref={hostRef} />;
}
