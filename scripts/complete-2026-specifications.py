"""Reviewed technical-only extension, executed by sync-2026-specifications.py.

All column numbers are one-based and explicit. Never infer prices, fill missing
data from another model, or treat workbook 'quantity' as carton quantity.
"""
import copy

LABELS.update({
 'container': ('参考装柜量 20GP / 40HQ', 'Reference load 20GP / 40HQ'),
 'packingDetails': ('装箱与重量说明（原表口径）', 'Packing / weight details (source basis)'),
 'listedWeight': ('表列重量 / 容量', 'Listed weight / capacity'),
 'bore': ('内径 / 配合', 'Bore / fit'),
 'doorHeight': ('门高 (mm)', 'Door height (mm)'),
 'width': ('宽度 (mm)', 'Width (mm)'),
 'tube': ('管材尺寸', 'Tube dimensions'),
 'tableSize': ('配套桌尺寸', 'Associated table size'),
 'folded': ('单件折叠尺寸 (cm)', 'Individual folded size (cm)'),
 'roofArea': ('原表用料面积 (m²)', 'Source fabric area (m²)'),
 'fullWall': ('全围尺寸', 'Full wall size'),
 'halfWall': ('半围尺寸', 'Half wall size'),
 'color': ('颜色', 'Color'),
 'shape': ('旗形 / 配置', 'Flag shape / configuration'),
 'cartonSource': ('包装原值 (mm)', 'Source packing dimensions (mm)'),
 'tubeUsage': ('原表每套米数 (m)', 'Source metres per set (m)'),
})

def add_column(g, key, values):
 if key not in [c['key'] for c in g['columns']]:
  g['columns'].append({'key':key,'zh':LABELS[key][0],'en':LABELS[key][1]})
 for row,value in zip(g['rows'],values):row[key]=number(value)

def extra(key,file,sheet,rows,zh,en,cols,notes_zh=(),notes_en=()):
 return group(key,file,sheet,rows,zh,en,cols,notes_zh,notes_en)

# Enrich existing exact matches with ALL explicit technical/packing columns.
for key,groups in list(DATA.items()):
 for g in groups:
  s=g['source'];f=s['file'];tab=s.get('sheet');rs=s.get('rows',[])
  if not tab:continue
  if f=='桌子+椅子价格表.xls' and tab=='桌子':
   add_column(g,'container',[cell(f,tab,r,19) for r in rs])
   add_column(g,'color',[cell(f,tab,r,9) for r in rs])
  if key in ('2001','2002','2003'):
   col=13 if tab=='50管1.7厚' else 15 if '铁铝40管50管' in f else 14
   add_column(g,'container',[cell(f,tab,r,col) for r in rs])
   add_column(g,'color',[cell(f,tab,r,5) for r in rs])
  if f=='2026奥动牌沙滩旗杆价格.xlsx':
   # Column 15 is NOT merely packing quantity: it also contains carton and
   # per-item weights. Keep its full content in a correctly labelled column.
   for c in g['columns']:
    if c['key']=='packing':c.update(zh=LABELS['packingDetails'][0],en=LABELS['packingDetails'][1])
   if 'packing' not in [c['key'] for c in g['columns']]:
    add_column(g,'packingDetails',[cell(f,tab,r,15) for r in rs])
   add_column(g,'bore',[cell(f,tab,r,11) for r in rs])
   add_column(g,'material',[cell(f,tab,r,8) for r in rs])
   for source_row,row in zip(rs,g['rows']):
    if key in ('95004',) and not cell(f,tab,source_row,3):
     row['height']=cell(f,tab,source_row-1,3)
    if source_row>=128 and 'height' in row:
     # WKZ033 etc. are alternate item codes, NOT pole heights.
     alias=cell(f,tab,source_row,3)
     if alias:row['model']+=' / '+alias
     height=re.search(r'(\d+(?:\.\d+)?)\s*m',cell(f,tab,source_row,10),re.I)
     row['height']=height[1]+' m' if height else ''
     g['source'].setdefault('rowOverrides',{})[str(source_row)]={'height':{'column':10,'transform':'metres'}}
   if key=='95001':
    add_column(g,'graphic',[cell(f,tab,r,13) for r in rs])
    add_column(g,'carton',[cell(f,tab,r,14) for r in rs])
    g['notesZh']=['背包尺寸、旗面与包装分别列示。包装栏按原表分款描述保留，不合并推算单件重量。']
    g['notesEn']=['Backpack, graphic and packing details are separate. The source lists several packing variants; no derived per-item weight is used.']
   if key=='95012':
    # These two cells are visibly carton dimensions in the source's bore
    # column, rather than a spindle diameter.
    for r,row in zip(rs,g['rows']):
     if r in (61,62):row['carton']=row['bore'];row['bore']=''
  if key.startswith('90') and '铁铝40管50管' in f:
   add_column(g,'gw',[cell(f,tab,r,9) for r in rs])
  if key=='tent:inflatable-three-leg-tent':
   add_column(g,'width',[cell(f,tab,r,3) for r in rs])
   add_column(g,'doorHeight',[cell(f,tab,r,5) for r in rs])
  if key=='42003':
   add_column(g,'tube',[cell(f,tab,r,6) for r in rs])
   add_column(g,'note',[cell(f,tab,r,5) for r in rs])

# Distinct square-aluminum, square-steel and hexagonal-steel constructions.
# Do not publish these under a hexagonal ALUMINUM product's own specification.
f='伟群帐篷有限公司（毫华铝合金方管40管30管.xls';tab='豪华铁铝菱形架'
for key,rows,zh,en,material in [
 ('series:square-aluminum-40',range(5,14),'40 mm 方管铝架','40 mm square aluminum frame','Upper 40×40×1.3 mm; lower 35×35×1.3 mm; scissor 13×25×1.1 mm.'),
 ('series:square-aluminum-30',range(26,35),'30 mm 方管铝架','30 mm square aluminum frame','Upper 30×30×1.0 mm; lower 27×27×1.0 mm; scissor 25×13×1.0 mm.')]:
 extra(key,f,tab,rows,zh,en,{'model':1,'size':3,'weight':6,'carton':16,'container':14},[material,'理论裸架重量，不含顶布；不同材质的同号型号不混用。'],[material,'Theoretical bare-frame weight excludes fabric; identical codes in different materials are separate configurations.'])
