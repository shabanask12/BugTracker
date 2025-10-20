<?php
// File: api/bug/get_assigned_bugs.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Ensure this file exists relative to this script's location
include_once '../../config/database.php';

// A function to send a structured JSON error and stop the script
function send_json_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

// ✅ WRAP the entire logic in a try-catch block to handle potential errors
try {
    // Check if the user_id is provided in the URL query string
    if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
        send_json_error(400, "user_id parameter is required.");
    }

    $user_id = filter_var($_GET['user_id'], FILTER_SANITIZE_NUMBER_INT);

    $database = new Database();
    $db = $database->getConnection();

    // SQL query to get bugs specifically assigned to the provided user ID
    $query = "SELECT 
                br.id, 
                br.title, 
                br.status, 
                br.priority, 
                br.created_at,
                p.name as project_name,
                u.name as assigned_to_name
              FROM 
                bug_reports br
              LEFT JOIN 
                projects p ON br.project_id = p.id
              LEFT JOIN 
                users u ON br.assigned_to = u.id
              WHERE
                br.assigned_to = :user_id
              ORDER BY 
                br.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $num = $stmt->rowCount();

    if ($num > 0) {
        $bugs_arr = ["records" => []];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $bug_item = [
                "id" => $id,
                "title" => $title,
                "project_name" => $project_name,
                "status" => $status,
                "priority" => $priority,
                "assigned_to_name" => $assigned_to_name,
                "created_at" => $created_at
            ];
            array_push($bugs_arr["records"], $bug_item);
        }

        http_response_code(200);
        echo json_encode($bugs_arr);
    } else {
        http_response_code(200);
        echo json_encode(["records" => [], "message" => "No bugs assigned to this user."]);
    }

} catch (PDOException $e) {
    // Catch any database-related errors (e.g., bad SQL, wrong table/column names)
    send_json_error(500, "Database Error: " . $e->getMessage());
} catch (Exception $e) {
    // Catch any other general errors
    send_json_error(500, "Server Error: " . $e->getMessage());
}
?>