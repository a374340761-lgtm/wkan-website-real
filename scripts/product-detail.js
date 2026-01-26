// Universal product detail page controller (product-detail.html?id=...)
document.addEventListener('DOMContentLoaded', () => {
    let attachedOnce = false;

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

    const getLocalized = (product, field) => {
        const lang = getCurrentLang();
        const suffixMap = {
            zh: '',
            en: 'En',
            ja: 'Ja',
            ko: 'Ko'
        };

        const suffix = suffixMap[lang] ?? '';
        const baseKey = field;
        const localizedKey = suffix ? `${baseKey}${suffix}` : baseKey;

        return product[localizedKey] || product[baseKey] || '';
    };

    const getLocalizedSpecs = (product) => {
        const lang = getCurrentLang();
        if (lang === 'en') return product.specsEn || product.specs || [];
        if (lang === 'ja') return product.specsJa || product.specs || [];
        if (lang === 'ko') return product.specsKo || product.specs || [];
        return product.specs || [];
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

    const renderNotFound = () => {
        const notFound = document.getElementById('productNotFound');
        const body = document.getElementById('productDetailBody');
        const tabs = document.getElementById('productTabs');
        const related = document.getElementById('relatedSection');
        setVisible(notFound, true);
        setVisible(body, false);
        setVisible(tabs, false);
        setVisible(related, false);

        const bc = document.getElementById('breadcrumbProduct');
        if (bc) bc.textContent = '';

        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    };

    const renderDetail = (pm) => {
        const params = new URLSearchParams(location.search);
        const productId = params.get('id');
        if (!pm || !productId) {
            renderNotFound();
            return;
        }

        const product = pm.products.find(p => String(p.id) === String(productId));
        if (!product) {
            renderNotFound();
            return;
        }

        const notFound = document.getElementById('productNotFound');
        const body = document.getElementById('productDetailBody');
        const tabs = document.getElementById('productTabs');
        const relatedSection = document.getElementById('relatedSection');
        setVisible(notFound, false);
        setVisible(body, true);
        setVisible(tabs, true);
        setVisible(relatedSection, true);

        const name = getLocalized(product, 'name');
        const description = getLocalized(product, 'description');
        const shortText = getLocalized(product, 'short');
        const specs = getLocalizedSpecs(product);

        const detailContent = (pm && typeof pm.getProductDetailContent === 'function')
            ? pm.getProductDetailContent(product)
            : null;

        // Page title and SEO
        const companyName = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('company_name') : '';
        document.title = companyName ? `${name} - ${companyName}` : `${name}`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = (shortText || description || `${name}`);
        }

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
            aCat.href = `all-products.html?cat=${encodeURIComponent(product.category || '')}`;
            aCat.textContent = product.category || '';

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
            bcNav.appendChild(makeSep());
            bcNav.appendChild(cur);
        } else {
            const bc = document.getElementById('breadcrumbProduct');
            if (bc) bc.textContent = name;
        }

        // Back-to-products link (if present)
        const backLink = document.querySelector('#productNotFound a[href^="all-products.html"]');
        if (backLink) {
            backLink.href = product.category
                ? `all-products.html?cat=${encodeURIComponent(product.category)}`
                : 'all-products.html';
        }

        // Main text
        const nameEl = document.getElementById('productName');
        if (nameEl) nameEl.textContent = name;
        const descEl = document.getElementById('productDesc');
        if (descEl) descEl.textContent = (shortText || description || '').trim();

        // Images
        const imageEl = document.getElementById('productImage');
        const carouselEl = document.querySelector('.image-carousel');
        if (imageEl) {
            const primaryImage = product.image || (product.images && product.images[0]) || 'images/placeholder.png';
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
            const imgs = Array.isArray(product.images) ? product.images : [];
            if (imgs.length > 1) {
                imgs.forEach(img => {
                    const imgEl = document.createElement('img');
                    imgEl.src = img;
                    imgEl.alt = name;
                    imgEl.loading = 'lazy';
                    imgEl.onerror = function() { this.style.display = 'none'; };
                    carouselEl.appendChild(imgEl);
                });
            }
        }

        // Specs + variants
        const specsEl = document.getElementById('productSpecs');
        if (specsEl) specsEl.innerHTML = '';
        const variantsEl = document.getElementById('productVariants');
        if (variantsEl) variantsEl.innerHTML = '';

        // Custom variants/spec table (e.g., RaceGate)
        if (variantsEl && product.variantTable && Array.isArray(product.variantTable.headers) && Array.isArray(product.variantTable.rows)) {
            const tableTitle = document.createElement('h3');
            tableTitle.setAttribute('data-translate', 'models_and_specs');
            tableTitle.textContent = '';

            const headers = product.variantTable.headers;
            const rows = product.variantTable.rows;

            const tbl = document.createElement('table');
            tbl.className = 'variants-table';
            tbl.style.width = '100%';
            tbl.style.borderCollapse = 'collapse';

            const thead = document.createElement('thead');
            const trh = document.createElement('tr');
            headers.forEach((h) => {
                const th = document.createElement('th');
                th.style.textAlign = 'left';
                th.style.padding = '8px';
                th.style.borderBottom = '1px solid #eaeaea';
                th.textContent = h;
                trh.appendChild(th);
            });
            thead.appendChild(trh);
            tbl.appendChild(thead);

            const tbody = document.createElement('tbody');
            rows.forEach((r) => {
                const tr = document.createElement('tr');
                headers.forEach((h) => {
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
                tbody.appendChild(tr);
            });
            tbl.appendChild(tbody);

            variantsEl.appendChild(tableTitle);
            variantsEl.appendChild(tbl);
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
            thead.appendChild(trh);
            tbl.appendChild(thead);

            const tbody = document.createElement('tbody');
            product.variants.forEach(v => {
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
                tbody.appendChild(tr);
            });
            tbl.appendChild(tbody);
            variantsEl.appendChild(tableTitle);
            variantsEl.appendChild(tbl);
        }

        const hasSpecObjects = product.specsZh || product.specsEn;
        if (specsEl) {
            if (hasSpecObjects) {
                const lang = getCurrentLang();
                const specObj = (lang === 'zh') ? (product.specsZh || {}) : (product.specsEn || product.specsZh || {});
                const rows = [
                    ['Model/型号', product.model || ''],
                    ['Name/名称', name || ''],
                    ['Color/颜色', specObj.Color || specObj.color || ''],
                    ['Size/尺寸', specObj.Size || specObj.size || ''],
                    ['Weight/重量', specObj.Weight || specObj.weight || ''],
                    ['Carton/外箱', specObj.Carton || specObj.carton || ''],
                    ['Quantity/数量', specObj.Quantity || specObj.quantity || '']
                ];

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
                        tabDesc.innerHTML = renderBilingual(detailContent.description.zh, detailContent.description.en);
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
                        tabDesc.innerHTML = renderBilingual(detailContent.description.zh, detailContent.description.en);
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

        // Related products
        const related = pm.products
            .filter(p => p.category === product.category && String(p.id) !== String(product.id))
            .slice(0, 4);
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

