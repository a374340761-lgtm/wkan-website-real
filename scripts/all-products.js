// All Products Page - Search & Filter Logic
(function() {
    'use strict';

    function apLocalizedPageHref(href) {
        if (!href) return href;
        if (typeof window.wkLocalizedInternalLink === 'function') {
            const s = href.startsWith('/') ? href : '/' + String(href).replace(/^\.\//, '');
            return window.wkLocalizedInternalLink(s);
        }
        if (typeof window.wkLocalizedPageHref === 'function') {
            const s = href.startsWith('/') ? href : '/' + String(href).replace(/^\.\//, '');
            return window.wkLocalizedPageHref(s);
        }
        return href.startsWith('/') ? href : '/' + String(href).replace(/^\.\//, '');
    }

    // 获取产品数据（多来源兼容）
    let products = [];
    
    function getProducts() {
        // 1) 优先：window.productManager（你现有项目）
        if (window.productManager?.products?.length) {
            return window.productManager.products;
        }
        // 2) 备选：window.ProductManager
        if (window.ProductManager?.products?.length) {
            return window.ProductManager.products;
        }
        // 3) 备选：window.PRODUCTS 数组
        if (Array.isArray(window.PRODUCTS) && window.PRODUCTS.length) {
            return window.PRODUCTS;
        }
        // 4) 兜底：示例数据（仅用于测试）
        console.warn('All Products: Using fallback data. ProductManager not found.');
        return [
            {
                id: 1,
                category: 'tents',
                name: '帐篷',
                nameEn: 'Tent',
                model: 'WK-T-1',
                tags: 'pop-up tent, event tent, exhibition',
                image: 'images/page_24_img_6.png'
            },
            {
                id: 2,
                category: 'flags',
                name: '伟群牌沙滩旗杆',
                nameEn: 'Weiqun Beach Flag Poles',
                model: 'WK-FLAG-S',
                tags: 'beach flag, pole, 2.8m',
                image: 'images/page_24_img_15.png'
            },
            {
                id: 3,
                category: 'tents',
                name: '帐篷框架',
                nameEn: 'Tent Frame',
                model: 'WK-FRAME',
                tags: 'aluminum frame, quick assembly',
                image: 'images/page_24_img_6.png'
            },
            {
                id: 4,
                category: 'displays',
                name: '快幕秀',
                nameEn: 'Display Systems',
                model: 'WK-DISPLAY-3M',
                tags: 'backdrop, display, 3m',
                image: 'images/page_24_img_10.png'
            },
            {
                id: 5,
                category: 'accessories',
                name: '弹性桌布',
                nameEn: 'Stretchy Table Cloth',
                model: 'WK-TABLE',
                tags: 'table cover, fabric',
                image: 'images/page_24_img_10.png'
            },
            {
                id: 6,
                category: 'custom',
                name: '定制解决方案',
                nameEn: 'Custom Solutions',
                model: 'WK-CUSTOM',
                tags: 'OEM, ODM, customization',
                image: 'images/page_24_img_6.png'
            }
        ];
    }

    const grid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const catSelect = document.getElementById('catSelect');
    const emptyState = document.getElementById('emptyState');
    let invalidCatNoticeEl = null;
    let tentTypeNoticeEl = null;
    let tentsDetailsEl = null;
    let tentSubcategoriesEl = null;

    if (!grid || !searchInput || !catSelect) {
        console.warn('All Products page elements not found');
        return;
    }

    const DEFAULT_PAGE_TITLE = 'All Products | Canopy Tents, Beach Flags & Display Systems | WaiKwan';
    const DEFAULT_META_DESC = 'Browse all WaiKwan products including canopy tents, beach flags, backdrop displays, counters, light boxes, and event accessories. OEM and wholesale solutions for global B2B buyers.';
    const DEFAULT_OG_TITLE = 'All Products | WaiKwan';
    const DEFAULT_OG_DESC = 'Canopy tents, beach flags, display systems, and event accessories — OEM/ODM for B2B buyers.';
    const DEFAULT_TW_TITLE = 'All Products | WaiKwan';
    const DEFAULT_TW_DESC = 'Browse WaiKwan catalog: canopy tents, beach flags, displays, and accessories.';

    // 获取 URL 参数中的分类
    function getQueryCat() {
        const url = new URL(window.location.href);
        return url.searchParams.get('cat') || url.searchParams.get('category') || 'all';
    }

    function setQueryParams(nextParams) {
        const url = new URL(window.location.href);
        Object.entries(nextParams || {}).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === false) url.searchParams.delete(key);
            else url.searchParams.set(key, String(value));
        });
        // Normalize cat=all to no param
        if (url.searchParams.get('cat') === 'all') url.searchParams.delete('cat');
        const next = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + url.hash;
        window.history.replaceState({}, '', next);
    }

    function getCategoryLabelKey(cat) {
        const map = {
            tents: 'home_cat_tents_title',
            flags: 'menu_beach_flags',
            displays: 'menu_popup_displays',
            lightbox: 'category_lightbox',
            'advertising-arch': 'category_advertising_arch',
            'water-filled-a-poster-stand': 'category_water_filled_a_poster_stand',
            accessories: 'menu_accessories',
            racegate: 'home_cat_racegate_title',
            custom: 'category_custom',
            furniture: 'category_furniture'
        };
        return map[cat] || null;
    }

    /** When ?sub= matches a curated group, use type-page title keys and hub links. */
    function getSubGroupMeta(cat, sub) {
        const s = String(sub || '').trim().toLowerCase();
        if (!s) return null;
        if (s === 'table-chair-stool-toilet' && String(cat || '').toLowerCase() === 'furniture') {
            return {
                titleKey: 'view_type_page_title_furniture',
                hubPath: '/furniture-type.html?type=table-chair-stool-toilet',
                noteKey: 'ap_listing_group_furniture_note'
            };
        }
        if (s === 'dome-3-folders') {
            return {
                titleKey: 'view_type_page_title_dome',
                hubPath: '/dome-type.html',
                noteKey: 'ap_listing_group_dome_note'
            };
        }
        return null;
    }

    /** Differentiate title/meta when ?cat= is set (canonical stays all-products.html). */
    function updateCategorySeo(cat) {
        const t = (key) => (window.multiLang && typeof window.multiLang.t === 'function' ? window.multiLang.t(key) : key);
        const lang = getCurrentLang();
        const metaDesc = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        const twDesc = document.querySelector('meta[name="twitter:description"]');

        if (!cat || cat === 'all') {
            const subAll = getQuerySub('all');
            const gSeo = getSubGroupMeta('all', subAll);
            if (gSeo && subAll) {
                const label = t(gSeo.titleKey);
                if (lang === 'zh') {
                    document.title = `${label} · 产品目录 | 伟群帐篷`;
                    const zhDesc = `在伟群工厂目录中浏览「${label}」：OEM/ODM 定制、规格与报价。`;
                    if (metaDesc) metaDesc.setAttribute('content', zhDesc);
                    if (ogTitle) ogTitle.setAttribute('content', `${label} · 产品目录 | 伟群帐篷`);
                    if (ogDesc) ogDesc.setAttribute('content', zhDesc);
                    if (twTitle) twTitle.setAttribute('content', `${label} · 产品目录 | 伟群帐篷`);
                    if (twDesc) twDesc.setAttribute('content', zhDesc);
                    return;
                }
                document.title = `${label} | OEM Catalog | WaiKwan`;
                const enDesc = `Browse ${label} in the WaiKwan factory catalog — OEM/ODM, specifications, and B2B quotes.`;
                if (metaDesc) metaDesc.setAttribute('content', enDesc);
                if (ogTitle) ogTitle.setAttribute('content', `${label} | Browse OEM | WaiKwan`);
                if (ogDesc) ogDesc.setAttribute('content', enDesc);
                if (twTitle) twTitle.setAttribute('content', `${label} | OEM Catalog | WaiKwan`);
                if (twDesc) twDesc.setAttribute('content', enDesc);
                return;
            }
            document.title = DEFAULT_PAGE_TITLE;
            if (metaDesc) metaDesc.setAttribute('content', DEFAULT_META_DESC);
            if (ogTitle) ogTitle.setAttribute('content', DEFAULT_OG_TITLE);
            if (ogDesc) ogDesc.setAttribute('content', DEFAULT_OG_DESC);
            if (twTitle) twTitle.setAttribute('content', DEFAULT_TW_TITLE);
            if (twDesc) twDesc.setAttribute('content', DEFAULT_TW_DESC);
            return;
        }

        const sub = getQuerySub(cat);
        const gMeta = getSubGroupMeta(cat, sub);
        const key = gMeta && gMeta.titleKey ? gMeta.titleKey : getCategoryLabelKey(cat);
        const label = key ? t(key) : cat;

        if (lang === 'zh') {
            document.title = `${label} · 产品目录 | 伟群帐篷`;
            const zhDesc = `在伟群工厂目录中按分类浏览「${label}」：OEM/ODM 定制、规格与报价。`;
            if (metaDesc) metaDesc.setAttribute('content', zhDesc);
            if (ogTitle) ogTitle.setAttribute('content', `${label} · 产品目录 | 伟群帐篷`);
            if (ogDesc) ogDesc.setAttribute('content', zhDesc);
            if (twTitle) twTitle.setAttribute('content', `${label} · 产品目录 | 伟群帐篷`);
            if (twDesc) twDesc.setAttribute('content', zhDesc);
            return;
        }

        document.title = `${label} | OEM Catalog | WaiKwan`;
        const enDesc = `Browse ${label} in the WaiKwan factory catalog — OEM/ODM, specifications, and B2B quotes.`;
        if (metaDesc) metaDesc.setAttribute('content', enDesc);
        if (ogTitle) ogTitle.setAttribute('content', `${label} | Browse OEM | WaiKwan`);
        if (ogDesc) ogDesc.setAttribute('content', enDesc);
        if (twTitle) twTitle.setAttribute('content', `${label} | OEM Catalog | WaiKwan`);
        if (twDesc) twDesc.setAttribute('content', enDesc);
    }

    function getPreferredSku(product) {
        if (!product) return '';
        const sku = (product.sku != null && String(product.sku).trim() !== '') ? String(product.sku).trim() : '';
        if (sku) return sku;
        const id = (product.id != null && String(product.id).trim() !== '') ? String(product.id).trim() : '';
        return id;
    }

    function buildUnifiedDetailUrlFromSku(sku) {
        const s = (sku == null ? '' : String(sku)).trim();
        if (!s) return '';
        const FOLDING_STOCK_PDP_TO_TYPE = { '2001': 'folding30', '2002': 'folding40', '2003': 'folding50' };
        if (FOLDING_STOCK_PDP_TO_TYPE[s]) {
            return apLocalizedPageHref(`/tent-type.html?type=${encodeURIComponent(FOLDING_STOCK_PDP_TO_TYPE[s])}`);
        }
        return apLocalizedPageHref(`/product-detail.html?sku=${encodeURIComponent(s)}`);
    }

    function extractSkuFromHref(href) {
        try {
            const u = new URL(href, window.location.href);
            const p = u.searchParams;
            // unified param
            const sku = p.get('sku');
            if (sku) return sku;
            // legacy params
            const legacy = p.get('id') || p.get('open') || p.get('pid') || p.get('product') || p.get('model');
            return legacy || '';
        } catch (e) {
            return '';
        }
    }

    // Global click safeguard (All Products only): force all "View details / 查看详情" clicks to the unified PDP.
    // Works even if some legacy href remains in dynamically-rendered DOM.
    document.addEventListener('click', (e) => {
        const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;

        const isDetails = a.classList.contains('product-details-btn') || a.getAttribute('data-translate') === 'view_details';
        if (!isDetails) return;

        const href = a.getAttribute('href') || '';
        const isUnified = /(^|\/)(product-detail\.html)(\?|#|$)/i.test(href);
        if (isUnified) return;

        const skuFromData = a.getAttribute('data-sku') || (a.closest('[data-sku]') && a.closest('[data-sku]').getAttribute('data-sku')) || '';
        const skuFromHref = extractSkuFromHref(href);
        const nextSku = (skuFromData || skuFromHref || '').trim();
        const unified = buildUnifiedDetailUrlFromSku(nextSku);
        if (!unified) return;

        e.preventDefault();
        e.stopPropagation();
        window.location.assign(unified);
    }, true);

    function updateHeadingAndBreadcrumb(cat) {
        const headingEl = document.getElementById('allProductsHeading');
        const crumbEl = document.getElementById('allProductsBreadcrumbCurrent');
        const t = (key) => (window.multiLang && typeof window.multiLang.t === 'function' ? window.multiLang.t(key) : key);

        if (!headingEl && !crumbEl) return;

        if (!cat || cat === 'all') {
            const sub = getQuerySub('all');
            const gAll = getSubGroupMeta('all', sub);
            if (gAll && gAll.titleKey) {
                const lab = t(gAll.titleKey);
                if (headingEl) headingEl.textContent = lab;
                if (crumbEl) crumbEl.textContent = lab;
                return;
            }
            if (headingEl) headingEl.textContent = t('ap_h1_all_products');
            if (crumbEl) crumbEl.textContent = t('ap_h1_all_products');
            return;
        }

        const sub = getQuerySub(cat);
        const gMeta = getSubGroupMeta(cat, sub);
        const key = gMeta && gMeta.titleKey ? gMeta.titleKey : getCategoryLabelKey(cat);
        const label = key ? t(key) : cat;
        if (headingEl) headingEl.textContent = label;
        if (crumbEl) crumbEl.textContent = label;
    }

    function updateApContextBanner(cat) {
        const hint = document.getElementById('apContextHint');
        const banner = document.getElementById('apContextBanner');
        const badge = document.getElementById('apContextBadge');
        const hub = document.getElementById('apContextHub');
        const t = (key) => (window.multiLang && typeof window.multiLang.t === 'function' ? window.multiLang.t(key) : key);
        if (!banner || !badge || !hub) return;
        if (!cat || cat === 'all') {
            const subAll = getQuerySub('all');
            const gAllBanner = getSubGroupMeta('all', subAll);
            if (gAllBanner && subAll) {
                banner.hidden = false;
                if (hint) hint.hidden = true;
                document.body.setAttribute('data-ap-active-cat', 'all');
                badge.textContent = t(gAllBanner.titleKey);
                hub.href = apLocalizedPageHref(gAllBanner.hubPath);
                hub.setAttribute('data-translate', 'ap_open_type_hub');
                hub.textContent = '';
                if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                    window.multiLang.translatePage();
                }
                return;
            }
            banner.hidden = true;
            if (hint) hint.hidden = false;
            document.body.removeAttribute('data-ap-active-cat');
            return;
        }
        banner.hidden = false;
        if (hint) hint.hidden = true;
        document.body.setAttribute('data-ap-active-cat', String(cat));
        const sub = getQuerySub(cat);
        const gMeta = getSubGroupMeta(cat, sub);
        if (gMeta && gMeta.titleKey) {
            badge.textContent = t(gMeta.titleKey);
            hub.href = apLocalizedPageHref(gMeta.hubPath);
            hub.setAttribute('data-translate', 'ap_open_type_hub');
            hub.textContent = '';
            if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                window.multiLang.translatePage();
            }
            return;
        }
        const key = getCategoryLabelKey(cat);
        badge.textContent = key ? t(key) : cat;
        hub.href = apLocalizedPageHref(`/product-center.html?cat=${encodeURIComponent(cat)}`);
        hub.setAttribute('data-translate', 'ap_open_category_hub');
        hub.textContent = '';
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    }

    function ensureInvalidCatNotice() {
        if (invalidCatNoticeEl) return invalidCatNoticeEl;
        // Inline notice (shown only when URL cat is invalid)
        invalidCatNoticeEl = document.createElement('div');
        invalidCatNoticeEl.className = 'ap-empty';
        invalidCatNoticeEl.style.display = 'none';
        invalidCatNoticeEl.style.padding = '1rem 0 0';
        invalidCatNoticeEl.innerHTML = '<p data-translate="category_not_available">Category not available yet. Showing all categories.</p>';

        // Put it above the grid for visibility
        const wrap = grid && grid.parentElement;
        if (wrap) {
            wrap.insertBefore(invalidCatNoticeEl, grid);
        }
        return invalidCatNoticeEl;
    }

    function ensureTentTypeNotice() {
        if (tentTypeNoticeEl) return tentTypeNoticeEl;
        tentTypeNoticeEl = document.createElement('div');
        tentTypeNoticeEl.className = 'ap-empty';
        tentTypeNoticeEl.style.display = 'none';
        tentTypeNoticeEl.style.padding = '1rem 0 0';
        tentTypeNoticeEl.innerHTML = '<p data-translate="tent_type_no_match">This tent type has no mapped products yet.</p>';

        const wrap = grid && grid.parentElement;
        if (wrap) {
            // Place above the grid (below invalid cat notice if present)
            wrap.insertBefore(tentTypeNoticeEl, grid);
        }
        return tentTypeNoticeEl;
    }

    /** Reserved URL tag: beach flag pole hub SKUs only (excludes backpack/street + bases). See scripts/flag-types.js `poles`. */
    const BEACH_FLAG_POLES_TAG = 'beach-flag-poles';
    const BEACH_FLAG_POLE_TYPES = new Set([
        'fiberglass_pole',
        'alu_fiberglass_pole',
        'fully_fiberglass_teardrop',
        'fully_fiberglass_feather',
        'outdoor_giant_flag',
        'square_flag_pole_fiberglass',
        'alu_pole_semicircle',
        'alu_pole_square',
        'alu_pole_new_feather',
        'alu_pole_feather'
    ]);

    // 获取 URL 参数中的标签
    function getQueryTag() {
        const url = new URL(window.location.href);
        return url.searchParams.get('tag') || '';
    }

    // 获取 URL 参数中的帐篷子类型（仅用于 cat=tents）
    function getQueryTentType() {
        const url = new URL(window.location.href);
        return url.searchParams.get('type') || '';
    }

    // 获取 URL 参数中的通用子类目（用于非 tents：sub / subcat / series / type 等）
    function getQuerySub(cat) {
        const url = new URL(window.location.href);
        const sub = url.searchParams.get('sub')
            || url.searchParams.get('subcat')
            || url.searchParams.get('subcategory')
            || url.searchParams.get('series')
            || url.searchParams.get('line')
            || url.searchParams.get('collection')
            || '';

        // Compatibility: for non-tents categories, allow using type= as a subcategory value.
        const type = url.searchParams.get('type') || '';
        if (!sub && cat && cat !== 'tents' && type) return type;
        return sub;
    }

    // 获取 URL 参数中的 q（搜索关键词）
    function getQueryQ() {
        const url = new URL(window.location.href);
        return url.searchParams.get('q') || url.searchParams.get('search') || '';
    }

    /** True when the user (or URL) is actively filtering; used to show empty-state only for zero-result filters. */
    function getActiveFilterState() {
        const q = (searchInput && searchInput.value) ? String(searchInput.value).trim() : getQueryQ().trim();
        const cat = catSelect ? String(catSelect.value || 'all') : getQueryCat();
        const tag = getQueryTag();
        const tentType = getQueryTentType();
        const sub = getQuerySub(cat);
        if (q) return true;
        if (cat && cat !== 'all') return true;
        if (tag) return true;
        if (tentType) return true;
        if (sub) return true;
        return false;
    }

    // 获取当前语言（URL 优先：/zh/ => zh）
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
        if (window.multiLang && window.multiLang.getCurrentLanguage) {
            return window.multiLang.getCurrentLanguage();
        }
        return 'en';
    }

    function hasCjk(text) {
        return /[\u3400-\u9FFF\uF900-\uFAFF]/.test(String(text || ''));
    }

    // 获取产品名称（根据当前语言）
    function getProductName(product) {
        const lang = getCurrentLang();
        if (typeof window.WK_productDisplayName === 'function') {
            return window.WK_productDisplayName(product, lang);
        }
        const legacy = product ? (product.name || '') : '';
        if (lang === 'zh') return product.nameZh || (hasCjk(legacy) ? legacy : '') || '产品';
        if (lang === 'en') return product.nameEn || (!hasCjk(legacy) ? legacy : '') || 'Product';
        return product.nameEn || product.nameZh || legacy || 'Product';
    }

    function safeText(text) {
        return String(text == null ? '' : text)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    // ===================== Multi-language Search Dictionary (CN -> EN) =====================
    const SEARCH_SYNONYMS = {
      // ===== Beach Flags =====
      "沙滩旗": ["beach flag", "beach flags", "feather flag", "feather flags", "teardrop flag", "teardrop flags", "swooper flag"],
      "羽毛旗": ["feather flag", "feather flags", "beach flag"],
      "滴水旗": ["teardrop flag", "teardrop flags", "beach flag", "teardrop banner"],
      "水滴旗": ["teardrop flag", "teardrop flags", "beach flag"],
      "沙滩旗杆": ["flag pole", "flagpole", "beach flag pole", "beach flagpole", "pole", "mast"],
      "旗杆": ["flag pole", "flagpole", "pole", "mast"],

      "玻纤杆": ["fiberglass pole", "fiberglass", "glass fiber pole", "glassfiber pole", "frp pole", "fiberglass mast"],
      "玻璃纤维": ["fiberglass", "frp", "glass fiber"],

      // ===== Tents =====
      "折叠帐篷": ["pop up tent", "popup tent", "folding tent", "instant tent", "canopy tent", "event tent", "gazebo"],
      "广告帐篷": ["canopy tent", "custom canopy", "printed canopy", "branding tent", "event tent", "gazebo"],
      "充气帐篷": ["inflatable tent", "air tent", "blow up tent", "pneumatic tent", "inflatable canopy", "inflatable gazebo"],

      // ===== Pop-up Display / Backdrop =====
      "展会快幕秀": ["pop up display", "popup display", "pop-up display", "display backdrop", "backdrop", "tension fabric backdrop", "fabric backdrop", "trade show backdrop", "display wall", "exhibition backdrop"],
      "快幕秀": ["pop up display", "popup display", "display backdrop", "backdrop", "tension fabric backdrop", "display wall"],
      "拉网展架": ["pop up display", "popup display", "pop-up stand", "display stand", "display system", "folding display", "expandable display"],
      "展架": ["display stand", "display system", "trade show display", "exhibition display"],
      "展会": ["trade show", "exhibition", "event", "booth"],

      // ===== Lightbox / SEG =====
      "展架灯箱": ["lightbox", "light box", "display lightbox", "backlit display", "led lightbox", "portable lightbox", "trade show lightbox"],
      "卡布灯箱": ["seg lightbox", "seg", "silicone edge graphic", "silicone edge", "fabric lightbox", "led lightbox", "seg frame", "seg display"],

      // ===== Outdoor Umbrella =====
      "户外遮阳伞": ["outdoor umbrella", "patio umbrella", "market umbrella", "sun umbrella", "parasol", "cantilever umbrella", "garden umbrella"],
      "伞底座": ["umbrella base", "base", "stand base", "weight base", "water base", "cross base"],

      // ===== Signage & Boards =====
      "A字板": ["a-frame", "a frame", "a board", "sandwich board", "sidewalk sign", "pavement sign", "folding sign"],

      // ===== Generic / Industry keywords =====
      "广告展示用品": ["advertising display", "display products", "promo display", "promotional display", "marketing display", "branding products", "event display"],
      "展会器材厂家": ["trade show supplier", "exhibition supplier", "manufacturer", "factory", "direct factory", "oem", "odm", "custom manufacturer"],
      "厂家": ["manufacturer", "factory", "direct factory", "oem", "odm"],

      // ===== Tent / pole hardware (grip, clamp, diameter) =====
      "夹具": ["grip", "clamp", "holder", "tent clamp", "pole clamp", "clamp-on"],
      "帐篷夹": ["grip", "clamp", "tent clamp", "pole clamp"],
      "管夹": ["grip", "clamp", "pole clamp", "tube clamp"],
      "内径": ["inner diameter", "id", "bore", "inside diameter"],
      "直径": ["diameter", "od", "outer diameter", "size mm"],
      "适配": ["fit", "compatibility", "fits", "suitable for"]
    };

    // ===================== Reverse map: EN -> CN (for smarter search) =====================
    function buildReverseMap(dict) {
      const rev = new Map(); // enTerm -> Set(cnKeys)
      Object.entries(dict).forEach(([cnKey, enList]) => {
        (enList || []).forEach((en) => {
          const key = normalizeText(en);
          if (!key) return;
          if (!rev.has(key)) rev.set(key, new Set());
          rev.get(key).add(cnKey);
        });
      });
      return rev;
    }

    const REVERSE_MAP = buildReverseMap(SEARCH_SYNONYMS);

    function joinRowValues(row) {
      if (!row || typeof row !== 'object') return '';
      return Object.keys(row)
        .map((k) => row[k])
        .filter((v) => v != null && String(v).trim() !== '')
        .map((v) => String(v))
        .join(' ');
    }

    /** Flatten variantTable / variantTables / sizeTable rows (diameter, mm, etc.) for search. */
    function flattenVariantTableLike(vt) {
      if (!vt || typeof vt !== 'object') return '';
      if (!Array.isArray(vt.rows)) return '';
      return vt.rows.map((row) => joinRowValues(row)).filter(Boolean).join(' ');
    }

    /** Flatten specs / multilingual fields that were easy to miss in the haystack (subCategory vs subcategory, specs objects, etc.). */
    function flattenSpecsForSearch(product) {
      if (!product) return '';
      const parts = [];
      if (Array.isArray(product.specs)) parts.push(product.specs.join(' '));
      if (Array.isArray(product.specsEn)) parts.push(product.specsEn.join(' '));
      if (Array.isArray(product.specsJa)) parts.push(product.specsJa.join(' '));
      if (Array.isArray(product.specsKo)) parts.push(product.specsKo.join(' '));
      if (product.specsZh && typeof product.specsZh === 'object' && !Array.isArray(product.specsZh)) {
        parts.push(...Object.values(product.specsZh).map((v) => (v == null ? '' : String(v))));
      }
      if (product.specsEn && typeof product.specsEn === 'object' && !Array.isArray(product.specsEn)) {
        parts.push(...Object.values(product.specsEn).map((v) => (v == null ? '' : String(v))));
      }
      if (product.variantTable && typeof product.variantTable === 'object') {
        parts.push(flattenVariantTableLike(product.variantTable));
      }
      if (Array.isArray(product.variantTables)) {
        product.variantTables.forEach((vt) => parts.push(flattenVariantTableLike(vt)));
      }
      if (Array.isArray(product.sizeTable)) {
        product.sizeTable.forEach((row) => parts.push(joinRowValues(row)));
      }
      if (Array.isArray(product.variants)) {
        product.variants.forEach((v) => {
          if (v && typeof v === 'object') parts.push(joinRowValues(v));
        });
      }
      if (product.remarksZh) parts.push(String(product.remarksZh));
      if (product.remarksEn) parts.push(String(product.remarksEn));
      return parts.filter(Boolean).join(' ');
    }

    /**
     * Derived, search-only text for grip / pole / clamp / diameter queries.
     * Does not mutate the product; only adds cross-language tokens when the product already looks hardware-related.
     */
    function getGripSearchText(product) {
      if (!product) return '';
      const pid = Number(product.id);
      const isSpriteTentAccessoryRow = Number.isFinite(pid) && pid >= 9001 && pid <= 9024;

      const explicit = [
        product.grip, product.grips, product.accessoryGrip, product.poleDiameter,
        product.innerDiameter, product.tubeDiameter, product.outerDiameter,
        product.compatibility, product.fit, product.holder, product.slot
      ].filter((v) => v != null && String(v).trim() !== '').map((v) => String(v));

      const tagStr = Array.isArray(product.tags) ? product.tags.join(' ') : (product.tags || '');
      const kwStr = Array.isArray(product.keywords) ? product.keywords.join(' ') : (product.keywords || '');
      const skStr = Array.isArray(product.searchableKeywords)
        ? product.searchableKeywords.join(' ')
        : (product.searchableKeywords ? String(product.searchableKeywords) : '');

      const core = [
        product.name, product.nameZh, product.nameEn,
        product.description, product.descriptionZh, product.descriptionEn,
        product.short, product.shortZh, product.shortEn,
        tagStr, kwStr, skStr,
        flattenSpecsForSearch(product)
      ].filter(Boolean).join(' ');

      const GRIP_SYNONYM_EN = 'grip pole grip clamp holder diameter inner diameter pole diameter tube fit compatibility connector';
      const GRIP_SYNONYM_ZH = '夹具 夹 直径 内径 管径 适配 卡扣 卡箍 管 连接件 帐篷配件';

      if (isSpriteTentAccessoryRow) {
        return explicit.concat([
          GRIP_SYNONYM_EN,
          '24-grip tent accessories catalog sprite embedded accessories',
          GRIP_SYNONYM_ZH
        ]).join(' ');
      }

      const hasGripContext = explicit.length > 0
        || /\b(grip|grips|clamp|holder|diameter|inner|outer|tube|pole|fit|mm|compatible|connector|hex)\b/i.test(core)
        || /夹|直径|管径|内径|适配|卡扣|卡箍|夹具|六棱|六角|棱角|管|连接/.test(core);

      if (!hasGripContext) return '';

      return explicit.concat([GRIP_SYNONYM_EN, GRIP_SYNONYM_ZH]).join(' ');
    }

    // 统一把产品对象变成可搜索的“大文本”
    // 兼容不同字段命名（name/title/category/tags/desc 等）
    function buildProductHaystack(product) {
      const parts = [];

      // 常见字段（含多语言与 subcategory 别名）
      const candidates = [
        product.name,
        product.title,
        product.nameZh,
        product.nameEn,
        product.model,
        product.sku,
        product.category,
        product.subcategory,
        product.subCategory,
        product.sub_category,
        product.type,
        product.material,
        product.size,
        product.description,
        product.descriptionZh,
        product.descriptionEn,
        product.shortDesc,
        product.short,
        product.shortZh,
        product.shortEn,
        product.detail,
        product.remarksZh,
        product.remarksEn,
      ];

      candidates.forEach(v => {
        if (v) parts.push(v);
      });

      // tags 可能是数组/字符串
      if (Array.isArray(product.tags)) parts.push(product.tags.join(" "));
      else if (product.tags) parts.push(product.tags);

      // 有些项目用 keywords / searchableKeywords
      if (Array.isArray(product.keywords)) parts.push(product.keywords.join(" "));
      else if (product.keywords) parts.push(product.keywords);

      if (Array.isArray(product.searchableKeywords)) parts.push(product.searchableKeywords.join(' '));
      else if (product.searchableKeywords) parts.push(String(product.searchableKeywords));

      const specsFlat = flattenSpecsForSearch(product);
      if (specsFlat) parts.push(specsFlat);

      // 把整个对象（兜底）也序列化一点点（避免漏字段）
      // 注意：不会太大，一般产品对象很小
      try {
        parts.push(JSON.stringify(product));
      } catch (e) {}

      const gripDerived = getGripSearchText(product);
      if (gripDerived) parts.push(gripDerived);

      return {
        haystack: normalizeText(parts.filter(Boolean).join(" | ")),
        gripSearchText: gripDerived
      };
    }

    // 根据产品英文内容，自动“补充”可能相关的中文关键词（虚拟CN tags）
    function inferChineseTagsFromEnglish(haystack) {
      const cnSet = new Set();

      // 规则：只要英文 haystack 里包含某个英文同义词，就补上对应中文关键词
      for (const [enTerm, cnKeys] of REVERSE_MAP.entries()) {
        if (enTerm && haystack.includes(enTerm)) {
          cnKeys.forEach(k => cnSet.add(k));
        }
      }

      return Array.from(cnSet);
    }

    // 给产品加上增强字段：_haystack / _gripSearchText / _cnTags
    function enrichProductsForSearch(products) {
      return (products || []).map(p => {
        const built = buildProductHaystack(p);
        const haystack = built.haystack;
        const cnTags = inferChineseTagsFromEnglish(haystack);

        return {
          ...p,
          _haystack: haystack,
          _gripSearchText: built.gripSearchText || '',
          _cnTags: cnTags,                 // ✅ 虚拟中文标签（用于搜索/展示）
          _cnTagsText: normalizeText(cnTags.join(" ")),
        };
      });
    }

    // 把字符串标准化：小写、去多余空格
    function normalizeText(s) {
      return (s || "")
        .toString()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    }

    function expandQueryTerms(rawQuery) {
      const raw = (rawQuery || "").toString().trim();
      const q = normalizeText(raw);
      if (!q) return [];

      const terms = new Set();

      // ① 英文/数字：按空格拆
      q.split(" ").filter(Boolean).forEach(t => terms.add(t));

      // ② 中文：不需要空格，包含就扩展
      Object.keys(SEARCH_SYNONYMS).forEach((cnKey) => {
        if (raw.includes(cnKey)) {
          terms.add(normalizeText(cnKey));
          SEARCH_SYNONYMS[cnKey].forEach((en) => terms.add(normalizeText(en)));
        }
      });

      // ③ 如果用户直接输入英文（如 "seg lightbox"），也把整句加入（提升命中）
      terms.add(q);

      return Array.from(terms).filter(Boolean);
    }
    /** Tent accessory sprite SKUs (9001–9024): shown only in the embedded grid (same as products-accessories.html), not as separate ap-cards. */
    function isSpriteTentAccessory(p) {
        if (!p) return false;
        const id = Number(p.id);
        return Number.isFinite(id) && id >= 9001 && id <= 9024;
    }

    /** Collapse table/chair/stool/sanitation + DOME 3 SKUs into two type-hub cards (same brochure hero as type pages). */
    const AP_CATALOG_GROUP_SUB_FURNITURE = 'table-chair-stool-toilet';
    const AP_CATALOG_GROUP_SUB_DOME = 'dome-3-folders';
    const AP_CATALOG_GROUP_FURNITURE_HERO_REL =
        'images/products/furniture/chair table/folding-table-and-chair-set-event-furniture-hero.png';
    const AP_CATALOG_GROUP_DOME_HERO_REL = 'images/广西伟群帐篷制造有限公司2025allpagepng/17.png';

    function getApProductSubSlug(p) {
        if (!p || p._isApGroupedHub) return '';
        return String(p.subcategory || p.subCategory || p.sub_category || '').trim().toLowerCase();
    }

    function collapseApCatalogGroupHubs(items) {
        const furnitureHits = [];
        const domeHits = [];
        const rest = [];
        (items || []).forEach((p) => {
            const sub = getApProductSubSlug(p);
            if (sub === AP_CATALOG_GROUP_SUB_FURNITURE) furnitureHits.push(p);
            else if (sub === AP_CATALOG_GROUP_SUB_DOME) domeHits.push(p);
            else rest.push(p);
        });
        const out = [...rest];
        if (furnitureHits.length) {
            out.push({
                _isApGroupedHub: true,
                _hubKind: 'furniture',
                id: 'wk-ap-hub-furniture',
                category: 'furniture'
            });
        }
        if (domeHits.length) {
            out.push({
                _isApGroupedHub: true,
                _hubKind: 'dome',
                id: 'wk-ap-hub-dome',
                category: 'tents'
            });
        }
        return out;
    }

    function buildApGroupedHubCardHtml(p) {
        const isFurniture = p && p._hubKind === 'furniture';
        const path = isFurniture ? '/furniture-type.html?type=table-chair-stool-toilet' : '/dome-type.html';
        const browseUrl = apLocalizedPageHref(path);
        const titleKey = isFurniture ? 'menu_table_chair_stool_toilet' : 'menu_dome_3_folders';
        const introKey = isFurniture ? 'view_type_intro_furniture' : 'view_type_intro_dome';
        const dataCat = isFurniture ? 'furniture' : 'tents';
        const quoteParam = encodeURIComponent(isFurniture ? 'Tables-Chairs-Stools-Sanitation' : 'DOME-3-Folding-Series');
        const quoteUrl = apLocalizedPageHref(`/contact-us.html?product=${quoteParam}`) + '#getQuoteForm';

        let imgSrc = isFurniture ? AP_CATALOG_GROUP_FURNITURE_HERO_REL : AP_CATALOG_GROUP_DOME_HERO_REL;
        if (typeof window.wkRootAssetUrl === 'function') imgSrc = window.wkRootAssetUrl(imgSrc);

        return `
                <article class="ap-card ap-card--grouped-hub" data-cat="${dataCat}" data-ap-hub="${p._hubKind}">
                    <div class="ap-img"><img src="${safeText(imgSrc)}" alt="" loading="lazy" onerror="this.src='/images/placeholder.png'"></div>
                    <div class="ap-body">
                        <h3><span class="zh" data-translate="${titleKey}"></span><span class="en" data-translate="${titleKey}"></span></h3>
                        <p class="ap-meta ap-meta--hub-desc" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden;">
                            <span class="zh" data-translate="${introKey}"></span><span class="en" data-translate="${introKey}"></span>
                        </p>
                        <div class="ap-specs">
                            <span class="spec-tag" data-translate="spec_customizable"></span>
                        </div>
                        <div class="ap-actions">
                            <a class="btn btn-primary product-btn" href="${safeText(quoteUrl)}" data-translate="btn_get_quote"></a>
                            <a class="btn btn-secondary product-type-btn" href="${safeText(browseUrl)}" data-translate="view_type_button"></a>
                        </div>
                    </div>
                </article>
            `;
    }

    // 判断一个产品是否命中（任意一个 term 出现在任意字段里）
    function productMatches(product, rawQuery) {
      const terms = expandQueryTerms(rawQuery);
      if (terms.length === 0) return true;

      // ✅ 用增强后的字段（英文+中文虚拟tag一起搜）
      const haystack = normalizeText(
        [product._haystack, product._cnTagsText].filter(Boolean).join(" | ")
      );

      return terms.some(t => t && haystack.includes(normalizeText(t)));
    }
    let allProductsAccessoriesSectionEl = null;

    function ensureAllProductsAccessoriesSection() {
        if (allProductsAccessoriesSectionEl) return allProductsAccessoriesSectionEl;
        const section = document.createElement('section');
        section.id = 'allProductsAccessoriesSection';
        section.className = 'ap-accessories-embed';
        section.setAttribute('aria-label', 'Tent accessories catalog');
        section.innerHTML = `
            <h2 class="ap-accessories-embed__title" data-translate="tents_hub_accessories_title">Tent Accessories</h2>
            <p class="wk-disclaimer ap-accessories-embed__intro" style="margin: 0 0 0.75rem; font-size: 0.95rem;">
                <span class="zh">以下帐篷配件与「配件专题页」相同：24 格画册裁切、查看详情与加入询价清单。</span>
                <span class="en">Same 24-grip tent accessories as the dedicated page — sprite crops, details, and RFQ cart.</span>
            </p>
            <div id="allProductsAccessoriesGrid"></div>
            <p style="margin-top: 12px;">
                <a class="btn btn-secondary" href="${apLocalizedPageHref('/products-accessories.html')}" data-translate="accessories_open_full_page">Open full accessories page</a>
            </p>
        `;
        if (grid && grid.parentNode && emptyState) {
            grid.parentNode.insertBefore(section, emptyState);
        }
        allProductsAccessoriesSectionEl = section;
        return section;
    }

    function updateAllProductsAccessoriesEmbed(show, filterQuery) {
        const section = ensureAllProductsAccessoriesSection();
        section.style.display = show ? 'block' : 'none';
        if (!show) return;
        if (typeof window.WK_mountAccessoriesGrid === 'function') {
            window.WK_mountAccessoriesGrid('allProductsAccessoriesGrid', { search: false, filterQuery: filterQuery || '' });
        }
    }

    // 渲染产品列表
    function render(list, embedOpts) {
        embedOpts = embedOpts || {};
        const showAccEmbed = !!embedOpts.showAccessoriesEmbed;
        const hasItems = !!(list && list.length);
        const filterActive = embedOpts.activeFilter === true;

        grid.style.display = hasItems ? 'grid' : 'none';
        const showEmpty = !hasItems && !showAccEmbed && filterActive;
        if (emptyState) {
            emptyState.classList.toggle('is-visible', showEmpty);
            if (showEmpty) {
                emptyState.removeAttribute('hidden');
                emptyState.setAttribute('aria-hidden', 'false');
            } else {
                emptyState.setAttribute('hidden', '');
                emptyState.setAttribute('aria-hidden', 'true');
            }
        }

        if (!hasItems) {
            grid.innerHTML = '';
        } else {
            grid.innerHTML = list.map(p => {
            if (p && p._isApGroupedHub) {
                return buildApGroupedHubCardHtml(p);
            }
            const name = getProductName(p);
            const resolved = (window.WK_getProductCardImage && typeof window.WK_getProductCardImage === 'function')
                ? window.WK_getProductCardImage(p)
                : '';

            let imgSrc = resolved || p.image || 'images/placeholder.png';
            if (imgSrc && !imgSrc.startsWith('images/') && !imgSrc.startsWith('/') && !imgSrc.startsWith('./')) imgSrc = 'images/' + imgSrc;
            if (typeof window.wkRootAssetUrl === 'function') imgSrc = window.wkRootAssetUrl(imgSrc);

            let spriteSrc = p.image || '';
            if (spriteSrc && !spriteSrc.startsWith('images/') && !spriteSrc.startsWith('/') && !spriteSrc.startsWith('./')) spriteSrc = 'images/' + spriteSrc;
            if (typeof window.wkRootAssetUrl === 'function') spriteSrc = window.wkRootAssetUrl(spriteSrc);
            const model = p.model || '';
            const tags = p.tags || '';
            // 构建询价链接，带上产品信息参数
            const productParam = encodeURIComponent(model || name || p.id);
            const quoteUrl = apLocalizedPageHref(`/contact-us.html?product=${productParam}`) + '#getQuoteForm';
            // Primary browse: type hub (*-type.html) when available; otherwise unified PDP.
            const preferredSku = getPreferredSku(p);
            const typeUrlRaw = (typeof window.WK_getProductTypePageUrl === 'function')
                ? window.WK_getProductTypePageUrl(p)
                : '';
            const typeUrl = typeUrlRaw ? apLocalizedPageHref(typeUrlRaw) : '';
            const detailUrl = preferredSku
                ? buildUnifiedDetailUrlFromSku(preferredSku)
                : apLocalizedPageHref(`/all-products.html?cat=${encodeURIComponent(p.category || 'all')}`);
            const browseUrl = typeUrl || detailUrl;
            const browseTranslate = typeUrl ? 'view_type_button' : 'view_details';
            const browseClass = typeUrl ? 'btn btn-secondary product-type-btn' : 'btn btn-secondary product-details-btn';
            
            // 提取规格信息（从 tags 或 category 推断）
            const specs = [];
            if (p.category === 'flags') {
                specs.push('<span class="spec-tag" data-translate="spec_sizes_sml"></span>');
                specs.push('<span class="spec-tag" data-translate="spec_print_single_double"></span>');
                specs.push('<span class="spec-tag" data-translate="spec_base_options"></span>');
            } else if (p.category === 'tents') {
                // Prefer exact size/weight info from dataset (30/40/50 stock tents)
                const sizes = [];
                const weights = [];
                if (Array.isArray(p.variants) && p.variants.length) {
                    p.variants.forEach(v => {
                        if (v && v.size) sizes.push(v.size);
                        if (v && v.weight) weights.push(v.weight);
                    });
                } else if (Array.isArray(p.sizeTable) && p.sizeTable.length) {
                    p.sizeTable.forEach(v => {
                        if (v && v.size) sizes.push(v.size);
                        if (v && v.weight) weights.push(v.weight);
                    });
                }
                const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));
                const uniqSizes = uniq(sizes);
                const uniqWeights = uniq(weights);

                if (uniqSizes.length) {
                    const shortSizes = uniqSizes.slice(0, 4).join(' / ') + (uniqSizes.length > 4 ? ' …' : '');
                    specs.push(`<span class="spec-tag">${safeText((window.multiLang && typeof window.multiLang.t === 'function') ? window.multiLang.t('spec_sizes_prefix') : 'Sizes:')} ${safeText(shortSizes)}</span>`);
                }
                if (uniqWeights.length) {
                    const shortWeights = uniqWeights.slice(0, 4).join(' / ') + (uniqWeights.length > 4 ? ' …' : '');
                    specs.push(`<span class="spec-tag">${safeText((window.multiLang && typeof window.multiLang.t === 'function') ? window.multiLang.t('spec_weight_prefix') : 'Weight:')} ${safeText(shortWeights)}</span>`);
                }
                if (!uniqSizes.length && !uniqWeights.length) {
                    specs.push('<span class="spec-tag" data-translate="spec_sizes_default"></span>');
                }
                // Surface-level defaults for the rest
                specs.push('<span class="spec-tag" data-translate="spec_custom_print"></span>');
            } else if (p.category === 'displays') {
                const lang = getCurrentLang();
                const lines = (typeof window.WK_getProductCardSpecs === 'function')
                    ? window.WK_getProductCardSpecs(p, lang)
                    : [];
                if (lines.length) {
                    lines.forEach((line) => {
                        specs.push(`<span class="spec-tag">${safeText(line)}</span>`);
                    });
                }
                if (!specs.length) {
                    specs.push('<span class="spec-tag" data-translate="spec_customizable"></span>');
                }
            } else {
                specs.push('<span class="spec-tag" data-translate="spec_customizable"></span>');
            }

            // image area: if product.grid present, use sprite-thumb div to crop from sprite
            let imgHtml = '';
            const canUseSprite = (p.grid && p.grid.row && p.grid.col && spriteSrc && imgSrc === spriteSrc);
            if (canUseSprite) {
                const r = Number(p.grid.row);
                const c = Number(p.grid.col);
                const x = (c - 1) * 33.333333;
                const y = (r - 1) * 20;
                imgHtml = `<div class="ap-img"><div class="sprite-thumb" style="background-image:url('${imgSrc}');background-position:${x}% ${y}%;background-size:400% 600%;"></div></div>`;
            } else {
                imgHtml = `<div class="ap-img"><img src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.src='/images/placeholder.png'"></div>`;
            }

            return `
                <article class="ap-card" data-cat="${p.category}" data-sku="${safeText(preferredSku)}">
                    ${imgHtml}
                    <div class="ap-body">
                        <h3>${name}</h3>
                        <p class="ap-meta">${model} ${tags ? '· ' + tags : ''}</p>
                        <div class="ap-specs">
                            ${specs.join('')}
                        </div>
                        <div class="ap-actions">
                            <a class="btn btn-primary product-btn" href="${quoteUrl}" data-translate="btn_get_quote"></a>
                            <a class="${browseClass}" href="${browseUrl}" data-sku="${safeText(preferredSku)}" data-translate="${browseTranslate}"></a>
                        </div>
                    </div>
                </article>
            `;
            }).join('');

            // Ensure newly created translatable nodes are translated
            if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                window.multiLang.translatePage();
            }
        }

        updateAllProductsAccessoriesEmbed(showAccEmbed, embedOpts.accessoryFilterQuery || '');

        // Tent Types section (tents category only)
        updateTentSubcategoriesSection();

        // Keep tents details section below the product grid (only for tents category)
        updateTentsDetailsSection();

        // Translate any newly injected nodes
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    }

    function ensureTentsDetailsContainer() {
        if (tentsDetailsEl) return tentsDetailsEl;
        tentsDetailsEl = document.createElement('section');
        tentsDetailsEl.id = 'tentsDetails';
        tentsDetailsEl.className = 'tents-details';
        tentsDetailsEl.style.display = 'none';
        // Insert right after the grid so the main products remain first
        if (grid && grid.parentElement) {
            grid.parentElement.insertBefore(tentsDetailsEl, emptyState || null);
        }
        return tentsDetailsEl;
    }

    function updateTentsDetailsSection() {
        const cat = (catSelect && catSelect.value) || 'all';
        const container = ensureTentsDetailsContainer();

        if (cat !== 'tents') {
            container.style.display = 'none';
            return;
        }

        const details = window.TENTS_DETAILS;
        const images = details && Array.isArray(details.images) ? details.images : [];
        if (!images.length) {
            container.style.display = 'none';
            return;
        }

        container.style.display = '';
        container.innerHTML = `
            <div class="tents-details__head">
                <h2 data-translate="tents_details_title">Tents Details</h2>
                <p data-translate="tents_details_subtitle">Fabric details and size references from the catalog.</p>
            </div>
            <div class="tents-details__grid">
                ${images.map((img) => {
                    const src = img.src;
                    const key = img.captionKey;
                    return `
                        <figure class="tents-details__card">
                            <img class="tents-details__img" src="${src}" alt="" loading="lazy" onerror="this.style.display='none'">
                            <figcaption class="tents-details__cap" data-translate="${key}"></figcaption>
                        </figure>
                    `;
                }).join('')}
            </div>
        `;
    }

    function ensureTentSubcategoriesContainer() {
        if (tentSubcategoriesEl) return tentSubcategoriesEl;
        tentSubcategoriesEl = document.createElement('section');
        tentSubcategoriesEl.id = 'tentSubcategories';
        tentSubcategoriesEl.className = 'tent-types';
        tentSubcategoriesEl.style.display = 'none';

        // Insert after the product grid so products remain first
        if (grid && grid.parentElement) {
            grid.parentElement.insertBefore(tentSubcategoriesEl, emptyState || null);
        }
        return tentSubcategoriesEl;
    }

    function inferTentType(product) {
        // Stable ID mapping for folding tent series (no dataset mutation)
        if (product && (product.id === 2001 || product.id === '2001')) return 'folding30';
        if (product && (product.id === 2002 || product.id === '2002')) return 'folding40';
        if (product && (product.id === 2003 || product.id === '2003')) return 'folding50';

        const parts = [
            product.name,
            product.nameEn,
            product.model,
            product.image,
            Array.isArray(product.gallery) ? product.gallery.join(' ') : '',
            Array.isArray(product.tags) ? product.tags.join(' ') : product.tags,
            Array.isArray(product.keywords) ? product.keywords.join(' ') : ''
        ].filter(Boolean).join(' ').toLowerCase();

        // Temporary mapping only (no dataset changes): infer by name/model/tags
        if (parts.includes('wk-t30') || parts.includes('30方管') || parts.includes('30 square')) return 'folding30';
        if (parts.includes('wk-t40') || parts.includes('40六角') || parts.includes('40 hex')) return 'folding40';
        if (parts.includes('wk-t50') || parts.includes('50六角') || parts.includes('50 hex')) return 'folding50';
        if (parts.includes('star tent') || parts.includes('星')) return 'star';
        if (parts.includes('awning') || parts.includes('天幕')) return 'awning';
        if (parts.includes('six-sided') || parts.includes('six sided') || parts.includes('six_sided') || parts.includes('六边')) return 'six_sided';
        return '';
    }

    function updateTentSubcategoriesSection() {
        const cat = (catSelect && catSelect.value) || 'all';
        const container = ensureTentSubcategoriesContainer();

        if (cat !== 'tents') {
            container.style.display = 'none';
            return;
        }

        const data = window.TENT_TYPES;
        if (!data || typeof data !== 'object') {
            container.style.display = 'none';
            return;
        }

        const type = getQueryTentType();
        const folding = Array.isArray(data.folding) ? data.folding : [];
        const event = Array.isArray(data.event) ? data.event : [];
        const inflatableAll = Array.isArray(data.inflatable) ? data.inflatable : [];
        const inflatable = inflatableAll.find((x) => x && x.type === 'inflatable')
            ? [inflatableAll.find((x) => x && x.type === 'inflatable')]
            : inflatableAll;

        const lang = getCurrentLang();
        const getTitle = (item) => {
            if (typeof window.WK_productDisplayName === 'function') {
                return window.WK_productDisplayName({
                    name: '',
                    nameZh: item.nameZh,
                    nameEn: item.nameEn,
                    shortZh: item.descriptionZh,
                    model: item.model
                }, lang);
            }
            return lang === 'zh' ? (item.nameZh || item.nameEn || '') : (item.nameEn || item.nameZh || '');
        };
        const getDesc = (item) => (lang === 'zh' ? (item.descriptionZh || '') : (item.descriptionEn || ''));

        const renderCards = (items) => (items || []).map((item) => {
            const urlType = item.type;
            const href = apLocalizedPageHref(`/all-products.html?cat=tents&type=${encodeURIComponent(urlType)}`);
            const title = getTitle(item);
            const desc = getDesc(item);
            const active = type && type === urlType;
            const heroImg =
                item.heroImage && typeof window.wkRootAssetUrl === 'function'
                    ? window.wkRootAssetUrl(item.heroImage)
                    : item.heroImage;

            return `
                <a class="tent-type-card${active ? ' is-active' : ''}" href="${href}">
                    <div class="tent-type-card__imgWrap">
                        <img class="tent-type-card__img" src="${heroImg}" alt="" loading="lazy" onerror="this.style.display='none'" />
                    </div>
                    <div class="tent-type-card__body">
                        <div class="tent-type-card__title">${title}</div>
                        ${desc ? `<div class=\"tent-type-card__desc\">${String(desc).replace(/\n/g, '<br>')}</div>` : ''}
                        <div class="tent-type-card__cta">
                            <span class="btn btn-secondary" data-translate="view_type_button">View Type</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        container.style.display = '';
        container.innerHTML = `
            <div class="tents-hub__section">
                <h2 class="tents-hub__title" data-translate="tents_hub_folding_title">Folding Tents</h2>
                <div class="tent-types__grid">${renderCards(folding)}</div>
            </div>
            <div class="tents-hub__section">
                <h2 class="tents-hub__title" data-translate="tents_hub_event_title">Event Tents</h2>
                <div class="tent-types__grid">${renderCards(event)}</div>
            </div>
            <div class="tents-hub__section">
                <h2 class="tents-hub__title" data-translate="tents_hub_inflatable_title">Inflatable Tents</h2>
                <div class="tent-types__grid">${renderCards(inflatable)}</div>
            </div>
        `;
    }

    // 筛选和渲染
    function filterAndRender() {
        const q = (searchInput.value || '').trim();
        const cat = catSelect.value;
        const tag = getQueryTag(); // 获取 URL 中的 tag 参数
        const tentType = getQueryTentType();
        const sub = getQuerySub(cat);

        // Keep URL in sync with current interactive state
        let subForUrl = null;
        if (cat && cat !== 'all') {
            if (cat === 'tents') {
                if (sub && String(sub).toLowerCase() === 'dome-3-folders') subForUrl = 'dome-3-folders';
            } else {
                subForUrl = sub || null;
            }
        }
        setQueryParams({
            cat: cat,
            q: q,
            // type only makes sense under tents
            type: (cat === 'tents') ? (tentType || null) : null,
            sub: subForUrl
        });

        updateHeadingAndBreadcrumb(cat);
        updateCategorySeo(cat);
        updateApContextBanner(cat);

        try {
            sessionStorage.setItem('wk_last_listing', window.location.pathname + window.location.search);
        } catch (e) {
            // ignore
        }

        const typeNotice = ensureTentTypeNotice();
        typeNotice.style.display = 'none';

        const filteredWithType = products.filter(p => {
            // Flag "type hub" parent SKUs are the only rows in category `flags`. Show them for cat=flags,
            // and for cat=all (full catalog union). For any other category, only surface via search match.
            if (p.subcategory === 'flag-type-hub') {
                const c = String(cat || '').toLowerCase();
                if (c !== 'flags' && c !== 'all') {
                    if (!q || !productMatches(p, q)) return false;
                }
            }
            // 分类筛选
            const pCat = String(p.category || '').toLowerCase();
            const requestedCat = String(cat || '').toLowerCase();
            // Display Systems umbrella: when cat=displays, also include lightbox products.
            const hitCat = (requestedCat === 'all')
                || (pCat === requestedCat)
                || (requestedCat === 'displays' && pCat === 'lightbox');

            // tents 子类型筛选（仅当 cat=tents 且 URL 有 type）
            let hitType = true;
            if (cat === 'tents' && tentType) {
                hitType = inferTentType(p) === tentType;
            }

            // 标签筛选（用于 stock / replacement 等）
            let hitTag = true;
            if (tag) {
                const t = String(tag || '').toLowerCase();
                if (t === BEACH_FLAG_POLES_TAG) {
                    const pCat = String(p.category || '').toLowerCase();
                    hitTag = pCat === 'flags' && BEACH_FLAG_POLE_TYPES.has(String(p.type || '').trim());
                } else {
                    const productTags = Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '');
                    const productName = getProductName(p) || '';
                    const productModel = (p.model || '') || '';
                    const productType = (p.type || '') || '';
                    const productSub = (p.subcategory || p.subCategory || '') || '';
                    const searchText = `${productTags} ${productName} ${productModel} ${productType} ${productSub}`.toLowerCase();
                    hitTag = searchText.includes(t);
                }
            }

            // 搜索关键词筛选（支持中文→英文扩展）
            const hitQ = !q || productMatches(p, q);

            // 子类目筛选（非 tents：任意 sub；tents：仅支持 dome-3-folders 作为特例）
            let hitSub = true;
            if (sub) {
                const raw = String(p.subCategory || p.subcategory || p.sub_category || p.series || p.type || p.subType || p.line || p.collection || '').toLowerCase();
                const subL = String(sub).toLowerCase();
                if (cat === 'tents') {
                    if (subL === 'dome-3-folders') hitSub = raw === 'dome-3-folders';
                } else if (cat === 'displays' && subL === 'tension-fabric') {
                    hitSub = raw === 'tension-fabric' || raw === 'tfd-straight-line';
                } else {
                    hitSub = raw === subL;
                }
            }

            return hitCat && hitType && hitTag && hitQ && hitSub;
        });

        // If type filter yields no results, show a friendly notice + empty state (not blank)
        if (cat === 'tents' && tentType && filteredWithType.length === 0) {
            typeNotice.style.display = 'block';
        }

        const spriteAcc = filteredWithType.filter(isSpriteTentAccessory);
        const listForGrid = collapseApCatalogGroupHubs(
            filteredWithType.filter((p) => !isSpriteTentAccessory(p))
        );

        render(listForGrid, {
            showAccessoriesEmbed: spriteAcc.length > 0,
            accessoryFilterQuery: q,
            activeFilter: getActiveFilterState()
        });
    }

    /** Map legacy ?category=foo to ?cat=foo (then stripAccessoriesCatFromUrl can run on final shape). */
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
        } catch (e) {
            // ignore
        }
    }

    /** Legacy ?cat=accessories is merged into the full catalog (tent accessory SKUs stay category accessories but list with "all"). */
    function stripAccessoriesCatFromUrl() {
        try {
            const url = new URL(window.location.href);
            let changed = false;
            if (url.searchParams.get('cat') === 'accessories') {
                url.searchParams.delete('cat');
                changed = true;
            }
            if (url.searchParams.get('category') === 'accessories') {
                url.searchParams.delete('category');
                changed = true;
            }
            if (changed) {
                const next = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + url.hash;
                window.history.replaceState({}, '', next);
            }
        } catch (e) {
            // ignore
        }
    }

    // 初始化
    function initAllProducts() {
        normalizeLegacyCategoryQueryParam();
        stripAccessoriesCatFromUrl();

        if (catSelect) {
            const accOpt = catSelect.querySelector('option[value="accessories"]');
            if (accOpt) accOpt.remove();
        }

        products = enrichProductsForSearch(getProducts());
        
        if (products.length === 0) {
            console.warn('All Products: No products found. Check ProductManager initialization.');
            if (emptyState) {
                emptyState.classList.remove('is-visible');
                emptyState.setAttribute('hidden', '');
                emptyState.setAttribute('aria-hidden', 'true');
            }
            grid.innerHTML = '<p class="wk-disclaimer" data-translate="ap_no_catalog_data">Product catalog is loading or temporarily unavailable. Please refresh or contact us for a list.</p>';
            return;
        }
        
        // 1) URL cat 预选
        const catFromUrl = getQueryCat();
        const validCats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

        // Make sure heading/breadcrumb matches URL on load
        updateHeadingAndBreadcrumb((catFromUrl && validCats.includes(catFromUrl)) ? catFromUrl : 'all');

        // Ensure category <select> contains all categories present in data
        (function ensureCategoryOptions() {
            if (!catSelect) return;

            const labelMap = {
                tents: { en: 'Tents', zh: '帐篷' },
                flags: { en: 'Beach Flags', zh: '沙滩旗' },
                displays: { en: 'Display Systems', zh: '展示系统' },
                'advertising-arch': { en: 'Advertising Arch', zh: '广告拱门' },
                'water-filled-a-poster-stand': { en: 'Water Filled A Poster Stand', zh: '注水A字海报架' },
                accessories: { en: 'Accessories', zh: '配件' },
                custom: { en: 'Custom', zh: '定制' },
                racegate: { en: 'RaceGate', zh: '竞速拱门' },
                furniture: { en: 'Outdoor Furniture', zh: '户外家具' }
            };

            const lang = getCurrentLang();
            const existing = new Set(Array.from(catSelect.options).map(o => o.value));

            validCats.forEach((cat) => {
                if (!cat || existing.has(cat) || cat === 'accessories') return;
                const opt = document.createElement('option');
                opt.value = cat;
                const mapped = labelMap[cat];
                opt.textContent = mapped ? (lang === 'zh' ? mapped.zh : mapped.en) : cat;
                catSelect.appendChild(opt);
                existing.add(cat);
            });
        })();

        // Show notice if URL cat is invalid, but still render products (all categories)
        const notice = ensureInvalidCatNotice();
        const urlCatIsValid = (catFromUrl === 'all') || validCats.includes(catFromUrl);
        notice.style.display = (!urlCatIsValid && catFromUrl !== 'all') ? 'block' : 'none';

        // If URL cat is valid, prefer filtering by it.
        // If catSelect doesn't have that option, add it so filtering is deterministic.
        if (urlCatIsValid && catFromUrl !== 'all') {
            const hasOption = Array.from(catSelect.options).some(o => o.value === catFromUrl);
            if (!hasOption) {
                const opt = document.createElement('option');
                opt.value = catFromUrl;
                opt.textContent = catFromUrl;
                catSelect.appendChild(opt);
            }
            catSelect.value = catFromUrl;
        } else {
            catSelect.value = 'all';
        }

        // 2) URL q / tag 预填充搜索框
        const q = getQueryQ();
        const tag = getQueryTag();
        if (searchInput) {
            if (q) searchInput.value = q;
            else if (tag && String(tag).toLowerCase() !== BEACH_FLAG_POLES_TAG) searchInput.value = tag;
        }

        // 3) 首次渲染
        filterAndRender();
        
        // 3) 监听搜索输入
        searchInput.addEventListener('input', filterAndRender);

        // 4) 监听分类选择
        catSelect.addEventListener('change', filterAndRender);

        // 5) 监听语言切换事件（如果存在）
        document.addEventListener('languageChanged', () => {
            filterAndRender(); // 重新渲染以更新产品名称
            // Also re-translate the notice if needed
            if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                window.multiLang.translatePage();
            }
        });

        // Ensure notice gets translated on first load as well
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    }
    
    // DOM 加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // 等待 ProductManager 初始化（最多等待 2 秒）
            let attempts = 0;
            const checkProductManager = setInterval(() => {
                attempts++;
                if (window.productManager || attempts > 40) {
                    clearInterval(checkProductManager);
                    initAllProducts();
                }
            }, 50);
        });
    } else {
        // DOM 已加载，直接尝试初始化
        setTimeout(() => {
            initAllProducts();
        }, 100);
    }

    // 导出到全局（如果需要）
    window.allProductsFilter = {
        filterAndRender: filterAndRender,
        getQueryCat: getQueryCat
    };
})();

