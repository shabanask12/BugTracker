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

if (empty($data->name)) {
    http_response_code(400);
    echo json_encode(array("message" => "Project name is required."));
    exit();
}

// ✅ UPDATED QUERY: Includes the status column for new projects.
$query = "INSERT INTO projects (name, description, status) VALUES (:name, :description, :status)";

$stmt = $db->prepare($query);

// Sanitize data
$name = htmlspecialchars(strip_tags($data->name));
$description = !empty($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
$status = 'Active'; // ✅ New projects are 'Active' by default.

// Bind data
$stmt->bindParam(":name", $name);
$stmt->bindParam(":description", $description);
$stmt->bindParam(":status", $status); // ✅ Bind the new status parameter

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(array("message" => "Project was created."));
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to create project."));
}
?>