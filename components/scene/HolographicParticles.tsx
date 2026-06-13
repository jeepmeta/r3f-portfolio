"use client";

import { memo, useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==================== SHADERS ====================
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

// ==================== HELPERS ====================
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface Particle {
  t: number;
  speed: number;
  posX: number;
  posY: number;
  posZ: number;
  vx: number;
  vy: number;
  vz: number;
  turnTimer: number;
  phaseOffset: number;
}

export const HolographicParticles = memo(function HolographicParticles({
  count = 50,
}: {
  count?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#00ffff") },
      uMaxDistance: { value: 45.0 },
    }),
    []
  );

  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles
  useEffect(() => {
    const temp: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const spawnSeed = i * 7.3;
      temp.push({
        t: seededRandom(i * 1.1) * 100,
        speed: 0.008 + seededRandom(i * 1.3) / 180,
        posX: -70 + seededRandom(spawnSeed) * 140,
        posY: -50 + seededRandom(spawnSeed + 1) * 100,
        posZ: -70 + seededRandom(spawnSeed + 2) * 140,
        vx: (seededRandom(spawnSeed + 3) - 0.5) * 0.35,
        vy: (seededRandom(spawnSeed + 4) - 0.5) * 0.35,
        vz: (seededRandom(spawnSeed + 5) - 0.5) * 0.35,
        turnTimer: 8 + seededRandom(spawnSeed + 6) * 30,
        phaseOffset: seededRandom(i * 9.1) * Math.PI * 2,
      });
    }
    particlesRef.current = temp;
  }, [count]);

  const geometry = useMemo(() => new THREE.OctahedronGeometry(0.18, 0), []);

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
    [uniforms]
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.t += p.speed;

      // Simplified movement
      const phase = p.t + p.phaseOffset;
      const moveSpeed = p.speed * (22 + Math.sin(phase * 1.7) * 6);

      p.posX += p.vx * moveSpeed;
      p.posY += p.vy * moveSpeed;
      p.posZ += p.vz * moveSpeed;

      // Turning logic (reduced frequency)
      p.turnTimer -= p.speed * 2.5;

      if (p.turnTimer <= 0) {
        const seed = Math.floor(p.t * 0.6) + i * 17;

        const r1 = seededRandom(seed) - 0.5;
        const r2 = seededRandom(seed + 1) - 0.5;
        const r3 = seededRandom(seed + 2) - 0.5;

        p.vx += r1 * 0.6;
        p.vy += r2 * 0.6;
        p.vz += r3 * 0.6;

        const len = Math.hypot(p.vx, p.vy, p.vz) || 1;
        const norm = 0.35 / len;
        p.vx *= norm;
        p.vy *= norm;
        p.vz *= norm;

        p.turnTimer = 12 + seededRandom(seed + 5) * 28;
      }

      // Respawn
      const dist = Math.hypot(p.posX, p.posY, p.posZ);
      if (dist > 52) {
        const seed = i * 23 + Math.floor(p.t * 0.4);
        const angle = seededRandom(seed) * Math.PI * 2;
        const side = seededRandom(seed + 1) > 0.5 ? 1 : -1;
        const spawnDist = 36 + seededRandom(seed + 2) * 9;

        p.posX = Math.cos(angle) * spawnDist * side;
        p.posY = -38 + seededRandom(seed + 3) * 76;
        p.posZ = Math.sin(angle) * spawnDist * side;

        p.vx = -p.posX * 0.005 + (seededRandom(seed + 5) - 0.5) * 0.25;
        p.vy = -p.posY * 0.005 + (seededRandom(seed + 6) - 0.5) * 0.25;
        p.vz = -p.posZ * 0.005 + (seededRandom(seed + 7) - 0.5) * 0.25;

        p.turnTimer = 10 + seededRandom(seed + 9) * 22;
      }

      // Position + Scale + Rotation
      const wobble = Math.sin(phase * 3.8) * 0.9;

      dummy.position.set(
        p.posX + Math.sin(phase * 1.6) * 0.7,
        p.posY + Math.cos(phase * 1.9) * 0.7,
        p.posZ + wobble
      );

      const s = 0.65 + Math.sin(phase * 2.1) * 0.35;
      dummy.scale.setScalar(s);
      dummy.rotation.set(s * 3.5, s * 5.5, s * 2.8);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
});