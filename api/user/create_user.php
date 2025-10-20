<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (empty($data->username) || empty($data->email) || empty($data->password) || empty($data->role)) {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
    exit();
}

$hashed_password = password_hash($data->password, PASSWORD_BCRYPT);

// ✅ Insert into the 'users' table using the 'name' column and including the 'role'.
$query = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
$stmt = $db->prepare($query);

// Use $data->username from the form for the 'name' column.
$name = htmlspecialchars(strip_tags($data->username)); 
$email = htmlspecialchars(strip_tags($data->email));
$role = htmlspecialchars(strip_tags($data->role));

$stmt->bindParam(':name', $name);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $hashed_password);
$stmt->bindParam(':role', $role);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(array("message" => "User was created."));
} else {
    if ($stmt->errorCode() == 23000) {
        http_response_code(409);
        echo json_encode(array("message" => "Username or email already exists."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create user."));
    }
}
?>