#!/usr/bin/env python3
"""
Move images in the project's `images/` root to product folders according to a
page->directory mapping. Supports filenames like:
  - page_4_img_1.png
  - page_04_img_001.jpg

Usage:
  python scripts/sort_images_by_page_map.py

The script operates on the `images/` folder in the project root.
"""
import os
import re
import shutil
from collections import defaultdict

# -- Configuration: mapping from page ranges to target directories
PAGE_MAP = [
    ((1, 1), 'images/products/_review/cover'),
    ((2, 2), 'images/products/_review/notes'),
    ((3, 3), 'images/products/accessories/outdoor-furniture'),
    ((4, 4), 'images/products/accessories/tent-accessories1'),
    ((5, 8), 'images/products/tents'),
    ((9, 9), 'images/products/displays/inflatables'),
    ((10, 16), 'images/products/flags'),
    ((17, 17), 'images/products/custom/table-covers'),
    ((18, 26), 'images/products/displays'),
    ((27, 28), 'images/products/tents'),
    ((29, 36), 'images/products/accessories/umbrella-bases'),
]

UNKNOWN_DIR = 'images/products/_review/unknown-page'

FILENAME_RE = re.compile(r'^page_0*(?P<page>\d+)_img_0*(?P<index>\d+)\.(?P<ext>png|jpe?g)$', re.IGNORECASE)


def get_target_dir(page_num):
    for (start, end), target in PAGE_MAP:
        if start <= page_num <= end:
            return target
    return UNKNOWN_DIR


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def unique_destination(dest_path):
    if not os.path.exists(dest_path):
        return dest_path
    base, ext = os.path.splitext(dest_path)
    i = 1
    while True:
        candidate = f"{base}_dup{i}{ext}"
        if not os.path.exists(candidate):
            return candidate
        i += 1


def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    images_dir = os.path.join(repo_root, 'images')

    if not os.path.isdir(images_dir):
        print(f"images directory not found: {images_dir}")
        return

    moved_counts = defaultdict(int)
    unknown_count = 0

    # Scan files in images/ (non-recursive)
    for fname in os.listdir(images_dir):
        fpath = os.path.join(images_dir, fname)
        if not os.path.isfile(fpath):
            continue

        m = FILENAME_RE.match(fname)
        if not m:
            continue

        page = int(m.group('page'))
        ext = m.group('ext').lower()

        target_dir = get_target_dir(page)
        ensure_dir(os.path.join(repo_root, target_dir))

        dest_name = fname
        dest_path = os.path.join(repo_root, target_dir, dest_name)
        dest_path = unique_destination(dest_path)

        try:
            shutil.move(fpath, dest_path)
            moved_counts[target_dir] += 1
        except Exception as e:
            print(f"Failed to move {fpath} -> {dest_path}: {e}")
            # attempt to move to unknown
            ensure_dir(os.path.join(repo_root, UNKNOWN_DIR))
            try:
                fallback = unique_destination(os.path.join(repo_root, UNKNOWN_DIR, fname))
                shutil.move(fpath, fallback)
                moved_counts[UNKNOWN_DIR] += 1
                unknown_count += 1
            except Exception as e2:
                print(f"Also failed to move to unknown: {e2}")

    # Print statistics
    print("Move summary:")
    total_moved = 0
    for target, count in sorted(moved_counts.items()):
        print(f"  {target}: {count}")
        total_moved += count
    if unknown_count > 0:
        print(f"  {UNKNOWN_DIR}: {unknown_count}")

    print(f"Total moved: {total_moved}")


if __name__ == '__main__':
    main()
