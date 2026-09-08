import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WindowState } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { 
  Minus, 
  Square, 
  X, 
  Maximize2, 
  Sparkles,
  Move
} from 'lucide-react';

interface WindowFrameProps {
  window: WindowState;
  onClose: (id: WindowState['id']) => void;
  onMinimize: (id: WindowState['id']) => void;
  onMaximize: (id: WindowState['id']) => void;
  onFocus: (id: WindowState['id']) => void;
  onUpdatePosition: (id: WindowState['id'], pos: { x: number; y: number }) => void;
  onUpdateSize: (id: WindowState['id'], size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return; // Ignore buttons
    onFocus(win.id);
    audioEngine.playSynapticClick(900);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: win.position.x,
      posY: win.position.y
    };
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (win.isMaximized) return;
    onFocus(win.id);
    audioEngine.playSynapticClick(1400);
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: win.size.width,
      height: win.size.height
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      const newX = Math.max(10, Math.min(window.innerWidth - 120, dragStartRef.current.posX + deltaX));
      const newY = Math.max(40, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY));
      onUpdatePosition(win.id, { x: newX, y: newY });
    } else if (isResizing) {
      const deltaW = e.clientX - resizeStartRef.current.mouseX;
      const deltaH = e.clientY - resizeStartRef.current.mouseY;
      const newW = Math.max(380, Math.min(window.innerWidth - 40, resizeStartRef.current.width + deltaW));
      const newH = Math.max(260, Math.min(window.innerHeight - 100, resizeStartRef.current.height + deltaH));
      onUpdateSize(win.id, { width: newW, height: newH });
    }
  }, [isDragging, isResizing, win.id, onUpdatePosition, onUpdateSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  // Position and sizing calculations
  const style: React.CSSProperties = win.isMaximized
    ? {
        top: '40px',
        left: '0px',
        width: '100vw',
        height: 'calc(100vh - 90px)',
        zIndex: win.zIndex,
      }
    : {
        top: `${win.position.y}px`,
        left: `${win.position.x}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onClick={() => onFocus(win.id)}
      className={`fixed flex flex-col rounded-lg border transition-shadow duration-200 overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing ring-1 ring-emerald-500/50 opacity-95' : ''
      } ${
        win.zIndex > 20
          ? 'border-emerald-500/30 bg-[#070a12]/92 backdrop-blur-xl shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-500/20'
          : 'border-zinc-800/80 bg-[#070a12]/85 backdrop-blur-lg shadow-xl'
      }`}
    >
      {/* Window Title Bar */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-zinc-900/95 via-zinc-900/80 to-zinc-950/95 border-b border-zinc-800/80 cursor-grab active:cursor-grabbing"
      >
        {/* Left: Window Title & Badges */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="text-emerald-400 text-sm flex items-center justify-center">
            {win.icon === 'Sparkles' ? <Sparkles className="w-3.5 h-3.5" /> : <Move className="w-3.5 h-3.5 text-zinc-400" />}
          </span>
          <div className="flex items-baseline space-x-2 truncate">
            <h3 className="text-xs font-mono-code font-bold tracking-wider text-zinc-100 uppercase truncate">
              {win.title}
            </h3>
            {win.subtitle && (
              <span className="hidden sm:inline-block text-[10px] font-mono-code text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.2">
                {win.subtitle}
              </span>
            )}
          </div>
          {win.badge && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono-code font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
              {win.badge}
            </span>
          )}
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center space-x-1.5 ml-3 flex-shrink-0">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playSynapticClick(600);
              onMinimize(win.id);
            }}
            title="Minimize to Dock"
            className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playSynapticClick(850);
              onMaximize(win.id);
            }}
            title={win.isMaximized ? "Restore Window" : "Maximize Window"}
            className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
          >
            {win.isMaximized ? <Maximize2 className="w-2.5 h-2.5" /> : <Square className="w-2.5 h-2.5" />}
          </button>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playSynapticClick(450);
              onClose(win.id);
            }}
            title="Close Section"
            className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-transparent relative flex flex-col">
        {children}
      </div>

      {/* Bottom Status Edge / Resizer Handle */}
      {!win.isMaximized && (
        <div className="h-2 w-full bg-zinc-950/80 border-t border-zinc-900/60 flex items-center justify-between px-2 cursor-default select-none">
          <div className="text-[8px] font-mono-code text-zinc-600 tracking-widest uppercase">
            ID: {win.id} // SECURE
          </div>
          <div
            onMouseDown={handleMouseDownResize}
            className="w-3 h-3 -mr-1 -mb-0.5 cursor-nwse-resize flex items-end justify-end p-0.5 text-zinc-600 hover:text-emerald-400 transition-colors"
            title="Drag to resize window"
          >
            <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
              <circle cx="5" cy="1" r="0.75" />
              <circle cx="5" cy="5" r="0.75" />
              <circle cx="1" cy="5" r="0.75" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
