<?php
/*
 * --- HOW TO USE ---
 * 1. Change the value of $plainPassword to the password you want to use.
 * 2. Save this file in your project directory (e.g., BugTracker).
 * 3. Open your browser and navigate to http://localhost/BugTracker/hash_password.php
 * 4. Copy the entire generated hash string (it will be long).
 * 5. Go into your database, find your user in the 'users' table, and paste
 * this new hash into the 'password' column.
 * 6. You can now log in with the plain password you set in step 1.
*/

// The password you want to hash
$plainPassword = 'password123'; // <-- CHANGE THIS to your desired password

// Generate the hash
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// Set a header to make the output readable in the browser
header('Content-Type: text/plain');

echo "Plain Password: " . $plainPassword . "\n\n";
echo "Hashed Password (copy this into your database):\n" . $hashedPassword;

?>