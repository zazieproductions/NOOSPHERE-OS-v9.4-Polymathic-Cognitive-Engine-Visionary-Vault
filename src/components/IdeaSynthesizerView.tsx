import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GraphNode, SynthesisResult } from '../types';
import { INITIAL_GRAPH_NODES } from '../data/graphNodes';
import { synthesizeConcepts } from '../services/synthesisEngine';
import { audioEngine } from '../services/audioEngine';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Layers, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Cpu, 
  Send, 
  Radio, 
  ShieldCheck, 
  Terminal,
  Share2
} from 'lucide-react';

interface IdeaSynthesizerViewProps {
  initialNodes?: GraphNode[];
}

export const IdeaSynthesizerView: React.FC<IdeaSynthesizerViewProps> = ({
  initialNodes
}) => {
  const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>(
    initialNodes && initialNodes.length > 0 
      ? initialNodes 
      : [INITIAL_GRAPH_NODES[0], INITIAL_GRAPH_NODES[5], INITIAL_GRAPH_NODES[16]]
  );

  const [temperature, setTemperature] = useState<number>(0.85);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(() => {
    try {
      return synthesizeConcepts(
        initialNodes && initialNodes.length > 0 
          ? initialNodes 
          : [INITIAL_GRAPH_NODES[0], INITIAL_GRAPH_NODES[5], INITIAL_GRAPH_NODES[16]]
      );
    } catch {
      return null;
    }
  });

  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleAddNode = (node: GraphNode) => {
    if (selectedNodes.some(n => n.id === node.id)) return;
    if (selectedNodes.length >= 4) {
      // Replace last
      setSelectedNodes([...selectedNodes.slice(0, 3), node]);
    } else {
      setSelectedNodes([...selectedNodes, node]);
    }
    audioEngine.playNodeBlip(800 + selectedNodes.length * 100);
  };

  const handleRemoveNode = (id: string) => {
    if (selectedNodes.length <= 1) return;
    setSelectedNodes(selectedNodes.filter(n => n.id !== id));
    audioEngine.playSynapticClick(600);
  };

  const handleTriggerSynthesis = () => {
    setIsSynthesizing(true);
    audioEngine.playNodeBlip(400);

    setTimeout(() => {
      try {
        const result = synthesizeConcepts(selectedNodes, temperature);
        setSynthesisResult(result);
        setIsSynthesizing(false);
        audioEngine.playEurekaChord();

        // Confetti explosion of visionary colors
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6']
        });
      } catch (err) {
        setIsSynthesizing(false);
      }
    }, 450);
  };

  const handlePresetCollision = (presetType: string) => {
    let chosen: GraphNode[] = [];
    if (presetType === 'hyperstition') {
      chosen = [
        INITIAL_GRAPH_NODES.find(n => n.id === 'hyperstition-vector')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'baudrillard-simulacra')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'hermetic-scarcity')!,
      ].filter(Boolean);
    } else if (presetType === 'biomimetic') {
      chosen = [
        INITIAL_GRAPH_NODES.find(n => n.id === 'biomimetic-mycelium')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'cac-ltv-singularity')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'memetic-contagion')!,
      ].filter(Boolean);
    } else if (presetType === 'quantum-growth') {
      chosen = [
        INITIAL_GRAPH_NODES.find(n => n.id === 'quantum-superposition')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'tiktok-hook-velocity')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'shannon-entropy')!,
      ].filter(Boolean);
    } else {
      chosen = [
        INITIAL_GRAPH_NODES.find(n => n.id === 'deleuzian-rhizome')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'epistemic-arbitrage')!,
        INITIAL_GRAPH_NODES.find(n => n.id === 'reality-distortion-vector')!,
      ].filter(Boolean);
    }

    if (chosen.length > 0) {
      setSelectedNodes(chosen);
      audioEngine.playNodeBlip(1000);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    audioEngine.playSynapticClick(1500);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070e] text-zinc-100 overflow-y-auto p-3 sm:p-5 font-mono-code">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 font-display uppercase tracking-wider">
              Concept Collider & Polymath Synthesis Reactor
            </h2>
            <p className="text-[10px] text-zinc-400">
              Intersect disparate ontological paradigms to generate unprecedented marketing theses
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-[10px] text-zinc-500 uppercase">Presets:</span>
          <button
            onClick={() => handlePresetCollision('hyperstition')}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-purple-400 text-[10px]"
          >
            Hyperstition Drop
          </button>
          <button
            onClick={() => handlePresetCollision('biomimetic')}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-lime-400 text-[10px]"
          >
            Mycelial Virality
          </button>
          <button
            onClick={() => handlePresetCollision('quantum-growth')}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400 text-[10px]"
          >
            Quantum Entropy
          </button>
        </div>
      </div>

      {/* Reactor Core: Selected Concept Chambers */}
      <div className="my-4 p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/80 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Active Reactor Chambers ({selectedNodes.length}/4)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[10px] text-zinc-400">Entropy Temp:</span>
            <span className="text-emerald-400 font-bold">{temperature}</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-20 accent-emerald-500 h-1 bg-zinc-800 rounded"
            />
          </div>
        </div>

        {/* Selected Concept Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3">
          {selectedNodes.map((node, i) => (
            <div
              key={node.id}
              className="p-3 rounded bg-zinc-900/90 border border-zinc-700/80 flex flex-col justify-between relative group hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="text-[9px] uppercase font-bold text-emerald-400 px-1 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/60">
                  {node.category}
                </span>
                {selectedNodes.length > 1 && (
                  <button
                    onClick={() => handleRemoveNode(node.id)}
                    className="text-zinc-500 hover:text-rose-400 p-0.5"
                    title="Remove Node"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <h4 className="text-xs font-bold text-zinc-100 my-1.5 truncate">
                {node.label}
              </h4>

              <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                {node.summary}
              </p>

              <div className="mt-2 text-[9px] text-zinc-500 flex justify-between">
                <span>Weight: {node.cognitiveWeight}/10</span>
                <span className="font-mono text-zinc-400">{node.hexColor}</span>
              </div>
            </div>
          ))}

          {selectedNodes.length < 4 && (
            <div className="border border-dashed border-zinc-800 rounded p-3 flex flex-col items-center justify-center text-center text-zinc-500 text-xs">
              <span className="text-[10px] mb-1">Select another node below to add</span>
              <Plus className="w-4 h-4 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Quick Node Adder Ribbon */}
        <div className="pt-2 border-t border-zinc-900 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          <span className="text-zinc-500 flex-shrink-0 uppercase font-bold">Quick Insert:</span>
          {INITIAL_GRAPH_NODES.slice(0, 8).map(n => (
            <button
              key={n.id}
              onClick={() => handleAddNode(n)}
              disabled={selectedNodes.some(sn => sn.id === n.id)}
              className={`px-2 py-0.5 rounded border flex-shrink-0 transition-colors ${
                selectedNodes.some(sn => sn.id === n.id)
                  ? 'bg-zinc-900/40 border-zinc-900 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400'
              }`}
            >
              + {n.label}
            </button>
          ))}
        </div>

        {/* Big Collide Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleTriggerSynthesis}
            disabled={isSynthesizing}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950/60 hover:brightness-110 active:scale-98 transition-all"
          >
            <Flame className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isSynthesizing ? 'IGNITING ONTOLOGICAL FUSION...' : 'COLLIDE CONCEPTS & SYNTHESIZE REALITY'}</span>
          </button>
        </div>
      </div>

      {/* Synthesis Output Display */}
      {synthesisResult && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          {/* Top Banner: Codename & KPIs */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  SYNTHESIZED MATRIX v9.4
                </span>
                <span className="text-zinc-500 text-xs">Generated at {synthesisResult.timestamp}</span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-zinc-400">Virality Index:</span>
                  <span className="text-emerald-400 font-bold text-sm">{synthesisResult.viralityIndex}/100</span>
                </div>

                {/* Hex Palette Triad */}
                <div className="flex items-center space-x-1">
                  {synthesisResult.hexPalette.map((hex, i) => (
                    <div
                      key={i}
                      title={`Hex: ${hex}`}
                      style={{ backgroundColor: hex }}
                      className="w-4 h-4 rounded-full border border-zinc-700 cursor-pointer shadow"
                      onClick={() => copyText(hex, `hex-${i}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-100 mt-2 font-display tracking-wide">
              {synthesisResult.codename}
            </h3>
          </div>

          {/* Grid of Synthesized Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Axiomatic Thesis */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Axiomatic Thesis
                  </span>
                  <button
                    onClick={() => copyText(synthesisResult.thesis, 'thesis')}
                    className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
                  >
                    {copiedSection === 'thesis' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {synthesisResult.thesis}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-900 text-[10px] text-zinc-500">
                Friction: <span className="text-zinc-300">{synthesisResult.marketFrictionRating}</span>
              </div>
            </div>

            {/* 2. Semiotic Deconstruction */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Semiotic Arbitrage
                  </span>
                  <button
                    onClick={() => copyText(synthesisResult.semioticDeconstruction, 'semiotics')}
                    className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
                  >
                    {copiedSection === 'semiotics' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {synthesisResult.semioticDeconstruction}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-900 text-[10px] text-zinc-500">
                Target: <span className="text-zinc-300 truncate block">{synthesisResult.targetPsychographic}</span>
              </div>
            </div>

            {/* 3. Viral GTM Vector */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 lg:col-span-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" /> 3-Phase Viral GTM Execution Vector
                </span>
                <button
                  onClick={() => copyText(synthesisResult.gtmVector, 'gtm')}
                  className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
                >
                  {copiedSection === 'gtm' ? <Check className="w-3 h-3 text-amber-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed space-y-1.5 whitespace-pre-line">
                {synthesisResult.gtmVector}
              </div>
            </div>

            {/* 4. Tweetstorm Seeds */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Viral Tweetstorm Narrative
                </span>
                <button
                  onClick={() => copyText(synthesisResult.tweetStorm.join('\n\n'), 'tweets')}
                  className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
                >
                  {copiedSection === 'tweets' ? <Check className="w-3 h-3 text-purple-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="space-y-2 text-xs text-zinc-300">
                {synthesisResult.tweetStorm.map((t, i) => (
                  <div key={i} className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px] leading-relaxed">
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. AI Prompt Recipe */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Autonomous AI Agent Prompt Chain
                  </span>
                  <button
                    onClick={() => copyText(synthesisResult.aiPromptRecipe, 'prompt')}
                    className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
                  >
                    {copiedSection === 'prompt' ? <Check className="w-3 h-3 text-pink-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-pink-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {synthesisResult.aiPromptRecipe}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
