import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSeoPageSku } from './seo-page-sku-map.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.waikwantent.com';
const TODAY = new Date().toISOString().slice(0, 10);

const SKIP_HTML = new Set([
  'googlead697dfed14475b1.html',
  'index.original.html',
  'index.wireframe.html',
  'test_logo.html',
  'test_stats.html',
  'news/contact-us.html',
  'zh/news/contact-us.html',
]);

const GEO_META = [
  ['geo.region', 'CN-GX'],
  ['geo.placename', 'Guangxi, China'],
  ['geo.position', '21.953486;110.186694'],
  ['ICBM', '21.953486, 110.186694'],
];

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

const htmlFiles = walk(ROOT);
const htmlSet = new Set(htmlFiles);

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(str) {
  return String(str || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCaseSlug(str) {
  return String(str || '')
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

function urlPathForRel(rel) {
  const clean = rel.replace(/\\/g, '/');
  if (clean === 'index.html') return '/';
  if (clean === 'zh/index.html') return '/zh/';
  return `/${clean}`;
}

function absUrl(pathname) {
  return `${ORIGIN}${pathname}`;
}

function isZhRel(rel) {
  return rel === 'zh/index.html' || rel.startsWith('zh/');
}

function isPrimaryContactPage(rel) {
  const clean = String(rel || '').replace(/\\/g, '/');
  return /^contact-us\.html$/i.test(clean) || /^zh\/contact-us\.html$/i.test(clean);
}

function enRelFor(rel) {
  if (!isZhRel(rel)) return rel;
  if (rel === 'zh/index.html') return 'index.html';
  return rel.slice(3);
}

function zhRelFor(enRel) {
  if (enRel === 'index.html') return 'zh/index.html';
  return `zh/${enRel}`;
}

function getMirrorRels(rel) {
  const enRel = enRelFor(rel);
  const zhRel = zhRelFor(enRel);
  return {
    enRel,
    zhRel,
    hasEn: htmlSet.has(enRel),
    hasZh: htmlSet.has(zhRel),
  };
}

function getCanonical(html, rel) {
  const match = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  if (match) return match[1].trim();
  return absUrl(urlPathForRel(rel));
}

function getTitle(html, rel) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return stripTags(match ? match[1] : titleCaseSlug(path.basename(rel)));
}

function getDescription(html) {
  const match = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  return stripTags(match ? match[1] : 'WaiKwan Tent OEM/ODM manufacturer for custom canopy tents, beach flags and portable display systems.');
}

function getOgImage(html) {
  const match = html.match(/<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  return match ? match[1].trim() : `${ORIGIN}/images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png`;
}

function getH1(html) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return stripTags(match ? match[1] : '');
}

function insertBeforeHeadEnd(html, block) {
  if (!block.trim()) return html;
  return html.replace(/<\/head>/i, `${block}\n</head>`);
}

function removeGeneratedHeadBlocks(html) {
  return html
    .replace(/\n?\s*<meta\s+name=["']geo\.(region|placename|position)["'][^>]*>\s*/gi, '\n')
    .replace(/\n?\s*<meta\s+name=["']ICBM["'][^>]*>\s*/gi, '\n')
    .replace(/\n?\s*<link\s+rel=["']sitemap["'][^>]*>\s*/gi, '\n')
    .replace(/\n?\s*<script[^>]*id=["']wk-schema-[^"']+["'][\s\S]*?<\/script>\s*/gi, '\n');
}

function upsertCanonical(html, rel) {
  const canonical = absUrl(urlPathForRel(rel));
  const link = `    <link rel="canonical" href="${canonical}">`;
  if (/<link\b[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/i, link.trim());
  }
  return html.replace(/(<meta\s+name=["']viewport["'][^>]*>\s*)/i, `$1\n${link}`);
}

function upsertStaticHreflang(html, rel) {
  html = html.replace(/\n?\s*<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/gi, '\n');
  const { enRel, zhRel, hasEn, hasZh } = getMirrorRels(rel);
  if (!hasEn || !hasZh) return html;

  const enPath = urlPathForRel(enRel);
  const zhPath = urlPathForRel(zhRel);
  const links = [
    `    <link rel="alternate" hreflang="en" href="${absUrl(enPath)}">`,
    `    <link rel="alternate" hreflang="zh-CN" href="${absUrl(zhPath)}">`,
    `    <link rel="alternate" hreflang="x-default" href="${absUrl(enPath)}">`,
  ].join('\n');

  if (/<link\b[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/(<link\b[^>]*rel=["']canonical["'][^>]*>\s*)/i, `$1\n${links}\n`);
  }
  return insertBeforeHeadEnd(html, links);
}

function headUtilityBlock() {
  const geo = GEO_META.map(([name, content]) => `    <meta name="${name}" content="${content}">`).join('\n');
  return `${geo}\n    <link rel="sitemap" type="application/xml" href="/sitemap.xml">`;
}

function jsonLdScript(id, data) {
  return `    <script type="application/ld+json" id="${id}">\n${JSON.stringify(data, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')}\n    </script>`;
}

function localBusinessSchema(canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${ORIGIN}/#organization`,
    name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd.',
    alternateName: ['WaiKwan', 'WaiKwan Tent'],
    url: ORIGIN + '/',
    logo: `${ORIGIN}/images/waikwancompanylogo.png`,
    image: `${ORIGIN}/images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png`,
    description:
      'OEM/ODM manufacturer in China for custom canopy tents, pop-up canopy tents, beach flags, flag poles, portable display systems, light boxes and event display products.',
    email: 'yishu@waikwantent.com',
    telephone: '+86 138 2454 0280',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '500 meters southeast of the intersection of County Road 400 and Provincial Road 313',
      addressLocality: 'Bobai County',
      addressRegion: 'Guangxi',
      addressCountry: 'CN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.953486,
      longitude: 110.186694,
    },
    areaServed: ['North America', 'Europe', 'Southeast Asia', 'Worldwide'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86 138 2454 0280',
      email: 'yishu@waikwantent.com',
      contactType: 'sales',
      availableLanguage: ['English', 'Chinese'],
      areaServed: 'Worldwide',
    },
    mainEntityOfPage: canonical,
    sameAs: [
      'https://www.facebook.com/share/18UhWtGUB8/?mibextid=wwXIfr',
      'https://www.linkedin.com/in/yishulai-waikwantent/',
      'https://www.instagram.com/waikwantent',
      'https://www.tiktok.com/@yishu.lai',
    ],
  };
}

function breadcrumbSchema(rel, title, canonical) {
  const zh = isZhRel(rel);
  const clean = urlPathForRel(rel);
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: zh ? '首页' : 'Home',
      item: zh ? `${ORIGIN}/zh/` : `${ORIGIN}/`,
    },
  ];
  if (clean.includes('/seo/')) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: zh ? '采购指南' : 'B2B Guides',
      item: zh ? `${ORIGIN}/zh/site-map.html#seo-guides` : `${ORIGIN}/site-map.html#seo-guides`,
    });
  } else if (clean.includes('/news/')) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: zh ? '新闻' : 'News',
      item: zh ? `${ORIGIN}/zh/news/index.html` : `${ORIGIN}/news/index.html`,
    });
  } else if (/product|tent|flag|display|light-box|lightbox|canopy/i.test(clean) && !/contact|site-map/i.test(clean)) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: zh ? '产品' : 'Products',
      item: zh ? `${ORIGIN}/zh/product-center.html` : `${ORIGIN}/product-center.html`,
    });
  }
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: title,
    item: canonical,
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function productSchema(rel, html, title, description, canonical) {
  const name = getH1(html) || title;
  const slug = path.basename(rel, '.html');
  const sku = resolveSeoPageSku(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${canonical}#product`,
    name,
    image: [getOgImage(html)],
    description,
    brand: {
      '@type': 'Brand',
      name: 'WaiKwan',
    },
    manufacturer: {
      '@id': `${ORIGIN}/#organization`,
    },
    sku,
    mpn: '',
    category: 'Custom event tents, flags and display systems',
    offers: {
      '@type': 'Offer',
      url: canonical,
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '0',
        priceCurrency: 'USD',
        description: 'Request a Quote for project pricing, MOQ, printing options and freight.',
      },
      seller: {
        '@id': `${ORIGIN}/#organization`,
      },
    },
  };
}

function extractFaqSchema(html) {
  const questions = [];
  const re = /<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = re.exec(html)) && questions.length < 8) {
    const q = stripTags(match[1]);
    const a = stripTags(match[2]);
    if (!q || !a) continue;
    if (!/[?？]$/.test(q) && !/^(do|what|can|how|which|is|are|does|where|when|why)\b/i.test(q)) continue;
    questions.push({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    });
  }
  if (questions.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  };
}

