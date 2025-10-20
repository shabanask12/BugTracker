<?php
class Database {
    // Specify your own database credentials
    private $host = "127.0.0.1"; // Or "localhost"
    private $db_name = "myapp_db";
    private $username = "root"; // <-- EDIT THIS if you have a different username
    private $password = "";     // <-- EDIT THIS if you have a password
    public $conn;

    // Get the database connection
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            // This will prevent the script from outputting a fatal error
            // The connection will simply be null
        }
        return $this->conn;
    }
}
?>

