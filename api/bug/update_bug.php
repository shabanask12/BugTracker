<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

include_once '../../config/database.php';

function send_error($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    ob_end_flush();
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Check for required fields in POST data
    if (empty($_POST['id']) || empty($_POST['title'])) {
        send_error(400, "Incomplete data. 'id' and 'title' are required.");
    }
    
    $bug_id = $_POST['id'];
    $data = $_POST;

    // --- File Upload Handling (if a new file is attached) ---
    $attachment_filename = null;
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] == UPLOAD_ERR_OK) {
        // NOTE: For a real application, you might want to delete the old file first.
        // This example just adds a new one or overwrites if the name is the same.
        $upload_dir = '../uploads/';
        $file_tmp_path = $_FILES['attachment']['tmp_name'];
        $file_name = $_FILES['attachment']['name'];
        $safe_filename = preg_replace('/[^A-Za-z0-9\.\-\_]/', '', basename($file_name));
        $unique_id = uniqid() . time();
        $attachment_filename = $unique_id . '_' . $safe_filename;
        $dest_path = $upload_dir . $attachment_filename;
        
        if (!move_uploaded_file($file_tmp_path, $dest_path)) {
            send_error(500, "Failed to save the new uploaded file.");
        }
    }

    // Build the query dynamically based on provided fields
    $query_parts = [];
    $params = [':id' => $bug_id];

    $allowed_fields = ['title', 'customer_impact', 'source', 'action_required', 'priority', 'status', 'assigned_to', 'project_id'];
    foreach($allowed_fields as $field) {
        if (!empty($data[$field])) {
            $query_parts[] = "$field = :$field";
            $params[":$field"] = htmlspecialchars(strip_tags($data[$field]));
        }
    }

    // Add attachment path to query if a new file was uploaded
    if ($attachment_filename) {
        $query_parts[] = "attachment_path = :attachment_path";
        $params[':attachment_path'] = $attachment_filename;
    }

    if (count($query_parts) === 0) {
        send_error(400, "No data provided to update.");
    }

    $query = "UPDATE bug_reports SET " . implode(', ', $query_parts) . " WHERE id = :id";
    
    $stmt = $db->prepare($query);

    if ($stmt->execute($params)) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Bug was updated successfully."]);
        } else {
            // This can happen if the data submitted is the same as what's in the DB
            http_response_code(200);
            echo json_encode(["message" => "Update successful, but no data was changed."]);
        }
    } else {
        $errorInfo = $stmt->errorInfo();
        send_error(503, "Unable to update bug. DB Error: " . ($errorInfo[2] ?? 'Unknown error'));
    }

} catch (Throwable $e) {
    send_error(500, "Internal Server Error: " . $e->getMessage());
}

ob_end_flush();
exit();
?>
