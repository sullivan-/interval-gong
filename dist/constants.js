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
    // Wide spectrum with many inharmonic partials for very broad, full sound
    frequencies: [
        // Fundamental and sub-harmonics
        1.0, 1.2, 1.4, 1.6, 1.8,
        // Lower partials (body and depth)
        2.1, 2.4, 2.7, 3.0, 3.4, 3.8,
        // Mid partials (warmth and presence)
        4.3, 4.9, 5.5, 6.2, 7.0, 7.9,
        // Upper-mid partials (brightness)
        8.9, 10.1, 11.4, 12.9, 14.6,
        // High partials (shimmer and air)
        16.5, 18.7, 21.2, 24.0, 27.3
    ],
    // How much the pitch drops during the gong (1.0 = no drop, 0.9 = drops to 90% of starting pitch)
    frequencyDecay: 0.98,
    // Metallic shimmer noise settings
    noiseVolume: 0.2, // Volume of the metallic noise (0-1)
    noiseFilterFrequency: 1200 // High-pass filter cutoff in Hz (higher = brighter)
};
