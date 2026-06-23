document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerBtn").addEventListener("click", function () {

        //GET FORM VALUES
        let email = document.getElementById("email").value.trim();
        let memberId = document.getElementById("memberId").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        let messageEl = document.getElementById("message");

        // VALIDATION
        if (email === "" || memberId === "" || phone === "" || password === "" || confirmPassword === "") {
            messageEl.textContent = "Please fill all fields";
            messageEl.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            messageEl.textContent = "Passwords do not match";
            messageEl.style.color = "red";
            return;
        }

        let userData = {
            email: email,
            member_id: memberId,
            phone: phone,
            password: password
        };

        let formBody = Object.keys(userData)
            .map(function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(userData[key]);
            })
            .join("&");

        // FETCH REQUEST
        fetch("http://localhost/Combat Fitness/PHP/register.php", {
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
                    messageEl.textContent = "Registration Successful! Redirecting...";
                    messageEl.style.color = "green";
                    setTimeout(function () {
                        window.location.href = "login.html";
                    }, 1500);
                } else if (response.status === "exists") {
                    messageEl.textContent = "Already Registered! Please LogIn";
                    messageEl.style.color = "red";
                } else {
                    messageEl.textContent = "Something went wrong. Please try again.";
                    messageEl.style.color = "red";
                }
            })
            .catch(function (error) {
                messageEl.textContent = "Registration failed. Please try again.";
                messageEl.style.color = "red";
                console.error("Fetch Error:", error);
            });
    });
});