"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useState } from "react";

export default function Page() {
  const [mode, setMode] = useState<"none" | "minimal" | "full">("none");

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Lighting Mode Switcher */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "0.75rem",
          background: "rgba(0,0,0,0.4)",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 10,
          backdropFilter: "blur(6px)",
        }}
      >
        {[
          { label: "No Lighting", value: "none" },
          { label: "Minimal", value: "minimal" },
          { label: "Full", value: "full" },
        ].map(({ label, value }) => {
          const active = mode === value;
          return (
            <button
              key={value}
              onClick={() => setMode(value as typeof mode)}
              style={{
                width: "140px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: active
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.3)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 0.75rem",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {label}
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: active ? "#36b8d0" : "rgba(255,255,255,0.2)",
                  boxShadow: active ? "0 0 6px #36b8d0" : "none",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Canvas */}
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        {/* Orbit Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          panSpeed={0.6}
        />

        {/* Lighting Modes */}
        {mode === "minimal" && (
          <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[3, 3, 3]} intensity={0.6} />
          </>
        )}

        {mode === "full" && (
          <>
            <Environment preset="studio" />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          </>
        )}

        {/* Grid Floor */}
        <gridHelper args={[10, 20, "#444", "#222"]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#111" />
        </mesh>

      </Canvas>
    </div>
  );
}
