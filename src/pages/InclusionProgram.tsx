import { Link } from 'react-router-dom';
import { Heart, Users, Stethoscope, GraduationCap, Sparkles, ShieldCheck, MessagesSquare, Calendar, ArrowRight, MapPin, Check } from 'lucide-react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { Parallax } from '@/components/site/Parallax';
import { SectionReveal } from '@/components/site/SectionReveal';
import { FloatingLeaf } from '@/components/site/Decorations';
import { images, contactInfo } from '@/data/siteContent';
import { usePageContent } from '@/hooks/usePageContent';
import { useSiteImages, useSiteCards, useSiteSettings } from '@/hooks/useSiteContent';

const defaultPillars = [
  { icon: Users, titleId: 'Shadow Teacher Terlatih', titleEn: 'Trained Shadow Teachers', descId: 'Pendamping personal yang bekerja sama dengan guru Montessori untuk mendukung Ananda setiap hari di kelas.', descEn: 'Personal companions who work alongside Montessori guides to support your child every day in class.' },
  { icon: Stethoscope, titleId: 'Kolaborasi Terapis', titleEn: 'Therapist Collaboration', descId: 'Kami berkoordinasi dengan terapis okupasi, wicara, dan psikolog pilihan keluarga untuk pendampingan yang selaras.', descEn: 'We coordinate with your family\'s occupational, speech, and psychology professionals for aligned support.' },
  { icon: GraduationCap, titleId: 'Rencana Belajar Individual', titleEn: 'Individual Learning Plans', descId: 'Tujuan belajar yang fleksibel, disusun dan dievaluasi bersama orang tua secara rutin — tanpa terburu-buru.', descEn: 'Flexible learning goals, designed and reviewed together with parents regularly — never rushed.' },
  { icon: MessagesSquare, titleId: 'Komunikasi Terbuka', titleEn: 'Open Communication', descId: 'Guru menyambut dialog dengan Ayah Bunda dan berbagi perkembangan Ananda secara berkala.', descEn: 'Our guides welcome dialogue with parents and share your child\'s progress regularly.' },
];

const pillarIcons = [Users, Stethoscope, GraduationCap, MessagesSquare];

const defaultReasons = [
  { id: 'Lingkungan Montessori yang tenang dan terstruktur — ideal untuk setiap gaya belajar', en: 'A calm, structured Montessori environment — ideal for every learning style' },
  { id: 'Rasio guru dan anak yang kecil untuk perhatian penuh', en: 'Small teacher-to-child ratios for full attention' },
  { id: 'Anak belajar berdampingan — inklusi yang tulus, bukan kelas terpisah', en: 'Children learn side by side — genuine inclusion, not separate classes' },
  { id: 'Guru berpengalaman & tim inklusi yang terlatih', en: 'Experienced guides & a trained inclusion team' },
  { id: 'Lokasi strategis di BSD, mudah dijangkau dari seluruh Tangerang', en: 'A strategic BSD location, easy to reach from all across Tangerang' },
  { id: 'Berafiliasi dengan NAMC dan anggota International Montessori Council (IMC)', en: 'Affiliated with NAMC and a member of the International Montessori Council (IMC)' },
];

