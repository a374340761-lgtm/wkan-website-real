/** Shared compatibility routing for product.html and tent-detail.html in both locales. */
(function (root) {
  'use strict';

  function withHash(target, source) {
    target.hash = source.hash;
    return target.toString();
  }

  function legacyRouteTarget(href) {
    const url = new URL(href);
    const page = url.pathname.split('/').pop().toLowerCase();
    const params = url.searchParams;

    if (page === 'product.html') {
      const chosen = (params.get('sku') || params.get('id') || params.get('open') ||
        params.get('pid') || params.get('product') || params.get('model') || '').trim();
      if (!chosen) return withHash(new URL('all-products.html', url), url);
      const target = new URL('product-detail.html', url);
      target.searchParams.set('sku', chosen);
      return withHash(target, url);
    }

    if (page === 'tent-detail.html') {
      const id = (params.get('sku') || params.get('id') || '').trim();
      const foldingSeries = { '2001': 'folding30', '2002': 'folding40', '2003': 'folding50' };
      if (id && foldingSeries[id]) {
        const target = new URL('tent-type.html', url);
        target.searchParams.set('type', foldingSeries[id]);
        return withHash(target, url);
      }
      if (id) {
        const target = new URL('product-detail.html', url);
        target.searchParams.set('sku', id);
        return withHash(target, url);
      }
      const target = new URL('product-center.html', url);
      target.searchParams.set('cat', 'tents');
      return withHash(target, url);
    }

    throw new Error(`Unsupported legacy route: ${page || '(empty)'}`);
  }

  root.WK_legacyRouteTarget = legacyRouteTarget;
  try {
    root.location.replace(legacyRouteTarget(root.location.href));
  } catch (error) {
    // Keep the fallback link visible if a malformed URL cannot be mapped.
  }
})(window);
