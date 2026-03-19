import { browser, $ } from '@wdio/globals';

const BASE_URL = 'https://www.saucedemo.com';

async function login(username, password) {
  await $('#user-name').setValue(username);
  await $('#password').setValue(password);
  await $('#login-button').click();
}

describe('Swag Login - WebdriverIO', () => {
  beforeEach(async () => {
    await browser.url(BASE_URL);
  });

  it('Valid Login - Standard User', async () => {
    await login('standard_user', 'secret_sauce');
    const url = await browser.getUrl();
    expect(url).toContain('inventory.html');
  });

  it('Invalid Login - Locked Out User', async () => {
    await login('locked_out_user', 'secret_sauce');
    const text = await $('[data-test="error"]').getText();
    expect(text).toContain('Sorry, this user has been locked out.');
  });

  it('Invalid Login - Wrong username', async () => {
    await login('wrong_username', 'secret_sauce');
    const text = await $('[data-test="error"]').getText();
    expect(text).toContain('Username and password do not match');
  });

  it('Invalid Login - Wrong password', async () => {
    await login('standard_user', 'wrong_password');
    const text = await $('[data-test="error"]').getText();
    expect(text).toContain('Username and password do not match');
  });

  it('Invalid Login - Empty username', async () => {
    await login('', 'secret_sauce');
    const text = await $('[data-test="error"]').getText();
    expect(text).toContain('Username is required');
  });

  it('Invalid Login - Empty password', async () => {
    await login('standard_user', '');
    const text = await $('[data-test="error"]').getText();
    expect(text).toContain('Password is required');
  });

  it('Valid Login - Problem User', async () => {
    await login('problem_user', 'secret_sauce');
    const url = await browser.getUrl();
    expect(url).toContain('inventory.html');
  });

  it('Valid Login - Performance Glitch User', async () => {
    await login('performance_glitch_user', 'secret_sauce');
    await browser.pause(1000);
    const url = await browser.getUrl();
    expect(url).toContain('inventory.html');
  });

  it('Valid Login - Error User', async () => {
    await login('error_user', 'secret_sauce');
    const url = await browser.getUrl();
    expect(url).toContain('inventory.html');
  });

  it('Valid Login - Visual User', async () => {
    await login('visual_user', 'secret_sauce');
    const url = await browser.getUrl();
    expect(url).toContain('inventory.html');
  });
});
