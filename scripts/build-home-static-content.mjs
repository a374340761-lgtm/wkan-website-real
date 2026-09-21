// Keep homepage copy readable before JavaScript runs, using the runtime dictionary.
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const source = fs.readFileSync(new URL('scripts/multilang.js', root), 'utf8');
const start = source.indexOf('this.translations = ');
const end = source.indexOf('\n        this.init();', start);
if (start < 0 || end < 0) throw new Error('Translation dictionary boundaries not found');
const literal = source.slice(start + 'this.translations = '.length, end).trim().replace(/;$/, '');
const translations = vm.runInNewContext(`(${literal})`, {}, { timeout: 1000 });
const check = process.argv.includes('--check');
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let missing = 0;
for (const [file, language] of [['index.html', 'en'], ['zh/index.html', 'zh']]) {
  const url = new URL(file, root);
  const html = fs.readFileSync(url, 'utf8');
  let count = 0;
  const updated = html.replace(/<([a-z][\w:-]*)\b([^>]*\bdata-(?:translate|i18n)=["']([^"']+)["'][^>]*)>\s*<\/\1>/gi,
    (match, tag, attributes, key) => {
      const text = translations[language]?.[key];
      if (typeof text !== 'string' || !text.trim()) throw new Error(`${file}: missing ${language} translation for ${key}`);
      count++;
      // Match translatePage(): approved dictionary entries can contain inline markup.
      const content = /<[^>]+>/.test(text) ? text : escape(text);
      return `<${tag}${attributes}>${content}</${tag}>`;
    });
  missing += count;
  if (!check && count) fs.writeFileSync(url, updated);
  console.log(`${file}: ${count} empty translated elements ${check ? 'found' : 'filled'}`);
}
if (check && missing) {
  console.error(`Run node ${fileURLToPath(import.meta.url)} to populate static homepage copy.`);
  process.exitCode = 1;
}
