/**
 * EN ↔ /zh/ locale routing (full-site mirrors)
 *
 * Canonical: EN at root, ZH under /zh/ with same path suffix.
 * hreflang: en, zh-CN, x-default (English).
 */
(function () {
  /** Always used for hreflang alternates (matches deployed SEO). */
  var PRODUCTION_ORIGIN = 'https://www.waikwantent.com';

  function isLocalDevHost() {
    var h = (window.location && window.location.hostname) || '';
    return (
      h === 'localhost' ||
      h === '127.0.0.1' ||
      h === '::1' ||
      h === '[::1]'
    );
  }

  /** Origin used for locale switching (stay on dev server when previewing locally). */
  function getNavOrigin() {
    try {
      if (isLocalDevHost()) {
        return String(window.location.origin || '').replace(/\/$/, '') || PRODUCTION_ORIGIN;
      }
    } catch (e) {}
    return PRODUCTION_ORIGIN;
  }

  var MIRRORED_EN = {
    '/all-products.html': true,
    '/aluminum-folding-tent.html': true,
    '/beach-flag-supplier.html': true,
    '/custom-canopy-tent-manufacturer.html': true,
    '/dome-type.html': true,
    '/faq.html': true,
    '/faq-artwork-files.html': true,
    '/faq-color-matching.html': true,
    '/faq-lead-time.html': true,
    '/faq-moq.html': true,
    '/faq-samples.html': true,
    '/faq-shipping.html': true,
    '/flag-type.html': true,
    '/furniture-type.html': true,
    '/index.html': true,
    '/news/apppexpo-2026-shanghai.html': true,
    '/news/index.html': true,
    '/pop-up-display-stands.html': true,
    '/portable-display-systems.html': true,
    '/privacy.html': true,
    '/product-center.html': true,
    '/product-detail.html': true,
    '/products.html': true,
    '/products-accessories.html': true,
    '/products-custom.html': true,
    '/products-displays.html': true,
    '/products-flags.html': true,
    '/products-furniture.html': true,
    '/products-inflatable.html': true,
    '/products-lightbox.html': true,
    '/products-tents.html': true,
    '/racegate-type.html': true,
    '/seg-light-box-manufacturer.html': true,
    '/seo/advertising-flag-pole-and-base-wholesale-supplier-b2b.html': true,
    '/seo/aluminum-frame-fabric-display-manufacturer-custom-branding.html': true,
    '/seo/aluminum-frame-pop-up-tent-factory-direct-export.html': true,
    '/seo/beach-flag-manufacturer-wholesale-feather-teardrop-flags.html': true,
    '/seo/branded-promotional-tent-supplier-b2b-bulk-orders.html': true,
    '/seo/collapsible-display-system-wholesale-distributor-pricing.html': true,
    '/seo/commercial-grade-pop-up-canopy-wholesale-supplier.html': true,
    '/seo/custom-beach-flag-kit-supplier-for-agencies.html': true,
    '/seo/custom-canopy-tent-factory-for-reseller-programs.html': true,
    '/seo/custom-printed-canopy-tent-manufacturer-oem-china.html': true,
    '/seo/custom-printed-feather-flag-supplier-bulk-order-oem.html': true,
    '/seo/double-sided-beach-flag-manufacturer-export-quality.html': true,
    '/seo/event-feather-flag-printing-manufacturer-factory-direct.html': true,
    '/seo/exhibition-tent-frame-and-fabric-manufacturer-odm.html': true,
    '/seo/fabric-tension-backwall-supplier-bulk-for-rental-companies.html': true,
    '/seo/folding-event-tent-supplier-wholesale-moq.html': true,
    '/seo/heavy-duty-gazebo-tent-wholesale-manufacturer-europe-shipping.html': true,
    '/seo/modular-exhibition-display-hardware-manufacturer-odm.html': true,
    '/seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html': true,
    '/seo/outdoor-promotional-flag-system-manufacturer-oem.html': true,
    '/seo/pop-up-display-stand-wholesale-supplier-for-events.html': true,
    '/seo/portable-backdrop-display-system-supplier-wholesale.html': true,
    '/seo/portable-trade-show-booth-backdrop-manufacturer-export.html': true,
    '/seo/quick-setup-display-frame-supplier-oem-graphics.html': true,
    '/seo/replacement-beach-flag-pole-base-supplier-wholesale.html': true,
    '/seo/seg-fabric-light-box-manufacturer-b2b-custom-sizes.html': true,
    '/seo/teardrop-flag-hardware-supplier-for-print-shops.html': true,
    '/seo/tension-fabric-display-wall-manufacturer-oem-trade-show.html': true,
    '/seo/trade-show-canopy-tent-manufacturer-for-distributors.html': true,
    '/seo/wind-sail-banner-flag-wholesale-supplier-moq.html': true,
    '/site-map.html': true,
    '/six-sided-booth.html': true,
    '/tension-fabric-backwall.html': true,
    '/tent-type.html': true,
    '/terms.html': true
  };

  function normPath(p) {
    if (!p) return '/';
    p = String(p).replace(/\\/g, '/');
    if (p.length > 1 && p.slice(-1) === '/') p = p.slice(0, -1);
    return p;
  }

  function enPathKey(pathname) {
    pathname = normPath(pathname);
    if (pathname === '/' || pathname === '') return '/index.html';
    return pathname;
  }

  function hasEnMirror(pathname) {
    return !!MIRRORED_EN[enPathKey(pathname)];
  }

  function isZhPath(path) {
    path = normPath(path);
    return path === '/zh' || path.indexOf('/zh/') === 0;
  }

  function stripZhPrefix(path) {
    path = normPath(path);
    if (path === '/zh' || path === '/zh/index.html') return '/index.html';
    if (path.indexOf('/zh/') === 0) return '/' + path.slice(4);
    return path;
  }

  function getZhPathForEnPath(pathname) {
    var key = enPathKey(pathname);
    if (MIRRORED_EN[key]) {
      return '/zh' + key;
    }
    return '/zh/index.html';
  }

  function absolutize(origin, path, search) {
    path = normPath(path);
    if (path === '/') path = '/index.html';
    var base = String(origin).replace(/\/$/, '');
    return base + path + (search || '');
  }

  function enHomeUrl(origin, search) {
    return String(origin).replace(/\/$/, '') + '/' + (search || '');
  }

  function getLocaleSwitchUrl(targetLang) {
    var pathname = normPath(window.location.pathname);
    var search = window.location.search || '';

    var nav = getNavOrigin();
    if (targetLang === 'zh') {
      if (isZhPath(pathname)) return null;
      var zhPath = getZhPathForEnPath(pathname);
      return absolutize(nav, zhPath, search);
    }
    if (targetLang === 'en') {
      if (!isZhPath(pathname)) return null;
      var enPath = stripZhPrefix(pathname);
      var enKey = enPathKey(enPath);
      if (!hasEnMirror(enKey)) {
        return enHomeUrl(nav, search);
      }
      if (enKey === '/index.html') return enHomeUrl(nav, search);
      return absolutize(nav, enKey, search);
    }
    return null;
  }

  function normalizeComparable(absUrl) {
    try {
      var u = new URL(absUrl);
      var p = u.pathname;
      if (p === '/index.html') u.pathname = '/';
      return u.toString();
    } catch (e) {
      return absUrl;
    }
  }

  /**
   * Root-relative EN internal link -> same path under /zh/ when the page has a mirror and we're on /zh/.
   * Expect href like /product-center.html?cat=tents or ./all-products.html?q=1
   */
  function localizedPageHref(href) {
    if (!href || typeof href !== 'string') return href;
    var s = href.trim();
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(s)) return s;
    try {
      var origin =
        typeof window !== 'undefined' && window.location && window.location.origin
          ? window.location.origin
          : PRODUCTION_ORIGIN;
      var rel = s.replace(/^\.\//, '');
      if (rel.charAt(0) !== '/') rel = '/' + rel;
      var u = new URL(rel, origin + '/');
      var pathname = normPath(u.pathname);
      var key = enPathKey(pathname);
      var search = u.search || '';
      var hash = u.hash || '';
      if (isZhPath(window.location.pathname) && MIRRORED_EN[key]) {
        return '/zh' + key + search + hash;
      }
      return key + search + hash;
    } catch (e) {
      return href;
    }
  }

  window.wkLocalizedPageHref = localizedPageHref;

  function attachLocaleNav() {
    document.addEventListener(
      'click',
      function (e) {
        var el = e.target;
        if (!el || !el.closest) return;
        var btn = el.closest('.lang-item[data-lang], #languageGate .language-options button[data-lang]');
        if (!btn) return;
        var targetLang = btn.getAttribute('data-lang');
        if (!targetLang) return;
        var dest = getLocaleSwitchUrl(targetLang);
        if (!dest) return;
        var here = window.location.href.split('#')[0];
        if (normalizeComparable(dest) === normalizeComparable(here)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        try {
          if (targetLang === 'en' || targetLang === 'zh') {
            localStorage.setItem('site_language', targetLang);
            localStorage.setItem('siteLanguage', targetLang);
          }
        } catch (err) {}
        window.location.href = dest;
      },
      true
    );
  }

  function removeOldHreflang() {
    document.querySelectorAll('link[data-wk-hreflang]').forEach(function (l) {
      l.parentNode && l.parentNode.removeChild(l);
    });
  }

  function injectHreflang() {
    var pathname = normPath(window.location.pathname);
    var search = window.location.search || '';
    var enAbs;
    var zhAbs;

    var seo = PRODUCTION_ORIGIN;
    if (isZhPath(pathname)) {
      zhAbs = absolutize(seo, pathname, search);
      var enPath = stripZhPrefix(pathname);
      var enKey = enPathKey(enPath);
      if (!hasEnMirror(enKey)) {
        enAbs = enHomeUrl(seo, search);
      } else if (enKey === '/index.html') {
        enAbs = enHomeUrl(seo, search);
      } else {
        enAbs = absolutize(seo, enKey, search);
      }
    } else {
      var enKey2 = enPathKey(pathname);
      if (pathname === '/' || pathname === '/index.html' || enKey2 === '/index.html') {
        enAbs = enHomeUrl(seo, search);
      } else {
        enAbs = absolutize(seo, enKey2, search);
      }
      zhAbs = absolutize(seo, getZhPathForEnPath(pathname), search);
    }

    if (!zhAbs) {
      zhAbs = absolutize(seo, '/zh/index.html', search);
    }

    removeOldHreflang();
    [
      ['en', enAbs],
      ['zh-CN', zhAbs],
      ['x-default', enAbs]
    ].forEach(function (pair) {
      var link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', pair[0]);
      link.setAttribute('href', pair[1]);
      link.setAttribute('data-wk-hreflang', '1');
      document.head.appendChild(link);
    });
  }

  window.wkBilingual = {
    /** Navigation / locale switch (local origin on localhost). */
    BASE: getNavOrigin(),
    PRODUCTION_ORIGIN: PRODUCTION_ORIGIN,
    getNavOrigin: getNavOrigin,
    localizedPageHref: localizedPageHref,
    getLocaleSwitchUrl: getLocaleSwitchUrl,
    injectHreflang: injectHreflang,
    isZhPath: isZhPath,
    stripZhPrefix: stripZhPrefix,
    getZhPathForEnPath: getZhPathForEnPath,
    hasEnMirror: hasEnMirror
  };
  window.wkBilingualInjectHreflang = injectHreflang;

  /**
   * URL is the source of truth for UI language: /zh/ => zh, everything else => en.
   * Does not read localStorage (used by multilang.js and product scripts).
   */
  window.wkResolvePageLanguage = function () {
    try {
      var p = String(window.location.pathname || '').replace(/\\/g, '/');
      if (p === '/zh' || p.indexOf('/zh/') === 0) return 'zh';
    } catch (e) {}
    return 'en';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachLocaleNav);
  } else {
    attachLocaleNav();
  }
})();
