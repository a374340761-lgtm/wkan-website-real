/* Localizes dynamic text and internal navigation on German pages using a bundled dictionary. */
(function () {
  if (!/^\/de(?:\/|$)/.test(location.pathname)) return;
  const dictionary = window.WK_DE_TEXT || {};
  const routes = new Set(window.WK_DE_PATHS || []);
  const textAttributes = ['aria-label', 'aria-description', 'placeholder', 'title', 'alt'];
  const normalized = text => text.trim().replace(/\s+/g, ' ');
  const lookup = key => Object.hasOwn(dictionary, key) ? dictionary[key] : undefined;
  const translatedNodes = new WeakMap();
  const translatedAttributes = new WeakMap();
  const labelPatterns = [
    [/^(Added to RFQ list): (.+)$/, (label, value) => `${translate(label)}: ${translate(value)}`],
    [/^(\d+)\. (.+)$/, (number, value) => `${number}. ${translate(value)}`],
    [/^(.+) (\(\d+\))$/, (label, count) => `${translate(label)} ${count}`],
  ];

  function translate(value) {
    if (typeof value !== 'string' || !value.trim()) return value;
    const key = normalized(value);
    let translated = lookup(key);
    if (!translated) {
      for (const [pattern, format] of labelPatterns) {
        const match = key.match(pattern);
        if (match) {
          const candidate = format(...match.slice(1));
          if (candidate !== key) translated = candidate;
          break;
        }
      }
    }
    return translated ? value.replace(/^(\s*)[\s\S]*?(\s*)$/, (_, start, end) => start + translated + end) : value;
  }

  function germanLink(value) {
    if (typeof value !== 'string' || !value || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(value)) return value;
    try {
      const url = new URL(value, location.href);
      if (url.origin !== location.origin && url.origin !== 'https://www.waikwantent.com') return value;
      if (/^\/de(?:\/|$)/.test(url.pathname)) return value;
      const path = url.pathname.replace(/^\/zh(?=\/|$)/, '') || '/';
      if (path === '/careers.html') return '/zh/careers.html' + url.search + url.hash;
      return routes.has(path) ? '/de' + path + url.search + url.hash : value;
    } catch {
      return value;
    }
  }

  function localizeText(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script, style, code, kbd, textarea, [contenteditable], [data-de-static]')) return;
    if (translatedNodes.get(node) === node.nodeValue) return;
    const localized = translate(node.nodeValue);
    translatedNodes.set(node, localized);
    if (localized !== node.nodeValue) {
      if (parent.matches('option:not([value])')) parent.value = parent.value;
      node.nodeValue = localized;
    }
  }

  function localizeAttributes(node) {
    const previous = translatedAttributes.get(node) || {};
    for (const name of textAttributes) {
      const value = node.getAttribute(name);
      if (!value || value === previous[name]) continue;
      const localized = translate(value);
      previous[name] = localized;
      if (localized !== value) node.setAttribute(name, localized);
    }
    translatedAttributes.set(node, previous);
    if (node.matches('a[href]:not([hreflang]):not([data-lang])')) {
      const href = node.getAttribute('href');
      const localized = germanLink(href);
      if (localized !== href) node.setAttribute('href', localized);
    }
  }

  function localizeTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      localizeText(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) localizeAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === Node.ELEMENT_NODE) localizeAttributes(node);
      else localizeText(node);
    }
  }

  function translateMarkup(value) {
    if (!/<[^>]+>/.test(value)) return translate(value);
    const template = document.createElement('template');
    template.innerHTML = value;
    localizeTree(template.content);
    return template.innerHTML;
  }

  window.wkGermanText = translate;
  window.wkGermanMarkup = translateMarkup;
  window.wkGermanLink = germanLink;

  function start() {
    localizeTree(document.body);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') localizeText(record.target);
        else if (record.type === 'attributes') localizeAttributes(record.target);
        else for (const node of record.addedNodes) localizeTree(node);
      }
    });
    observer.observe(document.body, {
      subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: [...textAttributes, 'href'],
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
