
document.addEventListener('click', function (e) {
    var btn = e.target.closest('.orders-table .action-btn.delete');
    if (!btn) return;

    var orderId = btn.dataset.id;
    var row = btn.closest('tr');

    if (!confirm('Delete order #' + orderId + '? This cannot be undone.')) {
        return;
    }

    fetch('../PHP/delete_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'order_id=' + encodeURIComponent(orderId)
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Something went wrong deleting the order.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.error || 'Something went wrong deleting the order.');
                    }
                    return data;
                });
        })
        .then(function (data) {
            if (data.success) {
                row.remove();
            } else {
                alert('Failed to delete: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(function (err) {
            console.error('Delete request failed:', err);
            alert('Something went wrong deleting the order.');
        });
});