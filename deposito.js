// Inicializando o Firebase
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-auth-domain",
    projectId: "seu-project-id",
    storageBucket: "seu-storage-bucket",
    messagingSenderId: "seu-messaging-sender-id",
    appId: "seu-app-id"
};

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);

// Referência para os botões de valor
const amountButtons = document.querySelectorAll('.amount-button');
const selectedAmountDisplay = document.getElementById('selected-amount');
const pixKeys = {
    "60": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/12345",
    "160": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/67890",
    "300": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/abcdef",
    "450": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/ghijk",
    "500": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/lmnop",
    "650": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/qrstuv",
    "700": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/wxyz",
    "850": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/123abc",
    "900": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/xyz123",
    "1050": "00020101021226900014br.gov.bcb.pix2568qrcode.siliumpay.com.br/dynamic/456def"
};

// Seleção do valor
amountButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        selectedAmountDisplay.textContent = `R$ ${value}`;
        amountButtons.forEach(b => b.classList.remove('selected'));
        button.classList.add('selected');
        showPixKey(value);
    });
});

// Exibir a chave PIX
function showPixKey(value) {
    const pixKeyElement = document.getElementById('pix-key');
    const pixKeyValue = document.getElementById('pix-key-value');
    const pixKeyText = pixKeys[value];

    if (pixKeyText) {
        pixKeyElement.style.display = 'block';
        pixKeyValue.textContent = pixKeyText;
    } else {
        pixKeyElement.style.display = 'none';
    }
}

// Copiar a chave PIX
function copyPixKey() {
    const pixKeyText = document.getElementById('pix-key-value').textContent;
    navigator.clipboard.writeText(pixKeyText).then(() => {
        alert('Chave Pix copiada!');
    }).catch((error) => {
        console.error('Erro ao copiar chave Pix:', error);
    });
}

// Cancelar depósito
function cancelDeposit() {
    // Limpa a seleção e oculta a chave Pix
    selectedAmountDisplay.textContent = 'R$ 0';
    document.getElementById('pix-key').style.display = 'none';
    amountButtons.forEach(b => b.classList.remove('selected'));
}

// Continuar com o depósito
function continueDeposit() {
    const selectedAmount = selectedAmountDisplay.textContent;
    if (selectedAmount !== "R$ 0") {
        // Lógica de comunicação com o backend ou Firebase
        alert("Pagamento Confirmado! Seu depósito está sendo processado.");

        // Atualizando o Firebase
        firebase.firestore().collection("depositos").add({
            valor: selectedAmount,
            status: "Pagamento Concluído",
            usuario: "Usuário Exemplo", // Substitua pelo nome ou ID do usuário
            data: new Date()
        }).then(() => {
            alert("Depósito atualizado no sistema!");
        }).catch((error) => {
            console.error("Erro ao registrar depósito:", error);
        });
    } else {
        alert("Por favor, selecione um valor para o depósito.");
    }
}

// Função de depósito
function deposit() {
    const selectedAmount = selectedAmountDisplay.textContent;
    if (selectedAmount !== "R$ 0") {
        document.getElementById('action-buttons').style.display = 'flex';
    } else {
        alert("Por favor, selecione um valor para o depósito.");
    }
}

// Exibição do estado do depósito
function updateDepositStatus(status) {
    const depositStatusElement = document.getElementById('deposit-status');
    depositStatusElement.textContent = `Status: ${status}`;
}

// Inicialização do script
document.addEventListener('DOMContentLoaded', () => {
    updateDepositStatus('Aguardando seleção de valor...');
});
