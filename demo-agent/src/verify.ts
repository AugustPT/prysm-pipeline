/**
 * verify.ts — Verification engine for post-action checks.
 *
 * Every major cue action can (and should) verify its result before the
 * demo continues.  If verification fails the demo stops, takes a
 * screenshot, and records the failure in the report.
 */

import { Page, Locator } from 'playwright';

export interface VerifyResult {
  success: boolean;
  message: string;
  /** If verification failed, this holds the failure screenshot path (if taken). */
  screenshotPath?: string;
}

/**
 * Verify that an element is visible on the page.
 */
export async function verifyVisible(
  page: Page,
  locator: Locator,
  timeout: number = 5000,
): Promise<VerifyResult> {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    return { success: true, message: 'Element is visible' };
  } catch {
    return { success: false, message: `Element not visible within ${timeout}ms` };
  }
}

/**
 * Verify that an element contains expected text.
 */
export async function verifyText(
  page: Page,
  locator: Locator,
  expectedText: string,
  timeout: number = 5000,
): Promise<VerifyResult> {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    const text = await locator.textContent();
    if (text && text.includes(expectedText)) {
      return { success: true, message: `Text "${expectedText}" found` };
    }
    return {
      success: false,
      message: `Expected text "${expectedText}" not found. Actual: "${text?.substring(0, 100)}"`,
    };
  } catch {
    return { success: false, message: `Element not found or not visible for text check` };
  }
}

/**
 * Verify that an input field contains an expected value.
 */
export async function verifyInputValue(
  page: Page,
  locator: Locator,
  expectedValue: string,
  timeout: number = 5000,
): Promise<VerifyResult> {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    const value = await locator.inputValue();
    if (value === expectedValue) {
      return { success: true, message: `Input value is "${expectedValue}"` };
    }
    return {
      success: false,
      message: `Expected input value "${expectedValue}", got "${value}"`,
    };
  } catch {
    return { success: false, message: `Input not found or not visible` };
  }
}

/**
 * Verify that an element appears to be "selected" (has active styling).
 * Checks for common patterns: background-color changes, 'active'/'selected' classes, aria-pressed, etc.
 */
export async function verifySelected(
  page: Page,
  locator: Locator,
  timeout: number = 5000,
): Promise<VerifyResult> {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    const isSelected = await locator.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      // Check for emerald/green active background (the app uses green for selected)
      const hasActiveBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== 'rgb(0, 0, 0)';
      const hasActiveClass = el.classList.contains('active') || el.classList.contains('selected');
      const ariaPressed = el.getAttribute('aria-pressed') === 'true';
      const ariaSelected = el.getAttribute('aria-selected') === 'true';
      return hasActiveBg || hasActiveClass || ariaPressed || ariaSelected;
    });

    if (isSelected) {
      return { success: true, message: 'Element appears selected' };
    }
    return { success: false, message: 'Element does not appear selected' };
  } catch {
    return { success: false, message: 'Could not verify selection state' };
  }
}

/**
 * Verify that content has changed from a previous snapshot.
 */
export async function verifyContentChanged(
  page: Page,
  locator: Locator,
  previousContent: string,
  timeout: number = 5000,
): Promise<VerifyResult> {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    // Wait a bit for the content update
    await page.waitForTimeout(500);
    const currentContent = await locator.textContent();
    if (currentContent && currentContent !== previousContent) {
      return { success: true, message: 'Content has changed' };
    }
    return {
      success: false,
      message: `Content did not change. Still: "${currentContent?.substring(0, 100)}"`,
    };
  } catch {
    return { success: false, message: 'Could not verify content change' };
  }
}

/**
 * Verify that at least one element matching the locator exists.
 */
export async function verifyExists(
  page: Page,
  locator: Locator,
  timeout: number = 5000,
): Promise<VerifyResult> {
  try {
    await locator.waitFor({ state: 'attached', timeout });
    const count = await locator.count();
    if (count > 0) {
      return { success: true, message: `Found ${count} matching element(s)` };
    }
    return { success: false, message: 'No matching elements found' };
  } catch {
    return { success: false, message: 'Element not found within timeout' };
  }
}

/**
 * Generic verify dispatcher — used by actions.ts.
 */
export async function verify(
  page: Page,
  locator: Locator,
  type: string = 'visible',
  expected?: string,
): Promise<VerifyResult> {
  switch (type) {
    case 'visible':
      return verifyVisible(page, locator);
    case 'text':
      return verifyText(page, locator, expected || '');
    case 'input_value':
      return verifyInputValue(page, locator, expected || '');
    case 'selected':
      return verifySelected(page, locator);
    case 'exists':
      return verifyExists(page, locator);
    case 'content_changed':
      return verifyContentChanged(page, locator, expected || '');
    default:
      return verifyVisible(page, locator);
  }
}
