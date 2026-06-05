/**
 * highlightOverlay.ts — Visual highlight overlay system for the demo walkthrough.
 *
 * Injects CSS-based overlays directly into the page so they appear in both
 * screenshots and video recordings.
 *
 * Features:
 *   • Semi-transparent dim background (everything except target)
 *   • Bright emerald outline around active section
 *   • Optional floating label
 *   • Smooth fade-in / fade-out (300ms CSS transitions)
 *   • Does not block readable text
 */

import { Page, Locator } from 'playwright';

export interface HighlightOptions {
  /** Label text to display near the highlighted area. */
  label?: string;
  /** Duration in ms to keep the highlight visible. 0 = manual clear. Default: 0. */
  durationMs?: number;
  /** Color of the highlight border. Default: '#10b981' (emerald). */
  color?: string;
  /** Whether to dim the rest of the page. Default: true. */
  dim?: boolean;
  /** Border width in px. Default: 3. */
  borderWidth?: number;
}

const OVERLAY_ID = '__prysm_demo_overlay';
const HIGHLIGHT_ID = '__prysm_demo_highlight';
const LABEL_ID = '__prysm_demo_label';
const STYLE_ID = '__prysm_demo_styles';

/**
 * Inject the base CSS styles needed for overlays (idempotent).
 */
async function ensureStyles(page: Page): Promise<void> {
  await page.evaluate(({ styleId, overlayId, highlightId, labelId }) => {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      #${overlayId} {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        z-index: 99998;
        pointer-events: none;
        opacity: 0;
        transition: opacity 300ms ease-in-out;
      }
      #${overlayId}.visible {
        opacity: 1;
      }
      #${highlightId} {
        position: absolute;
        z-index: 99999;
        pointer-events: none;
        border: 3px solid #10b981;
        border-radius: 8px;
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25),
                    0 0 20px rgba(16, 185, 129, 0.15);
        opacity: 0;
        transition: all 300ms ease-in-out;
      }
      #${highlightId}.visible {
        opacity: 1;
      }
      #${labelId} {
        position: absolute;
        z-index: 100000;
        pointer-events: none;
        background: #10b981;
        color: #fff;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 4px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 300ms ease-in-out;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      #${labelId}.visible {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    // Create overlay elements
    if (!document.getElementById(overlayId)) {
      const overlay = document.createElement('div');
      overlay.id = overlayId;
      document.body.appendChild(overlay);
    }
    if (!document.getElementById(highlightId)) {
      const hl = document.createElement('div');
      hl.id = highlightId;
      document.body.appendChild(hl);
    }
    if (!document.getElementById(labelId)) {
      const lb = document.createElement('div');
      lb.id = labelId;
      document.body.appendChild(lb);
    }
  }, { styleId: STYLE_ID, overlayId: OVERLAY_ID, highlightId: HIGHLIGHT_ID, labelId: LABEL_ID });
}

/**
 * Highlight an element on the page with a glowing border and optional label.
 */
export async function highlight(
  page: Page,
  locator: Locator,
  options: HighlightOptions = {},
): Promise<void> {
  const {
    label,
    durationMs = 0,
    color = '#10b981',
    dim = true,
    borderWidth = 3,
  } = options;

  await ensureStyles(page);

  try {
    // Get the bounding box of the target element
    const box = await locator.boundingBox();
    if (!box) {
      console.warn('[highlight] Element has no bounding box, skipping highlight');
      return;
    }

    const padding = 6;

    await page.evaluate(
      ({ box, pad, color, borderWidth, dim, label, overlayId, highlightId, labelId }) => {
        // Adjust viewport coordinates to document coordinates
        const docX = box.x + window.scrollX;
        const docY = box.y + window.scrollY;

        // Position highlight box
        const hl = document.getElementById(highlightId)!;
        hl.style.left = `${docX - pad}px`;
        hl.style.top = `${docY - pad}px`;
        hl.style.width = `${box.width + pad * 2}px`;
        hl.style.height = `${box.height + pad * 2}px`;
        hl.style.borderColor = color;
        hl.style.borderWidth = `${borderWidth}px`;
        hl.style.boxShadow = `0 0 0 4px ${color}40, 0 0 20px ${color}25`;
        hl.classList.add('visible');

        // Show/hide dim overlay
        const overlay = document.getElementById(overlayId)!;
        if (dim) {
          overlay.classList.add('visible');
        } else {
          overlay.classList.remove('visible');
        }

        // Position label
        const lb = document.getElementById(labelId)!;
        if (label) {
          lb.textContent = label;
          lb.style.background = color;
          lb.style.left = `${docX - pad}px`;
          lb.style.top = `${docY - pad - 30}px`;
          lb.classList.add('visible');
        } else {
          lb.classList.remove('visible');
        }
      },
      {
        box: { x: box.x, y: box.y, width: box.width, height: box.height },
        pad: padding,
        color,
        borderWidth,
        dim,
        label: label || null,
        overlayId: OVERLAY_ID,
        highlightId: HIGHLIGHT_ID,
        labelId: LABEL_ID,
      },
    );

    // Wait for the fade-in transition
    await page.waitForTimeout(350);

    // Auto-clear after duration if specified
    if (durationMs > 0) {
      await page.waitForTimeout(durationMs);
      await clearHighlight(page);
    }
  } catch (err) {
    console.warn(`[highlight] Could not highlight element: ${err}`);
  }
}

/**
 * Highlight with a label — convenience wrapper.
 */
export async function highlightWithLabel(
  page: Page,
  locator: Locator,
  label: string,
  options: Omit<HighlightOptions, 'label'> = {},
): Promise<void> {
  await highlight(page, locator, { ...options, label });
}

/**
 * Clear all highlight overlays from the page.
 */
export async function clearHighlight(page: Page): Promise<void> {
  try {
    await page.evaluate(
      ({ overlayId, highlightId, labelId }) => {
        document.getElementById(overlayId)?.classList.remove('visible');
        document.getElementById(highlightId)?.classList.remove('visible');
        document.getElementById(labelId)?.classList.remove('visible');
      },
      { overlayId: OVERLAY_ID, highlightId: HIGHLIGHT_ID, labelId: LABEL_ID },
    );
    // Wait for fade-out
    await page.waitForTimeout(350);
  } catch {
    // Page might have navigated
  }
}

/**
 * Pulse highlight — briefly flash an element to draw attention.
 */
export async function pulseHighlight(
  page: Page,
  locator: Locator,
  options: HighlightOptions = {},
): Promise<void> {
  await highlight(page, locator, { ...options, durationMs: 1500 });
}
