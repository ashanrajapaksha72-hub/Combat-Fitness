document.addEventListener("DOMContentLoaded", function () {

    let allFAQs = [];

    loadFAQs();

    //LOAD ALL FAQS
    function loadFAQs() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "../PHP/Faq.php?action=get_all", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                allFAQs = JSON.parse(xhr.responseText);
                renderFAQs(allFAQs);
            }
        };
        xhr.send();
    }

    //RENDER FAQ CARDS
    function renderFAQs(data) {
        if (data.length === 0) {
            document.getElementById("faqList").innerHTML =
                `<div class="empty-state">No messages found.</div>`;
            return;
        }

        let cards = "";
        data.forEach(function (faq) {
            cards += `
                <div class="faq-card ${faq.answer ? 'answered' : 'unanswered'}" id="faq-${faq.id}">
                    <div class="faq-meta">
                        <span class="faq-user">
                            <i class="fa-solid fa-user"></i> ${faq.name || 'Anonymous'}
                            &nbsp;·&nbsp;
                            <i class="fa-solid fa-envelope"></i> ${faq.email || '—'}
                            &nbsp;·&nbsp;
                            ${faq.created_at}
                        </span>
                        <span class="faq-badge ${faq.answer ? 'answered' : 'unanswered'}">
                            ${faq.answer ? 'Answered' : 'Unanswered'}
                        </span>
                    </div>
                    <div class="faq-subject">Subject: ${faq.subject || '—'}</div>
                    <div class="faq-question">${faq.question}</div>
                    ${faq.answer
                        ? `<div class="faq-answer">${faq.answer}</div>`
                        : `<div class="faq-answer empty">No reply yet.</div>`
                    }
                    <textarea class="answer-area" id="answer-${faq.id}"
                        placeholder="Type your reply here...">${faq.answer || ''}</textarea>
                    <div class="faq-actions">
                        <button class="btn-clear" onclick="clearAnswer(${faq.id})">Clear</button>
                        <button class="btn-answer" onclick="submitAnswer(${faq.id})">
                            <i class="fa-solid fa-paper-plane"></i>
                            ${faq.answer ? 'Update Reply' : 'Send Reply'}
                        </button>
                    </div>
                </div>`;
        });

        document.getElementById("faqList").innerHTML = cards;
    }

    // ================= FILTER TABS =================
    window.filterFAQ = function (type, btn) {
        document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
        btn.classList.add("active");

        if (type === "all")        renderFAQs(allFAQs);
        if (type === "answered")   renderFAQs(allFAQs.filter(f => f.answer));
        if (type === "unanswered") renderFAQs(allFAQs.filter(f => !f.answer));
    };

    //SUBMIT ANSWER
    window.submitAnswer = function (id) {
        let answer = document.getElementById("answer-" + id).value.trim();

        if (answer === "") {
            showMsg("Please type a reply before submitting.", false);
            return;
        }

        let formData = new FormData();
        formData.append("action", "answer");
        formData.append("id",     id);
        formData.append("answer", answer);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../PHP/Faq.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                if (xhr.responseText.trim() === "success") {
                    showMsg("Reply sent successfully!", true);
                    loadFAQs();
                } else {
                    showMsg(xhr.responseText, false);
                }
            }
        };
        xhr.send(formData);
    };

    //CLEAR ANSWER
    window.clearAnswer = function (id) {
        document.getElementById("answer-" + id).value = "";
    };

    //SHOW MESSAGE
    function showMsg(text, success) {
        let msg = document.getElementById("msg");
        msg.textContent = text;
        msg.className   = "msg " + (success ? "success" : "error");
        setTimeout(() => msg.className = "msg", 3000);
    }

});