async function fetchTest() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.log('Token não encontrado');
        window.location.href = 'login.html';
        return null; 
    }

    try {
        const response = await fetch('/test', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Acesso não autorizado');
            
        }

        const data = await response.json(); 
        console.log('Resposta:', data);
        return data; 
    } catch (error) {
        console.error('Erro:', error);
        return null; 
    }
}

function renderizarProjetos(projetos) {
    console.log("Renderizando projetos");
    const container = document.getElementById('projects-container');

    container.innerHTML = '';

    projetos.forEach(projeto => {

        const card = document.createElement('div');
        card.classList.add('project-card');

        card.innerHTML = `
        <div class="project-info">
        <span class="project-title">${projeto.tipoprojeto}</span>
        <p class="project-description">${projeto.descricaoprojeto}</p>
                <p class="project-description">Consultor: ${projeto.consultor}</p>
                <p class="project-description">Status: ${projeto.status}</p>
                <p class="project-description">Data de Início: ${projeto.datainicio}</p>
                </div>
                `;

        container.appendChild(card);
    });
}

function renderizarUsuarios(dadosUsuario){
    console.log("Renderizando dados do usuario");
    document.getElementById("user-name").innerText = dadosUsuario[0].nomecompleto;
    document.getElementById("email").placeholder = dadosUsuario[0].email;
    document.getElementById("telefone").placeholder = dadosUsuario[0].telefone;
    document.getElementById("nomeEmpresa").placeholder = dadosUsuario[0].nomeempresa;    
}

async function fetchProjetos() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('Token não encontrado. Faça login.');
        return;
    }

    try {
        const response = await fetch('/test');
        if (response.ok) {
            const data = await response.json();
            console.log("responde data:", data);
            return data.projetos;
        } else {
            console.error("Erro ao buscar projetos", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchTest();
    console.log(data);
    console.log(data.user)
    if (data) {
        console.log("Usuário autenticado:", data.user);
        console.log("Projetos recebidos:", data.projetos);
        console.log( "Dados do usuario recebidos:", data.dadosUsuario);

        if (data.projetos && data.projetos.length > 0) {
            renderizarProjetos(data.projetos); // Renderiza os projetos
            renderizarUsuarios(data.dadosUsuario); //Renderiza a cachorra da mae do usuario aquele filho de uma puta
        } else {
            console.log("Nenhum projeto para renderizar.");
        };
    }
});

// atualizar dados usuario

// function temAlteracao() {
//     const emailOriginal = document.getElementById('email').getAttribute('placeholder');
//     const telefoneOriginal = document.getElementById('telefone').getAttribute('placeholder');
//     const nomeEmpresaOriginal = document.getElementById('nomeEmpresa').getAttribute('placeholder');

//     const emailAtual = document.getElementById('email').value;
//     const telefoneAtual = document.getElementById('telefone').value;
//     const nomeEmpresaAtual = document.getElementById('nomeEmpresa').value;

//     return emailOriginal !== emailAtual || telefoneOriginal !== telefoneAtual || nomeEmpresaOriginal !== nomeEmpresaAtual;
// }

// document.getElementById('save-contact').addEventListener('click', async function (event) {
//     event.preventDefault();

//     if (!temAlteracao()) {
//         alert('Nenhuma alteração foi feita.');
//     }

//     const confirmaSalvar = confirm('Você tem certeza que deseja salvar as alterações?');

//     if (confirmaSalvar) {
//         const dadosAtualizados = {
//             email: document.getElementById('email').value,
//             telefone: document.getElementById('telefone').value,
//             nomeEmpresa: document.getElementById('nomeEmpresa').value
//         };

//         try {
//             const response = await fetch('/atualizarInfo', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(dadosAtualizados),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert(result.message);
//             } else {
//                 alert(result.error);
//             }
//         } catch (error) {
//             console.error('Erro ao salvar dados:', error);
//             alert('Erro ao tentar salvar os dados. Tente novamente.');
//         }
//     } else {
//         alert('Alterações não foram salvas.');
//     }
// });

//logout

document.getElementById('logout').addEventListener('click', async function(event) {
    event.preventDefault();

    try {
        const response = await fetch('/logout', {
            method: 'POST',
        });

        if (response.ok) {
            // Limpa o authToken do localStorage
            localStorage.removeItem('authToken');
            
            // Redireciona para a página de login
            window.location.href = '/login';
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Erro ao realizar o logout.");
        }
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Ocorreu um erro ao fazer logout.");
    }
});