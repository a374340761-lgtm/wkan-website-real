// Connect generated image variants and a readable initial hero to both homepages.
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('images/optimized/home/manifest.json', root), 'utf8'));
const dictionary = fs.readFileSync(new URL('scripts/multilang.js', root), 'utf8');
const start = dictionary.indexOf('this.translations = ');
const end = dictionary.indexOf('\n        this.init();', start);
const translations = vm.runInNewContext(`(${dictionary.slice(start + 'this.translations = '.length, end).trim().replace(/;$/, '')})`);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const set = (record) => record.variants.map((v) => `${v.url} ${v.width}w`).filter((v, i, a) => a.indexOf(v) === i).join(', ');
const hero = manifest['images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.jpg'];
const heroLarge = hero.variants[2];
for (const [file, lang] of [['index.html', 'en'], ['zh/index.html', 'zh']]) {
  const prefix = lang === 'zh' ? '/zh' : '';
  const t = translations[lang];
  const url = new URL(file, root);
  let html = fs.readFileSync(url, 'utf8');
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const source = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!source) return tag;
    const key = decodeURIComponent(source.split('?')[0]).replace(/^\//, '');
    const record = manifest[key];
    if (!record) return tag;
    const variant = record.variants[1];
    return tag.replace(/\s(?:src|srcset|sizes|width|height)="[^"]*"/g, '')
      .replace(/\s*\/?>$/, ` src="${variant.url}" srcset="${set(record)}" sizes="(max-width: 780px) 100vw, 600px" width="${variant.width}" height="${variant.height}">`);
  });
  fs.writeFileSync(url, html);
}
console.log('Updated responsive homepage images; original hero retained.');
