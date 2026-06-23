document.addEventListener('DOMContentLoaded', function () {
    var urlParams = new URLSearchParams(window.location.search);
    var orderId = urlParams.get('order_id');

    if (!orderId) {
        alert('No order ID specified.');
        window.location.href = 'ordermanagment.html';
        return;
    }

    loadOrderDetails(orderId);

    document.getElementById('edit-order-form').addEventListener('submit', function (e) {
        e.preventDefault();
        saveOrder(orderId);
    });

    document.querySelectorAll('.btn-outline').forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.location.href = 'ordermanagment.html';
        });
    });
});

function loadOrderDetails(orderId) {
    var url = '../PHP/get_orders.php?order_id=' + encodeURIComponent(orderId);

    fetch(url, {
        method: 'GET'
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Could not load order details.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.error || 'Could not load order details.');
                    }
                    return data;
                });
        })
        .then(function (order) {
            populateOrder(order);
        })
        .catch(function (err) {
            console.error('Failed to load order:', err);
            alert('Could not load order details.');
        });
}

function populateOrder(order) {
    document.getElementById('breadcrumb-order-number').textContent = 'Edit Order #' + order.order_id;
    document.getElementById('summary-order-id').textContent = '#' + order.order_id;
    document.getElementById('summary-member-id').textContent = order.member_id;
    document.getElementById('summary-total').textContent = 'Rs. ' + parseFloat(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    var dateObj = new Date(order.order_date.replace(' ', 'T'));
    document.getElementById('summary-date').textContent = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    document.getElementById('summary-time').textContent = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    document.getElementById('summary-payment').textContent = order.payment_method ? order.payment_method.toUpperCase() : '-';

    document.getElementById('input-name').value = order.customer_name;
    document.getElementById('input-phone').value = order.phone;
    document.getElementById('input-email').value = order.customer_email;
    document.getElementById('input-address').value = order.customer_address;
    document.getElementById('input-city').value = order.city;
    document.getElementById('input-province').value = order.province;
    document.getElementById('input-status').value = order.status;
}

function saveOrder(orderId) {
    var data = {
        order_id: orderId,
        customer_name: document.getElementById('input-name').value,
        phone: document.getElementById('input-phone').value,
        customer_email: document.getElementById('input-email').value,
        customer_address: document.getElementById('input-address').value,
        city: document.getElementById('input-city').value,
        province: document.getElementById('input-province').value,
        status: document.getElementById('input-status').value
    };

    var formBody = Object.keys(data)
        .map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        })
        .join('&');

    fetch('../PHP/update_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Something went wrong updating the order.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.error || 'Something went wrong updating the order.');
                    }
                    return data;
                });
        })
        .then(function (response) {
            if (response.success) {
                alert('Order updated successfully.');
                window.location.href = 'ordermanagment.html';
            } else {
                alert('Failed to update: ' + (response.error || 'Unknown error'));
            }
        })
        .catch(function () {
            alert('Something went wrong updating the order.');
        });
}