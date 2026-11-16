"""Build Spanish using the same static localization pipeline as German.

Usage: python scripts/build-spanish-site.py --models PATH --cache PATH --release
Dependencies: beautifulsoup4, ctranslate2, sentencepiece; Argos en_es and zh_en.
"""
from pathlib import Path
import re

# Reuse the existing pipeline, including its link, JSON-LD and runtime extraction.
# Locale-specific authored dictionaries are replaced below before invoking main.
source = Path(__file__).with_name('build-german-site.py').read_text(encoding='utf-8')
for old, new in [('German', 'Spanish'), ('german', 'spanish'), ('/de', '/es'),
                 ('"de"', '"es"'), ('de/', 'es/'), ('data-de-static', 'data-es-static'),
                 ('WK_DE_', 'WK_ES_'), ('en_de', 'en_es')]:
    source = source.replace(old, new)
source = source.replace('file.startswith(("es/", "es/"))', 'file.startswith(("de/", "es/"))')
source = source.replace('"/zh/", "/es/", "/es/"', '"/zh/", "/de/", "/es/"')
source = source.replace('inter_threads=2, intra_threads=2', 'inter_threads=2, intra_threads=4')
pipeline = {'__name__': 'spanish_pipeline', '__file__': __file__}
exec(compile(source, __file__, 'exec'), pipeline)
pipeline['GLOSSARY'] = {
    'Home': 'Inicio', 'Products': 'Productos', 'Browse Products': 'Explorar productos',
    'All Products': 'Todos los productos', 'Product Center': 'Catálogo de productos',
    'Canopy Tents': 'Carpas plegables', 'Flags & Poles': 'Banderas y mástiles',
    'Display Systems': 'Sistemas de exposición', 'Light Boxes': 'Cajas de luz',
    'Accessories': 'Accesorios', 'Customer Service': 'Atención al cliente',
    'About Us': 'Sobre nosotros', 'Contact': 'Contacto', 'Careers': 'Empleo',
    'News & Resources': 'Noticias y recursos', 'News': 'Noticias',
    'Request a Quote': 'Solicitar presupuesto', 'Get Quote': 'Solicitar presupuesto',
    'Get a Quote': 'Solicitar presupuesto', 'Send Inquiry': 'Enviar consulta',
    'Search': 'Buscar', 'Filter': 'Filtrar', 'Reset': 'Restablecer',
    'Specifications': 'Especificaciones', 'Downloads': 'Descargas',
    'Privacy Policy': 'Política de privacidad', 'Terms': 'Condiciones de uso',
    'English': 'English', '中文': '简体中文', '简体中文': '简体中文',
    'Deutsch': 'Deutsch', 'Español': 'Español', 'WaiKwan': 'WaiKwan',
    'FAQ': 'Preguntas frecuentes', 'WeChat': 'WeChat', 'WhatsApp': 'WhatsApp',
    'Guangxi WaiKwan Tent Manufacturing Co., Ltd.': 'Guangxi WaiKwan Tent Manufacturing Co., Ltd.',
    'Download catalog': 'Descargar catálogo (idioma original)',
    'Download PDF': 'Descargar PDF (idioma original)',
    'Download Product Catalog PDF': 'Descargar catálogo de productos en PDF (idioma original)',
    'Add to RFQ list': 'Añadir a la lista de solicitudes',
    'Add to Cart': 'Añadir a la lista de solicitudes',
    'Added to RFQ list': 'Añadido a la lista de solicitudes',
    'Product not found': 'Producto no encontrado', 'Colour': 'Color', 'Color': 'Color',
    'White': 'Blanco', 'Black': 'Negro', 'Site Map': 'Mapa del sitio',
    'Custom canopy tents': 'Carpas plegables personalizadas',
    'Custom Canopy Tents': 'Carpas plegables personalizadas',
    'Custom Printed Canopy Tents': 'Carpas plegables con impresión personalizada',
    'Portable Display Systems': 'Sistemas de exposición portátiles',
    'Beach Flags': 'Banderas publicitarias', 'SEG Light Boxes': 'Cajas de luz textiles SEG',
    'Search products': 'Buscar productos', 'News & Guides': 'Noticias y guías',
    '与': 'y', '或': 'o',
    '上海国际广告展 · 2026年9月': 'SIGN CHINA en Shanghái · septiembre de 2026',
    '展会新闻 · 2026年5月 · 广州': 'Noticias de ferias · mayo de 2026 · Guangzhou',
    '展会 · 2026年3月 · 上海': 'Feria · marzo de 2026 · Shanghái',
    '2026年9月15–17日 · 上海新国际博览中心': '15–17 de septiembre de 2026 · Shanghai New International Expo Centre',
    '2026年3月，伟群帐篷参加了在上海举办的 APPPEXPO 2026 展会，并在现场展示了公司一系列最新的展示与品牌宣传解决方案。这次展会为我们提供了一个与客户面对面交流、更加直观展示产品、并进一步加强与不同市场客户及合作伙伴联系的宝贵机会。':
        'En marzo de 2026, WaiKwan participó en APPPEXPO 2026 en Shanghái y presentó sus últimas soluciones de exposición y promoción de marca. La feria permitió mostrar los productos en persona, conversar directamente con los clientes y reforzar las relaciones con clientes y colaboradores de distintos mercados.',
    '闭气式充气结构，充气完成后无需持续连接气泵。采用 400D（220g）PU 涂层涤纶布、0.3mm TPU 内胆，支持热升华全彩印刷，可选配电泵。':
        'La estructura inflable hermética no necesita una bomba conectada de forma continua después del inflado. Utiliza poliéster 400D (220g) con revestimiento de PU y una cámara interior de TPU de 0.3mm. Admite impresión por sublimación a todo color y una bomba eléctrica opcional.',
    '尺寸为 60 × 42 cm，可与充气椅组合布置洽谈及休息区。现场桌椅采用统一的品牌画面，与充气帐篷搭配，形成完整的接待空间。':
        'La mesa mide 60 × 42 cm y puede combinarse con sillas inflables para crear zonas de reunión y descanso. Las mesas y sillas expuestas compartían el diseño de marca con la carpa inflable para crear un espacio de recepción completo.',
    'It uses 400D (220g) PU-coated polyester with a 0.3mm TPU bladder, supports full-colour dye-sublimation printing and can be supplied with an optional electric pump.':
        'Utiliza poliéster 400D (220g) con revestimiento de PU y una cámara de TPU de 0.3mm; admite impresión por sublimación a todo color y una bomba eléctrica opcional.',
    'Upper 40×40×1.3 mm; lower 35×35×1.3 mm; scissor 13×25×1.1 mm.':
        'Sección superior 40×40×1.3 mm; sección inferior 35×35×1.3 mm; tijeras 13×25×1.1 mm.',
    'Steel25Round tube/Square tube': 'Acero 25: tubo redondo/tubo cuadrado',
}
for key in ('HEADINGS', 'SEO_HEADINGS', 'POLICY_COPY', 'TERMS'):
    pipeline[key] = {}
