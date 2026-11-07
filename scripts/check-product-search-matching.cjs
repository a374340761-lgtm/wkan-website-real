const fs=require('fs'),vm=require('vm'),assert=require('assert');const c={window:{},document:{addEventListener(){},createElement(){return {}},head:{appendChild(){}}}};vm.createContext(c);for(const f of ['products.js','tent-types.js','product-search.js'])vm.runInContext(fs.readFileSync('scripts/'+f,'utf8'),c);const ps=c.window.WKCreateProductManager().products,S=c.window.WKSearch;const queries=['3x3','3×3','3 x 3','3m x 3m','aluminum','aluminium','flagpole','flag pole','3x3 aluminum tent','40mm frame','40 mm frame','fiberglass flag pole','heart','95013','  HEART  ','fiberglas flag pole','','zzzzunfindable','<script>'];const rows=queries.map(q=>({query:q,count:S.search(ps,q).length,top:S.search(ps,q).slice(0,5).map(p=>({id:p.id,name:p.nameEn,model:p.model}))}));for(const group of [['3x3','3×3','3 x 3','3m x 3m'],['aluminum','aluminium'],['flagpole','flag pole'],['40mm frame','40 mm frame'],['heart','  HEART  ']])for(const q of group)assert.deepEqual(S.search(ps,q).map(p=>p.id),S.search(ps,group[0]).map(p=>p.id));assert.equal(S.search(ps,'95013')[0].id,95013);assert.equal(S.search(ps,'<script>').length,0);fs.writeFileSync('reports/search-queries.json',JSON.stringify(rows,null,2));console.log(rows.map(r=>[r.query,r.count,r.top[0]?.id]));

for (const query of [
    '9020', 'WK-T12', '40mm六角管尖头刀旗连接件', '50毫米六角管平头刀旗连接件',
    '40mmhex管尖头刀旗连接件', '40mm/50mm hex管刀旗连接件',
    '50 mm hex feather flag connector flat head', '40 mm pointed tip blade flag connector', '刀旗夹'
]) {
    assert.equal(S.search(ps, query)[0]?.id, 9020, query);
}
assert.equal(S.search(ps, '45mm hex tube blade flag connector').some(p => p.id === 9020), false);
