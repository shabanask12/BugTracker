<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

// Get the user's role from the query string (e.g., ?role=Admin)
$role_name = isset($_GET['role']) ? $_GET['role'] : die();

$database = new Database();
$db = $database->getConnection();

// Query to get all permission names for a given role
$query = "
    SELECT p.permission_name
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN roles r ON rp.role_id = r.id
    WHERE r.role_name = :role_name
";

$stmt = $db->prepare($query);
$stmt->bindParam(':role_name', $role_name);
$stmt->execute();

$permissions = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Add the permission name (e.g., 'create_bug') to the array
    $permissions[] = $row['permission_name'];
}

http_response_code(200);
echo json_encode($permissions);
?>