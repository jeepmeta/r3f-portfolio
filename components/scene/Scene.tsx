// components/scene/Scene.tsx
"use client";

import { useRef } from "react";
import { Group } from "three";
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
      <HolographicParticles 
        count={isMobile ? 30 : isLowEnd ? 35 : 50} 
      />
      <CameraController />
    </group>
  );
}