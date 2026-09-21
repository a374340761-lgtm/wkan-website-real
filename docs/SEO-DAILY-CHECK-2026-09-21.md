# SEO 日常检查 — 2026-09-21

## 范围与数据

- 检查当前工作区、线上首页抓取结果及 Google Search Central 官方指引。
- 工作区初始无未提交变更。此次修复尚未提交、推送或部署。
- 本次没有取得最新 Search Console / GA4 数据，不能判断今日排名、点击或询盘增减。
- 仓库内最近的 GSC 基线覆盖 2026-04-08 至 2026-07-18：97 次点击、9,173 次展示、约 1.06% CTR。这是历史值，不是今日表现。

## 已修复

1. **首页原始 HTML 内容缺失。** 英文首页填充 157 处、中文首页填充 158 处空的翻译元素，包括导航、标题、分类介绍、正文内链及询价入口。文字复用现有语言字典，保留运行时翻译行为，让初始响应包含可读内容和链接锚文本。
2. **缺少静态内容检查。** 新增 `scripts/build-home-static-content.mjs` 及 CI 检查。生成器只填充空元素，不覆盖人工维护的内容。
3. **站点地图日期过时且生成机制不可靠。** 原生成器使用文件系统修改时间，可能受到检出或复制影响；现改用 Git 内容修改记录，未提交修改使用当日 UTC 日期，无历史依据时省略可选日期。重新生成 136 个规范 URL，保留展会双语页面。
4. **SEO 校验误扫本地产物。** 原校验把 `outputs/` 中的非网站 HTML 当成页面，产生 3 项误报；校验器和站点地图生成器现排除本地产物、依赖及构建目录。这不改变任何线上路径的访问权限。

## 验证

- 静态首页检查：两版首页均无空的翻译元素；重复生成不修改结果。
- SEO 校验：136 个可索引页面，canonical、标题/描述/H1 数量、hreflang、HTML 内链及站点地图覆盖检查通过。
- 结构化数据：Python 与 Node 校验均通过，扫描 191 个 HTML 文件、60 条 Product 数据。
- 架构校验：路由、询价契约、82 个产品校验通过。
- `git diff --check` 通过。
- 这些是源码和结构检查，不代表 Google 已收录，也不是浏览器布局或 Core Web Vitals 测量。

## 上线后的重点

1. 发布这些变更后，检查 `/` 与 `/zh/` 原始响应中的分类标题和内链文字；确认线上 `sitemap.xml` 与本地版本一致。
2. 在 Search Console 检查两版首页的实时 URL、抓取与 Google 选择的 canonical；必要时请求重新编入索引。
3. 导出最新两个完整且等长的 28 天周期，按页面、查询、国家和设备比较点击、展示、CTR、平均排名及有效询盘。
4. 优先复查已有曝光的定制帐篷页、中文定制帐篷页、SEG 灯箱页、产品目录页和帐篷类型页。依据新数据再改标题或内容，避免重复改写已优化文案。
5. 历史报告标记的 `b2b custom canopy manufacturers 16x16 inch specifications` 查询可能存在噪声，应分别查看含/不含该查询的数据，不据此添加无依据的产品规格。

## 官方依据

- [Google：JavaScript SEO 基础](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)：Google 会处理 JavaScript，但抓取与渲染存在差异；可发现链接需要正确的 HTML 链接元素。
- [Google：链接最佳实践](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)：明确的锚文本帮助用户和搜索引擎理解目标页面。
- [Google：站点地图](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)：lastmod 应一致且可核实；它不应仅因生成地图或复制文件而改变。
