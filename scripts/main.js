// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollEffects();
    initBackToTop();
    initModals();
    initFormValidation();
    initAnimations();
    initHeroVideo();
    renderHeroSlides();
    initHeroCarouselSz();

    initSearch(); // ✅ Search overlay + redirect
});

// 导航功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const categoryCards = document.querySelectorAll('.category-card');
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 产品分类卡片点击事件
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
                // 触发产品筛选
                setTimeout(() => {
                    const categoryBtn = document.querySelector(`[data-category="${category}"]`);
                    if (categoryBtn) {
                        categoryBtn.click();
                    }
                }, 500);
            }
        });
    });
    
    // ===================== 统一滚动锁定管理 =====================
    function lockScroll(locked) {
        document.body.style.overflow = locked ? 'hidden' : '';
        document.body.style.height = locked ? '100%' : '';
        document.documentElement.style.overflow = locked ? 'hidden' : '';
        if (locked) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }
    
    function closeMobileMenu() {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        lockScroll(false);
    }
    
    // 移动端菜单切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            lockScroll(isOpen);
        });
    }
    
    // 点击导航链接后：关闭菜单+恢复滚动
    document.addEventListener('click', (e) => {
        if (e.target.closest('a.nav-link, .dropdown-menu a, .category-card a')) {
            closeMobileMenu();
        }
    });
    
    // ESC 键关闭菜单
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // 页面加载时确保滚动解锁
    lockScroll(false);
    
    // 平滑滚动到锚点（仅对当前页面的 #xxx 生效；跨页链接如 index.html#contact 不拦截）
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // 导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // 高亮当前页面部分
    window.addEventListener('scroll', highlightCurrentSection);
    
    // 自动高亮当前导航项（基于路径）
    (function() {
        const path = location.pathname.split('/').pop() || location.href.split('/').pop();
        document.querySelectorAll('[data-nav]').forEach(a => {
            a.classList.remove('active');
            const navValue = a.getAttribute('data-nav');
            if ((path === 'product-center.html' && navValue === 'product-center') ||
                (path === 'all-products.html' && navValue === 'all-products')) {
                a.classList.add('active');
            }
        });
    })();
}

// 高亮当前页面部分
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// 滚动效果
function initScrollEffects() {
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.service-item, .product-item, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // 视差滚动效果
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 模态框功能
function initModals() {
    const modal = document.getElementById('pdfModal');
    const closeBtn = document.querySelector('.close');
    
    if (modal && closeBtn) {
        // 关闭模态框
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
    
    // 添加PDF下载按钮到产品卡片
    addPDFDownloadButtons();
}

// 添加PDF下载按钮
function addPDFDownloadButtons() {
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-secondary';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下载资料';
        downloadBtn.addEventListener('click', () => {
            document.getElementById('pdfModal').style.display = 'block';
        });
        
        const productInfo = item.querySelector('.product-info');
        if (productInfo) {
            productInfo.appendChild(downloadBtn);
        }
    });
}

// 表单验证
function initFormValidation() {
    // Handle multiple contact-form instances but skip the primary getQuoteForm
    const forms = document.querySelectorAll('.contact-form form');

    forms.forEach(form => {
        // Let `scripts/contact.js` handle the main quoting form
        if (form.id === 'getQuoteForm') return;

        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });

            if (isValid) {
                submitForm(form);
            }
        });
    });
}

// 验证单个字段
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // 移除之前的错误样式
    field.classList.remove('error');
    
    // 必填字段验证
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }
    
    // 邮箱验证
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
    }
    
    return true;
}

