<?php
header('Content-Type: application/json');

// Connect to your database
$conn = new mysqli('localhost', 'root', '', 'combat_fitness');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

// Get posted JSON data
$data     = json_decode(file_get_contents('php://input'), true);
$subject  = $conn->real_escape_string($data['subject']  ?? '');
$question = $conn->real_escape_string($data['question'] ?? '');
$answer   = $conn->real_escape_string($data['answer']   ?? '');

if (!$subject || !$question || !$answer) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

// Insert into your faq table
$sql = "INSERT INTO faq (subject, question, answer, created_at) 
        VALUES ('$subject', '$question', '$answer', NOW())";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Insert failed']);
}

$conn->close();
?>