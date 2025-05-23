import { database, ref, get, set, update } from './firebase-config.js';

// Função para realizar a compra do produto
function comprarProduto(valorProduto) {
  let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Você precisa estar logado para comprar o produto!");
    return;
  }

  let telefoneUsuario = usuarioLogado.telefone;

  // Carregar dados do usuário do Firebase
  const usuarioRef = ref(database, "usuarios/" + telefoneUsuario);
  get(usuarioRef).then(snapshot => {
    const dadosUsuario = snapshot.val();
    
    if (!dadosUsuario) {
      alert("Usuário não encontrado!");
      return;
    }

    let saldoAtual = parseFloat(dadosUsuario.saldo || 0);
    if (saldoAtual < valorProduto) {
      alert("Saldo insuficiente para realizar a compra!");
      return;
    }

    // Desconta o valor do produto e adiciona o saldo do questionário
    let novoSaldo = saldoAtual - valorProduto + 1; // Desconto do produto + R$1 do questionário
    let novaRenda = parseFloat(dadosUsuario.renda || 0) + 1; // Adicionando R$1 ao saldo acumulado do questionário

    // Atualizando o saldo no Firebase
    update(usuarioRef, {
      saldo: novoSaldo,
      renda: novaRenda
    }).then(() => {
      alert(`Compra realizada com sucesso! Seu saldo agora é R$ ${novoSaldo.toFixed(2)}.`);
    }).catch((error) => {
      console.error("Erro ao atualizar dados do usuário: ", error);
    });
  }).catch(error => {
    console.error("Erro ao carregar dados do usuário: ", error);
  });
}

// Função de check-in diário
function realizarCheckinDiario() {
  let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Você precisa estar logado para realizar o check-in!");
    return;
  }

  let telefoneUsuario = usuarioLogado.telefone;
  
  const usuarioRef = ref(database, "usuarios/" + telefoneUsuario);
  get(usuarioRef).then(snapshot => {
    const dadosUsuario = snapshot.val();
    
    let ultimoCheckin = dadosUsuario ? dadosUsuario.ultimoCheckin : null;
    let hoje = new Date().toLocaleDateString();

    if (ultimoCheckin === hoje) {
      alert("Você já coletou seu check-in diário hoje! Tente novamente amanhã.");
      return;
    }

    let saldoAtual = parseFloat(dadosUsuario.saldo || 0);
    let rendaAtual = parseFloat(dadosUsuario.renda || 0);
    let novoSaldo = saldoAtual + 1; // Adicionando R$1 ao saldo
    let novaRenda = rendaAtual + 1; // Adicionando R$1 à renda acumulada

    // Atualiza no Firebase
    update(usuarioRef, {
      saldo: novoSaldo,
      renda: novaRenda,
      ultimoCheckin: hoje
    }).then(() => {
      alert("Check-in diário coletado! R$ 1,00 adicionado ao saldo.");
    }).catch(error => {
      console.error("Erro ao atualizar dados do usuário: ", error);
    });
  }).catch(error => {
    console.error("Erro ao carregar dados do usuário: ", error);
  });
}

// Função para adicionar o link do usuário no Firebase
function adicionarLinkUsuario(userId) {
  // Gerar o link dinâmico para o usuário
  const link = `https://hivest/?codigo=${userId}`;  // Aqui o código é o ID do usuário

  // Atualiza o campo 'link' do usuário no Firebase
  const usuarioRef = ref(database, 'usuarios/' + userId);
  update(usuarioRef, {
    link: link
  }).then(() => {
    console.log("Link atualizado para o usuário com sucesso!");
  }).catch((error) => {
    console.error("Erro ao atualizar link: ", error);
  });
}

// Função para adicionar o link da equipe no Firebase
function adicionarLinkEquipe(donoId) {
  // Gerar o link dinâmico para a equipe
  const link = `https://hivest/?codigo=${donoId}`;  // Aqui o código é o ID do dono da equipe

  // Atualiza o campo 'link' na equipe
  const equipeRef = ref(database, 'equipes/' + donoId);
  update(equipeRef, {
    link: link
  }).then(() => {
    console.log("Link atualizado para a equipe com sucesso!");
  }).catch((error) => {
    console.error("Erro ao atualizar link na equipe: ", error);
  });
}

// Exemplo de uso: Atualizando o link para o usuário e a equipe
const userId = "ID_DO_USUARIO";  // Substitua com o ID do usuário
const donoId = "ID_DO_DONO";  // Substitua com o ID do dono da equipe

// Atualiza o link para o usuário e a equipe
adicionarLinkUsuario(userId);
adicionarLinkEquipe(donoId);

// Exemplo de como chamar a função de comprar produto
document.getElementById("comprar-produto-btn").addEventListener("click", function() {
  comprarProduto(20); // Exemplo: produto custa R$ 20
});

// Exemplo de como chamar a função de check-in diário
document.getElementById("checkin-diario-btn").addEventListener("click", realizarCheckinDiario);
import { database, ref, get } from './firebase-config.js';

// Função para buscar os dados do indicado e exibir na interface
function buscarIndicado(usuarioId) {
  const usuarioRef = ref(database, "usuarios/" + usuarioId);
  get(usuarioRef).then(snapshot => {
    const dadosUsuario = snapshot.val();

    if (dadosUsuario && dadosUsuario.indicadoPor) {
      // Se o usuário tiver um indicado, busca os dados do indicado
      const indicadoRef = ref(database, "usuarios/" + dadosUsuario.indicadoPor);
      get(indicadoRef).then(snapshot => {
        const dadosIndicado = snapshot.val();

        if (dadosIndicado) {
          // Exibe as informações do indicado na interface
          exibirIndicado(dadosIndicado);
        } else {
          alert("Não foi possível encontrar o indicado.");
        }
      }).catch(error => {
        console.error("Erro ao buscar dados do indicado:", error);
      });
    } else {
      alert("Usuário não tem um indicado.");
    }
  }).catch(error => {
    console.error("Erro ao buscar dados do usuário:", error);
  });
}

// Função para exibir os dados do indicado na interface
function exibirIndicado(dadosIndicado) {
  // Exemplo de como exibir as informações
  // Aqui você pode ajustar a forma de exibição conforme o layout do seu app
  const indicacaoArea = document.getElementById("area-indicacoes");
  
  const nomeIndicado = dadosIndicado.nome;
  const telefoneIndicado = dadosIndicado.telefone;
  const saldoIndicado = dadosIndicado.saldo;

  const indicadoDiv = document.createElement("div");
  indicadoDiv.classList.add("indicacao");

  indicadoDiv.innerHTML = `
    <h3>Indicado: ${nomeIndicado}</h3>
    <p>Telefone: ${telefoneIndicado}</p>
    <p>Saldo: R$ ${saldoIndicado.toFixed(2)}</p>
  `;

  indicacaoArea.appendChild(indicadoDiv);
}

// Exemplo de uso: Busca e exibe os dados do indicado para o usuário logado
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (usuarioLogado) {
  const usuarioId = usuarioLogado.telefone;
  buscarIndicado(usuarioId);
} else {
  alert("Você precisa estar logado para visualizar seus indicados.");
}
