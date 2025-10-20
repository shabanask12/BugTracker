<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->id) &&
    !empty($data->status)
) {
    // Basic validation for status
    $allowed_statuses = ['Active', 'Inactive'];
    if (!in_array($data->status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid status provided."));
        exit();
    }

    $query = "UPDATE projects SET status = :status WHERE id = :id";

    $stmt = $db->prepare($query);

    // Sanitize
    $id = htmlspecialchars(strip_tags($data->id));
    $status = htmlspecialchars(strip_tags($data->status));

    // Bind values
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':status', $status);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Project status was updated."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update project status."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update status. Data is incomplete."));
}
?>