"use client";

import React, { useMemo, useRef, useState } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/Addons.js";

/* -------------------------------------------------------
   CONFIG — tweak proportions, depth, spacing, etc.
------------------------------------------------------- */
const CONFIG = {
  barWidth: 3.0,
  barHeight: 0.45,
  cornerRadius: 0.18,

  baseDepth: 0.008,
  rimDepth: 0.015,
  rimThickness: 0.04,

  iconDepth: 0.03,
  iconSize: 0.18,
  iconSpacing: 0.35,
  iconYOffset: 0.03,

  baseEmissiveIntensity: 0.3,
  rimEmissiveIntensity: 0.6,
  iconEmissiveIntensity: 1.0,
} as const;

/* -------------------------------------------------------
   ICONS — PASTE SVGs FROM ICONBUDDY HERE
   Each entry must be full <svg>...</svg> markup.
------------------------------------------------------- */
const ICONS = {
  github: `
    <svg viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.59 9.52 21.27 9.52 21.0C9.52 20.76 9.51 20.14 9.51 19.38C7 19.91 6.35 18.46 6.35 18.46C5.9 17.39 5.24 17.1 5.24 17.1C4.31 16.5 5.31 16.52 5.31 16.52C6.34 16.59 6.88 17.57 6.88 17.57C7.79 19.12 9.27 18.68 9.84 18.43C9.93 17.78 10.19 17.34 10.47 17.1C8.41 16.86 6.25 16.05 6.25 12.73C6.25 11.75 6.6 10.96 7.18 10.35C7.09 10.11 6.78 9.27 7.26 8.05C7.26 8.05 8.01 7.8 9.5 8.87C10.2 8.68 10.95 8.59 11.7 8.59C12.45 8.59 13.2 8.68 13.9 8.87C15.39 7.8 16.14 8.05 16.14 8.05C16.62 9.27 16.31 10.11 16.22 10.35C16.8 10.96 17.15 11.75 17.15 12.73C17.15 16.06 14.98 16.85 12.91 17.09C13.27 17.4 13.58 18.01 13.58 18.93C13.58 20.26 13.57 21.36 13.57 21.7C13.57 21.97 13.75 22.29 14.26 22.19C18.23 20.86 21.1 17.11 21.1 12.69C21.1 6.48 16.52 2 12 2Z" />
    </svg>
  `,
  x: `
    <svg viewBox="0 0 24 24">
      <path d="M4 3L10.5 3L14 8.5L18.5 3H20L14.75 10.25L20 21H13.5L10 15.25L5 21H4.5L9.75 13.5L4 3Z" />
    </svg>
  `,
  youtube: `
    <svg viewBox="0 0 24 24">
      <path d="M21.6 7.2C21.3 6.1 20.5 5.3 19.4 5C17.7 4.5 12 4.5 12 4.5C12 4.5 6.3 4.5 4.6 5C3.5 5.3 2.7 6.1 2.4 7.2C2 8.9 2 12 2 12C2 12 2 15.1 2.4 16.8C2.7 17.9 3.5 18.7 4.6 19C6.3 19.5 12 19.5 12 19.5C12 19.5 17.7 19.5 19.4 19C20.5 18.7 21.3 17.9 21.6 16.8C22 15.1 22 12 22 12C22 12 22 8.9 21.6 7.2ZM10.5 15.5V8.5L15.5 12L10.5 15.5Z" />
    </svg>
  `,
  linkedin: `
    <svg viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 4.6 4.09 5.5 3 5.5C1.91 5.5 1.02 4.6 1.02 3.5C1.02 2.4 1.91 1.5 3 1.5C4.09 1.5 4.98 2.4 4.98 3.5ZM2 8H4V21H2V8ZM8 8H10V9.5H10.03C10.36 8.86 11.24 8 12.67 8C15.09 8 16 9.5 16 12.1V21H14V12.9C14 11.4 13.64 10.5 12.5 10.5C11.26 10.5 10.6 11.4 10.6 12.9V21H8V8Z" />
    </svg>
  `,
  discord: `
    <svg viewBox="0 0 24 24">
      <path d="M19.5 5C18.4 4.5 17.2 4.1 16 4C15.8 4.3 15.6 4.7 15.5 5.1C14.3 4.9 13.1 4.9 12 4.9C10.9 4.9 9.7 4.9 8.5 5.1C8.4 4.7 8.2 4.3 8 4C6.8 4.1 5.6 4.5 4.5 5C2.7 7.7 2.2 10.3 2.4 12.9C3.7 13.9 5 14.6 6.3 15C6.6 14.6 6.9 14.1 7.1 13.6C6.6 13.4 6.1 13.1 5.7 12.8C5.8 12.7 5.9 12.6 6 12.5C7.3 13.1 8.7 13.4 10.1 13.5C10.7 13.6 11.3 13.6 11.9 13.6C12.5 13.6 13.1 13.6 13.7 13.5C15.1 13.4 16.5 13.1 17.8 12.5C17.9 12.6 18 12.7 18.1 12.8C17.7 13.1 17.2 13.4 16.7 13.6C16.9 14.1 17.2 14.6 17.5 15C18.8 14.6 20.1 13.9 21.4 12.9C21.7 10.1 21.1 7.6 19.5 5ZM9.5 11.5C8.7 11.5 8.1 10.9 8.1 10.1C8.1 9.3 8.7 8.7 9.5 8.7C10.3 8.7 10.9 9.3 10.9 10.1C10.9 10.9 10.3 11.5 9.5 11.5ZM14.5 11.5C13.7 11.5 13.1 10.9 13.1 10.1C13.1 9.3 13.7 8.7 14.5 8.7C15.3 8.7 15.9 9.3 15.9 10.1C15.9 10.9 15.3 11.5 14.5 11.5Z" />
    </svg>
  `,
} as const;

