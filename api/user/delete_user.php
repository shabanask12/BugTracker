<?php
// Prevents direct output, allowing headers to be sent later
ob_start();

// Set required headers for a JSON API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle pre-flight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

// Include database configuration
include_once '../../config/database.php';

// Helper function to send a JSON error response and exit
function send_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    ob_end_flush();
    exit();
}

try {
    // Establish database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get the posted data from the request body
    $data = json_decode(file_get_contents("php://input"));

    // Validate the incoming data
    if (!is_object($data)) {
        send_error(400, "Invalid JSON format in request body.");
    }

    // Check if a valid user ID is provided
    if (!isset($data->id) || !is_numeric($data->id)) {
        send_error(400, "A valid User ID is required to delete the user.");
    }

    // --- CORE DELETE LOGIC ---
    
    // 1. Define the SQL DELETE query
    // Make sure your table name is correct (e.g., 'users')
    $query = "DELETE FROM users WHERE id = :id";

    // 2. Prepare the statement
    $stmt = $db->prepare($query);

    // 3. Sanitize the ID and bind it to the query parameter
    $userId = htmlspecialchars(strip_tags($data->id));
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);

    // 4. Execute the query
    if ($stmt->execute()) {
        // Check if any row was actually affected (deleted)
        if ($stmt->rowCount() > 0) {
            // Success: a user was deleted
            http_response_code(200);
            echo json_encode(["message" => "User deleted successfully."]);
        } else {
            // No user found with that ID
            http_response_code(404);
            echo json_encode(["message" => "User not found. No user was deleted."]);
        }
    } else {
        // Database execution error
        send_error(503, "Unable to delete user. A database error occurred.");
    }

} catch (Throwable $e) {
    // Catch any other server errors
    send_error(500, "Internal Server Error: " . $e->getMessage());
}

// Flush the output buffer and end the script
ob_end_flush();
exit();
?>