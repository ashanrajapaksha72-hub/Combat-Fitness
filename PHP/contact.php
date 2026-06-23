<?php

include "database.php";

$name    = $_POST['name'];
$email   = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

$sql = "INSERT INTO faq (name, email, subject, question) 
        VALUES ('$name', '$email', '$subject', '$message')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}

$conn->close();

?>