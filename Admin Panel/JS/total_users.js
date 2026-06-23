document.addEventListener('DOMContentLoaded', function () {
    fetch('../PHP/total_users.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            if (res.success) {
                document.getElementById('stat-total-members').textContent = Number(res.total_users).toLocaleString();
            }
        })
        .catch(function (err) {
            console.error('Failed to load total users:', err);
        });
});