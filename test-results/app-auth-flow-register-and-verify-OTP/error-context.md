# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> auth flow >> register and verify OTP
- Location: e2e\app.spec.ts:50:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:57081/(auth)/register?role=traveler", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import http from 'http';
  3   | test.setTimeout(60000);
  4   | const BASE_URL = 'http://localhost:57081';
  5   | const MAILHOG_URL = 'http://localhost:58025';
  6   | let testEmail: string;
  7   | const testPassword = 'Testpass123';
  8   | const testName = 'Test User';
  9   | function makeUniqueEmail(): string {
  10  |   return `veakay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;
  11  | }
  12  | async function getOtpForEmail(email: string): Promise<string> {
  13  |   return new Promise((resolve, reject) => {
  14  |     http.get(MAILHOG_URL + '/api/v2/messages', (res) => {
  15  |       let body = '';
  16  |       res.on('data', (chunk) => {
  17  |         body += chunk;
  18  |       });
  19  |       res.on('end', () => {
  20  |         try {
  21  |           const data = JSON.parse(body);
  22  |           const messages: any[] = data.items || data.Messages || [];
  23  |           const matched = messages.find((m) => {
  24  |             const to = m.To || [];
  25  |             return Array.isArray(to) && to.some((t: any) => t.Email === email);
  26  |           });
  27  |           if (!matched) {
  28  |             reject(new Error('No email found for ' + email));
  29  |             return;
  30  |           }
  31  |           const bodyData = matched.Body?.data || matched.Body || matched.data || '';
  32  |           const text = typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData);
  33  |           const match = text.match(/\b\d{6}\b/);
  34  |           if (!match) {
  35  |             reject(new Error('No 6-digit OTP found in email body'));
  36  |             return;
  37  |           }
  38  |           resolve(match[0]);
  39  |         } catch (err) {
  40  |           reject(err);
  41  |         }
  42  |       });
  43  |     }).on('error', reject);
  44  |   });
  45  | }
  46  | test.describe.serial('auth flow', () => {
  47  |   test.beforeAll(() => {
  48  |     testEmail = makeUniqueEmail();
  49  |   });
  50  |   test('register and verify OTP', async ({ page }) => {
  51  |     test.setTimeout(60000);
> 52  |     await page.goto(BASE_URL + '/(auth)/register?role=traveler', { waitUntil: 'domcontentloaded', timeout: 60000 });
      |                ^ Error: page.goto: Test timeout of 60000ms exceeded.
  53  |     await page.waitForSelector('input[placeholder="Your name"]', { timeout: 30000 });
  54  |     await page.getByPlaceholder('Your name').fill(testName);
  55  |     await page.getByPlaceholder('Enter your email').fill(testEmail);
  56  |     await page.getByPlaceholder('Create a password').fill(testPassword);
  57  |     const checkbox = page.getByRole('checkbox');
  58  |     if (!(await checkbox.count())) {
  59  |       await page.getByLabel('Agree to terms').click();
  60  |     } else {
  61  |       await checkbox.click();
  62  |     }
  63  |     await page.getByRole('button', { name: 'Sign Up' }).click();
  64  |     await page.waitForURL(/verify-otp/);
  65  |     const otp = await getOtpForEmail(testEmail);
  66  |     const inputs = page.locator('input[maxlength="1"]');
  67  |     for (let i = 0; i < 6; i++) {
  68  |       await inputs.nth(i).fill(otp[i]);
  69  |     }
  70  |     await page.getByRole('button', { name: 'Verify & Continue' }).click();
  71  |     await page.waitForURL(/traveler/);
  72  |     await expect(page.locator('text=Veakay')).toBeVisible();
  73  |   });
  74  |   test('login with password', async ({ page }) => {
  75  |     test.setTimeout(60000);
  76  |     await page.goto(BASE_URL + '/(auth)/login?role=traveler', { waitUntil: 'domcontentloaded', timeout: 60000 });
  77  |     await page.waitForSelector('input[placeholder="Enter your email"]', { timeout: 30000 });
  78  |     await page.getByPlaceholder('Enter your email').fill(testEmail);
  79  |     await page.getByPlaceholder('Enter your password').fill(testPassword);
  80  |     await page.getByRole('button', { name: 'Log In' }).click();
  81  |     await page.waitForURL(/traveler/);
  82  |     await expect(page.locator('text=Veakay')).toBeVisible();
  83  |   });
  84  |   test('navigation home', async ({ page }) => {
  85  |     test.setTimeout(60000);
  86  |     await page.getByRole('button', { name: 'Home', exact: true }).click();
  87  |     await expect(page).toHaveURL(/traveler/);
  88  |   });
  89  |   test('navigation explore', async ({ page }) => {
  90  |     test.setTimeout(60000);
  91  |     await page.getByRole('button', { name: 'Explore', exact: true }).click();
  92  |     await expect(page).toHaveURL(/explore/);
  93  |   });
  94  |   test('navigation campaigns', async ({ page }) => {
  95  |     test.setTimeout(60000);
  96  |     await page.getByRole('button', { name: 'Campaigns', exact: true }).click();
  97  |     await expect(page).toHaveURL(/campaigns/);
  98  |   });
  99  |   test('navigation wallet', async ({ page }) => {
  100 |     test.setTimeout(60000);
  101 |     await page.getByRole('button', { name: 'Wallet', exact: true }).click();
  102 |     await expect(page).toHaveURL(/wallet/);
  103 |   });
  104 |   test('navigation profile', async ({ page }) => {
  105 |     test.setTimeout(60000);
  106 |     await page.getByRole('button', { name: 'Profile', exact: true }).click();
  107 |     await expect(page).toHaveURL(/profile/);
  108 |   });
  109 |   test('create post page', async ({ page }) => {
  110 |     test.setTimeout(60000);
  111 |     await page.getByRole('button', { name: '+'}).click();
  112 |     await page.waitForURL(/create-post/);
  113 |     await expect(page.locator('text=Create Post')).toBeVisible();
  114 |   });
  115 | });
  116 | test('welcome screen loads', async ({ page }) => {
  117 |   test.setTimeout(60000);
  118 |   await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  119 |   await expect(page.locator('text=Welcome to Vaykae')).toBeVisible();
  120 | });
  121 | test('app handles errors gracefully', async ({ page }) => {
  122 |   test.setTimeout(60000);
  123 |   await page.goto(BASE_URL + '/(traveler)/nonexistent-route', { waitUntil: 'domcontentloaded', timeout: 60000 });
  124 |   await page.waitForSelector('text=Unmatched Route', { timeout: 10000 }).catch(() => {});
  125 |   const hasUnmatchedRoute = await page.locator('text=Unmatched Route').count() > 0;
  126 |   const hasNotFound = await page.locator('text=Page could not be found').count() > 0;
  127 |   const hasError = await page.locator('text=Something went wrong').count() > 0;
  128 |   expect(hasUnmatchedRoute || hasNotFound || hasError).toBeTruthy();
  129 | });
  130 | 
```