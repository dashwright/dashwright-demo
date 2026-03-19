import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    browser: 'chrome',
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'https://www.saucedemo.com',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'test-reports/cypress/screenshots',
    reporter: 'spec',
    reporterOptions: {
      reportDir: 'test-reports/cypress',
      overwrite: false,
    },
  },
});
