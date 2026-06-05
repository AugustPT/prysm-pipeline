/**
 * selectors.ts — Centralized selector registry for the Prysm Pipeline app.
 *
 * Selector priority (per spec):
 *   1. data-testid  (none exist currently)
 *   2. accessible role / name
 *   3. label text
 *   4. visible text
 *   5. CSS selector (last resort)
 *
 * The app is hosted inside a cross-origin iframe (web-sandbox.oaiusercontent.com)
 * when accessed via ChatGPT Canvas. We use Playwright's Frame API to get direct
 * access to the iframe's DOM.
 */

import { Page, Locator, Frame } from 'playwright';

// ---------------------------------------------------------------------------
// Frame helper — resolve the app frame (iframe or direct page)
// ---------------------------------------------------------------------------

/** Cached context */
let _cachedCtx: Page | Frame | null = null;

/**
 * Detect whether the app content is inside an iframe and return the
 * appropriate context (Frame or Page) for creating locators.
 */
export async function getAppContext(page: Page): Promise<Page | Frame> {
  if (_cachedCtx) return _cachedCtx;

  // Look for the Canvas iframe frame
  const frames = page.frames();
  console.log(`  [getAppContext] Found ${frames.length} frame(s)`);

  for (const frame of frames) {
    const url = frame.url();
    if (url.includes('web-sandbox.oaiusercontent.com') || url.includes('oaiusercontent')) {
      console.log(`  [getAppContext] ✓ Found Canvas iframe: ${url.substring(0, 80)}`);
      // Use this frame — it contains the app content
      _cachedCtx = frame;
      return frame;
    }
  }

  // No iframe — check if app content is on the main page
  try {
    const check = page.getByText('Prysm', { exact: false });
    const count = await check.count();
    if (count > 0) {
      console.log('  [getAppContext] ✓ App content found on main page');
      _cachedCtx = page;
      return page;
    }
  } catch { /* fallthrough */ }

  // Default to page
  console.log('  [getAppContext] Defaulting to main page context');
  _cachedCtx = page;
  return page;
}

/** Reset context cache (call after navigation). */
export function resetFrameCache(): void {
  _cachedCtx = null;
}

// ---------------------------------------------------------------------------
// Selector definitions
// ---------------------------------------------------------------------------

/** A context that can create locators — Page or Frame both work. */
type LocatorCtx = Page | Frame;

type SelectorFactory = (ctx: LocatorCtx) => Locator;

