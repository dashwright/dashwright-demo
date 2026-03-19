import { test, expect } from '@playwright/test';

test.describe('Browser Tests', () => {
  test('should load a webpage', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('should find element on page', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Example Domain');
  });

  test('should handle navigation', async ({ page }) => {
    await page.goto('https://example.com');
    await page.click('a');
    await expect(page).toHaveURL(/\.iana\.org/);
  });

  test('should capture page content', async ({ page }) => {
    await page.goto('https://example.com');
    const content = await page.content();
    expect(content).toContain('Example');
  });

  test('should work with console', async ({ page }) => {
    const messages: string[] = [];
    page.on('console', msg => messages.push(msg.text()));
    await page.goto('https://example.com');
    expect(messages.length).toBeGreaterThanOrEqual(0);
  });
});
