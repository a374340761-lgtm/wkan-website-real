// product-page.js — dedicated product detail page renderer for product.html?id=...
(function () {
	'use strict';

	const escapeHtml = (s) => {
		return String(s == null ? '' : s)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	};

	const getLang = () => {
		try {
			const l = window.multiLang && typeof window.multiLang.getCurrentLanguage === 'function'
				? window.multiLang.getCurrentLanguage()
				: (document.documentElement.getAttribute('lang') || 'en');
			return String(l || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
		} catch (e) {
			return 'en';
		}
	};

	// Many legacy dataset strings are bilingual like “中文 / English”.
	// This helper keeps strict separation by selecting the correct side.
	const pickSide = (text) => {
		const lang = getLang();
		const t = String(text || '').trim();
		if (!t) return '';
		const parts = t.split(' / ');
		if (parts.length === 2) {
			return lang === 'zh' ? parts[0].trim() : parts[1].trim();
		}
		return t;
	};

	const renderList = (items) => {
		const list = Array.isArray(items) ? items.map(pickSide).map((x) => String(x || '').trim()).filter(Boolean) : [];
		if (!list.length) return '';
		return `<ul>${list.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
	};

	const renderVariantTable = (tableDef) => {
		if (!tableDef) return '';
		const lang = getLang();

		const title = (lang === 'zh')
			? (tableDef.titleZh || tableDef.title || '')
			: (tableDef.titleEn || tableDef.title || '');

		const titleKey = tableDef.titleKey;
		const columns = Array.isArray(tableDef.columns) ? tableDef.columns : null;
		const headers = Array.isArray(tableDef.headers)
			? tableDef.headers
			: (lang === 'zh' ? tableDef.headersZh : tableDef.headersEn);
		const rows = Array.isArray(tableDef.rows) ? tableDef.rows : [];
		const items = Array.isArray(tableDef.items) ? tableDef.items : null;
		const steps = Array.isArray(tableDef.steps) ? tableDef.steps : null;
		const description = pickSide(lang === 'zh' ? (tableDef.descriptionZh || tableDef.description || '') : (tableDef.descriptionEn || tableDef.description || ''));

		const titleHtml = titleKey
			? `<h3 data-translate="${escapeHtml(titleKey)}"></h3>`
			: (title ? `<h3>${escapeHtml(pickSide(title))}</h3>` : '');

		let bodyHtml = '';

		if (description) {
			bodyHtml += `<p>${escapeHtml(description)}</p>`;
		}

		if (items && items.length) {
			bodyHtml += renderList(items);
		}

		if (steps && steps.length) {
			bodyHtml += `<ol>${steps.map((s) => `<li>${escapeHtml(pickSide(s))}</li>`).join('')}</ol>`;
		}

		// Table rendering
		const makeTable = (cols, headerLabels) => {
			if ((!cols || !cols.length) && (!headerLabels || !headerLabels.length)) return '';
			const resolvedCols = cols || headerLabels.map((h, idx) => ({ key: String(idx), labelZh: h, labelEn: h }));

			const ths = resolvedCols.map((c) => {
				const label = (lang === 'zh') ? (c.labelZh || c.label || c.key) : (c.labelEn || c.label || c.key);
				return `<th>${escapeHtml(pickSide(label))}</th>`;
			}).join('');

			const tds = rows.map((r) => {
				return `<tr>${resolvedCols.map((c) => `<td>${escapeHtml(pickSide(r && r[c.key]))}</td>`).join('')}</tr>`;
			}).join('');

			return `
				<div class="pdp-table-wrap" style="overflow:auto;">
					<table class="pdp-spec-table" style="width:100%;border-collapse:collapse;">
						<thead><tr>${ths}</tr></thead>
						<tbody>${tds}</tbody>
					</table>
				</div>
			`;
		};

		if ((columns && columns.length) || (headers && headers.length)) {
			bodyHtml += makeTable(columns, headers);
		}

		if (!titleHtml && !bodyHtml) return '';
		return `<section class="pdp-block" style="margin:0 0 18px;">${titleHtml}${bodyHtml}</section>`;
	};

	const waitForProductManager = (cb, tries = 0) => {
		const pm = window.productManager;
		if (pm && Array.isArray(pm.products)) {
			cb(pm);
			return;
		}
		if (tries > 200) {
			cb(null);
			return;
		}
		setTimeout(() => waitForProductManager(cb, tries + 1), 50);
	};

	const getCategoryLabelKey = (cat) => {
		const map = {
			tents: 'home_cat_tents_title',
			flags: 'menu_beach_flags',
			displays: 'menu_popup_displays',
			accessories: 'menu_accessories',
			racegate: 'home_cat_racegate_title',
			custom: 'category_custom'
		};
		return map[String(cat || '').toLowerCase()] || '';
	};

	const render = (pm) => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id') || '';
		const catHint = params.get('cat') || params.get('category') || '';

		if (!id) {
			const hub = catHint ? `product-center.html?cat=${encodeURIComponent(catHint)}` : 'product-center.html';
			window.location.replace(hub);
			return;
		}
		if (!pm) {
			window.location.replace('all-products.html');
			return;
		}

		const product = pm.products.find((p) => p && String(p.id) === String(id));
		if (!product) {
			window.location.replace('all-products.html?q=' + encodeURIComponent(id));
			return;
		}

		// Sync ProductManager language if available
		try {
			if (pm && typeof pm.currentLanguage !== 'undefined') {
				pm.currentLanguage = getLang();
			}
		} catch (e) {}

		const name = pm.getLocalizedName ? pm.getLocalizedName(product) : pickSide(getLang() === 'zh' ? (product.nameZh || product.name) : (product.nameEn || product.name));
		const shortText = pm.getLocalizedDescription ? pm.getLocalizedDescription(product) : pickSide(getLang() === 'zh' ? (product.shortZh || product.descriptionZh || product.short || product.description) : (product.shortEn || product.descriptionEn || product.short || product.description));

		const detailContent = (pm && typeof pm.getProductDetailContent === 'function')
			? pm.getProductDetailContent(product)
			: null;

		// SEO
		document.title = name ? `${name} | Wai Kwan` : 'Product Detail | Wai Kwan';
		const metaDesc = document.querySelector('meta[name="description"]');
		if (metaDesc) metaDesc.content = (shortText || name || '').toString().slice(0, 180);

		// Breadcrumbs
		const bcNav = document.querySelector('.breadcrumbs');
		if (bcNav) {
			const catKey = getCategoryLabelKey(product.category);
			const catLink = `product-center.html?cat=${encodeURIComponent(product.category || '')}`;
			const catFallback = product.category ? String(product.category) : '';
			bcNav.innerHTML = `
				<a href="index.html" data-translate="breadcrumb_home"></a>
				<span class="sep">/</span>
				<a href="product-center.html" data-translate="breadcrumb_products"></a>
				${product.category ? `
					<span class="sep">/</span>
					<a href="${catLink}" ${catKey ? `data-translate="${catKey}"` : ''}>${catKey ? '' : escapeHtml(catFallback)}</a>
				` : ''}
				<span class="sep">/</span>
				<span id="breadcrumbProduct">${escapeHtml(name)}</span>
			`;
		} else {
			const bc = document.getElementById('breadcrumbProduct');
			if (bc) bc.textContent = name;
		}

		// Top text
		const nameEl = document.getElementById('productName');
		if (nameEl) nameEl.textContent = name;
		const descEl = document.getElementById('productDesc');
		if (descEl) descEl.textContent = (shortText || '').trim();

		// Images
		const imageEl = document.getElementById('productImage');
		const carouselEl = document.querySelector('.image-carousel');
		const imgs = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
		const primary = imgs[0] || 'images/placeholder.png';
		if (imageEl) {
			imageEl.src = primary;
			imageEl.alt = name;
			imageEl.onerror = function () { this.src = 'images/placeholder.png'; };
		}
		if (carouselEl) {
			carouselEl.innerHTML = '';
			imgs.slice(0, 8).forEach((src) => {
				const img = document.createElement('img');
				img.src = src;
				img.alt = name;
				img.loading = 'lazy';
				img.onerror = function () { this.style.display = 'none'; };
				img.addEventListener('click', () => {
					if (imageEl) imageEl.src = src;
				});
				carouselEl.appendChild(img);
			});
		}

		// Specs (top) — support both array specs and object specsZh/specsEn
		const specsEl = document.getElementById('productSpecs');
		if (specsEl) {
			specsEl.innerHTML = '';
			const lang = getLang();
			const specObj = (lang === 'zh') ? (product.specsZh || null) : (product.specsEn || null);
			if (specObj && typeof specObj === 'object') {
				Object.keys(specObj).forEach((k) => {
					const v = specObj[k];
					if (!v) return;
					const li = document.createElement('li');
					li.textContent = `${pickSide(k)}: ${pickSide(v)}`;
					specsEl.appendChild(li);
				});
			} else {
				const specs = (lang === 'zh') ? (product.specs || []) : (product.specsEn || product.specs || []);
				(Array.isArray(specs) ? specs : []).forEach((s) => {
					const li = document.createElement('li');
					li.textContent = `• ${pickSide(s)}`;
					specsEl.appendChild(li);
				});
			}
		}

		// Tabs
		const tabDesc = document.getElementById('tab-desc');
		const tabSpecs = document.getElementById('tab-specs');
		const tabApps = document.getElementById('tab-apps');
		const tabDownload = document.getElementById('tab-download');

		const lang = getLang();
		if (tabDesc) {
			if (detailContent) {
				tabDesc.innerHTML = renderList(detailContent.description && detailContent.description[lang]);
			} else {
				tabDesc.innerHTML = shortText ? `<p>${escapeHtml(shortText)}</p>` : '';
			}
		}

		if (tabSpecs) {
			const techHtml = detailContent ? renderList(detailContent.technical && detailContent.technical[lang]) : '';
			const tables = Array.isArray(product.variantTables) ? product.variantTables : [];
			const tableHtml = tables.map(renderVariantTable).filter(Boolean).join('');

			// Optional accessories (shared across TFD series)
			let optionalHtml = '';
			const ids = Array.isArray(product.optionalAccessoryIds) ? product.optionalAccessoryIds : [];
			if (ids.length && typeof pm.createProductElement === 'function') {
				const accessoryProducts = ids
					.map((aid) => pm.products.find((p) => p && String(p.id) === String(aid)))
					.filter(Boolean);
				if (accessoryProducts.length) {
					optionalHtml = `
						<section class="pdp-block" style="margin:0 0 18px;">
							<h3 data-translate="pdp_optional_accessories"></h3>
							<div class="products-grid" id="optionalAccessoriesGrid" style="margin-top:12px;"></div>
						</section>
					`;
					setTimeout(() => {
						const grid = document.getElementById('optionalAccessoriesGrid');
						if (!grid) return;
						grid.innerHTML = '';
						accessoryProducts.forEach((ap) => {
							const el = pm.createProductElement(ap);
							if (el) grid.appendChild(el);
						});
						if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
							window.multiLang.translatePage();
						}
					}, 0);
				}
			}

			tabSpecs.innerHTML = `${tableHtml}${optionalHtml}${techHtml ? `<section class="pdp-block">${techHtml}</section>` : ''}`;
		}

		if (tabApps) {
			if (detailContent) {
				tabApps.innerHTML = renderList(detailContent.applications && detailContent.applications[lang]);
			} else {
				tabApps.innerHTML = `<p>${lang === 'zh' ? '适用于各种活动与展示场景。' : 'Suitable for events and display scenarios.'}</p>`;
			}
		}

		if (tabDownload) {
			tabDownload.innerHTML = product.pdf
				? `<a href="${escapeHtml(product.pdf)}" target="_blank" rel="noopener" class="btn btn-primary" data-translate="btn_download_pdf"></a>`
				: `<p data-translate="download_contact_us"></p>`;
		}

		// Buttons
		const btnQuote = document.getElementById('btnQuote');
		const btnDownload = document.getElementById('btnDownload');
		const btnCart = document.getElementById('btnCart');
		if (btnQuote) btnQuote.onclick = () => pm.openInquiryModal && pm.openInquiryModal(product);
		if (btnDownload) btnDownload.onclick = () => pm.openPdfModal && pm.openPdfModal(product);
		if (btnCart) btnCart.onclick = () => pm.addToCart && pm.addToCart(product);

		// Tabs click behavior
		document.querySelectorAll('.tab').forEach((btn) => {
			btn.addEventListener('click', () => {
				document.querySelectorAll('.tab, .tab-panel').forEach((el) => el.classList.remove('active'));
				btn.classList.add('active');
				const tabId = 'tab-' + btn.dataset.tab;
				const panel = document.getElementById(tabId);
				if (panel) panel.classList.add('active');
			});
		});

		// Related products
		const related = (pm.products || [])
			.filter((p) => p && p.category === product.category && String(p.id) !== String(product.id))
			.slice(0, 4);
		const relatedGrid = document.getElementById('relatedGrid');
		if (relatedGrid) {
			relatedGrid.innerHTML = '';
			related.forEach((p) => {
				const el = pm.createProductElement ? pm.createProductElement(p) : null;
				if (el) relatedGrid.appendChild(el);
			});
		}

		if (window.multiLang && typeof window.multiLang.translatePage === 'function') {
			window.multiLang.translatePage();
		}
	};

	const rerender = () => waitForProductManager(render);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', rerender);
	} else {
		rerender();
	}

	document.addEventListener('languageChanged', () => {
		setTimeout(rerender, 50);
	});
})();
