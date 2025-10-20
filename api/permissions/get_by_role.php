<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

// Get the user's role from the query string (e.g., ?role=Admin)
$role_name = isset($_GET['role']) ? $_GET['role'] : die();

$database = new Database();
$db = $database->getConnection(); // ✅ This is the corrected line

// Query to get all permission names for a given role, comparing in lowercase
// This makes the check case-insensitive (e.g., 'Admin' and 'admin' are treated the same)
$query = "
    SELECT p.permission_name
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN roles r ON rp.role_id = r.id
    WHERE LOWER(r.role_name) = LOWER(:role_name)
";

$stmt = $db->prepare($query);

// Bind the role name parameter
$stmt->bindParam(':role_name', $role_name);
$stmt->execute();

$permissions = [];
// Fetch all permission names and add them to an array
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $permissions[] = $row['permission_name'];
}

// Set the response code and return the permissions as a JSON array
http_response_code(200);
echo json_encode($permissions);
?>