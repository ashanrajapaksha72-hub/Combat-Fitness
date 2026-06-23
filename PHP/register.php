<?php
include "database.php";
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST["email"];
    $member_id = $_POST["member_id"];
    $phone = $_POST["phone"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $check = mysqli_query($conn, "SELECT id FROM users WHERE email='$email'");

    if (mysqli_num_rows($check) > 0) {
        echo json_encode(["status" => "exists"]);
        exit();
    }

    $insert = mysqli_query($conn, "INSERT INTO users (email, member_id, phone, password) VALUES ('$email', '$member_id', '$phone', '$password')");

    if ($insert) {
        echo json_encode(["status" => "success"]);
    } else {
        // Show exact MySQL error
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Not a POST request"]);
}
?>