# DashWright Demo

> Sample Playwright test artifacts for trying **DashWright** — no setup required.

## Try DashWright Now

### GitHub Actions

1. Visit **[dashwright.com](https://dashwright.com)**
2. Click **Launch Dashboard with GitHub** to sign in via OAuth
3. You should land on `https://dashwright.com/dashboard/`
4. In the **GitHub** tab on the sidebar, enter:
   - **Repository:** `dashwright/dashwright-demo`
   - **Artifact Names:** `playwright-report`, `cypress-report`, or `monocart-report` (or all three)
   - **Design:** Free tier defaults to **Obsidian** — select it if not already chosen
5. Click **Generate**

### Azure DevOps

After signing in with GitHub, switch the source toggle to **Azure**. Enter your organisation PAT (Build Read scope only). DashWright will load your organisations, projects, and pipelines for selection.

Your PAT is held in a signed HttpOnly session cookie — it is never stored in the browser or logged server-side.

### GitLab CI

After signing in with GitHub, switch the source toggle to **GitLab**. Enter a PAT with `read_api` scope, then select:

- **Project:** `qa8620938/dashwright-demo`
- **Artifact Names:** `playwright-report`, `cypress-report`, or `monocart-report` (or all three)

## What's Inside

This repository contains sample Playwright, Monocart, and Cypress test artifacts covering:

- Multiple branches (main, develop, feature branches)
- Mixed test outcomes (pass/fail)
- Various run scenarios

These artifacts power the DashWright demo so you can experience the full dashboard generation flow without setting up your own test project.

## About DashWright

DashWright transforms raw Playwright test artifacts into beautiful, interactive dashboards.

- **7 Design Themes:** Art Deco, Cyberglow, Cyberpunk, Forest, Glassmorphism, Pastel, Obsidian
- **Multi-source:** GitHub Actions, Azure DevOps, GitLab CI
- **Exportable:** Download as a self-contained ZIP

Learn more at **[dashwright.com](https://dashwright.com)**

## Issues & Feedback

Found a bug or have a suggestion? [Open an issue](https://github.com/dashwright/dashwright-demo/issues)

## License
