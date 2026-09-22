"""Read-only content audit of canonical HTML, including the pre-change Git version."""
import json
import re
import subprocess
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.titles = []
        self.main = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        if tag in {'script', 'style', 'title', 'main'}:
            self.stack.append(tag)
        if tag == 'img':
            self.images.append(dict(attrs))

    def handle_endtag(self, tag):
        if tag in self.stack:
            self.stack.remove(tag)

    def handle_data(self, data):
        if 'script' in self.stack or 'style' in self.stack:
            return
        if 'title' in self.stack:
            self.titles.append(data)
        if 'main' in self.stack:
            self.main.append(data)

empty = re.compile(r'<([a-z][\w:-]*)\b[^>]*\bdata-(?:translate|i18n)=["\'][^"\']+["\'][^>]*>\s*</\1>', re.I)
rows = []
titles = defaultdict(list)
for loc in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc'):
    url = urlsplit(loc.text)
    rel = url.path.lstrip('/') + ('index.html' if url.path.endswith('/') else '')
    source = (ROOT / rel).read_text(encoding='utf-8')
    baseline = subprocess.run(['git', 'show', f'HEAD:{rel}'], cwd=ROOT, capture_output=True, encoding='utf-8').stdout
    page = Page()
    page.feed(source)
    title = ''.join(page.titles)
    titles[title].append(rel)
    rows.append({'file': rel, 'title': title,
                 'empty_slots_before': len(empty.findall(baseline)),
                 'empty_slots_after': len(empty.findall(source)),
                 'main_text_characters': len(' '.join(' '.join(page.main).split())),
                 'images_without_alt': sum('alt' not in image for image in page.images),
                 'images_without_dimensions': sum(not image.get('width') or not image.get('height') for image in page.images)})
assets = sorted(({'path': p.relative_to(ROOT).as_posix(), 'bytes': p.stat().st_size}
                 for p in (ROOT / 'images/hero').rglob('*') if p.is_file()), key=lambda p: p['bytes'], reverse=True)[:10]
report = {'pages': len(rows),
          'empty_slots_before': sum(r['empty_slots_before'] for r in rows),
          'empty_slots_after': sum(r['empty_slots_after'] for r in rows),
          'duplicate_titles': {k: v for k, v in titles.items() if len(v) > 1},
          'largest_hero_assets': assets, 'details': rows}
(ROOT / 'reports/static-seo-audit-2026-09-22.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: v for k, v in report.items() if k != 'details'}, ensure_ascii=False, indent=2))
