import { useEffect, useState } from 'react';
import { Save, Loader as Loader2, Plus, Trash2, CircleAlert as AlertCircle, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { SiteImageRow } from '@/hooks/useSiteContent';

interface NewImage {
  page_key: string;
  section_key: string;
  image_url: string;
  label: string;
}

const PAGE_OPTIONS = [
  { value: 'global', label: 'Global (Logo, CEO, Building)' },
  { value: 'home', label: 'Homepage' },
  { value: 'about', label: 'About Us' },
  { value: 'programs', label: 'Programs' },
  { value: 'montessori', label: 'Montessori Method' },
  { value: 'inclusion', label: 'Inclusion Program' },
  { value: 'admission', label: 'Admission' },
  { value: 'contact', label: 'Contact' },
];

export default function ImageManager() {
  const [rows, setRows] = useState<SiteImageRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newImg, setNewImg] = useState<NewImage>({ page_key: 'home', section_key: '', image_url: '', label: '' });

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .order('page_key')
      .order('section_key')
      .order('sort_order');
    setLoading(false);
    if (error) { showToast('error', error.message); return; }
    const loaded = (data ?? []) as SiteImageRow[];
    setRows(loaded);
    const map: Record<string, string> = {};
    loaded.forEach((r) => { map[r.id] = r.image_url; });
    setDrafts(map);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (row: SiteImageRow) => {
    const newUrl = drafts[row.id] ?? row.image_url;
    setSaving(row.id);
    const { error } = await supabase.from('site_images').update({ image_url: newUrl }).eq('id', row.id);
    setSaving(null);
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, image_url: newUrl } : r));
    showToast('success', 'Gambar berhasil diperbarui');
  };

  const handleDelete = async (row: SiteImageRow) => {
    if (!confirm(`Hapus "${row.label}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    const { error } = await supabase.from('site_images').delete().eq('id', row.id);
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    showToast('success', 'Gambar dihapus');
  };

  const handleAdd = async () => {
    if (!newImg.section_key || !newImg.image_url) {
      showToast('error', 'Section dan URL gambar wajib diisi');
      return;
    }
    const maxOrder = rows
      .filter((r) => r.page_key === newImg.page_key && r.section_key === newImg.section_key)
      .reduce((max, r) => Math.max(max, r.sort_order), -1) + 1;
    const { data, error } = await supabase
      .from('site_images')
      .insert({
        page_key: newImg.page_key,
        section_key: newImg.section_key,
        image_url: newImg.image_url,
        label: newImg.label || `${newImg.section_key} ${maxOrder + 1}`,
        sort_order: maxOrder,
      })
      .select('*')
      .single();
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => [...prev, data as SiteImageRow]);
    setNewImg({ page_key: 'home', section_key: '', image_url: '', label: '' });
    setShowAdd(false);
    showToast('success', 'Gambar ditambahkan');
  };

  const isDirty = (row: SiteImageRow) => (drafts[row.id] ?? row.image_url) !== row.image_url;

  const pageGroups = rows.reduce<Record<string, SiteImageRow[]>>((acc, row) => {
    (acc[row.page_key] ??= []).push(row);
    return acc;
  }, {});

  return (
    <AdminLayout title="Kelola Gambar" breadcrumb="Panel Admin">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-[#7A9A01] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Kelola semua gambar yang tampil di website. Tempel URL gambar baru untuk mengganti.</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Tambah Gambar
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Tambah Gambar Baru</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Halaman</label>
              <select
                value={newImg.page_key}
                onChange={(e) => setNewImg({ ...newImg, page_key: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
              >
                {PAGE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Section Key</label>
              <input
                value={newImg.section_key}
                onChange={(e) => setNewImg({ ...newImg, section_key: e.target.value })}
                placeholder="contoh: hero_slides"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Label (opsional)</label>
              <input
                value={newImg.label}
                onChange={(e) => setNewImg({ ...newImg, label: e.target.value })}
                placeholder="contoh: Hero Slide 4"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">URL Gambar</label>
              <input
                value={newImg.image_url}
                onChange={(e) => setNewImg({ ...newImg, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-[#7A9A01] hover:bg-[#6a8a01] text-white">
              <Plus className="w-4 h-4" /> Simpan
            </button>
            <button onClick={() => setShowAdd(false)} className="text-sm font-semibold px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
              Batal
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7A9A01] animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(pageGroups).map(([pageKey, pageRows]) => (
            <div key={pageKey}>
              <h2 className="text-base font-bold text-slate-800 mb-3">
                {PAGE_OPTIONS.find((p) => p.value === pageKey)?.label ?? pageKey}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pageRows.map((row) => {
                  const dirty = isDirty(row);
                  const isSaving = saving === row.id;
                  return (
                    <div key={row.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="aspect-video bg-slate-100 relative">
                        <img src={drafts[row.id] ?? row.image_url} alt={row.label} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{row.label}</div>
                            <div className="text-xs text-slate-400">{row.section_key} · #{row.sort_order}</div>
                          </div>
                          <button
                            onClick={() => handleDelete(row)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          value={drafts[row.id] ?? row.image_url}
                          onChange={(e) => setDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))}
                          placeholder="URL gambar"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                        />
                        {dirty && (
                          <button
                            onClick={() => handleSave(row)}
                            disabled={isSaving}
                            className="mt-2 w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40"
                          >
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Simpan Perubahan
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3" />
              <p>Belum ada gambar. Klik "Tambah Gambar" untuk mulai.</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
