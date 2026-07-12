import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Plus, Edit3, Trash2, Save, X, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BlogPost, BLOG_CATEGORIES, callAdmin } from '@/lib/blog';

const emptyPost: Partial<BlogPost> = {
  slug: '',
  title_id: '',
  title_en: '',
  excerpt_id: '',
  excerpt_en: '',
  body_id: '',
  body_en: '',
  category: 'Tips Parenting',
  featured_image: '',
  author: 'Tim Palmtrees',
  is_published: true,
  published_at: new Date().toISOString(),
};

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // On mount: check stored password
  useEffect(() => {
    const stored = sessionStorage.getItem('palmtrees-admin-pwd');
    if (stored) {
      verifyPassword(stored, false);
    }
  }, []);

  const verifyPassword = async (pwd: string, manualSubmit = true) => {
    if (manualSubmit) setAuthLoading(true);
    setAuthError('');
    const { data, error } = await callAdmin<{ ok: boolean }>(pwd, 'verify');
    setAuthLoading(false);
    if (error || !data?.ok) {
      if (manualSubmit) setAuthError(error || 'Password salah');
      sessionStorage.removeItem('palmtrees-admin-pwd');
      return;
    }
    sessionStorage.setItem('palmtrees-admin-pwd', pwd);
    setPassword(pwd);
    setAuthed(true);
    loadPosts(pwd);
  };

  const loadPosts = async (pwd: string) => {
    setLoading(true);
    const { data, error } = await callAdmin<{ posts: BlogPost[] }>(pwd, 'list');
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }
    setPosts(data?.posts ?? []);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword(password.trim());
  };

  const logout = () => {
    sessionStorage.removeItem('palmtrees-admin-pwd');
    setAuthed(false);
    setPassword('');
    setPosts([]);
  };

  const startNew = () => {
    setEditing({ ...emptyPost, published_at: new Date().toISOString().slice(0, 16) });
    setMessage(null);
  };

  const startEdit = (p: BlogPost) => {
    setEditing({ ...p, published_at: p.published_at?.slice(0, 16) });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title_id || !editing.title_en) {
      setMessage({ type: 'error', text: 'Judul ID & EN wajib diisi' });
      return;
    }
    setSaving(true);
    const payload = {
      ...editing,
      slug: editing.slug?.trim() || slugify(editing.title_id),
      published_at: editing.published_at ? new Date(editing.published_at).toISOString() : new Date().toISOString(),
    };
    const action = editing.id ? 'update' : 'create';
    const args = editing.id ? { id: editing.id, post: payload } : { post: payload };
    const { error } = await callAdmin(password, action, args);
    setSaving(false);
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }
    setMessage({ type: 'success', text: editing.id ? 'Artikel diperbarui' : 'Artikel dibuat' });
    setEditing(null);
    loadPosts(password);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini? Tindakan ini tidak bisa dibatalkan.')) return;
    const { error } = await callAdmin(password, 'delete', { id });
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }
    setMessage({ type: 'success', text: 'Artikel dihapus' });
    loadPosts(password);
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full border border-[#8B5E3C]/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8B5E3C] flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-quicksand font-bold text-2xl text-[#8B5E3C] mb-2">Admin Blog</h1>
              <p className="text-sm text-[#8B5E3C]/75">Masukkan password untuk mengelola artikel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password admin"
                  required
                  autoFocus
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] bg-[#F5F0E6]/50"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]/60 hover:text-[#7A9A01]">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <div className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{authError}</div>
              )}
              <button type="submit" disabled={authLoading} className="btn-bounce w-full bg-[#7A9A01] hover:bg-[#8B5E3C] text-white font-bold py-3 rounded-full shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Masuk
              </button>
            </form>

            <p className="text-xs text-[#8B5E3C]/60 mt-6 text-center">
              Default password: <code className="bg-[#F5F0E6] px-1.5 py-0.5 rounded">palmtrees2025</code>
              <br />Set <code className="bg-[#F5F0E6] px-1.5 py-0.5 rounded">BLOG_ADMIN_PASSWORD</code> di Supabase secrets untuk mengubahnya.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Editor view
  if (editing) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-[#8B5E3C]/10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#8B5E3C]/10">
              <div className="flex items-center gap-3">
                <button onClick={() => setEditing(null)} className="text-[#8B5E3C] hover:text-[#7A9A01]"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="font-quicksand font-bold text-2xl text-[#8B5E3C]">
                  {editing.id ? 'Edit Artikel' : 'Artikel Baru'}
                </h1>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full text-sm font-semibold text-[#8B5E3C] hover:bg-[#F5F0E6] flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Batal
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-bounce px-5 py-2 rounded-full text-sm font-bold bg-[#7A9A01] hover:bg-[#8B5E3C] text-white flex items-center gap-1.5 disabled:opacity-60 shadow">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
              </div>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-[#7A9A01]/15 text-[#7A9A01]' : 'bg-red-100 text-red-700'}`}>{message.text}</div>
            )}

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Judul (Indonesia)" required>
                  <input value={editing.title_id ?? ''} onChange={(e) => setEditing({ ...editing, title_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm" />
                </Field>
                <Field label="Title (English)" required>
                  <input value={editing.title_en ?? ''} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm" />
                </Field>
              </div>

              <Field label="Slug (URL)" hint="Kosongkan untuk auto-generate dari judul">
                <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder={editing.title_id ? slugify(editing.title_id) : 'contoh-slug-artikel'} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm font-mono" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Ringkasan (ID)">
                  <textarea rows={2} value={editing.excerpt_id ?? ''} onChange={(e) => setEditing({ ...editing, excerpt_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm" />
                </Field>
                <Field label="Excerpt (EN)">
                  <textarea rows={2} value={editing.excerpt_en ?? ''} onChange={(e) => setEditing({ ...editing, excerpt_en: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Isi Artikel (Indonesia)" hint="Markdown didukung: **bold**, ## judul, - daftar">
                  <textarea rows={10} value={editing.body_id ?? ''} onChange={(e) => setEditing({ ...editing, body_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm font-mono" />
                </Field>
                <Field label="Article Body (English)" hint="Markdown supported: **bold**, ## heading, - list">
                  <textarea rows={10} value={editing.body_en ?? ''} onChange={(e) => setEditing({ ...editing, body_en: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm font-mono" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Kategori">
                  <select value={editing.category ?? 'Tips Parenting'} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm bg-white">
                    {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Penulis">
                  <input value={editing.author ?? ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm" />
                </Field>
                <Field label="Tanggal Publikasi">
                  <input type="datetime-local" value={editing.published_at?.slice(0, 16) ?? ''} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm" />
                </Field>
              </div>

              <Field label="URL Gambar Sampul" hint="Tempel URL gambar dari sumber mana saja">
                <input value={editing.featured_image ?? ''} onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:border-[#7A9A01] text-sm" />
                {editing.featured_image && (
                  <img src={editing.featured_image} alt="" className="mt-2 w-full max-w-sm rounded-xl border border-[#8B5E3C]/10" />
                )}
              </Field>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="w-4 h-4 accent-[#7A9A01]" />
                <span className="text-sm font-semibold text-[#8B5E3C]">Tampilkan di blog publik</span>
              </label>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="font-quicksand font-bold text-3xl sm:text-4xl text-[#8B5E3C]">Admin Blog</h1>
              <p className="text-sm text-[#8B5E3C]/75">Kelola artikel Palmtrees Montessori</p>
            </div>
            <div className="flex gap-2">
              <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-[#8B5E3C] hover:bg-white/60 rounded-full">Keluar</button>
              <button onClick={startNew} className="btn-bounce inline-flex items-center gap-2 bg-[#7A9A01] hover:bg-[#8B5E3C] text-white font-bold px-5 py-2.5 rounded-full shadow">
                <Plus className="w-4 h-4" /> Artikel Baru
              </button>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-[#7A9A01]/15 text-[#7A9A01]' : 'bg-red-100 text-red-700'}`}>{message.text}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#7A9A01] animate-spin" /></div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#8B5E3C]/10">
              <p className="text-[#8B5E3C]/75 mb-4">Belum ada artikel.</p>
              <button onClick={startNew} className="btn-bounce bg-[#7A9A01] text-white px-5 py-2.5 rounded-full font-bold">Buat artikel pertama</button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className={`bg-white rounded-2xl p-4 sm:p-5 border border-[#8B5E3C]/10 hover:border-[#7A9A01]/40 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 ${!p.is_published ? 'opacity-70' : ''}`}>
                  {p.featured_image && (
                    <img src={p.featured_image} alt="" className="w-full sm:w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7A9A01] bg-[#7A9A01]/10 px-2 py-0.5 rounded-full">{p.category}</span>
                      {!p.is_published && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Draft</span>}
                      <span className="text-xs text-[#8B5E3C]/60">{new Date(p.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-quicksand font-bold text-base text-[#8B5E3C] truncate">{p.title_id}</h3>
                    <div className="text-xs text-[#8B5E3C]/60 truncate">/{p.slug}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link to={`/id/blog/${p.slug}`} target="_blank" className="px-3 py-2 text-xs font-bold rounded-full bg-[#F5F0E6] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition-colors">Preview</Link>
                    <button onClick={() => startEdit(p)} className="p-2 rounded-full bg-[#F5F0E6] text-[#7A9A01] hover:bg-[#7A9A01] hover:text-white transition-colors" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => p.id && handleDelete(p.id)} className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-[#8B5E3C] mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-[#8B5E3C]/60 mt-1">{hint}</p>}
  </div>
);

export default function AdminBlog() {
  return (
    <LanguageProvider initialLang="id">
      <AdminPanel />
    </LanguageProvider>
  );
}
