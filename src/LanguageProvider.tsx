import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';

type LanguageContextType = {
  language: 'ro' | 'ru';
  setLanguage: (lang: 'ro' | 'ru') => void;

  translate: (key: any) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<'ro' | 'ru'>('ro');

  useEffect(() => {
    //@ts-ignore
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
    //@ts-ignore
      const userLang = window.Telegram.WebApp.initDataUnsafe.user.language_code;
      setLanguage(userLang === 'ru' ? 'ru' : 'ro'); // Default to RO
    }
  }, []);

  const translate = (key: keyof (typeof translations)['ro']) =>
    translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
