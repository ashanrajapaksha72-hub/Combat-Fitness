<?php
session_start();
include "database.php";
header("Content-Type: application/json");

if(!isset($_SESSION["user_id"])){
    echo json_encode(["status" => "not_logged_in"]);
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){

    $user_id    = $_SESSION["user_id"];
    $plan_name  = $_POST["plan_name"];
    $price      = $_POST["price"];
    $start_date = date("Y-m-d");
    $next_due   = date("Y-m-d", strtotime("+1 month"));

    $check = mysqli_query($conn, "SELECT id FROM memberships WHERE user_id=$user_id");

    if(mysqli_num_rows($check) > 0){
        // ✅ Existing member — renewal
        $payment_type = "renewal";
        $query = mysqli_query($conn, "UPDATE memberships SET
            plan_name  = '$plan_name',
            price      = '$price',
            status     = 'active',
            start_date = '$start_date',
            next_due   = '$next_due'
            WHERE user_id = $user_id");
    } else {
        // New member — first time
        $payment_type = "new";
        $query = mysqli_query($conn, "INSERT INTO memberships
            (user_id, plan_name, price, status, start_date, next_due)
            VALUES ($user_id, '$plan_name', '$price', 'active', '$start_date', '$next_due')");
    }

    if($query){
        // Save to membership_payments history
        $payment_query = mysqli_query($conn, "INSERT INTO membership_payments
            (user_id, plan_name, price, payment_type, payment_method)
            VALUES ($user_id, '$plan_name', '$price', '$payment_type', 'online')");

        if($payment_query){
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
        }
        
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Not a POST request"]);
}
?>