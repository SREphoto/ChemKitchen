import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getChemicalVisuals } from '../../utils/chemicalColors';
import '../Effects/LiquidMaterial';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface BeakerProps {
  ingredientName: string | null;
  fillLevel: number;
  activeAction: string | null;
  position?: [number, number, number];
}

export default function Beaker({ ingredientName, fillLevel, activeAction, position = [0, 0, 0] }: BeakerProps) {
  const { scene } = useGLTF('/models/glassware/beaker.glb');
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  const liquidRef = useRef<any>(null);
  const gasRef = useRef<THREE.Group>(null);
  
  const visuals = React.useMemo(() => {
    if (!ingredientName) return null;
    return getChemicalVisuals(ingredientName);
  }, [ingredientName]);

  const particles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.04,
        y: 0.01 + Math.random() * 0.1,
        z: (Math.random() - 0.5) * 0.04,
        speed: 0.03 + Math.random() * 0.04,
        scale: 0.002 + Math.random() * 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    // 1. Animate liquid shader uniforms
    if (liquidRef.current) {
      liquidRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      const isReacting = activeAction && activeAction !== 'serve' && activeAction !== 'pass';
      const targetBubbling = isReacting || (visuals?.isBubbling) ? 1.0 : 0.0;
      
      liquidRef.current.uniforms.uBubbling.value = THREE.MathUtils.lerp(
        liquidRef.current.uniforms.uBubbling.value,
        targetBubbling,
        0.05
      );
    }

    // 2. Animate gas/vapor particles
    if (gasRef.current && visuals && (visuals.state === 'gas' || visuals.isFuming)) {
      gasRef.current.children.forEach((child: any, idx) => {
        const p = particles[idx];
        child.position.y += p.speed * delta;
        child.position.x = p.x + Math.sin(state.clock.getElapsedTime() * 3.0 + p.phase) * 0.004;
        
        // Reset when it goes too high
        if (child.position.y > 0.18) {
          child.position.y = 0.01;
        }

        // Fade opacity as it rises
        const material = child.material as THREE.MeshBasicMaterial;
        const normalizedHeight = child.position.y / 0.18;
        material.opacity = (1.0 - normalizedHeight) * (visuals.state === 'gas' ? 0.25 : 0.5);
      });
    }
  });

  const liquidHeight = 0.084 * fillLevel;
  const liquidY = 0.002 + liquidHeight / 2;

  return (
    <group position={position}>
      {/* Glass Vessel */}
      <primitive object={clonedScene} />

      {/* Liquid inside beaker */}
      {visuals && fillLevel > 0.01 && visuals.state !== 'gas' && (
        <mesh position={[0, liquidY, 0]}>
          <cylinderGeometry args={[0.0275, 0.0275, liquidHeight, 32]} />
          <liquidMaterial
            ref={liquidRef}
            uColor={new THREE.Color(visuals.color)}
            uOpacity={visuals.opacity}
            uViscosity={visuals.viscosity}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Solid powder/crystal pile at bottom */}
      {visuals && fillLevel > 0.01 && visuals.state === 'solid' && (
        <mesh position={[0, 0.005, 0]}>
          <coneGeometry args={[0.026, 0.025, 32]} />
          <meshStandardMaterial
            color={visuals.color}
            roughness={0.9}
            metalness={visuals.isMetallic ? 0.8 : 0.1}
          />
        </mesh>
      )}

      {/* Gas/Fume Particle System */}
      {visuals && (visuals.state === 'gas' || visuals.isFuming) && (
        <group ref={gasRef}>
          {particles.map((p, idx) => (
            <mesh key={idx} position={[p.x, p.y, p.z]}>
              <sphereGeometry args={[p.scale, 8, 8]} />
              <meshBasicMaterial
                color={visuals.color}
                transparent
                depthWrite={false}
                opacity={0}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
