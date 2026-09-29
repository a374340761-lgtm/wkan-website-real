# SEO/GEO daily check — 2026-09-29

## Search Console baseline

Source: the six-month Search Console export downloaded on 2026-09-29, covering
2026-04-08 through 2026-09-26.

- 202 clicks from 26,555 impressions; raw CTR 0.76%; impression-weighted average
  position 11.94.
- Latest 28 days: 28 clicks from 9,194 impressions, compared with 48 clicks from
  6,187 impressions in the prior 28 days. CTR fell from 0.78% to 0.30% while
  average position improved from 12.83 to 10.00.
- One anomalous query, “b2b custom canopy manufacturers 16x16 inch
  specifications,” produced 8,673 impressions, zero clicks, and average position
  2.99. It represents about 32.7% of all impressions and must be excluded from
  decisions about rewriting the main canopy page until Search Console confirms
  the traffic is genuine. Excluding it, the period CTR is about 1.13%.
- Desktop: 126 clicks / 24,102 impressions / 0.52% CTR. Mobile: 75 clicks /
  2,441 impressions / 3.07% CTR. Desktop snippets and intent matching need the
  closest review.
- Spanish-language markets produced 34 clicks from 363 impressions. Language
  expansion remains a measurement item until enquiries can be attributed by
  landing page and country.

## Technical check

- Architecture validator passed for routes, inquiry flow, and 82 products.
- Structured-data validator passed before implementation: 191 HTML pages and 60
  Product items.
- Homepage, robots.txt, sitemap.xml, the main PDP, the canopy page, and the
  Chinese homepage returned HTTP 200; a fake URL returned 404.
- HTTP apex currently reaches HTTPS www through two redirects. Cloudflare or DNS
  configuration is required to make this a single hop.
- At the start of the check, no GA4 measurement ID or GTM container was present.
  GTM container `GTM-TVQFLJP7` is now installed across the site with consent
  defaults and lead/download data-layer events. GA4 measurement ID
  `G-4H3KDBSS0Y` still needs to be configured and published in the GTM workspace.
- Several hero assets remain between roughly 1.6 MB and 2.66 MB and should enter
  a measured image-compression pass after visual review.

## Implemented in this pass

- Replaced the unsupported “25+ years” claim with the verifiable “since 2010”
  wording across shared navigation, About content, and the enquiry autoresponse.
- Localized raw Chinese H1 text and added a validation rule that rejects
  indexable `/zh/` pages whose H1 has no Chinese characters.
- Rewrote the two high-impression trade-show backdrop guides with natural buyer
  language and matching visible/JSON-LD FAQs.
- Improved the all-products H1 around OEM product-catalog intent.
- Added five bilingual, static SKU page pairs with visible specifications,
  sourcing notes, canonical/hreflang links, Product schema, and direct quote CTAs.
- Routed internal catalog links for the pilot SKUs to their static URLs and kept
  the dynamic SKU route as compatibility fallback.
- Installed the consent-aware GTM container and lead/download data-layer events
  without forwarding form values or URL query strings. The GA4 Google tag still
  needs to be published in GTM.

## Next measurement window

After deployment, submit the sitemap and annotate the release date. Compare the
pilot pages and rewritten guides after 14 and 28 days using impressions, clicks,
CTR, query relevance, indexed status, and qualified enquiries. Expand static
product pages only when the pilot gains index coverage and useful queries.
