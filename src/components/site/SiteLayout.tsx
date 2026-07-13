import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { CursorTrail } from './CursorTrail';
import { useLanguage, routeMap } from '@/contexts/LanguageContext';

const BASE_URL = 'https://palmtreesmontessori.com';

function getAlternatePath(pathname: string, currentLang: string): string {
  for (const { id, en } of Object.values(routeMap)) {
    if (currentLang === 'id' && pathname === id) return en;
    if (currentLang === 'en' && pathname === en) return id;
  }
  if (pathname.startsWith('/id/')) return pathname.replace('/id/', '/en/');
  if (pathname.startsWith('/en/')) return pathname.replace('/en/', '/id/');
  return pathname;
}

function setMetaContent(selector: string, value: string) {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (el) el.setAttribute('content', value);
}

interface SiteLayoutProps {
  children: ReactNode;
  titleId: string;
  titleEn: string;
  descId?: string;
  descEn?: string;
  schemaJson?: string;
}

export const SiteLayout = ({ children, titleId, titleEn, descId, descEn, schemaJson }: SiteLayoutProps) => {
  const { lang } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const title = lang === 'id' ? titleId : titleEn;
    document.title = title;

    const desc = lang === 'id' ? descId : descEn;
    if (desc) {
      setMetaContent('meta[name="description"]', desc);
    }

    setMetaContent('meta[property="og:title"]', title);
    if (desc) setMetaContent('meta[property="og:description"]', desc);

    const canonicalUrl = `${BASE_URL}${location.pathname}`;

    const ogUrlEl = document.getElementById('og-url-tag');
    if (ogUrlEl) ogUrlEl.setAttribute('content', canonicalUrl);

    const canonicalEl = document.getElementById('canonical-tag');
    if (canonicalEl) canonicalEl.setAttribute('href', canonicalUrl);

    const altPath = getAlternatePath(location.pathname, lang);
    const idUrl = lang === 'id' ? canonicalUrl : `${BASE_URL}${altPath}`;
    const enUrl = lang === 'en' ? canonicalUrl : `${BASE_URL}${altPath}`;
    const hreflangId = document.getElementById('hreflang-id');
    const hreflangEn = document.getElementById('hreflang-en');
    if (hreflangId) hreflangId.setAttribute('href', idUrl);
    if (hreflangEn) hreflangEn.setAttribute('href', enUrl);
  }, [lang, titleId, titleEn, descId, descEn, location.pathname]);

  useEffect(() => {
    const scriptId = 'page-schema-json';
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schemaJson) {
      if (!el) {
        el = document.createElement('script');
        el.id = scriptId;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.textContent = schemaJson;
    }
    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [schemaJson]);

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
