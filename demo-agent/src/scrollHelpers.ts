/**
 * scrollHelpers.ts — Smooth scrolling utilities for the demo walkthrough.
 *
 * Provides a "guided camera" feel:  scroll → pause → highlight sequence.
 * Uses native smooth-scroll behavior so it works in video recordings.
 */

import { Page, Locator } from 'playwright';

export interface ScrollOptions {
  /** Vertical block alignment: 'start' | 'center' | 'end' | 'nearest'. Default: 'center'. */
  block?: ScrollLogicalPosition;
  /** Extra time (ms) to wait after scroll settles. Default: 400. */
  settleMs?: number;
  /** Inline alignment. Default: 'nearest'. */
  inline?: ScrollLogicalPosition;
}

/**
 * Smoothly scroll an element into view and wait for the scroll to settle.
 */
export async function smoothScrollTo(
  page: Page,
  locator: Locator,
  options: ScrollOptions = {},
): Promise<void> {
  const { block = 'center', settleMs = 400, inline = 'nearest' } = options;

  try {
    // First make sure the element exists
    await locator.waitFor({ state: 'attached', timeout: 5000 });

    // Use evaluate to perform a smooth scroll
    await locator.evaluate(
      (el, opts) => {
        el.scrollIntoView({
          behavior: 'smooth',
          block: opts.block as ScrollLogicalPosition,
          inline: opts.inline as ScrollLogicalPosition,
        });
      },
      { block, inline },
    );

    // Wait for the scroll animation to complete
    await page.waitForTimeout(600);

    // Extra settle time for visual pause
    if (settleMs > 0) {
      await page.waitForTimeout(settleMs);
    }
  } catch (err) {
    console.warn(`[scroll] Could not scroll to element: ${err}`);
  }
}

/**
 * Scroll to the top of the page smoothly.
 */
export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await page.waitForTimeout(800);
}

/**
 * Scroll down by a given number of pixels smoothly.
 */
export async function scrollDown(page: Page, pixels: number): Promise<void> {
  await page.evaluate((px) => {
    window.scrollBy({ top: px, behavior: 'smooth' });
  }, pixels);
  await page.waitForTimeout(600);
}

/**
 * Scroll up by a given number of pixels smoothly.
 */
export async function scrollUp(page: Page, pixels: number): Promise<void> {
  await page.evaluate((px) => {
    window.scrollBy({ top: -px, behavior: 'smooth' });
  }, pixels);
  await page.waitForTimeout(600);
}

/**
 * Scroll within a specific container element (e.g., the Canvas iframe body).
 */
export async function smoothScrollInContainer(
  page: Page,
  containerSelector: string,
  targetLocator: Locator,
  options: ScrollOptions = {},
): Promise<void> {
  const { block = 'center', settleMs = 400 } = options;

  try {
    await targetLocator.evaluate(
      (el, opts) => {
        el.scrollIntoView({
          behavior: 'smooth',
          block: opts.block as ScrollLogicalPosition,
        });
      },
      { block },
    );
    await page.waitForTimeout(600 + settleMs);
  } catch (err) {
    console.warn(`[scroll] Container scroll failed: ${err}`);
    // Fallback to basic scroll
    await smoothScrollTo(page, targetLocator, options);
  }
}