type IconName = keyof typeof ICONS;

/* -------------------------------------------------------
   LINKS — user social URLs
------------------------------------------------------- */
type SocialLinks = Partial<Record<IconName, string>>;

type SocialBarProps = {
  icons?: IconName[];
  links?: SocialLinks;
} & ThreeElements["group"];

/* -------------------------------------------------------
   Rounded rectangle + rim helpers
------------------------------------------------------- */
function createRoundedRectShape(
  width: number,
  height: number,
  radius: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

function createRimShape(
  width: number,
  height: number,
  radius: number,
  thickness: number,
): THREE.Shape {
  const outer = createRoundedRectShape(width, height, radius);
  const inner = createRoundedRectShape(
    width - thickness * 2,
    height - thickness * 2,
    Math.max(radius - thickness, 0),
  );
  outer.holes.push(inner);
  return outer;
}

/* -------------------------------------------------------
   SVG → extruded geometry
------------------------------------------------------- */
function createIconGeometry(
  svgString: string,
  depth: number,
): THREE.ExtrudeGeometry {
  const loader = new SVGLoader();
  const svgData: SVGLoader.SVGResult = loader.parse(svgString);

  const shapes: THREE.Shape[] = [];
  svgData.paths.forEach((path: SVGLoader.Path) => {
    const pathShapes = SVGLoader.createShapes(path);
    pathShapes.forEach((s: THREE.Shape) => shapes.push(s));
  });

  const geom = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: false,
  });

  geom.center();
  return geom;
}

/* -------------------------------------------------------
   IconGlyph — handles hover/click animation + link
------------------------------------------------------- */
type IconGlyphProps = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: [number, number, number];
  baseScale: number;
  link?: string;
  name: string;
};

