
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginBtn").addEventListener("click", function () {

        let email    = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value;
        let messageEl = document.getElementById("message");

        if (email === "" || password === "") {
            messageEl.textContent = "Please fill all fields";
            messageEl.style.color = "red";
            return;
        }

        let formData = new FormData();
        formData.append("email",    email);
        formData.append("password", password);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost/Combat Fitness/PHP/login.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);

                if (response.status === "success") {
                    messageEl.textContent = "Login Successful! Redirecting...";
                    messageEl.style.color = "green";

                    setTimeout(function () {
                        // ✅ Redirect based on role
                        if (response.role === "admin") {
                            window.location.href = "../Admin Panel/HTML/dashboard.html";
                        } else {
                            window.location.href = "Dashboard.html";
                        }
                    }, 1500);

                } else {
                    messageEl.textContent = response.message;
                    messageEl.style.color = "red";
                }
            }
        };

        xhr.onerror = function () {
            messageEl.textContent = "Login failed. Please try again.";
            messageEl.style.color = "red";
        };

        xhr.send(formData);
    });
});