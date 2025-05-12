<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resgatar Presente</title>
    <script type="module">
        // Importa os módulos necessários do Firebase
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
        import { getDatabase, ref, get, update } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

        // Configuração do Firebase (substitua pelos dados do seu projeto)
        const firebaseConfig = {
            apiKey: "sua-api-key",
            authDomain: "seu-auth-domain",
            databaseURL: "seu-database-url",
            projectId: "seu-project-id",
            storageBucket: "seu-storage-bucket",
            messagingSenderId: "seu-sender-id",
            appId: "seu-app-id"
        };

        // Inicializa o Firebase
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);

        // Função para resgatar presente
        function resgatarPresente() {
            const userId = "user123"; // Substitua com o ID do usuário logado
            const userRef = ref(database, 'usuarios/' + userId);

            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const nomeUsuario = userData.nome;
                    const ultimoResgate = userData.ultimoResgate || 0;
                    const agora = new Date().getTime();

                    // Verifica se já foi resgatado no dia
                    if (ultimoResgate && (agora - ultimoResgate < 24 * 60 * 60 * 1000)) {
                        document.getElementById("status").innerText = `Você já resgatou o presente hoje, ${nomeUsuario}. Aguarde até amanhã.`;
                        return;
                    }

                    // Atualiza o horário do resgate e o saldo
                    update(userRef, {
                        ultimoResgate: agora,
                        saldodaConta: userData.saldodaConta + 0.50 // Adiciona o valor do presente
                    });

                    document.getElementById("status").innerText = `Parabéns, ${nomeUsuario}! Presente resgatado!`;

                    // Atualiza o saldo após 24 horas
                    setTimeout(() => {
                        update(userRef, {
                            saldodaConta: userData.saldodaConta + 1.50 // Atualiza o saldo depois de 24 horas
                        });
                        document.getElementById("status").innerText = `Seu saldo foi atualizado para R$ ${userData.saldodaConta + 1.50}.`;
                    }, 24 * 60 * 60 * 1000); // 24 horas
                } else {
                    document.getElementById("status").innerText = "Usuário não encontrado.";
                }
            }).catch((error) => {
                console.error("Erro ao buscar dados do usuário: ", error);
                document.getElementById("status").innerText = "Ocorreu um erro. Tente novamente mais tarde.";
            });
        }
    </script>
</head>
<body>
    <h1>Resgatar Presente</h1>
    <button onclick="resgatarPresente()">Resgatar Presente</button>
    <p id="status"></p>
</body>
</html>
