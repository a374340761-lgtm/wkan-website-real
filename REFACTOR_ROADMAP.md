# WaiKwan Website — Staged Refactor Roadmap

**Repo:** `a374340761-lgtm/wkan-website-real`  
**Goals:** Controlled evolution, maintainability, low regression risk.  
**Constraints:** Preserve routing (`?cat=`, `?sku=`, legacy query patterns where still used), `scripts/multilang.js` + `data-translate` / `data-i18n`, and `scripts/seo.js` behavior unless a phase explicitly scopes SEO changes.

---

## 1. Current state — audit summary

### 1.1 Header / navigation
- **Split sources of truth:** `styles/modules/header-layout.css` defines base `.btn` / nav chrome; `styles/modules/modals-overlays.css` applies **global** surface + button overrides with `!important` on many selectors. Risk: nav and CTAs can drift or require **page-scoped escapes** (e.g. hero on dark backgrounds).
- **Mobile:** Accordion / hamburger behavior lives in `scripts/main.js` with `.nav-menu.active` rules spread across `pages-catalog.css` and related modules — hard to reason about in one place.
- **Deep menus:** Injected submenus (tents/flags/displays) add complexity; any header change should be tested on **touch targets** and **keyboard**.

### 1.2 Homepage hierarchy
- **Strengths:** Clear conversion path (hero → categories → proof → `#contact`); secondary content scoped under `.home-secondary`.
- **Risks:** Hero slides built in JS (`scripts/main.js`) — copy and CTA classes must stay aligned with CSS. Mixed **section** patterns (`wk-section`, inline padding on some landing HTML files) create uneven rhythm outside `index.html`.

### 1.3 CSS architecture
- **Entry:** `styles/main.css` imports a **fixed order** (tokens → header → pages-catalog → product-detail → modals → contact → layout-misc → home → product-cards). Later files **win** on specificity; `modals-overlays.css` acts as a **global theme layer** (surfaces, buttons, panels).
- **Pain points:** Large mixed files (`pages-catalog.css`, `layout-misc.css`, `modals-overlays.css`) combine unrelated concerns; some rules target the same components from multiple modules.
- **Duplication:** Card/list patterns are split across `tokens-base.css`, `product-cards.css`, `home.css`, and overrides in modals.

### 1.4 Product discovery
- **Hub vs catalog:** `product-center.html` + `product-center.js` vs `all-products.html` + `all-products.js` — behavior is documented in UX work; remaining risk is **copy/URL** drift in menus and SEO pages.
- **Data:** `scripts/products.js` is the dataset; listing UIs must not fork product identity fields.
- **Legacy HTML:** Multiple `*-type.html`, `products-*.html`, and `seo/*.html` pages link into catalog — changes to query params or hub URLs need **grep + link check**.

### 1.5 Inquiry / conversion
- **Form:** `index.html#contact` + `scripts/contact.js` + `scripts/inquiry-hook.js` (`window.WK_INQUIRY_SUBMIT`). Styling split between `contact-page.css` and global button rules in modals/tokens.
- **Risk:** Visual tweaks to `.btn` globally affect cookie banner, modals, hero, and contact.

---

## 2. Phased roadmap (priorities)

### Phase 1 — Mobile header + homepage conversion fixes
**Objective:** Highest user impact, smallest surface area: navigation usability and primary funnel on mobile without changing routes or i18n keys.

| Priority | Work |
|----------|------|
| P0 | Mobile nav: tap targets, scroll trap, z-index, focus order (document in one place). |
| P1 | Home hero CTAs: ensure contrast and button styles match **dark + light** slides (scoped CSS, not global `.btn` hacks). |
| P2 | Sticky CTA / `#contact` behavior: safe margin vs `env(safe-area-inset-bottom)`. |

**Recommended files (order of execution)**  
1. `scripts/main.js` — mobile nav accordion / listeners (only if behavior change).  
2. `styles/modules/header-layout.css` — nav layout, breakpoints.  
3. `styles/modules/pages-catalog.css` — `.nav-menu.active` mobile block (keep in sync with JS).  
4. `styles/modules/home.css` — hero / `.wk-hero-actions` only.  
5. `index.html` — only if markup change is required (prefer CSS/JS minimal diff).

**Risk notes**  
- **Low** if changes are scoped to `.navbar`, `.nav-menu`, `.home .wk-hero`.  
- **Regression:** Language dropdown (`lang-dropdown`), cart badge, search — retest after any `z-index` change.

---

### Phase 2 — CSS modularization
**Objective:** Reduce “random UI edits” by clarifying layers and ownership; **no** URL or copy changes.

