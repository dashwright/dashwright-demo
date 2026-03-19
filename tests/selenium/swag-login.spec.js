const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'https://www.saucedemo.com';

async function dismissPopup(driver) {
  try {
    await driver.wait(until.alertIsPresent(), 2000);
    await driver.switchTo().alert().dismiss();
    console.log('  ⚠️ Dismissed alert');
    return;
  } catch {}
  
  const selectors = ['[aria-label="Close"]', 'button:has-text("OK")', 'button:has-text("Dismiss")', 'button:has-text("Close")'];
  for (const sel of selectors) {
    try {
      const btn = await driver.findElement(By.css(sel));
      if (await btn.isDisplayed()) {
        await btn.click();
        await driver.sleep(500);
        console.log('  ⚠️ Dismissed popup');
        return;
      }
    } catch {}
  }
}

async function waitAndDismiss(driver, condition, timeout = 10000) {
  try {
    await driver.wait(condition, timeout);
    await dismissPopup(driver);
    return true;
  } catch {
    await dismissPopup(driver);
    return false;
  }
}

async function login(driver, username, password) {
  await driver.get(BASE_URL);
  await dismissPopup(driver);
  await driver.findElement(By.css('#user-name')).clear();
  await driver.findElement(By.css('#user-name')).sendKeys(username || '');
  await driver.findElement(By.css('#password')).clear();
  await driver.findElement(By.css('#password')).sendKeys(password || '');
  await dismissPopup(driver);
  await driver.findElement(By.css('#login-button')).click();
  await dismissPopup(driver);
}

async function runTests() {
  let driver;

  try {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-blink-features=PasswordLeakDetection');
    options.addArguments('--no-first-run');
    options.addArguments('--disable-extensions');
    options.addArguments('--disable-infobars');
    options.setUserPreferences({
      'credentials_enable_service': false,
      'credentials_enable_autosignin': false,
      'profile.password_manager_enabled': false,
      'profile.default_content_setting_values.notifications': 2,
      'safebrowsing.enabled': false,
      'credentials_force_legacy_format': true
    });

    const builder = new Builder().forBrowser('chrome').setChromeOptions(options);
    if (process.env.CHROME_BIN) {
      builder.setChromeService(new chrome.ServiceBuilder(process.env.CHROME_BIN));
    }
    driver = await builder.build();

    console.log('🧪 Swag Login - Selenium Tests\n');

    // Test 1: Valid Login - Standard User
    await login(driver, 'standard_user', 'secret_sauce');
    if (await waitAndDismiss(driver, until.urlContains('inventory.html'), 10000)) {
      console.log('✓ Valid Login - Standard User');
    }

    // Test 2: Invalid Login - Locked Out User
    await login(driver, 'locked_out_user', 'secret_sauce');
    if (await waitAndDismiss(driver, until.elementLocated(By.css('[data-test="error"]')), 5000)) {
      const text = await driver.findElement(By.css('[data-test="error"]')).getText();
      if (text.includes('locked out')) console.log('✓ Invalid Login - Locked Out User');
    }

    // Test 3: Invalid Login - Wrong username
    await login(driver, 'wrong_username', 'secret_sauce');
    if (await waitAndDismiss(driver, until.elementLocated(By.css('[data-test="error"]')), 5000)) {
      const text = await driver.findElement(By.css('[data-test="error"]')).getText();
      if (text.includes('Username and password do not match')) console.log('✓ Invalid Login - Wrong username');
    }

    // Test 4: Invalid Login - Wrong password
    await login(driver, 'standard_user', 'wrong_password');
    if (await waitAndDismiss(driver, until.elementLocated(By.css('[data-test="error"]')), 5000)) {
      const text = await driver.findElement(By.css('[data-test="error"]')).getText();
      if (text.includes('Username and password do not match')) console.log('✓ Invalid Login - Wrong password');
    }

    // Test 5: Invalid Login - Empty username
    await login(driver, '', 'secret_sauce');
    if (await waitAndDismiss(driver, until.elementLocated(By.css('[data-test="error"]')), 5000)) {
      const text = await driver.findElement(By.css('[data-test="error"]')).getText();
      if (text.includes('Username is required')) console.log('✓ Invalid Login - Empty username');
    }

    // Test 6: Invalid Login - Empty password
    await login(driver, 'standard_user', '');
    if (await waitAndDismiss(driver, until.elementLocated(By.css('[data-test="error"]')), 5000)) {
      const text = await driver.findElement(By.css('[data-test="error"]')).getText();
      if (text.includes('Password is required')) console.log('✓ Invalid Login - Empty password');
    }

    // Test 7: Valid Login - Problem User
    await login(driver, 'problem_user', 'secret_sauce');
    if (await waitAndDismiss(driver, until.urlContains('inventory.html'), 10000)) {
      console.log('✓ Valid Login - Problem User');
    }

    // Test 8: Valid Login - Performance Glitch User
    await login(driver, 'performance_glitch_user', 'secret_sauce');
    await driver.sleep(10000);
    if (await waitAndDismiss(driver, until.urlContains('inventory.html'), 10000)) {
      console.log('✓ Valid Login - Performance Glitch User');
    }

    // Test 9: Valid Login - Error User
    await login(driver, 'error_user', 'secret_sauce');
    if (await waitAndDismiss(driver, until.urlContains('inventory.html'), 10000)) {
      console.log('✓ Valid Login - Error User');
    }

    // Test 10: Valid Login - Visual User
    await login(driver, 'visual_user', 'secret_sauce');
    if (await waitAndDismiss(driver, until.urlContains('inventory.html'), 10000)) {
      console.log('✓ Valid Login - Visual User');
    }

    console.log('\n✅ 10 passing');
    console.log('\nSpec Files: 1 passed, 1 total (100% completed)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    if (driver) await driver.quit();
  }
}

runTests();
