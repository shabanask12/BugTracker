<?php
// Ensure no output before headers
ob_start();

// Set required headers for CORS and JSON content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight (OPTIONS) request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

// Include database configuration
include_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        http_response_code(503);
        echo json_encode(["message" => "Unable to connect to database."]);
        ob_end_flush();
        exit();
    }

    // Fetch unique Customer Impact values from bug_reports
    $query1 = "SELECT DISTINCT customer_impact FROM CustomerImpact";
    $stmt1 = $db->prepare($query1);
    $stmt1->execute();
    $customerImpacts = $stmt1->fetchAll(PDO::FETCH_COLUMN);

    // Fetch unique Source values from bug_reports
    $query2 = "SELECT DISTINCT source FROM SRC";
    $stmt2 = $db->prepare($query2);
    $stmt2->execute();
    $sources = $stmt2->fetchAll(PDO::FETCH_COLUMN);

    http_response_code(200);
    echo json_encode([
        'customer_impacts' => $customerImpacts ?: [],
        'sources' => $sources ?: []
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["message" => "Internal Server Error: " . $e->getMessage()]);
}

ob_end_flush();
exit();
?>