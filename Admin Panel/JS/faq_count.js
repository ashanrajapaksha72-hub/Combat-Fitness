document.addEventListener('DOMContentLoaded', function () {
    fetch('../PHP/faq_count.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            if (res.success) {
                document.getElementById('stat-faq').textContent = Number(res.total_faq).toLocaleString();
            }
        })
        .catch(function (err) {
            console.error('Failed to load FAQ count:', err);
        });
});