const IconGlyph: React.FC<IconGlyphProps> = ({
  geometry,
  material,
  position,
  baseScale,
  link,
  name,
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  useFrame(() => {
    if (!ref.current) return;
    const target = clicked ? 0.95 : hovered ? 1.12 : 1.0;
    const targetVec = new THREE.Vector3(
      target * baseScale,
      target * baseScale,
      target * baseScale,
    );
    ref.current.scale.lerp(targetVec, 0.15);
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      position={position}
      scale={[baseScale, baseScale, baseScale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 120);
        if (link) window.open(link, "_blank", "noopener,noreferrer");
      }}
      name={name}
    />
  );
};

/* -------------------------------------------------------
   SocialBar — main component
------------------------------------------------------- */
export const SocialBar: React.FC<SocialBarProps> = ({
  icons = ["github", "x", "youtube", "linkedin", "discord"],
  links = {},
  ...groupProps
}) => {
  const baseGeometry = useMemo<THREE.ExtrudeGeometry>(() => {
    const shape = createRoundedRectShape(
      CONFIG.barWidth,
      CONFIG.barHeight,
      CONFIG.cornerRadius,
    );
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: CONFIG.baseDepth,
      bevelEnabled: false,
    });
    geom.translate(0, 0, -CONFIG.baseDepth / 2);
    return geom;
  }, []);

  const rimGeometry = useMemo<THREE.ExtrudeGeometry>(() => {
    const shape = createRimShape(
      CONFIG.barWidth,
      CONFIG.barHeight,
      CONFIG.cornerRadius,
      CONFIG.rimThickness,
    );
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: CONFIG.rimDepth,
      bevelEnabled: false,
    });
    geom.translate(0, 0, CONFIG.baseDepth / 2);
    return geom;
  }, []);

  const iconGeometries = useMemo<Map<IconName, THREE.ExtrudeGeometry>>(() => {
    const map = new Map<IconName, THREE.ExtrudeGeometry>();
    (Object.keys(ICONS) as IconName[]).forEach((key: IconName) => {
      map.set(key, createIconGeometry(ICONS[key], CONFIG.iconDepth));
    });
    return map;
  }, []);

  const iconPositions = useMemo<Array<[number, number, number]>>(() => {
    const count: number = icons.length;
    if (count === 0) return [];
    const totalWidth: number = (count - 1) * CONFIG.iconSpacing;
    const startX: number = -totalWidth / 2;
    const z: number =
      CONFIG.rimDepth / 2 + CONFIG.baseDepth / 2 + CONFIG.iconDepth / 2;

    return icons.map((_, index: number) => {
      const x: number = startX + index * CONFIG.iconSpacing;
      const y: number = CONFIG.iconYOffset;
      return [x, y, z] as [number, number, number];
    });
  }, [icons]);

  const baseMaterial = useMemo<THREE.MeshStandardMaterial>(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#050608"),
        emissive: new THREE.Color("#36b8d0"),
        emissiveIntensity: CONFIG.baseEmissiveIntensity,
        metalness: 0.2,
        roughness: 0.6,
      }),
    [],
  );

  const rimMaterial = useMemo<THREE.MeshStandardMaterial>(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#050608"),
        emissive: new THREE.Color("#36b8d0"),
        emissiveIntensity: CONFIG.rimEmissiveIntensity,
        metalness: 0.4,
        roughness: 0.4,
      }),
    [],
  );

  const iconMaterial = useMemo<THREE.MeshStandardMaterial>(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#050608"),
        emissive: new THREE.Color("#36b8d0"),
        emissiveIntensity: CONFIG.iconEmissiveIntensity,
        metalness: 0.3,
        roughness: 0.3,
      }),
    [],
  );

  return (
    <group {...groupProps}>
      {/* Base */}
      <mesh geometry={baseGeometry} material={baseMaterial} />

      {/* Rim */}
      <mesh geometry={rimGeometry} material={rimMaterial} />

      {/* Icons */}
      {icons.map((iconName: IconName, index: number) => {
        const geometry = iconGeometries.get(iconName);
        if (!geometry) return null;
        const position = iconPositions[index];
        const link = links[iconName];

        return (
          <IconGlyph
            key={`${iconName}-${index}`}
            geometry={geometry}
            material={iconMaterial}
            position={position}
            baseScale={CONFIG.iconSize}
            link={link}
            name={iconName}
          />
        );
      })}
    </group>
  );
};

/* -------------------------------------------------------
   HOW TO ADD YOUR OWN ICONS + LINKS
---------------------------------------------------------

1. Open IconBuddy in VSCode.
2. Copy the FULL SVG markup (not just the path).
3. Paste it into the ICONS object above:

   customIcon: `
     <svg viewBox="0 0 24 24">
       <path d="..." />
     </svg>
   `,

4. Use it with your links:

   <SocialBar
     icons={['github', 'customIcon']}
     links={{
       github: 'https://github.com/yourname',
       customIcon: 'https://your-custom-link.com',
     }}
   />

------------------------------------------------------- */
