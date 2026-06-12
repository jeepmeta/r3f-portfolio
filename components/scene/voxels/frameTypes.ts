// app/systems/voxels/frameTypes.ts

export type PixelRGBA = [number, number, number, number];
export type VoxelFrame = (PixelRGBA | null)[][];
export type VoxelAnimation = VoxelFrame[];
