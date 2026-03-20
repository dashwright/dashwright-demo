# E2E Test Automation

Browser automation tests using **2 testing tools** with Chromium:

- 🎭 **Playwright** (TypeScript)
- 🔷 **Cypress** (JavaScript)

## Install

```bash
npm install
```

## Run Tests

```bash
# All frameworks
npm run test:playwright
npm run test:cypress

# Playwright
npm run test:playwright
npx playwright test --ui

# Cypress
npm run test:cypress
npx cypress run --browser chrome
```

## Test Site

Tests use [Saucedemo](https://www.saucedemo.com) - a demo e-commerce site for E2E testing.

## Report Locations

All reports are saved in `test-reports/` folder:

```
test-reports/
├── playwright-report/  # Playwright HTML report + CTRF JSON
├── cypress-report/     # Cypress HTML report
└── ctrf/              # CTRF JSON for GitHub integration
```

## CI

- Push to `main` triggers all tests automatically
- Manual run via GitHub Actions "Workflow dispatch"
