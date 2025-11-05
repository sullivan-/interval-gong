# Interval Gong

**Live Demo:** https://yourusername.github.io/interval-gong/ _(replace with your actual username)_

A simple TypeScript webapp that plays a gong sound at specified intervals. Perfect for meditation, work intervals, or any timed activities.

## Features

- Set custom intervals from 1 second to 1 hour
- Automatic gong sound at each interval (synthesized using Web Audio API)
- Variable gong duration based on interval length
- Clean, simple interface
- Easy-to-modify constants for customization
- No external audio files needed

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the TypeScript

```bash
npm run build
```

This will compile the TypeScript files in `src/` to JavaScript in `dist/`.

### 3. Run Locally

**IMPORTANT:** You must use a local web server. Opening `index.html` directly will fail due to CORS restrictions on ES modules.

```bash
# Option 1: Python (recommended)
python3 -m http.server 8000

# Option 2: npx serve
npx serve

# Option 3: npx http-server
npx http-server
```

Then open `http://localhost:8000` in your browser.

## GitHub Pages Deployment

This site is configured to be hosted on GitHub Pages from the main branch:

1. Push all files to your repository
2. Go to your repository settings on GitHub
3. Navigate to "Pages" section
4. Under "Source", select "main" branch and "/" (root) folder
5. Save and wait a few minutes for deployment
6. Your site will be available at `https://yourusername.github.io/interval-gong/`

## Customization

All timing and audio constants can be easily modified in `src/constants.ts`:

**Interval timing:**
- `MIN_INTERVAL_SECONDS` / `MAX_INTERVAL_SECONDS`: Allowed interval range
- `GONG_DURATION_RULES`: Array defining gong duration based on interval length
- `MIN_GONG_DURATION` / `MAX_GONG_DURATION`: Safety bounds for gong duration

**Audio synthesis (to change the gong sound):**
- `GONG_SYNTH_CONFIG.baseFrequency`: Base pitch in Hz (lower = deeper gong)
- `GONG_SYNTH_CONFIG.frequencies`: Harmonic multipliers for timbre
- `GONG_SYNTH_CONFIG.frequencyDecay`: How much pitch drops during the gong
- `GONG_SYNTH_CONFIG.noiseVolume`: Amount of metallic shimmer
- `GONG_SYNTH_CONFIG.noiseFilterFrequency`: Brightness of the shimmer

After modifying constants, run `npm run build` to recompile.

## Development

To watch for changes and auto-compile:

```bash
npm run watch
```

## License

See LICENSE file for details.
