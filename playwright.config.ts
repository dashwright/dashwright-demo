import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'test-reports/playwright-report', open: 'never' }],
    ['list'],
    ['playwright-ctrf-json-reporter', { outputDir: 'test-reports/ctrf' }]
  ],
  use: {
    trace: 'on-first-retry',
  },
  outputDir: 'test-reports/playwright-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
