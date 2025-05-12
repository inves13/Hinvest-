// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, update, push, set } from "firebase/database";

// Sua configuração do Firebase
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
const database = getDatabase(app);

// Função para carregar saldo e extrato
window.addEventListener("DOMContentLoaded", () => {
  const saldoElement = document.getElementById("saldo");
  const listaExtrato = document.getElementById("extrato-lista");

  if (!saldoElement || !listaExtrato) {
    console.error("Elementos HTML 'saldo' ou 'extrato-lista' não encontrados.");
    return;
  }

  const telefone = "seu-telefone-aqui"; // Substitua com o telefone do usuário
  const usuarioRef = ref(database, 'usuarios/' + telefone);

  // Carrega saldo
  get(child(usuarioRef, 'carteira/saldo'))
    .then(snapshot => {
      const saldoVal = snapshot.val();
      if (saldoVal === null || saldoVal === undefined) {
        saldoElement.textContent = "0.00";
      } else {
        saldoElement.textContent = parseFloat(saldoVal).toFixed(2);
      }
    })
    .catch(error => {
      console.error("Erro ao buscar saldo:", error);
      saldoElement.textContent = "0.00"; // Em caso de erro, mostra 0.00
    });

  // Carrega extrato de retiradas
  get(child(usuarioRef, 'extratoRetirada'))
    .then(snapshot => {
      const extratos = snapshot.val();
      listaExtrato.innerHTML = "";

      if (!extratos || Object.keys(extratos).length === 0) {
        listaExtrato.innerHTML = "<p>Nenhum saque realizado ainda.</p>";
        return;
      }

      // Exibição do extrato
      const extratoArray = Object.values(extratos).reverse();

      extratoArray.forEach(item => {
        const valor = parseFloat(item.valorBruto || 0);
        const taxa = parseFloat(item.taxa || 0);
        const valorLiquido = parseFloat(item.valorLiquido || (valor - taxa));
        const data = item.data || "Data não informada";
        const status = item.status || "Aguardando"; // Se status não existir, assume "Aguardando"

        const statusClass = status === "Aprovado" ? "approved" :
                            (status === "Rejeitado" ? "rejected" : "pending");

        const div = document.createElement("div");
        div.className = `extrato-item ${statusClass}`;
        div.innerHTML = `
          <p><strong>Valor Bruto:</strong> R$ ${valor.toFixed(2)}</p>
          <p><strong>Taxa:</strong> R$ ${taxa.toFixed(2)}</p>
          <p><strong>Valor Líquido:</strong> R$ ${valorLiquido.toFixed(2)}</p>
          <p><strong>Data:</strong> ${data}</p>
          <p><strong>Status:</strong> ${status}</p>
          ${status === "Aguardando" ? `<button onclick="aprovarRetirada('${telefone}', '${item.key}')">Aprovar Saque</button>` : ''}
        `;
        listaExtrato.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar extrato de retirada:", error);
      alert("Erro ao carregar dados do Firebase: " + error.message);
      listaExtrato.innerHTML = "<p>Erro ao carregar extrato. Tente novamente mais tarde.</p>";
    });
});

// Função para aprovar a retirada
function aprovarRetirada(telefone, retiradaKey) {
  const usuarioRef = ref(database, 'usuarios/' + telefone + '/extratoRetirada/' + retiradaKey);
  update(usuarioRef, {
    status: "Aprovado"
  }).then(() => {
    alert("Retirada aprovada com sucesso!");

    // Atualiza a interface, alterando o status para Aprovado e trocando a cor para verde
    const extratoItem = document.querySelector(`#extrato-lista .extrato-item[data-key='${retiradaKey}']`);
    if (extratoItem) {
      extratoItem.querySelector("button").outerHTML = `<strong>Status:</strong> Aprovado`;
      extratoItem.classList.remove("pending");
      extratoItem.classList.add("approved");
    }
  }).catch(error => {
    console.error("Erro ao aprovar retirada:", error);
    alert("Erro ao aprovar retirada.");
  });
}

// Função para registrar um novo saque
function registrarSaque(telefone, valorBruto, taxa, data) {
  const usuarioRef = ref(database, 'usuarios/' + telefone + '/extratoRetirada');
  const novaRetiradaRef = push(usuarioRef);

  // Define o status como "Aguardando" quando um novo saque é registrado
  set(novaRetiradaRef, {
    valorBruto: valorBruto,
    taxa: taxa,
    valorLiquido: valorBruto - taxa,
    data: data,
    status: "Aguardando" // Definido como "Aguardando" inicialmente
  }).then(() => {
    alert("Saque registrado com sucesso! Status: Aguardando");

    // Atualiza a interface de extrato
    location.reload(); // Atualiza a página para refletir o novo saque
  }).catch(error => {
    console.error("Erro ao registrar saque:", error);
    alert("Erro ao registrar saque.");
  });
}