function newsArticleSchema(rel, html, title, description, canonical) {
  if (!rel.includes('/news/') || rel.endsWith('/index.html') || /"@type"\s*:\s*"NewsArticle"/i.test(html)) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: getH1(html) || title,
    datePublished: TODAY,
    dateModified: TODAY,
    author: {
      '@type': 'Organization',
      name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd.',
    },
    publisher: {
      '@id': `${ORIGIN}/#organization`,
    },
    image: [getOgImage(html)],
    articleBody: description,
    inLanguage: isZhRel(rel) ? 'zh-CN' : 'en',
    mainEntityOfPage: canonical,
  };
}

function schemaBlock(rel, html) {
  const canonical = getCanonical(html, rel);
  const title = getTitle(html, rel);
  const description = getDescription(html);
  const blocks = [
    jsonLdScript('wk-schema-local-business', localBusinessSchema(canonical)),
    jsonLdScript('wk-schema-breadcrumb', breadcrumbSchema(rel, title, canonical)),
  ];
  if (rel.includes('/seo/') || rel.startsWith('seo/')) {
    blocks.push(jsonLdScript('wk-schema-product', productSchema(rel, html, title, description, canonical)));
  }
  const faq = extractFaqSchema(html);
  if (faq) blocks.push(jsonLdScript('wk-schema-faq', faq));
  const news = newsArticleSchema(rel, html, title, description, canonical);
  if (news) blocks.push(jsonLdScript('wk-schema-newsarticle', news));
  return blocks.join('\n');
}

