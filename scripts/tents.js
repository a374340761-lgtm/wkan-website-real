// tents.js — render tents category only (Stock / Custom sections)
const tents = [
  {
    id: 2001,
    name: "30 Square Tube Iron Frame Tent",
    category: "stock",
    image: "images/products/tents/30square-tube-frame-iron.png",
    material: "Iron",
    detailPage: "product-detail.html?sku=" + encodeURIComponent(2001)
  },
  {
    id: 2002,
    name: "40 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "images/products/tents/40square-tube-frame-aluminum.png",
    material: "Aluminum",
    detailPage: "product-detail.html?sku=" + encodeURIComponent(2002)
  },
  {
    id: 2003,
    name: "50 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "images/products/tents/50square-tube-frame-aluminum.png",
    material: "Aluminum",
    detailPage: "product-detail.html?sku=" + encodeURIComponent(2003)
  }
];

const container = document.getElementById("tentsContainer");

container.innerHTML = tents.map(t => `
  <div class="tent-card">
    <img src="${t.image}" alt="${t.name}">
    <h3>${t.name}</h3>
    <p>Frame Material: ${t.material}</p>
    <a class="btn btn-secondary product-details-btn" href="product-detail.html?sku=${encodeURIComponent(t.id)}" data-translate="view_details"></a>
  </div>
`).join("");
