import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'id' | 'en';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (id: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (initialLang) return initialLang;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('palmtrees-lang') as Lang | null;
      if (stored === 'id' || stored === 'en') return stored;
    }
    return 'id';
  });

  useEffect(() => {
    if (initialLang && initialLang !== lang) {
      setLangState(initialLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('palmtrees-lang', l);
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (id: string, en: string) => (lang === 'id' ? id : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};

// Route mapping between ID and EN
export const routeMap: Record<string, { id: string; en: string }> = {
  home: { id: '/id/beranda', en: '/en/home' },
  about: { id: '/id/tentang-kami', en: '/en/about-us' },
  programs: { id: '/id/program', en: '/en/programs' },
  method: { id: '/id/metode-montessori', en: '/en/montessori-method' },
  admission: { id: '/id/pendaftaran', en: '/en/admission' },
  inclusion: { id: '/id/program-inklusi', en: '/en/inclusive-program' },
  blog: { id: '/id/blog', en: '/en/blog' },
  contact: { id: '/id/kontak', en: '/en/contact' },
};

export const getRoute = (key: keyof typeof routeMap, lang: Lang) => routeMap[key][lang];
