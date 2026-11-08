(function () {
  const { pathname, search, hash } = window.location;
  const legacy = pathname.match(/^\/(?:(zh|de)\/)?(?:news|seo|products)\/(tent-type|flag-type|furniture-type|product-center|product-detail)\.html$/);
  if (legacy) {
    const [, language, page] = legacy;
    window.location.replace((language ? '/' + language : '') + '/' + page + '.html' + search + hash);
    return;
  }

  if (pathname === '/zh/manufacturing-capabilities.html') {
    window.location.replace('/manufacturing-capabilities.html' + search + hash);
    return;
  }

  const locale = pathname.match(/^\/(zh|de)(?:\/|$)/)?.[1];
  const errorPage = locale && '/' + locale + '/404.html';
  if (!errorPage || pathname === errorPage) return;

  fetch(errorPage).then(response => response.ok ? response.text() : '').then(html => {
    if (!html) return;
    const localized = new DOMParser().parseFromString(html, 'text/html');
    const language = locale === 'zh' ? 'zh-CN' : 'de';
    if (localized.documentElement.lang !== language) return;
    document.documentElement.lang = language;
    document.title = localized.title;
    for (const selector of ['header.wk-simple-header', 'main.wk-404', 'footer.contact-bottom']) {
      const source = localized.querySelector(selector);
      if (source) document.querySelector(selector)?.replaceWith(source);
    }
  }).catch(() => {});
})();
