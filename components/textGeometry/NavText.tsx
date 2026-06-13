import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { NAV_CONFIG } from "./navConfig";
import { createTextGeometry, loadFont } from "@/hooks/useTextGeometry";
import { NavItem, type NavItemData } from "./NavItem";
import type { Section } from "@/stores/useSection";
import { useMobile } from "@/hooks/useMobile";

const FONT_URL =
  "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/fonts/helvetiker_bold.typeface.json";

const NAV_ITEMS: NavItemData[] = [
  { label: "DEVELOPER PORTFOLIO", section: "developer portfolio" as Section },
];

interface NavTextProps {
  onNavigate?: (section: Section) => void;
}

export const NavText = memo(function NavText({ onNavigate }: NavTextProps) {
  const isMobile = useMobile();
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    let mounted = true;
    loadFont(FONT_URL).then((f) => {
      if (mounted) setFont(f);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const titleGeometry = useMemo(() => {
    if (!font) return null;
    return createTextGeometry(font, NAV_CONFIG.title.text, {
      size: isMobile
        ? NAV_CONFIG.title.sizeMobile
        : NAV_CONFIG.title.sizeDesktop,
      depth: NAV_CONFIG.title.depth,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 4,
    });
  }, [font, isMobile]);

  const itemGeometries = useMemo(() => {
    if (!font) return NAV_ITEMS.map(() => null as TextGeometry | null);

    return NAV_ITEMS.map((item) =>
      createTextGeometry(font, item.label, {
        size: isMobile
          ? NAV_CONFIG.items.sizeMobile
          : NAV_CONFIG.items.sizeDesktop,
        depth: NAV_CONFIG.items.depth,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.008,
        bevelSegments: 4,
      }),
    );
  }, [font, isMobile]);

  const itemWidths = useMemo(() => {
    return itemGeometries.map((g) => {
      if (!g || !g.boundingBox) return 0;
      const box = g.boundingBox;
      return box.max.x - box.min.x;
    });
  }, [itemGeometries]);

  const itemPositions = useMemo(() => {
    const fontSize = isMobile
      ? NAV_CONFIG.items.sizeMobile
      : NAV_CONFIG.items.sizeDesktop;

    const gap = fontSize * 2;

    const totalWidth =
      itemWidths.reduce((sum, w) => sum + w, 0) + gap * (itemWidths.length - 1);

    const start = -totalWidth / 2;

    return itemWidths.reduce<{ positions: number[]; cursor: number }>(
      (acc, width) => {
        const x = acc.cursor + width / 2;
        acc.positions.push(x);
        acc.cursor += width + gap;
        return acc;
      },
      { positions: [], cursor: start },
    ).positions;
  }, [itemWidths, isMobile]);

  const handleNavigate = useCallback(
    (section: Section) => {
      if (onNavigate) onNavigate(section);
    },
    [onNavigate],
  );

  if (!font || !titleGeometry) return null;

  const yOffset = isMobile
    ? NAV_CONFIG.title.yOffsetMobile
    : NAV_CONFIG.title.yOffsetDesktop;

  const titleYOffset = isMobile
    ? NAV_CONFIG.title.titleYOffsetMobile
    : NAV_CONFIG.title.titleYOffsetDesktop;

  return (
    <group position={[0, yOffset, 0]}>
      <mesh geometry={titleGeometry} position={[0, titleYOffset, 0]}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00aaff"
          emissiveIntensity={1.2}
        />
      </mesh>

      {NAV_ITEMS.map((item, i) => {
        const geom = itemGeometries[i];
        if (!geom) return null;

        return (
          <NavItem
            key={item.label}
            item={item}
            geometry={geom}
            xPos={itemPositions[i]}
            onNavigate={handleNavigate}
          />
        );
      })}
    </group>
  );
});
