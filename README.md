================================================================================ Jeepmeta — Holographic 3D Portfolio & Creator Platform

Project Purpose and Vision

Jeepmeta is a holographic, sci‑fi, crypto‑flavored 3D experience built as both a portfolio and a product. It showcases the creator’s skills in animation, 3D UI, shader design, and interactive storytelling while also serving as a monetization engine for services, components, and collaborations.

Aesthetic Blend

Holographic sci‑fi HUDs

Playful crypto culture

Pixel‑art nostalgia

DOGE / Do Only Good Everyday ethos

Jeepmeta as a creator brand: The app is a single‑page, state‑driven R3F experience where each section is a scene, each scene is a hologram, and every hologram is a brand moment.

Tech Stack and TypeScript Rules

Core Stack

Next.js 16 (App Router)

React 19

TypeScript 5 (strict mode)

Three.js

@react-three/fiber

@react-three/drei

@react-three/postprocessing

@react-spring/three + @react-spring/core

GSAP + @gsap/react

Zustand

Tailwind 4

canvas (SVG → texture)

TypeScript Rules

strict: true enforced globally

No implicit any

All configuration objects must have dedicated interfaces

Shared types live under types/ or components/holograms/types/

Geometry, layout, materials, and interactions must not mix concerns

Hooks return typed objects, never loose bags of data

File Tree Reference

. |-- README.md |-- PROJECT_PAGE.md |-- app |   |-- globals.css |   |-- layout.tsx |   -- page.tsx |-- components |   |-- Icons.tsx |   |-- boot |   |   |-- MatrixRain.tsx |   |   -- TerminalBoot.tsx |   |-- code |   |   -- CodeOrbit.tsx |   |-- componentsUI |   |   -- ComponentsPanels.tsx |   |-- connect |   |   |-- SocialIconsOrbit.tsx |   |   -- socialConfig.ts |   |-- crypto |   |   |-- CryptoSphere.tsx |   |   |-- CryptoTicker.tsx |   |   -- ExpandedChartOverlay.tsx |   |-- holograms |   |   |-- HologramSphere.tsx |   |   |-- materials |   |   |   |-- HologramGlyphMaterial.ts |   |   |   |-- HologramSVGPanelMaterial.ts |   |   |   |-- HologramScanlineMaterial.ts |   |   |   -- HologramSphereMaterial.ts |   |   |-- SphericalAnchor.tsx |   |   |-- SphericalPatch.tsx |   |   |-- SphericalSurface.tsx |   |   |-- hooks |   |   |   |-- useSphericalCoords.ts |   |   |   |-- useSphericalLayout.ts |   |   |   |-- useSphericalMaterial.ts |   |   |   |-- useSphericalInteraction.ts |   |   |   -- useSphericalAnimation.ts |   |   -- types |   |       |-- spherical-types.ts |   |       -- spherical-material-types.ts |   |-- scene |   |   |-- CameraController.tsx |   |   |-- HolographicParticles.tsx |   |   |-- Scene.tsx |   |   |-- effects.tsx |   |   |-- environment.tsx |   |   |-- lighting.tsx |   |   -- voxels |   |       |-- DogCubes.tsx |   |       |-- frameTypes.ts |   |       |-- voxelConstants.ts |   |       -- voxelUtils.ts |   -- textGeometry |       |-- NavItem.tsx |       |-- NavText.tsx |       |-- navConfig.ts |       |-- useNavItemAnimation.ts |       -- useTextGeometry.ts |-- data |   -- dog_pixels.json |-- hooks |   |-- useDevice.ts |   -- useMobile.ts |-- lib |   -- cryptoApi.ts |-- stores |   |-- useCryptoSphere.ts |   |-- useOverlay.ts |   -- useSection.ts |-- types |   |-- hologram-types.d.ts |   -- index.d.ts |-- public |   -- jeep.png |-- scripts |   -- extract-dog.js |-- tsconfig.json -- package.json

Brand Identity and Visual Language

Color Palette

#36b8d0 — primary hologram glow

#5f2c2b — grounding shadows and frames

#ffeec2 — readable text, soft glows

#d3bb8f — premium accents, crypto highlights

Aesthetic Pillars

Holographic sci‑fi HUD

Playful crypto character

Pixel‑art nostalgia

DOGE / Do Only Good Everyday

Jeepmeta as a creator brand

Motion Style

Holograms “power on”

Smooth, elastic, playful

Responsive to interaction

Never rigid or militaristic

High-Level Architecture

Layers

Rendering: R3F, Drei, Three.js, postprocessing

Hologram: spherical engine, hologram materials, SVG panels

UI: text geometry, nav, overlays, panels

State: Zustand stores

Device: breakpoints, mobile/desktop scaling

Animation: react-three-spring, GSAP

Data: crypto API, configs, JSON assets

Scene Model

Single <Scene> orchestrates camera, lighting, environment, particles, and active section.

Sections mount/unmount based on Zustand state.

Spherical Engine Subsystem

Purpose

A reusable, strictly typed engine powering:

Curved hologram panels

Crypto chart patches

Star-map constellations

Nested spheres

Inner/outer projections

Invisible anchors

Components

SphericalAnchor — radius, rotation, visibility, animation, nesting

SphericalPatch — curved segments, floating panels

SphericalSurface — declarative composition

Hooks:

useSphericalCoords — lat/lon → Cartesian

useSphericalLayout — rows, grids, breakpoints

useSphericalMaterial — SVG → texture, hologram presets

useSphericalInteraction — click/tap/hover/gesture

useSphericalAnimation — hologram entrance/exit

Types — strict TS interfaces

Rules

No duplicated spherical math

Geometry/layout/materials/interactions/animation stay separate

Modes defined locally

Pre-rendered SVG textures

Nested spheres supported

Animation and Interaction Conventions

Entrance/Exit

Scale from 0 → radius

Emissive pulse

Optional scanline flicker

Shared timing curves

Interaction

Desktop: hover glow, click expands

Mobile: larger hit-areas, tap replaces hover

Consistent across all spheres

Device-Aware Behavior

Breakpoints

Defined in Tailwind + globals.css.

Behavior

Sphere radius scales down on mobile

Patch spacing adjusts

Hit-areas increase

Animation timing slows slightly

Monetization and Jeepmeta Brand Integration

Goals

Make Jeepmeta hireable

Showcase reusable components

Offer downloadable/purchasable assets

Monetization Surfaces

Jeepmeta Hub scene

Component marketplace

Floating CTA orb

Commission portal

Brand Tone

Friendly, playful, technically sharp.

Coding Conventions

Components

Pure, declarative

No mixing geometry/layout/materials

Domain components compose engine pieces

Hooks

Named useX

Typed returns

No side effects beyond React lifecycle

Types

Centralized

No implicit any

Config objects must have interfaces

Files

Avoid micro-files

Keep concerns separate

Spherical engine stays in components/holograms

Future Expansion

New sphere modes

New hologram materials

New downloadable components

Expanded Jeepmeta Hub

Optional NFT/collectible layer