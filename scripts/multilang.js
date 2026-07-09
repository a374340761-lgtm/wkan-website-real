// 多语言支持系统

// ✅ 统一语言配置
const LANG_KEY = 'site_language';
const DEFAULT_LANG = 'en';

// ✅ Site languages: English + Chinese only
const ENABLED_LANGS = ['en', 'zh'];

// ✅ 公司名（统一来源，避免在多个 HTML 写死）
const COMPANY_NAME = {
    en: 'Guangxi WaiKwan Tent',
    zh: '广西伟群帐篷制造有限公司',
};

// ✅ 获取语言：URL 为唯一依据（/zh/ => zh，根路径英文页 => en）；不使用 localStorage 覆盖 URL
function getLang() {
    try {
        if (typeof window.wkResolvePageLanguage === 'function') {
            return window.wkResolvePageLanguage();
        }
    } catch (e) {}
    try {
        const p = window.location.pathname.replace(/\\/g, '/');
        if (p === '/zh' || p.startsWith('/zh/')) return 'zh';
    } catch (e2) {}
    return DEFAULT_LANG;
}

// ✅ 设置语言：仅允许 ENABLED_LANGS
function setLang(lang) {
    if (!ENABLED_LANGS.includes(lang)) return;
    localStorage.setItem(LANG_KEY, lang);
    // 应用语言（使用 multiLang 实例）
    if (window.multiLang && typeof window.multiLang.switchLanguage === 'function') {
        window.multiLang.switchLanguage(lang);
    }
}

/**
 * Pages that reuse a slim navbar (FAQ, policy, etc.) may omit the globe dropdown.
 * Inject the same control as index.html so EN ↔ /zh/ navigation always works.
 */
function injectLangSwitcherIfMissing() {
    try {
        if (document.getElementById('langDropdown')) return;
        const nav = document.querySelector('.navbar .nav-container');
        if (!nav) return;
        const wrap = document.createElement('div');
        wrap.className = 'nav-actions';
        wrap.innerHTML = `
                <div class="lang-dropdown" id="langDropdown">
                    <button class="nav-icon-btn lang-btn" type="button" aria-label="Change language" data-translate-aria-label="aria_language" id="langBtn">
                        <i class="fas fa-globe"></i>
                    </button>
                    <div class="lang-menu" id="langMenu" role="menu" aria-label="Select language">
                        <button type="button" class="lang-item" data-lang="en" data-lang-option="en">English</button>
                        <button type="button" class="lang-item" data-lang="zh" data-lang-option="zh">中文</button>
                    </div>
                </div>`;
        const ham = nav.querySelector('.hamburger');
        if (ham) {
            nav.insertBefore(wrap, ham);
        } else {
            nav.appendChild(wrap);
        }
    } catch (e) {
        /* ignore */
    }
}

(function scheduleLangSwitcherInject() {
    function go() {
        injectLangSwitcherIfMissing();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', go);
    } else {
        go();
    }
})();

