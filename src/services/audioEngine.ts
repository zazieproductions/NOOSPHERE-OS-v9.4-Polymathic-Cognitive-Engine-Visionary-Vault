// Web Audio API Polymath Sound Engine
// Binaural theta waves, synaptic clicks, eureka chimes, cybernetic drones

class PolymathAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBinauralActive: boolean = false;
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
    if (muted && this.isBinauralActive) {
      this.stopThetaBinaural();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public getBinauralActive() {
    return this.isBinauralActive;
  }

  // Play subtle mechanical / holographic synaptic click
  public playSynapticClick(frequency = 1200, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio fallback silent
    }
  }

  // Play sci-fi UI blip / node focus tone
  public playNodeBlip(freq = 640) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio error fallback
    }
  }

  // Play glorious Eureka! / Alchemical Breakthrough chord
  public playEurekaChord() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const chords = [528, 660, 792, 1056, 1320]; // 528Hz Solfeggio miracle tone harmonic series
      chords.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.15 / (idx + 1), this.ctx.currentTime + idx * 0.06 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.06 + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 1.9);
      });
    } catch {
      // Ignore
    }
  }

  // Toggle Binaural Theta Wave (6Hz beat at 216Hz carrier: stimulates deep creative subconscious polymath state)
  public toggleThetaBinaural(): boolean {
    if (this.isBinauralActive) {
      this.stopThetaBinaural();
      return false;
    } else {
      this.startThetaBinaural();
      return true;
    }
  }

  public startThetaBinaural() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      this.stopThetaBinaural(); // Clean up if running

      const carrier = 216; // Sacred tuning carrier
      const thetaBeat = 6.0; // 6Hz theta brainwave

      // Left Channel
      const leftPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (leftPanner) leftPanner.pan.setValueAtTime(-1, this.ctx.currentTime);
      const leftOsc = this.ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(carrier, this.ctx.currentTime);

      // Right Channel
      const rightPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (rightPanner) rightPanner.pan.setValueAtTime(1, this.ctx.currentTime);
      const rightOsc = this.ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(carrier + thetaBeat, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 2.0); // Gentle fade-in

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
    } catch {
      this.isBinauralActive = false;
    }
  }

  public stopThetaBinaural() {
    try {
      if (this.binauralGain && this.ctx) {
        this.binauralGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
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
      }, 850);
      this.isBinauralActive = false;
    } catch {
      this.isBinauralActive = false;
    }
  }
}

export const audioEngine = new PolymathAudioEngine();
