import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const BASE = 'https://www.waikwantent.com';
const TODAY = new Date().toISOString().slice(0, 10);
const DEFAULT_IMAGE = `${BASE}/images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png`;

const POSIX = (p) => p.split(path.sep).join('/');
const rel = (abs) => POSIX(path.relative(ROOT, abs));
const abs = (relative) => path.join(ROOT, relative);

const ensureDir = (dir) => fs.mkdirSync(abs(dir), { recursive: true });
const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function decodeHtmlEntities(value) {
  let s = String(value ?? '');
  for (let i = 0; i < 4; i += 1) {
    const next = s
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    if (next === s) break;
    s = next;
  }
  return s;
}

const stripTags = (value) => decodeHtmlEntities(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const titleFromSlug = (file) => path.basename(file, '.html')
  .replace(/-/g, ' ')
  .replace(/\b\w/g, (m) => m.toUpperCase());

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'backend'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function webPath(relative) {
  const r = POSIX(relative).replace(/^\/+/, '');
  if (r === 'index.html') return '/';
  if (r === 'zh/index.html') return '/zh/';
  return `/${r}`;
}

function canonicalFor(relative) {
  const pathOnly = webPath(relative);
  const duplicateCanon = {
    'product.html': '/all-products.html',
    'products.html': '/product-center.html',
    'tent-detail.html': '/product-center.html',
    'products-tents.html': '/custom-canopy-tent-manufacturer.html',
    'products-flags.html': '/beach-flag-supplier.html',
    'products-displays.html': '/portable-display-systems.html',
    'products-lightbox.html': '/advertising-light-box-manufacturer.html',
    'products-inflatable.html': '/inflatable-tent-manufacturer.html',
    'products-custom.html': '/custom-printed-tent.html',
    'products-furniture.html': '/product-center.html',
    'racegate-type.html': '/product-center.html',
    'zh/product.html': '/zh/all-products.html',
    'zh/products.html': '/zh/product-center.html',
    'zh/products-tents.html': '/zh/custom-canopy-tent-manufacturer.html',
    'zh/products-flags.html': '/zh/beach-flag-supplier.html',
    'zh/products-displays.html': '/zh/portable-display-systems.html',
    'zh/products-lightbox.html': '/zh/seg-light-box-manufacturer.html',
    'zh/products-inflatable.html': '/zh/product-center.html',
    'zh/products-custom.html': '/zh/custom-printed-canopy-tents.html',
    'zh/products-furniture.html': '/zh/product-center.html',
    'zh/racegate-type.html': '/zh/product-center.html'
  };
  const cleanRel = relative.replace(/\\/g, '/');
  return `${BASE}${duplicateCanon[cleanRel] || pathOnly}`;
}

function isIntentionalNoindex(relative) {
  const r = relative.replace(/\\/g, '/');
  if (/^(index\.original|index\.wireframe|test_|googlead)/.test(r)) return true;
  if (/(^|\/)(product|products|tent-detail)\.html$/.test(r)) return true;
  if (/(^|\/)products-(tents|flags|displays|lightbox|inflatable|custom|furniture)\.html$/.test(r)) return true;
  if (/(^|\/)racegate-type\.html$/.test(r)) return true;
  if (/(^|\/)news\/contact-us\.html$/.test(r)) return true;
  if (r === '404.html') return true;
  return false;
}

function noindexReason(relative) {
  const r = relative.replace(/\\/g, '/');
  if (r === '404.html') return '404 error page must not be indexed.';
  if (/racegate-type\.html$/.test(r)) return 'Redirect stub for the race gate product-center view; the canonical product-center page is indexed instead.';
  if (/(product|products|tent-detail)\.html$/.test(r)) return 'Legacy duplicate entry point canonicalizes to the current product hub.';
  if (/products-/.test(r)) return 'Duplicate category-filter page; the canonical landing/category URL is indexed instead.';
  if (/test_|index\.(original|wireframe)/.test(r)) return 'Internal test or archived design file.';
  if (/news\/contact-us\.html$/.test(r)) return 'Duplicate contact page inside news path.';
  return 'Low-value non-canonical utility page.';
}

function upsertTitle(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  return html.replace(/<head[^>]*>/i, (m) => `${m}\n    <title>${escapeHtml(title)}</title>`);
}

function upsertMeta(html, attr, name, content) {
  const re = new RegExp(`<meta\\s+${attr}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
  const tag = `<meta ${attr}="${escapeHtml(name)}" content="${escapeHtml(content)}">`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/title>/i, `</title>\n    ${tag}`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}">`;
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/ig, tag);
    return html.replace(new RegExp(`${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), tag);
  }
  return html.replace(/<meta\s+name=["']description["'][^>]*>/i, (m) => `${m}\n    ${tag}`);
}

function upsertRobots(html, content, comment = '') {
  const tag = `<meta name="robots" content="${content}">`;
  const block = comment ? `<!-- ${escapeHtml(comment)} -->\n    ${tag}` : tag;
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    html = html.replace(/<!--\s*SEO note:[\s\S]*?-->\s*/ig, '');
    return html.replace(/<meta\s+name=["']robots["'][^>]*>/i, comment ? `<!-- SEO note: ${escapeHtml(comment)} -->\n    ${tag}` : tag);
  }
  return html.replace(/<meta\s+name=["']description["'][^>]*>/i, (m) => `${m}\n    ${block}`);
}

function upsertLink(html, relValue, attrs) {
  const hreflang = attrs.hreflang ? `\\s+hreflang=["']${attrs.hreflang}["']` : '';
  const re = new RegExp(`<link\\s+rel=["']${relValue}["']${hreflang}[^>]*>`, 'i');
  const attrText = Object.entries({ rel: relValue, ...attrs }).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ');
  const tag = `<link ${attrText}>`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, (m) => `${m}\n    ${tag}`);
}

function visibleFaqQuestions(html) {
  return (html.match(/<h[2-4][^>]*>[^<]*(FAQ|Questions|Common Buyer Questions|常见问题)[\s\S]*?<\/h[2-4]>/i) || []).length > 0;
}

function jsonLdScript(id, data) {
  return `<script type="application/ld+json" id="${id}">\n${JSON.stringify(data, null, 2)}\n    </script>`;
}

function upsertJsonLd(html, id, data) {
  const re = new RegExp(`<script\\s+type=["']application/ld\\+json["']\\s+id=["']${id}["'][\\s\\S]*?<\\/script>`, 'i');
  const tag = jsonLdScript(id, data);
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n</head>`);
}

function pageTitle(html, relative) {
  const existing = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  return stripTags(existing || h1 || `${titleFromSlug(relative)} | WaiKwan Tent`);
}

function pageDescription(html, relative) {
  const existing = (html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || [])[1];
  if (existing && stripTags(existing).length > 40) return stripTags(existing).slice(0, 180);
  return `${titleFromSlug(relative)} from WaiKwan, a B2B OEM/ODM manufacturer of canopy tents, beach flags, display systems, light boxes and outdoor advertising products.`;
}

function hreflangPair(relative) {
  const r = relative.replace(/\\/g, '/');
  if (r.startsWith('zh/')) {
    const en = r.replace(/^zh\//, '');
    if (fs.existsSync(abs(en))) return { en: `${BASE}${webPath(en)}`, zh: `${BASE}${webPath(r)}`, x: `${BASE}${webPath(en)}` };
  } else if (fs.existsSync(abs(`zh/${r}`))) {
    return { en: `${BASE}${webPath(r)}`, zh: `${BASE}${webPath(`zh/${r}`)}`, x: `${BASE}${webPath(r)}` };
  }
  return null;
}

const navHtml = (prefix = '') => `
    <header class="wk-simple-header">
      <a class="wk-simple-logo" href="${prefix}index.html"><img src="${prefix}images/waikwancompanylogo.png" alt="WaiKwan Tent logo" width="132" height="44" loading="eager" decoding="async"></a>
      <nav aria-label="Primary navigation">
        <a href="${prefix}product-center.html">Product Center</a>
        <a href="${prefix}all-products.html">All Products</a>
        <a href="${prefix}custom-canopy-tent-manufacturer.html">Canopy Tents</a>
        <a href="${prefix}beach-flag-supplier.html">Beach Flags</a>
        <a href="${prefix}contact-us.html">Get a Quote</a>
      </nav>
    </header>`;

const footerHtml = (prefix = '') => `
    <footer class="contact-bottom">
      <div class="contact-bottom__inner">
        <div class="contact-bottom__grid">
          <div class="contact-bottom__brand">
            <div class="contact-bottom__brandTitle">Guangxi WaiKwan Tent Manufacturing Co., Ltd.</div>
            <div class="contact-bottom__brandSub">OEM/ODM canopy tents, beach flags, portable display systems and outdoor advertising products.</div>
          </div>
          <div class="contact-bottom__cols">
            <div class="contact-bottom__col"><div class="contact-bottom__h">Products</div>
              <a class="contact-bottom__link" href="${prefix}custom-canopy-tent-manufacturer.html">Custom Canopy Tents</a>
              <a class="contact-bottom__link" href="${prefix}beach-flag-supplier.html">Beach Flags & Poles</a>
              <a class="contact-bottom__link" href="${prefix}portable-display-systems.html">Portable Display Systems</a>
              <a class="contact-bottom__link" href="${prefix}advertising-light-box-manufacturer.html">Advertising Light Boxes</a>
            </div>
            <div class="contact-bottom__col"><div class="contact-bottom__h">Buyer Resources</div>
              <a class="contact-bottom__link" href="${prefix}all-products.html">All Products</a>
              <a class="contact-bottom__link" href="${prefix}site-map.html">HTML Sitemap</a>
              <a class="contact-bottom__link" href="${prefix}faq.html">FAQ</a>
              <a class="contact-bottom__link" href="${prefix}contact-us.html">Request Quotation</a>
            </div>
          </div>
        </div>
      </div>
    </footer>`;

const landingPages = [
  {
    file: 'pop-up-canopy-tent-supplier.html',
    title: 'Pop Up Canopy Tent Supplier | Folding Event Tent OEM | WaiKwan',
    description: 'B2B pop up canopy tent supplier for event, promotion and retail buyers. Compare sizes, frame options, custom printing, export packing and OEM/ODM support.',
    h1: 'Pop Up Canopy Tent Supplier for Events, Promotions and Resale',
    image: 'images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png',
    category: 'Canopy tents',
    specs: ['WK-T30 steel frame series for budget event programs', 'WK-T40 aluminum frame series for frequent commercial use', 'WK-T50 heavy-duty aluminum frame series for larger outdoor events', 'Common sizes include 1.5x1.5m, 2x2m, 2.5x2.5m, 3x3m, 3x4.5m, 3x6m, 4x4m, 4x6m and 4x8m'],
    links: [['Custom canopy tent manufacturer', 'custom-canopy-tent-manufacturer.html'], ['Aluminum folding tent', 'aluminum-folding-tent.html'], ['All products', 'all-products.html']]
  },
  {
    file: 'custom-printed-tent.html',
    title: 'Custom Printed Tent Manufacturer | OEM Event Canopies | WaiKwan',
    description: 'Custom printed tents for B2B promotions, trade shows and retail events. OEM canopy sizes, fabric printing, frame selection, packaging and export support.',
    h1: 'Custom Printed Tent Manufacturer for B2B Promotional Programs',
    image: 'images/products/tents/folding40/40mm-pop-up-canopy-tent-2d-layout-hero.png',
    category: 'Custom printed tents',
    specs: ['Logo printing on valances, roof panels, sidewalls and half walls', 'Frame choices include steel, aluminum and heavy-duty aluminum structures', 'Waterproof and fire-retardant fabric options where specified by the buyer', 'Accessory options include walls, counters, bags, weights, gutters and flag connectors'],
    links: [['Custom canopy tents', 'custom-canopy-tent-manufacturer.html'], ['Canopy tent buying guide', 'canopy-tent-buying-guide.html'], ['Contact sales', 'contact-us.html']]
  },
  {
    file: 'flag-pole-and-base-manufacturer.html',
    title: 'Flag Pole and Base Manufacturer | Beach Flag Hardware | WaiKwan',
    description: 'Beach flag pole and base manufacturer for distributors, print shops and agencies. Fiberglass, aluminum, ground spikes, cross bases and water bases.',
    h1: 'Flag Pole and Base Manufacturer for Beach Flag Programs',
    image: 'images/products/flags/accessories/beach-flag-poles-ground-stakes-cross-bases-hardware-kit.png',
    category: 'Flag hardware',
    specs: ['Fiberglass poles for feather, teardrop and square beach flags', 'Aluminum plus fiberglass pole options for selected flag systems', 'Ground spikes, cross bases, water bases, rotors, bags and replacement hardware', 'Designed for print shops, agencies and distributors that need repeatable flag kits'],
    links: [['Beach flag supplier', 'beach-flag-supplier.html'], ['Beach flag buying guide', 'beach-flag-buying-guide.html'], ['Flag type page', 'flag-type.html']]
  },
  {
    file: 'inflatable-tent-manufacturer.html',
    title: 'Inflatable Tent Manufacturer | Event Spider Tents & Race Gates | WaiKwan',
    description: 'Inflatable tent manufacturer for outdoor events, racing and promotions. Spider tents, race gates, advertising arches and custom printed event structures.',
    h1: 'Inflatable Tent Manufacturer for Events, Racing and Outdoor Promotions',
    image: 'images/products/tents/inflatable/inflatable-spider-tent-outdoor-event-hero.jpg',
    category: 'Inflatable tents',
    specs: ['Inflatable spider tents for outdoor event coverage and brand activation', 'Race gate and advertising arch structures for sports and event entrances', 'Custom printing options for logos, sponsor graphics and campaign colors', 'Export packing and production support for event rental and distributor buyers'],
    links: [['Race gate products', 'racegate-type.html'], ['Event canopy tents', 'event-canopy-tents.html'], ['Request a quote', 'contact-us.html']]
  },
  {
    file: 'event-tent-and-promotional-display.html',
    title: 'Event Tent and Promotional Display Manufacturer | WaiKwan',
    description: 'Event tent and promotional display manufacturer combining canopy tents, beach flags, counters, backwalls, light boxes and outdoor advertising hardware.',
    h1: 'Event Tent and Promotional Display Manufacturer',
    image: 'images/products/displays/tension-fabric-displays/wk-is003hero.jpg',
    category: 'Event display systems',
    specs: ['Canopy tents, feather flags, counters, roll up stands, backwalls and light boxes in one factory-direct program', 'Useful for trade shows, retail promotion, sports events, roadshows and outdoor advertising', 'OEM/ODM support for sizes, frame materials, graphics, packaging and carton marks', 'Buyer-friendly quote process for distributors, agencies, brands and rental companies'],
    links: [['Portable display systems', 'portable-display-systems.html'], ['Pop up canopy tent supplier', 'pop-up-canopy-tent-supplier.html'], ['Product center', 'product-center.html']]
  },
  {
    file: 'advertising-light-box-manufacturer.html',
    title: 'Advertising Light Box Manufacturer | SEG Fabric Displays | WaiKwan',
    description: 'Advertising light box manufacturer for SEG fabric light boxes, aluminum profile displays and backlit retail or exhibition branding systems.',
    h1: 'Advertising Light Box Manufacturer for SEG Fabric Displays',
    image: 'images/products/light-box-series/aluminum-profile-seg-fabric-light-box-hero.jpg',
    category: 'Light boxes',
    specs: ['SEG fabric light boxes with aluminum profile frame options', 'Backlit display stands for retail, exhibition booths and brand walls', 'Portable hardware with replaceable fabric graphics for repeat campaigns', 'Custom sizing, printing, packaging and export quotation support'],
    links: [['SEG light box manufacturer', 'seg-light-box-manufacturer.html'], ['Portable display systems', 'portable-display-systems.html'], ['All products', 'all-products.html']]
  }
];

function landingPageHtml(page) {
  const canonical = `${BASE}/${page.file}`;
  const faq = [
    ['Can WaiKwan support OEM or ODM production?', 'Yes. WaiKwan supports OEM/ODM production for international buyers, including size planning, hardware selection, custom graphics, carton labeling and export-ready packaging.'],
    ['What information is needed for a quotation?', 'Please share product type, size, quantity, frame or hardware preference, fabric and printing requirements, destination country and deadline. Artwork files can be discussed after the first quotation.'],
    ['Are exact prices listed online?', 'Public prices are not listed because B2B pricing depends on size, specification, print coverage, quantity, packaging and shipment requirements.']
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd.', alternateName: 'WaiKwan', url: `${BASE}/`, logo: `${BASE}/images/waikwancompanylogo.png` },
      { '@type': 'CollectionPage', '@id': `${canonical}#webpage`, url: canonical, name: page.h1, description: page.description, isPartOf: { '@id': `${BASE}/#website` }, about: { '@id': `${BASE}/#organization` } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name: page.h1, item: canonical }] },
      { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ]
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    <meta property="og:site_name" content="WaiKwan">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${BASE}/${page.image}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.title)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:url" content="${canonical}">
    <meta name="twitter:image" content="${BASE}/${page.image}">
    <link rel="stylesheet" href="styles/main.css">
    <script src="scripts/bilingual-routing.js" defer></script>
    <script src="scripts/seo.js" defer></script>
    ${jsonLdScript('wk-landing-schema', schema)}
</head>
<body class="wk-seo-landing">
${navHtml('')}
<main>
  <section class="wk-landing-hero">
    <div>
      <p class="wk-eyebrow">Factory-direct B2B manufacturing</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="wk-landing-lead">${escapeHtml(page.description)} WaiKwan helps importers, distributors, print shops, event companies and brand teams create repeatable product programs with practical specifications rather than generic catalog promises.</p>
      <div class="wk-landing-actions">
        <a class="btn btn-primary" href="contact-us.html?product=${encodeURIComponent(page.h1)}">Get a Quote</a>
        <a class="btn btn-secondary" href="all-products.html">View Products</a>
      </div>
    </div>
    <img src="${page.image}" alt="${escapeHtml(page.h1)} product example from WaiKwan" width="900" height="560" loading="eager" decoding="async">
  </section>
  <section class="wk-landing-section">
    <h2>What WaiKwan manufactures</h2>
    <p>Guangxi WaiKwan Tent Manufacturing Co., Ltd. manufactures canopy tents, folding tents, beach flags, flag poles, flag bases, inflatable tents, race gates, dome tents, A-frame displays, backdrop systems, roll up stands, promotion counters, advertising light boxes, outdoor furniture, umbrellas, umbrella bases and tent accessories. The company serves B2B buyers that need stable production, clear specification communication and export-ready support.</p>
    <p>For ${escapeHtml(page.category.toLowerCase())}, the buying decision usually depends on frame or hardware strength, print method, size range, packing volume, replacement parts and how well the product fits repeat orders. WaiKwan organizes these details into quotation discussions so buyers can compare options before confirming samples or bulk production.</p>
  </section>
  <section class="wk-landing-section wk-landing-grid">
    <div>
      <h2>Common specifications</h2>
      <table class="wk-spec-table">
        <tbody>
          ${page.specs.map((item, i) => `<tr><th>Option ${i + 1}</th><td>${escapeHtml(item)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <div>
      <h2>Buyer applications</h2>
      <p>Typical uses include trade shows, outdoor events, retail promotions, sports events, emergency relief support, roadshows, store openings and advertising displays. For agencies and distributors, WaiKwan can help align product size, graphic coverage, packaging and shipping method with the buyer's sales channel.</p>
      <p>Custom printing can be discussed for logos, full-panel graphics, fabric backwalls, flags, counters and light box graphics. Where the final artwork file is not ready, the buyer can still request a preliminary quotation using size, quantity and target application.</p>
    </div>
  </section>
  <section class="wk-landing-section">
    <h2>How to order</h2>
    <ol class="wk-order-list">
      <li>Send product type, size, quantity, material preference and destination country.</li>
      <li>Confirm frame, fabric, graphic area, accessories and packaging requirements.</li>
      <li>Review quotation, artwork proof and sample or production schedule.</li>
      <li>Start production, quality checking, carton labeling and export packing.</li>
      <li>Arrange shipment by courier, air or sea freight depending on the order plan.</li>
    </ol>
  </section>
  <section class="wk-landing-section">
    <h2>Related products and resources</h2>
    <div class="wk-related-links">
      ${page.links.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join('\n      ')}
      <a href="site-map.html">HTML sitemap</a>
    </div>
  </section>
  <section class="wk-landing-section">
    <h2>Common buyer questions</h2>
    ${faq.map(([q, a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join('\n    ')}
  </section>
  <section class="wk-landing-cta">
    <h2>Request a factory quotation</h2>
    <p>Share the product type, size, quantity, printing requirements, destination country and deadline. WaiKwan will help confirm a practical manufacturing specification for your project.</p>
    <a class="btn btn-primary" href="contact-us.html?product=${encodeURIComponent(page.h1)}">Contact WaiKwan</a>
  </section>
</main>
${footerHtml('')}
</body>
</html>
`;
}

function createLandingPages() {
  const created = [];
  for (const page of landingPages) {
    const file = abs(page.file);
    if (!fs.existsSync(file)) {
      write(file, landingPageHtml(page));
      created.push(page.file);
    }
  }
  return created;
}

function create404() {
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found | WaiKwan Tent</title>
    <meta name="description" content="The requested WaiKwan page was not found. Use product shortcuts or contact the factory team for canopy tents, beach flags and display systems.">
    <!-- SEO note: 404 error page must not be indexed. -->
    <meta name="robots" content="noindex,follow">
    <link rel="canonical" href="${BASE}/404.html">
    <link rel="stylesheet" href="styles/main.css">
</head>
<body class="wk-error-page">
${navHtml('')}
<main class="wk-404">
  <p class="wk-eyebrow">404 error</p>
  <h1>We could not find that page.</h1>
  <p>The page may have moved, or the URL may include an old product/filter path. You can continue through the main product routes below or send a factory inquiry.</p>
  <div class="wk-related-links">
    <a href="index.html">Home</a>
    <a href="product-center.html">Product Center</a>
    <a href="all-products.html">All Products</a>
    <a href="custom-canopy-tent-manufacturer.html">Canopy Tents</a>
    <a href="beach-flag-supplier.html">Beach Flags</a>
    <a href="portable-display-systems.html">Portable Displays</a>
    <a href="contact-us.html">Contact / Get a Quote</a>
  </div>
  <section class="wk-landing-cta">
    <h2>Need help finding a product?</h2>
    <p>Send product type, size, quantity, printing request and destination country. WaiKwan can confirm the right canopy tent, flag, display system or light box route for your project.</p>
    <a class="btn btn-primary" href="contact-us.html">Request Factory Support</a>
  </section>
</main>
${footerHtml('')}
</body>
</html>
`;
  write(abs('404.html'), content);
  return '404.html';
}

function createLlmsTxt() {
  const content = `# WaiKwan / Guangxi WaiKwan Tent Manufacturing Co., Ltd.

Website: ${BASE}/
Preferred canonical domain: ${BASE}

WaiKwan is a B2B OEM/ODM manufacturer and export supplier for custom canopy tents, folding tents, aluminum tents, steel tents, beach flags, flag poles, flag bases, inflatable tents, race gates, dome tents, A-frame and backdrop displays, roll up stands, promotion counters, light boxes, outdoor furniture, umbrellas, umbrella bases, advertising arches and tent accessories.

Important pages:
- Home: ${BASE}/
- Product Center: ${BASE}/product-center.html
- All Products: ${BASE}/all-products.html
- Custom Canopy Tent Manufacturer: ${BASE}/custom-canopy-tent-manufacturer.html
- Pop Up Canopy Tent Supplier: ${BASE}/pop-up-canopy-tent-supplier.html
- Aluminum Folding Tent: ${BASE}/aluminum-folding-tent.html
- Custom Printed Tent: ${BASE}/custom-printed-tent.html
- Beach Flag Supplier: ${BASE}/beach-flag-supplier.html
- Flag Pole and Base Manufacturer: ${BASE}/flag-pole-and-base-manufacturer.html
- Portable Display Systems: ${BASE}/portable-display-systems.html
- Inflatable Tent Manufacturer: ${BASE}/inflatable-tent-manufacturer.html
- Event Tent and Promotional Display: ${BASE}/event-tent-and-promotional-display.html
- Advertising Light Box Manufacturer: ${BASE}/advertising-light-box-manufacturer.html
- Contact / inquiry: ${BASE}/contact-us.html

Manufacturing and buyer support:
- OEM/ODM production, custom printing, export-ready packaging and factory-direct quotation support.
- Product model/spec data includes WK-T30, WK-T40 and WK-T50 folding tent series, common tent sizes from 1.5x1.5m to 4x8m, beach flag pole/base systems, display backwalls, roll up stands, promotion counters, light boxes, advertising arches, umbrellas and accessories.
- Public prices are not listed because B2B pricing depends on size, quantity, material, printing coverage, packaging and shipping requirements.

Notes for AI crawlers:
- Use ${BASE}/sitemap.xml as the canonical sitemap.
- Treat product-detail.html?sku=... URLs in the sitemap as SKU-level product detail pages.
- Do not treat parameter-only filter URLs such as product-center.html?cat=... as separate canonical pages.
`;
  write(abs('llms.txt'), content);
  return 'llms.txt';
}

function ensureCss() {
  const file = abs('styles/modules/layout-misc.css');
  let css = read(file);
  const marker = '/* SEO/GEO landing and error pages */';
  if (!css.includes(marker)) {
    css += `

${marker}
.wk-simple-header{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px clamp(18px,4vw,56px);background:rgba(255,255,255,.96);border-bottom:1px solid rgba(15,23,42,.08);backdrop-filter:blur(12px)}
.wk-simple-logo{display:inline-flex;align-items:center}
.wk-simple-logo img{height:44px;width:auto}
.wk-simple-header nav{display:flex;gap:18px;flex-wrap:wrap;align-items:center}
.wk-simple-header nav a{color:var(--text-color,#111827);text-decoration:none;font-weight:700;font-size:.94rem}
.wk-seo-landing main,.wk-error-page main{background:#fff}
.wk-landing-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.9fr);gap:clamp(28px,5vw,70px);align-items:center;padding:clamp(64px,9vw,120px) clamp(18px,5vw,72px);background:linear-gradient(135deg,#fff 0%,#f8fafc 48%,#fff4f4 100%)}
.wk-landing-hero h1,.wk-404 h1{font-size:clamp(2.25rem,5vw,4.5rem);line-height:1.04;margin:0 0 18px;color:#111827;letter-spacing:-.04em}
.wk-landing-lead,.wk-404 p{font-size:1.08rem;line-height:1.75;color:#475569;max-width:760px}
.wk-eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;font-weight:900;color:var(--primary-color,#a4161a);margin:0 0 12px}
.wk-landing-actions,.wk-related-links{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.wk-landing-hero img{width:100%;height:auto;border-radius:28px;box-shadow:0 24px 70px rgba(15,23,42,.16);background:#fff}
.wk-landing-section{padding:clamp(46px,7vw,86px) clamp(18px,5vw,72px);max-width:1180px;margin:0 auto}
.wk-landing-section h2,.wk-landing-cta h2{font-size:clamp(1.65rem,3vw,2.5rem);line-height:1.15;margin:0 0 18px;color:#111827}
.wk-landing-section p,.wk-landing-section li,.wk-landing-section td{line-height:1.75;color:#475569}
.wk-landing-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.wk-spec-table{width:100%;border-collapse:collapse;background:#fff;border:1px solid rgba(15,23,42,.1);border-radius:18px;overflow:hidden}
.wk-spec-table th,.wk-spec-table td{padding:14px 16px;border-bottom:1px solid rgba(15,23,42,.08);text-align:left;vertical-align:top}
.wk-spec-table th{width:130px;background:#f8fafc;color:#111827;font-weight:800}
.wk-order-list{display:grid;gap:12px;margin:0;padding-left:1.3rem}
.wk-related-links a{display:inline-flex;align-items:center;padding:12px 16px;border-radius:999px;background:#f8fafc;border:1px solid rgba(15,23,42,.1);font-weight:800;text-decoration:none;color:#111827}
.wk-landing-section details{border:1px solid rgba(15,23,42,.1);border-radius:16px;padding:16px 18px;margin:12px 0;background:#fff}
.wk-landing-section summary{cursor:pointer;font-weight:900;color:#111827}
.wk-landing-cta,.wk-404{margin:0 clamp(18px,5vw,72px) clamp(54px,8vw,96px);padding:clamp(34px,5vw,60px);border-radius:28px;background:#111827;color:#fff}
.wk-landing-cta p{color:rgba(255,255,255,.78);max-width:760px;line-height:1.75}
.wk-404{margin-top:clamp(64px,9vw,120px)}
.wk-404 .wk-related-links a{background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.18)}
@media (max-width:860px){.wk-simple-header{position:static;align-items:flex-start;flex-direction:column}.wk-landing-hero,.wk-landing-grid{grid-template-columns:1fr}.wk-landing-hero{padding-top:42px}.wk-simple-header nav{gap:12px}.wk-simple-header nav a{font-size:.9rem}}
`;
    write(file, css);
  }
  return 'styles/modules/layout-misc.css';
}

function enhanceContactForm() {
  const file = abs('contact-us.html');
  let html = read(file);
  const before = html;
  const productField = `<input id="product" type="text" name="product" required data-translate-placeholder="inquiry_field_product_placeholder" />`;
  const richer = `<input id="product" type="text" name="product" required data-translate-placeholder="inquiry_field_product_placeholder" />
                                <small class="quote-form__hint">Tip: include product type or paste the product URL. Quote links can prefill this field with ?product=.</small>`;
  if (html.includes(productField) && !html.includes('Quote links can prefill')) html = html.replace(productField, richer);
  if (!html.includes('name="frame_material"')) {
    const quoteDetails = `                            <label>
                                <span>Frame / hardware material</span>
                                <input id="frame_material" type="text" name="frame_material" placeholder="Steel, aluminum, fiberglass pole, SEG profile, etc.">
                            </label>
                            <label>
                                <span>Fabric and printing requirements</span>
                                <input id="fabric_printing" type="text" name="fabric_printing" placeholder="Fabric type, logo position, full print, PMS color, etc.">
                            </label>
                            <label>
                                <span>Destination country and deadline</span>
                                <input id="deadline" type="text" name="deadline" placeholder="Destination country, required date or event date">
                            </label>`;
    html = html.replace(/(<label>\s*<span[^>]*data-translate="inquiry_field_quantity_label"[\s\S]*?<\/label>)/i, `$1\n${quoteDetails}`);
  }
  if (!html.includes('Artwork upload note')) {
    html = html.replace(/<textarea name="message" rows="4"[^>]*><\/textarea>/i, (m) => `${m}
                                <small class="quote-form__hint">Artwork upload note: if files are not supported by this form, mention available AI/PDF/PSD files and our sales team will advise the sending method.</small>`);
  }
  if (html !== before) write(file, html);
  return html !== before ? 'contact-us.html' : null;
}

function enhanceContactScript() {
  const file = abs('scripts/contact.js');
  let js = read(file);
  const before = js;
  js = js.replace(`quantity: get('quantity'),
    target_market: get('target_market'),
    message: get('message'),`, `quantity: get('quantity'),
    frame_material: get('frame_material'),
    fabric_printing: get('fabric_printing'),
    target_market: get('target_market'),
    deadline: get('deadline'),
    message: get('message'),`);
  if (!js.includes('prefillProductFromUrl')) {
    js = js.replace(`const msgBox = document.getElementById("formMessage");`, `const msgBox = document.getElementById("formMessage");

  function prefillProductFromUrl() {
    try {
      const value = new URL(window.location.href).searchParams.get('product');
      if (!value) return;
      const productInput = form.elements && form.elements.product;
      if (productInput && !String(productInput.value || '').trim()) {
        productInput.value = value;
      }
    } catch (err) {
      /* Product-aware quote links are optional. */
    }
  }

  prefillProductFromUrl();`);
  }
  if (js !== before) write(file, js);
  return js !== before ? 'scripts/contact.js' : null;
}

function enhanceHomeLinks() {
  const file = abs('index.html');
  let html = read(file);
  if (html.includes('wk-seo-hub-links')) return null;
  const block = `
        <section class="wk-section wk-seo-hub-links" aria-label="B2B product landing pages">
            <div class="container">
                <div class="section-header">
                    <span class="section-badge">Buyer Shortcuts</span>
                    <h2>Factory Product Routes for International Buyers</h2>
                    <p>Explore canonical landing pages for the main B2B search intents: canopy tents, printed tents, beach flag hardware, portable displays, inflatable event structures and light boxes.</p>
                </div>
                <div class="wk-related-links">
                    <a href="custom-canopy-tent-manufacturer.html">Custom Canopy Tent Manufacturer</a>
                    <a href="pop-up-canopy-tent-supplier.html">Pop Up Canopy Tent Supplier</a>
                    <a href="custom-printed-tent.html">Custom Printed Tent</a>
                    <a href="beach-flag-supplier.html">Beach Flag Supplier</a>
                    <a href="flag-pole-and-base-manufacturer.html">Flag Pole and Base Manufacturer</a>
                    <a href="portable-display-systems.html">Portable Display Systems</a>
                    <a href="inflatable-tent-manufacturer.html">Inflatable Tent Manufacturer</a>
                    <a href="event-tent-and-promotional-display.html">Event Tent and Promotional Display</a>
                    <a href="advertising-light-box-manufacturer.html">Advertising Light Box Manufacturer</a>
                </div>
            </div>
        </section>`;
  html = html.replace(/<section class="wk-section wk-section--conversion" id="factory-strength">/i, `${block}\n\n        <section class="wk-section wk-section--conversion" id="factory-strength">`);
  write(file, html);
  return 'index.html';
}

function enhanceProductCenterLinks() {
  const targets = ['product-center.html', 'all-products.html', 'site-map.html'];
  const changed = [];
  const block = `
                <section class="seo-content wk-seo-hub-links" aria-label="Canonical B2B landing pages">
                    <h2>Buyer-focused product landing pages</h2>
                    <p>Use these crawlable pages to compare core WaiKwan manufacturing programs before opening product detail SKUs or sending an inquiry.</p>
                    <div class="wk-related-links">
                        <a href="custom-canopy-tent-manufacturer.html">Custom Canopy Tents</a>
                        <a href="pop-up-canopy-tent-supplier.html">Pop Up Canopy Tents</a>
                        <a href="custom-printed-tent.html">Custom Printed Tents</a>
                        <a href="beach-flag-supplier.html">Beach Flags</a>
                        <a href="flag-pole-and-base-manufacturer.html">Flag Poles & Bases</a>
                        <a href="portable-display-systems.html">Portable Displays</a>
                        <a href="inflatable-tent-manufacturer.html">Inflatable Tents</a>
                        <a href="event-tent-and-promotional-display.html">Event Displays</a>
                        <a href="advertising-light-box-manufacturer.html">Advertising Light Boxes</a>
                    </div>
                </section>`;
  for (const target of targets) {
    const file = abs(target);
    if (!fs.existsSync(file)) continue;
    let html = read(file);
    if (html.includes('Canonical B2B landing pages')) continue;
    html = html.replace(/<\/main>/i, `${block}\n</main>`);
    write(file, html);
    changed.push(target);
  }
  return changed;
}

function parseProductSeoMap() {
  const file = abs('scripts/product-seo-map.js');
  if (!fs.existsSync(file)) return {};
  const text = read(file);
  const match = text.match(/window\.WK_PRODUCT_SEO_MAP\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

function normalizeHtmlFiles() {
  const report = {
    totalPagesScanned: 0,
    pagesIndexable: 0,
    pagesNoindex: 0,
    missingTitleBeforeFix: [],
    missingDescriptionBeforeFix: [],
    missingCanonicalBeforeFix: [],
    excludedFromSitemap: [],
    brokenLinksFound: [],
    redirectCanonicalMismatchFound: [],
    changedFiles: []
  };

  const htmlFiles = walk(ROOT).filter((f) => f.toLowerCase().endsWith('.html'));
  const existingHtml = new Set(htmlFiles.map((f) => rel(f)));
  for (const file of htmlFiles) {
    const relative = rel(file);
    if (/^backend\//.test(relative)) continue;
    report.totalPagesScanned += 1;
    let html = read(file);
    const before = html;
    const wasMissingTitle = !/<title>[\s\S]*?<\/title>/i.test(html);
    const wasMissingDescription = !/<meta\s+name=["']description["'][^>]*>/i.test(html);
    const wasMissingCanonical = !/<link\s+rel=["']canonical["'][^>]*>/i.test(html);
    if (wasMissingTitle) report.missingTitleBeforeFix.push(relative);
    if (wasMissingDescription) report.missingDescriptionBeforeFix.push(relative);
    if (wasMissingCanonical) report.missingCanonicalBeforeFix.push(relative);

    const intentionalNoindex = isIntentionalNoindex(relative);
    const canonical = canonicalFor(relative);
    const title = pageTitle(html, relative);
    const description = pageDescription(html, relative);
    const image = (html.match(/<meta\s+property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) || [])[1] || DEFAULT_IMAGE;
    const absImage = /^https?:\/\//i.test(image) ? image.replace(/^https:\/\/waikwantent\.com/i, BASE) : `${BASE}/${image.replace(/^\/+/, '')}`;

    html = upsertTitle(html, title);
    html = upsertMeta(html, 'name', 'description', description);
    html = upsertRobots(html, intentionalNoindex ? 'noindex,follow' : 'index,follow', intentionalNoindex ? noindexReason(relative) : '');
    html = upsertCanonical(html, canonical);
    html = upsertMeta(html, 'property', 'og:site_name', 'WaiKwan');
    html = upsertMeta(html, 'property', 'og:type', /product-detail\.html$/.test(relative) ? 'product' : 'website');
    html = upsertMeta(html, 'property', 'og:title', title);
    html = upsertMeta(html, 'property', 'og:description', description);
    html = upsertMeta(html, 'property', 'og:url', canonical);
    html = upsertMeta(html, 'property', 'og:image', absImage);
    html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
    html = upsertMeta(html, 'name', 'twitter:title', title);
    html = upsertMeta(html, 'name', 'twitter:description', description);
    html = upsertMeta(html, 'name', 'twitter:url', canonical);
    html = upsertMeta(html, 'name', 'twitter:image', absImage);

    const pair = hreflangPair(relative);
    if (pair && !intentionalNoindex) {
      html = upsertLink(html, 'alternate', { hreflang: 'en', href: pair.en });
      html = upsertLink(html, 'alternate', { hreflang: 'zh-CN', href: pair.zh });
      html = upsertLink(html, 'alternate', { hreflang: 'x-default', href: pair.x });
    }

    if (!intentionalNoindex && !/product-detail\.html$/i.test(relative)) {
      html = upsertJsonLd(html, 'wk-auto-webpage-schema', {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': `${BASE}/#website` },
        about: { '@id': `${BASE}/#organization` },
        inLanguage: relative.startsWith('zh/') ? 'zh-CN' : 'en'
      });
      html = upsertJsonLd(html, 'wk-auto-breadcrumb-schema', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: title.replace(/\s*\|.*$/, ''), item: canonical }
        ]
      });
      if (visibleFaqQuestions(html)) {
        // FAQPage is added only when the page visibly contains an FAQ/question section.
        html = upsertJsonLd(html, 'wk-auto-faq-presence-schema', {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: `How can buyers request ${title.replace(/\s*\|.*$/, '')}?`, acceptedAnswer: { '@type': 'Answer', text: 'Buyers can send product type, size, quantity, printing requirements, destination country and deadline through the WaiKwan contact form.' } }
          ]
        });
      }
    }

    if (html !== before) {
      write(file, html);
      report.changedFiles.push(relative);
    }
    if (intentionalNoindex) {
      report.pagesNoindex += 1;
      report.excludedFromSitemap.push({ path: relative, reason: noindexReason(relative) });
    } else {
      report.pagesIndexable += 1;
    }

    for (const match of html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/ig)) {
      const href = match[1];
      if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
      const clean = href.split('#')[0].split('?')[0].replace(/^\.\//, '').replace(/^\//, '');
      if (!clean || clean.endsWith('/') || !clean.endsWith('.html')) continue;
      const resolved = href.startsWith('/')
        ? POSIX(path.normalize(clean))
        : POSIX(path.normalize(path.join(path.dirname(relative), clean)));
      if (!existingHtml.has(resolved)) report.brokenLinksFound.push({ from: relative, href });
    }
  }
  report.brokenLinksFound = Array.from(new Map(report.brokenLinksFound.map((x) => [`${x.from}|${x.href}`, x])).values());
  return report;
}

function generateSitemaps(report, productSeoMap) {
  const urls = [];
  const htmlFiles = walk(ROOT).filter((f) => f.toLowerCase().endsWith('.html'));
  for (const file of htmlFiles) {
    const relative = rel(file);
    if (isIntentionalNoindex(relative)) continue;
    if (/(^|\/)product-detail\.html$/i.test(relative.replace(/\\/g, '/'))) continue;
    const canonical = canonicalFor(relative);
    if (!canonical.startsWith(BASE)) continue;
    urls.push({ loc: canonical, priority: canonical === `${BASE}/` ? '1.0' : '0.8' });
  }
  for (const sku of Object.keys(productSeoMap).sort()) {
    const safeSku = encodeURIComponent(sku);
    urls.push({ loc: `${BASE}/product-detail.html?sku=${safeSku}`, priority: '0.7' });
    urls.push({ loc: `${BASE}/zh/product-detail.html?sku=${safeSku}`, priority: '0.6' });
  }
  const unique = Array.from(new Map(urls.map((u) => [u.loc, u])).values()).sort((a, b) => a.loc.localeCompare(b.loc));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  write(abs('sitemap.xml'), xml);
  write(abs('page-sitemap.xml'), xml);
  report.sitemapUrlCount = unique.length;
  report.sitemapSample = unique.slice(0, 10).map((u) => u.loc);
  return ['sitemap.xml', 'page-sitemap.xml'];
}

function generateRobots() {
  const robots = `# Waikwan Tent - ${BASE}/robots.txt
# Canonical production host: ${BASE}

User-agent: *
Allow: /

# Server / development-only paths
Disallow: /backend/

# Internal test or archived design files
Disallow: /index.original.html
Disallow: /index.wireframe.html
Disallow: /test_logo.html
Disallow: /test_stats.html

# Low-value duplicate/legacy entry points; canonical pages remain allowed.
Disallow: /product.html
Disallow: /products.html
Disallow: /tent-detail.html

Sitemap: ${BASE}/sitemap.xml
`;
  write(abs('robots.txt'), robots);
  return 'robots.txt';
}

function finalReport(report, changedFiles) {
  const md = `# Final SEO Upgrade Summary

Generated: ${TODAY}

## Files Changed
${changedFiles.map((f) => `- \`${f}\``).join('\n')}

## SEO / Indexing Issues Fixed
- Preferred canonical domain normalized to \`${BASE}\` in canonical, Open Graph, Twitter and generated sitemap URLs.
- Accidental noindex was removed from indexable pages by standardizing important static pages to \`index,follow\`.
- Intentional noindex remains only on legacy duplicates, redirect stubs, tests and the 404 page, with inline comments explaining why.
- \`sitemap.xml\` and \`page-sitemap.xml\` were regenerated with canonical, indexable static URLs plus SKU-level \`product-detail.html?sku=...\` URLs from \`scripts/product-seo-map.js\`.
- Legacy duplicate pages are excluded from the sitemap and canonicalized to the preferred product/category pages.
- A custom \`404.html\` was added with noindex, product shortcuts and inquiry CTAs.

## New Pages / Sections Added
- New B2B SEO landing pages for pop-up canopy tents, custom printed tents, flag poles and bases, inflatable tents, event tent/display systems and advertising light boxes.
- Homepage, Product Center, All Products and HTML sitemap received crawlable links to the canonical B2B landing pages.
- \`llms.txt\` was added for AI answer engines with entity, product category and important page guidance.

## Structured Data Added
- Static pages receive WebPage and BreadcrumbList JSON-LD where appropriate.
- New landing pages include Organization, CollectionPage, BreadcrumbList and FAQPage JSON-LD.
- Product SKU URLs remain supported by product-detail runtime Product JSON-LD and are included in the sitemap; the bare product-detail template itself is omitted from sitemap output.

## Internal Linking Improved
- Homepage now links to high-value B2B landing pages using real \`<a href>\` links.
- Product Center, All Products and Site Map now include canonical landing page shortcuts.
- 404 page links users and crawlers back to Home, Product Center, All Products, category landing pages and Contact.

## Google Search Console Next Steps
- Submit \`${BASE}/sitemap.xml\` again.
- Use URL Inspection for \`${BASE}/\`, \`${BASE}/product-center.html\`, \`${BASE}/all-products.html\`, \`${BASE}/custom-canopy-tent-manufacturer.html\`, \`${BASE}/beach-flag-supplier.html\`, \`${BASE}/portable-display-systems.html\`, \`${BASE}/pop-up-canopy-tent-supplier.html\`, \`${BASE}/custom-printed-tent.html\`, \`${BASE}/flag-pole-and-base-manufacturer.html\`, \`${BASE}/inflatable-tent-manufacturer.html\`, \`${BASE}/event-tent-and-promotional-display.html\`, and \`${BASE}/advertising-light-box-manufacturer.html\`.
- Click Validate Fix for noindex cleanup, redirect error cleanup, 404 cleanup and Crawled - currently not indexed after content improvements.
- Wait for Google to recrawl; indexing movement normally happens gradually after sitemap recrawl and URL Inspection requests.

## Limitations / Manual Checks
- GitHub Pages does not provide true server-side 301 redirects in this static setup; legacy duplicate pages are handled with noindex/canonical rather than server redirects.
- Product detail pages are rendered from JavaScript; validate several SKU URLs in a browser and Rich Results Test after deployment.
- Review any broken-link entries in \`reports/seo-upgrade-report.json\`; some may be intentionally externalized by scripts or language routing.
`;
  ensureDir('reports');
  write(abs('reports/final-seo-upgrade-summary.md'), md);
  return 'reports/final-seo-upgrade-summary.md';
}

function main() {
  ensureDir('reports');
  const changed = [];
  changed.push(...createLandingPages());
  changed.push(create404());
  changed.push(createLlmsTxt());
  changed.push(ensureCss());
  const contact = enhanceContactForm();
  if (contact) changed.push(contact);
  const contactScript = enhanceContactScript();
  if (contactScript) changed.push(contactScript);
  const home = enhanceHomeLinks();
  if (home) changed.push(home);
  changed.push(...enhanceProductCenterLinks());
  const productSeoMap = parseProductSeoMap();
  const report = normalizeHtmlFiles();
  changed.push(...report.changedFiles);
  changed.push(...generateSitemaps(report, productSeoMap));
  changed.push(generateRobots());
  const uniqueChanged = Array.from(new Set(changed)).sort();
  report.changedFiles = uniqueChanged;
  report.productSkuUrlsAddedToSitemap = Object.keys(productSeoMap).length * 2;
  report.preferredDomain = BASE;
  report.generatedAt = new Date().toISOString();
  write(abs('reports/seo-upgrade-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  uniqueChanged.push('reports/seo-upgrade-report.json');
  uniqueChanged.push(finalReport(report, uniqueChanged));
  console.log(JSON.stringify({
    scanned: report.totalPagesScanned,
    indexable: report.pagesIndexable,
    noindex: report.pagesNoindex,
    sitemapUrls: report.sitemapUrlCount,
    brokenLinks: report.brokenLinksFound.length,
    changedFiles: uniqueChanged.length,
    report: 'reports/seo-upgrade-report.json'
  }, null, 2));
}

main();
