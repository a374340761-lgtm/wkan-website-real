/* Interactions for statically rendered products using the shared product-detail layout. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-static-product]');
  if (!root) return;
  const image = root.querySelector('#productImage');
  const caption = root.querySelector('#staticPhotoCaption');
  const photos = [...root.querySelectorAll('[data-static-photo]')];
  photos.forEach(button => button.addEventListener('click', () => {
    const photo = button.querySelector('img');
    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.alt;
    photos.forEach(other => {
      const active = other === button;
      other.setAttribute('aria-pressed', String(active));
      other.querySelector('img').classList.toggle('is-active', active);
    });
  }));
  const tabs = [...root.querySelectorAll('[data-static-tab]')];
  const panels = [...root.querySelectorAll('.tab-panel')];
  function activate(tab) {
    tabs.forEach(other => {
      const active = other === tab;
      other.classList.toggle('active', active);
      other.setAttribute('aria-selected', String(active));
      other.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => panel.classList.toggle('active', panel.id === 'tab-' + tab.dataset.staticTab));
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next]);
      tabs[next].focus();
    });
  });
  root.querySelector('[data-static-cart]').addEventListener('click', () => {
    const manager = window.productManager;
    const product = manager && manager.products.find(item => String(item.id) === root.dataset.staticProduct);
    if (product) manager.addToCart({ ...product, customRfqUrl: window.location.pathname });
  });
});
