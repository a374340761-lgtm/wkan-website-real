# Crawled — currently not indexed: risk report

This report flags URLs and templates that are **more likely** to be crawled but not selected for Google’s index, based on thin or duplicated signals, weak static HTML, or weak differentiation. It is not a guarantee of Search Console outcomes.

## Summary

| Area | Primary risk |
|------|----------------|
| **Product detail (`product-detail.html?sku=`)** | Many URLs share one HTML shell; EN meta descriptions repeated the same boilerplate. |
| **Type hubs (`flag-type.html`, `tent-type.html`)** | Main content injected into `#flagTypeRoot` / `#tentTypeRoot`; static HTML was light before JS. |
| **`all-products.html?cat=`** | Filtered views shared the same default title/description as the unfiltered page; canonical correctly points to `all-products.html`. |
| **Tent catalog overlap** | `products-tents.html` vs `tent-type.html` target similar intents; differentiation helps avoid “pick one” deduplication. |
| **SEO guide cluster (`seo/*.html`)** | Shared chrome and CTA patterns; pages differ by H1 and body copy — monitor for boilerplate similarity. |
| **Sitemap-listed PDPs** | Large set of SKU URLs — normal for e‑commerce but increases template-similarity pressure unless titles/descriptions/body differ per SKU. |

---

## High risk

### 1. `product-detail.html?sku=*` (all SKUs in sitemap)

**Why crawl but not index:** One template serves hundreds of URLs. English `meta description` used an identical sentence for every product (“Factory direct … OEM & custom printing…”), so snippets looked interchangeable and offered little unique signal vs. title + body.

**Risk:** **High**

**Minimal fixes (conceptual):** Per-SKU meta that includes SKU, category label, and a snippet from short/long description; strong unique `h1`/product name in static HTML where possible; internal links from category hubs and related products (already partially present).

**Status:** Addressed in JS (see `CRAWLED_NOT_INDEXED_FIXES.md`).

---

### 2. `flag-type.html` and `tent-type.html` (incl. `?type=` / `?variant=`)

**Why crawl but not index:** Crawlers that see only the initial HTML found breadcrumbs, a short “Sourcing guides” line, and an **empty** root div until scripts run. That pattern reads as thin or “JS-only” primary content.

**Risk:** **High** (for static-HTML signals; rendered content after JS is stronger).

**Minimal fixes:** Unique crawlable intro copy + `h1`, internal links to catalog and related hubs; preserve JS-rendered detail as the main experience.

**Status:** Addressed with static `h1` + paragraphs + links (see fixes doc). Dynamic titles use `h2` for the model name for a clear outline.

---

## Medium risk

### 3. `all-products.html` with `?cat=`, `?type=`, `?q=`, etc.

**Why crawl but not index:** Parameter URLs can look like duplicates of the main catalog page. You correctly use **canonical** `https://www.waikwantent.com/all-products.html` (consolidation). Remaining risk: **title/description** matched the unfiltered page for every filter, weakening perceived uniqueness of each crawled URL.

**Risk:** **Medium**

**Minimal fixes:** Differentiate `document.title` and meta description by active category (and language) while keeping canonical unchanged; ensure prominent links from nav and hubs (already present).

**Status:** Addressed in `scripts/all-products.js`.

---

### 4. `products-tents.html` vs `tent-type.html`

**Why crawl but not index:** Both cover “tents” with overlapping vocabulary. Without clear differentiation, Google may prefer one URL for overlapping queries.

**Risk:** **Medium**

**Minimal fixes:** Explicit intro explaining **this** page = three frame lines + accessories vs **tent-type** = model guide with specs tables; cross-links between the two.

**Status:** Intro paragraph added on `products-tents.html`.

---

### 5. `/seo/*.html` commercial guides

**Why crawl but not index:** Shared layout, footer, and CTA blocks across many pages can look template-heavy if body copy is short or repetitive.

**Risk:** **Medium** (page-level; varies by file)

**Minimal fixes:** Unique first paragraphs, distinct titles and H1s per intent, internal links to specific products/categories (many pages already do this).

**Status:** No bulk edit in this pass; continue to expand unique copy per URL as needed.

---

### 6. `racegate-type.html` (JS root)

**Why crawl but not index:** Similar to type hubs, but **already** includes a substantive static paragraph before `#racegateRoot`.

**Risk:** **Medium–Low**

**Minimal fixes:** Optional extra cross-links or a short `h1` if metrics show issues.

**Status:** No change this pass.

---

## Low risk (examples)

| Page / pattern | Notes |
|----------------|--------|
| `index.html`, `product-center.html`, major category landers | Substantial static copy and internal links. |
| `pop-up-display-stands.html`, `portable-display-systems.html` | Rich static sections (feature grids, copy). |
| `dome-type.html`, `furniture-type.html` | Static `h1`, intros, and lists; JS augments. |
| `faq.html`, `contact`, policy pages | Unique purpose and copy. |
| `site-map.html` | Navigation aid; typically not a primary landing concern. |

---

## Parameter / filter pages

- **`all-products.html?...`:** Canonical to bare `all-products.html` is appropriate to avoid index bloat; differentiation via title/description (after load) reduces ambiguity for crawled URLs.
- **`product-detail.html?sku=`:** Each SKU is a legitimate indexable product URL; quality depends on unique product copy and metadata (addressed for EN meta).

---

## Orphan / internal linking

Site-wide nav and footers link to major hubs. **Type hubs** and **all-products** benefit from contextual links from related pages (guides, category intros) — partially improved in this pass via new intro copy links.

---

*Generated as part of a focused SEO hardening pass; re-check in Google Search Console after deployment.*
