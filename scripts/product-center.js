// Product Center: filter category cards by ?cat=
(function () {
  'use strict';

  // DETAIL ROUTING (deep-link support)
  // Canonical detail experience is opened from product-center via modal.
  // Usage: product-center.html?open=<key> (optionally with &cat=...)
  // Key can be id / sku / model / slug / name (we resolve against product data).
  function maybeOpenProductFromQuery() {
    let params;
    try {
      params = new URL(window.location.href).searchParams;
    } catch (e) {
      return;
    }

    const norm = (v) => (v == null ? '' : String(v)).trim();
    const q = {
      open: norm(params.get('open')),
      id: norm(params.get('id')),
      sku: norm(params.get('sku')),
      model: norm(params.get('model')),
      name: norm(params.get('name')),
      product: norm(params.get('product')),
      pid: norm(params.get('pid')),
      slug: norm(params.get('slug')),
      cat: norm(params.get('cat')),
      category: norm(params.get('category'))
    };

    const catHint = q.cat || q.category;
    const key = q.open || q.id || q.sku || q.model || q.slug || q.product || q.pid || q.name;
    if (!key) return;

    const lower = key.toLowerCase();
    const pick = (p, fields) => {
      for (let i = 0; i < fields.length; i++) {
        const v = p && p[fields[i]];
        if (v != null && String(v).trim() !== '') return String(v).trim();
      }
      return '';
    };

    const findByKey = (pm) => {
      const list = pm && Array.isArray(pm.products) ? pm.products : [];
      if (!list.length) return null;

      // exact match across common identifiers
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        const candidates = [
          pick(p, ['id', 'productId', 'product_id', 'pid']),
          pick(p, ['sku', 'SKU', 'code', 'productCode']),
          pick(p, ['model', 'Model']),
          pick(p, ['slug', 'handle']),
          pick(p, ['nameEn', 'nameZh', 'name', 'title'])
        ].filter(Boolean).map((x) => x.toLowerCase());
        if (candidates.includes(lower)) return p;
      }

      // loose: name contains
      for (let j = 0; j < list.length; j++) {
        const p2 = list[j];
        const n = pick(p2, ['nameEn', 'nameZh', 'name', 'title']).toLowerCase();
        if (n && n.includes(lower)) return p2;
      }

      return null;
    };

    const tryOpen = () => {
      const pm = window.productManager;
      if (!pm || !Array.isArray(pm.products)) return false;

      const found = findByKey(pm);
      if (found) {
        const preferredSku = (found && found.sku != null && String(found.sku).trim() !== '')
          ? String(found.sku).trim()
          : String(found.id);
        window.location.replace(`product-detail.html?sku=${encodeURIComponent(preferredSku)}`);
        return true;
      }

      // Not found: avoid blank experience; route to category or search.
      if (catHint) {
        window.location.replace(`product-center.html?cat=${encodeURIComponent(catHint)}`);
        return true;
      }

      window.location.replace(`all-products.html?q=${encodeURIComponent(key)}`);
      return true;
    };

    if (tryOpen()) return;

    // products.js initializes productManager on DOMContentLoaded; wait a bit if needed.
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (tryOpen() || tries > 60) {
        clearInterval(timer);
      }
    }, 50);
  }

  function getCurrentLang() {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang === 'zh' || htmlLang === 'en') return htmlLang;
    try {
      const saved = (localStorage.getItem('site_language') || '').toLowerCase();
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {
      // ignore
    }
    return 'en';
  }

  function getQueryCat() {
    try {
      const p = new URL(window.location.href).searchParams;
      return p.get('cat') || p.get('category') || '';
    } catch (e) {
      return '';
    }
  }

  function getNotice() {
    try {
      return new URL(window.location.href).searchParams.get('notice') || '';
    } catch (e) {
      return '';
    }
  }

  function applyCategoryFilter(cat) {
    const cards = Array.from(document.querySelectorAll('.category-card'));
    const backWrap = document.getElementById('productCenterBackWrap');
    const noticeEl = document.getElementById('productCenterNotice');
    const notice = getNotice();

    // Special case: Tents Hub
    if (cat === 'tents') {
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = 'none';
      cards.forEach((card) => {
        card.style.display = 'none';
      });
      if (backWrap) backWrap.style.display = '';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';

      renderTentsHub();

      // Optional: if the entry is "Stock" card, provide a clear CTA to the stock listing.
      if (notice === 'stock') {
        const hub = document.getElementById('tentsHub');
        if (hub) {
          const bar = document.createElement('div');
          bar.style.cssText = 'max-width:980px;margin:0 auto 16px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;';
          bar.innerHTML = `
            <a class="btn btn-secondary" href="all-products.html?cat=tents&tag=stock">${getCurrentLang() === 'zh' ? '查看现货帐篷' : 'View Stock Tents'}</a>
            <a class="btn btn-secondary" href="all-products.html?cat=tents">${getCurrentLang() === 'zh' ? '查看帐篷全部产品' : 'View All Tents'}</a>
          `;
          hub.prepend(bar);
        }
      }
      return;
    }

    // Special case: Flags Hub
    if (cat === 'flags') {
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = 'none';
      cards.forEach((card) => {
        card.style.display = 'none';
      });
      if (backWrap) backWrap.style.display = '';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';

      renderFlagsHub();
      return;
    }

    // Generic secondary overview: show subcategories for the selected category (when valid)
    if (cat) {
      const hasCard = cards.some((card) => (card.dataset.category || '').trim() === cat);
      const pm = window.productManager;
      const hasProducts = !!(pm && Array.isArray(pm.products) && pm.products.some((p) => p && String(p.category || '').toLowerCase() === String(cat).toLowerCase()));

      // If cat doesn't match any known category card and no products exist, keep all visible.
      if (!hasCard && !hasProducts) {
        cards.forEach((card) => {
          card.style.display = '';
        });
        const showcase = document.querySelector('.product-categories-showcase');
        if (showcase) showcase.style.display = '';
        removeTentsHub();
        removeFlagsHub();
        removeSubcategoryHub();
        if (backWrap) backWrap.style.display = '';
        if (noticeEl) noticeEl.style.display = '';
        return;
      }

      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = 'none';
      cards.forEach((card) => {
        card.style.display = 'none';
      });
      if (backWrap) backWrap.style.display = '';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';

      renderSubcategoryHub(cat);
      return;
    }

    if (!cat) {
      cards.forEach((card) => {
        card.style.display = '';
      });
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = '';
      removeTentsHub();
      removeFlagsHub();
      removeSubcategoryHub();
      if (backWrap) backWrap.style.display = notice ? '' : 'none';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';
      return;
    }
  }

  function ensureSubcategoryHubContainer() {
    let el = document.getElementById('subcatHub');
    if (el) return el;

    const anchor = document.querySelector('.section-header');
    if (!anchor || !anchor.parentElement) return null;

    el = document.createElement('section');
    el.id = 'subcatHub';
    el.className = 'tents-hub';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    return el;
  }

  function removeSubcategoryHub() {
    const el = document.getElementById('subcatHub');
    if (el && el.parentElement) el.parentElement.removeChild(el);
  }

  function getCategoryProducts(cat) {
    const pm = window.productManager;
    const list = pm && Array.isArray(pm.products) ? pm.products : [];
    const target = String(cat || '').toLowerCase();
    // Display Systems umbrella: include Light Box series under Display Systems overview.
    if (target === 'displays') {
      return list.filter((p) => {
        const c = p && String(p.category || '').toLowerCase();
        return c === 'displays' || c === 'lightbox';
      });
    }
    return list.filter((p) => p && String(p.category || '').toLowerCase() === target);
  }

  function getSubcategoryValue(p) {
    const keys = ['subcategory', 'subCategory', 'sub_category', 'series', 'type', 'subType', 'line', 'collection'];
    for (let i = 0; i < keys.length; i++) {
      const v = p && p[keys[i]];
      if (v == null) continue;
      const s = String(v).trim();
      if (s) return s;
    }
    return '';
  }

  function renderSubcategoryHub(cat) {
    const container = ensureSubcategoryHubContainer();
    if (!container) return;

    const items = getCategoryProducts(cat);
    const map = new Map();
    items.forEach((p) => {
      const s = getSubcategoryValue(p);
      if (!s) return;
      map.set(s, (map.get(s) || 0) + 1);
    });

    const subs = Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const lang = getCurrentLang();
    const title = (lang === 'zh') ? '请选择小类目' : 'Choose a Subcategory';
    const desc = (lang === 'zh') ? '只显示该大类下的全部小类目入口。' : 'Showing subcategories under this category.';
    const viewAllText = (lang === 'zh') ? '查看该大类全部产品' : 'View all in this category';

    const viewAllHref = `all-products.html?cat=${encodeURIComponent(cat)}`;

    const escapeHtml = (s) => {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const getSubLabelHtml = (category, subValue) => {
      const c = String(category || '').toLowerCase();
      const vRaw = String(subValue || '').trim();
      const v = vRaw.toLowerCase();
      const mapByCat = {
        displays: {
          'a-frame': 'menu_displays_aframe',
          'a-frame-backdrop': 'menu_displays_aframe_backdrop',
          'popup': 'menu_popup_backdrop',
          'counter': 'menu_popup_counter',
          'fabric-banner-stands': 'menu_popup_fabric_banner_stands',
            'tension-fabric': 'menu_displays_tension_fabric',
            'tfd-straight-line': 'menu_popup_tfd_straight_line_series',
            'tfd-c-shaped': 'menu_popup_tfd_c_shaped_series',
            'tfd-accessories': 'menu_popup_tfd_accessories'
          },
          lightbox: {
            'round-tube-light-box': 'menu_lightbox_round_tube',
            'aluminum-profile-seg-light-box': 'menu_lightbox_aluminum_profile',
            'seg-net-light-box': 'menu_lightbox_seg_net'
        }
      };
      const key = mapByCat[c] && mapByCat[c][v];
      if (key) {
        return `<span class="zh" data-translate="${key}"></span><span class="en" data-translate="${key}"></span>`;
      }
      return escapeHtml(vRaw);
    };

    if (!subs.length) {
      container.innerHTML = `
        <div class="tents-hub__section">
          <h2 class="tents-hub__title">${title}</h2>
          <p style="text-align:center;max-width:860px;margin:10px auto 0;color:rgba(31,45,61,.65);">${desc}</p>
          <div style="text-align:center;margin:18px 0 0;">
            <a class="btn btn-secondary" href="${viewAllHref}">${viewAllText}</a>
          </div>
        </div>
      `;
      return;
    }

    const cardsHtml = subs.map((s) => {
      const href = `all-products.html?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(s.name)}`;
      const countText = (lang === 'zh') ? `${s.count} 个产品` : `${s.count} items`;
      return `
        <a class="wk-card" href="${href}" style="display:block;padding:16px 16px;text-decoration:none;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div>
              <div style="font-weight:800;color:rgba(31,45,61,.92);margin-bottom:6px;">${getSubLabelHtml(cat, s.name)}</div>
              <div style="font-size:12px;color:rgba(31,45,61,.55);">${countText}</div>
            </div>
            <div style="font-weight:800;color:rgba(44,90,160,.85);">→</div>
          </div>
        </a>
      `;
    }).join('');

    container.innerHTML = `
      <div class="tents-hub__section">
        <h2 class="tents-hub__title" style="text-align:center;">${title}</h2>
        <p style="text-align:center;max-width:860px;margin:10px auto 0;color:rgba(31,45,61,.65);">${desc}</p>
        <div id="wkSubcatGrid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;max-width:980px;margin:18px auto 0;">${cardsHtml}</div>
        <div style="text-align:center;margin:18px 0 0;">
          <a class="btn btn-secondary" href="${viewAllHref}">${viewAllText}</a>
        </div>
      </div>
    `;

    const grid = container.querySelector('#wkSubcatGrid');
    const resize = () => {
      const w = window.innerWidth || 1200;
      if (!grid) return;
      if (w <= 640) grid.style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
      else if (w <= 980) grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
      else grid.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
    };
    resize();
    window.addEventListener('resize', resize);

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function ensureTentsHubContainer() {
    let el = document.getElementById('tentsHub');
    if (el) return el;

    const anchor = document.querySelector('.section-header');
    if (!anchor || !anchor.parentElement) return null;

    el = document.createElement('section');
    el.id = 'tentsHub';
    el.className = 'tents-hub';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    return el;
  }

  function removeTentsHub() {
    const el = document.getElementById('tentsHub');
    if (el && el.parentElement) el.parentElement.removeChild(el);
  }

  function ensureFlagsHubContainer() {
    let el = document.getElementById('flagsHub');
    if (el) return el;

    const anchor = document.querySelector('.section-header');
    if (!anchor || !anchor.parentElement) return null;

    el = document.createElement('section');
    el.id = 'flagsHub';
    el.className = 'tents-hub';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    return el;
  }

  function removeFlagsHub() {
    const el = document.getElementById('flagsHub');
    if (el && el.parentElement) el.parentElement.removeChild(el);
  }

  function renderFlagsHubSection(titleKey, titleFallback, items) {
    const lang = getCurrentLang();
    const safe = (s) => (s || '').toString();

    const shortText = (s, max = 110) => {
      const t = safe(s).replace(/\s+/g, ' ').trim();
      if (!t) return '';
      if (t.length <= max) return t;
      return t.slice(0, max - 1) + '…';
    };

    return `
      <div class="tents-hub__section">
        <h2 class="tents-hub__title" data-translate="${titleKey}">${titleFallback}</h2>
        <div class="tent-types__grid">
          ${(items || []).map((item) => {
            const title = lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn);
            const hubDesc = lang === 'zh' ? safe(item.hubDescZh) : safe(item.hubDescEn);
            const rawDesc = lang === 'zh' ? safe(item.storyZh) : safe(item.storyEn);
            const desc = shortText(hubDesc || (rawDesc || '').split(/\n/)[0] || '');
            const href = `all-products.html?cat=flags&type=${encodeURIComponent(item.type)}`;
            const viewTypeHref = `flag-type.html?type=${encodeURIComponent(item.type)}`;
            return `
              <div class="tent-type-card">
                <a class="tent-type-card__link" href="${href}" aria-label="${safe(title)}">
                  <div class="tent-type-card__imgWrap">
                    <img class="tent-type-card__img" src="${item.heroImage}" alt="" loading="lazy" onerror="this.style.display='none'" />
                  </div>
                </a>
                <div class="tent-type-card__body">
                  <a class="tent-type-card__link" href="${href}" style="text-decoration:none;color:inherit;">
                    <div class="tent-type-card__title">${title}</div>
                    ${desc ? `<div class=\"tent-type-card__desc\">${safe(desc)}</div>` : ''}
                  </a>
                  <div class="tent-type-card__cta">
                    <a class="btn btn-secondary" href="${viewTypeHref}" data-translate="view_type_button">View Type</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderFlagsHub() {
    const container = ensureFlagsHubContainer();
    if (!container) return;

    const data = window.FLAG_TYPES;
    const poles = data && Array.isArray(data.poles) ? data.poles : [];
    const special = data && Array.isArray(data.special) ? data.special : [];
    const accessories = data && Array.isArray(data.accessories) ? data.accessories : [];

    container.innerHTML = [
      renderFlagsHubSection('flags_hub_poles_title', 'Beach Flags & Poles', poles),
      renderFlagsHubSection('flags_hub_special_title', 'Backpack & Street Flags', special),
      renderFlagsHubSection('flags_hub_accessories_title', 'Bases & Accessories', accessories),
    ].join('');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function renderHubSection(titleKey, titleFallback, items) {
    const lang = getCurrentLang();
    const safe = (s) => (s || '').toString();

    const shortText = (s, max = 110) => {
      const t = safe(s).replace(/\s+/g, ' ').trim();
      if (!t) return '';
      if (t.length <= max) return t;
      return t.slice(0, max - 1) + '…';
    };

    return `
      <div class="tents-hub__section">
        <h2 class="tents-hub__title" data-translate="${titleKey}">${titleFallback}</h2>
        <div class="tent-types__grid">
          ${(items || []).map((item) => {
            const title = lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn);
            const hubDesc = lang === 'zh' ? safe(item.hubDescZh) : safe(item.hubDescEn);
            const rawDesc = lang === 'zh' ? safe(item.descriptionZh) : safe(item.descriptionEn);
            const desc = shortText(hubDesc || rawDesc.split(/\n/)[0] || '');
            const href = `all-products.html?cat=tents&type=${encodeURIComponent(item.type)}`;
            const viewTypeHref = `tent-type.html?type=${encodeURIComponent(item.type)}`;
            return `
              <div class="tent-type-card">
                <a class="tent-type-card__link" href="${href}" aria-label="${safe(title)}">
                  <div class="tent-type-card__imgWrap">
                    <img class="tent-type-card__img" src="${item.heroImage}" alt="" loading="lazy" onerror="this.style.display='none'" />
                  </div>
                </a>
                <div class="tent-type-card__body">
                  <a class="tent-type-card__link" href="${href}" style="text-decoration:none;color:inherit;">
                    <div class="tent-type-card__title">${title}</div>
                    ${desc ? `<div class=\"tent-type-card__desc\">${safe(desc)}</div>` : ''}
                  </a>
                  <div class="tent-type-card__cta">
                    <a class="btn btn-secondary" href="${viewTypeHref}" data-translate="view_type_button">View Type</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderTentsHub() {
    const container = ensureTentsHubContainer();
    if (!container) return;

    const data = window.TENT_TYPES;
    const folding = data && Array.isArray(data.folding) ? data.folding : [];
    const event = data && Array.isArray(data.event) ? data.event : [];
    const inflatable = data && Array.isArray(data.inflatable) ? data.inflatable : [];

    const inflatableSummary = inflatable.find((x) => x && x.type === 'inflatable')
      ? [inflatable.find((x) => x && x.type === 'inflatable')]
      : inflatable;

    container.innerHTML = [
      renderHubSection('tents_hub_folding_title', 'Folding Tents', folding),
      renderHubSection('tents_hub_event_title', 'Event Tents', event),
      renderHubSection('tents_hub_inflatable_title', 'Inflatable Tents', inflatableSummary)
    ].join('');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function init() {
    const cat = getQueryCat();
    applyCategoryFilter(cat);

    // After the page is in the right category state, open requested product modal.
    maybeOpenProductFromQuery();

    document.addEventListener('languageChanged', () => {
      if (getQueryCat() === 'tents') {
        renderTentsHub();
      }
      if (getQueryCat() === 'flags') {
        renderFlagsHub();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
