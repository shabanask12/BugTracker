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

    $upload_dir = '../uploads/';
    $attachment_filename = null;

    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES['attachment']['tmp_name'];
        $file_name = $_FILES['attachment']['name'];
        $safe_filename = preg_replace('/[^A-Za-z0-9\.\-\_]/', '', basename($file_name));
        $unique_id = uniqid() . time();
        $attachment_filename = $unique_id . '_' . $safe_filename;
        $dest_path = $upload_dir . $attachment_filename;
        
        if (!move_uploaded_file($file_tmp_path, $dest_path)) {
            send_error(500, "Failed to save the uploaded file.");
        }
    }

    $data = $_POST;

    // ✅ ADD 'project_id' TO REQUIRED FIELDS
    $required_fields = ['title', 'customer_impact', 'source', 'action_required', 'priority', 'project_id'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            send_error(400, "Incomplete data. Missing field: '$field'.");
        }
    }

    // ✅ UPDATE QUERY TO INCLUDE project_id
    $query = "INSERT INTO bug_reports (title, customer_impact, source, action_required, priority, status, assigned_to, attachment_path, project_id) 
              VALUES (:title, :customer_impact, :source, :action_required, :priority, :status, :assigned_to, :attachment_path, :project_id)";
    
    $stmt = $db->prepare($query);

    // Sanitize data into variables FIRST
    $title = htmlspecialchars(strip_tags($data['title']));
    $customer_impact = htmlspecialchars(strip_tags($data['customer_impact']));
    $source = htmlspecialchars(strip_tags($data['source']));
    $action_required = htmlspecialchars(strip_tags($data['action_required']));
    $priority = htmlspecialchars(strip_tags($data['priority']));
    $status = 'Not Started';
    $assigned_to = !empty($data['assigned_to']) ? htmlspecialchars(strip_tags($data['assigned_to'])) : null;
    $project_id = htmlspecialchars(strip_tags($data['project_id'])); // ✅ Sanitize project_id

    // Bind parameters
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':customer_impact', $customer_impact);
    $stmt->bindParam(':source', $source);
    $stmt->bindParam(':action_required', $action_required);
    $stmt->bindParam(':priority', $priority);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':assigned_to', $assigned_to, $assigned_to === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindParam(':attachment_path', $attachment_filename, $attachment_filename === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindParam(':project_id', $project_id, PDO::PARAM_INT); // ✅ Bind project_id

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Bug was created successfully."]);
    } else {
        $errorInfo = $stmt->errorInfo();
        send_error(503, "Unable to create bug. DB Error: " . ($errorInfo[2] ?? 'Unknown error'));
    }

} catch (Throwable $e) {
    send_error(500, "Internal Server Error: " . $e->getMessage());
}

ob_end_flush();
exit();
?>