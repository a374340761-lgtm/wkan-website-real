import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.waikwantent.com';
const GTM_ID = 'GTM-TVQFLJP7';
const GTM_HEAD = `<!-- Google Consent Mode default -->
<script>
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){dataLayer.push(arguments);};
window.gtag('consent','default',{
  analytics_storage:'denied',
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});
</script>
<!-- End Google Consent Mode default -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;
const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

export const STATIC_PRODUCTS = [
  {
    sku: 'FABRIC-BANNER-STAND-CURVED', catalogIdentifier: true, imageWidth: 4032, imageHeight: 3024,
    slug: 'curved-fabric-banner-stand', model: 'Curved Banner Stand',
    image: '/images/products/displays/tension-fabric-displays/curved-banner-stand/curved-fabric-banner-stand-frame-overview.jpg',
    imageNoteEn: 'Workshop photograph of the bare frame; printed fabric is not shown.',
    imageNoteZh: '车间裸架实拍，未展示印刷布画。',
    en: {
      name: 'Curved Fabric Banner Stand',
      title: 'Curved Fabric Banner Stand | Frame Photos & Dimensions | WaiKwan',
      description: 'Curved fabric banner stand for exhibitions, retail and event branding. View six real frame photographs and reference display and graphic dimensions.',
      intro: 'This banner stand has a curved tube-frame outline and support feet. Six workshop photographs show the bare frame, rounded top, tube connections and base details. The dimensions below follow the straight banner stand in the same series and should be confirmed for the curved model before printing.',
      applications: ['Exhibition and trade show displays', 'Retail brand presentations', 'Indoor event branding'],
      note: 'Request the curved banner stand and specify quantity, destination and graphic requirements. The 80 × 200 cm display and 83 × 205 cm graphic sizes are references from the straight stand. Confirm the curved graphic template, material, weight, packing and supplied components in writing before ordering or printing.'
    },
    zh: {
      name: '立牌弧形',
      title: '立牌弧形｜结构实拍与参考尺寸｜伟群帐篷',
      description: '弧形管架立牌，适用于展会、门店及活动品牌展示。查看六张裸架结构实拍、支撑脚与连接细节，以及参考展示和画面尺寸。',
      intro: '立牌弧形采用弧形管架轮廓与支撑脚。六张车间实拍展示裸架整体、顶部弧度、管件连接及底座。下列尺寸参考同系列直形立牌，弧形款的画面版型请在制作前确认。',
      applications: ['展会及展位展示', '门店品牌陈列', '室内活动品牌展示'],
      note: '询价请注明立牌弧形、数量、目的地及画面要求。展示尺寸 80 × 200 厘米、画面尺寸 83 × 205 厘米均参考直形立牌；下单及印刷前请书面确认弧形画面版型、材质、重量、包装及供货配件。'
    },
    facts: [['Frame form', 'Curved tube frame with support feet'], ['Reference display size', '80 × 200 cm (straight stand reference)'], ['Reference graphic size', '83 × 205 cm (straight stand reference)'], ['Photographs', 'Bare frame; printed graphic not shown']],
    factsZh: [['架体形式', '弧形管架及支撑脚'], ['参考展示尺寸', '80 × 200 厘米（参考直形立牌）'], ['参考画面尺寸', '83 × 205 厘米（参考直形立牌）'], ['实拍内容', '裸架，未展示印刷画面']],
    gallery: [
      { src: '/images/products/displays/tension-fabric-displays/curved-banner-stand/curved-fabric-banner-stand-frame-overview.jpg', en: 'Bare frame overview', zh: '裸架整体' },
      { src: '/images/products/displays/tension-fabric-displays/curved-banner-stand/curved-fabric-banner-stand-feet-and-lower-frame.jpg', en: 'Support feet and lower frame', zh: '支撑脚及下部框架' },
      { src: '/images/products/displays/tension-fabric-displays/curved-banner-stand/curved-fabric-banner-stand-rounded-top.jpg', en: 'Rounded top profile', zh: '顶部弧度' },
      { src: '/images/products/displays/tension-fabric-displays/curved-banner-stand/curved-fabric-banner-stand-curved-side-joint.jpg', en: 'Curved side connection', zh: '弧形侧面连接' },
      { src: '/images/products/displays/tension-fabric-displays/curved-banner-stand/curved-fabric-banner-stand-upright-tube-connection.jpg', en: 'Upright tube connection', zh: '立管连接细节' },
      { src: '/images/products/displays/tension-fabric-displays/curved-banner-stand/curved-fabric-banner-stand-base-detail.jpg', en: 'Base detail', zh: '底座细节' }
    ]
  },
  {
  "sku": "STANDARD-BLACK-FLAT-TUBE-3X3",
  "internalCatalogKey": true,
  "slug": "3x3-standard-black-flat-tube-canopy-frame",
  "model": "Standard Black / 普通黑金刚",
  "image": "/images/products/tents/standard-black-flat-tube-3x3/3x3-standard-black-flat-tube-canopy-frame-folded-frame.jpg",
  "imageWidth": 810,
  "imageHeight": 1440,
  "gallery": [
    {
      "src": "/images/products/tents/standard-black-flat-tube-3x3/3x3-standard-black-flat-tube-canopy-frame-folded-frame.jpg",
      "en": "Folded frame in the workshop (3×3 m sample)",
      "zh": "车间内的折叠架整体（3×3米示例）",
      "width": 810,
      "height": 1440
    },
    {
      "src": "/images/products/tents/standard-black-flat-tube-3x3/3x3-standard-black-flat-tube-canopy-frame-top-corner-joint.jpg",
      "en": "Top corner joint and bolts (3×3 m sample)",
      "zh": "顶部角连接与螺栓（3×3米示例）",
      "width": 1080,
      "height": 1920
    },
    {
      "src": "/images/products/tents/standard-black-flat-tube-3x3/3x3-standard-black-flat-tube-canopy-frame-center-joint.jpg",
      "en": "Center post and cross-brace connections (3×3 m sample)",
      "zh": "中心立柱与交叉撑杆连接（3×3米示例）",
      "width": 1080,
      "height": 1920
    },
    {
      "src": "/images/products/tents/standard-black-flat-tube-3x3/3x3-standard-black-flat-tube-canopy-frame-leg-lock.jpg",
      "en": "Leg slider and locking detail (3×3 m sample)",
      "zh": "立柱滑动连接与锁扣细节（3×3米示例）",
      "width": 810,
      "height": 1440
    },
    {
      "src": "/images/products/tents/standard-black-flat-tube-3x3/3x3-standard-black-flat-tube-canopy-frame-flat-tube-cross-braces.jpg",
      "en": "Flat-tube cross braces and folding joint (3×3 m sample)",
      "zh": "扁管交叉撑杆与折叠连接（3×3米示例）",
      "width": 1080,
      "height": 1920
    }
  ],
  "en": {
    "name": "Standard Black Flat-Tube Canopy Frame",
    "title": "Standard Black Flat-Tube Canopy Frame | Sizes & Details | WaiKwan",
    "description": "Standard Black flat-tube folding canopy frame in seven sizes from 2×2 m to 4×4 m, including 3×4.5 m and 3×6 m. View real 3×3 m sample photographs.",
    "intro": "The Standard Black flat-tube folding canopy frame is available in seven sizes listed below. The five workshop photographs show a 3×3 m sample frame and its connections, without a canopy cover.",
    "applications": [
      "Canopy frame sourcing in multiple sizes",
      "Checking joints and braces using a 3×3 m sample"
    ],
    "note": "Specify Standard Black, required size, quantity and destination when requesting a quote. Weight varies with size and configuration. Confirm frame material, tube dimensions, wall thickness, packing, canopy compatibility and anchoring requirements in writing."
  },
  "zh": {
    "name": "普通黑金刚扁管帐篷架",
    "title": "普通黑金刚扁管帐篷架｜尺寸与实拍细节｜伟群帐篷",
    "description": "普通黑金刚扁管折叠帐篷架提供2×2、2×3、2.5×2.5、3×3、3×4.5、3×6及4×4米规格，展示3×3米示例架的五张实拍细节。",
    "intro": "普通黑金刚扁管帐篷架提供下表所列的七种尺寸。本页五张车间实拍仅以3×3米架子为示例，展示折叠状态、连接件与锁扣；照片展示裸架，不含顶布。",
    "applications": [
      "多种尺寸的帐篷架采购",
      "通过3×3米示例查看连接与撑杆细节"
    ],
    "note": "询价请注明普通黑金刚、所需尺寸、数量和目的地。重量随尺寸及配置而异，材质、管径、壁厚、包装、顶布适配及固定方式请书面确认。"
  },
  "facts": [
    [
      "Product name",
      "Standard Black (普通黑金刚)"
    ],
    [
      "Available sizes",
      "2 × 2 / 2 × 3 / 2.5 × 2.5 / 3 × 3 / 3 × 4.5 / 3 × 6 / 4 × 4 m"
    ],
    [
      "Brace profile",
      "Flat tube"
    ],
    [
      "Appearance",
      "Black"
    ],
    [
      "Structure",
      "Folding frame"
    ],
    [
      "Photo sample",
      "3 × 3 m bare frame; canopy cover not shown"
    ]
  ],
  "factsZh": [
    [
      "产品名称",
      "普通黑金刚"
    ],
    [
      "可选尺寸",
      "2 × 2 / 2 × 3 / 2.5 × 2.5 / 3 × 3 / 3 × 4.5 / 3 × 6 / 4 × 4 米"
    ],
    [
      "撑杆形式",
      "扁管"
    ],
    [
      "外观颜色",
      "黑色"
    ],
    [
      "结构形式",
      "折叠架"
    ],
    [
      "实拍示例",
      "3 × 3 米裸架，未展示顶布"
    ]
  ],
  "sizes": [
    "2 × 2",
    "2 × 3",
    "2.5 × 2.5",
    "3 × 3",
    "3 × 4.5",
    "3 × 6",
    "4 × 4"
  ]
},
  {
    sku: '9403', slug: 'semi-circle-race-gate-9403', model: 'RaceGate-SemiCircle',
    en: { name: 'Semi-circle Race Gate', title: 'Semi-circle Race Gate 9403 | Fiberglass Event Arch | WaiKwan', description: 'Portable semi-circle fiberglass race gate for races, sports events and brand activations. Compare four sizes, pole diameters and export carton quantities.', intro: 'SKU 9403 is a portable semi-circle race gate built with fiberglass poles. Four catalog sizes cover small course markers through large start and finish arches.', applications: ['Running and cycling events', 'FPV and drone courses', 'Brand activations and finish lines'], note: 'Choose the model from the table and include quantity, destination and artwork status in your quote request.' },
    zh: { name: '半圆型竞速拱门', title: '半圆型竞速拱门 9403｜玻璃钢赛事活动拱门｜伟群帐篷', description: '便携式半圆型玻璃钢竞速拱门，适合赛事、运动活动与品牌推广。对比四种尺寸、杆径及出口装箱数量。', intro: 'SKU 9403 为玻璃钢杆结构的便携式半圆型竞速拱门，目录提供四种尺寸，可用于小型赛道标识及大型起终点拱门。', applications: ['跑步及自行车赛事', 'FPV 与无人机赛道', '品牌推广及起终点展示'], note: '询价时请注明型号、数量、目的地及画面文件准备情况。' },
    image: '/images/products/racegate/Semi-circle%20Race%20Gate/semi-circle-race-gate-event-arch-hero.png',
    specs: [
      ['AD-R40A', 'Fiberglass', 'L 2.5 × H 1.4 m', '8 mm', '2.5 mm', '118 × 25 × 15 cm', '10 pcs/carton'],
      ['AD-R40B', 'Fiberglass', 'L 3.1 × H 1.9 m', '10 mm', '2.5 mm', '118 × 25 × 22 cm', '10 pcs/carton'],
      ['AD-R40C', 'Fiberglass', 'L 3.6 × H 2.4 m', '12 mm', '2.5 mm', '118 × 25 × 22 cm', '10 pcs/carton'],
      ['AD-R40D', 'Fiberglass', 'L 5.5 × H 3.0 m', '12 mm', '2.5 mm', '118 × 30 × 25 cm', '5 pcs/carton'],
    ],
    headersEn: ['Model', 'Material', 'Size', 'Diameter', 'Thickness', 'Carton', 'Quantity'],
    headersZh: ['型号', '材质', '尺寸', '杆径', '厚度', '箱规', '装箱数量'],
  },
  {
    sku: '31007', slug: 'folding-chair-31007', model: 'WK-Y45',
    en: { name: 'Folding Chair WK-Y45', title: 'Folding Chair WK-Y45 | Portable Event Seating | WaiKwan', description: 'Lightweight folding chair model WK-Y45 for events, exhibitions and temporary seating. Ask WaiKwan for current material, packing and order details.', intro: 'WK-Y45 is a lightweight folding chair intended for events, exhibitions and temporary seating. It folds for storage and quick venue setup.', applications: ['Exhibitions and booths', 'Temporary event seating', 'Outdoor and rental programs'], note: 'The current catalog record confirms the model and use case. Request the latest material, load, color, carton and MOQ details before ordering.' },
    zh: { name: '折叠椅 WK-Y45', title: '折叠椅 WK-Y45｜便携活动座椅｜伟群帐篷', description: 'WK-Y45 轻便折叠椅，适用于活动、展会与临时座位。可向伟群获取最新材质、装箱及起订信息。', intro: 'WK-Y45 是面向活动、展会及临时座位场景的轻便折叠椅，可折叠收纳并快速布置。', applications: ['展会及展位', '临时活动座位', '户外及租赁项目'], note: '现有目录记录确认了型号与用途；下单前请索取最新材质、承重、颜色、箱规及 MOQ 信息。' },
    image: '/images/products/furniture/chair%20table/folding-table-and-chair-set-event-furniture-hero.jpg',
    imageNoteEn: 'Furniture range reference image; request a WK-Y45 model photo with your quote.',
    imageNoteZh: '家具系列参考图；询价时可索取 WK-Y45 型号实物图。',
    facts: [['Model', 'WK-Y45'], ['Storage', 'Foldable'], ['Use', 'Events, exhibitions and temporary seating']],
    factsZh: [['型号', 'WK-Y45'], ['收纳方式', '折叠'], ['用途', '活动、展会及临时座位']],
  },
  {
    sku: '9004', slug: 'round-water-weight-bucket-9004', model: 'WK-T02A',
    en: { name: 'Round Water Weight Bucket WK-T02A', title: 'Round Canopy Water Weight Bucket WK-T02A | WaiKwan', description: 'Round water weight bucket for pop-up canopy anchoring. Model WK-T02A weighs 1.1 kg empty and packs four pieces per carton.', intro: 'WK-T02A is a round fillable water weight bucket used to add ballast at pop-up canopy legs where ground stakes are unsuitable.', applications: ['Paved event sites', 'Trade fairs and promotions', 'Temporary canopy ballast'], note: 'Confirm the required ballast plan against tent size, weather and venue rules. This accessory does not replace a site-specific safety assessment.' },
    zh: { name: '圆型帐篷压重水桶 WK-T02A', title: '圆型帐篷压重水桶 WK-T02A｜快开帐篷配件｜伟群帐篷', description: '用于快开帐篷固定的圆型注水压重桶。WK-T02A 空桶重量 1.1 kg，每箱 4 个。', intro: 'WK-T02A 是圆型可注水压重桶，适用于不便打地钉的场地，为快开帐篷腿增加压重。', applications: ['硬化地面活动', '展会及推广活动', '临时帐篷压重'], note: '压重方案须结合帐篷尺寸、天气及场地规定确认。本配件不能替代现场安全评估。' },
    image: '/images/products/accessories/canopy-tent-accessories-and-replacement-parts.png',
    imageNoteEn: 'Accessory catalog sheet; WK-T02A is item 4 in the first row.',
    imageNoteZh: '配件目录图；WK-T02A 位于第一行第 4 个。',
    facts: [['Model', 'WK-T02A'], ['Empty weight', '1.1 kg'], ['Size', '24 × 25 cm'], ['Carton', '52 × 25 × 48 cm'], ['Quantity', '4 pcs/carton'], ['Gross weight', '4.5 kg']],
    factsZh: [['型号', 'WK-T02A'], ['空桶重量', '1.1 kg'], ['尺寸', '24 × 25 cm'], ['箱规', '52 × 25 × 48 cm'], ['装箱数量', '4 个/箱'], ['毛重', '4.5 kg']],
  },
  {
    sku: '9014', slug: 'half-wall-blade-flag-connector-9014', model: 'AD-t08',
    en: { name: 'Half-wall Blade-flag Connector AD-t08', title: 'Half-wall Blade-flag Connector AD-t08 | Canopy Accessory | WaiKwan', description: 'PC connector for mounting a half wall and blade flag on 40 or 50 hex canopy frames. Model AD-t08, SKU 9014.', intro: 'AD-t08 is a PC connector for half-wall and blade-flag configurations on compatible 40 or 50 hexagonal canopy frame profiles.', applications: ['Branded canopy side walls', 'Tent-mounted blade flags', 'Event and promotion tents'], note: 'Confirm the frame profile and tube dimensions before ordering; “40/50 hex” identifies the compatible frame family.' },
    zh: { name: '半围刀旗连接件 AD-t08', title: '半围刀旗连接件 AD-t08｜广告帐篷配件｜伟群帐篷', description: '适配 40 或 50 六角帐篷架的 PC 半围刀旗连接件。型号 AD-t08，SKU 9014。', intro: 'AD-t08 为 PC 材质连接件，用于兼容的 40 或 50 六角帐篷架半围与刀旗组合。', applications: ['品牌帐篷半围', '帐篷安装刀旗', '活动及推广帐篷'], note: '订购前请确认帐篷架型材及管径；“40/50 六角”表示适配的框架系列。' },
    image: '/images/products/accessories/canopy-tent-accessories-and-replacement-parts.png',
    imageNoteEn: 'Accessory catalog sheet; AD-t08 is item 2 in the fourth row.',
    imageNoteZh: '配件目录图；AD-t08 位于第四行第 2 个。',
    facts: [['Model', 'AD-t08'], ['Material / color', 'PC'], ['Net weight', '0.21 kg'], ['Compatibility', '40 / 50 hex frame'], ['Carton', '45 × 40 × 30 cm'], ['Quantity', '100 pcs/carton'], ['Gross weight', '22 kg']],
    factsZh: [['型号', 'AD-t08'], ['材质 / 颜色', 'PC'], ['净重', '0.21 kg'], ['适配框架', '40 / 50 六角架'], ['箱规', '45 × 40 × 30 cm'], ['装箱数量', '100 个/箱'], ['毛重', '22 kg']],
  },
  {
    sku: 'WK-IS004', slug: 'floor-standing-seg-light-box-wk-is004', model: 'WK-IS004',
    en: { name: 'Floor-standing SEG Light Box WK-IS004', title: 'Floor-standing SEG Light Box WK-IS004 | WaiKwan', description: 'Floor-standing SEG light box display with a 100 × 200 cm graphic, quick-change fabric and optional LED backlighting for retail and showrooms.', intro: 'WK-IS004 is a floor-standing SEG light box for a large 100 × 200 cm fabric graphic. The graphic is replaceable and LED backlighting is optional.', applications: ['Retail flagship stores', 'Showrooms and exhibitions', 'Indoor brand advertising'], note: 'Specify whether lighting is required, the print artwork, quantity, destination and installation needs when requesting a quote.' },
    zh: { name: '落地式 SEG 卡布灯箱 WK-IS004', title: '落地式 SEG 卡布灯箱 WK-IS004｜伟群帐篷', description: '落地式 SEG 卡布灯箱，画面 100 × 200 cm，支持快速换画及选配 LED 背光，适合门店和展厅。', intro: 'WK-IS004 是面向 100 × 200 cm 大画面的落地式 SEG 卡布灯箱，画面可更换，并可选配 LED 背光。', applications: ['旗舰门店', '展厅及展会', '室内品牌广告'], note: '询价时请注明是否需要背光、画面文件、数量、目的地及安装要求。' },
    image: '/images/products/displays/tension-fabric-displays/wk-is004hero.jpg',
    facts: [['Model', 'WK-IS004'], ['Graphic size', '100 × 200 cm'], ['Graphic', 'Fabric / SEG graphic'], ['Backlight', 'Optional LED'], ['Base', 'Floor-standing, for large-format long-term display']],
    factsZh: [['型号', 'WK-IS004'], ['画面尺寸', '100 × 200 cm'], ['画面', '布画 / SEG 卡布画面'], ['背光', '可选 LED'], ['底座', '落地底座，适合大画面长期陈列']],
  },
{
  "sku": "MARKET-STALL-1X1-40MM",
  "slug": "1x1m-40mm-aluminum-market-stall",
  "catalogIdentifier": true,
  "en": {
    "name": "1×1 m Portable Aluminum Market Stall",
    "title": "1×1 m Market Stall | 40 mm Aluminum Folding Frame | WaiKwan",
    "description": "Portable 1×1 m market stall with a 40 mm aluminum tube frame. See expanded and folded frame photographs, counter connections, a complete setup and an optional carry bag.",
    "intro": "This portable market stall has a 1×1 m footprint and a 40 mm aluminum tube frame. Photographs show the expanded frame, folded storage, counter connections and a complete fabric-covered setup example.",
    "applications": [
      "Markets and temporary stalls",
      "Brand promotion and sampling",
      "Exhibitions and event reception points"
    ],
    "note": "A compatible carry bag is optional. Confirm whether fabric panels, the counter and bag are included. Confirm height, wall thickness, load capacity, weight, packing and print-template dimensions before ordering. Branded graphics in the photographs are application references."
  },
  "zh": {
    "name": "1×1米便携铝合金摆摊架",
    "title": "1×1米摆摊架｜40毫米铝管折叠架与配套手提包｜伟群帐篷",
    "description": "1×1米便携摆摊架，采用40毫米铝管框架。查看展开、折叠、台面连接实拍、成套布置示例与可配套手提包。",
    "intro": "这款便携摆摊架为1×1米规格，采用40毫米铝管框架。照片展示裸架展开、折叠收拢、台面连接以及加装围布后的成套示例。",
    "applications": [
      "市集与临时摆摊",
      "品牌推广与派样",
      "展会及活动接待点"
    ],
    "note": "手提包可配套；围布、台面及包是否包含请在报价中逐项确认。高度、壁厚、承重、重量、箱规与印刷文件尺寸尚未列出，请下单前确认。图片中的品牌布置仅作成套应用参考。"
  },
  "image": "/images/products/displays/market-stall-1x1-40mm/1x1m-40mm-aluminum-market-stall-expanded-frame.jpg",
  "imageWidth": 1440,
  "imageHeight": 1920,
  "imageNoteEn": "Expanded frame; the fabric-covered setup is a separate example in the gallery.",
  "imageNoteZh": "主图为展开框架；成套围布布置另见相册示例。",
  "facts": [
    [
      "Footprint",
      "1 × 1 m"
    ],
    [
      "Frame material",
      "Aluminum"
    ],
    [
      "Tube size",
      "40 mm"
    ],
    [
      "Storage",
      "Folding frame"
    ],
    [
      "Carry bag",
      "Compatible optional accessory; confirm inclusion"
    ]
  ],
  "factsZh": [
    [
      "占地规格",
      "1 × 1 米"
    ],
    [
      "框架材质",
      "铝合金"
    ],
    [
      "管材规格",
      "40 毫米"
    ],
    [
      "收纳方式",
      "折叠收拢"
    ],
    [
      "手提包",
      "可配套选项，是否包含请确认"
    ]
  ],
  "gallery": [
    {
      "src": "/images/products/displays/market-stall-1x1-40mm/1x1m-40mm-aluminum-market-stall-expanded-frame.jpg",
      "zh": "展开的1×1米摆摊架，40毫米铝管框架与台面示例。",
      "en": "Expanded 1×1 m market stall with a 40 mm aluminum tube frame and counter example.",
      "width": 1440,
      "height": 1920
    },
    {
      "src": "/images/products/displays/market-stall-1x1-40mm/1x1m-40mm-aluminum-market-stall-complete-stall-example.jpg",
      "zh": "成套布置示例：顶部围布、下围布与台面；具体供货配置请确认。",
      "en": "Complete setup example with top valance, lower fabric and counter. Confirm the supplied configuration.",
      "width": 1080,
      "height": 1920
    },
    {
      "src": "/images/products/displays/market-stall-1x1-40mm/1x1m-40mm-aluminum-market-stall-folded-frame.jpg",
      "zh": "折叠收拢状态与交叉撑杆细节。",
      "en": "Folded frame and cross-brace details.",
      "width": 1440,
      "height": 1920
    },
    {
      "src": "/images/products/displays/market-stall-1x1-40mm/1x1m-40mm-aluminum-market-stall-partially-expanded-frame.jpg",
      "zh": "展开过程中的框架与连接件。",
      "en": "Frame and joints during expansion.",
      "width": 1440,
      "height": 1920
    },
    {
      "src": "/images/products/displays/market-stall-1x1-40mm/1x1m-40mm-aluminum-market-stall-counter-and-connectors.jpg",
      "zh": "台面示例、夹接部位与立柱调节孔。",
      "en": "Counter example, connector positions and upright adjustment holes.",
      "width": 1440,
      "height": 1080
    },
    {
      "src": "/images/products/displays/market-stall-1x1-40mm/1x1m-40mm-aluminum-market-stall-optional-carry-bag.jpg",
      "zh": "可配套手提包，是否包含请在报价中确认。",
      "en": "Compatible optional carry bag. Confirm whether it is included in the quotation.",
      "width": 1440,
      "height": 1920
    }
  ]
}
];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function schema(product, lang, url, otherUrl) {
  const text = product[lang];
  const home = lang === 'zh' ? `${ORIGIN}/zh/` : `${ORIGIN}/`;
  const products = lang === 'zh' ? `${ORIGIN}/zh/all-products.html` : `${ORIGIN}/all-products.html`;
  return JSON.stringify({
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: text.title, description: text.description, inLanguage: lang === 'zh' ? 'zh-CN' : 'en', isPartOf: { '@id': `${ORIGIN}/#website` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'zh' ? '首页' : 'Home', item: home },
        { '@type': 'ListItem', position: 2, name: lang === 'zh' ? '产品目录' : 'Products', item: products },
        { '@type': 'ListItem', position: 3, name: text.name, item: url },
      ] },
      { '@type': 'Product', '@id': `${url}#product`, name: text.name, sku: product.sku, model: product.model, url, description: text.description, image: `${ORIGIN}${product.image}`, brand: { '@type': 'Brand', name: 'WaiKwan' }, manufacturer: { '@type': 'Organization', name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd', url: ORIGIN } },
    ],
  }).replace(/</g, '\\u003c');
}

