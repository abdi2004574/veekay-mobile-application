import { test, expect } from '@playwright/test';
import http from 'http';
test.setTimeout(60000);
const BASE_URL = 'http://localhost:57081';
const MAILHOG_URL = 'http://localhost:58025';
let testEmail: string;
const testPassword = 'Testpass123';
const testName = 'Test User';
function makeUniqueEmail(): string {
  return `veakay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;
}
async function getOtpForEmail(email: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(MAILHOG_URL + '/api/v2/messages', (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          const messages: any[] = data.items || data.Messages || [];
          const matched = messages.find((m) => {
            const to = m.To || [];
            return Array.isArray(to) && to.some((t: any) => t.Email === email);
          });
          if (!matched) {
            reject(new Error('No email found for ' + email));
            return;
          }
          const bodyData = matched.Body?.data || matched.Body || matched.data || '';
          const text = typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData);
          const match = text.match(/\b\d{6}\b/);
          if (!match) {
            reject(new Error('No 6-digit OTP found in email body'));
            return;
          }
          resolve(match[0]);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}
test.describe.serial('auth flow', () => {
  test.beforeAll(() => {
    testEmail = makeUniqueEmail();
  });
  test('register and verify OTP', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL + '/(auth)/register?role=traveler', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('input[placeholder="Your name"]', { timeout: 30000 });
    await page.getByPlaceholder('Your name').fill(testName);
    await page.getByPlaceholder('Enter your email').fill(testEmail);
    await page.getByPlaceholder('Create a password').fill(testPassword);
    const checkbox = page.getByRole('checkbox');
    if (!(await checkbox.count())) {
      await page.getByLabel('Agree to terms').click();
    } else {
      await checkbox.click();
    }
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.waitForURL(/verify-otp/);
    const otp = await getOtpForEmail(testEmail);
    const inputs = page.locator('input[maxlength="1"]');
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).fill(otp[i]);
    }
    await page.getByRole('button', { name: 'Verify & Continue' }).click();
    await page.waitForURL(/traveler/);
    await expect(page.locator('text=Veakay')).toBeVisible();
  });
  test('login with password', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(BASE_URL + '/(auth)/login?role=traveler', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('input[placeholder="Enter your email"]', { timeout: 30000 });
    await page.getByPlaceholder('Enter your email').fill(testEmail);
    await page.getByPlaceholder('Enter your password').fill(testPassword);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(/traveler/);
    await expect(page.locator('text=Veakay')).toBeVisible();
  });
  test('navigation home', async ({ page }) => {
    test.setTimeout(60000);
    await page.getByRole('button', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/traveler/);
  });
  test('navigation explore', async ({ page }) => {
    test.setTimeout(60000);
    await page.getByRole('button', { name: 'Explore', exact: true }).click();
    await expect(page).toHaveURL(/explore/);
  });
  test('navigation campaigns', async ({ page }) => {
    test.setTimeout(60000);
    await page.getByRole('button', { name: 'Campaigns', exact: true }).click();
    await expect(page).toHaveURL(/campaigns/);
  });
  test('navigation wallet', async ({ page }) => {
    test.setTimeout(60000);
    await page.getByRole('button', { name: 'Wallet', exact: true }).click();
    await expect(page).toHaveURL(/wallet/);
  });
  test('navigation profile', async ({ page }) => {
    test.setTimeout(60000);
    await page.getByRole('button', { name: 'Profile', exact: true }).click();
    await expect(page).toHaveURL(/profile/);
  });
  test('create post page', async ({ page }) => {
    test.setTimeout(60000);
    await page.getByRole('button', { name: '+'}).click();
    await page.waitForURL(/create-post/);
    await expect(page.locator('text=Create Post')).toBeVisible();
  });
});
test('welcome screen loads', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.locator('text=Welcome to Vaykae')).toBeVisible();
});
test('app handles errors gracefully', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(BASE_URL + '/(traveler)/nonexistent-route', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('text=Unmatched Route', { timeout: 10000 }).catch(() => {});
  const hasUnmatchedRoute = await page.locator('text=Unmatched Route').count() > 0;
  const hasNotFound = await page.locator('text=Page could not be found').count() > 0;
  const hasError = await page.locator('text=Something went wrong').count() > 0;
  expect(hasUnmatchedRoute || hasNotFound || hasError).toBeTruthy();
});
