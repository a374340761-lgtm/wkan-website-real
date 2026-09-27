# 网站全文件梳理与本地检查 — 2026-09-27

## 范围与结论

当前版本是原生 HTML、CSS、JavaScript 静态双语 B2B 展示与询价网站。英文位于根路径，中文位于 `/zh/`。核心业务是产品发现、规格了解、定制需求与询价清单，不包含在线支付。

本轮完成 Git 跟踪文件全量清点、页面结构和静态资源引用扫描、核心代码调用关系检查，以及已有本地校验。没有修改网站业务代码，没有向销售渠道提交测试询价。

**边界**：这不是逐个页面的浏览器视觉验收，也不是生产服务器、真实收件或搜索引擎收录验证。PDF、Excel、CDR、图片等二进制资料本轮登记路径与体积，没有逐页审阅内容。历史报告是背景资料，不作为当前状态的直接证据。

## 文件规模

- Git 跟踪文件：577 个；HTML：198 个（其中包含测试、历史兼容页和业务辅助文件，不等同于198个正式内容页）。
- JavaScript：32 个 `.js` + 10 个 `.mjs`；CSS：19 个。
- Python：14 个；PowerShell：5 个。
- 图片：PNG 98、JPG 86、JPEG 8、WebP 17、SVG 2。
- 文档和原始资料：Markdown 38、PDF 4、Excel 6、CDR 2。
- 逐文件路径、大小、页面标题及脚本依赖详见 `reports/website-file-inventory-2026-09-27.json`。

## 页面与业务结构

| 层级 | 入口 | 职责 |
|---|---|---|
| 首页 | `index.html` / `zh/index.html` | 品牌、轮播、产品类别、展会内容、询价引导 |
| 产品中心 | `product-center.html` | 产品系列入口，支持 `?cat=` |
| 产品目录 | `all-products.html` | 产品搜索、分类、筛选与详情入口 |
| 通用详情 | `product-detail.html?sku=…` | 按 SKU 展示规格、图片和相关产品 |
| 系列详情 | `tent-type.html`、`flag-type.html`、`furniture-type.html`、`dome-type.html`、`six-sided-booth.html` | 专用系列页面；30/40/50折叠帐篷走系列路径 |
| 历史入口 | `products.html`、`product.html`、`tent-detail.html`、部分 `products-*.html` | 重定向或兼容旧参数，不宜直接删除 |
| 营销与分类 | 根目录关键词页、`collections/`、`seo/` | 产品主题、采购指南和搜索着陆页；`seo/`中英各30页 |
| 公司与服务 | `about-us.html`、`company-profile.html`、`manufacturing-capabilities.html`、`faq*.html` | 公司介绍、制造能力和采购问答 |
| 新闻 | `news/` | 展会报道、采购和使用指南；英文9个HTML，中文8个 |
| 转化与政策 | `contact-us.html`、`privacy.html`、`terms.html` | 询价、隐私、条款 |
| 辅助 | `404.html`、`site-map.html`、站点验证文件 | 错误页、人工导航和搜索平台验证 |

主路径：**首页/搜索着陆页 → 产品中心/目录 → 系列或SKU详情 → 询价清单/联系表单 → 外部收件服务**。

## 代码职责与依赖

| 文件或目录 | 当前职责与维护注意点 |
|---|---|
| `scripts/products.js` | ProductManager、82项产品数据、公共产品工具和部分展示/RFQ逻辑；数据与UI仍耦合 |
| `scripts/main.js` | 公共导航、首页轮播、Cookie同意及公共交互 |
| `scripts/multilang.js` | 中英翻译字典与DOM翻译；URL决定语言 |
| `scripts/bilingual-routing.js` | 中英切换、镜像页清单和本地化内部链接 |
| `scripts/all-products.js`、`product-center.js` | 目录筛选与产品系列入口；读取共享产品/系列数据 |
| `scripts/product-detail.js`、`product-seo-map.js` | SKU详情渲染与生成的产品SEO数据 |
| `scripts/tent-types.js`、`flag-types.js`、`tent-subcategories.js` | 系列和子分类数据，不应与产品标识随意分叉 |
| `scripts/*-type.js`、`six-sided-booth.js`、`accessories-page.js`、`tents*.js` | 对应系列、配件或帐篷展示逻辑；racegate-type.js已标为废弃 |
| `scripts/legacy-route.js`、`product-page.js` | 旧入口兼容与历史详情实现；改路由要保留SKU、语言和参数 |
| `scripts/cart.js` | 本地询价清单；`wk_rfq_cart_v1`，含旧存储迁移 |
| `scripts/contact.js` | 表单校验、询价负载、唯一询价标识和提交状态 |
| `scripts/inquiry-hook.js` | Google Apps Script适配器；25秒超时，区分确认/拒绝/未确认 |
| `scripts/customizer.js`、`get-quote-footer.js` | 定制交互与共用询价页脚 |
| `scripts/seo.js`、`analytics.js` | 运行时SEO补充与同意门控事件；事件入队不代表实际统计上报 |
| `scripts/share-links.js`、`news-lightbox.js` | 分享链接和新闻图片查看 |
| `styles/main.css` | 按顺序导入12个模块；顺序影响覆盖关系 |
| `styles/modules/` | tokens、页头、目录、详情、弹层、联系、首页、FAQ、公司介绍、卡片、移动导航等；部分模块单独引用 |
| `styles/cart.css`、`multilang.css`、`news.css`、`sign-china.css` | 特定功能样式；`.backup`为历史备份 |
| `backend/` | 备用Express/Nodemailer实现，未接入当前表单 |
| `scripts/build-*` | 首页静态文案、翻译、产品映射及sitemap生成；部分脚本会写文件，不能当只读检查运行 |
| `scripts/validate-*` | 架构、SEO与结构化数据验证 |
| `scripts/*seo*`、`audit-*`、`normalize-sku.mjs` | SEO改写、审计、SKU规范化及映射；运行前确认输入输出 |
| `scripts/extract_*`、`sort_images_by_page_map.py` | 画册图片提取与整理 |
| `tools/` | 中文镜像生成、术语表及国际化审计工具，含历史PowerShell流程 |