class MultiLanguageSystem {
    constructor() {
        this.currentLanguage = getLang(); // 使用统一的 getLang()
        this.translations = {
            zh: {
                // 导航
                nav_home: '首页',
                nav_about: '公司介绍',
                nav_products: '产品中心',
                nav_services: '服务范围',
                nav_contact: '联系我们',
                nav_faq: '常见问题',
                nav_about_us: '关于我们',
                nav_factory_strength: '工厂实力',
                nav_core_categories: '核心分类',
                nav_why_choose_us: '为什么选择我们',

                // Top-level mobile nav sections (accordion)
                nav_section_products: '产品',
                nav_section_solutions: '解决方案',
                nav_section_customer_service: '客户服务',
                nav_cat_tents: '广告帐篷（折叠篷）',
                nav_cat_flags_poles: '沙滩旗与旗杆',
                nav_cat_displays: '展示系统',
                nav_light_boxes_nav: '灯箱',
                nav_cat_accessories: '配件',
                nav_oem_odm: 'OEM / ODM',
                nav_sol_canopy: '定制广告帐篷',
                nav_sol_beach_flags: '沙滩旗供应',
                nav_sol_portable_display: '便携式展示系统',
                nav_news_resources: '资讯与资源',
                nav_follow_us: '关注我们',
                nav_site_map: '网站地图',

                // Language gate
                language_gate_title: '欢迎',
                language_gate_desc: '请选择语言',

                // All Products
                products_cat_all: '全部分类',

                // Listing spec tags
                spec_sizes_sml: '尺寸：S / M / L',
                spec_print_single_double: '印刷：单面 / 双面',
                spec_base_options: '底座可选',
                spec_sizes_prefix: '尺寸：',
                spec_weight_prefix: '重量：',
                spec_sizes_default: '尺寸：3×3m / 3×6m',
                spec_custom_print: '支持定制印刷',
                spec_display_width: '宽度：3m / 4m / 5m',
                spec_display_height: '高度：2.3m',
                spec_display_shapes: '直形 / 弧形',
                spec_customizable: '支持定制',
                
                // 公司信息
                company_name: '广西伟群帐篷制造有限公司',
                tagline: '帐篷、沙滩旗与展示系统源头制造工厂',
                
                // 首页
                hero_badge: '专业制造',
                hero_title: '折叠帐篷 · 旗帜 · 展示系统',
                hero_subtitle: '专注帐篷、沙滩旗与快幕秀等展示系统的研发与制造，为全球客户提供高品质可定制的展示解决方案',
                btn_explore: '探索产品',
                btn_contact: '联系我们',

                // Homepage (2026 redesign)
                home_hero_primary_cta: '获取报价',
                home_hero_secondary_cta: '查看产品',

                home_hero_1_kicker: '广告帐篷制造商 · OEM/ODM',
                home_hero_1_title: '定制广告帐篷与快开篷',
                home_hero_1_subtitle: '工厂直供定制印刷篷房与活动用折叠篷，覆盖展会、市集与户外推广；铝架 / 铁架、围布与出口包装可一并规划。',

                home_hero_2_kicker: '沙滩旗 · 户外引流',
                home_hero_2_title: '高辨识度广告旗帜系统',
                home_hero_2_subtitle: '羽毛旗/刀旗/矩形旗，搭配多种底座与旗杆材料，适配不同场地。',

                home_hero_3_kicker: '展示系统 · 快速搭建',
                home_hero_3_title: '便携式快幕秀展示背景墙',
                home_hero_3_subtitle: '轻便结构，画面可更换，适用于展会背景、舞台与品牌形象展示。',

                home_hero_0_kicker: '中国源头制造 · B2B 出口',
                home_hero_0_title: '广告帐篷、沙滩旗与展示系统制造商',
                home_hero_0_subtitle: '为全球品牌方、渠道商与活动公司提供 OEM/ODM、定制印刷与出口包装协同——从打样到批量交付。',
                home_hero_trust_1: 'OEM / ODM',
                home_hero_trust_2: '工厂直供',
                home_hero_trust_3: '全球出口',
                home_hero_trust_aria: '品牌与工厂能力要点',

                home_core_routes_title: '三大核心产品线',
                home_core_routes_subtitle: '以视觉化入口选择对的品类：广告帐篷、旗帜系统，以及展示/灯箱业务。',
                home_core_entrance_tent_title: '广告帐篷 / 折叠篷',
                home_core_entrance_tent_desc: '定制印刷、快开铝架/铁架，用于展会、市集、户外与渠道批发项目。',
                home_core_entrance_flags_title: '沙滩旗与旗杆',
                home_core_entrance_flags_desc: '羽毛旗/刀旗/矩形旗，配套多种旗杆、底座与户外展示组合。',
                home_core_entrance_combined_title: '展示系统与灯箱',
                home_core_entrance_combined_desc: '快幕秀、张拉布、促銷台与 SEG 灯箱，服务展会、零售与活动陈列。',
                home_view_range: '查看系列',
                home_get_quote_short: '询价',
                home_about_learn_cta: '了解工厂与产能',

                home_featured_solutions_title: '重点方案与规格入口',
                home_featured_solutions_subtitle: '常见高意向项目：标准尺寸、印刷篷、铝架、旗类与展陈构件。',
                home_solution_1010_title: '10×10 快开篷（3×3 m）',
                home_solution_1010_desc: '适合北美等市场的标准展位与试单打样。',
                home_solution_print_title: '定制印刷广告篷',
                home_solution_print_desc: '顶篷/檐口/围布一体化品牌呈现。',
                home_solution_alu_title: '铝合金折叠篷',
                home_solution_alu_desc: '高频搭建与户外面向的结构选型。',
                home_solution_flags_title: '羽毛旗与刀旗',
                home_solution_flags_desc: '户外引流、点位与通道标识的旗帜系统。',
                home_solution_seg_title: 'SEG 灯箱',
                home_solution_seg_desc: '边缘发光+可换图，提升展厅/橱窗效果。',
                home_solution_tension_title: '张拉布背景墙',
                home_solution_tension_desc: '轻铝架+弹力画面，快速搭建的展会背景。',

                home_applications_title: '典型应用行业',
                home_applications_subtitle: '将产品与真实商业场景对齐，服务活动、品牌与展陈采购。',
                home_app_retail_title: '零售与品牌活动',
                home_app_retail_desc: '店内外促销、品牌路演与长期陈列物料。',
                home_app_retail_cta: '查看展示与陈列',
                home_app_events_title: '活动与地推',
                home_app_events_desc: '市集、嘉年华与地推，需要快速安装与可重复运输的物料。',
                home_app_events_cta: '活动与户外篷房',
                home_app_tradeshow_title: '展会与博览',
                home_app_tradeshow_desc: '标准展位、背景墙与光箱组合，服务参展项目与项目型订单。',
                home_app_tradeshow_cta: '展会篷房方案',

                home_inquiry_teaser_title: '需要报价或打样？',
                home_inquiry_teaser_subtitle: '把品类、数量、目标市场与交付期告诉我们，工程与业务同事会在 24 小时内回复。',
                home_inquiry_teaser_btn: '填写询价单',
                home_inquiry_teaser_chat: 'WhatsApp 快速联系',
                home_inquiry_teaser_promise: '工作日通常 24 小时内回复初步方案。',
                home_seo_footnav_title: '更多内部索引与规格入口',
                home_seo_footnav_html:
                    '<a href="canopy-tents.html">广告帐篷总览</a> · <a href="pop-up-canopy-tents.html">快开广告篷</a> · <a href="custom-canopy-tent-manufacturer.html">定制制造商</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 快开篷</a> · <a href="aluminum-folding-tent.html">铝架折叠篷</a> · <a href="beach-flag-supplier.html">沙滩旗</a> · <a href="portable-display-systems.html">便携展陈</a> · <a href="tension-fabric-backwall.html">张拉布背景墙</a> · <a href="seg-light-box-manufacturer.html">SEG 灯箱</a> · <a href="product-center.html?cat=tents">帐篷分类</a> · <a href="product-center.html?cat=flags">旗类</a> · <a href="all-products.html">全部 SKU</a>',

                home_popular_categories_title: '核心产品分类',
                home_popular_categories_subtitle: '工厂定制广告帐篷与快开篷是核心业务；以下从帐篷入口优先，再到旗帜、展示系统与配套。',
                discover_hub_title: '产品中心',
                discover_hub_desc: '按大类查看子系列与入口',
                discover_catalog_title: '全部产品',
                discover_catalog_desc: '搜索与筛选全部 SKU',
                home_cat_cta: '浏览该分类',
                home_cat_cta_hub: '进入分类总览',
                home_cat_browse_catalog: '查看该分类全部 SKU',
                home_cat_tents_title: '广告帐篷 / 折叠篷',
                home_cat_tents_desc: '定制印刷、快开铝架 / 铁架系列，适用于展会、市集与户外活动；工厂 OEM/ODM。',
                home_cat_flags_title: '旗帜与旗杆',
                home_cat_flags_desc: '羽毛旗/刀旗/矩形旗 + 旗杆与多种底座系统。',
                home_cat_displays_title: '展示系统',
                home_cat_displays_desc: '背景墙、张拉布、灯箱等展示方案，适用于展会与品牌展示。',
                home_cat_lightbox_title: '灯箱',
                home_cat_lightbox_desc: '便携式灯箱与发光展示，支持画面更换与定制。',
                home_cat_racegate_title: '竞速拱门 / 广告拱门',
                home_cat_racegate_desc: '赛事与活动用拱门结构，便携耐用，支持不同规格。',
                home_cat_accessories_title: '配件',
                home_cat_accessories_desc: '侧墙、配重、收纳袋、连接件等一站式配套。',

                home_canopy_priority_title: '定制广告帐篷 · 工厂直供',
                home_canopy_priority_hint: 'B2B 采购入口：总览、快开篷、分类、制造商与现货 SKU。',
                home_canopy_pri_hub: '广告帐篷总览',
                home_canopy_pri_pop_generic: '快开广告篷',
                home_canopy_pri_all_skus: '全部帐篷 SKU',
                tents_hub_buyer_intro_title: '选购提示',
                tents_hub_buyer_intro_p: '先选框架系列（铝架 / 铁架等）与印刷需求；完整 OEM 说明见制造商页面，现货与 SKU 见全部产品。',
                nav_sub_canopy_custom_printed: '定制印刷广告篷',
                nav_sub_canopy_pop_mfg: '快开广告帐篷制造商',
                nav_sub_canopy_event_tents: '活动用广告帐篷',
                nav_sub_canopy_aluminum_frames: '铝合金折叠篷（框架）',
                pdp_tent_b2b_title: '活动展示一站式配套（询盘时可一并说明）',
                pdp_tent_b2b_lead: '同一工厂可搭配沙滩旗、快幕秀背景墙、桌套与灯箱，便于统一画面与出货包装。',
                page_title_pop_up_mfg: '快开广告帐篷制造商｜伟群帐篷',
                landing_pop_up_mfg_h1: '快开广告帐篷制造商',
                page_title_custom_printed_canopy: '定制印刷广告帐篷｜伟群帐篷',
                landing_custom_printed_canopy_h1: '定制印刷广告帐篷',
                page_title_canopy_hub: '商业广告帐篷总览｜30/40/50 系列与 OEM 出口｜伟群帐篷',
                page_title_pop_canopy_hub: '快开广告篷｜折叠展销帐篷与 B2B 定制｜伟群帐篷',
                page_title_event_canopy: '活动与展会广告帐篷｜OEM 印刷与出口支持｜伟群帐篷',
                landing_event_canopy_h1: '活动与展会广告帐篷',
                landing_pop_up_mfg_p1_html: '<p>WaiKwan（伟群帐篷）为 B2B 客户提供快开广告帐篷框架与篷面生产：支持定制印刷、围布与配件选配，适合渠道商、活动公司与品牌方。</p>',
                landing_pop_up_mfg_p2_html: '<p>需要完整活动物料时，可搭配<a href="/zh/product-center.html?cat=flags">沙滩旗</a>、<a href="/zh/all-products.html?cat=displays&amp;sub=tension-fabric">快幕秀背景墙</a>与<a href="/zh/product-center.html?cat=lightbox">灯箱</a>统一出货包装。更广的 OEM 范围见<a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a>页面。</p>',
                landing_custom_printed_p1_html: '<p>定制印刷广告帐篷将品牌画面覆盖顶篷、檐口与围布（具体可印区域因型号与缝位而异）。我们按项目确认色稿、材料和配件。</p>',
                landing_custom_printed_p2_html: '<p>技术细节与 OEM 出口说明也可参阅<a href="/zh/seo/custom-printed-canopy-tent-manufacturer-oem-china.html">定制印刷广告帐篷制造商（OEM）</a>专题；现货与型号请在<a href="/zh/all-products.html?cat=tents">全部帐篷 SKU</a>中筛选。</p>',
                landing_event_canopy_p1_html: '<p>展会、市集与户外推广需要快速搭建、易运输的展示空间。折叠广告帐篷配合印刷围布与配重，是常见的现场品牌触点。</p>',
                landing_event_canopy_p2_html: '<p>批发 MOQ 与交期视印刷与季节而定，可参考<a href="/zh/seo/folding-event-tent-supplier-wholesale-moq.html">折叠活动帐篷批发 MOQ</a>专题，或通过<a href="/zh/contact-us.html">询价</a>说明数量与时间表。系列入口：<a href="/zh/canopy-tents.html">广告帐篷总览</a>、<a href="/zh/pop-up-canopy-tents.html">快展广告帐篷</a>、<a href="/zh/product-center.html?cat=tents">帐篷分类总览</a>。</p>',
                landing_event_canopy_trade_show_h2: '展会与博览：重复搭建与品牌曝光',
                landing_event_canopy_trade_show_html:
                    '<p>展会与博览场景通常需要<strong>可重复搭建</strong>的折叠篷结构，并配合顶篷/围布印刷与配件。可从<a href="/zh/canopy-tents.html">广告帐篷总览</a>进入主题集群，或查看<a href="/zh/seo/trade-show-canopy-tent-manufacturer-for-distributors.html">展会帐篷制造商（经销商）</a>专题。</p>',
                landing_event_canopy_outdoor_h2: '市集、路演与户外推广',
                landing_event_canopy_outdoor_html:
                    '<p>户外推广更关注运输、快速展开与现场固定。可参考<a href="/zh/pop-up-canopy-tents.html">快开广告篷</a>与<a href="/zh/seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html">户外广告帐篷 OEM</a>、<a href="/zh/seo/commercial-grade-pop-up-canopy-wholesale-supplier.html">商用级快开篷批发</a>等专题，并结合<a href="/zh/products-accessories.html">围布、配重与收纳</a>。</p>',
                landing_event_canopy_quick_links_html:
                    '延伸阅读：<a href="/zh/pop-up-canopy-tents.html">快开广告篷</a> · <a href="/zh/10x10-pop-up-canopy-tent.html">10×10 规格</a> · <a href="/zh/custom-canopy-tent-manufacturer.html">OEM 制造商</a> · <a href="/zh/aluminum-folding-tent.html">铝架折叠篷</a>',
                landing_event_canopy_trust_h2: '活动项目中的工厂协同',
                landing_event_canopy_trust_html:
                    '<p>WaiKwan 按<strong>展会、市集与户外推广</strong>的常见动线整理框架等级、印刷与配件，便于渠道商与活动公司统一询价与出货包装。需要完整 OEM 条款时，请同步查看 <a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a>。</p>'
                    + '<ul style="margin:0.6rem 0 0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><strong>打样与批量</strong> — MOQ/交期见 <a href="/zh/faq-moq.html">MOQ</a>、<a href="/zh/faq-lead-time.html">交期</a></li>'
                    + '<li><strong>画面与颜色</strong> — <a href="/zh/faq-artwork-files.html">设计稿</a>、<a href="/zh/faq-color-matching.html">配色</a></li>'
                    + '<li><strong>物流方案</strong> — <a href="/zh/faq-shipping.html">出口与运输</a></li>'
                    + '</ul>',
                landing_event_canopy_faq_h2: '活动采购常见问题',
                landing_event_canopy_faq_1_q: '活动篷与快开篷入口怎么选？',
                landing_event_canopy_faq_1_a_html:
                    '<p>可先读 <a href="/zh/canopy-tents.html">广告帐篷总览</a>建立系列概念；需要折叠快开结构时再看 <a href="/zh/pop-up-canopy-tents.html">快开广告篷</a>。</p>',
                landing_event_canopy_faq_2_q: '常见跨度有哪些？',
                landing_event_canopy_faq_2_a_html:
                    '<p>常见包括 <strong>3×3、3×4.5、3×6 m</strong> 及对应的英制表述；北美客户常从 <a href="/zh/10x10-pop-up-canopy-tent.html">10×10</a> 开始比价。</p>',
                landing_event_canopy_faq_3_q: '户外阵风需要哪些加固？',
                landing_event_canopy_faq_3_a_html:
                    '<p>通常需要合适配重、地钉/膨胀固定与围布方案；请在询价中说明场地材质与风况。配件见 <a href="/zh/products-accessories.html">帐篷配件</a>。</p>',
                landing_event_canopy_faq_4_q: '印刷与交期如何预估？',
                landing_event_canopy_faq_4_a_html:
                    '<p>印刷复杂度与面料备货影响排产；请先准备设计稿并参阅 <a href="/zh/faq-artwork-files.html">稿件规范</a>与 <a href="/zh/faq-lead-time.html">交期说明</a>。</p>',

                nav_sub_canopy_hub: '商业广告帐篷总览',
                nav_sub_pop_canopy_tents: '快开广告篷（产品族）',
                nav_sub_canopy_1010: '10×10 快开篷（3×3 m）',

                landing_canopy_hub_h1: '商业广告帐篷 B2B 采购（系列、尺寸与定制印刷）',
                landing_canopy_hub_lead_html:
                    '<p>WaiKwan 为<strong>经销商、活动公司与品牌方</strong>供应折叠广告篷与快开篷：现货框架系列涵盖常见方管铝架/铁架配置（如 30/40/50 方管系列），并支持定制印刷与出口包装。本页为<strong>主题入口</strong>，便于按场景进入子页。</p>',
                landing_canopy_hub_series_html:
                    '<p>在<a href="/zh/all-products.html?cat=tents">帐篷 SKU 目录</a>中可按系列查看具体型号与图片；框架与等级对比可结合<a href="/zh/aluminum-folding-tent.html">铝架折叠篷</a>与<a href="/zh/tent-type.html?type=folding30">铁架现货线</a>。</p>',
                landing_canopy_hub_topics_h2: '按需求进入子主题',
                landing_canopy_hub_topics_html:
                    '<ul style="margin:0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><a href="/zh/pop-up-canopy-tents.html">快开广告篷（折叠）</a> — 通用产品族介绍</li>'
                    + '<li><a href="/zh/10x10-pop-up-canopy-tent.html">10×10（约 3×3 m）快开篷</a> — 常见尺寸询盘入口</li>'
                    + '<li><a href="/zh/aluminum-folding-tent.html">铝架折叠篷与框架等级</a></li>'
                    + '<li><a href="/zh/event-canopy-tents.html">活动与展会广告帐篷</a></li>'
                    + '<li><a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷制造商（OEM/ODM）</a></li>'
                    + '<li><a href="/zh/custom-printed-canopy-tents.html">定制印刷广告篷</a></li>'
                    + '<li><a href="/zh/pop-up-canopy-tent-manufacturer.html">快开广告帐篷制造商</a></li>'
                    + '<li><a href="/zh/product-center.html?cat=tents">帐篷分类总览（产品中心）</a></li>'
                    + '</ul>',
                landing_canopy_hub_faq_h2: '采购常见问题',
                landing_canopy_hub_faq_1_q: '现货与定制如何并行？',
                landing_canopy_hub_faq_1_a_html:
                    '<p>可先选定框架系列与尺寸，再确认顶篷/围布印刷与配件；具体以报价单与规格书为准。</p>',
                landing_canopy_hub_faq_2_q: '出口包装与交期怎么确认？',
                landing_canopy_hub_faq_2_a_html:
                    '<p>请在询价中说明目的港、货量与希望交货窗口；详见<a href="/zh/faq-lead-time.html">交期</a>与<a href="/zh/faq-shipping.html">物流</a>说明。</p>',
                landing_canopy_hub_faq_3_q: '设计稿与配色要求？',
                landing_canopy_hub_faq_3_a_html:
                    '<p>请参阅<a href="/zh/faq-artwork-files.html">设计稿规范</a>与<a href="/zh/faq-color-matching.html">配色与面料</a>。</p>',
                landing_canopy_hub_faq_4_q: '户外使用需要哪些配件与固定方式？',
                landing_canopy_hub_faq_4_a_html:
                    '<p>常见配置包括围布、沙袋/配重与地钉；收纳可用拖轮包。具体风载与场地要求请在询价中说明，便于匹配型号与加固方案。详见<a href="/zh/products-accessories.html">帐篷配件</a>。</p>',
                landing_canopy_hub_faq_5_q: '10×10（约 3×3 m）在铁架与铝架方案里都有吗？',
                landing_canopy_hub_faq_5_a_html:
                    '<p>该尺寸是常见询盘规格；具体可用系列取决于当期库存与定制印刷范围。建议从<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开篷</a>与<a href="/zh/aluminum-folding-tent.html">铝架折叠篷</a>对照框架等级。</p>',
                landing_canopy_hub_faq_6_q: '补单时如何确认框架系列一致？',
                landing_canopy_hub_faq_6_a_html:
                    '<p>请提供历史订单号、型号或框架截面/连接件照片，以便核对与现货 30/40/50 方管系列的接口是否一致，避免顶篷与围布不匹配。</p>',

                landing_canopy_hub_trust_h2: '工厂直供与 B2B 协同',
                landing_canopy_hub_trust_html:
                    '<p>WaiKwan（伟群帐篷）自 2010 年起面向出口组织折叠广告篷生产：金属与篷面协同、印刷工艺与包装标识可在同一项目流程内确认。</p>'
                    + '<ul style="margin:0.6rem 0 0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><strong>源头工厂</strong> — 折叠框架与组装产线配套，便于交期与批次一致</li>'
                    + '<li><strong>OEM / ODM</strong> — 顶篷/围布印刷、配件组合与中性或定制外箱</li>'
                    + '<li><strong>出口经验</strong> — 海运/空运/快递；可提供基础装箱与单据配合</li>'
                    + '<li><strong>快速报价</strong> — 规格清晰时通常在约 24 小时内回复询盘</li>'
                    + '</ul>',
                landing_canopy_hub_sizes_h2: '常见尺寸与公制对照',
                landing_canopy_hub_sizes_html:
                    '<p>现货与项目订单中常见的折叠篷跨度包括 <strong>3×3 m、3×4.5 m、3×6 m</strong> 等；北美市场也常按 <strong>10×10 ft、10×15 ft、10×20 ft</strong> 理解展位占地。入门对比可从 <a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开篷</a>与 <a href="/zh/tent-type.html?type=folding40">3×3 / 3×4.5 / 3×6 m 框架</a>开始，完整 SKU 见 <a href="/zh/product-center.html?cat=tents">现货帐篷尺寸表</a>。</p>',
                landing_canopy_hub_frames_h2: '框架等级：30 / 40 / 50 方管系列与铝架线',
                landing_canopy_hub_frames_html:
                    '<p>目录中的<strong>方管系列</strong>（如 30/40/50）通常对应不同的壁厚与连接强度，适合从促销陈列到更频繁拆装场景做梯度选择。经济型铁架现货可参阅 <a href="/zh/tent-type.html?type=folding30">folding30 铁架线</a>；更高等级或铝型材方案可对照 <a href="/zh/aluminum-folding-tent.html">铝架折叠篷</a>。需要与快开篷族对照时，可同步阅读 <a href="/zh/pop-up-canopy-tents.html">快开广告篷</a>。</p>',
                landing_canopy_hub_print_h2: '印刷与定制画面',
                landing_canopy_hub_print_html:
                    '<p>顶篷、檐口与围布可在可缝位与张力允许范围内做品牌满幅或局部印刷；具体可印区域随型号与缝位变化。提交生产前请按 <a href="/zh/faq-artwork-files.html">设计稿规范</a>与 <a href="/zh/faq-color-matching.html">配色与面料</a>确认；更多尺寸组合亦见 <a href="/zh/custom-printed-canopy-tents.html">定制印刷广告篷</a>。</p>',
                landing_canopy_hub_uses_h2: '典型应用场景',
                landing_canopy_hub_uses_html:
                    '<p><strong>展会与博览</strong>强调重复搭建与品牌一致性，可结合 <a href="/zh/event-canopy-tents.html">活动与展会广告帐篷</a>与 <a href="/zh/seo/trade-show-canopy-tent-manufacturer-for-distributors.html">展会帐篷（经销商）</a>专题。<strong>市集、路演与户外推广</strong>更关注运输与快速展开，可参阅 <a href="/zh/seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html">户外广告帐篷 OEM</a>。</p>',
                landing_canopy_hub_accessories_h2: '围布、配重、收纳与配件',
                landing_canopy_hub_accessories_html:
                    '<p>完整项目通常包含围布、沙袋或水座等配重、地钉及拖轮包等收纳件。请在 BOM 里写清场地类型（草地、水泥、展馆内外）。选购入口：<a href="/zh/products-accessories.html">帐篷与展示配件</a>。</p>',
                landing_canopy_hub_sourcing_h2: 'MOQ、交期、包装与物流',
                landing_canopy_hub_sourcing_html:
                    '<p>起订量与交期随印刷工艺、面料备货与季节排产变化。建议先读 <a href="/zh/faq-moq.html">MOQ</a>、<a href="/zh/faq-lead-time.html">交期</a>、<a href="/zh/faq-shipping.html">物流</a>，批量大宗场景可参考 <a href="/zh/seo/folding-event-tent-supplier-wholesale-moq.html">折叠活动帐篷批发 MOQ</a>。询价时请附目的港与希望交货窗口。</p>',
                landing_canopy_hub_oem_h2: '何时对接 OEM / 制造商页面',
                landing_canopy_hub_oem_html:
                    '<p>若您需要<strong>项目级条款、验货与出口单证协同</strong>，请并行查看 <a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a>与 <a href="/zh/pop-up-canopy-tent-manufacturer.html">快开广告帐篷制造商</a>，以便对齐打样、批量与包装方案。</p>',
                landing_canopy_hub_mid_cta_html:
                    '<p class="wk-disclaimer" style="margin:0;text-align:center;">需要对比 30/40/50 系列与印刷范围时，请直接附目标尺寸、数量与交货国别，便于一次报价。</p>',

                landing_pop_canopy_hub_h1: '快开广告篷（折叠）— 商业用途',
                landing_pop_canopy_hub_lead_html:
                    '<p><strong>快开广告篷</strong>指可快速展开与收起的折叠框架帐篷，顶篷与围布可印刷，广泛用于展会、促销与户外活动。若您需要<strong>工厂 OEM/ODM 与出口条款</strong>的深入说明，请同时查看<a href="/zh/pop-up-canopy-tent-manufacturer.html">快开广告帐篷制造商</a>页面。</p>',
                landing_pop_canopy_hub_body_html:
                    '<p>尺寸与配件选择可参考<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开篷</a>、<a href="/zh/tent-type.html?type=folding40">3×3 / 3×4.5 / 3×6 m 框架</a>；框架等级见<a href="/zh/aluminum-folding-tent.html">铝架折叠篷</a>。全套主题入口：<a href="/zh/canopy-tents.html">广告帐篷总览</a>。</p>',
                landing_pop_canopy_hub_faq_h2: '常见问答',
                landing_pop_canopy_hub_faq_1_q: '快开篷与定制制造商页面有何区别？',
                landing_pop_canopy_hub_faq_1_a_html:
                    '<p>本页侧重<strong>产品族与采购理解</strong>；制造商页侧重<strong>OEM 条款、出口与项目对接</strong>。</p>',
                landing_pop_canopy_hub_faq_2_q: '能否单独补围布或顶篷？',
                landing_pop_canopy_hub_faq_2_a_html:
                    '<p>在框架系列一致的前提下通常可以；请提供历史订单或型号以便核对接口。</p>',
                landing_pop_canopy_hub_faq_3_q: '快开篷与「广告帐篷总览」页面如何分工？',
                landing_pop_canopy_hub_faq_3_a_html:
                    '<p><a href="/zh/canopy-tents.html">广告帐篷总览</a>覆盖折叠篷与现货系列的<strong>整体采购路径</strong>；本页聚焦<strong>快开折叠结构</strong>这一产品族及其常见配置。</p>',
                landing_pop_canopy_hub_faq_4_q: '哪些尺寸最适合先打样？',
                landing_pop_canopy_hub_faq_4_a_html:
                    '<p><strong>3×3 m（约 10×10 ft）</strong>是最常见的打样与比价规格；亦可并行评估 <a href="/zh/tent-type.html?type=folding40">3×4.5 / 3×6 m</a>。详见 <a href="/zh/10x10-pop-up-canopy-tent.html">10×10 专题</a>。</p>',
                landing_pop_canopy_hub_faq_5_q: '印刷与交期从哪里了解细则？',
                landing_pop_canopy_hub_faq_5_a_html:
                    '<p>画面与颜色准备请读 <a href="/zh/faq-artwork-files.html">设计稿</a>与 <a href="/zh/faq-color-matching.html">配色</a>；排产与物流见 <a href="/zh/faq-lead-time.html">交期</a>、<a href="/zh/faq-shipping.html">物流</a>。</p>',

                landing_pop_canopy_hub_cluster_h2: '与相邻主题页交叉阅读',
                landing_pop_canopy_hub_cluster_html:
                    '<ul style="margin:0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><a href="/zh/canopy-tents.html">广告帐篷总览</a> — 系列与采购路径</li>'
                    + '<li><a href="/zh/10x10-pop-up-canopy-tent.html">10×10（3×3 m）快开篷</a></li>'
                    + '<li><a href="/zh/custom-canopy-tent-manufacturer.html">定制制造商（OEM/ODM）</a></li>'
                    + '<li><a href="/zh/event-canopy-tents.html">活动与展会篷</a></li>'
                    + '<li><a href="/zh/faq-moq.html">MOQ</a> · <a href="/zh/faq-lead-time.html">交期</a></li>'
                    + '</ul>',
                landing_pop_canopy_hub_more_h2: '尺寸、框架与配件：采购清单提示',
                landing_pop_canopy_hub_more_html:
                    '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">尺寸与跨度</h3>'
                    + '<p style="margin:0 0 0.6rem;">快开篷常见跨度包含 <strong>3×3、3×4.5、3×6 m</strong>，并与 <strong>10×10 ft</strong> 等英制表述交叉使用。目录入口：<a href="/zh/all-products.html?cat=tents">帐篷 SKU</a>。</p>'
                    + '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">框架与等级</h3>'
                    + '<p style="margin:0 0 0.6rem;">方管系列（如 <strong>30/40/50</strong>）与铝架方案适用于不同承重与拆装频次；对比 <a href="/zh/tent-type.html?type=folding30">铁架现货</a> 与 <a href="/zh/aluminum-folding-tent.html">铝架线</a>。</p>'
                    + '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">印刷与围布</h3>'
                    + '<p style="margin:0 0 0.6rem;">顶篷、檐口与围布可按项目做品牌画面；可印区域因型号而异。延伸：<a href="/zh/custom-printed-canopy-tents.html">定制印刷篷</a>。</p>'
                    + '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">配件与出口</h3>'
                    + '<p style="margin:0;">配重、地钉、拖轮包与出口包装可在同一询价单内确认；配件见 <a href="/zh/products-accessories.html">配件目录</a>。</p>',
                landing_pop_canopy_hub_trust_h2: '工厂协同与报价',
                landing_pop_canopy_hub_trust_html:
                    '<p>我们按 B2B 项目整理规格书与包装说明，便于分销商与活动公司直接落地执行。需要<strong>制造商条款与 OEM 流程</strong>时，请同时打开 <a href="/zh/pop-up-canopy-tent-manufacturer.html">快开广告帐篷制造商</a>。</p>',
                landing_pop_canopy_hub_mid_cta_html:
                    '<p class="wk-disclaimer" style="margin:0;text-align:center;">附框架系列目标、数量与印刷稿阶段，可加快打样与正式订单衔接。</p>',

                landing_1010_hub_cluster_h2: '广告帐篷主题集群',
                landing_1010_hub_cluster_html:
                    '<p>若您仍在比较方案，可从<a href="/zh/canopy-tents.html">广告帐篷总览</a>或<a href="/zh/pop-up-canopy-tents.html">快开广告篷</a>进入；框架细节见<a href="/zh/aluminum-folding-tent.html">铝架折叠篷</a>，OEM 见<a href="/zh/custom-canopy-tent-manufacturer.html">定制制造商</a>。</p>',

                home_trusted_by_title: '合作客户',
                home_trusted_by_subtitle: '服务全球品牌、经销商与项目客户（示意）。',

                home_trusted_badge_1: 'OEM 合作伙伴',
                home_trusted_badge_2: '活动品牌',
                home_trusted_badge_3: '经销商渠道',
                home_trusted_badge_4: '零售门店',
                home_trusted_badge_5: '赛事团队',
                home_trusted_badge_6: '展会搭建',
                home_trusted_badge_7: '广告印刷',
                home_trusted_badge_8: '项目采购',
                home_trusted_badge_9: '政府/机构',
                home_trusted_badge_10: '跨境电商',

                home_best_sellers_title: '畅销产品',
                home_best_sellers_subtitle: '基于现有数据集规则自动推荐（可按需调整）。',
                home_best_sellers_empty: '暂无可展示的产品。',
                home_view_all_products: '查看全部产品',

                home_factory_title: '制造实力与能力',
                home_factory_subtitle: 'OEM/ODM 源头工厂：从工程协同、印刷落地到品控与出口单证，一站式支持 B2B 项目交付。',
                home_factory_f1_title: '产能与交付',
                home_factory_f1_desc: '广告帐篷、旗帜与展陈构件的多品类协同排产，支持批量与加急窗口。',
                home_factory_f2_title: '印刷与定制',
                home_factory_f2_desc: '热转印/热升华等工艺与面料匹配，稿件规范与品牌色协同。',
                home_factory_f3_title: '品控与一致性',
                home_factory_f3_desc: '出货前检查框架、缝位与配件配合，便于出口装柜与现场复装。',
                home_factory_f4_title: '出口与交付支持',
                home_factory_f4_desc: '唛头、装箱清单与商业发票协同，协助安排海运/空运/快递方案。',

                home_why_title: '为什么选择我们',
                home_why_subtitle: '面向 B2B 客户的制造与交付能力，覆盖从打样到批量的全流程。',
                home_why_f1_title: 'OEM / ODM 能力',
                home_why_f1_desc: '支持结构、尺寸与品牌系统定制，适配不同渠道与项目需求。',
                home_why_f2_title: '印刷与颜色控制',
                home_why_f2_desc: '多工艺印刷与打样确认，确保画面清晰与批次一致性。',
                home_why_f3_title: '交期与排产',
                home_why_f3_desc: '标准化流程与产能配置，适配紧急项目与批量订单。',
                home_why_f4_title: '全球发货支持',
                home_why_f4_desc: '稳定包装与装箱规范，支持海运/空运/快递等运输方案。',

                home_social_export_title: '面向出口的交付经验',
                home_social_export_desc: '熟悉国际项目常见包装、运输与沟通流程，便于跨境协作。',
                home_social_clients_title: '多类型客户合作',
                home_social_clients_desc: '服务品牌方、经销商、活动公司、展会搭建与项目采购客户。',

                home_stat_years_value: '15+',
                home_stat_years_label: '年制造经验',
                home_stat_clients_value: '500+',
                home_stat_clients_label: '全球客户',
                home_stat_models_value: '200+',
                home_stat_models_label: '产品型号',

                home_resources_title: '资料与常见问题',
                home_resources_subtitle: '快速了解定制流程、印刷文件与交付方式。',
                home_resource_cta: '查看详情',
                home_resource_1_title: 'MOQ 与交期',
                home_resource_1_desc: '不同产品与工艺的起订量与交期说明。',
                home_resource_2_title: '印刷与材质',
                home_resource_2_desc: '常用布料、工艺与颜色控制要点。',
                home_resource_3_title: '物流与包装',
                home_resource_3_desc: '海运/空运/快递方案与装箱规范。',
                home_resource_4_title: '设计文件',
                home_resource_4_desc: '支持的文件格式与制作注意事项。',

                home_faq_1_q: '起订量（MOQ）是多少？',
                home_faq_1_a: '不同产品与工艺的 MOQ 不同。请提交需求，我们将提供对应 MOQ 与报价。',
                home_faq_2_q: '支持哪些印刷工艺？',
                home_faq_2_a: '支持数码印刷、丝网印刷、热转印等，具体以材质与数量为准。',
                home_faq_3_q: '支持哪些发货方式？',
                home_faq_3_a: '支持海运/空运/快递等方式，可按交期与预算建议方案。',
                home_faq_4_q: '需要提供什么设计文件？',
                home_faq_4_a: '建议提供 AI/PDF/EPS 等矢量文件；如仅有图片也可协助排版确认。',

                home_cta_title: '准备开始您的项目？',
                home_cta_subtitle: '告诉我们产品类型、尺寸、数量与印刷需求，我们会尽快回复。',
                /* Site-wide CTA hierarchy: primary = quote, secondary = catalog, WhatsApp = support */
                cta_primary: '获取报价',
                cta_secondary: '查看产品',
                footer_whatsapp_support: 'WhatsApp',
                home_cta_primary: '获取报价',
                home_cta_secondary: '查看产品',

                home_sticky_quote: '获取报价',

                // Homepage — Guides & Buyer Resources (SEO blocks)
                nav_buyer_resources: '采购资源',
                home_core_partner_intro_html:
                    '寻找工厂合作？帐篷主题：<a href="canopy-tents.html">广告帐篷总览</a>、'
                    + '<a href="pop-up-canopy-tents.html">快开广告篷</a>；制造与 OEM：<a href="custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a>。'
                    + '配套：<a href="beach-flag-supplier.html">沙滩旗</a>、'
                    + '<a href="portable-display-systems.html">便携展示系统</a>。'
                    + '新买家建议先读 <a href="faq.html">MOQ / 设计稿 / 物流</a>。',
                home_fast_start_html:
                    '快速开始：将尺寸、数量、设计稿发给我们即可获取报价；或查阅指南：'
                    + '<a href="faq-moq.html">起订量（MOQ）</a>、'
                    + '<a href="faq-artwork-files.html">设计稿文件</a>、'
                    + '<a href="faq-shipping.html">物流方式</a>。'
                    + ' 帐篷专题：'
                    + '<a href="custom-canopy-tent-manufacturer.html">定制广告帐篷</a>、'
                    + '<a href="aluminum-folding-tent.html">快开广告帐篷（铝架）</a>、'
                    + '<a href="10x10-pop-up-canopy-tent.html">10×10 快开广告帐篷</a>。',
                home_guides_title: '采购指南',
                home_guides_subtitle:
                    '面向经销商与采购团队的 OEM/ODM、出口包装与产品规格等简短说明。',
                home_guide_read_cta: '阅读指南',
                home_guide_1_title: 'SEG 卡布灯箱制造商（B2B 定制尺寸）',
                home_guide_1_desc: '铝型材、背光软膜与 LED 模组，适用于零售、展会与批发项目。',
                home_guide_2_title: '定制印刷广告帐篷制造商（中国 OEM）',
                home_guide_2_desc: '折叠框架、品牌顶篷、批量起订与出口包装，服务经销商与品牌方。',
                home_guide_3_title: '便携式展会背景墙（出口）',
                home_guide_3_desc: '可折叠框架、印刷画面与出口纸箱，便于经销商全球发货。',
                home_guide_4_title: '铝合金折叠帐篷（工厂直供出口）',
                home_guide_4_desc: '轻质六角管型材、品牌篷布与围布，配套收纳袋与 OEM 包装。',
                home_guide_5_title: '活动羽毛旗印刷（工厂直供）',
                home_guide_5_desc: '涤纶热升华、旗杆套装与底座，面向活动公司与批发客户。',
                home_guide_6_title: '重型活动帐篷（欧洲线发货）',
                home_guide_6_desc: '加强框架、顶篷与围布，出口包装适配欧盟目的地。',
                home_guide_7_title: '模块化展览展示器材（ODM）',
                home_guide_7_desc: '铝型材、连接件与布艺或板材填充，服务展台搭建商与经销商。',
                home_guide_8_title: '张拉布展示墙（展会 OEM）',
                home_guide_8_desc: '铝架、SEG 或枕套画面与便携包，面向展商与批发客户。',
                home_guides_view_all: '查看全部指南',
                home_guides_footer_html:
                    '浏览：<a href="product-center.html">产品中心</a> · '
                    + '<a href="all-products.html">全部产品</a> · '
                    + '<a href="all-products.html?cat=lightbox">灯箱系列</a> · '
                    + '<a href="all-products.html?cat=tents">广告帐篷</a> · '
                    + '<a href="news/index.html">新闻</a> · '
                    + '<a href="site-map.html">站点地图</a>',

                home_buyer_title: '采购资源',
                home_buyer_subtitle:
                    '快速了解起订量、交期、设计稿、配色与物流；并提供关键词落地页，便于匹配供应商。',
                home_br_1_title: 'SEG 卡布灯箱制造商',
                home_br_1_desc: 'SEG 框架、布艺灯箱与背光系统 — 工厂直供。',
                home_br_2_title: '张拉布背景墙',
                home_br_2_desc: '展会布艺背景：直型、弧型与模块化张拉系统。',
                home_br_3_title: '铝合金折叠帐篷',
                home_br_3_desc: '加强铝架、防水顶篷与定制印刷。',
                home_br_4_title: '定制广告帐篷制造商',
                home_br_4_desc: 'OEM/ODM 广告帐篷，起订量与交期，出口支持。',
                home_br_5_title: '沙滩旗供应商',
                home_br_5_desc: '羽毛旗/水滴旗与旗杆、底座及印刷说明。',
                home_br_6_title: '便携式展示系统',
                home_br_6_desc: '展会展示、前台、易拉宝与套装。',
                home_br_7_title: '买家常见问题',
                home_br_7_desc: '起订量、设计稿、配色与物流等说明。',
                pc_seo_sourcing_label: '采购指南： ',
                pc_seo_sourcing_link_1: '经销商贸易展篷房',
                pc_seo_sourcing_link_2: '批发羽毛旗与水滴旗',
                pc_seo_sourcing_link_3: '张拉布展示墙（OEM）',
                pc_seo_sourcing_link_4: '全部 B2B 指南',
                pc_seo_catalog_label: '目录入口： ',
                pc_seo_catalog_link_1: '全部产品（搜索与筛选）',
                pc_seo_catalog_link_2: '公司新闻',
                pc_seo_catalog_link_3: '网站地图',
                home_buyer_btn_moq: '从起订量开始',
                home_buyer_seo_links_html:
                    '<a href="seg-light-box-manufacturer.html" style="color: var(--wk-red-700); font-weight: 600;">SEG 卡布灯箱制造商</a>'
                    + '<a href="tension-fabric-backwall.html" style="color: var(--wk-red-700); font-weight: 600;">张拉布背景墙</a>'
                    + '<a href="aluminum-folding-tent.html" style="color: var(--wk-red-700); font-weight: 600;">铝合金折叠帐篷</a>'
                    + '<a href="product-center.html?cat=tents" style="color: var(--wk-red-700); font-weight: 600;">定制广告帐篷制造商</a>'
                    + '<a href="product-center.html?cat=flags" style="color: var(--wk-red-700); font-weight: 600;">沙滩旗与羽毛旗系统</a>'
                    + '<a href="product-center.html?cat=displays" style="color: var(--wk-red-700); font-weight: 600;">便携式展示与展会背景墙</a>'
                    + '<a href="products-accessories.html" style="color: var(--wk-red-700); font-weight: 600;">帐篷与展示配件</a>'
                    + '<a href="all-products.html" style="color: var(--wk-red-700); font-weight: 600;">全部产品目录</a>'
                    + '<a href="seo/trade-show-canopy-tent-manufacturer-for-distributors.html" style="color: var(--wk-red-700); font-weight: 600;">展会帐篷采购（B2B）</a>'
                    + '<a href="seo/beach-flag-manufacturer-wholesale-feather-teardrop-flags.html" style="color: var(--wk-red-700); font-weight: 600;">沙滩旗批发制造</a>'
                    + '<a href="seo/tension-fabric-display-wall-manufacturer-oem-trade-show.html" style="color: var(--wk-red-700); font-weight: 600;">OEM 张拉布展示</a>'
                    + '<a href="site-map.html#seo-guides" style="color: var(--wk-red-700); font-weight: 600;">更多 B2B 采购指南</a>',

                home_shop_by_size_title: '按帐篷尺寸选购',
                home_shop_by_size_items_html:
                    '<a href="canopy-tents.html">商业广告帐篷总览</a> · <a href="pop-up-canopy-tents.html">快开广告篷</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 快开广告帐篷</a> · <a href="custom-printed-canopy-tents.html">定制印刷尺寸方案</a> · '
                    + '<a href="product-center.html?cat=tents">现货帐篷尺寸表</a> · <a href="tent-type.html?type=folding40">3×3 / 3×4.5 / 3×6 m 框架</a>',
                home_shop_by_material_title: '按框架与面料选购',
                home_shop_by_material_items_html:
                    '<a href="aluminum-folding-tent.html">铝合金折叠帐篷</a> · <a href="pop-up-canopy-tents.html">快开篷（框架与篷面）</a> · <a href="custom-canopy-tent-manufacturer.html">铁架 / OEM 框架方案</a> · '
                    + '<a href="faq-color-matching.html">面料克重与配色</a>',
                home_shop_by_use_title: '按使用场景选购',
                home_shop_by_use_items_html:
                    '<a href="event-canopy-tents.html">活动与展会篷房</a> · <a href="seo/commercial-grade-pop-up-canopy-wholesale-supplier.html">商用级快开篷</a> · <a href="seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html">户外推广帐篷</a> · '
                    + '<a href="custom-canopy-tent-manufacturer.html">品牌与 OEM 篷房</a> · <a href="products-accessories.html">围布、配重与收纳包</a>',
                home_flag_shapes_title: '沙滩旗形状与画面',
                home_flag_shapes_items_html:
                    '<a href="beach-flag-supplier.html">羽毛旗 / 水滴旗</a> · <a href="flag-type.html?type=fiberglass_pole">方形广告旗方案</a> · '
                    + '<a href="product-center.html?cat=flags">旗帜类目总览</a>',
                home_flag_hardware_title: '旗杆、底座与配件',
                home_flag_hardware_items_html:
                    '<a href="flag-type.html?type=fiberglass_pole">玻纤杆系统</a> · <a href="flag-type.html?type=alu_fiberglass_pole">铝杆 + 玻纤组合</a> · <a href="flag-type.html?type=flag_bases_accessories">十字座、地插与注水底座</a> · '
                    + '<a href="products-accessories.html">替换件与收纳</a>',
                home_display_modules_title: '展示系统模块',
                home_display_modules_items_html:
                    '<a href="pop-up-display-stands.html">快幕秀 / 拉网展架</a> · <a href="tension-fabric-backwall.html">张拉布背景墙</a> · '
                    + '<a href="seg-light-box-manufacturer.html">SEG 卡布灯箱</a> · <a href="portable-display-systems.html">前台与易拉宝</a>',
                home_buyer_faq_links_html:
                    '常见采购问题：<a href="faq-moq.html">起订量 MOQ</a> · <a href="faq-lead-time.html">交期</a> · <a href="faq-artwork-files.html">设计稿</a> · '
                    + '<a href="faq-shipping.html">物流</a> · <a href="faq-color-matching.html">配色</a>',
                home_pillar_keywords_html:
                    '重点落地页：<a href="canopy-tents.html">广告帐篷总览</a> · <a href="pop-up-canopy-tents.html">快开广告篷</a> · <a href="custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 快开帐篷</a> · '
                    + '<a href="aluminum-folding-tent.html">铝合金折叠帐篷</a> · <a href="beach-flag-supplier.html">沙滩旗供应商</a> · '
                    + '<a href="portable-display-systems.html">便携展示系统</a> · <a href="pop-up-display-stands.html">快幕秀展架</a> · '
                    + '<a href="tension-fabric-backwall.html">张拉布背景墙</a> · <a href="seg-light-box-manufacturer.html">SEG 灯箱制造商</a>',
                pc_intro_tents: '从现货 30/40/50 方管与铝架系列到全定制印刷，服务展会、活动与渠道批发。',
                pc_intro_flags: '羽毛旗、水滴旗与广告旗杆系统，配套底座、收纳与出口包装。',
                pc_intro_displays: '快幕秀、张拉布、SEG 灯箱与促销前台，覆盖展会与品牌推广搭建。',
                pc_seo_links_tents_html:
                    '<a href="canopy-tents.html">广告帐篷总览</a> · <a href="pop-up-canopy-tents.html">快开广告篷</a> · <a href="custom-canopy-tent-manufacturer.html">定制帐篷制造商</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 帐篷</a> · '
                    + '<a href="aluminum-folding-tent.html">铝架帐篷</a> · <a href="event-canopy-tents.html">活动篷房</a> · '
                    + '<a href="seo/trade-show-canopy-tent-manufacturer-for-distributors.html">展会帐篷</a> · <a href="products-accessories.html">帐篷配件</a>',
                pc_seo_links_flags_html:
                    '<a href="flag-type.html?type=fiberglass_pole">羽毛 / 水滴旗杆</a> · <a href="flag-type.html?type=alu_fiberglass_pole">铝杆套装</a> · '
                    + '<a href="flag-type.html?type=flag_bases_accessories">替换底座</a> · <a href="beach-flag-supplier.html">沙滩旗专题</a>',
                pc_seo_links_displays_html:
                    '<a href="pop-up-display-stands.html">快幕秀展架</a> · <a href="tension-fabric-backwall.html">张拉布背景墙</a> · '
                    + '<a href="seg-light-box-manufacturer.html">SEG 灯箱</a> · <a href="portable-display-systems.html">便携展示系统</a> · '
                    + '<a href="product-center.html?cat=displays">展示类目</a> · <a href="seo/portable-trade-show-booth-backdrop-manufacturer-export.html">展会背景墙</a>',
                seo_tent_topic_strip_title: '帐篷主题入口',
                seo_tent_topic_strip_p_html:
                    '<a href="../canopy-tents.html">广告帐篷总览</a> · <a href="../pop-up-canopy-tents.html">快开广告篷</a> · '
                    + '<a href="../product-center.html?cat=tents">帐篷分类（产品中心）</a>',
                pc_tent_accessories_desc: '围布、配重、拖轮包、连接件与帐篷配套五金。',
                pc_tent_replacement_desc: '顶篷、框架件、备件与现场维修替换方案。',
                breadcrumb_product_center: '产品中心',

                faq_context_tent_cluster_html:
                    '<p class="wk-disclaimer" style="margin:0 0 1rem;line-height:1.6;font-size:0.95rem;">帐篷类采购入口：<a href="/zh/canopy-tents.html">广告帐篷总览</a> · <a href="/zh/pop-up-canopy-tents.html">快开广告篷</a> · <a href="/zh/event-canopy-tents.html">活动与展会篷</a> · <a href="/zh/custom-canopy-tent-manufacturer.html">定制制造商（OEM）</a></p>',

                landing_canopy_plan_program_h2: '规划广告篷方案：尺寸、框架、配件',
                landing_canopy_plan_program_html:
                    '<p style="margin:0;line-height:1.65;font-size:0.95rem;color:rgba(31,45,61,.88);">'
                    + '<strong>主题入口：</strong><a href="/zh/canopy-tents.html">广告帐篷总览</a>、'
                    + '<a href="/zh/pop-up-canopy-tents.html">快开广告篷</a>。'
                    + '<strong>按尺寸：</strong><a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开篷</a>、'
                    + '<a href="/zh/product-center.html?cat=tents">现货尺寸表</a>、'
                    + '<a href="/zh/custom-printed-canopy-tents.html">定制印刷尺寸</a>。'
                    + '<strong>框架：</strong><a href="/zh/aluminum-folding-tent.html">铝架折叠篷</a>、'
                    + '<a href="/zh/tent-type.html?type=folding30">铁架现货线</a>。'
                    + '<strong>场景：</strong><a href="/zh/event-canopy-tents.html">活动与展会篷</a>、'
                    + '<a href="/zh/seo/trade-show-canopy-tent-manufacturer-for-distributors.html">展会帐篷采购</a>。'
                    + '<strong>支持与 FAQ：</strong><a href="/zh/products-accessories.html">围布与配重</a> · '
                    + '<a href="/zh/faq-moq.html">MOQ</a> · <a href="/zh/faq-lead-time.html">交期</a> · '
                    + '<a href="/zh/faq-artwork-files.html">设计稿</a> · <a href="/zh/faq-shipping.html">物流</a>。'
                    + '</p>',

                landing_canopy_tent_cluster_h2: '相关帐篷与系列入口',
                landing_canopy_tent_cluster_html:
                    '<p style="margin:0;line-height:1.65;">'
                    + '<a href="/zh/tent-type.html">折叠广告帐篷类型</a>（30/40/50）· '
                    + '<a href="/zh/product-center.html?cat=tents">产品中心—帐篷</a> · '
                    + '<a href="/zh/all-products.html?cat=tents">全部帐篷</a> · '
                    + '<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 与 3×3 m</a>。'
                    + '</p>',

                // Landing: custom-canopy-tent-manufacturer.html
                landing_top_bar_canopy: '源头工厂 · OEM/ODM · 24 小时内回复',
                landing_canopy_h1: '定制广告帐篷制造商',
                landing_canopy_lead: 'OEM/ODM 印刷折叠帐篷、活动篷房与配件 — 中国工厂直供，面向全球出口。',
                landing_canopy_card_range_t: '产品线',
                landing_canopy_card_range_d: '折叠广告帐篷、加强框架、定制顶篷/围布、遮阳与配件。',
                landing_canopy_card_moq_t: '起订量（MOQ）',
                landing_canopy_card_moq_d: '视型号与工艺灵活起订（常见样品 1–5 套，批量 10 套起）。',
                landing_canopy_card_lead_t: '交期',
                landing_canopy_card_lead_d: '设计确认后通常生产 7–15 天，可加急。',
                landing_canopy_card_export_t: '出口支持',
                landing_canopy_card_export_d: '出口包装、HS 归类协助，海运/空运/快递至欧美澳等。',
                landing_canopy_btn_wa: 'WhatsApp',
                landing_canopy_btn_browse: '浏览帐篷产品',
                landing_canopy_contact_line_html:
                    '联系：<a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp：'
                    + '<a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a> · 微信：massifmyth',
                landing_canopy_popular_h2: '热门定制选项',
                landing_canopy_popular_sub: '请告知尺寸、框架等级、印刷需求与目标市场，我们将推荐合适方案。',
                landing_canopy_popular_note_html:
                    '加强框架：<a href="aluminum-folding-tent.html">铝合金折叠帐篷</a> · 背光展示：'
                    + '<a href="seg-light-box-manufacturer.html">SEG 卡布灯箱</a> · 布艺背景：'
                    + '<a href="tension-fabric-backwall.html">张拉布背景墙</a>。延伸阅读：'
                    + '<a href="seo/custom-printed-canopy-tent-manufacturer-oem-china.html">中国 OEM 定制印刷帐篷</a> · '
                    + '<a href="seo/folding-event-tent-supplier-wholesale-moq.html">折叠活动帐篷批发 MOQ</a> · '
                    + '<a href="site-map.html#seo-guides">更多 B2B 指南</a>。',
                landing_canopy_opt_size_t: '尺寸',
                landing_canopy_opt_size_d: '10×10 ft、10×15 ft、10×20 ft（及公制尺寸），支持定制。',
                landing_canopy_opt_frame_t: '框架',
                landing_canopy_opt_frame_d: '铝架或钢架；轻量、加强、抗风等可选。',
                landing_canopy_opt_print_t: '印刷',
                landing_canopy_opt_print_d: '全彩 CMYK，单面/双面，顶篷与围布；抗 UV 面料。',
                landing_canopy_opt_acc_t: '配件',
                landing_canopy_opt_acc_d: '沙袋、地钉、滚轮包、LED、遮阳、连接水槽等。',
                landing_canopy_faq_h2: '采购常见问题（推荐）',
                landing_canopy_faq_sub: '帮助团队更快确认规格，减少设计稿与物流差错。',
                landing_canopy_faq_moq_q: '起订量是多少？',
                landing_canopy_faq_moq_d: '按型号/印刷区分，样品政策与小额试单说明。',
                landing_canopy_faq_lead_q: '交期多久？',
                landing_canopy_faq_lead_d: '常规生产周期及影响发货的因素。',
                landing_canopy_faq_art_q: '需要哪些设计稿？',
                landing_canopy_faq_art_d: 'AI/PDF 规范、出血、字体与色彩配置。',
                landing_canopy_faq_view_all: '查看全部常见问题',

                page_title_canopy_b2b: '定制广告帐篷制造商｜快开广告帐篷与 LOGO 篷房｜伟群帐篷',
                landing_canopy_b2b_h1: '定制广告帐篷制造商',
                landing_canopy_b2b_lead_html:
                    '工厂直供<strong>定制广告帐篷</strong>与<strong>全彩印刷帐篷</strong>，服务分销商、活动公司与品牌方。建议先读 <a href="/zh/canopy-tents.html">广告帐篷总览</a> 与 <a href="/zh/pop-up-canopy-tents.html">快开广告篷</a>，再在 <a href="/zh/product-center.html?cat=tents">帐篷分类</a> 中筛选具体 SKU，支持 OEM 画面与出口包装。',
                landing_canopy_b2b_p1_html:
                    '<p>伟群生产用于专业场景的<strong>折叠广告帐篷</strong>与<strong>活动印刷帐篷</strong>——适用于展会、促销、赛事与户外推广。作为<strong>OEM 广告帐篷制造商</strong>，我们按项目匹配框架系列（铝材或钢材）、篷布画面与配件；无论是紧凑型 3×3 单元，还是需要高曝光品牌展示的<strong>3×6 定制广告帐篷</strong>。</p>',
                landing_canopy_b2b_p2_html:
                    '<p>我们协助确认尺寸、材料、印刷与围布、配重等增配，使您的<a href="/zh/all-products.html?cat=tents">定制广告帐篷</a>订单贴合实际使用场景。项目层面的问题请参阅<a href="/zh/faq.html">常见问题</a>、<a href="/zh/faq-moq.html">起订量指引</a>、<a href="/zh/faq-lead-time.html">交期说明</a>与<a href="/zh/faq-artwork-files.html">设计稿文件要求</a>，或在<a href="/zh/contact-us.html">询价</a>中提供目标尺寸与印刷范围。</p>',
                landing_canopy_related_h2: '相关主题页',
                landing_canopy_related_intro_html:
                    '以下页面与本文互补，便于按印刷、快开生产、活动场景与铝架折篷等角度继续了解（站内固定 URL，利于内链与检索）。',
                landing_canopy_gallery_h2: '3×6 定制广告帐篷 — 实景图集',
                landing_canopy_gallery_intro_html:
                    '以下为带<strong>铝制框架</strong>的<strong>3×6 定制广告帐篷</strong>实景示例，可作为活动品牌、零售推广与 OEM 出货的参考。',
                landing_canopy_gallery_cap_main: '精选：3×6 铝架定制广告帐篷 — 户外品牌展示实景。',
                landing_canopy_gallery_cap_aluminum: '铝架细节 — 适用于 OEM 广告帐篷规格书。',
                landing_canopy_gallery_cap_second: '第二组实景 — 活动用全彩印刷帐篷。',
                landing_canopy_types_h2: '常见定制广告帐篷类型',
                landing_canopy_types_intro_html:
                    '以下为 B2B 项目常见规格。请前往<a href="/zh/product-center.html?cat=tents">帐篷分类总览</a>或<a href="/zh/all-products.html?cat=tents">全部帐篷 SKU</a>查看型号与变体。',
                landing_canopy_type_1_h3: '3×3 定制广告帐篷',
                landing_canopy_type_1_html:
                    '紧凑型快开帐篷，适合地推与小岛展位，运输便捷、搭建迅速。<a href="/zh/tent-type.html?type=folding40">查看折叠帐篷类型</a>以匹配框架偏好。',
                landing_canopy_type_2_h3: '3×4.5 定制广告帐篷',
                landing_canopy_type_2_html:
                    '中等宽度覆盖，适合试饮台与签到区；可搭配品牌围布增强防护。详见<a href="/zh/all-products.html?cat=tents">印刷帐篷列表</a>。',
                landing_canopy_type_3_h3: '3×6 定制广告帐篷',
                landing_canopy_type_3_html:
                    '高曝光单框大画面，适合赞助通道与户外零售。实景见上文图集，并在<a href="/zh/product-center.html?cat=tents">产品中心</a>规划布局。',
                landing_canopy_type_4_h3: '铝架定制广告帐篷',
                landing_canopy_type_4_html:
                    '轻质耐腐蚀框架，适合频繁巡展；常见于高端<strong>快开广告帐篷</strong>项目。请在<a href="/zh/product-center.html?cat=tents">产品中心</a>对比系列。',
                landing_canopy_type_5_h3: '钢架快开帐篷',
                landing_canopy_type_5_html:
                    '性价比钢制方案，适合季节性活动与租赁车队；<a href="/zh/contact-us.html">询价</a>时请说明框架材质以便匹配预算与使用强度。',
                landing_canopy_type_6_h3: '带围布的印刷帐篷',
                landing_canopy_type_6_html:
                    '全周品牌展示，可选半高或全高围布，兼容常规配件线。印前请对照<a href="/zh/faq-artwork-files.html">印刷文件指南</a>。',
                landing_canopy_why_h2: '采购商为何选择我们的定制广告帐篷',
                landing_canopy_why_p1_html:
                    '<p><strong>OEM / ODM 体系：</strong>作为品牌与分销商的制造伙伴，我们固化框架系列、面料与工艺文件，保障跨区域翻单一致。</p>',
                landing_canopy_why_p2_html:
                    '<p><strong>LOGO 与品牌画面：</strong>顶篷与檐口可全彩呈现<strong>全彩印刷帐篷</strong>；生产前可协助安全区与拼缝位置说明。印前详见<a href="/zh/faq-artwork-files.html">设计稿要求</a>。</p>',
                landing_canopy_why_p3_html:
                    '<p><strong>铝架与钢架可选：</strong>按重量、使用频率与预算匹配材料——铝材利于巡回，钢材适合成本敏感型<strong>快开广告帐篷</strong>项目。</p>',
                landing_canopy_why_p4_html:
                    '<p><strong>围布与配件兼容：</strong>可增配围布、配重与拉索，使<strong>活动印刷帐篷</strong>符合场地规定；可与框架打包询价。</p>',
                landing_canopy_why_p5_html:
                    '<p><strong>出口包装：</strong>工厂直供式装箱，面向国际货运；报价阶段可提供外箱尺寸与搬运说明。</p>',
                landing_canopy_why_p6_html:
                    '<p><strong>报价与生产协同：</strong>交期与<a href="/zh/faq-moq.html">起订量</a>视范围而定；排期见<a href="/zh/faq-lead-time.html">交期常见问题</a>或通过<a href="/zh/contact-us.html">询价表</a>联系。</p>',
                landing_canopy_specs_h2: '定制广告帐篷规格与选项',
                landing_canopy_specs_intro: '供采购团队快速参考；最终以具体 SKU 与报价单为准。',
                landing_canopy_specs_1_h3: '框架材料',
                landing_canopy_specs_1_html:
                    '铝合金或钢管框架与工程连接件——按重量、耐久与预算为<strong>定制广告帐篷</strong>项目选型。',
                landing_canopy_specs_2_h3: '常见尺寸',
                landing_canopy_specs_2_html:
                    '商用常见 3×3 m、3×4.5 m、3×6 m 等；具体覆盖请见<a href="/zh/all-products.html?cat=tents">全部产品 — 帐篷</a>。',
                landing_canopy_specs_3_h3: '篷布印刷',
                landing_canopy_specs_3_html:
                    '热升华或其它适配工艺，呈现鲜艳 LOGO；矢量稿优先，详见<a href="/zh/faq-artwork-files.html">文件格式</a>。',
                landing_canopy_specs_4_h3: '围布与配件',
                landing_canopy_specs_4_html:
                    '可选围布、半墙、裙边及兼容配重等——请在询价单中列明以便合并物料清单。',
                landing_canopy_specs_5_h3: '起订量与交期',
                landing_canopy_specs_5_html:
                    '随印刷复杂度与季节变化；请参阅<a href="/zh/faq-moq.html">起订量</a>与<a href="/zh/faq-lead-time.html">交期</a>或在订单中索取项目时间表。',
                landing_canopy_specs_6_h3: '出口支持',
                landing_canopy_specs_6_html:
                    '文件与装箱适配自中国出口；询价时请提供目的港与贸易条款偏好，见<a href="/zh/contact-us.html">销售联系</a>。',
                landing_canopy_buyers_faq_h2: '定制广告帐篷 — 常见问题',
                landing_canopy_buyers_faq_intro_html:
                    '买家速览；完整内容见<a href="/zh/faq.html">常见问题库</a>。',
                landing_canopy_buyers_faq_1_q: '定制广告帐篷有哪些常见尺寸？',
                landing_canopy_buyers_faq_1_a_html:
                    '我们提供 3×3 m、3×4.5 m、3×6 m 等常见商用尺寸，具体以框架系列为准。请使用<a href="/zh/all-products.html?cat=tents">帐篷分类列表</a>或在报价阶段索取对照表。',
                landing_canopy_buyers_faq_2_q: '所有篷面都可以印 LOGO 吗？',
                landing_canopy_buyers_faq_2_a_html:
                    '顶篷与檐口印刷在多数<strong>全彩印刷帐篷</strong>中为常规配置；围布印刷可能因面料与拼缝而异。请尽早提供排版，我们在<a href="/zh/faq-artwork-files.html">印前 FAQ</a>中说明出血与安全区。',
                landing_canopy_buyers_faq_3_q: '是否同时提供铝架与钢架？',
                landing_canopy_buyers_faq_3_a_html:
                    '是。铝材适合频繁运输；钢材可降低单套成本。联系时请说明使用场景，以便推荐合适的<strong>快开广告帐篷</strong>框架。',
                landing_canopy_buyers_faq_4_q: '定制广告帐篷的起订量是多少？',
                landing_canopy_buyers_faq_4_a_html:
                    '起订量取决于印刷范围、面料与配件。详见<a href="/zh/faq-moq.html">起订量指引</a>，并在询价中写明数量以便分项报价。',
                landing_canopy_buyers_faq_5_q: '是否支持分销商 OEM？',
                landing_canopy_buyers_faq_5_a_html:
                    '我们作为面向 B2B 的<strong>OEM 广告帐篷制造商</strong>，可讨论贴牌包装与翻单一致性，请通过<a href="/zh/contact-us.html">联系</a>沟通。',
                landing_canopy_buyers_faq_6_q: '围布与配件能否一并采购？',
                landing_canopy_buyers_faq_6_a_html:
                    '可以——围布、配重及相关五金可与框架一并报价。若场地对阻燃等有要求，请在采购<strong>活动印刷帐篷</strong>套装时一并说明。',

                landing_canopy_b2b_audience_html:
                    '<p>我们服务<strong>经销商与渠道分销商</strong>、<strong>活动搭建与租赁供应商</strong>、<strong>品牌与广告代理</strong>，以及需要稳定翻单与出口文件的 OEM/ODM 项目。若您管理多市场投放，我们可协同框架系列、面料与印前规范，便于长期补货。</p>',
                landing_canopy_section_logo_h2: '带 LOGO 的定制广告帐篷',
                landing_canopy_section_logo_html:
                    '<p>从<strong>定制帐篷印字</strong>到整顶<strong>全彩印刷帐篷</strong>，顶篷与檐口可呈现品牌主视觉；也可制作<strong>品牌篷房</strong>式一体化展示。矢量稿与潘通对齐请在询价时一并提供，详见<a href="/zh/faq-artwork-files.html">印前说明</a>。</p>',
                landing_canopy_section_popup_h2: '快开广告帐篷选项',
                landing_canopy_section_popup_html:
                    '<p><strong>快开广告帐篷</strong>适合巡回路演、促销岛与户外赛事——快速展开与收纳，便于车队调拨。可按项目匹配铝架（轻量耐腐蚀）或钢架（成本导向），并与围布、配重打包询价。更多框架侧重点见<a href="/zh/aluminum-folding-tent.html">铝合金折叠帐篷</a>。</p>',
                landing_canopy_section_sizes_h2: '常见尺寸：10×10、10×15、10×20（及公制对照）',
                landing_canopy_section_sizes_html:
                    '<p>北美常用英制表述为 10×10 ft、10×15 ft、10×20 ft；公制约对应 3×3 m、3×4.5 m、3×6 m 等。采购时请确认目标市场标注习惯；我们可在报价单中并列对照，便于经销商终端沟通。需要标准展位常见规格可参考<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开广告帐篷</a>专题页。</p>',
                landing_canopy_section_frames_h2: '铝架与钢架怎么选',
                landing_canopy_section_frames_html:
                    '<p><strong>铝制型材</strong>利于频繁拆装与海运抛重控制；<strong>钢制管材</strong>适合预算敏感或固定季节投放。<strong>重型快开帐篷</strong>需求请说明风载、地锚与使用周期，以便推荐连接件等级与配重方案。</p>',
                landing_canopy_section_walls_h2: '全围布 / 侧墙定制',
                landing_canopy_section_walls_html:
                    '<p>可选全高围布、半墙、实墙或窗墙组合，用于防风、隐私或陈列。围布可单独翻单；颜色与画面可与顶篷同一套印前文件管理。若需阻燃或耐候声明，请在订单中列明目标市场法规。</p>',
                landing_canopy_1010_teaser_html:
                    '<div class="wk-card wk-feature-card" style="max-width: 920px; margin: 0 auto; text-align: left;">'
                    + '<h3 style="margin-top: 0;">10×10 快开广告帐篷（3×3 m）专题</h3>'
                    + '<p>北美与全球活动中最常见的起步尺寸之一。阅读<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开广告帐篷</a>：框架等级、定制帐篷印字、围布与出口包装要点，便于与采购同事对齐规格。</p></div>',
                landing_canopy_buyers_faq_7_q: '什么是快开广告帐篷（pop up canopy tent）？',
                landing_canopy_buyers_faq_7_a_html:
                    '一种可折叠框架配张力篷布的户外展示结构，展开后形成遮蔽空间，收纳后体积紧凑，适合频繁搭建。我们提供铝/钢框架与 OEM 画面，适用于促销、展会与赛事。',
                landing_canopy_buyers_faq_8_q: '能否做带品牌 LOGO 的定制帐篷？',
                landing_canopy_buyers_faq_8_a_html:
                    '可以。顶篷、檐口与围布均可按设计做<strong>定制帐篷印字</strong>或全幅面<strong>定制印刷篷布</strong>。请提交矢量稿并注明潘通或专色要求，我们在<a href="/zh/faq-color-matching.html">色彩</a>与<a href="/zh/faq-artwork-files.html">文件</a>页面列出规范。',
                landing_canopy_buyers_faq_9_q: '是否提供 10×10（3×3 m）定制广告帐篷出口？',
                landing_canopy_buyers_faq_9_a_html:
                    '是，10×10 ft 与 3×3 m 为常见库存/翻单规格之一。MOQ、交期与装箱因印刷与配件而异，详见<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 专题</a>与<a href="/zh/faq-moq.html">起订量</a>。',
                landing_canopy_buyers_faq_10_q: '围布能否单独定制尺寸与画面？',
                landing_canopy_buyers_faq_10_a_html:
                    '可以。围布可与顶篷分开翻单；尺寸按框架系列与挂钩位置开版。若与顶篷同一campaign，建议统一印前出口与色差控制策略，参阅<a href="/zh/faq-artwork-files.html">设计稿要求</a>。',

                page_title_1010_canopy: '10×10 快开广告帐篷｜3×3 m 定制篷房与出口｜伟群帐篷',
                landing_1010_h1: '10×10 快开广告帐篷（3×3 m）B2B 定制与出口',
                landing_1010_lead_html:
                    '面向经销商与活动供应商的<strong>10×10 快开广告帐篷</strong>（约 3×3 m）采购指南：框架选型、<strong>定制帐篷印字</strong>、围布与配件、MOQ 及出口协同。',
                landing_1010_use_cases_h2: '典型使用场景',
                landing_1010_use_cases_html:
                    '<p>试饮台、注册签到、赛事后勤、户外零售岛与品牌路演——<strong>10×10 规格</strong>在单箱运输与搭建人力之间取得平衡，适合作为渠道客户的入门主推 SKU。</p>',
                landing_1010_frame_h2: '框架与耐用性',
                landing_1010_frame_html:
                    '<p>铝型材适合高频次拆装与沿海高湿环境；钢架适合成本敏感项目。请说明是否需要<strong>重型快开帐篷</strong>级加固、地钉/沙袋配重与连接件规格，以便工厂匹配管材壁厚与连接器等级。</p>',
                landing_1010_print_h2: '定制印刷与品牌篷房',
                landing_1010_print_html:
                    '<p>顶篷与檐口可做全彩<strong>定制印刷篷布</strong>；也可与围布统一视觉形成<strong>品牌篷房</strong>式封闭展示。印前请按矢量流程提交，详见<a href="/zh/faq-artwork-files.html">文件规范</a>。</p>',
                landing_1010_sidewalls_h2: '围布与配件',
                landing_1010_sidewalls_html:
                    '<p>可选窗墙、实墙、半墙与拉链门；配重袋、地钉与收纳轮包可与框架同箱出口。若终端场地对阻燃有要求，请在询价单注明目标国法规。</p>',
                landing_1010_shipping_h2: 'OEM、MOQ 与出口',
                landing_1010_shipping_html:
                    '<p>我们支持 OEM/ODM 标签与装箱清单；MOQ 与交期随印刷与季节变化，参阅<a href="/zh/faq-moq.html">起订量</a>、<a href="/zh/faq-lead-time.html">交期</a>与<a href="/zh/faq-shipping.html">物流</a>。需要全系列对比请返回<a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷总览</a>或浏览<a href="/zh/all-products.html?cat=tents">全部帐篷 SKU</a>。</p>',
                landing_1010_faq_1_q: '10×10 与 3×3 m 是同一规格吗？',
                landing_1010_faq_1_a_html:
                    '在大多数商用折叠帐篷中，10×10 ft 与 3×3 m 为同一档位的常见标称，具体外轮廓以框架系列为准；报价时可索取尺寸表。',
                landing_1010_faq_2_q: '能否只做围布翻单？',
                landing_1010_faq_2_a_html:
                    '可以，前提是框架系列一致以便挂钩与拉链位匹配。建议提供原订单或框架型号。',
                landing_1010_faq_3_q: '适合海运还是空运？',
                landing_1010_faq_3_a_html:
                    '取决于交期与目的港成本；工厂可提供外箱尺寸与毛重供您选择港到港或门到门方案。',
                landing_1010_faq_4_q: '与铝合金折叠帐篷页面有何区别？',
                landing_1010_faq_4_a_html:
                    '本页聚焦 10×10/3×3 尺寸意图与配件组合；<a href="/zh/aluminum-folding-tent.html">铝合金折叠帐篷</a>侧重材料与结构选型。总览级 OEM 信息见<a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a>。',
                landing_1010_factory_h2: '同一工厂内的主题入口',
                landing_1010_factory_html:
                    '<p>10×10 是渠道常见主推规格，但采购团队通常仍需对照<strong>系列与印刷范围</strong>。并行阅读 <a href="/zh/canopy-tents.html">广告帐篷总览</a>、<a href="/zh/pop-up-canopy-tents.html">快开广告篷</a>与 <a href="/zh/event-canopy-tents.html">活动与展会篷</a>，可在 RFQ 中一次写清框架等级与配件。</p>',
                landing_1010_faq_5_q: '30/40/50 方管系列与 10×10 如何对应？',
                landing_1010_faq_5_a_html:
                    '尺寸（如 3×3 m）描述占地跨度；<strong>30/40/50</strong>等方管系列描述框架截面与强度等级。请在询价中同时写明目标系列与印刷范围，以便匹配现货或开模方案。',
                landing_1010_faq_6_q: '如何获取报价与排产？',
                landing_1010_faq_6_a_html:
                    '提交数量、目的港、是否需要围布/配重后，我们通常可在约 24 小时内回复基线方案。详见 <a href="/zh/faq-moq.html">MOQ</a>、<a href="/zh/faq-lead-time.html">交期</a>，并通过 <a href="/zh/contact-us.html">询价表单</a>附上设计稿阶段说明。',
                landing_1010_faq_section_h2: '10×10 快开广告帐篷 — 常见问题',
                landing_1010_faq_section_intro_html:
                    '更多买家主题：<a href="/zh/faq.html">常见问题库</a> · <a href="/zh/faq-moq.html">起订量</a> · <a href="/zh/faq-shipping.html">物流</a>',

                page_title_aluminum_fold: '铝合金折叠广告帐篷｜重型快开篷框架｜伟群帐篷',
                landing_aluminum_h1: '铝合金折叠广告帐篷',
                landing_aluminum_p1_html:
                    '<p><strong>铝合金折叠帐篷</strong>采用挤出型材腿与桁架，在强度与自重之间取得平衡——适合采购团队为频繁拆装的施工队指定<strong>铝合金快开广告帐篷</strong>。相较钢材，铝材装车更轻、利于海运抛重，并在潮湿户外环境中耐腐蚀；钢架则在季节性租赁或成本敏感项目中更具单价优势。伟群可同时提供两种框架路线及品牌篷布、围布与配件；<strong>本页聚焦材料与框架行为</strong>；整体 OEM/ODM 定位请参阅<a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a>总览。</p>',
                landing_aluminum_p2_html:
                    '<p>典型场景：巡回路演、体育与节庆通道、商业激活及代理商项目——需要可靠遮蔽且控制框架重量。</p>',
                landing_aluminum_card_1_h3: '铝架与钢架',
                landing_aluminum_card_1_p:
                    '铝材：更轻、耐腐蚀；钢架：成本导向、短期或抗风需求——按排期与预算选型。',
                landing_aluminum_card_2_h3: '篷布与印刷',
                landing_aluminum_card_2_p:
                    '防水面料与全彩印刷，适用于<strong>重型广告篷房</strong>与渠道项目。',
                landing_aluminum_card_3_h3: '商业与活动',
                landing_aluminum_card_3_p:
                    '从 3×3 m 到更大占地：试饮、签到、展示与后勤区。',
                landing_aluminum_card_4_h3: 'OEM / ODM',
                landing_aluminum_card_4_p:
                    '贴牌框架、潘通对齐篷布与工厂出口包装。',
                landing_aluminum_disclaimer_html:
                    '<p style="margin-bottom: 10px;">浏览全部帐篷 SKU：<a href="/zh/all-products.html?cat=tents">折叠与广告帐篷（完整目录）</a>。尺寸意向：<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开广告帐篷</a>（约 3×3 m）。</p>'
                    + '<p style="margin-bottom: 10px;">整体 OEM 方案：<a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷 — B2B 总览</a>。</p>'
                    + '<p style="margin-bottom: 10px;">延伸阅读：<a href="/zh/seo/aluminum-frame-pop-up-tent-factory-direct-export.html">铝合金框架快开帐篷（工厂出口）</a> · <a href="/zh/seo/commercial-grade-pop-up-canopy-wholesale-supplier.html">商用级篷房批发</a> · <a href="/zh/site-map.html#seo-guides">全部指南</a>。</p>'
                    + '联系：<a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp：<a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a>',
                landing_aluminum_repeat_h2: '为何铝架快开帐篷适合反复搭建',
                landing_aluminum_repeat_p_html:
                    '<p style="max-width: 900px; margin-left: auto; margin-right: auto;">巡回团队在意每一公斤——更轻的腿管降低搬运疲劳，耐腐蚀则延长沿海与高湿环境下的使用寿命。配合张紧良好的篷布，<strong>铝合金快开广告帐篷</strong>可在赞助现场呈现<strong>重型快开帐篷</strong>应有的稳固感，又避免每次装车都背负过度加重的钢材。</p>',
                landing_aluminum_program_h2: '规划完整篷房方案（不止框架）',
                landing_aluminum_program_p_html:
                    '<p style="max-width: 900px; margin-left: auto; margin-right: auto;">请从<a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷制造商</a>总览了解 OEM/ODM、LOGO 印刷与围布套装。若目录以最常见的便携占地为主，请阅读<a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开广告帐篷</a>规格，再与终端客户的配重、地锚方案对齐框架等级。</p>',
                landing_aluminum_related_h2: '相关资源',
                landing_aluminum_related_sub: '帐篷、旗帜与买家常见问题。',
                landing_aluminum_rel_canopy_h3: '定制广告帐篷（总览 OEM）',
                landing_aluminum_rel_canopy_p: '快开定位、印刷、MOQ 与出口——非金属材料专论。',
                landing_aluminum_rel_1010_h3: '10×10 快开广告帐篷',
                landing_aluminum_rel_1010_p: '3×3 m 尺寸、配件与渠道备注。',
                landing_aluminum_rel_types_h3: '帐篷类型',
                landing_aluminum_rel_types_p: '框架与尺寸选型参考。',
                landing_aluminum_rel_moq_h3: '起订量（MOQ）',
                landing_aluminum_rel_moq_p: '按型号与印刷说明最小订购。',

                page_title_portable_display: '便携式展示系统｜快幕秀与展架背景墙｜伟群帐篷',
                landing_top_bar_portable: '源头工厂 · 便携展示 · 24 小时内回复',
                landing_portable_h1: '便携式展示系统制造商',
                landing_portable_lead:
                    '面向展会与品牌路演：带印刷画面的布艺展架、易拉宝、促销台及定制组合——快装快收、画面可更换。',
                landing_portable_card_1_h3: '产品线',
                landing_portable_card_1_p:
                    '快展系统、布艺/弹力布展架、促销接待台、易拉宝及配件。',
                landing_portable_card_2_h3: '起订量（MOQ）',
                landing_portable_card_2_p:
                    '按型号与印刷范围而定，支持小批量试单；大货可稳定控制色差。',
                landing_portable_card_3_h3: '交期',
                landing_portable_card_3_p:
                    '稿件确认后一般 7–15 天；型材与五金有备货可更快出货。',
                landing_portable_card_4_h3: '出口支持',
                landing_portable_card_4_p:
                    '平板包装、质检照片、箱唛标注及全球发运方案协助。',
                landing_portable_contact_line_html:
                    '联系：<a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp：<a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a> · 微信：massifmyth',
                landing_portable_b2b_links_html:
                    '<span>B2B 专题页：</span><a href="/zh/seg-light-box-manufacturer.html">SEG 灯箱制造商</a> · <a href="/zh/tension-fabric-backwall.html">弹力布背景墙</a> · <a href="/zh/aluminum-folding-tent.html">铝合金折叠帐篷</a>。<span>延伸指南：</span><a href="/zh/seo/tension-fabric-display-wall-manufacturer-oem-trade-show.html">弹力布展墙（OEM）</a> · <a href="/zh/seo/portable-backdrop-display-system-supplier-wholesale.html">便携背景批发</a> · <a href="/zh/site-map.html#seo-guides">全部指南索引</a>。',
                landing_portable_supply_h2: '我们提供什么',
                landing_portable_supply_sub: '可选标准套装，也可按展位面积与品牌视觉组合整包方案。',
                landing_portable_supply_1_h3: '布艺展架',
                landing_portable_supply_1_p: '轻质铝框 + 弹力布画面，适合展会主视觉与背景墙。',
                landing_portable_supply_2_h3: '促销接待台',
                landing_portable_supply_2_p: '可围包画面的便携展台，适用于试饮、路演与零售激活。',
                landing_portable_supply_3_h3: '易拉宝',
                landing_portable_supply_3_p: '经典伸缩画面，搭建快、携带方便。',
                landing_portable_supply_4_h3: '整包方案',
                landing_portable_supply_4_p: '可将广告帐篷、旗帜与展台组合为活动套装（按项目配置）。',
                landing_portable_faq_h2: '常见问题文章',
                landing_portable_faq_sub: '印前、色彩与物流——展示类项目的实用说明。',
                landing_portable_faq_card_1_h3: '印前文件',
                landing_portable_faq_card_1_p: '推荐格式、出血、字体与避免拖稿的要点。',
                landing_portable_faq_card_2_h3: '交期',
                landing_portable_faq_card_2_p: '如何结合展会排期与运输预留时间。',
                landing_portable_faq_card_3_h3: '运输方式',
                landing_portable_faq_card_3_p: '快递、空运与海运的选择思路。',
                landing_portable_faq_view_all: '查看全部常见问题',

                page_title_beach: '沙滩旗供应商｜羽毛旗刀旗矩形旗杆底座｜伟群帐篷',
                landing_top_bar_beach: '工厂直供 · 旗面 + 旗杆 + 底座 · 24 小时内回复',
                landing_beach_h1: '沙滩旗供应商',
                landing_beach_lead:
                    '定制羽毛旗、水滴旗，配套旗杆、底座与收纳包 — 工厂直供，适用于活动、零售与户外推广。',
                landing_beach_card_1_h3: '产品线',
                landing_beach_card_1_p: '羽毛旗、水滴旗、矩形旗、旗杆套装、底座（十字、注水/注沙、地钉）。',
                landing_beach_card_2_h3: '起订量（MOQ）',
                landing_beach_card_2_p: '新设计可低起订；批量订单支持稳定色差控制。',
                landing_beach_card_3_h3: '交期',
                landing_beach_card_3_p: '设计确认后通常生产 7–12 天；部分旗杆/底座可现货。',
                landing_beach_card_4_h3: '出口支持',
                landing_beach_card_4_p: '出口包装、条码/标签协助，发往欧美澳及东南亚等市场。',
                landing_beach_contact_line_html:
                    '联系：<a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp：'
                    + '<a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a> · 微信：massifmyth',
                landing_beach_guides_row_html:
                    '长篇指南：'
                    + '<a href="/zh/seo/beach-flag-manufacturer-wholesale-feather-teardrop-flags.html">批发羽毛旗与水滴旗</a>'
                    + ' · '
                    + '<a href="/zh/seo/custom-printed-feather-flag-supplier-bulk-order-oem.html">大批量 OEM 羽毛旗印刷</a>'
                    + ' · '
                    + '<a href="/zh/site-map.html#seo-guides">全部旗帜与帐篷指南</a>',
                landing_beach_buyers_h2: '常见买家需求',
                landing_beach_buyers_lead: '我们协助您选择面料、印刷与底座，使旗帜在户外稳定展示。',
                landing_beach_buyer_1_h3: '面料选项',
                landing_beach_buyer_1_p: '涤纶旗面，印刷鲜艳；可按用途选择单面或双面方案。',
                landing_beach_buyer_2_h3: '后道工艺',
                landing_beach_buyer_2_p: '加强袋口、卷边缝制，发货前核对与旗杆匹配。',
                landing_beach_buyer_3_h3: '底座',
                landing_beach_buyer_3_p: '室内十字底座；户外注水/注沙底座；草地/泥地用地钉。',
                landing_beach_buyer_4_h3: '包装',
                landing_beach_buyer_4_p: '含收纳包（可选）；支持连锁零售装与条码。',
                landing_beach_faq_articles_h2: '常见问题文章',
                landing_beach_faq_articles_lead: '印前与物流要点速览 — 帮助团队更快下单。',
                landing_beach_faq_card_1_h3: '设计稿（AI/PDF）',
                landing_beach_faq_card_1_p: '如何发送印刷文件、出血、字体与色彩设置。',
                landing_beach_faq_card_2_h3: '颜色匹配',
                landing_beach_faq_card_2_p: '色差原因与批次间控制方法。',
                landing_beach_faq_card_3_h3: '运输方式',
                landing_beach_faq_card_3_p: '快递、空运与海运的成本/时效取舍，以及需要您提供的信息。',

                footer_legal_link_faq: '常见问题',
                footer_legal_link_canopy: '定制广告帐篷制造商',
                footer_legal_link_beach: '沙滩旗供应商',
                footer_legal_link_display: '展示系统制造商',
                footer_legal_link_guides: 'B2B 指南',
                
                // 公司介绍
                about_title: '关于伟群',
                about_subtitle: '帐篷、沙滩旗与展示系统的专业源头制造工厂',
                about_intro: '广西伟群帐篷制造有限公司是一家专注于帐篷、沙滩旗、快幕秀等展示系统及户外品牌展示产品研发与制造的源头工厂。公司深耕便携式户外展示行业25年以上，为全球客户提供稳定、高效、可定制的展示解决方案。',
                about_mission_title: '我们的使命',
                about_mission: '我们的使命', // 兼容旧key
                about_mission_text: '专注于帐篷、沙滩旗及便携式展示系统的研发与制造，为全球客户提供高品质、易安装、可定制的展示产品，帮助品牌在各类活动、展会与商业场景中实现更高效的曝光与传播。',
                about_vision_title: '我们的愿景',
                about_vision: '我们的愿景', // 兼容旧key
                about_vision_text: '成为帐篷与展示系统领域值得信赖的全球制造合作伙伴，持续提升制造工艺与产品品质，为客户创造长期、稳定、可持续的商业价值。',
                about_stat_years: '年制造经验',
                about_stat_clients: '全球客户',
                about_stat_products: '产品型号',
                about_products_title: '产品与能力范围',
                about_products_main: '主要产品系列：',
                about_product_1: '帐篷系列（折叠帐篷、篷房、大型活动帐篷）',
                about_product_2: '沙滩旗及旗杆系列（羽毛旗、水滴旗、刀旗等）',
                about_product_3: '展示系统（快幕秀、背景墙等）',
                about_product_4: '桌布、布艺展示及品牌配件',
                about_product_5: '定制化品牌展示解决方案',
                about_printing_title: '印刷与工艺：',
                about_printing_1: '数码印刷 / 丝网印刷 / 热转印',
                about_printing_2: '多种布料与结构可选',
                about_printing_3: '严格的品质检测与一致性控制',
                about_philosophy_title: '我们的理念',
                about_philosophy_mission_label: '企业使命',
                about_philosophy_mission: '弘扬品牌展示文化，助力客户商业成功',
                about_philosophy_values_label: '经营理念',
                about_philosophy_values: '诚信经营、持续创新、合作共赢',
                about_philosophy_quality_label: '质量方针',
                about_philosophy_quality: '品质稳定、交付准时、服务可靠',
                about_philosophy_commitment_label: '质量承诺',
                about_philosophy_commitment: '产品严格符合国际标准与客户要求，确保一致性与可靠性',
                about_meta_title: '关于伟群 | 广告帐篷、沙滩旗与展示系统制造商 | WaiKwan',
                about_meta_description: '伟群帐篷：OEM/ODM 源头工厂，专注定制广告篷、沙滩旗、便携展陈与卡布灯箱，服务全球渠道与品牌客户的出口项目。',
                about_who_we_serve: '我们服务需要稳定交付与可定制方案的分销商、活动公司、广告渠道及全球品牌方：从打样、批量到单证与装箱协同，减少沟通往返。',
                about_section_overview: '公司概览',
                about_section_capabilities: '制造与产品线',
                about_section_mission: '使命与愿景',
                about_section_philosophy: '企业理念',
                about_section_why: '为什么采购方选择我们',
                about_breadcrumb_home: '首页',
                about_breadcrumb_current: '关于我们',
                home_about_teaser_title: '关于伟群',
                home_about_teaser_p: '广西伟群帐篷制造有限公司是帐篷、沙滩旗与便携展示系统的源头制造商，为全球市场提供 OEM/ODM 与出口协同。',
                faq_meta_title: '采购常见问题 | MOQ、交期、稿件、色彩与物流 | 伟群帐篷',
                faq_meta_description: 'B2B 采购常见问题：起订量、交期、设计稿、色彩与物流方案，帮助团队更快确认订单与出运。',
                faq_hero_kicker: 'B2B 采购支持',
                faq_hero_h1: '采购常见问题',
                faq_hero_sub: '覆盖起订量、交期、设计稿、色彩与发货等 B2B 采购关键环节，帮助团队减少反复修改与沟通成本。',
                faq_badge_moq: 'MOQ',
                faq_badge_time: '交期',
                faq_badge_files: '稿件',
                faq_badge_color: '色彩',
                faq_badge_ship: '物流',
                faq_badge_sample: '样品',
                faq_popular_title: '常见入口',
                faq_cta_title: '没找到答案？',
                faq_cta_text: '把产品类型、数量与目标市场发给我们，业务与工程同事会协助你推进下一步。',
                faq_cta_whatsapp: 'WhatsApp 联系',
                stat_years: '年制造经验',
                stat_clients: '全球合作客户',
                stat_products: '产品型号与解决方案',
                
                // 产品特色
                feature_quality: '最高品质',
                feature_quality_desc: '使用优质材料，严格质量控制，确保产品耐用可靠',
                feature_fast: '快速交付',
                feature_fast_desc: '高效生产流程，快速物流配送，确保及时送达',
                feature_custom: '定制服务',
                feature_custom_desc: '专业设计团队，支持OEM/ODM，满足您的个性化需求',
                feature_global: '全球出口',
                feature_global_desc: '产品出口至多个国家，丰富的国际市场经验',
                
                // 产品常规尺寸参考
                sizes_title: '产品常规尺寸参考',
                sizes_subtitle: '以下为常用标准尺寸，支持定制与模块化组合',
                sizes_tent_title: '快装帐篷（折叠广告帐篷）',
                sizes_giant_title: '大型活动帐篷（篷房 / 活动大棚）',
                sizes_display_title: '展示系统（快幕秀 / 背景墙）',
                sizes_tag_hot: '热销',
                sizes_tag_modular: '模块拼接',
                sizes_tag_fast: '快速搭建',
                sizes_standard: '常规尺寸',
                sizes_standard_combo: '常规组合尺寸',
                sizes_standard_options: '常规规格',
                sizes_features: '结构特点',
                sizes_apps: '适用场景',
                sizes_tent_f1: '折叠式铝合金或钢制框架',
                sizes_tent_f2: '无需工具，快速安装',
                sizes_tent_f3: '顶篷及围布支持定制印刷',
                sizes_tent_app: '品牌推广、户外活动、促销展位、临时展示',
                sizes_giant_custom: '更大尺寸支持模块化拼接定制',
                sizes_giant_f1: '模块化拼接结构',
                sizes_giant_f2: '高强度铝合金框架',
                sizes_giant_f3: '可根据项目需求定制高度与跨度',
                sizes_giant_app: '大型活动、商业展会、临时展馆、品牌发布',
                sizes_display_s1: '宽度模块：3m / 4m / 5m',
                sizes_display_s2: '结构形式：直型 / 弧形 / U 型',
                sizes_display_s3: '单面或双面展示',
                sizes_display_f1: '轻便可折叠结构',
                sizes_display_f2: '快速安装，便于运输',
                sizes_display_f3: '画面可更换，支持高精度印刷',
                sizes_display_app: '展会展示、背景墙、品牌形象展示',
                sizes_view_products: '查看产品',
                sizes_get_quote: '获取报价',
                sizes_note: '以上尺寸为常规参考，欢迎联系我们获取定制方案。',
                sizes_cta: '获取报价',
                // 保留旧键名以兼容
                popular_sizes_title: '产品常规尺寸参考',
                popular_sizes_subtitle: '以下为常用标准尺寸，支持定制与模块化组合',
                size_category_tent_title: '快装帐篷（折叠广告帐篷）',
                size_category_large_title: '大型活动帐篷（篷房 / 活动大棚）',
                size_category_display_title: '展示系统（快幕秀 / 背景墙）',
                size_standard_sizes: '常规尺寸：',
                size_standard_combination: '常规组合尺寸：',
                size_standard_options: '常规规格：',
                size_features: '结构特点：',
                size_product_features: '产品特点：',
                size_applications: '适用场景：',
                size_tent_feature_1: '折叠式铝合金或钢制框架',
                size_tent_feature_2: '无需工具，快速安装',
                size_tent_feature_3: '顶篷及围布支持定制印刷',
                size_tent_applications: '品牌推广、户外活动、促销展位、临时展示',
                size_category_large_note: '更大尺寸支持模块化拼接定制',
                size_large_feature_1: '模块化拼接结构',
                size_large_feature_2: '高强度铝合金框架',
                size_large_feature_3: '可根据项目需求定制高度与跨度',
                size_large_applications: '大型活动、商业展会、临时展馆、品牌发布',
                size_display_option_1: '宽度模块：3 米 / 4 米 / 5 米',
                size_display_option_2: '结构形式：直型 / 弧形 / U 型',
                size_display_option_3: '单面或双面展示',
                size_display_feature_1: '轻便可折叠结构',
                size_display_feature_2: '快速安装，便于运输',
                size_display_feature_3: '画面可更换，支持高精度印刷',
                size_display_applications: '展会展示、背景墙、品牌形象展示',
                size_cta_text: '以上尺寸为常规参考，欢迎联系我们获取定制方案',
                size_cta_text_en: '',
                
                // 客户评价
                testimonials_title: '客户评价',
                testimonials_subtitle: '来自全球客户的真实反馈',
                testimonial_1_text: '"产品质量非常好，服务专业，交付及时。我们非常满意与伟群的合作。"',
                testimonial_1_name: 'David T.',
                testimonial_1_role: '活动策划公司',
                testimonial_2_text: '"定制服务非常专业，能够满足我们的特殊需求。产品质量超出预期。"',
                testimonial_2_name: 'Antonio C.',
                testimonial_2_role: '餐厅老板',
                testimonial_3_text: '"团队非常专业，响应迅速。产品设计精美，完全符合我们的品牌形象。"',
                testimonial_3_name: 'Owen B.',
                testimonial_3_role: '娱乐行业',
                
                // 产品中心
                products_title: '产品中心',
                products_subtitle: '帐篷 · 沙滩旗 · 展示系统 · 户外品牌展示系统',
                products_subtitle_en: '',
                // 标准 i18n key（统一命名）
                products_tents_title: '帐篷系列',
                products_tents_desc: '提供多种规格与结构的帐篷产品，适用于促销活动、展会展示及大型户外活动，支持定制尺寸与品牌印刷。',
                products_flags_title: '沙滩旗及旗杆',
                products_flags_desc: '多种造型与尺寸的沙滩旗及旗杆系统，适合户外宣传、赛事活动及商业展示，支持多种印刷工艺。',
                products_display_title: '展示系统',
                products_display_desc: '便携式展示系统，适用于展会背景墙、品牌形象展示及室内外活动，结构轻便，画面可更换。',
                products_accessories_title: '布艺展示及配件',
                products_accessories_desc: '包括桌布、布艺横幅及展示配件，满足整体品牌展示系统的配套需求。',
                products_custom_title: '定制展示解决方案',
                products_custom_desc: '支持从结构、尺寸到画面印刷的全流程定制，满足不同市场与项目需求。',
                products_cta: '获取报价',
                // 兼容旧key
                products_category_tents_title: '帐篷系列',
                products_category_tents_desc: '提供多种规格与结构的帐篷产品，适用于促销活动、展会展示及大型户外活动，支持定制尺寸与品牌印刷。',
                products_category_tents_desc_en: '',
                products_category_flags_title: '沙滩旗及旗杆',
                products_category_flags_desc: '多种造型与尺寸的沙滩旗及旗杆系统，适合户外宣传、赛事活动及商业展示，支持多种印刷工艺。',
                products_category_flags_desc_en: '',
                products_category_displays_title: '展示系统',
                products_category_displays_desc: '便携式展示系统：背景墙、张拉布、前台、灯箱等，适用于展会与品牌展示。',
                products_category_displays_desc_en: '',
                products_category_accessories_title: '布艺展示及配件',
                products_category_accessories_desc: '包括桌布、布艺横幅及展示配件，满足整体品牌展示系统的配套需求。',
                products_category_accessories_desc_en: '',
                products_category_custom_title: '定制展示解决方案',
                products_category_custom_desc: '支持从结构、尺寸到画面印刷的全流程定制，满足不同市场与项目需求。',
                products_category_custom_desc_en: '',
                products_cta_text: '所有产品均支持定制，欢迎联系我们获取详细规格与报价。',
                products_cta_text_en: '',
                products_cta_button: '获取报价',
                category_all: '全部产品',
                category_furniture: '户外家具',
                category_tents: '帐篷展示',
                category_flags: '旗帜广告',
                category_displays: '展示系统',
                category_custom: '定制产品',
                category_tablecloths: '桌布',
                category_popup: '快幕秀',
                category_lightbox: '灯箱系列',
                menu_light_box_series: '灯箱系列',
                cat_lightbox_title: '灯箱系列',
                cat_lightbox_desc: 'LED 背光卡布灯箱系统，适用于展会、门店与展厅展示。',

                // New top-level categories
                category_advertising_arch: '广告拱门',
                category_water_filled_a_poster_stand: '注水A字海报架',
                cat_advertising_arch_title: '广告拱门',
                cat_advertising_arch_desc: '赛事与活动入口广告拱门，多规格可选（以目录型号表为准）。',
                cat_water_filled_a_poster_stand_title: '注水A字海报架',
                cat_water_filled_a_poster_stand_desc: '可注水/注沙底座更稳固，适合户外人行道与门店引流。',

                menu_displays_tension_fabric: '张拉布展示（张力布）',
                menu_lightbox_round_tube: '圆管灯箱系列',
                menu_lightbox_aluminum_profile: '铝型材卡布灯箱系列',
                menu_lightbox_seg_net: '卡布拉网灯箱系列',
                menu_lightbox_base_style_variant: '灯箱展示架',
                category_inflatable: '充气系列',
                category_accessories: '底座/配件',
                category_frames: '帐篷框架',
                
                // 顶部栏
                top_bar_text: '25+ 年制造经验 · 值得信赖的全球合作伙伴',
                
                // 导航
                nav_products_by_size: '按尺寸',
                nav_info: '信息',
                nav_product_center: '产品中心',
                nav_all_products: '全部产品',
                nav_news: '新闻资讯',
                footer_news: '新闻资讯',
                home_news_title: '最新动态',
                home_news_intro: '了解我们的近期展会、产品亮点与公司动态。',
                home_news_feature_title: '伟群帐篷亮相上海 APPPEXPO 2026 展会',
                home_news_feature_summary: '伟群帐篷参展上海 APPPEXPO 2026，现场展示沙滩旗、展示器材与定制品牌宣传方案，并与海内外客户面对面交流。',
                home_news_btn_all: '查看全部动态',
                home_news_btn_read: '阅读更多',
                home_news_feature_meta: '展会 · 2026年3月 · 上海',
                news_meta_label: '展会',
                news_placeholder_1_title: '太阳伞、沙滩旗杆与旗杆底座',
                news_placeholder_1_desc: '展会现场展示太阳伞、沙滩旗、旗杆及加重底座等户外展示与品牌陈列方案，适用于活动推广与商业陈列。',
                news_placeholder_2_title: '帐篷架（Frame）与结构件展示',
                news_placeholder_2_desc: '折叠帐篷铝架与框架结构在展台集中呈现，体现活动帐篷类产品的制造与配套能力。',
                news_placeholder_1_img_alt: 'APPPEXPO 展会现场：太阳伞、沙滩旗杆与旗杆底座展示',
                news_placeholder_2_img_alt: 'APPPEXPO 展会现场：折叠帐篷铝架与帐篷框架结构展示',
                news_back: '返回新闻',
                news_related: '相关动态',
                news_apppexpo_feature_alt: '伟群帐篷 APPPEXPO 2026 上海展台',
                product_center_title: '产品中心',
                product_center_subtitle: '选择分类进入，或去"全部产品"搜索。',
                back_to_product_center: '返回产品中心',
                pc_context_overview_hint: '当前为分类总览（子系列与入口）',
                pc_subhub_visual_title: '系列入口（配图）',
                pc_context_browse_skus: '查看该分类全部 SKU',
                pc_context_all_categories: '全部分类',
                ap_page_role_hint: '可搜索、筛选的完整产品目录。需要按子系列浏览请前往「产品中心」。',
                ap_h1_all_products: '全部产品',
                ap_intro_lead: '浏览我们的全系列：广告帐篷、沙滩旗、展示系统、活动器材与 OEM 展示方案。本页帮助 B2B 客户在询价前快速对比分类、尺寸与适用场景。',
                ap_intro_keywords: '我们生产折叠广告帐篷、印刷沙滩旗、快幕秀背景、前台、灯箱及活动展示相关配件，支持批发与 OEM 项目。',
                ap_no_catalog_data: '产品目录暂不可用。请刷新页面，或通过页面底部方式联系以获取清单。',
                ap_browse_by_category: '按分类浏览',
                tent_type_seo_h1: '帐篷类型与规格指南',
                tent_type_seo_intro_1: '本页帮助您了解伟群广告帐篷的系列类型、框架选择、常见尺寸与面料/规格，适用于活动、促销商超、展览与户外品牌展示。便于批发与 OEM 客户对比折叠帐篷、充气帐篷与更大型活动篷房结构。',
                tent_type_seo_intro_2: '在打开产品详情或向工厂团队询价前，可在此先比较不同框架系列、尺寸、顶篷样式与常见用途。',
                tent_type_seo_type_param_note: '带 type 参数链接的网址会进入对应型号说明与画册参考。',
                tent_type_nav_lead: '常用入口：',
                tent_type_link_custom_canopy: '定制广告帐篷制造商',
                tent_type_link_all_canopy: '全部帐篷产品',
                tent_type_link_product_center_tents: '产品中心 — 帐篷',
                tent_type_error_not_found: '未找到该帐篷类型。',
                tent_type_breadcrumb_not_found: '未找到',
                tent_type_link_browse_tens: '浏览全部帐篷',
                tent_type_hub_lead_p: '本页概述伟群折叠广告帐篷 30/40/50 系列、常见米制尺寸、热转印顶/围布，以及向工厂询价的注意点。适合进口商、经销商、活动公司与展示采购对比 OEM 与批发方案。可通过下方系列卡片或前往<a href="product-center.html?cat=tents">产品中心—帐篷</a>查看全部分类排布。',
                tent_type_hub_h2_series: '折叠广告帐篷系列',
                tent_type_anchor_30: '30 方管快开篷',
                tent_type_hub_30_p: '30mm 方管铁架/铝架。尺寸从 1.5×1.5m 到 3×6m 常见规格，经济型走量款。',
                tent_type_anchor_40: '40 六角铝架',
                tent_type_hub_40_p: '40mm 六角管（视 SKU 有铁/铝），适用于展会、路演与更频繁拆装的场景。',
                tent_type_anchor_50: '50 六角重载铝架',
                tent_type_hub_50_p: '50mm 六角铝架，重载大跨度，适合大场面活动与对刚性要求更高的项目。',
                tent_type_hub_link_specs: '帐篷尺寸与参数',
                tent_type_hub_h2_compare: '30 / 40 / 50 怎么选',
                tent_type_hub_compare_p: '30 系列偏性价比与走量；40 系列在重量与强度之间更均衡；50 系列面向更大跨度和高承载。均可定制画面；MOQ 低、一般生产周期约 7–15 天、出口纸箱包装。<a href="custom-canopy-tent-manufacturer.html">定制广告帐篷</a>了解 OEM 流程。',
                tent_type_hub_h2_1010: '10×10 与 3×3 m',
                tent_type_hub_1010_p: '北美常见的 10×10 ft 可对应 3×3 m 公制展位；本系列 30/40/50 均可提供 3×3 m 类规格，但框架等级不同，请分系列比较后再定稿。可参阅 <a href="10x10-pop-up-canopy-tent.html">10×10 快开专题</a> 与 <a href="all-products.html?cat=tents">全部帐篷 SKU</a>。',
                tent_type_hub_h2_sizes: '常用帐篷尺寸',
                tent_type_hub_sizes_p: '按系列提供 1.5×1.5m 起至最大约 4×8m 等规格。打开 <a href="tent-type.html?type=folding30">30 系列</a>、<a href="tent-type.html?type=folding40">40 系列</a>、<a href="tent-type.html?type=folding50">50 系列</a> 看型号/重量表。',
                tent_type_hub_h2_print: '印刷与定制',
                tent_type_hub_print_p: '顶布、半围、全围支持热转印。篷架与布面可同一工作流排产。详见 <a href="custom-printed-canopy-tents.html">全彩广告帐篷</a> 专题页。',
                tent_type_related_pages_h2: '相关帐篷页面',
                tent_type_guides_h2: '相关采购与指南',
                tent_type_cta_quote: '获取报价',
                pc_meta_title_tents: '广告帐篷产品中心｜折叠篷系列与尺寸｜伟群',
                pc_meta_desc_tents: '伟群广告帐篷产品中心：浏览折叠篷系列、帐篷尺寸、定制印刷与 OEM 就绪方案，服务 B2B 采购。',
                pc_meta_title_flags: '沙滩旗与旗杆产品中心｜羽毛旗、水滴旗与底座｜伟群',
                pc_meta_desc_flags: '浏览伟群沙滩旗与旗杆产品中心：羽毛旗、水滴旗、旗杆套件、底座和出口包装方案，适合广告公司与活动采购。',
                pc_meta_title_displays: '展示系统产品中心｜背景墙、展示架与展会前台｜伟群',
                pc_meta_desc_displays: '伟群展示系统产品中心覆盖便携背景墙、拉网展架、张拉布展示、展会前台和配件，支持 OEM/ODM 定制。',
                pc_meta_title_lightbox: '灯箱产品中心｜SEG 拉布灯箱与广告灯箱｜伟群',
                pc_meta_desc_lightbox: '浏览伟群灯箱产品中心：SEG 拉布灯箱、展会灯箱和广告展示灯箱，适合品牌门店、展会和活动空间。',
                pc_meta_title_accessories: '帐篷与展示配件产品中心｜配重、侧墙、底座与备件｜伟群',
                pc_meta_desc_accessories: '查找伟群帐篷、旗帜和展示系统配件，包括配重、侧墙、收纳袋、旗座和替换零件，支持批量采购。',
                pc_meta_title_racegate: '赛事拱门产品中心｜充气拱门与活动门型展示｜伟群',
                pc_meta_desc_racegate: '浏览伟群赛事拱门产品中心：充气拱门、半圆门、V 型门和 O 型门，适合赛事、促销和户外活动。',
                pc_tent_cluster_h2: '相关帐篷与采购入口',
                pc_tent_cluster_html: '系列对比见 <a href="tent-type.html">广告帐篷系列指南</a>（30/40/50）。详询 <a href="custom-canopy-tent-manufacturer.html">定制广告帐篷</a>、<a href="all-products.html?cat=tents">全部帐篷</a>，沙滩旗与旗杆 <a href="all-products.html?cat=flags&amp;tag=beach-flag-poles">沙滩旗旗杆</a>。',
                home_core_tent_topic_html: '<a href="/zh/tent-type.html">折叠广告帐篷系列</a> · <a href="/zh/all-products.html?cat=tents">全部帐篷</a> · <a href="/zh/product-center.html?cat=tents">产品中心—帐篷</a>',
                ap_tent_topic_h2: '帐篷主题入口',
                ap_tent_topic_html: '工厂定制：<a href="/zh/custom-canopy-tent-manufacturer.html">定制广告帐篷</a> · 系列 <a href="/zh/tent-type.html">折叠广告帐篷类型</a> · 尺寸与 10×10 意图 <a href="/zh/10x10-pop-up-canopy-tent.html">10×10 快开</a> · <a href="/zh/product-center.html?cat=tents">产品中心—帐篷</a> · <a href="/zh/all-products.html?cat=tents">全部帐篷</a> · 沙滩旗 <a href="/zh/all-products.html?cat=flags&amp;tag=beach-flag-poles">旗杆</a>',
                ap_open_category_hub: '打开该分类总览（产品中心）',
                ap_open_type_hub: '打开系列专题页',
                pdp_back_to_listing: '返回上一页列表',
                category_not_available: '该分类暂未开放，已为你显示全部分类。',
                // Products 下拉菜单
                menu_tents: '帐篷',
                menu_custom_tents: '定制帐篷',
                menu_stock_tents: '现货帐篷',
                menu_beach_flags: '沙滩旗及旗杆',
                nav_beach_flag_poles: '沙滩旗杆',
                menu_popup_displays: '展示系统',
                menu_popup_backdrop: '快幕秀布拉网 / 背景墙',
                menu_popup_counter: '快幕秀前台 / 张拉布前台',
                menu_popup_fabric_banner_stands: '立牌系列',
                menu_popup_tfd_accessories: '配件系列',
                menu_popup_tfd_straight_line_series: '直型系列',
                menu_popup_tfd_c_shaped_series: 'C型系列',

                menu_displays_roll_up_stand: '易拉宝',
                menu_displays_promotion_counter: '促销台',

                pdp_optional_accessories: '可选配件',
                menu_displays_aframe: 'A字架展示架',
                menu_displays_aframe_backdrop: '万能架背景系统',
                menu_accessories: '配件',
                menu_racegate: '竞速拱门',
                nav_racegate_sub_v: 'V型拱门',
                nav_racegate_sub_o: 'O型拱门',
                nav_racegate_sub_semi: '半圆型拱门',
                pc_racegate_browse_all: '浏览全部赛事拱门产品',
                menu_replacement_parts: '替换零件',
                category_view_all: '查看该类全部',
                category_search_products: '去搜索产品',
                view_details: '查看详情',
                tents_hub_folding_title: '折叠帐篷',
                tents_hub_event_title: '活动帐篷',
                tents_hub_accessories_title: '帐篷配件（全系列）',
                flags_hub_poles_title: '沙滩旗与旗杆',
                flags_hub_accessories_title: '沙滩旗底座与配件',
                flags_hub_special_title: '背包旗与街旗/展示旗',
                view_type_button: '查看该类型',
                tent_types_title: '帐篷类型',
                view_tent_type: '查看该类型',
                tent_type_no_match: '该类型暂未关联到具体产品。',
                products_no_results: '未找到匹配的产品',
                products_page_retired_title: '此页面已迁移',
                products_page_retired_text: '请访问：',

                // Accessories page
                accessories_page_title: '配件',
                accessories_search_placeholder: '搜索配件',
                accessories_page_intro: '向下浏览配件并点击查看参数。',
                accessories_coming_soon: '正在整理',
                accessories_overview_alt: '配件概览',
                accessories_open_full_page: '打开配件专题页',

                // Buttons
                btn_back: '返回',

                // ARIA labels
                aria_search: '搜索',
                aria_cart: '询价清单',
                aria_language: '语言',
                aria_select_language: '选择语言',
                aria_breadcrumb: '面包屑导航',

                // Language names
                lang_name_en: 'English',
                lang_name_zh: '中文',

                // Common buttons
                download_materials: '下载资料',

                // Common labels
                label_model: '型号',

                // View-type pages
                flag_type_not_found: '未找到该旗帜类型。',

                // Nav extras
                nav_top3_sizes: '热销前三尺寸',

                // Six-sided booth page
                six_sided_booth_name: '六边促销展示台',
                six_sided_booth_title: '六边促销展示台（圆顶）',
                six_sided_booth_specs: '型号：WK-T80B｜材质：铁｜尺寸：3×3M｜重量：60KG',
                six_sided_booth_images_title: '产品图片',

                // Legal / disclaimer
                third_party_trademarks_disclaimer:
                    '本网站中出现的第三方商标、标识及品牌名称均归其各自权利人所有。\n'
                    + '其展示仅用于产品示例或识别说明，不构成任何形式的授权、合作或背书关系。',

                // Cookie consent
                cookie_title: 'Cookie 设置',
                cookie_text: '我们使用 Cookie 来保障网站正常运行，并在您同意的情况下用于偏好与分析，以改善体验。您可以随时调整设置。',
                cookie_accept_all: '全部接受',
                cookie_reject_all: '全部拒绝',
                cookie_customize: '自定义',
                cookie_settings_title: 'Cookie 偏好设置',
                cookie_category_necessary: '必要 Cookie（始终启用）',
                cookie_category_preferences: '偏好 Cookie（例如：客户识别）',
                cookie_category_analytics: '统计分析 Cookie',
                cookie_save: '保存设置',
                cookie_close: '关闭',

                // Common UI attributes
                brand_since_2010: '始于2010',
                form_submit_success: '感谢您的留言，我们已收到，将尽快与您联系。',

                // Products dropdown extras
                menu_table_chair_stool_toilet: '桌 / 椅 / 凳 / 厕所',
                menu_dome_3_folders: 'DOME 3 折叠系列',
                btn_add_to_inquiry: '加入询价清单',
                type_page_loading_catalog: '正在加载型号…',
                view_type_intro_furniture:
                    '折叠桌、椅、凳与便携厕所等户外家具，适用于展会、路演、露营与临时活动；支持 OEM/ODM、批量包装与出口验货。下方型号均可加入询价清单。',
                view_type_intro_dome:
                    'DOME 3 折叠系列涵盖车顶帐篷、更衣帐篷及折叠收纳篮等，便于运输与快速部署；支持按项目确认规格与装箱。下方型号均可加入询价清单。',
                ap_listing_group_furniture_note: '当前为「桌 / 椅 / 凳 / 厕所」聚合列表。',
                ap_listing_group_dome_note: '当前为「DOME 3 折叠系列」聚合列表（含帐篷与收纳家具类目下的同系列 SKU）。',
                view_type_link_all_dome_skus: '查看本系列全部 SKU（全部产品）',

                // View-type pages
                view_type_models: '型号清单',
                view_type_brochure_ref: '产品画册参考',
                view_type_brochure_source_17: '来源：产品画册第 17 页 — images/广西伟群帐篷制造有限公司2025allpagepng/17.png',
                view_type_brochure_source_dome: '来源：产品画册参考（示意图，以选型表为准）',
                view_type_brochure_source_19: '来源：目录图片 19.png',
                view_type_brochure_source_20: '来源：目录图片 20.png',
                view_type_brochure_source_25: '来源：目录图片 25.png',
                view_type_page_title_furniture: '桌 / 椅 / 凳 / 厕所',
                view_type_page_title_dome: 'DOME 3 折叠系列',
                view_type_subtitle: '型号清单与画册参考（可点击图片放大）。',
                view_type_browse_all_tents: '查看全部帐篷',
                view_type_browse_all_furniture: '查看全部家具',
                view_type_browse_all_furniture_products: '查看全部家具产品',
                
                // 面包屑和搜索
                breadcrumb_home: '首页',
                breadcrumb_products: '产品中心',
                search_overlay_title: '搜索产品',
                search_overlay_button: '搜索',
                products_search_placeholder: '搜索产品（名称/关键词/规格）',
                filters_title: '筛选',
                filters_clear: '清空',
                filters_category: '产品类目',
                filters_quick_tags: '热门关键词',
                sort_by: '排序',
                sort_popular: '最受欢迎',
                sort_new: '最新',
                sort_name: '名称 A–Z',
                
                // 产品分类
                product_categories_title: '产品分类',
                category_tents_desc: '专业帐篷产品，适用于各种活动场景',
                category_flags_desc: '沙滩旗、横幅等广告展示产品',
                category_popup_desc: '快速搭建的展示系统',
                category_furniture_desc: '可折叠桌椅等户外家具',
                category_tablecloths_desc: '对折桌等配套桌布与罩布',
                category_frames_desc: '专业帐篷框架和配件',
                category_custom_desc: '根据需求定制专属产品',
                
                // 服务范围
                services_title: '服务范围',
                services_subtitle: '全方位的户外家具制造服务，从设计到成品',
                service_design: '设计服务',
                service_design_desc: '专业的产品设计团队，为您打造独特的户外家具解决方案',
                service_manufacturing: '制造服务',
                service_manufacturing_desc: '先进的制造设备，确保每一个户外家具产品都完美呈现',
                service_customization: '定制服务',
                service_customization_desc: '专业的产品定制服务，满足您的特殊需求和品牌要求',
                service_delivery: '配送服务',
                service_delivery_desc: '快速、安全的物流配送，确保帐篷产品及时送达',
                
                // 联系我们
                contact_title: '联系我们',
                contact_subtitle: '我们期待与您的合作',
                contact_page_h1: '联系我们',
                contact_page_spec_line: '请注明产品类型、尺寸、数量、目标市场与印刷要求，便于我们更快报价。',
                contact_page_final_title: '需要快速报价？',
                contact_page_final_sub: '发送规格后，我们在 24 小时内回复。',
                home_contact_compact_h2: '询价与项目咨询',
                home_contact_compact_p: '获取完整工厂联系、地图与询价表单，请前往联系我们页面。',
                home_contact_compact_spec: '建议说明：产品类型、尺寸、数量、印刷与交付要求。',
                home_contact_sticky_aria: '获取报价 — 前往联系页面',
                contact_info_title: '联系方式',
                contact_seo_text: '欢迎联系广西伟群帐篷制造有限公司，洽谈定制帐篷、旗帜与展示项目需求。',
                contact_address_label: '公司地址',
                contact_address_title: '地址',
                contact_address_value: '中国广西壮族自治区玉林市陆川县牛角冲，邮政编码：537609',
                contact_address: '中国广西壮族自治区玉林市陆川县牛角冲，邮政编码：537609',
                contact_location_title: '我们的位置',
                contact_open_in_maps: '在 Google 地图中打开',
                contact_address_en: '中国广西壮族自治区玉林市陆川县牛角冲，邮政编码：537609',
                contact_opening_hours_title: '营业时间',
                contact_opening_hours_line1: '周一至周五：8:00–18:00',
                contact_opening_hours_line2: '周六、周日：请提前预约',
                contact_phone_label: '联系电话',
                contact_phone_title: '联系电话',
                contact_email_label: '电子邮箱',
                contact_email_title: '电子邮箱',
                contact_qr_title: '扫码联系',
                whatsapp_label: 'WhatsApp',
                contact_whatsapp_title: 'WhatsApp',
                contact_whatsapp_note: '扫码添加 WhatsApp 咨询',
                wechat_label: 'WeChat',
                contact_wechat_title: '微信',
                contact_wechat_note: '扫码添加微信咨询',
                
                // 表单
                contact_form_name: '您的姓名',
                contact_form_email: '您的邮箱',
                contact_form_phone: '联系电话',
                contact_form_message: '您的需求',
                contact_form_submit: '发送消息',
                form_name: '您的姓名',
                form_email: '您的邮箱',
                form_phone: '联系电话',
                form_message: '您的需求',
                form_submit: '发送消息',
                
                // Inquiry Form (B2B High-Conversion)
                inquiry_form_title: '获取报价',
                inquiry_form_subtitle: '告诉我们您的项目需求，我们的团队将在24小时内回复您。',
                inquiry_form_reset: '重置',
                inquiry_form_unconfigured: '表单提交功能尚未接入。请先通过 WhatsApp 或邮箱联系我们，我们会在 24 小时内回复。',

                contact_form_title: '获取报价',
                contact_promise_24h: '我们将在 24 小时内回复（工作日更快）。',
                contact_reply_24h_success: '消息已发送。我们将在 24 小时内回复。',

                // Contact funnel trust (What happens next)
                contact_next_title: '联系我们之后会发生什么？',
                contact_next_step1_title: '需求确认',
                contact_next_step1_desc: '我们确认产品规格、数量及使用场景。',
                contact_next_step2_title: '24 小时内报价',
                contact_next_step2_desc: '销售团队将在 24 小时内提供工厂直供报价。',
                contact_next_step3_title: '安排打样或生产',
                contact_next_step3_desc: '确认后安排打样或生产。',

                // Trust bullets near form
                trust_factory_direct: '源头工厂直供',
                trust_no_middleman: '无中间商',
                trust_oem_odm: '支持 OEM / ODM',
                trust_export_experience: '具备全球市场出口经验',

                // Standardized inquiry fields
                inquiry_field_product_label: '产品 *',
                inquiry_field_product_placeholder: '请选择或输入产品类别',
                inquiry_field_quantity_label: '数量 *',
                inquiry_field_quantity_placeholder: '请输入预估数量',
                inquiry_field_market_label: '目标市场 / 国家 *',
                inquiry_field_market_placeholder: '例如：美国 / 欧盟 / 澳大利亚',
                inquiry_field_message_label: '留言（选填）',
                inquiry_field_message_placeholder: '可填写：尺寸、用途、交期、LOGO 印刷要求等',
                inquiry_helper_quantity_example: '例如：50 / 100 / 500 件',
                inquiry_helper_size_example: '如适用，请注明尺寸',
                inquiry_form_name: '您的姓名 *',
                inquiry_form_email: '您的邮箱 *',
                inquiry_form_company: '公司名称',
                inquiry_form_country: '国家/地区 *',
                inquiry_form_product_placeholder: '产品类别 *',
                inquiry_form_product_tent: '帐篷',
                inquiry_form_product_flag: '沙滩旗',
                inquiry_form_product_display: '展示系统',
                inquiry_form_product_custom: '定制展示解决方案',
                inquiry_form_quantity_placeholder: '预估数量',
                inquiry_form_quantity_sample: '样品订单',
                inquiry_form_quantity_10_50: '10 – 50 件',
                inquiry_form_quantity_50_200: '50 – 200 件',
                inquiry_form_quantity_200: '200+ 件',
                inquiry_form_printing_placeholder: '需要定制印刷吗？',
                inquiry_form_printing_yes: '是',
                inquiry_form_printing_no: '否',
                inquiry_form_customer_placeholder: '我是...',
                inquiry_form_customer_brand: '品牌方',
                inquiry_form_customer_distributor: '经销商/批发商',
                inquiry_form_customer_project: '活动/项目采购方',
                inquiry_form_message: '请描述您的需求（尺寸、用途、时间等）*',
                inquiry_form_submit: '发送询盘',
                inquiry_form_sending: '提交中...',
                inquiry_form_note: '我们尊重您的隐私。您的信息仅用于回复您的询盘。',
                inquiry_form_success: '消息已发送。我们将在24小时内回复。',
                inquiry_form_failed: '发送失败。请稍后重试。',

                // UI
                ui_copy: '复制',
                ui_copied: '已复制！',
                ui_items_unit: '个',
                ui_tip_cart_items: '提示：以下条目来自您的询价清单，可在此修改数量。',
                ui_tip_cart_empty: '提示：询价清单为空。已展示筛选后的热门产品。为获取更精准报价，请先将产品加入询价清单。',
                ui_copy_wechat_id: '复制微信号',
                ui_overview: '概览',

                // Specs
                spec_col_model: '型号',
                spec_col_size: '尺寸',
                spec_col_weight: '重量',

                // View-type pages
                view_type_no_items_yet: '该系列暂无产品（数据尚未录入）。',
                contact_seo_footer: '正在寻找可靠的定制帐篷、旗帜或展示系统制造商？立即联系伟群，讨论您的项目需求。',
                
                // Logo Badge
                logo_since: '始于2010',
                
                // 页脚
                footer_desc: '专业的户外家具制造服务提供商，致力于为客户提供最优质的产品和服务。',
                footer_links_title: '快速链接',
                footer_contact_title: '联系方式',
                footer_rights: '保留所有权利。',
                footer_follow_us: '关注我们',
                social_facebook: 'Facebook',
                social_linkedin: '领英',
                social_instagram: 'Instagram',
                social_tiktok: 'TikTok',
                social_xiaohongshu: '小红书',
                
                // PDF下载
                pdf_download_title: '下载产品资料',
                pdf_download_desc: '点击下方按钮下载完整的产品目录和公司介绍。',
                btn_download_pdf: '下载PDF',
                btn_get_quote: '获取报价',
                btn_download: '下载',
                btn_add_to_cart: '加入询价清单',
                
                // 询价清单（RFQ，非零售购物车）
                cart_title: '询价清单（RFQ）',
                cart_total: '件数：',
                cart_clear: '清空清单',
                cart_checkout: '填写询价',
                cart_empty: '询价清单为空',
                rfq_cart_title: '询价清单（RFQ）',
                rfq_cart_empty: '询价清单为空',
                rfq_cart_clear: '清空清单',
                rfq_cart_request_quote: '填写询价',
                rfq_cart_item_count_label: '件数',
                rfq_cart_added_toast: '已加入询价清单：{name}',
                rfq_cart_added_variant_toast: '已加入询价清单',
                rfq_cart_added_short: '已加入询价清单',
                rfq_cart_view_product: '查看产品',
                add_to_rfq: '加入询价',
                rfq_variant_col: '加入询价',
                rfq_line_sku: 'SKU',
                rfq_line_model: '型号',
                rfq_variant_size: '尺寸',
                rfq_variant_weight: '重量',
                rfq_variant_graphic: '画面',
                rfq_variant_carton: '装箱',
                
                // Contact Bottom (Signazon-style)
                footer_company_line_cn: '广西伟群帐篷制造有限公司',
                footer_company_line_en: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_contact_brand_primary: '广西伟群帐篷制造有限公司',
                footer_contact_brand_secondary: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_findus: '地址',
                footer_address: '中国广西壮族自治区玉林市陆川县牛角冲<br>邮政编码：537609',
                footer_contact: '联系',
                footer_companyinfo: '公司信息',
                footer_about: '关于我们',
                footer_products: '产品中心',
                footer_contactus: '联系我们',
                footer_ask_title: '产品与设计咨询',
                footer_ask_text: '请告诉我们产品类型、尺寸、数量与印刷需求，我们将在 24 小时内回复。',
                footer_ask_btn: '获取报价',
                footer_ask_btn2: 'WhatsApp',
                footer_copyright: '© 2026 广西伟群帐篷制造有限公司 保留所有权利',
                footer_terms: '使用条款',
                footer_privacy: '隐私政策',
                footer_sitemap: '站点地图',
                
                // 产品详情页标签
                tab_desc: '产品描述',
                tab_specs: '技术参数',
                tab_apps: '应用场景',
                tab_download: '资料下载',
                related_products: '相关产品',
                product_not_found_title: '未找到该产品',
                product_not_found_desc: '该产品不存在或链接无效。',
                back_to_products: '返回产品列表',
                models_and_specs: '型号与参数',
                no_specs: '暂无技术参数',
                default_applications: '适用于各种户外活动和展览展示场景',
                download_contact_us: '请联系我们获取详细产品资料',
                no_related_products: '暂无相关产品'
            },
            en: {
                // Navigation
                nav_home: 'Home',
                nav_about: 'About Us',
                nav_products: 'Products',
                nav_services: 'Services',
                nav_contact: 'Contact',
                nav_faq: 'FAQ',
                nav_about_us: 'About Us',
                nav_factory_strength: 'Factory Strength',
                nav_core_categories: 'Core Categories',
                nav_why_choose_us: 'Why Choose Us',

                // Top-level mobile nav sections (accordion)
                nav_section_products: 'Products',
                nav_section_solutions: 'Solutions',
                nav_section_customer_service: 'Customer Service',
                nav_cat_tents: 'Canopy Tents',
                nav_cat_flags_poles: 'Flags & Poles',
                nav_cat_displays: 'Display Systems',
                nav_light_boxes_nav: 'Light Boxes',
                nav_cat_accessories: 'Accessories',
                nav_oem_odm: 'OEM / ODM',
                nav_sol_canopy: 'Custom Canopy Tents',
                nav_sol_beach_flags: 'Beach Flag Supplier',
                nav_sol_portable_display: 'Portable Display Systems',
                nav_news_resources: 'News & Resources',
                nav_follow_us: 'Follow Us',
                nav_site_map: 'Site Map',

                // Language gate
                language_gate_title: 'Welcome',
                language_gate_desc: 'Please select your language',

                // All Products
                products_cat_all: 'All Categories',

                // Listing spec tags
                spec_sizes_sml: 'Sizes: S / M / L',
                spec_print_single_double: 'Print: Single / Double',
                spec_base_options: 'Base Options',
                spec_sizes_prefix: 'Sizes:',
                spec_weight_prefix: 'Weight:',
                spec_sizes_default: 'Sizes: 3×3m / 3×6m',
                spec_custom_print: 'Custom Print',
                spec_display_width: 'Width: 3m / 4m / 5m',
                spec_display_height: 'Height: 2.3m',
                spec_display_shapes: 'Straight / Curved',
                spec_customizable: 'Customizable',
                
                // Company Info
                company_name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd',
                tagline: 'Professional Source Manufacturer of Tents, Flags & Portable Display Systems',
                
                // Homepage
                hero_badge: 'Professional Manufacturing',
                hero_title: 'Professional Source Manufacturer of Tents, Flags & Portable Display Systems',
                hero_subtitle: 'Delivering reliable, customizable and easy-to-install tent and display solutions for global brands, distributors and project clients. OEM and ODM services available.',
                btn_explore: 'Explore Products',
                btn_contact: 'Contact Us',

                // Homepage (2026 redesign)
                home_hero_primary_cta: 'Get Quote',
                home_hero_secondary_cta: 'View Products',

                home_hero_1_kicker: 'Canopy Tent Manufacturer · OEM/ODM',
                home_hero_1_title: 'Custom Canopy Tents & Pop Up Canopy Tents',
                home_hero_1_subtitle: 'Factory-direct custom printed canopies and event tents for trade shows, markets and outdoor promos—aluminum or steel frames, sidewalls and export-ready packing.',

                home_hero_2_kicker: 'Beach Flags · High Visibility',
                home_hero_2_title: 'Advertising Flag Systems That Convert',
                home_hero_2_subtitle: 'Feather / teardrop / rectangle flags with multiple bases and pole materials for different venues.',

                home_hero_3_kicker: 'Display Systems · Fast Setup',
                home_hero_3_title: 'Portable Display Backdrops',
                home_hero_3_subtitle: 'Lightweight structure with replaceable graphics — ideal for trade shows, stages and brand presentation.',

                home_hero_0_kicker: 'Source Manufacturing · B2B Export',
                home_hero_0_title: 'Tents, Beach Flags & Portable Display Systems',
                home_hero_0_subtitle: 'OEM/ODM for distributors, event teams and global brands—custom printing, engineered frames and export-ready packing from one factory team.',
                home_hero_trust_1: 'OEM / ODM',
                home_hero_trust_2: 'Factory Direct',
                home_hero_trust_3: 'Export Worldwide',
                home_hero_trust_aria: 'Key manufacturing trust signals',

                home_core_routes_title: 'Three product lines to start your RFQ',
                home_core_routes_subtitle: 'Image-led entry points for canopy programs, flag hardware and display/lightbox systems.',
                home_core_entrance_tent_title: 'Canopy Tents',
                home_core_entrance_tent_desc: 'Custom printed pop-up and folding programs for trade shows, field marketing and channel rollouts.',
                home_core_entrance_flags_title: 'Beach Flags & Poles',
                home_core_entrance_flags_desc: 'Feather, teardrop and promo flags with engineered poles, bases and outdoor-ready kits.',
                home_core_entrance_combined_title: 'Display Systems & Light Boxes',
                home_core_entrance_combined_desc: 'Tension backdrops, pop-up systems, promotion counters and SEG light boxes for exhibitions, retail and roadshows.',
                home_view_range: 'View range',
                home_get_quote_short: 'Get quote',
                home_about_learn_cta: 'See factory & capabilities',

                home_featured_solutions_title: 'Featured solutions & fast paths',
                home_featured_solutions_subtitle: 'High-intent entry pages for common footprints, print programs, frames and show hardware.',
                home_solution_1010_title: '10×10 Pop Up Canopy Tent',
                home_solution_1010_desc: '3×3 m-class footprint for US/CA quoting and test orders.',
                home_solution_print_title: 'Custom Printed Canopy Tents',
                home_solution_print_desc: 'Branded roof, valance and sidewall programs in one quote.',
                home_solution_alu_title: 'Aluminum Folding Tent',
                home_solution_alu_desc: 'Lightweight, corrosion-resistant frames for repeat field setup.',
                home_solution_flags_title: 'Feather & Teardrop Beach Flags',
                home_solution_flags_desc: 'High-visibility flag kits with bases for outdoor and indoor venues.',
                home_solution_seg_title: 'SEG Light Box',
                home_solution_seg_desc: 'Backlit, replaceable fabric faces for showrooms and exhibits.',
                home_solution_tension_title: 'Tension Fabric Backwall',
                home_solution_tension_desc: 'Portable frame + stretch graphic walls for quick booth backdrops.',

                home_applications_title: 'Industries & use cases',
                home_applications_subtitle: 'Where teams deploy WaiKwan hardware beyond the catalog list.',
                home_app_retail_title: 'Retail & brand activations',
                home_app_retail_desc: 'In-store, sidewalk and pop-up promos with portable graphics.',
                home_app_retail_cta: 'Displays & portable systems',
                home_app_events_title: 'Events & promotions',
                home_app_events_desc: 'Roadshows, street fairs and field marketing with fast pack/unpack.',
                home_app_events_cta: 'Event canopy programs',
                home_app_tradeshow_title: 'Trade shows & exhibitions',
                home_app_tradeshow_desc: 'Booth backdrops, counters and backlit systems for show calendars.',
                home_app_tradeshow_cta: 'Exhibition canopy solutions',

                home_inquiry_teaser_title: 'Request a project quote',
                home_inquiry_teaser_subtitle: 'Share product type, size, quantity and print stage—our team usually replies within 24 hours on business days.',
                home_inquiry_teaser_btn: 'Open the inquiry form',
                home_inquiry_teaser_chat: 'WhatsApp (fastest)',
                home_inquiry_teaser_promise: 'We usually reply with next-step questions or a ballpark within one business day.',
                home_seo_footnav_title: 'Internal hubs & spec shortcuts',
                home_seo_footnav_html:
                    '<a href="canopy-tents.html">Canopy tents overview</a> · <a href="pop-up-canopy-tents.html">Pop up canopies</a> · <a href="custom-canopy-tent-manufacturer.html">Custom canopy OEM</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 pop up</a> · <a href="aluminum-folding-tent.html">Aluminum folding tent</a> · <a href="beach-flag-supplier.html">Beach flags</a> · <a href="portable-display-systems.html">Portable displays</a> · <a href="tension-fabric-backwall.html">Tension backwall</a> · <a href="seg-light-box-manufacturer.html">SEG light box</a> · <a href="product-center.html?cat=tents">Tents — product center</a> · <a href="product-center.html?cat=flags">Flags</a> · <a href="all-products.html">All products</a>',

                // New top-level categories
                category_advertising_arch: 'Advertising Arch',
                category_water_filled_a_poster_stand: 'Water Filled A Poster Stand',
                cat_advertising_arch_title: 'Advertising Arch',
                cat_advertising_arch_desc: 'Advertising arches for races and events with multiple size options (per catalog).',
                cat_water_filled_a_poster_stand_title: 'Water Filled A Poster Stand',
                cat_water_filled_a_poster_stand_desc: 'Fillable base for stability, great for outdoor sidewalk and storefront promotions.',

                home_popular_categories_title: 'Core Product Categories',
                home_popular_categories_subtitle: 'Custom canopy tents and pop-up canopies are our core commercial line—then beach flags, display systems, and event add-ons.',
                discover_hub_title: 'Product Center',
                discover_hub_desc: 'Browse ranges & sub-series by group',
                discover_catalog_title: 'All Products',
                discover_catalog_desc: 'Search & filter the full SKU list',
                home_cat_cta: 'Browse Category',
                home_cat_cta_hub: 'Open category overview',
                home_cat_browse_catalog: 'Browse all SKUs in this category',
                home_cat_tents_title: 'Canopy Tents',
                home_cat_tents_desc: 'Custom printed canopies, pop-up frames (aluminum / steel) and event-use tents—OEM/ODM from factory.',
                home_cat_flags_title: 'Flags & Poles',
                home_cat_flags_desc: 'Feather/teardrop/rectangle flags with pole and base systems.',
                home_cat_displays_title: 'Display Systems',
                home_cat_displays_desc: 'Portable backdrops and display solutions for exhibitions and events.',
                home_cat_lightbox_title: 'Light Boxes',
                home_cat_lightbox_desc: 'Portable light box displays with replaceable graphics and customization options.',
                home_cat_racegate_title: 'RaceGate / Advertising Arch',
                home_cat_racegate_desc: 'Portable event gates for races and promotions in multiple sizes.',
                home_cat_accessories_title: 'Accessories',
                home_cat_accessories_desc: 'Sidewalls, weights, bags, connectors and add-ons.',

                home_canopy_priority_title: 'Canopy tents — factory programs',
                home_canopy_priority_hint: 'B2B entry points: overview, pop-up family, category hub, OEM pages, and SKUs.',
                home_canopy_pri_hub: 'Canopy tents overview',
                home_canopy_pri_pop_generic: 'Pop-up canopy tents',
                home_canopy_pri_all_skus: 'All canopy tent SKUs',
                tents_hub_buyer_intro_title: 'How to choose',
                tents_hub_buyer_intro_p: 'Start with frame family and printing needs; read the manufacturer page for OEM scope, then open SKUs or series pages for specifics.',
                nav_sub_canopy_custom_printed: 'Custom printed canopy tents',
                nav_sub_canopy_pop_mfg: 'Pop up canopy tent manufacturer',
                nav_sub_canopy_event_tents: 'Event canopy tents',
                nav_sub_canopy_aluminum_frames: 'Aluminum folding canopy tents',
                pdp_tent_b2b_title: 'Complete your event setup (tell us in one RFQ)',
                pdp_tent_b2b_lead: 'Pair tents with beach flags, tension-fabric backwalls, table covers and light boxes from the same factory for aligned graphics and export packing.',
                page_title_pop_up_mfg: 'Pop Up Canopy Tent Manufacturer | WaiKwan',
                landing_pop_up_mfg_h1: 'Pop Up Canopy Tent Manufacturer',
                page_title_custom_printed_canopy: 'Custom Printed Canopy Tents | WaiKwan',
                landing_custom_printed_canopy_h1: 'Custom Printed Canopy Tents',
                page_title_canopy_hub: 'Commercial Canopy Tents | 30/40/50 Series & OEM Export | WaiKwan',
                page_title_pop_canopy_hub: 'Pop Up Canopy Tents | Folding Event Canopies B2B | WaiKwan',
                page_title_event_canopy: 'Event & Trade Show Canopy Tents | OEM Printing & Export | WaiKwan',
                landing_event_canopy_h1: 'Event and trade show canopy tents',
                landing_pop_up_mfg_p1_html: '<p>WaiKwan supplies pop up canopy tent frames and printed canopies for distributors, agencies and brands—OEM/ODM, sidewalls and accessories as needed.</p>',
                landing_pop_up_mfg_p2_html: '<p>Bundle with <a href="/product-center.html?cat=flags">beach flags</a>, <a href="/all-products.html?cat=displays&amp;sub=tension-fabric">tension-fabric backwalls</a> and <a href="/product-center.html?cat=lightbox">light boxes</a> for a consistent event kit. For broader OEM scope, start at <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a>.</p>',
                landing_custom_printed_p1_html: '<p>Custom printed canopy tents carry branding on the roof, valance and sidewalls where the fabric layout allows. We confirm artwork, materials and add-ons per project.</p>',
                landing_custom_printed_p2_html: '<p>For a deeper OEM read, see <a href="/seo/custom-printed-canopy-tent-manufacturer-oem-china.html">custom printed canopy tent manufacturer (OEM China)</a>; browse SKUs under <a href="/all-products.html?cat=tents">all products — tents</a>.</p>',
                landing_event_canopy_p1_html: '<p>Trade shows, markets and outdoor promotions need fast setup and portable branding. Folding canopy tents with printed tops and optional walls are a standard field solution.</p>',
                landing_event_canopy_p2_html: '<p>MOQ and lead time depend on print scope—see <a href="/seo/folding-event-tent-supplier-wholesale-moq.html">folding event tent wholesale MOQ</a> or <a href="/contact-us.html#getQuoteForm">request a quote</a> with quantities and dates. Browse <a href="/canopy-tents.html">canopy tents overview</a>, <a href="/pop-up-canopy-tents.html">pop-up canopy tents</a>, or the <a href="/product-center.html?cat=tents">tent category hub</a>.</p>',
                landing_event_canopy_trade_show_h2: 'Trade shows & exhibitions',
                landing_event_canopy_trade_show_html:
                    '<p>Exhibitor programs often need <strong>repeatable setup</strong> with consistent branding on roofs, valances and walls. Start from the <a href="/canopy-tents.html">canopy tents overview</a>, then see <a href="/seo/trade-show-canopy-tent-manufacturer-for-distributors.html">trade show canopy tent manufacturer for distributors</a> for program-level notes.</p>',
                landing_event_canopy_outdoor_h2: 'Markets, roadshows & outdoor promotions',
                landing_event_canopy_outdoor_html:
                    '<p>Outdoor activations emphasize transport, fast deployment and ballasting. Review <a href="/pop-up-canopy-tents.html">pop up canopy tents</a> and supporting guides such as <a href="/seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html">outdoor advertising tent OEM</a> and <a href="/seo/commercial-grade-pop-up-canopy-wholesale-supplier.html">commercial grade pop up canopy wholesale</a>, plus <a href="/products-accessories.html">sidewalls, weights &amp; bags</a>.</p>',
                landing_event_canopy_quick_links_html:
                    'Also see: <a href="/pop-up-canopy-tents.html">pop up canopy tents</a> · <a href="/10x10-pop-up-canopy-tent.html">10×10 footprint</a> · <a href="/custom-canopy-tent-manufacturer.html">OEM manufacturer</a> · <a href="/aluminum-folding-tent.html">aluminum folding tent</a>',
                landing_event_canopy_trust_h2: 'Factory support for event programs',
                landing_event_canopy_trust_html:
                    '<p>WaiKwan aligns frame grades, printing and accessories for <strong>trade shows, markets and outdoor promos</strong> so distributors can quote complete kits. For OEM terms, pair this page with <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a>.</p>'
                    + '<ul style="margin:0.6rem 0 0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><strong>Sampling &amp; bulk</strong> — <a href="/faq-moq.html">MOQ</a>, <a href="/faq-lead-time.html">lead time</a></li>'
                    + '<li><strong>Artwork &amp; color</strong> — <a href="/faq-artwork-files.html">files</a>, <a href="/faq-color-matching.html">color matching</a></li>'
                    + '<li><strong>Logistics</strong> — <a href="/faq-shipping.html">shipping &amp; export</a></li>'
                    + '</ul>',
                landing_event_canopy_faq_h2: 'Event buyer FAQs',
                landing_event_canopy_faq_1_q: 'Should I start at the canopy hub or the pop up page?',
                landing_event_canopy_faq_1_a_html:
                    '<p>Use the <a href="/canopy-tents.html">canopy tents overview</a> for the full catalog path; open <a href="/pop-up-canopy-tents.html">pop up canopy tents</a> when the buyer specifically wants folding instant canopies.</p>',
                landing_event_canopy_faq_2_q: 'Which footprints do teams quote most often?',
                landing_event_canopy_faq_2_a_html:
                    '<p><strong>3×3, 3×4.5 and 3×6 m</strong> cover most activations; US teams often begin with <a href="/10x10-pop-up-canopy-tent.html">10×10</a> before scaling to larger spans.</p>',
                landing_event_canopy_faq_3_q: 'What do we need for gusty outdoor sites?',
                landing_event_canopy_faq_3_a_html:
                    '<p>Plan ballast, stakes or anchors plus sidewall height; share surface type (grass, asphalt, hall) so we can recommend a series and hardware kit. See <a href="/products-accessories.html">accessories</a>.</p>',
                landing_event_canopy_faq_4_q: 'How should we estimate printing lead time?',
                landing_event_canopy_faq_4_a_html:
                    '<p>Lead time moves with print process and fabric readiness—prepare artwork early using <a href="/faq-artwork-files.html">artwork files</a> and confirm calendars via <a href="/faq-lead-time.html">lead time</a>.</p>',

                nav_sub_canopy_hub: 'Canopy tents overview',
                nav_sub_pop_canopy_tents: 'Pop up canopy tents (product family)',
                nav_sub_canopy_1010: '10×10 pop up canopy (3×3 m)',

                landing_canopy_hub_h1: 'Commercial canopy tents — sizes, series & custom printing (B2B)',
                landing_canopy_hub_lead_html:
                    '<p>WaiKwan supplies <strong>folding canopy tents and pop up canopies</strong> for distributors, agencies and brands. Stock frame families include common square-tube lines (such as 30/40/50 series in our catalog), with OEM printing, sidewalls and export-friendly packing available.</p>',
                landing_canopy_hub_series_html:
                    '<p>Browse SKUs in <a href="/all-products.html?cat=tents">all products — tents</a>; compare frame grades on <a href="/aluminum-folding-tent.html">aluminum folding tent</a> and economical iron stock lines via <a href="/tent-type.html?type=folding30">tent type — folding30</a>.</p>',
                landing_canopy_hub_topics_h2: 'Choose your next page',
                landing_canopy_hub_topics_html:
                    '<ul style="margin:0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><a href="/pop-up-canopy-tents.html">Pop up canopy tents</a> — product family primer</li>'
                    + '<li><a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> — common footprint</li>'
                    + '<li><a href="/aluminum-folding-tent.html">Aluminum folding tent / frame grades</a></li>'
                    + '<li><a href="/event-canopy-tents.html">Event &amp; trade show canopy tents</a></li>'
                    + '<li><a href="/custom-canopy-tent-manufacturer.html">Custom canopy tent manufacturer (OEM/ODM)</a></li>'
                    + '<li><a href="/custom-printed-canopy-tents.html">Custom printed canopy tents</a></li>'
                    + '<li><a href="/pop-up-canopy-tent-manufacturer.html">Pop up canopy tent manufacturer</a></li>'
                    + '<li><a href="/product-center.html?cat=tents">Tent category hub (product center)</a></li>'
                    + '</ul>',
                landing_canopy_hub_faq_h2: 'Buyer FAQs',
                landing_canopy_hub_faq_1_q: 'How do stock frames and custom printing work together?',
                landing_canopy_hub_faq_1_a_html:
                    '<p>Select a frame family and size first, then confirm roof/sidewall artwork and accessories—finals are fixed on the quote and spec sheet.</p>',
                landing_canopy_hub_faq_2_q: 'How do you confirm lead time and export packing?',
                landing_canopy_hub_faq_2_a_html:
                    '<p>Share destination, incoterms preference and target ship window. See <a href="/faq-lead-time.html">lead time</a> and <a href="/faq-shipping.html">shipping</a> for baseline guidance.</p>',
                landing_canopy_hub_faq_3_q: 'What artwork and color standards do you need?',
                landing_canopy_hub_faq_3_a_html:
                    '<p>See <a href="/faq-artwork-files.html">artwork files</a> and <a href="/faq-color-matching.html">color matching</a> before production proofs.</p>',
                landing_canopy_hub_faq_4_q: 'Which accessories matter for outdoor wind and ballasting?',
                landing_canopy_hub_faq_4_a_html:
                    '<p>Typical kits include sidewalls, sandbags or weight plates, stakes and roller bags. Share venue rules (grass vs concrete vs exhibition hall) so we can match the frame series and ballast plan. Start at <a href="/products-accessories.html">tent &amp; display accessories</a>.</p>',
                landing_canopy_hub_faq_5_q: 'Is 10×10 available across both steel-stock and aluminum programs?',
                landing_canopy_hub_faq_5_a_html:
                    '<p>10×10 ft (≈ 3×3 m) is a common footprint; availability depends on the active catalog series and print scope. Compare <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> with <a href="/aluminum-folding-tent.html">aluminum folding tent</a> for grade differences.</p>',
                landing_canopy_hub_faq_6_q: 'How do reorders stay compatible with the same frame series?',
                landing_canopy_hub_faq_6_a_html:
                    '<p>Share the prior PO, model code or connector photos so we can match square-tube families (30/40/50 series) and keep roof and wall attachments aligned.</p>',

                landing_canopy_hub_trust_h2: 'Factory-direct programs buyers use',
                landing_canopy_hub_trust_html:
                    '<p>Since 2010, WaiKwan builds export-oriented folding canopy tents with coordinated metal assembly, fabric printing and packing documentation.</p>'
                    + '<ul style="margin:0.6rem 0 0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><strong>Factory direct</strong> — frame and canopy workflows under one project owner</li>'
                    + '<li><strong>OEM / ODM</strong> — branded roofs/valances/walls, accessory bundles, neutral or private-label cartons</li>'
                    + '<li><strong>Export experience</strong> — sea/air/express; carton marking and basic document support</li>'
                    + '<li><strong>Fast RFQ turnaround</strong> — typically within ~24 hours when sizes, quantities and print stage are clear</li>'
                    + '</ul>',
                landing_canopy_hub_sizes_h2: 'Common sizes & imperial/metric mapping',
                landing_canopy_hub_sizes_html:
                    '<p>Frequent folding footprints include <strong>3×3 m, 3×4.5 m and 3×6 m</strong>; US buyers often describe the same needs as <strong>10×10, 10×15 or 10×20 ft</strong>. Compare <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> and <a href="/tent-type.html?type=folding40">metric folding frames</a>; full tables live in <a href="/product-center.html?cat=tents">stock tent sizes</a>.</p>',
                landing_canopy_hub_frames_h2: 'Frame grades: 30 / 40 / 50 series & aluminum lines',
                landing_canopy_hub_frames_html:
                    '<p>Square-tube families (30/40/50) generally map to different wall thickness and connector strength—use them to step from promo-duty cycles to heavier repeat setup. Review economical iron stock via <a href="/tent-type.html?type=folding30">folding30</a> and premium aluminum via <a href="/aluminum-folding-tent.html">aluminum folding tent</a>. Pair with the <a href="/pop-up-canopy-tents.html">pop up canopy tent</a> primer when buyers think in “instant canopy” terms.</p>',
                landing_canopy_hub_print_h2: 'Printing & branded artwork',
                landing_canopy_hub_print_html:
                    '<p>Roofs, valances and sidewalls can carry full-color branding where panel layout and tensioning allow. Send assets using <a href="/faq-artwork-files.html">artwork files</a> and confirm color with <a href="/faq-color-matching.html">color matching</a>. For printed size families, see <a href="/custom-printed-canopy-tents.html">custom printed canopy tents</a>.</p>',
                landing_canopy_hub_uses_h2: 'Where teams deploy canopies first',
                landing_canopy_hub_uses_html:
                    '<p><strong>Trade shows</strong> need repeatable setup—read <a href="/event-canopy-tents.html">event canopy tents</a> and <a href="/seo/trade-show-canopy-tent-manufacturer-for-distributors.html">trade show canopy tent manufacturer for distributors</a>. <strong>Markets and outdoor promos</strong> emphasize transport and ballasting; see <a href="/seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html">outdoor advertising tent OEM</a>.</p>',
                landing_canopy_hub_accessories_h2: 'Sidewalls, weights, bags & hardware',
                landing_canopy_hub_accessories_html:
                    '<p>List sidewall height, window needs, ballast type and whether roller bags should ship pre-assembled. One catalog entry point: <a href="/products-accessories.html">sidewalls, weights &amp; bags</a>.</p>',
                landing_canopy_hub_sourcing_h2: 'MOQ, lead time, packing & shipping',
                landing_canopy_hub_sourcing_html:
                    '<p>MOQ and production windows move with print process and fabric availability—read <a href="/faq-moq.html">MOQ</a>, <a href="/faq-lead-time.html">lead time</a> and <a href="/faq-shipping.html">shipping</a>; wholesale context in <a href="/seo/folding-event-tent-supplier-wholesale-moq.html">folding event tent wholesale MOQ</a>. Add destination port and target ship week in the RFQ.</p>',
                landing_canopy_hub_oem_h2: 'When to open the manufacturer pages',
                landing_canopy_hub_oem_html:
                    '<p>For program-level OEM terms, sampling plans and export documentation, pair this hub with <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a> and <a href="/pop-up-canopy-tent-manufacturer.html">pop up canopy tent manufacturer</a>.</p>',
                landing_canopy_hub_mid_cta_html:
                    '<p class="wk-disclaimer" style="margin:0;text-align:center;">Share target series (30/40/50 or aluminum), quantities and print stage to receive a consolidated quote.</p>',

                landing_pop_canopy_hub_h1: 'Pop up canopy tents',
                landing_pop_canopy_hub_lead_html:
                    '<p><strong>Pop up canopy tents</strong> use a collapsible folding frame with a tensioned fabric roof (and optional sidewalls). They are widely used for trade shows, promotions and outdoor branding. For <strong>factory OEM/ODM positioning</strong>, also read <a href="/pop-up-canopy-tent-manufacturer.html">pop up canopy tent manufacturer</a>.</p>',
                landing_pop_canopy_hub_body_html:
                    '<p>For sizing, start with <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> and <a href="/tent-type.html?type=folding40">metric folding frames</a>; for frame materials, see <a href="/aluminum-folding-tent.html">aluminum folding tent</a>. Topic hub: <a href="/canopy-tents.html">canopy tents overview</a>.</p>',
                landing_pop_canopy_hub_faq_h2: 'FAQs',
                landing_pop_canopy_hub_faq_1_q: 'How is this page different from the manufacturer page?',
                landing_pop_canopy_hub_faq_1_a_html:
                    '<p>This page focuses on the <strong>product family</strong>; the manufacturer page focuses on <strong>OEM programs, export and factory workflow</strong>.</p>',
                landing_pop_canopy_hub_faq_2_q: 'Can I reorder graphics without buying new frames?',
                landing_pop_canopy_hub_faq_2_a_html:
                    '<p>Often yes when the frame series stays the same—share prior order references so panel attachments stay compatible.</p>',
                landing_pop_canopy_hub_faq_3_q: 'How does this page relate to the canopy tents overview?',
                landing_pop_canopy_hub_faq_3_a_html:
                    '<p>The <a href="/canopy-tents.html">canopy tents overview</a> explains the full folding-tent catalog path; this page focuses on the <strong>pop up (folding) canopy family</strong> and how buyers specify it.</p>',
                landing_pop_canopy_hub_faq_4_q: 'Which size is the safest starting point for sampling?',
                landing_pop_canopy_hub_faq_4_a_html:
                    '<p><strong>3×3 m (~10×10 ft)</strong> is the most common sampling footprint; also evaluate <a href="/tent-type.html?type=folding40">3×4.5 m or 3×6 m</a> if the activation needs more depth. Details: <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a>.</p>',
                landing_pop_canopy_hub_faq_5_q: 'Where are artwork, color and logistics explained?',
                landing_pop_canopy_hub_faq_5_a_html:
                    '<p>Use <a href="/faq-artwork-files.html">artwork files</a>, <a href="/faq-color-matching.html">color matching</a>, <a href="/faq-lead-time.html">lead time</a> and <a href="/faq-shipping.html">shipping</a> before locking production proofs.</p>',

                landing_pop_canopy_hub_cluster_h2: 'Read next in the tent cluster',
                landing_pop_canopy_hub_cluster_html:
                    '<ul style="margin:0;padding-left:1.2rem;line-height:1.75;">'
                    + '<li><a href="/canopy-tents.html">Canopy tents overview</a></li>'
                    + '<li><a href="/10x10-pop-up-canopy-tent.html">10×10 (3×3 m) pop up canopy tent</a></li>'
                    + '<li><a href="/custom-canopy-tent-manufacturer.html">Custom canopy tent manufacturer (OEM/ODM)</a></li>'
                    + '<li><a href="/event-canopy-tents.html">Event &amp; trade show canopy tents</a></li>'
                    + '<li><a href="/faq-moq.html">MOQ</a> · <a href="/faq-lead-time.html">Lead time</a></li>'
                    + '</ul>',
                landing_pop_canopy_hub_more_h2: 'Sizes, frames, printing & logistics checklist',
                landing_pop_canopy_hub_more_html:
                    '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">Footprints</h3>'
                    + '<p style="margin:0 0 0.6rem;">Pop up lines commonly span <strong>3×3, 3×4.5 and 3×6 m</strong>, often quoted alongside <strong>10×10 ft</strong> specs. Browse SKUs via <a href="/all-products.html?cat=tents">all products — tents</a>.</p>'
                    + '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">Frames & series</h3>'
                    + '<p style="margin:0 0 0.6rem;">Square-tube <strong>30/40/50</strong> families and aluminum extrusion kits address different duty cycles. Compare <a href="/tent-type.html?type=folding30">folding30 iron stock</a> with <a href="/aluminum-folding-tent.html">aluminum folding tent</a>.</p>'
                    + '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">Printing & walls</h3>'
                    + '<p style="margin:0 0 0.6rem;">Roofs, valances and sidewalls can be printed per project; printable panels depend on the SKU. More: <a href="/custom-printed-canopy-tents.html">custom printed canopy tents</a>.</p>'
                    + '<h3 style="font-size:1.02rem;margin:0.8rem 0 0.35rem;">Accessories & export</h3>'
                    + '<p style="margin:0;">Weights, stakes, roller bags and export cartons can be quoted in one RFQ—see <a href="/products-accessories.html">accessories catalog</a>.</p>',
                landing_pop_canopy_hub_trust_h2: 'How WaiKwan supports B2B buyers',
                landing_pop_canopy_hub_trust_html:
                    '<p>We consolidate specs, printing approvals and packing marks for distributor workflows. For deeper OEM statements, keep <a href="/pop-up-canopy-tent-manufacturer.html">pop up canopy tent manufacturer</a> open in parallel.</p>',
                landing_pop_canopy_hub_mid_cta_html:
                    '<p class="wk-disclaimer" style="margin:0;text-align:center;">Add frame series targets, quantities and artwork stage so sampling and bulk orders stay aligned.</p>',

                landing_1010_hub_cluster_h2: 'Canopy tent topic cluster',
                landing_1010_hub_cluster_html:
                    '<p>Compare formats from the <a href="/canopy-tents.html">canopy tents overview</a> or <a href="/pop-up-canopy-tents.html">pop up canopy tents</a> hub; for frame detail see <a href="/aluminum-folding-tent.html">aluminum folding tent</a>, and for OEM programs see <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a>.</p>',

                home_trusted_by_title: 'Trusted by',
                home_trusted_by_subtitle: 'Serving global brands, distributors and project clients (placeholder).',

                home_trusted_badge_1: 'OEM Partners',
                home_trusted_badge_2: 'Event Brands',
                home_trusted_badge_3: 'Distributors',
                home_trusted_badge_4: 'Retail',
                home_trusted_badge_5: 'Sports Teams',
                home_trusted_badge_6: 'Exhibitions',
                home_trusted_badge_7: 'Print Shops',
                home_trusted_badge_8: 'Project Buyers',
                home_trusted_badge_9: 'Institutions',
                home_trusted_badge_10: 'E-commerce',

                home_best_sellers_title: 'Best Sellers',
                home_best_sellers_subtitle: 'Auto-selected from the existing dataset using a deterministic rule.',
                home_best_sellers_empty: 'No products to display yet.',
                home_view_all_products: 'View All Products',

                home_factory_title: 'Manufacturing strength & proof points',
                home_factory_subtitle: 'OEM/ODM from one factory: engineering coordination, print execution, quality checks and export documentation for serious B2B programs.',
                home_factory_f1_title: 'Manufacturing capacity',
                home_factory_f1_desc: 'Multi-line production across tents, flags and display hardware with predictable slots for sample and volume runs.',
                home_factory_f2_title: 'Printing & customization',
                home_factory_f2_desc: 'Sublimation, heat transfer and other fabric processes with artwork checks and brand-color alignment for OEM/ODM work.',
                home_factory_f3_title: 'Quality control',
                home_factory_f3_desc: 'Pre-shipment checks on frames, finishing and component fit to reduce on-site surprises for export consignments.',
                home_factory_f4_title: 'Export & delivery support',
                home_factory_f4_desc: 'Carton marks, commercial invoice/packing list assistance and forwarder-friendly packing for FOB/CIF experience.',

                home_why_title: 'Why Choose Us',
                home_why_subtitle: 'B2B manufacturing and delivery capability from sampling to bulk orders.',
                home_why_f1_title: 'OEM / ODM Capability',
                home_why_f1_desc: 'Customize structure, size and branding to match your market or project needs.',
                home_why_f2_title: 'Printing & Color Control',
                home_why_f2_desc: 'Multiple printing processes with sampling confirmation for consistent graphics.',
                home_why_f3_title: 'Lead Time Planning',
                home_why_f3_desc: 'Standardized workflows and capacity planning for urgent and bulk orders.',
                home_why_f4_title: 'Global Shipping Support',
                home_why_f4_desc: 'Packing standards and logistics options (sea/air/express) for worldwide delivery.',

                home_social_export_title: 'Export-Friendly Delivery',
                home_social_export_desc: 'Experienced in packaging, logistics coordination and cross-border communication.',
                home_social_clients_title: 'Built for B2B Clients',
                home_social_clients_desc: 'Brands, distributors, event companies, exhibition builders and project buyers.',

                home_stat_years_value: '15+',
                home_stat_years_label: 'Years Experience',
                home_stat_clients_value: '500+',
                home_stat_clients_label: 'Clients Served',
                home_stat_models_value: '200+',
                home_stat_models_label: 'Product Models',

                home_resources_title: 'Resources & FAQ',
                home_resources_subtitle: 'Learn about customization, print files and delivery options.',
                home_resource_cta: 'Learn More',
                home_resource_1_title: 'MOQ & Lead Time',
                home_resource_1_desc: 'MOQ and lead time notes across products and processes.',
                home_resource_2_title: 'Printing & Materials',
                home_resource_2_desc: 'Fabric options, print processes and color consistency tips.',
                home_resource_3_title: 'Shipping & Packing',
                home_resource_3_desc: 'Sea/air/express options with packing standards.',
                home_resource_4_title: 'Artwork Files',
                home_resource_4_desc: 'Supported file formats and production-ready requirements.',

                home_faq_1_q: 'What is your MOQ?',
                home_faq_1_a: 'MOQ depends on product and printing process. Share your requirements and we will confirm MOQ and pricing accordingly.',
                home_faq_2_q: 'What printing methods do you offer?',
                home_faq_2_a: 'We support common options such as digital printing, screen printing and heat transfer depending on material and quantity.',
                home_faq_3_q: 'What shipping options are available?',
                home_faq_3_a: 'Sea, air and express shipping are available. We can recommend a plan based on timeline and budget.',
                home_faq_4_q: 'What artwork files do you need?',
                home_faq_4_a: 'Vector files like AI/PDF/EPS are recommended. If you only have images, we can help with layout confirmation.',

                home_cta_title: 'Ready to Start Your Project?',
                home_cta_subtitle: 'Tell us product type, size, quantity and printing needs — we’ll get back to you quickly.',
                cta_primary: 'Get Quote',
                cta_secondary: 'View Products',
                footer_whatsapp_support: 'WhatsApp',
                home_cta_primary: 'Get Quote',
                home_cta_secondary: 'View Products',

                home_sticky_quote: 'Get Quote',

                nav_buyer_resources: 'Buyer Resources',
                home_core_partner_intro_html:
                    'Looking for a factory partner? Tent hubs: '
                    + '<a href="canopy-tents.html">canopy tents overview</a>, '
                    + '<a href="pop-up-canopy-tents.html">pop up canopy tents</a>; OEM depth: '
                    + '<a href="custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a>. '
                    + 'Pair with <a href="beach-flag-supplier.html">beach flags</a> and '
                    + '<a href="portable-display-systems.html">portable display systems</a>. '
                    + 'New buyers: read <a href="faq.html">MOQ / artwork / shipping FAQ</a> first.',
                home_fast_start_html:
                    'Fast start: send your size/quantity/artwork to get a quote, or use our guides: '
                    + '<a href="faq-moq.html">MOQ</a>, '
                    + '<a href="faq-artwork-files.html">artwork files</a>, '
                    + '<a href="faq-shipping.html">shipping options</a>. '
                    + 'Canopy hubs: '
                    + '<a href="custom-canopy-tent-manufacturer.html">custom canopy tents</a>, '
                    + '<a href="aluminum-folding-tent.html">pop up canopy tents</a>, '
                    + '<a href="10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a>.',
                home_guides_title: 'Guides',
                home_guides_subtitle:
                    'Short B2B sourcing guides on OEM/ODM programs, export packing, and product specs — written for distributors and procurement teams.',
                home_guide_read_cta: 'Read guide',
                home_guide_1_title: 'SEG Fabric Light Box Manufacturer (B2B Custom Sizes)',
                home_guide_1_desc: 'Aluminum extrusions, backlit fabric and LED modules for retail, exhibitions and wholesale programs.',
                home_guide_2_title: 'Custom Printed Canopy Tent Manufacturer (OEM China)',
                home_guide_2_desc: 'Pop-up frames, branded canopies, bulk MOQ and export packing for distributors and brands.',
                home_guide_3_title: 'Portable Trade Show Booth Backdrop (Export)',
                home_guide_3_desc: 'Collapsible frames, printed skins and export cartons for distributors shipping globally.',
                home_guide_4_title: 'Aluminum Frame Pop-Up Tent (Factory Direct Export)',
                home_guide_4_desc: 'Lightweight hex profiles, branded canopies, walls and roller bags with OEM packing support.',
                home_guide_5_title: 'Event Feather Flag Printing (Factory Direct)',
                home_guide_5_desc: 'Dye-sublimation on polyester, pole kits and bases for events, agencies and wholesale buyers.',
                home_guide_6_title: 'Heavy Duty Gazebo Tent (Europe Shipping)',
                home_guide_6_desc: 'Reinforced frames, tops and sidewalls with export-friendly packing for EU destinations.',
                home_guide_7_title: 'Modular Exhibition Display Hardware (ODM)',
                home_guide_7_desc: 'Aluminum profiles, connectors and fabric or panel infills for booth builders and distributors.',
                home_guide_8_title: 'Tension Fabric Display Wall (OEM Trade Show)',
                home_guide_8_desc: 'Aluminum frames, SEG or pillowcase graphics and portable bags for exhibitors and wholesale buyers.',
                home_guides_view_all: 'View all guides',
                home_guides_footer_html:
                    'Browse products: '
                    + '<a href="product-center.html">Product center</a> · '
                    + '<a href="all-products.html">All products</a> · '
                    + '<a href="all-products.html?cat=lightbox">Light box series</a> · '
                    + '<a href="all-products.html?cat=tents">Canopy tents</a> · '
                    + '<a href="news/index.html">News</a> · '
                    + '<a href="site-map.html">Site map</a>',

                home_buyer_title: 'Buyer Resources',
                home_buyer_subtitle:
                    'Quick pages for MOQ, lead time, artwork files, color matching and shipping — plus keyword landing pages for fast supplier matching.',
                home_br_1_title: 'SEG light box manufacturer',
                home_br_1_desc: 'SEG frames, fabric light boxes and backlit systems — factory direct.',
                home_br_2_title: 'tension fabric backwall',
                home_br_2_desc: 'Trade show fabric backdrops: straight, curved and modular tension systems.',
                home_br_3_title: 'aluminum folding tent',
                home_br_3_desc: 'Heavy-duty aluminum frames, waterproof canopies and custom printing.',
                home_br_4_title: 'Custom Canopy Tent Manufacturer',
                home_br_4_desc: 'OEM/ODM canopy tents, MOQ & lead time, export support.',
                home_br_5_title: 'Beach Flag Supplier',
                home_br_5_desc: 'Feather/teardrop flags with poles & bases, printing guidance.',
                home_br_6_title: 'Portable Display Systems',
                home_br_6_desc: 'Trade show displays, counters, roll-up stands and kits.',
                home_br_7_title: 'Buyer FAQ',
                home_br_7_desc: 'MOQ, artwork files, color matching and shipping options.',
                pc_seo_sourcing_label: 'Sourcing guides: ',
                pc_seo_sourcing_link_1: 'trade show canopy tents for distributors',
                pc_seo_sourcing_link_2: 'wholesale feather & teardrop flags',
                pc_seo_sourcing_link_3: 'tension fabric display walls (OEM)',
                pc_seo_sourcing_link_4: 'all B2B guides',
                pc_seo_catalog_label: 'Catalog hubs: ',
                pc_seo_catalog_link_1: 'all products (search & filter)',
                pc_seo_catalog_link_2: 'company news',
                pc_seo_catalog_link_3: 'site map',
                home_buyer_btn_moq: 'Start with MOQ',
                home_buyer_seo_links_html:
                    '<a href="seg-light-box-manufacturer.html" style="color: var(--wk-red-700); font-weight: 600;">SEG light box manufacturer</a>'
                    + '<a href="tension-fabric-backwall.html" style="color: var(--wk-red-700); font-weight: 600;">tension fabric backwall</a>'
                    + '<a href="aluminum-folding-tent.html" style="color: var(--wk-red-700); font-weight: 600;">aluminum folding tent</a>'
                    + '<a href="product-center.html?cat=tents" style="color: var(--wk-red-700); font-weight: 600;">Custom canopy tents manufacturer</a>'
                    + '<a href="product-center.html?cat=flags" style="color: var(--wk-red-700); font-weight: 600;">Beach flags &amp; feather flag systems</a>'
                    + '<a href="product-center.html?cat=displays" style="color: var(--wk-red-700); font-weight: 600;">Pop-up display systems &amp; trade show backwalls</a>'
                    + '<a href="products-accessories.html" style="color: var(--wk-red-700); font-weight: 600;">Tent &amp; display accessories</a>'
                    + '<a href="all-products.html" style="color: var(--wk-red-700); font-weight: 600;">All products catalog</a>'
                    + '<a href="seo/trade-show-canopy-tent-manufacturer-for-distributors.html" style="color: var(--wk-red-700); font-weight: 600;">Trade show tent sourcing (B2B)</a>'
                    + '<a href="seo/beach-flag-manufacturer-wholesale-feather-teardrop-flags.html" style="color: var(--wk-red-700); font-weight: 600;">Wholesale beach flag manufacturing</a>'
                    + '<a href="seo/tension-fabric-display-wall-manufacturer-oem-trade-show.html" style="color: var(--wk-red-700); font-weight: 600;">OEM tension fabric displays</a>'
                    + '<a href="site-map.html#seo-guides" style="color: var(--wk-red-700); font-weight: 600;">More B2B sourcing guides</a>',

                home_shop_by_size_title: 'Shop canopy tents by size',
                home_shop_by_size_items_html:
                    '<a href="canopy-tents.html">canopy tents overview</a> · <a href="pop-up-canopy-tents.html">pop up canopy tents</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> · <a href="custom-printed-canopy-tents.html">custom printed canopy sizes</a> · '
                    + '<a href="product-center.html?cat=tents">stock folding tent sizes</a> · <a href="tent-type.html?type=folding40">3×3 / 3×4.5 / 3×6 m frames</a>',
                home_shop_by_material_title: 'Shop by frame grade &amp; fabric',
                home_shop_by_material_items_html:
                    '<a href="aluminum-folding-tent.html">aluminum folding canopy tents</a> · <a href="pop-up-canopy-tents.html">pop up canopy family</a> · <a href="custom-canopy-tent-manufacturer.html">steel &amp; OEM frame programs</a> · '
                    + '<a href="faq-color-matching.html">fabric weights &amp; printing</a>',
                home_shop_by_use_title: 'Shop by use case',
                home_shop_by_use_items_html:
                    '<a href="event-canopy-tents.html">event &amp; trade show canopy tents</a> · <a href="seo/commercial-grade-pop-up-canopy-wholesale-supplier.html">commercial grade pop up canopy</a> · <a href="seo/outdoor-advertising-tent-oem-supplier-custom-sizes.html">outdoor advertising tent OEM</a> · '
                    + '<a href="custom-canopy-tent-manufacturer.html">trade show &amp; retail branding (OEM)</a> · <a href="products-accessories.html">sidewalls, weights &amp; roller bags</a>',
                home_flag_shapes_title: 'Beach flags — shapes &amp; graphics',
                home_flag_shapes_items_html:
                    '<a href="beach-flag-supplier.html">feather &amp; teardrop beach flags</a> · <a href="flag-type.html?type=fiberglass_pole">rectangular promo flags</a> · '
                    + '<a href="product-center.html?cat=flags">browse all flag kits</a>',
                home_flag_hardware_title: 'Poles, bases &amp; hardware',
                home_flag_hardware_items_html:
                    '<a href="flag-type.html?type=fiberglass_pole">fiberglass poles</a> · <a href="flag-type.html?type=alu_fiberglass_pole">aluminum + fiberglass poles</a> · <a href="flag-type.html?type=flag_bases_accessories">cross, spike &amp; water bases</a> · '
                    + '<a href="products-accessories.html">replacement parts &amp; bags</a>',
                home_display_modules_title: 'Display systems — booths to backlit kits',
                home_display_modules_items_html:
                    '<a href="pop-up-display-stands.html">pop up display stands</a> · <a href="tension-fabric-backwall.html">tension fabric backwalls</a> · '
                    + '<a href="seg-light-box-manufacturer.html">SEG light boxes</a> · <a href="portable-display-systems.html">counters &amp; roll-up stands</a>',
                home_buyer_faq_links_html:
                    'Buyer FAQ: <a href="faq-moq.html">MOQ</a> · <a href="faq-lead-time.html">lead time</a> · <a href="faq-artwork-files.html">artwork files</a> · '
                    + '<a href="faq-shipping.html">shipping</a> · <a href="faq-color-matching.html">color matching</a>',
                home_pillar_keywords_html:
                    'Featured hubs: <a href="canopy-tents.html">canopy tents overview</a> · <a href="pop-up-canopy-tents.html">pop up canopy tents</a> · <a href="custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> · '
                    + '<a href="aluminum-folding-tent.html">aluminum folding tent</a> · <a href="beach-flag-supplier.html">beach flag supplier</a> · '
                    + '<a href="portable-display-systems.html">portable display systems</a> · <a href="pop-up-display-stands.html">pop up display stands</a> · '
                    + '<a href="tension-fabric-backwall.html">tension fabric backwall</a> · <a href="seg-light-box-manufacturer.html">SEG light box manufacturer</a>',
                pc_intro_tents: 'OEM folding canopy tents—from stock 30/40/50 frames to fully custom printed programs for events, trade shows and retail.',
                pc_intro_flags: 'Feather, teardrop and promo flagpole systems with bases, carry bags and export-friendly packing for agencies.',
                pc_intro_displays: 'Pop-up backwalls, tension-fabric lines, SEG light boxes and promotion counters for trade show programs.',
                pc_seo_links_tents_html:
                    '<a href="canopy-tents.html">canopy tents hub</a> · <a href="pop-up-canopy-tents.html">pop up canopy tents</a> · <a href="custom-canopy-tent-manufacturer.html">custom canopy manufacturer</a> · <a href="10x10-pop-up-canopy-tent.html">10×10 canopy</a> · '
                    + '<a href="aluminum-folding-tent.html">aluminum tent</a> · <a href="event-canopy-tents.html">event tents</a> · '
                    + '<a href="seo/trade-show-canopy-tent-manufacturer-for-distributors.html">trade show tents</a> · <a href="products-accessories.html">tent accessories</a>',
                pc_seo_links_flags_html:
                    '<a href="flag-type.html?type=fiberglass_pole">feather &amp; teardrop poles</a> · <a href="flag-type.html?type=alu_fiberglass_pole">custom pole kits</a> · '
                    + '<a href="flag-type.html?type=flag_bases_accessories">replacement bases</a> · <a href="beach-flag-supplier.html">beach flag supplier hub</a>',
                pc_seo_links_displays_html:
                    '<a href="pop-up-display-stands.html">pop-up display stands</a> · <a href="tension-fabric-backwall.html">tension fabric backwall</a> · '
                    + '<a href="seg-light-box-manufacturer.html">SEG light box</a> · <a href="portable-display-systems.html">portable display systems</a> · '
                    + '<a href="product-center.html?cat=displays">display catalog</a> · <a href="seo/portable-trade-show-booth-backdrop-manufacturer-export.html">trade show booth backdrops</a>',
                seo_tent_topic_strip_title: 'Tent topic hubs',
                seo_tent_topic_strip_p_html:
                    '<a href="../canopy-tents.html">Canopy tents hub</a> · <a href="../pop-up-canopy-tents.html">Pop up canopy tents</a> · '
                    + '<a href="../product-center.html?cat=tents">Product center (tents)</a>',
                pc_tent_accessories_desc: 'Sidewalls, weights, roller bags, connectors and tent hardware.',
                pc_tent_replacement_desc: 'Canopies, frames, spare parts and field repair solutions.',
                breadcrumb_product_center: 'Product Center',

                faq_context_tent_cluster_html:
                    '<p class="wk-disclaimer" style="margin:0 0 1rem;line-height:1.6;font-size:0.95rem;">Tent sourcing hubs: <a href="/canopy-tents.html">canopy tents overview</a> · <a href="/pop-up-canopy-tents.html">pop up canopy tents</a> · <a href="/event-canopy-tents.html">event canopy tents</a> · <a href="/custom-canopy-tent-manufacturer.html">custom canopy manufacturer (OEM)</a></p>',

                landing_canopy_plan_program_h2: 'Plan a canopy program: size, frame grade, accessories',
                landing_canopy_plan_program_html:
                    '<p style="margin:0;line-height:1.65;font-size:0.95rem;color:rgba(31,45,61,.88);">'
                    + '<strong>Topic hubs:</strong> <a href="/canopy-tents.html">canopy tents overview</a>, '
                    + '<a href="/pop-up-canopy-tents.html">pop up canopy tents</a>. '
                    + '<strong>Shop by size:</strong> <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a>, '
                    + '<a href="/product-center.html?cat=tents">stock tent size tables</a>, '
                    + '<a href="/custom-printed-canopy-tents.html">custom printed canopy sizes</a>. '
                    + '<strong>Frame grades:</strong> <a href="/aluminum-folding-tent.html">aluminum folding tents</a>, '
                    + '<a href="/tent-type.html?type=folding30">economical iron-frame stock tents</a>. '
                    + '<strong>Use cases:</strong> <a href="/event-canopy-tents.html">event canopy tents</a>, '
                    + '<a href="/seo/trade-show-canopy-tent-manufacturer-for-distributors.html">trade show tent sourcing</a>. '
                    + '<strong>Support &amp; FAQ:</strong> <a href="/products-accessories.html">sidewalls, weights &amp; bags</a> · '
                    + '<a href="/faq-moq.html">MOQ</a> · <a href="/faq-lead-time.html">lead time</a> · '
                    + '<a href="/faq-artwork-files.html">artwork</a> · <a href="/faq-shipping.html">shipping</a>.'
                    + '</p>',

                landing_canopy_tent_cluster_h2: 'Related tent pages',
                landing_canopy_tent_cluster_html:
                    '<p style="margin:0;line-height:1.65;">'
                    + '<a href="/tent-type.html">Folding Canopy Tent Types</a> (30/40/50) · '
                    + '<a href="/product-center.html?cat=tents">Product Center – Tents</a> · '
                    + '<a href="/all-products.html?cat=tents">Browse All Tents</a> · '
                    + '<a href="/10x10-pop-up-canopy-tent.html">10x10 Canopy Tent Options</a>.'
                    + '</p>',

                landing_top_bar_canopy: 'Factory direct · OEM/ODM · Reply within 24 hours',
                landing_canopy_h1: 'Custom Canopy Tents Manufacturer',
                landing_canopy_lead: 'OEM/ODM printed pop up tents, event canopies and accessories — factory-direct from China, exporting worldwide.',
                landing_canopy_card_range_t: 'Product Range',
                landing_canopy_card_range_d: 'Pop up canopy tents, heavy-duty frames, custom printed canopies/walls, awnings and accessories.',
                landing_canopy_card_moq_t: 'MOQ',
                landing_canopy_card_moq_d: 'Flexible MOQ depending on model and printing (commonly 1–5 sets for sample, 10+ for bulk).',
                landing_canopy_card_lead_t: 'Lead Time',
                landing_canopy_card_lead_d: 'Typical production 7–15 days after artwork approval. Rush options available.',
                landing_canopy_card_export_t: 'Export Support',
                landing_canopy_card_export_d: 'Export-ready packing, HS code support, sea/air/express shipping to US/EU/AU and more.',
                landing_canopy_btn_wa: 'WhatsApp',
                landing_canopy_btn_browse: 'Browse Tent Products',
                landing_canopy_contact_line_html:
                    'Contact: <a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp: '
                    + '<a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a> · WeChat: massifmyth',
                landing_canopy_popular_h2: 'Popular Custom Options',
                landing_canopy_popular_sub: 'Tell us your size, frame grade, printing needs and target market — we will recommend the best setup.',
                landing_canopy_popular_note_html:
                    'Heavy-duty frame focus: <a href="aluminum-folding-tent.html">aluminum folding tent</a> · Backlit displays: '
                    + '<a href="seg-light-box-manufacturer.html">SEG light box manufacturer</a> · Fabric backwalls: '
                    + '<a href="tension-fabric-backwall.html">tension fabric backwall</a>. '
                    + 'Deeper reads: <a href="seo/custom-printed-canopy-tent-manufacturer-oem-china.html">custom printed canopy OEM (China)</a> · '
                    + '<a href="seo/folding-event-tent-supplier-wholesale-moq.html">folding event tent wholesale MOQ</a> · '
                    + '<a href="site-map.html#seo-guides">more B2B guides</a>.',
                landing_canopy_opt_size_t: 'Sizes',
                landing_canopy_opt_size_d: '10x10 ft, 10x15 ft, 10x20 ft (and metric sizes). Custom size supported.',
                landing_canopy_opt_frame_t: 'Frames',
                landing_canopy_opt_frame_d: 'Aluminum or steel frames; lightweight, heavy-duty, wind-resistant options.',
                landing_canopy_opt_print_t: 'Printing',
                landing_canopy_opt_print_d: 'Full color CMYK, single/double side, canopy + walls; UV resistant fabrics.',
                landing_canopy_opt_acc_t: 'Accessories',
                landing_canopy_opt_acc_d: 'Sandbags, stakes, wheeled bags, LED lights, awnings, connecting gutters.',
                landing_canopy_faq_h2: 'Buyer FAQs (Recommended)',
                landing_canopy_faq_sub: 'These pages help your team confirm specs faster and reduce mistakes on artwork and shipping.',
                landing_canopy_faq_moq_q: 'What is your MOQ?',
                landing_canopy_faq_moq_d: 'MOQ by model/printing, sample policy, and how to start small safely.',
                landing_canopy_faq_lead_q: 'What is your lead time?',
                landing_canopy_faq_lead_d: 'Typical production timeline and what affects delivery dates.',
                landing_canopy_faq_art_q: 'What artwork files do you need?',
                landing_canopy_faq_art_d: 'AI/PDF guidelines, bleed, fonts, and color profiles.',
                landing_canopy_faq_view_all: 'View all FAQs',

                page_title_canopy_b2b: 'Custom Canopy Tent Manufacturer | OEM Pop Up Tents | WaiKwan',
                landing_canopy_b2b_h1: 'Custom Canopy Tent Manufacturer for OEM Pop Up Tent Programs',
                landing_canopy_b2b_lead_html:
                    'WaiKwan manufactures <strong>custom canopy tents</strong> and <strong>OEM/ODM pop up tent programs</strong> for distributors, event agencies, resellers and brand teams. Send size, frame grade, quantity, artwork and destination to confirm MOQ, lead time, printing options, sidewalls, accessories and export-ready packing.',
                landing_canopy_b2b_p1_html:
                    '<p>WaiKwan manufactures <strong>pop up canopy tents</strong> and <strong>printed event tents</strong> for professional use—trade shows, promotions, sports, and outdoor activations. As an <strong>OEM canopy tent manufacturer</strong>, we align frame series (aluminum or steel), canopy graphics, and accessories to your program, whether you need a compact 3×3 unit or a larger <strong>3×6 custom canopy tent</strong> footprint for high-visibility branding.</p>',
                landing_canopy_b2b_p2_html:
                    '<p>Our team supports sizing, material choices, printing methods, and add-ons such as sidewalls and weight kits so your <a href="/all-products.html?cat=tents">custom canopy tent</a> order matches real deployment conditions. For program-level questions, see our <a href="/faq.html">FAQ</a>, <a href="/faq-moq.html">MOQ guidance</a>, <a href="/faq-lead-time.html">lead time</a>, and <a href="/faq-artwork-files.html">artwork file requirements</a>, or <a href="/contact-us.html#getQuoteForm">request a quote</a> with your target sizes and print scope.</p>',
                landing_canopy_related_h2: 'Related canopy topics',
                landing_canopy_related_intro_html:
                    'Short guides that pair with this page—printing programs, pop-up manufacturing notes, event deployments, and aluminum folding frame lines.',
                landing_canopy_gallery_h2: '3×6 Custom Canopy Tents — Real-Scene Gallery',
                landing_canopy_gallery_intro_html:
                    'Below are real-scene examples of <strong>3×6 custom canopy tents</strong> with <strong>aluminum frame</strong> systems—ideal references for event branding, retail activations, and OEM rollouts.',
                landing_canopy_gallery_cap_main: 'Featured: 3×6 aluminum-frame custom canopy tent — real deployment (outdoor branding).',
                landing_canopy_gallery_cap_aluminum: 'Aluminum frame detail — suitable for OEM canopy tent manufacturer specifications.',
                landing_canopy_gallery_cap_second: 'Second real-scene view — custom printed canopy tents for events.',
                landing_canopy_types_h2: 'Popular Custom Canopy Tent Types',
                landing_canopy_types_intro_html:
                    'Representative formats we supply for B2B programs. Browse the <a href="/product-center.html?cat=tents">tents hub</a> or <a href="/all-products.html?cat=tents">full tent catalog</a> for SKUs and variants.',
                landing_canopy_type_1_h3: '3×3 custom canopy tents',
                landing_canopy_type_1_html:
                    'Compact pop up canopy tents for street teams and booth islands—easy to transport and quick to deploy. <a href="/tent-type.html?type=folding40">View folding tent types</a> aligned to your frame preference.',
                landing_canopy_type_2_h3: '3×4.5 custom canopy tents',
                landing_canopy_type_2_html:
                    'Mid-width coverage for sampling bars and registration areas; pair with branded sidewalls for weather protection. Explore options via our <a href="/all-products.html?cat=tents">printed canopy tent listings</a>.',
                landing_canopy_type_3_h3: '3×6 custom canopy tents',
                landing_canopy_type_3_html:
                    'High-visibility footprints for sponsor lanes and outdoor retail—ideal when you need maximum graphic area on a single frame. See real-scene examples in the gallery above and <a href="/product-center.html?cat=tents">plan your layout</a>.',
                landing_canopy_type_4_h3: 'Aluminum frame custom canopy tents',
                landing_canopy_type_4_html:
                    'Lightweight, corrosion-resistant frames for frequent touring; common on premium <strong>pop up canopy tents</strong> for agencies. Compare series in the <a href="/product-center.html?cat=tents">product center</a>.',
                landing_canopy_type_5_h3: 'Steel frame pop up tents',
                landing_canopy_type_5_html:
                    'Cost-effective steel options for seasonal campaigns and rental fleets—specify frame material when you <a href="/contact-us.html#getQuoteForm">request a quote</a> so we can match budget and duty cycle.',
                landing_canopy_type_6_h3: 'Printed canopy tents with sidewalls',
                landing_canopy_type_6_html:
                    'Full perimeter branding with optional half or full sidewalls, compatible with standard accessory lines. Confirm artwork readiness using our <a href="/faq-artwork-files.html">print file guide</a>.',
                landing_canopy_why_h2: 'Why Buyers Choose Our Custom Canopy Tents',
                landing_canopy_why_p1_html:
                    '<p><strong>OEM / ODM structure:</strong> We work as a manufacturing partner for brands and distributors—documenting frame series, fabric specs, and print methods so repeat orders stay consistent across regions.</p>',
                landing_canopy_why_p2_html:
                    '<p><strong>Logo printing and brand graphics:</strong> Canopy tops and valances can carry full-color graphics for <strong>custom printed canopy tents</strong>; we can advise safe zones and seam placement before production. For file prep, see <a href="/faq-artwork-files.html">artwork requirements</a>.</p>',
                landing_canopy_why_p3_html:
                    '<p><strong>Aluminum and steel frame options:</strong> Match frame material to weight, frequency of use, and budget—aluminum for portability on tour, steel where upfront cost matters most on <strong>pop up canopy tents</strong>.</p>',
                landing_canopy_why_p4_html:
                    '<p><strong>Sidewalls and accessory compatibility:</strong> Add sidewalls, weight bags, and tie-downs so <strong>printed event tents</strong> meet venue rules; bundle options can be quoted with your frame package.</p>',
                landing_canopy_why_p5_html:
                    '<p><strong>Export packaging:</strong> Factory-direct packing oriented to international freight—carton dimensions and handling notes available during quoting.</p>',
                landing_canopy_why_p6_html:
                    '<p><strong>Quote and production support:</strong> Timeline and <a href="/faq-moq.html">MOQ</a> depend on scope; for schedules, read <a href="/faq-lead-time.html">lead time FAQs</a> or contact us via <a href="/contact-us.html#getQuoteForm">the inquiry form</a>.</p>',
                landing_canopy_specs_h2: 'Custom Canopy Tent Specifications & Options',
                landing_canopy_specs_intro: 'Summary reference for procurement teams. Final specs are confirmed per SKU and quote.',
                landing_canopy_specs_1_h3: 'Frame materials',
                landing_canopy_specs_1_html:
                    'Aluminum alloy or steel tube frames with engineered connectors—select based on weight, durability, and budget for your <strong>custom canopy tents</strong> program.',
                landing_canopy_specs_2_h3: 'Common sizes',
                landing_canopy_specs_2_html:
                    'Commercial footprints such as 3×3 m, 3×4.5 m, and 3×6 m are widely used; confirm exact SKU coverage in <a href="/all-products.html?cat=tents">all products — tents</a>.',
                landing_canopy_specs_3_h3: 'Canopy printing',
                landing_canopy_specs_3_html:
                    'Dye-sublimation or suitable fabric printing for vibrant logos on <strong>custom printed canopy tents</strong>; vector artwork preferred—see <a href="/faq-artwork-files.html">file formats</a>.',
                landing_canopy_specs_4_h3: 'Sidewalls & accessories',
                landing_canopy_specs_4_html:
                    'Optional sidewalls, half walls, rail skirts, and hardware-compatible weights—list add-ons in your RFQ for a single BOM.',
                landing_canopy_specs_5_h3: 'MOQ & lead time',
                landing_canopy_specs_5_html:
                    'Varies by print complexity and season; review <a href="/faq-moq.html">MOQ</a> and <a href="/faq-lead-time.html">lead time</a> or ask for a project timeline with your order.',
                landing_canopy_specs_6_h3: 'Export support',
                landing_canopy_specs_6_html:
                    'Documentation and packing suited to export lanes from China; share destination and incoterms preference when you <a href="/contact-us.html#getQuoteForm">contact sales</a>.',
                landing_canopy_buyers_faq_h2: 'Custom Canopy Tents — Frequently Asked Questions',
                landing_canopy_buyers_faq_intro_html:
                    'Quick answers for buyers; full detail in our <a href="/faq.html">FAQ library</a>.',
                landing_canopy_buyers_faq_1_q: 'What sizes are available for custom canopy tents?',
                landing_canopy_buyers_faq_1_a_html:
                    'We supply common commercial footprints including 3×3 m, 3×4.5 m, and 3×6 m styles among others. Exact availability depends on frame series—use <a href="/all-products.html?cat=tents">tent category listings</a> or ask for a matrix during quoting.',
                landing_canopy_buyers_faq_2_q: 'Can you print logos on all canopy panels?',
                landing_canopy_buyers_faq_2_a_html:
                    'Roof and valance branding is standard for many <strong>custom printed canopy tents</strong>; sidewall printing may vary by fabric and seam layout. Share your layout early—we outline bleed and safe zones in our <a href="/faq-artwork-files.html">artwork FAQ</a>.',
                landing_canopy_buyers_faq_3_q: 'Do you offer aluminum and steel frames?',
                landing_canopy_buyers_faq_3_a_html:
                    'Yes. Aluminum suits frequent transport; steel can reduce unit cost for budget-led programs. Specify intended use when contacting us so we recommend the right <strong>pop up canopy tents</strong> frame.',
                landing_canopy_buyers_faq_4_q: 'What is the MOQ for custom canopy tents?',
                landing_canopy_buyers_faq_4_a_html:
                    'MOQ depends on print scope, fabric, and accessories. See <a href="/faq-moq.html">MOQ guidance</a> and include quantity targets in your inquiry for an accurate line item.',
                landing_canopy_buyers_faq_5_q: 'Do you support OEM orders for distributors?',
                landing_canopy_buyers_faq_5_a_html:
                    'We operate as an <strong>OEM canopy tent manufacturer</strong> for B2B partners—private-label packaging and repeat-order consistency can be discussed with our team via <a href="/contact-us.html#getQuoteForm">contact</a>.',
                landing_canopy_buyers_faq_6_q: 'Can sidewalls and accessories be included?',
                landing_canopy_buyers_faq_6_a_html:
                    'Yes—sidewalls, weights, and related hardware can be quoted with your frame. Mention venue requirements (e.g., fire retardancy) when requesting <strong>printed event tents</strong> packages.',

                landing_canopy_b2b_audience_html:
                    '<p>We support <strong>distributors and resellers</strong>, <strong>event suppliers and rental fleets</strong>, <strong>branding and creative agencies</strong>, and OEM/ODM programs that need repeatable specs and export documentation. If you manage multi-market rollouts, we align frame families, fabric specs, and prepress rules to keep reorders consistent.</p>',
                landing_canopy_section_logo_h2: 'Custom Canopy Tents With Logo',
                landing_canopy_section_logo_html:
                    '<p>From a focused <strong>custom tent with logo</strong> treatment to full <strong>custom printed canopy tent</strong> coverage, roof and valance panels can carry your campaign creative. Pantone alignment and vector artwork help match brand systems—see our <a href="/faq-artwork-files.html">artwork FAQ</a> for file setup.</p>',
                landing_canopy_section_popup_h2: 'Pop Up Canopy Tent Options',
                landing_canopy_section_popup_html:
                    '<p><strong>Pop up canopy tents</strong> are built for fast deployment on tours, promo islands, and outdoor sports—quick setup and pack-down keeps crews efficient. Choose aluminum for lighter handling or steel for budget-led programs, then bundle sidewalls and weights in one RFQ. For frame engineering emphasis, see <a href="/aluminum-folding-tent.html">aluminum folding tent</a>.</p>',
                landing_canopy_section_sizes_h2: 'Popular Sizes: 10×10, 10×15, 10×20 (and metric equivalents)',
                landing_canopy_section_sizes_html:
                    '<p>North American buyers often specify <strong>10×10</strong>, <strong>10×15</strong>, and <strong>10×20</strong> footprints; metric teams frequently reference 3×3 m, 3×4.5 m, and 3×6 m. Tell us which labeling your end customers expect—we can mirror both in quotes. For the most common starter footprint, start with our <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> guide.</p>',
                landing_canopy_section_frames_h2: 'Aluminum vs Steel Frame Options',
                landing_canopy_section_frames_html:
                    '<p><strong>Aluminum</strong> profiles reduce carry weight and resist corrosion for repeat tours; <strong>steel</strong> tubes can lower unit cost for seasonal or rental-heavy fleets. If you need <strong>heavy duty pop up tent</strong> performance, share expected wind conditions, anchoring method, and duty cycle so we can recommend connector grades and ballast plans.</p>',
                landing_canopy_section_walls_h2: 'Custom Canopy Tents With Full Walls / Sidewalls',
                landing_canopy_section_walls_html:
                    '<p>Add full-height walls, half walls, solid panels, or window walls for weather protection, privacy, or interior merchandising. Sidewalls can be ordered on separate replenishment cycles while keeping the same frame family. Mention fire-retardancy or outdoor durability requirements for your destination markets.</p>',
                landing_canopy_1010_teaser_html:
                    '<div class="wk-card wk-feature-card" style="max-width: 920px; margin: 0 auto; text-align: left;">'
                    + '<h3 style="margin-top: 0;">10×10 pop up canopy tent spotlight</h3>'
                    + '<p>Need the most requested starter size? Read the <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> page for frame choices, logo printing, sidewalls, and export notes tailored to distributor programs.</p></div>',
                landing_canopy_buyers_faq_7_q: 'What is a pop up canopy tent?',
                landing_canopy_buyers_faq_7_a_html:
                    'A collapsible frame system with a tensioned fabric roof (and optional walls) that deploys quickly for outdoor branding. We manufacture OEM/ODM frames with custom graphics for promotions, trade events, and sports programs.',
                landing_canopy_buyers_faq_8_q: 'Can you produce a custom tent with logo and full-color artwork?',
                landing_canopy_buyers_faq_8_a_html:
                    'Yes—roof, valance, and sidewall panels can carry <strong>custom printed canopy tent</strong> graphics or a focused <strong>custom tent with logo</strong> layout. Submit vector files and color references; review <a href="/faq-color-matching.html">color matching</a> and <a href="/faq-artwork-files.html">artwork files</a> for production-ready output.',
                landing_canopy_buyers_faq_9_q: 'Do you offer 10×10 custom canopy tents for export?',
                landing_canopy_buyers_faq_9_a_html:
                    'Yes—<strong>10×10</strong> (commonly paired with 3×3 m) is a high-volume format for channel partners. MOQ and lead time depend on printing and accessories; see the dedicated <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> page and <a href="/faq-moq.html">MOQ FAQ</a>.',
                landing_canopy_buyers_faq_10_q: 'Can sidewalls be customized separately from the canopy?',
                landing_canopy_buyers_faq_10_a_html:
                    'Yes—sidewalls can be sized and printed to match your frame series and campaign. Separate replenishment is common; keep hook placements and zipper lines consistent by referencing the original BOM. Use <a href="/faq-artwork-files.html">artwork guidelines</a> for panel seams and safe zones.',

                page_title_1010_canopy: '10x10 Pop Up Canopy Tent | Custom 3x3 OEM Factory | WaiKwan',
                landing_1010_h1: '10x10 Pop Up Canopy Tent for Custom 3x3 OEM Programs',
                landing_1010_lead_html:
                    'Source <strong>10x10 pop up canopy tents</strong> for B2B OEM programs with 3x3 m frame options, roof and sidewall printing, weights, bags and export packing. Share quantity, artwork and destination to confirm MOQ, sample timing, production lead time and shipping options.',
                landing_1010_use_cases_h2: 'Where teams deploy 10×10 first',
                landing_1010_use_cases_html:
                    '<p>Sampling lanes, registration desks, outdoor retail pods, and mobile roadshows—<strong>10×10</strong> balances shipping volume with usable coverage, making it a strong default SKU for reseller catalogs and event suppliers.</p>',
                landing_1010_frame_h2: 'Frame options for repeated setup',
                landing_1010_frame_html:
                    '<p>Aluminum extrusions save weight for touring crews; steel can win on upfront unit cost. Tell us if you need <strong>heavy duty pop up tent</strong> upgrades—leg diameter, truss thickness, and footplate style all affect wind performance.</p>',
                landing_1010_print_h2: 'Custom logo printing & branded canopy programs',
                landing_1010_print_html:
                    '<p>Roofs and valances accept vibrant <strong>custom printed canopy tent</strong> graphics; matching sidewalls turn the space into a cohesive <strong>branded canopy tent</strong> experience. Vector artwork and Pantone references reduce rework—see <a href="/faq-artwork-files.html">file prep</a>.</p>',
                landing_1010_sidewalls_h2: 'Sidewalls, accessories & full enclosure',
                landing_1010_sidewalls_html:
                    '<p>Choose solid, window, or door panels; add weight bags, stakes, stakes plates, and wheeled bags for field teams. Bundle accessories in the same export carton when possible to simplify landed cost planning.</p>',
                landing_1010_shipping_h2: 'Shipping, OEM labels & MOQ',
                landing_1010_shipping_html:
                    '<p>We pack for ocean and air lanes with carton marks for warehouse intake; OEM labeling and packing lists are available for distributor systems. MOQ and schedule vary by print scope—read <a href="/faq-moq.html">MOQ</a>, <a href="/faq-lead-time.html">lead time</a>, and <a href="/faq-shipping.html">shipping</a>, or compare the broader OEM scope on <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a> and browse SKUs via <a href="/all-products.html?cat=tents">all products — tents</a>.</p>',
                landing_1010_faq_1_q: 'Is 10×10 the same as 3×3 m?',
                landing_1010_faq_1_a_html:
                    'They are commonly paired equivalents in folding tent lines, but exact outside dimensions depend on the frame series—request the spec sheet for the SKU you intend to stock.',
                landing_1010_faq_2_q: 'Can I reorder sidewalls without frames?',
                landing_1010_faq_2_a_html:
                    'Yes, when the frame family stays the same. Share prior order references so panel hooks and zippers stay compatible.',
                landing_1010_faq_3_q: 'Do you support sea and air export?',
                landing_1010_faq_3_a_html:
                    'Yes—factory packing lists include weight and cube for freight forwarders; share incoterms and destination preferences in your RFQ.',
                landing_1010_faq_4_q: 'How is this different from the aluminum folding tent page?',
                landing_1010_faq_4_a_html:
                    'This page focuses on the <strong>10×10 pop up canopy tent</strong> size intent and kit composition. Material deep dives live on <a href="/aluminum-folding-tent.html">aluminum folding tent</a>, while umbrella OEM positioning sits on <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a>.',
                landing_1010_factory_h2: 'Where 10×10 fits in the WaiKwan tent cluster',
                landing_1010_factory_html:
                    '<p>10×10 is a channel-friendly SKU, but buyers still need the surrounding <strong>series and print scope</strong> defined. Read <a href="/canopy-tents.html">canopy tents overview</a>, <a href="/pop-up-canopy-tents.html">pop up canopy tents</a> and <a href="/event-canopy-tents.html">event canopy tents</a> so one RFQ covers frame grade and accessories.</p>',
                landing_1010_faq_5_q: 'How do 30/40/50 series frames relate to a 10×10 footprint?',
                landing_1010_faq_5_a_html:
                    'The footprint (e.g., 3×3 m / 10×10 ft) describes coverage; <strong>30/40/50</strong> square-tube families describe connector strength and tubing grade. Quote both so we match stock or custom programs correctly.',
                landing_1010_faq_6_q: 'What is the fastest way to get pricing and production timing?',
                landing_1010_faq_6_a_html:
                    'Send quantities, destination, accessory list and artwork stage—baseline replies typically land within ~24 hours when specs are complete. Review <a href="/faq-moq.html">MOQ</a> and <a href="/faq-lead-time.html">lead time</a>, then <a href="/contact-us.html#getQuoteForm">request a quote</a>.',
                landing_1010_faq_section_h2: '10×10 Pop Up Canopy Tent — FAQs',
                landing_1010_faq_section_intro_html:
                    'More buyer topics: <a href="/faq.html">FAQ hub</a> · <a href="/faq-moq.html">MOQ</a> · <a href="/faq-shipping.html">Shipping</a>',

                page_title_aluminum_fold: 'Aluminum Folding Canopy Tents | Heavy Duty Pop Up Frames | WaiKwan',
                landing_aluminum_h1: 'Aluminum Folding Canopy Tents',
                landing_aluminum_p1_html:
                    '<p>An <strong>aluminum folding tent</strong> uses extruded legs and trusses for strength-to-weight balance—ideal when procurement teams spec an <strong>aluminum pop up canopy tent</strong> for crews that strike and rebuild often. Compared with steel, aluminum stays lighter for truck pack-outs and resists corrosion in humid outdoor circuits; steel can win on unit cost for seasonal rental pools. WaiKwan supplies both frame routes with branded canopies, sidewalls, and accessories—this page focuses on <strong>material and frame behavior</strong>; for umbrella OEM positioning see <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a>.</p>',
                landing_aluminum_p2_html:
                    '<p>Typical deployments include roadshow tours, sports venues, festival lanes, and agency programs that need reliable weather cover without excessive frame weight.</p>',
                landing_aluminum_card_1_h3: 'Aluminum vs steel',
                landing_aluminum_card_1_p:
                    'Aluminum: lighter handling, corrosion resistance. Steel: cost-focused strength for short-term or high-wind setups—pick based on schedule and budget.',
                landing_aluminum_card_2_h3: 'Canopy & printing',
                landing_aluminum_card_2_p:
                    'Water-resistant fabrics and full-color printing for <strong>heavy duty canopy tent</strong> programs.',
                landing_aluminum_card_3_h3: 'Events & commercial',
                landing_aluminum_card_3_p:
                    '3×3 m to larger footprints for hospitality, sampling and registration zones.',
                landing_aluminum_card_4_h3: 'OEM / ODM',
                landing_aluminum_card_4_p:
                    'Private-label frames, pantone-aligned canopies and export packing from factory.',
                landing_aluminum_disclaimer_html:
                    '<p style="margin-bottom: 10px;">Browse all tent SKUs: <a href="/all-products.html?cat=tents">folding and canopy tents (full listing)</a>. Size-intent buyers: <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> (3×3 m).</p>'
                    + '<p style="margin-bottom: 10px;">Broad OEM programs: <a href="/custom-canopy-tent-manufacturer.html">custom canopy tents — full B2B overview</a>.</p>'
                    + '<p style="margin-bottom: 10px;">Guides: <a href="/seo/aluminum-frame-pop-up-tent-factory-direct-export.html">aluminum frame pop up tent (factory export)</a> · <a href="/seo/commercial-grade-pop-up-canopy-wholesale-supplier.html">commercial-grade canopy wholesale</a> · <a href="/site-map.html#seo-guides">full list</a>.</p>'
                    + 'Contact: <a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp: <a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a>',
                landing_aluminum_repeat_h2: 'Why aluminum pop up canopy tents win on repeat setup',
                landing_aluminum_repeat_p_html:
                    '<p style="max-width: 900px; margin-left: auto; margin-right: auto;">Touring teams choose aluminum when every kilogram matters—lighter legs reduce crew fatigue, and corrosion resistance extends service life in coastal or humid circuits. Paired with a properly tensioned canopy, an <strong>aluminum pop up canopy tent</strong> can deliver the <strong>heavy duty pop up tent</strong> feel buyers expect for sponsor activations without the penalty weight of overbuilt steel on every load-in.</p>',
                landing_aluminum_program_h2: 'Plan the full canopy program (not only the frame)',
                landing_aluminum_program_p_html:
                    '<p style="max-width: 900px; margin-left: auto; margin-right: auto;">Start with the <a href="/custom-canopy-tent-manufacturer.html">custom canopy tent manufacturer</a> hub for OEM/ODM, logo printing, and sidewall bundles. If your catalog centers on the most common portable footprint, review <a href="/10x10-pop-up-canopy-tent.html">10×10 pop up canopy tent</a> specs—then align frame grade with the ballast and anchoring plan your end customers use on site.</p>',
                landing_aluminum_related_h2: 'Related resources',
                landing_aluminum_related_sub: 'Tents, flags and buyer FAQs.',
                landing_aluminum_rel_canopy_h3: 'Custom canopy tent manufacturer (broad OEM)',
                landing_aluminum_rel_canopy_p: 'Pop up positioning, printing, MOQ and export—not frame metallurgy.',
                landing_aluminum_rel_1010_h3: '10×10 pop up canopy tent',
                landing_aluminum_rel_1010_p: '3×3 m sizing, accessories, and distributor notes.',
                landing_aluminum_rel_types_h3: 'Tent types',
                landing_aluminum_rel_types_p: 'Frame and size orientation for buyers.',
                landing_aluminum_rel_moq_h3: 'MOQ',
                landing_aluminum_rel_moq_p: 'How minimums work by model and printing.',

                page_title_portable_display: 'Portable Display Systems Manufacturer | OEM Trade Show Kits | WaiKwan',
                landing_top_bar_portable: 'Factory direct · Portable displays · Reply within 24 hours',
                landing_portable_h1: 'Portable Display Systems Manufacturer for OEM Trade Show Kits',
                landing_portable_lead:
                    'WaiKwan builds portable display systems for trade shows, retail launches and reseller catalogs: fabric backdrops, pop-up displays, counters, roll-up stands and custom booth kits. Send booth size, graphics, quantity and deadline to confirm MOQ, artwork requirements, lead time and export packing.',
                landing_portable_card_1_h3: 'Product Range',
                landing_portable_card_1_p:
                    'Pop-up display systems, fabric displays, promotion counters, roll-up stands, accessories.',
                landing_portable_card_2_h3: 'MOQ',
                landing_portable_card_2_p:
                    'Low MOQ depending on the item. Bulk orders supported with stable printing quality.',
                landing_portable_card_3_h3: 'Lead Time',
                landing_portable_card_3_p:
                    'Typical 7–15 days after artwork approval. Faster for stocked hardware components.',
                landing_portable_card_4_h3: 'Export Support',
                landing_portable_card_4_p:
                    'Flat-pack packing, QC photos, carton marks, and worldwide shipping options.',
                landing_portable_contact_line_html:
                    'Contact: <a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp: <a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a> · WeChat: massifmyth',
                landing_portable_b2b_links_html:
                    '<span>B2B supplier pages:</span> <a href="/seg-light-box-manufacturer.html">SEG light box manufacturer</a> · <a href="/tension-fabric-backwall.html">tension fabric backwall</a> · <a href="/aluminum-folding-tent.html">aluminum folding tent</a>. '
                    + '<span>Deeper guides:</span> <a href="/seo/tension-fabric-display-wall-manufacturer-oem-trade-show.html">tension fabric walls (OEM)</a> · <a href="/seo/portable-backdrop-display-system-supplier-wholesale.html">portable backdrop wholesale</a> · <a href="/site-map.html#seo-guides">full index</a>.',
                landing_portable_supply_h2: 'What We Supply',
                landing_portable_supply_sub: 'Choose a ready system or ask for a complete kit for your booth size and branding.',
                landing_portable_supply_1_h3: 'Fabric Displays',
                landing_portable_supply_1_p: 'Lightweight aluminum frames + stretch fabric graphics for exhibitions.',
                landing_portable_supply_2_h3: 'Promotion Counters',
                landing_portable_supply_2_p: 'Portable counters with wrap-around graphics for sampling and retail.',
                landing_portable_supply_3_h3: 'Roll-up Stands',
                landing_portable_supply_3_p: 'Classic retractable banners for quick setup and easy transport.',
                landing_portable_supply_4_h3: 'Complete Kits',
                landing_portable_supply_4_p: 'We can bundle canopy + flags + counters for event activation sets.',
                landing_portable_faq_h2: 'FAQ Articles',
                landing_portable_faq_sub: 'Artwork, color and shipping guidance for display projects.',
                landing_portable_faq_card_1_h3: 'Artwork Files',
                landing_portable_faq_card_1_p: 'Preferred formats, bleed, fonts and how to avoid delays.',
                landing_portable_faq_card_2_h3: 'Lead Time',
                landing_portable_faq_card_2_p: 'How to plan for exhibitions and shipping.',
                landing_portable_faq_card_3_h3: 'Shipping Options',
                landing_portable_faq_card_3_p: 'Express vs air vs sea and how to choose.',
                landing_portable_faq_view_all: 'View all FAQs',

                page_title_beach: 'Beach Flag Supplier | Feather & Teardrop Flag OEM | WaiKwan',
                landing_top_bar_beach: 'Factory direct · Flags + poles + bases · Reply within 24 hours',
                landing_beach_h1: 'Beach Flag Supplier for OEM Feather and Teardrop Flag Kits',
                landing_beach_lead:
                    'WaiKwan supplies custom feather flags, teardrop flags, poles, bases and carry bags for distributors, print shops, agencies and outdoor promotion teams. Share flag shape, size, quantity, artwork and destination to confirm MOQ, production lead time, packing and shipping options.',
                landing_beach_card_1_h3: 'Product Range',
                landing_beach_card_1_p: 'Feather flags, teardrop flags, rectangular flags, pole sets, bases (cross, water/sand, ground spike).',
                landing_beach_card_2_h3: 'MOQ',
                landing_beach_card_2_p: 'Low MOQ available for new designs. Bulk orders supported with stable color consistency.',
                landing_beach_card_3_h3: 'Lead Time',
                landing_beach_card_3_p: 'Typical production 7–12 days after artwork approval. Pole/base stock options available.',
                landing_beach_card_4_h3: 'Export Support',
                landing_beach_card_4_p: 'Export packing, barcode/label support, and shipping to US/EU/AU/SEA markets.',
                landing_beach_contact_line_html:
                    'Contact: <a href="mailto:yishu@waikwantent.com">yishu@waikwantent.com</a> · WhatsApp: <a href="https://wa.me/8613824540280" target="_blank" rel="noopener">+86 138 2454 0280</a> · WeChat: massifmyth',
                landing_beach_guides_row_html:
                    'Long-form guides: '
                    + '<a href="/seo/beach-flag-manufacturer-wholesale-feather-teardrop-flags.html">wholesale feather & teardrop flags</a>'
                    + ' · '
                    + '<a href="/seo/custom-printed-feather-flag-supplier-bulk-order-oem.html">bulk OEM feather flag printing</a>'
                    + ' · '
                    + '<a href="/site-map.html#seo-guides">all flag & tent guides</a>',
                landing_beach_buyers_h2: 'Common Buyer Requests',
                landing_beach_buyers_lead: 'We help you choose the right fabric, printing and base so your flags stand well outdoors.',
                landing_beach_buyer_1_h3: 'Fabric Options',
                landing_beach_buyer_1_p: 'Polyester flags for vivid printing. Single or double-sided solutions depending on usage.',
                landing_beach_buyer_2_h3: 'Finishing',
                landing_beach_buyer_2_p: 'Reinforced pockets, hem stitching, and pole compatibility checked before shipping.',
                landing_beach_buyer_3_h3: 'Bases',
                landing_beach_buyer_3_p: 'Cross base for indoor, water/sand base for outdoor, ground spike for grass/soil.',
                landing_beach_buyer_4_h3: 'Packing',
                landing_beach_buyer_4_p: 'Carry bag included (optional). Retail packing and barcodes supported for chains.',
                landing_beach_faq_articles_h2: 'FAQ Articles',
                landing_beach_faq_articles_lead: 'Quick answers for artwork and shipping — helps your team place orders faster.',
                landing_beach_faq_card_1_h3: 'Artwork Files (AI/PDF)',
                landing_beach_faq_card_1_p: 'How to send printing files, bleed, fonts, and color settings.',
                landing_beach_faq_card_2_h3: 'Color Matching',
                landing_beach_faq_card_2_p: 'Why colors vary and how to control deviations across batches.',
                landing_beach_faq_card_3_h3: 'Shipping Methods',
                landing_beach_faq_card_3_p: 'Express vs air vs sea, cost/time trade-offs and what we need from you.',

                footer_legal_link_faq: 'FAQ',
                footer_legal_link_canopy: 'Canopy Tent Manufacturer',
                footer_legal_link_beach: 'Beach Flag Supplier',
                footer_legal_link_display: 'Display Systems Manufacturer',
                footer_legal_link_guides: 'B2B Guides',
                
                // About
                about_title: 'About WaiKwan',
                about_subtitle: 'OEM/ODM factory — custom canopy tents, beach flags & portable display systems',
                about_intro: 'WaiKwan is a China-based OEM/ODM manufacturer of custom printed canopy tents, beach flags and portable display systems. Since 2010 we have delivered exhibit and outdoor programs worldwide with in-house frames, fabric printing and QC—built for distributors, agencies and brands that need dependable export execution.',
                about_mission_title: 'Our Mission',
                about_mission: 'Our Mission',
                about_mission_text: 'Our mission is to support brand visibility and marketing success by providing high-quality, customizable and easy-to-use tent and display solutions for events, exhibitions and outdoor promotions worldwide.',
                about_vision_title: 'Our Vision',
                about_vision: 'Our Vision',
                about_vision_text: 'Our vision is to become a long-term, trusted manufacturing partner in the global tent and display system industry, delivering stable quality, flexible customization and sustainable value for our clients.',
                about_stat_years: 'Years Manufacturing Experience',
                about_stat_clients: 'Global Clients',
                about_stat_products: 'Product Models & Solutions',
                about_products_title: 'Product Range & Capabilities',
                about_products_main: 'Main Product Categories:',
                about_product_1: 'Tents (Pop-up Tent, Marquee, Large Event Tent)',
                about_product_2: 'Beach Flags & Flag Poles',
                about_product_3: 'Display Systems',
                about_product_4: 'Table covers, fabric displays and branding accessories',
                about_product_5: 'Customized outdoor branding solutions',
                about_printing_title: 'Printing & Production:',
                about_printing_1: 'Digital printing, screen printing, heat transfer',
                about_printing_2: 'Multiple fabric and structure options',
                about_printing_3: 'Strict quality control and consistency standards',
                about_philosophy_title: 'Our Philosophy',
                about_philosophy_mission_label: 'Mission',
                about_philosophy_mission: 'Supporting brand visibility and commercial success',
                about_philosophy_values_label: 'Values',
                about_philosophy_values: 'Integrity, innovation and long-term cooperation',
                about_philosophy_quality_label: 'Quality Policy',
                about_philosophy_quality: 'Stable quality, on-time delivery, reliable service',
                about_philosophy_commitment_label: 'Quality Commitment',
                about_philosophy_commitment: 'Products meet international standards and customer requirements',
                about_meta_title: 'About WaiKwan | Canopy Tents, Beach Flags & Display Systems Manufacturer',
                about_meta_description: 'WaiKwan (Guangxi) is an OEM/ODM factory for custom printed canopy tents, beach flags, portable display systems and SEG light boxes—built for distributors, agencies and global export programs.',
                about_who_we_serve: 'We work with distributors, event teams, resellers and brand programs that need dependable manufacturing, clear specifications and export-friendly packing and documentation.',
                about_section_overview: 'Company overview',
                about_section_capabilities: 'Manufacturing & product range',
                about_section_mission: 'Mission & vision',
                about_section_philosophy: 'Our philosophy',
                about_section_why: 'Why buyers work with WaiKwan',
                about_breadcrumb_home: 'Home',
                about_breadcrumb_current: 'About us',
                home_about_teaser_title: 'About WaiKwan',
                home_about_teaser_p: 'OEM/ODM factory for custom canopy tents, beach flags and portable display systems. Stocked frames, in-house fabric printing and export-ready execution for teams worldwide.',
                faq_meta_title: 'Buyer FAQ | MOQ, Lead Time, Artwork, Color & Shipping | WaiKwan',
                faq_meta_description: 'B2B FAQ for custom tents, flags and displays: MOQ, lead time, artwork files, color matching, samples and shipping—written for procurement and project teams.',
                faq_hero_kicker: 'B2B buyer support',
                faq_hero_h1: 'Buyer FAQ',
                faq_hero_sub: 'Fast answers for MOQ, lead time, artwork files, color matching and shipping — so your team can place orders with fewer revisions.',
                faq_badge_moq: 'MOQ',
                faq_badge_time: 'Lead time',
                faq_badge_files: 'Artwork',
                faq_badge_color: 'Color',
                faq_badge_ship: 'Shipping',
                faq_badge_sample: 'Samples',
                faq_popular_title: 'Fast links',
                faq_cta_title: 'Still have questions?',
                faq_cta_text: 'Send product type, rough quantities and your target market—our team will help you move to a quote or sampling plan.',
                faq_cta_whatsapp: 'Message on WhatsApp',
                stat_years: 'Years Manufacturing Experience',
                stat_clients: 'Global Clients',
                stat_products: 'Product Models & Solutions',
                
                // Features
                feature_quality: 'Highest Quality',
                feature_quality_desc: 'Using premium materials, strict quality control, ensuring durable and reliable products',
                feature_fast: 'Fast Delivery',
                feature_fast_desc: 'Efficient production process, fast logistics delivery, ensuring timely arrival',
                feature_custom: 'Customization Service',
                feature_custom_desc: 'Professional design team, supporting OEM/ODM, meeting your personalized needs',
                feature_global: 'Global Export',
                feature_global_desc: 'Products exported to multiple countries, rich international market experience',
                
                // Standard Size Options
                sizes_title: 'Standard Size Options',
                sizes_subtitle: 'Standard sizes shown below. Custom sizes & modular combinations available.',
                sizes_tent_title: 'Pop-up Canopy Tent',
                sizes_giant_title: 'Large Event / Giant Tent',
                sizes_display_title: 'Display Systems / Quick Display System',
                sizes_tag_hot: 'Best Seller',
                sizes_tag_modular: 'Modular',
                sizes_tag_fast: 'Fast Setup',
                sizes_standard: 'Standard Sizes',
                sizes_standard_combo: 'Standard Combination Sizes',
                sizes_standard_options: 'Standard Options',
                sizes_features: 'Features',
                sizes_apps: 'Applications',
                sizes_tent_f1: 'Folding aluminum or steel frame',
                sizes_tent_f2: 'Tool-free and fast installation',
                sizes_tent_f3: 'Custom printed canopy and sidewalls available',
                sizes_tent_app: 'Brand promotion, outdoor events, exhibitions and marketing activities',
                sizes_giant_custom: 'Larger sizes available with modular connection',
                sizes_giant_f1: 'Modular structure system',
                sizes_giant_f2: 'Heavy-duty aluminum frame',
                sizes_giant_f3: 'Custom span and height available',
                sizes_giant_app: 'Large-scale events, exhibitions, temporary halls and brand showcases',
                sizes_display_s1: 'Width modules: 3 m / 4 m / 5 m',
                sizes_display_s2: 'Shapes: Straight / Curved / U-shape',
                sizes_display_s3: 'Single-sided or double-sided display',
                sizes_display_f1: 'Lightweight and portable structure',
                sizes_display_f2: 'Fast setup and easy transportation',
                sizes_display_f3: 'Replaceable graphics with high-resolution printing',
                sizes_display_app: 'Trade shows, backdrop displays and brand presentation',
                sizes_view_products: 'View Products',
                sizes_get_quote: 'Get Quote',
                sizes_note: 'Standard sizes are for reference only. Contact us for custom solutions.',
                sizes_cta: 'Get Quote',
                popular_sizes_title: 'Standard Size Options',
                popular_sizes_subtitle: 'Standard sizes shown below. Custom sizes & modular combinations available.',
                size_category_tent_title: 'Pop-up Canopy Tent',
                size_category_large_title: 'Large Event Tent / Giant Tent',
                size_category_display_title: 'Display Systems / Quick Display System',
                size_standard_sizes: 'Standard Sizes:',
                size_standard_combination: 'Standard Combination Sizes:',
                size_standard_options: 'Standard Options:',
                size_features: 'Features:',
                size_product_features: 'Features:',
                size_applications: 'Applications:',
                size_tent_feature_1: 'Folding aluminum or steel frame',
                size_tent_feature_2: 'Tool-free and fast installation',
                size_tent_feature_3: 'Custom printed canopy and sidewalls available',
                size_tent_applications: 'Brand promotion, outdoor events, exhibitions and marketing activities',
                size_category_large_note: 'Larger sizes available with modular connection',
                size_large_feature_1: 'Modular structure system',
                size_large_feature_2: 'Heavy-duty aluminum frame',
                size_large_feature_3: 'Custom span and height available',
                size_large_applications: 'Large-scale events, exhibitions, temporary halls and brand showcases',
                size_display_option_1: 'Width modules: 3 m / 4 m / 5 m',
                size_display_option_2: 'Shapes: Straight / Curved / U-shape',
                size_display_option_3: 'Single-sided or double-sided display',
                size_display_feature_1: 'Lightweight and portable structure',
                size_display_feature_2: 'Fast setup and easy transportation',
                size_display_feature_3: 'Replaceable graphics with high-resolution printing',
                size_display_applications: 'Trade shows, backdrop displays and brand presentation',
                size_cta_text: 'Standard sizes are for reference only. Contact us for custom solutions.',
                size_cta_text_en: '',
                
                // Testimonials
                testimonials_title: 'Customer Reviews',
                testimonials_subtitle: 'Real feedback from customers worldwide',
                testimonial_1_text: '"Consistent product quality, responsive service, and on-time delivery. We have been pleased to work with Wai Kwan Tent."',
                testimonial_1_name: 'David T.',
                testimonial_1_role: 'Event Planning Company',
                testimonial_2_text: '"Strong customization support for our requirements, and finished goods consistently met our quality bar."',
                testimonial_2_name: 'Antonio C.',
                testimonial_2_role: 'Restaurant Owner',
                testimonial_3_text: '"Knowledgeable team with fast replies. The products aligned well with our brand guidelines."',
                testimonial_3_name: 'Owen B.',
                testimonial_3_role: 'Entertainment Industry',
                
                // Products
                products_title: 'Products',
                products_subtitle: 'Tents · Flags · Display Systems · Outdoor Branding Systems',
                products_subtitle_en: '',
                products_tents_title: 'Tents',
                products_tents_desc: 'We offer a complete range of tent solutions including pop-up tents, marquees and large event tents. Designed for exhibitions, promotions and outdoor events, our tents are available in standard sizes or fully customized to meet specific project requirements.',
                products_flags_title: 'Beach Flags & Poles',
                products_flags_desc: 'Our beach flag and pole systems are ideal for outdoor branding, sports events and commercial promotions. Multiple shapes, sizes and base options are available, with high-quality printing to ensure strong visual impact.',
                products_display_title: 'Display Systems',
                products_display_desc: 'Our display systems provide portable and professional solutions for exhibitions, backdrops and brand presentations. Lightweight structures, fast setup and replaceable graphics make them ideal for repeated use.',
                products_accessories_title: 'Fabric Displays & Accessories',
                products_accessories_desc: 'We supply a full range of fabric displays and accessories including table covers, banners and supporting components, designed to complete integrated outdoor branding systems.',
                products_custom_title: 'Custom Solutions',
                products_custom_desc: 'We provide OEM and ODM services, offering full customization from structure design and sizing to graphic printing. Our team works closely with clients to deliver tailored solutions for different markets and applications.',
                products_cta: 'Get Quote',
                products_category_tents_title: 'Tents',
                products_category_tents_desc: 'A full range of tent solutions designed for promotions, exhibitions and outdoor events. Custom sizes and branding options available.',
                products_category_tents_desc_en: '',
                products_category_flags_title: 'Beach Flags & Poles',
                products_category_flags_desc: 'A variety of beach flag shapes and pole systems for outdoor promotion, events and branding, with multiple printing options.',
                products_category_flags_desc_en: '',
                products_category_displays_title: 'Display Systems',
                products_category_displays_desc: 'Portable display systems including backdrops, tension fabric, counters and light boxes.',
                products_category_displays_desc_en: '',
                products_category_accessories_title: 'Fabric Displays & Accessories',
                products_category_accessories_desc: 'Table covers, fabric banners and display accessories designed to complete outdoor branding systems.',
                products_category_accessories_desc_en: '',
                products_category_custom_title: 'Custom Solutions',
                products_category_custom_desc: 'Full customization available from structure and size to graphic printing, tailored to different markets and project requirements.',
                products_category_custom_desc_en: '',
                products_cta_text: 'Contact us for specifications and a tailored quotation for your market.',
                products_cta_text_en: '',
                products_cta_button: 'Get Quote',
                category_all: 'All Products',
                category_furniture: 'Outdoor Furniture',
                category_tents: 'Tent Display',
                category_flags: 'Flag Advertising',
                category_custom: 'Custom Products',
                category_tablecloths: 'Tablecloths',
                category_popup: 'Display Systems',
                category_displays: 'Display Systems',
                category_lightbox: 'Light Box Series',
                menu_light_box_series: 'Light Box Series',
                cat_lightbox_title: 'Light Box Series',
                cat_lightbox_desc: 'LED backlit SEG lightbox systems for trade shows, retail and showrooms.',

                menu_displays_tension_fabric: 'Tension Fabric Displays',
                menu_lightbox_round_tube: 'Round Tube Light Box Series',
                menu_lightbox_aluminum_profile: 'Aluminum Profile SEG Light Box Series',
                menu_lightbox_seg_net: 'SEG Net Light Box Series',
                menu_lightbox_base_style_variant: 'Light Box Display Stand',
                category_inflatable: 'Inflatables',
                category_accessories: 'Accessories',
                category_frames: 'Tent Frame',
                
                // Top Bar
                top_bar_text: '25+ years of trusted manufacturing experience',
                
                // Navigation
                nav_products_by_size: 'By Size',
                nav_info: 'Information',
                nav_product_center: 'Products',
                nav_all_products: 'Browse Products',
                nav_news: 'News',
                footer_news: 'News',
                home_news_title: 'Latest News',
                home_news_intro: 'Follow our recent exhibitions, product highlights, and company updates.',
                home_news_feature_title: 'Wai Kwan Tent Showcased at APPPEXPO 2026 in Shanghai',
                home_news_feature_summary: 'At APPPEXPO 2026 in Shanghai we presented beach flags, display hardware, and custom branding solutions, and met buyers on the show floor.',
                home_news_btn_all: 'View All News',
                home_news_btn_read: 'Read More',
                home_news_feature_meta: 'Exhibition · Mar 2026 · Shanghai',
                news_meta_label: 'Exhibition',
                news_placeholder_1_title: 'Parasols, Beach Flag Poles & Bases',
                news_placeholder_1_desc: 'Sun parasols, beach flags, poles, and weighted bases for outdoor branding and event display—shown on site at APPPEXPO Shanghai.',
                news_placeholder_2_title: 'Tent Frames & Structural Hardware',
                news_placeholder_2_desc: 'Folded aluminum pop-up tent frames and structural hardware on display—highlighting manufacturing-ready solutions for exhibitions and events.',
                news_placeholder_1_img_alt: 'APPPEXPO Shanghai — parasols, beach flag poles and bases on display',
                news_placeholder_2_img_alt: 'APPPEXPO Shanghai — folded tent frames and aluminum frame hardware',
                news_back: 'Back to News',
                news_related: 'Related updates',
                news_apppexpo_feature_alt: 'Wai Kwan Tent booth at APPPEXPO 2026 Shanghai',
                product_center_title: 'Product Center',
                product_center_subtitle: 'Browse categories or search in "All Products".',
                back_to_product_center: 'Back to Product Center',
                pc_context_overview_hint: 'Category overview — sub-series and entry points',
                pc_subhub_visual_title: 'Series gallery',
                pc_context_browse_skus: 'Browse full SKU list for this category',
                pc_context_all_categories: 'All categories',
                ap_page_role_hint: 'Searchable catalog of every SKU. To browse by sub-series, use Product Center.',
                ap_h1_all_products: 'All Products',
                ap_intro_lead: 'Browse our full range of canopy tents, beach flags, display systems, event hardware, and OEM display solutions. This page helps B2B buyers quickly compare categories, sizes, and applications before requesting a quote.',
                ap_intro_keywords: 'We manufacture folding canopy tents, printed beach flags, pop-up backdrops, counters, light boxes, and related event display accessories for wholesale and OEM projects.',
                ap_no_catalog_data: 'Product catalog is loading or temporarily unavailable. Please refresh, or contact us for a list.',
                ap_browse_by_category: 'Browse by category',
                tent_type_seo_h1: 'Tent Types & Specifications',
                tent_type_seo_intro_1: 'Explore WaiKwan canopy tent types, frame options, common sizes, and material specifications for events, retail promotions, exhibitions, and outdoor branding projects. This guide helps wholesale and OEM buyers compare folding tents, inflatable tents, and larger event tent structures.',
                tent_type_seo_intro_2: 'Compare frame series, size options, roof styles, and typical applications before moving to a product detail page or requesting a quotation from our factory team.',
                tent_type_seo_type_param_note: 'URLs with a type query open the dedicated model view.',
                tent_type_nav_lead: 'Quick links:',
                tent_type_link_custom_canopy: 'Custom Canopy Tent Manufacturer',
                tent_type_link_all_canopy: 'All Canopy Products',
                tent_type_link_product_center_tents: 'Product Center – Tents',
                tent_type_error_not_found: 'Tent type not found.',
                tent_type_breadcrumb_not_found: 'Not found',
                tent_type_link_browse_tens: 'Browse All Tents',
                tent_type_hub_lead_p: 'This hub explains WaiKwan folding canopy tent series: 30 (square-tube) and 40/50 (hexagon) frames, standard metric sizes, heat-transfer printing on tops and walls, and how to request factory-direct pricing. It is built for importers, distributors, event companies, and display buyers comparing OEM or wholesale tent programs. Use the cards below to open each series page, or jump to <a href="product-center.html?cat=tents">Product Center – Tents</a> for the full category layout.',
                tent_type_hub_h2_series: 'Folding Canopy Tent Types',
                tent_type_anchor_30: '30 Series Pop Up Canopy Tent',
                tent_type_hub_30_p: '30 mm square-tube frame (iron or aluminum). Standard promotional sizes from 1.5×1.5 m to 3×6 m. Economical choice for high-volume programs.',
                tent_type_anchor_40: '40 Series Hexagon Frame Tent',
                tent_type_hub_40_p: '40 mm hexagon aluminum (or iron where noted). Mid-range strength for events, retail activations, and repeat setup cycles.',
                tent_type_anchor_50: '50 Series Heavy Duty Aluminum Tent',
                tent_type_hub_50_p: '50 mm hexagon aluminum. Heavy-duty line for larger footprints and higher load expectations.',
                tent_type_hub_link_specs: 'Tent sizes and specifications',
                tent_type_hub_h2_compare: 'Compare Tent Series',
                tent_type_hub_compare_p: '<strong>30 series</strong> targets cost-sensitive, high-rotation use with smaller tube diameter. <strong>40 series</strong> balances weight and rigidity for typical trade show and roadshow use. <strong>50 series</strong> is positioned for the largest available folding footprints and the stiffest frame in this group. All three support custom graphics; MOQ from 1 unit and typical production 7–15 days (carton export packing). <a href="custom-canopy-tent-manufacturer.html">Custom Canopy Tent Manufacturer</a> explains the full OEM workflow.',
                tent_type_hub_h2_1010: '10x10 Canopy Tent Options',
                tent_type_hub_1010_p: 'A <strong>3×3 m</strong> canopy is the metric equivalent of a <strong>10×10 ft</strong> market reference. 10×10 / 3×3 options exist across 30, 40, and 50 series with different frame grades—compare each series page before locking specifications. For US-market wording, also see <a href="10x10-pop-up-canopy-tent.html">10x10 pop up canopy tent</a> and <a href="all-products.html?cat=tents">Browse All Tents</a> in the live catalog.',
                tent_type_hub_h2_sizes: 'Common Tent Sizes',
                tent_type_hub_sizes_p: 'Standard metric footprints include 1.5×1.5 m through 4×8 m depending on series. Each series page lists models, weights, and can pair with <a href="tent-type.html?type=folding30">30 Series</a>, <a href="tent-type.html?type=folding40">40 Series</a>, or <a href="tent-type.html?type=folding50">50 Series</a> detail tables.',
                tent_type_hub_h2_print: 'Printing & Customization',
                tent_type_hub_print_p: 'Heat transfer printing is available for canopy tops, half walls, and full walls. WaiKwan coordinates frame production and fabric finishing in one workflow for repeat B2B orders. <a href="custom-printed-canopy-tents.html">Canopy tent printing options</a> (topic) complement this technical hub.',
                tent_type_related_pages_h2: 'Related Tent Pages',
                tent_type_guides_h2: 'Related Buying Guides',
                tent_type_cta_quote: 'Request a Quote',
                pc_meta_title_tents: 'Canopy Tents Product Center | Folding Tent Series & Sizes | WaiKwan',
                pc_meta_desc_tents: 'Browse WaiKwan canopy tent product center for folding tent series, tent sizes, custom printing options, and OEM-ready tent solutions for B2B buyers.',
                pc_meta_title_flags: 'Beach Flags & Poles Product Center | Feather, Teardrop & Base Kits | WaiKwan',
                pc_meta_desc_flags: 'Browse WaiKwan beach flag and pole systems including feather flags, teardrop flags, pole kits, bases, carry bags, and export-ready OEM programs.',
                pc_meta_title_displays: 'Display Systems Product Center | Backdrops, Stands & Trade Show Counters | WaiKwan',
                pc_meta_desc_displays: 'Explore WaiKwan portable display systems for pop-up backwalls, tension fabric displays, counters, SEG light boxes, and OEM trade show programs.',
                pc_meta_title_lightbox: 'Light Box Product Center | SEG Fabric Light Boxes & Advertising Displays | WaiKwan',
                pc_meta_desc_lightbox: 'Browse WaiKwan SEG fabric light boxes and advertising light box displays for retail, exhibitions, events, and wholesale display programs.',
                pc_meta_title_accessories: 'Tent & Display Accessories Product Center | Weights, Walls, Bases & Spare Parts | WaiKwan',
                pc_meta_desc_accessories: 'Find WaiKwan tent, flag, and display accessories including weights, sidewalls, roller bags, flag bases, connectors, and replacement parts.',
                pc_meta_title_racegate: 'Race Gate Product Center | Inflatable Arches & Event Gate Displays | WaiKwan',
                pc_meta_desc_racegate: 'Browse WaiKwan race gate products including inflatable arches, semi-circle gates, V gates, and O gates for events, races, and promotions.',
                pc_tent_cluster_h2: 'Related tent procurement',
                pc_tent_cluster_html: 'Compare the <a href="tent-type.html">Folding Canopy Tent Types</a> hub (30/40/50), then review <a href="custom-canopy-tent-manufacturer.html">Custom Canopy Tent Manufacturer</a>, <a href="all-products.html?cat=tents">Browse All Tents</a>, and beach flag poles at <a href="all-products.html?cat=flags&amp;tag=beach-flag-poles">all-products (beach flag poles)</a>.',
                ap_tent_topic_h2: 'Tent topic cluster',
                ap_tent_topic_html: 'Factory path: <a href="custom-canopy-tent-manufacturer.html">Custom Canopy Tent Manufacturer</a> · <a href="tent-type.html">Folding Canopy Tent Types</a> · <a href="10x10-pop-up-canopy-tent.html">10x10 Canopy Tent Options</a> · <a href="product-center.html?cat=tents">Product Center – Tents</a> · <a href="all-products.html?cat=tents">Browse All Tents</a> · <a href="all-products.html?cat=flags&amp;tag=beach-flag-poles">Beach flag poles (catalog)</a>',
                home_core_tent_topic_html: '<a href="tent-type.html">Folding Canopy Tent Types</a> · <a href="all-products.html?cat=tents">Browse All Tents</a> · <a href="product-center.html?cat=tents">Product Center – Tents</a>',
                ap_open_category_hub: 'Open category overview (Product Center)',
                ap_open_type_hub: 'Open series landing page',
                pdp_back_to_listing: 'Back to previous list',
                category_not_available: 'Category not available yet. Showing all categories.',
                // Products Dropdown Menu
                menu_tents: 'Tents',
                menu_custom_tents: 'Custom Tents',
                menu_stock_tents: 'Stock Tents',
                menu_beach_flags: 'Beach Flags & Poles',
                nav_beach_flag_poles: 'Beach Flag Poles',
                menu_popup_displays: 'Display Systems',
                menu_popup_backdrop: 'Fabric Pop-up Backdrop',
                menu_popup_counter: 'Tension Fabric Counter',
                menu_popup_fabric_banner_stands: 'Fabric Banner Stands',
                menu_popup_tfd_accessories: 'Accessories',
                menu_popup_tfd_straight_line_series: 'Straight Line Series',
                menu_popup_tfd_c_shaped_series: 'C-Shaped Series',

                menu_displays_roll_up_stand: 'Roll Up Stand',
                menu_displays_promotion_counter: 'Promotion Counter',

                pdp_optional_accessories: 'Optional Accessories',
                menu_displays_aframe: 'A-Frame Display System',
                menu_displays_aframe_backdrop: 'Backdrop System',
                menu_accessories: 'Accessories',
                menu_racegate: 'RaceGate',
                nav_racegate_sub_v: 'V Race Gate',
                nav_racegate_sub_o: 'O Race Gate',
                nav_racegate_sub_semi: 'Semi-circle Race Gate',
                pc_racegate_browse_all: 'Browse All Race Gate Products',
                menu_replacement_parts: 'Replacement Parts',
                category_view_all: 'View All',
                category_search_products: 'Search Products',
                view_details: 'View Details',
                tents_hub_folding_title: 'Folding Tents',
                tents_hub_event_title: 'Event Tents',
                tents_hub_accessories_title: 'Tent Accessories (Full Range)',
                flags_hub_poles_title: 'Beach Flags & Poles',
                flags_hub_special_title: 'Backpack & Street/Display Flags',
                flags_hub_accessories_title: 'Beach Flag Bases & Accessories',
                view_type_button: 'View Type',
                tent_types_title: 'Tent Types',
                view_tent_type: 'View Type',
                tent_type_no_match: 'This tent type has no mapped products yet.',
                products_no_results: 'No products found',
                products_page_retired_title: 'This page has been moved',
                products_page_retired_text: 'Please visit:',

                // Accessories page
                accessories_page_title: 'Accessories',
                accessories_search_placeholder: 'Search accessories',
                accessories_page_intro: 'Browse our accessories below and click any item to view specifications.',
                accessories_coming_soon: 'Coming soon',
                accessories_overview_alt: 'Accessories overview',
                accessories_open_full_page: 'Open full accessories page',

                // Buttons
                btn_back: 'Back',

                // ARIA labels
                aria_search: 'Search',
                aria_cart: 'RFQ list',
                aria_language: 'Language',
                aria_select_language: 'Select language',
                aria_breadcrumb: 'Breadcrumb',

                // Language names
                lang_name_en: 'English',
                lang_name_zh: 'Chinese',

                // Common buttons
                download_materials: 'Download materials',

                // Common labels
                label_model: 'Model',

                // View-type pages
                flag_type_not_found: 'Flag type not found.',

                // Nav extras
                nav_top3_sizes: 'Top 3 Sizes',

                // Six-sided booth page
                six_sided_booth_name: 'Six-sided Promotional Booth',
                six_sided_booth_title: 'Six-sided Promotional Booth (Dome Top)',
                six_sided_booth_specs: 'Model: WK-T80B | Material: Iron | Size: 3×3M | Weight: 60KG',
                six_sided_booth_images_title: 'Product Images',

                // Legal / disclaimer
                third_party_trademarks_disclaimer:
                    'All third-party trademarks, logos, and brand names shown on this website are the property of their respective owners.\n'
                    + 'Their use does not imply any affiliation, endorsement, or sponsorship by Guangxi WaiKwan Tent Manufacturing Co., Ltd.\n'
                    + 'They are displayed solely for identification and demonstration purposes.',

                // Cookie consent
                cookie_title: 'Cookie Settings',
                cookie_text: 'We use cookies to ensure the website functions properly, and—only with your consent—for preferences and analytics to improve your experience. You can change your settings anytime.',
                cookie_accept_all: 'Accept all',
                cookie_reject_all: 'Reject all',
                cookie_customize: 'Customize',
                cookie_settings_title: 'Cookie Preferences',
                cookie_category_necessary: 'Necessary cookies (always on)',
                cookie_category_preferences: 'Preference cookies (e.g., customer identifier)',
                cookie_category_analytics: 'Analytics cookies',
                cookie_save: 'Save settings',
                cookie_close: 'Close',

                // Common UI attributes
                brand_since_2010: 'Since 2010',
                form_submit_success: 'Thank you — your message was sent. We will respond as soon as possible.',

                // Products dropdown extras
                menu_table_chair_stool_toilet: 'Tables / Chairs / Stools / Sanitation',
                menu_dome_3_folders: 'DOME 3 Folding Series',
                btn_add_to_inquiry: 'Add to Inquiry',
                type_page_loading_catalog: 'Loading models…',
                view_type_intro_furniture:
                    'Portable folding tables, chairs, stools and sanitation units for exhibitions, roadshows, camping and temporary events. OEM/ODM, bulk packing and export inspection supported. Add any model below to your inquiry list.',
                view_type_intro_dome:
                    'The DOME 3 folding series includes car-top tents, privacy/dressing tents and folding storage baskets—compact to ship and quick to deploy. Specifications and packing are confirmed per project. Add any SKU below to your inquiry list.',
                ap_listing_group_furniture_note: 'Filtered list: Tables / Chairs / Stools / Sanitation group.',
                ap_listing_group_dome_note: 'Filtered list: DOME 3 Folding Series (tents + related folding SKUs).',
                view_type_link_all_dome_skus: 'Browse all SKUs in this series (full catalog)',

                // View-type pages
                view_type_models: 'Models',
                view_type_brochure_ref: 'Brochure PDF Guide',
                view_type_brochure_source_17: 'Source: catalog page 17 — images/广西伟群帐篷制造有限公司2025allpagepng/17.png',
                view_type_brochure_source_dome: 'Source: catalog reference (illustrative — confirm specs with the model table).',
                view_type_brochure_source_19: 'Source: catalog page 19.png',
                view_type_brochure_source_20: 'Source: catalog page 20.png',
                view_type_brochure_source_25: 'Source: catalog page 25.png',
                view_type_page_title_furniture: 'Tables / Chairs / Stools / Sanitation',
                view_type_page_title_dome: 'DOME 3 Folding Series',
                view_type_subtitle: 'Model list and catalog reference (click the image to zoom).',
                view_type_browse_all_tents: 'Browse all tents',
                view_type_browse_all_furniture: 'Browse all furniture',
                view_type_browse_all_furniture_products: 'Browse all furniture products',
                
                // Breadcrumb and Search
                breadcrumb_home: 'Home',
                breadcrumb_products: 'Products',
                search_overlay_title: 'Search products',
                search_overlay_button: 'Search',
                products_search_placeholder: 'Search products (name / keywords / specs)',
                filters_title: 'Filters',
                filters_clear: 'Clear',
                filters_category: 'Category',
                filters_quick_tags: 'Popular Keywords',
                sort_by: 'Sort by',
                sort_popular: 'Most Popular',
                sort_new: 'Newest',
                sort_name: 'Name A–Z',
                
                // Product Categories
                product_categories_title: 'Product Categories',
                category_tents_desc: 'Professional tent products for various event scenarios',
                category_flags_desc: 'Beach flags, poles, bases, and outdoor advertising display products',
                category_popup_desc: 'Quick-setup display systems',
                category_furniture_desc: 'Foldable tables and chairs for outdoor use',
                category_tablecloths_desc: 'Tablecloths and fitted covers for folding tables',
                category_frames_desc: 'Professional tent frames and accessories',
                category_custom_desc: 'Custom products tailored to your needs',
                
                // Services
                services_title: 'Service Range',
                services_subtitle: 'Comprehensive outdoor furniture manufacturing services from design to finished product',
                service_design: 'Design Services',
                service_design_desc: 'Professional product design team to create unique outdoor furniture solutions for you',
                service_manufacturing: 'Manufacturing Services',
                service_manufacturing_desc: 'Advanced manufacturing equipment ensures every outdoor furniture product is perfectly presented',
                service_customization: 'Customization Services',
                service_customization_desc: 'Professional product customization services to meet your special needs and brand requirements',
                service_delivery: 'Delivery Services',
                service_delivery_desc: 'Fast and secure logistics delivery to ensure timely tent product delivery',
                
                // Contact
                contact_title: 'Contact Us',
                contact_subtitle: 'Send your RFQ for OEM/ODM tents, flags and display systems',
                contact_page_h1: 'Request a Quote for Custom Tents, Flags and Displays',
                contact_page_spec_line: 'Include product type, size, quantity, artwork files, target market, deadline and destination for faster MOQ and lead-time confirmation.',
                contact_page_final_title: 'Need a fast quote?',
                contact_page_final_sub: 'Send your spec today — we typically reply within 24 hours.',
                home_contact_compact_h2: 'Request a quotation',
                home_contact_compact_p: 'For the full inquiry form, map, factory contact details and WhatsApp, go to our dedicated contact page.',
                home_contact_compact_spec: 'Tip: include product type, size, quantity, printing and delivery needs.',
                home_contact_sticky_aria: 'Get a quote — open contact page',
                contact_info_title: 'How to reach us',
                contact_seo_text: 'Contact Guangxi WaiKwan Tent Manufacturing Co., Ltd. for factory-direct custom canopy tents, beach flags, portable displays and light boxes with OEM/ODM support, export packing and quote response within 24 hours.',
                contact_address_label: 'Address',
                contact_address_title: 'Address',
                contact_address_value: 'Niujiaochong, Luchuan County, Yulin, Guangxi, China, 537609',
                contact_address: 'Niujiaochong, Luchuan County, Yulin, Guangxi, China, 537609',
                contact_location_title: 'Our Location',
                contact_open_in_maps: 'Open in Google Maps',
                contact_address_en: 'Niujiaochong, Luchuan County, Yulin, Guangxi, China, 537609',
                contact_opening_hours_title: 'Opening Hours',
                contact_opening_hours_line1: 'Monday to Friday: 8:00–18:00',
                contact_opening_hours_line2: 'Saturday & Sunday: By appointment',
                contact_phone_label: 'Phone',
                contact_phone_title: 'Phone Number',
                contact_email_label: 'Email',
                contact_email_title: 'Email Address',
                contact_qr_title: 'Scan to Contact',
                whatsapp_label: 'WhatsApp',
                contact_whatsapp_title: 'WhatsApp',
                contact_whatsapp_note: 'Scan to chat on WhatsApp',
                wechat_label: 'WeChat',
                contact_wechat_title: 'WeChat',
                contact_wechat_note: 'Scan to add on WeChat',
                
                // Form
                contact_form_name: 'Your Name',
                contact_form_email: 'Your Email',
                contact_form_phone: 'Phone Number',
                contact_form_message: 'Your Message',
                contact_form_submit: 'Send Message',
                form_name: 'Your Name',
                form_email: 'Your Email',
                form_phone: 'Phone Number',
                form_message: 'Your Message',
                form_submit: 'Send Message',
                
                // Inquiry Form (B2B High-Conversion)
                inquiry_form_title: 'Get Quote',
                inquiry_form_subtitle: 'Tell us about your project and our team will get back to you within 24 hours.',
                inquiry_form_reset: 'Reset',
                inquiry_form_unconfigured: 'Form submission is not connected yet. Please contact us via WhatsApp or email — we typically reply within 24 hours.',
                contact_form_title: 'Request a Quote',
                contact_promise_24h: 'We typically reply within 24 hours (often faster on business days).',
                contact_reply_24h_success: 'Sent successfully. We will reply within 24 hours.',

                // Contact funnel trust (What happens next)
                contact_next_title: 'What Happens After You Contact Us?',
                contact_next_step1_title: 'Requirement Review',
                contact_next_step1_desc: 'We review your product, size, quantity, and application.',
                contact_next_step2_title: 'Quotation Within 24 Hours',
                contact_next_step2_desc: 'Our sales team provides a factory-direct quotation within 24 hours.',
                contact_next_step3_title: 'Sample or Production Arrangement',
                contact_next_step3_desc: 'Samples or production are arranged after confirmation.',

                // Trust bullets near form
                trust_factory_direct: 'Factory Direct Manufacturer',
                trust_no_middleman: 'No Middleman',
                trust_oem_odm: 'OEM / ODM Supported',
                trust_export_experience: 'Export Experience for Global Markets',

                // Standardized inquiry fields
                inquiry_field_product_label: 'Product *',
                inquiry_field_product_placeholder: 'Select or type product',
                inquiry_field_quantity_label: 'Quantity *',
                inquiry_field_quantity_placeholder: 'Enter estimated quantity',
                inquiry_field_market_label: 'Target Market / Country *',
                inquiry_field_market_placeholder: 'e.g. US / EU / AU',
                inquiry_field_message_label: 'Message (Optional)',
                inquiry_field_message_placeholder: 'Add size (if applicable), usage, timeline, logo printing or custom requirements',
                inquiry_helper_quantity_example: 'e.g. 50 / 100 / 500 pcs',
                inquiry_helper_size_example: 'Please specify size if applicable',
                inquiry_form_name: 'Your Name *',
                inquiry_form_email: 'Your Email *',
                inquiry_form_company: 'Company Name',
                inquiry_form_country: 'Country / Region *',
                inquiry_form_product_placeholder: 'Product Category *',
                inquiry_form_product_tent: 'Canopy Tent',
                inquiry_form_product_flag: 'Beach Flags',
                inquiry_form_product_display: 'Display Systems',
                inquiry_form_product_custom: 'Custom Display Solution',
                inquiry_form_quantity_placeholder: 'Estimated Quantity',
                inquiry_form_quantity_sample: 'Sample Order',
                inquiry_form_quantity_10_50: '10 – 50 pcs',
                inquiry_form_quantity_50_200: '50 – 200 pcs',
                inquiry_form_quantity_200: '200+ pcs',
                inquiry_form_printing_placeholder: 'Custom Printing Required?',
                inquiry_form_printing_yes: 'Yes',
                inquiry_form_printing_no: 'No',
                inquiry_form_customer_placeholder: 'I am a...',
                inquiry_form_customer_brand: 'Brand Owner',
                inquiry_form_customer_distributor: 'Distributor / Wholesaler',
                inquiry_form_customer_project: 'Event / Project Buyer',
                inquiry_form_message: 'Please describe your requirements (size, usage, timeline, etc.) *',
                inquiry_form_submit: 'Send Inquiry',
                inquiry_form_sending: 'Sending...',
                inquiry_form_note: 'We respect your privacy. Your information will only be used to respond to your inquiry.',
                inquiry_form_success: 'Message sent. We will reply within 24 hours.',
                inquiry_form_failed: 'Failed to send. Please try again later.',

                // UI
                ui_copy: 'Copy',
                ui_copied: 'Copied!',
                ui_items_unit: 'items',
                ui_tip_cart_items: 'Tip: These lines come from your RFQ list. You can change quantity here.',
                ui_tip_cart_empty: 'Tip: Your RFQ list is empty. Showing top filtered products. For a precise quote, add products to your RFQ list first.',
                ui_copy_wechat_id: 'Copy WeChat ID',
                ui_overview: 'Overview',

                // Specs
                spec_col_model: 'Model',
                spec_col_size: 'Size',
                spec_col_weight: 'Weight',

                // View-type pages
                view_type_no_items_yet: 'No items found for this series yet.',
                contact_seo_footer: 'Looking for a reliable manufacturer of custom tents, flags or display systems? Contact Guangxi WaiKwan Tent Manufacturing Co., Ltd today to discuss your project.',
                
                // Logo Badge
                logo_since: 'Since 2010',
                
                // Footer
                footer_desc: 'Professional tent manufacturing service provider, committed to providing customers with the highest quality products and services.',
                footer_links_title: 'Quick Links',
                footer_contact_title: 'Contact Information',
                footer_rights: 'All rights reserved.',
                footer_follow_us: 'Follow Us',
                social_facebook: 'Facebook',
                social_linkedin: 'LinkedIn',
                social_instagram: 'Instagram',
                social_tiktok: 'TikTok',
                social_xiaohongshu: 'Xiaohongshu',
                
                // PDF Download
                pdf_download_title: 'Download Product Information',
                pdf_download_desc: 'Click the button below to download the complete product catalog and company introduction.',
                btn_download_pdf: 'Download PDF',
                btn_get_quote: 'Get Quote',
                btn_download: 'Download',
                btn_add_to_cart: 'Add to RFQ list',
                
                // RFQ list (B2B inquiry, not retail checkout)
                cart_title: 'RFQ list',
                cart_total: 'Items:',
                cart_clear: 'Clear list',
                cart_checkout: 'Request quote',
                cart_empty: 'Your RFQ list is empty',
                rfq_cart_title: 'RFQ list',
                rfq_cart_empty: 'Your RFQ list is empty',
                rfq_cart_clear: 'Clear list',
                rfq_cart_request_quote: 'Request quote',
                rfq_cart_item_count_label: 'Items',
                rfq_cart_added_toast: 'Added to RFQ list: {name}',
                rfq_cart_added_variant_toast: 'Added to RFQ list',
                rfq_cart_added_short: 'Added to RFQ list',
                rfq_cart_view_product: 'View product',
                add_to_rfq: 'Add to RFQ',
                rfq_variant_col: 'Add',
                rfq_line_sku: 'SKU',
                rfq_line_model: 'Model',
                rfq_variant_size: 'Size',
                rfq_variant_weight: 'Weight',
                rfq_variant_graphic: 'Graphic',
                rfq_variant_carton: 'Carton',
                
                // Contact Bottom (Signazon-style)
                footer_company_line_cn: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd',
                footer_company_line_en: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_contact_brand_primary: 'WaiKwan — Custom canopy tents, beach flags & display systems',
                footer_contact_brand_secondary: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_findus: 'Find Us',
                footer_address: 'Niujiaochong, Luchuan County, Yulin, Guangxi, China, 537609',
                footer_contact: 'Contact',
                footer_companyinfo: 'Company Info',
                footer_about: 'About Us',
                footer_products: 'Products',
                footer_contactus: 'Contact Us',
                footer_ask_title: 'Ask anything about products or designs…',
                footer_ask_text: 'Tell us your product type, size, quantity and printing needs. We will reply within 24 hours.',
                footer_ask_btn: 'Get Quote',
                footer_ask_btn2: 'WhatsApp',
                footer_copyright: '© 2026 Guangxi WaiKwan Tent Manufacturing Co., Ltd. All Rights Reserved.',
                footer_terms: 'Terms',
                footer_privacy: 'Privacy Policy',
                footer_sitemap: 'Site Map',
                
                // Product Detail Page Tabs
                tab_desc: 'Description',
                tab_specs: 'Specifications',
                tab_apps: 'Applications',
                tab_download: 'Downloads',
                related_products: 'Related Products',
                product_not_found_title: 'Product not found',
                product_not_found_desc: 'The product you’re looking for doesn’t exist or the link is invalid.',
                back_to_products: 'Back to Products',
                models_and_specs: 'Models & Specifications',
                no_specs: 'No specifications available',
                default_applications: 'Suitable for various outdoor events and exhibition display scenarios.',
                download_contact_us: 'Please contact us for detailed product files.',
                no_related_products: 'No related products'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupLanguageSwitcher();
        this.loadSavedLanguage();
        this.translatePage();
        this.setupFormTranslations();
    }
    
    setupLanguageSwitcher() {
        const bind = (selector) => {
            document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedLang = e.currentTarget.dataset.lang;
                    if (selectedLang) this.switchLanguage(selectedLang);
            });
        });
        };
        
        bind('.lang-btn');
        bind('.lang-item'); // ✅ 新增：支持下拉菜单语言项
    }

    // Minimal helper for JS modules to fetch translated strings.
    // Keeps behavior consistent with translatePage(): current lang -> en fallback -> provided fallback.
    t(key, fallback = '') {
        if (!key) return fallback || '';
        const lang = this.currentLanguage || DEFAULT_LANG;
        return (this.translations[lang] && this.translations[lang][key])
            || (this.translations['en'] && this.translations['en'][key])
            || fallback
            || '';
    }
    
    switchLanguage(lang) {
        if (!ENABLED_LANGS.includes(lang)) return;
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.saveLanguage(lang);
            this.updateActiveLanguageButton(lang);
            this.translatePage();
            this.updateDocumentLanguage(lang);
            this.updateBodyLanguageClass(lang);
            this.animateLanguageChange();
            // Notify other modules (e.g., products) about language change
            try {
                document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
            } catch (err) {
                console.warn('languageChanged event dispatch failed', err);
            }
        }
    }
    
    updateActiveLanguageButton(lang) {
        document.querySelectorAll('.lang-btn, .lang-item').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('is-active');
            btn.setAttribute('aria-pressed', 'false');
        });
        document.querySelectorAll(`[data-lang="${lang}"]`).forEach(active => {
            active.classList.add('active');
            active.classList.add('is-active'); // ✅ 下拉菜单高亮
            active.setAttribute('aria-pressed', 'true');
        });
    }
    
    translatePage() {
        // 同时支持 data-translate 和 data-i18n
        const elements = document.querySelectorAll('[data-translate], [data-i18n]');
        
        elements.forEach(element => {
            const key = element.dataset.translate || element.dataset.i18n;
            if (!key) return;
            
            const text = (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key])
                || this.translations['en'][key] // 默认回退到英文
                || '';
            
            // Preserve icons (e.g., chevron) inside anchors
            const icon = element.querySelector && element.querySelector('i') ? element.querySelector('i').outerHTML : '';
            
            // Check if text contains HTML tags (like <br>)
            const hasHTML = /<[^>]+>/.test(text);
            
            if (icon) {
                element.innerHTML = `${text} ${icon}`;
            } else if (hasHTML) {
                // Use innerHTML if translation contains HTML tags
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        });
        
        // 处理placeholder属性
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder], [data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.dataset.translatePlaceholder || element.dataset.i18nPlaceholder;
            if (!key) return;
            
            const text = (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key])
                || this.translations['en'][key] // 默认回退到英文
                || '';
            element.placeholder = text;
        });

        // 处理 title 属性
        const titleElements = document.querySelectorAll('[data-translate-title], [data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.dataset.translateTitle || element.dataset.i18nTitle;
            if (!key) return;

            const text = (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key])
                || this.translations['en'][key]
                || '';
            element.title = text;
        });

        // 处理 alt 属性
        const altElements = document.querySelectorAll('[data-translate-alt], [data-i18n-alt]');
        altElements.forEach(element => {
            const key = element.dataset.translateAlt || element.dataset.i18nAlt;
            if (!key) return;

            const text = (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key])
                || this.translations['en'][key]
                || '';
            element.alt = text;
        });

        // 处理 aria-label 属性
        const ariaLabelElements = document.querySelectorAll('[data-translate-aria-label], [data-i18n-aria-label]');
        ariaLabelElements.forEach(element => {
            const key = element.dataset.translateAriaLabel || element.dataset.i18nAriaLabel;
            if (!key) return;

            const text = (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key])
                || this.translations['en'][key]
                || '';
            element.setAttribute('aria-label', text);
        });
        
        // ✅ 公司名：全局写入中英文（双语对照）
        document.querySelectorAll('[data-company-cn]').forEach(el => {
            el.textContent = COMPANY_NAME.zh;
        });
        document.querySelectorAll('[data-company-en]').forEach(el => {
            el.textContent = COMPANY_NAME.en;
        });

        // ✅ 根据 ENABLED_LANGS 自动隐藏/显示语言选项
        // 兼容：部分页面使用 data-lang（但未加 data-lang-option）
        document.querySelectorAll('[data-lang-option], [data-lang]').forEach(el => {
            const code = (el.getAttribute('data-lang-option') || el.getAttribute('data-lang') || '').toLowerCase();
            if (!code) return;
            el.style.display = ENABLED_LANGS.includes(code) ? '' : 'none';
        });
    }
    
    setupFormTranslations() {
        // 为表单添加语言特定的验证消息
        const form = document.querySelector('.contact-form form');
        if (form) {
            // Submit interception removed: allow existing contact.js submission logic
            // to run (do not call e.preventDefault() here).
            // Previously this blocked real form submission and the contact.js handler.
            // If you need a language-specific submission UX, integrate with contact.js instead.
        }
    }
    
    handleFormSubmit() {
        // 显示成功消息（根据当前语言）
        const key = 'form_submit_success';
        const msg = (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key])
            || this.translations['en'][key]
            || '';
        if (msg) alert(msg);
        
        // 重置表单
        const form = document.querySelector('.contact-form form');
        form.reset();
    }
    
    updateDocumentLanguage(lang) {
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

        // 更新字体方向（如果需要）
        const rtlLanguages = ['ar', 'he', 'fa'];
        document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    }
    
    updateBodyLanguageClass(lang) {
        // 移除所有语言类
        document.body.classList.remove('lang-zh', 'lang-en');
        // 添加当前语言类
        document.body.classList.add(`lang-${lang}`);
    }
    
    animateLanguageChange() {
        const content = document.querySelector('main');
        content.classList.add('lang-transition');
        
        setTimeout(() => {
            content.classList.remove('lang-transition');
        }, 300);
    }
    
    saveLanguage(lang) {
        // UX memory only — must not override URL-based language on the next load (getLang() ignores this for resolution)
        localStorage.setItem('site_language', lang);
        localStorage.setItem('siteLanguage', lang);
        localStorage.setItem('preferredLanguage', lang);
    }
    
    loadSavedLanguage() {
        // 使用统一的 getLang() 函数
        const savedLang = getLang();
        if (savedLang && this.translations[savedLang]) {
            this.switchLanguage(savedLang);
        } else {
            this.switchLanguage(DEFAULT_LANG); // ✅ 强制默认英文
        }
        // 确保 body 也有初始语言类
        this.updateBodyLanguageClass(this.currentLanguage);
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    addTranslation(lang, key, value) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        this.translations[lang][key] = value;
    }
}

