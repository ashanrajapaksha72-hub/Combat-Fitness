<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "combat_orders");

if (!$conn) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Connection failed: ' . mysqli_connect_error()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$order_id = $_POST['order_id'] ?? null;

if (!$order_id || !is_numeric($order_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid order ID']);
    exit;
}

$stmt = mysqli_prepare($conn, "DELETE FROM combat_orders.orders WHERE order_id = ?");
mysqli_stmt_bind_param($stmt, "i", $order_id);

if (mysqli_stmt_execute($stmt)) {
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Order not found']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Delete failed: ' . mysqli_stmt_error($stmt)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>