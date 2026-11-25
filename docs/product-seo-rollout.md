# WaiKwan SEO 恢复与 B2B 询盘实施计划

## 已知基线

比较 2026-09-28 至 10-25 与 2026-10-26 至 11-22 的 Web 搜索数据。全站点击 32 → 28，展现 3,721 → 3,667。英文帐篷制造商页点击 11 → 6、展现 1,495 → 839、CTR 约 0.74% → 0.72%。SEG 灯箱页点击 3 → 2、展现 190 → 289。两页的 URL Inspection 截图均显示已收录，Google 所选 canonical 是页面本身。

16x16 查询两期展现 686 → 24，点击均为零。三个月查询导出为 6,067 展现，主帐篷页页面维度为 6,003。扣除该查询后的全站展现估算为 3,035 → 3,643，仍包含其他零点击查询。US 点击 4 → 6，中国 9 → 4。采购词样本小，使用具体词与 URL 的交叉数据判断。待发布的本地更改包括首页定位、多语言 SKU canonical、询价路由和验证器；开始实施时核对当前远端、线上版本和工作区差异。

## P0 · 建立可复查的证据

1. 保留已收到的三个 GSC 原始报表。补一份英文帐篷主页面的 28 天对比，在页面精确筛选下导出 Queries；对印刷 OEM 页、SEG 页做相同检查。必要时按美国及设备分层。可通过授权的 Search Analytics API 拉取 page × query 数据；Google 省略部分匿名查询，导出行与全站总量分开解释。
2. 将词按工厂/OEM、尺寸/规格、印刷、品类、品牌和偏离业务的意图标记。16x16 和 TikTok backdrop 单独记录，保留原始总量。重点复核 custom tent manufacturer、canopy tent factory、custom tent manufacturer china 对应的实际 URL 和点击变化。
3. 在 GSC Sitemaps 记录主 sitemap 的 Status 与 Last read。若持续失败，核对线上响应体、状态码、Cloudflare 和 Google 抓取记录。核对 Pages、Crawl Stats、Manual Actions 及实际部署时间。公开 sitemap 返回 200 与 GSC 有处理记录分别验证。
4. 产出页面/查询优先级表。每项记录 URL、时间段、指标差值、证据、待验证假设和预期改动。涉及页面合并、语言下架或阻止参数抓取的决策，要先查该 URL 的历史点击、索引及发现路径。

