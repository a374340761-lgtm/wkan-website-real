// Product Center: filter category cards by ?cat=
(function () {
  'use strict';

  function getCurrentLang() {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang === 'zh' || htmlLang === 'en') return htmlLang;
    try {
      const saved = (localStorage.getItem('site_language') || '').toLowerCase();
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {
      // ignore
    }
    return 'en';
  }

  function getQueryCat() {
    try {
      return new URL(window.location.href).searchParams.get('cat') || '';
    } catch (e) {
      return '';
    }
  }

  function getNotice() {
    try {
      return new URL(window.location.href).searchParams.get('notice') || '';
    } catch (e) {
      return '';
    }
  }

  function applyCategoryFilter(cat) {
    const cards = Array.from(document.querySelectorAll('.category-card'));
    const backWrap = document.getElementById('productCenterBackWrap');
    const noticeEl = document.getElementById('productCenterNotice');
    const notice = getNotice();

    // Special case: Tents Hub
    if (cat === 'tents') {
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = 'none';
      cards.forEach((card) => {
        card.style.display = 'none';
      });
      if (backWrap) backWrap.style.display = '';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';

      renderTentsHub();
      return;
    }

    if (!cat) {
      cards.forEach((card) => {
        card.style.display = '';
      });
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = '';
      removeTentsHub();
      if (backWrap) backWrap.style.display = notice ? '' : 'none';
      if (noticeEl) noticeEl.style.display = notice ? '' : 'none';
      return;
    }

    let matchedCount = 0;
    cards.forEach((card) => {
      const cardCat = (card.dataset.category || '').trim();
      const isMatch = cardCat === cat;
      card.style.display = isMatch ? '' : 'none';
      if (isMatch) matchedCount++;
    });

    // If cat doesn't match any card, keep all visible (avoid a confusing blank page)
    if (matchedCount === 0) {
      cards.forEach((card) => {
        card.style.display = '';
      });
      const showcase = document.querySelector('.product-categories-showcase');
      if (showcase) showcase.style.display = '';
      removeTentsHub();
      if (backWrap) backWrap.style.display = '';
      if (noticeEl) noticeEl.style.display = '';
      return;
    }

    if (backWrap) backWrap.style.display = '';
    if (noticeEl) noticeEl.style.display = notice ? '' : 'none';

    // Not tents
    const showcase = document.querySelector('.product-categories-showcase');
    if (showcase) showcase.style.display = '';
    removeTentsHub();
  }

  function ensureTentsHubContainer() {
    let el = document.getElementById('tentsHub');
    if (el) return el;

    const anchor = document.querySelector('.section-header');
    if (!anchor || !anchor.parentElement) return null;

    el = document.createElement('section');
    el.id = 'tentsHub';
    el.className = 'tents-hub';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    return el;
  }

  function removeTentsHub() {
    const el = document.getElementById('tentsHub');
    if (el && el.parentElement) el.parentElement.removeChild(el);
  }

  function renderHubSection(titleKey, titleFallback, items) {
    const lang = getCurrentLang();
    const safe = (s) => (s || '').toString();

    return `
      <div class="tents-hub__section">
        <h2 class="tents-hub__title" data-translate="${titleKey}">${titleFallback}</h2>
        <div class="tent-types__grid">
          ${(items || []).map((item) => {
            const title = lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn);
            const desc = lang === 'zh' ? safe(item.descriptionZh) : safe(item.descriptionEn);
            const href = `all-products.html?cat=tents&type=${encodeURIComponent(item.type)}`;
            return `
              <a class="tent-type-card" href="${href}">
                <div class="tent-type-card__imgWrap">
                  <img class="tent-type-card__img" src="${item.heroImage}" alt="" loading="lazy" onerror="this.style.display='none'" />
                </div>
                <div class="tent-type-card__body">
                  <div class="tent-type-card__title">${title}</div>
                  ${desc ? `<div class=\"tent-type-card__desc\">${safe(desc).replace(/\n/g, '<br>')}</div>` : ''}
                  <div class="tent-type-card__cta">
                    <span class="btn btn-secondary" data-translate="view_type_button">View Type</span>
                  </div>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderTentsHub() {
    const container = ensureTentsHubContainer();
    if (!container) return;

    const data = window.TENT_TYPES;
    const folding = data && Array.isArray(data.folding) ? data.folding : [];
    const event = data && Array.isArray(data.event) ? data.event : [];

    container.innerHTML = [
      renderHubSection('tents_hub_folding_title', 'Folding Tents', folding),
      renderHubSection('tents_hub_event_title', 'Event Tents', event)
    ].join('');

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function init() {
    const cat = getQueryCat();
    applyCategoryFilter(cat);

    document.addEventListener('languageChanged', () => {
      if (getQueryCat() === 'tents') {
        renderTentsHub();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
