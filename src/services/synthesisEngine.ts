import { GraphNode, SynthesisResult } from '../types';

// Pre-configured alchemical generators and dynamic combinatorial synthesizer
export function synthesizeConcepts(nodes: GraphNode[], temperature = 0.85): SynthesisResult {
  if (nodes.length === 0) {
    throw new Error('Please select at least 1-4 concepts to synthesize.');
  }

  const nodeLabels = nodes.map(n => n.label);
  const categories = Array.from(new Set(nodes.map(n => n.category)));
  const avgWeight = Math.round(nodes.reduce((acc, n) => acc + n.cognitiveWeight, 0) / nodes.length);
  const viralityScore = Math.min(99, Math.max(72, Math.floor(avgWeight * 8.5 + (nodes.length * 4.2) + (Math.random() * 6))));

  // Generate dynamic esoteric codename
  const prefixes = ['OPERATION', 'PROJECT', 'INITIATIVE', 'FRAMEWORK', 'VECTOR', 'PROTOCOL', 'SCHEMA'];
  const latinEsoterics = ['NOOSPHERE', 'RHIZOME', 'SIMULACRUM', 'CHRONOTOPE', 'AUTOPOIESIS', 'HERMETICA', 'TELEOLOGY', 'ENTROPY', 'AURA', 'SYNTAX', 'APOTHEOSIS'];
  const militaryTech = ['VANGUARD', 'NEXUS', 'MONOLITH', 'CYBER-GRID', 'HYPERSTITION', 'VORTEX', 'SINGULARITY', 'RECURSION'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const word1 = latinEsoterics[Math.floor(Math.random() * latinEsoterics.length)];
  const word2 = militaryTech[Math.floor(Math.random() * militaryTech.length)];
  const codename = `${prefix} ${word1}-${word2} // v${(Math.random() * 8 + 1).toFixed(1)}`;

  // Synthesize Thesis
  const mainNode = nodes[0];
  const secondaryNode = nodes[1] || nodes[0];
  const tertiaryNode = nodes[2] || nodes[0];

  const thesis = `By intersecting the architectural principles of ${mainNode.label} with the operational velocity of ${secondaryNode.label}, this framework dismantles standard linear funnel bottlenecks. Rather than chasing commoditized attention, we execute an autopoietic epistemic loop that systematically alters the cognitive perceptual threshold of high-value decision makers through ${tertiaryNode.label}.`;

  // Semiotic Deconstruction
  const semioticDeconstruction = `Consensus market participants operate under the illusion that buyers evaluate utility rationally. In contrast, this framework leverages ${mainNode.label} to strip away legacy category framing. We replace the commodity transaction with an alchemical initiation ritual, transforming mundane conversion points into sacred thresholds of mimetic distinction.`;

  // GTM Vector
  const gtmVector = `Phase 1: Deploy high-entropy micro-hooks embedded with ${secondaryNode.label} across decentralized nodes to capture subconscious retinal attention.
Phase 2: Funnel qualified nodes into an insulated hermetic environment governed by ${mainNode.label}, driving intentional friction that filters out low-agency actors.
Phase 3: Trigger an algorithmic feedback singularity utilizing ${tertiaryNode.label}, turning the customer base into self-replicating meme vectors that depress marginal CAC to near-zero levels.`;

  // Target Psychographic
  const psychographics = [
    'Sovereign Techno-Humanists with $10M+ AUM seeking existential leverage over legacy institutions.',
    'Hyper-Rational Quant Engineers susceptible to elegant systemic aesthetics and mathematical symmetry.',
    'Avant-Garde Creative Directors and Silicon Valley Founders who reject standard B2B SaaS tropes.',
    'High-Agency Autonomous Creators who value esoteric brand lore over transactional discount codes.'
  ];
  const targetPsychographic = psychographics[Math.floor(Math.random() * psychographics.length)];

  // Hex Palette Extraction
  const primaryHex = mainNode.hexColor || '#10b981';
  const secondaryHex = secondaryNode.hexColor || '#06b6d4';
  const accentHex = tertiaryNode.hexColor || '#f59e0b';
  const hexPalette = ['#050608', primaryHex, secondaryHex, accentHex, '#f8fafc'];

  // Tweetstorm Generation
  const tweetStorm = [
    `1/ Most brands die because their copy has zero Shannon entropy. If your headline is 99% predictable, the human brain saves glucose by looking away. Here is how we use ${mainNode.label} to achieve retinal monopoly: 🧵`,
    `2/ When you combine ${mainNode.label} with ${secondaryNode.label}, traditional funnel friction becomes your primary moat. True luxury never sells; it permits access to the initiated.`,
    `3/ The transition from reactive acquisition to autopoietic expansion happens when your customers stop consuming your product and start inhabiting your mythology. ${tertiaryNode.label} is the catalyst.`,
    `4/ Stop building features. Start engineering hyperstitional feedback loops where the future state of the market collapses backward into your present cash flows. End of transmission.`
  ];

  // Manifesto
  const provocativeManifesto = `We reject the flaccid orthodoxy of modern growth hacking. We refuse to participate in the race-to-the-bottom clickbait dystopia. By uniting ${nodeLabels.join(', ')}, we forge a sovereign cognitive construct that commands irreversible cultural and economic hegemony.`;

  // AI Prompt Chain Recipe
  const aiPromptRecipe = `[SYSTEM PROMPT]: You are an elite polymathic creative director and cognitive strategist operating at the intersection of ${categories.join(', ')}.
[TASK]: Synthesize a 3-part avant-garde brand positioning manifesto for high-ticket acquisition.
[AXIOMATIC CONSTRAINTS]:
- Integrate principles of ${mainNode.label} (${mainNode.summary})
- Apply the operational dynamics of ${secondaryNode.label}
- Tone: Cold intellectual precision, profound philosophical density, unshakeable reality distortion.
- Ban all corporate SaaS clichés: "streamline", "all-in-one", "game-changer". Replace with hyperstitional, teleological terminology.`;

  const frictionRatings = [
    'Hermetically Sealed (Zero Resistance for Insiders, Impassable for Tourists)',
    'High-Impedance Asymmetric Vortex (94% Disqualification Rate)',
    'Frictional Superfluidity (Immediate Retinal Capture with Multi-Tiered Gating)'
  ];

  return {
    id: `synth-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    selectedNodes: nodes,
    codename,
    thesis,
    semioticDeconstruction,
    gtmVector,
    targetPsychographic,
    viralityIndex: viralityScore,
    hexPalette,
    tweetStorm,
    provocativeManifesto,
    aiPromptRecipe,
    marketFrictionRating: frictionRatings[Math.floor(Math.random() * frictionRatings.length)]
  };
}

// JARGON ALCHEMIZER: Converts mundane corporate speak into hyper-intellectual genius prose
export function alchemizeJargon(input: string): { esoteric: string; framework: string; keyAxiom: string } {
  const cleanInput = input.trim().toLowerCase();

  const dictionaries: Record<string, { esoteric: string; framework: string; keyAxiom: string }> = {
    leads: {
      esoteric: 'Autonomous capture of high-entropy sovereign cognitive nodes across the decentralized agora, converting dormant spectator latency into unliquidated intent vectors.',
      framework: 'Autopoietic Epistemic Influx Architecture',
      keyAxiom: 'A lead is not an email address; it is a temporary lease on human consciousness.'
    },
    ad: {
      esoteric: 'A hyper-compressed, high-entropy ocular syntagma engineered to induce sub-300ms dopamine resets and shatter consensual perceptual inertia.',
      framework: 'Quantum Retinal Interruption Schema',
      keyAxiom: 'The ad must not sell the artifact; it must render the existing worldview obsolete.'
    },
    landing: {
      esoteric: 'A hermetically insulated philosophical sanctuary where visitors undergo systematic semiotic deterritorialization before ascending to high-ticket initiation.',
      framework: 'Baudrillardian Threshold Matrix',
      keyAxiom: 'The page is not a storefront; it is an ontological border checkpoint.'
    },
    viral: {
      esoteric: 'Self-propagating morphogenetic memetic contagion achieving recursive velocity through Girardian mimetic resonance and Shannon-optimal information density.',
      framework: 'Mycelial Cultural Replication Protocol',
      keyAxiom: 'Virality is biological self-replication transplanted into the digital noosphere.'
    },
    pricing: {
      esoteric: 'An asymmetric alchemical filter calibrating perceived metaphysical scarcity to detach valuation from marginal cost-of-goods and anchor it in sovereign status capital.',
      framework: 'Hermetic Scarcity Calculus',
      keyAxiom: 'High price is not a barrier to purchase; it is the primary emotional feature being purchased.'
    }
  };

  for (const key of Object.keys(dictionaries)) {
    if (cleanInput.includes(key)) {
      return dictionaries[key];
    }
  }

  // Dynamic fallback generator for any arbitrary input
  const subjects = ['epistemic arbitrage', 'autopoietic feedback loops', 'semiotic capital accumulation', 'quantum perceptual collapse', 'rhizomatic narrative propagation'];
  const verbs = ['catalyzes irreversible', 'systematically deconstructs', 'weaponizes the latent potential of', 'transmutes mundane friction into', 'orchestrates the sovereign hegemony of'];
  const outcomes = ['high-order market dominance', 'total cultural inevitability', 'subconscious retinal capture', 'zero-marginal-cost customer acquisition', 'unassailable brand aura'];

  const s = subjects[Math.floor(Math.random() * subjects.length)];
  const v = verbs[Math.floor(Math.random() * verbs.length)];
  const o = outcomes[Math.floor(Math.random() * outcomes.length)];

  return {
    esoteric: `By deconstructing "${input}" through the lens of ${s}, we formulate an avant-garde paradigm that ${v} ${o} across all digital topologies.`,
    framework: `Project ${input.slice(0, 10).toUpperCase().replace(/\s+/g, '-')}-OMEGA // Epistemic Syntagma`,
    keyAxiom: `That which is framed conventionally is dismissed immediately; that which is framed polymathically commands infinite reverence.`
  };
}
