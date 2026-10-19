# SEO / GEO 全面检查与改进建议 — 2026-10-19

## 结论和范围
已检查 sitemap 中 150 个规范页面、静态 HTML 链接图、标题/描述/H1、产品结构化数据、关键脚本与图片、企业和采购内容，并抽查线上 HTTP 与本地手机端浏览器。当前优先事项是清理 sitemap 的无 SKU 详情入口、补产品静态内链、增加可验证的产品/工厂信息和优化首屏资源。没有修改生产源码或部署。

本次未登录 GSC、Bing、GA4、Cloudflare；未读取实际查询、点击、收录 URL 清单、服务器爬虫日志、外链或真实用户性能。因此不保证排名、AI 引用或收录数量提升，也未断定 GSC 中 83 个规范网址问题的根因。

## 已确认基础正常
- 本地 150 页标题和 meta description 无完全重复；每页有一个静态 H1；静态 img 均含 alt 属性（不代表描述质量全部合格）。
- 架构和 84 个产品、150 页当前 SEO 规则与 sitemap 覆盖、205 个 HTML 中结构化数据的现有校验通过。
- 本地手机尺寸首页、展示集合页无脚本异常或横向溢出。
- 线上 robots.txt 返回 200，未禁止正常内容目录；折叠椅静态页与 MOQ FAQ 返回 200，canonical 正常，启用了 br 压缩。
- 多个线上请求在本检查环境 10 秒超时；不能以此证明服务器宕机或 Googlebot 同样超时。需要服务器日志与 GSC Crawl stats 进一步确认。

## 按优先级安排的改进

### 1. 高：无 SKU 详情页错误地作为 sitemap 目标
证据：sitemap.xml:326 和 :884 收录 product-detail.html 与 zh/product-detail.html；两个 HTML 静态 robots 为 index,follow，canonical 指向自身。本地浏览器却分别跳到 all-products.html 和 zh/all-products.html，最终 canonical 也变为目录页。见 seo-geo-browser-2026-10-19.json。

这会向爬虫提供“提交收录该页面”与“访问后迁移至另一页”的混合信号。此前 SEO 校验只是比较静态 HTML 和 sitemap，未核验浏览器最终地址；因此通过不代表这里没有问题。

改法：让 build-page-sitemap.py 在生成阶段明确排除两个无 SKU 入口，再生成 sitemap.xml/page-sitemap.xml；增强校验，禁止裸详情入口重新加入。不要给共享 product-detail.html 模板直接加全局 noindex，以免同时影响仍使用 ?sku= 的有效产品。对于仍保留的参数详情 URL，需按真实 SKU 分流或在具备条件后迁移至静态产品页。

验收：两个 sitemap 均不包含裸详情入口，有效 SKU 仍可访问和索引；静态产品页不受影响。线上 sitemap 本轮未成功获取，此结论已在本地当前代码确认。

### 2. 高：10 个静态产品页缺少从首页可达的纯 HTML 路径
英文页面为 products/floor-standing-seg-light-box-wk-is004.html、folding-chair-31007.html、half-wall-blade-flag-connector-9014.html、round-water-weight-bucket-9004.html、semi-circle-race-gate-9403.html，另有对应 5 个中文页面。

它们并非完全无人链接：HTML 中已有来自另一语言产品页的链接；但沿首页开始、只遍历 sitemap 页面的 HTML a[href] 无法到达这组页面。动态目录与 XML sitemap 仍可发现它们，所以不能称为绝对孤立页或断定 Google 无法抓取。

改法：在对应 collections 分类页、HTML site-map 和相关采购指南添加准确型号的静态产品卡片；关键分类首屏输出产品 a[href]，运行时筛选只增强体验。优先补这 5 类现有页面，而不是立即生成全部 84 个产品的薄内容静态页。

验收：每个重点产品至少有一个相关分类页面的静态正文入链，从首页 2–3 次导航可达；中英同步。

### 3. 高：产品事实与工厂证据不足，限制买家决策和可靠引用
抽查 folding-chair-31007.html 目前只确认 WK-Y45 型号、折叠存储和应用；图片标明为家具系列参考图，并要求询价获取该型号实图。其余若干试点静态产品页也以“参数待确认”为主。制造能力页、公司简介页静态 img 只有 logo，工序介绍缺少对应现场照片。少量文字本身不是错误，关键是买家需要的资料仍缺失。

改法：先挑帐篷主力系列、沙滩旗系统、展示架各一个，整理已确认的尺寸、材料、管径/壁厚、面料、印刷方式、包装件数、纸箱尺寸、净重/毛重、配件兼容与限制；发布型号实图、结构细节、画面模板和带版本日期的规格文件。制造能力页按裁切/缝制/印刷/组装/质检/包装展示真实现场、说明哪些环节自有及哪些合作完成。

现有 faq-lead-time.html 写典型生产 7–15 天，但需增加适用订单范围、起算条件和确认日期；faq-moq.html 没有型号级数量，应有真实依据才补数字。不能编造承重、风级、认证、MOQ、产能、评价或交期承诺。

验收：至少 3 个主力产品有完整规格、专属图片和可下载资料；企业事实、采购 FAQ、产品页描述一致。需要企业真实资料支持。

### 4. 中高：30 个英文 SEO 指南的主题区分和事实密度可提升
标题/描述虽无完全重复，但正文存在共用 Why choose us、Applications、FAQ 和 CTA 段落。五词片段 Jaccard 相似度最高约 0.44，例如 fabric-tension-backwall-supplier-bulk-for-rental-companies.html 与 pop-up-display-stand-wholesale-supplier-for-events.html。该数值只是人工复核线索，不是 Google 重复判定阈值。

