#!/usr/bin/env python3
"""Patch Product JSON-LD sku values on SEO landing pages (mirrors seo-page-sku-map.mjs)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SEO_PAGE_SKU_MAP = {
    "advertising-flag-pole-and-base-wholesale-supplier-b2b": "FLG-HUB-BASE-ACC",
    "replacement-beach-flag-pole-base-supplier-wholesale": "FLG-HUB-BASE-ACC",
    "portable-trade-show-booth-backdrop-manufacturer-export": "42002",
    "portable-backdrop-display-system-supplier-wholesale": "42002",
    "aluminum-frame-pop-up-tent-factory-direct-export": "2002",
    "aluminum-frame-fabric-display-manufacturer-custom-branding": "WK-HZ",
    "beach-flag-manufacturer-wholesale-feather-teardrop-flags": "FLG-HUB-FGF",
    "branded-promotional-tent-supplier-b2b-bulk-orders": "2003",
    "collapsible-display-system-wholesale-distributor-pricing": "42003",
    "commercial-grade-pop-up-canopy-wholesale-supplier": "2003",
    "custom-beach-flag-kit-supplier-for-agencies": "FLG-BP-ST-HUB",
    "custom-canopy-tent-factory-for-reseller-programs": "2001",
    "custom-printed-canopy-tent-manufacturer-oem-china": "2001",
    "custom-printed-feather-flag-supplier-bulk-order-oem": "FLG-HUB-FGF",
    "double-sided-beach-flag-manufacturer-export-quality": "FLG-HUB-FGF",
    "event-feather-flag-printing-manufacturer-factory-direct": "FLG-HUB-FGF",
    "exhibition-tent-frame-and-fabric-manufacturer-odm": "2002",
    "fabric-tension-backwall-supplier-bulk-for-rental-companies": "WK-HZ-STRAIGHT",
    "folding-event-tent-supplier-wholesale-moq": "2001",
    "heavy-duty-gazebo-tent-wholesale-manufacturer-europe-shipping": "2003",
    "modular-exhibition-display-hardware-manufacturer-odm": "42003",
    "outdoor-advertising-tent-oem-supplier-custom-sizes": "2002",
    "outdoor-promotional-flag-system-manufacturer-oem": "FLG-BP-ST-HUB",
    "pop-up-display-stand-wholesale-supplier-for-events": "42003",
    "quick-setup-display-frame-supplier-oem-graphics": "42003",
    "seg-fabric-light-box-manufacturer-b2b-custom-sizes": "WK-LB-AP",
    "teardrop-flag-hardware-supplier-for-print-shops": "FLG-HUB-FGT",
    "tension-fabric-display-wall-manufacturer-oem-trade-show": "WK-HZ-STRAIGHT",
    "trade-show-canopy-tent-manufacturer-for-distributors": "2002",
    "wind-sail-banner-flag-wholesale-supplier-moq": "FLG-BP-ST-HUB",
}

PRODUCT_SCRIPT_RE = re.compile(
    r'(<script\b[^>]*id=["\']wk-schema-product["\'][^>]*>\s*)([\s\S]*?)(\s*</script>)',
    re.IGNORECASE,
)


def format_json_block(data: dict) -> str:
    body = json.dumps(data, indent=2, ensure_ascii=False)
    return "\n".join(f"    {line}" for line in body.splitlines())


def patch_file(path: Path) -> tuple[bool, str | None]:
    slug = path.stem
    sku = SEO_PAGE_SKU_MAP.get(slug)
    if not sku:
        return False, f"no map entry for slug {slug}"

    html = path.read_text(encoding="utf-8")
    match = PRODUCT_SCRIPT_RE.search(html)
    if not match:
        return False, "wk-schema-product block not found"

    try:
        data = json.loads(match.group(2).strip())
    except json.JSONDecodeError as exc:
        return False, f"invalid JSON-LD: {exc}"

    if data.get("@type") != "Product":
        return False, "not a Product schema block"

    old_sku = data.get("sku")
    if old_sku == sku:
        return False, None

    data["sku"] = sku
    replacement = f"{match.group(1)}{format_json_block(data)}{match.group(3)}"
    updated = html[: match.start()] + replacement + html[match.end() :]
    path.write_text(updated, encoding="utf-8", newline="\n")
    return True, f"{old_sku!r} -> {sku!r}"


def main() -> None:
    seo_dirs = [ROOT / "seo", ROOT / "zh" / "seo"]
    changed = 0
    for seo_dir in seo_dirs:
        if not seo_dir.is_dir():
            continue
        for path in sorted(seo_dir.glob("*.html")):
            did_change, msg = patch_file(path)
            rel = path.relative_to(ROOT).as_posix()
            if did_change:
                changed += 1
                print(f"PATCHED {rel}: {msg}")
            elif msg and "no map" not in msg and "not found" not in msg:
                print(f"SKIP {rel}: {msg}")
    print(f"Done. Patched {changed} file(s).")


if __name__ == "__main__":
    main()
