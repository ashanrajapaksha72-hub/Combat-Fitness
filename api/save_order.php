<?php

header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

// Database connections
$users_db  = mysqli_connect("localhost", "root", "", "combat_fitness");
$orders_db = mysqli_connect("localhost", "root", "", "combat_orders");

if (!$users_db || !$orders_db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

//  Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data received']);
    exit;
}

$action = isset($data['action']) ? $data['action'] : '';


// Verify member ID only
if ($action === 'verify') {
    $member_id = mysqli_real_escape_string($users_db, trim($data['member_id']));
    $result    = mysqli_query($users_db, "SELECT name, email, phone, address, city  FROM users WHERE member_id = '$member_id'");

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        echo json_encode([
            'verified' => true,
            'name'     => $row['name'],
            'email'    => $row['email'],
            'phone'    => $row['phone'],
            'address'    => $row['address'],
            'city'    => $row['city']

        ]);
    } else {
        echo json_encode(['verified' => false]);
    }
    exit;
}


// Save order
if ($action === 'save') {
    $member_id        = mysqli_real_escape_string($orders_db, trim($data['member_id']));
    $customer_name    = mysqli_real_escape_string($orders_db, trim($data['customer_name']));
    $customer_email   = mysqli_real_escape_string($orders_db, trim($data['customer_email']));
    $customer_address = mysqli_real_escape_string($orders_db, trim($data['customer_address']));
    $city             = mysqli_real_escape_string($orders_db, trim($data['city']));
    $province         = mysqli_real_escape_string($orders_db, trim($data['province']));
    $phone            = mysqli_real_escape_string($orders_db, trim($data['phone']));
    $total_amount     = floatval($data['total_amount']);
    $payment_method   = mysqli_real_escape_string($orders_db, trim($data['payment_method']));
    $items            = $data['items'];

    // Double check member ID exists
    $check = mysqli_query($users_db, "SELECT id FROM users WHERE member_id = '$member_id'");
    if (!$check || mysqli_num_rows($check) === 0) {
        echo json_encode(['success' => false, 'message' => 'Member ID not found']);
        exit;
    }

    // Insert into orders table
    $insert_order = "INSERT INTO orders 
        (member_id, customer_name, customer_email, customer_address, city, province, phone, total_amount, status, payment_method)
        VALUES 
        ('$member_id', '$customer_name', '$customer_email', '$customer_address', '$city', '$province', '$phone', '$total_amount', 'pending', '$payment_method')";

    if (!mysqli_query($orders_db, $insert_order)) {
        echo json_encode(['success' => false, 'message' => 'Failed to save order: ' . mysqli_error($orders_db)]);
        exit;
    }

    $order_id = mysqli_insert_id($orders_db);

    // Insert each item into order_items table
    foreach ($items as $item) {
        $product_id = intval($item['id']);
        $quantity   = intval($item['quantity']);
        $unit_price = floatval($item['price']);
        $subtotal   = $quantity * $unit_price;

        $insert_item = "INSERT INTO order_items 
            (order_id, product_id, quantity, unit_price, subtotal)
            VALUES 
            ('$order_id', '$product_id', '$quantity', '$unit_price', '$subtotal')";

        if (!mysqli_query($orders_db, $insert_item)) {
            echo json_encode(['success' => false, 'message' => 'Failed to save order items: ' . mysqli_error($orders_db)]);
            exit;
        }
    }

    echo json_encode([
        'success'  => true,
        'message'  => 'Order placed successfully',
        'order_id' => $order_id
    ]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Unknown action']);
mysqli_close($users_db);
mysqli_close($orders_db);
?>