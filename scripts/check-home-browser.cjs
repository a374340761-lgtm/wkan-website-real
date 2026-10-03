// Local-only smoke test. Pass the installed Playwright package directory as argv[2].
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2] || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    for (const language of ['en', 'zh']) {
      for (const width of [390, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        await context.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        const page = await context.newPage();
        const errors = [], missing = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => { if (r.url().startsWith(origin) && r.status() === 404) missing.push(r.url()); });
        await page.addInitScript(() => localStorage.setItem('preferredLanguage', location.pathname.startsWith('/zh/') ? 'zh' : 'en'));
        await page.goto(origin + (language === 'zh' ? '/zh/' : '/'), { waitUntil: 'networkidle' });
        assert.equal(await page.locator('h1').count(), 1, 'One H1 after rendering');
        const active = page.locator('#heroSlider .is-active');
        assert.equal(await active.locator('[data-translate="home_hero_4_title"]').count(), 1);
        assert.ok(await active.locator('.wk-hero-bg').evaluate(e => getComputedStyle(e).backgroundImage.includes('2026-shanghai-international-advertising-exhibition-waikwan.webp')));
        assert.equal(await page.locator('#heroSlider article:not(.is-active) .wk-hero-bg').evaluateAll(es => es.every(e => getComputedStyle(e).backgroundImage === 'none')), true);
        await page.evaluate(() => window.__wkHeroGoTo(4, true));
        assert.match(await page.locator('#heroSlider .is-active .wk-hero-title').innerText(), /背景墙|Display/);
        assert.ok(await page.locator('#heroSlider .is-active .wk-hero-bg').evaluate(e => e.style.backgroundImage.length > 0));
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow, false, 'No horizontal overflow');
        assert.deepEqual(errors, [], 'No runtime exceptions');
        assert.deepEqual(missing, [], 'No local missing assets');
        await page.evaluate(() => window.__wkHeroGoTo(0, true));
        await page.screenshot({ path: path.join(root, 'reports', `home-${language}-${width}.png`) });
        console.log(`PASS ${language} ${width}px: hero, navigation, lazy backgrounds, H1, assets, overflow`);
        await context.close();
      }
    }
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; server.close(); });
