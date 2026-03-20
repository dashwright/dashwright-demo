import { defineConfig } from 'cypress';
import * as fs from 'fs';
import { execSync } from 'child_process';

export default defineConfig({
  e2e: {
    browser: 'electron',
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'https://www.saucedemo.com',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'test-reports/cypress-report/screenshots',
    reporter: 'mocha-junit-reporter',
    reporterOptions: {
      mochaFile: 'test-reports/cypress-report/test-results.xml',
      toConsole: true
    },
    setupNodeEvents: () => {},
  },
});
