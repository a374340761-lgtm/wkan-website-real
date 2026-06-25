# Search and AI Visibility Monitoring Playbook

Generated: 2026-06-25

## Purpose

Use this playbook to decide whether the latest SEO/GEO work improved indexing, SERP CTR, commercial-page visibility or AI citation readiness. Review weekly for the first 8 weeks after deployment, then monthly.

## Primary Properties

- Google Search Console property: `https://www.waikwantent.com` or domain property matching the live canonical host.
- Sitemap to submit/check: `https://www.waikwantent.com/sitemap.xml`
- Bing Webmaster Tools property: `https://www.waikwantent.com`
- Preferred host: `https://www.waikwantent.com`

## Page Groups

| Group | URLs |
|---|---|
| Core commercial pages | `/`, `/custom-canopy-tent-manufacturer.html`, `/beach-flag-supplier.html`, `/portable-display-systems.html`, `/10x10-pop-up-canopy-tent.html`, `/contact-us.html` |
| Product hubs | `/product-center.html`, `/all-products.html`, `/site-map.html` |
| Strategic PDP examples | `/product-detail.html?sku=2001`, `/product-detail.html?sku=42001`, `/product-detail.html?sku=9001` |
| FAQ and buyer support | `/faq.html`, `/faq-moq.html`, `/faq-lead-time.html`, `/faq-artwork-files.html`, `/faq-shipping.html` |
| High-intent SEO pages | `/seo/custom-canopy-tent-factory-for-reseller-programs.html`, `/seo/trade-show-canopy-tent-manufacturer-for-distributors.html`, `/seo/custom-printed-canopy-tent-manufacturer-oem-china.html`, `/seo/collapsible-display-system-wholesale-distributor-pricing.html`, `/seo/advertising-flag-pole-and-base-wholesale-supplier-b2b.html` |
| Expected exclusions | bare `/product-detail.html`, redirect stubs such as `/racegate-type.html`, legacy duplicates such as `/products.html`, test/archive pages |

## Google Search Console Dashboard

Review `Performance > Search results` with these dimensions:

- `Queries`
- `Pages`
- `Countries`
- `Devices`
- `Search appearance`
- `Dates`

Track these metrics:

- `Clicks`
- `Impressions`
- `CTR`
- `Average position`

Recommended comparison windows:

- 7 days vs previous 7 days for early issue detection.
- 28 days vs previous 28 days for CTR and visibility trends.
- 3 months vs previous 3 months for seasonality and content impact.

## GSC Filters

### High Impressions, Low Clicks

Use weekly:

- Filter pages to the core commercial pages and high-intent SEO pages.
- Sort by impressions.
- Flag any page with at least 100 impressions in 28 days and CTR below 1%.
- Action: review title link, snippet, first-screen copy and query/page intent match.

### Position 6-15, CTR Below Target

Use weekly:

- Filter queries with average position between 6 and 15.
- Flag queries with CTR below 2% for commercial-intent terms.
- Action: improve page title/snippet, add buyer proof, expand FAQ answer if query maps to a question.

### New or Improved Pages

Use weekly:

- Filter pages changed in this SEO cycle.
- Compare last 7 or 28 days to previous period.
- Flag pages where impressions increased but CTR did not.
- Action: prioritize SERP copy refinement before adding new pages.

### Sudden Impression Loss

Use weekly:

- Sort pages by impression change descending negative.
- Flag pages with impressions down more than 30% week over week.
- Action: inspect URL in GSC, confirm canonical, index status, sitemap inclusion and page availability.

### Indexing Health

Use `Indexing > Pages` weekly:

- Watch `Crawled - currently not indexed`.
- Watch `Duplicate, Google chose different canonical than user`.
- Watch `Page with redirect`.
- Watch sitemap submitted URL errors.

Acceptable exclusions:

- Legacy redirects and noindex stubs.
- Parameter-only filtered catalog URLs consolidated to canonical pages.
- Test/archive pages blocked or noindexed.

Problem exclusions:

- SKU PDP URLs from sitemap stuck as crawled but not indexed.
- Core commercial pages marked duplicate, alternate or discovered but not indexed.
- Any sitemap URL returning error, redirect or noindex.

## URL Inspection Checklist

Run after deployment, then again after 7-14 days:

- `https://www.waikwantent.com/`
- `https://www.waikwantent.com/custom-canopy-tent-manufacturer.html`
- `https://www.waikwantent.com/beach-flag-supplier.html`
- `https://www.waikwantent.com/portable-display-systems.html`
- `https://www.waikwantent.com/contact-us.html`
- `https://www.waikwantent.com/product-detail.html?sku=2001`
- `https://www.waikwantent.com/product-detail.html?sku=42001`
- `https://www.waikwantent.com/product-detail.html?sku=9001`
- One high-intent `/seo/` URL from the changed group

