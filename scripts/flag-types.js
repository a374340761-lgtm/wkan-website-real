// Flag Types Hub data (Beach Flags & Poles)
// Global export: window.FLAG_TYPES
(function () {
  'use strict';

  // NOTE: The folder name contains spaces; use URL-encoded paths in src/href.
  const PDF_BASE = 'images/products/flags/page%20in%20pdf';
  // NOTE: The folder name contains Chinese characters; use encodeURI for safety.
  const CATALOG_ALLPAGE_BASE = encodeURI('images/\u5e7f\u897f\u4f1f\u7fa4\u5e10\u7bf7\u5236\u9020\u6709\u9650\u516c\u53f82025allpagepng');

  const FLAG_HERO = (fileName) => encodeURI(`images/products/flags/hero/${fileName}`);
  // Local accessory photos (folder may contain spaces in filenames)
  const FLAG_ACCESSORIES_IMG = (fileName) => encodeURI(`images/products/flags/accessories/${fileName}`);

  window.FLAG_TYPES = {
    poles: [
      {
        type: 'fiberglass_pole',
        nameEn: 'Beach Flag Poles (Fiberglass Pole)',
        nameZh: '沙滩旗杆（玻纤杆）',
        hubDescEn: 'Modular fiberglass poles with multiple heights for teardrop/feather flags.',
        hubDescZh: '多段式玻纤旗杆，多种高度可选，适配水滴/刀旗。',
        storyEn: 'The third generation beach flag poles. Multiple heights available for different flag shapes.',
        storyZh: '第三代沙滩旗杆，多种高度可选，适配不同旗形。',
        heroImage: FLAG_HERO('Beach Flag Poles Fiberglass Pole Aluminium Fiberglass hero.png'),
        guideImage: `${PDF_BASE}/10.png`,
        infoBlocks: [
          {
            titleEn: 'Available Heights (Flag Poles)',
            titleZh: '可选高度（Flag Poles）',
            textEn: ['2.3m', '2.8m', '3.4m', '4.5m', '5.5m', '6.5m'].join('\n'),
            textZh: ['2.3m', '2.8m', '3.4m', '4.5m', '5.5m', '6.5m'].join('\n')
          },
          {
            titleEn: 'Material',
            titleZh: '材质',
            textEn: 'Fiberglass pole',
            textZh: '玻璃纤维（玻纤杆）'
          }
        ],
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'style', labelEn: 'Style', labelZh: '高度' },
            { key: 'description', labelEn: 'Description', labelZh: '描述' },
            { key: 'poleSize', labelEn: 'Pole Size', labelZh: '杆长' },
            { key: 'flagSize', labelEn: 'Flag Size (Teardrop / Feather)', labelZh: '旗面尺寸（水滴/刀旗）' },
            { key: 'packing', labelEn: 'Packing', labelZh: '装箱' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
          ],
          rows: [
            { model: 'WK-XS', style: '2.3m', description: '2PCS Fiberglass Pole', poleSize: '115cm×2', flagSize: '50×160cm / 50×180cm', packing: '50pcs', carton: '120×25×19cm', weight: '14kg' },
            { model: 'WK-S', style: '2.8m', description: '3PCS Fiberglass Pole', poleSize: '55cm + 115cm×2', flagSize: '70×165cm / 50×200cm', packing: '40pcs', carton: '120×25×19cm', weight: '16kg' },
            { model: 'WK-M', style: '3.4m', description: '3PCS Fiberglass Pole', poleSize: '115cm×3', flagSize: '90×200cm / 60×250cm', packing: '30pcs', carton: '120×25×19cm', weight: '20.5kg' },
            { model: 'WK-L', style: '4.5m', description: '4PCS Fiberglass Pole', poleSize: '115cm×4', flagSize: '100×280cm / 70×370cm', packing: '20pcs', carton: '120×25×19cm', weight: '22kg' },
            { model: 'WK-XL', style: '5.5m', description: '5PCS Fiberglass Pole', poleSize: '115cm×5', flagSize: '125×350cm / 75×450cm', packing: '15pcs', carton: '120×25×19cm', weight: '21.6kg' },
            { model: 'WK-XXL', style: '6.5m', description: '6PCS Fiberglass Pole', poleSize: '115cm×6', flagSize: '130×400cm / 80×500cm', packing: '10pcs', carton: '120×25×19cm', weight: '20kg' }
          ]
        }
      },
      {
        type: 'alu_fiberglass_pole',
        nameEn: 'Beach Flag Poles (Aluminium + Fiberglass)',
        nameZh: '沙滩旗杆（铝管 + 玻纤）',
        hubDescEn: 'Aluminium sections + fiberglass sections. Two versions available.',
        hubDescZh: '铝管段 + 玻纤段组合，两种版本可选。',
        storyEn: 'Hybrid aluminium + fiberglass poles for improved rigidity and portability.',
        storyZh: '铝管与玻纤组合旗杆，兼顾强度与便携。',
        heroImage: FLAG_HERO('Beach Flag Poles Fiberglass Pole Aluminium Fiberglass hero.png'),
        guideImage: `${PDF_BASE}/10.png`,
        variants: [
          {
            key: 'v1',
            labelEn: 'Version 1',
            labelZh: '版本一',
            specTable: {
              columns: [
                { key: 'model', labelEn: 'Model', labelZh: '型号' },
                { key: 'style', labelEn: 'Style', labelZh: '高度' },
                { key: 'description', labelEn: 'Description', labelZh: '描述' },
                { key: 'poleSize', labelEn: 'Pole Size', labelZh: '杆长' },
                { key: 'flagSize', labelEn: 'Flag Size', labelZh: '旗面尺寸' },
                { key: 'packing', labelEn: 'Packing', labelZh: '装箱' },
                { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
                { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
              ],
              rows: [
                { model: 'AD-S', style: '2.8m', description: '2 pcs Aluminium Poles + 2 pcs Fiberglass Poles', poleSize: '66cm×2 + 70cm + 90cm', flagSize: '70×170cm', packing: '25pcs', carton: '94×25×15cm', weight: '11.3kg' },
                { model: 'AD-M', style: '3.4m', description: '2 pcs Aluminium Poles + 2 pcs Fiberglass Poles', poleSize: '86cm×2 + 90cm×2', flagSize: '90×200cm', packing: '25pcs', carton: '94×25×15cm', weight: '12kg' },
                { model: 'AD-L', style: '4.5m', description: '2 pcs Aluminium Poles + 2 pcs Fiberglass Poles', poleSize: '110cm×2 + 115cm×2', flagSize: '100×280cm', packing: '35pcs', carton: '123×26×19cm', weight: '20kg' },
                { model: 'AD-XL', style: '5.5m', description: '2 pcs Aluminium Poles + 2 pcs Fiberglass Poles', poleSize: '110cm×3 + 115cm×2', flagSize: '125×350cm', packing: '20pcs', carton: '123×26×19cm', weight: '17kg' }
              ]
            }
          },
          {
            key: 'v2',
            labelEn: 'Version 2',
            labelZh: '版本二',
            specTable: {
              columns: [
                { key: 'model', labelEn: 'Model', labelZh: '型号' },
                { key: 'style', labelEn: 'Style', labelZh: '高度' },
                { key: 'description', labelEn: 'Description', labelZh: '描述' },
                { key: 'poleSize', labelEn: 'Pole Size', labelZh: '杆长' },
                { key: 'flagSize', labelEn: 'Flag Size', labelZh: '旗面尺寸' },
                { key: 'packing', labelEn: 'Packing', labelZh: '装箱' },
                { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
                { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
              ],
              rows: [
                { model: 'AD-S', style: '2.8m', description: '2 pcs Aluminium Poles + 1 pcs Fiberglass Pole', poleSize: '93cm×2 + 94cm', flagSize: '50×200cm', packing: '40pcs', carton: '94×25×15cm', weight: '14kg' },
                { model: 'AD-M', style: '3.4m', description: '2 pcs Aluminium Poles + 1 pcs Fiberglass Pole', poleSize: '110cm×2 + 115cm', flagSize: '60×250cm', packing: '40pcs', carton: '123×26×19cm', weight: '17kg' },
                { model: 'AD-L', style: '4.5m', description: '2 pcs Aluminium Poles + 1 pcs Fiberglass Pole', poleSize: '110cm×3 + 115cm', flagSize: '70×370cm', packing: '30pcs', carton: '123×26×19cm', weight: '17.9kg' },
                { model: 'AD-XL', style: '5.5m', description: '2 pcs Aluminium Poles + 1 pcs Fiberglass Pole', poleSize: '110cm×4 + 115cm', flagSize: '75×450cm', packing: '20pcs', carton: '123×26×19cm', weight: '17.6kg' }
              ]
            }
          }
        ]
      },
      {
        type: 'fully_fiberglass_teardrop',
        nameEn: 'Teardrop Beach Flag Poles (Fully Fiberglass)',
        nameZh: '水滴型沙滩旗杆（全玻纤）',
        hubDescEn: 'Fully fiberglass teardrop poles for outdoor use.',
        hubDescZh: '全玻纤水滴旗杆，适合户外活动。',
        storyEn: 'Fully fiberglass pole sets for teardrop beach flags.',
        storyZh: '全玻纤旗杆套装（水滴旗）。',
        heroImage: FLAG_HERO('Teardropbeachflagpoleshero.jpg'),
        guideImage: `${PDF_BASE}/11.png`,
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'style', labelEn: 'Style', labelZh: '高度' },
            { key: 'description', labelEn: 'Description', labelZh: '描述' },
            { key: 'poleSize', labelEn: 'Pole Size', labelZh: '杆长' },
            { key: 'flagSize', labelEn: 'Flag Size', labelZh: '旗面尺寸' },
            { key: 'packing', labelEn: 'Packing', labelZh: '装箱' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
          ],
          rows: [
            { model: 'AD-D1', style: '2.9m', description: '2 fiberglass poles', poleSize: '149cm + 149cm', flagSize: '80×195cm', packing: '20pcs', carton: '153×24×22cm', weight: '19kg' },
            { model: 'AD-D2', style: '4.3m', description: '3 fiberglass poles', poleSize: '149cm×2 + 148cm', flagSize: '100×310cm', packing: '10pcs', carton: '153×22×14cm', weight: '12kg' },
            { model: 'AD-D3', style: '5.6m', description: '4 fiberglass poles', poleSize: '149cm×3 + 148cm', flagSize: '120×360cm', packing: '10pcs', carton: '153×22×14cm', weight: '14.6kg' }
          ]
        }
      },
      {
        type: 'fully_fiberglass_feather',
        nameEn: 'Feather Beach Flag Poles (Fully Fiberglass)',
        nameZh: '刀型沙滩旗杆（全玻纤）',
        hubDescEn: 'Fully fiberglass feather poles for outdoor use.',
        hubDescZh: '全玻纤刀旗杆，适合户外活动。',
        storyEn: 'Fully fiberglass pole sets for feather beach flags.',
        storyZh: '全玻纤旗杆套装（刀旗）。',
        heroImage: FLAG_HERO('featherhero.png'),
        guideImage: `${PDF_BASE}/11.png`,
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'style', labelEn: 'Style', labelZh: '高度' },
            { key: 'description', labelEn: 'Description', labelZh: '描述' },
            { key: 'poleSize', labelEn: 'Pole Size', labelZh: '杆长' },
            { key: 'flagSize', labelEn: 'Flag Size', labelZh: '旗面尺寸' },
            { key: 'packing', labelEn: 'Packing', labelZh: '装箱' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
          ],
          rows: [
            { model: 'AD-A1', style: '2.9m', description: '2 fiberglass poles', poleSize: '149cm + 149cm', flagSize: '65×210cm', packing: '20pcs', carton: '153×24×22cm', weight: '19kg' },
            { model: 'AD-A2', style: '3.9m', description: '3 fiberglass poles', poleSize: '136cm×3', flagSize: '75×320cm', packing: '10pcs', carton: '153×22×13cm', weight: '11.5kg' },
            { model: 'AD-A3', style: '5.1m', description: '4 fiberglass poles', poleSize: '136cm×4', flagSize: '80×420cm', packing: '10pcs', carton: '153×22×14cm', weight: '14.5kg' }
          ]
        }
      },
      {
        type: 'outdoor_giant_flag',
        nameEn: 'Outdoor Giant Flag (Water Base)',
        nameZh: '户外注水旗杆（Giant Flag）',
        hubDescEn: 'Telescopic aluminium pole with water-filled base for stability.',
        hubDescZh: '伸缩铝旗杆 + 注水底座，适合户外高可视展示。',
        storyEn: [
          'The giant flagpole is ideal for outdoor events, conferences and sports events.',
          'The telescopic aluminium flag pole fits into a plastic molded base that can be filled with water for stability.',
          'The flag is held on using a top cap and rings and can rotate with the wind direction.'
        ].join('\n'),
        storyZh: [
          '户外注水旗杆适用于户外活动、会议、体育赛事等场景。',
          '伸缩铝旗杆插入可注水底座以增强稳定性。',
          '旗面通过顶帽与环固定，可随风向自由旋转。'
        ].join('\n'),
        heroImage: FLAG_HERO('Outdoor Giant Flaghero.png'),
        guideImage: `${PDF_BASE}/12.png`,
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'frameSize', labelEn: 'Frame Size (m)', labelZh: '旗杆高度（m）' },
            { key: 'graphicSize', labelEn: 'Graphic Size (m)', labelZh: '旗面尺寸（m）' },
            { key: 'nw', labelEn: 'N.W (kg)', labelZh: '净重（kg）' },
            { key: 'gw', labelEn: 'G.W (kg)', labelZh: '毛重（kg）' },
            { key: 'pcs', labelEn: 'Pcs/ctn', labelZh: '装箱' },
            { key: 'packing', labelEn: 'Packing size (cm)', labelZh: '包装尺寸（cm）' }
          ],
          rows: [
            { model: 'AD-11Z01', frameSize: '3', graphicSize: '0.6 × 1.8', nw: '19', gw: '21', pcs: '20 / 1', packing: '71×71×57 / 15×15×154' },
            { model: 'AD-11Z02', frameSize: '5', graphicSize: '1.2 × 3.5', nw: '17.5', gw: '20', pcs: '1 / 2', packing: '81×42×43 / 13×13×164' },
            { model: 'AD-11Z03', frameSize: '7', graphicSize: '1.2 × 5', nw: '23', gw: '25', pcs: '1 / 2', packing: '81×42×43 / 13×13×164' }
          ]
        },
        infoBlocks: [
          {
            titleEn: 'Water Base',
            titleZh: '注水底座',
            textEn: 'AD-11Z (B-01)\nAD-11Z (B-02)',
            textZh: 'AD-11Z (B-01)\nAD-11Z (B-02)'
          }
        ]
      },
      {
        type: 'square_flag_pole_fiberglass',
        nameEn: 'Square Flag Pole (Fiberglass)',
        nameZh: '方型沙滩旗杆（玻纤）',
        hubDescEn: 'Square fiberglass poles for rectangle/square flags.',
        hubDescZh: '方型玻纤旗杆，适配方旗/矩形旗。',
        storyEn: 'Square flag poles in fiberglass material.',
        storyZh: '方型沙滩旗杆（玻纤材质）。',
        heroImage: FLAG_HERO('SquareFlagPolehero.png'),
        guideImage: `${PDF_BASE}/12.png`,
        specTable: {
          columns: [
            { key: 'material', labelEn: 'Material', labelZh: '材质' },
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'length', labelEn: 'Length', labelZh: '长度' },
            { key: 'graphicSize', labelEn: 'Graphic Size', labelZh: '旗面尺寸' },
            { key: 'packing', labelEn: 'Packing', labelZh: '装箱' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
          ],
          rows: [
            { material: 'Fiberglass', model: 'AD-F10A', length: '2.1m', graphicSize: '165×70cm', packing: '10pcs', carton: '152×22×22cm', weight: '17kg' },
            { material: 'Fiberglass', model: 'AD-F10B', length: '3.0m', graphicSize: '245×70cm', packing: '10pcs', carton: '152×22×22cm', weight: '19kg' },
            { material: 'Fiberglass', model: 'AD-F10C', length: '4.2m', graphicSize: '345×70cm', packing: '10pcs', carton: '152×22×22cm', weight: '20kg' }
          ]
        }
      },
      {
        type: 'alu_pole_semicircle',
        nameEn: 'Aluminium Beach Flag Pole — Semicircle',
        nameZh: '铝合金沙滩旗杆（半圆）',
        hubDescEn: 'American aluminium pole (semicircle).',
        hubDescZh: '美式铝杆（半圆）。',
        storyEn: 'Semicircle American aluminium poles. Optional diameters/thickness available.',
        storyZh: '半圆美式铝杆，可选不同直径/壁厚。',
        heroImage: FLAG_HERO('semicirclehero.png'),
        guideImage: `${PDF_BASE}/13.png`,
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'height', labelEn: 'Height', labelZh: '高度' },
            { key: 'diameter', labelEn: 'Diameter', labelZh: '直径' },
            { key: 'thickness', labelEn: 'Thickness', labelZh: '壁厚' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' },
            { key: 'quantity', labelEn: 'Quantity', labelZh: '装箱数量' }
          ],
          rows: [
            { model: 'WK-36A', height: '3.3M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '23kg', quantity: '20pcs/carton' },
            { model: 'WK-36B', height: '4.4M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '20.4kg', quantity: '15pcs/carton' },
            { model: 'WK-36C', height: '5.5M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '11kg', quantity: '15pcs/carton' }
          ]
        },
        infoBlocks: [
          {
            titleEn: 'Optional Diameter / Thickness',
            titleZh: '可选直径/壁厚',
            textEn: 'Ø26 / Ø28\n1.2mm / 1.5mm',
            textZh: 'Ø26 / Ø28\n1.2mm / 1.5mm'
          }
        ]
      },
      {
        type: 'alu_pole_square',
        nameEn: 'Aluminium Beach Flag Pole — Square',
        nameZh: '铝合金沙滩旗杆（方型）',
        hubDescEn: 'American aluminium pole (square).',
        hubDescZh: '美式铝杆（方型）。',
        storyEn: 'Square American aluminium poles. Optional diameters/thickness available.',
        storyZh: '方型美式铝杆，可选不同直径/壁厚。',
        heroImage: FLAG_HERO('sqaurehero.png'),
        guideImage: `${PDF_BASE}/13.png`,
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'height', labelEn: 'Height', labelZh: '高度' },
            { key: 'diameter', labelEn: 'Diameter', labelZh: '直径' },
            { key: 'thickness', labelEn: 'Thickness', labelZh: '壁厚' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' },
            { key: 'quantity', labelEn: 'Quantity', labelZh: '装箱数量' }
          ],
          rows: [
            { model: 'WK-33A', height: '3.3M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '23kg', quantity: '20pcs/carton' },
            { model: 'WK-33B', height: '4.4M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '20.4kg', quantity: '15pcs/carton' },
            { model: 'WK-33C', height: '5.5M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '11kg', quantity: '15pcs/carton' }
          ]
        },
        infoBlocks: [
          {
            titleEn: 'Optional Diameter / Thickness',
            titleZh: '可选直径/壁厚',
            textEn: 'Ø26 / Ø28\n1.2mm / 1.5mm',
            textZh: 'Ø26 / Ø28\n1.2mm / 1.5mm'
          }
        ]
      },
      {
        type: 'alu_pole_new_feather',
        nameEn: 'Aluminium Beach Flag Pole — New Feather',
        nameZh: '铝合金沙滩旗杆（新型刀旗）',
        hubDescEn: 'New feather aluminium poles in 3m/4m/5m.',
        hubDescZh: '新型刀旗铝杆，3m/4m/5m 可选。',
        storyEn: 'New feather aluminium poles with defined graphic sizes.',
        storyZh: '新型刀旗铝杆，对应旗面尺寸明确。',
        heroImage: FLAG_HERO('newfeatherhero.png'),
        guideImage: `${PDF_BASE}/13.png`,
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'material', labelEn: 'Material', labelZh: '材质' },
            { key: 'height', labelEn: 'Height', labelZh: '高度' },
            { key: 'graphicSize', labelEn: 'Graphic Size', labelZh: '旗面尺寸' },
            { key: 'quantity', labelEn: 'Quantity', labelZh: '装箱' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
          ],
          rows: [
            { model: 'AD-42A', material: 'Aluminium', height: '3M', graphicSize: '70×220cm', quantity: '25pcs', carton: '120×25×22cm', weight: '13kg' },
            { model: 'AD-42B', material: 'Aluminium', height: '4M', graphicSize: '75×320cm', quantity: '20pcs', carton: '120×25×22cm', weight: '15kg' },
            { model: 'AD-42C', material: 'Aluminium', height: '5M', graphicSize: '75×420cm', quantity: '15pcs', carton: '120×25×22cm', weight: '17kg' }
          ]
        }
      },
      {
        type: 'alu_pole_feather',
        nameEn: 'Aluminium Beach Flag Pole — Feather/Teardrop',
        nameZh: '铝合金沙滩旗杆（刀旗/水滴）',
        hubDescEn: 'American aluminium poles for feather/teardrop styles.',
        hubDescZh: '美式铝杆（刀旗/水滴）。',
        storyEn: 'American aluminium poles for feather/teardrop flags.',
        storyZh: '刀旗/水滴旗美式铝杆。',
        heroImage: FLAG_HERO('featherhero.png'),
        guideImage: `${PDF_BASE}/13.png`,
        specTable: {
          columns: [
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'height', labelEn: 'Height', labelZh: '高度' },
            { key: 'diameter', labelEn: 'Diameter', labelZh: '直径' },
            { key: 'thickness', labelEn: 'Thickness', labelZh: '壁厚' },
            { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' },
            { key: 'quantity', labelEn: 'Quantity', labelZh: '装箱数量' }
          ],
          rows: [
            { model: 'AD-39A', height: '3.3M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '11kg', quantity: '15pcs/carton' },
            { model: 'AD-39B', height: '4.4M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '20.4kg', quantity: '15pcs/carton' },
            { model: 'AD-39C', height: '5.5M', diameter: 'Ø25', thickness: '1mm', carton: '120×23×18cm', weight: '23kg', quantity: '20pcs/carton' }
          ]
        },
        infoBlocks: [
          {
            titleEn: 'Optional Diameter / Thickness',
            titleZh: '可选直径/壁厚',
            textEn: 'Ø26 / Ø28\n1.2mm / 1.5mm',
            textZh: 'Ø26 / Ø28\n1.2mm / 1.5mm'
          }
        ]
      }
    ],

    special: [
      {
        type: 'backpack_street_flags',
        nameEn: 'Backpack Flags & Street/Display Flags',
        nameZh: '背包旗 & 街旗 / 展示旗',
        hubDescEn: 'Portable backpack flags, street flags and compact display flag systems for outdoor promotion.',
        hubDescZh: '背包旗、街旗与便携展示旗系统，适合户外推广与活动宣传。',
        storyEn: [
          'Portable flag solutions for street marketing, events, and brand promotion.',
          'Includes backpack flag series and street/display flag series with multiple shapes and models.'
        ].join('\n'),
        storyZh: [
          '便携式旗帜展示解决方案，适用于街头推广、活动宣传与品牌展示。',
          '包含背包旗系列与街旗/展示旗系列，多种造型与型号可选。'
        ].join('\n'),
        heroImage: FLAG_HERO('Backpack Flagshero.png'),
        guideImage: `${PDF_BASE}/16.png`,
        specTables: [
          {
            titleEn: 'Backpack Flag Series',
            titleZh: '背包旗系列',
            columns: [
              { key: 'model', labelEn: 'Model', labelZh: '型号' },
              { key: 'style', labelEn: 'Style', labelZh: '款式' },
              { key: 'description', labelEn: 'Description', labelZh: '描述' },
              { key: 'poleSize', labelEn: 'Pole / Structure', labelZh: '杆长/结构' },
              { key: 'flagSize', labelEn: 'Flag / Graphic Size', labelZh: '旗面/画面尺寸' },
              { key: 'packing', labelEn: 'Packing Qty', labelZh: '装箱数量' },
              { key: 'carton', labelEn: 'Carton Size', labelZh: '箱规' },
              { key: 'weight', labelEn: 'Weight', labelZh: '重量' }
            ],
            rows: [
              { model: 'WK-C16a', style: 'Teardrop | 水滴', description: 'Backpack flag | 背包旗', poleSize: '—', flagSize: '55 × 105 cm', packing: '—', carton: '—', weight: '—' },
              { model: 'WK-C16b', style: 'Feather | 刀旗', description: 'Backpack flag | 背包旗', poleSize: '—', flagSize: '40 × 110 cm', packing: '—', carton: '—', weight: '—' },
              { model: 'WK-C16c', style: 'Square | 方形', description: 'Backpack flag | 背包旗', poleSize: '—', flagSize: '40 × 125 cm', packing: '—', carton: '—', weight: '—' },
              { model: 'WK-C16x', style: 'X | X型', description: 'Backpack flag | 背包旗', poleSize: '—', flagSize: '45 × 120 cm', packing: '10 pcs / carton', carton: '61 × 55 × 46 cm', weight: '16.5 kg (G.W.)' },
              { model: '—', style: 'Backpack (rear) | 背包（背面）', description: 'Ergonomic carry structure | 人体工学背负', poleSize: '—', flagSize: '—', packing: '—', carton: '—', weight: '—' },
              { model: '—', style: 'Carry bag | 手提/收纳袋', description: 'Storage & transport | 收纳运输', poleSize: '—', flagSize: '—', packing: '—', carton: '—', weight: '—' },
              { model: 'WK-L60A', style: 'Inflatable | 充气', description: 'Inflatable advertising backpack | 充气广告背包', poleSize: '—', flagSize: '80 × 80 cm', packing: '2 pcs / carton', carton: '60 × 35 × 25 cm', weight: '3 kg' },
              { model: 'WK-L60B', style: 'Inflatable | 充气', description: 'Inflatable advertising backpack | 充气广告背包', poleSize: '—', flagSize: '100 × 135 cm', packing: '2 pcs / carton', carton: '180 × 150 cm', weight: '5.5 kg' },
              { model: 'WK-L70', style: 'LED | LED', description: 'LED advertising backpack | LED 广告背包', poleSize: '—', flagSize: 'Front 75×70 cm / Back 80×75 cm', packing: '—', carton: '105 × 45 × 35 cm', weight: '7.8 kg' }
            ]
          },
          {
            titleEn: 'Street / Display Flag Series',
            titleZh: '街旗 / 展示旗系列',
            columns: [
              { key: 'model', labelEn: 'Model', labelZh: '型号' },
              { key: 'style', labelEn: 'Style', labelZh: '款式' },
              { key: 'description', labelEn: 'Description', labelZh: '描述' },
              { key: 'poleSize', labelEn: 'Pole Size', labelZh: '杆长' },
              { key: 'flagSize', labelEn: 'Size / Unfolded', labelZh: '尺寸/展开' },
              { key: 'packing', labelEn: 'Packing Qty', labelZh: '装箱数量' },
              { key: 'carton', labelEn: 'Package Size', labelZh: '包装尺寸' },
              { key: 'weight', labelEn: 'Weight / Gross', labelZh: '重量/毛重' }
            ],
            rows: [
              { model: 'AD-22', style: 'Street teardrop | 街头水滴', description: 'Asm height 78 cm | 组装高度 78 cm', poleSize: '100 cm', flagSize: '—', packing: '100 sets / box', carton: '60 × 50 × 30 cm', weight: '0.18 kg unit; 19.7 kg G.W.' },
              { model: 'AD-C17', style: 'Lantern | 灯笼旗', description: '3 sides | 三面', poleSize: '—', flagSize: 'Asm H 2.4 m', packing: '25 sets / box', carton: '180 × 15 × 10 cm', weight: '5.5 kg unit; 12.4 kg G.W.' },
              { model: 'AD-23', style: 'Street teardrop | 街旗水滴', description: 'PP bag | PP 袋', poleSize: '100 cm', flagSize: 'Asm H 78 cm', packing: '100 sets / box', carton: '62 × 40 × 40 cm', weight: '0.18 kg unit; 10.5 kg G.W.' },
              { model: 'AD-21', style: 'Wall flag | 墙旗', description: 'Base, strap, pole, cap, flag | 底管/绑带/旗杆/顶帽/旗面', poleSize: '—', flagSize: '52 × 60 cm unfolded', packing: '150 sets / box', carton: '61 × 47 × 30 cm', weight: '22 kg G.W.' },
              { model: 'AD-23-B / AD-23-C', style: 'Table flag | 桌旗', description: 'Desktop flag | 桌面旗', poleSize: '55 cm', flagSize: '—', packing: '100 sets / box', carton: '60 × 50 × 30 cm', weight: '0.18 kg unit; 19.7 kg G.W.' },
              { model: 'WK-S80', style: 'Straight pole | 直杆路灯', description: 'Aluminum alloy | 铝合金', poleSize: '—', flagSize: '60 × 120 cm', packing: '—', carton: '—', weight: '1.7 kg' },
              { model: 'WK-S81', style: 'Straight pole | 直杆路灯', description: 'Aluminum alloy | 铝合金', poleSize: '—', flagSize: '60 × 120 cm', packing: '—', carton: '—', weight: '1.7 kg' },
              { model: 'WK-S82', style: 'Feather pole | 刀型路灯', description: 'Full fiberglass | 全玻纤', poleSize: '—', flagSize: '50 × 120 cm', packing: '—', carton: '—', weight: '2.3 kg' }
            ]
          }
        ]
      }
    ],

    accessories: [
      {
        type: 'flag_bases_accessories',
        nameEn: 'Beach Flag Bases & Accessories',
        nameZh: '沙滩旗底座与配件',
        hubDescEn: 'Cross bases, water bases, ground spikes, rotors and carrying bags.',
        hubDescZh: '十字底座、注水底座、地插、转动轴与收纳袋。',
        storyEn: 'A full range of bases and accessories for beach flags.',
        storyZh: '沙滩旗配套底座与配件全系列。',
        // Top hero (P1): original brochure-style hero — unchanged
        heroImage: 'images/products/accessories/flag-accessories/hero.png',
        // Real product photos only in the example block below (not the hero)
        exampleImages: [
          FLAG_ACCESSORIES_IMG('1.png'),
          FLAG_ACCESSORIES_IMG('2.png'),
          FLAG_ACCESSORIES_IMG('flags poles.png'),
          `${CATALOG_ALLPAGE_BASE}/14.png`,
          `${CATALOG_ALLPAGE_BASE}/15.png`
        ],
        exampleImagesTitleZh: '实物图 / 画册页对照',
        exampleImagesTitleEn: 'Product photos & catalog pages',
        exampleImagesSubtitleZh: '含沙滩旗底座与配件实物图，并附画册第 14/15 页，便于对照款式与参数（可点击放大）。',
        exampleImagesSubtitleEn: 'Real-life photos plus catalog pages 14–15 for quick reference (click to open).',
        specTable: {
          columns: [
            { key: 'group', labelEn: 'Group', labelZh: '分类' },
            { key: 'name', labelEn: 'Item', labelZh: '名称' },
            { key: 'model', labelEn: 'Model', labelZh: '型号' },
            { key: 'material', labelEn: 'Material', labelZh: '材质' },
            { key: 'color', labelEn: 'Color', labelZh: '颜色' },
            { key: 'weight', labelEn: 'Weight', labelZh: '重量' },
            { key: 'size', labelEn: 'Size / Unfold', labelZh: '尺寸/展开' },
            { key: 'carton', labelEn: 'Carton / Pack', labelZh: '箱规/包装' },
            { key: 'packing', labelEn: 'Packing Qty', labelZh: '装箱数量' },
            { key: 'gross', labelEn: 'Gross Weight', labelZh: '毛重' }
          ],
          rows: [
            { group: 'Cross Base', name: 'Cross base – without rotor', model: 'AD-C4', material: 'Powder coat iron', color: 'Black / Grey', weight: '2.2kg', size: 'Unfold: 60cm', carton: '61×13×11.5cm', packing: '10 sets/box', gross: '22.5kg' },
            { group: 'Cross Base', name: 'Cross base – with rotor', model: 'AD-C3', material: 'Powder coat iron', color: 'Black / Grey', weight: '2.8kg', size: 'Unfold: 60cm', carton: '61×13×11.5cm', packing: '10 sets/box', gross: '28.5kg' },
            { group: 'Cross Base', name: 'XL Cross base – with rotor', model: 'AD-C3A', material: 'Powder coat iron', color: 'Black / Grey', weight: '3.8kg', size: 'Unfold: 82cm', carton: '86×20×12cm', packing: '6 sets/box', gross: '23.5kg' },

            { group: 'Cross Base', name: 'Iron tube cross base – with rotor', model: 'AD-C5', material: 'Coating iron', color: 'Black / Grey', weight: '1.55kg', size: 'Unfold: 80cm', carton: '83×22.5×21cm', packing: '10 sets/box', gross: '19.5kg' },
            { group: 'Cross Base', name: 'Aluminium cross base – with rotor', model: 'AD-C2', material: 'Aluminium + Plastic + Iron', color: 'Grey', weight: '0.7kg', size: 'Unfold: 80cm', carton: '52×35×25cm', packing: '20 sets/box', gross: '15kg' },

            { group: 'Cross Base', name: 'Chrome plating cross base – with rotor (large)', model: 'AD-C1', material: 'Chromeplate iron + zinc', color: 'Silvery', weight: '3.0kg', size: 'Unfold: 98cm', carton: '60×21×13cm / 53.5×20×29cm', packing: '6 sets/box', gross: '18.5kg' },
            { group: 'Cross Base', name: 'Chrome plating cross base – with rotor (small)', model: 'AD-C1A', material: 'Chromeplate iron + zinc', color: 'Silvery', weight: '3.0kg', size: 'Unfold: 82cm', carton: '52×21×13cm / 53.5×20×29cm', packing: '6 sets/box', gross: '19.5kg' },

            { group: 'Car Base', name: 'Car Base', model: 'AD-C11', material: 'Iron with coating + chrome plate', color: 'Black', weight: '2.45kg', size: 'Unfold: 49.5×40×18.5cm', carton: '55×55×12cm', packing: '10 sets/box', gross: '26kg' },

            { group: 'Water Base', name: 'Water bag', model: 'AD-C20', material: 'PVC', color: 'Black / Grey', weight: '0.20kg', size: 'Unfold: 51cm (Capacity 10kg)', carton: '-', packing: '100 sets/box', gross: '20.5kg' },
            { group: 'Water Base', name: 'Water base (gray white)', model: 'AD-C13', material: 'Blow molding', color: 'Gray white', weight: '20kg', size: 'Unfold: 45×45×14cm', carton: '-', packing: '6 sets/box', gross: '9.6kg' },
            { group: 'Water Base', name: 'Water base (black)', model: 'AD-C14', material: 'Blow molding', color: 'Gray', weight: '20kg', size: 'Unfold: 45×45×14cm', carton: '-', packing: '6 sets/box', gross: '9.6kg' },
            { group: 'Water Base', name: 'Water base (blue)', model: 'AD-C15', material: 'Blow molding', color: 'Blue', weight: '12kg', size: 'Unfold: 45×45×14cm', carton: '-', packing: '10 sets/box', gross: '8.5kg' },
            { group: 'Water Base', name: 'Water Base (Black) - thickened', model: 'AD-C36', material: 'Plastic and iron', color: 'Black', weight: '1.3kg', size: 'Size: 40cm', carton: '90×45×47.5cm', packing: '12 pcs/carton', gross: '18.5kg' },

            { group: 'Ground Spike', name: 'Ground Spike (with rotor)', model: 'AD-C7', material: 'Chromeplate iron + zinc', color: 'Silvery', weight: '1.3kg', size: 'Unfold: 50cm', carton: '52×19.5×10.5cm', packing: '20 sets/box', gross: '20.5kg' },
            { group: 'Ground Spike', name: 'Plastic Ground Drill', model: 'AD-C6', material: 'Plastic + iron', color: 'Black', weight: '0.65kg', size: 'Unfold: 55cm', carton: '60×50×31cm', packing: '25 sets/box', gross: '17.0kg' },
            { group: 'Ground Spike', name: 'Bending Ground Spike', model: 'AD-C26', material: 'Chroming iron', color: 'Silver', weight: '1.3kg', size: 'Size: 60cm', carton: '61×20×12cm', packing: '12 pcs/carton', gross: '17kg' },
            { group: 'Ground Spike', name: 'Simple Bending Ground Spike', model: 'AD-C27', material: 'Chroming iron', color: 'Silver', weight: '0.65kg', size: 'Size: 52cm', carton: '53×20×12cm', packing: '25 pcs/carton', gross: '17kg' },
            { group: 'Ground Spike', name: 'Simple Ground Spike', model: 'AD-C28', material: 'Chroming iron', color: 'Silver', weight: '0.75kg', size: 'Size: 60cm', carton: '61×20×12cm', packing: '25 pcs/carton', gross: '19.5kg' },
            { group: 'Ground Spike', name: 'Full Aluminum Flag Ground Spike', model: 'AD-C26-1', material: 'Chroming iron', color: 'Silver', weight: '1.3kg', size: 'Size: 60cm', carton: '61×20×12cm', packing: '12 pcs/carton', gross: '17kg' },
            { group: 'Ground Spike', name: 'Iron Ground Drill', model: 'AD-C6A', material: 'Iron with coating chrome plate', color: '-', weight: '1.2kg', size: 'Size: 50cm', carton: '52×35×35cm', packing: '12 pcs', gross: '16kg' },

            { group: 'Rotor', name: 'Rotor', model: 'AD-24', material: 'Iron with chrome-plating', color: 'Silvery', weight: '0.55kg', size: 'Unfold: 38×14×15cm', carton: '22×21.9cm', packing: '25 sets/box', gross: '15kg' },

            { group: 'Carrying Bag', name: 'Carrying Bag (Small) for aluminium+fiberglass poles', model: 'AD-C14', material: '-', color: '-', weight: '-', size: '92×30cm', carton: '61×55×46cm', packing: '60 pcs', gross: '31kg' },
            { group: 'Carrying Bag', name: 'Carrying Bag (Large) for aluminium+fiberglass poles', model: 'AD-C15', material: '-', color: '-', weight: '-', size: '121×30cm', carton: '61×55×46cm', packing: '50 pcs', gross: '26kg' },
            { group: 'Carrying Bag', name: 'Fully fiberglass pole Carrying Bag', model: 'AD-C22', material: '-', color: '-', weight: '-', size: '152×15×3cm', carton: '-', packing: '-', gross: '-' }
          ]
        }
      }
    ]
  };
})();
