import * as React from "react";

type GroupProps = React.JSX.IntrinsicElements["group"];

export type HoloPlaneProps = {
  readonly position?: GroupProps["position"];
  readonly rotation?: GroupProps["rotation"];
  readonly scale?: GroupProps["scale"];
  readonly children?: React.ReactNode;
  readonly width?: number;
  readonly height?: number;
} & Omit<GroupProps, "position" | "rotation" | "scale">;

export function HoloPlane(props: HoloPlaneProps) {
  const {
    position,
    rotation,
    scale,
    children,
    width = 2,
    height = 1,
    ...groupProps
  } = props;

  const css = getComputedStyle(document.documentElement);

  const emissiveIntensity = parseFloat(
    css.getPropertyValue("--jm-emissive-intensity"),
  );
  const opacity = parseFloat(css.getPropertyValue("--jm-opacity"));
  const roughness = parseFloat(css.getPropertyValue("--jm-surface-roughness"));
  const transmission = parseFloat(
    css.getPropertyValue("--jm-surface-transmission"),
  );
  const ior = parseFloat(css.getPropertyValue("--jm-surface-ior"));

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      {...groupProps}
    >
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color={"var(--jm-primary)"}
          emissive={"var(--jm-primary)"}
          emissiveIntensity={emissiveIntensity}
          opacity={opacity}
          transparent
          roughness={roughness}
          transmission={transmission}
          ior={ior}
          thickness={0.01}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {children}
    </group>
  );
}
