/* Shared renderer for the reviewed, price-free 2026 specification data.
 * Embedded in products.js by sync-2026-specifications.py; also used for static HTML.
 */
(function () {
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const specificationKey = id => Object.hasOwn(WK_VERIFIED_SPECIFICATIONS.products, String(id)) ? String(id) : `tent:${id}`;
  window.WK_getVerifiedSpecs = id => WK_VERIFIED_SPECIFICATIONS.products[specificationKey(id)] || [];
  window.WK_renderVerifiedSpecs = function (id, lang, rowAction) {
    const zh = lang === 'zh';
    const localePrefix = window.location?.pathname.match(/^\/(zh|de|es|fr|it|pt|ru|nl|da|sv)(?=\/|$)/)?.[0] || (zh ? '/zh' : '');
    const groups = window.WK_getVerifiedSpecs(id);
    return groups.map((g, i) => `<section class="tent-type-detail__block wk-verified-specs" data-verified-specs="${escape(id)}" style="min-width:0;max-width:100%;margin-top:24px">
      <h3>${escape(zh ? g.titleZh : g.titleEn)}</h3>
      ${g.columns.length + (rowAction ? 1 : 0) > 4 ? `<p class="wk-spec-scroll-hint">${String(id) === '42003' && !rowAction ? (zh ? '左右滑动查看完整规格。' : 'Swipe horizontally to view all specifications.') : (zh ? '左右滑动查看完整规格与询价按钮。' : 'Swipe horizontally to view all specifications and quote buttons.')}</p>` : ''}
      <div class="tent-type-detail__tableWrap" role="region" aria-label="${escape(zh ? g.titleZh : g.titleEn)}" tabindex="0" style="max-width:100%;overflow-x:auto"><table class="pdp-spec-table" style="width:100%;min-width:${g.columns.length + (rowAction ? 1 : 0) > 4 ? '660' : '360'}px;border-collapse:collapse"><thead><tr>${g.columns.map(c => `<th scope="col" style="padding:8px;text-align:left">${escape(zh ? c.zh : c.en)}</th>`).join('')}${rowAction ? `<th scope="col">${zh ? '询价' : 'Quote'}</th>` : ''}</tr></thead><tbody>${g.rows.map(r => `<tr>${g.columns.map(c => `<td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-line;overflow-wrap:anywhere">${escape((!zh && r.en ? r.en[c.key] : r[c.key]) || '')}</td>`).join('')}${rowAction ? rowAction(r, g) : ''}</tr>`).join('')}</tbody></table></div>
      ${(zh ? g.notesZh : g.notesEn).map(n => `<p class="tent-type-detail__text">${escape(n)}</p>`).join('')}
    </section>`).join('') + (groups.length ? `<p class="tent-type-detail__text"><a class="wk-resource-link" href="${localePrefix}/specifications-packing.html#spec-${encodeURIComponent(specificationKey(id))}">${zh ? '查看完整规格与装箱资料 →' : 'Explore all specifications & packing →'}</a></p>` : '');
  };
})();
