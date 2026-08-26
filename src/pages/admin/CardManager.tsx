import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Save, Loader as Loader2, Plus, Trash2, CircleAlert as AlertCircle, GripVertical, Instagram, Link2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { SiteCardRow } from '@/hooks/useSiteContent';

interface CardTypeConfig {
  label: string;
  titleLabel: string;
  descLabel: string;
  showImage: boolean;
  showExtra: boolean;
  extraLabel: string;
}

const CARD_TYPES: Record<string, CardTypeConfig> = {
  teacher: { label: 'Guru / Teachers', titleLabel: 'Nama Guru', descLabel: 'Bio singkat', showImage: true, showExtra: true, extraLabel: 'Role / Jabatan' },
  testimonial: { label: 'Testimoni', titleLabel: 'Nama Orang Tua', descLabel: 'Quote', showImage: false, showExtra: true, extraLabel: 'Info anak (mis: Mama dari Alea, 4 th)' },
  facility: { label: 'Fasilitas', titleLabel: 'Nama Ruangan', descLabel: 'Deskripsi', showImage: true, showExtra: false, extraLabel: '' },
  program: { label: 'Program', titleLabel: 'Nama Program', descLabel: 'Deskripsi', showImage: true, showExtra: true, extraLabel: 'Rentang Usia' },
  faq: { label: 'FAQ', titleLabel: 'Pertanyaan', descLabel: 'Jawaban', showImage: false, showExtra: false, extraLabel: '' },
  admission_step: { label: 'Langkah Pendaftaran', titleLabel: 'Nama Langkah', descLabel: 'Deskripsi', showImage: false, showExtra: false, extraLabel: '' },
  advantage: { label: 'Keunggulan Montessori', titleLabel: 'Judul', descLabel: 'Deskripsi', showImage: false, showExtra: false, extraLabel: '' },
  pillar: { label: 'Pilar Inklusi', titleLabel: 'Judul', descLabel: 'Deskripsi', showImage: false, showExtra: false, extraLabel: '' },
  reason: { label: 'Alasan (Inklusi)', titleLabel: 'Alasan (ID)', descLabel: 'Alasan (EN)', showImage: false, showExtra: false, extraLabel: '' },
  day_rhythm: { label: 'Ritme Harian', titleLabel: 'Aktivitas', descLabel: 'Deskripsi (opsional)', showImage: false, showExtra: true, extraLabel: 'Waktu (mis: 08:00)' },
  ceo_message: { label: 'Pesan CEO', titleLabel: 'Judul (opsional)', descLabel: 'Paragraf', showImage: false, showExtra: false, extraLabel: '' },
  instagram: { label: 'Instagram Posts', titleLabel: 'Caption', descLabel: 'Caption (EN)', showImage: true, showExtra: false, extraLabel: '' },
};

