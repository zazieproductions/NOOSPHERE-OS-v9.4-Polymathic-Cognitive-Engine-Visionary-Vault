import React, { useState, useEffect } from 'react';
import { OSTheme, WallpaperMode, WorkspacePreset } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Radio, 
  Search, 
  Sliders, 
  Layers, 
  Maximize2, 
  Clock, 
  Activity, 
  Monitor,
  Flame
} from 'lucide-react';

interface TopStatusBarProps {
  onOpenSearch: () => void;
  wallpaperMode: WallpaperMode;
  onSelectWallpaper: (mode: WallpaperMode) => void;
  activePreset: WorkspacePreset;
  onSelectPreset: (preset: WorkspacePreset) => void;
  onOpenWindow: (id: any) => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  onOpenSearch,
  wallpaperMode,
  onSelectWallpaper,
  activePreset,
  onSelectPreset,
  onOpenWindow
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(audioEngine.getMuted());
  const [binauralActive, setBinauralActive] = useState(audioEngine.getBinauralActive());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    audioEngine.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) audioEngine.playNodeBlip(1000);
  };

  const handleToggleBinaural = () => {
    const active = audioEngine.toggleThetaBinaural();
    setBinauralActive(active);
  };

  return (
    <header className="h-10 w-full bg-[#05060a]/90 backdrop-blur-md border-b border-zinc-800/80 px-3 flex items-center justify-between text-xs font-mono-code z-40 select-none flex-shrink-0">
      {/* Left: Branding & Core Telemetry */}
      <div className="flex items-center space-x-3">
        {/* Sacred Geometry OS Logo */}
        <div 
          onClick={() => {
            audioEngine.playEurekaChord();
            onOpenWindow('distortion');
          }}
          className="flex items-center space-x-2 cursor-pointer group"
          title="Noosphere Cognitive OS v9.4"
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-emerald-600 via-cyan-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:rotate-12 transition-transform">
            <div className="w-full h-full bg-[#07090e] rounded-[3px] flex items-center justify-center">
              <span className="text-[10px] text-emerald-400 font-bold">Ψ</span>
            </div>
          </div>
          <span className="font-display font-extrabold text-zinc-100 tracking-wider text-xs hidden sm:inline">
            NOOSPHERE<span className="text-emerald-400">-OS</span>
          </span>
          <span className="text-[9px] text-zinc-500 hidden md:inline border border-zinc-800 rounded px-1">
            v9.4
          </span>
        </div>

        {/* Live System Metrics Badges */}
        <div className="hidden lg:flex items-center space-x-2 text-[10px]">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Entropy: <strong className="text-emerald-400">0.96 H</strong></span>
          </div>

          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span>Synaptic Load: <strong className="text-cyan-400">87.4%</strong></span>
          </div>

          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span>Reality Distortion: <strong className="text-amber-400">Active</strong></span>
          </div>
        </div>
      </div>

      {/* Center: Command Palette Trigger & Presets */}
      <div className="flex items-center space-x-2">
        {/* Omni Search Button */}
        <button
          onClick={() => {
            audioEngine.playNodeBlip(1100);
            onOpenSearch();
          }}
          className="flex items-center space-x-2 px-3 py-1 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all text-xs"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] hidden sm:inline">Command Palette</span>
          <kbd className="hidden md:inline text-[9px] bg-zinc-950 border border-zinc-700 px-1.5 py-0.2 rounded text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Workspace Layouts dropdown */}
        <div className="hidden sm:flex items-center space-x-1">
          <Layers className="w-3 h-3 text-zinc-500" />
          <select
            value={activePreset}
            onChange={(e) => {
              onSelectPreset(e.target.value as WorkspacePreset);
              audioEngine.playSynapticClick(900);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-[10px] text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="grandMatrix">Preset: Polymath Deck</option>
            <option value="deepGraph">Preset: Deep Obsidian Graph</option>
            <option value="synthesisStudio">Preset: Synthesis Reactor</option>
            <option value="zenReader">Preset: Zen Vault</option>
            <option value="commandDeck">Preset: Command Terminal</option>
          </select>
        </div>
      </div>

      {/* Right: Audio Dials, Wallpaper, Clock */}
      <div className="flex items-center space-x-2 text-xs">
        {/* Theta Binaural Toggle */}
        <button
          onClick={handleToggleBinaural}
          title={binauralActive ? "Stop 6Hz Theta Waves" : "Start 6Hz Theta Brainwave Audio"}
          className={`px-2 py-0.5 rounded flex items-center space-x-1 text-[10px] transition-all border ${
            binauralActive
              ? 'bg-teal-500/20 text-teal-400 border-teal-500/50 shadow-sm shadow-teal-500/20 animate-pulse'
              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
        >
          <Radio className="w-3 h-3" />
          <span className="hidden md:inline">6Hz Theta</span>
        </button>

        {/* Master Audio Toggle */}
        <button
          onClick={handleToggleMute}
          title={isMuted ? "Unmute Audio Engine" : "Mute Audio Engine"}
          className={`p-1 rounded border transition-colors ${
            isMuted ? 'bg-zinc-900 text-zinc-600 border-zinc-800' : 'bg-zinc-900 text-emerald-400 border-zinc-800 hover:border-emerald-500/50'
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Wallpaper background switcher */}
        <div className="hidden md:flex items-center space-x-1">
          <Monitor className="w-3 h-3 text-zinc-500" />
          <select
            value={wallpaperMode}
            onChange={(e) => {
              onSelectWallpaper(e.target.value as WallpaperMode);
              audioEngine.playSynapticClick(700);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-400 focus:outline-none"
          >
            <option value="neural">Wallpaper: Neural Constellation</option>
            <option value="matrixRain">Wallpaper: Matrix Rain</option>
            <option value="cyberGrid">Wallpaper: Cyber Grid</option>
            <option value="topological">Wallpaper: Topological</option>
            <option value="deepVoid">Wallpaper: Deep Void</option>
          </select>
        </div>

        {/* Clock */}
        <div className="flex items-center space-x-1 text-zinc-400 px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 font-mono text-[10px]">
          <Clock className="w-2.5 h-2.5 text-zinc-500" />
          <span>{timeStr || '12:00:00'}</span>
        </div>
      </div>
    </header>
  );
};
