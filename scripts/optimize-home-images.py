"""Build responsive homepage copies from original photography (never alter originals)."""
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / 'images/optimized/home'
MANIFEST = DEST / 'manifest.json'
DEST.mkdir(parents=True, exist_ok=True)
sources = set(json.loads(MANIFEST.read_text('utf-8')) if MANIFEST.exists() else [])
for file in ['index.html', 'zh/index.html']:
    for source in re.findall(r'<img\b[^>]*\bsrc="([^"]+)"', (ROOT / file).read_text('utf-8')):
        source = unquote(source.split('?')[0]).lstrip('/')
        path = ROOT / source
        if not source.startswith('images/optimized/') and path.exists() and path.stat().st_size > 180_000:
            sources.add(source)
sources.update([
    'images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.jpg',
    'images/hero/custom-beach-flags-feather-teardrop-flags-outdoor.png',
    'images/hero/aluminum-profile-fabric-light-box-display-wall.jpeg',
    'news/images/Sign China 2026/sign-china-2026-shanghai-03.webp',
])
manifest = {}
for source in sorted(sources):
    with Image.open(ROOT / source) as original:
        image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
        base = re.sub(r'[^a-z0-9]+', '-', Path(source).stem.lower()).strip('-')
        base += '-' + hashlib.sha256(source.encode()).hexdigest()[:8]
        variants = []
        for width in [480, 800, 1600]:
            resized = image.copy()
            resized.thumbnail((width, 10000), Image.Resampling.LANCZOS)
            file = DEST / f'{base}-{width}.webp'
            resized.save(file, 'WEBP', quality=80, method=6)
            variants.append({'url': '/' + file.relative_to(ROOT).as_posix(), 'width': resized.width,
                             'height': resized.height, 'bytes': file.stat().st_size})
        manifest[source] = {'originalBytes': (ROOT / source).stat().st_size, 'variants': variants}
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Built responsive copies for {len(manifest)} source images; originals preserved.')
