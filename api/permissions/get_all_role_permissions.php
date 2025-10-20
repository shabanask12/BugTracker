<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // 1. Get all roles in a simple array
    $roles_query = "SELECT role_name FROM roles ORDER BY id";
    $roles_stmt = $db->prepare($roles_query);
    $roles_stmt->execute();
    $roles = $roles_stmt->fetchAll(PDO::FETCH_COLUMN, 0);

    // 2. Get all permissions in a simple array
    $permissions_query = "SELECT permission_name FROM permissions ORDER BY id";
    $permissions_stmt = $db->prepare($permissions_query);
    $permissions_stmt->execute();
    $permissions_list = $permissions_stmt->fetchAll(PDO::FETCH_COLUMN, 0);

    // 3. Get the current role-permission mappings from the database
    $mapping_query = "
        SELECT r.role_name, p.permission_name
        FROM role_permissions rp
        JOIN roles r ON rp.role_id = r.id
        JOIN permissions p ON rp.permission_id = p.id
    ";
    $mapping_stmt = $db->prepare($mapping_query);
    $mapping_stmt->execute();
    $raw_mappings = $mapping_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Build the final data structure the frontend expects
    $role_permissions = [];
    // Initialize the grid with all permissions set to false for each role
    foreach ($roles as $role) {
        $role_permissions[$role] = array_fill_keys($permissions_list, false);
    }
    // Set permissions to true where a mapping exists in the database
    foreach ($raw_mappings as $mapping) {
        if (isset($role_permissions[$mapping['role_name']])) {
            $role_permissions[$mapping['role_name']][$mapping['permission_name']] = true;
        }
    }

    // 5. Assemble the final payload to send to the frontend
    $payload = [
        'roles' => $roles,
        'permissions' => $permissions_list,
        'role_permissions' => $role_permissions
    ];

    http_response_code(200);
    echo json_encode($payload);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch permissions data.", "error" => $e->getMessage()]);
}
?>