# Prysm Pipeline — Demo Walkthrough Agent

Automated, cue-driven walkthrough runner for the **Prysm Pipeline** app.

> **Architecture**: `script/audio → transcript → cue map → deterministic Playwright actions → smooth scrolling → highlights → verification → screenshots/video`

This is **not** a random AI agent that guesses where to click. The walkthrough follows a pre-built cue file with deterministic Playwright actions — the same way a skilled editor would record a product walkthrough on YouTube.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npm run demo:install

# 3. Run the walkthrough
npm run demo:run

# 4. Run with video recording
npm run demo:record
```

## Project Structure

```
demo-agent/
  audio/                    # Walkthrough narration audio (optional)
    walkthrough.mp3
  cues/                     # Cue file — the walkthrough script
    prysm-pipeline-demo.json
  output/                   # Generated output
    screenshots/            # Step-by-step screenshots
    videos/                 # Video recordings
    report.json             # Run report with pass/fail per cue
  src/
    actions.ts              # Action executor (click, type, scroll, highlight, verify, screenshot)
    buildCueMap.ts           # Generate/update the cue file from script or transcript
    highlightOverlay.ts      # CSS-based visual highlight overlays
    runDemo.ts               # Main entry point — loads cues, runs Playwright
    scrollHelpers.ts         # Smooth vertical scrolling helpers
    selectors.ts             # Centralized selector registry
    transcribeAudio.ts       # Whisper-based audio transcription
    verify.ts                # Post-action verification engine
```

## NPM Scripts

| Script | What it does |
|--------|-------------|
| `npm run demo:install` | Install Playwright Chromium browser |
| `npm run demo:run` | Run the full walkthrough with screenshots |
| `npm run demo:record` | Run the walkthrough with video recording |
| `npm run demo:transcribe` | Transcribe walkthrough audio (requires `OPENAI_API_KEY`) |
| `npm run demo:plan` | Build/validate the cue file from script text |

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `APP_URL` | The Prysm Pipeline app URL |
| `DEMO_AUDIO_PATH` | Path to walkthrough narration audio |
| `DEMO_CUES_PATH` | Path to the cue JSON file |
| `DEMO_OUTPUT_DIR` | Output directory for screenshots/videos/reports |
| `OPENAI_API_KEY` | OpenAI API key for Whisper transcription |

## Viewport Options

Use `--viewport` flag to control the browser size:

```bash
# Landscape — standard YouTube (1920×1080)
npm run demo:run -- --viewport=landscape

# Tall — shows more vertical content (1440×1800)
npm run demo:run -- --viewport=tall

# Portrait — vertical video format (1080×1920)
npm run demo:run -- --viewport=portrait
```

## How the Cue System Works

Each cue has an `id`, `narration` text, and an `actions` array:

```json
{
  "id": "scan-color-select-green",
  "narration": "When you click a scan color, look at Score guidance...",
  "actions": [
    { "type": "scroll_to", "target": "scan-color-green", "block": "center" },
    { "type": "highlight", "target": "scan-color-green", "label": "Selecting: Green" },
    { "type": "click", "target": "scan-color-green" },
    { "type": "scroll_to", "target": "score-guidance-panel" },
    { "type": "highlight", "target": "score-guidance-panel", "label": "Score guidance updated" },
    { "type": "verify", "target": "score-guidance-panel", "verifyType": "visible" },
    { "type": "screenshot", "name": "score-guidance-green" }
  ],
  "pauseMs": 1500
}
```

### Action Types

| Action | Description |
|--------|-------------|
| `open_app` | Navigate to the app URL |
| `click` | Click an element (auto-scrolls into view first) |
| `type` | Type text into an input field |
| `scroll_to` | Smooth scroll to an element |
| `highlight` | Add a glowing border + optional label overlay |
| `clear_highlight` | Remove all highlight overlays |
| `wait` | Pause for N milliseconds |
| `verify` | Check element state (visible, text, input_value, selected) |
| `screenshot` | Save a screenshot |
| `record_marker` | Log a timestamp marker for video alignment |

### Selector Strategy

Selectors use this priority order (most stable first):
1. `data-testid` (if present)
2. Accessible role + name (`getByRole`)
3. Label text (`getByLabel`)
4. Visible text (`getByText`)
5. CSS selector (last resort)

All selectors are centralized in `selectors.ts`.

## Tall Layout Strategy

The Prysm app is vertically tall. The demo handles this with:

1. **Smooth scrolling** — `scrollIntoView({ behavior: 'smooth', block: 'center' })` with settle time
2. **Cross-panel highlighting** — When selecting on the left (e.g., audience), scroll down to show the right-side result, then highlight it
3. **Guided camera** — Scroll → pause → highlight → screenshot sequence
4. **No zooming out** — Text stays readable at native size
5. **Labels** — Optional labels explain what changed and why

## Cross-Origin Iframe Notes

The app is hosted on ChatGPT Canvas, which uses a cross-origin iframe. If automation is blocked:

1. **Export the app** — Save it as a standalone HTML file
2. **Host locally** — Serve with a simple HTTP server
3. **Update `APP_URL`** — Point to `http://localhost:3000` (or wherever you host it)

The demo runner works with any URL — just change `APP_URL` in `.env`.

## Failure Handling

If any cue action fails:
1. Demo stops immediately
2. Failure screenshot is saved
3. Failed cue ID and action are logged
4. Current URL is saved
5. Suggested fix is shown in the console
6. Full details go into `report.json`

## Output

After a run, check:
- `demo-agent/output/screenshots/` — Step-by-step PNG screenshots
- `demo-agent/output/videos/` — Video recordings (if `--record`)
- `demo-agent/output/report.json` — Full pass/fail report
