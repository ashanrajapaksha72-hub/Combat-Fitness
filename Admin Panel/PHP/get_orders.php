<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "combat_orders");

if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . mysqli_connect_error()]);
    exit;
}

$order_id = $_GET['order_id'] ?? null;

if (!$order_id || !is_numeric($order_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid order ID']);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT order_id, member_id, customer_name, customer_email, customer_address, city, province, phone, order_date, total_amount, status, payment_method FROM combat_orders.orders WHERE order_id = ?");
mysqli_stmt_bind_param($stmt, "i", $order_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode($row);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Order not found']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>