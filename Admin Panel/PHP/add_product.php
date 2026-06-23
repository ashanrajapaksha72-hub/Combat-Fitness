<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
error_log("RAW POST: " . print_r($_POST, true));

//Connect to database
$conn = mysqli_connect("localhost", "root", "", "combat_store");

if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . mysqli_connect_error()]);
    exit;
}


// Read JSON body sent from JavaScript JSON.stringify and Get and validate inputs
$input   = json_decode(file_get_contents('php://input'), true);
$name    = trim($input['name'] ?? '');
$price   = trim($input['price'] ?? '');
$brand   = trim($input['brand'] ?? '');
$stock   = trim($input['stock'] ?? '');
$flavors = $input['flavors'] ?? [];
$images  = $input['images'] ?? [];


if (!is_array($flavors)) $flavors = [$flavors];
if (!is_array($images))  $images  = [$images];

//Validate required fields
if (!$name || !$price || !$brand || !$stock) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, price, brand and stock are required.']);
    exit;
}

if (!is_numeric($price) || !is_numeric($stock)) {
    http_response_code(400);
    echo json_encode(['error' => 'Price and stock must be numbers.']);
    exit;
}

//Clean image paths and remove any empty entries
$images = array_values(array_filter(array_map('trim', $images)));

if (count($images) === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'At least one image path is required.']);
    exit;
}


mysqli_begin_transaction($conn);

//  Insert into products table
$stmt = mysqli_prepare($conn, "INSERT INTO products (name, brand, price, in_stock) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Prepare failed (products): ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "ssdi", $name, $brand, $price, $stock);
if (!mysqli_stmt_execute($stmt)) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Insert failed (products): ' . mysqli_stmt_error($stmt)]);
    exit;
}
// Get the new product's ID so we can link flavors and images to it
$product_id = mysqli_insert_id($conn);
mysqli_stmt_close($stmt);

//Insert flavors
if (!empty($flavors)) {
    $stmt = mysqli_prepare($conn, "INSERT INTO product_flavors (product_id, flavor) VALUES (?, ?)");

    if (!$stmt) {
        mysqli_rollback($conn);
        echo json_encode(['error' => 'Prepare failed (flavors): ' . mysqli_error($conn)]);
        exit;
    }


    foreach ($flavors as $flavor) {
        // Use a temp variable - required by mysqli bind_param in a loop
        $flavor_val = trim($flavor);
        if ($flavor_val === '') continue; // skip empty strings
        mysqli_stmt_bind_param($stmt, "is", $product_id, $flavor_val);
        if (!mysqli_stmt_execute($stmt)) {
            mysqli_rollback($conn);
            echo json_encode(['error' => 'Insert failed (flavors): ' . mysqli_stmt_error($stmt)]);
            exit;
        }
    }
    mysqli_stmt_close($stmt);
}

//Insert image paths with sort_order 0, 1, 2
$stmt = mysqli_prepare($conn, "INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, ?)");
if (!$stmt) {
    mysqli_rollback($conn);
    echo json_encode(['error' => 'Prepare failed (images): ' . mysqli_error($conn)]);
    exit;
}
foreach ($images as $index => $image_path) {
    // Use temp variables - required by mysqli bind_param in a loop
    $sort_order = (int)$index;
    $path_val   = trim($image_path);
    mysqli_stmt_bind_param($stmt, "isi", $product_id, $path_val, $sort_order);
    if (!mysqli_stmt_execute($stmt)) {
        mysqli_rollback($conn);
        echo json_encode(['error' => 'Insert failed (images): ' . mysqli_stmt_error($stmt)]);
        exit;
    }
}
mysqli_stmt_close($stmt);

//All inserts succeeded
mysqli_commit($conn);

echo json_encode([
    'success'    => true,
    'product_id' => $product_id,
    'message'    => 'Product added successfully.'
]);

mysqli_close($conn);
?>