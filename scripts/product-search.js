(function(){
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/aluminium/g,'aluminum').replace(/flag[ -]?poles?/g,'flag pole').replace(/pop[ -]?up/g,'pop up').replace(/(\d+(?:\.\d+)?)\s*m?\s*[x×*]\s*(\d+(?:\.\d+)?)(?:\s*m\b)?/g,'$1x$2').replace(/(\d)\s*毫米/g,'$1mm').replace(/(\d)\s+(mm|cm|m)\b/g,'$1$2').replace(/[–—_-]/g,' ').replace(/\s+/g,' ').trim();
function compactConnectorTerms(query) {
    return query
        .replace(/(六角管|刀旗连接件|刀旗夹|尖头|平头)/g, ' $1 ')
        .replace(/(?<=[a-z0-9])(?=[\u4e00-\u9fff])|(?<=[\u4e00-\u9fff])(?=[a-z0-9])/g, ' ')
        .replace(/(?<=\dmm)(?=hex)|\//g, ' ')
        .trim().split(/\s+/).filter(Boolean);
}
function score(product, query) {
    query = norm(query);
    if (!query) return 0;

    const identifiers = [product.model, product.sku, product.id].map(norm);
    const model = identifiers.join(' ');
    const name = norm([product.nameEn, product.nameZh, product.name].join(' '));
    const groups = (function walk(value) {
        if (!value || typeof value !== 'object') return [];
        return [value, ...Object.values(value).flatMap(walk)];
    })(window.TENT_TYPES).filter(group => group.seriesCode && norm(group.seriesCode) === norm(product.model));
    const specs = window.WK_getVerifiedSpecs ? window.WK_getVerifiedSpecs(product.id) : [];
    const fields = Object.entries(product).filter(([key]) =>
        !key.startsWith('_') && !['image', 'images', 'gallery'].includes(key));
    const body = norm([Object.fromEntries(fields), specs, groups].map(value => JSON.stringify(value)).join(' '));
    const matches = terms => terms.length > 0 && terms.every(term => body.includes(term));

    let terms = query.split(' ');
    if (!matches(terms)) {
        const compactTerms = compactConnectorTerms(query);
        if (!matches(compactTerms)) {
            const words = body.split(/[^a-z0-9\u4e00-\u9fff]+/);
            return terms.every(term => body.includes(term) || words.some(word => near(term, word))) ? 1 : -1;
        }
        terms = compactTerms;
    }

    const identifierScore = identifiers.includes(query) ? 1000 : 0;
    const nameScore = name.includes(query) ? 500 : 0;
    const termScore = terms.reduce((sum, term) =>
        sum + (model.includes(term) ? 80 : name.includes(term) ? 40 : 5), 0);
    return identifierScore + nameScore + termScore;
}
function near(a, b) {
    if (a.length < 5 || /\d/.test(a) || Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
        if (a[i] === b[j]) {
            i++;
            j++;
            continue;
        }
        if (++edits > 1) return false;
        if (a.length >= b.length) i++;
        if (b.length >= a.length) j++;
    }
    return edits + (i < a.length || j < b.length ? 1 : 0) <= 1;
}
window.WKSearch={normalize:norm,score,search:(ps,q)=>{const seen=new Set();return ps.map(p=>({p,score:score(p,q)})).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score).filter(x=>{const k=String(x.p.id||x.p.sku);if(seen.has(k))return false;seen.add(k);return true}).map(x=>x.p)}};
})();