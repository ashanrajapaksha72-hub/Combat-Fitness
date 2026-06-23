<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "combat_store");

if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . mysqli_connect_error()]);
    exit;
}

$query = "SELECT id, name, brand, price, in_stock FROM combat_store.products ORDER BY id ASC";
$result = mysqli_query($conn, $query);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . mysqli_error($conn)]);
    exit;
}

$products = [];

while ($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
}

echo json_encode($products);

mysqli_free_result($result);
mysqli_close($conn);
?>