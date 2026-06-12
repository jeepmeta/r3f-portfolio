"use client";

import { FC, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface InteractiveCardPanelProps {
  position?: readonly [number, number, number];
}

export const InteractiveCardPanel: FC<InteractiveCardPanelProps> = ({
  position = [0, 0, 0],
}) => {
  const { viewport } = useThree();
  const scale = viewport.height / 5.5;
  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotation
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y += delta * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Holographic glass panel */}
      <mesh position={[0, 0, 0] as const}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial
          color="#0a1a24"
          transparent
          opacity={0.32}
          roughness={0.18}
          metalness={0.15}
          emissive="#00eaff"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Subtle cyan edge glow */}
      <mesh position={[0, 0, 0.01] as const}>
        <planeGeometry args={[5.05, 3.05]} />
        <meshBasicMaterial color="#00eaff" transparent opacity={0.12} />
      </mesh>
    </group>
  );
};
