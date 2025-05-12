// Importa os módulos necessários do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Configuração do Firebase (dados reais do seu projeto)
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

// Referência para o banco de dados e autenticação
const database = getDatabase(app);
const auth = getAuth(app);

// Função para salvar o depósito no Firebase
function saveDeposit(amount, pixKey) {
  const depositRef = ref(database, 'deposits/' + new Date().getTime()); // Usando timestamp para garantir um ID único

  set(depositRef, {
    amount: amount,
    pixKey: pixKey,
    date: new Date().toISOString()
  }).then(() => {
    console.log("Depósito salvo no Firebase!");
  }).catch((error) => {
    console.error("Erro ao salvar no Firebase:", error);
  });
}

// Exporta a função de depósito para uso em outros arquivos
export { auth, database, ref, set, saveDeposit, onAuthStateChanged };