pipeline['HEADINGS'] = {
    'index.html': 'Fabricante de carpas personalizadas, banderas y sistemas de exposición OEM',
    'about-us.html': 'Sobre WaiKwan', 'company-profile.html': 'Perfil de la empresa WaiKwan',
    'contact-us.html': 'Solicitar presupuesto', 'all-products.html': 'Todos los productos',
    'product-center.html': 'Catálogo de productos', 'tent-type.html': 'Carpas plegables e inflables',
    'flag-type.html': 'Banderas publicitarias, mástiles y bases',
    'furniture-type.html': 'Mobiliario para eventos', 'dome-type.html': 'Carpas tipo domo',
    'racegate-type.html': 'Arcos y puertas para carreras',
    '10x10-pop-up-canopy-tent.html': 'Carpas plegables de 10×10 ft (3×3 m)',
    'canopy-tents.html': 'Carpas plegables para uso comercial',
    'pop-up-canopy-tents.html': 'Carpas plegables de montaje rápido',
    'pop-up-canopy-tent.html': 'Carpas plegables directamente del fabricante',
    'pop-up-canopy-tent-manufacturer.html': 'Fabricante de carpas plegables',
    'pop-up-canopy-tent-supplier.html': 'Proveedor de carpas plegables para distribuidores',
    'custom-canopy-tent-manufacturer.html': 'Fabricante de carpas plegables personalizadas',
    'custom-printed-canopy-tents.html': 'Carpas plegables con impresión personalizada',
    'custom-printed-tent.html': 'Carpas impresas para empresas y eventos',
    'aluminum-folding-tent.html': 'Carpas plegables con estructura de aluminio',
    'event-canopy-tents.html': 'Carpas para ferias y eventos',
    'beach-flag-supplier.html': 'Banderas publicitarias con mástiles y bases',
    'flag-pole-and-base-manufacturer.html': 'Fabricante de mástiles y bases para banderas',
    'portable-display-systems.html': 'Sistemas de exposición portátiles',
    'pop-up-display-stands.html': 'Expositores portátiles de montaje rápido',
    'inflatable-tent-manufacturer.html': 'Fabricante de carpas inflables',
    'event-tent-and-promotional-display.html': 'Carpas para eventos y expositores publicitarios',
    'advertising-light-box-manufacturer.html': 'Fabricante de cajas de luz publicitarias',
    'seg-light-box-manufacturer.html': 'Fabricante de cajas de luz textiles SEG',
    'tension-fabric-backwall.html': 'Fondos de exposición de tejido tensado',
    'manufacturing-capabilities.html': 'Fabricación OEM y ODM para eventos y exposiciones',
    'export-loading.html': 'Embalaje y carga de contenedores para exportación',
    'canopy-tent-buying-guide.html': 'Guía de compra de carpas plegables',
    'beach-flag-buying-guide.html': 'Guía de compra de banderas publicitarias',
    'portable-display-buying-guide.html': 'Guía de compra de sistemas de exposición portátiles',
    'faq.html': 'Preguntas frecuentes', 'faq-moq.html': 'Cantidad mínima de pedido',
    'faq-lead-time.html': 'Plazos de producción', 'faq-artwork-files.html': 'Archivos de impresión',
    'faq-color-matching.html': 'Correspondencia de colores', 'faq-samples.html': 'Muestras',
    'faq-shipping.html': 'Envío y exportación', 'privacy.html': 'Política de privacidad',
    'terms.html': 'Condiciones de uso', 'site-map.html': 'Mapa del sitio',
    'news/index.html': 'Noticias y recursos', 'specifications-packing.html': 'Especificaciones y embalaje',
}
# Apply authored headings to equivalent navigation labels and metadata as well.
from bs4 import BeautifulSoup
for file, heading in pipeline['HEADINGS'].items():
    original = pipeline['ROOT'] / file
    if original.is_file():
        soup = BeautifulSoup(original.read_text(encoding='utf-8-sig'), 'html.parser')
        if soup.h1:
            pipeline['GLOSSARY'][pipeline['normalized'](soup.h1.get_text())] = heading
        if soup.title:
            pipeline['GLOSSARY'][pipeline['normalized'](soup.title.get_text())] = heading + ' | WaiKwan'
