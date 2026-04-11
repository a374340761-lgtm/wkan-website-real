// Tent Type detail page renderer
(function () {
  'use strict';

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

  const STOCK_TENT_ID_BY_TYPE = {
    folding30: 2001,
    folding40: 2002,
    folding50: 2003
  };

  function rawRowField(row, keys) {
    if (!row) return '';
    const ks = Array.isArray(keys) ? keys : [keys];
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i];
      if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim();
    }
    return '';
  }

  function tentTypeRfqButtonHtml(item, row, selectedVariantKey) {
    if (!item || !row) {
      return '<td class="variant-rfq-cell"></td>';
    }
    const model = rawRowField(row, ['model', 'Model']);
    const size = rawRowField(row, ['size', 'Size', 'dimension', 'Dimension']);
    const weight = rawRowField(row, ['weight', 'Weight']);
    const stockId = STOCK_TENT_ID_BY_TYPE[item.type];
    const vkey = [String(item.type || ''), String(selectedVariantKey || ''), model, size, weight].join('\u241e');
    const payload = {
      vkey,
      model,
      size,
      weight,
      stockId: stockId || null,
      findModel: stockId ? null : (model || null)
    };
    const enc = encodeURIComponent(JSON.stringify(payload));
    return `<td class="variant-rfq-cell"><button type="button" class="variant-rfq-btn" data-wk-tent-rfq="1" data-wk-payload="${enc}"><i class="fas fa-cart-plus" aria-hidden="true"></i></button></td>`;
  }

  function bindTentTypeRfq(root) {
    const btns = root.querySelectorAll('button[data-wk-tent-rfq]');
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
          return;
        }
        tryPm((pm) => {
          let product = null;
          if (payload.stockId != null) {
            product = pm.products.find((p) => String(p.id) === String(payload.stockId));
          }
          if (!product && payload.findModel) {
            product = pm.products.find((p) => String(p.model || '').trim() === String(payload.findModel).trim());
          }
          if (!product) return;
          const vd = {
            variantKey: payload.vkey || '',
            variantModel: payload.model || '',
            variantSize: payload.size || '',
            variantWeight: payload.weight || ''
          };
          if (typeof window.addVariantToRfqCart === 'function') {
            window.addVariantToRfqCart(product, vd);
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

  function findTentTypeData(type) {
    const data = window.TENT_TYPES;
    if (!data) return null;
    const all = []
      .concat(Array.isArray(data.folding) ? data.folding : [])
      .concat(Array.isArray(data.event) ? data.event : [])
      .concat(Array.isArray(data.inflatable) ? data.inflatable : [])
      .concat(Array.isArray(data.accessories) ? data.accessories : []);
    return all.find((x) => x && x.type === type) || null;
  }

  function renderExampleImages(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.exampleImages)) item.exampleImages.forEach((p) => p && imgs.push(p));
    if (!imgs.length) return '';

    const title = lang === 'zh'
      ? '画册示例 / Catalog Examples'
      : 'Catalog Examples';

    const subtitle = lang === 'zh'
      ? '画册页截图（P4），用于快速对照配件与 Grip 等型号（可点击放大）。'
      : 'Example catalog page for quick reference (click to open).';

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

  function renderBilingual(zh, en) {
    return `
      <div class="tent-type-detail__bi">
        <div class="tent-type-detail__biZh">${safe(zh)}</div>
        <div class="tent-type-detail__biEn">${safe(en)}</div>
      </div>
    `;
  }

  function getSelectedVariant(item, key) {
    if (!item || !Array.isArray(item.variants) || !item.variants.length) return null;
    const wanted = (key || item.defaultVariant || '').toString();
    return item.variants.find((v) => v && v.key === wanted) || item.variants[0] || null;
  }

  function renderVariantSelector(item, selectedKey) {
    const lang = getCurrentLang();
    if (!item || !Array.isArray(item.variants) || !item.variants.length) return '';

    const title = lang === 'zh' ? '选择型号' : 'Choose Model';
    const selected = getSelectedVariant(item, selectedKey);
    const activeKey = selected ? selected.key : '';

    const buttons = item.variants.map((v) => {
      const label = lang === 'zh'
        ? safe(v.labelZh || v.labelEn || v.key)
        : safe(v.labelEn || v.labelZh || v.key);
      const cls = v.key === activeKey ? 'btn btn-primary' : 'btn btn-secondary';
      return `<button type="button" class="${cls}" data-variant="${safe(v.key)}">${label}</button>`;
    }).join(' ');

    return `
      <div style="margin-top: var(--spacing-sm); display:flex; flex-direction: column; gap: 10px;">
        <div style="font-weight: 800; color: var(--wk-black);">${title}</div>
        <div style="display:flex; gap: 10px; flex-wrap: wrap;">${buttons}</div>
      </div>
    `;
  }

  function renderTableFromSpec(item, selectedVariantKey) {
    const lang = getCurrentLang();
    let table = item && item.specTable ? item.specTable : null;
    let materialNoteHtml = '';

    // Inflatable: one type with internal variants.
    if (!table && item && Array.isArray(item.variants) && item.variants.length) {
      const selected = getSelectedVariant(item, selectedVariantKey);
      const spec = selected && selected.spec ? selected.spec : {};
      table = {
        columns: [
          { key: 'model', labelZh: '型号', labelEn: 'Model' },
          { key: 'material', labelZh: '材质', labelEn: 'Material' },
          { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
          { key: 'carton', labelZh: '装箱尺寸', labelEn: 'Carton Size' },
          { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
        ],
        rows: [
          {
            model: safe(spec.model),
            material: safe(spec.material),
            size: safe(spec.size),
            carton: safe(spec.carton),
            weight: safe(spec.weight)
          }
        ]
      };
    }

    // Back-compat: folding types use {models, materialEn/materialZh, nameEn/nameZh}
    if (!table && item && Array.isArray(item.models) && item.models.length) {
      if (item.materialEn || item.materialZh) {
        const label = lang === 'zh' ? renderBilingual('材质', 'Material') : 'Material';
        const value = lang === 'zh'
          ? renderBilingual(safe(item.materialZh || ''), safe(item.materialEn || ''))
          : safe(item.materialEn || item.materialZh || '');
        materialNoteHtml = `<div class="tent-type-detail__meta">${label}: ${value}</div>`;
      }

      table = {
        columns: [
          { key: 'model', labelZh: '型号', labelEn: 'Model' },
          { key: 'name', labelZh: '名称', labelEn: 'Name' },
          { key: 'size', labelZh: '尺寸', labelEn: 'Size' },
          { key: 'weight', labelZh: '重量', labelEn: 'Weight' }
        ],
        rows: item.models.map((m) => ({
          model: m.model,
          name: lang === 'zh'
            ? `${safe(item.nameZh || '')} / ${safe(item.nameEn || '')}`
            : safe(item.nameEn || ''),
          size: m.size,
          weight: m.weight
        }))
      };
    }

    if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return '';

    const cols = table.columns;

    const headerHtml = cols.map((c) => {
      if (lang === 'zh' && c.labelZh && c.labelEn) return `<th>${renderBilingual(c.labelZh, c.labelEn)}</th>`;
      return `<th>${safe(c.labelEn || c.labelZh || '')}</th>`;
    }).join('') + '<th class="variant-rfq-cell variant-rfq-th" data-translate="rfq_variant_col"></th>';

    const cellValue = (row, key) => {
      const zh = row[`${key}Zh`];
      const en = row[`${key}En`];
      if (zh === undefined && en === undefined) return safe(row[key]);
      if (lang === 'zh') return safe(zh != null && String(zh).trim() !== '' ? zh : en);
      return safe(en != null && String(en).trim() !== '' ? en : zh);
    };

    const bodyHtml = table.rows.map((row) => {
      return `
        <tr>
          ${cols.map((c) => `<td>${cellValue(row, c.key)}</td>`).join('')}
          ${tentTypeRfqButtonHtml(item, row, selectedVariantKey)}
        </tr>
      `;
    }).join('');

    const isTentAccessoriesHub = item && item.type === 'tent_accessories';

    const headHtmlBlock = `
        <div class="tent-type-detail__head">
          <h2 class="tent-type-detail__title">
            ${lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn)}
            ${item.seriesCode ? ` <span class=\"tent-type-detail__series\">(${safe(item.seriesCode)})</span>` : ''}
            ${Array.isArray(item.variants) && item.variants.length
              ? (() => {
                const v = getSelectedVariant(item, selectedVariantKey);
                const label = v
                  ? (lang === 'zh' ? (safe(v.labelZh) || safe(v.labelEn) || safe(v.key)) : (safe(v.labelEn) || safe(v.labelZh) || safe(v.key)))
                  : '';
                return label ? ` <span class=\"tent-type-detail__series\">(${label})</span>` : '';
              })()
              : ''
            }
          </h2>
        </div>`;

    const gripsAfterTitle = isTentAccessoriesHub ? renderTentAccessoriesGripsBlock(item) : '';

    const specTableBlock = `
        <div class="tent-type-detail__block">
          <div class="tent-type-detail__blockTitle">${lang === 'zh' ? '型号参数' : 'Models & Specs'}</div>
          ${materialNoteHtml}
          <div class="tent-type-detail__tableWrap">
            <table class="tent-type-detail__table">
              <thead><tr>${headerHtml}</tr></thead>
              <tbody>${bodyHtml}</tbody>
            </table>
          </div>
          ${renderVariantSelector(item, selectedVariantKey)}
        </div>`;

    return `
      <div class="tent-type-detail">
        ${headHtmlBlock}
        ${gripsAfterTitle}
        ${specTableBlock}

        ${renderStory(item)}
        ${renderExampleImages(item)}
        ${renderInfoBlocks(item)}
        ${item && item.skipCommonDetails ? '' : renderCommonDetails()}
        ${item && item.skipAccessoriesBlock ? '' : renderAccessories(item)}
        ${renderPdfGuide(item)}
        ${renderRelatedLinks(item)}
      </div>
    `;
  }

  /** Same 24-grip sprite grid as products-accessories.html — directly under the hub title, before 型号参数. */
  function renderTentAccessoriesGripsBlock(item) {
    const lang = getCurrentLang();
    const intro = lang === 'zh'
      ? '以下为画册 24 格配件缩略图，可点击图片或标题查看详情，或加入询价清单。'
      : '24-grip catalog grid — click image or title for details, or add to the RFQ list.';
    return `
      <div class="tent-type-detail__block tent-type-detail__block--accessories-grips">
        <p class="tent-type-detail__text" style="margin-bottom: 14px;">${intro}</p>
        <div id="tentTypeAccessoriesGrid" class="ap-grid" aria-label="${lang === 'zh' ? '帐篷配件可选列表' : 'Tent accessories picker'}"></div>
      </div>
    `;
  }

  function renderInfoBlocks(item) {
    const lang = getCurrentLang();
    if (!item || !Array.isArray(item.infoBlocks) || !item.infoBlocks.length) return '';

    return item.infoBlocks.map((b) => {
      const title = lang === 'zh'
        ? (safe(b.titleZh) && safe(b.titleEn) ? `${safe(b.titleZh)} / ${safe(b.titleEn)}` : safe(b.titleZh || b.titleEn))
        : safe(b.titleEn || b.titleZh);

      const zh = safe(b.textZh || '');
      const en = safe(b.textEn || '');

      return `
        <div class="tent-type-detail__block">
          <div class="tent-type-detail__blockTitle">${title}</div>
          ${lang === 'zh'
            ? `
              ${zh ? renderRichText(zh) : ''}
              ${en ? renderRichText(en) : ''}
            `
            : `
              ${renderRichText(en || zh)}
            `
          }
        </div>
      `;
    }).join('');
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
        ${lang === 'zh'
          ? `
            ${zh ? renderRichText(zh) : ''}
            ${en ? renderRichText(en) : ''}
          `
          : `
            ${renderRichText(en || zh)}
          `
        }
      </div>
    `;
  }

  function renderCommonDetails() {
    const lang = getCurrentLang();
    const common = window.TENT_TYPES && window.TENT_TYPES.common ? window.TENT_TYPES.common : null;
    if (!common) return '';

    const title = lang === 'zh' ? '连接方式 / 面料说明' : 'Connection Method / Fabric';
    const zh = safe(common.connectionMethodZh || '');
    const en = safe(common.connectionMethodEn || '');

    // Only show for tent types that asked for it (folding/star/awning). If not specified, show anyway as requested.
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        ${lang === 'zh'
          ? `
            ${renderRichText(zh)}
            ${renderRichText(en)}
          `
          : `
            ${renderRichText(en)}
          `
        }
      </div>
    `;
  }

  function renderAccessories(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.accessoriesImages)) {
      item.accessoriesImages.forEach((p) => p && imgs.push(p));
    } else if (item && item.accessoriesImage) {
      imgs.push(item.accessoriesImage);
    }
    if (!imgs.length) return '';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${lang === 'zh' ? '配件' : 'Accessories'}</div>
        <div class="tent-type-detail__visuals" style="grid-template-columns: 1fr;">
          ${imgs.map((src) => {
            const s = wkAssetUrl(safe(src));
            const isStarAccessories = /startentaccessories\.png$/i.test(s) || s.includes('startentaccessories.png');
            const cls = isStarAccessories ? 'tent-type-detail__visual tent-type-detail__visual--small' : 'tent-type-detail__visual';
            return `<img class=\"${cls}\" src=\"${s}\" alt=\"\" loading=\"lazy\" />`;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderPdfGuide(item) {
    const lang = getCurrentLang();
    const imgs = [];
    if (item && Array.isArray(item.guideImages)) {
      item.guideImages.forEach((p) => p && imgs.push(p));
    } else if (item && item.guideImage) {
      imgs.push(item.guideImage);
    }
    if (!imgs.length) return '';
    const title = lang === 'zh' ? '产品画册参考' : 'Brochure PDF Guide';
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${title}</div>
        <div class="tent-type-detail__visuals" style="grid-template-columns: 1fr;">
          ${imgs.map((src) => `<img class=\"tent-type-detail__visual\" src=\"${wkAssetUrl(safe(src))}\" alt=\"\" loading=\"lazy\" />`).join('')}
        </div>
      </div>
    `;
  }

  function renderRelatedLinks(item) {
    const lang = getCurrentLang();
    if (item && item.type === 'tent_accessories') {
      return `
      <div class="tent-type-detail__block tent-type-detail__block--accessories-footer-links">
        <div style="display:flex; gap: 10px; flex-wrap: wrap;">
          <a class="btn btn-secondary" href="products-accessories.html">${lang === 'zh' ? '配件专题页（大图）' : 'Accessories page (large view)'}</a>
          <a class="btn btn-outline" href="all-products.html">${lang === 'zh' ? '全部产品目录' : 'Full product catalog'}</a>
        </div>
      </div>
    `;
    }
    if (!item || !item.links || !item.links.length) return '';
    const linksHtml = item.links.map((l) => {
      return `<a class="btn btn-secondary" href="${safe(l.href)}">${lang === 'zh' ? safe(l.labelZh) : safe(l.labelEn)}</a>`;
    }).join(' ');
    return `
      <div class="tent-type-detail__block">
        <div class="tent-type-detail__blockTitle">${lang === 'zh' ? '更多' : 'More'}</div>
        <div style="display:flex; gap: var(--spacing-sm); flex-wrap: wrap;">${linksHtml}</div>
      </div>
    `;
  }

  function renderEmpty(type) {
    const root = document.getElementById('tentTypeRoot');
    if (!root) return;
    root.innerHTML = `
      <div class="ap-empty">
        <p>${type ? 'This tent type is not available yet.' : 'Missing tent type.'}</p>
      </div>
    `;
  }

  function render() {
    let type = getQueryType();
    let variant = getQueryVariant();
    let item = findTentTypeData(type);

    // Back-compat: older inflatable links used type=airt_9/16/25/36/64.
    if (!item && /^airt_/.test(type)) {
      variant = type;
      type = 'inflatable';
      item = findTentTypeData(type);
    }

    const bc = document.getElementById('tentTypeBreadcrumb');
    if (bc) {
      const lang = getCurrentLang();
      bc.textContent = item ? (lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn)) : (lang === 'zh' ? '查看类型' : 'View Type');
    }

    if (!item) {
      renderEmpty(type);
      return;
    }

    const root = document.getElementById('tentTypeRoot');
    if (!root) return;

    root.innerHTML = `
      <div style="margin-bottom: var(--spacing-md);">
        <div class="tent-type-card__imgWrap" style="border-radius: var(--radius-lg); overflow:hidden; border: 1px solid var(--wk-border-light);">
          <img class="tent-type-card__img" src="${wkAssetUrl(item.heroImage)}" alt="" loading="lazy" onerror="this.style.display='none'" />
        </div>
      </div>
      ${renderTableFromSpec(item, variant)}
    `;

    bindTentTypeRfq(root);

    if (item.type === 'tent_accessories' && typeof window.WK_mountAccessoriesGrid === 'function') {
      window.WK_mountAccessoriesGrid('tentTypeAccessoriesGrid', { search: false });
    }

    // Bind variant buttons (inflatable tents)
    root.querySelectorAll('[data-variant]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-variant') || '';
        try {
          const url = new URL(window.location.href);
          if (next) url.searchParams.set('variant', next);
          else url.searchParams.delete('variant');
          history.replaceState({}, '', url.toString());
        } catch (e) {
          // ignore
        }
        render();
      });
    });

    if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
      window.multiLang.translatePage();
    }
  }

  function init() {
    render();
    document.addEventListener('languageChanged', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
