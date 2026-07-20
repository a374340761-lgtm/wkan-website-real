/*
 * Privacy-safe SEO conversion events.
 *
 * This file does not load Google Analytics or set cookies. When a consent-aware
 * GA4 tag is installed, events are sent through gtag. Until then they remain in
 * dataLayer so the same event names can be used by GTM or another analytics tool.
 */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  function cleanParams(params) {
    var output = {};
    Object.keys(params || {}).forEach(function (key) {
      var value = params[key];
      if (value === undefined || value === null || value === '') return;
      output[key] = value;
    });
    return output;
  }

  window.wkTrackEvent = function (name, params) {
    if (!name) return;
    var safeParams = cleanParams(params);
    safeParams.page_path = window.location.pathname;

    if (typeof window.gtag === 'function') {
      window.gtag('event', name, safeParams);
      return;
    }

    window.dataLayer.push(Object.assign({ event: name }, safeParams));
  };

  function linkLabel(link) {
    return String(
      link.getAttribute('aria-label') ||
      link.textContent ||
      link.getAttribute('title') ||
      ''
    ).replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest
      ? event.target.closest('a[href]')
      : null;
    if (!link) return;

    var href = String(link.getAttribute('href') || '').trim();
    var lower = href.toLowerCase();
    var label = linkLabel(link);

    if (lower.indexOf('https://wa.me/') === 0 || lower.indexOf('whatsapp') !== -1) {
      window.wkTrackEvent('generate_lead', {
        contact_method: 'whatsapp',
        link_text: label
      });
      return;
    }

    if (lower.indexOf('mailto:') === 0) {
      window.wkTrackEvent('generate_lead', {
        contact_method: 'email',
        link_text: label
      });
      return;
    }

    if (lower.indexOf('tel:') === 0) {
      window.wkTrackEvent('generate_lead', {
        contact_method: 'phone',
        link_text: label
      });
      return;
    }

    if (link.hasAttribute('download') || /\.pdf(?:$|[?#])/i.test(href)) {
      window.wkTrackEvent('file_download', {
        file_name: href.split('/').pop().split(/[?#]/)[0],
        link_text: label
      });
      return;
    }

    if (/\/(?:zh\/)?contact-us\.html(?:$|[?#])/i.test(href)) {
      window.wkTrackEvent('begin_lead', {
        contact_method: 'quote_page',
        link_text: label
      });
    }
  });

  document.addEventListener('wk:inquiry-success', function () {
    window.wkTrackEvent('generate_lead', {
      contact_method: 'quote_form'
    });
  });
})();
