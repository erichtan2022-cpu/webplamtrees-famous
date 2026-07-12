import { useState } from 'react';
import { Eye, Target, Heart, Leaf, Sparkles, Users2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { Parallax } from '@/components/site/Parallax';
import { SectionReveal } from '@/components/site/SectionReveal';
import { FloatingLeaf } from '@/components/site/Decorations';
import { images, teachers } from '@/data/siteContent';

const missionItemsId = [
  'Mempersiapkan anak-anak untuk menjadi pembelajar mandiri',
  'Mempersiapkan anak-anak untuk mencintai pembelajaran sepanjang hidup mereka',
  'Mempersiapkan anak-anak bagaimana merawat diri sendiri, orang lain, dan lingkungan',
  'Menemukan potensi anak-anak',
];

const missionItemsEn = [
  'Preparing children to become independent learners',
  'Preparing children to love learning throughout their lives',
  'Preparing children to care for themselves, others, and the environment',
  'Discovering each child\'s potential',
];

const timelineItems = [
  { icon: Eye, titleId: 'Visi', titleEn: 'Vision', descId: 'Becoming School Of Life', descEn: 'Becoming School Of Life', isList: false },
  { icon: Target, titleId: 'Misi', titleEn: 'Mission', descId: '', descEn: '', isList: true },
  { icon: Heart, titleId: 'Nilai Montessori', titleEn: 'Montessori Values', descId: 'Kemandirian, rasa hormat, kerja konsentrasi, dan cinta pada proses belajar seumur hidup.', descEn: 'Independence, respect, concentrated work, and love for lifelong learning.', isList: false },
  { icon: Leaf, titleId: 'Inklusi yang Tulus', titleEn: 'Genuine Inclusion', descId: 'Kami percaya inklusi bukan label, melainkan cara hidup bersama dalam komunitas.', descEn: 'We believe inclusion isn\'t a label — it\'s how we live together as a community.', isList: false },
];

const facilities = [
  { titleId: 'Kelas Preschool dan Kindergarten', titleEn: 'Preschool & Kindergarten Classroom', img: images.classrooms[0], descId: 'Lingkungan terpersiapkan untuk usia 2-6 tahun dengan material Montessori lengkap.', descEn: 'A prepared environment for ages 2-6 with complete Montessori materials.' },
  { titleId: 'Kelas Elementary', titleEn: 'Elementary Classroom', img: images.classrooms[1], descId: 'Ruang belajar usia 6-12 tahun untuk riset mandiri dan proyek kelompok.', descEn: 'A learning space for ages 6-12 for independent research and group projects.' },
  { titleId: 'Kelas Inklusi', titleEn: 'Inclusion Classroom', img: images.classrooms[2], descId: 'Ruang tenang dengan pendampingan personal untuk setiap gaya belajar.', descEn: 'A calm space with personal support for every learning style.' },
  { titleId: 'Ruang Practical Life', titleEn: 'Practical Life Room', img: images.classrooms[3], descId: 'Tempat anak belajar kemandirian harian.', descEn: 'Where children learn daily independence.' },
];

export default function About() {
  const { t, lang } = useLanguage();
  const [hoveredTeacher, setHoveredTeacher] = useState<number | null>(null);
  const [activeFacility, setActiveFacility] = useState(0);
  const missionItems = lang === 'id' ? missionItemsId : missionItemsEn;

  return (
    <SiteLayout
      titleId="Tentang Kami | Palmtrees Montessori School BSD"
      titleEn="About Us | Palmtrees Montessori School BSD"
      descId="Visi, misi, dan tim kami di Palm Trees Montessori — sekolah Montessori inklusi untuk usia 2-12 tahun di BSD City Tangerang Selatan."
      descEn="Vision, mission, and our team at Palm Trees Montessori — an inclusive Montessori school for ages 2-12 in BSD City, South Tangerang."
    >
      {/* Parallax header — school building */}
      <Parallax image={images.schoolBuilding} speed={0.35} height="min-h-[440px]" overlayClass="bg-gradient-to-b from-[#3a2e22]/60 to-[#7A9A01]/60">
        <div className="h-full min-h-[440px] flex items-center justify-center px-4 text-center">
          <SectionReveal className="text-white max-w-3xl">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Tentang Kami', 'About Us')}
            </span>
            <h1 className="font-quicksand font-bold text-4xl sm:text-6xl mb-4 drop-shadow-lg">
              Palm Trees Montessori School
            </h1>
            <p className="text-lg sm:text-xl text-white/95">
              {t(
                'Sekolah swasta untuk anak usia 2 hingga 12 tahun di jantung kota BSD.',
                'A private school for children aged 2 to 12 in the heart of BSD city.'
              )}
            </p>
          </SectionReveal>
        </div>
      </Parallax>

      {/* Intro story */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <p className="text-lg sm:text-xl text-[#8B5E3C]/90 leading-relaxed text-center">
              {t(
                'Palm Trees Montessori School adalah sekolah swasta untuk anak usia 2 hingga 12 tahun, dari Prasekolah hingga Kelas 6. Sekolah ini berdiri pada tahun 2000, dan didirikan oleh PT. Citra Anak Mandiri. Bangunan gedung dirancang untuk memenuhi kebutuhan anak-anak yang belajar di lingkungan Montessori. Palm Trees Montessori berafiliasi dengan North American Montessori Center (NAMC) dan anggota International Montessori Council (IMC). Kelas-kelas dipimpin oleh guru Montessori berpengalaman dan Sekolah memberikan prioritas lebih tinggi kepada orang tua dan guru terkait kinerja anak. Guru mengharapkan dan menyambut dialog dengan orang tua. Sekolah menawarkan kesempatan yang sama bagi semua orang dan tidak diskriminatif.',
                'Palm Trees Montessori School is a private school for children aged 2 to 12, from Preschool through Grade 6. The school was established in 2000 and founded by PT. Citra Anak Mandiri. The building was designed to meet the needs of children learning in a Montessori environment. Palm Trees Montessori is affiliated with the North American Montessori Center (NAMC) and is a member of the International Montessori Council (IMC). Classes are led by experienced Montessori teachers, and the school places a high priority on parents and teachers regarding each child\'s progress. Teachers expect and welcome dialogue with parents. The school offers equal opportunity for everyone and is non-discriminatory.'
              )}
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Story timeline */}
      <section className="relative py-20 px-4 sm:px-8 bg-[#F5F0E6] overflow-hidden">
        <FloatingLeaf className="w-20 h-20 top-10 right-[5%] opacity-30" delay={1} />
        <FloatingLeaf className="w-14 h-14 bottom-20 left-[8%] opacity-25" delay={3} color="#8B5E3C" />

        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-14">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {t('Visi, Misi & Nilai Kami', 'Our Vision, Mission & Values')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
              {t(
                'Setiap pilar di Palmtrees lahir dari satu keyakinan: anak-anak akan tumbuh saat mereka merasa dilihat.',
                'Every pillar at Palmtrees was born from one belief: children flourish when they feel seen.'
              )}
            </p>
          </SectionReveal>

          <div className="relative">
            {/* vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#7A9A01]/30 -translate-x-1/2 rounded-full" />

            <div className="space-y-10">
              {timelineItems.map((item, i) => {
                const Icon = item.icon;
                const isLeft = i % 2 === 0;
                return (
                  <SectionReveal key={i} delay={i * 100}>
                    <div className={`flex flex-col md:flex-row items-center gap-6 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                      <div className={`md:w-1/2 ${isLeft ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                        <div className="bg-white rounded-3xl p-7 shadow-md border border-[#8B5E3C]/10 hover-lift inline-block max-w-md text-left">
                          <h3 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-2">
                            {lang === 'id' ? item.titleId : item.titleEn}
                          </h3>
                          {item.isList ? (
                            <ul className="space-y-2 text-[#8B5E3C]/85 leading-relaxed">
                              {missionItems.map((m, j) => (
                                <li key={j} className="flex items-start gap-2">
                                  <Leaf className="w-4 h-4 text-[#7A9A01] mt-1 flex-shrink-0" />
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className={`text-[#8B5E3C]/80 leading-relaxed ${i === 0 ? 'font-quicksand font-bold text-xl text-[#7A9A01] italic' : ''}`}>
                              {lang === 'id' ? item.descId : item.descEn}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="relative z-10 w-16 h-16 rounded-full bg-[#7A9A01] flex items-center justify-center shadow-lg flex-shrink-0">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="md:w-1/2 hidden md:block" />
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <Users2 className="w-10 h-10 mx-auto mb-3 text-[#7A9A01]" />
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-3">
              {t('Tim Kami', 'Our Team')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto">
              {t('Hover untuk mengenal fakta Montessori favorit setiap guru.', 'Hover to discover each guide\'s favorite Montessori fact.')}
            </p>
          </SectionReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {teachers.map((teacher, i) => (
              <SectionReveal key={i} delay={i * 60}>
                <div
                  onMouseEnter={() => setHoveredTeacher(i)}
                  onMouseLeave={() => setHoveredTeacher(null)}
                  onClick={() => setHoveredTeacher(hoveredTeacher === i ? null : i)}
                  className="relative bg-white rounded-2xl p-3 shadow-lg hover:shadow-2xl hover:-rotate-2 transition-all cursor-pointer border-2 border-[#F5F0E6]"
                  style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.5}deg)` }}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <img src={images.teachers[i]} alt={teacher.name} loading="lazy" className="w-full h-full object-cover" />
                    {/* Tape effect */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#F5B700]/60 rounded-sm"></div>

                    <div className={`absolute inset-0 bg-[#8B5E3C]/95 text-white p-4 flex flex-col items-center justify-center text-center transition-opacity duration-300 ${hoveredTeacher === i ? 'opacity-100' : 'opacity-0'}`}>
                      <Sparkles className="w-5 h-5 mb-2 text-[#F5B700]" />
                      <p className="text-sm leading-relaxed">{lang === 'id' ? teacher.factId : teacher.factEn}</p>
                    </div>
                  </div>
                  <div className="text-center pb-2">
                    <h3 className="font-quicksand font-bold text-lg text-[#8B5E3C]">{teacher.name}</h3>
                    <p className="text-xs text-[#7A9A01] font-semibold uppercase tracking-wider">
                      {lang === 'id' ? teacher.roleId : teacher.roleEn}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 px-4 sm:px-8 bg-[#F5F0E6]">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-3">
              {t('Fasilitas Kami', 'Our Facilities')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto">
              {t('Pilih ruangan di bawah untuk melihat detailnya.', 'Pick a room below to see the details.')}
            </p>
          </SectionReveal>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <SectionReveal>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src={facilities[activeFacility].img} alt="" className="w-full h-full object-cover transition-opacity duration-500" />
                {/* hotspot dots over image */}
                {facilities.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFacility(i)}
                    style={{ top: `${20 + (i * 18) % 60}%`, left: `${15 + (i * 22) % 70}%` }}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white transition-all ${activeFacility === i ? 'bg-[#7A9A01] scale-125' : 'bg-white/80 hover:bg-[#7A9A01]'}`}
                    aria-label={`Hotspot ${i + 1}`}
                  >
                    <span className="absolute inset-0 rounded-full animate-ping bg-[#7A9A01]/50" />
                  </button>
                ))}
              </div>
            </SectionReveal>

            <div className="space-y-3">
              {facilities.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFacility(i)}
                  className={`w-full text-left p-5 rounded-2xl transition-all border-2 ${
                    activeFacility === i
                      ? 'bg-white border-[#7A9A01] shadow-lg'
                      : 'bg-white/60 border-transparent hover:bg-white hover:border-[#8B5E3C]/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 ${activeFacility === i ? 'bg-[#7A9A01]' : 'bg-[#8B5E3C]'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-quicksand font-bold text-lg text-[#8B5E3C]">
                        {lang === 'id' ? f.titleId : f.titleEn}
                      </h3>
                      <p className="text-sm text-[#8B5E3C]/80">
                        {lang === 'id' ? f.descId : f.descEn}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
