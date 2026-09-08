import { describe, it, expect, beforeEach, vi } from 'vitest';
import { audioEngine } from '../src/services/audioEngine';

describe('audioEngine', () => {
  beforeEach(() => {
    audioEngine.setMuted(false);
    // Ensure binaural is stopped before each test
    if (audioEngine.getBinauralActive()) {
      audioEngine.stopThetaBinaural();
    }
  });

  it('should have correct initial state', () => {
    expect(audioEngine.getMuted()).toBe(false);
    expect(typeof audioEngine.getBinauralActive()).toBe('boolean');
  });

  it('should toggle mute', () => {
    audioEngine.setMuted(true);
    expect(audioEngine.getMuted()).toBe(true);
    
    audioEngine.setMuted(false);
    expect(audioEngine.getMuted()).toBe(false);
  });

  it('should not throw when playing sounds while muted', () => {
    audioEngine.setMuted(true);
    expect(() => audioEngine.playSynapticClick()).not.toThrow();
    expect(() => audioEngine.playNodeBlip()).not.toThrow();
    expect(() => audioEngine.playEurekaChord()).not.toThrow();
  });

  it('should not throw when playing sounds unmuted', () => {
    audioEngine.setMuted(false);
    expect(() => audioEngine.playSynapticClick(1200, 'sine')).not.toThrow();
    expect(() => audioEngine.playNodeBlip(640)).not.toThrow();
    expect(() => audioEngine.playEurekaChord()).not.toThrow();
  });

  it('should toggle binaural', () => {
    const initial = audioEngine.getBinauralActive();
    const toggled = audioEngine.toggleThetaBinaural();
    expect(toggled).toBe(!initial);
    
    const toggledBack = audioEngine.toggleThetaBinaural();
    expect(toggledBack).toBe(initial);
  });

  it('should handle binaural start/stop', () => {
    expect(() => audioEngine.startThetaBinaural()).not.toThrow();
    // Give it a moment to start
    expect(audioEngine.getBinauralActive()).toBe(true);
    
    expect(() => audioEngine.stopThetaBinaural()).not.toThrow();
    // Note: stop is async with timeout, so active may still be false after cleanup
  });
});
