// Tent Type detail page renderer
(function () {
  'use strict';

  function getCurrentLang() {
    if (window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function') {
      return window.multiLang.getCurrentLanguage();
    }
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang) return htmlLang;
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
      .concat(Array.isArray(data.inflatable) ? data.inflatable : []);
    return all.find((x) => x && x.type === type) || null;
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
    }).join('');

    const bodyHtml = table.rows.map((row) => {
      return `
        <tr>
          ${cols.map((c) => `<td>${safe(row[c.key])}</td>`).join('')}
        </tr>
      `;
    }).join('');

    return `
      <div class="tent-type-detail">
        <div class="tent-type-detail__head">
          <div class="tent-type-detail__title">
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
          </div>
        </div>

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
        </div>

        ${renderStory(item)}
        ${renderInfoBlocks(item)}
        ${renderCommonDetails()}
        ${renderAccessories(item)}
        ${renderPdfGuide(item)}
        ${renderRelatedLinks(item)}
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
            const s = safe(src);
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
          ${imgs.map((src) => `<img class=\"tent-type-detail__visual\" src=\"${safe(src)}\" alt=\"\" loading=\"lazy\" />`).join('')}
        </div>
      </div>
    `;
  }

  function renderRelatedLinks(item) {
    const lang = getCurrentLang();
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
      bc.textContent = item ? (lang === 'zh' ? safe(item.nameZh) : safe(item.nameEn)) : 'View Type';
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
          <img class="tent-type-card__img" src="${safe(item.heroImage)}" alt="" loading="lazy" onerror="this.style.display='none'" />
        </div>
      </div>
      ${renderTableFromSpec(item, variant)}
    `;

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
