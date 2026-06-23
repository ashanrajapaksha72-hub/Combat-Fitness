<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "combat_store");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid product ID"]);
    exit;
}

// Get product
$stmt = $conn->prepare("SELECT id, name, brand, price, in_stock FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();
$stmt->close(); // ← close before next query

if (!$product) {
    http_response_code(404);
    echo json_encode(["error" => "Product not found"]);
    exit;
}

// Get all images
$stmt2 = $conn->prepare("SELECT image_path FROM product_images WHERE product_id = ? ORDER BY sort_order");
$stmt2->bind_param("i", $id);
$stmt2->execute();
$result2 = $stmt2->get_result();
$images = [];
while ($row = $result2->fetch_assoc()) {
    $images[] = $row['image_path'];
}
$stmt2->close();

// Get flavors
$stmt3 = $conn->prepare("SELECT flavor FROM product_flavors WHERE product_id = ?");
$stmt3->bind_param("i", $id);
$stmt3->execute();
$result3 = $stmt3->get_result();
$flavors = [];
while ($row = $result3->fetch_assoc()) {
    $flavors[] = $row['flavor'];
}
$stmt3->close();

$product['images'] = $images;
$product['flavors'] = $flavors;

echo json_encode($product);

$conn->close();
?>