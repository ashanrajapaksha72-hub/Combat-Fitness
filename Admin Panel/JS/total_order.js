document.addEventListener('DOMContentLoaded', function () {
    fetch('../PHP/total_orders.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            if (res.success) {
                document.getElementById('stat-total-orders').textContent = Number(res.total_orders).toLocaleString();
            }
        })
        .catch(function (err) {
            console.error('Failed to load total orders:', err);
        });
});