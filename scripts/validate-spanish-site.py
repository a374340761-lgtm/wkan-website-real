"""Apply the existing full-mirror validation to Spanish routes and sitemap."""
from pathlib import Path

source = Path(__file__).with_name('validate-german-site.py').read_text(encoding='utf-8')
for old, new in [('German', 'Spanish'), ('german', 'spanish'), ('/de/', '/es/'), ('"de"', '"es"')]:
    source = source.replace(old, new)
exec(compile(source, __file__, 'exec'), {'__name__': '__main__', '__file__': __file__})
