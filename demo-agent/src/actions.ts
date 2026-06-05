/**
 * actions.ts — Cue action executor for the Prysm Pipeline demo.
 *
 * Processes individual cue actions: open_app, click, type, scroll_to,
 * highlight, wait, verify, screenshot, record_marker.
 *
 * Each action handler is deterministic — no AI guessing, just precise
 * Playwright commands driven by the cue file.
 */

import { Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { resolveSelector, resetFrameCache } from './selectors';
import { smoothScrollTo, scrollToTop } from './scrollHelpers';
import { highlight, highlightWithLabel, clearHighlight } from './highlightOverlay';
import { verify as verifyAction, VerifyResult } from './verify';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CueAction {
  type: 'open_app' | 'click' | 'type' | 'scroll_to' | 'highlight' | 'wait' | 'verify' | 'screenshot' | 'record_marker' | 'clear_highlight';
  /** Selector target name (maps to selectors.ts) or CSS selector. */
  target?: string;
  /** Text to type (for 'type' action). */
  value?: string;
  /** Screenshot filename (for 'screenshot' action). */
  name?: string;
  /** Wait duration in ms (for 'wait' action). */
  ms?: number;
  /** Label for highlight overlay. */
  label?: string;
  /** Verification type (for 'verify' action): visible, text, input_value, selected, exists, content_changed. */
  verifyType?: string;
  /** Expected value for verification. */
  expected?: string;
  /** Scroll block alignment: start, center, end. */
  block?: ScrollLogicalPosition;
  /** Whether to dim the background during highlight. */
  dim?: boolean;
  /** Marker name for video recording markers. */
  marker?: string;
  /** Whether to clear the input field before typing. */
  clearFirst?: boolean;
}

export interface Cue {
  id: string;
  narration: string;
  actions: CueAction[];
  pauseMs?: number;
}

export interface ActionResult {
  action: CueAction;
  success: boolean;
  message: string;
  screenshotPath?: string;
  timestamp: number;
}

export interface CueResult {
  cueId: string;
  narration: string;
  results: ActionResult[];
  success: boolean;
  failedAt?: string;
}

// ---------------------------------------------------------------------------
// Action Handlers
// ---------------------------------------------------------------------------

async function handleOpenApp(
  page: Page,
  action: CueAction,
  appUrl: string,
): Promise<ActionResult> {
  try {
    await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Wait for the app to render
    await page.waitForTimeout(3000);

    // Reset frame detection cache after navigation
    resetFrameCache();

    // Try to find and interact with the Canvas iframe if present
    // The app content may be inside an iframe
    try {
      const frames = page.frames();
      console.log(`  [open_app] Found ${frames.length} frame(s)`);
      for (const frame of frames) {
        console.log(`    Frame: ${frame.url().substring(0, 80)}`);
      }
    } catch {
      // Ignore frame enumeration errors
    }

    return {
      action,
      success: true,
      message: `Opened ${appUrl}`,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      action,
      success: false,
      message: `Failed to open app: ${err.message}`,
      timestamp: Date.now(),
    };
  }
}

async function handleClick(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  try {
    const locator = await resolveSelector(page, action.target!);
    await locator.waitFor({ state: 'visible', timeout: 8000 });
    await smoothScrollTo(page, locator, { settleMs: 200 });
    await locator.click({ timeout: 5000 });
    // Brief pause for the app to react
    await page.waitForTimeout(500);

    return {
      action,
      success: true,
      message: `Clicked "${action.target}"`,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      action,
      success: false,
      message: `Click failed on "${action.target}": ${err.message}`,
      timestamp: Date.now(),
    };
  }
}

async function handleType(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  try {
    const locator = await resolveSelector(page, action.target!);
    await locator.waitFor({ state: 'visible', timeout: 8000 });
    await smoothScrollTo(page, locator, { settleMs: 200 });

    if (action.clearFirst !== false) {
      // Triple-click to select all, then type to replace
      await locator.click({ clickCount: 3 });
      await page.waitForTimeout(100);
    }

    // Type character by character for a natural feel
    await locator.fill(action.value || '');
    await page.waitForTimeout(300);

    return {
      action,
      success: true,
      message: `Typed "${action.value}" into "${action.target}"`,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      action,
      success: false,
      message: `Type failed on "${action.target}": ${err.message}`,
      timestamp: Date.now(),
    };
  }
}

async function handleScrollTo(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  try {
    if (action.target === 'top') {
      await scrollToTop(page);
      return {
        action,
        success: true,
        message: 'Scrolled to top',
        timestamp: Date.now(),
      };
    }

    const locator = await resolveSelector(page, action.target!);
    await smoothScrollTo(page, locator, {
      block: action.block || 'center',
      settleMs: 300,
    });

    return {
      action,
      success: true,
      message: `Scrolled to "${action.target}"`,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      action,
      success: false,
      message: `Scroll failed for "${action.target}": ${err.message}`,
      timestamp: Date.now(),
    };
  }
}

async function handleHighlight(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  try {
    const locator = await resolveSelector(page, action.target!);

    if (action.label) {
      await highlightWithLabel(page, locator, action.label, {
        dim: action.dim !== false,
      });
    } else {
      await highlight(page, locator, {
        dim: action.dim !== false,
      });
    }

    return {
      action,
      success: true,
      message: `Highlighted "${action.target}"${action.label ? ` with label "${action.label}"` : ''}`,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      action,
      success: false,
      message: `Highlight failed on "${action.target}": ${err.message}`,
      timestamp: Date.now(),
    };
  }
}

async function handleClearHighlight(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  await clearHighlight(page);
  return {
    action,
    success: true,
    message: 'Cleared highlights',
    timestamp: Date.now(),
  };
}

async function handleWait(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  const ms = action.ms || 1000;
  await page.waitForTimeout(ms);
  return {
    action,
    success: true,
    message: `Waited ${ms}ms`,
    timestamp: Date.now(),
  };
}

async function handleVerify(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  try {
    const locator = await resolveSelector(page, action.target!);
    const result: VerifyResult = await verifyAction(
      page,
      locator,
      action.verifyType || 'visible',
      action.expected,
    );

    return {
      action,
      success: result.success,
      message: `Verify "${action.target}" (${action.verifyType || 'visible'}): ${result.message}`,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      action,
      success: false,
      message: `Verify failed for "${action.target}": ${err.message}`,
      timestamp: Date.now(),
    };
  }
}

async function handleScreenshot(
  page: Page,
  action: CueAction,
  outputDir: string,
): Promise<ActionResult> {
  try {
    const screenshotsDir = path.join(outputDir, 'screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });

    const filename = `${action.name || `screenshot-${Date.now()}`}.png`;
    const filePath = path.join(screenshotsDir, filename);

    await page.screenshot({
      path: filePath,
      fullPage: false,
    });

    return {
      action,
      success: true,
      message: `Screenshot saved: ${filename}`,
      screenshotPath: filePath,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      action,
      success: false,
      message: `Screenshot failed: ${err.message}`,
      timestamp: Date.now(),
    };
  }
}

async function handleRecordMarker(
  page: Page,
  action: CueAction,
): Promise<ActionResult> {
  // Record markers are logged for video post-processing alignment
  const marker = action.marker || action.name || 'marker';
  console.log(`  [MARKER] ${marker} at ${Date.now()}`);
  return {
    action,
    success: true,
    message: `Record marker: ${marker}`,
    timestamp: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// Main action dispatcher
// ---------------------------------------------------------------------------

export async function executeAction(
  page: Page,
  action: CueAction,
  appUrl: string,
  outputDir: string,
): Promise<ActionResult> {
  switch (action.type) {
    case 'open_app':
      return handleOpenApp(page, action, appUrl);
    case 'click':
      return handleClick(page, action);
    case 'type':
      return handleType(page, action);
    case 'scroll_to':
      return handleScrollTo(page, action);
    case 'highlight':
      return handleHighlight(page, action);
    case 'clear_highlight':
      return handleClearHighlight(page, action);
    case 'wait':
      return handleWait(page, action);
    case 'verify':
      return handleVerify(page, action);
    case 'screenshot':
      return handleScreenshot(page, action, outputDir);
    case 'record_marker':
      return handleRecordMarker(page, action);
    default:
      return {
        action,
        success: false,
        message: `Unknown action type: ${(action as any).type}`,
        timestamp: Date.now(),
      };
  }
}

/**
 * Execute all actions in a cue sequentially.
 * Stops on first failure and returns the cue result.
 */
export async function executeCue(
  page: Page,
  cue: Cue,
  appUrl: string,
  outputDir: string,
): Promise<CueResult> {
  console.log(`\n▶ Cue: ${cue.id}`);
  console.log(`  "${cue.narration.substring(0, 80)}${cue.narration.length > 80 ? '...' : ''}"`);

  const results: ActionResult[] = [];
  let success = true;
  let failedAt: string | undefined;

  for (const action of cue.actions) {
    console.log(`  → ${action.type}${action.target ? ` [${action.target}]` : ''}${action.value ? ` = "${action.value}"` : ''}`);

    const result = await executeAction(page, action, appUrl, outputDir);
    results.push(result);

    if (!result.success) {
      console.log(`  ✗ FAILED: ${result.message}`);
      success = false;
      failedAt = `${action.type}:${action.target || action.name || ''}`;

      // Take a failure screenshot
      try {
        const failDir = path.join(outputDir, 'screenshots');
        fs.mkdirSync(failDir, { recursive: true });
        const failPath = path.join(failDir, `FAIL-${cue.id}-${Date.now()}.png`);
        await page.screenshot({ path: failPath, fullPage: false });
        result.screenshotPath = failPath;
        console.log(`  📸 Failure screenshot: ${failPath}`);
      } catch { /* ignore screenshot errors */ }

      break; // Stop on failure
    } else {
      console.log(`  ✓ ${result.message}`);
    }
  }

  // Post-cue pause (for video pacing)
  if (success && cue.pauseMs && cue.pauseMs > 0) {
    console.log(`  ⏸ Pause ${cue.pauseMs}ms`);
    await page.waitForTimeout(cue.pauseMs);
  }

  return { cueId: cue.id, narration: cue.narration, results, success, failedAt };
}
