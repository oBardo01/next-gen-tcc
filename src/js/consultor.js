async function fetchTest() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.log('Token não encontrado');
        window.location.href = 'login.html';
        return null; // Retorna null explicitamente
    }

    try {
        const response = await fetch('/consultor', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Acesso não autorizado');
        }

        const data = await response.json(); // Extrai os dados JSON
        console.log('Resposta:', data);
        return data; // Retorna os dados corretamente
    } catch (error) {
        console.error('Erro:', error);
        return null; // Retorna null em caso de erro
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchTest();
    console.log(data);
    if (data) {
        console.log("Usuário autenticado:", data);
    }
});


let formCadastro = document.getElementById('formCadastro');
formCadastro.addEventListener('submit', async function cadastrarProjeto(event) {
    event.preventDefault();

    let dadosProjeto = {
        idCliente: document.getElementById('id_Cliente').value,
        tipoProjeto: document.getElementById('tipoProjeto').value,
        descricaoProjeto: document.getElementById('descricaoProjeto').value,
        consultorProjeto: document.getElementById('consultorProjeto').value
    }

    if (Object.values(dadosProjeto).some(valor => !valor)) {
        alert("Preencha todos os campos");
        return;
    }
    
    try {
        const response = await fetch('/cadastrarProjeto', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosProjeto)
        });

        if(response.ok) {
            const data = await response.json();

            if(data.dadosAdmin) {
                alert("Projeto criado");
            } else {
                alert("erro ao criar projeto");
            }
        } else {
            console.error('erro ao cadastrar projeto', data.message);
        }

    } catch (error) {
        console.log('ocorreu um erro', error);
        alert("deu bosta");
    }
})


// let formLogin = document.getElementById('formLogin')
// formLogin.addEventListener('submit', async function logarUsuario(event) {
//     event.preventDefault();

//     let dadosLogin = {
//         emailLogin: document.getElementById('emailLogin').value,
//         senhaLogin: document.getElementById('senhaLogin').value 
//     }

//     if (Object.values(dadosProjeto).some(valor => !valor)) {
//         alert("Preencha todos os campos");
//         return;
//     } 
    
//     try {
//         const response = await fetch('/logar', { //pelo amor de deus vai
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(dadosProjeto)
//         });

//         if (response.ok) {
//             console.log("ta aqui");
//             const data = await response.json();

//             if(data.token) {
//                 alert("Bem vindo, " + data.email + "!");

//                 localStorage.setItem("authToken", data.token);

//                 window.location.href = 'test.html';  
                
//                 fetchTest();
//                 console.log("fetchTest Executado")
//             } else {
//                 console.log("cade o token?");
//             }
//         } else {
//             console.error('Erro no login: ', data.message);
//         }
//     } catch (error) {
//         console.log('Erro ao logar:', error);
//         alert("Ocorreu um erro ao logar o usuário.");
//     }
// })