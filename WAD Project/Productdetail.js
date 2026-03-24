// ================= PRODUCT DATA =================
const products = [
{
    id: 1,
    name: "Compression Fit T-Shirts",
    brand: "Combat Fitness",
    price: 5500,
    images: ["product1.png", "product1.png", "product1.png"],
    inStock: true
},
{
    id: 2,
    name: "ISOLATE Pre-Workout",
    brand: "WHEY",
    price: 7000,
    images: ["product2.png", "product2.png", "product2.png"],
    inStock: true,
    flavors: ["Fruit Punch", "Blue Raspberry"]
},
{
    id: 3,
    name: "WHEY Protein",
    brand: "WHEY",
    price: 30000,
    images: ["product3.png","Vanilla.png","Strawberry.png"],
    inStock: true,
    flavors: ["Chocolate", "Vanilla", "Strawberry"]
},
{
    id: 4,
    name: "ISOLATED Creatine",
    brand: "Dymatize",
    price: 7000,
    images: ["product4.png","product4.png","product4.png"],
    inStock: true,
    flavors: ["Chocolate", "Vanilla", "Strawberry"]
},
{
    id: 5,
    name:"Compression Shorts",
    brand:"Combat Fitness",
    price: 4000,
    images: ["COmpressionShort.png","COmpressionShort.png","COmpressionShort.png"],
    inStock: true
},
{
    id: 6,
    name:"Compression Long Sleeve Shirt",
    brand:"Combat Fitness",
    price: 6000,
    images: ["CompressionLongSleeves.png","CompressionLongSleeves.png","CompressionLongSleeves.png"],
    inStock: true
},
{
    id: 7,
    name:"Workout Gloves",
    brand:"Combat Fitness",
    price: 2000,
    images: ["WorkoutGloves.png","WorkoutGloves.png","WorkoutGloves.png"],
    inStock: true
},
{
    id: 8,
    name:"Lifting Belts",
    brand:"Yellow",
    price: 5000,
    images: ["LiftingBelts.png","LiftingBelts.png","LiftingBelts.png"],
    inStock: true
},
{
    id: 9,
    name:"Dumbell (15KG)",
    price: 8500,
    images: ["Dumbell.png","Dumbell.png","Dumbell.png"],
    instock: true
},
{
    id: 10,
    name:"Barbell Weight Plates",
    price: 6000,
    images: ["Barbell.png","Barbell.png","Barbell.png"],
    instock: true
}
];

// ================= LOAD PRODUCT =================
const currentId = localStorage.getItem("currentCar");

const product = products.find(p => p.id == currentId);

const container = document.getElementById("product-container");

// ================= DISPLAY PRODUCT =================
container.innerHTML = `
    <div class="image-section">
        <div class="main-image">
            <img id="mainImg" src="${product.images[0]}">
        </div>

        <div class="thumbnails">
            ${product.images.map(img => `
                <img src="${img}" onclick="changeImage('${img}')">
            `).join("")}
        </div>
    </div>

    <div class="details">
        <h1>${product.name}</h1>
        <p class="brand">By <strong>${product.brand}</strong></p>

        <div class="stock" style="color:lime;">
            ✔ In Stock
        </div>

        <!-- ✅ FLAVORS (ONLY IF EXISTS) -->
        ${product.flavors ? `
            <p class="label">Flavors</p>
            <div class="flavors">
                ${product.flavors.map((flavor, index) => `
                    <button class="${index === 0 ? 'active' : ''}">
                        ${flavor}
                    </button>
                `).join("")}
            </div>
        ` : ""}

        <!-- PRICE -->
        <p class="label">Price</p>
        <div class="price">Rs.${product.price}</div>

        <!-- QUANTITY -->
        <p class="label">Quantity</p>
        <div class="quantity">
            <button onclick="decreaseQty()">-</button>
            <span id="qty">1</span>
            <button onclick="increaseQty()">+</button>
        </div>

        <!-- BUTTONS -->
        <div class="buttons">
            <button class="cart" onclick="addToCart()">Add to Cart</button>
            <button class="buy">Buy it now</button>
        </div>
    </div>
`;

// ================= IMAGE CHANGE =================
function changeImage(src) {
  document.getElementById("mainImg").src = src;
}

// ================= QUANTITY =================
function increaseQty() {
  let qty = document.getElementById("qty");
  qty.innerText = parseInt(qty.innerText) + 1;
}

function decreaseQty() {
  let qty = document.getElementById("qty");
  let value = parseInt(qty.innerText);
  qty.innerText = value > 1 ? value - 1 : 1;
}

// ================= ADD TO CART =================
function addToCart() {
  let cart = JSON.parse(localStorage.getItem("CartItems")) || [];

  const quantity = parseInt(document.getElementById("qty").innerText);

  const existing = cart.find(item => item.id == product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity
    });
  }

  localStorage.setItem("CartItems", JSON.stringify(cart));

  alert("Added to cart!");
}