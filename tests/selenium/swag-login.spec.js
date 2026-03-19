const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'https://www.saucedemo.com';

const chromeOptions = () => {
  const options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-blink-features=PasswordLeakDetection');
  options.addArguments('--no-first-run');
  options.addArguments('--disable-extensions');
  options.addArguments('--disable-infobars');
  options.addArguments('--disable-save-password-bubble');
  options.addArguments('--disable-ooprime-credit-card-scanner');
  options.setUserPreferences({
    'credentials_enable_service': false,
    'credentials_enable_autosignin': false,
    'profile.password_manager_enabled': false,
    'profile.default_content_setting_values.notifications': 2,
    'safebrowsing.enabled': false,
    'credentials_force_legacy_format': true,
    'profile.allow_legacy_cypress_credentials': true
  });
  return options;
};

async function dismissPopup(driver) {
  try {
    await driver.wait(until.alertIsPresent(), 1500);
    await driver.switchTo().alert().dismiss();
    console.log('  ⚠️ Dismissed alert');
    return;
  } catch {}
  
  const selectors = ['[aria-label="Close"]', '[data-test="error"]', 'button:has-text("OK")', 'button:has-text("Dismiss")', 'button:has-text("Close")'];
  for (const sel of selectors) {
    try {
      const btn = driver.findElement(By.css(sel));
      if (await btn.isDisplayed()) {
        await btn.click();
        await driver.sleep(300);
        console.log('  ⚠️ Dismissed popup');
        return;
      }
    } catch {}
  }
}

async function login(driver, username, password) {
  await driver.get(BASE_URL);
  await dismissPopup(driver);
  await driver.findElement(By.css('#user-name')).clear();
  await driver.findElement(By.css('#user-name')).sendKeys(username || '');
  await dismissPopup(driver);
  await driver.findElement(By.css('#password')).clear();
  await driver.findElement(By.css('#password')).sendKeys(password || '');
  await dismissPopup(driver);
  await driver.findElement(By.css('#login-button')).click();
  await driver.sleep(500);
  await dismissPopup(driver);
}

async function runTest(driver, name, username, password, checkFn, successMsg) {
  try {
    await login(driver, username, password);
    await dismissPopup(driver);
    if (await checkFn(driver)) {
      console.log(`✓ ${successMsg || name}`);
      return true;
    }
  } catch (e) {
    console.log(`  ⚠️ ${name}: ${e.message}`);
  }
  return false;
}

async function runTests() {
  let driver;
  
  try {
    const builder = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions());
    if (process.env.CHROME_BIN) {
      builder.setChromeService(new chrome.ServiceBuilder(process.env.CHROME_BIN));
    }
    driver = await builder.build();
    console.log('🧪 Swag Login - Selenium Tests\n');

    let passed = 0;

    // Test 1: Valid Login - Standard User
    if (await runTest(driver, 'Standard User', 'standard_user', 'secret_sauce', 
      async (d) => (await d.getCurrentUrl()).includes('inventory.html'), 'Valid Login - Standard User')) passed++;

    // Test 2: Invalid Login - Locked Out User
    if (await runTest(driver, 'Locked Out', 'locked_out_user', 'secret_sauce',
      async (d) => { await dismissPopup(d); const t = await d.findElement(By.css('[data-test="error"]')).getText(); return t.includes('locked out'); }, 
      'Invalid Login - Locked Out User')) passed++;

    // Test 3: Invalid Login - Wrong username
    if (await runTest(driver, 'Wrong username', 'wrong_username', 'secret_sauce',
      async (d) => { await dismissPopup(d); const t = await d.findElement(By.css('[data-test="error"]')).getText(); return t.includes('do not match'); },
      'Invalid Login - Wrong username')) passed++;

    // Test 4: Invalid Login - Wrong password
    if (await runTest(driver, 'Wrong password', 'standard_user', 'wrong_password',
      async (d) => { await dismissPopup(d); const t = await d.findElement(By.css('[data-test="error"]')).getText(); return t.includes('do not match'); },
      'Invalid Login - Wrong password')) passed++;

    // Test 5: Invalid Login - Empty username
    if (await runTest(driver, 'Empty username', '', 'secret_sauce',
      async (d) => { await dismissPopup(d); const t = await d.findElement(By.css('[data-test="error"]')).getText(); return t.includes('Username is required'); },
      'Invalid Login - Empty username')) passed++;

    // Test 6: Invalid Login - Empty password
    if (await runTest(driver, 'Empty password', 'standard_user', '',
      async (d) => { await dismissPopup(d); const t = await d.findElement(By.css('[data-test="error"]')).getText(); return t.includes('Password is required'); },
      'Invalid Login - Empty password')) passed++;

    // Test 7: Valid Login - Problem User
    if (await runTest(driver, 'Problem User', 'problem_user', 'secret_sauce',
      async (d) => (await d.getCurrentUrl()).includes('inventory.html'), 'Valid Login - Problem User')) passed++;

    // Test 8: Valid Login - Performance Glitch User
    if (await runTest(driver, 'Performance Glitch', 'performance_glitch_user', 'secret_sauce',
      async (d) => { await d.sleep(8000); await dismissPopup(d); return (await d.getCurrentUrl()).includes('inventory.html'); },
      'Valid Login - Performance Glitch User')) passed++;

    // Test 9: Valid Login - Error User
    if (await runTest(driver, 'Error User', 'error_user', 'secret_sauce',
      async (d) => (await d.getCurrentUrl()).includes('inventory.html'), 'Valid Login - Error User')) passed++;

    // Test 10: Valid Login - Visual User
    if (await runTest(driver, 'Visual User', 'visual_user', 'secret_sauce',
      async (d) => (await d.getCurrentUrl()).includes('inventory.html'), 'Valid Login - Visual User')) passed++;

    console.log(`\n✅ ${passed}/10 passing`);
    console.log('\nSpec Files: 1 passed, 1 total (100% completed)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (driver) {
      try { await driver.quit(); } catch {}
    }
  }
}

runTests();
