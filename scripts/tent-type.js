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
      heroAlt: 'WaiKwan 30 series pop up canopy tent, square-tube frame, outdoor event display',
      productName: 'WaiKwan 30 series pop up canopy tent (WK-T30 family)'
    },
    folding40: {
      h1: '40 Series Hexagon Frame Canopy Tent',
      title: '40 Series Hexagon Frame Canopy Tent | Custom Event Tent | WaiKwan',
      heroAlt: 'WaiKwan 40 series hexagon aluminum frame canopy tent, 3x3m trade show use',
      productName: 'WaiKwan 40 series hexagon frame folding canopy tent (WK-T40 family)'
    },
    folding50: {
      h1: '50 Series Heavy Duty Aluminum Canopy Tent',
      title: '50 Series Heavy Duty Aluminum Canopy Tent | OEM Tent Factory | WaiKwan',
      heroAlt: 'WaiKwan 50 series heavy duty aluminum hexagon frame canopy tent',
      productName: 'WaiKwan 50 series heavy duty aluminum folding canopy tent (WK-T50 family)'
    }
  };

  function foldingSeriesCopy(type) {
    const base = FOLDING_SERIES_SEO[type];
    if (!base) return null;
    const zh = getCurrentLang() === 'zh';
    const series = { folding30: '30', folding40: '40', folding50: '50' }[type];
    const nameZh = { folding30: '30 mm 方管折叠帐篷', folding40: '40 mm 六角铝合金帐篷', folding50: '50 mm 六角铝合金帐篷' }[type];
    const introZh = {
      folding30: '30 系列折叠帐篷提供多种尺寸。下面列出已核对的方管框架配置、重量和装箱资料。面料、顶篷、围布、印刷及配件请按具体型号确认。',
      folding40: '40 mm 六角铝合金帐篷包含标准款和经济款，重量及装箱参数按配置分别列出。本页的 3×6 m 带顶篷实拍展示框架、接头、调节结构与面料固定细节。',
      folding50: '50 mm 六角铝合金帐篷按 1.5 mm 与 1.7 mm 管壁配置分别列出规格。请按型号核对尺寸、重量与装箱要求，顶篷、围布及配件另行确认。'
    }[type];
    const introEn = {
      folding30: 'The 30 series offers folding canopy frames in multiple sizes. The reviewed table below lists square-tube frame configurations, weights and packing details. Confirm fabric, roof canopy, sidewalls, printing and accessories for the selected model.',
      folding40: 'The 40 mm hexagonal aluminum frame series includes standard and economy configurations, with separate weights and packing details below. The 3×6 m canopy photographs show the frame, joints, adjustment points and fabric attachments.',
      folding50: 'The 50 mm hexagonal aluminum frame series lists 1.5 mm and 1.7 mm wall configurations separately. Check the model-specific sizes, weights and packing details; confirm roof canopy, sidewalls and accessories with the order.'
    }[type];
    const intro = zh ? introZh : introEn;
    return { ...base, h1: zh ? nameZh : base.h1, title: zh ? nameZh + '｜规格与实拍｜伟群帐篷' : base.title, description: intro, intro, productName: zh ? '伟群 ' + nameZh : base.productName, heroAlt: zh ? nameZh + '产品与框架实拍' : base.heroAlt };
  }

  function getHeroAltForItem(item) {
    if (item && FOLDING_SERIES_SEO[item.type]) {
      return foldingSeriesCopy(item.type).heroAlt;
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

  function setInflatableSeriesHeadMeta(item) {
    if (!item || !/^inflatable-/.test(String(item.type || ''))) return false;
    const lang = getCurrentLang();
    const name = lang === 'zh' ? safe(item.nameZh || item.nameEn) : safe(item.nameEn || item.nameZh);
    const summary = lang === 'zh'
      ? safe(item.hubDescZh || item.storyZh || item.hubDescEn || item.storyEn)
      : safe(item.hubDescEn || item.storyEn || item.hubDescZh || item.storyZh);
    const description = summary.split(/\r?\n/)[0].replace(/\s+/g, ' ').trim().slice(0, 180);
    const title = lang === 'zh'
      ? `${name}｜定制充气展示产品｜伟群帐篷`
      : `${name} | Custom Inflatable Display | WaiKwan`;
    const localePrefix = lang === 'zh' ? '/zh' : '';
    const canonicalUrl = `${BASE_ORIGIN}${localePrefix}/tent-type.html?type=${encodeURIComponent(item.type)}`;
    const imageUrl = item.heroImage
      ? `${BASE_ORIGIN}/${String(item.heroImage).replace(/^\//, '')}`
      : `${BASE_ORIGIN}/images/products/tents/inflatable/inflatable-spider-tent-outdoor-event-hero.jpg`;

    document.title = title;
    const values = [
      ['meta[name="description"]', 'content', description],
      ['meta[property="og:title"]', 'content', title],
      ['meta[property="og:description"]', 'content', description],
      ['meta[property="og:url"]', 'content', canonicalUrl],
      ['meta[property="og:image"]', 'content', imageUrl],
      ['meta[name="twitter:title"]', 'content', title],
      ['meta[name="twitter:description"]', 'content', description],
      ['meta[name="twitter:url"]', 'content', canonicalUrl],
      ['meta[name="twitter:image"]', 'content', imageUrl]
    ];
    values.forEach(([selector, attribute, value]) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute(attribute, value);
    });
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', canonicalUrl);
    return true;
  }

  function resetTentTypeHubHeadMeta() {
    const title = 'Types of Canopy Tents | Frame, Size & Printing Guide | WaiKwan';
    const desc =
      'Compare folding canopy tent types by frame series, material, size and printing options. Review 30, 40 and 50 series models for wholesale and OEM sourcing.';
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', desc);
    const ogT = document.querySelector('meta[property="og:title"]');
    if (ogT) ogT.setAttribute('content', title);
    const ogD = document.querySelector('meta[property="og:description"]');
    if (ogD) ogD.setAttribute('content', desc);
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
        if (FOLDING_SERIES_SEO[t]) n = foldingSeriesCopy(t).h1;
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
    if (lead) {
      lead.hidden = !!detailOn;
      const heading = lead.querySelector('#tentTypeMainH1');
      const tag = detailOn ? 'h2' : 'h1';
      if (heading && heading.tagName.toLowerCase() !== tag) {
        const replacement = document.createElement(tag);
        Array.from(heading.attributes).forEach(a => replacement.setAttribute(a.name, a.value));
        replacement.innerHTML = heading.innerHTML;
        heading.replaceWith(replacement);
      }
    }
  }

  function renderFoldingSeriesTop(item) {
    const s = foldingSeriesCopy(item.type);
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
    const zh = getCurrentLang() === 'zh';
    return `<section class="tent-type-detail__block"><h2>${zh ? '采购前确认' : 'Before ordering'}</h2><p>${zh ? '上方规格按型号与配置列出。请确认所需尺寸、管壁配置、顶篷面料、围布、配件、印刷和包装；数量、交期及运输方案以本次报价为准。' : 'Specifications above are model- and configuration-specific. Confirm size, tube wall configuration, roof fabric, sidewalls, accessories, printing and packing. Quantity, lead time and shipping arrangements are confirmed in the quotation.'}</p><h3>${zh ? '尺寸与应用说明' : 'Size and application guidance'}</h3><p>${zh ? '3×3 m 约为 9.84×9.84 ft，与精确 10×10 ft（3.048×3.048 m）不同。请按公制型号尺寸准备画面文件，并根据活动现场选择框架、围布及配重方案。' : '3×3 m is approximately 9.84×9.84 ft; an exact 10×10 ft footprint is 3.048×3.048 m. Prepare artwork for the specified metric model and select frames, sidewalls and ballast for the event site.'}</p></section>`;
  }

  function renderFoldingBottomLinks() {
    const zh = getCurrentLang() === 'zh';
    const links = [['tent-type.html?type=folding30','30 系列','30 series'],['tent-type.html?type=folding40','40 系列','40 series'],['tent-type.html?type=folding50','50 系列','50 series'],['all-products.html?cat=tents','全部帐篷','All tents'],['export-loading.html','出口装柜实拍','Export loading photographs']];
    return `<section class="tent-type-detail__block"><h2>${zh ? '比较系列与出货记录' : 'Compare series and dispatch photographs'}</h2><div class="pdp-actions">${links.map(([url,cn,en]) => `<a class="btn btn-secondary" href="${url}">${zh ? cn : en}</a>`).join('')}</div></section>`;
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
    return `<td class="variant-rfq-cell"><button type="button" class="variant-rfq-btn" aria-label="${getCurrentLang() === 'zh' ? '加入询价车' : 'Add to quote cart'}" title="${getCurrentLang() === 'zh' ? '加入询价车' : 'Add to quote cart'}" data-wk-tent-rfq="1" data-wk-payload="${enc}"><i class="fas fa-cart-plus" aria-hidden="true"></i></button></td>`;
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
    const verifiedKey = STOCK_TENT_ID_BY_TYPE[item.type] || `tent:${item.type}`;
    const verified = typeof window.WK_renderVerifiedSpecs === 'function' ? window.WK_renderVerifiedSpecs(verifiedKey, lang, STOCK_TENT_ID_BY_TYPE[item.type] ? (r,g) => tentTypeRfqButtonHtml(item, {...r, model: `${r.model} · ${lang === 'zh' ? g.titleZh : g.titleEn}`, weight:r.weight ? `${r.weight} KG` : ''}, g.titleEn) : null) : '';
    if (verified) {
      // Keep the existing photographs, story and related links, replacing only the parameter table.
      return `<div class="tent-type-detail">${FOLDING_STOCK_TYPES.has(item.type) ? '' : `<h1>${safe(lang === 'zh' ? item.nameZh : item.nameEn)}</h1>`}${verified}${renderStory(item)}${renderExampleImages(item)}${renderInfoBlocks(item)}${renderPdfGuide(item)}${renderRelatedLinks(item)}</div>`;
    }
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

  function renderIntroductionPhoto(item) {
    const p = item && item.introductionPhoto;
    if (!p || !p.src) return '';
    const lang = getCurrentLang();
    const src = wkAssetUrl(p.src);
    const alt = safe(p.alt || '');
    const subtitle =
      lang === 'zh'
        ? safe(p.subtitleZh || p.subtitleEn || '')
        : safe(p.subtitleEn || p.subtitleZh || '');
    const caption =
      lang === 'zh'
        ? safe(p.captionZh || p.captionEn || '')
        : safe(p.captionEn || p.captionZh || '');
    const subHtml = subtitle
      ? `<div class="tent-type-detail__intro-photo-sub" style="font-weight:800;margin-bottom:10px;color:var(--wk-black);font-size:var(--font-size-sm);">${subtitle}</div>`
      : '';
    const capHtml = caption
      ? `<figcaption class="tent-type-detail__text tent-type-detail__intro-photo-cap" style="margin-top:10px;line-height:1.6;">${caption}</figcaption>`
      : '';
    return `
      <div class="tent-type-detail__visuals tent-type-detail__intro-photo-visuals" style="grid-template-columns:1fr;margin-bottom:var(--spacing-md);max-width:100%;">
        <figure class="tent-type-detail__intro-photo-figure" style="margin:0;">
          ${subHtml}
          <div class="tent-type-detail__intro-photo-wrap" style="border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--wk-border-light);background:var(--wk-bg-soft);">
            <img
              class="tent-type-detail__intro-photo-img"
              src="${src}"
              alt="${alt}"
              loading="lazy"
              decoding="async"
              style="width:100%;height:auto;display:block;max-width:100%;object-fit:contain;vertical-align:middle;"
              onerror="this.style.display='none'"
            />
          </div>
          ${capHtml}
        </figure>
      </div>`;
  }

  function renderDetailPhotos(item) {
    if (!Array.isArray(item.detailPhotos) || !item.detailPhotos.length) return '';
    const zh = getCurrentLang() === 'zh';
    return `<section id="canopy-3x6-details" class="tent-type-detail__block" style="scroll-margin-top:130px">
      <h2>${zh ? '40 mm 铝帐篷 · 3×6 m 带顶篷实拍细节' : '40 mm aluminum tent · 3 × 6 m canopy details'}</h2>
      <p>${zh ? '本组照片展示 3×6 m 带顶篷样品、立柱底脚、高度调节件、内部交叉支架与篷布固定方式。侧墙和配套件以询价确认配置为准。' : 'These photos show a 3 × 6 m canopy sample, upright feet, height adjustment, interior scissor frame and fabric attachments. Confirm sidewalls and included accessories in your quotation.'}</p>
      <div class="tent-type-detail__visuals">${item.detailPhotos.map(p => { const caption = safe(zh ? p.captionZh : p.captionEn); const src = wkAssetUrl(p.src); return `<figure style="margin:0;min-width:0"><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${caption}" loading="lazy" decoding="async" style="width:100%;height:320px;object-fit:contain" /></a><figcaption>${caption}</figcaption></figure>`; }).join('')}</div>
      <p><a href="product-detail.html?id=2002">${zh ? '查看 40 mm 系列规格与询价' : 'View 40 mm series specifications and request a quote'}</a> · <a href="tent-type.html">${zh ? '比较折叠帐篷系列' : 'Compare folding canopy series'}</a></p>
    </section>`;
  }

  function renderStory(item) {
    const lang = getCurrentLang();
    if (!item) return '';
    const zh = safe(item.storyZh || '');
    const en = safe(item.storyEn || '');
    const introPhoto = renderIntroductionPhoto(item);
    if (!zh && !en && !introPhoto) return '';
    const title = lang === 'zh' ? '产品介绍' : 'Product Story';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        ${introPhoto}
        ${item.detailPhotos ? `<p><a href="#canopy-3x6-details">${lang === 'zh' ? '查看 3×6 m 带顶篷实拍细节（8 张）' : 'View 3 × 6 m canopy details (8 photos)'}</a></p>` : ''}
        ${renderDetailPhotos(item)}
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
            const isStarAccessories =
              /star-shade-tent-poles-base-accessories\.png$/i.test(s) ||
              s.includes('star-shade-tent-poles-base-accessories.png') ||
              /startentaccessories\.png$/i.test(s) ||
              s.includes('startentaccessories.png');
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
        ${window.WK_getVerifiedSpecs?.(STOCK_TENT_ID_BY_TYPE[item.type] || `tent:${item.type}`).length ? `<p class="tent-type-detail__text">${lang === 'zh' ? '画册仅作款式参考；型号与配置参数以本页更新后的规格表为准。' : 'Brochure images illustrate product styles. Use the updated specification tables on this page for model and configuration details.'}</p>` : ''}
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
    const s = folding ? foldingSeriesCopy(item.type) : null;

    injectBreadcrumbJsonLdForTentType(item);
    if (folding && s) {
      setFoldingHeadMeta(s);
      injectProductJsonLdForFolding(s, item.type);
    } else {
      removeJsonLdByPrefix('wk-jsonld-product');
      const lang = getCurrentLang();
      const name = lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn);
      if (!setInflatableSeriesHeadMeta(item)) {
        document.title = `${name} | Tent Types | WaiKwan`;
      }
    }

    let bodyHtml = `${renderTopHero(item)}${renderTableFromSpec(item, variant)}`;
    if (folding) {
      bodyHtml = `${renderFoldingSeriesTop(item)}${bodyHtml}${renderFoldingProcurementBlock(item)}${renderFoldingBottomLinks()}`;
    }

    root.innerHTML = bodyHtml;

    bindFoldingStockGallery(root);
    if (window.location.hash === '#canopy-3x6-details') {
      requestAnimationFrame(() => root.querySelector('#canopy-3x6-details')?.scrollIntoView());
    }
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
