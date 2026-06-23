<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$orders_db = mysqli_connect("localhost", "root", "", "combat_orders");

if (!$orders_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$result = mysqli_query($orders_db, "SELECT COUNT(*) AS total_orders FROM orders");

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($orders_db)]);
    exit;
}

$row = mysqli_fetch_assoc($result);

echo json_encode([
    'success'      => true,
    'total_orders' => $row['total_orders']
]);

mysqli_close($orders_db);
exit;
?>