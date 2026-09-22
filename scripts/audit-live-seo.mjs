// Read-only HTTP checks; no Search Console credentials or private data required.
import fs from 'node:fs';
const paths = ['https://waikwantent.com/', 'http://www.waikwantent.com/',
  'https://www.waikwantent.com/', 'https://www.waikwantent.com/robots.txt',
  'https://www.waikwantent.com/sitemap.xml',
  'https://www.waikwantent.com/custom-canopy-tent-manufacturer.html',
  'https://www.waikwantent.com/portable-display-systems.html',
  'https://www.waikwantent.com/product-detail.html?sku=2001',
  'https://www.waikwantent.com/does-not-exist-seo-audit-20260922.html'];
const results = await Promise.all(paths.map(async url => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    const html = await response.text();
    return { url, status: response.status, finalUrl: response.url,
      server: response.headers.get('server'), bytes: Buffer.byteLength(html),
      title: html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1],
      canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1],
      emptyTranslationSlots: [...html.matchAll(/<([a-z][\w:-]*)\b[^>]*\bdata-(?:translate|i18n)=["'][^"']+["'][^>]*>\s*<\/\1>/gi)].length,
      text: url.endsWith('robots.txt') ? html : undefined };
  } catch (error) { return { url, error: error.message }; }
}));
const report = { checkedAt: new Date().toISOString(), results };
fs.writeFileSync(new URL('../reports/live-seo-audit-2026-09-22.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
