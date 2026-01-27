(function () {
  'use strict';

  const BROCHURE = encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/17.png');

  // Render immediately (no waiting), then optionally upgrade with productManager data.
  const STATIC_ITEMS = [
    { id: 31201, category: 'tents', model: 'WK-TENT188', nameZh: '车顶帐篷', nameEn: 'Car Tent', icon: 'fa-campground' },
    { id: 31202, category: 'tents', model: 'WK-TENT190', nameZh: '户外更衣室', nameEn: 'Outdoor Dressing Room', icon: 'fa-person-shelter' },
    { id: 31203, category: 'furniture', model: 'WK-C56', nameZh: '方形折叠收纳篮', nameEn: 'Square Folding Clothes Basket', icon: 'fa-box-archive' },
    { id: 31204, category: 'furniture', model: 'WK-C59', nameZh: '圆形折叠收纳篮', nameEn: 'Round Folding Clothes Basket', icon: 'fa-box-archive' },
    { id: 31205, category: 'furniture', model: 'WK-C35', nameZh: '圆形折叠收纳篮', nameEn: 'Round Folding Clothes Basket', icon: 'fa-box-archive' }
  ];

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
    const maxWait = 2500;
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

  function safeHtml(s) {
    return String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderModelList(items) {
    const wrap = document.getElementById('domeTypeList');
    if (!wrap) return;

    const lang = getCurrentLang();

    if (!items || !items.length) {
      wrap.innerHTML = `<div class="wk-empty" data-translate="view_type_no_items_yet"></div>`;
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
      return;
    }

    wrap.innerHTML = items.map((p) => {
      const name = lang === 'zh' ? (p.name || p.nameZh || p.nameEn || p.model) : (p.nameEn || p.name || p.nameZh || p.model);
      const model = p.model || '';
      const cat = String(p.category || '');
      const href = (p.id != null) ? `product.html?id=${encodeURIComponent(p.id)}` : 'all-products.html';
      const icon = p.icon || (cat === 'tents' ? 'fa-campground' : 'fa-chair');
      const badgeKey = cat === 'tents' ? 'home_cat_tents_title' : 'category_furniture';

      return `
        <div style="display:flex; gap:10px; align-items:flex-start; padding: 12px; border:1px solid var(--border-color); border-radius: 12px; background: var(--bg-white);">
          <div style="width:38px; height:38px; border-radius: 10px; display:flex; align-items:center; justify-content:center; background: rgba(15,23,42,0.06); color:#0f172a;">
            <i class="fa-solid ${safeHtml(icon)}"></i>
          </div>
          <div style="flex:1;">
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
              <div style="font-weight:800;">${safeHtml(name)}</div>
              <span data-translate="${badgeKey}" style="font-size: 12px; padding: 2px 8px; border-radius: 999px; border:1px solid var(--border-color); color: var(--text-muted);"></span>
            </div>
            ${model ? `<div style="color: var(--text-muted); font-size: 0.95rem;"><span data-translate="spec_col_model"></span>: ${safeHtml(model)}</div>` : ''}
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
    const img = document.getElementById('domeBrochureImg');
    const btn = document.getElementById('domeBrochureBtn');

    if (img) img.src = BROCHURE;

    if (btn) {
      btn.addEventListener('click', () => {
        const title = (window.wkI18n && typeof window.wkI18n.t === 'function')
          ? window.wkI18n.t('view_type_brochure_ref')
          : '';
        openImageModal(BROCHURE, title);
      });
    }

    // Fast render first.
    renderModelList(STATIC_ITEMS);

    // Upgrade render when productManager is ready.
    waitForProductManager((pm) => {
      if (!pm) return;
      const all = Array.isArray(pm.products) ? pm.products : [];
      const items = all.filter((p) => String(p.subcategory || '') === 'dome-3-folders');
      if (items.length) renderModelList(items);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
