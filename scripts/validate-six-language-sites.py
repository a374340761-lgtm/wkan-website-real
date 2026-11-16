"""Fail closed on missing pages, invalid UTF-8, links, canonical and locale metadata."""
import json
from pathlib import Path
import subprocess
import sys
from urllib.parse import unquote, urljoin, urlsplit
from bs4 import BeautifulSoup, Comment
import re
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / 'scripts/six-language-config.json').read_text(encoding='utf-8'))
ORIGIN = 'https://www.waikwantent.com'


def validate():
    errors = []
    sitemap = ElementTree.parse(ROOT / 'sitemap.xml')
    sitemap_groups = {entry.findtext('{*}loc'): {tag.get('hreflang'): tag.get('href') for tag in entry.findall('{*}link')}
                      for entry in sitemap.findall('{*}url')}
    baseline = json.loads((ROOT / 'de/locale-map.json').read_text(encoding='utf-8'))['paths']
    for locale, config in CONFIG['locales'].items():
        folder = ROOT / locale
        manifest = folder / 'locale-map.json'
        if not manifest.is_file():
            errors.append(f'{locale}: missing generated site and manifest')
            continue
        data = json.loads(manifest.read_text(encoding='utf-8'))
        if data.get('version') != CONFIG['version']:
            errors.append(f'{locale}: version mismatch')
        for path in baseline:
            target = folder / path.lstrip('/')
            if path.endswith('/'):
                target /= 'index.html'
            if not target.is_file():
                errors.append(f'{locale}: missing route {path}')
        for page in folder.rglob('*.html'):
            raw = page.read_text(encoding='utf-8', errors='strict')
            if '\ufffd' in raw:
                errors.append(f'{page.relative_to(ROOT)}: replacement character')
            soup = BeautifulSoup(raw, 'html.parser')
            for text in soup.find_all(string=True):
                if not isinstance(text, Comment) and text.parent.name not in {'script', 'style'} and re.search(r'[\u3400-\u9fff]', str(text)):
                    if str(text).strip() not in {'中文', '简体中文', '广西伟群帐篷制造有限公司'}:
                        errors.append(f'{page.relative_to(ROOT)}: untranslated Chinese text')
            if not soup.html or soup.html.get('lang') != config['hreflang']:
                errors.append(f'{page.relative_to(ROOT)}: incorrect HTML language')
            path = '/' + page.relative_to(ROOT).as_posix()
            url = ORIGIN + (path[:-10] if re.fullmatch(r'/(?:fr|it|pt|nl|sv|da)/index.html', path) else path)
            robots = soup.select_one('meta[name="robots"]')
            if robots and 'noindex' not in robots.get('content', ''):
                canonical = soup.select_one('link[rel="canonical"]')
                if not canonical or canonical.get('href') != url:
                    errors.append(f'{path}: incorrect canonical')
                if not data.get('enabled'):
                    errors.append(f'{path}: preview page is indexable')
                group = sitemap_groups.get(url, {})
                if group.get(config['hreflang']) != url:
                    errors.append(f'{path}: missing self-referencing sitemap language')
                for language, target in group.items():
                    if language != 'x-default' and sitemap_groups.get(target, {}).get(config['hreflang']) != url:
                        errors.append(f'{path}: nonreciprocal sitemap alternate {language}')
            for tag in soup.select('[href], [src]'):
                value = tag.get('href') or tag.get('src')
                if not value or value.startswith(('#', 'mailto:', 'tel:', 'data:', 'javascript:')):
                    continue
                link = urlsplit(urljoin(url, value))
                if link.hostname != 'www.waikwantent.com':
                    continue
                target = ROOT / unquote(link.path).lstrip('/')
                if link.path.endswith('/'):
                    target /= 'index.html'
                if not target.exists():
                    errors.append(f'{path}: missing target {link.path}')
    return errors


if __name__ == '__main__':
    errors = validate()
    print('\n'.join(errors) if errors else 'Six-language static validation passed.')
    sys.exit(bool(errors))
