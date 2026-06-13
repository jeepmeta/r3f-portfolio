import { useRef } from "react";
import * as THREE from "three";

export interface NavAnimationConfig {
  springStiffness: number;
  springDamping: number;
  colorLerp: number;
  emissiveLerp: number;
  hoverScale: number;
  baseScale: number;
  emissiveBase: number;
  emissiveHover: number;
  clickPulseIntensity: number;
  clickPulseDecay: number;
  flipSpeed: number;
  defaultColor: THREE.Color;
  hoverColor: THREE.Color;
}

export interface NavItemAnimation {
  setHovered: (v: boolean) => void;
  triggerClickPulse: () => void;
  startFlip: () => void;
  update: (
    mat: THREE.MeshStandardMaterial,
    group: THREE.Group,
    delta: number,
  ) => void;
}

export function useNavItemAnimation(
  config: NavAnimationConfig,
): NavItemAnimation {
  const hovered = useRef<boolean>(false);
  const scale = useRef<number>(config.baseScale);
  const velocity = useRef<number>(0);
  const clickPulse = useRef<number>(0);

  const flipProgress = useRef<number>(0);
  const isFlipping = useRef<boolean>(false);

  const setHovered = (v: boolean) => {
    hovered.current = v;
  };

  const triggerClickPulse = () => {
    clickPulse.current = config.clickPulseIntensity;
  };

  const startFlip = () => {
    isFlipping.current = true;
    flipProgress.current = 0;
  };

  const update = (
    mat: THREE.MeshStandardMaterial,
    group: THREE.Group,
    delta: number,
  ) => {
    const {
      springStiffness,
      springDamping,
      colorLerp,
      emissiveLerp,
      hoverScale,
      baseScale,
      emissiveBase,
      emissiveHover,
      clickPulseDecay,
      flipSpeed,
      defaultColor,
      hoverColor,
    } = config;

    // Playful flip with tiny bounce
    if (isFlipping.current) {
      flipProgress.current += flipSpeed * delta;
      const t = Math.min(flipProgress.current, 1);

      const eased =
        t < 0.8
          ? 1 - Math.pow(1 - t, 2.2)
          : 1 + 0.04 * Math.sin((t - 0.8) * Math.PI * 10);

      group.rotation.x = eased * Math.PI * 2;

      if (t >= 1) {
        isFlipping.current = false;
        group.rotation.x = 0;
      }
    }

    // Spring scale (paused during flip for clarity)
    if (!isFlipping.current) {
      const targetScale = hovered.current ? hoverScale : baseScale;
      const force = springStiffness * (targetScale - scale.current);
      const damping = springDamping * velocity.current;
      const accel = force - damping;

      velocity.current += accel * delta;
      scale.current += velocity.current * delta;

      group.scale.setScalar(scale.current);
    }

    // Color
    const targetColor = hovered.current ? hoverColor : defaultColor;
    mat.color.lerp(targetColor, colorLerp);

    // Emissive
    const targetEmissive = hovered.current ? emissiveHover : emissiveBase;
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      targetEmissive,
      emissiveLerp,
    );

    // Click pulse
    if (clickPulse.current > 0) {
      mat.emissiveIntensity += clickPulse.current * delta;
      clickPulse.current -= clickPulseDecay;
    }
  };

  return { setHovered, triggerClickPulse, startFlip, update };
}
