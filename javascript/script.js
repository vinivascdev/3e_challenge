const form = document.querySelector("#myForm");

async function sendData(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const sendButton = document.querySelector("#enviar");
  const emailErrorElement = document.querySelector("#email-error");
  const passwordErrorElement = document.querySelector("#password-error");
  const usernameErrorElement = document.querySelector("#username-error");

  const emailField = document.querySelector("#email");
  const usernameField = document.querySelector("#username");
  const email = emailField.value;
  const username = usernameField.value;
  const password = document.querySelector("#password").value;
  const password2 = document.querySelector("#password2").value;
  
  let valid = true;

  sendButton.disabled = true;
  emailErrorElement.textContent = '';
  passwordErrorElement.textContent = '';
  usernameErrorElement.textContent = '';

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    emailErrorElement.textContent = 'Por favor, insira um email válido.';
    valid = false;
  }

  const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{3,14}$/;
  if (!usernamePattern.test(username)) {
    usernameErrorElement.textContent = 'Nome de usuário inválido.';
    valid = false;
  }

  if (password !== password2) {
    passwordErrorElement.textContent = 'Senhas não coincidem.';
    valid = false;
  }

  if (valid) {
    try {
      const response = await fetch("http://localhost:8001/php/banco.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        alert(data.message);
        form.reset();
      } else {
        if (data.message === "Email já cadastrado.") {
          emailErrorElement.textContent = data.message;
        } else {
          passwordErrorElement.textContent = data.message;
        }
      }
    } catch (e) {
      console.error("Error:", e);
      passwordErrorElement.textContent = "Ocorreu um erro ao enviar os dados.";
    } finally {
      sendButton.disabled = false;
    }
  } else {
    sendButton.disabled = false;
  }
}

const send = document.querySelector("#enviar");
send.addEventListener("click", sendData);