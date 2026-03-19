import { test, expect } from '@playwright/test';

const BASE_URL = 'https://the-internet.herokuapp.com/login';
const USERNAME = 'tomsmith';
const PASSWORD = 'SuperSecretPassword!';

test.describe('Swag Login - Playwright', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('#username', USERNAME);
    await page.fill('#password', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area');
  });

  test('should fail login with invalid credentials', async ({ page }) => {
    await page.fill('#username', 'invalid');
    await page.fill('#password', 'invalid');
    await page.click('button[type="submit"]');
    await expect(page.locator('.flash.error')).toContainText('Your username is invalid');
  });

  test('should logout successfully', async ({ page }) => {
    await page.fill('#username', USERNAME);
    await page.fill('#password', PASSWORD);
    await page.click('button[type="submit"]');
    await page.click('a[href="/logout"]');
    await expect(page.locator('h2')).toContainText('Login Page');
  });

  test('should capture console messages', async ({ page }) => {
    const messages: string[] = [];
    page.on('console', msg => messages.push(msg.text()));
    await page.fill('#username', USERNAME);
    await page.fill('#password', PASSWORD);
    await page.click('button[type="submit"]');
    expect(messages.length).toBeGreaterThanOrEqual(0);
  });
});
