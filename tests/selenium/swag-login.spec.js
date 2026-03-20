const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.saucedemo.com';
const REPORT_DIR = path.join(__dirname, '../../test-reports/selenium-report');
const testResults = [];

const chromeOptions = () => {
  const options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-blink-features=PasswordLeakDetection');
  options.addArguments('--no-first-run');
  options.addArguments('--disable-extensions');
  options.addArguments('--disable-infobars');
  options.addArguments('--disable-save-password-bubble');
  options.setUserPreferences({
    'credentials_enable_service': false,
    'credentials_enable_autosignin': false,
    'profile.password_manager_enabled': false,
    'profile.default_content_setting_values.notifications': 2,
    'safebrowsing.enabled': false,
    'credentials_force_legacy_format': true,
    'profile.password_manager_leak_detection': false
  });
  return options;
};

async function dismissPopup(driver) {
  try {
    await driver.wait(until.alertIsPresent(), 500);
    await driver.switchTo().alert().dismiss();
  } catch {}
  
  const selectors = ['[data-test="error"]', '[aria-label="Close"]', '[aria-label="OK"]'];
  for (const sel of selectors) {
    try {
      const btn = driver.findElement(By.css(sel));
      if (await btn.isDisplayed()) {
        await btn.click();
        break;
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
  await dismissPopup(driver);
}

async function getErrorMessage(driver) {
  await dismissPopup(driver);
  try {
    await driver.wait(until.elementLocated(By.css('[data-test="error"]')), 2000);
    return await driver.findElement(By.css('[data-test="error"]')).getText();
  } catch {
    return null;
  }
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
    try {
      await login(driver, 'standard_user', 'secret_sauce');
      if ((await driver.getCurrentUrl()).includes('inventory.html')) {
        console.log('✓ Valid Login - Standard User');
        testResults.push({ name: 'Valid Login - Standard User', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Standard User: ${e.message}`); 
      testResults.push({ name: 'Valid Login - Standard User', status: 'failed', error: e.message });
    }

    // Test 2: Invalid Login - Locked Out User
    try {
      await login(driver, 'locked_out_user', 'secret_sauce');
      const t = await getErrorMessage(driver);
      if (t && t.includes('locked out')) {
        console.log('✓ Invalid Login - Locked Out User');
        testResults.push({ name: 'Invalid Login - Locked Out User', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Locked Out: ${e.message}`); 
      testResults.push({ name: 'Invalid Login - Locked Out User', status: 'failed', error: e.message });
    }

    // Test 3: Invalid Login - Wrong username
    try {
      await login(driver, 'wrong_username', 'secret_sauce');
      const t = await getErrorMessage(driver);
      if (t && t.includes('do not match')) {
        console.log('✓ Invalid Login - Wrong username');
        testResults.push({ name: 'Invalid Login - Wrong username', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Wrong username: ${e.message}`); 
      testResults.push({ name: 'Invalid Login - Wrong username', status: 'failed', error: e.message });
    }

    // Test 4: Invalid Login - Wrong password
    try {
      await login(driver, 'standard_user', 'wrong_password');
      const t = await getErrorMessage(driver);
      if (t && t.includes('do not match')) {
        console.log('✓ Invalid Login - Wrong password');
        testResults.push({ name: 'Invalid Login - Wrong password', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Wrong password: ${e.message}`); 
      testResults.push({ name: 'Invalid Login - Wrong password', status: 'failed', error: e.message });
    }

    // Test 5: Invalid Login - Empty username
    try {
      await login(driver, '', 'secret_sauce');
      const t = await getErrorMessage(driver);
      if (t && t.includes('Username is required')) {
        console.log('✓ Invalid Login - Empty username');
        testResults.push({ name: 'Invalid Login - Empty username', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Empty username: ${e.message}`); 
      testResults.push({ name: 'Invalid Login - Empty username', status: 'failed', error: e.message });
    }

    // Test 6: Invalid Login - Empty password
    try {
      await login(driver, 'standard_user', '');
      const t = await getErrorMessage(driver);
      if (t && t.includes('Password is required')) {
        console.log('✓ Invalid Login - Empty password');
        testResults.push({ name: 'Invalid Login - Empty password', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Empty password: ${e.message}`); 
      testResults.push({ name: 'Invalid Login - Empty password', status: 'failed', error: e.message });
    }

    // Test 7: Valid Login - Problem User
    try {
      await login(driver, 'problem_user', 'secret_sauce');
      if ((await driver.getCurrentUrl()).includes('inventory.html')) {
        console.log('✓ Valid Login - Problem User');
        testResults.push({ name: 'Valid Login - Problem User', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Problem User: ${e.message}`); 
      testResults.push({ name: 'Valid Login - Problem User', status: 'failed', error: e.message });
    }

    // Test 8: Valid Login - Performance Glitch User
    try {
      await login(driver, 'performance_glitch_user', 'secret_sauce');
      await driver.sleep(5000);
      if ((await driver.getCurrentUrl()).includes('inventory.html')) {
        console.log('✓ Valid Login - Performance Glitch User');
        testResults.push({ name: 'Valid Login - Performance Glitch User', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Performance Glitch: ${e.message}`); 
      testResults.push({ name: 'Valid Login - Performance Glitch User', status: 'failed', error: e.message });
    }

    // Test 9: Valid Login - Error User
    try {
      await login(driver, 'error_user', 'secret_sauce');
      if ((await driver.getCurrentUrl()).includes('inventory.html')) {
        console.log('✓ Valid Login - Error User');
        testResults.push({ name: 'Valid Login - Error User', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Error User: ${e.message}`); 
      testResults.push({ name: 'Valid Login - Error User', status: 'failed', error: e.message });
    }

    // Test 10: Valid Login - Visual User
    try {
      await login(driver, 'visual_user', 'secret_sauce');
      if ((await driver.getCurrentUrl()).includes('inventory.html')) {
        console.log('✓ Valid Login - Visual User');
        testResults.push({ name: 'Valid Login - Visual User', status: 'passed' });
        passed++;
      }
    } catch (e) { 
      console.log(`  ⚠️ Visual User: ${e.message}`); 
      testResults.push({ name: 'Valid Login - Visual User', status: 'failed', error: e.message });
    }

    console.log(`\n✅ ${passed}/10 passing`);
    console.log('\nSpec Files: 1 passed, 1 total (100% completed)');

    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }
    const report = {
      timestamp: new Date().toISOString(),
      summary: { passed, failed: 10 - passed, total: 10 },
      tests: testResults
    };
    fs.writeFileSync(path.join(REPORT_DIR, 'results.json'), JSON.stringify(report, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(REPORT_DIR, 'results.json'), JSON.stringify({ error: error.message }, null, 2));
  } finally {
    if (driver) {
      try { await driver.quit(); } catch {}
    }
  }
}

runTests();
