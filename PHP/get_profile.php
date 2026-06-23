<?php
session_start();
include "database.php";
header("Content-Type: application/json");

if(!isset($_SESSION["user_id"])){
    echo json_encode(["status" => "not_logged_in"]);
    exit();
}

$user_id = $_SESSION["user_id"];

$result = mysqli_query($conn, "SELECT * FROM users WHERE id=$user_id");
$user = mysqli_fetch_assoc($result);

if($user){
    echo json_encode(["status" => "success", "user" => $user]);
}else{
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
?>