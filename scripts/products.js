// 产品管理系统

// Hero slides data (centralized)
window.HERO_SLIDES = [
    {
        id: 'displays',
        image: 'images/hero/伟群快幕秀照片.jpeg',
        alt: 'Pop-up Display System',
        kickerZh: '畅销产品 · 展示系统',
        kickerEn: 'Top Seller · Display System',
        titleZh: '快幕秀展示系统',
        titleEn: 'Pop-up Display Backdrop',
        subZh: '适用于展会、活动与品牌推广的快速搭建展示系统，轻便易携带，画面可更换。',
        subEn: 'Portable pop-up display systems for exhibitions and events. Fast setup, lightweight structure, replaceable graphics.',
        highlights: [
            { label: 'Size', valueZh: '2.3×2.3m · 2.3×3m · 2.3×4m · 2.3×6m', valueEn: '2.3×2.3m · 2.3×3m · 2.3×4m · 2.3×6m' },
            { label: 'Material', valueZh: '铝合金框架 + 布喷画面', valueEn: 'Aluminum frame + Fabric graphic' },
            { label: 'Lead Time', valueZh: '样品 7–15 天｜大货 15–25 天', valueEn: '7–15 days (sample) · 15–25 days (bulk)' }
        ],
        ctaHref: './product-center.html?cat=displays',
    ctaTextZh: '查看详情',
    ctaTextEn: 'View Details'
  },
  {
    id: 'flags',
    image: 'images/hero/hero-flag.jpg',
    alt: 'Beach Flags',
    kickerZh: '畅销产品 · 户外广告',
    kickerEn: 'Top Seller · Outdoor Advertising',
    titleZh: '沙滩旗 / 刀旗',
    titleEn: 'Beach Flags',
    subZh: '高辨识度户外广告旗帜，适用于活动、商铺门口与展会引流。',
    subEn: 'High-visibility advertising flags ideal for outdoor promotions, storefronts and events.',
    highlights: [
      { label: 'Type', valueZh: '羽毛 · 刀旗 · 矩形', valueEn: 'Feather · Teardrop · Rectangle' },
      { label: 'Size', valueZh: '2m / 3m / 4m / 5m（可定制）', valueEn: '2m / 3m / 4m / 5m (custom available)' },
      { label: 'Application', valueZh: '展会 · 商业推广 · 户外活动', valueEn: 'Events · Promotions · Outdoor use' }
    ],
    ctaHref: './product-center.html?cat=flags',
    ctaTextZh: '查看详情',
    ctaTextEn: 'View Details'
  },
  {
    id: 'tents',
    image: 'images/hero/hero-tent.jpg',
    alt: 'Custom Canopy Tent',
    kickerZh: '畅销产品 · 户外帐篷',
    kickerEn: 'Top Seller · Event Tent',
    titleZh: '定制广告帐篷',
    titleEn: 'Custom Canopy Tent',
    subZh: '适用于展会、赛事与商业活动的高强度折叠帐篷，支持全方位品牌定制。',
    subEn: 'Heavy-duty folding tents for exhibitions, sports and promotions, fully customizable with your branding.',
    highlights: [
      { label: 'Size', valueZh: '3×3m · 3×4.5m · 3×6m', valueEn: '3×3m · 3×4.5m · 3×6m' },
      { label: 'Frame', valueZh: '铝合金 / 加厚钢架', valueEn: 'Aluminum / Heavy-duty steel' },
      { label: 'Customization', valueZh: 'LOGO 印刷 · 颜色定制 · 配件可选', valueEn: 'Logo printing · Color options · Accessories' }
    ],
    ctaHref: './product-center.html?cat=tents',
    ctaTextZh: '查看详情',
    ctaTextEn: 'View Details'
  }
];

