import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getChemicalVisuals } from '../../utils/chemicalColors';
import '../Effects/LiquidMaterial';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface TestTubeProps {
  ingredientName: string | null;
  fillLevel: number;
  activeAction: string | null;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function TestTube({ ingredientName, fillLevel, activeAction, position = [0, 0, 0], rotation = [0, 0, 0] }: TestTubeProps) {
  const { scene } = useGLTF('/models/glassware/test_tube.glb');
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  const liquidCylRef = useRef<any>(null);
  const liquidSphRef = useRef<any>(null);
  const gasRef = useRef<THREE.Group>(null);

  const visuals = React.useMemo(() => {
    if (!ingredientName) return null;
    return getChemicalVisuals(ingredientName);
  }, [ingredientName]);

  const particles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.016,
        y: 0.02 + Math.random() * 0.1,
        z: (Math.random() - 0.5) * 0.016,
        speed: 0.04 + Math.random() * 0.04,
        scale: 0.0015 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    // 1. Animate liquid shader uniforms
    const isReacting = activeAction && activeAction !== 'serve' && activeAction !== 'pass';
    const targetBubbling = isReacting || (visuals?.isBubbling) ? 1.0 : 0.0;

    if (liquidCylRef.current) {
      liquidCylRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      liquidCylRef.current.uniforms.uBubbling.value = THREE.MathUtils.lerp(
        liquidCylRef.current.uniforms.uBubbling.value,
        targetBubbling,
        0.05
      );
    }
    if (liquidSphRef.current) {
      liquidSphRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      liquidSphRef.current.uniforms.uBubbling.value = THREE.MathUtils.lerp(
        liquidSphRef.current.uniforms.uBubbling.value,
        targetBubbling,
        0.05
      );
    }

    // 2. Animate gas/vapor particles
    if (gasRef.current && visuals && (visuals.state === 'gas' || visuals.isFuming)) {
      gasRef.current.children.forEach((child: any, idx) => {
        const p = particles[idx];
        child.position.y += p.speed * delta;
        child.position.x = p.x + Math.sin(state.clock.getElapsedTime() * 4.0 + p.phase) * 0.003;
        
        // Reset when it goes too high
        if (child.position.y > 0.18) {
          child.position.y = 0.02;
        }

        // Fade opacity as it rises
        const material = child.material as THREE.MeshBasicMaterial;
        const normalizedHeight = child.position.y / 0.18;
        material.opacity = (1.0 - normalizedHeight) * (visuals.state === 'gas' ? 0.25 : 0.5);
      });
    }
  });

  const hasLiquid = visuals && fillLevel > 0.01 && visuals.state !== 'gas';
  
  // Test tube size: radius = 0.0125, height = 0.12. Inside radius = 0.011.
  // bottom sphere center is at Y = 0.0125.
  const liquidHeight = Math.max(0.001, 0.10 * fillLevel);
  const liquidY = 0.0125 + liquidHeight / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Glass Vessel */}
      <primitive object={clonedScene} />

      {/* Liquid inside test tube */}
      {hasLiquid && (
        <group>
          {/* Cylinder segment */}
          <mesh position={[0, liquidY, 0]}>
            <cylinderGeometry args={[0.0105, 0.0105, liquidHeight, 16]} />
            <liquidMaterial
              ref={liquidCylRef}
              uColor={new THREE.Color(visuals.color)}
              uOpacity={visuals.opacity}
              uViscosity={visuals.viscosity}
              transparent
              depthWrite={false}
            />
          </mesh>

          {/* Round bottom sphere segment */}
          <mesh position={[0, 0.0125, 0]}>
            <sphereGeometry args={[0.0105, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <liquidMaterial
              ref={liquidSphRef}
              uColor={new THREE.Color(visuals.color)}
              uOpacity={visuals.opacity}
              uViscosity={visuals.viscosity}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* Solid powder at bottom */}
      {visuals && fillLevel > 0.01 && visuals.state === 'solid' && (
        <mesh position={[0, 0.012, 0]}>
          <sphereGeometry args={[0.0105, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
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
