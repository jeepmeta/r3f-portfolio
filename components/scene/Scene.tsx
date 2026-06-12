// components/Scene.tsx
"use client";

import { useRef } from "react";
import { Group } from "three";
import { DogCubes } from "./voxels/DogCubes";
import { Environment } from "./environment";
import { HolographicParticles } from "./HolographicParticles";
import { Lighting } from "./lighting";
import { useDevice } from "@/hooks/useDevice";
import { CameraController } from "./CameraController";

export default function Scene() {
  const groupRef = useRef<Group>(null);
  const { isMobile, isLowEnd } = useDevice();

  return (
    <group ref={groupRef}>
      <Environment />
      <Lighting />
      <DogCubes position={[0, 0.8, 0]} scale={1.8} />
      <HolographicParticles count={isMobile ? 30 : isLowEnd ? 35 : 50} />
      <CameraController />
    </group>
  );
}
