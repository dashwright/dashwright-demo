import type { Options } from '@wdio/testrunner';

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./tests/wdio/specs/**/*.ts'],
  exclude: [],
  capabilities: [{
    browserName: 'chromium',
    'goog:chromeOptions': {
      args: ['--headless', '--no-sandbox'],
    },
  }],
  logLevel: 'info',
  baseUrl: 'https://example.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: 'mocha',
  reporters: [['spec', { showStack: true }]],
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
};
