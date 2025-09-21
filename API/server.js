const CONFIG = {
    MANUTENCAO: true, 
    API_URL: 'http://localhost:3000/api/buscar-redacao',
};

// Mostrar/Ocultar senha
document.getElementById('VerSenha').addEventListener('click', function() {
    const senhaInput = document.getElementById('senha');
    const olhoIcon = document.getElementById('OlhoVer');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        olhoIcon.src = "visivel.png"; // usa sua imagem
    } else {
        senhaInput.type = 'password';
        olhoIcon.src = "olho.png"; // usa sua imagem
    }
});

// Função para notificação
function showNotification(title, message, duration = 5000) {
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

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

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
    setTimeout(closeNotification, duration);
}

// Resetar botão
function restaurarBotao() {
    const button = document.getElementById('Logar');
    button.textContent = 'BUSCAR REDAÇÃO';
    button.disabled = false;
}

// Submeter login
document.getElementById('Enviar').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const ra = document.getElementById('ra').value.trim();
    const senha = document.getElementById('senha').value.trim();
    
    if (!ra || !senha) {
        showNotification('Campos Obrigatórios', 'Preencha RA e senha.', 4000);
        return;
    }

    if (CONFIG.MANUTENCAO) {
        showNotification('Manutenção', 'O sistema está em manutenção, tente mais tarde.', 6000);
        return;
    }

    fetchRedacao(ra, senha);
});

// Buscar redações no servidor
async function fetchRedacao(ra, senha) {
    const button = document.getElementById('Logar');
    const originalText = button.textContent;
    
    try {
        button.textContent = 'Buscando...';
        button.disabled = true;

        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ra, senha })
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error('Credenciais inválidas');
            if (response.status === 404) throw new Error('Servidor não encontrado');
            throw new Error(`Erro do servidor: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            // adiciona tempo estimado a cada redação
            data.redacoes = data.redacoes.map(r => ({
                ...r,
                tempo_estimado: calcularTempo(r.conteudo || '')
            }));

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
        
        if (error.message === 'Credenciais inválidas') {
            showNotification('Erro de Login', 'RA ou senha incorretos.', 5000);
        } else if (error.message.includes('fetch')) {
            showNotification('Erro de Conexão', 'Não foi possível conectar ao servidor.', 6000);
        } else {
            showNotification('Erro no Sistema', error.message, 5000);
        }
    } finally {
        restaurarBotao();
    }
}

// Exibir redações na tela
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

    const redacoesHTML = redacoes.map(redacao => `
        <div class="redacao-item" onclick="openModal(${JSON.stringify(redacao).replace(/"/g, '&quot;')})">
            <h3>${redacao.titulo || 'Redação sem título'}</h3>
            <p><strong>Tema:</strong> ${redacao.tema || 'Não especificado'}</p>
            <p>${redacao.conteudo ? redacao.conteudo.substring(0, 200) + '...' : 'Conteúdo não disponível'}</p>
            <div class="redacao-meta">
                <span>Data: ${formatarData(redacao.data_criacao)}</span>
                ${redacao.nota ? `<span class="redacao-nota">Nota: ${redacao.nota}</span>` : ''}
                <span style="color:#9d4edd"><strong>Tempo estimado:</strong> ${redacao.tempo_estimado}</span>
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

// Função auxiliar: calcular tempo estimado
function calcularTempo(texto) {
    const palavras = texto.split(/\s+/).length;
    const velocidade = 25; // palavras por minuto do "bot"
    const minutos = Math.ceil(palavras / velocidade);
    return `${minutos} min`;
}

function formatarData(data) {
    if (!data) return 'Data não disponível';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
}