class ProductManager {
    constructor() {
        this.products = [
            // ===== Stock folding tents (used by all-products + product-detail) =====
            {
                id: 2001,
                category: 'tents',
                type: 'stock',
                subcategory: 'stock',
                model: 'WK-T30',
                name: '30方管铁架帐篷',
                nameEn: '30 Square Tube Iron Frame Tent',
                nameZh: '30方管铁架帐篷',
                shortEn: 'Durable 30 square tube iron frame tent; waterproof and fire-retardant.',
                shortZh: '30方管铁架，防水阻燃，适合短期活动与租赁。',
                short: '30方管铁架，防水阻燃，适合短期活动与租赁。',
                descriptionEn: 'Economical pop-up canopy tent with 30 square tube iron frame. Great for rentals and short-term events. Optional 300D/600D fabric and custom printing.',
                descriptionZh: '30方管铁架快开帐篷，经济耐用，适合租赁与短期活动。可选300D/600D面料及定制印刷。',
                description: '30方管铁架快开帐篷，经济耐用，适合租赁与短期活动。可选300D/600D面料及定制印刷。',
                materialEn: 'Iron',
                materialZh: '铁',
                image: 'images/products/tents/folding30/hero.png',
                images: [
                    'images/products/tents/folding30/hero.png',
                    'images/products/tents/folding30/30square-tube-frame-iron-authenticaccessories.png',
                    'images/products/tents/folding30/2D.png',
                    'images/products/tents/folding30/Pop-up%20Canopy%20Tent%20hero.png'
                ],
                gallery: [
                    'images/products/tents/folding30/hero.png',
                    'images/products/tents/folding30/30square-tube-frame-iron-authenticaccessories.png',
                    'images/products/tents/folding30/2D.png',
                    'images/products/tents/folding30/Pop-up%20Canopy%20Tent%20hero.png'
                ],
                // Unified size table (model -> size -> weight)
                variants: [
                    { model: 'WK-T30I', size: '1.5 × 1.5 M', weight: '13 KG' },
                    { model: 'WK-T30H', size: '2 × 2 M', weight: '15 KG' },
                    { model: 'WK-T30A', size: '2 × 3 M', weight: '19 KG' },
                    { model: 'WK-T30B', size: '2.5 × 2.5 M', weight: '16.5 KG' },
                    { model: 'WK-T30C', size: '3 × 3 M', weight: '21 KG' },
                    { model: 'WK-T30D', size: '3 × 4.5 M', weight: '27 KG' },
                    { model: 'WK-T30E', size: '3 × 6 M', weight: '36 KG' }
                ],
                options: {
                    frameMaterial: { value: 'iron', detailEn: '30 square tube iron frame — robust and economical.', detailZh: '30方管铁架 — 结实且经济' },
                    fabric: [ { value: '300D', labelEn: '300D', labelZh: '300D' }, { value: '600D', labelEn: '600D', labelZh: '600D' } ],
                    printing: [ { value: 'printed', labelEn: 'Printed', labelZh: '印刷' }, { value: 'plain', labelEn: 'Plain', labelZh: '无印' } ]
                },
                sizeTable: [
                    { size: '1.5 × 1.5 M', weight: '13 KG' },
                    { size: '2 × 2 M', weight: '15 KG' },
                    { size: '2 × 3 M', weight: '19 KG' },
                    { size: '2.5 × 2.5 M', weight: '16.5 KG' },
                    { size: '3 × 3 M', weight: '21 KG' },
                    { size: '3 × 4.5 M', weight: '27 KG' },
                    { size: '3 × 6 M', weight: '36 KG' }
                ],
                searchableKeywords: ['WK-T30I','WK-T30H','WK-T30A','WK-T30B','WK-T30C','WK-T30D','WK-T30E','WK-T30','30','30square','iron','30方管'],
                keywords: ['WK-T30','30','30square','iron','30方管'],
                tags: 'WK-T30, WK-T30I, WK-T30H, WK-T30A, WK-T30B, WK-T30C, WK-T30D, WK-T30E, 30, iron, folding tent, stock',
                price: '询价'
            },
                // ===== Displays: A-Frame / Backdrop =====
                {
                    id: 42001,
                    category: 'displays',
                    subcategory: 'a-frame',
                    model: 'AD-H18 Series',
                    name: 'A字架（A-Frame）',
                    nameEn: 'A-Frame',
                    nameZh: 'A字架（A-Frame）',
                    short: 'A字架展示系统，可用于活动背板与品牌画面展示。',
                    shortEn: 'A-frame display system for event branding and backdrop graphics.',
                    shortZh: 'A字架展示系统，可用于活动背板与品牌画面展示。',
                    description: 'A字架展示系统（AD-H18 系列）。支持多种型号尺寸与多种画面形状/尺寸选项，适用于活动、展会与户外展示。',
                    descriptionEn: 'A-frame display system (AD-H18 series). Multiple model sizes plus multiple graphic shape/size options for events, exhibitions and outdoor displays.',
                    descriptionZh: 'A字架展示系统（AD-H18 系列）。支持多种型号尺寸与多种画面形状/尺寸选项，适用于活动、展会与户外展示。',
                    image: 'images/placeholder.svg',
                    images: ['images/placeholder.svg'],
                    gallery: ['images/placeholder.svg'],
                    variantTables: [
                        {
                            titleZh: '形状与尺寸（S / M / L）',
                            titleEn: 'Shape Types & Sizes (S / M / L)',
                            columns: [
                                { key: 'type', labelZh: '类型', labelEn: 'Type' },
                                { key: 's', labelZh: 'S', labelEn: 'S' },
                                { key: 'm', labelZh: 'M', labelEn: 'M' },
                                { key: 'l', labelZh: 'L', labelEn: 'L' }
                            ],
                            rows: [
                                { type: 'A', s: '70 × 120 cm', m: '100 × 200 cm', l: '110 × 260 cm' },
                                { type: 'B', s: '62 × 126 cm', m: '100 × 200 cm', l: '110 × 260 cm' },
                                { type: 'C', s: '100 × 100 cm', m: '120 × 120 cm', l: '150 × 150 cm' },
                                { type: 'D', s: '100 × 100 cm', m: '120 × 120 cm', l: '150 × 150 cm' },
                                { type: 'E', s: '', m: '80 × 120 cm', l: '110 × 220 cm' },
                                { type: 'F', s: '80 × 100 cm', m: '80 × 120 cm', l: '110 × 220 cm' },
                                { type: 'G', s: '80 × 100 cm', m: '80 × 120 cm', l: '110 × 220 cm' },
                                { type: 'H', s: '80 × 150 cm', m: '100 × 200 cm', l: '100 × 250 cm' }
                            ]
                        },
                        {
                            titleZh: 'A字架型号参数',
                            titleEn: 'A-Frame Models',
                            columns: [
                                { key: 'model', labelZh: '型号', labelEn: 'Model' },
                                { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
                                { key: 'carton', labelZh: '外箱尺寸', labelEn: 'Carton Size' },
                                { key: 'qty', labelZh: '数量', labelEn: 'Quantity' },
                                { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
                            ],
                            rows: [
                                { model: 'AD-H18A', size: '100 × 200 cm', carton: '125 × 14 × 11 cm', qty: '1', weight: '5.5 kg' },
                                { model: 'AD-H18B', size: '100 × 250 cm', carton: '125 × 14 × 11 cm', qty: '1', weight: '6.2 kg' },
                                { model: 'AD-H18C', size: '100 × 300 cm', carton: '100 × 24 × 11 cm', qty: '1', weight: '7.0 kg' }
                            ]
                        }
                    ],
                    keywords: ['A-Frame', 'A frame', 'AD-H18', 'backdrop', 'display', 'A字架', '背板', '活动展示'],
                    tags: 'A-Frame, AD-H18A, AD-H18B, AD-H18C, backdrop, display',
                    pdf: '广西伟群帐篷制造有限公司2025改.pdf',
                    price: '询价'
                },
                {
                    id: 42002,
                    category: 'displays',
                    subcategory: 'a-frame-backdrop',
                    model: 'AD-H1',
                    name: 'A字架背板系统（Backdrop）',
                    nameEn: 'A-Frame Backdrop System',
                    nameZh: 'A字架背板系统（Backdrop）',
                    short: 'A字架背板系统，适合活动主视觉与背景展示。',
                    shortEn: 'A-frame backdrop system for key visuals and event backdrops.',
                    shortZh: 'A字架背板系统，适合活动主视觉与背景展示。',
                    description: 'Backdrop System（AD-H1）。提供 150 × 90 cm / 180 × 90 cm 两种尺寸，装箱信息见型号参数表。',
                    descriptionEn: 'Backdrop System (AD-H1). Two size options: 150 × 90 cm / 180 × 90 cm. Packing details are listed in the model table.',
                    descriptionZh: 'Backdrop System（AD-H1）。提供 150 × 90 cm / 180 × 90 cm 两种尺寸，装箱信息见型号参数表。',
                    image: 'images/placeholder.svg',
                    images: ['images/placeholder.svg'],
                    gallery: ['images/placeholder.svg'],
                    variantTables: [
                        {
                            titleZh: 'Backdrop System 参数',
                            titleEn: 'Backdrop System Specs',
                            columns: [
                                { key: 'model', labelZh: '型号', labelEn: 'Model' },
                                { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
                                { key: 'carton', labelZh: '外箱尺寸', labelEn: 'Carton Size' },
                                { key: 'qty', labelZh: '数量', labelEn: 'Quantity' },
                                { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
                            ],
                            rows: [
                                { model: 'AD-H1', size: '150 × 90 cm', carton: '105 × 11 × 26 cm', qty: '1 set', weight: '8.2 kg' },
                                { model: 'AD-H1', size: '180 × 90 cm', carton: '105 × 11 × 26 cm', qty: '1 set', weight: '8.2 kg' }
                            ]
                        }
                    ],
                    keywords: ['Backdrop', 'Backdrop System', 'AD-H1', 'A-Frame', 'display', '背板', '背景板'],
                    tags: 'Backdrop System, AD-H1, A-Frame backdrop, display',
                    pdf: '广西伟群帐篷制造有限公司2025改.pdf',
                    price: '询价'
                },
                {
                    id: 42003,
                    category: 'displays',
                    subcategory: 'popup',
                    model: 'WK-PO-01',
                    name: '快幕秀布拉网',
                    nameEn: 'Fabric Pop Up Display',
                    nameZh: '快幕秀布拉网',
                    short: '便携式折叠结构，快速安装，适用于展会背景、品牌展示、活动使用。',
                    shortEn: 'Portable folding structure with fast setup, ideal for exhibition backdrops, brand displays and events.',
                    shortZh: '便携式折叠结构，快速安装，适用于展会背景、品牌展示、活动使用。',
                    description: '快幕秀布拉网（Fabric Pop-up Display）是最典型、最正统的快幕秀产品。采用折叠式铝合金框架与拉网结构，用作背景墙/展会背板，快速展开、无需工具。常见尺寸：3m / 4m / 5m 宽。可更换画面，便携收纳包装。',
                    descriptionEn: 'Fabric Pop-up Display is the most standard and authentic pop-up backdrop product. Features folding aluminum frame with tension fabric structure, used as backdrop wall for exhibitions. Tool-free quick setup. Common widths: 3m / 4m / 5m. Replaceable graphics with portable carrying case.',
                    descriptionZh: '快幕秀布拉网（Fabric Pop-up Display）是最典型、最正统的快幕秀产品。采用折叠式铝合金框架与拉网结构，用作背景墙/展会背板，快速展开、无需工具。常见尺寸：3m / 4m / 5m 宽。可更换画面，便携收纳包装。',
                    image: encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png'),
                    images: [
                        encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png')
                    ],
                    gallery: [
                        encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png')
                    ],
                    variantTables: [
                        {
                            titleZh: '产品特点',
                            titleEn: 'Product Features',
                            description: '便携式折叠结构 · 快速安装 · 可更换画面 · 适用于展会背景、品牌展示、活动使用'
                        },
                        {
                            titleZh: '配件展示',
                            titleEn: 'Included Accessories',
                            items: ['铝合金折叠框架 / Aluminum folding frame', '画面布 / Fabric graphic', '便携收纳包 / Portable carrying bag']
                        },
                        {
                            titleZh: '型号与规格',
                            titleEn: 'Model & Specifications',
                            columns: [
                                { key: 'model', labelZh: '型号', labelEn: 'Model' },
                                { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
                                { key: 'carton', labelZh: '外箱尺寸', labelEn: 'Carton Size' },
                                { key: 'qty', labelZh: '数量', labelEn: 'Quantity' },
                                { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
                            ],
                            rows: [
                                { model: 'WK-PO-01', size: '225×225×30 CM', carton: '44×44×94 CM', qty: '1', weight: '8 KG' },
                                { model: 'WK-PO-01', size: '300×225×30 CM', carton: '45×45×105 CM', qty: '1', weight: '9 KG' },
                                { model: 'WK-PO-01', size: '375×225×30 CM', carton: '72×44×100 CM', qty: '1', weight: '12 KG' }
                            ]
                        }
                    ],
                    keywords: ['快幕秀', '布拉网', 'pop up display', 'popup display', 'fabric display', 'backdrop', 'exhibition backdrop', 'WK-PO-01', 'trade show', 'portable display'],
                    tags: 'Fabric Pop Up Display, 快幕秀, 布拉网, WK-PO-01, backdrop, exhibition',
                    pdf: '广西伟群帐篷制造有限公司2025改.pdf',
                    referenceImage: encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png'),
                    referenceImageLabel: '产品画册参考 / Product Catalog Reference',
                    price: '询价'
                },
                {
                    id: 42004,
                    category: 'displays',
                    subcategory: 'counter',
                    model: 'WK-PO-01-A/B/C',
                    name: '快幕秀前台 / 张拉布前台',
                    nameEn: 'Tension Fabric Counter',
                    nameZh: '快幕秀前台 / 张拉布前台',
                    short: '张拉布展示系统，可选发光/不发光，适用于前台/接待桌/展位家具。',
                    shortEn: 'Tension fabric display system with optional illumination, ideal for reception counters and booth furniture.',
                    shortZh: '张拉布展示系统，可选发光/不发光，适用于前台/接待桌/展位家具。',
                    description: '张拉布前台（Tension Fabric Counter）是快幕秀展示系统的配套产品。采用同样的张拉布+快装结构，但用途是前台/接待桌/展位家具，不作为"背景墙"。支持发光与不发光两种模式，多重包装保护，夜间效果更佳。',
                    descriptionEn: 'Tension Fabric Counter is an accessory product for pop-up display systems. Features the same tension fabric + quick-setup structure, but designed for reception counters, desks and booth furniture rather than backdrops. Available in illuminated and non-illuminated versions with multiple packaging protection. Enhanced visual appeal at night.',
                    descriptionZh: '张拉布前台（Tension Fabric Counter）是快幕秀展示系统的配套产品。采用同样的张拉布+快装结构，但用途是前台/接待桌/展位家具，不作为"背景墙"。支持发光与不发光两种模式，多重包装保护，夜间效果更佳。',
                    image: encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png'),
                    images: [
                        encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png')
                    ],
                    gallery: [
                        encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png')
                    ],
                    variantTables: [
                        {
                            titleZh: '产品类型',
                            titleEn: 'Product Types',
                            items: ['张拉布前台 / Fabric Counter', '前台桌 / Reception Desk']
                        },
                        {
                            titleZh: '前台结构类型',
                            titleEn: 'Counter Structure Types',
                            items: ['方形 Square', '椭圆 Ellipse', '圆形 Round']
                        },
                        {
                            titleZh: '产品特性',
                            titleEn: 'Product Features',
                            description: 'Illuminated and non-illuminated both available（可选发光/不发光）· Luminous, moving, more gorgeous · Night is even more appealing'
                        },
                        {
                            titleZh: '常规尺寸',
                            titleEn: 'Standard Sizes',
                            items: ['40 × 70 × 95 CM', '42 × 100 × 95 CM', '60 × 90 CM']
                        },
                        {
                            titleZh: '安装步骤',
                            titleEn: 'Installation Steps',
                            steps: [
                                '取出所有配件 / Take out all the accessories',
                                '连接杆 / Connecting rod',
                                '互相紧密连接 / Each other closely',
                                '杆插入底座固定 / The rod is inserted into the chassis fixed',
                                '支架固定在弹力布上 / The bracket is attached on the elastic cloth',
                                '安装完成 / Installation is completed'
                            ]
                        },
                        {
                            titleZh: '型号与规格',
                            titleEn: 'Model & Specifications',
                            columns: [
                                { key: 'model', labelZh: '型号', labelEn: 'Model' },
                                { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
                                { key: 'graphic', labelZh: '画面尺寸', labelEn: 'Graphic Size' },
                                { key: 'carton', labelZh: '外箱尺寸', labelEn: 'Carton Size' },
                                { key: 'qty', labelZh: '数量', labelEn: 'Quantity' },
                                { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
                            ],
                            rows: [
                                { model: 'WK-PO-01-A', size: '39.5×95.5×100 CM', graphic: '104×140 CM', carton: '62×43.5×13.5 CM', qty: '1', weight: '7 KG' },
                                { model: 'WK-PO-02-B', size: '49.5×79.5×100 CM', graphic: '104×340 CM', carton: '84×53×13.5 CM', qty: '1', weight: '8 KG' },
                                { model: 'WK-PO-03-C', size: '59.5×95.5×100 CM', graphic: '104×185 CM', carton: '65×65×11 CM', qty: '1', weight: '7 KG' }
                            ]
                        }
                    ],
                    keywords: ['张拉布', '前台', 'tension fabric', 'fabric counter', 'reception counter', 'display counter', 'WK-PO-01-A', 'WK-PO-02-B', 'WK-PO-03-C', 'illuminated', 'booth furniture'],
                    tags: 'Tension Fabric Counter, 张拉布前台, Fabric Counter, counter, reception desk, exhibition counter',
                    pdf: '广西伟群帐篷制造有限公司2025改.pdf',
                    referenceImage: encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/19.png'),
                    referenceImageLabel: '产品画册参考 / Product Catalog Reference',
                    price: '询价'
                },

            // ===== RaceGate (fiberglass) =====
            {
                id: 9401,
                category: 'racegate',
                type: 'v',
                model: 'RaceGate-V',
                name: 'V型拱门',
                nameEn: 'V Race Gate',
                nameZh: 'V型拱门',
                shortEn: 'Portable fiberglass race gate for events and racing. Sizes and packing specs from catalog.',
                shortZh: '玻璃钢竞速拱门，适用于赛事与活动。尺寸与装箱信息参考目录。',
                descriptionEn: 'Fiberglass race gate (V shape). Sizes, diameter, thickness, pack size and pack quantity are based on the catalog image (pdf_p9.png).',
                descriptionZh: '玻璃钢竞速拱门（V型）。尺寸、直径、厚度、箱规与装箱数量来自目录图片（pdf_p9.png）。',
                image: encodeURI('images/products/racegate/V Race Gate/hero.png'),
                images: [
                    encodeURI('images/products/racegate/V Race Gate/hero.png'),
                    'images/products/racegate/pdf_p9.png'
                ],
                gallery: [
                    encodeURI('images/products/racegate/V Race Gate/hero.png'),
                    'images/products/racegate/pdf_p9.png'
                ],
                pdf: '广西伟群帐篷制造有限公司2025改.pdf',
                variantTable: {
                    headers: ['Model', 'Material', 'Size', 'Diameter', 'Thickness', 'Pack Size', 'Pack Quantity'],
                    rows: [
                        { Model: 'AD-R40A', Material: 'Fiberglass', Size: 'L 2.5*H 1.4m', Diameter: '8mm', Thickness: '2.5mm', 'Pack Size': '118*25*15cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40B', Material: 'Fiberglass', Size: 'L 3.1*H 1.9m', Diameter: '10mm', Thickness: '2.5mm', 'Pack Size': '118*25*22cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40C', Material: 'Fiberglass', Size: 'L 3.6*H 2.4m', Diameter: '12mm', Thickness: '2.5mm', 'Pack Size': '118*25*22cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40D', Material: 'Fiberglass', Size: 'L 5.5*H 3.0m', Diameter: '12mm', Thickness: '2.5mm', 'Pack Size': '118*30*25cm', 'Pack Quantity': '5pcs/cartons' }
                    ]
                },
                keywords: ['race gate', 'racegate', 'fpv', 'drone', '拱门', '竞速拱门', 'AD-R40A', 'AD-R40B', 'AD-R40C', 'AD-R40D', 'fiberglass', '玻璃钢'],
                tags: 'RaceGate, Fiberglass',
                price: '询价'
            },
            {
                id: 9402,
                category: 'racegate',
                type: 'o',
                model: 'RaceGate-O',
                name: 'O型拱门',
                nameEn: 'O Race Gate',
                nameZh: 'O型拱门',
                shortEn: 'Portable fiberglass race gate for events and racing. Sizes and packing specs from catalog.',
                shortZh: '玻璃钢竞速拱门，适用于赛事与活动。尺寸与装箱信息参考目录。',
                descriptionEn: 'Fiberglass race gate (O shape). Sizes, diameter, thickness, pack size and pack quantity are based on the catalog image (pdf_p9.png).',
                descriptionZh: '玻璃钢竞速拱门（O型）。尺寸、直径、厚度、箱规与装箱数量来自目录图片（pdf_p9.png）。',
                image: encodeURI('images/products/racegate/O Race Gate/hero.png'),
                images: [
                    encodeURI('images/products/racegate/O Race Gate/hero.png'),
                    'images/products/racegate/pdf_p9.png'
                ],
                gallery: [
                    encodeURI('images/products/racegate/O Race Gate/hero.png'),
                    'images/products/racegate/pdf_p9.png'
                ],
                pdf: '广西伟群帐篷制造有限公司2025改.pdf',
                variantTable: {
                    headers: ['Model', 'Material', 'Size', 'Diameter', 'Thickness', 'Pack Size', 'Pack Quantity'],
                    rows: [
                        { Model: 'AD-R40A', Material: 'Fiberglass', Size: 'L 2.5*H 1.4m', Diameter: '8mm', Thickness: '2.5mm', 'Pack Size': '118*25*15cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40B', Material: 'Fiberglass', Size: 'L 3.1*H 1.9m', Diameter: '10mm', Thickness: '2.5mm', 'Pack Size': '118*25*22cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40C', Material: 'Fiberglass', Size: 'L 3.6*H 2.4m', Diameter: '12mm', Thickness: '2.5mm', 'Pack Size': '118*25*22cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40D', Material: 'Fiberglass', Size: 'L 5.5*H 3.0m', Diameter: '12mm', Thickness: '2.5mm', 'Pack Size': '118*30*25cm', 'Pack Quantity': '5pcs/cartons' }
                    ]
                },
                keywords: ['race gate', 'racegate', 'fpv', 'drone', '拱门', '竞速拱门', 'AD-R40A', 'AD-R40B', 'AD-R40C', 'AD-R40D', 'fiberglass', '玻璃钢'],
                tags: 'RaceGate, Fiberglass',
                price: '询价'
            },
            {
                id: 9403,
                category: 'racegate',
                type: 'semi',
                model: 'RaceGate-SemiCircle',
                name: '半圆型拱门',
                nameEn: 'Semi-circle Race Gate',
                nameZh: '半圆型拱门',
                shortEn: 'Portable fiberglass race gate for events and racing. Sizes and packing specs from catalog.',
                shortZh: '玻璃钢竞速拱门，适用于赛事与活动。尺寸与装箱信息参考目录。',
                descriptionEn: 'Fiberglass race gate (semi-circle). Sizes, diameter, thickness, pack size and pack quantity are based on the catalog image (pdf_p9.png).',
                descriptionZh: '玻璃钢竞速拱门（半圆型）。尺寸、直径、厚度、箱规与装箱数量来自目录图片（pdf_p9.png）。',
                image: encodeURI('images/products/racegate/Semi-circle Race Gate/hero.png'),
                images: [
                    encodeURI('images/products/racegate/Semi-circle Race Gate/hero.png'),
                    'images/products/racegate/pdf_p9.png'
                ],
                gallery: [
                    encodeURI('images/products/racegate/Semi-circle Race Gate/hero.png'),
                    'images/products/racegate/pdf_p9.png'
                ],
                pdf: '广西伟群帐篷制造有限公司2025改.pdf',
                variantTable: {
                    headers: ['Model', 'Material', 'Size', 'Diameter', 'Thickness', 'Pack Size', 'Pack Quantity'],
                    rows: [
                        { Model: 'AD-R40A', Material: 'Fiberglass', Size: 'L 2.5*H 1.4m', Diameter: '8mm', Thickness: '2.5mm', 'Pack Size': '118*25*15cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40B', Material: 'Fiberglass', Size: 'L 3.1*H 1.9m', Diameter: '10mm', Thickness: '2.5mm', 'Pack Size': '118*25*22cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40C', Material: 'Fiberglass', Size: 'L 3.6*H 2.4m', Diameter: '12mm', Thickness: '2.5mm', 'Pack Size': '118*25*22cm', 'Pack Quantity': '10pcs/cartons' },
                        { Model: 'AD-R40D', Material: 'Fiberglass', Size: 'L 5.5*H 3.0m', Diameter: '12mm', Thickness: '2.5mm', 'Pack Size': '118*30*25cm', 'Pack Quantity': '5pcs/cartons' }
                    ]
                },
                keywords: ['race gate', 'racegate', 'fpv', 'drone', '拱门', '竞速拱门', 'AD-R40A', 'AD-R40B', 'AD-R40C', 'AD-R40D', 'fiberglass', '玻璃钢'],
                tags: 'RaceGate, Fiberglass',
                price: '询价'
            },
            {
                id: 2002,
                category: 'tents',
                type: 'stock',
                subcategory: 'stock',
                model: 'WK-T40',
                name: '40六角铝合金架帐篷',
                nameEn: '40 Hexagon Aluminum Frame Tent',
                nameZh: '40六角铝合金架帐篷',
                shortEn: 'Hexagon 40 aluminum frame tent — lightweight and durable.',
                shortZh: '40六角铝合金框架，轻便耐用，适合常规活动使用。',
                short: '40六角铝合金框架，轻便耐用，适合常规活动使用。',
                descriptionEn: 'Pop-up canopy tent with 40 hexagon aluminum frame — lighter and corrosion-resistant. Supports multiple sizes with 300D/600D fabric and optional printing.',
                descriptionZh: '40六角铝合金快开帐篷，轻便耐腐蚀。多尺寸可选，支持300D/600D面料与定制印刷。',
                description: '40六角铝合金快开帐篷，轻便耐腐蚀。多尺寸可选，支持300D/600D面料与定制印刷。',
                materialEn: 'Aluminum',
                materialZh: '铝合金',
                image: 'images/products/tents/folding40/hero.png',
                images: [
                    'images/products/tents/folding40/hero.png',
                    'images/products/tents/folding40/40square-tube-frame-aluminum-authenticaccessories.png'
                ],
                gallery: [
                    'images/products/tents/folding40/hero.png',
                    'images/products/tents/folding40/40square-tube-frame-aluminum-authenticaccessories.png'
                ],
                variants: [
                    { model: 'WK-T40I', size: '1.5 × 1.5 M', weight: '12.5 KG' },
                    { model: 'WK-T40H', size: '2 × 2 M', weight: '13 KG' },
                    { model: 'WK-T40A', size: '2.5 × 2.5 M', weight: '16 KG' },
                    { model: 'WK-T40B', size: '3 × 3 M', weight: '17 KG' },
                    { model: 'WK-T40C', size: '3 × 4.5 M', weight: '20 KG' },
                    { model: 'WK-T40D', size: '3 × 6 M', weight: '28 KG' },
                    { model: 'WK-T40E', size: '4 × 4 M', weight: '20.5 KG' },
                    { model: 'WK-T40F', size: '4 × 6 M', weight: '26 KG' },
                    { model: 'WK-T40G', size: '4 × 8 M', weight: '33 KG' }
                ],
                options: {
                    frameMaterial: { value: 'aluminum', detailEn: '40 hexagon aluminum frame — lighter, corrosion resistant.', detailZh: '40六角铝合金框架 — 更轻，耐腐蚀' },
                    fabric: [ { value: '300D', labelEn: '300D', labelZh: '300D' }, { value: '600D', labelEn: '600D', labelZh: '600D' } ],
                    printing: [ { value: 'printed', labelEn: 'Printed', labelZh: '印刷' }, { value: 'plain', labelEn: 'Plain', labelZh: '无印' } ]
                },
                sizeTable: [
                    { size: '1.5 × 1.5 M', weight: '12.5 KG' },
                    { size: '2 × 2 M', weight: '13 KG' },
                    { size: '2.5 × 2.5 M', weight: '16 KG' },
                    { size: '3 × 3 M', weight: '17 KG' },
                    { size: '3 × 4.5 M', weight: '20 KG' },
                    { size: '3 × 6 M', weight: '28 KG' },
                    { size: '4 × 4 M', weight: '20.5 KG' },
                    { size: '4 × 6 M', weight: '26 KG' },
                    { size: '4 × 8 M', weight: '33 KG' }
                ],
                searchableKeywords: ['WK-T40I','WK-T40H','WK-T40A','WK-T40B','WK-T40C','WK-T40D','WK-T40E','WK-T40F','WK-T40G','WK-T40','40','40hexagon','aluminum','铝合金','六角'],
                keywords: ['WK-T40','40','40hexagon','aluminum','铝合金'],
                tags: 'WK-T40, WK-T40I, WK-T40H, WK-T40A, WK-T40B, WK-T40C, WK-T40D, WK-T40E, WK-T40F, WK-T40G, 40, aluminum, folding tent, stock',
                price: '询价'
            },
            {
                id: 2003,
                category: 'tents',
                type: 'stock',
                subcategory: 'stock',
                model: 'WK-T50',
                name: '50六角铝合金架帐篷',
                nameEn: '50 Hexagon Aluminum Frame Tent',
                nameZh: '50六角铝合金架帐篷',
                shortEn: 'Heavy-duty 50 hexagon aluminum frame tent for larger events.',
                shortZh: '50六角铝合金框架，承重更强，适合更大尺度活动。',
                short: '50六角铝合金框架，承重更强，适合更大尺度活动。',
                descriptionEn: 'Heavy-duty pop-up canopy with 50 hexagon aluminum frame for larger spans and frequent use. Multiple sizes available with 300D/600D fabric and optional printing.',
                descriptionZh: '50六角铝合金快开帐篷，强度更高，适合更大跨度与高频使用。多尺寸可选，支持300D/600D面料与定制印刷。',
                description: '50六角铝合金快开帐篷，强度更高，适合更大跨度与高频使用。多尺寸可选，支持300D/600D面料与定制印刷。',
                materialEn: 'Aluminum',
                materialZh: '铝合金',
                image: 'images/products/tents/folding50/hero.png',
                images: [
                    'images/products/tents/folding50/hero.png',
                    'images/products/tents/folding50/50square-tube-frame-aluminum-authenticaccessories.png'
                ],
                gallery: [
                    'images/products/tents/folding50/hero.png',
                    'images/products/tents/folding50/50square-tube-frame-aluminum-authenticaccessories.png'
                ],
                variants: [
                    { model: 'WK-T50H', size: '2 × 2 M', weight: '20 KG' },
                    { model: 'WK-T50A', size: '2.5 × 2.5 M', weight: '22 KG' },
                    { model: 'WK-T50B', size: '3 × 3 M', weight: '29 KG' },
                    { model: 'WK-T50C', size: '3 × 4.5 M', weight: '40 KG' },
                    { model: 'WK-T50D', size: '3 × 6 M', weight: '55 KG' },
                    { model: 'WK-T50E', size: '4 × 4 M', weight: '36 KG' },
                    { model: 'WK-T50F', size: '4 × 6 M', weight: '51 KG' },
                    { model: 'WK-T50G', size: '4 × 8 M', weight: '67 KG' }
                ],
                options: {
                    frameMaterial: { value: 'aluminum', detailEn: '50 hexagon aluminum frame — maximum strength for larger spans.', detailZh: '50六角铝合金框架 — 更大跨度的更高强度' },
                    fabric: [ { value: '300D', labelEn: '300D', labelZh: '300D' }, { value: '600D', labelEn: '600D', labelZh: '600D' } ],
                    printing: [ { value: 'printed', labelEn: 'Printed', labelZh: '印刷' }, { value: 'plain', labelEn: 'Plain', labelZh: '无印' } ]
                },
                sizeTable: [
                    { size: '2 × 2 M', weight: '20 KG' },
                    { size: '2.5 × 2.5 M', weight: '22 KG' },
                    { size: '3 × 3 M', weight: '29 KG' },
                    { size: '3 × 4.5 M', weight: '40 KG' },
                    { size: '3 × 6 M', weight: '55 KG' },
                    { size: '4 × 4 M', weight: '36 KG' },
                    { size: '4 × 6 M', weight: '51 KG' },
                    { size: '4 × 8 M', weight: '67 KG' }
                ],
                searchableKeywords: ['WK-T50H','WK-T50A','WK-T50B','WK-T50C','WK-T50D','WK-T50E','WK-T50F','WK-T50G','WK-T50','50','50hexagon','aluminum','铝合金','六角'],
                keywords: ['WK-T50','50','50hexagon','aluminum','铝合金'],
                tags: 'WK-T50, WK-T50H, WK-T50A, WK-T50B, WK-T50C, WK-T50D, WK-T50E, WK-T50F, WK-T50G, 50, aluminum, folding tent, stock',
                price: '询价'
            },

            // 24 accessories items mapped to the overview sprite (IDs 9001-9024)
            {
                id: 9001,
                category: 'accessories',
                model: 'AD-t01',
                name: '半围横杆 (AD-t01)',
                nameEn: 'Half Wall Support Pole (AD-t01)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 1, col: 1 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t01']
            },
            {
                id: 9002,
                category: 'accessories',
                model: 'WK-T02',
                name: '压重水桶（方） (WK-T02)',
                nameEn: 'Water Weight (Square) (WK-T02)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 1, col: 2 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T02']
            },
            {
                id: 9003,
                category: 'accessories',
                model: 'WK-T01A',
                name: '帐篷配件（WK-T01A）',
                nameEn: 'Tent Accessory (WK-T01A)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 1, col: 3 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T01A']
            },
            {
                id: 9004,
                category: 'accessories',
                model: 'WK-T02A',
                name: '压重水桶（圆） (WK-T02A)',
                nameEn: 'Water Weight (Round) (WK-T02A)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 1, col: 4 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T02A']
            },
            {
                id: 9005,
                category: 'accessories',
                model: 'AD-t03',
                name: '帐篷配件（AD-t03）',
                nameEn: 'Tent Accessory (AD-t03)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 2, col: 1 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t03']
            },
            {
                id: 9006,
                category: 'accessories',
                model: 'AD-t04',
                name: '沙袋 (AD-t04)',
                nameEn: 'Sand Bag (AD-t04)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 2, col: 2 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t04']
            },
            {
                id: 9007,
                category: 'accessories',
                model: 'WK-T03A',
                name: '帐篷配件（WK-T03A）',
                nameEn: 'Tent Accessory (WK-T03A)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 2, col: 3 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T03A']
            },
            {
                id: 9008,
                category: 'accessories',
                model: 'WK-T03D',
                name: '帐篷配件（WK-T03D）',
                nameEn: 'Tent Accessory (WK-T03D)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 2, col: 4 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T03D']
            },
            {
                id: 9009,
                category: 'accessories',
                model: 'AD-t05',
                name: '帐篷配件（AD-t05）',
                nameEn: 'Tent Accessory (AD-t05)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 3, col: 1 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t05']
            },
            {
                id: 9010,
                category: 'accessories',
                model: 'AD-t06',
                name: '帐篷配件（AD-t06）',
                nameEn: 'Tent Accessory (AD-t06)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 3, col: 2 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t06']
            },
            {
                id: 9011,
                category: 'accessories',
                model: 'WK-T12-B',
                name: '帐篷配件（WK-T12-B）',
                nameEn: 'Tent Accessory (WK-T12-B)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 3, col: 3 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T12-B']
            },
            {
                id: 9012,
                category: 'accessories',
                model: 'WK-T06-2',
                name: '帐篷手提袋 (WK-T06-2)',
                nameEn: 'Tent Carry Bag (WK-T06-2)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 3, col: 4 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T06-2']
            },
            {
                id: 9013,
                category: 'accessories',
                model: 'AD-t07',
                name: '帐篷配件（AD-t07）',
                nameEn: 'Tent Accessory (AD-t07)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 4, col: 1 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t07']
            },
            {
                id: 9014,
                category: 'accessories',
                model: 'AD-t08',
                name: '帐篷配件（AD-t08）',
                nameEn: 'Tent Accessory (AD-t08)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 4, col: 2 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t08']
            },
            {
                id: 9015,
                category: 'accessories',
                model: 'WK-T11',
                name: '固定绳 (WK-T11)',
                nameEn: 'Tie Down Rope (WK-T11)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 4, col: 3 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T11']
            },
            {
                id: 9016,
                category: 'accessories',
                model: 'WK-T11-A',
                name: '固定绳 (WK-T11-A)',
                nameEn: 'Tie Down Rope (WK-T11-A)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 4, col: 4 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T11-A']
            },
            {
                id: 9017,
                category: 'accessories',
                model: 'AD-t09',
                name: '帐篷配件（AD-t09）',
                nameEn: 'Tent Accessory (AD-t09)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 5, col: 1 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t09']
            },
            {
                id: 9018,
                category: 'accessories',
                model: 'AD-t10',
                name: '帐篷配件（AD-t10）',
                nameEn: 'Tent Accessory (AD-t10)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 5, col: 2 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','AD-t10']
            },
            {
                id: 9019,
                category: 'accessories',
                model: 'WK-T05-1',
                name: '帐篷配件（WK-T05-1）',
                nameEn: 'Tent Accessory (WK-T05-1)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 5, col: 3 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T05-1']
            },
            {
                id: 9020,
                category: 'accessories',
                model: 'WK-T12',
                name: '帐篷配件（WK-T12）',
                nameEn: 'Tent Accessory (WK-T12)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 5, col: 4 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T12']
            },
            {
                id: 9021,
                category: 'accessories',
                model: 'WK-T13',
                name: '帐篷配件（WK-T13）',
                nameEn: 'Tent Accessory (WK-T13)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 6, col: 1 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T13']
            },
            {
                id: 9022,
                category: 'accessories',
                model: 'WK-T14',
                name: '帐篷配件（WK-T14）',
                nameEn: 'Tent Accessory (WK-T14)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 6, col: 2 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T14']
            },
            {
                id: 9023,
                category: 'accessories',
                model: 'WK-T15',
                name: '帐篷配件（WK-T15）',
                nameEn: 'Tent Accessory (WK-T15)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 6, col: 3 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T15']
            },
            {
                id: 9024,
                category: 'accessories',
                model: 'WK-T16',
                name: '帐篷配件（WK-T16）',
                nameEn: 'Tent Accessory (WK-T16)',
                image: 'images/products/accessories/tent-accessories.png',
                grid: { row: 6, col: 4 },
                specsZh: { Color: '待补充', Size: '待补充', Weight: '待补充', Carton: '待补充', Quantity: '待补充' },
                specsEn: { Color: 'TBD', Size: 'TBD', Weight: 'TBD', Carton: 'TBD', Quantity: 'TBD' },
                keywords: ['accessory','accessories','tent accessories','配件','帐篷配件','WK-T16']
            },
            {
                id: 4,
                category: 'furniture',
                name: '可折叠户外桌椅套装',
                nameEn: 'Foldable Outdoor Table and Chair Set',
                nameJa: '折りたたみ式アウトドアテーブルチェアセット',
                nameKo: '접이식 아웃도어 테이블 의자 세트',
                description: '高品质可折叠户外桌椅套装，便携易用，适合各种户外活动',
                descriptionEn: 'High-quality foldable outdoor table and chair set, portable and easy to use, suitable for various outdoor activities',
                descriptionJa: '高品質折りたたみ式アウトドアテーブルチェアセット、ポータブルで使いやすく、様々なアウトドア活動に適しています',
                descriptionKo: '고품질 접이식 아웃도어 테이블 의자 세트, 휴대용이고 사용하기 쉬우며 다양한 아웃도어 활동에 적합',
                image: 'outdoor-furniture.jpg',
                specs: ['铝合金材质', '防水面料', '快速折叠', '便携收纳'],
                specsEn: ['Aluminum Material', 'Waterproof Fabric', 'Quick Fold', 'Portable Storage'],
                specsJa: ['アルミ素材', '防水生地', '高速折りたたみ', 'ポータブル収納'],
                specsKo: ['알루미늄 소재', '방수 원단', '빠른 접기', '휴대용 수납'],
                price: '起价 ¥599/套'
            },

            // ===== Furniture series: Table / Chair / Stool / Toilet (hero/image pending) =====
            {
                id: 31001,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Z122',
                name: '对折桌（WK-Z122）',
                nameEn: 'Folding In Half Table (WK-Z122)',
                description: '便携式对折桌，适用于展会、活动与户外使用。',
                descriptionEn: 'Portable folding-in-half table for events, exhibitions and outdoor use.',
                image: '',
                specs: ['对折收纳', '便携', '适用活动/户外'],
                specsEn: ['Folds in half', 'Portable', 'For events/outdoor'],
                keywords: ['furniture', 'table', 'folding table', '对折桌', 'WK-Z122']
            },
            {
                id: 31002,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Z153',
                name: '对折桌（WK-Z153）',
                nameEn: 'Folding In Half Table (WK-Z153)',
                description: '便携式对折桌，适用于展会、活动与户外使用。',
                descriptionEn: 'Portable folding-in-half table for events, exhibitions and outdoor use.',
                image: '',
                specs: ['对折收纳', '便携', '适用活动/户外'],
                specsEn: ['Folds in half', 'Portable', 'For events/outdoor'],
                keywords: ['furniture', 'table', 'folding table', '对折桌', 'WK-Z153']
            },
            {
                id: 31003,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Z183',
                name: '对折桌（WK-Z183）',
                nameEn: 'Folding In Half Table (WK-Z183)',
                description: '便携式对折桌，适用于展会、活动与户外使用。',
                descriptionEn: 'Portable folding-in-half table for events, exhibitions and outdoor use.',
                image: '',
                specs: ['对折收纳', '便携', '适用活动/户外'],
                specsEn: ['Folds in half', 'Portable', 'For events/outdoor'],
                keywords: ['furniture', 'table', 'folding table', '对折桌', 'WK-Z183']
            },
            {
                id: 31004,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Z244',
                name: '对折桌（WK-Z244）',
                nameEn: 'Folding In Half Table (WK-Z244)',
                description: '便携式对折桌，适用于展会、活动与户外使用。',
                descriptionEn: 'Portable folding-in-half table for events, exhibitions and outdoor use.',
                image: '',
                specs: ['对折收纳', '便携', '适用活动/户外'],
                specsEn: ['Folds in half', 'Portable', 'For events/outdoor'],
                keywords: ['furniture', 'table', 'folding table', '对折桌', 'WK-Z244']
            },
            {
                id: 31005,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-FZ88',
                name: '方桌（WK-FZ88）',
                nameEn: 'Square Table (WK-FZ88)',
                description: '方形便携桌，适用于活动、餐饮与户外使用。',
                descriptionEn: 'Square portable table for events, catering and outdoor use.',
                image: '',
                specs: ['方形台面', '便携', '适用多场景'],
                specsEn: ['Square top', 'Portable', 'Multi-scenario use'],
                keywords: ['furniture', 'table', 'square table', '方桌', 'WK-FZ88']
            },
            {
                id: 31006,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Y183',
                name: '对折长凳（WK-Y183）',
                nameEn: 'Folding In Half Bench (WK-Y183)',
                description: '可折叠长凳，快速展开，适用于活动与户外。',
                descriptionEn: 'Folding-in-half bench with fast setup for events and outdoor use.',
                image: '',
                specs: ['对折收纳', '快速展开', '多人座位'],
                specsEn: ['Folds in half', 'Fast setup', 'Multi-seat'],
                keywords: ['furniture', 'bench', 'folding bench', '长凳', 'WK-Y183']
            },
            {
                id: 31007,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Y45',
                name: '折叠椅（WK-Y45）',
                nameEn: 'Folding Chair (WK-Y45)',
                description: '轻便折叠椅，适用于活动、展会与临时座位。',
                descriptionEn: 'Lightweight folding chair for events, exhibitions and temporary seating.',
                image: '',
                specs: ['折叠收纳', '轻便', '快速使用'],
                specsEn: ['Foldable', 'Lightweight', 'Ready to use'],
                keywords: ['furniture', 'chair', 'folding chair', '折叠椅', 'WK-Y45']
            },
            {
                id: 31008,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Y30A',
                name: '折叠凳（WK-Y30A）',
                nameEn: 'Folding Stool (WK-Y30A)',
                description: '便携折叠凳，适用于户外、排队区和活动场景。',
                descriptionEn: 'Portable folding stool for outdoor use, queue areas and events.',
                image: '',
                specs: ['折叠收纳', '便携', '稳固支撑'],
                specsEn: ['Foldable', 'Portable', 'Stable support'],
                keywords: ['furniture', 'stool', 'folding stool', '折叠凳', 'WK-Y30A']
            },
            {
                id: 31009,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-YZ80',
                name: '圆桌（伞桌）（WK-YZ80）',
                nameEn: 'Umbrella Round Table (WK-YZ80)',
                description: '圆形伞桌，适合户外休闲与活动接待。',
                descriptionEn: 'Round umbrella table for outdoor leisure and event reception.',
                image: '',
                specs: ['圆形台面', '适配遮阳伞', '户外使用'],
                specsEn: ['Round top', 'Umbrella compatible', 'Outdoor use'],
                keywords: ['furniture', 'table', 'round table', 'umbrella table', '伞桌', 'WK-YZ80']
            },
            {
                id: 31010,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-YZ120',
                name: '圆形对折桌（WK-YZ120）',
                nameEn: 'Round Folding In Half Table (WK-YZ120)',
                description: '圆形对折桌，便携收纳，适用于活动与户外。',
                descriptionEn: 'Round folding-in-half table for events and outdoor use.',
                image: '',
                specs: ['圆形台面', '对折收纳', '便携'],
                specsEn: ['Round top', 'Folds in half', 'Portable'],
                keywords: ['furniture', 'table', 'round table', 'folding table', '圆形对折桌', 'WK-YZ120']
            },
            {
                id: 31011,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-YZ150',
                name: '圆形对折桌（WK-YZ150）',
                nameEn: 'Round Folding In Half Table (WK-YZ150)',
                description: '圆形对折桌，便携收纳，适用于活动与户外。',
                descriptionEn: 'Round folding-in-half table for events and outdoor use.',
                image: '',
                specs: ['圆形台面', '对折收纳', '便携'],
                specsEn: ['Round top', 'Folds in half', 'Portable'],
                keywords: ['furniture', 'table', 'round table', 'folding table', '圆形对折桌', 'WK-YZ150']
            },
            {
                id: 31012,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-YZ180',
                name: '圆形对折桌（WK-YZ180）',
                nameEn: 'Round Folding In Half Table (WK-YZ180)',
                description: '圆形对折桌，便携收纳，适用于活动与户外。',
                descriptionEn: 'Round folding-in-half table for events and outdoor use.',
                image: '',
                specs: ['圆形台面', '对折收纳', '便携'],
                specsEn: ['Round top', 'Folds in half', 'Portable'],
                keywords: ['furniture', 'table', 'round table', 'folding table', '圆形对折桌', 'WK-YZ180']
            },
            {
                id: 31013,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-BZ80',
                name: '鸡尾酒桌（WK-BZ80）',
                nameEn: 'Cocktail Table (WK-BZ80)',
                description: '高脚鸡尾酒桌，适用于展会接待、活动酒会与品牌推广。',
                descriptionEn: 'High-top cocktail table for receptions, events and brand promotions.',
                image: '',
                specs: ['高脚桌', '活动接待', '便携'],
                specsEn: ['High-top', 'For receptions', 'Portable'],
                keywords: ['furniture', 'table', 'cocktail table', 'bar table', '鸡尾酒桌', 'WK-BZ80']
            },
            {
                id: 31014,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-Y45A',
                name: '吧椅（折叠）（WK-Y45A）',
                nameEn: 'Bar Folding Chair (WK-Y45A)',
                description: '折叠吧椅，适用于吧台、酒会与活动接待。',
                descriptionEn: 'Folding bar chair for bars, receptions and events.',
                image: '',
                specs: ['折叠收纳', '吧台/酒会', '便携'],
                specsEn: ['Foldable', 'Bar/reception', 'Portable'],
                keywords: ['furniture', 'chair', 'bar chair', 'folding chair', '吧椅', 'WK-Y45A']
            },
            {
                id: 31015,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-F115',
                name: '对折桌（WK-F115）',
                nameEn: 'Folding Into Half Table (WK-F115)',
                description: '对折桌，便携收纳，适用于活动/户外/临时用餐。',
                descriptionEn: 'Folding-into-half table for events, outdoor use and temporary dining.',
                image: '',
                specs: ['对折收纳', '便携', '多场景使用'],
                specsEn: ['Folds in half', 'Portable', 'Multi-scenario'],
                keywords: ['furniture', 'table', 'folding table', '对折桌', 'WK-F115']
            },
            {
                id: 31016,
                category: 'furniture',
                subcategory: 'table-chair-stool-toilet',
                model: 'WK-PT20',
                name: '便携厕所（WK-PT20）',
                nameEn: 'Portable Toilet (WK-PT20)',
                description: '便携厕所，适用于露营、活动与临时户外场景。',
                descriptionEn: 'Portable toilet for camping, events and temporary outdoor scenarios.',
                image: '',
                specs: ['便携', '易清洁', '适合户外'],
                specsEn: ['Portable', 'Easy to clean', 'Outdoor use'],
                keywords: ['furniture', 'toilet', 'portable toilet', '便携厕所', 'WK-PT20']
            },

            // ===== Table/Chair cover fabric series (hero/image pending) =====
            {
                id: 31101,
                category: 'custom',
                subcategory: 'covers',
                model: 'TableCover-3D',
                name: '立体弹力桌布（4/5/6/8FT）',
                nameEn: 'Three Dimensional Fabric Table Cover (4/5/6/8FT)',
                description: '用于桌椅的立体弹力布套，可按尺寸与图案定制（多色可选）。',
                descriptionEn: '3D stretch fabric cover for tables/chairs. Custom size and graphics (multiple colors available).',
                image: '',
                specs: ['尺寸：4FT / 5FT / 6FT / 8FT', '弹力面料', '支持定制印刷'],
                specsEn: ['Sizes: 4FT / 5FT / 6FT / 8FT', 'Stretch fabric', 'Custom printing'],
                keywords: ['custom', 'cover', 'table cover', 'stretch', '3d fabric', '桌布', '弹力桌布']
            },
            {
                id: 31102,
                category: 'custom',
                subcategory: 'covers',
                model: 'TableCover-Square',
                name: '方桌罩布（4/5/6/8FT）',
                nameEn: 'Square Cover Fabric (4/5/6/8FT)',
                description: '方桌罩布，适配多种尺寸，可定制印刷与颜色。',
                descriptionEn: 'Square table cover fabric with size options. Custom printing and colors available.',
                image: '',
                specs: ['尺寸：4FT / 5FT / 6FT / 8FT', '可定制印刷', '多色可选'],
                specsEn: ['Sizes: 4FT / 5FT / 6FT / 8FT', 'Custom printing', 'Multiple colors'],
                keywords: ['custom', 'cover', 'square cover', 'table cover', '方桌罩布']
            },
            {
                id: 31103,
                category: 'custom',
                subcategory: 'covers',
                model: 'Fabric-Square',
                name: '方形桌布（4/5/6/8FT）',
                nameEn: 'Square Fabric (4/5/6/8FT)',
                description: '方形桌布系列，尺寸可选，支持定制。',
                descriptionEn: 'Square fabric series with size options and customization.',
                image: '',
                specs: ['尺寸：4FT / 5FT / 6FT / 8FT', '支持定制', '多色可选'],
                specsEn: ['Sizes: 4FT / 5FT / 6FT / 8FT', 'Customizable', 'Multiple colors'],
                keywords: ['custom', 'fabric', 'square fabric', 'table cloth', '方形桌布']
            },
            {
                id: 31104,
                category: 'custom',
                subcategory: 'covers',
                model: '3D-Cover-FoldingTable',
                name: '立体对折桌布',
                nameEn: '3D Folding In Half Table Fabric',
                description: '适配对折桌的立体布套，支持定制印刷与多色选择。',
                descriptionEn: '3D fabric cover for folding-in-half tables, customizable printing and colors.',
                image: '',
                specs: ['立体版型', '适配对折桌', '可定制印刷'],
                specsEn: ['3D fit', 'For folding tables', 'Custom printing'],
                keywords: ['custom', 'cover', '3d', 'folding table', 'table fabric', '对折桌布']
            },
            {
                id: 31105,
                category: 'custom',
                subcategory: 'covers',
                model: '3D-Cover-RoundFoldingTable',
                name: '立体圆形对折桌布',
                nameEn: '3D Round Folding In Half Table Fabric',
                description: '适配圆形对折桌的立体布套，支持定制印刷。',
                descriptionEn: '3D fabric cover for round folding-in-half tables, customizable printing.',
                image: '',
                specs: ['立体版型', '适配圆形对折桌', '可定制印刷'],
                specsEn: ['3D fit', 'For round folding tables', 'Custom printing'],
                keywords: ['custom', 'cover', '3d', 'round table', 'table fabric', '圆形对折桌布']
            },
            {
                id: 31106,
                category: 'custom',
                subcategory: 'covers',
                model: '3D-Cover-FoldingChair',
                name: '立体折叠椅套',
                nameEn: '3D Folding Chair Fabric',
                description: '适配折叠椅的立体布套，可定制印刷与颜色。',
                descriptionEn: '3D fabric cover for folding chairs. Custom printing and colors available.',
                image: '',
                specs: ['立体版型', '适配折叠椅', '可定制印刷'],
                specsEn: ['3D fit', 'For folding chairs', 'Custom printing'],
                keywords: ['custom', 'cover', 'chair cover', '3d', 'folding chair', '折叠椅套']
            },
            {
                id: 31107,
                category: 'custom',
                subcategory: 'covers',
                model: '3D-Cover-CocktailTable',
                name: '立体鸡尾酒桌布',
                nameEn: '3D Cocktail Table Fabric',
                description: '适配鸡尾酒桌的立体桌布，支持多色与定制印刷。',
                descriptionEn: '3D fabric cover for cocktail tables, multiple colors and custom printing.',
                image: '',
                specs: ['立体版型', '适配鸡尾酒桌', '多色可选'],
                specsEn: ['3D fit', 'For cocktail tables', 'Multiple colors'],
                keywords: ['custom', 'cover', 'cocktail table', 'bar table', '3d', '鸡尾酒桌布']
            },

            // ===== DOME 3 FOLDERS (hero/image pending) =====
            {
                id: 31201,
                category: 'tents',
                subcategory: 'dome-3-folders',
                model: 'WK-TENT188',
                name: '车顶帐篷（WK-TENT188）',
                nameEn: 'Car Tent (WK-TENT188)',
                description: '车顶帐篷系列，便携收纳，适用于露营与户外出行。',
                descriptionEn: 'Car tent series for camping and outdoor travel. Portable and easy to pack.',
                image: '',
                specs: ['尺寸：120×222×22CM', '重量：17KG', '纸箱：3×3M', '数量：1PCS'],
                specsEn: ['Size: 120×222×22 CM', 'Weight: 17 KG', 'Carton: 3×3M', 'Qty: 1 PCS'],
                keywords: ['tents', 'car tent', 'camping', 'WK-TENT188']
            },
            {
                id: 31202,
                category: 'tents',
                subcategory: 'dome-3-folders',
                model: 'WK-TENT190',
                name: '户外更衣室（WK-TENT190）',
                nameEn: 'Outdoor Dressing Room (WK-TENT190)',
                description: '户外更衣室/淋浴帐篷，便携快速搭建。',
                descriptionEn: 'Outdoor dressing room / privacy tent with quick setup.',
                image: '',
                specs: ['尺寸：120×120×190CM', '重量：2.5KG', '纸箱：55×55×30CM', '数量：10PCS', '毛重：26KG'],
                specsEn: ['Size: 120×120×190 CM', 'Weight: 2.5 KG', 'Carton: 55×55×30 CM', 'Qty: 10 PCS', 'G.W.: 26 KG'],
                keywords: ['tents', 'privacy tent', 'dressing room', 'outdoor', 'WK-TENT190']
            },
            {
                id: 31203,
                category: 'furniture',
                subcategory: 'dome-3-folders',
                model: 'WK-C56',
                name: '方形折叠收纳篮（WK-C56）',
                nameEn: 'Square Folding Clothes Basket (WK-C56)',
                description: '方形折叠收纳篮，便携收纳，适用于旅行与户外。',
                descriptionEn: 'Square folding storage basket for travel and outdoor use.',
                image: '',
                specs: ['尺寸：34×34×56CM', '重量：0.22KG', '纸箱：50×50×35CM', '数量：50PCS', '毛重：12KG'],
                specsEn: ['Size: 34×34×56 CM', 'Weight: 0.22 KG', 'Carton: 50×50×35 CM', 'Qty: 50 PCS', 'G.W.: 12 KG'],
                keywords: ['furniture', 'basket', 'storage', 'folding', 'WK-C56']
            },
            {
                id: 31204,
                category: 'furniture',
                subcategory: 'dome-3-folders',
                model: 'WK-C59',
                name: '圆形折叠收纳篮（WK-C59）',
                nameEn: 'Round Folding Clothes Basket (WK-C59)',
                description: '圆形折叠收纳篮，便携收纳，适用于旅行与户外。',
                descriptionEn: 'Round folding storage basket for travel and outdoor use.',
                image: '',
                specs: ['尺寸：35×59CM', '重量：0.28KG', '纸箱：50×50×35CM', '数量：50PCS', '毛重：26KG'],
                specsEn: ['Size: 35×59 CM', 'Weight: 0.28 KG', 'Carton: 50×50×35 CM', 'Qty: 50 PCS', 'G.W.: 26 KG'],
                keywords: ['furniture', 'basket', 'storage', 'folding', 'WK-C59']
            },
            {
                id: 31205,
                category: 'furniture',
                subcategory: 'dome-3-folders',
                model: 'WK-C35',
                name: '圆形折叠收纳篮（WK-C35）',
                nameEn: 'Round Folding Clothes Basket (WK-C35)',
                description: '圆形折叠收纳篮，便携收纳，适用于旅行与户外。',
                descriptionEn: 'Round folding storage basket for travel and outdoor use.',
                image: '',
                specs: ['尺寸：28×35CM', '重量：0.35KG', '纸箱：48×48×43CM', '数量：60PCS', '毛重：23KG'],
                specsEn: ['Size: 28×35 CM', 'Weight: 0.35 KG', 'Carton: 48×48×43 CM', 'Qty: 60 PCS', 'G.W.: 23 KG'],
                keywords: ['furniture', 'basket', 'storage', 'folding', 'WK-C35']
            }
        ];

        // Default PDF mapping (catalogs)
        // If a product does not provide a dedicated PDF/page link, attach the most relevant catalog.
        const DEFAULT_PDF_BY_CATEGORY = {
            tents: '广西伟群帐篷制造有限公司2025改.pdf',
            default: '广西伟群帐篷制造有限公司2025改.pdf'
        };

        this.products.forEach((p) => {
            if (!p || p.pdf) return;
            const cat = String(p.category || '').toLowerCase();
            p.pdf = DEFAULT_PDF_BY_CATEGORY[cat] || DEFAULT_PDF_BY_CATEGORY.default;
        });
        this.currentCategory = 'all';
        this.currentLanguage = 'zh';
        this.searchQuery = '';
        this.selectedTags = new Set();
        this.sortBy = 'popular';
        this.currentPage = 1;
        this.pageSize = 12;
        this.activeFilters = {
            category: new Set(),
            specs: new Set()
        };

        // Ensure every product has a stable id for deep-linking.
        this.ensureProductIds();

        this.init();
    }

    // ------------------------------
    // Product Detail Content (auto-generated, bilingual)
    // ------------------------------
    _safeText(v) {
        return (v == null) ? '' : String(v);
    }

    _escapeHtml(s) {
        return this._safeText(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    _uniq(list) {
        const out = [];
        const seen = new Set();
        (Array.isArray(list) ? list : []).forEach((x) => {
            const v = this._safeText(x).trim();
            if (!v) return;
            const key = v.toLowerCase();
            if (seen.has(key)) return;
            seen.add(key);
            out.push(v);
        });
        return out;
    }

    _pickLocalized(product, baseKey) {
        const lang = (this.currentLanguage || 'en').toLowerCase();
        const suffixMap = { zh: '', en: 'En', ja: 'Ja', ko: 'Ko' };
        const suffix = suffixMap[lang] ?? '';
        const localizedKey = suffix ? `${baseKey}${suffix}` : baseKey;
        return this._safeText((product && (product[localizedKey] ?? product[baseKey])) || '');
    }

    _getProductSummary(product) {
        const short = this._pickLocalized(product, 'short');
        const desc = this._pickLocalized(product, 'description');
        return (short || desc || '').trim();
    }

    _getFrameHint(product) {
        const fm = product && product.options && product.options.frameMaterial && product.options.frameMaterial.value;
        const mapZh = { iron: '铁架', steel: '钢架', aluminum: '铝合金', aluminium: '铝合金', fiberglass: '玻纤', carbon: '碳纤' };
        const mapEn = { iron: 'steel/iron', steel: 'steel', aluminum: 'aluminum', aluminium: 'aluminum', fiberglass: 'fiberglass', carbon: 'carbon fiber' };
        const key = this._safeText(fm).toLowerCase();
        return {
            zh: mapZh[key] || (key ? key : ''),
            en: mapEn[key] || (key ? key : '')
        };
    }

    _getSizeHint(product) {
        const sizes = [];
        if (product && Array.isArray(product.sizeTable)) {
            product.sizeTable.forEach((r) => r && r.size && sizes.push(String(r.size)));
        }
        if (!sizes.length && product && Array.isArray(product.variants)) {
            product.variants.forEach((r) => r && r.size && sizes.push(String(r.size)));
        }
        const uniq = this._uniq(sizes);
        const take = uniq.slice(0, 6);
        return {
            zh: take.length ? `常见尺寸：${take.join('、')}` : '',
            en: take.length ? `Common sizes: ${take.join(', ')}` : ''
        };
    }

    _defaultApplicationsByCategory(category) {
        const cat = this._safeText(category).toLowerCase();
        const map = {
            tents: {
                zh: ['展会与品牌推广', '体育赛事与活动现场', '户外促销/路演', '临时遮阳与接待区'],
                en: ['Trade shows & brand activations', 'Sports events & race day setups', 'Outdoor promotions / roadshows', 'Temporary shade & reception areas']
            },
            flags: {
                zh: ['门店引流与活动指引', '赛事/展会标识', '户外广告展示', '品牌形象陈列'],
                en: ['Retail traffic & wayfinding', 'Event / expo signage', 'Outdoor advertising display', 'Brand visibility']
            },
            displays: {
                zh: ['展会展台背景', '新品发布与路演', '商场快闪店', '会议与活动主视觉'],
                en: ['Expo booth backdrops', 'Product launches & roadshows', 'Pop-up shops', 'Conference/event key visuals']
            },
            accessories: {
                zh: ['帐篷配套加固与配重', '快速安装与收纳运输', '不同场地适配', '提升稳定性与使用寿命'],
                en: ['Tent reinforcement & anchoring', 'Faster setup and transport', 'Different ground condition compatibility', 'Improve stability and service life']
            },
            racegate: {
                zh: ['无人机竞速/穿越赛', '赛事起终点拱门', '活动入口与品牌陈列', '户外拍照打卡点'],
                en: ['FPV drone racing', 'Start/finish gate', 'Event entrances & branding', 'Outdoor photo spot']
            },
            furniture: {
                zh: ['展会接待与洽谈区', '户外活动配套', '临时休息区', '活动搭建配套'],
                en: ['Expo reception & meeting areas', 'Outdoor event support', 'Temporary rest areas', 'Event setup accessories']
            },
            custom: {
                zh: ['品牌定制项目', '异形结构与特殊尺寸', '多品类整套解决方案', '全球活动执行支持'],
                en: ['Branded custom projects', 'Special structures & sizes', 'Full kit solutions', 'Global activation support']
            }
        };
        return map[cat] || { zh: ['活动与展示场景'], en: ['Events and display scenarios'] };
    }

    getProductDetailContent(product) {
        const p = product || {};
        const cat = this._safeText(p.category);
        const nameZh = this._safeText(p.nameZh || p.name || '');
        const nameEn = this._safeText(p.nameEn || p.name || '');

        const summaryZh = this._safeText(p.shortZh || p.short || p.descriptionZh || p.description || '').trim();
        const summaryEn = this._safeText(p.shortEn || p.short || p.descriptionEn || p.description || '').trim();

        const frame = this._getFrameHint(p);
        const sizeHint = this._getSizeHint(p);

        // Product Description (long)
        const descZh = this._uniq([
            summaryZh,
            (cat === 'tents' && frame.zh) ? `框架：${frame.zh}（可按需求选配）` : '',
            sizeHint.zh,
            (cat === 'flags') ? '适配多种旗形与底座系统，支持LOGO与画面定制。' : '',
            (cat === 'displays') ? '用于快速搭建的展示系统，可用于品牌主视觉与展台搭建。' : '',
            (cat === 'racegate') ? '结构与规格参考产品型号表，支持项目定制与批量供货。' : '',
            (cat === 'accessories') ? '用于提升主产品的稳定性、兼容性与使用便捷性。' : ''
        ]);

        const descEn = this._uniq([
            summaryEn,
            (cat === 'tents' && frame.en) ? `Frame: ${frame.en} (configurable to your needs)` : '',
            sizeHint.en,
            (cat === 'flags') ? 'Compatible with multiple flag shapes and base systems. Custom logo/graphics supported.' : '',
            (cat === 'displays') ? 'Quick-setup display system for booth branding and key visuals.' : '',
            (cat === 'racegate') ? 'Specs are based on the model table; customization and bulk supply available.' : '',
            (cat === 'accessories') ? 'Designed to improve stability, compatibility and ease of use for the main products.' : ''
        ]);

        // Technical Reference (bullets)
        const techZh = this._uniq([
            p.model ? `型号：${this._safeText(p.model)}` : '',
            (cat === 'tents') ? '面料与印刷：可选不同面料克重与工艺（以实际需求确认）' : '',
            (cat === 'tents') ? '结构与配件：可搭配侧墙、配重、收纳袋等配套' : '',
            (cat === 'flags') ? '可选高度/旗形：刀旗/水滴/方旗等（以具体型号为准）' : '',
            (cat === 'flags') ? '底座与固定：十字底座、注水底座、地插等（按场地选择）' : '',
            (cat === 'racegate') ? '尺寸/管径/壁厚/箱规：见型号参数表' : '',
            (cat === 'accessories') ? '材质/尺寸/装箱：以产品规格表为准' : ''
        ]);

        const techEn = this._uniq([
            p.model ? `Model: ${this._safeText(p.model)}` : '',
            (cat === 'tents') ? 'Fabric & printing: multiple fabric weights and print options (confirm per project)' : '',
            (cat === 'tents') ? 'Structure & accessories: sidewalls, weights, bags and connectors available' : '',
            (cat === 'flags') ? 'Height/shape options: feather/teardrop/square and more (by model)' : '',
            (cat === 'flags') ? 'Bases & anchoring: cross base, water base, ground spike, etc. (by venue)' : '',
            (cat === 'racegate') ? 'Size/diameter/thickness/packing: see the model specification table' : '',
            (cat === 'accessories') ? 'Material/size/packing: refer to the specification table' : ''
        ]);

        // Applications (product-specific overrides if provided, otherwise category defaults)
        const defaultApps = this._defaultApplicationsByCategory(cat);
        const appsZh = this._uniq(Array.isArray(p.applicationsZh) ? p.applicationsZh : defaultApps.zh);
        const appsEn = this._uniq(Array.isArray(p.applicationsEn) ? p.applicationsEn : defaultApps.en);

        // Allow per-product overrides (optional fields)
        const overrideDescZh = Array.isArray(p.detailDescZh) ? p.detailDescZh : (p.detailDescZh ? [p.detailDescZh] : null);
        const overrideDescEn = Array.isArray(p.detailDescEn) ? p.detailDescEn : (p.detailDescEn ? [p.detailDescEn] : null);
        const overrideTechZh = Array.isArray(p.techRefsZh) ? p.techRefsZh : (p.techRefsZh ? [p.techRefsZh] : null);
        const overrideTechEn = Array.isArray(p.techRefsEn) ? p.techRefsEn : (p.techRefsEn ? [p.techRefsEn] : null);

        return {
            name: { zh: nameZh, en: nameEn },
            description: {
                zh: this._uniq(overrideDescZh || descZh),
                en: this._uniq(overrideDescEn || descEn)
            },
            technical: {
                zh: this._uniq(overrideTechZh || techZh),
                en: this._uniq(overrideTechEn || techEn)
            },
            applications: {
                zh: appsZh,
                en: appsEn
            }
        };
    }

    ensureProductIds() {
        if (!Array.isArray(this.products)) return;
        this.products.forEach((product) => {
            if (!product || product.id !== undefined && product.id !== null) return;

            const fromSku = product.sku || product.code;
            if (fromSku) {
                product.id = fromSku;
                return;
            }

            const category = String(product.category || 'product');
            const nameEn = String(product.nameEn || product.name || '').trim();
            const slugBase = (category + '-' + nameEn)
                .toLowerCase()
                .replace(/\s+/g, '-');
            product.id = slugBase;
        });
    }
    
    init() {
    // B1：生成筛选项
    this.generateFilters();
    
    // B2：从 URL 读取筛选状态
    this.loadFiltersFromURL();
    
    // A：监听 checkbox 变化
    this.setupSideFilters();
    
    // B2：同步 UI（勾选 checkbox）
    this.syncFilterUI();
    
    // C：如果从 URL 识别到单个分类，更新面包屑
    if (this.currentCategory !== 'all') {
        this.updateBreadcrumb(this.currentCategory);
    }
    
    // 原有的其他初始化
    this.setupCategoryFilter();
    this.setupSidebarCategoryFilter();
    this.setupSearch();
    this.setupQuickTags();
    this.setupClearFilters();
    this.setupSort();

    // 如果页面指定了分类（用于分类页），则优先生效
    // 用法：<body data-page-category="tents"> 或 <body data-page-category="all">
    const presetCategory = document.body?.dataset?.pageCategory;
    if (presetCategory) {
        this.currentCategory = presetCategory;
        // 如果页面上有对应按钮，则高亮
        const btn = document.querySelector(`.category-btn[data-category="${presetCategory}"]`);
        if (btn) {
            this.updateActiveCategoryButton(presetCategory);
        }
        // 更新面包屑
        this.updateBreadcrumb(presetCategory);
    }

    // 如果页面指定了子分类（例如 products-tents.html 可指定数据属性 data-page-subcategory="stock"）
    const presetSub = document.body?.dataset?.pageSubcategory;
    if (presetSub) {
        this.currentSubcategory = presetSub;
    } else {
        this.currentSubcategory = null;
    }

    // 读取全局多语言系统的当前语言（如果存在）以便初始渲染正确
    if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
        this.currentLanguage = window.multiLang.getCurrentLanguage();
    }

    // C：更新 SEO 和标题
    this.updateSEO();
    this.updateHeading();

    // 最后统一渲染
    this.renderProducts();
    this.setupLanguageListener();
    this.setupRFQ();
}

    
    setupCategoryFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            // Use currentTarget to tolerate clicks on inner elements
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                if (category) {
                    this.filterProducts(category);
                    this.updateActiveCategoryButton(category);
                }
            });
        });
    }
    
    filterProducts(category) {
        this.currentCategory = category;
        this.renderProducts();
    }
    
    updateActiveCategoryButton(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const btn = document.querySelector(`[data-category="${category}"]`);
        if (btn) {
            btn.classList.add('active');
        }
    }
    
    renderProducts() {
        const list = document.querySelector('.products-list');
        const paginationEl = document.getElementById('productsPagination');
        if (!list) return;

        const q = (this.searchQuery || '').toLowerCase();
        const tags = this.selectedTags;

        // 1) filter
        // compute tents steel toggle state and search-based auto-unhide
        const showSteelToggleEl = document.getElementById('showSteelToggle');
        const showSteelToggleChecked = showSteelToggleEl ? showSteelToggleEl.checked : false;
        const searchRevealsSteel = q && (q.includes('steel') || q.includes('iron') || q.includes('steel') || q.includes('aluminium') || q.includes('铝') || q.includes('铁') || q.includes('钢') || q.includes('铁架') || q.includes('钢架'));

        let filtered = this.products.filter(product => {
            /* ===== 原有分类按钮逻辑 ===== */
            if (this.currentCategory !== 'all' && product.category !== this.currentCategory) {
                return false;
            }

            /* ===== 左侧 Category 勾选 ===== */
            if (this.activeFilters.category.size > 0 &&
                !this.activeFilters.category.has(product.category)) {
                return false;
            }

            /* ===== Specs / Application 勾选 ===== */
            if (this.activeFilters.specs.size > 0) {
                // 获取当前语言的 specs 和 description
                const currentSpecs = this.getLocalizedSpecs(product);
                const currentDesc = this.getLocalizedDescription(product);
                const searchText = (currentSpecs.join(' ') + ' ' + currentDesc).toLowerCase();
                let matched = false;

                this.activeFilters.specs.forEach(val => {
                    if (searchText.includes(val.toLowerCase())) {
                        matched = true;
                    }
                });

                if (!matched) return false;
            }

            /* ===== 搜索查询 ===== */
            if (q) {
                const hay = [
                    product.name, product.description,
                    product.nameEn, product.descriptionEn,
                    product.nameJa, product.descriptionJa,
                    product.nameKo, product.descriptionKo,
                    ...(product.specs || []),
                    ...(product.specsEn || []),
                    ...(product.specsJa || []),
                    ...(product.specsKo || []),
                    ...(product.keywords || []),
                    ...((product.variants && product.variants.map(v => v.model)) || []),
                    ...(product.searchableKeywords || [])
                ].filter(Boolean).join(' ').toLowerCase();
                if (!hay.includes(q)) return false;
            }

            // Default behavior for tents listing: hide steel variants unless toggle checked
            if (this.currentCategory === 'tents') {
                // If page or UI set a subcategory (custom/stock), filter by it
                if (this.currentSubcategory && product.subcategory && product.subcategory !== this.currentSubcategory) return false;
                // If user checked toggle, show both. If search explicitly mentions steel/iron, also reveal.
                if (!showSteelToggleChecked && !searchRevealsSteel) {
                    if (product.frameMaterial && product.frameMaterial !== 'aluminum') return false;
                }
            }

            /* ===== 热门标签 ===== */
            if (tags && tags.size) {
                const specs = [
                    ...(product.specs || []),
                    ...(product.specsEn || []),
                    ...(product.specsJa || []),
                    ...(product.specsKo || [])
                ].join(' ');
                let hit = false;
                tags.forEach(t => {
                    if (specs.includes(t)) hit = true;
                });
                if (!hit) return false;
            }

            return true;
        });

        // 2) sort
        if (this.sortBy === 'name') {
            filtered.sort((a, b) => {
                const nameA = this.getLocalizedName(a) || '';
                const nameB = this.getLocalizedName(b) || '';
                return nameA.localeCompare(nameB);
            });
        }
        if (this.sortBy === 'new') {
            filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        }
        // popular = default 顺序，不动

        // 3) pagination
        const total = filtered.length;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageItems = filtered.slice(start, end);

        // 4) render list
        list.innerHTML = '';
        pageItems.forEach(p => {
            list.appendChild(this.createProductRow(p));
        });

        // 应用多语言翻译到新创建的元素
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }

        // 5) count
        const countEl = document.getElementById('productsCount');
        if (countEl) {
            const unit = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_items_unit') : '';
            countEl.textContent = unit ? `${total} ${unit}` : `${total}`;
        }

        // 6) pagination render
        this.renderPagination(total, paginationEl);
    }
    
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.setAttribute('data-category', product.category);

        const t = (key) => (window.multiLang && typeof window.multiLang.t === 'function') ? window.multiLang.t(key) : '';
        
        const name = this.getLocalizedName(product);
        const description = this.getLocalizedDescription(product);
        const specs = this.getLocalizedSpecs(product);
        
        productDiv.innerHTML = `
            <div class="product-image">
                <i class="fas fa-${this.getProductIcon(product.category)}"></i>
            </div>
            <div class="product-info">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="product-specs">
                    ${specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
                </div>
                <div class="product-price">${product.price}</div>
                <div class="product-actions">
                    <a class="btn btn-secondary product-details-btn" href="product.html?id=${encodeURIComponent(product.id)}" data-translate="view_details"></a>
                    <button class="btn btn-accent product-btn" onclick="window.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> ${t('btn_add_to_cart')}
                    </button>
                    <button class="btn btn-secondary product-btn" onclick="window.productManager.downloadProductInfo(${product.id})">
                        <i class="fas fa-download"></i> ${t('download_materials')}
                    </button>
                </div>
            </div>
        `;
        
        return productDiv;
    }
    
