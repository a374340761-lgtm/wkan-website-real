# WaiKwan 全站德语版实施与验收计划

版本 1.1 · 2026-11-08 · 德语发布分支

## 当前实施记录

- 发布候选位于 `codex/german-full-site`。德语站覆盖 114 条页面和兼容路由，其中 99 条进入两个 sitemap，三语切换已启用。招聘按确认范围沿用中文页面 `/zh/careers.html`，德语入口跳转至该页面。
- 使用 `node scripts/inventory-german-localization.mjs` 重新生成源清单。使用 `python scripts/validate-german-site.py` 验证页面覆盖、内部链接与 sitemap。
- 本地验收可在仓库根目录运行 `python -m http.server 8765 --bind 127.0.0.1`，再访问 `http://127.0.0.1:8765/de/`。询价功能测试使用模拟端点，生产网站沿用原有收件服务。
- 页面正文采用离线翻译与人工术语修订。生成器为 `scripts/build-german-site.py`，使用 Argos 的英德与中英模型，模型与翻译缓存存放在仓库外。构建使用 `--models`、`--cache` 和 `--release` 参数，再运行 `python scripts/build-page-sitemap.py`。部署的是预生成页面和词典，浏览器不需要翻译服务。产品画册下载保留原件并标明原语言。

## 1. 目标和范围约定

新增 `https://www.waikwantent.com/de/`，页面语言采用 `de`，文案优先面向德国的经销商、广告制作商、展陈公司和进口采购团队。英文和简体中文中任一版本已有的公开内容、入口、功能、状态和下载，都纳入德语对照。以现有站点的实际行为为基准，先确认哪些入口在生产使用，再为每项指定德语交付方式。

现有 sitemap 有 157 条记录，含 100 条英文和 57 条简体中文 URL。附录另用 Git 已跟踪的 HTML 路径建立英简并集，包含 sitemap 之外的页面、旧路由、表单桥接和特殊文件。动态 SKU、参数状态、非 HTML 下载和生产环境规则通过阶段 0 补齐。附录的德语路径是规划候选，部署行为以验证结果为准。

覆盖口径如下。

- 内容页面交付同等德语内容和全部关联功能，包括英简任一语言独有的公开内容。英简两版资料有差异时，记录差异并核实业务事实后合并。
- 旧入口交付等价的德语兼容路由。保留 SKU、型号和支持的参数，抵达正确的德语页面。
- 404、提交桥接、错误状态和参数页面按现有用途验证响应、界面和索引行为。
- 站点验证文件、内部导出和测试样板保留在盘点中，由负责人确认用途。发现其中存在公开用户入口时纳入德语覆盖。
- 第三方平台跳转保留现有功能，站内入口、预填文案、可控通知和错误提示使用德语。无法控制的外部平台界面，以及原厂证书等必须保持原件的下载，登记语言和原因。需译的公开画册、说明、模板、图中文字与字幕纳入资源交付清单。

## 2. 阶段 0 · 锁定完整基线

1. 合并英文与中文的 Git 文件、sitemap、生产站爬取结果和站内实际链接。记录每条路由的 HTTP 状态、最终 URL、canonical、索引状态、语言切换目标和导航来源。
2. 检查实际生产部署平台及配置。逐条核对根域名转向 www、目录斜杠、旧链接、404、自定义响应头和 CSP。仓库同时含 Vercel、Netlify 和 GitHub Pages 相关文件，生产行为用线上响应确认。
3. 提取产品与系列数据。盘点每个现有 SKU、静态产品页、分类、型号、选项及规格来源。枚举产品详情、列表、系列和旧入口支持的参数，以及无效参数和无结果状态。
4. 从 HTML 和运行时脚本提取可见文案，覆盖弹窗、Toast、提示、按钮、无障碍标签、表单、自动填充、邮件正文和动态分享文本。按脚本引用关系区分生产功能与历史代码。
5. 从链接和实际交互建立资源清单，登记 PDF、画册、规格表、图片文字、视频与字幕、下载链接和权限。确认每个文件采用德语译本、带德语说明的原件还是共用无文字资源。
6. 建立验收矩阵。每行包含 ID、英／简来源、德语目标、类型、参数／状态、依赖、可索引性、翻译负责人、技术负责人、验收用例、结果及证据。一个 URL 有多个业务状态时，拆成多行。

