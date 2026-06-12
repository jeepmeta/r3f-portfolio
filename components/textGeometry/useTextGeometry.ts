import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import {
  TextGeometry,
  type TextGeometryParameters,
} from "three/examples/jsm/geometries/TextGeometry.js";

export interface GeometryMetrics {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  hitboxWidth: number;
  hitboxHeight: number;
}

let fontPromise: Promise<Font> | null = null;

export function loadFont(url: string): Promise<Font> {
  if (!fontPromise) {
    const loader = new FontLoader();
    fontPromise = fetch(url)
      .then((r) => r.json())
      .then((json) => loader.parse(json));
  }
  return fontPromise;
}

export function createTextGeometry(
  font: Font,
  text: string,
  options: Omit<TextGeometryParameters, "font">,
): TextGeometry {
  const geom = new TextGeometry(text, { ...options, font });

  // Compute bounding box and center so pivot is at true center
  geom.computeBoundingBox();
  geom.center();

  return geom;
}

export function computeGeometryMetrics(
  geometry: TextGeometry,
): GeometryMetrics {
  const box = geometry.boundingBox;
  if (!box) {
    geometry.computeBoundingBox();
  }

  const bb = geometry.boundingBox!;
  const width = bb.max.x - bb.min.x;
  const height = bb.max.y - bb.min.y;

  return {
    width,
    height,
    centerX: width / 2,
    centerY: height / 2,
    hitboxWidth: width * 1.25,
    hitboxHeight: height * 1.6,
  };
}
