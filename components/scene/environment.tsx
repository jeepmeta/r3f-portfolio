"use client";

import { memo } from "react";
import { Stars, Grid } from "@react-three/drei";

export const Environment = memo(function Environment() {
  return (
    <>
      <color attach="background" args={["#00070b"]} />

      <fog attach="fog" args={["#000c14", 2, 15]} />

      <Stars
        radius={120}
        depth={60}
        count={2500}
        factor={5}
        saturation={1}
        fade
        speed={0.8}
      />

      <Grid
        position={[0, -2.5, 0]}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#00ffff"
        sectionSize={3}
        sectionThickness={1.2}
        sectionColor="#00ff88"
        fadeDistance={21}
        fadeStrength={1.1}
        infiniteGrid
      />
    </>
  );
});
