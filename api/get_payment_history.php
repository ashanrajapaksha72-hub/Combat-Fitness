<?php
session_start();
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "combat_fitness");

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Connection failed"]);
    exit();
}

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["status" => "not_logged_in"]);
    exit();
}

$user_id = $_SESSION["user_id"];

$result = mysqli_query($conn, "SELECT * FROM membership_payments
                                WHERE user_id=$user_id
                                ORDER BY payment_date DESC");

$payments = [];
while ($row = mysqli_fetch_assoc($result)) {
    $payments[] = $row;
}

echo json_encode([
    "status"   => "success",
    "payments" => $payments
]);
?>