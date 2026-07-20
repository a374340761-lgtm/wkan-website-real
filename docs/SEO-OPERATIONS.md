# WaiKwan SEO operations

## Positioning

The primary search goal is qualified global B2B OEM/ODM enquiries. Country or
city landing pages must not be published unless they contain market-specific
buying information and Search Console data shows sufficient demand.

## Search Console baseline

Export the previous six months from Search Console before deployment:

1. Performance → Search results → Queries.
2. Repeat for Pages, Countries, and Devices.
3. Export Pages/Indexing and Core Web Vitals separately.
4. Copy the priority rows into `docs/gsc-baseline-template.csv`.
5. Label queries as `brand` or `non-brand`.

Primary reporting views:

- Non-brand clicks by country.
- Impressions and CTR by landing page.
- Index coverage for canonical URLs in `sitemap.xml`.
- Mobile versus desktop performance.
- Enquiries by landing page and contact method.

## Content quality gate

The English `/seo/` guides remain indexable pending GSC review. Do not add more
template guides. Review high-impression pages first and either:

- strengthen them with product-specific specifications and sourcing evidence;
- merge overlapping pages and add a permanent redirect; or
- set `noindex,follow` when the page has no distinct buyer value.

The `/zh/seo/` guides are temporarily `noindex,follow` because their main copy is
not fully localized. Publish a Chinese guide only after a fluent review confirms:

- natural Chinese title, description, H1, body, FAQ, CTA, and structured data;
- terminology matches `docs/LOCALIZATION_AUDIT.md`;
- facts, MOQ, lead-time, and shipping claims are supported;
- the English page adds a reciprocal `zh-CN` hreflang link.

## Deployment commands

Run these from the repository root before every SEO deployment:

```powershell
python scripts/apply-seo-hardening.py
python scripts/build-page-sitemap.py
python scripts/validate-structured-data.py
python scripts/validate-seo.py
```

The hardening command is idempotent. It removes obsolete geo/keyword meta tags,
deduplicates JSON-LD, removes fabricated zero-price offers, adds conversion-event
and font connection helpers, and enforces the Chinese guide quality gate.

## Post-deployment checks

1. Confirm legacy URLs return permanent redirects from `vercel.json`.
2. Submit `https://www.waikwantent.com/sitemap.xml` in Search Console.
3. Inspect the homepage, three main product pages, contact page, and five
   highest-impression guides.
4. Validate visible page content, canonical, hreflang, JSON-LD, mobile layout,
   and form submission.
5. Compare clicks and CTR weekly; wait four weeks before drawing conclusions
   from ranking changes.
6. Review leads and country-level non-brand clicks monthly.

## Event names

`scripts/analytics.js` exposes consent-neutral events through `dataLayer` and,
when a consent-aware GA4 tag is installed, through `gtag`:

- `begin_lead` — quote-page link.
- `generate_lead` — successful form, WhatsApp, email, or phone action.
- `file_download` — PDF or catalog download.

The inquiry payload also records landing page, referrer, and UTM fields without
adding analytics cookies.
