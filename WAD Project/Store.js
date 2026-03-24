// ================= PRODUCT DATA =================
const products = [
  {
    id: 1,
    name: "Compression Fit T-Shirts",
    price: 5500,
    image: "product1.png"
  },
  {
    id: 2,
    name: "ISOLATE Pre-Workout",
    price: 7000,
    image: "product2.png"
  },
  {
    id: 3,
    name: "WHEY Protein",
    price: 30000,
    image: "product3.png"
  },
  {
    id: 4,
    name: "ISOLATE Creatine",
    price: 7000,
    image: "product4.png"
  },
  {
    id: 5,
    name:"Compression Shorts",
    price: 4000,
    image:"COmpressionShort.png"
  },
  {
    id: 6,
    name:"Compression Long Sleeve Shirt",
    price: 6000,
    image:"CompressionLongSleeves.png"
  },
  {
    id: 7,
    name:"Workout Gloves",
    price: 2000,
    image:"WorkoutGloves.png"
  },
  {
    id: 8,
    name:"Lifting Belts",
    price: 5000,
    image:"LiftingBelts.png"
  },
  {
    id: 9,
    name:"Dumbell (15KG)",
    price: 8500,
    image:"Dumbell.png"
  },
  {
    id: 10,
    name:"Barbell Weight Plates",
    price: 6000,
    image:"Barbell.png"
  }
];

// ================= LOAD PRODUCTS =================
const productContainer = document.getElementById("products");

function displayProducts(productList) {
  productContainer.innerHTML = "";

  productList.forEach(product => {
    productContainer.innerHTML += `
      <div class="product-card" onclick="openProduct(${product.id})">
          <h3>${product.name}</h3>
          <img src="${product.image}" alt="${product.name}">
          <div class="price-tag">RS : ${product.price}/=</div>
      </div>
    `;
  });
}

// ================= OPEN PRODUCT PAGE =================
function openProduct(id) {
  localStorage.setItem("currentCar", id);

  // redirect to your product page
  window.location.href = "Productdetail.html";
}

// ================= SEARCH FUNCTION =================
const searchInput = document.querySelector(".search-box input");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(value)
  );

  displayProducts(filtered);
});

// ================= INITIAL LOAD =================
displayProducts(products);