<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// The database config is all we need
include_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Direct query to the database
    $query = "SELECT id, name FROM projects WHERE status = 'Active' ORDER BY name ASC";
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
                "name" => $name
            );
            array_push($projects_arr["records"], $project_item);
        }

        http_response_code(200);
        echo json_encode($projects_arr);
    } else {
        http_response_code(200);
        echo json_encode(
            array("records" => array())
        );
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Internal Server Error: " . $e->getMessage()));
}
?>