出口条件：每一项都有明确的德语交付方式和负责人。范围基线写入版本控制。实施期间新增的英简页面或功能同步加入差异清单。

## 3. 功能逐项覆盖

| 编号 | 现有能力 | 德语交付和测试点 |
|---|---|---|
| F01 | 首页及共用导航 | 首页轮播、产品入口、展会内容、页头页脚、移动菜单、锚点、面包屑、各处询价按钮。逐一点击并核对目标。 |
| F02 | 语言选择与偏好 | 核查生产使用的语言入口，包括首次选择层、导航切换器及偏好记录。三语双向切换，同内容对应。保留有业务含义的 query 和 hash。直接打开 /de/ 时以 URL 为准。 |
| F03 | 全站搜索 | 搜索弹层、自动建议、回车、清除、键盘操作、无结果和跳到目录。验证德语词、变音字符、ß、SKU 及现有型号别名。 |
| F04 | 目录与产品中心 | 全部类目、系列入口、筛选组合、热门标签、排序、分页、清空、空结果。验证 URL 状态、刷新、返回列表和分享后的还原。 |
| F05 | 产品与系列详情 | 静态产品页、通用 SKU 页、帐篷／旗帜／家具／圆顶／六面展位等系列，覆盖型号切换、图片、图注、规格、下载、配件、相关产品和询价入口。每个 SKU 做数据覆盖检查，每种模板做浏览器测试。 |
| F06 | 规格与包装 | 规格库、可验证规格表、包装尺寸、技术数据、原件和下载。德语采用公制优先及适当数字格式，原始尺寸、SKU、系列 ID 和技术数值保持一致。 |
| F07 | OEM 与营销内容 | 主分类和供应商落地页、全部 SEO 专题、采购指南、公司资料、工厂能力、出口装柜、新闻和展会文章。保留表格、视频、图集、分享及正文内链接。 |
| F08 | 询价篮和定制 | 产品卡、详情和系列表加入询价，编辑数量、移除、清空、跨语言恢复、旧存储迁移。按实际启用功能核查定制控件、预填、复制、CSV、邮件、WhatsApp 和微信入口。 |
| F09 | 联系表单 | 联系入口、字段、说明、隐私同意、校验、产品和数量预填、提交中、确认成功、拒绝、超时及网络异常。沿用生产 Apps Script 合同，验证询价 ID、去重、销售侧来源语言与来源页。 |
| F10 | 招聘与申请 | 德语站入口链接至现有简体中文招聘页。中文正文、问卷、隐私同意、草稿与提交链路由原页面提供。 |
| F11 | 政策、同意与跟踪 | 隐私、条款、招聘隐私、Cookie 界面和偏好入口。核对实际收集的数据、第三方服务和用途。验证同意及拒绝两种路径、询价事件去重和语言归因。 |
| F12 | 特殊路径 | 人工站点地图、404、旧产品入口、历史新闻联系入口、提交桥接、直接 SKU 链接。逐项检查 HTTP 状态、参数保留、德语目标及索引策略。 |
| F13 | 附件与外链 | 公开画册、产品规格、印刷资料、下载、视频字幕、新闻图片查看和社交分享。核对语言标记、下载成功、可访问性和站外目标。 |
| F14 | 设备与可访问性 | 桌面和手机、键盘焦点、弹层关闭、读屏标签、图片替代文本、德语长词换行、表格横向滚动及移动端按钮可用性。 |

## 4. 技术实施

### 4.1 统一语言和 URL 映射

