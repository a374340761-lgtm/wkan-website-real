import os, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ORIG = "https://www.waikwantent.com"


def expected(rel: str) -> str:
    rel = rel.replace("\\", "/")
    if rel == "index.html":
        return ORIG + "/"
    if rel.endswith("/index.html"):
        base = rel[: -len("index.html")].rstrip("/")
        if base == "zh":
            return ORIG + "/zh/"
        return ORIG + "/" + base + "/" if base else ORIG + "/"
    return ORIG + "/" + rel


bad = []
for dirpath, _, files in os.walk(ROOT):
    if "node_modules" in dirpath or ".git" in dirpath:
        continue
    for fn in files:
        if not fn.endswith(".html"):
            continue
        fp = Path(dirpath) / fn
        rel = str(fp.relative_to(ROOT)).replace("\\", "/")
        t = fp.read_text(encoding="utf-8", errors="replace")
        m = re.search(
            r'<link[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']',
            t,
            re.I,
        )
        if not m:
            bad.append(("missing_canonical", rel))
            continue
        href = m.group(1).rstrip("/")
        exp = expected(rel).rstrip("/")
        ok = href == exp
        if rel == "zh/index.html" and href in (ORIG + "/zh", ORIG + "/zh/index.html"):
            ok = True
        if rel == "index.html" and href == ORIG:
            ok = True
        if not ok:
            bad.append(("canonical_mismatch", rel, m.group(1), expected(rel)))

for row in bad:
    print(row)
print("TOTAL", len(bad))
