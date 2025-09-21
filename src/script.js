
const CONFIG = {
  
    MANUTENCAO: true, 
    
    API_URL: 'http://localhost:3000/api/buscar-redacao',
    
};

document.getElementById('VerSenha').addEventListener('click', function() {
    const senhaInput = document.getElementById('senha');
    const olhoIcon = document.getElementById('OlhoVer');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        olhoIcon.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuODggOS44OEExMyAxMyAwIDAgMCAxMiA5QzE5IDkgMjMgMTIgMjMgMTJzLTQgMy0xMSAzQTEzIDEzIDAgMCAwIDkuODggOS44OFoiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTAuNzMgNS4wOEExMyAxMyAwIDAgMSAxMiA1QzE5IDUgMjMgOCAyMyA4cy00IDMtMTEgM0ExMyAxMyAwIDAgMSAxMC43MyA1LjA4WiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xIDFsMjIgMjIiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K";
    } else {
        senhaInput.type = 'password';
        olhoIcon.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMTJTNSA0IDEyIDRzMTEgOCAxMSA4LTUgOC0xMiA4UzEgMTIgMSAxMloiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=";
    }
});

function showNotification(title, message, duration = 5000) {
    // Remove notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <button class="close-btn">&times;</button>
        <h3>${title}</h3>
        <p>${message}</p>
    `;

    document.body.appendChild(notification);

    // Mostra a notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Função para fechar notificação
    const closeBtn = notification.querySelector('.close-btn');
    const closeNotification = () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    };

    closeBtn.addEventListener('click', closeNotification);

    // Auto close
    setTimeout(closeNotification, duration);
}

// Função para restaurar botão
function restaurarBotao() {
    const button = document.getElementById('Logar');
    button.textContent = 'BUSCAR REDAÇÃO';
    button.disabled = false;
}

// Manipular envio do formulário
document.getElementById('Enviar').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const ra = document.getElementById('ra').value.trim();
    const senha = document.getElementById('senha').value.trim();
    
    if (!ra || !senha) {
        showNotification(
            'Campos Obrigatórios',
            'Por favor, preencha todos os campos antes de continuar.',
            4000
        );
        return;
    }

    // Verificar se está em manutenção
    if (CONFIG.MANUTENCAO) {
        showNotification(
            'Sistema em Manutenção',
            'Desculpe, nosso sistema está temporariamente indisponível para manutenção. Tente novamente em alguns minutos.',
            6000
        );
        return;
    }

    // Chama função para buscar redação
    fetchRedacao(ra, senha);
});

// Função para buscar redação
async function fetchRedacao(ra, senha) {
    const button = document.getElementById('Logar');
    const originalText = button.textContent;
    
    try {
        // Mostrar loading
        button.textContent = 'Buscando...';
        button.disabled = true;

        // Fazer requisição para API
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ra, senha })
        });

        // Verificar se a resposta foi bem sucedida
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Credenciais inválidas');
            } else if (response.status === 404) {
                throw new Error('Servidor não encontrado');
            } else {
                throw new Error(`Erro do servidor: ${response.status}`);
            }
        }

        const data = await response.json();

        if (data.success) {
            // Mostrar redações encontradas
            displayRedacoes(data.redacoes);
            showNotification(
                'Redações Encontradas',
                `${data.redacoes.length} redação(ões) carregada(s) com sucesso!`,
                3000
            );
        } else {
            throw new Error(data.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao buscar redação:', error);
        
        // Verificar tipo de erro e mostrar mensagem apropriada
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showNotification(
                'Erro de Conexão',
                'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.',
                6000
            );
        } else if (error.message === 'Credenciais inválidas') {
            showNotification(
                'Erro de Login',
                'RA ou senha incorretos. Verifique suas credenciais e tente novamente.',
                5000
            );
        } else if (error.message === 'Servidor não encontrado') {
            showNotification(
                'Servidor Indisponível',
                'O servidor não está respondendo. Tente novamente mais tarde.',
                5000
            );
        } else {
            showNotification(
                'Erro no Sistema',
                error.message || 'Ocorreu um erro inesperado. Tente novamente.',
                5000
            );
        }
    } finally {
        // Sempre restaurar o botão
        restaurarBotao();
    }
}

// Função para exibir redações na tela
function displayRedacoes(redacoes) {
    const container = document.getElementById('TamanhoN');
    
    if (!redacoes || redacoes.length === 0) {
        container.innerHTML = `
            <div class="redacoes-container">
                <div class="redacao-item">
                    <h3>Nenhuma redação encontrada</h3>
                    <p>Não foram encontradas redações para este usuário.</p>
                </div>
            </div>
        `;
        return;
    }

    const redacoesHTML = redacoes.map((redacao, index) => `
        <div class="redacao-item" onclick="openModal(${JSON.stringify(redacao).replace(/"/g, '&quot;')})">
            <h3>${redacao.titulo || 'Redação sem título'}</h3>
            <p><strong>Tema:</strong> ${redacao.tema || 'Não especificado'}</p>
            <p>${redacao.conteudo ? redacao.conteudo.substring(0, 200) + '...' : 'Conteúdo não disponível'}</p>
            <div class="redacao-meta">
                <span>Data: ${formatarData(redacao.data_criacao)}</span>
                ${redacao.nota ? `<span class="redacao-nota">Nota: ${redacao.nota}</span>` : ''}
            </div>
            <p style="margin-top: 10px; color: #9d4edd; font-size: 14px;">
                📖 Clique para ver redação completa
            </p>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="redacoes-container">
            <h2 style="color: #9d4edd; text-align: center; margin-bottom: 20px;">
                📝 Suas Redações
            </h2>
            ${redacoesHTML}
        </div>
    `;
}

// Função para formatar data
function formatarData(data) {
    if (!data) return 'Data não disponível';
    
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para limpar resultados
function limparResultados() {
    document.getElementById('TamanhoN').innerHTML = '';
}

// Função para ativar/desativar manutenção (usar no console do navegador)
window.toggleManutencao = function() {
    CONFIG.MANUTENCAO = !CONFIG.MANUTENCAO;
    console.log('Manutenção:', CONFIG.MANUTENCAO ? 'ATIVADA' : 'DESATIVADA');
    return CONFIG.MANUTENCAO;
};

// Função para alterar URL da API (usar no console do navegador)
window.setApiUrl = function(url) {
    CONFIG.API_URL = url;
    console.log('Nova URL da API:', url);
};