"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

import { useDevice, getCameraSettings } from "@/hooks/useDevice";
import Scene from "@/components/scene/Scene";
import { Effects } from "@/components/scene/effects";
import { useSection, Section } from "@/stores/useSection";
import { NavText } from "@/components/textGeometry/NavText";
import MatrixRainWipe from "@/components/boot/MatrixRain";

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-cyan-500/20 rounded-full animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
        INITIALIZING...
      </p>
    </div>
  );
}

export default function Home() {
  const { isMobile } = useDevice();
  const cameraSettings = useMemo(() => getCameraSettings(isMobile), [isMobile]);

  const handleNavigate = (section: Section) => {
    useSection.getState().setSection(section);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <MatrixRainWipe />

      <Canvas
        camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
        dpr={cameraSettings.dpr}
        gl={{
          antialias: false,                    // Keep for performance (big win)
          alpha: false,                        // ← Reverted — this gives solid deep black
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 1);       // ← Force pure deep black every frame
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
        }}
        style={{ position: "absolute", inset: 0 }}
        frameloop="always"
      >
        <Suspense fallback={<LoadingScreen />}>
          <Scene />
          <NavText onNavigate={handleNavigate} />
          <Effects />
        </Suspense>
      </Canvas>
    </main>
  );
}