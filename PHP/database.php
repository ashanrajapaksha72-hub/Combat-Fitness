<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "combat_fitness";

$conn = mysqli_connect(
    $servername,
    $username,
    $password,
    $database
);

if (!$conn) {
    header("Content-Type: application/json");
    die(json_encode(["status" => "error", "message" => "Connection Failed: " . mysqli_connect_error()]));
}

?>