getProductIcon(category) {
  const icons = {
    all: 'boxes-stacked',
    tents: 'umbrella-beach',
    flags: 'flag',
    furniture: 'chair',
    custom: 'wand-magic-sparkles',

    // 你菜单里已经有这些类目（products.html 下拉里能看到）
    displays: 'display',
    lightbox: 'lightbulb',
    inflatable: 'balloon',
    accessories: 'screwdriver-wrench',
    popup: 'cube',
    frames: 'border-all'
  };
  return icons[category] || 'box';
}

    
    getLocalizedName(product) {
        const nameMap = {
            zh: product.name,
            en: product.nameEn,
            ja: product.nameJa,
            ko: product.nameKo
        };
        return nameMap[this.currentLanguage] || product.name;
    }
    
    getLocalizedDescription(product) {
        const descMap = {
            zh: product.description,
            en: product.descriptionEn,
            ja: product.descriptionJa,
            ko: product.descriptionKo
        };
        return descMap[this.currentLanguage] || product.description;
    }
    
    getLocalizedSpecs(product) {
        const specsMap = {
            zh: product.specs,
            en: product.specsEn,
            ja: product.specsJa,
            ko: product.specsKo
        };
        return specsMap[this.currentLanguage] || product.specs;
    }
    
    setupLanguageListener() {
        // 监听语言变化
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.setupQuickTags(); // 重新生成 tags（因为显示语言可能变了）
            this.generateFilters(); // 重新生成筛选（因为 specs 语言变了）
            this.setupSideFilters(); // 重新绑定事件
            this.syncFilterUI(); // 同步 UI（保持筛选状态）
            this.updateHeading(); // 更新标题（多语言）
            this.updateBreadcrumb(this.currentCategory); // 更新面包屑文本
            this.renderProducts();
        });
    }

    setupSidebarCategoryFilter() {
        const radios = document.querySelectorAll('input[name="category"]');
        if (!radios.length) return;

        radios.forEach(r => {
            r.addEventListener('change', (e) => {
                const category = e.target.value;
                this.currentCategory = category;
                this.currentPage = 1; // 重置分页
                this.updateBreadcrumb(category);
                this.renderProducts();
                // 同步顶部按钮（如果页面还存在 .category-btn，也能同步高亮）
                this.updateActiveCategoryButton(category);
            });
        });

        // 首次同步 presetCategory（支持 products-tents.html 这种 body data-page-category）
        const preset = document.body?.dataset?.pageCategory || 'all';
        const presetRadio = document.querySelector(`input[name="category"][value="${preset}"]`);
        if (presetRadio) presetRadio.checked = true;
        this.updateBreadcrumb(preset);
    }

    setupSearch() {
        const input = document.getElementById('productSearchInput');
        const clearBtn = document.getElementById('productSearchClear');
        if (!input) return;

        const apply = () => {
            this.searchQuery = (input.value || '').trim();
            this.currentPage = 1; // 重置分页
            if (clearBtn) clearBtn.classList.toggle('show', this.searchQuery.length > 0);
            // B2：更新 URL
            this.updateURLFromFilters();
            this.renderProducts();
        };

        input.addEventListener('input', apply);
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                input.value = '';
                this.searchQuery = '';
                clearBtn.classList.remove('show');
                // B2：更新 URL
                this.updateURLFromFilters();
                this.renderProducts();
                input.focus();
            });
        }
    }

    setupQuickTags() {
        const wrap = document.getElementById('filtersTagList');
        if (!wrap) return;

        // 从所有产品 specs（多语言）里提取一些常见关键词做 quick tags
        const tags = this.collectTopTags(14);

        wrap.innerHTML = '';
        tags.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tag-chip';
            btn.textContent = t;

            btn.addEventListener('click', () => {
                if (this.selectedTags.has(t)) {
                    this.selectedTags.delete(t);
                    btn.classList.remove('active');
                } else {
                    this.selectedTags.add(t);
                    btn.classList.add('active');
                }
                this.currentPage = 1; // 重置分页
                this.renderProducts();
            });

            wrap.appendChild(btn);
        });
    }

    generateFilters() {
        // ===== Category =====
        const categoryGroup = document.querySelector('.filter-group[data-filter="category"] .filter-options');
        if (categoryGroup) {
            const categories = new Set(this.products.map(p => p.category).filter(Boolean));

            categoryGroup.innerHTML = '';
            categories.forEach(cat => {
                categoryGroup.appendChild(this.createCheckbox('category', cat, this.getCategoryLabel(cat)));
            });
        }

        // ===== Specs / Application =====
        const specsGroup = document.querySelector('.filter-group[data-filter="specs"] .filter-options');
        if (specsGroup) {
            const specCount = new Map();

            // 统计所有产品的 specs（使用当前语言的 specs）
            this.products.forEach(p => {
                const currentSpecs = this.getLocalizedSpecs(p);
                currentSpecs.forEach(spec => {
                    const key = spec.trim();
                    if (!key) return;
                    specCount.set(key, (specCount.get(key) || 0) + 1);
                });
            });

            // 取出现次数最多的前 10 个（避免太乱）
            const topSpecs = [...specCount.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([spec]) => spec);

            specsGroup.innerHTML = '';
            topSpecs.forEach(spec => {
                specsGroup.appendChild(this.createCheckbox('specs', spec, spec));
            });
        }
    }

    createCheckbox(type, value, label) {
        const labelEl = document.createElement('label');
        labelEl.className = 'filter-option';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value;

        const span = document.createElement('span');
        span.textContent = label;

        labelEl.appendChild(input);
        labelEl.appendChild(span);

        return labelEl;
    }

    getCategoryLabel(category) {
        const map = {
            tents: 'Tents',
            flags: 'Flags',
            furniture: 'Furniture',
            displays: 'Displays',
            lightbox: 'Lightbox',
            inflatable: 'Inflatable',
            accessories: 'Accessories',
            custom: 'Custom'
        };
        return map[category] || category;
    }

    loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);

        // category
        const cat = params.get('cat');
        if (cat) {
            cat.split(',').forEach(v => {
                const trimmed = v.trim();
                if (trimmed) this.activeFilters.category.add(trimmed);
            });
        }

        // specs
        const spec = params.get('spec');
        if (spec) {
            spec.split(',').forEach(v => {
                const trimmed = decodeURIComponent(v.trim());
                if (trimmed) this.activeFilters.specs.add(trimmed);
            });
        }

        // search
        const q = params.get('q');
        if (q) {
            this.searchQuery = decodeURIComponent(q);
            const input = document.getElementById('productSearchInput');
            if (input) {
                input.value = this.searchQuery;
                const clearBtn = document.getElementById('productSearchClear');
                if (clearBtn) clearBtn.classList.toggle('show', this.searchQuery.length > 0);
            }
        }

        // 如果只有一个 category，设为当前主分类（用于标题/SEO）
        if (this.activeFilters.category.size === 1) {
            this.currentCategory = [...this.activeFilters.category][0];
        }
    }

    updateURLFromFilters() {
        const params = new URLSearchParams();

        if (this.activeFilters.category.size > 0) {
            params.set('cat', [...this.activeFilters.category].join(','));
        }

        if (this.activeFilters.specs.size > 0) {
            params.set('spec', [...this.activeFilters.specs].map(s => encodeURIComponent(s)).join(','));
        }

        if (this.searchQuery) {
            params.set('q', encodeURIComponent(this.searchQuery));
        }

        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');

        window.history.replaceState({}, '', newUrl);
    }

    syncFilterUI() {
        document.querySelectorAll('.filter-group[data-filter]').forEach(group => {
            const type = group.dataset.filter;
            group.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.checked = this.activeFilters[type].has(input.value);
            });
        });
    }

    updateSEO() {
        const seoMap = {
            tents: {
                title: 'Custom Event Tents & Pop Up Canopies | Weiqun',
                desc: 'High-quality custom event tents, pop up canopies and exhibition tents for outdoor promotion, trade shows and events. Professional tent manufacturing with various sizes and customization options.'
            },
            flags: {
                title: 'Custom Advertising Flags | Feather & Teardrop Flags | Weiqun',
                desc: 'Custom feather flags, teardrop flags and advertising flags for outdoor branding and promotion. Professional flag poles and bases for trade shows and events.'
            },
            displays: {
                title: 'Portable Display Systems | Exhibition Displays | Weiqun',
                desc: 'Portable display systems including pop up displays, backdrops and trade show display solutions. Quick setup and professional appearance for exhibitions.'
            },
            lightbox: {
                title: 'Lightbox Systems | LED Display Solutions | Weiqun',
                desc: 'Professional lightbox systems and LED display solutions for advertising and branding. Custom sizes and designs available for your business needs.'
            },
            inflatable: {
                title: 'Inflatable Products | Custom Inflatable Displays | Weiqun',
                desc: 'Custom inflatable displays and products for promotions and events. Eye-catching inflatable solutions for outdoor advertising and brand awareness.'
            },
            accessories: {
                title: 'Accessories & Bases | Tent & Flag Accessories | Weiqun',
                desc: 'Professional tent and flag accessories including bases, poles, and hardware. Complete solutions for your outdoor display needs.'
            },
            furniture: {
                title: 'Outdoor Furniture | Foldable Tables & Chairs | Weiqun',
                desc: 'High-quality outdoor furniture including foldable tables and chairs. Portable and durable solutions for events and outdoor activities.'
            },
            custom: {
                title: 'Custom Products | OEM & ODM Services | Weiqun',
                desc: 'Professional OEM and ODM services for custom outdoor furniture and display products. Tailored solutions to meet your specific requirements.'
            }
        };

        const cat = this.currentCategory;
        const data = seoMap[cat];

        if (data && cat !== 'all') {
            const titleEl = document.getElementById('pageTitle');
            const descEl = document.getElementById('pageDesc');
            
            if (titleEl) {
                titleEl.textContent = data.title;
            } else {
                document.title = data.title;
            }
            
            if (descEl) {
                descEl.setAttribute('content', data.desc);
            } else {
                // 如果没有 meta description 元素，创建一个
                let meta = document.querySelector('meta[name="description"]');
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.name = 'description';
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', data.desc);
            }
        }
    }

    updateHeading() {
        const h1 = document.getElementById('productsHeading');
        if (!h1) return;

        if (this.currentCategory !== 'all') {
            const label = this.getCategoryLabel(this.currentCategory);
            // 如果多语言系统存在，尝试获取翻译
            if (window.multiLang && typeof window.multiLang.translations !== 'undefined') {
                const lang = window.multiLang.getCurrentLanguage();
                const keyMap = {
                    tents: 'category_tents',
                    flags: 'category_flags',
                    displays: 'category_displays',
                    lightbox: 'category_lightbox',
                    inflatable: 'category_inflatable',
                    accessories: 'category_accessories',
                    furniture: 'category_furniture',
                    custom: 'category_custom'
                };
                const key = keyMap[this.currentCategory];
                if (key && window.multiLang.translations[lang] && window.multiLang.translations[lang][key]) {
                    h1.textContent = window.multiLang.translations[lang][key];
                    return;
                }
            }
            h1.textContent = label;
        }
    }

    setupSideFilters() {
        const filterGroups = document.querySelectorAll('.filter-group[data-filter]');

        filterGroups.forEach(group => {
            const type = group.dataset.filter;
            const inputs = group.querySelectorAll('input[type="checkbox"]');

            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    if (input.checked) {
                        this.activeFilters[type].add(input.value);
                    } else {
                        this.activeFilters[type].delete(input.value);
                    }

                    // 重置分页
                    this.currentPage = 1;
                    // B2：更新 URL
                    this.updateURLFromFilters();
                    this.renderProducts();
                });
            });
        });
    }

    setupClearFilters() {
        const btn = document.getElementById('filtersClearBtn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            // category -> all
            const allRadio = document.querySelector('input[name="category"][value="all"]');
            if (allRadio) allRadio.checked = true;
            this.currentCategory = 'all';

            // search -> empty
            const input = document.getElementById('productSearchInput');
            const clearBtn = document.getElementById('productSearchClear');
            if (input) input.value = '';
            this.searchQuery = '';
            if (clearBtn) clearBtn.classList.remove('show');

            // tags -> none
            this.selectedTags.clear();
            document.querySelectorAll('.tag-chip.active').forEach(el => el.classList.remove('active'));

            // 清空左侧筛选
            this.activeFilters.category.clear();
            this.activeFilters.specs.clear();
            document.querySelectorAll('.filter-group[data-filter] input[type="checkbox"]').forEach(input => {
                input.checked = false;
            });
            
            // 重新生成筛选（确保与数据同步）
            this.generateFilters();
            // 重新绑定事件（因为生成了新的 checkbox）
            this.setupSideFilters();

            // 重置分页
            this.currentPage = 1;

            // B2：更新 URL（清空所有参数）
            this.updateURLFromFilters();

            this.updateBreadcrumb('all');
            this.renderProducts();
        });
    }

    updateBreadcrumb(category) {
        const el = document.getElementById('breadcrumbCurrent');
        if (!el) return;

        // 让面包屑 current 跟随当前类目（并利用你现有的 data-translate key）
        const keyMap = {
            all: 'category_all',
            tents: 'category_tents',
            flags: 'category_flags',
            displays: 'category_displays',
            lightbox: 'category_lightbox',
            inflatable: 'category_inflatable',
            accessories: 'category_accessories',
            furniture: 'category_furniture',
            custom: 'category_custom'
        };

        const k = keyMap[category] || 'category_all';
        el.setAttribute('data-translate', k);

        // 如果多语言系统存在，强制刷新一次当前语言文本（避免只改 attribute 不更新文字）
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }

        // C：如果是分类页，更新 SEO 和标题
        if (category !== 'all') {
            this.currentCategory = category; // 确保 currentCategory 同步
            this.updateSEO();
            this.updateHeading();
        }
    }

    collectTopTags(limit = 12) {
        const map = new Map();

        const add = (s) => {
            if (!s) return;
            const key = String(s).trim();
            if (!key) return;
            map.set(key, (map.get(key) || 0) + 1);
        };

        this.products.forEach(p => {
            // 多语言 specs 都算一遍，保证英文/日文/韩文搜索也能命中
            (p.specs || []).forEach(add);
            (p.specsEn || []).forEach(add);
            (p.specsJa || []).forEach(add);
            (p.specsKo || []).forEach(add);
        });

        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([k]) => k);
    }

    setupSort() {
        const select = document.getElementById('productsSort');
        if (!select) return;

        select.addEventListener('change', () => {
            this.sortBy = select.value;
            this.currentPage = 1; // 重置到第一页
            this.renderProducts();
        });
    }

    createProductRow(product) {
        const row = document.createElement('div');
        row.className = 'product-row';

        const name = this.getLocalizedName(product);
        const description = this.getLocalizedDescription(product);
        const specs = this.getLocalizedSpecs(product);

        // image area: if product.grid present, use sprite background; otherwise keep <img>
        const imageIcon = this.getProductIcon(product.category);
        let imageUrl = product.image || '';
        if (imageUrl && !imageUrl.startsWith('images/') && !imageUrl.startsWith('/') && !imageUrl.startsWith('./')) {
            imageUrl = 'images/' + imageUrl;
        }

        let imageHtml = '';
        if (product && product.grid && product.grid.row && product.grid.col && imageUrl) {
            const rowNum = Number(product.grid.row);
            const colNum = Number(product.grid.col);
            const x = (colNum - 1) * 33.333333;
            const y = (rowNum - 1) * 20;
            imageHtml = `<div class="product-row-image"><div class="sprite-thumb" style="background-image:url('${imageUrl}');background-position:${x}% ${y}%;"></div></div>`;
        } else if (imageUrl) {
            const altText = `${product.nameEn || name} / ${product.name || ''}`;
            imageHtml = `<div class="product-row-image"><img src="${imageUrl}" alt="${altText}" onerror="this.src='images/placeholder.png'" /></div>`;
        } else {
            imageHtml = `<div class="product-row-image"><i class=\"fas fa-${imageIcon}\" style=\"font-size:4rem;color:var(--primary-color);display:flex;align-items:center;justify-content:center;height:100%;\"></i></div>`;
        }

        row.innerHTML = `
            ${imageHtml}

            <div class="product-row-info">
                <h3>
                    <a href="product.html?id=${encodeURIComponent(product.id)}" style="text-decoration:none;color:inherit;">
                        ${name}
                    </a>
                </h3>
                <p>${description || ''}</p>
                <div class="product-specs">
                    ${(specs || []).slice(0, 4).map(s => `<span>• ${s}</span>`).join('')}
                </div>
            </div>

            <div class="product-row-actions">
                <button class="btn btn-primary" data-action="quote" data-translate="btn_get_quote">Get Quote</button>
                <button class="btn btn-secondary" data-action="download" data-translate="btn_download">Download</button>
                <button class="btn btn-accent" data-action="cart" data-translate="btn_add_to_cart">Add to Cart</button>
            </div>
        `;

        // actions
        row.querySelector('[data-action="quote"]').onclick = () => {
            // D：先把产品加入购物车，然后打开 RFQ 弹窗
            this.addToCart(product);
            this.openRFQModal();
        };
        row.querySelector('[data-action="download"]').onclick = () => this.openPdfModal(product);
        row.querySelector('[data-action="cart"]').onclick = () => this.addToCart(product);

        return row;
    }

    renderPagination(total, el) {
        if (!el) return;
        const pages = Math.ceil(total / this.pageSize);
        el.innerHTML = '';
        if (pages <= 1) return;

        for (let i = 1; i <= pages; i++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (i === this.currentPage ? ' active' : '');
            btn.textContent = i;
            btn.onclick = () => {
                this.currentPage = i;
                this.renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            el.appendChild(btn);
        }
    }

    openInquiryModal(product) {
        // 统一跳转到首页联系表单，带上产品信息参数
        const productName = product ? (product.nameEn || product.name || '') : '';
        const productModel = product ? (product.model || '') : '';
        const productParam = encodeURIComponent(productModel || productName || '');
        
        // 如果当前页面是 index.html，直接滚动到联系表单
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                // 设置 URL 参数
                if (productParam) {
                    const url = new URL(window.location);
                    url.searchParams.set('product', productParam);
                    url.hash = 'contact';
                    window.history.pushState({}, '', url);
                }
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                // 预填充产品信息到表单
                setTimeout(() => {
                    const productSelect = document.getElementById('product');
                    if (productSelect && productName) {
                        // 尝试匹配现有选项
                        const options = Array.from(productSelect.options);
                        const matchedOption = options.find(opt => 
                            opt.value.toLowerCase().includes(productName.toLowerCase()) ||
                            opt.text.toLowerCase().includes(productName.toLowerCase())
                        );
                        if (matchedOption) {
                            productSelect.value = matchedOption.value;
                        }
                    }
                }, 500);
            } else {
                window.location.href = productParam ? `index.html?product=${productParam}#contact` : 'index.html#contact';
            }
        } else {
            // 其他页面直接跳转到首页联系表单
            window.location.href = productParam ? `index.html?product=${productParam}#contact` : 'index.html#contact';
        }
    }

    openPdfModal(product) {
        // 显示PDF下载模态框（按产品填充对应PDF）
        const modal = document.getElementById('pdfModal');
        if (!modal) return;

        const defaultPdf = '广西伟群帐篷制造有限公司2025改.pdf';
        const productPdf = (product && product.pdf) ? String(product.pdf) : '';
        const href = productPdf || defaultPdf;

        const link = modal.querySelector('#pdfDownloadLink') || modal.querySelector('a[data-translate="btn_download_pdf"]');
        if (link) {
            link.setAttribute('href', href);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        }

        const title = modal.querySelector('#pdfModalTitle');
        if (title) {
            const current = title.textContent || '';
            const base = title.getAttribute('data-base-title') || current;
            if (!title.getAttribute('data-base-title')) title.setAttribute('data-base-title', base);
            const name = (product && this.getLocalizedName) ? this.getLocalizedName(product) : '';
            title.textContent = name ? `${base} - ${name}` : base;
        }

        modal.style.display = 'block';
    }

    addToCart(product) {
        // 调用全局的 addToCart 函数（如果存在）
        if (typeof window.addToCart === 'function') {
            window.addToCart(product.id);
        } else {
            // 备用方案：显示提示
            alert(`已将 ${this.getLocalizedName(product)} 添加到购物车`);
        }
    }

    setupRFQ() {
        const btn = document.getElementById('btnRFQ');
        const modal = document.getElementById('rfqModal');
        const closeBtn = document.getElementById('rfqCloseBtn');
        if (!btn || !modal || !closeBtn) return;

        const close = () => modal.classList.remove('show');
        btn.addEventListener('click', () => {
            this.openRFQModal();
        });
        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        // 动态更新 RFQ 文本（用户输入变化）
        ['rfqName', 'rfqEmail', 'rfqCompany', 'rfqPhone', 'rfqCountry', 'rfqMessage'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.refreshRFQText());
        });

        const copyBtn = document.getElementById('rfqCopyBtn');
        if (copyBtn) copyBtn.addEventListener('click', async () => {
            const text = document.getElementById('rfqText')?.value || '';
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copied') : '';
                setTimeout(() => copyBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copy') : '', 1200);
            } catch {
                // 备用方案：选中文本
                const textarea = document.getElementById('rfqText');
                if (textarea) {
                    textarea.select();
                    document.execCommand('copy');
                    copyBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copied') : '';
                    setTimeout(() => copyBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copy') : '', 1200);
                }
            }
        });

        const csvBtn = document.getElementById('rfqCsvBtn');
        if (csvBtn) csvBtn.addEventListener('click', () => this.downloadRFQCSV());

        const emailBtn = document.getElementById('rfqEmailBtn');
        if (emailBtn) emailBtn.addEventListener('click', (e) => {
            // 让 href 每次都是最新
            emailBtn.href = this.buildMailtoLink();
        });

        // 设置 WhatsApp 和 WeChat
        this.setupWeChatPanel();
        this.setupWhatsApp();
    }

    openRFQModal() {
        const modal = document.getElementById('rfqModal');
        if (!modal) return;

        // 优先用购物车里的商品（最像电商逻辑）；如果购物车为空，则用当前过滤结果的前 N 个当"候选"
        const cartItems = this.getCartItemsSafe(); // [{id, qty}]
        let items = [];

        if (cartItems.length) {
            items = cartItems.map(ci => ({
                product: this.products.find(p => p.id == ci.id),
                qty: ci.qty || 1
            })).filter(x => x.product);
            const hintEl = document.getElementById('rfqHint');
            if (hintEl) hintEl.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_tip_cart_items') : '';
        } else {
            // 无购物车时：用当前筛选结果（最多 6 个），提示用户最好先 Add to Cart
            const filtered = this.getFilteredProductsNow().slice(0, 6);
            items = filtered.map(p => ({ product: p, qty: 1 }));
            const hintEl = document.getElementById('rfqHint');
            if (hintEl) hintEl.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_tip_cart_empty') : '';
        }

        this.rfqItems = items; // 缓存
        this.renderRFQItems();
        this.refreshRFQText();

        modal.classList.add('show');
    }

    renderRFQItems() {
        const wrap = document.getElementById('rfqItems');
        if (!wrap) return;
        wrap.innerHTML = '';

        (this.rfqItems || []).forEach((x, idx) => {
            const p = x.product;
            const name = this.getLocalizedName(p);

            const row = document.createElement('div');
            row.className = 'rfq-item';

            row.innerHTML = `
                <div class="rfq-item-left">
                    <div class="rfq-item-name">${name || ''}</div>
                    <div class="rfq-item-meta">Category: ${p.category || ''} · ID: ${p.id || ''}</div>
                </div>
                <div class="rfq-item-right">
                    <span>Qty</span>
                    <input class="rfq-qty" type="number" min="1" value="${x.qty || 1}" />
                </div>
            `;

            const qtyInput = row.querySelector('.rfq-qty');
            qtyInput.addEventListener('input', () => {
                const v = parseInt(qtyInput.value, 10);
                this.rfqItems[idx].qty = Number.isFinite(v) && v > 0 ? v : 1;
                this.refreshRFQText();
            });

            wrap.appendChild(row);
        });
    }

    refreshRFQText() {
        const name = document.getElementById('rfqName')?.value?.trim() || '';
        const email = document.getElementById('rfqEmail')?.value?.trim() || '';
        const company = document.getElementById('rfqCompany')?.value?.trim() || '';
        const phone = document.getElementById('rfqPhone')?.value?.trim() || '';
        const country = document.getElementById('rfqCountry')?.value?.trim() || '';
        const msg = document.getElementById('rfqMessage')?.value?.trim() || '';

        const params = new URLSearchParams(window.location.search);
        const cat = params.get('cat') || '';
        const spec = params.get('spec') || '';
        const q = params.get('q') ? decodeURIComponent(params.get('q')) : '';

        const lines = [];
        lines.push('RFQ / Request for Quotation');
        lines.push('Preferred contact: WhatsApp or WeChat for faster response.');
        lines.push('------------------------');
        lines.push(`Name: ${name}`);
        lines.push(`Email: ${email}`);
        if (company) lines.push(`Company: ${company}`);
        if (phone) lines.push(`Phone: ${phone}`);
        if (country) lines.push(`Country: ${country}`);
        lines.push('');
        lines.push('Selected items:');
        (this.rfqItems || []).forEach(x => {
            const p = x.product;
            const productName = this.getLocalizedName(p);
            lines.push(`- ${productName} (ID: ${p.id}, Category: ${p.category})  Qty: ${x.qty || 1}`);
        });
        lines.push('');
        lines.push('Filter context (from products page):');
        if (cat) lines.push(`- Categories: ${cat}`);
        if (spec) lines.push(`- Specs/Tags: ${decodeURIComponent(spec)}`);
        if (q) lines.push(`- Search: ${q}`);
        if (!cat && !spec && !q) lines.push('- (none)');
        lines.push('');
        if (msg) {
            lines.push('Requirements / Message:');
            lines.push(msg);
            lines.push('');
        }
        lines.push('Please quote with: unit price, printing options, MOQ, lead time, shipping terms (EXW/FOB/DDP), and sample policy.');
        lines.push('Thanks.');

        const text = lines.join('\n');
        const out = document.getElementById('rfqText');
        if (out) out.value = text;

        // 同步 mailto 和 WhatsApp
        const emailBtn = document.getElementById('rfqEmailBtn');
        if (emailBtn) emailBtn.href = this.buildMailtoLink();

        const waBtn = document.getElementById('rfqWhatsAppBtn');
        if (waBtn) waBtn.href = this.buildWhatsAppLink();
    }

    buildMailtoLink() {
        // 你们接收询价的邮箱：建议你在这里换成公司询价邮箱
        const to = 'a374340761@gmail.com';
        const subject = encodeURIComponent('RFQ - Request a Quote');
        const body = encodeURIComponent(document.getElementById('rfqText')?.value || '');
        return `mailto:${to}?subject=${subject}&body=${body}`;
    }

    downloadRFQCSV() {
        const rows = [];
        rows.push(['Product Name', 'Product ID', 'Category', 'Quantity'].join(','));

        (this.rfqItems || []).forEach(x => {
            const p = x.product;
            const safe = (s) => `"${String(s ?? '').replaceAll('"', '""')}"`;
            const productName = this.getLocalizedName(p);
            rows.push([safe(productName), safe(p.id), safe(p.category), safe(x.qty || 1)].join(','));
        });

        const csv = rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'RFQ_items.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    // 读购物车（兼容你已有 cart.js，不存在就返回空）
    getCartItemsSafe() {
        try {
            const raw = localStorage.getItem('cart');
            if (!raw) return [];
            const arr = JSON.parse(raw);
            // 兼容两种结构：[{id,qty}] 或 [{productId,quantity}]
            return (arr || []).map(x => ({
                id: x.id ?? x.productId,
                qty: x.qty ?? x.quantity ?? 1
            })).filter(x => x.id);
        } catch {
            return [];
        }
    }

    // 拿到"当前筛选后的产品列表"（用你 renderProducts 的同一套条件）
    getFilteredProductsNow() {
        // 这里复用你现有的过滤逻辑（category + activeFilters + searchQuery）
        const q = (this.searchQuery || '').toLowerCase();

        return this.products.filter(product => {
            if (this.currentCategory !== 'all' && product.category !== this.currentCategory) return false;

            if (this.activeFilters?.category?.size > 0 &&
                !this.activeFilters.category.has(product.category)) return false;

            if (this.activeFilters?.specs?.size > 0) {
                const currentSpecs = this.getLocalizedSpecs(product);
                const currentDesc = this.getLocalizedDescription(product);
                const searchText = (currentSpecs.join(' ') + ' ' + currentDesc).toLowerCase();
                let matched = false;

                this.activeFilters.specs.forEach(val => {
                    if (searchText.includes(String(val).toLowerCase())) matched = true;
                });

                if (!matched) return false;
            }

            if (q) {
                const hay = [
                    product.name, product.description,
                    product.nameEn, product.descriptionEn,
                    product.nameJa, product.descriptionJa,
                    product.nameKo, product.descriptionKo,
                    ...(product.specs || []),
                    ...(product.specsEn || []),
                    ...(product.specsJa || []),
                    ...(product.specsKo || [])
                ].filter(Boolean).join(' ').toLowerCase();
                if (!hay.includes(q)) return false;
            }

            return true;
        });
    }

    setupWhatsApp() {
        const waBtn = document.getElementById('rfqWhatsAppBtn');
        if (!waBtn) return;

        // ===== WhatsApp number (international, digits only) =====
        this.whatsAppNumber = '8613824540280';   // 唯一 WhatsApp 号码

        // 点击前动态刷新链接（保证内容最新）
        waBtn.addEventListener('click', () => {
            waBtn.href = this.buildWhatsAppLink();
        });

        // 初始化一次
        waBtn.href = this.buildWhatsAppLink();
    }

    buildWhatsAppLink() {
        const text = document.getElementById('rfqText')?.value || '';

        const footer = `
--------------------------------
Contact:
WhatsApp: +86 138 2454 0280
WeChat: massifmyth
`;

        const msg = encodeURIComponent(text + footer);
        const num = this.whatsAppNumber;

        return `https://wa.me/${num}?text=${msg}`;
    }

    setupWeChatPanel() {
        const btn = document.getElementById('rfqWeChatBtn');
        const panel = document.getElementById('wechatPanel');
        const closeBtn = document.getElementById('wechatCloseBtn');
        const copyIdBtn = document.getElementById('wechatCopyIdBtn');
        const idText = document.getElementById('wechatIdText');
        if (!btn || !panel) return;

        btn.addEventListener('click', () => {
            panel.classList.toggle('show');
        });

        if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('show'));

        if (copyIdBtn && idText) {
            copyIdBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(idText.textContent.trim());
                    copyIdBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copied') : '';
                    setTimeout(() => copyIdBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copy_wechat_id') : '', 1200);
                } catch {
                    // 备用方案
                    const textarea = document.createElement('textarea');
                    textarea.value = idText.textContent.trim();
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    copyIdBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copied') : '';
                    setTimeout(() => copyIdBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('ui_copy_wechat_id') : '', 1200);
                }
            });
        }
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const name = this.getLocalizedName(product);
        const description = this.getLocalizedDescription(product);
        const specs = this.getLocalizedSpecs(product);
        
        // 创建产品详情模态框
        const modal = document.createElement('div');
        modal.className = 'modal product-modal';
        modal.innerHTML = `
            <div class="modal-content product-modal-content">
                <span class="close">&times;</span>
                <div class="product-modal-header">
                    <h3>${name}</h3>
                    <div class="product-price">${product.price}</div>
                </div>
                <div class="product-modal-body">
                    <div class="product-modal-image">
                        <i class="fas fa-${this.getProductIcon(product.category)}"></i>
                    </div>
                    <div class="product-modal-info">
                        <p>${description}</p>
                        <h4>技术规格</h4>
                        <div class="product-specs">
                            ${specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
                        </div>
                        <h4>应用场景</h4>
                        <ul class="application-list">
                            ${this.getApplicationScenarios(product.category).map(scenario => `<li>${scenario}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="product-modal-footer">
                    <button class="btn btn-accent" onclick="window.addToCart(${product.id}); window.productManager.closeProductModal();">
                        <i class="fas fa-shopping-cart"></i> 加入购物车
                    </button>
                    <button class="btn btn-primary" onclick="window.productManager.downloadProductInfo(${product.id})">
                        <i class="fas fa-download"></i> 下载详细资料
                    </button>
                    <button class="btn btn-secondary" onclick="window.productManager.contactForQuote(${product.id})">
                        <i class="fas fa-envelope"></i> 获取报价
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // 添加关闭功能
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProductModal();
            }
        });
    }
    
    closeProductModal() {
        const modal = document.querySelector('.product-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    getApplicationScenarios(category) {
        const scenarios = {
            furniture: ['户外活动', '野餐聚会', '商务会议', '展览展示'],
            tents: ['品牌推广', '活动庆典', '展览展示', '户外活动'],
            flags: ['广告宣传', '品牌展示', '活动标识', '户外广告'],
            custom: ['定制需求', '特殊活动', '品牌定制', '个性化服务']
        };
        return scenarios[category] || [];
    }
    
    downloadProductInfo(productId) {
        // 显示PDF下载模态框
        const modal = document.getElementById('pdfModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    contactForQuote(productId) {
        // 滚动到联系表单
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // 预填充产品信息到表单
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const messageField = document.querySelector('textarea[data-translate-placeholder="form_message"]');
            if (messageField) {
                messageField.value = `我想了解${product.name}的详细报价信息。`;
            }
        }
    }
}

