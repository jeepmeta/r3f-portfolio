// app/systems/environment/lighting.tsx
"use client";

import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const Lighting = memo(function Lighting() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      // Extract azimuthal angle from camera quaternion (works with damping)
      const azimuthal = Math.atan2(camera.position.x, camera.position.z);
      groupRef.current.rotation.y = azimuthal;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft ambient base - stays global */}
      <ambientLight intensity={0.62} color="#fce1d3" />

      {/* Lights below rotate with camera */}
      <pointLight
        position={[1, 6, 9]}
        intensity={83.8}
        color="#fff0ed"
        distance={20}
        decay={1.6}
      />

      <pointLight
        position={[-4, 4, -3]}
        intensity={100.0}
        color="#00eeff"
        distance={18}
        decay={1.8}
      />

      <pointLight
        position={[0, 4, -10]}
        intensity={85.5}
        color="#00ccff"
        distance={25}
        decay={1.4}
      />

      <directionalLight
        position={[0, 12, 0]}
        intensity={100.9}
        color="#f0ffff"
      />

      <pointLight
        position={[-4, 3, 5]}
        intensity={18.9}
        color="#aa00ff"
        distance={17}
        decay={2.0}
      />
    </group>
  );
});
