import { describe, it, expect } from 'vitest';
import type { WindowId, NodeCategory, WallpaperMode, WorkspacePreset } from '../src/types';

describe('type definitions', () => {
  it('should have valid WindowId values', () => {
    const validIds: WindowId[] = ['graph', 'vault', 'synthesizer', 'distortion', 'chromatic', 'chronotope', 'terminal', 'oracle', 'audioLab', 'settings'];
    expect(validIds).toHaveLength(10);
  });

  it('should have valid NodeCategory values', () => {
    const categories: NodeCategory[] = ['semiotics', 'hypergrowth', 'cybernetics', 'biomimicry', 'avantgarde', 'quantum', 'memetics', 'ai-orchestration', 'esoteric'];
    expect(categories).toHaveLength(9);
  });

  it('should have valid WallpaperMode values', () => {
    const modes: WallpaperMode[] = ['neural', 'matrixRain', 'cyberGrid', 'topological', 'deepVoid'];
    expect(modes).toHaveLength(5);
  });

  it('should have valid WorkspacePreset values', () => {
    const presets: WorkspacePreset[] = ['grandMatrix', 'deepGraph', 'synthesisStudio', 'zenReader', 'commandDeck'];
    expect(presets).toHaveLength(5);
  });
});
