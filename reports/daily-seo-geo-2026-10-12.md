# 网站检查简报 — 2026-10-12

对象：https://www.waikwantent.com/；本地项目 D:\wkan-website-real。

## 本次验证

- 运行 scripts/validate-seo.py 成功：146 个可索引 HTML 页面及 sitemap 覆盖校验通过。这不是搜索引擎收录或排名证明。
- robots.txt 允许常规抓取，声明主 sitemap；llms.txt 已提供产品、FAQ、制造能力与引用入口。
- 本地 products 目录有 5 个静态英文详情页；这不代表网站只有 5 个产品。
- 线上首页读取成功，有产品分类、采购问答及询价入口。制造能力页和 MOQ 页读取结果分别标记两周前和上月抓取，不作为实时部署证明。

## 今天优先处理的 3 项

1. 更新过期首页轮播。本地 scripts/main.js 首张仍为 2026 年 9 月 15–17 日上海展邀请，scripts/multilang.js 仍写“9月15–17日，上海见”。改为常青产品/工厂首屏，将邀请改为展会回顾；同步两种语言、图片及链接。当前未完成浏览器渲染确认，不能断言线上首屏展示相同。
2. 优化首页轮播图片。本地被引用的上海 WebP 为 1,602,283 字节、广交会 PNG 为 2,512,940 字节、旗帜 PNG 为 2,660,701 字节。生成合适展示尺寸及移动端图片，补响应式加载并对非首屏图按需加载。尚未测得 LCP、CLS 或移动端性能分数。
3. 区分联系点击和成功询价。本地 scripts/analytics.js 将 WhatsApp、邮件、电话点击和表单成功均记为 generate_lead。联系点击另设事件，成功回执保留询价事件，并同步核对 GTM/GA4 配置，避免将点击数量视作实际询盘。

## 结构与 GEO 后续方向

- 按“产品分类 → 型号详情 → 采购比较/FAQ → 询价”梳理入口；线上首页存在多个相似产品与资源区，可合并重复入口。
- 逐批扩展有真实型号、规格、材料、包装资料的静态详情页，同步内链、canonical、语言对应与 sitemap。
- 工厂能力和 MOQ 内容补充经公司核实的工序图片、检测依据及采购条件，避免编造认证、产能、交期和价格。
- llms.txt 的存在不证明 AI 引用增长；实际 GEO 表现需另外取得引用记录或相关平台数据。

## 与上次审查的关系和限制

对照 reports/seo-geo-website-review-2026-10-03.md，过期邀请、轮播大图、转化事件混用仍能在本地复现。本次未取得 GSC、GA4、真实询盘或 AI 引用数据，不能报告流量、排名、收录和询盘的变化。未修改网站或部署。

线上抽查：https://www.waikwantent.com/ 、https://www.waikwantent.com/manufacturing-capabilities.html 、https://www.waikwantent.com/faq-moq.html 。
