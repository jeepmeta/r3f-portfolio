"use client";

import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { socials, socialPositions, SocialName } from "./socialConfig";
import { Icons } from "@/components/Icons";
import { renderToStaticMarkup } from "react-dom/server";

const ICON_SIZE = 0.7;

type SVGIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  className?: string;
}>;

function svgToTexture(Component: SVGIconComponent) {
  const svg = renderToStaticMarkup(<Component size={256} color="#00ffff" />);
  const encoded = encodeURIComponent(svg);

  const img = new Image();
  img.src = `data:image/svg+xml,${encoded}`;

  const texture = new THREE.Texture();
  img.onload = () => {
    texture.image = img;
    texture.needsUpdate = true;
  };

  return texture;
}

export const SocialIconsOrbit = memo(function SocialIconsOrbit() {
  const groupRef = useRef<THREE.Group>(null!);

  // store scale targets for hover/click animation
  const scales = useRef(socials.map(() => 1));

  const iconMeshes = useMemo(() => {
    return socials.map((social) => {
      const IconComponent = Icons[
        social.name as SocialName
      ] as SVGIconComponent;
      const texture = svgToTexture(IconComponent);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const geometry = new THREE.PlaneGeometry(ICON_SIZE, ICON_SIZE);

      return { geometry, material };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const group = groupRef.current;

    if (group) group.rotation.y -= 0.0028;

    socials.forEach((_, i) => {
      const wrapper = group.children[i] as THREE.Group;
      if (!wrapper) return;

      const base = socialPositions[i];

      const lift = Math.sin(t * 1.4 + i * 0.8) * 0.12;
      const microOrbit = Math.sin(t * 0.6 + i) * 0.08;

      wrapper.position.set(base.x + microOrbit, base.y + lift, base.z);
      wrapper.rotation.set(0, base.rotationY, 0);

      // smooth spring scale animation
      const current = wrapper.scale.x;
      const target = scales.current[i];
      wrapper.scale.setScalar(current + (target - current) * 0.15);
    });
  });

  return (
    <group ref={groupRef}>
      {iconMeshes.map((icon, i) => (
        <group
          key={socials[i].name}
          onPointerOver={() => {
            scales.current[i] = 1.25;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            scales.current[i] = 1;
            document.body.style.cursor = "default";
          }}
          onPointerDown={() => {
            scales.current[i] = 0.9;
          }}
          onPointerUp={() => {
            scales.current[i] = 1.25;
            window.open(socials[i].url, "_blank");
          }}
        >
          <mesh geometry={icon.geometry} material={icon.material} />
        </group>
      ))}
    </group>
  );
});
