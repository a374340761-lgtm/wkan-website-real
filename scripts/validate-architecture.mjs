/** Fast architecture invariants for local checks and CI. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function requireCondition(condition, message) {
  if (!condition) errors.push(message);
}

function validateRoutes() {
  const config = JSON.parse(read('vercel.json'));
  const redirects = new Map((config.redirects || []).map((rule) => [rule.source, rule.destination]));
  const dynamicLegacyPages = [
    '/product.html',
    '/tent-detail.html',
    '/zh/product.html',
    '/zh/tent-detail.html',
  ];

  for (const route of dynamicLegacyPages) {
    requireCondition(!redirects.has(route), `${route} must execute its compatibility page so query parameters are preserved`);
    const relativePath = route.slice(1);
    requireCondition(fs.existsSync(path.join(ROOT, relativePath)), `${relativePath} compatibility page is missing`);
    if (fs.existsSync(path.join(ROOT, relativePath))) {
      const html = read(relativePath);
      requireCondition(html.includes('/scripts/legacy-route.js'), `${relativePath} must use the shared legacy router`);
    }
  }

  requireCondition(redirects.get('/products.html') === '/product-center.html', 'English products redirect must use product-center.html');
  requireCondition(redirects.get('/zh/products.html') === '/zh/product-center.html', 'Chinese products redirect must use zh/product-center.html');

  const routerCode = read('scripts/legacy-route.js');
  const targets = [];
  const routeContext = {
    URL,
    window: {
      location: {
        href: 'https://www.waikwantent.com/product.html?id=42001#specs',
        replace(target) { targets.push(target); },
      },
    },
  };
  vm.createContext(routeContext);
  vm.runInContext(routerCode, routeContext, { filename: 'legacy-route.js' });
  requireCondition(targets[0] === 'https://www.waikwantent.com/product-detail.html?sku=42001#specs', 'legacy product ID mapping is incorrect');
  requireCondition(
    routeContext.window.WK_legacyRouteTarget('https://www.waikwantent.com/zh/tent-detail.html?id=2001') ===
      'https://www.waikwantent.com/zh/tent-type.html?type=folding30',
    'Chinese legacy folding-tent mapping is incorrect',
  );
  requireCondition(
    routeContext.window.WK_legacyRouteTarget('https://www.waikwantent.com/zh/tent-detail.html?id=9401') ===
      'https://www.waikwantent.com/zh/product-detail.html?sku=9401',
    'Chinese legacy tent detail mapping is incorrect',
  );
}

function validateInquiryContract() {
  const contactPage = read('contact-us.html');
  const zhContactPage = read('zh/contact-us.html');
  const contactScript = read('scripts/contact.js');
  const hookScript = read('scripts/inquiry-hook.js');

  for (const [name, html] of [['contact-us.html', contactPage], ['zh/contact-us.html', zhContactPage]]) {
    const formIndex = html.indexOf('scripts/contact.js');
    const hookIndex = html.indexOf('scripts/inquiry-hook.js');
    requireCondition(formIndex >= 0 && hookIndex > formIndex, `${name} must load contact.js before inquiry-hook.js`);
  }
  requireCondition(contactScript.includes('inquiry_id: inquiryId'), 'contact.js must create an inquiry_id');
  requireCondition(contactScript.includes('idempotency_key: inquiryId'), 'contact.js must send an idempotency key');
  requireCondition(hookScript.includes("reason: 'unconfirmed'"), 'inquiry hook must distinguish unconfirmed delivery');
  requireCondition(fs.existsSync(path.join(ROOT, 'docs', 'INQUIRY-OPERATIONS.md')), 'inquiry operations contract is missing');
}

function loadProducts() {
  const context = { console };
  context.window = context;
  context.globalThis = context;
  context.document = {
    head: { appendChild() {} },
    createElement() { return { textContent: '' }; },
    addEventListener() {},
  };
  vm.createContext(context);
  vm.runInContext(read('scripts/products.js'), context, { filename: 'products.js' });
  vm.runInContext('window.__architectureProductManager = new ProductManager();', context);
  return context.__architectureProductManager.products;
}

function validateProducts() {
  const products = loadProducts();
  requireCondition(Array.isArray(products) && products.length > 0, 'product catalog is empty');
  const ids = new Set();
  const skus = new Set();

  for (const product of products || []) {
    const id = String(product.id ?? '').trim();
    const sku = String(product.sku ?? product.id ?? '').trim();
    requireCondition(Boolean(id), 'a product is missing id');
    requireCondition(Boolean(sku), `product ${id || '(unknown)'} is missing its canonical SKU`);
    requireCondition(!ids.has(id), `duplicate product id: ${id}`);
    requireCondition(!skus.has(sku), `duplicate canonical SKU: ${sku}`);
    ids.add(id);
    skus.add(sku);
    requireCondition(Boolean(String(product.category || '').trim()), `product ${sku} is missing category`);
    requireCondition(Boolean(String(product.nameEn || '').trim()), `product ${sku} is missing English name`);
    requireCondition(Boolean(String(product.nameZh || product.name || '').trim()), `product ${sku} is missing Chinese name`);

    const image = product.image || (Array.isArray(product.images) && product.images[0]);
    if (image && !/^https?:\/\//i.test(image)) {
      let localPath = String(image).replace(/^\/+/, '');
      try { localPath = decodeURIComponent(localPath); } catch {}
      requireCondition(fs.existsSync(path.join(ROOT, localPath)), `product ${sku} image is missing: ${localPath}`);
    }
  }
  return products.length;
}

validateRoutes();
validateInquiryContract();
const productCount = validateProducts();

if (errors.length) {
  console.error(`Architecture validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Architecture validation passed: routes, inquiry contract, and ${productCount} products.`);
}
