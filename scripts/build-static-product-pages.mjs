import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.waikwantent.com';
const GTM_ID = 'GTM-TVQFLJP7';
const GTM_HEAD = `<!-- Google Consent Mode default -->
<script>
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){dataLayer.push(arguments);};
window.gtag('consent','default',{
  analytics_storage:'denied',
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});
</script>
<!-- End Google Consent Mode default -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;
const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

export const STATIC_PRODUCTS = [
  {
    sku: '9403', slug: 'semi-circle-race-gate-9403', model: 'RaceGate-SemiCircle',
    en: { name: 'Semi-circle Race Gate', title: 'Semi-circle Race Gate 9403 | Fiberglass Event Arch | WaiKwan', description: 'Portable semi-circle fiberglass race gate for races, sports events and brand activations. Compare four sizes, pole diameters and export carton quantities.', intro: 'SKU 9403 is a portable semi-circle race gate built with fiberglass poles. Four catalog sizes cover small course markers through large start and finish arches.', applications: ['Running and cycling events', 'FPV and drone courses', 'Brand activations and finish lines'], note: 'Choose the model from the table and include quantity, destination and artwork status in your quote request.' },
    zh: { name: '半圆型竞速拱门', title: '半圆型竞速拱门 9403｜玻璃钢赛事活动拱门｜伟群帐篷', description: '便携式半圆型玻璃钢竞速拱门，适合赛事、运动活动与品牌推广。对比四种尺寸、杆径及出口装箱数量。', intro: 'SKU 9403 为玻璃钢杆结构的便携式半圆型竞速拱门，目录提供四种尺寸，可用于小型赛道标识及大型起终点拱门。', applications: ['跑步及自行车赛事', 'FPV 与无人机赛道', '品牌推广及起终点展示'], note: '询价时请注明型号、数量、目的地及画面文件准备情况。' },
    image: '/images/products/racegate/Semi-circle%20Race%20Gate/semi-circle-race-gate-event-arch-hero.png',
    specs: [
      ['AD-R40A', 'Fiberglass', 'L 2.5 × H 1.4 m', '8 mm', '2.5 mm', '118 × 25 × 15 cm', '10 pcs/carton'],
      ['AD-R40B', 'Fiberglass', 'L 3.1 × H 1.9 m', '10 mm', '2.5 mm', '118 × 25 × 22 cm', '10 pcs/carton'],
      ['AD-R40C', 'Fiberglass', 'L 3.6 × H 2.4 m', '12 mm', '2.5 mm', '118 × 25 × 22 cm', '10 pcs/carton'],
      ['AD-R40D', 'Fiberglass', 'L 5.5 × H 3.0 m', '12 mm', '2.5 mm', '118 × 30 × 25 cm', '5 pcs/carton'],
    ],
    headersEn: ['Model', 'Material', 'Size', 'Diameter', 'Thickness', 'Carton', 'Quantity'],
    headersZh: ['型号', '材质', '尺寸', '杆径', '厚度', '箱规', '装箱数量'],
  },
  {
    sku: '31007', slug: 'folding-chair-31007', model: 'WK-Y45',
    en: { name: 'Folding Chair WK-Y45', title: 'Folding Chair WK-Y45 | Portable Event Seating | WaiKwan', description: 'Lightweight folding chair model WK-Y45 for events, exhibitions and temporary seating. Ask WaiKwan for current material, packing and order details.', intro: 'WK-Y45 is a lightweight folding chair intended for events, exhibitions and temporary seating. It folds for storage and quick venue setup.', applications: ['Exhibitions and booths', 'Temporary event seating', 'Outdoor and rental programs'], note: 'The current catalog record confirms the model and use case. Request the latest material, load, color, carton and MOQ details before ordering.' },
    zh: { name: '折叠椅 WK-Y45', title: '折叠椅 WK-Y45｜便携活动座椅｜伟群帐篷', description: 'WK-Y45 轻便折叠椅，适用于活动、展会与临时座位。可向伟群获取最新材质、装箱及起订信息。', intro: 'WK-Y45 是面向活动、展会及临时座位场景的轻便折叠椅，可折叠收纳并快速布置。', applications: ['展会及展位', '临时活动座位', '户外及租赁项目'], note: '现有目录记录确认了型号与用途；下单前请索取最新材质、承重、颜色、箱规及 MOQ 信息。' },
    image: '/images/products/furniture/chair%20table/folding-table-and-chair-set-event-furniture-hero.jpg',
    imageNoteEn: 'Furniture range reference image; request a WK-Y45 model photo with your quote.',
    imageNoteZh: '家具系列参考图；询价时可索取 WK-Y45 型号实物图。',
    facts: [['Model', 'WK-Y45'], ['Storage', 'Foldable'], ['Use', 'Events, exhibitions and temporary seating']],
    factsZh: [['型号', 'WK-Y45'], ['收纳方式', '折叠'], ['用途', '活动、展会及临时座位']],
  },
  {
    sku: '9004', slug: 'round-water-weight-bucket-9004', model: 'WK-T02A',
    en: { name: 'Round Water Weight Bucket WK-T02A', title: 'Round Canopy Water Weight Bucket WK-T02A | WaiKwan', description: 'Round water weight bucket for pop-up canopy anchoring. Model WK-T02A weighs 1.1 kg empty and packs four pieces per carton.', intro: 'WK-T02A is a round fillable water weight bucket used to add ballast at pop-up canopy legs where ground stakes are unsuitable.', applications: ['Paved event sites', 'Trade fairs and promotions', 'Temporary canopy ballast'], note: 'Confirm the required ballast plan against tent size, weather and venue rules. This accessory does not replace a site-specific safety assessment.' },
    zh: { name: '圆型帐篷压重水桶 WK-T02A', title: '圆型帐篷压重水桶 WK-T02A｜快开帐篷配件｜伟群帐篷', description: '用于快开帐篷固定的圆型注水压重桶。WK-T02A 空桶重量 1.1 kg，每箱 4 个。', intro: 'WK-T02A 是圆型可注水压重桶，适用于不便打地钉的场地，为快开帐篷腿增加压重。', applications: ['硬化地面活动', '展会及推广活动', '临时帐篷压重'], note: '压重方案须结合帐篷尺寸、天气及场地规定确认。本配件不能替代现场安全评估。' },
    image: '/images/products/accessories/canopy-tent-accessories-and-replacement-parts.png',
    imageNoteEn: 'Accessory catalog sheet; WK-T02A is item 4 in the first row.',
    imageNoteZh: '配件目录图；WK-T02A 位于第一行第 4 个。',
    facts: [['Model', 'WK-T02A'], ['Empty weight', '1.1 kg'], ['Size', '24 × 25 cm'], ['Carton', '52 × 25 × 48 cm'], ['Quantity', '4 pcs/carton'], ['Gross weight', '4.5 kg']],
    factsZh: [['型号', 'WK-T02A'], ['空桶重量', '1.1 kg'], ['尺寸', '24 × 25 cm'], ['箱规', '52 × 25 × 48 cm'], ['装箱数量', '4 个/箱'], ['毛重', '4.5 kg']],
  },
  {
    sku: '9014', slug: 'half-wall-blade-flag-connector-9014', model: 'AD-t08',
    en: { name: 'Half-wall Blade-flag Connector AD-t08', title: 'Half-wall Blade-flag Connector AD-t08 | Canopy Accessory | WaiKwan', description: 'PC connector for mounting a half wall and blade flag on 40 or 50 hex canopy frames. Model AD-t08, SKU 9014.', intro: 'AD-t08 is a PC connector for half-wall and blade-flag configurations on compatible 40 or 50 hexagonal canopy frame profiles.', applications: ['Branded canopy side walls', 'Tent-mounted blade flags', 'Event and promotion tents'], note: 'Confirm the frame profile and tube dimensions before ordering; “40/50 hex” identifies the compatible frame family.' },
    zh: { name: '半围刀旗连接件 AD-t08', title: '半围刀旗连接件 AD-t08｜广告帐篷配件｜伟群帐篷', description: '适配 40 或 50 六角帐篷架的 PC 半围刀旗连接件。型号 AD-t08，SKU 9014。', intro: 'AD-t08 为 PC 材质连接件，用于兼容的 40 或 50 六角帐篷架半围与刀旗组合。', applications: ['品牌帐篷半围', '帐篷安装刀旗', '活动及推广帐篷'], note: '订购前请确认帐篷架型材及管径；“40/50 六角”表示适配的框架系列。' },
    image: '/images/products/accessories/canopy-tent-accessories-and-replacement-parts.png',
    imageNoteEn: 'Accessory catalog sheet; AD-t08 is item 2 in the fourth row.',
    imageNoteZh: '配件目录图；AD-t08 位于第四行第 2 个。',
    facts: [['Model', 'AD-t08'], ['Material / color', 'PC'], ['Net weight', '0.21 kg'], ['Compatibility', '40 / 50 hex frame'], ['Carton', '45 × 40 × 30 cm'], ['Quantity', '100 pcs/carton'], ['Gross weight', '22 kg']],
    factsZh: [['型号', 'AD-t08'], ['材质 / 颜色', 'PC'], ['净重', '0.21 kg'], ['适配框架', '40 / 50 六角架'], ['箱规', '45 × 40 × 30 cm'], ['装箱数量', '100 个/箱'], ['毛重', '22 kg']],
  },
  {
    sku: 'WK-IS004', slug: 'floor-standing-seg-light-box-wk-is004', model: 'WK-IS004',
    en: { name: 'Floor-standing SEG Light Box WK-IS004', title: 'Floor-standing SEG Light Box WK-IS004 | WaiKwan', description: 'Floor-standing SEG light box display with a 100 × 200 cm graphic, quick-change fabric and optional LED backlighting for retail and showrooms.', intro: 'WK-IS004 is a floor-standing SEG light box for a large 100 × 200 cm fabric graphic. The graphic is replaceable and LED backlighting is optional.', applications: ['Retail flagship stores', 'Showrooms and exhibitions', 'Indoor brand advertising'], note: 'Specify whether lighting is required, the print artwork, quantity, destination and installation needs when requesting a quote.' },
    zh: { name: '落地式 SEG 卡布灯箱 WK-IS004', title: '落地式 SEG 卡布灯箱 WK-IS004｜伟群帐篷', description: '落地式 SEG 卡布灯箱，画面 100 × 200 cm，支持快速换画及选配 LED 背光，适合门店和展厅。', intro: 'WK-IS004 是面向 100 × 200 cm 大画面的落地式 SEG 卡布灯箱，画面可更换，并可选配 LED 背光。', applications: ['旗舰门店', '展厅及展会', '室内品牌广告'], note: '询价时请注明是否需要背光、画面文件、数量、目的地及安装要求。' },
    image: '/images/products/displays/tension-fabric-displays/wk-is004hero.jpg',
    facts: [['Model', 'WK-IS004'], ['Graphic size', '100 × 200 cm'], ['Graphic', 'Fabric / SEG graphic'], ['Backlight', 'Optional LED'], ['Base', 'Floor-standing, for large-format long-term display']],
    factsZh: [['型号', 'WK-IS004'], ['画面尺寸', '100 × 200 cm'], ['画面', '布画 / SEG 卡布画面'], ['背光', '可选 LED'], ['底座', '落地底座，适合大画面长期陈列']],
  },
];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function schema(product, lang, url, otherUrl) {
  const text = product[lang];
  const home = lang === 'zh' ? `${ORIGIN}/zh/` : `${ORIGIN}/`;
  const products = lang === 'zh' ? `${ORIGIN}/zh/all-products.html` : `${ORIGIN}/all-products.html`;
  return JSON.stringify({
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: text.title, description: text.description, inLanguage: lang === 'zh' ? 'zh-CN' : 'en', isPartOf: { '@id': `${ORIGIN}/#website` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'zh' ? '首页' : 'Home', item: home },
        { '@type': 'ListItem', position: 2, name: lang === 'zh' ? '产品目录' : 'Products', item: products },
        { '@type': 'ListItem', position: 3, name: text.name, item: url },
      ] },
      { '@type': 'Product', '@id': `${url}#product`, name: text.name, sku: product.sku, model: product.model, url, description: text.description, image: `${ORIGIN}${product.image}`, brand: { '@type': 'Brand', name: 'WaiKwan' }, manufacturer: { '@type': 'Organization', name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd', url: ORIGIN } },
    ],
  }).replace(/</g, '\\u003c');
}

