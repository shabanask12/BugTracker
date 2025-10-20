<?php
// File: api/dashboard/get_dashboard_stats.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

function send_json_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // --- 1. Get Bug Status Statistics ---
    $bug_status_query = "SELECT status, COUNT(*) as count FROM bug_reports GROUP BY status";
    $bug_status_stmt = $db->prepare($bug_status_query);
    $bug_status_stmt->execute();
    $bug_status_counts = $bug_status_stmt->fetchAll(PDO::FETCH_ASSOC);

    $bug_stats = ['Not Started' => 0, 'In Progress' => 0, 'Resolved' => 0];
    foreach ($bug_status_counts as $row) {
        if (isset($bug_stats[$row['status']])) {
            $bug_stats[$row['status']] = (int)$row['count'];
        }
    }
    $bug_stats['total'] = array_sum($bug_stats);

    // --- 2. Get Bug Priority Statistics (NEW) ---
    $bug_priority_query = "SELECT priority, COUNT(*) as count FROM bug_reports GROUP BY priority";
    $bug_priority_stmt = $db->prepare($bug_priority_query);
    $bug_priority_stmt->execute();
    $bug_priority_stats = $bug_priority_stmt->fetchAll(PDO::FETCH_ASSOC);

    // --- 3. Get Project Statistics ---
    $project_query = "SELECT status, COUNT(*) as count FROM projects GROUP BY status";
    $project_stmt = $db->prepare($project_query);
    $project_stmt->execute();
    $project_counts = $project_stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $project_stats = ['Active' => 0, 'Inactive' => 0];
    foreach ($project_counts as $row) {
        $status = ucfirst(strtolower($row['status']));
        if (isset($project_stats[$status])) {
            $project_stats[$status] = (int)$row['count'];
        }
    }
    $project_stats['total'] = array_sum($project_stats);

    // --- 4. Get User Role Statistics ---
    $user_role_query = "SELECT role, COUNT(*) as count FROM users GROUP BY role";
    $user_role_stmt = $db->prepare($user_role_query);
    $user_role_stmt->execute();
    $user_role_stats = $user_role_stmt->fetchAll(PDO::FETCH_ASSOC);

    // --- 5. Get User Status Statistics ---
    $user_status_query = "SELECT status, COUNT(*) as count FROM users GROUP BY status";
    $user_status_stmt = $db->prepare($user_status_query);
    $user_status_stmt->execute();
    $user_status_counts = $user_status_stmt->fetchAll(PDO::FETCH_ASSOC);

    $user_status_stats = ['Active' => 0, 'Inactive' => 0];
    foreach ($user_status_counts as $row) {
        $status = ucfirst(strtolower($row['status'])); 
        if (isset($user_status_stats[$status])) {
            $user_status_stats[$status] = (int)$row['count'];
        }
    }
    $user_status_stats['total'] = array_sum($user_status_stats);

    // --- Combine all stats into a single response object ---
    $dashboard_data = [
        "bugStats" => $bug_stats,
        "bugPriorityStats" => $bug_priority_stats,
        "projectStats" => $project_stats,
        "userRoleStats" => $user_role_stats,
        "userStatusStats" => $user_status_stats
    ];

    http_response_code(200);
    echo json_encode($dashboard_data);

} catch (Exception $e) {
    send_json_error(500, "Server Error: " . $e->getMessage());
}
?>

