const amigos = [];

function adicionarAmigo() {
    const input = document.getElementById('amigo');
    const nome = input.value.trim();
    if (nome) {
        if (!amigos.includes(nome)) {
            amigos.push(nome);
            atualizarListaAmigos();
            mostrarNotificacao('Amigo adicionado com sucesso!', true);
            falarTexto(nome + " adicionado");
            input.value = '';
        } else {
            mostrarNotificacao('Este nome já foi adicionado. Por favor, adicione um nome diferente.', false);
        }
    } else {
        mostrarNotificacao('Por favor, digite um nome válido.', false);
    }
    input.focus();
}

function atualizarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';
    amigos.forEach((amigo, index) => {
        const item = document.createElement('li');
        item.textContent = amigo;
        const btnRemove = document.createElement('button');
        btnRemove.textContent = 'Remover';
        btnRemove.className = 'button-remove'; // Aplicar classe ao botão
        btnRemove.onclick = () => removerAmigo(index);
        item.appendChild(btnRemove);
        lista.appendChild(item);
    });
}

function removerAmigo(index) {
    amigos.splice(index, 1);
    atualizarListaAmigos();
    mostrarNotificacao('Amigo removido.', true);
}

function sortearAmigo() {
    if (amigos.length < 2) {
        mostrarNotificacao('Adicione pelo menos dois amigos para o sorteio.', false);
        return;
    }
    const resultados = [];
    let listaTemporaria = [...amigos];
    amigos.forEach(amigo => {
        let index, escolhido;
        do {
            index = Math.floor(Math.random() * listaTemporaria.length);
            escolhido = listaTemporaria[index];
        } while (escolhido === amigo && listaTemporaria.length > 1);
        resultados.push({amigo, recebe: escolhido});
        listaTemporaria.splice(index, 1);
    });
    exibirResultados(resultados);
}

function exibirResultados(resultados) {
    const lista = document.getElementById('resultado');
    lista.innerHTML = '';
    resultados.forEach(resultado => {
        const item = document.createElement('li');
        item.textContent = `${resultado.amigo} tirou: ${resultado.recebe}`;
        lista.appendChild(item);
    });
}

function mostrarNotificacao(mensagem, sucesso) {
    const notificacao = document.createElement('div');
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${sucesso ? 'green' : 'red'};
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
        display: block;
    `;
    document.body.appendChild(notificacao);
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}

function falarTexto(texto) {
    const fala = new SpeechSynthesisUtterance(texto);
    // Selecionar a voz em Português do Brasil
    const vozes = window.speechSynthesis.getVoices();
    const vozBR = vozes.find(voice => voice.lang === 'pt-BR');
    if (vozBR) {
        fala.voice = vozBR;
    } else {
        console.log('Voz em Português-BR não disponível. Utilizando a voz padrão.');
    }
    window.speechSynthesis.speak(fala);
}

// Garantir que as vozes sejam carregadas antes de tentar encontrar uma específica
window.speechSynthesis.onvoiceschanged = function() {
    falarTexto('Sistema inicializado');
};