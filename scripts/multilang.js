// 多语言支持系统

// ✅ 统一语言配置
const LANG_KEY = 'site_language';
const DEFAULT_LANG = 'en';

// ✅ 只开放中英（先隐藏日/韩）
const ENABLED_LANGS = ['en', 'zh']; // 将来要开：['en','zh','ja','ko']

// ✅ 公司名（统一来源，避免在多个 HTML 写死）
const COMPANY_NAME = {
    en: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd',
    zh: '广西伟群帐篷制造有限公司',
    // ja: '（暂时隐藏）',
    // ko: '（暂时隐藏）'
};

// ✅ 获取语言：优先从 localStorage 读取，如果保存的是禁用语言则回退到英文
function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    // 如果保存的是 ja/ko，但你现在禁用了，就回退到英文
    if (saved && ENABLED_LANGS.includes(saved)) return saved;
    return DEFAULT_LANG;
}

// ✅ 设置语言：禁用语言直接忽略
function setLang(lang) {
    // 禁用语言直接忽略
    if (!ENABLED_LANGS.includes(lang)) return;
    localStorage.setItem(LANG_KEY, lang);
    // 应用语言（使用 multiLang 实例）
    if (window.multiLang && typeof window.multiLang.switchLanguage === 'function') {
        window.multiLang.switchLanguage(lang);
    }
}

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
                
                // 公司信息
                company_name: '广西伟群帐篷制造有限公司',
                tagline: '帐篷、沙滩旗与展示系统源头制造工厂',
                
                // 首页
                hero_badge: '专业制造',
                hero_title: 'Canopy Tents • Flags • Display Systems',
                hero_subtitle: '专注帐篷、沙滩旗与快幕秀等展示系统的研发与制造，为全球客户提供高品质可定制的展示解决方案',
                btn_explore: '探索产品',
                btn_contact: '联系我们',

                // Homepage (2026 redesign)
                home_hero_primary_cta: '获取报价',
                home_hero_secondary_cta: '查看产品',

                home_hero_1_kicker: '活动帐篷 · OEM/ODM',
                home_hero_1_title: '定制广告帐篷，快速交付',
                home_hero_1_subtitle: '适用于展会、赛事与推广活动的折叠帐篷。支持 LOGO 全印、尺寸与配件定制。',

                home_hero_2_kicker: '沙滩旗 · 户外引流',
                home_hero_2_title: '高辨识度广告旗帜系统',
                home_hero_2_subtitle: '羽毛旗/刀旗/矩形旗，搭配多种底座与旗杆材料，适配不同场地。',

                home_hero_3_kicker: '展示系统 · 快速搭建',
                home_hero_3_title: '便携式快幕秀展示背景墙',
                home_hero_3_subtitle: '轻便结构，画面可更换，适用于展会背景、舞台与品牌形象展示。',

                home_popular_categories_title: '热门分类',
                home_popular_categories_subtitle: '快速进入常用产品分类，支持按类筛选与搜索。',
                home_cat_cta: '浏览该分类',
                home_cat_tents_title: '帐篷',
                home_cat_tents_desc: '折叠帐篷与活动帐篷，支持品牌定制与配件选配。',
                home_cat_flags_title: '沙滩旗',
                home_cat_flags_desc: '羽毛旗/刀旗/矩形旗 + 多种底座与旗杆系统。',
                home_cat_racegate_title: '竞速拱门',
                home_cat_racegate_desc: '赛事与活动用拱门结构，便携耐用，支持不同规格。',
                home_cat_accessories_title: '配件',
                home_cat_accessories_desc: '侧墙、配重、收纳袋、连接件等一站式配套。',

                home_trusted_by_title: 'Trusted by',
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

                home_factory_title: '为什么选择伟群',
                home_factory_subtitle: '从打样到大货，我们提供稳定交付与可复制的品质控制。',
                home_factory_f1_title: 'OEM / ODM',
                home_factory_f1_desc: '支持结构、尺寸与品牌系统定制，适配不同市场需求。',
                home_factory_f2_title: '自有印刷',
                home_factory_f2_desc: '多工艺印刷与色彩控制，确保画面一致性与清晰度。',
                home_factory_f3_title: '快速交期',
                home_factory_f3_desc: '标准化流程与产能配置，适配紧急项目与批量订单。',
                home_factory_f4_title: '质检与出口',
                home_factory_f4_desc: '关键节点检测与装箱规范，支持全球发货与报关。',

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
                home_cta_primary: '获取报价',
                home_cta_secondary: '前往产品中心',

                home_sticky_quote: '获取报价',
                
                // 公司介绍
                about_title: '关于伟群',
                about_subtitle: '帐篷、沙滩旗与展示系统的专业源头制造工厂',
                about_intro: '广西伟群帐篷制造有限公司是一家专注于帐篷、沙滩旗、快幕秀（Pop-up Display）及户外品牌展示系统研发与制造的源头工厂。公司深耕便携式户外展示行业25年以上，为全球客户提供稳定、高效、可定制的展示解决方案。',
                about_intro_rest: '公司深耕便携式户外展示行业<strong>25年以上</strong>，为全球客户提供稳定、高效、可定制的展示解决方案。',
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
                about_product_1: '帐篷系列（Pop-up Tent / Marquee / Event Tent）',
                about_product_2: '沙滩旗及旗杆系列（Feather Flag / Teardrop Flag）',
                about_product_3: '快幕秀展示系统（Pop-up Display）',
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
                sizes_tent_title: '快装帐篷（Pop-up Canopy Tent）',
                sizes_giant_title: '大型活动帐篷（Large Event / Giant Tent）',
                sizes_display_title: '快幕秀展示系统（Pop-up Display / Quick Display）',
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
                sizes_note: '以上尺寸为常规参考，欢迎联系我们获取定制方案\nStandard sizes are for reference only. Contact us for custom solutions.',
                sizes_cta: '获取报价',
                // 保留旧键名以兼容
                popular_sizes_title: '产品常规尺寸参考',
                popular_sizes_subtitle: '以下为常用标准尺寸，支持定制与模块化组合',
                size_category_tent_title: '快装帐篷（Pop-up Canopy Tent）',
                size_category_large_title: '大型活动帐篷（Large Event Tent / Giant Tent）',
                size_category_display_title: '快幕秀展示系统（Pop-up Display / Quick Display）',
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
                size_cta_text_en: 'Standard sizes are for reference only. Contact us for custom solutions.',
                
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
                products_subtitle: '帐篷 · 沙滩旗 · 快幕秀 · 户外品牌展示系统',
                products_subtitle_en: 'Tents · Flags · Pop-up Displays · Outdoor Branding Systems',
                // 标准 i18n key（统一命名）
                products_tents_title: '帐篷系列',
                products_tents_desc: '提供多种规格与结构的帐篷产品，适用于促销活动、展会展示及大型户外活动，支持定制尺寸与品牌印刷。',
                products_flags_title: '沙滩旗及旗杆',
                products_flags_desc: '多种造型与尺寸的沙滩旗及旗杆系统，适合户外宣传、赛事活动及商业展示，支持多种印刷工艺。',
                products_display_title: '快幕秀展示系统',
                products_display_desc: '便携式快装展示系统，适用于展会背景墙、品牌形象展示及室内外活动，结构轻便，画面可更换。',
                products_accessories_title: '布艺展示及配件',
                products_accessories_desc: '包括桌布、布艺横幅及展示配件，满足整体品牌展示系统的配套需求。',
                products_custom_title: '定制展示解决方案',
                products_custom_desc: '支持从结构、尺寸到画面印刷的全流程定制，满足不同市场与项目需求。',
                products_cta: '获取报价',
                // 兼容旧key
                products_category_tents_title: '帐篷系列',
                products_category_tents_desc: '提供多种规格与结构的帐篷产品，适用于促销活动、展会展示及大型户外活动，支持定制尺寸与品牌印刷。',
                products_category_tents_desc_en: 'A full range of tent solutions designed for promotions, exhibitions and outdoor events. Custom sizes and branding options available.',
                products_category_flags_title: '沙滩旗及旗杆',
                products_category_flags_desc: '多种造型与尺寸的沙滩旗及旗杆系统，适合户外宣传、赛事活动及商业展示，支持多种印刷工艺。',
                products_category_flags_desc_en: 'A variety of beach flag shapes and pole systems for outdoor promotion, events and branding, with multiple printing options.',
                products_category_displays_title: '快幕秀展示系统',
                products_category_displays_desc: '便携式快装展示系统，适用于展会背景墙、品牌形象展示及室内外活动，结构轻便，画面可更换。',
                products_category_displays_desc_en: 'Portable pop-up display systems designed for exhibitions, backdrops and brand presentations. Lightweight structure with replaceable graphics.',
                products_category_accessories_title: '布艺展示及配件',
                products_category_accessories_desc: '包括桌布、布艺横幅及展示配件，满足整体品牌展示系统的配套需求。',
                products_category_accessories_desc_en: 'Table covers, fabric banners and display accessories designed to complete outdoor branding systems.',
                products_category_custom_title: '定制展示解决方案',
                products_category_custom_desc: '支持从结构、尺寸到画面印刷的全流程定制，满足不同市场与项目需求。',
                products_category_custom_desc_en: 'Full customization available from structure and size to graphic printing, tailored to different markets and project requirements.',
                products_cta_text: '所有产品均支持定制，欢迎联系我们获取详细规格与报价。',
                products_cta_text_en: 'All products are customizable. Contact us for detailed specifications and quotations.',
                products_cta_button: 'Get a Quote',
                category_all: '全部产品',
                category_furniture: '户外家具',
                category_tents: '帐篷展示',
                category_flags: '旗帜广告',
                category_custom: '定制产品',
                category_popup: '快幕秀',                category_lightbox: '灯箱系统',
                category_inflatable: '充气系列',
                category_accessories: '底座/配件',                category_frames: '帐篷框架',
                
                // 顶部栏
                top_bar_text: '25+ 年制造经验 · 值得信赖的全球合作伙伴',
                
                // 导航
                nav_products_by_size: '按尺寸',
                nav_info: '信息',
                nav_product_center: '产品中心',
                nav_all_products: '全部产品',
                product_center_title: '产品中心',
                product_center_subtitle: '选择分类进入，或去"全部产品"搜索。',
                back_to_product_center: '返回产品中心',
                category_not_available: '该分类暂未开放，已为你显示全部分类。',
                // Products 下拉菜单
                menu_tents: '帐篷',
                menu_custom_tents: '定制帐篷',
                menu_stock_tents: '现货帐篷',
                menu_beach_flags: '沙滩旗及旗杆',
                menu_popup_displays: '快幕秀展示系统',
                menu_accessories: '配件',
                menu_racegate: '竞速拱门',
                menu_replacement_parts: '替换零件',
                category_view_all: '查看该类全部',
                category_search_products: '去搜索产品',
                view_details: '查看详情',
                tents_hub_folding_title: '折叠帐篷',
                tents_hub_event_title: '活动帐篷',
                flags_hub_poles_title: '沙滩旗与旗杆',
                flags_hub_accessories_title: '底座与配件',
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

                // Buttons
                btn_back: '返回',

                // ARIA labels
                aria_search: '搜索',
                aria_account: '账户',
                aria_cart: '购物车',
                aria_language: '语言',
                aria_select_language: '选择语言',
                aria_breadcrumb: '面包屑导航',

                // Language names
                lang_name_en: 'English',
                lang_name_zh: '中文',
                lang_name_ja: '日本語',
                lang_name_ko: '한국어',

                // Common buttons
                download_materials: '下载资料',

                // Common labels
                label_model: '型号',

                // View-type pages
                flag_type_not_found: '未找到该旗帜类型。',

                // Nav extras
                nav_top3_sizes: '热销尺寸 Top3',

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
                form_submit_success: '消息发送成功！我们会尽快回复您。',

                // Products dropdown extras
                menu_table_chair_stool_toilet: '桌 / 椅 / 凳 / 厕所',
                menu_dome_3_folders: 'DOME 3 折叠系列',

                // View-type pages
                view_type_models: '型号清单',
                view_type_brochure_ref: '产品画册参考',
                view_type_brochure_source_17: '来源：目录图片 17.png',
                view_type_page_title_furniture: '桌 / 椅 / 凳 / 厕所',
                view_type_page_title_dome: 'DOME 3 折叠系列',
                view_type_subtitle: '型号清单与画册参考（可点击图片放大）。',
                view_type_browse_all_tents: '查看全部帐篷',
                view_type_browse_all_furniture: '查看全部家具',
                view_type_browse_all_furniture_products: '查看全部家具产品',
                
                // 面包屑和搜索
                breadcrumb_home: '首页',
                breadcrumb_products: '产品中心',
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
                contact_seo_text: 'Contact Guangxi WaiKwan Tent Manufacturing Co., Ltd today to discuss your custom tent and display project requirements.',
                contact_address_label: '公司地址',
                contact_address_title: '地址 Address',
                contact_address_value: 'Address: Daping Changtangao, Luyin Village, Gucheng Town, Luchuan County, Yulin City, China',
                contact_address: '2nd Xuweiqian Building, Bridge South xilian Dong Cun Gaosha Development District, Nanhai Danzao, Foshan, China', // 兼容旧key
                contact_phone_label: '联系电话',
                contact_phone_title: '联系电话', // 兼容旧key
                contact_email_label: '电子邮箱',
                contact_email_title: '电子邮箱', // 兼容旧key
                contact_qr_title: '扫码联系',
                whatsapp_label: 'WhatsApp',
                contact_whatsapp_title: 'WhatsApp（WhatsApp）',
                contact_whatsapp_note: '扫码添加 WhatsApp 咨询 / Scan to chat on WhatsApp',
                wechat_label: 'WeChat',
                contact_wechat_title: '微信 WeChat',
                contact_wechat_note: '扫码添加微信咨询 / Scan to add on WeChat',
                
                // 表单
                contact_form_name: '您的姓名',
                contact_form_email: '您的邮箱',
                contact_form_phone: '联系电话',
                contact_form_message: '您的需求',
                contact_form_submit: '发送消息',
                form_name: '您的姓名', // 兼容旧key
                form_email: '您的邮箱', // 兼容旧key
                form_phone: '联系电话', // 兼容旧key
                form_message: '您的需求', // 兼容旧key
                form_submit: '发送消息', // 兼容旧key
                
                // Inquiry Form (B2B High-Conversion)
                inquiry_form_title: '获取报价',
                inquiry_form_subtitle: '告诉我们您的项目需求，我们的团队将在24小时内回复您。',
                inquiry_form_name: '您的姓名 *',
                inquiry_form_email: '您的邮箱 *',
                inquiry_form_company: '公司名称',
                inquiry_form_country: '国家/地区 *',
                inquiry_form_product_placeholder: '产品类别 *',
                inquiry_form_product_tent: '帐篷',
                inquiry_form_product_flag: '沙滩旗',
                inquiry_form_product_display: '快幕秀展示',
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
                inquiry_form_submit: '提交询盘',
                inquiry_form_sending: '提交中...',
                inquiry_form_note: '我们尊重您的隐私。您的信息仅用于回复您的询盘。',
                inquiry_form_success: '消息已发送。我们将在24小时内回复。',
                inquiry_form_failed: '发送失败。请稍后重试。',

                // UI
                ui_copy: '复制',
                ui_copied: '已复制！',
                ui_items_unit: '个',
                ui_tip_cart_items: '提示：这些条目来自您的购物车，您可以在此修改数量。',
                ui_tip_cart_empty: '提示：您的购物车为空。已展示筛选后的热门产品。为获取更精准报价，请先将产品加入购物车。',
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
                logo_since: 'Since 2010',
                
                // 页脚
                footer_desc: '专业的户外家具制造服务提供商，致力于为客户提供最优质的产品和服务。',
                footer_links_title: '快速链接',
                footer_contact_title: '联系方式',
                footer_rights: '保留所有权利。',
                
                // PDF下载
                pdf_download_title: '下载产品资料',
                pdf_download_desc: '点击下方按钮下载完整的产品目录和公司介绍。',
                btn_download_pdf: '下载PDF',
                btn_get_quote: '获取报价',
                btn_download: '下载',
                btn_add_to_cart: '加入购物车',
                
                // 购物车
                cart_title: '购物车',
                cart_total: '总计:',
                cart_clear: '清空购物车',
                cart_checkout: '联系询价',
                cart_empty: '购物车是空的',
                
                // Contact Bottom (Signazon-style)
                footer_company_line_cn: '广西伟群帐篷制造有限公司',
                footer_company_line_en: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_findus: '地址 Find Us',
                footer_address: 'Address: Daping Changtangao, Luyin Village,<br>Gucheng Town, Luchuan County,<br>Yulin City, China',
                footer_contact: '联系 Contact',
                footer_companyinfo: '公司信息 Company Info',
                footer_about: '关于我们 About Us',
                footer_products: '产品中心 Products',
                footer_contactus: '联系我们 Contact Us',
                footer_ask_title: '产品/设计咨询 Ask anything…',
                footer_ask_text: '请告诉我们产品类型、尺寸、数量与印刷需求，我们将在 24 小时内回复 / We reply within 24 hours.',
                footer_ask_btn: '获取报价 Get a Quote',
                footer_ask_btn2: 'WhatsApp 咨询 WhatsApp Now',
                footer_copyright: '© 2026 广西伟群帐篷制造有限公司 / Guangxi WaiKwan Tent Manufacturing Co., Ltd. 保留所有权利 All Rights Reserved.',
                footer_terms: '条款 Terms',
                footer_privacy: '隐私 Privacy',
                footer_sitemap: '站点地图 Site Map',
                
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
                home_hero_primary_cta: 'Get a Quote',
                home_hero_secondary_cta: 'View Products',

                home_hero_1_kicker: 'Event Tents · OEM/ODM',
                home_hero_1_title: 'Custom Canopy Tents, Built for B2B',
                home_hero_1_subtitle: 'Fast setup folding tents for exhibitions, promotions and outdoor events. Full branding, sizes and accessories available.',

                home_hero_2_kicker: 'Beach Flags · High Visibility',
                home_hero_2_title: 'Advertising Flag Systems That Convert',
                home_hero_2_subtitle: 'Feather / teardrop / rectangle flags with multiple bases and pole materials for different venues.',

                home_hero_3_kicker: 'Display Systems · Fast Setup',
                home_hero_3_title: 'Portable Pop-up Display Backdrops',
                home_hero_3_subtitle: 'Lightweight structure with replaceable graphics — ideal for trade shows, stages and brand presentation.',

                home_popular_categories_title: 'Popular Categories',
                home_popular_categories_subtitle: 'Jump into key categories and filter products instantly.',
                home_cat_cta: 'Browse Category',
                home_cat_tents_title: 'Tents',
                home_cat_tents_desc: 'Folding event tents with branding and accessory options.',
                home_cat_flags_title: 'Flags',
                home_cat_flags_desc: 'Feather/teardrop/rectangle flags with pole & base systems.',
                home_cat_racegate_title: 'Race Gate',
                home_cat_racegate_desc: 'Portable event gates for races and promotions in multiple sizes.',
                home_cat_accessories_title: 'Accessories',
                home_cat_accessories_desc: 'Sidewalls, weights, bags, connectors and add-ons.',

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

                home_factory_title: 'Why WaiKwan',
                home_factory_subtitle: 'From sampling to mass production, we deliver consistent quality and dependable lead times.',
                home_factory_f1_title: 'OEM / ODM',
                home_factory_f1_desc: 'Customize structure, size and branding to match your market requirements.',
                home_factory_f2_title: 'In-house Printing',
                home_factory_f2_desc: 'Multiple printing processes with color control for consistent, sharp graphics.',
                home_factory_f3_title: 'Fast Lead Time',
                home_factory_f3_desc: 'Standardized workflow and capacity planning for urgent and bulk orders.',
                home_factory_f4_title: 'QC & Export',
                home_factory_f4_desc: 'Inspection checkpoints and packing standards for reliable global shipping.',

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
                home_cta_primary: 'Get a Quote',
                home_cta_secondary: 'Go to Product Center',

                home_sticky_quote: 'Get a Quote',
                
                // About
                about_title: 'About Guangxi WaiKwan Tent Manufacturing Co., Ltd',
                about_subtitle: 'Professional Source Manufacturer of Tents, Flags & Portable Display Systems',
                about_intro: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd is a professional source manufacturer specializing in tents, beach flags, pop-up displays and portable outdoor branding systems. With over 25 years of manufacturing experience, we focus on delivering reliable, easy-to-install and fully customizable display solutions for global brands, distributors and project clients. From product design and material selection to printing and final assembly, all processes are completed in-house to ensure consistent quality, stable lead time and competitive pricing.',
                about_mission_title: 'Our Mission',
                about_mission: 'Our Mission', // 兼容旧key
                about_mission_text: 'Our mission is to support brand visibility and marketing success by providing high-quality, customizable and easy-to-use tent and display solutions for events, exhibitions and outdoor promotions worldwide.',
                about_vision_title: 'Our Vision',
                about_vision: 'Our Vision', // 兼容旧key
                about_vision_text: 'Our vision is to become a long-term, trusted manufacturing partner in the global tent and display system industry, delivering stable quality, flexible customization and sustainable value for our clients.',
                about_stat_years: 'Years Manufacturing Experience',
                about_stat_clients: 'Global Clients',
                about_stat_products: 'Product Models & Solutions',
                about_products_title: 'Product Range & Capabilities',
                about_products_main: 'Main Product Categories:',
                about_product_1: 'Tents (Pop-up Tent, Marquee, Large Event Tent)',
                about_product_2: 'Beach Flags & Flag Poles',
                about_product_3: 'Pop-up Display Systems',
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
                sizes_display_title: 'Pop-up Display / Quick Display System',
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
                sizes_cta: 'Get a Quote',
                // 保留旧键名以兼容
                popular_sizes_title: 'Standard Size Options',
                popular_sizes_subtitle: 'Standard sizes shown below. Custom sizes & modular combinations available.',
                size_category_tent_title: 'Pop-up Canopy Tent',
                size_category_large_title: 'Large Event Tent / Giant Tent',
                size_category_display_title: 'Pop-up Display / Quick Display System',
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
                testimonial_1_text: '"Excellent product quality, professional service, timely delivery. We are very satisfied with our cooperation with Weiqun."',
                testimonial_1_name: 'David T.',
                testimonial_1_role: 'Event Planning Company',
                testimonial_2_text: '"Very professional customization service, able to meet our special needs. Product quality exceeded expectations."',
                testimonial_2_name: 'Antonio C.',
                testimonial_2_role: 'Restaurant Owner',
                testimonial_3_text: '"Very professional team, quick response. Beautiful product design, perfectly matches our brand image."',
                testimonial_3_name: 'Owen B.',
                testimonial_3_role: 'Entertainment Industry',
                
                // Products
                products_title: 'Products',
                products_subtitle: 'Tents · Flags · Pop-up Displays · Outdoor Branding Systems',
                products_subtitle_en: '',
                // 标准 i18n key（统一命名）
                products_tents_title: 'Tents',
                products_tents_desc: 'We offer a complete range of tent solutions including pop-up tents, marquees and large event tents. Designed for exhibitions, promotions and outdoor events, our tents are available in standard sizes or fully customized to meet specific project requirements.',
                products_flags_title: 'Beach Flags & Poles',
                products_flags_desc: 'Our beach flag and pole systems are ideal for outdoor branding, sports events and commercial promotions. Multiple shapes, sizes and base options are available, with high-quality printing to ensure strong visual impact.',
                products_display_title: 'Pop-up Display Systems',
                products_display_desc: 'Our pop-up display systems provide portable and professional solutions for exhibitions, backdrops and brand presentations. Lightweight structures, fast setup and replaceable graphics make them ideal for repeated use.',
                products_accessories_title: 'Fabric Displays & Accessories',
                products_accessories_desc: 'We supply a full range of fabric displays and accessories including table covers, banners and supporting components, designed to complete integrated outdoor branding systems.',
                products_custom_title: 'Custom Solutions',
                products_custom_desc: 'We provide OEM and ODM services, offering full customization from structure design and sizing to graphic printing. Our team works closely with clients to deliver tailored solutions for different markets and applications.',
                products_cta: 'Get a Quote',
                // 兼容旧key
                products_category_tents_title: 'Tents',
                products_category_tents_desc: 'A full range of tent solutions designed for promotions, exhibitions and outdoor events. Custom sizes and branding options available.',
                products_category_tents_desc_en: '',
                products_category_flags_title: 'Beach Flags & Poles',
                products_category_flags_desc: 'A variety of beach flag shapes and pole systems for outdoor promotion, events and branding, with multiple printing options.',
                products_category_flags_desc_en: '',
                products_category_displays_title: 'Pop-up Display Systems',
                products_category_displays_desc: 'Portable pop-up display systems designed for exhibitions, backdrops and brand presentations. Lightweight structure with replaceable graphics.',
                products_category_displays_desc_en: '',
                products_category_accessories_title: 'Fabric Displays & Accessories',
                products_category_accessories_desc: 'Table covers, fabric banners and display accessories designed to complete outdoor branding systems.',
                products_category_accessories_desc_en: '',
                products_category_custom_title: 'Custom Solutions',
                products_category_custom_desc: 'Full customization available from structure and size to graphic printing, tailored to different markets and project requirements.',
                products_category_custom_desc_en: '',
                products_cta_text: 'Contact us today to get detailed specifications and a customized quotation.',
                products_cta_text_en: '',
                products_cta_button: 'Get a Quote',
                category_all: 'All Products',
                category_furniture: 'Outdoor Furniture',
                category_tents: 'Tent Display',
                category_flags: 'Flag Advertising',
                category_custom: 'Custom Products',
                category_popup: 'Pop-up Display',
                category_displays: 'Displays',
                category_lightbox: 'Lightbox Systems',
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
                product_center_title: 'Product Center',
                product_center_subtitle: 'Browse categories or search in "All Products".',
                back_to_product_center: 'Back to Product Center',
                category_not_available: 'Category not available yet. Showing all categories.',
                // Products Dropdown Menu
                menu_tents: 'Tents',
                menu_custom_tents: 'Custom Tents',
                menu_stock_tents: 'Stock Tents',
                menu_beach_flags: 'Beach Flags & Poles',
                menu_popup_displays: 'Pop-up Displays',
                menu_accessories: 'Accessories',
                menu_racegate: 'Race Gate',
                menu_replacement_parts: 'Replacement Parts',
                category_view_all: 'View All',
                category_search_products: 'Search Products',
                view_details: 'View details',
                tents_hub_folding_title: 'Folding Tents',
                tents_hub_event_title: 'Event Tents',
                flags_hub_poles_title: 'Beach Flags & Poles',
                flags_hub_special_title: 'Backpack & Street/Display Flags',
                flags_hub_accessories_title: 'Bases & Accessories',
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

                // Buttons
                btn_back: 'Back',

                // ARIA labels
                aria_search: 'Search',
                aria_account: 'Account',
                aria_cart: 'Cart',
                aria_language: 'Language',
                aria_select_language: 'Select language',
                aria_breadcrumb: 'Breadcrumb',

                // Language names
                lang_name_en: 'English',
                lang_name_zh: 'Chinese',
                lang_name_ja: 'Japanese',
                lang_name_ko: 'Korean',

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
                form_submit_success: 'Message sent successfully! We will reply to you as soon as possible.',

                // Products dropdown extras
                menu_table_chair_stool_toilet: 'Table / Chair / Stool / Toilet',
                menu_dome_3_folders: 'DOME 3 FOLDERS',

                // View-type pages
                view_type_models: 'Models',
                view_type_brochure_ref: 'Brochure PDF Guide',
                view_type_brochure_source_17: 'Source: catalog page 17.png',
                view_type_page_title_furniture: 'Table / Chair / Stool / Toilet',
                view_type_page_title_dome: 'DOME 3 FOLDERS',
                view_type_subtitle: 'Model list and catalog reference (click the image to zoom).',
                view_type_browse_all_tents: 'Browse all tents',
                view_type_browse_all_furniture: 'Browse all furniture',
                view_type_browse_all_furniture_products: 'Browse all furniture products',
                
                // Breadcrumb and Search
                breadcrumb_home: 'Home',
                breadcrumb_products: 'Products',
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
                category_flags_desc: 'Beach flags, banners and advertising display products',
                category_popup_desc: 'Quick-setup display systems',
                category_furniture_desc: 'Foldable tables and chairs for outdoor use',
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
                contact_subtitle: 'We look forward to working with you',
                contact_seo_text: 'Contact Guangxi WaiKwan Tent Manufacturing Co., Ltd today to discuss your custom tent and display project requirements.',
                contact_address_label: 'Address',
                contact_address_title: 'Address',
                contact_address_value: 'Daping Changtangao, Luyin Village, Gucheng Town, Luchuan County, Yulin City, China',
                contact_address: 'Daping Changtangao, Luyin Village, Gucheng Town, Luchuan County, Yulin City, Guangxi, China', // 兼容旧key
                contact_phone_label: 'Phone',
                contact_phone_title: 'Phone Number', // 兼容旧key
                contact_email_label: 'Email',
                contact_email_title: 'Email Address', // 兼容旧key
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
                form_name: 'Your Name', // 兼容旧key
                form_email: 'Your Email', // 兼容旧key
                form_phone: 'Phone Number', // 兼容旧key
                form_message: 'Your Message', // 兼容旧key
                form_submit: 'Send Message', // 兼容旧key
                
                // Inquiry Form (B2B High-Conversion)
                inquiry_form_title: 'Get a Quote',
                inquiry_form_subtitle: 'Tell us about your project and our team will get back to you within 24 hours.',
                inquiry_form_name: 'Your Name *',
                inquiry_form_email: 'Your Email *',
                inquiry_form_company: 'Company Name',
                inquiry_form_country: 'Country / Region *',
                inquiry_form_product_placeholder: 'Product Category *',
                inquiry_form_product_tent: 'Canopy Tent',
                inquiry_form_product_flag: 'Beach Flag',
                inquiry_form_product_display: 'Pop-up Display',
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
                inquiry_form_submit: 'Submit Inquiry',
                inquiry_form_sending: 'Sending...',
                inquiry_form_note: 'We respect your privacy. Your information will only be used to respond to your inquiry.',
                inquiry_form_success: 'Message sent. We will reply within 24 hours.',
                inquiry_form_failed: 'Failed to send. Please try again later.',

                // UI
                ui_copy: 'Copy',
                ui_copied: 'Copied!',
                ui_items_unit: 'items',
                ui_tip_cart_items: 'Tip: These items come from your cart. You can change quantity here.',
                ui_tip_cart_empty: 'Tip: Your cart is empty. Showing top filtered products. For precise RFQ, please add products to cart first.',
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
                
                // PDF Download
                pdf_download_title: 'Download Product Information',
                pdf_download_desc: 'Click the button below to download the complete product catalog and company introduction.',
                btn_download_pdf: 'Download PDF',
                btn_get_quote: 'Get Quote',
                btn_download: 'Download',
                btn_add_to_cart: 'Add to Cart',
                
                // Shopping Cart
                cart_title: 'Shopping Cart',
                cart_total: 'Total:',
                cart_clear: 'Clear Cart',
                cart_checkout: 'Request Quote',
                cart_empty: 'Your cart is empty',
                
                // Contact Bottom (Signazon-style)
                footer_company_line_cn: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd',
                footer_company_line_en: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_findus: 'Find Us',
                footer_address: 'Daping Changtangao, Luyin Village,<br>Gucheng Town, Luchuan County,<br>Yulin City, China',
                footer_contact: 'Contact',
                footer_companyinfo: 'Company Info',
                footer_about: 'About Us',
                footer_products: 'Products',
                footer_contactus: 'Contact Us',
                footer_ask_title: 'Ask anything about products or designs…',
                footer_ask_text: 'Tell us your product type, size, quantity and printing needs. We will reply within 24 hours.',
                footer_ask_btn: 'Get a Quote',
                footer_ask_btn2: 'WhatsApp Now',
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
            },
            ja: {
                // トップバー
                top_bar_text: '15年以上の信頼できる製造経験',
                
                // ナビゲーション
                nav_home: 'ホーム',
                nav_about: '会社概要',
                nav_products: '製品センター',
                nav_services: 'サービス',
                nav_contact: 'お問い合わせ',
                // Products ドロップダウンメニュー
                menu_custom_tents: 'カスタムテント',
                menu_stock_tents: '在庫テント',
                menu_beach_flags: 'ビーチフラッグ・ポール',
                menu_popup_displays: 'ポップアップ展示',
                menu_accessories: 'アクセサリー',
                menu_replacement_parts: '交換パーツ',
                
                // 会社情報
                company_name: '広西偉群',
                tagline: 'プロフェッショナル印刷サービス',
                
                // ホームページ
                hero_title: 'プロフェッショナル印刷ソリューション',
                hero_subtitle: 'ブランドに高品質で革新的な印刷サービスを提供',
                btn_explore: '製品を探す',
                btn_contact: 'お問い合わせ',
                
                // 会社概要
                about_title: '偉群について',
                about_subtitle: 'テント、ビーチフラッグ、ディスプレイシステムの専門製造工場',
                about_mission: '私たちの使命',
                about_mission_text: 'テント、ビーチフラッグ、ポータブルディスプレイシステムの研究開発と製造に専念し、世界中の顧客に高品質でカスタマイズ可能なディスプレイソリューションを提供し、ブランドが様々なイベントや商業シーンで際立つことを支援します。',
                about_vision: '私たちのビジョン',
                about_vision_text: 'テントとディスプレイシステム分野で信頼できるグローバル製造パートナーとなり、製造プロセスと製品品質を継続的に向上させ、顧客に長期的で安定した商業価値を創造します。',
                stat_years: '年の製造経験',
                stat_clients: 'グローバルクライアント',
                stat_products: '製品モデル',
                
                // 製品特徴
                feature_quality: '最高品質',
                feature_quality_desc: '高品質材料を使用し、厳格な品質管理により、製品の耐久性と信頼性を確保',
                feature_fast: '迅速な配送',
                feature_fast_desc: '効率的な生産プロセス、迅速な物流配送により、タイムリーな到着を確保',
                feature_custom: 'カスタマイズサービス',
                feature_custom_desc: 'プロフェッショナルなデザインチーム、OEM/ODM対応、お客様の個別ニーズに対応',
                feature_global: 'グローバル輸出',
                feature_global_desc: '複数の国に製品を輸出、豊富な国際市場経験',
                
                // サイズページ（英文占位 - 安全版）
                sizes_title: 'Standard Size Options',
                sizes_subtitle: 'Standard sizes shown below. Custom sizes & modular combinations available.',
                sizes_tent_title: 'Pop-up Canopy Tent',
                sizes_giant_title: 'Large Event / Giant Tent',
                sizes_display_title: 'Pop-up Display / Quick Display System',
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
                sizes_cta: 'Get a Quote',
                
                // 製品標準サイズ参考
                popular_sizes_title: '製品標準サイズ参考',
                popular_sizes_subtitle: '以下は一般的な標準サイズです。カスタムサイズとモジュール組み合わせ対応可能',
                size_category_tent_title: 'クイックセットアップテント（Pop-up Canopy Tent）',
                size_category_large_title: '大型イベントテント（Large Event Tent / Giant Tent）',
                size_category_display_title: 'クイックディスプレイシステム（Pop-up Display / Quick Display）',
                size_standard_sizes: '標準サイズ：',
                size_standard_combination: '標準組み合わせサイズ：',
                size_standard_options: '標準オプション：',
                size_features: '構造特徴：',
                size_product_features: '製品特徴：',
                size_applications: '適用シーン：',
                size_tent_feature_1: '折りたたみ式アルミニウムまたは鋼製フレーム',
                size_tent_feature_2: '工具不要、迅速な設置',
                size_tent_feature_3: 'キャノピーとサイドウォールのカスタム印刷対応',
                size_tent_applications: 'ブランドプロモーション、屋外イベント、展示ブース、一時展示',
                size_category_large_note: 'より大きなサイズはモジュール接続で対応可能',
                size_large_feature_1: 'モジュラー式組み立て構造',
                size_large_feature_2: '高強度アルミニウムフレーム',
                size_large_feature_3: 'プロジェクト要件に応じて高さとスパンをカスタマイズ可能',
                size_large_applications: '大型イベント、商業展示会、一時展示館、ブランド発表',
                size_display_option_1: '幅モジュール：3m / 4m / 5m',
                size_display_option_2: '構造形式：直線型 / 曲線型 / U字型',
                size_display_option_3: '片面または両面展示',
                size_display_feature_1: '軽量で折りたたみ可能な構造',
                size_display_feature_2: '迅速な設置、輸送が容易',
                size_display_feature_3: 'グラフィック交換可能、高解像度印刷対応',
                size_display_applications: '展示会、背景壁、ブランドイメージ展示',
                size_cta_text: '上記サイズは参考用です。カスタムソリューションについてはお問い合わせください。',
                size_cta_text_en: '',
                
                // お客様の声
                testimonials_title: 'お客様の声',
                testimonials_subtitle: '世界中のお客様からの実際のフィードバック',
                testimonial_1_text: '"製品品質は非常に優れており、サービスもプロフェッショナルで、配送も迅速でした。ウェイチュンとの協力に非常に満足しています。"',
                testimonial_1_name: 'David T.',
                testimonial_1_role: 'イベント企画会社',
                testimonial_2_text: '"カスタマイズサービスは非常にプロフェッショナルで、私たちの特別なニーズに対応できました。製品品質は期待を超えました。"',
                testimonial_2_name: 'Antonio C.',
                testimonial_2_role: 'レストランオーナー',
                testimonial_3_text: '"チームは非常にプロフェッショナルで、対応も迅速でした。製品デザインは美しく、私たちのブランドイメージに完全に一致しています。"',
                testimonial_3_name: 'Owen B.',
                testimonial_3_role: 'エンターテインメント業界',
                
                // パンくずリストと検索
                breadcrumb_home: 'ホーム',
                breadcrumb_products: '製品センター',
                products_search_placeholder: '製品を検索（名前/キーワード/仕様）',
                filters_title: 'フィルター',
                filters_clear: 'クリア',
                filters_category: 'カテゴリー',
                filters_quick_tags: '人気キーワード',
                sort_by: '並び替え',
                sort_popular: '人気順',
                sort_new: '新着',
                sort_name: '名前 A–Z',
                
                // 製品センター
                products_title: '製品センター',
                products_subtitle: '多様な印刷ソリューションで、様々なニーズに対応',
                category_displays: '展示システム',
                category_all: '全製品',
                category_displays: '展示システム',
                category_lightbox: 'ライトボックスシステム',
                category_inflatable: 'インフレータブル製品',
                category_accessories: 'アクセサリ',
                category_commercial: '商業印刷',
                category_packaging: '包装印刷',
                category_digital: 'デジタル印刷',
                category_large: '大型印刷',
                
                // サービス
                services_title: 'サービス範囲',
                services_subtitle: 'デザインから完成品まで、包括的な印刷サービス',
                service_design: 'デザインサービス',
                service_design_desc: 'プロフェッショナルなグラフィックデザインチームが、ユニークなビジュアルアイデンティティを作成',
                service_printing: '印刷サービス',
                service_printing_desc: '先進的な印刷設備で、すべての作品を完璧に表現',
                service_finishing: '仕上げサービス',
                service_finishing_desc: 'プロフェッショナルな製本、ラミネート、ホットスタンプなどの仕上げサービス',
                service_delivery: '配送サービス',
                service_delivery_desc: '迅速で安全な物流配送で、製品のタイムリーな配送を保証',
                
                // お問い合わせ
                contact_title: 'お問い合わせ',
                contact_subtitle: '皆様とのご協力をお待ちしております',
                contact_address_title: '会社住所',
                contact_address: '2nd Xuweiqian Building, Bridge South xilian Dong Cun Gaosha Development District, Nanhai Danzao, Foshan, China',
                contact_phone_title: '電話番号',
                contact_email_title: 'メールアドレス',
                
                // フォーム
                form_name: 'お名前',
                form_email: 'メールアドレス',
                form_phone: '電話番号',
                form_message: 'お問い合わせ内容',
                form_submit: 'メッセージを送信',
                
                // フッター
                footer_desc: 'プロフェッショナル印刷サービスプロバイダーとして、お客様に最高品質の製品とサービスを提供することをお約束します。',
                footer_links_title: 'クイックリンク',
                footer_contact_title: '連絡先情報',
                footer_rights: 'すべての権利を保有。',
                
                // PDFダウンロード
                pdf_download_title: '製品資料ダウンロード',
                pdf_download_desc: '下のボタンをクリックして、完全な製品カタログと会社紹介をダウンロードしてください。',
                btn_download_pdf: 'PDFダウンロード',
                btn_get_quote: '見積もりを取得',
                btn_download: 'ダウンロード',
                btn_add_to_cart: 'カートに追加',
                
                // 製品詳細ページタブ
                tab_desc: '製品説明',
                tab_specs: '技術仕様',
                tab_apps: '応用シーン',
                tab_download: '資料ダウンロード',
                related_products: '関連製品',
                
                // Contact Bottom (Signazon-style)
                footer_company_line_cn: '広西偉群テント製造有限公司',
                footer_company_line_en: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_findus: '所在地',
                footer_address: 'Daping Changtangao, Luyin Village,<br>Gucheng Town, Luchuan County,<br>Yulin City, China',
                footer_contact: '連絡先',
                footer_companyinfo: '会社情報',
                footer_about: '会社概要',
                footer_products: '製品',
                footer_contactus: 'お問い合わせ',
                footer_ask_title: '製品・デザインについて何でもお尋ねください…',
                footer_ask_text: '製品タイプ、サイズ、数量、印刷要件をお知らせください。24時間以内に返信いたします。',
                footer_ask_btn: '見積もりを取得',
                footer_ask_btn2: 'WhatsAppで今すぐ',
                footer_copyright: '© 2026 広西偉群テント製造有限公司。全著作権所有。',
                footer_terms: '利用規約',
                footer_privacy: 'プライバシーポリシー',
                footer_sitemap: 'サイトマップ'
            },
            ko: {
                // 상단 바
                top_bar_text: '15년 이상의 신뢰할 수 있는 제조 경험',
                
                // 내비게이션
                nav_home: '홈',
                nav_about: '회사소개',
                nav_products: '제품센터',
                nav_services: '서비스',
                nav_contact: '문의하기',
                // Products 드롭다운 메뉴
                menu_custom_tents: '맞춤 텐트',
                menu_stock_tents: '재고 텐트',
                menu_beach_flags: '비치 플래그 & 폴',
                menu_popup_displays: '팝업 디스플레이',
                menu_accessories: '액세서리',
                menu_replacement_parts: '교체 부품',
                
                // 회사 정보
                company_name: '광시웨이췬',
                tagline: '전문 인쇄 서비스',
                
                // 홈페이지
                hero_title: '전문 인쇄 솔루션',
                hero_subtitle: '브랜드를 위한 고품질, 혁신적인 인쇄 서비스 제공',
                btn_explore: '제품 둘러보기',
                btn_contact: '문의하기',
                
                // 회사소개
                about_title: '웨이췬에 대해',
                about_subtitle: '텐트, 비치 플래그 및 디스플레이 시스템 전문 제조 공장',
                about_mission: '우리의 사명',
                about_mission_text: '텐트, 비치 플래그 및 휴대용 디스플레이 시스템의 연구 개발 및 제조에 전념하여 전 세계 고객에게 고품질 및 맞춤형 디스플레이 솔루션을 제공하여 브랜드가 다양한 이벤트 및 상업적 시나리오에서 돋보이도록 돕습니다.',
                about_vision: '우리의 비전',
                about_vision_text: '텐트 및 디스플레이 시스템 분야에서 신뢰할 수 있는 글로벌 제조 파트너가 되어 제조 공정과 제품 품질을 지속적으로 향상시키고 고객에게 장기적이고 안정적인 상업적 가치를 창출합니다.',
                stat_years: '년 제조 경험',
                stat_clients: '글로벌 고객',
                stat_products: '제품 모델',
                
                // 제품 특징
                feature_quality: '최고 품질',
                feature_quality_desc: '고품질 소재 사용, 엄격한 품질 관리로 제품의 내구성과 신뢰성 보장',
                feature_fast: '빠른 배송',
                feature_fast_desc: '효율적인 생산 프로세스, 빠른 물류 배송으로 적시 도착 보장',
                feature_custom: '맞춤 서비스',
                feature_custom_desc: '전문 디자인 팀, OEM/ODM 지원, 고객의 개별 요구사항 충족',
                feature_global: '글로벌 수출',
                feature_global_desc: '여러 국가로 제품 수출, 풍부한 국제 시장 경험',
                
                // サイズページ（英文占位 - 安全版）
                sizes_title: 'Standard Size Options',
                sizes_subtitle: 'Standard sizes shown below. Custom sizes & modular combinations available.',
                sizes_tent_title: 'Pop-up Canopy Tent',
                sizes_giant_title: 'Large Event / Giant Tent',
                sizes_display_title: 'Pop-up Display / Quick Display System',
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
                sizes_cta: 'Get a Quote',
                
                // 인기 사이즈
                popular_sizes_title: '제품 표준 사이즈 참고',
                popular_sizes_subtitle: '아래는 일반적인 표준 사이즈입니다. 맞춤 사이즈 및 모듈 조합 가능',
                size_category_tent_title: '빠른 설치 텐트（Pop-up Canopy Tent）',
                size_category_large_title: '대형 이벤트 텐트（Large Event Tent / Giant Tent）',
                size_category_display_title: '빠른 디스플레이 시스템（Pop-up Display / Quick Display）',
                size_standard_sizes: '표준 사이즈：',
                size_standard_combination: '표준 조합 사이즈：',
                size_standard_options: '표준 옵션：',
                size_features: '구조 특징：',
                size_product_features: '제품 특징：',
                size_applications: '적용 시나리오：',
                size_tent_feature_1: '접이식 알루미늄 또는 강제 프레임',
                size_tent_feature_2: '도구 없이 빠른 설치',
                size_tent_feature_3: '천막 및 사이드월 맞춤 인쇄 가능',
                size_tent_applications: '브랜드 프로모션, 야외 이벤트, 전시 부스, 임시 전시',
                size_category_large_note: '더 큰 사이즈는 모듈 연결로 맞춤 제작 가능',
                size_large_feature_1: '모듈식 조립 구조',
                size_large_feature_2: '고강도 알루미늄 프레임',
                size_large_feature_3: '프로젝트 요구에 따라 높이와 스팬 맞춤 제작 가능',
                size_large_applications: '대형 이벤트, 상업 전시회, 임시 전시관, 브랜드 발표',
                size_display_option_1: '폭 모듈：3m / 4m / 5m',
                size_display_option_2: '구조 형태：직선형 / 곡선형 / U자형',
                size_display_option_3: '단면 또는 양면 전시',
                size_display_feature_1: '경량 접이식 구조',
                size_display_feature_2: '빠른 설치, 운송 용이',
                size_display_feature_3: '그래픽 교체 가능, 고해상도 인쇄 지원',
                size_display_applications: '전시회, 배경벽, 브랜드 이미지 전시',
                size_cta_text: '위 사이즈는 참고용입니다. 맞춤 솔루션은 문의해 주세요.',
                size_cta_text_en: '',
                
                // 고객 후기
                testimonials_title: '고객 후기',
                testimonials_subtitle: '전 세계 고객들의 실제 피드백',
                testimonial_1_text: '"제품 품질이 매우 우수하고, 서비스도 전문적이며, 배송도 신속했습니다. 웨이췬과의 협력에 매우 만족합니다."',
                testimonial_1_name: 'David T.',
                testimonial_1_role: '이벤트 기획 회사',
                testimonial_2_text: '"맞춤 서비스가 매우 전문적이며, 우리의 특별한 요구사항을 충족할 수 있었습니다. 제품 품질은 기대를 뛰어넘었습니다."',
                testimonial_2_name: 'Antonio C.',
                testimonial_2_role: '레스토랑 사장',
                testimonial_3_text: '"팀이 매우 전문적이며, 대응도 신속했습니다. 제품 디자인이 아름답고, 우리의 브랜드 이미지와 완벽하게 일치합니다."',
                testimonial_3_name: 'Owen B.',
                testimonial_3_role: '엔터테인먼트 업계',
                
                // 브레드크럼 및 검색
                breadcrumb_home: '홈',
                breadcrumb_products: '제품센터',
                products_search_placeholder: '제품 검색 (이름/키워드/사양)',
                filters_title: '필터',
                filters_clear: '지우기',
                filters_category: '카테고리',
                filters_quick_tags: '인기 키워드',
                sort_by: '정렬',
                sort_popular: '인기순',
                sort_new: '최신',
                sort_name: '이름 A–Z',
                
                // 제품센터
                products_title: '제품센터',
                products_subtitle: '다양한 인쇄 솔루션으로 다양한 요구사항 충족',
                category_all: '전체 제품',
                category_displays: '전시 시스템',
                category_lightbox: '라이트박스 시스템',
                category_inflatable: '인플레이터블 제품',
                category_accessories: '액세서리',
                category_commercial: '상업 인쇄',
                category_packaging: '포장 인쇄',
                category_digital: '디지털 인쇄',
                category_large: '대형 인쇄',
                
                // 서비스
                services_title: '서비스 범위',
                services_subtitle: '디자인에서 완성품까지 전방위적인 인쇄 서비스',
                service_design: '디자인 서비스',
                service_design_desc: '전문 그래픽 디자인 팀이 고유한 비주얼 아이덴티티를 제작',
                service_printing: '인쇄 서비스',
                service_printing_desc: '첨단 인쇄 장비로 모든 작품을 완벽하게 표현',
                service_finishing: '후가공 서비스',
                service_finishing_desc: '전문적인 제본, 라미네이션, 황금박 등의 후가공 서비스',
                service_delivery: '배송 서비스',
                service_delivery_desc: '빠르고 안전한 물류 배송으로 제품의 적시 배송 보장',
                
                // 문의하기
                contact_title: '문의하기',
                contact_subtitle: '여러분과의 협력을 기대합니다',
                contact_address_title: '회사 주소',
                contact_address: '2nd Xuweiqian Building, Bridge South xilian Dong Cun Gaosha Development District, Nanhai Danzao, Foshan, China',
                contact_phone_title: '전화번호',
                contact_email_title: '이메일 주소',
                
                // 폼
                form_name: '성함',
                form_email: '이메일 주소',
                form_phone: '전화번호',
                form_message: '문의 내용',
                form_submit: '메시지 보내기',
                
                // 푸터
                footer_desc: '전문 인쇄 서비스 제공업체로서 고객에게 최고 품질의 제품과 서비스를 제공하기 위해 최선을 다하겠습니다.',
                footer_links_title: '빠른 링크',
                footer_contact_title: '연락처 정보',
                footer_rights: '모든 권리 보유.',
                
                // PDF 다운로드
                pdf_download_title: '제품 자료 다운로드',
                pdf_download_desc: '아래 버튼을 클릭하여 완전한 제품 카탈로그와 회사 소개를 다운로드하세요.',
                btn_download_pdf: 'PDF 다운로드',
                btn_get_quote: '견적 받기',
                btn_download: '다운로드',
                btn_add_to_cart: '장바구니에 추가',
                
                // 제품 상세 페이지 탭
                tab_desc: '제품 설명',
                tab_specs: '기술 사양',
                tab_apps: '응용 시나리오',
                tab_download: '자료 다운로드',
                related_products: '관련 제품',
                
                // Contact Bottom (Signazon-style)
                footer_company_line_cn: '광시웨이췬 텐트 제조 유한공사',
                footer_company_line_en: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010',
                footer_findus: '위치',
                footer_address: 'Daping Changtangao, Luyin Village,<br>Gucheng Town, Luchuan County,<br>Yulin City, China',
                footer_contact: '연락처',
                footer_companyinfo: '회사 정보',
                footer_about: '회사 소개',
                footer_products: '제품',
                footer_contactus: '문의하기',
                footer_ask_title: '제품 또는 디자인에 대해 무엇이든 물어보세요…',
                footer_ask_text: '제품 유형, 크기, 수량 및 인쇄 요구사항을 알려주세요. 24시간 이내에 답변드리겠습니다.',
                footer_ask_btn: '견적 받기',
                footer_ask_btn2: '지금 WhatsApp',
                footer_copyright: '© 2026 광시웨이췬 텐트 제조 유한공사. 모든 권리 보유.',
                footer_terms: '이용 약관',
                footer_privacy: '개인정보 보호정책',
                footer_sitemap: '사이트맵'
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
        document.querySelectorAll('[data-lang-option]').forEach(btn => {
            const code = btn.getAttribute('data-lang-option');
            btn.style.display = ENABLED_LANGS.includes(code) ? '' : 'none';
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
        document.documentElement.lang = lang;
        
        // 更新字体方向（如果需要）
        const rtlLanguages = ['ar', 'he', 'fa'];
        document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    }
    
    updateBodyLanguageClass(lang) {
        // 移除所有语言类
        document.body.classList.remove('lang-zh', 'lang-en', 'lang-ja', 'lang-ko');
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
        // 统一使用 site_language 作为唯一 key
        localStorage.setItem('site_language', lang);
        // 兼容旧 key（逐步迁移）
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
});

// ===== Language Gate - 不再自动弹出 =====
// ✅ 统一方案：默认英文，不弹窗，用户通过右上角图标切换
document.addEventListener('DOMContentLoaded', () => {
    // 使用统一的 getLang() 函数
    const savedLang = getLang();
    
    // 统一保存到 site_language
    if (!localStorage.getItem(LANG_KEY)) {
        localStorage.setItem(LANG_KEY, savedLang);
    }
    
    // 应用语言（兼容现有 multiLang 实现）
    if (window.multiLang && typeof window.multiLang.switchLanguage === 'function') {
        window.multiLang.switchLanguage(savedLang);
    }
    
    // ❌ 不再自动显示语言选择弹窗
    const gate = document.getElementById('languageGate');
    if (gate) {
        gate.remove(); // 直接移除，不再显示
    }
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
