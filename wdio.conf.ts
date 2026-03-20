export const config = {
  runner: 'local',
  specs: ['./tests/wdio/specs/**/*.ts'],
  exclude: [],
  capabilities: [{
    browserName: 'chromium',
  }],
  logLevel: 'silent',
  baseUrl: 'https://www.saucedemo.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  outputDir: './test-reports/wdio-report',
  reporters: [
    'dot',
    ['junit', { outputDir: './test-reports/wdio-report' }]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
};
