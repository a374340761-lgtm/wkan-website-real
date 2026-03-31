# Product listing layout fix — SEO block below product content

## Goal

On product hub pages, **product browsing** (category cards, filters, grids) now appears **before** long SEO/helper copy so users and search engines see **actionable listings first**, with supporting links and paragraphs **after** the primary content.

No copy was removed; only **DOM order** and a shared **`.seo-content`** wrapper were added.

---

## What was moved

### `product-center.html`

- **Before:** Inside `.section-header`, the page had: title + subtitle + notice, then the **7-card** feature grid (SEG light box, tension fabric backwall, aluminum folding tent, etc.), then two **wk-disclaimer** blocks (sourcing guides + catalog hubs), then the **category cards** (`.product-categories-showcase`).
- **After:** `.section-header` contains only the **H1**, subtitle, and notice. **Category cards** follow immediately. The feature grid + both disclaimer blocks are in a new **`<section class="seo-content">`** placed **after** the entire `.product-categories-showcase` block.

**`scripts/product-center.js`:** Still anchors dynamic hubs (`tentsHub`, `flagsHub`, `subcatHub`) with `insertBefore(..., .section-header.nextSibling)`, so hubs remain **between** the compact header and the category showcase. **`.seo-content` stays after** the showcase, so it does not sit above the main category grid.

### `all-products.html`

- **Before:** `.ap-head` included H1, a long EN/ZH intro paragraph, “Related reading” links, then search + category **`.ap-tools`**, then `#productsGrid`.
- **After:** `.ap-head` has **H1 + `.ap-tools` only** (search and `?cat=` filter). The intro paragraph and “Related reading” live in **`<section class="seo-content">`** after `#productsGrid` and `#emptyState`.

**`scripts/all-products.js`:** Unchanged — notices still insert **above** `#productsGrid`; tent subcategory / details blocks still insert **after** the grid, **before** `#emptyState`. The new block comes **after** `#emptyState`, so order remains: tools → grid → (dynamic sections) → empty state → **SEO**.

### `products-tents.html`

- The explanatory paragraph (tent types guide + `all-products.html?cat=tents`) moved from under **H1** to **`<section class="seo-content">`** after the feature cards, `#tentsContainer`, and back-actions.

### `products-accessories.html`

- The **wk-disclaimer** links (filtered accessories, product center, tent types) moved from under the overview intro to **`<section class="seo-content">`** after `#accessoriesGrid` / `#accessoriesEmpty` (still inside `.accessories-list` so search + grid stay first).

---

## Why this helps SEO and UX

- **UX:** Users landing on “Product Center” or “All Products” see **categories or product cards** without scrolling past large marketing/SEO blocks.
- **SEO:** Primary content (listings, filters, internal links to products) is **higher in the document**, matching common expectations for category/catalog URLs; secondary copy and guide links remain **indexed** as supporting content below.
- **No duplication:** Same text and links as before, only reordered.

---

## Files modified

| File | Change |
|------|--------|
| `product-center.html` | Split header vs SEO; wrapped moved blocks in `.seo-content` |
| `all-products.html` | Shortened `.ap-head`; SEO block after grid/empty state |
| `products-tents.html` | Intro paragraph moved into `.seo-content` after main UI |
| `products-accessories.html` | Disclaimer links moved into `.seo-content` after grid |
| `styles/main.css` | `.seo-content` spacing and top border |

---

## Verification notes

- **Multilingual:** `data-translate` and EN/ZH spans on affected nodes were preserved.
- **`?cat=` / filters:** `all-products` tools and `#productsGrid` IDs unchanged.
- **`product-center.js`:** `.section-header` and `.product-categories-showcase` selectors unchanged; hub insert position unchanged relative to header vs showcase.
