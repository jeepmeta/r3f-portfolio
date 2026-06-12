// app/systems/voxels/DogCubes.tsx
"use client";

import { JSX, memo, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import pixelFrames from "@/data/dog_pixels.json";
import { GRID, CUBE, HALF, FUR_REF } from "./voxelConstants";

const SATURATION = 2.35;

const saturate = (r: number, g: number, b: number) => {
  const color = new THREE.Color(r, g, b);
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  hsl.s = Math.min(1, hsl.s * SATURATION);
  color.setHSL(hsl.h, hsl.s, hsl.l);
  return color;
};

export const DogCubes = memo(function DogCubes(
  props: JSX.IntrinsicElements["group"],
) {
  const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const { camera } = useThree();

  const geometry = useMemo(() => new THREE.BoxGeometry(CUBE, CUBE, CUBE), []);

  // Build voxel list from ANY visible pixel in ANY frame
  const voxelData = useMemo(() => {
    const list: { x: number; y: number; pos: THREE.Vector3 }[] = [];

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        let visible = false;

        for (let f = 0; f < pixelFrames.length; f++) {
          const px = pixelFrames[f][y]?.[x];
          if (px && px[3] > 10) {
            visible = true;
            break;
          }
        }

        if (visible) {
          list.push({
            x,
            y,
            pos: new THREE.Vector3(x * CUBE - HALF, -y * CUBE + HALF, 0),
          });
        }
      }
    }

    return list;
  }, []);

  // SAMPLE EYEBROW COLORS ONCE
  const eyebrowHighlightColor = useMemo(() => {
    const px = pixelFrames[0][8]?.[19];
    return px && px[3] > 10
      ? saturate(px[0] / 255, px[1] / 255, px[2] / 255)
      : new THREE.Color("#ffffff");
  }, []);

  const eyebrowBrowColor = useMemo(() => {
    const px = pixelFrames[0][9]?.[19];
    return px && px[3] > 10
      ? saturate(px[0] / 255, px[1] / 255, px[2] / 255)
      : new THREE.Color("#888888");
  }, []);

  // SAMPLE FUR COLOR ONCE
  const furColor = useMemo(() => {
    const px = pixelFrames[0][FUR_REF[0]]?.[FUR_REF[1]];
    return px && px[3] > 10
      ? saturate(px[0] / 255, px[1] / 255, px[2] / 255)
      : new THREE.Color("#888888");
  }, []);

  // RANDOMIZED BLINK STATE MACHINE
  const isBlinkingRef = useRef(false);
  const nextBlinkTimeRef = useRef(0);
  const blinkEndTimeRef = useRef(0);

  useEffect(() => {
    nextBlinkTimeRef.current = performance.now() + 1000 + Math.random() * 3000;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const now = performance.now();

    // Start blink
    if (!isBlinkingRef.current && now >= nextBlinkTimeRef.current) {
      isBlinkingRef.current = true;

      // Blink lasts 120–180ms
      blinkEndTimeRef.current = now + (120 + Math.random() * 60);

      // 15% chance of double-blink
      const isDouble = Math.random() < 0.15;

      if (isDouble) {
        nextBlinkTimeRef.current =
          blinkEndTimeRef.current + (150 + Math.random() * 80);
      } else {
        nextBlinkTimeRef.current = now + 2000 + Math.random() * 4000;
      }
    }

    // End blink
    if (isBlinkingRef.current && now >= blinkEndTimeRef.current) {
      isBlinkingRef.current = false;
    }

    const blink = isBlinkingRef.current;

    // EYEBROW POSITIONS
    const eyebrowRest = ["8,19", "9,19", "9,20"];
    const eyebrowBlink = ["9,19", "10,19", "10,20"];
    const eyebrowPositions = blink ? eyebrowBlink : eyebrowRest;

    const highlightKey = eyebrowPositions[0];

    // EYE TRACKING
    const lookRight = camera.position.x > 3.8;
    const eyeBlackKey = lookRight ? "10,20" : "10,19";
    const eyeWhiteKey = lookRight ? "10,19" : "10,20";

    voxelData.forEach((v, i) => {
      const mat = materialsRef.current[i];
      if (!mat) return;

      const key = `${v.y},${v.x}`;
      const px =
        pixelFrames[Math.floor(t * 8) % pixelFrames.length][v.y]?.[v.x];

      // SPECIAL BLINK OVERRIDES (must run BEFORE eyebrow override)
      if (blink && (key === "8,19" || key === "9,20")) {
        mat.visible = true;
        mat.color.copy(furColor);
        return;
      }

      // EYEBROW OVERRIDE
      if (eyebrowPositions.includes(key)) {
        mat.visible = true;

        if (key === highlightKey) {
          mat.color.copy(eyebrowHighlightColor);
        } else {
          mat.color.copy(eyebrowBrowColor);
        }

        return;
      }

      // EYE OVERRIDE (only when not blinking)
      if (!blink) {
        if (key === eyeBlackKey) {
          mat.visible = true;
          mat.color.set("#000000");
          return;
        }
        if (key === eyeWhiteKey) {
          mat.visible = true;
          mat.color.set("#ffffff");
          return;
        }
      }

      // NORMAL SPRITE COLOR
      if (!px || px[3] <= 10) {
        mat.visible = false;
        return;
      }

      mat.visible = true;
      mat.color.copy(saturate(px[0] / 255, px[1] / 255, px[2] / 255));
    });
  });

  return (
    <group {...props}>
      {voxelData.map((v, i) => (
        <mesh key={i} position={v.pos} geometry={geometry}>
          <meshPhysicalMaterial
            ref={(m) => m && (materialsRef.current[i] = m)}
            toneMapped={false}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
});
