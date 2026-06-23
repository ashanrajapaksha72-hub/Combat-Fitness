document.addEventListener('DOMContentLoaded', function () {
    fetch('../api/get_orders.php', {
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
            var tbody = document.getElementById('orders-body');

            if (!res.success) {
                tbody.innerHTML = '<tr><td colspan="4">' + (res.message || 'Could not load orders') + '</td></tr>';
                return;
            }

            if (!res.orders.length) {
                tbody.innerHTML = '<tr><td colspan="4">No orders yet</td></tr>';
                return;
            }

            var statusClassMap = {
                'pending': 'on-hold',
                'completed': 'proceed',
                'cancelled': 'canceled',
                'canceled': 'canceled'
            };

            var html = '';
            for (var i = 0; i < res.orders.length; i++) {
                var order = res.orders[i];
                var statusKey = (order.status || '').toLowerCase();
                var statusCls = statusClassMap[statusKey] || 'on-hold';
                var statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                var dateObj = new Date(order.order_date);
                var dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

                html += '<tr>' +
                    '<td><span class="status ' + statusCls + '">' + statusText + '</span></td>' +
                    '<td>Rs: ' + Number(order.total_amount).toLocaleString() + '/=</td>' +
                    '<td>' + dateStr + '</td>' +
                    '<td>Payment via ' + order.payment_method + '</td>' +
                    '</tr>';
            }

            tbody.innerHTML = html;
        })
        .catch(function () {
            document.getElementById('orders-body').innerHTML = '<tr><td colspan="4">Failed to load orders</td></tr>';
        });
});