f='伟群帐篷有限公司（豪华铁质方管40管30管架).xls';tab='豪华铁30.40方形架'
extra('series:square-steel-40',f,tab,range(5,14),'40 mm 方管铁架','40 mm square steel frame',{'model':1,'size':3,'weight':6,'carton':16,'container':14},['上管40×40×0.8 mm；下管35×35×0.8 mm；交叉管25×13×0.6 mm；裸架重量，不含布。'],['Upper 40×40×0.8 mm; lower 35×35×0.8 mm; scissor 25×13×0.6 mm; frame only, fabric excluded.'])
f='伟群帐篷有限公司（铁铝40管50管棱型架)不含.xls';tab='40-50管豪华铁铝菱形架17KG款'
extra('series:hex-steel-40',f,tab,range(42,51),'40 mm 六角铁架','40 mm hexagonal steel frame',{'model':1,'size':3,'weight':6,'carton':17,'container':15},['上管40×45×0.8 mm；下管36×40×0.8 mm；交叉管13×25×0.6 mm。此为铁架，不能套用于40mm铝架。'],['Upper 40×45×0.8 mm; lower 36×40×0.8 mm; scissor 13×25×0.6 mm. Steel construction, separate from 40 mm aluminum frames.'])

# Plain frames: grade/column remains explicit when no grade name is provided.
DATA['standard-black-flat-tube-3x3']=[]
f='伟群普通黑金刚价格表.xls';tab='普通架'
for rows,zh,en in [([5,7,9,11,13,17],'普通黑金刚 · 原表档位','Standard Black · source grades'),([19],'普通黑金刚 · 3×6 m','Standard Black · 3×6 m'),([23,25],'普通黑金刚 · 其他表列重量','Standard Black · additional listed weights')]:
 g=extra('standard-black-flat-tube-3x3',f,tab,rows,zh,en,{'size':1,'carton':1})
 out=[]
 for r in rows:
  size=cell(f,tab,r,1) or ('3Mx6M' if r==19 else '3Mx3M' if r==25 else '')
  carton=cell(f,tab,r+1,1)
  if r==13:carton=cell(f,tab,15,1)
  if r==19:carton=cell(f,tab,21,1)
  if not re.fullmatch(r'[\d.*xX ]+',carton):carton=''
  for col in range(2,7):
   w=cell(f,tab,r,col)
   if not re.search(r'kg',w,re.I):continue
   grade=cell(f,tab,4,col) or 'Column '+str(col)
   out.append({'model':grade,'size':size,'listedWeight':w,'carton':carton})
 g['rows']=out;g['columns']=[{'key':k,'zh':LABELS[k][0],'en':LABELS[k][1]} for k in ['model','size','listedWeight','carton']]
 g['notesZh']=['各档重量独立列示；原表未标档名处保留列号，不把一个重量套用于全系列。缺失的装箱数和毛重留空。']
 g['notesEn']=['Each weight grade is separate. Unnamed grades retain a source column number. Missing carton quantities and gross weights remain blank.']
 AUDIT[-1]['configurations']=len(out)
f='伟群自动架价格表2023.xls';tab='自动架'
g=extra('series:automatic-steel-frame',f,tab,[4,6,8,10,12,14,16,18],'自动铁架 · 各尺寸重量档','Automatic steel frames · weight grades',{'size':1})
out=[]
for r in [4,6,8,10,12,14,16,18]:
 for col in range(2,9):
  w=cell(f,tab,r,col)
  if re.search('kg',w,re.I):out.append({'size':cell(f,tab,r,1),'listedWeight':w,'carton':cell(f,tab,r+1,1)})
g['rows']=out;g['columns']=[{'key':k,'zh':LABELS[k][0],'en':LABELS[k][1]} for k in ['size','listedWeight','carton']];AUDIT[-1]['configurations']=len(out)
f='伟群大金刚王价格表2023.xls'
for rows,cols,key,zh,en in [
 (range(3,12),[1,5],'series:king-sleeved','大金刚套胶架','King frame with sleeves'),
 (range(15,24),[1,6],'series:king-welded','小金刚焊接架','Small King welded frame')]:
 tab='小金刚方管';g=extra(key,f,tab,rows,zh,en,{'size':1});out=[]
 for r in rows:
  for col in cols:
   raw=cell(f,tab,r,col);m=re.fullmatch(r'\s*(.*?[mM])\s*(?:足)?\s*([\d.]+)\s*[kK][gG]\s*',raw)
   if m:out.append({'model':'Column '+str(col),'size':m[1],'listedWeight':m[2]+' kg'})
 g['rows']=out;g['columns']=[{'key':k,'zh':LABELS[k][0],'en':LABELS[k][1]} for k in ['model','size','listedWeight']];AUDIT[-1]['configurations']=len(out)
