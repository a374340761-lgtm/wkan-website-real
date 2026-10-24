# Recent additions review — 2026-10-24

Scope: local EN/ZH product specifications and detail photos, export loading story, catalog links, shared header/footer, Careers questionnaire and Google Sheets submission protocol. No production deployment or real candidate submission was performed in this review.

## Corrections

- Shared footer contact/company links now display individually, wrap safely, and retain their existing appearance. Previously adjacent inline links visually ran together at some widths.
- Careers timeout message now agrees with session draft restoration and explains that consent must be checked again after a refresh. Submission identity remains stable for unchanged answers.
- Question field hints now have IDs and are associated with their inputs through aria-describedby.
- Updated Careers script and footer module cache versions. Regenerated both Careers pages from their shared generator.

## Verification

- 184 page/viewport scenarios: no detected local resource errors, broken images, horizontal overflow, missing footer/Xiaohongshu icon, missing mapped specification sections or incorrect heading counts.
- 62 catalog link clicks: no failures.
- 20 product interactions: lightbox filters, mobile submenu, RFQ cart, market-stall gallery/spec tabs, canopy detail anchor and export resource links passed.
- 16 header layouts, 4 Careers navigation cases and 4 EN/ZH homepage/Careers footer comparisons passed.
- 16 Careers browser cases passed: success/failure/timeout/spoofing, mobile/desktop, EN/ZH, age/WeChat/answer restoration, consent reset, stable retry ID and absence of visible assessment output. Google replies were simulated; no spreadsheet rows created.
- 100 deterministic JavaScript/Python scoring cases matched; Apps Script contract tests passed (6 groups, 8 invalid variants).
- Static product generator: 16 pages current. Translation audit: 154 canonical pages, no empty slots. Architecture: 85 products passed.
- SEO validator: 156 HTML pages and 154 sitemap landing pages passed. Structured-data validator: 212 HTML files, 16 Product items, no detected issues.

## Limits / follow-up

- Product specification mapping and image references were checked against existing reviewed local data. Automated checks do not independently certify every photographed component, material claim or source spreadsheet value.
- Full answer text remains available for manual recruitment review. Client-side scores can be modified by an applicant and must not determine hiring decisions.
- Google Sheets real storage was previously confirmed by the user (one overview row plus 13 answers); this review reran transport and failure tests without writing real records.
- Browser tests intentionally blocked third-party assets, so they verify local fallback behavior rather than external font/CDN availability or performance within mainland China.
- SEO/GEO readiness is not evidence of Search Console indexing, ranking, traffic growth or citation by AI systems. These require production measurements after release.
- Changes are local only; publish the changed pages, scripts and shared CSS together, then revalidate production cache behavior.