Record:

- User-declared canonical
- Google-selected canonical
- Crawl allowed
- Indexing allowed
- Page fetch status
- Last crawl date
- Enhancements detected

## Bing Webmaster AI Performance

If AI Performance reporting is available, review weekly:

- `Cited pages`
- `Grounding queries`
- `Citation trends`
- `Clicks from AI experiences`
- `Impressions in AI experiences`

Priority pages to watch:

- `/custom-canopy-tent-manufacturer.html`
- `/beach-flag-supplier.html`
- `/portable-display-systems.html`
- `/contact-us.html`
- The five high-intent `/seo/` pages listed above

Rules:

- If a page is cited but does not receive clicks, review whether the page answer is complete enough and whether the CTA is visible.
- If grounding queries cite the wrong page, add internal links from the cited page to the correct commercial page.
- If AI citations grow but GSC clicks do not, treat it as awareness lift and watch branded/search-assist queries for 2-4 weeks.
- If no AI citations appear after 4-6 weeks, do not create more AI files first; improve on-page facts, tables, FAQ and evidence blocks.

## Weekly Review Template

Copy this section into the weekly SEO log.

### Week Of

- Date range:
- Reviewer:
- Deployment or content changes this week:

### GSC Summary

| Metric | Current 7 days | Previous 7 days | Current 28 days | Previous 28 days | Notes |
|---|---:|---:|---:|---:|---|
| Clicks |  |  |  |  |  |
| Impressions |  |  |  |  |  |
| CTR |  |  |  |  |  |
| Average position |  |  |  |  |  |

### Pages To Watch

| Page | Impressions | Clicks | CTR | Avg position | Status |
|---|---:|---:|---:|---:|---|
| `/custom-canopy-tent-manufacturer.html` |  |  |  |  |  |
| `/beach-flag-supplier.html` |  |  |  |  |  |
| `/portable-display-systems.html` |  |  |  |  |  |
| `/contact-us.html` |  |  |  |  |  |
| `/seo/custom-canopy-tent-factory-for-reseller-programs.html` |  |  |  |  |  |
| `/seo/trade-show-canopy-tent-manufacturer-for-distributors.html` |  |  |  |  |  |
| `/seo/collapsible-display-system-wholesale-distributor-pricing.html` |  |  |  |  |  |

### Query Opportunities

| Query | Page | Impressions | CTR | Avg position | Action |
|---|---|---:|---:|---:|---|
|  |  |  |  |  |  |

### Indexing Issues

| URL | GSC status | Canonical selected | Action owner | Due date |
|---|---|---|---|---|
|  |  |  |  |  |

### Bing AI Performance

| Cited page | Grounding query | AI impressions | AI clicks | Trend | Action |
|---|---|---:|---:|---|---|
|  |  |  |  |  |  |

### Decisions

- Pages to rewrite:
- Pages to strengthen with evidence:
- Pages to inspect/request indexing:
- Internal links to add:
- No-action observations:

## 30 / 60 / 90 Day Interpretation

### After 30 Days

Expect:

- Cleaner sitemap processing.
- Early indexing clarity for core pages and selected SKU URLs.
- Initial impression movement on updated title/description pages.

Do not overreact to:

- Low AI citations.
- PDP pages still consolidating.
- CTR noise on pages with fewer than 100 impressions.

### After 60 Days

Expect:

- More stable CTR comparison on core pages.
- GSC query data for high-intent `/seo/` pages.
- Fewer sitemap/index conflicts.

Act if:

- Core commercial pages have impressions but CTR remains below 1%.
- Position 6-15 queries are not improving after copy updates.
- AI citations cite generic pages instead of specific commercial pages.

### After 90 Days

Expect:

- Clearer view of which page group drives inquiry intent.
- Enough query/page data to decide whether to expand `/seo/` pages or improve existing pages.

Act if:

- High-intent pages get impressions but no clicks: rewrite SERP copy and add proof.
- Pages get clicks but no inquiries: improve CTA, RFQ clarity and trust evidence.
- AI citations remain absent: add more structured facts, comparison tables and evidence modules.

## Do Not Track As Success Alone

- Number of pages published.
- Number of AI helper files.
- Impressions without CTR improvement.
- Crawled URLs that are intentionally noindex or redirect stubs.

## Success Signals

- Core commercial CTR improves on stable impression volume.
- Position 6-15 queries move into top 5 or gain CTR.
- Strategic PDPs become indexed or show stable canonical selection.
- Contact/RFQ page receives more clicks from commercial pages.
- Bing AI citations use the intended page for the matching product category.
