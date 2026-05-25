import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface HeatingMantleProps {
  isActive: boolean;
  position?: [number, number, number];
}

export default function HeatingMantle({ isActive, position = [0, 0, 0] }: HeatingMantleProps) {
  const { scene } = useGLTF('/models/equipment/heating_mantle.glb');
  
  // Clone the scene so we don't share material instances across render instances
  const clonedScene = useMemo(() => {
    const s = scene.clone();
    return s;
  }, [scene]);

  // Keep references to materials for animation
  const materialsRef = useRef<{ core: THREE.MeshStandardMaterial | null }>({ core: null });

  useMemo(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        // If there's a material with "HeatingCore" in name, save it
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (mat && mat.name.includes('HeatingCore')) {
            materialsRef.current.core = mat;
          }
        });
      }
    });
  }, [clonedScene]);

  useFrame((state) => {
    const mat = materialsRef.current.core;
    if (!mat) return;

    if (isActive) {
      // Pulsing glow between 1.5 and 5.0 intensity
      const t = state.clock.getElapsedTime();
      const pulse = 2.5 + Math.sin(t * 4.0) * 1.5;
      mat.emissiveIntensity = pulse;
      mat.emissive.setRGB(0.9, 0.25 * (0.8 + Math.sin(t * 8.0) * 0.2), 0.0);
    } else {
      // Slow fade down to 0
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.0, 0.1);
    }
  });

  return (
    <group position={position}>
      <primitive object={clonedScene} />
    </group>
  );
}
