# Google Search Console — action checklist (WaiKwan / waikwantent.com)

**Property:** Use the **`https://www.waikwantent.com`** URL-prefix or domain property that matches live canonicals.  
**Sitemap:** `https://www.waikwantent.com/sitemap.xml` (declared in `robots.txt`).  
This list reflects **repo audits/fixes** (canonical/sitemap alignment, PDP SEO, crawl-risk copy, product hub stubs removed from sitemap).

---

## 1. URL Inspection — test these first

Run **URL Inspection** on a small set that covers each template + risk area:

| Priority | URL | Why |
|----------|-----|-----|
| P1 | `https://www.waikwantent.com/` | Home; Organization/WebSite JSON-LD (`seo.js`); canonical `/` |
| P1 | `https://www.waikwantent.com/product-detail.html?sku=2001` | PDP: canonical, `og:url`, JSON-LD, title/meta/H1 (early + JS fixes) |
| P1 | `https://www.waikwantent.com/product-detail.html?sku=42001` | Second PDP category (e.g. flags/displays path in data) |
| P1 | `https://www.waikwantent.com/all-products.html` | Catalog; canonical without params; category SEO from JS |
| P1 | `https://www.waikwantent.com/all-products.html?cat=tents` | Filtered view; should report user canonical → `all-products.html` |
| P2 | `https://www.waikwantent.com/product-center.html` | Main hub |
| P2 | `https://www.waikwantent.com/tent-type.html?type=` *(use a real `type` from live site)* | JS-heavy hub + static intro (`tent-type.html`) |
| P2 | `https://www.waikwantent.com/flag-type.html?type=` *(real type)* | Same pattern |
| P2 | `https://www.waikwantent.com/seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html` | Sample SEO guide |
| P3 | `https://www.waikwantent.com/products.html` | Legacy redirect → product center (expect redirect) |
| P3 | `https://www.waikwantent.com/products-flags.html` | Stub redirect + `noindex` (expect redirect / excluded) |

**Live checks in the inspection result:** “Google-selected canonical” = your declared canonical; **enhancements** (Product rich results) on PDPs when eligible.

---

## 2. Request indexing — order of requests

Use **Request indexing** sparingly (quotas). After deployment, prioritize:

1. `https://www.waikwantent.com/`
2. `https://www.waikwantent.com/all-products.html`
3. `https://www.waikwantent.com/product-center.html`
4. **2–3 PDPs** with different categories, e.g.  
   `.../product-detail.html?sku=2001`,  
   `.../product-detail.html?sku=42001`,  
   `.../product-detail.html?sku=9001`  
   (adjust SKUs to real products you want visible.)
5. One **tent-type** and one **flag-type** URL with real `?type=` parameters.
6. One **`/seo/`** guide URL you care about for acquisition.

Re-submit **sitemap** once (`Sitemaps` → submit `sitemap.xml`) if you haven’t after the latest release.

---

## 3. Excluded pages that are **acceptable**

| Situation | Example | Notes |
|-----------|---------|--------|
| **Redirect** | `products.html` → `product-center.html` | Intentional; canonical on stub points to target |
| **Redirect** | `products-flags.html` etc. → `product-center.html?cat=...` | **`noindex`** + redirect; **removed from sitemap** in repo — OK if “Excluded” as redirect or crawled not indexed |
| **Blocked by robots** | `/index.original.html`, `/index.wireframe.html`, `/test_logo.html`, `/test_stats.html` | `robots.txt` **Disallow** — do not index |
| **Parameterized catalog** | `all-products.html?cat=flags` | Often **consolidated** to `all-products.html` — acceptable if Google picks bare URL as canonical |
| **Duplicate PDP** | Legacy `?id=` after redirect to `?sku=` | Should settle to single `?sku=` URL |

---

## 4. Excluded pages that are **problems to monitor**