[Google 流量下降排查](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops) · [Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) · [Sitemaps 报告](https://support.google.com/webmasters/answer/7451001)

## P0 · 全站抓取与可发布的技术修复

- 以线上 sitemap 为第一份 URL 列表，限速抓取全部条目，保存状态码、重定向链、响应耗时、robots/noindex、canonical、hreflang、标题、H1 和内部链接。随后从首页和分类入口做同域内链发现，单独标记孤立页、重定向内链、断链和目录筛选参数；限制无限参数组合。记录失败及重试结果。
- 用线上静态 HTML、浏览器渲染与 GSC 索引结果交叉验证。对 11 种语言各测代表 SKU，并覆盖真实静态产品、无效 SKU、历史路由和带筛选参数的目录。对有效产品核对产品名、规格、canonical、各语言对应、结构化数据 URL 和 CTA；无效路由核对网站既定预期。
- 从产品分类建立可抓取的型号链接，优先修复有 GSC 展现却只能通过脚本交互发现的产品。区分有独立采购意义的 SKU、无独立用途的筛选页、应合并的旧路由。筛选调整先做样本验证，避免误伤产品发现。
- 优先复用现有 validate-seo.py、validate-architecture.mjs 和浏览器脚本。使用 Advertools 的已知 URL / 内链发现方法作为抓取参考，Playwright 负责渲染与询盘验证。公开抓取结果用于确认站点实际响应，Google 选定 canonical 由 URL Inspection 核实。
- 结构化数据与页面可见事实对齐。检查 SKU、图片，以及适用的 Product 或 ProductGroup；商家资格按实际销售方式和所需字段逐项确认。询价商品只使用可证实的资料。

[Advertools](https://github.com/eliasdabbas/advertools) · [Playwright](https://github.com/microsoft/playwright) · [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) · [筛选导航抓取](https://developers.google.com/crawling/docs/faceted-navigation) · [Product 结构化数据](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)

## P1 · 先做帐篷，再做 SEG

| 现有页面 | 要承接的意图 | 实施内容 |
| --- | --- | --- |
| 帐篷制造商页 | OEM、工厂、经销商采购 | 对照页面级查询。用现有资料整理框架系列比较、样品与批量询价所需信息、工厂实拍和装箱实例；把型号、数量、目的地接入主要询价入口。 |
| 10×10 页面 | 10×10 ft / 3×3 m 规格与选型 | 核实框架、净重、外箱和顶布信息；按适用架型展示对比和对应型号。420D/400D 差异先由工厂确认。 |
| 印刷 OEM 页面 | 印刷工艺、稿件和定制流程 | 按实际能力解释印刷部位、稿件提交与打样，展示真案例并连到相应型号和报价；按查询数据再决定与其他印刷页的分工。 |
| SEG 灯箱页 | 批量采购、型号与配置 | 对照实际型号提供框深、单/双面、画面更换、供电要求、包装与报价字段，连接 WK-IS004 等有资料支撑的型号。 |

同行研究用同一张表抽查 5 至 8 个直接制造商页面，记录规格是否可找到、是否有样品/包装说明、如何从选型进入报价。DTENT 的帐篷页可作为研究起点，WaiKwan 优先展示自己有证据的工厂实拍、规格和包装资料。为每页同步检查标题、H1、开头段落及内链锚文本；优先选高相关、已有展现的查询做标题和摘要实验。新页在已有页面无法满足明确意图、且有独立资料时再考虑。

建立 92 个目录产品 × 现有 11 种语言的覆盖清单，覆盖实际存在的静态或动态路由。逐项注明规格库和图片来源、可正常到达的语言版本、型号预填及资料缺口。先完成帐篷和 SEG 试点，后续扩展旗帜、展架、活动产品、家具与配件。统一技术来源，语言内容按市场用词调整。

[DTENT 产品观察](https://www.displaytent.net/custom-pop-up-canopy/) · [Google 标题链接指南](https://developers.google.com/search/docs/appearance/title-link) · [可抓取链接](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

## P1 · 移动端、信任和获客

- 测首页、两类试点页、一个动态详情和询价页。用 Lighthouse 做可重复的移动端实验室基线，能取得数据时看 CrUX/GSC 的真实用户 LCP、INP、CLS。优先修有测量证据的首图过重、规格表溢出、脚本拖延或移动端 CTA 问题。固定测试条件，用多次测试的中位数对比；有稳定基线后再考虑 Lighthouse CI。
- 核对表单失败提示、成功只记一次、来源页和 SKU 可追溯。分别跟踪开始询价、表单成功、WhatsApp 点击和销售确认的有效询盘；需要时安排标记清楚的生产测试，核对实际收件。按自然搜索落地页与语言复盘。
- 复用公司现有工厂、展会和项目资料。优先核对主办方名录、已有行业伙伴或经销商可公开的出处，以及可用的案例授权，选择能让采购商核实经营与制造能力的页面。所有合作方联系在获得发送授权后执行。

[GoogleChrome Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) · [Chrome Web Vitals](https://web.dev/articles/vitals)

## 分批发布与量化验收

1. 第一批单独验收已存在的技术修复。第二批上帐篷采购与选型内容，第三批上 SEG 并扩到其他产品与语言。每批记录变更 URL、版本、发布时间、负责人、测试结果和可回退版本。
2. 发布前全站校验通过，重点 URL 直接可达，11 种语言无错误 canonical/跳转，样例 SKU 和表单端到端可用。发布后 24–48 小时重测线上版本、关键路由和正式询盘；遇到系统性错误 canonical、关键页不可访问或表单失效，修复或回退该批。
3. 发布后 1–2 周看重点页是否重新被抓取与正确收录。首个完整 28 天窗口重算目标采购词点击、自然搜索落地页询价和销售确认的有效询盘；同时列出原始计数、对照页面与季节或其他发布。32 与 28 的样本量较小，有必要时累积第二个窗口后再判定改善。
4. 交付四份记录：抓取与索引差异、页面与查询优先级、92 产品及语言覆盖、分批发布和指标复盘。没有 GSC 权限时使用用户提供的导出；没有生产收件记录时明确标记等待验证。

## 2026-11-25 本轮实施记录

- 线上发布前基线：全量抓取 1,049 个 sitemap URL，公开 HTML 的状态、最终目标、canonical 与 hreflang 检查通过；另抽查 120 个 sitemap 外链接，重试后均返回 200。爬虫结果表示公开访问；Google 索引状态沿用已收到的截图，仍待扩展。
- 本地：保留已核实的动态 SKU 多语言 canonical 修复，修正目录跳静态产品时的语言路径。帐篷和 SEG 的采购入口已在 11 种语言就地补上；印刷 OEM 询价按钮传递产品类别与来源页。92 个目录产品的 1,012 个语言路由目标已检查存在。
- 最新价格目录：49 份顶层 Excel 已建清单，本轮新增 8 组共 44 条配置，分发到 11 种语言规格库。直接映射或同型号规格分组覆盖 64 个目录产品；其他产品可能使用独立详情资料或缺少可直接挂接的同型号源。客户报价子目录、成本、价格与联系方式未导入网站。旧资料中的 420D/400D 不一致仍待工厂确认；新表 WK-T40-P3*4.5 的型号与尺寸栏不一致，细杆半圆门低款的高度也与既有资料有差异，两者暂未替换。
- 验证：11 语言浏览器覆盖了规格入口、SKU 同语种跳转和表单预填。11 语言的拒绝、重试、成功单事件已通过模拟收件测试。移动 Lighthouse 建立本地基线；一次降低布局偏移但拖慢首屏的试验已撤回。
- 发布后验收依赖生产版本、页面级 GSC 导出或账户权限、正式收件和 GA4 数据。计划中涉及第三方联系的部分已有仓库草稿；此次未发送。
