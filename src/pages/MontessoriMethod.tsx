import { Link } from 'react-router-dom';
import { Quote, Sparkles, Heart, Compass, Leaf, BookOpen, Hand, Star, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { Parallax } from '@/components/site/Parallax';
import { SectionReveal } from '@/components/site/SectionReveal';
import { FloatingLeaf } from '@/components/site/Decorations';
import { images } from '@/data/siteContent';
import { usePageContent } from '@/hooks/usePageContent';
import { useSiteImages, useSiteCards } from '@/hooks/useSiteContent';

const defaultAdvantages = [
  { icon: Compass, titleId: 'Kemandirian Sejak Dini', titleEn: 'Independence from an Early Age', descId: 'Anak belajar memilih, memutuskan, dan menyelesaikan pekerjaannya sendiri — fondasi karakter yang kuat.', descEn: 'Children learn to choose, decide, and complete their own work — the foundation of strong character.' },
  { icon: Heart, titleId: 'Belajar Sesuai Ritme Anak', titleEn: 'Learning at the Child\'s Pace', descId: 'Setiap anak mengikuti ritme perkembangannya sendiri, tanpa dibandingkan dengan anak lain.', descEn: 'Every child follows their own developmental rhythm, never compared to others.' },
  { icon: Leaf, titleId: 'Lingkungan Terpersiapkan', titleEn: 'Prepared Environment', descId: 'Ruang kelas dirancang khusus dengan material Montessori asli yang mengundang rasa ingin tahu.', descEn: 'Classrooms are purposefully designed with authentic Montessori materials that spark curiosity.' },
  { icon: Star, titleId: 'Pembentukan Karakter', titleEn: 'Character Building', descId: 'Rasa hormat, tanggung jawab, dan empati tumbuh alami lewat kegiatan sehari-hari di kelas.', descEn: 'Respect, responsibility, and empathy grow naturally through everyday classroom life.' },
  { icon: BookOpen, titleId: 'Cinta Belajar Seumur Hidup', titleEn: 'Lifelong Love of Learning', descId: 'Anak tidak sekadar menghafal — mereka jatuh cinta pada proses belajar itu sendiri.', descEn: 'Children don\'t just memorize — they fall in love with the process of learning itself.' },
  { icon: Hand, titleId: 'Keterampilan Hidup Nyata', titleEn: 'Real-Life Skills', descId: 'Practical Life melatih motorik, konsentrasi, dan kemampuan merawat diri, orang lain, dan lingkungan.', descEn: 'Practical Life builds motor skills, concentration, and the ability to care for self, others, and the environment.' },
];

const advantageIcons = [Compass, Heart, Leaf, Star, BookOpen, Hand];

export default function MontessoriMethod() {
  const { t, lang } = useLanguage();
  const { getContent } = usePageContent('montessori');
  const { getImages } = useSiteImages();
  const { cards: advantageCards } = useSiteCards('advantage');

  const schoolBuildingImg = getImages('global', 'school_building')[0] || images.schoolBuilding;

  const advantages = advantageCards.length > 0
    ? advantageCards.map((c, i) => ({
        icon: advantageIcons[i % advantageIcons.length],
        titleId: c.title_id,
        titleEn: c.title_en,
        descId: c.desc_id,
        descEn: c.desc_en,
      }))
    : defaultAdvantages;

  return (
    <SiteLayout
      titleId="Metode Montessori untuk Character Building Anak | Palmtrees Montessori BSD"
      titleEn="The Montessori Method for Character Building | Palmtrees Montessori BSD"
      descId="Kenali metode Montessori di Palm Trees Montessori BSD — filosofi dan keunggulan Montessori untuk membentuk karakter anak."
      descEn="Discover the Montessori method at Palm Trees Montessori BSD — its philosophy and the advantages of Montessori for character building."
    >
      <section className="relative py-20 px-4 sm:px-8 bg-gradient-to-b from-[#F5F0E6] to-white text-center overflow-hidden">
        <FloatingLeaf className="w-20 h-20 top-10 left-[8%] opacity-30" />
        <FloatingLeaf className="w-14 h-14 bottom-10 right-[10%] opacity-25" delay={2} color="#8B5E3C" />
        <SectionReveal>
          <span className="inline-block bg-[#7A9A01]/15 text-[#7A9A01] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            {t('Metode Montessori', 'The Montessori Method')}
          </span>
          <h1 className="font-quicksand font-bold text-4xl sm:text-6xl text-[#8B5E3C] mb-5 max-w-4xl mx-auto leading-tight">
            {lang === 'id' ? getContent('hero_h1_id', 'Metode Montessori – Tepat untuk Character Building Anak') : getContent('hero_h1_en', 'The Montessori Method – The Right Path for Your Child\'s Character Building')}
          </h1>
          <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
            {lang === 'id' ? getContent('hero_subtitle_id', 'Lebih dari sekadar kurikulum — Montessori adalah cara memandang anak sebagai pembangun masa depannya sendiri.') : getContent('hero_subtitle_en', 'More than a curriculum — Montessori is a way of seeing the child as the builder of their own future.')}
          </p>
        </SectionReveal>
      </section>

      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {lang === 'id' ? getContent('philosophy_title_id', 'Filosofi Montessori') : getContent('philosophy_title_en', 'The Montessori Philosophy')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-3xl mx-auto text-lg leading-relaxed">
              {lang === 'id'
                ? getContent('philosophy_desc_id', 'Dr. Maria Montessori percaya bahwa anak-anak belajar paling baik ketika mereka diberi kebebasan dalam batas yang jelas, di lingkungan yang dipersiapkan dengan penuh kasih. Guru bukan pusat kelas — anaklah pusatnya. Tugas kami adalah mengamati, menemani, dan membuka jalan bagi keajaiban belajar setiap anak.')
                : getContent('philosophy_desc_en', 'Dr. Maria Montessori believed that children learn best when given freedom within clear limits, in a lovingly prepared environment. The teacher is not the center of the classroom — the child is. Our task is to observe, accompany, and open the way for each child\'s wonder of learning.')}
            </p>
          </SectionReveal>

          <SectionReveal>
            <div className="relative bg-[#F5F0E6] rounded-3xl p-8 sm:p-12 shadow-lg border border-[#8B5E3C]/10 max-w-4xl mx-auto">
              <Quote className="w-12 h-12 text-[#7A9A01] mb-5" />
              <blockquote className="font-quicksand text-xl sm:text-2xl text-[#3a2e22] italic leading-relaxed mb-6">
                "The child is not an empty being who owes whatever he knows to us who filled him up with it. No, the child is the builder of man. There is no man existing who has not been formed by the child he once was."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 rounded-full bg-[#7A9A01]" />
                <span className="font-quicksand font-bold text-[#8B5E3C]">Dr. Maria Montessori</span>
              </div>
              <FloatingLeaf className="w-14 h-14 -top-6 -right-4 opacity-40" delay={1} />
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-[#7A9A01]" />
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {lang === 'id' ? getContent('advantages_title_id', 'Keunggulan Metode Montessori') : getContent('advantages_title_en', 'Advantages of the Montessori Method')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
              {lang === 'id' ? getContent('advantages_subtitle_id', 'Enam alasan mengapa Montessori menjadi fondasi terbaik bagi tumbuh kembang dan karakter Ananda.') : getContent('advantages_subtitle_en', 'Six reasons why Montessori is the best foundation for your child\'s growth and character.')}
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <SectionReveal key={i} delay={i * 80}>
                  <div className="bg-[#F5F0E6] rounded-3xl p-7 h-full hover-lift border border-[#8B5E3C]/10">
                    <div className="w-14 h-14 rounded-2xl bg-[#7A9A01] flex items-center justify-center mb-4 shadow-md">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-quicksand font-bold text-xl text-[#8B5E3C] mb-2">
                      {lang === 'id' ? a.titleId : a.titleEn}
                    </h3>
                    <p className="text-[#8B5E3C]/85 leading-relaxed">
                      {lang === 'id' ? a.descId : a.descEn}
                    </p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      <Parallax image={schoolBuildingImg} speed={0.3} height="min-h-[420px]" overlayClass="bg-gradient-to-r from-[#3a2e22]/80 to-[#7A9A01]/60">
        <div className="h-full min-h-[420px] flex items-center justify-center text-center px-4">
          <SectionReveal className="max-w-3xl text-white">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl mb-5 drop-shadow-lg">
              {t('Saksikan Metode Montessori Secara Langsung', 'See the Montessori Method in Action')}
            </h2>
            <p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto">
              {t(
                'Kunjungi kelas kami di BSD dan rasakan sendiri suasana belajar yang tenang, tertata, dan penuh kasih.',
                'Visit our BSD classrooms and experience a calm, ordered, and loving learning atmosphere for yourself.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={getRoute('admission', lang)}
                className="btn-bounce inline-flex items-center justify-center gap-2 bg-[#7A9A01] hover:bg-[#8AB02A] text-white font-bold px-7 py-3.5 rounded-full shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                {t('Daftar Tour Sekolah', 'Book a School Tour')}
              </Link>
              <Link
                to={getRoute('programs', lang)}
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white text-white hover:text-[#8B5E3C] backdrop-blur-md border-2 border-white/60 font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105"
              >
                {t('Lihat Program Kami', 'See Our Programs')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </SectionReveal>
        </div>
      </Parallax>
    </SiteLayout>
  );
}
