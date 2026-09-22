#!/usr/bin/env python3
"""Build a canonical-only sitemap with verified language alternates."""
from __future__ import annotations

import html as html_lib
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = "https://www.waikwantent.com"
EXCLUDE = {
    "404.html",
    "index.original.html",
    "index.wireframe.html",
    "test_logo.html",
    "test_stats.html",
    "product.html",
    "products.html",
    "tent-detail.html",
    "news/contact-us.html",
    "zh/news/contact-us.html",
}

CANONICAL_RE = re.compile(
    r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*\bhref=["\']([^"\']+)["\'][^>]*>',
    re.I,
)
ROBOTS_RE = re.compile(
    r'<meta\b(?=[^>]*\bname=["\']robots["\'])[^>]*\bcontent=["\']([^"\']+)["\'][^>]*>',
    re.I,
)
ALTERNATE_RE = re.compile(
    r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=["\']([^"\']+)["\'])'
    r'[^>]*\bhref=["\']([^"\']+)["\'][^>]*>',
    re.I,
)


def expected_url(rel: str) -> str:
    if rel == "index.html":
        return ORIGIN + "/"
    if rel == "zh/index.html":
        return ORIGIN + "/zh/"
    return ORIGIN + "/" + rel


def normalized_url(value: str) -> str:
    parts = urlsplit(html_lib.unescape(value.strip()))
    path = re.sub(r"/{2,}", "/", parts.path or "/")
    if path == "/index.html":
        path = "/"
    elif path == "/zh/index.html":
        path = "/zh/"
    return urlunsplit(("https", "www.waikwantent.com", path, parts.query, ""))


def content_dates() -> dict[str, str]:
    """Use content history, never checkout/copy timestamps, for sitemap lastmod."""
    try:
        history = subprocess.run(
            ["git", "log", "--format=DATE:%cs", "--name-only", "--", "*.html"],
            cwd=ROOT, check=True, capture_output=True, encoding="utf-8",
        ).stdout
        dates: dict[str, str] = {}
        date = None
        for line in history.splitlines():
            if line.startswith("DATE:"):
                date = line[5:]
            elif line.strip() and date:
                dates.setdefault(line.strip(), date)
        changed = subprocess.run(
            ["git", "diff", "--name-only", "HEAD", "--", "*.html"],
            cwd=ROOT, check=True, capture_output=True, encoding="utf-8",
        ).stdout
        for rel in changed.splitlines():
            dates[rel] = datetime.now(timezone.utc).date().isoformat()
        return dates
    except (OSError, subprocess.CalledProcessError):
        # lastmod is optional; omit it when a source archive has no Git history.
        return {}


def collect_pages() -> list[dict]:
    pages: list[dict] = []
    dates = content_dates()
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if rel in EXCLUDE or set(path.relative_to(ROOT).parts) & {
            "backend", ".git", "node_modules", "outputs", "dist", "build"
        }:
            continue
        source = path.read_text(encoding="utf-8", errors="replace")
        robots = ROBOTS_RE.search(source)
        if robots and "noindex" in robots.group(1).lower():
            continue
        canonical = CANONICAL_RE.search(source)
        if not canonical:
            continue
        url = normalized_url(canonical.group(1))
        if url != expected_url(rel):
            # Redirect, legacy, or duplicate page: never list it in the sitemap.
            continue
        alternates = {
            language: normalized_url(href)
            for language, href in ALTERNATE_RE.findall(source)
        }
        pages.append(
            {
                "url": url,
                "alternates": alternates,
                "lastmod": dates.get(rel),
            }
        )
    return pages


def main() -> None:
    pages = collect_pages()
    canonical_urls = {page["url"] for page in pages}
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for page in pages:
        lines.append("  <url>")
        lines.append(f"    <loc>{html_lib.escape(page['url'])}</loc>")
        if page["lastmod"]:
            lines.append(f"    <lastmod>{page['lastmod']}</lastmod>")
        for language, href in page["alternates"].items():
            if href not in canonical_urls:
                continue
            lines.append(
                '    <xhtml:link rel="alternate" '
                f'hreflang="{html_lib.escape(language)}" '
                f'href="{html_lib.escape(href)}" />'
            )
        lines.append("  </url>")
    lines.append("</urlset>")
    xml = "\n".join(lines) + "\n"
    # Keep the formerly submitted sitemap URL valid without stale SKU/duplicate URLs.
    for filename in ("sitemap.xml", "page-sitemap.xml"):
        (ROOT / filename).write_text(xml, encoding="utf-8")
    print(f"Wrote both sitemaps with {len(pages)} canonical URL(s).")


if __name__ == "__main__":
    main()
