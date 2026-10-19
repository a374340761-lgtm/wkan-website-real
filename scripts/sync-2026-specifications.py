"""Extract only reviewed technical columns; never publish workbook prices.

Usage: python scripts/sync-2026-specifications.py <user supplied source directory>
The original workbooks remain untouched. Mapping is deliberately explicit.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

import openpyxl
import xlrd

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path(sys.argv[1])
SHEETS = {}
FILES = {}
for path in SOURCE.iterdir():
    if path.suffix.lower() not in ('.xls', '.xlsx'):
        continue
    FILES[path.name] = hashlib.sha256(path.read_bytes()).hexdigest()
    if path.suffix.lower() == '.xls':
        book = xlrd.open_workbook(str(path))
        tabs = [(s.name, [[s.cell_value(r, c) for c in range(s.ncols)] for r in range(s.nrows)]) for s in book.sheets()]
    else:
        book = openpyxl.load_workbook(path, read_only=True, data_only=True)
        tabs = [(s.title, list(s.values)) for s in book]
    for title, rows in tabs:
        SHEETS[path.name, title] = {i: {j: str(v).strip() for j, v in enumerate(row, 1) if v is not None and str(v).strip()} for i, row in enumerate(rows, 1)}

DATA = {}
AUDIT = []
LABELS = {
    'model': ('型号 / 配置', 'Model / configuration'), 'size': ('尺寸', 'Size'),
    'weight': ('参考净重 (kg)', 'Reference net weight (kg)'), 'carton': ('箱规 (cm)', 'Carton (cm)'),
    'packing': ('装箱数', 'Packing quantity'), 'gw': ('整箱毛重 (kg)', 'Carton gross weight (kg)'),
    'material': ('材质 / 结构', 'Material / construction'), 'graphic': ('旗面 / 画面尺寸', 'Graphic size'),
    'pole': ('杆件尺寸 / 配合', 'Pole dimensions / fit'), 'height': ('高度', 'Height'),
    'frameGW': ('支架毛重 (kg)', 'Frame gross weight (kg)'), 'roofGW': ('顶布毛重 (kg)', 'Roof gross weight (kg)'),
    'roofCarton': ('顶布箱规 (cm)', 'Roof carton (cm)'), 'note': ('配置说明', 'Configuration'),
}

def cell(file, sheet, row, col):
    return SHEETS[file, sheet].get(row, {}).get(col, '')

def number(value):
    return str(float(value)).removesuffix('.0') if re.fullmatch(r'\d+(\.\d+)?', value) else value

def group(key, file, sheet, row_numbers, title_zh, title_en, cols, notes_zh=(), notes_en=()):
    rows = []
    for r in row_numbers:
        entry = {name: number(cell(file, sheet, r, col)) for name, col in cols.items()}
        if any(entry.values()):
            rows.append(entry)
    g = {'titleZh': title_zh, 'titleEn': title_en,
         'columns': [{'key': k, 'zh': LABELS[k][0], 'en': LABELS[k][1]} for k in cols],
         'rows': rows, 'notesZh': list(notes_zh), 'notesEn': list(notes_en),
         'source': {'file': file, 'sheet': sheet, 'rows': list(row_numbers)}}
    DATA.setdefault(str(key), []).append(g)
    AUDIT.append({'target': str(key), **g['source'], 'configurations': len(rows)})
    return g

def translate_material(value):
    return value.replace('HDPE/聚乙烯', 'HDPE / polyethylene').replace('35%不锈钢丝45%尼龙网布20%涤纶', '35% stainless steel wire / 45% nylon mesh / 20% polyester').replace('35%不绣钢丝   65%600D牛津布', '35% stainless steel wire / 65% 600D Oxford fabric').replace('35%不绣钢丝   65%190T涤纶布', '35% stainless steel wire / 65% 190T polyester')

# Exact-model furniture matches. Dimensions retain L/W/H from the source.
f = '桌子+椅子价格表.xls'
for key, rows in {'31001':[12,17,22,27], '31005':[52], '31006':[11], '31007':[4], '31008':[10], '31009':[32], '31010':[37,42,47], '31013':[58], '31014':[9], '31015':[59], '31016':[61], '31202':[65], '31203':[62], '31204':[63], '31205':[64]}.items():
    g = group(key, f, '桌子', rows, '尺寸、材质与装箱', 'Dimensions, materials and packing', {'model':1,'size':5,'material':7,'weight':11,'carton':21}, ['尺寸按原表标注；净重与整箱毛重分别核对，装箱配置以出货确认为准。'], ['Dimensions follow the source labels. Net and carton gross weights are distinct; confirm the packing configuration for shipment.'])
    for row in g['rows']:
        row['size'] += ' cm' if 'CM' not in row['size'].upper() else ''
        row['material'] = translate_material(row['material'])
        row['carton'] = row['carton'].replace('毛重', 'G.W.')

# Hexagonal aluminum: retain distinct constructions rather than combining weights.
f = '伟群帐篷有限公司（铁铝40管50管棱型架)不含.xls'
for key, sheet, rows, zh, en, material_zh, material_en in [
    ('2002','40-50管豪华铁铝菱形架17KG款',range(5,14),'40 mm 六角铝架 · 常规配置','40 mm hexagonal aluminum · standard configuration','上管40×45×1.2 mm；下管36×40×1.2 mm；交叉管13×25×1.1 mm；尼龙连接件。','Upper leg 40 × 45 × 1.2 mm; lower leg 36 × 40 × 1.2 mm; scissor tube 13 × 25 × 1.1 mm; nylon joints.'),
    ('2002','铝合金40管经济款15.5KG款',range(4,13),'40 mm 六角铝架 · 经济配置','40 mm hexagonal aluminum · economy configuration','上管40×45×1.2 mm；下管36×40×1.1 mm；交叉管13×25×1.0 mm；尼龙连接件。','Upper leg 40 × 45 × 1.2 mm; lower leg 36 × 40 × 1.1 mm; scissor tube 13 × 25 × 1.0 mm; nylon joints.'),
    ('2003','40-50管豪华铁铝菱形架17KG款',range(24,32),'50 mm 六角铝架 · 1.5 mm 立柱配置','50 mm hexagonal aluminum · 1.5 mm leg configuration','上管50×57×1.5 mm；下管43×49×1.5 mm；交叉管17×35×1.35 mm；尼龙连接件、铁脚板。','Upper leg 50 × 57 × 1.5 mm; lower leg 43 × 49 × 1.5 mm; scissor tube 17 × 35 × 1.35 mm; nylon joints and steel feet.'),
    ('2003','50管1.7厚',range(3,11),'50 mm 六角铝架 · 1.7 mm 配置','50 mm hexagonal aluminum · 1.7 mm configuration','上管50×57×1.7 mm；下管43×49×1.7 mm；交叉管17×35×1.7 mm；尼龙连接件、铁脚板。','Upper leg 50 × 57 × 1.7 mm; lower leg 43 × 49 × 1.7 mm; scissor tube 17 × 35 × 1.7 mm; nylon joints and steel feet.')]:
    g = group(key,f,sheet,rows,zh,en,{'model':1,'size':3,'weight':6,'carton':15 if sheet=='50管1.7厚' else 17},[material_zh,'表内重量为理论裸架净重，不含顶布；同型号不同配置不能混用重量或管材参数。'],[material_en,'Theoretical frame net weights exclude canopy fabric. Do not mix weights or tube dimensions between configurations.'])
    for r in g['rows']:
        r['model'] = r['model'].replace(' ', '')
        r['size'] = r['size'].replace('*',' × ')+' m'

f='伟群帐篷有限公司（豪华铁质方管40管30管架).xls'
g=group('2001',f,'豪华铁30.40方形架',range(26,33),'30 mm 方管铁架 · AD-T30 配置','30 mm square steel frame · AD-T30 configuration',{'model':1,'size':3,'weight':6,'carton':16},['上管30×30×0.8 mm；下管25×25×0.6 mm；交叉管13×25×0.6 mm；尼龙连接件、自动锁扣、尼龙脚板。','此表为AD-T30系列型号；重量为理论裸架净重，不含篷布。'],['Upper leg 30 × 30 × 0.8 mm; lower leg 25 × 25 × 0.6 mm; scissor tube 13 × 25 × 0.6 mm; nylon joints, automatic locks and nylon feet.','These are the AD-T30 model codes in the supplied sheet. Weights are theoretical frame net weights, excluding fabric.'])
for r in g['rows']: r['size']=r['size'].replace('*',' × ')+' m'

# Accessories: exact existing AD/WK codes, using the matching workbook rather than aliasing codes.
f='帐篷配件.xls'
for key, row in {'9002':6,'9003':3,'9004':7,'9011':16,'9012':19,'9015':23,'9016':24,'9020':26,'9021':27,'9022':28,'9023':29,'9024':14}.items():
    g=group(key,f,'帐篷配件',[row],'配套规格','Accessory specifications',{'model':1,'size':4,'material':5,'weight':7,'carton':12},['未标注的参数请在询价时确认；型号相近的配件不可直接互换。'],['Confirm unlisted parameters when requesting a quote; similarly named accessories are not necessarily interchangeable.'])
    for r in g['rows']:
        r['material']=r['material'].replace('PE','PE').replace('铝合金','Aluminum').replace('碱砂','Alkali sand finish')
f='伟群帐篷有限公司（铁铝40管50管棱型架)不含.xls'
for key,row in {'9001':4,'9005':6,'9006':7,'9009':10,'9010':11,'9013':14,'9014':15,'9017':16}.items():
    g=group(key,f,'帐篷配件',[row],'AD 系列配套规格','AD series accessory specifications',{'model':2,'size':4,'weight':5,'carton':8},['配重、容量和空件重量应分别确认；包装以实际出货为准。'],['Confirm ballast, capacity and empty accessory weight separately. Packing is subject to shipment confirmation.'])
    if key=='9010':
        g['notesZh'].append('AD-T06：1680D牛津布、1.5 mm铁托板，支持LOGO印刷和绣花；此数据不套用于其他拖轮包。')
        g['notesEn'].append('AD-T06 uses 1680D Oxford fabric and a 1.5 mm steel base plate, with logo printing or embroidery options. These details do not apply to other wheeled bags.')
    if key=='9013':g['notesZh'].append('30#/40#，尼龙，一套2个。');g['notesEn'].append('30#/40#, nylon, two pieces per set.')
    if key=='9014':g['notesZh'].append('40#六角半围PC连接件，一套2个；按对应管型确认兼容。');g['notesEn'].append('40# hexagonal half-wall PC connectors, two per set; confirm the matching tube profile.')
    if key=='9017':g['notesZh'].append('40#/50#，尼龙，一套2个。');g['notesEn'].append('40#/50#, nylon, two pieces per set.')

# Exact WK-PO fabric pop-up models.
f='广州市伟群展示器材有限公司快幕秀。拉网.xls'
group('42003',f,'拉网',[5,6,7],'WK-PO 拉网展架','WK-PO fabric pop-up display',{'model':2,'size':3,'graphic':4,'weight':9,'carton':10},['表内画面尺寸单位mm；两侧包边各350 mm。3×3行注明1.0 mm管壁，其他配置需确认。重量原表标为成品重量。'],['Graphic dimensions are in mm, with 350 mm side returns on each side. A 1.0 mm tube wall is stated for the 3×3 row; confirm other configurations. Weights are listed as finished-product weights in the source.'])

# Light-box family configurations. Ambiguous source rows are deliberately omitted.
f='伟群展示型材折叠背景灯箱批量价格.xls'
for rows,zh,en in [(range(4,12),'WK1 · 75 cm 单元卡布拉网灯箱','WK1 · 75 cm cell SEG pop-up light box'),(range(12,21),'WK2 · 1 m 单元卡布拉网灯箱','WK2 · 1 m cell SEG pop-up light box')]:
    valid=[r for r in rows if r not in (6,15)]
    group('43003',f,'卡布拉网灯箱',valid,zh,en,{'model':2,'size':3},['尺寸按mm列示；本表未提供整套重量和包装尺寸。'],['Dimensions are shown in mm. Complete-system weights and carton dimensions are not provided in this sheet.'])
group('43002',f,'型材灯箱',[4,6,7,8,9],'WK-W 型材灯箱配置','WK-W aluminum profile light-box configurations',{'model':2,'size':3},['产品尺寸单位mm。85×2H行与尺寸850×2200相互矛盾，暂不采用该行。'],['Product dimensions are in mm. The conflicting 85×2H / 850×2200 source row is omitted.'])

# Flag family mapping. New AD-A / AD-B codes are not merged with old catalog code meanings.
f='2026奥动牌沙滩旗杆价格.xlsx'
for key,rows,zh,en in [
    ('95003',range(4,12),'WK 铝管+玻纤 · 1.0 mm 管壁配置','WK aluminum + fiberglass · 1.0 mm tube-wall configurations'),
    ('95005',[23,25,27,29,36,38,40,42,45,46,47],'全玻纤刀旗 · 标准、加强与短节配置','All-fiberglass feather flags · standard, reinforced and short-section configurations'),
    ('95004',[24,26,28,30,37,39,41,43],'全玻纤水滴旗配置','All-fiberglass teardrop flag configurations'),
    ('95007',[31,32,33,34],'AD-D 全玻纤方旗配置','AD-D fiberglass rectangle flag configurations'),
    ('95009',[18,19,20,128,129,130],'全铝方旗 · WK-C10 / WK-H3 配置','Aluminum rectangle flags · WK-C10 / WK-H3 configurations'),
    ('95008',[131,132,133],'WK-S3 半圆全铝旗杆','WK-S3 semicircle aluminum flag poles'),
    ('95010',[134,135,136],'WK-S4 刀型全铝旗杆','WK-S4 feather-shaped aluminum flag poles')]:
    g=group(key,f,'Sheet1',rows,zh,en,{'model':9,'height':3,'pole':10,'graphic':13,'carton':14,'packing':15},['按型号、旗形和整箱配置分别选择；画面尺寸以cm标注。常规玻纤配合转轴16.8 mm，铝管款按各型号内径确认；不把玻纤规格套用于铝管。','箱规和整箱毛重不能当作单件尺寸或净重。'],['Select by model, flag shape and carton configuration. Graphic sizes are in cm. Fiberglass models specify a 16.8 mm spindle fit; check the individual bore for aluminum models.','Carton dimensions and gross carton weights are not individual product dimensions or net weights.'])
    last_model='WK-C10';last_height=''
    for row in g['rows']:
        if row['model']:last_model=row['model']
        else:row['model']=last_model
        if row['height']:last_height=row['height']
        else:row['height']=last_height
        row['height']=row['height'].replace('旗杆',' pole').replace('米',' m').replace('黑色','Black ').replace('方形','rectangle ')
        row['packing']=row['packing'].replace('毛重约：','G.W. approx. ').replace('毛重：','G.W. ').replace('套/箱','sets/carton').replace('个/箱','pcs/carton').replace('/箱','/carton').replace('/套','/set')
        row['pole']=row['pole'].replace('杆内孔需配16.8mm直径转轴','16.8 mm spindle fit').replace('节',' sections ')
    if key=='95003':
        for i,row in enumerate(g['rows']):row['model'] += ' / '+('Feather' if i%2==0 else 'Teardrop')

g=group('95001',f,'Sheet1',[79],'WK-C16 背包旗','WK-C16 backpack flag',{'model':9,'size':10},['背包尺寸55×33 cm。旗面：方型40×125 cm；P型55×105 cm；刀型40×110 cm；X型45×120 cm。','简约、豪华与X型背包的装箱配置不同；表内多组箱规和重量未能一一对应，不合并列为单件重量。'],['Backpack size: 55 × 33 cm. Graphics: rectangle 40 × 125 cm; P shape 55 × 105 cm; feather 40 × 110 cm; X shape 45 × 120 cm.','Simple, deluxe and X-shaped backpacks have different carton configurations. Unclear carton-to-weight pairings are not presented as individual weights.'])
# Bases with explicit model codes, excluding rows whose packing/weight is contradictory.
g=group('95012',f,'Sheet1',[3,13,14,15,16,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,100,109,110,111,112,113,114,125,126], '旗杆底座与收纳配件','Flag bases and storage accessories',{'model':9,'size':10,'carton':14},['底座按转轴及套柱直径确认兼容；表内重量/容量多种口径，不统一推算承重或抗风等级。'],['Confirm spindle and sleeve compatibility. Mixed weight/capacity labels are not converted into load or wind ratings.'])
for r in g['rows']:
    for k in r:r[k]=r[k].replace('常规套柱','Standard sleeve ').replace('可自订其它直径大小','other diameters by confirmation').replace('不含独立包装：','Without individual box: ').replace('独立包装：','Individual box: ').replace('包装：','Packing: ').replace('底座：','Base: ').replace('转轴：','Spindle: ').replace('箱规:','Carton: ').replace('每套泡泡袋装,','Bubble bag per set, ').replace('长',' long')

# Tent-type landing pages not represented by individual catalog SKUs.
f='2026年星帐-充气账-圆顶帐报价表1.xls'
for key,tab in [('tent:star_1','single peak star tent'),('tent:star_2','double peak star tent')]:
    group(key,f,tab,range(8,14),'星形帐篷尺寸与分件包装','Star tent dimensions and component packing',{'size':2,'carton':6,'frameGW':7,'roofCarton':8,'roofGW':9},['600D涤纶，双层PU涂层；可调铝合金中心杆直径76 mm、壁厚3.0 mm。支架与顶布分别包装、分别标毛重。'],['600D polyester with double PU coating; adjustable aluminum center pole, 76 mm diameter and 3.0 mm wall. Frame and roof are packed separately with separate gross weights.'])
group('tent:inflatable',f,'inflatable',range(7,11),'闭气充气帐篷','Sealed inflatable tent',{'size':2,'carton':8,'gw':9},['600D（260g）双PU涂层涤纶，0.3 mm TPU内胆；热升华印刷。电泵、围墙、遮阳篷与连接布按配置另行确认。'],['600D (260g) polyester with double PU coating and a 0.3 mm TPU bladder; dye-sublimation printing. Confirm pump, walls, awning and connecting cloth separately.'])
f='广西伟群帐篷闭气V型（三脚）价格表.xlsx'
group('tent:inflatable-three-leg-tent',f,'Sheet1',range(7,11),'三脚闭气帐篷','Three-leg sealed inflatable tent',{'size':2,'height':4,'carton':8,'gw':9},['400D（220g）PU涂层涤纶、0.3 mm TPU内胆。规格栏单位m，高度栏单位mm；门高分别1850/2200/2200/2200 mm。'],['400D (220g) PU-coated polyester with a 0.3 mm TPU bladder. Size classes are in m; heights are in mm. Door heights are 1850 / 2200 / 2200 / 2200 mm.'])
f='广西伟群帐篷充气桌椅报价表.xlsx'
for key,rows in [('tent:inflatable-single-chair',[4]),('tent:inflatable-double-chair',[5]),('tent:inflatable-column',range(7,15))]:
    group(key,f,'Sheet1',rows,'充气产品尺寸与装箱','Inflatable product dimensions and packing',{'size':3,'carton':5,'packing':6,'weight':7},['尺寸与箱规单位cm；PVC内胆厚0.5 mm，画面布220g，数码印花。重量按原表口径列示，需核对空件与整箱。'],['Dimensions and cartons are in cm. PVC bladder thickness: 0.5 mm; printed fabric: 220g, digitally printed. Confirm whether a source weight applies to an empty item or a carton.'])

# Export only whitelisted specification fields, never source prices or full workbooks.
f='广西伟群制造有限公司家具折叠桌布价格表.xlsx'
for rows,zh,en,material in [(range(5,9),'造型弹力桌布','Sculpted stretch table covers','Weft-knit stretch fabric'),(range(10,14),'罩型弹力桌布','Fitted stretch table covers','Weft-knit stretch fabric'),(range(15,19),'方型桌布','Rectangular tablecloths','260G warp-knit fabric')]:
    g=group('31101',f,'桌布',rows,zh,en,{'model':1,'size':5,'weight':11},['按4/5/6/8尺桌型分别选用；尺寸单位cm。造型/罩型与方型不可混用画面模板，克重选项按询价确认。'],['Select the matching 4/5/6/8 ft table format; dimensions are in cm. Sculpted, fitted and rectangular covers require different artwork templates; confirm fabric-weight options.'])
    for r in g['rows']:r['model']=r['model'].replace('尺',' ft')
    g['notesZh'].append('纬编弹力布。' if 'stretch' in en else '260G经编布。')
    g['notesEn'].append(material+'.')

g=group('standard-black-flat-tube-3x3','伟群普通黑金刚价格表.xls','普通架',[5,7,9,11,13,17],'普通黑金刚扁管架 · 可选规格','Standard Black flat-tube frame · size configurations',{'size':1},['尺寸：3×3 / 2×2 / 2.5×2.5 / 4×4 / 3×4.5 / 2×3 m；另列3×6 m。','同尺寸有多档重量，原表部分档位标头为空；不将其中一个重量套用于全部架子。'],['Sizes: 3×3 / 2×2 / 2.5×2.5 / 4×4 / 3×4.5 / 2×3 m; 3×6 m is also listed.','Multiple weight grades exist per size and some grade headers are blank. No single weight is applied to all frames.'])

# Correct terminology for columns whose source does not claim a net weight.
for key,groups in DATA.items():
    for g in groups:
        if key=='42003' or key.startswith('tent:inflatable') or key.startswith('90'):
            for col in g['columns']:
                if col['key']=='weight':col.update(zh='表列重量 / 容量（按配置）',en='Listed weight / capacity (by configuration)')
        if key=='43002':
            for r in g['rows']:r['model']=r['model'].replace('型材','Profile ').replace('宽',' W ')

payload={'version':'2026-10-20','products':DATA}
(ROOT/'data/product-specifications-2026.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
products_path=ROOT/'scripts/products.js'
products_js=products_path.read_text(encoding='utf-8')
products_js=re.sub(r'/\* BEGIN VERIFIED 2026 SPECS \*/[\s\S]*?/\* END VERIFIED 2026 SPECS \*/\n*','',products_js)
runtime=(ROOT/'scripts/verified-specifications-runtime.js').read_text(encoding='utf-8')
embedded='/* BEGIN VERIFIED 2026 SPECS */\nconst WK_VERIFIED_SPECIFICATIONS = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'+runtime+'\n/* END VERIFIED 2026 SPECS */\n'
products_path.write_text(embedded+products_js,encoding='utf-8')
manifest={'sourceDirectory':str(SOURCE),'files':FILES,'matches':AUDIT,'omitted':[
    'No exact product match: 1x1m 40mm market stall. The banner-stall sheet describes different 1.2–2.4m products.',
    'Light box row WK1 1x4 has 770x12970; WK2 2x2 repeats 1980x2950; profile 85x2H conflicts with 850x2200. These rows are excluded.',
    'AD-H1 universal frame differs from WK-HO codes; WK-HZ differs from WK-FS waveline codes. No size or weight substitution between these codes.',
    '9401/9402/9403 are fiberglass race gates; inflatable arch tables do not apply. The supplementary photo does not unambiguously map every frame shape to these SKUs.',
    'Fabric tables list different 300D/420D/600D options. No blanket waterproof, fire or UV performance claim is applied to all tent configurations.',
    'AD-T80 dome tent differs from the existing dome-3-folders furniture grouping. No cross-assignment.',
    'Packing weights and empty item weights with ambiguous labels remain unmerged.'], 'policy':'Only verified product specifications are published. Prices and sales terms are excluded.'}
(ROOT/'reports/specifications-2026-source-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Reviewed {len(FILES)} workbooks; matched {len(DATA)} product/type entries, {sum(len(g["rows"]) for groups in DATA.values() for g in groups)} configuration rows.')
