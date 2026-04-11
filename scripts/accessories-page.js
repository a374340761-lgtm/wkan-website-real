/* scripts/accessories-page.js
     Stable render for EXACT 24 accessories (IDs 9001-9024) using sprite crop.
     Also mounts into #tentTypeAccessoriesGrid on tent-type.html?type=tent_accessories.
*/
(function () {
    if (window.__accessoriesPageInited) return;
    window.__accessoriesPageInited = true;

    function spriteSheetUrl() {
        const rel = 'images/products/accessories/tent-accessories.png';
        if (typeof window.wkRootAssetUrl === 'function') {
            try {
                return window.wkRootAssetUrl(rel);
            } catch (e) {
                /* ignore */
            }
        }
        return '/' + rel;
    }
    const ID_MIN = 9001;
    const ID_MAX = 9024;

    function getLang() {
        try {
            if (typeof window.wkResolvePageLanguage === 'function') {
                return window.wkResolvePageLanguage();
            }
        } catch (e) {}
        try {
            const p = window.location.pathname.replace(/\\/g, '/');
            if (p === '/zh' || p.startsWith('/zh/')) return 'zh';
        } catch (e2) {}
        return 'en';
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
            #accessoriesGrid.ap-grid, #tentTypeAccessoriesGrid.ap-grid, #allProductsAccessoriesGrid.ap-grid{
                display:grid;
                grid-template-columns:repeat(4,minmax(0,1fr));
                gap:16px;
                padding: 1rem 0;
            }
            @media (max-width: 900px){
                #accessoriesGrid.ap-grid, #tentTypeAccessoriesGrid.ap-grid, #allProductsAccessoriesGrid.ap-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
            }
            @media (max-width: 520px){
                #accessoriesGrid.ap-grid, #tentTypeAccessoriesGrid.ap-grid, #allProductsAccessoriesGrid.ap-grid{ grid-template-columns:repeat(1,minmax(0,1fr)); }
            }
            #accessoriesGrid .ap-desc, #tentTypeAccessoriesGrid .ap-desc, #allProductsAccessoriesGrid .ap-desc{
                font-size:0.88rem;
                color:#64748b;
                line-height:1.45;
                margin:0 0 10px 0;
            }
            #accessoriesGrid .ap-actions, #tentTypeAccessoriesGrid .ap-actions, #allProductsAccessoriesGrid .ap-actions{
                display:flex;
                flex-wrap:wrap;
                gap:8px;
                align-items:center;
            }

            /* Accessories uses the global .ap-card/.ap-img styles from main.css.
               We only set the sprite image source here.
            */
            #accessoriesGrid .ap-img .sprite-thumb, #tentTypeAccessoriesGrid .ap-img .sprite-thumb, #allProductsAccessoriesGrid .ap-img .sprite-thumb{
                background-image:url("${spriteSheetUrl()}");
                background-size:400% 600%;
                background-color:#fff;
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
        const raw = q.trim().toLowerCase();
        if (!raw) return true;
        const tagStr = typeof p.tags === 'string'
            ? p.tags
            : (Array.isArray(p.tags) ? p.tags.join(' ') : '');
        const hay = [
            (p.model || ''),
            (p.nameZh || p.name || ''),
            (p.nameEn || ''),
            (p.descriptionZh || ''),
            (p.descriptionEn || ''),
            tagStr,
            ...(Array.isArray(p.keywords) ? p.keywords : []),
            ...(Array.isArray(p.searchableKeywords) ? p.searchableKeywords : [])
        ].join(' ').toLowerCase();
        // Align with all-products.js: any whitespace-separated token may match (not the full phrase only).
        if (hay.includes(raw)) return true;
        const tokens = raw.split(/\s+/).filter(Boolean);
        if (tokens.length <= 1) return false;
        return tokens.some((t) => t && hay.includes(t));
    }

    function getDescription(p, lang) {
        if (lang.startsWith('zh')) {
            return (p.descriptionZh || p.remarksZh || '').toString().trim();
        }
        return (p.descriptionEn || p.remarksEn || '').toString().trim();
    }

    function buildCard(p) {
        const lang = getLang();
        const name = getName(p, lang);
        const id = p.id;

        const card = document.createElement('article');
        card.className = 'ap-card';

        const hero = document.createElement('div');
        hero.className = 'ap-img';

        const sprite = document.createElement('div');
        sprite.className = 'sprite-thumb';
        sprite.style.backgroundPosition = bgPos(Number(p.grid.row), Number(p.grid.col));
        hero.appendChild(sprite);

        const body = document.createElement('div');
        body.className = 'ap-body';

        const title = document.createElement('h3');
        title.textContent = name;

        const model = document.createElement('p');
        model.className = 'ap-meta';
        model.textContent = p.model || '';

        const desc = document.createElement('p');
        desc.className = 'ap-desc';
        const descText = getDescription(p, lang);
        desc.textContent = descText;
        if (!descText) desc.style.display = 'none';

        const actions = document.createElement('div');
        actions.className = 'ap-actions';

        const detailsLink = document.createElement('a');
        detailsLink.className = 'btn btn-secondary product-details-btn';
        detailsLink.href = `product-detail.html?sku=${encodeURIComponent(id)}`;
        detailsLink.setAttribute('data-translate', 'view_details');
        detailsLink.textContent = '';

        const cartBtn = document.createElement('button');
        cartBtn.type = 'button';
        cartBtn.className = 'btn btn-primary';
        cartBtn.setAttribute('data-translate', 'btn_add_to_cart');
        cartBtn.setAttribute('data-product-id', String(id));
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.addToCart === 'function') {
                window.addToCart(id);
            }
        });

        const go = () => {
            location.href = `product-detail.html?sku=${encodeURIComponent(id)}`;
        };

        hero.addEventListener('click', go);
        title.addEventListener('click', go);

        actions.appendChild(detailsLink);
        actions.appendChild(cartBtn);
        body.appendChild(title);
        body.appendChild(model);
        body.appendChild(desc);
        body.appendChild(actions);

        card.appendChild(hero);
        card.appendChild(body);
        return card;
    }

    function renderIntoGrid(gridEl, list) {
        if (!gridEl) return;
        gridEl.classList.add('ap-grid');
        gridEl.innerHTML = '';
        const frag = document.createDocumentFragment();
        list.forEach((p) => frag.appendChild(buildCard(p)));
        gridEl.appendChild(frag);
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    }

    function render(list) {
        const grid = document.getElementById('accessoriesGrid');
        const empty = document.getElementById('accessoriesEmpty');
        if (!grid) return;

        renderIntoGrid(grid, list);

        if (empty) empty.style.display = (list.length ? 'none' : 'block');
    }

    /** Mount 24-cell grid into #gridId when catalog is ready (productManager). */
    function mountAccessoriesGrid(gridId, opts) {
        const options = opts || {};
        const gid = gridId || 'accessoriesGrid';
        let base24 = null;

        const run = () => {
            const all = getAllProducts();
            if (!all || !all.length) return false;
            base24 = pick24Accessories(all);
            const el = document.getElementById(gid);
            if (!el) return false;
            let rows = base24;
            const fq = options.filterQuery != null ? String(options.filterQuery).trim() : '';
            if (fq) {
                rows = base24.filter((p) => matches(p, fq));
            }
            renderIntoGrid(el, rows);
            const empty = document.getElementById('accessoriesEmpty');
            if (empty) empty.style.display = rows.length ? 'none' : 'block';

            if (options.search && gid === 'accessoriesGrid') {
                const search = document.getElementById('accessoriesSearch');
                if (search && !search.dataset.wkBound) {
                    search.dataset.wkBound = '1';
                    const lang = getLang();
                    search.placeholder = lang.startsWith('zh') ? '搜索配件' : 'Search accessories';
                    search.addEventListener('input', () => {
                        const q = search.value || '';
                        renderIntoGrid(el, base24.filter((p) => matches(p, q)));
                    }, { passive: true });
                }
            }
            return true;
        };

        injectStylesOnce();
        if (run()) return;
        let n = 0;
        const timer = setInterval(() => {
            n += 1;
            if (run() || n > 120) clearInterval(timer);
        }, 50);
    }

    window.WK_mountAccessoriesGrid = mountAccessoriesGrid;

    function init() {
        injectStylesOnce();
        if (document.getElementById('accessoriesGrid')) {
            mountAccessoriesGrid('accessoriesGrid', { search: true });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
