import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Check, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { SectionReveal } from '@/components/site/SectionReveal';
import { contactInfo } from '@/data/siteContent';

const hours = [
  { id: 'Senin – Jumat', en: 'Monday – Friday', time: '08:00 – 16:00' },
  { id: 'Sabtu', en: 'Saturday', time: '09:00 – 12:00' },
  { id: 'Minggu', en: 'Sunday', time: 'Closed' },
];

export default function Contact() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    try {
      await fetch('https://famous.ai/api/crm/6a05f5ed7fae75f422be90c0/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          source: 'contact-form',
          tags: ['contact', 'general-inquiry'],
          metadata: { subject: form.subject, message: form.message },
        }),
      });
    } catch {}
    setSent(true);
  };

  const socials = [
    { Icon: Instagram, href: contactInfo.instagram, label: 'Instagram' },
    { Icon: Facebook, href: contactInfo.facebook, label: 'Facebook' },
    { Icon: Youtube, href: contactInfo.youtube, label: 'YouTube' },
  ];

  return (
    <SiteLayout
      titleId="Kontak | Palmtrees Montessori BSD Tangerang Selatan"
      titleEn="Contact | Palmtrees Montessori BSD South Tangerang"
      descId="Hubungi Palmtrees Montessori di BSD City, Tangerang Selatan. Alamat, peta, jam operasional, dan formulir kontak."
      descEn="Contact Palmtrees Montessori in BSD City, South Tangerang. Address, map, opening hours, and contact form."
    >
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-[#F5F0E6] to-white text-center">
        <SectionReveal>
          <h1 className="font-quicksand font-bold text-4xl sm:text-6xl text-[#8B5E3C] mb-4">
            {t('Sapa Kami', 'Say Hello')}
          </h1>
          <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
            {t(
              'Datang berkunjung, kirim pesan, atau sapa kami di WhatsApp. Pintu Palmtrees selalu terbuka.',
              'Drop by, send a message, or wave hi on WhatsApp. The Palmtrees door is always open.'
            )}
          </p>
        </SectionReveal>
      </section>

      <section className="py-12 px-4 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Map + info */}
          <SectionReveal>
            <div className="bg-[#F5F0E6] rounded-3xl overflow-hidden shadow-lg h-full">
              <div className="aspect-[4/3] w-full">
                <iframe
                  title="Palm Trees Montessori School Map"
                  src={contactInfo.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <div className="p-6 sm:p-7 space-y-4 text-[#8B5E3C]">
                <h3 className="font-quicksand font-bold text-2xl">Palm Trees Montessori School</h3>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#7A9A01] flex-shrink-0 mt-0.5" />
                  <span>{t(contactInfo.addressId, contactInfo.addressEn)}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="w-5 h-5 text-[#7A9A01]" />
                  <a href={`tel:${contactInfo.phoneTel}`} className="hover:text-[#7A9A01]">{t('Telp.', 'Phone')} {contactInfo.phoneDisplay}</a>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="w-5 h-5 text-[#7A9A01]" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-[#7A9A01]">{contactInfo.email}</a>
                </div>
                <div className="flex gap-3 items-center">
                  <MessageCircle className="w-5 h-5 text-[#7A9A01]" />
                  <a
                    href={`https://wa.me/${contactInfo.waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7A9A01]"
                  >WA: {contactInfo.waDisplay}</a>
                </div>

                <div className="flex gap-3 pt-2">
                  {socials.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center hover:bg-[#7A9A01] hover:scale-110 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Form */}
          <SectionReveal delay={100}>
            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#8B5E3C]/10 h-full">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#7A9A01] flex items-center justify-center mb-5" style={{ animation: 'pulse-soft 1.6s ease-in-out infinite' }}>
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-2">
                    {t('Pesan terkirim!', 'Message sent!')}
                  </h3>
                  <p className="text-[#8B5E3C]/80">
                    {t('Kami akan balas secepatnya, Ayah Bunda.', 'We will reply as soon as possible.')}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-2">
                    {t('Kirim Pesan', 'Send a Message')}
                  </h2>
                  <p className="text-sm text-[#8B5E3C]/75 mb-5">
                    {t('Kami biasa membalas dalam 1×24 jam kerja.', 'We usually reply within 1 business day.')}
                  </p>
                  <form onSubmit={submit} className="space-y-3">
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('Nama', 'Name')} className="w-full px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('Email', 'Email')} className="w-full px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t('Subjek', 'Subject')} className="w-full px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t('Tulis pesan...', 'Write your message...')} className="w-full px-4 py-3 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50 text-sm" />
                    <button type="submit" className="btn-bounce w-full bg-[#7A9A01] hover:bg-[#8B5E3C] text-white font-bold py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      {t('Kirim Pesan', 'Send Message')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Hours with cute clock illustration */}
      <section className="py-16 px-4 sm:px-8 bg-[#F5F0E6]">
        <div className="max-w-4xl mx-auto">
          <SectionReveal className="text-center mb-10">
            <h2 className="font-quicksand font-bold text-3xl sm:text-4xl text-[#8B5E3C] mb-3">
              {t('Jam Operasional', 'Opening Hours')}
            </h2>
          </SectionReveal>

          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              {/* Cute clock SVG */}
              <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-52 sm:h-52">
                <circle cx="100" cy="100" r="90" fill="#F5F0E6" stroke="#8B5E3C" strokeWidth="6" />
                <circle cx="100" cy="100" r="76" fill="#fff" stroke="#7A9A01" strokeWidth="3" strokeDasharray="4 8" />
                {[...Array(12)].map((_, i) => {
                  const a = (i * 30 - 90) * Math.PI / 180;
                  return <circle key={i} cx={100 + Math.cos(a) * 64} cy={100 + Math.sin(a) * 64} r="3" fill="#8B5E3C" />;
                })}
                {/* hands */}
                <g style={{ transformOrigin: '100px 100px', animation: 'spin-slow 60s linear infinite' }}>
                  <line x1="100" y1="100" x2="100" y2="50" stroke="#8B5E3C" strokeWidth="5" strokeLinecap="round" />
                </g>
                <g style={{ transformOrigin: '100px 100px', animation: 'spin-slow 720s linear infinite' }}>
                  <line x1="100" y1="100" x2="140" y2="100" stroke="#7A9A01" strokeWidth="6" strokeLinecap="round" />
                </g>
                <circle cx="100" cy="100" r="6" fill="#8B5E3C" />
                {/* eyes */}
                <circle cx="80" cy="80" r="5" fill="#8B5E3C" />
                <circle cx="120" cy="80" r="5" fill="#8B5E3C" />
                {/* smile */}
                <path d="M 80 130 Q 100 145 120 130" stroke="#8B5E3C" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <ul className="space-y-3">
              {hours.map((h, i) => (
                <li key={i} className="flex items-center justify-between gap-4 bg-[#F5F0E6] rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#7A9A01]" />
                    <span className="font-quicksand font-semibold text-[#8B5E3C]">
                      {lang === 'id' ? h.id : h.en}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${h.time === 'Closed' ? 'text-red-500' : 'text-[#7A9A01]'}`}>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
