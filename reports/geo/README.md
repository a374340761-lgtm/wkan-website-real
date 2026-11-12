# GEO execution and measurement — 2026-11-12

24 English procurement questions are mapped to existing pages in buyer-question-pool.csv. This is a proposed test set, not measured buyer search volume. No AI visibility results have been asserted.

## Weekly protocol
Run the same questions in fresh conversations on ChatGPT and Gemini, with the same locale and web-search setting. Repeat each question three times; retain dated screenshots or answer exports and cited URLs. Record each observation separately in observation-log.csv. Report brand mentions and own-site citations separately, with sample counts. Do not compare runs with different settings as a ranking change.

## Inquiry attribution
scripts/analytics.js records a bounded referral source in sessionStorage only after analytics consent; withdrawal clears it. Shared analytics events now include acquisition_source. scripts/contact.js includes it in the payload and existing message field so backends with fixed columns retain the classification. This is observed referral attribution, not proof the buyer used AI. Direct visits and missing referrers remain unknown; Google AI traffic cannot be separated reliably by referrer. No extra GA configuration or production submission has been performed. Configure acquisition_source as an event-scoped custom dimension in GA4 to report it. WhatsApp clicks are intent signals, not confirmed inquiries.

## Content evidence
Three core English commercial pages now contain procurement comparison checklists linking existing manufacturing, packing and dispatch evidence. No new certification, performance rating, MOQ or delivery promise was invented. Obtain verified model-specific specifications, packing dimensions and approved customer cases before adding those claims.

## Outcome review
After deployment, verify pages and a real authorized inquiry end to end. Review 28-day qualified inquiries alongside citations and referral events. Record inquiry qualification and orders in the sales system; do not infer orders from clicks. Visibility improvements cannot be guaranteed.
