import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { TreeIllustration } from './Decorations';
import { Logo } from './Logo';
import { contactInfo } from '@/data/siteContent';


export const Footer = () => {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await fetch('https://famous.ai/api/crm/6a05f5ed7fae75f422be90c0/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'footer-signup',
          tags: ['newsletter', 'palmtrees-footer'],
        }),
      });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="relative bg-[#F5F0E6] border-t border-[#8B5E3C]/15 overflow-hidden">
      {/* Tree illustration backdrop */}
      <TreeIllustration className="absolute -bottom-10 -right-10 w-72 h-72 opacity-15 pointer-events-none" />
      <TreeIllustration className="absolute -bottom-20 left-1/4 w-48 h-48 opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-4 text-sm text-[#8B5E3C]/85 leading-relaxed">
              {t(
                'Sekolah Montessori dengan program inklusi di BSD, Tangerang Selatan. Tempat anak tumbuh dengan kasih dan rasa ingin tahu.',
                'A Montessori school with an inclusive program in BSD, South Tangerang. Where children grow with love and curiosity.'
              )}
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: Instagram, href: contactInfo.instagram, label: 'Instagram' },
                { Icon: Facebook, href: contactInfo.facebook, label: 'Facebook' },
                { Icon: Youtube, href: contactInfo.youtube, label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center hover:bg-[#7A9A01] hover:scale-110 hover:rotate-6 transition-all"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-quicksand font-bold text-[#8B5E3C] text-lg mb-4">
              {t('Tautan Cepat', 'Quick Links')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { key: 'home' as const, id: 'Beranda', en: 'Home' },
                { key: 'about' as const, id: 'Tentang Kami', en: 'About Us' },
                { key: 'programs' as const, id: 'Program', en: 'Programs' },
                { key: 'method' as const, id: 'Metode Montessori', en: 'Montessori Method' },
                { key: 'admission' as const, id: 'Pendaftaran', en: 'Admission' },
                { key: 'inclusion' as const, id: 'Program Inklusi', en: 'Inclusion Program' },
                { key: 'blog' as const, id: 'Blog', en: 'Blog' },
                { key: 'contact' as const, id: 'Kontak', en: 'Contact' },
              ].map((l) => (
                <li key={l.key}>
                  <Link
                    to={getRoute(l.key, lang)}
                    className="text-[#8B5E3C]/80 hover:text-[#7A9A01] hover:translate-x-1 inline-block transition-all"
                  >
                    🌱 {lang === 'id' ? l.id : l.en}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Contact */}
          <div>
            <h4 className="font-quicksand font-bold text-[#8B5E3C] text-lg mb-4">
              {t('Hubungi Kami', 'Contact Us')}
            </h4>
            <ul className="space-y-3 text-sm text-[#8B5E3C]/85">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#7A9A01]" />
                <span>{t(contactInfo.addressId, contactInfo.addressEn)}</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-[#7A9A01]" />
                <a href={`tel:${contactInfo.phoneTel}`} className="hover:text-[#7A9A01]">{t('Telp.', 'Phone')} {contactInfo.phoneDisplay}</a>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-[#7A9A01]" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#7A9A01]">{contactInfo.email}</a>
              </li>
              <li className="flex gap-2 items-center">
                <MessageCircle className="w-4 h-4 text-[#7A9A01]" />
                <a
                  href={`https://wa.me/${contactInfo.waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#7A9A01]"
                >WA: {contactInfo.waDisplay}</a>
              </li>
            </ul>

          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-quicksand font-bold text-[#8B5E3C] text-lg mb-4">
              {t('Cerita Bulanan', 'Monthly Stories')}
            </h4>
            <p className="text-sm text-[#8B5E3C]/85 mb-3">
              {t(
                'Dapatkan tips parenting Montessori langsung di inbox Ayah Bunda.',
                'Get Montessori parenting tips straight to your inbox.'
              )}
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email@anda.com', 'your@email.com')}
                  className="flex-1 px-4 py-2.5 text-sm rounded-l-full border border-[#8B5E3C]/20 bg-white focus:outline-none focus:border-[#7A9A01]"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2.5 bg-[#7A9A01] text-white rounded-r-full hover:bg-[#8B5E3C] transition-colors disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {status === 'success' && (
                <p className="text-xs text-[#7A9A01] font-semibold">
                  {t('🌿 Terima kasih sudah bergabung!', '🌿 Thanks for joining!')}
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-600">
                  {t('Mohon masukkan email yang valid.', 'Please enter a valid email.')}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#8B5E3C]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8B5E3C]/70">
          <p>© {new Date().getFullYear()} Palmtrees Montessori School. {t('Dibuat dengan ❤️ di BSD.', 'Made with ❤️ in BSD.')}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#7A9A01]">{t('Kebijakan Privasi', 'Privacy Policy')}</a>
            <a href="#" className="hover:text-[#7A9A01]">{t('Syarat & Ketentuan', 'Terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
