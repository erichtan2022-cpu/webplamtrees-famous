import { useState } from 'react';
import { Download, ChevronDown, Check, Sparkles, Phone, Mail, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { SectionReveal } from '@/components/site/SectionReveal';
import { FloatingLeaf } from '@/components/site/Decorations';
import { contactInfo } from '@/data/siteContent';


const steps = [
  { id: 'Hubungi Kami', en: 'Reach Out', descId: 'Isi formulir atau WhatsApp untuk memperkenalkan keluarga.', descEn: 'Fill the form or WhatsApp us to introduce your family.' },
  { id: 'Tour Sekolah', en: 'School Tour', descId: 'Datang ke kampus, mengobrol, dan melihat anak-anak belajar.', descEn: 'Visit our campus, chat with us, and see the children at work.' },
  { id: 'Trial Class', en: 'Trial Class', descId: 'Ananda mencoba ritme kelas selama 1-2 sesi singkat.', descEn: 'Your child experiences our class rhythm for 1-2 short sessions.' },
  { id: 'Pertemuan Orang Tua', en: 'Parent Meeting', descId: 'Berbagi cerita, harapan, dan menyusun rencana awal bersama.', descEn: 'Share stories, hopes, and shape an initial plan together.' },
  { id: 'Pendaftaran Resmi', en: 'Official Enrollment', descId: 'Selamat datang di keluarga Palmtrees Montessori!', descEn: 'Welcome to the Palmtrees Montessori family!' },
];

const faqs = [
  { qId: 'Berapa rasio guru dan anak?', qEn: 'What is the teacher-to-child ratio?', aId: 'Rata-rata 1:6 di setiap kelas, dengan dukungan tambahan untuk Inclusive Support Program.', aEn: 'On average 1:6 in each class, with extra support for the Inclusive Support Program.' },
  { qId: 'Apa saja yang termasuk biaya?', qEn: 'What is included in the fees?', aId: 'SPP, materials Montessori, dan snack sehat. Biaya seragam dan field trip terpisah.', aEn: 'Tuition, Montessori materials, and healthy snack. Uniform and field trips are separate.' },
  { qId: 'Apakah ada bahasa Inggris?', qEn: 'Is English used in class?', aId: 'Ya, kami bilingual ID/EN dengan guru native dan lokal yang bersertifikasi.', aEn: 'Yes, we are bilingual ID/EN with certified native and local guides.' },
  { qId: 'Kapan tahun ajaran dimulai?', qEn: 'When does the school year start?', aId: 'Tahun ajaran utama mulai Juli, tapi rolling admission tersedia setiap saat.', aEn: 'The main school year starts in July, but rolling admissions are open year-round.' },
  { qId: 'Bagaimana dengan anak yang membutuhkan dukungan khusus?', qEn: 'What about children who need extra support?', aId: 'Kami mengevaluasi bersama dan menyusun pendampingan yang tepat — tanpa terburu-buru.', aEn: 'We assess together and design the right support — without rushing.' },
];

export default function Admission() {
  const { t, lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ parent: '', email: '', phone: '', child: '', age: '', date: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parent || !form.email) return;
    setSubmitting(true);
    try {
      await fetch('https://famous.ai/api/crm/6a05f5ed7fae75f422be90c0/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.parent,
          source: 'admission-tour',
          tags: ['admission', 'tour-booking', `age-${form.age || 'unknown'}`],
          metadata: { phone: form.phone, child: form.child, age: form.age, date: form.date, message: form.message },
        }),
      });
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <SiteLayout
      titleId="Pendaftaran & Tour Sekolah | Palmtrees Montessori BSD"
      titleEn="Admission & School Tour | Palmtrees Montessori BSD"
      descId="Daftar tour sekolah Palmtrees Montessori BSD. Proses pendaftaran sederhana, ramah, dan dipandu Ayah Bunda dari awal."
      descEn="Book a school tour at Palmtrees Montessori BSD. A simple, friendly admission process guided every step of the way."
    >
      <section className="relative py-16 px-4 sm:px-8 bg-gradient-to-b from-[#F5F0E6] to-white text-center overflow-hidden">
        <FloatingLeaf className="w-20 h-20 top-10 left-[10%] opacity-30" />
        <FloatingLeaf className="w-14 h-14 bottom-10 right-[12%] opacity-25" delay={2} color="#8B5E3C" />
        <SectionReveal>
          <span className="inline-block bg-[#7A9A01]/15 text-[#7A9A01] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            {t('Pendaftaran', 'Admission')}
          </span>
          <h1 className="font-quicksand font-bold text-4xl sm:text-6xl text-[#8B5E3C] mb-4">
            {t('Mari Mulai Perjalanan', 'Let\'s Begin the Journey')}
          </h1>
          <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
            {t(
              'Lima langkah sederhana untuk menjadi bagian dari keluarga Palmtrees.',
              'Five simple steps to become part of the Palmtrees family.'
            )}
          </p>
        </SectionReveal>
      </section>

      {/* Steps path */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <svg className="hidden md:block absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
              <path d="M 80 60 Q 250 0, 400 100 T 720 60 Q 800 200, 600 300 T 80 340" stroke="#7A9A01" strokeWidth="3" strokeDasharray="8 8" fill="none" opacity="0.5" />
            </svg>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {steps.map((s, i) => (
                <SectionReveal key={i} delay={i * 80}>
                  <div className="bg-[#F5F0E6] rounded-3xl p-5 text-center hover-lift h-full border border-[#8B5E3C]/10">
                    <div className="relative w-14 h-14 mx-auto mb-3 rounded-full bg-[#7A9A01] text-white flex items-center justify-center font-quicksand font-bold text-xl shadow-lg">
                      {i + 1}
                      <span className="absolute -top-1 -right-1">
                        <Sparkles className="w-4 h-4 text-[#F5B700]" />
                      </span>
                    </div>
                    <h3 className="font-quicksand font-bold text-base text-[#8B5E3C] mb-1">
                      {lang === 'id' ? s.id : s.en}
                    </h3>
                    <p className="text-xs text-[#8B5E3C]/80 leading-relaxed">
                      {lang === 'id' ? s.descId : s.descEn}
                    </p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tuition + Form */}
      <section className="py-16 px-4 sm:px-8 bg-[#F5F0E6]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <SectionReveal>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#8B5E3C]/10 h-full">
              <h2 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-3">
                {t('Informasi Biaya Sekolah', 'Tuition Information')}
              </h2>
              <p className="text-[#8B5E3C]/80 mb-6 leading-relaxed">
                {t(
                  'Unduh brosur lengkap kami untuk melihat rincian biaya, jadwal, dan paket tahun ajaran 2025/2026.',
                  'Download our complete brochure for detailed fees, schedules, and 2025/2026 school year packages.'
                )}
              </p>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert(t('Brosur akan dikirim ke email Ayah Bunda setelah pengisian formulir.', 'The brochure will be emailed after you fill in the form.')); }}
                className="btn-bounce inline-flex items-center gap-2 bg-[#7A9A01] hover:bg-[#8B5E3C] text-white font-bold px-6 py-3 rounded-full shadow-lg"
              >
                <Download className="w-5 h-5" />
                {t('Unduh Brosur (PDF)', 'Download Brochure (PDF)')}
              </a>

              <div className="mt-8 pt-6 border-t border-[#8B5E3C]/10 space-y-3 text-sm text-[#8B5E3C]/85">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#7A9A01]" /> {t('Telp.', 'Phone')} {contactInfo.phoneDisplay} · WA: {contactInfo.waDisplay}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#7A9A01]" /> {contactInfo.email}</p>

                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#7A9A01]" /> {t('Senin–Jumat, 08:00–16:00', 'Mon–Fri, 8am–4pm')}</p>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#8B5E3C]/10 relative overflow-hidden">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#7A9A01] flex items-center justify-center mb-5" style={{ animation: 'pulse-soft 1.6s ease-in-out infinite' }}>
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-2">
                    {t('Terima kasih, Ayah Bunda!', 'Thank you!')}
                  </h3>
                  <p className="text-[#8B5E3C]/80 max-w-sm mx-auto">
                    {t('Tim admission kami akan menghubungi dalam 1×24 jam untuk konfirmasi jadwal tour.', 'Our admission team will contact you within 24 hours to confirm your tour.')}
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ parent: '', email: '', phone: '', child: '', age: '', date: '', message: '' }); }} className="mt-6 text-sm font-semibold text-[#7A9A01] hover:underline">
                    {t('Kirim formulir lain', 'Submit another form')}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-2">
                    {t('Daftar Tour & Tanyakan', 'Book a Tour & Inquire')}
                  </h2>
                  <p className="text-sm text-[#8B5E3C]/75 mb-5">
                    {t('Isi data di bawah, kami akan hubungi balik Ayah Bunda.', 'Fill in the details — we will get back to you.')}
                  </p>
                  <form onSubmit={submit} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input required value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} placeholder={t('Nama Ayah/Bunda', 'Parent name')} className="px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('Email', 'Email')} className="px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t('WhatsApp', 'WhatsApp')} className="px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                      <input value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} placeholder={t('Nama Ananda', 'Child\'s name')} className="px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <select value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm">
                        <option value="">{t('Usia Ananda', 'Child\'s age')}</option>
                        <option value="preschool-kindergarten">{t('2 - 6 tahun (Preschool & Kindergarten)', '2 - 6 years (Preschool & Kindergarten)')}</option>
                        <option value="elementary">{t('6 - 12 tahun (Elementary)', '6 - 12 years (Elementary)')}</option>

                      </select>
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    </div>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder={t('Cerita singkat tentang Ananda (opsional)', 'Tell us briefly about your child (optional)')} className="w-full px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    <button type="submit" disabled={submitting} className="btn-bounce w-full bg-[#8B5E3C] hover:bg-[#7A9A01] text-white font-bold py-3.5 rounded-full shadow-lg disabled:opacity-60">
                      {submitting ? t('Mengirim...', 'Sending...') : t('Kirim & Jadwalkan Tour', 'Submit & Schedule Tour')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionReveal className="text-center mb-10">
            <h2 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] mb-3">
              {t('Pertanyaan yang Sering Ditanyakan', 'Frequently Asked Questions')}
            </h2>
          </SectionReveal>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <SectionReveal key={i} delay={i * 60}>
                <div className={`rounded-2xl border-2 transition-all ${openFaq === i ? 'border-[#7A9A01] bg-[#F5F0E6]/60' : 'border-[#8B5E3C]/15 bg-white'}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                  >
                    <span className="font-quicksand font-bold text-[#8B5E3C]">
                      {lang === 'id' ? f.qId : f.qEn}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[#7A9A01] flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-5 pb-4 text-[#8B5E3C]/85 leading-relaxed">
                      {lang === 'id' ? f.aId : f.aEn}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
