"""Synchronize Spanish hreflang with existing equivalent pages after a build."""
from pathlib import Path
import json
import re
import runpy
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.waikwantent.com'

def page_url(file):
    path = '/' + file
    return ORIGIN + (path[:-10] if path.endswith('/index.html') else path)

def sync():
    manifest = json.loads((ROOT/'es/locale-map.json').read_text(encoding='utf-8'))
    production_tracking = runpy.run_path(str(ROOT/'scripts/apply-google-tag-manager.py'))['expected']
    for target in sorted((ROOT/'es').rglob('*.html')):
        file = target.relative_to(ROOT/'es').as_posix()
        equivalents = [('en', file), ('zh-CN', 'zh/'+file), ('de', 'de/'+file), ('es', 'es/'+file)]
        equivalents = [(lang, name) for lang, name in equivalents if (ROOT/name).is_file()]
        spanish = BeautifulSoup(target.read_text(encoding='utf-8'), 'html.parser')
        for old in spanish.select('link[rel="alternate"][hreflang]'):
            old.decompose()
        for lang, name in equivalents:
            if manifest['enabled'] or lang != 'es':
                spanish.head.append(spanish.new_tag('link', rel='alternate', hreflang=lang, href=page_url(name)))
        if (ROOT/file).is_file():
            spanish.head.append(spanish.new_tag('link', rel='alternate', hreflang='x-default', href=page_url(file)))
        # Standalone templates also have explicit language links outside #langMenu.
        for link in spanish.select('a[hreflang]'):
            lang = link.get('hreflang')
            equivalent = next((name for code, name in equivalents if code == lang), None)
            if equivalent:
                link['href'] = page_url(equivalent).removeprefix(ORIGIN)
        markup = str(spanish)
        if manifest['enabled']:
            markup = production_tracking(markup) or markup
        target.write_text(markup, encoding='utf-8')
        for lang, name in equivalents:
            if lang == 'es':
                continue
            path = ROOT/name
            original = path.read_text(encoding='utf-8')
            # Preserve authored formatting and all unrelated head content.
            updated = re.sub(r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=["\']es["\'])[^>]*>\s*', '', original, flags=re.I)
            if manifest['enabled']:
                tag = f'<link rel="alternate" hreflang="es" href="{page_url("es/"+file)}"/>\n'
                updated = updated.replace('</head>', tag+'</head>', 1)
            if updated != original:
                path.write_text(updated, encoding='utf-8')
    print('Synchronized Spanish language alternates.')

if __name__ == '__main__':
    sync()