extra('series:hercules-frame',f,'小金刚方管',[112,113],'大力神架','Hercules frame',{'size':1,'listedWeight':3})
# These cells mix technical data with prices; transcribe only explicit size /
# weight fragments and never copy the original mixed cell into public data.
g=extra('series:king-additional',f,'小金刚方管',[42,44,45,46,47,48,55,56,75],'金刚架及展台 · 其他表列规格','King frames and counters · additional listed specifications',{'size':1})
g['rows']=[{'size':s,'listedWeight':w} for s,w in [('Model frame','7 kg'),('2840×400×750 mm',''),('2×2 m counter',''),('2.5×2.5 m counter',''),('1.5×1.5 m single-sided counter',''),('3×3 m hollow frame','11 kg'),('6×6 m hexagonal frame','45.5 kg'),('3×3 m hexagonal frame','22 kg'),('1.2×2.4 m','15 kg')]]
AUDIT[-1]['configurations']=len(g['rows'])
tab='⑥大金刚王';g=extra('series:king-heavy-frame',f,tab,[4,6,8,10,12,14,16],'大金刚王 · 40方腿','Heavy King frame · 40 mm square legs',{'size':1});out=[]
for r in [4,6,8,10,12,14,16]:
 for col in range(2,6):
  w=cell(f,tab,r,col)
  if w:out.append({'model':cell(f,tab,3,col)+' / Column '+str(col),'size':cell(f,tab,r,1),'listedWeight':w})
g['rows']=out;g['columns']=[{'key':k,'zh':LABELS[k][0],'en':LABELS[k][1]} for k in ['model','size','listedWeight']];AUDIT[-1]['configurations']=len(out)

# Fabric sheets: area means source fabric consumption, not canopy footprint.
for f,tab,sets,weight_col,fold_col in [
 ('600D帐篷.xls','Sheet1',[( [5,6,7,8,11,14,17,20,23],'600D 热转印顶布','600D sublimated roof'),([33,34,35,36,39,42,45,48],'600D 全围布','600D full walls'),([60,61,62,63,66,69,72,75],'600D 半围布','600D half walls')],5,3),
 ('广西伟群帐篷制造有限公司300DPU防水布热转印.xls','Sheet2',[( [5,6,7,8,11,14,17,20,23],'300D 热转印顶布','300D sublimated roof'),([33,34,35,36,39,42,45,48],'300D 全围布','300D full walls'),([58,59,60,61,64,67,70,73],'300D 半围布','300D half walls')],7,5)]:
 for i,(rows,zh,en) in enumerate(sets):
  extra('series:canopy-fabric',f,tab,rows,zh,en,{'size':2,'weight':weight_col,'folded':fold_col,'roofArea':6 if weight_col==5 else 8},['600D款为260g/m²双PU涂层；300D款为190g/m²单PU涂层。按各表独立选型，不视作所有帐篷的标准配置。用料面积按原表保留，非占地面积；部分围布面积与标称尺寸不能直接相乘核对，需确认裁片。'],['600D: 260 g/m², double PU coating. 300D: 190 g/m², single PU coating. Separate options, not defaults for every canopy. Fabric area is copied from the source, not floor area; confirm cutting layouts where wall areas differ from simple nominal dimensions.'])
f='广西伟群帐篷制造有限公司 素色 TEL 1892278758.xls'
for tab,rows,zh,en in [
 ('素色420D，600DPU顶布价格',range(5,15),'素色 PU 顶布 · 原表400D / 190g','Plain PU roof · source 400D / 190 g'),
 ('素色420D，600DPU顶布价格',range(18,28),'素色 PU 顶布 · 600D','Plain PU roof · 600D'),
 ('素色600D涂PVC橡胶布',range(4,14),'素色 PVC 顶布 · 600D / 300g','Plain PVC roof · 600D / 300 g'),
 ('普通420D。600D。800D涂PVC',range(4,14),'素色 PVC 顶布 · 420/600/800D选项 / 240g','Plain PVC roof · 420/600/800D options / 240 g')]:
 extra('series:canopy-fabric',f,tab,rows,zh,en,{'size':2,'weight':5,'carton':6,'roofArea':3,'fullWall':7,'halfWall':9},['面积为原表用料面积，不是帐篷占地面积；围布尺寸是独立选项，不表示一套附送数量。原表未提供箱规时留空。第一工作表名称写420D，材质格写400D，询价需确认。'],['Area is source fabric consumption, not floor area. Wall sizes are independent options, not included quantities. Missing packing remains blank. The first sheet name says 420D but its material cell says 400D; confirm the intended fabric.'])

# Remaining event tents and component packing.
f='2026年星帐-充气账-圆顶帐报价表1.xls'
extra('series:star-tent-walls',f,'Start tent wall',range(3,13),'星形帐篷围布','Star tent wall panels',{'size':1,'material':2},['原表数量列为报价单位，不当作装箱数。'],['The quantity column is a quotation unit, not a carton quantity.'])
for tab in ['single peak star tent','double peak star tent']:
 g=extra('series:star-tent-stakes',f,tab,[14],'星形帐篷大地钉包装','Star tent large-stake packing',{'note':2})
 add_column(g,'carton',['95×15×15 cm']);add_column(g,'gw',['15'])
extra('series:dome-ad-t80',f,'dome tent',[7,9,11,13,15],'AD-T80 圆顶帐篷','AD-T80 dome tents',{'model':1,'size':4,'tube':5,'material':8,'tableSize':7,'carton':9,'gw':10},['按型号保留原表尺寸。表头20mm与行内22mm管径不一致，管材需复核；不套用于家具类圆顶收纳产品。'],['Sizes are preserved by model. The heading says 20 mm while rows say 22 mm; confirm tube size. These are not the furniture/storage dome products.'])
f='广西伟群帐篷制造有限公司，尖顶帐篷篷房报.xlsx'
for rows,key,zh,en,mat in [(range(3,7),'series:pagoda-steel','铁锥顶篷','Steel pagoda tent','58 mm galvanized posts / rafters; 40×60×1.5 mm beams; 600 g/m² PVC-coated fabric'),(range(9,13),'series:pagoda-aluminum','铝合金锥顶篷','Aluminum pagoda tent','65×65×2 mm posts / beams; 45×45×2 mm rafters; 600 g/m² PVC-coated fabric')]:
 g=extra(key,f,'Sheet1',rows,zh,en,{'size':1});add_column(g,'material',[mat]*len(g['rows']))
