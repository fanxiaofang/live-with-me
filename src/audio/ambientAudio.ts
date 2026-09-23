/**
 * Procedural Web Audio API sound generator for Live With Me
 * Generates low-CPU, high-fidelity cozy ambient sounds:
 * - Rain on window
 * - Fireplace gentle crackle & warmth
 * - Vinyl tape warmth
 * - Subtle cozy ambient pad
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;

  // Rain nodes
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;

  // Fireplace nodes
  private fireGain: GainNode | null = null;
  private fireInterval: number | null = null;

  // Vinyl nodes
  private vinylGain: GainNode | null = null;

  // Ambient Drone nodes
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];

  public rainVol: number = 0.45;
  public fireVol: number = 0.4;
  public vinylVol: number = 0.25;
  public droneVol: number = 0.2;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupRain();
      this.setupFireplace();
      this.setupVinyl();
      this.setupDrone();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private setupRain() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 5 seconds of soft pink noise buffer
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = buffer;
    this.rainSource.loop = true;

    // Filter to sound like rain hitting cozy glass window
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(this.rainVol, this.ctx.currentTime);

    this.rainSource.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    this.rainSource.start(0);
  }

  private setupFireplace() {
    if (!this.ctx || !this.masterGain) return;

    this.fireGain = this.ctx.createGain();
    this.fireGain.gain.setValueAtTime(this.fireVol, this.ctx.currentTime);
    this.fireGain.connect(this.masterGain);

    // Warm low rumble
    const rumbleOsc = this.ctx.createOscillator();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    rumbleOsc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.fireGain);
    rumbleOsc.start();

    // Sporadic cozy wood snaps
    this.fireInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || !this.fireGain) return;
      if (Math.random() < 0.4) {
        const snap = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snap.type = 'triangle';
        const freq = 120 + Math.random() * 260;
        snap.frequency.setValueAtTime(freq, this.ctx.currentTime);
        snap.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

        snapGain.gain.setValueAtTime(0.06 * Math.random(), this.ctx.currentTime);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

        snap.connect(snapGain);
        snapGain.connect(this.fireGain);

        snap.start();
        snap.stop(this.ctx.currentTime + 0.09);
      }
    }, 280);
  }

  private setupVinyl() {
    if (!this.ctx || !this.masterGain) return;

    // Soft warm hum
    const humOsc = this.ctx.createOscillator();
    humOsc.type = 'sine';
    humOsc.frequency.setValueAtTime(60, this.ctx.currentTime);

    const humGain = this.ctx.createGain();
    humGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(this.vinylVol, this.ctx.currentTime);

    humOsc.connect(humGain);
    humGain.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);

    humOsc.start();
  }

  private setupDrone() {
    if (!this.ctx || !this.masterGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(this.droneVol, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    // Warm peaceful chord (F# major / peaceful fifths: F#2, C#3, A#3)
    const notes = [92.5, 138.59, 233.08];
    this.droneOscs = notes.map((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx!.currentTime);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.035, this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain!);
      osc.start();
      return osc;
    });
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const targetGain = this.isMuted ? 0 : 0.8;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.3);
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  public setRainVolume(vol: number) {
    this.rainVol = vol;
    if (this.ctx && this.rainGain) {
      this.rainGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  public setFireVolume(vol: number) {
    this.fireVol = vol;
    if (this.ctx && this.fireGain) {
      this.fireGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  public setVinylVolume(vol: number) {
    this.vinylVol = vol;
    if (this.ctx && this.vinylGain) {
      this.vinylGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  public setDroneVolume(vol: number) {
    this.droneVol = vol;
    if (this.ctx && this.droneGain) {
      this.droneGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  public playGentleChime() {
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.25);
  }
}

export const ambientAudio = new AmbientAudioEngine();
