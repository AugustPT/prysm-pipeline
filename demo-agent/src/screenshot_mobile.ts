import { chromium } from 'playwright';
import * as path from 'path';

async function capture() {
  console.log('--- Capturing Mobile Companion Screenshots ---');
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
    console.log('Navigating to local dev app at http://localhost:5199...');
    await page.goto('http://localhost:5199', { waitUntil: 'networkidle' });

    // 1. Capture Login Screen
    console.log('Taking screenshot of mobile Login Screen...');
    const loginPath = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_mobile_login.png');
    await page.screenshot({ path: loginPath });
    console.log(`Saved mobile Login screenshot: ${loginPath}`);

    // 2. Click Demo Presenter Login button
    console.log('Clicking Demo Presenter Login button...');
    const demoButton = page.getByRole('button', { name: 'Demo Presenter Login', exact: true });
    await demoButton.waitFor({ state: 'visible', timeout: 5000 });
    await demoButton.click();
    await page.waitForTimeout(2000);

    // 3. Capture Card 1: Opener & Hook
    console.log('Taking screenshot of Card 1 (Opening Hook)...');
    const card1Path = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_mobile_card1.png');
    await page.screenshot({ path: card1Path });
    console.log(`Saved Card 1 screenshot: ${card1Path}`);

    // 4. Click Start Assessment
    console.log('Navigating to Card 2...');
    const startButton = page.getByRole('button', { name: 'Start Assessment →', exact: true });
    await startButton.click();
    await page.waitForTimeout(1000);

    // 5. Click the first two questions to check them off
    console.log('Checking off Question 1 and Question 2...');
    await page.getByRole('button', { name: /Question 1/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Question 2/i }).click();
    await page.waitForTimeout(1000);

    // 6. Capture Card 2: Questions Checklist
    console.log('Taking screenshot of Card 2 (Core Questions checklist)...');
    const card2Path = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_mobile_card2.png');
    await page.screenshot({ path: card2Path });
    console.log(`Saved Card 2 screenshot: ${card2Path}`);

    // 7. Click See Recommendations
    console.log('Navigating to Card 3...');
    const recsButton = page.getByRole('button', { name: 'See Recommendations →', exact: true });
    await recsButton.click();
    await page.waitForTimeout(1000);

    // 8. Capture Card 3: Recommendations & Close
    console.log('Taking screenshot of Card 3 (Fit & Close)...');
    const card3Path = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_mobile_card3.png');
    await page.screenshot({ path: card3Path });
    console.log(`Saved Card 3 screenshot: ${card3Path}`);

  } catch (err: any) {
    console.error('Error during mobile screenshot process:', err.message);
  } finally {
    await browser.close();
  }
}

capture();
