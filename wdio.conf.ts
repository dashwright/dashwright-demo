import type { Options } from 'webdriver';

export const config: Options.Testrunner = {
  runner: 'local',
  rootDir: './',
  specs: ['tests/wdio/specs/**/*.ts'],
  exclude: [],
  capabilities: [{
    browserName: 'chromium',
    'goog:chromeOptions': {
      args: ['--no-sandbox'],
    },
  }],
  logLevel: 'info',
  baseUrl: 'https://www.saucedemo.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  // services: ['devtools'],
  framework: 'mocha',
  outputDir: './test-reports/wdio-report',
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
};
