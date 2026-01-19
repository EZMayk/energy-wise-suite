import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations, Lang } from '@/i18n/translations';

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_KEY = 'app_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_KEY) as Lang | null;
      if (stored === 'es' || stored === 'en') setLangState(stored);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LOCAL_KEY, l); } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'es' ? 'en' : 'es';
      try { localStorage.setItem(LOCAL_KEY, next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key: string) => {
    // allow nested keys like 'pages' or flat keys
    // @ts-ignore
    const dict = translations[lang] ?? translations['es'];
    return (dict as any)[key];
  }, [lang]);

  const value: LanguageContextType = { lang, setLang, toggleLang, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
