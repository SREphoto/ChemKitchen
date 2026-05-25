import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SparkParticlesProps {
  position?: [number, number, number];
  color?: string;
  count?: number;
}

export default function SparkParticles({ position = [0, 0, 0], color = '#f59e0b', count = 30 }: SparkParticlesProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Spark colors: alternate between gold/amber and cyan/electric blue
  const colors = ['#f59e0b', '#38bdf8', '#fbbf24', '#06b6d4'];

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speedR = 0.01 + Math.random() * 0.02;
      arr.push({
        vx: Math.cos(angle) * speedR,
        vy: 0.05 + Math.random() * 0.08, // Ascending velocity
        vz: Math.sin(angle) * speedR,
        speedX: 0.5 + Math.random() * 1.5,
        speedY: 0.8 + Math.random() * 1.2,
        scale: 0.0015 + Math.random() * 0.0025,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random(), // initial phase / normalized life
        decay: 0.5 + Math.random() * 0.8, // speed of life decay
      });
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const elapsedTime = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child: any, idx) => {
      const p = particles[idx];
      
      // Update life
      p.life += p.decay * delta;
      if (p.life > 1.0) {
        // Reset particle to catalyst bed level
        p.life = 0.0;
        child.position.set(
          (Math.random() - 0.5) * 0.03,
          0.005 + (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.03
        );
      }
      
      // Move upwards and drift slightly
      child.position.x += p.vx * delta * 2.0;
      child.position.y += p.vy * delta;
      child.position.z += p.vz * delta * 2.0;
      
      // Fading opacity based on life
      const material = child.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = Math.sin(p.life * Math.PI) * 0.9;
      }
      
      // Scale pulse
      const pulse = 1.0 + Math.sin(elapsedTime * 15.0 + idx) * 0.3;
      child.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[0, 0, 0]}>
          <sphereGeometry args={[p.scale, 4, 4]} />
          <meshBasicMaterial
            color={p.color}
            transparent
            depthWrite={false}
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}
