import { MIN_INTERVAL_SECONDS, MAX_INTERVAL_SECONDS, GONG_DURATION_RULES, MIN_GONG_DURATION, MAX_GONG_DURATION } from './constants.js';
import { GongSynthesizer } from './audioSynthesizer.js';
class IntervalGong {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.intervalSeconds = 0;
        this.nextGongTime = 0;
        this.countdownIntervalId = null;
        // Get DOM elements
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.startButton = document.getElementById('startButton');
        this.stopButton = document.getElementById('stopButton');
        this.statusText = document.getElementById('statusText');
        this.nextGongText = document.getElementById('nextGongText');
        // Create audio synthesizer
        this.synthesizer = new GongSynthesizer();
        // Set up event listeners
        this.startButton.addEventListener('click', () => this.start());
        this.stopButton.addEventListener('click', () => this.stop());
        // Validate inputs on change
        this.minutesInput.addEventListener('change', () => this.validateInputs());
        this.secondsInput.addEventListener('change', () => this.validateInputs());
    }
    validateInputs() {
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        const totalSeconds = minutes * 60 + seconds;
        if (totalSeconds < MIN_INTERVAL_SECONDS) {
            this.secondsInput.value = MIN_INTERVAL_SECONDS.toString();
            this.minutesInput.value = '0';
        }
        if (totalSeconds > MAX_INTERVAL_SECONDS) {
            const maxMinutes = Math.floor(MAX_INTERVAL_SECONDS / 60);
            const maxSeconds = MAX_INTERVAL_SECONDS % 60;
            this.minutesInput.value = maxMinutes.toString();
            this.secondsInput.value = maxSeconds.toString();
        }
    }
    getGongDuration(intervalSeconds) {
        // Find the appropriate gong duration based on interval length
        for (const rule of GONG_DURATION_RULES) {
            if (intervalSeconds >= rule.minInterval) {
                return Math.max(MIN_GONG_DURATION, Math.min(MAX_GONG_DURATION, rule.gongDuration));
            }
        }
        return MIN_GONG_DURATION;
    }
    async playGong() {
        const gongDuration = this.getGongDuration(this.intervalSeconds);
        await this.synthesizer.playGong(gongDuration);
    }
    updateCountdown() {
        if (!this.isRunning)
            return;
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((this.nextGongTime - now) / 1000));
        if (remaining > 0) {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            this.nextGongText.textContent = `Next gong in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        else {
            this.nextGongText.textContent = 'Gong playing...';
        }
    }
    start() {
        this.validateInputs();
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        this.intervalSeconds = minutes * 60 + seconds;
        if (this.intervalSeconds < MIN_INTERVAL_SECONDS || this.intervalSeconds > MAX_INTERVAL_SECONDS) {
            alert(`Please enter an interval between ${MIN_INTERVAL_SECONDS} second(s) and ${Math.floor(MAX_INTERVAL_SECONDS / 60)} minutes`);
            return;
        }
        this.isRunning = true;
        // Lock inputs
        this.minutesInput.disabled = true;
        this.secondsInput.disabled = true;
        // Toggle buttons
        this.startButton.disabled = true;
        this.stopButton.disabled = false;
        // Update status
        this.statusText.textContent = 'Running';
        // Play first gong immediately
        this.playGong();
        this.nextGongTime = Date.now() + (this.intervalSeconds * 1000);
        // Set up interval for subsequent gongs
        this.intervalId = window.setInterval(() => {
            this.playGong();
            this.nextGongTime = Date.now() + (this.intervalSeconds * 1000);
        }, this.intervalSeconds * 1000);
        // Set up countdown display
        this.countdownIntervalId = window.setInterval(() => {
            this.updateCountdown();
        }, 100); // Update 10 times per second for smooth countdown
        this.updateCountdown();
    }
    async stop() {
        this.isRunning = false;
        // Clear intervals
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.countdownIntervalId !== null) {
            clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = null;
        }
        // Stop any currently playing gong sound
        await this.synthesizer.stopGong();
        // Unlock inputs
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;
        // Toggle buttons
        this.startButton.disabled = false;
        this.stopButton.disabled = true;
        // Update status
        this.statusText.textContent = 'Ready';
        this.nextGongText.textContent = '';
    }
}
// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IntervalGong();
});