const SELECTORS: Record<string, SelectorFactory> = {
  // ── Tabs ──────────────────────────────────────────────────────────────
  'builder-tab':       (c) => c.getByRole('button', { name: 'Builder', exact: true }),
  'script-tab':        (c) => c.getByRole('button', { name: 'Script', exact: true }),
  'ai-prompt-tab':     (c) => c.getByRole('button', { name: 'AI Prompt', exact: true }),
  'guardrails-tab':    (c) => c.getByRole('button', { name: 'Guardrails', exact: true }),
  'tests-tab':         (c) => c.getByRole('button', { name: 'Tests', exact: true }),
  'pipeline-tab':      (c) => c.getByRole('button', { name: 'Pipeline', exact: true }),
  'profile-tab':       (c) => c.getByRole('button', { name: 'Profile', exact: true }),

  // ── Authentication ────────────────────────────────────────────────────
  'login-email-field':    (c) => c.getByPlaceholder('Enter your email', { exact: false }),
  'login-password-field': (c) => c.getByPlaceholder('Enter your password', { exact: false }),
  'login-button':         (c) => c.getByRole('button', { name: 'Login', exact: true }),
  'demo-login-button':    (c) => c.getByRole('button', { name: 'Demo Presenter Login', exact: true }),

  // ── Client Pipeline Save Modal ────────────────────────────────────────
  'save-client-btn':    (c) => c.getByRole('button', { name: 'Save Client to Pipeline', exact: true }),
  'client-name-input':  (c) => c.getByPlaceholder('Client Name', { exact: true }),
  'client-email-input': (c) => c.getByPlaceholder('Client Email', { exact: true }),
  'save-confirm-btn':   (c) => c.getByRole('button', { name: 'Save to Pipeline', exact: true }),

  // ── Presenter name ────────────────────────────────────────────────────
  'presenter-name-label': (c) => c.getByText('Presenter name', { exact: false }),
  'presenter-name-field': (c) => c.locator('input').first(),

  // ── Audience selector panel ───────────────────────────────────────────
  'audience-selector-panel': (c) => c.getByText('Who are we talking to?'),
  'audience-gym-trainer':           (c) => c.getByRole('button', { name: /Gym\s*\/\s*Trainer/i }),
  'audience-athlete-event-attendee':(c) => c.getByRole('button', { name: /Athlete\s*\/\s*Event Attendee/i }),
  'audience-bni-business-owner':    (c) => c.getByRole('button', { name: /BNI\s*\/\s*Business Owner/i }),
  'audience-parents-schools':       (c) => c.getByRole('button', { name: /Parents\s*\/\s*Schools/i }),
  'audience-salon-spa':             (c) => c.getByRole('button', { name: /Salon\s*\/\s*Spa/i }),
  'audience-eye-dental-chiro':      (c) => c.getByRole('button', { name: /Eye\s*\/\s*Dental/i }),
  'audience-yoga-wellness-community': (c) => c.getByRole('button', { name: /Yoga\s*\/\s*Wellness Community/i }),
  'audience-health-store-restaurant': (c) => c.getByRole('button', { name: /Health Store\s*\/\s*Restaurant/i }),
  'audience-scanner-business-candidate': (c) => c.getByRole('button', { name: /Scanner Business Candidate/i }),

  // ── Scan color panel ──────────────────────────────────────────────────
  'scan-color-panel': (c) => c.getByText('Scan color', { exact: false }),
  'scan-color-red':    (c) => c.getByRole('button', { name: /^red$/i }),
  'scan-color-orange': (c) => c.getByRole('button', { name: /^orange$/i }),
  'scan-color-yellow': (c) => c.getByRole('button', { name: /^yellow$/i }),
  'scan-color-green':  (c) => c.getByRole('button', { name: /^green$/i }),
  'scan-color-blue':   (c) => c.getByRole('button', { name: /^blue$/i }),
  'scan-color-purple': (c) => c.getByRole('button', { name: /^purple$/i }),

  // ── Primary goals panel ───────────────────────────────────────────────
  'primary-goals-panel': (c) => c.getByText('Primary goals', { exact: false }),
  'goal-energy':            (c) => c.getByRole('button', { name: 'Energy', exact: true }),
  'goal-sleep':             (c) => c.getByRole('button', { name: 'Sleep', exact: true }),
  'goal-stress':            (c) => c.getByRole('button', { name: 'Stress', exact: true }),
  'goal-nutrition-gaps':    (c) => c.getByRole('button', { name: /Nutrition gaps/i }),
  'goal-eye-screen-support':(c) => c.getByRole('button', { name: /Eye\/screen support/i }),
  'goal-skin-beauty':       (c) => c.getByRole('button', { name: /Skin\/beauty/i }),
  'goal-metabolism':         (c) => c.getByRole('button', { name: 'Metabolism', exact: true }),
  'goal-gut-comfort':       (c) => c.getByRole('button', { name: /Gut comfort/i }),
  'goal-athletic-recovery': (c) => c.getByRole('button', { name: /Athletic recovery/i }),
  'goal-family-education':  (c) => c.getByRole('button', { name: /Family education/i }),
  'goal-extra-income':      (c) => c.getByRole('button', { name: /Extra income/i }),
  'goal-place-scanner':     (c) => c.getByRole('button', { name: /Place scanner/i }),

  // ── Right-side output panels ──────────────────────────────────────────
  'opening-line-panel':        (c) => c.getByText('Opening line', { exact: true }).locator('..'),
  'core-questions-panel':      (c) => c.getByText('Core questions', { exact: true }).locator('..'),
  'score-guidance-panel':      (c) => c.getByText('Score guidance', { exact: true }).locator('..'),
  'possible-product-fit-panel':(c) => c.getByText('Possible product fit', { exact: true }).locator('..'),
  'recommended-next-step-panel': (c) => c.getByText('Recommended next step', { exact: true }).locator('..'),
  'conversation-frame-panel':    (c) => c.getByText('Opening line', { exact: true }).locator('..'),

  // ── Script tab panels ─────────────────────────────────────────────────
  'script-flow-panel':   (c) => c.getByText('Frame', { exact: false }).first(),
  'script-output-panel': (c) => c.locator('body'),

  // ── AI Prompt tab ─────────────────────────────────────────────────────
  'ai-prompt-output-panel': (c) => c.locator('body'),

  // ── Guardrails tab ────────────────────────────────────────────────────
  'guardrails-say-this-panel':       (c) => c.getByText('Say this', { exact: false }),
  'guardrails-avoid-this-panel':     (c) => c.getByText('Avoid this', { exact: false }),
  'guardrails-compliance-reminder':  (c) => c.getByText('compliance', { exact: false }).last(),

  // ── Tests tab ─────────────────────────────────────────────────────────
  'tests-pass-panel': (c) => c.getByText('Pass', { exact: false }).first(),

  // ── Generic / app-level ───────────────────────────────────────────────
  'app-title':  (c) => c.getByText('Prysm Pipeline', { exact: false }),
  'app_visible': (c) => c.getByText('Prysm Pipeline', { exact: false }),
};

/**
 * Resolve a target string to a Playwright Locator.
 * Automatically uses the iframe Frame context if detected, else the page.
 */
export async function resolveSelector(page: Page, target: string): Promise<Locator> {
  const ctx = await getAppContext(page);

  const factory = SELECTORS[target];
  if (factory) return factory(ctx);

  // Fallback: if it looks like a CSS selector use it directly
  if (target.startsWith('.') || target.startsWith('#') || target.includes('[')) {
    return ctx.locator(target);
  }

  // Fallback: match visible text
  return ctx.getByText(target, { exact: false });
}
