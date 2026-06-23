<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

session_start();

if (!isset($_SESSION['member_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$member_id = $_SESSION['member_id'];

$orders_db = mysqli_connect("localhost", "root", "", "combat_orders");

if (!$orders_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$member_id_escaped = mysqli_real_escape_string($orders_db, $member_id);

$result = mysqli_query($orders_db, "SELECT order_id, total_amount, order_date, status, payment_method
                                    FROM orders
                                    WHERE member_id = '$member_id_escaped'
                                    ORDER BY order_date DESC");

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($orders_db)]);
    exit;
}

$orders = [];
while ($row = mysqli_fetch_assoc($result)) {
    $orders[] = $row;
}

echo json_encode(['success' => true, 'orders' => $orders]);
mysqli_close($orders_db);
exit;
?>