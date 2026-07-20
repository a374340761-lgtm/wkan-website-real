#!/usr/bin/env python3
"""Validate indexability, canonical URLs, language links, and JSON-LD hygiene."""
from __future__ import annotations

import json
from html import unescape as html_unescape
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = "https://www.waikwantent.com"
SKIP = {
    "404.html",
    "googlead697dfed14475b1.html",
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
JSONLD_RE = re.compile(
    r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script>',
    re.I,
)


def tags(source: str, pattern: str) -> list[str]:
    return re.findall(pattern, source, flags=re.I)


def collect_types(node, output: list[str]) -> None:
    if isinstance(node, list):
        for item in node:
            collect_types(item, output)
    elif isinstance(node, dict):
        value = node.get("@type")
        if isinstance(value, str):
            output.append(value)
        elif isinstance(value, list):
            output.extend(str(item) for item in value)
        graph = node.get("@graph")
        if isinstance(graph, list):
            collect_types(graph, output)


def expected_url(rel: str) -> str:
    if rel == "index.html":
        return ORIGIN + "/"
    if rel == "zh/index.html":
        return ORIGIN + "/zh/"
    return ORIGIN + "/" + rel


def main() -> int:
    issues: list[str] = []
    canonicals: dict[str, str] = {}

    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if rel in SKIP or "backend/" in rel or ".git/" in rel:
            continue
        source = path.read_text(encoding="utf-8", errors="replace")
        robots = tags(
            source,
            r'<meta\b(?=[^>]*name=["\']robots["\'])[^>]*content=["\']([^"\']+)["\']',
        )
        if robots and "noindex" in robots[0].lower():
            continue

        canonical = tags(
            source,
            r'<link\b(?=[^>]*rel=["\']canonical["\'])[^>]*href=["\']([^"\']+)["\']',
        )
        if len(canonical) != 1:
            issues.append(f"[{rel}] expected one canonical, found {len(canonical)}")
        else:
            canonicals[rel] = canonical[0]
            if canonical[0] != expected_url(rel):
                issues.append(f"[{rel}] non-self canonical: {canonical[0]}")

        for label, pattern in (
            ("title", r"<title\b[^>]*>([\s\S]*?)</title>"),
            ("description", r'<meta\b(?=[^>]*name=["\']description["\'])[^>]*content=["\']([^"\']+)["\']'),
            ("H1", r"<h1\b[^>]*>([\s\S]*?)</h1>"),
        ):
            found = tags(source, pattern)
            if len(found) != 1:
                issues.append(f"[{rel}] expected one {label}, found {len(found)}")

        hreflangs = tags(
            source,
            r'<link\b(?=[^>]*rel=["\']alternate["\'])(?=[^>]*hreflang=["\']([^"\']+)["\'])'
            r'[^>]*href=["\']([^"\']+)["\']',
        )
        language_counts = Counter(language.lower() for language, _ in hreflangs)
        repeated = [language for language, count in language_counts.items() if count > 1]
        if repeated:
            issues.append(f"[{rel}] duplicate hreflang values: {', '.join(repeated)}")
        for language, href in hreflangs:
            parts = urlsplit(href)
            if parts.scheme != "https" or parts.netloc != "www.waikwantent.com":
                issues.append(f"[{rel}] invalid {language} alternate: {href}")

        hrefs = tags(source, r'<a\b[^>]*\bhref=["\']([^"\']+)["\']')
        for href in hrefs:
            value = html_unescape(href).strip()
            if not value or value.startswith("#") or value.startswith("//"):
                continue
            parts = urlsplit(value)
            if parts.scheme in {"http", "https", "mailto", "tel", "javascript", "data"}:
                continue
            link_path = unquote(parts.path).replace("\\", "/")
            if not link_path or (not link_path.endswith(".html") and not link_path.endswith("/")):
                continue
            if link_path.startswith("/"):
                target = ROOT / link_path.lstrip("/")
            else:
                target = path.parent / link_path
            if link_path.endswith("/"):
                target = target / "index.html"
            if not target.exists():
                issues.append(f"[{rel}] broken internal link: {href}")

        if "/scripts/analytics.js" not in source:
            issues.append(f"[{rel}] analytics event helper missing")

        schema_types: list[str] = []
        for block in JSONLD_RE.findall(source):
            try:
                data = json.loads(block.strip())
            except json.JSONDecodeError as exc:
                issues.append(f"[{rel}] invalid JSON-LD: {exc.msg}")
                continue
            collect_types(data, schema_types)
            if re.search(r'"price"\s*:\s*"?(?:0|0\.0+)"?', block):
                issues.append(f"[{rel}] zero-price structured data")
        counts = Counter(schema_types)
        for schema_type in ("Organization", "WebSite", "WebPage", "BreadcrumbList", "FAQPage", "Product"):
            if counts[schema_type] > 1:
                issues.append(f"[{rel}] duplicate {schema_type} schema ({counts[schema_type]})")

    sitemap = ElementTree.parse(ROOT / "sitemap.xml")
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    sitemap_urls = {
        item.text.strip()
        for item in sitemap.findall(".//sm:loc", namespace)
        if item.text
    }
    expected_urls = set(canonicals.values())
    for missing in sorted(expected_urls - sitemap_urls):
        issues.append(f"[sitemap.xml] missing canonical URL: {missing}")
    for extra in sorted(sitemap_urls - expected_urls):
        issues.append(f"[sitemap.xml] non-canonical or excluded URL: {extra}")

    if issues:
        print(f"Found {len(issues)} SEO validation issue(s):")
        for issue in issues:
            print(f"  {issue}")
        return 1
    print(f"OK: validated {len(canonicals)} indexable HTML pages and sitemap coverage.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
