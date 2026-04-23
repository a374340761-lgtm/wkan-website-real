// Product Center: filter category cards by ?cat=
(function () {
  'use strict';

  /** Image/static paths from data → root-absolute URL (works on /zh/... pages). */
  function wkAssetUrl(u) {
    if (u == null || u === '') return u;
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

  /** EN path → `/zh/...` when on Chinese mirror (see products.js). */
  function localizedInternal(href) {
    const raw = String(href || '').trim();
    const normalized = raw.startsWith('/') ? raw : '/' + raw.replace(/^\.\//, '');
    if (typeof window.wkLocalizedInternalLink === 'function') {
      try {
        return window.wkLocalizedInternalLink(normalized);
      } catch (e) {
        /* ignore */
      }
    }
    return normalized;
  }

  /** Hub cards (tents/flags) may omit nameZh; use same title fallback as product listings. */
  function hubItemTitle(item, lang) {
    if (typeof window.WK_productDisplayName === 'function') {
      return window.WK_productDisplayName({
        name: '',
        nameZh: item.nameZh,
        nameEn: item.nameEn,
        shortZh: item.storyZh || item.descriptionZh || item.hubDescZh,
        model: item.model
      }, lang);
    }
    return lang === 'zh' ? String(item.nameZh || item.nameEn || '') : String(item.nameEn || item.nameZh || '');
  }

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
        const pid = found.id;
        if (pid === 2001 || pid === 2002 || pid === 2003) {
          const typeById = { 2001: 'folding30', 2002: 'folding40', 2003: 'folding50' };
          window.location.replace(localizedInternal(`/tent-type.html?type=${typeById[pid]}`));
          return true;
        }
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
    try {
      if (typeof window.wkResolvePageLanguage === 'function') {
        return window.wkResolvePageLanguage();
      }
    } catch (e) {}
    try {
      const p = window.location.pathname.replace(/\\/g, '/');
      if (p === '/zh' || p.startsWith('/zh/')) return 'zh';
    } catch (e2) {}
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang === 'zh' || htmlLang === 'zh-cn') return 'zh';
    return 'en';
  }

  /** Legacy ?category= shares semantics with ?cat=; normalize URL for stable internal linking. */
  function normalizeLegacyCategoryQueryParam() {
    try {
      const url = new URL(window.location.href);
      const legacy = (url.searchParams.get('category') || '').trim();
      if (!legacy) return;
      const cur = (url.searchParams.get('cat') || '').trim();
      if (!cur) url.searchParams.set('cat', legacy);
      url.searchParams.delete('category');
      const qs = url.searchParams.toString();
      const next = url.pathname + (qs ? `?${qs}` : '') + url.hash;
      window.history.replaceState({}, '', next);
    } catch (e) {}
  }

  function getQueryCat() {
    try {
      const p = new URL(window.location.href).searchParams;
      return p.get('cat') || p.get('category') || '';
    } catch (e) {
      return '';
    }
  }

  let _pcDefaultTitle = null;
  let _pcDefaultDesc = null;
  function captureDefaultProductCenterHead() {
    if (_pcDefaultTitle != null) return;
    const titleEl = document.querySelector('title');
    const descEl = document.querySelector('meta[name="description"]');
    _pcDefaultTitle = titleEl ? String(titleEl.textContent || '') : '';
    _pcDefaultDesc = descEl ? String(descEl.getAttribute('content') || '') : '';
  }
  function restoreDefaultProductCenterHead() {
    captureDefaultProductCenterHead();
    const titleEl = document.querySelector('title');
    const descEl = document.querySelector('meta[name="description"]');
    if (titleEl) titleEl.textContent = _pcDefaultTitle;
    if (descEl) descEl.setAttribute('content', _pcDefaultDesc);
    if (typeof window.wkRefreshSocialFromHead === 'function') {
      window.wkRefreshSocialFromHead();
    }
  }
  function applyTentsHubHead() {
    captureDefaultProductCenterHead();
    const t = (k) => (window.multiLang && typeof window.multiLang.t === 'function' ? window.multiLang.t(k) : k);
    const title = String(t('pc_meta_title_tents') || '').trim();
    const desc = String(t('pc_meta_desc_tents') || '').trim();
    if (title) {
      const titleEl = document.querySelector('title');
      if (titleEl) titleEl.textContent = title;
    }
    if (desc) {
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', desc);
    }
    if (typeof window.wkRefreshSocialFromHead === 'function') {
      window.wkRefreshSocialFromHead();
    }
  }

  function getNotice() {
    try {
      return new URL(window.location.href).searchParams.get('notice') || '';
    } catch (e) {
      return '';
    }
  }

  function updatePcContextBanner(cat) {
    const el = document.getElementById('productCenterContext');
    if (!el) return;
    const badge = document.getElementById('pcContextBadge');
    const catalog = document.getElementById('pcContextCatalog');
    const t = (k) => (window.multiLang && typeof window.multiLang.t === 'function' ? window.multiLang.t(k) : k);
    const keyMap = {
      tents: 'home_cat_tents_title',
      flags: 'menu_beach_flags',
      displays: 'menu_popup_displays',
      lightbox: 'category_lightbox',
      furniture: 'category_furniture',
      custom: 'category_custom',
      accessories: 'menu_accessories',
      racegate: 'home_cat_racegate_title',
      'advertising-arch': 'category_advertising_arch',
      'water-filled-a-poster-stand': 'category_water_filled_a_poster_stand'
    };
    if (!cat) {
      el.hidden = true;
      document.body.removeAttribute('data-pc-active-cat');
      return;
    }
    el.hidden = false;
    document.body.setAttribute('data-pc-active-cat', String(cat));
    const k = keyMap[cat];
    if (badge) badge.textContent = k ? t(k) : cat;
    if (catalog) {
      catalog.href = cat === 'accessories' ? 'all-products.html' : `all-products.html?cat=${encodeURIComponent(cat)}`;
    }
    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function applyCategoryFilter(cat) {
    try {
    if (cat !== 'tents') {
      restoreDefaultProductCenterHead();
    }
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

    // Accessories hub: beach flag accessories + tent accessories (two grips)
    if (cat === 'accessories') {
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = 'none';
      cards.forEach((card) => {
        card.style.display = 'none';
      });
      if (backWrap) backWrap.style.display = '';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';

      renderAccessoriesHub();
      return;
    }

    // RaceGate: exactly three shape groups → unified PDP (?sku=9401/9402/9403), no racegate-type hub.
    if (cat === 'racegate') {
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = 'none';
      cards.forEach((card) => {
        card.style.display = 'none';
      });
      if (backWrap) backWrap.style.display = '';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';

      renderRacegateHub();
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
        removeAccessoriesHub();
        removeRacegateHub();
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
      removeAccessoriesHub();
      removeRacegateHub();
      removeSubcategoryHub();
      if (backWrap) backWrap.style.display = notice ? '' : 'none';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';
      return;
    }
    } finally {
      updatePcContextBanner(cat);
      try {
        sessionStorage.setItem('wk_last_listing', window.location.pathname + window.location.search);
      } catch (e) {
        // ignore
      }
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

  const PC_GROUPED_HUB_SUBS = new Set(['dome-3-folders', 'table-chair-stool-toilet']);
  const PC_GROUPED_TYPE_HERO_REL = 'images/广西伟群帐篷制造有限公司2025allpagepng/17.png';

  function normalizePcSubSlug(catLower, rawSub) {
    const s = String(rawSub || '').trim();
    if (!s) return '';
    if (String(catLower).toLowerCase() === 'displays' && s.toLowerCase() === 'tfd-straight-line') {
      return 'tension-fabric';
    }
    return s;
  }

  function pickRepProductForPcSub(items, catLower, subName) {
    const want = String(subName || '').toLowerCase();
    const matches = [];
    (items || []).forEach((p) => {
      const slug = normalizePcSubSlug(catLower, getSubcategoryValue(p));
      if (!slug) return;
      if (String(slug).toLowerCase() === want) matches.push(p);
    });
    if (!matches.length) return null;
    const scored = matches.map((p) => {
      let has = false;
      if (typeof window.WK_getProductCardImage === 'function' && window.WK_getProductCardImage(p)) has = true;
      else if (p && p.image && String(p.image).trim()) has = true;
      return { p, has };
    });
    scored.sort((a, b) => (b.has ? 1 : 0) - (a.has ? 1 : 0));
    return scored[0].p;
  }

  function resolvePcSubHeroUrl(rep, catLower) {
    if (rep && typeof window.WK_getProductCardImage === 'function') {
      const u = window.WK_getProductCardImage(rep);
      if (u) return u;
    }
    if (rep && rep.image) return wkAssetUrl(rep.image);
    const slides = window.HERO_SLIDES || [];
    if (catLower === 'displays' || catLower === 'lightbox') {
      const d = slides.find((s) => s && s.id === 'displays');
      if (d && d.image) return wkAssetUrl(String(d.image).replace(/^\//, ''));
    }
    const slide = slides.find((s) => s && s.id === catLower);
    if (slide && slide.image) return wkAssetUrl(String(slide.image).replace(/^\//, ''));
    return wkAssetUrl('images/placeholder.png');
  }

  function blurbFromRepForPc(rep, lang, escapeHtmlFn) {
    if (!rep) return '';
    const max = 118;
    const pm = window.productManager;
    let raw = '';
    if (pm && typeof pm.getLocalizedShort === 'function') {
      raw = pm.getLocalizedShort(rep) || '';
    } else if (lang === 'zh') {
      raw = rep.shortZh || rep.descriptionZh || rep.short || rep.description || '';
    } else {
      raw = rep.shortEn || rep.descriptionEn || rep.short || rep.description || '';
    }
    const t = String(raw || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    if (t.length <= max) return escapeHtmlFn(t);
    return escapeHtmlFn(t.slice(0, max - 1) + '…');
  }

  function renderSubcategoryHub(cat) {
    removeRacegateHub();
    const container = ensureSubcategoryHubContainer();
    if (!container) return;

    const items = getCategoryProducts(cat);
    const map = new Map();
    const catLower = String(cat || '').toLowerCase();
    items.forEach((p) => {
      const s = normalizePcSubSlug(catLower, getSubcategoryValue(p));
      if (!s) return;
      map.set(s, (map.get(s) || 0) + 1);
    });

    const subsAll = Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const useGroupedTypeHubCards = catLower === 'displays' || catLower === 'furniture';
    const subs = useGroupedTypeHubCards
      ? subsAll.filter((x) => !PC_GROUPED_HUB_SUBS.has(String(x.name).toLowerCase()))
      : subsAll;

    const hasFurnitureSub = items.some((p) => {
      const sl = normalizePcSubSlug(catLower, getSubcategoryValue(p));
      return sl && sl.toLowerCase() === 'table-chair-stool-toilet';
    });
    const hasDomeSub = items.some((p) => {
      const sl = normalizePcSubSlug(catLower, getSubcategoryValue(p));
      return sl && sl.toLowerCase() === 'dome-3-folders';
    });
    const hasGroupedHeroCards = useGroupedTypeHubCards && (hasFurnitureSub || hasDomeSub);

    const lang = getCurrentLang();
    const viewAllText = (lang === 'zh') ? '查看该大类全部产品' : 'View all in this category';

    const escapeHtml = (s) => {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const viewAllPath = `/all-products.html?cat=${encodeURIComponent(cat)}`;
    const viewAllHref = escapeHtml(localizedInternal(viewAllPath));

    /**
     * Subcategory slug → multilang key.
     * Display Systems hub (?cat=displays) merges `displays` + `lightbox` products, so lookups must not be scoped by URL category
     * (otherwise lightbox slugs incorrectly fall back to raw English slugs in zh mode).
     */
    const SUBCATEGORY_LABEL_KEYS = {
      'a-frame': 'menu_displays_aframe',
      'a-frame-backdrop': 'menu_displays_aframe_backdrop',
      'popup': 'menu_popup_backdrop',
      'counter': 'menu_popup_counter',
      'fabric-banner-stands': 'menu_popup_fabric_banner_stands',
      'tension-fabric': 'menu_displays_tension_fabric',
      'tfd-straight-line': 'menu_popup_tfd_straight_line_series',
      'tfd-c-shaped': 'menu_popup_tfd_c_shaped_series',
      'tfd-accessories': 'menu_popup_tfd_accessories',
      'round-tube-light-box': 'menu_lightbox_round_tube',
      'aluminum-profile-seg-light-box': 'menu_lightbox_aluminum_profile',
      'seg-net-light-box': 'menu_lightbox_seg_net',
      'base-style-variant': 'menu_lightbox_base_style_variant',
      'roll-up-stand': 'menu_displays_roll_up_stand',
      'promotion-counter': 'menu_displays_promotion_counter',
      'dome-3-folders': 'menu_dome_3_folders',
      'table-chair-stool-toilet': 'menu_table_chair_stool_toilet'
    };

    const groupedTypeHubAria = {
      menu_table_chair_stool_toilet: { zh: '桌 / 椅 / 凳 / 厕所', en: 'Tables / Chairs / Stools / Sanitation' },
      menu_dome_3_folders: { zh: 'DOME 3 折叠系列', en: 'DOME 3 Folding Series' }
    };

    if (!subsAll.length && !hasGroupedHeroCards) {
      const title = (lang === 'zh') ? '请选择小类目' : 'Choose a Subcategory';
      const desc = (lang === 'zh') ? '只显示该大类下的全部小类目入口。' : 'Showing subcategories under this category.';
      container.innerHTML = `
        <div class="tents-hub__section">
          <h2 class="tents-hub__title">${escapeHtml(title)}</h2>
          <p style="text-align:center;max-width:860px;margin:10px auto 0;color:rgba(31,45,61,.65);">${escapeHtml(desc)}</p>
          <div style="text-align:center;margin:18px 0 0;">
            <a class="btn btn-secondary" href="${viewAllHref}">${escapeHtml(viewAllText)}</a>
          </div>
        </div>
      `;
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
      return;
    }

    const subCardsHtml = subs.map((s) => {
      const rep = pickRepProductForPcSub(items, catLower, s.name);
      const imgUrl = escapeHtml(resolvePcSubHeroUrl(rep, catLower));
      const listPath = `/all-products.html?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(s.name)}`;
      const listHref = escapeHtml(localizedInternal(listPath));
      const countText = (lang === 'zh') ? `${s.count} 个产品` : `${s.count} items`;
      const blurb = blurbFromRepForPc(rep, lang, escapeHtml);
      const v = String(s.name || '').trim().toLowerCase();
      const titleKey = SUBCATEGORY_LABEL_KEYS[v];
      let titleHtml;
      if (titleKey) {
        titleHtml = `<div class="tent-type-card__title"><span class="zh" data-translate="${titleKey}"></span><span class="en" data-translate="${titleKey}"></span></div>`;
      } else {
        const fb = rep
          ? (lang === 'zh' ? (rep.nameZh || rep.name || rep.nameEn || s.name) : (rep.nameEn || rep.name || rep.nameZh || s.name))
          : s.name;
        titleHtml = `<div class="tent-type-card__title">${escapeHtml(fb)}</div>`;
      }
      const descBlock = blurb
        ? `<div class="tent-type-card__desc">${blurb}</div><div class="pc-subhub-count" style="font-size:12px;color:rgba(31,45,61,.5);margin-top:6px;">${escapeHtml(countText)}</div>`
        : `<div class="tent-type-card__desc" style="opacity:.85;">${escapeHtml(countText)}</div>`;
      return `
        <div class="tent-type-card tent-type-card--pc-subhub">
          <a class="tent-type-card__link" href="${listHref}">
            <div class="tent-type-card__imgWrap">
              <img class="tent-type-card__img" src="${imgUrl}" alt="" loading="lazy" onerror="this.style.display='none'" />
            </div>
          </a>
          <div class="tent-type-card__body">
            <a class="tent-type-card__link" href="${listHref}" style="text-decoration:none;color:inherit;">
              ${titleHtml}
              ${descBlock}
            </a>
            <div class="tent-type-card__cta">
              <a class="btn btn-secondary" href="${listHref}" data-translate="pc_context_browse_skus">Browse SKUs</a>
            </div>
          </div>
        </div>`;
    }).join('');

    const groupedHeroSrc = escapeHtml(wkAssetUrl(PC_GROUPED_TYPE_HERO_REL));
    let groupedHtml = '';
    if (hasFurnitureSub) {
      const href = escapeHtml(localizedInternal('/furniture-type.html?type=table-chair-stool-toilet'));
      const aria = escapeHtml(groupedTypeHubAria.menu_table_chair_stool_toilet[lang === 'zh' ? 'zh' : 'en']);
      groupedHtml += `
        <div class="tent-type-card tent-type-card--pc-grouped">
          <a class="tent-type-card__link" href="${href}" aria-label="${aria}">
            <div class="tent-type-card__imgWrap">
              <img class="tent-type-card__img" src="${groupedHeroSrc}" alt="" loading="lazy" onerror="this.style.display='none'" />
            </div>
          </a>
          <div class="tent-type-card__body">
            <a class="tent-type-card__link" href="${href}" style="text-decoration:none;color:inherit;">
              <div class="tent-type-card__title">
                <span class="zh" data-translate="menu_table_chair_stool_toilet"></span>
                <span class="en" data-translate="menu_table_chair_stool_toilet"></span>
              </div>
              <div class="tent-type-card__desc">
                <span class="zh" data-translate="view_type_intro_furniture"></span>
                <span class="en" data-translate="view_type_intro_furniture"></span>
              </div>
            </a>
            <div class="tent-type-card__cta">
              <a class="btn btn-secondary" href="${href}" data-translate="view_type_button">View Type</a>
            </div>
          </div>
        </div>`;
    }
    if (hasDomeSub) {
      const href = escapeHtml(localizedInternal('/dome-type.html'));
      const aria = escapeHtml(groupedTypeHubAria.menu_dome_3_folders[lang === 'zh' ? 'zh' : 'en']);
      groupedHtml += `
        <div class="tent-type-card tent-type-card--pc-grouped">
          <a class="tent-type-card__link" href="${href}" aria-label="${aria}">
            <div class="tent-type-card__imgWrap">
              <img class="tent-type-card__img" src="${groupedHeroSrc}" alt="" loading="lazy" onerror="this.style.display='none'" />
            </div>
          </a>
          <div class="tent-type-card__body">
            <a class="tent-type-card__link" href="${href}" style="text-decoration:none;color:inherit;">
              <div class="tent-type-card__title">
                <span class="zh" data-translate="menu_dome_3_folders"></span>
                <span class="en" data-translate="menu_dome_3_folders"></span>
              </div>
              <div class="tent-type-card__desc">
                <span class="zh" data-translate="view_type_intro_dome"></span>
                <span class="en" data-translate="view_type_intro_dome"></span>
              </div>
            </a>
            <div class="tent-type-card__cta">
              <a class="btn btn-secondary" href="${href}" data-translate="view_type_button">View Type</a>
            </div>
          </div>
        </div>`;
    }

    const cardsCombined = subCardsHtml + groupedHtml;

    container.innerHTML = `
      <div class="tents-hub__section">
        <h2 class="tents-hub__title" style="text-align:center;">
          <span class="zh" data-translate="pc_subhub_visual_title"></span>
          <span class="en" data-translate="pc_subhub_visual_title"></span>
        </h2>
        <p style="text-align:center;max-width:860px;margin:10px auto 0;color:rgba(31,45,61,.65);">
          <span class="zh" data-translate="pc_context_overview_hint"></span>
          <span class="en" data-translate="pc_context_overview_hint"></span>
        </p>
        <div class="tent-types__grid" style="max-width:1180px;margin:18px auto 0;">${cardsCombined}</div>
        <div style="text-align:center;margin:18px 0 0;">
          <a class="btn btn-secondary" href="${viewAllHref}">${escapeHtml(viewAllText)}</a>
        </div>
      </div>
    `;

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

  function ensureAccessoriesHubContainer() {
    let el = document.getElementById('accessoriesHub');
    if (el) return el;

    const anchor = document.querySelector('.section-header');
    if (!anchor || !anchor.parentElement) return null;

    el = document.createElement('section');
    el.id = 'accessoriesHub';
    el.className = 'tents-hub';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    return el;
  }

  function removeAccessoriesHub() {
    const el = document.getElementById('accessoriesHub');
    if (el && el.parentElement) el.parentElement.removeChild(el);
  }

  function ensureRacegateHubContainer() {
    let el = document.getElementById('racegateHub');
    if (el) return el;

    const anchor = document.querySelector('.section-header');
    if (!anchor || !anchor.parentElement) return null;

    el = document.createElement('section');
    el.id = 'racegateHub';
    el.className = 'tents-hub';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    return el;
  }

  function removeRacegateHub() {
    const el = document.getElementById('racegateHub');
    if (el && el.parentElement) el.parentElement.removeChild(el);
  }

  /** RaceGate shapes (V / O / semi) + Advertising Arch card — same tent-type-card grip, PDP only. */
  function renderRacegateHub() {
    removeTentsHub();
    removeFlagsHub();
    removeAccessoriesHub();
    removeSubcategoryHub();

    const container = ensureRacegateHubContainer();
    if (!container) return;

    const pm = window.productManager;
    const list = pm && Array.isArray(pm.products) ? pm.products : [];
    const ids = [9401, 9402, 9403];
    const racegateOnly = ids
      .map((id) => list.find((p) => p && Number(p.id) === id))
      .filter(Boolean);
    const adArch =
      list.find((p) => p && String(p.sku || '').trim().toUpperCase() === 'WK-AD')
      || list.find((p) => p && Number(p.id) === 44001);
    const products = adArch ? racegateOnly.concat([adArch]) : racegateOnly;

    const lang = getCurrentLang();
    const safe = (s) => (s || '').toString();
    const shortText = (s, max = 160) => {
      const t = safe(s).replace(/\s+/g, ' ').trim();
      if (!t) return '';
      if (t.length <= max) return t;
      return t.slice(0, max - 1) + '…';
    };

    const escapeHtml = (s) => {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const cardsHtml = products.map((p) => {
      const title = pm && typeof pm.getLocalizedName === 'function'
        ? safe(pm.getLocalizedName(p))
        : (lang === 'zh' ? safe(p.nameZh || p.name || p.nameEn) : safe(p.nameEn || p.name || p.nameZh));
      const rawShort = pm && typeof pm.getLocalizedShort === 'function'
        ? safe(pm.getLocalizedShort(p))
        : (lang === 'zh' ? safe(p.shortZh || '') : safe(p.shortEn || ''));
      const desc = shortText(rawShort);
      const preferredSku = (p.sku != null && String(p.sku).trim() !== '')
        ? String(p.sku).trim()
        : String(p.id);
      const detailHref = localizedInternal(`product-detail.html?sku=${encodeURIComponent(preferredSku)}`);
      let img = '';
      if (typeof window.WK_getProductCardImage === 'function') {
        img = window.WK_getProductCardImage(p) || '';
      }
      if (!img) img = wkAssetUrl(p.image);
      return `
        <div class="tent-type-card">
          <a class="tent-type-card__link" href="${escapeHtml(detailHref)}" aria-label="${escapeHtml(title)}">
            <div class="tent-type-card__imgWrap">
              <img class="tent-type-card__img" src="${escapeHtml(img)}" alt="" loading="lazy" onerror="this.style.display='none'" />
            </div>
          </a>
          <div class="tent-type-card__body">
            <a class="tent-type-card__link" href="${escapeHtml(detailHref)}" style="text-decoration:none;color:inherit;">
              <div class="tent-type-card__title">${escapeHtml(title)}</div>
              ${desc ? `<div class="tent-type-card__desc">${escapeHtml(desc)}</div>` : ''}
            </a>
            <div class="tent-type-card__cta">
              <a class="btn btn-secondary product-details-btn" href="${escapeHtml(detailHref)}" data-translate="view_details">View Details</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const emptyMsg = lang === 'zh'
      ? '竞速拱门产品数据未加载，请刷新重试。'
      : 'Race gate products are not loaded. Please refresh.';

    container.innerHTML = `
      <div class="tents-hub__section">
        <h2 class="tents-hub__title" data-translate="home_cat_racegate_title">RaceGate</h2>
        <p style="text-align:center;max-width:860px;margin:10px auto 0;color:rgba(31,45,61,.65);" data-translate="home_cat_racegate_desc"></p>
        <div class="tent-types__grid">
          ${products.length ? cardsHtml : `<p style="grid-column:1/-1;text-align:center;">${escapeHtml(emptyMsg)}</p>`}
        </div>
      </div>
    `;

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  /** Beach flag accessories (e.g. bases) + tent accessories — two grip blocks. */
  function renderAccessoriesHub() {
    const container = ensureAccessoriesHubContainer();
    if (!container) return;

    removeTentsHub();
    removeFlagsHub();
    removeRacegateHub();
    removeSubcategoryHub();

    const data = window.FLAG_TYPES;
    const flagAccessories = data && Array.isArray(data.accessories) ? data.accessories : [];

    container.innerHTML = [
      renderFlagsHubSection('flags_hub_accessories_title', 'Beach Flag Bases & Accessories', flagAccessories),
      renderTentAccessoriesHubCard()
    ].join('');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
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
            const title = safe(hubItemTitle(item, lang));
            const hubDesc = lang === 'zh' ? safe(item.hubDescZh) : safe(item.hubDescEn);
            const rawDesc = lang === 'zh' ? safe(item.storyZh) : safe(item.storyEn);
            const desc = shortText(hubDesc || (rawDesc || '').split(/\n/)[0] || '');
            const viewTypeHref = localizedInternal(`/flag-type.html?type=${encodeURIComponent(item.type)}`);
            return `
              <div class="tent-type-card">
                <a class="tent-type-card__link" href="${viewTypeHref}" aria-label="${safe(title)}">
                  <div class="tent-type-card__imgWrap">
                    <img class="tent-type-card__img" src="${wkAssetUrl(item.heroImage)}" alt="" loading="lazy" onerror="this.style.display='none'" />
                  </div>
                </a>
                <div class="tent-type-card__body">
                  <a class="tent-type-card__link" href="${viewTypeHref}" style="text-decoration:none;color:inherit;">
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
    removeTentsHub();
    removeAccessoriesHub();
    removeRacegateHub();

    const container = ensureFlagsHubContainer();
    if (!container) return;

    const data = window.FLAG_TYPES;
    const poles = data && Array.isArray(data.poles) ? data.poles : [];
    const special = data && Array.isArray(data.special) ? data.special : [];
    const accessories = data && Array.isArray(data.accessories) ? data.accessories : [];

    container.innerHTML = [
      renderFlagsHubSection('flags_hub_poles_title', 'Beach Flags & Poles', poles),
      renderFlagsHubSection('flags_hub_special_title', 'Backpack & Street Flags', special),
      renderFlagsHubSection('flags_hub_accessories_title', 'Beach Flag Bases & Accessories', accessories),
    ].join('');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  /** Single “grip” card for full tent accessories range (matches Beach Flags hub pattern). */
  function renderTentAccessoriesHubCard() {
    const data = window.TENT_TYPES;
    const list = data && Array.isArray(data.accessories) ? data.accessories : [];
    const item = list.find((x) => x && x.type === 'tent_accessories');
    if (!item) return '';

    const lang = getCurrentLang();
    const safe = (s) => (s || '').toString();
    const title = safe(hubItemTitle(item, lang));
    const hubDesc = lang === 'zh' ? safe(item.hubDescZh) : safe(item.hubDescEn);
    const shortText = (s, max = 110) => {
      const t = safe(s).replace(/\s+/g, ' ').trim();
      if (!t) return '';
      if (t.length <= max) return t;
      return t.slice(0, max - 1) + '…';
    };
    const desc = shortText(hubDesc);
    const viewTypeHref = localizedInternal('/tent-type.html?type=tent_accessories');

    return `
      <div class="tents-hub__section">
        <h2 class="tents-hub__title" data-translate="tents_hub_accessories_title">Tent Accessories</h2>
        <div class="tent-types__grid">
          <div class="tent-type-card">
            <a class="tent-type-card__link" href="${viewTypeHref}" aria-label="${safe(title)}">
              <div class="tent-type-card__imgWrap">
                <img class="tent-type-card__img" src="${wkAssetUrl(item.heroImage)}" alt="" loading="lazy" onerror="this.style.display='none'" />
              </div>
            </a>
            <div class="tent-type-card__body">
              <a class="tent-type-card__link" href="${viewTypeHref}" style="text-decoration:none;color:inherit;">
                <div class="tent-type-card__title">${title}</div>
                ${desc ? `<div class="tent-type-card__desc">${safe(desc)}</div>` : ''}
              </a>
              <div class="tent-type-card__cta">
                <a class="btn btn-secondary" href="${viewTypeHref}" data-translate="view_type_button">View Type</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
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
            const title = safe(hubItemTitle(item, lang));
            const hubDesc = lang === 'zh' ? safe(item.hubDescZh) : safe(item.hubDescEn);
            const rawDesc = lang === 'zh' ? safe(item.descriptionZh) : safe(item.descriptionEn);
            const desc = shortText(hubDesc || rawDesc.split(/\n/)[0] || '');
            const viewTypeHref = localizedInternal(`/tent-type.html?type=${encodeURIComponent(item.type)}`);
            return `
              <div class="tent-type-card">
                <a class="tent-type-card__link" href="${viewTypeHref}" aria-label="${safe(title)}">
                  <div class="tent-type-card__imgWrap">
                    <img class="tent-type-card__img" src="${wkAssetUrl(item.heroImage)}" alt="" loading="lazy" onerror="this.style.display='none'" />
                  </div>
                </a>
                <div class="tent-type-card__body">
                  <a class="tent-type-card__link" href="${viewTypeHref}" style="text-decoration:none;color:inherit;">
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
    removeFlagsHub();
    removeAccessoriesHub();
    removeRacegateHub();

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
      `<div class="tents-hub__buyer-intro wk-card" style="max-width:980px;margin:0 auto 20px;padding:16px 18px;border-radius:14px;">
        <div style="font-weight:900;margin-bottom:8px;">
          <span class="zh" data-translate="tents_hub_buyer_intro_title"></span>
          <span class="en" data-translate="tents_hub_buyer_intro_title"></span>
        </div>
        <p style="margin:0;color:rgba(31,45,61,.78);line-height:1.55;font-size:0.95rem;">
          <span class="zh" data-translate="tents_hub_buyer_intro_p"></span>
          <span class="en" data-translate="tents_hub_buyer_intro_p"></span>
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;">
          <a class="btn btn-secondary" href="${localizedInternal('/custom-canopy-tent-manufacturer.html')}"><span class="zh" data-translate="nav_sol_canopy"></span><span class="en" data-translate="nav_sol_canopy"></span></a>
          <a class="btn btn-tertiary" href="${localizedInternal('/all-products.html?cat=tents')}"><span class="zh" data-translate="home_canopy_pri_all_skus"></span><span class="en" data-translate="home_canopy_pri_all_skus"></span></a>
        </div>
        <div class="pc-tent-cluster" style="margin-top:14px;padding:12px 14px;border-radius:10px;background:#f4f5f7;font-size:0.92rem;line-height:1.55;color:rgba(31,45,61,.86);">
          <div style="font-weight:800;margin-bottom:6px;">
            <span class="zh" data-translate="pc_tent_cluster_h2"></span>
            <span class="en" data-translate="pc_tent_cluster_h2"></span>
          </div>
          <div class="zh" data-translate="pc_tent_cluster_html"></div>
          <div class="en" data-translate="pc_tent_cluster_html"></div>
        </div>
      </div>`,
      renderHubSection('tents_hub_folding_title', 'Folding Tents', folding),
      renderHubSection('tents_hub_event_title', 'Event Tents', event),
      renderHubSection('tents_hub_inflatable_title', 'Inflatable Tents', inflatableSummary),
      renderTentAccessoriesHubCard()
    ].join('');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
    applyTentsHubHead();
  }

  function init() {
    normalizeLegacyCategoryQueryParam();
    const cat = getQueryCat();
    applyCategoryFilter(cat);

    // After the page is in the right category state, open requested product modal.
    maybeOpenProductFromQuery();

    document.addEventListener('languageChanged', () => {
      const c = getQueryCat();
      if (c === 'tents') {
        renderTentsHub();
      } else {
        restoreDefaultProductCenterHead();
      }
      if (c === 'flags') {
        renderFlagsHub();
      }
      if (c === 'accessories') {
        renderAccessoriesHub();
      }
      if (c === 'racegate') {
        renderRacegateHub();
      }
      if (c && c !== 'tents' && c !== 'flags' && c !== 'accessories' && c !== 'racegate') {
        renderSubcategoryHub(c);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
