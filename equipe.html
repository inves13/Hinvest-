<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>H Invest - Minha Equipe</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body {
      background: #0d0d0d;
      color: #f2f2f2;
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: auto;
    }
    .card {
      background: #1a1a1a;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,0.6);
      margin-bottom: 20px;
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 20px;
    }
    .linha {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      background: #2b2b2b;
      border-radius: 8px;
      margin-bottom: 10px;
      align-items: center;
    }
    button {
      background: #28a745;
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    #membros-lista {
      max-height: 250px;
      overflow-y: auto;
      margin-top: 12px;
    }
    .membro {
      padding: 10px;
      background: #333;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .center {
      text-align: center;
    }
  </style>

  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js"></script>
</head>
<body>

<div class="container">
  <div class="card">
    <h2>Código de Convite</h2>
    <div class="linha">
      <span id="codigo-link">Carregando...</span>
      <button onclick="copiarTexto('codigo-link')">Copiar</button>
    </div>
    <button onclick="compartilharWhatsApp()">Compartilhar no WhatsApp</button>
  </div>

  <div class="card">
    <h2>Minha Equipe</h2>
    <div class="linha"><strong>LV 1</strong> <span id="lv1-qtd">0</span></div>
    <div class="linha"><strong>LV 2</strong> <span id="lv2-qtd">0</span></div>
    <div class="linha"><strong>LV 3</strong> <span id="lv3-qtd">0</span></div>
    <div class="linha"><strong>Total de Membros</strong> <span id="total-users">0</span></div>
    <div class="linha"><strong>Bônus Acumulado</strong> <span id="total-bonus">R$ 0,00</span></div>
    <button id="btn-resgatar" onclick="resgatarBonus()">Resgatar Bônus</button>
  </div>

  <div class="card">
    <h2>Membros</h2>
    <button onclick="mostrarMembros()">Ver Lista de Membros</button>
    <div id="membros-lista"></div>
  </div>
</div>

<script>
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

  const telefoneLogado = localStorage.getItem("telefoneLogado");
  if (!telefoneLogado) {
    window.location.href = "index.html";
  }

  let meuCodigo = "";
  let membros = [];

  db.ref("usuarios/" + telefoneLogado).once("value").then(snapshot => {
    const user = snapshot.val();
    if (user) {
      meuCodigo = user.codigo || gerarCodigo();
      db.ref("usuarios/" + telefoneLogado).update({ codigo: meuCodigo });

      const codigoLink = "https://inves13.github.io/Hinvest-/?codigo=" + meuCodigo;
      document.getElementById("codigo-link").innerText = codigoLink;

      carregarEquipe();
    }
  });

  function gerarCodigo() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  function carregarEquipe() {
    db.ref("usuarios").once("value").then(snapshot => {
      const usuarios = snapshot.val();
      let lv1 = 0, lv2 = 0, lv3 = 0;
      let bonus = 0;
      membros = [];

      for (let tel in usuarios) {
        const u = usuarios[tel];
        if (u.codigoIndicacao === meuCodigo) {
          lv1++; bonus += 5;
          membros.push(u.telefone);

          for (let tel2 in usuarios) {
            const u2 = usuarios[tel2];
            if (u2.codigoIndicacao === u.codigo) {
              lv2++; bonus += 3;
              membros.push(u2.telefone);

              for (let tel3 in usuarios) {
                const u3 = usuarios[tel3];
                if (u3.codigoIndicacao === u2.codigo) {
                  lv3++; bonus += 1;
                  membros.push(u3.telefone);
                }
              }
            }
          }
        }
      }

      document.getElementById("lv1-qtd").innerText = lv1;
      document.getElementById("lv2-qtd").innerText = lv2;
      document.getElementById("lv3-qtd").innerText = lv3;
      document.getElementById("total-users").innerText = lv1 + lv2 + lv3;

      // Atualiza saldoBonus no banco
      db.ref("usuarios/" + telefoneLogado).update({ saldoBonus: bonus });

      document.getElementById("total-bonus").innerText = "R$ " + bonus.toFixed(2).replace(".", ",");
    });
  }

  function mostrarMembros() {
    const lista = document.getElementById("membros-lista");
    lista.innerHTML = "";

    if (membros.length === 0) {
      lista.innerHTML = "<p class='center'>Nenhum membro encontrado.</p>";
      return;
    }

    membros.forEach(m => {
      const div = document.createElement("div");
      div.className = "membro";
      div.innerText = "Telefone: " + mascararTelefone(m);
      lista.appendChild(div);
    });
  }

  function mascararTelefone(tel) {
    return tel.substr(0, 5) + "****" + tel.substr(tel.length - 4);
  }

  function copiarTexto(id) {
    const texto = document.getElementById(id).innerText;
    navigator.clipboard.writeText(texto).then(() => {
      alert("Copiado com sucesso!");
    });
  }

  function compartilharWhatsApp() {
    const link = document.getElementById("codigo-link").innerText;
    const mensagem = encodeURIComponent("Cadastre-se na H Invest com meu convite: " + link);
    window.open("https://wa.me/?text=" + mensagem, "_blank");
  }

  function resgatarBonus() {
    db.ref("usuarios/" + telefoneLogado).once("value").then(snapshot => {
      const user = snapshot.val();
      const saldoAtual = user.saldoCarteira || 0;
      const bonusAtual = user.saldoBonus || 0;

      if (bonusAtual < 30) {
        alert("O valor mínimo para resgatar é R$30,00.");
        return;
      }

      const novoSaldo = saldoAtual + bonusAtual;

      db.ref("usuarios/" + telefoneLogado).update({
        saldoCarteira: novoSaldo,
        saldoBonus: 0
      }).then(() => {
        alert("Bônus resgatado com sucesso!");
        carregarEquipe();
      });
    });
  }
</script>

</body>
</html>
