<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// This query now selects 'id' and 'name' from the correct 'users' table
// and only includes users whose status is 'active'.
$query = "SELECT id, name FROM users WHERE status = 'active' ORDER BY name ASC";

$stmt = $db->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();
$users_arr = array();

// The frontend expects the data inside a key named "assign_options"
$users_arr["assign_options"] = array();

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // The frontend expects a 'username' key, so we can alias 'name' to 'username' here
        // for minimal frontend changes. OR we change the frontend. Let's stick to the DB schema.
        $user_item = array(
            "id" => $row['id'],
            "name" => $row['name'] // We send the 'name' property
        );
        array_push($users_arr["assign_options"], $user_item);
    }
}

http_response_code(200);
echo json_encode($users_arr);

?>