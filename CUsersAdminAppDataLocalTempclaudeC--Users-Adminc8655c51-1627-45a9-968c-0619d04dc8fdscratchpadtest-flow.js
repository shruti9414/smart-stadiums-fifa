const test = async () => {
  const chromium = require('chromium-cli');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const results = [];
  
  try {
    // Set auth token to bypass login
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('auth_token', 'test-token-123');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'visitor@stadium.com',
        fullName: 'Test Visitor',
        role: 'visitor'
      }));
    });

    // Test 1: Dashboard page
    console.log('Testing: /dashboard');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
    const dashTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasStadium3D = await page.evaluate(() => !!document.querySelector('canvas'));
    const hasStats = await page.evaluate(() => document.querySelectorAll('[class*="text-3xl"]').length > 0);
    results.push({
      page: '/dashboard',
      loaded: true,
      title: dashTitle,
      has3D: hasStadium3D,
      hasData: hasStats,
      errors: await page.evaluate(() => {
        const logs = [];
        console.error = (msg) => logs.push(msg);
        return logs;
      })
    });

    // Test 2: AI Companion page
    console.log('Testing: /dashboard/companion');
    await page.goto('http://localhost:3000/dashboard/companion', { waitUntil: 'networkidle2' });
    const companionTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasInputField = await page.evaluate(() => !!document.querySelector('input[placeholder*="Ask"]'));
    const hasSendButton = await page.evaluate(() => !!document.querySelector('button:contains("Send")'));
    const hasQuickQ = await page.evaluate(() => document.querySelectorAll('button').length > 5);
    results.push({
      page: '/dashboard/companion',
      loaded: true,
      title: companionTitle,
      hasInput: hasInputField,
      hasButtons: hasQuickQ,
      errors: null
    });

    // Test 3: Navigation page
    console.log('Testing: /dashboard/navigate');
    await page.goto('http://localhost:3000/dashboard/navigate', { waitUntil: 'networkidle2' });
    const navTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasSelects = await page.evaluate(() => document.querySelectorAll('select').length >= 2);
    const hasNavButton = await page.evaluate(() => !!document.querySelector('button:contains("Directions")'));
    results.push({
      page: '/dashboard/navigate',
      loaded: true,
      title: navTitle,
      hasSelects: hasSelects,
      hasNavButton: hasNavButton,
      errors: null
    });

    // Test 4: Queue page
    console.log('Testing: /dashboard/queue');
    await page.goto('http://localhost:3000/dashboard/queue', { waitUntil: 'networkidle2' });
    const queueTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasQueueCards = await page.evaluate(() => document.querySelectorAll('[class*="rounded-2xl"]').length > 2);
    results.push({
      page: '/dashboard/queue',
      loaded: true,
      title: queueTitle,
      hasData: hasQueueCards,
      errors: null
    });

    // Test 5: Accessibility page
    console.log('Testing: /dashboard/accessibility');
    await page.goto('http://localhost:3000/dashboard/accessibility', { waitUntil: 'networkidle2' });
    const a11yTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasCanvas = await page.evaluate(() => !!document.querySelector('canvas'));
    const hasFeatures = await page.evaluate(() => document.querySelectorAll('button').length > 2);
    results.push({
      page: '/dashboard/accessibility',
      loaded: true,
      title: a11yTitle,
      hasMap: hasCanvas,
      hasFeatures: hasFeatures,
      errors: null
    });

    // Test 6: Transport page
    console.log('Testing: /dashboard/transport');
    await page.goto('http://localhost:3000/dashboard/transport', { waitUntil: 'networkidle2' });
    const transportTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasTransportOptions = await page.evaluate(() => document.querySelectorAll('button').length > 3);
    results.push({
      page: '/dashboard/transport',
      loaded: true,
      title: transportTitle,
      hasOptions: hasTransportOptions,
      errors: null
    });

    // Test 7: Sustainability page
    console.log('Testing: /dashboard/sustainability');
    await page.goto('http://localhost:3000/dashboard/sustainability', { waitUntil: 'networkidle2' });
    const sustainTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasMetrics = await page.evaluate(() => document.querySelectorAll('[class*="rounded-2xl"]').length > 2);
    results.push({
      page: '/dashboard/sustainability',
      loaded: true,
      title: sustainTitle,
      hasMetrics: hasMetrics,
      errors: null
    });

    // Test 8: Incidents page
    console.log('Testing: /dashboard/incidents');
    await page.goto('http://localhost:3000/dashboard/incidents', { waitUntil: 'networkidle2' });
    const incidentTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    const hasReportBtn = await page.evaluate(() => !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Report')));
    results.push({
      page: '/dashboard/incidents',
      loaded: true,
      title: incidentTitle,
      hasReportButton: hasReportBtn,
      errors: null
    });

  } catch (err) {
    results.push({ error: err.message });
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
};

test();
