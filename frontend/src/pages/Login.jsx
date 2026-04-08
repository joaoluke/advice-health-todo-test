import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, User } from 'lucide-react';

import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
  const { t } = useTranslation();
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
      <div className="absolute right-8 top-8 flex items-center gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-[400px] rounded-2xl border border-border bg-card p-10 shadow-xl duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            {t('welcomeBack')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('signInManage')}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              className="w-full rounded-lg border border-border bg-secondary/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
              placeholder={t('username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="password"
              className="w-full rounded-lg border border-border bg-secondary/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:-translate-y-[1px] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            {t('createOne')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