extra('series:event-marquee-materials',f,'Sheet1',[15,16,17],'篷房材质选项','Marquee material options',{'material':1})

# Waveline and universal frames keep their own WK-FS / WK-HO model codes.
f='广州市伟群展示器材有限公司快幕秀。拉网.xls'
for rows,key,zh,en in [([6,7,8,9],'series:wk-fs-curved','WK-FS 弧形快幕秀','WK-FS curved waveline'),([11,12],'series:wk-fs-s','WK-FS1 S形快幕秀','WK-FS1 S waveline'),([14,15,16,17],'series:wk-fs-straight','WK-FS2 直形快幕秀','WK-FS2 straight waveline'),(range(19,27),'series:upright-fabric-stands','立牌 · 铝板/铁板底座','Upright fabric stands · aluminum/steel bases'),([27,28],'series:fabric-counters','WK-FS5 前台','WK-FS5 counters')]:
 g=extra(key,f,'快幕秀',rows,zh,en,{'model':2,'size':4,'cartonSource':17,'tubeUsage':16},['硬件尺寸按原表cm标注，按原始顺序保留；原表宽/高顺序需按型号确认。包装原值单位已由负责人确认为毫米，箱规栏逐项除以10换算为厘米；原表空白项仍留空。每套米数不是重量，不填入净重或毛重。WK-FS不等于WK-HZ，不能直接套用旧画册的箱规。'],['Hardware values follow the source cm heading in their original order; confirm width/height orientation by model. The source packing unit was confirmed by the owner as millimetres; each dimension is divided by 10 for the cm carton column. Missing values remain blank. Metres per set are not weight. WK-FS is separate from WK-HZ; old catalog cartons are not substituted.'])
 converted=[]
 for r in g['rows']:
  raw=r['cartonSource']
  if not raw:converted.append('');continue
  if not re.fullmatch(r'\d+(?:\.\d+)?\*\d+(?:\.\d+)?\*\d+(?:\.\d+)?',raw):
   raise ValueError('Unexpected confirmed-mm packing format: '+raw)
  converted.append(' × '.join(format(float(v)/10,'g') for v in raw.split('*')))
 add_column(g,'carton',converted)
 g['source']['packingUnitConfirmation']={'unit':'mm','confirmedBy':'user','date':'2026-10-24','displayUnit':'cm','conversion':'each dimension / 10'}
 for c in g['columns']:
  if c['key']=='carton':c.update(zh='包装尺寸（原表未标单位）',en='Packing dimensions (unit unstated)')
extra('series:wk-ho-universal',f,'万能架',[5,6,7],'WK-HO 万能架','WK-HO universal backwalls',{'model':2,'size':3,'graphic':4,'weight':9,'carton':10},['规格m、画面mm；不与AD-H1型号混用。'],['Size class: m; graphic: mm. Not interchangeable with AD-H1.'])
extra('series:banner-market-stall',f,'摆摊横幅架子',[5,6,7,8],'横幅摆摊架','Banner market stalls',{'model':2,'size':3,'graphic':4,'weight':9,'carton':10},['规格和画面按m列示；不同于1×1m40mm铝合金摆摊架。'],['Sizes and graphics are in m. Separate from the 1×1 m, 40 mm aluminum market stall.'])
extra('43003','伟群展示型材折叠背景灯箱批量价格.xls','卡布拉网灯箱',[21],'WKP 灯箱前台','WKP light-box counter',{'model':1,'size':3},['尺寸mm；WKP规格为1×1格。'],['Dimensions: mm; WKP grid configuration: 1×1.'])

# Accessories: all AD/WK rows, retaining the exact original model prefixes.
f='帐篷配件.xls'
extra('tent:tent_accessories',f,'帐篷配件',range(3,30),'WK 帐篷配件 · 全部表列配置','WK tent accessories · all listed configurations',{'model':1,'size':4,'material':5,'listedWeight':7,'packingDetails':12},['重量/容量按原表保留，不混作空件重量；拖轮包不同尺寸的装箱说明分开保留。'],['Weight/capacity follows the source and is not automatically an empty-item weight. Wheeled-bag packing stays separated by size.'])
for f in ['伟群帐篷有限公司（铁铝40管50管棱型架)不含.xls','伟群帐篷有限公司（毫华铝合金方管40管30管.xls','伟群帐篷有限公司（豪华铁质方管40管30管架).xls']:
 extra('tent:tent_accessories',f,'帐篷配件',range(3,25),'AD 配套件 · '+('六角架表' if '铁铝40管' in f else '方管铝架表' if '毫华铝' in f else '方管铁架表'),'AD accessories · '+('hexagonal frame sheet' if '铁铝40管' in f else 'square aluminum frame sheet' if '毫华铝' in f else 'square steel frame sheet'),{'model':2,'size':4,'listedWeight':5,'packingDetails':8,'gw':9},['相同型号在不同表内按各表配置保留，不将单件数量当作装箱数。'],['Identical model codes in different source sheets remain separate configurations. Component quantities are not carton quantities.'])
# Precisely identified round ballast model, previously missing on its own PDP.
extra('9007','帐篷配件.xls','帐篷配件',[8],'WK-T03A/B/C 配重选项','WK-T03A/B/C ballast options',{'model':1,'size':4,'listedWeight':7,'packingDetails':12},['原表三组尺寸与四档重量没有逐一对应，不自行配对。'],['The source lists three dimensions and four weights without one-to-one mapping; no pairing is inferred.'])