## 资源、运营与部署

- `images/`：Logo、二维码、首页图、产品图与画册切图；`news/images/`：展会照片。
- `data/`及根目录PDF/Excel/CDR：画册、价格表和设计源文件；并非浏览器运行代码。
- `marketing/`：外链目标与推广模板；`outputs/`：客户开发产物；`generate_us_companies_excel.py`及联系模板属于业务辅助。
- `docs/`、`reports/`及根目录审计文档：架构、SEO、询价和历史整改记录。修改前核对日期，避免把历史问题当成仍存在的问题。
- `CNAME`、`.nojekyll`、`vercel.json`、`netlify.toml`并存；只能确认仓库配置，不能据此确认当前生产平台。Vercel与Netlify的路由规则覆盖范围不同。
- `.github/workflows/architecture-checks.yml`：已有CI架构与SEO检查。
- `robots.txt`、`sitemap.xml`、`page-sitemap.xml`、`llms.txt`、`site.webmanifest`：爬虫、页面发现及站点元信息。

## 本轮校验结果

| 检查 | 结果 |
|---|---|
| 全部42个JS/MJS的 `node --check` | 通过 |
| `node scripts/validate-architecture.mjs` | 通过：路由、询价契约和82项产品 |
| `node scripts/build-home-static-content.mjs --check` | 中英首页均无空翻译槽 |
| `node scripts/build-static-translations.mjs --check` | 136个规范页，0空槽 |
| `python3 scripts/validate-seo.py` | 136个可索引页与sitemap覆盖检查通过 |
| `node scripts/validate-structured-data.mjs` | 扫描191个HTML、60项Product schema，通过 |
| HTML静态本地href/src/poster检查 | 通过，0个缺失的本地引用 |

这些检查的扫描范围不同，数量差异不代表文件遗漏或页面故障。静态扫描不验证外链可达性、锚点、CSS/JS运行时生成的所有URL或浏览器布局。

## 问题与处理状态

1. **中文配件页脚本路径**：已改为 `/scripts/accessories-page.js`，避免错误解析到 `/zh/scripts/`。
2. **中文详情页PDF链接**：已改为根路径 `/广西伟群帐篷制造有限公司2025改.pdf`。
3. **语言路由镜像清单**：已补齐已有对应页面；`racegate-type.html`继续使用专门切换分支。已通过英中双向路由检查。
4. **实际引用的大图**：已优化13张常用图片，这组页面资产从约89.9 MB降至约5.8 MB。`images/weiqun-logo.png`约90.7 MB但当前未发现页面引用，作为源资产保留。
5. **首页公共脚本负担**：main/products/multilang三个源文件合计707,132字节，未压缩约691 KiB。可考虑按页面加载；这不是实际网络传输量或实测性能评分。
6. **维护重复与文档漂移**：产品数据、UI、翻译以及多份HTML交叉耦合；README仍有旧页面修改指引和语言记忆描述，实际语言以URL为准。后续修改要同步英文、中文、静态生成物和运行时逻辑。
7. **测试页缺图**：`test_logo.html`原有3处缺失引用，已改为现有 Logo 资产；全站静态本地引用扫描现为0缺失。
8. **询价服务端待验证**：Apps Script源码不在本仓库，前端检查无法证明真实持久化、去重与销售收件。备用后端仍直接插入用户文本到HTML邮件，并顺序发送销售/客户邮件；启用前需单独整改和验证。

本轮已补入镜像清单的路径（`racegate-type.html`另有专门切换分支）：

- `/about-us.html`
- `/collections/accessories-parts.html`
- `/collections/display-systems.html`
- `/collections/flags-poles.html`
- `/collections/light-boxes.html`
- `/contact-us.html`
- `/news/beach-flag-base-selection-guide.html`
- `/news/contact-us.html`
- `/news/how-to-choose-trade-show-canopy-tent.html`
- `/news/seg-light-box-installation-maintenance.html`
- `/news/trade-show-display-system-checklist.html`
- `/product.html`
- `/racegate-type.html`
- `/tent-detail.html`

## 后续修改时的定位规则

- 改产品：先找 `products.js` 与对应系列数据，再检查目录、详情、询价清单及生成SEO映射。
- 改文案：确认HTML静态内容、`multilang.js`和中文镜像是否都需同步。
- 改公共样式：从具体模块定位，检查CSS导入次序以及首页、目录、详情、联系页的共同影响。
- 改URL：同时检查旧入口、语言镜像清单、canonical/hreflang、sitemap与部署重定向。
- 改询价：遵循 `docs/INQUIRY-OPERATIONS.md`，在测试端点验证后再切换服务。

本次新增两份梳理资料，并已修复路径、语言切换与主要大图问题，未删除历史文件。
