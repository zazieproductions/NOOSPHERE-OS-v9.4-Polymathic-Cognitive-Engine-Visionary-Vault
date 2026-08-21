import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { WindowId, WindowState, WorkspacePreset, WallpaperMode, GraphNode, VaultNote } from '../types';
import { INITIAL_GRAPH_NODES } from '../data/graphNodes';
import { VAULT_NOTES } from '../data/vaultNotes';
import { audioEngine } from '../services/audioEngine';

import { WallpaperCanvas } from './WallpaperCanvas';
import { TopStatusBar } from './TopStatusBar';
import { DockBar } from './DockBar';
import { WindowFrame } from './WindowFrame';
import { OmniSearchModal } from './OmniSearchModal';

import { NeuralGraphView } from './NeuralGraphView';
import { VaultNotesView } from './VaultNotesView';
import { IdeaSynthesizerView } from './IdeaSynthesizerView';
import { RealityDistortionView } from './RealityDistortionView';
import { HexChromaticLab } from './HexChromaticLab';
import { ChronotopeTimelineView } from './ChronotopeTimelineView';
import { TerminalView } from './TerminalView';

export const DesktopOS: React.FC = () => {
  const [topZIndex, setTopZIndex] = useState(10);
  const [wallpaperMode, setWallpaperMode] = useState<WallpaperMode>('neural');
  const [activePreset, setActivePreset] = useState<WorkspacePreset>('grandMatrix');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Cross-window shared states
  const [synthesizerNodes, setSynthesizerNodes] = useState<GraphNode[]>([
    INITIAL_GRAPH_NODES[0],
    INITIAL_GRAPH_NODES[5],
    INITIAL_GRAPH_NODES[16]
  ]);
  const [activeVaultNoteId, setActiveVaultNoteId] = useState<string>(VAULT_NOTES[0].id);

  // Initial Window Layout
  const initialWindows: Record<WindowId, WindowState> = {
    graph: {
      id: 'graph',
      title: 'Neural Graph // Obsidian Multi-Vault',
      subtitle: '80+ Synaptic Concepts',
      icon: 'Network',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 30, y: 55 },
      size: { width: Math.min(window.innerWidth - 60, 780), height: 560 },
      zIndex: 5,
      badge: 'LIVE SYNAPSE',
    },
    vault: {
      id: 'vault',
      title: 'Notes Vault // Epistemic Archives',
      subtitle: 'Markdown & Backlinks',
      icon: 'BookOpen',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: Math.max(40, window.innerWidth - 820), y: 70 },
      size: { width: Math.min(window.innerWidth - 60, 760), height: 540 },
      zIndex: 6,
    },
    synthesizer: {
      id: 'synthesizer',
      title: 'Idea Collider // Polymath Synthesis Reactor',
      subtitle: 'Ontological Combinatorics',
      icon: 'Zap',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 120, y: 90 },
      size: { width: Math.min(window.innerWidth - 80, 860), height: 580 },
      zIndex: 7,
      badge: 'REACTOR READY',
    },
    distortion: {
      id: 'distortion',
      title: 'Reality Distortion Field & LARP Simulator',
      subtitle: 'Steve Jobs Prescience Matrix',
      icon: 'Sliders',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 180, y: 110 },
      size: { width: Math.min(window.innerWidth - 90, 800), height: 550 },
      zIndex: 4,
    },
    chromatic: {
      id: 'chromatic',
      title: 'Hex Chromatic Lab // Retinal Dominance',
      subtitle: 'OLED Wavelengths',
      icon: 'Palette',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 220, y: 130 },
      size: { width: Math.min(window.innerWidth - 90, 780), height: 520 },
      zIndex: 3,
    },
    chronotope: {
      id: 'chronotope',
      title: 'The Chronotope // Hyperstition Campaign Matrix',
      subtitle: 'Dimensional Velocity',
      icon: 'GitBranch',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 160, y: 100 },
      size: { width: Math.min(window.innerWidth - 90, 820), height: 540 },
      zIndex: 2,
    },
    terminal: {
      id: 'terminal',
      title: 'synapse-cli // Noosphere Terminal Shell',
      subtitle: 'x86_64-noosphere',
      icon: 'Terminal',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100, y: 140 },
      size: { width: Math.min(window.innerWidth - 90, 680), height: 420 },
      zIndex: 8,
    },
    oracle: {
      id: 'oracle',
      title: 'Polymath Oracle',
      icon: 'Sparkles',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 250, y: 120 },
      size: { width: 500, height: 400 },
      zIndex: 1,
    },
    audioLab: {
      id: 'audioLab',
      title: 'Audio Synthesizer Lab',
      icon: 'Radio',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 300, y: 150 },
      size: { width: 450, height: 350 },
      zIndex: 1,
    },
    settings: {
      id: 'settings',
      title: 'OS Settings',
      icon: 'Sliders',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 320, y: 160 },
      size: { width: 450, height: 350 },
      zIndex: 1,
    }
  };

  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindows);

  // Bring window to front
  const focusWindow = useCallback((id: WindowId) => {
    setTopZIndex((prevZ) => {
      const nextZ = prevZ + 1;
      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      }));
      return nextZ;
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const toggleMaximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win.isOpen) {
        return {
          ...prev,
          [id]: { ...win, isOpen: true, isMinimized: false, zIndex: topZIndex + 1 },
        };
      } else if (win.isMinimized) {
        return {
          ...prev,
          [id]: { ...win, isMinimized: false, zIndex: topZIndex + 1 },
        };
      } else {
        return {
          ...prev,
          [id]: { ...win, isMinimized: true },
        };
      }
    });
    setTopZIndex((z) => z + 1);
  }, [topZIndex]);

  const updatePosition = useCallback((id: WindowId, pos: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], position: pos },
    }));
  }, []);

  const updateSize = useCallback((id: WindowId, size: { width: number; height: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], size },
    }));
  }, []);

  // Presets Application
  const applyPreset = useCallback((preset: WorkspacePreset) => {
    setActivePreset(preset);
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    setWindows((prev) => {
      const updated = { ...prev };

      // Hide all first
      Object.keys(updated).forEach((k) => {
        updated[k as WindowId] = { ...updated[k as WindowId], isOpen: false, isMaximized: false };
      });

      if (preset === 'grandMatrix') {
        // Graph left, Notes right
        updated.graph = {
          ...updated.graph,
          isOpen: true,
          isMinimized: false,
          position: { x: 20, y: 50 },
          size: { width: Math.floor(screenW * 0.48), height: screenH - 140 },
          zIndex: 10,
        };
        updated.vault = {
          ...updated.vault,
          isOpen: true,
          isMinimized: false,
          position: { x: Math.floor(screenW * 0.51), y: 50 },
          size: { width: Math.floor(screenW * 0.46), height: screenH - 140 },
          zIndex: 11,
        };
      } else if (preset === 'deepGraph') {
        updated.graph = {
          ...updated.graph,
          isOpen: true,
          isMinimized: false,
          isMaximized: true,
          zIndex: 15,
        };
      } else if (preset === 'synthesisStudio') {
        updated.synthesizer = {
          ...updated.synthesizer,
          isOpen: true,
          isMinimized: false,
          position: { x: 30, y: 50 },
          size: { width: Math.floor(screenW * 0.55), height: screenH - 140 },
          zIndex: 12,
        };
        updated.vault = {
          ...updated.vault,
          isOpen: true,
          isMinimized: false,
          position: { x: Math.floor(screenW * 0.59), y: 50 },
          size: { width: Math.floor(screenW * 0.38), height: screenH - 140 },
          zIndex: 11,
        };
      } else if (preset === 'zenReader') {
        updated.vault = {
          ...updated.vault,
          isOpen: true,
          isMinimized: false,
          position: { x: Math.max(20, Math.floor((screenW - 900) / 2)), y: 50 },
          size: { width: Math.min(900, screenW - 40), height: screenH - 130 },
          zIndex: 15,
        };
      } else if (preset === 'commandDeck') {
        updated.terminal = {
          ...updated.terminal,
          isOpen: true,
          isMinimized: false,
          position: { x: 30, y: 50 },
          size: { width: Math.floor(screenW * 0.46), height: screenH - 140 },
          zIndex: 14,
        };
        updated.chronotope = {
          ...updated.chronotope,
          isOpen: true,
          isMinimized: false,
          position: { x: Math.floor(screenW * 0.49), y: 50 },
          size: { width: Math.floor(screenW * 0.48), height: Math.floor((screenH - 140) * 0.55) },
          zIndex: 12,
        };
        updated.distortion = {
          ...updated.distortion,
          isOpen: true,
          isMinimized: false,
          position: { x: Math.floor(screenW * 0.49), y: Math.floor((screenH - 140) * 0.58) + 50 },
          size: { width: Math.floor(screenW * 0.48), height: Math.floor((screenH - 140) * 0.42) },
          zIndex: 13,
        };
      }

      return updated;
    });
  }, []);

  // Send concept from graph to synthesizer
  const handleSelectNodeForSynthesis = (node: GraphNode) => {
    setSynthesizerNodes((prev) => {
      if (prev.some(n => n.id === node.id)) return prev;
      return [...prev.slice(0, 3), node];
    });
    focusWindow('synthesizer');
    audioEngine.playEurekaChord();
  };

  // Open note from graph or wikilink
  const handleOpenVaultNote = (nodeId: string) => {
    const matchedNote = VAULT_NOTES.find(n => n.relatedNodeId === nodeId || n.id === nodeId);
    if (matchedNote) {
      setActiveVaultNoteId(matchedNote.id);
    }
    focusWindow('vault');
  };

  // Global Eureka breakthrough
  const handleTriggerEureka = () => {
    audioEngine.playEurekaChord();
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6']
    });
    focusWindow('distortion');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608] select-none font-mono-code flex flex-col">
      {/* Dynamic Interactive Animated Wallpaper Canvas */}
      <WallpaperCanvas mode={wallpaperMode} />

      {/* Top Status Bar with Live Telemetry */}
      <TopStatusBar
        onOpenSearch={() => setIsSearchOpen(true)}
        wallpaperMode={wallpaperMode}
        onSelectWallpaper={setWallpaperMode}
        activePreset={activePreset}
        onSelectPreset={applyPreset}
        onOpenWindow={focusWindow}
      />

      {/* OS Desktop Workspace Area */}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {/* Window 1: Neural Graph View */}
        <WindowFrame
          window={windows.graph}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
        >
          <NeuralGraphView
            onSelectNodeForSynthesis={handleSelectNodeForSynthesis}
            onOpenVaultNote={handleOpenVaultNote}
          />
        </WindowFrame>

        {/* Window 2: Notes Vault */}
        <WindowFrame
          window={windows.vault}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
        >
          <VaultNotesView
            initialNoteId={activeVaultNoteId}
            onJumpToNode={(nodeId) => {
              focusWindow('graph');
            }}
            onSynthesizeFromNote={(note) => {
              focusWindow('synthesizer');
            }}
          />
        </WindowFrame>

        {/* Window 3: Idea Synthesizer / Concept Collider */}
        <WindowFrame
          window={windows.synthesizer}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
        >
          <IdeaSynthesizerView initialNodes={synthesizerNodes} />
        </WindowFrame>

        {/* Window 4: Reality Distortion & LARP Simulator */}
        <WindowFrame
          window={windows.distortion}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
        >
          <RealityDistortionView />
        </WindowFrame>

        {/* Window 5: Hex Chromatic Lab */}
        <WindowFrame
          window={windows.chromatic}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
        >
          <HexChromaticLab />
        </WindowFrame>

        {/* Window 6: The Chronotope Campaign Timeline */}
        <WindowFrame
          window={windows.chronotope}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
        >
          <ChronotopeTimelineView />
        </WindowFrame>

        {/* Window 7: synapse-cli Terminal */}
        <WindowFrame
          window={windows.terminal}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
        >
          <TerminalView />
        </WindowFrame>
      </main>

      {/* Floating Bottom Dock Bar */}
      <DockBar
        windows={windows}
        onToggleWindow={toggleWindow}
        onTriggerEureka={handleTriggerEureka}
      />

      {/* Omni-Search Cmd+K Command Palette */}
      <OmniSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNode={(node) => {
          handleSelectNodeForSynthesis(node);
        }}
        onSelectNote={(noteId) => {
          setActiveVaultNoteId(noteId);
          focusWindow('vault');
        }}
        onSelectPalette={() => {
          focusWindow('chromatic');
        }}
        onOpenWindow={(id) => {
          focusWindow(id);
        }}
        onTriggerEureka={handleTriggerEureka}
      />
    </div>
  );
};
