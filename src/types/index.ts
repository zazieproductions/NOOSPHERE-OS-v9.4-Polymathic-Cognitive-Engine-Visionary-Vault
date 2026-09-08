/**
 * NOOSPHERE-OS Core Type Definitions
 * Polymathic Cognitive Engine — type-safe domain model
 */

// ============================================================================
// Window System
// ============================================================================

export type WindowId =
  | 'graph'
  | 'vault'
  | 'synthesizer'
  | 'distortion'
  | 'chromatic'
  | 'chronotope'
  | 'terminal'
  | 'oracle'
  | 'audioLab'
  | 'settings';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: WindowId;
  title: string;
  subtitle?: string;
  /** Lucide icon name or semantic key */
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  badge?: string;
  category?: string;
}

// ============================================================================
// Knowledge Graph
// ============================================================================

export type NodeCategory =
  | 'semiotics'
  | 'hypergrowth'
  | 'cybernetics'
  | 'biomimicry'
  | 'avantgarde'
  | 'quantum'
  | 'memetics'
  | 'ai-orchestration'
  | 'esoteric';

export interface GraphNode {
  id: string;
  label: string;
  category: NodeCategory;
  /** One-line epistemic summary */
  summary: string;
  /** Academic / historical context */
  epistemicContext: string;
  /** Cognitive weight 1-10 */
  cognitiveWeight: number;
  tags: string[];
  /** Connected node IDs */
  connections: string[];
  hexColor: string;
  // Force simulation (optional, populated at runtime)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  // Optional enrichment
  quote?: string;
  /** Tactical GTM application */
  applicationVector?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  strength?: number;
  type?: 'synergistic' | 'dialectical' | 'recursive' | 'subversive';
}

// ============================================================================
// Vault / Notes
// ============================================================================

export interface VaultNote {
  id: string;
  title: string;
  category: NodeCategory;
  /** 1-100 */
  cognitiveDensity: number;
  readTime: string;
  tags: string[];
  dateCreated: string;
  excerpt: string;
  /** Full markdown content */
  content: string;
  /** Backlink titles or IDs */
  backlinks: string[];
  relatedNodeId?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  authorNote?: string;
}

// ============================================================================
// Synthesis Engine
// ============================================================================

export interface SynthesisResult {
  id: string;
  timestamp: string;
  selectedNodes: GraphNode[];
  codename: string;
  thesis: string;
  semioticDeconstruction: string;
  gtmVector: string;
  targetPsychographic: string;
  /** 1-100 */
  viralityIndex: number;
  hexPalette: string[];
  tweetStorm: string[];
  provocativeManifesto: string;
  aiPromptRecipe: string;
  marketFrictionRating: string;
}

export interface RealityDistortionPayload {
  esoteric: string;
  framework: string;
  keyAxiom: string;
}

// ============================================================================
// Chromatic Lab
// ============================================================================

export interface ChromaticColor {
  hex: string;
  name: string;
  role: string;
  psychographic: string;
}

export interface ChromaticPalette {
  id: string;
  name: string;
  vibe: string;
  description: string;
  archetype: string;
  colors: ChromaticColor[];
  contrastScore: string;
  recommendedAudience: string;
}

// ============================================================================
// Oracle & Campaign
// ============================================================================

export interface OracleQuote {
  id: string;
  quote: string;
  polymath: string;
  eraOrDiscipline: string;
  axiom: string;
  tacticalRelevance: string;
}

export interface CampaignMilestone {
  id: string;
  phase: string;
  title: string;
  codename: string;
  timeframe: string;
  objective: string;
  semioticPayload: string;
  viralityTarget: number;
  status: 'completed' | 'active' | 'queued' | 'speculative';
  kpis: { label: string; value: string }[];
  tags: string[];
}

// ============================================================================
// OS Configuration
// ============================================================================

export type OSTheme = 'obsidian' | 'matrix' | 'alchemical' | 'brutalist' | 'ultraviolet';
export type WallpaperMode = 'neural' | 'matrixRain' | 'cyberGrid' | 'topological' | 'deepVoid';
export type WorkspacePreset = 'grandMatrix' | 'deepGraph' | 'synthesisStudio' | 'zenReader' | 'commandDeck';

// ============================================================================
// Utility
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface SearchResult<T> {
  item: T;
  score: number;
  matchedFields: string[];
}
