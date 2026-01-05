// tents.js — render tents category only (Stock / Custom sections)
const tents = [
  {
    id: "tent-30-iron",
    name: "30 Square Tube Iron Frame Tent",
    category: "stock",
    image: "/images/products/tents/30square-tube-frame-iron.png",
    material: "Iron",
    detailPage: "tent-detail.html?id=tent-30-iron"
  },
  {
    id: "tent-40-aluminum",
    name: "40 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "/images/products/tents/40square-tube-frame-aluminum.png",
    material: "Aluminum",
    detailPage: "tent-detail.html?id=tent-40-aluminum"
  },
  {
    id: "tent-50-aluminum",
    name: "50 Hexagon Aluminum Frame Tent",
    category: "stock",
    image: "/images/products/tents/50square-tube-frame-aluminum.png",
    material: "Aluminum",
    detailPage: "tent-detail.html?id=tent-50-aluminum"
  }
];

const container = document.getElementById("tentsContainer");

container.innerHTML = tents.map(t => `
  <div class="tent-card">
    <img src="${t.image}" alt="${t.name}">
    <h3>${t.name}</h3>
    <p>Frame Material: ${t.material}</p>
    <a href="${t.detailPage}" class="btn">View Details</a>
  </div>
`).join("");
