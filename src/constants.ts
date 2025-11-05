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

// Audio file path
export const GONG_AUDIO_FILE = "gong.mp3";
