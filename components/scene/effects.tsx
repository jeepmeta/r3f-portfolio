// components/scene/effects.tsx
"use client";

import { memo } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

interface EffectsProps {
  quality?: "low" | "medium" | "high";
}

export const Effects = memo(function Effects({ quality = "high" }: EffectsProps) {
  const isLow = quality === "low";

  return (
    <EffectComposer>
      {/* Bloom is the most expensive pass — heavily reduced on low quality */}
      {isLow ? <></> : (
        <Bloom
          intensity={0.1}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.1}
          height={200}
          mipmapBlur
        />
      )}

      <Vignette eskil={false} offset={0.15} darkness={1.05} />

      {/* Very subtle noise always kept for filmic feel */}
      <Noise 
        opacity={isLow ? 0.01 : 0.02} 
        premultiply 
        blendFunction={BlendFunction.ADD} 
      />
    </EffectComposer>
  );
});