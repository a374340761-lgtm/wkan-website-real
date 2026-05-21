import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_SKU_LEN = 50;
const URL_LIKE_RE = /^https?:\/\//i;

const SKIP_HTML = new Set([
  'googlead697dfed14475b1.html',
  'index.original.html',
  'index.wireframe.html',
  'test_logo.html',
  'test_stats.html',
  'news/contact-us.html',
  'zh/news/contact-us.html',
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'backend' || entry.name === 'node_modules') continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
      if (!SKIP_HTML.has(rel)) out.push(rel);
    }
  }
  return out.sort();
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

function collectProducts(node, products = []) {
  if (!node || typeof node !== 'object') return products;
  if (Array.isArray(node)) {
    for (const item of node) collectProducts(item, products);
    return products;
  }
  const type = node['@type'];
  const types = Array.isArray(type) ? type : type ? [type] : [];
  if (types.includes('Product')) products.push(node);
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') collectProducts(value, products);
  }
  return products;
}

function validateProduct(product, fileRel) {
  const issues = [];
  const sku = product.sku;

  if (sku == null || sku === '') {
    issues.push({ file: fileRel, field: 'sku', issue: 'missing or empty sku' });
  } else if (Array.isArray(sku)) {
    issues.push({ file: fileRel, field: 'sku', issue: `sku is array with ${sku.length} values`, value: JSON.stringify(sku) });
    if (sku.length > 1) {
      issues.push({ file: fileRel, field: 'sku', issue: 'multiple sku values in array' });
    }
  } else {
    const s = String(sku);
    if (s.length > MAX_SKU_LEN) {
      issues.push({ file: fileRel, field: 'sku', issue: `sku longer than ${MAX_SKU_LEN} chars (${s.length})`, value: s });
    }
    if (URL_LIKE_RE.test(s) || /waikwantent\.com/i.test(s)) {
      issues.push({ file: fileRel, field: 'sku', issue: 'sku looks like a URL', value: s });
    }
    if (/\s/.test(s)) {
      issues.push({ file: fileRel, field: 'sku', issue: 'sku contains spaces', value: s });
    }
    if (/[a-z]/.test(s)) {
      issues.push({ file: fileRel, field: 'sku', issue: 'sku contains lowercase letters', value: s });
    }
    if (!/^[A-Z0-9\-_.~]+$/.test(s)) {
      issues.push({ file: fileRel, field: 'sku', issue: 'sku contains unsafe characters', value: s });
    }
  }

  if (!product.name) {
    issues.push({ file: fileRel, field: 'name', issue: 'missing Product.name' });
  }
  if (!product.image || (Array.isArray(product.image) && product.image.length === 0)) {
    issues.push({ file: fileRel, field: 'image', issue: 'missing Product.image' });
  }
  if (product.offers) {
    const offers = Array.isArray(product.offers) ? product.offers : [product.offers];
    for (const offer of offers) {
      if (!offer || typeof offer !== 'object') continue;
      if (!offer.url) {
        issues.push({ file: fileRel, field: 'offers.url', issue: 'Offer missing url' });
      }
      if (offer.price == null && !offer.priceSpecification) {
        issues.push({ file: fileRel, field: 'offers.price', issue: 'Offer missing price/priceSpecification' });
      }
    }
  }

  return issues;
}

const htmlFiles = walk(ROOT);
const allIssues = [];
let productCount = 0;

for (const rel of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const block of extractJsonLdBlocks(html)) {
    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch {
      allIssues.push({ file: rel, field: 'json-ld', issue: 'invalid JSON-LD block' });
      continue;
    }
    const products = collectProducts(parsed);
    for (const product of products) {
      productCount += 1;
      allIssues.push(...validateProduct(product, rel));
    }
  }
}

if (allIssues.length === 0) {
  console.log(`OK: scanned ${htmlFiles.length} HTML files, ${productCount} Product schema item(s), no issues found.`);
  process.exit(0);
}

console.error(`Found ${allIssues.length} structured-data issue(s) across ${productCount} Product item(s):\n`);
for (const item of allIssues) {
  const extra = item.value ? ` → ${item.value}` : '';
  console.error(`  [${item.file}] ${item.field}: ${item.issue}${extra}`);
}
process.exit(1);
