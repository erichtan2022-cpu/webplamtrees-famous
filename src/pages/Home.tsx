import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Users, Star, Instagram, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { HeroSlider } from '@/components/site/HeroSlider';
import { Parallax } from '@/components/site/Parallax';
import { SectionReveal } from '@/components/site/SectionReveal';
import { FloatingLeaf, TreeIllustration } from '@/components/site/Decorations';
import { images, testimonials, contactInfo } from '@/data/siteContent';


const whyCards = [
  {
    icon: Sparkles,
    color: '#7A9A01',
    titleId: 'Montessori Asli',
    titleEn: 'Authentic Montessori',
    descId: 'Lingkungan terpersiapkan, material lengkap, dan guru bersertifikasi AMI/MACTE.',
    descEn: 'Prepared environment, complete materials, and AMI/MACTE-certified guides.',
  },
  {
    icon: Heart,
    color: '#8B5E3C',
    titleId: 'Program Inklusi',
    titleEn: 'Inclusion Program',
    descId: 'Mendukung setiap gaya belajar dengan shadow teacher dan kolaborasi terapis.',
    descEn: 'Supporting every learning style with shadow teachers and therapist collaboration.',
  },
  {
    icon: Users,
    color: '#D97757',
    titleId: 'Komunitas Hangat',
    titleEn: 'Warm Community',
    descId: 'Keluarga Palmtrees tumbuh bersama lewat kelas parenting & acara rutin.',
    descEn: 'The Palmtrees family grows together with parenting classes and regular events.',
  },
];

const programCards = [
  { key: 'preschool', route: 'programs' as const, titleId: 'Program Preschool dan Kindergarten', titleEn: 'Preschool & Kindergarten Program', ageId: 'Usia 2 – 6 tahun', ageEn: 'Ages 2 – 6 years', img: images.programs.preschool, descId: 'Practical Life, sensorial, bahasa, dan matematika awal dengan ritme harian yang konsisten.', descEn: 'Practical Life, sensorial, language, and early math with a consistent daily rhythm.' },
  { key: 'elementary', route: 'programs' as const, titleId: 'Program Elementary', titleEn: 'Elementary Program', ageId: 'Usia 6 – 12 tahun', ageEn: 'Ages 6 – 12 years', img: images.programs.kindergarten, descId: 'Matematika, sains, budaya, dan proyek riset mandiri yang bermakna hingga Kelas 6.', descEn: 'Math, science, culture, and meaningful independent research projects through Grade 6.' },
  { key: 'inclusive', route: 'inclusion' as const, titleId: 'Program Inklusi', titleEn: 'Inclusion Program', ageId: 'Montessori untuk Setiap Anak', ageEn: 'Montessori for Every Child', img: images.programs.inclusive, descId: 'Pendampingan personal untuk setiap anak agar berkembang dengan nyaman.', descEn: 'Personal support for every child to flourish at their own pace.' },
];


