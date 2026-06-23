document.addEventListener("DOMContentLoaded", function () {

    //CHECK ADMIN ACCESS
    let authXhr = new XMLHttpRequest();
    authXhr.open("GET", "../PHP/check_admin.php", true);

    authXhr.onload = function () {
        if (authXhr.status === 200) {
            let response = JSON.parse(authXhr.responseText);
            if (response.status !== "admin") {
                alert("Unauthorized access!");
                window.location.href = "../../HTML/login.html";
            }
        }
    };

    authXhr.onerror = function () {
        window.location.href = "../../HTML/login.html";
    };

    authXhr.send();

    //LOGOUT
    document.querySelector(".logout-btn").addEventListener("click", function (e) {
        e.preventDefault();

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "../PHP/logout.php", true);
        xhr.onload = function () {
            window.location.replace("http://localhost/Combat%20Fitness/html/login.html");
        };
        xhr.send();
    });

});