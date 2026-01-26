#!/usr/bin/env python3
"""Audit i18n key coverage.

Scans HTML/JS for `data-translate*` / `data-i18n*` usage and `wkI18n.t('...')` usage.
Extracts top-level translation keys from scripts/multilang.js for zh/en.

Usage:
  python tools/i18n_audit.py

Exit codes:
  0: ok (no missing keys)
  1: missing keys in zh and/or en
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path
from typing import Iterable, Set, Tuple

ROOT = Path(__file__).resolve().parents[1]
MULTILANG = ROOT / "scripts" / "multilang.js"


TRANSLATE_ATTR_RE = re.compile(
    r"data-(?:translate|i18n)(?:-[a-z-]+)?=\"([^\"]+)\"", re.IGNORECASE
)

# Common JS patterns that reference keys
JS_KEY_RE_LIST = [
    re.compile(r"wkI18n\.t\(\s*['\"]([^'\"]+)['\"]\s*\)"),
    re.compile(r"setAttribute\(\s*['\"]data-(?:translate|i18n)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)"),
    re.compile(r"dataset\.(?:translate|i18n)\s*=\s*['\"]([^'\"]+)['\"]"),
]


def iter_files() -> Iterable[Path]:
    for ext in (".html", ".js"):
        yield from ROOT.rglob(f"*{ext}")


def is_inside(path: Path, folder_name: str) -> bool:
    return any(p.name.lower() == folder_name.lower() for p in path.parents)


def collect_used_keys() -> Set[str]:
    used: Set[str] = set()

    for path in iter_files():
        # Skip backend/node_modules if present
        if is_inside(path, "node_modules"):
            continue

        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        if path.suffix.lower() == ".html":
            used.update(m.group(1).strip() for m in TRANSLATE_ATTR_RE.finditer(text))

        if path.suffix.lower() == ".js":
            for rx in JS_KEY_RE_LIST:
                used.update(m.group(1).strip() for m in rx.finditer(text))

            # Some JS injects HTML strings containing data-translate attributes
            used.update(m.group(1).strip() for m in TRANSLATE_ATTR_RE.finditer(text))

    used.discard("")
    return used


def _skip_ws(s: str, i: int) -> int:
    while i < len(s) and s[i].isspace():
        i += 1
    return i


def extract_lang_keys(js_text: str, lang: str) -> Set[str]:
    """Extract top-level keys from `this.translations = { <lang>: { ... } }`.

    This is a lightweight parser that:
    - finds the first `<lang>:` object literal
    - captures keys at depth=1 within that object
    - ignores strings and comments

    It is intentionally conservative and may under-report rather than over-report.
    """

    idx = js_text.find(f"{lang}:")
    if idx == -1:
        return set()

    # Find first '{' after '<lang>:'
    brace = js_text.find("{", idx)
    if brace == -1:
        return set()

    keys: Set[str] = set()

    i = brace
    depth = 0
    in_squote = False
    in_dquote = False
    in_btick = False
    in_line_comment = False
    in_block_comment = False
    escape = False

    def in_string() -> bool:
        return in_squote or in_dquote or in_btick

    while i < len(js_text):
        ch = js_text[i]
        nxt = js_text[i + 1] if i + 1 < len(js_text) else ""

        # Handle exiting comments
        if in_line_comment:
            if ch == "\n":
                in_line_comment = False
            i += 1
            continue
        if in_block_comment:
            if ch == "*" and nxt == "/":
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue

        # Handle strings
        if in_string():
            if escape:
                escape = False
                i += 1
                continue
            if ch == "\\":
                escape = True
                i += 1
                continue
            if in_squote and ch == "'":
                in_squote = False
            elif in_dquote and ch == '"':
                in_dquote = False
            elif in_btick and ch == "`":
                in_btick = False
            i += 1
            continue

        # Start comments
        if ch == "/" and nxt == "/":
            in_line_comment = True
            i += 2
            continue
        if ch == "/" and nxt == "*":
            in_block_comment = True
            i += 2
            continue

        # Start strings
        if ch == "'":
            in_squote = True
            i += 1
            continue
        if ch == '"':
            in_dquote = True
            i += 1
            continue
        if ch == "`":
            in_btick = True
            i += 1
            continue

        # Track braces
        if ch == "{":
            depth += 1
            i += 1
            continue
        if ch == "}":
            depth -= 1
            i += 1
            if depth == 0:
                break
            continue

        # At depth=1, attempt to read a key
        if depth == 1:
            j = _skip_ws(js_text, i)
            if j >= len(js_text):
                break

            # Quoted key
            if js_text[j] in ("'", '"'):
                quote = js_text[j]
                k = j + 1
                buf = []
                esc = False
                while k < len(js_text):
                    c = js_text[k]
                    if esc:
                        buf.append(c)
                        esc = False
                    elif c == "\\":
                        esc = True
                    elif c == quote:
                        break
                    else:
                        buf.append(c)
                    k += 1
                if k < len(js_text) and js_text[k] == quote:
                    k += 1
                    k = _skip_ws(js_text, k)
                    if k < len(js_text) and js_text[k] == ":":
                        keys.add("".join(buf))
                        i = k + 1
                        continue

            # Identifier key
            m = re.match(r"[A-Za-z_$][A-Za-z0-9_$]*", js_text[j:])
            if m:
                key = m.group(0)
                k = j + len(key)
                k = _skip_ws(js_text, k)
                if k < len(js_text) and js_text[k] == ":":
                    keys.add(key)
                    i = k + 1
                    continue

        i += 1

    return keys


def load_translation_keys() -> Tuple[Set[str], Set[str]]:
    text = MULTILANG.read_text(encoding="utf-8", errors="ignore")
    zh = extract_lang_keys(text, "zh")
    en = extract_lang_keys(text, "en")
    return zh, en


def main() -> int:
    used = collect_used_keys()
    zh, en = load_translation_keys()

    missing_zh = sorted(k for k in used if k not in zh)
    missing_en = sorted(k for k in used if k not in en)

    only_in_zh = sorted(k for k in zh if k not in en)
    only_in_en = sorted(k for k in en if k not in zh)

    unused = sorted(k for k in zh.intersection(en) if k not in used)

    print(f"Workspace: {ROOT}")
    print(f"Used keys: {len(used)}")
    print(f"zh keys:   {len(zh)}")
    print(f"en keys:   {len(en)}")
    print("")

    if missing_zh:
        print(f"Missing in zh ({len(missing_zh)}):")
        for k in missing_zh[:200]:
            print(f"  - {k}")
        if len(missing_zh) > 200:
            print(f"  ... +{len(missing_zh)-200} more")
        print("")

    if missing_en:
        print(f"Missing in en ({len(missing_en)}):")
        for k in missing_en[:200]:
            print(f"  - {k}")
        if len(missing_en) > 200:
            print(f"  ... +{len(missing_en)-200} more")
        print("")

    if only_in_zh:
        print(f"Keys only in zh ({len(only_in_zh)}):")
        for k in only_in_zh[:120]:
            print(f"  - {k}")
        if len(only_in_zh) > 120:
            print(f"  ... +{len(only_in_zh)-120} more")
        print("")

    if only_in_en:
        print(f"Keys only in en ({len(only_in_en)}):")
        for k in only_in_en[:120]:
            print(f"  - {k}")
        if len(only_in_en) > 120:
            print(f"  ... +{len(only_in_en)-120} more")
        print("")

    print(f"Unused keys present in both zh/en ({len(unused)}):")
    for k in unused[:120]:
        print(f"  - {k}")
    if len(unused) > 120:
        print(f"  ... +{len(unused)-120} more")

    has_missing = bool(missing_zh or missing_en)
    return 1 if has_missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
