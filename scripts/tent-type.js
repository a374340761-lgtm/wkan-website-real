// Tent Type detail page renderer
(function () {
  'use strict';

  function getCurrentLang() {
    try {
      if (typeof window.wkResolvePageLanguage === 'function') {
        return window.wkResolvePageLanguage();
      }
    } catch (e) {}
    try {
      const p = window.location.pathname.replace(/\\/g, '/');
      if (p === '/zh' || p.startsWith('/zh/')) return 'zh';
    } catch (e2) {}
    if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
      return window.multiLang.getCurrentLanguage();
    }
    return 'en';
  }

  function getQueryType() {
    try {
      return new URL(window.location.href).searchParams.get('type') || '';
    } catch (e) {
      return '';
    }
  }

  function ttPageHref(href) {
    if (!href) return href;
    if (typeof window.wkLocalizedInternalLink === 'function') {
      const s = href.startsWith('/') ? href : '/' + String(href).replace(/^\.\//, '');
      return window.wkLocalizedInternalLink(s);
    }
    if (typeof window.wkLocalizedPageHref === 'function') {
      const s = href.startsWith('/') ? href : '/' + String(href).replace(/^\.\//, '');
      return window.wkLocalizedPageHref(s);
    }
    return href;
  }

  function ttT(key) {
    if (window.multiLang && typeof window.multiLang.t === 'function') {
      return window.multiLang.t(key) || key;
    }
    return key;
  }

  function getQueryVariant() {
    try {
      return new URL(window.location.href).searchParams.get('variant') || '';
    } catch (e) {
      return '';
    }
  }

  function safe(s) {
    return (s || '').toString();
  }

  function wkAssetUrl(u) {
    if (u == null || u === '') return '';
    const s = String(u).trim();
    if (/^(https?:|data:|\/\/)/i.test(s)) return s;
    if (typeof window.wkRootAssetUrl === 'function') {
      try {
        return window.wkRootAssetUrl(s);
      } catch (e) {
        /* ignore */
      }
    }
    const x = s.replace(/^\.\//, '');
    return x.startsWith('/') ? x : '/' + x;
  }

  const STOCK_TENT_ID_BY_TYPE = {
    folding30: 2001,
    folding40: 2002,
    folding50: 2003
  };

  const FOLDING_STOCK_TYPES = new Set(['folding30', 'folding40', 'folding50']);
  const BASE_ORIGIN = 'https://www.waikwantent.com';

  /** Per-series B2B copy, head meta, and image alt. EN-focused; visible page uses this when ?type=folding*. */
  const FOLDING_SERIES_SEO = {
    folding30: {
      h1: '30 Series Pop Up Canopy Tent',
      title: '30 Series Pop Up Canopy Tent | Standard Folding Tent Supplier | WaiKwan',
      description:
        'Explore WaiKwan 30 series pop up canopy tents in multiple sizes with custom printing, OEM support, low MOQ, and factory-direct supply for promotions and outdoor use.',
      intro:
        'The 30 series is our economical pop up canopy line built around 30\u202fmm square-tube frames in iron or aluminum. It is used daily by distributors and agencies that need dependable branding at outdoor promotions, market stalls, and regional trade shows. Standard footprints scale from compact 1.5\u00d71.5\u202fm up to 3\u00d76\u202fm, with heat-transfer graphics on the canopy, half walls, and full walls. Production is factory-direct—no third-party markup—with MOQ from one unit, typical lead time 7\u201315 days, and carton packing for export. A 3\u00d73\u202fm size aligns with the common 10\u00d710\u202fft buying brief across many markets; compare 40/50 series if you need a stiffer hexagon frame for heavier use.',
      heroAlt: 'WaiKwan 30 series pop up canopy tent, square-tube frame, outdoor event display',
      productName: 'WaiKwan 30 series pop up canopy tent (WK-T30 family)'
    },
    folding40: {
      h1: '40 Series Hexagon Frame Canopy Tent',
      title: '40 Series Hexagon Frame Canopy Tent | Custom Event Tent | WaiKwan',
      description:
        'Discover WaiKwan 40 series canopy tents with stronger hexagon frame options, custom printing, multiple sizes, and OEM supply for event, retail, and outdoor branding projects.',
      intro:
        'The 40 series uses 40\u202fmm hexagon-profile tubes in aluminum or iron depending on the SKU. It is the mid-range choice when buyers want a stronger folding frame for repeat build cycles—weekend activations, sports events, and extended outdoor retail. Sizes run from 1.5\u00d71.5\u202fm through 4\u00d78\u202fm, and each configuration supports branded tops and walls using heat transfer. WaiKwan runs printing and frame assembly under one roof for consistent colour and repeat orders, with low MOQ, 7\u201315 day production, and FOB-style export support. 10\u00d710 / 3\u00d73\u202fm is available; larger spans suit buyers stepping up from the 30 line without going full heavy-duty.',
      heroAlt: 'WaiKwan 40 series hexagon aluminum frame canopy tent, 3x3m trade show use',
      productName: 'WaiKwan 40 series hexagon frame folding canopy tent (WK-T40 family)'
    },
    folding50: {
      h1: '50 Series Heavy Duty Aluminum Canopy Tent',
      title: '50 Series Heavy Duty Aluminum Canopy Tent | OEM Tent Factory | WaiKwan',
      description:
        'Browse WaiKwan 50 series heavy duty aluminum canopy tents with larger size options, custom graphics, OEM service, and factory-direct export support.',
      intro:
        'The 50 series is our heavy-duty aluminum folding line using 50\u202fmm hexagon tubes, aimed at importers and rental firms that need maximum stiffness in a portable product. It covers 2\u00d72\u202fm through 4\u00d78\u202fm footprints, ideal for large festival booths, premium roadshows, and long-duration outdoor cover. Branded canopies, half walls, and full walls are produced with the same heat-transfer workflow as 30/40, coordinated with the factory for frame tolerances. MOQ from one unit, 7\u201315 day lead times, and export carton packing are standard. For 10\u00d710-style coverage, 3\u00d73\u202fm is offered alongside deeper spans for buyers comparing the stiffest option in the folding range.',
      heroAlt: 'WaiKwan 50 series heavy duty aluminum hexagon frame canopy tent',
      productName: 'WaiKwan 50 series heavy duty aluminum folding canopy tent (WK-T50 family)'
    }
  };

  function getHeroAltForItem(item) {
    if (item && FOLDING_SERIES_SEO[item.type]) {
      return FOLDING_SERIES_SEO[item.type].heroAlt;
    }
    const lang = getCurrentLang();
    if (!item) return lang === 'zh' ? '帐篷' : 'Canopy tent';
    return lang === 'zh' ? safe(item.nameZh || '帐篷') : safe(item.nameEn || 'Canopy tent');
  }

  function upsertScriptJsonLd(id, data) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  function removeJsonLdByPrefix(prefix) {
    document.querySelectorAll(`[id^="${prefix}"]`).forEach((n) => n.remove());
  }

  function setFoldingHeadMeta(s) {
    if (!s) return;
    document.title = s.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', s.description);
    const ogT = document.querySelector('meta[property="og:title"]');
    if (ogT) ogT.setAttribute('content', s.title);
    const ogD = document.querySelector('meta[property="og:description"]');
    if (ogD) ogD.setAttribute('content', s.description);
    const twT = document.querySelector('meta[name="twitter:title"]');
    if (twT) twT.setAttribute('content', s.title);
    const twD = document.querySelector('meta[name="twitter:description"]');
    if (twD) twD.setAttribute('content', s.description);
  }

  function resetTentTypeHubHeadMeta() {
    const title = 'Tent Types & Specifications | Folding Canopy Tent Series Guide | WaiKwan';
    const desc =
      'Compare WaiKwan folding canopy tent types, frame options, common sizes, and printing choices. Explore 30, 40, and 50 series tent solutions for wholesale and OEM projects.';
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', desc);
    const ogT = document.querySelector('meta[property="og:title"]');
    if (ogT) ogT.setAttribute('content', 'Tent Types & Specifications | Folding Canopy Series | WaiKwan');
    const ogD = document.querySelector('meta[property="og:description"]');
    if (ogD) ogD.setAttribute('content', 'Folding canopy tent series (30/40/50), sizes, and printing. Factory-direct B2B supply.');
  }

  function injectBreadcrumbJsonLdForTentType(item) {
    try {
      const u = new URL(window.location.href);
      u.hash = '';
      const firstA = document.querySelector('main nav.breadcrumb a[href]');
      const homeUrl = (firstA && firstA.href) || `${u.origin}/index.html`;
      const hubUrl = `${u.origin}${(u.pathname || '/tent-type.html').split('?')[0]}`;
      const list = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
        { '@type': 'ListItem', position: 2, name: 'Tent types', item: hubUrl }
      ];
      if (item) {
        const t = String(item.type || '');
        const pageUrl = u.toString();
        let n = '';
        if (FOLDING_SERIES_SEO[t]) n = FOLDING_SERIES_SEO[t].h1;
        else n = getCurrentLang() === 'zh' ? safe(item.nameZh) : safe(item.nameEn);
        if (n) list.push({ '@type': 'ListItem', position: 3, name: n, item: pageUrl });
      }
      upsertScriptJsonLd('wk-jsonld-breadcrumb', { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: list });
    } catch (e) { /* ignore */ }
  }

  function injectProductJsonLdForFolding(s, type) {
    let purl = `${BASE_ORIGIN}/tent-type.html?type=${encodeURIComponent(type)}`;
    try {
      purl = new URL(window.location.href).toString();
    } catch (e) { /* keep default */ }
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: s.productName,
      description: s.description,
      url: purl,
      brand: { '@type': 'Brand', name: 'WaiKwan' },
      category: 'Folding pop up canopy tent',
      manufacturer: { '@type': 'Organization', name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd' }
    };
    upsertScriptJsonLd('wk-jsonld-product-series', ld);
  }

  function setTentTypeHubVisibilityForDetail(detailOn) {
    const lead = document.getElementById('tentTypeStaticLead');
    if (lead) lead.hidden = !!detailOn;
  }

  function renderFoldingSeriesTop(item) {
    const s = FOLDING_SERIES_SEO[item.type];
    if (!s) return '';
    const intro = s.intro;
    return `
      <div class="tent-type-folding-landing" style="max-width: 52rem; margin-bottom: 1rem;">
        <h1 class="tent-type-series-h1" style="font-size: 1.35rem; font-weight: 800; line-height: 1.3; margin: 0 0 0.6rem;">${safe(s.h1)}</h1>
        <p class="tent-type-series-intro" style="margin: 0; line-height: 1.65; color: rgba(31,45,61,.9);">${safe(intro)}</p>
      </div>`;
  }

  function renderFoldingProcurementBlock(item) {
    if (!item || !FOLDING_STOCK_TYPES.has(item.type)) return '';
    const dimRows = [
      { size: '1.5 × 1.5M', w: '150', sw: '215', v: '35', roof: '65', top: '315' },
      { size: '2 × 2M', w: '200', sw: '215', v: '35', roof: '65', top: '315' },
      { size: '2.5 × 2.5M', w: '250', sw: '215', v: '35', roof: '65', top: '315' },
      { size: '3 × 3M', w: '300', sw: '215', v: '35', roof: '90', top: '340' },
      { size: '3 × 4.5M', w: '450', sw: '215', v: '35', roof: '90', top: '340' },
      { size: '3 × 6M', w: '600', sw: '215', v: '35', roof: '90', top: '340' },
      { size: '4 × 4M', w: '400', sw: '215', v: '35', roof: '135', top: '385' },
      { size: '4 × 6M', w: '600', sw: '215', v: '35', roof: '135', top: '385' },
      { size: '4 × 8M', w: '800', sw: '215', v: '35', roof: '135', top: '385' }
    ];
    const tr = dimRows
      .map(
        (r) =>
          `<tr><td>${r.size}</td><td>Width ${r.w} cm</td><td>Side wall H ${r.sw} cm</td><td>Valance ${r.v} cm</td><td>Roof slope ${r.roof} cm</td><td>Top W ${r.top} cm</td></tr>`
      )
      .join('');
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">Tent sizes &amp; key dimensions (reference)</div>
        <p class="tent-type-detail__text" style="margin-bottom: 10px;">Factory measurements below are a planning reference. Confirm with your project sheet before final artwork.</p>
        <div class="tent-type-detail__tableWrap" style="overflow-x: auto;">
          <table class="tent-type-detail__table">
            <thead><tr><th>Footprint</th><th>Width</th><th>Side wall height</th><th>Valance</th><th>Roof slope</th><th>Top width</th></tr></thead>
            <tbody>${tr}</tbody>
          </table>
        </div>
        <h3 class="tent-type-detail__blockTitle" style="font-size: 1rem; margin-top: 12px;">MOQ, lead time &amp; export</h3>
        <ul class="tent-type-detail__list"><li>MOQ: 1 unit for standard builds</li><li>Typical lead time: 7–15 days (production-based)</li><li>Packing: export cartons</li><li>OEM graphics coordination in-house; FOB support available</li><li>Factory-direct pricing; suitable for trial orders and volume programs</li></ul>
        <h3 class="tent-type-detail__blockTitle" style="font-size: 1rem; margin-top: 8px;">Typical applications</h3>
        <p class="tent-type-detail__text">Outdoor promotions, trade shows, market stalls, brand activations, sports events, retail events, and temporary outdoor shelter. ${item.type === 'folding30' ? '30 series' : item.type === 'folding40' ? '40 series' : '50 series'} covers the ${item.type === 'folding30' ? '3×3 m (10×10) entry point' : '3×3 m 10×10 class sizing'} alongside larger spans where listed.</p>
      </div>
      <div class="tent-type-detail__block" style="margin-top: 12px; padding: 10px 12px; background: #f4f5f7; border-radius: 8px; font-size: 0.95rem;">
        <div style="font-weight: 800; margin-bottom: 6px;">Compare folding canopy tent types</div>
        <p style="margin: 0; line-height: 1.55;">Jump between series: <a href="tent-type.html?type=folding30">30 Series Pop Up Canopy Tent</a> · <a href="tent-type.html?type=folding40">40 Series Hexagon Frame Tent</a> · <a href="tent-type.html?type=folding50">50 Series Heavy Duty Aluminum Tent</a> · <a href="tent-type.html">Folding Canopy Tent Types (hub)</a></p>
      </div>
      <div class="tent-type-detail__block" style="margin-top: 12px;">
        <div class="tent-type-detail__blockTitle">FAQ</div>
        <p class="tent-type-detail__text"><strong>Do you support custom printing?</strong> Yes—heat transfer on canopy, half, and full walls, coordinated with the frame build.</p>
        <p class="tent-type-detail__text" style="margin-top:8px"><strong>Is 10×10 the same as 3×3 m?</strong> In most procurement conversations they align closely; we quote in metric; confirm the exact frame SKU you need for US retail.</p>
        <p class="tent-type-detail__text" style="margin-top:8px"><strong>Factory vs trader?</strong> WaiKwan is the manufacturer, supporting repeat B2B orders and export packing.</p>
      </div>`;
  }

  function renderFoldingBottomLinks() {
    return `
      <div class="tent-type-detail__block" style="border-top: 1px solid rgba(31,45,61,.1); margin-top: 1rem; padding-top: 1rem;">
        <div class="tent-type-detail__blockTitle" style="font-size: 0.9rem; font-weight: 700; color: rgba(31,45,61,.65);">Related procurement links</div>
        <p style="margin: 0.4rem 0 0; font-size: 0.95rem; line-height: 1.6;">
          <a href="custom-canopy-tent-manufacturer.html">Custom Canopy Tent Manufacturer</a> ·
          <a href="all-products.html?cat=tents">Browse All Tents</a> ·
          <a href="product-center.html?cat=tents">Product Center – Tents</a> ·
          <a href="beach-flag-supplier.html">Beach flag supplier</a> ·
          <a href="portable-display-systems.html">Portable display systems</a>
        </p>
      </div>`;
  }

  function normalizeAssetKey(u) {
    if (u == null || u === '') return '';
    try {
      return decodeURIComponent(String(u).trim()).replace(/\\/g, '/').toLowerCase();
    } catch (e) {
      return String(u).trim().replace(/\\/g, '/').toLowerCase();
    }
  }

  function galleryPathsFromProduct(product) {
    if (!product) return [];
    let list = [];
    if (Array.isArray(product.gallery) && product.gallery.length) {
      list = product.gallery.filter(Boolean);
    } else if (Array.isArray(product.images) && product.images.length) {
      list = product.images.filter(Boolean);
    } else if (product.image) {
      list = [product.image];
    }
    const seen = new Set();
    const out = [];
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const k = normalizeAssetKey(p);
      if (!k || seen.has(k)) continue;
      seen.add(k);
      out.push(p);
    }
    return out;
  }

  /** Same ordered gallery as stock tent PDP (products.js id 2001–2003). Null if not a folding stock type page. */
  function resolveFoldingStockGalleryPaths(item) {
    if (!item || !STOCK_TENT_ID_BY_TYPE[item.type]) return null;
    const stockId = STOCK_TENT_ID_BY_TYPE[item.type];
    const pm = window.productManager;
    if (!pm || !Array.isArray(pm.products)) {
      return item.heroImage ? [item.heroImage] : [];
    }
    const product = pm.products.find((p) => String(p.id) === String(stockId));
    const paths = galleryPathsFromProduct(product);
    if (paths.length) return paths;
    return item.heroImage ? [item.heroImage] : [];
  }

  function renderDefaultHeroHtml(item) {
    const alt = getHeroAltForItem(item);
    return `
      <div style="margin-bottom: var(--spacing-md);">
        <div class="tent-type-card__imgWrap" style="border-radius: var(--radius-lg); overflow:hidden; border: 1px solid var(--wk-border-light);">
          <img class="tent-type-card__img" src="${wkAssetUrl(item.heroImage)}" alt="${safe(alt)}" loading="lazy" onerror="this.style.display='none'" />
        </div>
      </div>`;
  }

  function renderFoldingStockHeroHtml(item, paths) {
    const imgs = (paths || []).filter(Boolean);
    if (!imgs.length) return '';

    const mainSrc = wkAssetUrl(imgs[0]);
    const alt = getHeroAltForItem(item);
    const thumbs = imgs
      .map((raw, i) => {
        const full = wkAssetUrl(raw);
        const active = i === 0 ? ' is-active' : '';
        return `<button type="button" class="tent-type-folding-gallery__thumb${active}" data-wk-folding-gallery-thumb="1" aria-pressed="${i === 0 ? 'true' : 'false'}"><img src="${full}" alt="${i === 0 ? safe(alt) : 'Gallery thumbnail'}" loading="${i === 0 ? 'eager' : 'lazy'}" /></button>`;
      })
      .join('');

    return `
      <div class="tent-type-folding-gallery" style="margin-bottom: var(--spacing-md);">
        <div class="tent-type-card__imgWrap tent-type-folding-gallery__heroWrap" style="border-radius: var(--radius-lg); overflow:hidden; border: 1px solid var(--wk-border-light);">
          <img class="tent-type-card__img tent-type-folding-gallery__main" src="${mainSrc}" alt="${safe(alt)}" loading="eager" onerror="this.style.display='none'" />
        </div>
        <div class="tent-type-folding-gallery__thumbs">${thumbs}</div>
      </div>`;
  }

  function renderTopHero(item) {
    const paths = resolveFoldingStockGalleryPaths(item);
    if (paths === null) return renderDefaultHeroHtml(item);
    const html = renderFoldingStockHeroHtml(item, paths);
    return html || renderDefaultHeroHtml(item);
  }

  function bindFoldingStockGallery(root) {
    const wrap = root.querySelector('.tent-type-folding-gallery');
    if (!wrap) return;
    const main = wrap.querySelector('.tent-type-folding-gallery__main');
    const thumbs = wrap.querySelectorAll('[data-wk-folding-gallery-thumb]');
    if (!main || !thumbs.length) return;

    thumbs.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const im = btn.querySelector('img');
        if (!im || !im.src) return;
        main.src = im.src;
        thumbs.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      });
    });
  }

  function rawRowField(row, keys) {
    if (!row) return '';
    const ks = Array.isArray(keys) ? keys : [keys];
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i];
      if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim();
    }
    return '';
  }

  function tentTypeRfqButtonHtml(item, row, selectedVariantKey) {
    if (!item || !row) {
      return '<td class="variant-rfq-cell"></td>';
    }
    const model = rawRowField(row, ['model', 'Model']);
    const size = rawRowField(row, ['size', 'Size', 'dimension', 'Dimension']);
    const weight = rawRowField(row, ['weight', 'Weight']);
    const stockId = STOCK_TENT_ID_BY_TYPE[item.type];
    const vkey = [String(item.type || ''), String(selectedVariantKey || ''), model, size, weight].join('\u241e');
    const payload = {
      vkey,
      model,
      size,
      weight,
      stockId: stockId || null,
      findModel: stockId ? null : (model || null)
    };
    const enc = encodeURIComponent(JSON.stringify(payload));
    return `<td class="variant-rfq-cell"><button type="button" class="variant-rfq-btn" data-wk-tent-rfq="1" data-wk-payload="${enc}"><i class="fas fa-cart-plus" aria-hidden="true"></i></button></td>`;
  }

  function bindTentTypeRfq(root) {
    const btns = root.querySelectorAll('button[data-wk-tent-rfq]');
    if (!btns.length) return;

    const tryPm = (cb) => {
      if (window.productManager && Array.isArray(window.productManager.products)) {
        cb(window.productManager);
        return;
      }
      let n = 0;
      const id = setInterval(() => {
        n += 1;
        if (window.productManager && Array.isArray(window.productManager.products)) {
          clearInterval(id);
          cb(window.productManager);
        } else if (n > 120) {
          clearInterval(id);
          console.warn('[TENT-TYPE RFQ] ProductManager timeout after 6s');
        }
      }, 50);
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        let payload = null;
        try {
          payload = JSON.parse(decodeURIComponent(btn.getAttribute('data-wk-payload') || '{}'));
        } catch (err) {
          console.warn('[TENT-TYPE RFQ] Failed to parse button payload', err);
          return;
        }
        tryPm((pm) => {
          let product = null;
          if (payload.stockId != null) {
            product = pm.products.find((p) => String(p.id) === String(payload.stockId));
          }
          if (!product && payload.findModel) {
            product = pm.products.find((p) => String(p.model || '').trim() === String(payload.findModel).trim());
          }
          if (!product) {
            console.warn('[TENT-TYPE RFQ] Could not find matching product', {
              stockId: payload.stockId,
              findModel: payload.findModel,
              variantModel: payload.model,
              variantSize: payload.size,
              availableModels: pm.products.filter((p) => p.model).map((p) => String(p.model || '') + ' (id:' + p.id + ')').slice(0, 10)
            });
            return;
          }
          const vd = {
            variantKey: payload.vkey || '',
            variantModel: payload.model || '',
            variantSize: payload.size || '',
            variantWeight: payload.weight || ''
          };
          if (typeof window.addVariantToRfqCart === 'function') {
            window.addVariantToRfqCart(product, vd);
          } else {
            console.warn('[TENT-TYPE RFQ] addVariantToRfqCart function not available');
          }
        });
      });
      if (window.wkI18n && typeof window.wkI18n.t === 'function') {
        const al = window.wkI18n.t('add_to_rfq');
        if (al) btn.setAttribute('aria-label', al);
      }
    });
  }

  function renderRichText(text) {
    const lines = safe(text).split(/\n/);
    const parts = [];
    let paragraphLines = [];
    let listItems = [];

    const flushParagraph = () => {
      if (!paragraphLines.length) return;
      parts.push(`<div class="tent-type-detail__text">${paragraphLines.map((l) => safe(l)).join('<br>')}</div>`);
      paragraphLines = [];
    };

    const flushList = () => {
      if (!listItems.length) return;
      parts.push(`<ul class="tent-type-detail__list">${listItems.map((li) => `<li>${safe(li)}</li>`).join('')}</ul>`);
      listItems = [];
    };

    lines.forEach((raw) => {
      const line = safe(raw).trim();
      if (!line) {
        flushParagraph();
        flushList();
        return;
      }

      if (/^•\s*/.test(line)) {
        flushParagraph();
        listItems.push(line.replace(/^•\s*/, ''));
        return;
      }

      flushList();
      paragraphLines.push(line);
    });

    flushParagraph();
    flushList();

    return parts.join('');
  }

  function findTentTypeData(type) {
    const data = window.TENT_TYPES;
    if (!data) return null;
    const all = []
      .concat(Array.isArray(data.folding) ? data.folding : [])
      .concat(Array.isArray(data.event) ? data.event : [])
      .concat(Array.isArray(data.inflatable) ? data.inflatable : [])
      .concat(Array.isArray(data.accessories) ? data.accessories : []);
    return all.find((x) => x && x.type === type) || null;
  }

  function renderExampleImages(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.exampleImages)) item.exampleImages.forEach((p) => p && imgs.push(p));
    if (!imgs.length) return '';

    const title = lang === 'zh'
      ? '画册示例 / Catalog Examples'
      : 'Catalog Examples';

    const subtitle = lang === 'zh'
      ? '画册页截图（P4），用于快速对照配件与 Grip 等型号（可点击放大）。'
      : 'Example catalog page for quick reference (click to open).';

    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        <div class="tent-type-detail__text">${subtitle}</div>
        <div class="tent-type-detail__visuals" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
          ${imgs
            .map((src) => {
              const s = wkAssetUrl(safe(src));
              return `<a href="${s}" target="_blank" rel="noopener"><img class="tent-type-detail__visual" src="${s}" alt="" loading="lazy" /></a>`;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  function renderBilingual(zh, en) {
    return `
      <div class="tent-type-detail__bi">
        <div class="tent-type-detail__biZh">${safe(zh)}</div>
        <div class="tent-type-detail__biEn">${safe(en)}</div>
      </div>
    `;
  }

  function getSelectedVariant(item, key) {
    if (!item || !Array.isArray(item.variants) || !item.variants.length) return null;
    const wanted = (key || item.defaultVariant || '').toString();
    return item.variants.find((v) => v && v.key === wanted) || item.variants[0] || null;
  }

  function renderVariantSelector(item, selectedKey) {
    const lang = getCurrentLang();
    if (!item || !Array.isArray(item.variants) || !item.variants.length) return '';

    const title = lang === 'zh' ? '选择型号' : 'Choose Model';
    const selected = getSelectedVariant(item, selectedKey);
    const activeKey = selected ? selected.key : '';

    const buttons = item.variants.map((v) => {
      const label = lang === 'zh'
        ? safe(v.labelZh || v.labelEn || v.key)
        : safe(v.labelEn || v.labelZh || v.key);
      const cls = v.key === activeKey ? 'btn btn-primary' : 'btn btn-secondary';
      return `<button type="button" class="${cls}" data-variant="${safe(v.key)}">${label}</button>`;
    }).join(' ');

    return `
      <div style="margin-top: var(--spacing-sm); display:flex; flex-direction: column; gap: 10px;">
        <div style="font-weight: 800; color: var(--wk-black);">${title}</div>
        <div style="display:flex; gap: 10px; flex-wrap: wrap;">${buttons}</div>
      </div>
    `;
  }

  function renderTableFromSpec(item, selectedVariantKey) {
    const lang = getCurrentLang();
    let table = item && item.specTable ? item.specTable : null;
    let materialNoteHtml = '';

    // Inflatable: one type with internal variants.
    if (!table && item && Array.isArray(item.variants) && item.variants.length) {
      const selected = getSelectedVariant(item, selectedVariantKey);
      const spec = selected && selected.spec ? selected.spec : {};
      table = {
        columns: [
          { key: 'model', labelZh: '型号', labelEn: 'Model' },
          { key: 'material', labelZh: '材质', labelEn: 'Material' },
          { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
          { key: 'carton', labelZh: '装箱尺寸', labelEn: 'Carton Size' },
          { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
        ],
        rows: [
          {
            model: safe(spec.model),
            material: safe(spec.material),
            size: safe(spec.size),
            carton: safe(spec.carton),
            weight: safe(spec.weight)
          }
        ]
      };
    }

    // Back-compat: folding types use {models, materialEn/materialZh, nameEn/nameZh}
    if (!table && item && Array.isArray(item.models) && item.models.length) {
      if (item.materialEn || item.materialZh) {
        const label = lang === 'zh' ? renderBilingual('材质', 'Material') : 'Material';
        const value = lang === 'zh'
          ? renderBilingual(safe(item.materialZh || ''), safe(item.materialEn || ''))
          : safe(item.materialEn || item.materialZh || '');
        materialNoteHtml = `<div class="tent-type-detail__meta">${label}: ${value}</div>`;
      }

      table = {
        columns: [
          { key: 'model', labelZh: '型号', labelEn: 'Model' },
          { key: 'name', labelZh: '名称', labelEn: 'Name' },
          { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
          { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
        ],
        rows: item.models.map((m) => ({
          model: m.model,
          name: lang === 'zh'
            ? `${safe(item.nameZh || '')} / ${safe(item.nameEn || '')}`
            : safe(item.nameEn || ''),
          size: m.size,
          weight: m.weight
        }))
      };
    }

    if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return '';

    const cols = table.columns;

    const headerHtml = cols.map((c) => {
      if (lang === 'zh' && c.labelZh && c.labelEn) return `<th>${renderBilingual(c.labelZh, c.labelEn)}</th>`;
      return `<th>${safe(c.labelEn || c.labelZh || '')}</th>`;
    }).join('') + '<th class="variant-rfq-cell variant-rfq-th" data-translate="rfq_variant_col"></th>';

    const cellValue = (row, key) => {
      const zh = row[`${key}Zh`];
      const en = row[`${key}En`];
      if (zh === undefined && en === undefined) return safe(row[key]);
      if (lang === 'zh') return safe(zh != null && String(zh).trim() !== '' ? zh : en);
      return safe(en != null && String(en).trim() !== '' ? en : zh);
    };

    const bodyHtml = table.rows.map((row) => {
      return `
        <tr>
          ${cols.map((c) => `<td>${cellValue(row, c.key)}</td>`).join('')}
          ${tentTypeRfqButtonHtml(item, row, selectedVariantKey)}
        </tr>
      `;
    }).join('');

    const isTentAccessoriesHub = item && item.type === 'tent_accessories';
    const isFoldingStock = item && FOLDING_STOCK_TYPES.has(item.type);
    const titleTag = isFoldingStock ? 'h2' : 'h1';

    const headHtmlBlock = isFoldingStock
      ? ''
      : `
        <div class="tent-type-detail__head">
          <${titleTag} class="tent-type-detail__title">
            ${lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn)}
            ${item.seriesCode ? ` <span class=\"tent-type-detail__series\">(${safe(item.seriesCode)})</span>` : ''}
            ${Array.isArray(item.variants) && item.variants.length
              ? (() => {
                const v = getSelectedVariant(item, selectedVariantKey);
                const label = v
                  ? (lang === 'zh' ? (safe(v.labelZh) || safe(v.labelEn) || safe(v.key)) : (safe(v.labelEn) || safe(v.labelZh) || safe(v.key)))
                  : '';
                return label ? ` <span class=\"tent-type-detail__series\">(${label})</span>` : '';
              })()
              : ''
            }
          </${titleTag}>
        </div>`;

    const gripsAfterTitle = isTentAccessoriesHub ? renderTentAccessoriesGripsBlock(item) : '';

    const specTableBlock = `
        <div class="tent-type-detail__block">
          <div class="tent-type-detail__blockTitle">${lang === 'zh' ? '型号参数' : 'Models & Specs'}</div>
          ${materialNoteHtml}
          <div class="tent-type-detail__tableWrap">
            <table class="tent-type-detail__table">
              <thead><tr>${headerHtml}</tr></thead>
              <tbody>${bodyHtml}</tbody>
            </table>
          </div>
          ${renderVariantSelector(item, selectedVariantKey)}
        </div>`;

    return `
      <div class="tent-type-detail">
        ${headHtmlBlock}
        ${gripsAfterTitle}
        ${specTableBlock}

        ${renderStory(item)}
        ${renderExampleImages(item)}
        ${renderInfoBlocks(item)}
        ${item && item.skipCommonDetails ? '' : renderCommonDetails()}
        ${item && item.skipAccessoriesBlock ? '' : renderAccessories(item)}
        ${renderPdfGuide(item)}
        ${renderRelatedLinks(item)}
      </div>
    `;
  }

  /** Same 24-grip sprite grid as products-accessories.html — directly under the hub title, before 型号参数. */
  function renderTentAccessoriesGripsBlock(item) {
    const lang = getCurrentLang();
    const intro = lang === 'zh'
      ? '以下为画册 24 格配件缩略图，可点击图片或标题查看详情，或加入询价清单。'
      : '24-grip catalog grid — click image or title for details, or add to the RFQ list.';
    return `
      <div class="tent-type-detail__block tent-type-detail__block--accessories-grips">
        <p class="tent-type-detail__text" style="margin-bottom: 14px;">${intro}</p>
        <div id="tentTypeAccessoriesGrid" class="ap-grid" aria-label="${lang === 'zh' ? '帐篷配件可选列表' : 'Tent accessories picker'}"></div>
      </div>
    `;
  }

  function renderInfoBlocks(item) {
    const lang = getCurrentLang();
    if (!item || !Array.isArray(item.infoBlocks) || !item.infoBlocks.length) return '';

    return item.infoBlocks.map((b) => {
      const title = lang === 'zh'
        ? (safe(b.titleZh) && safe(b.titleEn) ? `${safe(b.titleZh)} / ${safe(b.titleEn)}` : safe(b.titleZh || b.titleEn))
        : safe(b.titleEn || b.titleZh);

      const zh = safe(b.textZh || '');
      const en = safe(b.textEn || '');

      return `
        <div class="tent-type-detail__block">
          <div class="tent-type-detail__blockTitle">${title}</div>
          ${lang === 'zh'
            ? `
              ${zh ? renderRichText(zh) : ''}
              ${en ? renderRichText(en) : ''}
            `
            : `
              ${renderRichText(en || zh)}
            `
          }
        </div>
      `;
    }).join('');
  }

  function renderStory(item) {
    const lang = getCurrentLang();
    if (!item) return '';
    const zh = safe(item.storyZh || '');
    const en = safe(item.storyEn || '');
    if (!zh && !en) return '';
    const title = lang === 'zh' ? '产品介绍' : 'Product Story';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        ${lang === 'zh'
          ? `
            ${zh ? renderRichText(zh) : ''}
            ${en ? renderRichText(en) : ''}
          `
          : `
            ${renderRichText(en || zh)}
          `
        }
      </div>
    `;
  }

  function renderCommonDetails() {
    const lang = getCurrentLang();
    const common = window.TENT_TYPES && window.TENT_TYPES.common ? window.TENT_TYPES.common : null;
    if (!common) return '';

    const title = lang === 'zh' ? '连接方式 / 面料说明' : 'Connection Method / Fabric';
    const zh = safe(common.connectionMethodZh || '');
    const en = safe(common.connectionMethodEn || '');

    // Only show for tent types that asked for it (folding/star/awning). If not specified, show anyway as requested.
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        ${lang === 'zh'
          ? `
            ${renderRichText(zh)}
            ${renderRichText(en)}
          `
          : `
            ${renderRichText(en)}
          `
        }
      </div>
    `;
  }

  function renderAccessories(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.accessoriesImages)) {
      item.accessoriesImages.forEach((p) => p && imgs.push(p));
    } else if (item && item.accessoriesImage) {
      imgs.push(item.accessoriesImage);
    }
    if (!imgs.length) return '';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${lang === 'zh' ? '配件' : 'Accessories'}</div>
        <div class="tent-type-detail__visuals" style="grid-template-columns: 1fr;">
          ${imgs.map((src) => {
            const s = wkAssetUrl(safe(src));
            const isStarAccessories = /startentaccessories\.png$/i.test(s) || s.includes('startentaccessories.png');
            const cls = isStarAccessories ? 'tent-type-detail__visual tent-type-detail__visual--small' : 'tent-type-detail__visual';
            return `<img class=\"${cls}\" src=\"${s}\" alt=\"\" loading=\"lazy\" />`;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderPdfGuide(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.guideImages)) {
      item.guideImages.forEach((p) => p && imgs.push(p));
    } else if (item && item.guideImage) {
      imgs.push(item.guideImage);
    }
    if (!imgs.length) return '';
    const title = lang === 'zh' ? '产品画册参考' : 'Brochure PDF Guide';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        <div class="tent-type-detail__visuals" style="grid-template-columns: 1fr;">
          ${imgs.map((src) => `<img class=\"tent-type-detail__visual\" src=\"${wkAssetUrl(safe(src))}\" alt=\"\" loading=\"lazy\" />`).join('')}
        </div>
      </div>
    `;
  }

  function renderRelatedLinks(item) {
    const lang = getCurrentLang();
    if (item && item.type === 'tent_accessories') {
      return `
      <div class="tent-type-detail__block tent-type-detail__block--accessories-footer-links">
        <div style="display:flex; gap: 10px; flex-wrap: wrap;">
          <a class="btn btn-secondary" href="products-accessories.html">${lang === 'zh' ? '配件专题页（大图）' : 'Accessories page (large view)'}</a>
          <a class="btn btn-outline" href="all-products.html">${lang === 'zh' ? '全部产品目录' : 'Full product catalog'}</a>
        </div>
      </div>
    `;
    }
    if (!item || !item.links || !item.links.length) return '';
    const linksHtml = item.links.map((l) => {
      return `<a class="btn btn-secondary" href="${safe(l.href)}">${lang === 'zh' ? safe(l.labelZh) : safe(l.labelEn)}</a>`;
    }).join(' ');
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${lang === 'zh' ? '更多' : 'More'}</div>
        <div style="display:flex; gap: var(--spacing-sm); flex-wrap: wrap;">${linksHtml}</div>
      </div>
    `;
  }

  function renderTentTypeOverview() {
    const root = document.getElementById('tentTypeRoot');
    if (root) root.innerHTML = '';
    const bc = document.getElementById('tentTypeBreadcrumb');
    if (bc) {
      bc.textContent = ttT('tent_types_title');
    }
    setTentTypeHubVisibilityForDetail(false);
    resetTentTypeHubHeadMeta();
    removeJsonLdByPrefix('wk-jsonld-product');
    injectBreadcrumbJsonLdForTentType();
  }

  function renderTentTypeInvalid() {
    setTentTypeHubVisibilityForDetail(true);
    removeJsonLdByPrefix('wk-jsonld-product');
    const root = document.getElementById('tentTypeRoot');
    if (!root) return;
    const hAll = ttPageHref('/all-products.html?cat=tents');
    const hPc = ttPageHref('/product-center.html?cat=tents');
    const hMfg = ttPageHref('/custom-canopy-tent-manufacturer.html');
    root.innerHTML = `
      <div class="tent-type-error" style="text-align: left; max-width: 40rem; padding: 0.5rem 0 0;">
        <p class="tent-type-error__msg" style="margin: 0 0 0.75rem; font-weight: 600;" data-translate="tent_type_error_not_found">Tent type not found.</p>
        <div class="tent-type-keynav" style="display: flex; flex-wrap: wrap; gap: 0.4rem 1.1rem; font-size: 0.95rem; font-weight: 600;" aria-label="Where to go next">
          <a href="${safe(hAll)}" data-translate="tent_type_link_all_canopy">All Canopy Products</a>
          <a href="${safe(hPc)}" data-translate="tent_type_link_product_center_tents">Product Center – Tents</a>
          <a href="${safe(hMfg)}" data-translate="tent_type_link_custom_canopy">Custom Canopy Tent Manufacturer</a>
        </div>
      </div>
    `;
  }

  function render() {
    let type = String(getQueryType() || '').trim();
    let variant = getQueryVariant();
    if (!type) {
      renderTentTypeOverview();
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
      return;
    }

    let item = findTentTypeData(type);

    // Back-compat: older inflatable links used type=airt_9/16/25/36/64.
    if (!item && /^airt_/.test(type)) {
      variant = type;
      type = 'inflatable';
      item = findTentTypeData(type);
    }

    const bc = document.getElementById('tentTypeBreadcrumb');
    if (bc) {
      if (!item) {
        bc.textContent = ttT('tent_type_breadcrumb_not_found');
      } else {
        const lang = getCurrentLang();
        bc.textContent = lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn);
      }
    }

    if (!item) {
      renderTentTypeInvalid();
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
      return;
    }

    setTentTypeHubVisibilityForDetail(true);

    const root = document.getElementById('tentTypeRoot');
    if (!root) return;

    const folding = FOLDING_STOCK_TYPES.has(item.type);
    const s = folding ? FOLDING_SERIES_SEO[item.type] : null;

    injectBreadcrumbJsonLdForTentType(item);
    if (folding && s) {
      setFoldingHeadMeta(s);
      injectProductJsonLdForFolding(s, item.type);
    } else {
      removeJsonLdByPrefix('wk-jsonld-product');
      const lang = getCurrentLang();
      const name = lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn);
      document.title = `${name} | Tent Types | WaiKwan`;
    }

    let bodyHtml = `${renderTopHero(item)}${renderTableFromSpec(item, variant)}`;
    if (folding) {
      bodyHtml = `${renderFoldingSeriesTop(item)}${bodyHtml}${renderFoldingProcurementBlock(item)}${renderFoldingBottomLinks()}`;
    }

    root.innerHTML = bodyHtml;

    bindFoldingStockGallery(root);
    bindTentTypeRfq(root);

    if (item.type === 'tent_accessories' && typeof window.WK_mountAccessoriesGrid === 'function') {
      window.WK_mountAccessoriesGrid('tentTypeAccessoriesGrid', { search: false });
    }

    // Bind variant buttons (inflatable tents)
    root.querySelectorAll('[data-variant]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-variant') || '';
        try {
          const url = new URL(window.location.href);
          if (next) url.searchParams.set('variant', next);
          else url.searchParams.delete('variant');
          history.replaceState({}, '', url.toString());
        } catch (e) {
          // ignore
        }
        render();
      });
    });

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function init() {
    render();
    document.addEventListener('languageChanged', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
