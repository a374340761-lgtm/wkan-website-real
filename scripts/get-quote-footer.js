// Injects the shared bottom "Get a Quote" footer on pages that don't include it.
// Also normalizes footer links so "Get a Quote" always jumps to index.html#contact.

(function () {
  'use strict';

  function hasMetaRefreshRedirect() {
    const metas = Array.from(document.getElementsByTagName('meta'));
    return metas.some((m) => {
      const httpEquiv = (m.getAttribute('http-equiv') || '').toLowerCase();
      if (httpEquiv !== 'refresh') return false;
      const content = m.getAttribute('content') || '';
      return /url\s*=\s*/i.test(content);
    });
  }

  function normalizeFooterLinks(root) {
    const container = root || document;

    // If current page doesn't have a #contact section, ensure footer jumps to index.html#contact.
    const hasContactHere = !!document.getElementById('contact');
    const hasAboutHere = !!document.getElementById('about');

    container.querySelectorAll('a[href="#contact"]').forEach((a) => {
      if (!hasContactHere) a.setAttribute('href', 'index.html#contact');
    });

    container.querySelectorAll('a[href="#about"]').forEach((a) => {
      if (!hasAboutHere) a.setAttribute('href', 'index.html#about');
    });

    // Normalize legal links (some pages still have placeholder href="#").
    container.querySelectorAll('a[data-i18n="footer_terms"]').forEach((a) => {
      const href = (a.getAttribute('href') || '').trim();
      if (!href || href === '#') a.setAttribute('href', 'terms.html');
    });

    container.querySelectorAll('a[data-i18n="footer_privacy"]').forEach((a) => {
      const href = (a.getAttribute('href') || '').trim();
      if (!href || href === '#') a.setAttribute('href', 'privacy.html');
    });

    container.querySelectorAll('a[data-i18n="footer_sitemap"]').forEach((a) => {
      const href = (a.getAttribute('href') || '').trim();
      if (!href || href === '#') a.setAttribute('href', 'site-map.html');
    });
  }

  function buildFooterElement() {
    const section = document.createElement('section');
    section.className = 'contact-bottom';

    // Must match the user-provided footer markup.
    section.innerHTML = `
      <div class="contact-bottom__bg"></div>
      <div class="contact-bottom__inner">
        <!-- 左：快速信息 -->
        <div class="contact-bottom__grid">
          <div class="contact-bottom__brand">
            <div class="contact-bottom__brandTitle" data-i18n="footer_company_line_cn">Guangxi WaiKwan Tent Manufacturing Co., Ltd</div>
            <div class="contact-bottom__brandSub" data-i18n="footer_company_line_en">Guangxi WaiKwan Tent Manufacturing Co., Ltd · Since 2010</div>
          </div>
          <div class="contact-bottom__cols">
            <div class="contact-bottom__col">
              <div class="contact-bottom__h" data-i18n="footer_findus">Find Us</div>
              <div class="contact-bottom__p" data-i18n="footer_address">广西壮族自治区玉林市博白县400县道与313省道交叉口东南500米<br>中国</div>
            </div>
            <div class="contact-bottom__col">
              <div class="contact-bottom__h" data-i18n="footer_contact">Contact</div>
              <a class="contact-bottom__link" href="mailto:yishu@waikwantent.com">
                yishu@waikwantent.com
              </a>
              <a class="contact-bottom__link" href="https://wa.me/8613824540280" target="_blank">
                WhatsApp: +86 138 2454 0280
              </a>
              <div class="contact-bottom__p">
                WeChat: massifmyth
              </div>
            </div>
            <div class="contact-bottom__col">
              <div class="contact-bottom__h" data-i18n="footer_companyinfo">Company Info</div>
              <a class="contact-bottom__link" href="index.html#about" data-i18n="footer_about">About Us</a>
              <a class="contact-bottom__link" href="product-center.html" data-i18n="footer_products">Products</a>
              <a class="contact-bottom__link" href="news/index.html" data-i18n="footer_news">News</a>
              <a class="contact-bottom__link" href="index.html#contact" data-i18n="footer_contactus">Contact Us</a>
            </div>
          </div>
        </div>
        <!-- 右：询问/CTA 盒子 -->
            <div class="contact-bottom__ask">
          <div class="contact-bottom__askTitle" data-i18n="footer_ask_title">Ask anything about products or designs…</div>
          <div class="contact-bottom__askBox">
            <div class="contact-bottom__askText" data-i18n="footer_ask_text">Tell us your product type, size, quantity and printing needs. We will reply within 24 hours.</div>
            <div class="contact-bottom__askActions">
              <a href="index.html#contact" class="contact-bottom__btn contact-bottom__btn--primary" data-i18n="cta_primary">Get Quote</a>
              <a href="product-center.html" class="contact-bottom__btn contact-bottom__btn--secondary" data-i18n="cta_secondary">View Products</a>
            </div>
            <div class="contact-bottom__askSupport">
              <a href="https://wa.me/8613824540280" target="_blank" rel="noopener noreferrer" class="contact-bottom__whatsapp" data-i18n="footer_whatsapp_support">WhatsApp</a>
            </div>
          </div>
        </div>
        <div id="footer-social" class="contact-bottom__social" tabindex="-1">
          <h3 class="contact-bottom__socialTitle" data-i18n="footer_follow_us">Follow Us</h3>
          <ul class="contact-bottom__socialLinks">
            <li>
              <a class="contact-bottom__socialLink" href="https://www.facebook.com/share/18UhWtGUB8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" data-i18n-aria-label="social_facebook">
                <i class="fab fa-facebook-f" aria-hidden="true"></i>
                <span class="contact-bottom__socialLinkLabel" data-i18n="social_facebook">Facebook</span>
              </a>
            </li>
            <li>
              <a class="contact-bottom__socialLink" href="https://www.linkedin.com/in/yishulai-waikwantent/" target="_blank" rel="noopener noreferrer" data-i18n-aria-label="social_linkedin">
                <i class="fab fa-linkedin-in" aria-hidden="true"></i>
                <span class="contact-bottom__socialLinkLabel" data-i18n="social_linkedin">LinkedIn</span>
              </a>
            </li>
            <li>
              <a class="contact-bottom__socialLink" href="https://www.instagram.com/waikwantent?igsh=ZjcxOWJtMjd0ZTh6&amp;utm_source=qr" target="_blank" rel="noopener noreferrer" data-i18n-aria-label="social_instagram">
                <i class="fab fa-instagram" aria-hidden="true"></i>
                <span class="contact-bottom__socialLinkLabel" data-i18n="social_instagram">Instagram</span>
              </a>
            </li>
            <li>
              <a class="contact-bottom__socialLink" href="https://www.tiktok.com/@yishu.lai?_r=1&amp;_t=ZT-95KvmDSrUyM" target="_blank" rel="noopener noreferrer" data-i18n-aria-label="social_tiktok">
                <i class="fab fa-tiktok" aria-hidden="true"></i>
                <span class="contact-bottom__socialLinkLabel" data-i18n="social_tiktok">TikTok</span>
              </a>
            </li>
            <li>
              <a class="contact-bottom__socialLink" href="https://xhslink.com/m/10kreAeKi3v" target="_blank" rel="noopener noreferrer" data-i18n-aria-label="social_xiaohongshu">
                <span class="wk-social-xhs-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" focusable="false"><path d="M7 3h11a2 2 0 0 1 2 2v15a1 1 0 0 1-1 1H8.5A3.5 3.5 0 0 1 5 17.5V5a2 2 0 0 1 2-2zm0 2v12.5c0 .83.67 1.5 1.5 1.5H18V5a1 1 0 0 0-1-1H7zm2 2h8v2H9V7zm0 4h8v2H9v-2zm0 4h5v2H9v-2z"/></svg></span>
                <span class="contact-bottom__socialLinkLabel" data-i18n="social_xiaohongshu">Xiaohongshu</span>
              </a>
            </li>
          </ul>
        </div>
        <!-- 最底行：版权 + links -->
        <div class="contact-bottom__legal">
          <div class="contact-bottom__copy" data-i18n="footer_copyright">© 2026 Guangxi WaiKwan Tent Manufacturing Co., Ltd. All Rights Reserved.</div>
          <div class="contact-bottom__links">
            <a href="faq.html" class="contact-bottom__link2">FAQ</a>
            <a href="custom-canopy-tent-manufacturer.html" class="contact-bottom__link2">Canopy Tent Manufacturer</a>
            <a href="beach-flag-supplier.html" class="contact-bottom__link2">Beach Flag Supplier</a>
            <a href="portable-display-systems.html" class="contact-bottom__link2">Display Systems Manufacturer</a>
            <a href="site-map.html#seo-guides" class="contact-bottom__link2">B2B Guides</a>
            <a href="terms.html" class="contact-bottom__link2" data-i18n="footer_terms">Terms</a>
            <a href="privacy.html" class="contact-bottom__link2" data-i18n="footer_privacy">Privacy Policy</a>
            <a href="site-map.html" class="contact-bottom__link2" data-i18n="footer_sitemap">Site Map</a>
          </div>
        </div>
      </div>
    `;

    return section;
  }

  function ensureFooter() {
    if (hasMetaRefreshRedirect()) return;

    const existing = document.querySelector('.contact-bottom');
    if (existing) {
      normalizeFooterLinks(existing);
      return;
    }

    const footer = buildFooterElement();
    document.body.appendChild(footer);
    normalizeFooterLinks(footer);
    try {
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
    } catch (e) { /* ignore */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureFooter);
  } else {
    ensureFooter();
  }
})();
