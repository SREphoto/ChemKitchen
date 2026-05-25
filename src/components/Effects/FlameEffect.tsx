import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlameEffectProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export default function FlameEffect({ position = [0, 0, 0], scale = 1.0, isActive = true }: FlameEffectProps) {
  const outerFlameRef = useRef<THREE.Mesh>(null);
  const innerFlameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!isActive) {
      if (outerFlameRef.current) outerFlameRef.current.scale.set(0, 0, 0);
      if (innerFlameRef.current) innerFlameRef.current.scale.set(0, 0, 0);
      if (glowRef.current) glowRef.current.intensity = 0;
      return;
    }

    const t = state.clock.getElapsedTime();
    
    // Flickering animation parameters
    const flicker1 = Math.sin(t * 25.0) * 0.05 + Math.cos(t * 12.0) * 0.03;
    const flicker2 = Math.sin(t * 37.0) * 0.02;
    const scaleY = 1.0 + flicker1 + flicker2;
    const scaleXZ = 1.0 - (flicker1 + flicker2) * 0.5;

    // Apply flicker to outer flame
    if (outerFlameRef.current) {
      outerFlameRef.current.scale.set(scaleXZ * scale, scaleY * scale, scaleXZ * scale);
      // Slight lean/wobble
      outerFlameRef.current.rotation.z = Math.sin(t * 15.0) * 0.04;
      outerFlameRef.current.rotation.x = Math.cos(t * 11.0) * 0.03;
    }

    // Apply slightly different flicker to inner blue flame
    if (innerFlameRef.current) {
      const innerFlicker = Math.sin(t * 30.0) * 0.03;
      innerFlameRef.current.scale.set(
        (scaleXZ - innerFlicker) * scale,
        (scaleY + innerFlicker) * scale,
        (scaleXZ - innerFlicker) * scale
      );
    }

    // Flicker light intensity
    if (glowRef.current) {
      glowRef.current.intensity = 0.8 + Math.sin(t * 40.0) * 0.2;
    }
  });

  if (!isActive) return null;

  return (
    <group position={position}>
      {/* Dynamic light glow on the apparatus above and around */}
      <pointLight
        ref={glowRef}
        color="#f97316"
        intensity={0.8}
        distance={0.3}
        position={[0, 0.04, 0]}
      />

      {/* Outer Flame: Cone pointing upwards. Base radius = 0.007, height = 0.05 */}
      <mesh ref={outerFlameRef} position={[0, 0.025, 0]}>
        <coneGeometry args={[0.008, 0.05, 16, 1, true]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Middle Flame: slightly smaller, yellow for hot core */}
      <mesh position={[0, 0.022, 0]} scale={[0.75, 0.85, 0.75]}>
        <coneGeometry args={[0.008, 0.05, 16, 1, true]} />
        <meshBasicMaterial
          color="#eab308"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Flame: Blue/cyan combustion cone at the base */}
      <mesh ref={innerFlameRef} position={[0, 0.01, 0]}>
        <coneGeometry args={[0.004, 0.02, 16, 1, true]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
