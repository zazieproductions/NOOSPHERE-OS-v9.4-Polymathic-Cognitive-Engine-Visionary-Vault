import { describe, it, expect } from 'vitest';
import { WINDOW_TITLES, WALLPAPER_MODES, WORKSPACE_PRESETS, AUDIO, GRAPH } from '../src/lib/constants';

describe('constants', () => {
  it('should have window titles for all windows', () => {
    expect(Object.keys(WINDOW_TITLES)).toHaveLength(10);
    expect(WINDOW_TITLES.graph.title).toContain('Neural Graph');
  });

  it('should have wallpaper modes', () => {
    expect(WALLPAPER_MODES).toHaveLength(5);
    expect(WALLPAPER_MODES.map(m => m.id)).toContain('neural');
  });

  it('should have workspace presets', () => {
    expect(WORKSPACE_PRESETS).toHaveLength(5);
    expect(WORKSPACE_PRESETS.map(p => p.id)).toContain('grandMatrix');
  });

  it('should have audio constants', () => {
    expect(AUDIO.BINAURAL_CARRIER).toBe(216);
    expect(AUDIO.BINAURAL_BEAT).toBe(6.0);
    expect(AUDIO.MASTER_GAIN).toBeGreaterThan(0);
  });

  it('should have graph constants', () => {
    expect(GRAPH.MAX_SYNTHESIS_NODES).toBe(4);
    expect(GRAPH.MIN_WINDOW_WIDTH).toBeGreaterThan(0);
  });
});
