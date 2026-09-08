# Synthesis Engine — Polymathic Concept Collider

File: `src/services/synthesisEngine.ts`

## Purpose

Takes 1-4 disparate `GraphNode`s and procedurally generates a complete marketing thesis — codename, thesis, GTM, psychographic, virality, palette, tweet storm, manifesto, AI prompt recipe.

This is the **core creative-technology** of NOOSPHERE-OS: ontological combinatorics.

## API

```ts
function synthesizeConcepts(nodes: GraphNode[], temperature = 0.85): SynthesisResult
function alchemizeJargon(input: string): RealityDistortionPayload
```

### synthesizeConcepts

**Inputs**:
- `nodes`: 1-4 GraphNodes, validated
- `temperature`: 0.1-1.0, controls randomness (higher = more jitter in virality, more varied picks)

**Process**:

1. Validate count (1-4)
2. Compute avg cognitive weight, categories, labels
3. Virality = `clamp(avgWeight*8.5 + count*4.2 + jitter(temperature), 72, 99)`
4. Codename = `${prefix} ${latin}-${military} // v${rand}`
   - prefixes: OPERATION, PROJECT, INITIATIVE, FRAMEWORK, VECTOR, PROTOCOL, SCHEMA
   - latin: NOOSPHERE, RHIZOME, SIMULACRUM, CHRONOTOPE, AUTOPOIESIS, HERMETICA, etc.
   - military: VANGUARD, NEXUS, MONOLITH, CYBER-GRID, HYPERSTITION, VORTEX, SINGULARITY, RECURSION
5. Thesis, deconstruction, GTM, psychographic, palette, tweets, manifesto, AI prompt, friction rating — all templated from node labels + categories

**Output**: `SynthesisResult` (see data-model.md)

### alchemizeJargon

Converts mundane corporate speak into esoteric prose. Used by RealityDistortionView.

- Dictionary lookup for keywords: `leads`, `ad`, `landing`, `viral`, `pricing`
- Fallback generator: random subject + verb + outcome, injects original input
- Case-insensitive

```ts
alchemizeJargon('leads') => {
  esoteric: 'Autonomous capture of high-entropy sovereign cognitive nodes...',
  framework: 'Autopoietic Epistemic Influx Architecture',
  keyAxiom: 'A lead is not an email address; it is a temporary lease on human consciousness.'
}
```

## Design Decisions

- **No LLM**: Fully deterministic + Math.random(), runs offline, no API keys
- **Temperature**: Inspired by LLM sampling, but here only affects virality jitter and random picks
- **Clamping**: Virality 72-99 ensures always impressive, never low
- **Hex palette**: Derives from node hexColors + fixed bg/fg (#050608, #f8fafc)

## Example

```ts
const nodes = [graphNodes[0], graphNodes[5], graphNodes[16]];
const result = synthesizeConcepts(nodes, 0.85);

console.log(result.codename); // "VECTOR AUTOPOIESIS-VORTEX // v4.7"
console.log(result.thesis);   // "By intersecting the architectural principles of..."
console.log(result.viralityIndex); // 89
```

## Testing

See `tests/synthesisEngine.test.ts`:

- Throws on 0 or >4 nodes
- Valid result shape
- Temperature respected
- Single node works
- Jargon alchemizer handles known + unknown inputs, case-insensitive

## Future

- Add Markov chain for more varied prose
- Seedable RNG for deterministic sharing (URL param)
- Export to PDF / Notion
- Integration with real LLM via optional VITE_OPENAI_KEY (gated by config)
