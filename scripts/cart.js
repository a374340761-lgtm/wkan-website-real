/**
 * B2B RFQ / inquiry cart — single source of truth for line items (no checkout, no payment).
 * Storage: wk_rfq_cart_v1 → { v: 1, items: RfqLineItem[] }
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'wk_rfq_cart_v1';
    const LEGACY_KEYS = ['shoppingCart', 'cart'];
    const SCHEMA_VERSION = 1;

    function hasCjk(s) {
        return /[\u3400-\u9FFF]/.test(String(s || ''));
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function buildDetailUrl(product) {
        if (product && String(product.customRfqUrl || '').trim()) {
            try {
                const raw = String(product.customRfqUrl).trim();
                const u = new URL(raw, window.location.href);
                return u.pathname + u.search + (u.hash || '');
            } catch {
                return String(product.customRfqUrl).trim();
            }
        }
        const sku = String(product && (product.sku != null ? product.sku : product.id) || '').trim();
        if (!sku) return '';
        try {
            const u = new URL('product-detail.html', window.location.href);
            u.searchParams.set('sku', sku);
            return u.pathname + u.search;
        } catch {
            return `product-detail.html?sku=${encodeURIComponent(sku)}`;
        }
    }

    /**
     * Normalize product from ProductManager catalog into a line item snapshot.
     */
    function lineItemFromProduct(product, quantity) {
        if (!product || product.id == null) return null;
        const legacyName = String(product.name || '').trim();
        let nameZh = String(product.nameZh || '').trim();
        let nameEn = String(product.nameEn || '').trim();
        if (!nameZh && hasCjk(legacyName)) nameZh = legacyName;
        if (!nameEn && legacyName && !hasCjk(legacyName)) nameEn = legacyName;
        if (!nameZh) nameZh = nameEn || '产品';
        if (!nameEn) nameEn = nameZh || 'Product';

        const sku = String(product.sku != null && product.sku !== '' ? product.sku : product.id).trim();
        const model = String(product.model || '').trim();
        const image = String(product.image || '').trim();
        const category = String(product.category || '').trim();
        const url = buildDetailUrl(product);

        return {
            id: product.id,
            sku,
            model,
            nameZh,
            nameEn,
            image,
            category,
            url,
            quantity: Math.max(1, parseInt(quantity, 10) || 1),
            variantKey: '',
            variantModel: '',
            variantSize: '',
            variantWeight: '',
            variantGraphic: '',
            variantCarton: '',
            variantMetaLabel: ''
        };
    }

    function matchVariantKey(a, b) {
        return String(a || '') === String(b || '');
    }

    function normalizeLineItem(raw) {
        if (!raw || raw.id == null) return null;
        const qty = Math.max(1, parseInt(raw.quantity, 10) || 1);
        const base = {
            id: raw.id,
            sku: String(raw.sku != null && raw.sku !== '' ? raw.sku : raw.id).trim(),
            model: String(raw.model || '').trim(),
            nameZh: String(raw.nameZh || '').trim(),
            nameEn: String(raw.nameEn || '').trim(),
            image: String(raw.image || '').trim(),
            category: String(raw.category || '').trim(),
            url: String(raw.url || '').trim(),
            quantity: qty,
            variantKey: raw.variantKey != null ? String(raw.variantKey) : '',
            variantModel: String(raw.variantModel || '').trim(),
            variantSize: String(raw.variantSize || '').trim(),
            variantWeight: String(raw.variantWeight || '').trim(),
            variantGraphic: String(raw.variantGraphic || '').trim(),
            variantCarton: String(raw.variantCarton || '').trim(),
            variantMetaLabel: String(raw.variantMetaLabel || '').trim()
        };
        const legacyName = String(raw.name || '').trim();
        if (!base.nameZh && hasCjk(legacyName)) base.nameZh = legacyName;
        if (!base.nameEn && legacyName && !hasCjk(legacyName)) base.nameEn = legacyName;
        if (!base.nameZh) base.nameZh = base.nameEn || '产品';
        if (!base.nameEn) base.nameEn = base.nameZh || 'Product';
        return base;
    }

    function buildDefaultVariantKey(product, vd) {
        const m = vd || {};
        const parts = [
            String(product && product.id != null ? product.id : ''),
            m.variantModel || m.model || '',
            m.variantSize || m.size || m.dimension || '',
            m.variantWeight || m.weight || '',
            m.variantGraphic || m.graphic || '',
            m.variantCarton || m.carton || m.cartonSize || ''
        ];
        return parts.join('\u241e');
    }

    function lineItemFromVariant(product, variantData, quantity) {
        const base = lineItemFromProduct(product, quantity != null ? quantity : 1);
        if (!base) return null;
        const vd = variantData || {};
        let vk = vd.variantKey != null && String(vd.variantKey).trim() !== ''
            ? String(vd.variantKey).trim()
            : '';
        if (!vk) vk = buildDefaultVariantKey(product, vd);

        const variantModel = String(vd.variantModel != null ? vd.variantModel : (vd.model !== undefined ? vd.model : '')).trim();
        const variantSize = String(
            vd.variantSize != null ? vd.variantSize : (vd.size !== undefined ? vd.size : (vd.dimension !== undefined ? vd.dimension : ''))
        ).trim();
        const variantWeight = String(vd.variantWeight != null ? vd.variantWeight : (vd.weight !== undefined ? vd.weight : '')).trim();
        const variantGraphic = String(vd.variantGraphic != null ? vd.variantGraphic : (vd.graphic !== undefined ? vd.graphic : '')).trim();
        const variantCarton = String(
            vd.variantCarton != null ? vd.variantCarton : (vd.carton !== undefined ? vd.carton : (vd.packing !== undefined ? vd.packing : ''))
        ).trim();
        let variantMetaLabel = String(vd.variantMetaLabel || '').trim();
        if (!variantMetaLabel) {
            const bits = [variantModel, variantSize, variantWeight, variantGraphic, variantCarton].filter(Boolean);
            variantMetaLabel = bits.join(' · ');
        }

        return Object.assign(base, {
            variantKey: vk,
            variantModel,
            variantSize,
            variantWeight,
            variantGraphic,
            variantCarton,
            variantMetaLabel
        });
    }

    function migrateLegacy() {
        if (localStorage.getItem(STORAGE_KEY)) return;

        const byId = new Map();

        function ingestRaw(obj, qtyDefault) {
            if (!obj || obj.id == null) return;
            const id = obj.id;
            const qty = Math.max(1, parseInt(obj.qty ?? obj.quantity ?? qtyDefault, 10) || 1);
            const existing = byId.get(id);
            const mergedQty = (existing ? existing.quantity : 0) + qty;

            const sku = String(obj.sku || obj.id || '').trim();
            const model = String(obj.model || '').trim();
            let nameZh = String(obj.nameZh || '').trim();
            let nameEn = String(obj.nameEn || '').trim();
            const legacyName = String(obj.name || '').trim();
            if (!nameZh && hasCjk(legacyName)) nameZh = legacyName;
            if (!nameEn && legacyName && !hasCjk(legacyName)) nameEn = legacyName;
            if (!nameZh) nameZh = nameZh || nameEn || '产品';
            if (!nameEn) nameEn = nameEn || nameZh || 'Product';

            byId.set(id, {
                id,
                sku,
                model,
                nameZh,
                nameEn,
                image: String(obj.image || '').trim(),
                category: String(obj.category || '').trim(),
                url: String(obj.url || '').trim(),
                quantity: mergedQty,
                variantKey: '',
                variantModel: '',
                variantSize: '',
                variantWeight: '',
                variantGraphic: '',
                variantCarton: '',
                variantMetaLabel: ''
            });
        }

        try {
            const sc = localStorage.getItem('shoppingCart');
            if (sc) {
                const arr = JSON.parse(sc);
                if (Array.isArray(arr)) arr.forEach((x) => ingestRaw(x, 1));
            }
        } catch { /* ignore */ }

        try {
            const c = localStorage.getItem('cart');
            if (c) {
                const arr = JSON.parse(c);
                if (Array.isArray(arr)) {
                    arr.forEach((x) => {
                        const id = x.id ?? x.productId;
                        if (id == null) return;
                        ingestRaw({
                            id,
                            sku: x.sku,
                            model: x.model,
                            nameZh: x.nameZh,
                            nameEn: x.nameEn,
                            name: x.name,
                            image: x.image,
                            category: x.category,
                            url: x.url,
                            quantity: x.qty ?? x.quantity ?? 1
                        }, 1);
                    });
                }
            }
        } catch { /* ignore */ }

        const payload = { v: SCHEMA_VERSION, items: Array.from(byId.values()) };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch { /* quota */ }

        LEGACY_KEYS.forEach((k) => {
            try {
                localStorage.removeItem(k);
            } catch { /* ignore */ }
        });
    }

    class WkRfqCart {
        constructor() {
            this.items = [];
            migrateLegacy();
            this.load();
            this.init();
            this.applyPendingPrefillMessage();
        }

        load() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) {
                    this.items = [];
                    return;
                }
                const data = JSON.parse(raw);
                let arr = [];
                if (data && Array.isArray(data.items)) {
                    arr = data.items;
                } else if (Array.isArray(data)) {
                    arr = data;
                } else {
                    this.items = [];
                    return;
                }
                this.items = arr.map(normalizeLineItem).filter(Boolean);
            } catch {
                this.items = [];
            }
        }

        save() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: SCHEMA_VERSION, items: this.items }));
            } catch { /* ignore */ }
            this.updateCartBadge();
            try {
                document.dispatchEvent(new CustomEvent('wkRfqCartChanged', { detail: { count: this.getTotalQuantity() } }));
            } catch { /* ignore */ }
        }

        getTotalQuantity() {
            return this.items.reduce((t, i) => t + (parseInt(i.quantity, 10) || 1), 0);
        }

        /** For ProductManager.openRFQModal — one row per cart line (variants = multiple rows same id possible) */
        getIdQtyPairs() {
            return this.items.map((i) => ({
                id: i.id,
                qty: parseInt(i.quantity, 10) || 1,
                variantKey: i.variantKey || '',
                variantModel: i.variantModel || '',
                variantSize: i.variantSize || '',
                variantWeight: i.variantWeight || '',
                variantGraphic: i.variantGraphic || '',
                variantCarton: i.variantCarton || '',
                variantMetaLabel: i.variantMetaLabel || ''
            }));
        }

        getItems() {
            return this.items.slice();
        }

        updateCartBadge() {
            const badge = document.querySelector('.cart-badge');
            if (badge) {
                const total = this.getTotalQuantity();
                badge.textContent = String(total);
                badge.style.display = total > 0 ? 'block' : 'none';
            }
        }

        getLang() {
            try {
                if (typeof window.wkResolvePageLanguage === 'function') {
                    return window.wkResolvePageLanguage();
                }
            } catch { /* ignore */ }
            try {
                const p = window.location.pathname.replace(/\\/g, '/');
                if (p === '/zh' || p.startsWith('/zh/')) return 'zh';
            } catch { /* ignore */ }
            try {
                if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
                    return window.multiLang.getCurrentLanguage() || 'en';
                }
            } catch { /* ignore */ }
            return 'en';
        }

        displayName(item) {
            const lang = this.getLang();
            if (lang === 'zh') return item.nameZh || item.nameEn || '';
            return item.nameEn || item.nameZh || '';
        }

        addProduct(product, quantity) {
            const line = lineItemFromProduct(product, quantity || 1);
            if (!line) return false;
            const existing = this.items.find((x) =>
                String(x.id) === String(line.id) && matchVariantKey(x.variantKey, line.variantKey));
            if (existing) {
                existing.quantity = (parseInt(existing.quantity, 10) || 1) + line.quantity;
            } else {
                this.items.push(line);
            }
            this.save();
            this.showAddedToast(line, false);
            return true;
        }

        addVariantLine(product, variantData) {
            const vd = variantData || {};
            const q = vd.quantity != null ? vd.quantity : 1;
            const line = lineItemFromVariant(product, vd, q);
            if (!line) return false;
            const existing = this.items.find((x) =>
                String(x.id) === String(line.id) && matchVariantKey(x.variantKey, line.variantKey));
            if (existing) {
                existing.quantity = (parseInt(existing.quantity, 10) || 1) + (parseInt(line.quantity, 10) || 1);
            } else {
                this.items.push(line);
            }
            this.save();
            this.showAddedToast(line, true);
            return true;
        }

        removeItem(productId, variantKey) {
            if (variantKey === undefined) {
                this.items = this.items.filter((x) => String(x.id) !== String(productId));
            } else {
                const vk = String(variantKey);
                this.items = this.items.filter((x) =>
                    !(String(x.id) === String(productId) && matchVariantKey(x.variantKey, vk)));
            }
            this.save();
            this.updateCartDisplay();
        }

        updateQuantity(productId, variantKey, quantity) {
            const vk = variantKey !== undefined ? String(variantKey) : '';
            const item = this.items.find((x) =>
                String(x.id) === String(productId) && matchVariantKey(x.variantKey, vk));
            if (!item) return;
            if (quantity <= 0) {
                this.removeItem(productId, vk);
                return;
            }
            item.quantity = quantity;
            this.save();
            this.updateCartDisplay();
        }

        clearCart() {
            this.items = [];
            this.save();
            this.updateCartDisplay();
        }

        showAddedToast(line, isVariant) {
            const lang = this.getLang();
            const name = this.displayName(line);
            let message = '';
            if (window.wkI18n && typeof window.wkI18n.t === 'function') {
                if (isVariant) {
                    message = window.wkI18n.t('rfq_cart_added_variant_toast') || window.wkI18n.t('rfq_cart_added_short') || '';
                }
                if (!message) {
                    const tpl = window.wkI18n.t('rfq_cart_added_toast');
                    message = tpl && tpl.indexOf('{name}') !== -1 ? tpl.split('{name}').join(name) : '';
                }
            }
            if (!message) {
                if (isVariant) {
                    message = lang === 'zh' ? '已加入询价清单' : 'Added to RFQ list';
                } else {
                    message = lang === 'zh' ? `已加入询价清单：${name}` : `Added to RFQ list: ${name}`;
                }
            }

            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        init() {
            const cartBtn = document.getElementById('cartBtn');
            if (cartBtn) {
                cartBtn.addEventListener('click', () => this.showCartModal());
            }
            if (!window._wkRfqEscBound) {
                window._wkRfqEscBound = true;
                document.addEventListener('keydown', (e) => {
                    if (e.key !== 'Escape') return;
                    const m = document.getElementById('cartModal');
                    if (m && m.style.display === 'block' && window.wkRfqCart) {
                        window.wkRfqCart.closeCartModal();
                    }
                });
            }
        }

        showCartModal() {
            let modal = document.getElementById('cartModal');
            if (!modal) {
                this.createCartModal();
                modal = document.getElementById('cartModal');
            } else {
                this.updateCartDisplay();
            }
            if (modal) {
                modal.style.display = 'block';
                modal.setAttribute('aria-hidden', 'false');
                this.lockScroll(true);
            }
            if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                window.multiLang.translatePage();
            }
        }

        createCartModal() {
            const modal = document.createElement('div');
            modal.id = 'cartModal';
            modal.className = 'modal cart-modal rfq-cart-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'rfqCartTitle');
            modal.innerHTML = `
            <div class="modal-content cart-modal-content">
                <div class="cart-modal-header">
                    <h2 id="rfqCartTitle" data-translate="rfq_cart_title">RFQ list</h2>
                    <button type="button" class="rfq-cart-close close" aria-label="Close">&times;</button>
                </div>
                <div class="cart-modal-body" id="cartItems"></div>
                <div class="cart-modal-footer">
                    <div class="cart-total rfq-cart-total">
                        <strong data-translate="rfq_cart_item_count_label">Items</strong>
                        <span id="rfqCartCount">0</span>
                    </div>
                    <div class="cart-actions">
                        <button type="button" class="btn btn-secondary" id="rfqCartClearBtn" data-translate="rfq_cart_clear">Clear list</button>
                        <button type="button" class="btn btn-primary" id="rfqCartCtaBtn" data-translate="rfq_cart_request_quote">Request quote</button>
                    </div>
                </div>
            </div>`;
            document.body.appendChild(modal);

            modal.querySelector('.rfq-cart-close').addEventListener('click', () => this.closeCartModal());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeCartModal();
            });
            document.getElementById('rfqCartClearBtn').addEventListener('click', () => this.clearCart());
            document.getElementById('rfqCartCtaBtn').addEventListener('click', () => this.requestQuote());

            this.updateCartDisplay();
        }

        lockScroll(locked) {
            document.body.style.overflow = locked ? 'hidden' : '';
            document.documentElement.style.overflow = locked ? 'hidden' : '';
            document.body.classList.toggle('no-scroll', !!locked);
        }

        closeCartModal() {
            const modal = document.getElementById('cartModal');
            if (modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            }
            this.lockScroll(false);
        }

        updateCartDisplay() {
            const cartItemsContainer = document.getElementById('cartItems');
            const countEl = document.getElementById('rfqCartCount');
            if (!cartItemsContainer) return;

            const total = this.getTotalQuantity();
            if (countEl) countEl.textContent = String(total);

            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-clipboard-list"></i>
                    <p data-translate="rfq_cart_empty">Your RFQ list is empty</p>
                </div>`;
                if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                    window.multiLang.translatePage();
                }
                return;
            }

            const lang = this.getLang();
            const lbl = (key, z, e) => {
                if (window.wkI18n && typeof window.wkI18n.t === 'function') {
                    const s = window.wkI18n.t(key);
                    if (s) return s;
                }
                return lang === 'zh' ? z : e;
            };
            let html = '';
            this.items.forEach((item) => {
                const title = escapeHtml(this.displayName(item));
                const sku = escapeHtml(item.sku || '');
                const model = escapeHtml(item.model || '');
                const hasVariant = !!(item.variantKey && String(item.variantKey).trim());
                const metaParts = [];
                if (sku) metaParts.push(`SKU: ${sku}`);
                if (hasVariant) {
                    if (item.variantModel) metaParts.push(`${lbl('rfq_line_model', '型号', 'Model')}: ${escapeHtml(item.variantModel)}`);
                    if (item.variantSize) metaParts.push(`${lbl('rfq_variant_size', '尺寸', 'Size')}: ${escapeHtml(item.variantSize)}`);
                    if (item.variantWeight) metaParts.push(`${lbl('rfq_variant_weight', '重量', 'Weight')}: ${escapeHtml(item.variantWeight)}`);
                } else if (model) {
                    metaParts.push(`${lbl('rfq_line_model', '型号', 'Model')}: ${model}`);
                }
                const meta = metaParts.join(' · ');
                const imgHtml = item.image
                    ? `<div class="cart-item-image cart-item-image--photo"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" onerror="this.parentNode.innerHTML='<i class=\\'fas fa-box\\'></i>'"/></div>`
                    : `<div class="cart-item-image"><i class="fas fa-${this.getProductIcon(item.category)}"></i></div>`;

                const qty = parseInt(item.quantity, 10) || 1;
                const pid = Number(item.id);
                const encVk = encodeURIComponent(item.variantKey || '');
                const viewLabel = (window.wkI18n && typeof window.wkI18n.t === 'function')
                    ? window.wkI18n.t('rfq_cart_view_product')
                    : (lang === 'zh' ? '查看产品' : 'View product');
                html += `
                <div class="cart-item" data-product-id="${pid}" data-variant-key="${encVk}">
                    ${imgHtml}
                    <div class="cart-item-info">
                        <h4>${title}</h4>
                        ${meta ? `<p class="cart-item-meta">${meta}</p>` : ''}
                        ${item.url ? `<p class="cart-item-link"><a href="${escapeHtml(item.url)}">${escapeHtml(viewLabel)}</a></p>` : ''}
                    </div>
                    <div class="cart-item-quantity">
                        <button type="button" class="quantity-btn" data-rfq-qty="-1" data-rfq-id="${pid}" data-rfq-vkey="${encVk}">-</button>
                        <span>${qty}</span>
                        <button type="button" class="quantity-btn" data-rfq-qty="1" data-rfq-id="${pid}" data-rfq-vkey="${encVk}">+</button>
                    </div>
                    <button type="button" class="cart-item-remove" data-rfq-remove="${pid}" data-rfq-vkey="${encVk}" title="Remove"><i class="fas fa-times"></i></button>
                </div>`;
            });

            cartItemsContainer.innerHTML = html;

            cartItemsContainer.querySelectorAll('[data-rfq-qty]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-rfq-id');
                    const enc = btn.getAttribute('data-rfq-vkey') || '';
                    let vk = '';
                    try {
                        vk = decodeURIComponent(enc);
                    } catch { /* ignore */ }
                    const delta = parseInt(btn.getAttribute('data-rfq-qty'), 10);
                    const cur = this.items.find((x) => String(x.id) === String(id) && matchVariantKey(x.variantKey, vk));
                    if (!cur) return;
                    this.updateQuantity(id, vk, (parseInt(cur.quantity, 10) || 1) + delta);
                });
            });
            cartItemsContainer.querySelectorAll('[data-rfq-remove]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-rfq-remove');
                    let vk = '';
                    try {
                        vk = decodeURIComponent(btn.getAttribute('data-rfq-vkey') || '');
                    } catch { /* ignore */ }
                    this.removeItem(id, vk);
                });
            });

            if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
                window.multiLang.translatePage();
            }
        }

        getProductIcon(category) {
            const icons = {
                furniture: 'chair',
                tents: 'home',
                flags: 'flag',
                displays: 'display',
                lightbox: 'lightbulb',
                racegate: 'flag-checkered',
                custom: 'tools',
                popup: 'cube',
                frames: 'th'
            };
            return icons[category] || 'box';
        }

        buildInquiryMessage(lang) {
            const lbl = (key, z, e) => {
                if (window.wkI18n && typeof window.wkI18n.t === 'function') {
                    const s = window.wkI18n.t(key);
                    if (s) return s;
                }
                return lang === 'zh' ? z : e;
            };
            const lines = [];
            if (lang === 'zh') {
                lines.push('询价清单（RFQ）：');
                lines.push('请针对以下型号报价（含印刷/交期/MOQ/贸易条款）：');
            } else {
                lines.push('RFQ / Request for quotation:');
                lines.push('Please quote the following items (MOQ, lead time, printing options, Incoterms):');
            }
            lines.push('');
            this.items.forEach((item, idx) => {
                const name = lang === 'zh' ? (item.nameZh || item.nameEn) : (item.nameEn || item.nameZh);
                const sku = item.sku || item.id;
                const q = parseInt(item.quantity, 10) || 1;
                const hasVariant = !!(item.variantKey && String(item.variantKey).trim());
                const parts = [];
                parts.push(`${lbl('rfq_line_sku', 'SKU', 'SKU')}: ${sku}`);
                if (hasVariant) {
                    if (item.variantModel) parts.push(`${lbl('rfq_line_model', '型号', 'Model')}: ${item.variantModel}`);
                    if (item.variantSize) parts.push(`${lbl('rfq_variant_size', '尺寸', 'Size')}: ${item.variantSize}`);
                    if (item.variantWeight) parts.push(`${lbl('rfq_variant_weight', '重量', 'Weight')}: ${item.variantWeight}`);
                    if (item.variantGraphic) parts.push(`${lbl('rfq_variant_graphic', '画面', 'Graphic')}: ${item.variantGraphic}`);
                    if (item.variantCarton) parts.push(`${lbl('rfq_variant_carton', '装箱', 'Carton')}: ${item.variantCarton}`);
                } else if (item.model) {
                    parts.push(`${lbl('rfq_line_model', '型号', 'Model')}: ${item.model}`);
                }
                parts.push(`${lang === 'zh' ? '数量' : 'Qty'}: ${q}`);
                lines.push(`${idx + 1}. ${name}`);
                lines.push(`   ${parts.join(' · ')}`);
                lines.push('');
            });
            return lines.join('\n').trim();
        }

        /** Legacy alias for older inline handlers / snippets. */
        checkout() {
            this.requestQuote();
        }

        requestQuote() {
            const lang = this.getLang();
            const text = this.buildInquiryMessage(lang);
            this.closeCartModal();

            const ta =
                document.querySelector('#getQuoteForm textarea[name="message"]') ||
                document.querySelector('textarea[name="message"]');
            const contact = document.getElementById('contact');

            if (ta) {
                const existing = (ta.value || '').trim();
                const meaningful = existing.length > 40;
                if (!meaningful) {
                    ta.value = text;
                } else {
                    ta.value = `${existing}\n\n--- RFQ ---\n${text}`;
                }
                const scrollTarget = contact || ta.closest('section') || ta;
                if (scrollTarget && typeof scrollTarget.scrollIntoView === 'function') {
                    scrollTarget.scrollIntoView({ behavior: 'smooth' });
                }
                setTimeout(() => {
                    try {
                        ta.focus();
                    } catch { /* ignore */ }
                }, 400);
                return;
            }

            try {
                sessionStorage.setItem('wk_rfq_prefill_message', text);
            } catch { /* ignore */ }
            window.location.href = 'contact-us.html#getQuoteForm';
        }

        applyPendingPrefillMessage() {
            try {
                const raw = sessionStorage.getItem('wk_rfq_prefill_message');
                if (!raw) return;
                const ta =
                    document.querySelector('#getQuoteForm textarea[name="message"]') ||
                    document.querySelector('textarea[name="message"]');
                if (ta && !(ta.value || '').trim()) {
                    ta.value = raw;
                }
                sessionStorage.removeItem('wk_rfq_prefill_message');
            } catch { /* ignore */ }
        }

        refreshAfterLangChange() {
            const modal = document.getElementById('cartModal');
            if (modal && modal.style.display === 'block') {
                this.updateCartDisplay();
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.wkRfqCart = new WkRfqCart();
        window.shoppingCart = window.wkRfqCart;

        document.addEventListener('languageChanged', () => {
            if (window.wkRfqCart && typeof window.wkRfqCart.refreshAfterLangChange === 'function') {
                window.wkRfqCart.refreshAfterLangChange();
            }
        });
    });

    /** Legacy: add by numeric id (looks up productManager catalog). */
    window.addToCart = function (productId) {
        const pm = window.productManager;
        if (!pm || !Array.isArray(pm.products) || !window.wkRfqCart) return;
        const product = pm.products.find((p) => String(p.id) === String(productId));
        if (product) window.wkRfqCart.addProduct(product, 1);
    };

    window.addProductToRfqCart = function (product, quantity) {
        if (!product || !window.wkRfqCart) return;
        window.wkRfqCart.addProduct(product, quantity != null ? quantity : 1);
    };

    window.addVariantToRfqCart = function (product, variantData) {
        if (!product || !window.wkRfqCart) return;
        window.wkRfqCart.addVariantLine(product, variantData || {});
    };
})();
