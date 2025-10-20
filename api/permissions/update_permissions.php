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

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data)) {
    http_response_code(400);
    echo json_encode(["message" => "No data received or invalid JSON format."]);
    exit();
}

try {
    $db->beginTransaction();

    // Fetch roles and permissions from DB and convert keys to lowercase for case-insensitive matching
    $roles_map = [];
    $stmt = $db->query("SELECT id, role_name FROM roles");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $roles_map[strtolower($row['role_name'])] = $row['id'];
    }

    $permissions_map = [];
    $stmt = $db->query("SELECT id, permission_name FROM permissions");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $permissions_map[strtolower($row['permission_name'])] = $row['id'];
    }

    // Clear all existing entries in the role_permissions table
    $db->exec("DELETE FROM role_permissions");

    $insert_query = "INSERT INTO role_permissions (role_id, permission_id) VALUES (:role_id, :permission_id)";
    $insert_stmt = $db->prepare($insert_query);

    // Loop through the roles sent from the frontend
    foreach ($data as $role_name => $permissions) {
        $lower_role_name = strtolower($role_name);
        
        // Check if the role exists in our map
        if (!isset($roles_map[$lower_role_name])) {
            // Optionally, you can throw an error here if a role from frontend doesn't exist
            // For now, we'll just skip it
            continue;
        }
        $role_id = $roles_map[$lower_role_name];

        // Loop through the permissions for the current role
        foreach ($permissions as $permission_name => $is_enabled) {
            $lower_permission_name = strtolower($permission_name);

            // If the permission is enabled (true) and exists in our map, insert it
            if ($is_enabled && isset($permissions_map[$lower_permission_name])) {
                $permission_id = $permissions_map[$lower_permission_name];
                
                $insert_stmt->bindParam(':role_id', $role_id);
                $insert_stmt->bindParam(':permission_id', $permission_id);
                $insert_stmt->execute();
            }
        }
    }

    $db->commit();

    http_response_code(200);
    echo json_encode(["message" => "Permissions updated successfully."]);

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(503);
    // Provide a more detailed error message for debugging
    echo json_encode(["message" => "Database error occurred while updating permissions.", "error" => $e->getMessage()]);
}
?>