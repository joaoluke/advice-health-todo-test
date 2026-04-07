import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary/80"
    >
      <Globe size={16} />
      {i18n.language.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;
