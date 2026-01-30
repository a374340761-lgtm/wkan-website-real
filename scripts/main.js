// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollEffects();
    initBackToTop();
    initModals();
    initFormValidation();
    initAnimations();
    initHeroVideo();
    renderHeroSlides();
    initHeroCarouselSz();

    // New homepage redesign (safe no-op on other pages)
    initHomeRedesign();

    initSearch(); // ✅ Search overlay + redirect

    initCookieConsent();
});

// ------------------------------
// Cookie consent + customer cookie
// ------------------------------
const WK_COOKIE_CONSENT = 'wk_cookie_consent';
const WK_CUSTOMER_ID = 'wk_customer_id';

function wkSetCookie(name, value, days) {
    try {
        const maxAge = Math.max(0, Math.floor(days * 24 * 60 * 60));
        const encoded = encodeURIComponent(String(value ?? ''));
        document.cookie = `${encodeURIComponent(name)}=${encoded}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    } catch (e) {}
}

function wkGetCookie(name) {
    try {
        const target = `${encodeURIComponent(name)}=`;
        const parts = String(document.cookie || '').split(';');
        for (const part of parts) {
            const p = part.trim();
            if (p.startsWith(target)) return decodeURIComponent(p.slice(target.length));
        }
    } catch (e) {}
    return '';
}

function wkRandomId() {
    try {
        if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
            const bytes = new Uint8Array(16);
            window.crypto.getRandomValues(bytes);
            return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (e) {}
    return String(Date.now()) + Math.random().toString(16).slice(2);
}

function wkReadConsent() {
    const raw = wkGetCookie(WK_COOKIE_CONSENT);
    if (!raw) return null;
    try {
        const obj = JSON.parse(raw);
        if (!obj || typeof obj !== 'object') return null;
        return {
            necessary: true,
            preferences: !!obj.preferences,
            analytics: !!obj.analytics,
            ts: Number(obj.ts || 0)
        };
    } catch {
        return null;
    }
}

function wkWriteConsent(consent) {
    const payload = {
        preferences: !!(consent && consent.preferences),
        analytics: !!(consent && consent.analytics),
        ts: Date.now()
    };
    wkSetCookie(WK_COOKIE_CONSENT, JSON.stringify(payload), 365);
}

function wkEnsureCustomerIdCookie() {
    const existing = wkGetCookie(WK_CUSTOMER_ID);
    if (existing) return existing;
    const id = wkRandomId();
    wkSetCookie(WK_CUSTOMER_ID, id, 365);
    return id;
}

function wkMaybeTranslate() {
    // Multi-lang can load before or after main.js depending on page.
    const tryTranslate = () => {
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
            return true;
        }
        return false;
    };
    if (tryTranslate()) return;
    let tries = 0;
    const timer = setInterval(() => {
        tries += 1;
        if (tryTranslate() || tries > 80) clearInterval(timer);
    }, 50);
}

function initCookieConsent() {
    // Avoid duplicating UI
    if (document.getElementById('wkCookieBanner')) return;

    const existingConsent = wkReadConsent();
    if (existingConsent) {
        if (existingConsent.preferences) wkEnsureCustomerIdCookie();
        window.wkCookieConsent = {
            get: () => wkReadConsent() || { necessary: true, preferences: false, analytics: false, ts: 0 },
            open: () => {
                const modal = document.getElementById('wkCookieModal');
                if (modal) modal.classList.add('is-open');
            }
        };
        return;
    }

    // Banner
    const banner = document.createElement('div');
    banner.id = 'wkCookieBanner';
    banner.className = 'wk-cookie-banner';
    banner.innerHTML = `
        <div class="wk-cookie-banner__card" role="dialog" aria-modal="false">
            <div class="wk-cookie-banner__text" style="flex:1; min-width: 240px;">
                <div class="wk-cookie-banner__title" data-translate="cookie_title"></div>
                <div class="wk-cookie-banner__desc" data-translate="cookie_text"></div>
            </div>
            <div class="wk-cookie-banner__actions">
                <button type="button" class="btn btn-secondary" data-wk-cookie="reject" data-translate="cookie_reject_all"></button>
                <button type="button" class="btn btn-secondary" data-wk-cookie="customize" data-translate="cookie_customize"></button>
                <button type="button" class="btn btn-primary" data-wk-cookie="accept" data-translate="cookie_accept_all"></button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);

    // Modal
    const modal = document.createElement('div');
    modal.id = 'wkCookieModal';
    modal.className = 'wk-cookie-modal';
    modal.innerHTML = `
        <div class="wk-cookie-modal__panel" role="dialog" aria-modal="true">
            <div class="wk-cookie-modal__head">
                <div class="wk-cookie-modal__title" data-translate="cookie_settings_title"></div>
                <button type="button" class="btn btn-secondary" data-wk-cookie="close" data-translate="cookie_close"></button>
            </div>
            <div class="wk-cookie-modal__body">
                <div class="wk-cookie-row">
                    <div class="wk-cookie-row__label" data-translate="cookie_category_necessary"></div>
                    <input type="checkbox" checked disabled aria-hidden="true" />
                </div>
                <div class="wk-cookie-row">
                    <div class="wk-cookie-row__label" data-translate="cookie_category_preferences"></div>
                    <input id="wkCookiePref" type="checkbox" />
                </div>
                <div class="wk-cookie-row">
                    <div class="wk-cookie-row__label" data-translate="cookie_category_analytics"></div>
                    <input id="wkCookieAnalytics" type="checkbox" />
                </div>
            </div>
            <div class="wk-cookie-modal__foot">
                <button type="button" class="btn btn-primary" data-wk-cookie="save" data-translate="cookie_save"></button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => modal.classList.remove('is-open');
    const openModal = () => modal.classList.add('is-open');

    const setAndApply = (consent) => {
        wkWriteConsent(consent);
        if (consent && consent.preferences) wkEnsureCustomerIdCookie();
        banner.remove();
        closeModal();
        window.wkCookieConsent = {
            get: () => wkReadConsent() || { necessary: true, preferences: false, analytics: false, ts: 0 },
            open: openModal
        };
    };

    banner.querySelectorAll('[data-wk-cookie]').forEach((el) => {
        el.addEventListener('click', () => {
            const action = el.getAttribute('data-wk-cookie');
            if (action === 'accept') setAndApply({ necessary: true, preferences: true, analytics: true });
            if (action === 'reject') setAndApply({ necessary: true, preferences: false, analytics: false });
            if (action === 'customize') openModal();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modal.querySelectorAll('[data-wk-cookie]').forEach((el) => {
        el.addEventListener('click', () => {
            const action = el.getAttribute('data-wk-cookie');
            if (action === 'close') closeModal();
            if (action === 'save') {
                const preferences = !!document.getElementById('wkCookiePref')?.checked;
                const analytics = !!document.getElementById('wkCookieAnalytics')?.checked;
                setAndApply({ necessary: true, preferences, analytics });
            }
        });
    });

    window.wkCookieConsent = {
        get: () => wkReadConsent() || { necessary: true, preferences: false, analytics: false, ts: 0 },
        open: openModal
    };

    wkMaybeTranslate();
}

function initHomeRedesign() {
    // Safer homepage detection: run when the new homepage hooks exist.
    // This prevents accidental no-op if <body class="home"> is missing.
    const hasHomeHooks = !!document.getElementById('heroSlider');
    const isHome = (document.body && document.body.classList.contains('home')) || hasHomeHooks;
    if (!isHome) return;

    renderHomeHeroSlider();
    initHomeHeroSlider();

    renderHomeCategoryGrid();
    renderTrustedByWall();
    renderHomeResources();
    renderHomeBestSellers();

    // If multilang already exists (or appears later), ensure newly-injected nodes translate.
    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
    }
}

// Always-available image placeholder to avoid broken UI even if assets are missing.
const WK_PLACEHOLDER_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">'
        + '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">'
        + '<stop offset="0" stop-color="#f1f5f9"/>'
        + '<stop offset="1" stop-color="#e2e8f0"/>'
        + '</linearGradient></defs>'
        + '<rect width="1200" height="800" fill="url(#g)"/>'
        + '<rect x="120" y="120" width="960" height="560" rx="28" fill="#ffffff" opacity="0.55"/>'
        + '<path d="M420 510l110-140 120 150 90-90 160 190H420z" fill="#cbd5e1"/>'
        + '<circle cx="470" cy="350" r="46" fill="#cbd5e1"/>'
        + '</svg>'
    );

function getCurrentLangSafe() {
    try {
        if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
            return window.multiLang.getCurrentLanguage() || 'en';
        }
    } catch (e) {}
    return document.documentElement.lang || 'en';
}

function waitForProductManager(cb, tries = 0) {
    const pm = window.productManager;
    if (pm && Array.isArray(pm.products)) {
        cb(pm);
        return;
    }
    if (tries > 200) {
        cb(null);
        return;
    }
    setTimeout(() => waitForProductManager(cb, tries + 1), 50);
}

function getLocalizedField(product, baseKey) {
    const lang = (getCurrentLangSafe() || 'en').toLowerCase();
    const suffixMap = { zh: '', en: 'En', ja: 'Ja', ko: 'Ko' };
    const suffix = suffixMap[lang] ?? '';
    const localizedKey = suffix ? `${baseKey}${suffix}` : baseKey;
    return product && (product[localizedKey] || product[baseKey] || '');
}

function getCategoryTranslateKey(cat) {
    const map = {
        tents: 'category_tents',
        flags: 'category_flags',
        displays: 'category_displays',
        accessories: 'category_accessories',
        furniture: 'category_furniture',
        custom: 'category_custom',
        lightbox: 'category_lightbox',
        inflatable: 'category_inflatable'
    };
    return map[String(cat || '').trim()] || '';
}

// ------------------------------
// New Hero Slider (homepage)
// ------------------------------
function getHomeHeroSlides() {
    // Use real filenames from /images/hero (verified in repo)
    return [
        { image: 'images/hero/Waikwantentshero.png', keyPrefix: 'home_hero_1' },
        { image: 'images/hero/waikwanflagshero.png', keyPrefix: 'home_hero_2' },
        // Cache-bust to ensure the updated JPEG shows immediately.
        { image: 'images/hero/伟群快幕秀照片.jpeg?v=20260123', keyPrefix: 'home_hero_3', variant: 'light' }
    ];
}

function renderHomeHeroSlider() {
    const root = document.getElementById('heroSlider');
    if (!root) return;

    const slides = getHomeHeroSlides();
    root.innerHTML = '';

    slides.forEach((s, i) => {
        const slide = document.createElement('article');
        slide.className = 'wk-hero-slide' + (i === 0 ? ' is-active' : '');
        slide.setAttribute('data-index', String(i));
        // Use encodeURI so non-ASCII filenames (e.g. Chinese) work reliably in CSS url().
        const bgUrl = encodeURI(String(s.image || ''));
        if (String(s.variant || '').toLowerCase() === 'light') {
            slide.classList.add('wk-hero-slide--light');
        }
        slide.style.setProperty('--wk-hero-bg', `url("${bgUrl}")`);

        const titleKey = `${s.keyPrefix}_title`;
        const subtitleKey = `${s.keyPrefix}_subtitle`;
        const kickerKey = `${s.keyPrefix}_kicker`;

        slide.innerHTML = `
            <div class="wk-hero-bg" aria-hidden="true"></div>
            <div class="wk-hero-overlay" aria-hidden="true"></div>
            <div class="wk-hero-inner container">
                <div class="wk-hero-content">
                    <div class="wk-hero-kicker" data-translate="${kickerKey}"></div>
                    <h1 class="wk-hero-title" data-translate="${titleKey}"></h1>
                    <p class="wk-hero-sub" data-translate="${subtitleKey}"></p>
                    <div class="wk-hero-actions">
                        <a class="btn btn-primary" href="#contact" data-translate="home_hero_primary_cta"></a>
                        <a class="btn btn-secondary" href="product-center.html" data-translate="home_hero_secondary_cta"></a>
                    </div>
                </div>
            </div>
        `;

        // Also set the bg inline for maximum compatibility (avoids CSS var parsing issues).
        const bgEl = slide.querySelector('.wk-hero-bg');
        if (bgEl) bgEl.style.backgroundImage = `url("${bgUrl}")`;
        root.appendChild(slide);
    });

    // Build dots
    const dotsWrap = document.getElementById('heroDots');
    if (dotsWrap) {
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'wk-hero-dot' + (i === 0 ? ' is-active' : '');
            b.setAttribute('aria-label', `Slide ${i + 1}`);
            b.addEventListener('click', () => window.__wkHeroGoTo && window.__wkHeroGoTo(i, true));
            dotsWrap.appendChild(b);
        });
    }
}

function initHomeHeroSlider() {
    const root = document.getElementById('heroSlider');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.wk-hero-slide'));
    if (!slides.length) return;

    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const dotsWrap = document.getElementById('heroDots');

    let idx = slides.findIndex((s) => s.classList.contains('is-active'));
    if (idx < 0) idx = 0;

    const setActive = (i) => {
        slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
        if (dotsWrap) {
            Array.from(dotsWrap.children).forEach((d, k) => d.classList.toggle('is-active', k === i));
        }
    };

    let timer = null;
    const stop = () => {
        if (timer) window.clearInterval(timer);
        timer = null;
    };
    const start = () => {
        stop();
        timer = window.setInterval(() => goTo(idx + 1, false), 5000);
    };

    const goTo = (i, user = false) => {
        idx = (i + slides.length) % slides.length;
        setActive(idx);
        if (user) start();
    };

    // Expose for dots to call even if rendered before init
    window.__wkHeroGoTo = goTo;

    prevBtn && prevBtn.addEventListener('click', () => goTo(idx - 1, true));
    nextBtn && nextBtn.addEventListener('click', () => goTo(idx + 1, true));

    // Pause on hover
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    setActive(idx);
    start();
}

// ------------------------------
// Popular Categories (homepage)
// ------------------------------
function renderHomeCategoryGrid() {
    const grid = document.getElementById('homeCategoryGrid');
    if (!grid) return;

    // Category IDs are based on the existing filtering convention: all-products.html?cat=...
    // and the product.category IDs present in scripts/products.js.
    const categories = [
        { id: 'displays', img: encodeURI('images/hero/伟群快幕秀照片.jpeg?v=20260123'), titleKey: 'home_cat_displays_title', descKey: 'home_cat_displays_desc' },
        { id: 'tents', img: 'images/hero/Waikwantentshero.png', titleKey: 'home_cat_tents_title', descKey: 'home_cat_tents_desc' },
        { id: 'flags', img: 'images/hero/waikwanflagshero.png', titleKey: 'home_cat_flags_title', descKey: 'home_cat_flags_desc' },
        { id: 'lightbox', img: encodeURI('images/\u5e7f\u897f\u4f1f\u7fa4\u5e10\u7bf7\u5236\u9020\u6709\u9650\u516c\u53f82025allpagepng/23.png'), titleKey: 'home_cat_lightbox_title', descKey: 'home_cat_lightbox_desc' },
        { id: 'accessories', img: 'images/products/accessories/flag-accessories/hero.png', titleKey: 'home_cat_accessories_title', descKey: 'home_cat_accessories_desc' }
    ];

    grid.innerHTML = '';
    categories.forEach((c) => {
        const a = document.createElement('a');
        a.className = 'wk-card wk-cat-card';
        a.href = `./all-products.html?cat=${encodeURIComponent(c.id)}`;

        // For category tiles, prefer curated hero assets (avoid random sprite/pdf images).
        const imgSrc = c.img;

        const mediaHtml = imgSrc
            ? `
                <img class="wk-card-img" src="${imgSrc}" alt="" loading="lazy" onerror="this.src='${WK_PLACEHOLDER_IMG}'" />
              `
            : `
                <div class="wk-card-placeholder" aria-hidden="true">
                    <i class="fas fa-layer-group"></i>
                </div>
              `;

        a.innerHTML = `
            <div class="wk-card-media">
                ${mediaHtml}
            </div>
            <div class="wk-card-body">
                <h3 class="wk-card-title" data-translate="${c.titleKey}"></h3>
                <p class="wk-card-desc" data-translate="${c.descKey}"></p>
                <div class="wk-card-link" data-translate="home_cat_cta"></div>
            </div>
        `;
        grid.appendChild(a);
    });
}

// ------------------------------
// Trusted By (homepage)
// ------------------------------
function renderTrustedByWall() {
    const grid = document.getElementById('trustedByGrid');
    if (!grid) return;

    // If a logo list is provided in the future, render it.
    // Otherwise render translated, neutral "badge" labels (no broken images).
    const logos = Array.isArray(window.TRUSTED_BY_LOGOS) ? window.TRUSTED_BY_LOGOS : [];
    grid.innerHTML = '';
    grid.removeAttribute('aria-hidden');

    if (logos.length) {
        logos.slice(0, 12).forEach((src) => {
            const item = document.createElement('div');
            item.className = 'wk-logo-badge';
            item.innerHTML = `<img class="wk-logo-img" src="${String(src)}" alt="" loading="lazy" onerror="this.style.display='none'" />`;
            grid.appendChild(item);
        });
        return;
    }

    const badgeKeys = [
        'home_trusted_badge_1',
        'home_trusted_badge_2',
        'home_trusted_badge_3',
        'home_trusted_badge_4',
        'home_trusted_badge_5',
        'home_trusted_badge_6',
        'home_trusted_badge_7',
        'home_trusted_badge_8',
        'home_trusted_badge_9',
        'home_trusted_badge_10'
    ];

    badgeKeys.forEach((k) => {
        const badge = document.createElement('div');
        badge.className = 'wk-logo-badge wk-logo-badge--text';
        badge.setAttribute('data-translate', k);
        grid.appendChild(badge);
    });
}

// ------------------------------
// Best Sellers (homepage)
// ------------------------------
function computeBestSellers(products, limit = 6) {
    const list = Array.isArray(products) ? products.slice() : [];
    if (!list.length) return [];

    // 1) If dataset has explicit best-seller signals, use them.
    //    - rank (number): sort ascending
    //    - flags: isPopular / featured / bestSeller / bestseller
    const hasRank = list.some((p) => p && typeof p.rank === 'number');
    if (hasRank) {
        return list
            .slice()
            .sort((a, b) => {
                const ra = (a && typeof a.rank === 'number') ? a.rank : Number.POSITIVE_INFINITY;
                const rb = (b && typeof b.rank === 'number') ? b.rank : Number.POSITIVE_INFINITY;
                if (ra !== rb) return ra - rb;
                return String((a && a.id) || '').localeCompare(String((b && b.id) || ''));
            })
            .slice(0, limit);
    }

    const hasFlag = list.some((p) => p && (p.isPopular === true || p.featured === true || p.bestSeller === true || p.bestseller === true));
    if (hasFlag) {
        const flagged = list.filter((p) => p && (p.isPopular || p.featured || p.bestSeller || p.bestseller));
        return (flagged.length ? flagged : list).slice(0, limit);
    }

    // 2) Fallback: tags contain any of the configured keywords
    const keywords = ['best', 'bestseller', 'hot', 'popular', 'top', 'recommended'];
    const hasKeyword = (p) => {
        const tags = (p && p.tags) ? String(p.tags) : '';
        const kw = Array.isArray(p && p.keywords) ? p.keywords.join(' ') : (p && p.keywords ? String(p.keywords) : '');
        const model = (p && p.model) ? String(p.model) : '';
        const name = (p && (p.nameEn || p.name || '')) ? String(p.nameEn || p.name || '') : '';
        const hay = `${tags} ${kw} ${model} ${name}`.toLowerCase();
        return keywords.some((k) => hay.includes(k));
    };

    const flagged = list.filter(hasKeyword);
    if (flagged.length) return flagged.slice(0, limit);

    // 3) Final fallback: first N products (deterministic)
    return list.slice(0, limit);
}

function renderHomeBestSellers() {
    const grid = document.getElementById('bestSellersGrid');
    if (!grid) return;

    const render = (products) => {
        grid.innerHTML = '';
        const picked = computeBestSellers(products, 6);
        if (!picked.length) {
            const empty = document.createElement('div');
            empty.className = 'wk-empty';
            empty.setAttribute('data-translate', 'home_best_sellers_empty');
            grid.appendChild(empty);
            return;
        }

        picked.forEach((p) => {
            const safeProduct = p || {};
            const name = getLocalizedField(safeProduct, 'name') || String(safeProduct.model || safeProduct.id || '');
            const shortDesc = getLocalizedField(safeProduct, 'short') || getLocalizedField(safeProduct, 'description') || '';
            const resolved = (window.WK_getProductCardImage && typeof window.WK_getProductCardImage === 'function')
                ? window.WK_getProductCardImage(safeProduct)
                : '';
            const img = resolved || safeProduct.image || (Array.isArray(safeProduct.images) ? safeProduct.images[0] : '') || WK_PLACEHOLDER_IMG;
            const catKey = getCategoryTranslateKey(safeProduct.category);

            // DETAIL ROUTING (unified)
            const preferredSku = (safeProduct && safeProduct.sku != null && String(safeProduct.sku).trim() !== '')
                ? String(safeProduct.sku).trim()
                : (safeProduct && safeProduct.id != null ? String(safeProduct.id).trim() : '');
            const detailHref = preferredSku
                ? `product-detail.html?sku=${encodeURIComponent(preferredSku)}`
                : `./all-products.html?cat=${encodeURIComponent(safeProduct.category || 'all')}`;

            const card = document.createElement('div');
            card.className = 'wk-card wk-product-card';
            card.innerHTML = `
                <a class="wk-product-media" href="${detailHref}" aria-label="${String(name).replace(/"/g, '&quot;')}">
                    <img class="wk-product-img" src="${img}" alt="" loading="lazy" onerror="this.src='${WK_PLACEHOLDER_IMG}'" />
                </a>
                <div class="wk-card-body">
                    <div class="wk-product-title">${name}</div>
                    <div class="wk-product-specs">
                        ${safeProduct.model ? `<span class="wk-tag">${String(safeProduct.model)}</span>` : ''}
                        ${catKey ? `<span class="wk-tag" data-translate="${catKey}"></span>` : ''}
                    </div>
                    ${shortDesc ? `<div class="wk-product-desc">${String(shortDesc).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : ''}
                    <div class="wk-product-actions">
                        <a class="btn btn-secondary" href="${detailHref}" data-translate="view_details"></a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    waitForProductManager((pm) => {
        const products = pm && Array.isArray(pm.products) ? pm.products : [];
        render(products);
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    });
}

// ------------------------------
// Resources (homepage)
// ------------------------------
function renderHomeResources() {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;

    const items = [
        { href: '#faq-moq', titleKey: 'home_resource_1_title', descKey: 'home_resource_1_desc' },
        { href: '#faq-printing', titleKey: 'home_resource_2_title', descKey: 'home_resource_2_desc' },
        { href: '#faq-shipping', titleKey: 'home_resource_3_title', descKey: 'home_resource_3_desc' },
        { href: '#faq-files', titleKey: 'home_resource_4_title', descKey: 'home_resource_4_desc' }
    ];

    grid.innerHTML = '';
    items.forEach((it) => {
        const a = document.createElement('a');
        a.className = 'wk-card wk-resource-card';
        a.href = it.href;
        a.innerHTML = `
            <div class="wk-card-body">
                <h3 class="wk-card-title" data-translate="${it.titleKey}"></h3>
                <p class="wk-card-desc" data-translate="${it.descKey}"></p>
                <div class="wk-card-link" data-translate="home_resource_cta"></div>
            </div>
        `;
        grid.appendChild(a);
    });
}

// 导航功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const categoryCards = document.querySelectorAll('.category-card');
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 产品分类卡片点击事件（统一跳转到对应分类页，避免首页滚动/筛选逻辑导致“跳回产品中心但内容缺失”）
    // 注意：product-center.html 上的分类卡片已经有 inline onclick，这里不重复接管。
    const categoryLandingMap = {
        tents: 'product-center.html?cat=tents',
        flags: 'product-center.html?cat=flags',
        displays: 'products-displays.html',
        accessories: 'products-accessories.html',
        furniture: 'furniture-type.html?type=table-chair-stool-toilet',
        custom: 'products-custom.html',
    };

    categoryCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            // If the card already has an inline click handler (e.g. on product-center.html), don't override it.
            if (card.getAttribute('onclick')) return;

            const category = (card.dataset.category || '').trim();
            const href = categoryLandingMap[category];
            if (!href) return;

            // Prevent any other delegated handlers from trying to hijack the click.
            e.preventDefault();
            e.stopPropagation();
            window.location.href = href;
        });
    });
    
    // ===================== 统一滚动锁定管理 =====================
    function lockScroll(locked) {
        document.body.style.overflow = locked ? 'hidden' : '';
        document.body.style.height = locked ? '100%' : '';
        document.documentElement.style.overflow = locked ? 'hidden' : '';
        if (locked) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }
    
    function closeMobileMenu() {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        // Clear any open 2nd-level submenus (tap-to-open behavior)
        document.querySelectorAll('.dropdown-item-with-submenu.is-open').forEach((el) => {
            el.classList.remove('is-open');
            const a = el.querySelector('a[aria-expanded]');
            if (a) a.setAttribute('aria-expanded', 'false');
        });
        lockScroll(false);
    }
    
    // 移动端菜单切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            lockScroll(isOpen);
        });
    }
    
    // 点击导航链接后：关闭菜单+恢复滚动
    document.addEventListener('click', (e) => {
        if (e.target.closest('a.nav-link, .dropdown-menu a, .category-card a')) {
            closeMobileMenu();
        }
    });
    
    // ESC 键关闭菜单
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // 页面加载时确保滚动解锁
    lockScroll(false);

    // Ensure new series appear in the Products hover dropdown (fast, no heavy render)
    enhanceProductsDropdownExtras();

    // Enhance Products dropdown: add flags subtype submenu
    enhanceFlagsDropdown();

    // Enhance Products dropdown: add tents subtype submenu
    enhanceTentsDropdown();

    // Enhance Products dropdown: add displays subtype submenu
    enhanceDisplaysDropdown();

    // Ensure Products dropdown includes new Light Box Series entry
    ensureProductCenterDropdownHasLightbox();
    
    // 平滑滚动到锚点（仅对当前页面的 #xxx 生效；跨页链接如 index.html#contact 不拦截）
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // 导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // 高亮当前页面部分
    window.addEventListener('scroll', highlightCurrentSection);
    
    // 自动高亮当前导航项（基于路径）
    (function() {
        const path = location.pathname.split('/').pop() || location.href.split('/').pop();
        document.querySelectorAll('[data-nav]').forEach(a => {
            a.classList.remove('active');
            const navValue = a.getAttribute('data-nav');
            if ((path === 'product-center.html' && navValue === 'product-center') ||
                (path === 'all-products.html' && navValue === 'all-products')) {
                a.classList.add('active');
            }
        });
    })();
}

function enhanceProductsDropdownExtras() {
    // Add missing entries to the top-nav Products dropdown.
    // This keeps navigation consistent across many static HTML pages.
    const menus = Array.from(document.querySelectorAll('.nav-item-dropdown .dropdown-menu'));
    if (!menus.length) return;

    const extras = [
        {
            href: 'furniture-type.html?type=table-chair-stool-toilet',
            key: 'menu_table_chair_stool_toilet'
        },
        {
            href: 'dome-type.html?type=dome-3-folders',
            key: 'menu_dome_3_folders'
        }
    ];

    const isProductsMenu = (menu) => {
        const links = Array.from(menu.querySelectorAll('a[href]'));
        const hasTents = links.some((a) => (a.getAttribute('href') || '').toLowerCase().includes('cat=tents'));
        const hasFlags = links.some((a) => (a.getAttribute('href') || '').toLowerCase().includes('cat=flags'));
        return hasTents && hasFlags;
    };

    menus.forEach((menu) => {
        if (!isProductsMenu(menu)) return;

        const existing = Array.from(menu.querySelectorAll('a[href]')).map((a) => a.getAttribute('href') || '');
        const raceGateLink = Array.from(menu.querySelectorAll('a[href]')).find((a) => (a.getAttribute('href') || '') === 'racegate-type.html');

        extras.forEach((x) => {
            if (existing.includes(x.href)) return;
            const a = document.createElement('a');
            a.href = x.href;

            // Use bilingual spans controlled by CSS (.zh/.en) and populated by multilang.
            const zh = document.createElement('span');
            zh.className = 'zh';
            zh.setAttribute('data-translate', x.key);

            const en = document.createElement('span');
            en.className = 'en';
            en.setAttribute('data-translate', x.key);

            a.appendChild(zh);
            a.appendChild(en);

            // Insert before Race Gate if possible; otherwise append.
            if (raceGateLink && raceGateLink.parentElement === menu) {
                menu.insertBefore(a, raceGateLink);
            } else {
                menu.appendChild(a);
            }
        });
    });
}

function enhanceTentsDropdown() {
    // Find the Products dropdown menu on the current page.
    const menus = Array.from(document.querySelectorAll('.nav-item-dropdown .dropdown-menu'));
    if (!menus.length) return;

    const getCurrentLang = () => {
        try {
            if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
                return (window.multiLang.getCurrentLanguage() || 'en').toLowerCase();
            }
        } catch (e) {}
        const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
        return htmlLang || 'en';
    };

    const fallback = [
        { type: 'folding30', nameEn: '30 Square Tube Frame Iron', nameZh: '30 方管铁架' },
        { type: 'folding40', nameEn: '40 Hexagon Aluminum Frame', nameZh: '40 六角铝合金架' },
        { type: 'folding50', nameEn: '50 Hexagon Aluminum Frame', nameZh: '50 六角铝合金架' },
        { type: 'star_1', nameEn: 'Star Tent (Type 1)', nameZh: '星星帐篷（款式1）' },
        { type: 'star_2', nameEn: 'Star Tent (Type 2)', nameZh: '星星帐篷（款式2）' },
        { type: 'awning', nameEn: 'Awning Tent', nameZh: '天幕帐篷' },
        { type: 'six_sided', nameEn: 'Six-sided Tent', nameZh: '六边帐篷' },
        { type: 'inflatable', nameEn: 'Inflatable Tent', nameZh: '充气帐篷' }
    ];

    const getTypes = () => {
        const data = window.TENT_TYPES;
        const folding = data && Array.isArray(data.folding) ? data.folding : [];
        const event = data && Array.isArray(data.event) ? data.event : [];
        const inflatable = data && Array.isArray(data.inflatable) ? data.inflatable : [];
        const list = folding.concat(event, inflatable);
        if (!list.length) return fallback;
        return list
            .filter((x) => x && x.type)
            .map((x) => ({
                type: x.type,
                nameEn: x.nameEn || x.type,
                nameZh: x.nameZh || x.nameEn || x.type
            }));
    };

    // DETAIL ROUTING (trace)
    // Flow A described by user: Product Center hover menu (Tents -> e.g. “40 六角铝合金架”).
    // Stock series types map to product IDs, opened via the unified PDP.
    // For other tent types, keep the type landing page.
    const STOCK_TENT_ID_BY_TYPE = {
        folding30: 2001,
        folding40: 2002,
        folding50: 2003,
    };

    const getTentTypeHref = (type) => {
        const key = String(type || '').trim();
        const productId = STOCK_TENT_ID_BY_TYPE[key];
        if (productId != null) return `product-detail.html?sku=${encodeURIComponent(productId)}`;
        return `tent-type.html?type=${encodeURIComponent(key)}`;
    };

    const shouldTapToOpen = () => {
        const navMenu = document.querySelector('.nav-menu');
        const isMobileMenuOpen = !!(navMenu && navMenu.classList.contains('active'));
        const noHover = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
        return isMobileMenuOpen || noHover;
    };

    menus.forEach((menu) => {
        // Prevent double-inject.
        if (menu.querySelector('.dropdown-item-with-submenu[data-tents-submenu="1"]')) return;

        const links = Array.from(menu.querySelectorAll('a[href]'));
        const tentsLink = links.find((a) => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            return href.includes('cat=tents');
        });

        if (!tentsLink) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'dropdown-item-with-submenu';
        wrapper.setAttribute('data-tents-submenu', '1');

        // Move the existing anchor into the wrapper.
        const parent = tentsLink.parentElement;
        if (!parent) return;
        parent.insertBefore(wrapper, tentsLink);
        wrapper.appendChild(tentsLink);

        tentsLink.setAttribute('aria-haspopup', 'true');
        tentsLink.setAttribute('aria-expanded', 'false');

        // Add indicator on the right.
        if (!tentsLink.querySelector('.wk-submenu-caret')) {
            const caret = document.createElement('span');
            caret.className = 'wk-submenu-caret';
            caret.textContent = '›';
            tentsLink.appendChild(caret);
        }

        const sub = document.createElement('div');
        sub.className = 'dropdown-submenu';

        // Overview link
        const overview = document.createElement('a');
        overview.href = 'product-center.html?cat=tents';
        overview.setAttribute('data-translate', 'ui_overview');
        overview.textContent = '';
        sub.appendChild(overview);

        const types = getTypes();

        types.forEach((t) => {
            const a = document.createElement('a');
            a.href = getTentTypeHref(t.type);

            // Use bilingual spans so language switching never leaves English in zh mode (or vice versa).
            const zh = document.createElement('span');
            zh.className = 'zh';
            zh.textContent = t.nameZh || t.nameEn || t.type;
            const en = document.createElement('span');
            en.className = 'en';
            en.textContent = t.nameEn || t.nameZh || t.type;
            a.appendChild(zh);
            a.appendChild(en);
            sub.appendChild(a);
        });

        wrapper.appendChild(sub);

        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }

        // On touch/mobile, first tap opens submenu instead of navigating.
        tentsLink.addEventListener('click', (e) => {
            if (!shouldTapToOpen()) return;
            e.preventDefault();
            const isOpen = wrapper.classList.toggle('is-open');
            tentsLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
}

function enhanceFlagsDropdown() {
    // Find the Products dropdown menu on the current page.
    const menus = Array.from(document.querySelectorAll('.nav-item-dropdown .dropdown-menu'));
    if (!menus.length) return;

    const fallback = [
        { type: 'fiberglass_pole', nameEn: 'Fiberglass Pole', nameZh: '玻璃纤维旗杆' },
        { type: 'alu_fiberglass_pole', nameEn: 'Aluminium + Fiberglass', nameZh: '铝合金 + 玻璃纤维' },
        { type: 'fully_fiberglass_teardrop', nameEn: 'Fully Fiberglass (Teardrop)', nameZh: '全玻璃纤维（泪滴）' },
        { type: 'fully_fiberglass_feather', nameEn: 'Fully Fiberglass (Feather)', nameZh: '全玻璃纤维（羽毛）' },
        { type: 'outdoor_giant_flag', nameEn: 'Outdoor Giant Flag', nameZh: '户外巨型旗' },
        { type: 'square_flag_pole_fiberglass', nameEn: 'Square Flag Pole (Fiberglass)', nameZh: '方形旗杆（玻璃纤维）' },
        { type: 'alu_pole_semicircle', nameEn: 'Aluminium Pole (Semicircle)', nameZh: '铝合金旗杆（半圆）' },
        { type: 'alu_pole_square', nameEn: 'Aluminium Pole (Square)', nameZh: '铝合金旗杆（方形）' },
        { type: 'alu_pole_new_feather', nameEn: 'Aluminium Pole (New Feather)', nameZh: '铝合金旗杆（新羽毛）' },
        { type: 'alu_pole_feather', nameEn: 'Aluminium Pole (Feather/Teardrop)', nameZh: '铝合金旗杆（羽毛/泪滴）' },
        { type: 'flag_bases_accessories', nameEn: 'Bases & Accessories', nameZh: '底座与配件' }
    ];

    const getTypes = () => {
        const data = window.FLAG_TYPES;
        const poles = data && Array.isArray(data.poles) ? data.poles : [];
        const accessories = data && Array.isArray(data.accessories) ? data.accessories : [];
        const list = poles.concat(accessories);
        if (!list.length) return fallback;
        return list.map((x) => ({
            type: x.type,
            nameEn: (x && (x.nameEn || x.nameZh)) ? (x.nameEn || x.nameZh) : x.type,
            nameZh: (x && (x.nameZh || x.nameEn)) ? (x.nameZh || x.nameEn) : x.type
        }));
    };

    menus.forEach((menu) => {
        // Prevent double-inject.
        if (menu.querySelector('.dropdown-item-with-submenu[data-flags-submenu="1"]')) return;

        const links = Array.from(menu.querySelectorAll('a[href]'));
        const flagsLink = links.find((a) => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            return href.includes('cat=flags');
        });

        if (!flagsLink) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'dropdown-item-with-submenu';
        wrapper.setAttribute('data-flags-submenu', '1');

        // Move the existing anchor into the wrapper.
        const parent = flagsLink.parentElement;
        if (!parent) return;
        parent.insertBefore(wrapper, flagsLink);
        wrapper.appendChild(flagsLink);

        // Add indicator on the right.
        if (!flagsLink.querySelector('.wk-submenu-caret')) {
            const caret = document.createElement('span');
            caret.className = 'wk-submenu-caret';
            caret.textContent = '›';
            flagsLink.appendChild(caret);
        }

        const sub = document.createElement('div');
        sub.className = 'dropdown-submenu';
        const types = getTypes();

        // Overview link
        const overview = document.createElement('a');
        overview.href = 'product-center.html?cat=flags';
        overview.setAttribute('data-translate', 'ui_overview');
        overview.textContent = '';
        sub.appendChild(overview);

        types.forEach((t) => {
            const a = document.createElement('a');
            a.href = `flag-type.html?type=${encodeURIComponent(t.type)}`;

            // Use bilingual spans so Chinese mode never shows English-only labels.
            const zh = document.createElement('span');
            zh.className = 'zh';
            zh.textContent = t.nameZh || t.nameEn || t.type;
            const en = document.createElement('span');
            en.className = 'en';
            en.textContent = t.nameEn || t.nameZh || t.type;
            a.appendChild(zh);
            a.appendChild(en);
            sub.appendChild(a);
        });

        wrapper.appendChild(sub);

        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    });
}

function enhanceDisplaysDropdown() {
    // Find the Products dropdown menu on the current page.
    const menus = Array.from(document.querySelectorAll('.nav-item-dropdown .dropdown-menu'));
    if (!menus.length) return;

    const getCurrentLang = () => {
        try {
            if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
                return (window.multiLang.getCurrentLanguage() || 'en').toLowerCase();
            }
        } catch (e) {}
        const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
        return htmlLang || 'en';
    };

    const shouldTapToOpen = () => {
        const navMenu = document.querySelector('.nav-menu');
        const isMobileMenuOpen = !!(navMenu && navMenu.classList.contains('active'));
        const noHover = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
        return isMobileMenuOpen || noHover;
    };

    const items = [
        // Displays subcategories (match Product Center subcategory overview)
        { href: 'all-products.html?cat=displays&sub=popup', translateKey: 'menu_popup_backdrop' },
        { href: 'all-products.html?cat=displays&sub=counter', translateKey: 'menu_popup_counter' },
        { href: 'all-products.html?cat=displays&sub=tension-fabric', translateKey: 'menu_displays_tension_fabric' },
        { href: 'all-products.html?cat=displays&sub=fabric-banner-stands', translateKey: 'menu_popup_fabric_banner_stands' },
        { href: 'all-products.html?cat=displays&sub=tfd-straight-line', translateKey: 'menu_popup_tfd_straight_line_series' },
        { href: 'all-products.html?cat=displays&sub=tfd-c-shaped', translateKey: 'menu_popup_tfd_c_shaped_series' },
        { href: 'all-products.html?cat=displays&sub=tfd-accessories', translateKey: 'menu_popup_tfd_accessories' },

        // Newly added display-system subcategories (catalog p26)
        { href: 'all-products.html?cat=displays&sub=roll-up-stand', translateKey: 'menu_displays_roll_up_stand' },
        { href: 'all-products.html?cat=displays&sub=promotion-counter', translateKey: 'menu_displays_promotion_counter' },

        // Direct product entries
        { href: `product-detail.html?sku=${encodeURIComponent('42001')}`, translateKey: 'menu_displays_aframe' },
        { href: `product-detail.html?sku=${encodeURIComponent('42002')}`, translateKey: 'menu_displays_aframe_backdrop' }
    ];

    menus.forEach((menu) => {
        // Prevent double-inject.
        if (menu.querySelector('.dropdown-item-with-submenu[data-displays-submenu="1"]')) return;

        const links = Array.from(menu.querySelectorAll('a[href]'));
        const displaysLink = links.find((a) => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            return href.includes('cat=displays');
        });

        if (!displaysLink) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'dropdown-item-with-submenu';
        wrapper.setAttribute('data-displays-submenu', '1');

        // Move the existing anchor into the wrapper.
        const parent = displaysLink.parentElement;
        if (!parent) return;
        parent.insertBefore(wrapper, displaysLink);
        wrapper.appendChild(displaysLink);

        displaysLink.setAttribute('aria-haspopup', 'true');
        displaysLink.setAttribute('aria-expanded', 'false');

        // Add indicator on the right.
        if (!displaysLink.querySelector('.wk-submenu-caret')) {
            const caret = document.createElement('span');
            caret.className = 'wk-submenu-caret';
            caret.textContent = '›';
            displaysLink.appendChild(caret);
        }

        const sub = document.createElement('div');
        sub.className = 'dropdown-submenu';

        // Overview link (category overview)
        const overview = document.createElement('a');
        overview.href = displaysLink.getAttribute('href') || 'product-center.html?cat=displays';
        overview.setAttribute('data-translate', 'ui_overview');
        overview.textContent = '';
        sub.appendChild(overview);

        items.forEach((it) => {
            const a = document.createElement('a');
            a.href = it.href;
            if (it.translateKey) {
                a.setAttribute('data-translate', it.translateKey);
                a.textContent = '';
            } else {
                const zh = document.createElement('span');
                zh.className = 'zh';
                zh.textContent = it.zh || it.en || '';
                const en = document.createElement('span');
                en.className = 'en';
                en.textContent = it.en || it.zh || '';
                a.appendChild(zh);
                a.appendChild(en);
            }
            sub.appendChild(a);
        });

        wrapper.appendChild(sub);

        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }

        // On touch/mobile, first tap opens submenu instead of navigating.
        displaysLink.addEventListener('click', (e) => {
            if (!shouldTapToOpen()) return;
            e.preventDefault();
            const isOpen = wrapper.classList.toggle('is-open');
            displaysLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
}

function ensureProductCenterDropdownHasLightbox() {
    const menus = Array.from(document.querySelectorAll('.nav-item-dropdown .dropdown-menu'));
    if (!menus.length) return;

    const hasLightboxLink = (menu) => {
        return Array.from(menu.querySelectorAll('a[href]')).some((a) => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            return href.includes('product-center.html') && (href.includes('cat=lightbox') || href.includes('category=lightbox'));
        });
    };

    const makeLink = () => {
        const a = document.createElement('a');
        a.href = 'product-center.html?cat=lightbox';
        a.innerHTML = `<span class="zh" data-translate="menu_light_box_series"></span><span class="en" data-translate="menu_light_box_series"></span>`;
        return a;
    };

    menus.forEach((menu) => {
        if (hasLightboxLink(menu)) return;

        // Insert after Displays if present, otherwise append.
        const links = Array.from(menu.querySelectorAll('a[href]'));
        const displays = links.find((a) => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            return href.includes('cat=displays') || href.includes('category=displays');
        });

        const node = makeLink();
        if (displays && displays.parentElement === menu) {
            const next = displays.nextSibling;
            if (next) menu.insertBefore(node, next);
            else menu.appendChild(node);
        } else {
            menu.appendChild(node);
        }
    });

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
    }
}

// 高亮当前页面部分
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// 滚动效果
function initScrollEffects() {
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.service-item, .product-item, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // 视差滚动效果
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 模态框功能
function initModals() {
    const modal = document.getElementById('pdfModal');
    const closeBtn = document.querySelector('.close');
    
    if (modal && closeBtn) {
        // 关闭模态框
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
    
    // 添加PDF下载按钮到产品卡片
    addPDFDownloadButtons();
}

// 添加PDF下载按钮
function addPDFDownloadButtons() {
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-secondary';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> <span data-translate="download_materials"></span>';
        downloadBtn.addEventListener('click', () => {
            document.getElementById('pdfModal').style.display = 'block';
        });
        
        const productInfo = item.querySelector('.product-info');
        if (productInfo) {
            productInfo.appendChild(downloadBtn);
        }
    });
}

// 表单验证
function initFormValidation() {
    // Handle multiple contact-form instances but skip the primary getQuoteForm
    const forms = document.querySelectorAll('.contact-form form');

    forms.forEach(form => {
        // Let `scripts/contact.js` handle the main quoting form
        if (form.id === 'getQuoteForm') return;

        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });

            if (isValid) {
                submitForm(form);
            }
        });
    });
}

// 验证单个字段
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // 移除之前的错误样式
    field.classList.remove('error');
    
    // 必填字段验证
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }
    
    // 邮箱验证
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
    }
    
    return true;
}

// 清除验证错误
function clearValidation(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// 显示字段错误
function showFieldError(field, message) {
    field.classList.add('error');
    
    // 移除现有错误信息
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 添加新的错误信息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// 提交表单
function submitForm(form) {
    const formMessage = document.getElementById('formMessage');
    
    // 显示提交中状态
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function')
        ? window.wkI18n.t('inquiry_form_sending')
        : '';
    submitBtn.disabled = true;
    
    // 模拟提交
    setTimeout(() => {
        // 显示成功消息
        if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.className = 'form-message success';
            formMessage.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function')
                ? window.wkI18n.t('inquiry_form_success')
                : '';
        }
        
        // 重置表单
        form.reset();
        
        // 恢复按钮状态
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 3秒后隐藏消息
        setTimeout(() => {
            if (formMessage) {
                formMessage.style.display = 'none';
            }
        }, 3000);
    }, 1500);
}

// 动画初始化
function initAnimations() {
    // 可以在这里添加更多动画效果
}

// Hero视频初始化
function initHeroVideo() {
    const video = document.querySelector('.hero-video-bg');
    if (video) {
        video.addEventListener('loadeddata', () => {
            video.play().catch(() => {
                // 自动播放失败时，静默处理
            });
        });
    }
}

// Render hero slides from centralized data
function renderHeroSlides() {
    const track = document.getElementById('heroSzTrack');
    if (!track) return;
    // Only render dynamic slides when `window.HERO_SLIDES` is explicitly provided.
    // If not provided, preserve the static markup present in the HTML.
    const slides = window.HERO_SLIDES;
    if (!slides || !slides.length) return;

    track.innerHTML = '';

    slides.forEach((s, i) => {
        const article = document.createElement('article');
        article.className = 'hero-sz-slide' + (i === 0 ? ' is-active' : '');
        article.setAttribute('data-slide', i);

        let highlightsHtml = '';
        (s.highlights || []).forEach(h => {
            highlightsHtml += `<div class="h-item"><div class="h-label">${h.label}</div><div class="h-value"><span class="zh">${h.valueZh}</span><span class="en">${h.valueEn}</span></div></div>`;
        });

        article.innerHTML = `
            <div class="hero-sz-left">
                <div class="hero-info">
                    <div class="hero-kicker"><span class="zh">${s.kickerZh}</span><span class="en">${s.kickerEn}</span></div>

                    <h2 class="hero-title"><span class="zh">${s.titleZh}</span><span class="en">${s.titleEn}</span></h2>
                    <p class="hero-sub"><span class="zh">${s.subZh}</span><span class="en">${s.subEn}</span></p>

                    <div class="hero-highlights">${highlightsHtml}</div>

                    <div class="hero-ctas">
                        <a class="btn btn-primary" href="${s.ctaHref}">
                            <span class="zh">${s.ctaTextZh}</span>
                            <span class="en">${s.ctaTextEn}</span>
                        </a>
                    </div>

                </div>
            </div>
            <div class="hero-sz-right">
                <div class="hero-sz-image-wrap hero-image">
                    <img src="${s.image}" alt="${s.alt || ''}" loading="lazy">
                </div>
            </div>
        `;

        track.appendChild(article);
    });
}

// Signazon 风格 Hero 轮播
function initHeroCarouselSz() {
    const track = document.getElementById('heroSzTrack');
    if (!track) return;
    let slides = Array.from(track.querySelectorAll('.hero-sz-slide'));
    const dotsWrap = document.getElementById('heroSzDots');
    const prevBtn = document.getElementById('heroSzPrev');
    const nextBtn = document.getElementById('heroSzNext');
    let idx = slides.findIndex(s => s.classList.contains('is-active'));
    if (idx < 0) idx = 0;

    // If there are no slides (e.g. dynamic rendering removed static content),
    // insert a safe default slide and hide navigation controls.
    if (slides.length === 0) {
        // create a simple fallback slide using an existing image
        const fallback = document.createElement('article');
        fallback.className = 'hero-sz-slide is-active';
        fallback.setAttribute('data-slide', 0);
        fallback.innerHTML = `
            <div class="hero-sz-left">
                <div class="hero-sz-kicker">Welcome</div>
                <h1 class="hero-sz-title">Welcome to WaiKwan</h1>
                <p class="hero-sz-sub">Quality tents and displays — factory direct</p>
            </div>
            <div class="hero-sz-right">
                <div class="hero-sz-image-wrap">
                    <img src="images/快幕秀图片.jpg" alt="WaiKwan Hero" loading="lazy">
                </div>
            </div>
        `;
        track.appendChild(fallback);
        slides = [fallback];

        if (dotsWrap) dotsWrap.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    // dots
    if (dotsWrap) {
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
            const b = document.createElement('button');
            b.className = 'hero-sz-dot' + (i === idx ? ' is-active' : '');
            b.type = 'button';
            b.addEventListener('click', () => go(i, true));
            dotsWrap.appendChild(b);
        });
    }

    const setActive = (i) => {
        slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
        if (dotsWrap) {
            Array.from(dotsWrap.children).forEach((d, k) => {
                d.classList.remove('is-active');
                if (k === i) {
                    // 触发进度条动画重置
                    void d.offsetWidth;
                    d.classList.add('is-active');
                }
            });
        }
    };

    const go = (i, user = false) => {
        idx = (i + slides.length) % slides.length;
        setActive(idx);
        if (user) restart();
    };

    prevBtn && prevBtn.addEventListener('click', () => go(idx - 1, true));
    nextBtn && nextBtn.addEventListener('click', () => go(idx + 1, true));

    // autoplay
    let timer = null;
    const start = () => timer = window.setInterval(() => go(idx + 1), 6500);
    const stop = () => {
        if (timer) window.clearInterval(timer);
        timer = null;
    };
    const restart = () => {
        stop();
        start();
    };

    // pause on hover
    const shell = document.querySelector('.hero-sz-track');
    shell && shell.addEventListener('mouseenter', stop);
    shell && shell.addEventListener('mouseleave', start);

    setActive(idx);
    start();
}

// Logo 漂浮功能已简化为纯 CSS transform，无需 JavaScript

// ===================== Search Overlay + Redirect =====================
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');

    // 没有按钮就不初始化（避免报错）
    if (!searchBtn) return;

    // 如果已经在 all-products 页面：点击就直接跳转并聚焦搜索框
    function isAllProductsPage() {
        return location.pathname.endsWith('all-products.html');
    }

    function normalizeKey(s) {
        return (s || '')
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/_/g, '-')
            .replace(/[–—]/g, '-')
            .trim();
    }

    function matchTentType(keywordRaw) {
        const k = normalizeKey(keywordRaw);
        if (!k) return '';

        // Folding series
        if (k.includes('wk-t30') || k.includes('t30') || k.includes('30square') || k.includes('squaretubeframeiron')) return 'folding30';
        if (k.includes('wk-t40') || k.includes('t40') || k.includes('40hexagon') || k.includes('hexagonaluminum')) return 'folding40';
        if (k.includes('wk-t50') || k.includes('t50') || k.includes('50hexagon') || k.includes('hexagonaluminumframe')) return 'folding50';

        // Star tent
        if (k.includes('star') || k.includes('star-tent') || k.includes('adt10')) return 'star_1';
        if (k.includes('adt11')) return 'star_2';

        // Awning
        if (k.includes('awning') || k.includes('awning-tent') || k.includes('adt12')) return 'awning';

        // Six-sided
        if (k.includes('six') && k.includes('side')) return 'six_sided';
        if (k.includes('six-sided') || k.includes('sixsided') || k.includes('wk-t80') || k.includes('t80b')) return 'six_sided';

        return '';
    }

    function matchCategory(keywordRaw) {
        const raw = (keywordRaw || '').toString();
        const k = normalizeKey(raw);
        if (!k) return '';

        // RaceGate
        if (k.includes('racegate') || k.includes('race-gate') || raw.includes('拱门') || raw.includes('竞速')) return 'racegate';

        // Accessories
        if (k.includes('accessor') || raw.includes('配件')) return 'accessories';

        // Tents
        if (k.includes('tent') || raw.includes('帐篷')) return 'tents';

        // Flags
        if (k.includes('flag') || raw.includes('沙滩旗') || raw.includes('旗杆')) return 'flags';

        // Displays
        if (k.includes('display') || raw.includes('快幕秀') || raw.includes('展架')) return 'displays';

        return '';
    }

    function goToSearch(q) {
        const keyword = (q || '').trim();
        const tentType = matchTentType(keyword);
        if (tentType) {
            window.location.href = `tent-type.html?type=${encodeURIComponent(tentType)}`;
            return;
        }

        const cat = matchCategory(keyword);
        if (cat === 'racegate') {
            window.location.href = 'racegate-type.html';
            return;
        }
        if (cat) {
            window.location.href = keyword
                ? `all-products.html?cat=${encodeURIComponent(cat)}&q=${encodeURIComponent(keyword)}`
                : `all-products.html?cat=${encodeURIComponent(cat)}`;
            return;
        }

        const url = keyword
            ? `all-products.html?q=${encodeURIComponent(keyword)}`
            : `all-products.html`;
        window.location.href = url;
    }

    // 创建搜索弹层（只创建一次）
    let overlay = document.getElementById('searchOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'searchOverlay';
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
                <button class="search-close" type="button" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>

                <div class="search-title">
                    <span class="en">Search products</span>
                    <span class="zh">搜索产品</span>
                </div>

                <div class="search-row">
                    <input id="searchOverlayInput" type="text" data-translate-placeholder="products_search_placeholder" placeholder="" autocomplete="off" />
                    <button id="searchOverlayGo" class="btn btn-primary" type="button">
                        <span class="en">Search</span><span class="zh">搜索</span>
                    </button>
                </div>

                <div class="search-hint">
                    <span class="en">Tip: Try “3x3”, “flag pole”, “backdrop”.</span>
                    <span class="zh">提示：可试 “3x3 / 沙滩旗 / 快幕秀”.</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Apply translations for newly injected markup (including placeholder).
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    }

    const input = overlay.querySelector('#searchOverlayInput');
    const goBtn = overlay.querySelector('#searchOverlayGo');
    const closeBtn = overlay.querySelector('.search-close');

    function open() {
        overlay.classList.add('open');
        document.body.classList.add('no-scroll');
        setTimeout(() => input && input.focus(), 50);
    }

    function close() {
        overlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
        if (input) input.value = '';
    }

    // 点击 🔍
    searchBtn.addEventListener('click', () => {
        if (isAllProductsPage()) {
            // 如果就在 all-products：聚焦搜索框
            const pageInput = document.getElementById('searchInput');
            if (pageInput) {
                pageInput.focus();
                pageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }
        open();
    });

    // 关闭逻辑
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'Enter') goToSearch(input.value);
    });

    // 点击 Search
    goBtn && goBtn.addEventListener('click', () => goToSearch(input.value));
}