pipeline['GLOSSARY'].update({
    'Tents': 'Carpas', 'Canopy tents': 'Carpas plegables', 'Canopy Tents': 'Carpas plegables',
    'Beach Flags & Poles': 'Banderas publicitarias y mástiles',
    'Display Systems & Light Boxes': 'Sistemas de exposición y cajas de luz',
    'Accessories & Spare Parts': 'Accesorios y repuestos', 'Race Gates & Event Arches': 'Puertas de carrera y arcos para eventos',
    'Browse All Tents': 'Ver todas las carpas', 'Browse all tents': 'Ver todas las carpas',
    'Folding Canopy Types': 'Tipos de carpas plegables', 'View Race Gates': 'Ver puertas de carrera',
    'Custom Canopy Tent Manufacturer': 'Fabricante de carpas plegables personalizadas',
    'Pop Up Canopy Tent Supplier': 'Proveedor de carpas plegables',
    'Inflatable Tent': 'Carpa inflable', 'Three-leg Inflatable Tent': 'Carpa inflable de tres patas',
    'Aluminum Folding Tent': 'Carpa plegable de aluminio',
    'Feather & Teardrop Beach Flags': 'Banderas publicitarias tipo pluma y gota',
    'SEG Light Box': 'Caja de luz SEG', 'Tension Fabric Backwall': 'Fondo de exposición de tejido tensado',
    'Trade Shows & Exhibitions': 'Ferias y exposiciones', 'Best Sellers': 'Productos más vendidos',
    'Lead Time': 'Plazo de producción', 'Artwork Files': 'Archivos de impresión',
    'Share the WaiKwan factory homepage': 'Compartir la página de WaiKwan',
    'Inflatable Three-leg Tent': 'Carpa inflable de tres patas',
    '40 Hexagon Aluminum Frame Tent': 'Carpa con estructura hexagonal de aluminio de 40 mm',
    '50 Hexagon Aluminum Frame Tent': 'Carpa con estructura hexagonal de aluminio de 50 mm',
    '30 Square Iron Tube Tent': 'Carpa con tubo cuadrado de acero de 30 mm',
    '普通黑金刚 / Standard Black': 'Estructura negra estándar',
    'Light Box Series': 'Serie de cajas de luz', 'Custom Products': 'Productos personalizados',
    'All Categories': 'Todas las categorías', 'View Type': 'Ver modelo',
    'DOME 3 Folding Series': 'Serie plegable DOME 3',
})
base_clean = pipeline['clean_translation']
def clean_spanish(value, result):
    import html
    result = html.unescape(result).replace('m2', 'm²')
    for old, new in [('carpas de canopy', 'carpas plegables'), ('tiendas de campaña', 'carpas'),
                     ('Tiendas de campaña', 'Carpas'), ('tiendas de vela', 'carpas plegables'),
                     ('Tiendas de vela', 'Carpas plegables'), ('obras de arte', 'archivos de impresión'),
                     ('tiempo de plomo', 'plazo de producción'), ('cajas ligeras', 'cajas de luz')]:
        result = result.replace(old, new)
    if value in pipeline['GLOSSARY']:
        return pipeline['GLOSSARY'][value]
    if re.findall(r'\d+', value) != re.findall(r'\d+', result):
        labels = {'Model / configuration:': 'Modelo / configuración:', 'Size:': 'Tamaño:',
                  'Material / construction:': 'Material / construcción:',
                  'Listed weight / capacity (by configuration):': 'Peso / capacidad por configuración:',
                  'Listed weight / capacity:': 'Peso / capacidad:',
                  'Carton / packing details (source):': 'Datos de caja / embalaje:',
                  'Packing / weight details (source basis):': 'Datos de embalaje / peso:',
                  'Packing quantity:': 'Cantidad por caja:', 'Carton gross weight (kg):': 'Peso bruto de la caja (kg):'}
        for old, new in labels.items():
            value = value.replace(old, new)
        return value
    return result
