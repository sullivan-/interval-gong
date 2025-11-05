# Interval Gong

A simple TypeScript webapp that plays a gong sound at specified intervals. Perfect for meditation, work intervals, or any timed activities.

## Features

- Set custom intervals from 1 second to 1 hour
- Automatic gong sound at each interval
- Variable gong duration based on interval length
- Clean, simple interface
- Easy-to-modify constants for customization

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Gong Sound File

You need to add a gong sound file named `gong.mp3` to the root directory. You can:

- Download a free gong sound from [Freesound.org](https://freesound.org/) (search for "gong")
- Use any gong sound file you prefer
- Make sure the file is at least 3 seconds long (since the app may play up to 3 seconds)
- Name it `gong.mp3` and place it in the root directory

**Recommended sources:**
- https://freesound.org/search/?q=gong&f=license:%22Creative+Commons+0%22
- Make sure to use sounds with appropriate licenses for your use case

### 3. Build the TypeScript

```bash
npm run build
```

This will compile the TypeScript files in `src/` to JavaScript in `dist/`.

### 4. Serve Locally (optional)

Open `index.html` in your browser, or use a local server:

```bash
python -m http.server 8000
# or
npx serve
```

## GitHub Pages Deployment

This site is configured to be hosted on GitHub Pages from the main branch:

1. Push all files to your repository
2. Go to your repository settings on GitHub
3. Navigate to "Pages" section
4. Under "Source", select "main" branch and "/" (root) folder
5. Save and wait a few minutes for deployment
6. Your site will be available at `https://yourusername.github.io/interval-gong/`

**Important:** Make sure `gong.mp3` is committed to the repository!

## Customization

All timing constants can be easily modified in `src/constants.ts`:

- `MIN_INTERVAL_SECONDS` / `MAX_INTERVAL_SECONDS`: Allowed interval range
- `GONG_DURATION_RULES`: Array defining gong duration based on interval length
- `MIN_GONG_DURATION` / `MAX_GONG_DURATION`: Safety bounds for gong duration
- `GONG_AUDIO_FILE`: Path to the audio file

After modifying constants, run `npm run build` to recompile.

## Development

To watch for changes and auto-compile:

```bash
npm run watch
```

## License

See LICENSE file for details.
