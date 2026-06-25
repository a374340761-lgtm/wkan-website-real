# WaiKwan SEO Phase 1 Index Priority

Generated: 2026-06-25

## Phase 1 Summary

This pass focuses on technical indexing signals, not CTR copywriting or content expansion.

- `sitemap.xml` and `page-sitemap.xml` were regenerated with the same 328 canonical URLs.
- Redirect stubs, legacy duplicate entry points, test/archive files, 404, and bare product templates are excluded from sitemap output.
- `racegate-type.html` and `zh/racegate-type.html` are now explicit `noindex,follow` redirect stubs.
- Product detail SKU URLs remain sitemap-eligible only when the SKU exists in `scripts/product-seo-map.js`.
- SKU product detail pages update canonical, Open Graph URL, Twitter URL, and hreflang alternates together when `?sku=` is present.

## Tier 1: Priority Indexing Pages

These pages should stay indexable and visible in sitemap because they represent the strongest commercial and conversion targets.

- Home pages: `/`, `/zh/`
- Product and catalog hubs: `/product-center.html`, `/all-products.html`, `/site-map.html`
- Core commercial pages: `/custom-canopy-tent-manufacturer.html`, `/beach-flag-supplier.html`, `/portable-display-systems.html`, `/advertising-light-box-manufacturer.html`, `/seg-light-box-manufacturer.html`
- Quote and trust pages: `/contact-us.html`, `/about-us.html`, `/company-profile.html`, `/manufacturing-capabilities.html`
- High-value product detail URLs from `scripts/product-seo-map.js`, for example:
  - `/product-detail.html?sku=2001`
  - `/product-detail.html?sku=42001`
  - `/product-detail.html?sku=9001`
  - `/zh/product-detail.html?sku=2001`
  - `/zh/product-detail.html?sku=42001`
  - `/zh/product-detail.html?sku=9001`

## Tier 2: Supportive Indexing Pages

These pages are valid for indexing when they provide distinct buyer education, FAQ coverage, or topical support for commercial pages.

- FAQ pages: `/faq.html`, `/faq-moq.html`, `/faq-lead-time.html`, `/faq-shipping.html`, `/faq-samples.html`, `/faq-artwork-files.html`, `/faq-color-matching.html`
- Buying guides: `/canopy-tent-buying-guide.html`, `/beach-flag-buying-guide.html`, `/portable-display-buying-guide.html`
- Product type and collection pages that have crawlable unique content: `/tent-type.html`, `/flag-type.html`, `/furniture-type.html`, `/products-accessories.html`, `/collections/*.html`
- News and trade show pages under `/news/`
- Long-tail commercial and informational pages under `/seo/` and `/zh/seo/`

## Tier 3: Do Not Submit For Indexing

These URLs should not appear in sitemap output because they are redirect stubs, legacy duplicates, thin templates, or utility pages.

- Bare product templates:
  - `/product-detail.html`
  - `/zh/product-detail.html`
- Legacy duplicate entry points:
  - `/product.html`
  - `/products.html`
  - `/tent-detail.html`
  - `/zh/product.html`
  - `/zh/products.html`
- Redirect category stubs:
  - `/products-flags.html`
  - `/products-displays.html`
  - `/products-lightbox.html`
  - `/products-custom.html`
  - `/products-inflatable.html`
  - `/products-furniture.html`
  - `/racegate-type.html`
  - `/zh/racegate-type.html`
- Test, archive, duplicate utility, and error pages:
  - `/index.original.html`
  - `/index.wireframe.html`
  - `/test_logo.html`
  - `/test_stats.html`
  - `/news/contact-us.html`
  - `/404.html`

## Product Detail SKU Strategy

The static `product-detail.html` template remains `noindex,follow` because it has no standalone product entity without a SKU.

When `?sku=` is present:

- The early head script reads `window.WK_PRODUCT_SEO_MAP`.
- The page switches robots to `index,follow`.
- Canonical, `og:url`, `twitter:url`, and hreflang alternates are set to SKU-specific URLs.
- Product JSON-LD uses the same SKU canonical URL as `@id` and `url`.

Invalid, merged, or legacy SKU routes should continue to redirect to the canonical product or catalog URL rather than being added to sitemap.

## Sitemap Rules

Sitemap entries must satisfy all of these rules:

- Use the preferred origin `https://www.waikwantent.com`.
- Resolve to a canonical URL that is intended to be indexed.
- Avoid noindex pages, redirect stubs, test files, archive files, and bare templates.
- Avoid parameter-only catalog filters such as `product-center.html?cat=...` and `all-products.html?cat=...`.
- Include SKU PDP URLs only from `scripts/product-seo-map.js`.

## Phase 1 Verification

The regenerated sitemap files were checked for these excluded URL patterns:

- `racegate-type.html`
- bare `product-detail.html`
- `product.html`
- `products.html`
- `tent-detail.html`
- `products-flags.html`
- `products-displays.html`
- `products-lightbox.html`
- `products-custom.html`
- `products-inflatable.html`
- `products-furniture.html`

No excluded patterns were found in `sitemap.xml` or `page-sitemap.xml` after regeneration.
