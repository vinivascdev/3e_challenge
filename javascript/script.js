document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector("#recoveryForm") || document.querySelector("#loginForm") || document.querySelector("#myForm");

  async function sendData(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const sendButton = document.querySelector("#enviar");
    const emailErrorElement = document.querySelector("#email-error");
    const passwordErrorElement = document.querySelector("#password-error");
    const usernameErrorElement = document.querySelector("#username-error");
    const generalErrorElement = document.querySelector(".error");
    const recoveryErrorElement = document.querySelector("#recovery-error");

    const emailField = document.querySelector("#email");
    const usernameField = document.querySelector("#username");
    const email = emailField ? emailField.value : null;
    const username = usernameField ? usernameField.value : null;
    const password = document.querySelector("#password") ? document.querySelector("#password").value : null;
    const password2 = document.querySelector("#password2") ? document.querySelector("#password2").value : null;

    let valid = true;

    sendButton.disabled = true;
    if (emailErrorElement) emailErrorElement.textContent = '';
    if (passwordErrorElement) passwordErrorElement.textContent = '';
    if (usernameErrorElement) usernameErrorElement.textContent = '';
    generalErrorElement.textContent = '';
    if (recoveryErrorElement) {
      recoveryErrorElement.textContent = '';
      recoveryErrorElement.classList.remove('success');
    }

    if (form.id === "myForm") {
      const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{3,14}$/;
      if (!usernamePattern.test(username)) {
        usernameErrorElement.textContent = 'Nome de usuário inválido.';
        valid = false;
      }

      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        emailErrorElement.textContent = 'Por favor, insira um email válido.';
        valid = false;
      }

      if (password !== password2) {
        passwordErrorElement.textContent = 'Senhas não coincidem.';
        valid = false;
      }
    }

    if (valid) {
      try {
        const action = form.id === "myForm" ? "register" : form.id === "loginForm" ? "login" : "recover";
        formData.append("action", action);

        const response = await fetch("http://localhost:8001/php/banco.php", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          if (action === "recover") {
            recoveryErrorElement.textContent = data.message;
            recoveryErrorElement.classList.add('success');
          } else {
            alert(data.message);
            form.reset();
          }
        } else {
          if (action === "register") {
            if (data.message === "Email já cadastrado.") {
              emailErrorElement.textContent = data.message;
            } else if (data.message === "Nome de usuário já cadastrado.") {
              usernameErrorElement.textContent = data.message;
            } else {
              passwordErrorElement.textContent = data.message;
            }
          } else if (action === "login") {
            generalErrorElement.textContent = data.message;
          } else if (action === "recover") {
            recoveryErrorElement.textContent = data.message;
            recoveryErrorElement.classList.remove('success');
          }
        }
      } catch (e) {
        console.error("Error:", e);
        generalErrorElement.textContent = "Ocorreu um erro ao enviar os dados.";
      } finally {
        sendButton.disabled = false;
      }
    } else {
      sendButton.disabled = false;
    }
  }

  const send = document.querySelector("#enviar");
  if (send) {
    send.addEventListener("click", sendData);
  }
});