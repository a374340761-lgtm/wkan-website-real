"""Read-only recheck of technical numeric cells against user source workbooks.

No price columns are loaded into the report. Composite, transcribed and
one-to-many rows are listed separately rather than claiming cell equivalence.
"""
import hashlib,json,re,sys
from pathlib import Path
import xlrd,openpyxl

ROOT=Path(__file__).resolve().parent.parent
source=Path(sys.argv[1])
data=json.loads((ROOT/'data/product-specifications-2026.json').read_text(encoding='utf8'))['products']
books={};hashes={}
for p in source.iterdir():
 if p.suffix.lower() not in ('.xlsx','.xls'):continue
 hashes[p.name]=hashlib.sha256(p.read_bytes()).hexdigest()
 if p.suffix.lower()=='.xls':
  b=xlrd.open_workbook(str(p));books[p.name]={s.name:[s.row_values(r) for r in range(s.nrows)] for s in b.sheets()}
 else:
  b=openpyxl.load_workbook(p,read_only=True,data_only=True);books[p.name]={s.title:list(s.values) for s in b}
def cell(f,s,r,c):
 rows=books[f][s]
 return '' if r>len(rows) or c>len(rows[r-1]) or rows[r-1][c-1] is None else str(rows[r-1][c-1]).strip()
def numbers(v):return [float(n) for n in re.findall(r'\d+(?:\.\d+)?',v)]
checked=0;changes=[];separate=[]
for key,groups in data.items():
 for g in groups:
  s=g['source'];rs=s.get('rows',[]);cols=s.get('columns',{})
  if not cols or len(rs)!=len(g['rows']):
   separate.append({'target':key,'title':g['titleZh'],'reason':'Transcribed/composite or one-to-many rows; checked by dedicated assertions.'});continue
  for r,entry in zip(rs,g['rows']):
   for field,c in cols.items():
    if field not in entry:continue
    override=s.get('rowOverrides',{}).get(str(r),{}).get(field,{})
    c=override.get('column',c)
    raw=cell(s['file'],s['sheet'],r,c);actual=entry[field]
    if re.search(r'￥|¥|元|单价|售价|不含税|含税',raw):
     separate.append({'target':key,'row':r,'column':c,'field':field,'reason':'Mixed technical/price cell: separate manual transcription; raw value excluded.'});continue
    if override.get('transform')=='metres':
     m=re.search(r'(\d+(?:\.\d+)?)\s*m',raw,re.I);raw=m[1] if m else ''
    if not raw or not actual:continue # Blank/conflicting fields are not inferred.
    checked+=1
    if field=='model' and re.sub(r'\s','',actual).lower().startswith(re.sub(r'\s','',raw).lower()):continue
    if numbers(raw)!=numbers(actual):changes.append({'target':key,'title':g['titleZh'],'file':s['file'],'sheet':s['sheet'],'row':r,'column':c,'field':field,'sourceValue':raw,'publishedValue':actual})
report={'workbooks':len(books),'checkedNonemptyCells':checked,'numericDifferences':changes,'separateChecks':separate,'sourceHashes':hashes,'note':'Checks numeric transcription for explicit mapped fields, not semantic correctness, units, completeness or price values.'}
(ROOT/'reports/specification-source-cell-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'workbooks':len(books),'checkedNonemptyCells':checked,'numericDifferences':changes},ensure_ascii=False,indent=2))
if changes:sys.exit(1)
