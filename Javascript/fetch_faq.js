// Fetch answered FAQs from database and render them
function loadFaqs() {
    var grid = document.getElementById('faqGrid');

    fetch('../api/fetch_faq.php')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        // Clear loading message
        grid.innerHTML = '';

        if (!data.success || !data.data.length) {
            grid.innerHTML = '<div class="faq-empty">No FAQs available yet.</div>';
            return;
        }

        // Build a card for each FAQ
        data.data.forEach(function(faq) {
            var card = document.createElement('div');
            card.className = 'faq-card';
            card.innerHTML =
                '<h3>' + escapeHtml(faq.question) + '</h3>' +
                '<p>'  + escapeHtml(faq.answer)   + '</p>';
            grid.appendChild(card);
        });
    })
    .catch(function(err) {
        grid.innerHTML = '<div class="faq-empty">Failed to load FAQs.</div>';
    });
}

// Prevent XSS — safely escape any HTML characters in DB content
function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// Load on page ready
loadFaqs();