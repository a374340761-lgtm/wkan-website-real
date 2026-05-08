(function () {
    'use strict';

    var TRACKING_KEYS = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'fbclid',
        'gclid',
        'msclkid'
    ];

    function getCanonicalUrl(block) {
        var explicit = block && block.getAttribute('data-share-url');
        var canonical = document.querySelector('link[rel="canonical"]');
        var raw = explicit || (canonical && canonical.href) || window.location.href;

        try {
            var url = new URL(raw, window.location.origin);
            url.hash = '';
            TRACKING_KEYS.forEach(function (key) {
                url.searchParams.delete(key);
            });
            return url.toString();
        } catch (e) {
            return String(raw || '').split('#')[0];
        }
    }

    function withUtm(cleanUrl, source, medium) {
        try {
            var url = new URL(cleanUrl);
            url.searchParams.set('utm_source', source);
            url.searchParams.set('utm_medium', medium);
            url.searchParams.set('utm_campaign', 'product_page_share');
            return url.toString();
        } catch (e) {
            return cleanUrl;
        }
    }

    function copyText(text, button) {
        var promise = navigator.clipboard
            ? navigator.clipboard.writeText(text)
            : new Promise(function (resolve) {
                var field = document.createElement('textarea');
                field.value = text;
                field.setAttribute('readonly', '');
                field.style.position = 'fixed';
                field.style.opacity = '0';
                document.body.appendChild(field);
                field.select();
                document.execCommand('copy');
                document.body.removeChild(field);
                resolve();
            });

        promise.then(function () {
            if (!button) return;
            var original = button.textContent;
            button.textContent = 'Copied';
            setTimeout(function () {
                button.textContent = original;
            }, 1800);
        });
    }

    function getProductName() {
        var el = document.getElementById('productName');
        var name = el ? String(el.textContent || '').trim() : '';
        return name && !/^SKU\s+/i.test(name) ? name : '';
    }

    function renderShareBlock(block) {
        var cleanUrl = getCanonicalUrl(block);
        var isProductDetail = block.hasAttribute('data-share-product-detail');
        var productName = isProductDetail ? getProductName() : '';
        var title = block.getAttribute('data-share-title') || 'Share this page';
        var text = block.getAttribute('data-share-text') || document.title || 'WaiKwan product reference';

        if (isProductDetail && productName) {
            text = 'Share this ' + productName + ' product page from WaiKwan.';
        }

        var linkedInUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(withUtm(cleanUrl, 'linkedin', 'social_share'));
        var whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + withUtm(cleanUrl, 'whatsapp', 'message'));
        var emailUrl = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(text + '\n\n' + withUtm(cleanUrl, 'email', 'referral'));

        block.innerHTML = [
            '<h2 class="page-share-block__title">' + escapeHtml(title) + '</h2>',
            '<p class="page-share-block__text">' + escapeHtml(text) + '</p>',
            '<div class="page-share-block__actions">',
            '<a class="page-share-block__button" href="' + linkedInUrl + '" target="_blank" rel="noopener noreferrer">LinkedIn share</a>',
            '<a class="page-share-block__button" href="' + whatsappUrl + '" target="_blank" rel="noopener noreferrer">WhatsApp share</a>',
            '<a class="page-share-block__button" href="' + emailUrl + '" target="_blank" rel="noopener noreferrer">Email share</a>',
            '<button class="page-share-block__button" type="button" data-copy-clean-url="' + escapeAttr(cleanUrl) + '">Copy link</button>',
            '</div>'
        ].join('');
    }

    function getReferenceTexts(box) {
        var raw = box.getAttribute('data-reference-texts') || '';
        if (!raw) return [];
        try {
            var parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.map(function (item) { return String(item || '').trim(); }).filter(Boolean);
        } catch (e) {}
        return raw.split('|').map(function (item) { return item.trim(); }).filter(Boolean);
    }

    function renderReferenceBox(box) {
        var isProductDetail = box.hasAttribute('data-reference-product-detail');
        var productName = isProductDetail ? getProductName() : '';
        var title = box.getAttribute('data-reference-title') || 'Suggested Reference Text';
        var texts = getReferenceTexts(box);

        if (isProductDetail && productName) {
            texts = [
                'WaiKwan offers the ' + productName + ' for custom event display and advertising projects.',
                'Share this WaiKwan product page as a reference for specifications, custom printing options and quotation requests.',
                'WaiKwan Tent manufactures custom canopy tents, beach flags, light boxes and portable display systems for international buyers.'
            ];
        }

        box.innerHTML = '<h2 class="page-reference-box__title">' + escapeHtml(title) + '</h2>' + texts.map(function (text) {
            return [
                '<div class="page-reference-box__item">',
                '<p>' + escapeHtml(text) + '</p>',
                '<button class="page-reference-box__copy" type="button" data-copy-reference="' + escapeAttr(text) + '">Copy text</button>',
                '</div>'
            ].join('');
        }).join('');
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }

    function renderAll() {
        document.querySelectorAll('.page-share-block').forEach(renderShareBlock);
        document.querySelectorAll('.page-reference-box').forEach(renderReferenceBox);
    }

    function bindCopyActions() {
        document.addEventListener('click', function (event) {
            var button = event.target.closest('[data-copy-clean-url], [data-copy-reference]');
            if (!button) return;
            var text = button.getAttribute('data-copy-clean-url') || button.getAttribute('data-copy-reference') || '';
            if (text) copyText(text, button);
        });
    }

    function watchProductTitle() {
        var el = document.getElementById('productName');
        if (!el || !document.querySelector('[data-share-product-detail], [data-reference-product-detail]')) return;

        var last = '';
        var rerender = function () {
            var current = String(el.textContent || '').trim();
            if (current && current !== last) {
                last = current;
                renderAll();
            }
        };

        rerender();
        new MutationObserver(rerender).observe(el, { childList: true, subtree: true, characterData: true });
        setTimeout(rerender, 300);
        setTimeout(rerender, 1000);
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderAll();
        bindCopyActions();
        watchProductTitle();
    });
}());
