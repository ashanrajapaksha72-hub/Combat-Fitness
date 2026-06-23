<?php

// Direct connection
$conn = mysqli_connect("localhost", "root", "", "combat_fitness");

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Connection failed"]));
}

header("Content-Type: application/json");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

//GET ALL FAQs
if ($action === 'get_all') {

    $result = mysqli_query($conn, "SELECT * FROM faq ORDER BY id DESC");
    $faqs   = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $faqs[] = $row;
    }

    echo json_encode($faqs);

}

//SUBMIT / UPDATE ANSWER
elseif ($action === 'answer') {

    $id     = $_POST['id'];
    $answer = $_POST['answer'];

    $sql = "UPDATE faq SET answer = '$answer' WHERE id = '$id'";

    if (mysqli_query($conn, $sql)) {
        echo "success";
    } else {
        echo "Error: " . mysqli_error($conn);
    }

}

$conn->close();

?>