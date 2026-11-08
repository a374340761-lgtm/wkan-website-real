#!/usr/bin/env python3
"""Validate the German mirror against the source routes and production sitemap."""
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.waikwantent.com"
INTERNAL = re.compile(r"^(?:outputs/|google[a-f\d]+\.html$|index\.(?:original|wireframe)\.html$|test_|careers(?:-submit-bridge)?\.html$)")
CJK = re.compile(r"[\u3400-\u9fff]")
ALLOW_CJK = {"中文", "简体中文", "广西伟群帐篷制造有限公司"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.language = ""
        self.robots = ""
        self.canonical = ""
        self.foreign_text = []
        self.raw = Counter()

    def handle_starttag(self, tag, values):
        attrs = dict(values)
        if tag == "html":
            self.language = attrs.get("lang")
        if tag == "meta" and attrs.get("name") == "robots":
            self.robots = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if tag in {"script", "style"}:
            self.raw[tag] += 1
        self.links.extend(attrs[key] for key in ("href", "src", "poster") if attrs.get(key))
        for key in ("srcset", "imagesrcset"):
            if attrs.get(key):
                self.links.extend(value.strip().split()[0] for value in attrs[key].split(",") if value.strip())

    def handle_endtag(self, tag):
        if self.raw[tag]:
            self.raw[tag] -= 1

    def handle_data(self, data):
        text = " ".join(data.split())
        if not any(self.raw.values()) and CJK.search(text) and text not in ALLOW_CJK:
            self.foreign_text.append(text)


def source_routes():
    tracked = subprocess.check_output(["git", "ls-files", "-z", "--", "*.html"], cwd=ROOT).decode("utf-8")
    return {
        file.removeprefix("zh/") for file in tracked.rstrip("\0").split("\0")
        if file and not file.startswith("de/") and not INTERNAL.match(file.removeprefix("zh/"))
    }


def main():
    errors = []
    folder = ROOT / "de"
    expected = source_routes()
    actual = {file.relative_to(folder).as_posix() for file in folder.rglob("*.html")}
    for file in sorted(expected - actual):
        errors.append(f"Missing German route: {file}")
    for file in sorted(actual - expected):
        errors.append(f"Unexpected German route: {file}")

    manifest = json.loads((folder / "locale-map.json").read_text(encoding="utf-8"))
    indexed = set()
    targets = set()
    for file in sorted(actual):
        url = ORIGIN + "/de/" + ("" if file == "index.html" else file)
        page = Page()
        page.feed((folder / file).read_text(encoding="utf-8"))
        if page.language != "de":
            errors.append(f"{file}: incorrect HTML language")
        for text in page.foreign_text:
            errors.append(f"{file}: untranslated text: {text[:110]}")
        if "noindex" not in page.robots.lower():
            if page.canonical != url:
                errors.append(f"{file}: expected canonical {url}, found {page.canonical}")
            indexed.add(url)
        for link in page.links:
            if link.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                continue
            target = urlsplit(urljoin(url, link))
            if target.hostname not in {"www.waikwantent.com", "waikwantent.com"}:
                continue
            relative = unquote(target.path).lstrip("/")
            if not relative or relative.endswith("/"):
                relative += "index.html"
            targets.add(relative)
            if not (ROOT / relative).is_file():
                errors.append(f"{file}: missing local target {target.path}")

    sitemap = ElementTree.parse(ROOT / "sitemap.xml")
    alternatives = {}
    for entry in sitemap.findall(".//{*}url"):
        url = entry.findtext("{*}loc")
        alternatives[url] = {
            link.get("hreflang"): link.get("href") for link in entry.findall("{*}link")
        }
    german_sitemap = {url for url in alternatives if "/de/" in url}
    if indexed != german_sitemap:
        errors.append("German sitemap entries do not match the indexable German pages.")
    for url in german_sitemap:
        group = alternatives[url]
        if group.get("de") != url or "en" not in group:
            errors.append(f"{url}: incomplete German sitemap language group")
        for language in ("en", "zh-CN"):
            counterpart = group.get(language)
            if counterpart and alternatives.get(counterpart, {}).get("de") != url:
                errors.append(f"{url}: missing reciprocal {language} sitemap entry")
    if manifest["enabled"] != bool(indexed):
        errors.append("German language navigation and sitemap must be enabled together.")

    if errors:
        raise SystemExit("\n".join(dict.fromkeys(errors)))
    print(f"German mirror verified: {len(actual)} routes, {len(targets)} local targets, {len(indexed)} indexed routes.")


if __name__ == "__main__":
    main()
