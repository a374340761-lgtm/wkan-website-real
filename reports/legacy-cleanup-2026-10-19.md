# 遗留代码清理完成 — 2026-10-19

- 删除 3 个无引用脚本：racegate-type.js、tent-subcategories.js、tents.js。
- 统一 13 个中英文旧分类兼容页的跳转、canonical、社交 URL 与手动跳转链接；移除这些 noindex 兼容页上仍指向旧 URL 的 hreflang 和面包屑结构化数据。旧 URL 文件继续保留，历史链接仍可打开。
- 家具旧入口统一至对应语言的 furniture-type.html，维护脚本 seo-site-upgrade.mjs 的目标映射同步修正。
- 中英文上海展会新闻改为直接链接当前入口；中文充气入口使用已有产品中心分类视图。
- 删除 Python 产品生成器的旧解析和 sitemap 写入实现，保留 Python 命令兼容包装，调用唯一维护的 Node 版本。该命令现在需要安装 Node；未安装时清晰报错且不写文件。
- 修正文档中的旧微信修改入口与错误的 Nodemailer API 名称。
- 架构检查新增旧分类入口的跳转/canonical 一致性、目标存在性及避免二次跳转的约束。

## 验证
- 本地浏览器：13 个旧分类页全部跳转到预期页面，最终渲染 canonical 一致。证据：legacy-cleanup-browser-2026-10-19.json。
- 隔离临时目录测试 Python 兼容命令：产品 SEO 数据生成成功，现有两个 canonical sitemap 原样保留，过时 product-sitemap.xml 被移除。
- 架构及 84 个产品校验通过。
- 150 个可索引页 SEO 与 sitemap 覆盖通过；205 个 HTML 的结构化数据（74 个 Product）通过。
- 首页静态内容、翻译、14 个静态产品页和 210 个 HTML 的 GTM 一致性检查通过。
- 清理后 208 个 HTML 页面本地 href/src/poster 检查通过，无缺失目标。
- git diff --check 通过。

修改位于本地工作区，尚未提交或部署。此前检查生成的截图和报告保留；本次未更改站点主机或 CDN 设置，也没有将 HTML 跳转宣称为服务器 301。GSC 统计需部署后由 Google 重新抓取才能反映，未核验 83 个具体问题 URL。
