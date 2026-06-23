document.addEventListener("DOMContentLoaded", function () {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost/Combat Fitness/PHP/get_membership.php", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);

            if (response.status === "success") {
                let m = response.membership;

                let today = new Date().toISOString().split("T")[0];

                document.getElementById("dash-plan").textContent   = m.plan_name;
                document.getElementById("dash-due").textContent    = m.next_due;
                document.getElementById("dash-status").textContent = m.status.toUpperCase();

                // ✅ Show price only if active AND due today
                if (m.status.toLowerCase() === "active" && m.next_due === today) {
                    document.getElementById("dash-fee").textContent = "RS. " + parseFloat(m.price).toFixed(2);
                } else {
                    document.getElementById("dash-fee").textContent = "RS. 0.00";
                }

            } else {
                document.getElementById("dash-plan").textContent   = "No Plan Selected";
                document.getElementById("dash-due").textContent    = "--";
                document.getElementById("dash-status").textContent = "INACTIVE";
                document.getElementById("dash-status").style.color = "red";
                document.getElementById("dash-fee").textContent    = "RS. 0.00";
            }
        }
    };

    xhr.onerror = function () {
        document.getElementById("dash-plan").textContent = "Error loading data";
    };

    xhr.send();

    //  PAY NOW BUTTON
    document.getElementById("payBtn").addEventListener("click", function () {
        let feeText = document.getElementById("dash-fee").textContent;
        let fee     = parseFloat(feeText.replace("RS.", "").trim());

        if (fee > 0) {
            window.location.href = "checkout_membership.html";
        } else {
            alert("It is not time to renew your plan yet!");
        }
    });

});