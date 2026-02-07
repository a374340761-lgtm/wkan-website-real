/*
  SEO head helpers (static-site friendly)
  - Ensures canonical link exists and is consistent
  - Fills OpenGraph/Twitter URL + image with absolute URLs
  - Normalizes canonical for product detail pages
*/
(function () {
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
    try {
      return new URL(maybeUrl, window.location.origin + window.location.pathname.replace(/[^/]*$/, '')).toString();
    } catch (e) {
      try {
        return new URL(maybeUrl, window.location.origin).toString();
      } catch (e2) {
        return '';
      }
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

        // Product detail canonical must reflect sku normalization.
        ensureCanonical(url.toString());
        return url.toString();
      }

      // Legacy entry points should not be canonical.
      if (/\b(product\.html|tent-detail\.html)\b/i.test(url.pathname)) {
        // Prefer canonical target without trying to guess SKU.
        var target = new URL('product-detail.html', url);
        var maybeSku = (url.searchParams.get('sku') || url.searchParams.get('id') || '').trim();
        if (maybeSku) target.searchParams.set('sku', maybeSku);
        ensureCanonical(target.toString());
        return target.toString();
      }

      // If the HTML already declared a canonical, keep it (but make it absolute).
      if (existing) return existing;

      ensureCanonical(url.toString());
      return url.toString();
    } catch (e) {
      return '';
    }
  }

  function applySocialTags(canonicalAbs) {
    var title = String(document.title || '').trim() || 'WaiKwan';
    var desc = getDescription();

    // Choose a stable default hero image
    var defaultImg = 'images/hero/Waikwantentshero.png';
    var ogImg = (document.head.querySelector('meta[property="og:image"]') || document.head.querySelector('meta[name="twitter:image"]'));
    var imgContent = (ogImg && ogImg.getAttribute('content')) || defaultImg;

    var absUrl = canonicalAbs || (function () { try { return new URL(window.location.href).toString(); } catch { return ''; } })();
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

  function run() {
    try {
      var canonicalAbs = normalizeCanonical();
      applySocialTags(canonicalAbs);
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
