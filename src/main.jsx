import '../src/styles.css';

const codeEditor = document.getElementById('codeEditor');
const runButton = document.getElementById('runButton');
const clearButton = document.getElementById('clearButton');
const consoleDiv = document.getElementById('console');

// Simulação de console
const customConsole = {
    log: (...args) => {
        consoleDiv.innerHTML += `<span class="success">${args.join(' ')}</span>\n`;
    },
    error: (msg) => {
        consoleDiv.innerHTML += `<span class="error">Erro: ${msg}</span>\n`;
    },
    clear: () => {
        consoleDiv.innerHTML = 'Console limpo.\n';
    }
};

// Botão Executar Código
runButton.addEventListener('click', () => {
    const code = codeEditor.value.trim();
    customConsole.clear(); // Limpa o console antes de nova execução

    if (!code) {
        customConsole.error('Por favor, escreva algum código para executar!');
        return;
    }

    try {
        const modifiedCode = code.replace(/console\.log/g, 'customConsole.log');
        const runCode = new Function(modifiedCode);
        runCode();

        if (consoleDiv.innerHTML === 'Console limpo.\n') {
            customConsole.log('Código executado com sucesso, mas sem saída no console.');
        }
    } catch (error) {
        customConsole.error(error.message);
    }
});

// Botão Limpar Console
clearButton.addEventListener('click', () => {
    customConsole.clear();
});