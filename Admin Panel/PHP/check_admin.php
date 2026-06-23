<?php
session_start();
header("Content-Type: application/json");

if(isset($_SESSION["user_id"]) && $_SESSION["role"] === "admin"){
    echo json_encode(["status" => "admin"]);
}else{
    echo json_encode((["status" => "unauthorized"]));
}
?>