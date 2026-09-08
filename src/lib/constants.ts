import type { WindowId, WallpaperMode, WorkspacePreset } from '../types';

export const WINDOW_TITLES: Record<WindowId, { title: string; subtitle?: string; badge?: string }> = {
  graph: { title: 'Neural Graph // Obsidian Multi-Vault', subtitle: '80+ Synaptic Concepts', badge: 'LIVE SYNAPSE' },
  vault: { title: 'Notes Vault // Epistemic Archives', subtitle: 'Markdown & Backlinks' },
  synthesizer: { title: 'Idea Collider // Polymath Synthesis Reactor', subtitle: 'Ontological Combinatorics', badge: 'REACTOR READY' },
  distortion: { title: 'Reality Distortion Field & LARP Simulator', subtitle: 'Steve Jobs Prescience Matrix' },
  chromatic: { title: 'Hex Chromatic Lab // Retinal Dominance', subtitle: 'OLED Wavelengths' },
  chronotope: { title: 'The Chronotope // Hyperstition Campaign Matrix', subtitle: 'Dimensional Velocity' },
  terminal: { title: 'synapse-cli // Noosphere Terminal Shell', subtitle: 'x86_64-noosphere' },
  oracle: { title: 'Polymath Oracle' },
  audioLab: { title: 'Audio Synthesizer Lab' },
  settings: { title: 'OS Settings' },
};

export const WALLPAPER_MODES: { id: WallpaperMode; label: string; description: string }[] = [
  { id: 'neural', label: 'Neural Lattice', description: 'Synaptic node field with emergent connections' },
  { id: 'matrixRain', label: 'Matrix Rain', description: 'Phosphor green cascading glyphs' },
  { id: 'cyberGrid', label: 'Cyber Grid', description: 'Isometric perspective grid with parallax' },
  { id: 'topological', label: 'Topological', description: 'Morphing iso-contours & strange attractors' },
  { id: 'deepVoid', label: 'Deep Void', description: 'Minimal stardust & void meditation' },
];

export const WORKSPACE_PRESETS: { id: WorkspacePreset; label: string; description: string }[] = [
  { id: 'grandMatrix', label: 'Grand Matrix', description: 'Graph left, Vault right — overview' },
  { id: 'deepGraph', label: 'Deep Graph', description: 'Full-screen neural topology' },
  { id: 'synthesisStudio', label: 'Synthesis Studio', description: 'Collider + Vault side-by-side' },
  { id: 'zenReader', label: 'Zen Reader', description: 'Distraction-free vault reading' },
  { id: 'commandDeck', label: 'Command Deck', description: 'Terminal + Chronotope + Distortion' },
];

export const AUDIO = {
  BINAURAL_CARRIER: 216,
  BINAURAL_BEAT: 6.0,
  MASTER_GAIN: 0.7,
  CLICK_DURATION: 0.04,
  BLIP_DURATION: 0.09,
};

export const GRAPH = {
  DEFAULT_NODE_COUNT: 84,
  MAX_SYNTHESIS_NODES: 4,
  MIN_WINDOW_WIDTH: 380,
  MIN_WINDOW_HEIGHT: 260,
};
