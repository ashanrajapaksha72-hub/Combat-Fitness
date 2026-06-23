document.addEventListener('DOMContentLoaded', function () {
    loadOrders();


    // Optional: refresh every 30 seconds. Remove if you don't want auto-refresh.
    // setInterval(loadOrders, 30000);
});

function loadOrders() {
    fetch('../PHP/order_table.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (orders) {
            renderOrders(orders);
        })
        .catch(function (err) {
            console.error('Failed to load orders:', err);
        });
}

function renderOrders(orders) {
    var tbody = document.querySelector('.orders-table tbody');
    tbody.innerHTML = '';

    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No orders found.</td></tr>';
        return;
    }

    var html = '';

    orders.forEach(function (order) {
        var dateObj = new Date(order.order_date.replace(' ', 'T'));

        var formattedDate = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        var formattedTime = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true
        });

        var formattedTotal = parseFloat(order.total_amount).toLocaleString('en-US', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        });

        var statusClass = order.status.toLowerCase();
        var statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);

        html += '<tr>' +
            '<td>#' + order.order_id + '</td>' +
            '<td>' +
                '<div class="customer-info">' +
                    '<div class="customer-name">' + order.customer_name + '</div>' +
                    '<div class="customer-phone">' + order.customer_phone + '</div>' +
                '</div>' +
            '</td>' +
            '<td>Rs. ' + formattedTotal + '</td>' +
            '<td>' + formattedDate + '<br><small>' + formattedTime + '</small></td>' +
            '<td><span class="status ' + statusClass + '">' + statusLabel + '</span></td>' +
            '<td>' +
                '<button class="action-btn edit" data-id="' + order.order_id + '"><i class="fa-solid fa-pen"></i></button>' +
                '<button class="action-btn delete" data-id="' + order.order_id + '"><i class="fa-solid fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });

    tbody.innerHTML = html;
}