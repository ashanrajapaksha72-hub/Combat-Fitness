<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$users_db = mysqli_connect("localhost", "root", "", "combat_fitness");

if (!$users_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$result = mysqli_query($users_db, "SELECT COUNT(*) AS total_users FROM users ");

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($users_db)]);
    exit;
}

$row = mysqli_fetch_assoc($result);

echo json_encode([
    'success'      => true,
    'total_users' => $row['total_users']
]);

mysqli_close($users_db);
exit;
?>