#!/usr/bin/env python3
"""Repo-wide i18n/language separation audit.

Outputs:
  - <repo>/i18n_audit_report.md
  - <repo>/i18n_audit_summary.json

Rules (as requested):
- P0: English blocks (class="en") containing Han characters; also en translations containing Han.
- P1: Chinese blocks (class="zh") containing disallowed English words; also zh translations containing disallowed English.
- P2: Missing i18n keys / missing one language in multilang dictionary.
- P3: Other mixed-language occurrences (manual review), e.g. hardcoded Han outside .zh, hardcoded English outside .en.

This tool is conservative: it may under-report some multi-line HTML cases.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple

ROOT = Path(__file__).resolve().parents[1]
MULTILANG = ROOT / "scripts" / "multilang.js"

HAN_RE = re.compile(r"[\u4E00-\u9FFF]")
EN_TOKEN_RE = re.compile(r"[A-Za-z][A-Za-z0-9+./_-]*")
CLASS_EN_RE = re.compile(r"class\s*=\s*([\"'])(?:(?!\1).)*\ben\b(?:(?!\1).)*\1", re.IGNORECASE)
CLASS_ZH_RE = re.compile(r"class\s*=\s*([\"'])(?:(?!\1).)*\bzh\b(?:(?!\1).)*\1", re.IGNORECASE)

# i18n attribute usage in HTML and HTML-in-JS
TRANSLATE_ATTR_RE = re.compile(r"data-(?:translate|i18n)(?:-[a-z-]+)?=\"([^\"]+)\"", re.IGNORECASE)

# Common JS patterns that reference keys
JS_KEY_RE_LIST = [
    re.compile(r"wkI18n\.t\(\s*['\"]([^'\"]+)['\"]\s*\)"),
    re.compile(
        r"setAttribute\(\s*['\"]data-(?:translate|i18n)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)"
    ),
    re.compile(r"dataset\.(?:translate|i18n)\s*=\s*['\"]([^'\"]+)['\"]"),
]

ALLOWED_TOKENS = {
    "WaiKwan",
    "WKAN",
    "OEM",
    "ODM",
    "PDF",
    "WhatsApp",
    "Email",
    "US",
    "USA",
    "AU",
    "MOQ",
    "600D",
    "420D",
    "300D",
    "50mm",
    "40mm",
    "32mm",
    "25mm",
    "20GP",
    "40HQ",
    "CE",
    "RoHS",
    "ISO",
    "RGB",
    "CMYK",
    "Pantone",
    "UV",
    "PVC",
    "TPU",
    "Oxford",
    "Aluminum",
    "Aluminium",
    "Fiberglass",
    "Steel",
    "Iron",
    "BCD",
    "HEX",
    "mm",
    "cm",
    "m",
    "kg",
    "g",
    "V",
    "A",
    "Hz",
}

# Additional conservative allowances for zh strings: measurements / model-ish tokens.
UNIT_TOKEN_RE = re.compile(r"^\d+(?:\.\d+)?(?:mm|cm|m|kg|g|v|a|hz)$", re.IGNORECASE)
DIMS_TOKEN_RE = re.compile(r"^\d+(?:\.\d+)?[x×]\d+(?:\.\d+)?(?:mm|cm|m)?$", re.IGNORECASE)
MODELISH_RE = re.compile(r"^(?:[A-Za-z]+)?\d+[A-Za-z0-9-]*$")


@dataclass
class Finding:
    severity: str  # P0/P1/P2/P3
    file: str
    line: int
    type: str
    snippet: str
    suggestion: str


def iter_files() -> Iterable[Path]:
    for ext in (".html", ".js"):
        yield from ROOT.rglob(f"*{ext}")


def is_inside(path: Path, folder_name: str) -> bool:
    return any(p.name.lower() == folder_name.lower() for p in path.parents)


def should_skip(path: Path) -> bool:
    # Skip heavyweight/non-source folders
    if is_inside(path, "node_modules"):
        return True
    if is_inside(path, ".git"):
        return True
    if is_inside(path, "images"):
        return True
    if is_inside(path, "videos"):
        return True
    if is_inside(path, "data"):
        return True
    return False


def one_line_snippet(line: str, max_len: int = 220) -> str:
    s = line.rstrip("\n").strip()
    s = re.sub(r"\s+", " ", s)
    if len(s) > max_len:
        s = s[: max_len - 1] + "…"
    return s


def strip_html_tags(line: str) -> str:
    # crude but good enough for line-level scan
    s = re.sub(r"<[^>]*>", " ", line)
    s = s.replace("&nbsp;", " ")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def is_disallowed_en_token(tok: str) -> bool:
    if tok in ALLOWED_TOKENS:
        return False
    if tok.lower() in {t.lower() for t in ALLOWED_TOKENS}:
        return False
    if UNIT_TOKEN_RE.match(tok) or DIMS_TOKEN_RE.match(tok):
        return False
    # Allow most model/material codes (digits + letters + hyphens)
    if MODELISH_RE.match(tok) and any(ch.isdigit() for ch in tok):
        return False
    return True


def extract_disallowed_en_tokens(text: str) -> List[str]:
    toks = EN_TOKEN_RE.findall(text)
    bad = [t for t in toks if is_disallowed_en_token(t)]
    return bad


def collect_used_keys_from_text(text: str, is_js: bool) -> Set[str]:
    used: Set[str] = set()
    used.update(m.group(1).strip() for m in TRANSLATE_ATTR_RE.finditer(text))
    if is_js:
        for rx in JS_KEY_RE_LIST:
            used.update(m.group(1).strip() for m in rx.finditer(text))
    used.discard("")
    return used


def _skip_ws(s: str, i: int) -> int:
    while i < len(s) and s[i].isspace():
        i += 1
    return i


def extract_lang_keys(js_text: str, lang: str) -> Set[str]:
    """Extract top-level keys from `this.translations = { <lang>: { ... } }`.

    Borrowed from tools/i18n_audit.py (kept consistent).
    """

    idx = js_text.find(f"{lang}:")
    if idx == -1:
        return set()

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

        if ch == "/" and nxt == "/":
            in_line_comment = True
            i += 2
            continue
        if ch == "/" and nxt == "*":
            in_block_comment = True
            i += 2
            continue

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

        if depth == 1:
            j = _skip_ws(js_text, i)
            if j >= len(js_text):
                break

            if js_text[j] in ("'", '"'):
                quote = js_text[j]
                k = j + 1
                buf: List[str] = []
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


def scan_multilang_value_mixing(multilang_text: str) -> List[Finding]:
    findings: List[Finding] = []

    # Very lightweight brace-based region tracking: mark when inside zh or en object.
    # We use line-level classification; no multi-line string parsing.
    in_lang: Optional[str] = None
    depth = 0

    lines = multilang_text.splitlines()
    for idx, line in enumerate(lines, start=1):
        # Enter language object
        if in_lang is None:
            if re.search(r"\bzh\s*:\s*\{", line):
                in_lang = "zh"
                depth = 0
            elif re.search(r"\ben\s*:\s*\{", line):
                in_lang = "en"
                depth = 0

        # Count braces (naive)
        opens = line.count("{")
        closes = line.count("}")
        if in_lang is not None:
            depth += opens - closes
            # The opening line contributes 1; we want to stay until it returns to 0 or negative.
            # But since we set depth=0 before counting, the opening '{' makes depth>=1.

            if in_lang == "en":
                if HAN_RE.search(line):
                    findings.append(
                        Finding(
                            severity="P0",
                            file=str(MULTILANG.relative_to(ROOT)).replace("\\", "/"),
                            line=idx,
                            type="en_translation_contains_han",
                            snippet=one_line_snippet(line),
                            suggestion="Replace with English-only translation, or move Han text to zh translation value.",
                        )
                    )
            elif in_lang == "zh":
                bad = extract_disallowed_en_tokens(line)
                # reduce false positives: only flag when line contains a quoted value with letters
                if bad and re.search(r"[:]\s*['\"]", line):
                    findings.append(
                        Finding(
                            severity="P1",
                            file=str(MULTILANG.relative_to(ROOT)).replace("\\", "/"),
                            line=idx,
                            type="zh_translation_contains_disallowed_en",
                            snippet=one_line_snippet(line),
                            suggestion="Replace with Chinese-only translation (keep only allowed tokens like OEM/ODM, material codes).",
                        )
                    )

            if depth <= 0:
                in_lang = None

    return findings


def scan_file_text(path: Path, text: str) -> Tuple[List[Finding], Set[str]]:
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    findings: List[Finding] = []

    used_keys = collect_used_keys_from_text(text, is_js=path.suffix.lower() == ".js")

    if path.suffix.lower() == ".html":
        in_script = False
        for i, raw in enumerate(text.splitlines(), start=1):
            line = raw
            if re.search(r"<script\b", line, re.IGNORECASE):
                in_script = True
            if re.search(r"</script\b", line, re.IGNORECASE):
                # still scan this line as script-ish, then exit
                pass

            if in_script:
                # treat script sections like JS scan: check for class en/zh in templates
                has_en = bool(CLASS_EN_RE.search(line))
                has_zh = bool(CLASS_ZH_RE.search(line))
                if has_en and HAN_RE.search(line):
                    findings.append(
                        Finding(
                            severity="P0",
                            file=rel,
                            line=i,
                            type="en_block_contains_han",
                            snippet=one_line_snippet(line),
                            suggestion="Ensure English template has no Han; move Han into a .zh span or an i18n key.",
                        )
                    )
                if has_zh:
                    bad = extract_disallowed_en_tokens(line)
                    if bad:
                        findings.append(
                            Finding(
                                severity="P1",
                                file=rel,
                                line=i,
                                type="zh_block_contains_disallowed_en",
                                snippet=one_line_snippet(line),
                                suggestion="Keep only allowed tokens inside .zh, or split into .zh/.en spans / i18n key.",
                            )
                        )

            else:
                # HTML text line scan
                text_only = strip_html_tags(line)
                if not text_only:
                    # still check class-mismatch on same line if any
                    pass

                has_en = bool(CLASS_EN_RE.search(line))
                has_zh = bool(CLASS_ZH_RE.search(line))
                has_i18n = bool(TRANSLATE_ATTR_RE.search(line))

                if has_en and HAN_RE.search(text_only):
                    findings.append(
                        Finding(
                            severity="P0",
                            file=rel,
                            line=i,
                            type="en_block_contains_han",
                            snippet=one_line_snippet(line),
                            suggestion="Wrap Han text in a sibling .zh span and add matching .en text, or replace with data-i18n key.",
                        )
                    )

                if has_zh:
                    bad = extract_disallowed_en_tokens(text_only)
                    if bad:
                        findings.append(
                            Finding(
                                severity="P1",
                                file=rel,
                                line=i,
                                type="zh_block_contains_disallowed_en",
                                snippet=one_line_snippet(line),
                                suggestion="Replace English sentence in .zh with Chinese, keep only allowed tokens (e.g., OEM/ODM, 600D).",
                            )
                        )

                # Hardcoded language outside expected blocks
                if HAN_RE.search(text_only) and (not has_zh) and (not has_i18n):
                    findings.append(
                        Finding(
                            severity="P3",
                            file=rel,
                            line=i,
                            type="hardcoded_han_outside_zh",
                            snippet=one_line_snippet(line),
                            suggestion="If user-facing, wrap with <span class='zh'>…</span><span class='en'>…</span> or convert to data-i18n.",
                        )
                    )

                bad = extract_disallowed_en_tokens(text_only)
                if bad and (not has_en) and (not has_i18n):
                    findings.append(
                        Finding(
                            severity="P3",
                            file=rel,
                            line=i,
                            type="hardcoded_disallowed_en_outside_en",
                            snippet=one_line_snippet(line),
                            suggestion="If user-facing, wrap with .en/.zh spans or convert to data-i18n key.",
                        )
                    )

            if re.search(r"</script\b", line, re.IGNORECASE):
                in_script = False

    elif path.suffix.lower() == ".js":
        # Skip obvious vendor-like minified blobs (none expected, but guard)
        lines = text.splitlines()
        in_block_comment = False
        for i, raw in enumerate(lines, start=1):
            line = raw
            t = line.strip()
            if not t:
                continue

            if in_block_comment:
                if "*/" in t:
                    in_block_comment = False
                continue
            if t.startswith("/*"):
                if "*/" not in t:
                    in_block_comment = True
                continue
            if t.startswith("//"):
                continue

            # Template spans
            has_en = bool(CLASS_EN_RE.search(line))
            has_zh = bool(CLASS_ZH_RE.search(line))

            if has_en and HAN_RE.search(line):
                findings.append(
                    Finding(
                        severity="P0",
                        file=rel,
                        line=i,
                        type="en_block_contains_han",
                        snippet=one_line_snippet(line),
                        suggestion="Ensure English template has no Han; move Han into .zh or i18n key.",
                    )
                )

            if has_zh:
                bad = extract_disallowed_en_tokens(line)
                if bad:
                    findings.append(
                        Finding(
                            severity="P1",
                            file=rel,
                            line=i,
                            type="zh_block_contains_disallowed_en",
                            snippet=one_line_snippet(line),
                            suggestion="Keep only allowed tokens inside .zh, or split into .zh/.en spans / i18n key.",
                        )
                    )

            # Hardcoded Han/English in string literals (heuristic): only scan when line seems to contain a quoted string.
            if re.search(r"['\"`].*['\"`]", line):
                if HAN_RE.search(line) and not has_zh:
                    findings.append(
                        Finding(
                            severity="P3",
                            file=rel,
                            line=i,
                            type="hardcoded_han_in_js",
                            snippet=one_line_snippet(line),
                            suggestion="If user-facing, replace with wkI18n.t('KEY') or data-i18n in generated HTML.",
                        )
                    )
                bad = extract_disallowed_en_tokens(line)
                if bad and not has_en:
                    findings.append(
                        Finding(
                            severity="P3",
                            file=rel,
                            line=i,
                            type="hardcoded_disallowed_en_in_js",
                            snippet=one_line_snippet(line),
                            suggestion="If user-facing, replace with wkI18n.t('KEY') or split .zh/.en spans.",
                        )
                    )

    return findings, used_keys


def group_findings(findings: List[Finding]) -> Dict[str, List[Finding]]:
    groups: Dict[str, List[Finding]] = {"P0": [], "P1": [], "P2": [], "P3": []}
    for f in findings:
        groups.setdefault(f.severity, []).append(f)
    # stable-ish sort
    for k in groups:
        groups[k].sort(key=lambda x: (x.file, x.line, x.type))
    return groups


def to_md(groups: Dict[str, List[Finding]], counts: Dict[str, int]) -> str:
    def section(title: str, key: str, desc: str) -> str:
        items = groups.get(key, [])
        out = [f"## {title}", "", desc, ""]
        if not items:
            out.append("- (none)\n")
            return "\n".join(out)

        for f in items:
            out.append(f"- {f.file}:{f.line} | `{f.type}` | {f.snippet}")
            out.append(f"  - Suggestion: {f.suggestion}")
        out.append("")
        return "\n".join(out)

    header = [
        "# i18n Language Separation Audit",
        "",
        f"Workspace: `{ROOT}`",
        "",
        "## Summary",
        "",
        f"- P0: {counts.get('P0', 0)}",
        f"- P1: {counts.get('P1', 0)}",
        f"- P2: {counts.get('P2', 0)}",
        f"- P3: {counts.get('P3', 0)}",
        "",
        "## Notes",
        "",
        "- This is a static, line-level audit. Some multi-line HTML fragments may require manual follow-up.",
        "- Allowed tokens inside zh are treated as exceptions (brand/model/material/units list).",
        "- This audit does not modify any copy or i18n system.",
        "",
    ]

    body = [
        section(
            "P0 — English blocks contain Chinese (must fix)",
            "P0",
            "These will surface Chinese characters under English mode.",
        ),
        section(
            "P1 — Chinese blocks contain English sentences (likely fix)",
            "P1",
            "These will surface English text under Chinese mode (excluding allowed tokens).",
        ),
        section(
            "P2 — Missing i18n keys / missing one language", "P2", "Keys referenced in HTML/JS but not present for both zh/en.") ,
        section(
            "P3 — Other mixed-language occurrences (manual review)",
            "P3",
            "Hardcoded language outside .zh/.en blocks or i18n keys. Review to confirm user-facing impact.",
        ),
    ]

    # TODO list (actionable, but no auto-fix)
    todos = [
        "## TODO List (no auto-changes)",
        "",
        "1. Fix all P0 items by removing Han from `.en` content and `en` translation values.",
        "2. Fix P1 items by replacing English sentences in `.zh` / `zh` translation values (keep allowed tokens only).",
        "3. Fix P2 items by adding missing keys to both `translations.en` and `translations.zh` in scripts/multilang.js.",
        "4. Review P3 items and convert user-facing strings to i18n keys or `.zh/.en` paired spans.",
        "",
    ]

    return "\n".join(header + body + todos)


def main() -> int:
    if not MULTILANG.exists():
        raise SystemExit(f"multilang not found: {MULTILANG}")

    multilang_text = MULTILANG.read_text(encoding="utf-8", errors="ignore")
    zh_keys, en_keys = load_translation_keys()

    all_findings: List[Finding] = []
    used_keys: Set[str] = set()

    # translation value mixing inside scripts/multilang.js
    all_findings.extend(scan_multilang_value_mixing(multilang_text))

    # scan all html/js
    for path in iter_files():
        if should_skip(path):
            continue

        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        f, keys = scan_file_text(path, text)
        all_findings.extend(f)
        used_keys.update(keys)

    # P2: key coverage
    # - used in HTML/JS but missing zh/en
    # - also keys only present in one language
    rel_multilang = str(MULTILANG.relative_to(ROOT)).replace("\\", "/")

    missing_zh = sorted(k for k in used_keys if k and k not in zh_keys)
    missing_en = sorted(k for k in used_keys if k and k not in en_keys)

    for k in missing_zh:
        all_findings.append(
            Finding(
                severity="P2",
                file=rel_multilang,
                line=1,
                type="missing_key_in_zh",
                snippet=f"data-i18n key '{k}' missing in translations.zh",
                suggestion=f"Add '{k}' to translations.zh in scripts/multilang.js.",
            )
        )

    for k in missing_en:
        all_findings.append(
            Finding(
                severity="P2",
                file=rel_multilang,
                line=1,
                type="missing_key_in_en",
                snippet=f"data-i18n key '{k}' missing in translations.en",
                suggestion=f"Add '{k}' to translations.en in scripts/multilang.js.",
            )
        )

    only_in_zh = sorted(k for k in zh_keys if k not in en_keys)
    only_in_en = sorted(k for k in en_keys if k not in zh_keys)

    for k in only_in_zh:
        all_findings.append(
            Finding(
                severity="P2",
                file=rel_multilang,
                line=1,
                type="key_missing_in_en",
                snippet=f"translation key '{k}' exists only in zh",
                suggestion=f"Add '{k}' to translations.en (or remove if unused).",
            )
        )
    for k in only_in_en:
        all_findings.append(
            Finding(
                severity="P2",
                file=rel_multilang,
                line=1,
                type="key_missing_in_zh",
                snippet=f"translation key '{k}' exists only in en",
                suggestion=f"Add '{k}' to translations.zh (or remove if unused).",
            )
        )

    groups = group_findings(all_findings)
    counts = {k: len(v) for k, v in groups.items()}

    report_path = ROOT / "i18n_audit_report.md"
    json_path = ROOT / "i18n_audit_summary.json"

    report_path.write_text(to_md(groups, counts), encoding="utf-8")
    json_path.write_text(
        json.dumps([asdict(f) for f in all_findings], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    # stdout quick summary (useful for logs)
    print("i18n audit written:")
    print(f"- {report_path}")
    print(f"- {json_path}")
    print("Counts:")
    for k in ("P0", "P1", "P2", "P3"):
        print(f"  {k}: {counts.get(k, 0)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
