// tents.js — render tents category only (Stock / Custom sections)
const tents = [
  {
    id: 2001,
    name: "30 Square Tube Iron Frame Tent",
    category: "stock",
    image: "images/products/tents/30square-tube-frame-iron.png",
    material: "Iron",
    detailPage: "tent-type.html?type=folding30"
  },
  {
    id: 2002,
    name: "40 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "images/products/tents/40square-tube-frame-aluminum.png",
    material: "Aluminum",
    detailPage: "tent-type.html?type=folding40"
  },
  {
    id: 2003,
    name: "50 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "images/products/tents/50square-tube-frame-aluminum.png",
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
