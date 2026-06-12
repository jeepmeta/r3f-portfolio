"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // NEW: Delay before rain starts
    let start = false;
    const delay = 2300; // ms
    setTimeout(() => {
      start = true;
    }, delay);

    const chars = "アカサタナハマヤラワπΨϘͽϕϟ01*";

    const minFont = 6;
    const maxFont = 16;
    const columns = Math.floor(window.innerWidth / minFont);

    const drops = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * -50),
    );

    const fontSizes = Array.from(
      { length: columns },
      () => Math.floor(Math.random() * (maxFont - minFont)) + minFont,
    );

    const speeds = fontSizes.map((size) => size * 0.09);
    const brightness = fontSizes.map((size) => size / maxFont);

    let wipeY = -800;
    const wipeSpeed = 6.8;
    const wipeFadeHeight = 500;

    let running = true;
    let initialized = false;

    function draw() {
      if (!running || !start) {
        requestAnimationFrame(draw);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      if (!initialized) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        initialized = true;
      }

      // ❗ NEW: Clear everything above the wipe every frame
      if (wipeY > 0) {
        ctx.clearRect(0, 0, w, wipeY);
      }

      // Fade layer only below wipe
      const fadeStart = Math.max(0, wipeY);
      if (fadeStart < h) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, fadeStart, w, h - fadeStart);
      }

      // Draw Matrix rain
      for (let i = 0; i < columns; i++) {
        const size = fontSizes[i];
        const bright = brightness[i];
        const speed = speeds[i];

        const x = i * minFont;
        const y = drops[i] * size;

        // ❗ Do not draw OR update above wipe
        if (y < wipeY) continue;

        const char = chars[Math.floor(Math.random() * chars.length)];
        const baseAlpha = Math.min(1, bright * 1.4);

        ctx.font = `${size}px monospace`;

        for (let k = 0; k < 4; k++) {
          const a = baseAlpha * (0.8 + k * 1.2);
          ctx.fillStyle = `rgba(0,238,255,${a})`;
          ctx.fillText(char, x, y);
        }

        if (y > h && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -50);
        }

        drops[i] += speed;
      }

      // Transparency fade wipe
      if (wipeY < h + wipeFadeHeight) {
        const fadeStart = wipeY;
        const fadeEnd = wipeY + wipeFadeHeight;

        ctx.globalCompositeOperation = "destination-out";

        const gradient = ctx.createLinearGradient(0, fadeStart, 0, fadeEnd);
        for (let i = 0; i <= 20; i++) {
          const t = i / 20; // 0 → 1
          const curve = Math.pow(t, 2.2); // exponential ease-out
          const alpha = 1 - curve; // invert so top is soft, bottom strong
          gradient.addColorStop(t, `rgba(0,0,0,${alpha})`);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, fadeStart, w, wipeFadeHeight);

        ctx.globalCompositeOperation = "source-over";

        wipeY += wipeSpeed;
      } else {
        running = false;

        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";

        return;
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        zIndex: 9999,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
}
