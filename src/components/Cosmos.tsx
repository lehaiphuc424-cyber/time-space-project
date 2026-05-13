
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarParticles({ count = 3000 }) {
  const points = useRef<THREE.Points>(null!);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x += 0.0002;
      points.current.rotation.y += 0.0004;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function CosmicDust({ count = 2000 }) {
  const points = useRef<THREE.Points>(null!);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Distribute in a slightly more tunnel-like way
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.position.z += 0.02; // Faster movement
      if (points.current.position.z > 10) {
        points.current.position.z = -20;
      }
      points.current.rotation.z += 0.0005;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#818cf8"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15}
      />
    </Points>
  );
}

function ShootingStars() {
  const points = useRef<THREE.Points>(null!);
  const count = 20;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.position.x += delta * 15;
      points.current.position.y -= delta * 10;
      if (points.current.position.x > 50) {
        points.current.position.x = -50;
        points.current.position.y = 50;
      }
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Nebula({ count = 100 }) {
  const points = useRef<THREE.Group>(null!);
  
  const blobs = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      ],
      size: Math.random() * 5 + 2,
      color: new THREE.Color(
        Math.random() > 0.5 ? "#1e3a8a" : "#3b82f6" // Deep blue and blue
      ).multiplyScalar(0.4),
    }));
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0002;
      points.current.rotation.z += 0.0001;
    }
  });

  return (
    <group ref={points}>
      {blobs.map((blob, i) => (
        <mesh key={i} position={blob.position as any}>
          <sphereGeometry args={[blob.size, 16, 16]} />
          <meshBasicMaterial
            color={blob.color}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Cosmos() {
  return (
    <div className="fixed inset-0 z-0 bg-[#000a1a]">
      {/* Decorative Blur Layers */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/15 rounded-full blur-[150px]"></div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#000a1a']} />
        <StarParticles />
        <CosmicDust />
        <ShootingStars />
        <Nebula />
        <fog attach="fog" args={['#000a1a', 2, 35]} />
      </Canvas>
    </div>
  );
}