pipeline['clean_translation'] = clean_spanish

class SpanishModel(pipeline['LocalModel']):
    def __init__(self, directory, language_pair):
        if language_pair == 'en_es' and (directory / 'en_es').is_dir():
            # The original en_es Argos archive predates the translate-* naming.
            import sentencepiece
            import ctranslate2
            package = directory / 'en_es'
            self.tokens = sentencepiece.SentencePieceProcessor(model_file=str(package / 'sentencepiece.model'))
            self.engine = ctranslate2.Translator(str(package / 'model'), compute_type='int8', inter_threads=2, intra_threads=4)
        else:
            super().__init__(directory, language_pair)

pipeline['LocalModel'] = SpanishModel

# Read the actual English UI values instead of relying on regex to parse JS.
# This also captures punctuation and HTML-valued entries in multilang.js.
original_catalog = pipeline['catalog_phrases']
def catalog_and_ui():
    import subprocess
    import json
    code = """
const fs = require('node:fs'), vm = require('node:vm');
const context = {window: {}, document: {addEventListener() {}}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('scripts/multilang.js', 'utf8'), context);
const values = vm.runInContext('MultiLanguageSystem.prototype.init = function() {}; Object.values(new MultiLanguageSystem().translations.en)', context);
console.log(JSON.stringify(values));
"""
    values = json.loads(subprocess.check_output(['node', '-e', code], cwd=pipeline['ROOT'], encoding='utf-8'))
    phrases = original_catalog()
    for value in values:
        soup = pipeline['BeautifulSoup'](value, 'html.parser')
        phrases.update(pipeline['normalized'](text) for text, _ in pipeline['translation_slots'](soup))
    return phrases
pipeline['catalog_phrases'] = catalog_and_ui
pipeline['RUNTIME'] = (*pipeline['RUNTIME'], 'contact', 'customizer')

if __name__ == '__main__':
    pipeline['main']()
    import runpy
    runpy.run_path(str(Path(__file__).with_name('sync-spanish-alternates.py')), run_name='__main__')
