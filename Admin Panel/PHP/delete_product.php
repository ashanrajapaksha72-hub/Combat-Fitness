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

// Read JSON body
$input      = json_decode(file_get_contents('php://input'), true);
$product_id = isset($input['id']) ? (int)$input['id'] : 0;

if ($product_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid product ID.']);
    exit;
}


mysqli_begin_transaction($conn);

//Delete from product_images
$stmt = mysqli_prepare($conn, "DELETE FROM product_images WHERE product_id = ?");
if (!$stmt) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Prepare failed (images): ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "i", $product_id);
if (!mysqli_stmt_execute($stmt)) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Delete failed (images): ' . mysqli_stmt_error($stmt)]);
    exit;
}
mysqli_stmt_close($stmt);

//Delete from product_flavors
$stmt = mysqli_prepare($conn, "DELETE FROM product_flavors WHERE product_id = ?");
if (!$stmt) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Prepare failed (flavors): ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "i", $product_id);
if (!mysqli_stmt_execute($stmt)) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Delete failed (flavors): ' . mysqli_stmt_error($stmt)]);
    exit;
}
mysqli_stmt_close($stmt);

//Delete from products
$stmt = mysqli_prepare($conn, "DELETE FROM products WHERE id = ?");
if (!$stmt) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Prepare failed (product): ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "i", $product_id);
if (!mysqli_stmt_execute($stmt)) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Delete failed (product): ' . mysqli_stmt_error($stmt)]);
    exit;
}

// Check if a product was actually found and deleted
if (mysqli_stmt_affected_rows($stmt) === 0) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Product not found.']);
    exit;
}
mysqli_stmt_close($stmt);

mysqli_commit($conn);

echo json_encode([
    'success' => true,
    'message' => 'Product deleted successfully.'
]);

mysqli_close($conn);
?>