#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const outputPath = 'test-reports/wdio-report/output.log';
const htmlPath = 'test-reports/wdio-report/index.html';

if (!fs.existsSync(outputPath)) {
  console.log('No output log found');
  process.exit(0);
}

const content = fs.readFileSync(outputPath, 'utf8');

const passed = (content.match(/\bPASSED\b/g) || []).length;
const failed = (content.match(/\bFAILED\b/g) || []).length;
const total = passed + failed;

const testCases = [];
const passedTests = content.match(/\[0-0\] PASSED.*?\(([\d.]+)s\)/g) || [];
const failedTests = content.match(/\[0-0\] FAILED.*?\(([\d.]+)s\)/g) || [];

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>WebdriverIO Test Results</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { margin-top: 0; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .stat { padding: 15px 25px; border-radius: 6px; text-align: center; }
    .stat.passed { background: #d4edda; color: #155724; }
    .stat.failed { background: #f8d7da; color: #721c24; }
    .stat.total { background: #d1ecf1; color: #0c5460; }
    .stat strong { display: block; font-size: 24px; }
    .stat span { font-size: 14px; }
    .note { background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>WebdriverIO E2E Test Results</h1>
    <div class="summary">
      <div class="stat passed"><strong>${passed}</strong><span>Passed</span></div>
      <div class="stat failed"><strong>${failed}</strong><span>Failed</span></div>
      <div class="stat total"><strong>${total}</strong><span>Total</span></div>
    </div>
    <div class="note">
      <strong>Note:</strong> Results parsed from CI output log due to reporter crash (ERR_STREAM_WRITE_AFTER_END).
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(htmlPath, html);
console.log(`HTML report generated: ${htmlPath}`);
