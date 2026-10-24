import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ProjectArtifact3D({ seed }: { seed: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 4.2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      container.dataset.webglFallback = "true";
      return;
    }
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Compute deterministic theme from seed string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorOptions = [
      { main: 0x6366f1, sec: 0xec4899 }, // Indigo / Pink
      { main: 0x06b6d4, sec: 0x3b82f6 }, // Cyan / Blue
      { main: 0x10b981, sec: 0x14b8a6 }, // Emerald / Teal
      { main: 0xf59e0b, sec: 0xf97316 }, // Amber / Orange
      { main: 0x8b5cf6, sec: 0xd946ef }, // Purple / Fuchsia
      { main: 0xf43f5e, sec: 0xfb7185 }, // Rose / Coral
    ];
    const themeIndex = Math.abs(hash) % colorOptions.length;
    const theme = colorOptions[themeIndex];

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
    light1.position.set(3, 4, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(theme.main, 4, 10);
    light2.position.set(-2, -2, 2);
    scene.add(light2);

    const light3 = new THREE.PointLight(theme.sec, 3, 10);
    light3.position.set(2, 2, -1);
    scene.add(light3);

    // Geometry choice based on hash
    const geoChoice = Math.abs(hash >> 2) % 4;
    let geometry: THREE.BufferGeometry;
    if (geoChoice === 0) geometry = new THREE.OctahedronGeometry(1.1, 0);
    else if (geoChoice === 1) geometry = new THREE.DodecahedronGeometry(1.0, 0);
    else if (geoChoice === 2) geometry = new THREE.TorusGeometry(0.85, 0.32, 16, 50);
    else geometry = new THREE.IcosahedronGeometry(1.05, 0);

    const material = new THREE.MeshPhysicalMaterial({
      color: theme.main,
      emissive: theme.sec,
      emissiveIntensity: 0.18,
      roughness: 0.2,
      metalness: 0.45,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.7,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Subtle wireframe halo
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const wireMesh = new THREE.Mesh(geometry.clone(), wireMat);
    wireMesh.scale.set(1.06, 1.06, 1.06);
    scene.add(wireMesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mesh.rotation.x = elapsed * 0.4;
      mesh.rotation.y = elapsed * 0.6;

      wireMesh.rotation.x = mesh.rotation.x;
      wireMesh.rotation.y = mesh.rotation.y;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const size = Math.min(container.clientWidth, container.clientHeight);
      renderer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [seed]);

  return (
    <div
      ref={mountRef}
      className="three-scene-fallback relative flex items-center justify-center size-full overflow-hidden"
      aria-hidden="true"
    />
  );
}
