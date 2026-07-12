import { Link } from 'react-router-dom';
import { Quote, Sparkles, Heart, Compass, Leaf, BookOpen, Hand, Star, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { Parallax } from '@/components/site/Parallax';
import { SectionReveal } from '@/components/site/SectionReveal';
import { FloatingLeaf } from '@/components/site/Decorations';
import { images } from '@/data/siteContent';

const advantages = [
  { icon: Compass, titleId: 'Kemandirian Sejak Dini', titleEn: 'Independence from an Early Age', descId: 'Anak belajar memilih, memutuskan, dan menyelesaikan pekerjaannya sendiri — fondasi karakter yang kuat.', descEn: 'Children learn to choose, decide, and complete their own work — the foundation of strong character.' },
  { icon: Heart, titleId: 'Belajar Sesuai Ritme Anak', titleEn: 'Learning at the Child\'s Pace', descId: 'Setiap anak mengikuti ritme perkembangannya sendiri, tanpa dibandingkan dengan anak lain.', descEn: 'Every child follows their own developmental rhythm, never compared to others.' },
  { icon: Leaf, titleId: 'Lingkungan Terpersiapkan', titleEn: 'Prepared Environment', descId: 'Ruang kelas dirancang khusus dengan material Montessori asli yang mengundang rasa ingin tahu.', descEn: 'Classrooms are purposefully designed with authentic Montessori materials that spark curiosity.' },
  { icon: Star, titleId: 'Pembentukan Karakter', titleEn: 'Character Building', descId: 'Rasa hormat, tanggung jawab, dan empati tumbuh alami lewat kegiatan sehari-hari di kelas.', descEn: 'Respect, responsibility, and empathy grow naturally through everyday classroom life.' },
  { icon: BookOpen, titleId: 'Cinta Belajar Seumur Hidup', titleEn: 'Lifelong Love of Learning', descId: 'Anak tidak sekadar menghafal — mereka jatuh cinta pada proses belajar itu sendiri.', descEn: 'Children don\'t just memorize — they fall in love with the process of learning itself.' },
  { icon: Hand, titleId: 'Keterampilan Hidup Nyata', titleEn: 'Real-Life Skills', descId: 'Practical Life melatih motorik, konsentrasi, dan kemampuan merawat diri, orang lain, dan lingkungan.', descEn: 'Practical Life builds motor skills, concentration, and the ability to care for self, others, and the environment.' },
];

const ceoParagraphsEn = [
  'Greetings!',
  'I am delighted to welcome you to our school, located in the heart of BSD city. Our school began its journey as Kiddy Montessori Preschool in 2001, and was founded on the principles envisioned by Dr. Maria Montessori, a pioneer in children\'s education. I started Palm Trees Montessori School decades ago because I believe in fostering independence within every child, and helping them reach their full potential.',
  'As a mother of three myself, I have always been outspoken about the importance of education and schooling in a child\'s development. I found that the Montessori method was unique in that it allows each child to take charge of their own learning, rather than simply do what they\'re told.',
  'Today, our school has developed into a preschool and elementary school, with a vibrant and thriving community of families. After their individualized learning journeys at Palm Trees, our students go on to thrive at some of the nation\'s top secondary schools as lifelong Montessori learners.',
  'I hope to see more families join us in the future, and I am so excited for what\'s to come!',
];

const ceoParagraphsId = [
  'Salam hangat!',
  'Dengan senang hati saya menyambut Ayah Bunda di sekolah kami yang berlokasi di jantung kota BSD. Sekolah kami memulai perjalanannya sebagai Kiddy Montessori Preschool pada tahun 2001, dan didirikan berdasarkan prinsip-prinsip yang digagas oleh Dr. Maria Montessori, pelopor pendidikan anak. Saya memulai Palm Trees Montessori School puluhan tahun lalu karena saya percaya pada pentingnya menumbuhkan kemandirian dalam diri setiap anak, serta membantu mereka mencapai potensi penuhnya.',
  'Sebagai seorang ibu dari tiga anak, saya selalu vokal tentang pentingnya pendidikan dan sekolah dalam tumbuh kembang anak. Saya menemukan bahwa metode Montessori unik karena memungkinkan setiap anak memegang kendali atas pembelajarannya sendiri, bukan sekadar melakukan apa yang diperintahkan.',
  'Kini, sekolah kami telah berkembang menjadi preschool dan sekolah dasar (elementary), dengan komunitas keluarga yang hidup dan terus bertumbuh. Setelah perjalanan belajar yang dipersonalisasi di Palm Trees, para siswa kami melanjutkan dan berkembang di sekolah-sekolah menengah terbaik di negeri ini sebagai pembelajar Montessori seumur hidup.',
  'Saya berharap semakin banyak keluarga bergabung bersama kami di masa depan, dan saya sangat bersemangat menyambut hal-hal baik yang akan datang!',
];

export default function MontessoriMethod() {
  const { t, lang } = useLanguage();
  const ceoParagraphs = lang === 'id' ? ceoParagraphsId : ceoParagraphsEn;

  return (
    <SiteLayout
      titleId="Metode Montessori untuk Character Building Anak | Palmtrees Montessori BSD"
      titleEn="The Montessori Method for Character Building | Palmtrees Montessori BSD"
      descId="Kenali metode Montessori di Palm Trees Montessori BSD — filosofi, pesan dari CEO, dan keunggulan Montessori untuk membentuk karakter anak."
      descEn="Discover the Montessori method at Palm Trees Montessori BSD — its philosophy, a message from our CEO, and the advantages of Montessori for character building."
    >
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-8 bg-gradient-to-b from-[#F5F0E6] to-white text-center overflow-hidden">
        <FloatingLeaf className="w-20 h-20 top-10 left-[8%] opacity-30" />
        <FloatingLeaf className="w-14 h-14 bottom-10 right-[10%] opacity-25" delay={2} color="#8B5E3C" />
        <SectionReveal>
          <span className="inline-block bg-[#7A9A01]/15 text-[#7A9A01] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            {t('Metode Montessori', 'The Montessori Method')}
          </span>
          <h1 className="font-quicksand font-bold text-4xl sm:text-6xl text-[#8B5E3C] mb-5 max-w-4xl mx-auto leading-tight">
            {t(
              'Metode Montessori – Tepat untuk Character Building Anak',
              'The Montessori Method – The Right Path for Your Child\'s Character Building'
            )}
          </h1>
          <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
            {t(
              'Lebih dari sekadar kurikulum — Montessori adalah cara memandang anak sebagai pembangun masa depannya sendiri.',
              'More than a curriculum — Montessori is a way of seeing the child as the builder of their own future.'
            )}
          </p>
        </SectionReveal>
      </section>

      {/* Philosophy + Quote */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {t('Filosofi Montessori', 'The Montessori Philosophy')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-3xl mx-auto text-lg leading-relaxed">
              {t(
                'Dr. Maria Montessori percaya bahwa anak-anak belajar paling baik ketika mereka diberi kebebasan dalam batas yang jelas, di lingkungan yang dipersiapkan dengan penuh kasih. Guru bukan pusat kelas — anaklah pusatnya. Tugas kami adalah mengamati, menemani, dan membuka jalan bagi keajaiban belajar setiap anak.',
                'Dr. Maria Montessori believed that children learn best when given freedom within clear limits, in a lovingly prepared environment. The teacher is not the center of the classroom — the child is. Our task is to observe, accompany, and open the way for each child\'s wonder of learning.'
              )}
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

      {/* Message from the CEO */}
      <section className="py-20 px-4 sm:px-8 bg-[#F5F0E6] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <span className="inline-block bg-[#8B5E3C]/10 text-[#8B5E3C] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Pesan dari CEO', 'Message from the CEO')}
            </span>
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C]">
              {t('Sepatah Kata dari Pendiri Kami', 'A Word from Our Founder')}
            </h2>
          </SectionReveal>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <SectionReveal className="lg:col-span-2">
              <div className="relative max-w-sm mx-auto">
                <div className="absolute -inset-3 rounded-3xl bg-[#7A9A01]/15 rotate-2" />
                <img
                  src={images.ceo}
                  alt="Jaspreet Kaur — CEO Palm Trees Montessori School"
                  loading="lazy"
                  className="relative w-full rounded-3xl shadow-2xl object-cover border-4 border-white"
                />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-6 py-3 shadow-xl text-center whitespace-nowrap">
                  <div className="font-quicksand font-bold text-[#8B5E3C]">Jaspreet Kaur</div>
                  <div className="text-xs font-bold text-[#7A9A01] uppercase tracking-wider">CEO</div>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={100} className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#8B5E3C]/10 space-y-4 text-[#8B5E3C]/90 leading-relaxed">
                {ceoParagraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? 'font-quicksand font-bold text-xl text-[#8B5E3C]' : ''}>{p}</p>
                ))}
                <div className="pt-2">
                  <p className="italic text-[#8B5E3C]">{t('Salam hangat,', 'Warmest regards,')}</p>
                  <p className="font-quicksand font-bold text-lg text-[#8B5E3C] mt-1">Jaspreet Kaur</p>
                  <p className="text-sm font-bold text-[#7A9A01] uppercase tracking-wider">CEO</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-[#7A9A01]" />
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {t('Keunggulan Metode Montessori', 'Advantages of the Montessori Method')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
              {t(
                'Enam alasan mengapa Montessori menjadi fondasi terbaik bagi tumbuh kembang dan karakter Ananda.',
                'Six reasons why Montessori is the best foundation for your child\'s growth and character.'
              )}
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

      {/* CTA */}
      <Parallax image={images.schoolBuilding} speed={0.3} height="min-h-[420px]" overlayClass="bg-gradient-to-r from-[#3a2e22]/80 to-[#7A9A01]/60">
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
