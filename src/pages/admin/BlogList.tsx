import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard as Edit3, Trash2, Eye, EyeOff, Loader as Loader2, Search, CircleAlert as AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/lib/blog';

export default function AdminBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    setLoading(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    setPosts((data ?? []) as BlogPost[]);
  };

  useEffect(() => { load(); }, []);

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ is_published: !post.is_published, updated_at: new Date().toISOString() })
      .eq('id', post.id);
    if (error) { showToast('error', error.message); return; }
    showToast('success', post.is_published ? 'Artikel disembunyikan' : 'Artikel dipublikasikan');
    load();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { showToast('error', error.message); return; }
    showToast('success', 'Artikel dihapus');
    load();
  };

  const filtered = posts.filter((p) =>
    search === '' ||
    p.title_id.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Artikel Blog" breadcrumb="Panel Admin">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-[#7A9A01] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm"
          />
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Artikel Baru
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7A9A01] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">{search ? 'Tidak ada artikel yang cocok.' : 'Belum ada artikel.'}</p>
          {!search && (
            <Link to="/admin/blog/new" className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-4 py-2.5 rounded-xl text-sm">
              <Plus className="w-4 h-4" />
              Buat artikel pertama
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Artikel</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {post.featured_image && (
                        <img src={post.featured_image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs">{post.title_id}</div>
                        <div className="text-xs text-slate-400 font-mono">/{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#7A9A01]/10 text-[#4a5e00]">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                    {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      post.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.is_published ? 'Publik' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/id/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => togglePublish(post)}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title={post.is_published ? 'Sembunyikan' : 'Publikasikan'}
                      >
                        {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-[#7A9A01] hover:bg-[#7A9A01]/10 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title_id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3">{filtered.length} artikel ditampilkan</p>
    </AdminLayout>
  );
}
