import React, { useState } from 'react';
import { ChromaticPalette } from '../../types';
import { CHROMATIC_PALETTES } from '../../data/palettes';
import { audioEngine } from '../../services/audioEngine';
import { 
  Palette, 
  Copy, 
  Check, 
  Eye, 
  Sparkles, 
  Code2, 
  Layers, 
  Sliders,
  ShieldAlert,
  Compass
} from 'lucide-react';

export const HexChromaticLab: React.FC = () => {
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(CHROMATIC_PALETTES[0].id);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'hero' | 'terminal' | 'token'>('hero');

  const activePalette = CHROMATIC_PALETTES.find(p => p.id === selectedPaletteId) || CHROMATIC_PALETTES[0];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    audioEngine.playSynapticClick(1400);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyAllCss = () => {
    const cssVars = activePalette.colors.map((c, i) => `--color-tier-${i + 1}: ${c.hex}; /* ${c.name} */`).join('\n');
    navigator.clipboard.writeText(`/* ${activePalette.name} */\n:root {\n${cssVars}\n}`);
    setCopiedHex('ALL_CSS');
    audioEngine.playEurekaChord();
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070d] text-zinc-100 overflow-y-auto p-4 sm:p-6 font-mono-code space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-pink-500/10 border border-pink-500/30 text-pink-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 font-display uppercase tracking-wider">
              Chromatic Alchemy & Retinal Dominance Lab
            </h2>
            <p className="text-[10px] text-zinc-400">
              High-contrast OLED chromatic orchestration for extreme visual attention capture
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAllCss}
          className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs flex items-center space-x-1.5 transition-colors"
        >
          {copiedHex === 'ALL_CSS' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5 text-pink-400" />}
          <span>{copiedHex === 'ALL_CSS' ? 'CSS Variables Copied!' : 'Export :root CSS'}</span>
        </button>
      </div>

      {/* Palette Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CHROMATIC_PALETTES.map((p) => {
          const isSelected = p.id === selectedPaletteId;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPaletteId(p.id);
                audioEngine.playNodeBlip(750);
              }}
              className={`p-3 rounded-lg border text-left flex-shrink-0 min-w-[200px] transition-all ${
                isSelected
                  ? 'bg-zinc-900 border-pink-500/60 shadow-lg shadow-pink-950/30 ring-1 ring-pink-500/30'
                  : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase font-bold text-pink-400 px-1 py-0.2 rounded bg-pink-950/40 border border-pink-800/40">
                  {p.archetype}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">{p.contrastScore.split(' ')[0]}</span>
              </div>
              <h4 className="text-xs font-bold text-zinc-100 truncate mb-2">
                {p.name}
              </h4>
              {/* Color swatches preview */}
              <div className="flex h-2 rounded overflow-hidden border border-zinc-700">
                {p.colors.map((c, i) => (
                  <div key={i} style={{ backgroundColor: c.hex }} className="flex-1" />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Palette Deep Breakdown */}
      <div className="p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-pink-400 tracking-widest block">
              VIBE: {activePalette.vibe}
            </span>
            <h3 className="text-base font-bold text-zinc-100 font-display mt-0.5">
              {activePalette.name}
            </h3>
          </div>
          <div className="text-right text-xs">
            <span className="text-zinc-500 block text-[10px]">Target Psychographic:</span>
            <span className="text-zinc-300 font-semibold">{activePalette.recommendedAudience}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {activePalette.description}
        </p>

        {/* Individual Color Swatches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {activePalette.colors.map((col, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyHex(col.hex)}
              className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 cursor-pointer hover:border-pink-500/60 transition-all group relative"
            >
              <div
                style={{ backgroundColor: col.hex }}
                className="w-full h-12 rounded mb-2 border border-white/10 shadow-inner flex items-center justify-center relative"
              >
                <span className="opacity-0 group-hover:opacity-100 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-mono text-white transition-opacity flex items-center gap-1">
                  {copiedHex === col.hex ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                  {copiedHex === col.hex ? 'Copied' : 'Copy Hex'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-100 text-[11px] truncate">{col.name}</span>
                </div>
                <div className="text-[10px] font-mono font-semibold text-pink-400">
                  {col.hex}
                </div>
                <div className="text-[9px] text-zinc-400 leading-tight">
                  {col.role}
                </div>
                <div className="text-[8px] text-zinc-500 italic pt-1 border-t border-zinc-800">
                  {col.psychographic}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live UI Mockup Simulation */}
      <div className="p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Live Real-Time UI Render Testbed
            </h3>
          </div>

          <div className="flex space-x-1 text-xs">
            <button
              onClick={() => setPreviewTab('hero')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                previewTab === 'hero' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Landing Hero
            </button>
            <button
              onClick={() => setPreviewTab('terminal')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                previewTab === 'terminal' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              CLI Terminal
            </button>
          </div>
        </div>

        {/* Dynamic Mockup Card rendered using active palette colors */}
        <div
          style={{
            backgroundColor: activePalette.colors[0]?.hex || '#050608',
            borderColor: activePalette.colors[1]?.hex || '#1e293b',
          }}
          className="p-6 rounded-xl border shadow-2xl relative overflow-hidden transition-all duration-300"
        >
          {previewTab === 'hero' ? (
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center space-x-2 px-2 py-0.5 rounded border text-[10px] font-mono uppercase"
                style={{
                  color: activePalette.colors[2]?.hex || '#10b981',
                  borderColor: `${activePalette.colors[2]?.hex}44` || '#10b98144',
                  backgroundColor: `${activePalette.colors[2]?.hex}15` || '#10b98115',
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>Next-Gen Epistemic Infrastructure</span>
              </div>

              <h2
                className="text-xl sm:text-2xl font-bold font-display leading-tight"
                style={{ color: activePalette.colors[4]?.hex || '#ffffff' }}
              >
                Autonomous Reality Synthesis for Polymathic Minds
              </h2>

              <p
                className="text-xs leading-relaxed"
                style={{ color: `${activePalette.colors[4]?.hex}bb` || '#94a3b8' }}
              >
                Dismantle legacy linear conversion models. Deploy autopoietic, high-entropy narrative loops that command irreversible market gravity.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  style={{
                    backgroundColor: activePalette.colors[2]?.hex || '#10b981',
                    color: '#000000',
                    boxShadow: `0 10px 25px -5px ${activePalette.colors[2]?.hex}50`,
                  }}
                  className="px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all font-mono"
                >
                  Initiate Solstice Intake
                </button>

                <button
                  style={{
                    borderColor: activePalette.colors[3]?.hex || '#06b6d4',
                    color: activePalette.colors[3]?.hex || '#06b6d4',
                  }}
                  className="px-4 py-2 rounded border text-xs font-mono hover:bg-white/5 transition-colors"
                >
                  Read Whitepaper →
                </button>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs space-y-2">
              <div style={{ color: activePalette.colors[3]?.hex || '#06b6d4' }}>
                $ noosphere-cli --init-quantum-core --entropy 0.94
              </div>
              <div style={{ color: activePalette.colors[2]?.hex || '#10b981' }}>
                [SUCCESS] Core online. 82 synapses established.
              </div>
              <div style={{ color: `${activePalette.colors[4]?.hex}99` || '#94a3b8' }}>
                &gt; Reality distortion matrix anchored at 528Hz. All legacy funnels bypassed.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
