document.addEventListener('DOMContentLoaded', function () {

    // Fetch profile from database
    fetch('http://localhost/Combat Fitness/PHP/get_profile.php', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            if (response.status === 'success') {
                var u = response.user;

                document.getElementById('user-name').textContent      = u.name        || 'Not added';
                document.getElementById('user-email').textContent     = u.email       || '';
                document.getElementById('user-phone').textContent     = u.phone       || 'Not added';
                document.getElementById('user-id').textContent        = u.member_id   || 'Not added';
                document.getElementById('user-emergency').textContent = u.emergency   || 'Not added';
                document.getElementById('user-address').textContent   = u.address     || 'Not added';
                document.getElementById('user-province').textContent  = u.province    || 'Not added';
                document.getElementById('user-city').textContent      = u.city        || 'Not added';
                document.getElementById('user-postal').textContent    = u.postal      || 'Not added';
                document.getElementById('user-bank').textContent      = u.bank        || 'Not added';
                document.getElementById('user-account').textContent   = u.account_name || 'Not added';
                document.getElementById('user-card-type').textContent = u.card_type   || 'Not added';

                // Show only last 4 digits of card
                if (u.card_number) {
                    var last4 = u.card_number.slice(-4);
                    document.getElementById('user-card').textContent = '**** **** **** ' + last4;
                } else {
                    document.getElementById('user-card').textContent = 'Not added';
                }

            } else {
                window.location.href = 'login.html';
            }
        })
        .catch(function () {
            window.location.href = 'login.html';
        });

});