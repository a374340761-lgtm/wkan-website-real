/* Local deployment smoke tests. All external traffic is blocked; submissions are mocked. */
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const assert = require('node:assert/strict');
const {chromium} = require(process.argv[2] || 'playwright');
const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'scripts/six-language-config.json'), 'utf8'));
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const results = [];
  try {
    for (const [locale, settings] of Object.entries(config.locales)) {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({viewport:{width,height:900}});
        const errors = [], missing = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {if (response.url().startsWith(origin) && response.status() === 404) missing.push(response.url());});
        let submission;
        await page.route('**/*', route => {
          const request = route.request();
          if (request.url().startsWith(origin)) return route.continue();
          if (request.url().includes('script.google.com') && request.method() === 'POST') {
            submission = new URLSearchParams(request.postData());
            return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});
          }
          return route.abort();
        });
        await page.goto(`${origin}/${locale}/`, {waitUntil:'networkidle'});
        assert.equal(await page.locator('html').getAttribute('lang'),settings.hreflang);
        assert.equal(await page.evaluate(()=>window.wkResolvePageLanguage()),locale);
        assert.equal(await page.evaluate(()=>typeof window.wkLocaleText),'function');
        await page.waitForFunction(()=>document.querySelectorAll('#langMenu a[data-lang]').length >= 6);
        assert(await page.locator(`#langMenu a[data-lang="${locale}"]`).count());
        assert(await page.locator('h1').first().innerText());
        const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth + 2);
        assert(!overflow, `${locale} homepage overflows at ${width}`);
        fs.mkdirSync(path.join(root,'reports/localization'),{recursive:true});
        await page.screenshot({path:path.join(root,'reports/localization',`${locale}-home-${width}.png`)});
        assert.equal(await page.evaluate(()=>window.wkLocalizedPageHref('/contact-us.html?product=WK-TEST#form')),`/${locale}/contact-us.html?product=WK-TEST#form`);
        const other = locale === 'fr' ? 'it' : 'fr';
        assert.equal(await page.locator(`#langMenu [data-lang="${other}"]`).getAttribute('href'),`/${other}/`);
        await page.locator(`#langMenu [data-lang="${other}"]`).evaluate(link=>link.click());
        await page.waitForURL(`${origin}/${other}/`);
        await page.goto(`${origin}/${locale}/all-products.html?q=heart`,{waitUntil:'networkidle'});
        assert(await page.locator('.ap-card').count(), `${locale}: product search empty`);
        await page.goto(`${origin}/${locale}/contact-us.html?product=WK-TEST`,{waitUntil:'networkidle'});
        assert.equal(await page.locator('#product').inputValue(),'WK-TEST');
        for (const [field,value] of Object.entries({name:'Deployment Test',email:'deployment@example.com',quantity:'100',target_market:'QA'})) await page.locator(`#getQuoteForm [name="${field}"]`).fill(value);
        await page.locator('#contactSubmitBtn').evaluate(button=>button.click());
        await page.waitForFunction(()=>document.querySelector('#contactSuccess').style.display !== 'none');
        assert.equal(submission.get('language'),locale);
        assert.equal(submission.get('product'),'WK-TEST');
        assert.equal(errors.length,0,errors.join('\n'));
        assert.equal(missing.length,0,missing.join('\n'));
        const output = path.join(root,'reports/localization');
        fs.mkdirSync(output,{recursive:true});
        await page.screenshot({path:path.join(output,`${locale}-${width}.png`)});
        results.push({locale,width,language:settings.hreflang,homepageOverflow:overflow,search:true,form:'mock success',errors,missing});
        await page.close();
      }
    }
    fs.writeFileSync(path.join(root,'reports/localization/browser-results.json'),JSON.stringify(results,null,2)+'\n');
    console.log(`Passed ${results.length} language/device scenarios.`);
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
