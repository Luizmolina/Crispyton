let encryptionKey;
let resultDiv; // Div para exibir os resultados
let aValues = []; // Array para armazenar valores de 'a'
let encryptedInputField, positionsInputField; // Campos de texto para inserir os dados de decriptação
let decryptSection; // Div que vai conter os inputs de decriptação
let decryptButtonAction; // Botão de descriptografar

// Função para gerar a chave de criptografia
function generateRandomizedEncryptionKey() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let encryptionKey = {};
    let usedValues = new Set();

    // Gerando chave normal para todas as letras, exceto 'a'
    for (let i = 1; i < alphabet.length; i++) {
        let letter = alphabet[i];
        let baseValue = i + 1;
        let sumValue = baseValue + baseValue;
        let finalValue = Math.floor((sumValue * sumValue) / 3);
        encryptionKey[letter] = finalValue;
        usedValues.add(finalValue);
    }

    // Atribuindo um valor aleatório para 'a' entre 6 e 100
    aValues = []; // Limpar a lista anterior de valores para 'a'
    for (let i = 0; i < 10; i++) { // Gerar 10 valores aleatórios para 'a'
        aValues.push(generateRandomValue(usedValues));
    }
    encryptionKey['a'] = aValues[0]; // Usar o primeiro valor para 'a'

    // Atribuindo um valor para o espaço
    encryptionKey[' '] = 0; // Espaço representado por 0

    return encryptionKey;
}

// Função para gerar um número aleatório não utilizado
function generateRandomValue(usedValues) {
    let randomValue;
    do {
        randomValue = Math.floor(Math.random() * (100 - 6 + 1)) + 6;
    } while (usedValues.has(randomValue));
    return randomValue;
}

// Função para criptografar uma palavra
function encryptWord(word, encryptionKey) {
    let encryptedWord = [];
    let positions = []; // Array para guardar a posição original de cada número

    word = word.toLowerCase(); // Convertendo a palavra para minúsculas
    for (let i = 0; i < word.length; i++) {
        let char = word[i];
        if (encryptionKey[char] !== undefined) { // Verifica se a letra ou espaço está na chave
            encryptedWord.push(encryptionKey[char]);
            positions.push(i); // Guardar a posição original do caractere
        }
    }

    // Embaralhar os números criptografados junto com as posições
    let combined = encryptedWord.map((num, index) => ({ num, pos: positions[index] }));
    combined.sort(() => Math.random() - 0.5); // Embaralhar os números e as posições

    // Separar os arrays novamente após o embaralhamento
    encryptedWord = combined.map(item => item.num);
    positions = combined.map(item => item.pos);

    return { encryptedWord, positions }; // Retornar a lista embaralhada de números e as posições
}

// Função para quebrar a criptografia
function decryptWord(encryptedNumbers, positions, encryptionKey) {
    // Invertendo a chave de criptografia
    let reversedKey = Object.fromEntries(Object.entries(encryptionKey).map(([key, value]) => [value, key]));
    let decryptedArray = new Array(positions.length); // Array vazio para reconstruir a palavra original

    for (let i = 0; i < encryptedNumbers.length; i++) {
        let num = encryptedNumbers[i];
        let pos = positions[i];
        if (aValues.includes(num)) {
            decryptedArray[pos] = 'a'; // Retorna 'a' se o número estiver na lista de valores de 'a'
        } else if (reversedKey[num] !== undefined) {
            decryptedArray[pos] = reversedKey[num];
        } else {
            decryptedArray[pos] = '?'; // Adiciona '?' se o número não tiver correspondência
        }
    }
    return decryptedArray.join(''); // Retornar a palavra reconstruída
}

// Função para criptografar a palavra
function encryptInput() {
    let word = prompt("Digite uma palavra para criptografar:");
    if (word) {
        let { encryptedWord, positions } = encryptWord(word, encryptionKey);
        resultDiv.html("Palavra Criptografada: " + encryptedWord.join(', ') + "<br>Posições: " + positions.join(', ')); // Exibe os números e as posições
    } else {
        resultDiv.html("Nenhuma palavra foi inserida.");
    }
}

// Função para quebrar a criptografia com campos de entrada
function decryptInput() {
    // Mostrar os campos para inserir os números e as posições
    decryptSection.show();

    // Se o botão "Descriptografar" já foi criado, não recriar
    if (!decryptButtonAction) {
        decryptButtonAction = createButton('Descriptografar');
        decryptButtonAction.position(50, 350); // Botão mais abaixo e alinhado à esquerda
        decryptButtonAction.mousePressed(() => {
            let encryptedInput = encryptedInputField.value();
            let positionsInput = positionsInputField.value();

            if (encryptedInput && positionsInput) {
                let encryptedNumbers = encryptedInput.split(',').map(Number);
                let positions = positionsInput.split(',').map(Number);

                // Verificar se os números e posições são válidos
                if (encryptedNumbers.length === positions.length) {
                    let decryptedWord = decryptWord(encryptedNumbers, positions, encryptionKey);
                    resultDiv.html("Palavra Decryptografada: " + decryptedWord);
                } else {
                    resultDiv.html("Erro: O número de posições não corresponde ao número de valores criptografados.");
                }
            } else {
                resultDiv.html("Insira os valores e posições corretamente.");
            }
        });
    }
}

// Função setup do P5.js
function setup() {
    createCanvas(400, 200);
    // Gerar a chave de criptografia
    encryptionKey = generateRandomizedEncryptionKey();
    console.log("Chave de Criptografia:", encryptionKey);

    // Criar botões
    let encryptButton = createButton('Criptografar');
    encryptButton.position(50, 100);
    encryptButton.mousePressed(encryptInput); // Ação ao clicar

    let decryptButton = createButton('Quebrar Cripto');
    decryptButton.position(200, 100);
    decryptButton.mousePressed(decryptInput); // Ação ao clicar

    // Criar seção escondida para inputs de decriptação
    decryptSection = createDiv('');
    decryptSection.position(50, 150);
    decryptSection.hide(); // Escondido inicialmente

    createP('Digite os números criptografados:').parent(decryptSection);
    encryptedInputField = createInput('');
    encryptedInputField.parent(decryptSection);

    createP('Digite as posições respectivas:').parent(decryptSection);
    positionsInputField = createInput('');
    positionsInputField.parent(decryptSection);

    // Criar div para exibir resultados
    resultDiv = createDiv('');
    resultDiv.position(50, 400); // Posiciona logo abaixo dos botões
    resultDiv.style('font-size', '16px'); // Estilo do texto
}
