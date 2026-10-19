"""Delegate product metadata generation to the single maintained Node builder.

Canonical sitemaps are owned by build-page-sitemap.py. This compatibility
command cannot restore the obsolete product sitemap format.
"""
from pathlib import Path
import shutil
import subprocess
import sys


def main() -> int:
    node = shutil.which("node")
    if not node:
        print("Node.js is required. Install it, then run node scripts/build-product-sitemap.mjs.", file=sys.stderr)
        return 1
    builder = Path(__file__).with_suffix(".mjs")
    return subprocess.run([node, str(builder)], cwd=builder.parent.parent, check=False).returncode


if __name__ == "__main__":
    sys.exit(main())
