// components/scene/environment/Lighting.tsx
"use client";

import { memo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const Lighting = memo(function Lighting() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Rotate lights with camera (kept because it looks nice)
  useFrame(() => {
    if (groupRef.current) {
      const azimuthal = Math.atan2(camera.position.x, camera.position.z);
      groupRef.current.rotation.y = azimuthal;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft global ambient */}
      <ambientLight intensity={0.35} color="#f5e8d3" />

      {/* Main key light (directional) */}
      <directionalLight
        position={[5, 18, 8]}
        intensity={2.8}
        color="#fff8f0"
        castShadow={false}
      />

      {/* Warm accent point light */}
      <pointLight
        position={[2, 7, 8]}
        intensity={4.5}
        color="#ffe0c0"
        distance={25}
        decay={1.8}
      />

      {/* Cool cyan accent (holographic feel) */}
      <pointLight
        position={[-5, 5, -6]}
        intensity={3.8}
        color="#00f0ff"
        distance={22}
        decay={2.0}
      />
    </group>
  );
});