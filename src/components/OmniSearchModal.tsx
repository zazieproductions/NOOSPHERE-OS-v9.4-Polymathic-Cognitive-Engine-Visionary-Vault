import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_GRAPH_NODES } from '../data/graphNodes';
import { VAULT_NOTES } from '../data/vaultNotes';
import { CHROMATIC_PALETTES } from '../data/palettes';
import { audioEngine } from '../services/audioEngine';
import { 
  Search, 
  Network, 
  BookOpen, 
  Palette, 
  Terminal, 
  Zap, 
  ArrowRight,
  Flame,
  Radio,
  Sliders
} from 'lucide-react';

interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (node: any) => void;
  onSelectNote: (noteId: string) => void;
  onSelectPalette: () => void;
  onOpenWindow: (id: any) => void;
  onTriggerEureka: () => void;
}

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNode,
  onSelectNote,
  onSelectPalette,
  onOpenWindow,
  onTriggerEureka
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown for Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search results
  const q = query.toLowerCase();

  const nodeResults = INITIAL_GRAPH_NODES.filter(n =>
    !q || n.label.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4);

  const noteResults = VAULT_NOTES.filter(n =>
    !q || n.title.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4);

  const paletteResults = CHROMATIC_PALETTES.filter(p =>
    !q || p.name.toLowerCase().includes(q) || p.archetype.toLowerCase().includes(q)
  ).slice(0, 2);

  const commandItems = [
    {
      id: 'cmd-eureka',
      title: 'Trigger Eureka! Breakthrough Epiphany',
      category: 'Command',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      action: () => {
        onTriggerEureka();
        onClose();
      }
    },
    {
      id: 'cmd-binaural',
      title: 'Toggle 6Hz Theta Brainwave Audio',
      category: 'Command',
      icon: <Radio className="w-4 h-4 text-teal-400" />,
      action: () => {
        audioEngine.toggleThetaBinaural();
        onClose();
      }
    },
    {
      id: 'cmd-synthesizer',
      title: 'Open Concept Collider & Synthesis Reactor',
      category: 'Navigation',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => {
        onOpenWindow('synthesizer');
        onClose();
      }
    },
    {
      id: 'cmd-terminal',
      title: 'Open synapse-cli Terminal Shell',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onOpenWindow('terminal');
        onClose();
      }
    }
  ].filter(c => !q || c.title.toLowerCase().includes(q));

  const allItems = [
    ...commandItems.map(c => ({ type: 'command' as const, data: c })),
    ...nodeResults.map(n => ({ type: 'node' as const, data: n })),
    ...noteResults.map(n => ({ type: 'note' as const, data: n })),
    ...paletteResults.map(p => ({ type: 'palette' as const, data: p })),
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-md p-4 animate-in fade-in select-none font-mono-code"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl glass-panel glass-glow-emerald border border-zinc-700 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/90 gap-3">
          <Search className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all 80+ neural concepts, vault notes, commands..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No matching polymathic concepts found in noosphere.
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              if (item.type === 'command') {
                return (
                  <div
                    key={item.data.id}
                    onClick={item.data.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-emerald-950/50 border border-emerald-500/40 text-white' : 'hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      {item.data.icon}
                      <span className="font-semibold truncate">{item.data.title}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-900">
                      {item.data.category}
                    </span>
                  </div>
                );
              }

              if (item.type === 'node') {
                return (
                  <div
                    key={item.data.id}
                    onClick={() => {
                      onSelectNode(item.data);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-emerald-950/50 border border-emerald-500/40 text-white' : 'hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Network className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-zinc-100">{item.data.label}</span>
                        <span className="text-[10px] text-zinc-400 ml-2 truncate">
                          {item.data.summary}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/60 flex-shrink-0">
                      {item.data.category}
                    </span>
                  </div>
                );
              }

              if (item.type === 'note') {
                return (
                  <div
                    key={item.data.id}
                    onClick={() => {
                      onSelectNote(item.data.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-cyan-950/50 border border-cyan-500/40 text-white' : 'hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-zinc-100">{item.data.title}</span>
                        <span className="text-[10px] text-zinc-400 ml-2">
                          {item.data.readTime}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-zinc-500 flex-shrink-0">
                      Density: {item.data.cognitiveDensity}%
                    </span>
                  </div>
                );
              }

              if (item.type === 'palette') {
                return (
                  <div
                    key={item.data.id}
                    onClick={() => {
                      onSelectPalette();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-pink-950/50 border border-pink-500/40 text-white' : 'hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Palette className="w-4 h-4 text-pink-400 flex-shrink-0" />
                      <span className="font-bold">{item.data.name}</span>
                    </div>
                    <div className="flex h-2 w-16 rounded overflow-hidden">
                      {item.data.colors.map((c: any, i: number) => (
                        <div key={i} style={{ backgroundColor: c.hex }} className="flex-1" />
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-950 text-[10px] text-zinc-500 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>NOOSPHERE OMNI-INDEX v9.4</span>
        </div>
      </div>
    </div>
  );
};