function page(product, lang) {
  const zh = lang === 'zh';
  const text = product[lang];
  const pathPrefix = zh ? '/zh' : '';
  const url = `${ORIGIN}${pathPrefix}/products/${product.slug}.html`;
  const otherUrl = `${ORIGIN}${zh ? '' : '/zh'}/products/${product.slug}.html`;
  const homeHref = zh ? '/zh/' : '/';
  const productsHref = zh ? '/zh/all-products.html' : '/all-products.html';
  const quoteLabel = text.name.includes(product.sku) ? text.name : `${text.name} SKU ${product.sku}`;
  const contactHref = `${zh ? '/zh' : ''}/contact-us.html?product=${encodeURIComponent(quoteLabel)}#getQuoteForm`;
  const rows = product.specs
    ? `<div class="table-wrap"><table><thead><tr>${(zh ? product.headersZh : product.headersEn).map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${product.specs.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    : `<dl class="facts">${(zh ? product.factsZh : product.facts).map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
  const imageNote = zh ? product.imageNoteZh : product.imageNoteEn;
  return `<!doctype html>
<html lang="${zh ? 'zh-CN' : 'en'}">
<head>
${GTM_HEAD}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(text.title)}</title>
  <meta name="description" content="${esc(text.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${zh ? otherUrl : url}">
  <link rel="alternate" hreflang="zh-CN" href="${zh ? url : otherUrl}">
  <link rel="alternate" hreflang="x-default" href="${zh ? otherUrl : url}">
  <meta property="og:type" content="product"><meta property="og:site_name" content="WaiKwan"><meta property="og:title" content="${esc(text.title)}"><meta property="og:description" content="${esc(text.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${ORIGIN}${product.image}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(text.title)}"><meta name="twitter:description" content="${esc(text.description)}"><meta name="twitter:image" content="${ORIGIN}${product.image}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles/main.css"><link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <style>.static-product{max-width:1180px;margin:0 auto;padding:120px 24px 64px}.crumbs{margin-bottom:28px;font-size:.95rem}.crumbs a{color:#7c1d1d}.product-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,1fr);gap:42px;align-items:center}.product-hero img{width:100%;max-height:520px;object-fit:contain;background:#f6f6f6;border-radius:12px}.eyebrow{color:#8f171b;font-weight:700;letter-spacing:.04em}.lead{font-size:1.12rem;line-height:1.75}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.content-section{margin-top:52px}.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#ddd}.facts div{background:#fff;padding:16px}.facts dt{font-weight:700}.facts dd{margin:6px 0 0}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{padding:12px;border:1px solid #ddd;text-align:left}th{background:#f3f3f3}.source-note{padding:18px;border-left:4px solid #a4161a;background:#fff6f3}.image-note{font-size:.9rem;color:#555}.lang-link{margin-left:auto}@media(max-width:780px){.product-hero{grid-template-columns:1fr}.facts{grid-template-columns:1fr}}</style>
  <script type="application/ld+json">${schema(product, lang, url, otherUrl)}</script>
  <script src="/scripts/analytics.js?v=20260930-ga4-consent" defer></script>
  <script src="/scripts/main.js" defer></script>
</head>
<body>
${GTM_BODY}
  <header class="navbar"><div class="nav-container"><a class="logo" href="${homeHref}"><img src="/favicon.svg" alt="WaiKwan" width="44" height="44"><span>WaiKwan</span></a><nav class="nav-menu"><a href="${productsHref}">${zh ? '产品目录' : 'Products'}</a><a href="${zh ? '/zh/about-us.html' : '/about-us.html'}">${zh ? '关于我们' : 'About'}</a><a href="${zh ? '/zh/contact-us.html' : '/contact-us.html'}">${zh ? '联系我们' : 'Contact'}</a></nav><a class="lang-link" href="${zh ? otherUrl : otherUrl}" hreflang="${zh ? 'en' : 'zh-CN'}">${zh ? 'English' : '中文'}</a></div></header>
  <main class="static-product">
    <nav class="crumbs" aria-label="${zh ? '面包屑' : 'Breadcrumb'}"><a href="${homeHref}">${zh ? '首页' : 'Home'}</a> / <a href="${productsHref}">${zh ? '产品目录' : 'Products'}</a> / <span>${esc(text.name)}</span></nav>
    <article>
      <div class="product-hero"><div><img src="${product.image}" alt="${esc(text.name)}" width="800" height="800" fetchpriority="high">${imageNote ? `<p class="image-note">${esc(imageNote)}</p>` : ''}</div><div><p class="eyebrow">SKU ${esc(product.sku)} · ${esc(product.model)}</p><h1>${esc(text.name)}</h1><p class="lead">${esc(text.intro)}</p><div class="actions"><a class="btn btn-primary" href="${contactHref}">${zh ? '获取报价' : 'Request a Quote'}</a><a class="btn btn-secondary" href="${productsHref}">${zh ? '查看全部产品' : 'View All Products'}</a></div></div></div>
      <section class="content-section"><h2>${zh ? '已确认规格' : 'Confirmed specifications'}</h2>${rows}</section>
      <section class="content-section"><h2>${zh ? '常见应用' : 'Common applications'}</h2><ul>${text.applications.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="content-section source-note"><h2>${zh ? '询价前说明' : 'Before requesting a quote'}</h2><p>${esc(text.note)}</p><p>${zh ? '本页参数来自伟群当前产品目录记录；未列出的参数请以书面报价确认为准。' : 'Specifications on this page come from WaiKwan’s current product catalog record. Confirm unlisted details in the written quotation.'}</p></section>
    </article>
  </main>
</body>
</html>\n`;
}

const check = process.argv.includes('--check');
let failed = false;
for (const product of STATIC_PRODUCTS) {
  for (const lang of ['en', 'zh']) {
    const rel = `${lang === 'zh' ? 'zh/' : ''}products/${product.slug}.html`;
    const dest = path.join(ROOT, rel);
    const output = page(product, lang);
    if (check) {
      // Windows checkouts may use CRLF; compare generated content independently of line endings.
      if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8').replace(/\r\n/g, '\n') !== output.replace(/\r\n/g, '\n')) {
        console.error(`Out of date: ${rel}`);
        failed = true;
      }
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, output, 'utf8');
      console.log(`Wrote ${rel}`);
    }
  }
}
if (failed) process.exit(1);
if (check) console.log(`OK: ${STATIC_PRODUCTS.length * 2} static product pages are current.`);