export default function CardManager({ cardType }: { cardType: string }) {
  const queryClient = useQueryClient();
  const config = CARD_TYPES[cardType] ?? { label: cardType, titleLabel: 'Title', descLabel: 'Description', showImage: false, showExtra: false, extraLabel: '' };
  const [rows, setRows] = useState<SiteCardRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Partial<SiteCardRow>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState<Partial<SiteCardRow>>({ title_id: '', title_en: '', desc_id: '', desc_en: '', image_url: '', extra_id: '', extra_en: '' });
  const [igUrl, setIgUrl] = useState('');
  const [fetchingIg, setFetchingIg] = useState(false);
  const isInstagram = cardType === 'instagram';

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_cards')
      .select('*')
      .eq('card_type', cardType)
      .order('sort_order');
    setLoading(false);
    if (error) { showToast('error', error.message); return; }
    setRows((data ?? []) as SiteCardRow[]);
    setDrafts({});
  };

  useEffect(() => { load(); }, [cardType]);

  const getDraft = (row: SiteCardRow): Partial<SiteCardRow> => drafts[row.id] ?? {};
  const isDirty = (row: SiteCardRow) => {
    const d = getDraft(row);
    return (
      (d.title_id ?? row.title_id) !== row.title_id ||
      (d.title_en ?? row.title_en) !== row.title_en ||
      (d.desc_id ?? row.desc_id) !== row.desc_id ||
      (d.desc_en ?? row.desc_en) !== row.desc_en ||
      (d.image_url ?? row.image_url ?? '') !== (row.image_url ?? '') ||
      (d.extra_id ?? row.extra_id ?? '') !== (row.extra_id ?? '') ||
      (d.extra_en ?? row.extra_en ?? '') !== (row.extra_en ?? '')
    );
  };

  const handleSave = async (row: SiteCardRow) => {
    const d = getDraft(row);
    const updates = {
      title_id: d.title_id ?? row.title_id,
      title_en: d.title_en ?? row.title_en,
      desc_id: d.desc_id ?? row.desc_id,
      desc_en: d.desc_en ?? row.desc_en,
      image_url: d.image_url ?? row.image_url,
      extra_id: d.extra_id ?? row.extra_id,
      extra_en: d.extra_en ?? row.extra_en,
    };
    setSaving(row.id);
    const { error } = await supabase.from('site_cards').update(updates).eq('id', row.id);
    setSaving(null);
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, ...updates } : r));
    setDrafts((prev) => { const n = { ...prev }; delete n[row.id]; return n; });
    queryClient.invalidateQueries({ queryKey: ['site-cards'] });
    showToast('success', 'Berhasil disimpan');
  };

  const handleDelete = async (row: SiteCardRow) => {
    if (!confirm(`Hapus "${row.title_id || row.title_en}"?`)) return;
    const { error } = await supabase.from('site_cards').delete().eq('id', row.id);
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    queryClient.invalidateQueries({ queryKey: ['site-cards'] });
    showToast('success', 'Dihapus');
  };

  const handleToggleActive = async (row: SiteCardRow) => {
    const { error } = await supabase.from('site_cards').update({ is_active: !row.is_active }).eq('id', row.id);
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, is_active: !r.is_active } : r));
    queryClient.invalidateQueries({ queryKey: ['site-cards'] });
  };

  const handleAdd = async () => {
    const maxOrder = rows.reduce((max, r) => Math.max(max, r.sort_order), -1) + 1;
    const { data, error } = await supabase
      .from('site_cards')
      .insert({
        card_type: cardType,
        title_id: newCard.title_id || '',
        title_en: newCard.title_en || newCard.title_id || '',
        desc_id: newCard.desc_id || '',
        desc_en: newCard.desc_en || newCard.desc_id || '',
        image_url: newCard.image_url || null,
        extra_id: newCard.extra_id || null,
        extra_en: newCard.extra_en || newCard.extra_id || null,
        sort_order: maxOrder,
        is_active: true,
      })
      .select('*')
      .single();
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => [...prev, data as SiteCardRow]);
    setNewCard({ title_id: '', title_en: '', desc_id: '', desc_en: '', image_url: '', extra_id: '', extra_en: '' });
    setShowAdd(false);
    queryClient.invalidateQueries({ queryKey: ['site-cards'] });
    showToast('success', 'Ditambahkan');
  };

  const updateDraft = (id: string, field: keyof SiteCardRow, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const fetchInstagramPost = async (url: string): Promise<{ image_url: string; caption: string } | null> => {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/instagram-fetch`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Gagal mengambil data (${response.status})`);
    }
    const data = await response.json();
    if (!data.image_url) throw new Error('Gambar tidak ditemukan di post tersebut');
    return { image_url: data.image_url, caption: data.caption || '' };
  };

  const handleFetchAndAdd = async () => {
    if (!igUrl.trim()) { showToast('error', 'Masukkan link Instagram post'); return; }
    setFetchingIg(true);
    try {
      const post = await fetchInstagramPost(igUrl.trim());
      if (!post) throw new Error('Gagal mengambil data');
      const maxOrder = rows.reduce((max, r) => Math.max(max, r.sort_order), -1) + 1;
      const { data, error } = await supabase.from('site_cards').insert({
        card_type: cardType,
        title_id: post.caption,
        title_en: post.caption,
        desc_id: igUrl.trim(),
        desc_en: igUrl.trim(),
        image_url: post.image_url,
        extra_id: null,
        extra_en: null,
        sort_order: maxOrder,
        is_active: true,
      }).select('*').single();
      if (error) throw new Error(error.message);
      setRows((prev) => [...prev, data as SiteCardRow]);
      setIgUrl('');
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ['site-cards'] });
      showToast('success', 'Foto Instagram berhasil ditambahkan');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Gagal mengambil data');
    } finally {
      setFetchingIg(false);
    }
  };

  return (
    <AdminLayout title={config.label} breadcrumb="Panel Admin">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-[#7A9A01] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Kelola konten {config.label.toLowerCase()} dalam dua bahasa.</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {showAdd && isInstagram ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Tambah dari Instagram</h3>
          <p className="text-xs text-slate-500 mb-4">Tempel link post Instagram, gambar akan diambil otomatis.</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={igUrl}
                onChange={(e) => setIgUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/XXXXXXX"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <button
              onClick={handleFetchAndAdd}
              disabled={fetchingIg}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-[#7A9A01] hover:bg-[#6a8a01] text-white disabled:opacity-40 whitespace-nowrap"
            >
              {fetchingIg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Instagram className="w-4 h-4" />}
              {fetchingIg ? 'Mengambil...' : 'Ambil Foto'}
            </button>
          </div>
          <button onClick={() => setShowAdd(false)} className="mt-3 text-sm font-semibold px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">Batal</button>
        </div>
      ) : showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Tambah Baru</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.titleLabel} (ID)</label>
              <input value={newCard.title_id ?? ''} onChange={(e) => setNewCard({ ...newCard, title_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.titleLabel} (EN)</label>
              <input value={newCard.title_en ?? ''} onChange={(e) => setNewCard({ ...newCard, title_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.descLabel} (ID)</label>
              <textarea rows={2} value={newCard.desc_id ?? ''} onChange={(e) => setNewCard({ ...newCard, desc_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.descLabel} (EN)</label>
              <textarea rows={2} value={newCard.desc_en ?? ''} onChange={(e) => setNewCard({ ...newCard, desc_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            {config.showExtra && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.extraLabel} (ID)</label>
                  <input value={newCard.extra_id ?? ''} onChange={(e) => setNewCard({ ...newCard, extra_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.extraLabel} (EN)</label>
                  <input value={newCard.extra_en ?? ''} onChange={(e) => setNewCard({ ...newCard, extra_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                </div>
              </>
            )}
            {config.showImage && (
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">URL Gambar</label>
                <input value={newCard.image_url ?? ''} onChange={(e) => setNewCard({ ...newCard, image_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-[#7A9A01] hover:bg-[#6a8a01] text-white">
              <Plus className="w-4 h-4" /> Simpan
            </button>
            <button onClick={() => setShowAdd(false)} className="text-sm font-semibold px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">Batal</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7A9A01] animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {rows.map((row) => {
            const d = getDraft(row);
            const dirty = isDirty(row);
            const isSaving = saving === row.id;
            return (
              <div key={row.id} className={`bg-white rounded-2xl border p-5 ${row.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60'}`}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-300" />
                    {isInstagram && row.image_url && (
                      <img src={row.image_url} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                    )}
                    <span className="text-sm font-semibold text-slate-800">
                      {row.title_id || row.title_en || `Item #${row.sort_order + 1}`}
                    </span>
                    {!row.is_active && (
                      <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Sembunyikan</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isInstagram && row.desc_id && (
                      <a href={row.desc_id} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-2 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 inline-flex items-center gap-1">
                        <Instagram className="w-3 h-3" /> Lihat Post
                      </a>
                    )}
                    <button
                      onClick={() => handleToggleActive(row)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      {row.is_active ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                    <button onClick={() => handleDelete(row)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isInstagram ? (
                  <div className="space-y-3">
                    {row.image_url && (
                      <img src={d.image_url ?? row.image_url} alt="" className="w-full max-w-xs rounded-xl object-cover border border-slate-200" />
                    )}
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Caption</label>
                      <input
                        value={d.title_id ?? row.title_id}
                        onChange={(e) => { updateDraft(row.id, 'title_id', e.target.value); updateDraft(row.id, 'title_en', e.target.value); }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Link Post</label>
                      <input
                        value={d.desc_id ?? row.desc_id ?? ''}
                        onChange={(e) => { updateDraft(row.id, 'desc_id', e.target.value); updateDraft(row.id, 'desc_en', e.target.value); }}
                        placeholder="https://www.instagram.com/p/..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">URL Gambar (otomatis)</label>
                      <input
                        value={d.image_url ?? row.image_url ?? ''}
                        onChange={(e) => updateDraft(row.id, 'image_url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                      />
                    </div>
                  </div>
                ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.titleLabel} (ID)</label>
                    <input
                      value={d.title_id ?? row.title_id}
                      onChange={(e) => updateDraft(row.id, 'title_id', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.titleLabel} (EN)</label>
                    <input
                      value={d.title_en ?? row.title_en}
                      onChange={(e) => updateDraft(row.id, 'title_en', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.descLabel} (ID)</label>
                    <textarea
                      rows={3}
                      value={d.desc_id ?? row.desc_id}
                      onChange={(e) => updateDraft(row.id, 'desc_id', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.descLabel} (EN)</label>
                    <textarea
                      rows={3}
                      value={d.desc_en ?? row.desc_en}
                      onChange={(e) => updateDraft(row.id, 'desc_en', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  {config.showExtra && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.extraLabel} (ID)</label>
                        <input
                          value={d.extra_id ?? row.extra_id ?? ''}
                          onChange={(e) => updateDraft(row.id, 'extra_id', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">{config.extraLabel} (EN)</label>
                        <input
                          value={d.extra_en ?? row.extra_en ?? ''}
                          onChange={(e) => updateDraft(row.id, 'extra_en', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                    </>
                  )}
                  {config.showImage && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">URL Gambar</label>
                      <div className="flex gap-3 items-start">
                        {row.image_url && (
                          <img src={d.image_url ?? row.image_url ?? ''} alt="" className="w-20 h-20 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                        )}
                        <input
                          value={d.image_url ?? row.image_url ?? ''}
                          onChange={(e) => updateDraft(row.id, 'image_url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
                )}

                {dirty && (
                  <button
                    onClick={() => handleSave(row)}
                    disabled={isSaving}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Simpan Perubahan
                  </button>
                )}
              </div>
            );
          })}
          {rows.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <p>Belum ada data. Klik "Tambah" untuk mulai.</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
