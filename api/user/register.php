<?php
/**
 * This script handles user registration.
 * It includes a CORS fix, robust JSON validation, and the typo fix.
 */

// Force PHP to display all errors for debugging.
// You should remove these two lines in a production environment.
ini_set('display_errors', 1);
error_reporting(E_ALL);

// =================================================================
// CORS (Cross-Origin Resource Sharing) FIX
// =================================================================
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight "OPTIONS" request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");

// =================================================================
// SCRIPT LOGIC
// =================================================================

// Include the database configuration file
include_once '../../config/database.php';

// Get the raw POSTed data from the request body
$data = json_decode(file_get_contents("php://input"));

// First, check if the JSON decoding was successful and data is an object
if (!is_object($data)) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Invalid JSON format or empty request body."]);
    exit();
}

// Now, validate that the required properties exist within the object
if (
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    // Create a new database connection
    $database = new Database();
    // THE FIX IS HERE: Changed 'a' to '$database'
    $db = $database->getConnection();

    // Sanitize the input data
    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));
    
    // Hash the password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    // Prepare the SQL query
    $query = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
    $stmt = $db->prepare($query);

    // Bind the data
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password_hash);

    // Execute the query
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "User was created successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create user. A server error occurred."));
    }
} else {
    // If data is incomplete, send a 400 Bad Request response
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Name, email, and password properties are required."));
}
?>