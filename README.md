# 📝 Bravi - To-Do List Full-Stack (Desafio Técnico)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=black&labelColor=green)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Pytest](https://img.shields.io/badge/pytest-%23ffffff.svg?style=for-the-badge&logo=pytest&logoColor=2f9fe3)

Este repositório contém a entrega do Desafio Prático Full-Stack para a posição de Desenvolvedor Python na **Bravi**. A aplicação é um ecossistema completo de um Gerenciador de Tarefas *(To-Do List)* projetado com padrões corporativos modernos.

---

## 🚀 Como Executar o Projeto Localmente

O ecossistema é mantido em um **Monorepo** e os serviços são facilmente orquestrados graças à containerização do Docker.

### Pré-requisitos
- Ter o **Docker** e o **Docker Compose** instalados na sua máquina.

### Passo a Passo

1. **Clone do Repositório**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd advice-health-todo-test
   ```

2. **Inicie as Máquinas via Docker**
   Na raiz do projeto rode o comando:
   ```bash
   docker compose up --build -d
   ```
   > Esse comando irá subir de uma vez os três serviços: **PostgreSQL** (`:5433`), **Backend Django API** (`:8000`) e o **Frontend React Vite** (`:5173`).

3. **Aplique as Migrações do Banco de Dados**
   Com os containers rodando, abra o terminal e efetive a estrutura relacional do Django:
   ```bash
   docker compose exec backend python manage.py migrate
   ```

4. **Acesse as Ferramentas nas Seguintes URLs:**
   - **Frontend (Web App UI):** [http://localhost:5173](http://localhost:5173)
   - **Backend Documentação Completa (Swagger API):** [http://localhost:8000/docs/](http://localhost:8000/docs/)

---

## 💡 Decisões de Arquitetura e Bibliotecas

A principal filosofia dessa estrutura inteira foi seguir cegamente as premissas essenciais de Código Limpo *(SOLID, DRY, KISS)* e o padrão Model-Template-View do Django adaptado à Arquitetura REST. A divisão monolítica garante a separação estrita de escopos *(Frontend/Backend/DB)*.

### 🐍 Backend Python
- **Django & Django Rest Framework**: Escolhidos por garantirem o *DRY* (Don't Repeat Yourself) de maneira incrível (usando `ModelViewSets`). É possível ter *CRUDs* completos com poucas linhas de código, fáceis de extender.
- **Segurança com JWT**: Utilizou-se `djangorestframework-simplejwt` contendo _Access Tokens_ e _Refresh Tokens_ que blindam o processo sem guardar sessões no servidor (arquitetura *stateless*), lidando e isolando as tarefas compartilhadas de acordo com as permissões do usuário em tela (`self.request.user`).
- **Filtragens Automáticas**: Utilizou-se ferramentas como `django-filters` nativo, permitindo fazer query em status (`is_completed`) através do frontend nativamente via GET request parameters.
- **Teste Unitários Mocks com Pytest**: A suite `pytest` e a mock flag `pytest-mock` (utilizando *unittest.mock.patch*) testam as regras de ponta a ponta na API Externa. Elas cobrem comportamentos HTTP 201 e falhas na integração externa usando o pattern de interceptações, sem "sujar" e poluir o banco do test_suite simulado.

### ⚛️ Frontend NodeJs
- **React + Vite**: Compilado na velocidade da luz por ser padrão base da evolução de ECMAScript do Vite, ignorando o velho `create-react-app`.
- **Axios Interceptors**: Permitem criar a regra vital de atualizar o *Refresh Token* por debaixo dos panos. Assim que o *Access Token* vence na página, a lib nota o request voltando `HTTP 401`, pausa o processo, renova os Tokens sem o usuário ver, e repete a requisição, garantindo uma usabilidade infinita sem desconectar! 
- **TailwindCSS & Shadcn UI e Prettier**: Utilizado um rigoroso padronizador com **PrettierPluginTailwindCss** para garantir ordenação fluída. Os componentes usufruem do `Shadcn UI` que abraça o HTML semântico com classes minimalistas no melhor dos padrões Vercel — *dark/light modes*, border sutis e sem classes excessivas ou redundantes de CSS. Todos responsivos para versão `Mobile`.
- **React-i18next**: Responsável pela Internacionalização entre Portguês e Inglês com os `T()` selectors em Hooks. O sistema guarda a informação persistindo nativamente pela cache de `localStorage`.

---

## 🌐 Módulo API Externa Adicional (*Bonus Bravi*)

Dentro do escopo principal foi requerida uma integração isolada consumindo uma API.

O endpoint escolhido para consumo foi: **AdviceSlip API (`https://api.adviceslip.com/advice`)**.
- **O que faz?** É exposto um botão chamado *"Sugira-Me Uma Tarefa"* no projeto. Ele chama a rota especial `POST /api/todos/tasks/suggest/` no Backend, que contata a respectiva API, recebe o *"Sábio conselho"*, salva esse conselho dinamicamente transformando-o num *Title* de uma anotação em seu nome no painel principal e te devolve o ID sem atualizar a tela (usando *Single Page logic*).

🚀 *Obrigado pela oportunidade de participação neste processo!*
