import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, LayoutTemplate, Plus, TrendingUp, Eye, Clock, Image as ImageIcon, Users, Quote, BookOpen, Building2, CircleHelp as HelpCircle, ListChecks, Sparkles, HeartPulse, Mail, Settings, GraduationCap } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

interface Stats {
  total: number;
  published: number;
  drafts: number;
  images: number;
  cards: number;
  settings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, drafts: 0, images: 0, cards: 0, settings: 0 });

  useEffect(() => {
    (async () => {
      const [{ data: blogData }, { data: imgData }, { data: cardData }, { data: settingData }] = await Promise.all([
        supabase.from('blog_posts').select('is_published'),
        supabase.from('site_images').select('id'),
        supabase.from('site_cards').select('id'),
        supabase.from('site_settings').select('id'),
      ]);
      setStats({
        total: blogData?.length ?? 0,
        published: blogData?.filter((p) => p.is_published).length ?? 0,
        drafts: blogData?.filter((p) => !p.is_published).length ?? 0,
        images: imgData?.length ?? 0,
        cards: cardData?.length ?? 0,
        settings: settingData?.length ?? 0,
      });
    })();
  }, []);

  const statCards = [
    { label: 'Total Artikel', value: stats.total, icon: FileText, color: 'bg-blue-500' },
    { label: 'Dipublikasikan', value: stats.published, icon: Eye, color: 'bg-[#7A9A01]' },
    { label: 'Draft', value: stats.drafts, icon: Clock, color: 'bg-amber-500' },
    { label: 'Gambar', value: stats.images, icon: ImageIcon, color: 'bg-cyan-500' },
    { label: 'Kartu Konten', value: stats.cards, icon: LayoutTemplate, color: 'bg-rose-500' },
    { label: 'Pengaturan', value: stats.settings, icon: Settings, color: 'bg-violet-500' },
  ];

  const managementLinks = [
    { to: '/admin/blog/new', label: 'Tulis Artikel Baru', icon: Plus, desc: 'Buat artikel blog bilingual baru', primary: true },
    { to: '/admin/blog', label: 'Kelola Artikel', icon: FileText, desc: 'Edit, hapus, atau ubah status artikel' },
    { to: '/admin/pages/home', label: 'Edit Homepage', icon: LayoutTemplate, desc: 'Ubah teks & gambar halaman utama' },
    { to: '/admin/pages/about', label: 'Edit Tentang Kami', icon: LayoutTemplate, desc: 'Ubah teks & foto ruang kelas' },
    { to: '/admin/pages/programs', label: 'Edit Program', icon: BookOpen, desc: 'Ubah teks & gambar program sekolah' },
    { to: '/admin/pages/montessori', label: 'Edit Metode Montessori', icon: Sparkles, desc: 'Ubah teks filosofi & keunggulan' },
    { to: '/admin/pages/inclusion', label: 'Edit Program Inklusi', icon: HeartPulse, desc: 'Ubah teks pilar & alasan inklusi' },
    { to: '/admin/pages/admission', label: 'Edit Pendaftaran', icon: ListChecks, desc: 'Ubah teks pendaftaran & brosur' },
    { to: '/admin/pages/contact', label: 'Edit Kontak', icon: Settings, desc: 'Ubah teks halaman kontak' },
    { to: '/admin/teachers', label: 'Guru', icon: Users, desc: 'Kelola daftar guru dan bio' },
    { to: '/admin/testimonials', label: 'Testimoni', icon: Quote, desc: 'Kelola testimoni orang tua' },
    { to: '/admin/programs-cards', label: 'Kartu Program', icon: BookOpen, desc: 'Edit detail kartu program sekolah' },
    { to: '/admin/facilities', label: 'Fasilitas', icon: Building2, desc: 'Kelola foto dan deskripsi fasilitas' },
    { to: '/admin/faqs', label: 'FAQ', icon: HelpCircle, desc: 'Tambah atau edit pertanyaan FAQ' },
    { to: '/admin/steps', label: 'Langkah Pendaftaran', icon: ListChecks, desc: 'Edit 5 langkah proses pendaftaran' },
    { to: '/admin/advantages', label: 'Keunggulan Montessori', icon: Sparkles, desc: 'Edit kartu keunggulan metode Montessori' },
    { to: '/admin/pillars', label: 'Pilar Inklusi', icon: HeartPulse, desc: 'Edit pilar program inklusi' },
    { to: '/admin/reasons', label: 'Alasan Inklusi', icon: ListChecks, desc: 'Edit daftar alasan kenapa Palm Trees' },
    { to: '/admin/rhythm', label: 'Ritme Harian', icon: Clock, desc: 'Edit jadwal aktivitas harian kelas' },
    { to: '/admin/ceo-message', label: 'Pesan CEO', icon: Mail, desc: 'Edit paragraf pesan dari CEO' },
    { to: '/admin/settings', label: 'Kontak & Jam', icon: Settings, desc: 'Edit info kontak, sosial, jam operasional' },
  ];

  return (
    <AdminLayout title="Dashboard" breadcrumb="Panel Admin">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</span>
                <div className={`${s.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Management links */}
      <h2 className="text-sm font-bold text-slate-700 mb-3">Kelola Konten</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {managementLinks.map(({ to, label, icon: Icon, desc, primary }) => (
          <Link
            key={to}
            to={to}
            className={`group rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${
              primary
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${primary ? 'bg-[#7A9A01]' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <Icon className={`w-4 h-4 ${primary ? 'text-white' : 'text-slate-700'}`} />
            </div>
            <div className={`font-semibold text-sm mb-0.5 ${primary ? 'text-white' : 'text-slate-800'}`}>{label}</div>
            <div className={`text-xs ${primary ? 'text-slate-300' : 'text-slate-500'}`}>{desc}</div>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-[#7A9A01]/10 border border-[#7A9A01]/20 rounded-xl p-4">
        <h3 className="font-semibold text-[#4a5e00] mb-2 text-sm">Tips SEO & Konten</h3>
        <ul className="space-y-1.5 text-sm text-[#4a5e00]/80">
          <li>• Isi selalu <strong>Meta Title</strong> dan <strong>Meta Description</strong> saat membuat artikel baru.</li>
          <li>• Meta Description maksimal <strong>160 karakter</strong> — lebih akan terpotong di hasil pencarian Google.</li>
          <li>• Slug artikel digenerate otomatis dari judul — tidak perlu diubah kecuali ada kebutuhan khusus.</li>
          <li>• Teks H1 di halaman <strong>Homepage & Pendaftaran</strong> mengandung kata kunci emas — jangan hapus kata kunci utama.</li>
          <li>• Gunakan <strong>Kelola Gambar</strong> untuk mengganti foto kelas, guru, atau aktivitas tanpa perlu mengubah kode.</li>
          <li>• Perubahan di <strong>Edit Teks Halaman</strong> langsung tampil di website setelah disimpan.</li>
        </ul>
      </div>
    </AdminLayout>
  );
}
