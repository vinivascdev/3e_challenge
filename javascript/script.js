const form = document.querySelector("#myForm");

async function sendData(event) {
  event.preventDefault(); // Previne o comportamento padrão de submissão do formulário

  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:8001/banco.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      alert(data.message);
    } else {
      alert("Erro: " + data.message);
    }
  } catch (e) {
    console.error("Error:", e);
    alert("Ocorreu um erro ao enviar os dados.");
  }
}

const send = document.querySelector("#enviar");
send.addEventListener("click", sendData);
