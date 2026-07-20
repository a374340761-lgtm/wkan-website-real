#!/usr/bin/env python3
"""Apply repeatable SEO hygiene fixes to the static HTML site."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {
    "googlead697dfed14475b1.html",
    "index.original.html",
    "index.wireframe.html",
    "test_logo.html",
    "test_stats.html",
}


def remove_element_by_id(html: str, element: str, element_id: str) -> str:
    pattern = re.compile(
        rf"\s*<{element}\b(?=[^>]*\bid=[\"']{re.escape(element_id)}[\"'])[^>]*>"
        rf"[\s\S]*?</{element}>\s*",
        re.IGNORECASE,
    )
    return pattern.sub("\n", html)


def clean_product_schema(match: re.Match[str]) -> str:
    opening, body, closing = match.groups()
    try:
        data = json.loads(body.strip())
    except json.JSONDecodeError:
        return match.group(0)

    nodes = data if isinstance(data, list) else [data]
    changed = False
    for node in nodes:
        if not isinstance(node, dict):
            continue
        types = node.get("@type")
        types = types if isinstance(types, list) else [types]
        if "Product" not in types:
            continue
        offers = node.get("offers")
        offer_nodes = offers if isinstance(offers, list) else [offers]
        if any(
            isinstance(offer, dict)
            and str(offer.get("price", "")).strip() in {"0", "0.0", "0.00"}
            for offer in offer_nodes
        ):
            # Quote-only products have no public price. A fabricated zero-dollar
            # Offer is less accurate than omitting Offer entirely.
            node.pop("offers", None)
            changed = True

    if not changed:
        return match.group(0)
    rendered = json.dumps(data, ensure_ascii=False, indent=2)
    return f"{opening}\n{rendered}\n    {closing}"


def schema_priority(schema_type: str, opening: str) -> int:
    id_match = re.search(r"\bid=[\"']([^\"']+)[\"']", opening, re.I)
    element_id = id_match.group(1).lower() if id_match else ""
    preferred = {
        "FAQPage": ("wk-schema-faq", "wk-home-faq-schema", "wk-geo-product-faq-schema"),
        "BreadcrumbList": ("wk-schema-breadcrumb",),
        "Organization": ("wk-geo-org-schema", "wk-org-jsonld"),
        "WebSite": ("wk-geo-website-schema",),
        "WebPage": ("wk-auto-webpage-schema", "wk-webpage-jsonld"),
    }
    for index, candidate in enumerate(preferred.get(schema_type, ())):
        if element_id == candidate:
            return 100 - index
    if "auto" in element_id:
        return 10
    return 50


def top_level_types(data) -> set[str]:
    types: set[str] = set()
    nodes = data if isinstance(data, list) else [data]
    for node in nodes:
        if not isinstance(node, dict):
            continue
        value = node.get("@type")
        if isinstance(value, str):
            types.add(value)
        elif isinstance(value, list):
            types.update(str(item) for item in value)
        graph = node.get("@graph")
        if isinstance(graph, list):
            for item in graph:
                if not isinstance(item, dict):
                    continue
                graph_type = item.get("@type")
                if isinstance(graph_type, str):
                    types.add(graph_type)
                elif isinstance(graph_type, list):
                    types.update(str(entry) for entry in graph_type)
    return types


def deduplicate_schema(html: str) -> str:
    jsonld = re.compile(
        r"<script\b[^>]*type=[\"']application/ld\+json[\"'][^>]*>"
        r"[\s\S]*?</script>",
        re.IGNORECASE,
    )
    tracked = {"FAQPage", "BreadcrumbList", "Organization", "WebSite", "WebPage"}
    parsed = []
    for match in jsonld.finditer(html):
        opening = match.group(0).split(">", 1)[0] + ">"
        body = match.group(0).split(">", 1)[1].rsplit("</script>", 1)[0]
        try:
            data = json.loads(body.strip())
        except json.JSONDecodeError:
            continue
        parsed.append((match, opening, top_level_types(data)))

    remove: set[tuple[int, int]] = set()
    for schema_type in tracked:
        candidates = [
            item for item in parsed if schema_type in item[2]
        ]
        if len(candidates) < 2:
            continue
        winner = max(
            candidates,
            key=lambda item: schema_priority(schema_type, item[1]),
        )
        for match, _, _ in candidates:
            if match is not winner[0]:
                remove.add((match.start(), match.end()))

    for start, end in sorted(remove, reverse=True):
        html = html[:start] + "\n" + html[end:]
    return html


def process(path: Path) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    if rel in SKIP or "backend/" in rel:
        return False

    original = path.read_text(encoding="utf-8", errors="replace")
    html = original

    # The /zh/seo/ mirror pages currently contain mostly English template copy.
    # Keep them available to editors and users, but do not index them until a
    # fluent reviewer has completed the page-specific Chinese localization.
    if rel.startswith("zh/seo/"):
        html = re.sub(
            r'(<meta\b(?=[^>]*\bname=["\']robots["\'])[^>]*\bcontent=["\'])[^"\']*(["\'][^>]*>)',
            r"\1noindex,follow\2",
            html,
            count=1,
            flags=re.IGNORECASE,
        )

    # A noindex translation must not be advertised as a search-result alternate.
    if rel.startswith("seo/"):
        html = re.sub(
            r'\s*<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=["\']zh-CN["\'])[^>]*>\s*',
            "\n",
            html,
            flags=re.IGNORECASE,
        )

    # Google ignores meta keywords and geo meta tags. Removing them avoids
    # duplicated keyword lists and prevents them being mistaken for targeting.
    html = re.sub(
        r"\s*<meta\b[^>]*\bname=[\"']keywords[\"'][^>]*>\s*",
        "\n",
        html,
        flags=re.IGNORECASE,
    )
    html = re.sub(
        r"\s*<meta\b[^>]*\bname=[\"'](?:geo\.(?:region|placename|position)|ICBM)[\"'][^>]*>\s*",
        "\n",
        html,
        flags=re.IGNORECASE,
    )

    # Organization is the correct global B2B entity. The repeated LocalBusiness
    # block appeared on every page and duplicated the homepage Organization.
    html = remove_element_by_id(html, "script", "wk-schema-local-business")

    # Keep authored, page-specific schema and remove generated duplicates.
    if 'id="wk-schema-breadcrumb"' in html or "id='wk-schema-breadcrumb'" in html:
        html = remove_element_by_id(html, "script", "wk-auto-breadcrumb-schema")
    if 'id="wk-schema-faq"' in html or "id='wk-schema-faq'" in html:
        html = remove_element_by_id(html, "script", "wk-auto-faq-presence-schema")

    jsonld = re.compile(
        r"(<script\b[^>]*type=[\"']application/ld\+json[\"'][^>]*>)"
        r"([\s\S]*?)(</script>)",
        re.IGNORECASE,
    )
    html = jsonld.sub(clean_product_schema, html)
    html = deduplicate_schema(html)

    # A document can only have one HTML title. Older templates sometimes left a
    # short placeholder before the final translated title; keep the final title.
    title_re = re.compile(r"\s*<title\b[^>]*>[\s\S]*?</title>\s*", re.IGNORECASE)
    title_matches = list(title_re.finditer(html))
    for match in reversed(title_matches[:-1]):
        html = html[: match.start()] + "\n" + html[match.end() :]

    html = re.sub(
        r'\s*<link href="https://fonts\.googleapis\.com" rel="preconnect">\s*'
        r'<link href="https://fonts\.gstatic\.com" rel="preconnect" crossorigin>\s*',
        "\n",
        html,
        flags=re.IGNORECASE,
    )
    if "fonts.googleapis.com/css" in html:
        hints = (
            '    <link href="https://fonts.googleapis.com" rel="preconnect">\n'
            '    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>\n'
        )
        html = re.sub(
            r'(?=<link\b[^>]*href="https://fonts\.googleapis\.com/css)',
            hints,
            html,
            count=1,
            flags=re.IGNORECASE,
        )

    if "/scripts/analytics.js" not in html and "</head>" in html.lower():
        html = re.sub(
            r"</head>",
            '    <script src="/scripts/analytics.js" defer></script>\n</head>',
            html,
            count=1,
            flags=re.IGNORECASE,
        )

    html = "\n".join(line.rstrip() for line in html.splitlines()) + "\n"

    if html == original:
        return False
    path.write_text(html, encoding="utf-8", newline="\n")
    return True


def main() -> None:
    changed = 0
    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts:
            continue
        changed += int(process(path))
    print(f"SEO hardening updated {changed} HTML file(s).")


if __name__ == "__main__":
    main()
