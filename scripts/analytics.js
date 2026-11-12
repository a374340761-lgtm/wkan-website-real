/* Consent-gated GTM conversion events. Never forwards form values or personal data. */
(function () {
  'use strict';
  if (window.wkTrackEvent) return;
  const consentCookieName = 'wk_cookie_consent';
  const methods = {
    begin_lead: ['quote_page', 'product'],
    contact_click: ['whatsapp', 'email', 'phone'],
    generate_lead: ['quote_form'],
    file_download: ['catalog'],
  };

  function readAnalyticsConsent() {
    try {
      if (window.wkCookieConsent && typeof window.wkCookieConsent.get === 'function') {
        return window.wkCookieConsent.get().analytics === true;
      }
      const prefix = `${encodeURIComponent(consentCookieName)}=`;
      const part = String(document.cookie || '').split(';').map((value) => value.trim()).find((value) => value.startsWith(prefix));
      if (!part) return false;
      const consent = JSON.parse(decodeURIComponent(part.slice(prefix.length)));
      return consent && consent.analytics === true;
    } catch {
      return false;
    }
  }

  // Keep only a bounded source classification; never store referrer URLs or queries.
  const sourceKey = 'wk_session_source_v1';
  function sessionSource() {
    if (!readAnalyticsConsent()) return 'unknown';
    try {
      const saved = sessionStorage.getItem(sourceKey);
      const allowed = ['chatgpt', 'gemini', 'perplexity', 'copilot', 'other_referral', 'direct_or_unknown'];
      if (allowed.includes(saved)) return saved;
      let host = '';
      try { host = new URL(document.referrer).hostname.toLowerCase(); } catch {}
      const matches = (domain) => host === domain || host.endsWith('.' + domain);
      let source = 'direct_or_unknown';
      if (matches('chatgpt.com') || matches('chat.openai.com')) source = 'chatgpt';
      else if (matches('gemini.google.com')) source = 'gemini';
      else if (matches('perplexity.ai')) source = 'perplexity';
      else if (matches('copilot.microsoft.com')) source = 'copilot';
      else if (host && host !== window.location.hostname) source = 'other_referral';
      sessionStorage.setItem(sourceKey, source);
      return source;
    } catch { return 'unknown'; }
  }
  window.wkInquiryAttribution = sessionSource;

  function gtagCommand() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function grantAnalyticsConsent() {
    if (!readAnalyticsConsent()) return;
    sessionSource();
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || gtagCommand;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  function denyAnalyticsConsent() {
    try { sessionStorage.removeItem(sourceKey); } catch {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  }

  window.wkTrackEvent = function (name, params) {
    try {
      if (!readAnalyticsConsent()) return;
      grantAnalyticsConsent();
      const method = params && params.contact_method;
      if (!methods[name] || !methods[name].includes(method)) return;
      // Never forward labels, query strings, form values or arbitrary parameters.
      const safe = { contact_method: method, page_path: window.location.pathname, acquisition_source: sessionSource() };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, safe));
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
    } else if (url.origin === window.location.origin && /\/(?:zh\/|de\/)?contact-us\.html$/.test(url.pathname)) {
      window.wkTrackEvent('begin_lead', { contact_method: 'quote_page' });
    }
  });
  document.addEventListener('wk:inquiry-success', function () {
    window.wkTrackEvent('generate_lead', { contact_method: 'quote_form' });
  });
  document.addEventListener('wk:consent-change', function (event) {
    if (event.detail && event.detail.analytics === true) grantAnalyticsConsent();
    else denyAnalyticsConsent();
  });
  grantAnalyticsConsent();
  document.addEventListener('DOMContentLoaded', grantAnalyticsConsent, { once: true });
})();
