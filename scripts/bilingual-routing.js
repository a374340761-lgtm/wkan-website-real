/**
 * EN ↔ /zh/ locale routing (Phase 1)
 *
 * Canonical rules:
 * - English pages live at the site root; rel=canonical points at the same path on www.
 * - Chinese mirrors live under /zh/; rel=canonical points at https://www.waikwantent.com/zh/...
 *
 * hreflang rules (injected with data-wk-hreflang; see injectHreflang):
 * - en → English URL
 * - zh-CN → Chinese mirror when available, else /zh/index.html (query preserved)
 * - x-default → English URL (global B2B default)
 */
(function () {
  var BASE = 'https://www.waikwantent.com';

  var MIRROR_BASENAMES = {
    'index.html': true,
    'product-center.html': true,
    'all-products.html': true,
    'product-detail.html': true,
    'custom-canopy-tent-manufacturer.html': true
  };

  function normPath(p) {
    if (!p) return '/';
    p = String(p).replace(/\\/g, '/');
    if (p.length > 1 && p.slice(-1) === '/') p = p.slice(0, -1);
    return p;
  }

  function basenameFromPath(path) {
    path = normPath(path);
    if (path === '/' || path === '') return 'index.html';
    var segments = path.split('/').filter(Boolean);
    return segments.length ? segments[segments.length - 1] : 'index.html';
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

  function addZhPrefix(enPath) {
    enPath = normPath(enPath);
    if (enPath === '/' || enPath === '/index.html') return '/zh/index.html';
    if (enPath.charAt(0) === '/') return '/zh' + enPath;
    return '/zh/' + enPath;
  }

  function hasMirrorBasename(bn) {
    return !!MIRROR_BASENAMES[bn];
  }

  function getZhPathForEnPath(pathname) {
    pathname = normPath(pathname);
    var bn = basenameFromPath(pathname);
    if (hasMirrorBasename(bn)) {
      return addZhPrefix(pathname === '/' ? '/index.html' : pathname);
    }
    return '/zh/index.html';
  }

  function absolutize(path, search) {
    path = normPath(path);
    if (path === '/') path = '/index.html';
    var base = BASE.replace(/\/$/, '');
    return base + path + (search || '');
  }

  function enHomeUrl(search) {
    return BASE.replace(/\/$/, '') + '/' + (search || '');
  }

  /**
   * If selecting targetLang ('en'|'zh') requires navigation, return absolute URL; else null.
   */
  function getLocaleSwitchUrl(targetLang) {
    var pathname = normPath(window.location.pathname);
    var search = window.location.search || '';

    if (targetLang === 'zh') {
      if (isZhPath(pathname)) return null;
      var zhPath = getZhPathForEnPath(pathname);
      return absolutize(zhPath, search);
    }
    if (targetLang === 'en') {
      if (!isZhPath(pathname)) return null;
      var enPath = stripZhPrefix(pathname);
      var enBn = basenameFromPath(enPath);
      if (!hasMirrorBasename(enBn) && enPath !== '/index.html') {
        return enHomeUrl(search);
      }
      if (enPath === '/index.html') return enHomeUrl(search);
      return absolutize(enPath, search);
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

    if (isZhPath(pathname)) {
      zhAbs = absolutize(pathname, search);
      var enPath = stripZhPrefix(pathname);
      var enBn = basenameFromPath(enPath);
      if (!hasMirrorBasename(enBn) && enPath !== '/index.html') {
        enAbs = enHomeUrl(search);
      } else if (enPath === '/index.html') {
        enAbs = enHomeUrl(search);
      } else {
        enAbs = absolutize(enPath, search);
      }
    } else {
      var bn = basenameFromPath(pathname);
      if (pathname === '/' || pathname === '/index.html') {
        enAbs = enHomeUrl(search);
      } else if (hasMirrorBasename(bn)) {
        enAbs = absolutize(pathname === '/' ? '/index.html' : pathname, search);
      } else {
        enAbs = absolutize(pathname === '/' ? '/index.html' : pathname, search);
      }
      zhAbs = absolutize(getZhPathForEnPath(pathname), search);
    }

    if (!zhAbs) {
      zhAbs = absolutize('/zh/index.html', search);
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
    BASE: BASE,
    getLocaleSwitchUrl: getLocaleSwitchUrl,
    injectHreflang: injectHreflang,
    isZhPath: isZhPath,
    stripZhPrefix: stripZhPrefix,
    getZhPathForEnPath: getZhPathForEnPath
  };
  window.wkBilingualInjectHreflang = injectHreflang;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachLocaleNav);
  } else {
    attachLocaleNav();
  }
})();
