import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { CursorTrail } from './CursorTrail';
import { useLanguage } from '@/contexts/LanguageContext';

interface SiteLayoutProps {
  children: ReactNode;
  titleId: string;
  titleEn: string;
  descId?: string;
  descEn?: string;
}

export const SiteLayout = ({ children, titleId, titleEn, descId, descEn }: SiteLayoutProps) => {
  const { lang } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    document.title = lang === 'id' ? titleId : titleEn;
    const desc = lang === 'id' ? descId : descEn;
    if (desc) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = desc;
    }
  }, [lang, titleId, titleEn, descId, descEn]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#3a2e22] flex flex-col">
      <CursorTrail />
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
