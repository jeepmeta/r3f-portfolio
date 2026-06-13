# 🚀 R3F Portfolio — Jeepmeta

**A holographic, sci-fi, crypto-flavored 3D experience** built with React Three Fiber.  
This project serves as a **personal portfolio** and a **living product** — showcasing advanced 3D UI, shader work, interactive elements, and animation.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)  
[![React Three Fiber](https://img.shields.io/badge/R3F-React%20Three%20Fiber-00bfff?style=for-the-badge)](https://docs.pmnd.rs/react-three-fiber)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## ✨ Overview

Jeepmeta’s R3F Portfolio is a next-generation 3D web experience that fuses:

- **Holographic sci-fi HUD aesthetics** — glowing spherical interfaces, custom shaders, and post-processing effects
- **Playful crypto culture** — DOGE / “Do Only Good Everyday” ethos, interactive visualizations
- **Pixel-art nostalgia** — voxel-style DogCubes and retro-inspired 3D elements

It demonstrates deep expertise in **React Three Fiber**, custom Three.js materials, performant animations, and production-grade architecture (strict TypeScript, modular components, Zustand state, responsive design).

---

## 🌌 Key Features

- **Voxel Pixel-Art Dogs (DogCubes)**  
  3D voxel-style representations powered by `dog_pixels.json` data. Ties directly into the Doginal Dogs / DOGE cultural layer with nostalgic pixel charm.

- **Text Geometry Navigation**  
  3D text-based nav items using custom `useTextGeometry` hook for crisp, performant typography in the 3D scene.

- **Dynamic Scene Composition**  
  `Scene.tsx` orchestrates lighting, `HolographicParticles`, `CameraController`, and layered 3D content with device-aware responsiveness (`useDevice`, `useMobile`).

- **State-Driven Experience**  
  Zustand stores (`useSection`, `useOverlay`, `useCryptoSphere`) power seamless section transitions, modal overlays, and synchronized UI/3D state.

- **Production Polish**  
  - Next.js 16 App Router + React 19  
  - Pure custom holographic/neon CSS  
  - Post-processing effects via `@react-three/postprocessing`  
  - Asset pipeline (SVG → canvas textures, extraction scripts)  
  - Strict TypeScript throughout

---

## 🛠 Tech Stack

| Category          | Technologies |
|-------------------|--------------|
| Framework         | Next.js 16 (App Router) |
| Language          | TypeScript 5 (strict mode) |
| 3D Rendering      | React Three Fiber, Three.js, @react-three/drei, @react-three/postprocessing |
| Animation         | @react-spring/three, GSAP, @gsap/react |
| State Management  | Zustand |
| Styling           | Pure CSS |
| Architecture      | Modular components, custom hooks & materials, typed stores |
| Assets            | Canvas-generated textures, JSON voxel data (`dog_pixels.json`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
git clone https://github.com/jeepmeta/r3f-portfolio.git
cd r3f-portfolio
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — the experience runs fully client-side with live 3D interactions.

### Build & Deploy

```bash
pnpm build
pnpm start
```

Deploy easily to Vercel (recommended) or any platform supporting Next.js.

---

## 🎨 Design Philosophy & Brand

- **Aesthetic**: Holographic sci-fi HUD meets playful crypto meme culture and pixel-art warmth.
- **Color Palette**: Deep space blacks, electric cyans/teals, vibrant DOGE yellow accents, soft neon glows.
- **React Spring**: Smooth, intentional camera work + spring physics + GSAP timelines for premium feel.
- **Tone**: Technically sharp yet friendly and approachable — “vibe coding” meets production craft.

The project embodies the **DOGE / Do Only Good Everyday** spirit while pushing the boundaries of what a modern creator portfolio can be in 2026.

---

## 🔗 Links & Ecosystem

- **Main Portfolio**: [jeepmeta.xyz](https://jeepmeta.xyz)
- **X / Twitter**: [@JeepMeta](https://x.com/JeepMeta) — Spaces co-host & builder
- **LinkedIn**: [jeepmeta](https://www.linkedin.com/in/jeepmeta)
- **Writing**: Articles on AI visibility & content strategy on [Paragraph](https://paragraph.com/@jeepmeta)
- **Sharing**: Find components, code, and more on [CodePen](https://codepen.io/jeepmeta)
- **789 Studios**: [789studios.com](https://789studios.com)
- **OTF Media**: [otfmedia.xyz](https://otfmedia.xyz)

---

## 🛠 Development Notes

- **Performance First**: Heavy use of `drei` helpers, memoization, and device detection for smooth 60fps even on mid-range hardware.
- **Extensibility**: The holograms and modules are designed to be reusable across other projects.
- **Asset Workflow**: Custom scripts convert SVGs and pixel data into Three.js-ready textures.
- **Type Safety**: Strict TypeScript + well-typed Zustand stores and custom hooks.

---

## 📜 License

This project is currently **source-available for reference and inspiration**.  
For commercial licensing of components, the Spherical Hologram Engine, or custom development work, please reach out via X (@JeepMeta) or the contact channels on jeepmeta.xyz.

---

## 🙏 Credits & Inspiration

Built with love for the **DOGE community**, the power of **React Three Fiber**, and the joy of shipping beautiful, interactive 3D web experiences.

Special thanks to the maintainers of Three.js, R3F, drei, react-spring, GSAP, and the broader open-source 3D web community.

---

**Jeepmeta** 🐕✨🌌

> “Do Only Good Everyday”

---

*Last updated: June 2026*  
*Repository: github.com/jeepmeta/r3f-portfolio*