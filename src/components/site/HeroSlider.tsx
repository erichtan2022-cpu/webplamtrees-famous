import { useState, useEffect, useCallback } from 'react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { images } from '@/data/siteContent';

const slides = [
  {
    img: images.hero[0],
    headlineId: 'Tumbuh Bersama di Lingkungan Inklusif',
    headlineEn: 'Growing Together in an Inclusive Environment',
    subId: 'Ruang belajar Montessori yang hangat dan menerima setiap anak apa adanya.',
    subEn: 'A warm Montessori space that welcomes every child for who they are.',
  },
  {
    img: images.hero[1],
    headlineId: 'Bermain. Belajar. Bersahabat.',
    headlineEn: 'Play. Learn. Belong.',
    subId: 'Persahabatan tumbuh dari rasa saling menghargai setiap perbedaan.',
    subEn: 'Friendship grows from celebrating every kind of mind.',
  },
  {
    img: images.schoolBuilding,
    headlineId: 'Palm Trees Montessori BSD',
    headlineEn: 'Palm Trees Montessori BSD',
    subId: 'Sekolah Montessori Terakreditasi di Tangerang Selatan.',
    subEn: 'An Accredited Montessori School in South Tangerang.',
  },
];


export const HeroSlider = () => {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section
      className="relative w-full h-[85vh] min-h-[520px] max-h-[800px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides with Ken Burns */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img
            src={s.img}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className="w-full h-full object-cover"
            style={{
              animation: i === index ? `kenBurns${i % 3} 8s ease-out forwards` : 'none',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a2e22]/80 via-[#3a2e22]/30 to-[#3a2e22]/20" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="max-w-3xl text-white" key={index} style={{ animation: 'slideUp 0.8s ease-out' }}>
            <span className="inline-block bg-[#7A9A01]/90 backdrop-blur-sm text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-5">
              🌿 {t('Sekolah Montessori Inklusi · BSD', 'Inclusive Montessori School · BSD')}
            </span>
            <h1 className="font-quicksand font-bold text-3xl sm:text-5xl lg:text-6xl leading-tight mb-5 drop-shadow-lg">
              {lang === 'id' ? slides[index].headlineId : slides[index].headlineEn}
            </h1>
            <p className="text-base sm:text-xl text-white/95 mb-8 max-w-2xl drop-shadow">
              {lang === 'id' ? slides[index].subId : slides[index].subEn}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={getRoute('admission', lang)}
                className="inline-flex items-center justify-center gap-2 bg-[#7A9A01] hover:bg-[#8AB02A] text-white font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl text-base"
              >
                <Calendar className="w-5 h-5" />
                {t('Daftar Tour Sekolah', 'Book a School Tour')}
              </Link>
              <Link
                to={getRoute('programs', lang)}
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white text-white hover:text-[#8B5E3C] backdrop-blur-md border-2 border-white/60 font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105 text-base"
              >
                {t('Lihat Program Kami', 'See Our Programs')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Leaf arrows */}
      <button
        onClick={prev}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center hover:scale-110 transition-transform group"
        aria-label="Previous"
      >
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-lg">
          <path d="M32 4 C48 16, 56 32, 32 60 C8 32, 16 16, 32 4 Z" fill="#7A9A01" className="group-hover:fill-[#8AB02A]" transform="rotate(-90 32 32)" />
        </svg>
        <ArrowRight className="absolute w-5 h-5 text-white rotate-180" />
      </button>
      <button
        onClick={next}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center hover:scale-110 transition-transform group"
        aria-label="Next"
      >
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-lg">
          <path d="M32 4 C48 16, 56 32, 32 60 C8 32, 16 16, 32 4 Z" fill="#7A9A01" className="group-hover:fill-[#8AB02A]" transform="rotate(90 32 32)" />
        </svg>
        <ArrowRight className="absolute w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? 'w-10 bg-[#7A9A01]' : 'w-2.5 bg-white/70 hover:bg-white'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
