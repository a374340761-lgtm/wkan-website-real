# Crawled — not indexed: applied fixes (HIGH & MEDIUM)

Safe, minimal changes only: no URL structure changes, no removal of sitemap entries, canonical behavior unchanged unless noted. Multilingual behavior preserved (`zh`/`en` visibility classes unchanged).

## 1. Product detail — English meta description (`scripts/product-detail.js`)

**Risk addressed:** HIGH — duplicate EN meta template across SKUs.

**Change:** After resolving `skuForCanonical`, build the English `meta[name="description"]` from:

- `SKU {sku}.` when available  
- `name` + localized **category label** via existing `getCategoryLabel()`  
- A truncated snippet from `short` / `description`  
- Short closing line about OEM / printing / export  

Chinese meta remains full `descForSeo` (unchanged). `og:description` and `twitter:description` still follow the meta tag.

---

## 2. Flag & tent type hubs — static crawlable copy (`flag-type.html`, `tent-type.html`)

**Risk addressed:** HIGH — thin static HTML before JS fills `#flagTypeRoot` / `#tentTypeRoot`.

**Change:**

- Added **`h1`** with `zh` / `en` spans (aligned with existing multilang patterns).  
- Added **intro paragraphs** (bilingual on both pages) explaining purpose, the `type` URL pattern, and links to `all-products`, `product-center`, and (flags) `beach-flag-supplier.html` / (tents) `products-tents.html`.  
- Left existing “Sourcing guides” blocks and JS behavior unchanged.

---

## 3. Model title semantics (`scripts/flag-type.js`, `scripts/tent-type.js`, `styles/main.css`)

**Risk addressed:** MEDIUM — outline / heading clarity alongside new static `h1`.

**Change:** Replaced the main model title container with **`<h2 class="tent-type-detail__title">`** so one static `h1` and one dynamic model title level are distinct. Added **`margin: 0`** on `.tent-type-detail__title` so `h2` default margins do not break layout.

---

## 4. All products — category-specific title & meta (`scripts/all-products.js`)

**Risk addressed:** MEDIUM — `?cat=` views shared default title/description.

**Change:** Introduced `updateCategorySeo(cat)` called from `filterAndRender()` after `updateHeadingAndBreadcrumb(cat)`:

- **`cat` absent or `all`:** Restores default title and meta/og/twitter strings matching `all-products.html`.  
- **Filtered category:** Sets `document.title` and description (plus og/twitter) using the same category label keys as the heading; **ZH** and **EN** branches.  
- **Canonical** remains `https://www.waikwantent.com/all-products.html` (no change).

---

## 5. Tent catalog differentiation (`products-tents.html`)

**Risk addressed:** MEDIUM — overlap with `tent-type.html`.

**Change:** Short paragraph under **`h1`** clarifying that this page is for three frame lines + options, and pointing users to **`tent-type.html`** for PDF-style model pages and **`all-products.html?cat=tents`** for the full grid.

---

## Files touched

| File | Role |
|------|------|
| `scripts/product-detail.js` | Unique EN meta per SKU/category/snippet |
| `flag-type.html` | Static `h1` + intro + links |
| `tent-type.html` | Static `h1` + intro + links |
| `scripts/flag-type.js` | Model title → `h2` |
| `scripts/tent-type.js` | Model title → `h2` |
| `styles/main.css` | `.tent-type-detail__title` margin |
| `scripts/all-products.js` | `updateCategorySeo` + defaults |
| `products-tents.html` | Intro paragraph + internal links |

---

## Not changed (by design)

- **Sitemap:** No removals; SKU URLs remain listed.  
- **Canonical** on `all-products.html`: Still the non-parameter URL.  
- **SEO guide pages** under `seo/`: No bulk edits; see report for ongoing recommendations.
