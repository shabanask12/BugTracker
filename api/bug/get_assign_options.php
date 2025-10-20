<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

include_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        http_response_code(503);
        echo json_encode(["message" => "Unable to connect to database."]);
        ob_end_flush();
        exit();
    }

    // This query selects ALL users and all necessary columns for the User Management page.
    // The WHERE clause has been removed.
    $query = "SELECT id, username, email, role, status FROM bug_users ORDER BY username ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    // This provides the data for the UserManagementPage.jsx component
    echo json_encode([
        'assign_options' => $users ?: []
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    error_log("Error: " . $e->getMessage(), 0);
    echo json_encode(["message" => "Internal Server Error: " . $e->getMessage()]);
}

ob_end_flush();
exit();
?>