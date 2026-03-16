# Cursor AI SEO 指令 — waikwantent.com

复制以下 Prompt 到 Cursor Chat 使用。可配合 `@repo` 引用整个仓库。

**Base URL:** `https://waikwantent.com`（无 www）

---

## 零、一次执行版（3 个核心页面）

**最小、最稳、最容易见效。** 先跑这个，再考虑全站。

```
@repo

You are editing the waikwantent.com repository.

Task: SEO 补全 index.html、product-detail.html、faq.html 三个页面。

Base URL: https://waikwantent.com

---

1. index.html
- 确认已有：unique title, meta description, canonical, og:url, og:image
- 确认已有：Organization JSON-LD（seo.js 已注入则跳过）
- 确认已有：Explore Products 内部链接区块
- 如有缺失则补全

2. product-detail.html
- 确认 product-detail.js 已注入 Product JSON-LD（动态，按 SKU）
- 确认 meta description 由 JS 动态填充
- 确认 Related Products 区块已渲染（同分类 4 个）
- og:url 需包含 ?sku=XXX，由 seo.js 或 JS 处理

3. faq.html
- 确认已有：unique title, meta description, canonical, og:url, og:image
- 确认已有：FAQPage JSON-LD（mainEntity 与页面真实 FAQ 一致）
- 如有缺失或 placeholder 则用真实 FAQ 内容补全

4. 规则
- 使用绝对 URL
- 不编造内容，只用页面或数据中已有的
- 保持现有设计结构

Output: 列出修改的文件和具体改动。
```

---

## 一、分步执行（推荐顺序）

### Step 1：修 meta 标签

```
@repo

Fix og:url, og:image, meta description and canonical tags for all important HTML pages in this repository.

Base URL: https://waikwantent.com

Pages: index.html, custom-canopy-tent-manufacturer.html, beach-flag-supplier.html, portable-display-systems.html, faq.html, faq-moq.html, faq-lead-time.html, faq-artwork-files.html, faq-color-matching.html, faq-shipping.html, faq-samples.html, product-detail.html, product-center.html, all-products.html, tent-type.html, flag-type.html, dome-type.html, furniture-type.html, racegate-type.html, six-sided-booth.html.

Requirements:
- Each page: unique title, meta description, canonical, og:title, og:description, og:url, og:image
- Use absolute URLs
- og:image: use most relevant existing image in repo
- Output: list of pages fixed, patch changes
```

### Step 2：加结构化数据

```
@repo

Add structured data (JSON-LD) for SEO.

Base URL: https://waikwantent.com

A. Homepage: Organization schema (name, url, logo, description, contactPoint, address)
B. Product pages: Product schema (name, image, description, brand, sku, url) — inject via JS if dynamic
C. FAQ pages: FAQPage schema — mainEntity must match real FAQ content on page
D. Rules: only real content, absolute URLs, no fake reviews/prices

Output: pages updated, schema types added, patch changes
```

### Step 3：加内部链接

```
@repo

Improve internal linking:

1. Homepage: add/confirm "Explore Products" section with links to product-center.html?cat=tents, ?cat=flags, ?cat=displays, ?cat=accessories, all-products.html
2. Product-detail: Related Products section — same category, exclude current SKU, max 4–6 items (already in product-detail.js)
3. Category pages: add links to 4–6 product detail pages and related categories
4. Use existing product data; keep category relevance high

Output: files edited, patch changes
```

---

## 二、完整 SEO 审计与修复

```
You are a senior SEO engineer and front-end developer.

You are responsible for fully optimizing the website inside this repository for Google search visibility and B2B lead generation.

Repository: wkan-website-real
Website: https://waikwantent.com/
Industry: B2B manufacturer of canopy tents, beach flags, and display systems.

Your responsibilities:

1. Scan the entire repository and list all HTML files.

2. Ensure each HTML page contains:
- optimized <title>
- optimized <meta description>
- canonical tag
- H1 heading
- internal links

3. Add structured data (JSON-LD schema) to relevant pages:
- Organization schema on homepage
- Product schema on product pages
- FAQ schema on FAQ pages
- Breadcrumb schema on category pages

4. Improve internal linking:
- homepage → category pages
- category pages → product pages
- product pages → related products

5. Create SEO category pages if missing:
- canopy-tents.html
- beach-flags.html
- display-systems.html
- tent-accessories.html

6. Ensure the website includes:
- robots.txt
- sitemap.xml
- sitemap updated with all pages

7. Improve page performance:
- compress images
- ensure alt text on all images
- lazy loading

8. Prepare the website for international B2B SEO.

Output:
- list of problems found
- list of fixes
- patch changes to files
```

---

## 三、自动生成 SEO 落地页

