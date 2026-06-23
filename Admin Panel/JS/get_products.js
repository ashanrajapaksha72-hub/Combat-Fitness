document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
});

function loadProducts() {
    fetch('../PHP/get_products.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            var tbody = document.querySelector('#productsTable tbody');
            tbody.innerHTML = '';

            if (response.error) {
                tbody.innerHTML = '<tr><td colspan="5">Error: ' + response.error + '</td></tr>';
                return;
            }

            if (response.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No products found.</td></tr>';
                return;
            }

            var html = '';

            response.forEach(function (product) {
                var price = parseFloat(product.price).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                html += '<tr>' +
                    '<td>' + product.name + '</td>' +
                    '<td>' + product.brand + '</td>' +
                    '<td>' + price + '</td>' +
                    '<td><span class="stock">' + product.in_stock + '</span></td>' +
                    '<td><button class="delete-btn" data-id="' + product.id + '"><i class="fa-solid fa-trash"></i></button></td>' +
                    '</tr>';
            });

            tbody.innerHTML = html;
        })
        .catch(function (err) {
            document.querySelector('#productsTable tbody').innerHTML = '<tr><td colspan="5">Request failed: ' + err.message + '</td></tr>';
        });
}