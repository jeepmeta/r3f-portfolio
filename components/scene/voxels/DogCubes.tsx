// components/scene/voxels/DogCubes.tsx
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

type DogCubesProps = JSX.IntrinsicElements["group"] & {
  quality?: "low" | "medium" | "high";
};

export const DogCubes = memo(function DogCubes({
  quality = "high",
  ...props
}: DogCubesProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { camera } = useThree();

  const geometry = useMemo(() => {
    const segments = quality === "low" ? 1 : quality === "medium" ? 2 : 3;
    return new THREE.BoxGeometry(CUBE, CUBE, CUBE, segments, segments, segments);
  }, [quality]);

  // Single lightweight material (Basic is sufficient and faster here)
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        toneMapped: false,
        fog: false,
      }),
    []
  );

  // Build voxel list (same logic as before)
  const voxelData = useMemo(() => {
    const list: { x: number; y: number; pos: THREE.Vector3; key: string }[] = [];

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
            key: `${y},${x}`,
          });
        }
      }
    }
    return list;
  }, []);

  // Precomputed special colors (same as original)
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

  const furColor = useMemo(() => {
    const px = pixelFrames[0][FUR_REF[0]]?.[FUR_REF[1]];
    return px && px[3] > 10
      ? saturate(px[0] / 255, px[1] / 255, px[2] / 255)
      : new THREE.Color("#888888");
  }, []);

  // Blink state machine (unchanged logic)
  const isBlinkingRef = useRef(false);
  const nextBlinkTimeRef = useRef(0);
  const blinkEndTimeRef = useRef(0);

  useEffect(() => {
    nextBlinkTimeRef.current = performance.now() + 1000 + Math.random() * 3000;
  }, []);

  // Initialize instance matrices + colors once
  useEffect(() => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    voxelData.forEach((v, i) => {
      dummy.position.copy(v.pos);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, furColor); // initial color
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [voxelData, furColor, dummy]);

  useFrame(({ clock }) => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    const t = clock.elapsedTime;
    const now = performance.now();

    // Blink timing (exact same logic)
    if (!isBlinkingRef.current && now >= nextBlinkTimeRef.current) {
      isBlinkingRef.current = true;
      blinkEndTimeRef.current = now + (120 + Math.random() * 60);

      const isDouble = Math.random() < 0.15;
      if (isDouble) {
        nextBlinkTimeRef.current =
          blinkEndTimeRef.current + (150 + Math.random() * 80);
      } else {
        nextBlinkTimeRef.current = now + 2000 + Math.random() * 4000;
      }
    }

    if (isBlinkingRef.current && now >= blinkEndTimeRef.current) {
      isBlinkingRef.current = false;
    }

    const blink = isBlinkingRef.current;

    const eyebrowRest = ["8,19", "9,19", "9,20"];
    const eyebrowBlink = ["9,19", "10,19", "10,20"];
    const eyebrowPositions = blink ? eyebrowBlink : eyebrowRest;
    const highlightKey = eyebrowPositions[0];

    const lookRight = camera.position.x > 3.8;
    const eyeBlackKey = lookRight ? "10,20" : "10,19";
    const eyeWhiteKey = lookRight ? "10,19" : "10,20";

    const currentFrame = pixelFrames[Math.floor(t * 8) % pixelFrames.length];

    voxelData.forEach((v, i) => {
      const key = v.key;
      const px = currentFrame[v.y]?.[v.x];

      let color: THREE.Color = furColor;
      let visible = true;

      // Special blink overrides
      if (blink && (key === "8,19" || key === "9,20")) {
        color = furColor;
      }
      // Eyebrow override
      else if (eyebrowPositions.includes(key)) {
        color = key === highlightKey ? eyebrowHighlightColor : eyebrowBrowColor;
      }
      // Eye override (when not blinking)
      else if (!blink) {
        if (key === eyeBlackKey) {
          color = new THREE.Color("#000000");
        } else if (key === eyeWhiteKey) {
          color = new THREE.Color("#ffffff");
        } else if (!px || px[3] <= 10) {
          visible = false;
        } else {
          color = saturate(px[0] / 255, px[1] / 255, px[2] / 255);
        }
      }
      // Normal sprite color
      else if (!px || px[3] <= 10) {
        visible = false;
      } else {
        color = saturate(px[0] / 255, px[1] / 255, px[2] / 255);
      }

      // Update instance
      dummy.position.copy(v.pos);
      dummy.scale.setScalar(visible ? 1 : 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      if (visible) {
        mesh.setColorAt(i, color);
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <group {...props}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[geometry, material, voxelData.length]}
      />
    </group>
  );
});