# Complete 2026 flags and all supplementary flag workbook configurations.
f='2026奥动牌沙滩旗杆价格.xlsx'
for key,rows,zh,en in [
 ('95001',[81,82,83,84,85,86,88,91,94,101,117,118,119,121],'街旗、A屏与便携展示旗','Street flags, A-displays and portable flags'),
 ('95012',[66,68,69,70,71,72,73,74,76,77,115,116,120,127],'其他底座、旗头和布料配件','Additional bases, finials and fabric accessories'),
 ('tent:tent_accessories',[122,123,124],'WK-E2/E3/E4 拖轮包','WK-E2/E3/E4 wheeled tent bags')]:
 g=extra(key,f,'Sheet1',rows,zh,en,{'model':9,'size':10,'graphic':13,'carton':14,'packingDetails':15,'material':8,'bore':11},['按原表型号和行内配置分开确认；未标型号处保留空白，不借用其他型号。'],['Confirm the model and row-specific configuration. Missing model codes remain blank rather than borrowing another code.'])
 # C18B has dimensions on row 85 and packing on row 86: keep the continuation
 # within that SAME configuration, not as a second phantom product.
 if key=='95001':
  a=rows.index(85);b=rows.index(86)
  for col in ('carton','packingDetails'):g['rows'][a][col]=g['rows'][b][col]
  del g['rows'][b];AUDIT[-1]['configurations']=len(g['rows'])
f='广州市伟群展示器材有限公司 沙滩旗杆配件.xlsx';tab='1.0厚杆'
for key,rows,zh,en in [
 ('95003',range(3,11),'补充表 · 铝管玻纤杆','Supplement · aluminum/fiberglass poles'),
 ('95002',range(11,15),'补充表 · 二用玻纤杆','Supplement · dual-shape fiberglass poles'),
 ('95005',[19,21,23],'WK-A 旧款刀旗','WK-A legacy feather poles'),
 ('95004',[20,22,24],'WK-D 旧款水滴旗','WK-D legacy teardrop poles'),
 ('95007',[26,27,28],'WK-F 全玻纤方旗','WK-F fiberglass rectangle poles'),
 ('95001',[56,57,58,59,60,61,62,65,68,71,78,97,98,100],'补充表 · 背包与展示旗','Supplement · backpacks and display flags'),
 ('95012',[15,16,17,18,25,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,53,54,55,77,86,87,88,89,90,91,92,93,94,95,96,101,102,103],'补充表 · 底座与配件','Supplement · bases and accessories'),
 ('95009',[104,105,106],'WK-33 全铝方旗','WK-33 aluminum rectangle poles'),
 ('95008',[107,108,109],'WK-36 全铝半圆旗','WK-36 aluminum semicircle poles'),
 ('95010',[110,111,112],'WK-39 全铝刀旗','WK-39 aluminum feather poles'),
 ('95006',[113,114,115],'注水旗杆 · 杆与水座分装','Water-base flagpoles · separately packed pole/base'),
 ('95012',[116],'WK-40 伸缩落地旗杆','WK-40 telescopic floor flagpole')]:
 g=extra(key,f,tab,rows,zh,en,{'model':9,'height':3,'pole':10,'graphic':13,'carton':14,'packingDetails':15,'bore':11,'material':8},['此为另一份原表的独立配置；同型号包装或重量不同，不覆盖2026主表，也不混合推算。'],['Separate supplementary-sheet configurations. Where packing or weight differs from the 2026 main sheet, neither value overwrites the other or is combined into a derived figure.'])
 # Empty code/height on continuation rows may only inherit within a paired
 # flagpole block, not across unrelated accessories.
 if key=='95003':
  for i in range(1,len(g['rows']),2):
   for field in ['model','height']:g['rows'][i][field]=g['rows'][i-1][field]
 for r,row in zip(rows,g['rows']):
  if r in (45,46):row['carton']=row['bore'];row['bore']=''

# Furniture rows not matching an existing SKU remain available in the library.
f='桌子+椅子价格表.xls'
extra('series:furniture-additional',f,'桌子',[57,60,66,67],'其他家具与收纳配置','Additional furniture and storage configurations',{'model':1,'size':5,'material':7,'weight':11,'carton':21,'container':19})
# The two table-cover workbooks both contain technical data, including differing
# source fabric notes. Preserve them separately instead of silently choosing one.
for f in ['广西伟群制造有限公司家具折叠桌布价格表.xlsx','桌子+椅子价格表.xls']:
 for rows,zh,en in [(range(5,9),'造型弹力桌布','Sculpted stretch covers'),(range(10,14),'罩型弹力桌布','Fitted stretch covers'),(range(15,19),'方型桌布','Rectangular covers')]:
  # First workbook already has those exact rows; only fill its packing column.
  existing=[g for g in DATA.get('31101',[]) if g['source']['file']==f and g['source'].get('rows')==list(rows)]
  if existing:
   add_column(existing[0],'carton',[cell(f,'桌布',r,23) for r in rows])
   add_column(existing[0],'roofArea',[cell(f,'桌布',r,13) for r in rows])
  else:
   extra('31101',f,'桌布',rows,zh+' · 家具表',en+' · furniture sheet',{'model':1,'size':5,'weight':11,'carton':23,'roofArea':13},['4/5/6/8尺桌型分别匹配；按本表布料说明确认，不混用不同表的克重。'],['Match the 4/5/6/8 ft table format and confirm this sheet’s fabric; do not mix fabric weights across sources.'])
 for rows,zh,en in [([20],'椅子布','Chair covers'),([22,23],'吧桌布','Cocktail table covers'),([25,26,27],'圆桌布','Round table covers')]:
  extra('31101',f,'桌布',rows,zh+' · '+('桌布表' if f.endswith('.xlsx') else '家具表'),en+' · '+('cover sheet' if f.endswith('.xlsx') else 'furniture sheet'),{'model':1,'size':5,'weight':11,'carton':23,'roofArea':13})

