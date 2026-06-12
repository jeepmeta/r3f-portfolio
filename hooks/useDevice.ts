"use client";

import { useState, useEffect } from "react";

type DeviceState = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowEnd: boolean;
  width: number;
  height: number;
};

export function useDevice() {
  const [device, setDevice] = useState<DeviceState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLowEnd: false,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Check for low-end devices based on hardware concurrency and memory
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as { deviceMemory?: number }).deviceMemory || 8;
      const isLowEnd = cores <= 4 || memory <= 4 || width < 768;

      setDevice({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isLowEnd,
        width,
        height,
      });
    };

    // Initial check
    checkDevice();

    // Listen for changes
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return device;
}

// Camera settings based on device
export function getCameraSettings(isMobile: boolean) {
  return {
    position: isMobile
      ? ([-3, 4, 10] as [number, number, number])
      : ([-3, 4.5, 10] as [number, number, number]),
    fov: isMobile ? 72 : 62,
    dpr: isMobile
      ? ([1, 1.5] as [number, number])
      : ([1, 2] as [number, number]),
  };
}

// Dog scale based on device
export function getDogScale(isMobile: boolean) {
  return isMobile ? 2.2 : 2.8;
}

// Social orbit radius based on device
export function getSocialRadius(isMobile: boolean) {
  return isMobile ? 4.8 : 5.8;
}