function basePage(product, lang) {
  const zh = lang === 'zh';
  const text = product[lang];
  const pathPrefix = zh ? '/zh' : '';
  const url = `${ORIGIN}${pathPrefix}/products/${product.slug}.html`;
  const otherUrl = `${ORIGIN}${zh ? '' : '/zh'}/products/${product.slug}.html`;
  const homeHref = zh ? '/zh/' : '/';
  const productsHref = zh ? '/zh/all-products.html' : '/all-products.html';
  const quoteLabel = product.internalCatalogKey || product.catalogIdentifier ? text.name : text.name.includes(product.sku) ? text.name : `${text.name} SKU ${product.sku}`;
  const contactHref = `${zh ? '/zh' : ''}/contact-us.html?product=${encodeURIComponent(quoteLabel)}#getQuoteForm`;
  const rows = product.specs
    ? `<div class="table-wrap"><table><thead><tr>${(zh ? product.headersZh : product.headersEn).map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${product.specs.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    : `<dl class="facts">${(zh ? product.factsZh : product.facts).map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
  const imageNote = zh ? product.imageNoteZh : product.imageNoteEn;
  return `<!doctype html>
<html lang="${zh ? 'zh-CN' : 'en'}">
<head>
${GTM_HEAD}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(text.title)}</title>
  <meta name="description" content="${esc(text.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${zh ? otherUrl : url}">
  <link rel="alternate" hreflang="zh-CN" href="${zh ? url : otherUrl}">
  <link rel="alternate" hreflang="x-default" href="${zh ? otherUrl : url}">
  <meta property="og:type" content="product"><meta property="og:site_name" content="WaiKwan"><meta property="og:title" content="${esc(text.title)}"><meta property="og:description" content="${esc(text.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${ORIGIN}${product.image}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(text.title)}"><meta name="twitter:description" content="${esc(text.description)}"><meta name="twitter:image" content="${ORIGIN}${product.image}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles/main.css?v=20261020-gallery"><link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <style>.static-product{max-width:1180px;margin:0 auto;padding:120px 24px 64px}.crumbs{margin-bottom:28px;font-size:.95rem}.crumbs a{color:#7c1d1d}.product-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,1fr);gap:42px;align-items:center}.product-hero img{width:100%;max-height:520px;object-fit:contain;background:#f6f6f6;border-radius:12px}.eyebrow{color:#8f171b;font-weight:700;letter-spacing:.04em}.lead{font-size:1.12rem;line-height:1.75}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.content-section{margin-top:52px}.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#ddd}.facts div{background:#fff;padding:16px}.facts dt{font-weight:700}.facts dd{margin:6px 0 0}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{padding:12px;border:1px solid #ddd;text-align:left}th{background:#f3f3f3}.source-note{padding:18px;border-left:4px solid #a4161a;background:#fff6f3}.image-note{font-size:.9rem;color:#555}.product-photo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.product-photo-grid figure{margin:0;min-width:0}.product-photo-grid img{width:100%;height:360px;object-fit:contain;background:#f6f6f6;border-radius:8px}.product-photo-grid figcaption{padding:12px 0}.lang-link{margin-left:auto}@media(max-width:780px){.product-hero{grid-template-columns:1fr}.facts{grid-template-columns:1fr}.product-photo-grid{grid-template-columns:1fr}}</style>
  <script type="application/ld+json">${schema(product, lang, url, otherUrl)}</script>
  <script src="/scripts/analytics.js?v=20260930-ga4-consent" defer></script>
  <script src="/scripts/main.js?v=20261020-lightbox-backpack" defer></script>
</head>
<body>
${GTM_BODY}
  <header class="navbar"><div class="nav-container"><a class="logo" href="${homeHref}"><img src="/favicon.svg" alt="WaiKwan" width="44" height="44"><span>WaiKwan</span></a><nav class="nav-menu"><a href="${productsHref}">${zh ? '产品目录' : 'Products'}</a><a href="${zh ? '/zh/about-us.html' : '/about-us.html'}">${zh ? '关于我们' : 'About'}</a><a href="${zh ? '/zh/contact-us.html' : '/contact-us.html'}">${zh ? '联系我们' : 'Contact'}</a></nav><a class="lang-link" href="${zh ? otherUrl : otherUrl}" hreflang="${zh ? 'en' : 'zh-CN'}">${zh ? 'English' : '中文'}</a></div></header>
  <main class="static-product">
    <nav class="crumbs" aria-label="${zh ? '面包屑' : 'Breadcrumb'}"><a href="${homeHref}">${zh ? '首页' : 'Home'}</a> / <a href="${productsHref}">${zh ? '产品目录' : 'Products'}</a> / <span>${esc(text.name)}</span></nav>
    <article>
      <div class="product-hero"><div><img src="${product.image}" alt="${esc(text.name)}" width="${product.imageWidth || 800}" height="${product.imageHeight || 800}" fetchpriority="high">${imageNote ? `<p class="image-note">${esc(imageNote)}</p>` : ''}</div><div><p class="eyebrow">${product.internalCatalogKey ? (zh ? '普通黑金刚 · 3×3 米扁管架' : 'Standard Black · 3×3 m flat-tube frame') : product.catalogIdentifier ? esc(text.name) : `SKU ${esc(product.sku)} · ${esc(product.model)}`}</p><h1>${esc(text.name)}</h1><p class="lead">${esc(text.intro)}</p><div class="actions"><a class="btn btn-primary" href="${contactHref}">${zh ? '获取报价' : 'Request a Quote'}</a><a class="btn btn-secondary" href="${productsHref}">${zh ? '查看全部产品' : 'View All Products'}</a></div></div></div>
      <section class="content-section"><h2>${zh ? '已确认规格' : 'Confirmed specifications'}</h2>${rows}</section>
      ${product.gallery ? `<section class="content-section"><h2>${zh ? '产品实拍与结构细节' : 'Real product photographs and frame details'}</h2><div class="product-photo-grid">${product.gallery.map(photo => `<figure><a href="${esc(photo.src)}"><img src="${esc(photo.src)}" alt="${esc(text.name + ' — ' + photo[lang])}" width="${photo.width || product.imageWidth}" height="${photo.height || product.imageHeight}" loading="lazy" decoding="async"></a><figcaption>${esc(photo[lang])}</figcaption></figure>`).join('')}</div></section>` : ''}
      <section class="content-section"><h2>${zh ? '常见应用' : 'Common applications'}</h2><ul>${text.applications.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="content-section"><h2>${zh ? '询价资料与采购确认' : 'Quotation documents and order checks'}</h2><p>${zh ? '请发送型号、数量、目的地及画面文件；目录未列出的材质、安装或包装参数请在报价中逐项确认。' : 'Send the model, quantity, destination and artwork. Confirm materials, installation details and packing values that are not listed in the catalog in the written quotation.'}</p><ul><li><a href="/${encodeURI('广西伟群帐篷制造有限公司2025改.pdf')}">${zh ? '下载公司产品目录 PDF（2025版）' : 'Download the company product catalog PDF (2025 edition)'}</a></li><li><a href="${zh ? '/zh' : ''}/faq-artwork-files.html">${zh ? '画面文件准备要求' : 'Artwork file preparation'}</a></li><li><a href="${zh ? '/zh' : ''}/faq-shipping.html">${zh ? '包装与运输询价信息' : 'Packing and shipping questions'}</a></li></ul></section>
      <section class="content-section source-note"><h2>${zh ? '询价前说明' : 'Before requesting a quote'}</h2><p>${esc(text.note)}</p><p>${zh ? '本页参数来自伟群当前产品目录记录；未列出的参数请以书面报价确认为准。' : 'Specifications on this page come from WaiKwan’s current product catalog record. Confirm unlisted details in the written quotation.'}</p></section>
    </article>
  </main>
</body>
</html>\n`;
}


// Use the established tent page shell and gallery for this folding-frame product.
function page(product, lang) {
  const original = basePage(product, lang);
  if (product.slug === '1x1m-40mm-aluminum-market-stall') return marketStallPage(product, lang, original);
  if (product.slug === 'curved-fabric-banner-stand') return displayProductPage(product, lang, original);
  if (!product.internalCatalogKey) return original;
  const zh = lang === 'zh', text = product[lang], prefix = zh ? '/zh' : '';
  const template = fs.readFileSync(path.join(ROOT, 'tent-type.html'), 'utf8');
  const localizeShell = html => html.replace(/\b(href|src)="([^"]+)"/g, (all, attr, value) => {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(value)) return all;
    const clean = value.replace(/^\.?\//, '');
    const asset = /^(images|scripts|styles)\//.test(clean) || /^(favicon|site\.webmanifest)/.test(clean);
    const localized = !asset && zh && fs.existsSync(path.join(ROOT, 'zh', clean.split(/[?#]/)[0]));
    return `${attr}="${localized ? '/zh/' : '/'}${clean}"`;
  });
  const header = localizeShell(template.slice(template.indexOf('  <!-- Top bar -->'), template.indexOf('  <main>')));
  const footerStart = template.indexOf('<section class="contact-bottom">');
  const footer = localizeShell(template.slice(footerStart, template.indexOf('    </main>', footerStart)));
  const quote = `${prefix}/contact-us.html?product=${encodeURIComponent(text.name)}#getQuoteForm`;
  const thumbs = product.gallery.map((photo, i) => `<button type="button" class="tent-type-folding-gallery__thumb${i === 0 ? ' is-active' : ''}" data-frame-photo="${i}" aria-pressed="${i === 0}" aria-label="${esc(photo[lang])}"><img src="${esc(photo.src)}" alt="${esc(photo[lang])}" width="${photo.width}" height="${photo.height}"></button>`).join('');
  const facts = (zh ? product.factsZh : product.facts).map(([k,v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  const sizeRows = product.sizes.map(size => `<tr><td>${esc(size)} ${zh ? '米' : 'm'}</td><td>${size === '3 × 3' ? (zh ? '本页实拍示例尺寸' : 'Photographed sample size') : (zh ? '可选规格' : 'Available size')}</td></tr>`).join('');
  const main = `<main><section class="products" style="padding-top:110px"><div class="container">
  <nav class="breadcrumb" aria-label="${zh ? '面包屑' : 'Breadcrumb'}"><a href="${prefix}/">${zh ? '首页' : 'Home'}</a> / <a href="${prefix}/tent-type.html">${zh ? '帐篷' : 'Canopy Tents'}</a> / <span>${esc(text.name)}</span></nav>
  <article class="tent-type-detail"><h1>${esc(text.name)}</h1><p class="frame-intro">${esc(text.intro)}</p>
  <div class="tent-type-folding-gallery"><div class="tent-type-card__imgWrap tent-type-folding-gallery__heroWrap"><img id="frameMainImage" class="tent-type-card__img tent-type-folding-gallery__main" src="${product.image}" alt="${esc(product.gallery[0][lang])}" width="810" height="1440" fetchpriority="high"></div><div class="tent-type-folding-gallery__thumbs">${thumbs}</div><p id="framePhotoCaption">${esc(product.gallery[0][lang])}</p></div>
  <section class="tent-type-detail__block"><h2 class="tent-type-detail__blockTitle">${zh ? '可选尺寸' : 'Available Sizes'}</h2><div class="tent-type-detail__tableWrap"><table class="tent-type-detail__table"><thead><tr><th>${zh ? '尺寸' : 'Size'}</th><th>${zh ? '说明' : 'Notes'}</th></tr></thead><tbody>${sizeRows}</tbody></table></div></section>
  <section class="tent-type-detail__block"><h2 class="tent-type-detail__blockTitle">${zh ? '型号参数' : 'Models & Specifications'}</h2><div class="tent-type-detail__tableWrap"><table class="tent-type-detail__table">${facts}</table></div></section>
  <section class="tent-type-detail__block"><h2 class="tent-type-detail__blockTitle">${zh ? '选型说明' : 'Frame Selection'}</h2><p>${zh ? '普通黑金刚为独立的扁管架款式，不能套用 30 方管铁架或 40/50 六角铝架的重量、壁厚和性能参数。请结合撑杆、连接件及顶布适配要求选型。' : 'Standard Black is a separate flat-tube frame model. Do not apply the weight, wall thickness or performance specifications of the 30 square-tube or 40/50 hexagonal frames. Compare brace profile, joints and canopy compatibility.'}</p></section>
  <section class="tent-type-detail__block"><h2 class="tent-type-detail__blockTitle">${zh ? '询价前说明' : 'Before Requesting a Quote'}</h2><p>${esc(text.note)}</p><div class="wk-tent-cta"><a class="btn btn-primary" href="${quote}">${zh ? '获取报价' : 'Request a Quote'}</a><a class="btn btn-secondary" href="${prefix}/all-products.html">${zh ? '查看全部产品' : 'View All Products'}</a></div></section></article></div></section>${footer}</main>`;
  const scripts = `<script src="/scripts/tent-types.js"></script><script src="/scripts/products.js?v=20261020-canopy-details"></script><script src="/scripts/cart.js"></script><script src="/scripts/main.js?v=20261020-lightbox-backpack"></script><script src="/scripts/multilang.js?v=20261020-lightbox-backpack"></script><script src="/scripts/get-quote-footer.js?v=20261020-xhs-logo"></script><script src="/scripts/standard-black-frame.js"></script>`;
  return original.replace(/<style>[\s\S]*?<\/style>/, `<link rel="stylesheet" href="/styles/multilang.css"><link rel="stylesheet" href="/styles/cart.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"><style>.frame-intro{line-height:1.8;margin:20px 0}.tent-type-detail>h1{font-size:1.65rem;margin:28px 0 12px}.tent-type-folding-gallery__heroWrap{border:1px solid var(--wk-border-light);border-radius:var(--radius-lg);overflow:hidden}.tent-type-folding-gallery__heroWrap #frameMainImage{height:600px;object-fit:contain}.wk-tent-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}@media(max-width:780px){.tent-type-folding-gallery__heroWrap #frameMainImage{height:440px}.tent-type-detail>h1{font-size:1.4rem}}</style>`)
    .replace('  <script src="/scripts/main.js?v=20261020-lightbox-backpack" defer></script>', '<script src="/scripts/bilingual-routing.js?v=20261014-static-stand" defer></script>')
    .replace(/  <header class="navbar">[\s\S]*?<\/header>/, header)
    .replace(/  <main class="static-product">[\s\S]*?<\/main>/, main)
    .replace('</body>', scripts + '\n</body>');
}

function displayProductPage(product, lang, original) {
  const zh = lang === 'zh', text = product[lang], prefix = zh ? '/zh' : '';
  const template = fs.readFileSync(path.join(ROOT, `${zh ? 'zh/' : ''}product-detail.html`), 'utf8');
  const localize = html => html.replace(/\b(href|src)="([^"]+)"/g, (all, attr, value) => {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/|\/)/.test(value)) return all;
    const clean = value.replace(/^\.\//, '');
    const asset = /^(images|scripts|styles)\//.test(clean) || /^(favicon|site\.webmanifest)/.test(clean);
    const mirror = !asset && zh && fs.existsSync(path.join(ROOT, 'zh', clean.split(/[?#]/)[0]));
    return `${attr}="${mirror ? '/zh/' : '/'}${clean}"`;
  });
  const header = localize(template.slice(template.indexOf('    <!-- 语言切换器 -->'), template.indexOf('    <main class="product-detail">')));
  const footerStart = template.indexOf('<section class="contact-bottom">');
  const footer = localize(template.slice(footerStart, template.indexOf('    </main>', footerStart)));
  const facts = zh ? product.factsZh : product.facts;
  const quote = `${prefix}/contact-us.html?product=${encodeURIComponent(text.name)}#getQuoteForm`;
  const pdf = '/' + encodeURI('广西伟群帐篷制造有限公司2025改.pdf');
  const labels = zh ? ['产品描述', '技术参数', '应用场景', '资料下载'] : ['Description', 'Specifications', 'Applications', 'Downloads'];
  const keys = ['desc', 'specs', 'apps', 'download'];
  const thumbs = product.gallery.map((photo, i) => `<button type="button" data-static-photo aria-pressed="${i === 0}" aria-label="${esc(photo[lang])}"><img class="${i === 0 ? 'is-active' : ''}" src="${photo.src}" alt="${esc(photo[lang])}" width="4032" height="3024" loading="lazy" decoding="async"></button>`).join('');
  const main = `<main class="product-detail" data-static-product="fabric-banner-stand-curved">
    <nav class="breadcrumbs" style="margin-top:110px" aria-label="${zh ? '面包屑' : 'Breadcrumb'}"><a href="${prefix}/">${zh ? '首页' : 'Home'}</a><span class="sep">/</span><a href="${prefix}/product-center.html?cat=displays">${zh ? '展示系统' : 'Display Systems'}</a><span class="sep">/</span><span>${esc(text.name)}</span></nav>
    <section class="pdp-top" id="productDetailBody">
      <div><div class="pdp-image"><img id="productImage" src="${product.image}" alt="${esc(text.name)}" width="4032" height="3024" fetchpriority="high" decoding="async"><div class="image-carousel">${thumbs}</div></div><p class="pdp-desc" id="staticPhotoCaption">${esc(zh ? product.imageNoteZh : product.imageNoteEn)}</p></div>
      <div class="pdp-info"><h1 id="productName">${esc(text.name)}</h1><p class="pdp-desc" id="productDesc">${esc(text.intro)}</p><ul class="pdp-specs">${facts.map(([k,v]) => `<li><strong>${esc(k)}：</strong> ${esc(v)}</li>`).join('')}</ul><div class="pdp-actions"><a class="btn btn-primary" href="${quote}">${zh ? '获取报价' : 'Get Quote'}</a><a class="btn btn-secondary" href="${pdf}" target="_blank" rel="noopener">${zh ? '下载' : 'Download'}</a><button class="btn btn-accent" type="button" data-static-cart>${zh ? '加入询价车' : 'Add to Cart'}</button></div></div>
    </section>
    <section class="pdp-tabs"><div class="tabs-header" role="tablist" aria-label="${zh ? '产品资料' : 'Product information'}">${keys.map((key,i) => `<button type="button" class="tab${i === 0 ? ' active' : ''}" id="static-tab-${key}" data-static-tab="${key}" role="tab" aria-selected="${i === 0}" aria-controls="tab-${key}" tabindex="${i === 0 ? 0 : -1}">${labels[i]}</button>`).join('')}</div><div class="tabs-content">
      <div class="tab-panel active" id="tab-desc" role="tabpanel" aria-labelledby="static-tab-desc"><h2>${labels[0]}</h2><p>${esc(text.intro)}</p><p>${esc(text.note)}</p></div>
      <div class="tab-panel" id="tab-specs" role="tabpanel" aria-labelledby="static-tab-specs"><h2>${labels[1]}</h2><div class="tent-type-detail__tableWrap"><table class="tent-type-detail__table"><tbody>${facts.map(([k,v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div><p>${esc(text.note)}</p></div>
      <div class="tab-panel" id="tab-apps" role="tabpanel" aria-labelledby="static-tab-apps"><h2>${labels[2]}</h2><ul>${text.applications.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="tab-panel" id="tab-download" role="tabpanel" aria-labelledby="static-tab-download"><h2>${labels[3]}</h2><p>${zh ? '下载伟群产品目录；弧形画面版型请在印刷前联系确认。' : 'Download the WaiKwan product catalog. Contact us to confirm the curved graphic template before printing.'}</p><a class="btn btn-secondary" href="${pdf}" target="_blank" rel="noopener">${zh ? '下载产品目录 PDF' : 'Download Product Catalog PDF'}</a></div>
    </div></section>
    <section class="related-products"><h2>${zh ? '相关产品' : 'Related Products'}</h2><div class="pdp-actions"><a class="btn btn-secondary" href="${prefix}/product-detail.html?sku=42005">${zh ? '直形立牌系列' : 'Straight Fabric Banner Stands'}</a><a class="btn btn-secondary" href="${prefix}/portable-display-systems.html">${zh ? '便携展示系统' : 'Portable Display Systems'}</a></div></section>
    ${footer}
  </main>`;
  const scripts = `<button class="back-to-top" id="backToTop" type="button" aria-label="${zh ? '返回顶部' : 'Back to top'}"><i class="fas fa-chevron-up" aria-hidden="true"></i></button>
  <script src="/scripts/products.js?v=20261020-canopy-details"></script><script src="/scripts/cart.js"></script><script src="/scripts/main.js?v=20261020-lightbox-backpack"></script><script src="/scripts/multilang.js?v=20261020-lightbox-backpack"></script><script src="/scripts/get-quote-footer.js?v=20261020-xhs-logo"></script><script src="/scripts/static-product-detail.js?v=20261014-layout"></script>`;
  return original.replace(/<style>[\s\S]*?<\/style>/, `<link rel="stylesheet" href="/styles/multilang.css"><link rel="stylesheet" href="/styles/cart.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"><style>[data-static-photo]{background:none;border:0;padding:0;cursor:pointer} .related-products{margin-bottom:32px}</style>`)
    .replace('  <script src="/scripts/main.js?v=20261020-lightbox-backpack" defer></script>', '<script src="/scripts/bilingual-routing.js?v=20261014-static-stand" defer></script>')
    .replace(/  <header class="navbar">[\s\S]*?<\/header>/, header)
    .replace(/  <main class="static-product">[\s\S]*?<\/main>/, main)
    .replace('</body>', scripts + '\n</body>');
}

function marketStallPage(product, lang, original) {
  const zh = lang === 'zh', text = product[lang], prefix = zh ? '/zh' : '';
  const template = fs.readFileSync(path.join(ROOT, 'tent-type.html'), 'utf8');
  const localize = html => html.replace(/\b(href|src)="([^"]+)"/g, (all, attr, value) => {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(value)) return all;
    const clean = value.replace(/^\.?\//, '');
    const asset = /^(images|scripts|styles)\//.test(clean) || /^(favicon|site\.webmanifest)/.test(clean);
    const mirror = zh && !asset && fs.existsSync(path.join(ROOT, 'zh', clean.split(/[?#]/)[0]));
    return `${attr}="${mirror ? '/zh/' : '/'}${clean}"`;
  });
  const header = localize(template.slice(template.indexOf('  <!-- Top bar -->'), template.indexOf('  <main>')));
  const start = template.indexOf('<section class="contact-bottom">');
  const footer = localize(template.slice(start, template.indexOf('    </main>', start)));
  const quote = `${prefix}/contact-us.html?product=${encodeURIComponent(text.name)}#getQuoteForm`;
  const facts = zh ? product.factsZh : product.facts;
  const labels = zh ? ['产品描述', '技术参数', '应用场景', '资料下载'] : ['Description', 'Specifications', 'Applications', 'Downloads'];
  const keys = ['desc', 'specs', 'apps', 'download'];
  const thumbs = product.gallery.map((photo, i) => `<button type="button" data-static-photo aria-pressed="${i === 0}" aria-label="${esc(photo[lang])}"><img class="${i === 0 ? 'is-active' : ''}" src="${photo.src}" alt="${esc(photo[lang])}" width="${photo.width}" height="${photo.height}" loading="lazy"></button>`).join('');
  const main = `<main class="product-detail" data-static-product="market-stall-1x1-40mm">
    <nav class="breadcrumbs" style="margin-top:110px" aria-label="${zh ? '面包屑' : 'Breadcrumb'}"><a href="${prefix}/">${zh ? '首页' : 'Home'}</a><span class="sep">/</span><a href="${prefix}/product-center.html?cat=displays">${zh ? '展示系统' : 'Display Systems'}</a><span class="sep">/</span><span>${esc(text.name)}</span></nav>
    <section class="pdp-top" id="productDetailBody"><div><div class="pdp-image pdp-image--gallery"><img id="productImage" src="${product.image}" alt="${esc(product.gallery[0][lang])}" width="${product.imageWidth}" height="${product.imageHeight}" fetchpriority="high"><div class="image-carousel">${thumbs}</div></div><p class="pdp-desc" id="staticPhotoCaption">${esc(zh ? product.imageNoteZh : product.imageNoteEn)}</p></div><div class="pdp-info"><h1 id="productName">${esc(text.name)}</h1><p class="pdp-desc">${esc(text.intro)}</p><ul class="pdp-specs">${facts.map(([k,v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('')}</ul><div class="pdp-actions"><a class="btn btn-primary" href="${quote}">${zh ? '获取报价' : 'Get Quote'}</a><a class="btn btn-secondary" href="${prefix}/all-products.html?cat=displays">${zh ? '查看展示系统' : 'Browse Displays'}</a><button class="btn btn-accent" type="button" data-static-cart>${zh ? '加入询价车' : 'Add to Cart'}</button></div></div></section>
    <section class="pdp-tabs"><div class="tabs-header" role="tablist">${keys.map((key,i) => `<button type="button" class="tab${i === 0 ? ' active' : ''}" data-static-tab="${key}" id="stall-tab-${key}" role="tab" aria-selected="${i === 0}" aria-controls="tab-${key}" tabindex="${i === 0 ? 0 : -1}">${labels[i]}</button>`).join('')}</div><div class="tabs-content">
    <div class="tab-panel active" id="tab-desc" role="tabpanel" aria-labelledby="stall-tab-desc"><h2>${labels[0]}</h2><p>${esc(text.intro)}</p><p>${esc(text.note)}</p><div class="product-photo-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px">${product.gallery.map(photo => `<figure style="margin:0"><a href="${photo.src}" target="_blank" rel="noopener"><img src="${photo.src}" alt="${esc(photo[lang])}" width="${photo.width}" height="${photo.height}" loading="lazy" style="width:100%;height:280px;object-fit:contain"></a><figcaption>${esc(photo[lang])}</figcaption></figure>`).join('')}</div></div>
    <div class="tab-panel" id="tab-specs" role="tabpanel" aria-labelledby="stall-tab-specs"><h2>${labels[1]}</h2><table class="pdp-spec-table"><tbody>${facts.map(([k,v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table><p>${esc(text.note)}</p></div>
    <div class="tab-panel" id="tab-apps" role="tabpanel" aria-labelledby="stall-tab-apps"><h2>${labels[2]}</h2><ul>${text.applications.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div>
    <div class="tab-panel" id="tab-download" role="tabpanel" aria-labelledby="stall-tab-download"><h2>${labels[3]}</h2><p>${zh ? '下载公司目录；本款专用画面模板及未列参数请联系确认。' : 'Download the company catalog; contact us for this model’s graphic template and unlisted specifications.'}</p><a class="btn btn-secondary" href="/${encodeURI('广西伟群帐篷制造有限公司2025改.pdf')}">${zh ? '下载公司目录 PDF（2025版）' : 'Download Company Catalog PDF (2025)'}</a></div></div></section>
    ${footer}</main>`;
  const scripts = `<script src="/scripts/products.js?v=20261020-canopy-details"></script><script src="/scripts/cart.js"></script><script src="/scripts/main.js?v=20261020-lightbox-backpack"></script><script src="/scripts/multilang.js?v=20261020-lightbox-backpack"></script><script src="/scripts/get-quote-footer.js?v=20261020-xhs-logo"></script><script src="/scripts/static-product-detail.js"></script>`;
  return original.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/styles/multilang.css"><link rel="stylesheet" href="/styles/cart.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"><style>[data-static-photo]{background:none;border:0;padding:0;cursor:pointer;flex-shrink:0}</style>')
    .replace('  <script src="/scripts/main.js?v=20261020-lightbox-backpack" defer></script>', '<script src="/scripts/bilingual-routing.js?v=20261014-static-stand" defer></script>')
    .replace(/  <header class="navbar">[\s\S]*?<\/header>/, header)
    .replace(/  <main class="static-product">[\s\S]*?<\/main>/, main)
    .replace('</body>', scripts+'\n</body>');
}

const check = process.argv.includes('--check');
let failed = false;
for (const product of STATIC_PRODUCTS) {
  for (const lang of ['en', 'zh']) {
    const rel = `${lang === 'zh' ? 'zh/' : ''}products/${product.slug}.html`;
    const dest = path.join(ROOT, rel);
    const output = page(product, lang).replace(/[ \t]+$/gm, '');
    if (check) {
      // Windows checkouts may use CRLF; compare generated content independently of line endings.
      if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8').replace(/\r\n/g, '\n') !== output.replace(/\r\n/g, '\n')) {
        console.error(`Out of date: ${rel}`);
        failed = true;
      }
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, output, 'utf8');
      console.log(`Wrote ${rel}`);
    }
  }
}
if (failed) process.exit(1);
if (check) console.log(`OK: ${STATIC_PRODUCTS.length * 2} static product pages are current.`);
