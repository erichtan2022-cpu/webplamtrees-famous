import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader as Loader2, CircleAlert as AlertCircle, Image, Globe, Search } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { BlogPost, BLOG_CATEGORIES, slugify } from '@/lib/blog';

type FormData = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;

const EMPTY: FormData = {
  slug: '',
  title_id: '',
  title_en: '',
  excerpt_id: '',
  excerpt_en: '',
  body_id: '',
  body_en: '',
  category: BLOG_CATEGORIES[0],
  featured_image: '',
  author: '',
  published_at: new Date().toISOString().slice(0, 16),
  is_published: false,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
};

type Tab = 'id' | 'en' | 'seo';

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>('id');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [slugManual, setSlugManual] = useState(false);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isNew) return;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) {
          showToast('error', error?.message ?? 'Artikel tidak ditemukan');
          return;
        }
        const post = data as BlogPost;
        setForm({
          slug: post.slug,
          title_id: post.title_id,
          title_en: post.title_en,
          excerpt_id: post.excerpt_id,
          excerpt_en: post.excerpt_en,
          body_id: post.body_id,
          body_en: post.body_en,
          category: post.category,
          featured_image: post.featured_image ?? '',
          author: post.author ?? '',
          published_at: post.published_at ? post.published_at.slice(0, 16) : EMPTY.published_at,
          is_published: post.is_published,
          meta_title: post.meta_title ?? '',
          meta_description: post.meta_description ?? '',
          meta_keywords: post.meta_keywords ?? '',
        });
        setSlugManual(true);
      });
  }, [id, isNew]);

  const set = useCallback((key: keyof FormData, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title_id' && !slugManual) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }, [slugManual]);

  const handleSlugChange = (val: string) => {
    setSlugManual(true);
    setForm((prev) => ({ ...prev, slug: slugify(val) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_id.trim() || !form.slug.trim()) {
      showToast('error', 'Judul (ID) dan slug wajib diisi');
      return;
    }
    if (form.meta_description.length > 160) {
      showToast('error', 'Meta Description melebihi 160 karakter');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      published_at: new Date(form.published_at).toISOString(),
      updated_at: new Date().toISOString(),
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('blog_posts').insert(payload));
    } else {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', id!));
    }
    setSaving(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    showToast('success', isNew ? 'Artikel berhasil dibuat' : 'Artikel berhasil disimpan');
    setTimeout(() => navigate('/admin/blog'), 800);
  };

  const metaDescLen = form.meta_description.length;

  if (loading) {
    return (
      <AdminLayout title="Memuat..." breadcrumb="Artikel Blog">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7A9A01] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? 'Artikel Baru' : 'Edit Artikel'}
      breadcrumb="Artikel Blog"
    >
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-[#7A9A01] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
        {/* Header actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set('is_published', !form.is_published)}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.is_published ? 'bg-[#7A9A01]' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_published ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {form.is_published ? 'Publik' : 'Draft'}
              </span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan
            </button>
          </div>
        </div>

        {/* Slug + meta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Slug URL</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 shrink-0">/blog/</span>
                <input
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm font-mono"
                  placeholder="judul-artikel-anda"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm bg-white"
              >
                {BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Penulis</label>
              <input
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm"
                placeholder="Nama penulis"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Terbit</label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => set('published_at', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5" />
              URL Gambar Utama
            </label>
            <input
              value={form.featured_image}
              onChange={(e) => set('featured_image', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm font-mono"
              placeholder="https://images.pexels.com/..."
            />
            {form.featured_image && (
              <img src={form.featured_image} alt="" className="mt-2 h-24 w-auto rounded-lg object-cover border border-slate-200" />
            )}
          </div>
        </div>

        {/* Language tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            {(['id', 'en', 'seo'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
                  tab === t
                    ? 'border-b-2 border-[#7A9A01] text-[#4a5e00] -mb-px'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'seo' ? (
                  <><Search className="w-3.5 h-3.5" />SEO</>
                ) : (
                  <><Globe className="w-3.5 h-3.5" />{t === 'id' ? 'Bahasa Indonesia' : 'English'}</>
                )}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">
            {(tab === 'id' || tab === 'en') && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Judul {tab === 'id' ? '(Indonesia)' : '(English)'}
                  </label>
                  <input
                    value={tab === 'id' ? form.title_id : form.title_en}
                    onChange={(e) => set(tab === 'id' ? 'title_id' : 'title_en', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm"
                    placeholder={tab === 'id' ? 'Judul artikel dalam bahasa Indonesia' : 'Article title in English'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Ringkasan / Excerpt {tab === 'id' ? '(Indonesia)' : '(English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={tab === 'id' ? form.excerpt_id : form.excerpt_en}
                    onChange={(e) => set(tab === 'id' ? 'excerpt_id' : 'excerpt_en', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm resize-y"
                    placeholder={tab === 'id' ? 'Ringkasan singkat artikel...' : 'Short article summary...'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Isi Artikel {tab === 'id' ? '(Indonesia)' : '(English)'}
                    <span className="ml-2 font-normal text-slate-400 normal-case">— Markdown didukung</span>
                  </label>
                  <textarea
                    rows={16}
                    value={tab === 'id' ? form.body_id : form.body_en}
                    onChange={(e) => set(tab === 'id' ? 'body_id' : 'body_en', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm font-mono resize-y"
                    placeholder={tab === 'id' ? '## Judul Bagian\n\nTulis isi artikel di sini...' : '## Section Heading\n\nWrite article body here...'}
                  />
                </div>
              </>
            )}

            {tab === 'seo' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Meta Title
                  </label>
                  <input
                    value={form.meta_title}
                    onChange={(e) => set('meta_title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm"
                    placeholder="Judul untuk hasil pencarian Google"
                  />
                  <p className="text-xs text-slate-400 mt-1">Idealnya 50–60 karakter. Contoh: "Tips Parenting Montessori | Palmtrees BSD"</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Meta Description
                    </label>
                    <span className={`text-xs font-semibold ${
                      metaDescLen > 160 ? 'text-red-600' : metaDescLen > 130 ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {metaDescLen}/160
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={form.meta_description}
                    onChange={(e) => set('meta_description', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm resize-none ${
                      metaDescLen > 160
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                        : 'border-slate-200 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01]'
                    }`}
                    placeholder="Deskripsi singkat artikel untuk ditampilkan di hasil pencarian Google (maks 160 karakter)"
                  />
                  {metaDescLen > 160 && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Terlalu panjang — akan terpotong di Google
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Meta Keywords
                  </label>
                  <input
                    value={form.meta_keywords}
                    onChange={(e) => set('meta_keywords', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm"
                    placeholder="montessori BSD, parenting, inklusi, anak"
                  />
                  <p className="text-xs text-slate-400 mt-1">Pisahkan dengan koma. Contoh: montessori BSD, sekolah inklusi, tips parenting</p>
                </div>

                <div className="bg-[#7A9A01]/10 border border-[#7A9A01]/20 rounded-xl p-4 text-sm text-[#4a5e00]/80 space-y-1">
                  <p className="font-semibold text-[#4a5e00]">Pratinjau SERP Google</p>
                  <p className="font-medium text-[#1a0dab] text-base leading-tight">
                    {form.meta_title || form.title_id || '(Meta Title belum diisi)'}
                  </p>
                  <p className="text-xs text-[#006621]">palmtreesmontessori.com/{'{lang}'}/blog/{form.slug || '(slug)'}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {form.meta_description
                      ? form.meta_description.slice(0, 160)
                      : '(Meta Description belum diisi — Google akan memilih cuplikan sendiri)'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
