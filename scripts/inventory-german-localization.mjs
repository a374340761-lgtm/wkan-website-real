import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://www.waikwantent.com';
const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const files = execFileSync('git', ['ls-files', '-z', '--', '*.html'], { cwd: root, encoding: 'utf8' })
  .split('\0').filter(file => file && !file.startsWith('de/'));

function sitemapPaths(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname).sort();
}

function route(file) {
  return '/' + file.replace(/(^|\/)index\.html$/, '$1');
}

function filePurpose(file) {
  if (/^careers(?:-submit-bridge)?\.html$/.test(file)) return 'existing-chinese-recruitment';
  if (/^(?:outputs\/|google[a-f\d]+\.html$|index\.(?:original|wireframe)\.html$|test_)/i.test(file)) {
    return 'technical-or-internal-review';
  }
  if (/^(?:404|careers-submit-bridge|product-detail)\.html$/.test(file)) return 'special-behavior';
  if (/^(?:product|tent-detail)\.html$/.test(file)) return 'legacy-compatibility';
  return 'page-or-redirect';
}

function productCatalog() {
  const context = {
    console,
    document: {
      head: { appendChild() {} },
      createElement() { return { textContent: '' }; },
      addEventListener() {},
    },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read('./products.js'), context, { filename: 'products.js', timeout: 5000 });
  return vm.runInContext('new ProductManager().products', context, { timeout: 5000 });
}

const localSitemap = sitemapPaths(read('../sitemap.xml'));
const routes = new Map();
const downloads = new Map();
for (const file of files) {
  const source = route(file);
  const language = file.startsWith('zh/') ? 'zh' : 'en';
  const key = file.replace(/^zh\//, '');
  const purpose = filePurpose(key);
  const row = routes.get(key) ?? {
    sources: {},
    germanCandidate: ['technical-or-internal-review', 'existing-chinese-recruitment'].includes(purpose)
      ? null : '/de' + route(key),
    purpose,
  };
  row.sources[language] = { path: source, inSitemap: localSitemap.includes(source) };
  routes.set(key, row);

  if (purpose === 'technical-or-internal-review') continue;
  const html = fs.readFileSync(new URL(encodeURI('../' + file), import.meta.url), 'utf8');
  for (const [, href] of html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    if (!/\.(?:pdf|xlsx?|docx?|zip)(?:[?#]|$)/i.test(href)) continue;
    const url = new URL(href.replaceAll('&amp;', '&'), origin + source);
    url.hash = '';
    const sources = downloads.get(url.href) ?? new Set();
    sources.add(source);
    downloads.set(url.href, sources);
  }
}

const products = Array.from(productCatalog(), product => {
  const sku = String(product.sku ?? product.id).trim();
  if (!sku || sku === 'undefined') throw new Error('Catalog product is missing a SKU');
  return {
    sku,
    category: product.category,
    nameEn: product.nameEn,
    nameZh: product.nameZh || product.name,
    candidateSkuEntry: '/de/product-detail.html?sku=' + encodeURIComponent(sku),
  };
}).sort((a, b) => a.sku.localeCompare(b.sku));
if (new Set(products.map(product => product.sku)).size !== products.length) throw new Error('Duplicate catalog SKU');

const inventory = {
  routes: Object.fromEntries([...routes].sort(([a], [b]) => a.localeCompare(b))),
  products,
  downloadLinks: Object.fromEntries([...downloads].sort(([a], [b]) => a.localeCompare(b))
    .map(([url, sources]) => [url, [...sources].sort()])),
};

const liveSitemapPath = process.argv[2];
if (liveSitemapPath) {
  const live = sitemapPaths(fs.readFileSync(liveSitemapPath, 'utf8'));
  if (!live.length) throw new Error('Production sitemap snapshot contains no URLs');
  inventory.liveSitemap = {
    total: live.length,
    onlyLive: live.filter(path => !localSitemap.includes(path)),
    onlyLocal: localSitemap.filter(path => !live.includes(path)),
  };
}

console.log(JSON.stringify(inventory, null, 2));
