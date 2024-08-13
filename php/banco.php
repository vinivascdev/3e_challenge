<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "64121";
$dbname = "3e_challenge";

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Captura os dados do formulário
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

// Insere os dados no banco de dados
$sql = "INSERT INTO users (user_name, password, email, created_at, updated_at)
        VALUES ('$username', '$password', '$email', NOW(), NOW())";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Usuário registrado com sucesso!"]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao registrar usuário: " . $conn->error]);
}

// Fecha a conexão
$conn->close();
?>
