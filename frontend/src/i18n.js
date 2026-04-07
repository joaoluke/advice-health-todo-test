import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcomeBack: 'Welcome Back',
      signInManage: 'Sign in to manage your tasks',
      username: 'Username',
      password: 'Password',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      noAccount: "Don't have an account?",
      createOne: 'Create one',
      createAccount: 'Create Account',
      joinUs: 'Join us to start managing tasks',
      email: 'Email address',
      signUp: 'Sign Up',
      creatingAccount: 'Creating account...',
      alreadyHaveAccount: 'Already have an account?',
      myToDoList: 'Bravi To-Do List',
      logout: 'Logout',
      categories: 'Categories',
      noCategories: 'No categories yet.',
      whatNeedsToBeDone: 'What needs to be done?',
      add: 'Add',
      loadingTasks: 'Loading tasks...',
      noTasksYet: 'You have no tasks yet. Enjoy your day!',
      langEn: 'EN',
      langPt: 'PT',
      invalidLogin: 'Invalid username or password.',
      regError: 'An error occurred during registration.',
      suggestTask: 'Suggest a Task 💡',
      suggesting: 'Suggesting...',
    },
  },
  pt: {
    translation: {
      welcomeBack: 'Bem-vindo de volta',
      signInManage: 'Entre para gerenciar suas tarefas',
      username: 'Usuário',
      password: 'Senha',
      signIn: 'Entrar',
      signingIn: 'Entrando...',
      noAccount: 'Não tem uma conta?',
      createOne: 'Crie uma',
      createAccount: 'Criar Conta',
      joinUs: 'Junte-se a nós para organizar tarefas',
      email: 'Endereço de email',
      signUp: 'Cadastrar-se',
      creatingAccount: 'Criando conta...',
      alreadyHaveAccount: 'Já tem uma conta?',
      myToDoList: 'Bravi - Lista de Tarefas',
      logout: 'Sair',
      categories: 'Categorias',
      noCategories: 'Nenhuma categoria.',
      whatNeedsToBeDone: 'O que precisa ser feito?',
      add: 'Adicionar',
      loadingTasks: 'Carregando tarefas...',
      noTasksYet: 'Você não tem nenhuma tarefa. Aproveite seu dia!',
      langEn: 'EN',
      langPt: 'PT',
      invalidLogin: 'Nome de usuário ou senha inválidos.',
      regError: 'Ocorreu um erro durante o registro.',
      suggestTask: 'Sugira uma Tarefa 💡',
      suggesting: 'Sugerindo...',
    },
  },
};

const savedLang = localStorage.getItem('app_language') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
