// LOAD PRODUCTS FROM DATABASE
const productContainer = document.getElementById("products");

function displayProducts(productList) {
  productContainer.innerHTML = "";

  if (productList.length === 0) {
    productContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

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

function fetchProducts(search = "") {

  const url = search
    ? `../api/products.php?search=${encodeURIComponent(search)}`
    : `../api/products.php`;

  fetch(url, {
    method: "GET"
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (products) {
      displayProducts(products);
    })
    .catch(function (error) {
      productContainer.innerHTML = "<p>Failed to load products. Make sure WAMP is running.</p>";
      console.error("Fetch Error:", error);
    });
}

// OPEN PRODUCT PAGE
function openProduct(id) {
  localStorage.setItem("currentCar", id);
  window.location.href = "Productdetail.html";
}

//  SEARCH
const searchInput = document.querySelector(".search-box input");
searchInput.addEventListener("input", () => {
  fetchProducts(searchInput.value.trim());
});

// INITIAL LOAD
fetchProducts();