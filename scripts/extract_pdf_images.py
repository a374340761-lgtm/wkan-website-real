#!/usr/bin/env python3
"""
Extract images from a PDF, classify pages by text keywords, save PNGs
into images/products/<category>/ and produce images/products/manifest.json

Usage:
  python scripts/extract_pdf_images.py <path-to-pdf>

Requirements:
  pip install pymupdf

This script implements classification purely from page text via CATEGORY_KEYWORDS.
"""
import sys
import os
import json
import fitz  # PyMuPDF
from collections import defaultdict


# -----------------------------
# Category keyword definitions
# -----------------------------
CATEGORY_KEYWORDS = {
    'tents': [
        "帐篷", "快装帐篷", "折叠帐篷", "event tent", "canopy", "marquee", "pop-up tent"
    ],
    'flags': [
        "沙滩旗", "羽毛旗", "水滴旗", "旗杆", "beach flag", "feather flag", "teardrop", "flag pole"
    ],
    'displays': [
        "快幕秀", "展示系统", "背景墙", "展架", "pop-up display", "backdrop", "display wall", "trade show display"
    ],
    'accessories': [
        "配件", "底座", "沙袋", "地钉", "连接件", "accessories", "base", "water bag", "sand bag", "stake", "connector"
    ],
    'frames': [
        "框架", "支架", "铝架", "铁架", "frame", "structure", "aluminum frame", "steel frame"
    ],
    'custom': [
        "定制", "OEM", "ODM", "custom", "branding", "printed", "logo printing"
    ]
}

ALLOWED_CATEGORIES = set(CATEGORY_KEYWORDS.keys())


def ensure_output_dirs(base_dir):
    os.makedirs(base_dir, exist_ok=True)
    for cat in sorted(ALLOWED_CATEGORIES):
        os.makedirs(os.path.join(base_dir, cat), exist_ok=True)
    # folder for mixed/uncategorized
    os.makedirs(os.path.join(base_dir, '_review'), exist_ok=True)


def classify_text(page_text):
    """
    Return suggested_category, confidence, matched_keywords_map
    matched_keywords_map: {category: {keyword: count}}
    """
    if not page_text:
        return 'uncategorized', 'low', {}

    text_lower = page_text.lower()

    scores = defaultdict(int)
    matched = {cat: {} for cat in ALLOWED_CATEGORIES}

    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            kw_lower = kw.lower()
            # count occurrences; this works for both Chinese and English substrings
            count = text_lower.count(kw_lower)
            if count > 0:
                scores[cat] += count
                matched[cat][kw] = count

    # Determine suggested category
    if not scores:
        return 'uncategorized', 'low', matched

    # If all scores are zero
    if all(v == 0 for v in scores.values()):
        return 'uncategorized', 'low', matched

    # find max score
    max_score = max(scores.values())
    winners = [cat for cat, v in scores.items() if v == max_score and v > 0]

    if len(winners) == 0:
        suggested = 'uncategorized'
        confidence = 'low'
    elif len(winners) > 1:
        suggested = 'mixed'
        confidence = 'low'
    else:
        suggested = winners[0]
        total_hits = scores[suggested]
        if total_hits >= 3:
            confidence = 'high'
        else:
            confidence = 'medium'

    return suggested, confidence, matched


def save_pixmap_as_png(pix, out_path):
    # pix is fitz.Pixmap
    try:
        # Safely determine colorspace component count
        try:
            cs_n = pix.colorspace.n if pix.colorspace is not None else None
        except Exception:
            cs_n = None

        # If colorspace is not RGB (3 components), convert to RGB first
        if cs_n != 3:
            pix = fitz.Pixmap(fitz.csRGB, pix)

        # After conversion, pix may be RGB (n==3) or RGBA (n==4) depending on original
        # Save directly; PyMuPDF will write RGB or RGBA PNG appropriately
        pix.save(out_path)
    finally:
        pix = None


def extract_images_from_pdf(pdf_path, out_base='images/products'):
    doc = fitz.open(pdf_path)
    ensure_output_dirs(out_base)

    manifest = []

    for page_index in range(len(doc)):
        page_no = page_index + 1
        page = doc.load_page(page_index)
        page_text = page.get_text("text") or ''
        suggested_category, confidence, matched = classify_text(page_text)

        # collect matched keywords summary for manifest
        matched_keywords_summary = []
        for cat, kwmap in matched.items():
            for kw, cnt in kwmap.items():
                if cnt > 0:
                    matched_keywords_summary.append({'category': cat, 'keyword': kw, 'count': cnt})

        # determine target dir
        if suggested_category in ALLOWED_CATEGORIES:
            target_dir = os.path.join(out_base, suggested_category)
        else:
            target_dir = os.path.join(out_base, '_review')

        # extract embedded images first
        images = page.get_images(full=True)
        embedded_saved = []
        if images:
            for i, img in enumerate(images, start=1):
                xref = img[0]
                try:
                    pix = fitz.Pixmap(doc, xref)
                except Exception:
                    # fallback to page.get_pixmap render region
                    pix = page.get_pixmap()

                # convert CMYK or alpha to PNG-compatible
                if pix.n >= 5:  # CMYK: convert to RGB first
                    pix = fitz.Pixmap(fitz.csRGB, pix)

                filename = f"p{page_no}_embed_{i}.png"
                out_path = os.path.join(target_dir, filename)
                save_pixmap_as_png(pix, out_path)
                embedded_saved.append(filename)

                manifest.append({
                    'page': page_no,
                    'type': 'embedded',
                    'file': os.path.relpath(out_path).replace('\\', '/'),
                    'suggested_category': suggested_category,
                    'confidence': confidence,
                    'matched_keywords': matched_keywords_summary,
                    'page_text_snippet': page_text[:120]
                })
        else:
            # no embedded images => render full page
            mat = fitz.Matrix(2, 2)  # improve resolution
            pix = page.get_pixmap(matrix=mat)
            # ensure RGB
            if pix.n >= 5:
                pix = fitz.Pixmap(fitz.csRGB, pix)

            filename = f"p{page_no}_render.png"
            out_path = os.path.join(target_dir, filename)
            save_pixmap_as_png(pix, out_path)

            manifest.append({
                'page': page_no,
                'type': 'rendered',
                'file': os.path.relpath(out_path).replace('\\', '/'),
                'suggested_category': suggested_category,
                'confidence': confidence,
                'matched_keywords': matched_keywords_summary,
                'page_text_snippet': page_text[:120]
            })

    # write manifest
    manifest_path = os.path.join(out_base, 'manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"Extraction complete. {len(manifest)} items written. Manifest: {manifest_path}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/extract_pdf_images.py <path-to-pdf>")
        sys.exit(2)

    pdf_path = sys.argv[1]
    if not os.path.isfile(pdf_path):
        print(f"PDF not found: {pdf_path}")
        sys.exit(3)

    extract_images_from_pdf(pdf_path)


if __name__ == '__main__':
    main()
