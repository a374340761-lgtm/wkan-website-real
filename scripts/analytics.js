/* Consent-gated conversion events. No tag installation and no personal data. */
(function () {
  'use strict';
  if (window.wkTrackEvent) return;
  const methods = {
    contact_click: ['whatsapp', 'email', 'phone'],
    quote_click: ['quote_page', 'product'],
    file_download: ['catalog'],
    inquiry_submit_success: ['quote_form'],
  };
  window.wkTrackEvent = function (name, params) {
    try {
      if (!window.wkCookieConsent || window.wkCookieConsent.get().analytics !== true) return;
      const method = params && params.contact_method;
      if (!methods[name] || !methods[name].includes(method)) return;
      // Never forward labels, query strings, form values or arbitrary parameters.
      const safe = { contact_method: method, page_path: window.location.pathname };
      if (typeof window.gtag === 'function') window.gtag('event', name, safe);
      else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({ event: name }, safe));
      }
    } catch (error) { /* Analytics must never interrupt an inquiry. */ }
  };
  document.addEventListener('click', function (event) {
    const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;
    let url;
    try { url = new URL(link.getAttribute('href'), window.location.href); } catch { return; }
    if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') {
      window.wkTrackEvent('contact_click', { contact_method: 'whatsapp' });
    } else if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
      window.wkTrackEvent('contact_click', { contact_method: url.protocol === 'mailto:' ? 'email' : 'phone' });
    } else if (link.hasAttribute('download') || /\.pdf$/i.test(url.pathname)) {
      window.wkTrackEvent('file_download', { contact_method: 'catalog' });
    } else if (url.origin === window.location.origin && /\/(?:zh\/)?contact-us\.html$/.test(url.pathname)) {
      window.wkTrackEvent('quote_click', { contact_method: 'quote_page' });
    }
  });
  document.addEventListener('wk:inquiry-success', function () {
    window.wkTrackEvent('inquiry_submit_success', { contact_method: 'quote_form' });
  });
})();
