// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKSKnVC8dNWmiMrNr1j4rMLfQTlOrqzVM",
  authDomain: "hinvest-f4354.firebaseapp.com",
  databaseURL: "https://hinvest-f4354-default-rtdb.firebaseio.com",
  projectId: "hinvest-f4354",
  storageBucket: "hinvest-f4354.firebasestorage.app",
  messagingSenderId: "646397677016",
  appId: "1:646397677016:web:f05ca27a38439568bff6ad"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Elementos do DOM
const amountButtons = document.querySelectorAll('.amount-button');
const selectedAmountDisplay = document.getElementById('selected-amount');
let selectedValue = null;

// Chaves Pix por valor
const pixKeys = {
  "60": "pix60@hfinvest.com",
  "160": "pix160@hfinvest.com",
  "300": "pix300@hfinvest.com",
  "450": "pix450@hfinvest.com",
  "500": "pix500@hfinvest.com",
  "650": "pix650@hfinvest.com",
  "700": "pix700@hfinvest.com",
  "850": "pix850@hfinvest.com",
  "900": "pix900@hfinvest.com",
  "1050": "pix1050@hfinvest.com"
};

// Clique nos botões de valor
amountButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedValue = button.getAttribute('data-value');
    selectedAmountDisplay.textContent = `R$ ${selectedValue}`;
    amountButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

// Função de depósito
function deposit() {
  if (!selectedValue) {
    alert('Por favor, selecione um valor de depósito.');
    return;
  }

  const pixKey = pixKeys[selectedValue];
  document.getElementById('pix-key-value').textContent = pixKey;
  document.getElementById('pix-key').style.display = 'block';
  document.getElementById('action-buttons').style.display = 'flex';
  document.getElementById('alert-message').style.display = 'none';
}

// Copiar chave Pix
function copyPixKey() {
  const pixKey = document.getElementById('pix-key-value').textContent;
  navigator.clipboard.writeText(pixKey)
    .then(() => alert('Chave Pix copiada com sucesso!'))
    .catch(() => alert('Erro ao copiar chave Pix.'));
}

// Cancelar depósito
function cancelDeposit() {
  document.getElementById('pix-key').style.display = 'none';
  document.getElementById('action-buttons').style.display = 'none';
  selectedValue = null;
  selectedAmountDisplay.textContent = 'R$ 0';
  amountButtons.forEach(btn => btn.classList.remove('selected'));
  document.getElementById('alert-message').style.display = 'none';
}

// Confirmar depósito e salvar no Firebase
function confirmDeposit() {
  const metodo = document.getElementById('pix').value;
  const chave = pixKeys[selectedValue] || "chave_indefinida";
  const data = new Date().toLocaleString();

  const deposito = {
    valor: `R$ ${selectedValue}`,
    metodo: metodo,
    chavePix: chave,
    dataHora: data,
    status: "pendente"
  };

  database.ref("depositos").push(deposito)
    .then(() => {
      document.getElementById('alert-message').style.display = 'block';
      document.getElementById('alert-message').textContent = 'Depósito registrado. Aguarde confirmação.';
    })
    .catch((error) => {
      alert("Erro ao registrar depósito: " + error.message);
    });
}

// Expor funções globais (caso use em script externo no HTML)
window.deposit = deposit;
window.copyPixKey = copyPixKey;
window.cancelDeposit = cancelDeposit;
window.confirmDeposit = confirmDeposit;
