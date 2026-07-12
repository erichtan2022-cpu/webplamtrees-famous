import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { contactInfo } from '@/data/siteContent';

export const WhatsAppButton = () => {
  const { t } = useLanguage();
  const msg = encodeURIComponent(
    t(
      'Halo Palmtrees, saya tertarik untuk tahu lebih banyak tentang sekolah.',
      'Hello Palmtrees, I would like to know more about the school.'
    )
  );
  return (
    <a
      href={`https://wa.me/${contactInfo.waNumber}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="WhatsApp"
    >
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></div>
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all" style={{ animation: 'gentleBounce 2s ease-in-out infinite' }}>
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#8B5E3C] text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {t('Chat dengan kami', 'Chat with us')}
      </span>
    </a>
  );
};
