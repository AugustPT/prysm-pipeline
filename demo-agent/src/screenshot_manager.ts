import { chromium } from 'playwright';
import * as path from 'path';

async function capture() {
  console.log('--- Capturing Corporate Manager Dashboard Screenshots ---');
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
    deviceScaleFactor: 1.5,
  });
  
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:5199...');
    await page.goto('http://localhost:5199', { waitUntil: 'networkidle' });

    // 1. Capture Login Screen (showing the new Demo Manager Login button)
    console.log('Taking screenshot of Login Screen with manager options...');
    const loginPath = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_manager_login.png');
    await page.screenshot({ path: loginPath });
    console.log(`Saved login screen: ${loginPath}`);

    // 2. Click Demo Manager Login
    console.log('Logging in as Manager...');
    const managerButton = page.getByRole('button', { name: 'Demo Manager Login', exact: true });
    await managerButton.waitFor({ state: 'visible', timeout: 5000 });
    await managerButton.click();
    await page.waitForTimeout(2000);

    // 3. Capture Manager Dashboard (Global metrics, salesperson leaderboard, full database)
    console.log('Taking screenshot of Corporate Manager Dashboard...');
    const dashboardPath = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_manager_dashboard.png');
    await page.screenshot({ path: dashboardPath });
    console.log(`Saved dashboard: ${dashboardPath}`);

    // 4. Select Alex from Salesperson dropdown filter
    console.log('Filtering database by Alex...');
    const selectPresenter = page.locator('select').first();
    await selectPresenter.selectOption({ label: 'Alex' });
    await page.waitForTimeout(1000);

    // 5. Capture Filtered Dashboard
    console.log('Taking screenshot of Filtered Manager Dashboard...');
    const filteredPath = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_manager_filtered.png');
    await page.screenshot({ path: filteredPath });
    console.log(`Saved filtered view: ${filteredPath}`);

    // 6. Click View Companion for Alex (in the performance leaderboard table)
    console.log('Masquerading as Alex...');
    const viewAlexButton = page.locator('table').first().getByRole('button', { name: /View Companion/i }).nth(1); // second row is Alex
    await viewAlexButton.click();
    await page.waitForTimeout(2000);

    // 7. Capture Masquerading View (showing top banner and Alex's companion dashboard)
    console.log('Taking screenshot of Masquerade Companion View...');
    const masqueradePath = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_manager_masquerade.png');
    await page.screenshot({ path: masqueradePath });
    console.log(`Saved masquerade view: ${masqueradePath}`);

    // 8. Exit Masquerade
    console.log('Exiting masquerade mode...');
    const exitButton = page.getByRole('button', { name: 'Exit Masquerade', exact: true });
    await exitButton.click();
    await page.waitForTimeout(1500);

    // 9. Capture Returned Manager Dashboard
    console.log('Taking final screenshot after returning to Manager Dashboard...');
    const returnPath = path.join('C:/Users/august/.gemini/antigravity/brain/b9d3944b-fb70-4668-8ff9-77d8ec9d89f9/screenshot_manager_returned.png');
    await page.screenshot({ path: returnPath });
    console.log(`Saved returned dashboard: ${returnPath}`);

  } catch (err: any) {
    console.error('Error during manager screenshot process:', err.message);
  } finally {
    await browser.close();
  }
}

capture();