```
Create SEO landing pages for this B2B manufacturer website.

Target keywords:

custom canopy tent manufacturer
beach flag manufacturer
feather flag supplier
teardrop flag pole manufacturer
portable display systems manufacturer
trade show display supplier
advertising tent supplier

For each page:

Create:

- SEO title
- meta description
- H1
- 800-1200 words of content
- internal links
- call to action

Pages should be HTML files matching the existing design structure (index.html, footer, navbar).

Output files ready to commit.
```

---

## 四、快速 SEO 审计

```
Perform a full SEO audit of this repository.

Check:

- duplicate titles
- missing meta descriptions
- missing H1 tags
- missing alt text
- missing schema
- broken links
- canonical issues

Then automatically generate fixes and patches.

Ensure the site is optimized for Google indexing.
```

---

## 五、单页 SEO 优化

```
Optimize [PAGE_NAME] for SEO:

1. Title: keyword-rich, 50-60 chars
2. Meta description: 150-160 chars
3. H1: exactly one, matches keyword intent
4. Internal links: add 2-3 relevant links
5. Schema: add if applicable (Product, FAQ, Breadcrumb)
6. og:url, og:image: absolute URLs

Match the existing site structure and style.
```

---

## 六、内部链接优化

```
Improve internal linking across this site:

1. List all HTML pages.
2. For each page, suggest 3-5 internal links to add.
3. Ensure homepage links to category pages.
4. Ensure category pages link to product pages.
5. Ensure product pages link to related products and categories.
6. Apply the changes.
```

---

## 七、详细版 Prompt（可替代 Step 1–3）

需要更细控制时，可用下面三个完整 Prompt 替代分步版。

### 7.1 元标签修复（详细）

```
@repo

You are editing the waikwantent.com repository.

Task: fix SEO meta tags across all important HTML pages.

Pages to prioritize:
index.html, custom-canopy-tent-manufacturer.html, beach-flag-supplier.html, portable-display-systems.html, faq.html, faq-moq.html, faq-lead-time.html, faq-artwork-files.html, faq-color-matching.html, faq-shipping.html, faq-samples.html, product-detail.html, product-center.html, all-products.html, tent-type.html, flag-type.html, dome-type.html, furniture-type.html, racegate-type.html, six-sided-booth.html.

Requirements:
1. Every page: unique title, meta description, canonical, og:title, og:description, og:url, og:image
2. Base URL: https://waikwantent.com
3. og:url = real public URL for that page
4. og:image = most relevant existing image, absolute URL
5. Important pages = tailored meta description, not reused

Output: list of pages fixed, patch changes
```

### 7.2 结构化数据（详细）

```
@repo

Add structured data (JSON-LD) for SEO.

A. Homepage: Organization schema (name, url, logo, description, contactPoint, address)
B. Product pages: Product schema — inject via JS if dynamic; include name, image, description, brand, sku, url
C. FAQ pages: FAQPage schema — mainEntity must match real FAQ content
D. Rules: only real content, absolute URLs, no fake data

Output: pages updated, schema types, patch changes
```

### 7.3 内部链接（详细）

```
@repo

Improve internal linking:

1. Homepage: "Explore Products" section → product-center?cat=tents, ?cat=flags, ?cat=displays, ?cat=accessories, all-products.html
2. Product-detail: Related Products — same category, exclude current SKU, 4–6 items (implement in product-detail.js if data-driven)
3. Category pages: links to 4–6 product detail pages + related categories
4. Use existing product data; keep relevance high

Output: files edited, patch changes
```

---

## 使用方式

1. 在 Cursor 中打开 `wkan-website-real` 仓库
2. 打开 Cursor Chat，输入 `@repo`
3. 复制粘贴上述任一 Prompt
4. 按需执行

---

## 推荐执行顺序

| 顺序 | 任务 | Prompt |
|------|------|--------|
| 1 | 3 页一次补全 | **零、一次执行版** |
| 2 | 全站 meta 修复 | Step 1 |
| 3 | 全站 schema | Step 2 |
| 4 | 全站内部链接 | Step 3 |
| 5 | 更新 sitemap | 手动或单独 Prompt |

**最小可行：** 先跑「零、一次执行版」，确认 index / product-detail / faq 无误后，再跑 Step 1–3。

---

## 已配置规则

- `.cursor/rules/seo-engineer.mdc` — 编辑 HTML 或 SEO 相关文件时自动生效

---

## 站点结构参考

- 首页：`index.html`
- 落地页：`custom-canopy-tent-manufacturer.html`, `beach-flag-supplier.html`, `portable-display-systems.html`
- 产品中心：`product-center.html`（`?cat=tents|flags|displays|accessories`）
- 全部产品：`all-products.html`
- 分类页：`products-tents.html`, `products-flags.html`, `products-displays.html`, `products-accessories.html`
- 产品详情：`product-detail.html?sku=XXX`
- FAQ：`faq.html`, `faq-moq.html`, `faq-lead-time.html`, `faq-artwork-files.html`, `faq-color-matching.html`, `faq-shipping.html`, `faq-samples.html`
