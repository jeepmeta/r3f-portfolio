// @/components/CodeOrbit.tsx
export function CodeOrbit() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="cyan" wireframe />
      </mesh>
      <pointLight position={[5, 5, 5]} color="cyan" intensity={2} />
    </group>
  );
}
