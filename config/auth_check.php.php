<?php
// File: api/config/auth_check.php

// Start session to access session variables
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Checks if a user is logged in and has the 'admin' role.
 * If not, it stops script execution and sends a 403 Forbidden error.
 */
function require_admin() {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403); // Forbidden
        echo json_encode(["message" => "Access Denied. Administrator role required."]);
        exit();
    }
}

/**
 * Checks if a user is logged in (any role).
 * If not, it stops script execution and sends a 401 Unauthorized error.
 * @return int The logged-in user's ID from the session.
 */
function require_login() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(["message" => "Authentication Required. Please log in."]);
        exit();
    }
    return $_SESSION['user_id'];
}
?>