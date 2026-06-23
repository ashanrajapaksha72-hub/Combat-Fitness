// Open the modal and clear previous values
function openAddModal() {
    document.getElementById('faqSubject').value  = '';
    document.getElementById('faqQuestion').value = '';
    document.getElementById('faqAnswer').value   = '';
    document.getElementById('faqMsg').style.display = 'none';
    document.getElementById('faqModal').style.display = 'flex';
}

// Close the modal
function closeAddModal() {
    document.getElementById('faqModal').style.display = 'none';
}

// Show success or error message inside the modal
function showFaqMsg(msg, success) {
    var el = document.getElementById('faqMsg');
    el.textContent        = msg;
    el.style.display      = 'block';
    el.style.background   = success ? '#d1fae5' : '#fee2e2';
    el.style.color        = success ? '#065f46' : '#991b1b';
    el.style.border       = success ? '1px solid #6ee7b7' : '1px solid #fca5a5';
}

// Submit FAQ to your backend via fetch
function submitFaq() {
    var subject  = document.getElementById('faqSubject').value.trim();
    var question = document.getElementById('faqQuestion').value.trim();
    var answer   = document.getElementById('faqAnswer').value.trim();

    // Basic validation
    if (!subject || !question || !answer) {
        showFaqMsg('Please fill in all fields.', false);
        return;
    }

    var saveBtn = document.querySelector('#faqModal button[onclick="submitFaq()"]');
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled    = true;

    // Send to your PHP/backend endpoint
    fetch('../PHP/save_faq.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject, question: question, answer: answer })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        saveBtn.textContent = 'Save FAQ';
        saveBtn.disabled    = false;

        if (data.success) {
            showFaqMsg('FAQ saved successfully!', true);
            // Close modal after 1.5 seconds
            setTimeout(closeAddModal, 1500);
        } else {
            showFaqMsg(data.message || 'Failed to save. Try again.', false);
        }
    })
    .catch(function(err) {
        saveBtn.textContent = 'Save FAQ';
        saveBtn.disabled    = false;
        showFaqMsg('Connection error. Try again.', false);
    });
}

// Close modal if user clicks the dark overlay background
document.getElementById('faqModal').addEventListener('click', function(e) {
    if (e.target === this) closeAddModal();
});