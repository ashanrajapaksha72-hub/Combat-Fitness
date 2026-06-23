<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "combat_store");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

$search = isset($_GET['search'])
    ? "%" . $conn->real_escape_string($_GET['search']) . "%"
    : "%";

$stmt = $conn->prepare("
    SELECT p.id, p.name, p.price,
            pi.image_path AS image
    FROM products p
    LEFT JOIN product_images pi
            ON pi.product_id = p.id AND pi.sort_order = 0
    WHERE p.name LIKE ?
    ORDER BY p.id
");
$stmt->bind_param("s", $search);
$stmt->execute();

$result = $stmt->get_result();
$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);
$stmt->close();
$conn->close();
?>