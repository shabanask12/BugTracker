<?php
// File: api/bug/update_bug_status.php

// --- Set CORS headers ---
header("Access-Control-Allow-Origin: *"); // Allows all origins
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // ✅ Allow OPTIONS method for preflight
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// ✅ Handle preflight request from the browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond with OK status
    exit(); // Stop script execution for preflight
}

// --- Include database configuration ---
include_once '../../config/database.php';

// --- Helper function for sending structured JSON errors ---
function send_json_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

// --- Main logic wrapped in a try-catch block for robust error handling ---
try {
    $database = new Database();
    $db = $database->getConnection();

    // --- Get raw posted data ---
    $data = json_decode(file_get_contents("php://input"));

    // --- Validate input: Check if required data is present ---
    if (!isset($data->id) || !isset($data->status)) {
        send_json_error(400, "Incomplete data. Both 'id' and 'status' are required.");
    }
    
    // --- Sanitize input to prevent malicious data ---
    $bug_id = filter_var($data->id, FILTER_SANITIZE_NUMBER_INT);
    $new_status = htmlspecialchars(strip_tags($data->status));

    // --- Validate status value: Ensure it's one of the allowed options ---
    $allowed_statuses = ["Not Started", "In Progress", "Resolved"];
    if (!in_array($new_status, $allowed_statuses)) {
        send_json_error(400, "Invalid status value provided. Must be 'Not Started', 'In Progress', or 'Resolved'.");
    }
    
    // --- Prepare the SQL query to update the bug report ---
    $query = "UPDATE bug_reports SET status = :status WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    // --- Bind parameters to the prepared statement ---
    $stmt->bindParam(':status', $new_status);
    $stmt->bindParam(':id', $bug_id, PDO::PARAM_INT);
    
    // --- Execute the query ---
    if ($stmt->execute()) {
        // Check if any row was actually updated
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Bug status updated successfully."]);
        } else {
            // This happens if the bug ID does not exist or the status is unchanged
            send_json_error(404, "Bug not found or status was already set to the same value.");
        }
    } else {
        // If the query fails to execute, it's a server-side error
        send_json_error(503, "Unable to update bug status in the database.");
    }

} catch (Exception $e) {
    // Catch any other unexpected errors
    send_json_error(500, "Server Error: " . $e->getMessage());
}
?>

