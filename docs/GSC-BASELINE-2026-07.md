# GSC baseline and next actions — 2026-07

## Scope

- Export type: Google Search Console web search
- Export filter: last 6 months
- Daily chart coverage in the supplied export: 2026-04-08 through 2026-07-18
- Baseline totals: 97 clicks, 9,173 impressions, approximately 1.06% CTR
- Search appearance export contains no classified rich-result rows

This baseline must remain the comparison point for the first post-deployment review. Compare equivalent 28-day windows and do not compare partial periods.

## Evidence-backed findings

### 1. Desktop and US totals contain a likely synthetic-query distortion

The exact query `b2b custom canopy manufacturers 16x16 inch specifications` generated 2,511 impressions, no clicks and an average position of 4.08. It represents about 27% of all exported impressions. The wording, repeated volume and absence of clicks are inconsistent with the rest of the site's organic demand and are likely rank-monitoring or automated-search noise.

Do not add unsupported `16x16 inch` copy, create a page for this phrase or judge the canopy page by the raw aggregate CTR. Exclude this exact query from routine opportunity reports. Recheck it in GSC by query + page + country + device before taking any content action.

Desktop recorded 8,735 impressions at 0.69% CTR, while mobile recorded 433 impressions at 8.31% CTR. The anomalous query likely explains a material part of that gap, so this export does not prove that the desktop snippet or desktop UX alone is failing.

### 2. Highest page-level opportunities

| Priority | Page | Baseline | Decision |
|---|---|---:|---|
| P0 measurement | `/custom-canopy-tent-manufacturer.html` | 3,407 impressions, 7 clicks, position 6.72 | Improve the commercial snippet, but exclude the anomalous query when measuring the result. |
| P0 CTR | `/zh/custom-canopy-tent-manufacturer.html` | 955 impressions, 0 clicks, position 7.41 | Align title and H1 with observed Chinese manufacturer queries. |
| P1 relevance | `/seg-light-box-manufacturer.html` | 788 impressions, 1 click, position 32.70 | Strengthen the SEG manufacturer/supplier topic and answer buyer questions; ranking, not only CTR, is the main constraint. |
| P1 CTR | `/all-products.html` | 277 impressions, 3 clicks, position 4.82 | Make the snippet clearly identify an OEM product catalog and quote path. |
| P1 CTR | `/tent-type.html` | 221 impressions, 0 clicks, position 8.13 | Align the title with the observed `types of canopy tents` query. |
| Monitor | `/portable-display-systems.html` | 232 impressions, 1 click, position 16.11 | Keep current metadata; build authority and internal links before another rewrite. |

### 3. Country signals

- The United States has the most impressions (5,843) but only 16 clicks. Treat this cautiously until the anomalous query is excluded.
- China produced 18 clicks from 745 impressions. Chinese manufacturer-intent pages remain important.
- Spanish-speaking markets collectively show meaningful early engagement. Mexico alone produced 10 clicks from 56 impressions; Chile produced 7 from 35, with additional clicks from Peru, Colombia, Spain, El Salvador, Argentina, Ecuador, Venezuela and other markets.
- Do not create thin country or city pages from this evidence. A manually localized Spanish pilot is justified only after conversion tracking confirms lead quality. The pilot should start with the homepage, custom canopy manufacturer page and contact page rather than mass-generated pages.

### 4. Canonical host cleanup needs monitoring

The export still contains non-`www` URLs, including five clicks for the non-`www` custom canopy URL. Redirect and canonical fixes have already been added. After deployment, verify that all non-`www` variants return a single-hop permanent redirect to `https://www.waikwantent.com/...` and confirm that non-`www` impressions decline over subsequent 28-day windows.

## Changes made from this baseline

- Rewrote English and Chinese custom canopy titles/descriptions; aligned the Chinese H1 with manufacturer intent.
- Rewrote the SEG light box snippet and added visible buyer FAQs with matching `FAQPage` data.
- Rewrote the tent-type snippet around `types of canopy tents`.
- Rewrote the all-products snippet as an OEM product catalog.
- Updated JavaScript-managed metadata so client-side rendering does not revert the new static metadata.

## Measurement plan

1. Deploy and request indexing only for the four changed canonical pages.
2. Record the deployment date in the SEO change log.
3. After 14 days, check indexing and query/page alignment; do not declare a ranking result yet.
4. After 28 days, compare each page against the preceding equivalent 28-day period.
5. For the custom canopy page, apply an exclusion filter for the anomalous exact query in both periods.
6. Segment every comparison by page, country and device. Track clicks and qualified lead events alongside CTR and position.
7. Start a Spanish pilot only if Spanish-market organic sessions produce qualified WhatsApp, email or quote-form leads.

## Success criteria for the first review

- Changed pages remain canonical, indexed and free of rich-result errors.
- Non-`www` impressions trend downward.
- Chinese custom-canopy CTR improves without losing average position materially.
- SEG query coverage moves toward page two before further snippet testing.
- Product-catalog and tent-type CTR improve over equivalent query mixes.
- No decision is based on the anomalous query or raw desktop aggregate alone.
