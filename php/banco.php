<?php
$servername = "localhost";
$username = "root";
$password = "64121";
$dbname = "3e_challenge";

$conn = new mysqli($servername, $username, $password, $dbname);
$sql = "SELECT id, username, password, email FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      echo "id: " . $row["id"]. " Name: " . $row["username"]. " Password " . $row["password"]. "<br>";
    }
  } else {
    echo "0 results";
  }

$conn->close();
?>