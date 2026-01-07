// Six-sided booth page: simple static gallery
(function () {
  'use strict';

  const base = 'images/products/tents/six-sided/\u5706\u9876\u4fc3\u9500\u53f0\u6237\u5916\u4fc3\u9500\u5c55\u793a\u516d\u89d2\u6298\u53e0\u684c\u5706\u9876\u5c55\u793a\u53f0\u5e7f\u544a\u5e10\u7bf7\u67b6\u5c55\u793a\u67b6';
  const files = [
    '\u4e3b\u56fe_005.JPEG',
    '\u4e3b\u56fe_006.JPEG',
    '\u4e3b\u56fe_007.JPEG',
    '\u8be6\u60c5_003.JPEG',
    '\u8be6\u60c5_004.JPEG',
    '\u8be6\u60c5_005.JPEG',
    '\u8be6\u60c5_006.JPEG'
  ];

  function init() {
    const el = document.getElementById('sixSidedGallery');
    if (!el) return;

    el.innerHTML = files.map((f) => {
      const src = `${base}/${encodeURIComponent(f)}`;
      return `<img class="tent-type-detail__visual" src="${src}" alt="" loading="lazy" />`;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
