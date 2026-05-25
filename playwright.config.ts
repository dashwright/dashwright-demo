/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Ensure .env from the demo folder is loaded when Playwright is started
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Dashwright reporter configuration reads from environment variables so you can
// customize per-machine or CI. Defaults assume the local compose mapping.
const DASHWRIGHT_API_URL =
  process.env.DASHWRIGHT_API_URL || "http://localhost:3205";
const DASHWRIGHT_API_TOKEN = process.env.DASHWRIGHT_API_TOKEN || "";
const DASHWRIGHT_ORG_ID = process.env.DASHWRIGHT_ORG_ID || "";

export default defineConfig({
  testDir: "./tests/playwright",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Combined reporters: the Dashwright reporter + existing helpful reporters
  reporter: [
    [
      "@dashwright/playwright-reporter",
      {
        apiUrl: DASHWRIGHT_API_URL,
        apiToken: DASHWRIGHT_API_TOKEN,
        organizationId: DASHWRIGHT_ORG_ID,
        uploadScreenshots: true,
        uploadVideos: true,
        uploadTraces: true,
        retryAttempts: 3,
        retryDelay: 1000,
      },
    ],
    ["html", { outputFolder: "test-reports/playwright-report", open: "never" }],
    [
      "monocart-reporter",
      {
        name: "DashWright Report",
        outputFile: "test-reports/monocart-report/index.html",
      },
    ],
    ["list"],
    ["playwright-ctrf-json-reporter", { outputDir: "test-reports/ctrf-report" }],
  ],

  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  outputDir: "test-reports/playwright-results",

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
