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

$order_id          = $_POST['order_id'] ?? null;
$customer_name     = $_POST['customer_name'] ?? '';
$customer_email    = $_POST['customer_email'] ?? '';
$customer_address  = $_POST['customer_address'] ?? '';
$city              = $_POST['city'] ?? '';
$province          = $_POST['province'] ?? '';
$phone             = $_POST['phone'] ?? '';
$status            = $_POST['status'] ?? '';

if (!$order_id || !is_numeric($order_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid order ID']);
    exit;
}

$allowed_statuses = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];
if (!in_array($status, $allowed_statuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid status value']);
    exit;
}

$stmt = mysqli_prepare($conn, "UPDATE combat_orders.orders SET customer_name = ?, customer_email = ?, customer_address = ?, city = ?, province = ?, phone = ?, status = ? WHERE order_id = ?");
mysqli_stmt_bind_param($stmt, "sssssssi", $customer_name, $customer_email, $customer_address, $city, $province,$phone, $status, $order_id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Update failed: ' . mysqli_stmt_error($stmt)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>