// 清除验证错误
function clearValidation(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// 显示字段错误
function showFieldError(field, message) {
    field.classList.add('error');
    
    // 移除现有错误信息
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 添加新的错误信息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// 提交表单
function submitForm(form) {
    const formMessage = document.getElementById('formMessage');
    
    // 显示提交中状态
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // 模拟提交
    setTimeout(() => {
        // 显示成功消息
        if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.className = 'form-message success';
            formMessage.textContent = '消息发送成功！我们会尽快联系您。';
        }
        
        // 重置表单
        form.reset();
        
        // 恢复按钮状态
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 3秒后隐藏消息
        setTimeout(() => {
            if (formMessage) {
                formMessage.style.display = 'none';
            }
        }, 3000);
    }, 1500);
}

// 动画初始化
function initAnimations() {
    // 可以在这里添加更多动画效果
}

// Hero视频初始化
function initHeroVideo() {
    const video = document.querySelector('.hero-video-bg');
    if (video) {
        video.addEventListener('loadeddata', () => {
            video.play().catch(() => {
                // 自动播放失败时，静默处理
            });
        });
    }
}

// Render hero slides from centralized data
function renderHeroSlides() {
    const track = document.getElementById('heroSzTrack');
    if (!track) return;
    // Only render dynamic slides when `window.HERO_SLIDES` is explicitly provided.
    // If not provided, preserve the static markup present in the HTML.
    const slides = window.HERO_SLIDES;
    if (!slides || !slides.length) return;

    track.innerHTML = '';

    slides.forEach((s, i) => {
        const article = document.createElement('article');
        article.className = 'hero-sz-slide' + (i === 0 ? ' is-active' : '');
        article.setAttribute('data-slide', i);

        let highlightsHtml = '';
        (s.highlights || []).forEach(h => {
            highlightsHtml += `<div class="h-item"><div class="h-label">${h.label}</div><div class="h-value"><span class="zh">${h.valueZh}</span><span class="en">${h.valueEn}</span></div></div>`;
        });

        article.innerHTML = `
            <div class="hero-sz-left">
                <div class="hero-info">
                    <div class="hero-kicker"><span class="zh">${s.kickerZh}</span><span class="en">${s.kickerEn}</span></div>

                    <h2 class="hero-title"><span class="zh">${s.titleZh}</span><span class="en">${s.titleEn}</span></h2>
                    <p class="hero-sub"><span class="zh">${s.subZh}</span><span class="en">${s.subEn}</span></p>

                    <div class="hero-highlights">${highlightsHtml}</div>

                    <div class="hero-ctas">
                        <a class="btn btn-primary" href="${s.ctaHref}">
                            <span class="zh">${s.ctaTextZh}</span>
                            <span class="en">${s.ctaTextEn}</span>
                        </a>
                    </div>

                </div>
            </div>
            <div class="hero-sz-right">
                <div class="hero-sz-image-wrap hero-image">
                    <img src="${s.image}" alt="${s.alt || ''}" loading="lazy">
                </div>
            </div>
        `;

        track.appendChild(article);
    });
}

// Signazon 风格 Hero 轮播
function initHeroCarouselSz() {
    const track = document.getElementById('heroSzTrack');
    if (!track) return;
    let slides = Array.from(track.querySelectorAll('.hero-sz-slide'));
    const dotsWrap = document.getElementById('heroSzDots');
    const prevBtn = document.getElementById('heroSzPrev');
    const nextBtn = document.getElementById('heroSzNext');
    let idx = slides.findIndex(s => s.classList.contains('is-active'));
    if (idx < 0) idx = 0;

    // If there are no slides (e.g. dynamic rendering removed static content),
    // insert a safe default slide and hide navigation controls.
    if (slides.length === 0) {
        // create a simple fallback slide using an existing image
        const fallback = document.createElement('article');
        fallback.className = 'hero-sz-slide is-active';
        fallback.setAttribute('data-slide', 0);
        fallback.innerHTML = `
            <div class="hero-sz-left">
                <div class="hero-sz-kicker">Welcome</div>
                <h1 class="hero-sz-title">Welcome to WaiKwan</h1>
                <p class="hero-sz-sub">Quality tents and displays — factory direct</p>
            </div>
            <div class="hero-sz-right">
                <div class="hero-sz-image-wrap">
                    <img src="images/快幕秀图片.jpg" alt="WaiKwan Hero" loading="lazy">
                </div>
            </div>
        `;
        track.appendChild(fallback);
        slides = [fallback];

        if (dotsWrap) dotsWrap.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    // dots
    if (dotsWrap) {
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
            const b = document.createElement('button');
            b.className = 'hero-sz-dot' + (i === idx ? ' is-active' : '');
            b.type = 'button';
            b.addEventListener('click', () => go(i, true));
            dotsWrap.appendChild(b);
        });
    }

    const setActive = (i) => {
        slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
        if (dotsWrap) {
            Array.from(dotsWrap.children).forEach((d, k) => {
                d.classList.remove('is-active');
                if (k === i) {
                    // 触发进度条动画重置
                    void d.offsetWidth;
                    d.classList.add('is-active');
                }
            });
        }
    };

    const go = (i, user = false) => {
        idx = (i + slides.length) % slides.length;
        setActive(idx);
        if (user) restart();
    };

    prevBtn && prevBtn.addEventListener('click', () => go(idx - 1, true));
    nextBtn && nextBtn.addEventListener('click', () => go(idx + 1, true));

    // autoplay
    let timer = null;
    const start = () => timer = window.setInterval(() => go(idx + 1), 6500);
    const stop = () => {
        if (timer) window.clearInterval(timer);
        timer = null;
    };
    const restart = () => {
        stop();
        start();
    };

    // pause on hover
    const shell = document.querySelector('.hero-sz-track');
    shell && shell.addEventListener('mouseenter', stop);
    shell && shell.addEventListener('mouseleave', start);

    setActive(idx);
    start();
}

