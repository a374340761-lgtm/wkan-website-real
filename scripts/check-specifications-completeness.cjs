// All Google/third-party requests are blocked; no business data is submitted.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const data=JSON.parse(fs.readFileSync('data/product-specifications-2026.json','utf8'));
const inventory=JSON.parse(fs.readFileSync('reports/specifications-2026-coverage.json','utf8'));
const groups=Object.values(data.products).flat(),rows=groups.flatMap(g=>g.rows);
assert.equal(new Set(inventory.map(x=>x.file)).size,21);
assert(inventory.every(x=>!x.nonemptyRows||x.groups.length),'Nonempty source sheet lacks technical coverage');
assert(rows.length>239);
for(const g of groups){
 const keys=g.columns.map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
 for(const field of ['carton','packing','gw'])assert(keys.includes(field));
 for(const r of g.rows)for(const key of keys){
  assert.equal(typeof r[key],'string');assert.equal(typeof r.en[key],'string');
  assert(!/[\u4e00-\u9fff]/.test(r.en[key]));
  assert(!/￥|¥|单价|售价|不含税|含税|元\//.test(r[key]),'Price/terms leaked into public technical data');
 }
}
const frame=data.products['2002'][0].rows.find(r=>r.model==='WK-T40D');
assert.equal(frame.weight,'29.3');assert.equal(frame.packing,'1');assert.equal(frame.container,'145/370PCS');
const flag=data.products['95003'][0].rows[0];assert.equal(flag.packing,'50');assert.equal(flag.gw,'17.5');
assert(data.products['95001'].some(g=>g.rows.some(r=>r.carton.includes('67*46*56'))));
const aDisplay=data.products['95001'].flatMap(g=>g.rows).find(r=>r.size==='100*200cm'&&r.packingDetails.includes('豆型'));
assert.equal(aDisplay.packing,'6');assert.equal(aDisplay.gw,'21.4');
const conflicts=JSON.parse(fs.readFileSync('reports/specifications-packing-conflicts.json','utf8'));
assert.equal(conflicts.length,3);
const plateGroup=data.products['95012'].find(g=>g.source.file==='2026奥动牌沙滩旗杆价格.xlsx'&&g.source.rows.includes(68));
for(const rowNumber of [68,70,72])assert.equal(plateGroup.rows[plateGroup.source.rows.indexOf(rowNumber)].gw,'');
assert(data.products['9403'].some(g=>g.rows.some(r=>r.gw==='8.2'&&r.packing==='10')));
assert(data.products['43003'].some(g=>g.rows.some(r=>r.model==='1X4'&&r.size==='')));
assert(data.products['series:canopy-fabric'].some(g=>g.rows.some(r=>r.weight===''&&r.size==='3*3')));
const waveline=data.products['series:wk-fs-straight'][0];
assert.equal(waveline.rows[0].cartonSource,'800*380*230');
assert.equal(waveline.rows[0].tubeUsage,'21');
assert.equal(waveline.rows[0].carton,'80 × 38 × 23');
assert.equal(waveline.rows.find(r=>r.model==='WK-FS2-L').carton,'80 × 28 × 20');
assert.equal(waveline.rows[0].gw,'');
assert.equal(waveline.rows.find(r=>r.model==='WK-FS2-L1').cartonSource,'');
assert.equal(waveline.rows.find(r=>r.model==='WK-FS2-L1').carton,'');
for(const key of ['series:wk-fs-curved','series:wk-fs-s','series:wk-fs-straight']){
 for(const row of data.products[key][0].rows){
  if(row.cartonSource)assert.deepEqual(row.carton.split(' × ').map(Number),row.cartonSource.split('*').map(v=>Number(v)/10));
  else assert.equal(row.carton,'');
 }
}
(async()=>{
 const root=process.cwd();const server=http.createServer((q,r)=>{let f=path.resolve(root,'.'+decodeURIComponent(new URL(q.url,'http://x').pathname));if(!f.startsWith(root+path.sep))return r.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f))return r.writeHead(404).end();r.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,b=await chromium.launch({channel:'msedge',headless:true});let checks=[];
 try{for(const width of [390,1440])for(const zh of [false,true]){
  const p=await b.newPage({viewport:{width,height:1000}});let errors=[];
  await p.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)errors.push(r.status()+' '+r.url())});
  const prefix=zh?'zh/':'';
  await p.goto(origin+'/'+prefix+'specifications-packing.html#spec-2002',{waitUntil:'networkidle'});
  assert.equal(await p.locator('h1').count(),1);assert.equal(await p.locator('.spec-library-group').count(),groups.length);
  assert.equal(await p.locator('tbody tr').count(),rows.length);assert(await p.locator('tbody td:empty').count()>0);
  assert.equal(await p.locator('#spec-2002 details[open]').count(),data.products['2002'].length);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
  assert(await p.locator('.contact-bottom img[src*="xiaohongshu"]').count());
  await p.locator('#specLibrarySearch').fill('WK-T40D');assert(await p.locator('.spec-library-group:visible').count()>0);
  await p.locator('#specLibrarySearch').fill('no-such-configuration-123');assert.equal(await p.locator('.spec-library-group:visible').count(),0);
  await p.locator('#specLibrarySearch').fill('');assert.equal(await p.locator('.spec-library-group:visible').count(),groups.length);
  await p.locator('#specLibrarySearch').fill('WK-T40D');
  const cookie=p.getByRole('button',{name:/Reject all|全部拒绝/}).first();if(await cookie.isVisible())await cookie.click();
  await p.screenshot({path:`reports/specifications-complete-${zh?'zh':'en'}-${width}.png`});
  const hrefs=await p.locator('main a[href]').evaluateAll(a=>a.map(x=>x.getAttribute('href')));
  for(const href of hrefs){if(!href.startsWith('/')||href.startsWith('//'))continue;const u=new URL(href,origin);assert(fs.existsSync(path.join(root,decodeURIComponent(u.pathname))),'Broken internal target '+href);}
  await p.goto(origin+'/'+prefix+'tent-type.html?type=folding40',{waitUntil:'networkidle'});
  const link=p.locator('a[href*="specifications-packing.html#spec-2002"]').first();assert(await link.count());await link.click();await p.waitForURL('**/specifications-packing.html#spec-2002');
  assert.equal(await p.locator('#spec-2002 details[open]').count(),data.products['2002'].length);
  await p.goto(origin+'/'+prefix+'product-detail.html?sku=42003',{waitUntil:'networkidle'});
  await p.waitForFunction(()=>!!window.productManager?.products?.length);
  const popup=await p.evaluate(()=>window.productManager.products.find(p=>String(p.id)==='42003').variantTables[0].rows[0]);
  assert.equal(popup.carton,'82*26*26cm');assert.equal(popup.weight,'7');
  await p.goto(origin+'/'+prefix+'product-detail.html?sku=42009',{waitUntil:'networkidle'});
  await p.waitForFunction(()=>!!document.querySelector('.pdp-packing-notice'));
  const stale=await p.evaluate(()=>window.productManager.products.find(p=>String(p.id)==='42009').variantTables.flatMap(t=>t.rows||[]));
  assert(stale.every(r=>r.carton===''&&r.weight===''));
  assert(!(await p.locator('main').textContent()).includes('28×28×80'));
  assert.deepEqual(errors,[]);checks.push({width,zh,groups:groups.length,rows:rows.length,blankCells:true,search:true,productLink:true,pass:true});await p.close();
 }
 fs.writeFileSync('reports/specifications-completeness-check.json',JSON.stringify({workbooks:21,groups:groups.length,rows:rows.length,checks},null,2));console.log(`PASS: 21 workbook coverage, ${groups.length} groups / ${rows.length} rows, 4 library/browser/link scenarios.`);
 }finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
