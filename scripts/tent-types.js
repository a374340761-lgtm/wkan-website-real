// Tent Types Hub data (source PDF only)
// PDF: 广西伟群帐篷制造有限公司2025改.pdf
// - Page 5: Folding tent series (30/40/50)
// - Page 6: Event tents (Star / Awning / Six-sided)
// Global export: window.TENT_TYPES
(function () {
    'use strict';

    // NOTE:
    // - Page 5 has extractable text for sizes/weights and WK-T30/40/50 model series.
    // - Page 6 appears image-based in this PDF build; OCR is blocked on this Windows environment.
    //   Keep TODO markers where the page-6 text cannot be reliably extracted.

    window.TENT_TYPES = {
        // Shared details (apply to all tents)
        common: {
            // Source: brochure page 6 (image-based). Text transcribed earlier in this repo.
            connectionMethodEn: [
                'Connection method:',
                '• The interposer type connection method, the accessories is finished in galvanized steel.',
                '• Frame material, heavy-duty aluminum profile, with oxidation finished.',
                '• Polyester, water proof and fire proof with UV resistance, 1 side PU coating.',
                '',
                '300D 400D 600D 900D oxford fabric',
                'with PU coating',
                'UV protected',
                '',
                'Water proof',
                'Fire retardant (DIN4102-1_B2&CPAI-84)'
            ].join('\n'),
            connectionMethodZh: [
                '连接方式：',
                '• 插接式连接方式，配件为镀锌钢材。',
                '• 框架材质：加厚铝型材，表面氧化处理。',
                '• 面料：涤纶，防水阻燃，抗UV，单面PU涂层。',
                '',
                '300D / 400D / 600D / 900D 牛津布',
                'PU 涂层',
                'UV 防护',
                '',
                '防水',
                '阻燃（DIN4102-1.B2 & CPAI-84）'
            ].join('\n'),
            // Visual references (from brochure renders)
            visuals: {
                // These are full rendered pages from the brochure.
                // If you want tighter crops later, replace these with cropped images.
                sizeGuideImage: 'images/products/tents/_reference/pdf_p9.png',
                wallGuideImage: 'images/products/tents/_reference/pdf_p10.png'
            }
        },
        folding: [
            {
                type: 'folding30',
                seriesCode: 'WK-T30',
                nameZh: '30 方管铁架',
                nameEn: '30 Square Tube Iron Frame',
                hubDescZh: '高性价比折叠帐篷，适合促销与展会。',
                hubDescEn: 'Cost-effective folding tent for promotions and exhibitions.',
                storyZh: [
                    '适用于展会、促销、赛事与户外活动的高性价比折叠帐篷。',
                    '结构稳固，搭建快速，支持顶布/围布全方位品牌印刷。',
                    '可选多种尺寸与配件，满足短期活动与租赁场景。'
                ].join('\n'),
                storyEn: [
                    'A cost-effective folding tent for exhibitions, promotions, sports and outdoor events.',
                    'Fast setup with a stable structure, supporting full branding on canopy and sidewalls.',
                    'Multiple sizes and accessories available for short-term events and rental use.'
                ].join('\n'),
                descriptionZh: [
                    '常规尺寸：1.5×1.5M / 2×2M / 2×3M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M',
                    '参考重量：13KG / 15KG / 19KG / 16.5KG / 21KG / 27KG / 36KG'
                ].join('\n'),
                descriptionEn: [
                    'Sizes: 1.5×1.5M / 2×2M / 2×3M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M',
                    'Weights: 13KG / 15KG / 19KG / 16.5KG / 21KG / 27KG / 36KG'
                ].join('\n'),
                // Model/spec table for the View Type panel
                models: [
                    { model: 'WK-T30I', size: '1.5 × 1.5 M', weight: '13 KG' },
                    { model: 'WK-T30H', size: '2 × 2 M', weight: '15 KG' },
                    { model: 'WK-T30A', size: '2 × 3 M', weight: '19 KG' },
                    { model: 'WK-T30B', size: '2.5 × 2.5 M', weight: '16.5 KG' },
                    { model: 'WK-T30C', size: '3 × 3 M', weight: '21 KG' },
                    { model: 'WK-T30D', size: '3 × 4.5 M', weight: '27 KG' },
                    { model: 'WK-T30E', size: '3 × 6 M', weight: '36 KG' }
                ],
                materialEn: 'Iron',
                materialZh: '铁',
                accessoriesImages: [
                    'images/products/accessories/tent-accessories.png'
                ],
                guideImages: [
                    'images/products/tents/_reference/pdf_p5.png'
                ],
                heroImage: 'images/products/tents/folding30/hero.png',
                pdfPage: 5
            },
            {
                type: 'folding40',
                seriesCode: 'WK-T40',
                nameZh: '40 六角铝合金架',
                nameEn: '40 Hexagon Aluminum Frame',
                hubDescZh: '轻便耐用铝合金折叠帐篷，适合高频使用。',
                hubDescEn: 'Lightweight aluminum folding tent for frequent use.',
                storyZh: [
                    '铝合金框架更轻便耐用，适合频繁搭建与移动使用。',
                    '六角结构提升稳定性与抗风性能，适合品牌活动与户外推广。',
                    '支持多规格尺寸与配件组合，满足不同场地需求。'
                ].join('\n'),
                storyEn: [
                    'A lightweight and durable aluminum-frame folding tent for frequent setup and transport.',
                    'Hexagon frame structure improves stability and wind resistance for outdoor promotions.',
                    'Available in multiple sizes with accessory options to fit different venues.'
                ].join('\n'),
                descriptionZh: [
                    '常规尺寸：1.5×1.5M / 2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    '参考重量：12.5KG / 13KG / 16KG / 17KG / 20KG / 20.5KG / 26KG / 28KG / 33KG'
                ].join('\n'),
                descriptionEn: [
                    'Sizes: 1.5×1.5M / 2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    'Weights: 12.5KG / 13KG / 16KG / 17KG / 20KG / 20.5KG / 26KG / 28KG / 33KG'
                ].join('\n'),
                models: [
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
                materialEn: 'Aluminum',
                materialZh: '铝合金',
                accessoriesImages: [
                    'images/products/accessories/tent-accessories.png'
                ],
                guideImages: [
                    'images/products/tents/_reference/pdf_p5.png'
                ],
                heroImage: 'images/products/tents/folding40/hero.png',
                pdfPage: 5
            },
            {
                type: 'folding50',
                seriesCode: 'WK-T50',
                nameZh: '50 六角铝合金架',
                nameEn: '50 Hexagon Aluminum Frame',
                hubDescZh: '加厚铝合金重型折叠帐篷，适合大型活动。',
                hubDescEn: 'Heavy-duty aluminum folding tent for larger events.',
                storyZh: [
                    '更强承重与更大跨度的铝合金框架，适用于大型活动与高频使用。',
                    '适合更大尺寸组合，满足赛事、展会与商业推广的遮阳与展示需求。',
                    '支持定制印刷与配件扩展，打造完整品牌展示空间。'
                ].join('\n'),
                storyEn: [
                    'A heavy-duty aluminum frame designed for larger spans and frequent use.',
                    'Ideal for bigger event sizes, providing shade and branding visibility for promotions and exhibitions.',
                    'Supports custom printing and accessory upgrades for a complete branded setup.'
                ].join('\n'),
                descriptionZh: [
                    '常规尺寸：2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    '参考重量：20KG / 22KG / 29KG / 36KG / 40KG / 51KG / 55KG / 67KG'
                ].join('\n'),
                descriptionEn: [
                    'Sizes: 2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    'Weights: 20KG / 22KG / 29KG / 36KG / 40KG / 51KG / 55KG / 67KG'
                ].join('\n'),
                models: [
                    { model: 'WK-T50H', size: '2 × 2 M', weight: '20 KG' },
                    { model: 'WK-T50A', size: '2.5 × 2.5 M', weight: '22 KG' },
                    { model: 'WK-T50B', size: '3 × 3 M', weight: '29 KG' },
                    { model: 'WK-T50C', size: '3 × 4.5 M', weight: '40 KG' },
                    { model: 'WK-T50D', size: '3 × 6 M', weight: '55 KG' },
                    { model: 'WK-T50E', size: '4 × 4 M', weight: '36 KG' },
                    { model: 'WK-T50F', size: '4 × 6 M', weight: '51 KG' },
                    { model: 'WK-T50G', size: '4 × 8 M', weight: '67 KG' }
                ],
                materialEn: 'Aluminum',
                materialZh: '铝合金',
                accessoriesImages: [
                    'images/products/accessories/tent-accessories.png'
                ],
                guideImages: [
                    'images/products/tents/_reference/pdf_p5.png'
                ],
                heroImage: 'images/products/tents/folding50/hero.png',
                pdfPage: 5
            }
        ],
        event: [
            {
                // Star Tent - Kind 1 (per screenshot)
                type: 'star_1',
                nameZh: '星星帐篷（款式1）',
                nameEn: 'Star Tent (Type 1)',
                hubDescZh: '醒目造型，适合节庆活动与品牌快闪。',
                hubDescEn: 'Eye-catching shape for festivals and brand pop-ups.',
                storyZh: [
                    '适用于节庆活动、广场推广与品牌快闪的高辨识度星形帐篷。',
                    '造型醒目，适合做主舞台、接待区或促销展示空间。',
                    '可选多种尺寸与材质组合，满足不同场地与预算。'
                ].join('\n'),
                storyEn: [
                    'A high-visibility star-shaped tent for festivals, plaza promotions and brand pop-ups.',
                    'Eye-catching silhouette for stage areas, reception zones or promotional booths.',
                    'Multiple sizes and material options available for different venues and budgets.'
                ].join('\n'),
                specTable: {
                    columns: [
                        { key: 'model', labelZh: '型号', labelEn: 'Model' },
                        { key: 'material', labelZh: '材质', labelEn: 'Material' },
                        { key: 'dimension', labelZh: '尺寸', labelEn: 'Dimension' },
                        { key: 'topHeight', labelZh: '顶高', labelEn: 'Top height' },
                        { key: 'doorHeight', labelZh: '门高', labelEn: 'Door height' },
                        { key: 'a', labelZh: 'A', labelEn: 'A' }
                    ],
                    rows: [
                        { model: 'AD-T10A', material: 'Steel/Aluminum', dimension: 'φ8m', topHeight: '5m', doorHeight: '2.2m', a: '4m' },
                        { model: 'AD-T10B', material: 'Steel/Aluminum', dimension: 'φ10m', topHeight: '5m', doorHeight: '2.2m', a: '5m' },
                        { model: 'AD-T10C', material: 'Steel/Aluminum', dimension: 'φ12m', topHeight: '5m', doorHeight: '2.2m', a: '6m' },
                        { model: 'AD-T10D', material: 'Steel/Aluminum', dimension: 'φ14m', topHeight: '6m', doorHeight: '2.2m', a: '7m' },
                        { model: 'AD-T10E', material: 'Steel/Aluminum', dimension: 'φ15m', topHeight: '6m', doorHeight: '2.2m', a: '8m' }
                    ]
                },
                // TODO(PDF p6): Page 6 text is image-based; OCR blocked. Verify/replace with exact text from page 6.
                descriptionZh: '防水阻燃',
                // Keep description concise here; shared connection method is rendered in the View Type detail panel.
                descriptionEn: 'Waterproof & fire retardant',
                heroImage: 'images/products/tents/star/startenttype1hero.png',
                accessoriesImages: [
                    'images/products/tents/star/startentaccessories.png',
                    'images/products/accessories/tent-accessories.png'
                ],
                guideImages: [
                    'images/products/tents/_reference/pdf_p6.png'
                ],
                pdfPage: 6
            },
            {
                // Star Tent - Kind 2 (per screenshot)
                type: 'star_2',
                nameZh: '星星帐篷（款式2）',
                nameEn: 'Star Tent (Type 2)',
                hubDescZh: '连体组合空间方案，扩展展示与接待面积。',
                hubDescEn: 'Connected-space star tent for larger usable area.',
                storyZh: [
                    '更适合做连体/组合式空间的星形帐篷方案，扩展展示与接待面积。',
                    '适用于大型活动、展会入口、品牌体验区等场景。',
                    '支持印刷与配件搭配，打造统一的品牌视觉。'
                ].join('\n'),
                storyEn: [
                    'A star tent solution designed for connected/combined spaces to expand usable area.',
                    'Great for large events, exhibition entrances and brand experience zones.',
                    'Supports printing and accessory options for a unified branded look.'
                ].join('\n'),
                specTable: {
                    columns: [
                        { key: 'model', labelZh: '型号', labelEn: 'Model' },
                        { key: 'material', labelZh: '材质', labelEn: 'Material' },
                        { key: 'dimension', labelZh: '尺寸', labelEn: 'Dimension' },
                        { key: 'topHeight', labelZh: '顶高', labelEn: 'Top height' },
                        { key: 'doorHeight', labelZh: '门高', labelEn: 'Door height' },
                        { key: 'w', labelZh: '宽', labelEn: 'W' },
                        { key: 'l', labelZh: '长', labelEn: 'L' },
                        { key: 'centerDistance', labelZh: '中心距', labelEn: 'centerdistance' }
                    ],
                    rows: [
                        { model: 'AD-T11A', material: 'Steel/Aluminum', dimension: 'φ8m×12m', topHeight: '5m', doorHeight: '2.2m', w: '8m', l: '4m', centerDistance: '4m' },
                        { model: 'AD-T11B', material: 'Steel/Aluminum', dimension: 'φ10m×14m', topHeight: '5m', doorHeight: '2.2m', w: '9m', l: '5m', centerDistance: '4m' },
                        { model: 'AD-T11C', material: 'Steel/Aluminum', dimension: 'φ12m×17m', topHeight: '5m', doorHeight: '2.2m', w: '11m', l: '6m', centerDistance: '5m' },
                        { model: 'AD-T11D', material: 'Steel/Aluminum', dimension: 'φ14m×19m', topHeight: '6m', doorHeight: '2.2m', w: '12m', l: '7m', centerDistance: '5m' },
                        { model: 'AD-T11E', material: 'Steel/Aluminum', dimension: 'φ16m×21m', topHeight: '6m', doorHeight: '2.2m', w: '13m', l: '8m', centerDistance: '5m' }
                    ]
                },
                descriptionZh: '防水阻燃',
                descriptionEn: 'Waterproof & fire retardant',
                heroImage: 'images/products/tents/star/startenttype2hero.png',
                accessoriesImages: [
                    'images/products/tents/star/startentaccessories.png',
                    'images/products/accessories/tent-accessories.png'
                ],
                guideImages: [
                    'images/products/tents/_reference/pdf_p6.png'
                ],
                pdfPage: 6
            },
            {
                type: 'awning',
                nameZh: '天幕帐篷',
                nameEn: 'Awning Tent',
                hubDescZh: '开放式遮阳天幕，适合集市与路演活动。',
                hubDescEn: 'Open awning canopy for markets and roadshows.',
                storyZh: [
                    '适用于户外集市、露营活动与品牌路演的开放式遮阳天幕。',
                    '空间开阔，便于人流进出与展示陈列。',
                    '可根据场地选择不同尺寸，兼顾遮阳与视觉展示。'
                ].join('\n'),
                storyEn: [
                    'An open, spacious awning tent ideal for outdoor markets, camping events and roadshows.',
                    'Easy access for visitors and convenient for product display and interaction.',
                    'Available in multiple sizes to balance shade coverage and branding visibility.'
                ].join('\n'),
                specTable: {
                    columns: [
                        { key: 'model', labelZh: '型号', labelEn: 'Model' },
                        { key: 'material', labelZh: '材质', labelEn: 'Material' },
                        { key: 'dimension', labelZh: '尺寸', labelEn: 'Dimension' },
                        { key: 'cartonSize', labelZh: '外箱尺寸', labelEn: 'Carton Size' },
                        { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
                    ],
                    rows: [
                        { model: 'AD-T12A', material: 'Steel', dimension: '3m×3m', cartonSize: '26.5×36.5×160CM', weight: '30KG' },
                        { model: 'AD-T12B', material: 'Steel', dimension: '4m×4m', cartonSize: '30×45×130CM', weight: '50KG' },
                        { model: 'AD-T12C', material: 'Steel', dimension: '5m×5m', cartonSize: '43×60×125CM', weight: '65KG' },
                        { model: 'AD-T12D', material: 'Steel', dimension: '6m×6m', cartonSize: '50*70*130CM', weight: '85KG' }
                    ]
                },
                descriptionZh: '防水阻燃',
                descriptionEn: 'Waterproof & fire retardant',
                heroImage: 'images/products/tents/awning/hero.png',
                accessoriesImages: [
                    'images/products/tents/star/startentaccessories.png',
                    'images/products/accessories/tent-accessories.png'
                ],
                guideImages: [
                    'images/products/tents/_reference/pdf_p6.png'
                ],
                pdfPage: 6
            },
            {
                type: 'six_sided',
                nameZh: '六边帐篷',
                nameEn: 'Six-sided Tent',
                hubDescZh: '六边促销展示台，适合派发与商超促销。',
                hubDescEn: 'Six-sided promo booth for sampling and retail.',
                storyZh: [
                    '六边促销展示台方案，适用于商超促销、活动派发与户外展示。',
                    '结构稳定，搭配展示台面，便于陈列与互动。',
                    '可作为品牌主视觉点位，提升现场吸引力与识别度。'
                ].join('\n'),
                storyEn: [
                    'A six-sided promotional booth solution for retail promotions, sampling and outdoor displays.',
                    'Stable structure with a counter-style setup for product showcase and interaction.',
                    'Works as a strong focal point to increase visibility and brand recognition on-site.'
                ].join('\n'),
                specTable: {
                    columns: [
                        { key: 'model', labelZh: '型号', labelEn: 'Model' },
                        { key: 'name', labelZh: '名称', labelEn: 'Name' },
                        { key: 'material', labelZh: '材质', labelEn: 'Material' },
                        { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
                        { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
                    ],
                    rows: [
                        { model: 'WK-T80A', name: 'Six-sided Tent', material: 'iron', size: '3*3M', weight: '60KG' },
                        { model: 'WK-T80B', name: 'Six-sided Tent', material: 'iron', size: '3*3M', weight: '60KG' },
                        { model: 'WK-T80C', name: 'Six-sided Tent', material: 'iron', size: '3*3M', weight: '60KG' }
                    ]
                },
                descriptionZh: '六边促销展示台帐篷（更多细节后续补充）',
                descriptionEn: 'Six-sided promotional booth tent (more details coming soon)',
                links: [
                    { href: 'six-sided-booth.html', labelZh: '查看详情页', labelEn: 'View product page' }
                ],
                guideImages: [
                    'images/products/tents/_reference/pdf_p6.png'
                ],
                heroImage: 'images/products/tents/six-sided/hero.png',
                pdfPage: 6
            }
        ],

        // New tent series: Inflatable Tent (source: images/products/tents/_reference/pdf_p8.png)
        // UX: One "Inflatable Tent" type with internal AirTent size selection.
        inflatable: (function () {
            const commonBlocks = {
                accessories: {
                    titleZh: '充气帐篷配件',
                    titleEn: 'Inflatable Tent Accessories',
                    textZh: [
                        '打气泵 & 工具：',
                        '• 电动打气筒（AD-T4）',
                        '• 手动气筒（AD-T5）',
                        '• 蓄电打气筒（AD-T6）',
                        '',
                        '固定 & 锚固：',
                        '• 螺旋地钉（AD-T7）',
                        '• 绳子 + 地钉（AD-T8）',
                        '• 沙袋（AD-T9）',
                        '',
                        '收纳包：',
                        '• 手提袋（AD-T1）',
                        '• 防水袋（AD-T2）',
                        '• 背包（AD-T3）'
                    ].join('\n'),
                    textEn: [
                        'Pumps & Tools',
                        '• Electric Pump (Model: AD-T4)',
                        '• Hand Pump (Model: AD-T5)',
                        '• Rechargeable Electric Pump (Model: AD-T6)',
                        '',
                        'Fixing & Anchoring',
                        '• Ground Screw Peg (Model: AD-T7)',
                        '• Rope + Ground Peg (Model: AD-T8)',
                        '• Sand Bag (Model: AD-T9)',
                        '',
                        'Bags',
                        '• Carry Bag (Model: AD-T1)',
                        '• Waterproof Bag (Model: AD-T2)',
                        '• Backpack (Model: AD-T3)'
                    ].join('\n')
                },
                walls: {
                    titleZh: '充气帐篷围布 / 连接件',
                    titleEn: 'Inflatable Tent Walls & Connectors',
                    textZh: [
                        '围布：',
                        '• 充气帐篷围布（AD-T27A）',
                        '• 充气帐篷门（AD-T28A）',
                        '• 充气带窗帐篷围布（AD-T29A）',
                        '',
                        '连接 & 遮盖：',
                        '• 隧道连接（AD-T31A）',
                        '• 遮阳挡 / 遮阳棚（AD-T32A）'
                    ].join('\n'),
                    textEn: [
                        'Side Walls',
                        '• Wall for Inflatable Tent (Model: AD-T27A)',
                        '• Door for Inflatable Tent (Model: AD-T28A)',
                        '• Wall with Window for Inflatable Tent (Model: AD-T29A)',
                        '',
                        'Connections & Covers',
                        '• Tunnel Connection (Model: AD-T31A)',
                        '• Sun Block / Canopy Cover (Model: AD-T32A)'
                    ].join('\n')
                },
                variants: {
                    titleZh: '充气帐篷结构款式',
                    titleEn: 'Inflatable Tent Structures & Variants',
                    textZh: [
                        '• LED 充气帐篷（AD-T18A）',
                        '• 外置门帐篷（AD-T19A）',
                        '• 四边门外置帐篷（AD-T21A）'
                    ].join('\n'),
                    textEn: [
                        '• LED Inflatable Tent (Model: AD-T18A)',
                        '• Outside Door Inflatable Tent (Model: AD-T19A)',
                        '• Four-Leg Outside Door Inflatable Tent (Model: AD-T21A)'
                    ].join('\n')
                },
                multi: {
                    titleZh: '多联充气帐篷',
                    titleEn: 'Multi-Unit Inflatable Tents',
                    textZh: [
                        '• 双排连体（AD-T22A）',
                        '• 单排连体（AD-T23A）'
                    ].join('\n'),
                    textEn: [
                        '• Double Row Inflatable Tent (Model: AD-T22A)',
                        '• Single Row Inflatable Tent (Model: AD-T23A)'
                    ].join('\n')
                },
                fabric: {
                    titleZh: '面料与性能',
                    titleEn: 'Fabric & Performance Information',
                    textZh: [
                        '面料：300D / 400D / 600D / 900D 牛津布',
                        '涂层：PU 涂层',
                        '',
                        '特性：',
                        '• 防紫外线（UV Protected）',
                        '• 防水（Waterproof）',
                        '• 阻燃（Fire Retardant）',
                        '',
                        '标准：DIN4102-1, B2 & CPAI-84'
                    ].join('\n'),
                    textEn: [
                        'Fabric: 300D / 400D / 600D / 900D Oxford Fabric',
                        'Coating: PU Coating',
                        '',
                        'Features:',
                        '• UV Protected',
                        '• Waterproof',
                        '• Fire Retardant',
                        '',
                        'Standard: DIN4102-1, B2 & CPAI-84'
                    ].join('\n')
                }
            };

            const base = {
                hubDescZh: '快速充气搭建，适合活动与品牌展示。',
                hubDescEn: 'Fast inflatable setup for events and branding.',
                storyZh: [
                    '充气帐篷系列：便携、快速搭建，适用于活动推广、展会展示与品牌快闪。',
                    '支持围布、连接件、灯光与多联组合，打造完整的品牌空间。'
                ].join('\n'),
                storyEn: [
                    'Inflatable tent series: portable and fast to set up for promotions, exhibitions and brand activations.',
                    'Supports walls, connectors, LED options and multi-unit combinations to build a complete branded space.'
                ].join('\n'),
                heroImage: 'images/products/tents/inflatable/hero.jpg',
                guideImages: ['images/products/tents/_reference/pdf_p8.png'],
                pdfPage: 8,
                infoBlocks: [
                    commonBlocks.accessories,
                    commonBlocks.walls,
                    commonBlocks.variants,
                    commonBlocks.multi,
                    commonBlocks.fabric
                ]
            };

            const variants = [
                {
                    key: 'airt_9',
                    labelZh: 'AirTent 9㎡',
                    labelEn: 'AirTent 9 sqm',
                    spec: {
                        model: 'AD-T13A',
                        material: 'TPU / Polyester',
                        size: '3 × 3 × 2.4 m',
                        carton: '92 × 32 × 32 cm',
                        weight: '16 kg'
                    }
                },
                {
                    key: 'airt_16',
                    labelZh: 'AirTent 16㎡',
                    labelEn: 'AirTent 16 sqm',
                    spec: {
                        model: 'AD-T14A',
                        material: 'TPU / Polyester',
                        size: '4 × 4 × 3 m',
                        carton: '92 × 42 × 42 cm',
                        weight: '24 kg'
                    }
                },
                {
                    key: 'airt_25',
                    labelZh: 'AirTent 25㎡',
                    labelEn: 'AirTent 25 sqm',
                    spec: {
                        model: 'AD-T15A',
                        material: 'TPU / Polyester',
                        size: '5 × 5 × 3.4 m',
                        carton: '92 × 52 × 52 cm',
                        weight: '33 kg'
                    }
                },
                {
                    key: 'airt_36',
                    labelZh: 'AirTent 36㎡',
                    labelEn: 'AirTent 36 sqm',
                    spec: {
                        model: 'AD-T16A',
                        material: 'TPU / Polyester',
                        size: '6 × 6 × 4.25 m',
                        carton: '92 × 62 × 53 cm',
                        weight: '43 kg'
                    }
                },
                {
                    key: 'airt_64',
                    labelZh: 'AirTent 64㎡',
                    labelEn: 'AirTent 64 sqm',
                    spec: {
                        model: 'AD-T17A',
                        material: 'TPU / Polyester',
                        size: '8 × 8 × 4.5 m',
                        carton: '92 × 82 × 82 cm',
                        weight: '55 kg'
                    }
                }
            ];

            return [
                Object.assign({}, base, {
                    type: 'inflatable',
                    nameZh: '充气帐篷',
                    nameEn: 'Inflatable Tent',
                    // Default selection on the View Type page when no variant is specified.
                    defaultVariant: 'airt_16',
                    variants
                })
            ];
        })()
    };
})();
