# Roadmap — Implemented vs Experimental vs Future

## ✅ Implemented (v9.4)

### OS Shell
- [x] Draggable, resizable, z-index stacking windows (WindowFrame)
- [x] TopStatusBar with live telemetry, wallpaper mode selector, workspace presets
- [x] DockBar with window toggles, eureka trigger
- [x] WallpaperCanvas with 5 modes (neural, matrixRain, cyberGrid, topological, deepVoid)
- [x] OmniSearchModal (Cmd+K) — search nodes, notes, palettes, commands

### Views
- [x] NeuralGraphView — 84 nodes, 9 categories, force-ish layout, add node modal, stats overlay
- [x] VaultNotesView — Markdown notes, backlinks, density, pin/favorite, edit/preview, export
- [x] IdeaSynthesizerView — 1-4 node collider, temperature slider, presets, confetti, copy sections
- [x] RealityDistortionView — Jargon alchemizer with dictionary + fallback generator
- [x] HexChromaticLab — Palettes with psychographic roles, contrast scores
- [x] ChronotopeTimelineView — Campaign milestones, phases, KPIs, status
- [x] TerminalView — synapse-cli with help, stats, eureka, quote, binaural, scan-noosphere, matrix, clear

### Services
- [x] audioEngine — WebAudio, binaural 6Hz@216Hz, synaptic clicks, node blips, eureka chord, mute, dispose
- [x] synthesisEngine — Concept collider + jargon alchemizer, temperature, validation

### Data
- [x] 84 graph nodes with category colors, connections, quotes, application vectors
- [x] Vault notes with cognitive density, backlinks, relatedNodeId
- [x] Chromatic palettes
- [x] Campaign milestones
- [x] Oracle quotes

### Engineering
- [x] Vite + React 19 + TypeScript strict + Tailwind v4
- [x] Path aliases (@, @components, etc.)
- [x] Centralized config (src/lib/config.ts) + constants
- [x] Hooks extraction (useWindowManager, useLocalStorage, useKeydown)
- [x] UI primitives (Button, Badge, Panel)
- [x] ESLint + Prettier + EditorConfig
- [x] Vitest + jsdom + mocks for canvas/audio/confetti
- [x] 23 tests covering synthesis, audio, types, constants
- [x] CI workflow (typecheck, lint, test, build, artifact upload)
- [x] Professional README, docs/, LICENSE, CONTRIBUTING

## 🧪 Experimental / Partial

- [ ] Force simulation in NeuralGraphView is simplified (no d3-force, just initial x,y + manual)
- [ ] 3D mode toggle in NeuralGraphView (state exists but not implemented)
- [ ] VaultNotesView category filter (setSelectedCategory unused)
- [ ] AudioLab and Settings windows registered but no view components
- [ ] Oracle window registered but no view
- [ ] WallpaperCanvas mouse parallax could be throttled for perf
- [ ] SynthesisEngine uses Math.random() — not seedable, not shareable via URL

## 🔮 Future Ideas

### Product
- [ ] Persist window layout + wallpaper mode to localStorage
- [ ] Real fuzzy search with fuse.js in OmniSearchModal
- [ ] Export synthesis result to PDF / Notion / Markdown
- [ ] Shareable synthesis URL with seed (deterministic RNG)
- [ ] Plugin system for new views (dynamic import)
- [ ] Command palette actions: "Create note from synthesis", "Add node from note"
- [ ] Vault graph view (Obsidian-style backlink visualization)

### Engineering
- [ ] Web Worker for force simulation
- [ ] WebGL shader wallpaper mode (fragment shaders)
- [ ] AnalyserNode visualization for audioEngine
- [ ] E2E tests with Playwright (window drag, search, synthesis)
- [ ] Storybook for UI primitives
- [ ] Bundle analyzer + code-splitting per view (React.lazy)
- [ ] PWA support (offline, installable)
- [ ] i18n for esoteric terms (maybe not — intentional English density)

### Creative
- [ ] More wallpaper modes: audioReactive, fluid simulation, L-system
- [ ] More synthesis presets: "Deleuzian Growth", "Mycelial Luxury"
- [ ] Generative cover art for each synthesis result (canvas)
- [ ] Voice synthesis for oracle quotes (Web Speech API)
- [ ] Collaborative multiplayer cursors (yjs)

### Research
- [ ] Add 20 more nodes: e.g., "Bataillean Excess", "Stieglerian Pharmacology", "Haraway Cyborg"
- [ ] Add citation graph (which nodes cite which)
- [ ] Add reading list per node

## How to Propose Ideas

Open an issue with label `idea` or `future`. Include:

- Intent (product, engineering, creative, research)
- References (papers, artworks, prior art)
- Sketch or pseudocode if applicable
- Whether you'd like to implement it

We prioritize ideas that **reveal and strengthen sophistication already present**, not jargon for its own sake.
