<?php
// --- FIX: Updated headers to allow credentials from your React app ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

include_once '../../config/database.php';

// Added a try-catch block for more robust error handling
try {
    $database = new Database();
    $db = $database->getConnection();

    // Your original query is preserved
    $query = "SELECT id, name as username, email, role, status, created_at FROM users ORDER BY id ASC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($users);

} catch (Exception $e) {
    // This will catch any database or other errors and send a clean response
    http_response_code(500);
    echo json_encode(["message" => "Server Error: " . $e->getMessage()]);
}
?>

