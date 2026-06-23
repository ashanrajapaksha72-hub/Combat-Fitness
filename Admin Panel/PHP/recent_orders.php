<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$orders_db = mysqli_connect("localhost", "root", "", "combat_orders");

if (!$orders_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$query = "SELECT o.order_id, o.member_id, o.customer_name, o.total_amount, o.status, o.order_date,
                COUNT(oi.item_id) AS item_count
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.order_id
                GROUP BY o.order_id
                ORDER BY o.order_date DESC
                LIMIT 3";

$result = mysqli_query($orders_db, $query);

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