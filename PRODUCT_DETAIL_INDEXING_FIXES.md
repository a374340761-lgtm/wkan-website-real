# Product detail indexing — implemented fixes

## Summary

Improvements target **early, URL-accurate** canonical and social tags when `?sku=` is present, **interim** title/description that reference the SKU, a **non-empty H1** placeholder before product data loads, **og/twitter images** aligned with the primary product image after render, and **JSON-LD** `@id` aligned with the canonical product URL.

---

## 1. `product-detail.html`

### Inline head script (runs synchronously during parse, before `seo.js` defer)

When `sku` is present in the query string:

- Sets **`rel="canonical"`**, **`og:url`**, **`twitter:url`** to  
  `https://www.waikwantent.com/product-detail.html?sku=<encoded-sku>`  
  (matches `WK_PREFERRED_ORIGIN` and `seo.js` `BASE_URL`).
- Sets **`og:type`** to `product`.
- Sets **interim** `document.title`, **`og:title`**, **`twitter:title`** to  
  `SKU <sku> | Tent & Display Manufacturer | WaiKwan`.
- Sets **interim** `meta[name="description"]`, **`og:description`**, **`twitter:description`** to a short SKU-specific factory/OEM line.

`scripts/product-detail.js` **replaces** these with fully product-specific values after `productManager` loads.

### Inline script after `<h1 id="productName">`

If `sku` is in the URL and the heading is still empty, sets **`textContent`** to `SKU <sku>` so the main heading is not blank until the full render runs.

---

## 2. `scripts/product-detail.js`

- **`og:image`** and **`twitter:image`** are set to the **absolute** URL of the **primary** catalog image (first of `product.images` or `product.image`) when available; otherwise meta tags keep the existing hero fallback (same as JSON-LD image fallback).
- **JSON-LD `Product`:**
  - **`@id`:** `<canonicalProductUrl>#product` (stable identifier tied to the canonical URL).
  - **`url`:** unchanged — still `canonicalProductUrl` (equals `rel="canonical"`).
  - **`image`:** uses the same absolute primary image logic as social tags when possible.

---

## 3. Unchanged behavior (by design)

- Legacy query normalization and merged-SKU redirects at the top of `product-detail.js`.
- `WK_PREFERRED_ORIGIN` remains fixed to `https://www.waikwantent.com`.
- `seo.js` still skips the delayed second pass on product-detail so tags set here are not clobbered.

---

## Files touched

| File | Change |
|------|--------|
| `product-detail.html` | Early PDP head script; H1 placeholder script |
| `scripts/product-detail.js` | Social image meta; JSON-LD `@id`; shared primary image path for SEO block |
