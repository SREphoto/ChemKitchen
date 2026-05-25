import React, { useRef, useState, useMemo } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface BombCalorimeterProps {
  activeAction: string | null;
  position?: [number, number, number];
}

export default function BombCalorimeter({ activeAction, position = [0, 0, 0] }: BombCalorimeterProps) {
  const { scene } = useGLTF('/models/equipment/bomb_calorimeter.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const [temperature, setTemperature] = useState(25.0);
  const [statusText, setStatusText] = useState('READY');
  const [heatOutput, setHeatOutput] = useState('0.0 kJ');

  // Spark state inside calorimeter
  const sparkGroupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const isCombusting = activeAction === 'catalyze' || activeAction === 'combust' || activeAction === 'heat';

    if (isCombusting) {
      // Simulate reaction heating curve
      const phase = (t * 0.8) % (Math.PI * 2);
      const tempRise = 25.0 + (Math.sin(phase) * 0.5 + 0.5) * 158.4;
      setTemperature(parseFloat(tempRise.toFixed(1)));
      
      const heat = (tempRise - 25.0) * 0.125;
      setHeatOutput(`${heat.toFixed(2)} kJ`);
      
      if (tempRise > 25.5 && tempRise < 45.0) {
        setStatusText('IGNITION');
      } else if (tempRise >= 45.0 && tempRise < 150.0) {
        setStatusText('BURNING');
      } else {
        setStatusText('COOLING');
      }

      // Animate spark inside the bomb container if ignition is active
      if (sparkGroupRef.current) {
        sparkGroupRef.current.children.forEach((child: any) => {
          child.visible = Math.random() > 0.4;
          child.position.set(
            (Math.random() - 0.5) * 0.02,
            0.04 + (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
          );
        });
      }
    } else {
      // Return to baseline
      setTemperature((prev) => THREE.MathUtils.lerp(prev, 25.0, 0.05));
      setHeatOutput('0.00 kJ');
      setStatusText('STANDBY');
      if (sparkGroupRef.current) {
        sparkGroupRef.current.children.forEach((child: any) => {
          child.visible = false;
        });
      }
    }
  });

  return (
    <group position={position}>
      {/* 3D bomb calorimeter casing */}
      <primitive object={clonedScene} />

      {/* Internal Spark Emitter (visible only if ignited) */}
      <group ref={sparkGroupRef}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} visible={false}>
            <sphereGeometry args={[0.002, 4, 4]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>

      {/* Screen Text display - positioned on the front panel (Z is forward in three.js, which maps to -Y in blender) */}
      {/* Positioned at x=0, y=0.07, z=0.068, facing front (rotation y=Math.PI) */}
      <group position={[0, 0.07, 0.068]} rotation={[0, 0, 0]}>
        {/* State / Status Text */}
        <Text
          position={[0, 0.015, 0.001]}
          fontSize={0.005}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff"
        >
          {statusText}
        </Text>

        {/* Temperature Reading */}
        <Text
          position={[0, 0.003, 0.001]}
          fontSize={0.008}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff"
        >
          {`${temperature} °C`}
        </Text>

        {/* Heat output / calibration parameter */}
        <Text
          position={[0, -0.009, 0.001]}
          fontSize={0.004}
          color="#86efac"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff"
        >
          {`HEAT: ${heatOutput}`}
        </Text>
      </group>
    </group>
  );
}
