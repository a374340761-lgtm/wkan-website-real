"""Build six static mirrors with the existing German pipeline (UTF-8).

Models and caches stay outside Git. Run --help for reproducible build options.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.request
import zipfile
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / 'scripts/six-language-config.json').read_text(encoding='utf-8'))
LOCALES = tuple(CONFIG['locales'])
VERSION = CONFIG['version']


def prepare_models(folder, locale):
    index = json.load(urllib.request.urlopen(
        'https://raw.githubusercontent.com/argosopentech/argospm-index/main/index.json', timeout=60))
    for source, target in [('en', locale), ('zh', 'en')]:
        pair = source + '_' + target
        if list(folder.glob('translate-' + pair + '*/model/model.bin')) or (folder / pair / 'model/model.bin').is_file():
            continue
        item = next(x for x in index if x['from_code'] == source and x['to_code'] == target)
        archive = folder / (pair + '.argosmodel')
        print('Downloading ' + pair, flush=True)
        try:
            urllib.request.urlretrieve(item['links'][0], archive)
        except OSError:
            # Pinned mirror, verified against its LFS SHA-256 before extraction.
            revision = 'dbf229d6675e9ea11aeeb364a8d55fc81418d531'
            base = 'https://huggingface.co/shethjenil/argostranslate'
            filename = 'translate-' + pair + '.argosmodel'
            tree = json.load(urllib.request.urlopen(base.replace('huggingface.co/', 'huggingface.co/api/models/') + '/tree/' + revision))
            entry = next(x for x in tree if x['path'] == filename)
            urllib.request.urlretrieve(base + '/resolve/' + revision + '/' + filename, archive)
            with archive.open('rb') as downloaded:
                digest = hashlib.file_digest(downloaded, 'sha256').hexdigest()
            if digest != entry['lfs']['oid']:
                raise ValueError('Translation model checksum mismatch: ' + pair)
        with zipfile.ZipFile(archive) as package:
            for name in package.namelist():
                if not (folder / name).resolve().is_relative_to(folder.resolve()):
                    raise ValueError('Unsafe model archive path')
            package.extractall(folder)


def build(locale, models, cache, release):
    source = (ROOT / 'scripts/build-german-site.py').read_text(encoding='utf-8')
    for old, new in [('German', locale), ('german', locale), ('/de', '/' + locale),
                     ('"de"', json.dumps(locale)), ('de/', locale + '/'),
                     ('data-de-static', 'data-' + locale + '-static'),
                     ('WK_DE_', 'WK_' + locale.upper() + '_'), ('en_de', 'en_' + locale)]:
        source = source.replace(old, new)
    pipeline = {'__name__': 'locale_pipeline', '__file__': str(ROOT / 'scripts/build-german-site.py')}
    exec(compile(source, str(ROOT / 'scripts/build-german-site.py'), 'exec'), pipeline)
    original_sources = pipeline['git_sources']
    pipeline['git_sources'] = lambda: [p for p in original_sources()
        if p.split('/')[0] not in ('de', 'es', *LOCALES)]
    # Never inherit authored German text or German terminology overrides.
    pipeline['GLOSSARY'] = {'WaiKwan': 'WaiKwan', 'WhatsApp': 'WhatsApp', 'WeChat': 'WeChat'}
    labels = ['Home','Products','All Products','About Us','Contact','Request a Quote','Send Inquiry','Search','Filter','Reset','Specifications','Downloads','Privacy Policy','Terms','Add to RFQ list','Product not found','Canopy Tents','Beach Flags','Display Systems','Accessories']
    authored = {
        'fr': ['Accueil','Produits','Tous les produits','À propos','Contact','Demander un devis','Envoyer la demande','Rechercher','Filtrer','Réinitialiser','Caractéristiques techniques','Téléchargements','Politique de confidentialité',"Conditions d’utilisation",'Ajouter à la liste de devis','Produit introuvable','Tentes pliantes','Drapeaux publicitaires',"Systèmes d’exposition",'Accessoires'],
        'it': ['Home','Prodotti','Tutti i prodotti','Chi siamo','Contatti','Richiedi un preventivo','Invia richiesta','Cerca','Filtra','Reimposta','Specifiche tecniche','Download','Informativa sulla privacy',"Condizioni d’uso",'Aggiungi alla richiesta di preventivo','Prodotto non trovato','Gazebo pieghevoli','Bandiere pubblicitarie','Sistemi espositivi','Accessori'],
        'pt': ['Início','Produtos','Todos os produtos','Sobre nós','Contato','Solicitar orçamento','Enviar consulta','Pesquisar','Filtrar','Redefinir','Especificações técnicas','Downloads','Política de privacidade','Termos de uso','Adicionar à lista de orçamento','Produto não encontrado','Tendas dobráveis','Bandeiras publicitárias','Sistemas de exposição','Acessórios'],
        'nl': ['Home','Producten','Alle producten','Over ons','Contact','Offerte aanvragen','Aanvraag verzenden','Zoeken','Filteren','Resetten','Technische specificaties','Downloads','Privacybeleid','Gebruiksvoorwaarden','Toevoegen aan offertelijst','Product niet gevonden','Vouwtenten','Beachflags','Presentatiesystemen','Accessoires'],
        'sv': ['Hem','Produkter','Alla produkter','Om oss','Kontakt','Begär offert','Skicka förfrågan','Sök','Filtrera','Återställ','Tekniska specifikationer','Nedladdningar','Integritetspolicy','Användarvillkor','Lägg till i offertlistan','Produkten hittades inte','Hopfällbara tält','Beachflaggor','Displaysystem','Tillbehör'],
        'da': ['Forside','Produkter','Alle produkter','Om os','Kontakt','Anmod om tilbud','Send forespørgsel','Søg','Filtrer','Nulstil','Tekniske specifikationer','Downloads','Privatlivspolitik','Brugsvilkår','Tilføj til tilbudslisten','Produktet blev ikke fundet','Foldetelte','Beachflag','Displaysystemer','Tilbehør'],
    }
    pipeline['GLOSSARY'].update(zip(labels, authored[locale]))
    for label in ['Get Quote', 'Get quote', 'Get a Quote', 'Request a quote']:
        pipeline['GLOSSARY'][label] = authored[locale][5]
    for label in ['Guangxi WaiKwan Tent Manufacturing Co., Ltd', 'Guangxi WaiKwan Tent Manufacturing Co., Ltd.']:
        pipeline['GLOSSARY'][label] = label
    pipeline['GLOSSARY']['Frame / hardware material'] = {
        'fr': 'Matériau du cadre et des accessoires', 'it': 'Materiale del telaio e degli accessori',
        'pt': 'Material da estrutura e dos acessórios', 'nl': 'Materiaal van frame en onderdelen',
        'sv': 'Material i ram och beslag', 'da': 'Materiale til stel og beslag'}[locale]
    for label in ['English', 'Deutsch', 'Español', 'Français', 'Italiano', 'Português', 'Nederlands', 'Svenska', 'Dansk', '简体中文', '中文']:
        pipeline['GLOSSARY'][label] = label
    pipeline['GLOSSARY']['Guangxi WaiKwan Tent Manufacturing Co., Ltd.'] = 'Guangxi WaiKwan Tent Manufacturing Co., Ltd.'
    pipeline['GLOSSARY']['与'], pipeline['GLOSSARY']['或'] = {
        'fr': ('et', 'ou'), 'it': ('e', 'o'), 'pt': ('e', 'ou'),
        'nl': ('en', 'of'), 'sv': ('och', 'eller'), 'da': ('og', 'eller')}[locale]
    pipeline['HEADINGS'] = {}
    pipeline['SEO_HEADINGS'] = {}
    pipeline['TERMS'] = {}
    original_prepare = pipeline['prepare_document']
    def prepare(*args, **kwargs):
        soup = original_prepare(*args, **kwargs)
        # Bilingual source siblings carry the same content. Keep one translated
        # copy, avoiding duplicate hidden content and translation of internal paths.
        for element in list(soup.select('.zh')):
            if element.parent and element.parent.find(class_='en', recursive=False):
                element.decompose()
        for text in list(soup.find_all(string=True)):
            if text.parent.name not in {'script', 'style'} and 'allpagepng/' in str(text):
                text.replace_with('Original catalog, page 17')
        return soup
    pipeline['prepare_document'] = prepare
    class Model:
        def __init__(self, directory, pair):
            package = next(iter(directory.glob('translate-' + pair + '*')), directory / pair)
            self.bpe = None
            if (package / 'sentencepiece.model').exists():
                self.tokens = pipeline['sentencepiece'].SentencePieceProcessor(model_file=str(package / 'sentencepiece.model'))
            else:
                from sacremoses import MosesTokenizer, MosesDetokenizer, MosesPunctNormalizer
                from subword_nmt.apply_bpe import BPE
                self.bpe = BPE((package / 'bpe.model').open(encoding='utf-8'))
                self.tokenizer = MosesTokenizer(lang=pair.split('_')[0])
                self.detokenizer = MosesDetokenizer(lang=pair.split('_')[1])
                self.normalizer = MosesPunctNormalizer(lang=pair.split('_')[0])
            self.engine = pipeline['ctranslate2'].Translator(str(package / 'model'), compute_type='int8', inter_threads=2, intra_threads=2)
        def batch(self, phrases):
            encoded = [self.bpe.process_line(' '.join(self.tokenizer.tokenize(self.normalizer.normalize(text)))).split()
                       if self.bpe else self.tokens.encode(text, out_type=str) for text in phrases]
            result = self.engine.translate_batch(encoded, beam_size=2, max_batch_size=768, batch_type='tokens')
            return [self.detokenizer.detokenize(' '.join(row.hypotheses[0]).replace('@@ ', '').split())
                    if self.bpe else self.tokens.decode(row.hypotheses[0]) for row in result]
    pipeline['LocalModel'] = Model
    pipeline['clean_translation'] = lambda value, result: result.replace('\u2581', ' ')
    original_fill = pipeline['fill_translations']
    def fill(phrases, directory, path):
        values = original_fill(phrases, directory, path)
        model = Model(directory, 'en_' + locale)
        bridges = {
            '上海国际广告展 · 2026年9月': 'SIGN CHINA Shanghai · 2026 / 9',
            '展会新闻 · 2026年5月 · 广州': 'Exhibition news · 2026 / 5 · Guangzhou',
            '展会 · 2026年3月 · 上海': 'Exhibition · 2026 / 3 · Shanghai',
            '2026年9月15–17日 · 上海新国际博览中心': '2026 / 9 / 15–17 · Shanghai New International Expo Centre',
            '2026年3月，伟群帐篷参加了在上海举办的 APPPEXPO 2026 展会，并在现场展示了公司一系列最新的展示与品牌宣传解决方案。这次展会为我们提供了一个与客户面对面交流、更加直观展示产品、并进一步加强与不同市场客户及合作伙伴联系的宝贵机会。': 'In 2026 / 3, WaiKwan attended APPPEXPO 2026 in Shanghai. We presented our latest exhibition and branding solutions. The event allowed us to meet customers, demonstrate products and strengthen relationships with customers and partners from different markets.',
            '闭气式充气结构，充气完成后无需持续连接气泵。采用 400D（220g）PU 涂层涤纶布、0.3mm TPU 内胆，支持热升华全彩印刷，可选配电泵。': 'The airtight inflatable structure does not need a continuously connected pump after inflation. It uses 400D (220g) PU-coated polyester and a 0.3mm TPU bladder. Full-colour sublimation printing and an optional electric pump are available.',
            '尺寸为 60 × 42 cm，可与充气椅组合布置洽谈及休息区。现场桌椅采用统一的品牌画面，与充气帐篷搭配，形成完整的接待空间。': 'The table measures 60 × 42 cm and can be combined with inflatable chairs for meeting and rest areas. Matching branding on the tables, chairs and inflatable tent creates a coordinated reception space.',
        }
        for key, english in bridges.items():
            values[key] = ' '.join(model.batch(pipeline['parts'](english))).replace('\u2581', ' ')
        # Translate labels around technical numbers rather than permitting the model
        # to invent, omit or reformat a dimension or a model identifier.
        repairs = {}
        for key, value in values.items():
            if re.findall(r'\d+', key) != re.findall(r'\d+', value):
                chunks = re.split(r'(\b[\w.-]*\d[\w.×*/+-]*\b|\d+|[²³])', bridges.get(key, key))
                repairs[key] = chunks
        segments = sorted({s for chunks in repairs.values() for s in chunks
                           if re.search(r'[A-Za-z]{3}', s) and not re.search(r'\d', s)})
        translated = {}
        for offset in range(0, len(segments), 128):
            batch = segments[offset:offset + 128]
            for original, result in zip(batch, model.batch(batch)):
                translated[original] = (' ' if original[:1].isspace() else '') + result.replace('\u2581', ' ').strip() + (' ' if original[-1:].isspace() else '')
        for key, chunks in repairs.items():
            result = ''.join(translated.get(s, s).replace('\u2581', ' ') for s in chunks)
            values[key] = result if re.findall(r'\d+', key) == re.findall(r'\d+', result) else key
        values = {k: v.replace('\u2581', ' ') for k, v in values.items()}
        path.write_text(json.dumps(values, ensure_ascii=False), encoding='utf-8')
        return values
    pipeline['fill_translations'] = fill
    original_catalog = pipeline['catalog_phrases']
    def catalog():
        code = "const fs=require('fs'),vm=require('vm');const c={window:{},document:{addEventListener(){}},console,localStorage:{getItem(){return null}}};vm.createContext(c);vm.runInContext(fs.readFileSync('scripts/multilang.js','utf8'),c);console.log(JSON.stringify(vm.runInContext('MultiLanguageSystem.prototype.init=function(){};Object.values(new MultiLanguageSystem().translations.en)',c)));"
        values = json.loads(subprocess.check_output(['node', '-e', code], cwd=ROOT, encoding='utf-8'))
        phrases = original_catalog()
        for value in values:
            soup = pipeline['BeautifulSoup'](value, 'html.parser')
            phrases.update(pipeline['normalized'](text) for text, _ in pipeline['translation_slots'](soup))
        return phrases
    pipeline['catalog_phrases'] = catalog
    pipeline['RUNTIME'] = (*pipeline['RUNTIME'], 'contact', 'customizer')
    runtime = (ROOT / 'scripts/spanish-localization.js').read_text(encoding='utf-8')
    runtime = runtime.replace('Spanish', 'Locale').replace('spanish', 'locale')
    runtime = runtime.replace('/es', '/' + locale).replace(r'\/es', r'\/' + locale).replace('WK_ES_', 'WK_' + locale.upper() + '_')
    runtime = runtime.replace('data-es-static', 'data-' + locale + '-static')
    runtime = runtime.replace('(?:zh|de)', '(?:zh|de|es|fr|it|pt|nl|sv|da)')
    (ROOT / 'scripts' / (locale + '-localization.js')).write_text(runtime, encoding='utf-8')
    sys.argv = [__file__, '--models', str(models), '--cache', str(cache)] + (['--release'] if release else [])
    pipeline['main']()
    review = []
    translations = json.loads(cache.read_text(encoding='utf-8'))
    for original, translated in translations.items():
        if pipeline['re'].findall(r'\d+', original) != pipeline['re'].findall(r'\d+', translated):
            review.append({'source': original, 'translation': translated, 'reason': 'numeric mismatch; source retained'})
    report = ROOT / 'reports/localization' / (locale + '-review.json')
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(review, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for page in (ROOT / locale).rglob('*.html'):
        text = page.read_text(encoding='utf-8')
        text = text.replace('20261112-inflatable-r1', VERSION)
        text = text.replace(locale + '-localization.js"', locale + '-localization.js?v=' + VERSION + '"')
        if locale == 'pt':
            text = text.replace('lang="pt"', 'lang="pt-BR"').replace('"inLanguage":"pt"', '"inLanguage":"pt-BR"')
        page.write_text(text, encoding='utf-8')
    manifest = ROOT / locale / 'locale-map.json'
    data = json.loads(manifest.read_text(encoding='utf-8'))
    data.update(version=VERSION, hreflang=CONFIG['locales'][locale]['hreflang'])
    manifest.write_text(json.dumps(data, ensure_ascii=False) + '\n', encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--locales', nargs='+', choices=LOCALES, default=list(LOCALES))
    parser.add_argument('--workdir', type=Path, default=Path(os.environ.get('LOCALAPPDATA', str(Path.home() / '.cache'))) / 'WaiKwan/localization')
    parser.add_argument('--download-models', action='store_true')
    parser.add_argument('--release', action='store_true')
    args = parser.parse_args()
    args.workdir.mkdir(parents=True, exist_ok=True)
    for locale in args.locales:
        if args.download_models:
            prepare_models(args.workdir, locale)
        build(locale, args.workdir, args.workdir / (locale + '-cache.json'), args.release)
    if args.release:
        subprocess.run([sys.executable, str(ROOT / 'scripts/sync-site-locales.py')], check=True)
        subprocess.run([sys.executable, str(ROOT / 'scripts/build-page-sitemap.py')], check=True)
        subprocess.run([sys.executable, str(ROOT / 'scripts/validate-six-language-sites.py')], check=True)