# Incomplete or contradictory rows: retain all independent, usable fields and
# leave ONLY the disputed field empty. Never invent a corrected dimension.
f='伟群展示型材折叠背景灯箱批量价格.xls'
for key,tab,rows,zh,en in [('43003','卡布拉网灯箱',[6,15],'灯箱尺寸待确认配置','Light-box configurations requiring size confirmation'),('43002','型材灯箱',[5],'型材灯箱尺寸待确认配置','Profile light-box size requiring confirmation')]:
 g=extra(key,f,tab,rows,zh,en,{'model':2})
 add_column(g,'size',['']*len(g['rows']))
 g['notesZh']=['原表规格与尺寸存在冲突，尺寸格留空；型号保留供询价核对，未擅自修正。']
 g['notesEn']=['The source size code conflicts with its dimensions. The dimension cell is blank; the model is retained for confirmation, without guessing a correction.']
f='广西伟群帐篷闭气拱门价格表241205.xlsx'
g=extra('tent:inflatable-arch',f,'Sheet1',[13],'400D 拱门 · 10 m 待确认管径','400D arch · 10 m diameter to confirm',{'width':3,'height':4,'carton':8,'gw':9})
g['notesZh']=['宽10000mm、高4800mm；原表尺寸栏管径900mm，独立管径栏800mm，管径留空待确认。']
g['notesEn']=['Width 10000 mm, height 4800 mm. Source diameter fields conflict (900 vs 800 mm), so no diameter is assigned.']

# The remaining two DOCX screenshots were visually checked separately. They
# have no workbook row coordinates, so keep image and transcription provenance.
def screenshot_group(key,title_zh,title_en,image,rows,cols,notes_zh,notes_en):
 g={'titleZh':title_zh,'titleEn':title_en,
    'columns':[{'key':k,'zh':LABELS[k][0],'en':LABELS[k][1]} for k in cols],
    'rows':rows,'notesZh':notes_zh,'notesEn':notes_en,
    'source':{'file':'补充价格表或者尺寸的截图.docx','image':'word/media/'+image,
              'transcription':'Visually checked technical columns only; price columns excluded'}}
 DATA.setdefault(str(key),[]).append(g)
 AUDIT.append({'target':str(key),**g['source'],'configurations':len(rows)})
screenshot_group('series:canopy-fabric','420D PVC 顶布 · 补充截图230g','420D PVC roof · 230 g screenshot option','image1.png',[
 {'size':s,'weight':w,'roofArea':a,'fullWall':wall,'halfWall':wall} for s,w,a,wall in [
 ('1.5×1.5 m','2.1','9','1.5 m'),('2×2 m','2.7','12','2 m'),('2×3 m','3.2','15','2.5 m'),
 ('2.5×2.5 m','3.5','15','3 m'),('3×3 m','4.2','18','4 m'),('3×4.5 m','6','27','4.5 m'),
 ('3×6 m','7.8','36','6 m'),('4×4 m','7','32','8 m'),('4×6 m','10','48',''),('4×8 m','13.8','64','')]],
 ['size','weight','roofArea','fullWall','halfWall'],['截图明确为420D PVC、230g/m²；与PU或其他克重PVC分开列示。围布为独立选项；用料面积非占地面积。'],['Screenshot explicitly lists 420D PVC, 230 g/m². Separate from PU and other PVC fabric weights. Wall sizes are independent options; fabric area is not floor area.'])
screenshot_group('9403','玻纤半圆竞速门 · 补充截图','Fiberglass semicircle race gates · screenshot','image3.jpeg',[
 {'size':'L2.6×H1.3 m','pole':'4.8 m total; 8 telescopic sections; OD9.5 / ID4 mm','carton':'68×25×15 cm','packing':'10','gw':'8.2'},
 {'size':'L3.1×H1.9 m','pole':'6 m total; 10 telescopic sections; OD9.5 / ID4 mm','carton':'118×25×22 cm','packing':'10','gw':'20'}],
 ['size','pole','carton','packing','gw'],['单面110g经编布，全玻纤杆；配铁地钉、布包、水座，套装配件以订单确认。'],['Single-sided 110 g warp-knit fabric and fiberglass rods. Stakes, bag and water-base configuration to be confirmed with the order.'])
screenshot_group('9401','玻纤V型竞速门 · 补充截图','Fiberglass V race gates · screenshot','image3.jpeg',[
 {'size':'L2.6×H1.4 m','pole':'4.18 m total; OD9.5 / ID4 mm; external short-pole connectors','carton':'68×25×15 cm','packing':'2','gw':'6.4'},
 {'size':'L3.1×H1.9 m','pole':'5.34 m total; 8 telescopic sections; OD9.5 / ID4 mm; 2 short poles','carton':'68×25×15 cm','packing':'2','gw':'6.4'}],
 ['size','pole','carton','packing','gw'],['原截图包装格跨两款合并，按共用表列包装保留；双层印刷穿旗门布料，需确认订单选款。'],['The screenshot merges its packing cell across both sizes; shared listed packing is retained. Double-layer printed gate fabric; confirm selected size with the order.'])
screenshot_group('9402','玻纤圆形竞速门 · 补充截图','Fiberglass circular race gate · screenshot','image3.jpeg',[
 {'size':'Diameter 2 m; graphic width 30 cm','pole':'OD9.5 / ID4 mm'}],
 ['size','pole','carton','packing','gw'],['截图列圆款带拱脚空画面、纤维杆、底座、牛津包；未列箱规与重量，留空。'],['The source lists the circular gate, fiberglass rod, base and Oxford bag. No carton or weight is stated; these cells remain blank.'])

