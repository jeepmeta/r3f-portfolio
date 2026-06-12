// app/systems/voxels/voxelUtils.ts
import * as THREE from "three";
import { GRID, CUBE, HALF } from "./voxelConstants";

export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function generateVoxelPositions(): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      positions.push(new THREE.Vector3(x * CUBE - HALF, -y * CUBE + HALF, 0));
    }
  }
  return positions;
}
