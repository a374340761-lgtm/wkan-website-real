#!/usr/bin/env python3
"""Install the consent-aware Google Tag Manager container on every site HTML page."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GTM_ID = "GTM-TVQFLJP7"
SKIP_DIRS = {".git", "backend", "node_modules", "outputs", "dist", "build"}

HEAD_SNIPPET = f"""<!-- Google Consent Mode default -->
<script>
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){{dataLayer.push(arguments);}};
window.gtag('consent','default',{{
  analytics_storage:'denied',
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
}});
</script>
<!-- End Google Consent Mode default -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
}})(window,document,'script','dataLayer','{GTM_ID}');</script>
<!-- End Google Tag Manager -->"""

BODY_SNIPPET = f"""<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

HEAD_BLOCK_RE = re.compile(
    r"[ \t]*<!-- Google Consent Mode default -->.*?<!-- End Google Tag Manager -->[ \t]*\r?\n?",
    re.S,
)
BODY_BLOCK_RE = re.compile(
    r"[ \t]*<!-- Google Tag Manager \(noscript\) -->.*?<!-- End Google Tag Manager \(noscript\) -->[ \t]*\r?\n?",
    re.S,
)


def expected(source: str) -> str | None:
    if not re.search(r"<head\b[^>]*>", source, re.I) or not re.search(r"<body\b[^>]*>", source, re.I):
        return None
    clean = HEAD_BLOCK_RE.sub("", source, count=1)
    clean = BODY_BLOCK_RE.sub("", clean, count=1)
    clean = re.sub(
        r"(<head\b[^>]*>)",
        lambda match: match.group(1) + "\n" + HEAD_SNIPPET,
        clean,
        count=1,
        flags=re.I,
    )
    clean = re.sub(
        r"(<body\b[^>]*>)",
        lambda match: match.group(1) + "\n" + BODY_SNIPPET,
        clean,
        count=1,
        flags=re.I,
    )
    return clean


def main() -> int:
    check = "--check" in sys.argv
    changed: list[str] = []
    checked = 0
    for path in sorted(ROOT.rglob("*.html")):
        rel_path = path.relative_to(ROOT)
        if set(rel_path.parts) & SKIP_DIRS:
            continue
        source = path.read_text(encoding="utf-8", errors="replace")
        output = expected(source)
        if output is None:
            continue
        checked += 1
        if output == source:
            continue
        changed.append(rel_path.as_posix())
        if not check:
            path.write_text(output, encoding="utf-8")

    if check and changed:
        print(f"Found {len(changed)} HTML page(s) without the current {GTM_ID} snippets:")
        for rel in changed[:30]:
            print(f"  {rel}")
        return 1
    if check:
        print(f"OK: {checked} HTML pages contain the current {GTM_ID} snippets.")
    else:
        print(f"Updated {len(changed)} of {checked} HTML pages with {GTM_ID}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
