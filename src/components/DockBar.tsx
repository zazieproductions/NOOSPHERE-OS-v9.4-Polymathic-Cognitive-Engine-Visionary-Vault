import React from 'react';
import { WindowId, WindowState } from '../types';
import { audioEngine } from '../services/audioEngine';
import { 
  Network, 
  BookOpen, 
  Zap, 
  Sliders, 
  Palette, 
  GitBranch, 
  Terminal, 
  Sparkles,
  Flame
} from 'lucide-react';

interface DockBarProps {
  windows: Record<WindowId, WindowState>;
  onToggleWindow: (id: WindowId) => void;
  onTriggerEureka: () => void;
}

export const DockBar: React.FC<DockBarProps> = ({
  windows,
  onToggleWindow,
  onTriggerEureka
}) => {
  const dockItems: { id: WindowId; label: string; icon: React.ReactNode; color: string; subtitle: string }[] = [
    {
      id: 'graph',
      label: 'Neural Graph',
      subtitle: 'Obsidian Multi-Vault',
      icon: <Network className="w-4 h-4" />,
      color: 'text-emerald-400',
    },
    {
      id: 'vault',
      label: 'Notes Vault',
      subtitle: 'Epistemic Archives',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'text-cyan-400',
    },
    {
      id: 'synthesizer',
      label: 'Idea Collider',
      subtitle: 'Polymath Reactor',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-amber-400',
    },
    {
      id: 'distortion',
      label: 'Distortion Field',
      subtitle: 'LARP Aura Deck',
      icon: <Sliders className="w-4 h-4" />,
      color: 'text-purple-400',
    },
    {
      id: 'chromatic',
      label: 'Hex Lab',
      subtitle: 'Retinal Dominance',
      icon: <Palette className="w-4 h-4" />,
      color: 'text-pink-400',
    },
    {
      id: 'chronotope',
      label: 'The Chronotope',
      subtitle: 'Hyperstition Matrix',
      icon: <GitBranch className="w-4 h-4" />,
      color: 'text-indigo-400',
    },
    {
      id: 'terminal',
      label: 'Terminal Shell',
      subtitle: 'synapse-cli',
      icon: <Terminal className="w-4 h-4" />,
      color: 'text-emerald-300',
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] select-none">
      <div className="px-3 py-2 rounded-2xl glass-panel glass-glow-emerald border border-zinc-700/60 shadow-2xl flex items-center space-x-1 sm:space-x-2 backdrop-blur-2xl">
        {dockItems.map((item) => {
          const win = windows[item.id];
          const isOpen = win?.isOpen && !win?.isMinimized;
          const isMinimized = win?.isOpen && win?.isMinimized;

          return (
            <button
              key={item.id}
              onClick={() => {
                audioEngine.playNodeBlip(850);
                onToggleWindow(item.id);
              }}
              className={`group relative p-2 sm:p-2.5 rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1 ${
                isOpen
                  ? 'bg-zinc-800/90 shadow-md border border-zinc-600/60 text-zinc-100 ring-1 ring-emerald-500/40'
                  : 'bg-zinc-900/60 border border-transparent hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`${item.color} transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>

              {/* Status Dot */}
              <div className="mt-1 flex items-center justify-center">
                {isOpen ? (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                ) : isMinimized ? (
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-transparent" />
                )}
              </div>

              {/* High-Tech Cyber Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 transform scale-95 group-hover:scale-100 z-50">
                <div className="px-2.5 py-1 rounded bg-zinc-950/95 border border-zinc-700 text-center shadow-xl whitespace-nowrap">
                  <div className="text-[10px] font-mono-code font-bold text-zinc-100 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-[8px] font-mono-code text-zinc-500">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-800 mx-1" />

        {/* Eureka Breakthrough Instant Button */}
        <button
          onClick={() => {
            audioEngine.playEurekaChord();
            onTriggerEureka();
          }}
          title="Trigger Eureka! Epiphany"
          className="group relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-amber-600/30 to-emerald-600/30 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white transition-all hover:-translate-y-1 shadow-lg shadow-amber-950/40 flex items-center justify-center"
        >
          <Flame className="w-4 h-4 animate-pulse group-hover:scale-125 transition-transform" />
          
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 transform scale-95 group-hover:scale-100 z-50">
            <div className="px-2 py-0.5 rounded bg-zinc-950 border border-amber-500 text-[9px] font-mono-code font-bold text-amber-400 shadow-xl whitespace-nowrap uppercase">
              ✨ Eureka! Epiphany
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
