(function () {
  'use strict';

  /** Root-absolute URL so brochure loads on `/zh/...` (relative `images/` would hit `/zh/images/...`). */
  function brochureAssetUrl() {
    const rel = 'images/products/furniture/chair table/folding-table-and-chair-set-event-furniture-hero.png';
    if (typeof window.wkRootAssetUrl === 'function') {
      try {
        return window.wkRootAssetUrl(rel);
      } catch (e) {
        /* ignore */
      }
    }
    const x = rel.replace(/^\.\//, '');
    return x.startsWith('/') ? x : '/' + x;
  }

  function getCurrentLang() {
    try {
      if (typeof window.wkResolvePageLanguage === 'function') {
        return window.wkResolvePageLanguage();
      }
    } catch (e) {}
    try {
      const p = window.location.pathname.replace(/\\/g, '/');
      if (p === '/zh' || p.startsWith('/zh/')) return 'zh';
    } catch (e2) {}
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang === 'zh' || htmlLang === 'zh-cn') return 'zh';
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

  function safeHtml(s) {
    return String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderModelList(items, catalog) {
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
      const preferredSku = (p && p.sku != null && String(p.sku).trim() !== '') ? String(p.sku).trim() : (p && p.id != null ? String(p.id).trim() : '');
      const href = preferredSku ? `product-detail.html?sku=${encodeURIComponent(preferredSku)}` : 'all-products.html?cat=all&sub=dome-3-folders';
      const icon = 'fa-layer-group';
      const pid = p && p.id != null ? String(p.id) : '';

      return `
        <div style="display:flex; gap:10px; align-items:flex-start; padding: 12px; border:1px solid var(--border-color); border-radius: 12px; background: var(--bg-white); flex-wrap:wrap;">
          <div style="width:38px; height:38px; border-radius: 10px; display:flex; align-items:center; justify-content:center; background: rgba(15,23,42,0.06); color:#0f172a;">
            <i class="fa-solid ${safeHtml(icon)}"></i>
          </div>
          <div style="flex:1; min-width: 180px;">
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
              <div style="font-weight:800;">${safeHtml(name)}</div>
              <span data-translate="menu_dome_3_folders" style="font-size: 12px; padding: 2px 8px; border-radius: 999px; border:1px solid var(--border-color); color: var(--text-muted);"></span>
            </div>
            ${model ? `<div style="color: var(--text-muted); font-size: 0.95rem;"><span data-translate="spec_col_model"></span>: ${safeHtml(model)}</div>` : ''}
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <a class="btn btn-secondary" href="${href}" data-translate="view_details"></a>
            <button type="button" class="btn btn-accent" data-wk-rfq-dome="${safeHtml(pid)}" data-translate="btn_add_to_inquiry"></button>
          </div>
        </div>
      `;
    }).join('');

    wrap.querySelectorAll('[data-wk-rfq-dome]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-wk-rfq-dome');
        const prod = (catalog || []).find((x) => x && String(x.id) === String(id));
        if (prod && typeof window.addProductToRfqCart === 'function') {
          window.addProductToRfqCart(prod, 1);
        }
      });
    });

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function init() {
    const domeHero = document.getElementById('domeHeroImg');
    const img = document.getElementById('domeBrochureImg');
    const btn = document.getElementById('domeBrochureBtn');
    const brochure = brochureAssetUrl();

    if (domeHero) domeHero.src = brochure;
    if (img) img.src = brochure;

    if (btn) {
      btn.addEventListener('click', () => {
        const title = (window.wkI18n && typeof window.wkI18n.t === 'function')
          ? window.wkI18n.t('view_type_brochure_ref')
          : '';
        openImageModal(brochure, title);
      });
    }

    const wrap = document.getElementById('domeTypeList');
    if (wrap) {
      wrap.innerHTML = '<div class="wk-muted" data-translate="type_page_loading_catalog"></div>';
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
    }

    waitForProductManager((pm) => {
      const catalog = pm && Array.isArray(pm.products) ? pm.products : [];
      const items = catalog.filter((p) => String(p.subcategory || '') === 'dome-3-folders');
      renderModelList(items, catalog);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
