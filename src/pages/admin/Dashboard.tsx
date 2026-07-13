import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, LayoutTemplate, Plus, TrendingUp, Eye, Clock } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

interface Stats {
  total: number;
  published: number;
  drafts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, drafts: 0 });

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('is_published')
      .then(({ data }) => {
        if (!data) return;
        setStats({
          total: data.length,
          published: data.filter((p) => p.is_published).length,
          drafts: data.filter((p) => !p.is_published).length,
        });
      });
  }, []);

  const statCards = [
    { label: 'Total Artikel', value: stats.total, icon: FileText, color: 'bg-blue-500' },
    { label: 'Dipublikasikan', value: stats.published, icon: Eye, color: 'bg-[#7A9A01]' },
    { label: 'Draft', value: stats.drafts, icon: Clock, color: 'bg-amber-500' },
    { label: 'Halaman SEO', value: 2, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const quickLinks = [
    { to: '/admin/blog/new', label: 'Tulis Artikel Baru', icon: Plus, desc: 'Buat artikel blog bilingual baru', primary: true },
    { to: '/admin/blog', label: 'Kelola Artikel', icon: FileText, desc: 'Edit, hapus, atau ubah status artikel', primary: false },
    { to: '/admin/pages', label: 'Edit Konten Halaman', icon: LayoutTemplate, desc: 'Perbarui teks Homepage & Pendaftaran', primary: false },
  ];

  return (
    <AdminLayout title="Dashboard" breadcrumb="Panel Admin">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <div className="text-3xl font-bold text-slate-900">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {quickLinks.map(({ to, label, icon: Icon, desc, primary }) => (
          <Link
            key={to}
            to={to}
            className={`group rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
              primary
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${primary ? 'bg-[#7A9A01]' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <Icon className={`w-5 h-5 ${primary ? 'text-white' : 'text-slate-700'}`} />
            </div>
            <div className={`font-semibold mb-1 ${primary ? 'text-white' : 'text-slate-800'}`}>{label}</div>
            <div className={`text-sm ${primary ? 'text-slate-300' : 'text-slate-500'}`}>{desc}</div>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-[#7A9A01]/10 border border-[#7A9A01]/20 rounded-xl p-4">
        <h3 className="font-semibold text-[#4a5e00] mb-2 text-sm">Tips SEO</h3>
        <ul className="space-y-1.5 text-sm text-[#4a5e00]/80">
          <li>• Isi selalu <strong>Meta Title</strong> dan <strong>Meta Description</strong> saat membuat artikel baru.</li>
          <li>• Meta Description maksimal <strong>160 karakter</strong> — lebih akan terpotong di hasil pencarian Google.</li>
          <li>• Slug artikel digenerate otomatis dari judul — tidak perlu diubah kecuali ada kebutuhan khusus.</li>
          <li>• Teks H1 di halaman <strong>Homepage & Pendaftaran</strong> mengandung kata kunci emas — jangan hapus kata kunci utama.</li>
        </ul>
      </div>
    </AdminLayout>
  );
}
