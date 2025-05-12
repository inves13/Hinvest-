// Firebase config
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

// Verifica se o usuário está logado
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    const db = firebase.database();

    // Busca o código de indicação do usuário logado
    db.ref("usuarios/" + uid + "/codigoIndicado").once("value").then(snap => {
      const meuCodigo = snap.val();
      if (!meuCodigo) {
        alert("Código de indicação não encontrado.");
        return;
      }

      // Busca todos os usuários que usaram esse código
      db.ref("usuarios").orderByChild("codigoIndicacao").equalTo(meuCodigo).once("value").then(snapshot => {
        let totalMembros = 0;
        let totalComissao = 0;
        const lista = document.getElementById("listaEquipe");
        lista.innerHTML = "";

        snapshot.forEach(child => {
          const dados = child.val();
          totalMembros++;

          const comissao = parseFloat(dados.comissao1nivel || 0);
          totalComissao += comissao;

          const li = document.createElement("li");
          li.classList.add("card");
          li.innerHTML = `
            <strong>Nome:</strong> ${dados.nome || "Sem nome"}<br>
            <strong>Telefone:</strong> ${dados.telefone || "Sem telefone"}<br>
            <strong>Saldo:</strong> R$ ${(dados.saldodaConta || 0).toFixed(2)}<br>
            <strong>Comissão:</strong> R$ ${comissao.toFixed(2)}
          `;
          lista.appendChild(li);
        });

        document.getElementById("totalEquipe").textContent = totalMembros;
        document.getElementById("totalComissao").textContent = totalComissao.toFixed(2);
      }).catch(error => {
        alert("Erro ao carregar equipe: " + error.message);
      });
    }).catch(error => {
      alert("Erro ao buscar código de indicação: " + error.message);
    });
  } else {
    // Redireciona se não estiver logado
    window.location.href = "index.html";
  }
});
