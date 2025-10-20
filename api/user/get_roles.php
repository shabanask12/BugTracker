<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database configuration
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// SQL query to select all role names
$query = "SELECT id, role_name FROM roles ORDER BY role_name ASC";

$stmt = $db->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();

if ($num > 0) {
    $roles_arr = array();
    
    // Fetch results and build the roles array
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $role_item = array(
            "id" => $id,
            "role_name" => $role_name
        );
        array_push($roles_arr, $role_item);
    }

    // Set response code - 200 OK
    http_response_code(200);

    // Show roles data in json format
    echo json_encode($roles_arr);
} else {
    // Set response code - 404 Not found
    http_response_code(404);

    // Tell the user no roles found
    echo json_encode(
        array("message" => "No roles found.")
    );
}
?>