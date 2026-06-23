//LOAD PRODUCT FROM DATABASE
const currentId = localStorage.getItem("currentCar");
const container = document.getElementById("product-container");

let product = null;

function loadProduct() {
    fetch(`../api/product_detail.php?id=${currentId}`, {
        method: "GET"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            product = data;
            renderProduct();
        })
        .catch(function (error) {
            container.innerHTML = "<p>Failed to load product.</p>";
            console.error("Fetch Error:", error);
        });
}

//DISPLAY PRODUCT
function renderProduct() {
    container.innerHTML = `
    <div class="image-section">
        <div class="main-image">
            <img id="mainImg" src="${product.images[0]}">
        </div>
        <div class="thumbnails">
            ${product.images.map(img => `
                <img src="${img}" class="thumb-img">
            `).join("")}
        </div>
    </div>

    <div class="details">
        <h1>${product.name}</h1>
        <p class="brand">By <strong>${product.brand ?? "—"}</strong></p>

        <div class="stock" style="color:lime;">
            ${product.in_stock > 0 ? "✔ In Stock" : "✖ Out of Stock"}
        </div>

        ${product.flavors.length > 0 ? `
            <p class="label">Flavors</p>
            <div class="flavors">
                ${product.flavors.map((flavor, index) => `
                    <button class="${index === 0 ? 'active' : ''}" onclick="selectFlavor(this)">
                        ${flavor}
                    </button>
                `).join("")}
            </div>
        ` : ""}

        <p class="label">Price</p>
        <div class="price">Rs.${product.price}</div>

        <p class="label">Quantity</p>
        <div class="quantity">
            <button onclick="decreaseQty()">-</button>
            <span id="qty">1</span>
            <button onclick="increaseQty()">+</button>
        </div>

        <div class="buttons">
            <button class="cart" onclick="addToCart()">Add to Cart</button>
            <button class="buy" onclick="buyNow()">Buy it now</button>
        </div>
    </div>
    `;

    // Attach click events AFTER rendering is done
    document.querySelectorAll(".thumb-img").forEach(img => {
        img.addEventListener("click", function () {
            document.getElementById("mainImg").src = this.src;
        });
    });
}


// BUY IT NOW
function buyNow() {
    let cart = [];

    const quantity = parseInt(document.getElementById("qty").innerText);

    // Get selected flavor if any
    let selectedFlavor = "";
    let activeFlavorBtn = document.querySelector(".flavors button.active");
    if (activeFlavorBtn) {
        selectedFlavor = activeFlavorBtn.textContent.trim();
    }

    //  Add only this product to cart (clear old cart)
    cart.push({
        id:       product.id,
        name:     product.name + (selectedFlavor ? " (" + selectedFlavor + ")" : ""),
        price:    product.price,
        image:    product.images[0],
        quantity: quantity
    });

    // Save to localStorage and redirect
    localStorage.setItem("CartItems", JSON.stringify(cart));
    window.location.href = "checkout.html";
}




//IMAGE CHANGE
function changeImage(src) {
    document.getElementById("mainImg").src = src;
}

//FLAVOR SELECT
function selectFlavor(btn) {
    document.querySelectorAll(".flavors button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

//QUANTITY
function increaseQty() {
    let qty = document.getElementById("qty");
    qty.innerText = parseInt(qty.innerText) + 1;
}

function decreaseQty() {
    let qty = document.getElementById("qty");
    let value = parseInt(qty.innerText);
    qty.innerText = value > 1 ? value - 1 : 1;
}

//  ADD TO CART
function addToCart() {
    let cart = JSON.parse(localStorage.getItem("CartItems")) || [];

    const quantity = parseInt(document.getElementById("qty").innerText);

    const existing = cart.find(item => item.id == product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity
        });
    }

    localStorage.setItem("CartItems", JSON.stringify(cart));
    alert("Added to cart!");
}


//  Wait for page to fully load before running
document.addEventListener("DOMContentLoaded", function () {
    loadProduct();
});