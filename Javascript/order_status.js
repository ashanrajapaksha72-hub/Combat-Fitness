document.addEventListener('DOMContentLoaded', function () {
    fetch('../api/get_orders.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Failed to load order status.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to load order status.');
                    }
                    return data;
                });
        })
        .then(function (res) {
            var container = document.getElementById('order-status-list');

            if (!res.success) {
                container.innerHTML = '<p class="para">' + (res.message || 'Could not load orders') + '</p>';
                return;
            }

            if (!res.orders.length) {
                container.innerHTML = '<p class="para">No active orders</p>';
                return;
            }

            var statusMap = {
                'pending':   { label: 'Pending Shipment',  textClass: 'yellow-text', barClass: 'yellow-bar' },
                'confirmed':   { label: 'Order is Confirmed',  textClass: 'green-text',  barClass: 'green-bar'  },
                'ready': { label: 'Order is Ready',         textClass: 'green-text',  barClass: 'green-bar'  },
                'completed': { label: 'Order is completed',         textClass: 'green-text',  barClass: 'green-bar'  },
                'cancelled': { label: 'Order is Cancelled',         textClass: 'red-text',    barClass: 'red-bar'    },
                'canceled':  { label: 'Order is Cancelled',         textClass: 'red-text',    barClass: 'red-bar'    }
            };

            var html = '';
            for (var i = 0; i < res.orders.length; i++) {
                var order      = res.orders[i];
                var statusKey  = (order.status || '').toLowerCase();
                var statusInfo = statusMap[statusKey] || { label: order.status, textClass: 'yellow-text', barClass: 'yellow-bar' };

                html += '<p class="para">Order #' + order.order_id + ' - <span class="' + statusInfo.textClass + '">' + statusInfo.label + '</span></p>' +
                        '<div class="status-bar ' + statusInfo.barClass + '"></div>';
            }

            container.innerHTML = html;
        })
        .catch(function () {
            document.getElementById('order-status-list').innerHTML = '<p class="para">Failed to load order status</p>';
        });
});