function imageAltFromSrc(tag) {
  const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/i);
  if (!srcMatch) return 'WaiKwan product image';
  const base = decodeURIComponent(srcMatch[1].split('?')[0].split('/').pop() || '');
  const label = titleCaseSlug(base);
  return label ? `WaiKwan ${label}` : 'WaiKwan product image';
}

function enhanceImages(html) {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    let next = tag;
    if (!/\balt\s*=/i.test(next)) {
      next = next.replace(/\/?>$/, ` alt="${escapeHtml(imageAltFromSrc(next))}"$&`);
    }
    if (!/\bloading\s*=/i.test(next) && !/\bfetchpriority\s*=\s*["']high["']/i.test(next)) {
      next = next.replace(/\/?>$/, ' loading="lazy"$&');
    }
    if (!/\bdecoding\s*=/i.test(next) && !/\bfetchpriority\s*=\s*["']high["']/i.test(next)) {
      next = next.replace(/\/?>$/, ' decoding="async"$&');
    }
    return next;
  });
}

function customizerBlock(lang) {
  const zh = lang === 'zh';
  return `            <!-- wk-customizer:start -->
            <section class="wk-customizer contact-card soft-panel" aria-labelledby="customizer-heading" data-wk-customizer>
                <h2 id="customizer-heading">${zh ? '帐篷快速询价配置器' : 'Quick canopy quote configurator'}</h2>
                <p class="wk-customizer__intro">${zh ? '选择常见 OEM 配置并随询盘一起发送。最终材料、印刷文件、包装和运输方案会在报价阶段确认。' : 'Choose common OEM options and send the configuration with your inquiry. Final materials, artwork and packing details are confirmed during quotation.'}</p>
                <div class="wk-customizer__grid">
                    <label class="wk-customizer__field">
                        <span>${zh ? '尺寸' : 'Size'}</span>
                        <select name="customizer_size">
                            <option value="3x3m">3x3 m / 10x10 ft</option>
                            <option value="3x4.5m">3x4.5 m</option>
                            <option value="3x6m">3x6 m</option>
                            <option value="custom">${zh ? '定制尺寸' : 'Custom size'}</option>
                        </select>
                    </label>
                    <label class="wk-customizer__field">
                        <span>${zh ? '框架' : 'Frame'}</span>
                        <select name="customizer_frame">
                            <option value="steel">${zh ? '喷粉钢架' : 'Powder-coated steel'}</option>
                            <option value="aluminum40">${zh ? '40 mm 铝架' : '40 mm aluminum'}</option>
                            <option value="aluminum50">${zh ? '50 mm 加强铝架' : '50 mm heavy-duty aluminum'}</option>
                        </select>
                    </label>
                    <label class="wk-customizer__field">
                        <span>${zh ? '篷布颜色' : 'Canopy color'}</span>
                        <select name="customizer_color">
                            <option value="white">${zh ? '白色' : 'White'}</option>
                            <option value="black">${zh ? '黑色' : 'Black'}</option>
                            <option value="blue">${zh ? '蓝色' : 'Blue'}</option>
                            <option value="red">${zh ? '红色' : 'Red'}</option>
                            <option value="custom">${zh ? '定制 Pantone 色' : 'Custom Pantone color'}</option>
                        </select>
                    </label>
                    <label class="wk-customizer__field">
                        <span>${zh ? '印刷' : 'Print'}</span>
                        <select name="customizer_print">
                            <option value="valance">${zh ? '围边 Logo 印刷' : 'Valance logo print'}</option>
                            <option value="full">${zh ? '整顶篷布印刷' : 'Full canopy print'}</option>
                            <option value="walls">${zh ? '篷顶 + 围布图案' : 'Canopy + wall graphics'}</option>
                            <option value="blank">${zh ? '空白篷' : 'Blank canopy'}</option>
                        </select>
                    </label>
                    <label class="wk-customizer__field">
                        <span>${zh ? '配件' : 'Accessory'}</span>
                        <select name="customizer_accessory">
                            <option value="none">${zh ? '不加配件' : 'No accessory'}</option>
                            <option value="walls">${zh ? '全套围布' : 'Full sidewalls'}</option>
                            <option value="weights">${zh ? '重物袋 / 沙袋' : 'Weights / sandbags'}</option>
                            <option value="wheels">${zh ? '带轮收纳袋' : 'Wheeled carry bag'}</option>
                        </select>
                    </label>
                </div>
                <div class="wk-customizer__summary" aria-live="polite">
                    <div>${zh ? '参考 SKU：' : 'Reference SKU: '}<span class="wk-customizer__sku" data-customizer-sku></span></div>
                    <p data-customizer-summary></p>
                    <div class="wk-customizer__actions">
                        <button type="button" class="btn btn-primary" data-customizer-apply>${zh ? '发送此配置' : 'Send this configuration'}</button>
                        <a class="btn btn-secondary" href="${zh ? '/zh/product-center.html?cat=tents' : 'product-center.html?cat=tents'}">${zh ? '查看帐篷产品' : 'View tent products'}</a>
                    </div>
                </div>
            </section>
            <!-- wk-customizer:end -->`;
}

