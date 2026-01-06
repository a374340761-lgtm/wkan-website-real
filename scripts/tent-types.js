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
        folding: [
            {
                type: 'folding30',
                // TODO(PDF p5): Extract the exact marketing name (CN/EN) from page 5.
                // Using series label derived from the selectable PDF text: WK-T30*.
                nameZh: 'WK-T30',
                nameEn: 'WK-T30',
                // Page 5 selectable text (sizes/weights)
                descriptionZh: [
                    '常规尺寸：1.5×1.5M / 2×2M / 2×3M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M',
                    '参考重量：13KG / 15KG / 16.5KG / 19KG / 21KG / 27KG / 36KG'
                ].join('\n'),
                descriptionEn: [
                    'Sizes: 1.5×1.5M / 2×2M / 2×3M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M',
                    'Weights: 13KG / 15KG / 16.5KG / 19KG / 21KG / 27KG / 36KG'
                ].join('\n'),
                heroImage: 'images/products/tents/folding30/hero.png',
                pdfPage: 5
            },
            {
                type: 'folding40',
                // TODO(PDF p5): Extract the exact marketing name (CN/EN) from page 5.
                // Using series label derived from the selectable PDF text: WK-T40*.
                nameZh: 'WK-T40',
                nameEn: 'WK-T40',
                descriptionZh: [
                    '常规尺寸：1.5×1.5M / 2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    '参考重量：12.5KG / 13KG / 16KG / 17KG / 20KG / 20.5KG / 26KG / 28KG / 33KG'
                ].join('\n'),
                descriptionEn: [
                    'Sizes: 1.5×1.5M / 2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    'Weights: 12.5KG / 13KG / 16KG / 17KG / 20KG / 20.5KG / 26KG / 28KG / 33KG'
                ].join('\n'),
                heroImage: 'images/products/tents/folding40/hero.png',
                pdfPage: 5
            },
            {
                type: 'folding50',
                // TODO(PDF p5): Extract the exact marketing name (CN/EN) from page 5.
                // Using series label derived from the selectable PDF text: WK-T50*.
                nameZh: 'WK-T50',
                nameEn: 'WK-T50',
                descriptionZh: [
                    '常规尺寸：2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    '参考重量：20KG / 22KG / 29KG / 36KG / 40KG / 51KG / 55KG / 67KG'
                ].join('\n'),
                descriptionEn: [
                    'Sizes: 2×2M / 2.5×2.5M / 3×3M / 3×4.5M / 3×6M / 4×4M / 4×6M / 4×8M',
                    'Weights: 20KG / 22KG / 29KG / 36KG / 40KG / 51KG / 55KG / 67KG'
                ].join('\n'),
                heroImage: 'images/products/tents/folding50/hero.png',
                pdfPage: 5
            }
        ],
        event: [
            {
                type: 'star',
                nameZh: '星星帐篷',
                nameEn: 'Star Tent',
                // TODO(PDF p6): Page 6 text is image-based; OCR blocked. Verify/replace with exact text from page 6.
                descriptionZh: '防水阻燃',
                descriptionEn: [
                    'Connection method:',
                    '• The interposer type connection method, the accessories is finished in galvanized steel.',
                    '• Frame material, heavy-duty aluminum profile, with oxidation finished',
                    '• Polyester, water proof and fire proof with UV resistance, 1 side PU coating',
                    '',
                    '300D 400D 600D 900D oxford fabric',
                    'with PU coating',
                    'UV protected',
                    '',
                    'Water proof',
                    'Fire retardant (DIN4102-1_B2&CPAI-84)'
                ].join('\n'),
                heroImage: 'images/products/tents/star/hero.png',
                pdfPage: 6
            },
            {
                type: 'awning',
                nameZh: '天幕帐篷',
                nameEn: 'Awning Tent',
                // TODO(PDF p6): Extract exact CN/EN description from page 6.
                descriptionZh: '',
                descriptionEn: '',
                heroImage: 'images/products/tents/awning/hero.png',
                pdfPage: 6
            },
            {
                type: 'six_sided',
                nameZh: '六边帐篷',
                nameEn: 'Six-sided Tent',
                // TODO(PDF p6): Extract exact CN/EN description from page 6.
                descriptionZh: '',
                descriptionEn: '',
                heroImage: 'images/products/tents/six-sided/hero.png',
                pdfPage: 6
            }
        ]
    };
})();
