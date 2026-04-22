# Fallback builder when Node is unavailable: generates product-sitemap.xml + scripts/product-seo-map.js
# Prefer: node scripts/build-product-sitemap.mjs
from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = "https://www.waikwantent.com"
LASTMOD = date.today().isoformat()

LEGACY_MERGED = {
    "31002": "31001",
    "31003": "31001",
    "31004": "31001",
    "31011": "31010",
    "31012": "31010",
    "42006": "42005",
}

SPRITE_EXCLUDE = {9009, 9020}


def extract_products_block(text: str) -> str:
    start = text.index("this.products = [")
    start = text.index("[", start)
    depth = 0
    i = start
    in_str = None
    escape = False
    while i < len(text):
        c = text[i]
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_str:
                in_str = None
            i += 1
            continue
        if c in "'\"":
            in_str = c
            i += 1
            continue
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                return text[start + 1 : i]
        i += 1
    raise ValueError("Unclosed products array")


def iter_product_chunks(block: str):
    """Yield each product { ... } inside the products array (handles nested {} and varying indent)."""
    for m in re.finditer(r"\n\s+\{\s*\n\s+id:\s*", block):
        start = block.index("{", m.start())
        depth = 0
        in_str = None
        escape = False
        i = start
        while i < len(block):
            c = block[i]
            if in_str:
                if escape:
                    escape = False
                elif c == "\\":
                    escape = True
                elif c == in_str:
                    in_str = None
                i += 1
                continue
            if c in "'\"":
                in_str = c
                i += 1
                continue
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    yield block[start : i + 1]
                    break
            i += 1


def parse_product_objects(block: str) -> list[dict]:
    objs = []
    for chunk in iter_product_chunks(block):
        id_m = re.search(r"id:\s*([^,\n]+)", chunk)
        if not id_m:
            continue
        raw_id = id_m.group(1).strip()
        cat_m = re.search(r"category:\s*'([^']*)'", chunk)
        category = cat_m.group(1).strip() if cat_m else ""
        sku_m = re.search(r"\bsku:\s*'([^']+)'", chunk) or re.search(r'\bsku:\s*"([^"]+)"', chunk)
        sku = sku_m.group(1).strip() if sku_m else ""
        name_en_m = re.search(r"nameEn:\s*'([^']*)'", chunk) or re.search(r'nameEn:\s*"([^"]*)"', chunk)
        name_en = name_en_m.group(1) if name_en_m else ""
        name_zh_m = re.search(r"nameZh:\s*'([^']*)'", chunk) or re.search(r'nameZh:\s*"([^"]*)"', chunk)
        name_zh = name_zh_m.group(1) if name_zh_m else ""
        short_en_m = re.search(r"shortEn:\s*'([^']*)'", chunk, re.DOTALL)
        short_en = short_en_m.group(1).replace("\n", " ").strip() if short_en_m else ""
        short_zh_m = re.search(r"shortZh:\s*'([^']*)'", chunk, re.DOTALL)
        short_zh = short_zh_m.group(1).replace("\n", " ").strip() if short_zh_m else ""
        desc_en_m = re.search(r"descriptionEn:\s*'([^']*)'", chunk, re.DOTALL)
        desc_en = desc_en_m.group(1).replace("\n", " ").strip() if desc_en_m else ""
        desc_zh_m = re.search(r"descriptionZh:\s*'([^']*)'", chunk, re.DOTALL)
        desc_zh = desc_zh_m.group(1).replace("\n", " ").strip() if desc_zh_m else ""
        seo_t_en = ""
        seo_d_en = ""
        seo_t_zh = ""
        seo_d_zh = ""
        if (st := re.search(r"seoTitleEn:\s*'([^']*)'", chunk)):
            seo_t_en = st.group(1).strip()
        if (st := re.search(r"seoDescriptionEn:\s*'([^']*)'", chunk, re.DOTALL)):
            seo_d_en = st.group(1).replace("\n", " ").strip()
        if (st := re.search(r"seoTitleZh:\s*'([^']*)'", chunk)):
            seo_t_zh = st.group(1).strip()
        if (st := re.search(r"seoDescriptionZh:\s*'([^']*)'", chunk, re.DOTALL)):
            seo_d_zh = st.group(1).replace("\n", " ").strip()
        image_m = re.search(r"image:\s*'([^']*)'", chunk)
        image = image_m.group(1).strip() if image_m else ""
        imgs_m = re.search(r"images:\s*\[\s*'([^']*)'", chunk)
        first_img = imgs_m.group(1).strip() if imgs_m else ""
        grid_m = re.search(r"grid:\s*\{\s*row:\s*(\d+),\s*col:\s*(\d+)", chunk)
        row = int(grid_m.group(1)) if grid_m else None
        col = int(grid_m.group(2)) if grid_m else None
        pid = raw_id.strip("'\"")
        try:
            id_num = int(pid)
        except ValueError:
            id_num = None
        objs.append(
            {
                "id": pid,
                "id_num": id_num,
                "category": category,
                "sku": sku,
                "nameEn": name_en,
                "nameZh": name_zh,
                "shortEn": short_en,
                "shortZh": short_zh,
                "descriptionEn": desc_en,
                "descriptionZh": desc_zh,
                "seoTitleEn": seo_t_en,
                "seoDescriptionEn": seo_d_en,
                "seoTitleZh": seo_t_zh,
                "seoDescriptionZh": seo_d_zh,
                "image": image,
                "firstImage": first_img,
                "gridRow": row,
                "gridCol": col,
            }
        )
    return objs


