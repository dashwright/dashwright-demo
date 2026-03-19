import { browser, $, expect } from '@wdio/globals';

describe('WebdriverIO Browser Tests', () => {
  it('should load a webpage', async () => {
    await browser.url('https://example.com');
    const title = await browser.getTitle();
    expect(title).toContain('Example');
  });

  it('should find element on page', async () => {
    await browser.url('https://example.com');
    const heading = await $('h1');
    const text = await heading.getText();
    expect(text).toBe('Example Domain');
  });

  it('should handle navigation', async () => {
    await browser.url('https://example.com');
    await $('a').click();
    const url = await browser.getUrl();
    expect(url).toMatch(/iana\.org/);
  });

  it('should capture page content', async () => {
    await browser.url('https://example.com');
    const content = await browser.getPageSource();
    expect(content).toContain('Example');
  });

  it('should work with browser commands', async () => {
    await browser.url('https://example.com');
    const windowSize = await browser.getWindowSize();
    expect(windowSize.width).toBeGreaterThan(0);
  });
});
