<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'combat_fitness');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB error']);
    exit;
}


$sql    = "SELECT question, answer FROM faq WHERE answer IS NOT NULL AND answer != '' ORDER BY id DESC";
$result = $conn->query($sql);

$faqs = [];
while ($row = $result->fetch_assoc()) {
    $faqs[] = $row;
}

echo json_encode(['success' => true, 'data' => $faqs]);
$conn->close();
?>