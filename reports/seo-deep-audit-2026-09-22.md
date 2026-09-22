# WaiKwan SEO 深度检查与修复 — 2026-09-22

## 结论与证据边界

本次确认的主要问题是静态内容缺失和抓取信号不一致，不是网站整体禁止收录。已经完成代码修复；上线前这些修复不会改变线上表现。不能把修复数量换算成排名或流量提升承诺。

检查范围：GitHub 默认分支 `62176d5`、本地全部 136 个 canonical HTML 页面、191 个 HTML 文件的结构化数据、82 个产品的架构契约、线上 HTTP 抽查和用户提供的 Search Console 截图。

浏览器连接两次失败，未读取 28 天/3 个月数据、索引报告、Google 选择的 canonical、国家/设备分布、Core Web Vitals 或实际询盘归因。以下为确认问题与待验证假设，不把缺失数据写成结论。

## 截图如何解读

- 最近 24 小时：251 次展示、0 次点击、CTR 0%、平均排名 11.9；界面显示最后更新为 8 小时前。这不足以确认长期下降或整站排名落在固定位置。
- `b2b custom canopy manufacturers 16x16 inch specifications` 占 98 次展示，约为总展示的 39%。单位有歧义，不能据此认定存在某种产品需求、机器人流量或攻击。
- `portable trade show display` 有 5 次展示，`folding tent supplier` 有 3 次；侧墙和印刷订购问题有 1 次。可作为补充现有采购指南的线索，但不是经过验证的高流量词。
- 展示不等于访问；应将自然搜索点击、有效询盘和询盘质量一起观察。

## 确认的问题与本次处理

| 优先级 | 证据 | 处理 |
|---|---|---|
| 高 | 105 个 canonical 页面存在 4,857 处空翻译节点；核心帐篷页线上 101 处、展示系统页 40 处 | 使用现有语言字典填充静态 HTML，保留运行时切换；新增全站检查进入 CI |
| 高 | `page-sitemap.xml` 仍有 328 项，主 sitemap 已是 136 项 | 两份 sitemap 统一由同一生成器输出，并校验 URL 集合和重复项；旧 sitemap 是否仍在 GSC 提交待核实 |
| 中 | 六个旧入口有 noindex/跳转但又被 robots 禁止抓取 | 允许爬取这些入口，保留 noindex、跳转和 sitemap 排除，让爬虫有机会读取指令 |
| 中 | 中英文 About 页标题重复，描述均被截断到 `for gl` | 中文标题与描述本地化；英文描述改成完整句子，并同步社交元数据 |
| 中 | 采购查询需要具体决策信息 | 中英文核心帐篷页增加尺寸单位、架型、围布印刷和下单步骤；展示系统页增加背景墙、促销台、灯箱与运输选择指南 |

填充内容来自现有 `scripts/multilang.js`，不是批量生成新营销页面。插入的字典内链转为根路径，中文镜像存在时使用 `/zh/` 路径，避免深层页面相对地址错误。原有非空文案保持原样。

## 线上检查已通过的部分

- HTTP/www 与 HTTPS/apex 请求最终到达 `https://www.waikwantent.com/`，响应 200。本检查没有记录每一跳的状态码。
- 主 robots 与 sitemap 可访问，响应 200。
- 核心帐篷页与展示系统页响应 200，并带有预期 canonical。
- 随机不存在的页面返回真实 404，并展示 404 页面。
- 原始响应与本地修复前一致：核心落地页仍有空翻译节点。

完整响应摘要见 `live-seo-audit-2026-09-22.json`；静态逐页统计见 `static-seo-audit-2026-09-22.json`。

## 下一阶段需要处理的事项

1. **产品页静态化。** `product-detail.html?sku=2001` 的原始响应是通用标题及不含 SKU 的 canonical，产品信息需 JavaScript 更新。建议用产品数据生成稳定的独立详情页，并一起迁移产品内链、canonical、hreflang 和 sitemap；保持旧 SKU 链接兼容。未在本轮贸然更换 82 个产品 URL，也未将动态渲染直接判定为“不收录”。
2. **首页和分类首图。** 帐篷 PNG 为 2,548,615 字节，旗帜 PNG 为 2,660,701 字节；应制作响应式 WebP/AVIF 资源并测试移动端 LCP、CLS。文件体积是确认事实，实际加载时间和排名影响尚未测量。
3. **相似页面与搜索意图。** 多个 `/seo/` 页面映射相同 SKU，还有多种 canopy manufacturer/supplier 页面。需要按 GSC 的“查询 → 页面”数据确认是否发生流量分散，再决定合并、差异化或重定向；不能仅凭标题相似删除页面。
4. **转化归因。** 已有同意管理下的询价/WhatsApp 事件辅助代码，但检查的源码未找到 GA4/GTM 安装标识；不能确认事件已进入分析平台。需要核实实际部署及 consent 设置，避免只追求展示、不统计有效询盘。
5. **真实采购证据。** 优先维护已存在的展会、工厂、实拍案例与产品规格，补充可核实的型号参数、检测文件及经授权案例。不得编造认证、评价、最低价、交期或固定 MOQ。

## 发布与评估顺序

1. 合并并部署此修复；验证重点中英文页面、询价按钮、语言切换，以及两个 sitemap。
2. 在 GSC 查看现有 sitemap 提交状态，确认 `https://www.waikwantent.com/sitemap.xml` 可读取。抽查首页、核心帐篷页、展示系统页、About 页的实时测试与 Google canonical，必要时请求重新编入索引。
3. 建立过去 28 天与前 28 天的基线，另保留 3 个月趋势；分别导出查询、页面、国家和设备。区分品牌词与非品牌词，避免一个异常长尾词主导结论。
4. 从已有展示的查询中选择实际有采购意图、排名靠前但点击少的页面，逐页优化标题、答案与询价路径。记录发布日期；2 周查看抓取变化，4–8 周按可用数据评估点击及有效询盘，不承诺固定增长比例。

## 校验与复现

```text
node scripts/build-static-translations.mjs --check
node scripts/build-home-static-content.mjs --check
python scripts/validate-seo.py
node scripts/validate-architecture.mjs
node scripts/validate-structured-data.mjs
git diff --check
```

本地结果：136 个 canonical 页面无空翻译节点，SEO/链接/sitemap 校验通过，82 个产品架构校验通过，191 个 HTML 文件中的 60 个 Product 结构化数据项通过现有规则检查。此检查不等同于 Google 富媒体资格认证。浏览器连接故障，因此没有完成渲染截图、交互回归或 Lighthouse 测试。

更新内容后用 `node scripts/build-static-translations.mjs` 填充新增的空节点，再用 `python scripts/build-page-sitemap.py` 同步两份 sitemap。该填充器不会覆盖已有非空文本；修改现有文案时需同步相关 HTML 与翻译字典。旧的一次性 SEO 升级脚本不应作为当前发布流程重新运行。

## 依据

- [Google：JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)：减少关键内容对后续渲染的依赖。
- [Google：noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)：抓取被禁止时无法读取页面的 noindex。
- [Google：canonical 信号](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)：使页面与 sitemap 的首选 URL 保持一致。
- [Google：sitemap 与 lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)：记录真实内容变更，不靠刷新日期制造更新。
- [Google：标题链接](https://developers.google.com/search/docs/appearance/title-link)：使用与页面语言和内容匹配的描述性标题。
