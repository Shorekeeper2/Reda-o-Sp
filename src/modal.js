// Modal para exibir redação completa
function createModal() {
    const modalHTML = `
        <div id="redacaoModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitulo">Título da Redação</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="modal-info">
                        <span id="modalTema"><strong>Tema:</strong> </span>
                        <span id="modalData"><strong>Data:</strong> </span>
                        <span id="modalNota" class="modal-nota"><strong>Nota:</strong> </span>
                    </div>
                    <div id="modalConteudo" class="modal-text">
                        <!-- Conteúdo da redação -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="downloadBtn" class="btn-download">📥 Download</button>
                    <button id="printBtn" class="btn-print">🖨️ Imprimir</button>
                </div>
            </div>
        </div>
    `;

    // Adicionar modal ao body se não existir
    if (!document.getElementById('redacaoModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        addModalStyles();
        setupModalEvents();
    }
}

// Adicionar estilos do modal
function addModalStyles() {
    const styles = `
        <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            background: linear-gradient(145deg, #1a0d2e, #2d1b4e);
            margin: 2% auto;
            padding: 0;
            border: 1px solid rgba(138, 43, 226, 0.3);
            border-radius: 15px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
            background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }

        .close {
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }

        .close:hover {
            opacity: 1;
        }

        .modal-body {
            padding: 25px;
            max-height: 60vh;
            overflow-y: auto;
            color: white;
        }

        .modal-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(138, 43, 226, 0.3);
        }

        .modal-info span {
            color: rgba(255, 255, 255, 0.9);
        }

        .modal-nota {
            background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%);
            padding: 5px 15px;
            border-radius: 20px;
            color: white !important;
        }

        .modal-text {
            line-height: 1.8;
            font-size: 16px;
            text-align: justify;
            white-space: pre-wrap;
            color: rgba(255, 255, 255, 0.9);
        }

        .modal-footer {
            padding: 20px;
            text-align: center;
            border-top: 1px solid rgba(138, 43, 226, 0.3);
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .btn-download, .btn-print {
            background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .btn-download:hover, .btn-print:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(157, 78, 221, 0.4);
        }

        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 5% auto;
            }
            
            .modal-info {
                flex-direction: column;
                gap: 10px;
            }
            
            .modal-footer {
                flex-direction: column;
                align-items: center;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Configurar eventos do modal
function setupModalEvents() {
    const modal = document.getElementById('redacaoModal');
    const closeBtn = document.querySelector('.close');
    const downloadBtn = document.getElementById('downloadBtn');
    const printBtn = document.getElementById('printBtn');

    // Fechar modal
    closeBtn.addEventListener('click', closeModal);
    
    // Fechar modal clicando fora
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Botão de download
    downloadBtn.addEventListener('click', downloadRedacao);
    
    // Botão de imprimir
    printBtn.addEventListener('click', printRedacao);
}

// Abrir modal com redação
function openModal(redacao) {
    createModal();
    
    const modal = document.getElementById('redacaoModal');
    const titulo = document.getElementById('modalTitulo');
    const tema = document.getElementById('modalTema');
    const data = document.getElementById('modalData');
    const nota = document.getElementById('modalNota');
    const conteudo = document.getElementById('modalConteudo');

    titulo.textContent = redacao.titulo || 'Redação sem título';
    tema.innerHTML = `<strong>Tema:</strong> ${redacao.tema || 'Não especificado'}`;
    data.innerHTML = `<strong>Data:</strong> ${formatarData(redacao.data_criacao)}`;
    
    if (redacao.nota) {
        nota.innerHTML = `<strong>Nota:</strong> ${redacao.nota}`;
        nota.style.display = 'inline-block';
    } else {
        nota.style.display = 'none';
    }
    
    conteudo.textContent = redacao.conteudo || 'Conteúdo não disponível';

    modal.style.display = 'block';
    
    // Armazenar redação atual para download/impressão
    window.currentRedacao = redacao;
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('redacaoModal');
    modal.style.display = 'none';
    window.currentRedacao = null;
}

// Download da redação
function downloadRedacao() {
    if (!window.currentRedacao) return;
    
    const redacao = window.currentRedacao;
    const content = `
REDAÇÃO SP
${'-'.repeat(50)}

Título: ${redacao.titulo || 'Sem título'}
Tema: ${redacao.tema || 'Não especificado'}
Data: ${formatarData(redacao.data_criacao)}
${redacao.nota ? `Nota: ${redacao.nota}` : ''}

${'-'.repeat(50)}

${redacao.conteudo || 'Conteúdo não disponível'}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redacao_${redacao.titulo || 'sem_titulo'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(
        'Download Concluído',
        'Sua redação foi baixada com sucesso!',
        3000
    );
}

// Imprimir redação
function printRedacao() {
    if (!window.currentRedacao) return;
    
    const redacao = window.currentRedacao;
    const printWindow = window.open('', '_blank');
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Redação - ${redacao.titulo || 'Sem título'}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #7b2cbf;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .info {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .content {
                    text-align: justify;
                    white-space: pre-wrap;
                }
                .nota {
                    background: #7b2cbf;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 15px;
                    display: inline-block;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>REDAÇÃO SP</h1>
                <h2>${redacao.titulo || 'Sem título'}</h2>
            </div>
            <div class="info">
                <p><strong>Tema:</strong> ${redacao.tema || 'Não especificado'}</p>
                <p><strong>Data:</strong> ${formatarData(redacao.data_criacao)}</p>
                ${redacao.nota ? `<span class="nota">Nota: ${redacao.nota}</span>` : ''}
            </div>
            <div class="content">
                ${redacao.conteudo || 'Conteúdo não disponível'}
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };

    showNotification(
        'Impressão Iniciada',
        'A janela de impressão foi aberta!',
        3000
    );
}