// app/systems/voxels/voxelConstants.ts

// Grid resolution
export const GRID = 30;

// Cube size
export const CUBE = 0.1;

// Half-width for centering the voxel grid
export const HALF = ((GRID - 1) * CUBE) / 2;

// Fur reference pixel (used for eyebrow blink color)
export const FUR_REF: [number, number] = [8, 20];

// Eyebrow pixel coordinates
export const EYEBROW_SET = new Set<string>(["8,19", "9,19", "9,20"]);
