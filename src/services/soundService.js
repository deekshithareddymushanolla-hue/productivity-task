// Web Audio API Synthesizer for Ambient Focus Soundscapes
// Zero external files or network calls required!

class SoundService {
  constructor() {
    this.ctx = null;
    this.currentType = null;
    this.nodes = [];
    this.gainNode = null;
    this.volume = 0.5;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime);
    }
  }

  stop() {
    try {
      this.nodes.forEach(node => {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      });
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch (e) {
      console.warn('Error stopping sound nodes:', e);
    }
    this.nodes = [];
    this.currentType = null;
  }

  play(type) {
    this.initContext();
    if (!this.ctx) return;
    if (this.currentType === type) return;

    this.stop();
    this.currentType = type;

    if (type === 'off') return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (type === 'binaural_gamma') {
      this.createBinauralBeats(200, 240); // 40 Hz Gamma Focus
    } else if (type === 'binaural_alpha') {
      this.createBinauralBeats(200, 210); // 10 Hz Alpha Flow
    } else if (type === 'rain') {
      this.createRainSound();
    } else if (type === 'brown_noise') {
      this.createBrownNoise();
    }
  }

  createBinauralBeats(leftFreq, rightFreq) {
    const merger = this.ctx.createChannelMerger(2);

    // Left ear oscillator
    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(leftFreq, this.ctx.currentTime);
    oscLeft.connect(merger, 0, 0);

    // Right ear oscillator
    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(rightFreq, this.ctx.currentTime);
    oscRight.connect(merger, 0, 1);

    merger.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();
    this.nodes.push(oscLeft, oscRight, merger);
  }

  createBrownNoise() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // boost level
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm it up
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.nodes.push(whiteNoise, filter);
  }

  createRainSound() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    // Filter for gentle patter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.8;

    rainSource.connect(filter);
    filter.connect(this.gainNode);
    rainSource.start();

    this.nodes.push(rainSource, filter);
  }

  playCompletionChime() {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chimeFrequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    chimeFrequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.3);
    });
  }
}

export const soundService = new SoundService();
