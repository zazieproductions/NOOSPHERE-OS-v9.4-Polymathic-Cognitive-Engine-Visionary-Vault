import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ORACLE_QUOTES } from '../data/oracleQuotes';
import { alchemizeJargon } from '../services/synthesisEngine';
import { audioEngine } from '../services/audioEngine';
import { 
  Sparkles, 
  Flame, 
  Activity, 
  Radio, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Zap, 
  BookOpen, 
  Copy, 
  Check, 
  RotateCw,
  Cpu,
  BrainCircuit,
  Eye,
  Send
} from 'lucide-react';

interface RealityDistortionViewProps {
  onAuraUpdate?: (aura: number) => void;
}

export const RealityDistortionView: React.FC<RealityDistortionViewProps> = ({
  onAuraUpdate
}) => {
  // Simulator Dials
  const [realityDistortion, setRealityDistortion] = useState(88);
  const [obscurityIndex, setObscurityIndex] = useState(94);
  const [semioCapitalism, setSemioCapitalism] = useState(92);
  const [dopamineRate, setDopamineRate] = useState(78);
  const [hermeticAura, setHermeticAura] = useState(96);

  // Binaural Theta state
  const [binauralActive, setBinauralActive] = useState(audioEngine.getBinauralActive());

  // Oracle Quote
  const [quoteIndex, setQuoteIndex] = useState(0);
  const activeQuote = ORACLE_QUOTES[quoteIndex];

  // Jargon Alchemizer Input & Output
  const [jargonInput, setJargonInput] = useState('We need to get more leads from social media');
  const [alchemized, setAlchemized] = useState(() => alchemizeJargon('We need to get more leads from social media'));
  const [copied, setCopied] = useState(false);

  // Breakthrough Card
  const [breakthrough, setBreakthrough] = useState<string | null>(null);

  const handleToggleBinaural = () => {
    const active = audioEngine.toggleThetaBinaural();
    setBinauralActive(active);
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % ORACLE_QUOTES.length);
    audioEngine.playNodeBlip(900);
  };

  const handleAlchemize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jargonInput.trim()) return;
    const res = alchemizeJargon(jargonInput);
    setAlchemized(res);
    audioEngine.playEurekaChord();
  };

  const handleTriggerEureka = () => {
    audioEngine.playEurekaChord();
    
    // Laser confetti
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#ffffff']
    });

    const epiphanies = [
      'Breakthrough: The funnel is not a sieve; it is an alchemical crucible where customer attention is transmuted into equity capital.',
      'Breakthrough: Stop selling features to the conscious ego; sell symbolic immortality to the subconscious shadow.',
      'Breakthrough: By raising our contract floor by 10x, we simultaneously eliminate support friction and increase perceived authority.',
      'Breakthrough: The highest-converting ad is not an offer, but an ontological diagnosis that makes existing workflows feel barbaric.'
    ];

    setBreakthrough(epiphanies[Math.floor(Math.random() * epiphanies.length)]);
    setHermeticAura((prev) => Math.min(100, prev + 2));
    if (onAuraUpdate) onAuraUpdate(Math.min(100, hermeticAura + 2));
  };

  const handleCopyAlchemized = () => {
    navigator.clipboard.writeText(alchemized.esoteric);
    setCopied(true);
    audioEngine.playSynapticClick(1500);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070d] text-zinc-100 overflow-y-auto p-4 sm:p-6 font-mono-code space-y-6">
      {/* Top Banner & Eureka Trigger */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-zinc-950 to-emerald-950/40 border border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                Cognitive State Matrix // Visionary OS
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-display">
              Steve Jobs Reality Distortion Field & Aura Simulator
            </h2>
            <p className="text-xs text-zinc-400">
              Manipulate consensus reality parameters and synthesize visionary cognitive gravity.
            </p>
          </div>

          <button
            onClick={handleTriggerEureka}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 text-black font-bold uppercase tracking-wider text-xs shadow-xl shadow-amber-950/60 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>TRIGGER EUREKA! BREAKTHROUGH</span>
          </button>
        </div>

        {breakthrough && (
          <div className="mt-4 p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between animate-in fade-in">
            <span>✨ {breakthrough}</span>
            <button onClick={() => setBreakthrough(null)} className="text-amber-400 text-xs ml-2 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* Simulator Dials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dial 1: Reality Distortion */}
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Reality Distortion
            </span>
            <span className="font-mono text-amber-400 font-bold">{realityDistortion}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={realityDistortion}
            onChange={(e) => {
              setRealityDistortion(Number(e.target.value));
              audioEngine.playSynapticClick(800 + Number(e.target.value) * 6);
            }}
            className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500">
            Gravitational mass that pulls stakeholder consensus into your visionary frame.
          </p>
        </div>

        {/* Dial 2: Obscurity & Intellectual Density */}
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" /> Intellectual Density
            </span>
            <span className="font-mono text-emerald-400 font-bold">{obscurityIndex}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={obscurityIndex}
            onChange={(e) => {
              setObscurityIndex(Number(e.target.value));
              audioEngine.playSynapticClick(900 + Number(e.target.value) * 6);
            }}
            className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500">
            Replaces pedestrian corporate speech with high-entropy semiotic vocabulary.
          </p>
        </div>

        {/* Dial 3: Semio-Capitalist Momentum */}
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Semiotic Momentum
            </span>
            <span className="font-mono text-cyan-400 font-bold">{semioCapitalism}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={semioCapitalism}
            onChange={(e) => {
              setSemioCapitalism(Number(e.target.value));
              audioEngine.playSynapticClick(1000 + Number(e.target.value) * 6);
            }}
            className="w-full accent-cyan-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500">
            Detaches pricing from marginal production costs to capture pure aura premium.
          </p>
        </div>

        {/* Dial 4: Dopaminergic Flow */}
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Dopaminergic Rate
            </span>
            <span className="font-mono text-purple-400 font-bold">{dopamineRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={dopamineRate}
            onChange={(e) => {
              setDopamineRate(Number(e.target.value));
              audioEngine.playSynapticClick(1100 + Number(e.target.value) * 6);
            }}
            className="w-full accent-purple-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500">
            Paces intermittent variable rewards and notification dopamine spikes.
          </p>
        </div>

        {/* Dial 5: Hermetic Aura */}
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Hermetic Aura
            </span>
            <span className="font-mono text-pink-400 font-bold">{hermeticAura}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hermeticAura}
            onChange={(e) => {
              setHermeticAura(Number(e.target.value));
              audioEngine.playSynapticClick(1200 + Number(e.target.value) * 6);
              if (onAuraUpdate) onAuraUpdate(Number(e.target.value));
            }}
            className="w-full accent-pink-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500">
            Perceived existential exclusivity and monastic mystique.
          </p>
        </div>

        {/* Dial 6: Theta Wave Binaural Synthesizer */}
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> Theta Wave 6Hz Binaural
            </span>
            <span className={`font-mono font-bold ${binauralActive ? 'text-teal-400' : 'text-zinc-500'}`}>
              {binauralActive ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 my-2">
            Real-time stereo sine wave synthesizer pulsing at 6Hz delta-theta to induce deep visionary polymath trance.
          </p>

          <button
            onClick={handleToggleBinaural}
            className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
              binauralActive
                ? 'bg-teal-500 text-black shadow-lg shadow-teal-900/40'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
            }`}
          >
            {binauralActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{binauralActive ? 'Stop Theta Audio' : 'Ignite Theta Binaural (6Hz)'}</span>
          </button>
        </div>
      </div>

      {/* JARGON ALCHEMIZER (Genius Translator) */}
      <div className="p-5 rounded-xl bg-zinc-950/90 border border-emerald-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Genius Jargon Alchemizer & LARP Translator
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Input mundane speech → Output polymath lore</span>
        </div>

        <form onSubmit={handleAlchemize} className="space-y-3">
          <div>
            <label className="block text-zinc-400 text-xs uppercase font-bold mb-1">
              Ordinary Marketing / Business Thought:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={jargonInput}
                onChange={(e) => setJargonInput(e.target.value)}
                placeholder="e.g. Let's make a video ad to get clients, or our landing page needs higher conversions"
                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase flex items-center space-x-1 flex-shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Alchemize</span>
              </button>
            </div>
          </div>
        </form>

        {/* Output Box */}
        <div className="p-4 rounded-lg bg-zinc-900/90 border border-zinc-800 relative space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
              [TRANSMUTED POLYMATHIC PROSE]:
            </span>
            <button
              onClick={handleCopyAlchemized}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-xs text-zinc-100 font-mono leading-relaxed bg-black/40 p-3 rounded border border-zinc-800/80">
            "{alchemized.esoteric}"
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-zinc-500">
            <span>Framework: <strong className="text-zinc-300">{alchemized.framework}</strong></span>
            <span>Axiom: <em className="text-zinc-400">{alchemized.keyAxiom}</em></span>
          </div>
        </div>
      </div>

      {/* Polymath Oracle Axiom Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-display">
              Polymath Oracle Axiom #{quoteIndex + 1}
            </h3>
          </div>
          <button
            onClick={handleNextQuote}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] border border-zinc-700 transition-colors"
          >
            <RotateCw className="w-3 h-3" />
            <span>Consult Oracle</span>
          </button>
        </div>

        <blockquote className="text-sm font-serif italic text-zinc-200 leading-relaxed pl-3 border-l-2 border-purple-500/60">
          "{activeQuote.quote}"
        </blockquote>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-xs">
          <div>
            <span className="font-bold text-purple-400">{activeQuote.polymath}</span>
            <span className="text-zinc-500 text-[10px] ml-2">({activeQuote.eraOrDiscipline})</span>
          </div>

          <div className="text-[10px] text-zinc-400">
            Tactical: <span className="text-zinc-200">{activeQuote.tacticalRelevance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
