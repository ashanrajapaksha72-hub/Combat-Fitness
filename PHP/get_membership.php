<?php
session_start();
include "database.php";
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["status" => "not_logged_in"]);
    exit();
}

$user_id = $_SESSION["user_id"];
$result  = mysqli_query($conn, "SELECT * FROM memberships WHERE user_id=$user_id");
$membership = mysqli_fetch_assoc($result);

if ($membership) {
    echo json_encode(["status" => "success", "membership" => $membership]);
} else {
    echo json_encode(["status" => "none"]);
}
?>