🚀 Jeepmeta R3F Component Marketplace — Master Prompt
A unified standard for building Jeepmeta‑branded, strict‑TypeScript, hologram‑style R3F components.

🎯 Purpose
The Jeepmeta Marketplace provides a curated ecosystem of standalone, strict‑TypeScript React Three Fiber components designed for:

Portfolio websites

Sci‑fi dashboards

Hologram UI

Interactive 3D widgets

Creative coding

Vibe‑driven experimentation

Every component must be:

Fully 3D

Usable inside a <Canvas>

Strict TypeScript compliant

Single‑file

Globally themeable

Beginner‑friendly

Professional‑grade

Built on a predictable dependency baseline

The marketplace offers hologram‑style UI elements, sci‑fi panels, rings, icons, glyphs, and interactive 3D components.

💡 Why We Are Doing This
To build a Jeepmeta‑branded ecosystem of hologram‑style 3D components.

To give beginners a friendly, tweakable way to customize 3D UI.

To give advanced developers strict, production‑ready TypeScript components.

To avoid AI’s typical 3D hallucinations by building everything slowly, explicitly, intentionally.

To create a marketplace where every component is drop‑in ready, predictable, and modular.

📦 Required Dependencies (New Philosophy)
Instead of avoiding dependencies, Jeepmeta components now require a modern, unified 3D stack.
This ensures:

Predictable behavior

Zero version mismatch issues

Stable loaders

Stable postprocessing

Consistent animation

Smaller component files

Cleaner architecture

Required
bash
three@^0.183.0
@react-three/fiber@^9.5.0
@react-three/drei@^10.7.0
@react-spring/core@^10.0.0
@react-spring/three@^10.0.0
postprocessing@^6.38.0
@react-three/postprocessing@^3.0.0
Optional but Recommended
bash
zustand@^5.0.0
gsap@^3.14.0
motion@^12.35.0
These dependencies are not “bloat” — they are value:

They reduce file size

They eliminate boilerplate

They prevent user confusion

They ensure every component works identically for every user

They allow Jeepmeta to deliver premium‑grade hologram effects

🚨 Non‑Negotiable Rules (Strict TypeScript)
1. Strict TypeScript ALWAYS
Every component must compile under the strictest TS settings:

jsonc
{
  "strict": true,
  "noImplicitAny": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "useUnknownInCatchVariables": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
Absolutely forbidden:
any

Implicit undefined

Untyped refs

Untyped geometry attributes

Untyped animation values

Untyped Drei helpers

Untyped GLTF results

Loose unions

Implicit children types

Untyped event handlers

Everything must be explicit, predictable, strongly typed.

📄 2. Single‑File Components
Every component must be one .tsx file containing:

Imports

CONFIG block

Strict TS prop types

Component implementation

Export

No external files.
No asset folders.
No multi‑file structures.

🧊 3. Everything Must Be 3D
No DOM.
No <Html>.
No CSS‑in‑Canvas hacks.
No mixing DOM + WebGL.

All icons, panels, rings, and UI elements must be true 3D geometry.

📚 4. Required Dependencies (Updated Rule)
Instead of “no dependencies,” Jeepmeta now requires a modern, stable, unified stack.

This ensures:

Predictable behavior

Stable loaders

Stable postprocessing

Consistent animation

Smaller component files

Cleaner architecture

Dependencies are now a feature, not a burden.

🎨 5. Global Theming via CSS Variables
Users paste this into globals.css:

css
:root {
  --jm-primary: #36b8d0;
  --jm-secondary: #d3bb8f;
  --jm-glow-intensity: 1.5;
  --jm-opacity: 1;
  --jm-scanline-speed: 2s;
  --jm-scanline-opacity: 0.15;
  --jm-pulse-speed: 3s;
  --jm-pulse-intensity: 0.4;
}
Components reference variables directly:

ts
color: 'var(--jm-primary)'
Benefits:

Instant global theming

Smaller component files

Strong Jeepmeta branding

Beginner‑friendly customization

⚙️ 6. Component‑Specific CONFIG Block
Each component includes:

ts
const CONFIG = {
  color: 'var(--jm-primary)',
  emissiveIntensity: 1.5,
  opacity: 1,
  // component‑specific values...
} as const;
Users should only need to edit this block.

✒️ 7. SVGs Become 3D Geometry
We use SVGLoader from Three.js to convert SVG paths into:

Flat hologram glyphs

Thin extruded icons

Fully 3D shapes

This keeps components:

Lightweight

Themeable

Hologram‑friendly

🧭 8. No Scene Assumptions
Components must NOT include:

<Canvas>

<Suspense>

<OrbitControls>

<Environment>

Cameras

Lights

Global state

Users handle all scene setup.

📐 9. Explicit Transforms
No magic numbers.
No hidden rotations.
No implicit scaling.

Everything must be intentional and documented.

🧑‍🎨 10. Beginner‑Friendly Customization
Users should be able to:

Open the file

Change values in the CONFIG block

Close the file

No digging through internals.

🧱 11. Professional‑Grade Architecture
Even though vibe coders will use these components, the code must be:

Clean

Predictable

Modular

Explicit

Maintainable

📦 Usage Instructions for Every Component
1. Add Jeepmeta theme variables to globals.css
Paste the CSS block and adjust colors/timings to match your brand.

2. Drop the component file into your project
Each component is a single strict‑TS file with a CONFIG block.

3. Use the component inside your <Canvas>
tsx
<MyComponent
  position={[0, 1.2, -2]}
  scale={1.5}
/>