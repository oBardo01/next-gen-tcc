document.addEventListener('DOMContentLoaded', async () => {
    const user = await fetchTest();
    if (user) {
        const projetos = await fetchProjetos();
        if (projetos) {
            renderizarProjetos(projetos);
        }
    }
});

function renderizarProjetos(projetos) {
    console.log("a paga dos projetos estão aq: ", projetos);
}

async function fetchTest() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.log('Token não encontrado');
        window.location.href = 'login.html';
        return;
    }

    await fetch('/test', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Acesso não autorizado');
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta:', data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

async function fetchProjetos() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('Token não encontrado. Faça login.');
        return;
    }

    try {
        const response = await fetch('/listarProjetos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar projetos.');
        } else {
            const projetos = await response.json();
            console.log(projetos);
            return projetos;
        }


    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
    }
}
