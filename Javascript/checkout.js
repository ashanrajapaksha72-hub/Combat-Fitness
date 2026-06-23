var DELIVERY_FEE = 200;
var cartItems = [];
var selectedPayment = '';
var memberVerified = false;

// Load cart from localStorage
function loadCart() {
    var stored = localStorage.getItem('CartItems');
    cartItems = stored ? JSON.parse(stored) : [];

    var container = document.getElementById('summary-items');

    if (!cartItems.length) {
        container.innerHTML = '<div class="empty-cart-notice">Your cart is empty</div>';
        document.getElementById('place-order-btn').disabled = true;
        updateTotals(0);
        return;
    }

    var subtotal = 0;
    var html = '';

    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        var itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += '<div class="summary-item">' +
            '<span class="item-name">' + item.name + '</span>' +
            '<span class="item-qty">x' + item.quantity + '</span>' +
            '<span class="item-price">Rs. ' + itemTotal.toFixed(2) + '</span>' +
            '</div>';
    }

    container.innerHTML = html;
    updateTotals(subtotal);
}

function updateTotals(subtotal) {
    var total = subtotal + DELIVERY_FEE;
    document.getElementById('summary-subtotal').textContent = 'Rs. ' + subtotal.toFixed(2);
    document.getElementById('summary-total').textContent = 'Rs. ' + total.toFixed(2);
}

// Member ID verification
document.getElementById('last-name').addEventListener('blur', function () {
    var memberId = this.value.trim();
    if (!memberId) return;

    var input = document.getElementById('last-name');
    var verifyStatus = document.getElementById('member-verify-status');

    verifyStatus.textContent = ' Checking...';
    verifyStatus.style.color = '#888';

    fetch('../api/save_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'verify', member_id: memberId })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            if (res.verified) {
                memberVerified = true;
                input.style.borderColor = 'green';
                verifyStatus.textContent = ' Member verified';
                verifyStatus.style.color = 'green';
                // Auto fill name and email if fields are empty
                if (!document.getElementById('first-name').value) {
                    document.getElementById('first-name').value = res.name;
                }
                if (!document.getElementById('email').value) {
                    document.getElementById('email').value = res.email;
                }
                if (!document.getElementById('phone').value) {
                    document.getElementById('phone').value = res.phone;
                }
                if (!document.getElementById('address').value) {
                    document.getElementById('address').value = res.address;
                }
                if (!document.getElementById('city').value) {
                    document.getElementById('city').value = res.city;
                }
            } else {
                memberVerified = false;
                input.style.borderColor = '#e63946';
                verifyStatus.textContent = ' Member ID not found';
                verifyStatus.style.color = '#e63946';
            }
        })
        .catch(function () {
            verifyStatus.textContent = ' Could not verify, check connection';
            verifyStatus.style.color = 'orange';
        });
});

// Payment method selection
function selectPayment(method) {
    selectedPayment = method;

    document.getElementById('opt-card').classList.remove('selected');
    document.getElementById('opt-cod').classList.remove('selected');
    document.getElementById('card-details').classList.remove('show');
    document.getElementById('cod-details').classList.remove('show');

    if (method === 'card') {
        document.getElementById('opt-card').classList.add('selected');
        document.getElementById('card-details').classList.add('show');
    } else if (method === 'cod') {
        document.getElementById('opt-cod').classList.add('selected');
        document.getElementById('cod-details').classList.add('show');
    }
}

// Card number formatting
function formatCardNumber(input) {
    var val = input.value.replace(/\D/g, '').substring(0, 16);
    var parts = [];
    for (var i = 0; i < val.length; i += 4) {
        parts.push(val.substring(i, i + 4));
    }
    input.value = parts.join(' ');
}

//  Expiry formatting
function formatExpiry(input) {
    var val = input.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
        input.value = val.substring(0, 2) + ' / ' + val.substring(2);
    } else {
        input.value = val;
    }
}

//  Validation
function validateForm() {
    var valid = true;
    var fields = [
        { id: 'first-name', errId: 'err-first-name' },
        { id: 'last-name', errId: 'err-last-name' },
        { id: 'email', errId: 'err-email' },
        { id: 'phone', errId: 'err-phone' },
        { id: 'address', errId: 'err-address' },
        { id: 'city', errId: 'err-city' },
        { id: 'province', errId: 'err-province' }
    ];

    for (var i = 0; i < fields.length; i++) {
        var el = document.getElementById(fields[i].id);
        var err = document.getElementById(fields[i].errId);
        if (!el.value.trim()) {
            el.classList.add('error');
            err.style.display = 'block';
            valid = false;
        } else {
            el.classList.remove('error');
            err.style.display = 'none';
        }
    }

    if (!memberVerified) {
        alert('Please enter a valid Member ID before placing the order.');
        valid = false;
    }

    if (!selectedPayment) {
        alert('Please select a payment method.');
        valid = false;
    }

    if (selectedPayment === 'card') {
        var cardName = document.getElementById('card-name').value.trim();
        var cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        var cardExpiry = document.getElementById('card-expiry').value.trim();
        var cardCvv = document.getElementById('card-cvv').value.trim();

        if (!cardName || cardNumber.length < 16 || !cardExpiry || cardCvv.length < 3) {
            alert('Please fill in all card details correctly.');
            valid = false;
        }
    }

    return valid;
}


// Place order
function placeOrder() {
    if (!cartItems.length) {
        alert('Your cart is empty.');
        return;
    }

    if (!validateForm()) return;

    var subtotal = 0;
    for (var i = 0; i < cartItems.length; i++) {
        subtotal += cartItems[i].price * cartItems[i].quantity;
    }
    var total = subtotal + DELIVERY_FEE;

    var orderData = {
        action: 'save',
        member_id: document.getElementById('last-name').value.trim(),
        customer_name: document.getElementById('first-name').value.trim(),
        customer_email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        customer_address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        province: document.getElementById('province').value,
        total_amount: total,
        payment_method: selectedPayment,
        items: cartItems
    };

    var btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Processing...';

    fetch('../api/save_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            if (res.success) {
                localStorage.removeItem('CartItems');
                alert('✅ Payment Successful!\n\nOrder ID: ' + res.order_id + '\nThank you! Your order has been placed successfully.');
                window.location.href = 'Store.html';
            } else {
                alert('❌ ' + res.message);
                btn.disabled = false;
                btn.textContent = 'PLACE ORDER';
            }
        })
        .catch(function (error) {
            alert('Something went wrong. Please try again.');
            console.error('Fetch Error:', error);
            btn.disabled = false;
            btn.textContent = 'PLACE ORDER';
        });
}

// Init
loadCart();