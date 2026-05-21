#!/usr/bin/env python3
"""Validate Product JSON-LD sku and required merchant fields in static HTML."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAX_SKU_LEN = 50
SKIP = {
    "googlead697dfed14475b1.html",
    "index.original.html",
    "index.wireframe.html",
    "test_logo.html",
    "test_stats.html",
    "news/contact-us.html",
    "zh/news/contact-us.html",
}

JSONLD_RE = re.compile(
    r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script>',
    re.IGNORECASE,
)
URL_LIKE = re.compile(r"^https?://", re.I)


def walk_html() -> list[Path]:
    out: list[Path] = []
    for path in ROOT.rglob("*.html"):
        rel = path.relative_to(ROOT).as_posix()
        if rel in SKIP or ".git" in rel.split("/"):
            continue
        out.append(path)
    return sorted(out)


def collect_products(node, products=None):
    products = products or []
    if isinstance(node, list):
        for item in node:
            collect_products(item, products)
    elif isinstance(node, dict):
        t = node.get("@type")
        types = t if isinstance(t, list) else ([t] if t else [])
        if "Product" in types:
            products.append(node)
        for v in node.values():
            if isinstance(v, (dict, list)):
                collect_products(v, products)
    return products


def validate_product(product: dict, rel: str) -> list[str]:
    issues: list[str] = []
    sku = product.get("sku")

    if sku is None or sku == "":
        issues.append(f"[{rel}] sku: missing or empty")
    elif isinstance(sku, list):
        issues.append(f"[{rel}] sku: array with {len(sku)} values -> {sku!r}")
    else:
        s = str(sku)
        if len(s) > MAX_SKU_LEN:
            issues.append(f"[{rel}] sku: longer than {MAX_SKU_LEN} ({len(s)}) -> {s!r}")
        if URL_LIKE.search(s) or "waikwantent.com" in s.lower():
            issues.append(f"[{rel}] sku: looks like URL -> {s!r}")
        if re.search(r"\s", s):
            issues.append(f"[{rel}] sku: contains spaces -> {s!r}")
        if re.search(r"[a-z]", s):
            issues.append(f"[{rel}] sku: contains lowercase -> {s!r}")
        if not re.fullmatch(r"[A-Z0-9\-_.~]+", s):
            issues.append(f"[{rel}] sku: unsafe characters -> {s!r}")

    if not product.get("name"):
        issues.append(f"[{rel}] name: missing Product.name")
    image = product.get("image")
    if not image or (isinstance(image, list) and len(image) == 0):
        issues.append(f"[{rel}] image: missing Product.image")

    offers = product.get("offers")
    if offers:
        offer_list = offers if isinstance(offers, list) else [offers]
        for offer in offer_list:
            if not isinstance(offer, dict):
                continue
            if not offer.get("url"):
                issues.append(f"[{rel}] offers.url: missing")
            if offer.get("price") is None and not offer.get("priceSpecification"):
                issues.append(f"[{rel}] offers.price: missing price/priceSpecification")

    return issues


def main() -> int:
    files = walk_html()
    all_issues: list[str] = []
    product_count = 0

    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        html = path.read_text(encoding="utf-8", errors="replace")
        for block in JSONLD_RE.findall(html):
            try:
                parsed = json.loads(block.strip())
            except json.JSONDecodeError:
                all_issues.append(f"[{rel}] json-ld: invalid JSON block")
                continue
            for product in collect_products(parsed):
                product_count += 1
                all_issues.extend(validate_product(product, rel))

    if not all_issues:
        print(
            f"OK: scanned {len(files)} HTML files, {product_count} Product schema item(s), no issues found."
        )
        return 0

    print(f"Found {len(all_issues)} issue(s) across {product_count} Product item(s):\n")
    for issue in all_issues:
        print(f"  {issue}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
