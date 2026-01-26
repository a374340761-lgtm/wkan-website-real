// products-tents.js — renders tents-only listing using products from scripts/products.js
(function(){
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

      const img = document.createElement('img');
      img.src = p.image;
      img.alt = (lang && lang.startsWith('zh')) ? (p.nameZh || p.name) : (p.nameEn || p.name);
      img.loading = 'lazy';
      img.onerror = function(){ this.src='images/placeholder.png'; };

      const h3 = document.createElement('h3');
      h3.textContent = (lang && lang.startsWith('zh')) ? (p.nameZh || p.name) : (p.nameEn || p.name);

      const desc = document.createElement('p');
      desc.textContent = (lang && lang.startsWith('zh')) ? (p.shortZh || '') : (p.shortEn || '');

      const actions = document.createElement('div');
      actions.className = 'tent-actions';
      actions.innerHTML = `
        <a class="btn btn-secondary product-details-btn" href="product-detail.html?id=${encodeURIComponent(p.id)}" data-translate="view_details"></a>
        <button class="btn" data-quote="${p.id}" data-translate="btn_get_quote"></button>
        <button class="btn" data-addcart="${p.id}" data-translate="btn_add_to_cart"></button>
      `;

      card.appendChild(img);
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