// Logo 漂浮功能已简化为纯 CSS transform，无需 JavaScript

// ===================== Search Overlay + Redirect =====================
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');

    // 没有按钮就不初始化（避免报错）
    if (!searchBtn) return;

    // 如果已经在 all-products 页面：点击就直接跳转并聚焦搜索框
    function isAllProductsPage() {
        return location.pathname.endsWith('all-products.html');
    }

    function goToSearch(q) {
        const keyword = (q || '').trim();
        const url = keyword
            ? `all-products.html?q=${encodeURIComponent(keyword)}`
            : `all-products.html`;
        window.location.href = url;
    }

    // 创建搜索弹层（只创建一次）
    let overlay = document.getElementById('searchOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'searchOverlay';
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
                <button class="search-close" type="button" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>

                <div class="search-title">
                    <span class="en">Search products</span>
                    <span class="zh">搜索产品</span>
                </div>

                <div class="search-row">
                    <input id="searchOverlayInput" type="text" placeholder="Search tents / flags / displays..." autocomplete="off" />
                    <button id="searchOverlayGo" class="btn btn-primary" type="button">
                        <span class="en">Search</span><span class="zh">搜索</span>
                    </button>
                </div>

                <div class="search-hint">
                    <span class="en">Tip: Try “3x3”, “flag pole”, “backdrop”.</span>
                    <span class="zh">提示：可试 “3x3 / 沙滩旗 / 快幕秀”.</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const input = overlay.querySelector('#searchOverlayInput');
    const goBtn = overlay.querySelector('#searchOverlayGo');
    const closeBtn = overlay.querySelector('.search-close');

    function open() {
        overlay.classList.add('open');
        document.body.classList.add('no-scroll');
        setTimeout(() => input && input.focus(), 50);
    }

    function close() {
        overlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
        if (input) input.value = '';
    }

    // 点击 🔍
    searchBtn.addEventListener('click', () => {
        if (isAllProductsPage()) {
            // 如果就在 all-products：聚焦搜索框
            const pageInput = document.getElementById('searchInput');
            if (pageInput) {
                pageInput.focus();
                pageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }
        open();
    });

    // 关闭逻辑
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'Enter') goToSearch(input.value);
    });

    // 点击 Search
    goBtn && goBtn.addEventListener('click', () => goToSearch(input.value));
}
