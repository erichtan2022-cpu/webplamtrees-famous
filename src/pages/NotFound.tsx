import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { TreeIllustration } from '@/components/site/Decorations';

export default function NotFound() {
  const { t, lang } = useLanguage();
  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        <TreeIllustration className="absolute -bottom-20 -left-20 w-72 h-72 opacity-25" />
        <TreeIllustration className="absolute -top-20 -right-20 w-64 h-64 opacity-20" />

        <div className="relative text-center max-w-2xl">
          <div className="relative mx-auto mb-6 w-56 h-56">
            {/* Hide-and-seek tree with peeking child */}
            <svg viewBox="0 0 220 220" className="w-full h-full">
              <rect x="100" y="120" width="20" height="90" rx="6" fill="#8B5E3C" />
              <ellipse cx="110" cy="100" rx="60" ry="90" fill="#7A9A01" transform="rotate(-22 110 100)" opacity="0.9" />
              <ellipse cx="110" cy="100" rx="60" ry="90" fill="#7A9A01" transform="rotate(22 110 100)" opacity="0.9" />
              <ellipse cx="110" cy="80" rx="55" ry="85" fill="#8AB02A" />
              {/* Peeking child face */}
              <circle cx="155" cy="135" r="14" fill="#F5C9A6" />
              <circle cx="151" cy="133" r="1.8" fill="#3a2e22" />
              <circle cx="159" cy="133" r="1.8" fill="#3a2e22" />
              <path d="M 150 140 Q 155 144 160 140" stroke="#3a2e22" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <div className="font-quicksand font-bold text-7xl text-[#8B5E3C] mb-2">404</div>
          <h1 className="font-quicksand font-bold text-2xl sm:text-3xl text-[#8B5E3C] mb-3">
            {t('Oops! Halaman ini sedang bermain petak umpet', 'Oops! This page is playing hide-and-seek')}
          </h1>
          <p className="text-[#8B5E3C]/80 mb-7 max-w-md mx-auto">
            {t(
              'Sepertinya halaman yang Ayah Bunda cari sedang bersembunyi di balik pohon palem. Yuk kembali ke beranda.',
              'It seems the page you\'re looking for is hiding behind a palm tree. Let\'s head back home.'
            )}
          </p>
          <Link
            to={getRoute('home', lang)}
            className="btn-bounce inline-flex items-center gap-2 bg-[#7A9A01] hover:bg-[#8B5E3C] text-white font-bold px-7 py-3.5 rounded-full shadow-lg"
          >
            <Home className="w-5 h-5" />
            {t('Kembali ke Beranda', 'Back to Home')}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
