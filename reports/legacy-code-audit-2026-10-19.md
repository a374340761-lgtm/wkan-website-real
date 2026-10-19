# 旧代码遗留检查 — 2026-10-19

范围：本地仓库 HTML/JS、生成器、部署配置及说明文档。浏览器在本地抽查了两个新旧产品地址对。本次仅检查及保存证据，未修改生产源码，未部署。未获取 GSC 的 83 个具体 URL，无法将下列问题直接归因到该统计。

## 1. 旧分类入口的跳转目标和 canonical 不一致（当前存在）
- products-inflatable.html:26 跳转 product-center.html?cat=inflatable，:42 canonical 指向 inflatable-tent-manufacturer.html。
- products-flags.html:26 跳转 product-center.html?cat=flags，:42 canonical 指向 beach-flag-supplier.html。
- products-displays.html:26 跳转 product-center.html?cat=displays，:42 canonical 指向 portable-display-systems.html。
- products-lightbox.html:26 跳转 product-center.html?cat=lightbox，:42 canonical 指向 advertising-light-box-manufacturer.html。
- products-tents.html:26 跳转 product-center.html?cat=tents，:42 canonical 指向 custom-canopy-tent-manufacturer.html。
- products-furniture.html:26 跳转 furniture-type.html?type=table-chair-stool-toilet，:42 canonical 指向 product-center.html。
这些页面同时 noindex。旧入口不收录可以是正常设计，但其迁移目标未统一，不宜同时将用户送往一个页面、将 canonical 指向另一个页面。建议先确定每个旧入口唯一目标，再统一跳转/canonical/内链；部署平台确定后再配置实际服务器重定向。

## 2. Python 备用 sitemap 生成器仍使用过时逻辑（潜在回归）
scripts/build-product-sitemap.py:240-272 会将当前 urlset 改为 sitemapindex，:304-313 生成包含裸 product-detail.html 的 product-sitemap.xml。当前 Node 版本 :131-134 明确保留现有 urlset，:201-205 则明确不再输出该裸详情 sitemap。两者不是等价备用实现。仅保存此文件不会影响线上，运行它才会造成回归；本次没有运行该生成器。

## 3. 新闻页仍链接到旧分类入口（当前存在）
news/sign-china-2026-shanghai.html:144 与 zh/news/sign-china-2026-shanghai.html:155 仍链接 products-inflatable.html，额外经过上述跳转页。建议改为最终选定的充气产品入口。

## 4. 三个脚本未发现引用（待清理候选）
scripts/racegate-type.js、scripts/tent-subcategories.js、scripts/tents.js 在 HTML 与 JS/MJS 中未发现加载引用。可考虑归档，但这不单独证明其线上部署方式、外部调用或历史用途；不应仅因此直接删除。

## 5. 文档有过时操作说明（维护风险）
README.md:199 仍要求编辑 products.html 中的 WeChat ID，但该页现在是跳转入口。backend/README.md:54 的 Nodemailer 示例写 createTransporter，而 server.js 实际正确使用 createTransport。备用 backend 当前未被生产前端调用，不能视为本次询价故障。

## 已核验正常的兼容逻辑
本地浏览器验证 product-detail.html?sku=31007 和 product-detail.html?sku=WK-IS004 分别到达对应静态产品页；与直接打开静态页的 canonical 一致。无需将所有旧兼容入口删除。详细证据见 legacy-runtime-2026-10-19.json。

原始链接/脚本清单见 legacy-inventory-2026-10-19.json。之前 150 页 SEO 检查主要覆盖规范可索引页面，所以不能据其通过推断所有 noindex 兼容页也没有迁移信号问题。
