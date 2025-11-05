// ============================================
// TESTING MODE - Set to false for production
// ============================================
export const TESTING_MODE = false;  // Auto-starts gong on page load when true

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
    { minInterval: 60, gongDuration: 3.0 },  // 1 minute and up: 3 second gong
    { minInterval: 30, gongDuration: 2.0 },  // 30 seconds and up: 2 second gong
    { minInterval: 2, gongDuration: 1.0 },   // 2 seconds and up: 1 second gong
    { minInterval: 0, gongDuration: 0.5 }    // Less than 2 seconds: 0.5 second gong
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
    baseFrequency: 70,

    // Frequency multipliers for harmonics (creates rich, metallic timbre)
    // Dense spectrum with interpolated partials for maximum fullness
    frequencies: [
        // Sub-fundamental and fundamental
        0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8,
        // Lower partials (body and depth)
        1.95, 2.1, 2.25, 2.4, 2.55, 2.7, 2.85, 3.0, 3.2, 3.4, 3.6, 3.8,
        // Mid partials (warmth and presence)
        4.05, 4.3, 4.6, 4.9, 5.2, 5.5, 5.85, 6.2, 6.6, 7.0, 7.45, 7.9,
        // Upper-mid partials (brightness)
        8.4, 8.9, 9.5, 10.1, 10.75, 11.4, 12.15, 12.9, 13.75, 14.6,
        // High partials (shimmer and air)
        15.55, 16.5, 17.6, 18.7, 19.95, 21.2, 22.6, 24.0, 25.65, 27.3
    ],

    // How much the pitch drops during the gong (1.0 = no drop, 0.9 = drops to 90% of starting pitch)
    frequencyDecay: 0.98,

    // Metallic shimmer noise settings
    noiseVolume: 0.2,           // Volume of the metallic noise (0-1)
    noiseFilterFrequency: 1200  // High-pass filter cutoff in Hz (higher = brighter)
};