| Priority | Work |
|----------|------|
| P0 | Document **import order** and what each module owns (`README` snippet or comment in `main.css`). |
| P1 | Split oversized files: e.g. extract **nav-only** from `pages-catalog.css` → `nav-mobile.css` (imported after header). |
| P2 | Consolidate **global theme** (`modals-overlays.css`) into named sections: `/* surfaces */`, `/* buttons */`, `/* panels */` — or move “theme overrides” to `theme-overrides.css` loaded last. |
| P3 | Optional: CSS variables for **all** radii/shadows (already started in `tokens-base.css`). |

**Recommended files (order)**  
1. `styles/main.css` — adjust `@import` only after new files exist.  
2. `styles/modules/tokens-base.css` — tokens first; no behavioral change.  
3. New small modules as needed (e.g. `nav-mobile.css`) — **one concern per file**.  
4. `styles/modules/modals-overlays.css` — internal split or trim `!important` only with visual regression pass.

**Risk notes**  
- **Medium:** Changing import order shifts cascade — **always** compare before/after on home, `all-products.html`, `product-detail.html`, `#contact`.  
- **Mitigation:** One import move per PR; screenshot or checklist per template.

---

### Phase 3 — Product list / detail consistency
**Objective:** One visual system for grids, rows, cards, and PDP chrome; **preserve** `?sku=` / `?cat=` and `WK_getProductCardImage`, etc.

| Priority | Work |
|----------|------|
| P0 | Single source for **card** border/shadow/radius (`tokens-base.css` + `product-cards.css`); avoid duplicating in modals for `.ap-card` unless necessary. |
| P1 | `all-products.js` / `products.js` — markup classes only; no SKU or route logic changes. |
| P2 | `product-detail.html` + `styles/modules/product-detail.css` — align spacing/typography with listing tokens. |
| P3 | Legacy `product.html` / RFQ modals — align button/card classes with Phase 2 tokens. |

**Recommended files (order)**  
1. `styles/modules/tokens-base.css`  
2. `styles/modules/product-cards.css`  
3. `styles/modules/product-detail.css`  
4. `scripts/all-products.js` (template strings only, if needed)  
5. `scripts/products.js` (list/row HTML only)  
6. `product-detail.html` / `scripts/product-detail.js` (presentation only)

**Risk notes**  
- **Medium:** PDP JSON-LD and `seo.js` — **do not** rename query params or change canonical logic in this phase without a dedicated SEO sub-task.  
- **Mitigation:** Visual + click test: grid → PDP → back via `sessionStorage` listing hint.

---

### Phase 4 — Contact / inquiry refinement
**Objective:** Conversion-focused `#contact` without breaking `getQuoteForm`, honeypot, or `WK_INQUIRY_SUBMIT`.

| Priority | Work |
|----------|------|
| P0 | Form field sizing / spacing / mobile stacking — `contact-page.css` only. |
| P1 | Reduce competing blocks (trust vs SEO vs form) — `index.html` structure + scoped classes. |
| P2 | Button hierarchy: prefer **scoped** `.contact-form .btn-*` over new globals. |

**Recommended files (order)**  
1. `styles/modules/contact-page.css`  
2. `index.html` (`#contact` section only)  
3. `scripts/contact.js` — only if validation/messages need adjustment (avoid endpoint changes).  
4. `scripts/inquiry-hook.js` — **no change** unless backend contract changes (separate release).

**Risk notes**  
- **Low** for CSS-only.  
- **Medium** if moving form markup — retest `form.elements` names: `name`, `email`, `product`, `quantity`, `target_market`, `message`, honeypot `website`.

---

## 3. Cross-cutting rules (all phases)

1. **One phase theme per PR** where possible.  
2. **Grep** for selectors before renaming: `wk-card`, `btn-secondary`, `product-row`, `ap-card`.  
3. **Multilingual:** Prefer existing keys; new keys → `scripts/multilang.js` (en + zh at minimum).  
4. **SEO:** Changes to `product-detail.html` head or `scripts/seo.js` → separate checklist (canonical, `og:url`, GSC).  
5. **Rollback:** Keep `main.css.monolithic.backup` philosophy — don’t delete backups; tag releases before large CSS moves.

---

## 4. Suggested execution timeline (lightweight)

| Week | Focus |
|------|--------|
| 1 | Phase 1 — mobile nav + hero smoke tests |
| 2 | Phase 2 — document cascade + one extracted CSS file |
| 3 | Phase 3 — product cards + PDP spacing pass |
| 4 | Phase 4 — contact section polish + regression test |

Adjust for release cadence; phases can overlap **only** if files don’t conflict (e.g. Phase 4 CSS while Phase 2 docs).

---

## 5. Out of scope for this roadmap (separate initiatives)

- Server-side redirects (www, legacy paths) — ops / hosting.  
- Replacing `EmailJS`/Apps Script — product decision.  
- Full design system in Figma — optional upstream of Phase 2.

---

*This roadmap is descriptive, not prescriptive of past commits; update as the codebase evolves.*
