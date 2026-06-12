import * as THREE from "three";

export const NAV_CONFIG = {
  title: {
    text: "jeepmeta",
    sizeDesktop: 0.55,
    sizeMobile: 0.45,
    depth: 0.08,
    yOffsetDesktop: 3.6,
    yOffsetMobile: 3.8,
    titleYOffsetDesktop: 1.2,
    titleYOffsetMobile: 1.2,
  },

  items: {
    sizeDesktop: 0.25,
    sizeMobile: 0.17,
    depth: 0.06,
  },

  colors: {
    default: new THREE.Color("#00eeff"),
    hover: new THREE.Color("#00ff88"),
    emissive: new THREE.Color("#0088aa"),
  },

  animation: {
    springStiffness: 95,
    springDamping: 14,
    colorLerp: 0.22,
    emissiveLerp: 0.22,
    hoverScale: 1.18,
    baseScale: 1,
    emissiveBase: 1,
    emissiveHover: 2,
    clickPulseIntensity: 2.2,
    clickPulseDecay: 0.05,
    flipSpeed: 1.8,
  },
} as const;
