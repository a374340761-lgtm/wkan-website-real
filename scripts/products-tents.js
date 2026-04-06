// products-tents.js — renders tents-only listing using products from scripts/products.js
(function(){
  function hasCjk(text){
    return /[\u3400-\u9FFF\uF900-\uFAFF]/.test(String(text || ''));
  }

  function waitForPM(cb){
    if (window.productManager && window.productManager.products) return cb(window.productManager);
    setTimeout(()=>waitForPM(cb),100);
  }

  function getLang(){
    try{ return window.multiLang ? window.multiLang.getCurrentLanguage() : (navigator.language||'en'); }catch(e){return 'en';}
  }

  function renderCards(pm, filterType){
    const container = document.getElementById('tentsContainer');
    if (!container) return;
    container.innerHTML = '';

    const lang = getLang();

    const list = pm.products.filter(p => p.category === 'tents' && (!filterType || p.type === filterType));

    const grid = document.createElement('div');
    grid.className = 'tent-grid';

    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'tent-card';

      const L = (lang && String(lang).toLowerCase().startsWith('zh')) ? 'zh' : 'en';
      const legacyName = p ? (p.name || '') : '';
      const zhName = (p && (p.nameZh || (hasCjk(legacyName) ? legacyName : ''))) || '';
      const enName = (p && (p.nameEn || (!hasCjk(legacyName) ? legacyName : ''))) || '';
      const displayName = (typeof window.WK_productDisplayName === 'function')
        ? window.WK_productDisplayName(p, L)
        : ((L === 'zh') ? (zhName || '产品') : (enName || 'Product'));
      const displayDesc = (typeof window.WK_productLocalizedDescription === 'function')
        ? window.WK_productLocalizedDescription(p, L)
        : ((L === 'zh') ? (p.shortZh || '') : (p.shortEn || ''));

      const hero = document.createElement('div');
      hero.className = 'ap-img';

      const img = document.createElement('img');
      img.src = p.image;
      img.alt = displayName;
      img.loading = 'lazy';
      img.onerror = function(){ this.src='images/placeholder.png'; };
      hero.appendChild(img);

      const h3 = document.createElement('h3');
      h3.textContent = displayName;

      const desc = document.createElement('p');
      desc.textContent = displayDesc;

      const actions = document.createElement('div');
      actions.className = 'tent-actions';
      const typeUrl = (typeof window.WK_getProductTypePageUrl === 'function') ? window.WK_getProductTypePageUrl(p) : '';
      const sku = (p && p.sku) ? p.sku : p.id;
      const pdpUrl = `product-detail.html?sku=${encodeURIComponent(sku)}`;
      const primaryHref = typeUrl || pdpUrl;
      const primaryKey = typeUrl ? 'view_type_button' : 'view_details';
      const btnClass = typeUrl ? 'btn btn-secondary product-type-btn' : 'btn btn-secondary product-details-btn';
      actions.innerHTML = `
        <a class="${btnClass}" href="${primaryHref}" data-translate="${primaryKey}"></a>
        <button class="btn" data-quote="${p.id}" data-translate="btn_get_quote"></button>
        <button class="btn" data-addcart="${p.id}" data-translate="btn_add_to_cart"></button>
      `;

      card.appendChild(hero);
      card.appendChild(h3);
      card.appendChild(desc);
      card.appendChild(actions);

      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Translate injected UI
    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }

    // attach handlers
    container.querySelectorAll('[data-addcart]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-addcart');
        const p = pm.products.find(x=>String(x.id) === String(id));
        if (p && typeof pm.addToCart === 'function') pm.addToCart(p);
      });
    });

    container.querySelectorAll('[data-quote]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-quote');
        const p = pm.products.find(x=>String(x.id) === String(id));
        if (p && typeof pm.openInquiryModal === 'function') pm.openInquiryModal(p);
      });
    });
  }

  function buildUI(pm){
    const root = document.getElementById('tentsContainer');
    if (!root) return;
    root.innerHTML = '';

    const tabs = document.createElement('div');
    tabs.className = 'tent-tabs';
    const btnStock = document.createElement('button');
    btnStock.className='active';
    btnStock.setAttribute('data-translate', 'menu_stock_tents');
    btnStock.textContent='';
    const btnCustom = document.createElement('button');
    btnCustom.setAttribute('data-translate', 'menu_custom_tents');
    btnCustom.textContent='';
    tabs.appendChild(btnStock); tabs.appendChild(btnCustom);

    root.appendChild(tabs);

    const content = document.createElement('div');
    content.id = 'tentsListContent';
    root.appendChild(content);

    btnStock.addEventListener('click', ()=>{
      btnStock.classList.add('active'); btnCustom.classList.remove('active');
      renderCards(pm, 'stock');
    });
    btnCustom.addEventListener('click', ()=>{
      btnCustom.classList.add('active'); btnStock.classList.remove('active');
      renderCards(pm, 'custom');
    });

    // initial
    renderCards(pm, 'stock');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    waitForPM((pm)=> buildUI(pm));
  });

})();