| Pattern | What to check |
|---------|----------------|
| **PDP** `product-detail.html?sku=…` stuck “Crawled – currently not indexed” | Thin/duplicate signals; confirm unique title/description/H1 in rendered HTML; internal links from hub pages |
| **Type hubs** `tent-type.html` / `flag-type.html` | If many URLs excluded, confirm static intro + links present and JS renders |
| **Apex vs www** | URLs on `https://waikwantent.com/...` with wrong canonical — **verify server 301** to `https://www.waikwantent.com/...` |
| **HTTP** | Any `http://` URL indexed — should 301 to HTTPS |
| **Sitemap URLs** returning errors | Validate `sitemap.xml` entries after deploy |

---

## 5. Verification by issue type

### A. “Crawled – currently not indexed”

- Confirm **unique** title, meta description, visible H1, and body copy **after render** (especially PDPs and type hubs).
- Confirm **internal links** from `product-center`, `all-products`, guides — not orphan.
- For **PDPs**, one SKU = one canonical URL; no competing duplicate paths (legacy params should redirect to `?sku=`).

### B. “Duplicate, Google chose a different canonical than user”

- **Home:** User canonical should be `https://www.waikwantent.com/` — if Google picks `index.html`, add more internal links to `/` or enforce redirect at host (optional).
- **Catalog:** User canonical is **`all-products.html`** without query — expected for `?cat=`; monitor that **category** titles/descriptions in Search Console don’t fight each other.
- **PDPs:** User canonical must be **`.../product-detail.html?sku=<SKU>`** — if Google picks another URL, check duplicate content, `?` variants, or non-www host.

### C. “Page with redirect”

- **OK:** `products.html`, stub `products-*.html` hubs, merged-SKU redirects to preferred `?sku=`.
- **Review:** Redirect chains (multiple hops), or redirects from URLs you **want** indexed (should be 200 on the final URL).

---

## 6. Prioritized 7-day recheck plan

| Day | Actions |
|-----|--------|
| **1** | Submit **sitemap**; Request indexing for home + `all-products` + `product-center` + 2 PDPs. |
| **2** | URL Inspection: 3 PDPs + `all-products` + `all-products?cat=tents` — screenshot “canonical” + “indexing allowed”. |
| **3** | **Coverage / Pages**: note counts for “Crawled not indexed” and “Duplicate canonical”; export if available. |
| **4** | URL Inspection: `tent-type` + `flag-type` with real params; one `/seo/` page. |
| **5** | Test **apex** `https://waikwantent.com/` and one inner path — must redirect to `www` with same path. |
| **6** | Spot-check **redirect stubs** (`products-flags.html`): should not be indexed; should redirect. |
| **7** | Re-run URL Inspection on any URL flagged “error” or “warning”; document remaining issues. |

---

## 7. Prioritized 30-day monitoring plan

| Week | Focus |
|------|--------|
| **1** | Indexing of homepage, `all-products`, `product-center`, and 3–5 strategic PDPs. |
| **2** | **Performance** queries: branded + 2–3 money keywords; note impressions/clicks on PDPs and guides. |
| **3** | **Crawled not indexed** trend: if rising, review thin pages and internal linking from `site-map.html` / hubs. |
| **4** | **Duplicate canonical** and **soft 404** reports; confirm only expected parameter consolidation. |

**Monthly:** Re-export **Coverage**, **Enhancements** (Product, breadcrumbs if applicable), and **Sitemap** “success” vs errors. Update internal docs if you add/remove many SKUs from `sitemap.xml`.

---

## Quick reference — repo-aligned settings

- **Preferred host in content:** `https://www.waikwantent.com`
- **PDP canonical:** `https://www.waikwantent.com/product-detail.html?sku=<SKU>`
- **Stub product hubs** (`products-flags.html`, etc.): **not** in sitemap after fix; still redirect + `noindex` on disk
- **Server (outside repo):** Ensure **HTTPS** and **apex → www** 301s; aligns with `seo.js` / `product-detail.js` constants
