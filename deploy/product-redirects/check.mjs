import assert from 'node:assert/strict';
import worker from './worker.mjs';
import { acceptedSkus, staticProducts } from './catalog.mjs';

const forwarded = new Response('origin');
globalThis.fetch = async request => new URL(request.url).pathname === '/404.html'
  ? new Response('Not found')
  : forwarded;

for (const prefix of ['', '/zh']) {
  const base = `https://www.waikwantent.com${prefix}/product-detail.html`;
  for (const sku of new Set([...acceptedSkus, ...Object.keys(staticProducts)])) {
    const url = new URL(base);
    url.searchParams.set('sku', sku);
    url.searchParams.set('utm_source', 'check');
    const result = await worker.fetch(new Request(url));
    const slug = staticProducts[sku.toLowerCase()];
    if (slug) {
      assert.equal(result.status, 301, sku);
      assert.equal(result.headers.get('location'),
        `https://www.waikwantent.com${prefix}/products/${slug}.html?utm_source=check`);
    } else {
      assert.equal(result, forwarded, sku);
    }
  }
  for (const method of ['GET', 'HEAD']) {
    const result = await worker.fetch(new Request(base + '?sku=nonexistent-test-sku', { method }));
    assert.equal(result.status, 404);
    assert.equal(await result.text(), method === 'HEAD' ? '' : 'Not found');
  }
  assert.equal(await worker.fetch(new Request(base)), forwarded);
}
console.log('Product edge checks passed.');
