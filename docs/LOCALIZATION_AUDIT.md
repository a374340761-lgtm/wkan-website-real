# Full-site bilingual localization audit — Wai Kwan Tent

**Scope:** `D:\wkan-website-real` — HTML, `scripts/multilang.js` (primary i18n), `/news/`, homepage meta, representative fixes.  
**Goal:** Professional B2B OEM/ODM tone, natural English, aligned Chinese, consistent terminology.

---

## Issues addressed (file → change → reason)

### 1. `scripts/multilang.js` — Primary UI strings

| Original | Improved (EN) | Improved (CN) | Reason |
|----------|----------------|---------------|--------|
| `inquiry_form_submit`: "Submit Inquiry" | **Send Inquiry** | **发送询盘** (was 提交询盘) | Align with standard B2B CTA list; CN uses 发送询盘 as requested. |
| `view_details`: "View details" | **View Details** | (unchanged) | Title case for UI labels. |
| `inquiry_form_product_flag`: "Beach Flag" | **Beach Flags** | (unchanged) | Category label: plural matches product range. |
| Testimonials (3 EN quotes) | Rewritten: remove "Weiqun", reduce "Very very", fix "cooperation with" tone | (unchanged) | Testimonials sounded like literal translation; names kept, roles kept. |
| `form_submit_success` (EN) | Thank you — your message was sent… | — | Less exclamation-heavy; more professional. |
| `form_submit_success` (ZH) | 消息发送成功！… | **感谢您的留言，我们已收到，将尽快与您联系。** | Calmer, native confirmation. |
| `home_news_feature_summary` (EN) | Tighter sentence; "buyers on the show floor" | — | Clearer news strip; less wordy. |
| `home_news_feature_summary` (ZH) | — | **伟群帐篷参展…海内外客户…** | Smoother flow; 展示器材 retained. |
| `products_cta_text` | …tailored quotation for your market | — | Removes "Contact us today" filler. |
| `category_flags_desc` | …poles, bases… | — | Aligns with Beach Flags + hardware terminology. |

### 2. `index.html` — SEO & social

| Field | Original | Improved |
|-------|----------|----------|
| `<title>` | Custom Canopy Tents & Display Manufacturer \| WaiKwan | **Custom Canopy Tents & Beach Flags \| OEM/ODM Manufacturer \| Wai Kwan Tent** |
| `meta description` | Factory-direct manufacturer… | **Guangxi Wai Kwan Tent — OEM/ODM manufacturer… display hardware… Request a quote** |
| `og:title` / `twitter:title` | Long company legal name | **Shorter, keyword-rich, consistent branding "Wai Kwan Tent"** |
| `og:description` / `twitter:description` | "professional manufacturer… providing OEM" | **OEM/ODM + audience (brands, distributors) without repetition** |

**Reason:** Stronger keywords (custom canopy tent, beach flag, OEM/ODM, display hardware), clearer value prop, consistent brand spelling.

### 3. `news/index.html` — News hub

| Original | Improved |
|----------|----------|
| Title "News \| Wai Kwan Tent" | **News & Updates \| Wai Kwan Tent — OEM Tent & Display Manufacturer** |
| Meta description (generic "Read the latest…") | **Company news… OEM/ODM canopy tents, beach flags, display hardware** |
| Keywords | Added **beach flag manufacturer, display hardware, OEM ODM** |

### 4. `news/apppexpo-2026-shanghai.html` — Article & SEO

| Section | Change |
|---------|--------|
| Title & meta | Keywords: **beach flag manufacturer, display hardware supplier, OEM tent factory** |
| OG/Twitter | Shorter titles; descriptions match press release tone |
| EN body — Overview | "exhibited at", "walk through product details", removed redundant "excellent opportunity" chain |
| EN — Products | "On display were…" — direct, catalogue-style |
| EN — Meeting | Shorter; "Conversations on the stand…" |
| EN — Looking ahead | OEM/ODM + **display hardware** explicitly; thanks line tightened |
| Related link EN | "Contact & quotes" → **Contact for a quote** |
| Related link ZH | **联系询价** (dropped redundant 与) |

**Reason:** Reads like a company news item, not generic AI; terminology aligned with brand glossary.

---

## Global improvement summary

### Top recurring issues (site-wide)

1. **CTA inconsistency** — "Submit" vs "Send" inquiry; standardized primary form CTA to **Send Inquiry** / **发送询盘**.
2. **Title case** — "View details" vs **View Details** for buttons/links.
3. **Testimonials** — Mixed brand name ("Weiqun"), overly enthusiastic adjectives; rewritten for credible B2B tone.
4. **Meta titles** — Too long or duplicated legal entity; shortened for SERP and OG.
5. **Keyword stacking** — Descriptions now weave **OEM/ODM**, **beach flags**, **display hardware** naturally.
6. **News copy** — English sections were grammatically fine but verbose; tightened for scanability.
7. **Success messages** — Exclamation-heavy CN/EN; softened to professional confirmations.
8. **Category flags** — Descriptor line expanded to include **poles, bases** alongside beach flags.
9. **Related links** — Ambiguous "Contact & quotes" → explicit **Contact for a quote**.
10. **Plural product labels** — Beach flags as a category → **Beach Flags** in inquiry dropdown (EN).

### Terminology standardization (recommended)

| English | 中文 |
|---------|------|
| Beach Flags | 沙滩旗 |
| Display Hardware / Display Systems (category) | 展示器材 / 展示系统（按栏目固定） |
| Custom Branding | 定制品牌展示 |
| OEM/ODM Manufacturer | OEM/ODM 制造商 |
| Event Display Solutions | 活动展示方案 |
| Get a Quote / Send Inquiry | 获取报价 / 发送询盘 |
| View Details | 查看详情 |

### Tone guideline (Wai Kwan)

- **Use:** Confident, factual, export-oriented; short sentences; specify product types (tent, flag, pole, base, frame).
- **Avoid:** Hyperbole ("the best"), vague "welcome to inquiry", mixed brand spellings (WaiKwan vs Wai Kwan — prefer **Wai Kwan Tent** in body).
- **Bilingual:** Same meaning in EN/ZH; avoid literal translation of idioms; CN 书面、简洁.

### Suggested future writing style

- Lead with **what we manufacture** and **who we serve** (brands, distributors, events).
- One **OEM/ODM** mention per section max unless needed for SEO.
- Press/news: **date, place, what was shown, who we met, next step** — no filler gratitude paragraphs.

---

## Also applied in codebase (consolidation pass)

- **`products-tents.html`** — Button fallback `View details` → **View Details** (matches `data-translate`).
- **`scripts/main.js`** — Empty-hero fallback: title **Wai Kwan Tent**, subtitle OEM/ODM line, image `alt` descriptive.
- **`product-detail.html`** — Default `<title>`, meta description, OG/Twitter (no empty descriptions); `#productImage` **alt** text.
- **`scripts/product-detail.js`** — Dynamic `document.title` uses **Wai Kwan Tent** (EN) or full company name (ZH).
- **`product-center.html`**, **`all-products.html`**, **`tent-type.html`**, **`flag-type.html`** — Titles, descriptions, keywords, OG/Twitter aligned with OEM/ODM + beach flags + display hardware.

---

## Not exhaustively edited (follow-up)

- Individual product HTML/JSON in `products.js` (large dataset).
- Every landing page `faq-*.html`, `custom-*.html` — spot-check recommended.
- Image `alt` on legacy pages — prioritize product and news galleries first (news gallery alts already descriptive).

---

*Document generated as part of the localization pass; update as new pages are added.*
