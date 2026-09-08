import React, { useState, useRef, useEffect } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { ORACLE_QUOTES } from '../../data/oracleQuotes';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const TerminalView: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: '1', type: 'system', text: 'NOOSPHERE-OS v9.4 [SYNAPSE KERNEL 6.12.0-polymath]' },
    { id: '2', type: 'system', text: 'All cognitive systems nominal. Quantum entropy buffer: 0.94 bits/symbol.' },
    { id: '3', type: 'system', text: 'Type "help" to view available polymathic subroutines.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    audioEngine.playSynapticClick(1000);
    const newHistory: TerminalLine[] = [
      ...history,
      { id: `${Date.now()}-in`, type: 'input', text: `$ ${cmd}` },
    ];

    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help': {
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          text: `AVAILABLE COMMANDS:
  help              - Display this cognitive command registry
  stats / status    - View live neural telemetry and entropy load
  eureka            - Trigger instant epiphany breakthrough & Solfeggio chord
  quote             - Consult the Polymath Oracle for esoteric axioms
  binaural          - Toggle 6Hz theta brainwave audio generator
  scan-noosphere    - Scan collective digital mindshare for latent alpha
  matrix            - Stream raw green phosphor synaptic data
  clear             - Flush terminal output buffer
  exit              - Minimize terminal window`,
        });
        break;
      }

      case 'stats':
      case 'status': {
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'success',
          text: `NOOSPHERE COGNITIVE TELEMETRY:
  ├── Reality Distortion Index : 94.8% (Maximum Gravitational Pull)
  ├── Active Synaptic Nodes    : 84 Nodes / 192 Bi-directional Edges
  ├── Information Entropy (H)  : 0.96 bits/sym (Cliché rate: 0.00%)
  ├── Theta Wave Phase         : 6.0 Hz Solfeggio Coherence
  └── Autopoietic Velocity     : 8.4x Compound Expansion`,
        });
        break;
      }

      case 'eureka': {
        audioEngine.playEurekaChord();
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'success',
          text: `✨ [EUREKA TRANSMISSION]: "When you price at the 99th percentile and disqualify 94% of applicants, the purchase ceases to be a commercial exchange and becomes an alchemical transformation."`,
        });
        break;
      }

      case 'quote': {
        const randomQuote = ORACLE_QUOTES[Math.floor(Math.random() * ORACLE_QUOTES.length)];
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          text: `[${randomQuote.polymath} // ${randomQuote.eraOrDiscipline}]:
"${randomQuote.quote}"
Tactical: ${randomQuote.tacticalRelevance}`,
        });
        break;
      }

      case 'binaural': {
        const active = audioEngine.toggleThetaBinaural();
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'success',
          text: `Theta Wave Binaural Beat (6Hz / 216Hz carrier) => ${active ? 'ONLINE (Generating Coherence)' : 'STANDBY'}`,
        });
        break;
      }

      case 'scan-noosphere': {
        audioEngine.playNodeBlip(1200);
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          text: `Scanning global semantic manifolds...
[FOUND]: 3 high-entropy keyword clusters with 0.02% advertiser competition.
[SIGNAL]: "Deleuzian B2B Retention" trending in Silicon Valley founder circles.
[ALPHA]: Ready to deploy hyperstitional narrative seed.`,
        });
        break;
      }

      case 'matrix': {
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          text: `01001110 01001111 01001111 01010011 01010000 01001000 01000101 01010010 01000101
Ψ(x,t) = Ae^(i(kx - ωt)) ─── [QUANTUM CONVERGENCE ACHIEVED]
10101010 11110000 00001111 11001100 10101010 01010101 11111111`,
        });
        break;
      }

      case 'clear': {
        setHistory([]);
        setInput('');
        return;
      }

      default: {
        newHistory.push({
          id: `${Date.now()}-err`,
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for valid subroutines.`,
        });
        break;
      }
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030406] text-zinc-200 p-3 sm:p-4 font-mono text-xs overflow-hidden select-text">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[10px] text-zinc-500">
        <div className="flex items-center space-x-1.5 text-emerald-400">
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>synapse-shell v9.4 (x86_64-noosphere)</span>
        </div>
        <span>UTF-8 // SECURE CHANNEL</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] leading-relaxed">
        {history.map(line => {
          let style = 'text-zinc-300';
          if (line.type === 'input') style = 'text-emerald-400 font-bold';
          if (line.type === 'system') style = 'text-cyan-400';
          if (line.type === 'success')
            style = 'text-emerald-300 bg-emerald-950/20 p-2 rounded border border-emerald-500/20';
          if (line.type === 'error') style = 'text-rose-400';

          return (
            <div key={line.id} className={`whitespace-pre-wrap ${style}`}>
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center gap-2">
        <span className="text-emerald-400 font-bold select-none">$</span>
        <input
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            audioEngine.playSynapticClick(1400);
          }}
          placeholder="type command (e.g. 'help', 'stats', 'eureka', 'quote')..."
          className="flex-1 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none placeholder-zinc-600"
          autoFocus
        />
      </form>
    </div>
  );
};
