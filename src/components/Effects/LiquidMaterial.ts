import React from 'react';
import * as THREE from 'three';
import { extend, ThreeElements } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

export const LiquidMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#3b82f6'),
    uOpacity: 0.8,
    uTime: 0.0,
    uBubbling: 0.0,
    uViscosity: 0.1,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    uniform float uBubbling;
    uniform float uViscosity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    // Simple pseudo-random hash
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    // 2D Noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      // Basic diffuse shading
      vec3 lightDir = normalize(vec3(5.0, 10.0, 7.0));
      float diff = max(dot(vNormal, lightDir), 0.0) * 0.6 + 0.4;
      
      // Calculate bubbling effect
      float bubbleNoise = 0.0;
      if (uBubbling > 0.05) {
        // Multi-frequency noise for bubbles moving upwards
        vec2 uvBubbles = vUv * vec2(12.0, 24.0) - vec2(0.0, uTime * (2.0 + uViscosity * 4.0));
        float n1 = noise(uvBubbles);
        float n2 = noise(uvBubbles * 2.0 + vec2(uTime * 0.5, 0.0));
        bubbleNoise = smoothstep(0.68, 0.95, n1 * n2) * uBubbling;
      }
      
      // Meniscus/Rim highlight
      float edge = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
      float rim = smoothstep(0.4, 1.0, edge) * 0.25;
      
      // Final color combines base color + bubble brightness
      vec3 finalColor = uColor * diff + vec3(bubbleNoise * 0.6);
      
      // Add slight highlight at the rim
      finalColor += vec3(rim * 0.2);
      
      // Compute final opacity (slight increase at the edges)
      float finalOpacity = clamp(uOpacity + rim * 0.35 + bubbleNoise * 0.15, 0.0, 1.0);
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `
);

extend({ LiquidMaterial });

export type LiquidMaterialProps = {
  uColor?: THREE.Color;
  uOpacity?: number;
  uTime?: number;
  uBubbling?: number;
  uViscosity?: number;
} & ThreeElements['shaderMaterial'];

