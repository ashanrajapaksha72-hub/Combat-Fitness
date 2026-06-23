<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$store_db = mysqli_connect("localhost", "root", "", "combat_store");

if (!$store_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$query = "SELECT p.id, p.name, p.brand, p.price, p.in_stock,
                GROUP_CONCAT(pf.flavor ORDER BY pf.id SEPARATOR ', ') AS flavors
        FROM products p
        LEFT JOIN product_flavors pf ON pf.product_id = p.id
        GROUP BY p.id
        ORDER BY p.id ASC
        LIMIT 4";

$result = mysqli_query($store_db, $query);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($store_db)]);
    exit;
}

$products = [];
while ($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
}

echo json_encode(['success' => true, 'products' => $products]);
mysqli_close($store_db);
exit;
?>