<?php
session_start();
include "database.php";
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST["email"];
    $password = $_POST["password"];

    $stmt = mysqli_prepare($conn, "SELECT * FROM users WHERE email = ?");
    mysqli_stmt_bind_param($stmt, 's', $email);
    mysqli_stmt_execute($stmt);
    $check = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($check) == 0) {
        echo json_encode(["status" => "not_found", "message" => "Email not registered"]);
        exit();
    }

    $user = mysqli_fetch_assoc($check);

    if (password_verify($password, $user["password"])) {
        $_SESSION["user_id"]   = $user["id"];
        $_SESSION["email"]     = $user["email"];
        $_SESSION["member_id"] = $user["member_id"];
        $_SESSION["role"]      = $user["role"];        //

        echo json_encode([
            "status" => "success",
            "role"   => $user["role"]                  //
        ]);
    } else {
        echo json_encode(["status" => "wrong_password", "message" => "Incorrect password"]);
    }
}
?>