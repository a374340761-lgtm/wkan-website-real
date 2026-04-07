// Unified Product Detail (canonical): product-detail.html?sku=XXXX
// sku priority: product.sku then product.id (fallback)
/** Must match production host in sitemap / HTML canonicals (avoid apex vs www conflicts in GSC). */
const WK_PREFERRED_ORIGIN = 'https://www.waikwantent.com';

document.addEventListener('DOMContentLoaded', () => {
    // Normalize legacy parameters into the canonical URL format.
    try {
        const url = new URL(window.location.href);
        const p = url.searchParams;
        const sku = (p.get('sku') || '').trim();
        const legacy = (p.get('id') || p.get('open') || p.get('pid') || p.get('product') || p.get('model') || '').trim();
        const chosen = sku || legacy;

        // Canonicalize: always use only ?sku=...
        const needsCanonical = (!sku && legacy) || p.has('id') || p.has('open') || p.has('pid') || p.has('product') || p.has('model') || p.has('cat') || p.has('category');
        if (chosen && needsCanonical) {
            const target = new URL('product-detail.html', url);
            target.searchParams.set('sku', chosen);
            target.hash = url.hash;
            window.location.replace(target.toString());
            return;
        }
    } catch (e) {
        // ignore
    }

    let attachedOnce = false;

    // Legacy route compatibility handled above by redirect shim.

    const escapeHtml = (s) => {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const renderList = (items) => {
        const list = Array.isArray(items) ? items.filter(Boolean) : [];
        if (!list.length) return '';
        return `<ul>${list.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
    };

    const renderBilingual = (zhItems, enItems) => {
        const lang = getCurrentLang();
        const zh = renderList(zhItems);
        const en = renderList(enItems);
        if (lang === 'zh') {
            // In Chinese mode, show both CN + EN (industry-style bilingual).
            return `${zh || ''}${en ? `<div style="margin-top:12px;opacity:.92">${en}</div>` : ''}`;
        }
        return en || zh || '';
    };

    const getCurrentLang = () => {
        try {
            return window.multiLang ? window.multiLang.getCurrentLanguage() : 'en';
        } catch (e) {
            return 'en';
        }
    };

    const getCategoryLabel = (cat) => {
        const map = {
            tents: 'home_cat_tents_title',
            flags: 'menu_beach_flags',
            displays: 'menu_popup_displays',
            lightbox: 'category_lightbox',
            'advertising-arch': 'category_advertising_arch',
            'water-filled-a-poster-stand': 'category_water_filled_a_poster_stand',
            accessories: 'menu_accessories',
            racegate: 'home_cat_racegate_title',
            inflatable: 'category_inflatable',
            furniture: 'category_furniture',
            custom: 'category_custom'
        };
        const key = map[String(cat || '').toLowerCase()];
        if (!key) return String(cat || '');
        if (window.multiLang && typeof window.multiLang.t === 'function') return window.multiLang.t(key);
        return String(cat || '');
    };

    const setVisible = (el, isVisible) => {
        if (!el) return;
        el.style.display = isVisible ? '' : 'none';
    };

    const waitForProductManager = (cb, tries = 0) => {
        const pm = window.productManager;
        if (pm && Array.isArray(pm.products)) {
            cb(pm);
            return;
        }
        if (tries > 200) {
            cb(null);
            return;
        }
        setTimeout(() => waitForProductManager(cb, tries + 1), 50);
    };

    const redirectToAllProducts = () => {
        window.location.replace('all-products.html');
    };

    const renderDetail = (pm) => {
        const params = new URLSearchParams(location.search);
        const requested = (params.get('sku') || '').trim();
        if (!pm || !requested) {
            redirectToAllProducts();
            return;
        }

        // Merged SKUs → single PDP (rect bi-fold Z-series; round YZ-series)
        const legacyMergedSku = {
            '31002': '31001', '31003': '31001', '31004': '31001',
            '31011': '31010', '31012': '31010'
        };
        if (legacyMergedSku[requested]) {
            window.location.replace(`product-detail.html?sku=${encodeURIComponent(legacyMergedSku[requested])}`);
            return;
        }

        // sku priority: exact sku match first, then id match
        const product = pm.products.find(p => p && String(p.sku || '').trim() === requested)
            || pm.products.find(p => p && String(p.id) === requested);
        if (!product) {
            redirectToAllProducts();
            return;
        }

        // Ensure URL always uses sku if available.
        try {
            const preferredSku = (product && product.sku != null && String(product.sku).trim() !== '')
                ? String(product.sku).trim()
                : String(product.id);
            if (preferredSku && preferredSku !== requested) {
                window.location.replace(`product-detail.html?sku=${encodeURIComponent(preferredSku)}`);
                return;
            }
        } catch (e) {}

        const notFound = document.getElementById('productNotFound');
        const body = document.getElementById('productDetailBody');
        const tabs = document.getElementById('productTabs');
        const relatedSection = document.getElementById('relatedSection');
        setVisible(notFound, false);
        setVisible(body, true);
        setVisible(tabs, true);
        setVisible(relatedSection, true);

        const name = pm.getLocalizedName(product);
        const description = pm.getLocalizedDescription(product);
        const shortText = pm.getLocalizedShort ? pm.getLocalizedShort(product) : '';
        const specs = pm.getLocalizedSpecs(product);

        const detailContent = (pm && typeof pm.getProductDetailContent === 'function')
            ? pm.getProductDetailContent(product)
            : null;

        const skuForCanonical = (product.sku != null && String(product.sku).trim() !== '')
            ? String(product.sku).trim()
            : String(product.id || requested).trim();
        const catLabel = getCategoryLabel(product.category);

        // Page title and SEO (EN: short brand; ZH: full company name from i18n)
        const companyName = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('company_name') : '';
        const lang = (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function')
            ? window.multiLang.getCurrentLanguage()
            : 'en';
        const brandSuffix = lang === 'zh' ? (companyName || '伟群帐篷') : 'Tent & Display Manufacturer | WaiKwan';
        document.title = `${name} | ${brandSuffix}`;
        const metaDesc = document.querySelector('meta[name="description"]');
        const descForSeo = (shortText || description || `${name}`).trim();
        if (metaDesc) {
            if (lang === 'zh') {
                metaDesc.content = descForSeo;
            } else {
                const skuPart = skuForCanonical ? `SKU ${skuForCanonical}. ` : '';
                const catPart = (catLabel && String(catLabel).trim()) ? `${catLabel}. ` : '';
                const snippet = descForSeo.length > 220 ? `${descForSeo.slice(0, 217).trim()}…` : descForSeo;
                let en = `${skuPart}${name}. ${catPart}${snippet} OEM factory quotes, custom printing, export-ready packing.`.replace(/\s+/g, ' ').trim();
                if (en.length > 320) en = `${en.slice(0, 317)}…`;
                metaDesc.content = en;
            }
        }

        // Align canonical + og:url + JSON-LD + Twitter with final www URL (single preferred origin).
        const BASE_URL = WK_PREFERRED_ORIGIN;
        const canonicalProductUrl = `${BASE_URL}/product-detail.html?sku=${encodeURIComponent(skuForCanonical)}`;
        const linkCanonical = document.querySelector('link[rel="canonical"]');
        if (linkCanonical) linkCanonical.setAttribute('href', canonicalProductUrl);
        const ogUrlMeta = document.querySelector('meta[property="og:url"]');
        if (ogUrlMeta) ogUrlMeta.setAttribute('content', canonicalProductUrl);
        const ogTypeMeta = document.querySelector('meta[property="og:type"]');
        if (ogTypeMeta) ogTypeMeta.setAttribute('content', 'product');
        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        if (ogTitleMeta) ogTitleMeta.setAttribute('content', document.title);
        const ogDescMeta = document.querySelector('meta[property="og:description"]');
        if (ogDescMeta) {
            const mc = metaDesc ? metaDesc.getAttribute('content') : '';
            ogDescMeta.setAttribute('content', mc || descForSeo);
        }
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', document.title);
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) {
            const mc2 = metaDesc ? metaDesc.getAttribute('content') : '';
            twDesc.setAttribute('content', mc2 || descForSeo);
        }
        const twUrl = document.querySelector('meta[name="twitter:url"]');
        if (twUrl) twUrl.setAttribute('content', canonicalProductUrl);

        const toAbs = (p) => (p && !/^https?:\/\//i.test(p)) ? (BASE_URL + (p.charAt(0) === '/' ? '' : '/') + p) : (p || '');
        const imgsList = Array.isArray(product.images) && product.images.length
            ? product.images.filter(Boolean)
            : (product.image ? [product.image] : []);
        const primaryImagePath = imgsList[0] || product.image || '';
        const productImageAbs = primaryImagePath ? toAbs(primaryImagePath) : '';
        if (productImageAbs) {
            const ogIm = document.querySelector('meta[property="og:image"]');
            const twIm = document.querySelector('meta[name="twitter:image"]');
            if (ogIm) ogIm.setAttribute('content', productImageAbs);
            if (twIm) twIm.setAttribute('content', productImageAbs);
        }

        // Product JSON-LD for rich snippets (url/@id match rel=canonical)
        let ld = document.getElementById('wk-product-jsonld');
        if (ld) ld.remove();
        ld = document.createElement('script');
        ld.id = 'wk-product-jsonld';
        ld.type = 'application/ld+json';
        const catForSchema = String(product.category || '').trim();
        const productLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': `${canonicalProductUrl}#product`,
            name: name,
            url: canonicalProductUrl,
            description: (shortText || description || name).substring(0, 500),
            image: productImageAbs || toAbs('images/hero/Waikwantentshero.png'),
            sku: String(product.sku || product.id || ''),
            brand: { '@type': 'Brand', name: 'WaiKwan' },
            manufacturer: {
                '@type': 'Organization',
                name: 'Guangxi WaiKwan Tent Manufacturing Co., Ltd',
                url: BASE_URL + '/'
            },
            offers: { '@type': 'Offer', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: canonicalProductUrl }
        };
        if (catForSchema) {
            productLd.category = catForSchema;
        }
        ld.textContent = JSON.stringify(productLd);
        document.head.appendChild(ld);

        // Breadcrumb: Home / Products / (Category) / Product
        const bcNav = document.querySelector('.breadcrumbs');
        if (bcNav) {
            bcNav.innerHTML = '';
            const makeSep = () => {
                const s = document.createElement('span');
                s.className = 'sep';
                s.textContent = '/';
                return s;
            };

            const aHome = document.createElement('a');
            aHome.href = 'index.html';
            aHome.setAttribute('data-translate', 'breadcrumb_home');
            aHome.textContent = '';

            const aProducts = document.createElement('a');
            aProducts.href = 'product-center.html';
            aProducts.setAttribute('data-translate', 'breadcrumb_products');
            aProducts.textContent = '';

            const aCat = document.createElement('a');
            aCat.href = `product-center.html?cat=${encodeURIComponent(product.category || '')}`;
            aCat.textContent = getCategoryLabel(product.category || '');

            let aType = null;
            if (typeof window.WK_getProductTypePageUrl === 'function') {
                const th = window.WK_getProductTypePageUrl(product);
                if (th) {
                    aType = document.createElement('a');
                    aType.href = th.startsWith('/') ? th.slice(1) : th;
                    aType.setAttribute('data-translate', 'view_type_button');
                    aType.textContent = '';
                }
            }

            const cur = document.createElement('span');
            cur.id = 'breadcrumbProduct';
            cur.textContent = name;

            bcNav.appendChild(aHome);
            bcNav.appendChild(makeSep());
            bcNav.appendChild(aProducts);
            if (product.category) {
                bcNav.appendChild(makeSep());
                bcNav.appendChild(aCat);
            }
            if (aType) {
                bcNav.appendChild(makeSep());
                bcNav.appendChild(aType);
            }
            bcNav.appendChild(makeSep());
            bcNav.appendChild(cur);
        } else {
            const bc = document.getElementById('breadcrumbProduct');
            if (bc) bc.textContent = name;
        }

        const pdpRet = document.getElementById('pdpReturnRow');
        const pdpBack = document.getElementById('pdpBackListing');
        if (pdpRet && pdpBack) {
            let listingHref = '';
            try {
                listingHref = (sessionStorage.getItem('wk_last_listing') || '').trim();
            } catch (e) {
                listingHref = '';
            }
            const fromListing = listingHref
                && !/product-detail/i.test(listingHref)
                && (/all-products/i.test(listingHref) || /product-center/i.test(listingHref));
            if (fromListing) {
                pdpBack.href = listingHref.startsWith('/') ? listingHref.slice(1) : listingHref;
            } else if (product.category) {
                pdpBack.href = `all-products.html?cat=${encodeURIComponent(product.category)}`;
            } else {
                pdpBack.href = 'all-products.html';
            }
            pdpRet.hidden = false;
        }

        // If page contains any legacy back links, normalize them
        const backLink = document.querySelector('#productNotFound a[href^="all-products.html"]');
        if (backLink) backLink.href = 'all-products.html';

        // Main text
        const nameEl = document.getElementById('productName');
        if (nameEl) nameEl.textContent = name;
        const descEl = document.getElementById('productDesc');
        if (descEl) {
            let heroDesc = (shortText || description || '').trim();
            // Tension Fabric Counter: shape note under subtitle (ZH/EN)
            if (String(product.category) === 'displays' && String(product.subcategory) === 'counter') {
                const lang = getCurrentLang();
                const shapeNote = lang === 'zh'
                    ? ' 结构类型：圆桌、椭圆桌、矩形桌。'
                    : ' Structure types: round, ellipse, and rectangular counters.';
                heroDesc = (heroDesc + shapeNote).trim();
            }
            descEl.textContent = heroDesc;
        }

        // Images
        const imageEl = document.getElementById('productImage');
        const carouselEl = document.querySelector('.image-carousel');
        const imgs = Array.isArray(product.images) && product.images.length
            ? product.images.filter(Boolean)
            : (product.image ? [product.image] : []);
        const primaryImage = imgs[0] || product.image || 'images/placeholder.png';
        if (imageEl) {
            imageEl.src = primaryImage;
            imageEl.alt = name;
            imageEl.onerror = function() {
                const icon = pm.getProductIcon ? pm.getProductIcon(product.category) : 'box';
                this.style.display = 'none';
                this.parentElement.innerHTML = `<i class="fas fa-${icon}" style="font-size:6rem;color:var(--primary-color);"></i>`;
            };
        }
        if (carouselEl) {
            carouselEl.innerHTML = '';
            const thumbList = imgs.length > 1 ? imgs.slice(0, 12) : [];
            const setActiveThumb = (activeEl) => {
                carouselEl.querySelectorAll('img').forEach((n) => n.classList.remove('is-active'));
                if (activeEl) activeEl.classList.add('is-active');
            };
            thumbList.forEach((src) => {
                const imgEl = document.createElement('img');
                imgEl.src = src;
                imgEl.alt = name;
                imgEl.loading = 'lazy';
                imgEl.setAttribute('role', 'button');
                imgEl.tabIndex = 0;
                imgEl.onerror = function() { this.style.display = 'none'; };
                imgEl.addEventListener('click', () => {
                    if (imageEl) {
                        imageEl.src = src;
                        imageEl.alt = name;
                    }
                    setActiveThumb(imgEl);
                });
                imgEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        imgEl.click();
                    }
                });
                carouselEl.appendChild(imgEl);
            });
            const firstThumb = carouselEl.querySelector('img');
            if (firstThumb) setActiveThumb(firstThumb);
        }

        // Specs + variants
        const specsEl = document.getElementById('productSpecs');
        if (specsEl) specsEl.innerHTML = '';
        const variantsEl = document.getElementById('productVariants');
        if (variantsEl) variantsEl.innerHTML = '';

        const pickRowField = (row, keys) => {
            if (!row) return '';
            const list = Array.isArray(keys) ? keys : [keys];
            for (let i = 0; i < list.length; i++) {
                const k = list[i];
                if (k == null) continue;
                if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim();
                const low = String(k).toLowerCase();
                if (row[low] != null && String(row[low]).trim() !== '') return String(row[low]).trim();
            }
            return '';
        };

        const normalizeVariantRowForRfq = (tableDef, row) => {
            const r = row || {};
            const variantModel = pickRowField(r, ['model', 'Model', 'MODEL']);
            const variantSize = pickRowField(r, ['size', 'Size', 'dimension', 'Dimension', 'dimensionZh', 'dimensionEn']);
            const variantWeight = pickRowField(r, ['weight', 'Weight']);
            const variantGraphic = pickRowField(r, ['graphic', 'Graphic', 'flagSize', 'Flag Size']);
            const variantCarton = pickRowField(r, ['carton', 'Carton', 'cartonSize', 'Carton Size', 'packing', 'Packing']);
            const bits = [variantModel, variantSize, variantWeight, variantGraphic, variantCarton].filter(Boolean);
            return {
                variantModel,
                variantSize,
                variantWeight,
                variantGraphic,
                variantCarton,
                variantMetaLabel: bits.join(' · ')
            };
        };

        const deterministicVariantKey = (prod, tableDef, row) => {
            const cols = tableDef && Array.isArray(tableDef.columns) ? tableDef.columns.map((c) => c.key).filter(Boolean) : [];
            const r = row || {};
            const payload = cols.length
                ? cols.map((k) => String(r[k] != null ? r[k] : '')).join('|')
                : JSON.stringify(r);
            return `p${prod.id}|tbl|${payload.length > 400 ? String(payload).slice(0, 400) : payload}`;
        };

        const appendRfqHeaderTh = (trh) => {
            const th = document.createElement('th');
            th.className = 'variant-rfq-cell variant-rfq-th';
            th.setAttribute('data-translate', 'rfq_variant_col');
            th.style.textAlign = 'left';
            th.style.padding = '8px';
            th.style.borderBottom = '1px solid #eaeaea';
            th.textContent = '';
            trh.appendChild(th);
        };

        const appendRfqButtonTd = (tr, prod, tableDef, row) => {
            const norm = normalizeVariantRowForRfq(tableDef, row);
            const vk = deterministicVariantKey(prod, tableDef, row);
            const td = document.createElement('td');
            td.className = 'variant-rfq-cell';
            td.style.padding = '8px';
            td.style.borderBottom = '1px solid #f3f3f3';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'variant-rfq-btn';
            if (window.wkI18n && typeof window.wkI18n.t === 'function') {
                const al = window.wkI18n.t('add_to_rfq');
                if (al) btn.setAttribute('aria-label', al);
            }
            btn.innerHTML = '<i class="fas fa-cart-plus" aria-hidden="true"></i>';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const payload = Object.assign({ variantKey: vk }, norm);
                if (typeof window.addVariantToRfqCart === 'function') {
                    window.addVariantToRfqCart(prod, payload);
                }
            });
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
            td.appendChild(btn);
            tr.appendChild(td);
        };

        const renderVariantTable = (prod, tableDef) => {
            if (!tableDef || !prod) return null;
            const lang = getCurrentLang();

            const title = (lang === 'zh')
                ? (tableDef.titleZh || tableDef.title || '')
                : (tableDef.titleEn || tableDef.title || '');
            const titleKey = tableDef.titleKey;

            const columns = Array.isArray(tableDef.columns) ? tableDef.columns : null;
            const headers = Array.isArray(tableDef.headers)
                ? tableDef.headers
                : (lang === 'zh' ? tableDef.headersZh : tableDef.headersEn);
            const rows = Array.isArray(tableDef.rows) ? tableDef.rows : [];

            if ((!columns || columns.length === 0) && (!headers || headers.length === 0)) return null;

            const wrap = document.createElement('div');

            if (titleKey || title) {
                const h3 = document.createElement('h3');
                if (titleKey) {
                    h3.setAttribute('data-translate', titleKey);
                    h3.textContent = '';
                } else {
                    h3.textContent = title;
                }
                wrap.appendChild(h3);
            }

            const tbl = document.createElement('table');
            tbl.className = 'variants-table';
            tbl.style.width = '100%';
            tbl.style.borderCollapse = 'collapse';

            const thead = document.createElement('thead');
            const trh = document.createElement('tr');

            if (columns) {
                columns.forEach((c) => {
                    const th = document.createElement('th');
                    th.style.textAlign = 'left';
                    th.style.padding = '8px';
                    th.style.borderBottom = '1px solid #eaeaea';
                    th.textContent = (lang === 'zh') ? (c.labelZh || c.label || c.key || '') : (c.labelEn || c.label || c.key || '');
                    trh.appendChild(th);
                });
            } else {
                (headers || []).forEach((h) => {
                    const th = document.createElement('th');
                    th.style.textAlign = 'left';
                    th.style.padding = '8px';
                    th.style.borderBottom = '1px solid #eaeaea';
                    th.textContent = h;
                    trh.appendChild(th);
                });
            }
            appendRfqHeaderTh(trh);

            thead.appendChild(trh);
            tbl.appendChild(thead);

            const tbody = document.createElement('tbody');
            rows.forEach((r) => {
                const tr = document.createElement('tr');
                if (columns) {
                    columns.forEach((c) => {
                        const td = document.createElement('td');
                        td.style.padding = '8px';
                        td.style.borderBottom = '1px solid #f3f3f3';
                        const val = r && (r[c.key] ?? r[String(c.key).toLowerCase()]);
                        td.textContent = val == null ? '' : String(val);
                        tr.appendChild(td);
                    });
                } else {
                    (headers || []).forEach((h) => {
                        const td = document.createElement('td');
                        td.style.padding = '8px';
                        td.style.borderBottom = '1px solid #f3f3f3';
                        const key = (h || '').toString();
                        const altKey = key.replace(/\s+/g, '');
                        const lowKey = key.toLowerCase();
                        const val = r && (r[key] ?? r[altKey] ?? r[lowKey]);
                        td.textContent = val == null ? '' : String(val);
                        tr.appendChild(td);
                    });
                }
                appendRfqButtonTd(tr, prod, tableDef, r);
                tbody.appendChild(tr);
            });
            tbl.appendChild(tbody);

            wrap.appendChild(tbl);
            return wrap;
        };

        // Custom variants/spec table(s)
        if (variantsEl && Array.isArray(product.variantTables) && product.variantTables.length > 0) {
            product.variantTables.forEach((t) => {
                const node = renderVariantTable(product, t);
                if (node) variantsEl.appendChild(node);
            });
        } else if (variantsEl && product.variantTable && Array.isArray(product.variantTable.headers) && Array.isArray(product.variantTable.rows)) {
            const node = renderVariantTable(product, {
                titleKey: 'models_and_specs',
                headers: product.variantTable.headers,
                rows: product.variantTable.rows
            });
            if (node) variantsEl.appendChild(node);
        } else if (variantsEl && product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
            const tableTitle = document.createElement('h3');
            tableTitle.setAttribute('data-translate', 'models_and_specs');
            tableTitle.textContent = '';

            const tbl = document.createElement('table');
            tbl.className = 'variants-table';
            tbl.style.width = '100%';
            tbl.style.borderCollapse = 'collapse';

            const thead = document.createElement('thead');
            const trh = document.createElement('tr');
            [
                { key: 'spec_col_model' },
                { key: 'spec_col_size' },
                { key: 'spec_col_weight' },
            ].forEach(({ key }) => {
                const th = document.createElement('th');
                th.style.textAlign = 'left';
                th.style.padding = '8px';
                th.style.borderBottom = '1px solid #eaeaea';
                th.setAttribute('data-translate', key);
                th.textContent = '';
                trh.appendChild(th);
            });
            appendRfqHeaderTh(trh);
            thead.appendChild(trh);
            tbl.appendChild(thead);

            const tbody = document.createElement('tbody');
            const variantSimpleDef = {
                columns: [
                    { key: 'model' },
                    { key: 'size' },
                    { key: 'weight' }
                ]
            };
            product.variants.forEach((v) => {
                const tr = document.createElement('tr');
                const tdModel = document.createElement('td');
                tdModel.style.padding = '8px';
                tdModel.style.borderBottom = '1px solid #f3f3f3';
                tdModel.textContent = v.model || '';
                const tdSize = document.createElement('td');
                tdSize.style.padding = '8px';
                tdSize.style.borderBottom = '1px solid #f3f3f3';
                tdSize.textContent = v.size || '';
                const tdWeight = document.createElement('td');
                tdWeight.style.padding = '8px';
                tdWeight.style.borderBottom = '1px solid #f3f3f3';
                tdWeight.textContent = v.weight || '';
                tr.appendChild(tdModel);
                tr.appendChild(tdSize);
                tr.appendChild(tdWeight);
                appendRfqButtonTd(tr, product, variantSimpleDef, v);
                tbody.appendChild(tr);
            });
            tbl.appendChild(tbody);
            variantsEl.appendChild(tableTitle);
            variantsEl.appendChild(tbl);
        }

        // Catalog reference image (产品画册参考) — catalog p.17.png; all 桌/椅/凳/厕所 PDPs use same source
        const FURNITURE_CATALOG_BROCHURE = encodeURI('images/广西伟群帐篷制造有限公司2025allpagepng/17.png');
        const isFurnitureTableChairCat = product
            && String(product.category) === 'furniture'
            && String(product.subcategory) === 'table-chair-stool-toilet';
        const brochureSrc = (product.referenceImage && String(product.referenceImage).trim())
            || (isFurnitureTableChairCat ? FURNITURE_CATALOG_BROCHURE : '');
        const brochureSourceKey = (product.referenceSourceKey && String(product.referenceSourceKey).trim())
            || 'view_type_brochure_source_17';

        if (variantsEl && brochureSrc) {
            const block = document.createElement('div');
            block.className = 'pdp-brochure-ref';
            block.style.marginTop = '18px';

            const title = document.createElement('h3');
            title.setAttribute('data-translate', 'view_type_brochure_ref');
            title.textContent = '';
            block.appendChild(title);

            const caption = document.createElement('div');
            caption.style.marginTop = '4px';
            caption.style.opacity = '0.85';
            caption.style.fontSize = '13px';
            const capZh = document.createElement('span');
            capZh.className = 'zh';
            capZh.setAttribute('data-translate', brochureSourceKey);
            const capEn = document.createElement('span');
            capEn.className = 'en';
            capEn.setAttribute('data-translate', brochureSourceKey);
            caption.appendChild(capZh);
            caption.appendChild(capEn);
            block.appendChild(caption);

            const img = document.createElement('img');
            img.src = brochureSrc;
            img.setAttribute('data-translate-alt', 'view_type_brochure_ref');
            img.loading = 'lazy';
            img.style.display = 'block';
            img.style.width = '100%';
            img.style.maxWidth = '920px';
            img.style.marginTop = '10px';
            img.style.border = '1px solid var(--border-color, #eee)';
            img.style.borderRadius = '10px';
            img.style.cursor = 'zoom-in';
            img.onerror = function() { this.style.display = 'none'; };
            img.addEventListener('click', () => {
                try {
                    window.open(brochureSrc, '_blank', 'noopener');
                } catch (e) {
                    // ignore
                }
            });
            block.appendChild(img);

            variantsEl.appendChild(block);
            if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                window.multiLang.translatePage();
            }
        }

        const hasSpecObjects = product.specsZh || product.specsEn;
        if (specsEl) {
            if (hasSpecObjects) {
                const lang = getCurrentLang();
                const specZh = product.specsZh && typeof product.specsZh === 'object' ? product.specsZh : null;
                const specEn = product.specsEn && typeof product.specsEn === 'object' ? product.specsEn : null;
                // Chinese specs often use keys like 尺寸 / 光源 (not Color/Size) — render those rows instead of empty cells
                let rows;
                if (lang === 'zh' && specZh && Object.keys(specZh).length > 0) {
                    rows = [
                        ['Model/型号', product.model || ''],
                        ['Name/名称', name || ''],
                        ...Object.entries(specZh).map(([k, v]) => [k, String(v == null ? '' : v)])
                    ];
                } else {
                    const specObj = (lang === 'zh')
                        ? { ...(specEn || {}), ...(specZh || {}) }
                        : { ...(specZh || {}), ...(specEn || {}) };
                    rows = [
                        ['Model/型号', product.model || ''],
                        ['Name/名称', name || ''],
                        ['Color/颜色', specObj.Color || specObj.color || specObj['颜色'] || ''],
                        ['Size/尺寸', specObj.Size || specObj.size || specObj['尺寸'] || ''],
                        ['Weight/重量', specObj.Weight || specObj.weight || specObj['重量'] || ''],
                        ['Carton/外箱', specObj.Carton || specObj.carton || specObj['外箱'] || ''],
                        ['Quantity/数量', specObj.Quantity || specObj.quantity || specObj['数量'] || '']
                    ];
                }

                const table = document.createElement('table');
                table.className = 'pdp-spec-table';
                table.style.borderCollapse = 'collapse';
                table.style.width = '100%';
                rows.forEach(([label, val]) => {
                    const tr = document.createElement('tr');
                    const th = document.createElement('th');
                    th.style.textAlign = 'left';
                    th.style.padding = '6px 8px';
                    th.style.width = '36%';
                    th.style.borderBottom = '1px solid #eee';
                    th.textContent = label;
                    const td = document.createElement('td');
                    td.style.padding = '6px 8px';
                    td.style.borderBottom = '1px solid #eee';
                    td.textContent = val || (getCurrentLang() === 'zh' ? '待补充' : 'TBD');
                    tr.appendChild(th);
                    tr.appendChild(td);
                    table.appendChild(tr);
                });
                specsEl.appendChild(table);
                const tabDesc = document.getElementById('tab-desc');
                if (tabDesc) {
                    if (detailContent) {
                        let descHtml = renderBilingual(detailContent.description.zh, detailContent.description.en);
                        if (detailContent.tabDescAppendHtml) descHtml += detailContent.tabDescAppendHtml;
                        tabDesc.innerHTML = descHtml;
                    } else {
                        tabDesc.innerHTML = `<p>${escapeHtml((description || shortText || '').trim())}</p>`;
                    }
                }
                const tabSpecs = document.getElementById('tab-specs');
                if (tabSpecs) {
                    const extra = detailContent ? renderBilingual(detailContent.technical.zh, detailContent.technical.en) : '';
                    tabSpecs.innerHTML = `${table.outerHTML}${extra ? `<div style="margin-top:14px;">${extra}</div>` : ''}`;
                }
            } else {
                (specs || []).forEach(s => {
                    const li = document.createElement('li');
                    li.textContent = `• ${s}`;
                    specsEl.appendChild(li);
                });
                const tabDesc = document.getElementById('tab-desc');
                if (tabDesc) {
                    if (detailContent) {
                        let descHtml = renderBilingual(detailContent.description.zh, detailContent.description.en);
                        if (detailContent.tabDescAppendHtml) descHtml += detailContent.tabDescAppendHtml;
                        tabDesc.innerHTML = descHtml;
                    } else {
                        tabDesc.innerHTML = `<p>${escapeHtml((description || shortText || '').trim())}</p>`;
                    }
                }
                const tabSpecs = document.getElementById('tab-specs');
                if (tabSpecs) {
                    const listHtml = (specs && specs.length > 0)
                        ? `<ul>${specs.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
                        : `<p data-translate="no_specs">暂无技术参数</p>`;
                    const extra = detailContent ? renderBilingual(detailContent.technical.zh, detailContent.technical.en) : '';
                    tabSpecs.innerHTML = `${listHtml}${extra ? `<div style="margin-top:14px;">${extra}</div>` : ''}`;
                }
            }
        }

        // Applications
        const applications = pm.getApplicationScenarios ? pm.getApplicationScenarios(product.category) : [];
        const tabApps = document.getElementById('tab-apps');
        if (tabApps) {
            if (detailContent) {
                tabApps.innerHTML = renderBilingual(detailContent.applications.zh, detailContent.applications.en);
            } else {
                tabApps.innerHTML = (applications && applications.length > 0)
                    ? `<ul>${applications.map(app => `<li>${escapeHtml(app)}</li>`).join('')}</ul>`
                    : `<p data-translate="default_applications">适用于各种户外活动和展览展示场景</p>`;
            }
        }

        // Download
        const tabDownload = document.getElementById('tab-download');
        if (tabDownload) {
            tabDownload.innerHTML = product.pdf
                ? `<a href="${product.pdf}" target="_blank" class="btn btn-primary" data-translate="btn_download_pdf">下载PDF</a>`
                : `<p data-translate="download_contact_us">请联系我们获取详细产品资料</p>`;
        }

        // Buttons
        const btnQuote = document.getElementById('btnQuote');
        const btnDownload = document.getElementById('btnDownload');
        const btnCart = document.getElementById('btnCart');
        if (btnQuote) {
            btnQuote.onclick = () => {
                try {
                    const urlModel = (new URLSearchParams(window.location.search)).get('model');
                    const selectedModel = urlModel || (product.variants && product.variants[0] && product.variants[0].model) || product.model || '';
                    const prefill = { id: product.id, model: selectedModel, name };
                    localStorage.setItem('quote_prefill', JSON.stringify(prefill));
                } catch (e) {
                    // ignore
                }
                if (pm.openInquiryModal) pm.openInquiryModal(product);
            };
        }
        if (btnDownload) {
            btnDownload.onclick = () => {
                if (pm.openPdfModal) pm.openPdfModal(product);
            };
        }
        if (btnCart) {
            btnCart.onclick = () => {
                if (pm.addToCart) pm.addToCart(product);
            };
        }

        // Tabs: attach once
        if (!attachedOnce) {
            attachedOnce = true;
            document.querySelectorAll('.tab').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab, .tab-panel').forEach(el => {
                        el.classList.remove('active');
                    });
                    btn.classList.add('active');
                    const tabId = 'tab-' + btn.dataset.tab;
                    const panel = document.getElementById(tabId);
                    if (panel) panel.classList.add('active');
                });
            });
        }

        // Related products (min 4: same category first, then fill from other categories)
        const sameCat = pm.products.filter((p) => p.category === product.category && String(p.id) !== String(product.id));
        const pool = pm.products.filter((p) => String(p.id) !== String(product.id));
        const related = [...sameCat.slice(0, 4)];
        let ri = 0;
        while (related.length < 4 && ri < pool.length) {
            const p = pool[ri++];
            if (!related.some((x) => String(x.id) === String(p.id))) related.push(p);
        }
        const grid = document.getElementById('relatedGrid');
        if (grid) {
            grid.innerHTML = '';
            if (related.length > 0) {
                related.forEach(p => {
                    const productElement = pm.createProductElement ? pm.createProductElement(p) : null;
                    if (productElement) grid.appendChild(productElement);
                });
            } else {
                grid.innerHTML = '<p data-translate="no_related_products"></p>';
            }
        }

        // Apply translations for any injected nodes
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    };

    const rerender = () => {
        waitForProductManager((pm) => renderDetail(pm));
    };

    document.addEventListener('languageChanged', () => {
        setTimeout(rerender, 50);
    });

    rerender();
});