// 产品模态框样式
const productModalStyles = `
    .product-modal-content {
        max-width: 800px;
        width: 90%;
    }
    
    .product-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .product-modal-header h3 {
        margin: 0;
        color: var(--primary-color);
    }
    
    .product-modal-body {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .product-modal-image {
        background: var(--secondary-color);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
    }
    
    .product-modal-image i {
        font-size: 4rem;
        color: var(--primary-color);
    }
    
    .product-modal-info h4 {
        color: var(--primary-color);
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .product-modal-info h4:first-child {
        margin-top: 0;
    }
    
    .application-list {
        list-style: none;
        padding: 0;
    }
    
    .application-list li {
        padding: 0.25rem 0;
        color: var(--text-light);
        position: relative;
        padding-left: 1.5rem;
    }
    
    .application-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }
    
    .product-modal-footer {
        display: flex;
        gap: 1rem;
        justify-content: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .product-btn {
        margin: 0.25rem;
    }
    
    @media (max-width: 768px) {
        .product-modal-body {
            grid-template-columns: 1fr;
        }
        
        .product-modal-footer {
            flex-direction: column;
        }
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = productModalStyles;
document.head.appendChild(styleSheet);

// 初始化产品管理器
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();

    // Global helper: pick the best image for cards/listings.
    // - Racegate: use the uploaded hero.png in its named folder.
    // - Accessories: if it is a sprite-mapped item, use the extracted per-item image (page_4_img_N.png).
    // - Fallback: product.image or first of product.images.
    window.WK_getProductCardImage = function(product) {
        const p = product || {};

        // Racegate hero images (avoid showing PDF sprites in cards)
        if (String(p.category || '') === 'racegate') {
            const t = String(p.type || '').toLowerCase();
            const folderMap = {
                o: 'O Race Gate',
                v: 'V Race Gate',
                semi: 'Semi-circle Race Gate'
            };
            const folder = folderMap[t];
            if (folder) {
                return encodeURI(`images/products/racegate/${folder}/hero.png`);
            }
        }

        // Accessories: convert sprite grid position -> extracted single image file
        if (String(p.category || '') === 'accessories' && p.grid && p.grid.row && p.grid.col) {
            const row = Number(p.grid.row);
            const col = Number(p.grid.col);
            if (Number.isFinite(row) && Number.isFinite(col) && row >= 1 && col >= 1) {
                const idx = (row - 1) * 4 + col;
                // These files exist under images/products/accessories/tent-accessories1/
                return `images/products/accessories/tent-accessories1/page_4_img_${idx}.png`;
            }
        }

        const raw = p.image || (Array.isArray(p.images) ? p.images[0] : '') || '';
        return raw ? encodeURI(String(raw)) : '';
    };
});
