/* Shared renderer for the reviewed, price-free 2026 specification data.
 * Embedded in products.js by sync-2026-specifications.py; also used for static HTML.
 */
(function () {
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.WK_getVerifiedSpecs = id => WK_VERIFIED_SPECIFICATIONS.products[String(id)] || [];
  window.WK_renderVerifiedSpecs = function (id, lang, rowAction) {
    const zh = lang === 'zh';
    const groups = window.WK_getVerifiedSpecs(id);
    return groups.map((g, i) => `<section class="tent-type-detail__block wk-verified-specs" data-verified-specs="${escape(id)}" style="min-width:0;max-width:100%;margin-top:24px">
      <h3>${escape(zh ? g.titleZh : g.titleEn)}</h3>
      <div class="tent-type-detail__tableWrap" role="region" aria-label="${escape(zh ? g.titleZh : g.titleEn)}" tabindex="0" style="max-width:100%;overflow-x:auto"><table class="pdp-spec-table" style="width:100%;min-width:${g.columns.length > 4 ? '660' : '360'}px;border-collapse:collapse"><thead><tr>${g.columns.map(c => `<th scope="col" style="padding:8px;text-align:left">${escape(zh ? c.zh : c.en)}</th>`).join('')}${rowAction ? `<th scope="col">${zh ? '询价' : 'Quote'}</th>` : ''}</tr></thead><tbody>${g.rows.map(r => `<tr>${g.columns.map(c => `<td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-line;overflow-wrap:anywhere">${escape(r[c.key] || '—')}</td>`).join('')}${rowAction ? rowAction(r, g) : ''}</tr>`).join('')}</tbody></table></div>
      ${(zh ? g.notesZh : g.notesEn).map(n => `<p class="tent-type-detail__text">${escape(n)}</p>`).join('')}
    </section>`).join('');
  };
})();
