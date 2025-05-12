// Inicializando o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKSKnVC8dNWmiMrNr1j4rMLfQTlOrqzVM",
  authDomain: "hinvest-f4354.firebaseapp.com",
  databaseURL: "https://hinvest-f4354-default-rtdb.firebaseio.com",
  projectId: "hinvest-f4354",
  storageBucket: "hinvest-f4354.appspot.com",
  messagingSenderId: "646397677016",
  appId: "1:646397677016:web:f05ca27a38439568bff6ad"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const userId = localStorage.getItem("telefoneLogado");
const userRef = db.ref("usuarios/" + userId);

// Função para carregar dados iniciais do usuário
document.addEventListener("DOMContentLoaded", () => {
  if (!userId) {
    alert("Usuário não logado.");
    window.location.href = "index.html";
    return;
  }

  userRef.once("value").then(snapshot => {
    const data = snapshot.val() || {};
    const saldoConta = parseFloat(data.saldoConta ?? data.saldo ?? 20).toFixed(2);
    const renda = parseFloat(data.renda || 0).toFixed(2);
    const recebimento = parseFloat(data.recebimento || 0).toFixed(2);
    const planoComprado = data.planoComprado || false;

    document.getElementById("saldo-conta").textContent = "R$ " + saldoConta;
    document.getElementById("renda-acumulada").textContent = "R$ " + renda;
    document.getElementById("valor-recebimento").textContent = "R$ " + recebimento;

    // Preencher os dados da conta bancária
    document.getElementById("nomeTitular").value = data.nomeTitular || "";
    document.getElementById("tipoChave").value = data.tipoChave || "email";
    document.getElementById("chavePix").value = data.chavePix || "";

    if (!planoComprado) {
      document.getElementById("confirmarSaque").disabled = true;
      document.getElementById("status").textContent = "Você precisa comprar um plano para liberar o saque.";
    }
  });
});

// Função para salvar as informações da conta bancária
document.getElementById("salvarConta").addEventListener("click", () => {
  const nomeTitular = document.getElementById("nomeTitular").value;
  const tipoChave = document.getElementById("tipoChave").value;
  const chavePix = document.getElementById("chavePix").value;

  if (!nomeTitular || !tipoChave || !chavePix) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  userRef.update({
    nomeTitular: nomeTitular,
    tipoChave: tipoChave,
    chavePix: chavePix
  }).then(() => {
    alert("Conta bancária salva com sucesso!");
  }).catch(error => {
    alert("Erro ao salvar conta bancária: " + error.message);
  });
});

// Função para calcular o valor a ser recebido após a taxa de 12%
function calcularValorRecebido() {
  const valorSaque = parseFloat(document.getElementById("valorSaque").value) || 0;
  const taxa = 0.12;
  if (valorSaque >= 20) {
    const valorLiquido = valorSaque * (1 - taxa);
    document.getElementById("valorLiquido").textContent = "R$ " + valorLiquido.toFixed(2);
  } else {
    document.getElementById("valorLiquido").textContent = "R$ 0.00";
  }
}

// Função para realizar o saque
document.getElementById("confirmarSaque").addEventListener("click", () => {
  const valorSaque = parseFloat(document.getElementById("valorSaque").value) || 0;
  if (valorSaque < 20) {
    alert("O valor mínimo para saque é R$ 20,00.");
    return;
  }

  const saldoConta = parseFloat(document.getElementById("saldo-conta").textContent.replace("R$ ", "").replace(",", "."));
  if (valorSaque > saldoConta) {
    alert("Saldo insuficiente para o saque.");
    return;
  }

  const valorLiquido = valorSaque * 0.88;
  userRef.update({
    saldoConta: saldoConta - valorSaque,
    renda: parseFloat(document.getElementById("renda-acumulada").textContent.replace("R$ ", "").replace(",", "."))
  }).then(() => {
    alert("Saque realizado com sucesso! Valor recebido: R$ " + valorLiquido.toFixed(2));
  }).catch(error => {
    alert("Erro ao realizar saque: " + error.message);
  });
});
