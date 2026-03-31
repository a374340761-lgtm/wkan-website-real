# SEO index fixes (2026-03-30)

**Preferred origin:** `https://www.waikwantent.com` (matches live site and sitemap).

## Summary

These changes align **canonical URLs**, **Open Graph / Twitter URLs**, **JSON-LD**, and **sitemap** entries on a **single www host**, remove **sitemap URLs that conflicted with `noindex`**, and reduce **script races** on product detail pages. **Internal links** were added as plain text (`<a href>`) on high-traffic pages so crawlers see crawlable paths without relying only on JS-heavy UI. **Thin category pages** received short, unique intro copy and (where needed) stronger meta descriptions and static `<title>` fallbacks.

## Files changed

| File | What changed | Why it matters for Google |
|------|----------------|---------------------------|
| `scripts/product-detail.js` | `WK_PREFERRED_ORIGIN` / `BASE_URL` fixed to `https://www.waikwantent.com`; canonical, `og:url`, JSON-LD, and **`twitter:url`** use that origin. | Eliminates apex vs **www** canonical conflicts in GSC; structured data `url` matches indexed URL. |
| `scripts/seo.js` | Apex → **www** rewrite on social `absUrl`; **skipped second `run(800ms)` on `product-detail.html`** so PDP scripts are not overwritten. | OG/Twitter URLs stay on **www**; avoids fighting `product-detail.js` after i18n delay. |
| `sitemap.xml` | Removed **`tent-detail.html`**, **`products.html`**, **`product.html`**. | Those URLs are **`noindex`** or redirects; listing them suggested indexing URLs Google should ignore or consolidate. |
| `product-detail.html` | Added static **`meta name="twitter:url"`** (updated at runtime). | Parity with canonical/`og:url` before/after JS. |
| `index.html` | Text links under **Guides** to product center, all products, categories, news, site map. | More crawlable paths from homepage. |
| `product-center.html` | Line of text links to **all products**, **news**, **site map**. | Hub page passes equity to catalog and news. |
| `all-products.html` | **Product center** link in “Related reading”. | Connects search page back to category hub. |
| `dome-type.html`, `furniture-type.html` | Static **title** fallback text, **`meta name="description"`** (dome + furniture), short **intro paragraph** with internal links. | No empty `<title>` for no-JS; unique copy reduces thin-template risk. |
| `products-accessories.html` | Title fallback; **intro links** to filtered catalog, product center, tent types. | Clear crawl paths + uniqueness. |
| `racegate-type.html`, `six-sided-booth.html` | Richer **meta description**; **intro paragraphs** with internal links. | Distinct snippets + internal discovery. |
| `products.html` | **`meta name="description"`** (still **`noindex`**). | Consistent head even on redirect stub. |
| `index.original.html`, `index.wireframe.html` | **Absolute canonical** to `https://www.waikwantent.com/`; **meta description**; **distinct titles**. | Relative `index.html` canonicals were invalid/ambiguous; titles no longer duplicate “Redirecting…”. |
| `test_logo.html`, `test_stats.html` | **Absolute canonical** to site root; **meta description** (still **`noindex`**). | Test pages still blocked but heads are valid if ever fetched. |

## Not changed (by design)

- **`noindex`** on legacy redirects (`product.html`, `products.html`, `tent-detail.html`, `products-*.html` shortcuts, etc.) — keeps duplicate URLs out of the index.
- **`robots.txt`** — already pointed to `https://www.waikwantent.com/sitemap.xml`; left as-is.
- **Multilingual** — `data-translate` on `<title>` preserved; fallback text is overwritten when i18n runs, same as before.

## Follow-up (server / GSC)

- Enforce **301** from `https://waikwantent.com/*` → `https://www.waikwantent.com/*` at hosting if not already done.
- In **Google Search Console**, use the **www** URL-prefix property (or domain property) that matches **`rel=canonical`**.
