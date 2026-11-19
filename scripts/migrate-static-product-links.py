import argparse
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINK = re.compile(r"""(href=["'])(?:https://www\.waikwantent\.com)?(?:[\w./-]*/)?product-detail\.html\?sku=([\w-]+)(?=["'])""", re.I)


def static_product_slugs():
    source = (ROOT / 'scripts/products.js').read_text(encoding='utf-8')
    routes = source.split('const WK_STATIC_PRODUCT_SLUGS = Object.freeze({', 1)[1].split('});', 1)[0]
    return {sku.lower(): slug for sku, slug in re.findall(r"'([^']+)': '([^']+)'", routes)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    slugs = static_product_slugs()
    paths = subprocess.check_output(['git', 'ls-files', '-z', '*.html'], cwd=ROOT).decode().split(chr(0))
    total = 0
    for relative in paths:
        if not relative or relative.startswith(('outputs/', 'reports/')):
            continue
        path = ROOT / relative
        content = path.read_bytes().decode('utf-8')
        locale = relative.split('/')[0] if '/' in relative else ''

        def replace(match):
            nonlocal total
            slug = slugs.get(match[2].lower())
            if not slug:
                return match[0]
            target = f'products/{slug}.html'
            if locale and (ROOT / locale / target).is_file():
                target = f'{locale}/{target}'
            total += 1
            return f'{match[1]}/{target}'

        updated = LINK.sub(replace, content)
        if updated != content and not args.check:
            path.write_bytes(updated.encode('utf-8'))
    print(f'{total} legacy links with a static equivalent')
    return int(args.check and total > 0)


if __name__ == '__main__':
    raise SystemExit(main())
