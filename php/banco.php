<?php
$servername = "mysql:host=localhost;dbname=3e_challenge;charset=utf8";
$username = "root";
$password = "64121";
$dbname = "3e_challenge";

$conn = new PDO($servername, $username, $password);
$sql = "SELECT id, user_name, password, email FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      echo "id: " . $row["id"]. " Name: " . $row["user_name"]. " Password " . $row["password"]. "<br>";
    }
  } else {
    echo "0 results";
  }

  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';

    // Validação básica
    if (empty($name) || empty($email)) {
        echo "Nome e e-mail são obrigatórios.";
        exit;
    }

    // Processar os dados (por exemplo, salvar no banco de dados, enviar e-mail, etc.)
    // Aqui apenas retornamos uma mensagem de sucesso
    echo "Dados recebidos com sucesso! Nome: $name, E-mail: $email";
} else {
    echo "Método de requisição inválido.";
}

$conn->close();
?>