import React, { useRef, useState, useMemo } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface CHNAnalyzerProps {
  activeAction: string | null;
  position?: [number, number, number];
}

export default function CHNAnalyzer({ activeAction, position = [0, 0, 0] }: CHNAnalyzerProps) {
  const { scene } = useGLTF('/models/equipment/chn_analyzer.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const [cValue, setCValue] = useState(0.0);
  const [hValue, setHValue] = useState(0.0);
  const [nValue, setNValue] = useState(0.0);
  const [status, setStatus] = useState('STANDBY');

  const catalystMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const fumeGroupRef = useRef<THREE.Group>(null);

  // Find and reference materials
  useMemo(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.name.includes('CHN_Catalyst_Bed')) {
        catalystMaterialRef.current = child.material as THREE.MeshStandardMaterial;
      }
    });
  }, [clonedScene]);

  // Exhaust particles (fume) details
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        x: 0.055 + (Math.random() - 0.5) * 0.01,
        y: 0.165,
        z: -0.05 + (Math.random() - 0.5) * 0.01,
        speed: 0.03 + Math.random() * 0.03,
        scale: 0.001 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const isAnalyzing = activeAction === 'catalyze' || activeAction === 'combust' || activeAction === 'serve';
    const t = state.clock.getElapsedTime();

    // 1. Catalyst bed heating glow animation
    const catMat = catalystMaterialRef.current;
    if (catMat) {
      if (isAnalyzing) {
        // High heat glowing orange/yellow
        const glow = 3.5 + Math.sin(t * 8.0) * 0.5;
        catMat.emissiveIntensity = glow;
        catMat.emissive.setRGB(0.9, 0.35 + Math.sin(t * 5.0) * 0.05, 0.0);
      } else {
        catMat.emissiveIntensity = THREE.MathUtils.lerp(catMat.emissiveIntensity, 0.1, 0.05);
        catMat.emissive.setRGB(0.2, 0.05, 0.0);
      }
    }

    // 2. Animate exhaust gas fuming
    if (fumeGroupRef.current) {
      fumeGroupRef.current.children.forEach((child: any, idx) => {
        if (!isAnalyzing) {
          child.visible = false;
          return;
        }
        child.visible = true;
        const p = particles[idx];
        child.position.y += p.speed * delta;
        child.position.x = p.x + Math.sin(t * 5.0 + p.phase) * 0.002;
        
        // Reset when it goes high
        if (child.position.y > 0.23) {
          child.position.y = 0.165;
        }

        // Fade opacity
        const material = child.material as THREE.MeshBasicMaterial;
        const normH = (child.position.y - 0.165) / 0.065;
        material.opacity = (1.0 - normH) * 0.4;
      });
    }

    // 3. LCD Screen display content update
    if (isAnalyzing) {
      const phase = (t * 0.5) % (Math.PI * 2);
      if (phase < Math.PI) {
        setStatus('ANALYZING...');
        // Counts up during analysis
        const progress = phase / Math.PI;
        setCValue(parseFloat((progress * 62.4).toFixed(1)));
        setHValue(parseFloat((progress * 5.8).toFixed(1)));
        setNValue(parseFloat((progress * 9.3).toFixed(1)));
      } else {
        setStatus('COMPLETE');
        setCValue(62.4);
        setHValue(5.8);
        setNValue(9.3);
      }
    } else {
      setStatus('READY');
      setCValue((prev) => THREE.MathUtils.lerp(prev, 0.0, 0.1));
      setHValue((prev) => THREE.MathUtils.lerp(prev, 0.0, 0.1));
      setNValue((prev) => THREE.MathUtils.lerp(prev, 0.0, 0.1));
    }
  });

  return (
    <group position={position}>
      {/* 3D Cabinet and Viewport */}
      <primitive object={clonedScene} />

      {/* Exhaust Gas Fuming particles at the top of the viewport column (Y = 0.165 in Blender) */}
      <group ref={fumeGroupRef}>
        {particles.map((p, idx) => (
          <mesh key={idx} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.scale, 6, 6]} />
            <meshBasicMaterial
              color="#d4d4d8"
              transparent
              depthWrite={false}
              opacity={0}
            />
          </mesh>
        ))}
      </group>

      {/* sloped panel LCD screen */}
      {/* sloped console is at Y = -0.075, Z = 0.07 in Blender. Screen at Y = -0.081, Z = 0.075 */}
      {/* Maps to Three.js: X = 0, Y = 0.075, Z = 0.081, rotated -15 deg (X rotation = -Math.PI / 12) */}
      <group position={[0, 0.075, 0.081]} rotation={[-Math.PI / 12, 0, 0]}>
        {/* Status */}
        <Text
          position={[0, 0.016, 0.001]}
          fontSize={0.0045}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff"
        >
          {status}
        </Text>

        {/* C: Carbon */}
        <Text
          position={[-0.024, 0.002, 0.001]}
          fontSize={0.0055}
          color="#f1f5f9"
          anchorX="left"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff"
        >
          {`C: ${cValue.toFixed(1)}%`}
        </Text>

        {/* H: Hydrogen */}
        <Text
          position={[-0.024, -0.006, 0.001]}
          fontSize={0.0055}
          color="#f1f5f9"
          anchorX="left"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff"
        >
          {`H: ${hValue.toFixed(1)}%`}
        </Text>

        {/* N: Nitrogen */}
        <Text
          position={[-0.024, -0.014, 0.001]}
          fontSize={0.0055}
          color="#f1f5f9"
          anchorX="left"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff"
        >
          {`N: ${nValue.toFixed(1)}%`}
        </Text>
      </group>
    </group>
  );
}
