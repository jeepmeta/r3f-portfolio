"use client";

import { memo, useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom shader material for distance-based fading
const holographicVertexShader = `
  varying float vDistance;
  varying vec3 vPosition;
  
  void main() {
    vPosition = position;
    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
    vDistance = length(worldPosition.xyz);
    
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
  }
`;

const holographicFragmentShader = `
  uniform vec3 uColor;
  uniform float uMaxDistance;
  
  varying float vDistance;
  varying vec3 vPosition;
  
  void main() {
    float fadeFactor = 1.0 - smoothstep(0.0, uMaxDistance, vDistance);
    fadeFactor = pow(fadeFactor, 1.7);
    
    float edge = 1.0 - abs(dot(normalize(vPosition), vec3(0.0, 1.0, 0.0)));
    float glow = 1.0 + edge * 0.3;
    
    gl_FragColor = vec4(uColor * glow, fadeFactor * 1.7);
  }
`;

// Optimized seeded random - uses a simpler hash
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const HolographicParticles = memo(function HolographicParticles({
  count = 600,
}: {
  count?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Reuse single Object3D for all particle updates
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#00ffff") },
      uMaxDistance: { value: 45.0 },
    }),
    [],
  );

  // Use useRef for particle state to allow mutation in useFrame
  const particlesRef = useRef<
    {
      t: number;
      factor: number;
      speed: number;
      posX: number;
      posY: number;
      posZ: number;
      vx: number;
      vy: number;
      vz: number;
      turnTimer: number;
    }[]
  >([]);

  // Initialize particles once using useEffect (runs once after mount)
  useEffect(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const spawnSeed = i * 7.3;
      const t = seededRandom(i * 1.1) * 100;
      const speed = 0.008 + seededRandom(i * 1.3) / 180;
      temp.push({
        t,
        factor: 20 + seededRandom(i * 1.2) * 120,
        speed,
        posX: -70 + seededRandom(spawnSeed) * 140,
        posY: -50 + seededRandom(spawnSeed + 1) * 100,
        posZ: -70 + seededRandom(spawnSeed + 2) * 140,
        vx: (seededRandom(spawnSeed + 3) - 0.5) * 0.35,
        vy: (seededRandom(spawnSeed + 4) - 0.5) * 0.35,
        vz: (seededRandom(spawnSeed + 5) - 0.5) * 0.35,
        turnTimer: 5 + seededRandom(spawnSeed + 6) * 25,
      });
    }
    particlesRef.current = temp;
  }, [count]);

  // Cache geometry - only create once
  const geometry = useMemo(() => new THREE.OctahedronGeometry(0.18, 0), []);

  // Create shader material
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: holographicVertexShader,
        fragmentShader: holographicFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );

  useFrame(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.t += p.speed;
      const t2 = p.t * 2.3 + i * 0.7;
      const sinT2 = Math.sin(t2);
      const currentSpeed = p.speed * (0.7 + sinT2 * 0.6);

      p.turnTimer -= currentSpeed * 3;

      if (p.turnTimer <= 0) {
        const turnSeed = Math.floor(p.t * 0.1) + i * 11;
        const rand1 = seededRandom(turnSeed) - 0.5;
        const rand2 = seededRandom(turnSeed + 1) - 0.5;
        const rand3 = seededRandom(turnSeed + 2) - 0.5;

        p.vx += rand1 * 0.75;
        p.vy += rand2 * 0.75;
        p.vz += rand3 * 0.75;

        const len = Math.hypot(p.vx, p.vy, p.vz) || 1;
        const normalized = 0.32 / len;
        p.vx *= normalized;
        p.vy *= normalized;
        p.vz *= normalized;

        p.turnTimer = 6 + seededRandom(i * 13 + Math.floor(p.t)) * 22;
      }

      const moveSpeed = currentSpeed * 28;
      p.posX += p.vx * moveSpeed;
      p.posY += p.vy * moveSpeed;
      p.posZ += p.vz * moveSpeed;

      const dist = Math.hypot(p.posX, p.posY, p.posZ);
      if (dist > 50) {
        const respawnSeed = i * 19 + Math.floor(p.t / 30);
        const spawnDist = 35 + seededRandom(respawnSeed) * 10;
        const angle = seededRandom(respawnSeed + 1) * Math.PI * 2;
        const side = seededRandom(respawnSeed + 2) > 0.5 ? 1 : -1;

        p.posX = Math.cos(angle) * spawnDist * side;
        p.posY = -40 + seededRandom(respawnSeed + 3) * 80;
        p.posZ = Math.sin(angle) * spawnDist * side;

        const r5 = seededRandom(respawnSeed + 5) - 0.5;
        const r6 = seededRandom(respawnSeed + 6) - 0.5;
        const r7 = seededRandom(respawnSeed + 7) - 0.5;

        p.vx = -p.posX * 0.006 + r5 * 0.28;
        p.vy = -p.posY * 0.006 + r6 * 0.28;
        p.vz = -p.posZ * 0.006 + r7 * 0.28;
        p.turnTimer = 8 + seededRandom(respawnSeed + 8) * 18;
      }

      const t18 = p.t * 1.8 + i;
      const t21 = p.t * 2.1 + i;
      const wobble = Math.sin(p.t * 4.2 + i * 1.3) * 1.1;

      dummy.position.set(
        p.posX + Math.sin(t18) * 0.9,
        p.posY + Math.cos(t21) * 0.9,
        p.posZ + wobble,
      );

      const s = Math.cos(p.t * 0.8 + i * 0.4) * 0.5 + 0.8;
      dummy.scale.setScalar(s);
      dummy.rotation.set(s * 4, s * 6, s * 3);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
    ></instancedMesh>
  );
});
