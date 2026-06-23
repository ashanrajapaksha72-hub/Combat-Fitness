document.addEventListener('DOMContentLoaded', function () {
    fetch('../PHP/total_products.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            if (res.success) {
                document.getElementById('stat-products').textContent = Number(res.total_products).toLocaleString();
            }
        })
        .catch(function (err) {
            console.error('Failed to load total products:', err);
        });
});