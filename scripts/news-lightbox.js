/**
 * Vanilla lightbox for news article gallery — [data-news-lightbox] wraps clickable images.
 */
(function initNewsLightbox() {
  const lb = document.getElementById('newsLightbox');
  if (!lb) return;

  const lbImg = lb.querySelector('img');
  const closeBtn = document.getElementById('newsLightboxClose');

  function openLightbox(src, alt) {
    if (!lbImg || !src) return;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-news-lightbox]').forEach((wrap) => {
    const open = () => {
      const im = wrap.querySelector('img');
      if (!im) return;
      openLightbox(im.currentSrc || im.src, im.alt);
    };
    wrap.addEventListener('click', open);
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
  });
})();
