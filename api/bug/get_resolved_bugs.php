<?php
// File: api/bug/get_resolved_bugs.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

// Helper function for sending errors
function send_json_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Query to select all bugs specifically with the 'Resolved' status.
    $query = "
        SELECT 
            b.id, 
            b.title, 
            b.status, 
            b.priority, 
            b.created_at,
            u.name AS assigned_to_name,
            p.name AS project_name
        FROM 
            bug_reports AS b
        LEFT JOIN 
            users AS u ON b.assigned_to = u.id
        LEFT JOIN
            projects AS p ON b.project_id = p.id
        WHERE
            b.status = 'Resolved' -- This is the key filter for this page
        ORDER BY 
            b.created_at DESC
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $num = $stmt->rowCount();

    if ($num > 0) {
        $bugs_arr = ["records" => []];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($bugs_arr["records"], $row);
        }

        http_response_code(200);
        echo json_encode($bugs_arr);
    } else {
        http_response_code(200);
        echo json_encode(["records" => [], "message" => "No resolved bugs found."]);
    }

} catch (Exception $e) {
    send_json_error(500, "Server Error: " . $e->getMessage());
}
?>