// 初始化多语言系统
document.addEventListener('DOMContentLoaded', () => {
    window.multiLang = new MultiLanguageSystem();

    // Lightweight i18n helper for other scripts (avoid hard-coded UI strings)
    window.wkI18n = {
        t: (key) => {
            try {
                const ml = window.multiLang;
                const lang = (ml && typeof ml.getCurrentLanguage === 'function') ? ml.getCurrentLanguage() : getLang();
                const dict = (ml && ml.translations) ? ml.translations : {};
                return (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || '';
            } catch {
                return '';
            }
        },
        lang: () => (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function')
            ? window.multiLang.getCurrentLanguage()
            : getLang(),
        setLang,
    };

    // Sync storage to current URL language (does not drive getLang(); avoids stale zh on EN URLs)
    try {
        const urlLang = getLang();
        localStorage.setItem(LANG_KEY, urlLang);
        localStorage.setItem('siteLanguage', urlLang);
    } catch (e) {}

    const gate = document.getElementById('languageGate');
    if (gate) gate.remove();
});

// ===== Top nav language dropdown =====
document.addEventListener('DOMContentLoaded', () => {
    const dd = document.getElementById('langDropdown');
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langMenu');
    if (!dd || !btn || !menu) return;

    // 使用统一的 getLang() 函数
    const savedLang = getLang();

    // 高亮当前语言
    menu.querySelectorAll('.lang-item').forEach(item => {
        const isActive = item.dataset.lang === savedLang;
        item.classList.toggle('is-active', isActive);
        item.classList.toggle('active', isActive);
    });

    const open = () => dd.classList.add('open');
    const close = () => dd.classList.remove('open');

    // 点击按钮：开/关
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dd.classList.toggle('open');
    });

    // 点击菜单内部：不关闭（除非选语言）
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 点外面关闭
    document.addEventListener('click', close);

    // 选择语言
    menu.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.dataset.lang;
            
            // 使用统一的 setLang() 函数（会自动检查 ENABLED_LANGS）
            setLang(lang);
            
            // 更新高亮
            menu.querySelectorAll('.lang-item').forEach(i => {
                const isActive = i.dataset.lang === lang;
                i.classList.toggle('is-active', isActive);
                i.classList.toggle('active', isActive);
            });
            
            close();
        });
    });

    // ESC 关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
});
