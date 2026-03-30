/*
  SEO head helpers (static-site friendly)
  - Ensures canonical link exists and is consistent
  - Fills OpenGraph/Twitter URL + image with absolute URLs
  - Normalizes canonical for product detail pages
  - Injects Organization JSON-LD
*/
(function () {
  var BASE_URL = 'https://www.waikwantent.com';

  function upsertMeta(attrName, attrValue, content) {
    try {
      var selector = 'meta[' + attrName + '="' + String(attrValue) + '"]';
      var el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      if (typeof content === 'string') el.setAttribute('content', content);
      return el;
    } catch (e) {
      return null;
    }
  }

  function getDescription() {
    var d = document.head.querySelector('meta[name="description"]');
    var v = (d && d.getAttribute('content')) || '';
    v = String(v || '').trim();
    if (v) return v;
    return 'Guangxi WaiKwan Tent Manufacturing Co., Ltd — custom canopy tents, beach flags and display systems (OEM/ODM).';
  }

  function toAbsoluteUrl(maybeUrl) {
    if (!maybeUrl || typeof maybeUrl !== 'string') return '';
    var trimmed = String(maybeUrl).trim();
    if (!trimmed) return '';
    try {
      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed.replace(/^https:\/\/waikwantent\.com/i, 'https://www.waikwantent.com');
      }
      var base = BASE_URL.replace(/\/$/, '');
      return (base + (trimmed.charAt(0) === '/' ? '' : '/') + trimmed);
    } catch (e) {
      return '';
    }
  }

  function ensureCanonical(url) {
    try {
      var link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    } catch (e) {}
  }

  function normalizeExistingCanonical() {
    try {
      var link = document.head.querySelector('link[rel="canonical"]');
      if (!link) return '';
      var raw = String(link.getAttribute('href') || '').trim();
      if (!raw) return '';
      var abs = toAbsoluteUrl(raw);
      if (abs) link.setAttribute('href', abs);
      return abs;
    } catch (e) {
      return '';
    }
  }

  function normalizeCanonical() {
    try {
      // Respect canonical authored in HTML (e.g., redirect pages pointing to a target).
      var existing = normalizeExistingCanonical();
      var url = new URL(window.location.href);
      url.hash = '';

      // Canonicalize product detail URL: product-detail.html?sku=XXXX
      if (/\bproduct-detail\.html$/i.test(url.pathname)) {
        var sku = (url.searchParams.get('sku') || '').trim();
        if (sku) {
          url.search = '';
          url.searchParams.set('sku', sku);
        } else {
          // Keep no query if sku missing
          url.search = '';
        }

        // Product detail canonical: always use production URL for SEO
        var canonicalUrl = BASE_URL.replace(/\/$/, '') + url.pathname.replace(/^\//, '/') + url.search;
        ensureCanonical(canonicalUrl);
        return canonicalUrl;
      }

      // Legacy entry points should not be canonical.
      if (/\b(product\.html|tent-detail\.html)\b/i.test(url.pathname)) {
        var target = new URL('product-detail.html', url);
        var maybeSku = (url.searchParams.get('sku') || url.searchParams.get('id') || '').trim();
        if (maybeSku) target.searchParams.set('sku', maybeSku);
        var absLegacy = new URL(target.pathname + target.search, BASE_URL + '/');
        ensureCanonical(absLegacy.toString());
        return absLegacy.toString();
      }

      // If the HTML already declared a canonical, keep it (but make it absolute).
      if (existing) return existing;

      // Use production URL for canonical (important when developing on localhost)
      var finalUrl = url.toString();
      if (finalUrl.indexOf('127.0.0.1') !== -1 || finalUrl.indexOf('localhost') !== -1) {
        finalUrl = BASE_URL.replace(/\/$/, '') + (url.pathname || '/') + url.search;
      }
      ensureCanonical(finalUrl);
      return finalUrl;
    } catch (e) {
      return '';
    }
  }

  function applySocialTags(canonicalAbs) {
    var title = String(document.title || '').trim() || 'WaiKwan';
    var desc = getDescription();

    var defaultImg = 'images/hero/Waikwantentshero.png';
    var ogImg = (document.head.querySelector('meta[property="og:image"]') || document.head.querySelector('meta[name="twitter:image"]'));
    var imgContent = (ogImg && ogImg.getAttribute('content')) || defaultImg;

    var absUrl = canonicalAbs || (function () { try { return new URL(window.location.href).toString(); } catch { return ''; } })();
    if (absUrl && (absUrl.indexOf('127.0.0.1') !== -1 || absUrl.indexOf('localhost') !== -1)) {
      try {
        var u = new URL(absUrl);
        absUrl = BASE_URL.replace(/\/$/, '') + (u.pathname || '/') + u.search;
      } catch (e) {}
    }
    var absImg = toAbsoluteUrl(imgContent || defaultImg);

    upsertMeta('property', 'og:site_name', 'WaiKwan');
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', absUrl);
    upsertMeta('property', 'og:image', absImg);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', absImg);
    upsertMeta('name', 'twitter:url', absUrl);
  }

  function injectOrganizationJsonLd() {
    if (document.getElementById('wk-org-jsonld')) return;
    try {
      var path = (window.location.pathname || '/').replace(/\\/g, '/');
      var isHome = path === '/' || /\/index\.html$/i.test(path);
      if (!isHome) return;
    } catch (e) {
      return;
    }
    var script = document.createElement('script');
    script.id = 'wk-org-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': BASE_URL + '/#organization',
          name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd',
          alternateName: 'WaiKwan',
          url: BASE_URL + '/',
          logo: toAbsoluteUrl('images/waikwancompanylogo.png'),
          description: 'Factory-direct manufacturer of custom canopy tents, beach flags and portable display systems. OEM/ODM support, fast quotes, global export.',
          foundingDate: '2010',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+86-138-2454-0280',
            email: 'yishu@waikwantent.com',
            contactType: 'sales',
            availableLanguage: ['English', 'Chinese'],
            areaServed: 'Worldwide'
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Daping Changtangao, Luyin Village, Gucheng Town',
            addressLocality: 'Luchuan County',
            addressRegion: 'Yulin',
            addressCountry: 'CN'
          }
        },
        {
          '@type': 'WebSite',
          '@id': BASE_URL + '/#website',
          url: BASE_URL + '/',
          name: 'WaiKwan',
          publisher: { '@id': BASE_URL + '/#organization' },
          inLanguage: ['en', 'zh']
        }
      ]
    });
    document.head.appendChild(script);
  }

  function run() {
    try {
      var canonicalAbs = normalizeCanonical();
      applySocialTags(canonicalAbs);
      injectOrganizationJsonLd();
    } catch (e) {}
  }

  // Run once when DOM is ready, and once after a short delay.
  // This helps pages where title/description are filled by i18n scripts.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      run();
      setTimeout(run, 800);
    });
  } else {
    run();
    setTimeout(run, 800);
  }
})();
