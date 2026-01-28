// RaceGate view-type page (racegate-type.html)
(function () {
  'use strict';

  function waitForProductManager(cb, tries = 0) {
    const pm = window.productManager;
    if (pm && Array.isArray(pm.products)) return cb(pm);
    if (tries > 200) return cb(null);
    setTimeout(() => waitForProductManager(cb, tries + 1), 50);
  }

  function getLang() {
    try {
      return window.multiLang ? window.multiLang.getCurrentLanguage() : 'en';
    } catch (e) {
      return 'en';
    }
  }

  function t(zh, en) {
    const lang = getLang();
    return (lang === 'zh') ? zh : en;
  }

  function escapeHtml(s) {
    return (s || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderTable(spec) {
    if (!spec || !Array.isArray(spec.headers) || !Array.isArray(spec.rows)) return '';

    const headers = spec.headers;
    const rows = spec.rows;

    return `
      <div class="rg-table">
        <h2 style="margin: 1.5rem 0 0.75rem;" >${escapeHtml(t('型号与参数', 'Models & Specifications'))}</h2>
        <div style="overflow:auto; border:1px solid var(--border-color); border-radius: var(--radius-lg); background: var(--bg-white);">
          <table style="width:100%; border-collapse:collapse; min-width: 760px;">
            <thead>
              <tr>
                ${headers.map(h => `<th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color); font-weight:600; white-space:nowrap;">${escapeHtml(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => `
                <tr>
                  ${headers.map(h => {
                    const v = (r && (r[h] ?? r[h.replace(/\s+/g, '')] ?? r[h.toLowerCase()])) ?? '';
                    return `<td style="padding:12px 14px; border-bottom:1px solid rgba(0,0,0,0.06); white-space:nowrap;">${escapeHtml(String(v))}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function render(pm) {
    const root = document.getElementById('racegateRoot');
    if (!root) return;

    if (!pm) {
      root.innerHTML = `<div class="ap-empty"><p>${escapeHtml(t('产品数据未加载，请刷新重试。', 'Product data not loaded. Please refresh.'))}</p></div>`;
      return;
    }

    const products = pm.products.filter(p => p && p.category === 'racegate');
    const first = products[0];

    const img = 'images/products/racegate/pdf_p9.png';

    const cards = products.map(p => {
      const name = (getLang() === 'zh') ? (p.nameZh || p.name || p.nameEn) : (p.nameEn || p.name || p.nameZh);
      const desc = (getLang() === 'zh') ? (p.shortZh || p.descriptionZh || '') : (p.shortEn || p.descriptionEn || '');
      const detailUrl = `product.html?cat=racegate&id=${encodeURIComponent(p.id)}`;

      return `
        <article class="ap-card" style="overflow:hidden;">
          <div class="ap-img" style="height:180px;">
            <img src="${img}" alt="${escapeHtml(name)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='images/placeholder.png'">
          </div>
          <div class="ap-body">
            <h3 style="margin:0 0 0.5rem 0;">${escapeHtml(name)}</h3>
            ${desc ? `<p class="ap-meta" style="margin:0 0 0.75rem 0;">${escapeHtml(desc)}</p>` : ''}
            <div class="product-actions" style="display:flex;gap:10px;">
              <a class="btn btn-secondary product-details-btn" href="${detailUrl}" data-translate="view_details"></a>
              <a class="btn btn-primary" href="all-products.html?cat=racegate">${escapeHtml(t('在全部产品中查看', 'View in Browse Products'))}</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    root.innerHTML = `
      <div class="section-header">
        <h1>${escapeHtml(t('竞速拱门 RaceGate', 'Race Gate'))}</h1>
        <p style="max-width: 900px; margin: 0.5rem auto 0; color: var(--text-light);">
          ${escapeHtml(t('以下信息来自目录图片（pdf_p9.png）。', 'The information below is extracted from the catalog image (pdf_p9.png).'))}
        </p>
      </div>

      <div style="max-width: 980px; margin: 0 auto;">
        <figure style="margin: 1.25rem 0;">
          <img src="${img}" alt="RaceGate Catalog" loading="lazy" style="width:100%; height:auto; border-radius: var(--radius-lg); border:1px solid var(--border-color); background: var(--bg-white);" onerror="this.style.display='none'" />
        </figure>

        <div class="ap-grid" style="margin-top: 1.25rem;">
          ${cards}
        </div>

        ${first && first.variantTable ? renderTable(first.variantTable) : ''}
      </div>
    `;

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function init() {
    waitForProductManager(render);

    document.addEventListener('languageChanged', () => {
      waitForProductManager(render);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
