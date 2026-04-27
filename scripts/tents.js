// tents.js — render tents category only (Stock / Custom sections)
const tents = [
  {
    id: 2001,
    name: "30 Square Tube Iron Frame Tent",
    category: "stock",
    image: "images/products/tents/folding30/30mm-square-tube-pop-up-canopy-tent-hero.png",
    material: "Iron",
    detailPage: "tent-type.html?type=folding30"
  },
  {
    id: 2002,
    name: "40 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "images/products/tents/folding40/40mm-hexagon-aluminum-frame-3x6-pop-up-canopy-tent.png",
    material: "Aluminum",
    detailPage: "tent-type.html?type=folding40"
  },
  {
    id: 2003,
    name: "50 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "images/products/tents/folding50/50mm-hexagon-aluminum-frame-canopy-tent-2d-layout-hero.png",
    material: "Aluminum",
    detailPage: "tent-type.html?type=folding50"
  }
];

const container = document.getElementById("tentsContainer");

container.innerHTML = tents.map(t => `
  <div class="tent-card">
    <img src="${t.image}" alt="${t.name}">
    <h3>${t.name}</h3>
    <p>Frame Material: ${t.material}</p>
    <a class="btn btn-secondary product-type-btn" href="${t.detailPage}" data-translate="view_type_button"></a>
  </div>
`).join("");
