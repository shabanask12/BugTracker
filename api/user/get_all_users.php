<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

include_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // MODIFIED: Added "WHERE status = 'active'" to the query
    $query = "SELECT id, name as username, email, role, status, created_at FROM users WHERE status = 'active' ORDER BY id ASC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($users);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server Error: " . $e->getMessage()]);
}
?>