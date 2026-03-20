import { defineConfig } from 'cypress';
import * as fs from 'fs';

export default defineConfig({
  e2e: {
    browser: 'electron',
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'https://www.saucedemo.com',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'test-reports/cypress-report/screenshots',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'test-reports/cypress-report',
      overwrite: true,
      html: true,
      json: false
    },
    setupNodeEvents: () => {
      const jsonPath = 'test-reports/cypress-report/mochawesome.json';
      if (fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath);
      }
    },
  },
});
