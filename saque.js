// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, update, push, set } from "firebase/database";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKSKnVC8dNWmiMrNr1j4rMLfQTlOrqzVM",
  authDomain: "hinvest-f4354.firebaseapp.com",
  databaseURL: "https://hinvest-f4354-default-rtdb.firebaseio.com",
  projectId: "hinvest-f4354",
  storageBucket: "hinvest-f4354.appspot.com",
  messagingSenderId: "646397677016",
  appId: "1:646397677016:web:f05ca27a38439568bff6ad"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const userId = localStorage.getItem("telefoneLogado");
const userRef = ref(db, "usuarios/" + userId);

document.addEventListener("DOMContentLoaded", () => {
  if (!userId) {
    alert("Usuário não logado.");
    window.location.href = "index.html";
    return;
  }

  // Recupera os dados do usuário
  get(userRef).then(snapshot => {
    const data = snapshot.val() || {};
    const saldoCarteira = parseFloat(data.saldoCarteira ?? 71.00).toFixed(2);
    const renda = parseFloat(data.renda ?? 1.00).toFixed(2);
    const recebimento = parseFloat(data.recebimento || 0).toFixed(2);

    // Atualiza as informações na tela
    document.getElementById("saldo-carteira").textContent = "R$ " + saldoCarteira;
    document.getElementById("renda-recebimento").textContent = "R$ " + renda;
    document.getElementById("valor-retirada").textContent = "R$ " + recebimento;

    // Preenche os dados da conta bancária, se existirem
    if (data.contaBancaria) {
      document.getElementById("nomeTitular").value = data.contaBancaria.nomeTitular;
      document.getElementById("tipoChave").value = data.contaBancaria.tipoChave;
      document.getElementById("chavePix").value = data.contaBancaria.chavePix;
      document.getElementById("salvarConta").disabled = true;
    }

    // Preenche o histórico de retiradas
    const historicoRetiradas = data.historicoRetiradas || [];
    const extratoElement = document.getElementById("extrato");

    if (historicoRetiradas.length > 0) {
      historicoRetiradas.forEach(retirada => {
        const li = document.createElement("li");
        li.textContent = `Data: ${new Date(retirada.dataRetirada).toLocaleString()} | Valor: R$ ${retirada.valorSaque.toFixed(2)} | Taxa: R$ ${retirada.taxa.toFixed(2)} | Recebido: R$ ${retirada.valorLiquido.toFixed(2)}`;
        extratoElement.appendChild(li);
      });
    } else {
      extratoElement.textContent = "Não há retiradas realizadas ainda.";
    }
  });
});

// Salvar dados da conta bancária
document.getElementById("salvarConta").addEventListener("click", () => {
  const nome = document.getElementById("nomeTitular").value;
  const tipo = document.getElementById("tipoChave").value;
  const chave = document.getElementById("chavePix").value;

  if (!nome || !chave) {
    alert("Preencha todos os campos da conta.");
    return;
  }

  // Atualiza a conta bancária no Firebase
  update(userRef, {
    contaBancaria: {
      nomeTitular: nome,
      tipoChave: tipo,
      chavePix: chave
    }
  }).then(() => {
    alert("Conta bancária salva com sucesso!");
    document.getElementById("salvarConta").disabled = true;
  }).catch((error) => {
    alert("Erro ao salvar os dados da conta bancária: " + error.message);
  });
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

  // Calcula a taxa de 12%
  const taxa = valorSaque * 0.12;
  const valorLiquido = valorSaque - taxa;

  const tipoChave = document.getElementById("tipoChave").value;
  const chavePix = document.getElementById("chavePix").value;
  const dataRetirada = new Date().toISOString(); // Captura a data da retirada

  // Atualiza o saldo do usuário no Firebase
  update(userRef, {
    saldoCarteira: saldoCarteira - valorSaque
  }).then(() => {
    // Adiciona o histórico de retirada no Firebase
    const historicoRetirada = {
      valorSaque: valorSaque,
      taxa: taxa,
      valorLiquido: valorLiquido,
      tipoChave: tipoChave,
      chavePix: chavePix,
      dataRetirada: dataRetirada
    };

    push(child(userRef, "historicoRetiradas"), historicoRetirada)
      .then(() => {
        alert(`Retirada de R$ ${valorSaque.toFixed(2)} solicitada com sucesso. Valor a ser recebido: R$ ${valorLiquido.toFixed(2)} após a taxa.`);
        
        // Atualiza o saldo na tela
        document.getElementById("saldo-carteira").textContent = "R$ " + (saldoCarteira - valorSaque).toFixed(2);

        // Limpa o formulário
        form.reset();
      })
      .catch((error) => {
        alert("Erro ao salvar o histórico da retirada: " + error.message);
      });
  }).catch((error) => {
    alert("Erro ao atualizar o saldo: " + error.message);
  });
});
