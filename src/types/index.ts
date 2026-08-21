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

export interface WindowState {
  id: WindowId;
  title: string;
  subtitle?: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  badge?: string;
  category?: string;
}

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
  summary: string;
  epistemicContext: string;
  cognitiveWeight: number; // 1 to 10 scale
  tags: string[];
  connections: string[]; // Node IDs
  hexColor: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  quote?: string;
  applicationVector?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  strength?: number;
  type?: 'synergistic' | 'dialectical' | 'recursive' | 'subversive';
}

export interface VaultNote {
  id: string;
  title: string;
  category: NodeCategory;
  cognitiveDensity: number; // 1 - 100
  readTime: string;
  tags: string[];
  dateCreated: string;
  excerpt: string;
  content: string;
  backlinks: string[]; // Titles or IDs of linked notes
  relatedNodeId?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  authorNote?: string;
}

export interface SynthesisResult {
  id: string;
  timestamp: string;
  selectedNodes: GraphNode[];
  codename: string;
  thesis: string;
  semioticDeconstruction: string;
  gtmVector: string;
  targetPsychographic: string;
  viralityIndex: number; // 1 - 100
  hexPalette: string[];
  tweetStorm: string[];
  provocativeManifesto: string;
  aiPromptRecipe: string;
  marketFrictionRating: string;
}

export interface ChromaticPalette {
  id: string;
  name: string;
  vibe: string;
  description: string;
  archetype: string;
  colors: {
    hex: string;
    name: string;
    role: string;
    psychographic: string;
  }[];
  contrastScore: string;
  recommendedAudience: string;
}

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

export type OSTheme = 'obsidian' | 'matrix' | 'alchemical' | 'brutalist' | 'ultraviolet';
export type WallpaperMode = 'neural' | 'matrixRain' | 'cyberGrid' | 'topological' | 'deepVoid';
export type WorkspacePreset = 'grandMatrix' | 'deepGraph' | 'synthesisStudio' | 'zenReader' | 'commandDeck';
