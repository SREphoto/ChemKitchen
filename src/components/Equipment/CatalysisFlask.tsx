import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getChemicalVisuals } from '../../utils/chemicalColors';
import '../Effects/LiquidMaterial';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface CatalysisFlaskProps {
  ingredientName: string | null;
  fillLevel: number;
  activeAction: string | null;
  position?: [number, number, number];
}

export default function CatalysisFlask({ ingredientName, fillLevel, activeAction, position = [0, 0, 0] }: CatalysisFlaskProps) {
  const { scene } = useGLTF('/models/glassware/catalysis_flask.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const liquidSphRef = useRef<any>(null);
  const liquidCylRef = useRef<any>(null);
  const gasRef = useRef<THREE.Group>(null);
  const pelletsMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const visuals = useMemo(() => {
    if (!ingredientName) return null;
    return getChemicalVisuals(ingredientName);
  }, [ingredientName]);

  // Keep references to catalyst pellets material
  useMemo(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.name.includes('Catalyst_Bed')) {
        pelletsMaterialRef.current = child.material as THREE.MeshStandardMaterial;
      }
    });
  }, [clonedScene]);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.05,
        y: 0.02 + Math.random() * 0.12,
        z: (Math.random() - 0.5) * 0.05,
        speed: 0.03 + Math.random() * 0.04,
        scale: 0.002 + Math.random() * 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const isCatalyzing = activeAction === 'catalyze';
    const isReacting = activeAction && activeAction !== 'serve' && activeAction !== 'pass';
    const targetBubbling = isReacting || (visuals?.isBubbling) ? 1.0 : 0.0;

    // 1. Animate liquid shader uniforms
    if (liquidSphRef.current) {
      liquidSphRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      liquidSphRef.current.uniforms.uBubbling.value = THREE.MathUtils.lerp(
        liquidSphRef.current.uniforms.uBubbling.value,
        targetBubbling,
        0.05
      );
    }
    if (liquidCylRef.current) {
      liquidCylRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      liquidCylRef.current.uniforms.uBubbling.value = THREE.MathUtils.lerp(
        liquidCylRef.current.uniforms.uBubbling.value,
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
          child.position.y = 0.02;
        }

        // Fade opacity as it rises
        const material = child.material as THREE.MeshBasicMaterial;
        const normalizedHeight = child.position.y / 0.18;
        material.opacity = (1.0 - normalizedHeight) * (visuals.state === 'gas' ? 0.25 : 0.5);
      });
    }

    // 3. Animate catalyst pellets glow during catalysis
    const pelletMat = pelletsMaterialRef.current;
    if (pelletMat) {
      if (isCatalyzing) {
        const t = state.clock.getElapsedTime();
        const glow = 2.0 + Math.sin(t * 12.0) * 1.5; // Rapid pulsing energy glow
        pelletMat.emissiveIntensity = glow;
        // Shift emission between amber/red and gold
        pelletMat.emissive.setRGB(0.9, 0.4 + Math.sin(t * 8.0) * 0.1, 0.0);
      } else {
        pelletMat.emissiveIntensity = THREE.MathUtils.lerp(pelletMat.emissiveIntensity, 0.0, 0.1);
      }
    }
  });

  const hasLiquid = visuals && fillLevel > 0.01 && visuals.state !== 'gas';
  
  // Spherical body radius = 0.038, center is at Y = 0.04.
  // Cylinder neck radius = 0.0105, goes from Y = 0.08 to Y = 0.12.
  const sphScale = Math.min(1.0, fillLevel / 0.8);
  const neckFillLevel = Math.max(0.0, (fillLevel - 0.8) / 0.2);
  const neckHeight = 0.038 * neckFillLevel;
  const neckY = 0.08 + neckHeight / 2;

  return (
    <group position={position}>
      {/* Glass Vessel and Pellets */}
      <primitive object={clonedScene} />

      {/* Liquid inside flask */}
      {hasLiquid && (
        <group>
          {/* Spherical bottom liquid */}
          {sphScale > 0.01 && (
            <mesh position={[0, 0.04, 0]} scale={[sphScale, sphScale, sphScale]}>
              <sphereGeometry args={[0.038, 32, 16]} />
              <liquidMaterial
                ref={liquidSphRef}
                uColor={new THREE.Color(visuals.color)}
                uOpacity={visuals.opacity}
                uViscosity={visuals.viscosity}
                transparent
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Neck liquid (when over 80% full) */}
          {neckFillLevel > 0.01 && (
            <mesh position={[0, neckY, 0]}>
              <cylinderGeometry args={[0.0105, 0.0105, neckHeight, 16]} />
              <liquidMaterial
                ref={liquidCylRef}
                uColor={new THREE.Color(visuals.color)}
                uOpacity={visuals.opacity}
                uViscosity={visuals.viscosity}
                transparent
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      )}

      {/* Solid powder at bottom */}
      {visuals && fillLevel > 0.01 && visuals.state === 'solid' && (
        <mesh position={[0, 0.005, 0]} scale={[sphScale, 0.4 * sphScale, sphScale]}>
          <sphereGeometry args={[0.038, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
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
