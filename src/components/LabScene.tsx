import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import Beaker from './Equipment/Beaker';
import TestTube from './Equipment/TestTube';
import RoundBottomFlask from './Equipment/RoundBottomFlask';

// WebGL Compatibility check
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// Error Boundary for WebGL/Canvas failures
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
  onWebGLFailure?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props!: ErrorBoundaryProps;
  state!: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error('WebGL/R3F rendering error:', error);
    if (this.props.onWebGLFailure) {
      this.props.onWebGLFailure();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Loading Spinner inside the 3D Canvas
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.01, 16, 16]} />
      <meshBasicMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

interface LabSceneProps {
  activeIngredients: string[];
  activeAction: string | null;
  selectedIngredients: string[];
  onWebGLFailure?: () => void;
}

export default function LabScene({
  activeIngredients,
  activeAction,
  selectedIngredients,
  onWebGLFailure,
}: LabSceneProps) {
  // Check WebGL availability on mount
  const webGLSupported = React.useMemo(() => isWebGLAvailable(), []);

  if (!webGLSupported) {
    if (onWebGLFailure) {
      onWebGLFailure();
    }
    return null;
  }

  // 1. Determine which vessel type to render
  let vesselType: 'beaker' | 'testtube' | 'flask' = 'beaker';
  if (activeAction) {
    const action = activeAction.toLowerCase();
    if (action.includes('centrifuge') || action.includes('precipitate')) {
      vesselType = 'testtube';
    } else if (
      action.includes('synthesize') ||
      action.includes('decompose') ||
      action.includes('polymerize') ||
      action.includes('catalyze') ||
      action.includes('distill')
    ) {
      vesselType = 'flask';
    }
  }

  // 2. Determine target chemicals and fill levels
  let chemicalName: string | null = null;
  let fillLevel = 0.0;

  if (activeAction) {
    // Action in progress: show active ingredients mixed
    chemicalName = activeIngredients[0] || null;
    fillLevel = 0.7; // Standard filled level for reaction
  } else if (selectedIngredients.length > 0) {
    // Idle, but ingredients selected: show them in beaker
    vesselType = 'beaker';
    chemicalName = selectedIngredients[0];
    fillLevel = Math.min(0.9, 0.3 * selectedIngredients.length);
  } else {
    // Empty idle state
    chemicalName = null;
    fillLevel = 0.0;
  }

  const renderVessel = () => {
    switch (vesselType) {
      case 'testtube':
        return (
          <TestTube
            ingredientName={chemicalName}
            fillLevel={fillLevel}
            activeAction={activeAction}
            position={[0, -0.05, 0]}
          />
        );
      case 'flask':
        return (
          <RoundBottomFlask
            ingredientName={chemicalName}
            fillLevel={fillLevel}
            activeAction={activeAction}
            position={[0, -0.05, 0]}
          />
        );
      case 'beaker':
      default:
        return (
          <Beaker
            ingredientName={chemicalName}
            fillLevel={fillLevel}
            activeAction={activeAction}
            position={[0, -0.05, 0]}
          />
        );
    }
  };

  return (
    <WebGLErrorBoundary
      onWebGLFailure={onWebGLFailure}
      fallback={<div className="webgl-fallback-text">WebGL graphics failed to load. Falling back to 2D.</div>}
    >
      <div style={{ width: '100%', height: '100%', minHeight: '280px', background: 'transparent' }}>
        <Canvas
          camera={{ position: [0.18, 0.1, 0.18], fov: 45 }}
          shadows
        >
          <Suspense fallback={<Loader />}>
            {/* Lighting */}
            <ambientLight intensity={0.8} />
            
            {/* Key Light */}
            <directionalLight
              position={[0.5, 0.8, 0.5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            
            {/* Fill Light */}
            <directionalLight
              position={[-0.5, 0.3, -0.5]}
              intensity={0.4}
            />
            
            {/* Floor Reflection / Studio Preset */}
            <Environment preset="studio" />
  
            {/* Render Active Equipment */}
            <group position={[0, -0.02, 0]}>
              {renderVessel()}
            </group>
  
            {/* Ground Shadows */}
            <ContactShadows
              position={[0, -0.08, 0]}
              opacity={0.65}
              scale={0.4}
              blur={2.5}
              far={0.2}
            />
  
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minDistance={0.12}
              maxDistance={0.4}
              maxPolarAngle={Math.PI / 1.9} // Prevent looking completely from underneath
            />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
