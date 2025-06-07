// Config Firebase
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

document.addEventListener("DOMContentLoaded", () => {
  if (!userId) {
    alert("Usuário não logado.");
    window.location.href = "index.html";
    return;
  }

  userRef.once("value").then(snapshot => {
    const data = snapshot.val() || {};
    const saldoCarteira = parseFloat(data.saldoCarteira ?? 71.00).toFixed(2);
    const renda = parseFloat(data.renda ?? 1.00).toFixed(2);
    const recebimento = parseFloat(data.recebimento || 0).toFixed(2);

    document.getElementById("saldo-carteira").textContent = "R$ " + saldoCarteira;
    document.getElementById("renda-recebimento").textContent = "R$ " + renda;
    document.getElementById("valor-retirada").textContent = "R$ " + recebimento;

    if (data.contaBancaria) {
      document.getElementById("nomeTitular").value = data.contaBancaria.nomeTitular;
      document.getElementById("tipoChave").value = data.contaBancaria.tipoChave;
      document.getElementById("chavePix").value = data.contaBancaria.chavePix;
      document.getElementById("salvarConta").disabled = true;
    }
  });
});

document.getElementById("salvarConta").addEventListener("click", () => {
  const nome = document.getElementById("nomeTitular").value;
  const tipo = document.getElementById("tipoChave").value;
  const chave = document.getElementById("chavePix").value;

  if (!nome || !chave) {
    alert("Preencha todos os campos da conta.");
    return;
  }

  userRef.update({
    contaBancaria: {
      nomeTitular: nome,
      tipoChave: tipo,
      chavePix: chave
    }
  });

  alert("Conta bancária salva com sucesso!");
  document.getElementById("salvarConta").disabled = true;
});

// Função de saque
const form = document.getElementById('form-retirada');
form.addEventListener('submit', e => {
  e.preventDefault();

  const valorSaque = parseFloat(document.getElementById('valorSaque').value);
  const saldoCarteira = parseFloat(document.getElementById("saldo-carteira").textContent.replace("R$", "").trim());

  // Verifica se o valor de saque é válido
  if (isNaN(valorSaque) || valorSaque <= 0) {
    alert("Por favor, insira um valor de saque válido.");
    return;
  }

  if (valorSaque > saldoCarteira) {
    alert("Saldo insuficiente.");
    return;
  }

  // Verificando a taxa de 12%
  const taxa = valorSaque * 0.12;
  const valorLiquido = valorSaque - taxa;

  // Dados da retirada
  const tipoChave = document.getElementById("tipoChave").value;
  const chavePix = document.getElementById("chavePix").value;
  const dataRetirada = new Date().toISOString(); // Captura a data da retirada

  // Atualizar o saldo no banco de dados
  userRef.update({
    saldoCarteira: saldoCarteira - valorSaque
  }).then(() => {
    // Adicionar o histórico de retirada no banco de dados
    const historicoRetirada = {
      valorSaque: valorSaque,
      taxa: taxa,
      valorLiquido: valorLiquido,
      tipoChave: tipoChave,
      chavePix: chavePix,
      dataRetirada: dataRetirada
    };

    // Cria um novo nó para o histórico de retiradas
    userRef.child("historicoRetiradas").push(historicoRetirada)
      .then(() => {
        alert(`Retirada de R$ ${valorSaque.toFixed(2)} solicitada com sucesso. Valor a ser recebido: R$ ${valorLiquido.toFixed(2)} após a taxa.`);
        document.getElementById("saldo-carteira").textContent = "R$ " + (saldoCarteira - valorSaque).toFixed(2);
        form.reset();
      })
      .catch((error) => {
        alert("Erro ao salvar o histórico da retirada: " + error.message);
      });
  }).catch((error) => {
    alert("Erro ao atualizar o saldo: " + error.message);
  });
});
