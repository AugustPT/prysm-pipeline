import { chromium } from 'playwright';
import * as path from 'path';

async function capture() {
  console.log('--- Capturing Live Vercel Mobile Screenshot ---');
  const browser = await chromium.launch({ headless: true });
  
  // Emulate an iPhone 12 Pro (390 x 844)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();

  try {
    console.log('Navigating to live production app at https://prysm-app.vercel.app...');
    await page.goto('https://prysm-app.vercel.app', { waitUntil: 'networkidle' });

    // 1. Click Demo Presenter Login button
    console.log('Clicking Demo Presenter Login button...');
    const demoButton = page.getByRole('button', { name: 'Demo Presenter Login', exact: true });
    await demoButton.waitFor({ state: 'visible', timeout: 5000 });
    await demoButton.click();
    await page.waitForTimeout(2000);

    // 2. Click Start Assessment
    console.log('Navigating to Card 2...');
    const startButton = page.getByRole('button', { name: 'Start Assessment →', exact: true });
    await startButton.click();
    await page.waitForTimeout(1000);

    // 3. Click See Recommendations
    console.log('Navigating to Card 3...');
    const recsButton = page.getByRole('button', { name: 'See Recommendations →', exact: true });
    await recsButton.click();
    await page.waitForTimeout(1000);

    // 4. Capture Card 3: Recommendations & Close
    console.log('Taking screenshot of live Vercel Card 3 (Fit & Close)...');
    const card3Path = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_vercel_mobile.png');
    await page.screenshot({ path: card3Path });
    console.log(`Saved Vercel Card 3 screenshot: ${card3Path}`);

  } catch (err: any) {
    console.error('Error during Vercel mobile screenshot process:', err.message);
  } finally {
    await browser.close();
  }
}

capture();
