// ============================================
// TESTING MODE - Set to false for production
// ============================================
export const TESTING_MODE = false; // Auto-starts gong on page load when true
// ============================================
// GONG CONFIGURATION CONSTANTS
// Edit these values to customize gong behavior
// ============================================
// Minimum and maximum allowed interval times (in seconds)
export const MIN_INTERVAL_SECONDS = 1;
export const MAX_INTERVAL_SECONDS = 3600; // 1 hour
// Gong duration rules based on interval length
// The app will use the longest gong duration that applies
export const GONG_DURATION_RULES = [
    { minInterval: 60, gongDuration: 3.0 }, // 1 minute and up: 3 second gong
    { minInterval: 30, gongDuration: 2.0 }, // 30 seconds and up: 2 second gong
    { minInterval: 2, gongDuration: 1.0 }, // 2 seconds and up: 1 second gong
    { minInterval: 0, gongDuration: 0.5 } // Less than 2 seconds: 0.5 second gong
];
// Absolute min/max gong durations (safety bounds)
export const MIN_GONG_DURATION = 0.5;
export const MAX_GONG_DURATION = 3.0;
// ============================================
// AUDIO SYNTHESIS CONFIGURATION
// Edit these to change the gong sound characteristics
// ============================================
export const GONG_SYNTH_CONFIG = {
    // Base frequency in Hz (lower = deeper gong)
    baseFrequency: 80,
    // Frequency multipliers for harmonics (creates rich, metallic timbre)
    // First value is the fundamental, others are overtones
    // Many inharmonic partials for very full, complex, metallic sound
    frequencies: [
        1.0, // Fundamental
        1.5, 2.0, 2.4, 2.9, 3.5, // Lower partials (body)
        4.2, 5.0, 6.0, 7.2, 8.5, // Mid partials (warmth)
        10.2, 12.5, 15.0 // Upper partials (brightness & shimmer)
    ],
    // How much the pitch drops during the gong (1.0 = no drop, 0.9 = drops to 90% of starting pitch)
    frequencyDecay: 0.98,
    // Metallic shimmer noise settings
    noiseVolume: 0.18, // Volume of the metallic noise (0-1)
    noiseFilterFrequency: 1400 // High-pass filter cutoff in Hz (higher = brighter)
};
