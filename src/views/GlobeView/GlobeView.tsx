import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { subsolarPoint } from '../../domain/solar/solar-position';

const toVec = (lat: number, lon: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

export const GlobeView = ({ instant, selectedLocation, onSelect }: { instant: Date; selectedLocation: { lat: number; lon: number } | null; onSelect: (lat: number, lon: number) => void }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020617');
    const camera = new THREE.PerspectiveCamera(60, root.clientWidth / root.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 2.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(root.clientWidth, root.clientHeight);
    root.innerHTML = '';
    root.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ color: '#2563eb', emissive: '#0f172a', shininess: 8, wireframe: false })
    );
    scene.add(globe);

    const ambience = new THREE.AmbientLight('#475569', 0.8);
    scene.add(ambience);
    const sunlight = new THREE.DirectionalLight('#fef08a', 1.2);
    scene.add(sunlight);

    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.02), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
    scene.add(marker);

    const sunDot = new THREE.Mesh(new THREE.SphereGeometry(0.025), new THREE.MeshBasicMaterial({ color: '#fde047' }));
    scene.add(sunDot);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(globe);
      if (hits[0]?.point) {
        const p = hits[0].point.clone().normalize();
        const lat = 90 - (Math.acos(p.y) * 180) / Math.PI;
        const lon = (Math.atan2(p.z, -p.x) * 180) / Math.PI - 180;
        onSelect(lat, ((lon + 540) % 360) - 180);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    const onResize = () => {
      camera.aspect = root.clientWidth / root.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(root.clientWidth, root.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let frame = 0;
    const tick = () => {
      const sub = subsolarPoint(instant);
      const sunPos = toVec(sub.lat, sub.lon, 3);
      sunlight.position.copy(sunPos);
      sunDot.position.copy(toVec(sub.lat, sub.lon, 1.03));
      if (selectedLocation) marker.position.copy(toVec(selectedLocation.lat, selectedLocation.lon, 1.02));
      marker.visible = !!selectedLocation;
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      globe.geometry.dispose();
      (globe.material as THREE.Material).dispose();
      renderer.dispose();
      root.innerHTML = '';
    };
  }, [instant, onSelect, selectedLocation]);

  return <div className="h-full w-full" ref={containerRef} />;
};
