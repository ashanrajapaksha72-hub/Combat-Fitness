<?php
session_start();
include "database.php";
header("Content-Type: application/json");

if(!isset($_SESSION["user_id"])){
    echo json_encode(["status" => "not_logged_in"]);
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){

    $user_id      = $_SESSION["user_id"];
    $name         = $_POST["name"];
    $email        = $_POST["email"];
    $phone        = $_POST["phone"];
    $emergency    = $_POST["emergency"];
    $address      = $_POST["address"];
    $province     = $_POST["province"];
    $city         = $_POST["city"];
    $postal       = $_POST["postal"];
    $bank         = $_POST["bank"];
    $account_name = $_POST["account_name"];
    $card_number  = $_POST["card_number"];
    $card_type    = $_POST["card_type"];

    $update = mysqli_query($conn, "UPDATE users SET
        name         = '$name',
        email        = '$email',
        phone        = '$phone',
        emergency    = '$emergency',
        address      = '$address',
        province     = '$province',
        city         = '$city',
        postal       = '$postal',
        bank         = '$bank',
        account_name = '$account_name',
        card_number  = '$card_number',
        card_type    = '$card_type'
        WHERE id     = $user_id");

    if($update){
        echo json_encode(["status" => "success"]);
    }else{
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

}else{
    echo json_encode(["status" => "error", "message" => "Not a POST request"]);
}
?>