const codeEditor = document.getElementById('codeEditor');
const runButton = document.getElementById('runButton');
const consoleDiv = document.getElementById('console');
const highlightOverlay = document.getElementById('highlightOverlay');

// Simulação de console
const customConsole = {
    log: (...args) => {
        consoleDiv.innerHTML += `<span class="success">${args.join(' ')}</span>\n`;
    },
    error: (msg) => {
        consoleDiv.innerHTML += `<span class="error">Erro: ${msg}</span>\n`;
    },
    clear: () => {
        consoleDiv.innerHTML = '';
    }
};

// Função de highlight básico
function highlightCode(code) {
    const keywords = ['function', 'let', 'const', 'var', 'if', 'else', 'for', 'while', 'return'];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(keywordRegex, '<span class="keyword">$1</span>');
}

// Sincronizar o highlight com o editor
function updateHighlight() {
    highlightOverlay.innerHTML = highlightCode(codeEditor.value);
}

// Indentação automática
codeEditor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        codeEditor.value = codeEditor.value.substring(0, start) + '  ' + codeEditor.value.substring(end);
        codeEditor.selectionStart = codeEditor.selectionEnd = start + 2;
        updateHighlight();
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        const cursorPos = codeEditor.selectionStart;
        const textBeforeCursor = codeEditor.value.substring(0, cursorPos);
        const lastLine = textBeforeCursor.split('\n').pop();
        const indent = lastLine.match(/^\s*/)[0];
        
        const newText = textBeforeCursor + '\n' + indent + codeEditor.value.substring(cursorPos);
        codeEditor.value = newText;
        codeEditor.selectionStart = codeEditor.selectionEnd = cursorPos + indent.length + 1;
        updateHighlight();
    }
});

// Atualizar highlight ao digitar
codeEditor.addEventListener('input', updateHighlight);

// Executar código
runButton.addEventListener('click', () => {
    const code = codeEditor.value.trim();
    customConsole.clear();

    if (!code) {
        customConsole.error('Por favor, escreva algum código para executar!');
        return;
    }

    try {
        const modifiedCode = `
            (function(customConsole) {
                ${code.replace(/console\.log/g, 'customConsole.log')}
            })(customConsole);
        `;
        const runCode = new Function('customConsole', modifiedCode);
        runCode(customConsole);

        if (consoleDiv.innerHTML === '') {
            customConsole.log('Código executado com sucesso, mas sem saída no console.');
        }
    } catch (error) {
        customConsole.error(error.message);
    }
});

// Highlight inicial
updateHighlight();