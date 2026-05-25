import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import FlameEffect from '../Effects/FlameEffect';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface BunsenBurnerProps {
  activeAction: string | null;
  position?: [number, number, number];
}

export default function BunsenBurner({ activeAction, position = [0, 0, 0] }: BunsenBurnerProps) {
  const { scene } = useGLTF('/models/equipment/bunsen_burner.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Flame is active for combust, oxidize, and heat actions
  const isFlameActive = useMemo(() => {
    if (!activeAction) return false;
    const action = activeAction.toLowerCase();
    return action.includes('combust') || action.includes('heat') || action.includes('oxidize') || action.includes('decompose');
  }, [activeAction]);

  return (
    <group position={position}>
      {/* 3D Bunsen Burner Model */}
      <primitive object={clonedScene} />

      {/* Burner Flame: positioned at the top of the burner barrel (Z = 0.12 in Blender) */}
      <FlameEffect position={[0, 0.12, 0]} isActive={isFlameActive} scale={1.0} />
    </group>
  );
}
