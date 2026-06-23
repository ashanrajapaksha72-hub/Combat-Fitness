<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$store_db = mysqli_connect("localhost", "root", "", "combat_store");

if (!$store_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$result = mysqli_query($store_db, "SELECT COUNT(*) AS total_products FROM products ");

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($store_db)]);
    exit;
}

$row = mysqli_fetch_assoc($result);

echo json_encode([
    'success'      => true,
    'total_products' => $row['total_products']
]);

mysqli_close($store_db);
exit;
?>