/**
 * runDemo.ts — Main entry point for the Prysm Pipeline demo walkthrough.
 *
 * Pipeline:
 *   1. Load environment config
 *   2. Load cue file
 *   3. Launch Playwright browser
 *   4. Execute cues sequentially
 *   5. Write report.json
 *
 * CLI flags:
 *   --record     Enable video recording
 *   --viewport   Viewport preset: landscape (1920×1080), tall (1440×1800), portrait (1080×1920)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import * as dotenv from 'dotenv';
import { Cue, CueResult, executeCue } from './actions';

// Load env
dotenv.config();
dotenv.config({ path: '.env.example' });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const APP_URL = process.env.APP_URL || 'https://chatgpt.com/canvas/shared/69fd41f2b0408191b4a49eef26ea0f9d';
const CUES_PATH = process.env.DEMO_CUES_PATH || 'demo-agent/cues/prysm-pipeline-demo.json';
const OUTPUT_DIR = process.env.DEMO_OUTPUT_DIR || 'demo-agent/output';

// CLI args
const args = process.argv.slice(2);
const recordVideo = args.includes('--record');
const viewportArg = args.find((a) => a.startsWith('--viewport='))?.split('=')[1] || 'landscape';

interface ViewportPreset {
  width: number;
  height: number;
}

const VIEWPORTS: Record<string, ViewportPreset> = {
  landscape: { width: 1920, height: 1080 },
  tall:      { width: 1440, height: 1800 },
  portrait:  { width: 1080, height: 1920 },
};

const viewport = VIEWPORTS[viewportArg] || VIEWPORTS.landscape;

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

interface DemoReport {
  startedAt: string;
  completedAt: string;
  appUrl: string;
  viewport: ViewportPreset;
  viewportName: string;
  videoRecording: boolean;
  totalCues: number;
  passedCues: number;
  failedCues: number;
  cueResults: CueResult[];
  screenshotDir: string;
  videoDir: string;
  scrollStrategy: string;
  highlightStrategy: string;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          Prysm Pipeline — Demo Walkthrough Runner          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();
  console.log(`  App URL:    ${APP_URL}`);
  console.log(`  Cues:       ${CUES_PATH}`);
  console.log(`  Output:     ${OUTPUT_DIR}`);
  console.log(`  Viewport:   ${viewportArg} (${viewport.width}×${viewport.height})`);
  console.log(`  Recording:  ${recordVideo ? 'YES' : 'no'}`);
  console.log();

  // Ensure output dirs exist
  const screenshotDir = path.join(OUTPUT_DIR, 'screenshots');
  const videoDir = path.join(OUTPUT_DIR, 'videos');
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(videoDir, { recursive: true });

  // Load cue file
  const cuesFullPath = path.resolve(CUES_PATH);
  if (!fs.existsSync(cuesFullPath)) {
    console.error(`❌ Cue file not found: ${cuesFullPath}`);
    process.exit(1);
  }

  const cues: Cue[] = JSON.parse(fs.readFileSync(cuesFullPath, 'utf-8'));
  console.log(`  Loaded ${cues.length} cues from ${CUES_PATH}`);
  console.log();

  // Launch browser
  const browser: Browser = await chromium.launch({
    headless: true, // Run headless for stability in non-interactive environment
    args: [
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const contextOptions: any = {
    viewport,
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  };

  if (recordVideo) {
    contextOptions.recordVideo = {
      dir: videoDir,
      size: { width: viewport.width, height: viewport.height },
    };
  }

  const context: BrowserContext = await browser.newContext(contextOptions);
  const page: Page = await context.newPage();

  // Set up smooth scrolling CSS and 90% zoom
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = 'html { scroll-behavior: smooth; zoom: 0.9; }';
    document.head.appendChild(style);
  });

  const startedAt = new Date().toISOString();
  const cueResults: CueResult[] = [];
  let passedCues = 0;
  let failedCues = 0;

  // Execute cues
  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    console.log(`\n━━━ Cue ${i + 1}/${cues.length}: ${cue.id} ━━━`);

    const result = await executeCue(page, cue, APP_URL, OUTPUT_DIR);
    cueResults.push(result);

    if (result.success) {
      passedCues++;
      console.log(`  ✅ Cue "${cue.id}" passed`);
    } else {
      failedCues++;
      console.log(`  ❌ Cue "${cue.id}" FAILED at: ${result.failedAt}`);
      console.log(`  ⛔ Stopping demo at failed cue.`);

      // Capture current page info
      console.log(`  📍 Current URL: ${page.url()}`);
      console.log(`  💡 Likely fix: Check if the selector "${result.failedAt}" matches the current DOM.`);
      break;
    }
  }

  // Close video recording and post-process to high-quality MP4
  if (recordVideo) {
    await context.close(); // Finalize the WebM file
    const videoPath = await page.video()?.path();
    if (videoPath) {
      console.log(`\n🎥 WebM captured: ${videoPath}`);
      // Post-process: upscale and re-encode to a sharp MP4 using FFmpeg
      const ffmpegPath = `C:\\Users\\august\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-essentials_build\\bin\\ffmpeg.exe`;
      const mp4Path = path.join(videoDir, `demo-final-${Date.now()}.mp4`);
      console.log('🔄 Post-processing to high-quality MP4...');
      try {
        execSync(`"${ffmpegPath}" -y -i "${videoPath}" -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${mp4Path}"`, { stdio: 'inherit' });
        console.log(`✅ High-quality MP4 saved: ${mp4Path}`);
      } catch (e) {
        console.log(`⚠️ FFmpeg post-processing failed. WebM is still available at: ${videoPath}`);
      }
    }
  }

  const completedAt = new Date().toISOString();

  // Write report
  const report: DemoReport = {
    startedAt,
    completedAt,
    appUrl: APP_URL,
    viewport,
    viewportName: viewportArg,
    videoRecording: recordVideo,
    totalCues: cues.length,
    passedCues,
    failedCues,
    cueResults,
    screenshotDir: path.resolve(screenshotDir),
    videoDir: path.resolve(videoDir),
    scrollStrategy: 'Smooth scrollIntoView with center alignment, 400ms settle time, guided camera feel',
    highlightStrategy: 'CSS overlay with semi-transparent dim, emerald border glow, optional labels, 300ms fade transitions',
  };

  const reportPath = path.join(OUTPUT_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📋 Report saved: ${reportPath}`);

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                     DEMO RUN SUMMARY                       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`  Total cues:    ${cues.length}`);
  console.log(`  Passed:        ${passedCues}`);
  console.log(`  Failed:        ${failedCues}`);
  console.log(`  Viewport:      ${viewportArg} (${viewport.width}×${viewport.height})`);
  console.log(`  Screenshots:   ${path.resolve(screenshotDir)}`);
  console.log(`  Videos:        ${path.resolve(videoDir)}`);
  console.log(`  Report:        ${path.resolve(reportPath)}`);
  console.log(`  Duration:      ${((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000).toFixed(1)}s`);

  if (failedCues > 0) {
    console.log('\n⚠️  Some cues failed. Check the report and failure screenshots for details.');
    console.log('    Common causes:');
    console.log('    1. Cross-origin iframe blocking — try exporting the app to localhost');
    console.log('    2. Element selectors changed — update selectors.ts');
    console.log('    3. Page load timing — increase wait times in the cue file');
  } else {
    console.log('\n🎉 All cues passed! Demo walkthrough completed successfully.');
  }

  // Cleanup (context may already be closed if recordVideo finalized it)
  if (!recordVideo) {
    await context.close();
  }
  await browser.close();
}

main().catch((err) => {
  console.error('💥 Demo runner crashed:', err);
  process.exit(1);
});
