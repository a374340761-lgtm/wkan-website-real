/**
 * Build product-sitemap.xml + scripts/product-seo-map.js from scripts/products.js (Node vm sandbox).
 * One-time: if sitemap.xml is a monolithic <urlset>, split into page-sitemap.xml + sitemap index.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://www.waikwantent.com';
const LASTMOD = new Date().toISOString().slice(0, 10);

const LEGACY_MERGED = {
  31002: '31001',
  31003: '31001',
  31004: '31001',
  31011: '31010',
  31012: '31010',
  42006: '42005',
};

const SPRITE_EXCLUDE = new Set([9009, 9020]);

function loadProductManager() {
  const code = fs.readFileSync(path.join(ROOT, 'scripts', 'products.js'), 'utf8');
  const ctx = { console };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  ctx.document = {
    head: { appendChild() {} },
    createElement() {
      return { textContent: '' };
    },
    addEventListener() {},
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'products.js' });
  vm.runInContext('window.productManager = new ProductManager();', ctx);
  const pm = ctx.window.productManager;
  if (!pm || !Array.isArray(pm.products)) {
    throw new Error('productManager.products not available after loading products.js');
  }
  return pm;
}

function rootAssetAbs(rel) {
  if (rel == null || rel === '') return '';
  const s = String(rel).trim();
  if (/^https?:\/\//i.test(s)) {
    return s
      .replace(/^http:\/\//i, 'https://')
      .replace(/^https:\/\/waikwantent\.com(?=\/|$)/i, ORIGIN);
  }
  const p = s.startsWith('/') ? s : `/${s.replace(/^\/+/, '')}`;
  try {
    const u = new URL(p, ORIGIN);
    return u.toString();
  } catch {
    return ORIGIN + p;
  }
}

function canonicalSku(p) {
  const sku = p.sku != null && String(p.sku).trim() !== '' ? String(p.sku).trim() : String(p.id);
  return sku;
}

function primaryImageForSeo(p) {
  const id = Number(p.id);
  const cat = String(p.category || '');
  if (
    cat === 'accessories' &&
    p.grid &&
    Number.isFinite(id) &&
    id >= 9001 &&
    id <= 9024 &&
    !SPRITE_EXCLUDE.has(id)
  ) {
    return rootAssetAbs('images/products/accessories/canopy-tent-accessories-and-replacement-parts.png');
  }
  const raw = p.image || (Array.isArray(p.images) && p.images[0]) || '';
  return raw ? rootAssetAbs(raw) : rootAssetAbs('images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png');
}

function enTitle(p) {
  const custom = String(p.seoTitleEn || '').trim();
  if (custom) return custom;
  const name = String(p.nameEn || p.name || p.nameZh || '').trim() || 'Product';
  return `${name} | Tent & Display Manufacturer | WaiKwan`;
}

function enDescription(p) {
  const custom = String(p.seoDescriptionEn || '').trim();
  if (custom) return custom.length > 320 ? `${custom.slice(0, 317)}…` : custom;
  const short = String(p.shortEn || p.descriptionEn || '').trim();
  const body = short || String(p.nameEn || '').trim() || '';
  const sku = canonicalSku(p);
  const cat = String(p.category || '').trim();
  let t = `SKU ${sku}. ${body}`;
  if (cat) t += ` Category: ${cat}.`;
  t += ' OEM factory quotes, custom printing, export-ready packing.';
  t = t.replace(/\s+/g, ' ').trim();
  if (t.length > 320) t = `${t.slice(0, 317)}…`;
  return t;
}

function zhTitle(p) {
  const custom = String(p.seoTitleZh || '').trim();
  if (custom) return custom;
  const name = String(p.nameZh || p.nameEn || p.name || '').trim() || '产品';
  return `${name}｜伟群帐篷 OEM/ODM`;
}

function zhDescription(p) {
  const custom = String(p.seoDescriptionZh || '').trim();
  if (custom) return custom.length > 320 ? `${custom.slice(0, 317)}…` : custom;
  const short = String(p.shortZh || p.descriptionZh || '').trim();
  const body = short || String(p.nameZh || '').trim() || '';
  const sku = canonicalSku(p);
  let t = `SKU ${sku}。${body} 支持定制印刷与出口包装，欢迎询盘。`;
  t = t.replace(/\s+/g, ' ').trim();
  if (t.length > 320) t = `${t.slice(0, 317)}…`;
  return t;
}

function maybeMigrateSitemapIndex() {
  const smPath = path.join(ROOT, 'sitemap.xml');
  let raw = fs.readFileSync(smPath, 'utf8');
  if (raw.includes('<sitemapindex') || raw.includes('sitemapindex')) {
    return;
  }
  const locs = [...raw.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const productRe = /\/product-detail\.html\?sku=/i;
  const pageLocs = locs.filter((u) => !productRe.test(u));
  const pageBody = pageLocs
    .map(
      (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  const pageXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageBody}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'page-sitemap.xml'), pageXml, 'utf8');

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${ORIGIN}/page-sitemap.xml</loc>
    <lastmod>${LASTMOD}</lastmod>
  </sitemap>
</sitemapindex>
`;
  fs.writeFileSync(smPath, indexXml, 'utf8');
}

function writeProductOutputs(pm) {
  const seen = new Set();
  const map = {};

  for (const p of pm.products) {
    if (!p || p.id == null) continue;
    const sku = canonicalSku(p);
    if (LEGACY_MERGED[String(sku)]) continue;

    const key = String(sku);
    if (seen.has(key)) continue;
    seen.add(key);

    map[key] = {
      sku: key,
      category: String(p.category || '').trim(),
      titleEn: enTitle(p),
      descriptionEn: enDescription(p),
      titleZh: zhTitle(p),
      descriptionZh: zhDescription(p),
      image: primaryImageForSeo(p),
    };
  }

  const skus = Object.keys(map).sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (String(na) === a && String(nb) === b && Number.isFinite(na) && Number.isFinite(nb)) {
      return na - nb;
    }
    return a.localeCompare(b);
  });

  // Do not list a bare /product-detail.html in sitemap (thin/misaligned with JS canonical).
  // PDP URLs remain discoverable via page-sitemap hubs, product-center, all-products, and internal ?sku= links.
  if (fs.existsSync(path.join(ROOT, 'product-sitemap.xml'))) {
    try {
      fs.unlinkSync(path.join(ROOT, 'product-sitemap.xml'));
    } catch {
      // ignore
    }
  }

  const js =
    `// AUTO-GENERATED by scripts/build-product-sitemap.mjs — run: node scripts/build-product-sitemap.mjs\n` +
    `window.WK_PRODUCT_SEO_MAP = ${JSON.stringify(map, null, 0)};\n`;
  fs.writeFileSync(path.join(ROOT, 'scripts', 'product-seo-map.js'), js, 'utf8');

  console.log(`Wrote scripts/product-seo-map.js (${Object.keys(map).length} SKUs) — no product-sitemap.xml stub URL`);
}

maybeMigrateSitemapIndex();
const pm = loadProductManager();
writeProductOutputs(pm);
console.log('Done.');
