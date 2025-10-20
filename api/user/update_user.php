<?php
ob_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

include_once '../../config/database.php';

function send_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    ob_end_flush();
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));

    if (!is_object($data)) {
        send_error(400, "Invalid JSON format in request body.");
    }

    if (!isset($data->id) || !is_numeric($data->id)) {
        send_error(400, "A valid User ID is required.");
    }

    $query_parts = [];
    $params_to_bind = [];

    if (isset($data->username)) { 
        $query_parts[] = "name = :name";
        $params_to_bind[':name'] = htmlspecialchars(strip_tags($data->username));
    }
    if (isset($data->email)) { 
        $query_parts[] = "email = :email"; 
        $params_to_bind[':email'] = htmlspecialchars(strip_tags($data->email));
    }
    if (isset($data->role)) { 
        $query_parts[] = "role = :role"; 
        $params_to_bind[':role'] = htmlspecialchars(strip_tags($data->role));
    }
    if (isset($data->status) && in_array($data->status, ['active', 'inactive'])) { 
        $query_parts[] = "status = :status"; 
        $params_to_bind[':status'] = $data->status;
    }

    if (count($query_parts) == 0) {
        send_error(400, "No valid fields provided for update.");
    }
    
    $query = "UPDATE users SET " . implode(", ", $query_parts) . " WHERE id = :id";
    $stmt = $db->prepare($query);

    foreach($params_to_bind as $param => &$val) {
        $stmt->bindParam($param, $val);
    }
    $stmt->bindParam(':id', $data->id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            // ✅ CORRECTED: Changed the typo 'json_code' to the correct 'json_encode'
            echo json_encode(["message" => "User updated successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "User not found or data was unchanged."]);
        }
    } else {
        send_error(503, "Unable to update user. A database error occurred.");
    }

} catch (Throwable $e) {
    send_error(500, "Internal Server Error: " . $e->getMessage());
}

ob_end_flush();
exit();
?>