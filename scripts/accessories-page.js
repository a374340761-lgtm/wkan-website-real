/* scripts/accessories-page.js
     Stable render for EXACT 24 accessories (IDs 9001-9024) using sprite crop.
*/
(function () {
    if (window.__accessoriesPageInited) return;
    window.__accessoriesPageInited = true;

    const SPRITE = './images/products/accessories/tent-accessories.png';
    const ID_MIN = 9001;
    const ID_MAX = 9024;

    function getLang() {
        const htmlLang = (document.documentElement.lang || '').toLowerCase();
        const bodyLang = (document.body && (document.body.dataset.lang || document.body.getAttribute('data-lang') || '')) || '';
        const ml = (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function')
            ? (window.multiLang.getCurrentLanguage() || '')
            : '';
        return (ml || bodyLang || htmlLang || 'en').toLowerCase();
    }

    function getAllProducts() {
        // most reliable in your project is window.productManager.products
        if (window.productManager && Array.isArray(window.productManager.products)) return window.productManager.products;
        if (Array.isArray(window.products)) return window.products;
        if (Array.isArray(window.PRODUCTS)) return window.PRODUCTS;
        return [];
    }

    function injectStylesOnce() {
        if (document.getElementById('__accessories_page_css')) return;
        const css = `
            #accessoriesGrid.ap-grid{
                display:grid;
                grid-template-columns:repeat(4,minmax(0,1fr));
                gap:16px;
                padding: 1rem 0;
            }
            @media (max-width: 900px){
                #accessoriesGrid.ap-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
            }
            @media (max-width: 520px){
                #accessoriesGrid.ap-grid{ grid-template-columns:repeat(1,minmax(0,1fr)); }
            }

            .ap-card{
                background:#fff;
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 8px 22px rgba(0,0,0,.06);
                border:1px solid rgba(0,0,0,.04);
                display:flex;
                flex-direction:column;
            }
            .ap-thumb{
                height:150px;
                background-image:url("${SPRITE}");
                background-size:400% 600%;
                background-repeat:no-repeat;
                background-color:#fff;
                border-bottom:1px solid rgba(0,0,0,.06);
            }
            .ap-body{ padding:12px; display:flex; flex-direction:column; gap:6px; }
            .ap-title{ margin:0; font-size:1rem; font-weight:600; cursor:pointer; }
            .ap-model{ font-size:.86rem; opacity:.75; }
            .ap-actions{ margin-top:8px; display:flex; gap:10px; }
            .ap-btn{
                padding:8px 10px;
                border-radius:8px;
                border:1px solid rgba(0,0,0,.12);
                background:#fff;
                cursor:pointer;
                font-size:.9rem;
            }
        `;
        const s = document.createElement('style');
        s.id = '__accessories_page_css';
        s.appendChild(document.createTextNode(css));
        document.head.appendChild(s);
    }

    function sortByGrid(a, b) {
        const ar = Number(a.grid?.row || 0), ac = Number(a.grid?.col || 0);
        const br = Number(b.grid?.row || 0), bc = Number(b.grid?.col || 0);
        if (ar !== br) return ar - br;
        return ac - bc;
    }

    function pick24Accessories(all) {
        // ONLY 9001-9024 (avoid 1001/1002 which have no grid => all show same crop)
        const list = (all || []).filter(p => {
            const id = Number(p.id);
            return Number.isFinite(id) && id >= ID_MIN && id <= ID_MAX && p.grid && p.grid.row && p.grid.col;
        });

        // stable order: by row/col
        list.sort(sortByGrid);

        // If missing, fill placeholders but keep grid positions stable
        const expected = [];
        for (let r = 1; r <= 6; r++) {
            for (let c = 1; c <= 4; c++) {
                const found = list.find(x => Number(x.grid.row) === r && Number(x.grid.col) === c);
                expected.push(found || {
                    id: `missing-${r}-${c}`,
                    model: 'TBD',
                    name: '待补充',
                    nameEn: 'TBD',
                    grid: { row: r, col: c },
                    keywords: ['accessories']
                });
            }
        }
        return expected; // always 24
    }

    function bgPos(row, col) {
        const x = (col - 1) * 33.333333; // 0, 33.33, 66.66, 100
        const y = (row - 1) * 20;        // 0,20,40,60,80,100
        return `${x}% ${y}%`;
    }

    function getName(p, lang) {
        if (lang.startsWith('zh')) return p.nameZh || p.name || p.nameEn || p.model || '待补充';
        return p.nameEn || p.name || p.nameZh || p.model || 'TBD';
    }

    function matches(p, q) {
        if (!q) return true;
        const s = q.trim().toLowerCase();
        const hay = [
            (p.model || ''),
            (p.nameZh || p.name || ''),
            (p.nameEn || ''),
            ...(Array.isArray(p.keywords) ? p.keywords : [])
        ].join(' ').toLowerCase();
        return hay.includes(s);
    }

    function buildCard(p) {
        const lang = getLang();
        const name = getName(p, lang);
        const id = p.id;

        const card = document.createElement('article');
        card.className = 'ap-card';

        const thumb = document.createElement('div');
        thumb.className = 'ap-thumb';
        thumb.style.backgroundPosition = bgPos(Number(p.grid.row), Number(p.grid.col));

        const body = document.createElement('div');
        body.className = 'ap-body';

        const title = document.createElement('h3');
        title.className = 'ap-title';
        title.textContent = name;

        const model = document.createElement('div');
        model.className = 'ap-model';
        model.textContent = p.model || '';

        const actions = document.createElement('div');
        actions.className = 'ap-actions';

        const detailsLink = document.createElement('a');
        detailsLink.className = 'btn btn-secondary product-details-btn';
        detailsLink.href = `product-detail.html?id=${encodeURIComponent(id)}`;
        detailsLink.setAttribute('data-translate', 'view_details');
        detailsLink.textContent = '';

        const go = () => {
            location.href = `product-detail.html?id=${encodeURIComponent(id)}`;
        };

        thumb.addEventListener('click', go);
        title.addEventListener('click', go);

        actions.appendChild(detailsLink);
        body.appendChild(title);
        body.appendChild(model);
        body.appendChild(actions);

        card.appendChild(thumb);
        card.appendChild(body);
        return card;
    }

    function render(list) {
        const grid = document.getElementById('accessoriesGrid');
        const empty = document.getElementById('accessoriesEmpty');
        if (!grid) return;

        grid.classList.add('ap-grid');
        grid.innerHTML = '';

        const frag = document.createDocumentFragment();
        list.forEach(p => frag.appendChild(buildCard(p)));
        grid.appendChild(frag);

        // Apply translations for injected nodes
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }

        if (empty) empty.style.display = (list.length ? 'none' : 'block');
    }

    function init() {
        injectStylesOnce();

        const all = getAllProducts();
        const base24 = pick24Accessories(all);
        render(base24);

        const search = document.getElementById('accessoriesSearch');
        if (search) {
            const lang = getLang();
            search.placeholder = lang.startsWith('zh') ? '搜索配件' : 'Search accessories';
            search.addEventListener('input', () => {
                const q = search.value || '';
                render(base24.filter(p => matches(p, q)));
            }, { passive: true });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