# Standard packing fields are visible even when the source has no value.
# Unknown data is represented by an empty string, never zero or a guessed dash.
for key,groups in DATA.items():
 for g in groups:
  for c in g['columns']:
   if c['key']=='packing' and c['zh'].startswith('装箱与重量'):
    c['key']='packingDetails'
    for r in g['rows']:r['packingDetails']=r.pop('packing','')
    if 'packing' in g['source'].get('columns',{}):g['source']['columns']['packingDetails']=g['source']['columns'].pop('packing')
  g['source']['review']='2026-10-24 complete technical-column review'
  for col in ['carton','packing','gw']:
   if col not in [c['key'] for c in g['columns']]:add_column(g,col,['']*len(g['rows']))
  for r in g['rows']:
   for c in g['columns']:r.setdefault(c['key'],'')
   # Extract independently labelled carton quantity and carton gross weight
   # only when there is one unambiguous packing configuration in that cell.
   raw=r.get('packingDetails','') or r.get('carton','')
   quantities=re.findall(r'(\d+)\s*(?:PCS?\b|sets?\b|个|套)',raw,re.I)
   if re.search(r'\d+(?:-\d+)+\s*(?:PCS?|sets?|个|套)',raw,re.I):quantities=['multiple','variants']
   if len(quantities)==1:r['packing']=quantities[0]
   gross=re.findall(r'(?:G\.?\s*W\.?\s*[:：]?|毛重\s*(?:约)?\s*[:：]?)\s*([\d.]+)\s*KG',raw,re.I)
   if len(gross)==1 and len(quantities)<=1:r['gw']=gross[0]
   elif len(quantities)==1:
    # In a source column explicitly labelled 毛重, the first kg value is the
    # carton total; a following /set value remains only in the source detail.
    carton_weights=[]
    for match in re.finditer(r'([\d.]+)\s*KG',raw,re.I):
     suffix=raw[match.end():]
     prefix=raw[max(0,match.start()-8):match.start()]
     if re.match(r'\s*/\s*(?:套|个|sets?\b|pcs?\b)',suffix,re.I):continue
     if re.search(r'(?:单重|unit weight)\s*[:：]?\s*$',prefix,re.I):continue
     carton_weights.append(match[1])
    if len(carton_weights)==1:r['gw']=carton_weights[0]
  # Mixed source packing strings must not be presented as precise carton cm.
  for c in g['columns']:
   if c['key']=='carton' and any(re.search(r'(?:pcs?|ctn|kg|毛重|包装)',r.get('carton',''),re.I) for r in g['rows']):
    c.update(zh='箱规 / 装箱说明（原表）',en='Carton / packing details (source)')

# Flag numerical contradictions in the source instead of publishing a carton
# gross weight that is materially below the stated contents' own weight.
# This is a review flag only: never calculate a replacement gross weight.
packing_conflicts=[]
for key,groups in DATA.items():
 for g in groups:
  for index,r in enumerate(g['rows']):
   if not re.fullmatch(r'\d+',r.get('packing','')) or not re.fullmatch(r'\d+(?:\.\d+)?',r.get('gw','')):continue
   material=r.get('material','')
   weight=re.search(r'(?:^|\n)\s*重量\s*[:：]?\s*(\d+(?:\.\d+)?)\s*KG',material,re.I)
   if not weight:continue
   net=float(weight[1]);qty=int(r['packing']);gross=float(r['gw'])
   if net*qty <= gross*1.05+0.1:continue
   row_numbers=g['source'].get('rows',[])
   source_row=row_numbers[index] if len(row_numbers)==len(g['rows']) else None
   packing_conflicts.append({'target':key,'model':r.get('model',''),'source':g['source'],'sourceRow':source_row,'unitWeightKg':net,'cartonQuantity':qty,'sourceGrossWeightKg':gross,'action':'Gross field left blank; original source detail retained; confirmation required.'})
   ref=r.get('model') or ('第'+str(source_row)+'行')
   g['notesZh'].append(f'{ref}：原表单件重量{net:g}kg × {qty}件与毛重{gross:g}kg存在矛盾，整箱毛重栏留空待确认；不以乘积代替实际毛重。')
   ref_en=r.get('model') or ('source row '+str(source_row))
   g['notesEn'].append(f'{ref_en}: source unit weight {net:g} kg × {qty} items conflicts with carton gross weight {gross:g} kg. Gross field left blank pending confirmation; no calculated replacement is assigned.')
   r['gw']=''
