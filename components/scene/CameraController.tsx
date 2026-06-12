// @/components/scene/CameraController.tsx
"use client";

import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Vector3 } from "three";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSection } from "@/stores/useSection";
import { useDevice } from "@/hooks/useDevice";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";

const PANEL_TARGETS: Record<
  "code",
  { position: [number, number, number]; lookAt: [number, number, number] }
> = {
  code: { position: [7, 2, -10], lookAt: [7, 2, -12] },
};

const DEFAULT_POS_DESKTOP: [number, number, number] = [0, 5, 10];
const DEFAULT_POS_MOBILE: [number, number, number] = [0, 6, 12];

// 🔥 Your chosen orbit center
const ORBIT_LOOKAT: [number, number, number] = [0, 1.8, 0];

const ORBIT_CONFIG_DESKTOP = {
  minDistance: 6,
  maxDistance: 14,
  minPolarAngle: Math.PI / 3,
  maxPolarAngle: Math.PI / 2,
  rotateSpeed: 1.0,
  autoRotateSpeed: -0.7,
  zoomSpeed: 1.2,
};
const ORBIT_CONFIG_MOBILE = {
  minDistance: 7,
  maxDistance: 16,
  minPolarAngle: Math.PI / 3,
  maxPolarAngle: Math.PI / 2,
  rotateSpeed: 0.6,
  autoRotateSpeed: -0.5,
  zoomSpeed: 0.8,
};

export function CameraController() {
  const { camera } = useThree();
  const section = useSection((s) => s.section);
  const { isMobile } = useDevice();

  const isLocked = section === "code";
  const target = isLocked ? PANEL_TARGETS[section] : null;

  const defaultPos = isMobile ? DEFAULT_POS_MOBILE : DEFAULT_POS_DESKTOP;
  const orbitConfig = isMobile ? ORBIT_CONFIG_MOBILE : ORBIT_CONFIG_DESKTOP;

  const prevIsLocked = useRef(isLocked);

  const lookAtVec = useRef(new Vector3());
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useGSAP(
    () => {
      const wasOrbitToOrbit = !isLocked && !prevIsLocked.current;
      if (wasOrbitToOrbit) return;

      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(lookAtVec.current);

      const toPos = target ? target.position : defaultPos;
      const toLookAt = target ? target.lookAt : ORBIT_LOOKAT;

      // 🔥 Before tweening, sync OrbitControls target to the START of the tween
      if (controlsRef.current) {
        controlsRef.current.target.copy(lookAtVec.current);
        controlsRef.current.update();
      }

      gsap.to(camera.position, {
        x: toPos[0],
        y: toPos[1],
        z: toPos[2],
        duration: 3.5,
        ease: "power4.inOut",
      });

      gsap.to(lookAtVec.current, {
        x: toLookAt[0],
        y: toLookAt[1],
        z: toLookAt[2],
        duration: 2.5,
        ease: "power4.inOut",
        onUpdate: () => {
          camera.lookAt(lookAtVec.current);

          // 🔥 During tween, OrbitControls follows the animated lookAt
          if (controlsRef.current) {
            controlsRef.current.target.copy(lookAtVec.current);
            controlsRef.current.update();
          }
        },
        onComplete: () => {
          // 🔥 After tween, OrbitControls takes over with the TRUE orbit center
          if (!isLocked && controlsRef.current) {
            controlsRef.current.target.set(
              ORBIT_LOOKAT[0],
              ORBIT_LOOKAT[1],
              ORBIT_LOOKAT[2],
            );
            controlsRef.current.update();
          }
        },
      });

      prevIsLocked.current = isLocked;
    },
    { dependencies: [section, isLocked] },
  );

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isLocked}
      enablePan={false}
      enableZoom={!isLocked}
      enableRotate={!isLocked}
      autoRotate={!isLocked}
      enableDamping={true}
      dampingFactor={0.08}
      {...orbitConfig}
    />
  );
}
