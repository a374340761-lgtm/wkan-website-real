/* Same-origin transport iframe. Only this window reports results to its parent.
 * Google's HtmlService nests user HTML; validate its owning frame ancestry. */
(function () {
  'use strict';
  if (parent === window) return;
  let active = '', received = false;
  const googleFrame = document.createElement('iframe');
  googleFrame.name = 'google_' + crypto.randomUUID().replace(/-/g, '');
  googleFrame.hidden = true;
  googleFrame.title = 'Google 表格写入服务';
  document.body.append(googleFrame);
  function ownedSource(source) {
    // Cross-origin WindowProxy.parent is readable; never read Google DOM.
    try {
      for (let depth = 0; source && depth < 6; depth++) {
        if (source === googleFrame.contentWindow) return true;
        if (source === source.parent) break;
        source = source.parent;
      }
    } catch (_) { return false; }
    return false;
  }
  window.addEventListener('message', event => {
    const value = event.data;
    if (!value || typeof value !== 'object') return;
    if (event.source === parent && event.origin === location.origin && value.type === 'recruitment-bridge-submit' && !active) {
      const endpoint = String(window.WK_CAREERS_SCRIPT_URL || '');
      if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint) || !value.payload || typeof value.payload.submissionId !== 'string') return;
      active = value.payload.submissionId;
      const form = document.createElement('form'),input = document.createElement('input');
      form.hidden = true; form.method = 'POST'; form.action = endpoint; form.target = googleFrame.name; form.acceptCharset = 'UTF-8';
      input.type = 'hidden'; input.name = 'payload'; input.value = JSON.stringify(value.payload);
      form.append(input); document.body.append(form);
      form.submit();
      return;
    }
    if (!active || received || value.type !== 'recruitment-submit-result' || value.requestId !== active || typeof value.ok !== 'boolean') return;
    if (!/^https:\/\/(script\.google\.com|[a-z0-9.-]+\.googleusercontent\.com)$/.test(event.origin) || !ownedSource(event.source)) return;
    received = true;
    parent.postMessage({type:'recruitment-submit-result',requestId:active,ok:value.ok}, location.origin);
  });
  parent.postMessage({type:'recruitment-bridge-ready'}, location.origin);
})();
