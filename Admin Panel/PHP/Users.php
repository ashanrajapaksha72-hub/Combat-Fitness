<?php

//  Direct connection
$conn = mysqli_connect("localhost", "root", "", "combat_fitness");


if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Connection failed"]);
    exit();
}

header("Content-Type: application/json");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// GET ALL USERS
if ($action === 'get_all') {

    $result = mysqli_query($conn, "SELECT id, name, email, member_id, phone, city, province, address, postal, emergency, bank, account_name, card_number, card_type FROM users ORDER BY id DESC");
    $users = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }

    echo json_encode($users);

}

// ADD USER
elseif ($action === 'add') {

    $name         = mysqli_real_escape_string($conn, $_POST['name']);
    $email        = mysqli_real_escape_string($conn, $_POST['email']);
    $member_id    = mysqli_real_escape_string($conn, $_POST['member_id']);
    $phone        = mysqli_real_escape_string($conn, $_POST['phone']);
    $password     = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $emergency    = mysqli_real_escape_string($conn, $_POST['emergency']);
    $address      = mysqli_real_escape_string($conn, $_POST['address']);
    $city         = mysqli_real_escape_string($conn, $_POST['city']);
    $province     = mysqli_real_escape_string($conn, $_POST['province']);
    $postal       = mysqli_real_escape_string($conn, $_POST['postal']);
    $bank         = mysqli_real_escape_string($conn, $_POST['bank']);
    $account_name = mysqli_real_escape_string($conn, $_POST['account_name']);
    $card_number  = mysqli_real_escape_string($conn, $_POST['card_number']);
    $card_type    = mysqli_real_escape_string($conn, $_POST['card_type']);

    $check = mysqli_query($conn, "SELECT id FROM users WHERE email='$email'");
    if (mysqli_num_rows($check) > 0) {
        echo "Email already exists.";
        exit();
    }

    $sql = "INSERT INTO users (name, email, member_id, phone, password, emergency, address, city, province, postal, bank, account_name, card_number, card_type)
            VALUES ('$name', '$email', '$member_id', '$phone', '$password', '$emergency', '$address', '$city', '$province', '$postal', '$bank', '$account_name', '$card_number', '$card_type')";

    if (mysqli_query($conn, $sql)) {
        echo "success";
    } else {
        echo "Error: " . mysqli_error($conn);
    }

}

// UPDATE USER
elseif ($action === 'update') {

    $id           = mysqli_real_escape_string($conn, $_POST['id']);
    $name         = mysqli_real_escape_string($conn, $_POST['name']);
    $email        = mysqli_real_escape_string($conn, $_POST['email']);
    $member_id    = mysqli_real_escape_string($conn, $_POST['member_id']);
    $phone        = mysqli_real_escape_string($conn, $_POST['phone']);
    $emergency    = mysqli_real_escape_string($conn, $_POST['emergency']);
    $address      = mysqli_real_escape_string($conn, $_POST['address']);
    $city         = mysqli_real_escape_string($conn, $_POST['city']);
    $province     = mysqli_real_escape_string($conn, $_POST['province']);
    $postal       = mysqli_real_escape_string($conn, $_POST['postal']);
    $bank         = mysqli_real_escape_string($conn, $_POST['bank']);
    $account_name = mysqli_real_escape_string($conn, $_POST['account_name']);
    $card_number  = mysqli_real_escape_string($conn, $_POST['card_number']);
    $card_type    = mysqli_real_escape_string($conn, $_POST['card_type']);

    $sql = "UPDATE users SET
                name         = '$name',
                email        = '$email',
                member_id    = '$member_id',
                phone        = '$phone',
                emergency    = '$emergency',
                address      = '$address',
                city         = '$city',
                province     = '$province',
                postal       = '$postal',
                bank         = '$bank',
                account_name = '$account_name',
                card_number  = '$card_number',
                card_type    = '$card_type'
            WHERE id = '$id'";

    if (!empty($_POST['password'])) {
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $sql = "UPDATE users SET
                    name         = '$name',
                    email        = '$email',
                    member_id    = '$member_id',
                    phone        = '$phone',
                    password     = '$password',
                    emergency    = '$emergency',
                    address      = '$address',
                    city         = '$city',
                    province     = '$province',
                    postal       = '$postal',
                    bank         = '$bank',
                    account_name = '$account_name',
                    card_number  = '$card_number',
                    card_type    = '$card_type'
                WHERE id = '$id'";
    }

    if (mysqli_query($conn, $sql)) {
        echo "success";
    } else {
        echo "Error: " . mysqli_error($conn);
    }

}

// DELETE USER
elseif ($action === 'delete') {

    $id = mysqli_real_escape_string($conn, $_POST['id']);

    if (mysqli_query($conn, "DELETE FROM users WHERE id='$id'")) {
        echo "success";
    } else {
        echo "Error: " . mysqli_error($conn);
    }

}

$conn->close();

?>