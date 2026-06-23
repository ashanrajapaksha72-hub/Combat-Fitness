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

// Cross-database join
$sql = "
    SELECT
        o.order_id,
        o.member_id,
        u.name AS customer_name,
        u.phone AS customer_phone,
        o.total_amount,
        o.order_date,
        o.status
    FROM combat_orders.orders o
    LEFT JOIN combat_fitness.users u ON o.member_id = u.member_id
    WHERE o.status IN ('pending', 'confirmed', 'ready')
    ORDER BY o.order_date DESC
";

$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . mysqli_error($conn)]);
    exit;
}

$orders = [];

while ($row = mysqli_fetch_assoc($result)) {
    $orders[] = [
        'order_id'       => $row['order_id'],
        'customer_name'  => $row['customer_name'] ?? 'Unknown',
        'customer_phone' => $row['customer_phone'] ?? '-',
        'total_amount'   => $row['total_amount'],
        'order_date'     => $row['order_date'],
        'status'         => $row['status'],
    ];
}

mysqli_close($conn);

echo json_encode($orders);
?>