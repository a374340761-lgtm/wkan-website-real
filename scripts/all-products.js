// All Products Page - Search & Filter Logic
(function() {
    'use strict';

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
                nameEn: 'Pop-up Display',
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

    // 获取 URL 参数中的分类
    function getQueryCat() {
        const url = new URL(window.location.href);
        return url.searchParams.get('cat') || 'all';
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
            accessories: 'menu_accessories',
            racegate: 'home_cat_racegate_title',
            custom: 'category_custom'
        };
        return map[cat] || null;
    }

    function updateHeadingAndBreadcrumb(cat) {
        const headingEl = document.getElementById('allProductsHeading');
        const crumbEl = document.getElementById('allProductsBreadcrumbCurrent');
        const t = (key) => (window.multiLang && typeof window.multiLang.t === 'function' ? window.multiLang.t(key) : key);

        if (!headingEl && !crumbEl) return;

        if (!cat || cat === 'all') {
            if (headingEl) headingEl.textContent = t('nav_all_products');
            if (crumbEl) crumbEl.textContent = t('nav_all_products');
            return;
        }

        const key = getCategoryLabelKey(cat);
        const label = key ? t(key) : cat;
        if (headingEl) headingEl.textContent = label;
        if (crumbEl) crumbEl.textContent = label;
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

    // 获取 URL 参数中的 q（搜索关键词）
    function getQueryQ() {
        const url = new URL(window.location.href);
        return url.searchParams.get('q') || '';
    }

    // 获取当前语言
    function getCurrentLang() {
        if (window.multiLang && window.multiLang.getCurrentLanguage) {
            return window.multiLang.getCurrentLanguage();
        }
        return document.documentElement.lang || 'en';
    }

    // 获取产品名称（根据当前语言）
    function getProductName(product) {
        const lang = getCurrentLang();
        if (lang === 'zh' && product.name) return product.name;
        if (lang === 'en' && product.nameEn) return product.nameEn;
        if (lang === 'ja' && product.nameJa) return product.nameJa;
        if (lang === 'ko' && product.nameKo) return product.nameKo;
        return product.name || product.nameEn || 'Product';
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
      "厂家": ["manufacturer", "factory", "direct factory", "oem", "odm"]
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

    // 统一把产品对象变成可搜索的“大文本”
    // 兼容不同字段命名（name/title/category/tags/desc 等）
    function buildProductHaystack(product) {
      const parts = [];

      // 常见字段
      const candidates = [
        product.name,
        product.title,
        product.model,
        product.sku,
        product.category,
        product.subCategory,
        product.type,
        product.material,
        product.size,
        product.description,
        product.shortDesc,
        product.detail,
      ];

      candidates.forEach(v => {
        if (v) parts.push(v);
      });

      // tags 可能是数组/字符串
      if (Array.isArray(product.tags)) parts.push(product.tags.join(" "));
      else if (product.tags) parts.push(product.tags);

      // 有些项目用 keywords
      if (Array.isArray(product.keywords)) parts.push(product.keywords.join(" "));
      else if (product.keywords) parts.push(product.keywords);

      // 把整个对象（兜底）也序列化一点点（避免漏字段）
      // 注意：不会太大，一般产品对象很小
      try {
        parts.push(JSON.stringify(product));
      } catch (e) {}

      return normalizeText(parts.filter(Boolean).join(" | "));
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

    // 给产品加上增强字段：_haystack / _cnTags
    function enrichProductsForSearch(products) {
      return (products || []).map(p => {
        const haystack = buildProductHaystack(p);
        const cnTags = inferChineseTagsFromEnglish(haystack);

        return {
          ...p,
          _haystack: haystack,
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
    // 渲染产品列表
    function render(list) {
        const hasItems = !!(list && list.length);

        grid.style.display = hasItems ? 'grid' : 'none';
        emptyState.style.display = hasItems ? 'none' : 'block';

        if (!hasItems) {
            grid.innerHTML = '';
        } else {
            grid.innerHTML = list.map(p => {
            const name = getProductName(p);
            const resolved = (window.WK_getProductCardImage && typeof window.WK_getProductCardImage === 'function')
                ? window.WK_getProductCardImage(p)
                : '';

            let imgSrc = resolved || p.image || 'images/placeholder.png';
            if (imgSrc && !imgSrc.startsWith('images/') && !imgSrc.startsWith('/') && !imgSrc.startsWith('./')) imgSrc = 'images/' + imgSrc;

            let spriteSrc = p.image || '';
            if (spriteSrc && !spriteSrc.startsWith('images/') && !spriteSrc.startsWith('/') && !spriteSrc.startsWith('./')) spriteSrc = 'images/' + spriteSrc;
            const model = p.model || '';
            const tags = p.tags || '';
            // 构建询价链接，带上产品信息参数
            const productParam = encodeURIComponent(model || name || p.id);
            const quoteUrl = `./index.html?product=${productParam}#contact`;
            // DETAIL ROUTING (trace)
            // Flow B (Browse Products / all-products.html cards) generates the “View details / 查看详情” link here.
            // Canonical route: product.html?id=...
            // Fallback: all-products.html?cat=...
            const detailUrl = p.id ? `product.html?id=${encodeURIComponent(p.id)}` : `all-products.html?cat=${encodeURIComponent(p.category || 'all')}`;
            
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
                specs.push('<span class="spec-tag" data-translate="spec_display_width"></span>');
                specs.push('<span class="spec-tag" data-translate="spec_display_height"></span>');
                specs.push('<span class="spec-tag" data-translate="spec_display_shapes"></span>');
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
                imgHtml = `<div class="ap-img"><div class="sprite-thumb" style="background-image:url('${imgSrc}');background-position:${x}% ${y}%;height:180px;border-radius:12px;background-size:400% 600%;"></div></div>`;
            } else {
                imgHtml = `<div class="ap-img"><img src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.src='images/placeholder.png'"></div>`;
            }

            return `
                <article class="ap-card" data-cat="${p.category}">
                    ${imgHtml}
                    <div class="ap-body">
                        <h3>${name}</h3>
                        <p class="ap-meta">${model} ${tags ? '· ' + tags : ''}</p>
                        <div class="product-specs" style="display: flex; flex-wrap: wrap; gap: 6px; margin: 0.75rem 0;">
                            ${specs.join('')}
                        </div>
                        <div class="product-actions" style="display: flex; gap: 10px; margin-top: 1rem;">
                            <a class="btn btn-primary product-btn" href="${quoteUrl}" style="flex: 1; text-align: center;" data-translate="btn_get_quote"></a>
                            <a class="btn btn-secondary product-details-btn" href="${detailUrl}" style="flex: 1; text-align: center;" data-translate="view_details"></a>
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
        const getTitle = (item) => (lang === 'zh' ? (item.nameZh || item.nameEn || '') : (item.nameEn || item.nameZh || ''));
        const getDesc = (item) => (lang === 'zh' ? (item.descriptionZh || '') : (item.descriptionEn || ''));

        const renderCards = (items) => (items || []).map((item) => {
            const urlType = item.type;
            const href = `all-products.html?cat=tents&type=${encodeURIComponent(urlType)}`;
            const title = getTitle(item);
            const desc = getDesc(item);
            const active = type && type === urlType;

            return `
                <a class="tent-type-card${active ? ' is-active' : ''}" href="${href}">
                    <div class="tent-type-card__imgWrap">
                        <img class="tent-type-card__img" src="${item.heroImage}" alt="" loading="lazy" onerror="this.style.display='none'" />
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

        // Keep URL in sync with current interactive state
        setQueryParams({
            cat: cat,
            q: q,
            // type only makes sense under tents
            type: (cat === 'tents') ? (tentType || null) : null
        });

        updateHeadingAndBreadcrumb(cat);

        const typeNotice = ensureTentTypeNotice();
        typeNotice.style.display = 'none';

        const filteredWithType = products.filter(p => {
            // 分类筛选
            const hitCat = (cat === 'all') || (p.category === cat);

            // tents 子类型筛选（仅当 cat=tents 且 URL 有 type）
            let hitType = true;
            if (cat === 'tents' && tentType) {
                hitType = inferTentType(p) === tentType;
            }

            // 标签筛选（用于 stock / replacement 等）
            let hitTag = true;
            if (tag) {
                const t = String(tag || '').toLowerCase();
                const productTags = Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '');
                const productName = getProductName(p) || '';
                const productModel = (p.model || '') || '';
                const productType = (p.type || '') || '';
                const productSub = (p.subcategory || p.subCategory || '') || '';
                const searchText = `${productTags} ${productName} ${productModel} ${productType} ${productSub}`.toLowerCase();
                hitTag = searchText.includes(t);
            }

            // 搜索关键词筛选（支持中文→英文扩展）
            const hitQ = !q || productMatches(p, q);

            return hitCat && hitType && hitTag && hitQ;
        });

        // If type filter yields no results, show a friendly notice + empty state (not blank)
        if (cat === 'tents' && tentType && filteredWithType.length === 0) {
            typeNotice.style.display = 'block';
        }

        render(filteredWithType);
    }

    // 初始化
    function initAllProducts() {
        products = enrichProductsForSearch(getProducts());
        
        if (products.length === 0) {
            console.warn('All Products: No products found. Check ProductManager initialization.');
            grid.innerHTML = '<div class="ap-empty"><p data-translate="products_no_results"></p></div>';
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
                displays: { en: 'Pop-up Display', zh: '快幕秀' },
                accessories: { en: 'Accessories', zh: '配件' },
                custom: { en: 'Custom', zh: '定制' },
                racegate: { en: 'Race Gate', zh: '竞速拱门' }
            };

            const lang = getCurrentLang();
            const existing = new Set(Array.from(catSelect.options).map(o => o.value));

            validCats.forEach((cat) => {
                if (!cat || existing.has(cat)) return;
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
            else if (tag) searchInput.value = tag;
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

