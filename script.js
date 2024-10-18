let encryptionKey;
let resultDiv; // Div para exibir os resultados
let aValues = []; // Array para armazenar valores de 'a'

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
    let aValue;
    do {
        aValue = generateRandomValue(usedValues); // Gera um valor aleatório para 'a'
    } while (aValue >= 6 && aValue <= 100 && usedValues.has(aValue)); // Garante que não é usado

    encryptionKey['a'] = aValue; // Usar o valor gerado para 'a'
    usedValues.add(aValue); // Adiciona o valor de 'a' aos valores usados

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
    word = word.toLowerCase(); // Convertendo a palavra para minúsculas
    for (let char of word) {
        if (encryptionKey[char] !== undefined) { // Verifica se a letra ou espaço está na chave
            encryptedWord.push(encryptionKey[char]); // Usar o valor definido na chave
        }
    }
    return encryptedWord;
}

// Função para quebrar a criptografia
function decryptWord(encryptedNumbers, encryptionKey) {
    // Invertendo a chave de criptografia
    let reversedKey = Object.fromEntries(Object.entries(encryptionKey).map(([key, value]) => [value, key]));
    let decryptedWord = '';

    for (let num of encryptedNumbers) {
        if (num >= 6 && num <= 100 && !Object.values(encryptionKey).includes(num)) {
            decryptedWord += 'a'; // Retorna 'a' se o número estiver na faixa de 6 a 100 e não representar outra letra
        } else if (reversedKey[num] !== undefined) {
            decryptedWord += reversedKey[num];
        } else {
            decryptedWord += '?'; // Adiciona '?' se o número não tiver correspondência
        }
    }
    return decryptedWord;
}

// Função para criptografar a palavra
function encryptInput() {
    let word = prompt("Digite uma palavra para criptografar:");
    if (word) {
        let encryptedWord = encryptWord(word, encryptionKey);
        resultDiv.html("Palavra Criptografada: " + encryptedWord.join(', ')); // Exibe a lista de números
    } else {
        resultDiv.html("Nenhuma palavra foi inserida.");
    }
}

// Função para quebrar a criptografia
function decryptInput() {
    let encryptedInput = prompt("Digite os números criptografados separados por vírgula:");
    if (encryptedInput) {
        let encryptedNumbers = encryptedInput.split(',').map(Number);
        let decryptedWord = decryptWord(encryptedNumbers, encryptionKey);
        resultDiv.html("Palavra Decryptografada: " + decryptedWord);
    } else {
        resultDiv.html("Nenhuma sequência foi inserida.");
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

    // Criar div para exibir resultados
    resultDiv = createDiv('');
    resultDiv.position(50, 130); // Posiciona logo abaixo dos botões
    resultDiv.style('font-size', '16px'); // Estilo do texto
}