- 建立单一语言定义与路由映射，供导航、生成器、产品、表单、SEO 及 sitemap 使用。先改造当前写死英／简判断的入口，逐处处理默认英文和中文分支。
- 英文根路径、简体 /zh/、德语 /de/ 分别可直接访问。保留现有 URL 结构。德语路径先复用现有规范页后缀，专用旧入口由路由映射处理。
- 映射以同一内容 ID 或 SKU 为准。旧产品链接、列表查询、型号、已支持的营销参数和锚点分别定义保留规则。尚未发布的德语页面只在预览中使用，公开切换器按已发布映射生成。
- 共享询价篮使用稳定 SKU 和数量，商品名称按当前页面语言显示。语言切换和翻译不改变产品、问卷或选项 ID。

### 4.2 生成页面和内容本地化

- 扩展 bilingual-routing.js、multilang.js、build-static-translations.mjs、build-static-product-pages.mjs 和相关首页、规格、招聘生成器。页面在初始 HTML 输出德语主内容，运行时为搜索、表单和状态提供德语词条。
- 建立德语术语表和各内容类型模板。优先统一 Bedruckte Faltzelte、Beachflags、Mobile Messewände、LED-Textilspannrahmen、Mindestbestellmenge、Muster 和 Anfrage 等词。产品规格、MOQ、交期和供应范围由产品或销售负责人复核。
- 德语数字、小数、日期和单位展示用统一地区格式。界面格式化和原始数据分开。校对图片替代文字、标题、字幕、附件名、下载说明及无障碍标签。
- 用构建检查报告缺失德语键、缺失数据字段、断链和明显中英文残留。品牌、SKU、国际标准名称等保留项纳入显式清单。

### 4.3 表单、数据与监测

- 联系询价沿用 contact.js → inquiry-hook.js → Google Apps Script。先在测试端点验证持久化、幂等、拒绝和超时，再核对销售侧记录。德语问询在来源页与来源语言上可区分。
- 招聘单独走现有申请流程。确认题目、选项、草稿恢复、同意和提交回执与英简现有行为一致。测试用虚构资料和测试端点。
- 在现有分析与同意机制中接入德语维度。区分点击询价按钮和成功提交，确认分析事件不包含表单个人资料。对照正式站验证跟踪能按同意状态工作。

### 4.4 搜索与部署

- 可索引德语页使用自引用 canonical、德语标题与描述、正确的结构化数据和内部链接。已上线的等价语言页相互标注 hreflang，并按现有约定使用英文 x-default。
- sitemap 仅收录可索引、规范、返回 200 的页面。旧入口、查询参数、桥接、404 和预览分别使用适合其用途的响应与索引规则。检查线上 robots、重定向链、静态资源和德语错误页。
- 预览环境跑全量检查。公开发布时，同批同步部署页面、语言映射、导航和 sitemap。预先演练回滚，出现关键流程故障时恢复上一组匹配的页面、路由和站点地图。

## 5. 建议排期与责任

以阶段 0 的实际清单确认工期。下表为工作顺序，可并行推进翻译与开发。每一批都要关闭对应的验收项。

| 阶段 | 建议窗口 | 主责 | 可验收交付 |
|---|---|---|---|
| 0 · 范围冻结 | 第 1 周 | 项目负责人、开发、SEO | 路由与功能矩阵、SKU 和资源清单、生产行为基线、术语表初版 |
| 1 · 三语基础 | 第 2 周 | 开发、QA | 三语路由、生成器、共享 UI、测试环境、现有英简回归结果 |
| 2 · 产品及询价 | 第 3–4 周 | 开发、产品、销售、德语审校 | 产品中心、全部目录模板与 SKU 映射、规格、询价篮、联系人表单及测试收件证据 |
| 3 · 内容与辅助流程 | 第 4–6 周 | 内容、德语审校、招聘及资料负责人 | 全部落地页、新闻、指南、下载、政策、招聘和错误状态，逐项挂证据 |
| 4 · 全站联调及发布 | 第 7 周起 | QA、SEO、发布负责人 | 矩阵全部关闭、构建和线上冒烟验证、回滚记录 |
| 5 · 上线复盘 | 上线后 2 周、8–12 周 | SEO、销售 | 先核对抓取与收件，再按 /de/、德国地区及非品牌词复盘有效询盘和打样 |

