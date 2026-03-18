# DashWright Demo

> Sample Playwright test artifacts for trying **DashWright** - no setup required.

## Try DashWright Now

1. Go to **[dashwright.com](https://dashwright.com)**
2. Select **Manual Entry**
3. Enter:
   - **Owner:** `dashwright`
   - **Repo:** `dashwright-demo`
4. Click **Generate** to see your dashboard!

## What's Inside

This repository contains sample Playwright test artifacts with:

- Multiple branches (main, develop, feature branches)
- Mixed test outcomes (pass/fail)
- Various run scenarios

These artifacts power the DashWright demo so you can experience the full dashboard generation flow without setting up your own Playwright project.

## About DashWright

DashWright transforms raw Playwright test artifacts into beautiful, interactive dashboards.

- **9 Design Themes:** From Art Deco to Cyberpunk
- **GitHub Integration:** Pull artifacts directly from your workflows
- **Exportable:** Download as self-contained ZIP

Learn more at **[dashwright.com](https://dashwright.com)**

## Playwright Tests

Browser automation tests using Playwright with Chromium.

### Install

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Run Tests with UI

```bash
npx playwright test --ui
```

### CI

- Push to `main` triggers tests automatically
- Manual run via GitHub Actions "Workflow dispatch"

## Issues & Feedback

Found a bug or have a suggestion? [Open an issue](https://github.com/dashwright/dashwright-demo/issues)!

## License

MIT