部分问句为完整关键词拼接，阅读不自然。较短的 news/trade-show-display-system-checklist.html 主要为通用清单；pop-up-canopy-tent-manufacturer.html 与更完整的帐篷主页面覆盖相近需求。

改法：先按 GSC 查询、点击和收录情况给每组关键词指定主落地页。将“租赁用背景墙”写成接头维护、备件、收纳运输和画面更换的真实操作内容；将“渠道采购”页聚焦包装/补单/版本管理。数据证明意图重合后再做合并和重定向，不能只凭字数或相似度批量删除。

### 5. 中：首屏大图和通用脚本有性能优化空间
index.html:53 以高优先级预加载 canton-fair-140-phase-3-2026-waikwan.png，文件 2,206,419 字节。main.js:399 使用同一素材。首页本地浏览器抽查已解码资源合计约 3.41 MB；此数值不是线上压缩传输量或 Lighthouse 分数。

目录页静态引用 JS 源文件合计约 0.97 MB（未压缩，按存在的本地路径统计）；products.js 298,366 字节，multilang.js 313,865 字节，main.js 120,664 字节。存在 129 个缺少 width/height 的静态 img，多为每页复用 logo；CSS 可能已预留尺寸，不等于已发生 CLS。

改法：将首屏图转 WebP/AVIF，按手机/桌面提供尺寸并同步 preload 与实际背景；保留图中文字清晰度。目录数据、翻译和通用脚本按页面用途拆分；给缺尺寸图片补真实比例或明确 aspect-ratio。上线前后用相同条件的移动端 PageSpeed 和 GSC Core Web Vitals 对比。不要把本次本地资源数值当作真实用户 LCP/INP/CLS。

### 6. 中：结构化数据校验通过不代表富结果资格合格
静态规范页统计发现 44 个 Product 节点同时缺少 offers/review/aggregateRating。Google 产品摘要要求至少一个此类属性；B2B 无公开价格或真实评价时，保留准确的 Product 描述可以，但不能承诺价格/评分富结果，也不应填 0 元或造评价补齐。

另有 SEO 指南的 Product schema 与主内容定位不完全匹配。例如 fabric-tension-backwall-supplier-bulk-for-rental-companies.html 的 Product 名称为整句采购关键词，image 为帐篷主图，sku 为 WK-HZ-STRAIGHT。这值得核对：如果页面主要是采购指南，应以 WebPage/Article 等合适类型描述；如果是特定产品，就用对应型号、真实产品图片并让可见正文支持这些属性。

验收：抽查主力页 Rich Results Test，并分别记录 JSON 语法、实体准确性和富结果资格。不要为询价型 B2B 页面强加不真实的 Offer。

### 7. 中：GEO 优先改进真实内容与可见性控制
Google 2026 官方指南说明其 Search 不使用 llms.txt 提升可见性/排名；已有文件可以保留为其他系统的导航，但无需继续扩写来追求排名。当前 llms.txt 的静态产品参考遗漏已有 curved-fabric-banner-stand.html，可在真实产品内容更新时顺便同步。

GSC 已有 Generative AI 菜单，需确认 Search generative AI control 未被设置排除；默认允许或继承父属性，不代表本网站已被关闭。本轮未读取该账号设置。其他 AI 搜索服务的引用和访问仍需分别验证，不把 Google 的规则推及所有系统。

对买家最有价值的 GEO 内容候选：30/40/50 系列如何按材质与用途选择、单面/双面旗的结构及重量区别、底座兼容表、SEG 画面模板、真实包装与运输示例。优先让问题有完整且可验证的答案，不必为了所谓 AI 格式生硬重复长关键词。

### 8. 中：衡量有效询价，区分联系点击与提交成功
analytics.js 将 WhatsApp/邮箱/电话点击及表单明确成功都记为 generate_lead，并用 contact_method 区分。此实现并非错误，但 GA4/GTM 报表必须按 contact_method 分组，否则点击联系方式会被误当作已收到询价。保留当前 consent gating；是否实际触发 GA4 标签本轮未进入 GTM 验证。

建议对 GSC 的原始/净化查询、重点页面收录与有效询价分别建立基线。使用现有 monitoring-playbook.md 中对异常 16x16 inch 查询的排除规则；不要为无关尺寸词增加页面。

## 最新规则核验
- Google AI 搜索指南：https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Search generative AI control：https://support.google.com/webmasters/answer/16908024
- Product snippet 必需属性：https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Google 更新记录：https://developers.google.com/search/updates
截至本轮核验，FAQ 富结果自 2026-05-07 起不再显示。FAQ 正文仍可保留帮助客户；无需为追求 FAQ 展开样式继续堆 FAQPage。

## 建议执行顺序
1. 先修裸详情 sitemap 和补 10 页静态入链，并增加可运行的回归约束。
2. 优化首屏大图；核对指南 schema 的图片、SKU 和页面类型。
3. 收集真实资料，完善 3 个主力产品与制造能力证明，补实用比较表和规格下载。
4. 获取 GSC 28 天查询/页面数据及 83 个规范网址明细，确认需要合并的页面；上线后按 2–4 周窗口观察，不承诺固定收录时间。

## 证据文件
- seo-geo-comprehensive-2026-10-19.json：全量 150 页静态指标与链接图、相似度候选。
- seo-geo-browser-2026-10-19.json：裸详情页跳转和手机端抽查。
- seo-geo-live-2026-10-19.json：线上 HTTP 抽查、响应头及超时记录。