function ensureCustomizerScript(html, rel) {
  if (!isPrimaryContactPage(rel)) return html;
  const src = isZhRel(rel) ? '/scripts/customizer.js' : 'scripts/customizer.js';
  html = html.replace(/\n?\s*<script\s+src=["']\/?scripts\/customizer\.js["']><\/script>\s*/gi, '\n');
  if (/<script\s+src=["']\/?scripts\/contact\.js["']><\/script>/i.test(html)) {
    return html.replace(
      /(<script\s+src=["']\/?scripts\/contact\.js["']><\/script>)/i,
      `    <script src="${src}"></script>\n$1`
    );
  }
  return html.replace(/<\/body>/i, `    <script src="${src}"></script>\n</body>`);
}

function ensureContactCustomizer(html, rel) {
  if (!isPrimaryContactPage(rel)) return html;
  html = html.replace(/\n?\s*<!-- wk-customizer:start -->[\s\S]*?<!-- wk-customizer:end -->\s*/gi, '\n');
  const block = `${customizerBlock(isZhRel(rel) ? 'zh' : 'en')}\n\n`;
  if (/<div\s+class=["']contact-grid["']>/i.test(html)) {
    html = html.replace(/(\s*<div\s+class=["']contact-grid["']>)/i, `\n${block}$1`);
  } else {
    html = html.replace(/(<form\b[^>]*id=["']getQuoteForm["'][\s\S]*?<\/form>)/i, `${block}$1`);
  }
  return ensureCustomizerScript(html, rel);
}

function enhanceHtml(rel) {
  const abs = path.join(ROOT, rel);
  let html = fs.readFileSync(abs, 'utf8');
  html = removeGeneratedHeadBlocks(html);
  html = upsertCanonical(html, rel);
  html = upsertStaticHreflang(html, rel);
  html = insertBeforeHeadEnd(html, `\n${headUtilityBlock()}\n${schemaBlock(rel, html)}`);
  html = enhanceImages(html);
  html = ensureContactCustomizer(html, rel);
  fs.writeFileSync(abs, html, 'utf8');
}

function buildPageSitemap() {
  const urls = htmlFiles
    .filter((rel) => !rel.startsWith('test') && !rel.includes('.original') && !rel.includes('.wireframe'))
    .map((rel) => {
      const loc = absUrl(urlPathForRel(rel));
      let priority = '0.7';
      if (rel === 'index.html' || rel === 'zh/index.html') priority = '1.0';
      else if (rel.includes('/seo/') || rel.startsWith('seo/')) priority = '0.6';
      else if (/product|contact|faq|news|canopy|flag|display|light/i.test(rel)) priority = '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'page-sitemap.xml'), xml, 'utf8');

  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${ORIGIN}/page-sitemap.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n</sitemapindex>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), index, 'utf8');
}

for (const rel of htmlFiles) {
  enhanceHtml(rel);
}
buildPageSitemap();

console.log(`Enhanced ${htmlFiles.length} HTML files and rebuilt page-sitemap.xml.`);
