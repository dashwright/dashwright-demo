#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const outputPath = 'test-reports/wdio-report/output.log';
const junitPath = 'test-reports/wdio-report/wdio-0-0-junit-reporter.log';
const htmlPath = 'test-reports/wdio-report/index.html';

let content = '';
let passed = 0;
let failed = 0;

if (fs.existsSync(outputPath)) {
  content = fs.readFileSync(outputPath, 'utf8');
  passed = (content.match(/\bPASSED\b/g) || []).length;
  failed = (content.match(/\bFAILED\b/g) || []).length;
} else if (fs.existsSync(junitPath)) {
  content = fs.readFileSync(junitPath, 'utf8');
  const failuresMatch = content.match(/failures="(\d+)"/);
  const testsMatch = content.match(/tests="(\d+)"/);
  if (testsMatch) {
    const total = parseInt(testsMatch[1]);
    failed = failuresMatch ? parseInt(failuresMatch[1]) : 0;
    passed = total - failed;
  }
}

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
