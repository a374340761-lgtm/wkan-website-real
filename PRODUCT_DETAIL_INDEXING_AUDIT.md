# Product detail page — indexing & SEO audit

**Scope:** `product-detail.html`, `scripts/product-detail.js`, interaction with `scripts/seo.js`.  
**Target URLs:** `https://www.waikwantent.com/product-detail.html?sku=<SKU>` (and legacy params normalized to this form).

**Preferred host:** `https://www.waikwantent.com` (`WK_PREFERRED_ORIGIN` in `product-detail.js`, `BASE_URL` in `seo.js`).

---

## 1. Canonical strategy (parameter duplication)

| Topic | Assessment |
|-------|------------|
| **Intent** | One **indexable URL per product**: always `product-detail.html?sku=<canonical-sku>`. |
| **Duplicate parameters** | Legacy `id`, `open`, `pid`, `product`, `model`, `cat`, `category` are stripped via **302-style** `location.replace` to `?sku=` only (`product-detail.js` top + merged-SKU redirects). |
| **Merged SKUs** | Alternate SKUs (e.g. `31002` → `31001`) redirect to a **single** canonical SKU URL — avoids near-duplicate PDPs. |
| **Trailing / hash** | Canonical and JSON-LD omit hash; `seo.js` strips `hash` when normalizing. |
| **`all-products.html?cat=` pattern** | Category filters use a **bare** canonical on the catalog page; PDPs do **not** use `cat` in the canonical — correct separation. |

**Verdict:** Best-practice for a static site: **exactly one self-referencing canonical per product** with a single `sku` query parameter.

---

## 2. Signals checked vs requirements

| Requirement | Before | Risk |
|-------------|--------|------|
| **(1) Canonical = indexable URL** | JS set `...?sku=` after data load; static HTML had **bare** `product-detail.html` without `sku`. Crawlers / preview tools could see a **mismatch** until JS ran. | Medium |
| **(2) `og:url` = canonical** | Updated in JS; same timing issue; static `og:url` had no `sku`. | Medium |
| **(3) JSON-LD `url` = canonical** | Already matched in `renderDetail`. | Low |
| **(4) Title product-specific** | Set in `renderDetail` after `waitForProductManager`. Static title was generic. | Medium |
| **(5) Meta description product-specific** | Set in `renderDetail` (EN template + ZH from copy). Static meta was generic. | Medium |
| **(6) H1 unique / product-specific** | `#productName` filled in `renderDetail`; **empty** until then → weak first paint. | Medium |
| **(7) Host mismatch** | `WK_PREFERRED_ORIGIN` is always `www` HTTPS; no `location.origin` on PDP. | Low |
| **(8) Blank / default metadata** | Generic “Product \| …” in HTML until JS. | Medium |
| **(9) Meaningful body content** | Description, specs, tabs, related products populated in JS — OK for **rendered** indexing; static shell thin. | Low (Google renders JS) |
| **(10) `og:image`** | Not updated to product image — social previews used site hero. | Medium |

---

## 3. `scripts/seo.js` interaction

- **Deferred** `seo.js` runs `normalizeCanonical()` on `DOMContentLoaded`. For `product-detail.html` **with** `?sku=`, it builds the same `https://www.waikwantent.com/product-detail.html?sku=...` as JS.
- **Second delayed run** (`setTimeout(..., 800)`) is **skipped** on product-detail (`isProductDetailPage`) so `product-detail.js` output is not overwritten — **good**.
- **`applySocialTags`** uses `document.title` and meta description; after early + full render, these align.

---

## 4. Residual risks (not fully eliminable on static hosting)

1. **No SKU / invalid SKU:** User is redirected to `all-products.html`; until redirect completes, static or interim tags may reference a non-indexable state — short-lived.
2. **Non-JS clients:** Limited content; site is JS-dependent for PDP body — acceptable if primary audience is search engines that render JS.
3. **Server redirects:** Apex → `www` and HTTP → HTTPS must remain configured at the host (not in repo).

---

## 5. Conclusion

Core logic in `product-detail.js` was already strong (single canonical SKU, `og:url`, JSON-LD `url`, product-specific title/description after load). Gaps were **early** HTML defaults (no `sku` in canonical/social URLs, empty H1, generic title/meta until product data) and **og/twitter image** not following the product image.

See **`PRODUCT_DETAIL_INDEXING_FIXES.md`** for implemented mitigations.
