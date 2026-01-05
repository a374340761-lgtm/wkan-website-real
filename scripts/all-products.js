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

    if (!grid || !searchInput || !catSelect) {
        console.warn('All Products page elements not found');
        return;
    }

    // 获取 URL 参数中的分类
    function getQueryCat() {
        const url = new URL(window.location.href);
        return url.searchParams.get('cat') || 'all';
    }

    // 获取 URL 参数中的标签
    function getQueryTag() {
        const url = new URL(window.location.href);
        return url.searchParams.get('tag') || '';
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
        if (!list || list.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        grid.innerHTML = list.map(p => {
            const name = getProductName(p);
            let imgSrc = p.image || 'images/placeholder.jpg';
            if (imgSrc && !imgSrc.startsWith('images/') && !imgSrc.startsWith('/') && !imgSrc.startsWith('./')) imgSrc = 'images/' + imgSrc;
            const model = p.model || '';
            const tags = p.tags || '';
            // 构建询价链接，带上产品信息参数
            const productParam = encodeURIComponent(model || name || p.id);
            const quoteUrl = `./index.html?product=${productParam}#contact`;
            // 构建产品详情页链接（如果存在 product.html，否则用 all-products 页面）
            const detailUrl = p.id ? `./product.html?id=${p.id}` : `./all-products.html?cat=${p.category}`;
            
            // 提取规格信息（从 tags 或 category 推断）
            const specs = [];
            if (p.category === 'flags') {
                specs.push('<span class="spec-tag">Sizes: S / M / L</span>');
                specs.push('<span class="spec-tag">Print: Single / Double</span>');
                specs.push('<span class="spec-tag">Base Options</span>');
            } else if (p.category === 'tents') {
                specs.push('<span class="spec-tag">Sizes: 3×3m / 3×6m</span>');
                specs.push('<span class="spec-tag">Frame: Aluminum / Steel</span>');
                specs.push('<span class="spec-tag">Custom Print</span>');
            } else if (p.category === 'displays') {
                specs.push('<span class="spec-tag">Width: 3m / 4m / 5m</span>');
                specs.push('<span class="spec-tag">Height: 2.3m</span>');
                specs.push('<span class="spec-tag">Straight / Curved</span>');
            } else {
                specs.push('<span class="spec-tag">Customizable</span>');
            }

            // image area: if product.grid present, use sprite-thumb div to crop from sprite
            let imgHtml = '';
            if (p.grid && p.grid.row && p.grid.col && imgSrc) {
                const r = Number(p.grid.row);
                const c = Number(p.grid.col);
                const x = (c - 1) * 33.333333;
                const y = (r - 1) * 20;
                imgHtml = `<div class="ap-img"><div class="sprite-thumb" style="background-image:url('${imgSrc}');background-position:${x}% ${y}%;height:180px;border-radius:12px;background-size:400% 600%;"></div></div>`;
            } else {
                imgHtml = `<div class="ap-img"><img src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.src='images/placeholder.jpg'"></div>`;
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
                            <a class="btn btn-primary product-btn" href="${quoteUrl}" style="flex: 1; text-align: center;">
                                <span class="zh">获取报价</span>
                                <span class="en">Get a Quote</span>
                            </a>
                            <a class="btn btn-secondary product-btn" href="${detailUrl}" style="flex: 1; text-align: center;">
                                <span class="zh">查看详情</span>
                                <span class="en">View Details</span>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    // 筛选和渲染
    function filterAndRender() {
        const q = (searchInput.value || '').trim();
        const cat = catSelect.value;
        const tag = getQueryTag(); // 获取 URL 中的 tag 参数

        const filtered = products.filter(p => {
            // 分类筛选
            const hitCat = (cat === 'all') || (p.category === cat);

            // 标签筛选（用于 stock / replacement）
            let hitTag = true;
            if (tag) {
                const productTags = Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '');
                const productName = getProductName(p) || '';
                const productModel = (p.model || '') || '';
                const searchText = `${productTags} ${productName} ${productModel}`.toLowerCase();
                hitTag = searchText.includes(tag.toLowerCase());
            }

            // 搜索关键词筛选（支持中文→英文扩展）
            const hitQ = !q || productMatches(p, q);

            return hitCat && hitTag && hitQ;
        });

        render(filtered);
    }

    // 初始化
    function initAllProducts() {
        products = enrichProductsForSearch(getProducts());
        
        if (products.length === 0) {
            console.warn('All Products: No products found. Check ProductManager initialization.');
            grid.innerHTML = '<div class="ap-empty"><p data-translate="products_no_results">未找到匹配的产品</p></div>';
            return;
        }
        
        // 1) URL cat 预选
        const cat = getQueryCat();
        const validCats = ['tents', 'flags', 'displays', 'accessories', 'custom'];
        if (validCats.includes(cat)) {
            catSelect.value = cat;
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
        });
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

