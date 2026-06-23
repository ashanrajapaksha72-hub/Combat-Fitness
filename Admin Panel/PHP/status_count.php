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

$stats = [
    'total' => 0,
    'pending' => 0,
    'confirmed' => 0,
    'ready' => 0,
    'completed' => 0,
];

$result = mysqli_query($conn, "SELECT status, COUNT(*) as count FROM orders GROUP BY status");

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . mysqli_error($conn)]);
    exit;
}

while ($row = mysqli_fetch_assoc($result)) {
    $status = strtolower(trim($row['status']));
    $count = (int)$row['count'];
    $stats['total'] += $count;

    if (isset($stats[$status])) {
        $stats[$status] = $count;
    }
}

mysqli_close($conn);

echo json_encode($stats);
?>