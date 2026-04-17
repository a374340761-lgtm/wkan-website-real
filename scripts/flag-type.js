// Flag Type detail page renderer (mirrors tent-type.js behavior)
(function () {
  'use strict';

  function ensureImageModal() {
    let modal = document.getElementById('wkImageModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'wkImageModal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 1100px;">
        <div class="modal-header">
          <h3 id="wkImageModalTitle" style="margin:0;"></h3>
          <button type="button" class="close-btn" aria-label="Close">×</button>
        </div>
        <div class="modal-body" style="padding: 16px;">
          <img id="wkImageModalImg" src="" alt="" style="width: 100%; height: auto; display: block; max-height: 80vh; object-fit: contain;" />
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-btn');
    const close = () => modal.classList.remove('show');
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    return modal;
  }

  function openImageModal(src, title) {
    const s = wkAssetUrl((src || '').toString());
    if (!s) return;

    const modal = ensureImageModal();
    const img = modal.querySelector('#wkImageModalImg');
    const h = modal.querySelector('#wkImageModalTitle');
    if (img) img.src = s;
    if (h) h.textContent = (title || '').toString();
    modal.classList.add('show');
  }

  function getCurrentLang() {
    try {
      if (typeof window.wkResolvePageLanguage === 'function') {
        return window.wkResolvePageLanguage();
      }
    } catch (e) {}
    try {
      const p = window.location.pathname.replace(/\\/g, '/');
      if (p === '/zh' || p.startsWith('/zh/')) return 'zh';
    } catch (e2) {}
    if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
      return window.multiLang.getCurrentLanguage();
    }
    return 'en';
  }

  function getQueryType() {
    try {
      return new URL(window.location.href).searchParams.get('type') || '';
    } catch (e) {
      return '';
    }
  }

  function getQueryVariant() {
    try {
      return new URL(window.location.href).searchParams.get('variant') || '';
    } catch (e) {
      return '';
    }
  }

  function safe(s) {
    return (s || '').toString();
  }

  function wkAssetUrl(u) {
    if (u == null || u === '') return '';
    const s = String(u).trim();
    if (/^(https?:|data:|\/\/)/i.test(s)) return s;
    if (typeof window.wkRootAssetUrl === 'function') {
      try {
        return window.wkRootAssetUrl(s);
      } catch (e) {
        /* ignore */
      }
    }
    const x = s.replace(/^\.\//, '');
    return x.startsWith('/') ? x : '/' + x;
  }

  function flagRawRow(row) {
    const r = row || {};
    const wDirect = String(r.weight != null ? r.weight : '').trim();
    const gross = String(r.gross != null ? r.gross : '').trim();
    const nw = String(r.nw != null ? r.nw : '').trim();
    const gw = String(r.gw != null ? r.gw : '').trim();
    let weight = wDirect || gross;
    if (!weight && (nw || gw)) {
      weight = [nw ? `N.W ${nw}` : '', gw ? `G.W ${gw}` : ''].filter(Boolean).join(' · ');
    }
    return {
      model: String(r.model != null ? r.model : '').trim(),
      style: String(
        r.style != null ? r.style : (r.frameSize != null ? r.frameSize : (r.height != null ? r.height : ''))
      ).trim(),
      poleSize: String(r.poleSize != null ? r.poleSize : '').trim(),
      flagSize: String(
        r.flagSize != null ? r.flagSize : (r.graphicSize != null ? r.graphicSize : (r.length != null ? r.length : ''))
      ).trim(),
      size: String(r.size != null ? r.size : '').trim(),
      weight,
      carton: String(r.carton != null ? r.carton : '').trim(),
      packing: String(r.packing != null ? r.packing : (r.pcs != null ? r.pcs : '')).trim(),
      description: String(
        r.description != null ? r.description : (r.name != null ? r.name : (r.material != null ? r.material : ''))
      ).trim()
    };
  }

  function flagTypeRfqButtonHtml(item, row, selectedVariantKey) {
    if (!item || !row) {
      return '<td class="variant-rfq-cell"></td>';
    }
    const fr = flagRawRow(row);
    const vkey = [
      String(item.type || ''),
      String(selectedVariantKey || ''),
      fr.model,
      fr.style,
      fr.description,
      fr.poleSize,
      fr.flagSize,
      fr.size,
      fr.weight,
      fr.carton,
      fr.packing
    ].join('\u241e');
    const sizeBits = fr.flagSize || fr.poleSize || fr.size;
    const metaBits = [fr.model, fr.style, sizeBits, fr.weight].filter(Boolean);
    const payload = {
      rfqProductId: item.rfqProductId != null ? item.rfqProductId : null,
      flagPageType: item.type || '',
      vkey,
      variantModel: fr.model || fr.style,
      variantSize: sizeBits,
      variantWeight: fr.weight,
      variantCarton: fr.carton,
      variantGraphic: '',
      variantMetaLabel: metaBits.join(' · '),
      findModel: (() => {
        const m = String(fr.model || '').trim();
        if (!m || m === '—' || m === '-' || m === '–') return null;
        return m;
      })()
    };
    const enc = encodeURIComponent(JSON.stringify(payload));
    return `<td class="variant-rfq-cell"><button type="button" class="variant-rfq-btn" data-wk-flag-rfq="1" data-wk-payload="${enc}"><i class="fas fa-cart-plus" aria-hidden="true"></i></button></td>`;
  }

  function bindFlagTypeRfq(root) {
    const btns = root.querySelectorAll('button[data-wk-flag-rfq]');
    if (!btns.length) return;

    const tryPm = (cb) => {
      if (window.productManager && Array.isArray(window.productManager.products)) {
        cb(window.productManager);
        return;
      }
      let n = 0;
      const id = setInterval(() => {
        n += 1;
        if (window.productManager && Array.isArray(window.productManager.products)) {
          clearInterval(id);
          cb(window.productManager);
        } else if (n > 120) {
          clearInterval(id);
          console.warn('[FLAG-TYPE RFQ] ProductManager timeout after 6s');
        }
      }, 50);
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        let payload = null;
        try {
          payload = JSON.parse(decodeURIComponent(btn.getAttribute('data-wk-payload') || '{}'));
        } catch (err) {
          console.warn('[FLAG-TYPE RFQ] Failed to parse button payload', err);
          return;
        }
        tryPm((pm) => {
          let product = null;
          const pid = payload.rfqProductId;
          if (pid != null && String(pid).trim() !== '') {
            product = pm.products.find((p) => String(p.id) === String(pid));
          }
          if (!product && payload.flagPageType === 'backpack_street_flags') {
            product = pm.products.find((p) => String(p.id) === '95001');
          }
          if (!product && payload.findModel) {
            const m = String(payload.findModel).trim();
            product = pm.products.find((p) => String(p.category) === 'flags' && String(p.model || '').trim() === m)
              || pm.products.find((p) => String(p.model || '').trim() === m);
          }
          if (!product) {
            console.warn('[FLAG-TYPE RFQ] Could not find matching product', {
              rfqProductId: payload.rfqProductId,
              flagPageType: payload.flagPageType,
              findModel: payload.findModel,
              variantModel: payload.variantModel,
              variantSize: payload.variantSize,
              availableModels: pm.products.filter((p) => String(p.category) === 'flags').map((p) => String(p.model || '') + ' (id:' + p.id + ')').slice(0, 10)
            });
            return;
          }
          const vd = {
            variantKey: payload.vkey || '',
            variantModel: payload.variantModel || '',
            variantSize: payload.variantSize || '',
            variantWeight: payload.variantWeight || '',
            variantCarton: payload.variantCarton || '',
            variantMetaLabel: payload.variantMetaLabel || ''
          };
          if (typeof window.addVariantToRfqCart === 'function') {
            window.addVariantToRfqCart(product, vd);
          } else {
            console.warn('[FLAG-TYPE RFQ] addVariantToRfqCart function not available');
          }
        });
      });
      if (window.wkI18n && typeof window.wkI18n.t === 'function') {
        const al = window.wkI18n.t('add_to_rfq');
        if (al) btn.setAttribute('aria-label', al);
      }
    });
  }

  function renderRichText(text) {
    const lines = safe(text).split(/\n/);
    const parts = [];
    let paragraphLines = [];
    let listItems = [];

    const flushParagraph = () => {
      if (!paragraphLines.length) return;
      parts.push(`<div class="tent-type-detail__text">${paragraphLines.map((l) => safe(l)).join('<br>')}</div>`);
      paragraphLines = [];
    };

    const flushList = () => {
      if (!listItems.length) return;
      parts.push(`<ul class="tent-type-detail__list">${listItems.map((li) => `<li>${safe(li)}</li>`).join('')}</ul>`);
      listItems = [];
    };

    lines.forEach((raw) => {
      const line = safe(raw).trim();
      if (!line) {
        flushParagraph();
        flushList();
        return;
      }
      if (/^•\s*/.test(line)) {
        flushParagraph();
        listItems.push(line.replace(/^•\s*/, ''));
        return;
      }
      flushList();
      paragraphLines.push(line);
    });

    flushParagraph();
    flushList();
    return parts.join('');
  }

  function findFlagTypeData(type) {
    const data = window.FLAG_TYPES;
    if (!data) return null;
    const all = []
      .concat(Array.isArray(data.poles) ? data.poles : [])
      .concat(Array.isArray(data.special) ? data.special : [])
      .concat(Array.isArray(data.accessories) ? data.accessories : []);
    return all.find((x) => x && x.type === type) || null;
  }

  function getSelectedVariant(item, key) {
    if (!item || !Array.isArray(item.variants) || !item.variants.length) return null;
    const wanted = (key || item.defaultVariant || item.variants[0].key || '').toString();
    return item.variants.find((v) => v && v.key === wanted) || item.variants[0] || null;
  }

  function renderVariantSelector(item, selectedKey) {
    const lang = getCurrentLang();
    if (!item || !Array.isArray(item.variants) || !item.variants.length) return '';

    const title = lang === 'zh' ? '选择版本' : 'Choose Version';
    const selected = getSelectedVariant(item, selectedKey);
    const activeKey = selected ? selected.key : '';

    const buttons = item.variants
      .map((v) => {
        const label = lang === 'zh' ? safe(v.labelZh || v.labelEn || v.key) : safe(v.labelEn || v.labelZh || v.key);
        const cls = v.key === activeKey ? 'btn btn-primary' : 'btn btn-secondary';
        return `<button type="button" class="${cls}" data-variant="${safe(v.key)}">${label}</button>`;
      })
      .join(' ');

    return `
      <div style="margin-top: var(--spacing-sm); display:flex; flex-direction: column; gap: 10px;">
        <div style="font-weight: 800; color: var(--wk-black);">${title}</div>
        <div style="display:flex; gap: 10px; flex-wrap: wrap;">${buttons}</div>
      </div>
    `;
  }

  function resolveSpecTable(item, selectedVariantKey) {
    if (!item) return null;
    if (item.specTable) return item.specTable;
    if (Array.isArray(item.variants) && item.variants.length) {
      const selected = getSelectedVariant(item, selectedVariantKey);
      if (selected && selected.specTable) return selected.specTable;
    }
    return null;
  }

  function renderInfoBlocks(item) {
    const lang = getCurrentLang();
    if (!item || !Array.isArray(item.infoBlocks) || !item.infoBlocks.length) return '';

    return item.infoBlocks
      .map((b) => {
        const title = lang === 'zh'
          ? (safe(b.titleZh) && safe(b.titleEn) ? `${safe(b.titleZh)} / ${safe(b.titleEn)}` : safe(b.titleZh || b.titleEn))
          : safe(b.titleEn || b.titleZh);

        const zh = safe(b.textZh || '');
        const en = safe(b.textEn || '');

        return `
          <div class="tent-type-detail__block">
            <div class="tent-type-detail__blockTitle">${title}</div>
            ${lang === 'zh'
              ? `${zh ? renderRichText(zh) : ''}${en ? renderRichText(en) : ''}`
              : `${renderRichText(en || zh)}`}
          </div>
        `;
      })
      .join('');
  }

  function renderStory(item) {
    const lang = getCurrentLang();
    if (!item) return '';
    const zh = safe(item.storyZh || '');
    const en = safe(item.storyEn || '');
    if (!zh && !en) return '';
    const title = lang === 'zh' ? '产品介绍' : 'Product Story';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        ${lang === 'zh' ? `${zh ? renderRichText(zh) : ''}${en ? renderRichText(en) : ''}` : `${renderRichText(en || zh)}`}
      </div>
    `;
  }

  function renderExampleImages(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.exampleImages)) item.exampleImages.forEach((p) => p && imgs.push(p));
    if (!imgs.length) return '';

    const title = lang === 'zh'
      ? safe(item.exampleImagesTitleZh || '旗杆配件示例图 / Catalog Examples')
      : safe(item.exampleImagesTitleEn || 'Catalog Examples');

    const subtitle = lang === 'zh'
      ? safe(item.exampleImagesSubtitleZh || '以下示例图为画册页截图，用于快速查看沙滩旗底座与配件款式（可点击放大）。')
      : safe(item.exampleImagesSubtitleEn || 'Example catalog pages for quick reference (click to open).');

    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        <div class="tent-type-detail__text">${subtitle}</div>
        <div class="tent-type-detail__visuals" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
          ${imgs
            .map((src) => {
              const s = wkAssetUrl(safe(src));
              return `<a href="${s}" target="_blank" rel="noopener"><img class="tent-type-detail__visual" src="${s}" alt="" loading="lazy" /></a>`;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  function renderHero(item) {
    if (!item) return '';
    const src = wkAssetUrl(safe(item.heroImage || item.guideImage || (Array.isArray(item.guideImages) ? item.guideImages[0] : '')));
    if (!src) return '';
    return `
      <div class="tent-type-detail__block tent-type-detail__block--hero">
        <div class="tent-type-detail__visuals tent-type-detail__visuals--hero" style="grid-template-columns: 1fr;">
          <div class="tent-type-detail__hero-wrap">
            <button type="button" data-wk-image="${src}" data-wk-title="" aria-label="Open image" class="tent-type-detail__hero-btn">
              <img class="tent-type-detail__visual tent-type-detail__visual--hero" src="${src}" alt="" loading="lazy" onerror="this.style.display='none'" />
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderPdfGuide(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.guideImages)) item.guideImages.forEach((p) => p && imgs.push(p));
    else if (item && item.guideImage) imgs.push(item.guideImage);
    if (!imgs.length) return '';

    const title = lang === 'zh' ? '产品画册参考' : 'Brochure PDF Guide';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        <div class="tent-type-detail__visuals" style="grid-template-columns: 1fr;">
          ${imgs
            .map((src) => {
              const s = wkAssetUrl(safe(src));
              return `
                <button type="button" data-wk-image="${s}" data-wk-title="${safe(title)}" aria-label="Open brochure image" style="border:none;background:transparent;padding:0;display:block;width:100%;cursor:zoom-in;">
                  <img class="tent-type-detail__visual" src="${s}" alt="" loading="lazy" onerror="this.style.display='none'" />
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  function renderOneSpecTable(item, table, selectedVariantKey, blockTitle) {
    const lang = getCurrentLang();
    if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return '';

    const cols = table.columns;
    const headerHtml = cols
      .map((c) => {
        if (lang === 'zh' && c.labelZh && c.labelEn) return `<th>${safe(c.labelZh)} / ${safe(c.labelEn)}</th>`;
        return `<th>${safe(c.labelEn || c.labelZh || '')}</th>`;
      })
      .join('') + '<th class="variant-rfq-cell variant-rfq-th" data-translate="rfq_variant_col"></th>';

    const bodyHtml = table.rows
      .map((row) => {
        return `<tr>${cols.map((c) => `<td>${safe(row[c.key])}</td>`).join('')}${flagTypeRfqButtonHtml(item, row, selectedVariantKey)}</tr>`;
      })
      .join('');

    const titleKey = table.titleKey;
    const h = titleKey
      ? `<div class="tent-type-detail__blockTitle" data-translate="${safe(titleKey)}"></div>`
      : `<div class="tent-type-detail__blockTitle">${safe(blockTitle || (lang === 'zh' ? '型号参数' : 'Models & Specs'))}</div>`;

    return `
      <div class="tent-type-detail__block">
        ${h}
        <div class="tent-type-detail__tableWrap">
          <table class="tent-type-detail__table">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderSpecTablesBlock(item, selectedVariantKey) {
    const lang = getCurrentLang();
    if (Array.isArray(item.specTables) && item.specTables.length) {
      const parts = item.specTables.map((tbl) => {
        const bt = lang === 'zh' ? (tbl.titleZh || tbl.titleEn || '') : (tbl.titleEn || tbl.titleZh || '');
        return renderOneSpecTable(item, tbl, selectedVariantKey, bt);
      }).join('');
      return `${parts}${renderVariantSelector(item, selectedVariantKey)}`;
    }
    const table = resolveSpecTable(item, selectedVariantKey);
    if (!table) return '';
    const bt = lang === 'zh' ? '型号参数' : 'Models & Specs';
    return `${renderOneSpecTable(item, table, selectedVariantKey, bt)}${renderVariantSelector(item, selectedVariantKey)}`;
  }

  function renderSpecTable(item, selectedVariantKey) {
    return renderSpecTablesBlock(item, selectedVariantKey);
  }

  function renderPage(item, selectedVariantKey) {
    const lang = getCurrentLang();
    const title = lang === 'zh' ? safe(item.nameZh || item.nameEn) : safe(item.nameEn || item.nameZh);

    return `
      <div class="tent-type-detail">
        <div class="tent-type-detail__head">
          <h2 class="tent-type-detail__title">${title}</h2>
        </div>
        ${renderHero(item)}
        ${renderPdfGuide(item)}
        ${renderSpecTable(item, selectedVariantKey)}
        ${renderStory(item)}
        ${renderInfoBlocks(item)}
        ${renderExampleImages(item)}
      </div>
    `;
  }

  function init() {
    const type = getQueryType();
    const variant = getQueryVariant();
    const root = document.getElementById('flagTypeRoot');
    if (!root) return;

    const item = findFlagTypeData(type);
    if (!item) {
      root.innerHTML = '<div class="ap-empty"><p data-translate="flag_type_not_found"></p></div>';
      if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
        window.multiLang.translatePage();
      }
      return;
    }

    // Breadcrumb label
    const bc = document.getElementById('flagTypeBreadcrumb');
    if (bc) {
      const fallback = (window.multiLang && typeof window.multiLang.t === 'function') ? window.multiLang.t('view_type_button') : '';
      bc.textContent = (getCurrentLang() === 'zh' ? (item.nameZh || item.nameEn || fallback) : (item.nameEn || item.nameZh || fallback));
    }

    const renderWithVariant = (selectedKey) => {
      root.innerHTML = renderPage(item, selectedKey);

      bindFlagTypeRfq(root);

      // Image popups: hero + brochure guide open in a modal (uses the same PNG as the thumbnail).
      root.querySelectorAll('button[data-wk-image]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const src = btn.getAttribute('data-wk-image') || '';
          const title = btn.getAttribute('data-wk-title') || '';
          openImageModal(src, title);
        });
      });

      root.querySelectorAll('button[data-variant]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const k = btn.getAttribute('data-variant') || '';
          const url = new URL(window.location.href);
          url.searchParams.set('variant', k);
          window.location.href = url.toString();
        });
      });
    };

    renderWithVariant(variant);

    document.addEventListener('languageChanged', () => {
      // Re-render without changing selected variant param.
      renderWithVariant(getQueryVariant());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
