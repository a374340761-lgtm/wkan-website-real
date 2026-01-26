(function () {
  'use strict';

  const BROCHURE = encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/17.png');

  function getCurrentLang() {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang === 'zh' || htmlLang === 'en') return htmlLang;
    try {
      const saved = (localStorage.getItem('site_language') || '').toLowerCase();
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {
      // ignore
    }
    return 'en';
  }

  function ensureImageModal() {
    let modal = document.getElementById('wkImageModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'wkImageModal';
    modal.className = 'modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 1100px;">
        <span class="close" id="wkImageModalClose">&times;</span>
        <div style="padding: 10px 0 14px;">
          <div id="wkImageModalTitle" style="font-weight:800; margin: 0 0 10px;"></div>
          <img id="wkImageModalImg" alt="" style="width:100%; height:auto; border-radius: 12px;" />
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#wkImageModalClose');
    const close = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display !== 'none') close();
    });

    return modal;
  }

  function openImageModal(src, title) {
    const modal = ensureImageModal();
    const img = modal.querySelector('#wkImageModalImg');
    const titleEl = modal.querySelector('#wkImageModalTitle');

    if (titleEl) titleEl.textContent = title || '';
    if (img) img.src = src;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function waitForProductManager(cb) {
    const maxWait = 4000;
    const start = Date.now();
    const tick = () => {
      if (window.productManager && Array.isArray(window.productManager.products)) {
        cb(window.productManager);
        return;
      }
      if (Date.now() - start > maxWait) {
        cb(null);
        return;
      }
      setTimeout(tick, 60);
    };
    tick();
  }

  function renderModelList(pm) {
    const wrap = document.getElementById('furnitureTypeList');
    if (!wrap) return;

    const lang = getCurrentLang();

    const all = pm && Array.isArray(pm.products) ? pm.products : [];
    const items = all.filter((p) => String(p.category || '') === 'furniture' && String(p.subcategory || '') === 'table-chair-stool-toilet');

    if (!items.length) {
      wrap.innerHTML = '<div class="wk-empty" data-translate="view_type_no_items_yet"></div>';
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
      return;
    }

    const safe = (s) => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    wrap.innerHTML = items.map((p) => {
      const name = lang === 'zh' ? (p.name || p.nameEn || p.model) : (p.nameEn || p.name || p.model);
      const model = p.model || '';
      const href = p.id ? `product-detail.html?id=${encodeURIComponent(p.id)}` : 'all-products.html?cat=furniture';
      return `
        <div style="display:flex; gap:10px; align-items:flex-start; padding: 12px; border:1px solid var(--border-color); border-radius: 12px; background: var(--bg-white);">
          <div style="width:38px; height:38px; border-radius: 10px; display:flex; align-items:center; justify-content:center; background: rgba(15,23,42,0.06); color:#0f172a;">
            <i class="fa-solid fa-chair"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:800;">${safe(name)}</div>
            ${model ? `<div style="color: var(--text-muted); font-size: 0.95rem;"><span data-translate="label_model"></span>: ${safe(model)}</div>` : ''}
          </div>
          <div>
            <a class="btn btn-secondary" href="${href}" data-translate="view_details"></a>
          </div>
        </div>
      `;
    }).join('');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function init() {
    const img = document.getElementById('furnitureBrochureImg');
    const btn = document.getElementById('furnitureBrochureBtn');

    if (img) img.src = BROCHURE;

    if (btn) {
      btn.addEventListener('click', () => {
        const title = getCurrentLang() === 'zh' ? '产品画册参考' : 'Brochure PDF Guide';
        openImageModal(BROCHURE, title);
      });
    }

    waitForProductManager((pm) => {
      renderModelList(pm);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
