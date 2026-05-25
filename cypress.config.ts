import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    browser: 'electron',
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    baseUrl: 'https://www.saucedemo.com',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'test-reports/cypress-report/screenshots',
    setupNodeEvents: () => {},
  },
});
