<?php
// File: api/user/login.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// ✅ --- ADDITION 1: Start the session ---
// This must be called before any output is sent to the browser.
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

function send_json_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->identifier) || empty($data->password)) {
        send_json_error(400, "Username/email and password are required.");
    }

    $query = "SELECT id, name, email, password, role FROM users WHERE name = :identifier OR email = :identifier LIMIT 1";
    
    $stmt = $db->prepare($query);
    $identifier = htmlspecialchars(strip_tags($data->identifier));
    $stmt->bindParam(':identifier', $identifier);
    $stmt->execute();

    if ($stmt->rowCount() == 1) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($data->password, $row['password'])) {
            
            // ✅ --- ADDITION 2: Store user data in the session ---
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['role'] = $row['role'];

            $user_data = [
                "id" => $row['id'],
                "username" => $row['name'],
                "email" => $row['email'],
                "role" => $row['role']
            ];

            http_response_code(200);
            echo json_encode([
                "message" => "Login successful.",
                "user" => $user_data
            ]);

        } else {
            send_json_error(401, "Invalid password.");
        }
    } else {
        send_json_error(404, "User not found.");
    }

} catch (Exception $e) {
    send_json_error(500, "Server Error: " . $e->getMessage());
}
?>