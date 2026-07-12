import { useState } from 'react';
import { Sun, BookOpen, Palette, Music, Sparkles, Users, Coffee, Trees, Heart, Stethoscope, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { Parallax } from '@/components/site/Parallax';
import { SectionReveal } from '@/components/site/SectionReveal';
import { images } from '@/data/siteContent';

const programs = [
  {
    key: 'preschool-kindergarten',
    labelId: 'Preschool dan Kindergarten · 2-6 th',
    labelEn: 'Preschool & Kindergarten · 2-6 y',
    titleId: 'Preschool dan Kindergarten',
    titleEn: 'Preschool & Kindergarten',
    descId: 'Program untuk usia 2-6 tahun. Anak membangun kemandirian, konsentrasi, dan cinta belajar melalui Practical Life, sensorial, bahasa, matematika, dan budaya dalam lingkungan Montessori yang terpersiapkan.',
    descEn: 'A program for ages 2-6. Children build independence, concentration, and a love of learning through Practical Life, sensorial, language, math, and culture in a prepared Montessori environment.',
    img: images.programs.preschool,
    highlights: [
      { id: 'Practical Life lengkap', en: 'Full Practical Life' },
      { id: 'Material sensorial', en: 'Sensorial materials' },
      { id: 'Bahasa lisan & tulisan', en: 'Spoken & written language' },
      { id: 'Matematika & budaya', en: 'Math & culture' },
    ],
  },
  {
    key: 'elementary',
    labelId: 'Elementary · 6-12 th',
    labelEn: 'Elementary · 6-12 y',
    titleId: 'Elementary',
    titleEn: 'Elementary',
    descId: 'Program untuk usia 6-12 tahun, dari Kelas 1 hingga Kelas 6. Kurikulum Cosmic Education Montessori: matematika lanjut, sains, geografi, sejarah, dan proyek riset mandiri yang bermakna.',
    descEn: 'A program for ages 6-12, from Grade 1 through Grade 6. The Montessori Cosmic Education curriculum: advanced math, science, geography, history, and meaningful independent research projects.',
    img: images.programs.kindergarten,
    highlights: [
      { id: 'Matematika & geometri lanjut', en: 'Advanced math & geometry' },
      { id: 'Sains & eksperimen', en: 'Science & experiments' },
      { id: 'Riset mandiri & presentasi', en: 'Independent research & presentation' },
      { id: 'Kepemimpinan & kolaborasi', en: 'Leadership & collaboration' },
    ],
  },
  {
    key: 'inclusive',
    labelId: 'Program Inklusi',
    labelEn: 'Inclusion Program',
    titleId: 'Program Inklusi',
    titleEn: 'Inclusion Program',
    descId: 'Montessori untuk setiap anak. Pendampingan personal yang lembut bagi anak yang membutuhkan dukungan tambahan dalam gaya belajarnya — belajar berdampingan di kelas yang sama.',
    descEn: 'Montessori for every child. Gentle, personalized support for children who need extra help with their learning style — learning side by side in the same classroom.',
    img: images.programs.inclusive,
    highlights: [
      { id: 'Shadow teacher terlatih', en: 'Trained shadow teachers' },
      { id: 'Kolaborasi terapis', en: 'Therapist collaboration' },
      { id: 'Rencana belajar individual', en: 'Individual learning plans' },
      { id: 'Komunikasi orang tua', en: 'Parent communication' },
    ],
  },
];

const dayRhythm = [
  { icon: Sun, time: '08:00', id: 'Lingkar Pagi & Salam', en: 'Morning Circle & Greeting' },
  { icon: BookOpen, time: '08:30', id: 'Work Cycle: Practical Life', en: 'Work Cycle: Practical Life' },
  { icon: Sparkles, time: '09:30', id: 'Work Cycle: Sensorial & Language', en: 'Work Cycle: Sensorial & Language' },
  { icon: Coffee, time: '10:30', id: 'Snack Bersama', en: 'Snack Together' },
  { icon: Trees, time: '11:00', id: 'Outdoor Play & Berkebun', en: 'Outdoor Play & Gardening' },
  { icon: Palette, time: '11:30', id: 'Art & Practical Life', en: 'Art & Practical Life' },
  { icon: Music, time: '12:00', id: 'Lingkar Penutup & Pulang', en: 'Closing Circle & Dismissal' },
];

export default function Programs() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(0);
  const p = programs[active];

  return (
    <SiteLayout
      titleId="Kelas Preschool, Kindergarten, Elementary & Inklusi | Palmtrees Montessori BSD"
      titleEn="Preschool, Kindergarten, Elementary & Inclusion Classes | Palmtrees Montessori BSD"
      descId="Palm Trees Montessori BSD menyediakan program Preschool dan Kindergarten (2-6 tahun), Program Elementary (6-12 tahun), dan Program Inklusi."
      descEn="Palm Trees Montessori BSD offers a Preschool & Kindergarten program (ages 2-6), an Elementary program (ages 6-12), and an Inclusion Program."
    >
      {/* Hero — Inclusion Program imagery */}
      <Parallax image={images.inclusiveHero} speed={0.35} height="min-h-[440px]" overlayClass="bg-gradient-to-b from-[#3a2e22]/70 to-[#7A9A01]/60">
        <div className="h-full min-h-[440px] flex items-center justify-center px-4 text-center">
          <SectionReveal className="text-white max-w-3xl">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Program Kami', 'Our Programs')}
            </span>
            <h1 className="font-quicksand font-bold text-4xl sm:text-6xl mb-4 drop-shadow-lg">
              {t('Kelas di Palmtrees Montessori', 'Classes at Palmtrees Montessori')}
            </h1>
            <p className="text-lg sm:text-xl text-white/95">
              {t(
                'Palm Trees Montessori BSD menyediakan program Preschool dan Kindergarten (2-6 tahun), Program Elementary (6-12 tahun) yang dirancang sesuai tahap perkembangan anak dan Program Inklusi.',
                'Palm Trees Montessori BSD offers a Preschool & Kindergarten program (ages 2-6), an Elementary program (ages 6-12) designed around each stage of child development, and an Inclusion Program.'
              )}
            </p>
          </SectionReveal>
        </div>
      </Parallax>

      {/* Tabs */}
      <section className="px-4 sm:px-8 bg-white py-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {programs.map((prog, i) => (
              <button
                key={prog.key}
                onClick={() => setActive(i)}
                className={`px-5 py-3 rounded-full font-semibold text-sm transition-all ${
                  active === i
                    ? 'bg-[#7A9A01] text-white shadow-lg scale-105'
                    : 'bg-[#F5F0E6] text-[#8B5E3C] hover:bg-[#8B5E3C]/15'
                }`}
              >
                {lang === 'id' ? prog.labelId : prog.labelEn}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center" key={active} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <div className="relative">
              <img
                src={p.img}
                alt={p.titleEn}
                className="w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#7A9A01] text-white rounded-2xl px-5 py-3 shadow-xl">
                <div className="text-xs opacity-80">{t('Rasio kelas', 'Class ratio')}</div>
                <div className="font-quicksand font-bold text-xl">1 : 6</div>
              </div>
            </div>
            <div>
              <h2 className="font-quicksand font-bold text-3xl sm:text-4xl text-[#8B5E3C] mb-4">
                {lang === 'id' ? p.titleId : p.titleEn}
              </h2>
              <p className="text-[#8B5E3C]/85 leading-relaxed text-lg mb-6">
                {lang === 'id' ? p.descId : p.descEn}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#F5F0E6] rounded-2xl px-4 py-3">
                    <div className="w-6 h-6 rounded-full bg-[#7A9A01] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-[#8B5E3C] font-medium">
                      {lang === 'id' ? h.id : h.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Day in class infographic */}
      <section className="py-20 px-4 sm:px-8 bg-[#F5F0E6]">
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-3">
              {t('Sehari di Kelas', 'A Day in Class')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto">
              {t('Ritme harian yang menenangkan dan dapat diprediksi anak.', 'A calming, predictable daily rhythm.')}
            </p>
          </SectionReveal>

          <div className="relative">
            <div className="hidden md:block absolute left-8 top-8 bottom-8 w-1 bg-[#7A9A01]/30 rounded-full" />
            <div className="space-y-4">
              {dayRhythm.map((step, i) => {
                const Icon = step.icon;
                return (
                  <SectionReveal key={i} delay={i * 60}>
                    <div className="flex items-center gap-5 bg-white rounded-3xl p-5 shadow-md hover-lift">
                      <div className="relative w-16 h-16 rounded-full bg-[#7A9A01] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#7A9A01] uppercase tracking-wider">{step.time}</div>
                        <div className="font-quicksand font-bold text-lg text-[#8B5E3C]">
                          {lang === 'id' ? step.id : step.en}
                        </div>
                      </div>
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Inclusive section */}
      <Parallax image={images.programs.inclusive} speed={0.3} height="min-h-[420px]" overlayClass="bg-[#7A9A01]/70">
        <div className="h-full min-h-[420px] flex items-center justify-center text-center px-4">
          <div className="max-w-3xl text-white">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl mb-4 drop-shadow-lg">
              {t('Mendukung Setiap Gaya Belajar', 'Supporting Every Learning Style')}
            </h2>
            <p className="text-lg text-white/95 max-w-2xl mx-auto">
              {t(
                'Bukan tentang label. Tentang melihat setiap anak utuh, lalu menemani mereka tumbuh dengan caranya sendiri.',
                'Not about labels. About seeing each child whole, then walking alongside them on their own path.'
              )}
            </p>
          </div>
        </div>
      </Parallax>

      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-quicksand font-bold text-3xl sm:text-4xl text-[#8B5E3C] mb-3">
              {t('Bagaimana Program Inklusi Bekerja', 'How Our Inclusive Program Works')}
            </h2>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, titleId: 'Shadow Teacher', titleEn: 'Shadow Teacher', descId: 'Pendamping personal yang terlatih, bekerja sama dengan guru kelas untuk mendukung Ananda sehari-hari.', descEn: 'A trained personal companion who works alongside class guides to support your child daily.' },
              { icon: Stethoscope, titleId: 'Kolaborasi Terapis', titleEn: 'Therapist Collaboration', descId: 'Kami berkoordinasi dengan terapis okupasi, wicara, atau psikolog yang sudah dipilih keluarga.', descEn: 'We coordinate with the OT, speech, or psychologist your family already trusts.' },
              { icon: GraduationCap, titleId: 'Rencana Lembut', titleEn: 'Gentle Planning', descId: 'Individual goals yang fleksibel dan dievaluasi bersama orang tua secara rutin.', descEn: 'Flexible individual goals reviewed together with parents on a regular cadence.' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <SectionReveal key={i} delay={i * 100}>
                  <div className="bg-[#F5F0E6] rounded-3xl p-7 h-full hover-lift">
                    <div className="w-14 h-14 rounded-2xl bg-[#8B5E3C] flex items-center justify-center mb-4 shadow-md">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-quicksand font-bold text-xl text-[#8B5E3C] mb-2">
                      {lang === 'id' ? c.titleId : c.titleEn}
                    </h3>
                    <p className="text-[#8B5E3C]/85 leading-relaxed">
                      {lang === 'id' ? c.descId : c.descEn}
                    </p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
