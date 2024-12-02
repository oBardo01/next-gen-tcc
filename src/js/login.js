let formLogin = document.getElementById('formLogin')
formLogin.addEventListener('submit', async function logarUsuario(event) {
    event.preventDefault();

    let dadosLogin = {
        emailLogin: document.getElementById('emailLogin').value,
        senhaLogin: document.getElementById('senhaLogin').value
    }

    if (Object.values(dadosLogin).some(valor => !valor)) {
        alert("Preencha todos os campos");
        return;
    }

    try {
        const response = await fetch('/logar', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosLogin)
        });

        if (response.ok) {
            console.log("ta aqui");
            const data = await response.json();

            if (data.token) {
                if (data.ia === true) {
                    localStorage.setItem("authToken", data.token);
                    window.location.href = 'consultor.html';
                    console.log("fetchTest Executado")
                } else {
                    alert("Bem vindo, " + data.email + "!");
                    localStorage.setItem("authToken", data.token);
                    window.location.href = 'test.html';
                    console.log("fetchTest Executado")
                }
            } else {
                console.log("cade o token?");
            }
        } else {
            console.error('Erro no login: ', data.message);
        }
    } catch (error) {
        console.log('Erro ao logar:', error);
        alert("Ocorreu um erro ao logar o usuário.");
    }
})