/* Shared tent gallery interaction; language is determined by the page URL. */
document.addEventListener('DOMContentLoaded', () => {
  const image = document.getElementById('frameMainImage');
  const caption = document.getElementById('framePhotoCaption');
  const buttons = document.querySelectorAll('[data-frame-photo]');
  buttons.forEach(button => button.addEventListener('click', () => {
    const photo = button.querySelector('img');
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    caption.textContent = photo.alt;
    buttons.forEach(other => {
      other.classList.toggle('is-active', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    });
  }));
});
