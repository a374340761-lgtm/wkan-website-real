import { acceptedSkus, staticProducts } from './catalog.mjs';

const products = new Map(Object.entries(staticProducts));
const accepted = new Set(acceptedSkus);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/(zh\/)?product-detail\.html$/);
    if (!match || !['GET', 'HEAD'].includes(request.method)) return fetch(request);
    const sku = url.searchParams.get('sku')?.trim();
    if (!sku) return fetch(request);
    const slug = products.get(sku.toLowerCase());
    if (!slug) {
      if (accepted.has(sku)) return fetch(request);
      const errorPage = await fetch(new Request(new URL('/404.html', url), { method: request.method }));
      return new Response(request.method === 'HEAD' ? null : errorPage.body, {
        status: 404,
        headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    const target = new URL(`/${match[1] || ''}products/${slug}.html`, 'https://www.waikwantent.com');
    url.searchParams.delete('sku');
    target.search = url.search;
    return Response.redirect(target, 301);
  },
};
