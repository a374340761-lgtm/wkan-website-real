# Canonical, redirects, sitemap & URL consistency

Audit scope: static HTML, `scripts/seo.js`, `scripts/product-detail.js`, `sitemap.xml`, `robots.txt`, `site.webmanifest`, and redirect/meta-refresh stubs. Hosting-level redirects (apex → www, HTTP → HTTPS) are **not** defined in this repo; they must be verified on the server or CDN.

**Declared preferred origin (repo):** `https://www.waikwantent.com`  
(`scripts/seo.js` `BASE_URL`, `scripts/product-detail.js` `WK_PREFERRED_ORIGIN`, `robots.txt` Sitemap line, typical `rel="canonical"` / `og:url` in HTML.)

---

## Summary: mixed-signal risks

| Category | Severity | Notes |
|----------|----------|--------|
| Sitemap listed **noindex + redirect** product hub stubs | **High** (was) | `products-flags.html` etc. were in `sitemap.xml` while pages use `noindex`, meta refresh, and canonical to another URL. |
| Home URL: **`/` vs `index.html`** in internal links | **Low** | Canonical/OG for home is `https://www.waikwantent.com/`; most nav links use relative `index.html` — usually merged by Google but not identical strings. |
| **`product-detail.html` static shell** (no `?sku=`) | **Low** | HTML `rel="canonical"` / `og:url` are `.../product-detail.html` without a SKU until JS runs; runtime sets SKU-specific canonical. Invalid/no-SKU visits redirect away in `product-detail.js`. |
| **Legacy HTML** (`product.html`, `tent-detail.html`) | **Low** | Documented in `seo.js`; not in sitemap. |
| **Docs / Cursor rules** | **Aligned** | `.cursor/rules/seo-engineer.mdc` and `docs/CURSOR-SEO-PROMPTS.md` use `https://www.waikwantent.com` as base URL. |
| **Apex host** `https://waikwantent.com` | **Server** | Not testable from static files. `seo.js` rewrites some apex URLs to `www` when building absolute tags. **301 apex → www** should still be configured at host. |

---

## Checks performed

### 1. Scheme & host (`http` / `https`, `www` / non-`www`)

- Scanned HTML/JS/XML for `waikwantent.com` URLs.
- **Result:** Production page assets use **`https://www.waikwantent.com`** for canonical, OG/Twitter image URLs, and sitemap `<loc>` entries.
- **No** matches for `href="https://waikwantent.com/...` (apex) in HTML.
- **`scripts/seo.js`:** `toAbsoluteUrl` upgrades `https://waikwantent.com` → `https://www.waikwantent.com`; `applySocialTags` does the same for `og:url` / runtime URLs.

### 2. Trailing slashes

- Sitemap and canonicals use **no** trailing slash on directory-style home (`https://www.waikwantent.com/`) and **no** trailing slash after `.html` paths — **consistent**.

### 3. `index.html` vs `/`

- **`index.html`:** `rel="canonical"` and `og:url` = `https://www.waikwantent.com/` (good).
- **Internal links** across the site overwhelmingly use **`href="index.html"`** (relative). This is a **different URL string** than `/` but same host and equivalent for most crawlers when combined with canonical on the homepage.
- **`news/index.html`:** Canonical is `https://www.waikwantent.com/news/index.html`; sitemap matches — **consistent**.

### 4. Case sensitivity

- Paths use **lowercase** `.html` and folder names (`seo/`, `news/`). Hero image filenames vary (`Waikwantentshero.png` vs `waikwanflagshero.png`) — distinct files; **no** duplicate-casing conflict detected in references.

### 5. Parameterized URLs & canonicals

- **`all-products.html`:** Static canonical = `https://www.waikwantent.com/all-products.html` (no `?cat=`). Filtered views intentionally consolidate — **aligned** with intended duplicate-handling.
- **`product-detail.html?sku=`:** Runtime canonical ( **`product-detail.js`** ) = `https://www.waikwantent.com/product-detail.html?sku=<SKU>` — **correct** for PDPs.
- **`tent-type.html` / `flag-type.html` / `furniture-type.html`:** Static canonicals are **file-only** (no `?type=` / `?variant=`). Acceptable pattern: one HTML file, parameters select content; avoids indexing infinite parameter variants as separate canonicals.
- **Redirect stubs** (`products-flags.html`, etc.): Canonical targets declared on each stub (e.g. `product-center.html?cat=flags` or `furniture-type.html?...`) — **internally consistent** with redirect targets; issue was **sitemap** listing them (see FIXED).

### 6. Sitemap vs redirects / `noindex`

| URL pattern | In sitemap? | Page behavior |
|-------------|-------------|----------------|
| `products-{flags,displays,lightbox,custom,inflatable,furniture}.html` | **Removed** (was listed) | `noindex`, meta refresh → hub |
| `products.html` | No | `noindex` → `product-center.html` |
| `index.wireframe.html` / `index.original.html` / `test_*.html` | No | `robots.txt` Disallow |

### 7. JSON-LD

- **`seo.js`:** Injects Organization + WebSite on **home only**; `@id` and `url` use `BASE_URL + '/'` — **www HTTPS**.
- **`product-detail.js`:** Product JSON-LD uses `canonicalProductUrl` built from `WK_PREFERRED_ORIGIN` — **consistent** with `rel="canonical"`.

### 8. Implied redirects (in-repo)

| Source | Target |
|--------|--------|
| `products.html` | `product-center.html` (+ query/hash) |
| `products-*.html` (stub hubs) | `product-center.html?cat=...` or `furniture-type.html?type=...` |
| `index.original.html` / `index.wireframe.html` | `index.html` |
| `tent-detail.html` | `product-detail.html?sku=` or `product-center.html?cat=tents` |
| **`seo.js`** | `product.html`, `tent-detail.html` → `product-detail.html` canonical logic |

---

## Recommendations (not auto-applied)

1. **Hosting:** Confirm **301** from `http://` → `https://` and from `https://waikwantent.com/*` → `https://www.waikwantent.com/*` (or one consistent policy + GSC preferred domain).
2. **Internal links to home:** Optionally standardize on `href="/"` or `href="https://www.waikwantent.com/"` for the logo/home link only — large touch surface; **low** priority if canonical is already `/`.
3. **Authoring docs:** Align `.cursor` / internal docs to **`https://www.waikwantent.com`** to match production.

---

## FIXED (auto-applied in repo)

The following changes were made to remove **obvious** mixed signals that were safe to fix without altering user-visible redirects.

### 1. `sitemap.xml` — removed redirect / `noindex` stub URLs

**Removed `<loc>` entries** for:

- `https://www.waikwantent.com/products-flags.html`
- `https://www.waikwantent.com/products-displays.html`
- `https://www.waikwantent.com/products-lightbox.html`
- `https://www.waikwantent.com/products-custom.html`
- `https://www.waikwantent.com/products-inflatable.html`
- `https://www.waikwantent.com/products-furniture.html`

**Rationale:** Each of these pages is a **short-lived redirect** with **`noindex`** and a **canonical** pointing at the real destination. Listing them in the sitemap asked discovery of URLs that should not be indexed, conflicting with `noindex` and the redirect behavior.

**Still listed:** `products-tents.html`, `products-accessories.html` (full pages, not meta-refresh stubs in the same sense as the removed set).

### 2. `site.webmanifest` — `start_url`

**Changed** `"start_url": "index.html"` → **`"/"`** so the PWA launch URL aligns with the **homepage canonical** (`https://www.waikwantent.com/`).

---

*Generated by repository consistency pass. Re-run after large URL or routing changes.*
