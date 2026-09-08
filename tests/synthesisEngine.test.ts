import { describe, it, expect } from 'vitest';
import { synthesizeConcepts, alchemizeJargon } from '../src/services/synthesisEngine';
import type { GraphNode } from '../src/types';

const mockNodes: GraphNode[] = [
  {
    id: 'test-rhizome',
    label: 'Deleuzian Rhizome',
    category: 'semiotics',
    summary: 'Non-hierarchical network',
    epistemicContext: 'A Thousand Plateaus',
    cognitiveWeight: 9,
    tags: ['post-structuralism'],
    connections: ['test-simulacra'],
    hexColor: '#3b82f6',
  },
  {
    id: 'test-simulacra',
    label: 'Baudrillardian Simulacra',
    category: 'semiotics',
    summary: 'Hyperreality',
    epistemicContext: 'Simulacra and Simulation',
    cognitiveWeight: 10,
    tags: ['hyperreality'],
    connections: ['test-rhizome'],
    hexColor: '#3b82f6',
  },
];

describe('synthesisEngine', () => {
  it('should throw when no nodes provided', () => {
    expect(() => synthesizeConcepts([])).toThrow('at least 1-4 concepts');
  });

  it('should throw when too many nodes', () => {
    const many = Array(5).fill(mockNodes[0]) as GraphNode[];
    expect(() => synthesizeConcepts(many)).toThrow('Maximum');
  });

  it('should generate valid synthesis result', () => {
    const result = synthesizeConcepts(mockNodes, 0.85);
    
    expect(result.id).toMatch(/^synth-/);
    expect(result.selectedNodes).toHaveLength(2);
    expect(result.codename).toBeTruthy();
    expect(result.thesis).toContain('Deleuzian Rhizome');
    expect(result.viralityIndex).toBeGreaterThanOrEqual(72);
    expect(result.viralityIndex).toBeLessThanOrEqual(99);
    expect(result.hexPalette).toHaveLength(5);
    expect(result.tweetStorm).toHaveLength(4);
    expect(result.provocativeManifesto).toBeTruthy();
    expect(result.aiPromptRecipe).toBeTruthy();
  });

  it('should respect temperature parameter', () => {
    const lowTemp = synthesizeConcepts(mockNodes, 0.1);
    const highTemp = synthesizeConcepts(mockNodes, 1.0);
    // Both should be valid, but may have different virality due to jitter
    expect(lowTemp.viralityIndex).toBeGreaterThanOrEqual(72);
    expect(highTemp.viralityIndex).toBeGreaterThanOrEqual(72);
  });

  it('should handle single node synthesis', () => {
    const result = synthesizeConcepts([mockNodes[0]]);
    expect(result.selectedNodes).toHaveLength(1);
    expect(result.thesis).toBeTruthy();
  });
});

describe('alchemizeJargon', () => {
  it('should handle known keywords', () => {
    const leads = alchemizeJargon('leads');
    expect(leads.framework).toContain('Epistemic');
    expect(leads.esoteric).toBeTruthy();
    expect(leads.keyAxiom).toBeTruthy();

    const ad = alchemizeJargon('ad campaign');
    expect(ad.framework).toContain('Retinal');

    const viral = alchemizeJargon('viral growth');
    expect(viral.framework).toContain('Mycelial');
  });

  it('should handle unknown input with fallback generator', () => {
    const result = alchemizeJargon('quantum onboarding funnel');
    expect(result.esoteric).toContain('quantum onboarding funnel');
    expect(result.framework).toBeTruthy();
    expect(result.keyAxiom).toBeTruthy();
  });

  it('should be case-insensitive', () => {
    const lower = alchemizeJargon('leads');
    const upper = alchemizeJargon('LEADS');
    const mixed = alchemizeJargon('LeAdS');
    
    expect(lower.framework).toBe(upper.framework);
    expect(lower.framework).toBe(mixed.framework);
  });
});
