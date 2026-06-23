const cartContainer = document.getElementById("cart-container");

let cart = JSON.parse(localStorage.getItem("CartItems")) || [];

let subtotal = 0;

function renderCart() {

    if (cart.length === 0) {
        cartContainer.innerHTML = "<h2>Your cart is empty</h2>";
        return;
    }

    cartContainer.innerHTML = "";

    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;

        cartContainer.innerHTML += `
        <div class="card left">
        <div class="product-img">
            <img src="${item.image}">
        </div>

        <div class="product-info">
            <h2>${item.name}</h2>

            <div class="price">Rs.${item.price}.00</div>

            <div class="qty">
                <span>Quantity</span>

                <div class="qty-box">
                    <button type="button" class="qty-btn" onclick="decrease(${index})">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="qty-btn" onclick="increase(${index})">+</button>
                </div>

                <span class="remove" onclick="removeItem(${index})">REMOVE</span>
            </div>
        </div>
      </div>
    `;
    });

    document.getElementById("subtotal").innerText = "Rs." + subtotal + ".00";
    document.getElementById("total").innerText = "Rs." + (subtotal + 200) + ".00";
}

// decrease
function decrease(i) {
    if (cart[i].quantity > 1) {
        cart[i].quantity--;
    }
    updateCart();
}

// increase
function increase(i) {
    cart[i].quantity++;
    updateCart();
}

//  remove
function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

// update
function updateCart() {
    localStorage.setItem("CartItems", JSON.stringify(cart));
    subtotal = 0;
    renderCart();
}

// load
renderCart();