export default function InclusionProgram() {
  const { t, lang } = useLanguage();
  const { getContent } = usePageContent('inclusion');
  const { getImages } = useSiteImages();
  const { cards: pillarCards } = useSiteCards('pillar');
  const { cards: reasonCards } = useSiteCards('reason');
  const { getSetting } = useSiteSettings();

  const inclusiveHeroImg = getImages('programs', 'inclusive_hero')[0] || images.inclusiveHero;
  const inclusiveImg = getImages('programs', 'inclusive')[0] || images.programs.inclusive;

  const waNumber = getSetting('wa_number') || contactInfo.waNumber;

  const pillars = pillarCards.length > 0
    ? pillarCards.map((c, i) => ({
        icon: pillarIcons[i % pillarIcons.length],
        titleId: c.title_id,
        titleEn: c.title_en,
        descId: c.desc_id,
        descEn: c.desc_en,
      }))
    : defaultPillars;

  const reasons = reasonCards.length > 0
    ? reasonCards.map((c) => ({ id: c.title_id, en: c.title_en }))
    : defaultReasons;

  return (
    <SiteLayout
      titleId="Sekolah Inklusi BSD & Tangerang | Program Inklusi Palm Trees Montessori"
      titleEn="Inclusive School in BSD & Tangerang | Palm Trees Montessori Inclusion Program"
      descId="Palm Trees Montessori adalah sekolah inklusi di BSD, Tangerang Selatan. Sekolah Montessori terbaik dengan program inklusi di Tangerang: shadow teacher, kolaborasi terapis, dan lingkungan yang mendukung setiap gaya belajar."
      descEn="Palm Trees Montessori is an inclusive school in BSD, South Tangerang. The best Montessori school with an inclusion program in Tangerang: shadow teachers, therapist collaboration, and an environment that supports every learning style."
    >
      <Parallax image={inclusiveHeroImg} speed={0.35} height="min-h-[480px]" overlayClass="bg-gradient-to-b from-[#3a2e22]/70 to-[#7A9A01]/60">
        <div className="h-full min-h-[480px] flex items-center justify-center px-4 text-center">
          <SectionReveal className="text-white max-w-3xl">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Sekolah Inklusi BSD · Tangerang', 'Inclusive School BSD · Tangerang')}
            </span>
            <h1 className="font-quicksand font-bold text-4xl sm:text-6xl mb-4 drop-shadow-lg leading-tight">
              {lang === 'id' ? getContent('hero_h1_id', 'Program Inklusi – Montessori untuk Setiap Anak') : getContent('hero_h1_en', 'Inclusion Program – Montessori for Every Child')}
            </h1>
            <p className="text-lg sm:text-xl text-white/95">
              {lang === 'id' ? getContent('hero_subtitle_id', 'Sekolah Montessori terbaik dengan program inklusi di Tangerang — tempat setiap gaya belajar didukung dengan hati.') : getContent('hero_subtitle_en', 'The best Montessori school with an inclusion program in Tangerang — where every learning style is supported with heart.')}
            </p>
          </SectionReveal>
        </div>
      </Parallax>

      <section className="relative py-20 px-4 sm:px-8 bg-[#F5F0E6] overflow-hidden">
        <FloatingLeaf className="w-16 h-16 top-10 right-[6%] opacity-30" delay={1} />
        <FloatingLeaf className="w-12 h-12 bottom-16 left-[8%] opacity-25" delay={3} color="#8B5E3C" />
        <div className="max-w-4xl mx-auto">
          <SectionReveal className="text-center mb-10">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-6 leading-tight">
              {lang === 'id' ? getContent('seo_intro_title_id', 'Sekolah Inklusi di BSD, Tangerang Selatan') : getContent('seo_intro_title_en', 'An Inclusive School in BSD, South Tangerang')}
            </h2>
          </SectionReveal>
          <SectionReveal delay={100}>
            <div className="space-y-5 text-lg text-[#8B5E3C]/90 leading-relaxed">
              <p>
                {t(
                  'Mencari sekolah inklusi di BSD atau sekolah inklusi di Tangerang yang benar-benar memahami anak? Di Palm Trees Montessori School, inklusi bukan sekadar program tambahan — inklusi adalah cara kami hidup bersama sebagai komunitas. Kami percaya setiap anak berhak belajar, bermain, dan bertumbuh berdampingan.',
                  'Looking for an inclusive school in BSD or an inclusive school in Tangerang that truly understands children? At Palm Trees Montessori School, inclusion is not just an add-on program — it is how we live together as a community. We believe every child deserves to learn, play, and grow side by side.'
                )}
              </p>
              <p>
                {t(
                  'Sebagai sekolah Montessori dengan program inklusi di Tangerang Selatan, kami memadukan lingkungan Montessori yang tenang dan terstruktur dengan pendampingan personal: shadow teacher terlatih, kolaborasi dengan terapis, dan rencana belajar individual. Kami tidak memberi label pada anak — kami mendukung setiap gaya belajar.',
                  'As a Montessori school with an inclusion program in South Tangerang, we combine a calm, structured Montessori environment with personal support: trained shadow teachers, therapist collaboration, and individual learning plans. We never label children — we support every learning style.'
                )}
              </p>
              <p>
                {t(
                  'Berlokasi strategis di kawasan BSD City, Serpong Utara, Palm Trees Montessori mudah dijangkau oleh keluarga dari Tangerang Selatan, Tangerang, hingga Jakarta Barat. Sejak tahun 2000, kami menemani ratusan keluarga menemukan potensi terbaik anak-anaknya.',
                  'Strategically located in the BSD City area, North Serpong, Palm Trees Montessori is easy to reach for families from South Tangerang, Tangerang, and West Jakarta. Since 2000, we have walked alongside hundreds of families in discovering their children\'s fullest potential.'
                )}
              </p>
              <p>
                {t(
                  'Sebagai sekolah berkebutuhan khusus di Tangerang yang terpercaya, kami adalah sekolah ABK terdekat bagi banyak keluarga di kawasan BSD dan sekitarnya. Kami secara khusus berpengalaman mendampingi anak dengan speech delay, keterlambatan perkembangan, dan berbagai gaya belajar yang beragam — dalam satu komunitas yang inklusif dan hangat.',
                  'As a trusted school for special needs children in Tangerang, we are the nearest inclusive school for many families in the BSD area. We have extensive experience supporting children with speech delay, developmental delays, and diverse learning styles — all within one inclusive and warm community.'
                )}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <Heart className="w-10 h-10 mx-auto mb-3 text-[#7A9A01]" />
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-4">
              {lang === 'id' ? getContent('pillars_title_id', 'Bagaimana Kami Mendukung Ananda') : getContent('pillars_title_en', 'How We Support Your Child')}
            </h2>
            <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
              {lang === 'id' ? getContent('pillars_subtitle_id', 'Pendekatan yang lembut, tenang, dan menenangkan — dirancang bersama keluarga.') : getContent('pillars_subtitle_en', 'A gentle, calm, and reassuring approach — designed together with families.')}
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <SectionReveal key={i} delay={i * 80}>
                  <div className="bg-[#F5F0E6] rounded-3xl p-7 h-full hover-lift border border-[#8B5E3C]/10 flex flex-col items-start gap-4 justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#8B5E3C] flex items-center justify-center shadow-md flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-quicksand font-bold text-xl text-[#8B5E3C] mb-2">
                        {lang === 'id' ? p.titleId : p.titleEn}
                      </h3>
                      <p className="text-[#8B5E3C]/85 leading-relaxed">
                        {lang === 'id' ? p.descId : p.descEn}
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-8 bg-[#F5F0E6]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <SectionReveal>
            <span className="inline-block bg-[#7A9A01]/15 text-[#7A9A01] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {t('Kenapa Palm Trees?', 'Why Palm Trees?')}
            </span>
            <h2 className="font-quicksand font-bold text-3xl sm:text-4xl text-[#8B5E3C] mb-6 leading-tight">
              {lang === 'id' ? getContent('reasons_title_id', 'Sekolah Montessori Terbaik dengan Program Inklusi di Tangerang') : getContent('reasons_title_en', 'The Best Montessori School with an Inclusion Program in Tangerang')}
            </h2>
            <ul className="space-y-3">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#7A9A01] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#8B5E3C] font-medium">{lang === 'id' ? r.id : r.en}</span>
                </li>
              ))}
            </ul>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-[#7A9A01]/15 -rotate-2" />
              <img
                src={inclusiveImg}
                alt={t('Program inklusi di sekolah Montessori BSD Tangerang', 'Inclusion program at a Montessori school in BSD Tangerang')}
                loading="lazy"
                className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7A9A01]" />
                <span className="font-quicksand font-bold text-[#8B5E3C] text-sm">BSD · Serpong Utara · Tangerang</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <SectionReveal>
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-[#7A9A01]" />
            <h2 className="font-quicksand font-bold text-2xl sm:text-4xl text-[#8B5E3C] mb-4">
              {lang === 'id' ? getContent('reassurance_title_id', 'Tanpa Label, Penuh Dukungan') : getContent('reassurance_title_en', 'No Labels, Full of Support')}
            </h2>
            <p className="text-lg text-[#8B5E3C]/85 leading-relaxed max-w-3xl mx-auto">
              {lang === 'id' ? getContent('reassurance_desc_id', 'Kami tidak melihat anak dari labelnya. Kami melihat anak seutuhnya — kekuatannya, minatnya, dan caranya belajar. Bersama Ayah Bunda, kami menyusun langkah kecil yang bermakna, dengan tempo yang nyaman bagi Ananda.') : getContent('reassurance_desc_en', 'We do not see a child by their label. We see the whole child — their strengths, their interests, and the way they learn. Together with parents, we design small, meaningful steps at a pace that feels comfortable for your child.')}
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8 bg-[#F5F0E6]">
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#8B5E3C]/10">
              <Sparkles className="w-10 h-10 mx-auto mb-4 text-[#7A9A01]" />
              <h2 className="font-quicksand font-bold text-2xl sm:text-4xl text-[#8B5E3C] mb-3">
                {t('Mari Berkenalan dengan Tim Inklusi Kami', 'Come Meet Our Inclusion Team')}
              </h2>
              <p className="text-[#8B5E3C]/80 mb-7 max-w-xl mx-auto">
                {t(
                  'Ceritakan tentang Ananda — kami akan mendengarkan dengan hati dan mencarikan jalan terbaik bersama.',
                  'Tell us about your child — we will listen with heart and find the best path together.'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={getRoute('admission', lang)}
                  className="btn-bounce inline-flex items-center justify-center gap-2 bg-[#7A9A01] hover:bg-[#8B5E3C] text-white font-bold px-7 py-3.5 rounded-full shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  {t('Jadwalkan Kunjungan', 'Schedule a Visit')}
                </Link>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    t(
                      'Halo Palmtrees, saya ingin bertanya tentang Program Inklusi.',
                      'Hello Palmtrees, I would like to ask about the Inclusion Program.'
                    )
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#F5F0E6] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white border-2 border-[#8B5E3C]/30 font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105"
                >
                  {t('Chat via WhatsApp', 'Chat on WhatsApp')}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </SiteLayout>
  );
}
