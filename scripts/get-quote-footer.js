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
              <div class="contact-bottom__p" data-i18n="footer_address">Daping Changtangao, Luyin Village,<br>Gucheng Town, Luchuan County,<br>Yulin City, China</div>
            </div>
            <div class="contact-bottom__col">
              <div class="contact-bottom__h" data-i18n="footer_contact">Contact</div>
              <a class="contact-bottom__link" href="mailto:a374340761@gmail.com">
                a374340761@gmail.com
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
              <a href="index.html#contact" class="contact-bottom__btn" data-i18n="footer_ask_btn">Get a Quote</a>
              <a href="https://wa.me/8613824540280" target="_blank" class="contact-bottom__btn contact-bottom__btn--ghost" data-i18n="footer_ask_btn2">WhatsApp Now</a>
            </div>
          </div>
        </div>
        <!-- 最底行：版权 + links -->
        <div class="contact-bottom__legal">
          <div class="contact-bottom__copy" data-i18n="footer_copyright">© 2026 Guangxi WaiKwan Tent Manufacturing Co., Ltd. All Rights Reserved.</div>
          <div class="contact-bottom__links">
            <a href="#" class="contact-bottom__link2" data-i18n="footer_terms">Terms</a>
            <a href="#" class="contact-bottom__link2" data-i18n="footer_privacy">Privacy Policy</a>
            <a href="#" class="contact-bottom__link2" data-i18n="footer_sitemap">Site Map</a>
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureFooter);
  } else {
    ensureFooter();
  }
})();
