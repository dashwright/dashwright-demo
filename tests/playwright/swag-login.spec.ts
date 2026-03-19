import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

async function login(page, username, password) {
  await page.fill('[id="user-name"]', username);
  await page.fill('[id="password"]', password);
  await page.click('[id="login-button"]');
}

test.describe('Swag Login - Playwright', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Valid Login - Standard User', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page.url()).toMatch('inventory.html');
  });

  test('Invalid Login - Locked Out User', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');
    await expect(page.locator('//div/h3')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Invalid Login - Wrong username', async ({ page }) => {
    await login(page, 'wrong_username', 'secret_sauce');
    await expect(page.locator('//div/h3')).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('Invalid Login - Wrong password', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_password');
    await expect(page.locator('//div/h3')).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('Invalid Login - Empty username', async ({ page }) => {
    await login(page, '', 'secret_sauce');
    await expect(page.locator('//div/h3')).toHaveText('Epic sadface: Username is required');
  });

  test('Invalid Login - Empty password', async ({ page }) => {
    await login(page, 'standard_user', '');
    await expect(page.locator('//div/h3')).toHaveText('Epic sadface: Password is required');
  });

  test('Valid Login - Problem User', async ({ page }) => {
    await login(page, 'problem_user', 'secret_sauce');
    await expect(page.url()).toMatch('inventory.html');
  });

  test('Valid Login - Performance Glitch User', async ({ page }) => {
    await login(page, 'performance_glitch_user', 'secret_sauce');
    await expect(page.url()).toMatch('inventory.html');
  });

  test('Valid Login - Error User', async ({ page }) => {
    await login(page, 'error_user', 'secret_sauce');
    await expect(page.url()).toMatch('inventory.html');
  });

  test('Valid Login - Visual User', async ({ page }) => {
    await login(page, 'visual_user', 'secret_sauce');
    await expect(page.url()).toMatch('inventory.html');
  });
});
