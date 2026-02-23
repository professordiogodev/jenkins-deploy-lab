const { app, server } = require('./app');

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Test 1: Root endpoint returns 200
    const res1 = await fetch('http://localhost:3000/');
    if (res1.status === 200) {
      console.log('✅ PASS: Root endpoint returns 200');
      passed++;
    } else {
      console.log('❌ FAIL: Root endpoint returned', res1.status);
      failed++;
    }

    // Test 2: Response contains expected fields
    const data = await res1.json();
    if (data.status === 'running' && data.message && data.version) {
      console.log('✅ PASS: Response contains expected fields');
      passed++;
    } else {
      console.log('❌ FAIL: Response missing expected fields');
      failed++;
    }

    // Test 3: Health endpoint
    const res2 = await fetch('http://localhost:3000/health');
    const health = await res2.json();
    if (health.status === 'healthy') {
      console.log('✅ PASS: Health endpoint returns healthy');
      passed++;
    } else {
      console.log('❌ FAIL: Health endpoint returned', health.status);
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error during tests -', error.message);
    failed++;
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  server.close();

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();