const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

async function testSignup() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(`PAGE ERROR: ${err.message}`));
  page.on('response', resp => {
    if (resp.status() >= 400) networkErrors.push(`${resp.status()} ${resp.url()}`);
  });

  try {
    console.log('1. Opening login page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'screenshots/01-login-page.png' });

    console.log('2. Clicking Sign Up tab...');
    // react-web-tabs uses <li> with data or just text content
    await page.getByText('Sign Up').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/02-signup-tab.png' });

    console.log('3. Entering first name...');
    await page.locator('input[name="firstName"]').filter({ visible: true }).first().fill('Test');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'screenshots/03-firstname.png' });

    // Find Next button (not Login button)
    const nextBtn = page.locator('button').filter({ hasText: /next|→|>/i }).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
    } else {
      await page.locator('input[name="firstName"]').filter({ visible: true }).first().press('Enter');
    }
    await page.waitForTimeout(600);

    console.log('4. Entering last name...');
    await page.locator('input[name="lastName"]').filter({ visible: true }).first().fill('User');
    await page.locator('input[name="lastName"]').filter({ visible: true }).first().press('Enter');
    await page.waitForTimeout(600);

    console.log('5. Entering email...');
    const email = `testuser${Date.now()}@example.com`;
    const emailInput = page.locator('input[name="companyEmail"], input[type="email"]').filter({ visible: true }).first();
    await emailInput.fill(email);
    await emailInput.press('Enter');
    await page.waitForTimeout(600);

    console.log('6. Entering organization name...');
    const orgInput = page.locator('input[name="organizationName"]').filter({ visible: true }).first();
    await orgInput.waitFor({ state: 'visible', timeout: 8000 });
    await orgInput.fill('TestOrg' + Date.now());
    await orgInput.press('Enter');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/04-org-name.png' });

    console.log('7. Waiting for password step...');
    // Wait for password input to become visible
    await page.locator('input[name="password"]').filter({ visible: true }).first().waitFor({ state: 'visible', timeout: 8000 });
    await page.locator('input[name="password"]').filter({ visible: true }).first().fill('TestPass123!');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/05-password.png' });

    // Confirm password if visible
    const confirmInput = page.locator('input[name="confirmPassword"]').filter({ visible: true }).first();
    if (await confirmInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmInput.fill('TestPass123!');
    }

    console.log('8. Submitting form...');
    const submitBtn = page.locator('button[type="submit"]').filter({ visible: true }).first();
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
    } else {
      await page.locator('input[name="password"]').filter({ visible: true }).first().press('Enter');
    }

    console.log('   Waiting for backend response (up to 8s)...');
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'screenshots/06-after-submit.png' });

    const currentUrl = page.url();
    console.log('\nCurrent URL:', currentUrl);

    // Grab visible alert/toast text
    const alertText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.s-alert-box-inner, .s-alert-box, [class*="toast"]'))
        .map(el => el.textContent.trim()).filter(t => t.length > 0);
    });

    console.log('\n--- Network errors (last 10):', networkErrors.slice(-10));
    if (consoleErrors.length) console.log('--- Console errors:', consoleErrors.slice(-5));
    if (alertText.length) console.log('--- Visible alerts:', alertText);

    if (currentUrl.includes('dashboard') || currentUrl.includes('/home')) {
      console.log('\n✅ SIGNUP SUCCESSFUL');
    } else {
      console.log('\n❌ Signup did not redirect to dashboard. Still at:', currentUrl);
    }

  } catch (err) {
    console.error('\nTest error:', err.message);
    await page.screenshot({ path: 'screenshots/error.png' }).catch(() => {});
    console.log('Network errors:', networkErrors.slice(-5));
    console.log('Console errors:', consoleErrors.slice(-5));
  } finally {
    await browser.close();
  }
}

testSignup().catch(console.error);
