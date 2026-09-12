import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:57081',
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: {
    command: 'npx expo start --web --port 57081',
    port: 57081,
    timeout: 60000,
    reuseExistingServer: true,
  },
});
