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
            quantity: Math.max(1, parseInt(quantity, 10) || 1)
        };
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
                quantity: mergedQty
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
                if (data && data.v === SCHEMA_VERSION && Array.isArray(data.items)) {
                    this.items = data.items.filter((x) => x && x.id != null);
                } else if (Array.isArray(data)) {
                    this.items = data.filter((x) => x && x.id != null);
                } else {
                    this.items = [];
                }
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

        /** For ProductManager.openRFQModal — [{ id, qty }] */
        getIdQtyPairs() {
            return this.items.map((i) => ({
                id: i.id,
                qty: parseInt(i.quantity, 10) || 1
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
            const existing = this.items.find((x) => String(x.id) === String(line.id));
            if (existing) {
                existing.quantity = (parseInt(existing.quantity, 10) || 1) + line.quantity;
            } else {
                this.items.push(line);
            }
            this.save();
            this.showAddedToast(line);
            return true;
        }

        removeItem(productId) {
            this.items = this.items.filter((x) => String(x.id) !== String(productId));
            this.save();
            this.updateCartDisplay();
        }

        updateQuantity(productId, quantity) {
            const item = this.items.find((x) => String(x.id) === String(productId));
            if (!item) return;
            if (quantity <= 0) {
                this.removeItem(productId);
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

        showAddedToast(line) {
            const lang = this.getLang();
            const name = this.displayName(line);
            let message;
            if (window.wkI18n && typeof window.wkI18n.t === 'function') {
                const tpl = window.wkI18n.t('rfq_cart_added_toast');
                message = tpl && tpl.indexOf('{name}') !== -1 ? tpl.split('{name}').join(name) : (lang === 'zh' ? `已加入询价清单：${name}` : `Added to RFQ list: ${name}`);
            } else {
                message = lang === 'zh' ? `已加入询价清单：${name}` : `Added to RFQ list: ${name}`;
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
            let html = '';
            this.items.forEach((item) => {
                const title = escapeHtml(this.displayName(item));
                const sku = escapeHtml(item.sku || '');
                const model = escapeHtml(item.model || '');
                const metaParts = [];
                if (sku) metaParts.push(`${lang === 'zh' ? 'SKU' : 'SKU'}: ${sku}`);
                if (model) metaParts.push(`${lang === 'zh' ? '型号' : 'Model'}: ${model}`);
                const meta = metaParts.join(' · ');
                const imgHtml = item.image
                    ? `<div class="cart-item-image cart-item-image--photo"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" onerror="this.parentNode.innerHTML='<i class=\\'fas fa-box\\'></i>'"/></div>`
                    : `<div class="cart-item-image"><i class="fas fa-${this.getProductIcon(item.category)}"></i></div>`;

                const qty = parseInt(item.quantity, 10) || 1;
                const pid = Number(item.id);
                const viewLabel = (window.wkI18n && typeof window.wkI18n.t === 'function')
                    ? window.wkI18n.t('rfq_cart_view_product')
                    : (lang === 'zh' ? '查看产品' : 'View product');
                html += `
                <div class="cart-item" data-product-id="${pid}">
                    ${imgHtml}
                    <div class="cart-item-info">
                        <h4>${title}</h4>
                        ${meta ? `<p class="cart-item-meta">${meta}</p>` : ''}
                        ${item.url ? `<p class="cart-item-link"><a href="${escapeHtml(item.url)}">${escapeHtml(viewLabel)}</a></p>` : ''}
                    </div>
                    <div class="cart-item-quantity">
                        <button type="button" class="quantity-btn" data-rfq-qty="-1" data-rfq-id="${pid}">-</button>
                        <span>${qty}</span>
                        <button type="button" class="quantity-btn" data-rfq-qty="1" data-rfq-id="${pid}">+</button>
                    </div>
                    <button type="button" class="cart-item-remove" data-rfq-remove="${pid}" title="Remove"><i class="fas fa-times"></i></button>
                </div>`;
            });

            cartItemsContainer.innerHTML = html;

            cartItemsContainer.querySelectorAll('[data-rfq-qty]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-rfq-id');
                    const delta = parseInt(btn.getAttribute('data-rfq-qty'), 10);
                    const cur = this.items.find((x) => String(x.id) === String(id));
                    if (!cur) return;
                    this.updateQuantity(id, (parseInt(cur.quantity, 10) || 1) + delta);
                });
            });
            cartItemsContainer.querySelectorAll('[data-rfq-remove]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.removeItem(btn.getAttribute('data-rfq-remove'));
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
                const model = item.model || '—';
                const q = parseInt(item.quantity, 10) || 1;
                if (lang === 'zh') {
                    lines.push(`${idx + 1}. ${name}`);
                    lines.push(`   SKU: ${sku} · 型号: ${model} · 数量: ${q}`);
                } else {
                    lines.push(`${idx + 1}. ${name}`);
                    lines.push(`   SKU: ${sku} · Model: ${model} · Qty: ${q}`);
                }
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
            window.location.href = 'index.html#contact';
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
})();
