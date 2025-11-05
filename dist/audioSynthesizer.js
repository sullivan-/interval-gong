export class GongSynthesizer {
    constructor() {
        this.allGains = [];
        this.allOscillators = [];
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    /**
     * Ensures AudioContext is running (required for autoplay)
     */
    async ensureAudioContext() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    /**
     * Synthesizes and plays a gong sound
     * @param duration Duration in seconds
     */
    async playGong(duration) {
        // Resume audio context if needed (for autoplay/testing mode)
        await this.ensureAudioContext();
        const now = this.audioContext.currentTime;
        // Base frequency in Hz (lower = deeper gong)
        const fundamental = 40;
        // Define inharmonic partials with individual decay times
        const partials = [
            //{ freq: 0.2, amp: 1.5, decay: duration },           // undertone
            //{ freq: 0.21, amp: 1.5, decay: duration },           // undertone
            //{ freq: 0.23, amp: 1.5, decay: duration },           // undertone
            //{ freq: 0.81, amp: 0.8, decay: duration },           // fundamental
            { freq: 1.0, amp: 1.2, decay: duration }, // fundamental
            { freq: 2.13, amp: 0.8, decay: duration * 0.8 }, // low inharmonic
            { freq: 3.41, amp: 0.6, decay: duration * 0.7 },
            { freq: 4.32, amp: 0.3, decay: duration * 0.58 },
            //{ freq: 5.21, amp: 0.25, decay: duration * 0.5 },
            { freq: 6.84, amp: 0.2, decay: duration * 0.38 },
            //{ freq: 8.17, amp: 0.15, decay: duration * 0.3 },
            { freq: 10.41, amp: 0.12, decay: duration * 0.25 }, // mid-high
            //{ freq: 13.14, amp: 0.1, decay: duration * 0.2 },   // high
            { freq: 16.73, amp: 0.08, decay: duration * 0.15 }, // higher
            //{ freq: 21.11, amp: 0.06, decay: duration * 0.12 }, // very high
            //{ freq: 26.47, amp: 0.05, decay: duration * 0.1 },  // shimmer
            //{ freq: 33.27, amp: 0.04, decay: duration * 0.08 }, // air
            { freq: 42.71, amp: 0.03, decay: duration * 0.06 }, // brilliance
        ];
        // Create master gain node
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);
        // Track oscillators for THIS gong
        const gongOscillators = [];
        this.allGains.push(masterGain);
        // Create each partial with its own envelope and LFO shimmer
        partials.forEach((partial, i) => {
            // Main oscillator
            const osc = this.audioContext.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = fundamental * partial.freq;
            // Envelope for this partial
            const gain = this.audioContext.createGain();
            gain.gain.setValueAtTime(partial.amp, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + partial.decay);
            // Add shimmer with slow amplitude modulation
            const lfo = this.audioContext.createOscillator();
            lfo.frequency.value = 2.5 + i * 0.3; // Different LFO rate per partial
            const lfoGain = this.audioContext.createGain();
            lfoGain.gain.value = 0.15; // Subtle modulation
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            osc.connect(gain);
            gain.connect(masterGain);
            // Track oscillators for THIS gong
            gongOscillators.push(osc);
            gongOscillators.push(lfo);
            osc.start(now);
            lfo.start(now);
            osc.stop(now + partial.decay);
            lfo.stop(now + partial.decay);
        });
        // Add these oscillators to the global list
        this.allOscillators.push(...gongOscillators);
        // Attack transient - short bright burst
        this.addAttackTransient(masterGain, now);
        // Master envelope
        masterGain.gain.setValueAtTime(0.7, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
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
    async stopGong() {
        // Disconnect all gains immediately - this kills all sound
        this.allGains.forEach((gain) => {
            try {
                gain.disconnect();
            }
            catch (e) { }
        });
        this.allGains = [];
        this.allOscillators = [];
    }
    /**
     * Adds attack transient - short bright noise burst for strike
     */
    addAttackTransient(destination, startTime) {
        const transientDuration = 0.05; // 50ms burst
        // Create noise buffer
        const bufferSize = this.audioContext.sampleRate * transientDuration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        // Bandpass filter for bright attack
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, startTime);
        filter.Q.value = 2;
        // Quick decay envelope
        const transientGain = this.audioContext.createGain();
        transientGain.gain.setValueAtTime(0.3, startTime);
        transientGain.gain.exponentialRampToValueAtTime(0.001, startTime + transientDuration);
        noise.connect(filter);
        filter.connect(transientGain);
        transientGain.connect(destination);
        noise.start(startTime);
        noise.stop(startTime + transientDuration);
    }
}
