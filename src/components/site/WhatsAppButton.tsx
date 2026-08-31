import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { contactInfo } from '@/data/siteContent';
import { useSiteSettings } from '@/hooks/useSiteContent';

export const WhatsAppButton = () => {
  const { t, lang } = useLanguage();
  const { getSetting } = useSiteSettings();
  const waNumber = getSetting('wa_number') || contactInfo.waNumber;
  const [open, setOpen] = useState(false);

  const programs = [
    {
      key: 'preschool',
      label: t('Preschool', 'Preschool'),
      message: t(
        'Halo Palmtrees, saya tertarik untuk mengetahui lebih lanjut tentang program Preschool. Mohon informasinya, terima kasih.',
        'Hello Palmtrees, I am interested to know more about the Preschool program. Please share the details, thank you.'
      ),
    },
    {
      key: 'kindergarten',
      label: t('Kindergarten', 'Kindergarten'),
      message: t(
        'Halo Palmtrees, saya tertarik untuk mengetahui lebih lanjut tentang program Kindergarten. Mohon informasinya, terima kasih.',
        'Hello Palmtrees, I am interested to know more about the Kindergarten program. Please share the details, thank you.'
      ),
    },
    {
      key: 'elementary',
      label: t('Elementary', 'Elementary'),
      message: t(
        'Halo Palmtrees, saya tertarik untuk mengetahui lebih lanjut tentang program Elementary. Mohon informasinya, terima kasih.',
        'Hello Palmtrees, I am interested to know more about the Elementary program. Please share the details, thank you.'
      ),
    },
    {
      key: 'inklusi',
      label: t('Program Inklusi', 'Inclusion Program'),
      message: t(
        'Halo Palmtrees, saya tertarik untuk mengetahui lebih lanjut tentang Program Inklusi. Mohon informasinya, terima kasih.',
        'Hello Palmtrees, I am interested to know more about the Inclusion Program. Please share the details, thank you.'
      ),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ animationDuration: '0.2s' }}
        >
          {programs.map((p) => {
            const msg = encodeURIComponent(p.message);
            return (
              <a
                key={p.key}
                href={`https://wa.me/${waNumber}?text=${msg}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 bg-white hover:bg-[#F5F0E6] rounded-full shadow-lg border border-[#8B5E3C]/15 pl-4 pr-5 py-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <span className="w-8 h-8 rounded-full bg-green-500 group-hover:bg-green-600 flex items-center justify-center text-white flex-shrink-0 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <span className="text-sm font-semibold text-[#8B5E3C] whitespace-nowrap">
                  {p.label}
                </span>
              </a>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="WhatsApp"
        className="relative group"
      >
        {!open && (
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></div>
        )}
        <div
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
            open
              ? 'bg-[#8B5E3C] hover:bg-[#7a4e2c] rotate-90'
              : 'bg-green-500 hover:bg-green-600 hover:scale-110'
          } text-white`}
          style={!open ? { animation: 'gentleBounce 2s ease-in-out infinite' } : undefined}
        >
          {open ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
          )}
        </div>
      </button>
    </div>
  );
};
