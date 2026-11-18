"""Synchronize released, equivalent static pages and their language navigation."""
import json
from pathlib import Path
import re
import runpy
import time
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.waikwantent.com'
CONFIG = json.loads((ROOT / 'scripts/six-language-config.json').read_text(encoding='utf-8'))
LANGUAGES = {'en': ('', 'English'), 'zh-CN': ('zh', '简体中文'), 'de': ('de', 'Deutsch'), 'es': ('es', 'Español')}
LANGUAGES.update({c['hreflang']: (key, c['label']) for key, c in CONFIG['locales'].items()})


def write(page, text):
    # Windows indexers can briefly hold a static page open during local previews.
    for attempt in range(20):
        try:
            page.write_text(text, encoding='utf-8')
            return
        except PermissionError:
            if attempt == 19:
                raise
            time.sleep(0.2)


def url(page):
    path = '/' + page.relative_to(ROOT).as_posix()
    return ORIGIN + (path[:-10] if re.fullmatch(r'/(?:zh|de|es|fr|it|pt|nl|sv|da|ru)/index.html', path) else '/' if path == '/index.html' else path)


def sync():
    tracking = runpy.run_path(str(ROOT / 'scripts/apply-google-tag-manager.py'))['expected']
    paths = set()
    for locale in CONFIG['locales']:
        manifest = ROOT / locale / 'locale-map.json'
        data = json.loads(manifest.read_text(encoding='utf-8'))
        if not data.get('enabled'):
            raise ValueError('Cannot synchronize an unreleased locale: ' + locale)
        paths.update(p.relative_to(ROOT / locale).as_posix() for p in (ROOT / locale).rglob('*.html'))
    count = 0
    for suffix in sorted(paths):
        group = []
        for language, (prefix, label) in LANGUAGES.items():
            page = ROOT / prefix / suffix
            if page.is_file():
                text = page.read_text(encoding='utf-8')
                soup = BeautifulSoup(text, 'html.parser')
                robots = soup.select_one('meta[name="robots"]')
                canonical = soup.select_one('link[rel="canonical"]')
                indexable = (not robots or 'noindex' not in robots.get('content', '').lower()) and canonical and canonical.get('href') == url(page)
                group.append((language, prefix, label, page, text, soup, indexable))
        alternates = [(lang, url(page)) for lang, _, _, page, _, _, indexed in group if indexed]
        if any(lang == 'en' for lang, _ in alternates):
            alternates.append(('x-default', next(link for lang, link in alternates if lang == 'en')))
        for language, prefix, _, page, text, soup, indexed in group:
            if prefix in CONFIG['locales']:
                for anchor in soup.select('a[hreflang]'):
                    target = next((p for lang, _, _, p, _, _, _ in group if lang == anchor.get('hreflang')), None)
                    if target:
                        anchor['href'] = url(target).removeprefix(ORIGIN)
                text = str(soup)
            # Preserve existing authored formatting on the four established languages.
            text = re.sub(r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=)[^>]*>\s*', '', text, flags=re.I)
            tags = ''.join(f'<link rel="alternate" hreflang="{lang}" href="{link}"/>\n' for lang, link in alternates) if indexed else ''
            text = text.replace('</head>', tags + '</head>', 1)
            if prefix in CONFIG['locales']:
                text = tracking(text)
            # Existing runtime navigation reads published manifests; static head
            # alternates ensure correct switching before manifest requests complete.
            write(page, text)
            count += 1
    assets = r'(scripts/(?:bilingual-routing|multilang|products|all-products|cart|contact|customizer|product-search|seo)\.js)(?:\?v=[^"\'\s<>]+)?'
    for page in ROOT.rglob('*.html'):
        if any(part in {'.git', 'outputs', 'node_modules', 'backend'} for part in page.relative_to(ROOT).parts):
            continue
        old = page.read_text(encoding='utf-8')
        updated = re.sub(assets, lambda match: match[1] + '?v=' + CONFIG['version'], old)
        if updated != old:
            write(page, updated)
    print(f'Synchronized language alternates on {count} pages.')


if __name__ == '__main__':
    sync()
