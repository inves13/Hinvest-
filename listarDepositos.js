// Referência ao Firebase
const db = firebase.database();

// Função para buscar e listar os depósitos
function listarDepositos(userId) {
  const recargasRef = db.ref(`recargas/${userId}`);

  // Limpa a lista de depósitos antes de adicionar os novos
  const listaDepositos = document.getElementById('lista-depositos');
  listaDepositos.innerHTML = '';

  // Pega os depósitos do Firebase
  recargasRef.once('value', snapshot => {
    const recargas = snapshot.val();

    if (recargas) {
      // Itera sobre os depósitos e adiciona à lista
      Object.keys(recargas).forEach(depositoId => {
        const deposito = recargas[depositoId];
        const status = deposito.status;
        const valor = deposito.valor;

        // Cria um item para cada depósito
        const item = document.createElement('li');
        item.classList.add('deposito-item');
        item.innerHTML = `
          <strong>Valor:</strong> R$${valor}<br>
          <strong>Status:</strong> ${status}
        `;

        // Adiciona o item à lista
        listaDepositos.appendChild(item);
      });
    } else {
      // Caso não tenha depósitos, exibe uma mensagem
      listaDepositos.innerHTML = '<li>Não há depósitos para exibir.</li>';
    }
  });
}

// Exemplo de como chamar a função, com o userId
const userId = 'ID_DO_USUARIO'; // Substitua pelo ID do usuário logado
listarDepositos(userId);
