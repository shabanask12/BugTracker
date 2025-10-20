<?php
// File: api/project/update_project.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Often uses POST or PUT/PATCH
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

// Validate that required data is present
if (empty($data->id) || empty($data->name)) {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update project. Data is incomplete. Please provide id and name."));
    exit();
}

// SQL query to update a project
$query = "UPDATE projects SET name = :name, description = :description WHERE id = :id";

$stmt = $db->prepare($query);

// Sanitize input data
$id = htmlspecialchars(strip_tags($data->id));
$name = htmlspecialchars(strip_tags($data->name));
$description = !empty($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;

// Bind parameters
$stmt->bindParam(':id', $id);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':description', $description);

// Execute the update
if ($stmt->execute()) {
    // Check if any row was actually updated
    if($stmt->rowCount() > 0){
        http_response_code(200);
        echo json_encode(array("message" => "Project was updated."));
    } else {
        http_response_code(404); // Not Found
        echo json_encode(array("message" => "No project found with the given ID."));
    }
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to update project."));
}
?>