# SEO / Google Indexing Readiness Audit

**Site:** https://www.waikwantent.com/  
**Repository:** wkan-website-real  
**Audit date:** 2026-03-30  
**Scope:** All `*.html` files (75), `robots.txt`, `sitemap.xml`, and SEO-related JS (`scripts/seo.js`, `scripts/product-detail.js`, redirect shims).  
**Machine-readable output:** `seo-index-audit.json`  

---

## Executive summary

- **Preferred domain in repo:** **`https://www.waikwantent.com`** — used consistently in static HTML `rel="canonical"`, **`sitemap.xml` `<loc>` entries**, **`robots.txt` Sitemap directive**, and Open Graph/Twitter absolute image URLs. **No** `https://waikwantent.com/` (non-www) appears in HTML canonical tags in the scan.
- **Risk:** Visitors on the **apex** host should be **301-redirected** to **`www`**; `product-detail.js` emits canonicals via **`WK_PREFERRED_ORIGIN`** (`https://www.waikwantent.com`), and **`scripts/seo.js`** skips the delayed second `run()` on PDP so tags are not overwritten.
- **Strengths:** `/seo/*.html` pillar pages have **one absolute canonical each**, unique titles and meta descriptions, and are **included in `sitemap.xml`**. **No** sitewide `noindex` on primary content pages.
- **Gaps:** Several pages use **empty `<title>` until JS/i18n** (`data-translate` only). **`tent-detail.html` is in the sitemap but has `noindex`** — policy conflict. **Test/wireframe** pages use **relative** canonicals (`index.html`). **~70+ product-detail URLs** in the sitemap share one HTML template — **soft duplicate / thin** risk for marginal SKUs.

---

## Preferred domain inconsistencies

| Finding | Detail |
|--------|--------|
| Static HTML + sitemap | **www** only (`https://www.waikwantent.com/...`). |
| `scripts/seo.js` | Hard-coded **`BASE_URL = 'https://www.waikwantent.com'`**; `normalizeCanonical()` builds PDP URLs with **www**. |
| `scripts/product-detail.js` | **`window.location.origin`** when available for canonical / JSON-LD base; fallback **`https://www.waikwantent.com`**. |
| Apex vs www | If GSC or users use **`https://waikwantent.com/`** without redirect to **www**, **“Duplicate, Google chose different canonical than user”** can appear until **server-side 301** and **single script source of truth** align. |

**Conclusion:** The **repository declares www** as canonical. **Production** should **301** one host to the other and **match GSC property URL**.

---

## Pages with missing titles (static HTML)

These files have **no literal text** inside `<title>` (or empty), or no `<title>`:

| Path | Notes |
|------|--------|
| `dome-type.html` | `<title data-translate="...">` only — empty until JS. |
| `furniture-type.html` | Same pattern. |
| `products-accessories.html` | Same pattern. |
| `googlead697dfed14475b1.html` | Verification file — no `<title>`. |

---

## Pages with duplicate titles

| Title | Files |
|--------|--------|
| `Redirecting…` | `index.original.html`, `index.wireframe.html` |

---

## Pages with missing descriptions

**Empty or absent `meta name="description"` content** in source (first-party head):

- `googlead697dfed14475b1.html`
- `products.html`
- `products-custom.html`, `products-displays.html`, `products-flags.html`, `products-furniture.html`, `products-inflatable.html`, `products-lightbox.html` (also **noindex**)
- `index.original.html`, `index.wireframe.html`
- `test_logo.html`, `test_stats.html`

*(Other pages have non-empty meta descriptions in the scan.)*

---

## Pages with broken / mismatched canonicals

| Path | Issue |
|------|--------|
| `index.original.html`, `index.wireframe.html`, `test_logo.html`, `test_stats.html` | **`href="index.html"`** — **relative**, not absolute `https://www...`. |
| `product-detail.html` | Static canonical is **`.../product-detail.html`** **without `?sku=`**; **per-SKU canonical requires JS** (`product-detail.js`) and `seo.js`. |
| `product.html` | Canonical to **`product-detail.html`** without sku; **noindex** — intentional consolidation. |
| `products.html` | Canonical to **`product-center.html`**; **noindex**. |
| `tent-detail.html` | Canonical to **`product-center.html?cat=tents`**; **noindex**; redirects. |

