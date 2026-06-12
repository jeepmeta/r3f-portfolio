"use client";

import { memo } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export const Effects = memo(function Effects() {
  return (
    <EffectComposer>
      {/* Strong cinematic bloom for holographic glow */}
      <Bloom
        intensity={0.1}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.1}
        height={200}
        mipmapBlur
      />

      {/* Subtle vignette to focus center & add cinematic feel */}
      <Vignette eskil={false} offset={0.15} darkness={1.05} />

      {/* Very light noise/grain for filmic texture */}
      <Noise opacity={0.02} premultiply blendFunction={BlendFunction.ADD} />
    </EffectComposer>
  );
});
