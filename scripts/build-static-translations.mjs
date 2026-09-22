// Populate empty translation slots on canonical pages before delivery to crawlers.
// Existing authored copy and runtime language switching remain authoritative.
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = fs.readFileSync(new URL('scripts/multilang.js', root), 'utf8');
const start = source.indexOf('this.translations = ');
const end = source.indexOf('\n        this.init();', start);
if (start < 0 || end < 0) throw new Error('Translation dictionary boundaries not found');
const literal = source.slice(start + 'this.translations = '.length, end).trim().replace(/;$/, '');
const translations = vm.runInNewContext(`(${literal})`, {}, { timeout: 1000 });
const check = process.argv.includes('--check');
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sitemap = fs.readFileSync(new URL('sitemap.xml', root), 'utf8');
const files = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => {
  const url = new URL(loc);
  if (url.origin !== 'https://www.waikwantent.com' || url.search) throw new Error(`Unexpected canonical: ${loc}`);
  return url.pathname.slice(1) + (url.pathname.endsWith('/') ? 'index.html' : '');
});

function localizeLinks(content, language) {
  return content.replace(/\bhref=(["'])([^"']+)\1/g, (match, quote, href) => {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) return match;
    // Dictionary links are authored relative to the English root, not /news/ or /zh/.
    const url = new URL(href, 'https://www.waikwantent.com/');
    const file = url.pathname.slice(1) + (url.pathname.endsWith('/') ? 'index.html' : '');
    if (language === 'zh' && !file.startsWith('zh/') && fs.existsSync(new URL(`zh/${file}`, root))) {
      url.pathname = '/zh' + url.pathname;
    }
    return `href=${quote}${url.pathname}${url.search}${url.hash}${quote}`;
  });
}

let missing = 0;
const updates = [];
const errors = [];
for (const file of files) {
  const language = file.startsWith('zh/') ? 'zh' : 'en';
  const url = new URL(file, root);
  const html = fs.readFileSync(url, 'utf8');
  let count = 0;
  const updated = html.replace(/<([a-z][\w:-]*)\b([^>]*\bdata-(?:translate|i18n)=["']([^"']+)["'][^>]*)>\s*<\/\1>/gi,
    (match, tag, attributes, key) => {
      const text = translations[language]?.[key] || translations.en[key];
      if (typeof text !== 'string' || !text.trim()) {
        errors.push(`${file}: missing ${language} translation for ${key}`);
        return match;
      }
      count++;
      const content = /<[^>]+>/.test(text) ? localizeLinks(text, language) : escape(text);
      return `<${tag}${attributes}>${content}</${tag}>`;
    });
  missing += count;
  if (count) {
    updates.push([url, updated]);
    console.log(`${file}: ${count} empty translated elements ${check ? 'found' : 'filled'}`);
  }
}
if (errors.length) throw new Error(errors.join('\n'));
if (!check) for (const [url, updated] of updates) fs.writeFileSync(url, updated);
console.log(`${files.length} canonical pages checked; ${missing} empty slots; ${updates.length} affected pages.`);
if (check && missing) {
  console.error('Run node scripts/build-static-translations.mjs to populate static content.');
  process.exitCode = 1;
}
