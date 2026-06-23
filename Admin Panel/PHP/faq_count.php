<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$faq_db = mysqli_connect("localhost", "root", "", "combat_fitness");

if (!$faq_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$result = mysqli_query($faq_db, "SELECT COUNT(*) AS total_faq FROM faq");

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($faq_db)]);
    exit;
}

$row = mysqli_fetch_assoc($result);

echo json_encode([
    'success'      => true,
    'total_faq' => $row['total_faq']
]);

mysqli_close($faq_db);
exit;
?>