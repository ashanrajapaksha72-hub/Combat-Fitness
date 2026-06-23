document.addEventListener("DOMContentLoaded", function () {

    const rowsPerPage = 7;
    let currentPage  = 1;
    let allPayments  = [];

    //FETCH PAYMENT HISTORY
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost/Combat Fitness/api/get_payment_history.php", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);

            if (response.status === "not_logged_in") {
                window.location.href = "login.html";
                return;
            }

            if (response.status === "success") {
                allPayments = response.payments;

                if (allPayments.length === 0) {
                    document.getElementById("history-tbody").innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align:center;">No payment history found</td>
                        </tr>`;
                    return;
                }

                renderTable(currentPage);
                renderPagination();
            }
        }
    };

    xhr.onerror = function () {
        document.getElementById("history-tbody").innerHTML = `
            <tr><td colspan="6" style="text-align:center;">Error loading data</td></tr>`;
    };

    xhr.send();

    // RENDER TABLE
    function renderTable(page) {
        let start = (page - 1) * rowsPerPage;
        let end   = start + rowsPerPage;
        let rows  = allPayments.slice(start, end);

        let tbody = document.getElementById("history-tbody");
        tbody.innerHTML = "";

        rows.forEach(function (p, index) {
            let typeLabel  = p.payment_type === "new" ? "New" : "Renewal";
            let typeClass  = p.payment_type === "new" ? "proceed" : "on-hold";
            let statusClass = p.status === "paid" ? "proceed" : "canceled";
            let date       = new Date(p.payment_date).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric"
            });

            let rowClass = (start + index) % 2 === 1 ? "row-highlight" : "";

            tbody.innerHTML += `
                <tr class="${rowClass}">
                    <td>${start + index + 1}</td>
                    <td>${p.plan_name}</td>
                    <td>Rs. ${parseFloat(p.price).toFixed(2)}</td>
                    <td>${date}</td>
                    <td><span class="status ${typeClass}">${typeLabel}</span></td>
                    <td><span class="status ${statusClass}">${p.status.toUpperCase()}</span></td>
                </tr>`;
        });
    }


});