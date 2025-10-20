<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// ✅ UPDATED QUERY: Selects the new status column.
$query = "SELECT id, name, description, status, created_at FROM projects ORDER BY created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();

if ($num > 0) {
    $projects_arr = array();
    $projects_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $project_item = array(
            "id" => $id,
            "name" => $name,
            "description" => $description,
            "status" => $status, // ✅ Include status in the response
            "created_at" => $created_at
        );
        array_push($projects_arr["records"], $project_item);
    }

    http_response_code(200);
    echo json_encode($projects_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => array(), "message" => "No projects found."));
}
?>