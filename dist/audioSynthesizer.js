import { GONG_SYNTH_CONFIG } from './constants.js';
export class GongSynthesizer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    /**
     * Synthesizes and plays a gong sound
     * @param duration Duration in seconds
     */
    playGong(duration) {
        const now = this.audioContext.currentTime;
        const { frequencies, baseFrequency, frequencyDecay } = GONG_SYNTH_CONFIG;
        // Create gain node for overall volume control
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);
        // Create envelope: quick attack, long decay
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(1, now + 0.01); // Fast attack
        masterGain.gain.exponentialRampToValueAtTime(0.3, now + duration * 0.3); // Initial decay
        masterGain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Long tail
        // Create multiple oscillators for a rich, metallic timbre
        frequencies.forEach((freqMultiplier, index) => {
            const oscillator = this.audioContext.createOscillator();
            const oscillatorGain = this.audioContext.createGain();
            // Calculate frequency with slight detuning for richness
            const frequency = baseFrequency * freqMultiplier;
            oscillator.frequency.setValueAtTime(frequency, now);
            // Frequency sweep (gongs drop in pitch slightly)
            oscillator.frequency.exponentialRampToValueAtTime(frequency * frequencyDecay, now + duration);
            // Different oscillators have different volumes (fundamental is loudest)
            const relativeVolume = index === 0 ? 0.5 : 0.3 / frequencies.length;
            oscillatorGain.gain.setValueAtTime(relativeVolume, now);
            // Use sine waves for a pure metallic tone
            oscillator.type = 'sine';
            // Connect: oscillator -> gain -> master gain
            oscillator.connect(oscillatorGain);
            oscillatorGain.connect(masterGain);
            // Play
            oscillator.start(now);
            oscillator.stop(now + duration);
        });
        // Add some noise for metallic character
        this.addMetallicNoise(masterGain, now, duration);
    }
    /**
     * Adds filtered noise for metallic shimmer
     */
    addMetallicNoise(destination, startTime, duration) {
        const { noiseVolume, noiseFilterFrequency } = GONG_SYNTH_CONFIG;
        // Create noise using a buffer with random values
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        // Fill with random noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        // Create buffer source
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        // High-pass filter to get only the bright metallic shimmer
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(noiseFilterFrequency, startTime);
        // Gain for noise
        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(0, startTime);
        noiseGain.gain.linearRampToValueAtTime(noiseVolume, startTime + 0.005);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.5);
        // Connect: noise -> filter -> gain -> destination
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(destination);
        // Play
        noise.start(startTime);
    }
}
