// Importando os módulos necessários do Firebase
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Obtendo a instância do Firebase
const auth = getAuth();

// Adicionando o evento de login
document.getElementById("botao-login").addEventListener("click", function() {
    let telefone = document.getElementById("telefone").value;
    let senha = document.getElementById("senha").value;
    
    // Definindo a persistência da autenticação como LOCAL
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            // Tentando fazer login no Firebase Authentication com o telefone (como email)
            return signInWithEmailAndPassword(auth, telefone + "@example.com", senha);
        })
        .then((userCredential) => {
            // Login bem-sucedido
            const user = userCredential.user;
            
            // Armazenando o telefone do usuário localmente
            localStorage.setItem("telefoneUsuario", telefone);
            
            // Redirecionando para a página principal
            window.location.href = "index.html"; // Redireciona para a página principal
        })
        .catch((error) => {
            // Caso ocorra erro no login
            const errorCode = error.code;
            const errorMessage = error.message;
            
            console.error("Erro no login:", errorCode, errorMessage);
            alert("Erro ao fazer login. Verifique seus dados.");
        });
});
