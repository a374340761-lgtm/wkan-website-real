#!/usr/bin/env python3
"""
Extract embedded images from a PDF, classify by page text, deduplicate, and
write outputs to images/pdf-all/ with a manifest.json.

Usage:
  python scripts/extract_pdf_embedded_images.py "<pdf-path>"

If no PDF path is provided, the script defaults to
  广西伟群帐篷制造有限公司2025改.pdf

Notes:
  - Only extracts embedded images (no page rendering).
  - Saves original image bytes and extension.
  - Deduplicates by SHA1: same image saved once; manifest records first appearance.
"""
import sys
import os
import json
import hashlib
import fitz  # PyMuPDF
from collections import defaultdict


# -----------------------------
# Category keyword definitions
# -----------------------------
CATEGORY_KEYWORDS = {
    'tents': ["帐篷", "快装帐篷", "折叠帐篷", "event tent", "canopy", "marquee", "pop-up tent"],
    'flags': ["沙滩旗", "羽毛旗", "水滴旗", "旗杆", "beach flag", "feather flag", "teardrop", "flag pole"],
    'displays': ["快幕秀", "展示系统", "背景墙", "展架", "pop-up display", "backdrop", "display wall", "trade show display"],
    'accessories': ["配件", "底座", "沙袋", "地钉", "连接件", "accessories", "base", "water bag", "sand bag", "stake", "connector"],
    'frames': ["框架", "支架", "铝架", "铁架", "frame", "structure", "aluminum frame", "steel frame"],
    'custom': ["定制", "OEM", "ODM", "custom", "branding", "printed", "logo printing"]
}

ALLOWED_CATEGORIES = set(CATEGORY_KEYWORDS.keys())


def classify_text(page_text):
    """
    Classify page_text into suggested_category, confidence, matched_keywords_list
    matched_keywords_list: [{'category':cat,'keyword':kw,'count':n}, ...]
    """
    if not page_text:
        return 'uncategorized', 'low', []

    text_lower = page_text.lower()
    scores = defaultdict(int)
    matched = {cat: {} for cat in ALLOWED_CATEGORIES}

    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            cnt = text_lower.count(kw.lower())
            if cnt:
                scores[cat] += cnt
                matched[cat][kw] = cnt

    if not scores or all(v == 0 for v in scores.values()):
        return 'uncategorized', 'low', []

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
        hits = scores[suggested]
        confidence = 'high' if hits >= 3 else 'medium'

    matched_list = []
    for cat, kwmap in matched.items():
        for kw, cnt in kwmap.items():
            if cnt > 0:
                matched_list.append({'category': cat, 'keyword': kw, 'count': cnt})

    return suggested, confidence, matched_list


def ensure_out_dir(out_base):
    os.makedirs(out_base, exist_ok=True)


def sha1_bytes(b):
    h = hashlib.sha1()
    h.update(b)
    return h.hexdigest()


def extract_embedded_images(pdf_path, out_base='images/pdf-all'):
    doc = fitz.open(pdf_path)
    ensure_out_dir(out_base)

    seen_hashes = {}
    manifest = []

    for page_index in range(len(doc)):
        page_no = page_index + 1
        page = doc.load_page(page_index)
        page_text = page.get_text('text') or ''
        page_snippet = page_text[:200]

        suggested_category, confidence, matched = classify_text(page_text)

        images = page.get_images(full=True)
        if not images:
            continue

        # index per page for naming
        idx = 1
        for img in images:
            xref = img[0]
            try:
                imgdict = doc.extract_image(xref)
            except Exception as e:
                # skip problematic image
                print(f"Warning: failed to extract xref {xref} on page {page_no}: {e}")
                idx += 1
                continue

            img_bytes = imgdict.get('image')
            ext = imgdict.get('ext', 'bin')

            if not img_bytes:
                idx += 1
                continue

            h = sha1_bytes(img_bytes)
            if h in seen_hashes:
                # already saved; skip saving but do not create duplicate manifest entry
                idx += 1
                continue

            filename = f"p{page_no}_img_{idx}.{ext}"
            out_path = os.path.join(out_base, filename)
            try:
                with open(out_path, 'wb') as f:
                    f.write(img_bytes)
            except Exception as e:
                print(f"Error writing image file {out_path}: {e}")
                idx += 1
                continue

            seen_hashes[h] = {
                'page': page_no,
                'xref': xref,
                'ext': ext,
                'file': os.path.relpath(out_path).replace('\\', '/'),
                'page_text_snippet': page_snippet,
                'suggested_category': suggested_category,
                'matched_keywords': matched,
                'confidence': confidence,
                'sha1': h
            }

            manifest.append({
                'page': page_no,
                'xref': xref,
                'ext': ext,
                'file': os.path.relpath(out_path).replace('\\', '/'),
                'page_text_snippet': page_snippet,
                'suggested_category': suggested_category,
                'matched_keywords': matched,
                'confidence': confidence,
                'sha1': h
            })

            idx += 1

    manifest_path = os.path.join(out_base, 'manifest.json')
    try:
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error writing manifest {manifest_path}: {e}")

    print(f"Done. Extracted {len(manifest)} unique embedded images. Manifest: {manifest_path}")


def main():
    default_pdf = '广西伟群帐篷制造有限公司2025改.pdf'
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else default_pdf

    if not os.path.isfile(pdf_path):
        print(f"PDF not found: {pdf_path}")
        print("Usage: python scripts/extract_pdf_embedded_images.py \"<pdf-path>\"")
        sys.exit(2)

    extract_embedded_images(pdf_path)


if __name__ == '__main__':
    main()
