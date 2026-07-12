import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, ChevronDown } from 'lucide-react';
import { useLanguage, routeMap, getRoute } from '@/contexts/LanguageContext';
import { Logo } from './Logo';

export const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const navItems: { key: keyof typeof routeMap; id: string; en: string; children?: { key: keyof typeof routeMap; id: string; en: string }[] }[] = [
    { key: 'home', id: 'Beranda', en: 'Home' },
    { key: 'about', id: 'Tentang Kami', en: 'About Us' },
    {
      key: 'programs', id: 'Program', en: 'Programs',
      children: [
        { key: 'method', id: 'Metode Montessori', en: 'Montessori Method' },
      ],
    },
    { key: 'admission', id: 'Pendaftaran', en: 'Admission' },
    { key: 'inclusion', id: 'Program Inklusi', en: 'Inclusion Program' },
    { key: 'blog', id: 'Blog', en: 'Blog' },
    { key: 'contact', id: 'Kontak', en: 'Contact' },
  ];


  const isActive = (key: keyof typeof routeMap) => {
    const path = getRoute(key, lang);
    return location.pathname === path;
  };

  const switchLang = (newLang: 'id' | 'en') => {
    if (newLang === lang) return;
    // Try to find current route key
    const currentKey = (Object.keys(routeMap) as (keyof typeof routeMap)[]).find(
      (k) => routeMap[k].id === location.pathname || routeMap[k].en === location.pathname
    );
    setLang(newLang);
    if (currentKey) {
      navigate(routeMap[currentKey][newLang]);
    } else {
      navigate(getRoute('home', newLang));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#F5F0E6]/95 backdrop-blur-md shadow-md py-2' : 'bg-[#F5F0E6]/80 backdrop-blur-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to={getRoute('home', lang)} className="flex-shrink-0 hover:scale-105 transition-transform">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navItems.map((n) =>
            n.children ? (
              <div key={n.key} className="relative group">
                <Link
                  to={getRoute(n.key, lang)}
                  className={`inline-flex items-center gap-1 whitespace-nowrap px-2.5 xl:px-3.5 py-2 rounded-full font-medium text-sm transition-all hover:bg-[#7A9A01]/10 hover:text-[#7A9A01] ${
                    isActive(n.key) || n.children.some((c) => isActive(c.key))
                      ? 'bg-[#7A9A01]/15 text-[#7A9A01]'
                      : 'text-[#8B5E3C]'
                  }`}
                >
                  {lang === 'id' ? n.id : n.en}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="bg-[#F5F0E6] rounded-2xl shadow-lg border border-[#8B5E3C]/10 py-2 px-2 min-w-[200px]">
                    {n.children.map((c) => (
                      <Link
                        key={c.key}
                        to={getRoute(c.key, lang)}
                        className={`block whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm transition-all hover:bg-[#7A9A01]/10 hover:text-[#7A9A01] ${
                          isActive(c.key) ? 'bg-[#7A9A01]/15 text-[#7A9A01]' : 'text-[#8B5E3C]'
                        }`}
                      >
                        {lang === 'id' ? c.id : c.en}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={n.key}
                to={getRoute(n.key, lang)}
                className={`whitespace-nowrap px-2.5 xl:px-3.5 py-2 rounded-full font-medium text-sm transition-all hover:bg-[#7A9A01]/10 hover:text-[#7A9A01] ${
                  isActive(n.key) ? 'bg-[#7A9A01]/15 text-[#7A9A01]' : 'text-[#8B5E3C]'
                }`}
              >
                {lang === 'id' ? n.id : n.en}
              </Link>
            )
          )}
        </nav>


        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle */}
          <div className="flex items-center bg-white/70 rounded-full p-1 border border-[#8B5E3C]/20 shadow-sm">
            <button
              onClick={() => switchLang('id')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                lang === 'id' ? 'bg-[#7A9A01] text-white shadow' : 'text-[#8B5E3C] hover:bg-[#F5F0E6]'
              }`}
              aria-label="Bahasa Indonesia"
            >ID</button>
            <button
              onClick={() => switchLang('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                lang === 'en' ? 'bg-[#7A9A01] text-white shadow' : 'text-[#8B5E3C] hover:bg-[#F5F0E6]'
              }`}
              aria-label="English"
            >EN</button>
          </div>

          <Link
            to={getRoute('admission', lang)}
            className="hidden md:inline-flex items-center gap-2 whitespace-nowrap bg-[#8B5E3C] hover:bg-[#7A9A01] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {t('Daftar Tour', 'Book a Tour')}
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-full bg-white/70 text-[#8B5E3C] hover:bg-[#7A9A01] hover:text-white transition-all"
            aria-label="Menu"
          >
            <div className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 py-4 bg-[#F5F0E6] border-t border-[#8B5E3C]/10 flex flex-col gap-1">
          {navItems.map((n, i) => (
            <div key={n.key} className="flex flex-col gap-1">
              <Link
                to={getRoute(n.key, lang)}
                style={{ animation: open ? `slideInLeft 0.4s ease-out ${i * 0.05}s both` : '' }}
                className={`px-4 py-3 rounded-2xl font-medium transition-all ${
                  isActive(n.key)
                    ? 'bg-[#7A9A01] text-white'
                    : 'text-[#8B5E3C] hover:bg-[#7A9A01]/10'
                }`}
              >
                <span className="inline-block mr-2">🌿</span>
                {lang === 'id' ? n.id : n.en}
              </Link>
              {n.children?.map((c) => (
                <Link
                  key={c.key}
                  to={getRoute(c.key, lang)}
                  style={{ animation: open ? `slideInLeft 0.4s ease-out ${i * 0.05 + 0.05}s both` : '' }}
                  className={`ml-8 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all ${
                    isActive(c.key)
                      ? 'bg-[#7A9A01] text-white'
                      : 'text-[#8B5E3C] hover:bg-[#7A9A01]/10'
                  }`}
                >
                  {lang === 'id' ? c.id : c.en}
                </Link>
              ))}
            </div>
          ))}
          <Link
            to={getRoute('admission', lang)}
            className="mt-2 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#8B5E3C] text-white font-semibold px-4 py-3 rounded-2xl"
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {t('Daftar Tour', 'Book a Tour')}
          </Link>
        </nav>
      </div>
    </header>
  );
};
