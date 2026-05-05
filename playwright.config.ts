import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const localChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1'
  ? ({ browserName: 'chromium' as const, channel: 'chrome' as const })
  : {};

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  workers: process.env.CI ? 2 : 4,
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'E2E_BYPASS_ADMIN_AUTH=1 npm run build && E2E_BYPASS_ADMIN_AUTH=1 npm run start',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      },
  use: {
    baseURL,
  },
  projects: [
    {
      name: 'Mobile Safari',
	      use: { ...devices['iPhone 13'], ...localChrome },
    },
  ],
});

