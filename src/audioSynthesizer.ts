import { GONG_SYNTH_CONFIG } from './constants.js';

export class GongSynthesizer {
    private audioContext: AudioContext;
    private allGains: GainNode[] = [];

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    /**
     * Ensures AudioContext is running (required for autoplay)
     */
    public async ensureAudioContext(): Promise<void> {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Synthesizes and plays a gong sound
     * @param duration Duration in seconds
     */
    public async playGong(duration: number): Promise<void> {
        // Resume audio context if needed (for autoplay/testing mode)
        await this.ensureAudioContext();

        const now = this.audioContext.currentTime;
        const { frequencies, baseFrequency, frequencyDecay } = GONG_SYNTH_CONFIG;

        // Create gain node for overall volume control
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);

        // Track this gain so we can stop it later
        this.allGains.push(masterGain);

        // Create envelope: quick attack, sustained resonance
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(1, now + 0.01); // Fast attack
        masterGain.gain.exponentialRampToValueAtTime(0.6, now + duration * 0.2); // Less steep initial decay for more resonance
        masterGain.gain.exponentialRampToValueAtTime(0.3, now + duration * 0.5); // Sustain longer
        masterGain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Long tail

        // Create multiple oscillators for a rich, metallic timbre
        frequencies.forEach((freqMultiplier, index) => {
            // Create slightly detuned pairs for fuller, more resonant sound
            for (let detune = 0; detune < 2; detune++) {
                const oscillator = this.audioContext.createOscillator();
                const oscillatorGain = this.audioContext.createGain();

                // Calculate frequency with slight detuning for richness and beating
                const frequency = baseFrequency * freqMultiplier;
                const detuneAmount = detune === 0 ? -2 : 2; // +/- 2 cents
                oscillator.frequency.setValueAtTime(frequency, now);
                oscillator.detune.setValueAtTime(detuneAmount, now);

                // Frequency sweep (gongs drop in pitch slightly)
                oscillator.frequency.exponentialRampToValueAtTime(
                    frequency * frequencyDecay,
                    now + duration
                );

                // Different oscillators have different volumes
                // Lower frequencies are louder for bigger, fuller sound
                const isLowFreq = freqMultiplier < 5.0;
                const isFifth = Math.abs(freqMultiplier - 1.5) < 0.05; // Perfect fifth interval
                const baseLoudness = index === 0 ? 0.4 :
                                     isFifth ? 0.45 / frequencies.length : // Boost the fifth
                                     (isLowFreq ? 0.35 : 0.25) / frequencies.length;
                const relativeVolume = baseLoudness / 2; // Divide by 2 since we have pairs
                oscillatorGain.gain.setValueAtTime(relativeVolume, now);

                // Use sine waves for a pure metallic tone
                oscillator.type = 'sine';

                // Connect: oscillator -> gain -> master gain
                oscillator.connect(oscillatorGain);
                oscillatorGain.connect(masterGain);

                // Play and auto-stop after duration
                oscillator.start(now);
                oscillator.stop(now + duration);
            }
        });

        // Add some noise for metallic character
        this.addMetallicNoise(masterGain, now, duration);

        // Auto-cleanup after duration
        setTimeout(() => {
            masterGain.disconnect();
            const index = this.allGains.indexOf(masterGain);
            if (index > -1) {
                this.allGains.splice(index, 1);
            }
        }, duration * 1000 + 100);
    }

    /**
     * Immediately stops any currently playing gong sound
     */
    public stopGong(): void {
        // Disconnect ALL gains immediately - this stops everything
        this.allGains.forEach((gain) => {
            gain.disconnect();
        });
        this.allGains = [];
    }

    /**
     * Adds filtered noise for metallic shimmer
     */
    private addMetallicNoise(destination: GainNode, startTime: number, duration: number): void {
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

        // Play and auto-stop
        noise.start(startTime);
        noise.stop(startTime + duration);
    }
}
