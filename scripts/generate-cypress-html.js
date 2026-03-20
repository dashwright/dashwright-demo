#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const xmlPath = 'test-reports/cypress-report/test-results.xml';
const htmlPath = 'test-reports/cypress-report/index.html';

if (!fs.existsSync(xmlPath)) {
  console.log('No XML file found');
  process.exit(0);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

const tests = [];
const testSuites = xml.match(/<testsuite[^>]*>/g) || [];
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

testSuites.forEach(suite => {
  const testsMatch = suite.match(/tests="(\d+)"/);
  const failuresMatch = suite.match(/failures="(\d+)"/);
  if (testsMatch) totalTests += parseInt(testsMatch[1]);
  if (failuresMatch) failedTests += parseInt(failuresMatch[1]);
});
passedTests = totalTests - failedTests;

const testCases = xml.match(/<testcase[^>]*name="([^"]*)"[^>]*time="([^"]*)"[^>]*>/g) || [];
testCases.forEach(tc => {
  const nameMatch = tc.match(/name="([^"]*)"/);
  const timeMatch = tc.match(/time="([^"]*)"/);
  const failureMatch = tc.match(/<failure[^>]*message="([^"]*)"[^>]*>/);
  
  tests.push({
    name: nameMatch ? nameMatch[1] : 'Unknown',
    time: timeMatch ? parseFloat(timeMatch[1]).toFixed(3) : '0.000',
    status: failureMatch ? 'failed' : 'passed',
    message: failureMatch ? failureMatch[1] : ''
  });
});

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cypress Test Results</title>
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
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
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
    .passed { color: #28a745; }
    .failed { color: #dc3545; }
    .time { color: #6c757d; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Cypress E2E Test Results</h1>
    <div class="summary">
      <div class="stat passed"><strong>${passedTests}</strong><span>Passed</span></div>
      <div class="stat failed"><strong>${failedTests}</strong><span>Failed</span></div>
      <div class="stat total"><strong>${totalTests}</strong><span>Total</span></div>
    </div>
    <table>
      <thead>
        <tr><th>Test</th><th>Status</th><th>Time (s)</th></tr>
      </thead>
      <tbody>
        ${tests.map(t => `
        <tr>
          <td>${t.name}</td>
          <td class="${t.status}">${t.status === 'passed' ? '✓ Passed' : '✗ Failed'}</td>
          <td class="time">${t.time}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

fs.writeFileSync(htmlPath, html);
fs.unlinkSync(xmlPath);
console.log(`HTML report generated: ${htmlPath}`);