工期主要取决于 SKU 文案、公开资料翻译、德语人工复核和业务确认。建议先在预览验证关键链路，整站达标后统一公开。若业务选择分批公开，已发布范围和待交付范围在清单中分开管理，最终交付仍以全量验收为准。

## 6. 发布门槛

- **清单覆盖 100%**。全部公开页面、动态路径、SKU、功能状态和对外资源都有通过记录。只允许用途已确认的技术文件或第三方限制按各自交付方式关闭。任何未解释差异都阻断发布。
- **语言与数据**。逐页核对导航和正文。核心采购页人工审校。全部 SKU 自动核对存在性、技术数据一致性和可达性。多语切换测试覆盖深链接、支持的参数和回退。
- **功能测试**。自动检查全部路径的状态码、链接和 SEO。按模板跑桌面与手机交互，完整演练搜索到询价、邮件或 WhatsApp 预填、表单失败后重试、招聘和下载。
- **英简回归**。复跑仓库现有架构、生成器、SEO、结构化数据、产品搜索、询价及招聘测试，并对照现有重定向及链接清单。德语检查并入现有 CI。
- **上线核验**。确认 sitemap、主要页面响应、德语 404、询价与招聘测试记录、数据归因和回滚操作。发布后保存关键页面截图、爬取报告和测试结果。

