// Refere-se ao usuário logado
let codigoUsuarioLogado = "1";  // Esse é só um exemplo, o valor real deve vir do seu sistema de login

// Referência ao Firebase
const database = firebase.database();

// Buscar os usuários com o código indicado correspondente ao código do usuário logado
database.ref("usuarios")
  .orderByChild("codigoIndicado")
  .equalTo(codigoUsuarioLogado)
  .once("value")
  .then(snapshot => {
    const listaIndicados = snapshot.val();
    const listaHTML = document.getElementById("lista-indicados");

    if (listaIndicados) {
      // Limpar a lista
      listaHTML.innerHTML = '';

      // Iterar sobre os indicados
      Object.keys(listaIndicados).forEach(userId => {
        const user = listaIndicados[userId];
        
        // Criar o elemento de lista para cada indicado
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>Nome:</strong> ${user.nome} <br>
          <strong>E-mail:</strong> ${user.email || "Não informado"} <br>
          <strong>Código do Indicado:</strong> ${user.codigo} <br>
        `;
        
        listaHTML.appendChild(li);
      });
    } else {
      listaHTML.innerHTML = "Nenhum indicado encontrado.";
    }
  })
  .catch(error => {
    console.error("Erro ao buscar dados:", error);
  });
