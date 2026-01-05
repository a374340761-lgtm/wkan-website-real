// 购物车管理系统
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.init();
    }
    
    init() {
        this.setupCartButton();
        this.updateCartBadge();
    }
    
    // 从本地存储加载购物车
    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
            } catch (e) {
                this.items = [];
            }
        }
    }
    
    // 保存购物车到本地存储
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
        this.updateCartBadge();
    }
    
    // 添加商品到购物车
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                nameEn: product.nameEn,
                nameJa: product.nameJa,
                nameKo: product.nameKo,
                price: product.price,
                category: product.category,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showAddToCartNotification(product);
        return true;
    }
    
    // 从购物车移除商品
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // 更新商品数量
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }
    
    // 清空购物车
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // 获取购物车总数量
    getTotalQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    // 更新购物车徽章
    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const total = this.getTotalQuantity();
            badge.textContent = total;
            badge.style.display = total > 0 ? 'block' : 'none';
        }
    }
    
    // 设置购物车按钮事件
    setupCartButton() {
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.showCartModal();
            });
        }
    }
    
    // 显示添加到购物车通知
    showAddToCartNotification(product) {
        const currentLang = window.multiLang ? window.multiLang.getCurrentLanguage() : 'zh';
        const messages = {
            zh: `已将 ${product.name} 添加到购物车`,
            en: `${product.nameEn || product.name} added to cart`,
            ja: `${product.nameJa || product.name} がカートに追加されました`,
            ko: `${product.nameKo || product.name} 장바구니에 추가되었습니다`
        };
        
        const message = messages[currentLang] || messages.zh;
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 3秒后移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // 显示购物车模态框
    showCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'block';
            this.updateCartDisplay();
        } else {
            this.createCartModal();
        }
    }
    
    // 创建购物车模态框
    createCartModal() {
        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.className = 'modal cart-modal';
        modal.innerHTML = `
            <div class="modal-content cart-modal-content">
                <div class="cart-modal-header">
                    <h2 data-translate="cart_title">购物车</h2>
                    <span class="close" onclick="window.shoppingCart.closeCartModal()">&times;</span>
                </div>
                <div class="cart-modal-body" id="cartItems">
                    <!-- 购物车商品将在这里动态加载 -->
                </div>
                <div class="cart-modal-footer">
                    <div class="cart-total">
                        <strong data-translate="cart_total">总计:</strong>
                        <span id="cartTotalPrice">¥0</span>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-secondary" onclick="window.shoppingCart.clearCart()" data-translate="cart_clear">清空购物车</button>
                        <button class="btn btn-primary" onclick="window.shoppingCart.checkout()" data-translate="cart_checkout">联系询价</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.updateCartDisplay();
        
        // 点击外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeCartModal();
            }
        });
    }
    
    // 更新购物车显示
    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p data-translate="cart_empty">购物车是空的</p>
                </div>
            `;
            document.getElementById('cartTotalPrice').textContent = '¥0';
            return;
        }
        
        const currentLang = window.multiLang ? window.multiLang.getCurrentLanguage() : 'zh';
        let html = '';
        
        this.items.forEach(item => {
            const name = this.getLocalizedName(item, currentLang);
            html += `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <i class="fas fa-${this.getProductIcon(item.category)}"></i>
                    </div>
                    <div class="cart-item-info">
                        <h4>${name}</h4>
                        <p class="cart-item-price">${item.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="window.shoppingCart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="window.shoppingCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="window.shoppingCart.removeItem(${item.id})" title="移除">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        this.updateCartTotal();
    }
    
    // 更新购物车总价
    updateCartTotal() {
        // 由于价格是文本格式（如"起价 ¥599/套"），这里只显示商品数量
        const total = this.getTotalQuantity();
        const totalPriceEl = document.getElementById('cartTotalPrice');
        if (totalPriceEl) {
            const currentLang = window.multiLang ? window.multiLang.getCurrentLanguage() : 'zh';
            const messages = {
                zh: `${total} 件商品`,
                en: `${total} items`,
                ja: `${total} 点`,
                ko: `${total} 개 상품`
            };
            totalPriceEl.textContent = messages[currentLang] || messages.zh;
        }
    }
    
    // 获取本地化产品名称
    getLocalizedName(item, lang) {
        const nameMap = {
            zh: item.name,
            en: item.nameEn || item.name,
            ja: item.nameJa || item.name,
            ko: item.nameKo || item.name
        };
        return nameMap[lang] || item.name;
    }
    
    // 获取产品图标
    getProductIcon(category) {
        const icons = {
            furniture: 'chair',
            tents: 'home',
            flags: 'flag',
            custom: 'tools',
            popup: 'cube',
            frames: 'th'
        };
        return icons[category] || 'home';
    }
    
    // 关闭购物车模态框
    closeCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // 结账/联系询价
    checkout() {
        this.closeCartModal();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // 预填充表单
            setTimeout(() => {
                const messageField = document.querySelector('textarea[data-translate-placeholder="form_message"]');
                if (messageField) {
                    const currentLang = window.multiLang ? window.multiLang.getCurrentLanguage() : 'zh';
                    const productNames = this.items.map(item => this.getLocalizedName(item, currentLang)).join('、');
                    const messages = {
                        zh: `我想了解以下产品的详细报价：${productNames}`,
                        en: `I would like to get quotes for the following products: ${productNames}`,
                        ja: `以下の製品の詳細見積もりをお願いします：${productNames}`,
                        ko: `다음 제품에 대한 자세한 견적을 원합니다: ${productNames}`
                    };
                    messageField.value = messages[currentLang] || messages.zh;
                }
            }, 500);
        }
    }
}

// 初始化购物车
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});

// 添加到购物车的全局函数
window.addToCart = function(productId) {
    if (window.productManager && window.shoppingCart) {
        const product = window.productManager.products.find(p => p.id === productId);
        if (product) {
            window.shoppingCart.addItem(product);
        }
    }
};

