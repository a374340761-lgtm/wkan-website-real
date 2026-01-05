// 产品详情页逻辑
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const productId = params.get('id');
    
    if (!productId) {
        // 如果没有产品ID，跳转到产品列表页
        window.location.href = 'product-center.html';
        return;
    }

    // 等待 productManager 初始化
    const initDetail = () => {
        const pm = window.productManager;
        if (!pm || !pm.products) {
            setTimeout(initDetail, 100);
            return;
        }

        const product = pm.products.find(p => p.id == productId);
        if (!product) {
            // 产品不存在，跳转到产品列表页
            window.location.href = 'product-center.html';
            return;
        }

        // 获取当前语言
        const currentLang = window.multiLang ? window.multiLang.getCurrentLanguage() : 'en';
        
        // 获取本地化文本
        const getName = (p) => {
            const nameMap = {
                zh: p.name,
                en: p.nameEn || p.name,
                ja: p.nameJa || p.name,
                ko: p.nameKo || p.name
            };
            return nameMap[currentLang] || p.name;
        };

        const getDesc = (p) => {
            const descMap = {
                zh: p.description,
                en: p.descriptionEn || p.description,
                ja: p.descriptionJa || p.description,
                ko: p.descriptionKo || p.description
            };
            return descMap[currentLang] || p.description;
        };

        const getSpecs = (p) => {
            const specsMap = {
                zh: p.specs,
                en: p.specsEn || p.specs,
                ja: p.specsJa || p.specs,
                ko: p.specsKo || p.specs
            };
            return specsMap[currentLang] || p.specs || [];
        };

        const name = getName(product);
        const description = getDesc(product);
        const specs = getSpecs(product);

        // 更新页面标题和SEO
        document.title = `${name} - 广西伟群帐篷制造有限公司`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = description || `${name} - 专业户外家具制造`;
        }

        // 更新面包屑（Home / Products / Accessories / <product>）并添加返回按钮
        const bcNav = document.querySelector('.breadcrumbs');
        if (bcNav) {
            bcNav.innerHTML = '';
            const aHome = document.createElement('a'); aHome.href = 'index.html'; aHome.textContent = (currentLang && currentLang.startsWith('zh')) ? '首页' : 'Home';
            const aProd = document.createElement('a'); aProd.href = 'product-center.html'; aProd.textContent = (currentLang && currentLang.startsWith('zh')) ? '产品中心' : 'Products';
            const aAcc = document.createElement('a'); aAcc.href = 'products-accessories.html'; aAcc.textContent = (currentLang && currentLang.startsWith('zh')) ? '配件' : 'Accessories';
            const sep = (t) => { const s = document.createElement('span'); s.className = 'sep'; s.textContent = '/'; return s; };
            bcNav.appendChild(aHome); bcNav.appendChild(sep()); bcNav.appendChild(aProd); bcNav.appendChild(sep()); bcNav.appendChild(aAcc); bcNav.appendChild(sep());
            const spanCur = document.createElement('span'); spanCur.id = 'breadcrumbProduct'; spanCur.textContent = name; bcNav.appendChild(spanCur);

            // add Back to Accessories button
            if (!document.getElementById('backToAccessoriesBtn')) {
                const backBtn = document.createElement('a');
                backBtn.id = 'backToAccessoriesBtn';
                backBtn.href = 'products-accessories.html';
                backBtn.className = 'btn btn-secondary';
                backBtn.style.marginLeft = '12px';
                backBtn.textContent = (currentLang && currentLang.startsWith('zh')) ? '返回配件' : 'Back to Accessories';
                bcNav.parentNode.insertBefore(backBtn, bcNav.nextSibling);
            }
        } else {
            const el = document.getElementById('breadcrumbProduct'); if (el) el.textContent = name;
        }

        // 更新产品信息
        document.getElementById('productName').textContent = name;
        document.getElementById('productDesc').textContent = description || '';

        // (legacy options UI removed)

        // 产品图片
        const imageEl = document.getElementById('productImage');
        const carouselEl = document.querySelector('.image-carousel');
        if (product.image) {
            imageEl.src = product.image;
            imageEl.alt = name;
            imageEl.onerror = function() {
                const icon = pm.getProductIcon(product.category);
                this.style.display = 'none';
                this.parentElement.innerHTML = `<i class="fas fa-${icon}" style="font-size:6rem;color:var(--primary-color);"></i>`;
            };

            // 添加轮播图片
            if (product.images && product.images.length > 1) {
                carouselEl.innerHTML = '';
                product.images.forEach(img => {
                    const imgEl = document.createElement('img');
                    imgEl.src = img;
                    imgEl.alt = name;
                    imgEl.loading = 'lazy';
                    imgEl.onerror = function() {
                        this.style.display = 'none';
                    };
                    carouselEl.appendChild(imgEl);
                });
            }
        } else {
            const icon = pm.getProductIcon(product.category);
            imageEl.style.display = 'none';
            imageEl.parentElement.innerHTML = `<i class="fas fa-${icon}" style="font-size:6rem;color:var(--primary-color);"></i>`;
        }

        // 规格列表 — 优先使用 specsZh/specsEn 对象渲染表格，否则回退到 specs 数组
        const specsEl = document.getElementById('productSpecs');
        specsEl.innerHTML = '';
        // Variants table (Models & Specifications)
        const variantsEl = document.getElementById('productVariants');
        if (variantsEl) variantsEl.innerHTML = '';
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
            const tableTitle = document.createElement('h3');
            tableTitle.textContent = (currentLang && currentLang.startsWith('zh')) ? '型号与参数' : 'Models & Specifications';
            const tbl = document.createElement('table');
            tbl.className = 'variants-table';
            tbl.style.width = '100%';
            tbl.style.borderCollapse = 'collapse';
            const thead = document.createElement('thead');
            const trh = document.createElement('tr');
            ['Model / 型号', 'Size / 尺寸', 'Weight / 重量'].forEach(h => {
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
            product.variants.forEach(v => {
                const tr = document.createElement('tr');
                const tdModel = document.createElement('td'); tdModel.style.padding = '8px'; tdModel.style.borderBottom = '1px solid #f3f3f3'; tdModel.textContent = v.model || '';
                const tdSize = document.createElement('td'); tdSize.style.padding = '8px'; tdSize.style.borderBottom = '1px solid #f3f3f3'; tdSize.textContent = v.size || '';
                const tdWeight = document.createElement('td'); tdWeight.style.padding = '8px'; tdWeight.style.borderBottom = '1px solid #f3f3f3'; tdWeight.textContent = v.weight || '';
                tr.appendChild(tdModel); tr.appendChild(tdSize); tr.appendChild(tdWeight);
                tbody.appendChild(tr);
            });
            tbl.appendChild(tbody);
            if (variantsEl) {
                variantsEl.appendChild(tableTitle);
                variantsEl.appendChild(tbl);
            }
        }
        const hasSpecObjects = product.specsZh || product.specsEn;
        if (hasSpecObjects) {
            const specObj = (currentLang && currentLang.startsWith('zh')) ? (product.specsZh || {}) : (product.specsEn || {});

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
                td.textContent = val || ((currentLang && currentLang.startsWith('zh')) ? '待补充' : 'TBD');
                tr.appendChild(th);
                tr.appendChild(td);
                table.appendChild(tr);
            });

            specsEl.appendChild(table);
            document.getElementById('tab-desc').innerHTML = `<p>${description || ''}</p>`;
            document.getElementById('tab-specs').innerHTML = table.outerHTML;
        } else {
            // fallback to old array rendering
            (specs || []).forEach(s => {
                const li = document.createElement('li');
                li.textContent = `• ${s}`;
                specsEl.appendChild(li);
            });
            document.getElementById('tab-desc').innerHTML = `<p>${description || ''}</p>`;
            const specsHtml = specs && specs.length > 0
                ? `<ul>${specs.map(s => `<li>${s}</li>`).join('')}</ul>`
                : '<p>暂无技术参数</p>';
            document.getElementById('tab-specs').innerHTML = specsHtml;
        }

        // 应用场景
        const applications = pm.getApplicationScenarios(product.category);
        const appsHtml = applications && applications.length > 0
            ? `<ul>${applications.map(app => `<li>${app}</li>`).join('')}</ul>`
            : '<p>适用于各种户外活动和展览展示场景</p>';
        document.getElementById('tab-apps').innerHTML = appsHtml;

        // 资料下载
        const downloadHtml = product.pdf 
            ? `<a href="${product.pdf}" target="_blank" class="btn btn-primary" data-translate="btn_download_pdf">下载PDF</a>`
            : '<p>请联系我们获取详细产品资料</p>';
        document.getElementById('tab-download').innerHTML = downloadHtml;

        // 操作按钮
        document.getElementById('btnQuote').onclick = () => {
            try {
                const urlModel = (new URLSearchParams(window.location.search)).get('model');
                const selectedModel = urlModel || (product.variants && product.variants[0] && product.variants[0].model) || product.model || '';
                const prefill = {
                    id: product.id,
                    model: selectedModel,
                    name: name
                };
                localStorage.setItem('quote_prefill', JSON.stringify(prefill));
            } catch (e) {
                // ignore
            }
            pm.openInquiryModal(product);
        };
        
        document.getElementById('btnDownload').onclick = () => {
            pm.openPdfModal(product);
        };
        
        document.getElementById('btnCart').onclick = () => {
            pm.addToCart(product);
        };

        // 标签页切换
        document.querySelectorAll('.tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab, .tab-panel').forEach(el => {
                    el.classList.remove('active');
                });
                btn.classList.add('active');
                const tabId = 'tab-' + btn.dataset.tab;
                const panel = document.getElementById(tabId);
                if (panel) {
                    panel.classList.add('active');
                }
            });
        });

        // 相关产品
        const related = pm.products
            .filter(p => p.category === product.category && p.id != product.id)
            .slice(0, 4);

        const grid = document.getElementById('relatedGrid');
        grid.innerHTML = '';
        
        if (related.length > 0) {
            related.forEach(p => {
                const productElement = pm.createProductElement(p);
                grid.appendChild(productElement);
            });
        } else {
            grid.innerHTML = '<p>暂无相关产品</p>';
        }

        // 应用多语言翻译
        if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
            window.multiLang.translatePage();
        }
    };

    // 监听语言变化
    document.addEventListener('languageChanged', () => {
        // 重新初始化以更新语言
        const params = new URLSearchParams(location.search);
        const productId = params.get('id');
        if (productId) {
            setTimeout(initDetail, 100);
        }
    });

    // 开始初始化
    initDetail();
});

