<?php
session_start();
header("Content-Type: application/json");

// Direct connection
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

// Get user data
$user_result = mysqli_query($conn, "SELECT * FROM users WHERE id=$user_id");
$user        = mysqli_fetch_assoc($user_result);

// Get membership data
$member_result = mysqli_query($conn, "SELECT * FROM memberships WHERE user_id=$user_id");
$membership    = mysqli_fetch_assoc($member_result);

echo json_encode([
    "status"     => "success",
    "user"       => $user,
    "membership" => $membership
]);
?>