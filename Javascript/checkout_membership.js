document.addEventListener("DOMContentLoaded", function () {

    // Read plan from URL
    const params = new URLSearchParams(window.location.search);
    const plan   = params.get("plan");

    let planName  = "";
    let planPrice = 0;

    if (plan === "student") {
        planName  = "Student";
        planPrice = 5000;
    } else if (plan === "adult") {
        planName  = "Adult";
        planPrice = 10000;
    } else {
        window.location.href = "plans.html";
    }

    //Update summary
    document.getElementById("summary-plan").textContent  = planName + " Plan";
    document.getElementById("summary-price").textContent = "Rs. " + planPrice.toLocaleString() + ".00";
    document.getElementById("summary-total").textContent = "Rs. " + planPrice.toLocaleString() + ".00";

    //Load user details into form
    let xhr1 = new XMLHttpRequest();
    xhr1.open("GET", "http://localhost/Combat Fitness/PHP/get_profile.php", true);
    xhr1.onload = function () {
        if (xhr1.status === 200) {
            let response = JSON.parse(xhr1.responseText);
            if (response.status === "success") {
                let u = response.user;
                document.getElementById("name").value      = u.name      || "";
                document.getElementById("email").value     = u.email     || "";
                document.getElementById("phone").value     = u.phone     || "";
                document.getElementById("member_id").value = u.member_id || "";
            }
        }
    };
    xhr1.send();

    // Step 4 — Format card number with spaces
    document.getElementById("card_number").addEventListener("input", function () {
        let val = this.value.replace(/\D/g, "").substring(0, 16);
        val = val.replace(/(.{4})/g, "$1 ").trim();
        this.value = val;
    });

    // Format expiry date
    document.getElementById("expiry").addEventListener("input", function () {
        let val = this.value.replace(/\D/g, "").substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + " / " + val.substring(2);
        this.value = val;
    });

    //Pay Now button
    document.getElementById("payBtn").addEventListener("click", function () {

        // Validate fields
        if (document.getElementById("name").value === "" ||
            document.getElementById("phone").value === "") {
            alert("Please fill in your personal details.");
            return;
        }

        if (document.getElementById("card_name").value === ""   ||
            document.getElementById("card_number").value === "" ||
            document.getElementById("expiry").value === ""      ||
            document.getElementById("cvv").value === "") {
            alert("Please fill in your card details.");
            return;
        }

        // Send to PHP
        let formData = new FormData();
        formData.append("plan_name", planName);
        formData.append("price",     planPrice);

        let xhr2 = new XMLHttpRequest();
        xhr2.open("POST", "http://localhost/Combat Fitness/PHP/save_membership.php", true);
        xhr2.onload = function () {
            if (xhr2.status === 200) {
                let response = JSON.parse(xhr2.responseText);
                if (response.status === "success") {
                    alert("Payment Successful! Welcome to Combat Fitness!");
                    window.location.href = "Dashboard.html";
                } else {
                    alert("Error: " + response.message);
                }
            }
        };
        xhr2.onerror = function () {
            alert("Something went wrong. Please try again.");
        };
        xhr2.send(formData);
    });

});