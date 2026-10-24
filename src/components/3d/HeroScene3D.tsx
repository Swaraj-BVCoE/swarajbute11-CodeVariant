import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Dynamic Multi-color Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 4, 15);
    cyanLight.position.set(-3.5, 2.5, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 4.5, 15);
    purpleLight.position.set(3.5, 2.5, 3);
    scene.add(purpleLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 3.5, 12);
    amberLight.position.set(0, -3, 2);
    scene.add(amberLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3, 10);
    emeraldLight.position.set(0, 3.5, -2);
    scene.add(emeraldLight);

    // Central Floating 3D Geometric Vault/Artifacts
    const group = new THREE.Group();
    scene.add(group);

    // 1. Crystal core (Icosahedron) with prismatic material
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      roughness: 0.12,
      metalness: 0.2,
      transmission: 0.75,
      thickness: 1.2,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Wireframe glowing exoskeleton
    const wireGeo = new THREE.IcosahedronGeometry(1.42, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireMesh);

    // 2. Multi-color orbiting rings
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.035, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.5, 0.025, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.15,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    const ringGeo3 = new THREE.TorusGeometry(2.85, 0.02, 16, 100);
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 5;
    group.add(ring3);

    // 3. Floating 3D Idea Shards / Polyhedra around the central artifact
    const shardGeometries = [
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.TetrahedronGeometry(0.4, 0),
      new THREE.DodecahedronGeometry(0.32, 0),
      new THREE.OctahedronGeometry(0.28, 0),
      new THREE.IcosahedronGeometry(0.3, 0),
    ];

    const shardPalette = [0x38bdf8, 0xa855f7, 0xf43f5e, 0x10b981, 0xfbbf24, 0x818cf8];

    const shards: {
      mesh: THREE.Mesh;
      speed: number;
      radius: number;
      angle: number;
      yOffset: number;
      rotSpeedX: number;
      rotSpeedY: number;
    }[] = [];

    const numShards = 14;
    for (let i = 0; i < numShards; i++) {
      const geo = shardGeometries[i % shardGeometries.length];
      const col = shardPalette[i % shardPalette.length];
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.25,
        metalness: 0.7,
        emissive: col,
        emissiveIntensity: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / numShards) * Math.PI * 2;
      const radius = 2.4 + (i % 3) * 0.55;
      const yOffset = (Math.sin(i) * 1.4);

      mesh.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      group.add(mesh);

      shards.push({
        mesh,
        speed: 0.008 + (i % 4) * 0.004,
        radius,
        angle,
        yOffset,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02,
      });
    }

    // 4. Stardust / Sparkle particles in multi-color hues
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8); // sky blue
    const color2 = new THREE.Color(0xa855f7); // purple
    const color3 = new THREE.Color(0xf59e0b); // amber
    const color4 = new THREE.Color(0x10b981); // emerald

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const rand = Math.random();
      const pickedColor = rand < 0.25
        ? color1
        : rand < 0.5
          ? color2
          : rand < 0.75
            ? color3
            : color4;

      colors[i * 3] = pickedColor.r;
      colors[i * 3 + 1] = pickedColor.g;
      colors[i * 3 + 2] = pickedColor.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse parallax interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.6;
      targetY = y * 0.6;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group rotation & subtle tilt
      group.rotation.y = elapsedTime * 0.25 + mouseX;
      group.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + mouseY * 0.5;

      // Rotate core & wireframe
      coreMesh.rotation.x += 0.005;
      coreMesh.rotation.y += 0.007;
      wireMesh.rotation.x = coreMesh.rotation.x;
      wireMesh.rotation.y = coreMesh.rotation.y;

      // Rings counter-rotation
      ring1.rotation.z += 0.006;
      ring2.rotation.x += 0.008;
      ring3.rotation.y += 0.005;

      // Orbit shards
      shards.forEach((shard) => {
        shard.angle += shard.speed;
        shard.mesh.position.x = Math.cos(shard.angle) * shard.radius;
        shard.mesh.position.z = Math.sin(shard.angle) * shard.radius;
        shard.mesh.position.y = shard.yOffset + Math.sin(elapsedTime * 2 + shard.angle) * 0.25;
        shard.mesh.rotation.x += shard.rotSpeedX;
        shard.mesh.rotation.y += shard.rotSpeedY;
      });

      // Particles gentle drift
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      // Light oscillation for rich iridescent refraction
      cyanLight.position.x = Math.sin(elapsedTime * 0.8) * 4;
      purpleLight.position.y = Math.cos(elapsedTime * 0.7) * 3;
      amberLight.position.z = 2 + Math.sin(elapsedTime * 0.6) * 2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    />
  );
}
