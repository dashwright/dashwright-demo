# E2E Test Automation

Multi-framework browser automation tests using **4 testing tools** with Chromium:

- 🎭 **Playwright** (TypeScript)
- 🕷️ **WebdriverIO** (JavaScript)
- 🔷 **Cypress** (JavaScript)
- 🌈 **Selenium** (JavaScript)

## Install

```bash
npm install
```

## Run Tests

### All Frameworks
```bash
npm run test:playwright
npm run test:wdio
npm run test:cypress
npm run test:selenium
```

### Individual Frameworks
```bash
# Playwright with UI
npx playwright test --ui

# WebdriverIO
npx wdio run wdio.conf.ts

# Cypress
npx cypress run --browser chrome

# Selenium
node tests/selenium/swag-login.spec.js
```

## Test Site

Tests use [Saucedemo](https://www.saucedemo.com) - a demo e-commerce site for E2E testing.

## Report Locations

All reports are saved in `test-reports/` folder:

```
test-reports/
├── playwright/     # Playwright HTML report
├── cypress/       # Cypress report + screenshots
├── wdio/          # WebdriverIO report
└── selenium/      # Selenium output
```

## CI

- Push to `main` triggers all tests automatically
- Manual run via GitHub Actions "Workflow dispatch"
