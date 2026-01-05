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
            {
                id: 1,
                category: 'tents',
                name: '帐篷',
                        id: 2001,
                        category: 'tents',
                        type: 'stock',
                        name: '30方管铁架帐篷',
                        nameEn: '30 Square Tube Iron Frame Tent',
                        nameZh: '30方管铁架帐篷',
                        shortEn: 'Durable 30 square tube iron frame tent; waterproof and fire-retardant.',
                        shortZh: '30方管铁架，防水阻燃，适合短期活动与租赁。',
                        image: 'images/products/tents/30square-tube-frame-iron.png',
                        gallery: [
                            'images/products/tents/30square-tube-frame-iron.png',
                            'images/products/tents/30square-tube-frame-iron-authenticaccessories.png',
                            'images/products/tents/waterproof-fire-proof.png',
                            'images/products/tents/frame-iron-30-square.png'
                        ],
                        options: {
                            frameMaterial: { value: 'iron', detailEn: '30 square tube iron frame — robust and economical.', detailZh: '30方管铁架 — 结实且经济' },
                            fabric: [ { value: '300D', labelEn: '300D', labelZh: '300D' }, { value: '600D', labelEn: '600D', labelZh: '600D' } ],
                            printing: [ { value: 'printed', labelEn: 'Printed', labelZh: '印刷' }, { value: 'plain', labelEn: 'Plain', labelZh: '无印' } ]
                        },
                        sizeTable: [
                            { size: '1.5×1.5M', weight: '13KG' },
                            { size: '2×2M', weight: '15KG' },
                            { size: '2×3M', weight: '19KG' },
                            { size: '2.5×2.5M', weight: '16.5KG' },
                            { size: '3×3M', weight: '21KG' },
                            { size: '3×4.5M', weight: '27KG' },
                            { size: '3×6M', weight: '36KG' }
                        ],
                        keywords: ['WK-T30','30','30square','iron','30方管'],
                        price: '询价'
                descriptionJa: 'プロフェッショナルビーチフラッグポール、様々な素材と仕様を含む、屋外広告、ブランド展示、イベント識別に適しています',
                descriptionKo: '전문 비치 깃발 폴, 다양한 소재 및 규격 포함, 야외 광고, 브랜드 전시, 이벤트 식별에 적합',
                        id: 2002,
                        category: 'tents',
                        type: 'stock',
                        name: '40六角铝合金架帐篷',
                        nameEn: '40 Hexagon Aluminum Frame Tent',
                        nameZh: '40六角铝合金架帐篷',
                        shortEn: 'Hexagon 40 aluminum frame tent — lightweight and durable.',
                        shortZh: '40六角铝合金框架，轻便耐用，适合常规活动使用。',
                        image: 'images/products/tents/40square-tube-frame-aluminum.png',
                        gallery: [
                            'images/products/tents/40square-tube-frame-aluminum.png',
                            'images/products/tents/40square-tube-frame-aluminum-authenticaccessories.png',
                            'images/products/tents/waterproof-fire-proof.png',
                            'images/products/tents/frame-aluminum-40-hexagon.png'
                        ],
                        options: {
                            frameMaterial: { value: 'aluminum', detailEn: '40 hexagon aluminum frame — lighter, corrosion resistant.', detailZh: '40六角铝合金框架 — 更轻，耐腐蚀' },
                            fabric: [ { value: '300D', labelEn: '300D', labelZh: '300D' }, { value: '600D', labelEn: '600D', labelZh: '600D' } ],
                            printing: [ { value: 'printed', labelEn: 'Printed', labelZh: '印刷' }, { value: 'plain', labelEn: 'Plain', labelZh: '无印' } ]
                        },
                        sizeTable: [
                            { size: '1.5×1.5M', weight: '12.5KG' },
                            { size: '2×2M', weight: '13KG' },
                            { size: '2.5×2.5M', weight: '16KG' },
                            { size: '3×3M', weight: '17KG' },
                            { size: '3×4.5M', weight: '20KG' },
                            { size: '3×6M', weight: '28KG' },
                            { size: '4×4M', weight: '20.5KG' },
                            { size: '4×6M', weight: '26KG' },
                            { size: '4×8M', weight: '33KG' }
                        ],
                        keywords: ['WK-T40','40','40hexagon','aluminum','铝合金'],
                        price: '询价'
                price: '询价'
            },
                        id: 2003,
                        category: 'tents',
                        type: 'stock',
                        name: '50六角铝合金架帐篷',
                        nameEn: '50 Hexagon Aluminum Frame Tent',
                        nameZh: '50六角铝合金架帐篷',
                        shortEn: 'Heavy-duty 50 hexagon aluminum frame tent for larger events.',
                        shortZh: '50六角铝合金框架，承重更强，适合更大尺度活动。',
                        image: 'images/products/tents/50square-tube-frame-aluminum.png',
                        gallery: [
                            'images/products/tents/50square-tube-frame-aluminum.png',
                            'images/products/tents/50square-tube-frame-aluminum-authenticaccessories.png',
                            'images/products/tents/waterproof-fire-proof.png',
                            'images/products/tents/frame-aluminum-50-hexagon.png'
                        ],
                        options: {
                            frameMaterial: { value: 'aluminum', detailEn: '50 hexagon aluminum frame — maximum strength for larger spans.', detailZh: '50六角铝合金框架 — 更大跨度的更高强度' },
                            fabric: [ { value: '300D', labelEn: '300D', labelZh: '300D' }, { value: '600D', labelEn: '600D', labelZh: '600D' } ],
                            printing: [ { value: 'printed', labelEn: 'Printed', labelZh: '印刷' }, { value: 'plain', labelEn: 'Plain', labelZh: '无印' } ]
                        },
                        sizeTable: [
                            { size: '2×2M', weight: '20KG' },
                            { size: '2.5×2.5M', weight: '22KG' },
                            { size: '3×3M', weight: '29KG' },
                            { size: '3×4.5M', weight: '40KG' },
                            { size: '3×6M', weight: '55KG' },
                            { size: '4×4M', weight: '36KG' },
                            { size: '4×6M', weight: '51KG' },
                            { size: '4×8M', weight: '67KG' }
                        ],
                        keywords: ['WK-T50','50','50hexagon','aluminum','铝合金'],
                        price: '询价'
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
            {
                id: 5,
                category: 'tents',
                name: '快幕秀',
                nameEn: 'Pop-up Display',
                nameJa: '快幕秀',
                nameKo: '팝업 디스플레이',
                description: '快速搭建的快幕秀产品，适用于展览、活动、户外展示等多种场景',
                descriptionEn: 'Quick-setup pop-up display products, suitable for exhibitions, events, outdoor displays and various scenarios',
                descriptionJa: '迅速設置可能な快幕秀製品、展示、イベント、屋外展示など様々なシーンに適しています',
                descriptionKo: '빠른 설치 팝업 디스플레이 제품, 전시, 이벤트, 야외 전시 등 다양한 시나리오에 적합',
                image: 'popup-display.jpg',
                specs: ['快速搭建', '便携设计', '多种尺寸', '品牌定制'],
                specsEn: ['Quick Setup', 'Portable Design', 'Various Sizes', 'Brand Customization'],
                specsJa: ['迅速設置', 'ポータブルデザイン', '様々なサイズ', 'ブランドカスタマイズ'],
                specsKo: ['빠른 설치', '휴대용 설계', '다양한 크기', '브랜드 맞춤'],
                price: '询价'
            },
            {
                id: 6,
                category: 'tents',
                name: '拉网帐篷',
                nameEn: 'Mesh Tent',
                nameJa: 'メッシュテント',
                nameKo: '메쉬 텐트',
                description: '专业拉网帐篷，通风透气，适用于户外活动和临时搭建',
                descriptionEn: 'Professional mesh tent, breathable and ventilated, suitable for outdoor activities and temporary setup',
                descriptionJa: 'プロフェッショナルメッシュテント、通気性が良く、アウトドア活動や一時的な設置に適しています',
                descriptionKo: '전문 메쉬 텐트, 통기성 좋음, 야외 활동 및 임시 설치에 적합',
                image: 'mesh-tent.jpg',
                specs: ['通风透气', '防蚊虫', '快速搭建', '多种规格'],
                specsEn: ['Breathable', 'Mosquito-proof', 'Quick Setup', 'Various Specifications'],
                specsJa: ['通気性', '防虫', '迅速設置', '様々な仕様'],
                specsKo: ['통기성', '방충', '빠른 설치', '다양한 규격'],
                price: '询价'
            },
            {
                id: 7,
                category: 'tents',
                name: '升降台',
                nameEn: 'Lifting Platform',
                nameJa: 'リフティングプラットフォーム',
                nameKo: '리프팅 플랫폼',
                description: '专业升降台产品，可调节高度，适用于舞台、展览等多种应用场景',
                descriptionEn: 'Professional lifting platform, adjustable height, suitable for stages, exhibitions and various application scenarios',
                descriptionJa: 'プロフェッショナルリフティングプラットフォーム、高さ調整可能、ステージ、展示など様々な応用シーンに適しています',
                descriptionKo: '전문 리프팅 플랫폼, 높이 조절 가능, 무대, 전시 등 다양한 응용 시나리오에 적합',
                image: 'lifting-platform.jpg',
                specs: ['高度可调', '安全可靠', '多种规格', '易于操作'],
                specsEn: ['Adjustable Height', 'Safe and Reliable', 'Various Specifications', 'Easy to Operate'],
                specsJa: ['高さ調整可能', '安全で信頼性', '様々な仕様', '操作簡単'],
                specsKo: ['높이 조절 가능', '안전하고 신뢰성', '다양한 규격', '조작 용이'],
                price: '询价'
            },
            {
                id: 8,
                category: 'tents',
                name: '定制品牌大帐篷',
                nameEn: 'Customized Branding Marquee',
                nameJa: 'カスタムブランディングマーキー',
                nameKo: '맞춤형 브랜딩 마키',
                description: '专业定制品牌大帐篷，可承载企业标识，适合品牌推广活动',
                descriptionEn: 'Professional customized branding marquee, can carry corporate logos, suitable for brand promotion activities',
                descriptionJa: 'プロフェッショナルカスタムブランディングマーキー、企業ロゴを搭載でき、ブランドプロモーション活動に適しています',
                descriptionKo: '전문 맞춤형 브랜딩 마키, 기업 로고를 담을 수 있으며 브랜드 홍보 활동에 적합',
                image: 'custom-marquee.jpg',
                specs: ['定制设计', '品牌印刷', '防风防水', '快速搭建'],
                specsEn: ['Custom Design', 'Brand Printing', 'Windproof & Waterproof', 'Quick Setup'],
                specsJa: ['カスタムデザイン', 'ブランド印刷', '防風・防水', '迅速設置'],
                specsKo: ['맞춤 디자인', '브랜드 인쇄', '방풍 방수', '빠른 설치'],
                price: '询价'
            },
            {
                id: 9,
                category: 'flags',
                name: '羽毛旗杆和底座',
                nameEn: 'Feather Flag Poles and Bases',
                nameJa: 'フェザーフラッグポールとベース',
                nameKo: '깃털 깃발 폴과 베이스',
                description: '专业羽毛旗杆和底座，材质多样，适合各种户外广告展示',
                descriptionEn: 'Professional feather flag poles and bases, various materials, suitable for various outdoor advertising displays',
                descriptionJa: 'プロフェッショナルフェザーフラッグポールとベース、多様な素材、様々な屋外広告展示に適しています',
                descriptionKo: '전문 깃털 깃발 폴과 베이스, 다양한 소재, 다양한 야외 광고 전시에 적합',
                image: 'flag-poles.jpg',
                specs: ['玻璃钢材质', '铝合金材质', '防风设计', '便携安装'],
                specsEn: ['Fiberglass Material', 'Aluminum Material', 'Windproof Design', 'Portable Installation'],
                specsJa: ['グラスファイバー素材', 'アルミ素材', '防風デザイン', 'ポータブル設置'],
                specsKo: ['글래스파이버 소재', '알루미늄 소재', '방풍 설계', '휴대용 설치'],
                price: '询价'
            },
            {
                id: 4,
                category: 'custom',
                name: '弹性桌布',
                nameEn: 'Stretchy Table Cloth',
                nameJa: 'ストレッチテーブルクロス',
                nameKo: '스트레치 테이블 클로스',
                description: '高质量弹性桌布，可定制印刷，适合各种活动场合',
                descriptionEn: 'High-quality stretchy table cloth, customizable printing, suitable for various event occasions',
                descriptionJa: '高品質ストレッチテーブルクロス、カスタム印刷可能、様々なイベントシーンに適しています',
                descriptionKo: '고품질 스트레치 테이블 클로스, 맞춤형 인쇄 가능, 다양한 이벤트 장소에 적합',
                image: 'table-cloth.jpg',
                specs: ['弹性面料', '定制印刷', '易清洁', '多种尺寸'],
                specsEn: ['Stretchy Fabric', 'Custom Printing', 'Easy Clean', 'Various Sizes'],
                specsJa: ['ストレッチ生地', 'カスタム印刷', '簡単清掃', '様々なサイズ'],
                specsKo: ['스트레치 원단', '맞춤 인쇄', '쉬운 청소', '다양한 크기'],
                price: '起价 ¥99/张'
            },
            {
                id: 5,
                category: 'tents',
                name: '车辆遮阳篷',
                nameEn: 'Vehicle Shelter',
                nameJa: '車両日除け',
                nameKo: '차량 차양막',
                description: '专业车辆遮阳篷，保护车辆免受日晒雨淋，适合各种户外停车需求',
                descriptionEn: 'Professional vehicle shelter, protects vehicles from sun and rain, suitable for various outdoor parking needs',
                descriptionJa: 'プロフェッショナル車両日除け、車両を日差しや雨から保護、様々な屋外駐車ニーズに適しています',
                descriptionKo: '전문 차량 차양막, 차량을 햇빛과 비로부터 보호, 다양한 야외 주차 요구에 적합',
                image: 'vehicle-shelter.jpg',
                specs: ['防水材料', '防晒涂层', '防风设计', '快速搭建'],
                specsEn: ['Waterproof Material', 'Sun Protection Coating', 'Windproof Design', 'Quick Setup'],
                specsJa: ['防水材料', '日焼け防止コーティング', '防風デザイン', '迅速設置'],
                specsKo: ['방수 소재', '자외선 차단 코팅', '방풍 설계', '빠른 설치'],
                price: '起价 ¥799/顶'
            },
            {
                id: 6,
                category: 'flags',
                name: '染料升华印刷旗帜',
                nameEn: 'Dye-sub Printed Flag',
                nameJa: '染料昇華印刷フラッグ',
                nameKo: '염료 승화 인쇄 깃발',
                description: '高质量染料升华印刷旗帜，色彩鲜艳持久，适合品牌宣传展示',
                descriptionEn: 'High-quality dye-sub printed flag, bright and durable colors, suitable for brand promotion display',
                descriptionJa: '高品質染料昇華印刷フラッグ、鮮やかで耐久性のある色、ブランドプロモーション展示に適しています',
                descriptionKo: '고품질 염료 승화 인쇄 깃발, 선명하고 내구성이 뛰어난 색상, 브랜드 홍보 전시에 적합',
                image: 'dye-flag.jpg',
                specs: ['染料升华', '色彩持久', '防水防晒', '多种尺寸'],
                specsEn: ['Dye Sublimation', 'Color Fast', 'Waterproof & UV Resistant', 'Various Sizes'],
                specsJa: ['染料昇華', '色落ちしない', '防水・日焼け防止', '様々なサイズ'],
                specsKo: ['염료 승화', '색상 고정', '방수 자외선 차단', '다양한 크기'],
                price: '起价 ¥199/面'
            },
            {
                id: 7,
                category: 'custom',
                name: '织物横幅',
                nameEn: 'Fabric Banner',
                nameJa: 'ファブリックバナー',
                nameKo: '패브릭 배너',
                description: '专业织物横幅，可定制印刷，适合各类宣传展示活动',
                descriptionEn: 'Professional fabric banner, customizable printing, suitable for various promotional display activities',
                descriptionJa: 'プロフェッショナルファブリックバナー、カスタム印刷可能、様々なプロモーション展示活動に適しています',
                descriptionKo: '전문 패브릭 배너, 맞춤형 인쇄 가능, 다양한 홍보 전시 활동에 적합',
                image: 'fabric-banner.jpg',
                specs: ['优质织物', '定制印刷', '防水防晒', '多种规格'],
                specsEn: ['Quality Fabric', 'Custom Printing', 'Waterproof & UV Resistant', 'Various Specifications'],
                specsJa: ['高品質ファブリック', 'カスタム印刷', '防水・日焼け防止', '様々な仕様'],
                specsKo: ['고품질 패브릭', '맞춤 인쇄', '방수 자외선 차단', '다양한 규격'],
                price: '起价 ¥299/平米'
            },
            {
                id: 8,
                category: 'tents',
                name: '帐篷框架和配件',
                nameEn: 'Tent Frame and Accessories',
                nameJa: 'テントフレームとアクセサリー',
                nameKo: '텐트 프레임과 액세서리',
                description: '专业帐篷框架和配件，结构坚固，配件齐全，适合各种帐篷搭建需求',
                descriptionEn: 'Professional tent frame and accessories, sturdy structure, complete accessories, suitable for various tent setup needs',
                descriptionJa: 'プロフェッショナルテントフレームとアクセサリー、頑丈な構造、完全なアクセサリー、様々なテント設置ニーズに適しています',
                descriptionKo: '전문 텐트 프레임과 액세서리, 견고한 구조, 완전한 액세서리, 다양한 텐트 설치 요구에 적합',
                image: 'tent-frame.jpg',
                specs: ['铝合金框架', '不锈钢配件', '快速组装', '多种规格'],
                specsEn: ['Aluminum Frame', 'Stainless Steel Accessories', 'Quick Assembly', 'Various Specifications'],
                specsJa: ['アルミフレーム', 'ステンレスアクセサリー', '迅速組み立て', '様々な仕様'],
                specsKo: ['알루미늄 프레임', '스테인리스 액세서리', '빠른 조립', '다양한 규격'],
                price: '起价 ¥899/套'
            }
                ];

                // Explicitly add three fixed tent products (30/40/50) with fixed material and variants
                this.products.push(
                    {
                        id: 2001,
                        category: 'tents',
                        name: '30方管铁架帐篷',
                        nameEn: '30 Square Tube Iron Frame Tent',
                        nameZh: '30方管铁架帐篷',
                        materialEn: 'Iron',
                        materialZh: '铁',
                        variants: [
                            { model: 'WK-T30I', size: '1.5×1.5M', weight: '13KG' },
                            { model: 'WK-T30H', size: '2×2M', weight: '15KG' },
                            { model: 'WK-T30A', size: '2×3M', weight: '19KG' },
                            { model: 'WK-T30B', size: '2.5×2.5M', weight: '16.5KG' },
                            { model: 'WK-T30C', size: '3×3M', weight: '21KG' },
                            { model: 'WK-T30F', size: '3×4.5M', weight: '27KG' },
                            { model: 'WK-T30G', size: '3×6M', weight: '36KG' }
                        ],
                        image: 'images/products/tents/30square-tube-frame-iron.png',
                        gallery: [
                            'images/products/tents/30square-tube-frame-iron.png',
                            'images/products/tents/30square-tube-frame-iron-authenticaccessories.png',
                            'images/products/tents/waterproof-fireproof.png'
                        ],
                        subcategory: 'stock',
                        searchableKeywords: ['WK-T30I','WK-T30H','WK-T30A','WK-T30B','WK-T30C','WK-T30F','WK-T30G','30 square tube','iron','铁','30方管'],
                        price: '询价'
                    },
                    {
                        id: 2002,
                        category: 'tents',
                        name: '40六角铝合金架帐篷',
                        nameEn: '40 Hexagon Aluminum Frame Tent',
                        nameZh: '40六角铝合金架帐篷',
                        materialEn: 'Aluminum',
                        materialZh: '铝合金',
                        variants: [
                            { model: 'WK-T40I', size: '1.5×1.5M', weight: '12.5KG' },
                            { model: 'WK-T40H', size: '2×2M', weight: '13KG' },
                            { model: 'WK-T40A', size: '2.5×2.5M', weight: '16KG' },
                            { model: 'WK-T40B', size: '3×3M', weight: '17KG' },
                            { model: 'WK-T40C', size: '3×4.5M', weight: '20KG' },
                            { model: 'WK-T40D', size: '3×6M', weight: '28KG' },
                            { model: 'WK-T40E', size: '4×4M', weight: '20.5KG' },
                            { model: 'WK-T40F', size: '4×6M', weight: '26KG' },
                            { model: 'WK-T40G', size: '4×8M', weight: '33KG' }
                        ],
                        image: 'images/products/tents/40square-tube-frame-aluminum.png',
                        gallery: [
                            'images/products/tents/40square-tube-frame-aluminum.png',
                            'images/products/tents/40square-tube-frame-aluminum-authenticaccessories.png',
                            'images/products/tents/waterproof-fireproof.png'
                        ],
                        subcategory: 'stock',
                        searchableKeywords: ['WK-T40I','WK-T40H','WK-T40A','WK-T40B','WK-T40C','WK-T40D','WK-T40E','WK-T40F','WK-T40G','40 hexagon','aluminum','铝合金','六角'],
                        price: '询价'
                    },
                    {
                        id: 2003,
                        category: 'tents',
                        name: '50六角铝合金架帐篷',
                        nameEn: '50 Hexagon Aluminum Frame Tent',
                        nameZh: '50六角铝合金架帐篷',
                        materialEn: 'Aluminum',
                        materialZh: '铝合金',
                        variants: [
                            { model: 'WK-T50H', size: '2×2M', weight: '20KG' },
                            { model: 'WK-T50A', size: '2.5×2.5M', weight: '22KG' },
                            { model: 'WK-T50B', size: '3×3M', weight: '29KG' },
                            { model: 'WK-T50C', size: '3×4.5M', weight: '40KG' },
                            { model: 'WK-T50D', size: '3×6M', weight: '55KG' },
                            { model: 'WK-T50E', size: '4×4M', weight: '36KG' },
                            { model: 'WK-T50F', size: '4×6M', weight: '51KG' },
                            { model: 'WK-T50G', size: '4×8M', weight: '67KG' }
                        ],
                        image: 'images/products/tents/50square-tube-frame-aluminum.png',
                        gallery: [
                            'images/products/tents/50square-tube-frame-aluminum.png',
                            'images/products/tents/50square-tube-frame-aluminum-authenticaccessories.png',
                            'images/products/tents/waterproof-fireproof.png'
                        ],
                        subcategory: 'stock',
                        searchableKeywords: ['WK-T50H','WK-T50A','WK-T50B','WK-T50C','WK-T50D','WK-T50E','WK-T50F','WK-T50G','50 hexagon','aluminum','铝合金','六角'],
                        price: '询价'
                    }
                );
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
        
        this.init();
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
        if (countEl) countEl.textContent = `${total} items`;

        // 6) pagination render
        this.renderPagination(total, paginationEl);
    }
    
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.setAttribute('data-category', product.category);
        
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
                    <button class="btn btn-primary product-btn" onclick="window.productManager.showProductModal(${product.id})">
                        <i class="fas fa-info-circle"></i> 查看详情
                    </button>
                    <button class="btn btn-accent product-btn" onclick="window.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> 加入购物车
                    </button>
                    <button class="btn btn-secondary product-btn" onclick="window.productManager.downloadProductInfo(${product.id})">
                        <i class="fas fa-download"></i> 下载资料
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
                    <a href="product.html?id=${product.id}" style="text-decoration:none;color:inherit;">
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
        // 显示PDF下载模态框
        const modal = document.getElementById('pdfModal');
        if (modal) {
            modal.style.display = 'block';
        }
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
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 1200);
            } catch {
                // 备用方案：选中文本
                const textarea = document.getElementById('rfqText');
                if (textarea) {
                    textarea.select();
                    document.execCommand('copy');
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => copyBtn.textContent = 'Copy', 1200);
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
            if (hintEl) hintEl.textContent = 'Tip: These items come from your cart. You can change quantity here.';
        } else {
            // 无购物车时：用当前筛选结果（最多 6 个），提示用户最好先 Add to Cart
            const filtered = this.getFilteredProductsNow().slice(0, 6);
            items = filtered.map(p => ({ product: p, qty: 1 }));
            const hintEl = document.getElementById('rfqHint');
            if (hintEl) hintEl.textContent = 'Tip: Your cart is empty. Showing top filtered products. For precise RFQ, please add products to cart first.';
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
                    copyIdBtn.textContent = 'Copied!';
                    setTimeout(() => copyIdBtn.textContent = 'Copy WeChat ID', 1200);
                } catch {
                    // 备用方案
                    const textarea = document.createElement('textarea');
                    textarea.value = idText.textContent.trim();
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    copyIdBtn.textContent = 'Copied!';
                    setTimeout(() => copyIdBtn.textContent = 'Copy WeChat ID', 1200);
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
});
