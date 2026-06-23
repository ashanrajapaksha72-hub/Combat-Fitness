document.addEventListener("DOMContentLoaded", function () {

    function checkLogin(event) {
        event.preventDefault();
        const targetUrl = event.currentTarget.href;

        
        
        fetch("http://localhost/Combat%20Fitness/PHP/check_session.php", {
            method: "GET",
            credentials: "include"

        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function (data) {
            if (data.status === "logged_in") {
                window.location.href = targetUrl;
            } else {
                alert("Please login first!");
                window.location.href = "http://localhost/Combat%20Fitness/HTML/login.html";
            }
        })
        .catch(function () {
            alert("Please login first!");
            window.location.href = "http://localhost/Combat%20Fitness/HTML/login.html";
        });
    }

    var protectedLinkIds = [
        "Dashboard-link",
        "about-link",
        "plans-link",
        "store-link",
        "cart-link",
        "user-link",
        "user-Faq",
        "user-term",
        "user-policy"
    ];

    protectedLinkIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener("click", checkLogin);
        }
    });

});