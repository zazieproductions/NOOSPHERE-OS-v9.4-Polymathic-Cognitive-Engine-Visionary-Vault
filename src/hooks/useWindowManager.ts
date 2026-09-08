import { useState, useCallback } from 'react';
import type { WindowId, WindowState, WorkspacePreset } from '../types';

/**
 * Extracted window management logic from DesktopOS.
 * Handles z-index stacking, positioning, presets.
 */
export function useWindowManager(initialWindows: Record<WindowId, WindowState>) {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindows);
  const [topZIndex, setTopZIndex] = useState(10);

  const focusWindow = useCallback((id: WindowId) => {
    setTopZIndex(prevZ => {
      const nextZ = prevZ + 1;
      setWindows(prev => ({
        ...prev,
        [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: nextZ },
      }));
      return nextZ;
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }));
  }, []);

  const toggleMaximize = useCallback((id: WindowId) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  const toggleWindow = useCallback(
    (id: WindowId) => {
      setWindows(prev => {
        const win = prev[id];
        if (!win.isOpen) {
          return { ...prev, [id]: { ...win, isOpen: true, isMinimized: false, zIndex: topZIndex + 1 } };
        } else if (win.isMinimized) {
          return { ...prev, [id]: { ...win, isMinimized: false, zIndex: topZIndex + 1 } };
        } else {
          return { ...prev, [id]: { ...win, isMinimized: true } };
        }
      });
      setTopZIndex(z => z + 1);
    },
    [topZIndex]
  );

  const updatePosition = useCallback((id: WindowId, pos: { x: number; y: number }) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], position: pos } }));
  }, []);

  const updateSize = useCallback((id: WindowId, size: { width: number; height: number }) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], size } }));
  }, []);

  const applyPreset = useCallback((preset: WorkspacePreset) => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    setWindows(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        updated[k as WindowId] = { ...updated[k as WindowId], isOpen: false, isMaximized: false };
      });

      if (preset === 'grandMatrix') {
        updated.graph = { ...updated.graph, isOpen: true, isMinimized: false, position: { x: 20, y: 50 }, size: { width: Math.floor(screenW * 0.48), height: screenH - 140 }, zIndex: 10 };
        updated.vault = { ...updated.vault, isOpen: true, isMinimized: false, position: { x: Math.floor(screenW * 0.51), y: 50 }, size: { width: Math.floor(screenW * 0.46), height: screenH - 140 }, zIndex: 11 };
      } else if (preset === 'deepGraph') {
        updated.graph = { ...updated.graph, isOpen: true, isMinimized: false, isMaximized: true, zIndex: 15 };
      } else if (preset === 'synthesisStudio') {
        updated.synthesizer = { ...updated.synthesizer, isOpen: true, isMinimized: false, position: { x: 30, y: 50 }, size: { width: Math.floor(screenW * 0.55), height: screenH - 140 }, zIndex: 12 };
        updated.vault = { ...updated.vault, isOpen: true, isMinimized: false, position: { x: Math.floor(screenW * 0.59), y: 50 }, size: { width: Math.floor(screenW * 0.38), height: screenH - 140 }, zIndex: 11 };
      } else if (preset === 'zenReader') {
        updated.vault = { ...updated.vault, isOpen: true, isMinimized: false, position: { x: Math.max(20, Math.floor((screenW - 900) / 2)), y: 50 }, size: { width: Math.min(900, screenW - 40), height: screenH - 130 }, zIndex: 15 };
      } else if (preset === 'commandDeck') {
        updated.terminal = { ...updated.terminal, isOpen: true, isMinimized: false, position: { x: 30, y: 50 }, size: { width: Math.floor(screenW * 0.46), height: screenH - 140 }, zIndex: 14 };
        updated.chronotope = { ...updated.chronotope, isOpen: true, isMinimized: false, position: { x: Math.floor(screenW * 0.49), y: 50 }, size: { width: Math.floor(screenW * 0.48), height: Math.floor((screenH - 140) * 0.55) }, zIndex: 12 };
        updated.distortion = { ...updated.distortion, isOpen: true, isMinimized: false, position: { x: Math.floor(screenW * 0.49), y: Math.floor((screenH - 140) * 0.58) + 50 }, size: { width: Math.floor(screenW * 0.48), height: Math.floor((screenH - 140) * 0.42) }, zIndex: 13 };
      }

      return updated;
    });
  }, []);

  return {
    windows,
    setWindows,
    topZIndex,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    toggleWindow,
    updatePosition,
    updateSize,
    applyPreset,
  };
}