参考：[Google 多语言站点指南](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) · [Google 语言版本标记指南](https://developers.google.com/search/docs/specialty/international/localized-versions)

## 附录 · 仓库 HTML 静态路径对照

该表来自本轮已跟踪 HTML 文件。英／简列标明仓库中有无对应文件。目录首页按规范目录形式显示为德语候选。所有候选仍需与线上路由、sitemap、实际功能和动态清单核对。

| 源路径（移除语言前缀） | 英文文件 | 简体文件 | 德语候选／处理方式 |
|---|---|---|---|
| 10x10-pop-up-canopy-tent.html | 有 | 有 | /de/10x10-pop-up-canopy-tent.html |
| 404.html | 有 | — | /de/404.html · 核对特殊行为 |
| about-us.html | 有 | 有 | /de/about-us.html |
| advertising-light-box-manufacturer.html | 有 | — | /de/advertising-light-box-manufacturer.html |
| all-products.html | 有 | 有 | /de/all-products.html |
| aluminum-folding-canopy-tents.html | 有 | 有 | /de/aluminum-folding-canopy-tents.html · 核对兼容跳转 |
| aluminum-folding-tent.html | 有 | 有 | /de/aluminum-folding-tent.html |
| beach-flag-buying-guide.html | 有 | — | /de/beach-flag-buying-guide.html |
| beach-flag-supplier.html | 有 | 有 | /de/beach-flag-supplier.html |
| canopy-tent-buying-guide.html | 有 | — | /de/canopy-tent-buying-guide.html |
| canopy-tents.html | 有 | 有 | /de/canopy-tents.html |
| careers-submit-bridge.html | 有 | — | /de/careers-submit-bridge.html · 核对特殊行为 |
| careers.html | 有 | 有 | /de/careers.html |
| collections/accessories-parts.html | 有 | 有 | /de/collections/accessories-parts.html |
| collections/display-systems.html | 有 | 有 | /de/collections/display-systems.html |
| collections/flags-poles.html | 有 | 有 | /de/collections/flags-poles.html |
| collections/light-boxes.html | 有 | 有 | /de/collections/light-boxes.html |
| company-profile.html | 有 | — | /de/company-profile.html |
| contact-us.html | 有 | 有 | /de/contact-us.html |
| custom-canopy-tent-manufacturer.html | 有 | 有 | /de/custom-canopy-tent-manufacturer.html |
| custom-printed-canopy-tents.html | 有 | 有 | /de/custom-printed-canopy-tents.html |
| custom-printed-tent.html | 有 | — | /de/custom-printed-tent.html |
| dome-type.html | 有 | 有 | /de/dome-type.html |
| event-canopy-tents.html | 有 | 有 | /de/event-canopy-tents.html |
| event-tent-and-promotional-display.html | 有 | — | /de/event-tent-and-promotional-display.html |
| export-loading.html | 有 | 有 | /de/export-loading.html |
| faq-artwork-files.html | 有 | 有 | /de/faq-artwork-files.html |
| faq-color-matching.html | 有 | 有 | /de/faq-color-matching.html |
| faq-lead-time.html | 有 | 有 | /de/faq-lead-time.html |
| faq-moq.html | 有 | 有 | /de/faq-moq.html |
| faq-samples.html | 有 | 有 | /de/faq-samples.html |
| faq-shipping.html | 有 | 有 | /de/faq-shipping.html |
| faq.html | 有 | 有 | /de/faq.html |
| flag-pole-and-base-manufacturer.html | 有 | — | /de/flag-pole-and-base-manufacturer.html |
| flag-type.html | 有 | 有 | /de/flag-type.html |
| furniture-type.html | 有 | 有 | /de/furniture-type.html |
| googlead697dfed14475b1.html | 有 | — | 核对用途 · 内部、验证或测试候选 |
| index.html | 有 | 有 | /de/ |
| index.original.html | 有 | — | 核对用途 · 内部、验证或测试候选 |
| index.wireframe.html | 有 | — | 核对用途 · 内部、验证或测试候选 |
| inflatable-tent-manufacturer.html | 有 | — | /de/inflatable-tent-manufacturer.html |
| manufacturing-capabilities.html | 有 | — | /de/manufacturing-capabilities.html |
| news/apppexpo-2026-shanghai.html | 有 | 有 | /de/news/apppexpo-2026-shanghai.html |
| news/beach-flag-base-selection-guide.html | 有 | 有 | /de/news/beach-flag-base-selection-guide.html |
| news/contact-us.html | 有 | 有 | /de/news/contact-us.html · 核对兼容跳转 |
| news/how-to-choose-trade-show-canopy-tent.html | 有 | 有 | /de/news/how-to-choose-trade-show-canopy-tent.html |
| news/index.html | 有 | 有 | /de/news/ |
| news/seg-light-box-installation-maintenance.html | 有 | 有 | /de/news/seg-light-box-installation-maintenance.html |
| news/sign-china-2026-shanghai.html | 有 | 有 | /de/news/sign-china-2026-shanghai.html |
| news/the-139th-canton-fair-phase-3.html | 有 | — | /de/news/the-139th-canton-fair-phase-3.html |
| news/the-140th-canton-fair-phase-3.html | 有 | — | /de/news/the-140th-canton-fair-phase-3.html |
| news/trade-show-display-system-checklist.html | 有 | 有 | /de/news/trade-show-display-system-checklist.html |
| outputs/global-leads-20260910/一键BCC写信_50家.html | 有 | — | 核对用途 · 内部、验证或测试候选 |
| pop-up-canopy-tent-manufacturer.html | 有 | 有 | /de/pop-up-canopy-tent-manufacturer.html |
| pop-up-canopy-tent-supplier.html | 有 | — | /de/pop-up-canopy-tent-supplier.html |
| pop-up-canopy-tent.html | 有 | 有 | /de/pop-up-canopy-tent.html |
| pop-up-canopy-tents.html | 有 | 有 | /de/pop-up-canopy-tents.html |
| pop-up-display-stands.html | 有 | 有 | /de/pop-up-display-stands.html |
| portable-display-buying-guide.html | 有 | — | /de/portable-display-buying-guide.html |
| portable-display-systems.html | 有 | 有 | /de/portable-display-systems.html |
| privacy.html | 有 | 有 | /de/privacy.html |
| product-center.html | 有 | 有 | /de/product-center.html |
| product-detail.html | 有 | 有 | /de/product-detail.html · 核对特殊行为 |
| product.html | 有 | 有 | /de/product.html · 核对兼容跳转 |
| products-accessories.html | 有 | 有 | /de/products-accessories.html |
| products-custom.html | 有 | 有 | /de/products-custom.html |
| products-displays.html | 有 | 有 | /de/products-displays.html |
| products-flags.html | 有 | 有 | /de/products-flags.html |
| products-furniture.html | 有 | 有 | /de/products-furniture.html |
| products-inflatable.html | 有 | 有 | /de/products-inflatable.html |
| products-lightbox.html | 有 | 有 | /de/products-lightbox.html |
| products-tents.html | 有 | — | /de/products-tents.html |
| products.html | 有 | 有 | /de/products.html · 核对兼容跳转 |
| products/1x1m-40mm-aluminum-market-stall.html | 有 | 有 | /de/products/1x1m-40mm-aluminum-market-stall.html |
| products/3x3-standard-black-flat-tube-canopy-frame.html | 有 | 有 | /de/products/3x3-standard-black-flat-tube-canopy-frame.html |
| products/curved-fabric-banner-stand.html | 有 | 有 | /de/products/curved-fabric-banner-stand.html |
| products/floor-standing-seg-light-box-wk-is004.html | 有 | 有 | /de/products/floor-standing-seg-light-box-wk-is004.html |
| products/folding-chair-31007.html | 有 | 有 | /de/products/folding-chair-31007.html |
| products/half-wall-blade-flag-connector-9014.html | 有 | 有 | /de/products/half-wall-blade-flag-connector-9014.html |
| products/round-water-weight-bucket-9004.html | 有 | 有 | /de/products/round-water-weight-bucket-9004.html |
| products/semi-circle-race-gate-9403.html | 有 | 有 | /de/products/semi-circle-race-gate-9403.html |
| racegate-type.html | 有 | 有 | /de/racegate-type.html |
| seg-light-box-manufacturer.html | 有 | 有 | /de/seg-light-box-manufacturer.html |
| seo/advertising-flag-pole-and-base-wholesale-supplier-b2b.html | 有 | 有 | /de/seo/advertising-flag-pole-and-base-wholesale-supplier-b2b.html |
| seo/aluminum-frame-fabric-display-manufacturer-custom-branding.html | 有 | 有 | /de/seo/aluminum-frame-fabric-display-manufacturer-custom-branding.html |
| seo/aluminum-frame-pop-up-tent-factory-direct-export.html | 有 | 有 | /de/seo/aluminum-frame-pop-up-tent-factory-direct-export.html |
| seo/beach-flag-manufacturer-wholesale-feather-teardrop-flags.html | 有 | 有 | /de/seo/beach-flag-manufacturer-wholesale-feather-teardrop-flags.html |
| seo/branded-promotional-tent-supplier-b2b-bulk-orders.html | 有 | 有 | /de/seo/branded-promotional-tent-supplier-b2b-bulk-orders.html |
| seo/collapsible-display-system-wholesale-distributor-pricing.html | 有 | 有 | /de/seo/collapsible-display-system-wholesale-distributor-pricing.html |
| seo/commercial-grade-pop-up-canopy-wholesale-supplier.html | 有 | 有 | /de/seo/commercial-grade-pop-up-canopy-wholesale-supplier.html |
| seo/custom-beach-flag-kit-supplier-for-agencies.html | 有 | 有 | /de/seo/custom-beach-flag-kit-supplier-for-agencies.html |
| seo/custom-canopy-tent-factory-for-reseller-programs.html | 有 | 有 | /de/seo/custom-canopy-tent-factory-for-reseller-programs.html |
| seo/custom-printed-canopy-tent-manufacturer-oem-china.html | 有 | 有 | /de/seo/custom-printed-canopy-tent-manufacturer-oem-china.html |
| seo/custom-printed-feather-flag-supplier-bulk-order-oem.html | 有 | 有 | /de/seo/custom-printed-feather-flag-supplier-bulk-order-oem.html |
| seo/double-sided-beach-flag-manufacturer-export-quality.html | 有 | 有 | /de/seo/double-sided-beach-flag-manufacturer-export-quality.html |
| seo/event-feather-flag-printing-manufacturer-factory-direct.html | 有 | 有 | /de/seo/event-feather-flag-printing-manufacturer-factory-direct.html |
| seo/exhibition-tent-frame-and-fabric-manufacturer-odm.html | 有 | 有 | /de/seo/exhibition-tent-frame-and-fabric-manufacturer-odm.html |
| seo/fabric-tension-backwall-supplier-bulk-for-rental-companies.html | 有 | 有 | /de/seo/fabric-tension-backwall-supplier-bulk-for-rental-companies.html |
| seo/folding-event-tent-supplier-wholesale-moq.html | 有 | 有 | /de/seo/folding-event-tent-supplier-wholesale-moq.html |
| seo/heavy-duty-gazebo-tent-wholesale-manufacturer-europe-shipping.html | 有 | 有 | /de/seo/heavy-duty-gazebo-tent-wholesale-manufacturer-europe-shipping.html |
| seo/modular-exhibition-display-hardware-manufacturer-odm.html | 有 | 有 | /de/seo/modular-exhibition-display-hardware-manufacturer-odm.html |
| seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html | 有 | 有 | /de/seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html |
| seo/outdoor-promotional-flag-system-manufacturer-oem.html | 有 | 有 | /de/seo/outdoor-promotional-flag-system-manufacturer-oem.html |
| seo/pop-up-display-stand-wholesale-supplier-for-events.html | 有 | 有 | /de/seo/pop-up-display-stand-wholesale-supplier-for-events.html |
| seo/portable-backdrop-display-system-supplier-wholesale.html | 有 | 有 | /de/seo/portable-backdrop-display-system-supplier-wholesale.html |
| seo/portable-trade-show-booth-backdrop-manufacturer-export.html | 有 | 有 | /de/seo/portable-trade-show-booth-backdrop-manufacturer-export.html |
| seo/quick-setup-display-frame-supplier-oem-graphics.html | 有 | 有 | /de/seo/quick-setup-display-frame-supplier-oem-graphics.html |
| seo/replacement-beach-flag-pole-base-supplier-wholesale.html | 有 | 有 | /de/seo/replacement-beach-flag-pole-base-supplier-wholesale.html |
| seo/seg-fabric-light-box-manufacturer-b2b-custom-sizes.html | 有 | 有 | /de/seo/seg-fabric-light-box-manufacturer-b2b-custom-sizes.html |
| seo/teardrop-flag-hardware-supplier-for-print-shops.html | 有 | 有 | /de/seo/teardrop-flag-hardware-supplier-for-print-shops.html |
| seo/tension-fabric-display-wall-manufacturer-oem-trade-show.html | 有 | 有 | /de/seo/tension-fabric-display-wall-manufacturer-oem-trade-show.html |
| seo/trade-show-canopy-tent-manufacturer-for-distributors.html | 有 | 有 | /de/seo/trade-show-canopy-tent-manufacturer-for-distributors.html |
| seo/wind-sail-banner-flag-wholesale-supplier-moq.html | 有 | 有 | /de/seo/wind-sail-banner-flag-wholesale-supplier-moq.html |
| site-map.html | 有 | 有 | /de/site-map.html |
| six-sided-booth.html | 有 | 有 | /de/six-sided-booth.html |
| specifications-packing.html | 有 | 有 | /de/specifications-packing.html |
| tension-fabric-backwall.html | 有 | 有 | /de/tension-fabric-backwall.html |
| tent-detail.html | 有 | 有 | /de/tent-detail.html · 核对兼容跳转 |
| tent-type.html | 有 | 有 | /de/tent-type.html |
| terms.html | 有 | 有 | /de/terms.html |
| test_logo.html | 有 | — | 核对用途 · 内部、验证或测试候选 |
| test_stats.html | 有 | — | 核对用途 · 内部、验证或测试候选 |

