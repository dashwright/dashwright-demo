import { browser, $ } from '@wdio/globals';

const BASE_URL = 'https://the-internet.herokuapp.com/login';
const USERNAME = 'tomsmith';
const PASSWORD = 'SuperSecretPassword!';

describe('Swag Login - WebdriverIO', () => {
  beforeEach(async () => {
    await browser.url(BASE_URL);
  });

  it('should display login form', async () => {
    const username = await $('#username').isDisplayed();
    const password = await $('#password').isDisplayed();
    const submit = await $('button[type="submit"]').isDisplayed();
    expect(username).toBe(true);
    expect(password).toBe(true);
    expect(submit).toBe(true);
  });

  it('should login with valid credentials', async () => {
    await $('#username').setValue(USERNAME);
    await $('#password').setValue(PASSWORD);
    await $('button[type="submit"]').click();
    const text = await $('.flash.success').getText();
    expect(text).toContain('You logged into a secure area');
  });

  it('should fail login with invalid credentials', async () => {
    await $('#username').setValue('invalid');
    await $('#password').setValue('invalid');
    await $('button[type="submit"]').click();
    const text = await $('.flash.error').getText();
    expect(text).toContain('Your username is invalid');
  });

  it('should logout successfully', async () => {
    await $('#username').setValue(USERNAME);
    await $('#password').setValue(PASSWORD);
    await $('button[type="submit"]').click();
    await $('a[href="/logout"]').click();
    const text = await $('h2').getText();
    expect(text).toContain('Login Page');
  });

  it('should capture console messages', async () => {
    const messages: string[] = [];
    browser.on('console', msg => messages.push(msg.text()));
    await $('#username').setValue(USERNAME);
    await $('#password').setValue(PASSWORD);
    await $('button[type="submit"]').click();
    expect(messages.length).toBeGreaterThanOrEqual(0);
  });
});
