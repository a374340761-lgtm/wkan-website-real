# 网站日常检查 — 2026-10-19

## 结论
本地自动检查全部通过；线上已验证的核心页面可访问。部分线上地址连接超时，仍需复核，不能据此判定网站宕机。本次没有修改网站代码或发布。

## 已通过
- 架构与询价前端契约：84 个产品。
- 150 个可索引页面的 SEO、canonical、语言链接与 sitemap 覆盖。
- 205 个 HTML 文件的结构化数据检查，包含 74 个 Product 项。
- 14 个静态产品页与生成源一致；150 个规范页面无空翻译槽位。
- 210 个 HTML 页面的 GTM 配置一致。
- scripts 下全部 JS/MJS 及备用后端 JavaScript 语法检查。
- 208 个 HTML 页面的本地 href/src/poster 目标检查：无缺失文件（未验证锚点、动态生成链接及外链）。
- 本地英文/中文首页在 390px、1440px 下通过浏览器检查：轮播切换、延迟背景、单一 H1、无脚本异常、无本地资源 404、无横向溢出。
- 线上首页、帐篷制造商页、展示系统页、联系页返回 HTTP 200，canonical 与 URL 一致。
- HTTP www 首页跳转至 HTTPS www；随机不存在页面返回真实 HTTP 404。

## 待复核
以下地址在本检查环境重试后仍连接超时：裸域名 https://waikwantent.com/、robots.txt、sitemap.xml、product-detail.html?sku=2001、all-products.html、zh/。这些是连接失败，未获得 HTTP 错误响应，原因尚未确定。

未核验 Search Console / Bing 后台的流量、收录变化；未向真实销售渠道发送测试询价，邮件入库及通知送达状态未验证。

## 证据
- live-seo-audit-2026-10-19.json
- live-health-retry-2026-10-19.json
- local-links-2026-10-19.json
- home-en-390.png、home-en-1440.png、home-zh-390.png、home-zh-1440.png（本次更新的本地截图）
