// === Firebase Config ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// AVISO DE SEGURANÇA: As chaves do Firebase aqui são públicas. 
// A REAL segurança deve ser garantida pelas **REGRAS DE SEGURANÇA DO FIRESTORE** no console do Firebase!

// === EmailJS ===
(function () {
  emailjs.init("z_mKZRnzlVblkfwLH");
})();

// === Firebase Initialization ===
const firebaseConfig = {
  apiKey: "AIzaSyDptOk7ugvWec3fYUUKviV1bcxMjAsWH14",
  authDomain: "pixellabni.firebaseapp.com",
  projectId: "pixellabni",
  storageBucket: "pixellabni.firebasestorage.app",
  messagingSenderId: "888898952101",
  appId: "1:888898952101:web:a6d3e55e0fe06f84a3664c",
  measurementId: "G-ZC10VQ7LXQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// === EmailJS Contato (Refinado com Status) ===
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const contactStatus = document.getElementById("contact-status"); // Verifique se o ID no index.html é 'contact-status'

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Feedback visual (início)
    contactStatus.textContent = "Enviando mensagem...";
    contactStatus.style.color = "#a78bfa"; // Cor temporária (roxo)

    emailjs.sendForm("service_rf5grth", "template_4qua91k", contactForm)
      .then(() => {
        contactStatus.textContent = "Mensagem enviada com sucesso! 🚀";
        contactStatus.style.color = "green"; // Cor de sucesso
        contactForm.reset();
      })
      .catch(() => {
        contactStatus.textContent = "Erro ao enviar mensagem. Tente novamente.";
        contactStatus.style.color = "red"; // Cor de erro
      });
  });
}

// === Login e Consulta do Pedido (Refinado com Erros Específicos) ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const loginStatus = document.getElementById("login-status");
  const orderStatusDiv = document.getElementById("order-status");
  const orderProgress = document.getElementById("order-progress");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm["loginEmail"].value.trim();
    const password = loginForm["loginPassword"].value.trim();

    loginStatus.textContent = "Autenticando...";
    loginStatus.style.color = "#a78bfa"; // Cor temporária (roxo)
    orderStatusDiv.style.display = "none";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      loginStatus.textContent = "Acesso realizado com sucesso! ✅";
      loginStatus.style.color = "green"; // Cor de sucesso

      // Buscar status no Firestore com o e-mail do usuário
      const docRef = doc(db, "pedidos", user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const status = data.status || "Sem status definido";
        const update = data.ultimo_update || "";
        orderProgress.innerHTML = `
          <strong>Status do pedido:</strong> ${status}<br>
          <span style="font-size: 0.9rem; color: #9ca3af;">Última atualização: ${update}</span>
        `;
      } else {
        // Esta mensagem ocorrerá se o login for bem-sucedido, mas não houver pedido vinculado
        orderProgress.textContent = "Nenhum pedido encontrado para este e-mail.";
      }

      orderStatusDiv.style.display = "block";
    } catch (error) {
      console.error("Erro no login:", error.code, error.message);
      
      let errorMessage = "Erro no login. Tente novamente.";

      // Trata erros comuns do Firebase Auth para dar feedback melhor (UX)
      // Mantém a mensagem genérica para não revelar se o e-mail existe (segurança)
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = "E-mail ou senha incorretos. Tente novamente.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "O formato do e-mail é inválido.";
      } else {
        errorMessage = "Erro inesperado. Verifique sua conexão.";
      }

      loginStatus.textContent = errorMessage;
      loginStatus.style.color = "red"; // Cor de erro
    }
  });
}

// === MENU HAMBÚRGUER ===
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navMenu.classList.toggle("active");
  });

  // Fechar o menu ao clicar em um link
  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });
}