def root_asset_abs(rel: str) -> str:
    if not rel:
        return ""
    s = rel.strip()
    if re.match(r"^https?://", s, re.I):
        return re.sub(r"^http://", "https://", s, flags=re.I).replace(
            "https://waikwantent.com", ORIGIN
        )
    p = s if s.startswith("/") else "/" + s.lstrip("/")
    return ORIGIN + p


def primary_image(p: dict) -> str:
    cat = p["category"]
    idn = p["id_num"]
    if (
        cat == "accessories"
        and p["gridRow"]
        and p["gridCol"]
        and idn is not None
        and 9001 <= idn <= 9024
        and idn not in SPRITE_EXCLUDE
    ):
        return root_asset_abs("images/products/accessories/tent-accessories.png")
    raw = p["image"] or p["firstImage"]
    return root_asset_abs(raw) if raw else root_asset_abs("images/hero/Waikwantentshero.png")


def canonical_sku(p: dict) -> str:
    if p["sku"]:
        return p["sku"]
    return str(p["id"])


def en_title(p: dict) -> str:
    if p["seoTitleEn"]:
        return p["seoTitleEn"]
    name = (p["nameEn"] or p["nameZh"] or "Product").strip()
    return f"{name} | Tent & Display Manufacturer | WaiKwan"


def clip(s: str, n: int = 320) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    if len(s) <= n:
        return s
    return s[:317] + "…"


def en_desc(p: dict) -> str:
    if p["seoDescriptionEn"]:
        return clip(p["seoDescriptionEn"])
    body = (p["shortEn"] or p["descriptionEn"] or p["nameEn"] or "").strip()
    sku = canonical_sku(p)
    cat = p["category"]
    t = f"SKU {sku}. {body}"
    if cat:
        t += f" Category: {cat}."
    t += " OEM factory quotes, custom printing, export-ready packing."
    return clip(t)


def zh_title(p: dict) -> str:
    if p["seoTitleZh"]:
        return p["seoTitleZh"]
    name = (p["nameZh"] or p["nameEn"] or "产品").strip()
    return f"{name}｜伟群帐篷 OEM/ODM"


def zh_desc(p: dict) -> str:
    if p["seoDescriptionZh"]:
        return clip(p["seoDescriptionZh"])
    body = (p["shortZh"] or p["descriptionZh"] or p["nameZh"] or "").strip()
    sku = canonical_sku(p)
    t = f"SKU {sku}。{body} 支持定制印刷与出口包装，欢迎询盘。"
    return clip(t)


def maybe_migrate_sitemap_index():
    sm_path = ROOT / "sitemap.xml"
    raw = sm_path.read_text(encoding="utf8")
    if "sitemapindex" in raw:
        return
    locs = re.findall(r"<loc>([^<]+)</loc>", raw)
    page_locs = [u.strip() for u in locs if not re.search(r"/product-detail\.html\?sku=", u, re.I)]
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc in page_locs:
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append(f"    <lastmod>{LASTMOD}</lastmod>")
        lines.append("    <changefreq>weekly</changefreq>")
        lines.append("    <priority>0.8</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    (ROOT / "page-sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf8")
    idx = f"""<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>{ORIGIN}/page-sitemap.xml</loc>
    <lastmod>{LASTMOD}</lastmod>
  </sitemap>
  <sitemap>
    <loc>{ORIGIN}/product-sitemap.xml</loc>
    <lastmod>{LASTMOD}</lastmod>
  </sitemap>
</sitemapindex>
"""
    sm_path.write_text(idx, encoding="utf8")


def main():
    maybe_migrate_sitemap_index()
    text = (ROOT / "scripts" / "products.js").read_text(encoding="utf8")
    block = extract_products_block(text)
    raw_products = parse_product_objects(block)
    seen = set()
    seo_map = {}
    skus = []
    for p in raw_products:
        sku = canonical_sku(p)
        if LEGACY_MERGED.get(sku):
            continue
        if sku in seen:
            continue
        seen.add(sku)
        skus.append(sku)
        seo_map[sku] = {
            "sku": sku,
            "category": p["category"],
            "titleEn": en_title(p),
            "descriptionEn": en_desc(p),
            "titleZh": zh_title(p),
            "descriptionZh": zh_desc(p),
            "image": primary_image(p),
        }
    skus.sort(key=lambda s: (0, int(s)) if s.isdigit() else (1, s))

    # Single static PDP: per-SKU ?sku= URLs are JS-canonical; listing them caused sitemap vs non-JS canonical mismatch.
    prod_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{ORIGIN}/product-detail.html</loc>
    <lastmod>{LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
"""
    (ROOT / "product-sitemap.xml").write_text(prod_xml, encoding="utf8")
    js = (
        "// AUTO-GENERATED by scripts/build-product-sitemap.py — prefer: node scripts/build-product-sitemap.mjs\n"
        "window.WK_PRODUCT_SEO_MAP = "
        + json.dumps(seo_map, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )
    (ROOT / "scripts" / "product-seo-map.js").write_text(js, encoding="utf8")
    print(f"Wrote 1 static PDP URL, SEO map with {len(seo_map)} SKUs")


if __name__ == "__main__":
    main()
