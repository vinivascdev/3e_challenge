<?php
require '../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$servername = $_ENV['DB_SERVERNAME'];
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false, 
        "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$action = $_POST['action'] ?? '';

if ($action === 'register') {
    $form_username = $_POST['username'];
    $form_email = $_POST['email'];
    $form_password = $_POST['password'];
    $form_password2 = $_POST['password2'];

    if ($form_password !== $form_password2) {
        echo json_encode(["success" => false, "message" => "Senhas não coincidem."]);
        exit();
    }

    $sql = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $sql->bind_param("s", $form_email);
    $sql->execute();
    $verify = $sql->get_result();
    if ($verify->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email já cadastrado."]);
        exit();
    }

    $sql = $conn->prepare("SELECT * FROM users WHERE user_name = ?");
    $sql->bind_param("s", $form_username);
    $sql->execute();
    $verify = $sql->get_result();
    if ($verify->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Nome de usuário já cadastrado."]);
        exit();
    }

    $hashedPassword = password_hash($form_password, PASSWORD_DEFAULT);

    $sql = $conn->prepare("INSERT INTO users (user_name, password, email, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
    $sql->bind_param("sss", $form_username, $hashedPassword, $form_email);

    if ($sql->execute()) {
        echo json_encode(["success" => true, "message" => "Usuário registrado com sucesso!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao registrar usuário: " . $conn->error]);
    }

}   // Inicia a sessão

if ($action === 'login') {
    session_start();
    $form_username = $_POST['username'];
    $form_password = $_POST['password'];
    $sql = $conn->prepare("SELECT * FROM users WHERE user_name = ?");
    $sql->bind_param("s", $form_username);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($form_password, $user['password'])) {
            $_SESSION['username'] = $form_username; // Armazena o nome de usuário na sessão
            // echo($_SESSION['username']);
            echo json_encode(["success" => true, "username" => $_SESSION['username'], "redirect" => "deletar.html"]);
        } else {
            echo json_encode(["success" => false, "message" => "Usuário ou senha inválidos."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuário ou senha inválidos."]);
    }
} elseif ($action === 'delete') {

    // Recupera o nome de usuário da sessão
    $form_username = $_SESSION['username'];
    $usernamedelete = $_POST['usernamedelete'];

    if ($form_username) {
        $sql = $conn->prepare("DELETE FROM users WHERE user_name = ?");
        $sql->bind_param("s", $form_username);

        if ($sql->execute()) {
            session_destroy(); // Destruir a sessão após deletar o usuário
            echo json_encode(["success" => true, "message" => "Usuário deletado com sucesso."]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao deletar usuário: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuário não encontrado."]);
    }
} elseif ($action === 'recover') {
    $form_email = $_POST['email'];

    $sql = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $sql->bind_param("s", $form_email);
    $sql->execute();
    $verify = $sql->get_result();

    if ($verify->num_rows > 0) {
        echo json_encode(["success" => true, "message" => "Cheque o link que enviamos ao seu Email."]);
    } else {
        echo json_encode(["success" => false, "message" => "Email não cadastrado."]);
    }
}

$conn->close();
?>