// Tent sub-categories (source: PDF page 6 only)
// Global export: window.TENT_SUBCATEGORIES
(function () {
    'use strict';

    window.TENT_SUBCATEGORIES = {
        star: {
            nameZh: '星星帐篷',
            nameEn: 'Star Tent',
            // Page 6 appears image-based; text below is transcribed from the PDF page 6 content.
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
        awning: {
            nameZh: '天幕帐篷',
            nameEn: 'Awning Tent',
            descriptionZh: '',
            descriptionEn: '',
            heroImage: 'images/products/tents/awning/hero.png',
            pdfPage: 6
        },
        six_sided: {
            nameZh: '六边帐篷',
            nameEn: 'Six-sided Tent',
            descriptionZh: '',
            descriptionEn: '',
            heroImage: 'images/products/tents/six-sided/hero.png',
            pdfPage: 6
        }
    };
})();
