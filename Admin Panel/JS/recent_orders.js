document.addEventListener('DOMContentLoaded', function () {
    fetch('../PHP/recent_orders.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Failed to load orders.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to load orders.');
                    }
                    return data;
                });
        })
        .then(function (res) {
            var container = document.getElementById('order-list');

            if (!res.success) {
                container.innerHTML = '<div class="order-row"><span class="order-item">' + (res.message || 'Could not load orders') + '</span></div>';
                return;
            }

            if (!res.orders.length) {
                container.innerHTML = '<div class="order-row"><span class="order-item">No orders yet</span></div>';
                return;
            }

            var statusClassMap = {
                'pending':   '',
                'shipped':   '',
                'completed': 'delivered',
                'delivered': 'delivered',
                'cancelled': 'pending',
                'canceled':  'pending'
            };

            var html = '';
            for (var i = 0; i < res.orders.length; i++) {
                var order      = res.orders[i];
                var statusKey  = (order.status || '').toLowerCase();
                var statusCls  = statusClassMap[statusKey] !== undefined ? statusClassMap[statusKey] : 'pending';
                var statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                var itemLabel  = order.item_count + (order.item_count == 1 ? ' item' : ' items');

                html += '<div class="order-row">' +
                    '<div class="order-thumb"><i class="fa-solid fa-bag-shopping"></i></div>' +
                    '<div class="order-info">' +
                        '<div class="order-id">Order #' + order.order_id + '</div>' +
                        '<div class="order-item">' + itemLabel + ' &middot; ' + order.customer_name + '</div>' +
                    '</div>' +
                    '<span class="order-price">Rs. ' + Number(order.total_amount).toLocaleString() + '</span>' +
                    '<span class="order-status ' + statusCls + '">' + statusText + '</span>' +
                '</div>';
            }

            container.innerHTML = html;
        })
        .catch(function () {
            document.getElementById('order-list').innerHTML = '<div class="order-row"><span class="order-item">Failed to load orders</span></div>';
        });
});