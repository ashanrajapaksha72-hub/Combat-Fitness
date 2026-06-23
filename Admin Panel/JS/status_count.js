document.addEventListener('DOMContentLoaded', function () {
    loadOrderStats();

});

function loadOrderStats() {
    fetch('../PHP/status_count.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json()
                .catch(function () {
                    throw new Error('Failed to load order stats.');
                })
                .then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to load order stats.');
                    }
                    return data;
                });
        })
        .then(function (data) {
            document.getElementById('stat-total-orders').textContent = data.total;
            document.getElementById('stat-pending-orders').textContent = data.pending;
            document.getElementById('stat-confirmed-orders').textContent = data.confirmed;
            document.getElementById('stat-ready-orders').textContent = data.ready;
            document.getElementById('stat-completed-orders').textContent = data.completed;
        })
        .catch(function (err) {
            console.error('Failed to load order stats:', err);
        });
}