**Exactly one `rel="canonical"`** per file in grep (no duplicate link tags detected).

---

## Pages likely causing “Crawled – currently not indexed”

- **All `product-detail.html?sku=...` URLs:** Same shell; differentiation is JS-driven. Many SKUs → **template similarity** and **soft duplicates** if copy is thin.
- **Secondary type pages** (e.g. shorter copy): `racegate-type.html`, `six-sided-booth.html` — **lower unique text** vs long-form `/seo/` pages.

---

## Pages excluded from sitemap (or not listed as file name)

| Path | Note |
|------|------|
| `googlead697dfed14475b1.html` | Correctly omitted (verification). |
| `index.html` | **Home** appears as `https://www.waikwantent.com/` in sitemap — **OK**. |
| `index.original.html`, `index.wireframe.html`, `test_logo.html`, `test_stats.html` | Omitted; **robots.txt** also **Disallow** on originals/wireframe/tests. |
| `product-detail.html` (no query) | **Not** in sitemap — bare URL redirects when no `sku`; **OK**. |

---

## Sitemap vs canonical mismatch

| URL in sitemap | Issue |
|----------------|--------|
| `https://www.waikwantent.com/tent-detail.html` | Page has **`noindex`** — **should not** be in sitemap if policy is “do not index”. **Remove from sitemap** or **remove noindex** (choose one). |

All other **indexable** HTML paths in the audit set either appear as **`https://www.waikwantent.com/...`** in `sitemap.xml` or are intentionally omitted (redirect/noindex/test).

---

## Internal links (high level)

- **Strong:** `index.html` → categories, `/seo/` guides, news, FAQs, `site-map.html`.
- **`site-map.html`** → broad internal linking including `#seo-guides`.
- **Risk:** Pages only linked from deep sections may get **weak crawl priority** — recommend periodic **orphan URL check** (Screaming Frog, GSC “Links”).

**hreflang:** No `rel="alternate" hreflang="..."` **detected** in HTML — multilingual UX may rely on client-side switching only (not a blocker for single-locale indexing, but limits international SEO signals).

---

## Pages with JS-generated SEO tags

| File | Injects / updates |
|------|-------------------|
| `scripts/seo.js` | Canonical normalization, **og:url**, **twitter:url**, **Organization + WebSite JSON-LD** (home), **re-run at +800ms**. |
| `scripts/product-detail.js` | **`document.title`**, **meta description**, **`link[rel=canonical]`**, **og:url**, **og:type** product, **Product JSON-LD** after catalog load. |

**Conflict note:** `seo.js` + `product-detail.js` both touch **canonical** on PDP — see **Recommended fixes**.

---

## Recommended fixes (priority order)

1. **Server / DNS:** **Single preferred host** — **301** `https://waikwantent.com/*` → `https://www.waikwantent.com/*` (or reverse), consistent with **GSC** property.
2. **PDP canonical:** Make **`seo.js` and `product-detail.js` agree** on one rule (www vs `location.origin`) and **avoid** the **800ms** `run()` **overwriting** a correct apex canonical.
3. **Sitemap:** **Remove `tent-detail.html`** from `sitemap.xml` **or** remove **noindex** — align policy.
4. **Relative canonicals:** On disallowed test pages, either **omit canonical** or use **absolute** URLs; avoid **`index.html`** relative for consistency.
5. **Titles:** For **`data-translate`-only** `<title>` pages, add a **fallback literal** title for no-JS / first paint.
6. **Product pages:** Add **SKU-specific** copy where possible to reduce **soft duplicate** risk across `product-detail.html?sku=...`.

---

## Appendix: counts

| Metric | Value |
|--------|------:|
| HTML files | 75 |
| `sitemap.xml` `<loc>` entries | 144 |
| `/seo/*.html` files | 30 |
| Pages with `noindex` (meta) | 13 |

---

*Generated by automated repository scan; validate on staging after any fix. Pair with `seo-index-audit.json` for tooling.*
