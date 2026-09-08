/**
 * Polymath Audio Engine — Web Audio API
 * Binaural theta waves (6Hz @ 216Hz carrier), synaptic clicks, eureka chimes
 *
 * Design notes:
 * - Lazy-initialized AudioContext to respect autoplay policies
 * - Master gain for global mute
 * - Graceful degradation when WebAudio unavailable
 * - No external dependencies
 */

import { AUDIO } from '../lib/constants';

type OscillatorType = globalThis.OscillatorType;

class PolymathAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private isBinauralActive = false;
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private initContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        console.warn('[AudioEngine] Web Audio API not supported');
        return null;
      }
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : AUDIO.MASTER_GAIN, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      return this.ctx;
    } catch (err) {
      console.warn('[AudioEngine] Failed to initialize AudioContext:', err);
      return null;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(muted ? 0 : AUDIO.MASTER_GAIN, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
    if (muted && this.isBinauralActive) {
      this.stopThetaBinaural();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getBinauralActive(): boolean {
    return this.isBinauralActive;
  }

  /**
   * Subtle mechanical / holographic synaptic click
   */
  public playSynapticClick(frequency = 1200, type: OscillatorType = 'sine'): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, ctx.currentTime + AUDIO.CLICK_DURATION);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + AUDIO.CLICK_DURATION);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(ctx.currentTime + AUDIO.CLICK_DURATION);
    } catch {
      // silent fallback
    }
  }

  /**
   * Sci-fi UI blip for node focus
   */
  public playNodeBlip(freq = 640): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + AUDIO.BLIP_DURATION);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + AUDIO.BLIP_DURATION);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(ctx.currentTime + AUDIO.BLIP_DURATION);
    } catch {
      // silent fallback
    }
  }

  /**
   * Glorious Eureka! / Alchemical Breakthrough chord — Solfeggio harmonic series
   */
  public playEurekaChord(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      const chords = [528, 660, 792, 1056, 1320]; // 528Hz Solfeggio miracle tone
      chords.forEach((freq, idx) => {
        if (!ctx || !this.masterGain) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.15 / (idx + 1), ctx.currentTime + idx * 0.06 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 1.9);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Toggle Binaural Theta Wave (6Hz beat at 216Hz carrier)
   * Stimulates deep creative subconscious polymath state
   */
  public toggleThetaBinaural(): boolean {
    if (this.isBinauralActive) {
      this.stopThetaBinaural();
      return false;
    } else {
      this.startThetaBinaural();
      return true;
    }
  }

  public startThetaBinaural(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      this.stopThetaBinaural();

      const carrier = AUDIO.BINAURAL_CARRIER;
      const thetaBeat = AUDIO.BINAURAL_BEAT;

      const leftPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (leftPanner) leftPanner.pan.setValueAtTime(-1, ctx.currentTime);
      const leftOsc = ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(carrier, ctx.currentTime);

      const rightPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (rightPanner) rightPanner.pan.setValueAtTime(1, ctx.currentTime);
      const rightOsc = ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(carrier + thetaBeat, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.0);

      if (leftPanner && rightPanner) {
        leftOsc.connect(leftPanner);
        leftPanner.connect(gain);
        rightOsc.connect(rightPanner);
        rightPanner.connect(gain);
      } else {
        leftOsc.connect(gain);
        rightOsc.connect(gain);
      }

      gain.connect(this.masterGain);

      leftOsc.start();
      rightOsc.start();

      this.binauralLeftOsc = leftOsc;
      this.binauralRightOsc = rightOsc;
      this.binauralGain = gain;
      this.isBinauralActive = true;
    } catch (err) {
      console.warn('[AudioEngine] Failed to start binaural:', err);
      this.isBinauralActive = false;
    }
  }

  public stopThetaBinaural(): void {
    try {
      if (this.binauralGain && this.ctx) {
        this.binauralGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        try {
          if (this.binauralLeftOsc) {
            this.binauralLeftOsc.stop();
            this.binauralLeftOsc.disconnect();
            this.binauralLeftOsc = null;
          }
          if (this.binauralRightOsc) {
            this.binauralRightOsc.stop();
            this.binauralRightOsc.disconnect();
            this.binauralRightOsc = null;
          }
          if (this.binauralGain) {
            this.binauralGain.disconnect();
            this.binauralGain = null;
          }
        } catch {
          // ignore cleanup errors
        }
      }, 850);
      this.isBinauralActive = false;
    } catch {
      this.isBinauralActive = false;
    }
  }

  /** Dispose all resources — call on app unmount */
  public dispose(): void {
    this.stopThetaBinaural();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.masterGain = null;
    }
  }
}

export const audioEngine = new PolymathAudioEngine();
