# 💻 Pixel Lab NI — Desenvolvimento Web

Bem-vindo ao repositório do site oficial da **Pixel Lab NI**, uma agência especializada em criar experiências digitais memoráveis, unindo design, tecnologia e performance para transformar ideias em resultados reais.

O site é uma Landing Page moderna, focada em performance e experiência do usuário (UX), apresentando os serviços da agência e permitindo contato direto. Possui também uma área de login para clientes acessarem o status de seus pedidos.

## ✨ Funcionalidades Principais

* **Página Inicial (`index.html`):** Apresentação da agência, serviços (Desenvolvimento Web, Lojas Virtuais, Manutenção & SEO) e seção "Sobre Nós".
* **Formulário de Contato:** Implementado com **EmailJS** para envio direto de mensagens.
* **Área de Clientes (`login.html`):** Página de login integrada com **Firebase Authentication** e **Firestore** para gerenciar o status de pedidos (apenas front-end para o login está visível nos arquivos).
* **Design Responsivo:** Layout otimizado para visualização em desktops, tablets e smartphones.
* **UX/Acessibilidade:** Implementação de botão "Voltar ao Topo", scroll suave, menu hamburguer aprimorado com *scroll lock* e atributos `aria` para acessibilidade.
* **Modo Escuro:** O site utiliza um tema escuro por padrão (`body.dark`).

## 🛠️ Tecnologias Utilizadas

Este projeto é construído principalmente com tecnologias web front-end e integrações com serviços de terceiros:

| Categoria | Tecnologia | Uso Principal |
| :--- | :--- | :--- |
| **Linguagens** | HTML5, CSS3, JavaScript (ES6+) | Estrutura, Estilização e Interatividade |
| **CSS** | Variáveis CSS, Media Queries | Tema Escuro, Responsividade |
| **Bibliotecas JS** | Firebase (Auth, Firestore) | Autenticação de clientes e Status de pedidos |
| **Serviços** | EmailJS | Envio de e-mails do formulário de contato |

## 🚀 Como Executar o Projeto Localmente

Siga estas etapas para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

Você precisará de um navegador web (como Chrome, Firefox) e, opcionalmente, de um servidor web local simples (como o Live Server do VS Code) para evitar problemas de CORS, especialmente ao testar integrações como o EmailJS ou a navegação entre `index.html` e `login.html`.

### Passos

1.  **Clone ou Baixe o Repositório:**
    ```bash
    git clone [https://docs.github.com/pt/repositories/creating-and-managing-repositories/about-repositories](https://docs.github.com/pt/repositories/creating-and-managing-repositories/about-repositories)
    cd pixel-lab-ni
    ```

2.  **Abra os Arquivos no Navegador:**
    * Simplesmente abra o arquivo `index.html` diretamente em seu navegador.
    * Alternativamente, use um servidor web local (recomendado):
        * Instale a extensão **Live Server** no VS Code.
        * Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

3.  **Configurações de Serviço (Opcional):**
    * **EmailJS:** O arquivo `script.js` possui a inicialização do EmailJS. Para que o formulário de contato funcione, você precisará de suas próprias chaves de serviço, modelo e ID de usuário e configurar o serviço no arquivo `script.js`.
    * **Firebase:** O login de clientes utiliza o Firebase. Para que a autenticação e busca de pedidos funcionem corretamente, você precisará:
        * Criar um projeto no Firebase.
        * Habilitar o Firestore e o Authentication.
        * Substituir o objeto `firebaseConfig` no `script.js` com suas próprias credenciais.