export default function Home() {
  const { t, lang } = useLanguage();
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTIdx((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <SiteLayout
      titleId="Sekolah Montessori Inklusi BSD | Palmtrees Montessori Tangerang Selatan"
      titleEn="Inclusive Montessori School BSD | Palmtrees Montessori South Tangerang"
      descId="Palmtrees Montessori adalah sekolah Montessori inklusi di BSD City, Tangerang Selatan. Toddler, Preschool, dan Kindergarten dengan komunitas hangat."
      descEn="Palmtrees Montessori is an inclusive Montessori school in BSD City, South Tangerang. Toddler, Preschool, and Kindergarten with a warm community."
    >
      <HeroSlider />

      {/* Why Palmtrees */}
      <section className="relative py-20 px-4 sm:px-8 bg-[#F5F0E6] overflow-hidden">
        <FloatingLeaf className="w-16 h-16 top-10 left-[5%] opacity-40" delay={0} />
        <FloatingLeaf className="w-12 h-12 top-32 right-[8%] opacity-30" delay={2} color="#8B5E3C" />
        <FloatingLeaf className="w-10 h-10 bottom-20 left-[15%] opacity-30" delay={4} />

        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-14">
            <span className="inline-block bg-[#7A9A01]/15 text-[#7A9A01] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Kenapa Palmtrees?', 'Why Palmtrees?')}
            </span>
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {t('Tempat Anak Tumbuh dengan Hati', 'Where Children Grow with Heart')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
              {t(
                'Tiga pilar yang menjadi fondasi setiap hari di kelas kami.',
                'Three pillars that ground every day in our classrooms.'
              )}
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {whyCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <SectionReveal key={i} delay={i * 100}>
                  <div className="bg-white rounded-3xl p-7 hover-lift wiggle-hover border border-[#8B5E3C]/10 h-full">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-md"
                      style={{ backgroundColor: c.color }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-2">
                      {lang === 'id' ? c.titleId : c.titleEn}
                    </h3>
                    <p className="text-[#8B5E3C]/80 leading-relaxed">
                      {lang === 'id' ? c.descId : c.descEn}
                    </p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parallax: Every Child is Unique */}
      <Parallax image={images.hero[1]} speed={0.3} height="min-h-[520px]" overlayClass="bg-gradient-to-r from-[#3a2e22]/75 to-[#7A9A01]/60">
        <div className="h-full min-h-[520px] flex items-center justify-center px-4 text-center">
          <SectionReveal className="max-w-3xl text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-5 text-[#F5F0E6]" style={{ animation: 'spin-slow 12s linear infinite' }} />
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl lg:text-6xl mb-5 drop-shadow-lg leading-tight">
              {t('Setiap Anak Unik, Setiap Anak Berharga', 'Every Child is Unique, Every Child is Valued')}
            </h2>
            <p className="text-lg sm:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
              {t(
                'Di Palmtrees, kami percaya bahwa keberagaman adalah hadiah. Setiap anak datang dengan ritme dan keajaibannya sendiri.',
                'At Palmtrees, we believe diversity is a gift. Every child arrives with their own rhythm and wonder.'
              )}
            </p>
          </SectionReveal>
        </div>
      </Parallax>

      {/* Program Highlight */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#F5F0E6] to-white">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <span className="inline-block bg-[#8B5E3C]/10 text-[#8B5E3C] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Program Kami', 'Our Programs')}
            </span>
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {t('Dari Preschool hingga Elementary', 'From Preschool to Elementary')}
            </h2>

          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programCards.map((p, i) => (
              <SectionReveal key={p.key} delay={i * 80}>
                <Link
                  to={getRoute(p.route, lang)}

                  className="group block bg-white rounded-3xl p-6 hover-lift border border-[#8B5E3C]/10 text-center h-full"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-[#7A9A01]/20 group-hover:scale-110 transition-transform" />
                    <img
                      src={p.img}
                      alt={p.titleEn}
                      loading="lazy"
                      className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:rotate-6 transition-transform"
                    />
                  </div>
                  <h3 className="font-quicksand font-bold text-xl text-[#8B5E3C] mb-1">
                    {lang === 'id' ? p.titleId : p.titleEn}
                  </h3>
                  <div className="text-xs font-bold text-[#7A9A01] uppercase tracking-wider mb-3">
                    {lang === 'id' ? p.ageId : p.ageEn}
                  </div>
                  <p className="text-sm text-[#8B5E3C]/80 leading-relaxed">
                    {lang === 'id' ? p.descId : p.descEn}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#7A9A01] group-hover:gap-2 transition-all">
                    {t('Pelajari', 'Learn more')} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-4 sm:px-8 bg-[#8B5E3C] overflow-hidden">
        <TreeIllustration className="absolute -top-20 -left-20 w-80 h-80 opacity-10" />
        <TreeIllustration className="absolute -bottom-32 -right-20 w-96 h-96 opacity-10" />

        <div className="relative max-w-4xl mx-auto">
          <SectionReveal className="text-center mb-10">
            <span className="inline-block bg-white/15 text-[#F5F0E6] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Cerita Ayah Bunda', 'From Our Parents')}
            </span>
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-white">
              {t('Testimoni Keluarga Palmtrees', 'Palmtrees Family Stories')}
            </h2>
          </SectionReveal>

          <div className="relative">
            <div className="bg-[#F5F0E6] rounded-3xl p-8 sm:p-12 shadow-2xl text-center" key={tIdx} style={{ animation: 'fadeInUp 0.6s ease-out' }}>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F5B700] text-[#F5B700]" />
                ))}
              </div>
              <p className="text-lg sm:text-2xl text-[#3a2e22] italic mb-6 leading-relaxed max-w-2xl mx-auto">
                "{lang === 'id' ? testimonials[tIdx].quoteId : testimonials[tIdx].quoteEn}"
              </p>
              <div className="font-quicksand font-bold text-xl text-[#8B5E3C]">{testimonials[tIdx].name}</div>
            </div>


            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setTIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-[#F5F0E6] text-[#8B5E3C] flex items-center justify-center hover:bg-[#7A9A01] hover:text-white transition-colors"
                aria-label="Previous"
              ><ChevronLeft className="w-5 h-5" /></button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTIdx(i)}
                    className={`h-2 rounded-full transition-all ${i === tIdx ? 'w-8 bg-[#7A9A01]' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTIdx((i) => (i + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-[#F5F0E6] text-[#8B5E3C] flex items-center justify-center hover:bg-[#7A9A01] hover:text-white transition-colors"
                aria-label="Next"
              ><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram + CTA */}
      <section className="py-20 px-4 sm:px-8 bg-[#F5F0E6]">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-10">
            <Instagram className="w-10 h-10 mx-auto mb-4 text-[#7A9A01]" />
            <h2 className="font-quicksand font-bold text-3xl sm:text-4xl text-[#8B5E3C] mb-3">
              @palmtreesmontessori
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-xl mx-auto">
              {t(
                'Ikuti keseharian kami di Instagram. Cerita kecil yang penuh makna.',
                'Follow our daily life on Instagram. Small stories, big meaning.'
              )}
            </p>
          </SectionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
            {images.activities.map((src, i) => (
              <a
                key={i}
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden block"
                style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.05}s both` }}
              >
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-[#7A9A01]/0 group-hover:bg-[#7A9A01]/60 flex items-center justify-center transition-colors">
                  <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>


          <SectionReveal className="text-center">
            <div className="inline-block bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#8B5E3C]/10 max-w-2xl">
              <h3 className="font-quicksand font-bold text-2xl sm:text-3xl text-[#8B5E3C] mb-3">
                {t('Mau melihat sekolah kami langsung?', 'Want to see our school in person?')}
              </h3>
              <p className="text-[#8B5E3C]/80 mb-6">
                {t(
                  'Jadwalkan kunjungan dan rasakan suasana kelas Palmtrees bersama keluarga.',
                  'Schedule a visit and feel the Palmtrees classroom atmosphere with your family.'
                )}
              </p>
              <Link
                to={getRoute('admission', lang)}
                className="btn-bounce inline-flex items-center gap-2 bg-[#7A9A01] hover:bg-[#8B5E3C] text-white font-bold px-7 py-3.5 rounded-full shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                {t('Jadwalkan Kunjungan', 'Schedule a Visit')}
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </SiteLayout>
  );
}
