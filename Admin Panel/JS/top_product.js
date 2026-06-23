document.addEventListener('DOMContentLoaded', function () {
    fetch('../PHP/top_product.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Failed to load products.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to load products.');
                    }
                    return data;
                });
        })
        .then(function (res) {
            var container = document.getElementById('product-table-body');

            if (!res.success) {
                container.innerHTML = '<div class="product-row"><span class="product-meta">' + (res.message || 'Could not load products') + '</span></div>';
                return;
            }

            if (!res.products.length) {
                container.innerHTML = '<div class="product-row"><span class="product-meta">No products found</span></div>';
                return;
            }

            var html = '';
            for (var i = 0; i < res.products.length; i++) {
                var p = res.products[i];
                var meta = p.brand ? p.brand : '';
                if (p.flavors) {
                    meta += (meta ? ' &middot; ' : '') + p.flavors;
                }

                html += '<div class="product-row">' +
                    '<div class="product-thumb"><i class="fa-solid fa-box"></i></div>' +
                    '<div class="product-info">' +
                        '<div class="product-name">' + p.name + '</div>' +
                        '<div class="product-meta">' + meta + '</div>' +
                    '</div>' +
                    '<span class="product-price">Rs. ' + Number(p.price).toLocaleString() + '</span>' +
                '</div>';
            }

            container.innerHTML = html;
        })
        .catch(function () {
            document.getElementById('product-table-body').innerHTML = '<div class="product-row"><span class="product-meta">Failed to load products</span></div>';
        });
});