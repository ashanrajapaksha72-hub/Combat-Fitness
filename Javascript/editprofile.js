document.addEventListener("DOMContentLoaded", function () {

    //  Load current data into the form fields
    fetch("http://localhost/Combat Fitness/PHP/get_profile.php", {
        method: "GET"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            if (response.status === "success") {
                let u = response.user;

                document.getElementById("name").value         = u.name         || "";
                document.getElementById("email").value        = u.email        || "";
                document.getElementById("phone").value        = u.phone        || "";
                document.getElementById("emergency").value    = u.emergency    || "";
                document.getElementById("address").value      = u.address      || "";
                document.getElementById("province").value     = u.province     || "";
                document.getElementById("city").value         = u.city         || "";
                document.getElementById("postal").value       = u.postal       || "";
                document.getElementById("bank").value         = u.bank         || "";
                document.getElementById("accountName").value  = u.account_name || "";
                document.getElementById("card").value         = u.card_number  || "";
                document.getElementById("cardType").value     = u.card_type    || "";
            }
        })
        .catch(function (error) {
            console.error("Failed to load profile:", error);
        });

    //Save changes when form is submitted
    document.querySelector(".edit-form-container").addEventListener("submit", function (e) {
        e.preventDefault();

        let formData = {
            name:         document.getElementById("name").value,
            email:        document.getElementById("email").value,
            phone:        document.getElementById("phone").value,
            emergency:    document.getElementById("emergency").value,
            address:      document.getElementById("address").value,
            province:     document.getElementById("province").value,
            city:         document.getElementById("city").value,
            postal:       document.getElementById("postal").value,
            bank:         document.getElementById("bank").value,
            account_name: document.getElementById("accountName").value,
            card_number:  document.getElementById("card").value,
            card_type:    document.getElementById("cardType").value
        };

        let formBody = Object.keys(formData)
            .map(function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(formData[key]);
            })
            .join("&");

        fetch("http://localhost/Combat Fitness/PHP/update_profile.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formBody
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                if (response.status === "success") {
                    alert("Profile updated successfully!");
                    window.location.href = "Membership.html";
                } else {
                    alert("Error: " + response.message);
                }
            })
            .catch(function () {
                alert("Something went wrong. Please try again.");
            });
    });

});