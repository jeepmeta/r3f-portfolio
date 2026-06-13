import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Section } from "@/stores/useSection";
import { NAV_CONFIG } from "./navConfig";
import { computeGeometryMetrics } from "@/hooks/useTextGeometry";
import { useNavItemAnimation } from "@/hooks/useNavItemAnimation";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export interface NavItemData {
  label: string;
  section: Section;
}

interface NavItemProps {
  item: NavItemData;
  geometry: TextGeometry;
  xPos: number;
  onNavigate: (section: Section) => void;
}

export const NavItem = memo(function NavItem({
  geometry,
  xPos,
}: NavItemProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const metrics = computeGeometryMetrics(geometry);

  const anim = useNavItemAnimation({
    ...NAV_CONFIG.animation,
    defaultColor: NAV_CONFIG.colors.default,
    hoverColor: NAV_CONFIG.colors.hover,
  });

  const handleClick = () => {
    anim.startFlip();
    anim.triggerClickPulse();
  };

  useFrame((_, delta) => {
    if (groupRef.current && materialRef.current) {
      anim.update(materialRef.current, groupRef.current, delta);
    }
  });

  return (
    <group ref={groupRef} position={[xPos, 0, 0]}>
      {/* Hitbox centered on text */}
      <mesh
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          anim.setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          anim.setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={handleClick}
      >
        <boxGeometry args={[metrics.hitboxWidth, metrics.hitboxHeight, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Text already centered by geom.center() */}
      <mesh geometry={geometry} position={[0, metrics.centerY * 0.15, 0]}>
        <meshStandardMaterial
          ref={materialRef}
          color={NAV_CONFIG.colors.default}
          emissive={NAV_CONFIG.colors.emissive}
          emissiveIntensity={NAV_CONFIG.animation.emissiveBase}
        />
      </mesh>
    </group>
  );
});
