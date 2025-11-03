// === Firebase Config ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// === EmailJS ===
(function () {
  emailjs.init("z_mKZRnzlVblkfwLH");
})();

// === APRIMORAMENTO UX: Função Utilitária para validar e-mail ===
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

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

// === EmailJS Contato (Refinado com Status e Loading) ===
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const contactStatus = document.getElementById("contact-status");
  const submitButton = contactForm.querySelector('button[type="submit"]'); 
  const emailInput = contactForm["email"]; // --- ATUALIZAÇÃO (UX): Pega o input de email

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // --- ATUALIZAÇÃO (UX): Limpa o estado de erro anterior
    emailInput.removeAttribute('aria-invalid');
    // --- FIM ATUALIZAÇÃO ---

    // --- APRIMORAMENTO UX: VALIDAÇÃO ---
    const email = emailInput.value;
    if (!isValidEmail(email)) {
        contactStatus.textContent = "Por favor, insira um formato de e-mail válido.";
        contactStatus.style.color = "red";
        emailInput.setAttribute('aria-invalid', 'true'); // --- ATUALIZAÇÃO (UX/A11y)
        return; // Para a execução
    }
    // --- FIM APRIMORAMENTO ---
    
    // --- APRIMORAMENTO UI/UX: Feedback visual (início) ---
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    contactStatus.textContent = "Enviando mensagem...";
    contactStatus.style.color = "#a78bfa"; // Cor temporária (roxo)
    // --- FIM APRIMORAMENTO ---

    emailjs.sendForm("service_rf5grth", "template_4qua91k", contactForm)
      .then(() => {
        contactStatus.textContent = "Mensagem enviada com sucesso! 🚀";
        contactStatus.style.color = "green"; // Cor de sucesso
        contactForm.reset();
        
        // --- ATUALIZAÇÃO (UX): Limpa a mensagem de sucesso após 5 segundos
        setTimeout(() => {
            contactStatus.textContent = "";
            contactStatus.style.color = "inherit"; 
        }, 5000);
        // --- FIM ATUALIZAÇÃO ---
        
      })
      .catch(() => {
        contactStatus.textContent = "Erro ao enviar mensagem. Tente novamente.";
        contactStatus.style.color = "red"; // Cor de erro
      })
      .finally(() => {
        // --- APRIMORAMENTO UI/UX: Reseta o botão ---
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        // --- FIM APRIMORAMENTO ---
      });
  });
}

// === Login e Consulta do Pedido (Refinado com Loading) ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const loginStatus = document.getElementById("login-status");
  const orderStatusDiv = document.getElementById("order-status");
  const orderProgress = document.getElementById("order-progress");
  const loginButton = loginForm.querySelector('button[type="submit"]'); // Pega o botão

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm["loginEmail"].value.trim();
    const password = loginForm["loginPassword"].value.trim();

    // --- APRIMORAMENTO UI/UX: Feedback visual (início) ---
    loginButton.disabled = true;
    loginButton.classList.add('loading');
    loginStatus.textContent = "Autenticando...";
    loginStatus.style.color = "#a78bfa"; // Cor temporária (roxo)
    orderStatusDiv.style.display = "none";
    // --- FIM APRIMORAMENTO ---

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
    } finally {
        // --- APRIMORAMENTO UI/UX: Reseta o botão ---
        loginButton.disabled = false;
        loginButton.classList.remove('loading');
        // --- FIM APRIMORAMENTO ---
    }
  });
}

// === MENU HAMBÚRGUER (Aprimorado com A11y e Scroll Lock) ===
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navMenu.classList.toggle("active");

    // --- APRIMORAMENTO A11Y ---
    const isExpanded = navMenu.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isExpanded);

    // --- APRIMORAMENTO UX: Scroll Lock ---
    if (isExpanded) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // --- FIM APRIMORAMENTO ---
  });

  // Fechar o menu ao clicar em um link
  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("open");
      
      // --- APRIMORAMENTO A11Y ---
      menuToggle.setAttribute("aria-expanded", "false");

      // --- APRIMORAMENTO UX: Scroll Lock ---
      document.body.classList.remove('no-scroll');
      // --- FIM APRIMORAMENTO ---
    });
  });
}

// === APRIMORAMENTO UX: Botão "Voltar ao Topo" (NOVO) ===
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  // Mostrar/Esconder o botão
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) { // Mostra após 300px de scroll
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  // Ação de clique com scroll suave
  scrollTopBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link '#'
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}