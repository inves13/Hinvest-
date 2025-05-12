// Inicia o Firebase (adicione seu próprio código de configuração do Firebase aqui)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "https://seu-projeto.firebaseio.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// Seleção dos campos do formulário
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const passwordRepeatInput = document.getElementById("password-repeat");
const nameInput = document.getElementById("name");
const invitationCodeInput = document.getElementById("invitation-code"); // Código de indicação (opcional)

// Função de cadastro
const registerUser = (e) => {
  e.preventDefault(); // Impede o comportamento padrão de envio do formulário
  
  // Obter dados do formulário
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();
  const passwordRepeat = passwordRepeatInput.value.trim();
  const name = nameInput.value.trim();
  const invitationCode = invitationCodeInput.value.trim();

  // Verificação de senhas
  if (password !== passwordRepeat) {
    alert("As senhas não coincidem!");
    return;
  }

  // Criação do usuário no Firebase Authentication
  auth.createUserWithEmailAndPassword(phone + "@example.com", password) // Usando o número de telefone como e-mail temporário
    .then((userCredential) => {
      // Aguardar a criação do usuário
      const user = userCredential.user;

      // Adicionar informações no Firebase Realtime Database
      const userRef = database.ref('usuarios/' + user.uid);
      const userData = {
        codigo: Date.now(),  // Gerar um código único para o usuário
        codigoIndicacao: invitationCode || "",  // Usar código de indicação, se fornecido
        nome: name,
        saldo: 20,  // Valor inicial do saldo
        saldoConta: 10,  // Valor inicial da conta
        senha: password,
        timestamp: Date.now(),
        ultimoCheckin: "",  // Pode ser alterado mais tarde com base em ações do usuário
      };

      // Salvar no banco de dados
      return userRef.set(userData);
    })
    .then(() => {
      // Cadastro bem-sucedido
      alert("Cadastro realizado com sucesso!");
      
      // Redirecionar ou fazer o login automático
      window.location.href = "home.html"; // Redirecionar para a página inicial ou outro painel
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erro no cadastro: ", errorCode, errorMessage);
      alert("Erro no cadastro: " + errorMessage);
    });
};

// Evento de envio do formulário
document.getElementById("register-form").addEventListener("submit", registerUser);