(ROOT/'reports/specifications-packing-conflicts.json').write_text(json.dumps(packing_conflicts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Inventory proves every workbook was read and has technical fields accounted
# for; empty tabs do not become phantom product rows.
inventory=[]
for (file,tab),rows in SHEETS.items():
 matches=[{'target':key,'title':g['titleZh'],'rows':g['source'].get('rows',[]),'configurations':len(g['rows'])} for key,gs in DATA.items() for g in gs if g['source']['file']==file and g['source'].get('sheet')==tab]
 inventory.append({'file':file,'sheet':tab,'nonemptyRows':len(rows),'groups':matches,'status':'technical data published' if matches else 'empty sheet' if not rows else 'reviewed: see workbook technical groups; no separate product specifications'})
(ROOT/'reports/specifications-2026-coverage.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def finalize_translations():
 # Literal technical translation only, no external service, inference or
 # changes to original Chinese values. Keep the exact numbers and model codes.
 terms={
 '每卷布的长度不一样，重量也是不一样的， 重量仅为参考':'Roll lengths and weights vary; reference weight only',
 '常规套柱':'Standard sleeve ', '可自订其它直径大小':'other diameters by confirmation',
 '转动轴另外包装':'Spindle packed separately', '不含独立包装':'Without individual box',
 '独立包装':'Individual box', '每套泡泡袋装':'Bubble bag per set', '每套OPP袋装':'OPP bag per set',
 '米的包装是':' m packing: ', '米的 包装是':' m packing: ',
 '杆内孔可配':'Pole bore fits ', '杆内孔需配':'Pole bore requires ', '直径转轴':' diameter spindle',
 '装好画面总高度':'Height with graphic ', '最长杆':'Longest pole ', '每支杆长':'Each pole length ',
 '由底座+管卡+旗杆+顶盖+画面组成':'Base + tube clip + pole + top cap + graphic',
 '涤纶加TPU夹网布防水料':'Polyester with TPU mesh waterproof fabric',
 '纬编弹力布':'Weft-knit stretch fabric', '经编布':'Warp-knit fabric',
 '不锈钢丝':'Stainless steel wire', '不绣钢丝':'Stainless steel wire', '尼龙网布':'Nylon mesh',
 '方型美式全铝旗杆':'US-style aluminum rectangle pole',
 '半圆美式全铝旗杆':'US-style aluminum semicircle pole',
 '刀型美式全铝旗杆':'US-style aluminum feather pole',
 '简约P型背包':'Simple P-shaped backpack', '豪华背包手提包':'Deluxe backpack carry bag',
 '豪华背包':'Deluxe backpack', '豪华方形':'Deluxe rectangle',
 '水袋单重':'Empty water-bag weight', '杆伸高度':'Extended pole height ',
 '展开长度':'Expanded length ', '展开尺寸':'Expanded size ', '组合尺寸':'Combined size ',
 '旗杆尺寸':'Pole size ', '旗帜尺寸':'Flag size ', '管直径':'Tube diameter ',
 '底盘直径':'Base diameter ', '外径':'Outer diameter ', '内径':'Bore ',
 '总高度':'Overall height ', '支玻纤杆':' fiberglass rods ', '支铝杆':' aluminum rods ',
 '节直杆':' straight sections ', '节横杆':' horizontal section ', '两节伸缩':'Two-section telescopic ',
 '镀铬圆铁':'Chrome-plated round steel', '镀铬铁':'Chrome-plated steel',
 '铁镀络':'Chrome-plated steel', '喷塑铁':'Powder-coated steel', '涂层铁':'Coated steel',
 '静电喷涂':'Powder coating', '电喷涂':'Powder coating', '表面处理':'Surface finish',
 '铁喷漆':'Painted steel', '全铝合金':'All aluminum', '半铝半铁':'Aluminum / steel',
 '全铁':'All steel', '铝合金':'Aluminum', '不绣钢':'Stainless steel', '不锈钢':'Stainless steel',
 '玻纤杆':'Fiberglass rod', '塑料':'Plastic', '金属底座':'Metal base', '涤纶布':'Polyester',
 '涤纶':'Polyester', '聚乙烯':'Polyethylene', '牛津布':'Oxford fabric', '牛津包':'Oxford bag',
 '过PU涂层':'PU-coated', '防水':'Water-resistant (source description)',
 '抗UV':'UV-resistant (source description)', '每套':'Per set ',
 '小型号':'Small', '大型号':'Large', '小号':'Small', '大号':'Large', '中号':'Medium',
 '圆款':'Round', '圆型':'Round', '方形':'Rectangle', '方型':'Rectangle',
 '刀型':'Feather', '滴水型':'Teardrop', '滴水':'Teardrop', '三片':'Three panels', '二片':'Two panels',
 '大扁管':'Large flat tube', '大方管':'Large square tube', '圆管':'Round tube', '方管':'Square tube',
 '厚度':'Thickness ', '厚管':' mm wall tube', '壁厚':'Wall ',
 '毛重约':'G.W. approx. ', '毛重':'G.W. ', '单重':'Unit weight ', '重量':'Weight ',
 '克重':'Fabric weight ', '材质':'Material ', '材料':'Material ', '容量':'Capacity ',
 '开口长':'Expanded length ', '长度':'Length ', '宽度':'Width ', '高度':'Height ',
 '包装':'Packing ', '箱规':'Carton ', '水座':'Water base ', '底座':'Base ',
 '旗杆':'Flagpole ', '转轴':'Spindle ', '画面':'Graphic ', '缩回':'Retracted ',
 '可配':'Compatible with ', '用于':'For ', '和':' and ',
 '白色':'White ', '黑色':'Black ', '灰白色':'Off-white ', '颜色':'Color ',
 '吹塑成型':'Blow molded ', '灰':'Gray ', '黑':'Black ', '黄色':'Yellow ', '银色':'Silver ',
 '前台':'Counter', '喷涂':'Coating', '铁':'Steel', '锌':'Zinc', '静':'Coating ',
 '厘米':' cm', '公斤':' kg', '套一箱':' sets/carton ', '个一箱':' pcs/carton ',
 '套/箱':' sets/carton ', '个/箱':' pcs/carton ', 'PCS/箱':' pcs/carton ',
 '套':' set ', '个':' pc ', '箱':'carton', '尺':' ft', '米':' m', '节':' sections ',
 '高':' high', '长':' long', '足':'', '配':' with ', '豆型':'Bean-shaped ',
 '直径':'Diameter ', '杆':'Pole ', '管':' tube ', '厚':' wall ',
 'P型':'P-shaped', 'X型':'X-shaped', '背包':'Backpack ', '异型':'Shaped ',
 '镀铬':'Chrome plated ', '度':' degrees ', '或':' or ', '独立':'Separate ',
 '可选择颜色':'Colors by selection', '高级碱砂':'Alkali sand finish', '高级喷塑':'Powder coating',
 '奶白色':'Cream white', '米白色':'Off-white', '红':'Red', '黄':'Yellow', '蓝':'Blue', '绿':'Green', '白':'White',
 }
 terms=sorted(terms.items(),key=lambda x:len(x[0]),reverse=True)
 leftovers=set()
 for groups in DATA.values():
  for g in groups:
   for r in g['rows']:
    translated={}
    for key,value in r.items():
     v=value
     for source,target in terms:v=v.replace(source,target)
     v=v.replace('：',': ').replace('，',', ').replace('。','; ').replace('）',')').replace('（','(')
     translated[key]=v
     if re.search('[\u4e00-\u9fff]',v):leftovers.add(v)
    r['en']=translated
 if leftovers:raise ValueError('Untranslated technical text: '+repr(sorted(leftovers)))
