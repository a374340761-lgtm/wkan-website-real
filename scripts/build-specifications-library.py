"""Build crawlable bilingual technical/packing pages from price-free data."""
import html
import json
import re
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
CHECK='--check' in sys.argv
DATA=json.loads((ROOT/'data/product-specifications-2026.json').read_text(encoding='utf-8'))
ORIGIN='https://www.waikwantent.com'
esc=lambda s:html.escape('\n'.join(line.rstrip() for line in str(s).split('\n')),quote=True)

def save(path,text):
 p=ROOT/path
 if CHECK:
  if not p.exists() or p.read_text(encoding='utf-8').replace('\r\n','\n')!=text.replace('\r\n','\n'):raise SystemExit('Out of date: '+path)
 else:p.write_text(text,encoding='utf-8')

for zh in [False,True]:
 prefix='/zh/' if zh else '/'
 template=(ROOT/('zh/export-loading.html' if zh else 'export-loading.html')).read_text(encoding='utf-8')
 head=template.split('<main>')[0].replace('export-loading.html','specifications-packing.html')
 head=re.sub(r'<script type="application/ld\+json"[^>]*>.*?</script>','',head,flags=re.S)
 title='产品规格与装箱资料｜帐篷、旗杆、展示架｜伟群' if zh else 'Product Specifications & Packing | Tents, Flags & Displays | WaiKwan'
 desc='按型号和配置查看产品尺寸、材质、重量、装箱数、箱规与装柜量。缺失数据留空，支架、篷布及不同包装分别列示。' if zh else 'Compare model-specific dimensions, materials, weights, carton quantities, packing sizes and container loads. Missing source data stays blank; frame and fabric configurations remain separate.'
 head=re.sub(r'<title>.*?</title>','<title>'+esc(title)+'</title>',head,flags=re.S)
 for attr,key,value in [('name','description',desc),('property','og:title',title),('property','og:description',desc),('name','twitter:title',title),('name','twitter:description',desc)]:
  head=re.sub(r'(<meta '+attr+'="'+re.escape(key)+'" content=")[^"]*',lambda m:m[1]+esc(value),head)
 head=head.replace('/styles/export-loading.css?v=20261020','/styles/specifications-packing.css?v=20261024')
 schema={'@context':'https://schema.org','@type':'CollectionPage','name':title,'description':desc,'url':ORIGIN+prefix+'specifications-packing.html','inLanguage':'zh-CN' if zh else 'en','about':{'@id':ORIGIN+'/#organization'}}
 head=head.replace('</head>','<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>\n</head>')
 h1='产品规格与装箱资料' if zh else 'Product specifications & packing'
 intro='按具体型号、材质和配置选用；包装、重量及配套以确认订单为准。空白表示原表未提供或该字段待确认，不代表0，也不代表不需要包装。' if zh else 'Choose the exact model, construction and configuration. Confirm packing, weights and accessories with the order. Blank cells mean information is unavailable or needs confirmation, not zero or no packaging.'
 body=f'<main><article class="wk-section specifications-library"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="{prefix}index.html">'+('首页' if zh else 'Home')+f'</a><span>/</span><a href="{prefix}all-products.html">'+('产品目录' if zh else 'Product catalog')+f'</a><span>/</span><span>{h1}</span></nav><header><h1>{h1}</h1><p>{intro}</p></header>'
 body+='<div class="spec-library-controls"><label for="specLibrarySearch">'+('搜索型号、尺寸或产品系列' if zh else 'Search model, size or product family')+'</label><input id="specLibrarySearch" type="search" placeholder="WK-T40D / 3×6 / 600D" autocomplete="off"><p id="specLibraryCount" role="status" aria-live="polite"></p></div>'
 body+='<p class="spec-library-note">'+('同号型号在不同材质、来源或包装中可能不同，以下分别保留。净重、容量、单件重量和整箱毛重不能互相替代；未统一标单位的包装值保持原表口径。' if zh else 'Identical codes can refer to different constructions or packing arrangements; these remain separate below. Net weight, capacity, per-item weight and carton gross weight are distinct. Unstated packing units are not inferred.')+'</p>'
 for key,groups in DATA['products'].items():
  body+=f'<section class="spec-library-family" id="spec-{esc(key)}">'
  for i,g in enumerate(groups):
   name=g['titleZh'] if zh else g['titleEn']
   label=('配置 ' if zh else 'Configuration ')+str(i+1)
   if 'image' in g['source']:label='补充截图' if zh else 'Supplementary photograph'
   body+=f'<details class="spec-library-group" id="spec-group-{esc(key)}-{i}"><summary><span>{esc(name)}</span><small>{esc(label or "")} · {len(g["rows"])} '+('项' if zh else 'rows')+'</small></summary><div class="spec-library-content">'
   body+='<p class="spec-library-note">'+('左右滑动查看所有参数。' if zh else 'Scroll the table horizontally to see every field.')+'</p>'
   body+=f'<div class="spec-library-table" role="region" aria-label="{esc(name)}" tabindex="0"><table><thead><tr>'+''.join('<th scope="col">'+esc(c['zh'] if zh else c['en'])+'</th>' for c in g['columns'])+'</tr></thead><tbody>'
   for row in g['rows']:
    values=row if zh else row.get('en',row)
    body+='<tr>'+''.join('<td>'+esc(values.get(c['key'],'') or '')+'</td>' for c in g['columns'])+'</tr>'
   body+='</tbody></table></div>'+''.join('<p class="spec-library-note">'+esc(n)+'</p>' for n in g['notesZh' if zh else 'notesEn'])
   route=''
   if key.startswith('tent:'):route='tent-type.html?type='+key.split(':',1)[1]
   elif not key.startswith('series:'):route='product-detail.html?sku='+key
   if route:body+=f'<a class="wk-resource-link" href="{prefix}{route}">'+('查看对应产品 →' if zh else 'View corresponding product →')+'</a>'
   body+='</div></details>'
  body+='</section>'
 body+=f'<section class="spec-library-help"><h2>'+('确认出货配置' if zh else 'Confirm your shipment configuration')+'</h2><p>'+('请提供型号、尺寸、材质、数量、布料与配件要求；包装方案确认后再核算运输体积与总重量。' if zh else 'Send the model, size, construction, quantity, fabric and accessories required. Confirm the packing arrangement before calculating shipment volume and total weight.')+f'</p><a class="btn btn-primary" href="{prefix}contact-us.html#getQuoteForm">'+('询问产品与包装' if zh else 'Ask about products & packing')+'</a></section></div></article>'
 home=(ROOT/('zh/index.html' if zh else 'index.html')).read_text(encoding='utf-8')
 footer=re.search(r'<section class="contact-bottom">.*?</section>',home,re.S).group(0)
 tail=template.split('</main>',1)[1]
 tail=tail.replace('</body>','<script src="/scripts/specifications-library.js?v=20261024"></script></body>')
 save(('zh/' if zh else '')+'specifications-packing.html',head+body+footer+'</main>'+tail)
for language in ['', 'zh/']:
 for name in ['all-products.html','product-center.html']:
  path=language+name
  text=(ROOT/path).read_text(encoding='utf-8')
  href='/'+language+'specifications-packing.html'
  label='查看产品规格与装箱资料 →' if language else 'Browse specifications & packing →'
  link=f'<p class="spec-library-entry"><a class="wk-resource-link" href="{href}">{label}</a></p>'
  if 'class="spec-library-entry"' not in text:
   text=re.sub(r'(</h1>)',lambda m:m[1]+link,text,count=1)
  save(path,text)
print('OK: bilingual specification library is current.' if CHECK else 'Generated bilingual specification and packing library and catalog entry links.')
