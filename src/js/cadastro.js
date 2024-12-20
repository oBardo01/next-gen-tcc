let formRegistro = document.getElementById('formRegistro');

formRegistro.addEventListener('submit', async function registrarUsuario(event) {
    event.preventDefault();

    let dadosRegistro = {
        nomeCompleto: document.getElementById('nomeCompleto').value,
        nomeEmpresa: document.getElementById('nomeEmpresa').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        senha: document.getElementById('senha').value,
        senhaC: document.getElementById('senhaC').value,
        genero: document.querySelector('input[name=genero]:checked').value
    }

    // validações
    if (Object.values(dadosRegistro).some(valor => !valor)) {
        alert("Preencha todos os campos");
        return;
    } 
    else if (dadosRegistro.senha !== dadosRegistro.senhaC) {
        alert("As senhas não correspondem");
        senha = "";
        senhaC = "";
        return;
    }    

    try {
        const response = await fetch('/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosRegistro)
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.log('Erro ao registrar:', error);
        alert("Ocorreu um erro ao registrar o usuário.");
    }
});

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
        const response = await fetch('/logar', { //pelo amor de deus vai
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosLogin)
        });

        if (response.ok) {
            console.log("ta aqui");
            const data = await response.json();

            if(data.token) {
                alert("Bem vindo, " + data.email + "!");

                localStorage.setItem("authToken", data.token);

                window.location.href = 'test.html';  
                
                fetchTest();
                console.log("fetchTest Executado")
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