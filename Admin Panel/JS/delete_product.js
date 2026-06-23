//Delete button
// Uses event delegation since rows are dynamically added
document.addEventListener('click', function (e) {
    var btn = e.target.closest('.delete-btn');
    if (!btn) return;

    var productId = btn.dataset.id;
    var row = btn.closest('tr');
    var productName = row.querySelector('td:first-child').textContent;

    // Confirm before deleting
    if (!confirm('Are you sure you want to delete "' + productName + '"?\nThis will also delete all its images and flavours.')) {
        return;
    }

    fetch('../PHP/delete_product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: productId })
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Request failed.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.error || 'Request failed.');
                    }
                    return data;
                });
        })
        .then(function (data) {
            if (data.success) {
                // Remove the row from the table smoothly
                fadeOutAndRemove(row, 300);
            } else {
                alert('Delete failed: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(function (err) {
            alert(err.message || 'Request failed.');
        });
});


//Helper: fade out an element then remove it
function fadeOutAndRemove(el, duration) {
    el.style.transition = 'opacity ' + duration + 'ms';
    el.style.opacity = '1';

    // Force a reflow so the browser registers the starting opacity
    // before we change it, otherwise the transition won't run.
    void el.offsetWidth;

    el.style.opacity = '0';

    setTimeout(function () {
        el.remove();
    }, duration);
}