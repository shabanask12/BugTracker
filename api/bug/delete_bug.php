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

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        send_error(400, "Incomplete data. 'id' is required.");
    }

    $bug_id = htmlspecialchars(strip_tags($data->id));

    // --- Step 1: Find the attachment path BEFORE deleting the record ---
    $find_query = "SELECT attachment_path FROM bug_reports WHERE id = :id";
    $find_stmt = $db->prepare($find_query);
    $find_stmt->bindParam(':id', $bug_id);
    $find_stmt->execute();
    
    $attachment_path = null;
    if ($find_stmt->rowCount() > 0) {
        $row = $find_stmt->fetch(PDO::FETCH_ASSOC);
        $attachment_path = $row['attachment_path'];
    }

    // --- Step 2: Delete the database record ---
    $delete_query = "DELETE FROM bug_reports WHERE id = :id";
    $delete_stmt = $db->prepare($delete_query);
    $delete_stmt->bindParam(':id', $bug_id);

    if ($delete_stmt->execute()) {
        if ($delete_stmt->rowCount() > 0) {
            // --- Step 3: If DB deletion was successful, delete the file ---
            if ($attachment_path) {
                $file_to_delete = '../uploads/' . $attachment_path;
                if (file_exists($file_to_delete)) {
                    unlink($file_to_delete); // Deletes the file
                }
            }
            http_response_code(200);
            echo json_encode(["message" => "Bug was deleted successfully."]);
        } else {
            send_error(404, "Bug not found with the specified ID.");
        }
    } else {
        $errorInfo = $delete_stmt->errorInfo();
        send_error(503, "Unable to delete bug. DB Error: " . ($errorInfo[2] ?? 'Unknown error'));
    }

} catch (Throwable $e) {
    send_error(500, "Internal Server Error: " . $e->getMessage());
}

ob_end_flush();
exit();
?>
