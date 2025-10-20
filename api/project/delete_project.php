<?php
// File: api/project/delete_project.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Often uses POST or DELETE
header("Access-Control-Max-Age: 3600");
header("Access-control-allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Validate that the ID is provided
if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete project. Project ID not provided."));
    exit();
}

// SQL query to delete a project
$query = "DELETE FROM projects WHERE id = :id";

$stmt = $db->prepare($query);

// Sanitize the ID
$id = htmlspecialchars(strip_tags($data->id));

// Bind the ID
$stmt->bindParam(':id', $id);

// Execute the deletion
if ($stmt->execute()) {
     // Check if a row was actually deleted
    if($stmt->rowCount() > 0){
        http_response_code(200);
        echo json_encode(array("message" => "Project was deleted."));
    } else {
        http_response_code(404); // Not Found
        echo json_encode(array("message" => "No project found with the given ID."));
    }
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to delete project."));
}
?>